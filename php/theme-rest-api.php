<?php
/**
 * Theme REST API Endpoints
 *
 * Registers REST API routes for theme CRUD operations
 * All endpoints require 'edit_posts' capability
 *
 * @package GutenbergBlocks
 * @see docs/IMPLEMENTATION/24-WORDPRESS-INTEGRATION.md
 */

namespace GutenbergBlocks\ThemeRestAPI;

use GutenbergBlocks\ThemeStorage;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Register REST API routes
 */
function register_routes() {
	// Base namespace for all routes
	$namespace = 'gutenberg-blocks/v1';

	// GET /themes/{blockType} - Get all themes
	register_rest_route(
		$namespace,
		'/themes/(?P<blockType>accordion|tabs|toc)',
		array(
			'methods'             => 'GET',
			'callback'            => __NAMESPACE__ . '\\get_themes_handler',
			'permission_callback' => __NAMESPACE__ . '\\check_permissions',
			'args'                => array(
				'blockType' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return in_array( $param, array( 'accordion', 'tabs', 'toc' ), true );
					},
				),
			),
		)
	);

	// POST /themes - Create new theme
	register_rest_route(
		$namespace,
		'/themes',
		array(
			'methods'             => 'POST',
			'callback'            => __NAMESPACE__ . '\\create_theme_handler',
			'permission_callback' => __NAMESPACE__ . '\\check_permissions',
			'args'                => array(
				'blockType' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return in_array( $param, array( 'accordion', 'tabs', 'toc' ), true );
					},
				),
				'name'      => array(
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
				'values'    => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_array( $param );
					},
				),
			),
		)
	);

	// PUT /themes/{blockType}/{name} - Update theme
	register_rest_route(
		$namespace,
		'/themes/(?P<blockType>accordion|tabs|toc)/(?P<name>[^/]+)',
		array(
			'methods'             => 'PUT',
			'callback'            => __NAMESPACE__ . '\\update_theme_handler',
			'permission_callback' => __NAMESPACE__ . '\\check_permissions',
			'args'                => array(
				'blockType' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return in_array( $param, array( 'accordion', 'tabs', 'toc' ), true );
					},
				),
				'name'      => array(
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
				'values'    => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_array( $param );
					},
				),
			),
		)
	);

	// DELETE /themes/{blockType}/{name} - Delete theme
	register_rest_route(
		$namespace,
		'/themes/(?P<blockType>accordion|tabs|toc)/(?P<name>[^/]+)',
		array(
			'methods'             => 'DELETE',
			'callback'            => __NAMESPACE__ . '\\delete_theme_handler',
			'permission_callback' => __NAMESPACE__ . '\\check_permissions',
			'args'                => array(
				'blockType' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return in_array( $param, array( 'accordion', 'tabs', 'toc' ), true );
					},
				),
				'name'      => array(
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		)
	);

	// POST /themes/{blockType}/{name}/rename - Rename theme
	register_rest_route(
		$namespace,
		'/themes/(?P<blockType>accordion|tabs|toc)/(?P<name>[^/]+)/rename',
		array(
			'methods'             => 'POST',
			'callback'            => __NAMESPACE__ . '\\rename_theme_handler',
			'permission_callback' => __NAMESPACE__ . '\\check_permissions',
			'args'                => array(
				'blockType' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return in_array( $param, array( 'accordion', 'tabs', 'toc' ), true );
					},
				),
				'name'      => array(
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
				'newName'   => array(
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		)
	);
}

add_action( 'rest_api_init', __NAMESPACE__ . '\\register_routes' );

/**
 * Permission callback - Check if user can edit posts
 *
 * For READ operations: Contributors and above (edit_posts)
 * For WRITE operations: Editors and above (edit_others_posts)
 *
 * @param WP_REST_Request $request Request object.
 * @return bool True if user has permission
 */
function check_permissions( $request ) {
	$method = $request->get_method();

	// Read operations: contributors and above
	if ( $method === 'GET' ) {
		return current_user_can( 'edit_posts' );
	}

	// Write operations: editors and above
	// This prevents contributors from modifying site-wide themes
	if ( in_array( $method, array( 'POST', 'PUT', 'DELETE' ), true ) ) {
		return current_user_can( 'edit_others_posts' );
	}

	return false;
}

