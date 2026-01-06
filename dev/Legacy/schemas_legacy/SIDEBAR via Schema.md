# Sidebar Controls System Reference

**Purpose:** Quick reference for AI agents working on Guttemberg Plus plugin sidebar controls.

---

## ARCHITECTURE OVERVIEW

```
schemas/{block}.json
       ↓
   npm run schema:build (generates 24 files)
       ↓
blocks/{block}/src/edit.js
       ↓
<SchemaPanels schema={schema} />
       ↓
<GenericPanel> or <SubgroupPanel>
       ↓
<ControlRenderer attrName={} attrConfig={} />
       ↓
Actual UI Component (ColorControl, RangeControl, BorderPanel, etc.)
```

**Key Files:**
- `schemas/*.json` - Single source of truth (EDIT THIS)
- `shared/src/components/ControlRenderer.js` - Maps control types to React components
- `shared/src/components/SchemaPanels.js` - Auto-generates panels from schema groups
- `shared/src/components/GenericPanel.js` - Renders single panel with controls
- `shared/src/components/controls/` - All control components (atoms, molecules, full)

---

## SCHEMA ATTRIBUTE STRUCTURE

```json
{
  "attributeName": {
    // === REQUIRED FIELDS ===
    "type": "string|number|boolean|object",
    "default": "value",
    "group": "groupName",
    "label": "Display Label",
    "description": "Help text",
    "themeable": true|false,

    // === FOR THEMEABLE ATTRIBUTES ===
    "cssVar": "my-css-var",        // becomes --{block}-my-css-var
    "control": "ControlType",       // UI component to render
    "order": 1,                     // Position in panel (1=first)

    // === CSS OUTPUT ===
    "cssProperty": "css-property",  // e.g., "border-width", "color"
    "appliesTo": "selector",        // e.g., "title", "content", "item"
    "outputsCSS": true|false,       // Whether to generate CSS

    // === CONDITIONAL LOGIC ===
    "showWhen": { "otherAttr": ["value1", "value2"] },   // Show if condition met
    "disabledWhen": { "otherAttr": [true] },             // Disable if condition met
    "visibleOnSidebar": true|false,                      // Hide from sidebar entirely
    "renderControl": false,                              // Skip control rendering (for grouped attrs)

    // === FOR NUMERIC CONTROLS ===
    "min": 0,
    "max": 100,
    "step": 1,
    "unit": "px",                   // Single unit
    "units": ["px", "em", "rem"],   // Multiple units (for unit selector)

    // === FOR SELECT CONTROLS ===
    "options": [
      { "label": "Option 1", "value": "opt1" },
      { "label": "Option 2", "value": "opt2" }
    ],

    // === FOR RESPONSIVE ATTRIBUTES ===
    "responsive": true,             // Enables desktop/tablet/mobile tabs

    // === FOR VARIANT-BASED CSS ===
    "dependsOn": "anotherAttribute",
    "variants": {
      "horizontal": { "cssProperty": "border-bottom-width" },
      "vertical": { "cssProperty": "border-right-width" },
      "_default": { "cssProperty": "border-bottom-width" }
    },

    // === FOR SUBGROUPS ===
    "subgroup": "SubgroupName"      // Nests inside group's subgroup
  }
}
```

---

## CONTROL TYPES

### Basic Controls
| Control | Schema Type | Props | Description |
|---------|-------------|-------|-------------|
| `ColorPicker` / `ColorControl` | `string` | - | Color picker with alpha |
| `RangeControl` | `number` | `min`, `max`, `step` | Slider |
| `SliderWithInput` | `string` or `number` | `min`, `max`, `step`, `units`, `responsive` | Slider + input + unit. **CRITICAL:** See "SliderWithInput Data Structure" section for data format! |
| `SelectControl` | `string` | `options[]` | Dropdown |
| `ToggleControl` | `boolean` | - | On/off switch |
| `TextControl` | `string` | - | Text input |
| `UnitControl` | `string` | `units[]` | Input with unit dropdown |
| `IconPicker` | `string` | - | Text input for icon char/URL |

### Typography Controls
| Control | Value Type | Description |
|---------|------------|-------------|
| `FontFamilyControl` | `string` | Font family selector |
| `AppearanceControl` | `{ weight, style }` | Font weight + style |
| `DecorationControl` | `string` | Underline/overline/line-through |
| `LetterCaseControl` | `string` | Text transform (uppercase, etc.) |
| `AlignmentControl` | `string` | Text/block alignment |

### Box/Border Controls
| Control | Value Type | Description |
|---------|------------|-------------|
| `BorderPanel` | `object` | Unified border (width + color + style) |
| `CompactBorderRadius` | `object` | 4-corner radius control |
| `CompactPadding` / `CompactSpacing` | `object` | 4-side padding |
| `CompactMargin` | `object` | 2-side margin (top/bottom only) |
| `BorderStyleControl` | `string` | Visual style picker (solid, dashed, etc.) |
| `ShadowControl` | `string` | Box shadow builder |

**Note:** `CompactMargin` uses `sides: ['top', 'bottom']` in ControlRenderer, limiting it to vertical margins only. See "SpacingControl sides Prop" below.

### Special Controls
| Control | Value Type | Description |
|---------|------------|-------------|
| `HeadingLevel` | `string` | H1-H6 or none selector |
| `IconPositionControl` | `string` | left/right position |
| `GradientControl` | `string` | CSS gradient builder |

---

## LEGO CONTROL SYSTEM

Hierarchical component architecture:

### Atoms (Smallest Building Blocks)
Location: `shared/src/components/controls/atoms/`

| Component | File | Purpose |
|-----------|------|---------|
| `MiniSlider` | `MiniSlider.js` | Compact slider |
| `StyleIconButton` | `StyleIconButton.js` | Border style visual picker |
| `ColorSwatch` | `ColorSwatch.js` | Color preview with popover picker |
| `SideIcon` | `SideIcon.js` | Top/Right/Bottom/Left indicators |
| `LinkToggle` | `LinkToggle.js` | Link/unlink button |
| `DeviceSwitcher` | `DeviceSwitcher.js` | Desktop/Tablet/Mobile tabs |

**IMPORTANT:** All value+unit controls now use **native Gutenberg `UnitControl`** (`@wordpress/components: __experimentalUnitControl`) for consistency with WordPress core UI. This applies to all controls: `BorderPanel`, `CompactBorderRadius`, `CompactPadding`, `CompactMargin`, and all molecules.

### Molecules (Wrappers for Native Controls)
- `ValueWithUnit` - Wrapper for native Gutenberg `UnitControl`
- `SliderWithValue` - Native Gutenberg `UnitControl` + `MiniSlider`

### Organisms (Building Blocks for Full Controls)
- `CompactBoxRow` - Generic row component: `[Icon] [UnitControl] [Slider] [LinkToggle]`
  - Uses native Gutenberg `UnitControl` for value+unit input
  - Used by `BorderRadiusControl`, `SpacingControl`, and other box-type controls

### Full Controls (Complete Solutions)
Location: `shared/src/components/controls/full/`

| Component | Composed From | Purpose |
|-----------|---------------|---------|
| `BorderPanel` | ColorSwatch, StyleIconButton, **native UnitControl**, MiniSlider, LinkToggle, SideIcon | Unified border control (width + color + style) |
| `BorderRadiusControl` | Multiple `CompactBoxRow` (uses **native UnitControl**) | 4-corner radius control |
| `SpacingControl` | Multiple `CompactBoxRow` (uses **native UnitControl**) | Padding/margin control (configurable sides) |
| `BorderWidthControl` | Multiple `CompactBoxRow` (uses **native UnitControl**) | Per-side border widths |
| `HeadingLevelControl` | Button group | H1-H6 or none selector |

### SpacingControl `sides` Prop

The `SpacingControl` component accepts a `sides` prop to limit which sides are controllable:

```javascript
// In ControlRenderer.js:
case 'CompactPadding':
  return <SpacingControl sides={['top', 'right', 'bottom', 'left']} ... />  // All 4 sides

case 'CompactMargin':
  return <SpacingControl sides={['top', 'bottom']} ... />  // Only top/bottom
```

**Behavior:**
- **Linked mode:** Only updates the sides specified in `sides` prop
- **Unlinked mode:** Shows rows only for allowed sides
- **Link toggle:** Appears on the last side in the array

**CRITICAL:** The `sides` prop affects value updates:
```javascript
// With sides=['top', 'bottom']:
// Linked mode updates: { top: value, bottom: value }
// Does NOT touch: right, left (preserves existing values)

// With sides=['top', 'right', 'bottom', 'left']:
// Linked mode updates: { top: value, right: value, bottom: value, left: value }
```

**Common Bug Pattern:**
If margin unexpectedly affects horizontal spacing, check that:
1. `sides` prop is passed correctly in ControlRenderer
2. `handleValueChange` respects the `SIDES` array (not hardcoded to all 4)
3. `handleLinkChange` only syncs allowed sides when linking

### Margin vs Horizontal Alignment Conflict

**Problem:** Block margin and horizontal alignment both use CSS margins:
- `useBlockAlignment` hook sets `margin-left`/`margin-right` for alignment
- Block margin controls could override these if using `margin` shorthand

**Solution:** The schema compiler generates **separate CSS properties** for `CompactMargin`:
```javascript
// Generated code for CompactMargin (in getInlineStyles):
marginTop: `${blockMarginVal.top || 0}${unit}`,
marginBottom: `${blockMarginVal.bottom || 0}${unit}`,

// NOT the shorthand which would override left/right:
// margin: `${top} ${right} ${bottom} ${left}`  // WRONG - breaks alignment!
```

**How it works:**
- `CompactMargin` control → generates `marginTop` + `marginBottom` only
- `useBlockAlignment` hook → sets `margin-left` + `margin-right` with `!important`
- No conflict between vertical spacing and horizontal alignment

**Location:** `build-tools/schema-compiler.js` → `generateInlineStylesFunction()` line ~1404

---

