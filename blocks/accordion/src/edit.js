/**
 * Accordion Block - Edit Component
 *
 * Editor interface for accordion block with full theme integration.
 * Uses shared UI components and cascade resolution.
 *
 * IMPORTANT: Sections marked with AUTO-GENERATED comments are automatically
 * regenerated from the schema on every build. Do not edit code between these markers.
 *
 * To modify styles:
 * 1. Edit the schema: schemas/accordion.json
 * 2. Run: npm run schema:build
 * 3. The code between markers will update automatically
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, SelectControl } from '@wordpress/components';
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
} from '@shared';
import accordionSchema from '../../../schemas/accordion.json';
import { accordionAttributes } from './accordion-attributes';
import './editor.scss';

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

	// Load themes using shared hook
	const {
		themes,
		themesLoaded,
		createTheme,
		updateTheme,
		deleteTheme,
		renameTheme,
	} = useBlockThemes( 'accordion' );

	// Extract schema defaults from accordionAttributes (SINGLE SOURCE OF TRUTH!)
	const schemaDefaults = useMemo( () => {
		const defaults = {};
		Object.keys( accordionAttributes ).forEach( ( key ) => {
			if ( accordionAttributes[ key ].default !== undefined ) {
				defaults[ key ] = accordionAttributes[ key ].default;
			}
		} );
		return defaults;
	}, [] );

	// All defaults come from schema - single source of truth!
	const allDefaults = useMemo( () => {
		return getAllDefaults( schemaDefaults );
	}, [ schemaDefaults ] );

	// Use shared theme state hook
	const {
		sessionCache,
		setSessionCache,
		expectedValues,
		isCustomized,
		excludeFromCustomizationCheck,
	} = useThemeState( {
		blockType: 'accordion',
		attributes,
		themes,
		themesLoaded,
		allDefaults,
		schema: accordionSchema,
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
		blockType: 'accordion',
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

	// Local state for width input (allows typing without validation)
	const [ widthInput, setWidthInput ] = useState( attributes.accordionWidth || '100%' );

	// Sync local input state when attribute changes externally
	useEffect( () => {
		const newWidth = attributes.accordionWidth || '100%';
		setWidthInput( newWidth );
	}, [ attributes.accordionWidth ] );

	// Auto-update customizations attribute (deltas from expected values)
	// This is used by save.js to output ONLY true customizations as inline CSS
	useEffect( () => {
		const newCustomizations = {};

		Object.keys( attributes ).forEach( ( key ) => {
			if ( excludeFromCustomizationCheck.includes( key ) ) {
				return;
			}

			const attrValue = attributes[ key ];
			const expectedValue = expectedValues[ key ];

			if ( attrValue === undefined || attrValue === null ) {
				return;
			}

			let isDifferent = false;
			if ( typeof attrValue === 'object' && attrValue !== null ) {
				isDifferent = JSON.stringify( attrValue ) !== JSON.stringify( expectedValue );
			} else {
				isDifferent = attrValue !== expectedValue;
			}

			if ( isDifferent ) {
				newCustomizations[ key ] = attrValue;
			}
		} );

		const currentCustomizations = attributes.customizations || {};
		const newStr = JSON.stringify( newCustomizations );
		const currentStr = JSON.stringify( currentCustomizations );

		if ( newStr !== currentStr ) {
			debug( '[CUSTOMIZATIONS] Updating customizations attribute:', newCustomizations );
			setAttributes( { customizations: newCustomizations } );
		}
	}, [ attributes, expectedValues, excludeFromCustomizationCheck, setAttributes ] );

	debug( '[DEBUG] Accordion attributes (source of truth):', attributes );
	debug( '[DEBUG] Expected values (defaults + theme):', expectedValues );
	debug( '[DEBUG] Is customized:', isCustomized );

	/**
	 * Apply inline styles from effective values
	 */
	/* ========== AUTO-GENERATED-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// AUTO-GENERATED from schemas/accordion.json
// To modify styles, update the schema and run: npm run schema:build

const getInlineStyles = () => {
  // Extract object-type attributes with fallbacks
	const borderRadius = effectiveValues.borderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 4,
		    "bottomLeft": 4
		};

	return {
		container: {
			borderColor: effectiveValues.borderColor || '#dddddd',
			borderWidth: `${effectiveValues.borderWidth || 1}px`,
			borderStyle: effectiveValues.borderStyle || 'solid',
			borderRadius: `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`,
			boxShadow: effectiveValues.shadow || 'none',
		},
		title: {
			color: effectiveValues.titleColor || '#333333',
			backgroundColor: effectiveValues.titleBackgroundColor || '#f5f5f5',
			fontSize: `${effectiveValues.titleFontSize || 18}px`,
			fontWeight: effectiveValues.titleFontWeight || '600',
			fontStyle: effectiveValues.titleFontStyle || 'normal',
			textTransform: effectiveValues.titleTextTransform || 'none',
			textDecoration: effectiveValues.titleTextDecoration || 'none',
			textAlign: effectiveValues.titleAlignment || 'left',
		},
		content: {
			color: effectiveValues.contentColor || '#333333',
			backgroundColor: effectiveValues.contentBackgroundColor || '#ffffff',
			borderTopColor: effectiveValues.dividerColor || '#dddddd',
			fontSize: `${effectiveValues.contentFontSize || 16}px`,
			fontWeight: effectiveValues.contentFontWeight || 'null',
			borderTopWidth: `${effectiveValues.dividerWidth || 0}px`,
			borderTopStyle: effectiveValues.dividerStyle || 'solid',
		},
		icon: {
			color: effectiveValues.iconColor || '#666666',
			fontSize: `${effectiveValues.iconSize || 20}px`,
			transform: `${effectiveValues.iconRotation || 180}deg`,
		},
	};
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

	const styles = getInlineStyles();

	/**
	 * Render icon based on settings
	 * @param {string} position - Icon position ('left', 'right', 'extreme-left', 'extreme-right')
	 */
	const renderIcon = ( position = 'right' ) => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed || '▾';
		const isImage = iconContent.startsWith( 'http' );

		// Determine margin based on position
		const isLeftPosition = position === 'left' || position === 'extreme-left';
		const iconStyle = {
			...styles.icon,
			margin: isLeftPosition ? '0 8px 0 0' : '0 0 0 8px', // right margin if left, left margin if right
		};

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
						...( isLeftPosition ? { marginRight: '8px' } : { marginLeft: '8px' } ),
					} }
				/>
			);
		}

		return (
			<span className="accordion-icon" aria-hidden="true" style={ iconStyle }>
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
		const titleAlignment = effectiveValues.titleAlignment || 'left';

		// Build title content - icon position affects layout structure
		let titleContent;


		if ( iconPosition === 'extreme-left' ) {
			// Extreme left: icon on left, text grows and aligns within its space
			// Wrap text in a container that grows and handles text alignment
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: 'flex-start' } }>
					{ renderIcon( iconPosition ) }
					<div style={ { flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'center' } }>
						<RichText
							tagName="span"
							value={ attributes.title || '' }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
							className="accordion-title-text"
							style={ { textAlign: titleAlignment, flex: '1 1 auto', minWidth: 0 } }
						/>
					</div>
				</div>
			);
		} else if ( iconPosition === 'extreme-right' ) {
			// Extreme right: text grows and aligns within its space, icon on right
			// Wrap text in a container that grows and handles text alignment
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: 'flex-start' } }>
					<div style={ { flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'center' } }>
						<RichText
							tagName="span"
							value={ attributes.title || '' }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
							className="accordion-title-text"
							style={ { textAlign: titleAlignment, flex: '1 1 auto', minWidth: 0 } }
						/>
					</div>
					{ renderIcon( iconPosition ) }
				</div>
			);
		} else if ( iconPosition === 'left' ) {
			// Left of text: wrap icon+text together, then center/align that group
			const textGroup = (
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: titleAlignment } }>
					{ renderIcon( iconPosition ) }
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
						style={ { textAlign: titleAlignment } }
					/>
				</div>
			);
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: titleAlignment } }>
					{ textGroup }
				</div>
			);
		} else {
			// Right of text: wrap text+icon together, then center/align that group
			const textGroup = (
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: titleAlignment } }>
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
						style={ { textAlign: titleAlignment } }
					/>
					{ renderIcon( iconPosition ) }
				</div>
			);
			titleContent = (
				<div className="accordion-title-wrapper" style={ { ...styles.title, justifyContent: titleAlignment } }>
					{ textGroup }
				</div>
			);
		}

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


	// Validate width input - accepts pixels or percentage
	const validateWidth = ( value ) => {
		if ( ! value || value.trim() === '' ) {
			return '100%';
		}

		// Trim whitespace
		value = value.trim();

		// Check if it's a valid pixel value (number followed by 'px')
		const pxMatch = value.match( /^(\d+(?:\.\d+)?)px$/i );
		if ( pxMatch ) {
			return value;
		}

		// Check if it's a valid percentage (number followed by '%')
		const percentMatch = value.match( /^(\d+(?:\.\d+)?)%$/i );
		if ( percentMatch ) {
			return value;
		}

		// Check if it's just a number (assume pixels)
		const numberMatch = value.match( /^(\d+(?:\.\d+)?)$/ );
		if ( numberMatch ) {
			return `${ value }px`;
		}

		// Invalid format - default to 100%
		return '100%';
	};

	// Build inline styles for width control
	const editorStyles = {
		width: effectiveValues.accordionWidth || '100%',
	};

	const blockProps = useBlockProps( {
		className: 'wp-block-accordion sammu-blocks',
		style: editorStyles,
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

				{/* Auto-generated panels from schema */}
				<SchemaPanels
					schema={ accordionSchema }
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
