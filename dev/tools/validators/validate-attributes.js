/**
 * Validate Generated Attributes
 *
 * This script validates that the generated block attributes match the comprehensive schemas
 * and contain all required special attributes without duplicates.
 *
 * @package Guttemberg Plus
 * @since 2.0.0
 */

const blocks = ['accordion', 'tabs', 'toc'];

console.log('='.repeat(60));
console.log('Validating Generated Block Attributes');
console.log('='.repeat(60));

let allGood = true;
let totalIssues = 0;

blocks.forEach(block => {
	const schema = require(`../../schemas/generated/${block}.json`);
	const attrs = require(`../../blocks/${block}/attributes.js`)[`${block}Attributes`];

	console.log(`\n${block.toUpperCase()}:`);
	console.log(`  Schema attributes: ${Object.keys(schema.attributes).length}`);
	console.log(`  Block attributes: ${Object.keys(attrs).length}`);

	// Count special attributes that should be added
	const specialAttrs = ['currentTheme', 'customizations', `${block}Id`];
	const schemaHasSpecial = specialAttrs.filter(attr => attr in schema.attributes);
	const expectedTotal = Object.keys(schema.attributes).length + (specialAttrs.length - schemaHasSpecial.length);

	console.log(`  Expected total: ${expectedTotal} (schema + ${specialAttrs.length - schemaHasSpecial.length} special attributes)`);
	console.log(`  Match: ${expectedTotal === Object.keys(attrs).length ? '✓' : '✗'}`);

	// Check special attributes
	const hasCurrentTheme = 'currentTheme' in attrs;
	const hasCustomizations = 'customizations' in attrs;
	const hasBlockId = `${block}Id` in attrs;

	console.log(`  Has currentTheme: ${hasCurrentTheme ? '✓' : '✗'}`);
	console.log(`  Has customizations: ${hasCustomizations ? '✓' : '✗'}`);
	console.log(`  Has ${block}Id: ${hasBlockId ? '✓' : '✗'}`);

	if (!hasCurrentTheme || !hasCustomizations || !hasBlockId) {
		allGood = false;
		totalIssues++;
	}

	// Check for duplicates
	const keys = Object.keys(attrs);
	const unique = new Set(keys);
	const hasDuplicates = keys.length !== unique.size;
	console.log(`  Has duplicates: ${hasDuplicates ? '✗' : '✓ No'}`);

	if (hasDuplicates) {
		allGood = false;
		totalIssues++;
		// Find duplicates
		const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
		console.log(`    Duplicates: ${duplicates.join(', ')}`);
	}

	// Check format (all should be strings with quotes)
	const unquotedKeys = keys.filter(k => !k.match(/^[a-zA-Z0-9-]+$/));
	if (unquotedKeys.length > 0) {
		console.log(`  ✗ Invalid key format: ${unquotedKeys.length} keys`);
		allGood = false;
		totalIssues++;
	} else {
		console.log(`  ✓ All keys properly formatted`);
	}

	// Sample attributes (first 3)
	console.log(`  Sample attributes:`);
	keys.slice(0, 3).forEach(k => {
		console.log(`    - ${k}: ${attrs[k].type} = ${JSON.stringify(attrs[k].default).substring(0, 30)}...`);
	});
});

console.log('\n' + '='.repeat(60));
if (allGood) {
	console.log('✓ ALL VALIDATION CHECKS PASSED!');
	console.log('  - All attributes generated correctly');
	console.log('  - All special attributes present');
	console.log('  - No duplicates found');
	console.log('  - All keys properly formatted');
} else {
	console.log(`✗ VALIDATION FAILED! (${totalIssues} issues found)`);
	process.exit(1);
}
console.log('='.repeat(60));
