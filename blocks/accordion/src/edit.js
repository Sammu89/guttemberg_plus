/**
 * Accordion Block - Edit Component
 *
 * Editor interface for accordion block with full theme integration.
 * Uses shared UI components and cascade resolution.
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

import {
	generateUniqueId,
	getAllDefaults,
	calculateDeltas,
	applyDeltas,
	getThemeableSnapshot,
	STORE_NAME,
	ThemeSelector,
	HeaderColorsPanel,
	ContentColorsPanel,
	TypographyPanel,
	BorderPanel,
	IconPanel,
	CustomizationWarning,
	debug,
} from '@shared';

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

	// Get CSS defaults from window (parsed by PHP)
	const cssDefaults = window.accordionDefaults || {};

	// Merge CSS defaults with behavioral defaults from attribute schemas
	const allDefaults = getAllDefaults( cssDefaults );

	// Attributes to exclude from theming (structural, meta, behavioral only)
	const excludeFromCustomizationCheck = [
		// Structural identifiers (not themeable)
		'accordionId',
		'uniqueId',
		'blockId',
		'title',
		'content',
		// Meta attributes (not themeable)
		'currentTheme',
		// Behavioral settings (not themeable - per-block only)
		'initiallyOpen',
		'allowMultipleOpen',
	];

	// SOURCE OF TRUTH: attributes = merged state (what you see in sidebar)
	// This is the simpler architecture - no complex cascade, just direct values
	const effectiveValues = attributes;

	// Calculate expected values: defaults + current theme deltas
	const currentTheme = themes[ attributes.currentTheme ];
	const expectedValues = currentTheme
		? applyDeltas( allDefaults, currentTheme.values || {} )
		: allDefaults;

	// Auto-detect customizations by comparing attributes to expected values
	const isCustomized = Object.keys( attributes ).some( ( key ) => {
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
		if ( typeof attrValue === 'object' && attrValue !== null ) {
			return JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
		}

		return attrValue !== expectedValue;
	} );

	debug( '[DEBUG] Accordion attributes (source of truth):', attributes );
	debug( '[DEBUG] Expected values (defaults + theme):', expectedValues );
	debug( '[DEBUG] Is customized:', isCustomized );
	console.log( '[THEME DEBUG] Current attributes.currentTheme:', attributes.currentTheme );
	console.log( '[THEME DEBUG] Themes loaded:', themes );
	console.log( '[THEME DEBUG] Is customized:', isCustomized );

	// SESSION-ONLY customization cache (not saved to database)
	// Stores snapshots PER THEME: { "": {...}, "Dark Mode": {...} }
	// Allows switching between themes and keeping customizations during session
	// Discarded on page reload (React state only)
	const [ sessionCache, setSessionCache ] = useState( {} );

	// Auto-update session cache for CURRENT theme
	useEffect( () => {
		const snapshot = getThemeableSnapshot( attributes, excludeFromCustomizationCheck );
		const currentThemeKey = attributes.currentTheme || '';

		setSessionCache( ( prev ) => ( {
			...prev,
			[ currentThemeKey ]: snapshot,
		} ) );
	}, [ attributes, excludeFromCustomizationCheck ] );

	/**
	 * Theme callback handlers
	 * @param themeName
	 */
	const handleSaveNewTheme = async ( themeName ) => {
		console.log( '[THEME CREATE DEBUG] Starting theme creation:', themeName );

		// Get current snapshot from session cache
		const currentThemeKey = attributes.currentTheme || '';
		const currentSnapshot = sessionCache[ currentThemeKey ] || {};
		console.log( '[THEME CREATE DEBUG] Current theme key:', currentThemeKey );
		console.log( '[THEME CREATE DEBUG] Current snapshot:', currentSnapshot );

		// Calculate deltas from current snapshot (optimized storage)
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );
		console.log( '[THEME CREATE DEBUG] Calculated deltas:', deltas );

		// Save theme with deltas only
		console.log( '[THEME CREATE DEBUG] Calling createTheme API...' );
		const createdTheme = await createTheme( 'accordion', themeName, deltas );
		console.log( '[THEME CREATE DEBUG] API response:', createdTheme );

		// Reset to clean theme: apply defaults + new theme deltas
		const newTheme = { values: deltas };
		const newExpectedValues = applyDeltas( allDefaults, newTheme.values || {} );
		const resetAttrs = { ...newExpectedValues, currentTheme: themeName };
		console.log( '[THEME CREATE DEBUG] New expected values:', newExpectedValues );
		console.log( '[THEME CREATE DEBUG] Reset attributes to set:', resetAttrs );

		// Remove excluded attributes
		excludeFromCustomizationCheck.forEach( ( key ) => {
			delete resetAttrs[ key ];
		} );

		console.log( '[THEME CREATE DEBUG] Calling setAttributes with:', resetAttrs );
		setAttributes( resetAttrs );

		// Clear session cache for old theme, new theme starts clean
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			console.log( '[THEME CREATE DEBUG] Updated session cache:', updated );
			return updated;
		} );

		console.log( '[THEME CREATE DEBUG] Theme creation completed' );
	};

	const handleUpdateTheme = async () => {
		// Get current snapshot from session cache
		const currentThemeKey = attributes.currentTheme || '';
		const currentSnapshot = sessionCache[ currentThemeKey ] || {};

		// Calculate deltas from current snapshot
		const deltas = calculateDeltas( currentSnapshot, allDefaults, excludeFromCustomizationCheck );

		// Update theme with new deltas
		await updateTheme( 'accordion', attributes.currentTheme, deltas );

		// Reset to updated theme: apply defaults + updated theme deltas
		const resetAttrs = { ...expectedValues };

		// Remove excluded attributes
		excludeFromCustomizationCheck.forEach( ( key ) => {
			delete resetAttrs[ key ];
		} );

		setAttributes( resetAttrs );

		// Clear session cache for this theme (now matches clean theme)
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
			return updated;
		} );
	};

	const handleDeleteTheme = async () => {
		await deleteTheme( 'accordion', attributes.currentTheme );
		setAttributes( { currentTheme: '' } );
	};

	const handleRenameTheme = async ( oldName, newName ) => {
		await renameTheme( 'accordion', oldName, newName );
		setAttributes( { currentTheme: newName } );
	};

	const handleResetCustomizations = () => {
		// Reset to clean theme: apply expected values (defaults + current theme)
		const resetAttrs = { ...expectedValues };

		// Remove excluded attributes from reset (keep structural/meta)
		excludeFromCustomizationCheck.forEach( ( key ) => {
			delete resetAttrs[ key ];
		} );

		setAttributes( resetAttrs );

		// Clear session cache for current theme
		const currentThemeKey = attributes.currentTheme || '';
		setSessionCache( ( prev ) => {
			const updated = { ...prev };
			delete updated[ currentThemeKey ];
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

		// Apply values
		const resetAttrs = { ...valuesToApply, currentTheme: newThemeName };

		// Remove excluded attributes
		excludeFromCustomizationCheck.forEach( ( key ) => {
			delete resetAttrs[ key ];
		} );

		setAttributes( resetAttrs );
	};

	/**
	 * Apply inline styles from effective values
	 */
	const getInlineStyles = () => {
		const titlePadding = effectiveValues.titlePadding || {
			top: 16,
			right: 16,
			bottom: 16,
			left: 16,
		};
		const contentPadding = effectiveValues.contentPadding || {
			top: 16,
			right: 16,
			bottom: 16,
			left: 16,
		};
		const borderRadius = effectiveValues.accordionBorderRadius || {
			topLeft: 4,
			topRight: 4,
			bottomLeft: 4,
			bottomRight: 4,
		};

		return {
			container: {
				border: `${ effectiveValues.accordionBorderThickness || 1 }px ${
					effectiveValues.accordionBorderStyle || 'solid'
				} ${ effectiveValues.accordionBorderColor || '#dddddd' }`,
				borderRadius: `${ borderRadius.topLeft }px ${ borderRadius.topRight }px ${ borderRadius.bottomRight }px ${ borderRadius.bottomLeft }px`,
				boxShadow: effectiveValues.accordionShadow || 'none',
				marginBottom: `${ effectiveValues.accordionMarginBottom || 8 }px`,
			},
			title: {
				backgroundColor: effectiveValues.titleBackgroundColor || '#f5f5f5',
				color: effectiveValues.titleColor || '#333333',
				fontSize: `${ effectiveValues.titleFontSize || 18 }px`,
				fontWeight: effectiveValues.titleFontWeight || '600',
				fontStyle: effectiveValues.titleFontStyle || 'normal',
				textTransform: effectiveValues.titleTextTransform || 'none',
				textDecoration: effectiveValues.titleTextDecoration || 'none',
				textAlign: effectiveValues.titleAlignment || 'left',
				padding: `${ titlePadding.top }px ${ titlePadding.right }px ${ titlePadding.bottom }px ${ titlePadding.left }px`,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				cursor: 'text',
				width: '100%',
				border: 'none',
			},
			content: {
				backgroundColor: effectiveValues.contentBackgroundColor || '#ffffff',
				color: effectiveValues.contentColor || '#333333',
				padding: `${ contentPadding.top }px ${ contentPadding.right }px ${ contentPadding.bottom }px ${ contentPadding.left }px`,
				borderTop:
					effectiveValues.dividerBorderThickness > 0
						? `${ effectiveValues.dividerBorderThickness }px ${
								effectiveValues.dividerBorderStyle || 'solid'
						  } ${ effectiveValues.dividerBorderColor || '#dddddd' }`
						: 'none',
			},
			icon: {
				fontSize: `${ effectiveValues.iconSize || effectiveValues.titleFontSize || 20 }px`,
				color: effectiveValues.iconColor || effectiveValues.titleColor || '#666666',
				display: effectiveValues.showIcon ? 'inline-block' : 'none',
			},
		};
	};

	const styles = getInlineStyles();

	/**
	 * Render icon based on settings
	 */
	const renderIcon = () => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed || '▾';
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
					} }
				/>
			);
		}

		return (
			<span className="accordion-icon" aria-hidden="true" style={ styles.icon }>
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

		const titleContent = (
			<div className="accordion-title-wrapper" style={ styles.title }>
				{ ( iconPosition === 'left' || iconPosition === 'extreme-left' ) && renderIcon() }
				<RichText
					tagName="span"
					value={ attributes.title || '' }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
					keepPlaceholderOnFocus={ false }
					className="accordion-title-text"
					style={ { flex: 1 } }
				/>
				{ ( iconPosition === 'right' || iconPosition === 'extreme-right' ) && renderIcon() }
			</div>
		);

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

	const blockProps = useBlockProps( {
		className: 'wp-block-accordion',
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

				<PanelBody title={ __( 'Accordion Settings', 'guttemberg-plus' ) } initialOpen={ true }>
					<ToggleControl
						label={ __( 'Initially Open', 'guttemberg-plus' ) }
						help={ __(
							'Whether the accordion starts expanded on page load',
							'guttemberg-plus'
						) }
						checked={ attributes.initiallyOpen || false }
						onChange={ ( value ) => setAttributes( { initiallyOpen: value } ) }
					/>

					<ToggleControl
						label={ __( 'Allow Multiple Open', 'guttemberg-plus' ) }
						help={ __(
							'Allow multiple accordion items to be open simultaneously',
							'guttemberg-plus'
						) }
						checked={ attributes.allowMultipleOpen || false }
						onChange={ ( value ) => setAttributes( { allowMultipleOpen: value } ) }
					/>
				</PanelBody>

				<HeaderColorsPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="accordion"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				<ContentColorsPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="accordion"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				<TypographyPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="accordion"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				<BorderPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="accordion"
					theme={ themes[ attributes.currentTheme ]?.values }
					cssDefaults={ cssDefaults }
				/>

				<IconPanel
					effectiveValues={ effectiveValues }
					attributes={ attributes }
					setAttributes={ setAttributes }
					blockType="accordion"
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