## OBJECT VALUE STRUCTURES

### Box Values (4 Sides)
Used for: borders, padding, margin

```javascript
// Simple (linked)
{
  "top": 1, "right": 1, "bottom": 1, "left": 1,
  "unit": "px",
  "linked": true
}

// Per-side (unlinked)
{
  "top": 2, "right": 4, "bottom": 2, "left": 4,
  "unit": "px",
  "linked": false
}

// DEFAULTS use flat structure (applies to all devices)
{ "top": 16, "right": 16, "bottom": 16, "left": 16, "unit": "px" }

// User customizations use device keys (only stores what's different)
{
  "desktop": { "top": 16, "right": 16, "bottom": 16, "left": 16, "unit": "px" },
  "tablet": { "top": 12, "right": 12, "bottom": 12, "left": 12, "unit": "px" }
}
```

### Border Radius (4 Corners)
```javascript
{
  "topLeft": 4,
  "topRight": 4,
  "bottomRight": 4,
  "bottomLeft": 4,
  "unit": "px"
}
```

### Border Color/Style Objects
Can be string OR object:
```javascript
// Simple (all sides same)
"#dddddd"

// Per-side
{
  "top": "#dddddd",
  "right": "#cccccc",
  "bottom": "#dddddd",
  "left": "#cccccc",
  "linked": false
}
```

---

## BOX VALUE UTILITIES

Location: `shared/src/utils/box-value-utils.js`

```javascript
import {
  normalizeBoxValue,      // Convert any value to standard 4-side object
  formatBoxValueToCss,    // Convert to CSS shorthand string
  isBoxValueLinked,       // Check if all sides equal
  getSideValue,           // Get value for specific side
  updateBoxSide,          // Update one side (respects linked state)
  toggleBoxLinked,        // Toggle linked/unlinked
  parseBoxValueFromCss,   // Parse CSS shorthand to object
  isResponsiveValue,      // Check if has desktop/tablet/mobile
  getResponsiveBoxValue,  // Get value for breakpoint
} from '../utils/box-value-utils';
```

---

## CSS VARIABLE SYSTEM

### Naming Convention
```
--{blockType}-{attributeCssVar}

Examples:
--accordion-title-color
--accordion-border-width
--tabs-button-active-bg
--toc-link-hover-color
```

### Generated Mappings
Location: `shared/src/config/css-var-mappings-generated.js`

```javascript
{
  accordion: {
    titleColor: {
      cssVar: '--accordion-title-color',
      cssProperty: 'color',
      type: 'string',
      unit: null,
      dependsOn: null,
      variants: null
    }
  }
}
```

### Variant-Based CSS Properties
When CSS property changes based on another attribute:

```json
"tabsRowSpacing": {
  "cssVar": "tabs-row-spacing",
  "dependsOn": "orientation",
  "variants": {
    "horizontal": { "cssProperty": "padding-top" },
    "vertical-left": { "cssProperty": "padding-left" },
    "vertical-right": { "cssProperty": "padding-right" },
    "_default": { "cssProperty": "padding-top" }
  }
}
```

### Responsive CSS Variables (Universal)

**Rule:** Any attribute that outputs CSS and is `responsive: true` must define both
`cssVar` and `appliesTo` **even if `themeable: false`**. This enables device-specific
CSS vars in editor + frontend.

**Generated CSS variables:**
```
--{cssVar}               // Base (global)
--{cssVar}-tablet        // Tablet override (optional)
--{cssVar}-mobile        // Mobile override (optional)
```

**Device selection is automatic:**
- Editor: `data-gutplus-device` is set by `useResponsiveDevice()`.
- Frontend: `data-gutplus-device` is set by `frontend.js` on resize.

**Fallback chain (from CSS generator):**
```
tablet: var(--cssVar-tablet, var(--cssVar, default))
mobile: var(--cssVar-mobile, var(--cssVar-tablet, var(--cssVar, default)))
```

### Editor + Frontend CSS Var Output (Auto-Generated)

**Editor (preview):**
- Generated helper: `buildEditorCssVars(effectiveValues)`
- Uses **effectiveValues** (defaults + theme + customizations)
- Emits base + device vars onto block root styles

**Frontend (save):**
- Generated helper: `buildFrontendCssVars(customizations, attributes)`
- Themeable attrs: from `customizations` (delta system)
- Non-themeable attrs: from `attributes` directly
- Emits base + device vars inline per block

**Theme CSS (PHP):**
- Theme classes include base + device vars **only for themeable attributes**.
- Uses theme deltas; non-themeable responsive values remain block-level only.

### Build-Time Validator (Schema Safety)

Responsive CSS attributes must pass validation:
- If `responsive: true` and `outputsCSS !== false` → must have `cssVar` + `appliesTo`
- `cssVar` without `appliesTo` → error
- `appliesTo` without `cssVar` → error

---

## CONDITIONAL RENDERING

### showWhen (Hide if condition NOT met)
```json
"iconColor": {
  "control": "ColorPicker",
  "showWhen": {
    "showIcon": [true]
  }
}
// Only shows if showIcon === true
```

### disabledWhen (Disable if condition met)
```json
"tabListAlignment": {
  "control": "SelectControl",
  "disabledWhen": {
    "stretchButtonsToRow": [true]
  }
}
// Disabled when stretchButtonsToRow === true
```

### visibleOnSidebar (Permanent hide)
```json
"accordionId": {
  "visibleOnSidebar": false
}
// Never shows in sidebar
```

### renderControl (Skip render for grouped attrs)
```json
"borderColor": {
  "control": "BorderPanel",
  "renderControl": false
}
// BorderPanel handles this via BorderPanel control on borderWidth
```

---

## PANEL ORGANIZATION

### Groups (Main Panels)
```json
"groups": {
  "colors": {
    "title": "Colors",
    "description": "Color settings",
    "order": 3,
    "initialOpen": false,
    "tab": "appearance",
    "subgroups": ["Header", "Panel"]
  }
}
```

### Subgroups (Nested Sections)
```json
"titleColor": {
  "group": "colors",
  "subgroup": "Header"
}
```

Result:
```
┌─ Colors ──────────────┐
│  ┌─ Header ─────────┐ │
│  │ Title Color      │ │
│  │ Title Hover Color│ │
│  └──────────────────┘ │
│  ┌─ Panel ──────────┐ │
│  │ Content BG       │ │
│  │ Content Color    │ │
│  └──────────────────┘ │
└───────────────────────┘
```

### Tabs
```json
"tab": "settings"     // Settings tab
"tab": "appearance"   // Appearance tab
```

---

## ADDING NEW CONTROLS

### 1. Simple Attribute (Color)
```json
"highlightColor": {
  "type": "string",
  "default": "#ffcc00",
  "cssVar": "accordion-highlight-color",
  "group": "colors",
  "subgroup": "Header",
  "label": "Highlight Color",
  "description": "Color for highlighted elements",
  "themeable": true,
  "control": "ColorPicker",
  "order": 5,
  "appliesTo": "title",
  "cssProperty": "background-color"
}
```

### 2. Numeric Attribute (Slider)
```json
"iconSize": {
  "type": "number",
  "default": 18,
  "cssVar": "accordion-icon-size",
  "group": "icon",
  "label": "Icon Size",
  "description": "Size of the toggle icon",
  "themeable": true,
  "control": "SliderWithInput",
  "min": 10,
  "max": 40,
  "step": 1,
  "unit": "px",
  "order": 2,
  "showWhen": { "showIcon": [true] }
}
```

### 3. Responsive Padding
Defaults use FLAT structure (no device wrapper). User edits create device-specific values.
```json
"contentPadding": {
  "type": "object",
  "default": { "top": 16, "right": 16, "bottom": 16, "left": 16, "unit": "px" },
  "cssVar": "accordion-content-padding",
  "group": "borders",
  "label": "Content Padding",
  "description": "Inner spacing of the content panel",
  "themeable": true,
  "control": "CompactPadding",
  "responsive": true,
  "units": ["px", "rem", "em"],
  "min": 0,
  "max": 100,
  "order": 4
}
```

### 4. Border Panel (Grouped Attributes)
Requires 3 attributes working together:

```json
"borderWidth": {
  "type": "object",
  "default": { "top": 1, "right": 1, "bottom": 1, "left": 1, "unit": "px" },
  "cssVar": "accordion-border-width",
  "control": "BorderPanel",
  "cssProperty": "border-width",
  "order": 1
},
"borderColor": {
  "type": "object",
  "default": { "top": "#dddddd", "right": "#dddddd", "bottom": "#dddddd", "left": "#dddddd", "linked": true },
  "cssVar": "accordion-border-color",
  "control": "BorderPanel",
  "renderControl": false,
  "cssProperty": "border-color"
},
"borderStyle": {
  "type": "object",
  "default": { "top": "solid", "right": "solid", "bottom": "solid", "left": "solid", "linked": true },
  "cssVar": "accordion-border-style",
  "control": "BorderPanel",
  "renderControl": false,
  "cssProperty": "border-style"
}
```

The `BorderPanel` control finds related attributes by their `cssProperty` field.

---

## CREATING NEW CONTROL COMPONENT

### 1. Create Atom (if needed)
Location: `shared/src/components/controls/atoms/MyAtom.js`

```javascript
export function MyAtom({ value, onChange, disabled }) {
  return (
    <div className="gutplus-my-atom">
      {/* Implementation */}
    </div>
  );
}
```

### 2. Add to Atoms Index
`shared/src/components/controls/atoms/index.js`:
```javascript
export { MyAtom } from './MyAtom';
```

### 3. Create Full Control (if needed)
Location: `shared/src/components/controls/full/MyControl.js`

```javascript
import { MyAtom } from '../atoms/MyAtom';

export function MyControl({ label, value, onChange, ...props }) {
  return (
    <BaseControl label={label} className="gutplus-my-control">
      <MyAtom value={value} onChange={onChange} />
    </BaseControl>
  );
}
```

