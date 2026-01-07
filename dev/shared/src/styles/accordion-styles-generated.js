/**
 * Style Builder for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-06T21:39:00.680Z
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

  if (customizations.showIcon !== undefined && customizations.showIcon !== null) {
    styles['--accordion-icon-display'] = customizations.showIcon;
  }

  if (customizations.iconRotation !== undefined && customizations.iconRotation !== null) {
    styles['--accordion-icon-rotation'] = customizations.iconRotation;
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
    styles['--accordion-icon-active-color'] = customizations.iconActiveColor;
  }

  if (customizations.iconActiveRotation !== undefined && customizations.iconActiveRotation !== null) {
    styles['--accordion-icon-active-initial-rotation'] = customizations.iconActiveRotation;
  }

  if (customizations.iconActiveSize !== undefined && customizations.iconActiveSize !== null) {
    styles['--accordion-icon-active-size'] = customizations.iconActiveSize;
  }

  if (customizations.iconActiveMaxSize !== undefined && customizations.iconActiveMaxSize !== null) {
    styles['--accordion-icon-active-max-size'] = customizations.iconActiveMaxSize;
  }

  if (customizations.iconActiveOffsetX !== undefined && customizations.iconActiveOffsetX !== null) {
    styles['--accordion-icon-active-offset-x'] = customizations.iconActiveOffsetX;
  }

  if (customizations.iconActiveOffsetY !== undefined && customizations.iconActiveOffsetY !== null) {
    styles['--accordion-icon-active-offset-y'] = customizations.iconActiveOffsetY;
  }

  if (customizations.animationDuration !== undefined && customizations.animationDuration !== null) {
    styles['--accordion-animation-duration'] = customizations.animationDuration;
  }

  return styles;
}
