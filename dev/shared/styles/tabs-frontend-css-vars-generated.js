/**
 * Frontend CSS Vars for tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/tabs.json
 * Generated at: 2026-01-18T17:06:14.417Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 2.0.0
 */

/**
 * Build inline CSS variables for frontend save output.
 *
 * Themeable attributes use customizations (deltas only) - these are stored
 * separately from the theme and applied as inline styles to override.
 *
 * Non-themeable attributes use per-block attribute values - these are
 * structural/behavioral attributes that aren't part of the theme system.
 *
 * @param {Object} customizations - Themeable deltas (Tier 3 overrides)
 * @param {Object} attributes - Block attributes (includes non-themeable values)
 * @return {Object} CSS variable map for inline styles
 */
export function buildFrontendCssVars(customizations, attributes) {
	const styles = {};

	// Helper: Format CSS value with unit
	const formatValue = (value) => {
		if (value === null || value === undefined) {
			return null;
		}
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			return String(value);
		}
		// For complex objects (responsive, panel types), skip for now
		// The comprehensive CSS var system handles expansion elsewhere
		return null;
	};

	// Apply themeable customizations (deltas)
	if (customizations && typeof customizations === 'object') {
		const themeableAttrs = new Set(["borderColor","borderWidth","borderStyle","borderRadius","shadow","shadowHover","tab-button-color-text","tab-button-color-background","tab-button-color-text-hover","tab-button-color-background-hover","tab-button-color-text-active","tab-button-color-background-active","tabButtonFontSize","tabButtonFontWeight","tabButtonFontStyle","tabButtonTextTransform","tabButtonTextDecoration","tabButtonTextAlign","tabButtonPadding","tabButtonActiveFontWeight","tabButtonBorderColor","tabButtonActiveBorderColor","tabButtonBorderWidth","tabButtonBorderStyle","tabButtonBorderRadius","tabButtonShadow","tabButtonShadowHover","tabButtonActiveContentBorderColor","tabButtonActiveContentBorderWidth","tabButtonActiveContentBorderStyle","tabListBackgroundColor","tabsRowBorderColor","tabsRowBorderWidth","tabsRowBorderStyle","tabsRowSpacing","tabsButtonGap","tabListAlignment","tabsListContentBorderColor","tabsListContentBorderWidth","tabsListContentBorderStyle","panelBackgroundColor","panelBorderColor","panelBorderWidth","panelBorderStyle","panelBorderRadius","tab-icon-show","tab-icon-animation-rotation","tab-icon-color","tab-icon-initial-rotation","tab-icon-size","tab-icon-max-size","tab-icon-offset-x","tab-icon-offset-y","tab-icon-color-is-open","tab-icon-initial-rotation-is-open","tab-icon-size-is-open","tab-icon-max-size-is-open","tab-icon-offset-x-is-open","tab-icon-offset-y-is-open"]);

		Object.entries(customizations).forEach(([attrName, value]) => {
			if (!themeableAttrs.has(attrName)) {
				return;
			}

			// Map attribute name to CSS variable
			const cssVar = CSS_VAR_MAP[attrName];
			if (!cssVar) {
				return;
			}

			const formattedValue = formatValue(value);
			if (formattedValue !== null) {
				styles[cssVar] = formattedValue;
			}
		});
	}

	// Apply non-themeable attribute values
	if (attributes && typeof attributes === 'object') {
		const nonThemeableAttrs = new Set(["tabsWidth"]);

		nonThemeableAttrs.forEach((attrName) => {
			const value = attributes[attrName];
			if (value === null || value === undefined) {
				return;
			}

			// Map attribute name to CSS variable
			const cssVar = CSS_VAR_MAP[attrName];
			if (!cssVar) {
				return;
			}

			const formattedValue = formatValue(value);
			if (formattedValue !== null) {
				styles[cssVar] = formattedValue;
			}
		});
	}

	return styles;
}

/**
 * Attribute name to CSS variable mapping
 * Generated from comprehensive schema cssVarMap
 */
