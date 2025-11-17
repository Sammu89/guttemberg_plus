/**
 * Meta Attributes
 *
 * Defines all meta/operational attributes for blocks.
 * These are NOT customizable and NOT stored in themes.
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

/**
 * Meta attribute definitions
 *
 * These attributes manage block state and identity.
 * None participate in the cascade system.
 */
export const metaAttributes = {
	/**
	 * Current active theme name
	 * Empty string = "Default" theme
	 */
	currentTheme: {
		type: 'string',
		default: '',
	},

	/**
	 * Block-level customizations
	 * Stores inline overrides that win in cascade
	 */
	customizations: {
		type: 'object',
		default: {},
	},

	/**
	 * Session-only customization cache
	 * Preserves customizations during theme switching
	 * NOT serialized to post content
	 */
	customizationCache: {
		type: 'object',
		default: {},
	},

	/**
	 * Unique block identifier
	 * Auto-generated on block creation
	 * Format: {prefix}-{4 alphanumeric chars}
	 */
	uniqueId: {
		type: 'string',
		default: '',
	},

	/**
	 * Block ID (for accordion/tabs/toc specific identification)
	 * Auto-generated on block creation
	 */
	blockId: {
		type: 'string',
		default: '',
	},

	/**
	 * Accordion ID (accordion-specific)
	 */
	accordionId: {
		type: 'string',
		default: '',
	},

	/**
	 * Whether block is initially open (accordion/tabs)
	 * Structural attribute, not customizable
	 */
	initiallyOpen: {
		type: 'boolean',
		default: false,
	},

	/**
	 * Heading level for semantic HTML
	 * Values: "none", "h1", "h2", "h3", "h4", "h5", "h6"
	 * Behavioral attribute with hardcoded default
	 */
	headingLevel: {
		type: 'string',
		default: 'none',
	},

	/**
	 * Whether to apply default heading styles
	 * Behavioral attribute with hardcoded default
	 */
	useHeadingStyles: {
		type: 'boolean',
		default: false,
	},

	/**
	 * Block title text
	 * Structural attribute, not customizable
	 */
	title: {
		type: 'string',
		default: 'Accordion Title',
	},

	/**
	 * Block content (rich text)
	 * Structural attribute, not customizable
	 */
	content: {
		type: 'string',
		default: '',
	},
};

export default metaAttributes;
