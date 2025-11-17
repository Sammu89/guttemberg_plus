/**
 * Store Usage Examples
 *
 * Documentation file showing how to use the WordPress Data Store
 * for theme management operations.
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

	const themes = useSelect( ( select ) =>
		select( STORE_NAME ).getThemes( 'accordion' )
	);

	const isLoading = useSelect( ( select ) =>
		select( STORE_NAME ).isLoading()
	);

	if ( isLoading ) {
		return <Spinner />;
	}

	// themes = { "Dark Mode": { name: "Dark Mode", values: {...} }, ... }
	*/
}

/**
 * EXAMPLE 2: Creating a Theme with useDispatch
 *
 * Collects all effective values and saves as new theme.
 */
function Example2_CreatingTheme() {
	/*
	import { useDispatch } from '@wordpress/data';
	import { STORE_NAME } from '@shared/data';
	import { getAllEffectiveValues } from '@shared/theme-system/cascade-resolver';

	const { createTheme } = useDispatch( STORE_NAME );

	const handleSaveAsNew = async () => {
		// 1. Collect all effective values via cascade
		const effectiveValues = getAllEffectiveValues(
			attributes,                  // Block customizations
			themes[ attributes.currentTheme ], // Current theme
			window.accordionDefaults           // CSS defaults
		);

		// 2. Create theme with complete snapshot
		try {
			await createTheme( 'accordion', 'My New Theme', effectiveValues );

			// 3. Clear customizations and switch to new theme
			setAttributes( {
				currentTheme: 'My New Theme',
				customizations: {}
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
 * Updates theme with current effective values.
 * Clears all block customizations after update.
 */
function Example3_UpdatingTheme() {
	/*
	import { useDispatch } from '@wordpress/data';
	import { STORE_NAME } from '@shared/data';
	import { getAllEffectiveValues } from '@shared/theme-system/cascade-resolver';

	const { updateTheme } = useDispatch( STORE_NAME );

	const handleUpdateTheme = async () => {
		const themeName = attributes.currentTheme;

		// Collect current effective values
		const effectiveValues = getAllEffectiveValues(
			attributes,
			themes[ themeName ],
			window.accordionDefaults
		);

		try {
			await updateTheme( 'accordion', themeName, effectiveValues );

			// Clear customizations (theme now has these values)
			setAttributes( { customizations: {} } );
		} catch ( error ) {
			console.error( 'Failed to update theme:', error );
		}
	};
	*/
}

/**
 * EXAMPLE 4: Cascade Resolution
 *
 * Use cascade resolver to get effective values for UI display.
 */
function Example4_CascadeResolution() {
	/*
	import { getAllEffectiveValues, getEffectiveValue, isCustomized } from '@shared/theme-system/cascade-resolver';

	// Get all effective values
	const effectiveValues = getAllEffectiveValues(
		attributes,                          // Block-level customizations
		themes[ attributes.currentTheme ],   // Theme values
		window.accordionDefaults             // CSS defaults
	);

	// Get single effective value
	const titleColor = getEffectiveValue(
		'titleColor',
		attributes,
		themes[ attributes.currentTheme ],
		window.accordionDefaults
	);

	// Check if attribute is customized
	const isTitleColorCustomized = isCustomized(
		'titleColor',
		attributes,
		themes[ attributes.currentTheme ]
	);

	// Display in UI
	<ColorPicker
		value={ effectiveValues.titleColor }
		onChange={ ( newColor ) => {
			setAttributes( {
				customizations: {
					...attributes.customizations,
					titleColor: newColor
				}
			} );
		} }
		{ ...( isTitleColorCustomized && { badge: 'Customized' } ) }
	/>
	*/
}

/**
 * EXAMPLE 5: Customization Detection
 *
 * Determine if block has customizations for UI state.
 */
function Example5_CustomizationDetection() {
	/*
	import { isCustomized } from '@shared/theme-system/cascade-resolver';

	// Check if ANY attribute is customized
	const hasCustomizations = Object.keys( attributes.customizations || {} ).length > 0;

	// Or check all customizable attributes
	const customizableAttrs = [
		'titleColor',
		'titleBackgroundColor',
		'titleFontSize',
		// ... more attributes
	];

	const isBlockCustomized = customizableAttrs.some( ( attr ) =>
		isCustomized(
			attr,
			attributes,
			themes[ attributes.currentTheme ]
		)
	);

	// Display in theme dropdown
	const themeLabel = hasCustomizations
		? `${ attributes.currentTheme } (customized)`
		: attributes.currentTheme;
	*/
}

/**
 * EXAMPLE 6: Theme Manager Convenience Wrapper
 *
 * Thin wrapper over store for easier usage.
 */
function Example6_ThemeManager() {
	/*
	import { getThemeManager } from '@shared/theme-system/theme-manager';

	const manager = getThemeManager( 'accordion' );

	// List all themes
	const themes = await manager.list();

	// Get specific theme
	const darkTheme = await manager.get( 'Dark Mode' );

	// Create new theme
	await manager.create( 'My Theme', effectiveValues );

	// Update existing theme
	await manager.update( 'My Theme', updatedValues );

	// Delete theme
	await manager.delete( 'My Theme' );

	// Rename theme
	await manager.rename( 'Old Name', 'New Name' );

	// Check if theme exists
	const exists = await manager.exists( 'My Theme' );
	*/
}

/**
 * EXAMPLE 7: Loading Themes Before Render
 *
 * Prevent race conditions by showing spinner until themes loaded.
 */
function Example7_LoadingState() {
	/*
	import { useSelect, useDispatch } from '@wordpress/data';
	import { useEffect } from '@wordpress/element';
	import { STORE_NAME } from '@shared/data';
	import { Spinner } from '@wordpress/components';

	const { loadThemes } = useDispatch( STORE_NAME );

	const { themes, isLoading } = useSelect( ( select ) => ( {
		themes: select( STORE_NAME ).getThemes( 'accordion' ),
		isLoading: select( STORE_NAME ).isLoading()
	} ) );

	// Load themes on mount
	useEffect( () => {
		loadThemes( 'accordion' );
	}, [] );

	// Show spinner while loading
	if ( isLoading || ! themes ) {
		return <Spinner />;
	}

	// Render block editor UI
	return <div>Block editor content...</div>;
	*/
}

/**
 * EXAMPLE 8: Event Isolation Between Block Types
 *
 * Demonstrates that accordion themes don't affect tabs/toc.
 */
function Example8_EventIsolation() {
	/*
	import { useDispatch } from '@wordpress/data';
	import { STORE_NAME } from '@shared/data';

	const { createTheme } = useDispatch( STORE_NAME );

	// Create accordion theme
	await createTheme( 'accordion', 'Test Theme', accordionValues );

	// Tabs themes unchanged
	const tabsThemes = select( STORE_NAME ).getThemes( 'tabs' );
	// 'Test Theme' does NOT appear in tabsThemes

	// TOC themes unchanged
	const tocThemes = select( STORE_NAME ).getThemes( 'toc' );
	// 'Test Theme' does NOT appear in tocThemes
	*/
}

/* eslint-enable no-unused-vars */

/**
 * Export empty object (documentation file only)
 */
export default {};
