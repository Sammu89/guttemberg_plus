<?php
/**
 * Theme CSS Generator
 *
 * Implements Tier 2 CSS generation for optimal theme performance.
 * Generates CSS classes in <head> for themes actually used on the page.
 *
 * Architecture:
 * - Tier 1: CSS defaults (assets/css/*.css - :root variables)
 * - Tier 2: Theme CSS (this file - CSS classes in <head>)
 * - Tier 3: Block customizations (inline styles in save.js)
 *
 * Performance:
 * - Only generates CSS for themes used on current page
 * - CSS is cacheable by browser
 * - Reduces inline CSS payload by ~70% per block
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get themes used on the current page
 *
 * Parses post content to detect which theme IDs are referenced by blocks.
 * Returns array like: ['accordion' => ['theme-id-1'], 'tabs' => ['theme-id-2']]
 *
 * @return array Associative array of block_type => array of theme IDs
 */
function guttemberg_plus_get_used_themes_on_page() {
	global $post;

	if ( ! isset( $post ) || ! isset( $post->post_content ) ) {
		return array();
	}

	// Parse blocks from post content
	$blocks = parse_blocks( $post->post_content );

	// Track which themes are used for each block type
	$used_themes = array(
		'accordion' => array(),
		'tabs'      => array(),
		'toc'       => array(),
	);

	// Recursively process blocks and their inner blocks
	$process_blocks = function ( $blocks_array ) use ( &$process_blocks, &$used_themes ) {
		foreach ( $blocks_array as $block ) {
			// Check if this is one of our blocks
			$block_types_map = array(
				'custom/accordion'    => 'accordion',
				'custom/tabs'         => 'tabs',
				'custom/toc'          => 'toc',
				'custom/custom-toc'   => 'toc',
			);

			if ( isset( $block_types_map[ $block['blockName'] ] ) ) {
				$block_type = $block_types_map[ $block['blockName'] ];

				// Check if block has a currentTheme attribute
				if ( isset( $block['attrs']['currentTheme'] ) && ! empty( $block['attrs']['currentTheme'] ) ) {
					$theme_id = $block['attrs']['currentTheme'];

					// Add to used themes if not already present
					if ( ! in_array( $theme_id, $used_themes[ $block_type ], true ) ) {
						$used_themes[ $block_type ][] = $theme_id;
					}
				}
			}

			// Process inner blocks recursively
			if ( ! empty( $block['innerBlocks'] ) ) {
				$process_blocks( $block['innerBlocks'] );
			}
		}
	};

	$process_blocks( $blocks );

	// Filter out empty arrays
	return array_filter(
		$used_themes,
		function ( $themes ) {
			return ! empty( $themes );
		}
	);
}

/**
 * Load generated mappings data
 *
 * @return array Mappings array indexed by block type
 */
function guttemberg_plus_load_mappings_data() {
	static $mappings = null;
	if ( $mappings === null ) {
		$mappings = require __DIR__ . '/css-defaults/css-mappings-generated.php';
	}
	return $mappings;
}

/**
 * Get mapping info for an attribute
 *
 * Returns array with 'cssVar', 'unit', and 'type' or null if not found.
 *
 * @param string $block_type Block type (accordion, tabs, toc).
 * @param string $attr_name  Attribute name (e.g., 'titleBackgroundColor').
 * @return array|null Mapping info or null if no mapping
 */
function guttemberg_plus_get_attribute_mapping( $block_type, $attr_name ) {
	$mappings = guttemberg_plus_load_mappings_data();

	if ( ! isset( $mappings[ $block_type ] ) ) {
		return null;
	}

	return $mappings[ $block_type ][ $attr_name ] ?? null;
}

/**
 * Generate CSS rules for a single theme
 *
 * Converts theme values array to CSS custom properties with proper formatting.
 * Handles different value types: colors, numbers, objects (padding, borderRadius).
 * Uses explicit attribute-to-CSS-variable mapping to ensure consistency.
 *
 * @param string $block_type Block type (accordion, tabs, toc).
 * @param string $theme_id   Theme ID (used for class name).
 * @param array  $values     Theme values array.
 * @return string CSS rules for this theme
 */
