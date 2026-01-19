/**
 * Editor CSS Vars for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/tabs.json
 * Generated at: 2026-01-19T16:38:17.071Z
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
	// borderColor → --tabs-border-color
	if (attrs['borderColor'] !== undefined && attrs['borderColor'] !== null) {
		cssVars['--tabs-border-color'] = attrs['borderColor'];
	}

	// borderRadius → --tabs-border-radius
	if (attrs['borderRadius'] !== undefined && attrs['borderRadius'] !== null) {
		cssVars['--tabs-border-radius'] = attrs['borderRadius'];
	}

	// shadow → --tabs-border-shadow
	if (attrs['shadow'] !== undefined && attrs['shadow'] !== null) {
		cssVars['--tabs-border-shadow'] = formatShadowValue(attrs['shadow'], 'box-shadow');
	}

	// shadowHover → --tabs-border-shadow-hover
	if (attrs['shadowHover'] !== undefined && attrs['shadowHover'] !== null) {
		cssVars['--tabs-border-shadow-hover'] = formatShadowValue(attrs['shadowHover'], 'box-shadow');
	}

	// borderStyle → --tabs-border-style
	if (attrs['borderStyle'] !== undefined && attrs['borderStyle'] !== null) {
		cssVars['--tabs-border-style'] = attrs['borderStyle'];
	}

	// borderWidth → --tabs-border-width
	if (attrs['borderWidth'] !== undefined && attrs['borderWidth'] !== null) {
		cssVars['--tabs-border-width'] = attrs['borderWidth'];
	}

	// tabButtonActiveBorderColor → --tabs-button-active-border-color
	if (attrs['tabButtonActiveBorderColor'] !== undefined && attrs['tabButtonActiveBorderColor'] !== null) {
		cssVars['--tabs-button-active-border-color'] = attrs['tabButtonActiveBorderColor'];
	}

	// tabButtonActiveContentBorderColor → --tabs-button-active-content-border-color
	if (attrs['tabButtonActiveContentBorderColor'] !== undefined && attrs['tabButtonActiveContentBorderColor'] !== null) {
		cssVars['--tabs-button-active-content-border-color'] = attrs['tabButtonActiveContentBorderColor'];
	}

	// tabButtonActiveContentBorderStyle → --tabs-button-active-content-border-style
	if (attrs['tabButtonActiveContentBorderStyle'] !== undefined && attrs['tabButtonActiveContentBorderStyle'] !== null) {
		cssVars['--tabs-button-active-content-border-style'] = attrs['tabButtonActiveContentBorderStyle'];
	}

	// tabButtonActiveContentBorderWidth → --tabs-button-active-content-border-width
	if (attrs['tabButtonActiveContentBorderWidth'] !== undefined && attrs['tabButtonActiveContentBorderWidth'] !== null) {
		cssVars['--tabs-button-active-content-border-width'] = attrs['tabButtonActiveContentBorderWidth'];
	}

	// tabButtonActiveFontWeight → --tabs-button-active-font-weight
	if (attrs['tabButtonActiveFontWeight'] !== undefined && attrs['tabButtonActiveFontWeight'] !== null) {
		cssVars['--tabs-button-active-font-weight'] = attrs['tabButtonActiveFontWeight'];
	}

	// tab-button-color-background → --tabs-button-background
	if (attrs['tab-button-color-background'] !== undefined && attrs['tab-button-color-background'] !== null) {
		cssVars['--tabs-button-background'] = attrs['tab-button-color-background'];
	}

	// tab-button-color-background-active → --tabs-button-background-active
	if (attrs['tab-button-color-background-active'] !== undefined && attrs['tab-button-color-background-active'] !== null) {
		cssVars['--tabs-button-background-active'] = attrs['tab-button-color-background-active'];
	}

	// tab-button-color-background-hover → --tabs-button-background-hover
	if (attrs['tab-button-color-background-hover'] !== undefined && attrs['tab-button-color-background-hover'] !== null) {
		cssVars['--tabs-button-background-hover'] = attrs['tab-button-color-background-hover'];
	}

	// tabButtonBorderColor → --tabs-button-border-color
	if (attrs['tabButtonBorderColor'] !== undefined && attrs['tabButtonBorderColor'] !== null) {
		cssVars['--tabs-button-border-color'] = attrs['tabButtonBorderColor'];
	}

	// tabButtonBorderRadius → --tabs-button-border-radius
	if (attrs['tabButtonBorderRadius'] !== undefined && attrs['tabButtonBorderRadius'] !== null) {
		cssVars['--tabs-button-border-radius'] = attrs['tabButtonBorderRadius'];
	}

	// tabButtonShadow → --tabs-button-border-shadow
	if (attrs['tabButtonShadow'] !== undefined && attrs['tabButtonShadow'] !== null) {
		cssVars['--tabs-button-border-shadow'] = formatShadowValue(attrs['tabButtonShadow'], 'box-shadow');
	}

	// tabButtonShadowHover → --tabs-button-border-shadow-hover
	if (attrs['tabButtonShadowHover'] !== undefined && attrs['tabButtonShadowHover'] !== null) {
		cssVars['--tabs-button-border-shadow-hover'] = formatShadowValue(attrs['tabButtonShadowHover'], 'box-shadow');
	}

	// tabButtonBorderStyle → --tabs-button-border-style
	if (attrs['tabButtonBorderStyle'] !== undefined && attrs['tabButtonBorderStyle'] !== null) {
		cssVars['--tabs-button-border-style'] = attrs['tabButtonBorderStyle'];
	}

	// tabButtonBorderWidth → --tabs-button-border-width
	if (attrs['tabButtonBorderWidth'] !== undefined && attrs['tabButtonBorderWidth'] !== null) {
		cssVars['--tabs-button-border-width'] = attrs['tabButtonBorderWidth'];
	}

	// tab-button-color-text → --tabs-button-color
	if (attrs['tab-button-color-text'] !== undefined && attrs['tab-button-color-text'] !== null) {
		cssVars['--tabs-button-color'] = attrs['tab-button-color-text'];
	}

	// tab-button-color-text-active → --tabs-button-color-active
	if (attrs['tab-button-color-text-active'] !== undefined && attrs['tab-button-color-text-active'] !== null) {
		cssVars['--tabs-button-color-active'] = attrs['tab-button-color-text-active'];
	}

	// tab-button-color-text-hover → --tabs-button-color-hover
	if (attrs['tab-button-color-text-hover'] !== undefined && attrs['tab-button-color-text-hover'] !== null) {
		cssVars['--tabs-button-color-hover'] = attrs['tab-button-color-text-hover'];
	}

	// tabButtonFontSize → --tabs-button-font-size
	if (attrs['tabButtonFontSize'] !== undefined && attrs['tabButtonFontSize'] !== null) {
		cssVars['--tabs-button-font-size'] = attrs['tabButtonFontSize'];
	}

	// tabButtonFontStyle → --tabs-button-font-style
	if (attrs['tabButtonFontStyle'] !== undefined && attrs['tabButtonFontStyle'] !== null) {
		cssVars['--tabs-button-font-style'] = attrs['tabButtonFontStyle'];
	}

	// tabButtonFontWeight → --tabs-button-font-weight
	if (attrs['tabButtonFontWeight'] !== undefined && attrs['tabButtonFontWeight'] !== null) {
		cssVars['--tabs-button-font-weight'] = attrs['tabButtonFontWeight'];
	}

	// tabsButtonGap → --tabs-button-gap
	if (attrs['tabsButtonGap'] !== undefined && attrs['tabsButtonGap'] !== null) {
		cssVars['--tabs-button-gap'] = attrs['tabsButtonGap'];
	}

	// tabButtonPadding → --tabs-button-padding
	if (attrs['tabButtonPadding'] !== undefined && attrs['tabButtonPadding'] !== null) {
		cssVars['--tabs-button-padding'] = attrs['tabButtonPadding'];
	}

	// tabButtonTextAlign → --tabs-button-text-align
	if (attrs['tabButtonTextAlign'] !== undefined && attrs['tabButtonTextAlign'] !== null) {
		cssVars['--tabs-button-text-align'] = attrs['tabButtonTextAlign'];
	}

	// tabButtonTextDecoration → --tabs-button-text-decoration
	if (attrs['tabButtonTextDecoration'] !== undefined && attrs['tabButtonTextDecoration'] !== null) {
		cssVars['--tabs-button-text-decoration'] = attrs['tabButtonTextDecoration'];
	}

	// tabButtonTextTransform → --tabs-button-text-transform
	if (attrs['tabButtonTextTransform'] !== undefined && attrs['tabButtonTextTransform'] !== null) {
		cssVars['--tabs-button-text-transform'] = attrs['tabButtonTextTransform'];
	}

	// tab-icon-animation-rotation → --tabs-icon-animation-rotation
	if (attrs['tab-icon-animation-rotation'] !== undefined && attrs['tab-icon-animation-rotation'] !== null) {
		cssVars['--tabs-icon-animation-rotation'] = attrs['tab-icon-animation-rotation'];
	}

	// tab-icon-color → --tabs-icon-color
	if (attrs['tab-icon-color'] !== undefined && attrs['tab-icon-color'] !== null) {
		cssVars['--tabs-icon-color'] = attrs['tab-icon-color'];
	}

	// tab-icon-color-is-open → --tabs-icon-color-is-open
	if (attrs['tab-icon-color-is-open'] !== undefined && attrs['tab-icon-color-is-open'] !== null) {
		cssVars['--tabs-icon-color-is-open'] = attrs['tab-icon-color-is-open'];
	}

	// tab-icon-show → --tabs-icon-display
	if (attrs['tab-icon-show'] !== undefined && attrs['tab-icon-show'] !== null) {
		cssVars['--tabs-icon-display'] = attrs['tab-icon-show'];
	}

	// tab-icon-initial-rotation → --tabs-icon-initial-rotation
	if (attrs['tab-icon-initial-rotation'] !== undefined && attrs['tab-icon-initial-rotation'] !== null) {
		cssVars['--tabs-icon-initial-rotation'] = attrs['tab-icon-initial-rotation'];
	}

	// tab-icon-initial-rotation-is-open → --tabs-icon-initial-rotation-is-open
	if (attrs['tab-icon-initial-rotation-is-open'] !== undefined && attrs['tab-icon-initial-rotation-is-open'] !== null) {
		cssVars['--tabs-icon-initial-rotation-is-open'] = attrs['tab-icon-initial-rotation-is-open'];
	}

	// tab-icon-max-size → --tabs-icon-max-size
	if (attrs['tab-icon-max-size'] !== undefined && attrs['tab-icon-max-size'] !== null) {
		cssVars['--tabs-icon-max-size'] = attrs['tab-icon-max-size'];
	}

	// tab-icon-max-size-is-open → --tabs-icon-max-size-is-open
	if (attrs['tab-icon-max-size-is-open'] !== undefined && attrs['tab-icon-max-size-is-open'] !== null) {
		cssVars['--tabs-icon-max-size-is-open'] = attrs['tab-icon-max-size-is-open'];
	}

	// tab-icon-max-size-is-open → --tabs-icon-max-size-is-open-mobile
	if (attrs['tab-icon-max-size-is-open'] !== undefined && attrs['tab-icon-max-size-is-open'] !== null) {
		cssVars['--tabs-icon-max-size-is-open-mobile'] = attrs['tab-icon-max-size-is-open'];
	}

	// tab-icon-max-size-is-open → --tabs-icon-max-size-is-open-tablet
	if (attrs['tab-icon-max-size-is-open'] !== undefined && attrs['tab-icon-max-size-is-open'] !== null) {
		cssVars['--tabs-icon-max-size-is-open-tablet'] = attrs['tab-icon-max-size-is-open'];
	}

	// tab-icon-max-size → --tabs-icon-max-size-mobile
	if (attrs['tab-icon-max-size'] !== undefined && attrs['tab-icon-max-size'] !== null) {
		cssVars['--tabs-icon-max-size-mobile'] = attrs['tab-icon-max-size'];
	}

	// tab-icon-max-size → --tabs-icon-max-size-tablet
	if (attrs['tab-icon-max-size'] !== undefined && attrs['tab-icon-max-size'] !== null) {
		cssVars['--tabs-icon-max-size-tablet'] = attrs['tab-icon-max-size'];
	}

	// tab-icon-offset-x → --tabs-icon-offset-x
	if (attrs['tab-icon-offset-x'] !== undefined && attrs['tab-icon-offset-x'] !== null) {
		cssVars['--tabs-icon-offset-x'] = attrs['tab-icon-offset-x'];
	}

	// tab-icon-offset-x-is-open → --tabs-icon-offset-x-is-open
	if (attrs['tab-icon-offset-x-is-open'] !== undefined && attrs['tab-icon-offset-x-is-open'] !== null) {
		cssVars['--tabs-icon-offset-x-is-open'] = attrs['tab-icon-offset-x-is-open'];
	}

	// tab-icon-offset-x-is-open → --tabs-icon-offset-x-is-open-mobile
	if (attrs['tab-icon-offset-x-is-open'] !== undefined && attrs['tab-icon-offset-x-is-open'] !== null) {
		cssVars['--tabs-icon-offset-x-is-open-mobile'] = attrs['tab-icon-offset-x-is-open'];
	}

	// tab-icon-offset-x-is-open → --tabs-icon-offset-x-is-open-tablet
	if (attrs['tab-icon-offset-x-is-open'] !== undefined && attrs['tab-icon-offset-x-is-open'] !== null) {
		cssVars['--tabs-icon-offset-x-is-open-tablet'] = attrs['tab-icon-offset-x-is-open'];
	}

	// tab-icon-offset-x → --tabs-icon-offset-x-mobile
	if (attrs['tab-icon-offset-x'] !== undefined && attrs['tab-icon-offset-x'] !== null) {
		cssVars['--tabs-icon-offset-x-mobile'] = attrs['tab-icon-offset-x'];
	}

	// tab-icon-offset-x → --tabs-icon-offset-x-tablet
	if (attrs['tab-icon-offset-x'] !== undefined && attrs['tab-icon-offset-x'] !== null) {
		cssVars['--tabs-icon-offset-x-tablet'] = attrs['tab-icon-offset-x'];
	}

	// tab-icon-offset-y → --tabs-icon-offset-y
	if (attrs['tab-icon-offset-y'] !== undefined && attrs['tab-icon-offset-y'] !== null) {
		cssVars['--tabs-icon-offset-y'] = attrs['tab-icon-offset-y'];
	}

	// tab-icon-offset-y-is-open → --tabs-icon-offset-y-is-open
	if (attrs['tab-icon-offset-y-is-open'] !== undefined && attrs['tab-icon-offset-y-is-open'] !== null) {
		cssVars['--tabs-icon-offset-y-is-open'] = attrs['tab-icon-offset-y-is-open'];
	}

	// tab-icon-offset-y-is-open → --tabs-icon-offset-y-is-open-mobile
	if (attrs['tab-icon-offset-y-is-open'] !== undefined && attrs['tab-icon-offset-y-is-open'] !== null) {
		cssVars['--tabs-icon-offset-y-is-open-mobile'] = attrs['tab-icon-offset-y-is-open'];
	}

	// tab-icon-offset-y-is-open → --tabs-icon-offset-y-is-open-tablet
	if (attrs['tab-icon-offset-y-is-open'] !== undefined && attrs['tab-icon-offset-y-is-open'] !== null) {
		cssVars['--tabs-icon-offset-y-is-open-tablet'] = attrs['tab-icon-offset-y-is-open'];
	}

	// tab-icon-offset-y → --tabs-icon-offset-y-mobile
	if (attrs['tab-icon-offset-y'] !== undefined && attrs['tab-icon-offset-y'] !== null) {
		cssVars['--tabs-icon-offset-y-mobile'] = attrs['tab-icon-offset-y'];
	}

	// tab-icon-offset-y → --tabs-icon-offset-y-tablet
	if (attrs['tab-icon-offset-y'] !== undefined && attrs['tab-icon-offset-y'] !== null) {
		cssVars['--tabs-icon-offset-y-tablet'] = attrs['tab-icon-offset-y'];
	}

	// tab-icon-size → --tabs-icon-size
	if (attrs['tab-icon-size'] !== undefined && attrs['tab-icon-size'] !== null) {
		cssVars['--tabs-icon-size'] = attrs['tab-icon-size'];
	}

	// tab-icon-size-is-open → --tabs-icon-size-is-open
	if (attrs['tab-icon-size-is-open'] !== undefined && attrs['tab-icon-size-is-open'] !== null) {
		cssVars['--tabs-icon-size-is-open'] = attrs['tab-icon-size-is-open'];
	}

	// tab-icon-size-is-open → --tabs-icon-size-is-open-mobile
	if (attrs['tab-icon-size-is-open'] !== undefined && attrs['tab-icon-size-is-open'] !== null) {
		cssVars['--tabs-icon-size-is-open-mobile'] = attrs['tab-icon-size-is-open'];
	}

	// tab-icon-size-is-open → --tabs-icon-size-is-open-tablet
	if (attrs['tab-icon-size-is-open'] !== undefined && attrs['tab-icon-size-is-open'] !== null) {
		cssVars['--tabs-icon-size-is-open-tablet'] = attrs['tab-icon-size-is-open'];
	}

	// tab-icon-size → --tabs-icon-size-mobile
	if (attrs['tab-icon-size'] !== undefined && attrs['tab-icon-size'] !== null) {
		cssVars['--tabs-icon-size-mobile'] = attrs['tab-icon-size'];
	}

	// tab-icon-size → --tabs-icon-size-tablet
	if (attrs['tab-icon-size'] !== undefined && attrs['tab-icon-size'] !== null) {
		cssVars['--tabs-icon-size-tablet'] = attrs['tab-icon-size'];
	}

	// tabListAlignment → --tabs-list-align
	if (attrs['tabListAlignment'] !== undefined && attrs['tabListAlignment'] !== null) {
		cssVars['--tabs-list-align'] = attrs['tabListAlignment'];
	}

	// tabListBackgroundColor → --tabs-list-bg
	if (attrs['tabListBackgroundColor'] !== undefined && attrs['tabListBackgroundColor'] !== null) {
		cssVars['--tabs-list-bg'] = attrs['tabListBackgroundColor'];
	}

	// tabsListContentBorderColor → --tabs-list-divider-border-color
	if (attrs['tabsListContentBorderColor'] !== undefined && attrs['tabsListContentBorderColor'] !== null) {
		cssVars['--tabs-list-divider-border-color'] = attrs['tabsListContentBorderColor'];
	}

	// tabsListContentBorderStyle → --tabs-list-divider-border-style
	if (attrs['tabsListContentBorderStyle'] !== undefined && attrs['tabsListContentBorderStyle'] !== null) {
		cssVars['--tabs-list-divider-border-style'] = attrs['tabsListContentBorderStyle'];
	}

	// tabsListContentBorderWidth → --tabs-list-divider-border-width
	if (attrs['tabsListContentBorderWidth'] !== undefined && attrs['tabsListContentBorderWidth'] !== null) {
		cssVars['--tabs-list-divider-border-width'] = attrs['tabsListContentBorderWidth'];
	}

	// panelBackgroundColor → --tabs-panel-bg
	if (attrs['panelBackgroundColor'] !== undefined && attrs['panelBackgroundColor'] !== null) {
		cssVars['--tabs-panel-bg'] = attrs['panelBackgroundColor'];
	}

	// panelBorderColor → --tabs-panel-border-color
	if (attrs['panelBorderColor'] !== undefined && attrs['panelBorderColor'] !== null) {
		cssVars['--tabs-panel-border-color'] = attrs['panelBorderColor'];
	}

	// panelBorderRadius → --tabs-panel-border-radius
	if (attrs['panelBorderRadius'] !== undefined && attrs['panelBorderRadius'] !== null) {
		cssVars['--tabs-panel-border-radius'] = attrs['panelBorderRadius'];
	}

	// panelBorderStyle → --tabs-panel-border-style
	if (attrs['panelBorderStyle'] !== undefined && attrs['panelBorderStyle'] !== null) {
		cssVars['--tabs-panel-border-style'] = attrs['panelBorderStyle'];
	}

	// panelBorderWidth → --tabs-panel-border-width
	if (attrs['panelBorderWidth'] !== undefined && attrs['panelBorderWidth'] !== null) {
		cssVars['--tabs-panel-border-width'] = attrs['panelBorderWidth'];
	}

	// tabsRowBorderColor → --tabs-row-border-color
	if (attrs['tabsRowBorderColor'] !== undefined && attrs['tabsRowBorderColor'] !== null) {
		cssVars['--tabs-row-border-color'] = attrs['tabsRowBorderColor'];
	}

	// tabsRowBorderStyle → --tabs-row-border-style
	if (attrs['tabsRowBorderStyle'] !== undefined && attrs['tabsRowBorderStyle'] !== null) {
		cssVars['--tabs-row-border-style'] = attrs['tabsRowBorderStyle'];
	}

	// tabsRowBorderWidth → --tabs-row-border-width
	if (attrs['tabsRowBorderWidth'] !== undefined && attrs['tabsRowBorderWidth'] !== null) {
		cssVars['--tabs-row-border-width'] = attrs['tabsRowBorderWidth'];
	}

	// tabsRowSpacing → --tabs-row-spacing
	if (attrs['tabsRowSpacing'] !== undefined && attrs['tabsRowSpacing'] !== null) {
		cssVars['--tabs-row-spacing'] = attrs['tabsRowSpacing'];
	}

	// tabsWidth → --tabs-width
	if (attrs['tabsWidth'] !== undefined && attrs['tabsWidth'] !== null) {
		cssVars['--tabs-width'] = attrs['tabsWidth'];
	}

	// tabsWidth → --tabs-width-mobile
	if (attrs['tabsWidth'] !== undefined && attrs['tabsWidth'] !== null) {
		cssVars['--tabs-width-mobile'] = attrs['tabsWidth'];
	}

	// tabsWidth → --tabs-width-tablet
	if (attrs['tabsWidth'] !== undefined && attrs['tabsWidth'] !== null) {
		cssVars['--tabs-width-tablet'] = attrs['tabsWidth'];
	}

	return cssVars;
}
