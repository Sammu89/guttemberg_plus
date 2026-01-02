# Icon Panel Generation and Runtime Pipeline

This document is the single technical source of truth for how the Icon Panel is defined, generated, and rendered for accordion/tabs/TOC blocks. It describes the full build-time pipeline (schema -> macro expansion -> generated artifacts) and the runtime pipeline (editor UI -> attributes -> CSS variables -> frontend).

## Scope
- Blocks: `accordion`, `tabs`, `toc`.
- UI: inspector sidebar Icon panel and its controls.
- Data: icon attributes, responsive values, theme/cascade behavior.
- Styling: editor sidebar styles and frontend icon styles.

## Key Files (roles)
- Schema input:
  - `schemas/accordion.json`
  - `schemas/tabs.json`
  - `schemas/toc.json`
- Macro expansion + generation:
  - `build-tools/schema-compiler.js` (reads schema, expands icon-panel macro, writes generated files)
- Expanded schema (runtime editor input):
  - `schemas/expanded/accordion-expanded.json`
  - `schemas/expanded/tabs-expanded.json`
  - `schemas/expanded/toc-expanded.json`
- Block attribute definitions (WordPress attribute registration):
  - `blocks/accordion/src/accordion-attributes.js`
  - `blocks/tabs/src/tabs-attributes.js`
  - `blocks/toc/src/toc-attributes.js`
- Control config (labels, defaults, allowed positions):
  - `shared/src/config/control-config-generated.js`
- CSS variable mappings:
  - `shared/src/config/css-var-mappings-generated.js`
- CSS var builders:
  - `shared/src/styles/accordion-css-vars-generated.js`
  - `shared/src/styles/tabs-css-vars-generated.js`
  - `shared/src/styles/toc-css-vars-generated.js`
  - `shared/src/styles/accordion-frontend-css-vars-generated.js` (and tabs/toc equivalents)
- Panel assembly:
  - `shared/src/components/SchemaPanels.js`
  - `shared/src/components/controls/IconPanel.js`
  - `shared/src/components/controls/IconPicker.js`
  - `shared/src/components/controls/ResponsiveWrapper.js`
  - `shared/src/hooks/useResponsiveDevice.js`
  - `shared/src/utils/responsive-device.js`
- Editor styling:
  - `blocks/accordion/src/editor.scss` (imports `shared/src/components/controls/SidebarStyling.scss`)
  - `shared/src/components/controls/IconPicker.scss`
  - `shared/src/components/controls/SidebarStyling.scss`
- Frontend styling + behavior:
  - `blocks/accordion/src/style.scss` (and tabs/toc equivalents)
  - `blocks/accordion/src/frontend.js` (and tabs/toc equivalents)

## Quick Reference (Accordion only)

| Item | Value / Location | Notes |
| --- | --- | --- |
| Macro entry | `schemas/accordion.json` -> `attributes.titleIcon` | `type: "icon-panel"` |
| cssVar prefix | `accordion-icon` | Expands to `--accordion-icon-*` |
| appliesToElement | `icon` | CSS target for icon vars |
| Generated attributes | `showIcon`, `useDifferentIcons`, `iconPosition`, `iconRotation`, `iconInactive*`, `iconActive*` | 16 total |
| Editor panel | `shared/src/components/controls/IconPanel.js` | Used when group id is `icon` |
| Icon picker | `shared/src/components/controls/IconPicker.js` | `kind: char | image | library` |
| CSS var mapping | `shared/src/config/css-var-mappings-generated.js` | Accordion mappings for icon vars |
| Editor CSS vars | `shared/src/styles/accordion-css-vars-generated.js` | Emits base + tablet/mobile vars |
| Frontend CSS | `blocks/accordion/src/style.scss` | Uses `--accordion-icon-*` |

## Accordion Icon Panel UX (Product Requirement)

This section captures the intended UX requirements for the accordion Icon panel. It is the target behavior even if the current implementation differs.

- Controls order (top to bottom):
  - `Show Icon` toggle.
  - `Icon Position` control.
  - `Icon Rotation` slider with label text: "Rotation applied in opening/close".
  - `Different icons for active state` toggle.
- If "Different icons for active state" is **off**:
  - Panel shows a single "Icon Settings" block.
  - Includes `Icon Picker` (Character/Image/Library).
  - Includes `Icon Color`, `Icon Size`, `Offset X`, `Offset Y`.
  - `Icon Size`, `Offset X`, `Offset Y` are responsive.
  - Rotation is the only visual change between open/close (icon kind stays the same).
- If "Different icons for active state" is **on**:
  - A `Preview Open State` toggle appears **outside** the Open/Closed tabs to switch preview in the editor.
  - The settings are split into two tabs: `Closed` and `Open`.
  - Both tabs expose the same controls (Icon Picker + color/size/offset).
  - The `Open` state inherits the `Closed` state values by default until overridden.
  - Rotation still applies as the transition between closed and open states.
- Icon kinds can differ between states (char/image/library), and each state can have unique color, size, and offsets.

### Known gaps vs requirement (current code)
~~- Lucide icons are not appearing in the library picker (empty list).~~ **FIXED 2026-01-01**
~~- `Preview Open State` toggle currently lives inside the Active tab rather than above the tabs.~~ **FIXED 2026-01-01**
~~- Rotation control is hidden when `useDifferentIcons` is enabled.~~ **FIXED 2026-01-01**

See `docs/ICON_PANEL_FIXES_IMPLEMENTATION_PLAN.md` for fix details.

## 1. Schema Definition (icon-panel macro)

### Where the macro lives
Each block schema contains one `type: "icon-panel"` entry:
- Accordion: `titleIcon` in `schemas/accordion.json`
- Tabs: `tabIcon` in `schemas/tabs.json`
- TOC: `tocIcon` in `schemas/toc.json`

### Macro shape (schema input)
The schema entry is minimal and declarative. Example (accordion):
```
"titleIcon": {
  "type": "icon-panel",
  "order": 2,
  "cssVar": "accordion-icon",
  "appliesToElement": "icon",
  "themeable": true,
  "outputsCSS": false,
  "default": {
    "position": "right",
    "rotation": "180deg",
    "inactive": {
      "source": { "icon-type": "char", "value": "<default-char>" },
      "color": "#333333",
      "size": "16px",
      "maxSize": "24px",
      "offsetX": "0px",
      "offsetY": "0px"
    }
  }
}
```
Notes:
- `cssVar` is the base prefix used to build icon CSS variables.
- `appliesToElement` is used as the target element name for CSS variable application.
- `default.active` is optional. If missing, active defaults are treated as "inherit" by the macro (see expansion logic below).
- The default inactive `source` uses `"icon-type"` which is normalized to `{ kind, value }` by the macro expander.

