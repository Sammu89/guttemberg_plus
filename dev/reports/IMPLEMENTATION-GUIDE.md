# Step-by-Step Implementation Guide
## Phases 1 & 2: Make It Work & Make It Safe

**Plugin:** Guttemberg Plus
**Created:** 2025-11-17
**Estimated Time:** 24-36 hours total
**Goal:** Make plugin functional and production-ready

---

## Overview

This guide provides **exact steps** to transform your plugin from non-functional to production-ready. Each step includes:
- ✅ What to create
- 📝 Exact code to use
- 🧪 How to test
- ⏱️ Time estimate

---

## Prerequisites

Before starting:

```bash
# 1. Ensure you have the repository
cd /path/to/guttemberg_plus

# 2. Check Node.js version (need 18+)
node --version  # Should be v18.x or v20.x

# 3. Check PHP version (need 7.4+)
php --version   # Should be 7.4 or higher

# 4. Have a local WordPress installation ready for testing
# (Local by Flywheel, XAMPP, Docker, etc.)
```

---

# PHASE 1: MAKE IT WORK (8-12 hours)

Goal: Plugin can be installed and activated in WordPress

---

## Step 1.1: Create Build Configuration Files

**Time:** 1-2 hours
**Files to create:** `package.json`, `webpack.config.js`

### 1.1.1 Create package.json

```bash
cd /path/to/guttemberg_plus
```

Create `package.json` with this content:

```json
{
  "name": "guttemberg-plus",
  "version": "1.0.0",
  "description": "Advanced Gutenberg blocks: Accordion, Tabs, and Table of Contents with powerful theming system",
  "author": "Your Name",
  "license": "GPL-2.0-or-later",
  "keywords": [
    "wordpress",
    "gutenberg",
    "blocks",
    "accordion",
    "tabs",
    "table-of-contents"
  ],
  "homepage": "https://github.com/yourusername/guttemberg-plus",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/guttemberg-plus.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/guttemberg-plus/issues"
  },
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "lint:css": "wp-scripts lint-style",
    "format": "wp-scripts format",
    "packages-update": "wp-scripts packages-update",
    "plugin-zip": "wp-scripts plugin-zip"
  },
  "devDependencies": {
    "@wordpress/scripts": "^27.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 1.1.2 Create webpack.config.js

Create `webpack.config.js`:

```javascript
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        // Accordion block
        'blocks/accordion/index': path.resolve(__dirname, 'blocks/accordion/src/index.js'),
        'blocks/accordion/frontend': path.resolve(__dirname, 'blocks/accordion/src/frontend.js'),

        // Tabs block
        'blocks/tabs/index': path.resolve(__dirname, 'blocks/tabs/src/index.js'),
        'blocks/tabs/frontend': path.resolve(__dirname, 'blocks/tabs/src/frontend.js'),

        // TOC block
        'blocks/toc/index': path.resolve(__dirname, 'blocks/toc/src/index.js'),

        // Shared infrastructure
        'shared/index': path.resolve(__dirname, 'shared/src/index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, 'shared/src'),
            '@blocks': path.resolve(__dirname, 'blocks'),
            '@assets': path.resolve(__dirname, 'assets'),
        },
    },
    module: {
        rules: [
            ...defaultConfig.module.rules,
            // Custom CSS parser for CSS variables
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'assets/css'),
                use: [
                    {
                        loader: path.resolve(__dirname, 'build-tools/css-vars-parser-loader.js'),
                    },
                ],
            },
        ],
    },
};
```

### 1.1.3 Install Dependencies

```bash
# Install npm dependencies
npm install

# This will take a few minutes
# You should see: added XXX packages
```

### 1.1.4 Build the Plugin

```bash
# Run the build
npm run build

# Expected output:
# asset blocks/accordion/index.js XX KB
# asset blocks/accordion/frontend.js XX KB
# asset blocks/tabs/index.js XX KB
# asset blocks/tabs/frontend.js XX KB
# asset blocks/toc/index.js XX KB
# Compiled successfully
```

### 1.1.5 Verify Build Output

```bash
# Check that build artifacts were created
ls -la blocks/accordion/build/
ls -la blocks/tabs/build/
ls -la blocks/toc/build/

