/**
 * Frontend CSS Vars Generator (JavaScript)
 *
 * Generates JavaScript helper functions that build CSS custom properties
 * for frontend rendering (save.js output).
 * Uses comprehensive schema as single source of truth.
 *
 * Output: shared/styles/{block}-frontend-css-vars-generated.js
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
 * Frontend CSS Vars for ${blockType} Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/${blockType}.json
 * Generated at: ${new Date().toISOString()}
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 2.0.0
 */

`;
}

/**
 * Generate the buildFrontendCssVars function for a block
 *
 * This function generates inline CSS variables for the frontend.
 * It only outputs variables for attributes that have customizations (deltas).
 *
 * @param {string} blockType - Block type identifier (accordion, tabs, toc)
 * @param {Object} schema - Comprehensive schema
 * @return {string} JavaScript code
 */
function generateFrontendCssVarsFunction(blockType, schema) {
	let js = getGeneratedHeader(blockType);

	// Collect themeable and non-themeable attributes
	const themeableAttrs = [];
	const nonThemeableAttrs = [];

	Object.entries(schema.attributes || {}).forEach(([attrName, attr]) => {
		if (attr.outputsCSS === false || !attr.cssVar) {
			return;
		}

		if (attr.themeable === true) {
			themeableAttrs.push(attrName);
		} else if (attr.themeable === false) {
			nonThemeableAttrs.push(attrName);
		}
	});

	// Generate JavaScript code
	js += `/**
 * Build inline CSS variables for frontend save output.
 *
 * Themeable attributes use customizations (deltas only) - these are stored
 * separately from the theme and applied as inline styles to override.
 *
 * Non-themeable attributes use per-block attribute values - these are
 * structural/behavioral attributes that aren't part of the theme system.
 *
 * @param {Object} customizations - Themeable deltas (Tier 3 overrides)
 * @param {Object} attributes - Block attributes (includes non-themeable values)
 * @return {Object} CSS variable map for inline styles
 */
export function buildFrontendCssVars(customizations, attributes) {
	const styles = {};

	// Helper: Format CSS value with unit
	const formatValue = (value) => {
		if (value === null || value === undefined) {
			return null;
		}
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			return String(value);
		}
		// For complex objects (responsive, panel types), skip for now
		// The comprehensive CSS var system handles expansion elsewhere
		return null;
	};

	// Apply themeable customizations (deltas)
	if (customizations && typeof customizations === 'object') {
		const themeableAttrs = new Set(${JSON.stringify(themeableAttrs)});

		Object.entries(customizations).forEach(([attrName, value]) => {
			if (!themeableAttrs.has(attrName)) {
				return;
			}

			// Map attribute name to CSS variable
			const cssVar = CSS_VAR_MAP[attrName];
			if (!cssVar) {
				return;
			}

			const formattedValue = formatValue(value);
			if (formattedValue !== null) {
				styles[cssVar] = formattedValue;
			}
		});
	}

	// Apply non-themeable attribute values
	if (attributes && typeof attributes === 'object') {
		const nonThemeableAttrs = new Set(${JSON.stringify(nonThemeableAttrs)});

		nonThemeableAttrs.forEach((attrName) => {
			const value = attributes[attrName];
			if (value === null || value === undefined) {
				return;
			}

			// Map attribute name to CSS variable
			const cssVar = CSS_VAR_MAP[attrName];
			if (!cssVar) {
				return;
			}

			const formattedValue = formatValue(value);
			if (formattedValue !== null) {
				styles[cssVar] = formattedValue;
			}
		});
	}

	return styles;
}

/**
 * Attribute name to CSS variable mapping
 * Generated from comprehensive schema cssVarMap
 */
const CSS_VAR_MAP = ${generateCssVarMapping(schema)};
`;

	return js;
}

/**
 * Generate the CSS variable mapping object from schema
 *
 * @param {Object} schema - Comprehensive schema
 * @return {string} JavaScript object literal
 */
function generateCssVarMapping(schema) {
	const cssVarMap = schema.cssVarMap || {};
	const attributes = schema.attributes || {};

	// Build reverse map: attribute name -> CSS variable name
	const attrToCssVar = {};

	Object.entries(cssVarMap).forEach(([cssVarName, metadata]) => {
		const attrName = metadata.attribute;
		const attrDef = attributes[attrName];

		// Only include if attribute exists and outputs CSS
		if (attrDef && attrDef.outputsCSS !== false) {
			attrToCssVar[attrName] = cssVarName;
		}
	});

	// Format as JavaScript object
	return JSON.stringify(attrToCssVar, null, 2);
}

/**
 * Generate frontend CSS variables for a single block
 *
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {string} schemaDir - Path to schemas/generated directory
 * @param {string} outputDir - Path to shared/styles directory
 * @return {Object} Result with success status and details
 */
function generateFrontendCssVarsForBlock(blockType, schemaDir, outputDir) {
	try {
		// Load comprehensive schema
		const schemaPath = path.join(schemaDir, `${blockType}.json`);
		if (!fs.existsSync(schemaPath)) {
			throw new Error(`Schema not found: ${schemaPath}`);
		}

		const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

		// Generate JavaScript content
		const js = generateFrontendCssVarsFunction(blockType, schema);

		// Ensure output directory exists
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Write JavaScript file
		const outputPath = path.join(outputDir, `${blockType}-frontend-css-vars-generated.js`);
		fs.writeFileSync(outputPath, js, 'utf8');

		// Count attributes and variables
		const themeableCount = Object.values(schema.attributes || {})
			.filter(attr => attr.themeable === true && attr.outputsCSS !== false && attr.cssVar)
			.length;
		const nonThemeableCount = Object.values(schema.attributes || {})
			.filter(attr => attr.themeable === false && attr.outputsCSS !== false && attr.cssVar)
			.length;

		return {
			success: true,
			blockType,
			file: outputPath,
			themeableCount,
			nonThemeableCount,
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
 * Generate frontend CSS variables for all blocks
 *
 * @param {Array<string>} blocks - Array of block types
 * @param {string} schemaDir - Path to schemas/generated directory
 * @param {string} outputDir - Path to shared/styles directory
 * @return {Object} Results with success/failed arrays
 */
function generateAllFrontendCssVars(blocks, schemaDir, outputDir) {
	const results = {
		success: [],
		failed: [],
		totalThemeable: 0,
		totalNonThemeable: 0,
	};

	blocks.forEach(blockType => {
		const result = generateFrontendCssVarsForBlock(blockType, schemaDir, outputDir);

		if (result.success) {
			results.success.push(result);
			results.totalThemeable += result.themeableCount;
			results.totalNonThemeable += result.nonThemeableCount;
		} else {
			results.failed.push(result);
		}
	});

	return results;
}

module.exports = {
	generateFrontendCssVarsFunction,
	generateFrontendCssVarsForBlock,
	generateAllFrontendCssVars,
};
