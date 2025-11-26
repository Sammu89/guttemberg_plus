/**
 * Schema Enhancement Script
 *
 * Adds new properties to schema files for schema-driven sidebar:
 * - Groups: order, initialOpen, pago
 * - Attributes: order, pago, cssSelector, cssProperty
 *
 * @package guttemberg-plus
 */

const fs = require('fs');
const path = require('path');

// Schema files to process
const SCHEMA_FILES = [
	'schemas/accordion.json',
	'schemas/tabs.json',
	'schemas/toc.json',
];

// Group order mapping (customize as needed)
const GROUP_ORDERS = {
	behavior: 1,
	headerColors: 2,
	contentColors: 3,
	typography: 4,
	borders: 5,
	dividerLine: 6,
	icon: 7,
	layout: 8,
};

// CSS selector mappings (block-specific patterns)
const CSS_SELECTORS = {
	accordion: {
		title: '.accordion-header',
		content: '.accordion-content',
		wrapper: '.wp-block-guttemberg-plus-accordion',
		icon: '.accordion-icon',
	},
	tabs: {
		button: '.tab-button',
		panel: '.tab-panel',
		wrapper: '.wp-block-guttemberg-plus-tabs',
		list: '.tab-list',
	},
	toc: {
		link: '.toc-link',
		list: '.toc-list',
		wrapper: '.wp-block-guttemberg-plus-toc',
		item: '.toc-item',
	},
};

/**
 * Infer CSS selector from attribute name
 */
function inferCSSSelector(attrName, blockType) {
	const selectors = CSS_SELECTORS[blockType];
	const name = attrName.toLowerCase();

	if (name.includes('title')) return selectors.title || selectors.button || selectors.link;
	if (name.includes('content')) return selectors.content || selectors.panel;
	if (name.includes('icon')) return selectors.icon;
	if (name.includes('wrapper') || name.includes(blockType)) return selectors.wrapper;

	// Default to wrapper
	return selectors.wrapper;
}

/**
 * Infer CSS property from attribute name and cssVar
 */
function inferCSSProperty(attrName, cssVar) {
	const name = attrName.toLowerCase();

	if (name.includes('color') && !name.includes('background')) return 'color';
	if (name.includes('background')) return 'background-color';
	if (name.includes('fontsize')) return 'font-size';
	if (name.includes('fontweight')) return 'font-weight';
	if (name.includes('fontstyle')) return 'font-style';
	if (name.includes('lineheight')) return 'line-height';
	if (name.includes('borderwidth') || name.includes('thickness')) return 'border-width';
	if (name.includes('borderstyle')) return 'border-style';
	if (name.includes('bordercolor')) return 'border-color';
	if (name.includes('borderradius') || name.includes('radius')) return 'border-radius';
	if (name.includes('padding')) return 'padding';
	if (name.includes('margin')) return 'margin';
	if (name.includes('shadow')) return 'box-shadow';

	// Fallback: extract from cssVar if available
	if (cssVar) {
		if (cssVar.includes('color') && !cssVar.includes('bg')) return 'color';
		if (cssVar.includes('bg')) return 'background-color';
	}

	return undefined; // Not all attributes need CSS properties
}

/**
 * Enhance groups with order, initialOpen, pago
 */
function enhanceGroups(groups) {
	const enhanced = {};

	Object.entries(groups).forEach(([groupName, groupConfig]) => {
		enhanced[groupName] = {
			...groupConfig,
			order: GROUP_ORDERS[groupName] || 999,
			initialOpen: groupName === 'behavior', // Only behavior panel open by default
			pago: 'nao', // Default: not premium
		};
	});

	return enhanced;
}

/**
 * Enhance attributes with order, pago, cssSelector, cssProperty
 */
function enhanceAttributes(attributes, blockType) {
	const enhanced = {};
	let orderCounter = 1;

	Object.entries(attributes).forEach(([attrName, attrConfig]) => {
		const cssSelector = attrConfig.cssVar ? inferCSSSelector(attrName, blockType) : undefined;
		const cssProperty = attrConfig.cssVar ? inferCSSProperty(attrName, attrConfig.cssVar) : undefined;

		enhanced[attrName] = {
			...attrConfig,
			order: orderCounter++, // Sequential order based on JSON position
			pago: 'nao', // Default: not premium
		};

		// Only add CSS properties if cssVar exists (themeable styling attributes)
		if (cssSelector) {
			enhanced[attrName].cssSelector = cssSelector;
		}
		if (cssProperty) {
			enhanced[attrName].cssProperty = cssProperty;
		}
	});

	return enhanced;
}

/**
 * Process a schema file
 */
function processSchema(schemaPath) {
	console.log(`\nProcessing: ${schemaPath}`);

	// Read schema
	const fullPath = path.join(process.cwd(), schemaPath);
	const schema = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

	// Enhance groups
	if (schema.groups) {
		schema.groups = enhanceGroups(schema.groups);
		console.log(`  ✓ Enhanced ${Object.keys(schema.groups).length} groups`);
	}

	// Enhance attributes
	if (schema.attributes) {
		const blockType = schema.blockType;
		schema.attributes = enhanceAttributes(schema.attributes, blockType);
		console.log(`  ✓ Enhanced ${Object.keys(schema.attributes).length} attributes`);
	}

	// Write back to file with pretty formatting
	fs.writeFileSync(fullPath, JSON.stringify(schema, null, 2) + '\n', 'utf8');
	console.log(`  ✓ Saved ${schemaPath}`);
}

/**
 * Main execution
 */
console.log('========================================');
console.log('  Schema Enhancement Tool');
console.log('========================================\n');

SCHEMA_FILES.forEach(processSchema);

console.log('\n========================================');
console.log('  Enhancement Complete!');
console.log('========================================\n');
