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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Get option name for block type
 *
 * Prefixed with 'guttemberg_plus_' to avoid conflicts with other plugins.
 *
 * @param string $block_type Block type ('accordion', 'tabs', 'toc').
 * @return string Option name
 */
function get_option_name( $block_type ) {
	return 'guttemberg_plus_' . $block_type . '_themes';
}

/**
 * Validate theme name
 *
 * @param string $name Theme name.
 * @return bool|WP_Error True if valid, WP_Error if invalid
 */
function validate_theme_name( $name ) {
	if ( empty( $name ) ) {
		return new \WP_Error(
			'invalid_name',
			__( 'Theme name cannot be empty', 'guttemberg-plus' )
		);
	}

	if ( strlen( $name ) > 50 ) {
		return new \WP_Error(
			'invalid_name',
			__( 'Theme name cannot exceed 50 characters', 'guttemberg-plus' )
		);
	}

	// Alphanumeric + spaces, hyphens, underscores only
	if ( ! preg_match( '/^[a-zA-Z0-9\s\-_]+$/', $name ) ) {
		return new \WP_Error(
			'invalid_name',
			__( 'Theme name can only contain letters, numbers, spaces, hyphens, and underscores', 'guttemberg-plus' )
		);
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
		return new \WP_Error(
			'invalid_block_type',
			__( 'Block type must be accordion, tabs, or toc', 'guttemberg-plus' )
		);
	}

	return true;
}

/**
 * Validate theme values array
 *
 * Ensures values is an array and contains only scalar values or arrays
 * to prevent serialization issues and potential security risks.
 *
 * @param mixed $values Theme values to validate.
 * @return bool|WP_Error True if valid, WP_Error if invalid
 */
function validate_theme_values( $values ) {
	if ( ! is_array( $values ) ) {
		return new \WP_Error(
			'invalid_values',
			__( 'Theme values must be an array', 'guttemberg-plus' )
		);
	}

	if ( empty( $values ) ) {
		return new \WP_Error(
			'empty_values',
			__( 'Theme values cannot be empty', 'guttemberg-plus' )
		);
	}

	// Validate each value is a safe type (no objects, resources, etc.)
	foreach ( $values as $key => $value ) {
		// Allow scalars (string, int, float, bool), null, and arrays
		if ( ! is_scalar( $value ) && ! is_null( $value ) && ! is_array( $value ) ) {
			return new \WP_Error(
				'invalid_value_type',
				/* translators: %s: Attribute key */
				sprintf( __( 'Invalid value type for attribute "%s". Only strings, numbers, booleans, null, and arrays are allowed.', 'guttemberg-plus' ), $key )
			);
		}

		// If it's an array, validate recursively
		if ( is_array( $value ) ) {
			$nested_validation = validate_theme_values( $value );
			if ( is_wp_error( $nested_validation ) ) {
				return $nested_validation;
			}
		}
	}

	return true;
}

