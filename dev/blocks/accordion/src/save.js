/**
 * Accordion Block - Save Component
 *
 * Renders the frontend HTML structure with proper ARIA attributes.
 * Applies theme class names and only outputs inline CSS for explicit customizations.
 * Uses hybrid Tier 2 CSS approach for optimal performance.
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

import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { getAllEffectiveValues, getAccordionButtonAria, getAccordionPanelAria, getAllDefaults, getAlignmentClass } from '@shared';
import { buildFrontendCssVars } from '@shared/styles/accordion-frontend-css-vars-generated';
import { accordionAttributes } from './accordion-attributes';
import * as LucideIcons from 'lucide-react';

/**
 * Accordion Save Component
 *
 * @param {Object} props            Block props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function Save( { attributes } ) {
	// Extract schema defaults (single source of truth)
	const schemaDefaults = {};
	Object.keys( accordionAttributes ).forEach( ( key ) => {
		if ( accordionAttributes[ key ].default !== undefined ) {
			schemaDefaults[ key ] = accordionAttributes[ key ].default;
		}
	} );
	const allDefaults = getAllDefaults( schemaDefaults );

	// Get effective values for display purposes (icon rendering, etc.)
	const effectiveValues = getAllEffectiveValues(
		attributes,
		{}, // Themes are resolved server-side via CSS classes
		allDefaults,
		'accordion'
	);

	const accordionId = attributes.accordionId || '';

	const inlineStyles = buildFrontendCssVars( attributes.customizations, attributes );
	const customizations =
		attributes.customizations && typeof attributes.customizations === 'object'
			? attributes.customizations
			: {};
	const hasCustomizations = Object.keys( customizations ).length > 0;

	// Handle titleFormatting array to build text-decoration-line
	const titleFormatting = customizations.titleFormatting || [];
	const decorationLines = titleFormatting.filter( ( f ) =>
		[ 'underline', 'overline', 'line-through' ].includes( f )
	);
	if ( decorationLines.length > 0 ) {
		inlineStyles[ '--accordion-title-text-decoration-line' ] = decorationLines.join( ' ' );
	}

	// Font weight (only if bold is selected)
	if ( titleFormatting.includes( 'bold' ) && customizations.titleFontWeight ) {
		inlineStyles[ '--accordion-title-font-weight' ] = customizations.titleFontWeight;
	}

	// Font style (only if italic is selected)
	if ( titleFormatting.includes( 'italic' ) ) {
		inlineStyles[ '--accordion-title-font-style' ] = 'italic';
	}

	// Decoration styling (only if any decoration is active)
	if ( decorationLines.length > 0 ) {
		if ( customizations.titleDecorationColor ) {
			inlineStyles[ '--accordion-title-decoration-color' ] = customizations.titleDecorationColor;
		}
		if ( customizations.titleDecorationStyle ) {
			inlineStyles[ '--accordion-title-decoration-style' ] = customizations.titleDecorationStyle;
		}
		if ( customizations.titleDecorationWidth ) {
			inlineStyles[ '--accordion-title-decoration-width' ] = customizations.titleDecorationWidth;
		}
	}

	const titleNoLineBreak = customizations.titleNoLineBreak ?? attributes.titleNoLineBreak;
	const titleTextInlineStyles = titleNoLineBreak === 'nowrap'
		? { whiteSpace: 'nowrap' }
		: undefined;

	/**
	 * Render a single icon element based on kind
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
			const [ library, iconName ] = source.value.split( ':' );

			if ( library === 'dashicons' ) {
				return (
					<span
						className={ `${ baseClasses } accordion-icon-library accordion-icon-dashicons` }
						aria-hidden="true"
					>
						<span className={ `dashicons dashicons-${ iconName }` } />
					</span>
				);
			}

			if ( library === 'lucide' ) {
				// Render Lucide icon as inline SVG
				const LucideIcon = LucideIcons[ iconName ];
				return (
					<span
						className={ `${ baseClasses } accordion-icon-library accordion-icon-lucide` }
						aria-hidden="true"
					>
						{ LucideIcon ? <LucideIcon size="1em" /> : null }
					</span>
				);
			}
		}

		return null;
	};

	/**
	 * Render icon wrapper with both inactive and active states
	 * Both icons are rendered in the markup, CSS controls visibility
	 */
	const renderIcon = () => {
		// Check showIcon attribute to determine visibility
		if ( attributes.showIcon === false ) {
			return null;
		}

		const inactiveSource = attributes.iconInactiveSource;
		const activeSource = attributes.iconActiveSource;

		if ( ! inactiveSource || ! inactiveSource.value ) {
			return null;
		}

		const hasDifferentIcons = !! ( activeSource && activeSource.value );

		// Render inactive icon (always visible when closed)
		const inactiveIcon = renderSingleIcon( inactiveSource, 'inactive' );

		// Render active icon only if different from inactive
		const activeIcon = hasDifferentIcons ? renderSingleIcon( activeSource, 'active' ) : null;

		return (
			<span className="accordion-icon-wrapper">
				{ inactiveIcon }
				{ activeIcon }
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
		const titleAlignClass = titleAlignment ? `title-align-${ titleAlignment }` : 'title-align-left';

		// ARIA attributes for button
		const buttonAria = getAccordionButtonAria(
			accordionId,
			attributes.initiallyOpen || false
		);

		const iconElement = renderIcon();
		const hasIcon = !! iconElement;

		// Build button content - icon position affects layout structure
		let buttonChildren;

		if ( iconPosition === 'extreme-left' ) {
			// Extreme left: icon at far left, text with flex grows to fill
			buttonChildren = (
				<>
					{ hasIcon && (
						<span className="accordion-icon-slot">
							{ iconElement }
						</span>
					) }
					<div className="accordion-title-text-wrapper">
						<RichText.Content
							tagName="span"
							value={ attributes.title || '' }
							className="accordion-title-text"
							style={ titleTextInlineStyles }
						/>
					</div>
				</>
			);
		} else if ( iconPosition === 'extreme-right' ) {
			// Extreme right: text with flex grows, icon at far right
			buttonChildren = (
				<>
					<div className="accordion-title-text-wrapper">
						<RichText.Content
							tagName="span"
							value={ attributes.title || '' }
							className="accordion-title-text"
							style={ titleTextInlineStyles }
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
			// Left of text: wrap icon+text as single group that can be aligned
			buttonChildren = (
				<div className="accordion-title-inline">
					{ hasIcon && iconElement }
					<RichText.Content
						tagName="span"
						value={ attributes.title || '' }
						className="accordion-title-text"
						style={ titleTextInlineStyles }
					/>
				</div>
			);
		} else {
			// Right of text (default): wrap text+icon as single group that can be aligned
			buttonChildren = (
				<div className="accordion-title-inline">
					<RichText.Content
						tagName="span"
						value={ attributes.title || '' }
						className="accordion-title-text"
						style={ titleTextInlineStyles }
					/>
					{ hasIcon && iconElement }
				</div>
			);
		}

		const buttonContent = (
			<button
				type="button"
				className={ `accordion-title ${ iconPosition ? `icon-${ iconPosition }` : '' } ${ titleAlignClass }` }
				{ ...buttonAria }
			>
				{ buttonChildren }
			</button>
		);

		if ( headingLevel !== 'none' ) {
			const HeadingTag = headingLevel;
			return <HeadingTag className="accordion-heading">{ buttonContent }</HeadingTag>;
		}

		return buttonContent;
	};

	// ARIA attributes for panel
	const panelAria = getAccordionPanelAria( accordionId );

	// Build class names - accordion-item is now the root element
	const classNames = [ 'gutplus-accordion' ];

	// Add open state class
	if ( attributes.initiallyOpen ) {
		classNames.push( 'is-open' );
	}

	// Add theme class if using a theme
	if ( attributes.currentTheme ) {
		// Sanitize theme ID for CSS class (alphanumeric and hyphens only)
		const safeThemeId = attributes.currentTheme.replace( /[^a-zA-Z0-9\-]/g, '' );
		classNames.push( `gutplus-accordion-theme-${ safeThemeId }` );
	}

	// Add alignment class
	const alignmentClass = getAlignmentClass( attributes.accordionHorizontalAlign );
	classNames.push( alignmentClass );

	const hasInlineStyles = Object.keys( inlineStyles ).length > 0;

	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-accordion-id': accordionId,
		'data-animation-type': attributes.animationType || 'slide',
		'data-gutplus-device': 'global',
		// Add id attribute for CSS selector targeting (Tier 3 customizations)
		...( accordionId && hasCustomizations && { id: accordionId } ),
		// Apply inline styles (CSS variables + manual overrides)
		...( hasInlineStyles && { style: inlineStyles } ),
	} );

	return (
		<>
			<div { ...blockProps }>
				<div className="accordion-title-wrapper">
					{ renderTitle() }
				</div>

				<div
					className="accordion-content"
					{ ...panelAria }
					{ ...( ! attributes.initiallyOpen && { hidden: true } ) }
				>
					<div className="accordion-content-inner">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</>
	);
}