### 4. Add to Controls Index
`shared/src/components/controls/index.js`:
```javascript
export { MyControl } from './full/MyControl';
```

### 5. Add to ControlRenderer
`shared/src/components/ControlRenderer.js`:

```javascript
case 'MyControl': {
  return (
    <MyControl
      key={attrName}
      label={renderLabel(finalLabel)}
      value={effectiveValue ?? defaultValue}
      onChange={handleChange}
      disabled={isDisabled}
      {...otherProps}
    />
  );
}
```

### 6. Add Styles
`shared/src/components/controls/SidebarStyling.scss`:

```scss
.gutplus-my-control {
  /* Styles */
}
```

---

## CENTRALIZED ICON SYSTEM

### Overview

All icons used across control components are centralized in a single location for consistency and easy maintenance.

**Location:** `shared/src/components/controls/icons/index.js`

**Benefits:**
- Single source of truth for all icons
- Easy to update icons globally
- Prevents duplicate definitions
- Consistent sizing and styling
- No more inline SVG definitions scattered across components

### Using Icons

#### Option 1: Import Specific Icons
```javascript
import { BorderSolidIcon, ShadowMediumIcon, reset } from '@shared/components/controls/icons';

// WordPress icons
<Button icon={reset} />

// Custom SVG icons
<div>{BorderSolidIcon}</div>
```

#### Option 2: Import Icon Groups
```javascript
import { BorderStyleIcons, ShadowIcons } from '@shared/components/controls/icons';

const icon = BorderStyleIcons.solid;
const preset = ShadowIcons.medium;

// Use in options array
const options = [
  { label: 'Solid', value: 'solid', icon: BorderStyleIcons.solid },
  { label: 'Dashed', value: 'dashed', icon: BorderStyleIcons.dashed },
];
```

#### Option 3: Use Helper Functions
```javascript
import { getIcon, getIconCategory } from '@shared/components/controls/icons';

// Get single icon by category and name
const solidBorder = getIcon('border', 'solid');

// Get all icons in a category
const allBorderIcons = getIconCategory('border');
// Returns: { none, solid, dashed, dotted, double, groove, ridge }
```

### Available Icon Categories

| Category | Group Name | Icons |
|----------|------------|-------|
| Border Styles | `BorderStyleIcons` | none, solid, dashed, dotted, double, groove, ridge |
| Shadow Presets | `ShadowIcons` | none, subtle, medium, strong, heavy |
| Box Sides | `SideIcons` | top, right, bottom, left, all, corners, margin, padding |
| Heading Levels | `HeadingIcons` | none, h1, h2, h3, h4, h5, h6 |
| Text Decoration | `DecorationIcons` | none, underline, line-through, overline |
| Icon Position | `IconPositionIcons` | left, right, box-left, box-right |

### WordPress Icons (Re-exported)

All commonly used WordPress icons are re-exported for convenience:

```javascript
import {
  // Device icons
  desktop, tablet, mobile,
  // Link icons
  link, linkOff,
  // Action icons
  reset, plus, trash,
  // Chevron icons
  chevronDown, chevronRight, chevronUp, chevronLeft,
  // Formatting icons
  formatBold, formatItalic, formatUnderline, formatStrikethrough,
  // Alignment icons
  alignLeft, alignCenter, alignRight,
} from '@shared/components/controls/icons';
```

### Adding New Icons

#### Adding WordPress Icons
1. Find icon name from `@wordpress/icons` package
2. Add to the import/export block at the top of `icons/index.js`:

```javascript
export { iconName } from '@wordpress/icons';
```

#### Adding Custom SVG Icons
1. Create the icon as a JSX constant in `icons/index.js`:

```javascript
export const MyCustomIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="..." fill="currentColor" />
  </svg>
);
```

2. (Optional) Add to a grouped export if it belongs to a category:

```javascript
export const MyCategoryIcons = {
  option1: MyIcon1,
  option2: MyIcon2,
  custom: MyCustomIcon,
};
```

3. (Optional) Add category to `getIcon()` helper function

### Icon Best Practices

When creating custom SVG icons:

- **Use `currentColor`** for fill/stroke to respect theme colors
- **Keep viewBox consistent** within a category (usually 24x24)
- **Set explicit width/height** for consistent sizing
- **Use `strokeLinecap="round"`** for smoother lines
- **Keep paths simple** and optimized
- **Use descriptive names** (e.g., `BorderSolidIcon` not `Icon1`)

### Example: Using Icons in a Control

```javascript
import { BorderStyleIcons } from '@shared/components/controls/icons';

export function BorderStyleControl({ value, onChange }) {
  const options = [
    { value: 'none', icon: BorderStyleIcons.none, label: 'None' },
    { value: 'solid', icon: BorderStyleIcons.solid, label: 'Solid' },
    { value: 'dashed', icon: BorderStyleIcons.dashed, label: 'Dashed' },
  ];

  return (
    <div className="border-style-control">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={value === option.value ? 'active' : ''}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
```

### Migration Guide

When updating existing controls to use centralized icons:

**Before:**
```javascript
// Inline SVG in component file
const MySvgIcon = (
  <svg viewBox="0 0 24 24">...</svg>
);
```

**After:**
```javascript
// Import from centralized location
import { BorderSolidIcon } from '@shared/components/controls/icons';
```

---

## EFFECTIVE VALUES & THEME CASCADE

### 3-Tier CSS System
1. **Tier 1: Defaults** - CSS variables in `:root`
2. **Tier 2: Themes** - CSS classes (`.accordion-theme-{name}`)
3. **Tier 3: Customizations** - Inline styles (per-block)

### Resolution Order
```
effectiveValue = customizations[attr] ?? theme[attr] ?? defaults[attr]
```

### Customization Detection
Controls show red dot when:
1. `themeable: true` AND
2. Value differs from default/theme value

---

## QUICK REFERENCE

### Build Commands
```bash
npm run schema:build   # Regenerate 24 files from schemas
npm run build          # Full webpack build
```

### File Locations
```
schemas/{block}.json                      # EDIT: Source of truth
shared/src/components/ControlRenderer.js  # Control mapping
shared/src/components/controls/           # Control components
shared/src/utils/box-value-utils.js       # Box value utilities
shared/src/config/control-config-generated.js  # Auto-generated config
```

### Common Patterns
```json
// Hide from sidebar
"visibleOnSidebar": false

// Skip render (handled by parent control)
"renderControl": false

// Conditional show
"showWhen": { "showIcon": [true] }

// Responsive
"responsive": true

// Grouped border (3 attrs, 1 control)
"cssProperty": "border-width"  // First attr has control
"renderControl": false         // Other attrs skip render
```

---

## EDITOR LIVE PREVIEW SYSTEM

### How Inline Styles Work

The editor preview uses **inline styles** generated from `getInlineStyles()` in `edit.js`. This function is **auto-generated** by the schema compiler from schema definitions.

**CRITICAL:** The `getInlineStyles()` function is regenerated on every `npm run schema:build`. Do NOT manually edit the code between:
```javascript
/* ========== AUTO-GENERATED-STYLES-START ========== */
// ... auto-generated code ...
/* ========== AUTO-GENERATED-STYLES-END ========== */
```

### Code Generation Flow
```
schemas/{block}.json
       ↓
build-tools/schema-compiler.js → generateInlineStylesFunction()
       ↓
blocks/{block}/src/edit.js (injected between AUTO-GENERATED markers)
       ↓
getInlineStyles() returns { container: {...}, title: {...}, content: {...}, icon: {...} }
       ↓
Applied to elements via React style prop: style={{ ...styles.title }}
```

### Responsive Values Handling

**IMPORTANT:** Responsive attribute values can be in two formats:

1. **Flat (defaults)** - Value applies to ALL devices
2. **Device-keyed (customizations)** - Per-device overrides

```javascript
// Schema default uses FLAT structure (no device wrapper):
"headerPadding": {
  "default": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px" },
  "responsive": true
}

// User customizations stored with device keys:
"headerPadding": {
  "desktop": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px" },
  "tablet": { "top": 8, "right": 12, "bottom": 8, "left": 12, "unit": "px" }
}
```

**Why flat defaults?** The default applies to ALL breakpoints. Only when user explicitly
changes a value for a specific device does it get stored with device keys.

The schema compiler generates code that handles BOTH formats:
```javascript
// Generated code handles flat OR device-keyed:
padding: (() => {
  // Try .desktop first, fall back to flat value
  const headerPaddingVal = headerPadding.desktop || headerPadding;
  const unit = headerPaddingVal.unit || 'px';
  return `${headerPaddingVal.top || 0}${unit} ${headerPaddingVal.right || 0}${unit} ...`;
})()
```

**SpacingControl handles this too** (in `shared/src/components/controls/full/SpacingControl.js`):
```javascript
// Detect if value is flat (has spacing properties directly)
const isFlat = value && typeof value === 'object' &&
  (value.top !== undefined || value.bottom !== undefined || ...);

// Use flat value for all devices, or device-specific if available
const currentValue = responsive
  ? (isFlat ? value : (value[device] || value.desktop || {}))
  : value;
```

**BUG PATTERN:** If values don't update, check if code handles flat defaults:
```javascript
// WRONG (only works with device keys):
padding: `${headerPadding.desktop.top}px ...`

// CORRECT (handles both flat and device-keyed):
const val = headerPadding.desktop || headerPadding;
padding: `${val.top}px ...`
```

The fix is in `build-tools/schema-compiler.js` → `generateInlineStylesFunction()` around line 1364.

### Style Application Points

Each `getInlineStyles()` returns an object with keys matching element types:

| Key | Applied To | Example Properties |
|-----|------------|-------------------|
| `container` | Root block element (`blockProps`) | `margin`, `borderRadius`, `boxShadow` |
| `title` | Header/title element | `padding`, `color`, `background`, `fontFamily` |
| `content` | Content panel | `padding`, `borderTopColor`, `color`, `background` |
| `icon` | Icon element | `color`, `transform` |

