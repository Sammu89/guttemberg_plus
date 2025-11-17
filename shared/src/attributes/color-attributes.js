/**
 * Color Attributes
 *
 * Defines all color-related attributes for blocks.
 * All defaults are null - actual values come from CSS via PHP parsing.
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

/**
 * Color attribute definitions
 *
 * All customizable color attributes default to null.
 * Actual default values are defined in CSS files and parsed by PHP.
 */
export const colorAttributes = {
	/**
	 * Title text color
	 */
	titleColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Title background color
	 */
	titleBackgroundColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Content text color
	 */
	contentColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Content background color
	 */
	contentBackgroundColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Border color
	 */
	borderColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Accordion border color (specific naming)
	 */
	accordionBorderColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Divider border color (between title and content)
	 */
	dividerBorderColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Icon color
	 * When null, inherits from titleColor at runtime
	 */
	iconColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Hover state - title text color
	 * When null, inherits from titleColor at runtime
	 */
	hoverTitleColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Hover state - title background color
	 */
	hoverTitleBackgroundColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Active state - title text color (when accordion is open)
	 * When null, inherits from titleColor at runtime
	 */
	activeTitleColor: {
		type: 'string',
		default: null,
	},

	/**
	 * Active state - title background color (when accordion is open)
	 * When null, inherits from titleBackgroundColor at runtime
	 */
	activeTitleBackgroundColor: {
		type: 'string',
		default: null,
	},
};

export default colorAttributes;
