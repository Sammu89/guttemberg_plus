# Accordion Block - Sidebar Organization Proposal

## Current State Analysis

### Sidebar-Visible Attributes (excluding visibleOnSidebar: false)

**By Current Group:**

#### blockOptions (Block Settings)
- `initiallyOpen` - ToggleControl
- `accordionWidth` - TextControl
- `accordionHorizontalAlign` - SelectControl (left, center, right)
- `headingLevel` - SelectControl (none, h1-h6)

#### headerColors (Colors)
- `titleColor` - ColorPicker
- `titleBackgroundColor` - ColorPicker
- `hoverTitleColor` - ColorPicker (hover state)
- `hoverTitleBackgroundColor` - ColorPicker (hover state)

#### headerTypography (Typography)
- `titleFontSize` - RangeControl (0.6-3 rem)
- `titleFontWeight` - SelectControl (100-900, normal, bold)
- `titleFontStyle` - SelectControl (normal, italic, oblique)
- `titleTextTransform` - SelectControl (none, uppercase, lowercase, capitalize)
- `titleTextDecoration` - SelectControl (none, underline, overline, line-through)
- `titleAlignment` - SelectControl (left, center, right)

#### blockBorders (Borders & Shadows)
- `borderColor` - ColorPicker
- `borderWidth` - RangeControl (0-10 px)
- `borderStyle` - SelectControl (none, solid, dashed, dotted, double)
- `borderRadius` - BorderRadiusControl (px)
- `shadow` - TextControl
- `shadowHover` - TextControl (hover state)

#### panelAppearance (Content Panel)
- `contentBackgroundColor` - ColorPicker

#### dividerLine (Divider)
- `dividerColor` - ColorPicker
- `dividerWidth` - RangeControl (0-10 px)
- `dividerStyle` - SelectControl (none, solid, dashed, dotted, double)

#### icon (Icon Settings)
- `showIcon` - ToggleControl
- `iconPosition` - SelectControl (left, right, extreme-left, extreme-right)
- `iconSize` - RangeControl (0.6-3 rem)
- `iconColor` - ColorPicker
- `iconTypeClosed` - IconPicker
- `iconTypeOpen` - IconPicker
- `iconRotation` - RangeControl (-360 to 360 deg)

---

## Proposed Modern Organization

### Architecture: 4-Tier Hierarchy

Based on WordPress 6.9+ design patterns from the PDFs, here's a clean organization:

