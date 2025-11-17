<?php
/**
 * Asset Enqueue
 *
 * Additional asset handling for blocks.
 * Note: Block JavaScript and CSS are primarily handled via block.json.
 * This file is for supplementary assets like CSS variable defaults.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue CSS variable defaults in the block editor
 *
 * These CSS files contain :root variables that define default values
 * for the theme cascade system. They are separate from the block styles.
 */
function guttemberg_plus_enqueue_editor_assets() {
	wp_enqueue_style(
		'guttemberg-plus-accordion-defaults',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-tabs-defaults',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-toc-defaults',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);
}
add_action( 'enqueue_block_editor_assets', 'guttemberg_plus_enqueue_editor_assets' );

/**
 * Enqueue CSS variable defaults on frontend
 *
 * Only loaded when blocks are actually used on the page.
 */
function guttemberg_plus_enqueue_frontend_assets() {
	if ( has_block( 'custom/accordion' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-accordion-defaults',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	if ( has_block( 'custom/tabs' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-tabs-defaults',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	if ( has_block( 'custom/toc' ) ) {
		wp_enqueue_style(
			'guttemberg-plus-toc-defaults',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}
}
add_action( 'wp_enqueue_scripts', 'guttemberg_plus_enqueue_frontend_assets' );
