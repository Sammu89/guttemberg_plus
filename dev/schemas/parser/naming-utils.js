/**
 * Naming Utilities
 *
 * Helper functions for converting between camelCase and kebab-case
 * for the new kebab-case attribute naming convention.
 */

/**
 * Convert camelCase or PascalCase string to kebab-case
 *
 * Examples:
 *   titleIcon -> title-icon
 *   borderWidthTop -> border-width-top
 *   FontSize -> font-size
 *
 * @param {string} str - camelCase or PascalCase string
 * @returns {string} kebab-case string
 */
function camelToKebab(str) {
  if (!str) return '';

  return str
    // Insert hyphen before uppercase letters
    .replace(/([A-Z])/g, '-$1')
    // Convert to lowercase
    .toLowerCase()
    // Remove leading hyphen if present
    .replace(/^-/, '');
}

/**
 * Build kebab-case attribute name from parts
 *
 * Examples:
 *   buildKebabName('titleIcon', 'Size') -> 'title-icon-size'
 *   buildKebabName('titleIcon', 'Size', 'Active') -> 'title-icon-size-active'
 *   buildKebabName('borderWidth', 'Top') -> 'border-width-top'
 *
 * @param {string} baseName - Base attribute name (e.g., 'titleIcon')
 * @param {string} field - Field name (e.g., 'Size', 'Color')
 * @param {string} state - Optional state (e.g., 'Active', 'Hover')
 * @returns {string} Full kebab-case attribute name
 */
function buildKebabName(baseName, field, state) {
  const kebabBase = camelToKebab(baseName);
  const kebabField = camelToKebab(field);

  let result = kebabBase;

  if (field) {
    result += `-${kebabField}`;
  }

  if (state && state !== 'inactive' && state !== 'base') {
    const kebabState = camelToKebab(state);
    result += `-${kebabState}`;
  }

  return result;
}

/**
 * Convert kebab-case to camelCase
 *
 * Examples:
 *   title-icon -> titleIcon
 *   border-width-top -> borderWidthTop
 *
 * @param {string} str - kebab-case string
 * @returns {string} camelCase string
 */
function kebabToCamel(str) {
  if (!str) return '';

  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Auto-generate CSS variable name from components
 *
 * Formula: --{blockType}-{element}-{cssProperty}[-state][-device]
 *
 * Examples:
 *   buildCssVarName('accordion', 'title', 'color')
 *     → '--accordion-title-color'
 *
 *   buildCssVarName('accordion', 'title', 'color', 'hover')
 *     → '--accordion-title-color-hover'
 *
 *   buildCssVarName('accordion', 'icon', 'font-size', 'active', 'tablet')
 *     → '--accordion-icon-font-size-active-tablet'
 *
 * @param {string} blockType - Block type (e.g., 'accordion', 'tabs')
 * @param {string} element - Element ID (e.g., 'title', 'icon')
 * @param {string} cssProperty - CSS property (e.g., 'color', 'border-top-width')
 * @param {string} state - Optional state ('hover', 'active', etc.) - 'base' is omitted
 * @param {string} device - Optional device ('tablet', 'mobile') - 'desktop' is omitted
 * @returns {string} CSS variable name with leading '--'
 */
function buildCssVarName(blockType, element, cssProperty, state = 'base', device = 'desktop') {
  if (!blockType || !element || !cssProperty) {
    throw new Error('buildCssVarName requires blockType, element, and cssProperty');
  }

  // Start with base: --blockType-element-cssProperty
  let varName = `--${blockType}-${element}-${cssProperty}`;

  // Add state suffix (skip 'base' as it's the default)
  if (state && state !== 'base' && state !== 'inactive') {
    varName += `-${state}`;
  }

  // Add device suffix (skip 'desktop' as it's the default)
  if (device && device !== 'desktop') {
    varName += `-${device}`;
  }

  return varName;
}

module.exports = {
  camelToKebab,
  buildKebabName,
  kebabToCamel,
  buildCssVarName
};
