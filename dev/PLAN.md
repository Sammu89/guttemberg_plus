# Plan: Centralize CSS Property Units and Steps

## Overview

Centralize all CSS property unit/step definitions into a single JavaScript file. The schema will only define default values (with units included), while a centralizer file defines which units are available for each CSS property and their step values.

## Key Corrections from User Feedback

1. **Rotate**: Only `deg` unit, range -180 to +180
2. **Margin/padding variants**: `margin-top`, `padding-left`, etc. map to parent (`margin`, `padding`)
3. **Unitless properties**: `{ units: null, steps: null }` - NOT arrays with null
4. **Background**: Keep unitless (color/gradient only)
5. **Validator**: Build-time check that every `cssProperty` in schemas is mapped
6. **Transform**: Use regex to detect rotation, map to correct units
7. **Migration**: Full change, no backwards compatibility needed
8. **Defaults in schema**: Include unit (e.g., `"1.125rem"` or `"180deg"`)

---

## Files to Create/Modify

### Phase 1: Create Centralizer

**CREATE:** `shared/src/config/css-property-scales.js`

```javascript
// Single source of truth for CSS property unit/step definitions
export const CSS_PROPERTY_SCALES = {
  // === TYPOGRAPHY ===
  'font-size': {
    units: ['rem', 'px', '%', 'em'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1 },
    min: { rem: 0.5, px: 8, '%': 50, em: 0.5 },
    max: { rem: 6, px: 96, '%': 300, em: 6 }
  },
  'line-height': {
    units: null,  // Unitless only
    steps: null,
    defaultStep: 0.05,
    min: 0.5,
    max: 3
  },
  'letter-spacing': {
    units: ['em', 'px', 'rem'],
    steps: { em: 0.01, px: 0.5, rem: 0.01 },
    min: { em: -0.2, px: -5, rem: -0.2 },
    max: { em: 1, px: 20, rem: 1 }
  },

  // === SPACING ===
  'padding': {
    units: ['rem', 'px', '%', 'em', 'vw', 'vh'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1, vw: 1, vh: 1 },
    min: { rem: 0, px: 0, '%': 0, em: 0, vw: 0, vh: 0 },
    max: { rem: 20, px: 128, '%': 100, em: 20, vw: 100, vh: 100 }
  },
  'margin': {
    units: ['rem', 'px', '%', 'em', 'vw', 'vh'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1, vw: 1, vh: 1 },
    min: { rem: 0, px: 0, '%': 0, em: 0, vw: 0, vh: 0 },
    max: { rem: 20, px: 128, '%': 100, em: 20, vw: 100, vh: 100 }
  },
  'gap': {
    units: ['rem', 'px', '%', 'em'],
    steps: { rem: 0.1, px: 1, '%': 1, em: 0.1 },
    min: { rem: 0, px: 0, '%': 0, em: 0 },
    max: { rem: 10, px: 64, '%': 50, em: 10 }
  },
  'top': {
    units: ['px', '%', 'rem', 'em', 'vh'],
    steps: { px: 1, '%': 1, rem: 0.1, em: 0.1, vh: 1 },
    min: { px: -200, '%': -100, rem: -20, em: -20, vh: -100 },
    max: { px: 200, '%': 100, rem: 20, em: 20, vh: 100 }
  },

  // === BORDERS ===
  'border-width': {
    units: ['px', 'rem', 'em'],
    steps: { px: 1, rem: 0.1, em: 0.1 },
    min: { px: 0, rem: 0, em: 0 },
    max: { px: 20, rem: 2, em: 2 }
  },
  'border-radius': {
    units: ['px', 'rem', 'em', '%'],
    steps: { px: 1, rem: 0.1, em: 0.1, '%': 1 },
    min: { px: 0, rem: 0, em: 0, '%': 0 },
    max: { px: 100, rem: 10, em: 10, '%': 50 }
  },
  'box-shadow': {
    units: ['px', 'rem', 'em'],
    steps: { px: 1, rem: 0.1, em: 0.1 },
    min: { px: -50, rem: -5, em: -5 },
    max: { px: 50, rem: 5, em: 5 }
  },

  // === TRANSFORM (Rotation only - detected via regex) ===
  'transform': {
    // For rotation: rotate(), rotateX(), rotateY(), rotateZ()
    rotation: {
      units: ['deg'],
      steps: { deg: 1 },
      min: { deg: -180 },
      max: { deg: 180 }
    }
  },

  // === TRANSITIONS ===
  'transition-duration': {
    units: ['ms', 's'],
    steps: { ms: 50, s: 0.05 },
    min: { ms: 0, s: 0 },
    max: { ms: 3000, s: 3 }
  },

  // === UNITLESS PROPERTIES ===
  'color': { units: null, steps: null },
  'background-color': { units: null, steps: null },
  'background': { units: null, steps: null },
  'border-color': { units: null, steps: null },
  'border-style': { units: null, steps: null },
  'display': { units: null, steps: null },
  'font-family': { units: null, steps: null },
  'font-style': { units: null, steps: null },
  'font-weight': { units: null, steps: null },
  'text-align': { units: null, steps: null },
  'text-decoration': { units: null, steps: null },
  'text-transform': { units: null, steps: null },
  'flex-direction': { units: null, steps: null },
  'justify-content': { units: null, steps: null },
  'transition-timing-function': { units: null, steps: null },
  'z-index': { units: null, steps: null },
  'content': { units: null, steps: null },
};

// Alias mappings (variants map to parent property)
export const CSS_PROPERTY_ALIASES = {
  // Border variants → border-width
  'border-top-width': 'border-width',
  'border-right-width': 'border-width',
  'border-bottom-width': 'border-width',
  'border-left-width': 'border-width',

  // Border color/style variants
  'border-top-color': 'border-color',
  'border-right-color': 'border-color',
  'border-bottom-color': 'border-color',
  'border-left-color': 'border-color',
  'border-top-style': 'border-style',
  'border-right-style': 'border-style',
  'border-bottom-style': 'border-style',
  'border-left-style': 'border-style',

  // Padding variants → padding
  'padding-top': 'padding',
  'padding-right': 'padding',
  'padding-bottom': 'padding',
  'padding-left': 'padding',

  // Margin variants → margin
  'margin-top': 'margin',
  'margin-right': 'margin',
  'margin-bottom': 'margin',
  'margin-left': 'margin',

  // Border radius variants → border-radius
  'border-top-left-radius': 'border-radius',
  'border-top-right-radius': 'border-radius',
  'border-bottom-right-radius': 'border-radius',
  'border-bottom-left-radius': 'border-radius',

  // Position variants → top
  'right': 'top',
  'bottom': 'top',
  'left': 'top',
};

// Helper functions...
export function getPropertyScale(cssProperty) { ... }
export function getUnitConfig(cssProperty, unit) { ... }
export function isRotationTransform(attrName, defaultValue) { ... }
```

