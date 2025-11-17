/**
 * TOC Block - Attributes Schema
 *
 * Defines all attributes for the Table of Contents block.
 * Uses shared attributes from src/shared/attributes/ and adds TOC-specific attributes.
 *
 * Architecture:
 * - Structural attributes (never in themes): tocId, showTitle, titleText
 * - Meta attributes (not in themes): currentTheme, customizationCache, isCustomized
 * - Customizable attributes (in themes): All default to null for CSS-based values
 *
 * @package
 * @since 1.0.0
 */

import { metaAttributes } from '../../../shared/src/attributes';

/**
 * TOC-Specific Structural Attributes
 */
const structuralAttributes = {
	tocId: {
		type: 'string',
		default: '',
	},
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleText: {
		type: 'string',
		default: 'Table of Contents',
	},
};

/**
 * Heading Filter Attributes
 */
const filterAttributes = {
	filterMode: {
		type: 'string',
		default: 'include-all',
	},
	includeLevels: {
		type: 'array',
		default: [ 2, 3, 4, 5, 6 ],
	},
	includeClasses: {
		type: 'string',
		default: '',
	},
	excludeLevels: {
		type: 'array',
		default: [],
	},
	excludeClasses: {
		type: 'string',
		default: '',
	},
	depthLimit: {
		type: 'number',
		default: null,
	},
};

/**
 * Numbering Attributes
 */
const numberingAttributes = {
	numberingStyle: {
		type: 'string',
		default: 'none',
	},
	numberingColor: {
		type: 'string',
		default: null,
	},
};

/**
 * Collapsible Behavior Attributes
 */
const collapsibleAttributes = {
	isCollapsible: {
		type: 'boolean',
		default: false,
	},
	initiallyCollapsed: {
		type: 'boolean',
		default: false,
	},
	collapseIconSize: {
		type: 'number',
		default: null,
	},
	collapseIconColor: {
		type: 'string',
		default: null,
	},
};

/**
 * Typography - Level 1 (H2)
 */
const level1TypographyAttributes = {
	level1FontSize: {
		type: 'number',
		default: null,
	},
	level1FontWeight: {
		type: 'string',
		default: null,
	},
	level1FontStyle: {
		type: 'string',
		default: null,
	},
	level1TextTransform: {
		type: 'string',
		default: null,
	},
	level1TextDecoration: {
		type: 'string',
		default: null,
	},
	level1Color: {
		type: 'string',
		default: null,
	},
};

/**
 * Typography - Level 2 (H3)
 */
const level2TypographyAttributes = {
	level2FontSize: {
		type: 'number',
		default: null,
	},
	level2FontWeight: {
		type: 'string',
		default: null,
	},
	level2FontStyle: {
		type: 'string',
		default: null,
	},
	level2TextTransform: {
		type: 'string',
		default: null,
	},
	level2TextDecoration: {
		type: 'string',
		default: null,
	},
	level2Color: {
		type: 'string',
		default: null,
	},
};

/**
 * Typography - Level 3+ (H4-H6)
 */
const level3PlusTypographyAttributes = {
	level3PlusFontSize: {
		type: 'number',
		default: null,
	},
	level3PlusFontWeight: {
		type: 'string',
		default: null,
	},
	level3PlusFontStyle: {
		type: 'string',
		default: null,
	},
	level3PlusTextTransform: {
		type: 'string',
		default: null,
	},
	level3PlusTextDecoration: {
		type: 'string',
		default: null,
	},
	level3PlusColor: {
		type: 'string',
		default: null,
	},
};

/**
 * Typography - Title
 */
const titleTypographyAttributes = {
	titleFontSize: {
		type: 'number',
		default: null,
	},
	titleFontWeight: {
		type: 'string',
		default: null,
	},
	titleColor: {
		type: 'string',
		default: null,
	},
	titleTextTransform: {
		type: 'string',
		default: null,
	},
	titleAlignment: {
		type: 'string',
		default: null,
	},
	titleBackgroundColor: {
		type: 'string',
		default: null,
	},
};

/**
 * TOC-Specific Color Attributes
 */
const tocColorAttributes = {
	wrapperBackgroundColor: {
		type: 'string',
		default: null,
	},
	wrapperBorderColor: {
		type: 'string',
		default: null,
	},
	linkColor: {
		type: 'string',
		default: null,
	},
	linkHoverColor: {
		type: 'string',
		default: null,
	},
	linkActiveColor: {
		type: 'string',
		default: null,
	},
	linkVisitedColor: {
		type: 'string',
		default: null,
	},
};

/**
 * Border & Spacing Attributes (TOC-specific)
 */
const tocBorderSpacingAttributes = {
	wrapperBorderWidth: {
		type: 'number',
		default: null,
	},
	wrapperBorderStyle: {
		type: 'string',
		default: null,
	},
	wrapperBorderRadius: {
		type: 'number',
		default: null,
	},
	wrapperShadow: {
		type: 'string',
		default: null,
	},
	wrapperPadding: {
		type: 'number',
		default: null,
	},
	listPaddingLeft: {
		type: 'number',
		default: null,
	},
	itemSpacing: {
		type: 'number',
		default: null,
	},
	levelIndent: {
		type: 'number',
		default: null,
	},
};

/**
 * Layout Attributes
 */
const layoutAttributes = {
	positionType: {
		type: 'string',
		default: 'block',
	},
	positionTop: {
		type: 'number',
		default: null,
	},
	zIndex: {
		type: 'number',
		default: null,
	},
};

/**
 * Scroll Behavior Attributes
 */
const scrollAttributes = {
	smoothScroll: {
		type: 'boolean',
		default: true,
	},
	scrollOffset: {
		type: 'number',
		default: 0,
	},
	autoHighlight: {
		type: 'boolean',
		default: true,
	},
	clickBehavior: {
		type: 'string',
		default: 'navigate',
	},
};

/**
 * Combine all attributes for TOC block
 */
export const tocAttributes = {
	...structuralAttributes,
	...metaAttributes,
	...filterAttributes,
	...numberingAttributes,
	...collapsibleAttributes,
	...level1TypographyAttributes,
	...level2TypographyAttributes,
	...level3PlusTypographyAttributes,
	...titleTypographyAttributes,
	...tocColorAttributes,
	...tocBorderSpacingAttributes,
	...layoutAttributes,
	...scrollAttributes,
};
