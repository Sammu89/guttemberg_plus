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
import { buildFrontendCssVars } from '@shared/styles/toc-frontend-css-vars-generated';
import tocSchema from '../../schemas/generated/toc.json';

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
		iconRotation,
		unifiedLinkColors,
		includeH1,
		includeH2,
		includeH3,
		includeH4,
		includeH5,
		includeH6,
	} = attributes;

	// Use pre-computed defaults from comprehensive schema
	const allDefaults = tocSchema.defaultValues || {};

	// Get effective values for display purposes (title rendering, etc.)
	const effectiveValues = getAllEffectiveValues(
		attributes,
		{}, // Themes are resolved server-side via CSS classes
		allDefaults,
		'toc'
	);

	const inactiveSource = attributes.iconInactiveSource ?? allDefaults.iconInactiveSource;
	const activeSource = attributes.iconActiveSource ?? allDefaults.iconActiveSource;

	// Data attributes for frontend JS
	const dataAttributes = {
		'data-toc-id': tocId,
		'data-filter-mode': filterMode ?? allDefaults.filterMode,
		'data-include-levels': ( includeLevels ?? allDefaults.includeLevels ).join( ',' ),
		'data-include-classes': includeClasses ?? allDefaults.includeClasses,
		'data-exclude-levels': ( excludeLevels ?? allDefaults.excludeLevels ).join( ',' ),
		'data-exclude-classes': excludeClasses ?? allDefaults.excludeClasses,
		'data-depth-limit': depthLimit ?? allDefaults.depthLimit ?? 0,
		'data-include-accordions': includeAccordions ?? allDefaults.includeAccordions,
		'data-include-tabs': includeTabs ?? allDefaults.includeTabs,
		'data-smooth-scroll': smoothScroll ?? allDefaults.smoothScroll,
		'data-scroll-offset': scrollOffset ?? allDefaults.scrollOffset,
		'data-auto-highlight': autoHighlight ?? allDefaults.autoHighlight,
		'data-collapsible': isCollapsible ?? allDefaults.isCollapsible,
		'data-initially-collapsed': initiallyCollapsed ?? allDefaults.initiallyCollapsed,
		'data-position-type': positionType ?? allDefaults.positionType,
		'data-position-horizontal-side':
			positionHorizontalSide ?? allDefaults.positionHorizontalSide,
		'data-click-behavior': clickBehavior ?? allDefaults.clickBehavior,
		'data-enable-hierarchical-indent':
			enableHierarchicalIndent ?? allDefaults.enableHierarchicalIndent,
		'data-level-indent': levelIndent ?? allDefaults.levelIndent,
		'data-h1-numbering': h1NumberingStyle ?? allDefaults.h1NumberingStyle,
		'data-h2-numbering': h2NumberingStyle ?? allDefaults.h2NumberingStyle,
		'data-h3-numbering': h3NumberingStyle ?? allDefaults.h3NumberingStyle,
		'data-h4-numbering': h4NumberingStyle ?? allDefaults.h4NumberingStyle,
		'data-h5-numbering': h5NumberingStyle ?? allDefaults.h5NumberingStyle,
		'data-h6-numbering': h6NumberingStyle ?? allDefaults.h6NumberingStyle,
		'data-toc-items': encodeURIComponent( JSON.stringify( tocItems || [] ) ),
		'data-deleted-heading-ids': ( deletedHeadingIds || [] ).join( ',' ),
		'data-show-icon': showIcon ?? allDefaults.showIcon,
		'data-icon-rotation': iconRotation ?? allDefaults.iconRotation,
		'data-include-h1': includeH1 ?? allDefaults.includeH1,
		'data-include-h2': includeH2 ?? allDefaults.includeH2,
		'data-include-h3': includeH3 ?? allDefaults.includeH3,
		'data-include-h4': includeH4 ?? allDefaults.includeH4,
		'data-include-h5': includeH5 ?? allDefaults.includeH5,
		'data-include-h6': includeH6 ?? allDefaults.includeH6,
	};
	const numberingDataAttributes = {
		'data-h1-numbering': h1NumberingStyle ?? allDefaults.h1NumberingStyle,
		'data-h2-numbering': h2NumberingStyle ?? allDefaults.h2NumberingStyle,
		'data-h3-numbering': h3NumberingStyle ?? allDefaults.h3NumberingStyle,
		'data-h4-numbering': h4NumberingStyle ?? allDefaults.h4NumberingStyle,
		'data-h5-numbering': h5NumberingStyle ?? allDefaults.h5NumberingStyle,
		'data-h6-numbering': h6NumberingStyle ?? allDefaults.h6NumberingStyle,
	};

	/**
	 * Render icon based on new icon system
	 * Supports character, image, and library icons
	 */
	const renderIcon = () => {
		if ( ! showIcon ) {
			return null;
		}

		const useDifferentIcons = attributes.useDifferentIcons;

		if ( ! inactiveSource || ! inactiveSource.value ) {
			return null;
		}

		// Determine which icon to render initially (based on initiallyCollapsed and useDifferentIcons)
		const initialSource =
			! initiallyCollapsed && useDifferentIcons && activeSource && activeSource.value
				? activeSource
				: inactiveSource;

		// Data attributes for frontend JS
		const hasDifferentIcons = useDifferentIcons && activeSource && activeSource.value;
		const dataAttrs = {
			'data-icon-inactive': JSON.stringify( inactiveSource ),
			'data-icon-active': hasDifferentIcons ? JSON.stringify( activeSource ) : null,
			'data-has-different-icons': hasDifferentIcons,
		};

		// Icon classes
		const iconClasses = 'toc-icon' + ( ! initiallyCollapsed ? ' is-rotated' : '' );

		// Render based on icon kind
		if ( initialSource.kind === 'char' ) {
			return (
				<span
					className={ iconClasses + ' toc-icon-char' }
					aria-hidden="true"
					{ ...dataAttrs }
				>
					{ initialSource.value }
				</span>
			);
		}

		if ( initialSource.kind === 'image' ) {
			return (
				<img
					className={ iconClasses + ' toc-icon-image' }
					src={ initialSource.value }
					alt=""
					aria-hidden="true"
					{ ...dataAttrs }
				/>
			);
		}

		if ( initialSource.kind === 'library' ) {
			const [ library, iconName ] = initialSource.value.split( ':' );

			// For library icons, we'll use a data attribute approach
			return (
				<span
					className={ iconClasses + ' toc-icon-library' }
					aria-hidden="true"
					data-icon-library={ library }
					data-icon-name={ iconName }
					{ ...dataAttrs }
				>
					{ library === 'dashicons' && (
						<span className={ `dashicons dashicons-${ iconName }` } />
					) }
				</span>
			);
		}

		return null;
	};

	/* ========== AUTO-GENERATED-RENDER-TITLE-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// AUTO-GENERATED from schemas/toc-structure-mapping-autogenerated.json
// To modify, update the schema and run: npm run schema:build

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
  const titleAlignClass = titleAlignment
    ? `title-align-${ titleAlignment }`
    : 'title-align-left';

  // Build header content based on icon position
  let buttonChildren;

  if ( currentIconPosition === 'box-left' ) {
    // Extreme left: icon at far left, text with flex grows to fill
    buttonChildren = (
      <>
        { hasIcon && <span className="toc-icon-slot">{ iconElement }</span> }
        <div className="toc-title-text-wrapper">
          <span className="toc-title-text">{ titleText }</span>
        </div>
      </>
    );
  } else if ( currentIconPosition === 'box-right' ) {
    // Extreme right: text with flex grows, icon at far right
    buttonChildren = (
      <>
        <div className="toc-title-text-wrapper">
          <span className="toc-title-text">{ titleText }</span>
        </div>
        { hasIcon && <span className="toc-icon-slot">{ iconElement }</span> }
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
        className={ `toc-title toc-toggle-button ${
          currentIconPosition ? `icon-${ currentIconPosition }` : ''
        } ${ titleAlignClass }` }
        aria-expanded={ ! initiallyCollapsed }
        aria-controls={ contentId }
        type="button"
      >
        { buttonChildren }
      </button>
    );
  }

  // If not collapsible but showTitle is true, render as static title
  if ( showTitle ) {
    return (
      <div className={ `toc-title ${ titleAlignClass }` }>
        <span className="toc-title-text">{ titleText }</span>
      </div>
    );
  }

  return null;
};

/* ========== AUTO-GENERATED-RENDER-TITLE-END ========== */

	const inlineStyles = buildFrontendCssVars( attributes.customizations, attributes );

	// Add numbering style CSS variables
	[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].forEach( ( level ) => {
		const numbering =
			attributes[ `${ level }NumberingStyle` ] ?? allDefaults[ `${ level }NumberingStyle` ];
		if ( numbering !== undefined && numbering !== null ) {
			inlineStyles[ `--toc-${ level }-numbering` ] = numbering;
		}
	} );

	// Add fixed positioning horizontal offset
	// This is applied directly as inline styles since it needs to set left OR right (not both)
	if ( positionType === 'fixed' ) {
		const side = positionHorizontalSide ?? allDefaults.positionHorizontalSide ?? 'right';
		const offset =
			positionHorizontalOffset ?? allDefaults.positionHorizontalOffset ?? '1.25rem';

		if ( side === 'left' ) {
			inlineStyles.left = offset;
			inlineStyles.right = 'auto';
		} else {
			inlineStyles.right = offset;
			inlineStyles.left = 'auto';
		}
	}

	/* ========== AUTO-GENERATED-BLOCK-CONTENT-START ========== */
// DO NOT EDIT - This code is auto-generated from schema

	// Build class names - add theme class if using a theme
	const classNames = [ 'gutplus-toc', `toc-position-${ positionType }` ];

	// Track heading toggle state for validation and CSS targeting
	const headingToggleAny =
		includeH1 || includeH2 || includeH3 || includeH4 || includeH5 || includeH6;
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

	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-gutplus-device': 'global',
		// Only add inline styles if there are customizations or fixed positioning
		...( Object.keys( inlineStyles ).length > 0 && { style: inlineStyles } ),
		...dataAttributes,
	} );

	// Collapse button ID
	const buttonId = `toc-toggle-${ tocId }`;
	const contentId = `toc-content-${ tocId }`;

	return (
		<div { ...blockProps }>
			{ /* Header Section (accordion-like) */ }
			<div className="toc-header-wrapper">{ renderHeader() }</div>

			{ /* Content Section */ }
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
/* ========== AUTO-GENERATED-BLOCK-CONTENT-END ========== */
}
