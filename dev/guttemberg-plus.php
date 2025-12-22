<?php
/**
 * Plugin Name:       Guttemberg Plus
 * Plugin URI:        https://github.com/yourusername/guttemberg-plus
 * Description:       Advanced Gutenberg blocks: Accordion, Tabs, and Table of Contents with powerful theming system
 * Version:           1.0.0
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            Your Name
 * Author URI:        https://yourwebsite.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       guttemberg-plus
 * Domain Path:       /languages
 * Update URI:        false
 *
 * @package GuttemberPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Define plugin constants
define( 'GUTTEMBERG_PLUS_VERSION', '1.0.0' );
define( 'GUTTEMBERG_PLUS_PLUGIN_FILE', __FILE__ );
define( 'GUTTEMBERG_PLUS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'GUTTEMBERG_PLUS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'GUTTEMBERG_PLUS_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Check PHP version requirement
 */
if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
	add_action( 'admin_notices', 'guttemberg_plus_php_version_notice' );
	return;
}

/**
 * PHP version notice
 */
function guttemberg_plus_php_version_notice() {
	?>
	<div class="notice notice-error">
		<p>
			<?php
			printf(
				/* translators: %s: Required PHP version */
				esc_html__( 'Guttemberg Plus requires PHP %s or higher. Please upgrade PHP.', 'guttemberg-plus' ),
				'7.4'
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * Check WordPress version requirement
 */
if ( version_compare( get_bloginfo( 'version' ), '6.3', '<' ) ) {
	add_action( 'admin_notices', 'guttemberg_plus_wp_version_notice' );
	return;
}

/**
 * WordPress version notice
 */
function guttemberg_plus_wp_version_notice() {
	?>
	<div class="notice notice-error">
		<p>
			<?php
			printf(
				/* translators: %s: Required WordPress version */
				esc_html__( 'Guttemberg Plus requires WordPress %s or higher. Please upgrade WordPress.', 'guttemberg-plus' ),
				'6.3'
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * Load text domain for translations
 */
function guttemberg_plus_load_textdomain() {
	load_plugin_textdomain(
		'guttemberg-plus',
		false,
		dirname( GUTTEMBERG_PLUS_PLUGIN_BASENAME ) . '/languages'
	);
}
add_action( 'plugins_loaded', 'guttemberg_plus_load_textdomain' );

/**
 * Load backend PHP files
 */
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'php/css-parser.php';
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'php/theme-storage.php';
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'php/theme-rest-api.php';
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'php/theme-css-generator.php';

/**
 * Load plugin core
 * Note: Asset enqueuing handled by block.json (WordPress 5.8+ standard)
 */
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'includes/security.php';
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'includes/block-registration.php';

/**
 * Plugin activation hook
 */
function guttemberg_plus_activate() {
	// Check WordPress version
	if ( version_compare( get_bloginfo( 'version' ), '6.3', '<' ) ) {
		deactivate_plugins( GUTTEMBERG_PLUS_PLUGIN_BASENAME );
		wp_die(
			esc_html__( 'Guttemberg Plus requires WordPress 6.3 or higher.', 'guttemberg-plus' ),
			esc_html__( 'Plugin Activation Error', 'guttemberg-plus' ),
			array( 'back_link' => true )
		);
	}

	// Flush rewrite rules
	flush_rewrite_rules();

	// Set plugin version
	update_option( 'guttemberg_plus_version', GUTTEMBERG_PLUS_VERSION );
}
register_activation_hook( __FILE__, 'guttemberg_plus_activate' );

/**
 * Plugin deactivation hook
 */
function guttemberg_plus_deactivate() {
	// Flush rewrite rules
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'guttemberg_plus_deactivate' );