const CSS_VAR_MAP = {
  "tabsWidth": "--tabs-width-mobile",
  "borderColor": "--tabs-border-color",
  "borderWidth": "--tabs-border-width",
  "borderStyle": "--tabs-border-style",
  "borderRadius": "--tabs-border-radius",
  "shadow": "--tabs-border-shadow",
  "shadowHover": "--tabs-border-shadow-hover",
  "tab-button-color-text": "--tabs-button-color",
  "tab-button-color-background": "--tabs-button-background",
  "tab-button-color-text-hover": "--tabs-button-color-hover",
  "tab-button-color-background-hover": "--tabs-button-background-hover",
  "tab-button-color-text-active": "--tabs-button-color-active",
  "tab-button-color-background-active": "--tabs-button-background-active",
  "tabButtonFontSize": "--tabs-button-font-size",
  "tabButtonFontWeight": "--tabs-button-font-weight",
  "tabButtonFontStyle": "--tabs-button-font-style",
  "tabButtonTextTransform": "--tabs-button-text-transform",
  "tabButtonTextDecoration": "--tabs-button-text-decoration",
  "tabButtonTextAlign": "--tabs-button-text-align",
  "tabButtonPadding": "--tabs-button-padding",
  "tabButtonActiveFontWeight": "--tabs-button-active-font-weight",
  "tabButtonBorderColor": "--tabs-button-border-color",
  "tabButtonActiveBorderColor": "--tabs-button-active-border-color",
  "tabButtonBorderWidth": "--tabs-button-border-width",
  "tabButtonBorderStyle": "--tabs-button-border-style",
  "tabButtonBorderRadius": "--tabs-button-border-radius",
  "tabButtonShadow": "--tabs-button-border-shadow",
  "tabButtonShadowHover": "--tabs-button-border-shadow-hover",
  "tabButtonActiveContentBorderColor": "--tabs-button-active-content-border-color",
  "tabButtonActiveContentBorderWidth": "--tabs-button-active-content-border-width",
  "tabButtonActiveContentBorderStyle": "--tabs-button-active-content-border-style",
  "tabListBackgroundColor": "--tabs-list-bg",
  "tabsRowBorderColor": "--tabs-row-border-color",
  "tabsRowBorderWidth": "--tabs-row-border-width",
  "tabsRowBorderStyle": "--tabs-row-border-style",
  "tabsRowSpacing": "--tabs-row-spacing",
  "tabsButtonGap": "--tabs-button-gap",
  "tabListAlignment": "--tabs-list-align",
  "tabsListContentBorderColor": "--tabs-list-divider-border-color",
  "tabsListContentBorderWidth": "--tabs-list-divider-border-width",
  "tabsListContentBorderStyle": "--tabs-list-divider-border-style",
  "panelBackgroundColor": "--tabs-panel-bg",
  "panelBorderColor": "--tabs-panel-border-color",
  "panelBorderWidth": "--tabs-panel-border-width",
  "panelBorderStyle": "--tabs-panel-border-style",
  "panelBorderRadius": "--tabs-panel-border-radius",
  "tab-icon-show": "--tabs-icon-display",
  "tab-icon-animation-rotation": "--tabs-icon-animation-rotation",
  "tab-icon-color": "--tabs-icon-color",
  "tab-icon-initial-rotation": "--tabs-icon-initial-rotation",
  "tab-icon-size": "--tabs-icon-size-mobile",
  "tab-icon-max-size": "--tabs-icon-max-size-mobile",
  "tab-icon-offset-x": "--tabs-icon-offset-x-mobile",
  "tab-icon-offset-y": "--tabs-icon-offset-y-mobile",
  "tab-icon-color-is-open": "--tabs-icon-color-is-open",
  "tab-icon-initial-rotation-is-open": "--tabs-icon-initial-rotation-is-open",
  "tab-icon-size-is-open": "--tabs-icon-size-is-open-mobile",
  "tab-icon-max-size-is-open": "--tabs-icon-max-size-is-open-mobile",
  "tab-icon-offset-x-is-open": "--tabs-icon-offset-x-is-open-mobile",
  "tab-icon-offset-y-is-open": "--tabs-icon-offset-y-is-open-mobile"
};