# You should see:
# - index.js
# - index.asset.php
# - frontend.js (for accordion/tabs)
# - frontend.asset.php
# - style-index.css
```

✅ **Checkpoint:** Build system working, all blocks compile successfully

---

## Step 1.2: Create Main Plugin File

**Time:** 2-3 hours
**File to create:** `guttemberg-plus.php`

Create `guttemberg-plus.php` in the root directory:

```php
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

/**
 * Load plugin core (will create these next)
 */
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'includes/security.php';
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'includes/block-registration.php';
require_once GUTTEMBERG_PLUS_PLUGIN_DIR . 'includes/asset-enqueue.php';

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
```

✅ **Checkpoint:** Main plugin file created

---

## Step 1.3: Create includes Directory and Files

**Time:** 4-5 hours
**Files to create:** `includes/security.php`, `includes/block-registration.php`, `includes/asset-enqueue.php`

### 1.3.1 Create includes Directory

```bash
mkdir -p includes
```

### 1.3.2 Create includes/security.php

Create `includes/security.php`:

```php
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

/**
 * Enhanced permission check for theme operations
 *
 * READ operations: Contributors and above (edit_posts)
 * WRITE operations: Editors and above (edit_others_posts)
 *
 * This prevents contributors from modifying site-wide themes.
 */
// Note: We'll update php/theme-rest-api.php to use this in the next step
```

### 1.3.3 Create includes/block-registration.php

Create `includes/block-registration.php`:

```php
<?php
/**
 * Block Registration
 *
 * Registers all Gutenberg blocks for the plugin.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all blocks
 */
function guttemberg_plus_register_blocks() {
	// Register Accordion Block
	register_block_type(
		GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/accordion',
		array(
			'render_callback' => 'guttemberg_plus_render_accordion_block',
		)
	);

	// Register Tabs Block
	register_block_type(
		GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/tabs',
		array(
			'render_callback' => 'guttemberg_plus_render_tabs_block',
		)
	);

	// Register TOC Block
	register_block_type(
		GUTTEMBERG_PLUS_PLUGIN_DIR . 'blocks/toc',
		array(
			'render_callback' => 'guttemberg_plus_render_toc_block',
		)
	);
}
add_action( 'init', 'guttemberg_plus_register_blocks' );

/**
 * Render callback for Accordion block
 *
 * Server-side rendering not strictly necessary for this block,
 * but included for potential dynamic content in the future.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block content.
 * @return string Block HTML.
 */
function guttemberg_plus_render_accordion_block( $attributes, $content ) {
	// For now, just return the content as-is
	// Future: Could add dynamic features here
	return $content;
}

/**
 * Render callback for Tabs block
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block content.
 * @return string Block HTML.
 */
function guttemberg_plus_render_tabs_block( $attributes, $content ) {
	return $content;
}

/**
 * Render callback for TOC block
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block content.
 * @return string Block HTML.
 */
function guttemberg_plus_render_toc_block( $attributes, $content ) {
	return $content;
}
```

### 1.3.4 Create includes/asset-enqueue.php

Create `includes/asset-enqueue.php`:

```php
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
```

✅ **Checkpoint:** All includes files created

---

## Step 1.4: Add ABSPATH Protection to PHP Files

**Time:** 15 minutes
**Files to update:** `php/theme-storage.php`, `php/theme-rest-api.php`

### 1.4.1 Update php/theme-storage.php

Add to the very top of the file (after opening `<?php`):

```php
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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// Rest of the file continues below...
```

### 1.4.2 Update php/theme-rest-api.php

Add to the very top of the file:

```php
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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// Rest of the file continues below...
```

✅ **Checkpoint:** All PHP files protected

---

## Step 1.5: Test Phase 1

**Time:** 30 minutes

### 1.5.1 Copy Plugin to WordPress

```bash
# Copy entire plugin directory to WordPress plugins folder
cp -r /path/to/guttemberg_plus /path/to/wordpress/wp-content/plugins/

