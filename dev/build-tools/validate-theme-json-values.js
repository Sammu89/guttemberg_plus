#!/usr/bin/env node

/**
 * Theme JSON Value Validator
 *
 * Scans exported theme JSON files and flags scalar control values stored as
 * objects with string payloads (e.g. { value: "100%" }).
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const SCHEMAS_DIR = path.join(ROOT, 'schemas');

const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

const SCALAR_CONTROLS = new Set([ 'SliderWithInput', 'RangeControl' ]);
const NUMERIC_WITH_UNIT_REGEX = /^-?\d+(?:\.\d+)?\s*[a-zA-Z%]+$/;
const NUMERIC_ONLY_REGEX = /^-?\d+(?:\.\d+)?$/;

function isSchemaFile(file) {
	return file.endsWith('.json') && !file.includes('structure');
}

function loadSchemas() {
	return fs
		.readdirSync(SCHEMAS_DIR)
		.filter(isSchemaFile)
		.map((file) => {
			const fullPath = path.join(SCHEMAS_DIR, file);
			const content = fs.readFileSync(fullPath, 'utf8');
			return {
				name: path.basename(file, '.json'),
				data: JSON.parse(content),
			};
		});
}

function isNumeric(value) {
	return typeof value === 'number' && Number.isFinite(value);
}

function isNumericString(value) {
	if (typeof value !== 'string') {
		return false;
	}
	const trimmed = value.trim();
	return NUMERIC_ONLY_REGEX.test(trimmed) || NUMERIC_WITH_UNIT_REGEX.test(trimmed);
}

function stringHasUnitlessNumber(value) {
	if (typeof value !== 'string') {
		return false;
	}
	const matches = value.match(/-?\d+(?:\.\d+)?[a-zA-Z%]*/g);
	if (!matches) {
		return false;
	}
	return matches.some((token) => {
		const trimmed = token.trim();
		if (!trimmed) {
			return false;
		}
		const unitMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?$/);
		if (!unitMatch) {
			return false;
		}
		const numericValue = parseFloat(unitMatch[1]);
		const unit = unitMatch[2] || '';
		if (numericValue === 0) {
			return false;
		}
		return unit === '';
	});
}

function hasUnit(value) {
	return typeof value === 'string' && value.trim() !== '';
}

function collectAttributeInfo(getPropertyScale) {
	const info = new Map();
	const schemas = loadSchemas();

	schemas.forEach(({ data }) => {
		const attrs = data.attributes || {};
		Object.entries(attrs).forEach(([attrName, attr]) => {
			const existing = info.get(attrName) || { isScalar: false, requiresUnit: false, cssProperty: null };
			if (SCALAR_CONTROLS.has(attr.control)) {
				existing.isScalar = true;
			}
			if (attr.cssProperty) {
				const scale = getPropertyScale(attr.cssProperty);
				if (scale && scale.units !== null) {
					existing.requiresUnit = true;
					existing.cssProperty = attr.cssProperty;
				}
			}
			info.set(attrName, existing);
		});
	});

	return info;
}

function resolvePath(input) {
	if (!input) {
		return null;
	}
	return path.isAbsolute(input) ? input : path.join(ROOT, input);
}

function collectJsonFilesFromDir(dirPath) {
	const files = [];
	if (!fs.existsSync(dirPath)) {
		return files;
	}
	const entries = fs.readdirSync(dirPath, { withFileTypes: true });
	entries.forEach((entry) => {
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			files.push(...collectJsonFilesFromDir(fullPath));
			return;
		}
		if (entry.isFile() && entry.name.endsWith('.json')) {
			files.push(fullPath);
		}
	});
	return files;
}

function parseArgs() {
	const args = process.argv.slice(2);
	const dirIndex = args.indexOf('--dir');
	const pathsIndex = args.indexOf('--paths');

	const dirArg = dirIndex !== -1 ? args[dirIndex + 1] : null;
	const pathsArg = pathsIndex !== -1 ? args[pathsIndex + 1] : null;

	const envDir = process.env.GUTPLUS_THEME_JSON_DIR || null;
	const envPaths = process.env.GUTPLUS_THEME_JSON_PATHS || null;

	return {
		dir: dirArg || envDir,
		paths: pathsArg || envPaths,
	};
}

function getJsonFiles({ dir, paths }) {
	const files = new Set();

	if (dir) {
		const resolvedDir = resolvePath(dir);
		collectJsonFilesFromDir(resolvedDir).forEach((file) => files.add(file));
	}

	if (paths) {
		paths
			.split(',')
			.map((entry) => entry.trim())
			.filter(Boolean)
			.map(resolvePath)
			.forEach((file) => {
				if (fs.existsSync(file) && file.endsWith('.json')) {
					files.add(file);
				}
			});
	}

	return Array.from(files);
}

