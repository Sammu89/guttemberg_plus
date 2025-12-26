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
| `SliderWithInput` | `number` | `min`, `max`, `step`, `units`, `responsive` | Slider + input + unit |
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
`shared/src/components/controls/lego-controls.scss`:

```scss
.gutplus-my-control {
  /* Styles */
}
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

## RESPONSIVE BEHAVIOR SYSTEM

### Overview

The responsive system allows controls to have different values for desktop, tablet, and mobile breakpoints. Desktop serves as the **base state**, while tablet and mobile create **device-specific overrides**.

### Key Files

| File | Purpose |
|------|---------|
| `shared/src/utils/responsive-device.js` | Global device state management |
| `shared/src/hooks/useResponsiveDevice.js` | Hook to subscribe to device changes |
| `shared/src/components/controls/atoms/DeviceSwitcher.js` | UI component (desktop/tablet/mobile icons) |
| `shared/src/components/controls/full/SpacingControl.js` | Example responsive control (CompactPadding, CompactMargin) |

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

The auto-generated `getInlineStyles(responsiveDevice)` in edit.js uses the current device to select values:

```javascript
// Generated code - uses responsiveDevice parameter:
const getInlineStyles = (responsiveDevice = 'desktop') => {
  return {
    title: {
      padding: (() => {
        // Uses responsiveDevice to select the correct device value
        const headerPaddingVal = headerPadding[responsiveDevice] || headerPadding;
        const unit = headerPaddingVal.unit || 'px';
        return `${headerPaddingVal.top || 0}${unit} ${headerPaddingVal.right || 0}${unit}...`;
      })(),
    },
  };
};

// Called with current device:
const styles = getInlineStyles(responsiveDevice);
```

**How it works:**
1. User clicks device icon in sidebar → `setGlobalResponsiveDevice('tablet')`
2. `useResponsiveDevice()` hook returns `'tablet'`
3. `getInlineStyles('tablet')` extracts tablet-specific values
4. Editor preview updates with tablet styles

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

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Desktop edits create `{ desktop: {...} }` | Using wrong update logic | **FIXED** - Desktop now updates flat base |
| Tablet/mobile don't inherit | Not checking base value | Use `value?.[device] || getBaseValue()` fallback |
| Preview doesn't change on device switch | Not passing `responsiveDevice` | **FIXED** - Now uses `getInlineStyles(responsiveDevice)` |
| Value resets when switching devices | Not preserving other device overrides | Spread `existingOverrides` when updating |
| Schema defaults use device keys | Wrong schema structure | Schema defaults must be FLAT (no `{ "desktop": value }`) |
