/**
 * Typography Attributes
 *
 * Defines all typography-related attributes for blocks.
 * All defaults are null - actual values come from CSS via PHP parsing.
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

/**
 * Typography attribute definitions
 *
 * All customizable typography attributes default to null.
 * Actual default values are defined in CSS files and parsed by PHP.
 */
export const typographyAttributes = {
	/**
	 * Title font size (in pixels)
	 */
	titleFontSize: {
		type: 'number',
		default: null,
	},

	/**
	 * Title font weight
	 * Values: "normal", "bold", "100" through "900"
	 */
	titleFontWeight: {
		type: 'string',
		default: null,
	},

	/**
	 * Title font family
	 */
	titleFontFamily: {
		type: 'string',
		default: null,
	},

	/**
	 * Title line height
	 */
	titleLineHeight: {
		type: 'number',
		default: null,
	},

	/**
	 * Title font style
	 * Values: "normal", "italic", "oblique"
	 */
	titleFontStyle: {
		type: 'string',
		default: null,
	},

	/**
	 * Title text transform
	 * Values: "none", "uppercase", "lowercase", "capitalize"
	 */
	titleTextTransform: {
		type: 'string',
		default: null,
	},

	/**
	 * Title text decoration
	 * Values: "none", "underline", "overline", "line-through"
	 */
	titleTextDecoration: {
		type: 'string',
		default: null,
	},

	/**
	 * Title text alignment
	 * Values: "left", "center", "right"
	 */
	titleAlignment: {
		type: 'string',
		default: null,
	},

	/**
	 * Content font size (in pixels)
	 */
	contentFontSize: {
		type: 'number',
		default: null,
	},

	/**
	 * Content font weight
	 * Values: "normal", "bold", "100" through "900"
	 */
	contentFontWeight: {
		type: 'string',
		default: null,
	},

	/**
	 * Content font family
	 */
	contentFontFamily: {
		type: 'string',
		default: null,
	},

	/**
	 * Content line height
	 */
	contentLineHeight: {
		type: 'number',
		default: null,
	},

	/**
	 * Content font style
	 * Values: "normal", "italic", "oblique"
	 */
	contentFontStyle: {
		type: 'string',
		default: null,
	},

	/**
	 * Content text transform
	 * Values: "none", "uppercase", "lowercase", "capitalize"
	 */
	contentTextTransform: {
		type: 'string',
		default: null,
	},

	/**
	 * Content text decoration
	 * Values: "none", "underline", "overline", "line-through"
	 */
	contentTextDecoration: {
		type: 'string',
		default: null,
	},
};

export default typographyAttributes;
