<?php
/**
 * Uninstall Script
 *
 * Runs when the plugin is uninstalled via WordPress admin.
 * Removes all plugin data from the database.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

// If uninstall not called from WordPress, exit
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Delete all plugin options
 *
 * Removes theme data for all block types stored in wp_options.
 */
function guttemberg_plus_delete_options() {
	// Array of all option names used by the plugin
	$option_names = array(
		'guttemberg_plus_accordion_themes',
		'guttemberg_plus_tabs_themes',
		'guttemberg_plus_toc_themes',
		'guttemberg_plus_version',
	);

	// Delete each option
	foreach ( $option_names as $option_name ) {
		delete_option( $option_name );
	}
}

/**
 * Clear transients
 *
 * Removes any cached data created by the plugin.
 */
function guttemberg_plus_clear_transients() {
	global $wpdb;

	// Delete all transients with our prefix
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
			$wpdb->esc_like( '_transient_guttemberg_plus_' ) . '%',
			$wpdb->esc_like( '_transient_timeout_guttemberg_plus_' ) . '%'
		)
	);
}

// Run cleanup
guttemberg_plus_delete_options();
guttemberg_plus_clear_transients();

// Note: We intentionally do NOT delete user content (posts/pages containing our blocks)
// as users may want to keep their content even after uninstalling the plugin.
