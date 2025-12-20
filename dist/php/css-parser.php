<?php
/**
 * CSS Parser Utilities
 *
 * Loads CSS default values generated from :root variables
 * Provides caching for optimal performance
 *
 * @package GutenbergBlocks
 * @since 1.0.0
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load CSS defaults for a specific block type
 *
 * Loads the generated PHP array from php/css-defaults/{blockType}.php
 * Caches results using WordPress transients with file modification time
 *
 * @param string $block_type Block type (accordion, tabs, or toc)
 * @return array CSS default values as associative array, empty array if file doesn't exist
 */
function gutenberg_blocks_load_css_defaults( $block_type ) {
	// Validate block type
	$allowed_types = array( 'accordion', 'tabs', 'toc' );
	if ( ! in_array( $block_type, $allowed_types, true ) ) {
		return array();
	}

	// Build file path
	$file_path = plugin_dir_path( __FILE__ ) . 'css-defaults/' . $block_type . '.php';

	// Check if file exists
	if ( ! file_exists( $file_path ) ) {
		return array();
	}

	// Get file modification time for cache key
	$file_mtime = filemtime( $file_path );
	$cache_key  = 'gutenberg_blocks_css_defaults_' . $block_type . '_' . $file_mtime;

	// Try to get from cache
	$cached_defaults = wp_cache_get( $cache_key, 'gutenberg-blocks' );
	if ( false !== $cached_defaults ) {
		return $cached_defaults;
	}

	// Load from file
	// The file returns an array, so we can include it directly
	$defaults = include $file_path;

	// Validate that we got an array
	if ( ! is_array( $defaults ) ) {
		$defaults = array();
	}

	// Cache the result
	// Using non-persistent cache (wp_cache) for performance
	wp_cache_set( $cache_key, $defaults, 'gutenberg-blocks' );

	return $defaults;
}

/**
 * Get a specific CSS default value for a block type
 *
 * @param string $block_type Block type (accordion, tabs, or toc)
 * @param string $attribute Attribute name (e.g., 'defaultTitleColor')
 * @return mixed|null The default value, or null if not found
 */
function gutenberg_blocks_get_css_default( $block_type, $attribute ) {
	$defaults = gutenberg_blocks_load_css_defaults( $block_type );

	if ( isset( $defaults[ $attribute ] ) ) {
		return $defaults[ $attribute ];
	}

	return null;
}

/**
 * Enqueue CSS defaults for block editor
 *
 * Makes CSS defaults available to JavaScript via window object
 * Call this in the block registration to pass defaults to the editor
 *
 * @param string $block_type Block type (accordion, tabs, or toc)
 * @param string $handle Script handle to attach data to
 */
function gutenberg_blocks_enqueue_css_defaults( $block_type, $handle ) {
	$defaults = gutenberg_blocks_load_css_defaults( $block_type );

	// Convert defaults to camelCase for JavaScript
	// Remove 'default' prefix if present
	$js_defaults = array();
	foreach ( $defaults as $key => $value ) {
		// Remove 'default' prefix (e.g., 'defaultTitleColor' -> 'titleColor')
		if ( strpos( $key, 'default' ) === 0 ) {
			$clean_key = lcfirst( substr( $key, 7 ) );
		} else {
			$clean_key = $key;
		}
		$js_defaults[ $clean_key ] = $value;
	}

	// Make available to JavaScript as window.{blockType}Defaults
	$object_name = $block_type . 'Defaults';
	wp_localize_script( $handle, $object_name, $js_defaults );
}

/**
 * Clear CSS defaults cache
 *
 * Useful after build or when CSS files change
 * Cache will automatically regenerate on next request
 *
 * @param string|null $block_type Specific block type to clear, or null for all
 */
function gutenberg_blocks_clear_css_defaults_cache( $block_type = null ) {
	if ( null !== $block_type ) {
		// Clear specific block type
		$allowed_types = array( 'accordion', 'tabs', 'toc' );
		if ( ! in_array( $block_type, $allowed_types, true ) ) {
			return;
		}

		// Clear all possible cache keys for this block type
		// We don't know the exact mtime, so we'll let it expire naturally
		// or rely on WordPress cache flushing
		wp_cache_flush();
	} else {
		// Clear all caches
		wp_cache_flush();
	}
}