**Applying to Elements:**
```javascript
// In edit.js render:
const styles = getInlineStyles();

// Container → applied to rootStyles
const rootStyles = {
  ...editorCSSVars,
  ...styles.container,  // margin, radius, shadow
};

// Title → applied directly
<div className="accordion-title" style={{ ...styles.title }}>

// Content → applied directly
<div className="accordion-content" style={{ ...styles.content }}>
```

### CSS Override Conflicts

**CRITICAL:** CSS classes can override inline styles if they use `!important` or if the inline style isn't being applied.

**Common Conflict Pattern:**
```scss
// In editor.scss:
.accordion-title {
  padding: 1rem 1.5rem;  // This loses to inline style (good)
}

.static-padding-default {
  padding: 1rem 1.5rem !important;  // This OVERRIDES inline style (bad!)
}
```

**Resolution Priority (CSS Specificity):**
1. Inline styles (highest) - `style={{ padding: '12px' }}`
2. `!important` in CSS classes (overrides inline!)
3. ID selectors
4. Class selectors
5. Element selectors

**Checklist for Override Issues:**
1. Search for `!important` in SCSS files that might conflict
2. Check for CSS classes on the element that set the same property
3. Remove conflicting CSS classes from the element's className
4. Verify inline style is actually being spread: `style={{ ...styles.title }}`

### Schema Compiler: Inline Styles Generation

Location: `build-tools/schema-compiler.js` → `generateInlineStylesFunction()`

**Key Logic:**
```javascript
// For responsive padding/margin (line ~1364):
if (attr.responsive) {
  // Extract desktop value first, then format with unit
  styleValue = `(() => {
    const ${attrName}Val = ${attrName}.desktop || ${attrName};
    const unit = ${attrName}Val.unit || 'px';
    return \`\${${attrName}Val.top || 0}\${unit} ...\`;
  })()`;
}

// For non-responsive padding:
styleValue = `\`\${${attrName}.top || 0}px ...\``;

// For border radius:
styleValue = `\`\${${attrName}.topLeft}px ...\``;
```

**appliesTo → Style Key Mapping:**
```javascript
const styleKeyMap = {
  'accordionTitle': 'title',
  'accordionContent': 'content',
  'accordionItem': 'container',
  'accordionIcon': 'icon',
  'item': 'container',
  'title': 'title',
  'content': 'content',
  'icon': 'icon',
  // ... more mappings
};
```

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Control not showing | Check `visibleOnSidebar`, `showWhen`, `renderControl` |
| Control shows wrong value | Check `effectiveValues` cascade resolution |
| CSS not applying | Check `cssVar`, `cssProperty`, `outputsCSS` |
| Build fails | Run `npm run schema:validate` for JSON errors |
| Type errors | Run `npm run schema:build` to regenerate types |
| **Values not updating in editor** | See "Editor Live Preview Debugging" below |
| **SliderWithInput values stuck on default** | See "SliderWithInput Data Structure (CRITICAL!)" section |
| **Font size/letter spacing not previewing** | See "SliderWithInput Data Structure (CRITICAL!)" section |
| **Margin affects wrong sides** | Check `sides` prop in ControlRenderer (see "SpacingControl sides Prop") |

### Editor Live Preview Debugging

When sidebar control changes don't reflect in the editor preview:

**Step 1: Verify Attribute Updates**
```javascript
// In edit.js, effectiveValues should update on every render:
const effectiveValues = attributes;
console.log('headerPadding:', effectiveValues.headerPadding);
```

**Step 2: Check getInlineStyles() Output**
```javascript
const styles = getInlineStyles();
console.log('title padding:', styles.title.padding);
// Should output: "12px 16px 12px 16px" (not "undefinedpx undefinedpx...")
```

**Step 3: Check for Responsive Value Bugs**
If you see `undefinedpx` or `NaNpx`:
- The attribute has `"responsive": true` in schema
- But code accesses `headerPadding.top` instead of `headerPadding.desktop.top`
- Fix: Update schema compiler's `generateInlineStylesFunction()`

**Step 4: Check for CSS Overrides**
```bash
# Search for conflicting CSS:
grep -r "padding.*!important" blocks/accordion/src/
grep -r "margin.*!important" blocks/accordion/src/
```

**Step 5: Verify Style Application**
Check that styles are spread to elements:
```javascript
// CORRECT:
<div style={{ ...styles.title }}>

// WRONG (missing spread):
<div style={styles.title}>  // Works, but can cause issues with merging

// WRONG (not applied):
<div className="accordion-title">  // No style prop!
```

**Step 6: Hard Refresh Browser**
After `npm run build`, browser may cache old JS:
- Chrome: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or disable cache in DevTools Network tab

**Step 7: Check Container Styles Applied**
Ensure `styles.container` is spread into `rootStyles`:
```javascript
const rootStyles = {
  width: effectiveValues.accordionWidth,
  ...editorCSSVars,
  ...styles.container,  // Must be here for margin/radius/shadow
};
```

---

## SLIDERINPUT DATA STRUCTURE (CRITICAL!)

### The Problem Pattern

**SYMPTOMS:** Font size, letter spacing, or other `SliderWithInput` values don't preview in editor despite changing in sidebar.

**ROOT CAUSE:** The schema compiler generates incorrect assumptions about how `SliderWithInput` stores values.

### SliderWithInput's Actual Data Structure

**IMPORTANT:** `SliderWithInput` uses a DIFFERENT structure than you might assume!

```javascript
// ❌ WRONG ASSUMPTION (what schema compiler used to expect):
{
  desktop: "1.125rem",
  tablet: "1rem",
  mobile: "0.875rem"
}

// ✅ CORRECT STRUCTURE (what SliderWithInput actually creates):

// Non-responsive (type: "string", responsive: false):
"1.125rem"                              // Plain string
{ value: 1.125, unit: "rem" }          // Object with value/unit

// Responsive (type: "string", responsive: true):
{ value: 1.125, unit: "rem" }                                  // Flat (desktop only)
{ value: 1.125, unit: "rem", tablet: { value: 1, unit: "rem" } }  // With tablet override
{ value: 1.125, unit: "rem", tablet: { value: 1, unit: "rem" }, mobile: { value: 0.875, unit: "rem" } }
```

**Key Insight:** Desktop value is stored as the BASE (flat), NOT under a `desktop` key. Tablet/mobile are device OVERRIDES added to the base.

### Schema Compiler Fix (build-tools/schema-compiler.js)

**Location:** `generateInlineStylesFunction()` around line 1518

**BEFORE (Broken):**
```javascript
if (attr.responsive) {
  // This only handled flat strings, not { value, unit } objects!
  styleValue = `(() => { const val = effectiveValues.${attrName}; if (typeof val === 'object') { return val[responsiveDevice] || val.desktop || '${quotedDefault}'; } return val || '${quotedDefault}'; })()`;
}
```

**AFTER (Fixed):**
```javascript
if (attr.responsive) {
  // Now handles ALL formats: flat string, { value, unit }, and device overrides
  styleValue = `(() => { const val = effectiveValues.${attrName}; if (val === null || val === undefined) return '${quotedDefault}'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return \`\${deviceVal.value}\${deviceVal.unit || ''}\`; } return deviceVal; } if (val.value !== undefined) { return \`\${val.value}\${val.unit || ''}\`; } } return '${quotedDefault}'; })()`;
}
```

**Non-Responsive Fix:**
```javascript
else {
  // Also needs to handle { value, unit } objects from SliderWithInput
  styleValue = `(() => { const val = effectiveValues.${attrName}; if (val === null || val === undefined) return '${quotedDefault}'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return \`\${val.value}\${val.unit || ''}\`; } return '${quotedDefault}'; })()`;
}
```

### How to Diagnose & Fix

**Step 1: Check the schema attribute type**
```json
"titleFontSize": {
  "type": "string",           // ← Uses string type, not number!
  "default": "1.125rem",
  "control": "SliderWithInput",
  "responsive": true
}
```

**Step 2: Console log the attribute value**
```javascript
// In edit.js:
console.log('titleFontSize:', effectiveValues.titleFontSize);
// Expected output: { value: 1.125, unit: "rem" }
// Or with overrides: { value: 1.125, unit: "rem", tablet: { value: 1, unit: "rem" } }
```

**Step 3: Check the generated inline styles code**
Look in `blocks/{block}/src/edit.js` at the `getInlineStyles()` function (auto-generated section):

```javascript
// BROKEN version returns default always:
fontSize: (() => { const val = effectiveValues.titleFontSize;
  if (typeof val === 'object') {
    return val[responsiveDevice] || val.desktop || '1.125rem';  // ❌ val.desktop is undefined!
  }
  return val || '1.125rem';
})()

// FIXED version handles { value, unit }:
fontSize: (() => { const val = effectiveValues.titleFontSize;
  if (val === null || val === undefined) return '1.125rem';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const deviceVal = val[responsiveDevice];  // Check for device override first
    if (deviceVal !== undefined) {
      if (typeof deviceVal === 'object' && deviceVal.value !== undefined) {
        return `${deviceVal.value}${deviceVal.unit || ''}`;  // ✓ Handles device override
      }
    }
    if (val.value !== undefined) {
      return `${val.value}${val.unit || ''}`;  // ✓ Handles base { value, unit }
    }
  }
  return '1.125rem';
})()
```

**Step 4: Fix and rebuild**
1. Update the schema compiler (if not already fixed)
2. Run `npm run schema:build` to regenerate edit.js
3. Run `npm run build` to compile
4. Hard refresh browser (Ctrl+Shift+R)

### Affected Attributes

Any schema attribute using:
- `"control": "SliderWithInput"`
- `"type": "string"` (NOT "number")
- `"responsive": true` OR `"responsive": false`

**Common Examples:**
- Font sizes: `titleFontSize`, `contentFontSize`
- Letter spacing: `titleLetterSpacing`
- Line heights (when using strings): `titleLineHeight: "1.4em"`
- Any dimension with units stored as strings

### Why This Bug Happens

The schema compiler's old code assumed responsive values always follow the "box value" pattern (used by SpacingControl):

```javascript
// SpacingControl/CompactPadding pattern:
{ top: 12, right: 16, bottom: 12, left: 16, unit: "px" }           // Base
{ top: 12, right: 16, bottom: 12, left: 16, unit: "px", tablet: { top: 8, ... } }
```

But `SliderWithInput` uses a SCALAR pattern:

```javascript
// SliderWithInput pattern:
{ value: 1.125, unit: "rem" }                           // Base
{ value: 1.125, unit: "rem", tablet: { value: 1, unit: "rem" } }
```

The key difference: SliderWithInput's base is `{ value, unit }`, not spread properties like SpacingControl.

### Prevention Checklist

When adding new string-type attributes with SliderWithInput:

- [ ] Attribute uses `"type": "string"` (correct for values with units)
- [ ] Default value format: `"1.125rem"` (string) NOT `1.125` (number)
- [ ] After `npm run schema:build`, check generated code handles `{ value, unit }`
- [ ] Test in editor: change value in sidebar → verify preview updates
- [ ] Test responsive: switch devices → verify different values show correctly

---

## RESPONSIVE BEHAVIOR SYSTEM

### Overview

The responsive system allows controls to have different values for desktop, tablet, and mobile breakpoints. Desktop serves as the **base state**, while tablet and mobile create **device-specific overrides**.

This section explains the **complete flow** from schema definition to sidebar generation, including how the link/unlink mechanism decomposes variables into multiple parts.

### Key Files

| File | Purpose |
|------|---------|
| `shared/src/utils/responsive-device.js` | Global device state management |
| `shared/src/hooks/useResponsiveDevice.js` | Hook to subscribe to device changes |
| `shared/src/components/controls/atoms/DeviceSwitcher.js` | UI component (desktop/tablet/mobile icons) |
| `shared/src/components/controls/atoms/LinkToggle.js` | UI component (link/unlink button) |
| `shared/src/components/controls/UtilityBar.js` | Unified control bar for responsive/decomposable controls |
| `shared/src/components/controls/full/SpacingControl.js` | Example responsive + linkable control (CompactPadding, CompactMargin) |
| `shared/src/components/controls/full/BorderPanel.js` | Example responsive + linkable compound control (manages 3 attributes) |

### Complete Flow: Schema → Sidebar → Data Structure

This section explains the **complete journey** of a responsive attribute from schema definition to rendered sidebar control.

#### Step 1: Schema Definition with `responsive: true`

In `schemas/{block}.json`, define an attribute with responsive support:

```json
"headerPadding": {
  "type": "object",
  "default": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px", "linked": true },
  "cssVar": "accordion-header-padding",
  "control": "CompactPadding",
  "responsive": true,
  "units": ["px", "rem", "em"],
  "min": 0,
  "max": 100,
  "group": "spacing",
  "label": "Header Padding",
  "themeable": true,
  "order": 1
}
```

**Key properties for responsive:**
- `"responsive": true` - Enables device switcher (desktop/tablet/mobile)
- `"control": "CompactPadding"` - Uses SpacingControl which supports responsive + link/unlink
- `"default"` - ALWAYS use flat structure (no device keys!) - this is the base value
- `"type": "object"` - Required for box-based controls (padding, margin, border, radius)

#### Step 2: Schema Compilation

When you run `npm run schema:build`, the schema compiler:

1. **Reads the schema** and finds attributes with `"responsive": true`
2. **Generates TypeScript types** with device-aware structures
3. **Generates control configuration** mapping controls to their props
4. **Generates CSS variable mappings** for themeable attributes
5. **Generates inline styles code** in `edit.js` that handles responsive values

**Example generated code in `edit.js`:**

```javascript
// Auto-generated function that extracts responsive values
const getInlineStyles = (responsiveDevice = 'desktop') => {
  return {
    title: {
      // Handles both flat (default) and device-keyed (customization) structures
      padding: (() => {
        const headerPaddingVal = headerPadding[responsiveDevice] || headerPadding;
        const unit = headerPaddingVal.unit || 'px';
        return `${headerPaddingVal.top || 0}${unit} ${headerPaddingVal.right || 0}${unit} ...`;
      })(),
    },
  };
};
```

#### Step 3: Control Renderer Mapping

In `shared/src/components/ControlRenderer.js`, the control type maps to a component:

```javascript
case 'CompactPadding': {
  return (
    <SpacingControl
      key={attrName}
      label={renderLabel(finalLabel)}
      value={effectiveValue ?? defaultValue}
      onChange={handleChange}
      responsive={attrConfig.responsive}  // ← Passed from schema
      units={attrConfig.units}
      min={attrConfig.min}
      max={attrConfig.max}
      type="padding"
      sides={['top', 'right', 'bottom', 'left']}
    />
  );
}
```

**Critical props:**
- `responsive={true}` - Enables DeviceSwitcher in the control
- `value` - The current attribute value (can be flat OR device-keyed)
- `onChange` - Callback to update the attribute

#### Step 4: Sidebar Rendering

The `SpacingControl` component renders the UI based on the `responsive` prop:

**With `responsive: true`:**
```
┌─ Header Padding ─────────────────────────────────────────────┐
│  Label                          [💻][📱][📱]  [↻Reset]       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [⬒All] [16] [px] ────────●────────── [🔗]              │ │  ← Linked mode
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

