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

	const inlineStyles = buildFrontendCssVars( attributes.customizations, attributes );

	// Add numbering style CSS variables
	[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].forEach( ( level ) => {
		const numbering = attributes[ `${ level }NumberingStyle` ];
		if ( numbering !== undefined && numbering !== null ) {
			inlineStyles[ `--toc-${ level }-numbering` ] = numbering;
		}
	} );

	// Add fixed positioning horizontal offset
	// This is applied directly as inline styles since it needs to set left OR right (not both)
	if ( positionType === 'fixed' ) {
		const side = positionHorizontalSide || 'right';
		const offset = positionHorizontalOffset || '1.25rem';

		if ( side === 'left' ) {
			inlineStyles.left = offset;
			inlineStyles.right = 'auto';
		} else {
			inlineStyles.right = offset;
			inlineStyles.left = 'auto';
		}
	}

	// Block props
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

	/**
	 * Render icon based on new icon system
	 * Supports character, image, and library icons
	 */
	const renderIcon = () => {
		if ( ! showIcon ) {
			return null;
		}

		const inactiveSource = attributes.iconInactiveSource;
		const activeSource = attributes.iconActiveSource;
		const useDifferentIcons = attributes.useDifferentIcons;

		if ( ! inactiveSource || ! inactiveSource.value ) {
			return null;
		}

		// Determine which icon to render initially (based on initiallyCollapsed and useDifferentIcons)
		const initialSource = ( ! initiallyCollapsed ) && useDifferentIcons && activeSource && activeSource.value
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

		if ( currentIconPosition === 'box-left' ) {
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
		} else if ( currentIconPosition === 'box-right' ) {
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
