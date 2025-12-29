/**
 * CSS Generator for Guttemberg Plus
 *
 * AUTO-GENERATED CSS PARTIAL FILES:
 * This generator creates SCSS partial files ({block}_variables.scss) for each block.
 * These partials contain:
 * 1. :root CSS variable declarations with default values
 * 2. CSS rules that apply variables to selectors
 *
 * Generated files:
 * - blocks/accordion/src/accordion_variables.scss
 * - blocks/tabs/src/tabs_variables.scss
 * - blocks/toc/src/toc_variables.scss
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Configuration
// ============================================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const SCHEMAS_DIR = path.join(ROOT_DIR, 'schemas');
const BLOCKS = ['accordion', 'tabs', 'toc'];


// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate timestamp for file headers
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Load and parse a schema file
 */
function loadSchema(blockType) {
  const schemaPath = path.join(SCHEMAS_DIR, `${blockType}.json`);

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  const content = fs.readFileSync(schemaPath, 'utf8');

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse schema ${blockType}.json: ${error.message}`);
  }
}

/**
 * Load structure schema (optional - for new dual-schema system)
 */
function loadStructureSchema(blockType) {
  const structurePath = path.join(SCHEMAS_DIR, `${blockType}-structure.json`);

  if (!fs.existsSync(structurePath)) {
    return null; // Structure schema not yet created
  }

  const content = fs.readFileSync(structurePath, 'utf8');

  try {
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Warning: Failed to parse structure schema ${blockType}-structure.json: ${error.message}`);
    return null;
  }
}

/**
 * Format CSS value from schema default
 * Handles objects (border-radius), numbers (with units), and strings
 *
 * Intelligently compresses shorthand values:
 * - When all 4 values are the same: outputs single value (e.g., `4px`)
 * - When top/bottom same and left/right same: outputs 2 values (e.g., `4px 8px`)
 * - When left/right same but top/bottom differ: outputs 3 values (e.g., `4px 8px 2px`)
 * - When all values differ: outputs compound value (e.g., `4px 8px 2px 0px`)
 *
 * @param {*} defaultValue - Default value from schema
 * @param {string|null} unit - Single unit string (e.g., 'px', 'rem')
 * @param {string} type - Attribute type (number, object, string)
 * @param {string|null} transformValue - Optional transform type
 * @param {Array|null} units - Array of available units (uses first as default)
 */
function formatCssValue(defaultValue, unit, type, transformValue = null, units = null) {
  if (defaultValue === null || defaultValue === undefined || defaultValue === '') {
    return null;
  }

  // Resolve effective unit: prefer explicit 'unit', fall back to first of 'units' array
  const effectiveUnit = unit || (Array.isArray(units) && units.length > 0 ? units[0] : null);

  // Handle special transformValue for paddingRectangle
  if (transformValue === 'paddingRectangle' && type === 'number') {
    const vertical = defaultValue;
    const horizontal = defaultValue * 2;
    const u = effectiveUnit || 'px';
    // Use shorthand compression
    if (vertical === horizontal) {
      return `${vertical}${u}`;
    }
    return `${vertical}${u} ${horizontal}${u}`;
  }

  // Handle array types (e.g., box-shadow layers) - skip in static CSS, handled at runtime
  if (type === 'array' || Array.isArray(defaultValue)) {
    return null;
  }

  // Handle object types (e.g., borderRadius with topLeft, topRight, etc.)
  if (type === 'object' && typeof defaultValue === 'object') {
    if (defaultValue.topLeft !== undefined) {
      // Border radius format: topLeft topRight bottomRight bottomLeft
      const u = defaultValue.unit || 'px';
      const { topLeft, topRight, bottomRight, bottomLeft } = defaultValue;
      return compressShorthand(topLeft, topRight, bottomRight, bottomLeft, u);
    }
    // Handle directional values (top, right, bottom, left) - used for border-width, padding, margin, border-color, border-style
    if (defaultValue.top !== undefined && defaultValue.right !== undefined &&
        defaultValue.bottom !== undefined && defaultValue.left !== undefined) {
      // Use unit for numeric values, empty string for strings (colors, styles)
      const isStringValue = typeof defaultValue.top === 'string';
      const u = isStringValue ? '' : (defaultValue.unit || 'px');
      const { top, right, bottom, left } = defaultValue;
      return compressShorthand(top, right, bottom, left, u);
    }
    // Handle responsive objects (tablet/mobile keys) - process base breakpoint (desktop is at root, not .desktop)
    if ((defaultValue.tablet !== undefined || defaultValue.mobile !== undefined) &&
        typeof defaultValue.value === 'object') {
      const baseValue = defaultValue.value;
      if (baseValue.top !== undefined && baseValue.right !== undefined &&
          baseValue.bottom !== undefined && baseValue.left !== undefined) {
        // Use unit for numeric values, empty string for strings (colors, styles)
        const isStringValue = typeof baseValue.top === 'string';
        const u = isStringValue ? '' : (baseValue.unit || 'px');
        const { top, right, bottom, left } = baseValue;
        return compressShorthand(top, right, bottom, left, u);
      }
    }
    // Skip other object types
    return null;
  }

  // Handle numeric types with units
  if (type === 'number') {
    return effectiveUnit ? `${defaultValue}${effectiveUnit}` : defaultValue;
  }

  // Return strings as-is
  return defaultValue;
}

