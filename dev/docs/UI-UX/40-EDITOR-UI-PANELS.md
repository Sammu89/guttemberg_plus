# Gutenberg Accordion Block Editor - UI/UX Requirements (CORRECTED)

## Overview

This document defines the complete UI/UX requirements for the Gutenberg accordion block editor interface, **strictly aligned with BLOCK-ATTRIBUTES-SCHEMA.md**.

**Shared Architecture Note**: The UI components and controls described in this document are implemented using shared components from `src/shared/components/` (ThemeSelector.js, ColorPanel.js, TypographyPanel.js, BorderPanel.js, IconPanel.js). The same UI patterns are used by both Accordion and Tabs blocks for consistency.

## Architecture Principles

### The 3-Tier Value Cascade

All accordion styling and behavior is determined by a 3-tier inheritance system:

1. **CSS Defaults** - Base fallback values defined in `accordion.css` (parsed by PHP)
2. **Theme Values** - Theme selected for individual block (via `currentTheme` attribute), stored in database
3. **Block Customizations** - Inline overrides stored directly on block

**Critical Rule**: The editor ALWAYS displays EFFECTIVE values (the result of the cascade), not raw attribute values.

**Shared Architecture Note**: This cascade system is implemented in `src/shared/theme-system/cascade-resolver.js` and is used by both Accordion and Tabs blocks. Each block type has its own CSS file (`accordion.css` vs `tabs.css`) and theme storage (`accordion_themes` vs `tabs_themes`), but uses the same cascade logic.


---

## 1. Block Toolbar (Top Bar)

The block toolbar appears at the top of the selected block and contains frequently-used controls.

### Layout

```
[Visibility Toggle] [Open by Default] [Quick Settings â–¾]

```

### Controls

### Controls

#### 1.1 Visibility Toggle Button

**Purpose**: Controls whether the accordion is visible on the frontend

**Visual**: 
- Enabled state: Check mark icon
- Disabled state: X icon

**Behavior**:
- Toggles ""adds display:none"" to the accordion css settings, rendering it disabled on frontend
- When disabled, block appears dimmed in editor with overlay text "Accordion disabled"
- Block remains fully editable when hidden

**Default**: Enabled (accordion visible)

---

#### 1.2 Open by Default Toggle

**Purpose**: Controls whether accordion starts expanded on page load

**Attribute**: `initiallyOpen` (boolean, structural)

**Visual**: Eye icon button
- Enabled state: Solid eye icon (expanded)
- Disabled state: Crossed-out eye icon (collapsed)

**Behavior**:
- Toggles `initiallyOpen` block attribute
- Affects only frontend initial state
- Editor always shows accordion expanded regardless of setting
- Tooltip: "Open by default" / "Closed by default"

**Default**: `false` (closed by default)

---

#### 1.3 Quick Settings Dropdown

**Purpose**: Provides quick access to most common settings without opening sidebar

**Visual**: Gear icon with dropdown arrow

**Dropdown Contents**:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Theme                          â”‚
â”‚ [Dropdown: Default        â–¾]   â”‚
â”‚                                 â”‚
â”‚ Horizontal Alignment           â”‚
â”‚ [â—€ Left] [â–£ Center] [Right â–¶] â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Fields**:


1. **Theme Selector Dropdown**
   - Lists all available themes
   - Shows current selection
   - Displays "(custom)" suffix when block is customized
   - Behavior identical to sidebar theme selector (see Section 4)

2. **Horizontal Alignment Selector**
   - Three-button toggle group
   - Options: Left, Center, Right
   - Updates block's horizontal alignment
   - Visual indicator shows current selection

**Behavior**:
- Dropdown closes after each selection
- Changes apply immediately
- Persists between editor sessions

---

## 2. Inspector Sidebar Panels

The Inspector Sidebar contains all detailed controls organized into collapsible panels.

### Panel Order (Top to Bottom)

1. Settings Panel (theme management) -- not on a collapspsible panel, always visible on top of the sidebar
2. Color Panel (colors & backgrounds)
3. Title Panel (typography & heading)
4. Border Panel (borders & divider)
5. Icon Panel (icon configuration)
6. Instructions Panel (help text)

---

### 2.1 Settings Panel

**Purpose**: Theme management and selection -- not on a collapspsible panel, always visible on top of the sidebar

**Implementation Note**: This panel uses shared ThemeSelector.js component from `src/shared/components/`. Theme operations (create, update, delete, rename) are handled by shared theme-manager.js from `src/shared/theme-system/`.

**Visual Layout**:

```
┌─ Settings ────────────────────┐
│                                │
│ Theme                          │
│ [Default (customized)     ▾]   │
│                                │
│ [Save as New Theme]            │
│ [Update Theme]                 │
│ [Rename Theme]                 │
│ [Delete Theme]                 │
│                                │
│ [Reset modifications]

│ Accordion witdh:
│ [input value in px or %]

│ Horizontal alignement
│ [Dropwdown with Left, Center, Right]
       │
└────────────────────────────────┘
```

Horizontal alignement is only available when width if not empty and is different than 100%, otherwise its greyed out

#### Theme Selector Dropdown

**Attribute**: `currentTheme` (string, meta)

**Display**:
- Shows current theme name (or "Default" if `currentTheme` is empty string)
- Appends "(customized)" suffix when `isCustomized` is true
- Example: "Default (customized)" or "Dark Theme (customized)"

