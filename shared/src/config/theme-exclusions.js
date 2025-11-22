/**
 * Theme Customization Exclusions Configuration
 *
 * Defines which attributes should be excluded from theme customization checks.
 * These are typically structural identifiers, meta attributes, or behavioral
 * settings that should not be considered when determining if a block is customized.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Accordion block exclusions
 * Attributes excluded from theme customization checks
 */
const ACCORDION_EXCLUSIONS = [
	// Structural identifiers (not themeable)
	'accordionId',
	'uniqueId',
	'blockId',
	'title',
	'content',
	// Meta attributes (not themeable)
	'currentTheme',
	// Behavioral settings (not themeable - per-block only)
	'initiallyOpen',
	'allowMultipleOpen',
	// Block layout settings (not themeable - per-block only)
	'accordionWidth',
	'accordionHorizontalAlign',
];

/**
 * Tabs block exclusions
 * Attributes excluded from theme customization checks
 */
const TABS_EXCLUSIONS = [
	// Structural identifiers (not themeable)
	'tabs',
	'uniqueId',
	'blockId',
	// Meta attributes (not themeable)
	'currentTheme',
	// Behavioral settings (not themeable - per-block only)
	'orientation',
	'activationMode',
	'currentTab',
	'responsiveBreakpoint',
	'enableResponsiveFallback',
];

/**
 * TOC block exclusions
 * Attributes excluded from theme customization checks
 */
const TOC_EXCLUSIONS = [
	'tocId',
	'showTitle',
	'titleText',
	'currentTheme',
	'includeH2',
	'includeH3',
	'includeH4',
	'includeH5',
	'includeH6',
	'scrollBehavior',
	'scrollOffset',
	'filterMode',
	'includeLevels',
	'includeClasses',
	'excludeLevels',
	'excludeClasses',
	'depthLimit',
	'numberingStyle',
	'isCollapsible',
	'initiallyCollapsed',
	'clickBehavior',
];

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
