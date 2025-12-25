# Sidebar Implementation Plan

## Overview

This plan transforms the accordion sidebar into a modern, schema-driven system with:
- **Two main tabs**: Settings and Appearance (with icons)
- **Subgroup dropdowns**: Native WordPress ToolsPanel pattern for section switching
- **Modular controls**: Reusable components shared across all blocks
- **Schema-first**: All UI auto-generated from schema metadata

---

## Phase 1: Schema Structure Updates

### 1.1 Add Tab Support to Groups

Update `accordion.json` groups to include `tab` property:

```json
"groups": {
  "blockOptions": {
    "title": "Block Options",
    "tab": "settings",
    "order": 1
  },
  "borders": {
    "title": "Borders",
    "tab": "appearance",
    "icon": "border",
    "order": 1,
    "subgroups": ["external", "divider"]
  },
  "colors": {
    "title": "Colors",
    "tab": "appearance",
    "icon": "color",
    "order": 2,
    "subgroups": ["header", "panel"]
  },
  "typography": {
    "title": "Typography",
    "tab": "appearance",
    "icon": "typography",
    "order": 3,
    "subgroups": ["header", "headerHover", "content"]
  },
  "icon": {
    "title": "Icon",
    "tab": "appearance",
    "icon": "star",
    "order": 4
  },
  "animation": {
    "title": "Animation",
    "tab": "appearance",
    "icon": "animation",
    "order": 5
  }
}
```

### 1.2 Add Subgroup Metadata to Attributes

Each attribute gets a `subgroup` property when applicable:

```json
"borderColor": {
  "type": "string",
  "default": "#dddddd",
  "group": "borders",
  "subgroup": "external",
  "control": "ColorPicker",
  ...
}
```

### 1.3 New Attributes to Add

#### Content Typography (inherits from WordPress defaults)
```json
"contentFontSize": { "default": "inherit", "subgroup": "content" },
"contentFontWeight": { "default": "inherit", "subgroup": "content" },
"contentFontStyle": { "default": "inherit", "subgroup": "content" },
"contentTextTransform": { "default": "inherit", "subgroup": "content" },
"contentTextDecoration": { "default": "inherit", "subgroup": "content" },
"contentLineHeight": { "default": "inherit", "subgroup": "content" },
"contentLetterSpacing": { "default": "inherit", "subgroup": "content" }
```

#### Header Hover Typography (inherits from header normal)
```json
"hoverTitleFontSize": { "default": "inherit", "subgroup": "headerHover" },
"hoverTitleFontWeight": { "default": "inherit", "subgroup": "headerHover" },
"hoverTitleFontStyle": { "default": "inherit", "subgroup": "headerHover" },
"hoverTitleTextTransform": { "default": "inherit", "subgroup": "headerHover" },
"hoverTitleTextDecoration": { "default": "inherit", "subgroup": "headerHover" },
"hoverTitleLineHeight": { "default": "inherit", "subgroup": "headerHover" },
"hoverTitleLetterSpacing": { "default": "inherit", "subgroup": "headerHover" }
```

#### Spacing Attributes
```json
"headerPadding": {
  "type": "object",
  "default": { "top": 16, "right": 20, "bottom": 16, "left": 20, "linked": true },
  "group": "borders",
  "subgroup": "external",
  "control": "BoxControl",
  "units": ["px", "em", "rem"]
},
"contentPadding": {
  "type": "object",
  "default": { "top": 20, "right": 20, "bottom": 20, "left": 20, "linked": true },
  "group": "panelAppearance",
  "control": "BoxControl"
},
"blockMargin": {
  "type": "object",
  "default": { "top": 0, "right": "auto", "bottom": 0, "left": "auto", "linked": false },
  "group": "blockOptions",
  "control": "BoxControl"
}
```

#### Border Width as Object (linked/unlinked)
```json
"borderWidth": {
  "type": "object",
  "default": { "top": 1, "right": 1, "bottom": 1, "left": 1, "linked": true },
  "control": "BoxControl",
  "min": 0,
  "max": 20,
  "units": ["px", "em", "rem"]
}
```

#### Shadow Presets
```json
"shadow": {
  "type": "string",
  "default": "none",
  "control": "ShadowPresetControl",
  "presets": [
    { "name": "none", "value": "none" },
    { "name": "subtle", "value": "0 1px 3px rgba(0,0,0,0.12)" },
    { "name": "medium", "value": "0 4px 6px rgba(0,0,0,0.15)" },
    { "name": "strong", "value": "0 10px 20px rgba(0,0,0,0.2)" },
    { "name": "heavy", "value": "0 15px 35px rgba(0,0,0,0.25)" }
  ]
},
"shadowColor": {
  "type": "string",
  "default": "rgba(0,0,0,0.15)",
  "control": "ColorPicker"
}
```