function guttemberg_plus_generate_theme_css_rules( $block_type, $theme_id, $values ) {
	if ( empty( $values ) || ! is_array( $values ) ) {
		return '';
	}

	// Sanitize theme ID for use in class name (alphanumeric and hyphens only)
	$safe_theme_id = preg_replace( '/[^a-zA-Z0-9\-]/', '', $theme_id );

	// Generate CSS class selector
	$css = ".gutplus-{$block_type}-theme-{$safe_theme_id} {\n";

	// Convert each value to CSS custom property
	foreach ( $values as $attr_name => $value ) {
		// Skip null or empty values
		if ( $value === null || $value === '' ) {
			error_log( '[GUTTEMBERG DEBUG] Skipping null/empty value for: ' . $attr_name );
			continue;
		}

		// Get mapping info (cssVar, unit, type)
		$mapping = guttemberg_plus_get_attribute_mapping( $block_type, $attr_name );

		error_log( '[GUTTEMBERG DEBUG] Mapping for ' . $attr_name . ': ' . print_r( $mapping, true ) );

		if ( $mapping === null ) {
			// No mapping found - skip this attribute
			error_log( '[GUTTEMBERG DEBUG] No mapping found for: ' . $attr_name );
			continue;
		}

		$css_var_name = $mapping['cssVar'];
		$unit = $mapping['unit'] ?? null;

		// Handle different value types
		error_log( '[GUTTEMBERG DEBUG] Processing ' . $attr_name . ' with value type: ' . gettype( $value ) . ' unit: ' . ( $unit ?? 'none' ) );

		if ( is_array( $value ) ) {
			error_log( '[GUTTEMBERG DEBUG] Value is array' );
			// Handle object values like padding, borderRadius
			// Format: { top: 12, right: 12, bottom: 12, left: 12 }
			if ( isset( $value['top'] ) && isset( $value['right'] ) && isset( $value['bottom'] ) && isset( $value['left'] ) ) {
				// Box model (padding, margin, etc.) - always uses px
				$formatted = sprintf(
					'%spx %spx %spx %spx',
					esc_attr( $value['top'] ),
					esc_attr( $value['right'] ),
					esc_attr( $value['bottom'] ),
					esc_attr( $value['left'] )
				);
				$css      .= "  --{$css_var_name}: {$formatted};\n";
				error_log( '[GUTTEMBERG DEBUG] Added box model CSS: --' . $css_var_name . ': ' . $formatted );
			} elseif ( isset( $value['topLeft'] ) && isset( $value['topRight'] ) && isset( $value['bottomLeft'] ) && isset( $value['bottomRight'] ) ) {
				// Border radius - always uses px
				$formatted = sprintf(
					'%spx %spx %spx %spx',
					esc_attr( $value['topLeft'] ),
					esc_attr( $value['topRight'] ),
					esc_attr( $value['bottomRight'] ),
					esc_attr( $value['bottomLeft'] )
				);
				$css      .= "  --{$css_var_name}: {$formatted};\n";
				error_log( '[GUTTEMBERG DEBUG] Added border radius CSS: --' . $css_var_name . ': ' . $formatted );
			} else {
				error_log( '[GUTTEMBERG DEBUG] Array value but no matching structure, skipping' );
			}
		} elseif ( is_bool( $value ) ) {
			error_log( '[GUTTEMBERG DEBUG] Value is boolean' );
			// Booleans: convert to string
			$css .= "  --{$css_var_name}: " . ( $value ? 'true' : 'false' ) . ";\n";
			error_log( '[GUTTEMBERG DEBUG] Added boolean CSS' );
		} elseif ( is_numeric( $value ) ) {
			error_log( '[GUTTEMBERG DEBUG] Value is numeric' );
			// Numbers: add unit if specified in mapping
			$formatted = esc_attr( $value );
			if ( $unit ) {
				$formatted .= $unit;
			}
			$css .= "  --{$css_var_name}: {$formatted};\n";
			error_log( '[GUTTEMBERG DEBUG] Added numeric CSS: --' . $css_var_name . ': ' . $formatted );
		} else {
			error_log( '[GUTTEMBERG DEBUG] Value is string or other' );
			// Strings: might be numeric string like "600" for font-weight
			// Add unit if specified in mapping
			$formatted = esc_attr( $value );
			if ( $unit && is_numeric( $value ) ) {
				$formatted .= $unit;
			}
			$css .= '  --' . $css_var_name . ': ' . $formatted . ";\n";
			error_log( '[GUTTEMBERG DEBUG] Added string CSS: --' . $css_var_name . ': ' . $formatted );
		}
	}

	$css .= "}\n\n";

	return $css;
}

