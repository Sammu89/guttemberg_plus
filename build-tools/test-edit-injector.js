/**
 * Test script for edit-styles-injector
 *
 * Loads accordion schema and generates getInlineStyles() function code
 * to verify the generator works correctly.
 */

const fs = require('fs');
const path = require('path');
const { generateEditInlineStyles } = require('./generators/edit-styles-injector');

// Load accordion schema
const schemaPath = path.join(__dirname, '..', 'schemas', 'accordion.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Generate code
console.log('\n========================================');
console.log('  Testing Edit Inline Styles Generator');
console.log('========================================\n');

const generatedCode = generateEditInlineStyles(schema, 'accordion');

console.log('Generated getInlineStyles() function:\n');
console.log('----------------------------------------\n');
console.log(generatedCode);
console.log('----------------------------------------\n');

// Count lines
const lineCount = generatedCode.split('\n').length;
console.log(`\nGenerated ${lineCount} lines of code\n`);

// Save to temporary file for inspection
const outputPath = path.join(__dirname, 'test-output-getInlineStyles.js');
fs.writeFileSync(outputPath, generatedCode);
console.log(`Saved to: ${outputPath}\n`);
