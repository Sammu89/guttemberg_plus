/**
 * CSS Variable Mappings for All Blocks
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/*.json
 * Generated at: 2025-12-29T02:28:32.330Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Format a shadow value to CSS string
 * @param {Object|number|string|null} valueObj - Shadow value object or primitive
 * @returns {string} CSS value with unit
 */
function formatShadowValue(valueObj) {
  if (valueObj === null || valueObj === undefined) return '0px';
  if (typeof valueObj === 'string') return valueObj;
  if (typeof valueObj === 'number') return `${valueObj}px`;
  if (typeof valueObj === 'object' && valueObj !== null) {
    const value = valueObj.value ?? 0;
    const unit = valueObj.unit ?? 'px';
    return `${value}${unit}`;
  }
  return '0px';
}

/**
 * Build CSS box-shadow from array of shadow layers
 * @param {Array|null} shadows - Array of shadow layer objects
 * @returns {string} CSS box-shadow value or 'none'
 */
function buildBoxShadow(shadows) {
  if (!shadows || !Array.isArray(shadows) || shadows.length === 0) return 'none';
  const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
  if (validLayers.length === 0) return 'none';
  return validLayers.map(layer => {
    const parts = [];
    if (layer.inset === true) parts.push('inset');
    parts.push(formatShadowValue(layer.x));
    parts.push(formatShadowValue(layer.y));
    parts.push(formatShadowValue(layer.blur));
    parts.push(formatShadowValue(layer.spread));
    parts.push(layer.color);
    return parts.join(' ');
  }).join(', ');
}

/**
 * Build CSS text-shadow from array of shadow layers
 * Similar to buildBoxShadow but omits spread and inset (not supported by text-shadow)
 * @param {Array|null} shadows - Array of shadow layer objects
 * @returns {string} CSS text-shadow value or 'none'
 */
function buildTextShadow(shadows) {
  if (!shadows || !Array.isArray(shadows) || shadows.length === 0) return 'none';
  const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
  if (validLayers.length === 0) return 'none';
  return validLayers.map(layer => {
    const parts = [];
    // text-shadow format: offset-x offset-y blur-radius color (NO spread or inset)
    parts.push(formatShadowValue(layer.x));
    parts.push(formatShadowValue(layer.y));
    parts.push(formatShadowValue(layer.blur));
    parts.push(layer.color);
    return parts.join(' ');
  }).join(', ');
}

/**
 * CSS Variable Mappings
 *
 * Maps attribute names to their CSS variable names with formatting info.
 * Used by save.js to output inline CSS for customizations.
 *
 * Structure:
 * {
 *   [attrName]: {
 *     cssVar: '--css-var-name',
 *     unit: 'px' | 'deg' | null,
 *     type: 'string' | 'number' | 'object' | 'boolean',
 *     cssProperty?: 'border-bottom-color',
 *     dependsOn?: 'orientation',
 *     variants?: { [variantKey]: { cssProperty: '...' } }
 *   }
 * }
 */
