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
import { Dashicon } from '@wordpress/components';
import * as LucideIcons from 'lucide-react';
import { buildBoxShadow, buildTextShadow } from '@shared/utils';
import accordionSchema from '../../../schemas/expanded/accordion-expanded.json';
import { accordionAttributes } from './accordion-attributes';
import { buildEditorCssVars } from '@shared/styles/accordion-css-vars-generated';

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
		    "top": 0,
		    "right": 0,
		    "bottom": 0,
		    "left": 0,
		    "unit": "px"
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
		    "top": 1,
		    "right": 1,
		    "bottom": 1,
		    "left": 1,
		    "unit": "px"
		};
	const borderRadius = effectiveValues.borderRadius || {
		    "topLeft": 4,
		    "topRight": 4,
		    "bottomRight": 4,
		    "bottomLeft": 4,
		    "unit": "px"
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
		    "top": 12,
		    "right": 16,
		    "bottom": 12,
		    "left": 16,
		    "unit": "px"
		};
	const contentPadding = effectiveValues.contentPadding || {
		    "top": 16,
		    "right": 16,
		    "bottom": 16,
		    "left": 16,
		    "unit": "px"
		};
	const blockMargin = effectiveValues.blockMargin || {
		    "top": 1,
		    "right": 0,
		    "bottom": 1,
		    "left": 0,
		    "unit": "em"
		};
	const iconInactiveSource = effectiveValues.iconInactiveSource || {
		    "kind": "char",
		    "value": "▾"
		};
	const iconActiveSource = effectiveValues.iconActiveSource || {
		    "kind": "char",
		    "value": "▾"
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
		},
		titleText: {
			fontFamily: (() => { const val = effectiveValues.titleFontFamily; if (val === null || val === undefined) return 'inherit'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'inherit'; })(),
			fontSize: (() => { const val = effectiveValues.titleFontSize; if (val === null || val === undefined) return '1.125rem'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '1.125rem'; })(),
			whiteSpace: (() => { const val = effectiveValues.titleNoLineBreak; if (val === null || val === undefined) return 'normal'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return 'normal'; })(),
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
			display: effectiveValues.showIcon ? 'flex' : 'none',
			transform: `rotate(${effectiveValues.iconRotation ?? '180deg'})`,
			color: (() => { const val = effectiveValues.iconInactiveColor; if (val === null || val === undefined) return '#333333'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return `${val.value}${val.unit || ''}`; } return '#333333'; })(),
			fontSize: (() => { const val = effectiveValues.iconInactiveSize; if (val === null || val === undefined) return '16px'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '16px'; })(),
			maxWidth: (() => { const val = effectiveValues.iconInactiveMaxSize; if (val === null || val === undefined) return '24px'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '24px'; })(),
			left: (() => { const val = effectiveValues.iconInactiveOffsetX; if (val === null || val === undefined) return '0px'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '0px'; })(),
			top: (() => { const val = effectiveValues.iconInactiveOffsetY; if (val === null || val === undefined) return '0px'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return `${deviceVal.value}${deviceVal.unit || ''}`; } return deviceVal; } if (val.value !== undefined) { return `${val.value}${val.unit || ''}`; } } return '0px'; })(),
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

	const titleTextInlineStyles = effectiveValues.titleNoLineBreak === 'nowrap'
		? { whiteSpace: 'nowrap' }
		: undefined;

	/**
	 * Helper: Get responsive value based on current device
	 * @param {*} value - Value that might be responsive (object with global/tablet/mobile keys)
	 * @param {string} device - Current device ('global', 'tablet', 'mobile')
	 * @return {*} Resolved value for current device
	 */
	const getResponsiveValue = ( value, device ) => {
		if ( typeof value === 'object' && value !== null && ! Array.isArray( value ) ) {
			// Check if it's a responsive object (has global/tablet/mobile keys)
			if ( value.global !== undefined || value.tablet !== undefined || value.mobile !== undefined ) {
				return value[ device ] !== undefined ? value[ device ] : value.global;
			}
		}
		return value;
	};

	/**
	 * Render library icon (Dashicons or Lucide)
	 * @param {string} iconValue - Format: "library:iconName" (e.g., "dashicons:arrow-down")
	 * @return {JSX.Element|null} Icon element
	 */
	const renderLibraryIcon = ( iconValue ) => {
		if ( ! iconValue || typeof iconValue !== 'string' ) {
			return null;
		}

		const [ library, iconName ] = iconValue.split( ':' );

		if ( library === 'dashicons' && iconName ) {
			// Dashicon component needs explicit size styling
			return <Dashicon icon={ iconName } style={ { fontSize: 'inherit', width: '1em', height: '1em' } } />;
		}

		if ( library === 'lucide' && iconName ) {
			const LucideIcon = LucideIcons[ iconName ];
			return LucideIcon ? <LucideIcon size="1em" /> : null;
		}

		return null;
	};

	/**
	 * Render a single icon element based on kind and state
	 *
	 * IMPORTANT: Rotation is handled by CSS via .is-open class on parent
	 * Do NOT apply inline rotation styles here - let CSS control it
	 */
	const renderSingleIcon = ( source, state ) => {
		if ( ! source || ! source.value ) {
			return null;
		}

		const stateClass = `accordion-icon-${ state }`;
		const baseClasses = `accordion-icon ${ stateClass }`;

		// Render based on icon kind
		if ( source.kind === 'char' ) {
			return (
				<span
					className={ `${ baseClasses } accordion-icon-char` }
					aria-hidden="true"
				>
					{ source.value }
				</span>
			);
		}

		if ( source.kind === 'image' ) {
			return (
				<img
					className={ `${ baseClasses } accordion-icon-image` }
					src={ source.value }
					alt=""
					aria-hidden="true"
				/>
			);
		}

		if ( source.kind === 'library' ) {
			return (
				<span
					className={ `${ baseClasses } accordion-icon-library` }
					aria-hidden="true"
				>
					{ renderLibraryIcon( source.value ) }
				</span>
			);
		}

		return null;
	};

	/**
	 * Render icon wrapper with both inactive and active states
	 * Both icons are rendered in the markup, CSS controls visibility
	 *
	 * @param {string} position - Icon position ('left', 'right', 'extreme-left', 'extreme-right')
	 * @return {JSX.Element|null} Icon element with wrapper
	 */
	const renderIcon = ( position = 'right' ) => {
		// Check if icon should be displayed based on showIcon attribute
		const showIcon = effectiveValues.showIcon ?? true; // Default to true if undefined
		if ( showIcon === false ) {
			return null;
		}

		// Get icon sources (structured objects with {kind, value})
		const inactiveSource = effectiveValues.iconInactiveSource || { kind: 'char', value: '▾' };
		const activeSource = effectiveValues.iconActiveSource;

		if ( ! inactiveSource || ! inactiveSource.value ) {
			return null;
		}

		const hasDifferentIcons = !! ( activeSource && activeSource.value );

		// Render inactive icon (always present)
		const inactiveIcon = renderSingleIcon( inactiveSource, 'inactive' );

		// Render active icon only if different from inactive
		const activeIcon = hasDifferentIcons ? renderSingleIcon( activeSource, 'active' ) : null;

		return (
			<span className="accordion-icon-wrapper" aria-hidden="true">
				{ inactiveIcon }
				{ activeIcon }
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
							style={ {
								...titleTextInlineStyles,
								...titleFormattingStyles,
							} }
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
							style={ {
								...titleTextInlineStyles,
								...titleFormattingStyles,
							} }
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
						style={ {
							...titleTextInlineStyles,
							...titleFormattingStyles,
						} }
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
						style={ {
							...titleTextInlineStyles,
							...titleFormattingStyles,
						} }
					/>
					{ hasIcon && iconElement }
				</div>
			);
		}

		// The accordion-title div mimics the button structure from save.js
		const titleElement = (
			<div
				className={ `accordion-title ${ iconPositionClass } ${ titleAlignClass }` }
				style={ styles.title }
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
	const editorCSSVars = buildEditorCssVars( effectiveValues );
	const rootStyles = {
		width: formatDimensionValue( effectiveValues.accordionWidth, '%' ),
		overflow: 'hidden', // Clip border-radius in editor
		...editorCSSVars, // Apply all CSS variables (including decomposed ones!)
		...styles.container, // Apply container styles (margin, radius, box effects)
	};

	// Build class names - match frontend structure
	const classNames = [ 'gutplus-accordion' ];

	// Add open state class for preview
	if ( effectiveValues.initiallyOpen ) {
		classNames.push( 'is-open' );
	}

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
