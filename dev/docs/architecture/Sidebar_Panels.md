# Sidebar Panel Generation System

**How WordPress Block Editor Sidebar Controls are Auto-Generated from Comprehensive Schemas**

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Flow](#architecture-flow)
3. [Schema Structure](#schema-structure)
4. [Panel Hierarchy](#panel-hierarchy)
5. [Control Rendering](#control-rendering)
6. [Unified Controls](#unified-controls)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The sidebar panel system automatically generates WordPress block editor controls from the comprehensive schema. There's **zero manual UI code** - everything is driven by schema metadata.

### Key Principles

1. **Schema is Truth** - All sidebar controls are defined in `schemas/generated/{block}.json`
2. **Automatic Grouping** - Attributes are organized by `group`, `subgroup`, and `order`
3. **Generic Rendering** - One renderer (`ControlRenderer.js`) handles all control types
4. **Unified Controls** - Related attributes (like 4 border sides) render as single panels

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Minimal Schema (schemas/blocks/accordion.json)             │
│  - box-panel macros                                         │
│  - border-panel macros                                      │
│  - color-panel macros                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Schema Orchestrator (tools/build.js)                       │
│  - Expands macros into atomic attributes                   │
│  - Adds controlId, renderControl flags                     │
│  - Generates comprehensive schema                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Comprehensive Schema (schemas/generated/accordion.json)    │
│  - 106 atomic attributes                                    │
│  - Each has: group, subgroup, control, controlId, etc.     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  SchemaPanels Component (shared/components/SchemaPanels.js) │
│  - Reads schema.tabs → groups                              │
│  - Renders PanelBody for each group                        │
│  - Renders SubgroupPanel for each subgroup                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  ControlRenderer (shared/components/ControlRenderer.js)     │
│  - Maps attribute.control → React component                │
│  - Handles unified controls (BorderPanel, etc.)            │
│  - Manages visibility (showWhen, conditionalRender)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  WordPress Editor Sidebar                                   │
│  - Appearance Tab                                           │
│    └─ Borders Panel                                         │
│       ├─ External Subgroup                                  │
│       │  ├─ Border (unified: color, style, width)          │
│       │  ├─ Border Radius (unified: 4 corners)             │
│       │  └─ Box Shadow                                      │
│       └─ Divider Subgroup                                   │
│          └─ Border (top only)                               │
│    └─ Layout Panel                                          │
│       ├─ Title Padding (unified: 4 sides)                  │
│       ├─ Content Padding (unified: 4 sides)                │
│       └─ Block Margin (unified: top/bottom)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Schema Structure

### Comprehensive Schema Format

Each attribute in the comprehensive schema has these key fields:

```json
{
  "attributes": {
    "block-box-border-width-top": {
      "type": "string",
      "default": "1px",
      "label": "Border Width (Top)",
      "description": "Border width on the top side",

      // UI ORGANIZATION
      "group": "borders",              // Main panel (required)
      "subgroup": "External",          // Sub-section (optional)
      "order": 1,                      // Standalone attr ordering (optional)

      // CONTROL CONFIGURATION
      "control": "BorderPanel",        // Control type
      "controlId": "blockBox",         // Groups related attrs together
      "renderControl": true,           // Only render once per controlId

      // CSS CONNECTION
      "element": "item",
      "cssProperty": "border-top-width",
      "cssVar": "--accordion-item-border-top-width",

      // BEHAVIOR
      "themeable": true,
      "outputsCSS": true,
      "responsive": false,
      "visibleOnSidebar": true         // Default: true
    }
  },

  "groups": {
    "borders": {
      "title": "Borders",
      "description": "Block borders, radius, shadows, and divider settings",
      "order": 2,
      "initialOpen": false,
      "tab": "appearance",
      "subgroups": [
        { "name": "External", "order": 1 },
        { "name": "Divider", "order": 2 }
      ]
    }
  },

  "tabs": [
    {
      "name": "appearance",
      "order": 1,
      "groups": [ /* references to groups */ ]
    }
  ]
}
```

### Field Reference

**UI Organization:**
- `group` - Which panel this attribute belongs to (required)
- `subgroup` - Optional sub-section within panel
- `order` - Ordering within group (only for standalone attributes)
- `visibleOnSidebar` - Set to `false` to hide (default: `true`)

**Control Configuration:**
- `control` - Control type: `"BorderPanel"`, `"SpacingControl"`, `"SliderWithInput"`, etc.
- `controlId` - Groups related attributes (all with same ID render as one control)
- `renderControl` - Only `true` on first attribute of unified control group

**Visibility Conditions:**
- `showWhen` - Attribute only shows when dependency matches
- `disabledWhen` - Attribute disabled when condition met
- `conditionalRender` - JavaScript expression for complex visibility

---

## Panel Hierarchy

### Tab → Group → Subgroup → Attribute

```
Appearance Tab
├─ Borders Group (order: 2)
│  ├─ External Subgroup
│  │  ├─ Border (controlId: blockBox)
│  │  ├─ Border Radius (controlId: blockBoxRadius)
│  │  └─ Box Shadow
│  └─ Divider Subgroup
│     └─ Border (controlId: dividerBorder)
│
├─ Layout Group (order: 3)
│  ├─ Title Padding (controlId: headerBoxPadding)
│  ├─ Content Padding (controlId: contentBoxPadding)
│  └─ Block Margin (controlId: blockBoxMargin)
│
└─ Colors Group (order: 4)
   ├─ Header Subgroup
   │  └─ Title Color (type: color-panel)
   └─ Panel Subgroup
      └─ Content Color (type: color-panel)
```

### Rendering Logic

**SchemaPanels.js:**
```javascript
// 1. Filter tabs
const appearanceTab = schema.tabs.find(tab => tab.name === 'appearance');

// 2. Sort groups by order
const sortedGroups = appearanceTab.groups.sort((a, b) => a.order - b.order);

// 3. For each group, render PanelBody
sortedGroups.forEach(group => {
  <PanelBody title={group.title} initialOpen={group.initialOpen}>
    {renderGroupControls(group)}
  </PanelBody>
});

// 4. Within group, organize by subgroups
function renderGroupControls(group) {
  if (group.subgroups?.length > 0) {
    // Render SubgroupPanel for each subgroup
    return group.subgroups.map(subgroup =>
      <SubgroupPanel title={subgroup.name}>
        {renderAttributes(group.id, subgroup.name)}
      </SubgroupPanel>
    );
  } else {
    // No subgroups, render attributes directly
    return renderAttributes(group.id);
  }
}

// 5. Filter and sort attributes
function renderAttributes(groupId, subgroupName) {
  const attrs = Object.entries(schema.attributes)
    .filter(([name, attr]) =>
      attr.group === groupId &&
      attr.subgroup === subgroupName &&
      attr.visibleOnSidebar !== false
    )
    .sort((a, b) => (a[1].order || 999) - (b[1].order || 999));

  return attrs.map(([name, attr]) =>
    <ControlRenderer attrName={name} attrConfig={attr} />
  );
}
```

---

## Control Rendering

### ControlRenderer Flow

**1. Visibility Check**

```javascript
// showWhen condition
if (!checkShowWhen(attrConfig.showWhen, attributes)) {
  return null;
}

// conditionalRender expression
if (attrConfig.conditionalRender) {
  const shouldShow = evaluateConditionalRender(
    attrConfig.conditionalRender,
    effectiveValues
  );
  if (!shouldShow) return null;
}

// renderControl flag (for unified controls)
if (attrConfig.renderControl === false) {
  return null; // This attr is part of unified control, don't render separately
}
```

**2. Control Type Mapping**

```javascript
switch (attrConfig.control) {
  case 'BorderPanel':
    return <BorderPanel {...props} />;

  case 'SpacingControl':
    return <SpacingControl {...props} />;

  case 'RadiusControl':
    return <BorderRadiusControl {...props} />;

  case 'SliderWithInput':
    return <SliderWithInput {...props} />;

  case 'ColorPicker':
    return <PanelColorSettings {...props} />;

  // ... 30+ control types
}
```

**3. Panel Type Handling (Legacy)**

Some attributes use panel types instead of explicit controls:

```javascript
switch (attrConfig.type) {
  case 'color-panel':
    // Renders text + background color pickers
    // with optional hover states

  case 'box-panel':
    // Renders border, radius, shadow, padding, margin
    // based on 'fields' array

  case 'typography-panel':
    // Renders font family, size, weight, etc.

  case 'border-panel':
    // Renders single border (e.g., divider)
}
```

---

## Unified Controls

### What are Unified Controls?

Unified controls combine multiple atomic attributes into a single panel with link/unlink functionality.

**Example:** Instead of 4 separate sliders for padding:
```
Padding Top: [slider]
Padding Right: [slider]
Padding Bottom: [slider]
Padding Left: [slider]
```

You get one unified control:
```
Padding: [🔗] [12] [16] [12] [16] [px ▼]
         └─ link/unlink button
```

### How Unified Controls Work

**Schema Pattern:**
```json
{
  "header-box-padding-top": {
    "control": "SpacingControl",
    "controlId": "headerBoxPadding",
    "renderControl": true,  // ← Only first has this
    // ... other fields
  },
  "header-box-padding-right": {
    "control": "SpacingControl",
    "controlId": "headerBoxPadding",  // ← Same controlId
    "renderControl": false,  // ← Don't render separately
    // ... other fields
  },
  "header-box-padding-bottom": {
    "control": "SpacingControl",
    "controlId": "headerBoxPadding",
    "renderControl": false,
    // ... other fields
  },
  "header-box-padding-left": {
    "control": "SpacingControl",
    "controlId": "headerBoxPadding",
    "renderControl": false,
    // ... other fields
  }
}
```

**ControlRenderer Logic:**
```javascript
case 'SpacingControl': {
  // Only render if renderControl: true
  if (attrConfig.renderControl !== true) {
    return null;
  }

  // Find all 4 related attributes by controlId
  const controlId = attrConfig.controlId;
  const relatedAttrs = Object.entries(schema.attributes)
    .filter(([, attr]) =>
      attr.control === 'SpacingControl' &&
      attr.controlId === controlId
    );

  // Build unified value object
  const spacingValue = {
    top: parseValue(effectiveValues[topAttrName]),
    right: parseValue(effectiveValues[rightAttrName]),
    bottom: parseValue(effectiveValues[bottomAttrName]),
    left: parseValue(effectiveValues[leftAttrName]),
    unit: 'px'
  };

  // Handle change - update ALL 4 attributes
  const handleChange = (newSpacing) => {
    setAttributes({
      [topAttrName]: `${newSpacing.top}${newSpacing.unit}`,
      [rightAttrName]: `${newSpacing.right}${newSpacing.unit}`,
      [bottomAttrName]: `${newSpacing.bottom}${newSpacing.unit}`,
      [leftAttrName]: `${newSpacing.left}${newSpacing.unit}`,
    });
  };

  return <SpacingControl value={spacingValue} onChange={handleChange} />;
}
```

### Implemented Unified Controls

| Control Name | Attributes Combined | Component Used |
|--------------|-------------------|----------------|
| **BorderPanel** | 12 attrs (4 sides × 3 props: width, color, style) | `BorderPanel` |
| **RadiusControl** | 4 attrs (4 corners) | `BorderRadiusControl` |
| **SpacingControl** | 4 attrs (4 sides: padding or margin) | `SpacingControl` |

---

## Examples

### Example 1: Simple Standalone Attribute

**Schema:**
```json
{
  "animationDuration": {
    "type": "string",
    "default": "250ms",
    "label": "Duration",
    "description": "Animation duration in milliseconds",
    "group": "animation",
    "order": 2,
    "control": "SliderWithInput",
    "min": 0,
    "max": 2000,
    "step": 50,
    "themeable": true
  }
}
```

**Renders as:**
```
Animation Panel
└─ Duration: [slider 0 ←●→ 2000] [250] [ms]
```

---

### Example 2: Color Panel with States

**Schema:**
```json
{
  "titleColor": {
    "type": "color-panel",
    "group": "colors",
    "subgroup": "Header",
    "states": ["base", "hover"],
    "default": {
      "text": "#333333",
      "background": "#f5f5f5",
      "hover": {
        "text": "#000000",
        "background": "#e8e8e8"
      }
    }
  }
}
```

**Expands to:**
```json
{
  "title-color-text": { /* base text color */ },
  "title-color-background": { /* base bg color */ },
  "title-color-text-hover": { /* hover text color */ },
  "title-color-background-hover": { /* hover bg color */ }
}
```

**Renders as:**
```
Colors Panel
└─ Header Subgroup
   ├─ Header Text: [color picker]
   ├─ Header Background: [color/gradient picker]
   ├─ Header Hover Text: [color picker]
   └─ Header Hover Background: [color/gradient picker]
```

---

### Example 3: Unified Border Control

**Schema (after expansion):**
```json
{
  "block-box-border-width-top": {
    "control": "BorderPanel",
    "controlId": "blockBox",
    "renderControl": true,
    "cssProperty": "border-top-width",
    // ...
  },
  "block-box-border-color-top": {
    "control": "BorderPanel",
    "controlId": "blockBox",
    "renderControl": false,
    "cssProperty": "border-top-color",
    // ...
  },
  // ... 10 more (right, bottom, left × width, color, style)
}
```

**Renders as ONE control:**
```
Borders Panel
└─ External Subgroup
   └─ Border: [color] [style] [width] [🔗]
              └─ When unlinked:
                 ├─ Top: [color] [style] [width]
                 ├─ Right: [color] [style] [width]
                 ├─ Bottom: [color] [style] [width]
                 └─ Left: [color] [style] [width]
```

---

### Example 4: Conditional Visibility

**Schema:**
```json
{
  "iconShow": {
    "type": "boolean",
    "default": true,
    "control": "ToggleControl",
    "label": "Show Icon"
  },
  "iconSize": {
    "type": "string",
    "default": "16px",
    "control": "SliderWithInput",
    "label": "Icon Size",
    "showWhen": {
      "iconShow": true  // Only show when iconShow is true
    }
  }
}
```

**Behavior:**
- When `iconShow` is OFF → Icon Size control is hidden
- When `iconShow` is ON → Icon Size control appears

---

## Troubleshooting

### Problem: Control Not Showing

**Possible Causes:**

1. **Missing group definition**
   - Check if `group` field matches a key in `schema.groups`
   - Check if group is included in the correct tab

2. **visibleOnSidebar is false**
   - Check attribute definition: `"visibleOnSidebar": false`

3. **showWhen condition not met**
   - Check dependency attribute value
   - Console.log current attributes to debug

4. **renderControl is false**
   - This attribute is part of a unified control
   - Check if the FIRST attribute in the group is rendering

5. **Wrong tab**
   - Attributes in "settings" tab won't show in "appearance" tab
   - Check `schema.groups[groupId].tab`

---

### Problem: Unified Control Showing Separate Inputs

**Possible Causes:**

1. **Different controlId values**
   - All related attributes must have EXACT same `controlId`
   - Check comprehensive schema for typos

2. **Wrong control type**
   - Check if expander set `control: "SpacingControl"` not `"SliderWithInput"`

3. **Missing renderControl flags**
   - First attribute should have `renderControl: true`
   - Other attributes should have `renderControl: false`

**Debug:**
```javascript
// In ControlRenderer, add logging
case 'SpacingControl': {
  console.log('Rendering spacing control:', {
    attrName,
    controlId: attrConfig.controlId,
    renderControl: attrConfig.renderControl,
    relatedAttrs: relatedAttrs.length
  });
  // ...
}
```

---

### Problem: Values Not Saving

**Possible Causes:**

1. **Missing unit in saved value**
   - Attributes store strings with units: `"4px"` not `4`
   - Check `handleChange` adds unit back

2. **Wrong attribute name**
   - Check attribute names in `setAttributes()` match schema exactly
   - Comprehensive schema uses kebab-case: `"border-top-width"`

3. **Not updating all related attributes**
   - Unified controls must update ALL related attributes
   - Check `handleChange` loops through all sides/corners

**Debug:**
```javascript
const handleChange = (newValue) => {
  const updates = { /* build updates */ };
  console.log('Saving updates:', updates);
  setAttributes(updates);
};
```

---

### Problem: Control Shows Wrong Default

**Possible Causes:**

1. **Effective values not resolved**
   - Check cascade resolution is working
   - Debug: `console.log('effectiveValues:', effectiveValues)`

2. **String/number mismatch**
   - RangeControl expects numbers, schema stores strings
   - Use `parseValue()` to extract numeric value

3. **Theme override**
   - Current theme may have different defaults
   - Check `effectiveValues` includes theme values

---

### Problem: TypeError: r.some is not a function (or similar array method errors)

**Common Error Messages:**
- `TypeError: r.some is not a function`
- `TypeError: r.filter is not a function`
- `TypeError: formatting.filter is not a function`

**Root Cause:**

This occurs when code expects an array but receives a non-array value (string, object, null, etc.). Most common in controls that work with array-based attributes.

**Possible Causes:**

1. **Attribute naming mismatch (camelCase vs kebab-case)**
   - ControlRenderer builds attribute names incorrectly
   - Comprehensive schema uses kebab-case: `"title-typography-font-weight"`
   - Code using camelCase: `"titleTypographyFontWeight"` ❌

2. **Missing array validation**
   - Code assumes value is array without checking
   - Value might be null, undefined, or wrong type

3. **Wrong attribute key**
   - Reading wrong attribute that doesn't exist
   - Returns undefined instead of expected array

**Solutions:**

**Fix 1: Use kebab-case for attribute names**
```javascript
// ❌ WRONG - camelCase won't find attributes
const formattingBase = attrName.replace(/Formatting$/, '');
const fontWeightKey = `${formattingBase}FontWeight`; // titleTypographyFontWeight

// ✅ CORRECT - kebab-case matches schema
const formattingBase = attrName.replace(/-formatting$/i, '');
const fontWeightKey = `${formattingBase}-font-weight`; // title-typography-font-weight
```

**Fix 2: Validate arrays before iteration**
```javascript
// ❌ WRONG - crashes if not array
const decorationLines = newValue.formatting.filter(...);

// ✅ CORRECT - ensures array first
const formatting = Array.isArray(newValue.formatting) ? newValue.formatting : [];
const decorationLines = formatting.filter(...);
```

**Fix 3: Provide safe defaults**
```javascript
// ✅ CORRECT - always ensure array
const formattingValue = attributes[attrName];
const formattingArray = Array.isArray(formattingValue) ? formattingValue : [];
```

**Debug:**
```javascript
console.log('Attribute name:', attrName);
console.log('Value type:', typeof attributes[attrName]);
console.log('Value:', attributes[attrName]);
console.log('Is array?', Array.isArray(attributes[attrName]));
```

**Example: FormattingControl Fix**

This control had both issues (wrong naming + missing array validation):

```javascript
// BEFORE (broken)
case 'FormattingControl': {
  const formattingBase = attrName.replace(/Formatting$/, ''); // camelCase ❌
  const fontWeightKey = `${formattingBase}FontWeight`; // Wrong ❌

  return (
    <FormattingControl
      value={{
        formatting: attributes[attrName] || [], // Could be non-array ❌
      }}
      onChange={(newValue) => {
        const decorationLines = newValue.formatting.filter(...); // Crashes ❌
      }}
    />
  );
}

// AFTER (fixed)
case 'FormattingControl': {
  const formattingBase = attrName.replace(/-formatting$/i, ''); // kebab-case ✅
  const fontWeightKey = `${formattingBase}-font-weight`; // Correct ✅

  // Ensure array
  const formattingValue = attributes[attrName];
  const formattingArray = Array.isArray(formattingValue) ? formattingValue : [];

  return (
    <FormattingControl
      value={{
        formatting: formattingArray, // Always array ✅
      }}
      onChange={(newValue) => {
        // Validate before filtering
        const formatting = Array.isArray(newValue.formatting) ? newValue.formatting : [];
        const decorationLines = formatting.filter(...); // Safe ✅
      }}
    />
  );
}
```

---

## Best Practices

### 1. Always Use Unified Controls for Related Attributes

**❌ Bad:**
```json
{
  "paddingTop": { "control": "SliderWithInput" },
  "paddingRight": { "control": "SliderWithInput" },
  "paddingBottom": { "control": "SliderWithInput" },
  "paddingLeft": { "control": "SliderWithInput" }
}
```

**✅ Good:**
```json
{
  "paddingTop": {
    "control": "SpacingControl",
    "controlId": "padding",
    "renderControl": true
  },
  "paddingRight": {
    "control": "SpacingControl",
    "controlId": "padding",
    "renderControl": false
  },
  // ... same for bottom, left
}
```

---

### 2. Group Related Controls

**❌ Bad:**
```json
{
  "groups": {
    "settings": {
      "title": "Settings",
      "tab": "appearance"
      // Everything in one giant panel
    }
  }
}
```

**✅ Good:**
```json
{
  "groups": {
    "borders": { "title": "Borders", "order": 1 },
    "layout": { "title": "Layout", "order": 2 },
    "colors": { "title": "Colors", "order": 3 },
    "typography": { "title": "Typography", "order": 4 }
  }
}
```

---

### 3. Use Subgroups for Complex Panels

**✅ Good:**
```json
{
  "groups": {
    "colors": {
      "title": "Colors",
      "subgroups": [
        { "name": "Header", "order": 1 },
        { "name": "Header - Hover", "order": 2 },
        { "name": "Panel", "order": 3 }
      ]
    }
  }
}
```

---

### 4. Add Helpful Labels and Descriptions

**❌ Bad:**
```json
{
  "label": "Border",
  "description": "Border"
}
```

**✅ Good:**
```json
{
  "label": "Border Width (Top)",
  "description": "Border width on the top side"
}
```

---

## Summary

**Key Takeaways:**

1. **Schema Drives Everything** - Sidebar is 100% auto-generated from comprehensive schema
2. **Tabs → Groups → Subgroups → Attributes** - Clear hierarchy for organization
3. **Unified Controls** - Related attributes render as one panel via `controlId`
4. **renderControl Flag** - Only first attribute renders, others hidden
5. **ControlRenderer** - One component handles all control types
6. **Visibility Conditions** - `showWhen`, `disabledWhen`, `conditionalRender`

**Next Steps:**

- Read `schemas/README.md` for schema system overview
- Check `shared/components/ControlRenderer.js` for all control types
- See `schemas/parsers/expansors/` for how macros expand
- Review comprehensive schema for your block to understand structure
