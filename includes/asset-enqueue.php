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
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion-generated.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-tabs-defaults',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs-generated.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);

	wp_enqueue_style(
		'guttemberg-plus-toc-defaults',
		GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc-generated.css',
		array(),
		GUTTEMBERG_PLUS_VERSION
	);
}
add_action( 'enqueue_block_editor_assets', 'guttemberg_plus_enqueue_editor_assets' );

/**
 * Enqueue CSS variable defaults and block styles on frontend
 *
 * Only loaded when blocks are actually used on the page.
 */
function guttemberg_plus_enqueue_frontend_assets() {
	// Debug: Log which blocks are detected
	$has_accordion = has_block( 'custom/accordion' );
	$has_tabs = has_block( 'custom/tabs' );
	$has_toc = has_block( 'custom/toc' );

	error_log( '[GUTTEMBERG DEBUG] Block detection: accordion=' . ( $has_accordion ? 'YES' : 'NO' ) . ', tabs=' . ( $has_tabs ? 'YES' : 'NO' ) . ', toc=' . ( $has_toc ? 'YES' : 'NO' ) );

	if ( $has_accordion ) {
		// Enqueue CSS defaults (Tier 1)
		wp_enqueue_style(
			'guttemberg-plus-accordion-defaults',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/accordion-generated.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);

		// Enqueue block styles
		wp_enqueue_style(
			'guttemberg-plus-accordion-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/accordion/style-index.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	if ( $has_tabs ) {
		// Enqueue CSS defaults (Tier 1)
		wp_enqueue_style(
			'guttemberg-plus-tabs-defaults',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/tabs-generated.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);

		// Enqueue block styles
		wp_enqueue_style(
			'guttemberg-plus-tabs-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/tabs/style-index.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}

	if ( $has_toc ) {
		// Enqueue CSS defaults (Tier 1)
		wp_enqueue_style(
			'guttemberg-plus-toc-defaults',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'assets/css/toc-generated.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);

		// Enqueue block styles
		wp_enqueue_style(
			'guttemberg-plus-toc-style',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'build/blocks/toc/style-index.css',
			array(),
			GUTTEMBERG_PLUS_VERSION
		);
	}
}
add_action( 'wp_enqueue_scripts', 'guttemberg_plus_enqueue_frontend_assets' );