function isObject(value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

function reportIssue(errors, filePath, attrName, location, message) {
	errors.push({
		filePath,
		attrName,
		location,
		message,
	});
}

function checkScalarValue(errors, filePath, attrName, value, location) {
	if (!isObject(value)) {
		return;
	}
	if (typeof value.value === 'string') {
		reportIssue(
			errors,
			filePath,
			attrName,
			`${location}.value`,
			`${attrName} uses string payload in { value }`
		);
	}
	[ 'tablet', 'mobile' ].forEach((device) => {
		const deviceValue = value[device];
		if (isObject(deviceValue) && typeof deviceValue.value === 'string') {
			reportIssue(
				errors,
				filePath,
				attrName,
				`${location}.${device}.value`,
				`${attrName}.${device} uses string payload in { value }`
			);
		}
	});
}

function valueNeedsUnit(value) {
	if (value === null || value === undefined) {
		return false;
	}
	if (isNumeric(value)) {
		return value !== 0;
	}
	if (typeof value === 'string') {
		if (!isNumericString(value)) {
			return false;
		}
		const trimmed = value.trim();
		if (NUMERIC_ONLY_REGEX.test(trimmed)) {
			return parseFloat(trimmed) !== 0;
		}
		return false;
	}
	if (isObject(value) && value.value !== undefined) {
		return valueNeedsUnit(value.value);
	}
	return false;
}

function checkUnitRequirement(errors, filePath, attrName, value, location) {
	if (value === null || value === undefined) {
		return;
	}

	if (typeof value === 'string') {
		if (stringHasUnitlessNumber(value)) {
			reportIssue(
				errors,
				filePath,
				attrName,
				location,
				`${attrName} contains unitless numbers for a unit-based property`
			);
		}
		return;
	}

	if (isNumeric(value)) {
		if (value !== 0) {
			reportIssue(
				errors,
				filePath,
				attrName,
				location,
				`${attrName} is numeric without a unit`
			);
		}
		return;
	}

	if (isObject(value)) {
		if (value.value !== undefined) {
			if (valueNeedsUnit(value.value) && !hasUnit(value.unit)) {
				reportIssue(
					errors,
					filePath,
					attrName,
					`${location}.unit`,
					`${attrName} is missing unit for a numeric value`
				);
			}
		}

		if (value.top !== undefined || value.right !== undefined || value.bottom !== undefined || value.left !== undefined) {
			const sides = [ 'top', 'right', 'bottom', 'left' ];
			const needsUnit = sides.some((side) => valueNeedsUnit(value[side]));
			if (needsUnit && !hasUnit(value.unit)) {
				reportIssue(
					errors,
					filePath,
					attrName,
					`${location}.unit`,
					`${attrName} is missing unit for box values`
				);
			}
		}

		[ 'tablet', 'mobile' ].forEach((device) => {
			if (value[device] !== undefined) {
				checkUnitRequirement(
					errors,
					filePath,
					attrName,
					value[device],
					`${location}.${device}`
				);
			}
		});
	}
}

function walkJson(node, pathSegments, filePath, attrInfo, errors) {
	if (Array.isArray(node)) {
		node.forEach((item, index) => {
			walkJson(item, pathSegments.concat(`[${index}]`), filePath, attrInfo, errors);
		});
		return;
	}

	if (!isObject(node)) {
		return;
	}

	Object.entries(node).forEach(([key, value]) => {
		const nextPath = pathSegments.concat(key);
		const location = nextPath.join('.');
		const info = attrInfo.get(key);

		if (info?.isScalar) {
			checkScalarValue(errors, filePath, key, value, location);
		}

		if (info?.requiresUnit) {
			checkUnitRequirement(errors, filePath, key, value, location);
		}

		walkJson(value, nextPath, filePath, attrInfo, errors);
	});
}

async function main() {
	const args = parseArgs();
	const files = getJsonFiles(args);

	if (files.length === 0) {
		console.log('No theme JSON files provided. Set GUTPLUS_THEME_JSON_DIR or GUTPLUS_THEME_JSON_PATHS.');
		process.exit(0);
	}

	const { getPropertyScale } = await import(
		pathToFileURL(path.join(ROOT, 'shared/src/config/css-property-scales.mjs')).href
	);
	const attrInfo = collectAttributeInfo(getPropertyScale);
	const errors = [];

	files.forEach((filePath) => {
		try {
			const content = fs.readFileSync(filePath, 'utf8');
			const data = JSON.parse(content);
			walkJson(data, [], filePath, attrInfo, errors);
		} catch (error) {
			errors.push({
				filePath,
				attrName: 'parse',
				location: '',
				message: `Failed to parse JSON: ${error.message}`,
			});
		}
	});

	if (errors.length > 0) {
		console.error(`\n${colors.red}${colors.bold}✗ Theme JSON validation failed${colors.reset}\n`);
		errors.forEach((err) => {
			console.error(
				`  ${colors.red}${err.filePath}${colors.reset}: ${err.message}`
			);
			console.error(`    ${colors.yellow}Location:${colors.reset} ${err.location}\n`);
		});
		process.exit(1);
	}

	console.log(`${colors.green}${colors.bold}✓ Theme JSON values validated${colors.reset}`);
}

main().catch((error) => {
	console.error(`\n${colors.red}${colors.bold}✗ Theme JSON validation failed${colors.reset}\n`);
	console.error(error);
	process.exit(1);
});
