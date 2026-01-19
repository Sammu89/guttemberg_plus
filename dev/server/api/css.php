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
 * Compress CSS box values using shorthand notation
 *
 * Handles: border-width, border-color, border-style, padding, margin
 *
 * @param array  $values Array of [top, right, bottom, left] values.
 * @param string $unit   CSS unit to append (empty string for non-numeric values).
 * @return string Compressed CSS shorthand value
 */
function guttemberg_plus_compress_box_value( $values, $unit = '' ) {
	list( $top, $right, $bottom, $left ) = $values;
	$add_unit = function ( $value ) use ( $unit ) {
		if ( $unit ) {
			return "{$value}{$unit}";
		}
		return (string) $value;
	};

	if ( $top === $right && $right === $bottom && $bottom === $left ) {
		return $add_unit( $top );
	}
	if ( $top === $bottom && $left === $right ) {
		return $add_unit( $top ) . ' ' . $add_unit( $left );
	}
	if ( $left === $right ) {
		return $add_unit( $top ) . ' ' . $add_unit( $right ) . ' ' . $add_unit( $bottom );
	}
	return $add_unit( $top ) . ' ' . $add_unit( $right ) . ' ' . $add_unit( $bottom ) . ' ' . $add_unit( $left );
}

/**
 * Format a shadow value object to a CSS string with unit.
 *
 * @param mixed $value Shadow value or structured { value, unit }.
 * @return string Formatted CSS value
 */
function guttemberg_plus_format_shadow_value( $value ) {
	if ( $value === null ) {
		return '0px';
	}
	if ( is_string( $value ) ) {
		return $value;
	}
	if ( is_int( $value ) || is_float( $value ) ) {
		return "{$value}px";
	}
	if ( is_array( $value ) ) {
		$numeric = $value['value'] ?? 0;
		$unit    = $value['unit'] ?? 'px';
		return "{$numeric}{$unit}";
	}
	return '0px';
}

function guttemberg_plus_get_unit_from_string( $value ) {
	if ( ! is_string( $value ) ) {
		return '';
	}
	$trimmed = trim( $value );
	if ( preg_match( '/^-?\d+(?:\.\d+)?\s*([a-zA-Z%]+)$/', $trimmed, $matches ) ) {
		return $matches[1];
	}
	return '';
}

