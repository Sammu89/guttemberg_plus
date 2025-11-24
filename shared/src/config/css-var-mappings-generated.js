/**
 * CSS Variable Mappings for All Blocks
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/*.json
 * Generated at: 2025-11-24T23:11:16.771Z
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
 *     type: 'string' | 'number' | 'object' | 'boolean'
 *   }
 * }
 */
export const CSS_VAR_MAPPINGS = {
  accordion: {
    titleColor: { cssVar: '--accordion-title-color', unit: null, type: 'string' },
    titleBackgroundColor: { cssVar: '--accordion-title-bg', unit: null, type: 'string' },
    hoverTitleColor: { cssVar: '--accordion-title-hover-color', unit: null, type: 'string' },
    hoverTitleBackgroundColor: { cssVar: '--accordion-title-hover-bg', unit: null, type: 'string' },
    contentColor: { cssVar: '--accordion-content-color', unit: null, type: 'string' },
    contentBackgroundColor: { cssVar: '--accordion-content-bg', unit: null, type: 'string' },
    accordionBorderColor: { cssVar: '--accordion-border-color', unit: null, type: 'string' },
    dividerBorderColor: { cssVar: '--accordion-divider-color', unit: null, type: 'string' },
    iconColor: { cssVar: '--accordion-icon-color', unit: null, type: 'string' },
    titleFontSize: { cssVar: '--accordion-title-font-size', unit: 'px', type: 'number' },
    titleFontWeight: { cssVar: '--accordion-title-font-weight', unit: null, type: 'string' },
    titleFontFamily: { cssVar: '--accordion-title-font-family', unit: null, type: 'string' },
    titleLineHeight: { cssVar: '--accordion-title-line-height', unit: null, type: 'number' },
    titleFontStyle: { cssVar: '--accordion-title-font-style', unit: null, type: 'string' },
    titleTextTransform: { cssVar: '--accordion-title-text-transform', unit: null, type: 'string' },
    titleTextDecoration: { cssVar: '--accordion-title-text-decoration', unit: null, type: 'string' },
    titleAlignment: { cssVar: '--accordion-title-alignment', unit: null, type: 'string' },
    contentFontSize: { cssVar: '--accordion-content-font-size', unit: 'px', type: 'number' },
    contentFontWeight: { cssVar: '--accordion-content-font-weight', unit: null, type: 'string' },
    contentFontFamily: { cssVar: '--accordion-content-font-family', unit: null, type: 'string' },
    contentLineHeight: { cssVar: '--accordion-content-line-height', unit: null, type: 'number' },
    contentFontStyle: { cssVar: '--accordion-content-font-style', unit: null, type: 'string' },
    contentTextTransform: { cssVar: '--accordion-content-text-transform', unit: null, type: 'string' },
    contentTextDecoration: { cssVar: '--accordion-content-text-decoration', unit: null, type: 'string' },
    accordionBorderThickness: { cssVar: '--accordion-border-width', unit: 'px', type: 'number' },
    accordionBorderStyle: { cssVar: '--accordion-border-style', unit: null, type: 'string' },
    accordionBorderRadius: { cssVar: '--accordion-border-radius', unit: 'px', type: 'object' },
    accordionShadow: { cssVar: '--accordion-shadow', unit: null, type: 'string' },
    accordionShadowHover: { cssVar: '--accordion-shadow-hover', unit: null, type: 'string' },
    dividerBorderThickness: { cssVar: '--accordion-divider-width', unit: 'px', type: 'number' },
    dividerBorderStyle: { cssVar: '--accordion-divider-style', unit: null, type: 'string' },
    titlePadding: { cssVar: '--accordion-title-padding', unit: 'px', type: 'object' },
    contentPadding: { cssVar: '--accordion-content-padding', unit: 'px', type: 'object' },
    accordionMarginBottom: { cssVar: '--accordion-margin-bottom', unit: 'px', type: 'number' },
    itemSpacing: { cssVar: '--accordion-item-spacing', unit: 'px', type: 'number' },
    iconSize: { cssVar: '--accordion-icon-size', unit: 'px', type: 'number' },
    iconRotation: { cssVar: '--accordion-icon-rotation', unit: 'deg', type: 'number' },
  },
  tabs: {
    showIcon: { cssVar: '--tab-show-icon', unit: null, type: 'boolean' },
    iconColor: { cssVar: '--icon-color', unit: null, type: 'string' },
    iconSize: { cssVar: '--icon-size', unit: 'px', type: 'number' },
    iconRotation: { cssVar: '--icon-rotation', unit: 'deg', type: 'number' },
    tabButtonColor: { cssVar: '--tab-button-color', unit: null, type: 'string' },
    tabButtonBackgroundColor: { cssVar: '--tab-button-bg', unit: null, type: 'string' },
    tabButtonHoverColor: { cssVar: '--tab-button-hover-color', unit: null, type: 'string' },
    tabButtonHoverBackgroundColor: { cssVar: '--tab-button-hover-bg', unit: null, type: 'string' },
    tabButtonActiveColor: { cssVar: '--tab-button-active-color', unit: null, type: 'string' },
    tabButtonActiveBackgroundColor: { cssVar: '--tab-button-active-bg', unit: null, type: 'string' },
    tabButtonActiveBorderColor: { cssVar: '--tab-button-active-border-color', unit: null, type: 'string' },
    tabButtonActiveBorderBottomColor: { cssVar: '--tab-button-active-border-bottom-color', unit: null, type: 'string' },
    tabButtonBorderColor: { cssVar: '--tab-button-border-color', unit: null, type: 'string' },
    tabButtonBorderWidth: { cssVar: '--tab-button-border-width', unit: 'px', type: 'number' },
    tabButtonBorderStyle: { cssVar: '--tab-button-border-style', unit: null, type: 'string' },
    tabButtonBorderRadius: { cssVar: '--tab-button-border-radius', unit: 'px', type: 'object' },
    tabButtonShadow: { cssVar: '--tab-button-shadow', unit: null, type: 'string' },
    tabButtonShadowHover: { cssVar: '--tab-button-shadow-hover', unit: null, type: 'string' },
    tabButtonFontSize: { cssVar: '--tab-button-font-size', unit: 'px', type: 'number' },
    tabButtonFontWeight: { cssVar: '--tab-button-font-weight', unit: null, type: 'string' },
    tabButtonFontStyle: { cssVar: '--tab-button-font-style', unit: null, type: 'string' },
    tabButtonTextTransform: { cssVar: '--tab-button-text-transform', unit: null, type: 'string' },
    tabButtonTextDecoration: { cssVar: '--tab-button-text-decoration', unit: null, type: 'string' },
    tabButtonTextAlign: { cssVar: '--tab-button-text-align', unit: null, type: 'string' },
    tabButtonPadding: { cssVar: '--tab-button-padding', unit: 'px', type: 'object' },
    tabListBackgroundColor: { cssVar: '--tab-list-bg', unit: null, type: 'string' },
    tabListAlignment: { cssVar: '--tab-list-align', unit: null, type: 'string' },
    panelColor: { cssVar: '--tab-panel-color', unit: null, type: 'string' },
    panelBackgroundColor: { cssVar: '--tab-panel-bg', unit: null, type: 'string' },
    panelBorderColor: { cssVar: '--tab-panel-border-color', unit: null, type: 'string' },
    panelBorderWidth: { cssVar: '--tab-panel-border-width', unit: 'px', type: 'number' },
    panelBorderStyle: { cssVar: '--tab-panel-border-style', unit: null, type: 'string' },
    panelBorderRadius: { cssVar: '--tab-panel-border-radius', unit: 'px', type: 'object' },
    panelShadow: { cssVar: '--tab-panel-shadow', unit: null, type: 'string' },
    dividerLineColor: { cssVar: '--divider-color', unit: null, type: 'string' },
    dividerLineWidth: { cssVar: '--divider-width', unit: 'px', type: 'number' },
    dividerLineStyle: { cssVar: '--divider-style', unit: null, type: 'string' },
    verticalTabListWidth: { cssVar: '--vertical-tab-list-width', unit: 'px', type: 'number' },
    itemSpacing: { cssVar: '--tabs-item-spacing', unit: 'px', type: 'number' },
  },
  toc: {
    wrapperBackgroundColor: { cssVar: '--toc-wrapper-background-color', unit: null, type: 'string' },
    wrapperBorderColor: { cssVar: '--toc-wrapper-border-color', unit: null, type: 'string' },
    titleColor: { cssVar: '--toc-title-color', unit: null, type: 'string' },
    titleBackgroundColor: { cssVar: '--toc-title-background-color', unit: null, type: 'string' },
    linkColor: { cssVar: '--toc-link-color', unit: null, type: 'string' },
    linkHoverColor: { cssVar: '--toc-link-hover-color', unit: null, type: 'string' },
    linkActiveColor: { cssVar: '--toc-link-active-color', unit: null, type: 'string' },
    linkVisitedColor: { cssVar: '--toc-link-visited-color', unit: null, type: 'string' },
    numberingColor: { cssVar: '--toc-numbering-color', unit: null, type: 'string' },
    level1Color: { cssVar: '--toc-level1-color', unit: null, type: 'string' },
    level2Color: { cssVar: '--toc-level2-color', unit: null, type: 'string' },
    level3PlusColor: { cssVar: '--toc-level3-plus-color', unit: null, type: 'string' },
    collapseIconColor: { cssVar: '--toc-collapse-icon-color', unit: null, type: 'string' },
    titleFontSize: { cssVar: '--toc-title-font-size', unit: 'px', type: 'number' },
    titleFontWeight: { cssVar: '--toc-title-font-weight', unit: null, type: 'string' },
    titleTextTransform: { cssVar: '--toc-title-text-transform', unit: null, type: 'string' },
    titleAlignment: { cssVar: '--toc-title-alignment', unit: null, type: 'string' },
    level1FontSize: { cssVar: '--toc-level1-font-size', unit: 'px', type: 'number' },
    level1FontWeight: { cssVar: '--toc-level1-font-weight', unit: null, type: 'string' },
    level1FontStyle: { cssVar: '--toc-level1-font-style', unit: null, type: 'string' },
    level1TextTransform: { cssVar: '--toc-level1-text-transform', unit: null, type: 'string' },
    level1TextDecoration: { cssVar: '--toc-level1-text-decoration', unit: null, type: 'string' },
    level2FontSize: { cssVar: '--toc-level2-font-size', unit: 'px', type: 'number' },
    level2FontWeight: { cssVar: '--toc-level2-font-weight', unit: null, type: 'string' },
    level2FontStyle: { cssVar: '--toc-level2-font-style', unit: null, type: 'string' },
    level2TextTransform: { cssVar: '--toc-level2-text-transform', unit: null, type: 'string' },
    level2TextDecoration: { cssVar: '--toc-level2-text-decoration', unit: null, type: 'string' },
    level3PlusFontSize: { cssVar: '--toc-level3-plus-font-size', unit: 'px', type: 'number' },
    level3PlusFontWeight: { cssVar: '--toc-level3-plus-font-weight', unit: null, type: 'string' },
    level3PlusFontStyle: { cssVar: '--toc-level3-plus-font-style', unit: null, type: 'string' },
    level3PlusTextTransform: { cssVar: '--toc-level3-plus-text-transform', unit: null, type: 'string' },
    level3PlusTextDecoration: { cssVar: '--toc-level3-plus-text-decoration', unit: null, type: 'string' },
    wrapperBorderWidth: { cssVar: '--toc-border-width', unit: 'px', type: 'number' },
    wrapperBorderStyle: { cssVar: '--toc-border-style', unit: null, type: 'string' },
    wrapperBorderRadius: { cssVar: '--toc-border-radius', unit: 'px', type: 'number' },
    wrapperShadow: { cssVar: '--toc-wrapper-shadow', unit: null, type: 'string' },
    wrapperShadowHover: { cssVar: '--toc-wrapper-shadow-hover', unit: null, type: 'string' },
    wrapperPadding: { cssVar: '--toc-wrapper-padding', unit: 'px', type: 'number' },
    listPaddingLeft: { cssVar: '--toc-list-padding-left', unit: 'px', type: 'number' },
    itemSpacing: { cssVar: '--toc-item-spacing', unit: 'px', type: 'number' },
    levelIndent: { cssVar: '--toc-level-indent', unit: 'px', type: 'number' },
    positionTop: { cssVar: '--toc-position-top', unit: 'px', type: 'number' },
    zIndex: { cssVar: '--toc-z-index', unit: null, type: 'number' },
    collapseIconSize: { cssVar: '--toc-collapse-icon-size', unit: 'px', type: 'number' },
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

export default CSS_VAR_MAPPINGS;
