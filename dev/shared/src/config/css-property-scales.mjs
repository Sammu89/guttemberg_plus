/**
 * CSS Property Scales - Single source of truth for CSS property unit/step definitions
 *
 * This centralizer defines which units are available for each CSS property,
 * their step values, and min/max ranges. The schema only defines default values.
 */

// Single source of truth for CSS property unit/step definitions
export const CSS_PROPERTY_SCALES = {
  // === TYPOGRAPHY ===
  'font-size': {
    units: ['rem', 'px', '%', 'em'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1 },
    min: { rem: 0.5, px: 8, '%': 50, em: 0.5 },
    max: { rem: 6, px: 96, '%': 300, em: 6 }
  },
  'line-height': {
    units: null,  // Unitless only
    steps: null,
    defaultStep: 0.05,
    min: 0.5,
    max: 3
  },
  'letter-spacing': {
    units: ['em', 'px', 'rem'],
    steps: { em: 0.01, px: 0.5, rem: 0.01 },
    min: { em: -0.2, px: -5, rem: -0.2 },
    max: { em: 1, px: 20, rem: 1 }
  },

  // === SPACING ===
  'padding': {
    units: ['rem', 'px', '%', 'em', 'vw', 'vh'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1, vw: 1, vh: 1 },
    min: { rem: 0, px: 0, '%': 0, em: 0, vw: 0, vh: 0 },
    max: { rem: 20, px: 128, '%': 100, em: 20, vw: 100, vh: 100 }
  },
  'margin': {
    units: ['rem', 'px', '%', 'em', 'vw', 'vh'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1, vw: 1, vh: 1 },
    min: { rem: -20, px: -128, '%': -100, em: -20, vw: -100, vh: -100 },
    max: { rem: 20, px: 128, '%': 100, em: 20, vw: 100, vh: 100 }
  },
  'gap': {
    units: ['rem', 'px', '%', 'em'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1 },
    min: { rem: 0, px: 0, '%': 0, em: 0 },
    max: { rem: 10, px: 64, '%': 50, em: 10 }
  },
  'top': {
    units: ['px', '%', 'rem', 'em', 'vh'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vh: 1 },
    min: { px: -200, '%': -100, rem: -20, em: -20, vh: -100 },
    max: { px: 200, '%': 100, rem: 20, em: 20, vh: 100 }
  },

  // === SIZING ===
  'width': {
    units: ['px', '%', 'rem', 'em', 'vw'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vw: 1 },
    min: { px: 0, '%': 0, rem: 0, em: 0, vw: 0 },
    max: { px: 1920, '%': 100, rem: 120, em: 120, vw: 100 }
  },
  'height': {
    units: ['px', '%', 'rem', 'em', 'vh'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vh: 1 },
    min: { px: 0, '%': 0, rem: 0, em: 0, vh: 0 },
    max: { px: 1080, '%': 100, rem: 80, em: 80, vh: 100 }
  },
  'max-width': {
    units: ['px', '%', 'rem', 'em', 'vw'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vw: 1 },
    min: { px: 0, '%': 0, rem: 0, em: 0, vw: 0 },
    max: { px: 1920, '%': 100, rem: 120, em: 120, vw: 100 }
  },
  'min-width': {
    units: ['px', '%', 'rem', 'em', 'vw'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vw: 1 },
    min: { px: 0, '%': 0, rem: 0, em: 0, vw: 0 },
    max: { px: 1920, '%': 100, rem: 120, em: 120, vw: 100 }
  },
  'max-height': {
    units: ['px', '%', 'rem', 'em', 'vh'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vh: 1 },
    min: { px: 0, '%': 0, rem: 0, em: 0, vh: 0 },
    max: { px: 1080, '%': 100, rem: 80, em: 80, vh: 100 }
  },
  'min-height': {
    units: ['px', '%', 'rem', 'em', 'vh'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vh: 1 },
    min: { px: 0, '%': 0, rem: 0, em: 0, vh: 0 },
    max: { px: 1080, '%': 100, rem: 80, em: 80, vh: 100 }
  },

  // === BORDERS ===
  'border-width': {
    units: ['px', 'rem', 'em'],
    steps: { px: 1, rem: 0.1, em: 0.1 },
    min: { px: 0, rem: 0, em: 0 },
    max: { px: 20, rem: 2, em: 2 }
  },
  'border-radius': {
    units: ['px', 'rem', 'em', '%'],
    steps: { px: 1, rem: 0.1, em: 0.1, '%': 1 },
    min: { px: 0, rem: 0, em: 0, '%': 0 },
    max: { px: 100, rem: 10, em: 10, '%': 50 }
  },
  'box-shadow': {
    units: ['px', 'rem', 'em'],
    steps: { px: 1, rem: 0.1, em: 0.1 },
    min: { px: -50, rem: -5, em: -5 },
    max: { px: 50, rem: 5, em: 5 }
  },
  'text-shadow': {
    // Note: ShadowPanel uses these for its internal offset/blur controls
    units: ['px', 'rem', 'em'],
    steps: { px: 1, rem: 0.1, em: 0.1 },
    min: { px: -50, rem: -5, em: -5 },
    max: { px: 50, rem: 5, em: 5 }
  },
  'outline-width': {
    units: ['px', 'rem', 'em'],
    steps: { px: 1, rem: 0.1, em: 0.1 },
    min: { px: 0, rem: 0, em: 0 },
    max: { px: 20, rem: 2, em: 2 }
  },
  'outline-offset': {
    units: ['px', 'rem', 'em'],
    steps: { px: 1, rem: 0.1, em: 0.1 },
    min: { px: -20, rem: -2, em: -2 },
    max: { px: 20, rem: 2, em: 2 }
  },

  // === TRANSFORM (Rotation only - detected via regex) ===
  'transform': {
    // For rotation: rotate(), rotateX(), rotateY(), rotateZ()
    rotation: {
      units: ['deg'],
      steps: { deg: 1 },
      min: { deg: -180 },
      max: { deg: 180 }
    }
  },

  // === TRANSITIONS ===
  'transition-duration': {
    units: ['ms', 's'],
    steps: { ms: 50, s: 0.05 },
    min: { ms: 0, s: 0 },
    max: { ms: 3000, s: 3 }
  },
  'transition-delay': {
    units: ['ms', 's'],
    steps: { ms: 50, s: 0.05 },
    min: { ms: 0, s: 0 },
    max: { ms: 3000, s: 3 }
  },

  // === OPACITY/SCALE (Unitless with specific ranges) ===
  'opacity': {
    units: null,
    steps: null,
    defaultStep: 0.05,
    min: 0,
    max: 1
  },
  'scale': {
    units: null,
    steps: null,
    defaultStep: 0.05,
    min: 0,
    max: 3
  },

  // === UNITLESS PROPERTIES ===
  'color': { units: null, steps: null },
  'background-color': { units: null, steps: null },
  'background': { units: null, steps: null },
  'border-color': { units: null, steps: null },
  'border-style': { units: null, steps: null },
  'border': { units: null, steps: null },  // Shorthand property (enable/disable toggles)
  'display': { units: null, steps: null },
  'font-family': { units: null, steps: null },
  'font-style': { units: null, steps: null },
  'font-weight': { units: null, steps: null },
  'text-align': { units: null, steps: null },
  'text-decoration': { units: null, steps: null },
  'text-decoration-color': { units: null, steps: null },
  'text-decoration-style': { units: null, steps: null },
  'text-decoration-thickness': {
    units: ['px', 'em', 'rem'],
    steps: { px: 1, em: 0.1, rem: 0.1 },
    min: { px: 0, em: 0, rem: 0 },
    max: { px: 10, em: 1, rem: 1 }
  },
  'text-transform': { units: null, steps: null },
  'flex-direction': { units: null, steps: null },
  'justify-content': { units: null, steps: null },
  'align-items': { units: null, steps: null },
  'flex-wrap': { units: null, steps: null },
  'position': { units: null, steps: null },
  'overflow': { units: null, steps: null },
  'cursor': { units: null, steps: null },
  'visibility': { units: null, steps: null },
  'transition-timing-function': { units: null, steps: null },
  'transition-property': { units: null, steps: null },
  'z-index': { units: null, steps: null },
  'content': { units: null, steps: null },
  'list-style': { units: null, steps: null },
  'list-style-type': { units: null, steps: null },
  'white-space': { units: null, steps: null },
  'word-break': { units: null, steps: null },
  'text-overflow': { units: null, steps: null },
};

