/**
 * Custom Hook: useThemeHandlers
 *
 * Provides all theme action handlers (save, update, delete, rename, reset, change).
 * Centralizes duplicated handler logic from all block edit.js files.
 *
 * @param {Object} options Configuration options
 * @param {string} options.blockType - Block type identifier ('accordion', 'tabs', 'toc')
 * @param {Object} options.attributes - Block attributes
 * @param {Function} options.setAttributes - Attribute setter function
 * @param {Object} options.allDefaults - All default values (CSS + behavioral)
 * @param {Object} options.expectedValues - Expected values (defaults + theme deltas)
 * @param {Object} options.themes - Themes object from store
 * @param {Object} options.sessionCache - Session cache state
 * @param {Function} options.setSessionCache - Session cache setter
 * @param {Array} options.excludeFromCustomizationCheck - Attributes to exclude
 * @param {Function} options.createTheme - Create theme action from store
 * @param {Function} options.updateTheme - Update theme action from store
 * @param {Function} options.deleteTheme - Delete theme action from store
 * @param {Function} options.renameTheme - Rename theme action from store
 * @return {Object} Theme handlers interface
 *
 * @example
 * ```javascript
 * import { useThemeHandlers } from '@shared';
 *
 * function MyBlockEdit({ attributes, setAttributes }) {
 *     const {
 *         handleSaveNewTheme,
 *         handleUpdateTheme,
 *         handleDeleteTheme,
 *         handleRenameTheme,
 *         handleResetCustomizations,
 *         handleThemeChange,
 *     } = useThemeHandlers({
 *         blockType: 'accordion',
 *         attributes,
 *         setAttributes,
 *         allDefaults,
 *         expectedValues,
 *         themes,
 *         sessionCache,
 *         setSessionCache,
 *         excludeFromCustomizationCheck,
 *         createTheme,
 *         updateTheme,
 *         deleteTheme,
 *         renameTheme,
 *     });
 * }
 * ```
 *
 * @package
 * @since 1.0.0
 */

import { useCallback } from '@wordpress/element';
import { flushSync } from 'react-dom';
import { calculateDeltas, applyDeltas, getThemeableSnapshot } from '../utils/delta-calculator';
import { debug } from '../utils/debug';

/**
 * Hook to provide theme handler functions
 *
 * @param {Object} options Configuration object
 * @return {Object} Theme handlers
 */
