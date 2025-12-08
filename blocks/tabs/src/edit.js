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
	STORE_NAME,
	ThemeSelector,
	SchemaPanels,
	CustomizationWarning,
	debug,
	useBlockThemes,
	useThemeState,
	useThemeHandlers,
	getTabsCustomizationStyles,
} from '@shared';
import { getCssVarName, formatCssValue } from '@shared/config/css-var-mappings-generated';
import tabsSchema from '../../../schemas/tabs.json';
import './editor.scss';


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

	// Load themes using shared hook
	const {
		themes,
		themesLoaded,
		createTheme,
		updateTheme,
		deleteTheme,
		renameTheme,
	} = useBlockThemes( 'tabs' );

	// Get CSS defaults from window (parsed by PHP)
	const cssDefaults = useMemo( () => window.tabsDefaults || {}, [] );

	// Merge CSS defaults with behavioral defaults from attribute schemas
	const allDefaults = useMemo( () => getAllDefaults( cssDefaults ), [ cssDefaults ] );

	// Use shared theme state hook
	const {
		sessionCache,
		setSessionCache,
		expectedValues,
		isCustomized,
		excludeFromCustomizationCheck,
	} = useThemeState( {
		blockType: 'tabs',
		attributes,
		themes,
		themesLoaded,
		allDefaults,
		schema: tabsSchema,
	} );

	// Use shared theme handlers hook
	const {
		handleSaveNewTheme,
		handleUpdateTheme,
		handleDeleteTheme,
		handleRenameTheme,
		handleResetCustomizations,
		handleThemeChange,
	} = useThemeHandlers( {
		blockType: 'tabs',
		attributes,
		setAttributes,
		allDefaults,
		expectedValues,
		themes,
		sessionCache,
		setSessionCache,
		excludeFromCustomizationCheck,
		createTheme,
		updateTheme,
		deleteTheme,
		renameTheme,
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
	const buttonBorderRadius = effectiveValues.buttonBorderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 0,
		    "bottomLeft": 0
		};
	const panelBorderRadius = effectiveValues.panelBorderRadius || {
		    "topLeft": 0,
		    "topRight": 0,
		    "bottomRight": 0,
		    "bottomLeft": 0
		};
	const borderRadius = effectiveValues.borderRadius || {
		    "topLeft": 0,
		    "topRight": 0,
		    "bottomRight": 0,
		    "bottomLeft": 0
		};

	return {
		container: {
			color: effectiveValues.tabButtonColor || '#666666',
			backgroundColor: effectiveValues.tabButtonBackgroundColor || 'transparent',
			borderWidth: `${effectiveValues.buttonBorderWidth || null}px`,
			borderStyle: effectiveValues.buttonBorderStyle || 'null',
			borderRadius: `${buttonBorderRadius.topLeft}px ${buttonBorderRadius.topRight}px ${buttonBorderRadius.bottomRight}px ${buttonBorderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.buttonShadow || 'none',
			borderColor: effectiveValues.focusBorderColor || '#0073aa',
			fontSize: `${effectiveValues.tabButtonFontSize || 16}px`,
			fontWeight: effectiveValues.tabButtonFontWeight || '500',
			fontStyle: effectiveValues.tabButtonFontStyle || 'normal',
			textTransform: effectiveValues.tabButtonTextTransform || 'none',
			textDecoration: effectiveValues.tabButtonTextDecoration || 'none',
			textAlign: effectiveValues.tabButtonTextAlign || 'center',
			justifyContent: effectiveValues.tabListAlignment || 'left',
		},
		content: {
			borderColor: effectiveValues.dividerBorderColor || '#dddddd',
			borderWidth: `${effectiveValues.dividerBorderWidth || 1}px`,
			borderStyle: effectiveValues.dividerBorderStyle || 'solid',
		},
		icon: {
			color: effectiveValues.iconColor || '#666666',
			fontSize: `${effectiveValues.iconSize || 16}px`,
		},
	};
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

	const styles = getInlineStyles();

	// Add tabButton function to styles object to handle active/disabled states
	styles.tabButton = (isActive, isDisabled) => {
		const baseStyles = {
			color: effectiveValues.tabButtonColor || '#666666',
			backgroundColor: effectiveValues.tabButtonBackgroundColor || 'transparent',
			borderWidth: `${effectiveValues.buttonBorderWidth || 0}px`,
			borderStyle: effectiveValues.buttonBorderStyle || 'solid',
			borderColor: effectiveValues.buttonBorderColor || 'transparent',
			borderRadius: effectiveValues.buttonBorderRadius ?
				`${effectiveValues.buttonBorderRadius.topLeft || 0}px ${effectiveValues.buttonBorderRadius.topRight || 0}px ${effectiveValues.buttonBorderRadius.bottomRight || 0}px ${effectiveValues.buttonBorderRadius.bottomLeft || 0}px` :
				'0',
			boxShadow: effectiveValues.buttonShadow || 'none',
			fontSize: `${effectiveValues.tabButtonFontSize || 16}px`,
			fontWeight: effectiveValues.tabButtonFontWeight || '500',
			fontStyle: effectiveValues.tabButtonFontStyle || 'normal',
		};

		if (isActive) {
			return {
				...baseStyles,
				color: effectiveValues.tabButtonActiveColor || '#000000',
				backgroundColor: effectiveValues.tabButtonActiveBackgroundColor || '#ffffff',
				borderColor: effectiveValues.tabButtonActiveBorderColor || baseStyles.borderColor,
				borderBottomColor: effectiveValues.tabButtonActiveBorderBottomColor || 'transparent',
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

	// Get customization styles using shared utility
	const customizationStyles = getTabsCustomizationStyles( attributes );

	const blockProps = useBlockProps( {
		className: 'wp-block-tabs sammu-blocks',
		style: customizationStyles,
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
				cssDefaults={ cssDefaults }
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
							aria-orientation={ attributes.orientation }
							style={ styles.tabList }
						>
							{ tabPanels.map( ( panel, index ) => {
								const tabId = panel.attributes.tabId || `tab-${ panel.clientId }`;
								return (
									<div key={ panel.clientId } className="tab-button-container">
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
												{ effectiveValues.showIcon && renderIcon() }
												<RichText
													tagName="span"
													value={ panel.attributes.title || `Tab ${ index + 1 }` }
													onChange={ ( value ) => updateTab( index, 'title', value ) }
													placeholder={ __( 'Tab title…', 'guttemberg-plus' ) }
													keepPlaceholderOnFocus={ false }
												/>
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
