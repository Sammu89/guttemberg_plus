/**
 * Accordion Block - Edit Component
 *
 * Editor interface for accordion block with full theme integration.
 * Uses shared UI components and cascade resolution.
 *
 * IMPORTANT: Sections marked with AUTO-GENERATED comments are automatically
 * regenerated from the schema on every build. Do not edit code between these markers.
 *
 * To modify styles:
 * 1. Edit the schema: schemas/accordion.json
 * 2. Run: npm run schema:build
 * 3. The code between markers will update automatically
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { flushSync } from 'react-dom';

import {
	generateUniqueId,
	getAllDefaults,
	calculateDeltas,
	applyDeltas,
	getThemeableSnapshot,
	STORE_NAME,
	ThemeSelector,
	SchemaPanels,
	CustomizationWarning,
	debug,
} from '@shared';
import accordionSchema from '../../../schemas/accordion.json';
import { accordionAttributes } from './accordion-attributes';
import './editor.scss';

/**
 * Accordion Edit Component
 *
 * @param {Object}   props               Block props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Attribute setter
 * @return {JSX.Element} Edit component
 */
export default function Edit( { attributes, setAttributes } ) {
	debug( '[DEBUG] Accordion Edit mounted with attributes:', attributes );

	// Generate unique ID on mount if not set
	useEffect( () => {
		if ( ! attributes.accordionId ) {
			setAttributes( {
				accordionId: `acc-${ generateUniqueId() }`,
			} );
		}
	}, [ attributes.accordionId, setAttributes ] );

	// Load themes from store
	const { themes, themesLoaded } = useSelect(
		( select ) => {
			const { getThemes, areThemesLoaded } = select( STORE_NAME );
			return {
				themes: getThemes( 'accordion' ),
				themesLoaded: areThemesLoaded( 'accordion' ),
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// Empty deps array is correct - STORE_NAME is constant and select() doesn't need deps
		[]
	);

	// Get dispatch for theme actions
	const { loadThemes, createTheme, updateTheme, deleteTheme, renameTheme } =
		useDispatch( STORE_NAME );

	// Load themes on mount
	useEffect( () => {
		if ( ! themesLoaded ) {
			loadThemes( 'accordion' );
		}
	}, [ themesLoaded, loadThemes ] );

	// Extract schema defaults from accordionAttributes (SINGLE SOURCE OF TRUTH!)
	// Schema contains ALL defaults - behavioral + themeable
	// No need for separate CSS defaults or manual attribute files
	const schemaDefaults = useMemo( () => {
		const defaults = {};
		Object.keys( accordionAttributes ).forEach( ( key ) => {
			if ( accordionAttributes[ key ].default !== undefined ) {
				defaults[ key ] = accordionAttributes[ key ].default;
			}
		} );
		return defaults;
	}, [] );

	// All defaults come from schema - single source of truth!
	const allDefaults = useMemo( () => {
		const merged = getAllDefaults( schemaDefaults );
		return merged;
	}, [ schemaDefaults ] );

	// Attributes to exclude from theme customization checks
	// Filter schema to get all attributes where themeable is NOT true
	const excludeFromCustomizationCheck = Object.entries( accordionSchema.attributes )
		.filter( ( [ , attr ] ) => attr.themeable !== true )
		.map( ( [ key ] ) => key );

	// SOURCE OF TRUTH: attributes = merged state (what you see in sidebar)
	// This is the simpler architecture - no complex cascade, just direct values
	const effectiveValues = attributes;

	// Calculate expected values: defaults + current theme deltas
	// Memoized to prevent infinite loop in session cache useEffect
	const currentTheme = themes[ attributes.currentTheme ];
	const expectedValues = useMemo( () => {
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- expectedValues Calculation Start ---' );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Current theme object:', currentTheme );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Theme deltas:', currentTheme?.values || {} );
		// console.debug( '[THEME-DEBUG] [ACCORDION] All defaults (base):', allDefaults );

		const expected = currentTheme
			? applyDeltas( allDefaults, currentTheme.values || {} )
			: allDefaults;

		// console.debug( '[THEME-DEBUG] [ACCORDION] Calculated expected values:', expected );
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- expectedValues Calculation End ---' );
		return expected;
	}, [ currentTheme, allDefaults ] );

	// Auto-detect customizations by comparing attributes to expected values
	// Memoized to avoid recalculation on every render
	// IMPORTANT: Wait for themes to load before checking customization
	const isCustomized = useMemo( () => {
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- isCustomized Calculation Start ---' );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Current theme:', attributes.currentTheme || '(none)' );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Themes loaded:', themesLoaded );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Available themes:', Object.keys( themes ) );

		// Don't check customization until themes are loaded
		// This prevents false positives when theme deltas haven't loaded yet
		if ( ! themesLoaded ) {
			// console.debug( '[THEME-DEBUG] [ACCORDION] Themes not loaded yet - returning false' );
			return false;
		}

		// If block has a theme but it doesn't exist in themes object, wait
		if ( attributes.currentTheme && ! themes[ attributes.currentTheme ] ) {
			// console.debug( '[THEME-DEBUG] [ACCORDION] Theme selected but not found in themes object - returning false' );
			return false;
		}

		const customizedAttributes = [];
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
			let isDifferent = false;
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			} else {
				isDifferent = attrValue !== expectedValue;
			}

			if ( isDifferent ) {
				customizedAttributes.push( {
					key,
					current: attrValue,
					expected: expectedValue,
				} );
			}

			return isDifferent;
		} );

		// console.debug( '[THEME-DEBUG] [ACCORDION] Number of customizations:', customizedAttributes.length );
		// if ( customizedAttributes.length > 0 ) {
		// 	console.debug( '[THEME-DEBUG] [ACCORDION] Customized attributes:', customizedAttributes );
		// }
		// console.debug( '[THEME-DEBUG] [ACCORDION] isCustomized result:', result );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Should show "Save new theme":', result );
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- isCustomized Calculation End ---' );

		return result;
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, themesLoaded, themes ] );

	debug( '[DEBUG] Accordion attributes (source of truth):', attributes );
	debug( '[DEBUG] Expected values (defaults + theme):', expectedValues );
	debug( '[DEBUG] Is customized:', isCustomized );

	// SESSION-ONLY customization cache (not saved to database)
	// Stores snapshots PER THEME: { "": {...}, "Dark Mode": {...} }
	// Allows switching between themes and keeping customizations during session
	// Discarded on page reload (React state only)
	const [ sessionCache, setSessionCache ] = useState( {} );

	// Local state for width input (allows typing without validation)
	const [ widthInput, setWidthInput ] = useState( attributes.accordionWidth || '100%' );

	// Sync local input state when attribute changes externally
	useEffect( () => {
		const newWidth = attributes.accordionWidth || '100%';
		setWidthInput( newWidth );
	}, [ attributes.accordionWidth ] );

	// Auto-update session cache for CURRENT theme
	// Maintains per-block customization memory across theme switches
	// IMPORTANT: Only update cache when themes are fully loaded to avoid premature caching
	useEffect( () => {
		// GUARD: Skip cache update if themes aren't loaded yet
		// This prevents incorrect comparisons against default values when theme values should be used
		if ( ! themesLoaded ) {
			return;
		}

		const snapshot = getThemeableSnapshot( attributes, excludeFromCustomizationCheck );
		const currentThemeKey = attributes.currentTheme || '';

		// Check if snapshot differs from expected values
		const hasCustomizations = Object.keys( snapshot ).some( ( key ) => {
			// Skip excluded attributes
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return false;
			}

			const snapshotValue = snapshot[ key ];
			const expectedValue = expectedValues[ key ];

			// Skip undefined/null
			if ( snapshotValue === undefined || snapshotValue === null ) {
				return false;
			}

			// Deep comparison for objects
			if ( typeof snapshotValue === 'object' && snapshotValue !== null ) {
				return JSON.stringify( snapshotValue ) !== JSON.stringify( expectedValue );
			}

			return snapshotValue !== expectedValue;
		} );

		// IMPORTANT: Only UPDATE cache when there ARE customizations
		// NEVER delete from cache automatically - only manual operations (Reset/Save/Update) should clear cache
		// This preserves customizations across theme switches
		if ( hasCustomizations ) {
			setSessionCache( ( prev ) => {
				// Only update if actually different to avoid unnecessary re-renders
				const existingCache = prev[ currentThemeKey ];
				const snapshotStr = JSON.stringify( snapshot );
				const existingStr = JSON.stringify( existingCache );

				if ( snapshotStr !== existingStr ) {
					debug( '[SESSION CACHE] Updating cache for theme:', currentThemeKey );
					return {
						...prev,
						[ currentThemeKey ]: snapshot,
					};
				}
				return prev;
			} );
		}
		// If no customizations, DO NOTHING - keep existing cache intact
		// This prevents accidental cache loss when switching themes
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, themesLoaded ] );

	// Auto-update customizations attribute (deltas from expected values)
	// This is used by save.js to output ONLY true customizations as inline CSS
	// Tier 2 (theme CSS in <head>) handles theme values, Tier 3 (inline) handles deltas
	useEffect( () => {
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- Customizations Attribute Update Start ---' );
		// Calculate deltas: attributes that differ from expected values
		const newCustomizations = {};

		Object.keys( attributes ).forEach( ( key ) => {
			// Skip excluded attributes
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}

			const attrValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			// Skip undefined/null values
			if ( attrValue === undefined || attrValue === null ) {
				return;
			}

			// Check if value differs from expected
			let isDifferent = false;
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			} else {
				isDifferent = attrValue !== expectedValue;
			}

			// Only include if different from expected
			if ( isDifferent ) {
				newCustomizations[ key ] = attrValue;
			}
		} );

		// Only update if customizations actually changed (avoid infinite loop)
		const currentCustomizations = attributes.customizations || {};
		const newStr = JSON.stringify( newCustomizations );
		const currentStr = JSON.stringify( currentCustomizations );

		// console.debug( '[THEME-DEBUG] [ACCORDION] Current customizations attribute:', currentCustomizations );
		// console.debug( '[THEME-DEBUG] [ACCORDION] New customizations calculated:', newCustomizations );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Customizations changed:', newStr !== currentStr );

		if ( newStr !== currentStr ) {
			// console.debug( '[THEME-DEBUG] [ACCORDION] Updating customizations attribute...' );
			debug( '[CUSTOMIZATIONS] Updating customizations attribute:', newCustomizations );
			setAttributes( { customizations: newCustomizations } );
		}
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- Customizations Attribute Update End ---' );
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, setAttributes ] );

	// Log when currentTheme changes (for debugging)
	useEffect( () => {
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- Theme Switch Event ---' );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Switched to theme:', attributes.currentTheme || '(none/defaults)' );
		// console.debug( '[THEME-DEBUG] [ACCORDION] isCustomized after switch:', isCustomized );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Available themes:', Object.keys( themes ) );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Current attributes:', attributes );
		// console.debug( '[THEME-DEBUG] [ACCORDION] Expected values:', expectedValues );
		// console.debug( '[THEME-DEBUG] [ACCORDION] --- Theme Switch Event End ---' );
		debug( '[THEME CHANGE] currentTheme changed to:', attributes.currentTheme );
		debug( '[THEME CHANGE] isCustomized:', isCustomized );
		debug( '[THEME CHANGE] Available themes:', Object.keys( themes ) );
	}, [ attributes.currentTheme ] );

	/**
	 * Theme callback handlers
	 * @param themeName
	 */
	const handleSaveNewTheme = async ( themeName ) => {
		// Get current snapshot from session cache OR current attributes as fallback
		const currentThemeKey = attributes.currentTheme || '';
		const cachedSnapshot = sessionCache[ currentThemeKey ];

		// IMPORTANT: Use current attributes as fallback if sessionCache is empty
		// This prevents saving empty themes if cache was cleared
		const currentSnapshot = cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
			? cachedSnapshot
			: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

		// Calculate deltas from current snapshot (optimized storage)
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

		// Save theme with deltas only
		const createdTheme = await createTheme( 'accordion', themeName, deltas );

		// Reset to clean theme: apply defaults + new theme deltas
		const newTheme = { values: deltas };
		const newExpectedValues = applyDeltas( allDefaults, newTheme.values || {} );
		const resetAttrs = { ...newExpectedValues };
		debug( '[THEME CREATE DEBUG] New expected values:', newExpectedValues );

		// Remove excluded attributes (except currentTheme which we need to set)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( key !== 'currentTheme' ) {
				delete resetAttrs[ key ];
			}
		} );

		// Now set the currentTheme to the new theme name
		resetAttrs.currentTheme = themeName;
		debug( '[THEME CREATE DEBUG] Reset attributes to set:', resetAttrs );

		debug( '[THEME CREATE DEBUG] Calling setAttributes with:', resetAttrs );
		// Use flushSync to force synchronous update BEFORE clearing session cache
		// This prevents race condition where useEffect repopulates cache after we delete it
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for BOTH old and new themes
		// This ensures the new theme starts completely clean without appearing customized
		// Now safe to do this because setAttributes has completed above
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ]; // Delete old theme cache
			delete updated[ themeName ]; // Delete new theme cache (prevents showing as customized)
			debug( '[THEME CREATE DEBUG] Updated session cache:', updated );
			return updated;
		} );

		debug( '[THEME CREATE DEBUG] Theme creation completed' );
	};

	const handleUpdateTheme = async () => {
		// Get current snapshot from session cache OR current attributes as fallback
		const currentThemeKey = attributes.currentTheme || '';
		const cachedSnapshot = sessionCache[ currentThemeKey ];

		// IMPORTANT: Use current attributes as fallback if sessionCache is empty
		// This prevents updating themes with empty data if cache was cleared
		const currentSnapshot = cachedSnapshot && Object.keys( cachedSnapshot ).length > 0
			? cachedSnapshot
			: getThemeableSnapshot( attributes, excludeFromCustomizationCheck );

		// Calculate deltas from current snapshot
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

		// Update theme with new deltas - handle errors
		try {
			await updateTheme( 'accordion', attributes.currentTheme, deltas );
		} catch ( error ) {
			// If theme doesn't exist or is broken, reset to default
			if ( error?.code === 'theme_not_found' || error?.status === 404 ) {
				setAttributes( { currentTheme: '' } );
				return;
			}
			// Re-throw other errors
			throw error;
		}

		// IMPORTANT: Recalculate expected values with the NEW deltas
		// (can't use expectedValues because it's based on old theme data)
		const updatedExpectedValues = applyDeltas( allDefaults, deltas );
		debug( '[UPDATE THEME DEBUG] Updated expected values:', updatedExpectedValues );

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
			// Skip excluded attributes (already handled above)
			if ( ! excludeFromCustomizationCheck.includes( key ) ) {
				resetAttrs[ key ] = updatedExpectedValues[ key ];
			}
		} );

		// Explicitly clear any customizations that differ from theme
		// by setting them to undefined so WordPress removes them from database
		Object.keys( attributes ).forEach( ( key ) => {
			// Skip excluded attributes
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}
			// If attribute is NOT in the new theme expected values, clear it
			if ( ! updatedExpectedValues.hasOwnProperty( key ) && attributes[ key ] !== undefined ) {
				resetAttrs[ key ] = undefined; // Clear the customization
			}
		} );

		debug( '[UPDATE THEME DEBUG] Attributes to set (customizations cleared):', resetAttrs );

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for this theme (now matches clean theme)
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			return updated;
		} );
	};

	const handleDeleteTheme = async () => {
		await deleteTheme( 'accordion', attributes.currentTheme );

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
	};

	const handleRenameTheme = async ( oldName, newName ) => {
		await renameTheme( 'accordion', oldName, newName );
		setAttributes( { currentTheme: newName } );
	};

	const handleResetCustomizations = () => {
		debug( '[RESET DEBUG] Resetting customizations to clean theme' );
		debug( '[RESET DEBUG] Current theme:', attributes.currentTheme );
		debug( '[RESET DEBUG] Expected values:', expectedValues );
		debug( '[RESET DEBUG] Current attributes:', attributes );

		// IMPORTANT: WordPress setAttributes() ignores null/undefined values!
		// So we need to explicitly clear customized attributes first

		// Start with expected values (defaults + current theme)
		const resetAttrs = {};

		// For each attribute in the block
		Object.keys( attributes ).forEach( ( key ) => {
			// Skip excluded attributes
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
				// Explicitly set to expected value (or undefined to clear)
				resetAttrs[ key ] = expectedValue !== undefined ? expectedValue : undefined;
				debug( `[RESET DEBUG] Clearing customization: ${ key } from ${ JSON.stringify( currentValue ) } to ${ JSON.stringify( expectedValue ) }` );
			}
		} );

		// Preserve the current theme selection
		resetAttrs.currentTheme = attributes.currentTheme;

		debug( '[RESET DEBUG] Attributes to set:', resetAttrs );

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for current theme
		// Safe to do now because setAttributes completed above
		const currentThemeKey = attributes.currentTheme || '';
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			debug( '[RESET DEBUG] Cleared session cache for theme:', currentThemeKey );
			return updated;
		} );
	};

	/**
	 * Handle theme change
	 * User can select either clean theme or customized variant from dropdown
	 * @param {string} newThemeName - Theme name to switch to
	 * @param {boolean} useCustomized - Whether user selected customized variant
	 */
	const handleThemeChange = ( newThemeName, useCustomized = false ) => {
		debug( '[THEME CHANGE DEBUG] Switching from:', attributes.currentTheme, 'to:', newThemeName );

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

		debug( '[THEME CHANGE DEBUG] Values to apply:', valuesToApply );
		debug( '[THEME CHANGE DEBUG] Current attributes:', attributes );

		// IMPORTANT: WordPress setAttributes() ignores null/undefined values!
		// We need to explicitly clear attributes that differ from the new theme

		const resetAttrs = {};

		// For each attribute in the block
		Object.keys( attributes ).forEach( ( key ) => {
			// Skip excluded attributes
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}

			const currentValue = attributes[ key ];
			const newValue = valuesToApply[ key ];

			// If value is different, explicitly set it
			if ( currentValue !== newValue ) {
				// Set to new value (or undefined to force clear if new value is null/undefined)
				resetAttrs[ key ] = newValue !== undefined ? newValue : undefined;
				debug( `[THEME CHANGE DEBUG] Changing ${ key } from ${ JSON.stringify( currentValue ) } to ${ JSON.stringify( newValue ) }` );
			}
		});

		// Also set any new attributes from the theme that aren't in current attributes
		Object.keys( valuesToApply ).forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}
			if ( ! attributes.hasOwnProperty( key ) && valuesToApply[ key ] !== undefined ) {
				resetAttrs[ key ] = valuesToApply[ key ];
				debug( `[THEME CHANGE DEBUG] Adding new attribute ${ key } = ${ JSON.stringify( valuesToApply[ key ] ) }` );
			}
		});

		// Set the new theme
		resetAttrs.currentTheme = newThemeName;

		debug( '[THEME CHANGE DEBUG] Final attributes to set:', resetAttrs );
		setAttributes( resetAttrs );
	};

	/**
	 * Apply inline styles from effective values
	 */
	/* ========== AUTO-GENERATED-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// AUTO-GENERATED from schemas/accordion.json
// To modify styles, update the schema and run: npm run schema:build

const getInlineStyles = () => {
  // Extract object-type attributes with fallbacks
	const borderRadius = effectiveValues.borderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 4,
		    "bottomLeft": 4
		};

	return {
		container: {
			borderColor: effectiveValues.borderColor || '#dddddd',
			borderWidth: `${effectiveValues.borderWidth || 1}px`,
			borderStyle: effectiveValues.borderStyle || 'solid',
			borderRadius: `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.shadow || 'none',
		},
		title: {
			color: effectiveValues.titleColor || '#333333',
			backgroundColor: effectiveValues.titleBackgroundColor || '#f5f5f5',
			fontSize: `${effectiveValues.titleFontSize || 18}px`,
			fontWeight: effectiveValues.titleFontWeight || '600',
			fontStyle: effectiveValues.titleFontStyle || 'normal',
			textTransform: effectiveValues.titleTextTransform || 'none',
			textDecoration: effectiveValues.titleTextDecoration || 'none',
			textAlign: effectiveValues.titleAlignment || 'left',
		},
		content: {
			color: effectiveValues.contentColor || '#333333',
			backgroundColor: effectiveValues.contentBackgroundColor || '#ffffff',
			borderTopColor: effectiveValues.dividerColor || '#dddddd',
			fontSize: `${effectiveValues.contentFontSize || 16}px`,
			fontWeight: effectiveValues.contentFontWeight || 'null',
			borderTopWidth: `${effectiveValues.dividerWidth || 0}px`,
			borderTopStyle: effectiveValues.dividerStyle || 'solid',
		},
		icon: {
			color: effectiveValues.iconColor || '#666666',
			fontSize: `${effectiveValues.iconSize || 20}px`,
			transform: `${effectiveValues.iconRotation || 180}deg`,
		},
	};
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

	const styles = getInlineStyles();

	/**
	 * Render icon based on settings
	 * @param {string} position - Icon position ('left', 'right', 'extreme-left', 'extreme-right')
	 */
	const renderIcon = ( position = 'right' ) => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed || '▾';
		const isImage = iconContent.startsWith( 'http' );

		// Determine margin based on position
		const isLeftPosition = position === 'left' || position === 'extreme-left';
		const iconStyle = {
			...styles.icon,
			margin: isLeftPosition ? '0 8px 0 0' : '0 0 0 8px', // right margin if left, left margin if right
		};

		if ( isImage ) {
			return (
				<img
					src={ iconContent }
					alt=""
					aria-hidden="true"
					style={ {
						width: '18px',
						height: '18px',
						objectFit: 'contain',
						...( isLeftPosition ? { marginRight: '8px' } : { marginLeft: '8px' } ),
					} }
				/>
			);
		}

		return (
			<span className="accordion-icon" aria-hidden="true" style={ iconStyle }>
				{ iconContent }
			</span>
		);
	};

	/**
	 * Render title with optional heading wrapper
	 */
	const renderTitle = () => {
		const headingLevel = effectiveValues.headingLevel || 'none';
		const iconPosition = effectiveValues.iconPosition || 'right';
		const titleAlignment = effectiveValues.titleAlignment || 'left';

		// Build title content - icon position affects layout structure
		let titleContent;


		if ( iconPosition === 'extreme-left' ) {
			// Extreme left: icon on left, text grows and aligns within its space
			// Wrap text in a container that grows and handles text alignment
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: 'flex-start' } }>
					{ renderIcon( iconPosition ) }
					<div style={ { flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'center' } }>
						<RichText
							tagName="span"
							value={ attributes.title || '' }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
							className="accordion-title-text"
							style={ { textAlign: titleAlignment, flex: '1 1 auto', minWidth: 0 } }
						/>
					</div>
				</div>
			);
		} else if ( iconPosition === 'extreme-right' ) {
			// Extreme right: text grows and aligns within its space, icon on right
			// Wrap text in a container that grows and handles text alignment
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: 'flex-start' } }>
					<div style={ { flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'center' } }>
						<RichText
							tagName="span"
							value={ attributes.title || '' }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
							className="accordion-title-text"
							style={ { textAlign: titleAlignment, flex: '1 1 auto', minWidth: 0 } }
						/>
					</div>
					{ renderIcon( iconPosition ) }
				</div>
			);
		} else if ( iconPosition === 'left' ) {
			// Left of text: wrap icon+text together, then center/align that group
			const textGroup = (
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: titleAlignment } }>
					{ renderIcon( iconPosition ) }
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
						style={ { textAlign: titleAlignment } }
					/>
				</div>
			);
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: titleAlignment } }>
					{ textGroup }
				</div>
			);
		} else {
			// Right of text: wrap text+icon together, then center/align that group
			const textGroup = (
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: titleAlignment } }>
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
						style={ { textAlign: titleAlignment } }
					/>
					{ renderIcon( iconPosition ) }
				</div>
			);
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: titleAlignment } }>
					{ textGroup }
				</div>
			);
		}

		if ( headingLevel !== 'none' ) {
			const HeadingTag = headingLevel;
			return (
				<HeadingTag className="accordion-heading" style={ { margin: 0 } }>
					{ titleContent }
				</HeadingTag>
			);
		}

		return titleContent;
	};


	// Validate width input - accepts pixels or percentage
	const validateWidth = ( value ) => {
		if ( ! value || value.trim() === '' ) {
			return '100%';
		}

		// Trim whitespace
		value = value.trim();

		// Check if it's a valid pixel value (number followed by 'px')
		const pxMatch = value.match( /^(\d+(?:\.\d+)?)px$/i );
		if ( pxMatch ) {
			return value;
		}

		// Check if it's a valid percentage (number followed by '%')
		const percentMatch = value.match( /^(\d+(?:\.\d+)?)%$/i );
		if ( percentMatch ) {
			return value;
		}

		// Check if it's just a number (assume pixels)
		const numberMatch = value.match( /^(\d+(?:\.\d+)?)$/ );
		if ( numberMatch ) {
			return `${ value }px`;
		}

		// Invalid format - default to 100%
		return '100%';
	};

	// Build inline styles for width control
	const editorStyles = {
		width: effectiveValues.accordionWidth || '100%',
	};

	const blockProps = useBlockProps( {
		className: 'wp-block-accordion sammu-blocks',
		style: editorStyles,
	} );

	return (
		<>
						<InspectorControls>
				<div className="accordion-settings-panel">
					<ThemeSelector
						blockType="accordion"
						currentTheme={ attributes.currentTheme }
						isCustomized={ isCustomized }
						attributes={ attributes }
						effectiveValues={ effectiveValues }
						setAttributes={ setAttributes }
						themes={ themes }
						themesLoaded={ themesLoaded }
						onSaveNew={ handleSaveNewTheme }
						onUpdate={ handleUpdateTheme }
						onDelete={ handleDeleteTheme }
						onRename={ handleRenameTheme }
						onReset={ handleResetCustomizations }
						onThemeChange={ handleThemeChange }
						sessionCache={ sessionCache }
					/>
				</div>

				{/* Auto-generated panels from schema */}
				<SchemaPanels
					schema={ accordionSchema }
					attributes={ attributes }
					setAttributes={ setAttributes }
					effectiveValues={ effectiveValues }
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ allDefaults }
				/>

				{ isCustomized && (
					<div className="customization-warning-wrapper">
						<CustomizationWarning
							currentTheme={ attributes.currentTheme }
							themes={ themes }
						/>
					</div>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				{ ! themesLoaded && (
					<div className="accordion-loading">
						<p>{ __( 'Loading themes…', 'guttemberg-plus' ) }</p>
					</div>
				) }

				{ themesLoaded && (
					<div className="accordion-item" style={ styles.container }>
						{ renderTitle() }

						<div className="accordion-content" style={ styles.content }>
							<InnerBlocks
								templateLock={ false }
								placeholder={ __( 'Add accordion content…', 'guttemberg-plus' ) }
							/>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
