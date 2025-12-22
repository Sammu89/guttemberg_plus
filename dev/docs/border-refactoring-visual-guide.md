# Border Refactoring Visual Guide

## Block Border Structure - Before vs After

This document provides visual representations of the border refactoring changes.

---

## Accordion Block

### BEFORE Refactoring

```
┌─────────────────────────────────────────────┐
│  Accordion Block                            │
│  Schema Group: "border"                     │
│  ┌─────────────────────────────────────────┐│
│  │ Accordion Header/Title                  ││
│  │ - accordionBorderColor                  ││
│  │ - accordionBorderThickness              ││
│  │ - accordionBorderStyle                  ││
│  │ - accordionBorderRadius                 ││
│  │ - accordionShadow                       ││
│  │ - accordionShadowHover                  ││
│  └─────────────────────────────────────────┘│
│  ──────────────────────────────────────────  │  Divider
│  Schema Group: "border-divider"             │
│  - dividerBorderColor                       │
│  - dividerBorderThickness                   │
│  - dividerBorderStyle                       │
│  ──────────────────────────────────────────  │
│  ┌─────────────────────────────────────────┐│
│  │ Accordion Content                       ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘

CSS Variables:
  --accordion-border-color
  --accordion-border-width
  --accordion-border-style
  --accordion-border-radius
  --accordion-shadow
  --accordion-shadow-hover
  --accordion-divider-color
  --accordion-divider-width
  --accordion-divider-style

Component: <BorderPanel />
```

### AFTER Refactoring

```
┌─────────────────────────────────────────────┐
│  Accordion Block                            │
│  Schema Group: "blockBorders"               │
│  ┌─────────────────────────────────────────┐│
│  │ Accordion Header/Title                  ││
│  │ Schema Group: "elementBorders"          ││
│  │ - blockBorderColor                      ││
│  │ - blockBorderWidth                      ││
│  │ - blockBorderStyle                      ││
│  │ - blockBorderRadius                     ││
│  │ - blockShadow                           ││
│  │ - blockShadowHover                      ││
│  │ Optional:                               ││
│  │ - headerBorderColor                     ││
│  │ - headerBorderWidth                     ││
│  │ - headerBorderStyle                     ││
│  │ - headerBorderRadius                    ││
│  └─────────────────────────────────────────┘│
│  ──────────────────────────────────────────  │  Divider
│  Schema Group: "dividerBorders"             │
│  - dividerBorderColor                       │
│  - dividerBorderWidth                       │
│  - dividerBorderStyle                       │
│  ──────────────────────────────────────────  │
│  ┌─────────────────────────────────────────┐│
│  │ Accordion Content                       ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘

CSS Variables:
  --accordion-border-color
  --accordion-border-width
  --accordion-border-style
  --accordion-border-radius
  --accordion-border-shadow
  --accordion-border-shadow-hover
  --accordion-border-header-color (optional)
  --accordion-border-header-width (optional)
  --accordion-border-header-style (optional)
  --accordion-border-header-radius (optional)
  --accordion-border-divider-color
  --accordion-border-divider-width
  --accordion-border-divider-style

Components:
  <GenericPanel group="blockBorders" />
  <GenericPanel group="elementBorders" />  (optional)
  <GenericPanel group="dividerBorders" />
```

---

## Tabs Block

### BEFORE Refactoring

```
┌─────────────────────────────────────────────┐
│  Tabs Container (no border controls)        │
│  ┌────────────────────────────────────────┐ │
│  │ Tab List (Navigation)                  │ │
│  │ ┌──────┐ ┌──────┐ ┌──────┐            │ │
│  │ │Tab 1 │ │Tab 2*│ │Tab 3 │            │ │
│  │ └──────┘ └──────┘ └──────┘            │ │
│  │ Schema Group: "titleBorders"           │ │
│  │ - tabButtonBorderColor                 │ │
│  │ - tabButtonBorderWidth                 │ │
│  │ - tabButtonBorderStyle                 │ │
│  │ - tabButtonBorderRadius                │ │
│  │ - tabButtonShadow                      │ │
│  │ - tabButtonShadowHover                 │ │
│  │ Schema Group: "titleColors"            │ │
│  │ - tabButtonActiveBorderColor           │ │
│  │ - tabButtonActiveBorderBottomColor     │ │
│  └────────────────────────────────────────┘ │
│  ────────────────────────────────────────── │  Divider
│  Schema Group: "divider"                    │
│  - dividerLineColor                         │
│  - dividerLineWidth                         │
│  - dividerLineStyle                         │
│  ────────────────────────────────────────── │
│  ┌────────────────────────────────────────┐ │
│  │ Tab Panel (Content)                    │ │
│  │ Schema Group: "content"                │ │
│  │ - panelBorderColor                     │ │
│  │ - panelBorderWidth                     │ │
│  │ - panelBorderStyle                     │ │
│  │ - panelBorderRadius                    │ │
│  │ - panelShadow                          │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

CSS Variables:
  --tab-button-border-color
  --tab-button-border-width
  --tab-button-border-style
  --tab-button-border-radius
  --tab-button-shadow
  --tab-button-shadow-hover
  --tab-button-active-border-color
  --tab-button-active-border-bottom-color
  --divider-color
  --divider-width
  --divider-style
  --tab-panel-border-color
  --tab-panel-border-width
  --tab-panel-border-style
  --tab-panel-border-radius
  --tab-panel-shadow

Component: <BorderPanel customConfig={buildTabsBorderConfig()} />
```

