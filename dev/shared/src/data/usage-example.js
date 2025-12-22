/**
 * Store Usage Examples
 *
 * Documentation file showing how to use the WordPress Data Store
 * for theme management operations with the simplified architecture.
 *
 * This file contains commented examples only - not executed code.
 *
 * @see docs/IMPLEMENTATION/24-WORDPRESS-INTEGRATION.md
 * @see docs/01-QUICK-REFERENCE.md
 * @package
 * @since 1.0.0
 */

/* eslint-disable no-unused-vars */

/**
 * EXAMPLE 1: Loading Themes with useSelect
 *
 * Use this pattern in Edit components to read themes from the store.
 */
function Example1_LoadingThemes() {
	/*
	import { useSelect } from '@wordpress/data';
	import { STORE_NAME } from '@shared/data';

	const { themes, themesLoaded } = useSelect( ( select ) => {
		const { getThemes, areThemesLoaded } = select( STORE_NAME );
		return {
			themes: getThemes( 'accordion' ),
			themesLoaded: areThemesLoaded( 'accordion' ),
		};
	}, [] );

	if ( ! themesLoaded ) {
		return <Spinner />;
	}

	// themes = { "Dark Mode": { name: "Dark Mode", values: {...} }, ... }
	*/
}

/**
 * EXAMPLE 2: Creating a Theme with Session Cache
 *
 * Uses session cache snapshot to create new theme with deltas.
 */
function Example2_CreatingTheme() {
	/*
	import { useDispatch } from '@wordpress/data';
	import { useState } from '@wordpress/element';
	import { STORE_NAME } from '@shared/data';
	import { calculateDeltas, getAllDefaults } from '@shared';

	const { createTheme } = useDispatch( STORE_NAME );
	const [ sessionCache, setSessionCache ] = useState( {} );

	const handleSaveAsNew = async () => {
		// 1. Get snapshot from session cache for current theme
		const currentThemeKey = attributes.currentTheme || '';
		const currentSnapshot = sessionCache[ currentThemeKey ] || {};

		// 2. Calculate deltas (optimized storage)
		const allDefaults = getAllDefaults();
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeList );

		// 3. Create theme with deltas only
		try {
			await createTheme( 'accordion', 'My New Theme', deltas );

			// 4. Switch to new theme (clean, no customizations)
			setAttributes( { currentTheme: 'My New Theme' } );

			// 5. Clear old theme from session cache
			setSessionCache( prev => {
				const updated = { ...prev };
				delete updated[ currentThemeKey ];
				return updated;
			} );
		} catch ( error ) {
			console.error( 'Failed to create theme:', error );
		}
	};
	*/
}

/**
 * EXAMPLE 3: Updating an Existing Theme
 *
 * Updates theme with current session cache snapshot.
 * Clears session cache after update.
 */
function Example3_UpdatingTheme() {
	/*
	import { useDispatch } from '@wordpress/data';
	import { STORE_NAME } from '@shared/data';
	import { calculateDeltas, getAllDefaults } from '@shared';

	const { updateTheme } = useDispatch( STORE_NAME );

	const handleUpdateTheme = async () => {
		const currentThemeKey = attributes.currentTheme || '';

		// Get snapshot from session cache
		const currentSnapshot = sessionCache[ currentThemeKey ] || {};

		// Calculate deltas
		const allDefaults = getAllDefaults();
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeList );

		try {
			await updateTheme( 'accordion', attributes.currentTheme, deltas );

			// Clear session cache (theme now matches current state)
			setSessionCache( prev => {
				const updated = { ...prev };
				delete updated[ currentThemeKey ];
				return updated;
			} );
		} catch ( error ) {
			console.error( 'Failed to update theme:', error );
		}
	};
	*/
}

/**
 * EXAMPLE 4: Session Cache Auto-Update
 *
 * Auto-update session cache on every attribute change.
 * Session-only (lost on page reload).
 */
function Example4_SessionCacheAutoUpdate() {
	/*
	import { useEffect, useState } from '@wordpress/element';
	import { getThemeableSnapshot } from '@shared';

	const [ sessionCache, setSessionCache ] = useState( {} );

	// Auto-update session cache for current theme on every change
	useEffect( () => {
		const snapshot = getThemeableSnapshot( attributes, excludeList );
		const currentThemeKey = attributes.currentTheme || '';

		setSessionCache( prev => ({
			...prev,
			[ currentThemeKey ]: snapshot,
		}) );
	}, [ attributes, excludeList ] );

	// sessionCache structure:
	// {
	//   "": { titleColor: "#ff0000", titleFontSize: 16, ... },  // Default with customizations
	//   "Dark Mode": { titleColor: "#00ff00", ... }              // Dark Mode with customizations
	// }
	*/
}

/**
 * EXAMPLE 5: Customization Detection (Auto-Detection)
 *
 * System automatically detects customizations by comparing to expected values.
 */
function Example5_CustomizationDetection() {
	/*
	import { applyDeltas, getAllDefaults } from '@shared';

	// Calculate expected values (defaults + current theme deltas)
	const allDefaults = getAllDefaults();
	const currentTheme = themes[ attributes.currentTheme ];
	const expectedValues = currentTheme
		? applyDeltas( allDefaults, currentTheme.values || {} )
		: allDefaults;

	// Auto-detect customizations by comparing attributes to expected values
	const isCustomized = Object.keys( attributes ).some( key => {
		if ( excludeList.includes( key ) ) return false;

		const attrValue = attributes[ key ];
		const expectedValue = expectedValues[ key ];

		if ( attrValue === undefined || attrValue === null ) return false;

		// Deep comparison for objects
		if ( typeof attrValue === 'object' && attrValue !== null ) {
			return JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
		}

		// Simple comparison for primitives
		return attrValue !== expectedValue;
	} );

	// Display in theme dropdown
	const themeLabel = isCustomized
		? `${ attributes.currentTheme || 'Default' } (customized)`
		: attributes.currentTheme || 'Default';
	*/
}

