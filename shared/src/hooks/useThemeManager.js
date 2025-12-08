/**
 * Custom Hook: useThemeManager
 *
 * Comprehensive theme management hook that encapsulates ALL theme-related logic
 * including loading, customization detection, session cache, and handlers.
 * This eliminates repetitive code across block edit components.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.blockType - Block type ('accordion', 'tabs', 'toc')
 * @param {Object} config.schema - Block schema object
 * @param {Object} config.attributes - Current block attributes
 * @param {Function} config.setAttributes - WordPress setAttributes function
 * @param {Object} config.allDefaults - All defaults (schema + CSS)
 * @return {Object} Complete theme system interface
 *
 * @example
 * ```javascript
 * import { useThemeManager } from '@shared';
 *
 * function MyBlockEdit({ attributes, setAttributes }) {
 *     const {
 *         themes,
 *         themesLoaded,
 *         currentTheme,
 *         expectedValues,
 *         isCustomized,
 *         sessionCache,
 *         handlers: {
 *             handleSaveNewTheme,
 *             handleUpdateTheme,
 *             handleDeleteTheme,
 *             handleRenameTheme,
 *             handleResetCustomizations,
 *             handleThemeChange,
 *         }
 *     } = useThemeManager({
 *         blockType: 'accordion',
 *         schema: accordionSchema,
 *         attributes,
 *         setAttributes,
 *         allDefaults,
 *     });
 *
 *     if (!themesLoaded) return <Spinner />;
 *     return <ThemeSelector {...handlers} />;
 * }
 * ```
 *
 * @package
 * @since 1.0.0
 */

import { useEffect, useState, useMemo, useCallback, useRef } from '@wordpress/element';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { flushSync } from 'react-dom';
import { STORE_NAME } from '../data';
import {
	calculateDeltas,
	applyDeltas,
	getThemeableSnapshot,
} from '../utils/delta-calculator';
import { debug } from '../utils/debug';

/**
 * Main theme manager hook
 *
 * @param {Object} config - Configuration object
 * @return {Object} Theme system interface
 */
