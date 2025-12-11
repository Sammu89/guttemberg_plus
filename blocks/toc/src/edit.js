/**
 * TOC Block - Edit Component
 *
 * Handles block rendering in the WordPress editor with:
 * - Automatic heading detection from post content
 * - Theme management integration
 * - Filter settings UI
 * - Live preview of TOC structure
 *
 * IMPORTANT: Sections marked with AUTO-GENERATED comments are automatically
 * regenerated from the schema on every build. Do not edit code between these markers.
 *
 * To modify styles:
 * 1. Edit the schema: schemas/toc.json
 * 2. Run: npm run schema:build
 * 3. The code between markers will update automatically
 *
 * @package
 * @since 1.0.0
 */

import { useEffect, useState, useMemo } from '@wordpress/element';
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
	ThemeSelector,
	SchemaPanels,
	CustomizationWarning,
	debug,
	useThemeManager,
	useBlockAlignment,
} from '@shared';
import tocSchema from '../../../schemas/toc.json';
import { tocAttributes } from './toc-attributes';
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

	const { tocId, showTitle, titleText } = attributes;
	const [ headings, setHeadings ] = useState( [] );

	// Use centralized alignment hook
	const blockRef = useBlockAlignment( attributes.tocHorizontalAlign );

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

	// Extract schema defaults from tocAttributes (SINGLE SOURCE OF TRUTH!)
	const schemaDefaults = useMemo( () => {
		const defaults = {};
		Object.keys( tocAttributes ).forEach( ( key ) => {
			if ( tocAttributes[ key ].default !== undefined ) {
				defaults[ key ] = tocAttributes[ key ].default;
			}
		} );
		return defaults;
	}, [] );

	// All defaults come from schema - single source of truth!
	const allDefaults = useMemo( () => {
		const merged = getAllDefaults( schemaDefaults );
		return merged;
	}, [ schemaDefaults ] );

	// Use centralized theme management hook (provides ALL theme logic in one place)
	const {
		themes,
		themesLoaded,
		currentTheme,
		expectedValues,
		isCustomized,
		sessionCache,
		handlers: {
			handleSaveNewTheme,
			handleUpdateTheme,
			handleDeleteTheme,
			handleRenameTheme,
			handleResetCustomizations,
			handleThemeChange,
		},
	} = useThemeManager( {
		blockType: 'toc',
		schema: tocSchema,
		attributes,
		setAttributes,
		allDefaults,
	} );

	// SOURCE OF TRUTH: attributes = merged state (what you see in sidebar)
	const effectiveValues = attributes;

	debug( '[DEBUG] TOC effective values:', effectiveValues );
	debug( '[DEBUG] TOC expected values:', expectedValues );
	debug( '[DEBUG] TOC isCustomized:', isCustomized );

	/**
	 * Apply inline styles from effective values
	 */
	/* ========== AUTO-GENERATED-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// AUTO-GENERATED from schemas/toc.json
// To modify styles, update the schema and run: npm run schema:build

const getInlineStyles = () => {
  // Extract object-type attributes with fallbacks
	const blockBorderRadius = effectiveValues.blockBorderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 4,
		    "bottomLeft": 4
		};

	return {
		container: {
			backgroundColor: effectiveValues.wrapperBackgroundColor || '#ffffff',
			color: effectiveValues.blockBorderColor || '#dddddd',
			borderWidth: `${effectiveValues.blockBorderWidth || 1}px`,
			borderStyle: effectiveValues.blockBorderStyle || 'solid',
			borderRadius: `${blockBorderRadius.topLeft}px ${blockBorderRadius.topRight}px ${blockBorderRadius.bottomRight}px ${blockBorderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.blockShadow || 'none',
			padding: `${effectiveValues.wrapperPadding || 20}px`,
			top: `${effectiveValues.positionTop || 100}px`,
		},
		title: {
			color: effectiveValues.titleColor || '#333333',
			backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
			fontSize: `${effectiveValues.titleFontSize || 20}px`,
			fontWeight: effectiveValues.titleFontWeight || '700',
			textTransform: effectiveValues.titleTextTransform || 'null',
			textAlign: effectiveValues.titleAlignment || 'left',
		},
	};
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

	const styles = getInlineStyles();

	// Filter headings based on settings
	const filteredHeadings = filterHeadings( headings, attributes );

	// Build inline styles - apply width from attributes
	const rootStyles = {
		width: effectiveValues.tocWidth,
		...styles.container,
	};

	// Block props
	const blockProps = useBlockProps( {
		className: 'wp-block-custom-toc sammu-blocks',
		style: rootStyles,
		ref: blockRef,
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
					cssDefaults={ allDefaults }
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
							fontSize: `${ effectiveValues.titleFontSize }px`,
							fontWeight: effectiveValues.titleFontWeight,
							color: effectiveValues.titleColor,
							textAlign: effectiveValues.titleAlignment,
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
					color: effectiveValues.linkColor,
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
