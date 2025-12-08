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
function formatCssValue(defaultValue, unit, type) {
  if (defaultValue === null || defaultValue === undefined || defaultValue === '') {
    return null;
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
 * Extract attributes that should generate CSS
 * Supports both old (cssSelector) and new (appliesTo + structure) systems
 */
function extractCssAttributes(schema, structure) {
  const cssAttrs = [];

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    // Skip non-themeable attributes
    if (!attr.themeable || !attr.cssVar || !attr.cssProperty) {
      continue;
    }

    const formattedValue = formatCssValue(attr.default, attr.unit, attr.type);

    // Only include if we have a valid formatted value
    if (formattedValue === null) {
      continue;
    }

    let selector = null;
    let elementId = null;

    // NEW SYSTEM: Use appliesTo + structure schema
    if (attr.appliesTo && structure && structure.elements) {
      elementId = attr.appliesTo;
      const element = structure.elements[elementId];

      if (!element) {
        const availableIds = Object.keys(structure.elements).join(', ');
        console.warn(`\n  ⚠️  WARNING: Attribute "${attrName}" references element "${elementId}"`);
        console.warn(`      but structure schema only has: [${availableIds}]`);
        console.warn(`      This attribute will be SKIPPED. Update appliesTo field to match structure element ID.\n`);
        continue;
      }

      // Get primary class name (first one if multiple classes)
      const className = element.className.split(' ')[0];
      selector = `.${className}`;
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
 * Group attributes by CSS selector and separate hover states
 * Returns: { selector: { regular: [...], hover: [...] } }
 */
function groupBySelector(cssAttrs) {
  const grouped = {};

  for (const attr of cssAttrs) {
    if (!grouped[attr.selector]) {
      grouped[attr.selector] = {
        regular: [],
        hover: []
      };
    }

    // Detect hover states by attribute name (contains 'hover' or 'Hover')
    const isHover = /hover/i.test(attr.name);

    if (isHover) {
      grouped[attr.selector].hover.push(attr);
    } else {
      grouped[attr.selector].regular.push(attr);
    }
  }

  return grouped;
}

/**
 * Generate SCSS partial file for a block
 */
function generateScssPartial(blockType, schema, structure) {
  const cssAttrs = extractCssAttributes(schema, structure);

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
  for (const [selector, { regular, hover }] of Object.entries(grouped)) {
    content += `${selector} {\n`;

    // Regular (non-hover) styles
    for (const attr of regular) {
      // Add comment with description if available
      if (attr.description) {
        content += `  /* ${attr.description} */\n`;
      }
      content += `  ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
    }

    // Hover styles (if any)
    if (hover.length > 0) {
      content += `\n  &:hover {\n`;

      for (const attr of hover) {
        // Add comment with description if available
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
  console.log('\n========================================');
  console.log('  CSS Generator');
  console.log('========================================\n');

  const startTime = Date.now();
  const results = {
    success: [],
    errors: [],
    totalDeclarations: 0,
  };

  try {
    console.log('Generating CSS partials...\n');

    for (const blockType of BLOCKS) {
      try {
        // Load attribute schema
        const schema = loadSchema(blockType);

        // Load structure schema (optional - for new dual-schema system)
        const structure = loadStructureSchema(blockType);

        // Log which schema system is being used
        if (structure) {
          console.log(`  ${blockType}: Using NEW dual-schema system (appliesTo + structure)`);
        } else {
          console.log(`  ${blockType}: Using OLD single-schema system (cssSelector) - deprecated`);
        }

        // Generate SCSS partial
        const result = generateScssPartial(blockType, schema, structure);

        if (result) {
          const { fileName, content, count } = result;
          const outputPath = path.join(ROOT_DIR, 'blocks', blockType, 'src', fileName);

          // Write file
          fs.writeFileSync(outputPath, content, 'utf8');

          results.success.push({ blockType, count });
          results.totalDeclarations += count;

          console.log(`  ✓ ${blockType}: ${count} declarations → blocks/${blockType}/src/${fileName}`);
        } else {
          console.log(`  - ${blockType}: No CSS to generate`);
        }

      } catch (error) {
        results.errors.push(`${blockType}: ${error.message}`);
        console.error(`  ✗ ${blockType}: ${error.message}`);
      }
    }

    console.log('');

  } catch (error) {
    results.errors.push(`Generation failed: ${error.message}`);
    console.error(`Fatal error: ${error.message}`);
  }

  // Summary
  const elapsed = Date.now() - startTime;

  console.log('========================================');
  console.log('  Generation Summary');
  console.log('========================================\n');

  console.log(`  Files generated: ${results.success.length}`);
  console.log(`  Total CSS declarations: ${results.totalDeclarations}`);
  console.log(`  Errors: ${results.errors.length}`);
  console.log(`  Time: ${elapsed}ms\n`);

  if (results.errors.length > 0) {
    console.log('  Errors:');
    for (const error of results.errors) {
      console.log(`    - ${error}`);
    }
    console.log('');
    process.exit(1);
  }

  console.log('  CSS generation completed successfully!\n');
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