## 2. Macro Expansion (build-tools/schema-compiler.js)

### How schemas are read
Build step: `npm run schema:build`.
1. `loadSchema(blockType)` reads the JSON file from `schemas/*.json`.
2. `processAttributes()` walks `schema.attributes`:
   - If `attr.type === "icon-panel"`, it calls `expandIconPanelMacro(name, attr, blockType)`.
   - Otherwise, attributes are passed through unchanged.
3. The expanded schema is written to `schemas/expanded/<block>-expanded.json`.

### Expansion logic and defaults
Function: `expandIconPanelMacro(macroName, macro, blockType)` in `build-tools/schema-compiler.js`.

Defaults and inferred fields:
- `group`: defaults to `"icon"` if missing.
- `label`: derived from macro name if missing (e.g., `titleIcon` -> `Title Icon`).
- `description`: defaults to `Icon settings for ${blockType}`.
- `positioningProfile`: defaults to `blockType`, used to compute allowed icon positions.
- `appliesToElement`: defaults to `macro.appliesToElement`, then `macro.appliesTo`, then `"icon"`.
- `responsiveAttrs`: always `["size", "maxSize", "offsetX", "offsetY"]`.
- `allowedPositions`: from `POSITIONING_PROFILES` in `schema-compiler.js`:
  - Accordion, TOC: `left`, `right`, `extreme-left`, `extreme-right`
  - Tabs: `left`, `right`

Active defaults:
- If `default.active` is missing, the macro treats active defaults as "inherit".
- Implementation detail: `getDefault()` returns `null` for active keys, but each attribute also has a fallback (e.g., color -> `#333333`). This means active defaults are still set unless the UI explicitly nulls them.
- The UI (`IconPanel`) clears active values when `useDifferentIcons` is turned off.

### Generated attributes (16 total)
The macro expands into the following attributes. `cssVar` values shown are for accordion; tabs/toc use `--tabs-...` or `--toc-...` prefixes.

Global icon controls:
1. `showIcon`
   - type: boolean
   - default: `true`
   - control: `ToggleControl`
   - cssVar: `--accordion-icon-display`
   - cssProperty: `display`
   - cssValueMap: `{ true: "inline-flex", false: "none" }`
   - outputsCSS: `true`
2. `useDifferentIcons`
   - type: boolean
   - default: `false`
   - control: `ToggleControl`
   - outputsCSS: `false`
   - showWhen: `showIcon === true`
3. `iconPosition`
   - type: string
   - default: `defaults.position || "right"`
   - control: `IconPositionControl`
   - allowedPositions: derived from `positioningProfile`
   - outputsCSS: `false`
   - showWhen: `showIcon === true`
4. `iconRotation`
   - type: string
   - default: `defaults.rotation || "180deg"`
   - control: `SliderWithInput`
   - cssVar: `--accordion-icon-rotation`
   - cssProperty: `transform`
   - outputsCSS: `true`
   - showWhen: `showIcon === true && useDifferentIcons === false`

Inactive (closed) state:
5. `iconInactiveSource`
   - type: object
   - default: normalized to `{ kind, value }` from `default.inactive.source`
   - control: `IconPicker`
   - subgroup: `inactive`
6. `iconInactiveColor`
   - type: string
   - default: `default.inactive.color || "#333333"`
   - control: `ColorControl`
   - cssVar: `--accordion-icon-color`
   - cssProperty: `color`
   - conditionalRender: `iconInactiveSource.kind !== "image"`
7. `iconInactiveSize`
   - type: string
   - default: `default.inactive.size || "16px"`
   - control: `SliderWithInput`
   - cssVar: `--accordion-icon-size`
   - cssProperty: `font-size`
   - responsive: `true`
   - conditionalRender: `iconInactiveSource.kind !== "image"`
8. `iconInactiveMaxSize`
   - type: string
   - default: `default.inactive.maxSize || "24px"`
   - control: `SliderWithInput`
   - cssVar: `--accordion-icon-max-size`
   - cssProperty: `max-width`
   - responsive: `true`
   - conditionalRender: `iconInactiveSource.kind === "image"`
9. `iconInactiveOffsetX`
   - type: string
   - default: `default.inactive.offsetX || "0px"`
   - control: `SliderWithInput`
   - cssVar: `--accordion-icon-offset-x`
   - cssProperty: `left`
   - responsive: `true`
10. `iconInactiveOffsetY`
    - type: string
    - default: `default.inactive.offsetY || "0px"`
    - control: `SliderWithInput`
    - cssVar: `--accordion-icon-offset-y`
    - cssProperty: `top`
    - responsive: `true`

Active (open) state:
11. `iconActiveSource`
    - type: object
    - default: normalized to `{ kind, value }`
    - control: `IconPicker`
    - subgroup: `active`
    - showWhen: `showIcon === true && useDifferentIcons === true`
12. `iconActiveColor`
    - type: string
    - default: `default.active.color || "#333333"` (or fallback)
    - control: `ColorControl`
    - cssVar: `--accordion-icon-active-color`
    - cssProperty: `color`
    - conditionalRender: `iconActiveSource.kind !== "image"`
    - showWhen: `showIcon === true && useDifferentIcons === true`
13. `iconActiveSize`
    - type: string
    - default: `default.active.size || "16px"` (or fallback)
    - control: `SliderWithInput`
    - cssVar: `--accordion-icon-active-size`
    - cssProperty: `font-size`
    - responsive: `true`
    - conditionalRender: `iconActiveSource.kind !== "image"`
    - showWhen: `showIcon === true && useDifferentIcons === true`
14. `iconActiveMaxSize`
    - type: string
    - default: `default.active.maxSize || "24px"` (or fallback)
    - control: `SliderWithInput`
    - cssVar: `--accordion-icon-active-max-size`
    - cssProperty: `max-width`
    - responsive: `true`
    - conditionalRender: `iconActiveSource.kind === "image"`
    - showWhen: `showIcon === true && useDifferentIcons === true`
15. `iconActiveOffsetX`
    - type: string
    - default: `default.active.offsetX || "0px"` (or fallback)
    - control: `SliderWithInput`
    - cssVar: `--accordion-icon-active-offset-x`
    - cssProperty: `left`
    - responsive: `true`
    - showWhen: `showIcon === true && useDifferentIcons === true`
