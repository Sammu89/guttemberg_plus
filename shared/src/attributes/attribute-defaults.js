/**
 * Attribute Schema Defaults
 *
 * Extracts default values from attribute schemas for use in cascade resolution.
 * These are "behavioral defaults" - non-CSS configuration with hardcoded values.
 *
 * @package
 * @since 1.0.0
 */

import { iconAttributes } from './icon-attributes';
import { metaAttributes } from './meta-attributes';

/**
 * Extract default values from attribute definitions
 *
 * @param {Object} attributes - Attribute definitions object
 * @return {Object} Object containing only the default values
 */
function extractDefaults( attributes ) {
	const defaults = {};
	for ( const [ key, definition ] of Object.entries( attributes ) ) {
		if ( definition.default !== undefined && definition.default !== null ) {
			defaults[ key ] = definition.default;
		}
	}
	return defaults;
}

/**
 * Behavioral defaults for accordion/tabs blocks
 * These are non-CSS attributes with schema-defined defaults
 */
export const behavioralDefaults = {
	// Icon settings
	...extractDefaults( iconAttributes ),

	// Meta/behavioral settings
	...extractDefaults( metaAttributes ),
};

/**
 * Get all defaults for a block (behavioral + CSS)
 *
 * @param {Object} cssDefaults - CSS defaults from window.{blockType}Defaults
 * @return {Object} Combined defaults
 */
export function getAllDefaults( cssDefaults = {} ) {
	return {
		...behavioralDefaults,
		...cssDefaults, // CSS defaults override behavioral if there's overlap
	};
}

export default behavioralDefaults;
