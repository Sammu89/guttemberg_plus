/**
 * TOC Block - Save Component
 *
 * Generates the static HTML output for the frontend.
 * Applies theme class names and only outputs inline CSS for explicit customizations.
 * Uses hybrid Tier 2 CSS approach for optimal performance.
 *
 * The actual heading detection happens via JavaScript on the frontend.
 *
 * Note: Headings are detected client-side to ensure TOC updates
 * if content changes after initial save.
 *
 * IMPORTANT: Sections marked with AUTO-GENERATED comments are automatically
 * regenerated from the schema on every build. Do not edit code between these markers.
 *
 * To modify styles:
 * 1. Edit the schema: schemas/toc.json
 * 2. Run: npm run schema:build
 * 3. The code between markers will update automatically
 *
 * @package
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import { getAllEffectiveValues, getAllDefaults, getAlignmentClass } from '@shared';
import { getCssVarName, formatCssValue } from '@shared/config/css-var-mappings-generated';
import { tocAttributes } from './toc-attributes';

/**
 * Save Component
 * @param root0
 * @param root0.attributes
 */
export default function save( { attributes } ) {
	const {
		tocId,
		showTitle,
		titleText,
		isCollapsible,
		initiallyCollapsed,
		filterMode,
		includeLevels,
		includeClasses,
		excludeLevels,
		excludeClasses,
		depthLimit,
		includeAccordions,
		includeTabs,
		tocItems,
		deletedHeadingIds,
		h1NumberingStyle,
		h2NumberingStyle,
		h3NumberingStyle,
		h4NumberingStyle,
		h5NumberingStyle,
		h6NumberingStyle,
		smoothScroll,
		scrollOffset,
		autoHighlight,
		positionType,
		positionHorizontalSide,
		positionHorizontalOffset,
		clickBehavior,
		enableHierarchicalIndent,
		levelIndent,
		showIcon,
		iconPosition,
		iconTypeClosed,
		iconTypeOpen,
		iconRotation,
		unifiedLinkColors,
		includeH1,
		includeH2,
		includeH3,
		includeH4,
		includeH5,
		includeH6,
	} = attributes;

	// Extract schema defaults (single source of truth)
	const schemaDefaults = {};
	Object.keys( tocAttributes ).forEach( ( key ) => {
		if ( tocAttributes[ key ].default !== undefined ) {
			schemaDefaults[ key ] = tocAttributes[ key ].default;
		}
	} );
	const allDefaults = getAllDefaults( schemaDefaults );

	// Get effective values for display purposes (title rendering, etc.)
	const effectiveValues = getAllEffectiveValues(
		attributes,
		{}, // Themes are resolved server-side via CSS classes
		allDefaults,
		'toc'
	);

	// Data attributes for frontend JS
	const dataAttributes = {
		'data-toc-id': tocId,
		'data-filter-mode': filterMode,
		'data-include-levels': includeLevels.join( ',' ),
		'data-include-classes': includeClasses,
		'data-exclude-levels': excludeLevels.join( ',' ),
		'data-exclude-classes': excludeClasses,
		'data-depth-limit': depthLimit || 0,
		'data-include-accordions': includeAccordions !== false,
		'data-include-tabs': includeTabs !== false,
		'data-smooth-scroll': smoothScroll,
		'data-scroll-offset': scrollOffset,
		'data-auto-highlight': autoHighlight,
		'data-collapsible': isCollapsible,
		'data-initially-collapsed': initiallyCollapsed,
		'data-position-type': positionType,
		'data-position-horizontal-side': positionHorizontalSide,
		'data-click-behavior': clickBehavior || 'navigate',
		'data-enable-hierarchical-indent': enableHierarchicalIndent || false,
		'data-level-indent': levelIndent || '1.25rem',
		'data-h1-numbering': h1NumberingStyle || 'decimal',
		'data-h2-numbering': h2NumberingStyle || 'decimal',
		'data-h3-numbering': h3NumberingStyle || 'decimal',
		'data-h4-numbering': h4NumberingStyle || 'decimal',
		'data-h5-numbering': h5NumberingStyle || 'decimal',
		'data-h6-numbering': h6NumberingStyle || 'decimal',
		'data-toc-items': encodeURIComponent(
			JSON.stringify( tocItems || [] )
		),
		'data-deleted-heading-ids': ( deletedHeadingIds || [] ).join( ',' ),
		'data-show-icon': showIcon !== false,
		'data-icon-closed': iconTypeClosed || '▾',
		'data-icon-open': iconTypeOpen || 'none',
		'data-icon-rotation': iconRotation || 180,
		'data-include-h1': includeH1 !== false,
		'data-include-h2': includeH2 !== false,
		'data-include-h3': includeH3 !== false,
		'data-include-h4': includeH4 !== false,
		'data-include-h5': includeH5 !== false,
		'data-include-h6': includeH6 !== false,
	};
	const numberingDataAttributes = {
		'data-h1-numbering': h1NumberingStyle || 'decimal',
		'data-h2-numbering': h2NumberingStyle || 'decimal',
		'data-h3-numbering': h3NumberingStyle || 'decimal',
		'data-h4-numbering': h4NumberingStyle || 'decimal',
		'data-h5-numbering': h5NumberingStyle || 'decimal',
		'data-h6-numbering': h6NumberingStyle || 'decimal',
	};

	// Build class names - add theme class if using a theme
	const classNames = [ 'gutplus-toc', `toc-position-${ positionType }` ];

	// Track heading toggle state for validation and CSS targeting
	const headingToggleAny = includeH1 || includeH2 || includeH3 || includeH4 || includeH5 || includeH6;
	if ( ! headingToggleAny ) {
		classNames.push( 'toc-no-headings-selected' );
	}
	if ( includeH6 === false ) {
		classNames.push( 'toc-excludes-h6' );
	}

	// Link color mode (unified vs per-level)
	if ( unifiedLinkColors === false ) {
		classNames.push( 'toc-link-colors-per-level' );
	} else {
		classNames.push( 'toc-link-colors-unified' );
	}

	// Add open state class
	if ( ! initiallyCollapsed ) {
		classNames.push( 'is-open' );
	}

	if ( attributes.currentTheme ) {
		// Sanitize theme ID for CSS class (alphanumeric and hyphens only)
		const safeThemeId = attributes.currentTheme.replace( /[^a-zA-Z0-9\-]/g, '' );
		classNames.push( `gutplus-toc-theme-${ safeThemeId }` );
	}

	// Add icon position class
	if ( iconPosition ) {
		classNames.push( `icon-${ iconPosition }` );
	}

	// Add alignment class using centralized utility
	const alignmentClass = getAlignmentClass( attributes.tocHorizontalAlign );
	classNames.push( alignmentClass );

	/**
	 * Build inline CSS variables ONLY for explicit customizations (Tier 3)
	 * This function is auto-generated from schema below
	 */
	/* ========== AUTO-GENERATED-CUSTOMIZATION-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
const getCustomizationStyles = () => {
  const styles = {};

  // Get customizations (deltas from expected values, calculated in edit.js)
  const customizations = attributes.customizations || {};

  // Process each customization using schema-generated mappings
  Object.entries(customizations).forEach(([attrName, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    // Get CSS variable name from generated mappings
    const cssVar = getCssVarName(attrName, 'toc');
    if (!cssVar) {
      return; // Attribute not mapped to a CSS variable
    }

    const isResponsiveValue = value && typeof value === 'object' &&
      (value.desktop !== undefined || value.tablet !== undefined || value.mobile !== undefined);

    if (isResponsiveValue) {
      if (value.desktop !== undefined && value.desktop !== null) {
        const formattedDesktop = formatCssValue(attrName, value.desktop, 'toc');
        if (formattedDesktop !== null) {
          styles[cssVar] = formattedDesktop;
        }
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, 'toc');
        if (formattedTablet !== null) {
          styles[`${cssVar}-tablet`] = formattedTablet;
        }
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, 'toc');
        if (formattedMobile !== null) {
          styles[`${cssVar}-mobile`] = formattedMobile;
        }
      }
      return;
    }

    // Format value with proper unit from generated mappings
    const formattedValue = formatCssValue(attrName, value, 'toc');
    if (formattedValue !== null) {
      styles[cssVar] = formattedValue;
    }
  });

  return styles;
};
/* ========== AUTO-GENERATED-CUSTOMIZATION-STYLES-END ========== */

	const customizationStyles = getCustomizationStyles();

	// Add numbering style CSS variables
	[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].forEach( ( level ) => {
		const numbering = attributes[ `${ level }NumberingStyle` ];
		if ( numbering !== undefined && numbering !== null ) {
			customizationStyles[ `--toc-${ level }-numbering` ] = numbering;
		}
	} );

	// Add heading-level CSS variables (h1-h6 styling)
	// These are set directly as attributes, not via customizations
	const headingLevels = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];
	const headingProps = [ 'Color', 'FontSize', 'FontWeight', 'FontStyle', 'TextTransform', 'TextDecoration' ];

	headingLevels.forEach( ( level ) => {
		headingProps.forEach( ( prop ) => {
			const attrName = `${ level }${ prop }`;
			const value = attributes[ attrName ];
			if ( value !== undefined && value !== null ) {
				const cssVarName = getCssVarName( attrName, 'toc' );
				if ( cssVarName ) {
					const formattedValue = formatCssValue( attrName, value, 'toc' );
					if ( formattedValue !== null ) {
						customizationStyles[ cssVarName ] = formattedValue;
					}
				}
			}
		} );
	} );

	// Add fixed positioning horizontal offset
	// This is applied directly as inline styles since it needs to set left OR right (not both)
	if ( positionType === 'fixed' ) {
		const side = positionHorizontalSide || 'right';
		const offset = positionHorizontalOffset || '1.25rem';

		if ( side === 'left' ) {
			customizationStyles.left = offset;
			customizationStyles.right = 'auto';
		} else {
			customizationStyles.right = offset;
			customizationStyles.left = 'auto';
		}
	}

	// Block props
	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-gutplus-device': 'desktop',
		// Only add inline styles if there are customizations or fixed positioning
		...( Object.keys( customizationStyles ).length > 0 && { style: customizationStyles } ),
		...dataAttributes,
	} );

	// Collapse button ID
	const buttonId = `toc-toggle-${ tocId }`;
	const contentId = `toc-content-${ tocId }`;
	const titleFontSize = effectiveValues.titleFontSize ?? 1.25; // rem

	/**
	 * Render icon based on settings (accordion-like pattern)
	 */
	const renderIcon = () => {
		if ( ! showIcon ) {
			return null;
		}

		const iconContent = iconTypeClosed || '▾';
		const iconOpen = iconTypeOpen || 'none';
		const isImage = iconContent.startsWith( 'http' );

		if ( isImage ) {
			return (
				<img
					src={ iconContent }
					alt=""
					aria-hidden="true"
					className="toc-icon toc-icon-image"
					data-icon-closed={ iconContent }
					data-icon-open={ iconOpen !== 'none' ? iconOpen : iconContent }
					data-icon-rotation={ iconRotation || 180 }
				/>
			);
		}

		return (
			<span
				className="toc-icon"
				aria-hidden="true"
				data-icon-closed={ iconContent }
				data-icon-open={ iconOpen !== 'none' ? iconOpen : iconContent }
				data-icon-rotation={ iconRotation || 180 }
			>
				{ iconContent }
			</span>
		);
	};

	/**
	 * Render header with accordion-like structure
	 */
	const renderHeader = () => {
		if ( ! showTitle && ! isCollapsible ) {
			return null;
		}

		const iconElement = renderIcon();
		const hasIcon = !! iconElement;
		const currentIconPosition = iconPosition || 'right';
		const titleAlignment = effectiveValues.titleAlignment || 'left';
		const titleAlignClass = titleAlignment ? `title-align-${ titleAlignment }` : 'title-align-left';

		// Build header content based on icon position
		let buttonChildren;

		if ( currentIconPosition === 'extreme-left' ) {
			// Extreme left: icon at far left, text with flex grows to fill
			buttonChildren = (
				<>
					{ hasIcon && (
						<span className="toc-icon-slot">
							{ iconElement }
						</span>
					) }
					<div className="toc-title-text-wrapper">
						<span className="toc-title-text">{ titleText }</span>
					</div>
				</>
			);
		} else if ( currentIconPosition === 'extreme-right' ) {
			// Extreme right: text with flex grows, icon at far right
			buttonChildren = (
				<>
					<div className="toc-title-text-wrapper">
						<span className="toc-title-text">{ titleText }</span>
					</div>
					{ hasIcon && (
						<span className="toc-icon-slot">
							{ iconElement }
						</span>
					) }
				</>
			);
		} else if ( currentIconPosition === 'left' ) {
			// Left of text: wrap icon+text as single group that can be aligned
			buttonChildren = (
				<div className="toc-title-inline">
					{ hasIcon && iconElement }
					<span className="toc-title-text">{ titleText }</span>
				</div>
			);
		} else {
			// Right of text (default): wrap text+icon as single group that can be aligned
			buttonChildren = (
				<div className="toc-title-inline">
					<span className="toc-title-text">{ titleText }</span>
					{ hasIcon && iconElement }
				</div>
			);
		}

		// If collapsible, render as button
		if ( isCollapsible ) {
			return (
				<button
					id={ buttonId }
					className={ `toc-title toc-toggle-button ${ currentIconPosition ? `icon-${ currentIconPosition }` : '' } ${ titleAlignClass }` }
					aria-expanded={ ! initiallyCollapsed }
					aria-controls={ contentId }
					type="button"
					style={ {
						fontSize: `${ titleFontSize }rem`,
						fontWeight: effectiveValues.titleFontWeight || '700',
						color: effectiveValues.titleColor || '#333333',
						backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
						textAlign: titleAlignment,
					} }
				>
					{ buttonChildren }
				</button>
			);
		}

		// If not collapsible but showTitle is true, render as static title
		if ( showTitle ) {
			return (
				<div
					className={ `toc-title ${ titleAlignClass }` }
					style={ {
						fontSize: `${ titleFontSize }rem`,
						fontWeight: effectiveValues.titleFontWeight || '700',
						color: effectiveValues.titleColor || '#333333',
						backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
						textAlign: titleAlignment,
					} }
				>
					<span className="toc-title-text">{ titleText }</span>
				</div>
			);
		}

		return null;
	};

	return (
		<div { ...blockProps }>
			{/* Header Section (accordion-like) */}
			<div className="toc-header-wrapper">
				{ renderHeader() }
			</div>

			{/* Content Section */}
			<nav
				id={ contentId }
				className="toc-content"
				aria-label={ titleText || 'Table of Contents' }
				{ ...( isCollapsible && initiallyCollapsed && { hidden: true } ) }
			>
			<ul
				className="toc-list toc-hierarchical-numbering"
				style={ {
					margin: 0,
				} }
				{ ...numberingDataAttributes }
			>
				<li className="toc-placeholder">Loading table of contents...</li>
			</ul>
			</nav>

		</div>
	);
}
