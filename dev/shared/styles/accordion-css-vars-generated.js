/**
 * Editor CSS Vars for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/accordion.json
 * Generated at: 2026-01-19T16:38:17.063Z
 *
 * This file converts atomic block attributes to inline CSS variables for editor preview.
 * Attributes are flat (e.g., "title-color", "title-padding-top") not nested objects.
 *
 * @package GuttemberPlus
 * @since 2.0.0
 */

/**
 * Format shadow value (box-shadow or text-shadow)
 */
function formatShadowValue(shadows, cssProperty) {
	if (!shadows || !Array.isArray(shadows) || shadows.length === 0) {
		return 'none';
	}

	const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
	if (validLayers.length === 0) {
		return 'none';
	}

	const formatValue = (valueObj) => {
		if (valueObj === null || valueObj === undefined) return '0px';
		if (typeof valueObj === 'string') return valueObj;
		if (typeof valueObj === 'number') return `${valueObj}px`;
		if (typeof valueObj === 'object' && valueObj !== null) {
			const value = valueObj.value ?? 0;
			const unit = valueObj.unit ?? 'px';
			return `${value}${unit}`;
		}
		return '0px';
	};

	const shadowStrings = validLayers.map(layer => {
		const parts = [];
		if (cssProperty === 'box-shadow' && layer.inset === true) {
			parts.push('inset');
		}
		parts.push(formatValue(layer.x));
		parts.push(formatValue(layer.y));
		if (cssProperty === 'box-shadow') {
			parts.push(formatValue(layer.blur));
			parts.push(formatValue(layer.spread));
		} else if (layer.blur) {
			parts.push(formatValue(layer.blur));
		}
		parts.push(layer.color);
		return parts.join(' ');
	});

	return shadowStrings.join(', ');
}

/**
 * Build inline CSS variables for editor preview
 *
 * Takes atomic attribute values and converts them to CSS custom properties.
 * Only includes attributes that have cssVar defined and outputsCSS !== false.
 *
 * @param {Object} attributes - Block attributes (atomic, flat structure)
 * @return {Object} Object of CSS variables to apply as inline styles
 */
