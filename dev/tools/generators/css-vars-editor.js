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
 * Format shadow value (box-shadow or text-shadow)
 * @param {Array} shadows - Array of shadow layer objects
 * @param {string} cssProperty - CSS property name ('box-shadow' or 'text-shadow')
 * @return {string} Formatted CSS shadow value
 */
function formatShadowValue(shadows, cssProperty) {
	if (!shadows || !Array.isArray(shadows) || shadows.length === 0) {
		return 'none';
	}

	// Filter valid layers (those with a color)
	const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
	if (validLayers.length === 0) {
		return 'none';
	}

	const formatValue = (valueObj) => {
		if (valueObj === null || valueObj === undefined) return '0px';
		if (typeof valueObj === 'string') return valueObj;
		if (typeof valueObj === 'number') return `${valueObj}px`;
		if (typeof valueObj === 'object' && valueObj !== null) {
			const value = valueObj.value ?? 0;
			const unit = valueObj.unit ?? 'px';
			return `${value}${unit}`;
		}
		return '0px';
	};

	const shadowStrings = validLayers.map(layer => {
		const parts = [];

		// box-shadow supports inset, text-shadow doesn't
		if (cssProperty === 'box-shadow' && layer.inset === true) {
			parts.push('inset');
		}

		// Add offsets
		parts.push(formatValue(layer.x));
		parts.push(formatValue(layer.y));

		// box-shadow has blur and spread, text-shadow only has blur
		if (cssProperty === 'box-shadow') {
			parts.push(formatValue(layer.blur));
			parts.push(formatValue(layer.spread));
		} else if (layer.blur) {
			parts.push(formatValue(layer.blur));
		}

		// Add color
		parts.push(layer.color);

		return parts.join(' ');
	});

	return shadowStrings.join(', ');
}

/**
 * Format CSS value with unit
 * @param {*} value - Value to format
 * @param {string} type - Attribute type
 * @param {string} cssProperty - CSS property name (for special handling)
 * @return {string} Formatted CSS value
 */
function formatCssValue(value, type, cssProperty) {
	if (value === null || value === undefined) {
		return null;
	}

	// Handle shadow arrays (box-shadow, text-shadow)
	if (type === 'array' && (cssProperty === 'box-shadow' || cssProperty === 'text-shadow')) {
		return formatShadowValue(value, cssProperty);
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

		// Format value (pass cssProperty for special handling of shadows)
		const formattedValue = formatCssValue(defaultValue, attrDef.type, attrDef.cssProperty);

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
