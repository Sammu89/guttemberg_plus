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
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
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
export default function Edit( { attributes, setAttributes, clientId: _clientId } ) {
	debug( '[DEBUG] Tabs Edit mounted with attributes:', attributes );

	// Local state for active tab in editor
	const [ activeTab, setActiveTab ] = useState( attributes.currentTab || 0 );

	// Generate unique IDs for tabs on mount if not set
	useEffect( () => {
		const updatedTabs = attributes.tabs.map( ( tab ) => {
			if ( ! tab.id ) {
				return { ...tab, id: `tab-${ generateUniqueId() }` };
			}
			return tab;
		} );

		if ( updatedTabs.some( ( tab, index ) => tab.id !== attributes.tabs[ index ].id ) ) {
			setAttributes( { tabs: updatedTabs } );
		}
	}, [ attributes.tabs, setAttributes ] );

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

	// Resolve effective values through cascade (pure cascade - no normalization)
	// Source of truth: CSS defaults -> Theme values -> Block customizations
	const effectiveValues = getAllEffectiveValues(
		attributes,
		themes[ attributes.currentTheme ]?.values || {},
		cssDefaults
	);

	debug( '[DEBUG] Effective values:', effectiveValues );

	// Check if block has customizations using proper cascade comparison
	// Attributes to exclude from customization check (non-style attributes)
	const excludeFromCustomizationCheck = [
		'tabs',
		'currentTheme',
		'customizationCache',
		'orientation',
		'activationMode',
		'currentTab',
		'responsiveBreakpoint',
		'enableResponsiveFallback',
	];

	const isCustomized = hasAnyCustomizations(
		attributes,
		themes[ attributes.currentTheme ]?.values || {},
		cssDefaults,
		excludeFromCustomizationCheck
	);

	/**
	 * Theme callback handlers
	 * @param themeName
	 */
	const handleSaveNewTheme = async ( themeName ) => {
		await createTheme( 'tabs', themeName, effectiveValues );
		setAttributes( { currentTheme: themeName } );
	};

	const handleUpdateTheme = async () => {
		await updateTheme( 'tabs', attributes.currentTheme, effectiveValues );
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
		const resetAttrs = {};
		Object.keys( attributes ).forEach( ( key ) => {
			if (
				key !== 'currentTheme' &&
				key !== 'tabs' &&
				key !== 'customizationCache' &&
				key !== 'orientation' &&
				key !== 'activationMode' &&
				key !== 'currentTab' &&
				key !== 'responsiveBreakpoint' &&
				key !== 'enableResponsiveFallback'
			) {
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

	/**
	 * Add new tab
	 */
	const addTab = () => {
		const newTab = {
			id: `tab-${ generateUniqueId() }`,
			title: `Tab ${ attributes.tabs.length + 1 }`,
			content: '',
			isDisabled: false,
		};
		setAttributes( { tabs: [ ...attributes.tabs, newTab ] } );
	};

	/**
	 * Remove tab by index
	 * @param index
	 */
	const removeTab = ( index ) => {
		if ( attributes.tabs.length <= 1 ) {
			return; // Don't allow removing last tab
		}

		const newTabs = attributes.tabs.filter( ( _, i ) => i !== index );
		setAttributes( { tabs: newTabs } );

		// Adjust active tab if needed
		if ( activeTab >= newTabs.length ) {
			setActiveTab( newTabs.length - 1 );
			setAttributes( { currentTab: newTabs.length - 1 } );
		}
	};

	/**
	 * Update tab property
	 * @param index
	 * @param property
	 * @param value
	 */
	const updateTab = ( index, property, value ) => {
		const newTabs = [ ...attributes.tabs ];
		newTabs[ index ] = { ...newTabs[ index ], [ property ]: value };
		setAttributes( { tabs: newTabs } );
	};

	/**
	 * Switch active tab
	 * @param index
	 */
	const switchTab = ( index ) => {
		if ( ! attributes.tabs[ index ]?.isDisabled ) {
			setActiveTab( index );
			setAttributes( { currentTab: index } );
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
						{ attributes.tabs.map( ( tab, index ) => (
							<div key={ tab.id } style={ { marginBottom: '12px' } }>
								<div
									style={ {
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									} }
								>
									<strong>
										{ __( 'Tab', 'guttemberg-plus' ) } { index + 1 }
									</strong>
									<div>
										<ToggleControl
											label={ __( 'Disabled', 'guttemberg-plus' ) }
											checked={ tab.isDisabled || false }
											onChange={ ( value ) =>
												updateTab( index, 'isDisabled', value )
											}
										/>
										{ attributes.tabs.length > 1 && (
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
							{ attributes.tabs.map( ( tab, index ) => (
								<button
									key={ tab.id }
									role="tab"
									aria-selected={ activeTab === index }
									aria-controls={ `panel-${ tab.id }` }
									id={ `tab-${ tab.id }` }
									disabled={ tab.isDisabled }
									onClick={ () => switchTab( index ) }
									style={ styles.tabButton(
										activeTab === index,
										tab.isDisabled
									) }
									className={ `tab-button ${
										activeTab === index ? 'active' : ''
									}` }
								>
									{ effectiveValues.showIcon && renderIcon() }
									{ tab.title || `Tab ${ index + 1 }` }
								</button>
							) ) }
						</div>

						{ /* Tab Panels */ }
						<div className="tabs-panels">
							{ attributes.tabs.map( ( tab, index ) => (
								<div
									key={ tab.id }
									role="tabpanel"
									id={ `panel-${ tab.id }` }
									aria-labelledby={ `tab-${ tab.id }` }
									hidden={ activeTab !== index }
									tabIndex="0"
									style={
										activeTab === index ? styles.panel : { display: 'none' }
									}
									className={ `tab-panel ${
										activeTab === index ? 'active' : ''
									}` }
								>
									{ activeTab === index && (
										<>
											<div
												style={ {
													marginBottom: '12px',
													fontWeight: 'bold',
												} }
											>
												<RichText
													tagName="span"
													value={ tab.title }
													onChange={ ( value ) =>
														updateTab( index, 'title', value )
													}
													placeholder={ __(
														'Tab title…',
														'guttemberg-plus'
													) }
												/>
											</div>
											<RichText
												tagName="div"
												value={ tab.content }
												onChange={ ( value ) =>
													updateTab( index, 'content', value )
												}
												placeholder={ __(
													'Add tab content…',
													'guttemberg-plus'
												) }
											/>
										</>
									) }
								</div>
							) ) }
						</div>
					</div>
				) }
			</div>
		</>
	);
}
