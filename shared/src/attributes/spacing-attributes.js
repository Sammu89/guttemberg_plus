/**
 * Spacing Attributes
 *
 * Defines all spacing-related attributes for blocks (padding, margin).
 * All defaults are null - actual values come from CSS via PHP parsing.
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

/**
 * Spacing attribute definitions
 *
 * All customizable spacing attributes default to null.
 * Actual default values are defined in CSS files and parsed by PHP.
 */
export const spacingAttributes = {
	/**
	 * Title padding
	 * Object with properties: top, right, bottom, left (all in pixels)
	 */
	titlePadding: {
		type: 'object',
		default: null,
	},

	/**
	 * Content padding
	 * Object with properties: top, right, bottom, left (all in pixels)
	 */
	contentPadding: {
		type: 'object',
		default: null,
	},

	/**
	 * Accordion margin bottom (spacing between accordion blocks, in pixels)
	 */
	accordionMarginBottom: {
		type: 'number',
		default: null,
	},

	/**
	 * Item spacing (for tabs/TOC)
	 */
	itemSpacing: {
		type: 'number',
		default: null,
	},
};

export default spacingAttributes;
