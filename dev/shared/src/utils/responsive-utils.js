/**
 * Responsive Utilities
 *
 * Utility functions for handling responsive values and CSS generation
 * for the Guttemberg Plus responsive system
 *
 * @package GuttembergPlus
 * @since 1.0.0
 */

/**
 * Get value for specific device with inheritance
 *
 * @param {*} value - The responsive value object or simple value
 * @param {string} device - The device type: 'desktop', 'tablet', or 'mobile'
 * @returns {*} The value for the specified device
 */
export function getResponsiveValue(value, device) {
  if (!value || typeof value !== 'object') return value;

  if (value[device] !== undefined) return value[device];

  // Inheritance chain: mobile → tablet → desktop
  if (device === 'tablet') return value.desktop;
  if (device === 'mobile') return value.tablet ?? value.desktop;

  return value.desktop;
}

/**
 * Check if value is inherited (not explicitly set)
 *
 * @param {*} value - The responsive value object
 * @param {string} device - The device type to check
 * @returns {boolean} True if the value is inherited
 */
export function isInheritedValue(value, device) {
  if (!value || typeof value !== 'object') return false;
  return value[device] === undefined && device !== 'desktop';
}

/**
 * Set value for specific device
 *
 * @param {*} currentValue - The current responsive value object
 * @param {string} device - The device type to set
 * @param {*} newValue - The new value to set
 * @returns {Object} Updated responsive value object
 */
export function setResponsiveValue(currentValue, device, newValue) {
  if (!currentValue || typeof currentValue !== 'object') {
    return { desktop: newValue };
  }
  return { ...currentValue, [device]: newValue };
}

/**
 * Generate CSS media queries from responsive values
 *
 * @param {string} cssVar - The CSS variable name (without --)
 * @param {*} value - The responsive value object or simple value
 * @param {Object} breakpoints - The breakpoint configuration
 * @returns {string} CSS string with the variable declaration
 */
export function generateResponsiveCSS(cssVar, value, breakpoints) {
  if (!value || typeof value !== 'object') {
    return `--${cssVar}: ${value};`;
  }

  let css = '';

  if (value.desktop !== undefined) {
    css += `--${cssVar}: ${value.desktop};\n`;
  }

  // Note: Tablet and mobile media queries are generated separately
  return css;
}

/**
 * Generate media query CSS for a specific breakpoint
 *
 * @param {string} cssVar - The CSS variable name (without --)
 * @param {*} value - The responsive value object
 * @param {string} device - The device type: 'tablet' or 'mobile'
 * @param {Object} breakpoints - The breakpoint configuration
 * @returns {string} Media query CSS string
 */
export function generateMediaQueryCSS(cssVar, value, device, breakpoints) {
  if (!value || typeof value !== 'object' || value[device] === undefined) {
    return '';
  }

  const maxWidth = breakpoints[device];
  return `@media (max-width: ${maxWidth}px) { --${cssVar}: ${value[device]}; }`;
}

/**
 * Clear device-specific value (reset to inherit)
 *
 * @param {Object} currentValue - The current responsive value object
 * @param {string} device - The device to clear
 * @returns {Object} Updated responsive value object
 */
export function clearResponsiveValue(currentValue, device) {
  if (!currentValue || typeof currentValue !== 'object') {
    return currentValue;
  }

  const newValue = { ...currentValue };
  delete newValue[device];
  return newValue;
}

/**
 * Check if a value has any responsive overrides
 *
 * @param {*} value - The value to check
 * @returns {boolean} True if the value has responsive overrides
 */
export function hasResponsiveOverrides(value) {
  if (!value || typeof value !== 'object') return false;
  return value.tablet !== undefined || value.mobile !== undefined;
}

/**
 * Convert simple value to responsive object
 *
 * @param {*} value - Simple value or responsive object
 * @returns {Object} Responsive value object
 */
export function ensureResponsiveValue(value) {
  if (value && typeof value === 'object' && 'desktop' in value) {
    return value;
  }
  return { desktop: value };
}

/**
 * Generate complete responsive CSS for all devices
 *
 * @param {string} cssVar - The CSS variable name (without --)
 * @param {*} value - The responsive value object or simple value
 * @param {Object} breakpoints - The breakpoint configuration
 * @returns {string} Complete CSS with media queries
 */
export function generateCompleteResponsiveCSS(cssVar, value, breakpoints) {
  let css = generateResponsiveCSS(cssVar, value, breakpoints);

  if (value && typeof value === 'object') {
    const tabletCSS = generateMediaQueryCSS(cssVar, value, 'tablet', breakpoints);
    const mobileCSS = generateMediaQueryCSS(cssVar, value, 'mobile', breakpoints);

    if (tabletCSS) css += '\n' + tabletCSS;
    if (mobileCSS) css += '\n' + mobileCSS;
  }

  return css;
}
