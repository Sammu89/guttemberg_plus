<?php
/**
 * Breakpoints Handler for Guttemberg Plus
 * Manages responsive breakpoint settings and CSS generation
 *
 * @package GuttembergPlus
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class GuttembergPlus_Breakpoints_Handler {

    const OPTION_NAME = 'gutemberg_plus_breakpoints';

    const DEFAULT_BREAKPOINTS = [
        'mobile' => 481,
        'tablet' => 768
    ];

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        add_action('wp_enqueue_scripts', [$this, 'localize_breakpoints']);
        add_action('enqueue_block_editor_assets', [$this, 'localize_breakpoints']);
    }

    /**
     * Register REST API routes for breakpoint settings
     */
    public function register_rest_routes() {
        register_rest_route('gutenberg-blocks/v1', '/settings/breakpoints', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_breakpoints'],
                'permission_callback' => '__return_true',
            ],
            [
                'methods' => 'POST',
                'callback' => [$this, 'save_breakpoints'],
                'permission_callback' => [$this, 'check_admin_permission'],
            ],
        ]);
    }

    /**
     * Get current breakpoint settings
     *
     * @return array Breakpoint configuration
     */
    public function get_breakpoints() {
        return get_option(self::OPTION_NAME, self::DEFAULT_BREAKPOINTS);
    }

    /**
     * Save breakpoint settings
     *
     * @param WP_REST_Request $request The request object
     * @return WP_REST_Response The response
     */
    public function save_breakpoints($request) {
        $data = $request->get_json_params();

        $breakpoints = [
            'mobile' => isset($data['mobile']) ? absint($data['mobile']) : self::DEFAULT_BREAKPOINTS['mobile'],
            'tablet' => isset($data['tablet']) ? absint($data['tablet']) : self::DEFAULT_BREAKPOINTS['tablet'],
        ];

        update_option(self::OPTION_NAME, $breakpoints);

        return rest_ensure_response($breakpoints);
    }

    /**
     * Check if user has admin permissions
     *
     * @return bool Whether user can manage options
     */
    public function check_admin_permission() {
        return current_user_can('manage_options');
    }

    /**
     * Localize breakpoint settings for JavaScript
     */
    public function localize_breakpoints() {
        $breakpoints = $this->get_breakpoints();
        wp_localize_script('wp-blocks', 'guttembergPlusSettings', [
            'breakpoints' => $breakpoints
        ]);
    }

    /**
     * Generate responsive CSS for a value
     *
     * @param string $css_var The CSS variable name (without --)
     * @param mixed $value The value (simple or responsive object)
     * @param array|null $breakpoints Optional breakpoint configuration
     * @return string CSS string
     */
    public static function generate_responsive_css($css_var, $value, $breakpoints = null) {
        if ($breakpoints === null) {
            $breakpoints = get_option(self::OPTION_NAME, self::DEFAULT_BREAKPOINTS);
        }

        $css = '';

        if (is_array($value)) {
            // Responsive value object
            if (isset($value['global'])) {
                $css .= "--{$css_var}: {$value['global']};\n";
            }
        } else {
            // Simple value
            $css .= "--{$css_var}: {$value};\n";
        }

        return $css;
    }

    /**
     * Generate media query CSS for responsive values
     *
     * @param string $css_var The CSS variable name (without --)
     * @param mixed $value The responsive value object
     * @param array|null $breakpoints Optional breakpoint configuration
     * @return string CSS with media queries
     */
    public static function generate_media_queries($css_var, $value, $breakpoints = null) {
        if ($breakpoints === null) {
            $breakpoints = get_option(self::OPTION_NAME, self::DEFAULT_BREAKPOINTS);
        }

        $css = '';

        if (!is_array($value)) {
            return $css;
        }

        if (isset($value['tablet'])) {
            $css .= "@media (max-width: {$breakpoints['tablet']}px) {\n";
            $css .= "  --{$css_var}: {$value['tablet']};\n";
            $css .= "}\n";
        }

        if (isset($value['mobile'])) {
            $css .= "@media (max-width: {$breakpoints['mobile']}px) {\n";
            $css .= "  --{$css_var}: {$value['mobile']};\n";
            $css .= "}\n";
        }

        return $css;
    }

    /**
     * Generate complete responsive CSS with all media queries
     *
     * @param string $css_var The CSS variable name (without --)
     * @param mixed $value The value (simple or responsive object)
     * @param array|null $breakpoints Optional breakpoint configuration
     * @return string Complete CSS with media queries
     */
    public static function generate_complete_responsive_css($css_var, $value, $breakpoints = null) {
        $css = self::generate_responsive_css($css_var, $value, $breakpoints);
        $css .= self::generate_media_queries($css_var, $value, $breakpoints);
        return $css;
    }

    /**
     * Get value for specific device with inheritance
     *
     * @param mixed $value The responsive value object
     * @param string $device The device type: 'global', 'tablet', or 'mobile'
     * @return mixed The value for the specified device
     */
    public static function get_responsive_value($value, $device) {
        if (!is_array($value)) {
            return $value;
        }

        if (isset($value[$device])) {
            return $value[$device];
        }

        // Inheritance chain: mobile → tablet → global
        if ($device === 'tablet') {
            return isset($value['global']) ? $value['global'] : null;
        }

        if ($device === 'mobile') {
            if (isset($value['tablet'])) {
                return $value['tablet'];
            }
            return isset($value['global']) ? $value['global'] : null;
        }

        return isset($value['global']) ? $value['global'] : null;
    }

    /**
     * Check if a value has responsive overrides
     *
     * @param mixed $value The value to check
     * @return bool True if the value has responsive overrides
     */
    public static function has_responsive_overrides($value) {
        if (!is_array($value)) {
            return false;
        }
        return isset($value['tablet']) || isset($value['mobile']);
    }
}

// Initialize
new GuttembergPlus_Breakpoints_Handler();
