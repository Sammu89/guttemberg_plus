# Tier 3 Inline Plan

**Goal**: Make Tier 3 block customizations render as element-inline CSS variables (style attribute only). Tier 2 saved themes remain the only source of `<head>` CSS.

## Current Problem

- Tier 3 customizations are rendered via `<style>` tags generated in `save.js`.
- The `<head>` is intended for Tier 2 saved theme CSS only.
- Responsive customizations currently rely on media queries inside those `<style>` tags.

## Desired Behavior (Explicit)

- **Tier 2**: Theme deltas generate CSS variables in `<head>` under a theme class.
- **Tier 3**: Block customizations generate CSS variables on the block element via `style`.
- **No `<style>` tags** for customizations anywhere.
- Tier 3 remains highest priority due to inline style precedence.

## Implementation Plan

### 1) Add Inline-Responsive Variable Fallbacks (CSS)

To keep responsive customizations without `<style>` tags:

- Introduce device-specific custom property fallbacks in base CSS.
- Example pattern (accordion, repeated across vars):

```css
.gutplus-accordion {
  --accordion-title-color-effective: var(--accordion-title-color, var(--accordion-title-color-theme, var(--accordion-title-color-default)));
}

@media (max-width: 1024px) {
  .gutplus-accordion {
    --accordion-title-color-effective: var(
      --accordion-title-color-tablet,
      var(--accordion-title-color, var(--accordion-title-color-theme, var(--accordion-title-color-default)))
    );
  }
}

@media (max-width: 600px) {
  .gutplus-accordion {
    --accordion-title-color-effective: var(
      --accordion-title-color-mobile,
      var(--accordion-title-color-tablet, var(--accordion-title-color, var(--accordion-title-color-theme, var(--accordion-title-color-default))))
    );
  }
}
```

Notes:
- The inline style sets `--accordion-title-color` (desktop) and optional `--accordion-title-color-tablet` / `--accordion-title-color-mobile`.
- The CSS uses `*-effective` vars in actual rules (or switches existing rules to use these effective vars).
- Theme CSS continues to set base vars only (Tier 2).

### 2) Extend CSS Var Mapping/Generator

- Extend the schema-driven CSS mapping to include tablet/mobile variable names for responsive attributes.
- Ensure the generated CSS uses the `*-effective` variables that resolve from inline per-device vars.

### 3) Switch Tier 3 Output to Element-Inline Style

For each block (`accordion`, `tabs`, `toc`):

- Remove `generateBlockCSS(...)` and the `<style dangerouslySetInnerHTML />` output.
- Build inline variable object from `attributes.customizations`.
  - Reuse `shared/src/styles/*-styles-generated.js` where possible.
  - Ensure responsive values set `--var-tablet` and `--var-mobile`.
- Pass `style` into `useBlockProps.save({ style: inlineVars })`.

### 4) Preserve Sidebar + Theme Logic

- Do not change sidebar behavior or `useThemeManager` logic.
- `customizations` still represent deltas vs expected values.
- Saved themes remain delta-based and still produce Tier 2 CSS in `<head>`.

### 5) Migration / Backward Compatibility

- Existing saved posts with `customizations` continue to render correctly (same values, different delivery method).
- No data migration required; only rendering changes.

## Verification Checklist

- Default theme: no inline style, only base CSS variables.
- Saved theme: theme class present, CSS variables in `<head>`.
- Customized block: inline style on element overrides theme.
- Responsive customizations: tablet/mobile values apply without `<style>` tags.
- No `<style>` blocks in block markup for Tier 3.