16. `iconActiveOffsetY`
    - type: string
    - default: `default.active.offsetY || "0px"` (or fallback)
    - control: `SliderWithInput`
    - cssVar: `--accordion-icon-active-offset-y`
    - cssProperty: `top`
    - responsive: `true`
    - showWhen: `showIcon === true && useDifferentIcons === true`

Note: The macro expansion code returns 16 attributes (4 global + 6 inactive + 6 active). The header comment in `build-tools/schema-compiler.js` still mentions 15, but the implementation returns 16.

### Schema Compiler showWhen Logic Implementation

The `expandIconPanelMacro` function in `build-tools/schema-compiler.js` generates `showWhen` conditions for each attribute to control visibility based on other attributes.

#### Global Attributes showWhen Rules

```javascript
// 1. showIcon - always visible (no showWhen)
expanded.showIcon = {
  type: 'boolean',
  default: true,
  control: 'ToggleControl',
  // ... no showWhen - always visible
};

// 2. useDifferentIcons - only visible when icon is shown
expanded.useDifferentIcons = {
  type: 'boolean',
  default: false,
  control: 'ToggleControl',
  showWhen: {
    showIcon: [true]  // Only show when icon is enabled
  }
};

// 3. iconPosition - only visible when icon is shown
expanded.iconPosition = {
  type: 'string',
  default: defaults.position || 'right',
  control: 'IconPositionControl',
  showWhen: {
    showIcon: [true]  // Only show when icon is enabled
  }
};

// 4. iconRotation - visible when icon is shown
// NOTE: Previously had useDifferentIcons: [false], removed in 2026-01-01 fix
expanded.iconRotation = {
  type: 'string',
  default: defaults.rotation || '180deg',
  control: 'SliderWithInput',
  showWhen: {
    showIcon: [true]
    // REMOVED: useDifferentIcons: [false]
    // Rotation now always visible when showIcon is true
  }
};
```

**showWhen Semantics:**
- `showIcon: [true]` means "only show this control when showIcon attribute equals true"
- Multiple keys create an AND condition (all must match)
- Array values create an OR condition (any value matches)
- Example: `showWhen: { showIcon: [true], useDifferentIcons: [false, null] }` means "show when icon is on AND useDifferentIcons is false or null"

#### State Attributes showWhen Rules

The `generateStateAttributes` helper function creates showWhen rules for inactive and active state attributes:

```javascript
const generateStateAttributes = (state) => {
  // Base showWhen for all icon controls
  const baseShowWhen = {
    showIcon: [true]
  };

  // State-specific showWhen
  const stateShowWhen = state === 'inactive'
    ? baseShowWhen  // Inactive: just showIcon
    : { ...baseShowWhen, useDifferentIcons: [true] };  // Active: showIcon AND useDifferentIcons

  return {
    // Source (IconPicker)
    [`${statePrefix}Source`]: {
      type: 'object',
      control: 'IconPicker',
      showWhen: stateShowWhen
      // inactive: { showIcon: [true] }
      // active:   { showIcon: [true], useDifferentIcons: [true] }
    },

    // Color, Size, MaxSize, OffsetX, OffsetY all use same stateShowWhen
    [`${statePrefix}Color`]: {
      showWhen: stateShowWhen
    },
    // ... etc
  };
};
```

**Inactive vs Active:**
- **Inactive attributes** (`iconInactive*`): Only require `showIcon: [true]`
  - Always visible when icon is shown (in both single and dual icon modes)
  - In single icon mode, these are the only icon attributes shown
  - In dual icon mode, these appear in the "Inactive (Closed)" tab

- **Active attributes** (`iconActive*`): Require `showIcon: [true]` AND `useDifferentIcons: [true]`
  - Only visible when dual icon mode is enabled
  - Appear in the "Active (Open)" tab
  - Hidden completely in single icon mode

#### Important Note: showWhen vs Actual UI Behavior

**Schema showWhen is NOT enforced by IconPanel:**

The `showWhen` conditions in the schema are metadata that describe when attributes should be visible. However, IconPanel.js **does NOT read or enforce these conditions** from the schema. Instead, it implements its own conditional rendering logic:

```javascript
// IconPanel implements its own visibility logic, NOT from schema
{/* Rotation - always visible when icon shown (ignores schema showWhen) */}
<div style={ { marginTop: '16px', marginBottom: '16px' } }>
  <SliderWithInput
    label="Rotation Angle"
    // ... rendered based on component logic, not schema showWhen
  />
</div>

{/* Active attributes - only shown in DualIconMode */}
{ useDifferentIcons ? (
  <DualIconMode /* active attributes appear here */ />
) : (
  <SingleIconMode /* only inactive attributes appear here */ />
) }
```

**Why showWhen exists:**
- Documents intended visibility behavior
- Used by ControlRenderer (generic control renderer for non-icon panels)
- Provides metadata for potential future auto-generated UIs
- Helps developers understand attribute relationships

**Why IconPanel doesn't use it:**
- IconPanel has complex custom UI (tabs, conditional controls, responsive wrappers)
- showWhen is designed for simple show/hide, not complex nested structures
- IconPanel's visibility logic is more nuanced (e.g., rotation help text changes, not just visibility)

#### Example: Full showWhen Set for Accordion Icons

After macro expansion, the accordion gets these showWhen conditions:

```javascript
{
  showIcon: {}, // No showWhen - always visible

  useDifferentIcons: {
    showWhen: { showIcon: [true] }
  },

  iconPosition: {
    showWhen: { showIcon: [true] }
  },

  iconRotation: {
    showWhen: { showIcon: [true] }
  },

  // Inactive state (always visible when icon shown)
  iconInactiveSource: {
    showWhen: { showIcon: [true] }
  },
  iconInactiveColor: {
    showWhen: { showIcon: [true] }
  },
  iconInactiveSize: {
    showWhen: { showIcon: [true] }
  },
  iconInactiveMaxSize: {
    showWhen: { showIcon: [true] }
  },
  iconInactiveOffsetX: {
    showWhen: { showIcon: [true] }
  },
  iconInactiveOffsetY: {
    showWhen: { showIcon: [true] }
  },

  // Active state (only visible when dual icon mode enabled)
  iconActiveSource: {
    showWhen: { showIcon: [true], useDifferentIcons: [true] }
  },
  iconActiveColor: {
    showWhen: { showIcon: [true], useDifferentIcons: [true] }
  },
  iconActiveSize: {
    showWhen: { showIcon: [true], useDifferentIcons: [true] }
  },
  iconActiveMaxSize: {
    showWhen: { showIcon: [true], useDifferentIcons: [true] }
  },
  iconActiveOffsetX: {
    showWhen: { showIcon: [true], useDifferentIcons: [true] }
  },
  iconActiveOffsetY: {
    showWhen: { showIcon: [true], useDifferentIcons: [true] }
  }
}
```

