#!/usr/bin/env node

/**
 * Theme System Test Suite
 *
 * Tests the theme system with new flat/atomic attributes to ensure:
 * - Delta calculation works correctly
 * - Theme application works correctly
 * - Customization detection works correctly
 * - Cascade resolution works correctly
 *
 * Run: node tools/test-theme-system.js
 */

import { calculateDeltas, applyDeltas, getThemeableSnapshot } from '../shared/utils/delta-calculator.js';
import { getAllEffectiveValues, getEffectiveValue, isCustomizedFromDefaults } from '../shared/theme-system/cascade-resolver.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load accordion schema for testing
const schemaPath = join(__dirname, '..', 'schemas', 'generated', 'accordion.json');
const accordionSchema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

console.log('🧪 Theme System Test Suite\n');
console.log('Testing theme system with flat/atomic attributes...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
	if (condition) {
		console.log(`  ✅ ${message}`);
		testsPassed++;
	} else {
		console.log(`  ❌ ${message}`);
		testsFailed++;
	}
}

function assertEquals(actual, expected, message) {
	const condition = JSON.stringify(actual) === JSON.stringify(expected);
	if (condition) {
		console.log(`  ✅ ${message}`);
		testsPassed++;
	} else {
		console.log(`  ❌ ${message}`);
		console.log(`     Expected:`, expected);
		console.log(`     Actual:`, actual);
		testsFailed++;
	}
}

// =============================================================================
// Test 1: Delta Calculation with Flat Attributes
// =============================================================================
console.log('Test 1: Delta Calculation with Flat Attributes');
console.log('─'.repeat(60));

const defaults1 = {
	'block-box-border-width-top': '1px',
	'block-box-border-width-right': '1px',
	'header-background-color': '#ffffff',
	'header-text-color': '#333333',
	'header-padding-top': '12px',
};

const snapshot1 = {
	'block-box-border-width-top': '2px',      // Different
	'block-box-border-width-right': '1px',    // Same (should be excluded)
	'header-background-color': '#ffffff',     // Same (should be excluded)
	'header-text-color': '#ff0000',           // Different
	'header-padding-top': '16px',             // Different
};

const deltas1 = calculateDeltas(snapshot1, defaults1, []);

assert(
	Object.keys(deltas1).length === 3,
	`Should calculate 3 deltas (got ${Object.keys(deltas1).length})`
);

assertEquals(
	deltas1['block-box-border-width-top'],
	'2px',
	`Delta for 'block-box-border-width-top' should be '2px'`
);

assertEquals(
	deltas1['header-text-color'],
	'#ff0000',
	`Delta for 'header-text-color' should be '#ff0000'`
);

assert(
	!deltas1.hasOwnProperty('header-background-color'),
	`Should NOT include 'header-background-color' (matches default)`
);

console.log('\n');

// =============================================================================
// Test 2: Delta Calculation with Exclusions
// =============================================================================
console.log('Test 2: Delta Calculation with Exclusions');
console.log('─'.repeat(60));

const snapshot2 = {
	'block-box-border-width-top': '2px',
	'header-text-color': '#ff0000',
	'accordion-id': 'test-123',               // Should be excluded
	'current-theme': 'My Theme',              // Should be excluded
};

const defaults2 = {
	'block-box-border-width-top': '1px',
	'header-text-color': '#333333',
	'accordion-id': '',
	'current-theme': '',
};

const exclude2 = ['accordion-id', 'current-theme'];
const deltas2 = calculateDeltas(snapshot2, defaults2, exclude2);

assert(
	Object.keys(deltas2).length === 2,
	`Should calculate 2 deltas (got ${Object.keys(deltas2).length})`
);

assert(
	!deltas2.hasOwnProperty('accordion-id'),
	`Should NOT include 'accordion-id' (excluded)`
);

assert(
	!deltas2.hasOwnProperty('current-theme'),
	`Should NOT include 'current-theme' (excluded)`
);

console.log('\n');