---

### Phase 2: Update Schema Compiler

**MODIFY:** `build-tools/schema-compiler.js`

1. Import the centralizer at the top
2. Add validation function to check all cssProperty values are mapped
3. Update `generateControlConfigs()` to include scale info from centralizer
4. Update PHP mappings to extract unit from centralizer

**Key changes:**

```javascript
// At top of file
const { CSS_PROPERTY_SCALES, CSS_PROPERTY_ALIASES, getPropertyScale } =
  require('../shared/src/config/css-property-scales.js');

// New validation function
function validateCssPropertyMappings(schema, blockType) {
  const errors = [];

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (!attr.cssProperty) continue;

    const resolved = CSS_PROPERTY_ALIASES[attr.cssProperty] || attr.cssProperty;
    if (!CSS_PROPERTY_SCALES[resolved]) {
      errors.push(
        `[${blockType}] Attribute "${attrName}" has cssProperty "${attr.cssProperty}" ` +
        `which is not mapped in CSS_PROPERTY_SCALES`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

// Call validation in compile()
const cssValidation = validateCssPropertyMappings(schema, blockType);
if (!cssValidation.valid) {
  for (const error of cssValidation.errors) {
    console.error(`❌ ${error}`);
    results.errors.push(error);
  }
}
```

---

### Phase 3: Update Control Components

**MODIFY:** `shared/src/components/controls/SliderWithInput.js`

- Remove hardcoded `UNIT_SCALES` object (lines 17-67)
- Import from centralizer instead
- Accept `cssProperty` prop, use it to get scale config

