/**
 * Test Attribute Compression/Decompression
 *
 * Validates that compression and decompression work correctly
 * for all CSS property families.
 *
 * Run: node build-tools/test-compression.js
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

const {
	compressAttributes,
	compressCustomizations,
	getCompressionStats,
	COMPRESSION_EXAMPLES,
} = require('../shared/src/utils/attribute-compression.js');

const {
	decompressAttributes,
	decompressCustomizations,
	DECOMPRESSION_EXAMPLES,
} = require('../shared/src/utils/attribute-decompression.js');

/**
 * Deep equality check
 */
function deepEqual(obj1, obj2) {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Test a single compression example
 */
function testCompression(name, example) {
	const result = compressAttributes(example.input);
	const passed = deepEqual(result, example.output);

	if (passed) {
		console.log(`  ✅ ${name}`);
	} else {
		console.log(`  ❌ ${name}`);
		console.log(`     Expected:`, JSON.stringify(example.output));
		console.log(`     Got:`, JSON.stringify(result));
	}

	return passed;
}

/**
 * Test a single decompression example
 */
function testDecompression(name, example) {
	const result = decompressAttributes(example.input);
	const passed = deepEqual(result, example.output);

	if (passed) {
		console.log(`  ✅ ${name}`);
	} else {
		console.log(`  ❌ ${name}`);
		console.log(`     Expected:`, JSON.stringify(example.output));
		console.log(`     Got:`, JSON.stringify(result));
	}

	return passed;
}

/**
 * Test round-trip (decompress → compress → should match original compressed)
 */
function testRoundTrip(name, compressedInput) {
	// Decompress
	const decompressed = decompressAttributes(compressedInput);

	// Compress again
	const recompressed = compressAttributes(decompressed);

	// Should match original
	const passed = deepEqual(recompressed, compressedInput);

	if (passed) {
		console.log(`  ✅ ${name} (round-trip)`);
	} else {
		console.log(`  ❌ ${name} (round-trip)`);
		console.log(`     Original:`, JSON.stringify(compressedInput));
		console.log(`     After round-trip:`, JSON.stringify(recompressed));
	}

	return passed;
}

/**
 * Test compression statistics
 */
function testStats() {
	const original = {
		paddingTop: '10px',
		paddingRight: '20px',
		paddingBottom: '10px',
		paddingLeft: '20px',
		marginTop: '5px',
		marginRight: '5px',
		marginBottom: '5px',
		marginLeft: '5px',
		borderTopWidth: '1px',
		borderRightWidth: '1px',
		borderBottomWidth: '1px',
		borderLeftWidth: '1px',
		borderTopStyle: 'solid',
		borderRightStyle: 'solid',
		borderBottomStyle: 'solid',
		borderLeftStyle: 'solid',
		borderTopColor: '#000',
		borderRightColor: '#000',
		borderBottomColor: '#000',
		borderLeftColor: '#000',
	};

	const compressed = compressAttributes(original);
	const stats = getCompressionStats(original, compressed);

	console.log(`\n📊 Compression Statistics:`);
	console.log(`   Original attributes: ${stats.originalCount}`);
	console.log(`   Compressed attributes: ${stats.compressedCount}`);
	console.log(`   Reduction: ${stats.reduction} (${stats.percentage}%)`);
	console.log(`   Original size: ${stats.originalSize} bytes`);
	console.log(`   Compressed size: ${stats.compressedSize} bytes`);
	console.log(`   Size savings: ${stats.originalSize - stats.compressedSize} bytes`);

	return stats.reduction > 0;
}

/**
 * Test responsive compression
 */
function testResponsive() {
	const input = {
		paddingTop: {
			value: '10px',
			tablet: '8px',
			mobile: '6px',
		},
		paddingRight: {
			value: '10px',
			tablet: '8px',
			mobile: '6px',
		},
		paddingBottom: {
			value: '10px',
			tablet: '8px',
			mobile: '6px',
		},
		paddingLeft: {
			value: '10px',
			tablet: '8px',
			mobile: '6px',
		},
	};

	const expected = {
		padding: {
			value: '10px',
			tablet: '8px',
			mobile: '6px',
		},
	};

	const result = compressAttributes(input);
	const passed = deepEqual(result, expected);

	if (passed) {
		console.log(`  ✅ Responsive compression`);
	} else {
		console.log(`  ❌ Responsive compression`);
		console.log(`     Expected:`, JSON.stringify(expected));
		console.log(`     Got:`, JSON.stringify(result));
	}

	return passed;
}

/**
 * Run all tests
 */
function runTests() {
	console.log('\n╔════════════════════════════════════════════════════════════╗');
	console.log('║  Attribute Compression/Decompression Tests                ║');
	console.log('╚════════════════════════════════════════════════════════════╝\n');

	let totalTests = 0;
	let passedTests = 0;

	// Test compression examples
	console.log('📦 Compression Tests:');
	Object.entries(COMPRESSION_EXAMPLES).forEach(([name, example]) => {
		totalTests++;
		if (testCompression(name, example)) {
			passedTests++;
		}
	});

	// Test decompression examples
	console.log('\n📦 Decompression Tests:');
	Object.entries(DECOMPRESSION_EXAMPLES).forEach(([name, example]) => {
		totalTests++;
		if (testDecompression(name, example)) {
			passedTests++;
		}
	});

	// Test round-trip
	console.log('\n🔄 Round-Trip Tests:');
	Object.entries(COMPRESSION_EXAMPLES).forEach(([name, example]) => {
		totalTests++;
		if (testRoundTrip(name, example.output)) {
			passedTests++;
		}
	});

	// Test responsive compression
	console.log('\n📱 Responsive Tests:');
	totalTests++;
	if (testResponsive()) {
		passedTests++;
	}

	// Test stats
	console.log('\n');
	totalTests++;
	if (testStats()) {
		passedTests++;
	}

	// Summary
	console.log('\n' + '═'.repeat(60));
	console.log(`📊 SUMMARY: ${passedTests}/${totalTests} tests passed`);
	console.log('═'.repeat(60) + '\n');

	if (passedTests === totalTests) {
		console.log('✅ ALL TESTS PASSED!\n');
		process.exit(0);
	} else {
		console.log(`❌ ${totalTests - passedTests} TESTS FAILED\n`);
		process.exit(1);
	}
}

// Run tests
runTests();
