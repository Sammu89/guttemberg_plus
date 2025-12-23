/**
 * Style Builder for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-23T22:20:59.779Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Format border radius object to CSS string
 * @param {Object} radius - Border radius object with topLeft, topRight, bottomRight, bottomLeft
 * @returns {string|null} Formatted border radius or null
 */
export function formatBorderRadius(radius) {
  if (!radius || typeof radius !== 'object') return null;
  const { topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0 } = radius;
  return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
}

/**
 * Format padding rectangle from single number value
 * Top/bottom use full value, left/right use double value for rectangular button appearance
 * @param {number} value - Padding value in pixels
 * @returns {string|null} Formatted padding (e.g., "12px 24px") or null
 */
export function formatPaddingRectangle(value) {
  if (value === undefined || value === null || typeof value !== 'number') return null;
  const vertical = value;
  const horizontal = value * 2;
  return `${vertical}px ${horizontal}px`;
}

import { resolveCssProperty } from '@shared/config/css-var-mappings-generated';
const toCamelCase = (prop) => prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Build inline styles for editor based on effective values
 * @param {Object} values - Effective values (defaults + theme + customizations)
 * @returns {Object} Style objects keyed by selector type
 */
export function buildEditorStyles(values) {
  const styles = {};

  // Styles for default
  styles.default = {};
    if (values.showIcon !== undefined && values.showIcon !== null) {
      styles.default.display = values.showIcon;
    }
    if (values.iconPosition !== undefined && values.iconPosition !== null) {
      styles.default.flexDirection = values.iconPosition;
    }
    if (values.iconColor !== undefined && values.iconColor !== null) {
      styles.default.color = values.iconColor;
    }
    if (values.iconSize !== undefined && values.iconSize !== null) {
      styles.default.fontSize = `${values.iconSize}rem`;
    }
    if (values.iconTypeClosed !== undefined && values.iconTypeClosed !== null) {
      styles.default.content = values.iconTypeClosed;
    }
    if (values.iconTypeOpen !== undefined && values.iconTypeOpen !== null) {
      styles.default.content = values.iconTypeOpen;
    }
    if (values.iconRotation !== undefined && values.iconRotation !== null) {
      styles.default.transform = `${values.iconRotation}deg`;
    }
    if (values.iconRotationActive !== undefined && values.iconRotationActive !== null) {
      styles.default.transform = `${values.iconRotationActive}deg`;
    }
    if (values.tabButtonColor !== undefined && values.tabButtonColor !== null) {
      styles.default.color = values.tabButtonColor;
    }
    if (values.tabButtonBackgroundColor !== undefined && values.tabButtonBackgroundColor !== null) {
      styles.default.backgroundColor = values.tabButtonBackgroundColor;
    }
    if (values.tabButtonHoverColor !== undefined && values.tabButtonHoverColor !== null) {
      styles.default.color = values.tabButtonHoverColor;
    }
    if (values.tabButtonHoverBackgroundColor !== undefined && values.tabButtonHoverBackgroundColor !== null) {
      styles.default.backgroundColor = values.tabButtonHoverBackgroundColor;
    }
    if (values.tabButtonActiveColor !== undefined && values.tabButtonActiveColor !== null) {
      styles.default.color = values.tabButtonActiveColor;
    }
    if (values.tabButtonActiveBackgroundColor !== undefined && values.tabButtonActiveBackgroundColor !== null) {
      styles.default.backgroundColor = values.tabButtonActiveBackgroundColor;
    }
    if (values.enableFocusBorder !== undefined && values.enableFocusBorder !== null) {
      styles.default.border = values.enableFocusBorder;
    }
    if (values.tabButtonActiveContentBorderWidth !== undefined && values.tabButtonActiveContentBorderWidth !== null) {
      const resolvedProp = resolveCssProperty('tabButtonActiveContentBorderWidth', 'tabs', values);
      if (resolvedProp) {
        styles.default[toCamelCase(resolvedProp)] = `${values.tabButtonActiveContentBorderWidth}px`;
      }
    }
    if (values.tabButtonActiveContentBorderStyle !== undefined && values.tabButtonActiveContentBorderStyle !== null) {
      const resolvedProp = resolveCssProperty('tabButtonActiveContentBorderStyle', 'tabs', values);
      if (resolvedProp) {
        styles.default[toCamelCase(resolvedProp)] = values.tabButtonActiveContentBorderStyle;
      }
    }
    if (values.tabButtonActiveFontWeight !== undefined && values.tabButtonActiveFontWeight !== null) {
      styles.default.fontWeight = values.tabButtonActiveFontWeight;
    }
    if (values.tabButtonBorderColor !== undefined && values.tabButtonBorderColor !== null) {
      styles.default.borderColor = values.tabButtonBorderColor;
    }
    if (values.tabButtonActiveBorderColor !== undefined && values.tabButtonActiveBorderColor !== null) {
      styles.default.borderColor = values.tabButtonActiveBorderColor;
    }
    if (values.tabButtonActiveContentBorderColor !== undefined && values.tabButtonActiveContentBorderColor !== null) {
      const resolvedProp = resolveCssProperty('tabButtonActiveContentBorderColor', 'tabs', values);
      if (resolvedProp) {
        styles.default[toCamelCase(resolvedProp)] = values.tabButtonActiveContentBorderColor;
      }
    }
    if (values.tabButtonBorderWidth !== undefined && values.tabButtonBorderWidth !== null) {
      styles.default.borderWidth = `${values.tabButtonBorderWidth}px`;
    }
    if (values.tabButtonBorderStyle !== undefined && values.tabButtonBorderStyle !== null) {
      styles.default.borderStyle = values.tabButtonBorderStyle;
    }
    if (values.tabButtonBorderRadius) {
      const formatted = formatBorderRadius(values.tabButtonBorderRadius);
      if (formatted) styles.default.borderRadius = formatted;
    }
    if (values.tabButtonShadow !== undefined && values.tabButtonShadow !== null) {
      styles.default.boxShadow = values.tabButtonShadow;
    }
    if (values.tabButtonShadowHover !== undefined && values.tabButtonShadowHover !== null) {
      styles.default.boxShadow = values.tabButtonShadowHover;
    }
    if (values.tabButtonFontSize !== undefined && values.tabButtonFontSize !== null) {
      styles.default.fontSize = `${values.tabButtonFontSize}rem`;
    }
    if (values.tabButtonFontWeight !== undefined && values.tabButtonFontWeight !== null) {
      styles.default.fontWeight = values.tabButtonFontWeight;
    }
    if (values.tabButtonFontStyle !== undefined && values.tabButtonFontStyle !== null) {
      styles.default.fontStyle = values.tabButtonFontStyle;
    }
    if (values.tabButtonTextTransform !== undefined && values.tabButtonTextTransform !== null) {
      styles.default.textTransform = values.tabButtonTextTransform;
    }
    if (values.tabButtonTextDecoration !== undefined && values.tabButtonTextDecoration !== null) {
      styles.default.textDecoration = values.tabButtonTextDecoration;
    }
    if (values.tabButtonTextAlign !== undefined && values.tabButtonTextAlign !== null) {
      styles.default.textAlign = values.tabButtonTextAlign;
    }
    if (values.tabButtonPadding !== undefined && values.tabButtonPadding !== null) {
      const formatted = formatPaddingRectangle(values.tabButtonPadding);
      if (formatted) styles.default.padding = formatted;
    }
    if (values.tabListBackgroundColor !== undefined && values.tabListBackgroundColor !== null) {
      styles.default.backgroundColor = values.tabListBackgroundColor;
    }
    if (values.tabsRowBorderColor !== undefined && values.tabsRowBorderColor !== null) {
      styles.default.borderColor = values.tabsRowBorderColor;
    }
    if (values.tabsRowBorderWidth !== undefined && values.tabsRowBorderWidth !== null) {
      styles.default.borderWidth = `${values.tabsRowBorderWidth}px`;
    }
    if (values.tabsRowBorderStyle !== undefined && values.tabsRowBorderStyle !== null) {
      styles.default.borderStyle = values.tabsRowBorderStyle;
    }
    if (values.tabListAlignment !== undefined && values.tabListAlignment !== null) {
      styles.default.justifyContent = values.tabListAlignment;
    }
    if (values.tabsRowSpacing !== undefined && values.tabsRowSpacing !== null) {
      const resolvedProp = resolveCssProperty('tabsRowSpacing', 'tabs', values);
      if (resolvedProp) {
        styles.default[toCamelCase(resolvedProp)] = `${values.tabsRowSpacing}rem`;
      }
    }
    if (values.tabsButtonGap !== undefined && values.tabsButtonGap !== null) {
      styles.default.gap = `${values.tabsButtonGap}rem`;
    }
    if (values.panelBackgroundColor !== undefined && values.panelBackgroundColor !== null) {
      styles.default.backgroundColor = values.panelBackgroundColor;
    }
    if (values.panelBorderColor !== undefined && values.panelBorderColor !== null) {
      styles.default.borderColor = values.panelBorderColor;
    }
    if (values.panelBorderWidth !== undefined && values.panelBorderWidth !== null) {
      styles.default.borderWidth = `${values.panelBorderWidth}px`;
    }
    if (values.panelBorderStyle !== undefined && values.panelBorderStyle !== null) {
      styles.default.borderStyle = values.panelBorderStyle;
    }
    if (values.panelBorderRadius) {
      const formatted = formatBorderRadius(values.panelBorderRadius);
      if (formatted) styles.default.borderRadius = formatted;
    }
    if (values.borderColor !== undefined && values.borderColor !== null) {
      styles.default.borderColor = values.borderColor;
    }
    if (values.borderWidth !== undefined && values.borderWidth !== null) {
      styles.default.borderWidth = `${values.borderWidth}px`;
    }
    if (values.borderStyle !== undefined && values.borderStyle !== null) {
      styles.default.borderStyle = values.borderStyle;
    }
    if (values.borderRadius) {
      const formatted = formatBorderRadius(values.borderRadius);
      if (formatted) styles.default.borderRadius = formatted;
    }
    if (values.shadow !== undefined && values.shadow !== null) {
      styles.default.boxShadow = values.shadow;
    }
    if (values.shadowHover !== undefined && values.shadowHover !== null) {
      styles.default.boxShadow = values.shadowHover;
    }
    if (values.enableTabsListContentBorder !== undefined && values.enableTabsListContentBorder !== null) {
      styles.default.border = values.enableTabsListContentBorder;
    }
    if (values.tabsListContentBorderColor !== undefined && values.tabsListContentBorderColor !== null) {
      const resolvedProp = resolveCssProperty('tabsListContentBorderColor', 'tabs', values);
      if (resolvedProp) {
        styles.default[toCamelCase(resolvedProp)] = values.tabsListContentBorderColor;
      }
    }
    if (values.tabsListContentBorderWidth !== undefined && values.tabsListContentBorderWidth !== null) {
      const resolvedProp = resolveCssProperty('tabsListContentBorderWidth', 'tabs', values);
      if (resolvedProp) {
        styles.default[toCamelCase(resolvedProp)] = `${values.tabsListContentBorderWidth}px`;
      }
    }
    if (values.tabsListContentBorderStyle !== undefined && values.tabsListContentBorderStyle !== null) {
      const resolvedProp = resolveCssProperty('tabsListContentBorderStyle', 'tabs', values);
      if (resolvedProp) {
        styles.default[toCamelCase(resolvedProp)] = values.tabsListContentBorderStyle;
      }
    }

  return styles;
}

