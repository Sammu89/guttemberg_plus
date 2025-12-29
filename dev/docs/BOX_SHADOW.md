# Shadow Panel Implementation Plan

## Overview
Build a reusable Gutenberg sidebar panel for constructing CSS box-shadow values with multiple layers, storing structured data (not CSS strings) as the single source of truth.

---

## Data Model

### Shadow Attribute Structure (Schema)
```json
{
  "shadow": {
    "type": "array",
    "default": [
      {
        "x": { "value": 0, "unit": "px" },
        "y": { "value": 8, "unit": "px" },
        "blur": { "value": 24, "unit": "px" },
        "spread": { "value": 0, "unit": "px" },
        "color": "rgba(0,0,0,0.15)",
        "inset": false
      }
    ],
    "cssVar": "accordion-shadow",
    "group": "borders",
    "subgroup": "External",
    "label": "Block Shadow",
    "description": "Shadow effect for the accordion",
    "themeable": true,
    "control": "ShadowPanel",
    "order": 6,
    "appliesTo": "item",
    "cssProperty": "box-shadow"
  }
}
```

---

## Files to Create/Modify

### 1. NEW: `shared/src/utils/shadow-utils.js`
Pure utility functions for shadow manipulation.

```javascript
// Core function - compiles shadow array to CSS string
buildBoxShadow(shadows: Array): string

// Helper functions
createDefaultShadowLayer(): ShadowLayerObject
duplicateShadowLayer(layer, offsetY = 4): ShadowLayerObject
formatShadowValue(valueObj): string  // e.g., { value: 8, unit: 'px' } → '8px'
```

### 2. NEW: `shared/src/components/controls/full/ShadowPanel.js`
Main panel component with layer management.

**Props:**
- `label`: string
- `value`: array of shadow layer objects
- `onChange`: (newValue) => void
- `disabled`: boolean

**Features:**
- Renders sub-panels for each shadow layer
- Add layer button (duplicates last layer with +4 Y offset)
- Delete button on layers with index > 0

### 3. NEW: `shared/src/components/controls/full/ShadowLayer.js`
Individual shadow layer configuration component with collapsible header.

**Props:**
- `index`: number
- `value`: shadow layer object
- `canDelete`: boolean (false for index 0)
- `onChange`: (updatedLayer) => void
- `onDelete`: () => void
- `disabled`: boolean
- `isOpen`: boolean (controlled collapse state)
- `onToggle`: () => void (toggle collapse)

**Controls (native Gutenberg only):**
- ColorSwatch (existing atom) for color with alpha support
- SliderWithInput for X offset (min: -100, max: 100)
- SliderWithInput for Y offset (min: -100, max: 100)
- SliderWithInput for blur (min: 0, max: 100)
- SliderWithInput for spread (min: -50, max: 50)
- ToggleControl for inset

**Collapsible Behavior:**
- Header shows: "Shadow N" + color swatch preview + delete button (if canDelete)
- Click header to expand/collapse
- Uses chevron icon to indicate state

### 4. MODIFY: `shared/src/components/controls/index.js`
Add exports for ShadowPanel.

### 5. MODIFY: `shared/src/components/controls/full/index.js`
Add export for ShadowPanel.

### 6. MODIFY: `shared/src/components/ControlRenderer.js`
Add case for `ShadowPanel` control type.

### 7. MODIFY: `schemas/accordion.json`
Update `shadow` attribute from string type to array type.

### 8. MODIFY: `build-tools/schema-compiler.js`
Add handling for ShadowPanel control type in inline styles generation.
- Detect array type with ShadowPanel control
- Generate code that calls `buildBoxShadow()` at runtime

### 9. MODIFY: `shared/src/utils/index.js`
Export shadow utilities.

---

## Implementation Order

1. **shadow-utils.js** - Create utility functions first (pure, testable)
2. **ShadowLayer.js** - Build the layer component
3. **ShadowPanel.js** - Build the main panel using ShadowLayer
4. **Update exports** - Add to index files
5. **ControlRenderer.js** - Add the new control case
6. **accordion.json** - Update schema definition
7. **schema-compiler.js** - Add inline styles generation for shadow arrays
8. **Build & test** - Run `npm run schema:build` and verify

---

## UI Layout

```
Shadow
 │
 ├─ [▼] Shadow 1 [●color] ─────────────────────  (collapsible header)
 │   ├─ [ColorSwatch] Color (with alpha)
 │   ├─ [───●───] X Offset    [-100 ─── 100] px/em/rem
 │   ├─ [───●───] Y Offset    [-100 ─── 100] px/em/rem
 │   ├─ [───●───] Blur        [0 ─── 100] px/em/rem
 │   ├─ [───●───] Spread      [-50 ─── 50] px/em/rem
 │   └─ [Toggle] Inset
 │
 ├─ [▶] Shadow 2 [●color] ─────────────── [🗑]  (collapsed)
 │
 └─ [+ Add shadow layer]
```

**Collapsed state**: Shows chevron + title + color preview swatch + delete button
**Expanded state**: Shows all controls below the header

---

## buildBoxShadow() Function Spec

```javascript
/**
 * Compile shadow array to CSS box-shadow string
 * @param {Array} shadows - Array of shadow layer objects
 * @returns {string} Valid CSS box-shadow value
 */
function buildBoxShadow(shadows) {
  if (!shadows || shadows.length === 0) return 'none';

  return shadows
    .filter(layer => layer.color) // Ignore layers without color
    .map(layer => {
      const parts = [];
      if (layer.inset) parts.push('inset');
      parts.push(formatValue(layer.x));
      parts.push(formatValue(layer.y));
      parts.push(formatValue(layer.blur));
      parts.push(formatValue(layer.spread));
      parts.push(layer.color);
      return parts.join(' ');
    })
    .join(', ');
}
```

**Example output:**
```css
0px 8px 24px 0px rgba(0,0,0,0.15), inset 0px 1px 2px 0px rgba(0,0,0,0.2)
```

---

## Key Constraints

- **No raw CSS strings** stored in attributes
- **Only native Gutenberg components** (no third-party UI)
- **First layer protected** - cannot be deleted
- **Units allowed**: px, em, rem (no percentages)
- **No angle/distance controls** - only x/y offsets
- **No per-layer presets**

---

## Schema Compiler Changes

In `generateInlineStylesFunction()`, add handling for ShadowPanel:

```javascript
case 'ShadowPanel': {
  // Import buildBoxShadow at top of generated file
  // Generate: boxShadow: buildBoxShadow(shadow)
  styleLines.push(`boxShadow: buildBoxShadow(${attrName})`);
  break;
}
```

This requires the `buildBoxShadow` function to be available in the edit.js context, so it needs to be imported from shared utils.

---

## Design Decisions

1. **Migration**: Start fresh - ignore old string values, blocks reset to default array
2. **Opacity**: Use ColorPicker's built-in alpha channel (no separate opacity slider)
3. **Collapsible Layers**: Implement now - each layer collapses to header-only view

---

## Critical Files

| File | Action |
|------|--------|
| `shared/src/utils/shadow-utils.js` | CREATE |
| `shared/src/utils/index.js` | MODIFY |
| `shared/src/components/controls/full/ShadowPanel.js` | CREATE |
| `shared/src/components/controls/full/ShadowLayer.js` | CREATE |
| `shared/src/components/controls/full/index.js` | MODIFY |
| `shared/src/components/controls/index.js` | MODIFY |
| `shared/src/components/ControlRenderer.js` | MODIFY |
| `schemas/accordion.json` | MODIFY |
| `build-tools/schema-compiler.js` | MODIFY |
