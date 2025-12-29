# Architecture Fixes - December 29, 2025

## Critical Fixes to Decomposed Values System

This document records critical architectural fixes made to the decomposed values system that resolve CSS variable generation issues.

### Date
2025-12-29

### Issues Resolved

1. **Double Units in CSS Variables** (`--accordion-block-margin-mobile: 41em 0emem 56em`)
2. **Border Properties Not Rendering** (cssnano merge-longhand breaking decomposed pattern)

---

## Issue 1: Double Units in CSS Variables

### Problem Description

CSS variables were being generated with double units, producing invalid values like:
```css
--accordion-block-margin-mobile: 41em 0emem 56em;
```

This resulted in broken spacing and layout.

### Root Cause

**Schema defaults were storing values as strings with embedded units** instead of following the decomposed value format:

```json
// ❌ INCORRECT (old format):
{
  "blockMargin": {
    "default": {
      "top": "1em",
      "right": "0em",
      "bottom": "1em",
      "left": "0em"
    }
  }
}
```

The `formatCssValue()` function in `shared/src/config/css-var-mappings-generated.js` expects numeric values and applies units based on the `unit` field. When it received strings like `"1em"`, it returned them as-is (line 558-559):

```js
if (typeof sideValue === 'string') return sideValue;
```

Then `compressBoxValue()` would add the unit again: `"1em" + "em"` = `"1emem"`.

### Solution

**Updated all schema defaults to use numeric values with a separate `unit` field:**

```json
// ✅ CORRECT (new format):
{
  "blockMargin": {
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

### Files Modified

**schemas/accordion.json** - Fixed defaults for:
- `dividerWidth` - Converted to numeric values with unit field
- `borderWidth` - Converted to numeric values with unit field
- `borderRadius` - Converted to numeric values with unit field
- `shadow` - Converted to nested objects with value/unit structure
- `headerPadding` - Converted to numeric values with unit field
- `contentPadding` - Converted to numeric values with unit field
- `blockMargin` - Converted to numeric values with unit field

**schemas/tabs.json** - Fixed defaults for:
- `borderWidth` - Changed from `"0px"` (string) to `0` (number)
- `tabButtonBorderWidth` - Changed from `"1px"` to `1`
- `tabButtonActiveContentBorderWidth` - Changed from `"1px"` to `1`
- `tabsRowBorderWidth` - Changed from `"0px"` to `0`
- `tabsListContentBorderWidth` - Changed from `"1px"` to `1`
- `panelBorderWidth` - Changed from `"1px"` to `1`

**schemas/toc.json** - Fixed defaults for:
- `blockBorderWidth` - Changed from `"1px"` to `"1"` (string type for this field)
- `blockBorderRadius` - Converted from strings (`"4px"`) to numeric values with unit field

### Code Flow

1. Schema defines numeric values: `{ top: 1, unit: "em" }`
2. Schema compiler generates attributes: `{"top":1,"right":0,"bottom":1,"left":0,"unit":"em"}`
3. `formatCssValue()` receives numeric value, applies unit: `"1" + "em"` = `"1em"` ✓
4. CSS variable correctly output: `--accordion-block-margin-mobile: 1em 0em 1em 0em`

---

## Issue 2: Border Properties Not Rendering

### Problem Description

Border properties were not rendering in the browser. The built CSS contained invalid syntax:

```css
/* BROKEN OUTPUT: */
border-width: var(--accordion-border-width-top) var(--accordion-border-width-right)
              var(--accordion-border-width-bottom) var(--accordion-border-width-left);
```

When any of the side variables were undefined, the entire property would fail.

### Root Cause

**cssnano's `merge-longhand` plugin was incorrectly "optimizing" the decomposed pattern.**

The source SCSS correctly used the shorthand + longhand pattern:

```scss
/* SOURCE (CORRECT): */
border-width: var(--accordion-border-width, 1px);
border-top-width: var(--accordion-border-width-top);
border-right-width: var(--accordion-border-width-right);
border-bottom-width: var(--accordion-border-width-bottom);
border-left-width: var(--accordion-border-width-left);
```

But cssnano's merge-longhand plugin was merging these into:

```css
/* CSSNANO OUTPUT (BROKEN): */
border-width: var(--accordion-border-width-top) var(--accordion-border-width-right)
              var(--accordion-border-width-bottom) var(--accordion-border-width-left);