## 3. Generated Artifacts (build output)

### Expanded schema (editor runtime)
`schemas/expanded/<block>-expanded.json` is what the editor imports (e.g., `blocks/accordion/src/edit.js` uses `schemas/expanded/accordion-expanded.json`).

### Block attributes
`blocks/<block>/src/<block>-attributes.js` is generated from the expanded schema and is passed to `registerBlockType` in `blocks/<block>/src/index.js`.
Important: this overrides the attributes in `blocks/<block>/block.json`. The generated attributes file is the true runtime source.

### Control configuration
`shared/src/config/control-config-generated.js`:
- Provides defaults, options, and allowed positions.
- `IconPositionControl` reads allowed positions from here.
- `IconPanel` uses `getNumericDefault()` from here to extract numeric values from strings.

### CSS variable mappings
`shared/src/config/css-var-mappings-generated.js`:
- Maps each icon attribute to a CSS variable (`--accordion-icon-*`, `--tabs-icon-*`, `--toc-icon-*`).
- `showIcon` uses `cssValueMap` to map boolean -> `inline-flex`/`none`.

### CSS var builders
- `buildEditorCssVars()` in `shared/src/styles/<block>-css-vars-generated.js`:
  - Emits CSS vars for editor preview.
  - If an attribute is responsive (has `tablet`/`mobile` keys), it emits `--var`, `--var-tablet`, `--var-mobile`.
- `buildFrontendCssVars()` in `shared/src/styles/<block>-frontend-css-vars-generated.js`:
  - Emits CSS vars for frontend (uses `attributes.customizations`).

## 4. Editor Panel Assembly (runtime UI)

### Panel routing
`blocks/<block>/src/edit.js` renders the inspector:
1. `TabbedInspector` hosts "Settings" and "Appearance".
2. `AppearancePanels` renders `SchemaPanels` with `tab="appearance"`.
3. `SchemaPanels` inspects schema groups. If `groupId === "icon"`, it renders `IconPanel` instead of the generic panel.

### IconPanel composition (control building blocks)
File: `shared/src/components/controls/IconPanel.js`.

Main building blocks:
- `PanelBody` (container)
- `ToggleControl` (show icon, different icons, preview open)
- `IconPositionControl` (position selector)
- `SliderWithInput` (rotation, size, max size, offsets)
- `IconPicker` (character/image/library)
- `ColorControl` (icon color for char/library)
- `ResponsiveWrapper` (device switching for size/offset)
- `TabPanel` (inactive/active tabs when `useDifferentIcons` is true)

Control flow:
- `showIcon` toggle gates the entire panel (if false, only the toggle is shown).
- `useDifferentIcons` toggle:
  - When turned on: shows "Inactive" and "Active" tabs.
  - When turned off: clears active attributes (`iconActive*`) by setting them to `null`.
- `iconRotation` slider is only shown when `useDifferentIcons` is false.
- `IconPositionControl` uses allowed positions from `control-config-generated.js`.
- `IconPicker` output is `{ kind: "char" | "image" | "library", value: string }`.
- Active tab shows "Preview Open State" toggle that updates `initiallyOpen` for live editor preview.

Important UI vs schema differences:
- IconPanel does not read schema `min/max/step` or `showWhen` for icon controls.
- Slider ranges in IconPanel are hardcoded (e.g., rotation -180..180, offsets -50..50, image size 16..128).
- Schema `showWhen` and `conditionalRender` are still generated, but they only apply if the icon controls are rendered by `ControlRenderer` (not the case for group `icon`).

## 5. IconPicker (selection UI)
File: `shared/src/components/controls/IconPicker.js`.

Output format:
- `kind: "char"` -> `value` is a string character
- `kind: "image"` -> `value` is image URL (from WP Media Library)
- `kind: "library"` -> `value` is `"dashicons:icon-name"` or `"lucide:IconName"`

Tabs:
- Character: text input + quick-pick list (default char is defined in schema)
- Image: WP MediaUpload (stores URL)
- Library: Dashicons + Lucide icons

Styling:
- `shared/src/components/controls/IconPicker.scss` provides grid and tabs styling.

### IconPicker Implementation Details

#### Lucide Icon Filtering
The `getLucideIcons()` function filters Lucide-react exports to show only valid icon components:

```javascript
const getLucideIcons = () => {
  const allKeys = Object.keys( LucideIcons );
  console.log('Total Lucide exports:', allKeys.length);

  const filtered = allKeys.filter(
    ( name ) =>
      // Exclude utility functions
      ! name.startsWith( 'create' ) &&
      name !== 'Icon' &&
      name !== 'default' &&
      // Check if it's a valid React component
      typeof LucideIcons[ name ] === 'function' &&
      // Icon components start with uppercase
      /^[A-Z]/.test( name )
  );

  console.log('Filtered Lucide icons:', filtered.length);
  console.log('Sample icons:', filtered.slice(0, 10));

  return filtered;
};
```

**Filtering Logic:**
- Excludes `createLucideIcon` and other utility functions
- Excludes the base `Icon` component and default exports
- Only includes functions (React components)
- Only includes names starting with uppercase letter (e.g., `ChevronDown`, `Plus`)
- Typically returns 200+ icons

**Console Output:**
When the Library tab is opened, the console logs:
```
Total Lucide exports: 250
Filtered Lucide icons: 234
Sample icons: ['Activity', 'Airplay', 'AlertCircle', 'AlertOctagon', ...]
```

#### Dashicons List
Hardcoded array of 146 commonly used WordPress Dashicons:
```javascript
const DASHICONS = [
  'arrow-down-alt2', 'arrow-right-alt2', 'arrow-up-alt2', 'arrow-left-alt2',
  'arrow-down', 'arrow-right', 'arrow-up', 'arrow-left',
  'plus', 'plus-alt2', 'minus', 'no-alt',
  // ... 134 more icons
];
```

#### LucideIcon Rendering Component
Helper component that renders Lucide icons with error handling:

```javascript
function LucideIcon( { name, size = 24 } ) {
  const IconComponent = LucideIcons[ name ];

  if ( ! IconComponent ) {
    console.warn( `Lucide icon not found: ${name}` );
    return null;
  }

  return <IconComponent size={ size } />;
}
```

**Error Handling:**
- Logs warning if icon component not found
- Returns null to prevent rendering errors
- Accepts dynamic `size` prop (default 24px)

#### LibraryTab Implementation
The Library tab manages icon library selection and rendering:

