/**
 * Tabs Block - Edit Component
 *
 * Editor interface for tabs block with full theme integration.
 * Uses shared UI components and cascade resolution.
 * Supports horizontal/vertical orientation and responsive fallback.
 *
 * IMPORTANT: Sections marked with AUTO-GENERATED comments are automatically
 * regenerated from the schema on every build. Do not edit code between these markers.
 *
 * To modify styles:
 * 1. Edit the schema: schemas/tabs.json
 * 2. Run: npm run schema:build
 * 3. The code between markers will update automatically
 *
 * @package
 * @since 1.0.0
 */

import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useMemo } from '@wordpress/element';

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
import { getCssVarName, formatCssValue, resolveCssProperty } from '@shared/config/css-var-mappings-generated';
import tabsSchema from '../../../schemas/tabs.json';
import { tabsAttributes } from './tabs-attributes';
import './editor.scss';

/**
 * Map orientation to ARIA-compliant value
 * ARIA only supports 'horizontal' or 'vertical'
 *
 * @param {string} orientation - The orientation value from attributes
 * @return {string} ARIA-compliant orientation value
 */
function getAriaOrientation( orientation ) {
	if ( orientation === 'vertical-left' || orientation === 'vertical-right' ) {
		return 'vertical';
	}
	return orientation || 'horizontal';
}

const toCamelCase = ( prop ) =>
	prop.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );

