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
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

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

	// Resolve effective values through cascade (pure cascade - no normalization)
	// Source of truth: CSS defaults -> Theme values -> Block customizations
	const effectiveValues = getAllEffectiveValues(
		attributes,
		themes[ attributes.currentTheme ]?.values || {},
		cssDefaults
	);

	debug( '[DEBUG] Effective values (pure cascade):', effectiveValues );

	// Check if block has customizations using proper cascade comparison
	// Attributes to exclude from customization check (non-style attributes)
	const excludeFromCustomizationCheck = [
		'accordionId',
		'title',
		'content',
		'currentTheme',
		'customizationCache',
		'initiallyOpen',
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
	const handleSaveNewTheme = ( themeName ) => {
		createTheme( 'accordion', themeName, effectiveValues );
		setAttributes( { currentTheme: themeName } );
	};

	const handleUpdateTheme = () => {
		updateTheme( 'accordion', attributes.currentTheme, effectiveValues );
	};

	const handleDeleteTheme = () => {
		deleteTheme( 'accordion', attributes.currentTheme );
		setAttributes( { currentTheme: '' } );
	};

	const handleRenameTheme = ( oldName, newName ) => {
		renameTheme( 'accordion', oldName, newName );
		setAttributes( { currentTheme: newName } );
	};

	const handleResetCustomizations = () => {
		// Reset all customizable attributes to undefined/null
		const resetAttrs = {};
		Object.keys( attributes ).forEach( ( key ) => {
			if (
				key !== 'currentTheme' &&
				key !== 'title' &&
				key !== 'content' &&
				key !== 'accordionId' &&
				key !== 'customizationCache' &&
				key !== 'initiallyOpen'
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
					/>
				</div>

				<PanelBody title={ __( 'Settings', 'guttemberg-plus' ) } initialOpen={ true }>
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

				<ColorPanel
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
					<div className="accordion-loading">
						<p>{ __( 'Loading themes…', 'guttemberg-plus' ) }</p>
					</div>
				) }

				{ themesLoaded && (
					<div className="accordion-item" style={ styles.container }>
						{ renderTitle() }

						<div className="accordion-content" style={ styles.content }>
							<RichText
								tagName="div"
								value={ attributes.content || '' }
								onChange={ ( value ) => setAttributes( { content: value } ) }
								placeholder={ __( 'Add accordion content…', 'guttemberg-plus' ) }
								className="accordion-content-text"
							/>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
