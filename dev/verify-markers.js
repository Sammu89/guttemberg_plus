/**
 * Marker Verification Script
 *
 * Checks that all marker comments are correctly placed in the 6 files
 */

const fs = require('fs');
const path = require('path');

const files = [
	{
		path: 'blocks/accordion/src/edit.js',
		markerType: 'STYLES',
		blockType: 'accordion'
	},
	{
		path: 'blocks/accordion/src/save.js',
		markerType: 'CUSTOMIZATION-STYLES',
		blockType: 'accordion'
	},
	{
		path: 'blocks/tabs/src/edit.js',
		markerType: 'STYLES',
		blockType: 'tabs'
	},
	{
		path: 'blocks/tabs/src/save.js',
		markerType: 'CUSTOMIZATION-STYLES',
		blockType: 'tabs'
	},
	{
		path: 'blocks/toc/src/edit.js',
		markerType: 'STYLES',
		blockType: 'toc'
	},
	{
		path: 'blocks/toc/src/save.js',
		markerType: 'CUSTOMIZATION-STYLES',
		blockType: 'toc'
	}
];

const START_MARKER = 'AUTO-GENERATED-';
const END_MARKER = '-END';

console.log('='.repeat(70));
console.log('MARKER VERIFICATION REPORT');
console.log('='.repeat(70));
console.log('');

let allValid = true;

files.forEach(file => {
	const fullPath = path.join(__dirname, file.path);
	const content = fs.readFileSync(fullPath, 'utf-8');

	const startMarker = `/* ========== ${START_MARKER}${file.markerType}-START ========== */`;
	const endMarker = `/* ========== ${START_MARKER}${file.markerType}${END_MARKER} ========== */`;

	const hasStart = content.includes(startMarker);
	const hasEnd = content.includes(endMarker);

	// Count occurrences
	const startCount = (content.match(new RegExp(startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
	const endCount = (content.match(new RegExp(endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

	// Extract code between markers
	let extractedCode = '';
	if (hasStart && hasEnd) {
		const startIdx = content.indexOf(startMarker) + startMarker.length;
		const endIdx = content.indexOf(endMarker);
		extractedCode = content.substring(startIdx, endIdx);
	}

	const status = hasStart && hasEnd && startCount === 1 && endCount === 1 ? '✓ VALID' : '✗ INVALID';
	const isValid = hasStart && hasEnd && startCount === 1 && endCount === 1;

	if (!isValid) {
		allValid = false;
	}

	console.log(`File: ${file.path}`);
	console.log(`  Marker Type: ${file.markerType}`);
	console.log(`  Status: ${status}`);
	console.log(`  Start Marker: ${hasStart ? 'Found' : 'Missing'} (${startCount} occurrence${startCount !== 1 ? 's' : ''})`);
	console.log(`  End Marker: ${hasEnd ? 'Found' : 'Missing'} (${endCount} occurrence${endCount !== 1 ? 's' : ''})`);

	if (isValid) {
		const lines = extractedCode.split('\n').length;
		console.log(`  Code Between Markers: ${lines} lines`);
		console.log(`  First Line Preview: ${extractedCode.split('\n')[1]?.trim().substring(0, 50) || 'N/A'}...`);
	}

	console.log('');
});

console.log('='.repeat(70));
console.log(`OVERALL STATUS: ${allValid ? '✓ ALL MARKERS VALID' : '✗ SOME MARKERS INVALID'}`);
console.log('='.repeat(70));

process.exit(allValid ? 0 : 1);
