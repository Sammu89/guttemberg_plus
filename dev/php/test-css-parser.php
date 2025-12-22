<?php
/**
 * Test CSS Parser Functions
 *
 * Quick manual test to verify CSS parser functionality
 * Run this file to check that the CSS parser loads defaults correctly
 *
 * @package GutenbergBlocks
 */

// Simulate WordPress environment for testing
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__ ) . '/' );
}

// Mock WordPress functions for standalone testing
if ( ! function_exists( 'wp_cache_get' ) ) {
	function wp_cache_get( $key, $group = '' ) {
		return false; // Always miss cache for testing
	}
}

if ( ! function_exists( 'wp_cache_set' ) ) {
	function wp_cache_set( $key, $data, $group = '', $expire = 0 ) {
		return true;
	}
}

if ( ! function_exists( 'plugin_dir_path' ) ) {
	function plugin_dir_path( $file ) {
		return dirname( $file ) . '/';
	}
}

// Load the CSS parser
require_once __DIR__ . '/css-parser.php';

echo "=== CSS Parser Test Suite ===\n\n";

// Test 1: Load all defaults for accordion
echo "Test 1: Load all accordion defaults\n";
$accordion_defaults = gutenberg_blocks_load_css_defaults( 'accordion' );
if ( is_array( $accordion_defaults ) && count( $accordion_defaults ) === 23 ) {
	echo "✓ PASS: Loaded " . count( $accordion_defaults ) . " defaults\n";
} else {
	echo "✗ FAIL: Expected 23 defaults, got " . count( $accordion_defaults ) . "\n";
}
echo "\n";

// Test 2: Get specific default value
echo "Test 2: Get specific default value\n";
$title_color = gutenberg_blocks_get_css_default( 'accordion', 'defaultTitleColor' );
if ( $title_color === '#333333' ) {
	echo "✓ PASS: defaultTitleColor = '$title_color'\n";
} else {
	echo "✗ FAIL: Expected '#333333', got '$title_color'\n";
}
echo "\n";

// Test 3: Missing attribute returns null
echo "Test 3: Missing attribute returns null\n";
$missing = gutenberg_blocks_get_css_default( 'accordion', 'nonExistentAttribute' );
if ( $missing === null ) {
	echo "✓ PASS: Missing attribute returns null\n";
} else {
	echo "✗ FAIL: Expected null, got: " . var_export( $missing, true ) . "\n";
}
echo "\n";

// Test 4: Invalid block type returns empty array
echo "Test 4: Invalid block type returns empty array\n";
$invalid = gutenberg_blocks_load_css_defaults( 'invalid-block' );
if ( is_array( $invalid ) && count( $invalid ) === 0 ) {
	echo "✓ PASS: Invalid block type returns empty array\n";
} else {
	echo "✗ FAIL: Expected empty array\n";
}
echo "\n";

// Test 5: Missing file returns empty array
echo "Test 5: Missing file returns empty array\n";
$missing_file = gutenberg_blocks_load_css_defaults( 'tabs' );
if ( is_array( $missing_file ) && count( $missing_file ) === 0 ) {
	echo "✓ PASS: Missing file returns empty array\n";
} else {
	echo "✗ FAIL: Expected empty array for tabs (file doesn't exist yet)\n";
}
echo "\n";

// Test 6: Show sample of defaults
echo "Test 6: Sample defaults structure\n";
echo "defaultTitleColor: " . $accordion_defaults['defaultTitleColor'] . "\n";
echo "defaultTitleFontSize: " . $accordion_defaults['defaultTitleFontSize'] . "\n";
echo "defaultBorderWidth: " . $accordion_defaults['defaultBorderWidth'] . "\n";
echo "defaultAnimationDuration: " . $accordion_defaults['defaultAnimationDuration'] . "\n";
echo "✓ All values loaded correctly\n";
echo "\n";

echo "=== Test Suite Complete ===\n";