/**
 * GET /themes/{blockType} - Get all themes for block type
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response or error
 */
function get_themes_handler( $request ) {
	$block_type = $request->get_param( 'blockType' );

	$themes = ThemeStorage\get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return new \WP_Error(
			$themes->get_error_code(),
			$themes->get_error_message(),
			array( 'status' => 400 )
		);
	}

	return rest_ensure_response( $themes );
}

/**
 * POST /themes - Create new theme
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response or error
 */
function create_theme_handler( $request ) {
	$block_type = $request->get_param( 'blockType' );
	$name       = $request->get_param( 'name' );
	$values     = $request->get_param( 'values' );

	error_log( '[THEME CREATE DEBUG PHP] Creating theme: ' . $name . ' for block: ' . $block_type );
	error_log( '[THEME CREATE DEBUG PHP] Values: ' . print_r( $values, true ) );

	$theme = ThemeStorage\create_block_theme( $block_type, $name, $values );

	if ( is_wp_error( $theme ) ) {
		error_log( '[THEME CREATE DEBUG PHP] Error creating theme: ' . $theme->get_error_message() );
		$status = 400;
		if ( isset( $theme->error_data[ $theme->get_error_code() ]['status'] ) ) {
			$status = $theme->error_data[ $theme->get_error_code() ]['status'];
		}

		return new \WP_Error(
			$theme->get_error_code(),
			$theme->get_error_message(),
			array( 'status' => $status )
		);
	}

	error_log( '[THEME CREATE DEBUG PHP] Theme created successfully: ' . print_r( $theme, true ) );
	return rest_ensure_response( $theme );
}

/**
 * PUT /themes/{blockType}/{name} - Update theme
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response or error
 */
function update_theme_handler( $request ) {
	$block_type = $request->get_param( 'blockType' );
	$name       = urldecode( $request->get_param( 'name' ) );
	$values     = $request->get_param( 'values' );

	$theme = ThemeStorage\update_block_theme( $block_type, $name, $values );

	if ( is_wp_error( $theme ) ) {
		$status = 400;
		if ( isset( $theme->error_data[ $theme->get_error_code() ]['status'] ) ) {
			$status = $theme->error_data[ $theme->get_error_code() ]['status'];
		}

		return new \WP_Error(
			$theme->get_error_code(),
			$theme->get_error_message(),
			array( 'status' => $status )
		);
	}

	return rest_ensure_response( $theme );
}

/**
 * DELETE /themes/{blockType}/{name} - Delete theme
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response or error
 */
function delete_theme_handler( $request ) {
	$block_type = $request->get_param( 'blockType' );
	$name       = urldecode( $request->get_param( 'name' ) );

	$result = ThemeStorage\delete_block_theme( $block_type, $name );

	if ( is_wp_error( $result ) ) {
		$status = 400;
		if ( isset( $result->error_data[ $result->get_error_code() ]['status'] ) ) {
			$status = $result->error_data[ $result->get_error_code() ]['status'];
		}

		return new \WP_Error(
			$result->get_error_code(),
			$result->get_error_message(),
			array( 'status' => $status )
		);
	}

	return rest_ensure_response(
		array(
			'success' => true,
			/* translators: %s: Theme name */
			'message' => sprintf( __( 'Theme "%s" deleted successfully', 'guttemberg-plus' ), $name ),
		)
	);
}

/**
 * POST /themes/{blockType}/{name}/rename - Rename theme
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response or error
 */
function rename_theme_handler( $request ) {
	$block_type = $request->get_param( 'blockType' );
	$old_name   = urldecode( $request->get_param( 'name' ) );
	$new_name   = $request->get_param( 'newName' );

	$theme = ThemeStorage\rename_block_theme( $block_type, $old_name, $new_name );

	if ( is_wp_error( $theme ) ) {
		$status = 400;
		if ( isset( $theme->error_data[ $theme->get_error_code() ]['status'] ) ) {
			$status = $theme->error_data[ $theme->get_error_code() ]['status'];
		}

		return new \WP_Error(
			$theme->get_error_code(),
			$theme->get_error_message(),
			array( 'status' => $status )
		);
	}

	return rest_ensure_response( $theme );
}