export const CSS_VAR_MAPPINGS = {
  accordion: {
    dividerWidth: { cssVar: '--accordion-divider-width', unit: null, type: 'object', cssProperty: 'border-top-width', dependsOn: null, variants: null },
    dividerColor: { cssVar: '--accordion-divider-color', unit: null, type: 'object', cssProperty: 'border-top-color', dependsOn: null, variants: null },
    dividerStyle: { cssVar: '--accordion-divider-style', unit: null, type: 'object', cssProperty: 'border-top-style', dependsOn: null, variants: null },
    borderWidth: { cssVar: '--accordion-border-width', unit: null, type: 'object', cssProperty: 'border-width', dependsOn: null, variants: null },
    borderRadius: { cssVar: '--accordion-border-radius', unit: null, type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    shadow: { cssVar: '--accordion-shadow', unit: null, type: 'array', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    borderColor: { cssVar: '--accordion-border-color', unit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    borderStyle: { cssVar: '--accordion-border-style', unit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    headerPadding: { cssVar: '--accordion-header-padding', unit: null, type: 'object', cssProperty: 'padding', dependsOn: null, variants: null },
    contentPadding: { cssVar: '--accordion-content-padding', unit: null, type: 'object', cssProperty: 'padding', dependsOn: null, variants: null },
    blockMargin: { cssVar: '--accordion-block-margin', unit: null, type: 'object', cssProperty: 'margin', dependsOn: null, variants: null },
    titleColor: { cssVar: '--accordion-title-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    titleBackgroundColor: { cssVar: '--accordion-title-bg', unit: null, type: 'string', cssProperty: 'background', dependsOn: null, variants: null },
    hoverTitleColor: { cssVar: '--accordion-title-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    hoverTitleBackgroundColor: { cssVar: '--accordion-title-hover-bg', unit: null, type: 'string', cssProperty: 'background', dependsOn: null, variants: null },
    contentTextColor: { cssVar: '--accordion-content-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    contentBackgroundColor: { cssVar: '--accordion-content-bg', unit: null, type: 'string', cssProperty: 'background', dependsOn: null, variants: null },
    contentFontFamily: { cssVar: '--accordion-content-font-family', unit: null, type: 'string', cssProperty: 'font-family', dependsOn: null, variants: null },
    contentFontSize: { cssVar: '--accordion-content-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    contentLineHeight: { cssVar: '--accordion-content-line-height', unit: null, type: 'number', cssProperty: 'line-height', dependsOn: null, variants: null },
    titleFontFamily: { cssVar: '--accordion-title-font-family', unit: null, type: 'string', cssProperty: 'font-family', dependsOn: null, variants: null },
    titleFontSize: { cssVar: '--accordion-title-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    titleFontWeight: { cssVar: '--accordion-title-font-weight', unit: null, type: 'number', cssProperty: 'font-weight', dependsOn: null, variants: null },
    titleDecorationColor: { cssVar: '--accordion-title-decoration-color', unit: null, type: 'string', cssProperty: 'text-decoration-color', dependsOn: null, variants: null },
    titleDecorationStyle: { cssVar: '--accordion-title-decoration-style', unit: null, type: 'string', cssProperty: 'text-decoration-style', dependsOn: null, variants: null },
    titleDecorationWidth: { cssVar: '--accordion-title-decoration-width', unit: null, type: 'string', cssProperty: 'text-decoration-thickness', dependsOn: null, variants: null },
    titleLetterSpacing: { cssVar: '--accordion-title-letter-spacing', unit: null, type: 'string', cssProperty: 'letter-spacing', dependsOn: null, variants: null },
    titleTextTransform: { cssVar: '--accordion-title-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    titleLineHeight: { cssVar: '--accordion-title-line-height', unit: null, type: 'number', cssProperty: 'line-height', dependsOn: null, variants: null },
    titleAlignment: { cssVar: '--accordion-title-alignment', unit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    titleOffsetX: { cssVar: '--accordion-title-offset-x', unit: null, type: 'string', cssProperty: 'left', dependsOn: null, variants: null },
    titleOffsetY: { cssVar: '--accordion-title-offset-y', unit: null, type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    titleTextShadow: { cssVar: '--accordion-title-text-shadow', unit: null, type: 'array', cssProperty: 'text-shadow', dependsOn: null, variants: null },
    iconColor: { cssVar: '--accordion-icon-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconSize: { cssVar: '--accordion-icon-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--accordion-icon-rotation', unit: null, type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    animationDuration: { cssVar: '--accordion-animation-duration', unit: null, type: 'string', cssProperty: 'transition-duration', dependsOn: null, variants: null },
    animationEasing: { cssVar: '--accordion-animation-easing', unit: null, type: 'string', cssProperty: 'transition-timing-function', dependsOn: null, variants: null },
  },
  tabs: {
    borderColor: { cssVar: '--tabs-border-color', unit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    borderWidth: { cssVar: '--tabs-border-width', unit: null, type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    borderStyle: { cssVar: '--tabs-border-style', unit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    borderRadius: { cssVar: '--tabs-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    shadow: { cssVar: '--tabs-border-shadow', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    shadowHover: { cssVar: '--tabs-border-shadow-hover', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    tabButtonColor: { cssVar: '--tabs-button-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    tabButtonBackgroundColor: { cssVar: '--tabs-button-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabButtonHoverColor: { cssVar: '--tabs-button-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    tabButtonHoverBackgroundColor: { cssVar: '--tabs-button-hover-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabButtonActiveColor: { cssVar: '--tabs-button-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    tabButtonActiveBackgroundColor: { cssVar: '--tabs-button-active-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabButtonFontSize: { cssVar: '--tabs-button-font-size', unit: null, type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    tabButtonFontWeight: { cssVar: '--tabs-button-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    tabButtonFontStyle: { cssVar: '--tabs-button-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    tabButtonTextTransform: { cssVar: '--tabs-button-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    tabButtonTextDecoration: { cssVar: '--tabs-button-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    tabButtonTextAlign: { cssVar: '--tabs-button-text-align', unit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    tabButtonPadding: { cssVar: '--tabs-button-padding', unit: null, type: 'number', cssProperty: 'padding', dependsOn: null, variants: null },
    tabButtonActiveFontWeight: { cssVar: '--tabs-button-active-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    tabButtonBorderColor: { cssVar: '--tabs-button-border-color', unit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabButtonActiveBorderColor: { cssVar: '--tabs-button-active-border-color', unit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabButtonBorderWidth: { cssVar: '--tabs-button-border-width', unit: null, type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    tabButtonBorderStyle: { cssVar: '--tabs-button-border-style', unit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    tabButtonBorderRadius: { cssVar: '--tabs-button-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    tabButtonShadow: { cssVar: '--tabs-button-border-shadow', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    tabButtonShadowHover: { cssVar: '--tabs-button-border-shadow-hover', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    enableFocusBorder: { cssVar: '--tabs-enable-focus-border', unit: null, type: 'boolean', cssProperty: 'border', dependsOn: null, variants: null },
    tabButtonActiveContentBorderColor: { cssVar: '--tabs-button-active-content-border-color', unit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
            "horizontal": {
                  "cssProperty": "border-bottom-color"
            },
            "vertical-left": {
                  "cssProperty": "border-right-color"
            },
            "vertical-right": {
                  "cssProperty": "border-left-color"
            },
            "_default": {
                  "cssProperty": "border-bottom-color"
            }
      } },
    tabButtonActiveContentBorderWidth: { cssVar: '--tabs-button-active-content-border-width', unit: null, type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
            "horizontal": {
                  "cssProperty": "border-bottom-width"
            },
            "vertical-left": {
                  "cssProperty": "border-right-width"
            },
            "vertical-right": {
                  "cssProperty": "border-left-width"
            },
            "_default": {
                  "cssProperty": "border-bottom-width"
            }
      } },
    tabButtonActiveContentBorderStyle: { cssVar: '--tabs-button-active-content-border-style', unit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
            "horizontal": {
                  "cssProperty": "border-bottom-style"
            },
            "vertical-left": {
                  "cssProperty": "border-right-style"
            },
            "vertical-right": {
                  "cssProperty": "border-left-style"
            },
            "_default": {
                  "cssProperty": "border-bottom-style"
            }
      } },
    tabListBackgroundColor: { cssVar: '--tabs-list-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabsRowBorderColor: { cssVar: '--tabs-row-border-color', unit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabsRowBorderWidth: { cssVar: '--tabs-row-border-width', unit: null, type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    tabsRowBorderStyle: { cssVar: '--tabs-row-border-style', unit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    tabsRowSpacing: { cssVar: '--tabs-row-spacing', unit: null, type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
            "horizontal": {
                  "cssProperty": "padding-top"
            },
            "vertical-left": {
                  "cssProperty": "padding-left"
            },
            "vertical-right": {
                  "cssProperty": "padding-right"
            },
            "_default": {
                  "cssProperty": "padding-top"
            }
      } },
    tabsButtonGap: { cssVar: '--tabs-button-gap', unit: null, type: 'number', cssProperty: 'gap', dependsOn: null, variants: null },
    tabListAlignment: { cssVar: '--tabs-list-align', unit: null, type: 'string', cssProperty: 'justify-content', dependsOn: null, variants: null },
    enableTabsListContentBorder: { cssVar: '--tabs-enable-list-divider-border', unit: null, type: 'boolean', cssProperty: 'border', dependsOn: null, variants: null },
    tabsListContentBorderColor: { cssVar: '--tabs-list-divider-border-color', unit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
            "horizontal": {
                  "cssProperty": "border-bottom-color"
            },
            "vertical-left": {
                  "cssProperty": "border-right-color"
            },
            "vertical-right": {
                  "cssProperty": "border-left-color"
            },
            "_default": {
                  "cssProperty": "border-bottom-color"
            }
      } },
    tabsListContentBorderWidth: { cssVar: '--tabs-list-divider-border-width', unit: null, type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
            "horizontal": {
                  "cssProperty": "border-bottom-width"
            },
            "vertical-left": {
                  "cssProperty": "border-right-width"
            },
            "vertical-right": {
                  "cssProperty": "border-left-width"
            },
            "_default": {
                  "cssProperty": "border-bottom-width"
            }
      } },
    tabsListContentBorderStyle: { cssVar: '--tabs-list-divider-border-style', unit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
            "horizontal": {
                  "cssProperty": "border-bottom-style"
            },
            "vertical-left": {
                  "cssProperty": "border-right-style"
            },
            "vertical-right": {
                  "cssProperty": "border-left-style"
            },
            "_default": {
                  "cssProperty": "border-bottom-style"
            }
      } },
    panelBackgroundColor: { cssVar: '--tabs-panel-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    panelBorderColor: { cssVar: '--tabs-panel-border-color', unit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    panelBorderWidth: { cssVar: '--tabs-panel-border-width', unit: null, type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    panelBorderStyle: { cssVar: '--tabs-panel-border-style', unit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    panelBorderRadius: { cssVar: '--tabs-panel-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    showIcon: { cssVar: '--tabs-show-icon', unit: null, type: 'boolean', cssProperty: 'display', dependsOn: null, variants: null },
    iconPosition: { cssVar: '--tabs-icon-position', unit: null, type: 'string', cssProperty: 'flex-direction', dependsOn: null, variants: null },
    iconColor: { cssVar: '--tabs-icon-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconSize: { cssVar: '--tabs-icon-size', unit: null, type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconTypeClosed: { cssVar: '--tabs-icon-type-closed', unit: null, type: 'string', cssProperty: 'content', dependsOn: null, variants: null },
    iconTypeOpen: { cssVar: '--tabs-icon-type-open', unit: null, type: 'string', cssProperty: 'content', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--tabs-icon-rotation-base', unit: null, type: 'number', cssProperty: 'transform', dependsOn: null, variants: null },
    iconRotationActive: { cssVar: '--tabs-icon-rotation-active', unit: null, type: 'number', cssProperty: 'transform', dependsOn: null, variants: null },
  },
  toc: {
    wrapperBackgroundColor: { cssVar: '--toc-wrapper-background-color', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    blockBorderColor: { cssVar: '--toc-border-color', unit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    titleColor: { cssVar: '--toc-title-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    titleBackgroundColor: { cssVar: '--toc-title-background-color', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    hoverTitleColor: { cssVar: '--toc-title-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    hoverTitleBackgroundColor: { cssVar: '--toc-title-hover-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    linkColor: { cssVar: '--toc-link-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    linkHoverColor: { cssVar: '--toc-link-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    linkActiveColor: { cssVar: '--toc-link-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    linkVisitedColor: { cssVar: '--toc-link-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h1Color: { cssVar: '--toc-h1-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h1HoverColor: { cssVar: '--toc-h1-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h1VisitedColor: { cssVar: '--toc-h1-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h1ActiveColor: { cssVar: '--toc-h1-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h1FontSize: { cssVar: '--toc-h1-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h1FontWeight: { cssVar: '--toc-h1-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h1FontStyle: { cssVar: '--toc-h1-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h1TextTransform: { cssVar: '--toc-h1-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h1TextDecoration: { cssVar: '--toc-h1-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h2Color: { cssVar: '--toc-h2-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h2HoverColor: { cssVar: '--toc-h2-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h2VisitedColor: { cssVar: '--toc-h2-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h2ActiveColor: { cssVar: '--toc-h2-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h2FontSize: { cssVar: '--toc-h2-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h2FontWeight: { cssVar: '--toc-h2-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h2FontStyle: { cssVar: '--toc-h2-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h2TextTransform: { cssVar: '--toc-h2-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h2TextDecoration: { cssVar: '--toc-h2-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h3Color: { cssVar: '--toc-h3-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h3HoverColor: { cssVar: '--toc-h3-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h3VisitedColor: { cssVar: '--toc-h3-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h3ActiveColor: { cssVar: '--toc-h3-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h3FontSize: { cssVar: '--toc-h3-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h3FontWeight: { cssVar: '--toc-h3-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h3FontStyle: { cssVar: '--toc-h3-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h3TextTransform: { cssVar: '--toc-h3-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h3TextDecoration: { cssVar: '--toc-h3-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h4Color: { cssVar: '--toc-h4-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h4HoverColor: { cssVar: '--toc-h4-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h4VisitedColor: { cssVar: '--toc-h4-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h4ActiveColor: { cssVar: '--toc-h4-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h4FontSize: { cssVar: '--toc-h4-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h4FontWeight: { cssVar: '--toc-h4-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h4FontStyle: { cssVar: '--toc-h4-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h4TextTransform: { cssVar: '--toc-h4-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h4TextDecoration: { cssVar: '--toc-h4-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h5Color: { cssVar: '--toc-h5-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h5HoverColor: { cssVar: '--toc-h5-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h5VisitedColor: { cssVar: '--toc-h5-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h5ActiveColor: { cssVar: '--toc-h5-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h5FontSize: { cssVar: '--toc-h5-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h5FontWeight: { cssVar: '--toc-h5-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h5FontStyle: { cssVar: '--toc-h5-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h5TextTransform: { cssVar: '--toc-h5-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h5TextDecoration: { cssVar: '--toc-h5-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h6Color: { cssVar: '--toc-h6-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h6HoverColor: { cssVar: '--toc-h6-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h6VisitedColor: { cssVar: '--toc-h6-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h6ActiveColor: { cssVar: '--toc-h6-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h6FontSize: { cssVar: '--toc-h6-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h6FontWeight: { cssVar: '--toc-h6-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h6FontStyle: { cssVar: '--toc-h6-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h6TextTransform: { cssVar: '--toc-h6-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h6TextDecoration: { cssVar: '--toc-h6-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    iconSize: { cssVar: '--toc-icon-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--toc-icon-rotation', unit: null, type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconColor: { cssVar: '--toc-icon-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    titleFontSize: { cssVar: '--toc-title-font-size', unit: null, type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    titleFontWeight: { cssVar: '--toc-title-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    titleFontStyle: { cssVar: '--toc-title-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    titleTextTransform: { cssVar: '--toc-title-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    titleTextDecoration: { cssVar: '--toc-title-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    titleAlignment: { cssVar: '--toc-title-alignment', unit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    blockBorderWidth: { cssVar: '--toc-border-width', unit: null, type: 'string', cssProperty: 'border-width', dependsOn: null, variants: null },
    blockBorderStyle: { cssVar: '--toc-border-style', unit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    blockBorderRadius: { cssVar: '--toc-border-radius', unit: null, type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    blockShadow: { cssVar: '--toc-border-shadow', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    blockShadowHover: { cssVar: '--toc-border-shadow-hover', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    wrapperPadding: { cssVar: '--toc-wrapper-padding', unit: null, type: 'string', cssProperty: 'padding', dependsOn: null, variants: null },
    itemSpacing: { cssVar: '--toc-item-spacing', unit: null, type: 'string', cssProperty: 'gap', dependsOn: null, variants: null },
    levelIndent: { cssVar: '--toc-level-indent', unit: null, type: 'string', cssProperty: 'margin-left', dependsOn: null, variants: null },
    positionTop: { cssVar: '--toc-position-top', unit: null, type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    zIndex: { cssVar: '--toc-z-index', unit: null, type: 'number', cssProperty: 'z-index', dependsOn: null, variants: null },
  },
};

/**
 * Compress CSS box values using shorthand notation
 * Handles: border-width, border-color, border-style, padding, margin
 * @param {Array} values - Array of [top, right, bottom, left] values
 * @param {string} unit - CSS unit to append (empty string for non-numeric values like colors/styles)
 * @returns {string} Compressed CSS shorthand value
 */
function compressBoxValue(values, unit = '') {
  const [top, right, bottom, left] = values;
  const addUnit = (v) => unit ? `${v}${unit}` : String(v);

  // All same: "solid" or "10px"
  if (top === right && right === bottom && bottom === left) {
    return addUnit(top);
  }
  // top/bottom same AND left/right same: "solid dashed" or "10px 20px"
  if (top === bottom && left === right) {
    return `${addUnit(top)} ${addUnit(left)}`;
  }
  // left equals right: "solid dashed dotted" or "10px 20px 30px"
  if (left === right) {
    return `${addUnit(top)} ${addUnit(right)} ${addUnit(bottom)}`;
  }
  // All different: "solid dashed dotted none" or "10px 20px 30px 40px"
  return `${addUnit(top)} ${addUnit(right)} ${addUnit(bottom)} ${addUnit(left)}`;
}

/**
 * Format a value with its unit for CSS output
 * @param {string} attrName - Attribute name
 * @param {*} value - The value to format
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {string|null} Formatted CSS value or null if not mappable
 */
export function formatCssValue(attrName, value, blockType) {
  const mapping = CSS_VAR_MAPPINGS[blockType]?.[attrName];
  if (!mapping) return null;

  // Handle null/undefined
  if (value === null || value === undefined) return null;

  // Handle numeric objects that carry their own unit (e.g., { value, unit })
  if (
    value &&
    typeof value === 'object' &&
    value.value !== undefined &&
    value.value !== null
  ) {
    const unit = value.unit || mapping.unit || '';
    return `${value.value}${unit}`;
  }

  // Handle object types (border radius, padding, colors, styles)
  if (mapping.type === 'object' && typeof value === 'object') {
    // Handle responsive objects (tablet/mobile keys) - use base value (global is at root, not a device key)
    if ((value.tablet !== undefined || value.mobile !== undefined) && typeof value.value === 'object') {
      return formatCssValue(attrName, value.value, blockType);
    }

    // Border radius format: topLeft topRight bottomRight bottomLeft
    if (value.topLeft !== undefined) {
      const unit = value.unit || 'px';
      const values = [value.topLeft, value.topRight, value.bottomRight, value.bottomLeft];
      return compressBoxValue(values, unit);
    }

    // Directional properties (border-width, border-color, border-style, padding, margin)
    if (value.top !== undefined || value.right !== undefined ||
        value.bottom !== undefined || value.left !== undefined) {
      // Handle unlinked mode where each side is an object { value: X }
      const getVal = (side) => {
        const sideValue = value[side];
        if (sideValue && typeof sideValue === 'object' && sideValue.value !== undefined) {
          return sideValue.value;
        }
        return sideValue ?? '';
      };

      const values = [getVal('top'), getVal('right'), getVal('bottom'), getVal('left')];

      // Only apply unit if values are numeric (border-style/color are strings, don't need units)
      const firstValue = values.find(v => v !== '' && v !== undefined && v !== null);
      const isNumeric = typeof firstValue === 'number';
      const unit = isNumeric ? (value.unit || '') : '';

      return compressBoxValue(values, unit);
    }

    // Default object handling
    return JSON.stringify(value);
  }

  // Handle array types (e.g., box-shadow layers)
  if (mapping.type === 'array' && Array.isArray(value)) {
    // Use imported buildBoxShadow function for shadow arrays
    return buildBoxShadow(value);
  }

  // Handle numeric values with units
  if (mapping.unit && typeof value === 'number') {
    return `${value}${mapping.unit}`;
  }

  // Return value as-is for strings and other types
  return value;
}

/**
 * Get the CSS variable name for an attribute
 * @param {string} attrName - Attribute name
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {string|null} CSS variable name or null if not mappable
 */
export function getCssVarName(attrName, blockType) {
  return CSS_VAR_MAPPINGS[blockType]?.[attrName]?.cssVar || null;
}

/**
 * Resolve the CSS property for an attribute, honoring conditional variants
 * @param {string} attrName - Attribute name
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {Object} context - Values for dependency lookups (e.g., { orientation })
 * @returns {string|null} CSS property name or null
 */
export function resolveCssProperty(attrName, blockType, context = {}) {
  const mapping = CSS_VAR_MAPPINGS[blockType]?.[attrName];
  if (!mapping) return null;

  if (mapping.dependsOn && mapping.variants) {
    const depValue = context?.[mapping.dependsOn];
    const variant = (depValue && mapping.variants[depValue]) || mapping.variants._default;
    if (variant?.cssProperty) {
      return variant.cssProperty;
    }
  }

  return mapping.cssProperty || null;
}

export default CSS_VAR_MAPPINGS;
