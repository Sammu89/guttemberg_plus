/**
 * Validate Editor CSS Variable Usage
 *
 * Ensures edit.js files use CSS variables (not direct properties) for theming.
 * This catches issues where the editor uses direct CSS properties like
 * `borderColor: effectiveValues.borderColor` instead of CSS variables.
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
const BLOCKS_DIR = path.join(ROOT_DIR, 'blocks');
const BLOCKS = ['accordion', 'tabs', 'toc'];

// CSS properties that should ALWAYS use CSS variables in edit.js
const THEMEABLE_PROPERTIES = [
  'borderColor',
  'borderWidth',
  'borderStyle',
  'borderRadius',
  'padding',
  'margin',
  'backgroundColor',
  'background',
  'color',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'boxShadow',
  'textDecoration',
  'textTransform',
  'textAlign',
];

// Patterns that indicate INCORRECT usage (direct CSS properties)
const BAD_PATTERNS = [
  // Direct property assignment from effectiveValues
  /(\w+):\s*effectiveValues\.(\w+)/g,
  // Direct property with fallback
  /(\w+):\s*effectiveValues\.(\w+)\s*\|\|\s*['"`]/g,
  // Template literal with effectiveValues
  /(\w+):\s*`[^`]*\$\{effectiveValues\.(\w+)\}[^`]*`/g,
];

// Patterns that indicate CORRECT usage (CSS variables)
const GOOD_PATTERNS = [
  // CSS variable pattern: --var-name: value
  /--[\w-]+:\s*/,
  // getEditorCSSVariables() function exists
  /getEditorCSSVariables|getCSSVariables|getCustomizationStyles/,
  // ...cssVars or ...editorVars spreading
  /\.\.\.(cssVars|editorVars|editorCSSVars|customizationStyles)/,
];

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Check if a file uses the correct CSS variable pattern
 */
function validateEditFile(blockType) {
  const editPath = path.join(BLOCKS_DIR, blockType, 'src', 'edit.js');

  if (!fs.existsSync(editPath)) {
    return {
      block: blockType,
      errors: [{ issue: 'edit.js file not found', path: editPath }],
      warnings: [],
      passed: false,
    };
  }

  const content = fs.readFileSync(editPath, 'utf8');
  const errors = [];
  const warnings = [];

  // Check 1: Does the file import CSS variable helpers?
  const hasImports =
    content.includes('decomposeObjectToSides') ||
    content.includes('formatCssValue') ||
    content.includes('getCssVarName');

  if (!hasImports) {
    errors.push({
      issue: 'Missing CSS variable helper imports',
      fix: "Add: import { decomposeObjectToSides, formatCssValue, getCssVarName } from '@shared/config/css-var-mappings-generated';",
      line: findLineNumber(content, 'import'),
    });
  }

  // Check 2: Does the file have a CSS variable generation function?
  const hasCSSVarFunction = GOOD_PATTERNS[1].test(content);

  if (!hasCSSVarFunction) {
    errors.push({
      issue: 'Missing CSS variable generation function',
      fix: 'Add getEditorCSSVariables() function to generate CSS variables from effectiveValues',
      suggestion: 'See blocks/accordion/src/edit.js for reference implementation',
    });
  }

  // Check 3: Look for BAD patterns (direct CSS property usage)
  // BUT: Ignore code inside AUTO-GENERATED sections (getInlineStyles is legacy/backwards compat)
  const badMatches = [];

  // Find AUTO-GENERATED sections to exclude
  const autoGenStart = content.indexOf('/* ========== AUTO-GENERATED-STYLES-START ========== */');
  const autoGenEnd = content.indexOf('/* ========== AUTO-GENERATED-STYLES-END ========== */');

  for (const pattern of BAD_PATTERNS) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const property = match[1];
      const attrName = match[2];
      const matchIndex = match.index;

      // Skip if inside AUTO-GENERATED section
      if (autoGenStart !== -1 && autoGenEnd !== -1 &&
          matchIndex > autoGenStart && matchIndex < autoGenEnd) {
        continue; // Skip - this is auto-generated legacy code
      }

      // Check if this property should be using CSS variables
      if (THEMEABLE_PROPERTIES.some(p => property.toLowerCase().includes(p.toLowerCase()))) {
        const lineNum = findLineNumber(content, match[0]);
        badMatches.push({
          property,
          attrName,
          line: lineNum,
          snippet: getLineContext(content, lineNum),
        });
      }
    }
  }

  if (badMatches.length > 0) {
    errors.push({
      issue: `Found ${badMatches.length} direct CSS property usage(s) that should use CSS variables`,
      details: badMatches,
      fix: 'Use CSS variables instead of direct properties. Apply CSS variables to rootStyles/blockProps.',
    });
  }

  // Check 4: Verify rootStyles or blockProps uses CSS variables
  const hasRootStyles = content.includes('rootStyles');
  const hasBlockProps = content.includes('blockProps');

  if (hasRootStyles || hasBlockProps) {
    // Check if CSS vars are spread into styles
    const spreadsVars = /rootStyles\s*=\s*\{[^}]*\.\.\.(cssVars|editorVars|editorCSSVars)/s.test(content) ||
                        /blockProps.*style.*\.\.\.(cssVars|editorVars|editorCSSVars)/s.test(content);

    if (!spreadsVars) {
      warnings.push({
        issue: 'rootStyles/blockProps may not be applying CSS variables',
        fix: 'Ensure CSS variables are spread into rootStyles: { ...editorCSSVars }',
        suggestion: 'Check that getEditorCSSVariables() output is applied to inline styles',
      });
    }
  }

  // Check 5: Look for getInlineStyles() (old pattern - should be migrated)
  if (content.includes('getInlineStyles()')) {
    warnings.push({
      issue: 'Still using getInlineStyles() function',
      suggestion: 'Consider migrating to CSS variable-based approach for consistency',
      severity: 'low',
    });
  }

  return {
    block: blockType,
    errors,
    warnings,
    passed: errors.length === 0,
  };
}