When unlinking (clicking 🔗 button):

┌─ Header Padding ─────────────────────────────────────────────┐
│  Label                          [💻][📱][📱]  [↻Reset]       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [↑Top]    [12] [px] ─────●─────                         │ │  ← Unlinked mode
│  │ [→Right]  [16] [px] ─────●─────                         │ │  ← Individual sides
│  │ [↓Bottom] [12] [px] ─────●─────                         │ │
│  │ [←Left]   [16] [px] ─────●───── [🔗]                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Components used:**
- `DeviceSwitcher` - [💻][📱][📱] device icons (top right)
- `SideIcon` - [⬒All], [↑Top], [→Right], etc.
- Native `UnitControl` - Number input + unit dropdown
- `MiniSlider` - Visual slider for quick adjustments
- `LinkToggle` - [🔗] link/unlink button
- `ResetButton` - [↻Reset] to clear customizations

#### Step 5: Global Device State Synchronization

**CRITICAL:** All responsive controls share the same device state via global state management.

When you click the tablet icon in ANY control:

```javascript
// In DeviceSwitcher.js
onClick={() => {
  setGlobalResponsiveDevice('tablet');  // ← Updates window.gutplusDevice
  window.dispatchEvent(new CustomEvent('gutplus:device-change', { detail: { device: 'tablet' } }));
}}

// In every responsive control (SpacingControl, SliderWithInput, etc.)
const device = useResponsiveDevice();  // ← Subscribes to global state

// All controls react to the event and update their UI to show tablet values
```

**Result:** Clicking device icons is synchronized across ALL responsive controls in the sidebar.

**Note:** All controls use the `useResponsiveDevice()` hook to share global device state, ensuring synchronized editing across all responsive controls.

### Enabling Responsive on an Attribute

In the schema, add `"responsive": true`:

```json
"headerPadding": {
  "type": "object",
  "default": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px" },
  "control": "CompactPadding",
  "responsive": true,
  ...
}
```

### Link/Unlink Mechanism: Variable Decomposition

Box-based controls (padding, margin, border-width, border-radius) support a **link/unlink mechanism** that decomposes a single CSS property into individual side/corner variables.

#### How Link/Unlink Works

**Linked Mode (Default):**
- All sides/corners share the same value
- UI shows a single input controlling all sides
- Data structure stores all sides with same value
- `linked: true` flag indicates linked state

**Unlinked Mode:**
- Each side/corner has its own independent value
- UI shows separate inputs for each side
- Data structure stores individual values per side
- `linked: false` flag indicates unlinked state

#### Visual UI Transformation

```
LINKED MODE:
┌─────────────────────────────────┐
│ [⬒All] [16] [px] ──●── [🔗]   │  ← Single row, "All" icon, link button pressed
└─────────────────────────────────┘

User clicks [🔗] to unlink ↓

UNLINKED MODE:
┌─────────────────────────────────┐
│ [↑Top]    [12] [px] ──●──       │  ← 4 rows, individual side icons
│ [→Right]  [16] [px] ──●──       │
│ [↓Bottom] [12] [px] ──●──       │
│ [←Left]   [16] [px] ──●── [🔗] │  ← Link button unpressed (on last row)
└─────────────────────────────────┘
```

#### Data Structure Transformation

When you click the link/unlink button, the data structure changes:

**Example: Padding Control**

```javascript
// LINKED (all sides same value)
{
  top: 16,
  right: 16,
  bottom: 16,
  left: 16,
  unit: "px",
  linked: true  // ← Indicates linked state
}

// User clicks unlink button and changes right to 20
{
  top: 16,
  right: 20,   // ← Changed independently
  bottom: 16,
  left: 16,
  unit: "px",
  linked: false  // ← Now unlinked
}

// User clicks link button again
// Syncs all sides to the FIRST side's value (top = 16)
{
  top: 16,
  right: 16,   // ← Reset to match top
  bottom: 16,  // ← Reset to match top
  left: 16,    // ← Reset to match top
  unit: "px",
  linked: true  // ← Back to linked
}
```

#### CSS Variable Decomposition

When `linked: false`, the control generates **individual CSS variables** for each side instead of using shorthand:

```css
/* LINKED - uses shorthand */
.element {
  padding: var(--accordion-header-padding);  /* Expands to: 16px 16px 16px 16px */
}

/* UNLINKED - uses individual properties */
.element {
  padding-top: var(--accordion-header-padding-top);       /* 12px */
  padding-right: var(--accordion-header-padding-right);   /* 16px */
  padding-bottom: var(--accordion-header-padding-bottom); /* 12px */
  padding-left: var(--accordion-header-padding-left);     /* 16px */
}
```

**How this works in the codebase:**

