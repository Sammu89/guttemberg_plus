/**
 * Custom Hook: useThemeState
 *
 * Manages theme-related state including session cache, expected values calculation,
 * and customization detection. Centralizes duplicated state logic from all block edit.js files.
 *
 * @param {Object} options Configuration options
 * @param {string} options.blockType - Block type identifier ('accordion', 'tabs', 'toc')
 * @param {Object} options.attributes - Block attributes
 * @param {Object} options.themes - Themes object from store
 * @param {boolean} options.themesLoaded - Whether themes have been loaded
 * @param {Object} options.allDefaults - All default values (CSS + behavioral)
 * @param {Object} options.schema - Block schema for deriving exclusions
 * @return {Object} Theme state interface
 *
 * @example
 * ```javascript
 * import { useThemeState } from '@shared';
 *
 * function MyBlockEdit({ attributes, setAttributes }) {
 *     const { themes, themesLoaded } = useBlockThemes('accordion');
 *     const allDefaults = useMemo(() => getAllDefaults(schemaDefaults), [schemaDefaults]);
 *
 *     const {
 *         sessionCache,
 *         setSessionCache,
 *         expectedValues,
 *         isCustomized,
 *         excludeFromCustomizationCheck,
 *     } = useThemeState({
 *         blockType: 'accordion',
 *         attributes,
 *         themes,
 *         themesLoaded,
 *         allDefaults,
 *         schema: accordionSchema,
 *     });
 * }
 * ```
 *
 * @package
 * @since 1.0.0
 */

import { useState, useMemo, useEffect } from '@wordpress/element';
import { applyDeltas, getThemeableSnapshot } from '../utils/delta-calculator';
import { debug } from '../utils/debug';

/**
 * Hook to manage theme state
 *
 * @param {Object} options Configuration object
 * @return {Object} Theme state interface
 */
export function useThemeState( {
	blockType,
	attributes,
	themes,
	themesLoaded,
	allDefaults,
	schema,
} ) {
	// SESSION-ONLY customization cache (not saved to database)
	// Stores snapshots PER THEME: { "": {...}, "Dark Mode": {...} }
	// Allows switching between themes and keeping customizations during session
	// Discarded on page reload (React state only)
	const [ sessionCache, setSessionCache ] = useState( {} );

	// Derive exclusions from schema (attributes where themeable !== true)
	const excludeFromCustomizationCheck = useMemo( () => {
		if ( ! schema?.attributes ) {
			return [];
		}
		return Object.entries( schema.attributes )
			.filter( ( [ , attr ] ) => attr.themeable !== true )
			.map( ( [ key ] ) => key );
	}, [ schema ] );

	// Get current theme object
	const currentTheme = themes[ attributes.currentTheme ];

	// Calculate expected values: defaults + current theme deltas
	// Memoized to prevent infinite loop in session cache useEffect
	const expectedValues = useMemo( () => {
		const expected = currentTheme
			? applyDeltas( allDefaults, currentTheme.values || {} )
			: allDefaults;
		return expected;
	}, [ currentTheme, allDefaults ] );

	// Auto-detect customizations by comparing attributes to expected values
	// Memoized to avoid recalculation on every render
	// IMPORTANT: Wait for themes to load before checking customization
	const isCustomized = useMemo( () => {
		// Don't check customization until themes are loaded
		// This prevents false positives when theme deltas haven't loaded yet
		if ( ! themesLoaded ) {
			return false;
		}

		// If block has a theme but it doesn't exist in themes object, wait
		if ( attributes.currentTheme && ! themes[ attributes.currentTheme ] ) {
			return false;
		}

		const result = Object.keys( attributes ).some( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return false;
			}

			const attrValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			// Skip undefined/null values
			if ( attrValue === undefined || attrValue === null ) {
				return false;
			}

			// Compare (deep comparison for objects)
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				return JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			}
			return attrValue !== expectedValue;
		} );

		return result;
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, themesLoaded, themes ] );

	// Auto-update session cache for CURRENT theme
	// Maintains per-block customization memory across theme switches
	// IMPORTANT: Only update cache when themes are fully loaded to avoid premature caching
	useEffect( () => {
		// GUARD: Skip cache update if themes aren't loaded yet
		if ( ! themesLoaded ) {
			return;
		}

		const snapshot = getThemeableSnapshot( attributes, excludeFromCustomizationCheck );
		const currentThemeKey = attributes.currentTheme || '';

		// Check if snapshot differs from expected values
		const hasCustomizations = Object.keys( snapshot ).some( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return false;
			}

			const snapshotValue = snapshot[ key ];
			const expectedValue = expectedValues[ key ];

			if ( snapshotValue === undefined || snapshotValue === null ) {
				return false;
			}

			if ( typeof snapshotValue === 'object' && snapshotValue !== null ) {
				return JSON.stringify( snapshotValue ) !== JSON.stringify( expectedValue );
			}

			return snapshotValue !== expectedValue;
		} );

		// IMPORTANT: Only UPDATE cache when there ARE customizations
		// NEVER delete from cache automatically - only manual operations should clear cache
		if ( hasCustomizations ) {
			setSessionCache( ( prev ) => {
				const existingCache = prev[ currentThemeKey ];
				const snapshotStr = JSON.stringify( snapshot );
				const existingStr = JSON.stringify( existingCache );

				if ( snapshotStr !== existingStr ) {
					debug( `[${ blockType.toUpperCase() }] [SESSION CACHE] Updating cache for theme:`, currentThemeKey );
					return {
						...prev,
						[ currentThemeKey ]: snapshot,
					};
				}
				return prev;
			} );
		}
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, themesLoaded, blockType ] );

	// Debug logging when theme changes
	useEffect( () => {
		debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] currentTheme changed to:`, attributes.currentTheme );
		debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] isCustomized:`, isCustomized );
		debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] Available themes:`, Object.keys( themes ) );
	}, [ attributes.currentTheme, blockType, isCustomized, themes ] );

	return {
		sessionCache,
		setSessionCache,
		expectedValues,
		isCustomized,
		excludeFromCustomizationCheck,
		currentTheme,
	};
}

export default useThemeState;