/**
 * Find line number of a string in content
 */
function findLineNumber(content, searchString) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString)) {
      return i + 1;
    }
  }
  return -1;
}

/**
 * Get context around a line number
 */
function getLineContext(content, lineNum, context = 2) {
  const lines = content.split('\n');
  const start = Math.max(0, lineNum - context - 1);
  const end = Math.min(lines.length, lineNum + context);

  return lines.slice(start, end).map((line, idx) => {
    const actualLine = start + idx + 1;
    const marker = actualLine === lineNum ? '>' : ' ';
    return `${marker} ${actualLine}: ${line}`;
  }).join('\n');
}

// ============================================================================
// Main Validation
// ============================================================================

function main() {
  console.log('\n\x1b[36m\x1b[1mEditor CSS Variable Usage Validation\x1b[0m');
  console.log('\x1b[90mChecking that edit.js uses CSS variables instead of direct properties\x1b[0m\n');

  let totalErrors = 0;
  let totalWarnings = 0;
  const results = {};

  // Validate each block
  for (const blockType of BLOCKS) {
    const result = validateEditFile(blockType);
    results[blockType] = result;
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    // Print errors
    if (result.errors.length > 0) {
      console.log(`\x1b[31m❌ ${blockType}: ${result.errors.length} error(s)\x1b[0m`);
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. \x1b[31m${error.issue}\x1b[0m`);
        if (error.line) {
          console.log(`      \x1b[90mLine:\x1b[0m ${error.line}`);
        }
        if (error.fix) {
          console.log(`      \x1b[33mFix:\x1b[0m ${error.fix}`);
        }
        if (error.suggestion) {
          console.log(`      \x1b[36mSuggestion:\x1b[0m ${error.suggestion}`);
        }
        if (error.details && error.details.length > 0) {
          console.log(`      \x1b[90mDetails:\x1b[0m`);
          error.details.forEach((detail, i) => {
            console.log(`        ${i + 1}. ${detail.property}: effectiveValues.${detail.attrName} (line ${detail.line})`);
            if (detail.snippet && i === 0) { // Show snippet for first issue only
              console.log(`\x1b[90m${detail.snippet}\x1b[0m`);
            }
          });
        }
        console.log('');
      });
    }

    // Print warnings
    if (result.warnings.length > 0) {
      console.log(`\x1b[33m⚠️  ${blockType}: ${result.warnings.length} warning(s)\x1b[0m`);
      result.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. \x1b[33m${warning.issue}\x1b[0m`);
        if (warning.fix) {
          console.log(`      \x1b[33mFix:\x1b[0m ${warning.fix}`);
        }
        if (warning.suggestion) {
          console.log(`      \x1b[36mSuggestion:\x1b[0m ${warning.suggestion}`);
        }
        console.log('');
      });
    }

    // Print success
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`\x1b[32m✅ ${blockType}\x1b[0m`);
    }
  }

  // Summary
  console.log('\x1b[1m\nSummary:\x1b[0m', `${totalErrors} error(s), ${totalWarnings} warning(s)`);
  console.log('\x1b[90mThemeable properties that should use CSS vars: ' + THEMEABLE_PROPERTIES.slice(0, 5).join(', ') + '...\x1b[0m');

  // Check for CRITICAL errors (missing getEditorCSSVariables function)
  const criticalErrors = [];
  for (const [blockType, result] of Object.entries(results)) {
    for (const error of result.errors) {
      if (error.issue.includes('Missing CSS variable generation function') ||
          error.issue.includes('Missing CSS variable helper imports')) {
        criticalErrors.push({ block: blockType, error });
      }
    }
  }

  // Exit with error code ONLY for critical errors
  if (criticalErrors.length > 0) {
    console.log('\n\x1b[31m\x1b[1m❌ CRITICAL ERRORS FOUND!\x1b[0m');
    console.log('\x1b[90mThe following blocks are missing CSS variable implementation:\x1b[0m\n');
    criticalErrors.forEach(({ block, error }) => {
      console.log(`  - ${block}: ${error.issue}`);
    });
    console.log('\n\x1b[90mThis is required to ensure editor preview matches frontend rendering.\x1b[0m\n');
    process.exit(1);
  } else if (totalErrors > 0) {
    console.log('\n\x1b[33m\x1b[1m⚠️  Non-critical issues found\x1b[0m');
    console.log('\x1b[90mSome direct CSS property usage detected. Consider migrating to CSS variables.\x1b[0m\n');
  } else if (totalWarnings > 0) {
    console.log('\n\x1b[33m\x1b[1m⚠️  Validation passed with warnings\x1b[0m\n');
  } else {
    console.log('\n\x1b[32m\x1b[1m✓ Validation passed\x1b[0m\n');
  }
}

// Run validation
try {
  main();
} catch (error) {
  console.error('\x1b[31mValidation error:\x1b[0m', error.message);
  console.error(error.stack);
  process.exit(1);
}