```javascript
function LibraryTab( { value, onChange } ) {
  const [ search, setSearch ] = useState( '' );
  const [ library, setLibrary ] = useState( 'dashicons' );

  const currentIcon = value?.kind === 'library' ? value.value : '';
  const LUCIDE_ICONS = getLucideIcons();

  const handleSelect = ( iconName ) => {
    onChange( {
      kind: 'library',
      value: `${ library }:${ iconName }`,
    } );
  };

  const filteredIcons =
    library === 'dashicons'
      ? DASHICONS.filter( ( icon ) =>
          icon.toLowerCase().includes( search.toLowerCase() )
        )
      : LUCIDE_ICONS.filter( ( icon ) =>
          icon.toLowerCase().includes( search.toLowerCase() )
        );

  return (
    <div className="icon-picker-library-tab">
      <div className="library-selector">
        <ButtonGroup>
          <Button
            variant={ library === 'dashicons' ? 'primary' : 'secondary' }
            onClick={ () => setLibrary( 'dashicons' ) }
          >
            Dashicons (WP)
          </Button>
          <Button
            variant={ library === 'lucide' ? 'primary' : 'secondary' }
            onClick={ () => setLibrary( 'lucide' ) }
          >
            Lucide Icons
          </Button>
        </ButtonGroup>
      </div>

      <SearchControl
        value={ search }
        onChange={ setSearch }
        placeholder="Search icons..."
      />

      <div className="icon-grid">
        { filteredIcons.slice( 0, 200 ).map( ( iconName ) => {
          const isSelected = currentIcon === `${ library }:${ iconName }`;
          return (
            <button
              key={ iconName }
              className={ `icon-button ${ isSelected ? 'selected' : '' }` }
              onClick={ () => handleSelect( iconName ) }
              title={ iconName }
              type="button"
            >
              { library === 'dashicons' ? (
                <Dashicon icon={ iconName } size={ 24 } />
              ) : (
                <LucideIcon name={ iconName } size={ 24 } />
              ) }
            </button>
          );
        } ) }
      </div>

      { filteredIcons.length === 0 && (
        <p className="no-results">No icons found matching "{ search }"</p>
      ) }
      { filteredIcons.length > 200 && (
        <p className="results-limit">
          Showing first 200 of { filteredIcons.length } results. Try searching
          to narrow down.
        </p>
      ) }
    </div>
  );
}
```

**Key Features:**
- State management for library selection (`dashicons` vs `lucide`)
- Live search filtering (case-insensitive)
- Icon grid rendering (max 200 at once for performance)
- Selected state highlighting
- Empty state and pagination messages

#### Output Value Format
When an icon is selected, the value format is:

```javascript
// Character icon
{ kind: 'char', value: '▾' }

// Image icon
{ kind: 'image', value: 'https://example.com/icon.png' }

// Dashicon
{ kind: 'library', value: 'dashicons:arrow-down-alt2' }

// Lucide icon
{ kind: 'library', value: 'lucide:ChevronDown' }
```

The `kind` determines which controls are shown (color/size for char/library, maxSize for image).

## 6. Responsive Values (icons)

### Storage format (flat base)
Responsive values use a flat object:
```
{
  value: 16,
  unit: "px",
  tablet: { value: 14, unit: "px" },
  mobile: { value: 12, unit: "px" }
}
```
There is no `global` key; the base lives at the root.

### UI mechanics
IconPanel uses `ResponsiveWrapper`:
- Uses global device state from `useResponsiveDevice()`.
- Mobile inherits tablet; tablet inherits base (see `ResponsiveWrapper.js`).
- `setResponsiveValue()` in IconPanel creates/updates the flat structure.
- `getResponsiveValue()` in IconPanel converts strings like `"16px"` to numbers for sliders using `getNumericDefault()`.
- IconPanel does not use the `responsiveEnabled` attribute toggle; responsive editing is always available for icon size/maxSize/offset fields.

### Device state
`shared/src/utils/responsive-device.js` manages global device:
- `window.gutplusDevice` stores `global | tablet | mobile`.
- `setGlobalResponsiveDevice()` dispatches an event and applies iframe width simulation in the editor.

### CSS application
`buildEditorCssVars()` and `buildFrontendCssVars()` emit:
- `--<var>` for base
- `--<var>-tablet` for tablet
- `--<var>-mobile` for mobile

Frontend JS (`blocks/<block>/src/frontend.js`) sets `data-gutplus-device` on the block root based on viewport width. CSS uses `[data-gutplus-device="tablet"]` and `[data-gutplus-device="mobile"]` to select the correct responsive variables.

## 6.5. IconPanel Component Architecture

File: `shared/src/components/controls/IconPanel.js`

The IconPanel component is the main UI container for all icon controls. It has a complex internal structure with conditional rendering based on user selections.

### Component Hierarchy

```
IconPanel (main export)
  └─ PanelBody
      ├─ ToggleControl (Show Icon)
      ├─ IconPositionControl
      ├─ SliderWithInput (Rotation) - always visible when showIcon=true
      ├─ ToggleControl (Different Icons)
      ├─ <hr> divider
      └─ Conditional rendering:
          ├─ If !useDifferentIcons:
          │   └─ SingleIconMode
          │       ├─ IconPicker (inactive)
          │       ├─ ColorControl (inactive, if not image)
          │       ├─ ResponsiveWrapper + SliderWithInput (size/maxSize)
          │       ├─ ResponsiveWrapper + SliderWithInput (offsetX)
          │       └─ ResponsiveWrapper + SliderWithInput (offsetY)
          │
          └─ If useDifferentIcons:
              └─ DualIconMode
                  ├─ ToggleControl (Preview Open State) - OUTSIDE tabs
                  └─ TabPanel
                      ├─ Tab: Inactive (Closed)
                      │   └─ IconStateControls (state="inactive")
                      │       ├─ IconPicker
                      │       ├─ ColorControl (if not image)
                      │       ├─ ResponsiveWrapper + SliderWithInput (size/maxSize)
                      │       ├─ ResponsiveWrapper + SliderWithInput (offsetX)
                      │       └─ ResponsiveWrapper + SliderWithInput (offsetY)
                      │
                      └─ Tab: Active (Open)
                          └─ IconStateControls (state="active")
                              ├─ IconPicker
                              ├─ ColorControl (if not image)
                              ├─ ResponsiveWrapper + SliderWithInput (size/maxSize)
                              ├─ ResponsiveWrapper + SliderWithInput (offsetX)
                              ├─ ResponsiveWrapper + SliderWithInput (offsetY)
                              └─ Fallback message
```

