/**
 * Editor CSS Vars for Toc Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/toc.json
 * Generated at: 2026-01-19T16:38:17.079Z
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
	// blockBorderColor → --toc-border-color
	if (attrs['blockBorderColor'] !== undefined && attrs['blockBorderColor'] !== null) {
		cssVars['--toc-border-color'] = attrs['blockBorderColor'];
	}

	// blockBorderRadius → --toc-border-radius
	if (attrs['blockBorderRadius'] !== undefined && attrs['blockBorderRadius'] !== null) {
		cssVars['--toc-border-radius'] = attrs['blockBorderRadius'];
	}

	// blockShadow → --toc-border-shadow
	if (attrs['blockShadow'] !== undefined && attrs['blockShadow'] !== null) {
		cssVars['--toc-border-shadow'] = formatShadowValue(attrs['blockShadow'], 'box-shadow');
	}

	// blockShadowHover → --toc-border-shadow-hover
	if (attrs['blockShadowHover'] !== undefined && attrs['blockShadowHover'] !== null) {
		cssVars['--toc-border-shadow-hover'] = formatShadowValue(attrs['blockShadowHover'], 'box-shadow');
	}

	// blockBorderStyle → --toc-border-style
	if (attrs['blockBorderStyle'] !== undefined && attrs['blockBorderStyle'] !== null) {
		cssVars['--toc-border-style'] = attrs['blockBorderStyle'];
	}

	// blockBorderWidth → --toc-border-width
	if (attrs['blockBorderWidth'] !== undefined && attrs['blockBorderWidth'] !== null) {
		cssVars['--toc-border-width'] = attrs['blockBorderWidth'];
	}

	// h1-color-text → --toc-h1-color
	if (attrs['h1-color-text'] !== undefined && attrs['h1-color-text'] !== null) {
		cssVars['--toc-h1-color'] = attrs['h1-color-text'];
	}

	// h1-color-text-active → --toc-h1-color-active
	if (attrs['h1-color-text-active'] !== undefined && attrs['h1-color-text-active'] !== null) {
		cssVars['--toc-h1-color-active'] = attrs['h1-color-text-active'];
	}

	// h1-color-text-hover → --toc-h1-color-hover
	if (attrs['h1-color-text-hover'] !== undefined && attrs['h1-color-text-hover'] !== null) {
		cssVars['--toc-h1-color-hover'] = attrs['h1-color-text-hover'];
	}

	// h1-color-text-visited → --toc-h1-color-visited
	if (attrs['h1-color-text-visited'] !== undefined && attrs['h1-color-text-visited'] !== null) {
		cssVars['--toc-h1-color-visited'] = attrs['h1-color-text-visited'];
	}

	// h1FontSize → --toc-h1-font-size
	if (attrs['h1FontSize'] !== undefined && attrs['h1FontSize'] !== null) {
		cssVars['--toc-h1-font-size'] = attrs['h1FontSize'];
	}

	// h1FontStyle → --toc-h1-font-style
	if (attrs['h1FontStyle'] !== undefined && attrs['h1FontStyle'] !== null) {
		cssVars['--toc-h1-font-style'] = attrs['h1FontStyle'];
	}

	// h1FontWeight → --toc-h1-font-weight
	if (attrs['h1FontWeight'] !== undefined && attrs['h1FontWeight'] !== null) {
		cssVars['--toc-h1-font-weight'] = attrs['h1FontWeight'];
	}

	// h1TextDecoration → --toc-h1-text-decoration
	if (attrs['h1TextDecoration'] !== undefined && attrs['h1TextDecoration'] !== null) {
		cssVars['--toc-h1-text-decoration'] = attrs['h1TextDecoration'];
	}

	// h1TextTransform → --toc-h1-text-transform
	if (attrs['h1TextTransform'] !== undefined && attrs['h1TextTransform'] !== null) {
		cssVars['--toc-h1-text-transform'] = attrs['h1TextTransform'];
	}

	// h2-color-text → --toc-h2-color
	if (attrs['h2-color-text'] !== undefined && attrs['h2-color-text'] !== null) {
		cssVars['--toc-h2-color'] = attrs['h2-color-text'];
	}

	// h2-color-text-active → --toc-h2-color-active
	if (attrs['h2-color-text-active'] !== undefined && attrs['h2-color-text-active'] !== null) {
		cssVars['--toc-h2-color-active'] = attrs['h2-color-text-active'];
	}

	// h2-color-text-hover → --toc-h2-color-hover
	if (attrs['h2-color-text-hover'] !== undefined && attrs['h2-color-text-hover'] !== null) {
		cssVars['--toc-h2-color-hover'] = attrs['h2-color-text-hover'];
	}

	// h2-color-text-visited → --toc-h2-color-visited
	if (attrs['h2-color-text-visited'] !== undefined && attrs['h2-color-text-visited'] !== null) {
		cssVars['--toc-h2-color-visited'] = attrs['h2-color-text-visited'];
	}

	// h2FontSize → --toc-h2-font-size
	if (attrs['h2FontSize'] !== undefined && attrs['h2FontSize'] !== null) {
		cssVars['--toc-h2-font-size'] = attrs['h2FontSize'];
	}

	// h2FontStyle → --toc-h2-font-style
	if (attrs['h2FontStyle'] !== undefined && attrs['h2FontStyle'] !== null) {
		cssVars['--toc-h2-font-style'] = attrs['h2FontStyle'];
	}

	// h2FontWeight → --toc-h2-font-weight
	if (attrs['h2FontWeight'] !== undefined && attrs['h2FontWeight'] !== null) {
		cssVars['--toc-h2-font-weight'] = attrs['h2FontWeight'];
	}

	// h2TextDecoration → --toc-h2-text-decoration
	if (attrs['h2TextDecoration'] !== undefined && attrs['h2TextDecoration'] !== null) {
		cssVars['--toc-h2-text-decoration'] = attrs['h2TextDecoration'];
	}

	// h2TextTransform → --toc-h2-text-transform
	if (attrs['h2TextTransform'] !== undefined && attrs['h2TextTransform'] !== null) {
		cssVars['--toc-h2-text-transform'] = attrs['h2TextTransform'];
	}

	// h3-color-text → --toc-h3-color
	if (attrs['h3-color-text'] !== undefined && attrs['h3-color-text'] !== null) {
		cssVars['--toc-h3-color'] = attrs['h3-color-text'];
	}

	// h3-color-text-active → --toc-h3-color-active
	if (attrs['h3-color-text-active'] !== undefined && attrs['h3-color-text-active'] !== null) {
		cssVars['--toc-h3-color-active'] = attrs['h3-color-text-active'];
	}

	// h3-color-text-hover → --toc-h3-color-hover
	if (attrs['h3-color-text-hover'] !== undefined && attrs['h3-color-text-hover'] !== null) {
		cssVars['--toc-h3-color-hover'] = attrs['h3-color-text-hover'];
	}

	// h3-color-text-visited → --toc-h3-color-visited
	if (attrs['h3-color-text-visited'] !== undefined && attrs['h3-color-text-visited'] !== null) {
		cssVars['--toc-h3-color-visited'] = attrs['h3-color-text-visited'];
	}

	// h3FontSize → --toc-h3-font-size
	if (attrs['h3FontSize'] !== undefined && attrs['h3FontSize'] !== null) {
		cssVars['--toc-h3-font-size'] = attrs['h3FontSize'];
	}

	// h3FontStyle → --toc-h3-font-style
	if (attrs['h3FontStyle'] !== undefined && attrs['h3FontStyle'] !== null) {
		cssVars['--toc-h3-font-style'] = attrs['h3FontStyle'];
	}

	// h3FontWeight → --toc-h3-font-weight
	if (attrs['h3FontWeight'] !== undefined && attrs['h3FontWeight'] !== null) {
		cssVars['--toc-h3-font-weight'] = attrs['h3FontWeight'];
	}

	// h3TextDecoration → --toc-h3-text-decoration
	if (attrs['h3TextDecoration'] !== undefined && attrs['h3TextDecoration'] !== null) {
		cssVars['--toc-h3-text-decoration'] = attrs['h3TextDecoration'];
	}

	// h3TextTransform → --toc-h3-text-transform
	if (attrs['h3TextTransform'] !== undefined && attrs['h3TextTransform'] !== null) {
		cssVars['--toc-h3-text-transform'] = attrs['h3TextTransform'];
	}

	// h4-color-text → --toc-h4-color
	if (attrs['h4-color-text'] !== undefined && attrs['h4-color-text'] !== null) {
		cssVars['--toc-h4-color'] = attrs['h4-color-text'];
	}

	// h4-color-text-active → --toc-h4-color-active
	if (attrs['h4-color-text-active'] !== undefined && attrs['h4-color-text-active'] !== null) {
		cssVars['--toc-h4-color-active'] = attrs['h4-color-text-active'];
	}

	// h4-color-text-hover → --toc-h4-color-hover
	if (attrs['h4-color-text-hover'] !== undefined && attrs['h4-color-text-hover'] !== null) {
		cssVars['--toc-h4-color-hover'] = attrs['h4-color-text-hover'];
	}

	// h4-color-text-visited → --toc-h4-color-visited
	if (attrs['h4-color-text-visited'] !== undefined && attrs['h4-color-text-visited'] !== null) {
		cssVars['--toc-h4-color-visited'] = attrs['h4-color-text-visited'];
	}

	// h4FontSize → --toc-h4-font-size
	if (attrs['h4FontSize'] !== undefined && attrs['h4FontSize'] !== null) {
		cssVars['--toc-h4-font-size'] = attrs['h4FontSize'];
	}

	// h4FontStyle → --toc-h4-font-style
	if (attrs['h4FontStyle'] !== undefined && attrs['h4FontStyle'] !== null) {
		cssVars['--toc-h4-font-style'] = attrs['h4FontStyle'];
	}

	// h4FontWeight → --toc-h4-font-weight
	if (attrs['h4FontWeight'] !== undefined && attrs['h4FontWeight'] !== null) {
		cssVars['--toc-h4-font-weight'] = attrs['h4FontWeight'];
	}

	// h4TextDecoration → --toc-h4-text-decoration
	if (attrs['h4TextDecoration'] !== undefined && attrs['h4TextDecoration'] !== null) {
		cssVars['--toc-h4-text-decoration'] = attrs['h4TextDecoration'];
	}

	// h4TextTransform → --toc-h4-text-transform
	if (attrs['h4TextTransform'] !== undefined && attrs['h4TextTransform'] !== null) {
		cssVars['--toc-h4-text-transform'] = attrs['h4TextTransform'];
	}

	// h5-color-text → --toc-h5-color
	if (attrs['h5-color-text'] !== undefined && attrs['h5-color-text'] !== null) {
		cssVars['--toc-h5-color'] = attrs['h5-color-text'];
	}

	// h5-color-text-active → --toc-h5-color-active
	if (attrs['h5-color-text-active'] !== undefined && attrs['h5-color-text-active'] !== null) {
		cssVars['--toc-h5-color-active'] = attrs['h5-color-text-active'];
	}

	// h5-color-text-hover → --toc-h5-color-hover
	if (attrs['h5-color-text-hover'] !== undefined && attrs['h5-color-text-hover'] !== null) {
		cssVars['--toc-h5-color-hover'] = attrs['h5-color-text-hover'];
	}

	// h5-color-text-visited → --toc-h5-color-visited
	if (attrs['h5-color-text-visited'] !== undefined && attrs['h5-color-text-visited'] !== null) {
		cssVars['--toc-h5-color-visited'] = attrs['h5-color-text-visited'];
	}

	// h5FontSize → --toc-h5-font-size
	if (attrs['h5FontSize'] !== undefined && attrs['h5FontSize'] !== null) {
		cssVars['--toc-h5-font-size'] = attrs['h5FontSize'];
	}

	// h5FontStyle → --toc-h5-font-style
	if (attrs['h5FontStyle'] !== undefined && attrs['h5FontStyle'] !== null) {
		cssVars['--toc-h5-font-style'] = attrs['h5FontStyle'];
	}

	// h5FontWeight → --toc-h5-font-weight
	if (attrs['h5FontWeight'] !== undefined && attrs['h5FontWeight'] !== null) {
		cssVars['--toc-h5-font-weight'] = attrs['h5FontWeight'];
	}

	// h5TextDecoration → --toc-h5-text-decoration
	if (attrs['h5TextDecoration'] !== undefined && attrs['h5TextDecoration'] !== null) {
		cssVars['--toc-h5-text-decoration'] = attrs['h5TextDecoration'];
	}

	// h5TextTransform → --toc-h5-text-transform
	if (attrs['h5TextTransform'] !== undefined && attrs['h5TextTransform'] !== null) {
		cssVars['--toc-h5-text-transform'] = attrs['h5TextTransform'];
	}

	// h6-color-text → --toc-h6-color
	if (attrs['h6-color-text'] !== undefined && attrs['h6-color-text'] !== null) {
		cssVars['--toc-h6-color'] = attrs['h6-color-text'];
	}

	// h6-color-text-active → --toc-h6-color-active
	if (attrs['h6-color-text-active'] !== undefined && attrs['h6-color-text-active'] !== null) {
		cssVars['--toc-h6-color-active'] = attrs['h6-color-text-active'];
	}

	// h6-color-text-hover → --toc-h6-color-hover
	if (attrs['h6-color-text-hover'] !== undefined && attrs['h6-color-text-hover'] !== null) {
		cssVars['--toc-h6-color-hover'] = attrs['h6-color-text-hover'];
	}

	// h6-color-text-visited → --toc-h6-color-visited
	if (attrs['h6-color-text-visited'] !== undefined && attrs['h6-color-text-visited'] !== null) {
		cssVars['--toc-h6-color-visited'] = attrs['h6-color-text-visited'];
	}

	// h6FontSize → --toc-h6-font-size
	if (attrs['h6FontSize'] !== undefined && attrs['h6FontSize'] !== null) {
		cssVars['--toc-h6-font-size'] = attrs['h6FontSize'];
	}

	// h6FontStyle → --toc-h6-font-style
	if (attrs['h6FontStyle'] !== undefined && attrs['h6FontStyle'] !== null) {
		cssVars['--toc-h6-font-style'] = attrs['h6FontStyle'];
	}

	// h6FontWeight → --toc-h6-font-weight
	if (attrs['h6FontWeight'] !== undefined && attrs['h6FontWeight'] !== null) {
		cssVars['--toc-h6-font-weight'] = attrs['h6FontWeight'];
	}

	// h6TextDecoration → --toc-h6-text-decoration
	if (attrs['h6TextDecoration'] !== undefined && attrs['h6TextDecoration'] !== null) {
		cssVars['--toc-h6-text-decoration'] = attrs['h6TextDecoration'];
	}

	// h6TextTransform → --toc-h6-text-transform
	if (attrs['h6TextTransform'] !== undefined && attrs['h6TextTransform'] !== null) {
		cssVars['--toc-h6-text-transform'] = attrs['h6TextTransform'];
	}

	// toc-icon-animation-rotation → --toc-icon-animation-rotation
	if (attrs['toc-icon-animation-rotation'] !== undefined && attrs['toc-icon-animation-rotation'] !== null) {
		cssVars['--toc-icon-animation-rotation'] = attrs['toc-icon-animation-rotation'];
	}

	// toc-icon-color → --toc-icon-color
	if (attrs['toc-icon-color'] !== undefined && attrs['toc-icon-color'] !== null) {
		cssVars['--toc-icon-color'] = attrs['toc-icon-color'];
	}

	// toc-icon-color-is-open → --toc-icon-color-is-open
	if (attrs['toc-icon-color-is-open'] !== undefined && attrs['toc-icon-color-is-open'] !== null) {
		cssVars['--toc-icon-color-is-open'] = attrs['toc-icon-color-is-open'];
	}

	// toc-icon-show → --toc-icon-display
	if (attrs['toc-icon-show'] !== undefined && attrs['toc-icon-show'] !== null) {
		cssVars['--toc-icon-display'] = attrs['toc-icon-show'];
	}

	// toc-icon-initial-rotation → --toc-icon-initial-rotation
	if (attrs['toc-icon-initial-rotation'] !== undefined && attrs['toc-icon-initial-rotation'] !== null) {
		cssVars['--toc-icon-initial-rotation'] = attrs['toc-icon-initial-rotation'];
	}

	// toc-icon-initial-rotation-is-open → --toc-icon-initial-rotation-is-open
	if (attrs['toc-icon-initial-rotation-is-open'] !== undefined && attrs['toc-icon-initial-rotation-is-open'] !== null) {
		cssVars['--toc-icon-initial-rotation-is-open'] = attrs['toc-icon-initial-rotation-is-open'];
	}

	// toc-icon-max-size → --toc-icon-max-size
	if (attrs['toc-icon-max-size'] !== undefined && attrs['toc-icon-max-size'] !== null) {
		cssVars['--toc-icon-max-size'] = attrs['toc-icon-max-size'];
	}

	// toc-icon-max-size-is-open → --toc-icon-max-size-is-open
	if (attrs['toc-icon-max-size-is-open'] !== undefined && attrs['toc-icon-max-size-is-open'] !== null) {
		cssVars['--toc-icon-max-size-is-open'] = attrs['toc-icon-max-size-is-open'];
	}

	// toc-icon-max-size-is-open → --toc-icon-max-size-is-open-mobile
	if (attrs['toc-icon-max-size-is-open'] !== undefined && attrs['toc-icon-max-size-is-open'] !== null) {
		cssVars['--toc-icon-max-size-is-open-mobile'] = attrs['toc-icon-max-size-is-open'];
	}

	// toc-icon-max-size-is-open → --toc-icon-max-size-is-open-tablet
	if (attrs['toc-icon-max-size-is-open'] !== undefined && attrs['toc-icon-max-size-is-open'] !== null) {
		cssVars['--toc-icon-max-size-is-open-tablet'] = attrs['toc-icon-max-size-is-open'];
	}

	// toc-icon-max-size → --toc-icon-max-size-mobile
	if (attrs['toc-icon-max-size'] !== undefined && attrs['toc-icon-max-size'] !== null) {
		cssVars['--toc-icon-max-size-mobile'] = attrs['toc-icon-max-size'];
	}

	// toc-icon-max-size → --toc-icon-max-size-tablet
	if (attrs['toc-icon-max-size'] !== undefined && attrs['toc-icon-max-size'] !== null) {
		cssVars['--toc-icon-max-size-tablet'] = attrs['toc-icon-max-size'];
	}

	// toc-icon-offset-x → --toc-icon-offset-x
	if (attrs['toc-icon-offset-x'] !== undefined && attrs['toc-icon-offset-x'] !== null) {
		cssVars['--toc-icon-offset-x'] = attrs['toc-icon-offset-x'];
	}

	// toc-icon-offset-x-is-open → --toc-icon-offset-x-is-open
	if (attrs['toc-icon-offset-x-is-open'] !== undefined && attrs['toc-icon-offset-x-is-open'] !== null) {
		cssVars['--toc-icon-offset-x-is-open'] = attrs['toc-icon-offset-x-is-open'];
	}

	// toc-icon-offset-x-is-open → --toc-icon-offset-x-is-open-mobile
	if (attrs['toc-icon-offset-x-is-open'] !== undefined && attrs['toc-icon-offset-x-is-open'] !== null) {
		cssVars['--toc-icon-offset-x-is-open-mobile'] = attrs['toc-icon-offset-x-is-open'];
	}

	// toc-icon-offset-x-is-open → --toc-icon-offset-x-is-open-tablet
	if (attrs['toc-icon-offset-x-is-open'] !== undefined && attrs['toc-icon-offset-x-is-open'] !== null) {
		cssVars['--toc-icon-offset-x-is-open-tablet'] = attrs['toc-icon-offset-x-is-open'];
	}

	// toc-icon-offset-x → --toc-icon-offset-x-mobile
	if (attrs['toc-icon-offset-x'] !== undefined && attrs['toc-icon-offset-x'] !== null) {
		cssVars['--toc-icon-offset-x-mobile'] = attrs['toc-icon-offset-x'];
	}

	// toc-icon-offset-x → --toc-icon-offset-x-tablet
	if (attrs['toc-icon-offset-x'] !== undefined && attrs['toc-icon-offset-x'] !== null) {
		cssVars['--toc-icon-offset-x-tablet'] = attrs['toc-icon-offset-x'];
	}

	// toc-icon-offset-y → --toc-icon-offset-y
	if (attrs['toc-icon-offset-y'] !== undefined && attrs['toc-icon-offset-y'] !== null) {
		cssVars['--toc-icon-offset-y'] = attrs['toc-icon-offset-y'];
	}

	// toc-icon-offset-y-is-open → --toc-icon-offset-y-is-open
	if (attrs['toc-icon-offset-y-is-open'] !== undefined && attrs['toc-icon-offset-y-is-open'] !== null) {
		cssVars['--toc-icon-offset-y-is-open'] = attrs['toc-icon-offset-y-is-open'];
	}

	// toc-icon-offset-y-is-open → --toc-icon-offset-y-is-open-mobile
	if (attrs['toc-icon-offset-y-is-open'] !== undefined && attrs['toc-icon-offset-y-is-open'] !== null) {
		cssVars['--toc-icon-offset-y-is-open-mobile'] = attrs['toc-icon-offset-y-is-open'];
	}

	// toc-icon-offset-y-is-open → --toc-icon-offset-y-is-open-tablet
	if (attrs['toc-icon-offset-y-is-open'] !== undefined && attrs['toc-icon-offset-y-is-open'] !== null) {
		cssVars['--toc-icon-offset-y-is-open-tablet'] = attrs['toc-icon-offset-y-is-open'];
	}

	// toc-icon-offset-y → --toc-icon-offset-y-mobile
	if (attrs['toc-icon-offset-y'] !== undefined && attrs['toc-icon-offset-y'] !== null) {
		cssVars['--toc-icon-offset-y-mobile'] = attrs['toc-icon-offset-y'];
	}

	// toc-icon-offset-y → --toc-icon-offset-y-tablet
	if (attrs['toc-icon-offset-y'] !== undefined && attrs['toc-icon-offset-y'] !== null) {
		cssVars['--toc-icon-offset-y-tablet'] = attrs['toc-icon-offset-y'];
	}

	// toc-icon-size → --toc-icon-size
	if (attrs['toc-icon-size'] !== undefined && attrs['toc-icon-size'] !== null) {
		cssVars['--toc-icon-size'] = attrs['toc-icon-size'];
	}

	// toc-icon-size-is-open → --toc-icon-size-is-open
	if (attrs['toc-icon-size-is-open'] !== undefined && attrs['toc-icon-size-is-open'] !== null) {
		cssVars['--toc-icon-size-is-open'] = attrs['toc-icon-size-is-open'];
	}

	// toc-icon-size-is-open → --toc-icon-size-is-open-mobile
	if (attrs['toc-icon-size-is-open'] !== undefined && attrs['toc-icon-size-is-open'] !== null) {
		cssVars['--toc-icon-size-is-open-mobile'] = attrs['toc-icon-size-is-open'];
	}

	// toc-icon-size-is-open → --toc-icon-size-is-open-tablet
	if (attrs['toc-icon-size-is-open'] !== undefined && attrs['toc-icon-size-is-open'] !== null) {
		cssVars['--toc-icon-size-is-open-tablet'] = attrs['toc-icon-size-is-open'];
	}

	// toc-icon-size → --toc-icon-size-mobile
	if (attrs['toc-icon-size'] !== undefined && attrs['toc-icon-size'] !== null) {
		cssVars['--toc-icon-size-mobile'] = attrs['toc-icon-size'];
	}

	// toc-icon-size → --toc-icon-size-tablet
	if (attrs['toc-icon-size'] !== undefined && attrs['toc-icon-size'] !== null) {
		cssVars['--toc-icon-size-tablet'] = attrs['toc-icon-size'];
	}

	// itemSpacing → --toc-item-spacing
	if (attrs['itemSpacing'] !== undefined && attrs['itemSpacing'] !== null) {
		cssVars['--toc-item-spacing'] = attrs['itemSpacing'];
	}

	// levelIndent → --toc-level-indent
	if (attrs['levelIndent'] !== undefined && attrs['levelIndent'] !== null) {
		cssVars['--toc-level-indent'] = attrs['levelIndent'];
	}

	// link-color-text → --toc-link-color
	if (attrs['link-color-text'] !== undefined && attrs['link-color-text'] !== null) {
		cssVars['--toc-link-color'] = attrs['link-color-text'];
	}

	// link-color-text-active → --toc-link-color-active
	if (attrs['link-color-text-active'] !== undefined && attrs['link-color-text-active'] !== null) {
		cssVars['--toc-link-color-active'] = attrs['link-color-text-active'];
	}

	// link-color-text-hover → --toc-link-color-hover
	if (attrs['link-color-text-hover'] !== undefined && attrs['link-color-text-hover'] !== null) {
		cssVars['--toc-link-color-hover'] = attrs['link-color-text-hover'];
	}

	// link-color-text-visited → --toc-link-color-visited
	if (attrs['link-color-text-visited'] !== undefined && attrs['link-color-text-visited'] !== null) {
		cssVars['--toc-link-color-visited'] = attrs['link-color-text-visited'];
	}

	// positionTop → --toc-position-top
	if (attrs['positionTop'] !== undefined && attrs['positionTop'] !== null) {
		cssVars['--toc-position-top'] = attrs['positionTop'];
	}

	// titleAlignment → --toc-title-alignment
	if (attrs['titleAlignment'] !== undefined && attrs['titleAlignment'] !== null) {
		cssVars['--toc-title-alignment'] = attrs['titleAlignment'];
	}

	// title-color-background → --toc-title-background
	if (attrs['title-color-background'] !== undefined && attrs['title-color-background'] !== null) {
		cssVars['--toc-title-background'] = attrs['title-color-background'];
	}

	// title-color-background-hover → --toc-title-background-hover
	if (attrs['title-color-background-hover'] !== undefined && attrs['title-color-background-hover'] !== null) {
		cssVars['--toc-title-background-hover'] = attrs['title-color-background-hover'];
	}

	// title-color-text → --toc-title-color
	if (attrs['title-color-text'] !== undefined && attrs['title-color-text'] !== null) {
		cssVars['--toc-title-color'] = attrs['title-color-text'];
	}

	// title-color-text-hover → --toc-title-color-hover
	if (attrs['title-color-text-hover'] !== undefined && attrs['title-color-text-hover'] !== null) {
		cssVars['--toc-title-color-hover'] = attrs['title-color-text-hover'];
	}

	// titleFontSize → --toc-title-font-size
	if (attrs['titleFontSize'] !== undefined && attrs['titleFontSize'] !== null) {
		cssVars['--toc-title-font-size'] = attrs['titleFontSize'];
	}

	// titleFontStyle → --toc-title-font-style
	if (attrs['titleFontStyle'] !== undefined && attrs['titleFontStyle'] !== null) {
		cssVars['--toc-title-font-style'] = attrs['titleFontStyle'];
	}

	// titleFontWeight → --toc-title-font-weight
	if (attrs['titleFontWeight'] !== undefined && attrs['titleFontWeight'] !== null) {
		cssVars['--toc-title-font-weight'] = attrs['titleFontWeight'];
	}

	// titleTextDecoration → --toc-title-text-decoration
	if (attrs['titleTextDecoration'] !== undefined && attrs['titleTextDecoration'] !== null) {
		cssVars['--toc-title-text-decoration'] = attrs['titleTextDecoration'];
	}

	// titleTextTransform → --toc-title-text-transform
	if (attrs['titleTextTransform'] !== undefined && attrs['titleTextTransform'] !== null) {
		cssVars['--toc-title-text-transform'] = attrs['titleTextTransform'];
	}

	// tocWidth → --toc-width
	if (attrs['tocWidth'] !== undefined && attrs['tocWidth'] !== null) {
		cssVars['--toc-width'] = attrs['tocWidth'];
	}

	// tocWidth → --toc-width-mobile
	if (attrs['tocWidth'] !== undefined && attrs['tocWidth'] !== null) {
		cssVars['--toc-width-mobile'] = attrs['tocWidth'];
	}

	// tocWidth → --toc-width-tablet
	if (attrs['tocWidth'] !== undefined && attrs['tocWidth'] !== null) {
		cssVars['--toc-width-tablet'] = attrs['tocWidth'];
	}

	// wrapperBackgroundColor → --toc-wrapper-background-color
	if (attrs['wrapperBackgroundColor'] !== undefined && attrs['wrapperBackgroundColor'] !== null) {
		cssVars['--toc-wrapper-background-color'] = attrs['wrapperBackgroundColor'];
	}

	// wrapperPadding → --toc-wrapper-padding
	if (attrs['wrapperPadding'] !== undefined && attrs['wrapperPadding'] !== null) {
		cssVars['--toc-wrapper-padding'] = attrs['wrapperPadding'];
	}

	// zIndex → --toc-z-index
	if (attrs['zIndex'] !== undefined && attrs['zIndex'] !== null) {
		cssVars['--toc-z-index'] = attrs['zIndex'];
	}

	return cssVars;
}
