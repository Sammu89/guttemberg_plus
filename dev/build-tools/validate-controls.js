/**
 * Control + Schema Dependency Validator
 *
 * Catches:
 * 1) Attributes in schema groups that are missing a control (likely forgotten UI)
 * 2) SelectControl fields without options
 * 3) showWhen/disabledWhen dependencies pointing to non-existent attributes
 *
 * Exits non-zero on errors to break the build.
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

// Reasons that intentionally skip UI controls
const SKIP_REASONS = new Set(['structural', 'behavioral', 'content']);

// Known structural/non-UI attributes to avoid false positives
const KNOWN_NON_UI_ATTRS = new Set([
	// Structural IDs / data stores
	'tocId',
	'accordionId',
	'tabsId',
	'uniqueId',
	'blockId',
	'currentTheme',
	'customizations',
	'customizationCache',
	'deletedHeadingIds',
	'tocItems',
	'tabs',
	'tabsData',
]);

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

function validateDependencies(block, attrName, attr, allAttrs, errors) {
	const deps = ['showWhen', 'disabledWhen'];

	deps.forEach((depKey) => {
		const map = attr[depKey];
		if (!map || typeof map !== 'object') {
			return;
		}

		Object.keys(map).forEach((depAttr) => {
			if (!allAttrs[depAttr]) {
				recordError(
					errors,
					block,
					attrName,
					`${depKey} references missing attribute "${depAttr}"`,
					`Add "${depAttr}" to schema or remove it from ${depKey}`
				);
			}
		});
	});

	// dependsOn: attribute must exist, and variant keys should match the depended attribute's options
	if (attr.dependsOn) {
		const depAttrName = attr.dependsOn;
		const depAttr = allAttrs[depAttrName];

		if (!depAttr) {
			recordError(
				errors,
				block,
				attrName,
				`dependsOn "${depAttrName}" is not defined in the schema`,
				`Add "${depAttrName}" to schema or remove it from dependsOn`
			);
			return;
		}

		// If variants exist and the depended-on attribute has options, ensure they align
		if (attr.variants && typeof attr.variants === 'object') {
			const optionValues = Array.isArray(depAttr.options)
				? depAttr.options.map((opt) =>
						typeof opt === 'object' && opt !== null ? opt.value ?? opt.label : opt
				  )
				: [];

			if (optionValues.length > 0) {
				const variantKeys = Object.keys(attr.variants);
				const invalid = variantKeys.filter(
					(key) => key !== '_default' && !optionValues.includes(key)
				);

				if (invalid.length > 0) {
					recordError(
						errors,
						block,
						attrName,
						`variants keys [${invalid.join(', ')}] not found in options of "${depAttrName}"`,
						`Use option values from "${depAttrName}" (or add a _default variant)`
					);
				}
			}
		}
	}
}

function validateSchema(schemaName, schema, errors) {
	const attributes = schema.attributes || {};

	for (const [attrName, attr] of Object.entries(attributes)) {
		// Dependency validation
		validateDependencies(schemaName, attrName, attr, attributes, errors);

		const hasControl = Boolean(attr.control);
		const inGroup = Boolean(attr.group);
		const skipReason = attr.reason && SKIP_REASONS.has(attr.reason);
		const noCSS = attr.outputsCSS === false; // Attributes that don't output CSS don't need controls
		const knownNonUi = KNOWN_NON_UI_ATTRS.has(attrName);

		// Missing control detection (likely forgotten UI)
		if (inGroup && !hasControl && !skipReason && !noCSS && !knownNonUi) {
			recordError(
				errors,
				schemaName,
				attrName,
				'Attribute is in a UI group but has no control defined',
				`Add "control" to ${attrName} in schemas/${schemaName}.json or set "outputsCSS": false if this attribute doesn't need CSS output`
			);
		}

		// SelectControl should have options
		if (attr.control === 'SelectControl') {
			if (!Array.isArray(attr.options) || attr.options.length === 0) {
				recordError(
					errors,
					schemaName,
					attrName,
					'SelectControl has no options',
					`Add "options" array to ${attrName} in schemas/${schemaName}.json`
				);
			}
		}
	}
}

function main() {
	const schemas = loadSchemas();
	const errors = [];

	schemas.forEach(({ name, data }) => validateSchema(name, data, errors));

	if (errors.length > 0) {
		console.error(`\n${colors.red}${colors.bold}✗ Control validation failed${colors.reset}\n`);
		errors.forEach((err) => {
			console.error(
				`  ${colors.red}${err.block}/${err.attribute}${colors.reset}: ${err.message}`
			);
			console.error(`    ${colors.yellow}Fix:${colors.reset} ${err.fix}\n`);
		});
		process.exit(1);
	}

	console.log(`${colors.green}${colors.bold}✓ Controls and dependencies validated${colors.reset}`);
}

main();
