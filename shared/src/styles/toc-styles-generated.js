/**
 * Style Builder for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-12-18T23:36:50.348Z
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
 * Format padding object to CSS string
 * @param {Object} padding - Padding object with top, right, bottom, left
 * @returns {string|null} Formatted padding or null
 */
export function formatPadding(padding) {
  if (!padding || typeof padding !== 'object') return null;
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  return `${top}px ${right}px ${bottom}px ${left}px`;
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
    if (values.wrapperBackgroundColor !== undefined && values.wrapperBackgroundColor !== null) {
      styles.default.backgroundColor = values.wrapperBackgroundColor;
    }
    if (values.blockBorderColor !== undefined && values.blockBorderColor !== null) {
      styles.default.borderColor = values.blockBorderColor;
    }
    if (values.titleColor !== undefined && values.titleColor !== null) {
      styles.default.color = values.titleColor;
    }
    if (values.titleBackgroundColor !== undefined && values.titleBackgroundColor !== null) {
      styles.default.backgroundColor = values.titleBackgroundColor;
    }
    if (values.linkColor !== undefined && values.linkColor !== null) {
      styles.default.color = values.linkColor;
    }
    if (values.linkHoverColor !== undefined && values.linkHoverColor !== null) {
      styles.default.color = values.linkHoverColor;
    }
    if (values.linkActiveColor !== undefined && values.linkActiveColor !== null) {
      styles.default.color = values.linkActiveColor;
    }
    if (values.linkVisitedColor !== undefined && values.linkVisitedColor !== null) {
      styles.default.color = values.linkVisitedColor;
    }
    if (values.numberingColor !== undefined && values.numberingColor !== null) {
      styles.default.color = values.numberingColor;
    }
    if (values.level1Color !== undefined && values.level1Color !== null) {
      styles.default.color = values.level1Color;
    }
    if (values.level2Color !== undefined && values.level2Color !== null) {
      styles.default.color = values.level2Color;
    }
    if (values.level3PlusColor !== undefined && values.level3PlusColor !== null) {
      styles.default.color = values.level3PlusColor;
    }
    if (values.collapseIconColor !== undefined && values.collapseIconColor !== null) {
      styles.default.color = values.collapseIconColor;
    }
    if (values.titleFontSize !== undefined && values.titleFontSize !== null) {
      styles.default.fontSize = `${values.titleFontSize}px`;
    }
    if (values.titleFontWeight !== undefined && values.titleFontWeight !== null) {
      styles.default.fontWeight = values.titleFontWeight;
    }
    if (values.titleTextTransform !== undefined && values.titleTextTransform !== null) {
      styles.default.textTransform = values.titleTextTransform;
    }
    if (values.titleAlignment !== undefined && values.titleAlignment !== null) {
      styles.default.textAlign = values.titleAlignment;
    }
    if (values.titlePadding) {
      const formatted = formatPadding(values.titlePadding);
      if (formatted) styles.default.padding = formatted;
    }
    if (values.level1FontSize !== undefined && values.level1FontSize !== null) {
      styles.default.fontSize = `${values.level1FontSize}px`;
    }
    if (values.level1FontWeight !== undefined && values.level1FontWeight !== null) {
      styles.default.fontWeight = values.level1FontWeight;
    }
    if (values.level1FontStyle !== undefined && values.level1FontStyle !== null) {
      styles.default.fontStyle = values.level1FontStyle;
    }
    if (values.level1TextTransform !== undefined && values.level1TextTransform !== null) {
      styles.default.textTransform = values.level1TextTransform;
    }
    if (values.level1TextDecoration !== undefined && values.level1TextDecoration !== null) {
      styles.default.textDecoration = values.level1TextDecoration;
    }
    if (values.level2FontSize !== undefined && values.level2FontSize !== null) {
      styles.default.fontSize = `${values.level2FontSize}px`;
    }
    if (values.level2FontWeight !== undefined && values.level2FontWeight !== null) {
      styles.default.fontWeight = values.level2FontWeight;
    }
    if (values.level2FontStyle !== undefined && values.level2FontStyle !== null) {
      styles.default.fontStyle = values.level2FontStyle;
    }
    if (values.level2TextTransform !== undefined && values.level2TextTransform !== null) {
      styles.default.textTransform = values.level2TextTransform;
    }
    if (values.level2TextDecoration !== undefined && values.level2TextDecoration !== null) {
      styles.default.textDecoration = values.level2TextDecoration;
    }
    if (values.level3PlusFontSize !== undefined && values.level3PlusFontSize !== null) {
      styles.default.fontSize = `${values.level3PlusFontSize}px`;
    }
    if (values.level3PlusFontWeight !== undefined && values.level3PlusFontWeight !== null) {
      styles.default.fontWeight = values.level3PlusFontWeight;
    }
    if (values.level3PlusFontStyle !== undefined && values.level3PlusFontStyle !== null) {
      styles.default.fontStyle = values.level3PlusFontStyle;
    }
    if (values.level3PlusTextTransform !== undefined && values.level3PlusTextTransform !== null) {
      styles.default.textTransform = values.level3PlusTextTransform;
    }
    if (values.level3PlusTextDecoration !== undefined && values.level3PlusTextDecoration !== null) {
      styles.default.textDecoration = values.level3PlusTextDecoration;
    }
    if (values.blockBorderWidth !== undefined && values.blockBorderWidth !== null) {
      styles.default.borderWidth = `${values.blockBorderWidth}px`;
    }
    if (values.blockBorderStyle !== undefined && values.blockBorderStyle !== null) {
      styles.default.borderStyle = values.blockBorderStyle;
    }
    if (values.blockBorderRadius) {
      const formatted = formatBorderRadius(values.blockBorderRadius);
      if (formatted) styles.default.borderRadius = formatted;
    }
    if (values.blockShadow !== undefined && values.blockShadow !== null) {
      styles.default.boxShadow = values.blockShadow;
    }
    if (values.blockShadowHover !== undefined && values.blockShadowHover !== null) {
      styles.default.boxShadow = values.blockShadowHover;
    }
    if (values.wrapperPadding !== undefined && values.wrapperPadding !== null) {
      styles.default.padding = `${values.wrapperPadding}px`;
    }
    if (values.listPaddingLeft !== undefined && values.listPaddingLeft !== null) {
      styles.default.paddingLeft = `${values.listPaddingLeft}px`;
    }
    if (values.itemSpacing !== undefined && values.itemSpacing !== null) {
      styles.default.marginBottom = `${values.itemSpacing}px`;
    }
    if (values.levelIndent !== undefined && values.levelIndent !== null) {
      styles.default.marginLeft = `${values.levelIndent}px`;
    }
    if (values.positionTop !== undefined && values.positionTop !== null) {
      styles.default.top = `${values.positionTop}px`;
    }
    if (values.zIndex !== undefined && values.zIndex !== null) {
      styles.default.zIndex = `${values.zIndex}`;
    }
    if (values.collapseIconSize !== undefined && values.collapseIconSize !== null) {
      styles.default.fontSize = `${values.collapseIconSize}px`;
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

  if (customizations.wrapperBackgroundColor !== undefined && customizations.wrapperBackgroundColor !== null) {
    styles['--toc-wrapper-background-color'] = customizations.wrapperBackgroundColor;
  }

  if (customizations.blockBorderColor !== undefined && customizations.blockBorderColor !== null) {
    styles['--toc-border-color'] = customizations.blockBorderColor;
  }

  if (customizations.titleColor !== undefined && customizations.titleColor !== null) {
    styles['--toc-title-color'] = customizations.titleColor;
  }

  if (customizations.titleBackgroundColor !== undefined && customizations.titleBackgroundColor !== null) {
    styles['--toc-title-background-color'] = customizations.titleBackgroundColor;
  }

  if (customizations.linkColor !== undefined && customizations.linkColor !== null) {
    styles['--toc-link-color'] = customizations.linkColor;
  }

  if (customizations.linkHoverColor !== undefined && customizations.linkHoverColor !== null) {
    styles['--toc-link-hover-color'] = customizations.linkHoverColor;
  }

  if (customizations.linkActiveColor !== undefined && customizations.linkActiveColor !== null) {
    styles['--toc-link-active-color'] = customizations.linkActiveColor;
  }

  if (customizations.linkVisitedColor !== undefined && customizations.linkVisitedColor !== null) {
    styles['--toc-link-visited-color'] = customizations.linkVisitedColor;
  }

  if (customizations.numberingColor !== undefined && customizations.numberingColor !== null) {
    styles['--toc-numbering-color'] = customizations.numberingColor;
  }

  if (customizations.level1Color !== undefined && customizations.level1Color !== null) {
    styles['--toc-level1-color'] = customizations.level1Color;
  }

  if (customizations.level2Color !== undefined && customizations.level2Color !== null) {
    styles['--toc-level2-color'] = customizations.level2Color;
  }

  if (customizations.level3PlusColor !== undefined && customizations.level3PlusColor !== null) {
    styles['--toc-level3-plus-color'] = customizations.level3PlusColor;
  }

  if (customizations.collapseIconColor !== undefined && customizations.collapseIconColor !== null) {
    styles['--toc-collapse-icon-color'] = customizations.collapseIconColor;
  }

  if (customizations.titleFontSize !== undefined && customizations.titleFontSize !== null) {
    styles['--toc-title-font-size'] = `${customizations.titleFontSize}px`;
  }

  if (customizations.titleFontWeight !== undefined && customizations.titleFontWeight !== null) {
    styles['--toc-title-font-weight'] = customizations.titleFontWeight;
  }

  if (customizations.titleTextTransform !== undefined && customizations.titleTextTransform !== null) {
    styles['--toc-title-text-transform'] = customizations.titleTextTransform;
  }

  if (customizations.titleAlignment !== undefined && customizations.titleAlignment !== null) {
    styles['--toc-title-alignment'] = customizations.titleAlignment;
  }

  if (customizations.titlePadding) {
    const formatted = formatPadding(customizations.titlePadding);
    if (formatted) styles['--toc-title-padding'] = formatted;
  }

  if (customizations.level1FontSize !== undefined && customizations.level1FontSize !== null) {
    styles['--toc-level1-font-size'] = `${customizations.level1FontSize}px`;
  }

  if (customizations.level1FontWeight !== undefined && customizations.level1FontWeight !== null) {
    styles['--toc-level1-font-weight'] = customizations.level1FontWeight;
  }

  if (customizations.level1FontStyle !== undefined && customizations.level1FontStyle !== null) {
    styles['--toc-level1-font-style'] = customizations.level1FontStyle;
  }

  if (customizations.level1TextTransform !== undefined && customizations.level1TextTransform !== null) {
    styles['--toc-level1-text-transform'] = customizations.level1TextTransform;
  }

  if (customizations.level1TextDecoration !== undefined && customizations.level1TextDecoration !== null) {
    styles['--toc-level1-text-decoration'] = customizations.level1TextDecoration;
  }

  if (customizations.level2FontSize !== undefined && customizations.level2FontSize !== null) {
    styles['--toc-level2-font-size'] = `${customizations.level2FontSize}px`;
  }

  if (customizations.level2FontWeight !== undefined && customizations.level2FontWeight !== null) {
    styles['--toc-level2-font-weight'] = customizations.level2FontWeight;
  }

  if (customizations.level2FontStyle !== undefined && customizations.level2FontStyle !== null) {
    styles['--toc-level2-font-style'] = customizations.level2FontStyle;
  }

  if (customizations.level2TextTransform !== undefined && customizations.level2TextTransform !== null) {
    styles['--toc-level2-text-transform'] = customizations.level2TextTransform;
  }

  if (customizations.level2TextDecoration !== undefined && customizations.level2TextDecoration !== null) {
    styles['--toc-level2-text-decoration'] = customizations.level2TextDecoration;
  }

  if (customizations.level3PlusFontSize !== undefined && customizations.level3PlusFontSize !== null) {
    styles['--toc-level3-plus-font-size'] = `${customizations.level3PlusFontSize}px`;
  }

  if (customizations.level3PlusFontWeight !== undefined && customizations.level3PlusFontWeight !== null) {
    styles['--toc-level3-plus-font-weight'] = customizations.level3PlusFontWeight;
  }

  if (customizations.level3PlusFontStyle !== undefined && customizations.level3PlusFontStyle !== null) {
    styles['--toc-level3-plus-font-style'] = customizations.level3PlusFontStyle;
  }

  if (customizations.level3PlusTextTransform !== undefined && customizations.level3PlusTextTransform !== null) {
    styles['--toc-level3-plus-text-transform'] = customizations.level3PlusTextTransform;
  }

  if (customizations.level3PlusTextDecoration !== undefined && customizations.level3PlusTextDecoration !== null) {
    styles['--toc-level3-plus-text-decoration'] = customizations.level3PlusTextDecoration;
  }

  if (customizations.blockBorderWidth !== undefined && customizations.blockBorderWidth !== null) {
    styles['--toc-border-width'] = `${customizations.blockBorderWidth}px`;
  }

  if (customizations.blockBorderStyle !== undefined && customizations.blockBorderStyle !== null) {
    styles['--toc-border-style'] = customizations.blockBorderStyle;
  }

  if (customizations.blockBorderRadius) {
    const formatted = formatBorderRadius(customizations.blockBorderRadius);
    if (formatted) styles['--toc-border-radius'] = formatted;
  }

  if (customizations.blockShadow !== undefined && customizations.blockShadow !== null) {
    styles['--toc-border-shadow'] = customizations.blockShadow;
  }

  if (customizations.blockShadowHover !== undefined && customizations.blockShadowHover !== null) {
    styles['--toc-border-shadow-hover'] = customizations.blockShadowHover;
  }

  if (customizations.wrapperPadding !== undefined && customizations.wrapperPadding !== null) {
    styles['--toc-wrapper-padding'] = `${customizations.wrapperPadding}px`;
  }

  if (customizations.listPaddingLeft !== undefined && customizations.listPaddingLeft !== null) {
    styles['--toc-list-padding-left'] = `${customizations.listPaddingLeft}px`;
  }

  if (customizations.itemSpacing !== undefined && customizations.itemSpacing !== null) {
    styles['--toc-item-spacing'] = `${customizations.itemSpacing}px`;
  }

  if (customizations.levelIndent !== undefined && customizations.levelIndent !== null) {
    styles['--toc-level-indent'] = `${customizations.levelIndent}px`;
  }

  if (customizations.positionTop !== undefined && customizations.positionTop !== null) {
    styles['--toc-position-top'] = `${customizations.positionTop}px`;
  }

  if (customizations.zIndex !== undefined && customizations.zIndex !== null) {
    styles['--toc-z-index'] = `${customizations.zIndex}`;
  }

  if (customizations.collapseIconSize !== undefined && customizations.collapseIconSize !== null) {
    styles['--toc-collapse-icon-size'] = `${customizations.collapseIconSize}px`;
  }

  return styles;
}