export function buildEditorCssVars(attributes) {
	const cssVars = {};
	const attrs = attributes || {};

	// Map each atomic attribute to its CSS variable
	// animationDuration → --accordion-animation-duration
	if (attrs['animationDuration'] !== undefined && attrs['animationDuration'] !== null) {
		cssVars['--accordion-animation-duration'] = attrs['animationDuration'];
	}

	// content-color-background → --accordion-content-background
	if (attrs['content-color-background'] !== undefined && attrs['content-color-background'] !== null) {
		cssVars['--accordion-content-background'] = attrs['content-color-background'];
	}

	// divider-border-border-color-top → --accordion-content-border-top-color
	if (attrs['divider-border-border-color-top'] !== undefined && attrs['divider-border-border-color-top'] !== null) {
		cssVars['--accordion-content-border-top-color'] = attrs['divider-border-border-color-top'];
	}

	// divider-border-border-style-top → --accordion-content-border-top-style
	if (attrs['divider-border-border-style-top'] !== undefined && attrs['divider-border-border-style-top'] !== null) {
		cssVars['--accordion-content-border-top-style'] = attrs['divider-border-border-style-top'];
	}

	// divider-border-border-width-top → --accordion-content-border-top-width
	if (attrs['divider-border-border-width-top'] !== undefined && attrs['divider-border-border-width-top'] !== null) {
		cssVars['--accordion-content-border-top-width'] = attrs['divider-border-border-width-top'];
	}

	// content-color-text → --accordion-content-color
	if (attrs['content-color-text'] !== undefined && attrs['content-color-text'] !== null) {
		cssVars['--accordion-content-color'] = attrs['content-color-text'];
	}

	// content-typography-font-family → --accordion-content-font-family
	if (attrs['content-typography-font-family'] !== undefined && attrs['content-typography-font-family'] !== null) {
		cssVars['--accordion-content-font-family'] = attrs['content-typography-font-family'];
	}

	// content-typography-font-size → --accordion-content-font-size
	if (attrs['content-typography-font-size'] !== undefined && attrs['content-typography-font-size'] !== null) {
		cssVars['--accordion-content-font-size'] = attrs['content-typography-font-size'];
	}

	// content-typography-font-size → --accordion-content-font-size-mobile
	if (attrs['content-typography-font-size'] !== undefined && attrs['content-typography-font-size'] !== null) {
		cssVars['--accordion-content-font-size-mobile'] = attrs['content-typography-font-size'];
	}

	// content-typography-font-size → --accordion-content-font-size-tablet
	if (attrs['content-typography-font-size'] !== undefined && attrs['content-typography-font-size'] !== null) {
		cssVars['--accordion-content-font-size-tablet'] = attrs['content-typography-font-size'];
	}

	// content-typography-font-weight → --accordion-content-font-weight
	if (attrs['content-typography-font-weight'] !== undefined && attrs['content-typography-font-weight'] !== null) {
		cssVars['--accordion-content-font-weight'] = attrs['content-typography-font-weight'];
	}

	// content-typography-letter-spacing → --accordion-content-letter-spacing
	if (attrs['content-typography-letter-spacing'] !== undefined && attrs['content-typography-letter-spacing'] !== null) {
		cssVars['--accordion-content-letter-spacing'] = attrs['content-typography-letter-spacing'];
	}

	// content-typography-line-height → --accordion-content-line-height
	if (attrs['content-typography-line-height'] !== undefined && attrs['content-typography-line-height'] !== null) {
		cssVars['--accordion-content-line-height'] = attrs['content-typography-line-height'];
	}

	// content-typography-text-decoration → --accordion-content-text-decoration-line
	if (attrs['content-typography-text-decoration'] !== undefined && attrs['content-typography-text-decoration'] !== null) {
		cssVars['--accordion-content-text-decoration-line'] = attrs['content-typography-text-decoration'];
	}

	// content-typography-text-transform → --accordion-content-text-transform
	if (attrs['content-typography-text-transform'] !== undefined && attrs['content-typography-text-transform'] !== null) {
		cssVars['--accordion-content-text-transform'] = attrs['content-typography-text-transform'];
	}

	// content-box-padding-bottom → --accordion-contentInner-padding-bottom
	if (attrs['content-box-padding-bottom'] !== undefined && attrs['content-box-padding-bottom'] !== null) {
		cssVars['--accordion-contentInner-padding-bottom'] = attrs['content-box-padding-bottom'];
	}

	// content-box-padding-bottom → --accordion-contentInner-padding-bottom-mobile
	if (attrs['content-box-padding-bottom'] !== undefined && attrs['content-box-padding-bottom'] !== null) {
		cssVars['--accordion-contentInner-padding-bottom-mobile'] = attrs['content-box-padding-bottom'];
	}

	// content-box-padding-bottom → --accordion-contentInner-padding-bottom-tablet
	if (attrs['content-box-padding-bottom'] !== undefined && attrs['content-box-padding-bottom'] !== null) {
		cssVars['--accordion-contentInner-padding-bottom-tablet'] = attrs['content-box-padding-bottom'];
	}

	// content-box-padding-left → --accordion-contentInner-padding-left
	if (attrs['content-box-padding-left'] !== undefined && attrs['content-box-padding-left'] !== null) {
		cssVars['--accordion-contentInner-padding-left'] = attrs['content-box-padding-left'];
	}

	// content-box-padding-left → --accordion-contentInner-padding-left-mobile
	if (attrs['content-box-padding-left'] !== undefined && attrs['content-box-padding-left'] !== null) {
		cssVars['--accordion-contentInner-padding-left-mobile'] = attrs['content-box-padding-left'];
	}

	// content-box-padding-left → --accordion-contentInner-padding-left-tablet
	if (attrs['content-box-padding-left'] !== undefined && attrs['content-box-padding-left'] !== null) {
		cssVars['--accordion-contentInner-padding-left-tablet'] = attrs['content-box-padding-left'];
	}

	// content-box-padding-right → --accordion-contentInner-padding-right
	if (attrs['content-box-padding-right'] !== undefined && attrs['content-box-padding-right'] !== null) {
		cssVars['--accordion-contentInner-padding-right'] = attrs['content-box-padding-right'];
	}

	// content-box-padding-right → --accordion-contentInner-padding-right-mobile
	if (attrs['content-box-padding-right'] !== undefined && attrs['content-box-padding-right'] !== null) {
		cssVars['--accordion-contentInner-padding-right-mobile'] = attrs['content-box-padding-right'];
	}

	// content-box-padding-right → --accordion-contentInner-padding-right-tablet
	if (attrs['content-box-padding-right'] !== undefined && attrs['content-box-padding-right'] !== null) {
		cssVars['--accordion-contentInner-padding-right-tablet'] = attrs['content-box-padding-right'];
	}

	// content-box-padding-top → --accordion-contentInner-padding-top
	if (attrs['content-box-padding-top'] !== undefined && attrs['content-box-padding-top'] !== null) {
		cssVars['--accordion-contentInner-padding-top'] = attrs['content-box-padding-top'];
	}

	// content-box-padding-top → --accordion-contentInner-padding-top-mobile
	if (attrs['content-box-padding-top'] !== undefined && attrs['content-box-padding-top'] !== null) {
		cssVars['--accordion-contentInner-padding-top-mobile'] = attrs['content-box-padding-top'];
	}

	// content-box-padding-top → --accordion-contentInner-padding-top-tablet
	if (attrs['content-box-padding-top'] !== undefined && attrs['content-box-padding-top'] !== null) {
		cssVars['--accordion-contentInner-padding-top-tablet'] = attrs['content-box-padding-top'];
	}

	// title-icon-animation-rotation → --accordion-icon-animation-rotation
	if (attrs['title-icon-animation-rotation'] !== undefined && attrs['title-icon-animation-rotation'] !== null) {
		cssVars['--accordion-icon-animation-rotation'] = attrs['title-icon-animation-rotation'];
	}

	// title-icon-color → --accordion-icon-color
	if (attrs['title-icon-color'] !== undefined && attrs['title-icon-color'] !== null) {
		cssVars['--accordion-icon-color'] = attrs['title-icon-color'];
	}

	// title-icon-color-is-open → --accordion-icon-color-is-open
	if (attrs['title-icon-color-is-open'] !== undefined && attrs['title-icon-color-is-open'] !== null) {
		cssVars['--accordion-icon-color-is-open'] = attrs['title-icon-color-is-open'];
	}

	// title-icon-show → --accordion-icon-display
	if (attrs['title-icon-show'] !== undefined && attrs['title-icon-show'] !== null) {
		cssVars['--accordion-icon-display'] = attrs['title-icon-show'];
	}

	// title-icon-initial-rotation → --accordion-icon-initial-rotation
	if (attrs['title-icon-initial-rotation'] !== undefined && attrs['title-icon-initial-rotation'] !== null) {
		cssVars['--accordion-icon-initial-rotation'] = attrs['title-icon-initial-rotation'];
	}

	// title-icon-initial-rotation-is-open → --accordion-icon-initial-rotation-is-open
	if (attrs['title-icon-initial-rotation-is-open'] !== undefined && attrs['title-icon-initial-rotation-is-open'] !== null) {
		cssVars['--accordion-icon-initial-rotation-is-open'] = attrs['title-icon-initial-rotation-is-open'];
	}

	// title-icon-max-size → --accordion-icon-max-size
	if (attrs['title-icon-max-size'] !== undefined && attrs['title-icon-max-size'] !== null) {
		cssVars['--accordion-icon-max-size'] = attrs['title-icon-max-size'];
	}

	// title-icon-max-size-is-open → --accordion-icon-max-size-is-open
	if (attrs['title-icon-max-size-is-open'] !== undefined && attrs['title-icon-max-size-is-open'] !== null) {
		cssVars['--accordion-icon-max-size-is-open'] = attrs['title-icon-max-size-is-open'];
	}

	// title-icon-max-size-is-open → --accordion-icon-max-size-is-open-mobile
	if (attrs['title-icon-max-size-is-open'] !== undefined && attrs['title-icon-max-size-is-open'] !== null) {
		cssVars['--accordion-icon-max-size-is-open-mobile'] = attrs['title-icon-max-size-is-open'];
	}

	// title-icon-max-size-is-open → --accordion-icon-max-size-is-open-tablet
	if (attrs['title-icon-max-size-is-open'] !== undefined && attrs['title-icon-max-size-is-open'] !== null) {
		cssVars['--accordion-icon-max-size-is-open-tablet'] = attrs['title-icon-max-size-is-open'];
	}

	// title-icon-max-size → --accordion-icon-max-size-mobile
	if (attrs['title-icon-max-size'] !== undefined && attrs['title-icon-max-size'] !== null) {
		cssVars['--accordion-icon-max-size-mobile'] = attrs['title-icon-max-size'];
	}

	// title-icon-max-size → --accordion-icon-max-size-tablet
	if (attrs['title-icon-max-size'] !== undefined && attrs['title-icon-max-size'] !== null) {
		cssVars['--accordion-icon-max-size-tablet'] = attrs['title-icon-max-size'];
	}

	// title-icon-offset-x → --accordion-icon-offset-x
	if (attrs['title-icon-offset-x'] !== undefined && attrs['title-icon-offset-x'] !== null) {
		cssVars['--accordion-icon-offset-x'] = attrs['title-icon-offset-x'];
	}

	// title-icon-offset-x-is-open → --accordion-icon-offset-x-is-open
	if (attrs['title-icon-offset-x-is-open'] !== undefined && attrs['title-icon-offset-x-is-open'] !== null) {
		cssVars['--accordion-icon-offset-x-is-open'] = attrs['title-icon-offset-x-is-open'];
	}

	// title-icon-offset-x-is-open → --accordion-icon-offset-x-is-open-mobile
	if (attrs['title-icon-offset-x-is-open'] !== undefined && attrs['title-icon-offset-x-is-open'] !== null) {
		cssVars['--accordion-icon-offset-x-is-open-mobile'] = attrs['title-icon-offset-x-is-open'];
	}

	// title-icon-offset-x-is-open → --accordion-icon-offset-x-is-open-tablet
	if (attrs['title-icon-offset-x-is-open'] !== undefined && attrs['title-icon-offset-x-is-open'] !== null) {
		cssVars['--accordion-icon-offset-x-is-open-tablet'] = attrs['title-icon-offset-x-is-open'];
	}

	// title-icon-offset-x → --accordion-icon-offset-x-mobile
	if (attrs['title-icon-offset-x'] !== undefined && attrs['title-icon-offset-x'] !== null) {
		cssVars['--accordion-icon-offset-x-mobile'] = attrs['title-icon-offset-x'];
	}

	// title-icon-offset-x → --accordion-icon-offset-x-tablet
	if (attrs['title-icon-offset-x'] !== undefined && attrs['title-icon-offset-x'] !== null) {
		cssVars['--accordion-icon-offset-x-tablet'] = attrs['title-icon-offset-x'];
	}

	// title-icon-offset-y → --accordion-icon-offset-y
	if (attrs['title-icon-offset-y'] !== undefined && attrs['title-icon-offset-y'] !== null) {
		cssVars['--accordion-icon-offset-y'] = attrs['title-icon-offset-y'];
	}

	// title-icon-offset-y-is-open → --accordion-icon-offset-y-is-open
	if (attrs['title-icon-offset-y-is-open'] !== undefined && attrs['title-icon-offset-y-is-open'] !== null) {
		cssVars['--accordion-icon-offset-y-is-open'] = attrs['title-icon-offset-y-is-open'];
	}

	// title-icon-offset-y-is-open → --accordion-icon-offset-y-is-open-mobile
	if (attrs['title-icon-offset-y-is-open'] !== undefined && attrs['title-icon-offset-y-is-open'] !== null) {
		cssVars['--accordion-icon-offset-y-is-open-mobile'] = attrs['title-icon-offset-y-is-open'];
	}

	// title-icon-offset-y-is-open → --accordion-icon-offset-y-is-open-tablet
	if (attrs['title-icon-offset-y-is-open'] !== undefined && attrs['title-icon-offset-y-is-open'] !== null) {
		cssVars['--accordion-icon-offset-y-is-open-tablet'] = attrs['title-icon-offset-y-is-open'];
	}

	// title-icon-offset-y → --accordion-icon-offset-y-mobile
	if (attrs['title-icon-offset-y'] !== undefined && attrs['title-icon-offset-y'] !== null) {
		cssVars['--accordion-icon-offset-y-mobile'] = attrs['title-icon-offset-y'];
	}

	// title-icon-offset-y → --accordion-icon-offset-y-tablet
	if (attrs['title-icon-offset-y'] !== undefined && attrs['title-icon-offset-y'] !== null) {
		cssVars['--accordion-icon-offset-y-tablet'] = attrs['title-icon-offset-y'];
	}

	// title-icon-size → --accordion-icon-size
	if (attrs['title-icon-size'] !== undefined && attrs['title-icon-size'] !== null) {
		cssVars['--accordion-icon-size'] = attrs['title-icon-size'];
	}

	// title-icon-size-is-open → --accordion-icon-size-is-open
	if (attrs['title-icon-size-is-open'] !== undefined && attrs['title-icon-size-is-open'] !== null) {
		cssVars['--accordion-icon-size-is-open'] = attrs['title-icon-size-is-open'];
	}

	// title-icon-size-is-open → --accordion-icon-size-is-open-mobile
	if (attrs['title-icon-size-is-open'] !== undefined && attrs['title-icon-size-is-open'] !== null) {
		cssVars['--accordion-icon-size-is-open-mobile'] = attrs['title-icon-size-is-open'];
	}

	// title-icon-size-is-open → --accordion-icon-size-is-open-tablet
	if (attrs['title-icon-size-is-open'] !== undefined && attrs['title-icon-size-is-open'] !== null) {
		cssVars['--accordion-icon-size-is-open-tablet'] = attrs['title-icon-size-is-open'];
	}

	// title-icon-size → --accordion-icon-size-mobile
	if (attrs['title-icon-size'] !== undefined && attrs['title-icon-size'] !== null) {
		cssVars['--accordion-icon-size-mobile'] = attrs['title-icon-size'];
	}

	// title-icon-size → --accordion-icon-size-tablet
	if (attrs['title-icon-size'] !== undefined && attrs['title-icon-size'] !== null) {
		cssVars['--accordion-icon-size-tablet'] = attrs['title-icon-size'];
	}

	// block-box-border-color-bottom → --accordion-item-border-bottom-color
	if (attrs['block-box-border-color-bottom'] !== undefined && attrs['block-box-border-color-bottom'] !== null) {
		cssVars['--accordion-item-border-bottom-color'] = attrs['block-box-border-color-bottom'];
	}

	// block-box-border-radius-bottom-left → --accordion-item-border-bottom-left-radius
	if (attrs['block-box-border-radius-bottom-left'] !== undefined && attrs['block-box-border-radius-bottom-left'] !== null) {
		cssVars['--accordion-item-border-bottom-left-radius'] = attrs['block-box-border-radius-bottom-left'];
	}

	// block-box-border-radius-bottom-right → --accordion-item-border-bottom-right-radius
	if (attrs['block-box-border-radius-bottom-right'] !== undefined && attrs['block-box-border-radius-bottom-right'] !== null) {
		cssVars['--accordion-item-border-bottom-right-radius'] = attrs['block-box-border-radius-bottom-right'];
	}

	// block-box-border-style-bottom → --accordion-item-border-bottom-style
	if (attrs['block-box-border-style-bottom'] !== undefined && attrs['block-box-border-style-bottom'] !== null) {
		cssVars['--accordion-item-border-bottom-style'] = attrs['block-box-border-style-bottom'];
	}

	// block-box-border-width-bottom → --accordion-item-border-bottom-width
	if (attrs['block-box-border-width-bottom'] !== undefined && attrs['block-box-border-width-bottom'] !== null) {
		cssVars['--accordion-item-border-bottom-width'] = attrs['block-box-border-width-bottom'];
	}

	// block-box-border-color-left → --accordion-item-border-left-color
	if (attrs['block-box-border-color-left'] !== undefined && attrs['block-box-border-color-left'] !== null) {
		cssVars['--accordion-item-border-left-color'] = attrs['block-box-border-color-left'];
	}

	// block-box-border-style-left → --accordion-item-border-left-style
	if (attrs['block-box-border-style-left'] !== undefined && attrs['block-box-border-style-left'] !== null) {
		cssVars['--accordion-item-border-left-style'] = attrs['block-box-border-style-left'];
	}

	// block-box-border-width-left → --accordion-item-border-left-width
	if (attrs['block-box-border-width-left'] !== undefined && attrs['block-box-border-width-left'] !== null) {
		cssVars['--accordion-item-border-left-width'] = attrs['block-box-border-width-left'];
	}

	// block-box-border-color-right → --accordion-item-border-right-color
	if (attrs['block-box-border-color-right'] !== undefined && attrs['block-box-border-color-right'] !== null) {
		cssVars['--accordion-item-border-right-color'] = attrs['block-box-border-color-right'];
	}

	// block-box-border-style-right → --accordion-item-border-right-style
	if (attrs['block-box-border-style-right'] !== undefined && attrs['block-box-border-style-right'] !== null) {
		cssVars['--accordion-item-border-right-style'] = attrs['block-box-border-style-right'];
	}

	// block-box-border-width-right → --accordion-item-border-right-width
	if (attrs['block-box-border-width-right'] !== undefined && attrs['block-box-border-width-right'] !== null) {
		cssVars['--accordion-item-border-right-width'] = attrs['block-box-border-width-right'];
	}

	// block-box-border-color-top → --accordion-item-border-top-color
	if (attrs['block-box-border-color-top'] !== undefined && attrs['block-box-border-color-top'] !== null) {
		cssVars['--accordion-item-border-top-color'] = attrs['block-box-border-color-top'];
	}

	// block-box-border-radius-top-left → --accordion-item-border-top-left-radius
	if (attrs['block-box-border-radius-top-left'] !== undefined && attrs['block-box-border-radius-top-left'] !== null) {
		cssVars['--accordion-item-border-top-left-radius'] = attrs['block-box-border-radius-top-left'];
	}

	// block-box-border-radius-top-right → --accordion-item-border-top-right-radius
	if (attrs['block-box-border-radius-top-right'] !== undefined && attrs['block-box-border-radius-top-right'] !== null) {
		cssVars['--accordion-item-border-top-right-radius'] = attrs['block-box-border-radius-top-right'];
	}

	// block-box-border-style-top → --accordion-item-border-top-style
	if (attrs['block-box-border-style-top'] !== undefined && attrs['block-box-border-style-top'] !== null) {
		cssVars['--accordion-item-border-top-style'] = attrs['block-box-border-style-top'];
	}

	// block-box-border-width-top → --accordion-item-border-top-width
	if (attrs['block-box-border-width-top'] !== undefined && attrs['block-box-border-width-top'] !== null) {
		cssVars['--accordion-item-border-top-width'] = attrs['block-box-border-width-top'];
	}

	// block-box-shadow → --accordion-item-box-shadow
	if (attrs['block-box-shadow'] !== undefined && attrs['block-box-shadow'] !== null) {
		cssVars['--accordion-item-box-shadow'] = formatShadowValue(attrs['block-box-shadow'], 'box-shadow');
	}

	// block-box-margin-bottom → --accordion-item-margin-bottom
	if (attrs['block-box-margin-bottom'] !== undefined && attrs['block-box-margin-bottom'] !== null) {
		cssVars['--accordion-item-margin-bottom'] = attrs['block-box-margin-bottom'];
	}

	// block-box-margin-bottom → --accordion-item-margin-bottom-mobile
	if (attrs['block-box-margin-bottom'] !== undefined && attrs['block-box-margin-bottom'] !== null) {
		cssVars['--accordion-item-margin-bottom-mobile'] = attrs['block-box-margin-bottom'];
	}

	// block-box-margin-bottom → --accordion-item-margin-bottom-tablet
	if (attrs['block-box-margin-bottom'] !== undefined && attrs['block-box-margin-bottom'] !== null) {
		cssVars['--accordion-item-margin-bottom-tablet'] = attrs['block-box-margin-bottom'];
	}

	// block-box-margin-left → --accordion-item-margin-left
	if (attrs['block-box-margin-left'] !== undefined && attrs['block-box-margin-left'] !== null) {
		cssVars['--accordion-item-margin-left'] = attrs['block-box-margin-left'];
	}

	// block-box-margin-left → --accordion-item-margin-left-mobile
	if (attrs['block-box-margin-left'] !== undefined && attrs['block-box-margin-left'] !== null) {
		cssVars['--accordion-item-margin-left-mobile'] = attrs['block-box-margin-left'];
	}

	// block-box-margin-left → --accordion-item-margin-left-tablet
	if (attrs['block-box-margin-left'] !== undefined && attrs['block-box-margin-left'] !== null) {
		cssVars['--accordion-item-margin-left-tablet'] = attrs['block-box-margin-left'];
	}

	// block-box-margin-right → --accordion-item-margin-right
	if (attrs['block-box-margin-right'] !== undefined && attrs['block-box-margin-right'] !== null) {
		cssVars['--accordion-item-margin-right'] = attrs['block-box-margin-right'];
	}

	// block-box-margin-right → --accordion-item-margin-right-mobile
	if (attrs['block-box-margin-right'] !== undefined && attrs['block-box-margin-right'] !== null) {
		cssVars['--accordion-item-margin-right-mobile'] = attrs['block-box-margin-right'];
	}

	// block-box-margin-right → --accordion-item-margin-right-tablet
	if (attrs['block-box-margin-right'] !== undefined && attrs['block-box-margin-right'] !== null) {
		cssVars['--accordion-item-margin-right-tablet'] = attrs['block-box-margin-right'];
	}

	// block-box-margin-top → --accordion-item-margin-top
	if (attrs['block-box-margin-top'] !== undefined && attrs['block-box-margin-top'] !== null) {
		cssVars['--accordion-item-margin-top'] = attrs['block-box-margin-top'];
	}

	// block-box-margin-top → --accordion-item-margin-top-mobile
	if (attrs['block-box-margin-top'] !== undefined && attrs['block-box-margin-top'] !== null) {
		cssVars['--accordion-item-margin-top-mobile'] = attrs['block-box-margin-top'];
	}

	// block-box-margin-top → --accordion-item-margin-top-tablet
	if (attrs['block-box-margin-top'] !== undefined && attrs['block-box-margin-top'] !== null) {
		cssVars['--accordion-item-margin-top-tablet'] = attrs['block-box-margin-top'];
	}

	// titleAlignment → --accordion-title-alignment
	if (attrs['titleAlignment'] !== undefined && attrs['titleAlignment'] !== null) {
		cssVars['--accordion-title-alignment'] = attrs['titleAlignment'];
	}

	// title-color-background → --accordion-title-background
	if (attrs['title-color-background'] !== undefined && attrs['title-color-background'] !== null) {
		cssVars['--accordion-title-background'] = attrs['title-color-background'];
	}

	// title-color-background-hover → --accordion-title-background-hover
	if (attrs['title-color-background-hover'] !== undefined && attrs['title-color-background-hover'] !== null) {
		cssVars['--accordion-title-background-hover'] = attrs['title-color-background-hover'];
	}

	// title-color-text → --accordion-title-color
	if (attrs['title-color-text'] !== undefined && attrs['title-color-text'] !== null) {
		cssVars['--accordion-title-color'] = attrs['title-color-text'];
	}

	// title-color-text-hover → --accordion-title-color-hover
	if (attrs['title-color-text-hover'] !== undefined && attrs['title-color-text-hover'] !== null) {
		cssVars['--accordion-title-color-hover'] = attrs['title-color-text-hover'];
	}

	// title-typography-decoration-color → --accordion-title-decoration-color
	if (attrs['title-typography-decoration-color'] !== undefined && attrs['title-typography-decoration-color'] !== null) {
		cssVars['--accordion-title-decoration-color'] = attrs['title-typography-decoration-color'];
	}

	// title-typography-decoration-style → --accordion-title-decoration-style
	if (attrs['title-typography-decoration-style'] !== undefined && attrs['title-typography-decoration-style'] !== null) {
		cssVars['--accordion-title-decoration-style'] = attrs['title-typography-decoration-style'];
	}

	// title-typography-decoration-width → --accordion-title-decoration-width
	if (attrs['title-typography-decoration-width'] !== undefined && attrs['title-typography-decoration-width'] !== null) {
		cssVars['--accordion-title-decoration-width'] = attrs['title-typography-decoration-width'];
	}

	// title-typography-font-family → --accordion-title-font-family
	if (attrs['title-typography-font-family'] !== undefined && attrs['title-typography-font-family'] !== null) {
		cssVars['--accordion-title-font-family'] = attrs['title-typography-font-family'];
	}

	// title-typography-font-size → --accordion-title-font-size
	if (attrs['title-typography-font-size'] !== undefined && attrs['title-typography-font-size'] !== null) {
		cssVars['--accordion-title-font-size'] = attrs['title-typography-font-size'];
	}

	// title-typography-font-size → --accordion-title-font-size-mobile
	if (attrs['title-typography-font-size'] !== undefined && attrs['title-typography-font-size'] !== null) {
		cssVars['--accordion-title-font-size-mobile'] = attrs['title-typography-font-size'];
	}

	// title-typography-font-size → --accordion-title-font-size-tablet
	if (attrs['title-typography-font-size'] !== undefined && attrs['title-typography-font-size'] !== null) {
		cssVars['--accordion-title-font-size-tablet'] = attrs['title-typography-font-size'];
	}

	// title-typography-font-weight → --accordion-title-font-weight
	if (attrs['title-typography-font-weight'] !== undefined && attrs['title-typography-font-weight'] !== null) {
		cssVars['--accordion-title-font-weight'] = attrs['title-typography-font-weight'];
	}

	// title-typography-letter-spacing → --accordion-title-letter-spacing
	if (attrs['title-typography-letter-spacing'] !== undefined && attrs['title-typography-letter-spacing'] !== null) {
		cssVars['--accordion-title-letter-spacing'] = attrs['title-typography-letter-spacing'];
	}

	// title-typography-line-height → --accordion-title-line-height
	if (attrs['title-typography-line-height'] !== undefined && attrs['title-typography-line-height'] !== null) {
		cssVars['--accordion-title-line-height'] = attrs['title-typography-line-height'];
	}

	// title-typography-offset-x → --accordion-title-offset-x
	if (attrs['title-typography-offset-x'] !== undefined && attrs['title-typography-offset-x'] !== null) {
		cssVars['--accordion-title-offset-x'] = attrs['title-typography-offset-x'];
	}

	// title-typography-offset-x → --accordion-title-offset-x-mobile
	if (attrs['title-typography-offset-x'] !== undefined && attrs['title-typography-offset-x'] !== null) {
		cssVars['--accordion-title-offset-x-mobile'] = attrs['title-typography-offset-x'];
	}

	// title-typography-offset-x → --accordion-title-offset-x-tablet
	if (attrs['title-typography-offset-x'] !== undefined && attrs['title-typography-offset-x'] !== null) {
		cssVars['--accordion-title-offset-x-tablet'] = attrs['title-typography-offset-x'];
	}

	// title-typography-offset-y → --accordion-title-offset-y
	if (attrs['title-typography-offset-y'] !== undefined && attrs['title-typography-offset-y'] !== null) {
		cssVars['--accordion-title-offset-y'] = attrs['title-typography-offset-y'];
	}

	// title-typography-offset-y → --accordion-title-offset-y-mobile
	if (attrs['title-typography-offset-y'] !== undefined && attrs['title-typography-offset-y'] !== null) {
		cssVars['--accordion-title-offset-y-mobile'] = attrs['title-typography-offset-y'];
	}

	// title-typography-offset-y → --accordion-title-offset-y-tablet
	if (attrs['title-typography-offset-y'] !== undefined && attrs['title-typography-offset-y'] !== null) {
		cssVars['--accordion-title-offset-y-tablet'] = attrs['title-typography-offset-y'];
	}

	// header-box-padding-bottom → --accordion-title-padding-bottom
	if (attrs['header-box-padding-bottom'] !== undefined && attrs['header-box-padding-bottom'] !== null) {
		cssVars['--accordion-title-padding-bottom'] = attrs['header-box-padding-bottom'];
	}

	// header-box-padding-bottom → --accordion-title-padding-bottom-mobile
	if (attrs['header-box-padding-bottom'] !== undefined && attrs['header-box-padding-bottom'] !== null) {
		cssVars['--accordion-title-padding-bottom-mobile'] = attrs['header-box-padding-bottom'];
	}

	// header-box-padding-bottom → --accordion-title-padding-bottom-tablet
	if (attrs['header-box-padding-bottom'] !== undefined && attrs['header-box-padding-bottom'] !== null) {
		cssVars['--accordion-title-padding-bottom-tablet'] = attrs['header-box-padding-bottom'];
	}

	// header-box-padding-left → --accordion-title-padding-left
	if (attrs['header-box-padding-left'] !== undefined && attrs['header-box-padding-left'] !== null) {
		cssVars['--accordion-title-padding-left'] = attrs['header-box-padding-left'];
	}

	// header-box-padding-left → --accordion-title-padding-left-mobile
	if (attrs['header-box-padding-left'] !== undefined && attrs['header-box-padding-left'] !== null) {
		cssVars['--accordion-title-padding-left-mobile'] = attrs['header-box-padding-left'];
	}

	// header-box-padding-left → --accordion-title-padding-left-tablet
	if (attrs['header-box-padding-left'] !== undefined && attrs['header-box-padding-left'] !== null) {
		cssVars['--accordion-title-padding-left-tablet'] = attrs['header-box-padding-left'];
	}

	// header-box-padding-right → --accordion-title-padding-right
	if (attrs['header-box-padding-right'] !== undefined && attrs['header-box-padding-right'] !== null) {
		cssVars['--accordion-title-padding-right'] = attrs['header-box-padding-right'];
	}

	// header-box-padding-right → --accordion-title-padding-right-mobile
	if (attrs['header-box-padding-right'] !== undefined && attrs['header-box-padding-right'] !== null) {
		cssVars['--accordion-title-padding-right-mobile'] = attrs['header-box-padding-right'];
	}

	// header-box-padding-right → --accordion-title-padding-right-tablet
	if (attrs['header-box-padding-right'] !== undefined && attrs['header-box-padding-right'] !== null) {
		cssVars['--accordion-title-padding-right-tablet'] = attrs['header-box-padding-right'];
	}

	// header-box-padding-top → --accordion-title-padding-top
	if (attrs['header-box-padding-top'] !== undefined && attrs['header-box-padding-top'] !== null) {
		cssVars['--accordion-title-padding-top'] = attrs['header-box-padding-top'];
	}

	// header-box-padding-top → --accordion-title-padding-top-mobile
	if (attrs['header-box-padding-top'] !== undefined && attrs['header-box-padding-top'] !== null) {
		cssVars['--accordion-title-padding-top-mobile'] = attrs['header-box-padding-top'];
	}

	// header-box-padding-top → --accordion-title-padding-top-tablet
	if (attrs['header-box-padding-top'] !== undefined && attrs['header-box-padding-top'] !== null) {
		cssVars['--accordion-title-padding-top-tablet'] = attrs['header-box-padding-top'];
	}

	// title-typography-text-decoration → --accordion-title-text-decoration-line
	if (attrs['title-typography-text-decoration'] !== undefined && attrs['title-typography-text-decoration'] !== null) {
		cssVars['--accordion-title-text-decoration-line'] = attrs['title-typography-text-decoration'];
	}

	// title-typography-text-transform → --accordion-title-text-transform
	if (attrs['title-typography-text-transform'] !== undefined && attrs['title-typography-text-transform'] !== null) {
		cssVars['--accordion-title-text-transform'] = attrs['title-typography-text-transform'];
	}

	// title-typography-no-line-break → --accordion-title-white-space
	if (attrs['title-typography-no-line-break'] !== undefined && attrs['title-typography-no-line-break'] !== null) {
		cssVars['--accordion-title-white-space'] = attrs['title-typography-no-line-break'];
	}

	// accordionWidth → --accordion-width
	if (attrs['accordionWidth'] !== undefined && attrs['accordionWidth'] !== null) {
		cssVars['--accordion-width'] = attrs['accordionWidth'];
	}

	// accordionWidth → --accordion-width-mobile
	if (attrs['accordionWidth'] !== undefined && attrs['accordionWidth'] !== null) {
		cssVars['--accordion-width-mobile'] = attrs['accordionWidth'];
	}

	// accordionWidth → --accordion-width-tablet
	if (attrs['accordionWidth'] !== undefined && attrs['accordionWidth'] !== null) {
		cssVars['--accordion-width-tablet'] = attrs['accordionWidth'];
	}

	return cssVars;
}
