/**
 * Style Builder for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-12-22T19:13:33.430Z
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
    if (values.h1Color !== undefined && values.h1Color !== null) {
      styles.default.color = values.h1Color;
    }
    if (values.h1FontSize !== undefined && values.h1FontSize !== null) {
      styles.default.fontSize = `${values.h1FontSize}rem`;
    }
    if (values.h1FontWeight !== undefined && values.h1FontWeight !== null) {
      styles.default.fontWeight = values.h1FontWeight;
    }
    if (values.h1FontStyle !== undefined && values.h1FontStyle !== null) {
      styles.default.fontStyle = values.h1FontStyle;
    }
    if (values.h1TextTransform !== undefined && values.h1TextTransform !== null) {
      styles.default.textTransform = values.h1TextTransform;
    }
    if (values.h1TextDecoration !== undefined && values.h1TextDecoration !== null) {
      styles.default.textDecoration = values.h1TextDecoration;
    }
    if (values.h2Color !== undefined && values.h2Color !== null) {
      styles.default.color = values.h2Color;
    }
    if (values.h2FontSize !== undefined && values.h2FontSize !== null) {
      styles.default.fontSize = `${values.h2FontSize}rem`;
    }
    if (values.h2FontWeight !== undefined && values.h2FontWeight !== null) {
      styles.default.fontWeight = values.h2FontWeight;
    }
    if (values.h2FontStyle !== undefined && values.h2FontStyle !== null) {
      styles.default.fontStyle = values.h2FontStyle;
    }
    if (values.h2TextTransform !== undefined && values.h2TextTransform !== null) {
      styles.default.textTransform = values.h2TextTransform;
    }
    if (values.h2TextDecoration !== undefined && values.h2TextDecoration !== null) {
      styles.default.textDecoration = values.h2TextDecoration;
    }
    if (values.h3Color !== undefined && values.h3Color !== null) {
      styles.default.color = values.h3Color;
    }
    if (values.h3FontSize !== undefined && values.h3FontSize !== null) {
      styles.default.fontSize = `${values.h3FontSize}rem`;
    }
    if (values.h3FontWeight !== undefined && values.h3FontWeight !== null) {
      styles.default.fontWeight = values.h3FontWeight;
    }
    if (values.h3FontStyle !== undefined && values.h3FontStyle !== null) {
      styles.default.fontStyle = values.h3FontStyle;
    }
    if (values.h3TextTransform !== undefined && values.h3TextTransform !== null) {
      styles.default.textTransform = values.h3TextTransform;
    }
    if (values.h3TextDecoration !== undefined && values.h3TextDecoration !== null) {
      styles.default.textDecoration = values.h3TextDecoration;
    }
    if (values.h4Color !== undefined && values.h4Color !== null) {
      styles.default.color = values.h4Color;
    }
    if (values.h4FontSize !== undefined && values.h4FontSize !== null) {
      styles.default.fontSize = `${values.h4FontSize}rem`;
    }
    if (values.h4FontWeight !== undefined && values.h4FontWeight !== null) {
      styles.default.fontWeight = values.h4FontWeight;
    }
    if (values.h4FontStyle !== undefined && values.h4FontStyle !== null) {
      styles.default.fontStyle = values.h4FontStyle;
    }
    if (values.h4TextTransform !== undefined && values.h4TextTransform !== null) {
      styles.default.textTransform = values.h4TextTransform;
    }
    if (values.h4TextDecoration !== undefined && values.h4TextDecoration !== null) {
      styles.default.textDecoration = values.h4TextDecoration;
    }
    if (values.h5Color !== undefined && values.h5Color !== null) {
      styles.default.color = values.h5Color;
    }
    if (values.h5FontSize !== undefined && values.h5FontSize !== null) {
      styles.default.fontSize = `${values.h5FontSize}rem`;
    }
    if (values.h5FontWeight !== undefined && values.h5FontWeight !== null) {
      styles.default.fontWeight = values.h5FontWeight;
    }
    if (values.h5FontStyle !== undefined && values.h5FontStyle !== null) {
      styles.default.fontStyle = values.h5FontStyle;
    }
    if (values.h5TextTransform !== undefined && values.h5TextTransform !== null) {
      styles.default.textTransform = values.h5TextTransform;
    }
    if (values.h5TextDecoration !== undefined && values.h5TextDecoration !== null) {
      styles.default.textDecoration = values.h5TextDecoration;
    }
    if (values.h6Color !== undefined && values.h6Color !== null) {
      styles.default.color = values.h6Color;
    }
    if (values.h6FontSize !== undefined && values.h6FontSize !== null) {
      styles.default.fontSize = `${values.h6FontSize}rem`;
    }
    if (values.h6FontWeight !== undefined && values.h6FontWeight !== null) {
      styles.default.fontWeight = values.h6FontWeight;
    }
    if (values.h6FontStyle !== undefined && values.h6FontStyle !== null) {
      styles.default.fontStyle = values.h6FontStyle;
    }
    if (values.h6TextTransform !== undefined && values.h6TextTransform !== null) {
      styles.default.textTransform = values.h6TextTransform;
    }
    if (values.h6TextDecoration !== undefined && values.h6TextDecoration !== null) {
      styles.default.textDecoration = values.h6TextDecoration;
    }
    if (values.collapseIconColor !== undefined && values.collapseIconColor !== null) {
      styles.default.color = values.collapseIconColor;
    }
    if (values.titleFontSize !== undefined && values.titleFontSize !== null) {
      styles.default.fontSize = `${values.titleFontSize}rem`;
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
      styles.default.padding = `${values.wrapperPadding}rem`;
    }
    if (values.listPaddingLeft !== undefined && values.listPaddingLeft !== null) {
      styles.default.paddingLeft = `${values.listPaddingLeft}rem`;
    }
    if (values.itemSpacing !== undefined && values.itemSpacing !== null) {
      styles.default.marginBottom = `${values.itemSpacing}rem`;
    }
    if (values.levelIndent !== undefined && values.levelIndent !== null) {
      styles.default.marginLeft = values.levelIndent;
    }
    if (values.positionTop !== undefined && values.positionTop !== null) {
      styles.default.top = `${values.positionTop}rem`;
    }
    if (values.zIndex !== undefined && values.zIndex !== null) {
      styles.default.zIndex = `${values.zIndex}`;
    }
    if (values.collapseIconSize !== undefined && values.collapseIconSize !== null) {
      styles.default.fontSize = `${values.collapseIconSize}rem`;
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

  if (customizations.h1Color !== undefined && customizations.h1Color !== null) {
    styles['--toc-h1-color'] = customizations.h1Color;
  }

  if (customizations.h1FontSize !== undefined && customizations.h1FontSize !== null) {
    styles['--toc-h1-font-size'] = `${customizations.h1FontSize}rem`;
  }

  if (customizations.h1FontWeight !== undefined && customizations.h1FontWeight !== null) {
    styles['--toc-h1-font-weight'] = customizations.h1FontWeight;
  }

  if (customizations.h1FontStyle !== undefined && customizations.h1FontStyle !== null) {
    styles['--toc-h1-font-style'] = customizations.h1FontStyle;
  }

  if (customizations.h1TextTransform !== undefined && customizations.h1TextTransform !== null) {
    styles['--toc-h1-text-transform'] = customizations.h1TextTransform;
  }

  if (customizations.h1TextDecoration !== undefined && customizations.h1TextDecoration !== null) {
    styles['--toc-h1-text-decoration'] = customizations.h1TextDecoration;
  }

  if (customizations.h2Color !== undefined && customizations.h2Color !== null) {
    styles['--toc-h2-color'] = customizations.h2Color;
  }

  if (customizations.h2FontSize !== undefined && customizations.h2FontSize !== null) {
    styles['--toc-h2-font-size'] = `${customizations.h2FontSize}rem`;
  }

  if (customizations.h2FontWeight !== undefined && customizations.h2FontWeight !== null) {
    styles['--toc-h2-font-weight'] = customizations.h2FontWeight;
  }

  if (customizations.h2FontStyle !== undefined && customizations.h2FontStyle !== null) {
    styles['--toc-h2-font-style'] = customizations.h2FontStyle;
  }

  if (customizations.h2TextTransform !== undefined && customizations.h2TextTransform !== null) {
    styles['--toc-h2-text-transform'] = customizations.h2TextTransform;
  }

  if (customizations.h2TextDecoration !== undefined && customizations.h2TextDecoration !== null) {
    styles['--toc-h2-text-decoration'] = customizations.h2TextDecoration;
  }

  if (customizations.h3Color !== undefined && customizations.h3Color !== null) {
    styles['--toc-h3-color'] = customizations.h3Color;
  }

  if (customizations.h3FontSize !== undefined && customizations.h3FontSize !== null) {
    styles['--toc-h3-font-size'] = `${customizations.h3FontSize}rem`;
  }

  if (customizations.h3FontWeight !== undefined && customizations.h3FontWeight !== null) {
    styles['--toc-h3-font-weight'] = customizations.h3FontWeight;
  }

  if (customizations.h3FontStyle !== undefined && customizations.h3FontStyle !== null) {
    styles['--toc-h3-font-style'] = customizations.h3FontStyle;
  }

  if (customizations.h3TextTransform !== undefined && customizations.h3TextTransform !== null) {
    styles['--toc-h3-text-transform'] = customizations.h3TextTransform;
  }

  if (customizations.h3TextDecoration !== undefined && customizations.h3TextDecoration !== null) {
    styles['--toc-h3-text-decoration'] = customizations.h3TextDecoration;
  }

  if (customizations.h4Color !== undefined && customizations.h4Color !== null) {
    styles['--toc-h4-color'] = customizations.h4Color;
  }

  if (customizations.h4FontSize !== undefined && customizations.h4FontSize !== null) {
    styles['--toc-h4-font-size'] = `${customizations.h4FontSize}rem`;
  }

  if (customizations.h4FontWeight !== undefined && customizations.h4FontWeight !== null) {
    styles['--toc-h4-font-weight'] = customizations.h4FontWeight;
  }

  if (customizations.h4FontStyle !== undefined && customizations.h4FontStyle !== null) {
    styles['--toc-h4-font-style'] = customizations.h4FontStyle;
  }

  if (customizations.h4TextTransform !== undefined && customizations.h4TextTransform !== null) {
    styles['--toc-h4-text-transform'] = customizations.h4TextTransform;
  }

  if (customizations.h4TextDecoration !== undefined && customizations.h4TextDecoration !== null) {
    styles['--toc-h4-text-decoration'] = customizations.h4TextDecoration;
  }

  if (customizations.h5Color !== undefined && customizations.h5Color !== null) {
    styles['--toc-h5-color'] = customizations.h5Color;
  }

  if (customizations.h5FontSize !== undefined && customizations.h5FontSize !== null) {
    styles['--toc-h5-font-size'] = `${customizations.h5FontSize}rem`;
  }

  if (customizations.h5FontWeight !== undefined && customizations.h5FontWeight !== null) {
    styles['--toc-h5-font-weight'] = customizations.h5FontWeight;
  }

  if (customizations.h5FontStyle !== undefined && customizations.h5FontStyle !== null) {
    styles['--toc-h5-font-style'] = customizations.h5FontStyle;
  }

  if (customizations.h5TextTransform !== undefined && customizations.h5TextTransform !== null) {
    styles['--toc-h5-text-transform'] = customizations.h5TextTransform;
  }

  if (customizations.h5TextDecoration !== undefined && customizations.h5TextDecoration !== null) {
    styles['--toc-h5-text-decoration'] = customizations.h5TextDecoration;
  }

  if (customizations.h6Color !== undefined && customizations.h6Color !== null) {
    styles['--toc-h6-color'] = customizations.h6Color;
  }

  if (customizations.h6FontSize !== undefined && customizations.h6FontSize !== null) {
    styles['--toc-h6-font-size'] = `${customizations.h6FontSize}rem`;
  }

  if (customizations.h6FontWeight !== undefined && customizations.h6FontWeight !== null) {
    styles['--toc-h6-font-weight'] = customizations.h6FontWeight;
  }

  if (customizations.h6FontStyle !== undefined && customizations.h6FontStyle !== null) {
    styles['--toc-h6-font-style'] = customizations.h6FontStyle;
  }

  if (customizations.h6TextTransform !== undefined && customizations.h6TextTransform !== null) {
    styles['--toc-h6-text-transform'] = customizations.h6TextTransform;
  }

  if (customizations.h6TextDecoration !== undefined && customizations.h6TextDecoration !== null) {
    styles['--toc-h6-text-decoration'] = customizations.h6TextDecoration;
  }

  if (customizations.collapseIconColor !== undefined && customizations.collapseIconColor !== null) {
    styles['--toc-collapse-icon-color'] = customizations.collapseIconColor;
  }

  if (customizations.titleFontSize !== undefined && customizations.titleFontSize !== null) {
    styles['--toc-title-font-size'] = `${customizations.titleFontSize}rem`;
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
    styles['--toc-wrapper-padding'] = `${customizations.wrapperPadding}rem`;
  }

  if (customizations.listPaddingLeft !== undefined && customizations.listPaddingLeft !== null) {
    styles['--toc-list-padding-left'] = `${customizations.listPaddingLeft}rem`;
  }

  if (customizations.itemSpacing !== undefined && customizations.itemSpacing !== null) {
    styles['--toc-item-spacing'] = `${customizations.itemSpacing}rem`;
  }

  if (customizations.levelIndent !== undefined && customizations.levelIndent !== null) {
    styles['--toc-level-indent'] = customizations.levelIndent;
  }

  if (customizations.positionTop !== undefined && customizations.positionTop !== null) {
    styles['--toc-position-top'] = `${customizations.positionTop}rem`;
  }

  if (customizations.zIndex !== undefined && customizations.zIndex !== null) {
    styles['--toc-z-index'] = `${customizations.zIndex}`;
  }

  if (customizations.collapseIconSize !== undefined && customizations.collapseIconSize !== null) {
    styles['--toc-collapse-icon-size'] = `${customizations.collapseIconSize}rem`;
  }

  return styles;
}
