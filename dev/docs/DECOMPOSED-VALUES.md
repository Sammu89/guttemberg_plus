# Decomposed Values (Box Controls)

This document defines how box-like values (padding, margin, border width/style/color,
border radius) are decomposed into per-side CSS variables and applied consistently
across editor, frontend, and theme CSS.

## Table of Contents
- [Supported Properties](#supported-properties)
- [Data Shapes](#data-shapes)
- [Schema Format Requirements](#schema-format-requirements)
- [CSS Variable Naming](#css-variable-naming)
- [CSS Output Rules](#css-output-rules)
- [Build Configuration](#build-configuration)
- [Common Issues](#common-issues)

## Supported Properties

- `padding`
- `margin` (CompactMargin uses **top/bottom only**)
- `border-width`
- `border-color`
- `border-style`
- `border-radius`
- `scroll-padding`
- `scroll-margin`

## Data Shapes

### Box (sides)
```js
{
  top: 12,
  right: 16,
  bottom: 12,
  left: 16,
  unit: "px",
  linked: true
}
```

### Border radius (corners)
```js
{
  topLeft: 4,
  topRight: 4,
  bottomRight: 4,
  bottomLeft: 4,
  unit: "px"
}
```

### Responsive wrapper
```js
{
  value: { top: 12, right: 16, bottom: 12, left: 16, unit: "px" },
  tablet: { top: 10, right: 12, bottom: 10, left: 12, unit: "px" },
  mobile: { top: 8, right: 10, bottom: 8, left: 10, unit: "px" }
}
```

## Schema Format Requirements

**CRITICAL**: Schema defaults MUST use numeric values with a separate `unit` field, NOT strings with embedded units.

### ✅ CORRECT Format

```json
{
  "blockMargin": {
    "type": "object",
    "default": {
      "top": 1,
      "right": 0,
      "bottom": 1,
      "left": 0,
      "unit": "em"
    }
  }
}
```

For border radius (corners):
```json
{
  "borderRadius": {
    "type": "object",
    "default": {
      "topLeft": 4,
      "topRight": 4,
      "bottomRight": 4,
      "bottomLeft": 4,
      "unit": "px"
    }
  }
}
```

For shadows:
```json
{
  "shadow": {
    "type": "array",
    "default": [
      {
        "x": { "value": 0, "unit": "px" },
        "y": { "value": 8, "unit": "px" },
        "blur": { "value": 24, "unit": "px" },
        "spread": { "value": 0, "unit": "px" },
        "color": "rgba(0,0,0,0.15)",
        "inset": false
      }
    ]
  }
}
```

### ❌ INCORRECT Format (DO NOT USE)

```json
{
  "blockMargin": {
    "type": "object",
    "default": {
      "top": "1em",
      "right": "0em",
      "bottom": "1em",
      "left": "0em"
    }
  }
}
```

**Why This Matters**: The `formatCssValue()` function in `css-var-mappings-generated.js` expects numeric values and adds units based on the `unit` field. If values are already strings with units, it will result in double units (e.g., `"1em"` → `"1emem"`).

## CSS Variable Naming

Base:
- `--{cssVar}` (shorthand)
- `--{cssVar}-top` / `-right` / `-bottom` / `-left`
- `--{cssVar}-top-left` / `-top-right` / `-bottom-right` / `-bottom-left` (radius)

Responsive:
- `--{cssVar}-tablet`, `--{cssVar}-mobile`
- `--{cssVar}-top-tablet`, `--{cssVar}-top-mobile`, etc.

## CSS Output Rules

### Shorthand + Longhand Override

For decomposable properties, CSS uses the shorthand value and then overrides with
longhand properties **only when side vars exist**:

```scss
.element {
  padding: var(--accordion-header-padding, 16px 20px);
  padding-top: var(--accordion-header-padding-top);
  padding-right: var(--accordion-header-padding-right);
  padding-bottom: var(--accordion-header-padding-bottom);
  padding-left: var(--accordion-header-padding-left);
}
```

### Responsive Overrides

```scss
[data-gutplus-device="tablet"] .element {
  padding: var(--accordion-header-padding-tablet, var(--accordion-header-padding, 16px 20px));
  padding-top: var(--accordion-header-padding-top-tablet, var(--accordion-header-padding-top));
  padding-right: var(--accordion-header-padding-right-tablet, var(--accordion-header-padding-right));
  padding-bottom: var(--accordion-header-padding-bottom-tablet, var(--accordion-header-padding-bottom));
  padding-left: var(--accordion-header-padding-left-tablet, var(--accordion-header-padding-left));
}
```

Mobile chains include tablet fallbacks:
```scss
[data-gutplus-device="mobile"] .element {
  padding: var(--accordion-header-padding-mobile, var(--accordion-header-padding-tablet, var(--accordion-header-padding, 16px 20px)));
  padding-top: var(--accordion-header-padding-top-mobile, var(--accordion-header-padding-top-tablet, var(--accordion-header-padding-top)));
  /* ... */
}
```

### CompactMargin (Top/Bottom Only)

CompactMargin avoids horizontal conflicts with alignment by only applying:

```scss
.element {
  margin-top: var(--accordion-block-margin-top, 1em);
  margin-bottom: var(--accordion-block-margin-bottom, 1em);
}
```

## Where Vars Come From

### Editor (preview)
- `buildEditorCssVars(effectiveValues)` emits shorthand + side vars (base/tablet/mobile).

### Frontend (save)
- `buildFrontendCssVars(customizations, attributes)` emits:
  - themeable values from `customizations`
  - non-themeable values from `attributes`
  - shorthand + side vars for responsive and non-responsive values

### Theme CSS (PHP)
- Theme generator outputs shorthand + side vars for theme values, including responsive overrides.

## Precedence Rules (Summary)

1. Device-specific side vars (`-top-tablet`, `-top-mobile`) override base side vars.
2. Side vars override shorthand vars.
3. Shorthand vars fall back to schema defaults via `var()` fallback values.

## Example: Unlinked Padding (Non-Responsive)

Value:
```js
{ top: 12, right: 24, bottom: 16, left: 24, unit: "px", linked: false }
```

Inline CSS vars:
```css
--accordion-header-padding: 12px 24px 16px 24px;
--accordion-header-padding-top: 12px;
--accordion-header-padding-right: 24px;
--accordion-header-padding-bottom: 16px;
--accordion-header-padding-left: 24px;
```

Result: side vars override the shorthand, yielding correct per-side values.

## Build Configuration

### PostCSS Configuration

The project requires a custom PostCSS configuration (`postcss.config.js`) to prevent cssnano from breaking the decomposed value pattern.

**Critical Setting**: `mergeLonghand: false`

```js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: [
        'default',
        {
          // CRITICAL: Disable merge-longhand to preserve decomposed patterns
          mergeLonghand: false,

          // Other optimizations remain enabled
          normalizeWhitespace: true,
          colormin: true,
          minifySelectors: true,
          minifyFontValues: true,
          discardComments: { removeAll: true },
        }
      ]
    })
  ]
};
```

**Why This Is Required**:

Without `mergeLonghand: false`, cssnano attempts to "optimize" the shorthand + longhand pattern:

```css
/* Source (CORRECT): */
border-width: var(--accordion-border-width, 1px);
border-top-width: var(--accordion-border-width-top);
border-right-width: var(--accordion-border-width-right);
border-bottom-width: var(--accordion-border-width-bottom);
border-left-width: var(--accordion-border-width-left);

/* cssnano with mergeLonghand=true (BROKEN): */
border-width: var(--accordion-border-width-top) var(--accordion-border-width-right)
              var(--accordion-border-width-bottom) var(--accordion-border-width-left);
/* ❌ Removes fallback value, creates invalid CSS when side vars are undefined */
```

The decomposed pattern REQUIRES the shorthand with fallback followed by optional longhand overrides. Merging them removes the fallback and breaks the cascade.

## Common Issues

### Issue 1: Double Units in CSS Variables

**Symptom**: CSS variables output with double units like `--accordion-block-margin-mobile: 41em 0emem 56em`

**Cause**: Schema defaults use strings with embedded units instead of numeric values with separate unit field.

**Fix**: Update schema to use correct format (see [Schema Format Requirements](#schema-format-requirements)):

```json
// Before (❌):
"default": { "top": "1em", "right": "0em", "bottom": "1em", "left": "0em" }

// After (✅):
"default": { "top": 1, "right": 0, "bottom": 1, "left": 0, "unit": "em" }
```

After fixing schema, rebuild: `npm run schema:build && npm run build`

### Issue 2: Border/Padding Properties Not Working

**Symptom**: Border, padding, or margin properties don't render in the browser.

**Cause**: cssnano's `mergeLonghand` plugin incorrectly merged the decomposed pattern into invalid CSS.

**Fix**: Ensure `postcss.config.js` exists with `mergeLonghand: false` (see [Build Configuration](#build-configuration)).

After adding/updating PostCSS config, rebuild: `npm run build`

### Issue 3: Values Not Updating After Schema Change

**Symptom**: Changed schema defaults but CSS variables still show old values.

**Cause**: Generated files are not updated automatically.

**Fix**: Run the schema compiler and rebuild:
```bash
npm run schema:build && npm run build
```

### Debugging Tips

1. **Check attribute defaults**: Generated attribute files should show numeric values:
   ```js
   // blocks/accordion/src/accordion-attributes.js
   blockMargin: {
     type: 'object',
     default: {"top":1,"right":0,"bottom":1,"left":0,"unit":"em"}, // ✅ Correct
   }
   ```

2. **Check built CSS**: Look for preserved longhand properties:
   ```bash
   grep "border-top-width" build/blocks/accordion/accordion.css
   # Should show: border-top-width:var(--accordion-border-width-top)
   ```

3. **Check PostCSS config**: Verify `postcss.config.js` exists and has `mergeLonghand: false`

4. **Validate CSS vars**: Run validation after build:
   ```bash
   npm run validate:css
   ```

### Build Validator: CSS Fallback Chains

A dedicated validator (`build-tools/validate/css-fallback-chains.js`) checks that all decomposed longhand properties have proper fallback chains to their shorthand properties.

**What it validates:**
- All `border-*-width`, `border-*-color`, `border-*-style` properties fall back to `border-width/color/style`
- All `border-*-radius` properties fall back to `border-radius`
- All `padding-*` and `margin-*` properties fall back to their shorthands (except CompactMargin)
- Fallback chains are preserved across desktop/tablet/mobile breakpoints

**Why this matters:**
Without fallback chains, when a side-specific CSS variable is undefined, the longhand property becomes invalid and falls back to the CSS initial value (NOT the shorthand value). This breaks the entire decomposed value pattern.

**Correct pattern:**
```scss
border-width: var(--accordion-border-width, 1px);  /* Shorthand with default */
border-top-width: var(--accordion-border-width-top, var(--accordion-border-width, 1px));  /* Falls back to shorthand */
```

**Incorrect pattern (caught by validator):**
```scss
border-width: var(--accordion-border-width, 1px);
border-top-width: var(--accordion-border-width-top);  /* ❌ No fallback - breaks when undefined! */
```

Run manually: `node build-tools/validate/css-fallback-chains.js`

