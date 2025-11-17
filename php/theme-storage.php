<?php
/**
 * Theme Storage System
 *
 * CRUD operations for theme storage in wp_options table
 * Event-isolated storage per block type
 *
 * @package GutenbergBlocks
 * @see docs/CORE-ARCHITECTURE/12-THEME-SYSTEM.md
 */

namespace GutenbergBlocks\ThemeStorage;

/**
 * Get option name for block type
 *
 * @param string $block_type Block type ('accordion', 'tabs', 'toc').
 * @return string Option name
 */
function get_option_name( $block_type ) {
	return $block_type . '_themes';
}

/**
 * Validate theme name
 *
 * @param string $name Theme name.
 * @return bool|WP_Error True if valid, WP_Error if invalid
 */
function validate_theme_name( $name ) {
	if ( empty( $name ) ) {
		return new \WP_Error( 'invalid_name', 'Theme name cannot be empty' );
	}

	if ( strlen( $name ) > 50 ) {
		return new \WP_Error( 'invalid_name', 'Theme name cannot exceed 50 characters' );
	}

	// Alphanumeric + spaces, hyphens, underscores only
	if ( ! preg_match( '/^[a-zA-Z0-9\s\-_]+$/', $name ) ) {
		return new \WP_Error( 'invalid_name', 'Theme name can only contain letters, numbers, spaces, hyphens, and underscores' );
	}

	return true;
}

/**
 * Validate block type
 *
 * @param string $block_type Block type.
 * @return bool|WP_Error True if valid, WP_Error if invalid
 */
function validate_block_type( $block_type ) {
	$valid_types = array( 'accordion', 'tabs', 'toc' );

	if ( ! in_array( $block_type, $valid_types, true ) ) {
		return new \WP_Error( 'invalid_block_type', 'Block type must be accordion, tabs, or toc' );
	}

	return true;
}

/**
 * Get all themes for a block type
 *
 * @param string $block_type Block type.
 * @return array|WP_Error Themes array or WP_Error
 */
function get_block_themes( $block_type ) {
	$validation = validate_block_type( $block_type );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	$option_name = get_option_name( $block_type );
	$themes      = get_option( $option_name, array() );

	// Ensure it's an array
	if ( ! is_array( $themes ) ) {
		$themes = array();
	}

	return $themes;
}

/**
 * Get a specific theme
 *
 * @param string $block_type Block type.
 * @param string $name Theme name.
 * @return array|WP_Error Theme data or WP_Error
 */
function get_theme( $block_type, $name ) {
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	if ( ! isset( $themes[ $name ] ) ) {
		return new \WP_Error( 'theme_not_found', "Theme '$name' not found", array( 'status' => 404 ) );
	}

	return $themes[ $name ];
}

/**
 * Create a new theme
 *
 * @param string $block_type Block type.
 * @param string $name Theme name (must be unique).
 * @param array  $values Complete snapshot of attribute values.
 * @return array|WP_Error Created theme or WP_Error
 */
function create_block_theme( $block_type, $name, $values ) {
	// Validate inputs
	$validation = validate_block_type( $block_type );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	$validation = validate_theme_name( $name );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	if ( ! is_array( $values ) ) {
		return new \WP_Error( 'invalid_values', 'Values must be an array' );
	}

	// Get existing themes
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check for duplicate
	if ( isset( $themes[ $name ] ) ) {
		return new \WP_Error( 'duplicate_theme', "Theme '$name' already exists", array( 'status' => 409 ) );
	}

	// Create theme object with timestamps
	$theme = array(
		'name'     => $name,
		'values'   => $values,
		'created'  => current_time( 'mysql' ),
		'modified' => current_time( 'mysql' ),
	);

	// Add to themes array
	$themes[ $name ] = $theme;

	// Save to database
	$option_name = get_option_name( $block_type );
	update_option( $option_name, $themes, false ); // autoload = false

	return $theme;
}

/**
 * Update an existing theme
 *
 * @param string $block_type Block type.
 * @param string $name Theme name.
 * @param array  $values New complete snapshot.
 * @return array|WP_Error Updated theme or WP_Error
 */
function update_block_theme( $block_type, $name, $values ) {
	// Validate inputs
	$validation = validate_block_type( $block_type );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	$validation = validate_theme_name( $name );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	if ( ! is_array( $values ) ) {
		return new \WP_Error( 'invalid_values', 'Values must be an array' );
	}

	// Get existing themes
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check theme exists
	if ( ! isset( $themes[ $name ] ) ) {
		return new \WP_Error( 'theme_not_found', "Theme '$name' not found", array( 'status' => 404 ) );
	}

	// Update theme (preserve created timestamp)
	$theme = array(
		'name'     => $name,
		'values'   => $values,
		'created'  => $themes[ $name ]['created'] ?? current_time( 'mysql' ),
		'modified' => current_time( 'mysql' ),
	);

	$themes[ $name ] = $theme;

	// Save to database
	$option_name = get_option_name( $block_type );
	update_option( $option_name, $themes, false );

	return $theme;
}

/**
 * Delete a theme
 *
 * @param string $block_type Block type.
 * @param string $name Theme name.
 * @return bool|WP_Error True on success, WP_Error on failure
 */
function delete_block_theme( $block_type, $name ) {
	// Validate inputs
	$validation = validate_block_type( $block_type );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	$validation = validate_theme_name( $name );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	// Get existing themes
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check theme exists
	if ( ! isset( $themes[ $name ] ) ) {
		return new \WP_Error( 'theme_not_found', "Theme '$name' not found", array( 'status' => 404 ) );
	}

	// Remove theme
	unset( $themes[ $name ] );

	// Save to database
	$option_name = get_option_name( $block_type );
	update_option( $option_name, $themes, false );

	return true;
}

/**
 * Rename a theme
 *
 * @param string $block_type Block type.
 * @param string $old_name Current theme name.
 * @param string $new_name New theme name.
 * @return array|WP_Error Renamed theme or WP_Error
 */
function rename_block_theme( $block_type, $old_name, $new_name ) {
	// Validate inputs
	$validation = validate_block_type( $block_type );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	$validation = validate_theme_name( $old_name );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	$validation = validate_theme_name( $new_name );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	// Get existing themes
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check old theme exists
	if ( ! isset( $themes[ $old_name ] ) ) {
		return new \WP_Error( 'theme_not_found', "Theme '$old_name' not found", array( 'status' => 404 ) );
	}

	// Check new name not duplicate (unless same as old)
	if ( $old_name !== $new_name && isset( $themes[ $new_name ] ) ) {
		return new \WP_Error( 'duplicate_theme', "Theme '$new_name' already exists", array( 'status' => 409 ) );
	}

	// Rename theme
	$theme         = $themes[ $old_name ];
	$theme['name'] = $new_name;

	unset( $themes[ $old_name ] );
	$themes[ $new_name ] = $theme;

	// Save to database
	$option_name = get_option_name( $block_type );
	update_option( $option_name, $themes, false );

	return $theme;
}
