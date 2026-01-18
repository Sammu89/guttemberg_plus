/**
 * Style Builder for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2026-01-18T11:42:00.985Z
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
    if (values.wrapperBackgroundColor !== undefined && values.wrapperBackgroundColor !== null) {
      styles.default.backgroundColor = values.wrapperBackgroundColor;
    }
    // Complex object: blockBorderColor - handle manually if needed
    if (values.h1FontSize !== undefined && values.h1FontSize !== null) {
      styles.default.fontSize = values.h1FontSize;
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
    if (values.h2FontSize !== undefined && values.h2FontSize !== null) {
      styles.default.fontSize = values.h2FontSize;
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
    if (values.h3FontSize !== undefined && values.h3FontSize !== null) {
      styles.default.fontSize = values.h3FontSize;
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
    if (values.h4FontSize !== undefined && values.h4FontSize !== null) {
      styles.default.fontSize = values.h4FontSize;
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
    if (values.h5FontSize !== undefined && values.h5FontSize !== null) {
      styles.default.fontSize = values.h5FontSize;
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
    if (values.h6FontSize !== undefined && values.h6FontSize !== null) {
      styles.default.fontSize = values.h6FontSize;
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
    if (values.showIcon !== undefined && values.showIcon !== null) {
      styles.default.display = values.showIcon;
    }
    if (values.iconRotation !== undefined && values.iconRotation !== null) {
      styles.default.transform = values.iconRotation;
    }
    if (values.iconInactiveColor !== undefined && values.iconInactiveColor !== null) {
      styles.default.color = values.iconInactiveColor;
    }
    if (values.iconInactiveRotation !== undefined && values.iconInactiveRotation !== null) {
      styles.default.transform = values.iconInactiveRotation;
    }
    if (values.iconInactiveSize !== undefined && values.iconInactiveSize !== null) {
      styles.default.fontSize = values.iconInactiveSize;
    }
    if (values.iconInactiveMaxSize !== undefined && values.iconInactiveMaxSize !== null) {
      styles.default.maxWidth = values.iconInactiveMaxSize;
    }
    if (values.iconInactiveOffsetX !== undefined && values.iconInactiveOffsetX !== null) {
      styles.default.left = values.iconInactiveOffsetX;
    }
    if (values.iconInactiveOffsetY !== undefined && values.iconInactiveOffsetY !== null) {
      styles.default.top = values.iconInactiveOffsetY;
    }
    if (values.iconActiveColor !== undefined && values.iconActiveColor !== null) {
      styles.default.color = values.iconActiveColor;
    }
    if (values.iconActiveRotation !== undefined && values.iconActiveRotation !== null) {
      styles.default.transform = values.iconActiveRotation;
    }
    if (values.iconActiveSize !== undefined && values.iconActiveSize !== null) {
      styles.default.fontSize = values.iconActiveSize;
    }
    if (values.iconActiveMaxSize !== undefined && values.iconActiveMaxSize !== null) {
      styles.default.maxWidth = values.iconActiveMaxSize;
    }
    if (values.iconActiveOffsetX !== undefined && values.iconActiveOffsetX !== null) {
      styles.default.left = values.iconActiveOffsetX;
    }
    if (values.iconActiveOffsetY !== undefined && values.iconActiveOffsetY !== null) {
      styles.default.top = values.iconActiveOffsetY;
    }
    if (values.titleFontSize !== undefined && values.titleFontSize !== null) {
      styles.default.fontSize = values.titleFontSize;
    }
    if (values.titleFontWeight !== undefined && values.titleFontWeight !== null) {
      styles.default.fontWeight = values.titleFontWeight;
    }
    if (values.titleFontStyle !== undefined && values.titleFontStyle !== null) {
      styles.default.fontStyle = values.titleFontStyle;
    }
    if (values.titleTextTransform !== undefined && values.titleTextTransform !== null) {
      styles.default.textTransform = values.titleTextTransform;
    }
    if (values.titleTextDecoration !== undefined && values.titleTextDecoration !== null) {
      styles.default.textDecoration = values.titleTextDecoration;
    }
    if (values.titleAlignment !== undefined && values.titleAlignment !== null) {
      styles.default.textAlign = values.titleAlignment;
    }
    if (values.blockBorderWidth !== undefined && values.blockBorderWidth !== null) {
      styles.default.borderWidth = values.blockBorderWidth;
    }
    // Complex object: blockBorderStyle - handle manually if needed
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
      styles.default.padding = values.wrapperPadding;
    }
    if (values.itemSpacing !== undefined && values.itemSpacing !== null) {
      styles.default.gap = values.itemSpacing;
    }
    if (values.levelIndent !== undefined && values.levelIndent !== null) {
      styles.default.marginLeft = values.levelIndent;
    }
    if (values.positionTop !== undefined && values.positionTop !== null) {
      styles.default.top = values.positionTop;
    }
    if (values.zIndex !== undefined && values.zIndex !== null) {
      styles.default.zIndex = `${values.zIndex}`;
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

  // Complex object: blockBorderColor - handle manually if needed

  if (customizations.h1FontSize !== undefined && customizations.h1FontSize !== null) {
    styles['--toc-h1-font-size'] = customizations.h1FontSize;
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

  if (customizations.h2FontSize !== undefined && customizations.h2FontSize !== null) {
    styles['--toc-h2-font-size'] = customizations.h2FontSize;
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

  if (customizations.h3FontSize !== undefined && customizations.h3FontSize !== null) {
    styles['--toc-h3-font-size'] = customizations.h3FontSize;
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

  if (customizations.h4FontSize !== undefined && customizations.h4FontSize !== null) {
    styles['--toc-h4-font-size'] = customizations.h4FontSize;
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

  if (customizations.h5FontSize !== undefined && customizations.h5FontSize !== null) {
    styles['--toc-h5-font-size'] = customizations.h5FontSize;
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

  if (customizations.h6FontSize !== undefined && customizations.h6FontSize !== null) {
    styles['--toc-h6-font-size'] = customizations.h6FontSize;
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

  if (customizations.showIcon !== undefined && customizations.showIcon !== null) {
    styles['--toc-icon-display'] = customizations.showIcon;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--toc-icon-animation-rotation'] = customizations.iconRotation;
  }

  if (customizations.iconInactiveColor !== undefined && customizations.iconInactiveColor !== null) {
    styles['--toc-icon-color'] = customizations.iconInactiveColor;
  }

  if (customizations.iconInactiveRotation !== undefined && customizations.iconInactiveRotation !== null) {
    styles['--toc-icon-initial-rotation'] = customizations.iconInactiveRotation;
  }

  if (customizations.iconInactiveSize !== undefined && customizations.iconInactiveSize !== null) {
    styles['--toc-icon-size'] = customizations.iconInactiveSize;
  }

  if (customizations.iconInactiveMaxSize !== undefined && customizations.iconInactiveMaxSize !== null) {
    styles['--toc-icon-max-size'] = customizations.iconInactiveMaxSize;
  }

  if (customizations.iconInactiveOffsetX !== undefined && customizations.iconInactiveOffsetX !== null) {
    styles['--toc-icon-offset-x'] = customizations.iconInactiveOffsetX;
  }

  if (customizations.iconInactiveOffsetY !== undefined && customizations.iconInactiveOffsetY !== null) {
    styles['--toc-icon-offset-y'] = customizations.iconInactiveOffsetY;
  }

  if (customizations.iconActiveColor !== undefined && customizations.iconActiveColor !== null) {
    styles['--toc-icon-is-open-color'] = customizations.iconActiveColor;
  }

  if (customizations.iconActiveRotation !== undefined && customizations.iconActiveRotation !== null) {
    styles['--toc-icon-is-open-initial-rotation'] = customizations.iconActiveRotation;
  }

  if (customizations.iconActiveSize !== undefined && customizations.iconActiveSize !== null) {
    styles['--toc-icon-is-open-size'] = customizations.iconActiveSize;
  }

  if (customizations.iconActiveMaxSize !== undefined && customizations.iconActiveMaxSize !== null) {
    styles['--toc-icon-is-open-max-size'] = customizations.iconActiveMaxSize;
  }

  if (customizations.iconActiveOffsetX !== undefined && customizations.iconActiveOffsetX !== null) {
    styles['--toc-icon-is-open-offset-x'] = customizations.iconActiveOffsetX;
  }

  if (customizations.iconActiveOffsetY !== undefined && customizations.iconActiveOffsetY !== null) {
    styles['--toc-icon-is-open-offset-y'] = customizations.iconActiveOffsetY;
  }

  if (customizations.titleFontSize !== undefined && customizations.titleFontSize !== null) {
    styles['--toc-title-font-size'] = customizations.titleFontSize;
  }

  if (customizations.titleFontWeight !== undefined && customizations.titleFontWeight !== null) {
    styles['--toc-title-font-weight'] = customizations.titleFontWeight;
  }

  if (customizations.titleFontStyle !== undefined && customizations.titleFontStyle !== null) {
    styles['--toc-title-font-style'] = customizations.titleFontStyle;
  }

  if (customizations.titleTextTransform !== undefined && customizations.titleTextTransform !== null) {
    styles['--toc-title-text-transform'] = customizations.titleTextTransform;
  }

  if (customizations.titleTextDecoration !== undefined && customizations.titleTextDecoration !== null) {
    styles['--toc-title-text-decoration'] = customizations.titleTextDecoration;
  }

  if (customizations.titleAlignment !== undefined && customizations.titleAlignment !== null) {
    styles['--toc-title-alignment'] = customizations.titleAlignment;
  }

  if (customizations.blockBorderWidth !== undefined && customizations.blockBorderWidth !== null) {
    styles['--toc-border-width'] = customizations.blockBorderWidth;
  }

  // Complex object: blockBorderStyle - handle manually if needed

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
    styles['--toc-wrapper-padding'] = customizations.wrapperPadding;
  }

  if (customizations.itemSpacing !== undefined && customizations.itemSpacing !== null) {
    styles['--toc-item-spacing'] = customizations.itemSpacing;
  }

  if (customizations.levelIndent !== undefined && customizations.levelIndent !== null) {
    styles['--toc-level-indent'] = customizations.levelIndent;
  }

  if (customizations.positionTop !== undefined && customizations.positionTop !== null) {
    styles['--toc-position-top'] = customizations.positionTop;
  }

  if (customizations.zIndex !== undefined && customizations.zIndex !== null) {
    styles['--toc-z-index'] = `${customizations.zIndex}`;
  }

  return styles;
}
