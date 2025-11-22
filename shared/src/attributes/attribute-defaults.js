/**
 * Attribute Schema Defaults
 *
 * Simplified - just uses schema-generated attributes as single source of truth.
 * All defaults come from schemas/*.json via auto-generated files.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Get all defaults for a block
 *
 * Uses schema-generated attributes as single source of truth.
 * Schema defaults contain ALL attribute defaults (behavioral + themeable).
 *
 * @param {Object} schemaDefaults - Defaults from schema-generated accordion-attributes.js
 * @return {Object} All defaults
 */
export function getAllDefaults( schemaDefaults = {} ) {
	// Schema is the single source of truth!
	// No need for separate behavioral/CSS defaults - schema has everything
	return schemaDefaults;
}

export default getAllDefaults;