# Or create a symlink (for development)
ln -s /path/to/guttemberg_plus /path/to/wordpress/wp-content/plugins/guttemberg-plus
```

### 1.5.2 Activate Plugin

1. Go to WordPress admin: `http://your-site.local/wp-admin`
2. Navigate to **Plugins** > **Installed Plugins**
3. Find "Guttemberg Plus"
4. Click **Activate**

**Expected:** Plugin activates without errors

### 1.5.3 Test Block Insertion

1. Create or edit a post/page
2. Click the (+) button to add a block
3. Search for "Accordion"
4. **Expected:** Accordion block appears in inserter
5. Insert the accordion block
6. **Expected:** Block appears in editor without errors

Repeat for Tabs and TOC blocks.

### 1.5.4 Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. **Expected:** No JavaScript errors
4. Check for `window.accordionDefaults`
5. **Expected:** Object with CSS defaults

```javascript
// In browser console, check:
console.log(window.accordionDefaults);
// Should output: { titleColor: "#333333", ... }
```

### 1.5.5 Check PHP Errors

```bash
# Enable WordPress debugging (wp-config.php)
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );

# Check error log
tail -f /path/to/wordpress/wp-content/debug.log

# Expected: No errors related to guttemberg-plus
```

✅ **Phase 1 Complete!** Plugin is now installable and functional.

---

# PHASE 2: MAKE IT SAFE (16-24 hours)

Goal: Plugin is secure and follows WordPress best practices

---

## Step 2.1: Update php/theme-rest-api.php Permission Checks

**Time:** 1 hour
**File to update:** `php/theme-rest-api.php`

### 2.1.1 Update check_permissions Function

Replace the current `check_permissions()` function:

```php
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
```

### 2.1.2 Update All Handler Functions to Escape Output

Replace the `delete_theme_handler` return statement:

```php
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
			'message' => sprintf(
				/* translators: %s: theme name */
				__( "Theme '%s' deleted successfully", 'guttemberg-plus' ),
				esc_html( $name )
			),
		)
	);
}
```

---

## Step 2.2: Add Internationalization to PHP Files

**Time:** 2-3 hours
**Files to update:** `php/theme-storage.php`, `php/theme-rest-api.php`

### 2.2.1 Update php/theme-storage.php Error Messages

Replace all hardcoded error messages with translatable ones:

```php
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

// Update the get_theme() function:
function get_theme( $block_type, $name ) {
	$themes = get_block_themes( $block_type );

	if ( is_wp_error( $themes ) ) {
		return $themes;
	}

	if ( ! isset( $themes[ $name ] ) ) {
		return new \WP_Error(
			'theme_not_found',
			sprintf(
				/* translators: %s: theme name */
				__( "Theme '%s' not found", 'guttemberg-plus' ),
				$name
			),
			array( 'status' => 404 )
		);
	}

	return $themes[ $name ];
}

// Update create_block_theme():
function create_block_theme( $block_type, $name, $values ) {
	// ... validation code ...

	if ( ! is_array( $values ) ) {
		return new \WP_Error(
			'invalid_values',
			__( 'Values must be an array', 'guttemberg-plus' )
		);
	}

	// ... rest of code ...

	// Check for duplicate
	if ( isset( $themes[ $name ] ) ) {
		return new \WP_Error(
			'duplicate_theme',
			sprintf(
				/* translators: %s: theme name */
				__( "Theme '%s' already exists", 'guttemberg-plus' ),
				$name
			),
			array( 'status' => 409 )
		);
	}

	// ... rest of function
}

// Update update_block_theme():
function update_block_theme( $block_type, $name, $values ) {
	// ... validation code ...

	if ( ! is_array( $values ) ) {
		return new \WP_Error(
			'invalid_values',
			__( 'Values must be an array', 'guttemberg-plus' )
		);
	}

	// ... rest of code ...

	// Check theme exists
	if ( ! isset( $themes[ $name ] ) ) {
		return new \WP_Error(
			'theme_not_found',
			sprintf(
				/* translators: %s: theme name */
				__( "Theme '%s' not found", 'guttemberg-plus' ),
				$name
			),
			array( 'status' => 404 )
		);
	}

	// ... rest of function
}

// Update delete_block_theme() similarly
// Update rename_block_theme() similarly
```

