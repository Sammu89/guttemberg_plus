<?php
/**
 * Security Functions
 *
 * REST API nonce verification and security utilities.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Verify REST API nonce for write operations
 *
 * This protects against CSRF attacks by ensuring requests
 * include a valid WordPress nonce.
 *
 * @param WP_REST_Request $request Request object.
 * @return bool|WP_Error True if valid, WP_Error if invalid.
 */
function guttemberg_plus_verify_rest_nonce( $request ) {
	// Skip GET requests (read-only operations)
	if ( $request->get_method() === 'GET' ) {
		return true;
	}

	// Get nonce from request header
	$nonce = $request->get_header( 'X-WP-Nonce' );

	// Check if nonce exists
	if ( empty( $nonce ) ) {
		return new WP_Error(
			'missing_nonce',
			__( 'Missing security token. Please refresh the page and try again.', 'guttemberg-plus' ),
			array( 'status' => 403 )
		);
	}

	// Verify nonce
	if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
		return new WP_Error(
			'invalid_nonce',
			__( 'Security token is invalid. Please refresh the page and try again.', 'guttemberg-plus' ),
			array( 'status' => 403 )
		);
	}

	return true;
}

/**
 * Add nonce verification to REST API requests
 *
 * Hooks into WordPress REST API to verify nonces before
 * processing requests to our endpoints.
 *
 * @param mixed           $result  Response to replace the requested version with.
 * @param WP_REST_Server  $server  Server instance.
 * @param WP_REST_Request $request Request used to generate the response.
 * @return mixed Response or WP_Error.
 */
function guttemberg_plus_rest_nonce_check( $result, $server, $request ) {
	$route = $request->get_route();

	// Only check our plugin's endpoints
	if ( strpos( $route, '/gutenberg-blocks/v1/' ) === false ) {
		return $result;
	}

	// Verify nonce
	$nonce_check = guttemberg_plus_verify_rest_nonce( $request );

	if ( is_wp_error( $nonce_check ) ) {
		return $nonce_check;
	}

	return $result;
}
add_filter( 'rest_pre_dispatch', 'guttemberg_plus_rest_nonce_check', 10, 3 );
