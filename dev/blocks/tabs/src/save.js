/**
 * Tabs Block - Save Component
 *
 * Renders the frontend HTML structure with proper ARIA attributes for tabs.
 * Applies theme class names and only outputs inline CSS for explicit customizations.
 * Uses hybrid Tier 2 CSS approach for optimal performance.
 * Supports horizontal/vertical orientation and responsive fallback.
 *
 * IMPORTANT: Sections marked with AUTO-GENERATED comments are automatically
 * regenerated from the schema on every build. Do not edit code between these markers.
 *
 * To modify styles:
 * 1. Edit the schema: schemas/tabs.json
 * 2. Run: npm run schema:build
 * 3. The code between markers will update automatically
 *
 * @package
 * @since 1.0.0
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getAllEffectiveValues, getAllDefaults, getAlignmentClass } from '@shared';
import { formatCssValue } from '@shared/config/css-var-mappings-generated';
import { buildFrontendCssVars } from '@shared/styles/tabs-frontend-css-vars-generated';
import { tabsAttributes } from './tabs-attributes';

/**
 * Map orientation to ARIA-compliant value
 * ARIA only supports 'horizontal' or 'vertical'
 *
 * @param {string} orientation - The orientation value from attributes
 * @return {string} ARIA-compliant orientation value
 */
function getAriaOrientation( orientation ) {
	if ( orientation === 'vertical-left' || orientation === 'vertical-right' ) {
		return 'vertical';
	}
	return orientation || 'horizontal';
}

/**
 * Tabs Save Component
 *
 * @param {Object} props             Block props
 * @param {Object} props.attributes  Block attributes
 * @param {Array}  props.innerBlocks Array of inner block objects
 * @return {JSX.Element} Save component
 */