/**
 * Tabs Edit Component
 *
 * @param {Object}   props               Block props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Attribute setter
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Edit component
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	debug( '[DEBUG] Tabs Edit mounted with attributes:', attributes );

	// Local state for active tab in editor
	const [ activeTab, setActiveTab ] = useState( attributes.currentTab || 0 );

	// Get tab-panel children
	const { tabPanels } = useSelect(
		( select ) => {
			const { getBlocks } = select( 'core/block-editor' );
			return {
				tabPanels: getBlocks( clientId ),
			};
		},
		[ clientId ]
	);

	// Update currentTab attribute when activeTab state changes
	useEffect( () => {
		if ( attributes.currentTab !== activeTab ) {
			setAttributes( { currentTab: activeTab } );
		}
	}, [ activeTab, attributes.currentTab, setAttributes ] );

	// Sync tabsData attribute with inner blocks for server-side button rendering
	useEffect( () => {
		const newTabsData = tabPanels.map( ( panel ) => ( {
			tabId: panel.attributes.tabId || `tab-${ panel.clientId }`,
			title: panel.attributes.title || '',
			isDisabled: panel.attributes.isDisabled || false,
		} ) );

		// Only update if data actually changed (avoid infinite loops)
		const currentJSON = JSON.stringify( attributes.tabsData || [] );
		const newJSON = JSON.stringify( newTabsData );

		if ( currentJSON !== newJSON ) {
			setAttributes( { tabsData: newTabsData } );
		}
	}, [ tabPanels, attributes.tabsData, setAttributes ] );

	// Use centralized alignment hook
	const blockRef = useBlockAlignment( attributes.tabsHorizontalAlign );

	// Extract schema defaults from tabsAttributes (SINGLE SOURCE OF TRUTH!)
	const schemaDefaults = useMemo( () => {
		const defaults = {};
		Object.keys( tabsAttributes ).forEach( ( key ) => {
			if ( tabsAttributes[ key ].default !== undefined ) {
				defaults[ key ] = tabsAttributes[ key ].default;
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
		blockType: 'tabs',
		schema: tabsSchema,
		attributes,
		setAttributes,
		allDefaults,
	} );

	// SOURCE OF TRUTH: attributes = merged state (what you see in sidebar)
	const effectiveValues = attributes;

	debug( '[DEBUG] Tabs attributes (source of truth):', attributes );
	debug( '[DEBUG] Expected values (defaults + theme):', expectedValues );
	debug( '[DEBUG] Is customized:', isCustomized );

	/**
	 * Apply inline styles from effective values
	 */
	/* ========== AUTO-GENERATED-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// AUTO-GENERATED from schemas/tabs.json
// To modify styles, update the schema and run: npm run schema:build

const getInlineStyles = () => {
  // Extract object-type attributes with fallbacks
	const tabButtonBorderRadius = effectiveValues.tabButtonBorderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 0,
		    "bottomLeft": 0
		};
	const panelBorderRadius = effectiveValues.panelBorderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 4,
		    "bottomLeft": 4
		};
	const borderRadius = effectiveValues.borderRadius || {
		    "topLeft": 0,
		    "topRight": 0,
		    "bottomRight": 0,
		    "bottomLeft": 0
		};

	return {
		container: {
			borderColor: effectiveValues.borderColor || '#dddddd',
			borderWidth: `${effectiveValues.borderWidth || 0}px`,
			borderStyle: effectiveValues.borderStyle || 'solid',
			borderRadius: `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.shadow || 'none',
		},
		icon: {
			color: effectiveValues.iconColor || '#666666',
			fontSize: `${effectiveValues.iconSize || 16}px`,
			transform: `${effectiveValues.iconRotation || 0}deg`,
		},
		tabList: {
			backgroundColor: effectiveValues.tabListBackgroundColor || 'transparent',
			borderColor: effectiveValues.tabsRowBorderColor || '#dddddd',
			borderWidth: `${effectiveValues.tabsRowBorderWidth || 0}px`,
			borderStyle: effectiveValues.tabsRowBorderStyle || 'solid',
			justifyContent: effectiveValues.tabListAlignment || 'flex-start',
			gap: `${effectiveValues.tabsButtonGap || 8}px`,
		},
		panel: {
			backgroundColor: effectiveValues.panelBackgroundColor || '#ffffff',
			borderColor: effectiveValues.panelBorderColor || '#dddddd',
			borderWidth: `${effectiveValues.panelBorderWidth || 1}px`,
			borderStyle: effectiveValues.panelBorderStyle || 'solid',
			borderRadius: `${panelBorderRadius.topLeft}px ${panelBorderRadius.topRight}px ${panelBorderRadius.bottomRight}px ${panelBorderRadius.bottomLeft}px`,
		},
	};
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

		const styles = getInlineStyles();
			const orientation = attributes.orientation || 'horizontal';
			const navContext = { orientation };
			const isDividerEnabled = attributes.enableTabsListContentBorder !== false;

			// Apply nav bar content border inline styles using schema variants (orientation-aware)
			if ( isDividerEnabled ) {
				const navColorProp = resolveCssProperty(
					'tabsListContentBorderColor',
					'tabs',
					navContext
				);
				if (
					navColorProp &&
					effectiveValues.tabsListContentBorderColor !== undefined &&
					effectiveValues.tabsListContentBorderColor !== null
				) {
					styles.tabList[ toCamelCase( navColorProp ) ] = effectiveValues.tabsListContentBorderColor;
				}

				const navWidthProp = resolveCssProperty(
					'tabsListContentBorderWidth',
					'tabs',
					navContext
				);
				if (
					navWidthProp &&
					effectiveValues.tabsListContentBorderWidth !== undefined &&
					effectiveValues.tabsListContentBorderWidth !== null
				) {
					styles.tabList[ toCamelCase( navWidthProp ) ] = `${ effectiveValues.tabsListContentBorderWidth }px`;
				}

				const navStyleProp = resolveCssProperty(
					'tabsListContentBorderStyle',
					'tabs',
					navContext
				);
				if (
					navStyleProp &&
					effectiveValues.tabsListContentBorderStyle !== undefined &&
					effectiveValues.tabsListContentBorderStyle !== null
				) {
					styles.tabList[ toCamelCase( navStyleProp ) ] = effectiveValues.tabsListContentBorderStyle;
				}
			}

		// Add tabButton function to styles object to handle active/disabled states
		styles.tabButton = (isActive, isDisabled) => {
			const isActiveContentBorderEnabled = attributes.enableFocusBorder !== false;

		const baseStyles = {
			color: effectiveValues.tabButtonColor,
			backgroundColor: effectiveValues.tabButtonBackgroundColor,
			borderWidth: `${effectiveValues.tabButtonBorderWidth}px`,
			borderStyle: effectiveValues.tabButtonBorderStyle,
			borderColor: effectiveValues.tabButtonBorderColor,
			borderRadius: `${effectiveValues.tabButtonBorderRadius.topLeft}px ${effectiveValues.tabButtonBorderRadius.topRight}px ${effectiveValues.tabButtonBorderRadius.bottomRight}px ${effectiveValues.tabButtonBorderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.tabButtonShadow,
			fontSize: `${effectiveValues.tabButtonFontSize}px`,
			fontWeight: effectiveValues.tabButtonFontWeight,
			fontStyle: effectiveValues.tabButtonFontStyle,
			};

			if (isActive) {
				const activeStyles = {
					...baseStyles,
				color: effectiveValues.tabButtonActiveColor,
				backgroundColor: effectiveValues.tabButtonActiveBackgroundColor,
					borderColor: effectiveValues.tabButtonActiveBorderColor,
					fontWeight: effectiveValues.tabButtonActiveFontWeight,
				};

				if (!isActiveContentBorderEnabled) {
					return activeStyles;
				}

				const contentBorderColor =
					effectiveValues.tabButtonActiveContentBorderColor;
				const contentBorderWidth =
					effectiveValues.tabButtonActiveContentBorderWidth;
				const contentBorderStyle =
					effectiveValues.tabButtonActiveContentBorderStyle;

				const propertyContext = { orientation };

				const colorProp = resolveCssProperty(
					'tabButtonActiveContentBorderColor',
					'tabs',
					propertyContext
				);

				const widthProp = resolveCssProperty(
					'tabButtonActiveContentBorderWidth',
					'tabs',
					propertyContext
				);

				const styleProp = resolveCssProperty(
					'tabButtonActiveContentBorderStyle',
					'tabs',
					propertyContext
				);

				const contentEdgeStyles = {};

				if (colorProp && contentBorderColor !== undefined && contentBorderColor !== null) {
					contentEdgeStyles[ toCamelCase( colorProp ) ] = contentBorderColor;
				}
				if (widthProp && contentBorderWidth !== undefined && contentBorderWidth !== null) {
					contentEdgeStyles[ toCamelCase( widthProp ) ] = `${contentBorderWidth}px`;
				}
				if (styleProp && contentBorderStyle !== undefined && contentBorderStyle !== null) {
					contentEdgeStyles[ toCamelCase( styleProp ) ] = contentBorderStyle;
				}

				return {
					...activeStyles,
					...contentEdgeStyles,
				};
			}

		if (isDisabled) {
			return {
				...baseStyles,
				opacity: 0.5,
				cursor: 'not-allowed',
			};
		}

		return baseStyles;
	};

	// Get dispatch for block manipulation
	const { insertBlock, removeBlock, updateBlockAttributes } = useDispatch( 'core/block-editor' );

	/**
	 * Add new tab next to active tab (or at end if no active tab)
	 * @param {number} afterIndex - Index after which to insert the new tab (optional)
	 */
	const addTab = ( afterIndex = null ) => {
		// Max 20 tabs validation
		if ( tabPanels.length >= 20 ) {
			alert( __( 'Maximum of 20 tabs allowed', 'guttemberg-plus' ) );
			return;
		}

		const insertIndex = afterIndex !== null ? afterIndex + 1 : tabPanels.length;
		const newBlock = wp.blocks.createBlock( 'custom/tab-panel', {
			tabId: `tab-${ generateUniqueId() }`,
			title: `Tab ${ tabPanels.length + 1 }`,
			isDisabled: false,
		} );
		insertBlock( newBlock, insertIndex, clientId );
		// Switch to newly created tab
		setActiveTab( insertIndex );
	};

	/**
	 * Remove tab by index with confirmation
	 * @param index
	 */
	const removeTab = ( index ) => {
		// Min 1 tab validation
		if ( tabPanels.length <= 1 ) {
			alert( __( 'You must keep at least 1 tab', 'guttemberg-plus' ) );
			return;
		}

		// Show confirmation warning
		const tabTitle = tabPanels[ index ]?.attributes?.title || `Tab ${ index + 1 }`;
		const confirmed = window.confirm(
			sprintf(
				__( 'Are you sure you want to delete "%s"? This action cannot be undone.', 'guttemberg-plus' ),
				tabTitle
			)
		);

		if ( ! confirmed ) {
			return;
		}

		const blockToRemove = tabPanels[ index ];
		removeBlock( blockToRemove.clientId );

		// Adjust active tab if needed
		if ( activeTab >= tabPanels.length - 1 ) {
			setActiveTab( Math.max( 0, tabPanels.length - 2 ) );
		}
	};

	/**
	 * Update tab property
	 * @param index
	 * @param property
	 * @param value
	 */
	const updateTab = ( index, property, value ) => {
		const block = tabPanels[ index ];
		if ( block ) {
			updateBlockAttributes( block.clientId, { [ property ]: value } );
		}
	};

	/**
	 * Switch active tab
	 * @param index
	 */
	const switchTab = ( index ) => {
		const panel = tabPanels[ index ];
		if ( panel && ! panel.attributes.isDisabled ) {
			setActiveTab( index );
		}
	};

	/**
	 * Render icon based on settings
	 */
	const renderIcon = () => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed;
		const isImage = iconContent.startsWith( 'http' );

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
						marginRight: '8px',
					} }
				/>
			);
		}

		return (
			<span className="tab-icon" aria-hidden="true" style={ styles.icon }>
				{ iconContent }
			</span>
		);
	};

	/**
	 * Build inline CSS variables for explicit customizations (Tier 3)
	 * These override both default CSS variables (Tier 1) and theme values (Tier 2)
	 * Respects feature toggles for optional border settings
	 */
	const getCustomizationStyles = () => {
		const styles = {};

		// Define which attributes are controlled by feature toggles
		const toggledAttributes = {
			// Active content edge border is controlled by enableFocusBorder
			tabButtonActiveContentBorderColor: 'enableFocusBorder',
			tabButtonActiveContentBorderWidth: 'enableFocusBorder',
			tabButtonActiveContentBorderStyle: 'enableFocusBorder',
			// Nav bar border settings are controlled by enableTabsListContentBorder
			tabsListContentBorderColor: 'enableTabsListContentBorder',
			tabsListContentBorderWidth: 'enableTabsListContentBorder',
			tabsListContentBorderStyle: 'enableTabsListContentBorder',
		};

		// Reset CSS variables for disabled toggles to prevent unwanted inheritance
		if ( attributes.enableFocusBorder === false ) {
			styles['--tabs-button-active-content-border-color'] =
				'var(--tabs-button-active-border-color)';
			styles['--tabs-button-active-content-border-width'] =
				'var(--tabs-button-border-width)';
			styles['--tabs-button-active-content-border-style'] =
				'var(--tabs-button-border-style)';
		}

		if ( attributes.enableTabsListContentBorder === false ) {
			// Fall back to the main tab row border settings when the divider is disabled
			styles['--tabs-list-divider-border-color'] = attributes.tabsRowBorderColor || '#dddddd';
			styles['--tabs-list-divider-border-width'] = `${ attributes.tabsRowBorderWidth || 0 }px`;
			styles['--tabs-list-divider-border-style'] = attributes.tabsRowBorderStyle || 'solid';
		}

		// Process each attribute using schema-generated mappings
		Object.entries( attributes ).forEach( ( [ attrName, value ] ) => {
			if ( value === null || value === undefined ) {
				return;
			}

			// Skip toggle attributes themselves
			if ( attrName === 'enableFocusBorder' || attrName === 'enableTabsListContentBorder' ) {
				return;
			}

			// Check if this attribute is controlled by a toggle and if that toggle is disabled
			const controllingToggle = toggledAttributes[ attrName ];
			if ( controllingToggle && ! attributes[ controllingToggle ] ) {
				// Toggle is disabled, skip this attribute's CSS variable
				return;
			}

			// Get CSS variable name from generated mappings
			const cssVar = getCssVarName( attrName, 'tabs' );
			if ( ! cssVar ) {
				return; // Attribute not mapped to a CSS variable
			}

			// Format value with proper unit from generated mappings
			const formattedValue = formatCssValue( attrName, value, 'tabs' );
			if ( formattedValue !== null ) {
				styles[ cssVar ] = formattedValue;
			}
		} );

		return styles;
	};

		const customizationStyles = getCustomizationStyles();

		// Build root styles including width
		const rootStyles = {
			width: effectiveValues.tabsWidth,
			...customizationStyles,
		};

			const blockProps = useBlockProps( {
				className: 'gutplus-tabs',
				style: rootStyles,
				ref: blockRef,
				'data-orientation': attributes.orientation || 'horizontal',
			} );

	return (
		<>		<InspectorControls>
			<div className="tabs-settings-panel">
				<ThemeSelector
					blockType="tabs"
					currentTheme={ attributes.currentTheme }
					isCustomized={ isCustomized }
					attributes={ attributes }
					effectiveValues={ effectiveValues }
					setAttributes={ setAttributes }
					themes={ themes }
					themesLoaded={ themesLoaded }
					sessionCache={ sessionCache }
					onThemeChange={ handleThemeChange }
					onSaveNew={ handleSaveNewTheme }
					onUpdate={ handleUpdateTheme }
					onDelete={ handleDeleteTheme }
					onRename={ handleRenameTheme }
					onReset={ handleResetCustomizations }
				/>
			</div>

			<PanelBody title={ __( 'Tabs Management', 'guttemberg-plus' ) } initialOpen={ true }>
				<div className="tabs-management">
					{ tabPanels.map( ( panel, index ) => (
						<div key={ panel.clientId } style={ { marginBottom: '12px' } }>
							<div
								style={ {
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								} }
							>
								<strong>
									{ __( 'Tab', 'guttemberg-plus' ) } { index + 1 }
									{ panel.attributes.title && `: ${ panel.attributes.title }` }
								</strong>
								<div>
									<ToggleControl
										label={ __( 'Disabled', 'guttemberg-plus' ) }
										checked={ panel.attributes.isDisabled || false }
										onChange={ ( value ) =>
											updateTab( index, 'isDisabled', value )
										}
									/>
									{ tabPanels.length > 1 && (
										<Button
											isDestructive
											isSmall
											onClick={ () => removeTab( index ) }
										>
											{ __( 'Remove', 'guttemberg-plus' ) }
										</Button>
									) }
								</div>
							</div>
						</div>
					) ) }
					<Button isPrimary onClick={ addTab }>
						{ __( '+ Add Tab', 'guttemberg-plus' ) }
					</Button>
				</div>
			</PanelBody>

			{/* Auto-generated panels from schema */}
			<SchemaPanels
				schema={ tabsSchema }
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
					<div className="tabs-loading">
						<p>{ __( 'Loading themes…', 'guttemberg-plus' ) }</p>
					</div>
				) }

				{ themesLoaded && (
					<div
						className="tabs-container"
						data-orientation={ attributes.orientation }
						style={ styles.container }
					>
						{ /* Tab List */ }
						<div
							className="tabs-list"
							role="tablist"
							aria-orientation={ getAriaOrientation( attributes.orientation ) }
							style={ styles.tabList }
						>
							{ tabPanels.map( ( panel, index ) => {
								const tabId = panel.attributes.tabId || `tab-${ panel.clientId }`;
								const headingLevel = attributes.headingLevel || 'none';

								// The button element
								const buttonElement = (
									<button
										role="tab"
										aria-selected={ activeTab === index }
										aria-controls={ `panel-${ tabId }` }
										id={ `tab-${ tabId }` }
										disabled={ panel.attributes.isDisabled }
										onClick={ () => switchTab( index ) }
										style={ {
											...styles.tabButton(
												activeTab === index,
												panel.attributes.isDisabled
											),
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										} }
										className={ `tab-button ${
											activeTab === index ? 'active' : ''
										}` }
									>
										<span className="tab-title" style={ { marginRight: '20px' } }>
											{ effectiveValues.showIcon && effectiveValues.iconPosition === 'left' && renderIcon() }
											<RichText
												tagName="span"
												value={ panel.attributes.title || `Tab ${ index + 1 }` }
												onChange={ ( value ) => updateTab( index, 'title', value ) }
												placeholder={ __( 'Tab title…', 'guttemberg-plus' ) }
												keepPlaceholderOnFocus={ false }
											/>
											{ effectiveValues.showIcon && effectiveValues.iconPosition === 'right' && renderIcon() }
										</span>
										<div className="tab-actions" style={ {
											display: 'flex',
											flexDirection: 'column',
											gap: '1px',
											marginLeft: 'auto',
										} }>
											<button
												onClick={ ( e ) => {
													e.stopPropagation();
													addTab( index );
												} }
												className="tab-action-button tab-add-button"
												title={ __( 'Add tab after this one', 'guttemberg-plus' ) }
												type="button"
											>
												+
											</button>
											<button
												onClick={ ( e ) => {
													e.stopPropagation();
													removeTab( index );
												} }
												className="tab-action-button tab-remove-button"
												title={ __( 'Delete this tab', 'guttemberg-plus' ) }
												type="button"
											>
												−
											</button>
										</div>
									</button>
								);

								// Wrap in heading if headingLevel is set - for TOC detection
								let wrappedButton = buttonElement;
								if ( headingLevel !== 'none' ) {
									const HeadingTag = headingLevel;
									wrappedButton = (
										<HeadingTag className="tab-heading" style={ { margin: 0, display: 'contents' } }>
											{ buttonElement }
										</HeadingTag>
									);
								}

								return (
									<div key={ panel.clientId } className="tab-button-container">
										{ wrappedButton }
									</div>
								);
							} ) }
						</div>

						{ /* Tab Panels */ }
						<div className="tabs-panels" style={ styles.panel }>
							<InnerBlocks
								allowedBlocks={ [ 'custom/tab-panel' ] }
								template={ [
									[ 'custom/tab-panel', { tabId: `tab-${ generateUniqueId() }`, title: 'Tab 1' } ],
								] }
								renderAppender={ false }
							/>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
