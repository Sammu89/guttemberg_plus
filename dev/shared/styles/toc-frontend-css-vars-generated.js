/**
 * Frontend CSS Vars for toc Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/toc.json
 * Generated at: 2026-01-19T16:38:17.107Z
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
		const themeableAttrs = new Set(["wrapperBackgroundColor","blockBorderColor","title-color-text","title-color-background","title-color-text-hover","title-color-background-hover","link-color-text","link-color-text-hover","link-color-text-visited","link-color-text-active","h1-color-text","h1-color-text-hover","h1-color-text-visited","h1-color-text-active","h1FontSize","h1FontWeight","h1FontStyle","h1TextTransform","h1TextDecoration","h2-color-text","h2-color-text-hover","h2-color-text-visited","h2-color-text-active","h2FontSize","h2FontWeight","h2FontStyle","h2TextTransform","h2TextDecoration","h3-color-text","h3-color-text-hover","h3-color-text-visited","h3-color-text-active","h3FontSize","h3FontWeight","h3FontStyle","h3TextTransform","h3TextDecoration","h4-color-text","h4-color-text-hover","h4-color-text-visited","h4-color-text-active","h4FontSize","h4FontWeight","h4FontStyle","h4TextTransform","h4TextDecoration","h5-color-text","h5-color-text-hover","h5-color-text-visited","h5-color-text-active","h5FontSize","h5FontWeight","h5FontStyle","h5TextTransform","h5TextDecoration","h6-color-text","h6-color-text-hover","h6-color-text-visited","h6-color-text-active","h6FontSize","h6FontWeight","h6FontStyle","h6TextTransform","h6TextDecoration","toc-icon-show","toc-icon-animation-rotation","toc-icon-color","toc-icon-initial-rotation","toc-icon-size","toc-icon-max-size","toc-icon-offset-x","toc-icon-offset-y","toc-icon-color-is-open","toc-icon-initial-rotation-is-open","toc-icon-size-is-open","toc-icon-max-size-is-open","toc-icon-offset-x-is-open","toc-icon-offset-y-is-open","titleFontSize","titleFontWeight","titleFontStyle","titleTextTransform","titleTextDecoration","titleAlignment","blockBorderWidth","blockBorderStyle","blockBorderRadius","blockShadow","blockShadowHover","wrapperPadding","itemSpacing","levelIndent","positionTop","zIndex"]);

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
		const nonThemeableAttrs = new Set(["tocWidth"]);

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
  "tocWidth": "--toc-width-mobile",
  "wrapperBackgroundColor": "--toc-wrapper-background-color",
  "blockBorderColor": "--toc-border-color",
  "title-color-text": "--toc-title-color",
  "title-color-background": "--toc-title-background",
  "title-color-text-hover": "--toc-title-color-hover",
  "title-color-background-hover": "--toc-title-background-hover",
  "link-color-text": "--toc-link-color",
  "link-color-text-hover": "--toc-link-color-hover",
  "link-color-text-visited": "--toc-link-color-visited",
  "link-color-text-active": "--toc-link-color-active",
  "h1-color-text": "--toc-h1-color",
  "h1-color-text-hover": "--toc-h1-color-hover",
  "h1-color-text-visited": "--toc-h1-color-visited",
  "h1-color-text-active": "--toc-h1-color-active",
  "h1FontSize": "--toc-h1-font-size",
  "h1FontWeight": "--toc-h1-font-weight",
  "h1FontStyle": "--toc-h1-font-style",
  "h1TextTransform": "--toc-h1-text-transform",
  "h1TextDecoration": "--toc-h1-text-decoration",
  "h2-color-text": "--toc-h2-color",
  "h2-color-text-hover": "--toc-h2-color-hover",
  "h2-color-text-visited": "--toc-h2-color-visited",
  "h2-color-text-active": "--toc-h2-color-active",
  "h2FontSize": "--toc-h2-font-size",
  "h2FontWeight": "--toc-h2-font-weight",
  "h2FontStyle": "--toc-h2-font-style",
  "h2TextTransform": "--toc-h2-text-transform",
  "h2TextDecoration": "--toc-h2-text-decoration",
  "h3-color-text": "--toc-h3-color",
  "h3-color-text-hover": "--toc-h3-color-hover",
  "h3-color-text-visited": "--toc-h3-color-visited",
  "h3-color-text-active": "--toc-h3-color-active",
  "h3FontSize": "--toc-h3-font-size",
  "h3FontWeight": "--toc-h3-font-weight",
  "h3FontStyle": "--toc-h3-font-style",
  "h3TextTransform": "--toc-h3-text-transform",
  "h3TextDecoration": "--toc-h3-text-decoration",
  "h4-color-text": "--toc-h4-color",
  "h4-color-text-hover": "--toc-h4-color-hover",
  "h4-color-text-visited": "--toc-h4-color-visited",
  "h4-color-text-active": "--toc-h4-color-active",
  "h4FontSize": "--toc-h4-font-size",
  "h4FontWeight": "--toc-h4-font-weight",
  "h4FontStyle": "--toc-h4-font-style",
  "h4TextTransform": "--toc-h4-text-transform",
  "h4TextDecoration": "--toc-h4-text-decoration",
  "h5-color-text": "--toc-h5-color",
  "h5-color-text-hover": "--toc-h5-color-hover",
  "h5-color-text-visited": "--toc-h5-color-visited",
  "h5-color-text-active": "--toc-h5-color-active",
  "h5FontSize": "--toc-h5-font-size",
  "h5FontWeight": "--toc-h5-font-weight",
  "h5FontStyle": "--toc-h5-font-style",
  "h5TextTransform": "--toc-h5-text-transform",
  "h5TextDecoration": "--toc-h5-text-decoration",
  "h6-color-text": "--toc-h6-color",
  "h6-color-text-hover": "--toc-h6-color-hover",
  "h6-color-text-visited": "--toc-h6-color-visited",
  "h6-color-text-active": "--toc-h6-color-active",
  "h6FontSize": "--toc-h6-font-size",
  "h6FontWeight": "--toc-h6-font-weight",
  "h6FontStyle": "--toc-h6-font-style",
  "h6TextTransform": "--toc-h6-text-transform",
  "h6TextDecoration": "--toc-h6-text-decoration",
  "toc-icon-show": "--toc-icon-display",
  "toc-icon-animation-rotation": "--toc-icon-animation-rotation",
  "toc-icon-color": "--toc-icon-color",
  "toc-icon-initial-rotation": "--toc-icon-initial-rotation",
  "toc-icon-size": "--toc-icon-size-mobile",
  "toc-icon-max-size": "--toc-icon-max-size-mobile",
  "toc-icon-offset-x": "--toc-icon-offset-x-mobile",
  "toc-icon-offset-y": "--toc-icon-offset-y-mobile",
  "toc-icon-color-is-open": "--toc-icon-color-is-open",
  "toc-icon-initial-rotation-is-open": "--toc-icon-initial-rotation-is-open",
  "toc-icon-size-is-open": "--toc-icon-size-is-open-mobile",
  "toc-icon-max-size-is-open": "--toc-icon-max-size-is-open-mobile",
  "toc-icon-offset-x-is-open": "--toc-icon-offset-x-is-open-mobile",
  "toc-icon-offset-y-is-open": "--toc-icon-offset-y-is-open-mobile",
  "titleFontSize": "--toc-title-font-size",
  "titleFontWeight": "--toc-title-font-weight",
  "titleFontStyle": "--toc-title-font-style",
  "titleTextTransform": "--toc-title-text-transform",
  "titleTextDecoration": "--toc-title-text-decoration",
  "titleAlignment": "--toc-title-alignment",
  "blockBorderWidth": "--toc-border-width",
  "blockBorderStyle": "--toc-border-style",
  "blockBorderRadius": "--toc-border-radius",
  "blockShadow": "--toc-border-shadow",
  "blockShadowHover": "--toc-border-shadow-hover",
  "wrapperPadding": "--toc-wrapper-padding",
  "itemSpacing": "--toc-item-spacing",
  "levelIndent": "--toc-level-indent",
  "positionTop": "--toc-position-top",
  "zIndex": "--toc-z-index"
};