### AFTER Refactoring

```
┌─────────────────────────────────────────────┐
│  Tabs Container                             │
│  Schema Group: "blockBorders" (NEW)         │
│  - blockBorderColor                         │
│  - blockBorderWidth                         │
│  - blockBorderStyle                         │
│  - blockBorderRadius                        │
│  - blockShadow                              │
│  ┌────────────────────────────────────────┐ │
│  │ Tab List (Navigation)                  │ │
│  │ ┌──────┐ ┌──────┐ ┌──────┐            │ │
│  │ │Tab 1 │ │Tab 2*│ │Tab 3 │            │ │
│  │ └──────┘ └──────┘ └──────┘            │ │
│  │ Schema Group: "elementBorders"         │ │
│  │ - buttonBorderColor                    │ │
│  │ - buttonBorderWidth                    │ │
│  │ - buttonBorderStyle                    │ │
│  │ - buttonBorderRadius                   │ │
│  │ - buttonShadow                         │ │
│  │ - buttonShadowHover                    │ │
│  │ - buttonActiveBorderColor              │ │
│  │ - buttonActiveBorderBottomColor        │ │
│  └────────────────────────────────────────┘ │
│  ────────────────────────────────────────── │  Divider
│  Schema Group: "dividerBorders"             │
│  - dividerBorderColor                       │
│  - dividerBorderWidth                       │
│  - dividerBorderStyle                       │
│  ────────────────────────────────────────── │
│  ┌────────────────────────────────────────┐ │
│  │ Tab Panel (Content)                    │ │
│  │ Schema Group: "contentBorders"         │ │
│  │ - contentBorderColor                   │ │
│  │ - contentBorderWidth                   │ │
│  │ - contentBorderStyle                   │ │
│  │ - contentBorderRadius                  │ │
│  │ - contentShadow                        │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

CSS Variables:
  --tabs-border-color (NEW)
  --tabs-border-width (NEW)
  --tabs-border-style (NEW)
  --tabs-border-radius (NEW)
  --tabs-border-shadow (NEW)
  --tabs-border-button-color
  --tabs-border-button-width
  --tabs-border-button-style
  --tabs-border-button-radius
  --tabs-border-button-shadow
  --tabs-border-button-shadow-hover
  --tabs-border-button-active-color
  --tabs-border-button-active-bottom-color
  --tabs-border-divider-color
  --tabs-border-divider-width
  --tabs-border-divider-style
  --tabs-border-content-color
  --tabs-border-content-width
  --tabs-border-content-style
  --tabs-border-content-radius
  --tabs-border-content-shadow

Components:
  <GenericPanel group="blockBorders" />
  <GenericPanel group="elementBorders" />
  <GenericPanel group="contentBorders" />
  <GenericPanel group="dividerBorders" />
```

---

## TOC Block

### BEFORE Refactoring

```
┌─────────────────────────────────────────────┐
│  TOC Wrapper                                │
│  Schema Group: "border"                     │
│  - wrapperBorderColor                       │
│  - wrapperBorderWidth                       │
│  - wrapperBorderStyle                       │
│  - wrapperBorderRadius (NUMBER)             │
│  - wrapperShadow                            │
│  - wrapperShadowHover                       │
│  ┌─────────────────────────────────────────┐│
│  │ Table of Contents                       ││
│  │                                         ││
│  │ 1. Heading One                          ││
│  │    1.1 Sub-heading                      ││
│  │ 2. Heading Two                          ││
│  │    2.1 Another Sub                      ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘

CSS Variables:
  --toc-wrapper-border-color
  --toc-border-width
  --toc-border-style
  --toc-border-radius
  --toc-wrapper-shadow
  --toc-wrapper-shadow-hover

Component: <BorderPanel />
```