export default function Save( { attributes } ) {
	// Extract schema defaults (single source of truth)
	const schemaDefaults = {};
	Object.keys( tabsAttributes ).forEach( ( key ) => {
		if ( tabsAttributes[ key ].default !== undefined ) {
			schemaDefaults[ key ] = tabsAttributes[ key ].default;
		}
	} );
	const allDefaults = getAllDefaults( schemaDefaults );

	// Get effective values for display purposes (icon rendering, etc.)
	const effectiveValues = getAllEffectiveValues(
		attributes,
		{}, // Themes are resolved server-side via CSS classes
		allDefaults,
		'tabs'
	);

	const inlineStyles = buildFrontendCssVars( attributes.customizations, attributes );

	// If active content border is disabled, force content-edge vars to fall back to main border
	if ( attributes.enableFocusBorder === false ) {
		const activeBorderColor =
			attributes.tabButtonActiveBorderColor ??
			allDefaults.tabButtonActiveBorderColor ??
			'#dddddd';
		const baseBorderWidth = attributes.tabButtonBorderWidth ?? 1;
		const baseBorderStyle =
			attributes.tabButtonBorderStyle ?? allDefaults.tabButtonBorderStyle ?? 'solid';

		inlineStyles[ '--tabs-button-active-content-border-color' ] = activeBorderColor;
		inlineStyles[ '--tabs-button-active-content-border-width' ] = formatCssValue(
			'tabButtonBorderWidth',
			baseBorderWidth,
			'tabs'
		);
		inlineStyles[ '--tabs-button-active-content-border-style' ] = baseBorderStyle;
	}

	// If the divider toggle is off, ignore its customizations and fall back to row border
	if ( attributes.enableTabsListContentBorder === false ) {
		delete inlineStyles[ '--tabs-list-divider-border-color' ];
		delete inlineStyles[ '--tabs-list-divider-border-width' ];
		delete inlineStyles[ '--tabs-list-divider-border-style' ];

		const rowColor =
			attributes.tabsRowBorderColor ?? allDefaults.tabsRowBorderColor ?? '#dddddd';
		const rowWidth = attributes.tabsRowBorderWidth ?? allDefaults.tabsRowBorderWidth ?? 0;
		const rowStyle = attributes.tabsRowBorderStyle ?? allDefaults.tabsRowBorderStyle ?? 'solid';

		inlineStyles[ '--tabs-list-divider-border-color' ] = rowColor;
		inlineStyles[ '--tabs-list-divider-border-width' ] = formatCssValue(
			'tabsRowBorderWidth',
			rowWidth,
			'tabs'
		);
		inlineStyles[ '--tabs-list-divider-border-style' ] = rowStyle;
	}

	const hasInlineStyles = Object.keys( inlineStyles ).length > 0;

	/**
	 * Render icon based on new icon system
	 * Supports character, image, and library icons
	 * @param isActive
	 */
	const renderIcon = ( isActive = false ) => {
		// Check showIcon attribute to determine visibility
		if ( attributes.showIcon === false ) {
			return null;
		}

		const inactiveSource = attributes.iconInactiveSource;
		const activeSource = attributes.iconActiveSource;
		const useDifferentIcons = attributes.useDifferentIcons;

		if ( ! inactiveSource || ! inactiveSource.value ) {
			return null;
		}

		// Determine which icon to render (based on active state and useDifferentIcons)
		const initialSource =
			isActive && useDifferentIcons && activeSource && activeSource.value
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
		const iconClasses = 'tab-icon' + ( isActive ? ' is-rotated' : '' );

		// Render based on icon kind
		if ( initialSource.kind === 'char' ) {
			return (
				<span
					className={ iconClasses + ' tab-icon-char' }
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
					className={ iconClasses + ' tab-icon-image' }
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
					className={ iconClasses + ' tab-icon-library' }
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
	 * Render tab buttons server-side for SEO and accessibility
	 * Supports headingLevel wrapping like accordion
	 */
	const renderTabButtons = () => {
		const tabsData = attributes.tabsData || [];
		const headingLevel = attributes.headingLevel || 'none';
		const iconPosition = effectiveValues.iconPosition || 'right';
		const currentTab = attributes.currentTab || 0;

		// If no tabsData, return null (frontend.js will generate as fallback)
		if ( tabsData.length === 0 ) {
			return null;
		}

		return tabsData
			.filter( ( tab ) => ! tab.isDisabled ) // Skip disabled tabs on frontend
			.map( ( tab, index ) => {
				const isSelected = index === currentTab;
				const tabId = tab.tabId || `tab-${ index }`;

				// Build button content with icon based on position
				const buttonContent = (
					<button
						type="button"
						className={ `tab-button${ isSelected ? ' active' : '' }` }
						role="tab"
						id={ `tab-${ tabId }` }
						aria-controls={ `panel-${ tabId }` }
						aria-selected={ isSelected ? 'true' : 'false' }
						tabIndex={ isSelected ? 0 : -1 }
					>
						{ iconPosition === 'left' && renderIcon( isSelected ) }
						<span className="tab-title tab-button-text">
							{ tab.title || `Tab ${ index + 1 }` }
						</span>
						{ iconPosition === 'right' && renderIcon( isSelected ) }
					</button>
				);

				// Wrap in heading if headingLevel is set
				if ( headingLevel !== 'none' ) {
					const HeadingTag = headingLevel;
					return (
						<HeadingTag key={ tabId } className="tab-heading">
							{ buttonContent }
						</HeadingTag>
					);
				}

				// Return button with key for React
				return <span key={ tabId }>{ buttonContent }</span>;
			} );
	};

	// Build class names - add theme class if using a theme
	const classNames = [ 'gutplus-tabs' ];
	if ( attributes.currentTheme ) {
		// Sanitize theme ID for CSS class (alphanumeric and hyphens only)
		const safeThemeId = attributes.currentTheme.replace( /[^a-zA-Z0-9\-]/g, '' );
		classNames.push( `gutplus-tabs-theme-${ safeThemeId }` );
	}
	if ( attributes.enableResponsiveFallback ) {
		classNames.push( 'responsive-accordion' );
	}

	// Add alignment class
	const alignmentClass = getAlignmentClass( attributes.tabsHorizontalAlign );
	classNames.push( alignmentClass );

	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-orientation': attributes.orientation || 'horizontal',
		'data-activation-mode': attributes.activationMode || 'click',
		'data-breakpoint': attributes.responsiveBreakpoint || 768,
		'data-responsive-fallback': attributes.enableResponsiveFallback || true,
		'data-icon-position': attributes.iconPosition || 'right',
		'data-heading-level': attributes.headingLevel || 'none',
		'data-stretch-buttons': attributes.stretchButtonsToRow || false,
		'data-hide-inactive-edge': 'true',
		'data-gutplus-device': 'global',
		// Apply inline CSS variables
		...( hasInlineStyles && { style: inlineStyles } ),
	} );

	// Only add scroll wrapper for horizontal orientation
	const isHorizontal = ! attributes.orientation || attributes.orientation === 'horizontal';

	return (
		<div { ...blockProps }>
			{ /* Tab List - Tab Buttons (server-rendered for SEO) */ }
			{ isHorizontal ? (
				<div className="tabs-list-wrapper">
					<button
						className="tabs-scroll-button scroll-left"
						aria-label="Scroll left"
						type="button"
					>
						◀
					</button>
					<div
						className="tabs-list"
						role="tablist"
						aria-orientation={ getAriaOrientation( attributes.orientation ) }
						data-current-tab={ attributes.currentTab || 0 }
					>
						{ renderTabButtons() }
					</div>
					<button
						className="tabs-scroll-button scroll-right"
						aria-label="Scroll right"
						type="button"
					>
						▶
					</button>
				</div>
			) : (
				<div
					className="tabs-list"
					role="tablist"
					aria-orientation={ getAriaOrientation( attributes.orientation ) }
					data-current-tab={ attributes.currentTab || 0 }
				>
					{ renderTabButtons() }
				</div>
			) }

			{ /* Tab Panels */ }
			<div className="tabs-panels">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
