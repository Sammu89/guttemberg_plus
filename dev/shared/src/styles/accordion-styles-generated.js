/**
 * Style Builder for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-29T02:23:59.795Z
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
    // Complex object: dividerWidth - handle manually if needed
    // Complex object: dividerColor - handle manually if needed
    // Complex object: dividerStyle - handle manually if needed
    // Complex object: borderWidth - handle manually if needed
    if (values.borderRadius) {
      const formatted = formatBorderRadius(values.borderRadius);
      if (formatted) styles.default.borderRadius = formatted;
    }
    if (values.shadow !== undefined && values.shadow !== null) {
      styles.default.boxShadow = values.shadow;
    }
    // Complex object: borderColor - handle manually if needed
    // Complex object: borderStyle - handle manually if needed
    if (values.headerPadding) {
      const formatted = formatPadding(values.headerPadding);
      if (formatted) styles.default.padding = formatted;
    }
    if (values.contentPadding) {
      const formatted = formatPadding(values.contentPadding);
      if (formatted) styles.default.padding = formatted;
    }
    // Complex object: blockMargin - handle manually if needed
    if (values.titleColor !== undefined && values.titleColor !== null) {
      styles.default.color = values.titleColor;
    }
    if (values.titleBackgroundColor !== undefined && values.titleBackgroundColor !== null) {
      styles.default.background = values.titleBackgroundColor;
    }
    if (values.hoverTitleColor !== undefined && values.hoverTitleColor !== null) {
      styles.default.color = values.hoverTitleColor;
    }
    if (values.hoverTitleBackgroundColor !== undefined && values.hoverTitleBackgroundColor !== null) {
      styles.default.background = values.hoverTitleBackgroundColor;
    }
    if (values.contentTextColor !== undefined && values.contentTextColor !== null) {
      styles.default.color = values.contentTextColor;
    }
    if (values.contentBackgroundColor !== undefined && values.contentBackgroundColor !== null) {
      styles.default.background = values.contentBackgroundColor;
    }
    if (values.contentFontFamily !== undefined && values.contentFontFamily !== null) {
      styles.default.fontFamily = values.contentFontFamily;
    }
    if (values.contentFontSize !== undefined && values.contentFontSize !== null) {
      styles.default.fontSize = values.contentFontSize;
    }
    if (values.contentLineHeight !== undefined && values.contentLineHeight !== null) {
      styles.default.lineHeight = `${values.contentLineHeight}`;
    }
    if (values.titleFontFamily !== undefined && values.titleFontFamily !== null) {
      styles.default.fontFamily = values.titleFontFamily;
    }
    if (values.titleFontSize !== undefined && values.titleFontSize !== null) {
      styles.default.fontSize = values.titleFontSize;
    }
    if (values.titleFontWeight !== undefined && values.titleFontWeight !== null) {
      styles.default.fontWeight = `${values.titleFontWeight}`;
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
    if (values.titleLineHeight !== undefined && values.titleLineHeight !== null) {
      styles.default.lineHeight = `${values.titleLineHeight}`;
    }
    if (values.titleAlignment !== undefined && values.titleAlignment !== null) {
      styles.default.textAlign = values.titleAlignment;
    }
    if (values.titleOffsetX !== undefined && values.titleOffsetX !== null) {
      styles.default.left = values.titleOffsetX;
    }
    if (values.titleOffsetY !== undefined && values.titleOffsetY !== null) {
      styles.default.top = values.titleOffsetY;
    }
    if (values.titleTextShadow !== undefined && values.titleTextShadow !== null) {
      styles.default.textShadow = values.titleTextShadow;
    }
    if (values.iconColor !== undefined && values.iconColor !== null) {
      styles.default.color = values.iconColor;
    }
    if (values.iconSize !== undefined && values.iconSize !== null) {
      styles.default.fontSize = values.iconSize;
    }
    if (values.iconRotation !== undefined && values.iconRotation !== null) {
      styles.default.transform = values.iconRotation;
    }
    if (values.animationDuration !== undefined && values.animationDuration !== null) {
      styles.default.transitionDuration = values.animationDuration;
    }
    if (values.animationEasing !== undefined && values.animationEasing !== null) {
      styles.default.transitionTimingFunction = values.animationEasing;
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

  // Complex object: dividerWidth - handle manually if needed

  // Complex object: dividerColor - handle manually if needed

  // Complex object: dividerStyle - handle manually if needed

  // Complex object: borderWidth - handle manually if needed

  if (customizations.borderRadius) {
    const formatted = formatBorderRadius(customizations.borderRadius);
    if (formatted) styles['--accordion-border-radius'] = formatted;
  }

  if (customizations.shadow !== undefined && customizations.shadow !== null) {
    styles['--accordion-shadow'] = customizations.shadow;
  }

  // Complex object: borderColor - handle manually if needed

  // Complex object: borderStyle - handle manually if needed

  if (customizations.headerPadding) {
    const formatted = formatPadding(customizations.headerPadding);
    if (formatted) styles['--accordion-header-padding'] = formatted;
  }

  if (customizations.contentPadding) {
    const formatted = formatPadding(customizations.contentPadding);
    if (formatted) styles['--accordion-content-padding'] = formatted;
  }

  // Complex object: blockMargin - handle manually if needed

  if (customizations.titleColor !== undefined && customizations.titleColor !== null) {
    styles['--accordion-title-color'] = customizations.titleColor;
  }

  if (customizations.titleBackgroundColor !== undefined && customizations.titleBackgroundColor !== null) {
    styles['--accordion-title-bg'] = customizations.titleBackgroundColor;
  }

  if (customizations.hoverTitleColor !== undefined && customizations.hoverTitleColor !== null) {
    styles['--accordion-title-hover-color'] = customizations.hoverTitleColor;
  }

  if (customizations.hoverTitleBackgroundColor !== undefined && customizations.hoverTitleBackgroundColor !== null) {
    styles['--accordion-title-hover-bg'] = customizations.hoverTitleBackgroundColor;
  }

  if (customizations.contentTextColor !== undefined && customizations.contentTextColor !== null) {
    styles['--accordion-content-color'] = customizations.contentTextColor;
  }

  if (customizations.contentBackgroundColor !== undefined && customizations.contentBackgroundColor !== null) {
    styles['--accordion-content-bg'] = customizations.contentBackgroundColor;
  }

  if (customizations.contentFontFamily !== undefined && customizations.contentFontFamily !== null) {
    styles['--accordion-content-font-family'] = customizations.contentFontFamily;
  }

  if (customizations.contentFontSize !== undefined && customizations.contentFontSize !== null) {
    styles['--accordion-content-font-size'] = customizations.contentFontSize;
  }

  if (customizations.contentLineHeight !== undefined && customizations.contentLineHeight !== null) {
    styles['--accordion-content-line-height'] = `${customizations.contentLineHeight}`;
  }

  if (customizations.titleFontFamily !== undefined && customizations.titleFontFamily !== null) {
    styles['--accordion-title-font-family'] = customizations.titleFontFamily;
  }

  if (customizations.titleFontSize !== undefined && customizations.titleFontSize !== null) {
    styles['--accordion-title-font-size'] = customizations.titleFontSize;
  }

  if (customizations.titleFontWeight !== undefined && customizations.titleFontWeight !== null) {
    styles['--accordion-title-font-weight'] = `${customizations.titleFontWeight}`;
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

  if (customizations.titleLineHeight !== undefined && customizations.titleLineHeight !== null) {
    styles['--accordion-title-line-height'] = `${customizations.titleLineHeight}`;
  }

  if (customizations.titleAlignment !== undefined && customizations.titleAlignment !== null) {
    styles['--accordion-title-alignment'] = customizations.titleAlignment;
  }

  if (customizations.titleOffsetX !== undefined && customizations.titleOffsetX !== null) {
    styles['--accordion-title-offset-x'] = customizations.titleOffsetX;
  }

  if (customizations.titleOffsetY !== undefined && customizations.titleOffsetY !== null) {
    styles['--accordion-title-offset-y'] = customizations.titleOffsetY;
  }

  if (customizations.titleTextShadow !== undefined && customizations.titleTextShadow !== null) {
    styles['--accordion-title-text-shadow'] = customizations.titleTextShadow;
  }

  if (customizations.iconColor !== undefined && customizations.iconColor !== null) {
    styles['--accordion-icon-color'] = customizations.iconColor;
  }

  if (customizations.iconSize !== undefined && customizations.iconSize !== null) {
    styles['--accordion-icon-size'] = customizations.iconSize;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--accordion-icon-rotation'] = customizations.iconRotation;
  }

  if (customizations.animationDuration !== undefined && customizations.animationDuration !== null) {
    styles['--accordion-animation-duration'] = customizations.animationDuration;
  }

  if (customizations.animationEasing !== undefined && customizations.animationEasing !== null) {
    styles['--accordion-animation-easing'] = customizations.animationEasing;
  }

  return styles;
}