### AFTER Refactoring

```
┌─────────────────────────────────────────────┐
│  TOC Wrapper                                │
│  Schema Group: "blockBorders"               │
│  - blockBorderColor                         │
│  - blockBorderWidth                         │
│  - blockBorderStyle                         │
│  - blockBorderRadius (OBJECT)               │
│  - blockShadow                              │
│  - blockShadowHover                         │
│  ┌─────────────────────────────────────────┐│
│  │ Table of Contents                       ││
│  │                                         ││
│  │ 1. Heading One                          ││
│  │    1.1 Sub-heading                      ││
│  │ 2. Heading Two                          ││
│  │    2.1 Another Sub                      ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘

CSS Variables:
  --toc-border-color
  --toc-border-width
  --toc-border-style
  --toc-border-radius
  --toc-border-shadow
  --toc-border-shadow-hover

Component: <GenericPanel group="blockBorders" />
```

---

## Border Radius Object Format

### BEFORE (TOC only - inconsistent)

```javascript
// TOC used simple number
"wrapperBorderRadius": {
  "type": "number",
  "default": "4px"
}

// Result: Same radius on all corners
```

### AFTER (All blocks - consistent)

```javascript
// ALL blocks use object format
"blockBorderRadius": {
  "type": "object",
  "default": {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4
  },
  "control": "BorderRadiusControl",
  "unit": "px"
}

// Result: Individual control over each corner
```

Visual representation:
```
┌─TL────────TR─┐
│              │
│              │
│              │
└─BL────────BR─┘

TL = topLeft
TR = topRight
BR = bottomRight
BL = bottomLeft
```

---

## CSS Variable Naming Pattern

### Pattern Structure

```
--{BLOCKNAME}-border-{ELEMENT}-{PROPERTY}
   ↓            ↓       ↓         ↓
accordion     border   button   color
tabs          border   content  width
toc           border   divider  style
                       header   radius
                       block    shadow
```

### Visual Hierarchy

```
BLOCK LEVEL
├── --{block}-border-color
├── --{block}-border-width
├── --{block}-border-style
├── --{block}-border-radius
└── --{block}-border-shadow

ELEMENT LEVEL (header/button)
├── --{block}-border-{element}-color
├── --{block}-border-{element}-width
├── --{block}-border-{element}-style
├── --{block}-border-{element}-radius
└── --{block}-border-{element}-shadow

CONTENT LEVEL (content/panel)
├── --{block}-border-content-color
├── --{block}-border-content-width
├── --{block}-border-content-style
├── --{block}-border-content-radius
└── --{block}-border-content-shadow

DIVIDER LEVEL
├── --{block}-border-divider-color
├── --{block}-border-divider-width
└── --{block}-border-divider-style
```

---

## Schema Group Organization

### BEFORE (Inconsistent)

```
Accordion Schema:
├── headerColors
├── contentColors
├── border ❌ (hyphenated)
├── border-divider ❌ (hyphenated)
├── typography
├── icon
├── layout
└── behavior

Tabs Schema:
├── behavior
├── titleColors
├── titleTypography
├── titleBorders ❌ (camel case)
├── divider ❌ (no pattern)
├── content ❌ (too generic)
├── icon
└── layout

TOC Schema:
├── headerColors
├── contentColors
├── border ❌ (no specificity)
├── typography
├── layout
└── behavior
```

### AFTER (Consistent)

```
Accordion Schema:
├── headerColors
├── contentColors
├── blockBorders ✅ (consistent)
├── elementBorders ✅ (optional)
├── dividerBorders ✅ (consistent)
├── typography
├── icon
├── layout
└── behavior

Tabs Schema:
├── behavior
├── titleColors
├── titleTypography
├── blockBorders ✅ (NEW - consistent)
├── elementBorders ✅ (consistent)
├── contentBorders ✅ (consistent)
├── dividerBorders ✅ (consistent)
├── icon
└── layout

TOC Schema:
├── headerColors
├── contentColors
├── blockBorders ✅ (consistent)
├── typography
├── layout
└── behavior
```

---

## Component Usage Comparison

### BEFORE (BorderPanel)

```jsx
// Accordion
<BorderPanel
  effectiveValues={effectiveValues}
  attributes={attributes}
  setAttributes={setAttributes}
  blockType="accordion"
/>

// Tabs (with custom config!)
<BorderPanel
  effectiveValues={effectiveValues}
  attributes={attributes}
  setAttributes={setAttributes}
  blockType="tabs"
  customConfig={buildTabsBorderConfig()}
/>

// TOC
<BorderPanel
  effectiveValues={effectiveValues}
  attributes={attributes}
  setAttributes={setAttributes}
  blockType="toc"
/>
```