```
┌─────────────────────────────────────────────────┐
│  Layout                                      ⋯  │  ← Tier 1: Panel Group
├─────────────────────────────────────────────────┤
│ ☒ Size                                          │  ← Tier 2: Sub-panel
│   BLOCK SIZE                                    │  ← Tier 3: Section
│   Width: [____] 100%                            │
│   Alignment: [Center ▼]                         │
│                                                 │
│ ☐ Semantic HTML                                 │
│   HTML Heading Level: [None ▼]                  │
├─────────────────────────────────────────────────┤
│ ☒ Behavior                                      │
│   STATE                                         │
│   Open by Default: [Toggle]                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Colors                                      ⋯  │
├─────────────────────────────────────────────────┤
│ ☒ Header                                        │
│   TEXT                                          │
│   Text Color: [●]                               │
│                                                 │
│   BACKGROUND                                    │
│   Background Color: [●]                         │
│                                                 │
│ ☒ Header Hover                                  │
│   TEXT (HOVER)                                  │
│   Hover Text Color: [●]                         │
│                                                 │
│   BACKGROUND (HOVER)                            │
│   Hover Background: [●]                         │
│                                                 │
│ ☐ Panel Content                                 │
│   BACKGROUND                                    │
│   Content Background: [●]                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Typography                                  ⋯  │
├─────────────────────────────────────────────────┤
│ ☒ Header Font                                   │
│   FONT SIZE                                     │
│   Font Size: [___] rem [Slider]                 │
│                                                 │
│   FONT WEIGHT                                   │
│   Font Weight: [600 ▼]                          │
│                                                 │
│   FONT STYLE                                    │
│   Font Style: [Normal ▼]                        │
│                                                 │
│ ☐ Header Text Effects                           │
│   TEXT DECORATION                               │
│   Text Decoration: [None ▼]                     │
│                                                 │
│   TEXT TRANSFORM                                │
│   Text Transform: [None ▼]                      │
│                                                 │
│   ALIGNMENT                                     │
│   Text Alignment: [Left ▼]                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Border & Shadow                             ⋯  │
├─────────────────────────────────────────────────┤
│ ☒ Border          [RESET]                       │
│   BORDER                                        │
│   Color: [●]                                    │
│   Width: [___] px [Slider]                      │
│   Style: [Solid ▼]                              │
│                                                 │
│ ☒ Radius          [RESET]                       │
│   RADIUS                                        │
│   [Corner Visual] 4 px [Slider] [Link]          │
│   [None | Small | Medium | Large | Full]        │
│                                                 │
│ ☐ Shadow          [RESET]                       │
│   SHADOW                                        │
│   Preset: [Natural ▼]                           │
│   Hover Preset: [Deep ▼]                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Divider                                     ⋯  │
├─────────────────────────────────────────────────┤
│ ☒ Divider Line                                  │
│   COLOR                                         │
│   Divider Color: [●]                            │
│                                                 │
│   SIZE & STYLE                                  │
│   Width: [___] px                               │
│   Style: [Solid ▼]                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Icon                                        ⋯  │
├─────────────────────────────────────────────────┤
│ ☒ Visibility                                    │
│   Show Icon: [Toggle]                           │
│                                                 │
│ ☐ Position & Size                               │
│   POSITION                                      │
│   Position: [Right ▼]                           │
│                                                 │
│   SIZE                                          │
│   Size: [___] rem [Slider]                      │
│                                                 │
│ ☐ Appearance                                    │
│   COLOR                                         │
│   Color: [●]                                    │
│                                                 │
│   ICON SELECTION                                │
│   Closed Icon: [Icon Picker]                    │
│   Open Icon: [Icon Picker]                      │
│                                                 │
│   ANIMATION                                     │
│   Rotation: [___]° [-360 to 360] [Slider]       │
└─────────────────────────────────────────────────┘
```

---

## Proposed Schema Structure

### Panel Group Organization (Tier 1)

**Main Groups:**
1. **Layout** - Size, positioning, alignment
2. **Colors** - Color controls
3. **Typography** - Font and text settings
4. **Border & Shadow** - Border, radius, shadow
5. **Divider** - Divider line between header/content *(Note: Consider merging into Border & Shadow)*
6. **Icon** - Icon display and styling

### Sub-Panel Organization (Tier 2)

Each panel has logical sub-panels:

#### Layout
- **Size** (shown by default) - Block width, alignment
- **Semantic HTML** (hidden by default) - Heading level
- **Behavior** (shown by default) - Initial state

#### Colors
- **Header** (shown by default) - Title text & background
- **Header Hover** (shown by default) - Title hover states
- **Panel Content** (hidden by default) - Content panel background

#### Typography
- **Header Font** (shown by default) - Font size, weight, style, alignment
- **Header Text Effects** (hidden by default) - Decoration, transform

#### Border & Shadow
- **Border** (shown by default) - Color, width, style [RESET]
- **Radius** (shown by default) - Corner rounding with presets [RESET]
- **Shadow** (hidden by default) - Drop shadows with presets [RESET]

#### Divider
- **Divider Line** (shown by default) - Color, width, style
  *(Note: Only one sub-group - consider merging into Border & Shadow panel)*

#### Icon
- **Visibility** (shown by default) - Show/hide toggle
- **Position & Size** (hidden by default) - Position, size
- **Appearance** (hidden by default) - Color, icons, rotation

### Control Properties (Tier 3 & 4)

#### RangeControl Controls (need enhancements)
- **showSlider**: `true` - Include slider
- **showUnitSelector**: `true` - Show unit selector
- **availableUnits**: `["px", "em", "rem", "vw", "vh"]` or `["deg"]`
- **defaultUnit**: `"px"` or `"rem"` or `"deg"`