1. **Schema compiler** generates code to output individual CSS properties
2. **Inline styles** in `edit.js` use longhand syntax:
   ```javascript
   paddingTop: `${val.top}${unit}`,
   paddingRight: `${val.right}${unit}`,
   paddingBottom: `${val.bottom}${unit}`,
   paddingLeft: `${val.left}${unit}`,
   ```
3. **Frontend CSS** uses individual CSS variables when needed

#### Controls That Support Link/Unlink

| Control | Variables Decomposed | Linked Property | Unlinked Properties |
|---------|---------------------|-----------------|---------------------|
| `CompactPadding` | 4 sides | `padding` | `padding-top`, `padding-right`, `padding-bottom`, `padding-left` |
| `CompactMargin` | 2 sides (top/bottom only) | `margin-top` + `margin-bottom` | `margin-top`, `margin-bottom` |
| `BorderPanel` (width) | 4 sides | `border-width` | `border-top-width`, `border-right-width`, etc. |
| `BorderPanel` (color) | 4 sides | `border-color` | `border-top-color`, `border-right-color`, etc. |
| `BorderPanel` (style) | 4 sides | `border-style` | `border-top-style`, `border-right-style`, etc. |
| `CompactBorderRadius` | 4 corners | `border-radius` | `border-top-left-radius`, `border-top-right-radius`, etc. |
| `BorderWidthControl` | 4 sides | `border-width` | `border-top-width`, `border-right-width`, etc. |

**Note:** `BorderPanel` is unique because it manages **3 attributes simultaneously** (width, color, style), and each can be linked/unlinked independently.

#### Link/Unlink Logic in Controls

**Location:** `shared/src/components/controls/full/SpacingControl.js` (lines 236-248)

```javascript
// When user clicks link button
const handleLinkChange = (newLinked) => {
  if (newLinked) {
    // LINKING: Use the first side's value for all sides
    const firstSideValue = currentValue[SIDES[0]] || 0;  // e.g., top value
    const updates = { linked: true };
    SIDES.forEach((side) => {
      updates[side] = firstSideValue;  // Copy top value to all sides
    });
    updateValue(updates);
  } else {
    // UNLINKING: Just set linked flag to false, preserve current values
    updateValue({ linked: false });
  }
};

// When user changes a value
const handleValueChange = (side, newVal) => {
  if (linked) {
    // LINKED: Update ALL allowed sides to the same value
    const updates = {};
    SIDES.forEach((s) => {
      updates[s] = newVal;
    });
    updateValue(updates);
  } else {
    // UNLINKED: Update only the specific side
    updateValue({ [side]: newVal });
  }
};
```

**Key behaviors:**
1. **Linking** syncs all sides to the first side's current value
2. **Unlinking** preserves current values, just sets `linked: false`
3. **While linked**, changing any side updates all sides simultaneously
4. **While unlinked**, each side updates independently

#### Responsive + Link/Unlink Combined

When you combine `responsive: true` with link/unlink controls, you get **device-specific + side-specific** control:

**Example: Different padding per device AND per side**

```javascript
// Schema default (linked, applies to all devices)
"headerPadding": {
  "default": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px", "linked": true },
  "responsive": true
}

// User switches to desktop, unlinks, and customizes
{
  "top": 16,      // ← Desktop values (base)
  "right": 20,
  "bottom": 16,
  "left": 20,
  "unit": "px",
  "linked": false  // ← Unlinked on desktop
}

// User switches to tablet, keeps linked, reduces value
{
  "top": 16, "right": 20, "bottom": 16, "left": 20, "unit": "px", "linked": false,  // ← Desktop (base)
  "tablet": { "top": 12, "right": 12, "bottom": 12, "left": 12, "unit": "px", "linked": true }  // ← Tablet linked
}

// User switches to mobile, unlinks, customizes
{
  "top": 16, "right": 20, "bottom": 16, "left": 20, "unit": "px", "linked": false,  // ← Desktop
  "tablet": { "top": 12, "right": 12, "bottom": 12, "left": 12, "unit": "px", "linked": true },  // ← Tablet
  "mobile": { "top": 8, "right": 12, "bottom": 8, "left": 12, "unit": "px", "linked": false }  // ← Mobile unlinked
}
```

**Result:** Each device can have its own link/unlink state AND individual side values!

**How the UI handles this:**
1. `DeviceSwitcher` controls which device data to show/edit
2. `LinkToggle` controls whether sides are linked for the CURRENT device
3. Switching devices shows that device's link state and values
4. Link/unlink state is stored per-device in responsive mode

### Data Structure: Unified Pattern

**ALL responsive attributes use the same pattern:**

- **Schema defaults are FLAT** (no device keys) - this is the base value for all devices
- **Desktop edits update the base** (stays flat)
- **Tablet/mobile edits add device-specific overrides**

**Pattern 1: Box Values (SpacingControl, BorderRadiusControl)**

```json
// Schema default - applies to ALL devices
"headerPadding": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px" }

// After user edits desktop - stays flat (desktop IS the base)
"headerPadding": { "top": 16, "right": 20, "bottom": 16, "left": 20, "unit": "px" }

// After user edits tablet - adds tablet override key
"headerPadding": {
  "top": 16, "right": 20, "bottom": 16, "left": 20, "unit": "px",  // ← base (desktop)
  "tablet": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px" }
}

// After user edits mobile - adds mobile override key
"headerPadding": {
  "top": 16, "right": 20, "bottom": 16, "left": 20, "unit": "px",  // ← base (desktop)
  "tablet": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px" },
  "mobile": { "top": 8, "right": 12, "bottom": 8, "left": 12, "unit": "px" }
}
```

**Pattern 2: Scalar Values (SliderWithInput)**

```json
// Schema default - FLAT scalar (NO device keys!)
"titleFontSize": 1.125

// After user edits desktop - stays flat
"titleFontSize": 1.25

// After user edits tablet - becomes object with base + override
"titleFontSize": { "value": 1.25, "tablet": 1.0 }

// After user edits mobile
"titleFontSize": { "value": 1.25, "tablet": 1.0, "mobile": 0.875 }
```

**IMPORTANT:** Schema defaults should NEVER use device keys like `{ "desktop": 1.125 }`.
The base value IS the desktop value - no wrapper needed.

### Why Desktop = Base?

This matches CSS media query philosophy:

```css
.element { padding: 16px; }  /* Base (desktop) - no media query */
@media (max-width: 768px) { .element { padding: 12px; } }  /* Tablet override */
@media (max-width: 480px) { .element { padding: 8px; } }   /* Mobile override */
```

Benefits:
- **Smaller data** - No redundant `desktop` key for box values
- **Standard pattern** - Matches CSS cascade
- **Clear inheritance** - tablet/mobile inherit from base if not overridden

### Global Device State (Synchronized)

**All responsive controls share the same device state.** When you click mobile on Header Padding, ALL responsive controls (font sizes, margins, etc.) switch to mobile view.

**How it works:**

```javascript
// In DeviceSwitcher.js - updates global state
onClick={() => {
  setGlobalResponsiveDevice(device.name);  // ← Updates global state
}}

// In responsive-device.js - manages global state
export function setGlobalResponsiveDevice(device) {
  window.gutplusDevice = device;
  window.dispatchEvent(
    new CustomEvent('gutplus:device-change', { detail: { device } })
  );
}

// In SpacingControl, SliderWithInput, etc. - use global state
const device = useResponsiveDevice();  // ← All controls read from same state
```

**Benefits:**
- Click mobile on ANY control → ALL controls switch to mobile
- Sidebar and editor preview stay in sync
- Consistent UX across all responsive properties

### Hook Usage in Blocks

```javascript
// In edit.js
import { useResponsiveDevice } from '@shared';

export default function Edit({ attributes }) {
  const responsiveDevice = useResponsiveDevice();  // 'desktop', 'tablet', or 'mobile'

  // Add data attribute for CSS targeting
  const blockProps = useBlockProps({
    'data-gutplus-device': responsiveDevice,
  });

  // Use in inline styles generation
  const styles = getInlineStyles();  // Should use responsiveDevice for device-specific values
}
```

### SpacingControl Internal Logic

The SpacingControl handles responsive values internally:

```javascript
// Get current value based on device
const currentValue = responsive
  ? (device === 'desktop'
    ? (hasBaseProperties ? getBaseValue() : (value?.desktop || {}))
    : (value?.[device] || getBaseValue()))  // Tablet/mobile inherit from base
  : value;

// Update value based on device
const updateValue = (updates) => {
  const newValue = { ...currentValue, ...updates };

  if (device === 'desktop') {
    // Desktop edits update the base (flat) structure
    // Preserve any existing tablet/mobile overrides
    onChange({ ...newValue, ...existingOverrides });
  } else {
    // Tablet/Mobile create device-specific overrides
    onChange({ ...baseProps, ...existingOverrides, [device]: newValue });
  }
};
```

### Inheritance in Controls

For box values, inheritance works as:
- **Desktop**: Uses base (flat) properties
- **Tablet**: Uses `value.tablet` if exists, otherwise inherits from base
- **Mobile**: Uses `value.mobile` if exists, otherwise inherits from base

For scalar values (SliderWithInput), `getInheritedSliderValue()` provides inheritance:
- **Desktop**: `values.desktop`
- **Tablet**: `values.tablet` → fallback to `values.desktop`
- **Mobile**: `values.mobile` → fallback to `values.tablet` → fallback to `values.desktop`

### Editor Preview with Responsive Values

**Current target:** editor preview should be CSS-variable driven (not inline styles).

**Generated flow (preferred):**
```javascript
const responsiveDevice = useResponsiveDevice();
const editorCSSVars = buildEditorCssVars(effectiveValues);

const blockProps = useBlockProps({
  style: { ...editorCSSVars },
  'data-gutplus-device': responsiveDevice,
});
```

**How it works:**
1. User clicks device icon in sidebar → `setGlobalResponsiveDevice('tablet')`
2. `useResponsiveDevice()` returns `'tablet'`
3. `data-gutplus-device="tablet"` activates responsive CSS selectors
4. CSS variables resolve to `--cssVar-tablet` (or fall back to base)
5. Preview updates automatically

