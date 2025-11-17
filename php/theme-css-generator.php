<?php
/**
 * Theme CSS Generator
 *
 * Generates CSS for themes actually used on the current page.
 * Implements Tier 2 of the 3-tier cascade system.
 *
 * Performance optimization: Only outputs CSS for themes used on the page,
 * not all themes in the database. This keeps CSS payload minimal.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Parse post content and find which themes are used
 *
 * Scans the post content blocks to identify which themes are referenced
 * by currentTheme attribute for each block type.
 *
 * @return array Associative array with block types and theme IDs used
 *               Example: ['accordion' => ['theme-id-1', 'theme-id-2'], 'tabs' => ['theme-id-3']]
 */
function guttemberg_plus_get_used_themes_on_page() {
	global $post;

	// No post context (REST API, admin, etc.)
	if ( ! $post || ! isset( $post->post_content ) ) {
		return array();
	}

	// Parse blocks from post content
	if ( ! function_exists( 'parse_blocks' ) ) {
		return array();
	}

	$blocks      = parse_blocks( $post->post_content );
	$used_themes = array();

	// Recursive function to process blocks and inner blocks
	$process_blocks = function ( $blocks ) use ( &$process_blocks, &$used_themes ) {
		foreach ( $blocks as $block ) {
			// Check if this is one of our blocks
			if ( isset( $block['blockName'] ) && isset( $block['attrs']['currentTheme'] ) ) {
				$theme_id = $block['attrs']['currentTheme'];

				// Skip empty theme IDs
				if ( empty( $theme_id ) ) {
					continue;
				}

				// Detect block type from block name
				if ( strpos( $block['blockName'], 'custom/accordion' ) !== false ) {
					if ( ! isset( $used_themes['accordion'] ) ) {
						$used_themes['accordion'] = array();
					}
					$used_themes['accordion'][] = $theme_id;
				} elseif ( strpos( $block['blockName'], 'custom/tabs' ) !== false ) {
					if ( ! isset( $used_themes['tabs'] ) ) {
						$used_themes['tabs'] = array();
					}
					$used_themes['tabs'][] = $theme_id;
				} elseif ( strpos( $block['blockName'], 'custom/toc' ) !== false ) {
					if ( ! isset( $used_themes['toc'] ) ) {
						$used_themes['toc'] = array();
					}
					$used_themes['toc'][] = $theme_id;
				}
			}

			// Process inner blocks recursively
			if ( ! empty( $block['innerBlocks'] ) ) {
				$process_blocks( $block['innerBlocks'] );
			}
		}
	};

	$process_blocks( $blocks );

	// Remove duplicates and reindex
	foreach ( $used_themes as $block_type => $theme_ids ) {
		$used_themes[ $block_type ] = array_values( array_unique( $theme_ids ) );
	}

	return $used_themes;
}

