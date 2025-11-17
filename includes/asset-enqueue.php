<?php
/**
 * Asset Enqueue
 *
 * Handles enqueuing of JavaScript and CSS assets for blocks.
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
 * Loads scripts and styles needed in the WordPress block editor.
 */
function guttemberg_plus_enqueue_editor_assets() {
	// Accordion Editor Script
	$accordion_asset_file = GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/accordion/build/index.asset.php';
	if ( file_exists( $accordion_asset_file ) ) {
		$accordion_asset = require $accordion_asset_file;

		wp_enqueue_script(
			'guttemberg-plus-accordion-editor',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'blocks/accordion/build/index.js',
			$accordion_asset['dependencies'],
			$accordion_asset['version'],
			true
		);

		// Enqueue CSS defaults for accordion
		if ( function_exists( 'gutenberg_blocks_enqueue_css_defaults' ) ) {
			gutenberg_blocks_enqueue_css_defaults(
				'accordion',
				'guttemberg-plus-accordion-editor'
			);
		}

		// Set translations
		wp_set_script_translations(
			'guttemberg-plus-accordion-editor',
			'guttemberg-plus',
			GUTTEMBERG_PLUS_PLUGIN_DIR . 'languages'
		);
	}

	// Tabs Editor Script
	$tabs_asset_file = GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/tabs/build/index.asset.php';
	if ( file_exists( $tabs_asset_file ) ) {
		$tabs_asset = require $tabs_asset_file;

		wp_enqueue_script(
			'guttemberg-plus-tabs-editor',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'blocks/tabs/build/index.js',
			$tabs_asset['dependencies'],
			$tabs_asset['version'],
			true
		);

		if ( function_exists( 'gutenberg_blocks_enqueue_css_defaults' ) ) {
			gutenberg_blocks_enqueue_css_defaults( 'tabs', 'guttemberg-plus-tabs-editor' );
		}

		wp_set_script_translations( 'guttemberg-plus-tabs-editor', 'guttemberg-plus' );
	}

	// TOC Editor Script
	$toc_asset_file = GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/toc/build/index.asset.php';
	if ( file_exists( $toc_asset_file ) ) {
		$toc_asset = require $toc_asset_file;

		wp_enqueue_script(
			'guttemberg-plus-toc-editor',
			GUTTEMBERG_PLUS_PLUGIN_URL . 'blocks/toc/build/index.js',
			$toc_asset['dependencies'],
			$toc_asset['version'],
			true
		);

		if ( function_exists( 'gutenberg_blocks_enqueue_css_defaults' ) ) {
			gutenberg_blocks_enqueue_css_defaults( 'toc', 'guttemberg-plus-toc-editor' );
		}

		wp_set_script_translations( 'guttemberg-plus-toc-editor', 'guttemberg-plus' );
	}
}
add_action( 'enqueue_block_editor_assets', 'guttemberg_plus_enqueue_editor_assets' );

/**
 * Enqueue frontend assets
 *
 * Only loads assets when blocks are actually used on the page.
 */
function guttemberg_plus_enqueue_frontend_assets() {
	// Accordion Frontend Script
	if ( has_block( 'custom/accordion' ) ) {
		$accordion_frontend_file = GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/accordion/build/frontend.asset.php';
		if ( file_exists( $accordion_frontend_file ) ) {
			$accordion_frontend = require $accordion_frontend_file;

			wp_enqueue_script(
				'guttemberg-plus-accordion-frontend',
				GUTTEMBERG_PLUS_PLUGIN_URL . 'blocks/accordion/build/frontend.js',
				$accordion_frontend['dependencies'],
				$accordion_frontend['version'],
				true
			);
		}

		// Enqueue accordion styles
		if ( file_exists( GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/accordion/build/style-index.css' ) ) {
			wp_enqueue_style(
				'guttemberg-plus-accordion-style',
				GUTTEMBERG_PLUS_PLUGIN_URL . 'blocks/accordion/build/style-index.css',
				array(),
				GUTTEMBERG_PLUS_VERSION
			);
		}
	}

	// Tabs Frontend Script
	if ( has_block( 'custom/tabs' ) ) {
		$tabs_frontend_file = GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/tabs/build/frontend.asset.php';
		if ( file_exists( $tabs_frontend_file ) ) {
			$tabs_frontend = require $tabs_frontend_file;

			wp_enqueue_script(
				'guttemberg-plus-tabs-frontend',
				GUTTEMBERG_PLUS_PLUGIN_URL . 'blocks/tabs/build/frontend.js',
				$tabs_frontend['dependencies'],
				$tabs_frontend['version'],
				true
			);
		}

		// Enqueue tabs styles
		if ( file_exists( GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/tabs/build/style-index.css' ) ) {
			wp_enqueue_style(
				'guttemberg-plus-tabs-style',
				GUTTEMBERG_PLUS_PLUGIN_URL . 'blocks/tabs/build/style-index.css',
				array(),
				GUTTEMBERG_PLUS_VERSION
			);
		}
	}

	// TOC Frontend (if build files exist)
	if ( has_block( 'custom/toc' ) ) {
		// TOC frontend assets will be added when build is complete
	}
}
add_action( 'wp_enqueue_scripts', 'guttemberg_plus_enqueue_frontend_assets' );
