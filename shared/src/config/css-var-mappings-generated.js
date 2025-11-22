/**
 * CSS Variable Mappings for All Blocks
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/*.json
 * Generated at: 2025-11-22T17:16:11.911Z
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
    activeTitleColor: { cssVar: '--accordion-title-active-color', unit: null, type: 'string' },
    activeTitleBackgroundColor: { cssVar: '--accordion-title-active-bg', unit: null, type: 'string' },
    contentColor: { cssVar: '--accordion-content-color', unit: null, type: 'string' },
    contentBackgroundColor: { cssVar: '--accordion-content-bg', unit: null, type: 'string' },
    borderColor: { cssVar: '--accordion-border-color', unit: null, type: 'string' },
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
    borderWidth: { cssVar: '--accordion-border-width', unit: null, type: 'string' },
    borderRadius: { cssVar: '--accordion-border-radius', unit: null, type: 'string' },
    accordionShadow: { cssVar: '--accordion-shadow', unit: null, type: 'string' },
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
    titleColor: { cssVar: '--tab-button-color', unit: null, type: 'string' },
    titleBackgroundColor: { cssVar: '--tab-button-bg', unit: null, type: 'string' },
    hoverTitleColor: { cssVar: '--tab-button-hover-color', unit: null, type: 'string' },
    hoverTitleBackgroundColor: { cssVar: '--tab-button-hover-bg', unit: null, type: 'string' },
    activeTitleColor: { cssVar: '--tab-button-active-color', unit: null, type: 'string' },
    activeTitleBackgroundColor: { cssVar: '--tab-button-active-bg', unit: null, type: 'string' },
    tabButtonActiveColor: { cssVar: '--tab-button-active-color', unit: null, type: 'string' },
    tabButtonActiveBackground: { cssVar: '--tab-button-active-bg', unit: null, type: 'string' },
    tabButtonActiveBorderColor: { cssVar: '--tab-button-active-border-color', unit: null, type: 'string' },
    tabButtonActiveBorderBottomColor: { cssVar: '--tab-button-active-border-bottom-color', unit: null, type: 'string' },
    contentColor: { cssVar: '--panel-color', unit: null, type: 'string' },
    contentBackgroundColor: { cssVar: '--panel-bg', unit: null, type: 'string' },
    panelBackground: { cssVar: '--panel-bg', unit: null, type: 'string' },
    panelColor: { cssVar: '--panel-color', unit: null, type: 'string' },
    tabListBackground: { cssVar: '--tabs-list-bg', unit: null, type: 'string' },
    tabBorderColor: { cssVar: '--tab-button-border-color', unit: null, type: 'string' },
    containerBorderColor: { cssVar: '--tabs-container-border-color', unit: null, type: 'string' },
    panelBorderColor: { cssVar: '--panel-border-color', unit: null, type: 'string' },
    tabListBorderBottomColor: { cssVar: '--tabs-list-border-bottom-color', unit: null, type: 'string' },
    dividerColor: { cssVar: '--divider-color', unit: null, type: 'string' },
    borderColor: { cssVar: '--tabs-border-color', unit: null, type: 'string' },
    accordionBorderColor: { cssVar: '--tabs-border-color', unit: null, type: 'string' },
    dividerBorderColor: { cssVar: '--divider-border-color', unit: null, type: 'string' },
    iconColor: { cssVar: '--icon-color', unit: null, type: 'string' },
    titleFontSize: { cssVar: '--tab-button-font-size', unit: 'px', type: 'number' },
    titleFontWeight: { cssVar: '--tab-button-font-weight', unit: null, type: 'string' },
    titleFontFamily: { cssVar: '--tab-button-font-family', unit: null, type: 'string' },
    titleLineHeight: { cssVar: '--tab-button-line-height', unit: null, type: 'number' },
    titleFontStyle: { cssVar: '--tab-button-font-style', unit: null, type: 'string' },
    titleTextTransform: { cssVar: '--tab-button-text-transform', unit: null, type: 'string' },
    titleTextDecoration: { cssVar: '--tab-button-text-decoration', unit: null, type: 'string' },
    titleAlignment: { cssVar: '--tab-button-text-align', unit: null, type: 'string' },
    contentFontSize: { cssVar: '--panel-font-size', unit: 'px', type: 'number' },
    contentFontWeight: { cssVar: '--panel-font-weight', unit: null, type: 'string' },
    contentFontFamily: { cssVar: '--panel-font-family', unit: null, type: 'string' },
    contentLineHeight: { cssVar: '--panel-line-height', unit: null, type: 'number' },
    contentFontStyle: { cssVar: '--panel-font-style', unit: null, type: 'string' },
    contentTextTransform: { cssVar: '--panel-text-transform', unit: null, type: 'string' },
    contentTextDecoration: { cssVar: '--panel-text-decoration', unit: null, type: 'string' },
    panelFontSize: { cssVar: '--panel-font-size', unit: 'px', type: 'number' },
    panelLineHeight: { cssVar: '--panel-line-height', unit: null, type: 'number' },
    verticalTabButtonTextAlign: { cssVar: '--vertical-tab-button-text-align', unit: null, type: 'string' },
    tabBorderThickness: { cssVar: '--tab-button-border-width', unit: 'px', type: 'number' },
    tabBorderStyle: { cssVar: '--tab-button-border-style', unit: null, type: 'string' },
    tabBorderRadius: { cssVar: '--tab-button-border-radius', unit: 'px', type: 'object' },
    tabShadow: { cssVar: '--tab-button-shadow', unit: null, type: 'string' },
    tabButtonBorderRadius: { cssVar: '--tab-button-border-radius', unit: 'px', type: 'object' },
    containerBorderWidth: { cssVar: '--tabs-container-border-width', unit: 'px', type: 'number' },
    containerBorderStyle: { cssVar: '--tabs-container-border-style', unit: null, type: 'string' },
    containerBorderRadius: { cssVar: '--tabs-container-border-radius', unit: 'px', type: 'object' },
    containerShadow: { cssVar: '--tabs-container-shadow', unit: null, type: 'string' },
    panelBorderWidth: { cssVar: '--panel-border-width', unit: 'px', type: 'number' },
    panelBorderStyle: { cssVar: '--panel-border-style', unit: null, type: 'string' },
    panelBorderRadius: { cssVar: '--panel-border-radius', unit: 'px', type: 'number' },
    tabListBorderBottomWidth: { cssVar: '--tabs-list-border-bottom-width', unit: 'px', type: 'number' },
    tabListBorderBottomStyle: { cssVar: '--tabs-list-border-bottom-style', unit: null, type: 'string' },
    dividerThickness: { cssVar: '--divider-thickness', unit: 'px', type: 'number' },
    dividerStyle: { cssVar: '--divider-style', unit: null, type: 'string' },
    accordionBorderThickness: { cssVar: '--tabs-border-width', unit: 'px', type: 'number' },
    accordionBorderStyle: { cssVar: '--tabs-border-style', unit: null, type: 'string' },
    accordionBorderRadius: { cssVar: '--tabs-border-radius', unit: 'px', type: 'object' },
    accordionShadow: { cssVar: '--tabs-shadow', unit: null, type: 'string' },
    borderWidth: { cssVar: '--tabs-border-width', unit: null, type: 'string' },
    borderRadius: { cssVar: '--tabs-border-radius', unit: null, type: 'string' },
    dividerBorderThickness: { cssVar: '--divider-border-thickness', unit: 'px', type: 'number' },
    dividerBorderStyle: { cssVar: '--divider-border-style', unit: null, type: 'string' },
    titlePadding: { cssVar: '--tab-button-padding', unit: 'px', type: 'object' },
    contentPadding: { cssVar: '--panel-padding', unit: 'px', type: 'object' },
    panelPadding: { cssVar: '--panel-padding', unit: 'px', type: 'object' },
    tabListPadding: { cssVar: '--tabs-list-padding', unit: 'px', type: 'object' },
    tabListGap: { cssVar: '--tabs-list-gap', unit: 'px', type: 'number' },
    tabsAlignment: { cssVar: '--tabs-alignment', unit: null, type: 'string' },
    verticalTabListWidth: { cssVar: '--vertical-tab-list-width', unit: 'px', type: 'number' },
    accordionMarginBottom: { cssVar: '--tabs-margin-bottom', unit: 'px', type: 'number' },
    itemSpacing: { cssVar: '--tabs-item-spacing', unit: 'px', type: 'number' },
    iconSize: { cssVar: '--icon-size', unit: 'px', type: 'number' },
    iconRotation: { cssVar: '--icon-rotation', unit: 'deg', type: 'number' },
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
