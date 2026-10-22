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
 * Enqueue Dashicons for both editor and frontend
 *
 * Uses enqueue_block_assets instead of enqueue_block_editor_assets
 * to ensure assets load in the iframed editor (WordPress 6.3+)
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/enqueueing-assets-in-the-editor/
 */
function guttemberg_plus_enqueue_block_assets() {
	// Enqueue Dashicons for icon library support
	// This loads in both editor and frontend
	wp_enqueue_style( 'dashicons' );
}
add_action( 'enqueue_block_assets', 'guttemberg_plus_enqueue_block_assets' );

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
	// Note: Dashicons are now globally enqueued via enqueue_block_assets hook
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
	// Note: Dashicons are now globally enqueued via enqueue_block_assets hook
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
	// Note: Dashicons are now globally enqueued via enqueue_block_assets hook
	return $content;
}