/**
 * Build CSS variable object for frontend customizations
 * Maps customizations to CSS variables for inline style output
 * @param {Object} customizations - Delta values from expected (theme + defaults)
 * @returns {Object} CSS variable object for inline styles
 */
export function buildFrontendStyles(customizations) {
  const styles = {};

  if (!customizations || typeof customizations !== 'object') {
    return styles;
  }

  if (customizations.showIcon !== undefined && customizations.showIcon !== null) {
    styles['--tabs-show-icon'] = customizations.showIcon;
  }

  if (customizations.iconPosition !== undefined && customizations.iconPosition !== null) {
    styles['--tabs-icon-position'] = customizations.iconPosition;
  }

  if (customizations.iconColor !== undefined && customizations.iconColor !== null) {
    styles['--tabs-icon-color'] = customizations.iconColor;
  }

  if (customizations.iconSize !== undefined && customizations.iconSize !== null) {
    styles['--tabs-icon-size'] = `${customizations.iconSize}rem`;
  }

  if (customizations.iconTypeClosed !== undefined && customizations.iconTypeClosed !== null) {
    styles['--tabs-icon-type-closed'] = customizations.iconTypeClosed;
  }

  if (customizations.iconTypeOpen !== undefined && customizations.iconTypeOpen !== null) {
    styles['--tabs-icon-type-open'] = customizations.iconTypeOpen;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--tabs-icon-rotation-base'] = `${customizations.iconRotation}deg`;
  }

  if (customizations.iconRotationActive !== undefined && customizations.iconRotationActive !== null) {
    styles['--tabs-icon-rotation-active'] = `${customizations.iconRotationActive}deg`;
  }

  if (customizations.tabButtonColor !== undefined && customizations.tabButtonColor !== null) {
    styles['--tabs-button-color'] = customizations.tabButtonColor;
  }

  if (customizations.tabButtonBackgroundColor !== undefined && customizations.tabButtonBackgroundColor !== null) {
    styles['--tabs-button-bg'] = customizations.tabButtonBackgroundColor;
  }

  if (customizations.tabButtonHoverColor !== undefined && customizations.tabButtonHoverColor !== null) {
    styles['--tabs-button-hover-color'] = customizations.tabButtonHoverColor;
  }

  if (customizations.tabButtonHoverBackgroundColor !== undefined && customizations.tabButtonHoverBackgroundColor !== null) {
    styles['--tabs-button-hover-bg'] = customizations.tabButtonHoverBackgroundColor;
  }

  if (customizations.tabButtonActiveColor !== undefined && customizations.tabButtonActiveColor !== null) {
    styles['--tabs-button-active-color'] = customizations.tabButtonActiveColor;
  }

  if (customizations.tabButtonActiveBackgroundColor !== undefined && customizations.tabButtonActiveBackgroundColor !== null) {
    styles['--tabs-button-active-bg'] = customizations.tabButtonActiveBackgroundColor;
  }

  if (customizations.enableFocusBorder !== undefined && customizations.enableFocusBorder !== null) {
    styles['--tabs-enable-focus-border'] = customizations.enableFocusBorder;
  }

  if (customizations.tabButtonActiveContentBorderWidth !== undefined && customizations.tabButtonActiveContentBorderWidth !== null) {
    styles['--tabs-button-active-content-border-width'] = `${customizations.tabButtonActiveContentBorderWidth}px`;
  }

  if (customizations.tabButtonActiveContentBorderStyle !== undefined && customizations.tabButtonActiveContentBorderStyle !== null) {
    styles['--tabs-button-active-content-border-style'] = customizations.tabButtonActiveContentBorderStyle;
  }

  if (customizations.tabButtonActiveFontWeight !== undefined && customizations.tabButtonActiveFontWeight !== null) {
    styles['--tabs-button-active-font-weight'] = customizations.tabButtonActiveFontWeight;
  }

  if (customizations.tabButtonBorderColor !== undefined && customizations.tabButtonBorderColor !== null) {
    styles['--tabs-button-border-color'] = customizations.tabButtonBorderColor;
  }

  if (customizations.tabButtonActiveBorderColor !== undefined && customizations.tabButtonActiveBorderColor !== null) {
    styles['--tabs-button-active-border-color'] = customizations.tabButtonActiveBorderColor;
  }

  if (customizations.tabButtonActiveContentBorderColor !== undefined && customizations.tabButtonActiveContentBorderColor !== null) {
    styles['--tabs-button-active-content-border-color'] = customizations.tabButtonActiveContentBorderColor;
  }

  if (customizations.tabButtonBorderWidth !== undefined && customizations.tabButtonBorderWidth !== null) {
    styles['--tabs-button-border-width'] = `${customizations.tabButtonBorderWidth}px`;
  }

  if (customizations.tabButtonBorderStyle !== undefined && customizations.tabButtonBorderStyle !== null) {
    styles['--tabs-button-border-style'] = customizations.tabButtonBorderStyle;
  }

  if (customizations.tabButtonBorderRadius) {
    const formatted = formatBorderRadius(customizations.tabButtonBorderRadius);
    if (formatted) styles['--tabs-button-border-radius'] = formatted;
  }

  if (customizations.tabButtonShadow !== undefined && customizations.tabButtonShadow !== null) {
    styles['--tabs-button-border-shadow'] = customizations.tabButtonShadow;
  }

  if (customizations.tabButtonShadowHover !== undefined && customizations.tabButtonShadowHover !== null) {
    styles['--tabs-button-border-shadow-hover'] = customizations.tabButtonShadowHover;
  }

  if (customizations.tabButtonFontSize !== undefined && customizations.tabButtonFontSize !== null) {
    styles['--tabs-button-font-size'] = `${customizations.tabButtonFontSize}rem`;
  }

  if (customizations.tabButtonFontWeight !== undefined && customizations.tabButtonFontWeight !== null) {
    styles['--tabs-button-font-weight'] = customizations.tabButtonFontWeight;
  }

  if (customizations.tabButtonFontStyle !== undefined && customizations.tabButtonFontStyle !== null) {
    styles['--tabs-button-font-style'] = customizations.tabButtonFontStyle;
  }

  if (customizations.tabButtonTextTransform !== undefined && customizations.tabButtonTextTransform !== null) {
    styles['--tabs-button-text-transform'] = customizations.tabButtonTextTransform;
  }

  if (customizations.tabButtonTextDecoration !== undefined && customizations.tabButtonTextDecoration !== null) {
    styles['--tabs-button-text-decoration'] = customizations.tabButtonTextDecoration;
  }

  if (customizations.tabButtonTextAlign !== undefined && customizations.tabButtonTextAlign !== null) {
    styles['--tabs-button-text-align'] = customizations.tabButtonTextAlign;
  }

  if (customizations.tabButtonPadding !== undefined && customizations.tabButtonPadding !== null) {
    const formatted = formatPaddingRectangle(customizations.tabButtonPadding);
    if (formatted) styles['--tabs-button-padding'] = formatted;
  }

  if (customizations.tabListBackgroundColor !== undefined && customizations.tabListBackgroundColor !== null) {
    styles['--tabs-list-bg'] = customizations.tabListBackgroundColor;
  }

  if (customizations.tabsRowBorderColor !== undefined && customizations.tabsRowBorderColor !== null) {
    styles['--tabs-row-border-color'] = customizations.tabsRowBorderColor;
  }

  if (customizations.tabsRowBorderWidth !== undefined && customizations.tabsRowBorderWidth !== null) {
    styles['--tabs-row-border-width'] = `${customizations.tabsRowBorderWidth}px`;
  }

  if (customizations.tabsRowBorderStyle !== undefined && customizations.tabsRowBorderStyle !== null) {
    styles['--tabs-row-border-style'] = customizations.tabsRowBorderStyle;
  }

  if (customizations.tabListAlignment !== undefined && customizations.tabListAlignment !== null) {
    styles['--tabs-list-align'] = customizations.tabListAlignment;
  }

  if (customizations.tabsRowSpacing !== undefined && customizations.tabsRowSpacing !== null) {
    styles['--tabs-row-spacing'] = `${customizations.tabsRowSpacing}rem`;
  }

  if (customizations.tabsButtonGap !== undefined && customizations.tabsButtonGap !== null) {
    styles['--tabs-button-gap'] = `${customizations.tabsButtonGap}rem`;
  }

  if (customizations.panelBackgroundColor !== undefined && customizations.panelBackgroundColor !== null) {
    styles['--tabs-panel-bg'] = customizations.panelBackgroundColor;
  }

  if (customizations.panelBorderColor !== undefined && customizations.panelBorderColor !== null) {
    styles['--tabs-panel-border-color'] = customizations.panelBorderColor;
  }

  if (customizations.panelBorderWidth !== undefined && customizations.panelBorderWidth !== null) {
    styles['--tabs-panel-border-width'] = `${customizations.panelBorderWidth}px`;
  }

  if (customizations.panelBorderStyle !== undefined && customizations.panelBorderStyle !== null) {
    styles['--tabs-panel-border-style'] = customizations.panelBorderStyle;
  }

  if (customizations.panelBorderRadius) {
    const formatted = formatBorderRadius(customizations.panelBorderRadius);
    if (formatted) styles['--tabs-panel-border-radius'] = formatted;
  }

  if (customizations.borderColor !== undefined && customizations.borderColor !== null) {
    styles['--tabs-border-color'] = customizations.borderColor;
  }

  if (customizations.borderWidth !== undefined && customizations.borderWidth !== null) {
    styles['--tabs-border-width'] = `${customizations.borderWidth}px`;
  }

  if (customizations.borderStyle !== undefined && customizations.borderStyle !== null) {
    styles['--tabs-border-style'] = customizations.borderStyle;
  }

  if (customizations.borderRadius) {
    const formatted = formatBorderRadius(customizations.borderRadius);
    if (formatted) styles['--tabs-border-radius'] = formatted;
  }

  if (customizations.shadow !== undefined && customizations.shadow !== null) {
    styles['--tabs-border-shadow'] = customizations.shadow;
  }

  if (customizations.shadowHover !== undefined && customizations.shadowHover !== null) {
    styles['--tabs-border-shadow-hover'] = customizations.shadowHover;
  }

  if (customizations.enableTabsListContentBorder !== undefined && customizations.enableTabsListContentBorder !== null) {
    styles['--tabs-enable-list-divider-border'] = customizations.enableTabsListContentBorder;
  }

  if (customizations.tabsListContentBorderColor !== undefined && customizations.tabsListContentBorderColor !== null) {
    styles['--tabs-list-divider-border-color'] = customizations.tabsListContentBorderColor;
  }

  if (customizations.tabsListContentBorderWidth !== undefined && customizations.tabsListContentBorderWidth !== null) {
    styles['--tabs-list-divider-border-width'] = `${customizations.tabsListContentBorderWidth}px`;
  }

  if (customizations.tabsListContentBorderStyle !== undefined && customizations.tabsListContentBorderStyle !== null) {
    styles['--tabs-list-divider-border-style'] = customizations.tabsListContentBorderStyle;
  }

  return styles;
}