/**
 * Compress CSS shorthand values (top, right, bottom, left) to minimal representation
 * Following CSS shorthand rules:
 * - 1 value: all sides same
 * - 2 values: top/bottom same, left/right same
 * - 3 values: left equals right
 * - 4 values: all different
 *
 * Supports both numeric values with units and string values (colors, styles)
 *
 * @param {number|string} top - Top value
 * @param {number|string} right - Right value
 * @param {number|string} bottom - Bottom value
 * @param {number|string} left - Left value
 * @param {string} unit - CSS unit (e.g., 'px', 'em') - only used for numeric values
 * @returns {string} Compressed CSS shorthand value
 */
function compressShorthand(top, right, bottom, left, unit) {
  // Helper to format value with unit (only for numbers)
  const formatVal = (val) => {
    if (typeof val === 'string') {
      return val; // Colors, styles, etc. - no unit
    }
    return unit ? `${val}${unit}` : `${val}`;
  };

  // All 4 values are the same
  if (top === right && right === bottom && bottom === left) {
    return formatVal(top);
  }

  // Top/bottom same AND left/right same
  if (top === bottom && left === right) {
    return `${formatVal(top)} ${formatVal(right)}`;
  }

  // Left equals right (3-value shorthand)
  if (left === right) {
    return `${formatVal(top)} ${formatVal(right)} ${formatVal(bottom)}`;
  }

  // All values different (4-value shorthand)
  return `${formatVal(top)} ${formatVal(right)} ${formatVal(bottom)} ${formatVal(left)}`;
}

/**
 * Get root element selector (first class name) for data-attribute scoping
 */
function getRootSelector(structure) {
  if (!structure || !structure.root || !structure.elements) {
    return null;
  }

  const rootElement = structure.elements[structure.root];
  if (!rootElement || !rootElement.className) {
    return null;
  }

  const rootClass = rootElement.className.split(' ')[0];
  return rootClass ? `.${rootClass}` : null;
}

/**
 * Get CSS selector from appliesTo value
 * Maps appliesTo IDs to proper CSS selectors (including nested selectors for TOC levels)
 *
 * @param {string} appliesTo - The appliesTo value from schema
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {Object} structure - Structure schema (optional)
 * @returns {string} CSS selector
 */
function getSelector(appliesTo, blockType, structure = null) {
  if (structure && structure.elements && structure.elements[appliesTo]) {
    const element = structure.elements[appliesTo];
    if (element.cssSelector) {
      return element.cssSelector;
    }
    const className = element.className ? element.className.split(' ')[0] : '';
    if (element.parentContext && className) {
      return `${element.parentContext} .${className}`;
    }
    if (className) {
      return `.${className}`;
    }
  }
  return null;
}