```javascript
import { getPropertyScale, getUnitConfig, isRotationTransform } from '../../config/css-property-scales';

// Remove UNIT_SCALES entirely

// Update getUnitScale to use centralizer
function getUnitScale(cssProperty, unit, attrName, defaultValue) {
  // Check for rotation transform
  if (cssProperty === 'transform' && isRotationTransform(attrName, defaultValue)) {
    const rotationScale = CSS_PROPERTY_SCALES.transform.rotation;
    return {
      min: rotationScale.min.deg,
      max: rotationScale.max.deg,
      step: rotationScale.steps.deg
    };
  }

  const config = getUnitConfig(cssProperty, unit);
  return config || { min: 0, max: 100, step: 1 };
}
```

**MODIFY:** `shared/src/components/controls/full/BorderPanel.js`

- Remove hardcoded `const units = ['px', 'em', 'rem']`
- Import units from centralizer based on `cssProperty`

**MODIFY:** `shared/src/components/controls/full/SpacingControl.js`

- Add step handling based on current unit
- Get scales from centralizer

---

### Phase 4: Update ControlRenderer

**MODIFY:** `shared/src/components/ControlRenderer.js`

- Pass `cssProperty` to all controls that need it
- Remove deprecated `scaleType` usage

```javascript
case 'SliderWithInput': {
  return (
    <SliderWithInput
      key={attrName}
      label={renderLabel(finalLabel)}
      value={effectiveValue ?? defaultValue}
      onChange={handleChange}
      cssProperty={attrConfig.cssProperty}  // NEW
      units={/* from centralizer based on cssProperty */}
      disabled={isDisabled}
    />
  );
}
```

---

### Phase 5: Clean Up Schemas (MANUAL - User will do this)

**MODIFY:** `schemas/accordion.json`, `schemas/tabs.json`, `schemas/toc.json`

Remove these redundant fields from attributes:
- `units` (now in centralizer)
- `scaleType` (deprecated - replaced by cssProperty lookup)
- `step` (now in centralizer)
- Individual `min`/`max` for sliders (now in centralizer)

Keep:
- `default` (with unit included, e.g., `"1.125rem"`, `"180deg"`)
- `cssProperty` (links to centralizer)
- All other fields unchanged

**Example before:**
```json
"iconRotation": {
  "control": "SliderWithInput",
  "units": ["deg"],
  "scaleType": "rotation",
  "default": 180
}
```

**Example after:**
```json
"iconRotation": {
  "control": "SliderWithInput",
  "cssProperty": "transform",
  "default": "180deg"
}
```

---

## Implementation Order

1. **Create `css-property-scales.js`** - The centralizer file
2. **Update `schema-compiler.js`** - Add validation, update generated configs
3. **Update `SliderWithInput.js`** - Remove UNIT_SCALES, use centralizer
4. **Update `BorderPanel.js`** - Get units from centralizer
5. **Update `SpacingControl.js`** - Add step handling
6. **Update `ControlRenderer.js`** - Pass cssProperty to controls
7. **Clean up schemas** - Remove redundant fields (USER MANUAL)
8. **Run `npm run schema:build`** - Regenerate all files
9. **Test all controls** - Verify unit dropdowns and steps work correctly

---

## Critical Files Summary

| File | Action | Priority |
|------|--------|----------|
| `shared/src/config/css-property-scales.js` | CREATE | P0 |
| `build-tools/schema-compiler.js` | MODIFY (add validation, update generators) | P0 |
| `shared/src/components/controls/SliderWithInput.js` | MODIFY (remove UNIT_SCALES) | P1 |
| `shared/src/components/controls/full/BorderPanel.js` | MODIFY (use centralizer) | P1 |
| `shared/src/components/controls/full/SpacingControl.js` | MODIFY (add step handling) | P1 |
| `shared/src/components/ControlRenderer.js` | MODIFY (pass cssProperty) | P1 |
| `schemas/accordion.json` | MODIFY (remove units/scaleType/step) | P2 - USER MANUAL |
| `schemas/tabs.json` | MODIFY (remove units/scaleType/step) | P2 - USER MANUAL |
| `schemas/toc.json` | MODIFY (remove units/scaleType/step) | P2 - USER MANUAL |

---

## Testing Checklist

After implementation:
- [ ] Font size controls work with rem/px/em/%
- [ ] Padding/margin controls have correct steps per unit
- [ ] Border controls scale properly with unit changes
- [ ] Line-height is unitless (no unit selector shown)
- [ ] Transform/rotation works with deg only, range -180 to +180
- [ ] Color controls show no unit selector
- [ ] Build validator catches unmapped cssProperty values
- [ ] Responsive controls work across all devices
- [ ] No console warnings