function guttemberg_plus_infer_box_unit( $value, $fallback = '' ) {
	if ( ! is_array( $value ) ) {
		return $fallback;
	}

	if ( array_key_exists( 'unit', $value ) && $value['unit'] !== null && $value['unit'] !== '' ) {
		return $value['unit'];
	}

	if ( isset( $value['value'] ) && is_array( $value['value'] ) ) {
		return guttemberg_plus_infer_box_unit( $value['value'], $fallback );
	}

	$candidates = array( 'top', 'right', 'bottom', 'left', 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' );
	foreach ( $candidates as $key ) {
		if ( ! array_key_exists( $key, $value ) ) {
			continue;
		}
		$candidate = $value[ $key ];
		if ( is_string( $candidate ) ) {
			$unit = guttemberg_plus_get_unit_from_string( $candidate );
			if ( $unit !== '' ) {
				return $unit;
			}
			continue;
		}
		if ( is_array( $candidate ) ) {
			if ( array_key_exists( 'unit', $candidate ) && $candidate['unit'] !== null && $candidate['unit'] !== '' ) {
				return $candidate['unit'];
			}
			if ( array_key_exists( 'value', $candidate ) && is_string( $candidate['value'] ) ) {
				$unit = guttemberg_plus_get_unit_from_string( $candidate['value'] );
				if ( $unit !== '' ) {
					return $unit;
				}
			}
		}
	}

	return $fallback;
}

/**
 * Build CSS box-shadow value from an array of shadow layer objects.
 *
 * @param array|null $shadows Array of shadow layers.
 * @return string CSS box-shadow value or 'none'
 */
function guttemberg_plus_build_box_shadow( $shadows ) {
	if ( empty( $shadows ) || ! is_array( $shadows ) ) {
		return 'none';
	}

	$valid_layers = array_filter(
		$shadows,
		function ( $layer ) {
			return is_array( $layer ) && ! empty( $layer['color'] ) && trim( $layer['color'] ) !== '';
		}
	);

	if ( empty( $valid_layers ) ) {
		return 'none';
	}

	$shadow_strings = array_map(
		function ( $layer ) {
			$parts = array();
			if ( ! empty( $layer['inset'] ) ) {
				$parts[] = 'inset';
			}

			$parts[] = guttemberg_plus_format_shadow_value( $layer['x'] ?? null );
			$parts[] = guttemberg_plus_format_shadow_value( $layer['y'] ?? null );
			$parts[] = guttemberg_plus_format_shadow_value( $layer['blur'] ?? null );
			$parts[] = guttemberg_plus_format_shadow_value( $layer['spread'] ?? null );
			$parts[] = $layer['color'];

			return implode( ' ', $parts );
		},
		$valid_layers
	);

	return implode( ', ', $shadow_strings );
}

/**
 * Format a side value with unit fallback for decomposed CSS vars.
 *
 * @param mixed  $side_value   Value for a single side/corner.
 * @param string $unit_fallback Unit to append for numeric values.
 * @return string|null Formatted value or null if not mappable
 */
function guttemberg_plus_format_side_value( $side_value, $unit_fallback ) {
	if ( $side_value === null ) {
		return null;
	}
	if ( is_string( $side_value ) ) {
		return $side_value;
	}
	if ( is_int( $side_value ) || is_float( $side_value ) ) {
		return $unit_fallback ? "{$side_value}{$unit_fallback}" : (string) $side_value;
	}
	if ( is_array( $side_value ) && array_key_exists( 'value', $side_value ) ) {
		$unit = $side_value['unit'] ?? $unit_fallback ?? '';
		return "{$side_value['value']}{$unit}";
	}
	return null;
}

/**
 * Check if resolved values differ across sides/corners.
 *
 * @param array $values Array of resolved values.
 * @return bool True if values differ.
 */
function guttemberg_plus_values_differ( $values ) {
	$filtered = array();
	foreach ( $values as $value ) {
		if ( $value !== null ) {
			$filtered[] = $value;
		}
	}

	if ( count( $filtered ) <= 1 ) {
		return false;
	}

	$first = $filtered[0];
	foreach ( $filtered as $value ) {
		if ( $value !== $first ) {
			return true;
		}
	}

	return false;
}

/**
 * Decompose box-like objects into per-side CSS variable assignments.
 *
 * @param mixed  $value   Box-like value object.
 * @param array  $mapping Mapping info with cssVar/unit/type.
 * @param string $suffix  Optional suffix (e.g., '-tablet', '-mobile').
 * @return array Map of CSS variable names to values.
 */
function guttemberg_plus_decompose_css_value( $value, $mapping, $suffix = '' ) {
	if ( ! is_array( $value ) || empty( $mapping['cssVar'] ) ) {
		return array();
	}

	$css_var = $mapping['cssVar'];
	$linked  = array_key_exists( 'linked', $value ) ? $value['linked'] : null;
	$result  = array();

	if ( isset( $value['topLeft'] ) ) {
		$unit = guttemberg_plus_infer_box_unit( $value, $mapping['defaultUnit'] ?? ( $mapping['unit'] ?? 'px' ) );
		$corners = array(
			'top-left'     => $value['topLeft'],
			'top-right'    => $value['topRight'],
			'bottom-right' => $value['bottomRight'],
			'bottom-left'  => $value['bottomLeft'],
		);

		$resolved = array();
		foreach ( $corners as $corner => $corner_value ) {
			$resolved[ $corner ] = guttemberg_plus_format_side_value( $corner_value, $unit );
		}

		$should_emit = ( $linked === false ) || guttemberg_plus_values_differ( array_values( $resolved ) );
		if ( ! $should_emit ) {
			return array();
		}

		foreach ( $resolved as $corner => $formatted ) {
			if ( $formatted !== null ) {
				$result[ "--{$css_var}-{$corner}{$suffix}" ] = $formatted;
			}
		}

		return $result;
	}

	if ( isset( $value['top'] ) || isset( $value['right'] ) || isset( $value['bottom'] ) || isset( $value['left'] ) ) {
		$unit  = guttemberg_plus_infer_box_unit( $value, $mapping['defaultUnit'] ?? ( $mapping['unit'] ?? '' ) );
		$sides = array(
			'top'    => $value['top'] ?? null,
			'right'  => $value['right'] ?? null,
			'bottom' => $value['bottom'] ?? null,
			'left'   => $value['left'] ?? null,
		);

		$resolved = array();
		foreach ( $sides as $side => $side_value ) {
			$resolved[ $side ] = guttemberg_plus_format_side_value( $side_value, $unit );
		}

		$should_emit = ( $linked === false ) || guttemberg_plus_values_differ( array_values( $resolved ) );
		if ( ! $should_emit ) {
			return array();
		}

		foreach ( $resolved as $side => $formatted ) {
			if ( $formatted !== null ) {
				$result[ "--{$css_var}-{$side}{$suffix}" ] = $formatted;
			}
		}

		return $result;
	}

	return $result;
}

/**
 * Format a value with its unit for CSS output
 *
 * @param mixed $value   The value to format.
 * @param array $mapping Mapping info with unit/type.
 * @return string|null Formatted CSS value or null if not mappable
 */
function guttemberg_plus_format_css_value( $value, $mapping ) {
	if ( $value === null ) {
		return null;
	}

	$unit = $mapping['unit'] ?? ( $mapping['defaultUnit'] ?? '' );
	$type = $mapping['type'] ?? null;

	// Handle numeric objects that carry their own unit (e.g., { value, unit })
	if ( is_array( $value ) && array_key_exists( 'value', $value ) && ! is_array( $value['value'] ) && $value['value'] !== null ) {
		if ( is_string( $value['value'] ) ) {
			return $value['value'];
		}
		if ( array_key_exists( 'unit', $value ) && $value['unit'] !== null ) {
			$value_unit = $value['unit'];
		} else {
			$value_unit = $unit ?? '';
		}
		return "{$value['value']}{$value_unit}";
	}

	// Handle object types (border radius, padding, colors, styles)
	if ( $type === 'object' && is_array( $value ) ) {
		// Handle responsive objects (tablet/mobile keys) - use base value if nested
		if ( ( array_key_exists( 'tablet', $value ) || array_key_exists( 'mobile', $value ) ) && isset( $value['value'] ) && is_array( $value['value'] ) ) {
			return guttemberg_plus_format_css_value( $value['value'], $mapping );
		}

		// Border radius format: topLeft topRight bottomRight bottomLeft
		if ( isset( $value['topLeft'] ) ) {
			$radius_unit = guttemberg_plus_infer_box_unit( $value, $mapping['defaultUnit'] ?? ( $mapping['unit'] ?? 'px' ) );
			$values      = array( $value['topLeft'], $value['topRight'], $value['bottomRight'], $value['bottomLeft'] );
			return guttemberg_plus_compress_box_value( $values, $radius_unit );
		}

		// Directional properties (border-width, border-color, border-style, padding, margin)
		if ( isset( $value['top'] ) || isset( $value['right'] ) || isset( $value['bottom'] ) || isset( $value['left'] ) ) {
			$get_val = function ( $side ) use ( $value ) {
				if ( isset( $value[ $side ] ) && is_array( $value[ $side ] ) && array_key_exists( 'value', $value[ $side ] ) ) {
					return $value[ $side ]['value'];
				}
				return $value[ $side ] ?? '';
			};

			$values = array( $get_val( 'top' ), $get_val( 'right' ), $get_val( 'bottom' ), $get_val( 'left' ) );

			$first_value = null;
			foreach ( $values as $candidate ) {
				if ( $candidate !== '' && $candidate !== null ) {
					$first_value = $candidate;
					break;
				}
			}

			$is_numeric = is_int( $first_value ) || is_float( $first_value );
			$value_unit = $is_numeric
				? guttemberg_plus_infer_box_unit( $value, $mapping['defaultUnit'] ?? ( $mapping['unit'] ?? 'px' ) )
				: '';

			return guttemberg_plus_compress_box_value( $values, $value_unit );
		}

		return wp_json_encode( $value );
	}

	// Handle array types (e.g., box-shadow layers)
	if ( $type === 'array' && is_array( $value ) ) {
		return guttemberg_plus_build_box_shadow( $value );
	}

	// Handle numeric values with units
	if ( $unit && ( is_int( $value ) || is_float( $value ) ) ) {
		return "{$value}{$unit}";
	}

	if ( is_bool( $value ) ) {
		return $value ? 'true' : 'false';
	}

	return $value;
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

	// Handle responsive values (base + tablet/mobile overrides)
	if ( is_array( $value ) && ( array_key_exists( 'tablet', $value ) || array_key_exists( 'mobile', $value ) ) ) {
		$base_value     = array_key_exists( 'value', $value ) ? $value['value'] : $value;
		$formatted_base = guttemberg_plus_format_css_value( $base_value, $mapping );

		if ( $formatted_base !== null ) {
			$css .= '  --' . $css_var_name . ': ' . esc_attr( $formatted_base ) . ";\n";
		}

		$decomposed = guttemberg_plus_decompose_css_value( $base_value, $mapping, '' );
		foreach ( $decomposed as $var_name => $var_value ) {
			$css .= '  ' . $var_name . ': ' . esc_attr( $var_value ) . ";\n";
		}

		if ( array_key_exists( 'tablet', $value ) ) {
			$formatted_tablet = guttemberg_plus_format_css_value( $value['tablet'], $mapping );
			if ( $formatted_tablet !== null ) {
				$css .= '  --' . $css_var_name . '-tablet: ' . esc_attr( $formatted_tablet ) . ";\n";
			}

			$decomposed = guttemberg_plus_decompose_css_value( $value['tablet'], $mapping, '-tablet' );
			foreach ( $decomposed as $var_name => $var_value ) {
				$css .= '  ' . $var_name . ': ' . esc_attr( $var_value ) . ";\n";
			}
		}

		if ( array_key_exists( 'mobile', $value ) ) {
			$formatted_mobile = guttemberg_plus_format_css_value( $value['mobile'], $mapping );
			if ( $formatted_mobile !== null ) {
				$css .= '  --' . $css_var_name . '-mobile: ' . esc_attr( $formatted_mobile ) . ";\n";
			}

			$decomposed = guttemberg_plus_decompose_css_value( $value['mobile'], $mapping, '-mobile' );
			foreach ( $decomposed as $var_name => $var_value ) {
				$css .= '  ' . $var_name . ': ' . esc_attr( $var_value ) . ";\n";
			}
		}

		continue;
	}

		$formatted_value = guttemberg_plus_format_css_value( $value, $mapping );
	if ( $formatted_value === null ) {
		error_log( '[GUTTEMBERG DEBUG] Value not mappable for: ' . $attr_name );
		continue;
	}

	$css .= '  --' . $css_var_name . ': ' . esc_attr( $formatted_value ) . ";\n";

	$decomposed = guttemberg_plus_decompose_css_value( $value, $mapping, '' );
	foreach ( $decomposed as $var_name => $var_value ) {
		$css .= '  ' . $var_name . ': ' . esc_attr( $var_value ) . ";\n";
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
