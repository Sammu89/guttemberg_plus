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
 * Requires: cssVar, cssSelector, and cssProperty
 */
function extractCssAttributes(schema) {
  const cssAttrs = [];

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    // Must have all three fields to generate CSS
    if (attr.cssVar && attr.cssSelector && attr.cssProperty) {
      const formattedValue = formatCssValue(attr.default, attr.unit, attr.type);

      // Only include if we have a valid formatted value
      if (formattedValue !== null) {
        cssAttrs.push({
          name: attrName,
          cssVar: attr.cssVar,
          selector: attr.cssSelector,
          property: attr.cssProperty,
          default: formattedValue,
          description: attr.description,
        });
      }
    }
  }

  return cssAttrs;
}

/**
 * Group attributes by CSS selector
 */
function groupBySelector(cssAttrs) {
  const grouped = {};

  for (const attr of cssAttrs) {
    if (!grouped[attr.selector]) {
      grouped[attr.selector] = [];
    }
    grouped[attr.selector].push(attr);
  }

  return grouped;
}

/**
 * Generate SCSS partial file for a block
 */
function generateScssPartial(blockType, schema) {
  const cssAttrs = extractCssAttributes(schema);

  if (cssAttrs.length === 0) {
    console.log(`  Warning: No CSS attributes found for ${blockType}`);
    return null;
  }

  const grouped = groupBySelector(cssAttrs);
  const fileName = '_theme-generated.scss';

  let content = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from: schemas/${blockType}.json
 * Generated at: ${getTimestamp()}
 *
 * This file contains CSS variable declarations for themeable properties.
 * Import this file in style.scss: @use 'theme-generated';
 */

`;

  // Generate CSS for each selector
  for (const [selector, attrs] of Object.entries(grouped)) {
    content += `${selector} {\n`;

    for (const attr of attrs) {
      // Add comment with description if available
      if (attr.description) {
        content += `  /* ${attr.description} */\n`;
      }
      content += `  ${attr.property}: var(--${attr.cssVar}, ${attr.default});\n`;
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
        // Load schema
        const schema = loadSchema(blockType);

        // Generate SCSS partial
        const result = generateScssPartial(blockType, schema);

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