#### Gradient Support for Backgrounds
```json
"titleBackgroundType": {
  "type": "string",
  "default": "color",
  "control": "BackgroundTypeControl",
  "options": ["color", "gradient"]
},
"titleBackgroundGradient": {
  "type": "string",
  "default": "",
  "control": "GradientPicker",
  "showWhen": { "titleBackgroundType": ["gradient"] }
}
```

#### Animation Attributes
```json
"animationType": {
  "type": "string",
  "default": "slide",
  "group": "animation",
  "control": "SelectControl",
  "options": ["none", "slide", "fade", "slideFade"]
},
"animationDuration": {
  "type": "number",
  "default": 300,
  "group": "animation",
  "control": "RangeControl",
  "min": 0,
  "max": 1000,
  "step": 50,
  "unit": "ms"
},
"animationEasing": {
  "type": "string",
  "default": "ease",
  "group": "animation",
  "control": "SelectControl",
  "options": [
    { "label": "Ease", "value": "ease" },
    { "label": "Ease In", "value": "ease-in" },
    { "label": "Ease Out", "value": "ease-out" },
    { "label": "Ease In-Out", "value": "ease-in-out" },
    { "label": "Linear", "value": "linear" },
    { "label": "Bounce", "value": "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }
  ]
}
```

#### Icon Picker Enhancements
```json
"iconSource": {
  "type": "string",
  "default": "character",
  "control": "SelectControl",
  "options": ["character", "bootstrap", "dashicons", "url"]
},
"iconTypeClosed": {
  "type": "string",
  "default": "▾",
  "control": "IconPickerControl"
},
"useOpenIcon": {
  "type": "boolean",
  "default": false,
  "control": "ToggleControl",
  "label": "Change icon when active"
}
```

---

## Phase 2: Shared Control Components

Create modular, reusable controls in `shared/src/components/controls/`:

### 2.1 Component Hierarchy

```
shared/src/components/controls/
├── index.js                    # Export all controls
├── BoxControl.js               # Linked/unlinked 4-side input (padding, margin, border-width)
├── BorderStyleControl.js       # 7 icon buttons for border styles
├── ShadowPresetControl.js      # Preset buttons + color picker
├── TypographyControl.js        # Combined typography panel
├── IconPickerControl.js        # Bootstrap + Dashicons + URL picker
├── AnimationControl.js         # Animation presets + duration + easing
├── BackgroundControl.js        # Color/Gradient switcher using WP native
├── ResponsiveWrapper.js        # Desktop/Tablet/Mobile device switcher
└── ResetButton.js              # Reusable reset icon button
```

### 2.2 BoxControl Component

Handles linked/unlinked 4-side controls for padding, margin, border-width, border-radius.

**Features:**
- Link icon to toggle all-sides-sync
- When linked: single slider controls all
- When unlinked: 4 individual inputs (Top, Right, Bottom, Left)
- Unit selector (px, em, rem)
- Reset button

**Schema interface:**
```json
{
  "type": "object",
  "default": { "top": 0, "right": 0, "bottom": 0, "left": 0, "linked": true },
  "control": "BoxControl",
  "units": ["px", "em", "rem"],
  "min": 0,
  "max": 100
}
```

**Stored value:**
```json
{ "top": 16, "right": 20, "bottom": 16, "left": 20, "linked": true, "unit": "px" }
```

### 2.3 BorderStyleControl Component

7 icon buttons for border style selection.

**Icons (SVG):**
1. None (dashed box with X)
2. Solid (solid line)
3. Dashed (dashed line)
4. Dotted (dotted line)
5. Double (double line)
6. Groove (3D groove effect)
7. Ridge (3D ridge effect)

**Props:**
```js
<BorderStyleControl
  value={borderStyle}
  onChange={(style) => setAttributes({ borderStyle: style })}
/>
```

### 2.4 ShadowPresetControl Component

4 preset buttons (SVG icons showing shadow intensity) + none + color picker.

**Presets:**
1. None - no shadow
2. Subtle - `0 1px 3px rgba(0,0,0,0.12)`
3. Medium - `0 4px 6px rgba(0,0,0,0.15)`
4. Strong - `0 10px 20px rgba(0,0,0,0.2)`
5. Heavy - `0 15px 35px rgba(0,0,0,0.25)`

**Color picker:** Updates the rgba color in the shadow value dynamically.

### 2.5 TypographyControl Component

