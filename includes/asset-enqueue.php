<?php
/**
 * Asset Enqueue
 *
 * Handles enqueuing of CSS assets for blocks.
 * JavaScript assets are automatically enqueued via block.json.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue block editor assets
 *
 * Loads styles needed in the WordPress block editor.
 */
function guttemberg_plus_enqueue_editor_assets() {
	// Enqueue CSS for all blocks in editor
	wp_enqueue_style(
		'guttemberg-plus-accordion-editor-style',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-tabs-editor-style',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-toc-editor-style',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);
}
add_action( 'enqueue_block_editor_assets', 'guttemberg_plus_enqueue_editor_assets' );

/**
 * Enqueue frontend assets
 *
 * Only loads assets when blocks are actually used on the page.
 */
function guttemberg_plus_enqueue_frontend_assets() {
	// Accordion Frontend
	if ( has_block( 'custom/accordion' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-accordion-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	// Tabs Frontend
	if ( has_block( 'custom/tabs' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-tabs-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	// TOC Frontend
	if ( has_block( 'custom/toc' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-toc-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}
}
add_action( 'wp_enqueue_scripts', 'guttemberg_plus_enqueue_frontend_assets' );
