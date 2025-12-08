/**
 * Cross-Schema Validation Script
 *
 * Validates that structure schemas and attribute schemas stay synchronized.
 * This ensures that element references, class names, and style applications
 * remain consistent across the schema system.
 *
 * @version 1.0.0
 * @agent AGENT 3
 */

const fs = require('fs');
const path = require('path');

const BLOCKS = ['accordion', 'tabs', 'toc'];

/**
 * Load and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Object} Parsed JSON object
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ File not found: ${filePath}`);
      console.error(`   Please ensure AGENT 1 and AGENT 2 have completed their tasks.`);
    } else {
      console.error(`❌ Failed to load ${filePath}:`, error.message);
    }
    process.exit(1);
  }
}

/**
 * Validate that a string is a valid CSS identifier
 * @param {string} identifier - The CSS identifier to validate
 * @returns {boolean} True if valid
 */
function isValidCSSIdentifier(identifier) {
  // CSS identifiers must start with a letter, hyphen, or underscore
  // and can contain letters, digits, hyphens, and underscores
  const cssIdentifierRegex = /^-?[a-zA-Z_][\w-]*$/;
  return cssIdentifierRegex.test(identifier);
}

/**
 * Validate that class names are valid CSS identifiers
 * @param {string} className - Space-separated class names
 * @returns {Object} { valid: boolean, invalidClasses: string[] }
 */
function validateCSSClassNames(className) {
  const classes = className.split(/\s+/).filter(c => c.length > 0);
  const invalidClasses = classes.filter(c => !isValidCSSIdentifier(c));

  return {
    valid: invalidClasses.length === 0,
    invalidClasses
  };
}

/**
 * Detect circular dependencies in element hierarchy
 * @param {Map} elements - Map of element ID to element object
 * @param {string} startId - Starting element ID to check
 * @param {Set} visited - Set of visited element IDs
 * @param {Array} path - Current path of element IDs
 * @returns {Object} { hasCircular: boolean, circularPath: string[] }
 */
function detectCircularDependency(elements, startId, visited = new Set(), path = []) {
  if (path.includes(startId)) {
    return {
      hasCircular: true,
      circularPath: [...path, startId]
    };
  }

  if (visited.has(startId)) {
    return { hasCircular: false, circularPath: [] };
  }

  visited.add(startId);
  const element = elements.get(startId);

  if (!element || !element.children) {
    return { hasCircular: false, circularPath: [] };
  }

  const currentPath = [...path, startId];

  for (const childId of element.children) {
    const result = detectCircularDependency(elements, childId, visited, currentPath);
    if (result.hasCircular) {
      return result;
    }
  }

  return { hasCircular: false, circularPath: [] };
}

/**
 * Validate a single block's schemas
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @returns {boolean} True if validation passed
 */