**Note:** `getInlineStyles()` is legacy/compat. The universal system should use
CSS vars so editor and frontend share the exact same responsive logic.

### Adding DeviceSwitcher to a New Control

```javascript
import { DeviceSwitcher } from '../atoms/DeviceSwitcher';

export function MyResponsiveControl({ label, value, onChange, responsive = false }) {
  const [device, setDevice] = useState('desktop');

  // Get device-specific value
  const currentValue = responsive
    ? (device === 'desktop' ? getBaseValue(value) : (value?.[device] || getBaseValue(value)))
    : value;

  return (
    <BaseControl
      label={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{label}</span>
          {responsive && (
            <DeviceSwitcher value={device} onChange={setDevice} />
          )}
        </div>
      }
    >
      {/* Control content */}
    </BaseControl>
  );
}
```

### Complete Flow Summary: From Schema to Live Preview

This summary ties together all the pieces of the responsive system to show the complete journey from schema definition to live editor preview.

#### The Journey of a Responsive Padding Attribute

**1. Schema Definition**
```json
// schemas/accordion.json
"headerPadding": {
  "type": "object",
  "default": { "top": 12, "right": 16, "bottom": 12, "left": 16, "unit": "px", "linked": true },
  "control": "CompactPadding",
  "responsive": true,
  ...
}
```

**2. User Interactions (What the user does)**

```
User opens block sidebar
  ↓
Sees: [Header Padding]  [💻][📱][📱]  [↻]
      [⬒All] [16] [px] ──●── [🔗]
  ↓
User clicks [📱 Tablet] icon
  ↓
Global device state changes: desktop → tablet
  ↓
ALL responsive controls switch to tablet view
  ↓
User changes value from 16 to 12
  ↓
Data structure updates:
{
  "top": 16, "right": 16, "bottom": 16, "left": 16, "unit": "px", "linked": true,  // ← Desktop (base)
  "tablet": { "top": 12, "right": 12, "bottom": 12, "left": 12, "unit": "px", "linked": true }  // ← Added!
}
  ↓
User clicks [🔗 Unlink] button
  ↓
UI transforms: Shows 4 rows (top/right/bottom/left)
Data updates: { ...tablet: { ..., "linked": false } }
  ↓
User changes right from 12 to 16
  ↓
Data updates: { ...tablet: { top: 12, right: 16, bottom: 12, left: 12, unit: "px", linked: false } }
```

**3. Data Flow (What happens behind the scenes)**

```
Schema attribute change
  ↓
attributes.headerPadding updates in WordPress store
  ↓
React re-renders edit.js component
  ↓
useResponsiveDevice() hook returns current device ('tablet')
  ↓
getInlineStyles(responsiveDevice) extracts tablet-specific values:
  const val = headerPadding['tablet'] || headerPadding  // Gets tablet override
  paddingTop: `${val.top}px`      // 12px
  paddingRight: `${val.right}px`  // 16px (unlinked!)
  paddingBottom: `${val.bottom}px`// 12px
  paddingLeft: `${val.left}px`    // 12px
  ↓
styles.title = { paddingTop: '12px', paddingRight: '16px', ... }
  ↓
Applied to element: <div style={{ ...styles.title }}>
  ↓
Editor preview updates INSTANTLY with new padding
```

**4. CSS Variable Output (What gets generated)**

```css
/* Desktop (base) - no media query */
.accordion-title {
  padding-top: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
}

/* Tablet override */
@media (max-width: 768px) {
  .accordion-title {
    padding-top: 12px;
    padding-right: 16px;    /* ← Unlinked! Different from others */
    padding-bottom: 12px;
    padding-left: 12px;
  }
}
```

#### Key Mechanisms Working Together

**Mechanism 1: Global Device Synchronization**
```
DeviceSwitcher click
  → setGlobalResponsiveDevice('tablet')
  → window.gutplusDevice = 'tablet'
  → CustomEvent('gutplus:device-change') dispatched
  → ALL controls with useResponsiveDevice() hook update
  → Sidebar shows tablet values
  → Editor preview shows tablet styles
```

**Mechanism 2: Link/Unlink Decomposition**
```
LINKED (linked: true):
  User changes value → ALL sides update to same value
  Data: { top: 16, right: 16, bottom: 16, left: 16 }
  CSS: padding: 16px (shorthand)

UNLINKED (linked: false):
  User changes one side → ONLY that side updates
  Data: { top: 12, right: 16, bottom: 12, left: 12 }
  CSS: padding-top: 12px; padding-right: 16px; ... (longhand)
```

**Mechanism 3: Responsive Inheritance**
```
Desktop (base):     { top: 16, right: 20, bottom: 16, left: 20, unit: "px" }
                          ↓ (inherits if no override)
Tablet (override):  { top: 12, right: 12, bottom: 12, left: 12, unit: "px" }
                          ↓ (inherits from base if no override)
Mobile (none):      Uses base { top: 16, right: 20, ... }
```

**Mechanism 4: Value Resolution Priority**
```
For tablet device:
1. Check: value.tablet     → { top: 12, right: 16, ... } ✓ FOUND
2. Use this value

For mobile device (no override):
1. Check: value.mobile     → undefined
2. Fallback: value (base)  → { top: 16, right: 20, ... } ✓ USE THIS
```

#### The Complete Picture

```
┌─────────────────────────────────────────────────────────────┐
│ SCHEMA (schemas/accordion.json)                             │
│ "headerPadding": { "responsive": true, ... }                │
└────────────────────────┬────────────────────────────────────┘
                         ↓
         npm run schema:build (generates code)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR (ControlRenderer → SpacingControl)                  │
│                                                              │
│  [Header Padding]  [💻 Tablet 📱]  [↻]                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [↑ Top]    [12] [px] ──●──                            │  │
│  │ [→ Right]  [16] [px] ──●──  ← Unlinked, different!    │  │
│  │ [↓ Bottom] [12] [px] ──●──                            │  │
│  │ [← Left]   [12] [px] ──●── [🔗]                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Global State: responsiveDevice = 'tablet'                  │
│  Data Structure: { top:16, right:20, unit:"px", linked:false,│
│                    tablet: {top:12, right:16, ...} }        │
└────────────────────────┬────────────────────────────────────┘
                         ↓
        onChange(newValue) → WordPress store
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ EDITOR PREVIEW (edit.js)                                    │
│                                                              │
│  useResponsiveDevice() → 'tablet'                           │
│  getInlineStyles('tablet') → extracts tablet values         │
│  styles.title = { paddingTop: '12px', paddingRight: '16px'..}│
│                                                              │
│  <div className="accordion-title" style={{...styles.title}}>│
│    ┌──────────────────────────────────────┐                 │
│    │  Accordion Title                     │  ← Padding:     │
│    │                                      │     12px 16px   │
│    └──────────────────────────────────────┘     12px 12px  │
│  </div>                                                      │
└─────────────────────────────────────────────────────────────┘
```

**The Magic:** All these pieces work together seamlessly:
- **Schema** defines the rules
- **Schema compiler** generates the code
- **ControlRenderer** instantiates the right controls
- **Global device state** synchronizes all controls
- **Link/unlink mechanism** decomposes properties per-side
- **Responsive inheritance** provides device fallbacks
- **Editor preview** updates instantly via inline styles

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Desktop edits create `{ desktop: {...} }` | Using wrong update logic | **FIXED** - Desktop now updates flat base |
| Tablet/mobile don't inherit | Not checking base value | Use `value?.[device] || getBaseValue()` fallback |
| Preview doesn't change on device switch | Not passing `responsiveDevice` | **FIXED** - Now uses `getInlineStyles(responsiveDevice)` |
| Value resets when switching devices | Not preserving other device overrides | Spread `existingOverrides` when updating |
| Schema defaults use device keys | Wrong schema structure | Schema defaults must be FLAT (no `{ "desktop": value }`) |
| **Responsive controls don't preview when responsive mode is OFF** | SliderWithInput value extraction bug | **FIXED** - See "Responsive Controls Not Previewing" section below |

---

## RESPONSIVE CONTROLS NOT PREVIEWING (CRITICAL FIX)

### The Problem Pattern

**SYMPTOMS:**
- Font-size, titleOffsetX, titleOffsetY, or other responsive-capable attributes don't preview in the editor
- Values work fine when responsive mode is ENABLED (after clicking responsive toggle and desktop icon)
- But values are stuck on defaults when responsive mode is OFF (global settings)
- Controls appear to work in sidebar (you can type values), but preview doesn't update

**AFFECTED ATTRIBUTES:**
Any attribute with:
- `"responsive": true` in schema
- `"control": "SliderWithInput"`
- Can also affect other responsive controls if they follow the same pattern

### Root Cause Analysis

The issue stems from a mismatch between **how ControlRenderer passes data** and **how SliderWithInput receives it**.

#### The Data Flow Problem

**When responsive mode is OFF (`responsiveEnabled[attrName] === false`):**

```javascript
// In ControlRenderer.js (line 496-515):
if ( responsive ) {
  return (
    <SliderWithInput
      values={ effectiveValue || {} }       // ← Passes "values" prop
      onChange={ handleResponsiveChange }   // ← Callback expects (device, value)
      responsive={ isResponsiveEnabled }    // ← FALSE when mode is off
      ...
    />
  );
}
```

**The Bug:** When `isResponsiveEnabled === false` but attribute schema has `responsive: true`:
1. ControlRenderer still passes `values` prop (not `value`)
2. ControlRenderer uses `handleResponsiveChange` callback (expects device arg)
3. SliderWithInput receives `responsive={false}` and `values={...}`
4. Component checks `isResponsive = responsive && values !== undefined` → **FALSE**
5. Tries to use `singleValue` prop → **UNDEFINED** ❌
6. Falls back to default value → **NO PREVIEW** ❌

**Location of Bug:** `shared/src/components/controls/SliderWithInput.js` (lines 342-366)

