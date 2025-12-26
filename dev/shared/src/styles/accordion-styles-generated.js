/**
 * Style Builder for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-26T22:38:19.360Z
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
    // Complex object: borderWidth - handle manually if needed
    // Complex object: borderColor - handle manually if needed
    // Complex object: borderStyle - handle manually if needed
    if (values.borderRadius) {
      const formatted = formatBorderRadius(values.borderRadius);
      if (formatted) styles.default.borderRadius = formatted;
    }
    if (values.headerPadding) {
      const formatted = formatPadding(values.headerPadding);
      if (formatted) styles.default.padding = formatted;
    }
    if (values.contentPadding) {
      const formatted = formatPadding(values.contentPadding);
      if (formatted) styles.default.padding = formatted;
    }
    // Complex object: blockMargin - handle manually if needed
    if (values.shadow !== undefined && values.shadow !== null) {
      styles.default.boxShadow = values.shadow;
    }
    if (values.dividerColor !== undefined && values.dividerColor !== null) {
      styles.default.borderTopColor = values.dividerColor;
    }
    if (values.dividerStyle !== undefined && values.dividerStyle !== null) {
      styles.default.borderTopStyle = values.dividerStyle;
    }
    if (values.dividerWidth !== undefined && values.dividerWidth !== null) {
      styles.default.borderTopWidth = `${values.dividerWidth}px`;
    }
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
    if (values.activeTitleColor !== undefined && values.activeTitleColor !== null) {
      styles.default.color = values.activeTitleColor;
    }
    if (values.activeTitleBackgroundColor !== undefined && values.activeTitleBackgroundColor !== null) {
      styles.default.background = values.activeTitleBackgroundColor;
    }
    if (values.contentTextColor !== undefined && values.contentTextColor !== null) {
      styles.default.color = values.contentTextColor;
    }
    if (values.contentBackgroundColor !== undefined && values.contentBackgroundColor !== null) {
      styles.default.background = values.contentBackgroundColor;
    }
    if (values.titleFontFamily !== undefined && values.titleFontFamily !== null) {
      styles.default.fontFamily = values.titleFontFamily;
    }
    if (values.titleFontSize !== undefined && values.titleFontSize !== null) {
      styles.default.fontSize = `${values.titleFontSize}`;
    }
    if (values.titleLetterSpacing !== undefined && values.titleLetterSpacing !== null) {
      styles.default.letterSpacing = `${values.titleLetterSpacing}`;
    }
    if (values.titleTextDecoration !== undefined && values.titleTextDecoration !== null) {
      styles.default.textDecoration = values.titleTextDecoration;
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
    if (values.contentFontFamily !== undefined && values.contentFontFamily !== null) {
      styles.default.fontFamily = values.contentFontFamily;
    }
    if (values.contentFontSize !== undefined && values.contentFontSize !== null) {
      styles.default.fontSize = `${values.contentFontSize}`;
    }
    if (values.contentLineHeight !== undefined && values.contentLineHeight !== null) {
      styles.default.lineHeight = `${values.contentLineHeight}`;
    }
    if (values.iconColor !== undefined && values.iconColor !== null) {
      styles.default.color = values.iconColor;
    }
    if (values.iconSize !== undefined && values.iconSize !== null) {
      styles.default.fontSize = `${values.iconSize}`;
    }
    if (values.iconRotation !== undefined && values.iconRotation !== null) {
      styles.default.transform = `${values.iconRotation}deg`;
    }
    if (values.animationDuration !== undefined && values.animationDuration !== null) {
      styles.default.transitionDuration = `${values.animationDuration}ms`;
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

  // Complex object: borderWidth - handle manually if needed

  // Complex object: borderColor - handle manually if needed

  // Complex object: borderStyle - handle manually if needed

  if (customizations.borderRadius) {
    const formatted = formatBorderRadius(customizations.borderRadius);
    if (formatted) styles['--accordion-border-radius'] = formatted;
  }

  if (customizations.headerPadding) {
    const formatted = formatPadding(customizations.headerPadding);
    if (formatted) styles['--accordion-header-padding'] = formatted;
  }

  if (customizations.contentPadding) {
    const formatted = formatPadding(customizations.contentPadding);
    if (formatted) styles['--accordion-content-padding'] = formatted;
  }

  // Complex object: blockMargin - handle manually if needed

  if (customizations.shadow !== undefined && customizations.shadow !== null) {
    styles['--accordion-shadow'] = customizations.shadow;
  }

  if (customizations.dividerColor !== undefined && customizations.dividerColor !== null) {
    styles['--accordion-divider-color'] = customizations.dividerColor;
  }

  if (customizations.dividerStyle !== undefined && customizations.dividerStyle !== null) {
    styles['--accordion-divider-style'] = customizations.dividerStyle;
  }

  if (customizations.dividerWidth !== undefined && customizations.dividerWidth !== null) {
    styles['--accordion-divider-width'] = `${customizations.dividerWidth}px`;
  }

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

  if (customizations.activeTitleColor !== undefined && customizations.activeTitleColor !== null) {
    styles['--accordion-title-active-color'] = customizations.activeTitleColor;
  }

  if (customizations.activeTitleBackgroundColor !== undefined && customizations.activeTitleBackgroundColor !== null) {
    styles['--accordion-title-active-bg'] = customizations.activeTitleBackgroundColor;
  }

  if (customizations.contentTextColor !== undefined && customizations.contentTextColor !== null) {
    styles['--accordion-content-color'] = customizations.contentTextColor;
  }

  if (customizations.contentBackgroundColor !== undefined && customizations.contentBackgroundColor !== null) {
    styles['--accordion-content-bg'] = customizations.contentBackgroundColor;
  }

  if (customizations.titleFontFamily !== undefined && customizations.titleFontFamily !== null) {
    styles['--accordion-title-font-family'] = customizations.titleFontFamily;
  }

  if (customizations.titleFontSize !== undefined && customizations.titleFontSize !== null) {
    styles['--accordion-title-font-size'] = `${customizations.titleFontSize}`;
  }

  if (customizations.titleLetterSpacing !== undefined && customizations.titleLetterSpacing !== null) {
    styles['--accordion-title-letter-spacing'] = `${customizations.titleLetterSpacing}`;
  }

  if (customizations.titleTextDecoration !== undefined && customizations.titleTextDecoration !== null) {
    styles['--accordion-title-text-decoration'] = customizations.titleTextDecoration;
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

  if (customizations.contentFontFamily !== undefined && customizations.contentFontFamily !== null) {
    styles['--accordion-content-font-family'] = customizations.contentFontFamily;
  }

  if (customizations.contentFontSize !== undefined && customizations.contentFontSize !== null) {
    styles['--accordion-content-font-size'] = `${customizations.contentFontSize}`;
  }

  if (customizations.contentLineHeight !== undefined && customizations.contentLineHeight !== null) {
    styles['--accordion-content-line-height'] = `${customizations.contentLineHeight}`;
  }

  if (customizations.iconColor !== undefined && customizations.iconColor !== null) {
    styles['--accordion-icon-color'] = customizations.iconColor;
  }

  if (customizations.iconSize !== undefined && customizations.iconSize !== null) {
    styles['--accordion-icon-size'] = `${customizations.iconSize}`;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--accordion-icon-rotation'] = `${customizations.iconRotation}deg`;
  }

  if (customizations.animationDuration !== undefined && customizations.animationDuration !== null) {
    styles['--accordion-animation-duration'] = `${customizations.animationDuration}ms`;
  }

  if (customizations.animationEasing !== undefined && customizations.animationEasing !== null) {
    styles['--accordion-animation-easing'] = customizations.animationEasing;
  }

  return styles;
}
