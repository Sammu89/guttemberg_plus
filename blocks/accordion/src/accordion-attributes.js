/**
 * Accordion Block Attributes
 *
 * Combines shared attributes with accordion-specific attributes.
 * All customizable attributes default to null (CSS-based or inherited at runtime).
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

import {
	colorAttributes,
	typographyAttributes,
	borderAttributes,
	spacingAttributes,
	iconAttributes,
	metaAttributes,
} from '@shared';

/**
 * Accordion-specific behavioral attributes
 * These don't come from CSS but have hardcoded defaults
 */
const accordionSpecificAttributes = {
	/**
	 * Allow multiple items to be open simultaneously
	 * Only relevant when multiple accordions on page work together
	 */
	allowMultipleOpen: {
		type: 'boolean',
		default: false,
	},
};

/**
 * Complete accordion block attributes
 * Merges all shared attributes with accordion-specific ones
 */
export const accordionAttributes = {
	// Meta/structural attributes (not customizable)
	...metaAttributes,

	// Customizable color attributes (all default to null)
	...colorAttributes,

	// Customizable typography attributes (all default to null)
	...typographyAttributes,

	// Customizable border attributes (all default to null)
	...borderAttributes,

	// Customizable spacing attributes (all default to null)
	...spacingAttributes,

	// Customizable icon attributes (mix of null and behavioral)
	...iconAttributes,

	// Accordion-specific behavioral attributes
	...accordionSpecificAttributes,
};

export default accordionAttributes;