Complete typography panel with all font controls.

**Controls:**
- Font Size (RangeControl with unit selector)
- Font Family (dropdown with system fonts + Google Fonts option)
- Font Weight (dropdown: 100-900, normal, bold)
- Font Style (icon buttons: Normal, Italic, Oblique)
- Text Decoration (icon buttons: None, Underline, Overline, Line-through)
- Text Transform (icon buttons: None, Uppercase, Lowercase, Capitalize)
- Line Height (RangeControl or unitless number)
- Letter Spacing (RangeControl with px/em)

**Icon buttons pattern:**
Each icon button shows a visual example of the style (like "A" with underline for text-decoration).

### 2.6 IconPickerControl Component

Multi-source icon picker.

**Sources:**
1. **Character** - Text input for Unicode characters (▾, ▸, +, −, etc.)
2. **Bootstrap Icons** - Modal with searchable icon grid (requires enqueuing Bootstrap Icons CSS)
3. **Dashicons** - Modal with WordPress dashicons grid
4. **URL** - Text input for custom image URL

**UI Flow:**
1. Source selector (tabs or dropdown)
2. Based on source, show appropriate picker
3. Preview of selected icon

### 2.7 BackgroundControl Component

Uses WordPress native GradientPicker.

**UI:**
- Toggle: Color | Gradient
- If Color: ColorPicker
- If Gradient: WordPress GradientPicker with presets

**Reference:** `import { GradientPicker } from '@wordpress/components'`

### 2.8 AnimationControl Component

Combined control for animation settings.

**Controls:**
- Animation Type (SelectControl): None, Slide, Fade, Slide+Fade
- Duration (RangeControl): 0-1000ms
- Easing (SelectControl): ease, ease-in, ease-out, ease-in-out, linear, bounce

**Preview:** Small animation preview showing the effect.

---

## Phase 3: Sidebar Structure Components

### 3.1 TabbedInspector Component

Main wrapper that creates Settings/Appearance tabs.

**Location:** `shared/src/components/TabbedInspector.js`

**Implementation:**
```jsx
import { TabPanel } from '@wordpress/components';
import { settings, brush } from '@wordpress/icons';

export function TabbedInspector({ children, settingsContent, appearanceContent }) {
  return (
    <TabPanel
      className="gutplus-inspector-tabs"
      tabs={[
        { name: 'settings', title: 'Settings', icon: settings },
        { name: 'appearance', title: 'Appearance', icon: brush },
      ]}
    >
      {(tab) => (
        tab.name === 'settings' ? settingsContent : appearanceContent
      )}
    </TabPanel>
  );
}
```

### 3.2 SubgroupPanel Component

Panel with dropdown menu for subgroup selection.

**Location:** `shared/src/components/SubgroupPanel.js`

**Uses WordPress native pattern:**
- `ToolsPanel` with `ToolsPanelItem` for the dropdown
- `DropdownMenu` or `MenuGroup` for subgroup selection
- Renders only controls matching selected subgroup

**UI:**
```
┌─────────────────────────────────────┐
│ Borders                    [•••] ▼  │
├─────────────────────────────────────┤
│  ○ External Borders                 │  ← Dropdown menu
│  ○ Divider Border                   │
├─────────────────────────────────────┤
│ [Controls for selected subgroup]    │
└─────────────────────────────────────┘
```

### 3.3 Updated SchemaPanels Component

Modify to support:
1. Tab filtering (only render groups matching current tab)
2. Subgroup panels (use SubgroupPanel when group has subgroups)
3. Pass tab context to children

---

## Phase 4: Responsive Controls

### 4.1 Attributes That Need Responsive Support

Based on what makes sense when changing screen size:

| Attribute | Responsive? | Reason |
|-----------|-------------|--------|
| `titleFontSize` | Yes | Typography should adapt to screen |
| `contentFontSize` | Yes | Typography should adapt to screen |
| `headerPadding` | Yes | Spacing needs adjustment |
| `contentPadding` | Yes | Spacing needs adjustment |
| `blockMargin` | Yes | Layout spacing |
| `accordionWidth` | Yes | Container width |
| `iconSize` | Yes | Icon may need to be smaller on mobile |

### 4.2 Responsive Attribute Schema Pattern

```json
"titleFontSize": {
  "type": "object",
  "default": {
    "desktop": 1.125,
    "tablet": 1,
    "mobile": 0.9
  },
  "responsive": true,
  "control": "RangeControl",
  "unit": "rem"
}
```

### 4.3 ResponsiveWrapper Component

Wraps any control with device switcher.

