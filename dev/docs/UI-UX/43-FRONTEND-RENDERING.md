# Frontend Rendering - Complete Specification v6.0

## Overview

This document defines how the accordion block is rendered on the frontend of the WordPress site. It specifies the HTML output structure, CSS generation (with `accordion.css` as single source of truth), JavaScript requirements, and the value resolution process.

**CRITICAL**: Each `wp:custom/accordion` block is a single, standalone accordion item - NOT a container with multiple items.

**Purpose**: Enable a fresh AI agent to implement correct frontend rendering that matches the editor preview, maintains accessibility, and performs efficiently.

**v6.0 UPDATE**: Complete redesign with `accordion.css` as the **single source of truth**. All defaults defined as CSS custom properties at `:root`, everything else auto-generates from this file.

**Shared Architecture Note**: This rendering system is used by **both Accordion and Tabs blocks**. The same CSS parsing logic (from `src/shared/utils/css-parser.js`), theme CSS generation, and frontend JavaScript patterns apply to both block types. Each block has its own CSS file (`accordion.css` vs `tabs.css`) and database storage (`accordion_themes` vs `tabs_themes`), but uses identical architecture.

---

## Table of Contents

1. [Architecture: CSS as Single Source of Truth](#architecture-css-as-single-source-of-truth)
2. [The CSS File Structure](#the-css-file-structure)
3. [Parsing CSS Defaults in PHP](#parsing-css-defaults-in-php)
4. [JavaScript Gets Defaults from PHP](#javascript-gets-defaults-from-php)
5. [HTML Output Structure](#html-output-structure)
6. [Theme CSS Generation](#theme-css-generation)
7. [JavaScript Requirements](#javascript-requirements)
8. [Performance Considerations](#performance-considerations)
9. [Accessibility Requirements](#accessibility-requirements)
10. [Complete Implementation Workflow](#complete-implementation-workflow)
11. [Testing Checklist](#testing-checklist)

---

## Architecture: CSS as Single Source of Truth

### The Problem We're Solving

**Before**: Defaults scattered across PHP, JavaScript, and CSS files. Change one value = update three places.

**After**: Defaults defined ONCE in `accordion.css` at `:root`. Everything else reads from there.

### The Single Maintenance Point

```
Designer wants to change default title padding: 12px → 16px

1. Edit accordion.css:
   :root {
     --accordion-default-title-padding: 16px;
   }

2. Save file.

3. Done! Everything updates:
   ├─ Frontend rendering ✅ (CSS variables)
   ├─ PHP theme generation ✅ (parses CSS)
   └─ JavaScript editor ✅ (gets from PHP)
```

### Three-Tier CSS System

**Layer 1: Default Theme**
- Defined in `accordion.css`
- Uses `:root` variables as single source of truth
- Applied via `.accordion-theme-default` class

**Layer 2: Custom Saved Themes**
- Stored in database
- Generated as inline `<style>` in `<head>`
- Uses CSS custom properties for per-accordion overrides

**Layer 3: Per-Accordion Customizations**
- Stored in block attributes
- Output as inline CSS variables on the block element (style attribute only)
- Overrides theme fallbacks

**Rule**: Tier 3 never generates `<style>` tags. `<head>` output is reserved for Tier 2 saved themes.

---

## The CSS File Structure

### File: `assets/css/accordion.css`

This file contains:
1. **:root variables** - ALL default values (single source of truth)
2. **Structural styles** - Layout, flex, transitions
3. **Default theme** - Uses :root variables with CSS custom property pattern
4. **Responsive styles** - Media queries
5. **Accessibility** - Focus states, motion preferences

**Pattern for all styles:**
```css
.accordion-theme-default .accordion-title {
  color: var(--custom-title-color, var(--accordion-default-title-color));
  /*      ↑ per-accordion override   ↑ theme/default fallback            */
}
```

**Key insight**: Two-level CSS variables
- `--custom-*` = Per-accordion customization (inline style)
- `--accordion-default-*` = Default value (from :root)

---

## Parsing CSS Defaults in PHP

### Why Parse?

To generate custom theme CSS and provide defaults to JavaScript editor, PHP needs to know default values. Rather than duplicate them in PHP, we parse them from the CSS file.

### Parse Function (Cached for Performance)

```php
/**
 * Get accordion defaults by parsing CSS file
 * Parsed once and cached in transient
 * 
 * @return array All default values
 */
function get_accordion_plugin_defaults() {
    // Check transient cache
    $cached = get_transient('accordion_parsed_defaults');
    
    if ($cached !== false) {
        // Verify CSS hasn't changed
        $cssPath = plugin_dir_path(__FILE__) . 'assets/css/accordion.css';
        $currentModTime = filemtime($cssPath);
        
        if (isset($cached['mtime']) && $cached['mtime'] === $currentModTime) {
            return $cached['defaults'];
        }
    }
    
    // Parse CSS file
    $cssPath = plugin_dir_path(__FILE__) . 'assets/css/accordion.css';
    $css = file_get_contents($cssPath);
    $cssModTime = filemtime($cssPath);
    
    $defaults = parse_css_defaults($css);
    
    // Cache with file modification time
    set_transient('accordion_parsed_defaults', [
        'mtime' => $cssModTime,
        'defaults' => $defaults
    ], YEAR_IN_SECONDS);
    
    return $defaults;
}

/**
 * Parse :root block from CSS to extract default values
 */
function parse_css_defaults($css) {
    $defaults = [];
    
    // Extract all --accordion-default-* variables from :root
    preg_match_all('/--accordion-default-([a-z-]+):\s*([^;]+);/', $css, $matches, PREG_SET_ORDER);
    
    foreach ($matches as $match) {
        $cssName = $match[1];      // e.g., "title-color"
        $cssValue = trim($match[2]); // e.g., "#333333"
        
        $attrName = map_css_name_to_attribute($cssName);
        $parsedValue = parse_css_value($cssValue, $attrName);
        
        // Handle nested attributes (border-radius, padding)
        if (strpos($attrName, '.') !== false) {
            list($parent, $child) = explode('.', $attrName);
            if (!isset($defaults[$parent])) {
                $defaults[$parent] = [];
            }
            $defaults[$parent][$child] = $parsedValue;
        } else {
            $defaults[$attrName] = $parsedValue;
        }
    }
    
    // Add behavioral defaults (can't be CSS variables)
    $defaults['showIcon'] = true;
    $defaults['iconPosition'] = 'right';
    $defaults['iconTypeClosed'] = '▾';
    $defaults['iconTypeOpen'] = 'none';
    $defaults['iconRotation'] = 180;
    $defaults['initiallyOpen'] = false;
    $defaults['headingLevel'] = 'none';
    $defaults['useHeadingStyles'] = false;
    
    // Add null inheritance markers (inheritance rules in PHP)
    $defaults['iconColor'] = null;
    $defaults['iconSize'] = null;
    $defaults['hoverTitleColor'] = null;
    $defaults['activeTitleColor'] = null;
    $defaults['activeTitleBackgroundColor'] = null;
    
    return $defaults;
}

/**
 * Map CSS variable name to attribute name
 */
function map_css_name_to_attribute($cssName) {
    $map = [
        // Wrapper/Container
        'border-width' => 'accordionBorderThickness',
        'border-style' => 'accordionBorderStyle',
        'border-color' => 'accordionBorderColor',
        'border-radius-tl' => 'accordionBorderRadius.topLeft',
        'border-radius-tr' => 'accordionBorderRadius.topRight',
        'border-radius-br' => 'accordionBorderRadius.bottomRight',
        'border-radius-bl' => 'accordionBorderRadius.bottomLeft',
        'shadow' => 'accordionShadow',
        'margin-bottom' => 'accordionMarginBottom',
        
        // Title
        'title-color' => 'titleColor',
        'title-bg' => 'titleBackgroundColor',
        'title-size' => 'titleFontSize',
        'title-weight' => 'titleFontWeight',
        'title-style' => 'titleFontStyle',
        'title-transform' => 'titleTextTransform',
        'title-decoration' => 'titleTextDecoration',
        'title-align' => 'titleAlignment',
        'title-padding-top' => 'titlePadding.top',
        'title-padding-right' => 'titlePadding.right',
        'title-padding-bottom' => 'titlePadding.bottom',
        'title-padding-left' => 'titlePadding.left',
        
        // Title Hover
        'hover-title-color' => 'hoverTitleColor',
        'hover-title-bg' => 'hoverTitleBackgroundColor',
        
        // Title Active (open)
        'active-title-color' => 'activeTitleColor',
        'active-title-bg' => 'activeTitleBackgroundColor',
        
        // Content
        'content-bg' => 'contentBackgroundColor',
        'content-padding-top' => 'contentPadding.top',
        'content-padding-right' => 'contentPadding.right',
        'content-padding-bottom' => 'contentPadding.bottom',
        'content-padding-left' => 'contentPadding.left',
        
        // Divider
        'divider-width' => 'dividerBorderThickness',
        'divider-style' => 'dividerBorderStyle',
        'divider-color' => 'dividerBorderColor',
        
        // Icon
        'icon-color' => 'iconColor',
        'icon-size' => 'iconSize',
    ];
    
    return $map[$cssName] ?? $cssName;
}

/**
 * Parse CSS value to appropriate PHP type
 */
function parse_css_value($value, $attrName = '') {
    $value = trim($value);
    
    // Remove 'px' suffix and convert to integer
    if (preg_match('/^(\d+)px$/', $value, $match)) {
        return (int)$match[1];
    }
    
    // Remove quotes from string values
    if (preg_match('/^["\'](.+)["\']$/', $value, $match)) {
        return $match[1];
    }
    
    // Return as-is (colors, keywords, etc.)
    return $value;
}
```

### Cache Invalidation

Cache is automatically invalidated when CSS file changes (checks `filemtime`).

For development, clear cache manually:
```php
delete_transient('accordion_parsed_defaults');
```

---

## JavaScript Gets Defaults from PHP

### Localize Defaults to JavaScript

```php
/**
 * Enqueue editor assets and pass defaults to JavaScript
 */
function enqueue_accordion_editor_assets() {
    $asset_file = include plugin_dir_path(__FILE__) . 'build/editor.asset.php';
    
    wp_enqueue_script(
        'accordion-editor',
        plugins_url('build/editor.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );
    
    // Parse CSS and pass to JavaScript
    $defaults = get_accordion_plugin_defaults();
    
    wp_localize_script('accordion-editor', 'accordionDefaults', $defaults);
}
add_action('enqueue_block_editor_assets', 'enqueue_accordion_editor_assets');
```

### Use in JavaScript Editor

```javascript
// editor.js
import { registerBlockType } from '@wordpress/blocks';

// Defaults from PHP (parsed from CSS)
const DEFAULTS = window.accordionDefaults || {};

registerBlockType('custom/accordion', {
    attributes: {
        accordionId: { type: 'string', default: generateId() },
        title: { type: 'string', default: '' },
        currentTheme: { type: 'string', default: '' },
        
        // All customizable attributes default to null
        titleColor: { type: 'string', default: null },
        titleFontSize: { type: 'number', default: null },
        titlePadding: { type: 'object', default: null },
        // ... all other customizable attributes
    },
    
    edit: ({ attributes, setAttributes }) => {
        // Resolve effective values using cascade
        const effectiveValues = resolveEffectiveValues(attributes, DEFAULTS);
        
        return (
            <InspectorControls>
                <ColorPicker
                    label="Title Color"
                    value={effectiveValues.titleColor}
                    onChange={(color) => setAttributes({ titleColor: color })}
                />
                {/* Show effective value in controls */}
            </InspectorControls>
        );
    },
    
    save: ({ attributes }) => {
        // Generate HTML with inline CSS variables for customizations
        const customVars = buildCustomVars(attributes);
        const themeClass = attributes.currentTheme 
            ? `accordion-theme-${attributes.currentTheme}` 
            : 'accordion-theme-default';
        
        return (
            <div 
                className={`wp-block-custom-accordion ${themeClass}`}
                data-accordion-id={attributes.accordionId}
                {...(customVars ? { style: customVars } : {})}
            >
                {/* ... */}
            </div>
        );
    },
});

/**
 * Build inline CSS variables for explicit customizations only
 */
function buildCustomVars(attributes) {
    const vars = [];
    
    // Only add if explicitly set (not null/undefined)
    if (attributes.titleColor !== null && attributes.titleColor !== undefined) {
        vars.push(`--custom-title-color: ${attributes.titleColor}`);
    }
    
    if (attributes.titleFontSize !== null && attributes.titleFontSize !== undefined) {
        vars.push(`--custom-title-size: ${attributes.titleFontSize}px`);
    }
    
    if (attributes.titlePadding !== null && attributes.titlePadding !== undefined) {
        const p = attributes.titlePadding;
        vars.push(`--custom-title-padding: ${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`);
    }
    
    // ... check all customizable attributes
    
    return vars.length > 0 ? vars.join('; ') : null;
}
```

---

## HTML Output Structure

### Complete Accordion Block HTML

```html
<div
  class="wp-block-custom-accordion accordion-theme-default"
  data-accordion-id="a1b2"
  style="--custom-title-color: #ff0000;"
>
  <!-- Optional heading wrapper -->
  <h3 class="accordion-heading">
    <button
      type="button"
      class="accordion-toggle icon-right"
      aria-expanded="false"
      aria-controls="accordion-a1b2-content"
      id="accordion-a1b2-button"
    >
      <span class="accordion-title">What is an accordion?</span>
      
      <!-- Icon -->
      <span class="accordion-icon" data-animate="true">▾</span>
    </button>
  </h3>

  <!-- Content Panel -->
  <div
    id="accordion-a1b2-content"
    class="accordion-content"
    role="region"
    aria-labelledby="accordion-a1b2-button"
    hidden
  >
    <p>An accordion is a vertically stacked list...</p>
  </div>
</div>
```

### HTML Generation Rules

**Unique IDs** (ARIA requirement):
- Block: `data-accordion-id="{accordionId}"`
- Button: `accordion-{accordionId}-button`
- Content: `accordion-{accordionId}-content`

**ARIA Attributes** (accessibility):
- Button: `aria-expanded`, `aria-controls`, `id`
- Content: `role="region"`, `aria-labelledby`, `hidden`

**Heading Wrapper** (SEO):
- If `headingLevel !== "none"`: Wrap button in `<h1-h6>`
- Semantic heading structure for search engines

**Icon Classes**:
- Position: `icon-left`, `icon-right`, `icon-extreme-right`
- Animation: `data-animate="true"` (rotates 180deg when open)

**Initial State**:
- `initiallyOpen === false`: Add `hidden` attribute
- `initiallyOpen === true`: No `hidden`, `aria-expanded="true"`

---

## Theme CSS Generation

### Custom Theme CSS Output

Custom themes stored in database are output as inline CSS in `<head>`:

```php
/**
 * Output custom theme CSS in <head>
 * Only outputs themes actually used on current page
 */
function output_custom_accordion_theme_css() {
    global $post;
    if (!$post) return;
    
    // Scan post for accordion blocks
    $blocks = parse_blocks($post->post_content);
    $customThemeIds = [];
    
    foreach ($blocks as $block) {
        if ($block['blockName'] === 'custom/accordion') {
            $themeId = $block['attrs']['currentTheme'] ?? '';
            
            // Skip default theme (in static CSS file)
            if (empty($themeId)) continue;
            
            if (!in_array($themeId, $customThemeIds)) {
                $customThemeIds[] = $themeId;
            }
        }
    }
    
    if (empty($customThemeIds)) return;
    
    // Get CSS for each theme (from transient cache)
    $allCSS = [];
    foreach ($customThemeIds as $themeId) {
        $css = get_accordion_theme_css($themeId);
        if (!empty($css)) {
            $allCSS[] = $css;
        }
    }
    
    // Output combined CSS
    if (!empty($allCSS)) {
        echo '<style id="accordion-custom-themes-css">';
        echo implode("\n", $allCSS);
        echo '</style>';
    }
}
add_action('wp_head', 'output_custom_accordion_theme_css', 20);

/**
 * Get theme CSS from transient cache or regenerate
 */
function get_accordion_theme_css($themeId) {
    if (empty($themeId)) return null;
    
    // Get theme from database
    $themes = get_option('accordion_themes', []);
    if (!isset($themes[$themeId])) return null;
    
    $theme = $themes[$themeId];
    $currentVersion = $theme['version'];
    
    // Check transient cache
    $transientKey = "accordion_theme_{$themeId}_css";
    $cached = get_transient($transientKey);
    
    if ($cached !== false && 
        isset($cached['version']) && 
        $cached['version'] === $currentVersion) {
        return $cached['css'];
    }
    
    // Regenerate CSS
    $css = generate_theme_css($themeId, $theme['values']);
    
    // Cache with version
    set_transient($transientKey, [
        'version' => $currentVersion,
        'css' => $css
    ], YEAR_IN_SECONDS);
    
    return $css;
}

/**
 * Generate CSS for custom theme
 * Uses same pattern as default theme with CSS variables
 */
function generate_theme_css($themeId, $values) {
    $className = "accordion-theme-{$themeId}";
    
    // Get defaults for null inheritance
    $defaults = get_accordion_plugin_defaults();
    
    // Resolve null inheritance
    $resolved = resolve_null_inheritance($values, $defaults);
    
    // Build CSS using same pattern as accordion.css
    $css = "/* Theme: {$themeId} */\n";
    
    // Wrapper styles
    $css .= ".{$className} {\n";
    $css .= "  border-width: var(--custom-border-width, {$resolved['accordionBorderThickness']}px);\n";
    $css .= "  border-style: var(--custom-border-style, {$resolved['accordionBorderStyle']});\n";
    $css .= "  border-color: var(--custom-border-color, {$resolved['accordionBorderColor']});\n";
    $css .= "  border-radius: var(--custom-border-radius-tl, {$resolved['accordionBorderRadius']['topLeft']}px) ";
    $css .= "var(--custom-border-radius-tr, {$resolved['accordionBorderRadius']['topRight']}px) ";
    $css .= "var(--custom-border-radius-br, {$resolved['accordionBorderRadius']['bottomRight']}px) ";
    $css .= "var(--custom-border-radius-bl, {$resolved['accordionBorderRadius']['bottomLeft']}px);\n";
    $css .= "  box-shadow: var(--custom-shadow, {$resolved['accordionShadow']});\n";
    $css .= "  margin-bottom: var(--custom-margin-bottom, {$resolved['accordionMarginBottom']}px);\n";
    $css .= "}\n\n";
    
    // Title styles
    $css .= ".{$className} .accordion-toggle {\n";
    $css .= "  color: var(--custom-title-color, {$resolved['titleColor']});\n";
    $css .= "  background-color: var(--custom-title-bg, {$resolved['titleBackgroundColor']});\n";
    $css .= "}\n\n";
    
    $css .= ".{$className} .accordion-title {\n";
    $css .= "  font-size: var(--custom-title-size, {$resolved['titleFontSize']}px);\n";
    $css .= "  font-weight: var(--custom-title-weight, {$resolved['titleFontWeight']});\n";
    $css .= "  font-style: var(--custom-title-style, {$resolved['titleFontStyle']});\n";
    $css .= "  text-transform: var(--custom-title-transform, {$resolved['titleTextTransform']});\n";
    $css .= "  text-decoration: var(--custom-title-decoration, {$resolved['titleTextDecoration']});\n";
    $css .= "  text-align: var(--custom-title-align, {$resolved['titleAlignment']});\n";
    $css .= "}\n\n";
    
    $css .= ".{$className} .accordion-toggle {\n";
    $p = $resolved['titlePadding'];
    $css .= "  padding: var(--custom-title-padding, {$p['top']}px {$p['right']}px {$p['bottom']}px {$p['left']}px);\n";
    $css .= "}\n\n";
    
    // Hover styles
    $css .= ".{$className} .accordion-toggle:hover {\n";
    $css .= "  color: var(--custom-hover-title-color, {$resolved['hoverTitleColor']});\n";
    $css .= "  background-color: var(--custom-hover-title-bg, {$resolved['hoverTitleBackgroundColor']});\n";
    $css .= "}\n\n";
    
    // Active styles (open)
    $css .= ".{$className}.is-open .accordion-toggle {\n";
    $css .= "  color: var(--custom-active-title-color, {$resolved['activeTitleColor']});\n";
    $css .= "  background-color: var(--custom-active-title-bg, {$resolved['activeTitleBackgroundColor']});\n";
    $css .= "}\n\n";
    
    // Content styles
    $css .= ".{$className} .accordion-content {\n";
    $css .= "  background-color: var(--custom-content-bg, {$resolved['contentBackgroundColor']});\n";
    $p = $resolved['contentPadding'];
    $css .= "  padding: var(--custom-content-padding, {$p['top']}px {$p['right']}px {$p['bottom']}px {$p['left']}px);\n";
    $css .= "  border-top-width: var(--custom-divider-width, {$resolved['dividerBorderThickness']}px);\n";
    $css .= "  border-top-style: var(--custom-divider-style, {$resolved['dividerBorderStyle']});\n";
    $css .= "  border-top-color: var(--custom-divider-color, {$resolved['dividerBorderColor']});\n";
    $css .= "}\n\n";
    
    // Icon styles
    $css .= ".{$className} .accordion-icon {\n";
    $css .= "  color: var(--custom-icon-color, {$resolved['iconColor']});\n";
    $css .= "  font-size: var(--custom-icon-size, {$resolved['iconSize']}px);\n";
    $css .= "}\n";
    
    // Minify
    $css = preg_replace('/\s+/', ' ', $css);
    $css = str_replace([' {', '{ ', ' }', '; ', ': '], ['{', '{', '}', ';', ':'], $css);
    
    return $css;
}

/**
 * Resolve null inheritance for theme values
 */
function resolve_null_inheritance($values, $defaults) {
    $resolved = array_merge($defaults, $values);
    
    // iconColor inherits from titleColor
    if ($resolved['iconColor'] === null) {
        $resolved['iconColor'] = $resolved['titleColor'];
    }
    
    // iconSize inherits from titleFontSize
    if ($resolved['iconSize'] === null) {
        $resolved['iconSize'] = $resolved['titleFontSize'];
    }
    
    // hoverTitleColor inherits from titleColor
    if ($resolved['hoverTitleColor'] === null) {
        $resolved['hoverTitleColor'] = $resolved['titleColor'];
    }
    
    // activeTitleColor inherits from titleColor
    if ($resolved['activeTitleColor'] === null) {
        $resolved['activeTitleColor'] = $resolved['titleColor'];
    }
    
    // activeTitleBackgroundColor inherits from titleBackgroundColor
    if ($resolved['activeTitleBackgroundColor'] === null) {
        $resolved['activeTitleBackgroundColor'] = $resolved['titleBackgroundColor'];
    }
    
    return $resolved;
}

/**
 * Save theme and invalidate cache
 */
function save_accordion_theme($themeId, $themeName, $values) {
    $themes = get_option('accordion_themes', []);
    
    // Increment version
    $version = isset($themes[$themeId]) ? $themes[$themeId]['version'] + 1 : 1;
    
    $themes[$themeId] = [
        'name' => $themeName,
        'modified' => current_time('mysql'),
        'version' => $version,
        'values' => $values
    ];
    
    update_option('accordion_themes', $themes);
    
    // Invalidate cache
    delete_transient("accordion_theme_{$themeId}_css");
    
    return true;
}
```

---

## JavaScript Requirements

### Toggle Logic

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.wp-block-custom-accordion');
    
    accordions.forEach(accordion => {
        const button = accordion.querySelector('.accordion-toggle');
        const content = accordion.querySelector('.accordion-content');
        const icon = accordion.querySelector('.accordion-icon');
        
        if (!button || !content) return;
        
        button.addEventListener('click', () => {
            const isOpen = !content.hasAttribute('hidden');
            
            if (isOpen) {
                // Close
                content.setAttribute('hidden', '');
                button.setAttribute('aria-expanded', 'false');
                accordion.classList.remove('is-open');
            } else {
                // Open
                content.removeAttribute('hidden');
                button.setAttribute('aria-expanded', 'true');
                accordion.classList.add('is-open');
            }
        });
        
        // Keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                focusNextAccordion(button);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                focusPreviousAccordion(button);
            }
        });
    });
});

function focusNextAccordion(currentButton) {
    const allButtons = Array.from(document.querySelectorAll('.accordion-toggle'));
    const currentIndex = allButtons.indexOf(currentButton);
    const nextButton = allButtons[currentIndex + 1];
    if (nextButton) nextButton.focus();
}

function focusPreviousAccordion(currentButton) {
    const allButtons = Array.from(document.querySelectorAll('.accordion-toggle'));
    const currentIndex = allButtons.indexOf(currentButton);
    const prevButton = allButtons[currentIndex - 1];
    if (prevButton) prevButton.focus();
}
```

---

## Performance Considerations

### CSS Parsing Cache

- Parsed once on first request
- Cached in transient with file modification time
- Auto-invalidates when CSS file changes
- ~5ms cache hit, ~50ms cache miss

### Theme CSS Cache

- Generated once per theme version
- Cached in transients
- Version-based invalidation
- Only used themes output on page

### Inline Styles Minimal

- Only explicit customizations
- Average 2-3 CSS variables per customized accordion
- Non-customized: Zero inline styles

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

✅ **Keyboard Navigation**: Enter/Space (toggle), Arrow keys (navigate)  
✅ **Screen Reader Support**: Complete ARIA implementation  
✅ **Focus Management**: Visible indicators, logical order  
✅ **Color Contrast**: 4.5:1 minimum (AA)  
✅ **Motion Preferences**: Respects `prefers-reduced-motion`  

### Testing Checklist

- [ ] Screen reader announces state (NVDA/JAWS/VoiceOver)
- [ ] All controls keyboard operable
- [ ] Focus indicator visible (2px minimum)
- [ ] No duplicate IDs
- [ ] Color contrast meets WCAG AA
- [ ] Works without JavaScript
- [ ] Respects motion preferences

---

## Complete Implementation Workflow

### 1. Designer Changes Default

```
Edit accordion.css:
:root {
  --accordion-default-title-padding-top: 16px; /* was 12px */
}
```

### 2. Cache Invalidates (Automatic)

PHP checks `filemtime(accordion.css)`, detects change, clears transient.

### 3. Everything Updates

- **Frontend**: Uses new CSS value immediately
- **PHP**: Re-parses CSS, gets new defaults
- **Editor**: Gets new defaults from PHP on next load

### 4. Custom Themes Regenerate

When user updates custom theme:
- Version increments
- Transient invalidated
- Next page load regenerates CSS

### 5. Per-Accordion Customizations Persist

User customized accordion stays customized (inline CSS variables override theme).

---

## Testing Checklist

### Functional Testing

- [ ] Accordion toggles open/closed on click
- [ ] `initiallyOpen` attribute works
- [ ] ARIA attributes update correctly
- [ ] Icon displays/hides based on `showIcon`
- [ ] Icon rotates when `data-animate="true"`
- [ ] All icon positions work (left/right/extreme-right)
- [ ] Default theme styles apply
- [ ] Custom theme styles apply
- [ ] Per-accordion customizations override theme
- [ ] Theme updates propagate to non-customized accordions

### CSS Parsing Testing

- [ ] Defaults parse correctly from `accordion.css`
- [ ] Cache invalidates when CSS file changes
- [ ] PHP gets correct values
- [ ] JavaScript gets correct values from PHP
- [ ] Nested attributes parse (padding, border-radius)

### Cache Testing

- [ ] CSS defaults cached in transient
- [ ] Cache hit on subsequent requests
- [ ] Cache invalidates on file change
- [ ] Custom theme CSS cached
- [ ] Theme cache invalidates on version change

### Keyboard Testing

- [ ] Enter/Space toggles accordion
- [ ] Arrow Up/Down navigates between accordions
- [ ] Focus indicator visible

### Accessibility Testing

- [ ] Screen reader announces state
- [ ] All ARIA attributes present
- [ ] No duplicate IDs
- [ ] Color contrast meets WCAG AA
- [ ] Works without JavaScript

### Performance Testing

- [ ] CSS parsing < 50ms (uncached)
- [ ] CSS parsing < 5ms (cached)
- [ ] Page load overhead < 100ms
- [ ] Only used themes output on page

---

## Summary

### Key Architectural Principles

1. **CSS as Single Source of Truth**
   - All defaults in `accordion.css` at `:root`
   - Change one file, everything updates
   - No duplicate value definitions

2. **Parsed Once, Cached Forever**
   - PHP parses CSS on first request
   - Cached in transient with file modification time
   - Auto-invalidates on file change

3. **JavaScript Gets from PHP**
   - No hardcoded defaults in JavaScript
   - `wp_localize_script` passes parsed values
   - Editor always in sync with CSS

4. **Two-Level CSS Variables**
   - `--custom-*` for per-accordion overrides
   - `--accordion-default-*` for theme/default fallbacks
   - Elegant cascade system

5. **Theme Updates Propagate Automatically**
   - Version-based cache invalidation
   - No batch HTML regeneration
   - Customizations persist

### When Designer Changes Defaults

```
1. Edit accordion.css (one line)
2. Save file
3. Done! Everything updates automatically:
   ├─ Frontend ✅
   ├─ PHP ✅
   └─ JavaScript ✅
```

### Required Files

**Frontend Assets:**
- `accordion.css` - Single source of truth (all styles + defaults)
- `accordion.js` - Interaction logic

**PHP Functions:**
- `get_accordion_plugin_defaults()` - Parse CSS, return array
- `parse_css_defaults()` - Extract :root variables
- `map_css_name_to_attribute()` - Map CSS names to attributes
- `parse_css_value()` - Parse CSS values to PHP types
- `output_custom_accordion_theme_css()` - Output theme CSS in `<head>`
- `get_accordion_theme_css()` - Get/cache theme CSS
- `generate_theme_css()` - Build theme CSS string
- `resolve_null_inheritance()` - Handle inherited attributes
- `save_accordion_theme()` - Save and invalidate cache

**Editor Functions (JavaScript):**
- `window.accordionDefaults` - Defaults from PHP
- `buildCustomVars()` - Build inline CSS variables for customizations
- `save()` - Generate HTML with inline CSS variables

### Implementation Order

1. ✅ Create `accordion.css` with `:root` variables
2. ✅ Implement CSS parsing in PHP
3. ✅ Implement transient caching
4. ✅ Localize defaults to JavaScript
5. ✅ Implement custom theme generation
6. ✅ Implement editor `save()` with CSS variables
7. ✅ Create `accordion.js` for interactions
8. ✅ Test cache invalidation
9. ✅ Test theme updates
10. ✅ Test accessibility

### Critical Success Factors

✅ **CSS file is single source of truth** - No duplicates anywhere  
✅ **Parse once, cache forever** - Performance optimized  
✅ **File modification time check** - Auto-invalidation  
✅ **Two-level CSS variables** - Elegant override system  
✅ **Version-based theme cache** - Reliable updates  

---

## Related Documentation

- **BLOCK-ATTRIBUTES-SCHEMA.md** - All attribute definitions
- **EDITOR-UI-REQUIREMENTS.md** - Editor interface and controls
- **accordion.css** - Single source of truth for all defaults and styles

---

## Changelog

**v6.0 (2025-10-12)**
- Complete redesign with CSS as single source of truth
- All defaults defined at `:root` in `accordion.css`
- PHP parses CSS file (cached with file modification time)
- JavaScript gets defaults from PHP via `wp_localize_script`
- Simplified maintenance: change one file, everything updates
- Removed duplicate value definitions across files
- Added comprehensive parsing and caching logic

**v5.0 (Previous)**
- Clarified three-tier CSS system with CSS custom properties
- Added per-accordion customization via inline CSS variables

**v4.0 (Previous)**
- Integrated transients-based CSS caching
- Optimized inline CSS output

---

## Conclusion

This architecture achieves:

- **Single Source of Truth**: All defaults in `accordion.css`
- **Automatic Sync**: Change CSS, everything updates
- **Performance**: Parse once, cache forever
- **Maintainability**: One file to edit
- **Flexibility**: Three-tier CSS system
- **Accessibility**: Full WCAG 2.1 AA compliance

The system is production-ready, optimized for WordPress best practices, and designed for long-term maintainability.
