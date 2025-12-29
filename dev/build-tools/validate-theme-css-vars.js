#!/usr/bin/env node

/**
 * Theme CSS Variable Validator
 *
 * Scans theme CSS output and flags unitless numeric values for CSS vars
 * that represent unit-based properties (padding, margin, border-width, etc).
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');

const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function resolvePath(input) {
	if (!input) {
		return null;
	}
	return path.isAbsolute(input) ? input : path.join(ROOT, input);
}

function collectFiles({ dir, paths }) {
	const files = new Set();

	if (dir) {
		const resolvedDir = resolvePath(dir);
		if (resolvedDir && fs.existsSync(resolvedDir)) {
			const entries = fs.readdirSync(resolvedDir, { withFileTypes: true });
			entries.forEach((entry) => {
				const fullPath = path.join(resolvedDir, entry.name);
				if (entry.isFile() && entry.name.endsWith('.css')) {
					files.add(fullPath);
				}
			});
		}
	}

	if (paths) {
		paths
			.split(',')
			.map((entry) => entry.trim())
			.filter(Boolean)
			.map(resolvePath)
			.forEach((file) => {
				if (file && fs.existsSync(file) && file.endsWith('.css')) {
					files.add(file);
				}
			});
	}

	return Array.from(files);
}

function parseArgs() {
	const args = process.argv.slice(2);
	const dirIndex = args.indexOf('--dir');
	const pathsIndex = args.indexOf('--paths');

	const dirArg = dirIndex !== -1 ? args[dirIndex + 1] : null;
	const pathsArg = pathsIndex !== -1 ? args[pathsIndex + 1] : null;

	const envDir = process.env.GUTPLUS_THEME_CSS_DIR || null;
	const envPaths = process.env.GUTPLUS_THEME_CSS_PATHS || null;

	return { dir: dirArg || envDir, paths: pathsArg || envPaths };
}

function buildCssVarIndex(mappings, getPropertyScale) {
	const index = new Map();

	Object.values(mappings || {}).forEach((blockMappings) => {
		Object.values(blockMappings || {}).forEach((mapping) => {
			if (!mapping?.cssVar || !mapping?.cssProperty) {
				return;
			}
			const scale = getPropertyScale(mapping.cssProperty);
			if (!scale || scale.units === null) {
				return;
			}
			index.set(mapping.cssVar, { cssProperty: mapping.cssProperty });
		});
	});

	return index;
}

function resolveVarMetadata(index, cssVarName) {
	if (index.has(cssVarName)) {
		return index.get(cssVarName);
	}

	let base = cssVarName.replace(/-(tablet|mobile)$/, '');
	if (index.has(base)) {
		return index.get(base);
	}

	base = base.replace(/-(top|right|bottom|left)$/, '');
	if (index.has(base)) {
		return index.get(base);
	}

	base = base.replace(/-(top-left|top-right|bottom-right|bottom-left)$/, '');
	if (index.has(base)) {
		return index.get(base);
	}

	return null;
}

function stringHasUnitlessNumber(value) {
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

async function main() {
	const args = parseArgs();
	const files = collectFiles(args);

	if (files.length === 0) {
		console.log('No theme CSS files provided. Set GUTPLUS_THEME_CSS_DIR or GUTPLUS_THEME_CSS_PATHS.');
		return;
	}

	const [{ CSS_VAR_MAPPINGS }, { getPropertyScale }] = await Promise.all([
		import(pathToFileURL(path.join(ROOT, 'shared/src/config/css-var-mappings-generated.js')).href),
		import(pathToFileURL(path.join(ROOT, 'shared/src/config/css-property-scales.mjs')).href),
	]);

	const cssVarIndex = buildCssVarIndex(CSS_VAR_MAPPINGS, getPropertyScale);
	const errors = [];

	const varRegex = /(--[A-Za-z0-9-_]+)\s*:\s*([^;]+);/g;

	files.forEach((filePath) => {
		const content = fs.readFileSync(filePath, 'utf8');
		let match;
		while ((match = varRegex.exec(content))) {
			const cssVarName = match[1];
			const rawValue = match[2].trim();
			const metadata = resolveVarMetadata(cssVarIndex, cssVarName);

			if (!metadata) {
				continue;
			}

			if (stringHasUnitlessNumber(rawValue)) {
				errors.push({
					filePath,
					cssVarName,
					value: rawValue,
				});
			}
		}
	});

	if (errors.length > 0) {
		console.error(`\n${colors.red}${colors.bold}✗ Theme CSS variable validation failed${colors.reset}\n`);
		errors.forEach((err) => {
			console.error(`  ${colors.red}${err.filePath}${colors.reset}: ${err.cssVarName} = ${err.value}`);
		});
		process.exit(1);
	}

	console.log(`${colors.green}${colors.bold}✓ Theme CSS variables validated${colors.reset}`);
}

main().catch((error) => {
	console.error(`${colors.red}${colors.bold}✗ Theme CSS variable validation failed${colors.reset}\n`);
	console.error(error);
	process.exit(1);
});
