# Responsiveness Plan (Universal, Schema-Driven)

## Purpose
Deliver a universal responsive system that:
- Auto-generates device-specific CSS variables (`-tablet`, `-mobile`) from schema.
- Works for both themeable and non-themeable attributes.
- Honors delta-based themes (theme CSS uses deltas only).
- Keeps editor preview and frontend output consistent.
- Supports decomposed values (padding/margin/border) cleanly and predictably.

This document is the **single source of implementation guidance** for agents.

---

## Key Principles (Non-Negotiable)
1) **Schema is the source of truth.**
2) **All responsive CSS is driven by CSS variables**, not inline styles.
3) **Device switching is always via `data-gutplus-device`**.
4) **Theme CSS only uses themeable deltas**; non-themeable responsive values are per-block only.
5) **No manual mapping in edit/save files**; generators must produce helpers.

---

## Current System (Facts to Align With)

### Device Switching
Editor:
- `shared/src/hooks/useResponsiveDevice.js` listens to global device state.
- `shared/src/utils/responsive-device.js` manages `window.gutplusDevice`.
- Blocks set `data-gutplus-device` in `blocks/*/src/edit.js`.

Frontend:
- Each block’s `frontend.js` sets `data-gutplus-device` based on viewport width.
  - Example: `blocks/accordion/src/frontend.js` sets on resize.

CSS Generator:
- `build-tools/css-generator.js` outputs responsive selectors:
  - `[data-gutplus-device="tablet"]` and `[data-gutplus-device="mobile"]`
  - Uses CSS vars `--var-tablet` / `--var-mobile` if `responsive: true`.

### Responsive Value Shapes (Must Be Preserved)
SliderWithInput (string/number + unit):
- Base (global): `"1.25rem"` OR `{ value: 1.25, unit: "rem" }`
- Responsive overrides: `{ tablet: { value: 1, unit: "rem" }, mobile: "0.875rem" }`

Box values (padding/margin/border):
- Base: `{ top, right, bottom, left, unit, linked }`
- Responsive: `{ value: { top, right, bottom, left, unit }, tablet: {...}, mobile: {...} }`

These structures are already used in:
- `shared/src/components/ControlRenderer.js`
- `shared/src/components/controls/SliderWithInput.js`
- `shared/src/utils/box-value-utils.js`

---

## The Problem We Must Fix
1) **Editor CSS vars only output base values**, not device-specific ones.
2) **CSS generator ignores non-themeable attributes**, so responsive non-themeable
   values (e.g., block width) never have vars to switch.
3) **Save.js mixes inline styles and CSS vars**, which breaks consistency.

---

## Target Architecture (Universal)

### A) Schema Rules
Any attribute that affects CSS **and** can be responsive must include:
- `responsive: true`
- `cssVar`
- `appliesTo` (must resolve in structure schema)
- `cssProperty` (or `variants` + `dependsOn`)
- `outputsCSS !== false`

This is **required** even when `themeable: false`.

### B) CSS Generator Rule
`build-tools/css-generator.js` must include **all** attributes that output CSS,
not just `themeable: true`. Eligibility should be based on:
- `outputsCSS !== false`
- `cssVar` exists
- `cssProperty` or `variants` exist
- `appliesTo` resolves to a structure element

### C) CSS Var Output Rule (Editor + Frontend)
Two generated helpers (per block) must exist:
- `buildEditorCssVars(effectiveValues)` → editor preview
- `buildFrontendCssVars(customizations, attributes)` → frontend output

Both helpers must emit:
- Base var: `--{cssVar}`
- Tablet override: `--{cssVar}-tablet` (if `tablet` exists)
- Mobile override: `--{cssVar}-mobile` (if `mobile` exists)

### D) Theme Rule
Theme classes (PHP) must emit responsive vars for themeable attributes **only**:
- Base var + tablet + mobile if overrides exist.
- Non-themeable responsive vars are never in theme classes (block-level only).

---

## Detailed Implementation Steps

### Step 1: Validator (Build-Time)
**Goal:** Prevent schema drift. Every responsive attribute that outputs CSS must
define `cssVar` + `appliesTo`.

Add a validator (new or extend existing):
- Best locations:
  - `build-tools/validate-schema-usage.js` (extend), or
  - new `build-tools/validate-responsive-css-attrs.js`.

Rules:
1) If `attr.responsive === true` AND `outputsCSS !== false`:
   - Require `cssVar` and `appliesTo`.
2) If `cssVar` is present but `appliesTo` is missing → error.
3) If `appliesTo` is present but `cssVar` missing → error.
4) If `appliesTo` exists, validate it resolves via:
   - `schemas/*-structure.json` and the `getSelector()` logic in
     `build-tools/css-generator.js`.

Integration:
- Add to `npm run schema:build` pipeline in `package.json` (or same task runner
  that calls `build-tools/schema-compiler.js` / `build-tools/css-generator.js`).

---

### Step 2: CSS Generator Expansion
**File:** `build-tools/css-generator.js`

Update `extractCssAttributes()`:
- Currently filters out non-themeable attributes.
- Replace condition:
  - Old: `if (!attr.themeable || !attr.cssVar || ...) continue;`
  - New: `if (attr.outputsCSS === false || !attr.cssVar || ...) continue;`

This ensures CSS rules exist for non-themeable responsive properties
like block width.

---

### Step 3: Generator for Editor CSS Vars
**Goal:** editor preview uses the same CSS-var logic as frontend.

Add a new generator (in build-tools/generators):
- Example: `build-tools/generators/editor-css-vars-injector.js`

Generated function signature (per block):
```
export function buildEditorCssVars(effectiveValues) { ... }
```

