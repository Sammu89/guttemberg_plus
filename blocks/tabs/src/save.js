/**
 * Tabs Block - Save Component
 *
 * Renders the frontend HTML structure with proper ARIA attributes for tabs.
 * Applies effective styles as inline CSS variables.
 * Supports horizontal/vertical orientation and responsive fallback.
 *
 * @package
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import {
	getAllEffectiveValues,
	getTabButtonAria,
	getTabPanelAria,
} from '@shared';

/**
 * Tabs Save Component
 *
 * @param {Object} props            Block props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function Save( { attributes } ) {
	// Get CSS defaults (will be available via wp_localize_script in frontend)
	const cssDefaults = window.tabsDefaults || {};

	// Note: In frontend, themes will be loaded via PHP and effective values resolved
	// For save, we'll use attributes and CSS defaults
	const effectiveValues = getAllEffectiveValues(
		attributes,
		{}, // Theme values will be resolved in frontend
		cssDefaults,
		'tabs'
	);

	/**
	 * Build inline CSS variables for styling
	 */
	const getInlineStyles = () => {
		const tabListPadding = effectiveValues.tabListPadding || {
			top: 8,
			right: 8,
			bottom: 8,
			left: 8,
		};
		const panelPadding = effectiveValues.panelPadding || {
			top: 24,
			right: 24,
			bottom: 24,
			left: 24,
		};
		const tabButtonPadding = effectiveValues.titlePadding || {
			top: 12,
			right: 24,
			bottom: 12,
			left: 24,
		};
		const containerBorderRadius = effectiveValues.containerBorderRadius || {
			topLeft: 4,
			topRight: 4,
			bottomLeft: 4,
			bottomRight: 4,
		};
		const tabButtonBorderRadius = effectiveValues.tabButtonBorderRadius || {
			topLeft: 4,
			topRight: 4,
			bottomLeft: 0,
			bottomRight: 0,
		};

		return {
			// Container
			'--tabs-container-bg':
				effectiveValues.containerBackgroundColor || 'transparent',
			'--tabs-container-border': `${
				effectiveValues.containerBorderWidth || 0
			}px ${ effectiveValues.containerBorderStyle || 'solid' } ${
				effectiveValues.containerBorderColor || 'transparent'
			}`,
			'--tabs-container-border-radius': `${ containerBorderRadius.topLeft }px ${ containerBorderRadius.topRight }px ${ containerBorderRadius.bottomRight }px ${ containerBorderRadius.bottomLeft }px`,
			'--tabs-container-shadow':
				effectiveValues.containerShadow || 'none',

			// Tab List
			'--tabs-list-bg': effectiveValues.tabListBackground || '#f5f5f5',
			'--tabs-list-border-bottom': `${
				effectiveValues.tabListBorderBottomWidth || 2
			}px ${ effectiveValues.tabListBorderBottomStyle || 'solid' } ${
				effectiveValues.tabListBorderBottomColor || '#dddddd'
			}`,
			'--tabs-list-gap': `${ effectiveValues.tabListGap || 4 }px`,
			'--tabs-list-padding': `${ tabListPadding.top }px ${ tabListPadding.right }px ${ tabListPadding.bottom }px ${ tabListPadding.left }px`,
			'--tabs-alignment': effectiveValues.tabsAlignment || 'left',

			// Tab Button (inactive)
			'--tab-button-color': effectiveValues.titleColor || '#666666',
			'--tab-button-bg':
				effectiveValues.titleBackgroundColor || 'transparent',
			'--tab-button-border': `${
				effectiveValues.accordionBorderThickness || 1
			}px ${
				effectiveValues.accordionBorderStyle || 'solid'
			} transparent`,
			'--tab-button-border-radius': `${ tabButtonBorderRadius.topLeft }px ${ tabButtonBorderRadius.topRight }px ${ tabButtonBorderRadius.bottomRight }px ${ tabButtonBorderRadius.bottomLeft }px`,
			'--tab-button-padding': `${ tabButtonPadding.top }px ${ tabButtonPadding.right }px ${ tabButtonPadding.bottom }px ${ tabButtonPadding.left }px`,
			'--tab-button-font-size': `${
				effectiveValues.titleFontSize || 16
			}px`,
			'--tab-button-font-weight':
				effectiveValues.titleFontWeight || '500',
			'--tab-button-font-style':
				effectiveValues.titleFontStyle || 'normal',
			'--tab-button-text-transform':
				effectiveValues.titleTextTransform || 'none',
			'--tab-button-text-decoration':
				effectiveValues.titleTextDecoration || 'none',
			'--tab-button-text-align':
				effectiveValues.titleAlignment || 'center',

			// Tab Button (hover)
			'--tab-button-hover-color':
				effectiveValues.hoverTitleColor ||
				effectiveValues.titleColor ||
				'#333333',
			'--tab-button-hover-bg':
				effectiveValues.hoverTitleBackgroundColor || '#e8e8e8',
			'--tab-button-hover-border-color': '#cccccc',

			// Tab Button (active)
			'--tab-button-active-color':
				effectiveValues.tabButtonActiveColor || '#000000',
			'--tab-button-active-bg':
				effectiveValues.tabButtonActiveBackground || '#ffffff',
			'--tab-button-active-border-color':
				effectiveValues.tabButtonActiveBorderColor || '#dddddd',
			'--tab-button-active-border-bottom-color':
				effectiveValues.tabButtonActiveBorderBottomColor ||
				'transparent',

			// Panel
			'--panel-bg': effectiveValues.panelBackground || '#ffffff',
			'--panel-color': effectiveValues.panelColor || '#333333',
			'--panel-border': `${ effectiveValues.panelBorderWidth || 1 }px ${
				effectiveValues.panelBorderStyle || 'solid'
			} ${ effectiveValues.panelBorderColor || '#dddddd' }`,
			'--panel-border-radius': `${
				effectiveValues.panelBorderRadius || 0
			}px`,
			'--panel-padding': `${ panelPadding.top }px ${ panelPadding.right }px ${ panelPadding.bottom }px ${ panelPadding.left }px`,
			'--panel-font-size': `${ effectiveValues.panelFontSize || 16 }px`,
			'--panel-line-height': effectiveValues.panelLineHeight || 1.6,

			// Divider
			'--divider-border':
				effectiveValues.dividerThickness > 0
					? `${ effectiveValues.dividerThickness }px ${
							effectiveValues.dividerStyle || 'solid'
					  } ${ effectiveValues.dividerColor || '#dddddd' }`
					: 'none',

			// Icon
			'--icon-size': `${
				effectiveValues.iconSize || effectiveValues.titleFontSize || 18
			}px`,
			'--icon-color':
				effectiveValues.iconColor ||
				effectiveValues.titleColor ||
				'inherit',
			'--icon-spacing': '8px',

			// Vertical specific
			'--vertical-tab-list-width': `${
				effectiveValues.verticalTabListWidth || 200
			}px`,
			'--vertical-tab-button-text-align':
				effectiveValues.verticalTabButtonTextAlign || 'left',

			// Animation
			'--transition-duration': `${
				effectiveValues.transitionDuration || 200
			}ms`,
			'--transition-easing':
				effectiveValues.transitionEasing || 'ease-in-out',

			// Responsive
			'--responsive-breakpoint': `${
				attributes.responsiveBreakpoint || 768
			}px`,
		};
	};

	const cssVars = getInlineStyles();

	/**
	 * Render icon based on settings
	 */
	const renderIcon = () => {
		if ( ! effectiveValues.showIcon ) {
			return null;
		}

		const iconContent = effectiveValues.iconTypeClosed || '📄';
		const isImage = iconContent.startsWith( 'http' );

		if ( isImage ) {
			return (
				<img
					src={ iconContent }
					alt=""
					aria-hidden="true"
					className="tab-icon tab-icon-image"
				/>
			);
		}

		return (
			<span className="tab-icon" aria-hidden="true">
				{ iconContent }
			</span>
		);
	};

	const blockProps = useBlockProps.save( {
		className: `wp-block-tabs ${
			attributes.enableResponsiveFallback ? 'responsive-accordion' : ''
		}`,
		'data-orientation': attributes.orientation || 'horizontal',
		'data-activation-mode': attributes.activationMode || 'auto',
		'data-breakpoint': attributes.responsiveBreakpoint || 768,
		'data-responsive-fallback': attributes.enableResponsiveFallback || true,
		style: cssVars,
	} );

	return (
		<div { ...blockProps }>
			{ /* Tab List (Navigation) */ }
			<div
				className="tabs-list"
				role="tablist"
				aria-orientation={ attributes.orientation || 'horizontal' }
				data-alignment={ effectiveValues.tabsAlignment || 'left' }
			>
				{ attributes.tabs.map( ( tab, index ) => {
					const tabId = `tab-${ tab.id }`;
					const panelId = `panel-${ tab.id }`;
					const isActive = index === ( attributes.currentTab || 0 );

					// ARIA attributes for tab button
					const buttonAria = getTabButtonAria(
						tabId,
						panelId,
						isActive,
						index,
						tab.isDisabled
					);

					return (
						<button
							key={ tab.id }
							type="button"
							className={ `tab-button ${
								isActive ? 'active' : ''
							} ${ tab.isDisabled ? 'disabled' : '' }` }
							disabled={ tab.isDisabled }
							{ ...buttonAria }
						>
							{ effectiveValues.showIcon && renderIcon() }
							<span className="tab-button-text">
								{ tab.title || `Tab ${ index + 1 }` }
							</span>
						</button>
					);
				} ) }
			</div>

			{ /* Tab Panels */ }
			<div className="tabs-panels">
				{ attributes.tabs.map( ( tab, index ) => {
					const tabId = `tab-${ tab.id }`;
					const panelId = `panel-${ tab.id }`;
					const isActive = index === ( attributes.currentTab || 0 );

					// ARIA attributes for panel
					const panelAria = getTabPanelAria( panelId, tabId, index );

					return (
						<div
							key={ tab.id }
							className={ `tab-panel ${
								isActive ? 'active' : ''
							}` }
							{ ...panelAria }
							{ ...( ! isActive && { hidden: true } ) }
						>
							<RichText.Content
								tagName="div"
								value={ tab.content || '' }
								className="tab-panel-content"
							/>
						</div>
					);
				} ) }
			</div>

			{ /* Hidden accordion buttons for responsive fallback */ }
			{ attributes.enableResponsiveFallback && (
				<div
					className="accordion-fallback"
					style={ { display: 'none' } }
				>
					{ attributes.tabs.map( ( tab, index ) => {
						const accordionBtnId = `accordion-btn-${ tab.id }`;
						const accordionPanelId = `accordion-panel-${ tab.id }`;
						const isOpen = index === ( attributes.currentTab || 0 );

						return (
							<div
								key={ `accordion-${ tab.id }` }
								className="accordion-item"
							>
								<button
									type="button"
									className="accordion-button"
									id={ accordionBtnId }
									aria-expanded={ isOpen }
									aria-controls={ accordionPanelId }
								>
									{ tab.title || `Tab ${ index + 1 }` }
								</button>
								<div
									id={ accordionPanelId }
									className="accordion-panel"
									role="region"
									aria-labelledby={ accordionBtnId }
									{ ...( ! isOpen && { hidden: true } ) }
								>
									<RichText.Content
										tagName="div"
										value={ tab.content || '' }
									/>
								</div>
							</div>
						);
					} ) }
				</div>
			) }
		</div>
	);
}