**Schema Compliance**:
- Empty string `""` = Default theme
- Theme ID (e.g., `"kh3h"`) = Named theme
- Never shows "Custom" in dropdown (it's a UI-only label for customized state)

**Dropdown Options**:
- Lists all available themes by their `name` property
- Internally references by `theme_id`
- "Default" theme always present
- Themes listed alphabetically

**Behavior**:
- Selecting different theme switches `currentTheme` attribute to new theme's `theme_id`
- Triggers customization cache workflow
- All controls update to show new effective values

---

#### Save as New Theme Button

**Purpose**: Creates new theme from current effective values

**Availability**: 
- Enabled only when `isCustomized` is true
- Disabled when block is clean

**Workflow**:

1. User clicks "Save as New Theme"
2. Modal dialog appears with theme name input
3. User enters `name` (display name)
4. System generates unique `theme_id` (4 chars: `[a-zA-Z0-9-]+`)
5. Collects ALL effective values from 4-tier cascade
6. Saves to database as new theme with structure:
   ```
   theme_id: {
     name: "User Theme Name",
     modified: "2025-10-10 14:30:00",
     values: { ...all customizable attributes... }
   }
   ```
7. Clears ALL block customizations (set to `undefined`)
8. Sets `currentTheme` to new `theme_id`
9. Sets `isCustomized` to `false` (computed)
10. Updates dropdown to show new theme name (without "(customized)")
11. Switches active accordion to new theme

---

#### Update Theme Button

**Purpose**: Merges current customizations into selected theme

**Label**: "Update Theme"

**Availability**:
- Enabled only when `isCustomized` is true
- Disabled when block is clean or uses Default theme

**Workflow**:

1. User clicks "Update Theme"
2. Confirmation dialog
3. Collects ALL effective values from current block
4. Updates theme entry in database (by `theme_id`)
5. Clears current block's customizations
6. Sets `isCustomized` to `false`
7. Triggers update notification to all other blocks using this `theme_id`
8. Switches active accordion to new theme

**Critical**: Updates are GLOBAL - affects all blocks using the same `theme_id`

---

#### Rename Theme Button

**Purpose**: Changes `name` property of selected theme (display name only)

**Availability**:
- Enabled for custom themes
- Disabled for Default theme

**Workflow**:

1. User clicks "Rename Theme"
2. Modal with name input (pre-filled with current `name`)
3. User enters new `name`
4. System updates theme's `name` in database
5. Theme's `theme_id` remains unchanged
6. All blocks continue working (referenced by `theme_id`)

---

#### Delete Theme Button

**Purpose**: Removes theme from database by `theme_id`

**Availability**:
- Enabled for custom themes
- Disabled for Default theme

**Workflow**:

1. User clicks "Delete Theme"
2. Confirmation dialog
3. System finds all blocks with this `currentTheme` value
4. Changes those blocks' `currentTheme` to `""` (Default)
5. Preserves block customizations (if any)
6. Removes theme from database
7. Removes theme from all dropdowns

---

#### Reset Modifications Button

**Purpose**: Discards all block customizations, reverts to clean theme

**Availability**:
- Enabled only when `isCustomized` is true
- Disabled when block already clean

**Workflow**:

1. User clicks "Reset modifications"
2. Optional confirmation
3. Clears ALL customization attributes (set to `undefined`)
4. Keeps `currentTheme` unchanged
5. Sets `isCustomized` to `false` (computed)
6. All controls reset to show theme values

---

### 2.2 Color Panel

**Purpose**: Color customization for title and content areas

**Implementation Note**: This panel uses shared ColorPanel.js component from `src/shared/components/`. Color attributes are defined in `src/shared/attributes/color-attributes.js`.

**Visual Layout**:

```
┌─ Appearance ──────────────────┐
│                                │
│ Header Background Color         │
│ [████████] #2c3e50             │
│                                │
│ Title Text Color               │
│ [████████] #ffffff             │
│                                │
│ Hover Header Background         │
│ [████████] #34495e             │
│                                │
│ Hover Title Text               │
│ [████████] inherit             │
│                                │
│ Active Header Background        │
│ [████████] inherit             │
│                                │
│ Active Title Text              │
│ [████████] inherit             │
│                                │
│ Content Background Color       │
│ [████████] transparent         │
│                                │
└────────────────────────────────┘
```

#### Header Background Color

**Attribute**: `titleBackgroundColor` (string, customizable)
**Default**: `"#f5f5f5"`
**Type**: CSS color

#### Title Text Color

**Attribute**: `titleColor` (string, customizable)
**Default**: `"#333333"`
**Type**: CSS color

#### Hover Header Background Color

**Attribute**: `hoverTitleBackgroundColor` (string, customizable)
**Default**: `"#eeeeee"`
**Type**: CSS color

#### Hover Title Text Color

**Attribute**: `hoverTitleColor` (string, customizable)
**Default**: `null` (inherits from `titleColor` at runtime)
**Type**: CSS color or null

**Note**: When `null`, shows "inherit" in UI and inherits from `titleColor`

#### Active Header Background Color

**Attribute**: `activeTitleBackgroundColor` (string, customizable)
**Default**: `null` (inherits from `titleBackgroundColor` at runtime)
**Type**: CSS color or null

#### Active Title Text Color

**Attribute**: `activeTitleColor` (string, customizable)
**Default**: `null` (inherits from `titleColor` at runtime)
**Type**: CSS color or null

#### Content Background Color

**Attribute**: `contentBackgroundColor` (string, customizable)
**Default**: `"transparent"`
**Type**: CSS color


---

### 2.3 Title Panel

**Purpose**: Typography and heading configuration for accordion title

**Implementation Note**: This panel uses shared TypographyPanel.js component from `src/shared/components/`. Typography attributes are defined in `src/shared/attributes/typography-attributes.js`.

**Visual Layout**:

```
┌─ Title ───────────────────────┐
│                                │
│ Heading Level: [h3 ▾]          │
│ Options: none, h1-h6           │
│                                │
│ Font Size: [16] px             │
│                                │
│ Font Weight: [600 ▾]           │
│ Options: 100-900, normal, bold │
│                                │
│ Font Style: [normal ▾]         │
│ Options: normal, italic        │
│                                │
│ Text Transform: [none ▾]       │
│ Options: none, uppercase,      │
│          lowercase, capitalize │
│                                │
│ Text Decoration: [none ▾]      │
│ Options: none, underline       │
│                                │
│ Text Alignment: [left ▾]       │
│ Options: left, center, right   │
│                                │
│ Padding (px)                   │
│ ┌─────────┬─────────┐          │
│ │ T: [12] │ R: [12] │          │
│ ├─────────┼─────────┤          │
│ │ B: [12] │ L: [12] │          │
│ └─────────┴─────────┘          │
│                                │
└────────────────────────────────┘
```

#### Heading Level

**Attribute**: `headingLevel` (string, customizable)
**Default**: `none`
**Options**: `"none"`, `"h1"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`, `"h6"`

**Purpose**: Semantic HTML heading tag wrapper (optional)

**Behavior**:
- When `"none"`: Title renders without heading wrapper
- When h1-h6: Title wrapped in corresponding heading tag
- Enhances SEO and accessibility

#### Title Font Size

**Attribute**: `titleFontSize` (number, customizable)
**Default**: `16`
**Unit**: Pixels (px)
**Form**: Slider from 1 to 150px
**Validation**: Must be > 0

#### Title Font Weight

**Attribute**: `titleFontWeight` (string, customizable)
**Default**: `"bold"`
**Options**: `"normal"`, `"bold"`, `"100"` through `"900"`

#### Title Font Style

**Attribute**: `titleFontStyle` (string, customizable)
**Default**: `"normal"`
**Options**: `"normal"`, `"italic"`, `"oblique"`

#### Title Text Transform

**Attribute**: `titleTextTransform` (string, customizable)
**Default**: `"none"`
**Options**: `"none"`, `"uppercase"`, `"lowercase"`, `"capitalize"`

#### Title Text Decoration

**Attribute**: `titleTextDecoration` (string, customizable)
**Default**: `"none"`
**Options**: `"none"`, `"underline"`, `"overline"`, `"line-through"`

#### Title Alignment

**Attribute**: `titleAlignment` (string, customizable)
**Default**: `"left"`
**Options**: `"left"`, `"center"`, `"right"`

#### Title Padding

**Attribute**: `titlePadding` (object, customizable)
**Default**: `{ top: 12, right: 12, bottom: 12, left: 12 }`
**Type**: Object with numeric properties (pixels)
**Validation**: Each value must be >= 0

**Structure**:
```javascript
{
  top: number,    // >= 0
  right: number,  // >= 0
  bottom: number, // >= 0
  left: number    // >= 0
}
```

---

### 2.4 Border Panel

**Purpose**: Border styling for accordion container and content divider

**Implementation Note**: This panel uses shared BorderPanel.js component from `src/shared/components/`. Border attributes are defined in `src/shared/attributes/border-attributes.js`.

**Visual Layout**:

```
┌─ Border ──────────────────────┐
│                                │
│ Accordion Border               │
│                                │
│ Color: [████████] #e0e0e0      │
│                                │
│ Thickness: [1] px              │
│                                │
│ Style: [solid ▾]               │
│ Options: none, solid, dashed,  │
│          dotted, double, etc.  │
│ Border radius:                 │
│ ┌─────────┬─────────┐          │
│ │ TL: [4] │ TR: [4] │          │
│ │    px   │    px   │          │
│ ├─────────┼─────────┤          │
│ │ BL: [4] │ BR: [4] │          │
│ │    px   │    px   │          │
│ └─────────┴─────────┘          │
│                                │
│ Or: All Corners: [4] px        │
│                    [Apply]     │
│                                │
│                                │
│ Shadow: [none ▾]               │
│ Options: none, or CSS value    │
│                                │
│ ─────────────────────          │
│                                │
│ Divider Border                 │
│ (between title and content)    │
│                                │
│ Color: [████████] #e0e0e0      │
│                                │
│ Thickness: [0] px              │
│                                │
│ Style: [solid ▾]               │
│                                │
└────────────────────────────────┘
```

#### Accordion Border Color

**Attribute**: `accordionBorderColor` (string, customizable)
**Default**: `"#e0e0e0"`
**Type**: CSS color

#### Accordion Border Thickness

**Attribute**: `accordionBorderThickness` (number, customizable)
**Default**: `1`
**Unit**: Pixels (px)
**Validation**: Must be >= 0

#### Accordion Border Style

**Attribute**: `accordionBorderStyle` (string, customizable)
**Default**: `"solid"`
**Options**: `"none"`, `"solid"`, `"dashed"`, `"dotted"`, `"double"`, `"groove"`, `"ridge"`, `"inset"`, `"outset"`, `"hidden"`

#### Accordion Shadow

**Attribute**: `accordionShadow` (string, customizable)
**Default**: `"none"`
**Type**: CSS box-shadow value or `"none"`

**Example values**:
- `"none"`
- `"0 2px 4px rgba(0,0,0,0.1)"`
- `"0 4px 8px rgba(0,0,0,0.2)"`


#### Accordion Border Radius

**Attribute**: `accordionBorderRadius` (object, customizable)
**Default**: `{ topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4 }`
**Type**: Object with numeric properties (pixels)
**Validation**: Each value must be >= 0

**Structure**:
```javascript
{
  topLeft: number,     // >= 0
  topRight: number,    // >= 0
  bottomLeft: number,  // >= 0
  bottomRight: number  // >= 0
}
```

**Individual Corner Controls**:
- Top-Left (TL)
- Top-Right (TR)
- Bottom-Left (BL)
- Bottom-Right (BR)

**All Corners Shortcut**:
- Single input to set all four corners to same value
- "Apply" button updates all four attributes

---

#### Divider Border Color

**Attribute**: `dividerBorderColor` (string, customizable)
**Default**: `"#e0e0e0"`
**Type**: CSS color

#### Divider Border Thickness

**Attribute**: `dividerBorderThickness` (number, customizable)
**Default**: `0`
**Unit**: Pixels (px)
**Validation**: Must be >= 0

**Note**: When `0`, no divider line appears between title and content

#### Divider Border Style

**Attribute**: `dividerBorderStyle` (string, customizable)
**Default**: `"solid"`
**Options**: Same as accordion border style




---

### 2.6 Icon Panel

**Purpose**: Add and configure icons in accordion title

**Implementation Note**: This panel uses shared IconPanel.js component from `src/shared/components/`. Icon attributes are defined in `src/shared/attributes/icon-attributes.js`.

**Visual Layout**:

```
┌─ Icon ────────────────────────┐
│                                │
│ ☑ Show Icon                    │
│                                │
│ Closed Icon: [+]               │
│ (text or URL)                  │
│                                │
│ Open Icon: [−]                 │
│ (text or URL. "None" means icon doest change and rotates instead)       │
│                                │
│ Rotation: [0] degrees          │
│ (used if Open Icon is "none")  │
│                                │
│ Icon Position: [right ▾]       │
│ Options: left, right,          │
│          extreme-left,         │
│          extreme-right         │
│                                │
│ Icon Color: [████████] inherit │
│ (null = inherit from title)    │
│                                │
│ Icon Size: [16] px             │
│ (null = inherit from title)    │
│                                │
│ Preview: [+] Accordion Title   │
│                                │
└────────────────────────────────┘
```

#### Show Icon

**Attribute**: `showIcon` (boolean, customizable)
**Default**: `true`

**Behavior**: 
- When `false`: Icon hidden with `display: none`
- When `true`: Icon displays based on other icon settings

#### Icon Type Closed

**Attribute**: `iconTypeClosed` (string, customizable)
**Default**: `"▾"`
**Type**: Character/emoji OR image URL

**Accepts**:
- Single character: `"+"`, `"▾"`, `"›"`
- Emoji: `"➕"`, `"🔽"`
- URL: `"https://example.com/icon.svg"`

**URL Detection**: Starts with `"http"` or `"https"`

#### Icon Type Open

**Attribute**: `iconTypeOpen` (string, customizable)
**Default**: `"none"`
**Type**: Character/emoji, image URL, OR `"none"`

**Special Value**: `"none"` means don't change icon, use rotation instead

**Behavior**:
- When NOT `"none"`: Icon changes to this value when accordion opens
- When `"none"`: Icon stays same (`iconTypeClosed`) and rotates by `iconRotation` degrees

#### Icon Rotation

**Attribute**: `iconRotation` (number, customizable)
**Default**: `180`
**Unit**: Degrees
**Form**: Slider
**Validation**: Must be 10-350

**Used When**: `iconTypeOpen` is `"none"` (icon doesn't change, just rotates)

**Behavior**: Icon rotates by this many degrees when accordion opens

#### Icon Position

**Attribute**: `iconPosition` (string, customizable)
**Default**: `"right"`
**Options**: `"left"`, `"right"`, `"extreme-left"`, `"extreme-right"`

**Visual Examples**:
- `left`: `[▾] Accordion Title`-relative to title
- `right`: `Accordion Title [▾]` - relative to title
- `extreme-left`: Far left edge of the header
- `extreme-right`: Far right edge of the header

#### Icon Color
**Critical**: Greyed out when both iconOpen and iconClosed are image (of only of iconOpen if iconCLosed is null) because this setting doesnt control a image
**Attribute**: `iconColor` (string, customizable)
**Default**: `null` (inherits from `titleColor` at runtime)
**Type**: CSS color or `null`

**Behavior**: When `null`, displays "inherit" in UI and uses `titleColor` value

#### Icon Size
**Critical**: Greyed out when both iconOpen and iconClosed are image (of only of iconOpen if iconCLosed is null) because this setting doesnt control a image
**Attribute**: `iconSize` (number, customizable)
**Default**: `null` (inherits from `titleFontSize` at runtime)
**Unit**: Pixels (px)
**Validation**: Must be > 0 when set

**Behavior**: When `null`, uses `titleFontSize` value. - When icon is a image, always resize to 18px using image ratio of 1:1 via css

---

### 2.7 Instructions Panel

**Purpose**: Provides contextual help and workflow guidance

**Visual Layout**:

```
┌─ Instructions ────────────────┐
│                                │
│ ℹ️ Understanding Customizations│
│                                │
│ This accordion uses the theme: │
│ "Default"                      │
│                                │
│ Any changes you make here      │
│ create customizations that     │
│ override the theme values.     │
│                                │
│ To save your changes as theme: │
│ 1. Click "Save as New Theme"   │
│ 2. Click "Update Theme" to     │
│    modify existing theme       │
│                                │
│ To remove customizations:      │
│ Click "Reset modifications"    │
│                                │
│ [📖 Learn More]                │
│                                │
└────────────────────────────────┘
```

**Content**: Dynamic based on current state and `currentTheme` value

---

## 3. Sidebar Control Behavior

### 3.1 Core Principle: Effective Values Display

**Critical Rule**: ALL controls display EFFECTIVE values (result of 3-tier cascade), NOT raw block attributes.

**Effective Value Resolution**:

For each control:
1. Check Block Customization attribute (inline value)
2. If `undefined`, check theme via `currentTheme` (theme_id)
3. If `undefined` or theme not found, use CSS Default (from `accordion.css`)
4. Display the first defined value found

**Implementation Note**: Effective value resolution is handled by `src/shared/theme-system/cascade-resolver.js`. CSS defaults are provided via `window.accordionDefaults` (parsed by PHP from `accordion.css`).

**Example**:
```
Attribute: titleColor

Step 1: Check block.titleColor
  → undefined (no customization)

Step 2: Check themes[block.currentTheme].values.titleColor
  → "#2c3e50" (theme value exists)
  → STOP, use this value

Display in color picker: #2c3e50
```

---

### 3.2 Boolean Controls Behavior

**Critical Rule**: Boolean controls (checkboxes/toggles) resolve through cascade like all other controls.

**Example**:
```
Control: "Show Icon"

Raw Attribute: showIcon = undefined
Theme Value: showIcon = true

Effective value: true (from theme)
→ Toggle displays: CHECKED ✓
→ Icon appears in preview
```

**When User Changes**:
```
User unchecks toggle

Before:
  Block: showIcon = undefined
  Theme: showIcon = true
  Effective: true

After:
  Block: showIcon = false ← NEW
  Effective: false
  Status: Block now customized
```

---

### 3.3 Null Inheritance Controls

**Special Behavior**: Some attributes have `null` default that means "inherit from another attribute"

**Attributes with Null Inheritance**:
- `iconColor` → inherits from `titleColor`
- `iconSize` → inherits from `titleFontSize`
- `hoverTitleColor` → inherits from `titleColor`
- `activeTitleColor` → inherits from `titleColor`
- `activeTitleBackgroundColor` → inherits from `titleBackgroundColor`

**Display Behavior**:

When value is `null`:
- Show "inherit" or "auto" in UI
- Preview uses parent attribute value
- User can set explicit value to override

When value is explicit color/number:
- Show actual value
- Mark as customized if different from theme

**Example**:
```
Icon Color Control:

Scenario 1: iconColor = null
  → Display: "inherit from Title Color"
  → Preview: Uses titleColor value
  → Not marked as customized

Scenario 2: iconColor = "#ff0000"
  → Display: "#ff0000"
  → Preview: Uses #ff0000
  → Marked as customized (if different from theme)
```

---

### 3.4 Customization Indicators

**Purpose**: Show which values differ from theme

**Visual Options**:
- Badge/icon next to control
- Highlight border around control
- Asterisk after label
- Color change

**Appears When**:
- Block attribute is defined (not `undefined`)
- AND value differs from theme value

**Does NOT Appear When**:
- Block attribute is `undefined` (using theme)
- OR block value matches theme exactly

---

## 4. Theme Selector Dropdown Behavior

### 4.1 Dropdown Display

**Attribute References**:
- Current selection: `currentTheme` (theme_id)
- Customization status: `isCustomized` (computed)

**Display Format**:

Clean theme:
```
[Default              ▾]
```

Customized theme:
```
[Default (customized) ▾]
```

Named theme (clean):
```
[Dark Mode            ▾]
```

Named theme (customized):
```
[Dark Mode (customized) ▾]
```

**Schema Compliance**:
- Empty string `""` displays as "Default"
- Theme ID displays theme's `name` property
- "(customized)" appears when `isCustomized === true`

---

### 4.2 Dropdown Options List

**Structure**:
```
┌─────────────────────────┐
│ ✓ Default               │ ← currentTheme = ""
│   Dark Mode             │ ← theme_id = "kh3h"
│   Light Mode            │ ← theme_id = "ab12"
│   Corporate             │ ← theme_id = "xy99"
└─────────────────────────┘
```

**Rules**:
- Shows theme `name` properties
- Internally references `theme_id`
- "Default" always first
- Other themes alphabetically

---

### 4.3 Switching Themes

**Workflow**:

1. User selects theme from dropdown
2. System executes:
   - If current block customized → store in `customizationCache`
   - Set `currentTheme` = selected theme's `theme_id`
   - Clear all customization attributes (set to `undefined`)
   - Resolve new effective values from new theme
   - Update all controls to show new effective values
   - Update editor preview
   - `isCustomized` becomes `false`
3. Block now uses selected theme (clean)

---

### 4.4 Current Selection Indicator

**Visual Feedback**:
- Selected theme highlighted in dropdown
- Checkmark next to name
- Bold text or background color

**Always Shows**:
- Current theme `name` (or "Default")
- "(customized)" suffix if `isCustomized === true`

---

### 4.5 Theme Not Found Handling

**Scenario**: Block's `currentTheme` references non-existent `theme_id`

**Fallback Behavior**:
1. Detect invalid `theme_id`
2. Automatically set `currentTheme = ""`  (Default)
3. Preserve block customizations
4. Show warning: "Previous theme not found. Switched to Default."
5. Update dropdown to show "Default"

---

## 5. Create New Theme Workflow

### 5.1 Step-by-Step Workflow

**Step 1: User clicks "Save as New Theme"**

**Availability**: Only when `isCustomized === true`

---

**Step 2: Modal Dialog**

```
┌─────────────────────────────────────────┐
│  Create New Theme                   ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Theme Name:                            │
│  [....................................]  │
│                                         │
│  This will save all current settings   │
│  as a new reusable theme.              │
│                                         │
│              [Cancel]  [Create Theme]  │
│                                         │
└─────────────────────────────────────────┘
```

---

**Step 3: Validation**

- Name not empty
- Name length: 1-50 characters
- Valid characters: letters, numbers, spaces, hyphens, underscores
- Not "Default" (case-insensitive)
- Not duplicate of existing theme name

---

**Step 4: System Processing**

1. **Generate unique `theme_id`**:
   - 4-character alphanumeric: `[a-zA-Z0-9-]+`
   - Examples: `"kh3h"`, `"ab12"`, `"z9y8"`
   - Ensure uniqueness

2. **Collect effective values**:
   - Resolve ALL customizable attributes through cascade
   - Build complete snapshot with ALL values defined

3. **Save to database**:
   ```php
   'theme_id' => array(
     'name' => 'User Theme Name',
     'modified' => '2025-10-10 14:30:00',
     'values' => array(
       'titleColor' => '#333333',
       'titleBackgroundColor' => '#f5f5f5',
       // ... ALL customizable attributes ...
     )
   )
   ```

4. **Update block attributes**:
   - Set `currentTheme` = new `theme_id`
   - Set ALL customization attributes to `undefined`
   - `isCustomized` becomes `false` (computed)

5. **Update UI**:
   - Add new theme to dropdown (by `name`)
   - Select new theme in dropdown
   - Remove "(customized)" suffix
   - Clear all customization indicators

---

**Step 5: Success Feedback**

```
┌────────────────────────────────────┐
│ ✓ Theme "My Theme" created         │
└────────────────────────────────────┘
```

---

## 6. Update Theme Workflow

### 6.1 Button Availability

**Availability**:
- Enabled when `isCustomized === true`
- Disabled when clean OR `currentTheme === ""` (Default)

---

### 6.2 Workflow

**Step 1: Confirmation**

```
┌─────────────────────────────────────────┐
│  Update Theme?                      ✕   │
├─────────────────────────────────────────┤
│                                         │
│  This will update the theme with your  │
│  current settings.                     │
│                                         │
│  ⚠ This will affect ALL accordions     │
│     using this theme across your site. │
│                                         │
│  This cannot be undone.                │
│                                         │
│              [Cancel]  [Update Theme]  │
│                                         │
└─────────────────────────────────────────┘
```

---

**Step 2: System Processing**

1. **Collect effective values** from current block
2. **Update theme in database** (by `currentTheme` id):
   - Fetch theme by `theme_id`
   - Overwrite `values` with new complete snapshot
   - Update `modified` timestamp
3. **Update current block**:
   - Clear ALL customization attributes
   - Keep `currentTheme` unchanged
   - `isCustomized` becomes `false`
4. **Notify other blocks**:
   - Find all blocks with same `currentTheme`
   - Trigger re-render with new theme values
5. **Update UI**:
   - Remove "(customized)" suffix
   - Clear customization indicators

---

## 7. Rename and Delete Theme Workflows

### 7.1 Rename Theme

**Availability**: Enabled when `currentTheme !== ""` (not Default)

**Workflow**:

1. Modal with current `name` pre-filled
2. User enters new `name`
3. Validation (same as create)
4. Update theme's `name` property in database
5. Keep `theme_id` unchanged
6. Update dropdown display
7. All blocks continue working (reference by `theme_id`)

---

### 7.2 Delete Theme

**Availability**: Enabled when `currentTheme !== ""` (not Default)

**Workflow**:

```
┌─────────────────────────────────────────┐
│  Delete Theme?                      ✕   │
├─────────────────────────────────────────┤
│                                         │
│  ⚠ This will permanently delete this   │
│     theme.                             │
│                                         │
│  All accordions using this theme will  │
│  switch to the Default theme.          │
│                                         │
│  Their specific customizations will be          │
│  preserved.                            │
│                                         │
│  This cannot be undone.                │
│                                         │
│              [Cancel]  [Delete Theme]  │
│                                         │
└─────────────────────────────────────────┘
```

**System Actions**:

1. Find all blocks with this `currentTheme` value
2. Set those blocks' `currentTheme = ""`
3. Preserve customizations (if any)
4. Delete theme from database
5. Remove from all dropdowns

---

## 8. Customization Cache Workflow

### 8.1 Purpose

Preserve customizations when user switches themes temporarily to preview.

**Attribute**: `customizationCache` (object, meta, NOT serialized)

---

### 8.2 Cache Structure

```javascript
{
  accordionId: {
    titleColor: "#ff0000",
    showIcon: false,
    // ... other customized attributes
  }
}
```

**Key**: Block's `accordionId` (NOT `theme_id`)
**Storage**: Editor session memory only
**Lifetime**: Lost on page reload or when saved with clean theme

---

### 8.3 Workflow

**Initial State**:
```
currentTheme: ""
titleColor: "#ff0000" (customization)
isCustomized: true
```

---

**User Switches to Theme B**:

1. **Before switch**:
   - Detect `isCustomized === true`
   - Collect customizations: `{ titleColor: "#ff0000", ... }`
   - Store in `customizationCache[accordionId]`

2. **Execute switch**:
   - Clear all customization attributes
   - Set `currentTheme = "dark-mode"` (theme_id)
   - Resolve effective values from new theme
   - `isCustomized` becomes `false`

3. **After switch**:
   ```
   currentTheme: "dark-mode"
   titleColor: undefined
   customizationCache: { "abc123": { titleColor: "#ff0000" } }
   isCustomized: false
   ```

---

**User Switches Back to Original**:

1. **Before switch**:
   - May cache current customizations (if any)

2. **Execute switch**:
   - Set `currentTheme = ""`
   - **Check cache** for this `accordionId`
   - **Found cache!**
   - Restore: `titleColor = "#ff0000"`
   - `isCustomized` becomes `true`

3. **After switch**:
   ```
   currentTheme: ""
   titleColor: "#ff0000" (restored)
   isCustomized: true
   ```

**User sees**: Original customizations restored!

---

### 8.4 Cache Persistence

**Lives During**:
- Editing session
- Theme switches
- Control changes
- Preview refreshes

**Lost When**:
- User closes editor
- User saves post with clean theme (optional warning)
- Page reloads
- Session ends

---

## 9. Visual States

### 9.1 Clean Theme State

**Condition**: `isCustomized === false`

**Indicators**:
```
Settings Panel:
Theme: [Default              ▾]  ← No "(customized)"
[Save as New Theme]              ← DISABLED
[Update Theme]                   ← DISABLED
[Reset modifications]            ← DISABLED
```

**Controls**:
- No customization indicators
- All show theme values

---

### 9.2 Customized State

**Condition**: `isCustomized === true`

**Indicators**:
```
Settings Panel:
Theme: [Default (customized) ▾]  ← Shows "(customized)"
[Save as New Theme]              ← ENABLED
[Update Theme]                   ← ENABLED (if not Default)
[Reset modifications]            ← ENABLED
```

**Controls**:
- Customization indicators on modified controls
- Badge/icon/highlight

---

### 9.3 Saving State

**Condition**: Theme operation in progress

**Indicators**:
```
Settings Panel:
⏳ Saving Theme...
[Buttons disabled]
```

**Duration**: Brief (1-3 seconds)

---

### 9.4 Loading State

**Condition**: Themes loading from database

**Indicators**:
```
Settings Panel:
Theme: [Loading...       ⏳]
[Buttons disabled]
```

**Duration**: Very brief (<1 second)

---

## 10. Error Handling

### 10.1 Theme Not Found

**Scenario**: `currentTheme` references non-existent `theme_id`

**Auto-Recovery**:
1. Set `currentTheme = ""`
2. Keep customizations
3. Show warning: "Theme not found. Switched to Default."

---

### 10.2 Save/Update Failure

**Create Theme Failed**:
```
┌─────────────────────────────────────────┐
│  ✗ Failed to Create Theme              │
├─────────────────────────────────────────┤
│                                         │
│  Could not save theme to database.     │
│                                         │
│  Error: Connection timeout             │
│                                         │
│  Your block customizations are safe.   │
│                                         │
│              [Try Again]  [Close]      │
│                                         │
└─────────────────────────────────────────┘
```

**Important**: Block customizations remain intact

---

### 10.3 Validation Errors

**Empty Name**:
```
Theme Name:
[....................................]
✗ Theme name cannot be empty
```

**Duplicate Name**:
```
Theme Name:
[My Theme............................]
✗ A theme with this name already exists
```

**Invalid Characters**:
```
Theme Name:
[My Theme!@#$........................]
✗ Theme name can only contain letters, numbers,
   spaces, and hyphens
```

---

## 11. Editor Preview

### 11.1 Preview Display Mode

**Critical Rule**: Accordion ALWAYS shown expanded in editor, regardless of `initiallyOpen` attribute.

**Reasoning**:
- User needs to edit content
- Content area must be visible
- `initiallyOpen` only affects frontend initial state

**Editor View**:
```
┌─────────────────────────────────┐
│ Accordion Title              [▾]│ ← Always clickable but open
├─────────────────────────────────┤
│                                 │
│ Content area always visible     │
│                                 │
│ [User can add blocks here]      │
│                                 │
└─────────────────────────────────┘
```

**Frontend View** (`initiallyOpen = false`):
```
┌─────────────────────────────────┐
│ Accordion Title              [▶]│ ← Starts collapsed
└─────────────────────────────────┘
```

**Frontend View** (`initiallyOpen = true`):
```
┌─────────────────────────────────┐
│ Accordion Title              [▾]│ ← Starts expanded
├─────────────────────────────────┤
│ Content visible on page load    │
└─────────────────────────────────┘
```

---

### 11.2 Real-Time Style Application

**All effective styles apply immediately**:

- Color changes → instant preview update
- Border changes → instant preview update
- Border radius → instant preview update
- Icon changes → instant preview update
- Typography → instant preview update
- All attributes → instant preview update

**No delay**: <100ms from control change to preview render

---

### 11.3 Icon Preview

**Character Icon**:
```
┌─────────────────────────────────┐
│ [▾] Accordion Title             │ ← Character renders
├─────────────────────────────────┤
```

**Image Icon**:
```
┌─────────────────────────────────┐
│ [🖼] Accordion Title             │ ← Image loads/displays
├─────────────────────────────────┤
```

**Icon Positions**:

`left`:
```
[▾] Accordion Title
```

`right`:
```
Accordion Title [▾]
```

`extreme-left`:
```
[▾]                    Accordion Title
```

`extreme-right`:
```
Accordion Title                    [▾]
```

---

### 11.4 Icon Inheritance Preview

**When `iconColor = null`**:
- Icon uses `titleColor` value
- Updates automatically when `titleColor` changes

**When `iconSize = null`**:
- Icon uses `titleFontSize` value
- Updates automatically when `titleFontSize` changes
- When icon is a image, always resize to 18px using image ratio of 1:1 via css

---

### 11.5 Preview Limitations

**Things That DON'T Preview**:

1. **Initial Open/Closed State**
   - Editor always shows expanded
   - `initiallyOpen` only affects frontend

2. **Animation**
   - Editor doesn't animate expand/collapse
   - Always static in open state

3. **Active States**
   - `activeTitleColor` and `activeTitleBackgroundColor` not shown
   - Would need open/close interaction

---

### 11.6 Preview Interactions

**Interactive in Editor**:
- Edit title text inline
- Edit content (add/remove blocks)
- Select block for toolbar/sidebar

**NOT Interactive**:
- Clicking header doesn't collapse
- Icon doesn't animate/rotate
- No "active" effects 

---

## 12. Attribute Reference Quick Guide

### Structural Attributes (Never Customizable)

```
accordionId          string    ""           Generated on creation
title                string    "Accordion Title"
content              string    ""           Rich text
initiallyOpen        boolean   false        Frontend initial state
```

### Meta Attributes (Not Stored in Themes)

```
currentTheme         string    ""           Theme ID or "" for Default
customizationCache   object    {}           Session-only, not serialized
isCustomized         boolean   false        Computed, not serialized
```

### Customizable Attributes - Title Styling

```
titleColor               string   "#333333"
titleBackgroundColor     string   "#f5f5f5"
titleFontSize            number   16         (px)
titleFontWeight          string   "600"
titlePadding             object   {top:12, right:12, bottom:12, left:12}
titleAlignment           string   "left"
titleTextTransform       string   "none"
titleFontStyle           string   "normal"
titleTextDecoration      string   "none"
headingLevel             string   "none"
```

### Customizable Attributes - Content Styling

```
contentBackgroundColor   string   "transparent"
```

### Customizable Attributes - Border & Spacing

```
accordionBorderThickness number   1          (px)
accordionBorderStyle     string   "solid"
accordionBorderColor     string   "#e0e0e0"
accordionBorderRadius    object   {topLeft:4, topRight:4, bottomLeft:4, bottomRight:4}
accordionShadow          string   "none"
dividerBorderThickness   number   0          (px)
dividerBorderStyle       string   "solid"
dividerBorderColor       string   "#e0e0e0"
```

### Customizable Attributes - Icon Settings

```
showIcon             boolean   true
iconPosition         string    "right"
iconColor            string    null         (inherits from titleColor)
iconSize             number    null         (inherits from titleFontSize)
iconTypeClosed       string    "plus"
iconTypeOpen         string    "none"
iconRotation         number    0            (degrees)
```

### Customizable Attributes - Interactive States

```
hoverTitleColor              string   null  (inherits from titleColor)
hoverTitleBackgroundColor    string   "#eeeeee"
activeTitleColor             string   null  (inherits from titleColor)
activeTitleBackgroundColor   string   null  (inherits from titleBackgroundColor)
```

---

## 13. Shared Architecture Implementation

### 13.1 Shared Components

All UI panels described in this document are implemented as shared, reusable React components located in `src/shared/components/`:

**Component Structure**:
- `ThemeSelector.js` - Theme dropdown and theme management buttons (Section 2.1)
- `ColorPanel.js` - All color controls (Section 2.2)
- `TypographyPanel.js` - Typography and text styling controls (Section 2.3)
- `BorderPanel.js` - Border and spacing controls (Section 2.4)
- `IconPanel.js` - Icon configuration controls (Section 2.6)

**Usage**: Both Accordion and Tabs blocks import and use these same components, ensuring consistent UI/UX across all blocks.

### 13.2 Shared Logic Modules

**Theme System** (`src/shared/theme-system/`):
- `theme-manager.js` - Theme CRUD operations (create, read, update, delete, rename)
- `cascade-resolver.js` - 3-tier value cascade resolution (CSS defaults → Theme → Customizations)
- `theme-storage.js` - Database interaction for theme persistence
- `theme-validator.js` - Theme name validation and uniqueness checks

**Attribute Definitions** (`src/shared/attributes/`):
- `color-attributes.js` - Color attribute definitions with validation
- `typography-attributes.js` - Typography attribute definitions
- `border-attributes.js` - Border and spacing attribute definitions
- `icon-attributes.js` - Icon attribute definitions
- `spacing-attributes.js` - Padding/margin attribute definitions

**Utilities** (`src/shared/utils/`):
- `css-parser.js` - Parse CSS files to extract default values
- `id-generator.js` - Generate unique block IDs and theme IDs
- `validation.js` - Shared validation functions (color, number, enum)

### 13.3 Block-Specific vs Shared

**What's Shared**:
- All UI component implementations
- Theme system logic and cascade resolution
- Attribute structure and naming conventions
- Validation rules
- Database interaction patterns

**What's Block-Specific**:
- CSS files: `accordion.css` vs `tabs.css` (different default values)
- Database storage: `accordion_themes` vs `tabs_themes` (separate theme libraries)
- Block registration: `wp:custom/accordion` vs `wp:custom/tabs`
- Event names: `accordionThemeUpdated` vs `tabsThemeUpdated`
- AJAX actions: `get_accordion_themes` vs `get_tabs_themes`

**Key Principle**: Shared logic accepts a `blockType` parameter (`'accordion'` or `'tabs'`) to determine which CSS file to parse and which database option to use.

### 13.4 Implementation Order

When implementing the accordion block editor UI, follow this order:

**Phase 1: Build Shared Infrastructure** (Do First)
1. Create `src/shared/` directory structure
2. Implement shared theme system modules
3. Define shared attribute modules
4. Build shared UI components
5. Create shared utility functions

**Phase 2: Implement Accordion Block** (Use Shared Modules)
1. Register `wp:custom/accordion` block
2. Create `accordion.css` with `:root` CSS custom properties
3. Import and use shared components in accordion block
4. Configure block-specific parameters (blockType = 'accordion')
5. Test all UI panels and theme operations

**Phase 3: Implement Tabs Block** (Reuse Everything)
1. Register `wp:custom/tabs` block
2. Create `tabs.css` with `:root` CSS custom properties
3. Import and use same shared components
4. Configure block-specific parameters (blockType = 'tabs')
5. Test compatibility and consistency

**Critical**: By building shared infrastructure first, both blocks can be implemented cleanly without code duplication or refactoring.

