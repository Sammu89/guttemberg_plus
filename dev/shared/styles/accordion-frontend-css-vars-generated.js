/**
 * Frontend CSS Vars for accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/accordion.json
 * Generated at: 2026-01-18T17:06:14.413Z
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
		const themeableAttrs = new Set(["divider-border-border-width-top","divider-border-border-color-top","divider-border-border-style-top","block-box-border-width-top","block-box-border-color-top","block-box-border-style-top","block-box-border-width-right","block-box-border-color-right","block-box-border-style-right","block-box-border-width-bottom","block-box-border-color-bottom","block-box-border-style-bottom","block-box-border-width-left","block-box-border-color-left","block-box-border-style-left","block-box-margin-top","block-box-margin-right","block-box-margin-bottom","block-box-margin-left","block-box-border-radius-top-left","block-box-border-radius-top-right","block-box-border-radius-bottom-right","block-box-border-radius-bottom-left","block-box-shadow","header-box-padding-top","header-box-padding-right","header-box-padding-bottom","header-box-padding-left","content-box-padding-top","content-box-padding-right","content-box-padding-bottom","content-box-padding-left","title-color-text","title-color-background","title-color-text-hover","title-color-background-hover","content-color-text","content-color-background","content-typography-font-family","content-typography-font-size","content-typography-line-height","content-typography-font-weight","content-typography-letter-spacing","content-typography-text-transform","content-typography-text-decoration","title-typography-font-family","title-typography-font-size","title-typography-no-line-break","title-typography-font-weight","title-typography-decoration-color","title-typography-decoration-style","title-typography-decoration-width","title-typography-letter-spacing","title-typography-text-transform","title-typography-text-decoration","title-typography-line-height","title-typography-offset-x","title-typography-offset-y","titleAlignment","title-icon-show","title-icon-animation-rotation","title-icon-color","title-icon-initial-rotation","title-icon-size","title-icon-max-size","title-icon-offset-x","title-icon-offset-y","title-icon-color-is-open","title-icon-initial-rotation-is-open","title-icon-size-is-open","title-icon-max-size-is-open","title-icon-offset-x-is-open","title-icon-offset-y-is-open","animationDuration"]);

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
		const nonThemeableAttrs = new Set(["accordionWidth"]);

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
  "divider-border-border-width-top": "--accordion-content-border-top-width",
  "divider-border-border-color-top": "--accordion-content-border-top-color",
  "divider-border-border-style-top": "--accordion-content-border-top-style",
  "block-box-border-width-top": "--accordion-item-border-top-width",
  "block-box-border-color-top": "--accordion-item-border-top-color",
  "block-box-border-style-top": "--accordion-item-border-top-style",
  "block-box-border-width-right": "--accordion-item-border-right-width",
  "block-box-border-color-right": "--accordion-item-border-right-color",
  "block-box-border-style-right": "--accordion-item-border-right-style",
  "block-box-border-width-bottom": "--accordion-item-border-bottom-width",
  "block-box-border-color-bottom": "--accordion-item-border-bottom-color",
  "block-box-border-style-bottom": "--accordion-item-border-bottom-style",
  "block-box-border-width-left": "--accordion-item-border-left-width",
  "block-box-border-color-left": "--accordion-item-border-left-color",
  "block-box-border-style-left": "--accordion-item-border-left-style",
  "block-box-margin-top": "--accordion-item-margin-top-mobile",
  "block-box-margin-right": "--accordion-item-margin-right-mobile",
  "block-box-margin-bottom": "--accordion-item-margin-bottom-mobile",
  "block-box-margin-left": "--accordion-item-margin-left-mobile",
  "block-box-border-radius-top-left": "--accordion-item-border-top-left-radius",
  "block-box-border-radius-top-right": "--accordion-item-border-top-right-radius",
  "block-box-border-radius-bottom-right": "--accordion-item-border-bottom-right-radius",
  "block-box-border-radius-bottom-left": "--accordion-item-border-bottom-left-radius",
  "block-box-shadow": "--accordion-item-box-shadow",
  "header-box-padding-top": "--accordion-title-padding-top-mobile",
  "header-box-padding-right": "--accordion-title-padding-right-mobile",
  "header-box-padding-bottom": "--accordion-title-padding-bottom-mobile",
  "header-box-padding-left": "--accordion-title-padding-left-mobile",
  "content-box-padding-top": "--accordion-contentInner-padding-top-mobile",
  "content-box-padding-right": "--accordion-contentInner-padding-right-mobile",
  "content-box-padding-bottom": "--accordion-contentInner-padding-bottom-mobile",
  "content-box-padding-left": "--accordion-contentInner-padding-left-mobile",
  "title-color-text": "--accordion-title-color",
  "title-color-background": "--accordion-title-background",
  "title-color-text-hover": "--accordion-title-color-hover",
  "title-color-background-hover": "--accordion-title-background-hover",
  "content-color-text": "--accordion-content-color",
  "content-color-background": "--accordion-content-background",
  "content-typography-font-family": "--accordion-content-font-family",
  "content-typography-font-size": "--accordion-content-font-size-mobile",
  "content-typography-line-height": "--accordion-content-line-height",
  "content-typography-font-weight": "--accordion-content-font-weight",
  "content-typography-letter-spacing": "--accordion-content-letter-spacing",
  "content-typography-text-transform": "--accordion-content-text-transform",
  "content-typography-text-decoration": "--accordion-content-text-decoration-line",
  "title-typography-font-family": "--accordion-title-font-family",
  "title-typography-font-size": "--accordion-title-font-size-mobile",
  "title-typography-no-line-break": "--accordion-title-white-space",
  "title-typography-font-weight": "--accordion-title-font-weight",
  "title-typography-decoration-color": "--accordion-title-decoration-color",
  "title-typography-decoration-style": "--accordion-title-decoration-style",
  "title-typography-decoration-width": "--accordion-title-decoration-width",
  "title-typography-letter-spacing": "--accordion-title-letter-spacing",
  "title-typography-text-transform": "--accordion-title-text-transform",
  "title-typography-text-decoration": "--accordion-title-text-decoration-line",
  "title-typography-line-height": "--accordion-title-line-height",
  "title-typography-offset-x": "--accordion-title-offset-x-mobile",
  "title-typography-offset-y": "--accordion-title-offset-y-mobile",
  "titleAlignment": "--accordion-title-alignment",
  "title-icon-show": "--accordion-icon-display",
  "title-icon-animation-rotation": "--accordion-icon-animation-rotation",
  "title-icon-color": "--accordion-icon-color",
  "title-icon-initial-rotation": "--accordion-icon-initial-rotation",
  "title-icon-size": "--accordion-icon-size-mobile",
  "title-icon-max-size": "--accordion-icon-max-size-mobile",
  "title-icon-offset-x": "--accordion-icon-offset-x-mobile",
  "title-icon-offset-y": "--accordion-icon-offset-y-mobile",
  "title-icon-color-is-open": "--accordion-icon-color-is-open",
  "title-icon-initial-rotation-is-open": "--accordion-icon-initial-rotation-is-open",
  "title-icon-size-is-open": "--accordion-icon-size-is-open-mobile",
  "title-icon-max-size-is-open": "--accordion-icon-max-size-is-open-mobile",
  "title-icon-offset-x-is-open": "--accordion-icon-offset-x-is-open-mobile",
  "title-icon-offset-y-is-open": "--accordion-icon-offset-y-is-open-mobile",
  "animationDuration": "--accordion-animation-duration",
  "accordionWidth": "--accordion-width-mobile"
};