#### ColorPicker Controls
- **showIcon**: `true` - Show color preview circle
- **enableAlpha**: `false` - Allow transparency (default is false)
- NO unit selector for colors (colors don't have units)

#### BorderRadiusControl
- **showSlider**: `true`
- **showUnitSelector**: `true`
- **availableUnits**: `["px", "em", "rem", "%"]`
- **showLinkIcon**: `true` - Link/unlink corners
- **showPresets**: `true` - Show quick preset buttons
- **presets**: Array of `{name, value}` objects

#### ShadowControl (replaces TextControl)
- **showPresets**: `true` - Show shadow preset buttons
- **presets**: `["none", "natural", "deep", "sharp", "outlined", "crisp"]`
- **allowCustom**: `true` - Allow manual CSS entry

#### Reset Button Logic
- **resetButton**: `true` - Only needs to be set on ONE attribute per sub-group
- The compiler should aggregate this at the sub-group level
- All controls in a sub-group share the same reset button

---

## Detailed Schema Changes

### 1. Layout Panel

```json
{
  "accordionWidth": {
    "toolsPanelGroup": "Layout",
    "toolsPanelSubGroup": "Size",
    "controlSection": "BLOCK SIZE",
    "isShownByDefault": true
  },
  "accordionHorizontalAlign": {
    "toolsPanelGroup": "Layout",
    "toolsPanelSubGroup": "Size",
    "controlSection": "BLOCK SIZE",
    "isShownByDefault": true
  },
  "headingLevel": {
    "toolsPanelGroup": "Layout",
    "toolsPanelSubGroup": "Semantic HTML",
    "controlSection": "HTML HEADING",
    "isShownByDefault": false
  },
  "initiallyOpen": {
    "toolsPanelGroup": "Layout",
    "toolsPanelSubGroup": "Behavior",
    "controlSection": "STATE",
    "isShownByDefault": true
  }
}
```

### 2. Colors Panel

```json
{
  "titleColor": {
    "toolsPanelGroup": "Colors",
    "toolsPanelSubGroup": "Header",
    "controlSection": "TEXT",
    "isShownByDefault": true,
    "showIcon": true,
    "enableAlpha": false
  },
  "titleBackgroundColor": {
    "toolsPanelGroup": "Colors",
    "toolsPanelSubGroup": "Header",
    "controlSection": "BACKGROUND",
    "isShownByDefault": true,
    "showIcon": true,
    "enableAlpha": false
  },
  "hoverTitleColor": {
    "toolsPanelGroup": "Colors",
    "toolsPanelSubGroup": "Header Hover",
    "controlSection": "TEXT (HOVER)",
    "isShownByDefault": true,
    "showIcon": true,
    "enableAlpha": false
  },
  "hoverTitleBackgroundColor": {
    "toolsPanelGroup": "Colors",
    "toolsPanelSubGroup": "Header Hover",
    "controlSection": "BACKGROUND (HOVER)",
    "isShownByDefault": true,
    "showIcon": true,
    "enableAlpha": false
  },
  "contentBackgroundColor": {
    "toolsPanelGroup": "Colors",
    "toolsPanelSubGroup": "Panel Content",
    "controlSection": "BACKGROUND",
    "isShownByDefault": false,
    "showIcon": true,
    "enableAlpha": false
  }
}
```

### 3. Typography Panel

```json
{
  "titleFontSize": {
    "toolsPanelGroup": "Typography",
    "toolsPanelSubGroup": "Header Font",
    "controlSection": "FONT SIZE",
    "isShownByDefault": true,
    "showSlider": true,
    "showUnitSelector": true,
    "availableUnits": ["px", "em", "rem", "vw", "vh"],
    "defaultUnit": "rem"
  },
  "titleFontWeight": {
    "toolsPanelGroup": "Typography",
    "toolsPanelSubGroup": "Header Font",
    "controlSection": "FONT WEIGHT",
    "isShownByDefault": true
  },
  "titleFontStyle": {
    "toolsPanelGroup": "Typography",
    "toolsPanelSubGroup": "Header Font",
    "controlSection": "FONT STYLE",
    "isShownByDefault": true
  },
  "titleAlignment": {
    "toolsPanelGroup": "Typography",
    "toolsPanelSubGroup": "Header Font",
    "controlSection": "ALIGNMENT",
    "isShownByDefault": true
  },
  "titleTextDecoration": {
    "toolsPanelGroup": "Typography",
    "toolsPanelSubGroup": "Header Text Effects",
    "controlSection": "TEXT DECORATION",
    "isShownByDefault": false
  },
  "titleTextTransform": {
    "toolsPanelGroup": "Typography",
    "toolsPanelSubGroup": "Header Text Effects",
    "controlSection": "TEXT TRANSFORM",
    "isShownByDefault": false
  }
}
```

### 4. Border & Shadow Panel

```json
{
  "borderColor": {
    "toolsPanelGroup": "Border & Shadow",
    "toolsPanelSubGroup": "Border",
    "controlSection": "BORDER",
    "isShownByDefault": true,
    "resetButton": true,
    "showIcon": true,
    "enableAlpha": false
  },
  "borderWidth": {
    "toolsPanelGroup": "Border & Shadow",
    "toolsPanelSubGroup": "Border",
    "controlSection": "BORDER",
    "isShownByDefault": true,
    "showSlider": true,
    "showUnitSelector": true,
    "availableUnits": ["px", "em", "rem", "vw", "vh"],
    "defaultUnit": "px"
  },
  "borderStyle": {
    "toolsPanelGroup": "Border & Shadow",
    "toolsPanelSubGroup": "Border",
    "controlSection": "BORDER",
    "isShownByDefault": true
  },
  "borderRadius": {
    "toolsPanelGroup": "Border & Shadow",
    "toolsPanelSubGroup": "Radius",
    "controlSection": "RADIUS",
    "isShownByDefault": true,
    "resetButton": true,
    "showSlider": true,
    "showUnitSelector": true,
    "availableUnits": ["px", "em", "rem", "%"],
    "showLinkIcon": true,
    "showPresets": true,
    "presets": [
      { "name": "None", "value": "0" },
      { "name": "Small", "value": "4px" },
      { "name": "Medium", "value": "8px" },
      { "name": "Large", "value": "16px" },
      { "name": "Full", "value": "9999px" }
    ]
  },
  "shadow": {
    "toolsPanelGroup": "Border & Shadow",
    "toolsPanelSubGroup": "Shadow",
    "controlSection": "SHADOW",
    "isShownByDefault": false,
    "resetButton": true,
    "control": "ShadowControl",
    "showPresets": true,
    "presets": ["none", "natural", "deep", "sharp", "outlined", "crisp"],
    "allowCustom": true
  },
  "shadowHover": {
    "toolsPanelGroup": "Border & Shadow",
    "toolsPanelSubGroup": "Shadow",
    "controlSection": "SHADOW",
    "isShownByDefault": false,
    "control": "ShadowControl",
    "showPresets": true,
    "presets": ["none", "natural", "deep", "sharp", "outlined", "crisp"],
    "allowCustom": true
  }
}
```

### 5. Divider Panel

```json
{
  "dividerColor": {
    "toolsPanelGroup": "Divider",
    "toolsPanelSubGroup": "Divider Line",
    "controlSection": "COLOR",
    "isShownByDefault": true,
    "showIcon": true,
    "enableAlpha": false
  },
  "dividerWidth": {
    "toolsPanelGroup": "Divider",
    "toolsPanelSubGroup": "Divider Line",
    "controlSection": "SIZE & STYLE",
    "isShownByDefault": true,
    "showSlider": true,
    "showUnitSelector": true,
    "availableUnits": ["px", "em", "rem", "vw", "vh"]
  },
  "dividerStyle": {
    "toolsPanelGroup": "Divider",
    "toolsPanelSubGroup": "Divider Line",
    "controlSection": "SIZE & STYLE",
    "isShownByDefault": true
  }
}
```

### 6. Icon Panel

```json
{
  "showIcon": {
    "toolsPanelGroup": "Icon",
    "toolsPanelSubGroup": "Visibility",
    "controlSection": "DISPLAY",
    "isShownByDefault": true
  },
  "iconPosition": {
    "toolsPanelGroup": "Icon",
    "toolsPanelSubGroup": "Position & Size",
    "controlSection": "POSITION",
    "isShownByDefault": false
  },
  "iconSize": {
    "toolsPanelGroup": "Icon",
    "toolsPanelSubGroup": "Position & Size",
    "controlSection": "SIZE",
    "isShownByDefault": false,
    "showSlider": true,
    "showUnitSelector": true,
    "availableUnits": ["px", "em", "rem", "vw", "vh"],
    "defaultUnit": "rem"
  },
  "iconColor": {
    "toolsPanelGroup": "Icon",
    "toolsPanelSubGroup": "Appearance",
    "controlSection": "COLOR",
    "isShownByDefault": false,
    "showIcon": true,
    "enableAlpha": false
  },
  "iconTypeClosed": {
    "toolsPanelGroup": "Icon",
    "toolsPanelSubGroup": "Appearance",
    "controlSection": "ICON SELECTION",
    "isShownByDefault": false
  },
  "iconTypeOpen": {
    "toolsPanelGroup": "Icon",
    "toolsPanelSubGroup": "Appearance",
    "controlSection": "ICON SELECTION",
    "isShownByDefault": false
  },
  "iconRotation": {
    "toolsPanelGroup": "Icon",
    "toolsPanelSubGroup": "Appearance",
    "controlSection": "ANIMATION",
    "isShownByDefault": false,
    "showSlider": true,
    "showUnitSelector": true,
    "availableUnits": ["deg"],
    "defaultUnit": "deg"
  }
}
```

---

## Summary of Improvements

### Before (Current)
- Flat sidebar with 7 separate panels
- No sub-grouping within panels
- All controls visible at once
- No collapsible sections for advanced options
- No unit selectors for RangeControl
- No visual organization hierarchy

### After (Proposed)
- 6 organized panel groups with clear categories
- 16 sub-panels with hierarchical grouping
- Progressive disclosure (hiding advanced options)
- Collapsible "Text Effects" and "Appearance" sections
- Unit selectors for RangeControl (px, em, rem, vw, vh, deg)
- Reset buttons for related control groups (aggregated at sub-group level)
- Section headers for visual organization
- Shadow presets for better UX
- Border radius presets for common values
- Modern WordPress 6.9+ design pattern
- titleAlignment moved to "Header Font" for better discoverability

---

## Implementation Notes

### Reset Button Strategy
The `resetButton: true` property only needs to be specified on **one attribute per sub-group**. The schema compiler should:
1. Scan all attributes in each sub-group
2. If ANY attribute has `resetButton: true`, add a reset button to that sub-group
3. The reset button resets ALL controls in that sub-group to defaults

This prevents redundant configuration and makes the schema cleaner.

### Shadow Control Implementation
Replace the old TextControl with a new ShadowControl component that provides:
- **Presets**: Quick access to common shadow styles (none, natural, deep, sharp, outlined, crisp)
- **Custom mode**: Advanced users can still enter CSS box-shadow values
- **Visual preview**: Show shadow effect in real-time

### Divider Panel Consideration
The Divider panel only has one sub-group ("Divider Line"). Consider:
- **Option A**: Keep separate for clarity (divider is distinct from borders)
- **Option B**: Merge into "Border & Shadow" panel as a third sub-group
- **Recommendation**: Keep separate for now, evaluate based on user feedback

---

## Next Steps

1. ✅ Review this proposal
2. ⬜ Make adjustments/additions if needed
3. ⬜ Update accordion.json with new schema fields
4. ⬜ Update schema-compiler.js to generate files
5. ⬜ Implement ShadowControl component
6. ⬜ Test in WordPress editor
7. ⬜ Iterate based on UX feedback