// Alias mappings (variants map to parent property)
export const CSS_PROPERTY_ALIASES = {
  // Border width variants → border-width
  'border-top-width': 'border-width',
  'border-right-width': 'border-width',
  'border-bottom-width': 'border-width',
  'border-left-width': 'border-width',

  // Border color variants → border-color
  'border-top-color': 'border-color',
  'border-right-color': 'border-color',
  'border-bottom-color': 'border-color',
  'border-left-color': 'border-color',

  // Border style variants → border-style
  'border-top-style': 'border-style',
  'border-right-style': 'border-style',
  'border-bottom-style': 'border-style',
  'border-left-style': 'border-style',

  // Padding variants → padding
  'padding-top': 'padding',
  'padding-right': 'padding',
  'padding-bottom': 'padding',
  'padding-left': 'padding',
  'padding-inline': 'padding',
  'padding-block': 'padding',

  // Margin variants → margin
  'margin-top': 'margin',
  'margin-right': 'margin',
  'margin-bottom': 'margin',
  'margin-left': 'margin',
  'margin-inline': 'margin',
  'margin-block': 'margin',

  // Border radius variants → border-radius
  'border-top-left-radius': 'border-radius',
  'border-top-right-radius': 'border-radius',
  'border-bottom-right-radius': 'border-radius',
  'border-bottom-left-radius': 'border-radius',

  // Position variants → top
  'right': 'top',
  'bottom': 'top',
  'left': 'top',

  // Gap variants → gap
  'row-gap': 'gap',
  'column-gap': 'gap',

  // Sizing variants
  'inline-size': 'width',
  'block-size': 'height',
  'max-inline-size': 'max-width',
  'min-inline-size': 'min-width',
  'max-block-size': 'max-height',
  'min-block-size': 'min-height',
};