```jsx
<ResponsiveWrapper
  attribute="titleFontSize"
  value={attributes.titleFontSize}
  onChange={(device, value) => {
    setAttributes({
      titleFontSize: { ...attributes.titleFontSize, [device]: value }
    });
  }}
>
  {(currentValue, device) => (
    <RangeControl
      value={currentValue}
      onChange={(v) => handleChange(device, v)}
    />
  )}
</ResponsiveWrapper>
```

---

## Phase 5: Icon Libraries Integration

### 5.1 Bootstrap Icons

**Setup:**
1. Download Bootstrap Icons CSS to `assets/css/bootstrap-icons.min.css`
2. Download fonts to `assets/fonts/`
3. Enqueue in PHP for editor and frontend

**Usage:**
```jsx
<i className="bi bi-chevron-down" />
```

### 5.2 Dashicons

Already available in WordPress, just use:
```jsx
import { Icon, chevronDown } from '@wordpress/icons';
<Icon icon={chevronDown} />
```

Or dashicons class:
```jsx
<span className="dashicons dashicons-arrow-down" />
```

### 5.3 Icon Picker Modal

Modal with:
- Search input
- Grid of icons (paginated or virtualized for performance)
- Click to select
- Preview of selection

---

## Phase 6: Implementation Order

### Step 1: Schema Updates (Foundation)
1. Add `tab` property to all groups
2. Add `subgroup` property to relevant attributes
3. Add new attributes (typography, spacing, animation, shadows)
4. Run `npm run schema:build` to regenerate files

### Step 2: Base Control Components
1. `ResetButton` - simple, used everywhere
2. `BoxControl` - used by many controls
3. `BorderStyleControl` - specific to borders
4. `ShadowPresetControl` - specific to shadows

### Step 3: Typography Controls
1. `TypographyControl` - combines all font controls
2. Add icon buttons for font style, decoration, transform

### Step 4: Icon Picker
1. Enqueue Bootstrap Icons
2. Build `IconPickerControl` with multi-source support
3. Build icon modal with search

### Step 5: Animation Control
1. `AnimationControl` component
2. Frontend CSS for animations
3. Frontend JS for animation triggering

### Step 6: Sidebar Structure
1. `TabbedInspector` - tabs wrapper
2. `SubgroupPanel` - dropdown panels
3. Update `SchemaPanels` and `GenericPanel`

### Step 7: Responsive System
1. `ResponsiveWrapper` component
2. Update schema for responsive attributes
3. Update CSS generation for responsive values

### Step 8: Integration & Testing
1. Update `edit.js` to use new components
2. Update `save.js` and `frontend.js` for new attributes
3. Test all controls
4. Test theme system with new attributes

---

## File Changes Summary

### New Files
```
shared/src/components/controls/
├── index.js
├── BoxControl.js
├── BorderStyleControl.js
├── ShadowPresetControl.js
├── TypographyControl.js
├── IconPickerControl.js
├── AnimationControl.js
├── BackgroundControl.js
├── ResponsiveWrapper.js
└── ResetButton.js

shared/src/components/
├── TabbedInspector.js
├── SubgroupPanel.js

assets/css/
├── bootstrap-icons.min.css
├── controls.css (styling for custom controls)

assets/fonts/
└── bootstrap-icons.woff2
```

### Modified Files
```
schemas/accordion.json          # Add tabs, subgroups, new attributes
shared/src/components/SchemaPanels.js   # Tab filtering, subgroup support
shared/src/components/GenericPanel.js   # New control types
blocks/accordion/src/edit.js    # Use TabbedInspector
blocks/accordion/src/save.js    # New attributes in output
blocks/accordion/src/frontend.js # Animation logic
blocks/accordion/src/style.scss  # New CSS variables
build-tools/schema-compiler.js  # Handle new schema features
```

---

## UI Mockup