/**
 * EXAMPLE 6: Dual Dropdown Variants
 *
 * Show both clean and customized theme variants in dropdown.
 */
function Example6_DualDropdownVariants() {
	/*
	import { SelectControl } from '@wordpress/components';

	// Generate theme options with dual variants
	const themeOptions = [];

	// Add Default
	themeOptions.push({ label: 'Default', value: '' });

	// If Default has customizations in session cache, add customized variant
	if ( sessionCache[ '' ] ) {
		themeOptions.push({ label: 'Default (customized)', value: '::customized' });
	}

	// Add saved themes with customized variants
	Object.keys( themes ).forEach( name => {
		themeOptions.push({ label: name, value: name });

		// If theme has customizations in session cache, add customized variant
		if ( sessionCache[ name ] ) {
			themeOptions.push({ label: `${ name } (customized)`, value: `${ name }::customized` });
		}
	} );

	// Handle theme change - parse customized variant
	const handleThemeChange = ( value ) => {
		const isCustomizedVariant = value.endsWith( '::customized' );
		const themeName = isCustomizedVariant
			? value.replace( '::customized', '' )
			: value;

		// Call block's handleThemeChange with useCustomized flag
		onThemeChange( themeName, isCustomizedVariant );
	};

	<SelectControl
		value={ dropdownValue }
		options={ themeOptions }
		onChange={ handleThemeChange }
	/>
	*/
}

/**
 * EXAMPLE 7: Theme Switch with Session Cache
 *
 * Handle theme switching with dual variants support.
 */
function Example7_ThemeSwitchWithSessionCache() {
	/*
	import { applyDeltas, getAllDefaults } from '@shared';

	const handleThemeChange = ( newThemeName, useCustomized = false ) => {
		const newTheme = themes[ newThemeName ];
		const newThemeKey = newThemeName || '';
		const allDefaults = getAllDefaults();

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

		// Apply values and update currentTheme
		const resetAttrs = { ...valuesToApply, currentTheme: newThemeName };

		// Remove excluded attributes (keep structural/meta)
		excludeList.forEach( key => delete resetAttrs[ key ] );

		setAttributes( resetAttrs );
	};
	*/
}

/**
 * EXAMPLE 8: Loading Themes Before Render
 *
 * Prevent race conditions by showing spinner until themes loaded.
 */
function Example8_LoadingState() {
	/*
	import { useSelect, useDispatch } from '@wordpress/data';
	import { useEffect } from '@wordpress/element';
	import { STORE_NAME } from '@shared/data';
	import { Spinner } from '@wordpress/components';

	const { loadThemes } = useDispatch( STORE_NAME );

	const { themes, themesLoaded } = useSelect( ( select ) => {
		const { getThemes, areThemesLoaded } = select( STORE_NAME );
		return {
			themes: getThemes( 'accordion' ),
			themesLoaded: areThemesLoaded( 'accordion' ),
		};
	}, [] );

	// Load themes on mount
	useEffect( () => {
		if ( ! themesLoaded ) {
			loadThemes( 'accordion' );
		}
	}, [ themesLoaded, loadThemes ] );

	// Show spinner while loading
	if ( ! themesLoaded ) {
		return <Spinner />;
	}

	// Render block editor UI
	return <div>Block editor content...</div>;
	*/
}

/**
 * EXAMPLE 9: Event Isolation Between Block Types
 *
 * Demonstrates that accordion themes don't affect tabs/toc.
 */
function Example9_EventIsolation() {
	/*
	import { useDispatch } from '@wordpress/data';
	import { STORE_NAME } from '@shared/data';

	const { createTheme } = useDispatch( STORE_NAME );

	// Create accordion theme
	await createTheme( 'accordion', 'Test Theme', accordionDeltas );

	// Tabs themes unchanged
	const tabsThemes = select( STORE_NAME ).getThemes( 'tabs' );
	// 'Test Theme' does NOT appear in tabsThemes

	// TOC themes unchanged
	const tocThemes = select( STORE_NAME ).getThemes( 'toc' );
	// 'Test Theme' does NOT appear in tocThemes
	*/
}

/**
 * EXAMPLE 10: Reset Customizations
 *
 * Clear session cache and reset to clean theme.
 */
function Example10_ResetCustomizations() {
	/*
	import { applyDeltas, getAllDefaults } from '@shared';

	const handleResetCustomizations = () => {
		// Calculate expected values (defaults + current theme deltas)
		const allDefaults = getAllDefaults();
		const currentTheme = themes[ attributes.currentTheme ];
		const expectedValues = currentTheme
			? applyDeltas( allDefaults, currentTheme.values || {} )
			: allDefaults;

		// Apply expected values
		const resetAttrs = { ...expectedValues };

		// Remove excluded attributes (keep structural/meta)
		excludeList.forEach( key => delete resetAttrs[ key ] );

		setAttributes( resetAttrs );

		// Clear session cache for current theme
		const currentThemeKey = attributes.currentTheme || '';
		setSessionCache( prev => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			return updated;
		} );
	};
	*/
}

/* eslint-enable no-unused-vars */

/**
 * Export empty object (documentation file only)
 */
export default {};
