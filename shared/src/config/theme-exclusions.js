/**
 * Theme Customization Exclusions Configuration
 *
 * Defines which attributes should be excluded from theme customization checks.
 * These are typically structural identifiers, meta attributes, or behavioral
 * settings that should not be considered when determining if a block is customized.
 *
 * NOTE: Accordion exclusions are now imported from the generated file.
 * Tabs and TOC will be migrated in future phases.
 *
 * @package
 * @since 1.0.0
 */

// Import exclusions from generated files
import { ACCORDION_EXCLUSIONS } from './accordion-exclusions.js';
import { TABS_EXCLUSIONS } from './tabs-exclusions.js';
import { TOC_EXCLUSIONS } from './toc-exclusions.js';

/**
 * Get exclusions for a specific block type
 *
 * @param {string} blockType - 'accordion', 'tabs', or 'toc'
 * @return {string[]} Array of attribute names to exclude from customization checks
 */
export function getExclusionsForBlock( blockType ) {
	switch ( blockType ) {
		case 'accordion':
			return ACCORDION_EXCLUSIONS;
		case 'tabs':
			return TABS_EXCLUSIONS;
		case 'toc':
			return TOC_EXCLUSIONS;
		default:
			console.warn( `Unknown block type: ${ blockType }. Returning empty exclusions.` );
			return [];
	}
}

/**
 * Export individual exclusion lists for direct access if needed
 */
export { ACCORDION_EXCLUSIONS, TABS_EXCLUSIONS, TOC_EXCLUSIONS };