```
┌─────────────────────────────────────────┐
│ Theme: [Default ▼] [Save] [Reset]       │  ← Always visible
├─────────────────────────────────────────┤
│ [⚙ Settings] [🎨 Appearance]            │  ← Tabs
├─────────────────────────────────────────┤
│                                         │
│ SETTINGS TAB:                           │
│ ┌─────────────────────────────────────┐ │
│ │ Block Options                    [▼]│ │
│ │                                     │ │
│ │ Block Width                         │ │
│ │ [100%                            ]  │ │
│ │                                     │ │
│ │ Heading Level                       │ │
│ │ [None ▼]                            │ │
│ │                                     │ │
│ │ Block Alignment                     │ │
│ │ [←] [↔] [→]                         │ │
│ │                                     │ │
│ │ ☐ Open by Default                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ APPEARANCE TAB:                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔲 Borders                   [•••]▼ │ │
│ │   ├─ External Borders               │ │
│ │   └─ Divider Border                 │ │
│ ├─────────────────────────────────────┤ │
│ │ Color [■]  (reset)                  │ │
│ │                                     │ │
│ │ Border Style                        │ │
│ │ [╳][━][┅][┄][═][▓][░]               │ │
│ │                                     │ │
│ │ Border Width    [🔗]   [PX][EM][REM]│ │
│ │ |━━━━━○━━━━━━━━━━| 4                │ │
│ │                                     │ │
│ │ Border Radius   [🔗]                │ │
│ │ |━━━━━○━━━━━━━━━━| 4                │ │
│ │                                     │ │
│ │ Shadow Preset                       │ │
│ │ [◯][▪][▪▪][▪▪▪][▪▪▪▪]   Color [■]  │ │
│ │                                     │ │
│ │ Padding         [🔗]                │ │
│ │ [ 16 ][ 20 ][ 16 ][ 20 ]            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🎨 Colors                    [•••]▼ │ │
│ │   ├─ Header                         │ │
│ │   └─ Panel                          │ │
│ ├─────────────────────────────────────┤ │
│ │ Header Text    [■] (reset)          │ │
│ │ Header BG      [Color|Gradient] [■] │ │
│ │ Hover Text     [■] (reset)          │ │
│ │ Hover BG       [■] (reset)          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📝 Typography                [•••]▼ │ │
│ │   ├─ Header                         │ │
│ │   ├─ Header Hover                   │ │
│ │   └─ Content                        │ │
│ ├─────────────────────────────────────┤ │
│ │ Font Size  [D][T][M]    (reset)     │ │
│ │ |━━━━━○━━━━━━━━━━| 18px             │ │
│ │                                     │ │
│ │ Font Weight                         │ │
│ │ [600 ▼]                             │ │
│ │                                     │ │
│ │ Font Style                          │ │
│ │ [A][𝐴][𝘈]                           │ │
│ │                                     │ │
│ │ Text Decoration                     │ │
│ │ [A][A̲][A̅][A̶]                         │ │
│ │                                     │ │
│ │ Text Transform                      │ │
│ │ [Aa][AA][aa][Aa]                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⭐ Icon                          [▼]│ │
│ ├─────────────────────────────────────┤ │
│ │ ☑ Show Icon                         │ │
│ │                                     │ │
│ │ Position  [←][→]                    │ │
│ │ Color     [■] (reset)               │ │
│ │ Size      |━━━○━━━━━| 1.25rem       │ │
│ │                                     │ │
│ │ Icon Source                         │ │
│ │ [Char][Bootstrap][Dashicons][URL]   │ │
│ │ [▾                              ]   │ │
│ │                                     │ │
│ │ ☐ Change icon when active           │ │
│ │ [Open icon picker...]               │ │
│ │                                     │ │
│ │ Rotation  |━━━━━○━━━━| 180°         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🎬 Animation                     [▼]│ │
│ ├─────────────────────────────────────┤ │
│ │ Animation Type                      │ │
│ │ [Slide ▼]                           │ │
│ │                                     │ │
│ │ Duration                            │ │
│ │ |━━━━━○━━━━━━━━━━| 300ms            │ │
│ │                                     │ │
│ │ Easing                              │ │
│ │ [Ease ▼]                            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Questions Resolved

| Question | Decision |
|----------|----------|
| Tab encoding | `tab` property in group |
| Subgroup UI | Dropdown menu (native WP pattern) |
| Content typography | Add with `inherit` defaults |
| Hover typography | Add with `inherit` defaults |
| Box control storage | Object with `linked` flag |
| Padding/Margin | Header padding, Content padding, Block margin |
| Gradients | Header BG, Header Hover BG, Panel BG |
| Animation | Multiple types + duration + easing |
| Responsive | Font sizes, padding, width, icon size |
| Icon libraries | Bootstrap + Dashicons |
| Backward compat | Not required |

---

## Estimated Complexity

| Phase | Complexity | Dependencies |
|-------|------------|--------------|
| Phase 1: Schema | Medium | None |
| Phase 2: Controls | High | Phase 1 |
| Phase 3: Structure | Medium | Phase 1, 2 |
| Phase 4: Responsive | Medium | Phase 2 |
| Phase 5: Icons | Medium | Phase 2 |
| Phase 6: Integration | Medium | All above |

---

## Next Steps

1. Review and approve this plan
2. I will begin with Phase 1 (Schema Updates)
3. Proceed through phases sequentially
4. Test each phase before moving to next
