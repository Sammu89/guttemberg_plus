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
import { formatCssValue, getCssVarName } from '@shared/config/css-var-mappings-generated';
import { accordionAttributes } from './accordion-attributes';

/**
 * Generate block-specific CSS from customizations (Tier 3)
 * Handles both inline styles and responsive media queries
 *
 * @param {string} blockId - The unique block ID
 * @param {Object} customizations - The customizations object from attributes
 * @param {Object} breakpoints - Breakpoint configuration
 * @return {string|null} Generated CSS string or null if no customizations
 */
function generateBlockCSS( blockId, customizations, breakpoints ) {
	if ( ! customizations || Object.keys( customizations ).length === 0 ) {
		return null;
	}

	let css = `#${ blockId } {\n`;

	// Generate desktop CSS variables
	for ( const [ attrName, value ] of Object.entries( customizations ) ) {
		const cssVar = getCssVarName( attrName, 'accordion' );
		if ( ! cssVar ) {
			continue;
		}

		let valueToProcess = value;

		// Handle responsive values - extract desktop value
		if ( typeof value === 'object' && value !== null && value.desktop !== undefined ) {
			valueToProcess = value.desktop;
		}

		// Format the value (formatCssValue handles compound values intelligently)
		const formattedValue = formatCssValue( attrName, valueToProcess, 'accordion' );
		if ( formattedValue !== null ) {
			css += `  ${ cssVar }: ${ formattedValue };\n`;
		}
	}

	css += '}\n';

	// Generate responsive media queries
	for ( const [ attrName, value ] of Object.entries( customizations ) ) {
		if ( typeof value === 'object' && value !== null ) {
			const cssVar = getCssVarName( attrName, 'accordion' );
			if ( ! cssVar ) {
				continue;
			}

			// Tablet breakpoint
			if ( value.tablet !== undefined ) {
				const formattedValue = formatCssValue( attrName, value.tablet, 'accordion' );
				if ( formattedValue !== null ) {
					css += `@media (max-width: ${ breakpoints.tablet }px) {\n`;
					css += `  #${ blockId } { ${ cssVar }: ${ formattedValue }; }\n`;
					css += '}\n';
				}
			}

			// Mobile breakpoint
			if ( value.mobile !== undefined ) {
				const formattedValue = formatCssValue( attrName, value.mobile, 'accordion' );
				if ( formattedValue !== null ) {
					css += `@media (max-width: ${ breakpoints.mobile }px) {\n`;
					css += `  #${ blockId } { ${ cssVar }: ${ formattedValue }; }\n`;
					css += '}\n';
				}
			}
		}
	}

	return css;
}

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

	// Get user-defined breakpoints from global settings (with fallback to defaults)
	const breakpoints = ( typeof window !== 'undefined' && window.guttembergPlusSettings?.breakpoints ) || {
		mobile: 600,
		tablet: 1024,
	};

	// Generate Tier 3 CSS (block-specific customizations with responsive support)
	const blockCSS = generateBlockCSS(
		accordionId,
		attributes.customizations || {},
		breakpoints
	);

	/**
	 * Render icon based on settings
	 */
	const renderIcon = () => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed || '▾';
		const iconOpen = effectiveValues.iconTypeOpen;
		const isImage = iconContent.startsWith( 'http' );

		if ( isImage ) {
			return (
				<img
					src={ iconContent }
					alt=""
					aria-hidden="true"
					className="accordion-icon accordion-icon-image"
					data-icon-closed={ iconContent }
					data-icon-open={ iconOpen !== 'none' ? iconOpen : iconContent }
				/>
			);
		}

		return (
			<span
				className="accordion-icon"
				aria-hidden="true"
				data-icon-closed={ iconContent }
				data-icon-open={ iconOpen !== 'none' ? iconOpen : iconContent }
			>
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

	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-accordion-id': accordionId,
		// Add id attribute for CSS selector targeting (Tier 3 customizations)
		...( accordionId && blockCSS && { id: accordionId } ),
	} );

	return (
		<>
			{ blockCSS && (
				<style dangerouslySetInnerHTML={ { __html: blockCSS } } />
			) }
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
