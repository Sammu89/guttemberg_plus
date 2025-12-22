/**
 * Custom Hook: useCSSDefaults
 *
 * Standardizes CSS defaults access pattern used by all blocks.
 * Provides memoized CSS defaults from window object.
 *
 * @param {string} blockType - Block type identifier ('accordion', 'tabs', 'toc')
 * @return {Object} CSS defaults object
 *
 * @example
 * ```javascript
 * import { useCSSDefaults } from '@shared';
 *
 * function MyBlockEdit() {
 *     const cssDefaults = useCSSDefaults('accordion');
 *
 *     // Access defaults
 *     const defaultColor = cssDefaults.titleColor || '#000000';
 *     const defaultFontSize = cssDefaults.titleFontSize || '16px';
 *
 *     return <div style={{ color: defaultColor }}>Content</div>;
 * }
 * ```
 *
 * @package
 * @since 1.0.0
 */

import { useMemo } from '@wordpress/element';

/**
 * Hook to get CSS defaults for a block type
 *
 * CSS defaults are loaded from the window object where they're
 * injected by PHP during block registration. Format: window.{blockType}Defaults
 *
 * Examples:
 * - window.accordionDefaults
 * - window.tabsDefaults
 * - window.tocDefaults
 *
 * @param {string} blockType - Block type ('accordion', 'tabs', 'toc')
 * @return {Object} CSS defaults object - Empty object if not found
 */
export function useCSSDefaults( blockType ) {
	return useMemo( () => {
		const windowKey = `${ blockType }Defaults`;
		return window[ windowKey ] || {};
	}, [ blockType ] );
}

export default useCSSDefaults;
