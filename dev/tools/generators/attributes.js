/**
 * Block Attributes Generator
 *
 * Generates atomic, flat block attributes from comprehensive schemas.
 * This replaces the old macro-object approach with individual kebab-case attributes.
 *
 * Input: schemas/generated/{block}.json (comprehensive schema)
 * Output: blocks/{block}/attributes.js (block attributes)
 *
 * @package Guttemberg Plus
 * @since 2.0.0
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate block attributes from comprehensive schema
 *
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {object} schema - Comprehensive schema object
 * @return {number} - Number of attributes generated
 */
function generateAttributes(blockType, schema) {
	const { attributes, blockName } = schema;

	if (!attributes || typeof attributes !== 'object') {
		throw new Error(`Invalid schema: missing attributes object for ${blockType}`);
	}

	const lines = [];
	let attributeCount = 0;

	// Special structural attributes (only add if not already in schema)
	const structuralAttrs = {
		currentTheme: { type: 'string', default: '' },
		customizations: { type: 'object', default: {} },
		[`${blockType}Id`]: { type: 'string', default: '' },
	};

	// Add structural attributes first (only if not in schema)
	Object.entries(structuralAttrs).forEach(([name, def]) => {
		if (!attributes[name]) {
			const defaultValue = JSON.stringify(def.default);
			lines.push(`\t${name}: { type: '${def.type}', default: ${defaultValue} },`);
			attributeCount++;
		}
	});

	// Sort attributes alphabetically for consistent output
	const sortedAttributes = Object.entries(attributes).sort(([a], [b]) => a.localeCompare(b));

	// Add attributes from comprehensive schema
	sortedAttributes.forEach(([name, def]) => {
		const type = def.type || 'string';
		const defaultValue = JSON.stringify(def.default);

		// Add attribute line
		lines.push(`\t'${name}': { type: '${type}', default: ${defaultValue} },`);
		attributeCount++;
	});

	// Build file header
	const header = `/**
 * Block Attributes for ${blockName}
 *
 * AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/${blockType}.json
 * Generated at: ${new Date().toISOString()}
 *
 * This file contains atomic, flat attributes in kebab-case format.
 * Each attribute represents a single configurable property.
 *
 * Special Attributes:
 * - currentTheme: Currently applied theme name
 * - customizations: Per-block customizations (overrides theme)
 * - ${blockType}Id: Unique identifier for this ${blockName.toLowerCase()}
 *
 * All other attributes are auto-generated from the comprehensive schema.
 * To modify attributes, edit schemas/blocks/${blockType}.json and rebuild.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */`;

	// Build attribute object
	const attributeObject = `export const ${blockType}Attributes = {
${lines.join('\n')}
};`;

	// Build footer
	const footer = `export default ${blockType}Attributes;`;

	// Combine all parts
	const output = [header, '', attributeObject, '', footer, ''].join('\n');

	// Write to blocks/{blockType}/attributes.js
	const outputDir = path.join(__dirname, '..', '..', 'blocks', blockType);
	const outputPath = path.join(outputDir, 'attributes.js');

	// Ensure directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	fs.writeFileSync(outputPath, output, 'utf8');

	return attributeCount;
}

/**
 * Generate attributes for all blocks
 *
 * @param {Array<string>} blocks - Array of block types
 * @param {string} schemaDir - Directory containing comprehensive schemas
 * @return {Object} - Summary of generated files
 */
function generateAllAttributes(blocks, schemaDir) {
	const results = {
		success: [],
		failed: [],
		totalAttributes: 0,
	};

	for (const blockType of blocks) {
		try {
			// Load comprehensive schema
			const schemaPath = path.join(schemaDir, `${blockType}.json`);

			if (!fs.existsSync(schemaPath)) {
				throw new Error(`Comprehensive schema not found: ${schemaPath}`);
			}

			const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

			// Generate attributes
			const count = generateAttributes(blockType, schema);

			results.success.push({
				blockType,
				count,
				file: `blocks/${blockType}/attributes.js`,
			});

			results.totalAttributes += count;
		} catch (error) {
			results.failed.push({
				blockType,
				error: error.message,
			});
		}
	}

	return results;
}

module.exports = {
	generateAttributes,
	generateAllAttributes,
};
