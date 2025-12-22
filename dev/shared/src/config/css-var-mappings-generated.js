/**
 * CSS Variable Mappings for All Blocks
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/*.json
 * Generated at: 2025-12-22T19:13:33.432Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

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
    titleColor: { cssVar: '--accordion-title-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    titleBackgroundColor: { cssVar: '--accordion-title-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    hoverTitleColor: { cssVar: '--accordion-title-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    hoverTitleBackgroundColor: { cssVar: '--accordion-title-hover-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    contentBackgroundColor: { cssVar: '--accordion-content-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    borderColor: { cssVar: '--accordion-border-color', unit: null, type: 'string', cssProperty: 'border-color', dependsOn: null, variants: null },
    dividerColor: { cssVar: '--accordion-divider-color', unit: null, type: 'string', cssProperty: 'border-top-color', dependsOn: null, variants: null },
    iconColor: { cssVar: '--accordion-icon-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    titleFontSize: { cssVar: '--accordion-title-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    titleFontWeight: { cssVar: '--accordion-title-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    titleFontStyle: { cssVar: '--accordion-title-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    titleTextTransform: { cssVar: '--accordion-title-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    titleTextDecoration: { cssVar: '--accordion-title-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    titleAlignment: { cssVar: '--accordion-title-alignment', unit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    borderWidth: { cssVar: '--accordion-border-width', unit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    borderStyle: { cssVar: '--accordion-border-style', unit: null, type: 'string', cssProperty: 'border-style', dependsOn: null, variants: null },
    borderRadius: { cssVar: '--accordion-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    shadow: { cssVar: '--accordion-border-shadow', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    shadowHover: { cssVar: '--accordion-border-shadow-hover', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    dividerWidth: { cssVar: '--accordion-divider-width', unit: 'px', type: 'number', cssProperty: 'border-top-width', dependsOn: null, variants: null },
    dividerStyle: { cssVar: '--accordion-divider-style', unit: null, type: 'string', cssProperty: 'border-top-style', dependsOn: null, variants: null },
    iconSize: { cssVar: '--accordion-icon-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--accordion-icon-rotation', unit: 'deg', type: 'number', cssProperty: 'transform', dependsOn: null, variants: null },
  },
  tabs: {
    iconColor: { cssVar: '--tabs-icon-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    iconSize: { cssVar: '--tabs-icon-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    iconRotation: { cssVar: '--tabs-icon-rotation-base', unit: 'deg', type: 'number', cssProperty: 'transform', dependsOn: null, variants: null },
    iconRotationActive: { cssVar: '--tabs-icon-rotation-active', unit: 'deg', type: 'number', cssProperty: 'transform', dependsOn: null, variants: null },
    tabButtonColor: { cssVar: '--tabs-button-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    tabButtonBackgroundColor: { cssVar: '--tabs-button-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabButtonHoverColor: { cssVar: '--tabs-button-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    tabButtonHoverBackgroundColor: { cssVar: '--tabs-button-hover-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabButtonActiveColor: { cssVar: '--tabs-button-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    tabButtonActiveBackgroundColor: { cssVar: '--tabs-button-active-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabButtonActiveContentBorderWidth: { cssVar: '--tabs-button-active-content-border-width', unit: 'px', type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabButtonActiveFontWeight: { cssVar: '--tabs-button-active-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    tabButtonBorderColor: { cssVar: '--tabs-button-border-color', unit: null, type: 'string', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabButtonActiveBorderColor: { cssVar: '--tabs-button-active-border-color', unit: null, type: 'string', cssProperty: 'border-color', dependsOn: null, variants: null },
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
    tabButtonBorderWidth: { cssVar: '--tabs-button-border-width', unit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    tabButtonBorderStyle: { cssVar: '--tabs-button-border-style', unit: null, type: 'string', cssProperty: 'border-style', dependsOn: null, variants: null },
    tabButtonBorderRadius: { cssVar: '--tabs-button-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    tabButtonShadow: { cssVar: '--tabs-button-border-shadow', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    tabButtonShadowHover: { cssVar: '--tabs-button-border-shadow-hover', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    tabButtonFontSize: { cssVar: '--tabs-button-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    tabButtonFontWeight: { cssVar: '--tabs-button-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    tabButtonFontStyle: { cssVar: '--tabs-button-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    tabButtonTextTransform: { cssVar: '--tabs-button-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    tabButtonTextDecoration: { cssVar: '--tabs-button-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    tabButtonTextAlign: { cssVar: '--tabs-button-text-align', unit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    tabButtonPadding: { cssVar: '--tabs-button-padding', unit: 'rem', type: 'number', cssProperty: 'padding', dependsOn: null, variants: null },
    tabListBackgroundColor: { cssVar: '--tabs-list-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    tabsRowBorderColor: { cssVar: '--tabs-row-border-color', unit: null, type: 'string', cssProperty: 'border-color', dependsOn: null, variants: null },
    tabsRowBorderWidth: { cssVar: '--tabs-row-border-width', unit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    tabsRowBorderStyle: { cssVar: '--tabs-row-border-style', unit: null, type: 'string', cssProperty: 'border-style', dependsOn: null, variants: null },
    tabListAlignment: { cssVar: '--tabs-list-align', unit: null, type: 'string', cssProperty: 'justify-content', dependsOn: null, variants: null },
    tabsRowSpacing: { cssVar: '--tabs-row-spacing', unit: 'rem', type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
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
    tabsButtonGap: { cssVar: '--tabs-button-gap', unit: 'rem', type: 'number', cssProperty: 'gap', dependsOn: null, variants: null },
    panelBackgroundColor: { cssVar: '--tabs-panel-bg', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    panelBorderColor: { cssVar: '--tabs-panel-border-color', unit: null, type: 'string', cssProperty: 'border-color', dependsOn: null, variants: null },
    panelBorderWidth: { cssVar: '--tabs-panel-border-width', unit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    panelBorderStyle: { cssVar: '--tabs-panel-border-style', unit: null, type: 'string', cssProperty: 'border-style', dependsOn: null, variants: null },
    panelBorderRadius: { cssVar: '--tabs-panel-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    borderColor: { cssVar: '--tabs-border-color', unit: null, type: 'string', cssProperty: 'border-color', dependsOn: null, variants: null },
    borderWidth: { cssVar: '--tabs-border-width', unit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    borderStyle: { cssVar: '--tabs-border-style', unit: null, type: 'string', cssProperty: 'border-style', dependsOn: null, variants: null },
    borderRadius: { cssVar: '--tabs-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    shadow: { cssVar: '--tabs-border-shadow', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    shadowHover: { cssVar: '--tabs-border-shadow-hover', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
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
    tabsListContentBorderWidth: { cssVar: '--tabs-list-divider-border-width', unit: 'px', type: 'number', cssProperty: null, dependsOn: 'orientation', variants: {
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
  },
  toc: {
    wrapperBackgroundColor: { cssVar: '--toc-wrapper-background-color', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    blockBorderColor: { cssVar: '--toc-border-color', unit: null, type: 'string', cssProperty: 'border-color', dependsOn: null, variants: null },
    titleColor: { cssVar: '--toc-title-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    titleBackgroundColor: { cssVar: '--toc-title-background-color', unit: null, type: 'string', cssProperty: 'background-color', dependsOn: null, variants: null },
    linkColor: { cssVar: '--toc-link-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    linkHoverColor: { cssVar: '--toc-link-hover-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    linkActiveColor: { cssVar: '--toc-link-active-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    linkVisitedColor: { cssVar: '--toc-link-visited-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    numberingColor: { cssVar: '--toc-numbering-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h1Color: { cssVar: '--toc-h1-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h1FontSize: { cssVar: '--toc-h1-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    h1FontWeight: { cssVar: '--toc-h1-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h1FontStyle: { cssVar: '--toc-h1-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h1TextTransform: { cssVar: '--toc-h1-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h1TextDecoration: { cssVar: '--toc-h1-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h2Color: { cssVar: '--toc-h2-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h2FontSize: { cssVar: '--toc-h2-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    h2FontWeight: { cssVar: '--toc-h2-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h2FontStyle: { cssVar: '--toc-h2-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h2TextTransform: { cssVar: '--toc-h2-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h2TextDecoration: { cssVar: '--toc-h2-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h3Color: { cssVar: '--toc-h3-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h3FontSize: { cssVar: '--toc-h3-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    h3FontWeight: { cssVar: '--toc-h3-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h3FontStyle: { cssVar: '--toc-h3-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h3TextTransform: { cssVar: '--toc-h3-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h3TextDecoration: { cssVar: '--toc-h3-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h4Color: { cssVar: '--toc-h4-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h4FontSize: { cssVar: '--toc-h4-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    h4FontWeight: { cssVar: '--toc-h4-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h4FontStyle: { cssVar: '--toc-h4-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h4TextTransform: { cssVar: '--toc-h4-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h4TextDecoration: { cssVar: '--toc-h4-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h5Color: { cssVar: '--toc-h5-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h5FontSize: { cssVar: '--toc-h5-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    h5FontWeight: { cssVar: '--toc-h5-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h5FontStyle: { cssVar: '--toc-h5-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h5TextTransform: { cssVar: '--toc-h5-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h5TextDecoration: { cssVar: '--toc-h5-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    h6Color: { cssVar: '--toc-h6-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    h6FontSize: { cssVar: '--toc-h6-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    h6FontWeight: { cssVar: '--toc-h6-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    h6FontStyle: { cssVar: '--toc-h6-font-style', unit: null, type: 'string', cssProperty: 'font-style', dependsOn: null, variants: null },
    h6TextTransform: { cssVar: '--toc-h6-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    h6TextDecoration: { cssVar: '--toc-h6-text-decoration', unit: null, type: 'string', cssProperty: 'text-decoration', dependsOn: null, variants: null },
    collapseIconColor: { cssVar: '--toc-collapse-icon-color', unit: null, type: 'string', cssProperty: 'color', dependsOn: null, variants: null },
    titleFontSize: { cssVar: '--toc-title-font-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
    titleFontWeight: { cssVar: '--toc-title-font-weight', unit: null, type: 'string', cssProperty: 'font-weight', dependsOn: null, variants: null },
    titleTextTransform: { cssVar: '--toc-title-text-transform', unit: null, type: 'string', cssProperty: 'text-transform', dependsOn: null, variants: null },
    titleAlignment: { cssVar: '--toc-title-alignment', unit: null, type: 'string', cssProperty: 'text-align', dependsOn: null, variants: null },
    titlePadding: { cssVar: '--toc-title-padding', unit: null, type: 'object', cssProperty: 'padding', dependsOn: null, variants: null },
    blockBorderWidth: { cssVar: '--toc-border-width', unit: 'px', type: 'number', cssProperty: 'border-width', dependsOn: null, variants: null },
    blockBorderStyle: { cssVar: '--toc-border-style', unit: null, type: 'string', cssProperty: 'border-style', dependsOn: null, variants: null },
    blockBorderRadius: { cssVar: '--toc-border-radius', unit: 'px', type: 'object', cssProperty: 'border-radius', dependsOn: null, variants: null },
    blockShadow: { cssVar: '--toc-border-shadow', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    blockShadowHover: { cssVar: '--toc-border-shadow-hover', unit: null, type: 'string', cssProperty: 'box-shadow', dependsOn: null, variants: null },
    wrapperPadding: { cssVar: '--toc-wrapper-padding', unit: 'rem', type: 'number', cssProperty: 'padding', dependsOn: null, variants: null },
    listPaddingLeft: { cssVar: '--toc-list-padding-left', unit: 'rem', type: 'number', cssProperty: 'padding-left', dependsOn: null, variants: null },
    itemSpacing: { cssVar: '--toc-item-spacing', unit: 'rem', type: 'number', cssProperty: 'margin-bottom', dependsOn: null, variants: null },
    levelIndent: { cssVar: '--toc-level-indent', unit: null, type: 'string', cssProperty: 'margin-left', dependsOn: null, variants: null },
    positionTop: { cssVar: '--toc-position-top', unit: 'rem', type: 'number', cssProperty: 'top', dependsOn: null, variants: null },
    zIndex: { cssVar: '--toc-z-index', unit: null, type: 'number', cssProperty: 'z-index', dependsOn: null, variants: null },
    collapseIconSize: { cssVar: '--toc-collapse-icon-size', unit: 'rem', type: 'number', cssProperty: 'font-size', dependsOn: null, variants: null },
  },
};

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

  // Handle object types (border radius, padding)
  if (mapping.type === 'object' && typeof value === 'object') {
    // Border radius format: topLeft topRight bottomRight bottomLeft
    if (attrName.toLowerCase().includes('radius')) {
      return `${value.topLeft}px ${value.topRight}px ${value.bottomRight}px ${value.bottomLeft}px`;
    }
    // Padding format: top right bottom left
    if (attrName.toLowerCase().includes('padding')) {
      return `${value.top}px ${value.right}px ${value.bottom}px ${value.left}px`;
    }
    // Default object handling
    return JSON.stringify(value);
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
