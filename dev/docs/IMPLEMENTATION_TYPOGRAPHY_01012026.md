# Typography Panel Macro Implementation (SOT)
**Date:** 2026-01-01  
**Scope:** Define a `typography-panel` macro that expands into all typography attributes, rendering a single Typography panel in the sidebar with multiple targets.  
**Status:** Specification only (no file changes performed in this document).

---

## 1) Goals (Non-Ambiguous)

1. **Single schema declaration** per block for typography (one `type: "typography-panel"` entry).
2. **Macro expansion generates all concrete attributes** required by the editor, theme system, CSS vars, and frontend output.
3. **Sidebar renders a single Typography panel** with targets/subgroups (e.g., Header, Content) without declaring each attribute in schema.
4. **Responsive flags are hardcoded** by the macro expander (not declared in schema).
5. **State variants are supported** by macro expansion and must **inherit implicitly** from default state unless explicitly set.
6. **Theme system compatibility** is preserved: all expanded attributes that should be themeable remain `themeable: true`.

---

## 2) Non-Goals

- No runtime behavior changes outside typography (icons, colors, borders).
- No refactor of editor or save logic beyond what macro expansion already supports.
- No change to the theme system logic (delta calculator, cascades).
- No change to how CSS variables are generated (only how schema produces attributes).

---

## 3) Source of Truth and Pattern

The `icon-panel` macro is the precedent:
- Single schema declaration (`type: "icon-panel"`).
- Build expands to a fixed set of attributes.
- Expanded schema feeds **all generators** (attributes, CSS vars, docs, validators).
- **Important difference:** `IconPanel` is routed directly by `SchemaPanels` (group `icon`) and does **not** use `ControlRenderer`, so its UI ignores schema `showWhen`/`min`/`max`/`step`. If typography needs a unified panel UI, we must choose between `ControlRenderer` (schema-driven) or a custom `TypographyPanel` (IconPanel-style).

Typography macro must follow **the exact same model**.

---

## 4) Current Architecture (How It Works Today)

This section describes the existing pipeline, because the typography macro must plug into it without breaking compatibility.

### 4.1 Schema-Driven Controls
- The editor sidebar is generated from expanded schemas.
- `SchemaPanels` reads `schema.tabs` and group definitions, then renders `GenericPanel` or `SubgroupPanel`.
- `GenericPanel`/`SubgroupPanel` iterate over `schema.attributes` and pass each attribute to `ControlRenderer`.
- Result: **If a field is not in the expanded schema, it cannot appear in the sidebar.**
- **Exception:** groups routed to custom panels (e.g., IconPanel when `groupId === "icon"`) bypass `ControlRenderer` and can ignore schema `showWhen`/ranges.

### 4.2 Macro Expansion
- The schema compiler currently expands `type: "icon-panel"` into individual attributes.
- The expanded attributes are used to generate:
  - JS block attributes (`blocks/*/src/*-attributes.js`)
  - CSS var maps (`assets/css/*-variables.css`)
  - CSS var builders (`shared/src/styles/*-frontend-css-vars-generated.js`)
  - Control configs (`shared/src/config/control-config-generated.js`)
  - Docs and validators

### 4.3 Theme System (Delta-Based)
- The theme system stores **deltas of themeable attributes**, not CSS vars directly.
- Any attribute with `themeable: true` and a default is eligible for theme deltas.
- `outputsCSS` only controls CSS generation, not theme storage.

### 4.4 Frontend Rendering and Save
- CSS-driven attributes are output via inline CSS vars and theme CSS classes.
- `buildFrontendCssVars()` emits **only** values present in `attributes.customizations` (themeable deltas).
- Non-CSS attributes are serialized directly into markup/data attributes inside `save.js`.
- The editor uses `attributes` plus defaults to render previews.

### 4.5 Current Problem for Typography
- Accordion and other blocks declare many typography fields directly in schema.
- This is verbose and error-prone when expanding or reusing typographic controls.
- There is **no macro** for typography; thus changes require repeated schema updates per block.

---

## 5) Required Changes for the New Implementation

This section lists what must change to make `typography-panel` behave like `icon-panel` and remain compatible with the current architecture.