Continue updating all error messages in both files.

---

## Step 2.3: Standardize Text Domain in block.json Files

**Time:** 30 minutes
**Files to update:** All 3 `block.json` files

### 2.3.1 Update blocks/accordion/block.json

Change line 11:

```json
"textdomain": "guttemberg-plus"
```

### 2.3.2 Update blocks/tabs/block.json

Change line 12:

```json
"textdomain": "guttemberg-plus"
```

### 2.3.3 Update blocks/toc/block.json

Change line 14:

```json
"textdomain": "guttemberg-plus"
```

---

## Step 2.4: Add Theme Value Validation

**Time:** 2-3 hours
**File to update:** `php/theme-storage.php`

### 2.4.1 Add Validation Function

Add this new function to `php/theme-storage.php`:

```php
/**
 * Validate and sanitize theme values
 *
 * Prevents injection attacks and ensures data integrity.
 *
 * @param array  $values     Theme values to validate.
 * @param string $block_type Block type (for attribute validation).
 * @return array|WP_Error Sanitized values or WP_Error.
 */
function validate_theme_values( $values, $block_type ) {
	// Check size limit (100KB)
	$json_size = strlen( wp_json_encode( $values ) );
	if ( $json_size > 102400 ) {
		return new \WP_Error(
			'values_too_large',
			__( 'Theme values exceed 100KB size limit', 'guttemberg-plus' )
		);
	}

	// Sanitize each value
	$sanitized = array();

	foreach ( $values as $key => $value ) {
		// Sanitize attribute name
		$clean_key = sanitize_key( $key );

		// Handle different value types
		if ( is_null( $value ) ) {
			// Null is allowed (means "use default")
			$sanitized[ $clean_key ] = null;
		} elseif ( is_bool( $value ) ) {
			// Booleans
			$sanitized[ $clean_key ] = (bool) $value;
		} elseif ( is_numeric( $value ) ) {
			// Numbers
			$sanitized[ $clean_key ] = floatval( $value );
		} elseif ( is_string( $value ) ) {
			// Strings - check for color values
			if ( strpos( $key, 'Color' ) !== false || strpos( $key, 'color' ) !== false ) {
				// Sanitize color (hex or rgba)
				if ( strpos( $value, 'rgba' ) === 0 || strpos( $value, 'rgb' ) === 0 ) {
					// RGBA/RGB color - basic sanitization
					$sanitized[ $clean_key ] = sanitize_text_field( $value );
				} else {
					// Hex color
					$sanitized[ $clean_key ] = sanitize_hex_color( $value );
				}
			} else {
				// Regular string
				$sanitized[ $clean_key ] = sanitize_text_field( $value );
			}
		} elseif ( is_array( $value ) ) {
			// Arrays (e.g., padding, border radius objects)
			$sanitized[ $clean_key ] = array_map( 'sanitize_text_field', $value );
		} elseif ( is_object( $value ) ) {
			// Objects - convert to array and sanitize
			$sanitized[ $clean_key ] = array_map( 'sanitize_text_field', (array) $value );
		} else {
			// Unknown type - skip
			continue;
		}
	}

	return $sanitized;
}
```

### 2.4.2 Use Validation in create_block_theme()

Update the function:

```php
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
		return new \WP_Error(
			'invalid_values',
			__( 'Values must be an array', 'guttemberg-plus' )
		);
	}

	// Validate and sanitize values
	$sanitized_values = validate_theme_values( $values, $block_type );
	if ( is_wp_error( $sanitized_values ) ) {
		return $sanitized_values;
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
			sprintf(
				/* translators: %s: theme name */
				__( "Theme '%s' already exists", 'guttemberg-plus' ),
				$name
			),
			array( 'status' => 409 )
		);
	}

	// Create theme object with timestamps
	$theme = array(
		'name'     => $name,
		'values'   => $sanitized_values, // Use sanitized values
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
```

### 2.4.3 Update update_block_theme() Similarly

Add the same validation to `update_block_theme()`:

```php
function update_block_theme( $block_type, $name, $values ) {
	// ... existing validation code ...

	// Validate and sanitize values
	$sanitized_values = validate_theme_values( $values, $block_type );
	if ( is_wp_error( $sanitized_values ) ) {
		return $sanitized_values;
	}

	// ... rest of code using $sanitized_values instead of $values
}
```

