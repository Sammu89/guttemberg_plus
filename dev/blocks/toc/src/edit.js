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
import {
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	CheckboxControl,
	RangeControl,
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	generateUniqueId,
	getAllDefaults,
	ThemeSelector,
	SchemaPanels,
	CustomizationWarning,
	CompactColorControl,
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

	const { tocId, showTitle, titleText, tocItems = [], deletedHeadingIds = [], enableHierarchicalIndent, levelIndent } = attributes;
	const [ headings, setHeadings ] = useState( [] );
	const [ isScanning, setIsScanning ] = useState( false );
	const [ hasScanned, setHasScanned ] = useState( false );
	const [ selectedHeadingLevel, setSelectedHeadingLevel ] = useState( 'h2' );
	const safeTocId = tocId || clientId || 'toc';

	// Use centralized alignment hook
	const blockRef = useBlockAlignment( attributes.tocHorizontalAlign );

	// Get all blocks from the editor using Gutenberg's data API
	const allBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks(),
		[]
	);

	// Generate unique ID on mount
	useEffect( () => {
		if ( ! tocId ) {
			setAttributes( { tocId: generateUniqueId() } );
		}
	}, [ tocId, setAttributes ] );

	// Mark as scanned if tocItems exist
	useEffect( () => {
		if ( tocItems.length > 0 && ! hasScanned ) {
			setHasScanned( true );
		}
	}, [ tocItems, hasScanned ] );

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
						sourceClientId: block.clientId,
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
							sourceClientId: block.clientId,
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
								sourceClientId: block.clientId,
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
			const filtered = filterHeadings( detectedHeadings, attributes );
			setHeadings( filtered );

			// Merge with existing curated items
			const mergedItems = mergeHeadingsWithExisting(
				filtered,
				tocItems,
				deletedHeadingIds,
				safeTocId
			);
			setAttributes( { tocItems: mergedItems } );
			setIsScanning( false );
			setHasScanned( true );
		}, 200 );
	};

	const handleDeleteItem = useCallback(
		( anchor ) => {
			if ( ! anchor ) {
				return;
			}

			const updatedItems = tocItems.filter(
				( item ) => getItemAnchor( item ) !== anchor
			);
			const updatedDeleted = Array.from(
				new Set( [ ...deletedHeadingIds, anchor ] )
			);

			setAttributes( {
				tocItems: updatedItems,
				deletedHeadingIds: updatedDeleted,
			} );
		},
		[ tocItems, deletedHeadingIds, setAttributes ]
	);

	const handleResetDeleted = useCallback( () => {
		setAttributes( { deletedHeadingIds: [] } );
	}, [ setAttributes ] );

	/**
	 * Move TOC item up (to lower index)
	 * @param {number} index - Current index of the item
	 */
	const handleMoveItemUp = useCallback(
		( index ) => {
			if ( index <= 0 || tocItems.length === 0 ) {
				return;
			}

			const newItems = [ ...tocItems ];
			const temp = newItems[ index - 1 ];
			newItems[ index - 1 ] = newItems[ index ];
			newItems[ index ] = temp;

			setAttributes( { tocItems: newItems } );
		},
		[ tocItems, setAttributes ]
	);

	/**
	 * Move TOC item down (to higher index)
	 * @param {number} index - Current index of the item
	 */
	const handleMoveItemDown = useCallback(
		( index ) => {
			if ( index >= tocItems.length - 1 || tocItems.length === 0 ) {
				return;
			}

			const newItems = [ ...tocItems ];
			const temp = newItems[ index + 1 ];
			newItems[ index + 1 ] = newItems[ index ];
			newItems[ index ] = temp;

			setAttributes( { tocItems: newItems } );
		},
		[ tocItems, setAttributes ]
	);

	/**
	 * Toggle item visibility (hidden/visible)
	 * @param {string} anchor - Anchor of the item to toggle
	 */
	const handleToggleHidden = useCallback(
		( anchor ) => {
			if ( ! anchor ) {
				return;
			}

			const updatedItems = tocItems.map( ( item ) => {
				if ( getItemAnchor( item ) === anchor ) {
					return { ...item, hidden: ! item.hidden };
				}
				return item;
			} );

			setAttributes( { tocItems: updatedItems } );
		},
		[ tocItems, setAttributes ]
	);

	/**
	 * Update item text
	 * @param {string} anchor - Anchor of the item to update
	 * @param {string} newText - New text value
	 */
	const handleUpdateItemText = useCallback(
		( anchor, newText ) => {
			if ( ! anchor ) {
				return;
			}

			const updatedItems = tocItems.map( ( item ) => {
				if ( getItemAnchor( item ) === anchor ) {
					return { ...item, text: newText };
				}
				return item;
			} );

			setAttributes( { tocItems: updatedItems } );
		},
		[ tocItems, setAttributes ]
	);

	/**
	 * Calculate indent level for editor preview
	 * @param {number} index - Index of the item in tocItems array
	 */
	const calculateEditorIndent = useCallback(
		( index ) => {
			if ( ! enableHierarchicalIndent ) {
				// Traditional: based on absolute level
				const item = tocItems[ index ];
				return item.level ? item.level - 1 : 0;
			}

			// Hierarchical: based on position in list
			const hierarchyStack = [];
			let previousLevel = null;

			for ( let i = 0; i <= index; i++ ) {
				const currentItem = tocItems[ i ];
				const currentLevel = currentItem.level;

				if ( previousLevel === null ) {
					hierarchyStack.push( currentLevel );
				} else if ( currentLevel > previousLevel ) {
					hierarchyStack.push( currentLevel );
				} else if ( currentLevel === previousLevel ) {
					// Same level - no change
				} else {
					while ( hierarchyStack.length > 0 && hierarchyStack[ hierarchyStack.length - 1 ] >= currentLevel ) {
						hierarchyStack.pop();
					}
					hierarchyStack.push( currentLevel );
				}

				previousLevel = currentLevel;

				if ( i === index ) {
					return Math.max( 0, hierarchyStack.length - 1 );
				}
			}

			return 0;
		},
		[ tocItems, enableHierarchicalIndent ]
	);

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
	const titlePadding = effectiveValues.titlePadding || {
		    "top": 0,
		    "right": 0,
		    "bottom": 12,
		    "left": 0
		};
	const blockBorderRadius = effectiveValues.blockBorderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 4,
		    "bottomLeft": 4
		};

	return {
		container: {
			backgroundColor: effectiveValues.wrapperBackgroundColor || '#ffffff',
			borderColor: effectiveValues.blockBorderColor || '#dddddd',
			borderWidth: `${effectiveValues.blockBorderWidth ?? 1}px`,
			borderStyle: effectiveValues.blockBorderStyle || 'solid',
			borderRadius: `${blockBorderRadius.topLeft}px ${blockBorderRadius.topRight}px ${blockBorderRadius.bottomRight}px ${blockBorderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.blockShadow || 'none',
			padding: `${effectiveValues.wrapperPadding ?? 1.25}rem`,
			top: `${effectiveValues.positionTop ?? 6.25}rem`,
		},
		title: {
			color: effectiveValues.titleColor || '#333333',
			backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
			fontSize: `${effectiveValues.titleFontSize ?? 1.25}rem`,
			fontWeight: effectiveValues.titleFontWeight || '700',
			textTransform: effectiveValues.titleTextTransform || 'none',
			textAlign: effectiveValues.titleAlignment || 'left',
			padding: `${titlePadding.top}px ${titlePadding.right}px ${titlePadding.bottom}px ${titlePadding.left}px`,
		},
	};
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

	const styles = getInlineStyles();

	// Filter headings based on settings
	const filteredHeadings = filterHeadings( headings, attributes );
	const curatedHeadings = ( tocItems || [] ).map( ( item, index ) => ( {
		id: getItemAnchor( item ) || `heading-${ index }`,
		anchor: getItemAnchor( item ),
		text: item.text || '',
		level: item.level || 2,
	} ) );
const displayHeadings =
	curatedHeadings.length > 0 ? curatedHeadings : filteredHeadings;

	// Exclude headingStyles group from auto-generated panels (handled manually above)
	const schemaWithoutHeadingStyles = useMemo( () => {
		const filteredGroups = { ...tocSchema.groups };
		delete filteredGroups.headingStyles;

		const filteredAttributes = Object.fromEntries(
			Object.entries( tocSchema.attributes || {} ).filter(
				( [ , config ] ) => config.group !== 'headingStyles'
			)
		);

		return {
			...tocSchema,
			groups: filteredGroups,
			attributes: filteredAttributes,
		};
	}, [] );

	// Build inline styles - apply width from attributes
	// Exclude position-related properties (top) in editor to prevent overlap issues
	const { top: _top, ...containerStyles } = styles.container;
	const rootStyles = {
		width: effectiveValues.tocWidth,
		...containerStyles,
	};

	// Block props
	const blockProps = useBlockProps( {
		className: 'gutplus-toc',
		style: rootStyles,
		ref: blockRef,
	} );
	const buttonId = `toc-toggle-${ safeTocId }`;
	const contentId = `toc-content-${ safeTocId }`;
	const collapseIconSize = effectiveValues.collapseIconSize ?? 1.25;
	const collapseIconColor = effectiveValues.collapseIconColor || '#666666';

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
					<p className="toc-filter-description">
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

					<hr className="toc-settings-divider" />

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
							{ label: 'Letters (A, B, C)', value: 'alpha' },
						] }
						onChange={ ( value ) => setAttributes( { numberingStyle: value } ) }
						__next40pxDefaultSize
					/>
				</PanelBody>

				{ /* Heading Styles Panel */ }
				<PanelBody title="Heading Styles" initialOpen={ false }>
					<p style={ { marginBottom: '16px', fontSize: '13px', color: '#757575' } }>
						Customize the appearance of each heading level (H1-H6) in your table of contents.
					</p>

					<SelectControl
						label="Edit heading level"
						value={ selectedHeadingLevel }
						options={ [
							{ label: 'H1 - Page Title', value: 'h1' },
							{ label: 'H2 - Main Sections', value: 'h2' },
							{ label: 'H3 - Subsections', value: 'h3' },
							{ label: 'H4 - Minor Headings', value: 'h4' },
							{ label: 'H5 - Sub-minor Headings', value: 'h5' },
							{ label: 'H6 - Smallest Headings', value: 'h6' },
						] }
						onChange={ setSelectedHeadingLevel }
						help="Select a heading level to customize its appearance"
						__nextHasNoMarginBottom
					/>

					<div
						style={ {
							marginTop: '20px',
							padding: '12px',
							background: '#f5f5f5',
							borderRadius: '4px',
							marginBottom: '16px',
						} }
					>
						<div style={ { fontSize: '11px', color: '#666', marginBottom: '8px' } }>
							Preview:
						</div>
						<span
							style={ {
								color: attributes[ `${ selectedHeadingLevel }Color` ],
								fontSize: `${ attributes[ `${ selectedHeadingLevel }FontSize` ] }rem`,
								fontWeight: attributes[ `${ selectedHeadingLevel }FontWeight` ],
								fontStyle: attributes[ `${ selectedHeadingLevel }FontStyle` ],
								textTransform: attributes[ `${ selectedHeadingLevel }TextTransform` ],
								textDecoration: attributes[ `${ selectedHeadingLevel }TextDecoration` ],
							} }
						>
							Sample { selectedHeadingLevel.toUpperCase() } Heading
						</span>
					</div>

					{ /* Color Control */ }
					<CompactColorControl
						label="Text Color"
						value={ attributes[ `${ selectedHeadingLevel }Color` ] }
						onChange={ ( value ) => setAttributes( { [ `${ selectedHeadingLevel }Color` ]: value } ) }
					/>

					{ /* Font Size */ }
					<RangeControl
						label="Font Size"
						value={ attributes[ `${ selectedHeadingLevel }FontSize` ] }
						onChange={ ( value ) => setAttributes( { [ `${ selectedHeadingLevel }FontSize` ]: value } ) }
						min={ 0.5 }
						max={ 3 }
						step={ 0.0625 }
						help="Font size in rem units"
						__nextHasNoMarginBottom
					/>

					{ /* Font Weight */ }
					<SelectControl
						label="Font Weight"
						value={ attributes[ `${ selectedHeadingLevel }FontWeight` ] }
						options={ [
							{ label: '100 - Thin', value: '100' },
							{ label: '200 - Extra Light', value: '200' },
							{ label: '300 - Light', value: '300' },
							{ label: '400 - Normal', value: '400' },
							{ label: '500 - Medium', value: '500' },
							{ label: '600 - Semi Bold', value: '600' },
							{ label: '700 - Bold', value: '700' },
							{ label: '800 - Extra Bold', value: '800' },
							{ label: '900 - Black', value: '900' },
						] }
						onChange={ ( value ) => setAttributes( { [ `${ selectedHeadingLevel }FontWeight` ]: value } ) }
						__nextHasNoMarginBottom
					/>

					{ /* Font Style */ }
					<SelectControl
						label="Font Style"
						value={ attributes[ `${ selectedHeadingLevel }FontStyle` ] }
						options={ [
							{ label: 'Normal', value: 'normal' },
							{ label: 'Italic', value: 'italic' },
							{ label: 'Oblique', value: 'oblique' },
						] }
						onChange={ ( value ) => setAttributes( { [ `${ selectedHeadingLevel }FontStyle` ]: value } ) }
						__nextHasNoMarginBottom
					/>

					{ /* Text Transform */ }
					<SelectControl
						label="Text Transform"
						value={ attributes[ `${ selectedHeadingLevel }TextTransform` ] }
						options={ [
							{ label: 'None', value: 'none' },
							{ label: 'Uppercase', value: 'uppercase' },
							{ label: 'Lowercase', value: 'lowercase' },
							{ label: 'Capitalize', value: 'capitalize' },
						] }
						onChange={ ( value ) => setAttributes( { [ `${ selectedHeadingLevel }TextTransform` ]: value } ) }
						__nextHasNoMarginBottom
					/>

					{ /* Text Decoration */ }
					<SelectControl
						label="Text Decoration"
						value={ attributes[ `${ selectedHeadingLevel }TextDecoration` ] }
						options={ [
							{ label: 'None', value: 'none' },
							{ label: 'Underline', value: 'underline' },
							{ label: 'Overline', value: 'overline' },
							{ label: 'Line Through', value: 'line-through' },
						] }
						onChange={ ( value ) => setAttributes( { [ `${ selectedHeadingLevel }TextDecoration` ]: value } ) }
						__nextHasNoMarginBottom
					/>

					{ /* Utility Actions */ }
					<div style={ { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #ddd' } }>
						<DropdownMenu
							icon="admin-tools"
							label="Actions"
							className="toc-heading-actions"
						>
							{ ( { onClose } ) => (
								<>
									<MenuGroup label="Reset">
										<MenuItem
											onClick={ () => {
												// Reset to theme defaults
												const resetAttrs = {
													[ `${ selectedHeadingLevel }Color` ]: undefined,
													[ `${ selectedHeadingLevel }FontSize` ]: undefined,
													[ `${ selectedHeadingLevel }FontWeight` ]: undefined,
													[ `${ selectedHeadingLevel }FontStyle` ]: undefined,
													[ `${ selectedHeadingLevel }TextTransform` ]: undefined,
													[ `${ selectedHeadingLevel }TextDecoration` ]: undefined,
												};
												setAttributes( resetAttrs );
												onClose();
											} }
										>
											Reset to theme defaults
										</MenuItem>
									</MenuGroup>
								</>
							) }
						</DropdownMenu>
					</div>
				</PanelBody>

				{/* Auto-generated panels from schema */}
				<SchemaPanels
					schema={ schemaWithoutHeadingStyles }
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
				{ showTitle && ! attributes.isCollapsible && (
					<div
						className="toc-title"
						style={ styles.title }
					>
						{ titleText }
					</div>
				) }

				{ showTitle && attributes.isCollapsible && (
					<button
						id={ buttonId }
						className="toc-title toc-toggle-button"
						aria-expanded={ ! attributes.initiallyCollapsed }
						aria-controls={ contentId }
						type="button"
						style={ {
							...styles.title,
							border: 'none',
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							cursor: 'pointer',
						} }
					>
						<span>{ titleText }</span>
						<span
							className="toc-collapse-icon"
							aria-hidden="true"
							style={ {
								fontSize: `${ collapseIconSize }rem`,
								color: collapseIconColor,
							} }
						>
							▾
						</span>
					</button>
				) }

				{ ! showTitle && attributes.isCollapsible && (
					<button
						id={ buttonId }
						className="toc-toggle-button toc-icon-only"
						aria-expanded={ ! attributes.initiallyCollapsed }
						aria-controls={ contentId }
						aria-label={ __( 'Toggle Table of Contents', 'guttemberg-plus' ) }
						type="button"
						style={ {
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							fontSize: `${ collapseIconSize }rem`,
							color: collapseIconColor,
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
						} }
					>
						▾
					</button>
				) }

				{ /* Scan for headings button */ }
				<div className="toc-scan-container">
					<Button
						variant="secondary"
						onClick={ scanForHeadings }
						isBusy={ isScanning }
						disabled={ isScanning }
					>
						{ isScanning
							? __( 'Scanning…', 'guttemberg-plus' )
							: __( 'Scan for headings', 'guttemberg-plus' ) }
					</Button>

					{ deletedHeadingIds.length > 0 && (
						<Button
							variant="tertiary"
							onClick={ handleResetDeleted }
							className="toc-reset-deleted"
						>
							{ __( 'Reset deleted headings', 'guttemberg-plus' ) }
						</Button>
					) }
				</div>

				<nav
					id={ contentId }
					className="toc-content"
					aria-label={ titleText || __( 'Table of Contents', 'guttemberg-plus' ) }
				>
					{ /* Results: show headings list or empty message */ }
					{ ! hasScanned && displayHeadings.length === 0 ? (
						<p className="toc-empty-message toc-placeholder">
							{ __( 'Click "Scan for headings" to detect headings in your content.', 'guttemberg-plus' ) }
						</p>
					) : displayHeadings.length === 0 ? (
						<p className="toc-empty-message toc-placeholder">
							{ __( 'No headings found. Add H2-H6 headings to your content to populate the table of contents.', 'guttemberg-plus' ) }
						</p>
					) : (
						<div className="toc-curated-wrapper">
							{ /* Custom render with action buttons and editable text */ }
							<div className="toc-items-editor">
								{ tocItems.map( ( item, index ) => {
									const anchor = getItemAnchor( item );
									const isHidden = item.hidden === true;
									const headingLevelClass = item.level ? ` toc-h${ item.level }` : '';
									const indentLevel = calculateEditorIndent( index );
									const editorIndentStyle = indentLevel > 0
										? { paddingLeft: `calc(0.75rem + ${ indentLevel } * ${ levelIndent || '1.25rem' })` }
										: { paddingLeft: '0.75rem' };

									// Get heading-level-specific styles for live preview
									const headingKey = item.level ? `h${ item.level }` : 'h2';
									const headingLinkStyle = {
										color: attributes[ `${ headingKey }Color` ],
										fontSize: attributes[ `${ headingKey }FontSize` ] ? `${ attributes[ `${ headingKey }FontSize` ] }rem` : undefined,
										fontWeight: attributes[ `${ headingKey }FontWeight` ],
										fontStyle: attributes[ `${ headingKey }FontStyle` ],
										textTransform: attributes[ `${ headingKey }TextTransform` ],
										textDecoration: attributes[ `${ headingKey }TextDecoration` ],
									};

									return (
										<div
											key={ anchor || index }
											className={ `toc-item-row${ headingLevelClass }${ isHidden ? ' toc-item-hidden' : '' }` }
											style={ editorIndentStyle }
										>
											<RichText
												tagName="span"
												className="toc-link"
												style={ headingLinkStyle }
												value={ item.text }
												onChange={ ( newText ) => handleUpdateItemText( anchor, newText ) }
												placeholder={ __( 'TOC item…', 'guttemberg-plus' ) }
												allowedFormats={ [] }
											/>
											<div className="toc-item-actions">
												<button
													onClick={ () => handleMoveItemUp( index ) }
													className="toc-action-button toc-move-button"
													title={ __( 'Move up', 'guttemberg-plus' ) }
													type="button"
													disabled={ index === 0 }
												>
													↑
												</button>
												<button
													onClick={ () => handleMoveItemDown( index ) }
													className="toc-action-button toc-move-button"
													title={ __( 'Move down', 'guttemberg-plus' ) }
													type="button"
													disabled={ index === tocItems.length - 1 }
												>
													↓
												</button>
												<button
													onClick={ () => handleToggleHidden( anchor ) }
													className={ `toc-action-button toc-hide-button${ isHidden ? ' is-hidden' : '' }` }
													title={ isHidden ? __( 'Enable', 'guttemberg-plus' ) : __( 'Disable', 'guttemberg-plus' ) }
													type="button"
												>
													{ isHidden ? '◉' : '◯' }
												</button>
												<button
													onClick={ () => handleDeleteItem( anchor ) }
													className="toc-action-button toc-delete-button"
													title={ __( 'Delete item', 'guttemberg-plus' ) }
													type="button"
												>
													×
												</button>
											</div>
										</div>
									);
								} ) }
							</div>
						</div>
					) }
				</nav>
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
				const normalizedLevel = heading.level - 1;
				const levelClass = `toc-level-${ normalizedLevel }`;

				return (
					<li key={ index } className={ `toc-item ${ levelClass }` }>
						<a
							href={ `#${ heading.id || heading.anchor || `heading-${ index }` }` }
							className="toc-link"
							style={ { color: effectiveValues.linkColor } }
						>
							{ heading.text }
						</a>
					</li>
				);
			} ) }
		</ul>
	);
}

