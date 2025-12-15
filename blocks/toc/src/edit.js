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

import { useEffect, useState, useMemo, useCallback } from '@wordpress/element';
import { InspectorControls, useBlockProps, store as blockEditorStore } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	CheckboxControl,
	RangeControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
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
	const [ isScanning, setIsScanning ] = useState( false );
	const [ hasScanned, setHasScanned ] = useState( false );

	// Use centralized alignment hook
	const blockRef = useBlockAlignment( attributes.tocHorizontalAlign );

	// Generate unique ID on mount
	useEffect( () => {
		if ( ! tocId ) {
			setAttributes( { tocId: generateUniqueId() } );
		}
	}, [ tocId, setAttributes ] );

	// Get all blocks from the editor using Gutenberg's data API
	const allBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks(),
		[]
	);

	/**
	 * Strip HTML tags from text
	 * Icons are stored separately in accordion/tabs blocks (iconTypeClosed, iconTypeOpen attributes)
	 * and rendered in separate elements with class "accordion-icon" or similar.
	 * The title text itself doesn't contain icons, just potential HTML formatting.
	 */
	const stripHtml = ( text ) => {
		if ( ! text ) {
			return '';
		}
		return text
			// Remove HTML tags (formatting like <strong>, <em>, etc.)
			.replace( /<[^>]*>/g, '' )
			// Normalize whitespace
			.replace( /\s+/g, ' ' )
			.trim();
	};

	/**
	 * Recursively extract headings from blocks
	 * Handles core/heading blocks, accordions, tabs, and nested blocks
	 * Respects includeAccordions and includeTabs filter settings
	 */
	const extractHeadingsFromBlocks = useCallback( ( blocks, currentClientId, options = {} ) => {
		const { includeAccordions = true, includeTabs = true } = options;
		const detectedHeadings = [];

		const processBlock = ( block ) => {
			// Skip this TOC block
			if ( block.clientId === currentClientId ) {
				return;
			}

			// Skip other TOC blocks
			if ( block.name === 'custom/toc' ) {
				return;
			}

			// Handle core/heading blocks
			if ( block.name === 'core/heading' ) {
				const level = block.attributes.level || 2;
				const content = block.attributes.content || '';
				const text = stripHtml( content );

				if ( text ) {
					detectedHeadings.push( {
						level,
						text,
						id: block.attributes.anchor || '',
						classes: [],
						blockType: 'heading',
					} );
				}
			}

			// Handle accordion blocks with headingLevel set (if enabled)
			// Note: Icons are stored in iconTypeClosed/iconTypeOpen attributes, not in title
			if ( includeAccordions && block.name === 'custom/accordion' ) {
				const headingLevel = block.attributes.headingLevel;
				if ( headingLevel && headingLevel !== 'none' ) {
					const level = parseInt( headingLevel.charAt( 1 ), 10 );
					const title = block.attributes.title || '';
					const text = stripHtml( title );

					if ( text ) {
						detectedHeadings.push( {
							level,
							text,
							id: block.attributes.accordionId || '',
							classes: [ 'accordion-heading' ],
							blockType: 'accordion',
						} );
					}
				}
			}

			// Handle tabs blocks with headingLevel set (if enabled)
			// Note: Icons are stored in iconTypeClosed/iconTypeOpen attributes, not in tab.title
			if ( includeTabs && block.name === 'custom/tabs' ) {
				const headingLevel = block.attributes.headingLevel;
				if ( headingLevel && headingLevel !== 'none' ) {
					const level = parseInt( headingLevel.charAt( 1 ), 10 );
					const tabsData = block.attributes.tabsData || [];

					tabsData.forEach( ( tab ) => {
						const text = stripHtml( tab.title );
						if ( text ) {
							detectedHeadings.push( {
								level,
								text,
								id: tab.tabId || '',
								classes: [ 'tab-heading' ],
								blockType: 'tabs',
							} );
						}
					} );
				}
			}

			// Recursively process inner blocks
			if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
				block.innerBlocks.forEach( processBlock );
			}
		};

		blocks.forEach( processBlock );
		return detectedHeadings;
	}, [] );

	/**
	 * Scan for headings in post content
	 * Called manually when user clicks the "Scan for headings" button
	 * Respects includeAccordions and includeTabs attributes
	 */
	const scanForHeadings = () => {
		setIsScanning( true );

		// Small delay to show scanning state
		setTimeout( () => {
			const detectedHeadings = extractHeadingsFromBlocks( allBlocks, clientId, {
				includeAccordions: attributes.includeAccordions !== false,
				includeTabs: attributes.includeTabs !== false,
			} );
			setHeadings( detectedHeadings );
			setIsScanning( false );
			setHasScanned( true );
		}, 200 );
	};

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
		className: 'gutplus-toc',
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
					<p style={ { marginBottom: '16px', color: '#757575', fontSize: '12px' } }>
						<strong>Block Headings:</strong> Include headings from accordion and tab blocks when they have a heading level set.
					</p>

					<ToggleControl
						label="Include Accordion Headings"
						help="Include headings from accordion blocks"
						checked={ attributes.includeAccordions !== false }
						onChange={ ( value ) => setAttributes( { includeAccordions: value } ) }
					/>

					<ToggleControl
						label="Include Tab Headings"
						help="Include headings from tab blocks"
						checked={ attributes.includeTabs !== false }
						onChange={ ( value ) => setAttributes( { includeTabs: value } ) }
					/>

					<hr style={ { margin: '16px 0', borderTop: '1px solid #ddd' } } />

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

				{ /* Scan for headings button */ }
				<div className="toc-scan-container" style={ { marginBottom: '12px' } }>
					<Button
						variant="secondary"
						onClick={ scanForHeadings }
						isBusy={ isScanning }
						disabled={ isScanning }
						style={ {
							width: '100%',
							justifyContent: 'center',
						} }
					>
						{ isScanning
							? __( 'Scanning…', 'guttemberg-plus' )
							: __( 'Scan for headings', 'guttemberg-plus' ) }
					</Button>
				</div>

				{ /* Results: show headings list or empty message */ }
				{ ! hasScanned ? (
					<p className="toc-empty-message" style={ { color: '#757575', fontStyle: 'italic' } }>
						{ __( 'Click "Scan for headings" to detect headings in your content.', 'guttemberg-plus' ) }
					</p>
				) : filteredHeadings.length === 0 ? (
					<p className="toc-empty-message">
						{ __( 'No headings found. Add H2-H6 headings to your content to populate the table of contents.', 'guttemberg-plus' ) }
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
