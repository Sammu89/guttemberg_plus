/**
 * Accordion Block - Save Component
 *
 * Renders the frontend HTML structure with proper ARIA attributes.
 * Applies effective styles as inline CSS variables.
 *
 * @package
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getAllEffectiveValues, getAccordionButtonAria, getAccordionPanelAria } from '@shared';

/**
 * Accordion Save Component
 *
 * @param {Object} props            Block props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function Save( { attributes } ) {
	// Get CSS defaults (will be available via wp_localize_script in frontend)
	const cssDefaults = window.accordionDefaults || {};

	// Note: In frontend, themes will be loaded via PHP and effective values resolved
	// For save, we'll use attributes and CSS defaults
	const effectiveValues = getAllEffectiveValues(
		attributes,
		{}, // Theme values will be resolved in frontend
		cssDefaults,
		'accordion'
	);

	const accordionId = attributes.accordionId || '';
	const buttonId = `${ accordionId }-btn`;
	const panelId = `${ accordionId }-panel`;

	/**
	 * Build inline CSS variables for styling
	 */
	const getInlineStyles = () => {
		const titlePadding = effectiveValues.titlePadding || {
			top: 16,
			right: 16,
			bottom: 16,
			left: 16,
		};
		const contentPadding = effectiveValues.contentPadding || {
			top: 16,
			right: 16,
			bottom: 16,
			left: 16,
		};
		const borderRadius = effectiveValues.accordionBorderRadius || {
			topLeft: 4,
			topRight: 4,
			bottomLeft: 4,
			bottomRight: 4,
		};

		return {
			'--accordion-title-bg': effectiveValues.titleBackgroundColor || '#f5f5f5',
			'--accordion-title-color': effectiveValues.titleColor || '#333333',
			'--accordion-title-font-size': `${ effectiveValues.titleFontSize || 18 }px`,
			'--accordion-title-font-weight': effectiveValues.titleFontWeight || '600',
			'--accordion-title-font-style': effectiveValues.titleFontStyle || 'normal',
			'--accordion-title-text-transform': effectiveValues.titleTextTransform || 'none',
			'--accordion-title-text-decoration': effectiveValues.titleTextDecoration || 'none',
			'--accordion-title-alignment': effectiveValues.titleAlignment || 'left',
			'--accordion-title-padding': `${ titlePadding.top }px ${ titlePadding.right }px ${ titlePadding.bottom }px ${ titlePadding.left }px`,
			'--accordion-content-bg': effectiveValues.contentBackgroundColor || '#ffffff',
			'--accordion-content-color': effectiveValues.contentColor || '#333333',
			'--accordion-content-padding': `${ contentPadding.top }px ${ contentPadding.right }px ${ contentPadding.bottom }px ${ contentPadding.left }px`,
			'--accordion-border': `${ effectiveValues.accordionBorderThickness || 1 }px ${
				effectiveValues.accordionBorderStyle || 'solid'
			} ${ effectiveValues.accordionBorderColor || '#dddddd' }`,
			'--accordion-border-radius': `${ borderRadius.topLeft }px ${ borderRadius.topRight }px ${ borderRadius.bottomRight }px ${ borderRadius.bottomLeft }px`,
			'--accordion-shadow': effectiveValues.accordionShadow || 'none',
			'--accordion-margin-bottom': `${ effectiveValues.accordionMarginBottom || 8 }px`,
			'--accordion-divider-border':
				effectiveValues.dividerBorderThickness > 0
					? `${ effectiveValues.dividerBorderThickness }px ${
							effectiveValues.dividerBorderStyle || 'solid'
					  } ${ effectiveValues.dividerBorderColor || '#dddddd' }`
					: 'none',
			'--accordion-icon-size': `${
				effectiveValues.iconSize || effectiveValues.titleFontSize || 20
			}px`,
			'--accordion-icon-color':
				effectiveValues.iconColor || effectiveValues.titleColor || '#666666',
			'--accordion-icon-rotation': `${ effectiveValues.iconRotation || 0 }deg`,
			'--accordion-hover-title-bg': effectiveValues.hoverTitleBackgroundColor || '#e0e0e0',
			'--accordion-hover-title-color':
				effectiveValues.hoverTitleColor || effectiveValues.titleColor || '#000000',
			'--accordion-active-title-bg':
				effectiveValues.activeTitleBackgroundColor ||
				effectiveValues.titleBackgroundColor ||
				'#f5f5f5',
			'--accordion-active-title-color':
				effectiveValues.activeTitleColor || effectiveValues.titleColor || '#333333',
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

		// ARIA attributes for button
		const buttonAria = getAccordionButtonAria(
			buttonId,
			panelId,
			attributes.initiallyOpen || false
		);

		const buttonContent = (
			<button
				type="button"
				className={ `accordion-title ${ iconPosition ? `icon-${ iconPosition }` : '' }` }
				{ ...buttonAria }
			>
				{ ( iconPosition === 'left' || iconPosition === 'extreme-left' ) && renderIcon() }
				<RichText.Content
					tagName="span"
					value={ attributes.title || '' }
					className="accordion-title-text"
				/>
				{ ( iconPosition === 'right' || iconPosition === 'extreme-right' ) && renderIcon() }
			</button>
		);

		if ( headingLevel !== 'none' ) {
			const HeadingTag = headingLevel;
			return <HeadingTag className="accordion-heading">{ buttonContent }</HeadingTag>;
		}

		return buttonContent;
	};

	// ARIA attributes for panel
	const panelAria = getAccordionPanelAria( panelId, buttonId );

	const blockProps = useBlockProps.save( {
		className: 'wp-block-accordion',
		'data-accordion-id': accordionId,
		'data-allow-multiple': attributes.allowMultipleOpen || false,
		style: cssVars,
	} );

	return (
		<div { ...blockProps }>
			<div
				className={ `accordion-item ${ attributes.initiallyOpen ? 'is-open' : '' }` }
				data-item-id="0"
			>
				{ renderTitle() }

				<div
					className="accordion-content"
					{ ...panelAria }
					{ ...( ! attributes.initiallyOpen && { hidden: true } ) }
				>
					<RichText.Content
						tagName="div"
						value={ attributes.content || '' }
						className="accordion-content-text"
					/>
				</div>
			</div>
		</div>
	);
}