export function useThemeHandlers( {
	blockType,
	attributes,
	setAttributes,
	allDefaults,
	expectedValues,
	themes,
	sessionCache,
	setSessionCache,
	excludeFromCustomizationCheck,
	createTheme,
	updateTheme,
	deleteTheme,
	renameTheme,
} ) {
	/**
	 * Save current customizations as a new theme
	 *
	 * @param {string} themeName - Name for the new theme
	 */
	const handleSaveNewTheme = useCallback( async ( themeName ) => {
		const currentThemeKey = attributes.currentTheme || '';
		const cachedSnapshot = sessionCache[ currentThemeKey ];

		// Use current attributes as fallback if sessionCache is empty
		const currentSnapshot = cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
			? cachedSnapshot
			: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

		// Calculate deltas from current snapshot (optimized storage)
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

		// Save theme with deltas only
		await createTheme( blockType, themeName, deltas );

		// Reset to clean theme: apply defaults + new theme deltas
		const newTheme = { values: deltas };
		const newExpectedValues = applyDeltas( allDefaults, newTheme.values || {} );
		const resetAttrs = { ...newExpectedValues };

		debug( `[${ blockType.toUpperCase() }] [THEME CREATE] New expected values:`, newExpectedValues );

		// Remove excluded attributes (except currentTheme which we need to set)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( key !== 'currentTheme' ) {
				delete resetAttrs[ key ];
			}
		} );

		// Set the currentTheme to the new theme name
		resetAttrs.currentTheme = themeName;

		debug( `[${ blockType.toUpperCase() }] [THEME CREATE] Reset attributes to set:`, resetAttrs );

		// Use flushSync to force synchronous update BEFORE clearing session cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for BOTH old and new themes
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			delete updated[ themeName ];
			debug( `[${ blockType.toUpperCase() }] [THEME CREATE] Updated session cache:`, updated );
			return updated;
		} );

		debug( `[${ blockType.toUpperCase() }] [THEME CREATE] Theme creation completed` );
	}, [ blockType, attributes, setAttributes, allDefaults, sessionCache, setSessionCache, excludeFromCustomizationCheck, createTheme ] );

	/**
	 * Update current theme with current customizations
	 */
	const handleUpdateTheme = useCallback( async () => {
		const currentThemeKey = attributes.currentTheme || '';
		const cachedSnapshot = sessionCache[ currentThemeKey ];

		// Use current attributes as fallback if sessionCache is empty
		const currentSnapshot = cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
			? cachedSnapshot
			: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

		// Calculate deltas from current snapshot
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

		// Update theme with error handling
		try {
			await updateTheme( blockType, attributes.currentTheme, deltas );
		} catch ( error ) {
			// If theme doesn't exist or is broken, reset to default
			if ( error?.code === 'theme_not_found' || error?.status === 404 ) {
				setAttributes( { currentTheme: '' } );
				return;
			}
			throw error;
		}

		// Recalculate expected values with the NEW deltas
		const updatedExpectedValues = applyDeltas( allDefaults, deltas );
		debug( `[${ blockType.toUpperCase() }] [UPDATE THEME] Updated expected values:`, updatedExpectedValues );

		// Reset to updated theme - ONLY include theme values, clear all customizations
		const resetAttrs = {};

		// Always preserve excluded attributes (structural, behavioral, meta)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( attributes[ key ] !== undefined ) {
				resetAttrs[ key ] = attributes[ key ];
			}
		} );

		// Copy ONLY the theme's expected values
		Object.keys( updatedExpectedValues ).forEach( ( key ) => {
			if ( ! excludeFromCustomizationCheck.includes( key ) ) {
				resetAttrs[ key ] = updatedExpectedValues[ key ];
			}
		} );

		// Clear customizations that differ from theme
		Object.keys( attributes ).forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}
			if ( ! updatedExpectedValues.hasOwnProperty( key ) && attributes[ key ] !== undefined ) {
				resetAttrs[ key ] = undefined;
			}
		} );

		debug( `[${ blockType.toUpperCase() }] [UPDATE THEME] Attributes to set:`, resetAttrs );

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for this theme
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			return updated;
		} );
	}, [ blockType, attributes, setAttributes, allDefaults, sessionCache, setSessionCache, excludeFromCustomizationCheck, updateTheme ] );

	/**
	 * Delete current theme and reset to defaults
	 */
	const handleDeleteTheme = useCallback( async () => {
		await deleteTheme( blockType, attributes.currentTheme );

		// Reset to default theme: apply all defaults and clear currentTheme
		const resetAttrs = { ...allDefaults };
		resetAttrs.currentTheme = '';

		// Remove excluded attributes (except currentTheme which we just set)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( key !== 'currentTheme' ) {
				delete resetAttrs[ key ];
			}
		} );

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache completely
		setSessionCache( {} );
	}, [ blockType, attributes.currentTheme, setAttributes, allDefaults, setSessionCache, excludeFromCustomizationCheck, deleteTheme ] );

	/**
	 * Rename current theme
	 *
	 * @param {string} oldName - Current theme name
	 * @param {string} newName - New theme name
	 */
	const handleRenameTheme = useCallback( async ( oldName, newName ) => {
		await renameTheme( blockType, oldName, newName );
		setAttributes( { currentTheme: newName } );
	}, [ blockType, setAttributes, renameTheme ] );

	/**
	 * Reset customizations to clean theme state
	 */
	const handleResetCustomizations = useCallback( () => {
		debug( `[${ blockType.toUpperCase() }] [RESET] Resetting customizations to clean theme` );
		debug( `[${ blockType.toUpperCase() }] [RESET] Current theme:`, attributes.currentTheme );
		debug( `[${ blockType.toUpperCase() }] [RESET] Expected values:`, expectedValues );

		// Start with expected values (defaults + current theme)
		const resetAttrs = {};

		// For each attribute in the block
		Object.keys( attributes ).forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}

			const currentValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			// If attribute is currently customized (different from expected)
			const isCurrentlyCustomized =
				currentValue !== null &&
				currentValue !== undefined &&
				currentValue !== expectedValue;

			if ( isCurrentlyCustomized ) {
				resetAttrs[ key ] = expectedValue !== undefined ? expectedValue : undefined;
				debug( `[${ blockType.toUpperCase() }] [RESET] Clearing customization: ${ key }` );
			}
		} );

		// Preserve the current theme selection
		resetAttrs.currentTheme = attributes.currentTheme;

		debug( `[${ blockType.toUpperCase() }] [RESET] Attributes to set:`, resetAttrs );

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for current theme
		const currentThemeKey = attributes.currentTheme || '';
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			debug( `[${ blockType.toUpperCase() }] [RESET] Cleared session cache for theme:`, currentThemeKey );
			return updated;
		} );
	}, [ blockType, attributes, setAttributes, expectedValues, setSessionCache, excludeFromCustomizationCheck ] );

	/**
	 * Handle theme change from dropdown
	 * Supports dual variants: clean theme and customized theme
	 *
	 * @param {string} newThemeName - Theme name to switch to
	 * @param {boolean} useCustomized - Whether to restore from session cache
	 */
	const handleThemeChange = useCallback( ( newThemeName, useCustomized = false ) => {
		debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] Switching from:`, attributes.currentTheme, 'to:', newThemeName );

		// If theme is selected but doesn't exist in loaded themes, reset to default
		if ( newThemeName && ! themes[ newThemeName ] ) {
			setAttributes( { currentTheme: '' } );
			return;
		}

		const newTheme = themes[ newThemeName ];
		const newThemeKey = newThemeName || '';

		let valuesToApply;

		if ( useCustomized && sessionCache[ newThemeKey ] ) {
			// User selected customized variant - restore from session cache
			valuesToApply = sessionCache[ newThemeKey ];
		} else {
			// User selected clean theme - use defaults + theme deltas
			valuesToApply = newTheme
				? applyDeltas( allDefaults, newTheme.values || {} )
				: allDefaults;
		}

		debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] Values to apply:`, valuesToApply );

		// WordPress setAttributes() ignores null/undefined values!
		// We need to explicitly clear attributes that differ from the new theme
		const resetAttrs = {};

		// For each attribute in the block
		Object.keys( attributes ).forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}

			const currentValue = attributes[ key ];
			const newValue = valuesToApply[ key ];

			// If value is different, explicitly set it
			if ( currentValue !== newValue ) {
				resetAttrs[ key ] = newValue !== undefined ? newValue : undefined;
				debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] Changing ${ key }` );
			}
		} );

		// Also set any new attributes from the theme that aren't in current attributes
		Object.keys( valuesToApply ).forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}
			if ( ! attributes.hasOwnProperty( key ) && valuesToApply[ key ] !== undefined ) {
				resetAttrs[ key ] = valuesToApply[ key ];
				debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] Adding new attribute ${ key }` );
			}
		} );

		// Set the new theme
		resetAttrs.currentTheme = newThemeName;

		debug( `[${ blockType.toUpperCase() }] [THEME CHANGE] Final attributes to set:`, resetAttrs );
		setAttributes( resetAttrs );
	}, [ blockType, attributes, setAttributes, allDefaults, themes, sessionCache, excludeFromCustomizationCheck ] );

	return {
		handleSaveNewTheme,
		handleUpdateTheme,
		handleDeleteTheme,
		handleRenameTheme,
		handleResetCustomizations,
		handleThemeChange,
	};
}

export default useThemeHandlers;