### Main Component: IconPanel

```javascript
export function IconPanel( {
  blockType,
  attributes,
  setAttributes,
  effectiveValues,
  label = 'Icon',
  help,
} ) {
  const currentDevice = useResponsiveDevice();
  const isIconVisible = effectiveValues?.showIcon !== false;
  const [ useDifferentIcons, setUseDifferentIcons ] = useState(
    effectiveValues?.useDifferentIcons || false
  );

  // Sync state with effectiveValues when it changes
  useEffect( () => {
    setUseDifferentIcons( effectiveValues?.useDifferentIcons || false );
  }, [ effectiveValues?.useDifferentIcons ] );

  const handleChange = ( updates ) => {
    setAttributes( updates );
  };

  // If icon is hidden, show only the toggle
  if ( ! isIconVisible ) {
    return (
      <PanelBody title={ label } initialOpen={ false }>
        <ToggleControl
          label="Show Icon"
          checked={ false }
          onChange={ ( checked ) => handleChange( { showIcon: checked } ) }
          help="Display expand/collapse icon"
          __nextHasNoMarginBottom
        />
      </PanelBody>
    );
  }

  return (
    <PanelBody title={ label } initialOpen={ false }>
      {/* Show Icon Toggle */}
      <ToggleControl
        label="Show Icon"
        checked={ isIconVisible }
        onChange={ ( checked ) => handleChange( { showIcon: checked } ) }
        help="Display expand/collapse icon"
        __nextHasNoMarginBottom
      />

      {/* Icon Position */}
      <div style={ { marginTop: '16px', marginBottom: '16px' } }>
        <IconPositionControl
          label="Icon Position"
          value={ effectiveValues?.iconPosition || 'right' }
          onChange={ ( position ) => handleChange( { iconPosition: position } ) }
          blockType={ blockType }
        />
      </div>

      {/* Different Icons Toggle */}
      <ToggleControl
        label="Different icons for active state"
        checked={ useDifferentIcons }
        onChange={ ( checked ) => {
          setUseDifferentIcons( checked );
          handleChange( { useDifferentIcons: checked } );
          if ( ! checked ) {
            // Clear active state attributes
            handleChange( {
              useDifferentIcons: false,
              iconActiveSource: null,
              iconActiveColor: null,
              iconActiveSize: null,
              iconActiveMaxSize: null,
              iconActiveOffsetX: null,
              iconActiveOffsetY: null,
            } );
          }
        } }
        help="Use separate icon when accordion/tab is open"
        __nextHasNoMarginBottom
      />

      {/* Rotation Slider - Always visible when icon is shown */}
      <div style={ { marginTop: '16px', marginBottom: '16px' } }>
        <SliderWithInput
          label="Rotation Angle"
          value={ parseValueWithUnit( effectiveValues?.iconRotation || '180deg' ) }
          onChange={ ( val ) => {
            const valueStr = typeof val === 'object' && val.value !== undefined
              ? `${ val.value }${ val.unit || 'deg' }`
              : `${ val }deg`;
            handleChange( { iconRotation: valueStr } );
          } }
          min={ -180 }
          max={ 180 }
          step={ 1 }
          units={ [ 'deg' ] }
          help={ useDifferentIcons
            ? "Rotation applied to both icons during transition"
            : "Rotation applied when open"
          }
          responsive={ false }
          canBeResponsive={ false }
        />
      </div>

      <hr style={ { margin: '16px 0', borderTop: '1px solid #ddd' } } />

      {/* Single Icon Mode OR Inactive/Active Tabs */}
      { ! useDifferentIcons ? (
        <SingleIconMode
          attributes={ attributes }
          effectiveValues={ effectiveValues }
          onChange={ handleChange }
          currentDevice={ currentDevice }
          blockType={ blockType }
        />
      ) : (
        <DualIconMode
          attributes={ attributes }
          effectiveValues={ effectiveValues }
          onChange={ handleChange }
          currentDevice={ currentDevice }
          blockType={ blockType }
        />
      ) }
    </PanelBody>
  );
}
```

**Key Features:**
- Early return if icon is hidden (shows only toggle)
- State management for `useDifferentIcons` with sync to `effectiveValues`
- Clears all active attributes when switching from dual to single mode
- Rotation control always visible (help text changes based on mode)
- Conditional rendering of SingleIconMode vs DualIconMode

### SingleIconMode Component

Renders controls for a single icon (rotation handles state change):

```javascript
function SingleIconMode( { attributes, effectiveValues, onChange, currentDevice, blockType } ) {
  const iconSource = effectiveValues?.iconInactiveSource || { kind: 'char', value: '▾' };
  const isImage = iconSource.kind === 'image';

  return (
    <div className="single-icon-mode">
      <h4 style={ { margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600 } }>
        Icon Settings
      </h4>

      {/* Icon Picker */}
      <IconPicker
        label="Icon"
        value={ iconSource }
        onChange={ ( newSource ) => onChange( { iconInactiveSource: newSource } ) }
      />

      {/* Color (only for char/library) */}
      { ! isImage && (
        <div style={ { marginTop: '16px' } }>
          <ColorControl
            label="Icon Color"
            value={ effectiveValues?.iconInactiveColor || '#666666' }
            onChange={ ( color ) => onChange( { iconInactiveColor: color } ) }
          />
        </div>
      ) }

      {/* Size (char/library) or MaxSize (image) - responsive */}
      {/* ResponsiveWrapper + SliderWithInput for size/maxSize */}
      {/* ResponsiveWrapper + SliderWithInput for offsetX */}
      {/* ResponsiveWrapper + SliderWithInput for offsetY */}
    </div>
  );
}
```

**Key Features:**
- Uses only `iconInactive*` attributes
- Conditional color control (hidden for images)
- Conditional size control (size for char/library, maxSize for images)
- All size/offset controls wrapped in ResponsiveWrapper

### DualIconMode Component

Renders tabs for inactive and active states with preview toggle:

