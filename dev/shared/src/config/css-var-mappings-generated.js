/**
 * CSS Variable Mappings for All Blocks
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/*.json
 * Generated at: 2026-01-04T23:18:45.241Z
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
 * Similar to buildBoxShadow but omits blur, spread, and inset (not supported by text-shadow)
 * @param {Array|null} shadows - Array of shadow layer objects
 * @returns {string} CSS text-shadow value or 'none'
 */
function buildTextShadow(shadows) {
  if (!shadows || !Array.isArray(shadows) || shadows.length === 0) return 'none';
  const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
  if (validLayers.length === 0) return 'none';
  return validLayers.map(layer => {
    const parts = [];
    // text-shadow format: offset-x offset-y color (NO blur, spread, or inset)
    parts.push(formatShadowValue(layer.x));
    parts.push(formatShadowValue(layer.y));
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
    contentTypography: { cssVar: '--accordion-content', unit: null, defaultUnit: null, type: 'typography-panel', cssProperty: null, dependsOn: null, variants: null },
    titleTypography: { cssVar: '--accordion-title', unit: null, defaultUnit: null, type: 'typography-panel', cssProperty: null, dependsOn: null, variants: null },
    showIcon: { cssVar: '--accordion-icon-display', unit: null, defaultUnit: null, type: 'boolean', cssProperty: 'display', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--accordion-icon-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconInactiveColor: { cssVar: '--accordion-icon-color', unit: null, defaultUnit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconInactiveRotation: { cssVar: '--accordion-icon-initial-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconInactiveSize: { cssVar: '--accordion-icon-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconInactiveMaxSize: { cssVar: '--accordion-icon-max-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'max-width', dependsOn: null, variants: null },
    iconInactiveOffsetX: { cssVar: '--accordion-icon-offset-x', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'left', dependsOn: null, variants: null },
    iconInactiveOffsetY: { cssVar: '--accordion-icon-offset-y', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    iconActiveColor: { cssVar: '--accordion-icon-active-color', unit: null, defaultUnit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconActiveRotation: { cssVar: '--accordion-icon-active-initial-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconActiveSize: { cssVar: '--accordion-icon-active-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconActiveMaxSize: { cssVar: '--accordion-icon-active-max-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'max-width', dependsOn: null, variants: null },
    iconActiveOffsetX: { cssVar: '--accordion-icon-active-offset-x', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'left', dependsOn: null, variants: null },
    iconActiveOffsetY: { cssVar: '--accordion-icon-active-offset-y', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    animationDuration: { cssVar: '--accordion-animation-duration', unit: null, defaultUnit: 'ms', type: 'string', cssProperty: 'transition-duration', dependsOn: null, variants: null },
    accordionWidth: { cssVar: '--accordion-width', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'width', dependsOn: null, variants: null },
  },
  tabs: {
    tabsWidth: { cssVar: '--tabs-width', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'width', dependsOn: null, variants: null },
    borderColor: { cssVar: '--tabs-border-color', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    borderWidth: { cssVar: '--tabs-border-width', unit: null, defaultUnit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    borderStyle: { cssVar: '--tabs-border-style', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    borderRadius: { cssVar: '--tabs-border-radius', unit: 'px', defaultUnit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    shadow: { cssVar: '--tabs-border-shadow', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    shadowHover: { cssVar: '--tabs-border-shadow-hover', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    tabButtonColor: { cssVar: '--tabs-button', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    tabButtonFontSize: { cssVar: '--tabs-button-font-size', unit: null, defaultUnit: 'px', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    tabButtonFontWeight: { cssVar: '--tabs-button-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    tabButtonFontStyle: { cssVar: '--tabs-button-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    tabButtonTextTransform: { cssVar: '--tabs-button-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    tabButtonTextDecoration: { cssVar: '--tabs-button-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    tabButtonTextAlign: { cssVar: '--tabs-button-text-align', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    tabButtonPadding: { cssVar: '--tabs-button-padding', unit: null, defaultUnit: 'px', type: 'number', cssProperty: 'padding', dependsOn: null, variants: null },
    tabButtonActiveFontWeight: { cssVar: '--tabs-button-active-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    tabButtonBorderColor: { cssVar: '--tabs-button-border-color', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabButtonActiveBorderColor: { cssVar: '--tabs-button-active-border-color', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabButtonBorderWidth: { cssVar: '--tabs-button-border-width', unit: null, defaultUnit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    tabButtonBorderStyle: { cssVar: '--tabs-button-border-style', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    tabButtonBorderRadius: { cssVar: '--tabs-button-border-radius', unit: 'px', defaultUnit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    tabButtonShadow: { cssVar: '--tabs-button-border-shadow', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    tabButtonShadowHover: { cssVar: '--tabs-button-border-shadow-hover', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    tabButtonActiveContentBorderColor: { cssVar: '--tabs-button-active-content-border-color', unit: null, defaultUnit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabButtonActiveContentBorderWidth: { cssVar: '--tabs-button-active-content-border-width', unit: null, defaultUnit: null, type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabButtonActiveContentBorderStyle: { cssVar: '--tabs-button-active-content-border-style', unit: null, defaultUnit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabListBackgroundColor: { cssVar: '--tabs-list-bg', unit: null, defaultUnit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabsRowBorderColor: { cssVar: '--tabs-row-border-color', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabsRowBorderWidth: { cssVar: '--tabs-row-border-width', unit: null, defaultUnit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    tabsRowBorderStyle: { cssVar: '--tabs-row-border-style', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    tabsRowSpacing: { cssVar: '--tabs-row-spacing', unit: null, defaultUnit: null, type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabsButtonGap: { cssVar: '--tabs-button-gap', unit: null, defaultUnit: 'px', type: 'number', cssProperty: 'gap', dependsOn: null, variants: null },
    tabListAlignment: { cssVar: '--tabs-list-align', unit: null, defaultUnit: null, type: 'string', cssProperty: 'justify-content', dependsOn: null, variants: null },
    tabsListContentBorderColor: { cssVar: '--tabs-list-divider-border-color', unit: null, defaultUnit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabsListContentBorderWidth: { cssVar: '--tabs-list-divider-border-width', unit: null, defaultUnit: null, type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabsListContentBorderStyle: { cssVar: '--tabs-list-divider-border-style', unit: null, defaultUnit: null, type: 'string', cssProperty: null, dependsOn: 'orientation', variants: {
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
    panelBackgroundColor: { cssVar: '--tabs-panel-bg', unit: null, defaultUnit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    panelBorderColor: { cssVar: '--tabs-panel-border-color', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    panelBorderWidth: { cssVar: '--tabs-panel-border-width', unit: null, defaultUnit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    panelBorderStyle: { cssVar: '--tabs-panel-border-style', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    panelBorderRadius: { cssVar: '--tabs-panel-border-radius', unit: 'px', defaultUnit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    showIcon: { cssVar: '--tabs-icon-display', unit: null, defaultUnit: null, type: 'boolean', cssProperty: 'display', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--tabs-icon-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconInactiveColor: { cssVar: '--tabs-icon-color', unit: null, defaultUnit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconInactiveRotation: { cssVar: '--tabs-icon-initial-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconInactiveSize: { cssVar: '--tabs-icon-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconInactiveMaxSize: { cssVar: '--tabs-icon-max-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'max-width', dependsOn: null, variants: null },
    iconInactiveOffsetX: { cssVar: '--tabs-icon-offset-x', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'left', dependsOn: null, variants: null },
    iconInactiveOffsetY: { cssVar: '--tabs-icon-offset-y', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    iconActiveColor: { cssVar: '--tabs-icon-active-color', unit: null, defaultUnit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconActiveRotation: { cssVar: '--tabs-icon-active-initial-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconActiveSize: { cssVar: '--tabs-icon-active-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconActiveMaxSize: { cssVar: '--tabs-icon-active-max-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'max-width', dependsOn: null, variants: null },
    iconActiveOffsetX: { cssVar: '--tabs-icon-active-offset-x', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'left', dependsOn: null, variants: null },
    iconActiveOffsetY: { cssVar: '--tabs-icon-active-offset-y', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
  },
  toc: {
    tocWidth: { cssVar: '--toc-width', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'width', dependsOn: null, variants: null },
    wrapperBackgroundColor: { cssVar: '--toc-wrapper-background-color', unit: null, defaultUnit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    blockBorderColor: { cssVar: '--toc-border-color', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-color', dependsOn: null, variants: null },
    titleColor: { cssVar: '--toc-title', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    linkColor: { cssVar: '--toc-link', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    h1Color: { cssVar: '--toc-h1', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    h1FontSize: { cssVar: '--toc-h1-font-size', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h1FontWeight: { cssVar: '--toc-h1-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h1FontStyle: { cssVar: '--toc-h1-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h1TextTransform: { cssVar: '--toc-h1-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h1TextDecoration: { cssVar: '--toc-h1-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h2Color: { cssVar: '--toc-h2', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    h2FontSize: { cssVar: '--toc-h2-font-size', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h2FontWeight: { cssVar: '--toc-h2-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h2FontStyle: { cssVar: '--toc-h2-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h2TextTransform: { cssVar: '--toc-h2-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h2TextDecoration: { cssVar: '--toc-h2-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h3Color: { cssVar: '--toc-h3', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    h3FontSize: { cssVar: '--toc-h3-font-size', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h3FontWeight: { cssVar: '--toc-h3-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h3FontStyle: { cssVar: '--toc-h3-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h3TextTransform: { cssVar: '--toc-h3-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h3TextDecoration: { cssVar: '--toc-h3-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h4Color: { cssVar: '--toc-h4', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    h4FontSize: { cssVar: '--toc-h4-font-size', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h4FontWeight: { cssVar: '--toc-h4-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h4FontStyle: { cssVar: '--toc-h4-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h4TextTransform: { cssVar: '--toc-h4-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h4TextDecoration: { cssVar: '--toc-h4-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h5Color: { cssVar: '--toc-h5', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    h5FontSize: { cssVar: '--toc-h5-font-size', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h5FontWeight: { cssVar: '--toc-h5-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h5FontStyle: { cssVar: '--toc-h5-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h5TextTransform: { cssVar: '--toc-h5-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h5TextDecoration: { cssVar: '--toc-h5-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h6Color: { cssVar: '--toc-h6', unit: null, defaultUnit: null, type: 'color-panel', cssProperty: null, dependsOn: null, variants: null },
    h6FontSize: { cssVar: '--toc-h6-font-size', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    h6FontWeight: { cssVar: '--toc-h6-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h6FontStyle: { cssVar: '--toc-h6-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h6TextTransform: { cssVar: '--toc-h6-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h6TextDecoration: { cssVar: '--toc-h6-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    showIcon: { cssVar: '--toc-icon-display', unit: null, defaultUnit: null, type: 'boolean', cssProperty: 'display', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--toc-icon-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconInactiveColor: { cssVar: '--toc-icon-color', unit: null, defaultUnit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconInactiveRotation: { cssVar: '--toc-icon-initial-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconInactiveSize: { cssVar: '--toc-icon-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconInactiveMaxSize: { cssVar: '--toc-icon-max-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'max-width', dependsOn: null, variants: null },
    iconInactiveOffsetX: { cssVar: '--toc-icon-offset-x', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'left', dependsOn: null, variants: null },
    iconInactiveOffsetY: { cssVar: '--toc-icon-offset-y', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    iconActiveColor: { cssVar: '--toc-icon-active-color', unit: null, defaultUnit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconActiveRotation: { cssVar: '--toc-icon-active-initial-rotation', unit: 'deg', defaultUnit: 'deg', type: 'string', cssProperty: 'transform', dependsOn: null, variants: null },
    iconActiveSize: { cssVar: '--toc-icon-active-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconActiveMaxSize: { cssVar: '--toc-icon-active-max-size', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'max-width', dependsOn: null, variants: null },
    iconActiveOffsetX: { cssVar: '--toc-icon-active-offset-x', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'left', dependsOn: null, variants: null },
    iconActiveOffsetY: { cssVar: '--toc-icon-active-offset-y', unit: 'px', defaultUnit: 'px', type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    titleFontSize: { cssVar: '--toc-title-font-size', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'font-size', dependsOn: null, variants: null },
    titleFontWeight: { cssVar: '--toc-title-font-weight', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    titleFontStyle: { cssVar: '--toc-title-font-style', unit: null, defaultUnit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    titleTextTransform: { cssVar: '--toc-title-text-transform', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    titleTextDecoration: { cssVar: '--toc-title-text-decoration', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    titleAlignment: { cssVar: '--toc-title-alignment', unit: null, defaultUnit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    blockBorderWidth: { cssVar: '--toc-border-width', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'border-width', dependsOn: null, variants: null },
    blockBorderStyle: { cssVar: '--toc-border-style', unit: null, defaultUnit: null, type: 'object', cssProperty: 'border-style', dependsOn: null, variants: null },
    blockBorderRadius: { cssVar: '--toc-border-radius', unit: null, defaultUnit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    blockShadow: { cssVar: '--toc-border-shadow', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    blockShadowHover: { cssVar: '--toc-border-shadow-hover', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    wrapperPadding: { cssVar: '--toc-wrapper-padding', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'padding', dependsOn: null, variants: null },
    itemSpacing: { cssVar: '--toc-item-spacing', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'gap', dependsOn: null, variants: null },
    levelIndent: { cssVar: '--toc-level-indent', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'margin-left', dependsOn: null, variants: null },
    positionTop: { cssVar: '--toc-position-top', unit: null, defaultUnit: 'px', type: 'string', cssProperty: 'top', dependsOn: null, variants: null },
    zIndex: { cssVar: '--toc-z-index', unit: null, defaultUnit: null, type: 'number', cssProperty: 'z-index', dependsOn: null, variants: null },
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

const UNIT_REGEX = /^-?\d+(?:\.\d+)?\s*([a-zA-Z%]+)$/;

function getUnitFromString(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const match = value.trim().match(UNIT_REGEX);
  return match ? match[1] : '';
}

function inferBoxUnit(value, fallbackUnit = '') {
  if (!value || typeof value !== 'object') {
    return fallbackUnit;
  }

  if (value.unit !== undefined && value.unit !== null && value.unit !== '') {
    return value.unit;
  }

  if (value.value && typeof value.value === 'object') {
    return inferBoxUnit(value.value, fallbackUnit);
  }

  const candidates = [
    value.top,
    value.right,
    value.bottom,
    value.left,
    value.topLeft,
    value.topRight,
    value.bottomRight,
    value.bottomLeft,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (typeof candidate === 'string') {
      const unit = getUnitFromString(candidate);
      if (unit) {
        return unit;
      }
      continue;
    }
    if (typeof candidate === 'object') {
      if (candidate.unit) {
        return candidate.unit;
      }
      if (typeof candidate.value === 'string') {
        const unit = getUnitFromString(candidate.value);
        if (unit) {
          return unit;
        }
      }
    }
  }

  return fallbackUnit;
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
    if (typeof value.value === 'string') {
      return value.value;
    }
    const fallbackUnit = mapping.unit || mapping.defaultUnit || '';
    // IMPORTANT: Enforce mapping's unit if defined (sanitizes old saved values with wrong units)
    // For rotation attrs (unit: 'deg'), this converts old '180px' values to '180deg'
    const unit = mapping.unit ? mapping.unit : (value.unit ?? fallbackUnit);
    return `${value.value}${unit ?? ''}`;
  }

  // Handle object types (border radius, padding, colors, styles)
  if (mapping.type === 'object' && typeof value === 'object') {
    // Handle responsive objects (tablet/mobile keys) - use base value (global is at root, not a device key)
    if ((value.tablet !== undefined || value.mobile !== undefined) && typeof value.value === 'object') {
      return formatCssValue(attrName, value.value, blockType);
    }

    // Border radius format: topLeft topRight bottomRight bottomLeft
    if (value.topLeft !== undefined) {
      const unit = inferBoxUnit(value, mapping.defaultUnit || mapping.unit || 'px');
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
      const unit = isNumeric ? inferBoxUnit(value, mapping.defaultUnit || mapping.unit || '') : '';

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
  const numberUnit = mapping.unit || mapping.defaultUnit;
  if (numberUnit && typeof value === 'number') {
    return `${value}${numberUnit}`;
  }

  // Handle boolean values with cssValueMap
  if (mapping.type === 'boolean' && mapping.cssValueMap) {
    return mapping.cssValueMap[value.toString()];
  }

  // Handle string values with enforced units (sanitize old saved values)
  if (typeof value === 'string' && mapping.unit) {
    const match = value.match(/^([0-9.-]+)(.*)$/);
    if (match) {
      const numValue = match[1];
      const currentUnit = match[2];
      // If mapping specifies a required unit and value has wrong unit, enforce correct unit
      if (currentUnit && currentUnit !== mapping.unit) {
        return `${numValue}${mapping.unit}`;
      }
    }
  }

  // Return value as-is for strings and other types
  return value;
}

/**
 * Decompose box-like objects into per-side CSS variable assignments.
 * Handles top/right/bottom/left and border-radius corner shapes.
 *
 * @param {string} attrName - Attribute name
 * @param {*} value - Box-like value object
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {string} [suffix=''] - Optional suffix (e.g., '-tablet', '-mobile')
 * @returns {Object} Map of CSS variable names to values
 */
export function decomposeObjectToSides(attrName, value, blockType, suffix = '') {
  const mapping = CSS_VAR_MAPPINGS[blockType]?.[attrName];
  if (!mapping || !mapping.cssVar || value === null || value === undefined) return {};
  if (Array.isArray(value)) return {};

  const baseVar = mapping.cssVar;
  const linked = typeof value?.linked === 'boolean' ? value.linked : null;

  const resolveSideValue = (sideValue, fallbackUnit) => {
    if (sideValue === null || sideValue === undefined) return null;
    if (typeof sideValue === 'string') return sideValue;
    if (typeof sideValue === 'number') return '' + sideValue + (fallbackUnit || '');
    if (typeof sideValue === 'object' && sideValue.value !== undefined) {
      const unit = sideValue.unit ?? fallbackUnit ?? '';
      return '' + sideValue.value + unit;
    }
    return null;
  };

  const valuesDiffer = (resolvedValues) => {
    const filtered = resolvedValues.filter((val) => val !== null);
    if (filtered.length <= 1) return false;
    return filtered.some((val) => val !== filtered[0]);
  };

  const unitFromValue = value && typeof value === 'object'
    ? inferBoxUnit(value, mapping.defaultUnit || mapping.unit || '')
    : '';

  // Border radius corners
  if (value && typeof value === 'object' && value.topLeft !== undefined) {
    const radiusUnit = inferBoxUnit(value, mapping.defaultUnit || mapping.unit || 'px');
    const corners = {
      'top-left': value.topLeft,
      'top-right': value.topRight,
      'bottom-right': value.bottomRight,
      'bottom-left': value.bottomLeft,
    };

    const resolvedCorners = Object.entries(corners).map(([corner, cornerValue]) => ({
      corner,
      resolved: resolveSideValue(cornerValue, radiusUnit),
    }));

    const shouldEmit = linked === false || valuesDiffer(resolvedCorners.map((entry) => entry.resolved));
    if (!shouldEmit) {
      return {};
    }

    const result = {};
    resolvedCorners.forEach(({ corner, resolved }) => {
      if (resolved !== null) {
        result[baseVar + '-' + corner + suffix] = resolved;
      }
    });

    return result;
  }

  // Directional sides
  if (value && typeof value === 'object' &&
      (value.top !== undefined || value.right !== undefined ||
       value.bottom !== undefined || value.left !== undefined)) {
    const unit = unitFromValue || mapping.unit || '';
    const sides = {
      top: value.top,
      right: value.right,
      bottom: value.bottom,
      left: value.left,
    };

    const resolvedSides = Object.entries(sides).map(([side, sideValue]) => ({
      side,
      resolved: resolveSideValue(sideValue, unit),
    }));

    const shouldEmit = linked === false || valuesDiffer(resolvedSides.map((entry) => entry.resolved));
    if (!shouldEmit) {
      return {};
    }

    const result = {};
    resolvedSides.forEach(({ side, resolved }) => {
      if (resolved !== null) {
        result[baseVar + '-' + side + suffix] = resolved;
      }
    });

    return result;
  }

  return {};
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
