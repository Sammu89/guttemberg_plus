/**
 * Style Builder for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-01T18:09:25.729Z
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
 * Build inline styles for editor based on effective values
 * @param {Object} values - Effective values (defaults + theme + customizations)
 * @returns {Object} Style objects keyed by selector type
 */
export function buildEditorStyles(values) {
  const styles = {};

  // Styles for default
  styles.default = {};
    if (values.iconColor !== undefined && values.iconColor !== null) {
      styles.default.color = values.iconColor;
    }

  // Styles for .wp-block-guttemberg-plus-tabs
  styles.container = {};
    if (values.tabButtonColor !== undefined && values.tabButtonColor !== null) {
      styles.container.color = values.tabButtonColor;
    }
    if (values.tabButtonBackgroundColor !== undefined && values.tabButtonBackgroundColor !== null) {
      styles.container.backgroundColor = values.tabButtonBackgroundColor;
    }
    if (values.tabButtonHoverColor !== undefined && values.tabButtonHoverColor !== null) {
      styles.container.color = values.tabButtonHoverColor;
    }
    if (values.tabButtonHoverBackgroundColor !== undefined && values.tabButtonHoverBackgroundColor !== null) {
      styles.container.backgroundColor = values.tabButtonHoverBackgroundColor;
    }
    if (values.tabButtonActiveColor !== undefined && values.tabButtonActiveColor !== null) {
      styles.container.color = values.tabButtonActiveColor;
    }
    if (values.tabButtonActiveBackgroundColor !== undefined && values.tabButtonActiveBackgroundColor !== null) {
      styles.container.backgroundColor = values.tabButtonActiveBackgroundColor;
    }
    if (values.tabButtonActiveBorderColor !== undefined && values.tabButtonActiveBorderColor !== null) {
      styles.container.color = values.tabButtonActiveBorderColor;
    }
    if (values.tabButtonActiveBorderBottomColor !== undefined && values.tabButtonActiveBorderBottomColor !== null) {
      styles.container.color = values.tabButtonActiveBorderBottomColor;
    }
    if (values.buttonBorderColor !== undefined && values.buttonBorderColor !== null) {
      styles.container.color = values.buttonBorderColor;
    }
    if (values.buttonBorderWidth !== undefined && values.buttonBorderWidth !== null) {
      styles.container.borderWidth = `${values.buttonBorderWidth}px`;
    }
    if (values.buttonBorderStyle !== undefined && values.buttonBorderStyle !== null) {
      styles.container.borderStyle = values.buttonBorderStyle;
    }
    if (values.buttonBorderRadius) {
      const formatted = formatBorderRadius(values.buttonBorderRadius);
      if (formatted) styles.container.borderRadius = formatted;
    }
    if (values.buttonShadow !== undefined && values.buttonShadow !== null) {
      styles.container.boxShadow = values.buttonShadow;
    }
    if (values.buttonShadowHover !== undefined && values.buttonShadowHover !== null) {
      styles.container.boxShadow = values.buttonShadowHover;
    }
    if (values.tabButtonFontSize !== undefined && values.tabButtonFontSize !== null) {
      styles.container.fontSize = `${values.tabButtonFontSize}px`;
    }
    if (values.tabButtonFontWeight !== undefined && values.tabButtonFontWeight !== null) {
      styles.container.fontWeight = values.tabButtonFontWeight;
    }
    if (values.tabButtonFontStyle !== undefined && values.tabButtonFontStyle !== null) {
      styles.container.fontStyle = values.tabButtonFontStyle;
    }
    if (values.tabListBackgroundColor !== undefined && values.tabListBackgroundColor !== null) {
      styles.container.backgroundColor = values.tabListBackgroundColor;
    }
    if (values.panelBackgroundColor !== undefined && values.panelBackgroundColor !== null) {
      styles.container.backgroundColor = values.panelBackgroundColor;
    }
    if (values.panelColor !== undefined && values.panelColor !== null) {
      styles.container.color = values.panelColor;
    }

  // Styles for .wp-block-custom-tabs
  styles.wp_block_custom_tabs = {};
    if (values.focusBorderColor !== undefined && values.focusBorderColor !== null) {
      styles.wp_block_custom_tabs.borderColor = values.focusBorderColor;
    }
    if (values.focusBorderColorActive !== undefined && values.focusBorderColorActive !== null) {
      styles.wp_block_custom_tabs.borderColor = values.focusBorderColorActive;
    }
    if (values.focusBorderWidth !== undefined && values.focusBorderWidth !== null) {
      styles.wp_block_custom_tabs.borderWidth = `${values.focusBorderWidth}px`;
    }
    if (values.focusBorderStyle !== undefined && values.focusBorderStyle !== null) {
      styles.wp_block_custom_tabs.borderStyle = values.focusBorderStyle;
    }
    if (values.borderColor !== undefined && values.borderColor !== null) {
      styles.wp_block_custom_tabs.borderColor = values.borderColor;
    }
    if (values.borderWidth !== undefined && values.borderWidth !== null) {
      styles.wp_block_custom_tabs.borderWidth = `${values.borderWidth}px`;
    }
    if (values.borderStyle !== undefined && values.borderStyle !== null) {
      styles.wp_block_custom_tabs.borderStyle = values.borderStyle;
    }
    if (values.borderRadius) {
      const formatted = formatBorderRadius(values.borderRadius);
      if (formatted) styles.wp_block_custom_tabs.borderRadius = formatted;
    }
    if (values.shadow !== undefined && values.shadow !== null) {
      styles.wp_block_custom_tabs.boxShadow = values.shadow;
    }
    if (values.shadowHover !== undefined && values.shadowHover !== null) {
      styles.wp_block_custom_tabs.boxShadow = values.shadowHover;
    }
    if (values.dividerBorderColor !== undefined && values.dividerBorderColor !== null) {
      styles.wp_block_custom_tabs.borderColor = values.dividerBorderColor;
    }
    if (values.dividerBorderWidth !== undefined && values.dividerBorderWidth !== null) {
      styles.wp_block_custom_tabs.borderWidth = `${values.dividerBorderWidth}px`;
    }
    if (values.dividerBorderStyle !== undefined && values.dividerBorderStyle !== null) {
      styles.wp_block_custom_tabs.borderStyle = values.dividerBorderStyle;
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

  if (customizations.iconColor !== undefined && customizations.iconColor !== null) {
    styles['--tabs-icon-color'] = customizations.iconColor;
  }

  if (customizations.iconSize !== undefined && customizations.iconSize !== null) {
    styles['--tabs-icon-size'] = `${customizations.iconSize}px`;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--tabs-icon-rotation'] = `${customizations.iconRotation}deg`;
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

  if (customizations.tabButtonActiveBorderColor !== undefined && customizations.tabButtonActiveBorderColor !== null) {
    styles['--tabs-button-active-border-color'] = customizations.tabButtonActiveBorderColor;
  }

  if (customizations.tabButtonActiveBorderBottomColor !== undefined && customizations.tabButtonActiveBorderBottomColor !== null) {
    styles['--tabs-button-active-border-bottom-color'] = customizations.tabButtonActiveBorderBottomColor;
  }

  if (customizations.buttonBorderColor !== undefined && customizations.buttonBorderColor !== null) {
    styles['--tabs-button-border-color'] = customizations.buttonBorderColor;
  }

  if (customizations.buttonBorderWidth !== undefined && customizations.buttonBorderWidth !== null) {
    styles['--tabs-button-border-width'] = `${customizations.buttonBorderWidth}px`;
  }

  if (customizations.buttonBorderStyle !== undefined && customizations.buttonBorderStyle !== null) {
    styles['--tabs-button-border-style'] = customizations.buttonBorderStyle;
  }

  if (customizations.buttonBorderRadius) {
    const formatted = formatBorderRadius(customizations.buttonBorderRadius);
    if (formatted) styles['--tabs-button-border-radius'] = formatted;
  }

  if (customizations.buttonShadow !== undefined && customizations.buttonShadow !== null) {
    styles['--tabs-button-border-shadow'] = customizations.buttonShadow;
  }

  if (customizations.buttonShadowHover !== undefined && customizations.buttonShadowHover !== null) {
    styles['--tabs-button-border-shadow-hover'] = customizations.buttonShadowHover;
  }

  if (customizations.focusBorderColor !== undefined && customizations.focusBorderColor !== null) {
    styles['--tabs-focus-border-color'] = customizations.focusBorderColor;
  }

  if (customizations.focusBorderColorActive !== undefined && customizations.focusBorderColorActive !== null) {
    styles['--tabs-focus-border-color-active'] = customizations.focusBorderColorActive;
  }

  if (customizations.focusBorderWidth !== undefined && customizations.focusBorderWidth !== null) {
    styles['--tabs-focus-border-width'] = `${customizations.focusBorderWidth}px`;
  }

  if (customizations.focusBorderStyle !== undefined && customizations.focusBorderStyle !== null) {
    styles['--tabs-focus-border-style'] = customizations.focusBorderStyle;
  }

  if (customizations.tabButtonFontSize !== undefined && customizations.tabButtonFontSize !== null) {
    styles['--tabs-button-font-size'] = `${customizations.tabButtonFontSize}px`;
  }

  if (customizations.tabButtonFontWeight !== undefined && customizations.tabButtonFontWeight !== null) {
    styles['--tab-button-font-weight'] = customizations.tabButtonFontWeight;
  }

  if (customizations.tabButtonFontStyle !== undefined && customizations.tabButtonFontStyle !== null) {
    styles['--tab-button-font-style'] = customizations.tabButtonFontStyle;
  }

  if (customizations.tabButtonTextTransform !== undefined && customizations.tabButtonTextTransform !== null) {
    styles['--tab-button-text-transform'] = customizations.tabButtonTextTransform;
  }

  if (customizations.tabButtonTextDecoration !== undefined && customizations.tabButtonTextDecoration !== null) {
    styles['--tab-button-text-decoration'] = customizations.tabButtonTextDecoration;
  }

  if (customizations.tabButtonTextAlign !== undefined && customizations.tabButtonTextAlign !== null) {
    styles['--tab-button-text-align'] = customizations.tabButtonTextAlign;
  }

  if (customizations.tabListBackgroundColor !== undefined && customizations.tabListBackgroundColor !== null) {
    styles['--tab-list-bg'] = customizations.tabListBackgroundColor;
  }

  if (customizations.tabListAlignment !== undefined && customizations.tabListAlignment !== null) {
    styles['--tab-list-align'] = customizations.tabListAlignment;
  }

  if (customizations.panelBackgroundColor !== undefined && customizations.panelBackgroundColor !== null) {
    styles['--tab-panel-bg'] = customizations.panelBackgroundColor;
  }

  if (customizations.panelColor !== undefined && customizations.panelColor !== null) {
    styles['--tab-panel-color'] = customizations.panelColor;
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

  if (customizations.dividerBorderColor !== undefined && customizations.dividerBorderColor !== null) {
    styles['--tabs-divider-border-color'] = customizations.dividerBorderColor;
  }

  if (customizations.dividerBorderWidth !== undefined && customizations.dividerBorderWidth !== null) {
    styles['--tabs-divider-border-width'] = `${customizations.dividerBorderWidth}px`;
  }

  if (customizations.dividerBorderStyle !== undefined && customizations.dividerBorderStyle !== null) {
    styles['--tabs-divider-border-style'] = customizations.dividerBorderStyle;
  }

  return styles;
}