```javascript
function DualIconMode( { attributes, effectiveValues, onChange, currentDevice, blockType } ) {
  const tabs = [
    { name: 'inactive', title: 'Inactive (Closed)' },
    { name: 'active', title: 'Active (Open)' },
  ];

  return (
    <div className="dual-icon-mode">
      {/* Preview Open State Toggle - OUTSIDE tabs */}
      <div style={ { marginBottom: '16px', padding: '12px', backgroundColor: '#f0f0f1', borderRadius: '4px' } }>
        <ToggleControl
          label="Preview Open State"
          checked={ effectiveValues?.initiallyOpen || false }
          onChange={ ( checked ) => onChange( { initiallyOpen: checked } ) }
          help="Toggle to preview the open/active icon in the editor"
          __nextHasNoMarginBottom
        />
      </div>

      {/* Inactive/Active Tabs */}
      <TabPanel
        className="icon-state-tabs"
        tabs={ tabs }
        initialTabName="inactive"
      >
        { ( tab ) => (
          <IconStateControls
            state={ tab.name }
            attributes={ attributes }
            effectiveValues={ effectiveValues }
            onChange={ onChange }
            currentDevice={ currentDevice }
            blockType={ blockType }
          />
        ) }
      </TabPanel>
    </div>
  );
}
```

**Key Features:**
- Preview toggle appears ABOVE the tabs (not inside)
- Two tabs: Inactive (Closed) and Active (Open)
- Both tabs render IconStateControls with different state parameter

### IconStateControls Component

Renders icon controls for a specific state (inactive or active):

```javascript
function IconStateControls( { state, attributes, effectiveValues, onChange, currentDevice, blockType } ) {
  const prefix = state === 'inactive' ? 'iconInactive' : 'iconActive';
  const iconSource = effectiveValues?.[ `${ prefix }Source` ] || { kind: 'char', value: '▾' };
  const isImage = iconSource.kind === 'image';

  return (
    <div className={ `icon-state-${ state }` } style={ { marginTop: '16px' } }>
      {/* Icon Picker */}
      <IconPicker
        label={ `${ state === 'inactive' ? 'Closed' : 'Open' } Icon` }
        value={ iconSource }
        onChange={ ( newSource ) => onChange( { [ `${ prefix }Source` ]: newSource } ) }
      />

      {/* Color (only for char/library) */}
      { ! isImage && (
        <div style={ { marginTop: '16px' } }>
          <ColorControl
            label="Icon Color"
            value={ effectiveValues?.[ `${ prefix }Color` ] || '#666666' }
            onChange={ ( color ) => onChange( { [ `${ prefix }Color` ]: color } ) }
          />
        </div>
      ) }

      {/* Size/MaxSize (responsive) */}
      {/* OffsetX (responsive) */}
      {/* OffsetY (responsive) */}

      {/* Active state fallback message */}
      { state === 'active' && (
        <p
          className="description"
          style={ {
            fontSize: '12px',
            color: '#666',
            marginTop: '16px',
            fontStyle: 'italic',
          } }
        >
          Active values fallback to inactive values if not set.
        </p>
      ) }
    </div>
  );
}
```

**Key Features:**
- Dynamic attribute prefix based on state (iconInactive vs iconActive)
- Same controls for both states
- Fallback message shown only in active tab
- No preview toggle here (moved to DualIconMode)

### Responsive Value Helpers

IconPanel includes utility functions for managing responsive values:

```javascript
// Get responsive value for current device with inheritance
function getResponsiveValue( value, device ) {
  if ( value === null || value === undefined ) return 0;
  if ( typeof value !== 'object' ) return getNumericDefault( value );

  const baseValue = getBaseValue( value );
  const tabletValue = value.tablet;
  const mobileValue = value.mobile;

  switch ( device ) {
    case 'global':
      return getNumericDefault( baseValue );
    case 'tablet':
      return getNumericDefault( tabletValue !== undefined ? tabletValue : baseValue );
    case 'mobile':
      return getNumericDefault( mobileValue !== undefined ? mobileValue : ( tabletValue !== undefined ? tabletValue : baseValue ) );
    default:
      return 0;
  }
}

// Set responsive value for specific device
function setResponsiveValue( currentValue, device, newValue ) {
  if ( device === 'global' ) {
    if ( ! currentValue || typeof currentValue !== 'object' || ! ( 'tablet' in currentValue || 'mobile' in currentValue ) ) {
      return newValue;
    }
    const { tablet, mobile } = currentValue;
    const result = { ...parseValueWithUnit( newValue ) };
    if ( tablet !== undefined ) result.tablet = tablet;
    if ( mobile !== undefined ) result.mobile = mobile;
    return result;
  }

  if ( ! currentValue || typeof currentValue !== 'object' ) {
    return {
      ...parseValueWithUnit( currentValue || '0px' ),
      [ device ]: parseValueWithUnit( newValue ),
    };
  }

  const { tablet, mobile, ...base } = currentValue;
  const result = { ...base };
  if ( tablet !== undefined && device !== 'tablet' ) result.tablet = tablet;
  if ( mobile !== undefined && device !== 'mobile' ) result.mobile = mobile;
  result[ device ] = parseValueWithUnit( newValue );
  return result;
}

// Parse value with unit into object
function parseValueWithUnit( value ) {
  if ( typeof value === 'string' ) {
    const match = value.match( /^([0-9.]+)(.*)$/ );
    if ( match ) {
      return { value: parseFloat( match[ 1 ] ), unit: match[ 2 ] || '' };
    }
  }
  if ( typeof value === 'number' ) {
    return { value, unit: 'px' };
  }
  return value;
}
```

**Key Features:**
- Device inheritance: mobile → tablet → global
- Preserves existing device overrides when updating base
- Converts between string formats ("16px") and object formats ({value: 16, unit: "px"})

## 7. Theming and Cascade (how values become CSS)

Editor:
- `useThemeManager()` computes `expectedValues` = defaults + theme.
- Block `attributes` remain the source of truth in the editor.
- `customizations` is auto-updated to contain only values that differ from the expected theme.

Save (frontend):
- `getAllEffectiveValues(attributes, {}, defaults)` merges attributes with defaults.
- `buildFrontendCssVars(customizations, attributes)` outputs CSS vars only for customized values.
- CSS vars are applied inline on the block root.

Important: Icon attributes are `themeable: true` in schema, so they participate in theme deltas and the `customizations` snapshot.

## 8. CSS Variables and Icon Styling

Icon-related CSS vars (accordion):
- `--accordion-icon-display` (from `showIcon`)
- `--accordion-icon-rotation` (from `iconRotation`)
- `--accordion-icon-color` (inactive color)
- `--accordion-icon-size` (inactive size)
- `--accordion-icon-max-size` (inactive image max size)
- `--accordion-icon-offset-x`, `--accordion-icon-offset-y`
- `--accordion-icon-active-color`
- `--accordion-icon-active-size`
- `--accordion-icon-active-max-size`
- `--accordion-icon-active-offset-x`, `--accordion-icon-active-offset-y`

Frontend CSS uses these in `blocks/accordion/src/style.scss`:
- `.accordion-icon-wrapper` uses `--accordion-icon-display` and offsets.
- `.accordion-icon` uses `--accordion-icon-color`, `--accordion-icon-size`.
- `.gutplus-accordion.is-open` swaps to active vars where available.

