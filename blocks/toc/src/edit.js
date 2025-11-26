/**
 * TOC Block - Edit Component
 *
 * Handles block rendering in the WordPress editor with:
 * - Automatic heading detection from post content
 * - Theme management integration
 * - Filter settings UI
 * - Live preview of TOC structure
 *
 * @package
 * @since 1.0.0
 */

import { useEffect, useState, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { flushSync } from 'react-dom';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	CheckboxControl,
	RangeControl,
} from '@wordpress/components';
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
import tocSchema from '../../../schemas/toc.json';
import './editor.scss';

/**
 * Edit Component
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 * @param root0.clientId
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	debug( '[DEBUG] TOC Edit mounted with attributes:', attributes );

	const { tocId, showTitle, titleText, currentTheme } = attributes;
	const [ headings, setHeadings ] = useState( [] );

	// Session-only cache (React state, not saved to database)
	// Stores complete snapshots PER THEME: { "": {...}, "Dark Mode": {...} }
	// Lost on page reload (desired behavior)
	const [ sessionCache, setSessionCache ] = useState( {} );

	// Load themes from store
	const { themes, themesLoaded } = useSelect( ( select ) => {
		const { getThemes, areThemesLoaded } = select( STORE_NAME );
		return {
			themes: getThemes( 'toc' ) || {},
			themesLoaded: areThemesLoaded( 'toc' ),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// Empty deps array is correct - STORE_NAME is constant and select() doesn't need deps
	}, [] );

	// Load themes on mount and get theme action dispatchers
	const { loadThemes, createTheme, updateTheme, deleteTheme, renameTheme } =
		useDispatch( STORE_NAME );
	useEffect( () => {
		if ( ! themesLoaded ) {
			loadThemes( 'toc' );
		}
	}, [ themesLoaded, loadThemes ] );

	// Generate unique ID on mount
	useEffect( () => {
		if ( ! tocId ) {
			setAttributes( { tocId: generateUniqueId() } );
		}
	}, [ tocId, setAttributes ] );

	// Detect headings in post content
	useEffect( () => {
		const detectHeadings = () => {
			// Get all headings in the post content (excluding this block)
			const contentArea = document.querySelector( '.editor-styles-wrapper' );
			if ( ! contentArea ) {
				return [];
			}

			const allHeadings = contentArea.querySelectorAll( 'h2, h3, h4, h5, h6' );
			const detectedHeadings = [];

			allHeadings.forEach( ( heading ) => {
				// Skip headings inside this TOC block
				const isInThisBlock = heading.closest( `[data-block="${ clientId }"]` );
				if ( isInThisBlock ) {
					return;
				}

				const level = parseInt( heading.tagName.charAt( 1 ), 10 );
				const text = heading.textContent.trim();
				const id = heading.id || '';
				const classes = Array.from( heading.classList );

				detectedHeadings.push( { level, text, id, classes } );
			} );

			return detectedHeadings;
		};

		// Run detection
		const detected = detectHeadings();
		setHeadings( detected );

		// Re-run on content changes (debounced)
		const observer = new MutationObserver( () => {
			setTimeout( () => {
				const updated = detectHeadings();
				setHeadings( updated );
			}, 100 );
		} );

		const contentArea = document.querySelector( '.editor-styles-wrapper' );
		if ( contentArea ) {
			observer.observe( contentArea, {
				childList: true,
				subtree: true,
				characterData: true,
			} );
		}

		return () => observer.disconnect();
	}, [ clientId ] );

	// Get CSS defaults from window (parsed by PHP)
	// Memoize to prevent creating new object on every render
	const cssDefaults = useMemo( () => window.tocDefaults || {}, [] );

	// Get all defaults (CSS + behavioral)
	// Memoize to prevent infinite loop in session cache useEffect
	const allDefaults = useMemo( () => getAllDefaults( cssDefaults ), [ cssDefaults ] );

	// SOURCE OF TRUTH: attributes = merged state (what you see in sidebar)
	const effectiveValues = attributes;

	// Get current theme
	const theme = themes[ currentTheme ];

	// Calculate expected values: defaults + current theme deltas
	// Memoized to prevent infinite loop in session cache useEffect
	const expectedValues = useMemo( () => {
		return theme
			? applyDeltas( allDefaults, theme.values || {} )
			: allDefaults;
	}, [ theme, allDefaults ] );

	// Attributes to exclude from theming (structural/behavioral only)
	// Attributes to exclude from theme customization checks
	// Attributes to exclude from theme customization checks
	// Filter schema to get all attributes where themeable is NOT true
	const excludeFromCustomizationCheck = Object.entries( tocSchema.attributes )
		.filter( ( [ , attr ] ) => attr.themeable !== true )
		.map( ( [ key ] ) => key );

	// Auto-detect customizations by comparing attributes to expected values
	// Memoized to avoid recalculation on every render
	const isCustomized = useMemo( () => {
		return Object.keys( attributes ).some( ( key ) => {
			// Skip excluded attributes
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return false;
			}

			const attrValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			// Skip undefined/null attributes
			if ( attrValue === undefined || attrValue === null ) {
				return false;
			}

			// Deep comparison for objects
			if ( typeof attrValue === 'object' && attrValue !== null && ! Array.isArray( attrValue ) ) {
				return JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			}

			// Simple comparison for primitives
			return attrValue !== expectedValue;
		} );
	}, [ attributes, expectedValues, excludeFromCustomizationCheck ] );

	debug( '[DEBUG] TOC effective values:', effectiveValues );
	debug( '[DEBUG] TOC expected values:', expectedValues );
	debug( '[DEBUG] TOC isCustomized:', isCustomized );

	// Auto-update session cache for CURRENT theme (session-only, not saved to database)
	// This preserves customizations across theme switches WITHIN the editing session
	// Lost on page reload or post save (desired behavior)
	// ONLY add if there are actual customizations vs expected values
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

		if ( hasCustomizations ) {
			// Only add to cache if there are actual customizations
			setSessionCache( ( prev ) => ( {
				...prev,
				[ currentThemeKey ]: snapshot,
			} ) );
		} else {
			// Remove from cache if no customizations (clean theme)
			setSessionCache( ( prev ) => {
				const updated = { ...prev };
				delete updated[ currentThemeKey ];
				return updated;
			} );
		}
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, themesLoaded ] );

	/**
	 * Theme callback handlers
	 * @param themeName
	 */
	const handleSaveNewTheme = async ( themeName ) => {
		// Use session cache snapshot for current theme
		const currentThemeKey = attributes.currentTheme || '';
		const currentSnapshot = sessionCache[ currentThemeKey ] || {};
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

		await createTheme( 'toc', themeName, deltas );

		// Switch to clean theme (reset to defaults + new theme deltas)
		const newExpectedValues = applyDeltas( allDefaults, deltas );
		const resetAttrs = { ...newExpectedValues };

		// Remove excluded attributes (except currentTheme which we need to set)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( key !== 'currentTheme' ) {
				delete resetAttrs[ key ];
			}
		} );

		// Now set the currentTheme to the new theme name
		resetAttrs.currentTheme = themeName;

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for BOTH old and new themes
		// This ensures the new theme starts completely clean without appearing customized
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ]; // Delete old theme cache
			delete updated[ themeName ]; // Delete new theme cache (prevents showing as customized)
			return updated;
		} );
	};

	const handleUpdateTheme = async () => {
		// Use session cache snapshot for current theme
		const currentThemeKey = attributes.currentTheme || '';
		const currentSnapshot = sessionCache[ currentThemeKey ] || {};
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

		// Update theme with error handling
		try {
			await updateTheme( 'toc', attributes.currentTheme, deltas );
		} catch ( error ) {
			console.error( '[UPDATE THEME ERROR]', error );
			// If theme doesn't exist or is broken, reset to default
			if ( error?.code === 'theme_not_found' || error?.status === 404 ) {
				console.warn( '[UPDATE THEME] Theme not found - resetting to default' );
				setAttributes( { currentTheme: '' } );
				return;
			}
			// Re-throw other errors
			throw error;
		}

		// Reset to updated theme: apply defaults + updated theme deltas
		const resetAttrs = { ...expectedValues };

		// Remove excluded attributes
		excludeFromCustomizationCheck.forEach( ( key ) => {
			delete resetAttrs[ key ];
		} );

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache (theme now matches current state)
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			return updated;
		} );
	};

	const handleDeleteTheme = () => {
		deleteTheme( 'toc', attributes.currentTheme );

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

	const handleRenameTheme = ( oldName, newName ) => {
		renameTheme( 'toc', oldName, newName );
		setAttributes( { currentTheme: newName } );
	};

	const handleResetCustomizations = () => {
		// Reset to clean theme: apply expected values (defaults + current theme)
		const resetAttrs = { ...expectedValues };

		// Remove excluded attributes from reset (except currentTheme which we need to preserve)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( key !== 'currentTheme' ) {
				delete resetAttrs[ key ];
			}
		} );

		// Preserve the current theme selection
		resetAttrs.currentTheme = attributes.currentTheme;

		// Use flushSync to force synchronous update before clearing cache
		flushSync( () => {
			setAttributes( resetAttrs );
		} );

		// Clear session cache for current theme
		const currentThemeKey = attributes.currentTheme || '';
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			return updated;
		} );
	};

	/**
	 * Handle theme change from dropdown
	 * Supports dual variants: clean theme and customized theme
	 *
	 * @param {string}  newThemeName   Theme name to switch to
	 * @param {boolean} useCustomized  Whether to restore from session cache
	 */
	const handleThemeChange = ( newThemeName, useCustomized = false ) => {
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

		// Apply values and update currentTheme
		const resetAttrs = { ...valuesToApply };

		// Remove excluded attributes (except currentTheme which we need to set)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			if ( key !== 'currentTheme' ) {
				delete resetAttrs[ key ];
			}
		} );

		// Set the new theme
		resetAttrs.currentTheme = newThemeName;

		setAttributes( resetAttrs );
	};

	// Filter headings based on settings
	const filteredHeadings = filterHeadings( headings, attributes );

	// Block props
	const blockProps = useBlockProps( {
		className: 'wp-block-custom-toc sammu-blocks',
		style: buildInlineStyles( effectiveValues ),
	} );

	return (
		<>
			<InspectorControls>
				<div className="toc-settings-panel">
					<ThemeSelector
						blockType="toc"
						currentTheme={ currentTheme }
						setAttributes={ setAttributes }
						attributes={ attributes }
						themes={ themes }
						themesLoaded={ themesLoaded }
						isCustomized={ isCustomized }
						effectiveValues={ effectiveValues }
						sessionCache={ sessionCache }
						onThemeChange={ handleThemeChange }
						onSaveNew={ handleSaveNewTheme }
						onUpdate={ handleUpdateTheme }
						onDelete={ handleDeleteTheme }
						onRename={ handleRenameTheme }
						onReset={ handleResetCustomizations }
					/>
				</div>

				{ /* TOC Settings Panel */ }
				<PanelBody title="TOC Settings" initialOpen={ true }>
					<ToggleControl
						label="Show Title"
						checked={ showTitle }
						onChange={ ( value ) => setAttributes( { showTitle: value } ) }
					/>

					{ showTitle && (
						<TextControl
							label="Title Text"
							value={ titleText }
							onChange={ ( value ) => setAttributes( { titleText: value } ) }
							__nextHasNoMarginBottom
						/>
					) }

					<ToggleControl
						label="Collapsible"
						checked={ attributes.isCollapsible }
						onChange={ ( value ) => setAttributes( { isCollapsible: value } ) }
					/>

					{ attributes.isCollapsible && (
						<>
							<ToggleControl
								label="Initially Collapsed"
								checked={ attributes.initiallyCollapsed }
								onChange={ ( value ) =>
									setAttributes( {
										initiallyCollapsed: value,
									} )
								}
							/>

							<SelectControl
								label="Click Behavior"
								value={ attributes.clickBehavior || 'navigate' }
								options={ [
									{
										label: 'Navigate to section',
										value: 'navigate',
									},
									{
										label: 'Navigate and collapse TOC',
										value: 'navigate-and-collapse',
									},
								] }
								onChange={ ( value ) => setAttributes( { clickBehavior: value } ) }
								__next40pxDefaultSize
							/>
						</>
					) }
				</PanelBody>

				{ /* Heading Filter Panel */ }
				<PanelBody title="Heading Filter" initialOpen={ false }>
					<SelectControl
						label="Filter Mode"
						value={ attributes.filterMode }
						options={ [
							{
								label: 'Include All Headings',
								value: 'include-all',
							},
							{
								label: 'Include Only Selected',
								value: 'include-only',
							},
							{ label: 'Exclude Selected', value: 'exclude' },
						] }
						onChange={ ( value ) => setAttributes( { filterMode: value } ) }
						__next40pxDefaultSize
					/>

					{ attributes.filterMode === 'include-only' && (
						<>
							<p>
								<strong>Include Levels:</strong>
							</p>
							{ [ 2, 3, 4, 5, 6 ].map( ( level ) => (
								<CheckboxControl
									key={ level }
									label={ `H${ level }` }
									checked={ attributes.includeLevels.includes( level ) }
									onChange={ ( checked ) => {
										const levels = checked
											? [ ...attributes.includeLevels, level ]
											: attributes.includeLevels.filter(
													( l ) => l !== level
											  );
										setAttributes( {
											includeLevels: levels,
										} );
									} }
									__nextHasNoMarginBottom
								/>
							) ) }

							<TextControl
								label="Include Classes (comma-separated)"
								value={ attributes.includeClasses }
								onChange={ ( value ) => setAttributes( { includeClasses: value } ) }
								__nextHasNoMarginBottom
							/>
						</>
					) }

					{ attributes.filterMode === 'exclude' && (
						<>
							<p>
								<strong>Exclude Levels:</strong>
							</p>
							{ [ 2, 3, 4, 5, 6 ].map( ( level ) => (
								<CheckboxControl
									key={ level }
									label={ `H${ level }` }
									checked={ attributes.excludeLevels.includes( level ) }
									onChange={ ( checked ) => {
										const levels = checked
											? [ ...attributes.excludeLevels, level ]
											: attributes.excludeLevels.filter(
													( l ) => l !== level
											  );
										setAttributes( {
											excludeLevels: levels,
										} );
									} }
									__nextHasNoMarginBottom
								/>
							) ) }

							<TextControl
								label="Exclude Classes (comma-separated)"
								value={ attributes.excludeClasses }
								onChange={ ( value ) => setAttributes( { excludeClasses: value } ) }
								__nextHasNoMarginBottom
							/>
						</>
					) }

					<RangeControl
						label="Depth Limit (0 = no limit)"
						value={ attributes.depthLimit || 0 }
						onChange={ ( value ) =>
							setAttributes( {
								depthLimit: value === 0 ? null : value,
							} )
						}
						min={ 0 }
						max={ 6 }
					/>
				</PanelBody>

				{ /* Numbering Panel */ }
				<PanelBody title="Numbering" initialOpen={ false }>
					<SelectControl
						label="Numbering Style"
						value={ attributes.numberingStyle }
						options={ [
							{ label: 'None', value: 'none' },
							{
								label: 'Decimal (1, 1.1, 1.1.1)',
								value: 'decimal',
							},
							{
								label: 'Decimal Leading Zero',
								value: 'decimal-leading-zero',
							},
							{ label: 'Roman Numerals', value: 'roman' },
							{ label: 'Letters (A, B, C)', value: 'letters' },
						] }
						onChange={ ( value ) => setAttributes( { numberingStyle: value } ) }
						__next40pxDefaultSize
					/>
				</PanelBody>

				{/* Auto-generated panels from schema */}
				<SchemaPanels
					schema={ tocSchema }
					attributes={ attributes }
					setAttributes={ setAttributes }
					effectiveValues={ effectiveValues }
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				{ /* Customization Warning */ }
				{ isCustomized && (
					<div className="customization-warning-wrapper">
						<CustomizationWarning currentTheme={ currentTheme } themes={ themes } />
					</div>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				{ showTitle && (
					<div
						className="toc-title"
						style={ {
							fontSize: `${ effectiveValues.titleFontSize || 20 }px`,
							fontWeight: effectiveValues.titleFontWeight || '700',
							color: effectiveValues.titleColor || '#333333',
							textAlign: effectiveValues.titleAlignment || 'left',
						} }
					>
						{ titleText }
					</div>
				) }

				{ filteredHeadings.length === 0 ? (
					<p className="toc-empty-message">
						No headings found. Add H2-H6 headings to your content to populate the table
						of contents.
					</p>
				) : (
					<nav
						className="toc-list-wrapper"
						aria-label={ titleText || 'Table of Contents' }
					>
						{ renderHeadingsList( filteredHeadings, effectiveValues, attributes ) }
					</nav>
				) }
			</div>
		</>
	);
}

/**
 * Filter headings based on filter settings
 * @param headings
 * @param attributes
 */
function filterHeadings( headings, attributes ) {
	const { filterMode, includeLevels, includeClasses, excludeLevels, excludeClasses, depthLimit } =
		attributes;

	let filtered = headings;

	// Apply filter mode
	if ( filterMode === 'include-only' ) {
		filtered = filtered.filter( ( heading ) => {
			// Include if level matches
			if ( includeLevels.includes( heading.level ) ) {
				return true;
			}

			// Include if any class matches
			if ( includeClasses ) {
				const classes = includeClasses.split( ',' ).map( ( c ) => c.trim() );
				return classes.some( ( cls ) => heading.classes.includes( cls ) );
			}

			return false;
		} );
	} else if ( filterMode === 'exclude' ) {
		filtered = filtered.filter( ( heading ) => {
			// Exclude if level matches
			if ( excludeLevels.includes( heading.level ) ) {
				return false;
			}

			// Exclude if any class matches
			if ( excludeClasses ) {
				const classes = excludeClasses.split( ',' ).map( ( c ) => c.trim() );
				if ( classes.some( ( cls ) => heading.classes.includes( cls ) ) ) {
					return false;
				}
			}

			return true;
		} );
	}

	// Apply depth limit
	if ( depthLimit && depthLimit > 0 ) {
		const minLevel = Math.min( ...filtered.map( ( h ) => h.level ) );
		filtered = filtered.filter( ( heading ) => heading.level - minLevel < depthLimit );
	}

	return filtered;
}

/**
 * Render headings as nested list
 * @param headings
 * @param effectiveValues
 * @param attributes
 */
function renderHeadingsList( headings, effectiveValues, attributes ) {
	if ( headings.length === 0 ) {
		return null;
	}

	const listStyle = attributes.numberingStyle === 'none' ? {} : { listStyleType: 'none' };

	return (
		<ul className={ `toc-list numbering-${ attributes.numberingStyle }` } style={ listStyle }>
			{ headings.map( ( heading, index ) => {
				const levelClass = `toc-item-level-${ heading.level - 1 }`;
				const linkStyle = {
					color: effectiveValues.linkColor || '#0073aa',
					textDecoration: 'none',
				};

				return (
					<li key={ index } className={ `toc-item ${ levelClass }` }>
						<a
							href={ `#${ heading.id || `heading-${ index }` }` }
							className="toc-link"
							style={ linkStyle }
						>
							{ heading.text }
						</a>
					</li>
				);
			} ) }
		</ul>
	);
}

/**
 * Build inline CSS custom properties from effective values
 * @param effectiveValues
 */
function buildInlineStyles( effectiveValues ) {
	const styles = {};

	// Wrapper colors
	if ( effectiveValues.wrapperBackgroundColor ) {
		styles[ '--toc-wrapper-background-color' ] = effectiveValues.wrapperBackgroundColor;
	}
	if ( effectiveValues.wrapperBorderColor ) {
		styles[ '--toc-wrapper-border-color' ] = effectiveValues.wrapperBorderColor;
	}

	// Link colors
	if ( effectiveValues.linkColor ) {
		styles[ '--toc-link-color' ] = effectiveValues.linkColor;
	}
	if ( effectiveValues.linkHoverColor ) {
		styles[ '--toc-link-hover-color' ] = effectiveValues.linkHoverColor;
	}

	// Border
	if ( effectiveValues.wrapperBorderWidth ) {
		styles[ '--toc-border-width' ] = `${ effectiveValues.wrapperBorderWidth }px`;
	}
	if ( effectiveValues.wrapperBorderStyle ) {
		styles[ '--toc-border-style' ] = effectiveValues.wrapperBorderStyle;
	}
	if ( effectiveValues.wrapperBorderRadius ) {
		styles[ '--toc-border-radius' ] = `${ effectiveValues.wrapperBorderRadius }px`;
	}

	// Padding
	if ( effectiveValues.wrapperPadding ) {
		styles[ '--toc-wrapper-padding' ] = `${ effectiveValues.wrapperPadding }px`;
	}

	// Shadow
	if ( effectiveValues.wrapperShadow ) {
		styles[ '--toc-wrapper-shadow' ] = effectiveValues.wrapperShadow;
	}

	return styles;
}