/**
 * Enqueue theme CSS for blocks used on current page
 *
 * This is the main entry point for Tier 2 CSS generation.
 * Called on every page load, generates CSS only for themes actually used.
 *
 * Performance:
 * - Small pages (1-2 themes): ~1-3 KB CSS
 * - Large pages (5-10 themes): ~5-15 KB CSS
 * - CSS is cached by browser
 *
 * @return void
 */
function guttemberg_plus_enqueue_theme_css() {
	// Detect which themes are used on this page
	$used_themes = guttemberg_plus_get_used_themes_on_page();

	// Debug logging
	error_log( '[GUTTEMBERG DEBUG] Used themes on page: ' . print_r( $used_themes, true ) );

	// No themes used on this page
	if ( empty( $used_themes ) ) {
		error_log( '[GUTTEMBERG DEBUG] No themes used on this page' );
		return;
	}

	$all_css = '';

	// Generate CSS for each block type that has themes on this page
	foreach ( $used_themes as $block_type => $theme_ids ) {
		// Get all themes for this block type from database
		$option_name = "guttemberg_plus_{$block_type}_themes";
		$all_themes  = get_option( $option_name, array() );

		error_log( '[GUTTEMBERG DEBUG] All themes for ' . $block_type . ': ' . print_r( $all_themes, true ) );

		if ( empty( $all_themes ) || ! is_array( $all_themes ) ) {
			error_log( '[GUTTEMBERG DEBUG] No themes found for ' . $block_type );
			continue;
		}

		// Generate CSS for each theme that's actually used
		foreach ( $theme_ids as $theme_id ) {
			if ( ! isset( $all_themes[ $theme_id ] ) ) {
				error_log( '[GUTTEMBERG DEBUG] Theme not found: ' . $theme_id );
				continue; // Theme doesn't exist in database
			}

			$theme  = $all_themes[ $theme_id ];
			$values = $theme['values'] ?? array();

			error_log( '[GUTTEMBERG DEBUG] Theme ' . $theme_id . ' values: ' . print_r( $values, true ) );

			if ( empty( $values ) ) {
				error_log( '[GUTTEMBERG DEBUG] Theme ' . $theme_id . ' has no values' );
				continue; // No values to generate CSS from
			}

			// Generate CSS rules for this theme
			$css = guttemberg_plus_generate_theme_css_rules( $block_type, $theme_id, $values );
			error_log( '[GUTTEMBERG DEBUG] Generated CSS for ' . $theme_id . ': ' . $css );
			$all_css .= $css;
		}
	}

	// Only enqueue if we have CSS to output
	if ( ! empty( $all_css ) ) {
		// Add CSS comment for debugging
		$css_with_comment = "/* Guttemberg Plus - Theme CSS (Tier 2 Cascade) */\n" . $all_css;

		// Inject CSS into the page head
		// Attached to 'wp-block-library' handle which is always loaded
		wp_add_inline_style( 'wp-block-library', $css_with_comment );
	}
}

// Hook into wp_enqueue_scripts with priority 20 (after blocks are registered)
add_action( 'wp_enqueue_scripts', 'guttemberg_plus_enqueue_theme_css', 20 );
