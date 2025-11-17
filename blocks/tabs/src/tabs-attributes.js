/**
 * Tabs Block Attributes
 *
 * Combines shared attributes with tabs-specific attributes.
 * All customizable attributes default to null (CSS-based or inherited at runtime).
 *
 * @see docs/BLOCKS/32-TABS-SPEC.md
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @see docs/INTEGRATION/TABS-ACCORDION-INTEGRATION.md
 * @package
 * @since 1.0.0
 */

import {
	colorAttributes,
	typographyAttributes,
	spacingAttributes,
	iconAttributes,
	metaAttributes,
} from '@shared';

/**
 * Tabs-specific behavioral attributes
 * These don't come from CSS but have hardcoded defaults
 */
const tabsSpecificAttributes = {
	/**
	 * Structural Attributes - Tabs-specific
	 */

	// Orientation: horizontal or vertical tab layout
	orientation: {
		type: 'string',
		default: 'horizontal', // 'horizontal' | 'vertical'
	},

	// Activation mode: automatic (focus activates) or manual (click activates)
	activationMode: {
		type: 'string',
		default: 'auto', // 'auto' | 'manual'
	},

	// Responsive breakpoint in pixels (convert to accordion below this)
	responsiveBreakpoint: {
		type: 'number',
		default: 768,
	},

	// Enable responsive accordion fallback
	enableResponsiveFallback: {
		type: 'boolean',
		default: true,
	},

	// Current active tab index (0-based)
	currentTab: {
		type: 'number',
		default: 0,
	},

	// Tab items array (each tab has title, content, isDisabled)
	tabs: {
		type: 'array',
		default: [
			{
				id: '',
				title: 'Tab 1',
				content: '',
				isDisabled: false,
			},
			{
				id: '',
				title: 'Tab 2',
				content: '',
				isDisabled: false,
			},
		],
	},

	/**
	 * Customizable Attributes - Tabs-specific (CSS-based, default to null)
	 */

	// Tab border styling (replaces accordionBorder* from shared attributes)
	tabBorderColor: {
		type: 'string',
		default: null,
	},

	tabBorderThickness: {
		type: 'number',
		default: null,
	},

	tabBorderStyle: {
		type: 'string',
		default: null,
	},

	tabShadow: {
		type: 'string',
		default: null,
	},

	tabBorderRadius: {
		type: 'object',
		default: null, // { topLeft, topRight, bottomRight, bottomLeft }
	},

	// Tab container styling
	containerBorderWidth: {
		type: 'number',
		default: null,
	},

	containerBorderStyle: {
		type: 'string',
		default: null,
	},

	containerBorderColor: {
		type: 'string',
		default: null,
	},

	containerBorderRadius: {
		type: 'object',
		default: null, // { topLeft, topRight, bottomRight, bottomLeft }
	},

	containerShadow: {
		type: 'string',
		default: null,
	},

	// Tab list (navigation bar) styling
	tabListBackground: {
		type: 'string',
		default: null,
	},

	tabListBorderBottomWidth: {
		type: 'number',
		default: null,
	},

	tabListBorderBottomStyle: {
		type: 'string',
		default: null,
	},

	tabListBorderBottomColor: {
		type: 'string',
		default: null,
	},

	tabListGap: {
		type: 'number',
		default: null,
	},

	tabListPadding: {
		type: 'object',
		default: null, // { top, right, bottom, left }
	},

	tabsAlignment: {
		type: 'string',
		default: null, // 'left' | 'center' | 'right'
	},

	// Tab button active state colors (tabs-specific)
	tabButtonActiveColor: {
		type: 'string',
		default: null,
	},

	tabButtonActiveBackground: {
		type: 'string',
		default: null,
	},

	tabButtonActiveBorderColor: {
		type: 'string',
		default: null,
	},

	tabButtonActiveBorderBottomColor: {
		type: 'string',
		default: null,
	},

	// Tab button border radius (per-corner for horizontal tabs)
	tabButtonBorderRadius: {
		type: 'object',
		default: null, // { topLeft, topRight, bottomRight, bottomLeft }
	},

	// Tab panel styling
	panelBackground: {
		type: 'string',
		default: null,
	},

	panelColor: {
		type: 'string',
		default: null,
	},

	panelBorderWidth: {
		type: 'number',
		default: null,
	},

	panelBorderStyle: {
		type: 'string',
		default: null,
	},

	panelBorderColor: {
		type: 'string',
		default: null,
	},

	panelBorderRadius: {
		type: 'number',
		default: null,
	},

	panelPadding: {
		type: 'object',
		default: null, // { top, right, bottom, left }
	},

	panelFontSize: {
		type: 'number',
		default: null,
	},

	panelLineHeight: {
		type: 'number',
		default: null,
	},

	// Divider between tab list and panels
	dividerThickness: {
		type: 'number',
		default: null,
	},

	dividerStyle: {
		type: 'string',
		default: null,
	},

	dividerColor: {
		type: 'string',
		default: null,
	},

	// Vertical orientation specific
	verticalTabListWidth: {
		type: 'number',
		default: null,
	},

	verticalTabButtonTextAlign: {
		type: 'string',
		default: null,
	},
};

/**
 * Complete tabs block attributes
 * Merges all shared attributes with tabs-specific ones
 */
export const tabsAttributes = {
	// Meta/structural attributes (not customizable)
	...metaAttributes,

	// Customizable color attributes (all default to null)
	...colorAttributes,

	// Customizable typography attributes (all default to null)
	...typographyAttributes,

	// Customizable spacing attributes (all default to null)
	...spacingAttributes,

	// Customizable icon attributes (mix of null and behavioral)
	...iconAttributes,

	// Tabs-specific attributes (mix of behavioral and CSS-based)
	...tabsSpecificAttributes,
};

export default tabsAttributes;
