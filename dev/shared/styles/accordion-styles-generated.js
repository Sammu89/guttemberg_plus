/**
 * Style Builder for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-18T11:42:00.933Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Build inline styles for editor based on effective values
 * @param {Object} values - Effective values (defaults + theme + customizations)
 * @returns {Object} Style objects keyed by selector type
 */
export function buildEditorStyles(values) {
  const styles = {};

  // Styles for default
  styles.default = {};
    if (values.titleFontFamily !== undefined && values.titleFontFamily !== null) {
      styles.default.fontFamily = values.titleFontFamily;
    }
    if (values.titleFontSize !== undefined && values.titleFontSize !== null) {
      styles.default.fontSize = values.titleFontSize;
    }
    if (values.titleNoLineBreak !== undefined && values.titleNoLineBreak !== null) {
      styles.default.whiteSpace = values.titleNoLineBreak;
    }
    if (values.titleFontWeight !== undefined && values.titleFontWeight !== null) {
      styles.default.fontWeight = values.titleFontWeight;
    }
    if (values.titleDecorationColor !== undefined && values.titleDecorationColor !== null) {
      styles.default.textDecorationColor = values.titleDecorationColor;
    }
    if (values.titleDecorationStyle !== undefined && values.titleDecorationStyle !== null) {
      styles.default.textDecorationStyle = values.titleDecorationStyle;
    }
    if (values.titleDecorationWidth !== undefined && values.titleDecorationWidth !== null) {
      styles.default.textDecorationThickness = values.titleDecorationWidth;
    }
    if (values.titleLetterSpacing !== undefined && values.titleLetterSpacing !== null) {
      styles.default.letterSpacing = values.titleLetterSpacing;
    }
    if (values.titleTextTransform !== undefined && values.titleTextTransform !== null) {
      styles.default.textTransform = values.titleTextTransform;
    }
    if (values.titleTextDecoration !== undefined && values.titleTextDecoration !== null) {
      styles.default.textDecorationLine = values.titleTextDecoration;
    }
    if (values.titleLineHeight !== undefined && values.titleLineHeight !== null) {
      styles.default.lineHeight = values.titleLineHeight;
    }
    if (values.titleOffsetX !== undefined && values.titleOffsetX !== null) {
      styles.default.left = values.titleOffsetX;
    }
    if (values.titleOffsetY !== undefined && values.titleOffsetY !== null) {
      styles.default.top = values.titleOffsetY;
    }
    if (values.titleAlignment !== undefined && values.titleAlignment !== null) {
      styles.default.textAlign = values.titleAlignment;
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
    if (values.animationDuration !== undefined && values.animationDuration !== null) {
      styles.default.transitionDuration = values.animationDuration;
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

  if (customizations.dividerBorder !== undefined && customizations.dividerBorder !== null) {
    styles['--accordion-content'] = customizations.dividerBorder;
  }

  if (customizations.blockBox !== undefined && customizations.blockBox !== null) {
    styles['--accordion-item'] = customizations.blockBox;
  }

  if (customizations.headerBox !== undefined && customizations.headerBox !== null) {
    styles['--accordion-title'] = customizations.headerBox;
  }

  if (customizations.contentBox !== undefined && customizations.contentBox !== null) {
    styles['--accordion-contentInner'] = customizations.contentBox;
  }

  if (customizations.titleFontFamily !== undefined && customizations.titleFontFamily !== null) {
    styles['--accordion-title-font-family'] = customizations.titleFontFamily;
  }

  if (customizations.titleFontSize !== undefined && customizations.titleFontSize !== null) {
    styles['--accordion-title-font-size'] = customizations.titleFontSize;
  }

  if (customizations.titleNoLineBreak !== undefined && customizations.titleNoLineBreak !== null) {
    styles['--accordion-title-white-space'] = customizations.titleNoLineBreak;
  }

  if (customizations.titleFontWeight !== undefined && customizations.titleFontWeight !== null) {
    styles['--accordion-title-font-weight'] = customizations.titleFontWeight;
  }

  if (customizations.titleDecorationColor !== undefined && customizations.titleDecorationColor !== null) {
    styles['--accordion-title-decoration-color'] = customizations.titleDecorationColor;
  }

  if (customizations.titleDecorationStyle !== undefined && customizations.titleDecorationStyle !== null) {
    styles['--accordion-title-decoration-style'] = customizations.titleDecorationStyle;
  }

  if (customizations.titleDecorationWidth !== undefined && customizations.titleDecorationWidth !== null) {
    styles['--accordion-title-decoration-width'] = customizations.titleDecorationWidth;
  }

  if (customizations.titleLetterSpacing !== undefined && customizations.titleLetterSpacing !== null) {
    styles['--accordion-title-letter-spacing'] = customizations.titleLetterSpacing;
  }

  if (customizations.titleTextTransform !== undefined && customizations.titleTextTransform !== null) {
    styles['--accordion-title-text-transform'] = customizations.titleTextTransform;
  }

  if (customizations.titleTextDecoration !== undefined && customizations.titleTextDecoration !== null) {
    styles['--accordion-title-text-decoration-line'] = customizations.titleTextDecoration;
  }

  if (customizations.titleLineHeight !== undefined && customizations.titleLineHeight !== null) {
    styles['--accordion-title-line-height'] = customizations.titleLineHeight;
  }

  if (customizations.titleOffsetX !== undefined && customizations.titleOffsetX !== null) {
    styles['--accordion-title-offset-x'] = customizations.titleOffsetX;
  }

  if (customizations.titleOffsetY !== undefined && customizations.titleOffsetY !== null) {
    styles['--accordion-title-offset-y'] = customizations.titleOffsetY;
  }

  if (customizations.titleAlignment !== undefined && customizations.titleAlignment !== null) {
    styles['--accordion-title-alignment'] = customizations.titleAlignment;
  }

  if (customizations.showIcon !== undefined && customizations.showIcon !== null) {
    styles['--accordion-icon-display'] = customizations.showIcon;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--accordion-icon-animation-rotation'] = customizations.iconRotation;
  }

  if (customizations.iconInactiveColor !== undefined && customizations.iconInactiveColor !== null) {
    styles['--accordion-icon-color'] = customizations.iconInactiveColor;
  }

  if (customizations.iconInactiveRotation !== undefined && customizations.iconInactiveRotation !== null) {
    styles['--accordion-icon-initial-rotation'] = customizations.iconInactiveRotation;
  }

  if (customizations.iconInactiveSize !== undefined && customizations.iconInactiveSize !== null) {
    styles['--accordion-icon-size'] = customizations.iconInactiveSize;
  }

  if (customizations.iconInactiveMaxSize !== undefined && customizations.iconInactiveMaxSize !== null) {
    styles['--accordion-icon-max-size'] = customizations.iconInactiveMaxSize;
  }

  if (customizations.iconInactiveOffsetX !== undefined && customizations.iconInactiveOffsetX !== null) {
    styles['--accordion-icon-offset-x'] = customizations.iconInactiveOffsetX;
  }

  if (customizations.iconInactiveOffsetY !== undefined && customizations.iconInactiveOffsetY !== null) {
    styles['--accordion-icon-offset-y'] = customizations.iconInactiveOffsetY;
  }

  if (customizations.iconActiveColor !== undefined && customizations.iconActiveColor !== null) {
    styles['--accordion-icon-is-open-color'] = customizations.iconActiveColor;
  }

  if (customizations.iconActiveRotation !== undefined && customizations.iconActiveRotation !== null) {
    styles['--accordion-icon-is-open-initial-rotation'] = customizations.iconActiveRotation;
  }

  if (customizations.iconActiveSize !== undefined && customizations.iconActiveSize !== null) {
    styles['--accordion-icon-is-open-size'] = customizations.iconActiveSize;
  }

  if (customizations.iconActiveMaxSize !== undefined && customizations.iconActiveMaxSize !== null) {
    styles['--accordion-icon-is-open-max-size'] = customizations.iconActiveMaxSize;
  }

  if (customizations.iconActiveOffsetX !== undefined && customizations.iconActiveOffsetX !== null) {
    styles['--accordion-icon-is-open-offset-x'] = customizations.iconActiveOffsetX;
  }

  if (customizations.iconActiveOffsetY !== undefined && customizations.iconActiveOffsetY !== null) {
    styles['--accordion-icon-is-open-offset-y'] = customizations.iconActiveOffsetY;
  }

  if (customizations.animationDuration !== undefined && customizations.animationDuration !== null) {
    styles['--accordion-animation-duration'] = customizations.animationDuration;
  }

  return styles;
}