---

## Step 2.5: Update Option Names to Prevent Conflicts

**Time:** 30 minutes
**File to update:** `php/theme-storage.php`

### 2.5.1 Update get_option_name()

```php
/**
 * Get option name for block type
 *
 * Prefixed to prevent conflicts with other plugins.
 *
 * @param string $block_type Block type ('accordion', 'tabs', 'toc').
 * @return string Option name
 */
function get_option_name( $block_type ) {
	return 'guttemberg_plus_' . $block_type . '_themes';
}
```

**Note:** This changes the option names from:
- `accordion_themes` → `guttemberg_plus_accordion_themes`
- `tabs_themes` → `guttemberg_plus_tabs_themes`
- `toc_themes` → `guttemberg_plus_toc_themes`

**Migration:** If you had existing data, you'd need to migrate it. Since this is pre-release, we can just use the new names.

---

## Step 2.6: Create uninstall.php

**Time:** 30 minutes
**File to create:** `uninstall.php` (in root directory)

Create `uninstall.php`:

```php
<?php
/**
 * Uninstall script
 *
 * Fired when the plugin is uninstalled.
 * Cleans up all plugin data from database.
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
 */
delete_option( 'guttemberg_plus_accordion_themes' );
delete_option( 'guttemberg_plus_tabs_themes' );
delete_option( 'guttemberg_plus_toc_themes' );
delete_option( 'guttemberg_plus_version' );

/**
 * Clear all cached data
 */
wp_cache_flush();

/**
 * For multisite installations
 */
if ( is_multisite() ) {
	global $wpdb;

	// Get all blog IDs
	$blog_ids = $wpdb->get_col( "SELECT blog_id FROM {$wpdb->blogs}" );

	foreach ( $blog_ids as $blog_id ) {
		switch_to_blog( $blog_id );

		// Delete options for this site
		delete_option( 'guttemberg_plus_accordion_themes' );
		delete_option( 'guttemberg_plus_tabs_themes' );
		delete_option( 'guttemberg_plus_toc_themes' );
		delete_option( 'guttemberg_plus_version' );

		restore_current_blog();
	}
}
```

---

## Step 2.7: Create Code Quality Configuration Files

**Time:** 2-3 hours

### 2.7.1 Create .eslintrc.json

Create `.eslintrc.json` in root:

```json
{
	"extends": [
		"plugin:@wordpress/eslint-plugin/recommended"
	],
	"rules": {
		"@wordpress/i18n-text-domain": [
			"error",
			{
				"allowedTextDomain": "guttemberg-plus"
			}
		],
		"no-console": "warn",
		"@wordpress/no-unused-vars-before-return": "error"
	},
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"globals": {
		"wp": "readonly",
		"jQuery": "readonly"
	}
}
```

### 2.7.2 Create .prettierrc.json

Create `.prettierrc.json`:

```json
{
	"useTabs": true,
	"tabWidth": 4,
	"singleQuote": true,
	"trailingComma": "es5",
	"bracketSpacing": true,
	"arrowParens": "always",
	"printWidth": 80,
	"semi": true
}
```

### 2.7.3 Create .editorconfig

Create `.editorconfig`:

```ini
# EditorConfig: https://EditorConfig.org

root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = tab
indent_size = 4

[{*.json,*.yml,*.yaml}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### 2.7.4 Run Linters

```bash
# Install ESLint (should already be installed via @wordpress/scripts)
# Run JavaScript linter
npm run lint:js

# Fix auto-fixable issues
npm run lint:js -- --fix

# Format code
npm run format
```

---

## Step 2.8: Update .gitignore

**Time:** 10 minutes
**File to update:** `.gitignore`

Replace or update `.gitignore`:

```gitignore
# Dependencies
node_modules/
vendor/

# Build output (commit these for WordPress.org)
# build/
# blocks/*/build/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode/
.idea/
*.sublime-project
*.sublime-workspace
*.swp
*.swo
*~

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Environment files
.env
.env.local
.env.*.local

