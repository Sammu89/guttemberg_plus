/**
 * TOC Block - Save Component
 *
 * Generates the static HTML output for the frontend.
 * The actual heading detection happens via JavaScript on the frontend.
 *
 * Note: Headings are detected client-side to ensure TOC updates
 * if content changes after initial save.
 *
 * @package
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import { getAllEffectiveValues } from '../../../shared/src/theme-system/cascade-resolver';
import { getCSSDefault } from '../../../shared/src/utils/css-parser';

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
		numberingStyle,
		smoothScroll,
		scrollOffset,
		autoHighlight,
		positionType,
		clickBehavior,
	} = attributes;

	// Get CSS defaults
	const cssDefaults = getCSSDefault( 'toc' ) || {};

	// Note: In save, we don't have access to themes from the store,
	// so we pass null as theme. The frontend JS will handle theme loading.
	const effectiveValues = getAllEffectiveValues( attributes, null, cssDefaults );

	// Build inline styles
	const inlineStyles = buildInlineStyles( effectiveValues );

	// Data attributes for frontend JS
	const dataAttributes = {
		'data-toc-id': tocId,
		'data-filter-mode': filterMode,
		'data-include-levels': includeLevels.join( ',' ),
		'data-include-classes': includeClasses,
		'data-exclude-levels': excludeLevels.join( ',' ),
		'data-exclude-classes': excludeClasses,
		'data-depth-limit': depthLimit || 0,
		'data-numbering-style': numberingStyle,
		'data-smooth-scroll': smoothScroll,
		'data-scroll-offset': scrollOffset,
		'data-auto-highlight': autoHighlight,
		'data-collapsible': isCollapsible,
		'data-initially-collapsed': initiallyCollapsed,
		'data-position-type': positionType,
		'data-click-behavior': clickBehavior || 'navigate',
	};

	// Block props
	const blockProps = useBlockProps.save( {
		className: `wp-block-custom-toc toc-position-${ positionType }`,
		style: inlineStyles,
		...dataAttributes,
	} );

	// Collapse button ID
	const buttonId = `toc-toggle-${ tocId }`;
	const contentId = `toc-content-${ tocId }`;

	return (
		<div { ...blockProps }>
			{ showTitle && ! isCollapsible && (
				<div
					className="toc-title"
					style={ {
						fontSize: `${ effectiveValues.titleFontSize || 20 }px`,
						fontWeight: effectiveValues.titleFontWeight || '700',
						color: effectiveValues.titleColor || '#333333',
						backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
						textAlign: effectiveValues.titleAlignment || 'left',
						padding: `${ effectiveValues.titlePadding || 12 }px`,
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
						fontSize: `${ effectiveValues.titleFontSize || 20 }px`,
						fontWeight: effectiveValues.titleFontWeight || '700',
						color: effectiveValues.titleColor || '#333333',
						backgroundColor: effectiveValues.titleBackgroundColor || 'transparent',
						textAlign: effectiveValues.titleAlignment || 'left',
						padding: `${ effectiveValues.titlePadding || 12 }px`,
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
							fontSize: `${ effectiveValues.collapseIconSize || 20 }px`,
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
						fontSize: `${ effectiveValues.collapseIconSize || 20 }px`,
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
						paddingLeft: `${ effectiveValues.listPaddingLeft || 24 }px`,
						margin: 0,
					} }
				>
					<li className="toc-placeholder">Loading table of contents...</li>
				</ul>
			</nav>
		</div>
	);
}

/**
 * Build inline CSS custom properties from effective values
 * @param effectiveValues
 */