/**
 * Extract attributes that should generate CSS
 * Supports both old (cssSelector) and new (appliesTo + structure) systems
 */
function extractCssAttributes(schema, structure, blockType) {
  const cssAttrs = [];
  const rootSelector = getRootSelector(structure);
  const structureSelectors = new Set();
  const usedElementIds = new Set();

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    // Skip non-themeable attributes
    const hasVariants = attr.dependsOn && attr.variants && typeof attr.variants === 'object' && Object.keys(attr.variants).length > 0;
    const hasCssProperty = Boolean(attr.cssProperty);

    if (!attr.themeable || !attr.cssVar || (!hasCssProperty && !hasVariants)) {
      continue;
    }

    const formattedValue = formatCssValue(attr.default, attr.unit, attr.type, attr.transformValue, attr.units);

    // Only include if we have a valid formatted value
    if (formattedValue === null) {
      continue;
    }

    let selector = null;
    let elementId = null;

    // Helper to normalize appliesTo to array
    const normalizeAppliesTo = (appliesTo) => {
      if (!appliesTo) return [];
      return Array.isArray(appliesTo) ? appliesTo : [appliesTo];
    };

    // NEW SYSTEM: Use appliesTo with getSelector() helper
    if (attr.appliesTo) {
      // appliesTo can be string or array - use first element for CSS selector
      const appliesToElements = normalizeAppliesTo(attr.appliesTo);
      elementId = appliesToElements[0];

      // Use getSelector() helper to get proper CSS selector
      selector = getSelector(elementId, blockType, structure);
      usedElementIds.add(elementId);

      // Validate element exists in structure schema if structure is provided
      if (structure && structure.elements && !structure.elements[elementId]) {
        // Check if this is a known special selector (like level1Link, level2Link, etc.)
        const knownSpecialSelectors = ['level1Link', 'level2Link', 'level3PlusLink',
                                        'titleStatic', 'titleCollapsible', 'nestedList',
                                        'titleIconOnly', 'link', 'list', 'collapseIcon'];

        if (!knownSpecialSelectors.includes(elementId)) {
          const availableIds = Object.keys(structure.elements).join(', ');
          throw new Error(
            `CSS generator: Attribute "${attrName}" references element "${elementId}" not in ${blockType}-structure.json. Available: [${availableIds}]`
          );
        }
      } else if (structure && structure.elements && structure.elements[elementId]) {
        structureSelectors.add(selector);
      }
    }
    // OLD SYSTEM (DEPRECATED): Fall back to cssSelector
    else if (attr.cssSelector) {
      selector = attr.cssSelector;
      elementId = null; // No element ID in old system
    }
    // Skip attributes that don't have either system
    else {
      continue;
    }

    if (!selector) {
      throw new Error(
        `CSS generator: Could not resolve selector for "${attrName}" (appliesTo: ${attr.appliesTo || 'n/a'}) in ${blockType}. Ensure structure schema defines this element with className/cssSelector.`
      );
    }

    // Handle conditional variants (e.g., orientation-aware borders)
    if (hasVariants) {
      Object.entries(attr.variants).forEach(([variantKey, variantConfig]) => {
        const variantProperty = variantConfig.cssProperty || attr.cssProperty;
        if (!variantProperty) {
          return;
        }

        let variantSelector = selector;

        // Scope to data attribute on root when dependency is present
        if (rootSelector && attr.dependsOn && variantKey !== '_default') {
          variantSelector = `${rootSelector}[data-${attr.dependsOn}="${variantKey}"] ${selector}`;
        }

        cssAttrs.push({
          name: attrName,
          cssVar: attr.cssVar,
          selector: variantSelector,
          property: variantProperty,
          default: formattedValue,
          description: attr.description,
          elementId: elementId,
          variantKey,
          responsive: attr.responsive === true, // Only true if explicitly set
        });
      });

      // Skip default push when variants are handled
      continue;
    }

    cssAttrs.push({
      name: attrName,
      cssVar: attr.cssVar,
      selector: selector,
      property: attr.cssProperty,
      default: formattedValue,
      description: attr.description,
      elementId: elementId, // For grouping in new system
      responsive: attr.responsive === true, // Only true if explicitly set
    });
  }

  return { cssAttrs, structureSelectors, usedElementIds };
}