Editor styling for the panel UI (tabs and icon grid) is defined in:
- `shared/src/components/controls/SidebarStyling.scss`
- `shared/src/components/controls/IconPicker.scss`

## 9. Runtime Rendering (where attributes are used)

Editor markup:
- `blocks/<block>/src/edit.js` renders icons using `iconInactiveSource` and `iconActiveSource`.
- Live preview uses `initiallyOpen` for open/closed state.

Save markup:
- `blocks/<block>/src/save.js` renders the initial icon and attaches data attributes:
  - `data-icon-inactive`, `data-icon-active`, `data-has-different-icons`
- `blocks/<block>/src/frontend.js` toggles `is-open` class and handles rotation/state.

## 10. Diagram (compile-time + runtime)
```
schemas/*.json (icon-panel macro)
  |
  | npm run schema:build
  v
build-tools/schema-compiler.js
  - processAttributes -> expandIconPanelMacro
  - generate artifacts
  |
  +--> schemas/expanded/*-expanded.json
  +--> blocks/*/src/*-attributes.js
  +--> shared/src/config/control-config-generated.js
  +--> shared/src/config/css-var-mappings-generated.js
  +--> shared/src/styles/*-css-vars-generated.js
  |
Editor runtime:
  blocks/*/src/edit.js
    -> TabbedInspector
    -> AppearancePanels
    -> SchemaPanels (group "icon")
    -> IconPanel
       -> IconPicker / ColorControl / SliderWithInput / ResponsiveWrapper
       -> setAttributes (icon* values)
       -> useThemeManager updates customizations
       -> buildEditorCssVars -> inline CSS vars
Frontend runtime:
  blocks/*/src/save.js
    -> renders markup + data attributes + inline CSS vars
  blocks/*/src/style.scss
    -> uses CSS vars for icon display/size/color/offset
  blocks/*/src/frontend.js
    -> toggles is-open + updates data-gutplus-device
```

---

## Document History and References

### Recent Updates

**2026-01-01 - Comprehensive Implementation Details Added:**
- Added detailed IconPicker implementation section (5.1)
  - Lucide icon filtering logic with actual code
  - LucideIcon component implementation
  - LibraryTab implementation details
  - Output value format examples
- Added IconPanel Component Architecture section (6.5)
  - Complete component hierarchy diagram
  - Full source code for all components (IconPanel, SingleIconMode, DualIconMode, IconStateControls)
  - Responsive value helper functions implementation
- Added Schema Compiler showWhen Logic section (2.1)
  - Detailed showWhen generation rules
  - Explanation of inactive vs active showWhen differences
  - Important clarification: showWhen is metadata, not enforced by IconPanel
  - Complete example of all showWhen conditions for accordion
- Updated "Known gaps" section - marked all three gaps as FIXED with date

**Purpose of Updates:**
These additions ensure developers can understand the full Icon Panel implementation without needing to explore beyond this document. All critical implementation details are now documented with actual code examples.

### Related Documentation

- `docs/ICON_PANEL_FIXES_IMPLEMENTATION_PLAN.md` - Implementation plan for fixing the three known gaps (2026-01-01)
- `CLAUDE.md` - Overall project architecture and schema-first development approach
- `docs/accordion-attributes.md` - Auto-generated attribute documentation (includes icon attributes)
- `docs/tabs-attributes.md` - Auto-generated attribute documentation for tabs block
- `docs/toc-attributes.md` - Auto-generated attribute documentation for TOC block

### Key Insights from Implementation Exploration

1. **showWhen is Documentation, Not Enforcement:**
   - Schema showWhen conditions document intended visibility behavior
   - IconPanel implements its own visibility logic (doesn't read schema showWhen)
   - This separation allows IconPanel's complex UI (tabs, nested controls) to function independently

2. **Component Architecture is Modular:**
   - IconPanel → SingleIconMode/DualIconMode → IconStateControls
   - Each component handles its own state management and rendering
   - Responsive values use helper functions (getResponsiveValue, setResponsiveValue)

3. **Icon Library Integration:**
   - Dashicons: Hardcoded array of 146 icons
   - Lucide: Dynamic filtering from lucide-react exports (200+ icons)
   - Filtering logic crucial for performance and avoiding utility exports

4. **Rotation Behavior:**
   - Always visible when icon is shown (regardless of single/dual mode)
   - Help text changes based on mode for clarity
   - Originally incorrectly hidden in dual icon mode (fixed 2026-01-01)

5. **Preview Toggle Placement:**
   - Must be outside tabs for intuitive UX
   - Controls `initiallyOpen` attribute for editor preview
   - Originally misplaced inside Active tab (fixed 2026-01-01)

---

## Troubleshooting Common Issues

### Lucide Icons Not Appearing
**Symptoms:** Library picker shows empty list when "Lucide Icons" is selected

**Diagnosis:**
- Check browser console for log messages: "Total Lucide exports: X", "Filtered Lucide icons: Y"
- If filtered count is 0, the filter logic is too restrictive
- If no logs appear, getLucideIcons() isn't being called

**Solution:**
- Ensure lucide-react is installed: `npm install lucide-react`
- Verify import statement: `import * as LucideIcons from 'lucide-react';`
- Check filter includes uppercase check: `/^[A-Z]/.test(name)`
- Rebuild: `npm run build`

### Preview Toggle Not Working
**Symptoms:** Toggle exists but doesn't update editor preview

**Diagnosis:**
- Verify toggle updates `initiallyOpen` attribute
- Check if `effectiveValues?.initiallyOpen` is being used in edit.js
- Confirm block rerenders when `initiallyOpen` changes

**Solution:**
- Ensure onChange calls `onChange({ initiallyOpen: checked })`
- Verify edit.js reads `attributes.initiallyOpen` for preview state
- Check theme cascade isn't overriding the value

### Rotation Not Applying
**Symptoms:** Rotation slider visible but icon doesn't rotate

**Diagnosis:**
- Check CSS variable is being generated: `--accordion-icon-rotation`
- Verify frontend.js applies rotation on state change
- Confirm CSS transform property uses the variable

**Solution:**
- Run `npm run schema:build` to regenerate CSS mappings
- Verify style.scss uses `transform: rotate(var(--accordion-icon-rotation))`
- Check frontend.js toggles classes correctly

---

**Document Version:** 2.0 (Updated 2026-01-01)
**Maintained by:** Development Team
**Last Comprehensive Update:** 2026-01-01
