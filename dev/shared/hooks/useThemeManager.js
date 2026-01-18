/**
 * Custom Hook: useThemeManager
 *
 * Comprehensive theme management hook that encapsulates ALL theme-related logic
 * including loading, customization detection, session cache, and handlers.
 * This eliminates repetitive code across block edit components.
 *
 * @param {Object}   config               - Configuration object
 * @param {string}   config.blockType     - Block type ('accordion', 'tabs', 'toc')
 * @param {Object}   config.schema        - Block schema object
 * @param {Object}   config.attributes    - Current block attributes
 * @param {Function} config.setAttributes - WordPress setAttributes function
 * @param {Object}   config.allDefaults   - All defaults (schema + CSS)
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
import { calculateDeltas, applyDeltas, getThemeableSnapshot } from '../utils/delta-calculator';
import {
	batchUpdateCleanBlocks,
	batchResetBlocksUsingTheme,
	showBatchUpdateNotification,
} from '../utils/batch-block-updater';

/**
 * Main theme manager hook
 *
 * @param {Object} config               - Configuration object
 * @param          config.blockType
 * @param          config.schema
 * @param          config.attributes
 * @param          config.setAttributes
 * @param          config.allDefaults
 * @return {Object} Theme system interface
 */
export function useThemeManager( { blockType, schema, attributes, setAttributes, allDefaults } ) {
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
			console.log( `🔄 [INIT] Loading ${blockType} themes...` );
			loadThemes( blockType );
		} else {
			console.log( `✅ [INIT] Themes already loaded for ${blockType}:`, Object.keys( themes ).length, 'themes' );
			console.log( '   - Available themes:', Object.keys( themes ) );
		}
	}, [ themesLoaded, loadThemes, blockType, themes ] );

	// ========================================
	// 2. MEMOIZED EXCLUSIONS LIST
	// ========================================

	// CRITICAL: Memoize to prevent infinite loops in effects
	// Always exclude 'customizations' - it's a meta-attribute not in schema
	const excludeFromCustomizationCheck = useMemo( () => {
		const schemaExclusions = Object.entries( schema.attributes )
			.filter( ( [ , attr ] ) => attr.themeable !== true )
			.map( ( [ key ] ) => key );

		// Always exclude 'customizations' - it's defined in block.json, not schema
		if ( ! schemaExclusions.includes( 'customizations' ) ) {
			schemaExclusions.push( 'customizations' );
		}

		console.log( '🚫 [EXCLUDE] Excluded attributes:', schemaExclusions );

		return schemaExclusions;
	}, [ schema ] );

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
		console.log( '🎨 [THEME] Calculating expectedValues...' );
		console.log( '   - Current theme:', currentTheme?.name || 'None (using defaults)' );
		console.log( '   - Theme has values:', currentTheme ? Object.keys( currentTheme.values || {} ).length : 0 );
		console.log( '   - Defaults count:', Object.keys( allDefaults ).length );

		const expected = currentTheme
			? applyDeltas( allDefaults, currentTheme.values || {} )
			: allDefaults;

		console.log( '   - Expected values count:', Object.keys( expected ).length );
		return expected;
	}, [ currentTheme, allDefaults ] );

	// Debug: Track attribute changes
	const prevAttributesRef = useRef( attributes );
	useEffect( () => {
		const prevAttrs = prevAttributesRef.current;
		const changes = [];

		// Find what changed
		Object.keys( attributes ).forEach( ( key ) => {
			const oldValue = prevAttrs[ key ];
			const newValue = attributes[ key ];

			// Deep comparison for objects
			let isDifferent = false;
			if ( typeof newValue === 'object' && newValue !== null && oldValue !== null && oldValue !== undefined ) {
				isDifferent = JSON.stringify( newValue ) !== JSON.stringify( oldValue );
			} else {
				isDifferent = newValue !== oldValue;
			}

			if ( isDifferent ) {
				changes.push( {
					key,
					old: oldValue,
					new: newValue,
					type: typeof newValue,
				} );
			}
		} );

		if ( changes.length > 0 ) {
			// Filter for border-related changes for focused debugging
			const borderChanges = changes.filter( ( { key } ) =>
				key.toLowerCase().includes( 'border' ) || key.toLowerCase().includes( 'box' )
			);

			if ( borderChanges.length > 0 ) {
				console.log( '🔄 [ATTRS] Border/Box attributes changed:' );
				borderChanges.forEach( ( { key, old, new: newVal, type } ) => {
					console.log( `   - "${key}" (${type}):`, {
						old,
						new: newVal,
					} );

					// Check if this attribute is excluded
					if ( excludeFromCustomizationCheck.includes( key ) ) {
						console.log( `     ⚠️ This attribute is EXCLUDED from customization detection!` );
					}

					// Check if expected value exists
					if ( expectedValues[ key ] === undefined ) {
						console.log( `     ⚠️ This attribute has NO expected value!` );
					} else {
						console.log( `     ✓ Expected value:`, expectedValues[ key ] );
						// Deep comparison check
						const isExpectedDifferent =
							JSON.stringify( newVal ) !== JSON.stringify( expectedValues[ key ] );
						console.log(
							`     ${
								isExpectedDifferent ? '❌ NEW ≠ EXPECTED' : '⚠️ NEW === EXPECTED'
							}`
						);
					}
				} );
			}
		}

		// Update ref for next comparison
		prevAttributesRef.current = attributes;
	}, [ attributes, excludeFromCustomizationCheck, expectedValues ] );

	// ========================================
	// 4. CUSTOMIZATION DETECTION
	// ========================================

	// Auto-detect if block has customizations vs expected theme
	const isCustomized = useMemo( () => {
		console.log( '🔍 [DETECT] Checking for customizations...' );
		console.log( '   - Themes loaded:', themesLoaded );
		console.log( '   - Total attributes:', Object.keys( attributes ).length );
		console.log( '   - Total expectedValues:', Object.keys( expectedValues ).length );
		console.log( '   - Excluded count:', excludeFromCustomizationCheck.length );

		// Wait for themes to load
		if ( ! themesLoaded ) {
			console.log( '   ⏳ Waiting for themes to load...' );
			return false;
		}

		// If theme selected but not found, wait
		if ( attributes.currentTheme && ! themes[ attributes.currentTheme ] ) {
			console.log( '   ⏳ Waiting for theme to be found...' );
			return false;
		}

		// Check if any attribute differs from expected
		const differences = [];
		const allChecked = []; // Track ALL checked attributes
		let checkedCount = 0;
		let skippedNullCount = 0;
		let skippedUndefinedExpectedCount = 0;
		let skippedExcludedCount = 0;

		const hasCustomizations = Object.keys( attributes ).some( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				skippedExcludedCount++;
				return false;
			}

			const attrValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			// Skip undefined/null attribute values
			if ( attrValue === undefined || attrValue === null ) {
				skippedNullCount++;
				return false;
			}

			// Skip if expected value is undefined (attribute not in defaults/theme)
			// This prevents false positives when attributes exist but aren't themeable defaults
			if ( expectedValue === undefined ) {
				skippedUndefinedExpectedCount++;
				console.log( `   ⚠️ [DETECT] Attribute with undefined expected: "${key}"` );
				return false;
			}

			checkedCount++;

			// Deep comparison for objects
			let isDifferent = false;
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			} else {
				isDifferent = attrValue !== expectedValue;
			}

			// Track ALL checked attributes for debugging
			allChecked.push( {
				key,
				attrValue,
				expectedValue,
				isDifferent,
				type: typeof attrValue,
			} );

			if ( isDifferent ) {
				differences.push( { key, attrValue, expectedValue } );
			}

			return isDifferent;
		} );

		console.log( '📊 [DETECT] Statistics:' );
		console.log( `   - Checked: ${checkedCount}` );
		console.log( `   - Skipped (excluded): ${skippedExcludedCount}` );
		console.log( `   - Skipped (null/undefined value): ${skippedNullCount}` );
		console.log( `   - Skipped (undefined expected): ${skippedUndefinedExpectedCount}` );
		console.log( `   - Differences found: ${differences.length}` );

		// Debug logging - show border/box checked attributes
		const borderChecked = allChecked.filter(
			( { key } ) => key.toLowerCase().includes( 'border' ) || key.toLowerCase().includes( 'box' )
		);
		if ( borderChecked.length > 0 ) {
			console.log( '📋 [DETECT] Border/Box attributes checked:' );
			borderChecked.forEach( ( { key, attrValue, expectedValue, isDifferent, type } ) => {
				const marker = isDifferent ? '❌ DIFF' : '✅ SAME';
				console.log( `   ${marker} "${key}" (${type}):`, {
					current: attrValue,
					expected: expectedValue,
				} );
			} );
		} else {
			console.log( `📋 [DETECT] No border/box attributes checked (total checked: ${allChecked.length})` );
		}

		// Show differences if found
		if ( differences.length > 0 ) {
			console.log( '🔧 [DETECT] Customized attributes:' );
			differences.forEach( ( { key, attrValue, expectedValue } ) => {
				console.log( `   - "${key}":`, {
					current: attrValue,
					expected: expectedValue,
					type: typeof attrValue,
				} );
			} );
		}

		console.log( hasCustomizations ? '✅ [DETECT] Block IS customized' : '❌ [DETECT] Block is NOT customized' );

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
			skipNextCustomizationsUpdate.current = false;
			return;
		}

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
			}
		} );

		// Only update if changed
		const currentCustomizations = attributes.customizations || {};
		const newStr = JSON.stringify( newCustomizations );
		const currentStr = JSON.stringify( currentCustomizations );

		if ( newStr !== currentStr ) {
			setAttributes( { customizations: newCustomizations } );
		} else {
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
			const currentThemeKey = attributes.currentTheme || '';
			const cachedSnapshot = sessionCache[ currentThemeKey ];

			const currentSnapshot =
				cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
					? cachedSnapshot
					: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

			const deltas = calculateDeltas(
				currentSnapshot,
				allDefaults,
				excludeFromCustomizationCheck
			);

			if ( Object.keys( deltas ).length === 0 ) {
				return;
			}

			await createTheme( blockType, themeName, deltas );

			// Wait for Redux store to update
			await new Promise( ( resolve ) => setTimeout( resolve, 50 ) );

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
	const handleUpdateTheme = useCallback( async () => {
		const currentThemeKey = attributes.currentTheme || '';
		const cachedSnapshot = sessionCache[ currentThemeKey ];

		const currentSnapshot =
			cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
				? cachedSnapshot
				: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

		const deltas = calculateDeltas(
			currentSnapshot,
			allDefaults,
			excludeFromCustomizationCheck
		);

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
			if (
				! updatedExpectedValues.hasOwnProperty( key ) &&
				attributes[ key ] !== undefined
			) {
				resetAttrs[ key ] = undefined;
			}
		} );

		resetAttrs.customizations = {};

		skipNextCustomizationsUpdate.current = true;

		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			return updated;
		} );

		// BATCH UPDATE: Update all other clean blocks on this page using the same theme
		const updatedCount = batchUpdateCleanBlocks(
			blockType,
			attributes.currentTheme,
			updatedExpectedValues,
			excludeFromCustomizationCheck
		);

		// Show notification
		if ( updatedCount > 0 ) {
			showBatchUpdateNotification( 'update', attributes.currentTheme, updatedCount );
		}
	}, [
		attributes,
		sessionCache,
		excludeFromCustomizationCheck,
		allDefaults,
		updateTheme,
		blockType,
		setAttributes,
	] );

	/**
	 * Delete theme and reset to defaults
	 */
	const handleDeleteTheme = useCallback( async () => {
		const themeToDelete = attributes.currentTheme;

		await deleteTheme( blockType, themeToDelete );

		const resetAttrs = { ...allDefaults };
		resetAttrs.currentTheme = '';

		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( key !== 'currentTheme' ) {
				delete resetAttrs[ key ];
			}
		} );

		resetAttrs.customizations = {};

		skipNextCustomizationsUpdate.current = true;

		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		setSessionCache( {} );

		// BATCH RESET: Reset all other blocks on this page using the deleted theme
		const resetCount = batchResetBlocksUsingTheme(
			blockType,
			themeToDelete,
			allDefaults,
			excludeFromCustomizationCheck
		);

		// Show notification
		if ( resetCount > 0 ) {
			showBatchUpdateNotification( 'delete', themeToDelete, resetCount );
		}
	}, [
		attributes.currentTheme,
		deleteTheme,
		blockType,
		allDefaults,
		excludeFromCustomizationCheck,
		setAttributes,
	] );

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
	const handleResetCustomizations = useCallback( () => {
		console.log( '🔄 [RESET] Starting reset customizations...' );
		console.log( '📊 [RESET] Current theme:', attributes.currentTheme );
		console.log( '📋 [RESET] Total attributes:', Object.keys( attributes ).length );
		console.log( '📋 [RESET] Total expectedValues:', Object.keys( expectedValues ).length );

		const resetAttrs = {};

		// Collect all attribute names from both attributes and expectedValues
		const allAttrNames = new Set( [
			...Object.keys( attributes ),
			...Object.keys( expectedValues ),
		] );

		console.log( '📋 [RESET] Total attributes to check:', allAttrNames.size );

		let checkedCount = 0;
		let skippedCount = 0;
		let resetCount = 0;

		allAttrNames.forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				skippedCount++;
				return;
			}

			checkedCount++;

			const currentValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			// Deep comparison for objects (same logic as customization detection)
			let isCurrentlyCustomized = false;

			// Skip if current value is null/undefined
			if ( currentValue !== null && currentValue !== undefined ) {
				// Skip if expected value is undefined (not a themeable attribute)
				if ( expectedValue !== undefined ) {
					// Deep comparison for objects
					if ( typeof currentValue === 'object' && currentValue !== null ) {
						isCurrentlyCustomized =
							JSON.stringify( currentValue ) !== JSON.stringify( expectedValue );
					} else {
						isCurrentlyCustomized = currentValue !== expectedValue;
					}

					// Log customized attributes
					if ( isCurrentlyCustomized ) {
						console.log( `   🔧 [RESET] "${key}" is customized:`, {
							current: currentValue,
							expected: expectedValue,
							type: typeof currentValue,
						} );
					}
				}
			}

			// Reset to expected value if customized
			if ( isCurrentlyCustomized ) {
				resetAttrs[ key ] = expectedValue;
				resetCount++;
			}
		} );

		resetAttrs.currentTheme = attributes.currentTheme;
		resetAttrs.customizations = {};

		console.log( '📊 [RESET] Statistics:' );
		console.log( `   - Checked: ${checkedCount}` );
		console.log( `   - Skipped (non-themeable): ${skippedCount}` );
		console.log( `   - Will reset: ${resetCount}` );
		console.log( '📦 [RESET] Reset attributes:', Object.keys( resetAttrs ) );

		skipNextCustomizationsUpdate.current = true;

		flushSync( () => {
			console.log( '✅ [RESET] Applying setAttributes...' );
			setAttributes( resetAttrs );
			console.log( '✅ [RESET] setAttributes complete' );
		} );

		const currentThemeKey = attributes.currentTheme || '';
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			console.log( `🗑️ [RESET] Cleared session cache for theme: "${currentThemeKey}"` );
			return updated;
		} );

		console.log( '✅ [RESET] Reset customizations complete!' );
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, setAttributes ] );

	/**
	 * Change theme (with optional customized variant)
	 */
	const handleThemeChange = useCallback(
		( newThemeName, useCustomized = false ) => {
			console.log( '🎨 [THEME CHANGE] Starting theme change...' );
			console.log( '   - New theme name:', newThemeName || '(Default)' );
			console.log( '   - Use customized variant:', useCustomized );
			console.log( '   - Available themes:', Object.keys( themes ) );

			if ( newThemeName && ! themes[ newThemeName ] ) {
				console.warn( '⚠️ [THEME CHANGE] Theme not found, resetting to default' );
				setAttributes( { currentTheme: '' } );
				return;
			}

			const newTheme = themes[ newThemeName ];
			const newThemeKey = newThemeName || '';

			console.log( '   - New theme object:', newTheme ? `${newTheme.name} (${Object.keys(newTheme.values || {}).length} values)` : 'None' );

			let valuesToApply;

			if ( useCustomized && sessionCache[ newThemeKey ] ) {
				console.log( '   - Using customized variant from session cache' );
				valuesToApply = sessionCache[ newThemeKey ];
			} else {
				console.log( '   - Using clean theme (no customizations)' );
				valuesToApply = newTheme
					? applyDeltas( allDefaults, newTheme.values || {} )
					: allDefaults;
			}

			console.log( '   - Values to apply:', Object.keys( valuesToApply ).length );

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

			console.log( '📦 [THEME CHANGE] Attributes to update:', Object.keys( resetAttrs ).length );
			console.log( '✅ [THEME CHANGE] Applying theme...' );

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
