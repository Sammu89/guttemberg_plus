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
	SelectControl,
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
import { formatCssValue, getCssVarName } from '@shared/config/css-var-mappings-generated';
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
	 * Respects includeH1-H6, includeAccordions and includeTabs filter settings
	 */
	const extractHeadingsFromBlocks = useCallback( ( blocks, currentClientId, options = {} ) => {
		const {
			includeAccordions = true,
			includeTabs = true,
			includeH1 = false,
			includeH2 = true,
			includeH3 = true,
			includeH4 = true,
			includeH5 = true,
			includeH6 = true,
		} = options;
		const detectedHeadings = [];

		// Helper to check if a heading level should be included
		const shouldIncludeLevel = ( level ) => {
			const levelMap = {
				1: includeH1,
				2: includeH2,
				3: includeH3,
				4: includeH4,
				5: includeH5,
				6: includeH6,
			};
			return levelMap[ level ] !== false;
		};

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

				// Check if this heading level should be included
				if ( text && shouldIncludeLevel( level ) ) {
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

					// Check if this heading level should be included
					if ( text && shouldIncludeLevel( level ) ) {
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
						// Skip disabled tabs
						if ( tab.isDisabled ) {
							return;
						}

						const text = stripHtml( tab.title );
						// Check if this heading level should be included
						if ( text && shouldIncludeLevel( level ) ) {
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
	 * Respects includeH1-H6, includeAccordions and includeTabs attributes
	 */
	const scanForHeadings = () => {
		setIsScanning( true );

		// Small delay to show scanning state
		setTimeout( () => {
			const detectedHeadings = extractHeadingsFromBlocks( allBlocks, clientId, {
				includeAccordions: attributes.includeAccordions !== false,
				includeTabs: attributes.includeTabs !== false,
				includeH1: attributes.includeH1 !== false,
				includeH2: attributes.includeH2 !== false,
				includeH3: attributes.includeH3 !== false,
				includeH4: attributes.includeH4 !== false,
				includeH5: attributes.includeH5 !== false,
				includeH6: attributes.includeH6 !== false,
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
	 * Generate CSS variables from effective values for editor preview
	 */
	const getEditorCSSVariables = () => {
		const cssVars = {};

		Object.entries(effectiveValues).forEach(([attrName, value]) => {
			if (value === null || value === undefined) {
				return;
			}

			const cssVar = getCssVarName(attrName, 'toc');
			if (!cssVar) {
				return;
			}

			// Format the value (formatCssValue now handles compound values intelligently)
			const formattedValue = formatCssValue(attrName, value, 'toc');
			if (formattedValue !== null) {
				cssVars[cssVar] = formattedValue;
			}
		});

		return cssVars;
	};

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
			borderColor: effectiveValues.blockBorderColor || '#dddddd',
			borderWidth: `${effectiveValues.blockBorderWidth ?? 1}px`,
			borderStyle: effectiveValues.blockBorderStyle || 'solid',
			borderRadius: `${blockBorderRadius.topLeft}px ${blockBorderRadius.topRight}px ${blockBorderRadius.bottomRight}px ${blockBorderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.blockShadow || 'none',
			top: `${effectiveValues.positionTop ?? 6.25}rem`,
		},
		title: {
			color: effectiveValues.titleColor || '#333333',
			backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
			fontSize: `${effectiveValues.titleFontSize ?? 1.25}rem`,
			fontWeight: effectiveValues.titleFontWeight || '700',
			fontStyle: effectiveValues.titleFontStyle || 'normal',
			textTransform: effectiveValues.titleTextTransform || 'none',
			textDecoration: effectiveValues.titleTextDecoration || 'none',
			textAlign: effectiveValues.titleAlignment || 'left',
		},
		content: {
			padding: `${effectiveValues.wrapperPadding ?? 1.25}rem`,
		},
		icon: {
			fontSize: `${effectiveValues.iconSize ?? 1.25}rem`,
			transform: `${effectiveValues.iconRotation ?? 180}deg`,
			color: effectiveValues.iconColor || '#666666',
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

	// Build inline styles - apply width from attributes
	// IMPORTANT: Force static positioning in editor to prevent overflow issues
	// Position type (sticky/fixed) should only apply on frontend
	const editorCSSVars = getEditorCSSVariables();
	const rootStyles = {
		width: effectiveValues.tocWidth,
		...editorCSSVars, // All CSS variables including decomposed
		// Force normal positioning in editor - override any CSS classes
		position: 'static',
		top: 'auto',
		left: 'auto',
		right: 'auto',
		zIndex: 'auto',
	};

	// Block props
	const blockProps = useBlockProps( {
		className: 'gutplus-toc',
		style: rootStyles,
		ref: blockRef,
	} );
	const titleTextStyle = {
		color: styles.title.color,
		fontSize: styles.title.fontSize,
		fontWeight: styles.title.fontWeight,
		fontStyle: styles.title.fontStyle,
		textTransform: styles.title.textTransform,
		textDecoration: styles.title.textDecoration,
	};
	const buttonId = `toc-toggle-${ safeTocId }`;
	const contentId = `toc-content-${ safeTocId }`;

	/**
	 * Render icon based on settings (accordion-like pattern)
	 */
	const renderIcon = () => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed || '▾';
		const isImage = iconContent.startsWith( 'http' );
		const iconSize = effectiveValues.iconSize ?? 1.25;
		const iconColor = effectiveValues.iconColor || '#666666';

		const iconStyle = {
			color: iconColor,
			fontSize: `${ iconSize }rem`,
		};

		if ( isImage ) {
			return (
				<img
					src={ iconContent }
					alt=""
					aria-hidden="true"
					className="toc-icon toc-icon-image"
					style={ iconStyle }
				/>
			);
		}

		return (
			<span className="toc-icon" aria-hidden="true" style={ iconStyle }>
				{ iconContent }
			</span>
		);
	};

	/**
	 * Render header with accordion-like structure
	 */
	const renderHeader = () => {
		if ( ! showTitle && ! attributes.isCollapsible ) {
			return null;
		}

		const iconElement = renderIcon();
		const hasIcon = !! iconElement;
		const iconPosition = effectiveValues.iconPosition || 'right';
		const titleAlignment = effectiveValues.titleAlignment || 'left';
		const titleAlignClass = titleAlignment ? `title-align-${ titleAlignment }` : 'title-align-left';

		// Build header content based on icon position
		let buttonChildren;

		if ( iconPosition === 'extreme-left' ) {
			buttonChildren = (
				<>
					{ hasIcon && (
						<span className="toc-icon-slot">
							{ iconElement }
						</span>
					) }
					<div className="toc-title-text-wrapper">
						<span className="toc-title-text" style={ titleTextStyle }>{ titleText }</span>
					</div>
				</>
			);
		} else if ( iconPosition === 'extreme-right' ) {
			buttonChildren = (
				<>
					<div className="toc-title-text-wrapper">
						<span className="toc-title-text" style={ titleTextStyle }>{ titleText }</span>
					</div>
					{ hasIcon && (
						<span className="toc-icon-slot">
							{ iconElement }
						</span>
					) }
				</>
			);
		} else if ( iconPosition === 'left' ) {
			buttonChildren = (
				<div className="toc-title-inline">
					{ hasIcon && iconElement }
					<span className="toc-title-text" style={ titleTextStyle }>{ titleText }</span>
				</div>
			);
		} else {
			// Right (default)
			buttonChildren = (
				<div className="toc-title-inline">
					<span className="toc-title-text" style={ titleTextStyle }>{ titleText }</span>
					{ hasIcon && iconElement }
				</div>
			);
		}

		// If collapsible, render as button
		if ( attributes.isCollapsible ) {
			return (
				<button
					id={ buttonId }
					className={ `toc-title toc-toggle-button ${ iconPosition ? `icon-${ iconPosition }` : '' } ${ titleAlignClass }` }
					aria-expanded={ ! attributes.initiallyCollapsed }
					aria-controls={ contentId }
					type="button"
					style={ {
						...styles.title,
						border: 'none',
						width: '100%',
						cursor: 'pointer',
					} }
				>
					{ buttonChildren }
				</button>
			);
		}

		// If not collapsible but showTitle is true, render as static title
		if ( showTitle ) {
			return (
				<div
					className={ `toc-title ${ titleAlignClass }` }
					style={ styles.title }
				>
					<span className="toc-title-text" style={ titleTextStyle }>{ titleText }</span>
				</div>
			);
		}

		return null;
	};

	const numberingStyles = {};
	const numberingDataAttributes = {};
	[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].forEach( ( level ) => {
		const style = attributes[ `${ level }NumberingStyle` ] || 'decimal';
		numberingStyles[ `--toc-${ level }-numbering` ] = style;
		numberingDataAttributes[ `data-${ level }-numbering` ] = style;
	} );
	const baseLevel = (() => {
		const levels = ( tocItems || [] )
			.filter( ( item ) => item && item.level )
			.map( ( item ) => item.level );
		let minLevel = levels.length ? Math.min( ...levels ) : 1;
		if ( ( attributes.h1NumberingStyle || 'decimal' ) === 'none' && minLevel <= 1 ) {
			minLevel = 2;
		}
		return minLevel;
	} )();
	numberingDataAttributes[ 'data-base-level' ] = baseLevel;

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
				{/* Header Section (accordion-like) */}
				<div className="toc-header-wrapper">
					{ renderHeader() }
				</div>

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
					style={ styles.content }
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
							<ul
								className="toc-list toc-items-editor toc-hierarchical-numbering"
								style={ {
									...numberingStyles,
									'--toc-item-spacing': `${ effectiveValues.itemSpacing ?? allDefaults.itemSpacing }rem`,
								} }
								{ ...numberingDataAttributes }
							>
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
										<li
											key={ anchor || index }
											className={ `toc-item toc-item-row${ headingLevelClass }${ isHidden ? ' toc-item-hidden' : '' }` }
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
										</li>
									);
								} ) }
							</ul>
						</div>
					) }
				</nav>
			</div>
		</>
	);
}

/**
 * Filter headings based on filter settings
 * Note: Heading level filtering is handled by includeH1-H6 during detection,
 * so this function only needs to check class-based filters.
 * @param headings
 * @param attributes
 */
function filterHeadings( headings, attributes ) {
	const { filterMode, includeClasses, excludeClasses, depthLimit } =
		attributes;

	let filtered = headings;

	// Apply class-based filter mode
	if ( filterMode === 'Include by class' ) {
		filtered = filtered.filter( ( heading ) => {
			// Include if any class matches
			if ( includeClasses ) {
				const classes = includeClasses.split( ',' ).map( ( c ) => c.trim() );
				return classes.some( ( cls ) => heading.classes.includes( cls ) );
			}

			return false;
		} );
	} else if ( filterMode === 'Excluse by class' ) {
		filtered = filtered.filter( ( heading ) => {
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

	const numberingStyles = {};
	const numberingDataAttributes = {};
	[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].forEach( ( level ) => {
		const style = attributes[ `${ level }NumberingStyle` ] || 'decimal';
		numberingStyles[ `--toc-${ level }-numbering` ] = style;
		numberingDataAttributes[ `data-${ level }-numbering` ] = style;
	} );

	return (
		<ul
			className="toc-list toc-hierarchical-numbering"
			style={ numberingStyles }
			{ ...numberingDataAttributes }
			data-base-level={ (() => {
				const levels = headings
					.filter( ( h ) => h && h.level )
					.map( ( h ) => h.level );
				let minLevel = levels.length ? Math.min( ...levels ) : 1;
				if ( ( attributes.h1NumberingStyle || 'decimal' ) === 'none' && minLevel <= 1 ) {
					minLevel = 2;
				}
				return minLevel;
			} )() }
		>
			{ headings.map( ( heading, index ) => {
				const levelClass = heading.level ? `toc-h${ heading.level }` : '';

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

	// Build map of incoming headings (respects current filter settings)
	headings.forEach( ( heading, index ) => {
		const anchor = buildHeadingAnchor( heading, tocId, index );
		if ( ! anchor || deletedSet.has( anchor ) ) {
			return;
		}
		incoming.set( anchor, headingToItem( heading, tocId, index ) );
	} );

	const merged = [];

	// Only preserve existing items that are still in the incoming headings
	// This ensures that when users change filter settings (e.g., turn off H3),
	// those headings are removed from tocItems on the next scan
	existingItems.forEach( ( item ) => {
		const anchor = getItemAnchor( item );
		if ( ! anchor || deletedSet.has( anchor ) ) {
			return;
		}

		// Only keep existing items if they're in the new incoming set
		if ( incoming.has( anchor ) ) {
			// Preserve custom edits (like manual text changes) while updating detected values
			merged.push( { ...item, ...incoming.get( anchor ) } );
			incoming.delete( anchor );
		}
		// Items not in incoming are dropped (they were filtered out or no longer exist)
	} );

	// Add any new headings that weren't in existingItems
	incoming.forEach( ( item ) => {
		merged.push( item );
	} );

	return merged;
}