# WordPress specific
wp-config.php
wp-content/uploads/
wp-content/blogs.dir/
wp-content/upgrade/
wp-content/backup-db/
wp-content/advanced-cache.php
wp-content/wp-cache-config.php

# Package manager lock files (optional - some teams commit these)
# package-lock.json
# composer.lock

# Testing
coverage/
.phpunit.result.cache

# Temporary files
*.tmp
```

---

## Step 2.9: Create LICENSE File

**Time:** 5 minutes
**File to create:** `LICENSE`

```bash
# Download GPL v2 license
curl https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt > LICENSE

# Or create manually with GPL v2 text
```

Add copyright notice at the top of LICENSE:

```
Guttemberg Plus
Copyright (C) 2025 Your Name

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

--- GNU GENERAL PUBLIC LICENSE text continues below ---
```

---

## Step 2.10: Test Phase 2

**Time:** 1-2 hours

### 2.10.1 Test Security

**Test nonce verification:**

```bash
# Try creating a theme without authentication
curl -X POST http://your-site.local/wp-json/gutenberg-blocks/v1/themes \
  -H "Content-Type: application/json" \
  -d '{"blockType":"accordion","name":"Hacker","values":{}}'

# Expected: 403 Forbidden error
```

**Test in browser:**
1. Log in to WordPress
2. Go to block editor
3. Insert accordion block
4. Open browser DevTools > Network tab
5. Create a new theme
6. Check the request headers
7. **Expected:** `X-WP-Nonce` header present

### 2.10.2 Test Input Validation

**In browser console:**

```javascript
// Try to create theme with huge data
const hugeData = {};
for (let i = 0; i < 10000; i++) {
    hugeData['attr' + i] = 'x'.repeat(1000);
}

wp.apiFetch({
    path: '/gutenberg-blocks/v1/themes',
    method: 'POST',
    data: {
        blockType: 'accordion',
        name: 'Huge Theme',
        values: hugeData
    }
});

// Expected: Error about size limit
```

### 2.10.3 Test Capability Checks

1. Log in as Contributor
2. Try to create/modify themes
3. **Expected:** Permission denied error

### 2.10.4 Test Uninstall

```bash
# In WordPress admin:
# 1. Deactivate plugin
# 2. Delete plugin
# 3. Check database

# Using WP-CLI:
wp option get guttemberg_plus_accordion_themes

# Expected: Option doesn't exist (was deleted)
```

### 2.10.5 Run Code Quality Checks

```bash
# Run linters
npm run lint:js
npm run lint:css

# Expected: No errors (or only minor warnings)

# Check for console.log statements
grep -r "console.log" blocks/*/src/*.js shared/src/**/*.js

# Expected: Only debug.js has console statements
```

✅ **Phase 2 Complete!** Plugin is now secure and follows best practices.

---

## Final Testing Checklist

Before considering the plugin production-ready, verify:

### Functionality
- [ ] Plugin installs without errors
- [ ] Plugin activates without errors
- [ ] Accordion block: Insert, edit, save, frontend works
- [ ] Tabs block: Insert, edit, save, frontend works
- [ ] TOC block: Insert, edit, save
- [ ] Theme creation works
- [ ] Theme update works
- [ ] Theme deletion works
- [ ] Theme rename works
- [ ] Block customization works
- [ ] Reset customizations works

### Security
- [ ] REST API requires authentication
- [ ] REST API requires nonce for write operations
- [ ] Contributors cannot modify themes (only editors+)
- [ ] No XSS vulnerabilities (all output escaped)
- [ ] No CSRF vulnerabilities (nonces verified)
- [ ] Theme values validated and sanitized
- [ ] Direct file access prevented (ABSPATH checks)

### Code Quality
- [ ] All PHP files have ABSPATH protection
- [ ] All text strings are translatable
- [ ] Text domain is consistent (guttemberg-plus)
- [ ] ESLint passes (or only minor warnings)
- [ ] Code is formatted consistently
- [ ] No console.log in production code (except debug.js)

### WordPress Integration
- [ ] Plugin headers present and correct
- [ ] Blocks registered properly
- [ ] Assets enqueued correctly
- [ ] CSS defaults load in editor
- [ ] Frontend scripts load when blocks present
- [ ] Uninstall cleanup works

### Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] No JavaScript console errors
- [ ] No PHP errors

### WordPress Compatibility
- [ ] Works in WordPress 6.3
- [ ] Works in WordPress 6.4
- [ ] Works with Gutenberg plugin active
- [ ] Works with common themes (Twenty Twenty-Three)
- [ ] No conflicts with common plugins

---

## Troubleshooting Common Issues

### Issue: Plugin won't activate

**Check:**
```bash
# Enable WordPress debug mode
# In wp-config.php:
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