```

**Problems with this output:**
1. Removes the fallback value (`1px`)
2. If any side variable is undefined, entire property fails
3. Breaks the CSS cascade pattern

### Solution

**Created PostCSS configuration to disable `mergeLonghand` optimization:**

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: [
        'default',
        {
          // Disable merge-longhand to preserve decomposed patterns
          mergeLonghand: false,

          // Keep other optimizations enabled
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

### Files Created

- `postcss.config.js` - PostCSS configuration with cssnano settings

### Why This Pattern Must Be Preserved

The decomposed value pattern relies on CSS cascade behavior:

1. **Shorthand with fallback** provides default value when no customizations exist
2. **Longhand overrides** allow per-side customization when needed
3. **Responsive variants** create device-specific fallback chains

```css
/* Desktop (base) */
border-width: var(--accordion-border-width, 1px);           /* Fallback: 1px */
border-top-width: var(--accordion-border-width-top);        /* Override if set */

/* Tablet */
border-width: var(--accordion-border-width-tablet,
              var(--accordion-border-width, 1px));          /* Chain fallbacks */
border-top-width: var(--accordion-border-width-top-tablet,
                  var(--accordion-border-width-top));       /* Chain overrides */
```

Merging longhand into shorthand breaks this pattern by removing fallback values.

### Fix 3: Missing Fallback Chains in CSS Generator

After implementing the PostCSS fix, borders still didn't work because the **CSS generator** itself wasn't creating proper fallback chains for longhand properties.

**Problem:**

The `buildSideVar()` function in `build-tools/css-generator.js` (line 585) was generating:

```scss
border-top-width: var(--accordion-border-width-top);  /* No fallback! */
```

When `--accordion-border-width-top` was undefined, this property became invalid and fell back to the CSS initial value (`medium`), not the shorthand value.

**Solution:**

Modified `buildSideVar()` and `buildResponsiveSideVar()` to always include fallback chains:

```js
function buildSideVar(attr, entry) {
  const sideVar = `--${attr.cssVar}-${entry.varSuffix}`;
  const shorthandVar = `--${attr.cssVar}`;

  // Build fallback chain: side var → shorthand var → default value
  if (entry.fallback) {
    // CompactMargin case: has explicit side fallback
    return `var(${sideVar}, ${entry.fallback})`;
  }

  // Standard decomposed properties: fall back to shorthand + default
  return `var(${sideVar}, var(${shorthandVar}, ${attr.default}))`;
}
```

**Generated output:**
```scss
border-width: var(--accordion-border-width, 1px);
border-top-width: var(--accordion-border-width-top, var(--accordion-border-width, 1px));
border-right-width: var(--accordion-border-width-right, var(--accordion-border-width, 1px));
```

### Files Modified

- `build-tools/css-generator.js`:
  - Modified `buildSideVar()` function (line 585-598)
  - Modified `buildResponsiveSideVar()` function (line 600-627)

### Build Validator: CSS Fallback Chains

Created an automated validator (`build-tools/validate/css-fallback-chains.js`) that runs during the build process to ensure this issue never happens again.

**What it validates:**
- All decomposed longhand properties have fallback chains to their shorthand
- Fallback chains are preserved across responsive breakpoints
- Detects CompactMargin special case (no shorthand required)

**How it works:**
1. Parses generated `*_variables.scss` files
2. Finds all longhand properties (border-top-width, padding-left, etc.)
3. Checks each has a fallback chain to its shorthand variable
4. Reports any missing fallbacks with line numbers and suggested fixes

**Integration:**
- Added to CSS validation group in `build-tools/validate/run.js`
- Runs automatically during `npm run validate:css` and `npm run build`
- Exits with error if fallbacks are missing, preventing broken builds

**Example validation output:**
```
CSS Fallback Chain Validation