// =============================================================================
// Test 3: Apply Deltas (Theme Application)
// =============================================================================
console.log('Test 3: Apply Deltas (Theme Application)');
console.log('─'.repeat(60));

const baseDefaults3 = {
	'block-box-border-width-top': '1px',
	'header-background-color': '#ffffff',
	'header-text-color': '#333333',
	'header-padding-top': '12px',
};

const themeDeltas3 = {
	'block-box-border-width-top': '2px',      // Override
	'header-text-color': '#ff0000',           // Override
};

const result3 = applyDeltas(baseDefaults3, themeDeltas3);

assertEquals(
	result3['block-box-border-width-top'],
	'2px',
	`Applied value should be from theme delta`
);

assertEquals(
	result3['header-background-color'],
	'#ffffff',
	`Applied value should be from defaults (not in theme)`
);

assertEquals(
	result3['header-text-color'],
	'#ff0000',
	`Applied value should be from theme delta`
);

assert(
	Object.keys(result3).length === 4,
	`Result should have 4 attributes (got ${Object.keys(result3).length})`
);

console.log('\n');

// =============================================================================
// Test 4: Get Themeable Snapshot
// =============================================================================
console.log('Test 4: Get Themeable Snapshot');
console.log('─'.repeat(60));

const attributes4 = {
	'block-box-border-width-top': '2px',
	'header-text-color': '#ff0000',
	'accordion-id': 'test-123',               // Should be excluded
	'current-theme': 'My Theme',              // Should be excluded
	'customizations': {},                     // Should be excluded
};

const exclude4 = ['accordion-id', 'current-theme', 'customizations'];
const snapshot4 = getThemeableSnapshot(attributes4, exclude4);

assert(
	Object.keys(snapshot4).length === 2,
	`Snapshot should have 2 attributes (got ${Object.keys(snapshot4).length})`
);

assert(
	snapshot4.hasOwnProperty('block-box-border-width-top'),
	`Snapshot should include 'block-box-border-width-top'`
);

assert(
	!snapshot4.hasOwnProperty('accordion-id'),
	`Snapshot should NOT include 'accordion-id'`
);

console.log('\n');

// =============================================================================
// Test 5: Cascade Resolution (Effective Values)
// =============================================================================
console.log('Test 5: Cascade Resolution (Effective Values)');
console.log('─'.repeat(60));

const attributes5 = {
	'block-box-border-width-top': '3px',      // Block-level override
};

const theme5 = {
	'header-text-color': '#ff0000',           // Theme-level value
};

const defaults5 = {
	'block-box-border-width-top': '1px',
	'header-text-color': '#333333',
	'header-padding-top': '12px',             // Only in defaults
};

const effectiveValues5 = getAllEffectiveValues(attributes5, theme5, defaults5);

assertEquals(
	effectiveValues5['block-box-border-width-top'],
	'3px',
	`Effective value should come from block (highest priority)`
);

assertEquals(
	effectiveValues5['header-text-color'],
	'#ff0000',
	`Effective value should come from theme (medium priority)`
);

assertEquals(
	effectiveValues5['header-padding-top'],
	'12px',
	`Effective value should come from defaults (lowest priority)`
);

console.log('\n');

// =============================================================================
// Test 6: Customization Detection
// =============================================================================
console.log('Test 6: Customization Detection');
console.log('─'.repeat(60));

const attributes6 = {
	'block-box-border-width-top': '2px',      // Differs from both
	'header-text-color': '#ff0000',           // Matches theme
	'header-padding-top': '12px',             // Matches default
};

const theme6 = {
	'header-text-color': '#ff0000',
};

const defaults6 = {
	'block-box-border-width-top': '1px',
	'header-text-color': '#333333',
	'header-padding-top': '12px',
};

const isCustomized1 = isCustomizedFromDefaults(
	'block-box-border-width-top',
	attributes6,
	theme6,
	defaults6
);

assert(
	isCustomized1 === true,
	`'block-box-border-width-top' should be detected as customized`
);

