/**
 * Tabs Block - Edit Component
 *
 * Editor interface for tabs block with full theme integration.
 * Uses shared UI components and cascade resolution.
 * Supports horizontal/vertical orientation and responsive fallback.
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

import {
	getAllEffectiveValues,
	hasAnyCustomizations,
	generateUniqueId,
	getAllDefaults,
	STORE_NAME,
	ThemeSelector,
	ColorPanel,
	TypographyPanel,
	BorderPanel,
	IconPanel,
	CustomizationWarning,
	debug,
} from '@shared';

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

	// Load themes from store
	const { themes, themesLoaded } = useSelect(
		( select ) => {
			const { getThemes, areThemesLoaded } = select( STORE_NAME );
			return {
				themes: getThemes( 'tabs' ),
				themesLoaded: areThemesLoaded( 'tabs' ),
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
			loadThemes( 'tabs' );
		}
	}, [ themesLoaded, loadThemes ] );

	// Get CSS defaults from window (parsed by PHP)
	const cssDefaults = window.tabsDefaults || {};

	// Merge CSS defaults with behavioral defaults from attribute schemas
	const allDefaults = getAllDefaults( cssDefaults );

	// Resolve effective values through cascade (pure cascade - no normalization)
	// Source of truth: All defaults (CSS + behavioral) -> Theme values -> Block customizations
	// Apply customizations only if applyCustomizations flag is true
	const effectiveValues = getAllEffectiveValues(
		attributes.applyCustomizations ? attributes.customizations : {},
		themes[ attributes.currentTheme ]?.values || {},
		allDefaults
	);

	debug( '[DEBUG] Effective values:', effectiveValues );

	// Check if block has customizations using proper cascade comparison
	// Attributes to exclude from customization check (truly structural, non-themeable attributes)
	const excludeFromCustomizationCheck = [
		// Structural identifiers (not themeable)
		'tabs',
		'uniqueId',
		'blockId',
		// Meta attributes (not themeable)
		'currentTheme',
		'customizations',
		'customizationCache',
		'applyCustomizations',
		// Behavioral settings (not themeable - per-block only)
		'orientation',
		'activationMode',
		'currentTab',
		'responsiveBreakpoint',
		'enableResponsiveFallback',
	];

	const isCustomized = hasAnyCustomizations(
		attributes,
		themes[ attributes.currentTheme ]?.values || {},
		allDefaults,
		excludeFromCustomizationCheck
	);

	// DEBUG: Log customization detection details
	useEffect( () => {
		console.group( '🔍 TABS Customization Detection Debug' );
		console.log( 'Current Theme:', attributes.currentTheme || '(none - using Default)' );
		console.log( 'Is Customized:', isCustomized );
		console.log( 'All Attributes:', attributes );
		console.log( 'Excluded from Check:', excludeFromCustomizationCheck );

		// Find which attributes are customized
		const customizedAttrs = [];
		Object.keys( attributes ).forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return; // Skip excluded
			}

			const attrValue = attributes[ key ];
			const themeValue = themes[ attributes.currentTheme ]?.values?.[ key ];
			const cssDefault = allDefaults[ key ];

			// Check if attribute is defined
			if ( attrValue !== null && attrValue !== undefined ) {
				// Compare against theme or CSS default
				let isDifferent = false;
				if ( themeValue !== null && themeValue !== undefined ) {
					if ( typeof attrValue === 'object' ) {
						isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( themeValue );
					} else {
						isDifferent = attrValue !== themeValue;
					}
				} else if ( cssDefault !== null && cssDefault !== undefined ) {
					if ( typeof attrValue === 'object' ) {
						isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( cssDefault );
					} else {
						isDifferent = attrValue !== cssDefault;
					}
				} else {
					isDifferent = true; // No default to compare against
				}

				if ( isDifferent ) {
					customizedAttrs.push( {
						key,
						blockValue: attrValue,
						themeValue,
						cssDefault,
					} );
				}
			}
		} );

		if ( customizedAttrs.length > 0 ) {
			console.log( '❌ Customized Attributes:', customizedAttrs );
		} else {
			console.log( '✅ No customizations detected' );
		}
		console.groupEnd();
	}, [ attributes, isCustomized, themes, allDefaults, excludeFromCustomizationCheck ] );

	/**
	 * Helper: Extract only themeable values (exclude structural/meta attributes)
	 */
	const getThemeableValues = ( values ) => {
		const themeable = { ...values };
		excludeFromCustomizationCheck.forEach( ( key ) => {
			delete themeable[ key ];
		} );
		return themeable;
	};

	/**
	 * Theme callback handlers
	 * @param themeName
	 */
	const handleSaveNewTheme = async ( themeName ) => {
		const themeableValues = getThemeableValues( effectiveValues );
		await createTheme( 'tabs', themeName, themeableValues );
		setAttributes( {
			currentTheme: themeName,
			customizations: {},
			customizationCache: '',
			applyCustomizations: false, // Theme now contains these values
		} );
	};

	const handleUpdateTheme = async () => {
		const themeableValues = getThemeableValues( effectiveValues );
		await updateTheme( 'tabs', attributes.currentTheme, themeableValues );
		setAttributes( {
			customizations: {},
			customizationCache: '',
			applyCustomizations: false, // Theme now contains these values
		} );
	};

	const handleDeleteTheme = async () => {
		await deleteTheme( 'tabs', attributes.currentTheme );
		setAttributes( { currentTheme: '' } );
	};

	const handleRenameTheme = async ( oldName, newName ) => {
		await renameTheme( 'tabs', oldName, newName );
		setAttributes( { currentTheme: newName } );
	};

	const handleResetCustomizations = () => {
		// Reset all customizable attributes to null
		// Keep structural, behavioral, and icon settings
		const resetAttrs = {};
		Object.keys( attributes ).forEach( ( key ) => {
			if ( ! excludeFromCustomizationCheck.includes( key ) ) {
				resetAttrs[ key ] = null;
			}
		} );
		setAttributes( resetAttrs );
	};

	/**
	 * Apply inline styles from effective values
	 */
	const getInlineStyles = () => {
		const tabListPadding = effectiveValues.tabListPadding || {
			top: 8,
			right: 8,
			bottom: 8,
			left: 8,
		};
		const panelPadding = effectiveValues.panelPadding || {
			top: 24,
			right: 24,
			bottom: 24,
			left: 24,
		};
		const tabButtonPadding = effectiveValues.titlePadding || {
			top: 12,
			right: 24,
			bottom: 12,
			left: 24,
		};
		const tabButtonBorderRadius = effectiveValues.tabButtonBorderRadius || {
			topLeft: 4,
			topRight: 4,
			bottomLeft: 0,
			bottomRight: 0,
		};

		return {
			container: {
				display: 'flex',
				flexDirection: attributes.orientation === 'vertical' ? 'row' : 'column',
				margin: '1em 0',
			},
			tabList: {
				display: 'flex',
				flexDirection: attributes.orientation === 'vertical' ? 'column' : 'row',
				backgroundColor: effectiveValues.tabListBackground || '#f5f5f5',
				gap: `${ effectiveValues.tabListGap || 4 }px`,
				padding: `${ tabListPadding.top }px ${ tabListPadding.right }px ${ tabListPadding.bottom }px ${ tabListPadding.left }px`,
				borderBottom:
					attributes.orientation === 'horizontal'
						? `${ effectiveValues.tabListBorderBottomWidth || 2 }px ${
								effectiveValues.tabListBorderBottomStyle || 'solid'
						  } ${ effectiveValues.tabListBorderBottomColor || '#dddddd' }`
						: 'none',
				borderRight:
					attributes.orientation === 'vertical'
						? `${ effectiveValues.tabListBorderBottomWidth || 2 }px ${
								effectiveValues.tabListBorderBottomStyle || 'solid'
						  } ${ effectiveValues.tabListBorderBottomColor || '#dddddd' }`
						: 'none',
				justifyContent:
					attributes.orientation === 'horizontal'
						? effectiveValues.tabsAlignment || 'flex-start'
						: 'flex-start',
			},
			tabButton: ( isActive, isDisabled ) => ( {
				backgroundColor: isActive
					? effectiveValues.tabButtonActiveBackground || '#ffffff'
					: effectiveValues.titleBackgroundColor || 'transparent',
				color: isActive
					? effectiveValues.tabButtonActiveColor || '#000000'
					: effectiveValues.titleColor || '#666666',
				border: `${ effectiveValues.accordionBorderThickness || 1 }px ${
					effectiveValues.accordionBorderStyle || 'solid'
				} ${
					isActive
						? effectiveValues.tabButtonActiveBorderColor || '#dddddd'
						: 'transparent'
				}`,
				borderRadius: `${ tabButtonBorderRadius.topLeft }px ${ tabButtonBorderRadius.topRight }px ${ tabButtonBorderRadius.bottomRight }px ${ tabButtonBorderRadius.bottomLeft }px`,
				padding: `${ tabButtonPadding.top }px ${ tabButtonPadding.right }px ${ tabButtonPadding.bottom }px ${ tabButtonPadding.left }px`,
				fontSize: `${ effectiveValues.titleFontSize || 16 }px`,
				fontWeight: effectiveValues.titleFontWeight || '500',
				fontStyle: effectiveValues.titleFontStyle || 'normal',
				textTransform: effectiveValues.titleTextTransform || 'none',
				textDecoration: effectiveValues.titleTextDecoration || 'none',
				textAlign: effectiveValues.titleAlignment || 'center',
				cursor: isDisabled ? 'not-allowed' : 'pointer',
				opacity: isDisabled ? 0.5 : 1,
				whiteSpace: 'nowrap',
				borderBottom:
					isActive && attributes.orientation === 'horizontal' ? 'none' : undefined,
			} ),
			panel: {
				backgroundColor: effectiveValues.panelBackground || '#ffffff',
				color: effectiveValues.panelColor || '#333333',
				border: `${ effectiveValues.panelBorderWidth || 1 }px ${
					effectiveValues.panelBorderStyle || 'solid'
				} ${ effectiveValues.panelBorderColor || '#dddddd' }`,
				borderRadius: `${ effectiveValues.panelBorderRadius || 0 }px`,
				padding: `${ panelPadding.top }px ${ panelPadding.right }px ${ panelPadding.bottom }px ${ panelPadding.left }px`,
				fontSize: `${ effectiveValues.panelFontSize || 16 }px`,
				lineHeight: effectiveValues.panelLineHeight || 1.6,
				flex: attributes.orientation === 'vertical' ? 1 : undefined,
			},
			icon: {
				fontSize: `${ effectiveValues.iconSize || effectiveValues.titleFontSize || 18 }px`,
				color: effectiveValues.iconColor || effectiveValues.titleColor || 'inherit',
				display: effectiveValues.showIcon ? 'inline-block' : 'none',
				marginRight: '8px',
			},
		};
	};

	const styles = getInlineStyles();

	// Get dispatch for block manipulation
	const { insertBlock, removeBlock, updateBlockAttributes } = useDispatch( 'core/block-editor' );

	/**
	 * Add new tab
	 */
	const addTab = () => {
		const newBlock = wp.blocks.createBlock( 'custom/tab-panel', {
			tabId: `tab-${ generateUniqueId() }`,
			title: `Tab ${ tabPanels.length + 1 }`,
			isDisabled: false,
		} );
		insertBlock( newBlock, tabPanels.length, clientId );
	};

	/**
	 * Remove tab by index
	 * @param index
	 */
	const removeTab = ( index ) => {
		if ( tabPanels.length <= 1 ) {
			return; // Don't allow removing last tab
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

		const iconContent = effectiveValues.iconTypeClosed || '📄';
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

	const blockProps = useBlockProps( {
		className: 'wp-block-tabs',
	} );

	return (
		<>
			<InspectorControls>
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
						onSaveNew={ handleSaveNewTheme }
						onUpdate={ handleUpdateTheme }
						onDelete={ handleDeleteTheme }
						onRename={ handleRenameTheme }
						onReset={ handleResetCustomizations }
					/>
				</div>

				<PanelBody title={ __( 'Tab Settings', 'guttemberg-plus' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Orientation', 'guttemberg-plus' ) }
						value={ attributes.orientation }
						options={ [
							{
								label: __( 'Horizontal', 'guttemberg-plus' ),
								value: 'horizontal',
							},
							{
								label: __( 'Vertical', 'guttemberg-plus' ),
								value: 'vertical',
							},
						] }
						onChange={ ( value ) => setAttributes( { orientation: value } ) }
					/>

					<SelectControl
						label={ __( 'Activation Mode', 'guttemberg-plus' ) }
						value={ attributes.activationMode }
						options={ [
							{
								label: __( 'Automatic (on focus)', 'guttemberg-plus' ),
								value: 'auto',
							},
							{
								label: __( 'Manual (on click)', 'guttemberg-plus' ),
								value: 'manual',
							},
						] }
						onChange={ ( value ) => setAttributes( { activationMode: value } ) }
						help={ __(
							'Automatic activates tab on arrow key focus, manual requires Enter/Space',
							'guttemberg-plus'
						) }
					/>

					<ToggleControl
						label={ __( 'Responsive Accordion Fallback', 'guttemberg-plus' ) }
						help={ __(
							'Convert to accordion layout on mobile screens',
							'guttemberg-plus'
						) }
						checked={ attributes.enableResponsiveFallback || true }
						onChange={ ( value ) =>
							setAttributes( { enableResponsiveFallback: value } )
						}
					/>

					{ attributes.enableResponsiveFallback && (
						<RangeControl
							label={ __( 'Responsive Breakpoint (px)', 'guttemberg-plus' ) }
							value={ attributes.responsiveBreakpoint || 768 }
							onChange={ ( value ) =>
								setAttributes( { responsiveBreakpoint: value } )
							}
							min={ 320 }
							max={ 1024 }
							step={ 1 }
						/>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Tab Management', 'guttemberg-plus' ) }>
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

				<ColorPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="tabs"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				<TypographyPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="tabs"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				<BorderPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="tabs"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				<IconPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="tabs"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				{ isCustomized && (
					<PanelBody title={ __( 'Customization Info', 'guttemberg-plus' ) }>
						<CustomizationWarning
							currentTheme={ attributes.currentTheme }
							themes={ themes }
						/>
					</PanelBody>
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
							aria-orientation={ attributes.orientation }
							style={ styles.tabList }
						>
							{ tabPanels.map( ( panel, index ) => {
								const tabId = panel.attributes.tabId || `tab-${ panel.clientId }`;
								return (
									<button
										key={ panel.clientId }
										role="tab"
										aria-selected={ activeTab === index }
										aria-controls={ `panel-${ tabId }` }
										id={ `tab-${ tabId }` }
										disabled={ panel.attributes.isDisabled }
										onClick={ () => switchTab( index ) }
										style={ styles.tabButton(
											activeTab === index,
											panel.attributes.isDisabled
										) }
										className={ `tab-button ${
											activeTab === index ? 'active' : ''
										}` }
									>
										{ effectiveValues.showIcon && renderIcon() }
										{ panel.attributes.title || `Tab ${ index + 1 }` }
									</button>
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