# Check error log
tail -f wp-content/debug.log
```

**Common causes:**
- PHP syntax error
- Missing files (includes/ directory)
- PHP version too old
- WordPress version too old

---

### Issue: Blocks don't appear in editor

**Check:**
1. Browser console for JavaScript errors
2. Network tab for failed requests
3. Block registration:

```php
// Add temporary debug code to includes/block-registration.php
error_log('Registering blocks...');
```

**Common causes:**
- Build files missing
- JavaScript error in block code
- Asset paths incorrect
- Block registration not running

---

### Issue: CSS defaults not loading

**Check browser console:**
```javascript
console.log(window.accordionDefaults);
console.log(window.tabsDefaults);
console.log(window.tocDefaults);
```

**Common causes:**
- wp_localize_script not called
- CSS defaults files don't exist
- Asset enqueue not running

---

### Issue: Themes not saving

**Check:**
1. Browser console for errors
2. Network tab for failed API requests
3. WordPress user role/capabilities

**Common causes:**
- Nonce verification failing (refresh page)
- Insufficient permissions
- REST API not accessible
- JavaScript error

---

### Issue: Build fails

**Check:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+

# Try building individual blocks
npm run build
```

**Common causes:**
- Outdated Node.js
- Missing dependencies
- Syntax error in source files
- webpack.config.js incorrect

---

## Next Steps After Phase 2

You now have a **functional, secure WordPress plugin**!

**Optional Phase 3 (if you want WordPress.org distribution):**
- Create readme.txt
- Generate screenshots
- Set up CI/CD
- Create WordPress.org assets
- Submit to WordPress.org

**But you can now:**
✅ Use the plugin on production sites
✅ Distribute privately to clients
✅ Deploy to staging/production
✅ Start gathering user feedback

---

## Time Tracking

Keep track of your progress:

**Phase 1:**
- Step 1.1: Build config (_____ hours)
- Step 1.2: Main plugin file (_____ hours)
- Step 1.3: Includes files (_____ hours)
- Step 1.4: ABSPATH protection (_____ hours)
- Step 1.5: Testing (_____ hours)
**Phase 1 Total:** _____ hours

**Phase 2:**
- Step 2.1: Permission checks (_____ hours)
- Step 2.2: Internationalization (_____ hours)
- Step 2.3: Text domain (_____ hours)
- Step 2.4: Value validation (_____ hours)
- Step 2.5: Option names (_____ hours)
- Step 2.6: uninstall.php (_____ hours)
- Step 2.7: Code quality configs (_____ hours)
- Step 2.8: .gitignore (_____ hours)
- Step 2.9: LICENSE (_____ hours)
- Step 2.10: Testing (_____ hours)
**Phase 2 Total:** _____ hours

**Grand Total:** _____ hours

---

## Support and Resources

**WordPress Resources:**
- [Plugin Handbook](https://developer.wordpress.org/plugins/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

**Testing Tools:**
- [Query Monitor](https://wordpress.org/plugins/query-monitor/) - Debug plugin
- [Debug Bar](https://wordpress.org/plugins/debug-bar/) - Debug plugin
- [Plugin Check](https://wordpress.org/plugins/plugin-check/) - Validate plugin

**Community:**
- [WordPress StackExchange](https://wordpress.stackexchange.com/)
- [WordPress Slack](https://make.wordpress.org/chat/)
- [WordPress Support Forums](https://wordpress.org/support/)

---

**Implementation Guide Created:** 2025-11-17
**Last Updated:** 2025-11-17
**Status:** Complete (Phases 1 & 2)