### 5.1 Build Tool Changes (Macro Expansion)
1. Add `expandTypographyPanelMacro()` to:
   - `build-tools/schema-compiler.js`
   - `build-tools/validate-schema-structure.js`
   - `build-tools/validate-schema-usage.js`
2. Update macro detection in `processAttributes()` to expand `type: "typography-panel"`.

### 5.2 Validator Changes
- `build-tools/schema-validator.js` must allow `type: "typography-panel"`.
- Macro entries should be exempt from required attribute fields (or have defaults injected by the expander).

### 5.3 Schema Changes (Per Block)
- Replace verbose typography attribute sets with a **single macro entry**.
- Keep naming identical to current attributes to preserve edit/save logic.

### 5.4 CSS Var Generation (No New Logic Required)
- Existing CSS var generators will work if expanded attributes provide `cssVar` + `cssProperty`.
- State fallback must be encoded as defaults + CSS fallback chains.
- Because frontend CSS vars are emitted from `customizations` only, state values that should always appear must be either non-themeable or in CSS defaults.

### 5.5 Theme System (No Code Change Required)
- As long as expanded attributes remain `themeable: true`, they are stored as theme deltas automatically.
- State values should default to `null` so inheritance works without forced overrides.
- Do not inject fallback defaults for non-default states in the macro; they should remain `null` unless explicitly set.

---

## 6) Macro Contract (Schema Entry)

Schema entry declares a single typography panel. No per-attribute definitions.

```json
"accordionTypography": {
  "type": "typography-panel",
  "order": 5,
  "themeable": true,
  "outputsCSS": false,
  "targets": [
    {
      "id": "header",
      "label": "Header",
      "namePrefix": "title",
      "appliesTo": "titleText",
      "cssVarPrefix": "accordion-title",
      "propertiesToAdd": [
        "fontFamily",
        "fontSize",
        "lineHeight",
        "letterSpacing",
        "textTransform",
        "alignment",
        "offsetX",
        "offsetY",
        "textShadow",
        "formatting"
      ],
      "states": ["default", "hover", "active"]
    },
    {
      "id": "content",
      "label": "Content",
      "namePrefix": "content",
      "appliesTo": "content",
      "cssVarPrefix": "accordion-content",
      "propertiesToAdd": [
        "fontFamily",
        "fontSize",
        "lineHeight"
      ],
      "states": ["default"]
    }
  ]
}
```

**Notes**
- `group` is omitted in the macro entry; expander injects `group: "typography"` into all expanded attrs.
- `responsive` is omitted; expander hardcodes responsive flags.
- `states` defines which variants exist for each target.

---

## 7) Naming Rules (Expanded Attributes)

### Default state
```
attrName = `${namePrefix}${Studly(property)}`
```

### Non-default states (hover/active/etc.)
```
attrName = `${namePrefix}${Studly(state)}${Studly(property)}`
```

**Examples (Header target):**
- `titleFontSize` (default)
- `titleHoverFontSize` (hover)
- `titleActiveFontSize` (active)

If a block already uses a different naming scheme (e.g., tabs: `tabButtonActiveFontWeight`), the macro must support a **per-target override**:

```json
{
  "stateNameOrder": "suffix",
  "stateTokenMap": { "hover": "Hover", "active": "Active" }
}
```

Default order is `prefix + State + Property` as above.

---

## 8) Group and Subgroup Rules

All expanded attributes must include:
- `group: "typography"`
- `subgroup: target.label` (e.g., "Header", "Content")

This guarantees **one Typography panel** with subgroup tabs.

**Note:** If the typography UI is implemented as a custom panel (IconPanel-style), `SchemaPanels` must route `groupId === "typography"` to the new component. Otherwise, use `SubgroupPanel` + `ControlRenderer` for schema-driven controls.

---

## 9) State Inheritance (Required Behavior)

State values must **inherit implicitly** from default state unless explicitly set by user.

**Rule:** For any non-default state:
- Default value must be `null` (or "inherit" where CSS expects it).
- This ensures CSS can fall back to default state with `var(--x-state, var(--x))`.

**Example:**
- `titleHoverFontSize` default is `null`
- CSS uses `var(--accordion-title-hover-font-size, var(--accordion-title-font-size))`

