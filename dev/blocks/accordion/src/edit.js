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
import { useEffect, useState, useMemo, useRef } from '@wordpress/element';

import {
	generateUniqueId,
	getAllDefaults,
	ThemeSelector,
	TabbedInspector,
	SettingsPanels,
	AppearancePanels,
	CustomizationWarning,
	BreakpointSettings,
	useThemeManager,
	useBlockAlignment,
	useResponsiveDevice,
} from '@shared';
import { buildBoxShadow, buildTextShadow } from '@shared/utils';
import accordionSchema from '../../../schemas/accordion.json';
import { accordionAttributes } from './accordion-attributes';
import { formatCssValue, getCssVarName } from '@shared/config/css-var-mappings-generated';

/**
 * Accordion Edit Component
 *
 * @param {Object}   props               Block props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Attribute setter
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Edit component
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	// Use centralized alignment hook
	const blockRef = useBlockAlignment( attributes.accordionHorizontalAlign );
	const responsiveDevice = useResponsiveDevice();

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

	// Local state for width input (allows typing without validation)
	const [ widthInput, setWidthInput ] = useState( attributes.accordionWidth || '100%' );

	// Sync local input state when attribute changes externally
	useEffect( () => {
		const newWidth = attributes.accordionWidth || '100%';
		setWidthInput( newWidth );
	}, [ attributes.accordionWidth ] );

	/**
	 * Generate CSS variables from effective values for editor preview
	 */
	const getEditorCSSVariables = () => {
		const cssVars = {};

		Object.entries(effectiveValues).forEach(([attrName, value]) => {
			if (value === null || value === undefined) {
				return;
			}

			const cssVar = getCssVarName(attrName, 'accordion');
			if (!cssVar) {
				return;
			}

			// Format the value (formatCssValue handles compound values like border-style objects)
			const formattedValue = formatCssValue(attrName, value, 'accordion');
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
// AUTO-GENERATED from schemas/accordion.json
// To modify styles, update the schema and run: npm run schema:build
// REQUIRED IMPORT: Ensure buildBoxShadow, buildTextShadow imported from @shared/utils in edit.js

const getInlineStyles = (responsiveDevice = 'global') => {
  // Extract object-type attributes with fallbacks
	const dividerWidth = effectiveValues.dividerWidth || {
		    "top": "0px",
		    "right": "0px",
		    "bottom": "0px",
		    "left": "0px"
		};
	const dividerColor = effectiveValues.dividerColor || {
		    "top": "#dddddd",
		    "right": "#dddddd",
		    "bottom": "#dddddd",
		    "left": "#dddddd",
		    "linked": true
		};
	const dividerStyle = effectiveValues.dividerStyle || {
		    "top": "solid",
		    "right": "solid",
		    "bottom": "solid",
		    "left": "solid",
		    "linked": true
		};
	const borderWidth = effectiveValues.borderWidth || {
		    "top": "1px",
		    "right": "1px",
		    "bottom": "1px",
		    "left": "1px"
		};
	const borderRadius = effectiveValues.borderRadius || {
		    "topLeft": "4px",
		    "topRight": "4px",
		    "bottomRight": "4px",
		    "bottomLeft": "4px"
		};
	const borderColor = effectiveValues.borderColor || {
		    "top": "#dddddd",
		    "right": "#dddddd",
		    "bottom": "#dddddd",
		    "left": "#dddddd",
		    "linked": true
		};
	const borderStyle = effectiveValues.borderStyle || {
		    "top": "solid",
		    "right": "solid",
		    "bottom": "solid",
		    "left": "solid",
		    "linked": true
		};
	const headerPadding = effectiveValues.headerPadding || {
		    "top": "12px",
		    "right": "16px",
		    "bottom": "12px",
		    "left": "16px"
		};
	const contentPadding = effectiveValues.contentPadding || {
		    "top": "16px",
		    "right": "16px",
		    "bottom": "16px",
		    "left": "16px"
		};
	const blockMargin = effectiveValues.blockMargin || {
		    "top": "1em",
		    "right": "0em",
		    "bottom": "1em",
		    "left": "0em"
		};

	return {
		container: {
			borderRadius: `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`,
			boxShadow: buildBoxShadow(effectiveValues.shadow),
			marginTop: (() => { const blockMarginVal = blockMargin[responsiveDevice] || blockMargin; return `${blockMarginVal.top || 0}${blockMarginVal.unit || 'px'}`; })(),
			marginBottom: (() => { const blockMarginVal = blockMargin[responsiveDevice] || blockMargin; return `${blockMarginVal.bottom || 0}${blockMarginVal.unit || 'px'}`; })(),
			transitionDuration: (() => { const val = effectiveValues.animationDuration; if (val === null || val === undefined) return '300ms'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '300ms'; })(),
			transitionTimingFunction: (() => { const val = effectiveValues.animationEasing; if (val === null || val === undefined) return 'ease'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'ease'; })(),
		},
		title: {
			padding: (() => { const headerPaddingVal = headerPadding[responsiveDevice] || headerPadding; const unit = headerPaddingVal.unit || 'px'; return `${headerPaddingVal.top || 0}${unit} ${headerPaddingVal.right || 0}${unit} ${headerPaddingVal.bottom || 0}${unit} ${headerPaddingVal.left || 0}${unit}`; })(),
			color: (() => { const val = effectiveValues.titleColor; if (val === null || val === undefined) return '#333333'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '#333333'; })(),
			background: (() => { const val = effectiveValues.titleBackgroundColor; if (val === null || val === undefined) return '#f5f5f5'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '#f5f5f5'; })(),
			fontFamily: (() => { const val = effectiveValues.titleFontFamily; if (val === null || val === undefined) return 'inherit'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'inherit'; })(),
			fontSize: (() => { const val = effectiveValues.titleFontSize; if (val === null || val === undefined) return '1.125rem'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '1.125rem'; })(),
			fontWeight: effectiveValues.titleFontWeight ?? 400,
			textDecorationColor: (() => { const val = effectiveValues.titleDecorationColor; if (val === null || val === undefined) return 'currentColor'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'currentColor'; })(),
			textDecorationStyle: (() => { const val = effectiveValues.titleDecorationStyle; if (val === null || val === undefined) return 'solid'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'solid'; })(),
			textDecorationThickness: (() => { const val = effectiveValues.titleDecorationWidth; if (val === null || val === undefined) return 'auto'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'auto'; })(),
			letterSpacing: (() => { const val = effectiveValues.titleLetterSpacing; if (val === null || val === undefined) return '0em'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '0em'; })(),
			textTransform: (() => { const val = effectiveValues.titleTextTransform; if (val === null || val === undefined) return 'none'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'none'; })(),
			lineHeight: effectiveValues.titleLineHeight ?? 1.4,
			textAlign: (() => { const val = effectiveValues.titleAlignment; if (val === null || val === undefined) return 'left'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'left'; })(),
			left: (() => { const val = effectiveValues.titleOffsetX; if (val === null || val === undefined) return '0px'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '0px'; })(),
			top: (() => { const val = effectiveValues.titleOffsetY; if (val === null || val === undefined) return '0px'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '0px'; })(),
			textShadow: buildTextShadow(effectiveValues.titleTextShadow),
		},
		content: {
			padding: (() => { const contentPaddingVal = contentPadding[responsiveDevice] || contentPadding; const unit = contentPaddingVal.unit || 'px'; return `${contentPaddingVal.top || 0}${unit} ${contentPaddingVal.right || 0}${unit} ${contentPaddingVal.bottom || 0}${unit} ${contentPaddingVal.left || 0}${unit}`; })(),
			color: (() => { const val = effectiveValues.contentTextColor; if (val === null || val === undefined) return '#333333'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '#333333'; })(),
			background: (() => { const val = effectiveValues.contentBackgroundColor; if (val === null || val === undefined) return '#ffffff'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '#ffffff'; })(),
			fontFamily: (() => { const val = effectiveValues.contentFontFamily; if (val === null || val === undefined) return 'inherit'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'inherit'; })(),
			fontSize: (() => { const val = effectiveValues.contentFontSize; if (val === null || val === undefined) return '1rem'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '1rem'; })(),
			lineHeight: effectiveValues.contentLineHeight ?? 1.6,
		},
		icon: {
			color: (() => { const val = effectiveValues.iconColor; if (val === null || val === undefined) return '#666666'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '#666666'; })(),
			fontSize: (() => { const val = effectiveValues.iconSize; if (val === null || val === undefined) return '1.25rem'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '1.25rem'; })(),
			transform: (() => { const val = effectiveValues.iconRotation; if (val === null || val === undefined) return '180deg'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '180deg'; })(),
		},
	};
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

	const styles = getInlineStyles( responsiveDevice );
	console.log('[ACCORDION] responsiveDevice:', responsiveDevice, 'styles.title.fontSize:', styles.title.fontSize, 'styles.title.left:', styles.title.left, 'styles.title.top:', styles.title.top);

	// Build font-weight from formatting selection
	const titleFormatting = effectiveValues.titleFormatting || [];
	const fontWeight = titleFormatting.includes('bold')
		? (effectiveValues.titleFontWeight || 400)
		: 400;

	// Build font-style from formatting selection
	const fontStyle = titleFormatting.includes('italic')
		? 'italic'
		: 'normal';

	// Build text-decoration from formatting selection
	const decorationLines = titleFormatting.filter(f =>
		['underline', 'overline', 'line-through'].includes(f)
	);
	const hasDecoration = decorationLines.length > 0;
	const textDecorationLine = hasDecoration
		? decorationLines.join(' ')
		: 'none';

	// Build formatting styles object to merge with title styles
	const titleFormattingStyles = {
		fontWeight,
		fontStyle,
		textDecorationLine,
		textDecorationColor: hasDecoration
			? (effectiveValues.titleDecorationColor || 'currentColor')
			: undefined,
		textDecorationStyle: hasDecoration
			? (effectiveValues.titleDecorationStyle || 'solid')
			: undefined,
		textDecorationThickness: hasDecoration
			? (effectiveValues.titleDecorationWidth || 'auto')
			: undefined,
	};

	/**
	 * Render icon based on settings
	 * @param {string} position - Icon position ('left', 'right', 'extreme-left', 'extreme-right')
	 */
	const renderIcon = ( position = 'right' ) => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed;
		const isImage = iconContent.startsWith( 'http' );

		const iconStyle = {
			...styles.icon,
		};

		if ( isImage ) {
			return (
				<img
					src={ iconContent }
					alt=""
					aria-hidden="true"
					className="accordion-icon accordion-icon-image"
					style={ iconStyle }
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
		const headingLevel = effectiveValues.headingLevel;
		const iconPosition = effectiveValues.iconPosition;
		const titleAlignment = effectiveValues.titleAlignment || 'left';

		// Determine icon position class
		const iconPositionClass = iconPosition ? `icon-${ iconPosition }` : 'icon-right';
		const titleAlignClass = titleAlignment ? `title-align-${ titleAlignment }` : 'title-align-left';
		const iconElement = renderIcon( iconPosition );
		const hasIcon = !! iconElement;

		// Build inner content based on icon position
		let innerContent;

		if ( iconPosition === 'extreme-left' ) {
			innerContent = (
				<>
					{ hasIcon && (
						<span className="accordion-icon-slot">
							{ iconElement }
						</span>
					) }
					<div className="accordion-title-text-wrapper">
						<RichText
							tagName="span"
							value={ attributes.title || '' }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
							className="accordion-title-text"
						/>
					</div>
				</>
			);
		} else if ( iconPosition === 'extreme-right' ) {
			innerContent = (
				<>
					<div className="accordion-title-text-wrapper">
						<RichText
							tagName="span"
							value={ attributes.title || '' }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
							className="accordion-title-text"
						/>
					</div>
					{ hasIcon && (
						<span className="accordion-icon-slot">
							{ iconElement }
						</span>
					) }
				</>
			);
		} else if ( iconPosition === 'left' ) {
			innerContent = (
				<div className="accordion-title-inline">
					{ hasIcon && iconElement }
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
				<div className="accordion-title-inline">
					<RichText
						tagName="span"
						value={ attributes.title || '' }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Accordion title…', 'guttemberg-plus' ) }
						className="accordion-title-text"
					/>
					{ hasIcon && iconElement }
				</div>
			);
		}

		// The accordion-title div mimics the button structure from save.js
		const titleElement = (
			<div
				className={ `accordion-title ${ iconPositionClass } ${ titleAlignClass }` }
				style={ {
					...styles.title,
					...titleFormattingStyles,
				} }
			>
				{ innerContent }
			</div>
		);

		// Wrap in heading if needed - use actual heading tags for TOC detection
		let wrappedTitle = titleElement;
		if ( headingLevel !== 'none' ) {
			const HeadingTag = headingLevel;
			wrappedTitle = (
				<HeadingTag className="accordion-heading heading-reset">
					{ titleElement }
				</HeadingTag>
			);
		}

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

	/**
	 * Format dimension value (width/height) with proper unit
	 * Handles both number and { value, unit } object formats
	 * Uses responsiveDevice to extract device-specific values
	 *
	 * Data structure:
	 * - Base (desktop): stored at root level as value.value or string
	 * - Tablet/Mobile: stored under value.tablet / value.mobile keys
	 */
	const formatDimensionValue = ( value, defaultUnit = '%' ) => {
		if ( value === null || value === undefined ) {
			return `100${ defaultUnit }`;
		}
		// Handle responsive structure - extract value for current device
		if ( typeof value === 'object' && ( value.tablet !== undefined || value.mobile !== undefined ) ) {
			// Global uses base value (value.value), tablet/mobile check their key first
			const deviceValue = responsiveDevice === 'global'
				? value.value
				: ( value[ responsiveDevice ] ?? value.value );
			return formatDimensionValue( deviceValue, defaultUnit );
		}
		// Handle { value, unit } object format
		if ( typeof value === 'object' && value.value !== undefined ) {
			return `${ value.value }${ value.unit || defaultUnit }`;
		}
		// Handle plain number
		if ( typeof value === 'number' ) {
			return `${ value }${ defaultUnit }`;
		}
		// Handle string (already formatted)
		return String( value );
	};

	// Build inline styles - accordion-item is now the root element
	// Combines wrapper styles (width) with item styles (borders, shadows)
	// Note: alignment margins are applied via ref with !important
	const editorCSSVars = getEditorCSSVariables();
	const rootStyles = {
		width: formatDimensionValue( effectiveValues.accordionWidth, '%' ),
		overflow: 'hidden', // Clip border-radius in editor
		...editorCSSVars, // Apply all CSS variables (including decomposed ones!)
		...styles.container, // Apply container styles (margin, radius, box effects)
	};

	// Build class names - match frontend structure
	const classNames = [ 'gutplus-accordion' ];

	// Add alignment class (same as frontend)
	const alignmentClass = attributes.accordionHorizontalAlign
		? `gutplus-align-${ attributes.accordionHorizontalAlign }`
		: 'gutplus-align-left';
	classNames.push( alignmentClass );

	const blockProps = useBlockProps( {
		className: classNames.join( ' ' ),
		style: rootStyles,
		ref: blockRef,
		'data-gutplus-device': responsiveDevice,
	} );

	return (
		<>
			{/* Make Gutenberg's blue selection outline follow accordion's border-radius */}
			<style>
				{`
					.block-editor-block-list__block.is-selected.accordion-item::after {
						border-radius: var(--accordion-border-radius, 4px) !important;
					}
				`}
			</style>
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

				{/* Tabbed inspector with settings and appearance panels */}
				<TabbedInspector
					settingsContent={
						<>
							<SettingsPanels
								schema={ accordionSchema }
								attributes={ attributes }
								setAttributes={ setAttributes }
								effectiveValues={ effectiveValues }
								theme={ themes[ attributes.currentTheme ]?.values }
								cssDefaults={ allDefaults }
							/>
							<BreakpointSettings />
						</>
					}
					appearanceContent={
						<AppearancePanels
							schema={ accordionSchema }
							attributes={ attributes }
							setAttributes={ setAttributes }
							effectiveValues={ effectiveValues }
							theme={ themes[ attributes.currentTheme ]?.values }
							cssDefaults={ allDefaults }
						/>
					}
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

						<div className="accordion-content" style={ { ...styles.content } }>
							<div className="accordion-content-inner">
								<InnerBlocks
									templateLock={ false }
									placeholder={ __( 'Add accordion content…', 'guttemberg-plus' ) }
								/>
							</div>
						</div>
					</>
				) }
			</div>
		</>
	);
}
