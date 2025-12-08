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
	ThemeSelector,
	SchemaPanels,
	CustomizationWarning,
	useThemeManager,
	debug,
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
		blockType: 'accordion',
		schema: accordionSchema,
		attributes,
		setAttributes,
		allDefaults,
	} );

	// SOURCE OF TRUTH: attributes = merged state (what you see in sidebar)
	const effectiveValues = attributes;

	debug( '[DEBUG] Accordion attributes (source of truth):', attributes );
	debug( '[DEBUG] Expected values (defaults + theme):', expectedValues );
	debug( '[DEBUG] Is customized:', isCustomized );

	// Local state for width input (allows typing without validation)
	const [ widthInput, setWidthInput ] = useState( attributes.accordionWidth || '100%' );

	// Sync local input state when attribute changes externally
	useEffect( () => {
		const newWidth = attributes.accordionWidth || '100%';
		setWidthInput( newWidth );
	}, [ attributes.accordionWidth ] );

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
	 * Structure matches frontend: accordion-title-wrapper > accordion-title (button-like div)
	 */
	const renderTitle = () => {
		const headingLevel = effectiveValues.headingLevel || 'none';
		const iconPosition = effectiveValues.iconPosition || 'right';
		const titleAlignment = effectiveValues.titleAlignment || 'left';

		// Determine icon position class
		const iconPositionClass = iconPosition ? `icon-${ iconPosition }` : 'icon-right';

		// Build inner content based on icon position
		let innerContent;

		if ( iconPosition === 'extreme-left' ) {
			innerContent = (
				<>
					{ renderIcon( iconPosition ) }
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
					/>
				</>
			);
		} else if ( iconPosition === 'extreme-right' ) {
			innerContent = (
				<>
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
					/>
					{ renderIcon( iconPosition ) }
				</>
			);
		} else if ( iconPosition === 'left' ) {
			innerContent = (
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: titleAlignment } }>
					{ renderIcon( iconPosition ) }
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
					/>
				</div>
			);
		} else {
			// Right of text (default)
			innerContent = (
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: titleAlignment } }>
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
					/>
					{ renderIcon( iconPosition ) }
				</div>
			);
		}

		// The accordion-title div mimics the button structure from save.js
		const titleElement = (
			<div
				className={ `accordion-title ${ iconPositionClass }` }
				style={ {
					...styles.title,
					padding: '1rem 1.5rem',
					justifyContent: ( iconPosition === 'extreme-left' || iconPosition === 'extreme-right' ) ? 'space-between' : titleAlignment,
				} }
			>
				{ innerContent }
			</div>
		);

		// Wrap in heading if needed
		const wrappedTitle = headingLevel !== 'none' ? (
			<span className="accordion-heading" style={ { margin: 0, display: 'block' } }>
				{ titleElement }
			</span>
		) : titleElement;

		return (
			<div className="accordion-title-wrapper">
				{ wrappedTitle }
			</div>
		);
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

	// Build inline styles - accordion-item is now the root element
	// Combines wrapper styles (width) with item styles (borders, shadows)
	const rootStyles = {
		width: effectiveValues.accordionWidth || '100%',
		...styles.container,
	};

	const blockProps = useBlockProps( {
		className: 'accordion-item wp-block-accordion sammu-blocks',
		style: rootStyles,
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
					<>
						{ renderTitle() }

						<div className="accordion-content" style={ { ...styles.content, padding: '1rem 1.5rem' } }>
							<InnerBlocks
								templateLock={ false }
								placeholder={ __( 'Add accordion content…', 'guttemberg-plus' ) }
							/>
						</div>
					</>
				) }
			</div>
		</>
	);
}