function buildInlineStyles( effectiveValues ) {
	const styles = {};

	// Wrapper colors
	if ( effectiveValues.wrapperBackgroundColor ) {
		styles[ '--toc-wrapper-background-color' ] = effectiveValues.wrapperBackgroundColor;
	}
	if ( effectiveValues.wrapperBorderColor ) {
		styles[ '--toc-wrapper-border-color' ] = effectiveValues.wrapperBorderColor;
	}

	// Link colors
	if ( effectiveValues.linkColor ) {
		styles[ '--toc-link-color' ] = effectiveValues.linkColor;
	}
	if ( effectiveValues.linkHoverColor ) {
		styles[ '--toc-link-hover-color' ] = effectiveValues.linkHoverColor;
	}
	if ( effectiveValues.linkVisitedColor ) {
		styles[ '--toc-link-visited-color' ] = effectiveValues.linkVisitedColor;
	}
	if ( effectiveValues.linkActiveColor ) {
		styles[ '--toc-link-active-color' ] = effectiveValues.linkActiveColor;
	}

	// Numbering color
	if ( effectiveValues.numberingColor ) {
		styles[ '--toc-numbering-color' ] = effectiveValues.numberingColor;
	}

	// Level colors
	if ( effectiveValues.level1Color ) {
		styles[ '--toc-level1-color' ] = effectiveValues.level1Color;
	}
	if ( effectiveValues.level2Color ) {
		styles[ '--toc-level2-color' ] = effectiveValues.level2Color;
	}
	if ( effectiveValues.level3PlusColor ) {
		styles[ '--toc-level3-plus-color' ] = effectiveValues.level3PlusColor;
	}

	// Typography
	if ( effectiveValues.level1FontSize ) {
		styles[ '--toc-level1-font-size' ] = `${ effectiveValues.level1FontSize }px`;
	}
	if ( effectiveValues.level1FontWeight ) {
		styles[ '--toc-level1-font-weight' ] = effectiveValues.level1FontWeight;
	}
	if ( effectiveValues.level1FontStyle ) {
		styles[ '--toc-level1-font-style' ] = effectiveValues.level1FontStyle;
	}
	if ( effectiveValues.level1TextTransform ) {
		styles[ '--toc-level1-text-transform' ] = effectiveValues.level1TextTransform;
	}
	if ( effectiveValues.level1TextDecoration ) {
		styles[ '--toc-level1-text-decoration' ] = effectiveValues.level1TextDecoration;
	}
	if ( effectiveValues.level2FontSize ) {
		styles[ '--toc-level2-font-size' ] = `${ effectiveValues.level2FontSize }px`;
	}
	if ( effectiveValues.level2FontWeight ) {
		styles[ '--toc-level2-font-weight' ] = effectiveValues.level2FontWeight;
	}
	if ( effectiveValues.level2FontStyle ) {
		styles[ '--toc-level2-font-style' ] = effectiveValues.level2FontStyle;
	}
	if ( effectiveValues.level2TextTransform ) {
		styles[ '--toc-level2-text-transform' ] = effectiveValues.level2TextTransform;
	}
	if ( effectiveValues.level2TextDecoration ) {
		styles[ '--toc-level2-text-decoration' ] = effectiveValues.level2TextDecoration;
	}
	if ( effectiveValues.level3PlusFontSize ) {
		styles[ '--toc-level3-plus-font-size' ] = `${ effectiveValues.level3PlusFontSize }px`;
	}
	if ( effectiveValues.level3PlusFontWeight ) {
		styles[ '--toc-level3-plus-font-weight' ] = effectiveValues.level3PlusFontWeight;
	}
	if ( effectiveValues.level3PlusFontStyle ) {
		styles[ '--toc-level3-plus-font-style' ] = effectiveValues.level3PlusFontStyle;
	}
	if ( effectiveValues.level3PlusTextTransform ) {
		styles[ '--toc-level3-plus-text-transform' ] = effectiveValues.level3PlusTextTransform;
	}
	if ( effectiveValues.level3PlusTextDecoration ) {
		styles[ '--toc-level3-plus-text-decoration' ] = effectiveValues.level3PlusTextDecoration;
	}

	// Border
	if ( effectiveValues.wrapperBorderWidth ) {
		styles[ '--toc-border-width' ] = `${ effectiveValues.wrapperBorderWidth }px`;
	}
	if ( effectiveValues.wrapperBorderStyle ) {
		styles[ '--toc-border-style' ] = effectiveValues.wrapperBorderStyle;
	}
	if ( effectiveValues.wrapperBorderRadius ) {
		styles[ '--toc-border-radius' ] = `${ effectiveValues.wrapperBorderRadius }px`;
	}

	// Padding & Spacing
	if ( effectiveValues.wrapperPadding ) {
		styles[ '--toc-wrapper-padding' ] = `${ effectiveValues.wrapperPadding }px`;
	}
	if ( effectiveValues.itemSpacing ) {
		styles[ '--toc-item-spacing' ] = `${ effectiveValues.itemSpacing }px`;
	}
	if ( effectiveValues.levelIndent ) {
		styles[ '--toc-level-indent' ] = `${ effectiveValues.levelIndent }px`;
	}

	// Position
	if ( effectiveValues.positionTop ) {
		styles[ '--toc-position-top' ] = `${ effectiveValues.positionTop }px`;
	}
	if ( effectiveValues.zIndex ) {
		styles[ '--toc-z-index' ] = effectiveValues.zIndex;
	}

	// Shadow
	if ( effectiveValues.wrapperShadow ) {
		styles[ '--toc-wrapper-shadow' ] = effectiveValues.wrapperShadow;
	}

	return styles;
}