/**
 * Get the scale configuration for a CSS property
 * @param {string} cssProperty - The CSS property name
 * @returns {object|null} - The scale configuration or null if not found
 */
export function getPropertyScale(cssProperty) {
  if (!cssProperty) return null;

  // Check for alias first
  const resolved = CSS_PROPERTY_ALIASES[cssProperty] || cssProperty;
  return CSS_PROPERTY_SCALES[resolved] || null;
}

/**
 * Get unit-specific configuration for a CSS property
 * @param {string} cssProperty - The CSS property name
 * @param {string} unit - The unit to get config for
 * @returns {object|null} - Object with { min, max, step } or null
 */
export function getUnitConfig(cssProperty, unit) {
  const scale = getPropertyScale(cssProperty);
  if (!scale) return null;

  // Handle unitless properties
  if (scale.units === null) {
    return {
      min: scale.min ?? 0,
      max: scale.max ?? 100,
      step: scale.defaultStep ?? 1
    };
  }

  // Handle transform rotation specially
  if (cssProperty === 'transform' && scale.rotation) {
    return {
      min: scale.rotation.min[unit] ?? -180,
      max: scale.rotation.max[unit] ?? 180,
      step: scale.rotation.steps[unit] ?? 1
    };
  }

  // Normal unit-based property
  if (!scale.steps || !scale.steps[unit]) {
    return null;
  }

  return {
    min: scale.min?.[unit] ?? 0,
    max: scale.max?.[unit] ?? 100,
    step: scale.steps[unit] ?? 1
  };
}

/**
 * Check if an attribute represents a rotation transform
 * @param {string} attrName - The attribute name
 * @param {*} defaultValue - The default value
 * @returns {boolean}
 */
export function isRotationTransform(attrName, defaultValue) {
  // Check attribute name for rotation hints
  const rotationPatterns = /rotation|rotate|angle/i;
  if (rotationPatterns.test(attrName)) {
    return true;
  }

  // Check default value for deg unit or rotation function
  if (typeof defaultValue === 'string') {
    if (defaultValue.includes('deg') || /rotate[XYZ]?\s*\(/i.test(defaultValue)) {
      return true;
    }
  }

  return false;
}

/**
 * Get available units for a CSS property
 * @param {string} cssProperty - The CSS property name
 * @returns {string[]|null} - Array of unit strings or null for unitless
 */
export function getAvailableUnits(cssProperty) {
  const scale = getPropertyScale(cssProperty);
  if (!scale) return null;

  // Handle transform rotation
  if (cssProperty === 'transform' && scale.rotation) {
    return scale.rotation.units;
  }

  return scale.units;
}

/**
 * Check if a CSS property is unitless
 * @param {string} cssProperty - The CSS property name
 * @returns {boolean}
 */
export function isUnitlessProperty(cssProperty) {
  const scale = getPropertyScale(cssProperty);
  return scale?.units === null;
}

/**
 * Parse a CSS value into number and unit
 * @param {string|number} value - The CSS value (e.g., "16px", "1.5rem", 1.5)
 * @returns {object} - { value: number, unit: string|null }
 */
export function parseValueWithUnit(value) {
  if (typeof value === 'number') {
    return { value, unit: null };
  }

  if (typeof value !== 'string') {
    return { value: 0, unit: null };
  }

  const match = value.match(/^(-?[\d.]+)\s*([\w%]+)?$/);
  if (!match) {
    return { value: 0, unit: null };
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] || null
  };
}

/**
 * Get default unit for a CSS property
 * @param {string} cssProperty - The CSS property name
 * @returns {string|null} - The default unit or null for unitless
 */
export function getDefaultUnit(cssProperty) {
  const units = getAvailableUnits(cssProperty);
  return units?.[0] ?? null;
}