Rules:
- For each schema attr with `cssVar` + `outputsCSS !== false`:
  - Resolve base value:
    - `base = value.value ?? value` (for responsive wrapper)
  - `styles[cssVar] = formatCssValue(attrName, base, blockType)`
  - If responsive and `tablet` or `mobile` exist:
    - `styles[cssVar + '-tablet'] = formatCssValue(attrName, value.tablet, blockType)`
    - `styles[cssVar + '-mobile'] = formatCssValue(attrName, value.mobile, blockType)`

Source:
- Use `effectiveValues` (defaults + theme + customizations).
  - This ensures editor preview matches theme selection and deltas.

Integration in blocks:
- Replace custom `getEditorCSSVariables()` with generated helper:
  - In `blocks/*/src/edit.js`, import and call `buildEditorCssVars(effectiveValues)`.
- Spread into `rootStyles`:
  - `...editorCSSVars`

---

### Step 4: Generator for Frontend CSS Vars (Save)
**Goal:** frontend output uses same CSS-var logic, while keeping deltas.

Add generator (in build-tools/generators):
- Example: `build-tools/generators/frontend-css-vars-injector.js`

Generated function signature:
```
export function buildFrontendCssVars(customizations, attributes) { ... }
```

Rules:
- Themeable attributes:
  - Use `customizations` only (delta-based).
- Non-themeable attributes that output CSS:
  - Use `attributes` directly (per-block value).
- For responsive attributes:
  - Emit base + tablet + mobile vars as in Step 3.

Integration in save:
- Replace manual `getCustomizationStyles()` usage with:
  - `const inlineStyles = buildFrontendCssVars(attributes.customizations, attributes);`
- Remove inline style assignments that duplicate CSS vars (e.g., width).

---

### Step 5: PHP Theme CSS Generator (Responsive Vars)
**File:** `php/theme-css-generator.php`

Update `guttemberg_plus_generate_theme_css_rules()`:
- If theme value is responsive object (has `tablet` or `mobile`):
  - Base value is `value.value ?? value` (base at root).
  - Emit:
    - `--cssVar: base;`
    - `--cssVar-tablet: tablet;` (if exists)
    - `--cssVar-mobile: mobile;` (if exists)
- Use mapping from `php/css-defaults/css-mappings-generated.php`.

Ensure format consistency:
- Match JS `formatCssValue()` for:
  - Numbers with units
  - Objects (box values, radius)
  - Strings (font-family, etc.)

---

### Step 6: Decomposed Values (Padding/Margin/Border)
**Goal:** define a consistent, schema-driven rule for special decompositions.

Preferred approach:
- Add a schema-level hint like:
  - `transformValue: "marginVertical"` (or similar)
- Extend formatter to emit multiple vars:
  - `--block-margin-top`, `--block-margin-bottom`
  - `--block-margin-top-tablet`, `--block-margin-bottom-tablet`
  - `--block-margin-top-mobile`, `--block-margin-bottom-mobile`

Where to implement:
- JS: in shared formatter used by generators.
- PHP: mirror the same decomposition logic for theme output.

This removes ad-hoc block-specific logic currently in:
- `blocks/accordion/src/save.js` (blockMargin special handling)
- `blocks/accordion/src/edit.js` (inline margin handling)

---

### Step 7: Schema Updates (Concrete Example)
Example (accordion width):
```
"accordionWidth": {
  "type": "string",
  "default": "100%",
  "label": "Block Width",
  "control": "SliderWithInput",
  "cssVar": "accordion-width",
  "cssProperty": "width",
  "appliesTo": "container",
  "responsive": true,
  "themeable": false
}
```

Make sure the structure schema resolves `container`:
- `schemas/accordion-structure.json`

---

## Files to Update (Checklist for Agents)

### Schema + Structure
- `schemas/*.json`
- `schemas/*-structure.json`

### Build Tools
- `build-tools/css-generator.js` (include non-themeable CSS outputs)
- `build-tools/schema-compiler.js` (if generator injection is added here)
- `build-tools/generators/save-styles-injector.js` (reference for new generators)
- `build-tools/generators/editor-css-vars-injector.js` (new)
- `build-tools/generators/frontend-css-vars-injector.js` (new)
- `build-tools/validate-schema-usage.js` (extend) or new validator file
- `package.json` scripts (ensure validator runs on schema build)

### Shared JS
- `shared/src/config/css-var-mappings-generated.js` (auto)
- `shared/src/utils/box-value-utils.js` (decomposition helpers if needed)
- `shared/src/utils/responsive-utils.js` (if new helpers are shared)

### Block Files
- `blocks/*/src/edit.js` (replace manual getEditorCSSVariables usage)
- `blocks/*/src/save.js` (replace manual getCustomizationStyles usage)
- `blocks/*/src/*_variables.scss` (auto-generated, verify output)

### PHP
- `php/theme-css-generator.php` (responsive vars)
- `php/css-defaults/css-mappings-generated.php` (auto-generated)

---

## Validation & Testing Checklist

Editor:
- Responsive OFF: base values apply immediately.
- Responsive ON (tablet/mobile): values update immediately in preview.
- Switching device updates CSS vars (verify via devtools).

Frontend:
- Resizing window updates `data-gutplus-device`.
- CSS vars switch to tablet/mobile values.

Theme + Deltas:
- Theme updates still store only deltas.
- Theme CSS includes responsive vars when theme values include tablet/mobile.
- Non-themeable responsive values are block-specific only.

Decomposed Values:
- Padding/margin/border output matches expected per device.
- No conflicts with alignment or shorthand rules.

---

## Summary
This plan standardizes responsiveness by:
- Enforcing schema requirements,
- Generating CSS vars for all responsive CSS attributes,
- Keeping themes delta-based and lightweight,
- Using a single CSS-var output pipeline across editor + frontend,
- Eliminating ad-hoc inline styling and mismatched responsive logic.