const isCustomized2 = isCustomizedFromDefaults(
	'header-text-color',
	attributes6,
	theme6,
	defaults6
);

assert(
	isCustomized2 === false,
	`'header-text-color' should NOT be detected as customized (matches theme)`
);

const isCustomized3 = isCustomizedFromDefaults(
	'header-padding-top',
	attributes6,
	theme6,
	defaults6
);

assert(
	isCustomized3 === false,
	`'header-padding-top' should NOT be detected as customized (matches default)`
);

console.log('\n');

// =============================================================================
// Test 7: Schema Default Values
// =============================================================================
console.log('Test 7: Schema Default Values');
console.log('─'.repeat(60));

assert(
	accordionSchema.defaultValues !== undefined,
	`Schema should have defaultValues property`
);

assert(
	typeof accordionSchema.defaultValues === 'object',
	`defaultValues should be an object`
);

assert(
	Object.keys(accordionSchema.defaultValues).length > 0,
	`defaultValues should not be empty (got ${Object.keys(accordionSchema.defaultValues).length} defaults)`
);

// Check that defaults use flat/atomic format
const firstKey = Object.keys(accordionSchema.defaultValues)[0];
assert(
	typeof firstKey === 'string' && firstKey.includes('-'),
	`Default keys should use kebab-case format (got '${firstKey}')`
);

assert(
	typeof accordionSchema.defaultValues[firstKey] !== 'object' ||
	accordionSchema.defaultValues[firstKey] === null,
	`Default values should be primitives (strings, numbers, booleans), not objects`
);

console.log('\n');

// =============================================================================
// Test 8: Complete Theme Workflow
// =============================================================================
console.log('Test 8: Complete Theme Workflow (Create → Apply → Customize)');
console.log('─'.repeat(60));

// Step 1: User creates block with default values
const blockDefaults = {
	'block-box-border-width-top': '1px',
	'header-background-color': '#ffffff',
	'header-text-color': '#333333',
};

console.log('  Step 1: Block created with defaults');

// Step 2: User customizes some values
const customizedBlock = {
	'block-box-border-width-top': '2px',      // Changed
	'header-background-color': '#ff0000',     // Changed
	'header-text-color': '#333333',           // Same
};

console.log('  Step 2: User customizes border and background');

// Step 3: User saves as theme (delta calculation)
const themeDelta = calculateDeltas(customizedBlock, blockDefaults, []);

assert(
	Object.keys(themeDelta).length === 2,
	`Theme should store only 2 deltas (changed values)`
);

console.log(`  Step 3: Theme saved with ${Object.keys(themeDelta).length} deltas`);

// Step 4: User creates new block and applies theme
const newBlockValues = applyDeltas(blockDefaults, themeDelta);

assertEquals(
	newBlockValues['block-box-border-width-top'],
	'2px',
	`New block should have themed border width`
);

assertEquals(
	newBlockValues['header-background-color'],
	'#ff0000',
	`New block should have themed background color`
);

console.log('  Step 4: Theme applied to new block successfully');

// Step 5: User customizes themed block
const customizedThemedBlock = {
	...newBlockValues,
	'header-text-color': '#0000ff',           // New customization
};

const customizationDelta = calculateDeltas(customizedThemedBlock, newBlockValues, []);

assert(
	Object.keys(customizationDelta).length === 1,
	`Should detect 1 customization`
);

assert(
	customizationDelta['header-text-color'] === '#0000ff',
	`Customization should be detected`
);

console.log('  Step 5: Customization detected successfully');

console.log('\n');

// =============================================================================
// Summary
// =============================================================================
console.log('═'.repeat(60));
console.log('Test Summary');
console.log('═'.repeat(60));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);

if (testsFailed === 0) {
	console.log('\n✅ All tests passed! Theme system is working correctly with flat attributes.');
	process.exit(0);
} else {
	console.log(`\n❌ ${testsFailed} test(s) failed. Please review the output above.`);
	process.exit(1);
}
