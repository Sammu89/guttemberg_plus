# Guttemberg Plus - Complete Sidebar & Theme System Architecture

**Version:** 2.0
**Last Updated:** December 2024
**Scope:** Comprehensive documentation for sidebar controls, theme system, responsive system, and block integration.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Principles](#2-architecture-principles)
3. [Schema-First Design](#3-schema-first-design)
4. [Theme System](#4-theme-system)
5. [Sidebar Structure](#5-sidebar-structure)
6. [Control Components](#6-control-components)
7. [Responsive System](#7-responsive-system)
8. [Icon System](#8-icon-system)
9. [Shared Templates](#9-shared-templates)
10. [CSS Generation](#10-css-generation)
11. [File Structure](#11-file-structure)
12. [Adding New Features](#12-adding-new-features)
13. [Extending to Other Blocks](#13-extending-to-other-blocks)
14. [Implementation Phases](#14-implementation-phases)
15. [Quick Reference](#15-quick-reference)

---

## 1. Overview

### What This System Does

The Guttemberg Plus sidebar system provides:

- **Theme Management**: Create, save, apply, and modify themes for blocks
- **Visual Customization**: Colors, typography, borders, shadows, spacing, icons, animations
- **Responsive Design**: Desktop/tablet/mobile values with inheritance
- **Schema-Driven UI**: Sidebar auto-generates from JSON schema
- **Delta Storage**: Only differences from defaults are saved (efficient storage)
- **Reusable Components**: Lego-style controls shared across all blocks

### Blocks Supported

| Block | Type | Schema File |
|-------|------|-------------|
| Accordion | `accordion` | `schemas/accordion.json` |
| Tabs | `tabs` | `schemas/tabs.json` |
| Table of Contents | `toc` | `schemas/toc.json` |

### Key Technologies

- **React** - UI components
- **WordPress Gutenberg** - Block editor integration
- **Redux (@wordpress/data)** - Theme state management
- **PHP** - CSS generation, REST API, database storage
- **JSON Schema** - Single source of truth for attributes

---

## 2. Architecture Principles

### 2.1 Single Source of Truth

**The schema file is the ONLY place where attributes are defined.**

```
schemas/accordion.json
        ↓
   [schema-compiler.js]
        ↓
   24 auto-generated files
   (attributes, types, CSS, PHP, docs)
```

**Never edit auto-generated files manually.** They are overwritten on every build.

### 2.2 Delta-Based Storage

**Only differences from defaults are stored.**

```javascript
// Schema default
titleFontSize: "1.125rem"

// User changes to "1.5rem"
// Theme stores ONLY the delta:
{ titleFontSize: "1.5rem" }

// Not the full object with all 50 attributes
```

**Benefits:**
- Smaller database storage
- Faster theme loading
- Easy to detect what changed
- Clean theme updates (only deltas need updating)

### 2.3 Three-Tier CSS Cascade

```
┌─────────────────────────────────────────────────────────────┐
│ TIER 1: CSS DEFAULTS (Lowest Priority)                      │
│ Source: Schema defaults → CSS variables in :root            │
│ Example: --accordion-title-color: #333333;                  │
├─────────────────────────────────────────────────────────────┤
│ TIER 2: THEME CSS (Medium Priority)                         │
│ Source: Theme deltas → CSS class .accordion-theme-{name}    │
│ Example: .accordion-theme-dark { --accordion-title-color: #fff; }│
├─────────────────────────────────────────────────────────────┤
│ TIER 3: BLOCK CUSTOMIZATIONS (Highest Priority)             │
│ Source: Block attributes → Inline styles or <style> block   │
│ Example: #acc-abc123 { --accordion-title-color: #ff0000; }  │
└─────────────────────────────────────────────────────────────┘
```

**Resolution:** Tier 3 > Tier 2 > Tier 1 (higher tier wins)

### 2.4 Lego Component Architecture

Controls are built from smallest to largest:

```
Level 0: Atoms (smallest pieces)
├── ResetButton
├── NumberInput
├── UnitSelector
├── LinkToggle
├── DeviceSwitcher
└── IconButton

Level 1: Molecules (combine atoms)
├── ResponsiveLabel (Label + DeviceSwitcher)
├── IconButtonGroup (multiple IconButtons)
└── UnitNumberInput (NumberInput + UnitSelector)

Level 2: Organisms (full controls)
├── BoxControl (4x NumberInput + LinkToggle + UnitSelector + DeviceSwitcher)
├── ColorControl (Native WordPress ColorPicker wrapper)
├── SliderWithInput (Slider + NumberInput + UnitSelector + DeviceSwitcher)
├── BorderStyleControl (IconButtonGroup with 7 border style icons)
└── ShadowControl (Preset buttons + TextInput + ColorControl)
```

**Key Rule:** Modifying an atom propagates changes to all molecules and organisms that use it.

---

## 3. Schema-First Design

### 3.1 Schema File Structure

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Accordion Block Theme Configuration",
  "version": "1.0.0",
  "blockType": "accordion",
  "blockName": "Accordion",

  "groups": {
    "groupName": {
      "title": "Display Title",
      "tab": "settings|appearance",
      "order": 1,
      "initialOpen": true,
      "icon": "iconName",
      "subgroups": ["subgroup1", "subgroup2"]
    }
  },

  "attributes": {
    "attributeName": {
      "type": "string|number|boolean|object",
      "default": "value",
      "group": "groupName",
      "subgroup": "subgroupName",
      "label": "Display Label",
      "description": "Help text",
      "themeable": true|false,
      "responsive": true|false,
      "control": "ControlType",
      "cssVar": "css-variable-name",
      "cssProperty": "css-property",
      "appliesTo": "element",
      "order": 1
    }
  }
}
```

### 3.2 Group Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Display title in sidebar |
| `tab` | string | `"settings"` or `"appearance"` |
| `order` | number | Sort order within tab |
| `initialOpen` | boolean | Panel open by default? |
| `icon` | string | WordPress icon name |
| `subgroups` | array | List of subgroup names for section switcher |

### 3.3 Attribute Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | `"string"`, `"number"`, `"boolean"`, `"object"` |
| `default` | any | Yes | Default value |
| `group` | string | Yes | Which group this belongs to |
| `subgroup` | string | No | Which subgroup (for section switcher) |
| `label` | string | Yes | Display label |
| `description` | string | Yes | Help text |
| `themeable` | boolean | Yes | Can be saved in themes? |
| `responsive` | boolean | No | Has desktop/tablet/mobile values? |
| `control` | string | Yes* | UI control type (if visible) |
| `cssVar` | string | No | CSS variable name (without prefix) |
| `cssProperty` | string | No | CSS property this maps to |
| `appliesTo` | string | No | Which element (`"title"`, `"content"`, `"icon"`) |
| `order` | number | No | Sort order within group |
| `min` | number | No | Minimum value (for RangeControl) |
| `max` | number | No | Maximum value (for RangeControl) |
| `step` | number | No | Step increment (for RangeControl) |
| `unit` | string | No | CSS unit (`"px"`, `"em"`, `"rem"`, `"%"`) |
| `units` | array | No | Available units for UnitSelector |
| `options` | array | No | Options for SelectControl |
| `showWhen` | object | No | Conditional visibility |
| `disabledWhen` | object | No | Conditional disabling |

### 3.4 Control Types

| Control Type | Description | Additional Props |
|--------------|-------------|------------------|
| `ColorControl` | Color picker with palette | - |
| `GradientControl` | Color/Gradient switcher | - |
| `RangeControl` | Slider | `min`, `max`, `step`, `unit` |
| `SliderWithInput` | Slider + number input + units | `min`, `max`, `units` |
| `SelectControl` | Dropdown | `options` |
| `TextControl` | Text input | - |
| `ToggleControl` | On/off switch | - |
| `BoxControl` | 4-side input (padding, margin) | `units`, `min`, `max` |
| `BorderStyleControl` | Border style icon buttons | - |
| `ShadowControl` | Shadow presets + custom | - |
| `AlignmentControl` | Alignment icon buttons | - |
| `IconPickerControl` | Icon selection | - |
| `AppearanceControl` | Font weight + style combined | - |
| `DecorationControl` | Text decoration buttons | - |
| `LetterCaseControl` | Text transform buttons | - |

### 3.5 Conditional Visibility

```json
"iconRotation": {
  "showWhen": {
    "showIcon": [true]
  }
}
```

The `iconRotation` control only appears when `showIcon` is `true`.

```json
"dividerColor": {
  "showWhen": {
    "showDivider": [true]
  }
}
```

### 3.6 Themeable vs Non-Themeable

**Themeable (`themeable: true`):**
- Saved in theme deltas
- Can be customized per-block
- Shows red dot when customized
- Example: colors, typography, spacing

**Non-Themeable (`themeable: false`):**
- NOT saved in themes
- Per-block only (structural/behavioral)
- No customization indicator
- Example: `accordionId`, `title`, `content`, `initiallyOpen`

---

## 4. Theme System

### 4.1 Data Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      THEME DATA FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Schema     │───►│   Defaults   │───►│  Expected    │  │
│  │   Defaults   │    │   (merged)   │    │   Values     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                    │          │
│                             ▼                    ▼          │
│                      ┌──────────────┐    ┌──────────────┐  │
│                      │    Theme     │───►│   Compare    │  │
│                      │    Deltas    │    │   (detect    │  │
│                      └──────────────┘    │   changes)   │  │
│                             │            └──────────────┘  │
│                             ▼                    │          │
│                      ┌──────────────┐           ▼          │
│                      │    Block     │    ┌──────────────┐  │
│                      │  Attributes  │───►│ isCustomized │  │
│                      │  (deltas)    │    │    flag      │  │
│                      └──────────────┘    └──────────────┘  │
│                             │                              │
│                             ▼                              │
│                      ┌──────────────┐                      │
│                      │  Effective   │                      │
│                      │   Values     │                      │
│                      │ (displayed)  │                      │
│                      └──────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Key Concepts

#### Schema Defaults
The default values defined in the schema. Single source of truth.

```javascript
// From accordion-attributes.js (auto-generated)
const schemaDefaults = {
  titleColor: "#333333",
  titleFontSize: 1.125,
  borderWidth: 1,
  // ... all defaults
};
```

#### Theme Deltas
Only the values that differ from defaults. Stored in database.

```javascript
// Theme "Dark" stored in wp_options
{
  name: "Dark",
  values: {
    titleColor: "#ffffff",      // Changed from #333333
    titleBackgroundColor: "#1a1a1a"  // Changed from #f5f5f5
    // titleFontSize NOT stored (uses default 1.125)
  }
}
```

#### Expected Values
Defaults + Theme deltas merged. What the block SHOULD look like without customizations.

```javascript
// expectedValues = applyDeltas(defaults, theme.values)
{
  titleColor: "#ffffff",           // From theme
  titleBackgroundColor: "#1a1a1a", // From theme
  titleFontSize: 1.125,            // From defaults
  borderWidth: 1,                  // From defaults
  // ... all values
}
```

#### Block Attributes
The actual values stored on the block. May include customizations.

```javascript
// Block attributes (in post content)
{
  currentTheme: "Dark",
  titleColor: "#ff0000",  // User customized! Different from theme
  // Other values not stored = use expectedValues
}
```

#### Effective Values
What's actually displayed. In edit.js, this equals `attributes` directly.

```javascript
// In edit.js
const effectiveValues = attributes;

// The attributes already contain the merged result:
// - Values user set explicitly
// - Values from theme (via handleThemeChange)
// - Values from defaults (via initial block creation)
```

#### isCustomized Flag
True when block attributes differ from expectedValues.

```javascript
const isCustomized = Object.keys(attributes).some(key => {
  if (excludeFromCheck.includes(key)) return false;
  return attributes[key] !== expectedValues[key];
});
```

### 4.3 Theme Operations

#### Save New Theme
1. Get current snapshot of themeable attributes
2. Calculate deltas vs defaults
3. Save to database via REST API
4. Update Redux store
5. Clear session cache
6. Set block to use new theme

```javascript
const handleSaveNewTheme = async (themeName) => {
  const snapshot = getThemeableSnapshot(attributes, excludeList);
  const deltas = calculateDeltas(snapshot, allDefaults, excludeList);
  await createTheme(blockType, themeName, deltas);
  setAttributes({ currentTheme: themeName, customizations: {} });
};
```

#### Update Existing Theme
1. Get current snapshot
2. Calculate new deltas
3. Update database via REST API
4. Update Redux store
5. Batch update other clean blocks using this theme
6. Clear session cache

#### Delete Theme
1. Delete from database
2. Remove from Redux store
3. Reset block to defaults
4. Batch reset other blocks using deleted theme

#### Switch Theme
1. Load new theme's deltas from store
2. Apply deltas to defaults = new expectedValues
3. Set all themeable attributes to expectedValues
4. Clear customizations

#### Reset Customizations
1. Get expectedValues (defaults + theme)
2. Set all themeable attributes to expectedValues
3. Clear customizations object

### 4.4 Session Cache

Temporary in-memory storage for unsaved customizations.

**Purpose:** When switching themes, preserve user's unsaved work.

```javascript
// User is on "Dark" theme, makes changes
sessionCache = {
  "Dark": { titleColor: "#ff0000", ... }  // Unsaved changes
}

// User switches to "Light" theme
// Changes are cached, not lost

// User switches back to "Dark"
// Option to restore cached changes
```

### 4.5 Customizations Attribute

Special attribute stored on block for Tier 3 CSS generation.

```javascript
// In block attributes
{
  currentTheme: "Dark",
  customizations: {
    titleColor: "#ff0000"  // Only customized values
  }
}
```

Used by `save.js` to generate inline `<style>` for this specific block.

### 4.6 Redux Store Structure

```javascript
// Store name: 'gutenberg-blocks/themes'
{
  accordionThemes: {
    "Dark": { name: "Dark", values: { ... } },
    "Light": { name: "Light", values: { ... } }
  },
  tabsThemes: { ... },
  tocThemes: { ... },
  themesLoaded: {
    accordion: true,
    tabs: false,
    toc: false
  },
  isLoading: false,
  error: null
}
```

### 4.7 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gutenberg-blocks/v1/themes/{blockType}` | Get all themes |
| POST | `/gutenberg-blocks/v1/themes` | Create theme |
| PUT | `/gutenberg-blocks/v1/themes/{blockType}/{name}` | Update theme |
| DELETE | `/gutenberg-blocks/v1/themes/{blockType}/{name}` | Delete theme |
| POST | `/gutenberg-blocks/v1/themes/{blockType}/{name}/rename` | Rename theme |

---

## 5. Sidebar Structure

### 5.1 Overall Layout

```
┌─────────────────────────────────────────┐
│ Theme Selector                          │  ← Always visible
│ [Theme dropdown] [Save] [Reset]         │
├─────────────────────────────────────────┤
│ [⚙ Settings] [🎨 Appearance]            │  ← Two tabs
├─────────────────────────────────────────┤
│                                         │
│ [Tab content based on selection]        │
│                                         │
├─────────────────────────────────────────┤
│ ⚠ Customization Warning (if applicable) │
└─────────────────────────────────────────┘
```

### 5.2 Settings Tab

Contains structural and behavioral options:

```
Settings Tab
├── Block Options (group)
│   ├── Block Width (TextControl)
│   ├── Heading Level (SelectControl)
│   ├── Block Alignment (AlignmentControl)
│   └── Open by Default (ToggleControl)
│
└── Responsive Breakpoints (group)
    ├── Mobile Breakpoint (NumberInput)
    │   └── Helper: "Changes apply site-wide"
    └── Tablet Breakpoint (NumberInput)
        └── Helper: "Changes apply site-wide"
```

### 5.3 Appearance Tab

Contains visual customization options with subgroups:

```
Appearance Tab
├── Borders (group with subgroups)
│   ├── [Subgroup Selector: External | Divider]
│   │
│   ├── External Borders (subgroup)
│   │   ├── Border Color (ColorControl)
│   │   ├── Border Style (BorderStyleControl)
│   │   ├── Border Width (BoxControl)
│   │   ├── Border Radius (BoxControl)
│   │   ├── Padding (BoxControl)
│   │   ├── Block Margin (BoxControl)
│   │   └── Shadow (ShadowControl)
│   │
│   └── Divider Border (subgroup)
│       ├── Show Divider (ToggleControl)
│       ├── Divider Color (ColorControl)
│       ├── Divider Style (BorderStyleControl)
│       └── Divider Width (SliderWithInput)
│
├── Colors (group with subgroups)
│   ├── [Subgroup Selector: Header | Panel]
│   │
│   ├── Header (subgroup)
│   │   ├── Header Text (ColorControl)
│   │   ├── Header Background (GradientControl)
│   │   ├── Header Hover Text (ColorControl)
│   │   └── Header Hover Background (GradientControl)
│   │
│   └── Panel (subgroup)
│       ├── Panel Text (ColorControl)
│       └── Panel Background (GradientControl)
│
├── Typography (group with subgroups)
│   ├── [Subgroup Selector: Header | Header Hover | Content]
│   │
│   ├── Header (subgroup)
│   │   ├── Font Family (SelectControl)
│   │   ├── Font Size (SliderWithInput) [responsive]
│   │   ├── Appearance (AppearanceControl)
│   │   ├── Letter Spacing (SliderWithInput) [responsive]
│   │   ├── Decoration (DecorationControl)
│   │   ├── Letter Case (LetterCaseControl)
│   │   └── Line Height (SliderWithInput) [responsive]
│   │
│   ├── Header Hover (subgroup) - inherits from Header
│   │
│   └── Content (subgroup) - inherits from WordPress defaults
│
├── Icon (group)
│   ├── Show Icon (ToggleControl)
│   ├── Icon Position (IconPositionControl)
│   ├── Icon Color (ColorControl)
│   ├── Icon Size (SliderWithInput) [responsive]
│   ├── Icon Source (SelectControl)
│   ├── Closed Icon (IconPickerControl)
│   ├── Change Icon When Active (ToggleControl)
│   ├── Open Icon (IconPickerControl) [conditional]
│   └── Icon Rotation (SliderWithInput)
│
└── Animation (group)
    ├── Animation Type (SelectControl)
    ├── Duration (SliderWithInput)
    └── Easing (SelectControl)
```

### 5.4 Subgroup Selector (Section Switcher)

When a group has subgroups, a selector appears at the top:

```
┌─────────────────────────────────────────┐
│ Colors                              ⋮   │ ← Three-dot menu
├─────────────────────────────────────────┤
│ ○ Header    ● Panel                     │ ← Section switcher
├─────────────────────────────────────────┤
│                                         │
│ Panel Text                              │ ← Only Panel controls shown
│ [Color picker]                          │
│                                         │
│ Panel Background                        │
│ [Classic | Gradient]                    │
│ [Color/Gradient picker]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior:**
- User selects ONE subgroup at a time (radio-style, Option B)
- Only controls belonging to selected subgroup are shown
- Three-dot menu opens the subgroup selector dropdown

### 5.5 Component Hierarchy

```
<InspectorControls>
  <ThemeSelector />

  <TabbedInspector>
    <SettingsTab>
      <SchemaPanels
        tab="settings"
        schema={schema}
        attributes={attributes}
        ...
      />
    </SettingsTab>

    <AppearanceTab>
      <SchemaPanels
        tab="appearance"
        schema={schema}
        attributes={attributes}
        ...
      />
    </AppearanceTab>
  </TabbedInspector>

  {isCustomized && <CustomizationWarning />}
</InspectorControls>
```

### 5.6 SchemaPanels Component

Auto-generates panels from schema:

```javascript
export function SchemaPanels({ tab, schema, attributes, setAttributes, effectiveValues }) {
  // Filter groups by tab
  const groups = Object.entries(schema.groups)
    .filter(([, config]) => config.tab === tab)
    .sort((a, b) => a[1].order - b[1].order);

  return groups.map(([groupName, groupConfig]) => {
    if (groupConfig.subgroups) {
      return (
        <SubgroupPanel
          key={groupName}
          groupName={groupName}
          groupConfig={groupConfig}
          schema={schema}
          attributes={attributes}
          setAttributes={setAttributes}
          effectiveValues={effectiveValues}
        />
      );
    }

    return (
      <GenericPanel
        key={groupName}
        schemaGroup={groupName}
        schema={schema}
        attributes={attributes}
        setAttributes={setAttributes}
        effectiveValues={effectiveValues}
      />
    );
  });
}
```

### 5.7 GenericPanel Component

Renders controls for a single group:

```javascript
export function GenericPanel({ schema, schemaGroup, attributes, setAttributes, effectiveValues }) {
  // Get group config
  const groupConfig = schema.groups[schemaGroup];

  // Filter attributes for this group
  const groupAttributes = Object.entries(schema.attributes)
    .filter(([, config]) => config.group === schemaGroup)
    .sort((a, b) => (a[1].order || 999) - (b[1].order || 999));

  return (
    <PanelBody title={groupConfig.title} initialOpen={groupConfig.initialOpen}>
      {groupAttributes.map(([attrName, attrConfig]) => (
        <ControlRenderer
          key={attrName}
          attrName={attrName}
          attrConfig={attrConfig}
          value={effectiveValues[attrName]}
          onChange={(value) => setAttributes({ [attrName]: value })}
          attributes={attributes}
          expectedValues={expectedValues}
        />
      ))}
    </PanelBody>
  );
}
```

---

## 6. Control Components

### 6.1 Atomic Components (Level 0)

#### ResetButton

Resets an attribute to its expected value (theme or default).

```jsx
// Location: shared/src/components/controls/ResetButton.js

import { Button } from '@wordpress/components';
import { reset } from '@wordpress/icons';

export function ResetButton({ onClick, disabled = false }) {
  return (
    <Button
      icon={reset}
      label="Reset to default"
      onClick={onClick}
      disabled={disabled}
      isSmall
      className="gutplus-reset-button"
    />
  );
}

// Usage:
<ResetButton
  onClick={() => setAttributes({ titleColor: expectedValues.titleColor })}
  disabled={attributes.titleColor === expectedValues.titleColor}
/>
```

#### DeviceSwitcher

Switches between desktop/tablet/mobile editing.

```jsx
// Location: shared/src/components/controls/DeviceSwitcher.js

import { Button, ButtonGroup } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

export function DeviceSwitcher({ value, onChange }) {
  const devices = [
    { name: 'desktop', icon: desktop, label: 'Desktop' },
    { name: 'tablet', icon: tablet, label: 'Tablet' },
    { name: 'mobile', icon: mobile, label: 'Mobile' },
  ];

  return (
    <ButtonGroup className="gutplus-device-switcher">
      {devices.map(device => (
        <Button
          key={device.name}
          icon={device.icon}
          label={device.label}
          isPressed={value === device.name}
          onClick={() => onChange(device.name)}
          isSmall
        />
      ))}
    </ButtonGroup>
  );
}
```

#### UnitSelector

Selects CSS unit (px, em, rem, %).

```jsx
// Location: shared/src/components/controls/UnitSelector.js

import { ButtonGroup, Button } from '@wordpress/components';

export function UnitSelector({ value, onChange, units = ['px', 'em', 'rem'] }) {
  return (
    <ButtonGroup className="gutplus-unit-selector">
      {units.map(unit => (
        <Button
          key={unit}
          isPressed={value === unit}
          onClick={() => onChange(unit)}
          isSmall
        >
          {unit.toUpperCase()}
        </Button>
      ))}
    </ButtonGroup>
  );
}
```

#### LinkToggle

Toggles linked/unlinked state for BoxControl.

```jsx
// Location: shared/src/components/controls/LinkToggle.js

import { Button } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';

export function LinkToggle({ linked, onChange }) {
  return (
    <Button
      icon={linked ? link : linkOff}
      label={linked ? 'Unlink sides' : 'Link sides'}
      onClick={() => onChange(!linked)}
      isPressed={linked}
      isSmall
      className="gutplus-link-toggle"
    />
  );
}
```

#### IconButton

Single icon button for button groups.

```jsx
// Location: shared/src/components/controls/IconButton.js

import { Button } from '@wordpress/components';

export function IconButton({ icon, label, isSelected, onClick, disabled }) {
  return (
    <Button
      className={`gutplus-icon-button ${isSelected ? 'is-selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      label={label}
      showTooltip
    >
      {icon}
    </Button>
  );
}
```

### 6.2 Composite Components (Level 1)

#### IconButtonGroup

Row of icon buttons for selection.

```jsx
// Location: shared/src/components/controls/IconButtonGroup.js

import { BaseControl } from '@wordpress/components';
import { IconButton } from './IconButton';

export function IconButtonGroup({
  label,
  value,
  onChange,
  options,  // [{ icon: <svg>, value: 'left', label: 'Left' }]
  allowWrap = true
}) {
  return (
    <BaseControl label={label} className="gutplus-icon-button-group">
      <div className={`gutplus-button-row ${allowWrap ? 'wrap' : ''}`}>
        {options.map(option => (
          <IconButton
            key={option.value}
            icon={option.icon}
            label={option.label}
            isSelected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </BaseControl>
  );
}
```

#### ResponsiveWrapper

Wraps any control with device switcher for responsive editing.

```jsx
// Location: shared/src/components/controls/ResponsiveWrapper.js

import { useState } from '@wordpress/element';
import { BaseControl } from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { ResetButton } from './ResetButton';

export function ResponsiveWrapper({
  label,
  attribute,
  value,           // { desktop: x, tablet: y, mobile: z }
  onChange,        // (device, newValue) => void
  expectedValue,   // For reset functionality
  children         // (currentValue, currentDevice) => ReactNode
}) {
  const [device, setDevice] = useState('desktop');

  // Get value for current device, with inheritance
  const getCurrentValue = () => {
    if (value[device] !== undefined) return value[device];
    if (device === 'tablet' && value.desktop !== undefined) return value.desktop;
    if (device === 'mobile') {
      if (value.tablet !== undefined) return value.tablet;
      if (value.desktop !== undefined) return value.desktop;
    }
    return expectedValue?.desktop;
  };

  const currentValue = getCurrentValue();
  const isInherited = value[device] === undefined && device !== 'desktop';

  return (
    <BaseControl className="gutplus-responsive-control">
      <div className="gutplus-responsive-header">
        <span className="gutplus-responsive-label">
          {label}
          {isInherited && <span className="inherited-badge">Inherited</span>}
        </span>
        <DeviceSwitcher value={device} onChange={setDevice} />
        <ResetButton
          onClick={() => onChange(device, expectedValue?.[device] ?? expectedValue?.desktop)}
          disabled={value[device] === undefined}
        />
      </div>
      {children(currentValue, device, (newValue) => onChange(device, newValue))}
    </BaseControl>
  );
}
```

### 6.3 Full Controls (Level 2)

#### BoxControl

4-side input for padding, margin, border-width, border-radius.

```jsx
// Location: shared/src/components/controls/BoxControl.js

import { useState } from '@wordpress/element';
import { BaseControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { UnitSelector } from './UnitSelector';
import { LinkToggle } from './LinkToggle';
import { ResetButton } from './ResetButton';

export function BoxControl({
  label,
  value,           // { top: 10, right: 10, bottom: 10, left: 10, linked: true, unit: 'px' }
  onChange,
  expectedValue,
  units = ['px', 'em', 'rem'],
  min = 0,
  max = 100,
  responsive = false
}) {
  const [device, setDevice] = useState('desktop');

  // Get current device value for responsive, or direct value
  const currentValue = responsive
    ? (value[device] || value.desktop || expectedValue)
    : value;

  const { top, right, bottom, left, linked = true, unit = 'px' } = currentValue;

  const handleChange = (side, newValue) => {
    if (linked) {
      // All sides same value
      const updated = { top: newValue, right: newValue, bottom: newValue, left: newValue, linked, unit };
      if (responsive) {
        onChange({ ...value, [device]: updated });
      } else {
        onChange(updated);
      }
    } else {
      // Individual side
      const updated = { ...currentValue, [side]: newValue };
      if (responsive) {
        onChange({ ...value, [device]: updated });
      } else {
        onChange(updated);
      }
    }
  };

  const handleLinkToggle = (newLinked) => {
    const updated = { ...currentValue, linked: newLinked };
    if (responsive) {
      onChange({ ...value, [device]: updated });
    } else {
      onChange(updated);
    }
  };

  const handleUnitChange = (newUnit) => {
    const updated = { ...currentValue, unit: newUnit };
    if (responsive) {
      onChange({ ...value, [device]: updated });
    } else {
      onChange(updated);
    }
  };

  return (
    <BaseControl label={label} className="gutplus-box-control">
      <div className="gutplus-box-control-header">
        {responsive && <DeviceSwitcher value={device} onChange={setDevice} />}
        <UnitSelector value={unit} onChange={handleUnitChange} units={units} />
      </div>

      <div className="gutplus-box-control-inputs">
        {linked ? (
          // Single input when linked
          <NumberControl
            value={top}
            onChange={(val) => handleChange('top', parseInt(val))}
            min={min}
            max={max}
          />
        ) : (
          // Four inputs when unlinked
          <>
            <NumberControl label="Top" value={top} onChange={(val) => handleChange('top', parseInt(val))} min={min} max={max} />
            <NumberControl label="Right" value={right} onChange={(val) => handleChange('right', parseInt(val))} min={min} max={max} />
            <NumberControl label="Bottom" value={bottom} onChange={(val) => handleChange('bottom', parseInt(val))} min={min} max={max} />
            <NumberControl label="Left" value={left} onChange={(val) => handleChange('left', parseInt(val))} min={min} max={max} />
          </>
        )}
        <LinkToggle linked={linked} onChange={handleLinkToggle} />
      </div>
    </BaseControl>
  );
}
```

#### BorderStyleControl

7 icon buttons for border style selection.

```jsx
// Location: shared/src/components/controls/BorderStyleControl.js

import { IconButtonGroup } from './IconButtonGroup';

// Icons defined inside component (lego approach)
const BorderNoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeDasharray="2,2" opacity="0.5" />
    <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BorderSolidIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BorderDashedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
  </svg>
);

const BorderDottedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1,2" strokeLinecap="round" />
  </svg>
);

const BorderDoubleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="5" y="5" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const BorderGrooveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="#999" strokeWidth="2" />
    <rect x="4" y="4" width="12" height="12" fill="none" stroke="#ccc" strokeWidth="1" />
  </svg>
);

const BorderRidgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" />
    <rect x="4" y="4" width="12" height="12" fill="none" stroke="#999" strokeWidth="1" />
  </svg>
);

export function BorderStyleControl({ value, onChange, label = "Border Style" }) {
  const options = [
    { icon: <BorderNoneIcon />, value: 'none', label: 'None' },
    { icon: <BorderSolidIcon />, value: 'solid', label: 'Solid' },
    { icon: <BorderDashedIcon />, value: 'dashed', label: 'Dashed' },
    { icon: <BorderDottedIcon />, value: 'dotted', label: 'Dotted' },
    { icon: <BorderDoubleIcon />, value: 'double', label: 'Double' },
    { icon: <BorderGrooveIcon />, value: 'groove', label: 'Groove' },
    { icon: <BorderRidgeIcon />, value: 'ridge', label: 'Ridge' },
  ];

  return (
    <IconButtonGroup
      label={label}
      value={value}
      onChange={onChange}
      options={options}
    />
  );
}
```

#### ShadowControl

Shadow presets + custom text input + color picker.

```jsx
// Location: shared/src/components/controls/ShadowControl.js

import { useState } from '@wordpress/element';
import { BaseControl, TextControl, Button, Popover, ColorPicker } from '@wordpress/components';
import { IconButtonGroup } from './IconButtonGroup';

// Shadow preset icons
const ShadowNoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="4" y="4" width="16" height="16" fill="#f0f0f0" stroke="#ccc" />
  </svg>
);

const ShadowSubtleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="5" y="5" width="16" height="16" fill="rgba(0,0,0,0.1)" />
    <rect x="4" y="4" width="16" height="16" fill="#f0f0f0" stroke="#ccc" />
  </svg>
);

const ShadowMediumIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="6" y="6" width="16" height="16" fill="rgba(0,0,0,0.15)" />
    <rect x="4" y="4" width="16" height="16" fill="#f0f0f0" stroke="#ccc" />
  </svg>
);

const ShadowStrongIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="7" y="7" width="16" height="16" fill="rgba(0,0,0,0.2)" />
    <rect x="4" y="4" width="16" height="16" fill="#f0f0f0" stroke="#ccc" />
  </svg>
);

const ShadowHeavyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="8" y="8" width="16" height="16" fill="rgba(0,0,0,0.3)" />
    <rect x="4" y="4" width="16" height="16" fill="#f0f0f0" stroke="#ccc" />
  </svg>
);

// Shadow presets with CSS variable for color
const SHADOW_PRESETS = [
  { name: 'none', value: 'none', icon: <ShadowNoneIcon /> },
  { name: 'subtle', value: '0 1px 3px var(--gutplus-shadow-color, rgba(0,0,0,0.12))', icon: <ShadowSubtleIcon /> },
  { name: 'medium', value: '0 4px 6px var(--gutplus-shadow-color, rgba(0,0,0,0.15))', icon: <ShadowMediumIcon /> },
  { name: 'strong', value: '0 10px 20px var(--gutplus-shadow-color, rgba(0,0,0,0.2))', icon: <ShadowStrongIcon /> },
  { name: 'heavy', value: '0 15px 35px var(--gutplus-shadow-color, rgba(0,0,0,0.25))', icon: <ShadowHeavyIcon /> },
];

export function ShadowControl({
  label = "Shadow",
  shadowValue,
  shadowColorValue,
  onShadowChange,
  onShadowColorChange
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customMode, setCustomMode] = useState(false);

  // Detect which preset is selected
  const selectedPreset = SHADOW_PRESETS.find(p => p.value === shadowValue)?.name || 'custom';

  const handlePresetClick = (preset) => {
    if (preset.name === selectedPreset && preset.name !== 'none') {
      // Toggle custom mode
      setCustomMode(!customMode);
    } else {
      onShadowChange(preset.value);
      setCustomMode(false);
    }
  };

  return (
    <BaseControl label={label} className="gutplus-shadow-control">
      {/* Preset buttons */}
      <div className="gutplus-shadow-presets">
        {SHADOW_PRESETS.map(preset => (
          <Button
            key={preset.name}
            className={`gutplus-shadow-preset ${selectedPreset === preset.name ? 'is-selected' : ''}`}
            onClick={() => handlePresetClick(preset)}
            label={preset.name}
          >
            {preset.icon}
          </Button>
        ))}
        <Button
          variant="link"
          onClick={() => {
            onShadowChange('none');
            setCustomMode(false);
          }}
        >
          Clear
        </Button>
      </div>

      {/* Custom shadow input */}
      {(customMode || selectedPreset === 'custom') && (
        <TextControl
          label="Custom CSS"
          value={shadowValue}
          onChange={onShadowChange}
          placeholder="0 4px 6px rgba(0,0,0,0.1)"
        />
      )}

      {/* Shadow color picker */}
      {selectedPreset !== 'none' && (
        <div className="gutplus-shadow-color">
          <span>Shadow Color</span>
          <Button
            className="gutplus-color-swatch"
            style={{ backgroundColor: shadowColorValue }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <Popover onClose={() => setShowColorPicker(false)}>
              <ColorPicker
                color={shadowColorValue}
                onChange={onShadowColorChange}
              />
            </Popover>
          )}
        </div>
      )}
    </BaseControl>
  );
}
```

#### SliderWithInput

Slider with number input, unit selector, and optional device switcher.

```jsx
// Location: shared/src/components/controls/SliderWithInput.js

import { useState } from '@wordpress/element';
import { BaseControl, RangeControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { UnitSelector } from './UnitSelector';
import { ResetButton } from './ResetButton';

export function SliderWithInput({
  label,
  value,
  onChange,
  expectedValue,
  min = 0,
  max = 100,
  step = 1,
  unit,
  units,
  responsive = false
}) {
  const [device, setDevice] = useState('desktop');

  // Get current value based on device
  const getCurrentValue = () => {
    if (!responsive) return value;

    const deviceValue = value?.[device];
    if (deviceValue !== undefined) return deviceValue;

    // Inheritance: mobile → tablet → desktop
    if (device === 'tablet') return value?.desktop;
    if (device === 'mobile') return value?.tablet ?? value?.desktop;
    return value?.desktop;
  };

  const currentValue = getCurrentValue();
  const numericValue = typeof currentValue === 'string'
    ? parseFloat(currentValue)
    : currentValue;

  const handleChange = (newValue) => {
    if (responsive) {
      onChange({ ...value, [device]: newValue });
    } else {
      onChange(newValue);
    }
  };

  return (
    <BaseControl className="gutplus-slider-with-input">
      <div className="gutplus-slider-header">
        <span className="gutplus-slider-label">{label}</span>
        {responsive && <DeviceSwitcher value={device} onChange={setDevice} />}
        {units && <UnitSelector value={unit} onChange={(u) => handleChange(currentValue)} units={units} />}
        <ResetButton
          onClick={() => handleChange(responsive ? expectedValue?.[device] : expectedValue)}
          disabled={currentValue === (responsive ? expectedValue?.[device] : expectedValue)}
        />
      </div>

      <div className="gutplus-slider-controls">
        <RangeControl
          value={numericValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          withInputField={false}
        />
        <NumberControl
          value={numericValue}
          onChange={(val) => handleChange(parseFloat(val))}
          min={min}
          max={max}
          step={step}
        />
        {unit && <span className="gutplus-unit-label">{unit}</span>}
      </div>
    </BaseControl>
  );
}
```

---

## 7. Responsive System

### 7.1 Overview

The responsive system allows attributes to have different values for desktop, tablet, and mobile.

**Key Principles:**
- Inheritance: mobile → tablet → desktop (if not set, inherits from larger)
- Delta storage: only explicitly set values are stored
- Global breakpoints: defined once, used by all blocks

### 7.2 Breakpoint Storage

```javascript
// WordPress Option: gutemberg_plus_breakpoints
{
  mobile: 600,   // max-width for mobile
  tablet: 1024   // max-width for tablet
}
```

**Access from PHP:**
```php
$breakpoints = get_option('gutemberg_plus_breakpoints', [
    'mobile' => 600,
    'tablet' => 1024
]);
```

**Access from JavaScript:**
```javascript
// Via REST API or localized script
const breakpoints = window.guttembergPlusSettings?.breakpoints || {
  mobile: 600,
  tablet: 1024
};
```

### 7.3 Responsive Attribute Schema

```json
{
  "titleFontSize": {
    "type": "object",
    "default": {
      "desktop": "1.125rem"
    },
    "responsive": true,
    "control": "SliderWithInput",
    "min": 0.5,
    "max": 4,
    "unit": "rem"
  }
}
```

### 7.4 Value Storage

**Schema Default (only desktop):**
```json
{ "desktop": "1.125rem" }
```

**User sets tablet and mobile:**
```json
{
  "desktop": "1.125rem",
  "tablet": "1rem",
  "mobile": "0.875rem"
}
```

**User only sets mobile (tablet inherits from desktop):**
```json
{
  "desktop": "1.125rem",
  "mobile": "0.875rem"
}
```

### 7.5 Inheritance Logic

```javascript
function getResponsiveValue(value, device) {
  // Direct value exists
  if (value[device] !== undefined) {
    return value[device];
  }

  // Inheritance chain
  if (device === 'tablet') {
    return value.desktop;
  }

  if (device === 'mobile') {
    return value.tablet ?? value.desktop;
  }

  return value.desktop;
}
```

### 7.6 CSS Generation

**PHP generates media queries only when values exist:**

```php
function generate_responsive_css($attribute, $value, $css_var, $breakpoints) {
    $css = '';

    // Desktop (always)
    if (isset($value['desktop'])) {
        $css .= "--{$css_var}: {$value['desktop']};\n";
    }

    // Tablet (only if explicitly set)
    if (isset($value['tablet'])) {
        $css .= "@media (max-width: {$breakpoints['tablet']}px) {\n";
        $css .= "  --{$css_var}: {$value['tablet']};\n";
        $css .= "}\n";
    }

    // Mobile (only if explicitly set)
    if (isset($value['mobile'])) {
        $css .= "@media (max-width: {$breakpoints['mobile']}px) {\n";
        $css .= "  --{$css_var}: {$value['mobile']};\n";
        $css .= "}\n";
    }

    return $css;
}
```

### 7.7 Responsive Attributes List

| Attribute | Why Responsive |
|-----------|----------------|
| `titleFontSize` | Typography scales on mobile |
| `contentFontSize` | Typography scales on mobile |
| `lineHeight` | Readability adjustment |
| `letterSpacing` | Typography adjustment |
| `headerPadding` | Less padding on smaller screens |
| `contentPadding` | Less padding on smaller screens |
| `blockMargin` | Layout spacing |
| `iconSize` | Smaller icons on mobile |
| `accordionWidth` | Full width on mobile |
| `iconPosition` | Different layout on mobile |

### 7.8 Adding Responsive to New Attribute

1. Add `"responsive": true` to schema
2. Change `type` to `"object"` with `default: { "desktop": value }`
3. Update PHP CSS generator to handle object values
4. Control automatically gets DeviceSwitcher via ResponsiveWrapper

---

## 8. Icon System

### 8.1 Philosophy

**Lego approach:** Icons specific to a control live INSIDE that control's file.

**Shared icons:** Common UI icons come from `@wordpress/icons`.

### 8.2 WordPress Icons (Shared)

```javascript
import {
  settings,      // Settings tab
  brush,         // Appearance tab
  link,          // Link toggle (linked)
  linkOff,       // Link toggle (unlinked)
  reset,         // Reset button
  moreVertical,  // Three-dot menu
  desktop,       // Device switcher
  tablet,        // Device switcher
  mobile,        // Device switcher
  chevronDown,   // Expand
  chevronUp,     // Collapse
  trash,         // Delete
  plus,          // Add
} from '@wordpress/icons';
```

### 8.3 Component-Specific Icons

Each control defines its own icons at the top of the file:

```jsx
// BorderStyleControl.js
const BorderSolidIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    {/* ... */}
  </svg>
);

// ShadowControl.js
const ShadowSubtleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    {/* ... */}
  </svg>
);

// AlignmentControl.js
const AlignLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    {/* ... */}
  </svg>
);
```

### 8.4 Icon Guidelines

| Property | Value |
|----------|-------|
| Size | 20x20 or 24x24 |
| Stroke | `currentColor` (inherits from CSS) |
| Fill | `none` or `currentColor` |
| ViewBox | Match size |
| Style | Match WordPress icon style (outlined) |

### 8.5 Adding New Icons

1. Open the control file that needs the icon
2. Add the icon component at the top of the file
3. Use it in the options array

```jsx
// Example: Adding a new border style
const BorderWavyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <path d="M2 10 Q5 5, 8 10 T14 10 T20 10" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Use in options
const options = [
  // ... existing options
  { icon: <BorderWavyIcon />, value: 'wavy', label: 'Wavy' },
];
```

---

## 9. Shared Templates

### 9.1 Purpose

Templates define reusable presets shared across all blocks:
- Font appearance (weight + style combinations)
- Shadow presets
- Animation presets
- Decoration options

### 9.2 File Location

```
schemas/shared-templates.json
```

### 9.3 Structure

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Guttemberg Plus Shared Templates",
  "version": "1.0.0",

  "appearance": {
    "description": "Font weight + style combinations",
    "presets": [
      { "name": "Default", "weight": "normal", "style": "normal" },
      { "name": "Thin", "weight": "100", "style": "normal" },
      { "name": "Extra Light", "weight": "200", "style": "normal" },
      { "name": "Light", "weight": "300", "style": "normal" },
      { "name": "Regular", "weight": "400", "style": "normal" },
      { "name": "Medium", "weight": "500", "style": "normal" },
      { "name": "Semi Bold", "weight": "600", "style": "normal" },
      { "name": "Bold", "weight": "700", "style": "normal" },
      { "name": "Extra Bold", "weight": "800", "style": "normal" },
      { "name": "Black", "weight": "900", "style": "normal" },
      { "name": "Thin Italic", "weight": "100", "style": "italic" },
      { "name": "Extra Light Italic", "weight": "200", "style": "italic" },
      { "name": "Light Italic", "weight": "300", "style": "italic" },
      { "name": "Regular Italic", "weight": "400", "style": "italic" },
      { "name": "Medium Italic", "weight": "500", "style": "italic" },
      { "name": "Semi Bold Italic", "weight": "600", "style": "italic" },
      { "name": "Bold Italic", "weight": "700", "style": "italic" },
      { "name": "Extra Bold Italic", "weight": "800", "style": "italic" },
      { "name": "Black Italic", "weight": "900", "style": "italic" }
    ]
  },

  "shadows": {
    "description": "Box shadow presets",
    "presets": [
      { "name": "None", "value": "none" },
      { "name": "Subtle", "value": "0 1px 3px var(--gutplus-shadow-color, rgba(0,0,0,0.12))" },
      { "name": "Medium", "value": "0 4px 6px var(--gutplus-shadow-color, rgba(0,0,0,0.15))" },
      { "name": "Strong", "value": "0 10px 20px var(--gutplus-shadow-color, rgba(0,0,0,0.2))" },
      { "name": "Heavy", "value": "0 15px 35px var(--gutplus-shadow-color, rgba(0,0,0,0.25))" }
    ]
  },

  "animations": {
    "description": "Animation presets for accordion open/close",
    "types": [
      { "name": "None", "value": "none" },
      { "name": "Slide", "value": "slide" },
      { "name": "Fade", "value": "fade" },
      { "name": "Slide + Fade", "value": "slideFade" }
    ],
    "easings": [
      { "name": "Ease", "value": "ease" },
      { "name": "Ease In", "value": "ease-in" },
      { "name": "Ease Out", "value": "ease-out" },
      { "name": "Ease In-Out", "value": "ease-in-out" },
      { "name": "Linear", "value": "linear" },
      { "name": "Bounce", "value": "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }
    ]
  },

  "decorations": {
    "description": "Text decoration options",
    "common": [
      { "name": "None", "value": "none", "icon": "dash" },
      { "name": "Underline", "value": "underline", "icon": "underline" },
      { "name": "Line Through", "value": "line-through", "icon": "strikethrough" },
      { "name": "Overline", "value": "overline", "icon": "overline" }
    ],
    "extended": [
      { "name": "Underline + Line Through", "value": "underline line-through" },
      { "name": "Underline + Overline", "value": "underline overline" },
      { "name": "Overline + Line Through", "value": "overline line-through" },
      { "name": "All", "value": "underline overline line-through" }
    ],
    "styles": [
      { "name": "Solid", "value": "solid" },
      { "name": "Double", "value": "double" },
      { "name": "Dotted", "value": "dotted" },
      { "name": "Dashed", "value": "dashed" },
      { "name": "Wavy", "value": "wavy" }
    ]
  },

  "letterCase": {
    "description": "Text transform options",
    "options": [
      { "name": "None", "value": "none", "display": "—" },
      { "name": "Uppercase", "value": "uppercase", "display": "AB" },
      { "name": "Lowercase", "value": "lowercase", "display": "ab" },
      { "name": "Capitalize", "value": "capitalize", "display": "Ab" }
    ]
  },

  "fontFamilies": {
    "description": "Available font families",
    "system": [
      { "name": "System Default", "value": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
      { "name": "Arial", "value": "Arial, Helvetica, sans-serif" },
      { "name": "Georgia", "value": "Georgia, 'Times New Roman', serif" },
      { "name": "Courier New", "value": "'Courier New', Courier, monospace" },
      { "name": "Verdana", "value": "Verdana, Geneva, sans-serif" },
      { "name": "Trebuchet MS", "value": "'Trebuchet MS', sans-serif" }
    ],
    "google": [
      { "name": "Open Sans", "value": "'Open Sans', sans-serif" },
      { "name": "Roboto", "value": "'Roboto', sans-serif" },
      { "name": "Lato", "value": "'Lato', sans-serif" },
      { "name": "Montserrat", "value": "'Montserrat', sans-serif" },
      { "name": "Poppins", "value": "'Poppins', sans-serif" },
      { "name": "Playfair Display", "value": "'Playfair Display', serif" }
    ]
  }
}
```

### 9.4 Using Templates in Controls

```javascript
import sharedTemplates from '../../../../schemas/shared-templates.json';

export function AppearanceControl({ value, onChange }) {
  const options = sharedTemplates.appearance.presets.map(preset => ({
    label: preset.name,
    value: JSON.stringify({ weight: preset.weight, style: preset.style })
  }));

  return (
    <SelectControl
      label="Appearance"
      value={JSON.stringify(value)}
      options={options}
      onChange={(val) => onChange(JSON.parse(val))}
    />
  );
}
```

### 9.5 Schema Compiler Integration

The schema compiler reads `shared-templates.json` and:
1. Generates TypeScript types for templates
2. Generates control option lists
3. Validates schema references to templates

---

## 10. CSS Generation

### 10.1 Three-Tier CSS Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ TIER 1: Global Defaults (generated once, cached)            │
│ Location: <head> via wp_enqueue_style                       │
│ Source: Schema defaults                                     │
│ Selector: :root                                             │
├─────────────────────────────────────────────────────────────┤
│ TIER 2: Theme CSS (generated per theme, cached)             │
│ Location: <head> via inline <style> or enqueued file        │
│ Source: Theme deltas from database                          │
│ Selector: .accordion-theme-{name}                           │
├─────────────────────────────────────────────────────────────┤
│ TIER 3: Block Customizations (generated per block)          │
│ Location: Inline <style> before block                       │
│ Source: Block customizations attribute                      │
│ Selector: #accordion-{uniqueId}                             │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Tier 1: Default CSS Variables

**Generated by:** `php/css-defaults/accordion-css-defaults-generated.php`

```css
:root {
  /* Colors */
  --accordion-title-color: #333333;
  --accordion-title-bg: #f5f5f5;
  --accordion-title-hover-color: #000000;
  --accordion-title-hover-bg: #e8e8e8;
  --accordion-content-bg: #ffffff;
  --accordion-border-color: #dddddd;
  --accordion-divider-color: #dddddd;
  --accordion-icon-color: #666666;

  /* Typography */
  --accordion-title-font-size: 1.125rem;
  --accordion-title-font-weight: 600;
  --accordion-title-font-style: normal;
  --accordion-title-text-transform: none;
  --accordion-title-text-decoration: none;
  --accordion-title-alignment: left;

  /* Borders */
  --accordion-border-width: 1px;
  --accordion-border-style: solid;
  --accordion-border-radius: 4px;

  /* ... more variables */
}
```

### 10.3 Tier 2: Theme CSS

**Generated by:** `php/theme-css-generator.php`

```php
function generate_theme_css($block_type, $theme_name, $theme_values, $breakpoints) {
    $css = ".{$block_type}-theme-" . sanitize_title($theme_name) . " {\n";

    foreach ($theme_values as $attr => $value) {
        $css_var = get_css_var_for_attribute($block_type, $attr);

        if (is_array($value) && isset($value['desktop'])) {
            // Responsive value
            $css .= "  --{$css_var}: {$value['desktop']};\n";
        } else {
            // Simple value
            $css .= "  --{$css_var}: {$value};\n";
        }
    }

    $css .= "}\n";

    // Responsive media queries
    foreach ($theme_values as $attr => $value) {
        if (is_array($value)) {
            $css_var = get_css_var_for_attribute($block_type, $attr);

            if (isset($value['tablet'])) {
                $css .= "@media (max-width: {$breakpoints['tablet']}px) {\n";
                $css .= "  .{$block_type}-theme-" . sanitize_title($theme_name) . " {\n";
                $css .= "    --{$css_var}: {$value['tablet']};\n";
                $css .= "  }\n";
                $css .= "}\n";
            }

            if (isset($value['mobile'])) {
                $css .= "@media (max-width: {$breakpoints['mobile']}px) {\n";
                $css .= "  .{$block_type}-theme-" . sanitize_title($theme_name) . " {\n";
                $css .= "    --{$css_var}: {$value['mobile']};\n";
                $css .= "  }\n";
                $css .= "}\n";
            }
        }
    }

    return $css;
}
```

**Output Example:**
```css
.accordion-theme-dark {
  --accordion-title-color: #ffffff;
  --accordion-title-bg: #1a1a1a;
  --accordion-title-font-size: 1.5rem;
}

@media (max-width: 600px) {
  .accordion-theme-dark {
    --accordion-title-font-size: 1rem;
  }
}
```

### 10.4 Tier 3: Block Customizations

**Generated in:** `save.js`

```jsx
export default function save({ attributes }) {
  const { accordionId, currentTheme, customizations } = attributes;

  // Generate inline CSS only if customizations exist
  const inlineCSS = generateBlockCSS(accordionId, customizations, breakpoints);

  return (
    <>
      {inlineCSS && (
        <style dangerouslySetInnerHTML={{ __html: inlineCSS }} />
      )}
      <div
        id={accordionId}
        className={`gutplus-accordion ${currentTheme ? `accordion-theme-${currentTheme}` : ''}`}
      >
        {/* Block content */}
      </div>
    </>
  );
}

function generateBlockCSS(blockId, customizations, breakpoints) {
  if (!customizations || Object.keys(customizations).length === 0) {
    return null;
  }

  let css = `#${blockId} {\n`;

  for (const [attr, value] of Object.entries(customizations)) {
    const cssVar = getCSSVarForAttribute(attr);

    if (typeof value === 'object' && value.desktop !== undefined) {
      css += `  --${cssVar}: ${value.desktop};\n`;
    } else {
      css += `  --${cssVar}: ${value};\n`;
    }
  }

  css += '}\n';

  // Responsive media queries
  for (const [attr, value] of Object.entries(customizations)) {
    if (typeof value === 'object') {
      const cssVar = getCSSVarForAttribute(attr);

      if (value.tablet !== undefined) {
        css += `@media (max-width: ${breakpoints.tablet}px) {\n`;
        css += `  #${blockId} { --${cssVar}: ${value.tablet}; }\n`;
        css += '}\n';
      }

      if (value.mobile !== undefined) {
        css += `@media (max-width: ${breakpoints.mobile}px) {\n`;
        css += `  #${blockId} { --${cssVar}: ${value.mobile}; }\n`;
        css += '}\n';
      }
    }
  }

  return css;
}
```

### 10.5 CSS Variable Naming Convention

```
--{block-type}-{attribute-name}

Examples:
--accordion-title-color
--accordion-title-font-size
--accordion-border-width
--tabs-tab-bg-color
--toc-heading-color
```

### 10.6 CSS Usage in SCSS

```scss
// blocks/accordion/src/style.scss

.gutplus-accordion {
  .accordion-title {
    color: var(--accordion-title-color);
    background-color: var(--accordion-title-bg);
    font-size: var(--accordion-title-font-size);
    font-weight: var(--accordion-title-font-weight);

    &:hover {
      color: var(--accordion-title-hover-color);
      background-color: var(--accordion-title-hover-bg);
    }
  }

  .accordion-content {
    background-color: var(--accordion-content-bg);
    border-top: var(--accordion-divider-width) var(--accordion-divider-style) var(--accordion-divider-color);
  }
}
```

---

## 11. File Structure

### 11.1 Complete Directory Structure

```
guttemberg-plus/dev/
├── schemas/
│   ├── accordion.json              # Accordion block schema
│   ├── tabs.json                   # Tabs block schema
│   ├── toc.json                    # TOC block schema
│   └── shared-templates.json       # Shared presets (NEW)
│
├── shared/
│   └── src/
│       ├── index.js                # Main exports
│       │
│       ├── components/
│       │   ├── index.js
│       │   ├── ThemeSelector.js
│       │   ├── SchemaPanels.js
│       │   ├── GenericPanel.js
│       │   ├── SubgroupPanel.js         # NEW
│       │   ├── TabbedInspector.js       # NEW
│       │   ├── CustomizationWarning.js
│       │   │
│       │   └── controls/                 # NEW directory
│       │       ├── index.js
│       │       ├── ResetButton.js
│       │       ├── DeviceSwitcher.js
│       │       ├── UnitSelector.js
│       │       ├── LinkToggle.js
│       │       ├── IconButton.js
│       │       ├── IconButtonGroup.js
│       │       ├── ResponsiveWrapper.js
│       │       ├── BoxControl.js
│       │       ├── SliderWithInput.js
│       │       ├── ColorControl.js
│       │       ├── GradientControl.js
│       │       ├── BorderStyleControl.js
│       │       ├── ShadowControl.js
│       │       ├── AlignmentControl.js
│       │       ├── AppearanceControl.js
│       │       ├── DecorationControl.js
│       │       ├── LetterCaseControl.js
│       │       ├── IconPickerControl.js
│       │       └── IconPositionControl.js
│       │
│       ├── hooks/
│       │   ├── index.js
│       │   ├── useThemeManager.js
│       │   ├── useBlockAlignment.js
│       │   └── useBreakpoints.js         # NEW
│       │
│       ├── data/
│       │   ├── index.js
│       │   └── store.js
│       │
│       ├── theme-system/
│       │   ├── cascade-resolver.js
│       │   ├── control-normalizer.js
│       │   └── theme-manager.js
│       │
│       ├── utils/
│       │   ├── delta-calculator.js
│       │   ├── id-generator.js
│       │   ├── debug.js
│       │   └── responsive-utils.js       # NEW
│       │
│       ├── attributes/
│       │   └── attribute-defaults.js
│       │
│       ├── config/
│       │   ├── control-config-generated.js
│       │   └── css-var-mappings-generated.js
│       │
│       └── styles/
│           └── controls.scss              # NEW - control styling
│
├── blocks/
│   ├── accordion/
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   ├── frontend.js
│   │   │   ├── style.scss
│   │   │   ├── editor.scss
│   │   │   └── accordion-attributes.js   # AUTO-GENERATED
│   │   └── block.json
│   │
│   ├── tabs/
│   │   └── ... (same structure)
│   │
│   └── toc/
│       └── ... (same structure)
│
├── php/
│   ├── theme-storage.php
│   ├── theme-rest-api.php
│   ├── theme-css-generator.php
│   ├── breakpoints-handler.php           # NEW
│   └── css-defaults/
│       ├── accordion-css-defaults-generated.php
│       ├── tabs-css-defaults-generated.php
│       ├── toc-css-defaults-generated.php
│       └── css-mappings-generated.php
│
├── build-tools/
│   └── schema-compiler.js
│
├── assets/
│   └── css/
│       ├── accordion-generated.css
│       ├── tabs-generated.css
│       ├── toc-generated.css
│       └── controls.css                   # NEW
│
└── docs/
    ├── SIDEBAR_ARCHITECTURE.md            # THIS FILE
    └── ... (other docs)
```

### 11.2 Auto-Generated Files (Do Not Edit)

```
# From schema-compiler.js
blocks/*/src/*-attributes.js
shared/src/config/*-generated.js
shared/src/styles/*-generated.js
shared/src/types/*-theme.ts
shared/src/validators/*-schema.ts
php/css-defaults/*-generated.php
assets/css/*-generated.css
docs/*-attributes.md
```

---

## 12. Adding New Features

### 12.1 Adding a New Attribute

1. **Edit schema** (`schemas/accordion.json`):
```json
"newAttribute": {
  "type": "string",
  "default": "value",
  "group": "existingGroup",
  "label": "New Attribute",
  "description": "Help text",
  "themeable": true,
  "control": "TextControl",
  "cssVar": "new-attribute",
  "order": 10
}
```

2. **Rebuild:**
```bash
npm run schema:build
npm run build
```

3. **Done!** The attribute automatically appears in the sidebar.

### 12.2 Adding a New Control Type

1. **Create control file** (`shared/src/components/controls/NewControl.js`):
```jsx
export function NewControl({ value, onChange, ...props }) {
  // Implementation
}
```

2. **Export from index** (`shared/src/components/controls/index.js`):
```javascript
export { NewControl } from './NewControl';
```

3. **Add to GenericPanel** (`shared/src/components/GenericPanel.js`):
```javascript
case 'NewControl':
  return <NewControl value={value} onChange={onChange} {...props} />;
```

4. **Use in schema:**
```json
"attribute": {
  "control": "NewControl"
}
```

### 12.3 Adding a New Group

1. **Add group to schema:**
```json
"groups": {
  "newGroup": {
    "title": "New Group",
    "tab": "appearance",
    "order": 10,
    "initialOpen": false
  }
}
```

2. **Assign attributes to group:**
```json
"someAttribute": {
  "group": "newGroup",
  ...
}
```

### 12.4 Adding Subgroups

1. **Define subgroups in group:**
```json
"groups": {
  "myGroup": {
    "title": "My Group",
    "tab": "appearance",
    "subgroups": ["subA", "subB"]
  }
}
```

2. **Assign attributes to subgroups:**
```json
"attribute1": {
  "group": "myGroup",
  "subgroup": "subA"
}
```

### 12.5 Making an Attribute Responsive

1. **Update schema:**
```json
"existingAttribute": {
  "type": "object",
  "default": { "desktop": "originalDefault" },
  "responsive": true,
  ...
}
```

2. **Update PHP CSS generator** (if needed for this attribute)

3. **Rebuild**

---

## 13. Extending to Other Blocks

### 13.1 Creating a New Block

1. **Create schema** (`schemas/newblock.json`)

2. **Add to schema-compiler.js:**
```javascript
const BLOCKS = ['accordion', 'tabs', 'toc', 'newblock'];
```

3. **Create block directory:**
```
blocks/newblock/
├── src/
│   ├── index.js
│   ├── edit.js
│   ├── save.js
│   ├── frontend.js
│   ├── style.scss
│   └── editor.scss
└── block.json
```

4. **Copy edit.js pattern:**
```javascript
import { useThemeManager, SchemaPanels, ThemeSelector } from '@shared';
import newblockSchema from '../../../schemas/newblock.json';
import { newblockAttributes } from './newblock-attributes';

export default function Edit({ attributes, setAttributes }) {
  const { themes, handlers, ... } = useThemeManager({
    blockType: 'newblock',
    schema: newblockSchema,
    attributes,
    setAttributes,
    allDefaults,
  });

  return (
    <>
      <InspectorControls>
        <ThemeSelector blockType="newblock" {...} />
        <TabbedInspector>
          <SchemaPanels tab="settings" schema={newblockSchema} {...} />
          <SchemaPanels tab="appearance" schema={newblockSchema} {...} />
        </TabbedInspector>
      </InspectorControls>
      {/* Block content */}
    </>
  );
}
```

5. **Build:**
```bash
npm run schema:build
npm run build
```

### 13.2 Sharing Components Across Blocks

All shared components are in `shared/src/` and imported via `@shared` alias:

```javascript
import {
  ThemeSelector,
  SchemaPanels,
  TabbedInspector,
  BoxControl,
  SliderWithInput,
  useThemeManager,
} from '@shared';
```

---

## 14. Implementation Phases

**Last Updated:** 2025-12-25
**Status:** Phases 1-7 Complete

### Phase 1: Foundation ✅ COMPLETE
- [x] Create `schemas/shared-templates.json`
- [x] Update `accordion.json` with new structure (tabs, subgroups)
- [x] Add new attributes (typography, spacing, animation)

### Phase 2: Atomic Components ✅ COMPLETE
- [x] ResetButton (`shared/src/components/controls/ResetButton.js`)
- [x] DeviceSwitcher (`shared/src/components/controls/DeviceSwitcher.js`)
- [x] UnitSelector (`shared/src/components/controls/UnitSelector.js`)
- [x] LinkToggle (`shared/src/components/controls/LinkToggle.js`)
- [x] IconButton (`shared/src/components/controls/IconButton.js`)
- [x] IconButtonGroup (`shared/src/components/controls/IconButtonGroup.js`)

### Phase 3: Composite Controls ✅ COMPLETE
- [x] ResponsiveWrapper (`shared/src/components/controls/ResponsiveWrapper.js`)
- [x] BoxControl (`shared/src/components/controls/BoxControl.js`)
- [x] SliderWithInput (`shared/src/components/controls/SliderWithInput.js`)
- [x] ColorControl (`shared/src/components/controls/ColorControl.js`)
- [x] GradientControl (`shared/src/components/controls/GradientControl.js`)
- [x] BorderStyleControl (`shared/src/components/controls/BorderStyleControl.js`)
- [x] ShadowControl (`shared/src/components/controls/ShadowControl.js`)

### Phase 4: Typography Controls ✅ COMPLETE
- [x] AppearanceControl (`shared/src/components/controls/AppearanceControl.js`)
- [x] DecorationControl (`shared/src/components/controls/DecorationControl.js`)
- [x] LetterCaseControl (`shared/src/components/controls/LetterCaseControl.js`)
- [x] FontFamilyControl (`shared/src/components/controls/FontFamilyControl.js`)
- [x] AlignmentControl (`shared/src/components/controls/AlignmentControl.js`)
- [x] IconPositionControl (`shared/src/components/controls/IconPositionControl.js`)

### Phase 5: Panel Structure ✅ COMPLETE
- [x] TabbedInspector (`shared/src/components/TabbedInspector.js`)
- [x] SubgroupPanel (`shared/src/components/SubgroupPanel.js`)
- [x] ControlRenderer (`shared/src/components/ControlRenderer.js`)
- [x] Update SchemaPanels (`shared/src/components/SchemaPanels.js`)
- [x] Update GenericPanel (`shared/src/components/GenericPanel.js`)

### Phase 6: Responsive System ✅ COMPLETE
- [x] useBreakpoints hook (`shared/src/hooks/useBreakpoints.js`)
- [x] responsive-utils.js (`shared/src/utils/responsive-utils.js`)
- [x] PHP breakpoints-handler.php (`php/breakpoints-handler.php`)
- [x] save.js responsive CSS integration

### Phase 7: Integration ✅ COMPLETE
- [x] Update edit.js to use TabbedInspector with SettingsPanels/AppearancePanels
- [x] Update save.js with responsive CSS generation
- [x] Add tab assignments to accordion.json schema
- [x] Export new components from shared/src/index.js
- [x] Build passes successfully

---

## 15. Quick Reference

### Key Files

| Purpose | File | Status |
|---------|------|--------|
| Block schema | `schemas/accordion.json` | Existing |
| Shared templates | `schemas/shared-templates.json` | **NEW** |
| Theme store | `shared/src/data/store.js` | Existing |
| Theme manager hook | `shared/src/hooks/useThemeManager.js` | Existing |
| Breakpoints hook | `shared/src/hooks/useBreakpoints.js` | **NEW** |
| Cascade resolver | `shared/src/theme-system/cascade-resolver.js` | Existing |
| Delta calculator | `shared/src/utils/delta-calculator.js` | Existing |
| Responsive utils | `shared/src/utils/responsive-utils.js` | **NEW** |
| Panel generator | `shared/src/components/SchemaPanels.js` | Updated |
| Control renderer | `shared/src/components/ControlRenderer.js` | **NEW** |
| Tabbed inspector | `shared/src/components/TabbedInspector.js` | **NEW** |
| Subgroup panel | `shared/src/components/SubgroupPanel.js` | **NEW** |
| Generic panel | `shared/src/components/GenericPanel.js` | Updated |
| Controls directory | `shared/src/components/controls/` | **NEW** |
| Block edit | `blocks/accordion/src/edit.js` | Pending |
| Block save | `blocks/accordion/src/save.js` | Pending |
| CSS generator | `php/theme-css-generator.php` | Existing |
| Breakpoints handler | `php/breakpoints-handler.php` | **NEW** |
| REST API | `php/theme-rest-api.php` | Existing |

### Key Concepts

| Concept | Definition |
|---------|------------|
| **Schema** | JSON file defining all attributes, groups, and controls |
| **Delta** | Only the differences from defaults |
| **effectiveValues** | What's displayed (= attributes in edit.js) |
| **expectedValues** | defaults + theme deltas |
| **isCustomized** | attributes !== expectedValues |
| **Tier 1** | CSS defaults (:root) |
| **Tier 2** | Theme CSS (.accordion-theme-name) |
| **Tier 3** | Block customizations (#accordion-id) |
| **Responsive** | desktop/tablet/mobile values |
| **Breakpoints** | Global screen size thresholds |

### Build Commands

```bash
npm run schema:build    # Generate files from schemas
npm run schema:validate # Validate schemas
npm run build           # Full WordPress build
npm run start           # Development mode with watch
```


---

*This document is the single source of truth for the Guttemberg Plus sidebar architecture. Keep it updated when making changes.*