function validateBlock(blockType) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 Validating ${blockType} schemas...`);
  console.log(`${'='.repeat(60)}\n`);

  const basePath = path.join(__dirname, '..');
  const structurePath = path.join(basePath, `schemas/${blockType}-structure.json`);
  const attributesPath = path.join(basePath, `schemas/${blockType}.json`);

  // Load schemas
  const structure = loadJSON(structurePath);
  const attributes = loadJSON(attributesPath);

  const errors = [];
  const warnings = [];

  // Build element map
  const elements = new Map();
  if (structure.elements) {
    Object.entries(structure.elements).forEach(([id, element]) => {
      elements.set(id, element);
    });
  } else {
    errors.push(
      `❌ Structure schema is missing "elements" field!\n` +
      `   Expected structure: { "elements": { ... } }`
    );
    reportResults(blockType, errors, warnings);
    return false;
  }

  // ========================================
  // VALIDATION 1: Structure Schema Integrity
  // ========================================
  console.log('📋 Phase 1: Validating structure schema integrity...\n');

  // Check for root element
  if (!structure.root) {
    errors.push(
      `❌ Structure schema is missing "root" field!\n` +
      `   The root field should specify the root element ID.`
    );
  } else if (!elements.has(structure.root)) {
    errors.push(
      `❌ Root element "${structure.root}" doesn't exist in elements!\n` +
      `   Available elements: ${Array.from(elements.keys()).join(', ')}`
    );
  }

  // Validate all children references exist
  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.children) {
      element.children.forEach(childId => {
        if (!elements.has(childId)) {
          errors.push(
            `❌ Element "${id}" references child "${childId}" that doesn't exist!\n` +
            `   Available elements: ${Array.from(elements.keys()).join(', ')}\n` +
            `   Fix: Either add "${childId}" to elements or remove it from "${id}.children"`
          );
        }
      });
    }
  });

  // Validate CSS class names
  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.className) {
      const validation = validateCSSClassNames(element.className);
      if (!validation.valid) {
        errors.push(
          `❌ Element "${id}" has invalid CSS class name(s): ${validation.invalidClasses.join(', ')}\n` +
          `   Class names must start with a letter, hyphen, or underscore\n` +
          `   and can only contain letters, digits, hyphens, and underscores.`
        );
      }
    }
  });

  // Check for circular dependencies
  const visited = new Set();
  elements.forEach((element, id) => {
    if (!visited.has(id)) {
      const result = detectCircularDependency(elements, id);
      if (result.hasCircular) {
        errors.push(
          `❌ Circular dependency detected in element hierarchy!\n` +
          `   Path: ${result.circularPath.join(' → ')}\n` +
          `   Fix: Remove one of the parent-child relationships in this cycle.`
        );
      }
    }
  });

  // ========================================
  // VALIDATION 2: Attribute Schema Integrity
  // ========================================
  console.log('📋 Phase 2: Validating attribute schema integrity...\n');

  if (!attributes.attributes) {
    errors.push(
      `❌ Attribute schema is missing "attributes" field!\n` +
      `   Expected structure: { "attributes": { ... } }`
    );
  } else {
    // Check all themeable attributes have appliesTo
    Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
      if (attr.themeable) {
        if (!attr.appliesTo) {
          errors.push(
            `❌ Attribute "${attrName}" is themeable but missing "appliesTo" field!\n` +
            `   All themeable attributes must specify which element they apply to.\n` +
            `   Fix: Add "appliesTo": "elementId" to this attribute.`
          );
        }

        // Check for deprecated cssSelector field
        if (attr.cssSelector) {
          warnings.push(
            `⚠️  Attribute "${attrName}" has deprecated "cssSelector" field: "${attr.cssSelector}"\n` +
            `   This field should be removed in favor of "appliesTo".\n` +
            `   Fix: Remove "cssSelector" and ensure "appliesTo" is set correctly.`
          );
        }

        // Validate cssVar and cssProperty exist
        if (!attr.cssVar) {
          errors.push(
            `❌ Themeable attribute "${attrName}" is missing "cssVar" field!\n` +
            `   Fix: Add "cssVar": "variable-name" to this attribute.`
          );
        }

        if (!attr.cssProperty) {
          errors.push(
            `❌ Themeable attribute "${attrName}" is missing "cssProperty" field!\n` +
            `   Fix: Add "cssProperty": "css-property" to this attribute.`
          );
        }
      }
    });
  }

  // ========================================
  // VALIDATION 3: Cross-Schema References (Attributes → Structure)
  // ========================================
  console.log('📋 Phase 3: Validating attribute → structure references...\n');

  if (attributes.attributes) {
    Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
      if (attr.appliesTo) {
        if (!elements.has(attr.appliesTo)) {
          const similarElements = findSimilarElementIds(attr.appliesTo, elements);
          let suggestion = '';
          if (similarElements.length > 0) {
            suggestion = `\n   Did you mean: ${similarElements.join(', ')}?`;
          }

          errors.push(
            `❌ Attribute "${attrName}" applies to element "${attr.appliesTo}" ` +
            `but that element doesn't exist in structure!\n` +
            `   Available elements: ${Array.from(elements.keys()).join(', ')}${suggestion}\n` +
            `   Fix: Change "appliesTo" to a valid element ID or add the element to structure.`
          );
        }
      }
    });
  }

  // ========================================
  // VALIDATION 4: Cross-Schema References (Structure → Attributes)
  // ========================================
  console.log('📋 Phase 4: Validating structure → attribute references...\n');

  const attributeNames = attributes.attributes ? Object.keys(attributes.attributes) : [];

  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.appliesStyles) {
      element.appliesStyles.forEach(attrName => {
        if (!attributeNames.includes(attrName)) {
          const similarAttrs = findSimilarAttributeNames(attrName, attributeNames);
          let suggestion = '';
          if (similarAttrs.length > 0) {
            suggestion = `\n   Did you mean: ${similarAttrs.join(', ')}?`;
          }

          errors.push(
            `❌ Element "${id}" applies attribute "${attrName}" ` +
            `but that attribute doesn't exist in attribute schema!${suggestion}\n` +
            `   Fix: Either add "${attrName}" to attributes or remove it from "${id}.appliesStyles"`
          );
        }
      });
    }
  });

  // ========================================
  // VALIDATION 5: Bidirectional Consistency
  // ========================================
  console.log('📋 Phase 5: Validating bidirectional consistency...\n');

  if (attributes.attributes) {
    Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
      if (attr.themeable && attr.appliesTo) {
        const element = elements.get(attr.appliesTo);

        if (element) {
          if (!element.appliesStyles || !element.appliesStyles.includes(attrName)) {
            warnings.push(
              `⚠️  Attribute "${attrName}" applies to element "${attr.appliesTo}" ` +
              `but "${attr.appliesTo}.appliesStyles" doesn't include "${attrName}"\n` +
              `   This may cause the style not to be generated in CSS.\n` +
              `   Fix: Add "${attrName}" to the appliesStyles array of element "${attr.appliesTo}"`
            );
          }
        }
      }
    });
  }

  // Also check the reverse: elements listing attributes that don't apply to them
  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.appliesStyles && attributes.attributes) {
      element.appliesStyles.forEach(attrName => {
        const attr = attributes.attributes[attrName];
        if (attr && attr.appliesTo && attr.appliesTo !== id) {
          warnings.push(
            `⚠️  Element "${id}" lists "${attrName}" in appliesStyles ` +
            `but "${attrName}.appliesTo" is "${attr.appliesTo}", not "${id}"\n` +
            `   This creates inconsistent bidirectional references.\n` +
            `   Fix: Either change "${attrName}.appliesTo" to "${id}" or ` +
            `remove "${attrName}" from "${id}.appliesStyles"`
          );
        }
      });
    }
  });

  // ========================================
  // REPORT RESULTS
  // ========================================
  return reportResults(blockType, errors, warnings);
}