#### The Callback Signature Problem

Even if value extraction worked, there's a second issue:

```javascript
// When responsive mode is OFF:
onChange(newValue)  // ← Only passes value

// But ControlRenderer expects:
handleResponsiveChange(device, newValue)  // ← Expects device + value
```

This causes the callback to receive `newValue` as `device` argument and `undefined` as `value`, breaking the update.

### The Fix (Applied 2025-12-29)

**Location:** `shared/src/components/controls/SliderWithInput.js`

#### Fix 1: Value Extraction (Lines 344-366)

**BEFORE (Broken):**
```javascript
const { value: effectiveRawValue, inheritedFrom } = useMemo( () => {
  if ( isResponsive ) {
    return getInheritedSliderValue( values, device );
  }
  return { value: singleValue, inheritedFrom: null };  // ❌ singleValue is undefined!
}, [ isResponsive, values, device, singleValue ] );
```

**AFTER (Fixed):**
```javascript
const { value: effectiveRawValue, inheritedFrom } = useMemo( () => {
  if ( isResponsive ) {
    return getInheritedSliderValue( values, device );
  }
  // Not in responsive mode - check both singleValue and values
  // ControlRenderer passes `values` for responsive-capable attributes even when
  // responsive mode is currently disabled (canBeResponsive=true, responsive=false)
  if ( singleValue !== undefined ) {
    return { value: singleValue, inheritedFrom: null };
  }
  // Fallback: extract base value from values if passed
  // This handles the case where ControlRenderer always passes `values` prop
  // for attributes that support responsive mode (even when disabled)
  if ( values !== undefined ) {
    const baseValue = getBaseValue( values );
    return { value: baseValue, inheritedFrom: null };
  }
  return { value: undefined, inheritedFrom: null };
}, [ isResponsive, values, device, singleValue ] );
```

**Key Changes:**
- ✅ Checks `singleValue` first (for truly non-responsive controls)
- ✅ Falls back to extracting base value from `values` (for responsive-capable but currently disabled)
- ✅ Uses existing `getBaseValue()` helper to extract flat value

#### Fix 2: Callback Pattern (Lines 384-403)

**NEW:** Added `useResponsiveCallback` flag:

```javascript
// Check if we should use responsive callback pattern
// This is true when:
// 1. isResponsive is true (user enabled responsive mode)
// 2. OR values is passed (responsive-capable attribute, even if responsive mode is off)
// ControlRenderer always passes handleResponsiveChange for responsive-capable attributes
const useResponsiveCallback = isResponsive || values !== undefined;

// Handler for slider/number value changes
const handleValueChange = ( newNumericValue ) => {
  const newValue = hasUnits
    ? { value: newNumericValue, unit: currentUnit }
    : newNumericValue;

  if ( useResponsiveCallback ) {
    // Always pass device when responsive-capable (handleResponsiveChange expects it)
    onChange( device, newValue );
  } else {
    onChange( newValue );
  }
};
```

**Applied to:**
- `handleValueChange()` (lines 391-403)
- `handleUnitControlChange()` (lines 405-420)
- `handleReset()` (lines 422-438)

**Key Logic:**
- ✅ Uses responsive callback signature when `values` prop is passed
- ✅ Passes `(device, value)` instead of just `(value)`
- ✅ Works correctly whether responsive mode is ON or OFF

#### Fix 3: Reset Button State (Lines 440-455)

**BEFORE:**
```javascript
const isResetDisabled = isResponsive
  ? values?.[ device ] === undefined || values?.[ device ] === null
  : singleValue === undefined || singleValue === defaultValue;  // ❌ singleValue undefined!
```

**AFTER:**
```javascript
const isResetDisabled = useMemo( () => {
  if ( isResponsive ) {
    // In responsive mode, check if current device has an override
    return values?.[ device ] === undefined || values?.[ device ] === null;
  }
  if ( values !== undefined ) {
    // Responsive-capable but not in responsive mode: check base value
    const baseValue = getBaseValue( values );
    return baseValue === undefined || baseValue === null ||
      JSON.stringify( baseValue ) === JSON.stringify( defaultValue );
  }
  // Non-responsive: check singleValue
  return singleValue === undefined || singleValue === defaultValue;
}, [ isResponsive, values, device, singleValue, defaultValue ] );
```

**Key Changes:**
- ✅ Checks base value when `values` is passed but responsive mode is off
- ✅ Properly determines if reset button should be enabled

### How to Diagnose This Issue

**Step 1: Identify the Symptoms**
- Control updates in sidebar (shows new value)
- Editor preview doesn't update (stays at default)
- Problem only occurs when responsive mode is OFF
- Enabling responsive + clicking desktop icon makes it work

**Step 2: Check the Schema**
```json
"titleOffsetX": {
  "type": "string",
  "default": "0px",
  "control": "SliderWithInput",
  "responsive": true,  // ← Responsive-capable
  ...
}
```

**Step 3: Console Log the Value**
```javascript
// In edit.js:
console.log('titleOffsetX value:', attributes.titleOffsetX);
// Expected: "5px" or { value: 5, unit: "px" }
// Bug symptom: undefined or default value
```

**Step 4: Check getInlineStyles() Output**
```javascript
// In edit.js:
const styles = getInlineStyles(responsiveDevice);
console.log('titleOffsetX in styles:', styles.title.left);
// Expected: "5px"
// Bug symptom: "0px" (default)
```

**Step 5: Verify the Fix**
Check that `SliderWithInput.js` has the updated value extraction logic (lines 344-366).

### How to Prevent This Issue

When creating responsive-capable controls:

**✅ DO:**
1. Check both `singleValue` AND `values` props when extracting effective value
2. Use responsive callback signature `(device, value)` when `values` prop is passed
3. Handle flat values (base) separately from device-keyed values
4. Test with responsive mode both ON and OFF

**❌ DON'T:**
1. Assume `singleValue` is always defined when `responsive={false}`
2. Use non-responsive callback `(value)` when attribute supports responsive
3. Only check `isResponsive` flag - also check if `values` prop is passed
4. Forget to test the "global settings" state (responsive mode OFF)

### Testing Checklist

After fixing or creating responsive controls, verify:

- [ ] **Responsive OFF (global):** Value changes in sidebar → preview updates ✓
- [ ] **Responsive ON (desktop):** Value changes in sidebar → preview updates ✓
- [ ] **Responsive ON (tablet):** Value changes → creates tablet override ✓
- [ ] **Responsive ON (mobile):** Value changes → creates mobile override ✓
- [ ] **Device switching:** Clicking device icons → shows correct values ✓
- [ ] **Reset button:** Correctly enabled/disabled based on customization ✓
- [ ] **Inheritance:** Tablet/mobile inherit from desktop when no override ✓

### Files Modified (2025-12-29)

| File | Lines | Change |
|------|-------|--------|
| `shared/src/components/controls/SliderWithInput.js` | 344-366 | Fixed value extraction to check both `singleValue` and `values` |
| `shared/src/components/controls/SliderWithInput.js` | 384-403 | Added `useResponsiveCallback` flag and updated `handleValueChange` |
| `shared/src/components/controls/SliderWithInput.js` | 391-395 | **CRITICAL:** Added `callbackDevice` to use 'desktop' when responsive OFF |
| `shared/src/components/controls/SliderWithInput.js` | 405-420 | Updated `handleUnitControlChange` to use responsive callback |
| `shared/src/components/controls/SliderWithInput.js` | 422-438 | Updated `handleReset` to use responsive callback |
| `shared/src/components/controls/SliderWithInput.js` | 440-455 | Fixed `isResetDisabled` to handle base value check |


### Additional Critical Fix: callbackDevice

**Problem:** Even after the initial fix, values still didn't preview when responsive mode was OFF.

**Root Cause:** The `useResponsiveDevice()` hook returns the **global** device state. If the user had previously clicked "tablet" or "mobile" on ANY other control (and left it there), all subsequent changes would use that device in the callback.

**Example Scenario:**
1. User is editing titleFontSize with responsive mode OFF
2. Global device state is 'tablet' (from previous interaction)
3. User changes font-size value
4. `onChange('tablet', { value: 1.5, unit: 'rem' })` is called ❌
5. Creates tablet override instead of base value
6. Preview doesn't update because it's looking for base value

**The Fix (Lines 391-395):**
```javascript
// Determine which device to use for callbacks:
// - When responsive mode is ON: use the global device (user-selected)
// - When responsive mode is OFF: ALWAYS use 'desktop' (base/global value)
// This prevents creating device overrides when user just wants to change the base value
const callbackDevice = isResponsive ? device : 'desktop';
```

**All handlers now use `callbackDevice` instead of `device`:**
- `handleValueChange()` - line 405
- `handleUnitControlChange()` - line 422
- `handleReset()` - lines 432, 439

**Result:**
- ✅ Responsive OFF: Always stores as base value (desktop), preview works
- ✅ Responsive ON + desktop: Stores as base value, preview works
- ✅ Responsive ON + tablet/mobile: Stores as device override, preview works

### Why This Matters

Responsive-capable attributes are a **core feature** of the theming system. When they don't preview correctly:
- User experience degrades (confusing why values don't update)
- Users assume the plugin is broken
- Testing becomes difficult (can't see what you're changing)
- May lead to duplicate bug reports

This fix ensures **all responsive-capable controls work correctly in BOTH modes**:
1. **Global mode (responsive OFF):** Values preview immediately
2. **Device mode (responsive ON):** Values preview per-device with inheritance

### Related Issues

This pattern may affect other controls that:
- Accept both `value` and `values` props
- Support responsive mode
- Use callbacks with device parameter

**Other controls to audit:**
- Custom SliderWithInput variants
- Any control wrapper that implements responsive logic
- Controls that use `ControlRenderer.handleResponsiveChange`

**How to check:**
```bash
# Search for similar patterns:
grep -r "isResponsive.*values !== undefined" shared/src/components/controls/
grep -r "responsive && values" shared/src/components/controls/
```