No implicit inheritance exists in the theme system; it must be encoded via **defaults + CSS fallback**.

**Clarification:** Avoid macro-level fallback defaults for non-default states (unlike earlier icon-panel behavior); otherwise the state variants will always override the default values.

---

## 10) Hardcoded Responsive Rules

Hardcode responsiveness in the expander by property name:

**Responsive: true**
- `fontSize`
- `offsetX`
- `offsetY`

**Responsive: false**
- `fontFamily`
- `lineHeight`
- `letterSpacing`
- `textTransform`
- `alignment`
- `textShadow`
- `formatting` (and all formatting sub-attributes)

---

## 11) Property Expansion Map (Authoritative)

Each property in `propertiesToAdd` expands to **one or more attributes**.

### 9.1 `fontFamily`
```
type: "string"
control: "FontFamilyControl"
cssProperty: "font-family"
cssVar: `${cssVarPrefix}-font-family`
outputsCSS: true
```

### 9.2 `fontSize`
```
type: "string"
control: "SliderWithInput"
cssProperty: "font-size"
cssVar: `${cssVarPrefix}-font-size`
responsive: true
outputsCSS: true
```

### 9.3 `lineHeight`
```
type: "number"
control: "SliderWithInput"
cssProperty: "line-height"
cssVar: `${cssVarPrefix}-line-height`
outputsCSS: true
```

### 9.4 `letterSpacing`
```
type: "string"
control: "SliderWithInput"
cssProperty: "letter-spacing"
cssVar: `${cssVarPrefix}-letter-spacing`
outputsCSS: true
```

### 9.5 `textTransform`
```
type: "string"
control: "LetterCaseControl"
cssProperty: "text-transform"
cssVar: `${cssVarPrefix}-text-transform`
outputsCSS: true
```

### 9.6 `alignment`
```
type: "string"
control: "AlignmentControl"
alignmentType: "text"
cssProperty: "text-align"
cssVar: `${cssVarPrefix}-alignment`
outputsCSS: true
```

### 9.7 `offsetX`
```
type: "string"
control: "SliderWithInput"
cssProperty: "left"
cssVar: `${cssVarPrefix}-offset-x`
responsive: true
outputsCSS: true
```

### 9.8 `offsetY`
```
type: "string"
control: "SliderWithInput"
cssProperty: "top"
cssVar: `${cssVarPrefix}-offset-y`
responsive: true
outputsCSS: true
```

### 9.9 `textShadow`
```
type: "array"
control: "ShadowPanel"
cssProperty: "text-shadow"
cssVar: `${cssVarPrefix}-text-shadow`
outputsCSS: true
```

### 9.10 `formatting` (expands to a bundle)
**Bundle attributes (all share `controlId: "${namePrefix}-formatting"`):**

1) `${prefix}Formatting`
```
type: "array"
control: "FormattingControl"
outputsCSS: false
```

2) `${prefix}NoLineBreak`
```
type: "string"
control: "FormattingControl"
cssProperty: "white-space"
cssVar: `${cssVarPrefix}-white-space`
outputsCSS: true
```

3) `${prefix}FontWeight`
```
type: "number"
control: "FormattingControl"
cssProperty: "font-weight"
cssVar: `${cssVarPrefix}-font-weight`
min: 100
max: 900
step: 100
outputsCSS: true
```

4) `${prefix}DecorationColor`
```
type: "string"
control: "FormattingControl"
cssProperty: "text-decoration-color"
cssVar: `${cssVarPrefix}-decoration-color`
outputsCSS: true
```

5) `${prefix}DecorationStyle`
```
type: "string"
control: "FormattingControl"
cssProperty: "text-decoration-style"
cssVar: `${cssVarPrefix}-decoration-style`
options: solid/dashed/dotted/wavy/double
outputsCSS: true
```

6) `${prefix}DecorationWidth`
```
type: "string"
control: "FormattingControl"
cssProperty: "text-decoration-thickness"
cssVar: `${cssVarPrefix}-decoration-width`
outputsCSS: true
```

---

## 12) Order Map (Hardcoded)

All typography attributes must retain existing visual order:

```
fontFamily: 1
fontSize: 2
formatting: 3
noLineBreak: 3.1
fontWeight: 4
decorationColor: 5
decorationStyle: 6
decorationWidth: 7
letterSpacing: 9
textTransform: 11
lineHeight: 12
alignment: 13
offsetX: 14
offsetY: 15
textShadow: 16
```

For state variants, apply the same order (no extra offsets).

---

## 13) Defaults (Accordion Targeted)

These defaults must match existing accordion schema exactly:

### Header (title)
- fontFamily: "inherit"
- fontSize: "1.125rem"
- lineHeight: 1.4
- letterSpacing: "0em"
- textTransform: "none"
- alignment: "left"
- offsetX: "0px"
- offsetY: "0px"
- textShadow: []
- formatting: []
- noLineBreak: "normal"
- fontWeight: 400
- decorationColor: "currentColor"
- decorationStyle: "solid"
- decorationWidth: "auto"

### Content
- fontFamily: "inherit"
- fontSize: "1rem"
- lineHeight: 1.6

### State defaults (hover/active)
All state variants default to `null` (or "inherit" where required).

---

## 14) State Variant CSS Var Naming

Default state:
```
--${cssVarPrefix}-${suffix}
```

Non-default states:
```
--${cssVarPrefix}-${state}-${suffix}
```

Example:
- Default: `--accordion-title-font-size`
- Hover: `--accordion-title-hover-font-size`
- Active: `--accordion-title-active-font-size`

---

## 15) Build-Tool Touchpoints (Required for Implementation)

1) **schema-compiler.js**
   - Add `expandTypographyPanelMacro()`
   - Update `processAttributes()` to expand `type: "typography-panel"`

2) **validate-schema-structure.js**
   - Mirror the typography expansion for structural validation.

3) **validate-schema-usage.js**
   - Expand macro before checking attribute usage and references.

4) **schema-validator.js**
   - Allow `type: "typography-panel"` in VALID_TYPES.
   - Exempt macro entry from required attribute fields (group/label/description/etc.) OR inject defaults.

---

## 16) Backward Compatibility Requirements

None needed.
---

## 17) Testing Checklist (Implementation Phase)

**Schema Build**
1. `npm run schema:validate` passes.
2. `npm run schema:build` outputs expanded typography attributes.

**Editor**
1. Typography panel renders once under Appearance.
2. Header and Content appear as subgroups.
3. Controls match old set and order.
4. Responsive toggles appear on font size + offsets only.
5. Hover/Active fields exist (if states configured).

**Theme System**
1. Changing typography defaults creates theme deltas.
2. Non-default state values save and apply.
3. Missing state values fall back to default (CSS fallback works).

**Frontend**
1. CSS variables exist for default and state values.
2. State fallbacks behave as expected.

---

## 18) Open Decisions (Must Confirm Before Coding)

1. **State naming order** for blocks that already use `Active` in the middle of names (e.g., tabs).
2. **State coverage**: which properties should generate hover/active by default.
3. **Defaults for state variants**: confirm `null` is preferred for all state defaults.

---

## 19) Example: Expanded Output (Header Font Size)

Given:
```
namePrefix: "title"
cssVarPrefix: "accordion-title"
states: ["default","hover"]
property: "fontSize"
```

Expanded attributes:
```
titleFontSize:
  type: string
  control: SliderWithInput
  cssVar: accordion-title-font-size
  cssProperty: font-size
  responsive: true

titleHoverFontSize:
  type: string
  control: SliderWithInput
  cssVar: accordion-title-hover-font-size
  cssProperty: font-size
  state: hover
  responsive: true
  default: null
```

---

## 20) Acceptance Criteria

1. Single macro entry replaces verbose typography declarations.
2. Expanded schema equals previous attribute list (for accordion).
3. Sidebar renders a single Typography panel with correct targets.
4. State variants inherit from default unless set.
5. Theme deltas work for all typography attributes.

---

## 21) Summary (One-Line)

**Implement `typography-panel` as a macro that expands to the existing typography attribute set, auto-injecting group/subgroup, hardcoding responsiveness, and generating state variants with null defaults to preserve inheritance.**