/**
 * Find element IDs similar to the target (for suggestions)
 * @param {string} target - The target element ID
 * @param {Map} elements - Map of element IDs
 * @returns {string[]} Array of similar element IDs
 */
function findSimilarElementIds(target, elements) {
  const elementIds = Array.from(elements.keys());
  return elementIds.filter(id => {
    const distance = levenshteinDistance(target.toLowerCase(), id.toLowerCase());
    return distance <= 3; // Similar if edit distance is 3 or less
  }).slice(0, 3); // Return top 3 suggestions
}

/**
 * Find attribute names similar to the target (for suggestions)
 * @param {string} target - The target attribute name
 * @param {string[]} attributeNames - Array of attribute names
 * @returns {string[]} Array of similar attribute names
 */
function findSimilarAttributeNames(target, attributeNames) {
  return attributeNames.filter(name => {
    const distance = levenshteinDistance(target.toLowerCase(), name.toLowerCase());
    return distance <= 3; // Similar if edit distance is 3 or less
  }).slice(0, 3); // Return top 3 suggestions
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Report validation results
 * @param {string} blockType - The block type
 * @param {string[]} errors - Array of error messages
 * @param {string[]} warnings - Array of warning messages
 * @returns {boolean} True if validation passed (no errors)
 */
function reportResults(blockType, errors, warnings) {
  console.log(`${'─'.repeat(60)}\n`);

  if (warnings.length > 0) {
    console.log(`⚠️  Warnings (${warnings.length}):\n`);
    warnings.forEach((warn, index) => {
      console.log(`${index + 1}. ${warn}\n`);
    });
    console.log(`${'─'.repeat(60)}\n`);
  }

  if (errors.length > 0) {
    console.error(`❌ Validation FAILED (${errors.length} error${errors.length > 1 ? 's' : ''}):\n`);
    errors.forEach((err, index) => {
      console.error(`${index + 1}. ${err}\n`);
    });
    console.error(`${'─'.repeat(60)}\n`);
    console.error(`❌ ${blockType}: FAILED\n`);
    return false;
  } else {
    console.log(`✅ ${blockType}: All validations PASSED!`);
    if (warnings.length > 0) {
      console.log(`   (with ${warnings.length} warning${warnings.length > 1 ? 's' : ''})`);
    }
    console.log();
    return true;
  }
}

/**
 * Print summary statistics
 * @param {Object} results - Validation results for all blocks
 */
function printSummary(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.blockType.padEnd(12)} - ${result.passed ? 'PASSED' : 'FAILED'}`);
  });

  console.log('\n' + '─'.repeat(60));
  console.log(`Total: ${results.length} blocks | Passed: ${passed} | Failed: ${failed}`);
  console.log('─'.repeat(60) + '\n');
}

// ========================================
// MAIN EXECUTION
// ========================================

console.log('\n' + '█'.repeat(60));
console.log('█  CROSS-SCHEMA VALIDATION                                 █');
console.log('█  Validating structure ↔ attribute schema consistency     █');
console.log('█'.repeat(60));

const results = [];
let allValid = true;

BLOCKS.forEach(blockType => {
  const valid = validateBlock(blockType);
  results.push({ blockType, passed: valid });
  if (!valid) {
    allValid = false;
  }
});

printSummary(results);

if (!allValid) {
  console.error('❌ Schema validation FAILED for one or more blocks!');
  console.error('   Please fix the errors above before proceeding.\n');
  process.exit(1);
} else {
  console.log('✅ All schema validations PASSED!');
  console.log('   Structure and attribute schemas are fully synchronized.\n');
  process.exit(0);
}