✓ accordion
✓ tabs
✓ toc

✓ All fallback chains validated successfully
```

---

## Architecture Principles Reinforced

### 1. Schema Format Consistency

**All box-like values MUST use numeric values with separate `unit` field:**

- ✅ `{ top: 12, right: 16, bottom: 12, left: 16, unit: "px" }`
- ❌ `{ top: "12px", right: "16px", bottom: "12px", left: "16px" }`

This applies to:
- Padding/Margin (sides)
- Border width/color/style (sides)
- Border radius (corners)
- Shadow properties (x/y/blur/spread)

### 2. Build Pipeline Awareness

**CSS optimizers must be configured to preserve architectural patterns:**

- The decomposed value pattern is NOT a mistake or inefficiency
- It's an intentional design for flexible CSS variable system
- Build tools must be configured to preserve it

### 3. CSS Cascade Reliance

**The system relies on CSS cascade for fallback chains:**

```
User customization → Theme value → Schema default
```

This pattern requires:
- Shorthand properties with fallback values
- Optional longhand overrides
- Preserved in build output

---

## Testing & Validation

After applying fixes, verify:

1. **Attribute defaults have correct format:**
   ```bash
   grep "blockMargin" blocks/accordion/src/accordion-attributes.js
   # Should show: {"top":1,"right":0,"bottom":1,"left":0,"unit":"em"}
   ```

2. **Built CSS preserves longhand properties:**
   ```bash
   grep "border-top-width" build/blocks/accordion/accordion.css
   # Should show: border-top-width:var(--accordion-border-width-top)
   ```

3. **No double units in generated CSS:**
   ```bash
   grep -o "[0-9]em[0-9a-z]*em" build/blocks/accordion/accordion.css
   # Should return empty (no matches)
   ```

4. **PostCSS config exists and is correct:**
   ```bash
   grep "mergeLonghand" postcss.config.js
   # Should show: mergeLonghand: false
   ```

5. **Run validation suite:**
   ```bash
   npm run validate
   ```

---

## Related Documentation

- **[DECOMPOSED-VALUES.md](./DECOMPOSED-VALUES.md)** - Complete decomposed values system documentation
- **[postcss.config.js](../postcss.config.js)** - Build configuration
- **[schemas/*.json](../schemas/)** - Schema definitions with correct format examples

---

## Migration Notes

If you have custom blocks or themes using the old schema format:

1. Update all schema defaults to use numeric values + unit field
2. Run schema compiler: `npm run schema:build`
3. Verify PostCSS config exists with `mergeLonghand: false`
4. Rebuild: `npm run build`
5. Test border/padding/margin properties render correctly

---

## Changelog

### 2025-12-29 - Initial Fixes

**Changed:**
- Updated `schemas/accordion.json` - All box-like defaults now use numeric format
- Updated `schemas/tabs.json` - All border width defaults now use numeric format
- Updated `schemas/toc.json` - Border width and border radius defaults now use correct format
- Created `postcss.config.js` - Disabled cssnano merge-longhand optimization
- Updated `build-tools/css-generator.js` - Added fallback chains to decomposed longhand properties
- Created `build-tools/validate/css-fallback-chains.js` - Validator to prevent missing fallbacks
- Updated `build-tools/validate/run.js` - Integrated fallback chain validator into CSS validation group
- Updated `docs/DECOMPOSED-VALUES.md` - Added schema requirements, troubleshooting, and validator docs
- Created `docs/ARCHITECTURE-FIXES-2025-12-29.md` - Complete documentation of fixes

**Impact:**
- CSS variables now generate with correct units (no double units)
- Border properties now render correctly in browser
- Decomposed value pattern preserved through build pipeline

**Breaking Changes:**
- None (internal schema format change, backward compatible)

**Validation:**
- All builds pass validation suite
- Generated CSS verified correct
- Border/padding/margin properties tested in browser