/**
 * Validate that selectors derived from structure schema match the resolved selectors
 * Throws if any structure element's cssSelector/parentContext/className isn't represented
 */
function validateStructureSelectors(structure, resolvedSelectors, usedElementIds, blockType) {
  if (!structure || !structure.elements) return;

  const missing = [];

  Object.values(structure.elements).forEach((element) => {
    // Only consider elements that have style applications
    if (!element.appliesStyles || !Array.isArray(element.appliesStyles) || element.appliesStyles.length === 0) {
      return;
    }

    // Skip elements that are never referenced by any attribute appliesTo
    if (element.id && !usedElementIds.has(element.id)) {
      return;
    }

    // Derive expected selector same way as getSelector()
    let expected = null;
    if (element.cssSelector) {
      expected = element.cssSelector;
    } else if (element.parentContext && element.className) {
      const className = element.className.split(' ')[0];
      expected = `${element.parentContext} .${className}`;
    } else if (element.className) {
      const className = element.className.split(' ')[0];
      expected = `.${className}`;
    }

    if (expected && !resolvedSelectors.has(expected)) {
      missing.push({ elementId: element.id, expected });
    }
  });

  if (missing.length > 0) {
    const details = missing.map((m) => `${m.elementId} -> ${m.expected}`).join('; ');
    throw new Error(`CSS generator: Missing selectors for ${blockType}: ${details}`);
  }
}

/**
 * Group attributes by CSS selector and separate UI states
 * Returns: { selector: { base: [...], hover: [...], active: [...], focus: [...], disabled: [...], visited: [...] } }
 */
function groupBySelector(cssAttrs) {
  const grouped = {};

  for (const attr of cssAttrs) {
    if (!grouped[attr.selector]) {
      grouped[attr.selector] = {
        base: [],
        hover: [],
        active: [],
        focus: [],
        disabled: [],
        visited: []
      };
    }

    // Detect state patterns in attribute names
    const attrNameLower = attr.name.toLowerCase();

    // Check for specific state patterns (order matters - check most specific first)
    if (attrNameLower.includes('hover')) {
      grouped[attr.selector].hover.push(attr);
    } else if (attrNameLower.includes('active')) {
      grouped[attr.selector].active.push(attr);
    } else if (attrNameLower.includes('focus')) {
      grouped[attr.selector].focus.push(attr);
    } else if (attrNameLower.includes('disabled')) {
      grouped[attr.selector].disabled.push(attr);
    } else if (attrNameLower.includes('visited')) {
      grouped[attr.selector].visited.push(attr);
    } else {
      // Base state (no special state modifier)
      grouped[attr.selector].base.push(attr);
    }
  }

  return grouped;
}

/**
 * Generate SCSS partial file for a block
 */
