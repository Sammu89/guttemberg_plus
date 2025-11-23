<?php
/**
 * Asset Enqueue
 *
 * Enqueues CSS files for blocks on both frontend and editor.
 * Two CSS files per block:
 * - Variables CSS: CSS custom properties with default values (Tier 1)
 * - Block CSS: Block styling that uses those variables (Tier 2)
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue CSS files for blocks on frontend (conditional based on block presence)
 */
function guttemberg_plus_enqueue_frontend_block_styles() {
	// Only enqueue if blocks are present on the current page
	if ( has_block( 'custom/accordion' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-accordion-variables',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion-variables.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
		wp_enqueue_style(
			'guttemberg-plus-accordion-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/accordion/accordion.css',
			array( 'guttemberg-plus-accordion-variables' ),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	if ( has_block( 'custom/tabs' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-tabs-variables',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs-variables.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
		wp_enqueue_style(
			'guttemberg-plus-tabs-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/tabs/tabs.css',
			array( 'guttemberg-plus-tabs-variables' ),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	if ( has_block( 'custom/toc' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-toc-variables',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc-variables.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
		wp_enqueue_style(
			'guttemberg-plus-toc-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/toc/toc.css',
			array( 'guttemberg-plus-toc-variables' ),
			GUTTEMBERG_PLUS_VERSION
		);
	}
}

/**
 * Enqueue CSS files for blocks in editor (always enqueue all)
 */
function guttemberg_plus_enqueue_editor_block_styles() {
	// Always enqueue all styles in editor for block availability
	wp_enqueue_style(
		'guttemberg-plus-accordion-variables',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion-variables.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);
	wp_enqueue_style(
		'guttemberg-plus-accordion-style',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/accordion/accordion.css',
		array( 'guttemberg-plus-accordion-variables' ),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-tabs-variables',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs-variables.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);
	wp_enqueue_style(
		'guttemberg-plus-tabs-style',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/tabs/tabs.css',
		array( 'guttemberg-plus-tabs-variables' ),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-toc-variables',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc-variables.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);
	wp_enqueue_style(
		'guttemberg-plus-toc-style',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/toc/toc.css',
		array( 'guttemberg-plus-toc-variables' ),
		GUTTEMBERG_PLUS_VERSION
	);
}

// Conditional enqueue on frontend, always on editor
add_action( 'wp_enqueue_scripts', 'guttemberg_plus_enqueue_frontend_block_styles' );
add_action( 'enqueue_block_editor_assets', 'guttemberg_plus_enqueue_editor_block_styles' );