/**
 * Get all themes for a block type
 * Validates and cleans up broken themes
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

	// Validate and filter out broken themes
	$valid_themes = array();
	$cleaned      = false;

	foreach ( $themes as $name => $theme ) {
		// Check if theme has required structure
		if ( ! is_array( $theme ) || ! isset( $theme['values'] ) ) {
			// Invalid theme structure - skip it
			$cleaned = true;
			error_log( "[Guttemberg Plus] Removing broken theme '$name' for block type '$block_type' - missing 'values' property" );
			continue;
		}

		// Check if values is an array
		if ( ! is_array( $theme['values'] ) ) {
			// Invalid values - skip it
			$cleaned = true;
			error_log( "[Guttemberg Plus] Removing broken theme '$name' for block type '$block_type' - 'values' is not an array" );
			continue;
		}

		// Theme is valid, keep it
		$valid_themes[ $name ] = $theme;
	}

	// If we removed broken themes, save the cleaned list
	if ( $cleaned ) {
		update_option( $option_name, $valid_themes );
	}

	return $valid_themes;
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
		return new \WP_Error(
			'theme_not_found',
			/* translators: %s: Theme name */
			sprintf( __( 'Theme "%s" not found', 'guttemberg-plus' ), $name ),
			array( 'status' => 404 )
		);
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

	$validation = validate_theme_values( $values );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	// Get existing themes
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check for duplicate
	if ( isset( $themes[ $name ] ) ) {
		return new \WP_Error(
			'duplicate_theme',
			/* translators: %s: Theme name */
			sprintf( __( 'Theme "%s" already exists', 'guttemberg-plus' ), $name ),
			array( 'status' => 409 )
		);
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

	$validation = validate_theme_values( $values );
	if ( is_wp_error( $validation ) ) {
		return $validation;
	}

	// Get existing themes (this validates and cleans up broken themes)
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check theme exists - if not, try to get raw themes in case theme exists but was broken
	$actual_name = $name;
	if ( ! isset( $themes[ $name ] ) ) {
		// Try to get raw themes without validation (in case theme was just cleaned up)
		$option_name = get_option_name( $block_type );
		$raw_themes  = get_option( $option_name, array() );

		if ( is_array( $raw_themes ) && isset( $raw_themes[ $name ] ) ) {
			// Theme exists but was broken - use it anyway
			$themes = $raw_themes;
		} else {
			// Try case-insensitive match as fallback
			$found_key = null;
			if ( is_array( $raw_themes ) ) {
				foreach ( $raw_themes as $key => $theme ) {
					// Try multiple matching strategies
					if ( strtolower( trim( $key ) ) === strtolower( trim( $name ) ) ) {
						$found_key = $key;
						break;
					}
					// Also try exact match
					if ( $key === $name ) {
						$found_key = $key;
						break;
					}
					// Try without spaces
					if ( str_replace( ' ', '', strtolower( $key ) ) === str_replace( ' ', '', strtolower( $name ) ) ) {
						$found_key = $key;
						break;
					}
				}
			}

			if ( $found_key ) {
				$actual_name = $found_key;
				$themes = $raw_themes;
			} else {
				// Theme truly doesn't exist
				return new \WP_Error(
					'theme_not_found',
					/* translators: %s: Theme name */
					sprintf( __( 'Theme "%s" not found', 'guttemberg-plus' ), $name ),
					array( 'status' => 404 )
				);
			}
		}
	}

	// Update theme (preserve created timestamp)
	$theme = array(
		'name'     => $actual_name,
		'values'   => $values,
		'created'  => $themes[ $actual_name ]['created'] ?? current_time( 'mysql' ),
		'modified' => current_time( 'mysql' ),
	);

	$themes[ $actual_name ] = $theme;

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

	// Get existing themes (this validates and cleans up broken themes)
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check theme exists - if not, try to get raw themes in case theme exists but was broken
	if ( ! isset( $themes[ $name ] ) ) {
		// Try to get raw themes without validation (in case theme was just cleaned up)
		$option_name = get_option_name( $block_type );
		$raw_themes  = get_option( $option_name, array() );

		if ( is_array( $raw_themes ) && isset( $raw_themes[ $name ] ) ) {
			// Theme exists but was broken - delete it anyway
			error_log( "[Guttemberg Plus] Deleting broken theme '$name'" );
			unset( $raw_themes[ $name ] );
			update_option( $option_name, $raw_themes, false );
			return true;
		}

		// Try case-insensitive match as fallback (in case of whitespace or case issues)
		$found_key = null;
		if ( is_array( $raw_themes ) ) {
			foreach ( $raw_themes as $key => $theme ) {
				// Try multiple matching strategies
				if ( strtolower( trim( $key ) ) === strtolower( trim( $name ) ) ) {
					$found_key = $key;
					break;
				}
				// Also try exact match (in case encoding issue)
				if ( $key === $name ) {
					$found_key = $key;
					break;
				}
				// Try without spaces
				if ( str_replace( ' ', '', strtolower( $key ) ) === str_replace( ' ', '', strtolower( $name ) ) ) {
					$found_key = $key;
					break;
				}
			}
		}

		if ( $found_key ) {
			unset( $raw_themes[ $found_key ] );
			update_option( $option_name, $raw_themes, false );
			return true;
		}
		return new \WP_Error(
			'theme_not_found',
			/* translators: %s: Theme name */
			sprintf( __( 'Theme "%s" not found', 'guttemberg-plus' ), $name ),
			array( 'status' => 404 )
		);
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

	// Get existing themes (this validates and cleans up broken themes)
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	// Check old theme exists - if not, try to get raw themes in case theme exists but was broken
	$actual_old_name = $old_name;
	if ( ! isset( $themes[ $old_name ] ) ) {
		// Try to get raw themes without validation (in case theme was just cleaned up)
		$option_name = get_option_name( $block_type );
		$raw_themes  = get_option( $option_name, array() );

		if ( ! is_array( $raw_themes ) ) {
			return new \WP_Error(
				'theme_not_found',
				/* translators: %s: Theme name */
				sprintf( __( 'Theme "%s" not found', 'guttemberg-plus' ), $old_name ),
				array( 'status' => 404 )
			);
		}

		if ( isset( $raw_themes[ $old_name ] ) ) {
			// Theme exists but is broken - use raw version
			$themes = $raw_themes;
		} else {
			// Try case-insensitive match as fallback
			$found_key = null;

			foreach ( $raw_themes as $key => $theme ) {
				// Try multiple matching strategies
				if ( strtolower( trim( $key ) ) === strtolower( trim( $old_name ) ) ) {
					$found_key = $key;
					break;
				}
				// Also try exact match
				if ( $key === $old_name ) {
					$found_key = $key;
					break;
				}
				// Try without spaces
				if ( str_replace( ' ', '', strtolower( $key ) ) === str_replace( ' ', '', strtolower( $old_name ) ) ) {
					$found_key = $key;
					break;
				}
			}

			if ( $found_key ) {
				$actual_old_name = $found_key;
				$themes = $raw_themes;
			} else {
				// Theme truly doesn't exist
				return new \WP_Error(
					'theme_not_found',
					/* translators: %s: Theme name */
					sprintf( __( 'Theme "%s" not found', 'guttemberg-plus' ), $old_name ),
					array( 'status' => 404 )
				);
			}
		}
	}

	// Check new name not duplicate (unless same as old)
	if ( $actual_old_name !== $new_name && isset( $themes[ $new_name ] ) ) {
		return new \WP_Error(
			'duplicate_theme',
			/* translators: %s: Theme name */
			sprintf( __( 'Theme "%s" already exists', 'guttemberg-plus' ), $new_name ),
			array( 'status' => 409 )
		);
	}

	// Rename theme
	$theme         = $themes[ $actual_old_name ];
	$theme['name'] = $new_name;

	unset( $themes[ $actual_old_name ] );
	$themes[ $new_name ] = $theme;

	// Save to database
	$option_name = get_option_name( $block_type );
	update_option( $option_name, $themes, false );

	return $theme;
}
