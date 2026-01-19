/**
 * Editor CSS Vars Generator (JavaScript)
 *
 * Generates JavaScript function that converts atomic attributes to inline CSS variables
 * for editor preview. Works with comprehensive schema's atomic attribute structure.
 *
 * Output: shared/styles/{block}-css-vars-generated.js
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
 * Editor CSS Vars for ${blockType.charAt(0).toUpperCase() + blockType.slice(1)} Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/${blockType}.json
 * Generated at: ${new Date().toISOString()}
 *
 * This file converts atomic block attributes to inline CSS variables for editor preview.
 * Attributes are flat (e.g., "title-color", "title-padding-top") not nested objects.
 *
 * @package GuttemberPlus
 * @since 2.0.0
 */
`;
}

/**
 * Generate buildEditorCssVars function from comprehensive schema
 *
 * @param {string} blockType - Block type identifier (accordion, tabs, toc)
 * @param {Object} schema - Comprehensive schema
 * @return {string} JavaScript content
 */
function generateEditorCssVarsJs(blockType, schema) {
	let js = getGeneratedHeader(blockType);

	js += `
/**
 * Format shadow value (box-shadow or text-shadow)
 */
function formatShadowValue(shadows, cssProperty) {
	if (!shadows || !Array.isArray(shadows) || shadows.length === 0) {
		return 'none';
	}

	const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
	if (validLayers.length === 0) {
		return 'none';
	}

	const formatValue = (valueObj) => {
		if (valueObj === null || valueObj === undefined) return '0px';
		if (typeof valueObj === 'string') return valueObj;
		if (typeof valueObj === 'number') return \`\${valueObj}px\`;
		if (typeof valueObj === 'object' && valueObj !== null) {
			const value = valueObj.value ?? 0;
			const unit = valueObj.unit ?? 'px';
			return \`\${value}\${unit}\`;
		}
		return '0px';
	};

	const shadowStrings = validLayers.map(layer => {
		const parts = [];
		if (cssProperty === 'box-shadow' && layer.inset === true) {
			parts.push('inset');
		}
		parts.push(formatValue(layer.x));
		parts.push(formatValue(layer.y));
		if (cssProperty === 'box-shadow') {
			parts.push(formatValue(layer.blur));
			parts.push(formatValue(layer.spread));
		} else if (layer.blur) {
			parts.push(formatValue(layer.blur));
		}
		parts.push(layer.color);
		return parts.join(' ');
	});

	return shadowStrings.join(', ');
}

/**
 * Build inline CSS variables for editor preview
 *
 * Takes atomic attribute values and converts them to CSS custom properties.
 * Only includes attributes that have cssVar defined and outputsCSS !== false.
 *
 * @param {Object} attributes - Block attributes (atomic, flat structure)
 * @return {Object} Object of CSS variables to apply as inline styles
 */
export function buildEditorCssVars(attributes) {
	const cssVars = {};
	const attrs = attributes || {};

	// Map each atomic attribute to its CSS variable
`;

	// Generate mapping for each attribute
	const cssVarMap = schema.cssVarMap || {};
	const sortedVars = Object.entries(cssVarMap).sort((a, b) => a[0].localeCompare(b[0]));

	sortedVars.forEach(([cssVarName, metadata]) => {
		const attrName = metadata.attribute;
		const attrDef = schema.attributes[attrName];

		if (!attrDef || attrDef.outputsCSS === false) {
			return;
		}

		const cssProperty = attrDef.cssProperty || '';
		const isShadow = cssProperty === 'box-shadow' || cssProperty === 'text-shadow';

		// Generate mapping code
		js += `\t// ${attrName} → ${cssVarName}\n`;
		js += `\tif (attrs['${attrName}'] !== undefined && attrs['${attrName}'] !== null) {\n`;

		if (isShadow) {
			js += `\t\tcssVars['${cssVarName}'] = formatShadowValue(attrs['${attrName}'], '${cssProperty}');\n`;
		} else {
			js += `\t\tcssVars['${cssVarName}'] = attrs['${attrName}'];\n`;
		}

		js += `\t}\n\n`;
	});

	js += `\treturn cssVars;
}
`;

	return js;
}

/**
 * Generate editor CSS variables JS for a single block
 *
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {string} schemaDir - Path to schemas/generated directory
 * @param {string} outputDir - Path to shared/styles directory
 * @return {Object} Result with success status and details
 */
function generateEditorCssVarsJsForBlock(blockType, schemaDir, outputDir) {
	try {
		// Load comprehensive schema
		const schemaPath = path.join(schemaDir, `${blockType}.json`);
		if (!fs.existsSync(schemaPath)) {
			throw new Error(`Schema not found: ${schemaPath}`);
		}

		const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

		// Generate JavaScript content
		const js = generateEditorCssVarsJs(blockType, schema);

		// Ensure output directory exists
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Write JavaScript file
		const outputPath = path.join(outputDir, `${blockType}-css-vars-generated.js`);
		fs.writeFileSync(outputPath, js, 'utf8');

		// Count variables
		const cssVarMap = schema.cssVarMap || {};
		const varCount = Object.keys(cssVarMap).length;

		return {
			success: true,
			blockType,
			varCount,
			file: outputPath,
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
 * Generate editor CSS variables JS for all blocks
 *
 * @param {string[]} blocks - Array of block types
 * @param {string} schemaDir - Path to schemas/generated directory
 * @param {string} outputDir - Path to shared/styles directory
 * @return {Object} Results summary
 */
function generateAllEditorCssVarsJs(blocks, schemaDir, outputDir) {
	const results = {
		success: [],
		failed: [],
		totalVars: 0,
	};

	blocks.forEach(blockType => {
		const result = generateEditorCssVarsJsForBlock(blockType, schemaDir, outputDir);

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
	generateEditorCssVarsJs,
	generateEditorCssVarsJsForBlock,
	generateAllEditorCssVarsJs,
};