/**
 * Generate CSS for a specific theme
 *
 * Converts theme values from database into CSS custom properties.
 * Handles proper escaping and formatting.
 *
 * @param string $block_type Block type (accordion, tabs, or toc).
 * @param string $theme_id   Theme identifier.
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
	$css = ".{$block_type}-theme-{$safe_theme_id} {\n";

	// Convert each value to CSS custom property
	foreach ( $values as $key => $value ) {
		// Skip null or empty values
		if ( $value === null || $value === '' ) {
			continue;
		}

		// Convert camelCase to kebab-case for CSS variable name
		$css_var_name = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $key ) );

		// Handle different value types
		if ( is_array( $value ) ) {
			// Handle object values like padding, borderRadius
			// Format: { top: 12, right: 12, bottom: 12, left: 12 }
			if ( isset( $value['top'] ) && isset( $value['right'] ) && isset( $value['bottom'] ) && isset( $value['left'] ) ) {
				// Box model (padding, margin, etc.)
				$formatted = sprintf(
					'%spx %spx %spx %spx',
					esc_attr( $value['top'] ),
					esc_attr( $value['right'] ),
					esc_attr( $value['bottom'] ),
					esc_attr( $value['left'] )
				);
				$css      .= "  --{$block_type}-{$css_var_name}: {$formatted};\n";
			} elseif ( isset( $value['topLeft'] ) && isset( $value['topRight'] ) && isset( $value['bottomLeft'] ) && isset( $value['bottomRight'] ) ) {
				// Border radius
				$formatted = sprintf(
					'%spx %spx %spx %spx',
					esc_attr( $value['topLeft'] ),
					esc_attr( $value['topRight'] ),
					esc_attr( $value['bottomRight'] ),
					esc_attr( $value['bottomLeft'] )
				);
				$css      .= "  --{$block_type}-{$css_var_name}: {$formatted};\n";
			}
		} elseif ( is_bool( $value ) ) {
			// Booleans: convert to string
			$css .= "  --{$block_type}-{$css_var_name}: " . ( $value ? 'true' : 'false' ) . ";\n";
		} elseif ( is_numeric( $value ) ) {
			// Numbers: check if it needs a unit
			$needs_unit = in_array(
				$css_var_name,
				array(
					'title-font-size',
					'content-font-size',
					'icon-size',
					'border-width',
					'border-radius',
					'margin-bottom',
					'padding',
					'title-padding',
					'content-padding',
				),
				true
			);
			$formatted  = $needs_unit ? esc_attr( $value ) . 'px' : esc_attr( $value );
			$css       .= "  --{$block_type}-{$css_var_name}: {$formatted};\n";
		} else {
			// Strings: escape and output
			$css .= '  --' . $block_type . '-' . $css_var_name . ': ' . esc_attr( $value ) . ";\n";
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

	// No themes used on this page
	if ( empty( $used_themes ) ) {
		return;
	}

	$css = "/**\n * Guttemberg Plus - Theme Styles (Tier 2 Cascade)\n * Generated dynamically for themes used on this page\n */\n\n";

	// Generate CSS for accordion themes
	if ( ! empty( $used_themes['accordion'] ) ) {
		$all_accordion_themes = get_option( 'guttemberg_plus_accordion_themes', array() );

		foreach ( $used_themes['accordion'] as $theme_id ) {
			if ( isset( $all_accordion_themes[ $theme_id ] ) ) {
				$theme = $all_accordion_themes[ $theme_id ];
				if ( isset( $theme['values'] ) ) {
					$css .= guttemberg_plus_generate_theme_css_rules(
						'accordion',
						$theme_id,
						$theme['values']
					);
				}
			}
		}
	}

	// Generate CSS for tabs themes
	if ( ! empty( $used_themes['tabs'] ) ) {
		$all_tabs_themes = get_option( 'guttemberg_plus_tabs_themes', array() );

		foreach ( $used_themes['tabs'] as $theme_id ) {
			if ( isset( $all_tabs_themes[ $theme_id ] ) ) {
				$theme = $all_tabs_themes[ $theme_id ];
				if ( isset( $theme['values'] ) ) {
					$css .= guttemberg_plus_generate_theme_css_rules(
						'tabs',
						$theme_id,
						$theme['values']
					);
				}
			}
		}
	}

	// Generate CSS for toc themes
	if ( ! empty( $used_themes['toc'] ) ) {
		$all_toc_themes = get_option( 'guttemberg_plus_toc_themes', array() );

		foreach ( $used_themes['toc'] as $theme_id ) {
			if ( isset( $all_toc_themes[ $theme_id ] ) ) {
				$theme = $all_toc_themes[ $theme_id ];
				if ( isset( $theme['values'] ) ) {
					$css .= guttemberg_plus_generate_theme_css_rules(
						'toc',
						$theme_id,
						$theme['values']
					);
				}
			}
		}
	}

	// Output CSS if we generated any
	if ( ! empty( $css ) && strlen( $css ) > 150 ) { // More than just the header comment
		wp_add_inline_style( 'guttemberg-plus-accordion-defaults', $css );
	}
}
add_action( 'wp_enqueue_scripts', 'guttemberg_plus_enqueue_theme_css', 20 );
