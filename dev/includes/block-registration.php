<?php
/**
 * Block Registration
 *
 * Registers all Gutenberg blocks for the plugin.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all blocks
 */
function guttemberg_plus_register_blocks() {
	// Register Accordion Block
	register_block_type(
		GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/accordion',
		array(
			'render_callback' => 'guttemberg_plus_render_accordion_block',
		)
	);

	// Register Tabs Block
	register_block_type(
		GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/tabs',
		array(
			'render_callback' => 'guttemberg_plus_render_tabs_block',
		)
	);

	// Register TOC Block
	register_block_type(
		GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/toc',
		array(
			'render_callback' => 'guttemberg_plus_render_toc_block',
		)
	);
}
add_action( 'init', 'guttemberg_plus_register_blocks' );

/**
 * Enqueue Dashicons in the block editor
 * Required for Dashicons to show in icon picker and editor preview
 */
function guttemberg_plus_enqueue_editor_assets() {
	wp_enqueue_style( 'dashicons' );
}
add_action( 'enqueue_block_editor_assets', 'guttemberg_plus_enqueue_editor_assets' );

/**
 * Render callback for Accordion block
 *
 * Server-side rendering not strictly necessary for this block,
 * but included for potential dynamic content in the future.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block content.
 * @return string Block HTML.
 */
function guttemberg_plus_render_accordion_block( $attributes, $content ) {
	// Enqueue Dashicons on frontend to support library icons
	// Dashicons are needed for icon library functionality
	if ( ! is_admin() ) {
		wp_enqueue_style( 'dashicons' );
	}

	// Return the content as-is
	return $content;
}

/**
 * Render callback for Tabs block
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block content.
 * @return string Block HTML.
 */
function guttemberg_plus_render_tabs_block( $attributes, $content ) {
	// Enqueue Dashicons on frontend to support library icons
	if ( ! is_admin() ) {
		wp_enqueue_style( 'dashicons' );
	}

	return $content;
}

/**
 * Render callback for TOC block
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block content.
 * @return string Block HTML.
 */
function guttemberg_plus_render_toc_block( $attributes, $content ) {
	// Enqueue Dashicons on frontend to support library icons
	if ( ! is_admin() ) {
		wp_enqueue_style( 'dashicons' );
	}

	return $content;
}