function generateScssPartial(blockType, schema, structure) {
  const { cssAttrs, structureSelectors, usedElementIds } = extractCssAttributes(schema, structure, blockType);

  if (cssAttrs.length === 0) {
    console.log(`  Warning: No CSS attributes found for ${blockType}`);
    return null;
  }

  // Validate that structure-defined selectors are present
  validateStructureSelectors(structure, structureSelectors, usedElementIds, blockType);

  const grouped = groupBySelector(cssAttrs);
  const fileName = `${blockType}_variables.scss`;

  // Determine which schema system is being used
  const usingNewSystem = structure && structure.elements;
  const schemaSource = usingNewSystem
    ? `schemas/${blockType}.json + schemas/${blockType}-structure.json`
    : `schemas/${blockType}.json`;

  let content = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from: ${schemaSource}
 * Generated at: ${getTimestamp()}
 *
 * This file contains CSS rules that apply variables to selectors.
 * Default values are provided via var() fallbacks - no :root declarations needed.
 *
 * Architecture:
 * - Tier 1: CSS defaults (fallback values in var() calls below)
 * - Tier 2: Theme CSS (generated via PHP for custom themes)
 * - Tier 3: Block customizations (inline styles in save.js)
 *
 * Import this file in style.scss: @use '${blockType}_variables';
 */

`;

  // NOTE: No :root CSS variables section - fallback values in var() calls serve as defaults
  // This reduces CSS output and follows the tiered architecture

  // Generate CSS for each selector
  for (const [selector, states] of Object.entries(grouped)) {
    const { base, hover, active, focus, disabled, visited } = states;

    // Skip selectors that have no attributes
    if (base.length === 0 && hover.length === 0 && active.length === 0 &&
        focus.length === 0 && disabled.length === 0 && visited.length === 0) {
      continue;
    }

    content += `${selector} {\n`;

    // Base state (no pseudo-class)
    // Uses shorthand CSS properties directly (e.g., border-width, padding, margin, border-radius)
    for (const attr of base) {
      if (attr.description) {
        content += `  /* ${attr.description} */\n`;
      }
      content += `  ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
    }

    // Hover state (:hover)
    if (hover.length > 0) {
      content += `\n  &:hover {\n`;
      for (const attr of hover) {
        if (attr.description) {
          content += `    /* ${attr.description} */\n`;
        }
        content += `    ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
      }
      content += `  }\n`;
    }

    // Active state (.active, [aria-selected="true"])
    if (active.length > 0) {
      content += `\n  &.active,\n  &[aria-selected="true"] {\n`;
      for (const attr of active) {
        if (attr.description) {
          content += `    /* ${attr.description} */\n`;
        }
        content += `    ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
      }
      content += `  }\n`;
    }

    // Focus state (:focus, :focus-visible)
    if (focus.length > 0) {
      content += `\n  &:focus,\n  &:focus-visible {\n`;
      for (const attr of focus) {
        if (attr.description) {
          content += `    /* ${attr.description} */\n`;
        }
        content += `    ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
      }
      content += `  }\n`;
    }

    // Disabled state (:disabled, [disabled])
    if (disabled.length > 0) {
      content += `\n  &:disabled,\n  &[disabled] {\n`;
      for (const attr of disabled) {
        if (attr.description) {
          content += `    /* ${attr.description} */\n`;
        }
        content += `    ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
      }
      content += `  }\n`;
    }

    // Visited state (:visited) - for links
    if (visited.length > 0) {
      content += `\n  &:visited {\n`;
      for (const attr of visited) {
        if (attr.description) {
          content += `    /* ${attr.description} */\n`;
        }
        content += `    ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
      }
      content += `  }\n`;
    }

    content += `}\n\n`;
  }

  // Generate responsive overrides using tablet/mobile CSS variables
  // Only use device-specific variables for attributes with responsive: true
  const buildResponsiveVar = (attr, device) => {
    const baseVar = `--${attr.cssVar}`;

    // Non-responsive attributes use the same base variable for all devices
    if (!attr.responsive) {
      return `var(${baseVar}, ${attr.default})`;
    }

    // Responsive attributes use device-specific variable chains
    const deviceVar = `--${attr.cssVar}-${device}`;

    if (device === 'tablet') {
      return `var(${deviceVar}, var(${baseVar}, ${attr.default}))`;
    }

    return `var(${deviceVar}, var(--${attr.cssVar}-tablet, var(${baseVar}, ${attr.default})))`;
  };

  const buildResponsiveSelector = (selector, device) => {
    const rootSelector = getRootSelector(structure);
    if (rootSelector && selector.includes(rootSelector)) {
      return selector.replace(
        rootSelector,
        `${rootSelector}[data-gutplus-device="${device}"]`
      );
    }
    return `[data-gutplus-device="${device}"] ${selector}`;
  };

  const addResponsiveBlock = (device) => {

    for (const [selector, states] of Object.entries(grouped)) {
      const { base, hover, active, focus, disabled, visited } = states;

      if (base.length === 0 && hover.length === 0 && active.length === 0 &&
          focus.length === 0 && disabled.length === 0 && visited.length === 0) {
        continue;
      }

      const responsiveSelector = buildResponsiveSelector(selector, device);
      content += `${responsiveSelector} {\n`;

      for (const attr of base) {
        if (attr.description) {
          content += `  /* ${attr.description} */\n`;
        }
        content += `  ${attr.property}: ${buildResponsiveVar(attr, device)};\n`;
      }

      if (hover.length > 0) {
        content += `\n  &:hover {\n`;
        for (const attr of hover) {
          if (attr.description) {
            content += `    /* ${attr.description} */\n`;
          }
          content += `    ${attr.property}: ${buildResponsiveVar(attr, device)};\n`;
        }
        content += `  }\n`;
      }

      if (active.length > 0) {
        content += `\n  &.active,\n  &[aria-selected="true"] {\n`;
        for (const attr of active) {
          if (attr.description) {
            content += `    /* ${attr.description} */\n`;
          }
          content += `    ${attr.property}: ${buildResponsiveVar(attr, device)};\n`;
        }
        content += `  }\n`;
      }

      if (focus.length > 0) {
        content += `\n  &:focus,\n  &:focus-visible {\n`;
        for (const attr of focus) {
          if (attr.description) {
            content += `    /* ${attr.description} */\n`;
          }
          content += `    ${attr.property}: ${buildResponsiveVar(attr, device)};\n`;
        }
        content += `  }\n`;
      }

      if (disabled.length > 0) {
        content += `\n  &:disabled,\n  &[disabled] {\n`;
        for (const attr of disabled) {
          if (attr.description) {
            content += `    /* ${attr.description} */\n`;
          }
          content += `    ${attr.property}: ${buildResponsiveVar(attr, device)};\n`;
        }
        content += `  }\n`;
      }

      if (visited.length > 0) {
        content += `\n  &:visited {\n`;
        for (const attr of visited) {
          if (attr.description) {
            content += `    /* ${attr.description} */\n`;
          }
          content += `    ${attr.property}: ${buildResponsiveVar(attr, device)};\n`;
        }
        content += `  }\n`;
      }

      content += `}\n\n`;
    }

    content += `\n`;
  };

  addResponsiveBlock('tablet');
  addResponsiveBlock('mobile');

  return { fileName, content, count: cssAttrs.length };
}

// ============================================================================
// Main Generator
// ============================================================================

/**
 * Main generation function
 */
async function generate() {
  const startTime = Date.now();
  const results = {
    success: [],
    errors: [],
    totalDeclarations: 0,
  };

  try {
    for (const blockType of BLOCKS) {
      try {
        // Load attribute schema
        const schema = loadSchema(blockType);

        // Load structure schema (optional - for new dual-schema system)
        const structure = loadStructureSchema(blockType);

        // Generate SCSS partial
        const result = generateScssPartial(blockType, schema, structure);

        if (result) {
          const { fileName, content, count } = result;
          const outputPath = path.join(ROOT_DIR, 'blocks', blockType, 'src', fileName);

          // Write file
          fs.writeFileSync(outputPath, content, 'utf8');

          results.success.push({ blockType, count });
          results.totalDeclarations += count;
        }

      } catch (error) {
        results.errors.push(`${blockType}: ${error.message}`);
        console.error(`  ✗ CSS ${blockType}: ${error.message}`);
      }
    }

  } catch (error) {
    results.errors.push(`Generation failed: ${error.message}`);
    console.error(`Fatal error: ${error.message}`);
  }

  // Summary
  const elapsed = Date.now() - startTime;

  if (results.errors.length > 0) {
    console.log('\n  CSS Generation Errors:');
    for (const error of results.errors) {
      console.log(`    - ${error}`);
    }
    process.exit(1);
  }

  console.log(`✅ CSS generation: ${results.success.length} files, ${results.totalDeclarations} declarations (${elapsed}ms)\n`);
  return results;
}

// Run generator
if (require.main === module) {
  generate().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generate, getSelector };