export function useThemeManager( {
	blockType,
	schema,
	attributes,
	setAttributes,
	allDefaults,
} ) {
	// ========================================
	// 0. SKIP FLAG FOR AUTO-UPDATE CUSTOMIZATIONS
	// ========================================

	// When we perform theme operations (save, update, delete, reset), we want to
	// prevent the auto-update customizations useEffect from immediately running
	// and recalculating customizations. This flag skips one cycle.
	const skipNextCustomizationsUpdate = useRef( false );

	// ========================================
	// 1. THEME LOADING
	// ========================================

	// Load themes from store with proper memoization
	const { themes, themesLoaded } = useSelect(
		( select ) => {
			const { getThemes, areThemesLoaded } = select( STORE_NAME );
			const loadedThemes = getThemes( blockType ) || {};
			const loaded = areThemesLoaded( blockType );

			return {
				themes: loadedThemes,
				themesLoaded: loaded,
			};
		},
		[ blockType ]
	);

	// Get theme action dispatchers
	const { loadThemes, createTheme, updateTheme, deleteTheme, renameTheme } =
		useDispatch( STORE_NAME );

	// Auto-load themes on mount
	useEffect( () => {
		if ( ! themesLoaded ) {
			loadThemes( blockType );
		}
	}, [ themesLoaded, loadThemes, blockType ] );

	// ========================================
	// 2. MEMOIZED EXCLUSIONS LIST
	// ========================================

	// CRITICAL: Memoize to prevent infinite loops in effects
	// Always exclude 'customizations' - it's a meta-attribute not in schema
	const excludeFromCustomizationCheck = useMemo(
		() => {
			const schemaExclusions = Object.entries( schema.attributes )
				.filter( ( [ , attr ] ) => attr.themeable !== true )
				.map( ( [ key ] ) => key );

			// Always exclude 'customizations' - it's defined in block.json, not schema
			if ( ! schemaExclusions.includes( 'customizations' ) ) {
				schemaExclusions.push( 'customizations' );
			}

			return schemaExclusions;
		},
		[ schema ]
	);

	// ========================================
	// 3. CURRENT THEME & EXPECTED VALUES
	// ========================================

	// CRITICAL: Memoize to prevent infinite loops
	const currentTheme = useMemo(
		() => themes[ attributes.currentTheme ],
		[ themes, attributes.currentTheme ]
	);

	// Calculate expected values (defaults + current theme deltas)
	const expectedValues = useMemo( () => {
		const expected = currentTheme
			? applyDeltas( allDefaults, currentTheme.values || {} )
			: allDefaults;
		return expected;
	}, [ currentTheme, allDefaults ] );

	// ========================================
	// 4. CUSTOMIZATION DETECTION
	// ========================================

	// Auto-detect if block has customizations vs expected theme
	const isCustomized = useMemo( () => {
		// Wait for themes to load
		if ( ! themesLoaded ) {
			return false;
		}

		// If theme selected but not found, wait
		if ( attributes.currentTheme && ! themes[ attributes.currentTheme ] ) {
			return false;
		}

		// Check if any attribute differs from expected
		const differences = [];

		const hasCustomizations = Object.keys( attributes ).some( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return false;
			}

			const attrValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			// Skip undefined/null attribute values
			if ( attrValue === undefined || attrValue === null ) {
				return false;
			}

			// Skip if expected value is undefined (attribute not in defaults/theme)
			// This prevents false positives when attributes exist but aren't themeable defaults
			if ( expectedValue === undefined ) {
				return false;
			}

			// Deep comparison for objects
			let isDifferent = false;
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			} else {
				isDifferent = attrValue !== expectedValue;
			}

			if ( isDifferent ) {
				differences.push( { key, attrValue, expectedValue } );
			}

			return isDifferent;
		} );

		// Debug logging
		if ( differences.length > 0 ) {
			console.log( '\n[IS_CUSTOMIZED] Found differences:' );
			differences.forEach( ( { key, attrValue, expectedValue } ) => {
				console.log( `  - ${ key }:`, attrValue, '!==', expectedValue );
			} );
		}

		return hasCustomizations;
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, themesLoaded, themes ] );

	// ========================================
	// 5. SESSION CACHE (in-memory only)
	// ========================================

	const [ sessionCache, setSessionCache ] = useState( {} );

	// Auto-update session cache when customizations change
	useEffect( () => {
		// Wait for themes to load
		if ( ! themesLoaded ) {
			return;
		}

		const snapshot = getThemeableSnapshot( attributes, excludeFromCustomizationCheck );
		const currentThemeKey = attributes.currentTheme || '';

		// Check if snapshot differs from expected
		const hasCustomizations = Object.keys( snapshot ).some( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return false;
			}

			const snapshotValue = snapshot[ key ];
			const expectedValue = expectedValues[ key ];

			if ( snapshotValue === undefined || snapshotValue === null ) {
				return false;
			}

			// Skip if expected value is undefined (attribute not in defaults/theme)
			if ( expectedValue === undefined ) {
				return false;
			}

			if ( typeof snapshotValue === 'object' && snapshotValue !== null ) {
				return JSON.stringify( snapshotValue ) !== JSON.stringify( expectedValue );
			}

			return snapshotValue !== expectedValue;
		} );

		// Only update cache if there ARE customizations
		if ( hasCustomizations ) {
			setSessionCache( ( prev ) => {
				const existingCache = prev[ currentThemeKey ];
				const snapshotStr = JSON.stringify( snapshot );
				const existingStr = JSON.stringify( existingCache );

				if ( snapshotStr !== existingStr ) {
					debug( `[SESSION CACHE] [${ blockType.toUpperCase() }] Updating cache for theme:`, currentThemeKey );
					return {
						...prev,
						[ currentThemeKey ]: snapshot,
					};
				}
				return prev;
			} );
		}
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, themesLoaded, blockType ] );

	// ========================================
	// 6. AUTO-UPDATE CUSTOMIZATIONS ATTRIBUTE
	// ========================================

	// Update customizations attribute (used by save.js for inline CSS)
	useEffect( () => {
		// CRITICAL: Skip if we just performed a theme operation
		if ( skipNextCustomizationsUpdate.current ) {
			console.log( '\n[AUTO-UPDATE CUSTOMIZATIONS] SKIPPED - Theme operation just completed' );
			skipNextCustomizationsUpdate.current = false;
			return;
		}

		console.log( '\n[AUTO-UPDATE CUSTOMIZATIONS] Running...' );

		const newCustomizations = {};

		Object.keys( attributes ).forEach( ( key ) => {
			// CRITICAL: Skip excluded attributes AND customizations itself
			if ( excludeFromCustomizationCheck.includes( key ) || key === 'customizations' ) {
				return;
			}

			const attrValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			if ( attrValue === undefined || attrValue === null ) {
				return;
			}

			// Skip if expected value is undefined (attribute not in defaults/theme)
			if ( expectedValue === undefined ) {
				return;
			}

			// Check if different
			let isDifferent = false;
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			} else {
				isDifferent = attrValue !== expectedValue;
			}

			if ( isDifferent ) {
				newCustomizations[ key ] = attrValue;
				console.log( `  - Found difference in "${ key }":`, attrValue, '!==', expectedValue );
			}
		} );

		// Only update if changed
		const currentCustomizations = attributes.customizations || {};
		const newStr = JSON.stringify( newCustomizations );
		const currentStr = JSON.stringify( currentCustomizations );

		if ( newStr !== currentStr ) {
			console.log( '  - Updating customizations attribute:', newCustomizations );
			console.log( '  - This will set isCustomized =', Object.keys( newCustomizations ).length > 0 );
			setAttributes( { customizations: newCustomizations } );
		} else {
			console.log( '  - No changes to customizations' );
		}
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, blockType ] );

	// ========================================
	// 7. THEME HANDLERS
	// ========================================

	/**
	 * Save new theme from current customizations
	 */
	const handleSaveNewTheme = useCallback(
		async ( themeName ) => {
			console.log( '\n[SAVE NEW THEME] Starting for:', themeName );

			const currentThemeKey = attributes.currentTheme || '';
			const cachedSnapshot = sessionCache[ currentThemeKey ];

			console.log( '[SAVE NEW THEME] Current theme:', currentThemeKey || '(Default)' );
			console.log( '[SAVE NEW THEME] Cached snapshot exists?', !!cachedSnapshot );
			console.log( '[SAVE NEW THEME] Cached snapshot keys:', Object.keys( cachedSnapshot || {} ) );

			const currentSnapshot =
				cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
					? cachedSnapshot
					: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

			console.log( '[SAVE NEW THEME] Current snapshot keys:', Object.keys( currentSnapshot ) );
			console.log( '[SAVE NEW THEME] Current snapshot values:', currentSnapshot );

			const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

			console.log( '[SAVE NEW THEME] Calculated deltas keys:', Object.keys( deltas ) );
			console.log( '[SAVE NEW THEME] Calculated deltas values:', deltas );

			if ( Object.keys( deltas ).length === 0 ) {
				console.error( '[SAVE NEW THEME] ERROR: Deltas are empty! Cannot save theme.' );
				return;
			}

			await createTheme( blockType, themeName, deltas );

			// Wait for Redux store to update
			await new Promise( resolve => setTimeout( resolve, 50 ) );

			const newTheme = { values: deltas };
			const newExpectedValues = applyDeltas( allDefaults, newTheme.values || {} );
			const resetAttrs = { ...newExpectedValues };

			excludeFromCustomizationCheck.forEach( ( key ) => {
				if ( key !== 'currentTheme' ) {
					delete resetAttrs[ key ];
				}
			} );

			resetAttrs.currentTheme = themeName;
			resetAttrs.customizations = {};

			console.log( '[SAVE NEW THEME] Setting skip flag to prevent auto-update customizations' );
			skipNextCustomizationsUpdate.current = true;

			flushSync( () => {
				setAttributes( resetAttrs );
			} );

			setSessionCache( ( prev ) => {
				const updated = { ...prev };
				delete updated[ currentThemeKey ];
				delete updated[ themeName ];
				return updated;
			} );

			console.log( '[SAVE NEW THEME] Complete - block should show:', themeName );
		},
		[
			attributes,
			sessionCache,
			excludeFromCustomizationCheck,
			allDefaults,
			createTheme,
			blockType,
			setAttributes,
			themes,
		]
	);

	/**
	 * Update existing theme with current customizations
	 */
	const handleUpdateTheme = useCallback(
		async () => {
			console.log( '\n[UPDATE THEME] Starting for:', attributes.currentTheme );

			const currentThemeKey = attributes.currentTheme || '';
			const cachedSnapshot = sessionCache[ currentThemeKey ];

			const currentSnapshot =
				cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
					? cachedSnapshot
					: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

			const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

			try {
				await updateTheme( blockType, attributes.currentTheme, deltas );
			} catch ( error ) {
				if ( error?.code === 'theme_not_found' || error?.status === 404 ) {
					setAttributes( { currentTheme: '' } );
					return;
				}
				throw error;
			}

			const updatedExpectedValues = applyDeltas( allDefaults, deltas );
			const resetAttrs = {};

			excludeFromCustomizationCheck.forEach( ( key ) => {
				if ( attributes[ key ] !== undefined ) {
					resetAttrs[ key ] = attributes[ key ];
				}
			} );

			Object.keys( updatedExpectedValues ).forEach( ( key ) => {
				if ( ! excludeFromCustomizationCheck.includes( key ) ) {
					resetAttrs[ key ] = updatedExpectedValues[ key ];
				}
			} );

			Object.keys( attributes ).forEach( ( key ) => {
				if ( excludeFromCustomizationCheck.includes( key ) ) {
					return;
				}
				if ( ! updatedExpectedValues.hasOwnProperty( key ) && attributes[ key ] !== undefined ) {
					resetAttrs[ key ] = undefined;
				}
			} );

			resetAttrs.customizations = {};

			console.log( '[UPDATE THEME] Setting skip flag to prevent auto-update customizations' );
			skipNextCustomizationsUpdate.current = true;

			flushSync( () => {
				setAttributes( resetAttrs );
			} );

			setSessionCache( ( prev ) => {
				const updated = { ...prev };
				delete updated[ currentThemeKey ];
				return updated;
			} );

			console.log( '[UPDATE THEME] Complete' );
		},
		[
			attributes,
			sessionCache,
			excludeFromCustomizationCheck,
			allDefaults,
			updateTheme,
			blockType,
			setAttributes,
		]
	);

	/**
	 * Delete theme and reset to defaults
	 */
	const handleDeleteTheme = useCallback(
		async () => {
			console.log( '\n[DELETE THEME] Starting for:', attributes.currentTheme );

			await deleteTheme( blockType, attributes.currentTheme );

			const resetAttrs = { ...allDefaults };
			resetAttrs.currentTheme = '';

			excludeFromCustomizationCheck.forEach( ( key ) => {
				if ( key !== 'currentTheme' ) {
					delete resetAttrs[ key ];
				}
			} );

			resetAttrs.customizations = {};

			console.log( '[DELETE THEME] Setting skip flag to prevent auto-update customizations' );
			skipNextCustomizationsUpdate.current = true;

			flushSync( () => {
				setAttributes( resetAttrs );
			} );

			setSessionCache( {} );

			console.log( '[DELETE THEME] Complete - reset to Default' );
		},
		[ attributes.currentTheme, deleteTheme, blockType, allDefaults, excludeFromCustomizationCheck, setAttributes ]
	);

	/**
	 * Rename theme
	 */
	const handleRenameTheme = useCallback(
		async ( oldName, newName ) => {
			await renameTheme( blockType, oldName, newName );
			setAttributes( { currentTheme: newName } );
		},
		[ renameTheme, blockType, setAttributes ]
	);

	/**
	 * Reset customizations to clean theme
	 */
	const handleResetCustomizations = useCallback(
		() => {
			console.log( '\n[RESET CUSTOMIZATIONS] Starting' );

			const resetAttrs = {};

			Object.keys( attributes ).forEach( ( key ) => {
				if ( excludeFromCustomizationCheck.includes( key ) ) {
					return;
				}

				const currentValue = attributes[ key ];
				const expectedValue = expectedValues[ key ];

				const isCurrentlyCustomized =
					currentValue !== null &&
					currentValue !== undefined &&
					currentValue !== expectedValue;

				if ( isCurrentlyCustomized ) {
					resetAttrs[ key ] = expectedValue !== undefined ? expectedValue : undefined;
				}
			} );

			resetAttrs.currentTheme = attributes.currentTheme;
			resetAttrs.customizations = {};

			console.log( '[RESET CUSTOMIZATIONS] Setting skip flag to prevent auto-update customizations' );
			skipNextCustomizationsUpdate.current = true;

			flushSync( () => {
				setAttributes( resetAttrs );
			} );

			const currentThemeKey = attributes.currentTheme || '';
			setSessionCache( ( prev ) => {
				const updated = { ...prev };
				delete updated[ currentThemeKey ];
				return updated;
			} );

			console.log( '[RESET CUSTOMIZATIONS] Complete' );
		},
		[ attributes, expectedValues, excludeFromCustomizationCheck, setAttributes ]
	);

	/**
	 * Change theme (with optional customized variant)
	 */
	const handleThemeChange = useCallback(
		( newThemeName, useCustomized = false ) => {
			if ( newThemeName && ! themes[ newThemeName ] ) {
				setAttributes( { currentTheme: '' } );
				return;
			}

			const newTheme = themes[ newThemeName ];
			const newThemeKey = newThemeName || '';

			let valuesToApply;

			if ( useCustomized && sessionCache[ newThemeKey ] ) {
				valuesToApply = sessionCache[ newThemeKey ];
			} else {
				valuesToApply = newTheme
					? applyDeltas( allDefaults, newTheme.values || {} )
					: allDefaults;
			}

			const resetAttrs = {};

			Object.keys( attributes ).forEach( ( key ) => {
				if ( excludeFromCustomizationCheck.includes( key ) ) {
					return;
				}

				const currentValue = attributes[ key ];
				const newValue = valuesToApply[ key ];

				if ( currentValue !== newValue ) {
					resetAttrs[ key ] = newValue !== undefined ? newValue : undefined;
				}
			} );

			Object.keys( valuesToApply ).forEach( ( key ) => {
				if ( excludeFromCustomizationCheck.includes( key ) ) {
					return;
				}
				if ( ! attributes.hasOwnProperty( key ) && valuesToApply[ key ] !== undefined ) {
					resetAttrs[ key ] = valuesToApply[ key ];
				}
			} );

			resetAttrs.currentTheme = newThemeName;

			setAttributes( resetAttrs );
		},
		[
			themes,
			sessionCache,
			allDefaults,
			attributes,
			excludeFromCustomizationCheck,
			setAttributes,
		]
	);

	// ========================================
	// 8. RETURN INTERFACE
	// ========================================

	return {
		// Theme data
		themes,
		themesLoaded,
		currentTheme,
		expectedValues,
		isCustomized,
		sessionCache,
		excludeFromCustomizationCheck,

		// Handlers
		handlers: {
			handleSaveNewTheme,
			handleUpdateTheme,
			handleDeleteTheme,
			handleRenameTheme,
			handleResetCustomizations,
			handleThemeChange,
		},
	};
}

export default useThemeManager;