### AFTER (GenericPanel - Multiple Panels)

```jsx
// Accordion
<GenericPanel group="blockBorders" title="Block Borders" {...props} />
<GenericPanel group="elementBorders" title="Header Borders" {...props} />
<GenericPanel group="dividerBorders" title="Divider Borders" {...props} />

// Tabs
<GenericPanel group="blockBorders" title="Container Borders" {...props} />
<GenericPanel group="elementBorders" title="Button Borders" {...props} />
<GenericPanel group="contentBorders" title="Content Borders" {...props} />
<GenericPanel group="dividerBorders" title="Divider Borders" {...props} />

// TOC
<GenericPanel group="blockBorders" title="Block Borders" {...props} />
```

Benefits:
- ✅ No custom config functions needed
- ✅ Clear separation of concerns
- ✅ Consistent across all blocks
- ✅ Easy to add new border groups

---

## Migration Path Visualization

```
OLD ATTRIBUTE                    NEW ATTRIBUTE
────────────────────────────────────────────────

Accordion:
accordionBorderColor      ────>  blockBorderColor
accordionBorderThickness  ────>  blockBorderWidth
dividerBorderThickness    ────>  dividerBorderWidth

Tabs:
tabButtonBorderColor      ────>  buttonBorderColor
tabButtonBorderWidth      ────>  buttonBorderWidth
panelBorderColor          ────>  contentBorderColor
panelBorderWidth          ────>  contentBorderWidth
dividerLineColor          ────>  dividerBorderColor
dividerLineWidth          ────>  dividerBorderWidth

TOC:
wrapperBorderColor        ────>  blockBorderColor
wrapperBorderWidth        ────>  blockBorderWidth
wrapperBorderRadius       ────>  blockBorderRadius
 (number)                         (object)
wrapperShadow             ────>  blockShadow


OLD CSS VARIABLE                 NEW CSS VARIABLE
────────────────────────────────────────────────

Accordion:
--accordion-shadow        ────>  --accordion-border-shadow
--accordion-divider-*     ────>  --accordion-border-divider-*

Tabs:
--tab-button-border-*     ────>  --tabs-border-button-*
--tab-panel-border-*      ────>  --tabs-border-content-*
--divider-*               ────>  --tabs-border-divider-*

TOC:
--toc-wrapper-border-*    ────>  --toc-border-*
--toc-wrapper-shadow      ────>  --toc-border-shadow


OLD GROUP                        NEW GROUP
────────────────────────────────────────────────

Accordion:
border                    ────>  blockBorders
border-divider            ────>  dividerBorders

Tabs:
titleBorders              ────>  elementBorders
content                   ────>  contentBorders
divider                   ────>  dividerBorders
(none)                    ────>  blockBorders (NEW)

TOC:
border                    ────>  blockBorders
```

---

## Expected UI Changes

### Before: Single BorderPanel

```
Inspector Panel:
┌──────────────────────────┐
│ Accordion                │
├──────────────────────────┤
│ ▼ Theme Selector         │
│ ▼ Header Colors          │
│ ▼ Content Colors         │
│ ▼ Border                 │  ← Single panel
│   - Border Color         │
│   - Border Width         │
│   - Border Style         │
│   - Border Radius        │
│   - Shadow               │
│   - Divider Color        │
│   - Divider Width        │
│   - Divider Style        │
│ ▼ Typography             │
└──────────────────────────┘
```

### After: Multiple GenericPanels

```
Inspector Panel:
┌──────────────────────────┐
│ Accordion                │
├──────────────────────────┤
│ ▼ Theme Selector         │
│ ▼ Header Colors          │
│ ▼ Content Colors         │
│ ▼ Block Borders          │  ← Separated
│   - Border Color         │
│   - Border Width         │
│   - Border Style         │
│   - Border Radius        │
│   - Shadow               │
│ ▼ Header Borders         │  ← New (optional)
│   - Border Color         │
│   - Border Width         │
│   - Border Style         │
│   - Border Radius        │
│ ▼ Divider Borders        │  ← Separated
│   - Border Color         │
│   - Border Width         │
│   - Border Style         │
│ ▼ Typography             │
└──────────────────────────┘
```

Benefits:
- ✅ Better organization
- ✅ Clearer purpose of each control
- ✅ Consistent with other panels
- ✅ Easier to find specific controls

---

**This visual guide complements the detailed refactoring plan in `border-refactoring-plan.md`**
