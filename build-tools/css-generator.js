/**
 * CSS Generator for Guttemberg Plus
 *
 * AUTO-GENERATED CSS PARTIAL FILES:
 * This generator creates SCSS partial files (_theme-generated.scss) for each block.
 * These partials contain CSS variable declarations extracted from schema definitions.
 *
 * Generated files:
 * - blocks/accordion/src/_theme-generated.scss
 * - blocks/tabs/src/_theme-generated.scss
 * - blocks/toc/src/_theme-generated.scss
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
 */
function formatCssValue(defaultValue, unit, type, transformValue = null) {
  if (defaultValue === null || defaultValue === undefined || defaultValue === '') {
    return null;
  }

  // Handle special transformValue for paddingRectangle
  if (transformValue === 'paddingRectangle' && type === 'number') {
    const vertical = defaultValue;
    const horizontal = defaultValue * 2;
    return `${vertical}px ${horizontal}px`;
  }

  // Handle object types (e.g., borderRadius with topLeft, topRight, etc.)
  if (type === 'object' && typeof defaultValue === 'object') {
    if (defaultValue.topLeft !== undefined) {
      // Border radius format: topLeft topRight bottomRight bottomLeft
      return `${defaultValue.topLeft}px ${defaultValue.topRight}px ${defaultValue.bottomRight}px ${defaultValue.bottomLeft}px`;
    }
    // Skip other object types
    return null;
  }

  // Handle numeric types with units
  if (type === 'number') {
    return unit ? `${defaultValue}${unit}` : defaultValue;
  }

  // Return strings as-is
  return defaultValue;
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
  // Selector mapping for each block type
  const selectorMap = {
    // Common selectors
    wrapper: `.gutplus-${blockType}`,

    // Accordion selectors (FIXED: Use actual class names from accordion save.js)
    accordionItem: '.gutplus-accordion',
    accordionTitle: '.accordion-title',
    accordionContent: '.accordion-content',
    accordionIcon: '.accordion-icon',
    item: '.gutplus-accordion',
    title: blockType === 'accordion' ? '.accordion-title' : undefined,
    content: blockType === 'accordion' ? '.accordion-content' : undefined,
    icon: blockType === 'accordion' ? '.accordion-icon' : undefined,

    // Tabs selectors
    tabsList: '.gutplus-tabs-list',
    tabButton: '.gutplus-tab-button',
    tabPanel: '.gutplus-tab-panel',
    tabIcon: '.gutplus-tab-icon',

    // TOC selectors
    tocTitle: '.toc-title',
    titleStatic: '.toc-title:not(.toc-toggle-button)',
    titleCollapsible: '.toc-toggle-button',
    link: '.toc-link',
    list: '.toc-list',
    nestedList: '.toc-list ul',
    collapseIcon: '.toc-collapse-icon',
    titleIconOnly: '.toc-icon-only .toc-collapse-icon',

    // TOC level-specific selectors (nested selectors)
    level1Link: '.toc-level-1 .toc-link',
    level2Link: '.toc-level-2 .toc-link',
    level3PlusLink: '.toc-level-3 .toc-link, .toc-level-4 .toc-link, .toc-level-5 .toc-link, .toc-level-6 .toc-link',
  };

  // Check if we have a direct mapping
  if (selectorMap[appliesTo]) {
    return selectorMap[appliesTo];
  }

  // NEW SYSTEM: Use structure schema if available
  if (structure && structure.elements && structure.elements[appliesTo]) {
    const element = structure.elements[appliesTo];
    const className = element.className.split(' ')[0];
    return `.${className}`;
  }

  // Fallback: create selector from appliesTo ID (kebab-case)
  const kebabCase = appliesTo.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return `.${blockType}-${kebabCase}`;
}

/**
 * Extract attributes that should generate CSS
 * Supports both old (cssSelector) and new (appliesTo + structure) systems
 */
function extractCssAttributes(schema, structure, blockType) {
  const cssAttrs = [];
  const rootSelector = getRootSelector(structure);

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    // Skip non-themeable attributes
    const hasVariants = attr.dependsOn && attr.variants && typeof attr.variants === 'object' && Object.keys(attr.variants).length > 0;
    const hasCssProperty = Boolean(attr.cssProperty);

    if (!attr.themeable || !attr.cssVar || (!hasCssProperty && !hasVariants)) {
      continue;
    }

    const formattedValue = formatCssValue(attr.default, attr.unit, attr.type, attr.transformValue);

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

      // Validate element exists in structure schema if structure is provided
      if (structure && structure.elements && !structure.elements[elementId]) {
        // Check if this is a known special selector (like level1Link, level2Link, etc.)
        const knownSpecialSelectors = ['level1Link', 'level2Link', 'level3PlusLink',
                                        'titleStatic', 'titleCollapsible', 'nestedList',
                                        'titleIconOnly', 'link', 'list', 'collapseIcon'];

        if (!knownSpecialSelectors.includes(elementId)) {
          const availableIds = Object.keys(structure.elements).join(', ');
          console.warn(`\n  ⚠️  WARNING: Attribute "${attrName}" references element "${elementId}"`);
          console.warn(`      but structure schema only has: [${availableIds}]`);
          console.warn(`      This attribute will be SKIPPED. Update appliesTo field to match structure element ID.\n`);
          continue;
        }
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
    });
  }

  return cssAttrs;
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
  const cssAttrs = extractCssAttributes(schema, structure, blockType);

  if (cssAttrs.length === 0) {
    console.log(`  Warning: No CSS attributes found for ${blockType}`);
    return null;
  }

  const grouped = groupBySelector(cssAttrs);
  const fileName = '_theme-generated.scss';

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
 * This file contains CSS variable declarations for themeable properties.
 * Import this file in style.scss: @use 'theme-generated';
 */

`;

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

module.exports = { generate };
