/**
 * ARIA Helpers
 *
 * Utility functions for generating accessible ARIA attributes.
 * Ensures proper relationships between interactive elements and their content.
 *
 * @see docs/01-QUICK-REFERENCE.md
 * @see docs/BLOCKS/31-ACCORDION-SPEC.md
 * @package
 * @since 1.0.0
 */

/**
 * Generate ARIA attributes for accordion button (title)
 *
 * @param {string}  id     - Unique accordion ID
 * @param {boolean} isOpen - Whether accordion is currently open
 * @return {Object} ARIA attributes object
 *
 * @example
 * getAccordionButtonAria('acc-a7b3', true)
 * // Returns: {
 * //   'aria-expanded': 'true',
 * //   'aria-controls': 'acc-a7b3-content',
 * //   id: 'acc-a7b3-header'
 * // }
 */
export function getAccordionButtonAria( id, isOpen ) {
	return {
		'aria-expanded': isOpen ? 'true' : 'false',
		'aria-controls': `${ id }-content`,
		id: `${ id }-header`,
	};
}

/**
 * Generate ARIA attributes for accordion content panel
 *
 * @param {string} id - Unique accordion ID
 * @return {Object} ARIA attributes object
 *
 * @example
 * getAccordionPanelAria('acc-a7b3')
 * // Returns: {
 * //   role: 'region',
 * //   'aria-labelledby': 'acc-a7b3-header',
 * //   id: 'acc-a7b3-content'
 * // }
 */
export function getAccordionPanelAria( id ) {
	return {
		role: 'region',
		'aria-labelledby': `${ id }-header`,
		id: `${ id }-content`,
	};
}

/**
 * Generate ARIA attributes for tab button
 *
 * @param {string}  id         - Unique tab ID
 * @param {boolean} isSelected - Whether tab is currently selected
 * @return {Object} ARIA attributes object
 *
 * @example
 * getTabButtonAria('tabs-k9z2-1', true)
 * // Returns: {
 * //   role: 'tab',
 * //   'aria-selected': 'true',
 * //   'aria-controls': 'tabs-k9z2-1-panel',
 * //   id: 'tabs-k9z2-1-tab',
 * //   tabIndex: 0
 * // }
 */
export function getTabButtonAria( id, isSelected ) {
	return {
		role: 'tab',
		'aria-selected': isSelected ? 'true' : 'false',
		'aria-controls': `${ id }-panel`,
		id: `${ id }-tab`,
		tabIndex: isSelected ? 0 : -1,
	};
}

/**
 * Generate ARIA attributes for tab panel
 *
 * @param {string}  id         - Unique tab ID
 * @param {boolean} isSelected - Whether tab is currently selected
 * @return {Object} ARIA attributes object
 *
 * @example
 * getTabPanelAria('tabs-k9z2-1', true)
 * // Returns: {
 * //   role: 'tabpanel',
 * //   'aria-labelledby': 'tabs-k9z2-1-tab',
 * //   id: 'tabs-k9z2-1-panel',
 * //   tabIndex: 0
 * // }
 */
export function getTabPanelAria( id, isSelected ) {
	return {
		role: 'tabpanel',
		'aria-labelledby': `${ id }-tab`,
		id: `${ id }-panel`,
		tabIndex: isSelected ? 0 : -1,
	};
}

/**
 * Generate ARIA attributes for tab list container
 *
 * @param {string} label       - Accessible label for the tab list
 * @param {string} orientation - Tab orientation: 'horizontal' or 'vertical'
 * @return {Object} ARIA attributes object
 *
 * @example
 * getTabListAria('Product Features', 'horizontal')
 * // Returns: {
 * //   role: 'tablist',
 * //   'aria-label': 'Product Features',
 * //   'aria-orientation': 'horizontal'
 * // }
 */
export function getTabListAria( label, orientation = 'horizontal' ) {
	return {
		role: 'tablist',
		'aria-label': label,
		'aria-orientation': orientation,
	};
}

/**
 * Generate ARIA attributes for TOC navigation
 *
 * @param {string} label - Accessible label for the TOC (default: "Table of Contents")
 * @return {Object} ARIA attributes object
 *
 * @example
 * getTOCNavAria('Page Contents')
 * // Returns: {
 * //   role: 'navigation',
 * //   'aria-label': 'Page Contents'
 * // }
 */
export function getTOCNavAria( label = 'Table of Contents' ) {
	return {
		role: 'navigation',
		'aria-label': label,
	};
}

/**
 * Generate ARIA live region attributes for announcements
 *
 * @param {string} politeness - 'polite', 'assertive', or 'off'
 * @return {Object} ARIA attributes object
 *
 * @example
 * getLiveRegionAria('polite')
 * // Returns: {
 * //   'aria-live': 'polite',
 * //   'aria-atomic': 'true'
 * // }
 */
export function getLiveRegionAria( politeness = 'polite' ) {
	return {
		'aria-live': politeness,
		'aria-atomic': 'true',
	};
}

/**
 * Generate ID for content panel from header ID
 *
 * @param {string} headerId - Header/button ID
 * @return {string} Content panel ID
 *
 * @example
 * getContentIdFromHeaderId('acc-a7b3-header')
 * // Returns: 'acc-a7b3-content'
 */
export function getContentIdFromHeaderId( headerId ) {
	return headerId.replace( '-header', '-content' );
}

/**
 * Generate ID for header/button from content panel ID
 *
 * @param {string} contentId - Content panel ID
 * @return {string} Header/button ID
 *
 * @example
 * getHeaderIdFromContentId('acc-a7b3-content')
 * // Returns: 'acc-a7b3-header'
 */
export function getHeaderIdFromContentId( contentId ) {
	return contentId.replace( '-content', '-header' );
}
