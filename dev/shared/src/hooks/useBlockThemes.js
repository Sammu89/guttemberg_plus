/**
 * Custom Hook: useBlockThemes
 *
 * Encapsulates theme loading pattern used by all blocks.
 * Handles theme store access, automatic loading, and provides theme actions.
 *
 * @param {string} blockType - Block type identifier ('accordion', 'tabs', 'toc')
 * @return {Object} Theme system interface
 *
 * @example
 * ```javascript
 * import { useBlockThemes } from '@shared';
 *
 * function MyBlockEdit() {
 *     const {
 *         themes,
 *         themesLoaded,
 *         createTheme,
 *         updateTheme,
 *         deleteTheme,
 *     } = useBlockThemes('accordion');
 *
 *     if (!themesLoaded) {
 *         return <Spinner />;
 *     }
 *
 *     return <ThemeSelector themes={themes} />;
 * }
 * ```
 *
 * @package
 * @since 1.0.0
 */

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { STORE_NAME } from '../data';

/**
 * Hook to manage block themes
 *
 * @param {string} blockType - Block type ('accordion', 'tabs', 'toc')
 * @param {Object} attributes - Current block attributes (optional, for currentTheme memoization)
 * @return {Object} Theme system interface
 * @return {Object} return.themes - Themes object keyed by theme name
 * @return {boolean} return.themesLoaded - Whether themes have been loaded from server
 * @return {Object|undefined} return.currentTheme - Current theme object (memoized)
 * @return {Function} return.loadThemes - Manually trigger theme loading
 * @return {Function} return.createTheme - Create new theme (blockType, name, values)
 * @return {Function} return.updateTheme - Update existing theme (blockType, name, values)
 * @return {Function} return.deleteTheme - Delete theme (blockType, name)
 * @return {Function} return.renameTheme - Rename theme (blockType, oldName, newName)
 */
export function useBlockThemes( blockType, attributes = null ) {
	// Load themes from store
	const { themes, themesLoaded } = useSelect(
		( select ) => {
			const { getThemes, areThemesLoaded } = select( STORE_NAME );
			return {
				themes: getThemes( blockType ) || {},
				themesLoaded: areThemesLoaded( blockType ),
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// Empty deps array is correct - STORE_NAME is constant and select() doesn't need deps
		[ blockType ]
	);

	// Get theme action dispatchers
	const { loadThemes, createTheme, updateTheme, deleteTheme, renameTheme } =
		useDispatch( STORE_NAME );

	// Load themes on mount if not already loaded
	useEffect( () => {
		if ( ! themesLoaded ) {
			loadThemes( blockType );
		}
	}, [ themesLoaded, loadThemes, blockType ] );

	// CRITICAL: Memoize currentTheme to prevent infinite loops
	// This creates a stable reference that only changes when the actual theme changes
	const currentTheme = useMemo(
		() => attributes?.currentTheme ? themes[ attributes.currentTheme ] : undefined,
		[ themes, attributes?.currentTheme ]
	);

	return {
		themes,
		themesLoaded,
		currentTheme,
		loadThemes,
		createTheme,
		updateTheme,
		deleteTheme,
		renameTheme,
	};
}

export default useBlockThemes;
