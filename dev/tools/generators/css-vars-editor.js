/**
 * Editor CSS Vars Generator (SCSS)
 *
 * Generates SCSS files with CSS custom properties for editor styling.
 * Uses comprehensive schema as single source of truth.
 *
 * Output: styles/blocks/{block}/variables.scss
 *
 * @package GuttemberPlus
 * @since 2.0.0
 */

const fs = require('fs');
const path = require('path');

/**
 * Get auto-generated file header
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @return {string} Header comment
 */
function getGeneratedHeader(blockType) {
	return `/**
 * AUTO-GENERATED - DO NOT EDIT
 * Source: comprehensive schema for ${blockType}
 * Generated: ${new Date().toISOString()}
 */

`;
}

/**
 * Format CSS value with unit
 * @param {*} value - Value to format
 * @param {string} type - Attribute type
 * @return {string} Formatted CSS value
 */
function formatCssValue(value, type) {
	if (value === null || value === undefined) {
		return null;
	}

	// Handle string values (colors, keywords, etc.)
	if (typeof value === 'string') {
		return value;
	}

	// Handle numeric values
	if (typeof value === 'number') {
		// Type-specific formatting
		if (type === 'number') {
			return String(value);
		}
		return `${value}px`; // Default to px
	}

	// Handle boolean values
	if (typeof value === 'boolean') {
		return value ? 'true' : 'false';
	}

	return null;
}

/**
 * Generate SCSS variables from comprehensive schema
 *
 * @param {string} blockType - Block type identifier (accordion, tabs, toc)
 * @param {Object} schema - Comprehensive schema
 * @return {string} SCSS content
 */
function generateEditorCssVarsScss(blockType, schema) {
	let scss = getGeneratedHeader(blockType);

	scss += ':root {\n';

	// Extract all CSS variables from cssVarMap
	const cssVarMap = schema.cssVarMap || {};
	const defaultValues = schema.defaultValues || {};

	// Group CSS variables by name for sorting
	const cssVars = {};

	Object.entries(cssVarMap).forEach(([cssVarName, metadata]) => {
		const attrName = metadata.attribute;
		const attrDef = schema.attributes[attrName];

		if (!attrDef || attrDef.outputsCSS === false) {
			return;
		}

		// Get default value
		let defaultValue = defaultValues[attrName];
		if (defaultValue === undefined && attrDef.default !== undefined) {
			defaultValue = attrDef.default;
		}

		// Format value
		const formattedValue = formatCssValue(defaultValue, attrDef.type);

		if (formattedValue !== null) {
			cssVars[cssVarName] = formattedValue;
		}
	});

	// Sort CSS variables alphabetically for consistent output
	const sortedVarNames = Object.keys(cssVars).sort();

	sortedVarNames.forEach(varName => {
		scss += `  ${varName}: ${cssVars[varName]};\n`;
	});

	scss += '}\n';

	return scss;
}

/**
 * Generate editor CSS variables for a single block
 *
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {string} schemaDir - Path to schemas/generated directory
 * @param {string} outputDir - Path to styles/blocks/{block} directory
 * @return {Object} Result with success status and details
 */
function generateEditorCssVarsForBlock(blockType, schemaDir, outputDir) {
	try {
		// Load comprehensive schema
		const schemaPath = path.join(schemaDir, `${blockType}.json`);
		if (!fs.existsSync(schemaPath)) {
			throw new Error(`Schema not found: ${schemaPath}`);
		}

		const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

		// Generate SCSS content
		const scss = generateEditorCssVarsScss(blockType, schema);

		// Ensure output directory exists
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Write SCSS file
		const outputPath = path.join(outputDir, 'variables.scss');
		fs.writeFileSync(outputPath, scss, 'utf8');

		// Count variables
		const varCount = (scss.match(/--\w+/g) || []).length;

		return {
			success: true,
			blockType,
			file: outputPath,
			varCount,
		};
	} catch (error) {
		return {
			success: false,
			blockType,
			error: error.message,
		};
	}
}

/**
 * Generate editor CSS variables for all blocks
 *
 * @param {Array<string>} blocks - Array of block types
 * @param {string} schemaDir - Path to schemas/generated directory
 * @param {string} stylesDir - Path to styles/blocks directory
 * @return {Object} Results with success/failed arrays
 */
function generateAllEditorCssVars(blocks, schemaDir, stylesDir) {
	const results = {
		success: [],
		failed: [],
		totalVars: 0,
	};

	blocks.forEach(blockType => {
		const outputDir = path.join(stylesDir, blockType);
		const result = generateEditorCssVarsForBlock(blockType, schemaDir, outputDir);

		if (result.success) {
			results.success.push(result);
			results.totalVars += result.varCount;
		} else {
			results.failed.push(result);
		}
	});

	return results;
}

module.exports = {
	generateEditorCssVarsScss,
	generateEditorCssVarsForBlock,
	generateAllEditorCssVars,
};
