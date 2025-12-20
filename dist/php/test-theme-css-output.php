<?php
/**
 * Test Theme CSS Output
 * Quick test to verify CSS variable generation is correct
 */

// Include the generator
require_once __DIR__ . '/theme-css-generator.php';

// Test data - simulating a saved theme
$test_theme_values = array(
	'titleColor' => '#282ede',
	'titleFontSize' => 33,
	'titleBackgroundColor' => '#ffffff',
	'contentColor' => '#000000',
);

// Generate CSS
$css = guttemberg_plus_generate_theme_css_rules( 'accordion', 'test-theme-123', $test_theme_values );

echo "Generated CSS:\n";
echo $css;
echo "\n";

// Verify output
if ( strpos( $css, '--accordion-accordion-' ) !== false ) {
	echo "❌ FAILED: Double prefix found!\n";
} elseif ( strpos( $css, '--accordion-title-color' ) !== false ) {
	echo "✅ PASSED: Correct variable names!\n";
} else {
	echo "⚠️  WARNING: Could not verify output\n";
}
