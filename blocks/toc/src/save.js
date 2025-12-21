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
		numberingStyle,
		smoothScroll,
		scrollOffset,
		autoHighlight,
		positionType,
		positionHorizontalSide,
		positionHorizontalOffset,
		clickBehavior,
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
		'data-numbering-style': numberingStyle,
		'data-smooth-scroll': smoothScroll,
		'data-scroll-offset': scrollOffset,
		'data-auto-highlight': autoHighlight,
		'data-collapsible': isCollapsible,
		'data-initially-collapsed': initiallyCollapsed,
		'data-position-type': positionType,
		'data-position-horizontal-side': positionHorizontalSide,
		'data-click-behavior': clickBehavior || 'navigate',
		'data-toc-items': encodeURIComponent(
			JSON.stringify( tocItems || [] )
		),
		'data-deleted-heading-ids': ( deletedHeadingIds || [] ).join( ',' ),
	};

	// Build class names - add theme class if using a theme
	const classNames = [ 'gutplus-toc', `toc-position-${ positionType }` ];
	if ( attributes.currentTheme ) {
		// Sanitize theme ID for CSS class (alphanumeric and hyphens only)
		const safeThemeId = attributes.currentTheme.replace( /[^a-zA-Z0-9\-]/g, '' );
		classNames.push( `gutplus-toc-theme-${ safeThemeId }` );
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
		// Only add inline styles if there are customizations or fixed positioning
		...( Object.keys( customizationStyles ).length > 0 && { style: customizationStyles } ),
		...dataAttributes,
	} );

	// Collapse button ID
	const buttonId = `toc-toggle-${ tocId }`;
	const contentId = `toc-content-${ tocId }`;
	const titlePadding = effectiveValues.titlePadding || {
		top: 0,
		right: 0,
		bottom: 12,
		left: 0,
	};
	const titleFontSize = effectiveValues.titleFontSize ?? 1.25; // rem
	const collapseIconSize = effectiveValues.collapseIconSize ?? 1.25; // rem

	return (
		<div { ...blockProps }>
			{ showTitle && ! isCollapsible && (
				// NOTE: Inline styles used for initial render before CSS loads. CSS variables from theme will override these via specificity
				<div
					className="toc-title"
					style={ {
						fontSize: `${ titleFontSize }rem`,
						fontWeight: effectiveValues.titleFontWeight || '700',
						color: effectiveValues.titleColor || '#333333',
						backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
						textAlign: effectiveValues.titleAlignment || 'left',
						padding: `${ titlePadding.top }px ${ titlePadding.right }px ${ titlePadding.bottom }px ${ titlePadding.left }px`,
					} }
				>
					{ titleText }
				</div>
			) }

			{ showTitle && isCollapsible && (
				<button
					id={ buttonId }
					className="toc-title toc-toggle-button"
					aria-expanded={ ! initiallyCollapsed }
					aria-controls={ contentId }
					type="button"
					style={ {
						fontSize: `${ titleFontSize }rem`,
						fontWeight: effectiveValues.titleFontWeight || '700',
						color: effectiveValues.titleColor || '#333333',
						backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
						textAlign: effectiveValues.titleAlignment || 'left',
						padding: `${ titlePadding.top }px ${ titlePadding.right }px ${ titlePadding.bottom }px ${ titlePadding.left }px`,
						border: 'none',
						width: '100%',
						cursor: 'pointer',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					} }
				>
					<span>{ titleText }</span>
					<span
						className="toc-collapse-icon"
						aria-hidden="true"
						style={ {
							fontSize: `${ collapseIconSize }rem`,
							color: effectiveValues.collapseIconColor || '#666666',
						} }
					>
						▾
					</span>
				</button>
			) }

			{ ! showTitle && isCollapsible && (
				<button
					id={ buttonId }
					className="toc-toggle-button toc-icon-only"
					aria-expanded={ ! initiallyCollapsed }
					aria-controls={ contentId }
					aria-label="Toggle Table of Contents"
					type="button"
					style={ {
						position: 'absolute',
						top: '10px',
						right: '10px',
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						fontSize: `${ collapseIconSize }rem`,
						color: effectiveValues.collapseIconColor || '#666666',
					} }
				>
					▾
				</button>
			) }

			<nav
				id={ contentId }
				className="toc-content"
				aria-label={ titleText || 'Table of Contents' }
				style={ {
					display: isCollapsible && initiallyCollapsed ? 'none' : 'block',
				} }
			>
				<ul
					className={ `toc-list numbering-${ numberingStyle }` }
					style={ {
						listStyleType: numberingStyle === 'none' ? 'disc' : 'none',
						paddingLeft: formatCssValue(
							'listPaddingLeft',
							effectiveValues.listPaddingLeft ?? allDefaults.listPaddingLeft,
							'toc'
						),
						margin: 0,
					} }
				>
					<li className="toc-placeholder">Loading table of contents...</li>
				</ul>
			</nav>

		</div>
	);
}
