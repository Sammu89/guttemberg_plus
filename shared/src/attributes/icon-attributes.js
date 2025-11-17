/**
 * Icon Attributes
 *
 * Defines all icon-related attributes for blocks.
 * Mix of CSS-based (null default) and behavioral (hardcoded default) attributes.
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

/**
 * Icon attribute definitions
 *
 * Most icon attributes default to null (CSS-based).
 * Some have hardcoded behavioral defaults (showIcon, iconPosition, iconTypeClosed, iconTypeOpen, iconRotation).
 */
export const iconAttributes = {
	/**
	 * Show/hide icon
	 * Behavioral attribute with hardcoded default
	 */
	showIcon: {
		type: 'boolean',
		default: true,
	},

	/**
	 * Icon position relative to title
	 * Values: "left", "right", "extreme-left", "extreme-right"
	 * Behavioral attribute with hardcoded default
	 */
	iconPosition: {
		type: 'string',
		default: 'right',
	},

	/**
	 * Icon size (in pixels)
	 * When null, inherits from titleFontSize at runtime
	 */
	iconSize: {
		type: 'number',
		default: null,
	},

	/**
	 * Icon type when closed
	 * Character, emoji, or image URL
	 * Behavioral attribute with hardcoded default
	 */
	iconTypeClosed: {
		type: 'string',
		default: '▾',
	},

	/**
	 * Icon type when open
	 * Character, emoji, image URL, or "none" (uses rotation instead)
	 * Behavioral attribute with hardcoded default
	 */
	iconTypeOpen: {
		type: 'string',
		default: 'none',
	},

	/**
	 * Icon rotation angle when open (in degrees)
	 * Only used if iconTypeOpen is "none"
	 * Behavioral attribute with hardcoded default
	 */
	iconRotation: {
		type: 'number',
		default: 180,
	},
};

export default iconAttributes;
