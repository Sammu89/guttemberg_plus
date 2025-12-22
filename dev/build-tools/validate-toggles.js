/**
 * Validate toggle-dependent CSS output for save inline styles.
 *
 * Currently covers Tabs toggles that alter CSS output. Extend `TESTS` with
 * additional block/toggle cases as needed.
 */

const { formatCssValue, getCssVarName } = require('../shared/src/config/css-var-mappings-generated');
const tabsSchema = require('../schemas/tabs.json');
const { tabsAttributes } = require('../blocks/tabs/src/tabs-attributes');

// Minimal recreation of save.js customization styles logic for tabs
function getCustomizationStyles(attributes, allDefaults) {
	const styles = {};
	const customizations = attributes.customizations || {};

	Object.entries(customizations).forEach(([attrName, value]) => {
		if (value === null || value === undefined) return;
		const cssVar = getCssVarName(attrName, 'tabs');
		if (!cssVar) return;
		const formattedValue = formatCssValue(attrName, value, 'tabs');
		if (formattedValue !== null) {
			styles[cssVar] = formattedValue;
		}
	});

	// Mirror save.js toggle logic for enableFocusBorder
	if (attributes.enableFocusBorder === false) {
		const activeBorderColor = attributes.tabButtonActiveBorderColor ?? allDefaults.tabButtonActiveBorderColor ?? '#dddddd';
		const baseBorderWidth = attributes.tabButtonBorderWidth ?? allDefaults.tabButtonBorderWidth ?? 1;
		const baseBorderStyle = attributes.tabButtonBorderStyle ?? allDefaults.tabButtonBorderStyle ?? 'solid';

		styles['--tabs-button-active-content-border-color'] = activeBorderColor;
		styles['--tabs-button-active-content-border-width'] = `${baseBorderWidth}px`;
		styles['--tabs-button-active-content-border-style'] = baseBorderStyle;
	}

	// Mirror save.js toggle logic for enableTabsListContentBorder
	if (attributes.enableTabsListContentBorder === false) {
		const rowColor = attributes.tabsRowBorderColor ?? allDefaults.tabsRowBorderColor ?? '#dddddd';
		const rowWidth = attributes.tabsRowBorderWidth ?? allDefaults.tabsRowBorderWidth ?? 0;
		const rowStyle = attributes.tabsRowBorderStyle ?? allDefaults.tabsRowBorderStyle ?? 'solid';

		styles['--tabs-list-divider-border-color'] = rowColor;
		styles['--tabs-list-divider-border-width'] = `${rowWidth}px`;
		styles['--tabs-list-divider-border-style'] = rowStyle;
	}

	return styles;
}

function getSchemaDefaults() {
	const defaults = {};
	Object.entries(tabsSchema.attributes || {}).forEach(([key, attr]) => {
		if (attr.default !== undefined) {
			defaults[key] = attr.default;
		}
	});
	return defaults;
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function run() {
	const allDefaults = getSchemaDefaults();

	// Test suite
	const TESTS = [
		{
			name: 'tabs.enableFocusBorder=false should fallback to base border',
			attributes: {
				enableFocusBorder: false,
				tabButtonActiveBorderColor: '#abcabc',
				tabButtonBorderWidth: 3,
				tabButtonBorderStyle: 'dashed',
			},
			expect(styles) {
				assert(
					styles['--tabs-button-active-content-border-color'] === '#abcabc',
					'Focus border off: expected active content border color to fallback to active border color'
				);
				assert(
					styles['--tabs-button-active-content-border-width'] === '3px',
					'Focus border off: expected active content border width to fallback to base border width'
				);
				assert(
					styles['--tabs-button-active-content-border-style'] === 'dashed',
					'Focus border off: expected active content border style to fallback to base border style'
				);
			},
		},
		{
			name: 'tabs.enableTabsListContentBorder=false should fallback to row border',
			attributes: {
				enableTabsListContentBorder: false,
				tabsRowBorderColor: '#123123',
				tabsRowBorderWidth: 4,
				tabsRowBorderStyle: 'double',
			},
			expect(styles) {
				assert(
					styles['--tabs-list-divider-border-color'] === '#123123',
					'Tabs divider off: expected divider color to fallback to row border color'
				);
				assert(
					styles['--tabs-list-divider-border-width'] === '4px',
					'Tabs divider off: expected divider width to fallback to row border width'
				);
				assert(
					styles['--tabs-list-divider-border-style'] === 'double',
					'Tabs divider off: expected divider style to fallback to row border style'
				);
			},
		},
	];

	TESTS.forEach((test) => {
		const attrs = { ...allDefaults, ...test.attributes, customizations: {} };
		const styles = getCustomizationStyles(attrs, allDefaults);
		test.expect(styles);
	});

	console.log('✅ Toggle-dependent CSS validation passed.');
}

try {
	run();
} catch (err) {
	console.error('✗ Toggle-dependent CSS validation failed.');
	console.error(err.message || err);
	process.exit(1);
}
