#!/usr/bin/env node

/**
 * Control Value Shape Validator
 *
 * Ensures scalar controls don't use object values with string payloads
 * (e.g. { value: "100%" }) which can break numeric parsing in the editor.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');

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

function recordError(errors, block, attribute, message, fix) {
	errors.push({ block, attribute, message, fix });
}

function isValueObject(value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

function checkValueObject(errors, block, attrName, value, context) {
	if (!isValueObject(value)) {
		return;
	}

	if (typeof value.value === 'string') {
		recordError(
			errors,
			block,
			attrName,
			`${context} has string payload in { value }`,
			'Use a numeric value and keep units in { unit }'
		);
	}

	[ 'tablet', 'mobile' ].forEach((device) => {
		const deviceValue = value[device];
		if (isValueObject(deviceValue) && typeof deviceValue.value === 'string') {
			recordError(
				errors,
				block,
				attrName,
				`${context}.${device} has string payload in { value }`,
				'Use a numeric value and keep units in { unit }'
			);
		}
	});
}

function validateSchema(schemaName, schema, errors) {
	const attributes = schema.attributes || {};

	for (const [attrName, attr] of Object.entries(attributes)) {
		if (!SCALAR_CONTROLS.has(attr.control)) {
			continue;
		}

		if (attr.default === undefined) {
			continue;
		}

		checkValueObject(errors, schemaName, attrName, attr.default, 'default');
	}
}

function main() {
	const schemas = loadSchemas();
	const errors = [];

	schemas.forEach(({ name, data }) => validateSchema(name, data, errors));

	if (errors.length > 0) {
		console.error(`\n${colors.red}${colors.bold}✗ Control value validation failed${colors.reset}\n`);
		errors.forEach((err) => {
			console.error(
				`  ${colors.red}${err.block}/${err.attribute}${colors.reset}: ${err.message}`
			);
			console.error(`    ${colors.yellow}Fix:${colors.reset} ${err.fix}\n`);
		});
		process.exit(1);
	}

	console.log(`${colors.green}${colors.bold}✓ Control value shapes validated${colors.reset}`);
}

main();