function slugify( text = '' ) {
	return text
		.toString()
		.trim()
		.toLowerCase()
		.replace( /[^a-z0-9\s-]/g, '' )
		.replace( /\s+/g, '-' )
		.replace( /-+/g, '-' )
		.replace( /^-+|-+$/g, '' );
}

const getItemAnchor = ( item = {} ) => item.anchor || item.id || '';

function buildHeadingAnchor( heading = {}, tocId = '', index = 0 ) {
	if ( heading.id ) {
		return heading.id;
	}

	if ( heading.anchor ) {
		return heading.anchor;
	}

	const textSlug = slugify( heading.text || `heading-${ index + 1 }` );
	const safeTocId = tocId || 'toc';
	const suffix = heading.sourceClientId ? `-${ heading.sourceClientId }` : `-${ index + 1 }`;
	return `${ safeTocId }-${ textSlug || `heading-${ index + 1 }` }${ suffix }`;
}

function headingToItem( heading, tocId, index = 0 ) {
	const anchor = buildHeadingAnchor( heading, tocId, index );
	return {
		anchor,
		id: anchor,
		text: heading.text || '',
		level: heading.level || 2,
		sourceClientId: heading.sourceClientId || null,
	};
}

function mergeHeadingsWithExisting( headings, existingItems, deletedHeadingIds, tocId ) {
	const deletedSet = new Set( deletedHeadingIds );
	const incoming = new Map();

	headings.forEach( ( heading, index ) => {
		const anchor = buildHeadingAnchor( heading, tocId, index );
		if ( ! anchor || deletedSet.has( anchor ) ) {
			return;
		}
		incoming.set( anchor, headingToItem( heading, tocId, index ) );
	} );

	const merged = [];
	existingItems.forEach( ( item ) => {
		const anchor = getItemAnchor( item );
		if ( ! anchor || deletedSet.has( anchor ) ) {
			return;
		}

		if ( incoming.has( anchor ) ) {
			merged.push( { ...item, ...incoming.get( anchor ) } );
			incoming.delete( anchor );
		} else {
			merged.push( { ...item, anchor, id: anchor } );
		}
	} );

	incoming.forEach( ( item ) => {
		merged.push( item );
	} );

	return merged;
}
