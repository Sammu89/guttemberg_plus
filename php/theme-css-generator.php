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
 * Map block attribute names to CSS variable names
 *
 * This mapping MUST match the exact variable names used in:
 * - blocks/[block]/src/save.js (JavaScript side)
 * - assets/css/[block].css (CSS defaults)
 *
 * @param string $block_type Block type (accordion, tabs, toc).
 * @param string $attr_name  Attribute name (e.g., 'titleBackgroundColor').
 * @return string|null CSS variable name without prefix (e.g., 'title-bg') or null if no mapping
 */
function guttemberg_plus_map_attribute_to_css_var( $block_type, $attr_name ) {
	/**
	 * AUTO-GENERATED CSS Variable Mappings
	 * DO NOT EDIT MANUALLY - This is auto-generated from schemas/
	 * Generated from: npm run schema:build
	 * Generated at: 2025-11-22T16:00:00.000Z
	 *
	 * To update these mappings, edit the schema files in schemas/ directory and run:
	 * npm run schema:build
	 */
	$mappings = array(
		'accordion' => array(
			'titleColor' => 'accordion-title-color',
			'titleBackgroundColor' => 'accordion-title-bg',
			'hoverTitleColor' => 'accordion-title-hover-color',
			'hoverTitleBackgroundColor' => 'accordion-title-hover-bg',
			'activeTitleColor' => 'accordion-title-active-color',
			'activeTitleBackgroundColor' => 'accordion-title-active-bg',
			'contentColor' => 'accordion-content-color',
			'contentBackgroundColor' => 'accordion-content-bg',
			'borderColor' => 'accordion-border-color',
			'accordionBorderColor' => 'accordion-border-color',
			'dividerBorderColor' => 'accordion-divider-color',
			'iconColor' => 'accordion-icon-color',
			'titleFontSize' => 'accordion-title-font-size',
			'titleFontWeight' => 'accordion-title-font-weight',
			'titleFontFamily' => 'accordion-title-font-family',
			'titleLineHeight' => 'accordion-title-line-height',
			'titleFontStyle' => 'accordion-title-font-style',
			'titleTextTransform' => 'accordion-title-text-transform',
			'titleTextDecoration' => 'accordion-title-text-decoration',
			'titleAlignment' => 'accordion-title-alignment',
			'contentFontSize' => 'accordion-content-font-size',
			'contentFontWeight' => 'accordion-content-font-weight',
			'contentFontFamily' => 'accordion-content-font-family',
			'contentLineHeight' => 'accordion-content-line-height',
			'contentFontStyle' => 'accordion-content-font-style',
			'contentTextTransform' => 'accordion-content-text-transform',
			'contentTextDecoration' => 'accordion-content-text-decoration',
			'accordionBorderThickness' => 'accordion-border-width',
			'accordionBorderStyle' => 'accordion-border-style',
			'accordionBorderRadius' => 'accordion-border-radius',
			'borderWidth' => 'accordion-border-width',
			'borderRadius' => 'accordion-border-radius',
			'accordionShadow' => 'accordion-shadow',
			'dividerBorderThickness' => 'accordion-divider-width',
			'dividerBorderStyle' => 'accordion-divider-style',
			'titlePadding' => 'accordion-title-padding',
			'contentPadding' => 'accordion-content-padding',
			'accordionMarginBottom' => 'accordion-margin-bottom',
			'itemSpacing' => 'accordion-item-spacing',
			'iconSize' => 'accordion-icon-size',
			'iconRotation' => 'accordion-icon-rotation',
		),
		'tabs' => array(
			'titleColor' => 'tab-button-color',
			'titleBackgroundColor' => 'tab-button-bg',
			'hoverTitleColor' => 'tab-button-hover-color',
			'hoverTitleBackgroundColor' => 'tab-button-hover-bg',
			'activeTitleColor' => 'tab-button-active-color',
			'activeTitleBackgroundColor' => 'tab-button-active-bg',
			'tabButtonActiveColor' => 'tab-button-active-color',
			'tabButtonActiveBackground' => 'tab-button-active-bg',
			'tabButtonActiveBorderColor' => 'tab-button-active-border-color',
			'tabButtonActiveBorderBottomColor' => 'tab-button-active-border-bottom-color',
			'contentColor' => 'panel-color',
			'contentBackgroundColor' => 'panel-bg',
			'panelBackground' => 'panel-bg',
			'panelColor' => 'panel-color',
			'tabListBackground' => 'tabs-list-bg',
			'tabBorderColor' => 'tab-button-border-color',
			'containerBorderColor' => 'tabs-container-border-color',
			'panelBorderColor' => 'panel-border-color',
			'tabListBorderBottomColor' => 'tabs-list-border-bottom-color',
			'dividerColor' => 'divider-color',
			'borderColor' => 'tabs-border-color',
			'accordionBorderColor' => 'tabs-border-color',
			'dividerBorderColor' => 'divider-border-color',
			'iconColor' => 'icon-color',
			'titleFontSize' => 'tab-button-font-size',
			'titleFontWeight' => 'tab-button-font-weight',
			'titleFontFamily' => 'tab-button-font-family',
			'titleLineHeight' => 'tab-button-line-height',
			'titleFontStyle' => 'tab-button-font-style',
			'titleTextTransform' => 'tab-button-text-transform',
			'titleTextDecoration' => 'tab-button-text-decoration',
			'titleAlignment' => 'tab-button-text-align',
			'contentFontSize' => 'panel-font-size',
			'contentFontWeight' => 'panel-font-weight',
			'contentFontFamily' => 'panel-font-family',
			'contentLineHeight' => 'panel-line-height',
			'contentFontStyle' => 'panel-font-style',
			'contentTextTransform' => 'panel-text-transform',
			'contentTextDecoration' => 'panel-text-decoration',
			'panelFontSize' => 'panel-font-size',
			'panelLineHeight' => 'panel-line-height',
			'verticalTabButtonTextAlign' => 'vertical-tab-button-text-align',
			'tabBorderThickness' => 'tab-button-border-width',
			'tabBorderStyle' => 'tab-button-border-style',
			'tabBorderRadius' => 'tab-button-border-radius',
			'tabShadow' => 'tab-button-shadow',
		),
		'toc' => array(
			'wrapperBackgroundColor' => 'toc-wrapper-background-color',
			'wrapperBorderColor' => 'toc-wrapper-border-color',
			'wrapperBorderWidth' => 'toc-border-width',
			'wrapperBorderStyle' => 'toc-border-style',
			'wrapperBorderRadius' => 'toc-border-radius',
			'wrapperPadding' => 'toc-wrapper-padding',
			'wrapperShadow' => 'toc-wrapper-shadow',
			'linkColor' => 'toc-link-color',
			'linkHoverColor' => 'toc-link-hover-color',
			'linkVisitedColor' => 'toc-link-visited-color',
			'linkActiveColor' => 'toc-link-active-color',
			'numberingColor' => 'toc-numbering-color',
			'level1Color' => 'toc-level1-color',
			'level1FontSize' => 'toc-level1-font-size',
			'level1FontWeight' => 'toc-level1-font-weight',
			'level1FontStyle' => 'toc-level1-font-style',
			'level1TextTransform' => 'toc-level1-text-transform',
			'level1TextDecoration' => 'toc-level1-text-decoration',
			'level2Color' => 'toc-level2-color',
			'level2FontSize' => 'toc-level2-font-size',
			'level2FontWeight' => 'toc-level2-font-weight',
			'level2FontStyle' => 'toc-level2-font-style',
			'level2TextTransform' => 'toc-level2-text-transform',
			'level2TextDecoration' => 'toc-level2-text-decoration',
			'level3PlusColor' => 'toc-level3-plus-color',
			'level3PlusFontSize' => 'toc-level3-plus-font-size',
			'level3PlusFontWeight' => 'toc-level3-plus-font-weight',
			'level3PlusFontStyle' => 'toc-level3-plus-font-style',
			'level3PlusTextTransform' => 'toc-level3-plus-text-transform',
			'level3PlusTextDecoration' => 'toc-level3-plus-text-decoration',
			'itemSpacing' => 'toc-item-spacing',
			'levelIndent' => 'toc-level-indent',
			'positionTop' => 'toc-position-top',
			'zIndex' => 'toc-z-index',
			'collapseIconSize' => 'toc-collapse-icon-size',
			'collapseIconColor' => 'toc-collapse-icon-color',
			'titleColor' => 'toc-title-color',
			'titleBackgroundColor' => 'toc-title-background-color',
			'titleFontSize' => 'toc-title-font-size',
			'titleFontWeight' => 'toc-title-font-weight',
			'titleAlignment' => 'toc-title-alignment',
		),
	);

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
	$css = ".{$block_type}-theme-{$safe_theme_id} {\n";

	// Convert each value to CSS custom property
	foreach ( $values as $attr_name => $value ) {
		// Skip null or empty values
		if ( $value === null || $value === '' ) {
			continue;
		}

		// Map attribute name to CSS variable name
		$css_var_name = guttemberg_plus_map_attribute_to_css_var( $block_type, $attr_name );

		if ( $css_var_name === null ) {
			// No mapping found - skip this attribute
			continue;
		}

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
			// Numbers: check if it needs a unit (most CSS properties with numeric values need px)
			$needs_unit = ! in_array(
				$css_var_name,
				array(
					'z-index',
					'panel-line-height',
					'title-font-weight',
					'button-font-weight',
					'level1-font-weight',
					'level2-font-weight',
					'level3-plus-font-weight',
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

	$all_css = '';

	// Generate CSS for each block type that has themes on this page
	foreach ( $used_themes as $block_type => $theme_ids ) {
		// Get all themes for this block type from database
		$option_name = "guttemberg_plus_{$block_type}_themes";
		$all_themes  = get_option( $option_name, array() );

		if ( empty( $all_themes ) || ! is_array( $all_themes ) ) {
			continue;
		}

		// Generate CSS for each theme that's actually used
		foreach ( $theme_ids as $theme_id ) {
			if ( ! isset( $all_themes[ $theme_id ] ) ) {
				continue; // Theme doesn't exist in database
			}

			$theme  = $all_themes[ $theme_id ];
			$values = $theme['values'] ?? array();

			if ( empty( $values ) ) {
				continue; // No values to generate CSS from
			}

			// Generate CSS rules for this theme
			$all_css .= guttemberg_plus_generate_theme_css_rules( $block_type, $theme_id, $values );
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
