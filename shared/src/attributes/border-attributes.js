/**
 * Border Attributes
 *
 * Defines all border-related attributes for blocks.
 * All defaults are null - actual values come from CSS via PHP parsing.
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

/**
 * Border attribute definitions
 *
 * All customizable border attributes default to null.
 * Actual default values are defined in CSS files and parsed by PHP.
 */
export const borderAttributes = {
	/**
	 * Accordion border thickness (in pixels)
	 */
	accordionBorderThickness: {
		type: 'number',
		default: null,
	},

	/**
	 * Accordion border style
	 * Values: "none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset", "hidden"
	 */
	accordionBorderStyle: {
		type: 'string',
		default: null,
	},

	/**
	 * Accordion border radius
	 * Object with individual corner values
	 */
	accordionBorderRadius: {
		type: 'object',
		default: null,
	},

	/**
	 * Border width (generic)
	 */
	borderWidth: {
		type: 'string',
		default: null,
	},

	/**
	 * Border radius (generic)
	 */
	borderRadius: {
		type: 'string',
		default: null,
	},

	/**
	 * Accordion shadow (CSS box-shadow value)
	 */
	accordionShadow: {
		type: 'string',
		default: null,
	},

	/**
	 * Divider border thickness (between title and content, in pixels)
	 */
	dividerBorderThickness: {
		type: 'number',
		default: null,
	},

	/**
	 * Divider border style
	 * Values: "none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset", "hidden"
	 */
	dividerBorderStyle: {
		type: 'string',
		default: null,
	},
};

export default borderAttributes;
