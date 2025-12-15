/**
 * Style Builder for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-15T23:22:26.899Z
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
    if (values.titleColor !== undefined && values.titleColor !== null) {
      styles.default.color = values.titleColor;
    }
    if (values.titleBackgroundColor !== undefined && values.titleBackgroundColor !== null) {
      styles.default.backgroundColor = values.titleBackgroundColor;
    }
    if (values.hoverTitleColor !== undefined && values.hoverTitleColor !== null) {
      styles.default.color = values.hoverTitleColor;
    }
    if (values.hoverTitleBackgroundColor !== undefined && values.hoverTitleBackgroundColor !== null) {
      styles.default.backgroundColor = values.hoverTitleBackgroundColor;
    }
    if (values.contentColor !== undefined && values.contentColor !== null) {
      styles.default.color = values.contentColor;
    }
    if (values.contentBackgroundColor !== undefined && values.contentBackgroundColor !== null) {
      styles.default.backgroundColor = values.contentBackgroundColor;
    }
    if (values.borderColor !== undefined && values.borderColor !== null) {
      styles.default.borderColor = values.borderColor;
    }
    if (values.dividerColor !== undefined && values.dividerColor !== null) {
      styles.default.borderTopColor = values.dividerColor;
    }
    if (values.iconColor !== undefined && values.iconColor !== null) {
      styles.default.color = values.iconColor;
    }
    if (values.titleFontSize !== undefined && values.titleFontSize !== null) {
      styles.default.fontSize = `${values.titleFontSize}px`;
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
    if (values.contentFontSize !== undefined && values.contentFontSize !== null) {
      styles.default.fontSize = `${values.contentFontSize}px`;
    }
    if (values.contentFontWeight !== undefined && values.contentFontWeight !== null) {
      styles.default.fontWeight = values.contentFontWeight;
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
    if (values.dividerWidth !== undefined && values.dividerWidth !== null) {
      styles.default.borderTopWidth = `${values.dividerWidth}px`;
    }
    if (values.dividerStyle !== undefined && values.dividerStyle !== null) {
      styles.default.borderTopStyle = values.dividerStyle;
    }
    if (values.iconSize !== undefined && values.iconSize !== null) {
      styles.default.fontSize = `${values.iconSize}px`;
    }
    if (values.iconRotation !== undefined && values.iconRotation !== null) {
      styles.default.transform = `${values.iconRotation}deg`;
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

  if (customizations.contentColor !== undefined && customizations.contentColor !== null) {
    styles['--accordion-content-color'] = customizations.contentColor;
  }

  if (customizations.contentBackgroundColor !== undefined && customizations.contentBackgroundColor !== null) {
    styles['--accordion-content-bg'] = customizations.contentBackgroundColor;
  }

  if (customizations.borderColor !== undefined && customizations.borderColor !== null) {
    styles['--accordion-border-color'] = customizations.borderColor;
  }

  if (customizations.dividerColor !== undefined && customizations.dividerColor !== null) {
    styles['--accordion-divider-color'] = customizations.dividerColor;
  }

  if (customizations.iconColor !== undefined && customizations.iconColor !== null) {
    styles['--accordion-icon-color'] = customizations.iconColor;
  }

  if (customizations.titleFontSize !== undefined && customizations.titleFontSize !== null) {
    styles['--accordion-title-font-size'] = `${customizations.titleFontSize}px`;
  }

  if (customizations.titleFontWeight !== undefined && customizations.titleFontWeight !== null) {
    styles['--accordion-title-font-weight'] = customizations.titleFontWeight;
  }

  if (customizations.titleFontStyle !== undefined && customizations.titleFontStyle !== null) {
    styles['--accordion-title-font-style'] = customizations.titleFontStyle;
  }

  if (customizations.titleTextTransform !== undefined && customizations.titleTextTransform !== null) {
    styles['--accordion-title-text-transform'] = customizations.titleTextTransform;
  }

  if (customizations.titleTextDecoration !== undefined && customizations.titleTextDecoration !== null) {
    styles['--accordion-title-text-decoration'] = customizations.titleTextDecoration;
  }

  if (customizations.titleAlignment !== undefined && customizations.titleAlignment !== null) {
    styles['--accordion-title-alignment'] = customizations.titleAlignment;
  }

  if (customizations.contentFontSize !== undefined && customizations.contentFontSize !== null) {
    styles['--accordion-content-font-size'] = `${customizations.contentFontSize}px`;
  }

  if (customizations.contentFontWeight !== undefined && customizations.contentFontWeight !== null) {
    styles['--accordion-content-font-weight'] = customizations.contentFontWeight;
  }

  if (customizations.borderWidth !== undefined && customizations.borderWidth !== null) {
    styles['--accordion-border-width'] = `${customizations.borderWidth}px`;
  }

  if (customizations.borderStyle !== undefined && customizations.borderStyle !== null) {
    styles['--accordion-border-style'] = customizations.borderStyle;
  }

  if (customizations.borderRadius) {
    const formatted = formatBorderRadius(customizations.borderRadius);
    if (formatted) styles['--accordion-border-radius'] = formatted;
  }

  if (customizations.shadow !== undefined && customizations.shadow !== null) {
    styles['--accordion-border-shadow'] = customizations.shadow;
  }

  if (customizations.shadowHover !== undefined && customizations.shadowHover !== null) {
    styles['--accordion-border-shadow-hover'] = customizations.shadowHover;
  }

  if (customizations.dividerWidth !== undefined && customizations.dividerWidth !== null) {
    styles['--accordion-divider-width'] = `${customizations.dividerWidth}px`;
  }

  if (customizations.dividerStyle !== undefined && customizations.dividerStyle !== null) {
    styles['--accordion-divider-style'] = customizations.dividerStyle;
  }

  if (customizations.iconSize !== undefined && customizations.iconSize !== null) {
    styles['--accordion-icon-size'] = `${customizations.iconSize}px`;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--accordion-icon-rotation'] = `${customizations.iconRotation}deg`;
  }

  return styles;
}
