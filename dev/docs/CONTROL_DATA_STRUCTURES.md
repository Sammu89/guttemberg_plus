# Control Data Structures Reference

**Purpose:** Quick reference for data structures used by all control components in the Guttemberg Plus plugin.

---

## VALIDATION

Run this command to check data structure documentation:

```bash
npm run validate:control-structures
```

Add to `package.json`:
```json
"validate:control-structures": "node build-tools/validate-control-data-structures.js"
```

---

## DATA PATTERNS

All controls follow one of these standardized patterns:

### 1. SCALAR Pattern
**Used by:** SliderWithInput, numeric inputs, single-value controls

**Structure:**
```javascript
// Non-responsive:
"1.125rem"                       // Plain string
16                               // Plain number
{ value: 1.125, unit: "rem" }   // Object with value/unit

// Responsive:
{ value: 1.125, unit: "rem" }                                          // Base (desktop)
{ value: 1.125, unit: "rem", tablet: { value: 1, unit: "rem" } }      // With tablet override
{ value: 1.125, unit: "rem", tablet: {...}, mobile: {...} }           // Full responsive
```

**onChange signature:**
- Non-responsive: `onChange(newValue)` - value can be number, string, or { value, unit }
- Responsive: `onChange(device, newValue)` - device is "desktop"|"tablet"|"mobile"

**Key characteristics:**
- Desktop is the BASE (flat), NOT under a "desktop" key
- Tablet/mobile are OVERRIDES added to base object
- Can be number, string, or object depending on control config

### 2. BOX Pattern (4-sided)
**Used by:** SpacingControl, BorderRadiusControl, box-type controls

**Structure:**
```javascript
// Non-responsive:
{
  top: 16,
  right: 16,
  bottom: 16,
  left: 16,
  unit: "px",
  linked: true
}

// Responsive:
{
  top: 16,           // BASE (desktop)
  right: 16,
  bottom: 16,
  left: 16,
  unit: "px",
  linked: true,
  tablet: { top: 12, right: 12, bottom: 12, left: 12, unit: "px", linked: true },
  mobile: { top: 8, right: 8, bottom: 8, left: 8, unit: "px", linked: true }
}
```

**onChange signature:**
- Non-responsive: `onChange(newValue)` - always full box object
- Responsive: `onChange(device, newValue)` - newValue is full box object for that device

**Key characteristics:**
- Always returns complete box object with all 4 sides
- Desktop is the BASE (flat box), NOT under a "desktop" key
- Tablet/mobile are device-specific box objects

### 3. SIMPLE STRING Pattern
**Used by:** ColorControl, FontFamilyControl, simple text inputs

**Structure:**
```javascript
// Non-responsive only:
"#ff0000"             // Hex
"rgba(255, 0, 0, 0.8)" // RGBA
"inherit"             // Keyword
"Arial, sans-serif"   // Font family
```

**onChange signature:**
- `onChange(newString)` - always a plain string

**Key characteristics:**
- Always a plain string
- No responsive support in the control itself (parent handles it)

### 4. COMPOUND Pattern (Multiple attributes)
**Used by:** BorderPanel (controls 3 attributes at once)

**Structure:**
BorderPanel manages THREE separate attributes:
```javascript
// Width (BOX pattern):
{ top: 1, right: 1, bottom: 1, left: 1, unit: "px", linked: true }

// Color (STRING or BOX pattern):
"#dddddd"  // OR { top: "#dddddd", right: "#cccccc", ..., linked: false }

// Style (STRING or BOX pattern):
"solid"  // OR { top: "solid", right: "dashed", ..., linked: false }
```

**onChange signature:**
- `onChange(newWidthValue)` - for width
- `onColorChange(newColorValue)` - for color
- `onStyleChange(newStyleValue)` - for style

**Key characteristics:**
- Controls multiple attributes simultaneously
- Each attribute can be string (all sides same) or object (per-side)
- Requires special schema setup with `controlId` to link attributes

### 5. ARRAY Pattern
**Used by:** ShadowPanel (box-shadow layers)

**Structure:**
```javascript
[
  { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: "rgba(0,0,0,0.1)", inset: false },
  { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: "rgba(0,0,0,0.05)", inset: false }
]
```

**onChange signature:**
- `onChange(newShadowArray)` - array of shadow layer objects

**Key characteristics:**
- Multiple layers support
- Each layer is an object with shadow properties

---

## CONTROL CATALOG

### ✅ FULLY DOCUMENTED

| Control | Pattern | Responsive | File |
|---------|---------|------------|------|
| **SliderWithInput** | SCALAR | ✓ | `controls/SliderWithInput.js` |
| **SpacingControl** | BOX | ✓ | `controls/full/SpacingControl.js` |
| **ColorControl** | STRING | ✗ | `controls/ColorControl.js` |
| **BorderPanel** | COMPOUND | ✗ | `controls/full/BorderPanel.js` |

### ⚠️ NEEDS DOCUMENTATION

| Control | Pattern | Expected Structure | Priority |
|---------|---------|-------------------|----------|
| **BorderRadiusControl** | BOX (4-corner) | `{ topLeft, topRight, bottomRight, bottomLeft, unit }` | HIGH |
| **ShadowPanel** | ARRAY | `[{ offsetX, offsetY, blur, spread, color, inset }, ...]` | HIGH |
| **AlignmentControl** | STRING | `"left"`, `"center"`, `"right"`, `"justify"` | HIGH |
| **FontFamilyControl** | STRING | `"Arial, sans-serif"`, `"inherit"` | HIGH |
| **AppearanceControl** | OBJECT | `{ weight: 400, style: "normal" }` | HIGH |

### Helper Components (Lower Priority)

These are atoms/molecules that don't need full data structure docs:
- `IconButton`, `SideIcon`, `ToggleChip` - UI elements, not data controls
- `LinkToggle` - Just toggles boolean linked state
- `ResetButton` - Just triggers reset callback
- `DeviceSwitcher` - Just switches device state

---

## RESPONSIVE MODE CHECKLIST

When adding responsive support to a control:

### For SCALAR Pattern Controls:

- [ ] Accept `values` prop (in addition to `value`)
- [ ] Call `onChange(device, newValue)` in responsive mode
- [ ] Desktop edits update BASE (flat), not `values.desktop`
- [ ] Tablet/mobile edits create device overrides
- [ ] Show DeviceSwitcher component when `responsive={true}`
- [ ] Use `useResponsiveDevice()` hook for global device sync

### For BOX Pattern Controls:

- [ ] Accept `value` prop (works for both modes)
- [ ] Call `onChange(device, newValue)` in responsive mode
- [ ] Desktop edits update BASE box properties (flat)
- [ ] Tablet/mobile edits create device-specific box objects
- [ ] Show DeviceSwitcher component when `responsive={true}`
- [ ] Use `useResponsiveDevice()` hook for global device sync

### For STRING Pattern Controls:

- [ ] Usually NOT responsive (parent handles it)
- [ ] If responsive needed, follow SCALAR pattern
- [ ] Or use wrapper component to handle device switching

---

## SCHEMA COMPILER INTEGRATION

### getInlineStyles() Generation

The schema compiler generates code to extract values for editor preview:

**SCALAR with responsive:**
```javascript
fontSize: (() => {
  const val = effectiveValues.titleFontSize;
  if (val === null || val === undefined) return '1.125rem';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const deviceVal = val[responsiveDevice];
    if (deviceVal !== undefined) {
      if (typeof deviceVal === 'object' && deviceVal.value !== undefined) {
        return `${deviceVal.value}${deviceVal.unit || ''}`;
      }
      return deviceVal;
    }
    if (val.value !== undefined) {
      return `${val.value}${val.unit || ''}`;
    }
  }
  return '1.125rem';
})()
```

**BOX with responsive:**
```javascript
padding: (() => {
  const headerPaddingVal = headerPadding[responsiveDevice] || headerPadding;
  const unit = headerPaddingVal.unit || 'px';
  return `${headerPaddingVal.top || 0}${unit} ${headerPaddingVal.right || 0}${unit} ${headerPaddingVal.bottom || 0}${unit} ${headerPaddingVal.left || 0}${unit}`;
})()
```

**Location:** `build-tools/schema-compiler.js` → `generateInlineStylesFunction()`

---

## COMMON BUGS & SOLUTIONS

### Bug: SliderWithInput values don't preview in editor

**Symptom:** Font size, letter spacing, or other SliderWithInput values stick to default despite changing in sidebar.

**Cause:** Schema compiler generates code that assumes `{ desktop: value }` structure, but SliderWithInput uses `{ value, unit, tablet: {...} }`.

**Solution:** See `schemas/SIDEBAR via Schema.md` → "SliderWithInput Data Structure (CRITICAL!)"

**Fix location:** `build-tools/schema-compiler.js` lines 1518-1530

### Bug: Responsive values always show desktop

**Symptom:** Changing tablet/mobile values doesn't affect editor preview.

**Cause:** getInlineStyles() not receiving `responsiveDevice` parameter.

**Solution:** Ensure `edit.js` calls `getInlineStyles(responsiveDevice)` and uses `useResponsiveDevice()` hook.

### Bug: Desktop edits create { desktop: value }

**Symptom:** Desktop edits wrap value in `{ desktop: value }` instead of keeping it flat.

**Cause:** handleResponsiveChange treats desktop as a device key instead of base.

**Solution:** Desktop should update the BASE (flat structure), preserving tablet/mobile overrides. See `ControlRenderer.js` lines 253-271.

### Bug: Margin affects horizontal alignment

**Symptom:** Block margin control changes left/right margins, breaking center/right alignment.

**Cause:** CompactMargin using all 4 sides instead of just top/bottom.

**Solution:** Use `sides={['top', 'bottom']}` prop on SpacingControl. See `ControlRenderer.js` CompactMargin case.

---

## ADDING NEW CONTROLS

### Step 1: Choose Data Pattern

Decide which pattern fits your control:
- **SCALAR** - Single value with optional units (font-size, spacing, etc.)
- **BOX** - 4-sided values (padding, margin, border-radius)
- **STRING** - Simple text/keyword (colors, alignment, font-family)
- **COMPOUND** - Multiple related attributes (borders)
- **ARRAY** - Multiple layers/items (shadows)

### Step 2: Add DATA STRUCTURE Documentation

Copy template from existing controls:
```javascript
/**
 * MyControl Component
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses a [PATTERN] pattern.
 *
 * NON-RESPONSIVE MODE (responsive: false):
 * ----------------------------------------
 * value prop accepts:
 *   [Document structure here]
 *
 * onChange callback signature:
 *   onChange(newValue)
 *   [Document what format is returned]
 *
 * RESPONSIVE MODE (responsive: true):
 * ------------------------------------
 * values prop structure:
 *   [Document structure here]
 *
 * onChange callback signature:
 *   onChange(device, newValue)
 *   [Document format]
 *
 * ============================================================================
 */
```

### Step 3: Implement Standard Props

```javascript
export function MyControl({
  label,
  value,        // For non-responsive OR base value
  values,       // For responsive mode
  onChange,     // Callback
  responsive = false,
  defaultValue,
  ...otherProps
}) {
  // Implementation
}
```

### Step 4: Add to ControlRenderer

Add case in `shared/src/components/ControlRenderer.js`:
```javascript
case 'MyControl': {
  if (responsive) {
    return (
      <MyControl
        label={renderLabel(finalLabel)}
        values={effectiveValue || {}}
        onChange={handleResponsiveChange}
        responsive={true}
        defaultValue={defaultValue}
      />
    );
  }

  return (
    <MyControl
      label={renderLabel(finalLabel)}
      value={effectiveValue ?? defaultValue}
      onChange={handleChange}
      responsive={false}
      defaultValue={defaultValue}
    />
  );
}
```

### Step 5: Update Schema Compiler (if needed)

If your control needs special handling in `getInlineStyles()`:

Edit `build-tools/schema-compiler.js` → `generateInlineStylesFunction()`

Add logic to handle your control's data structure.

### Step 6: Validate

```bash
npm run validate:control-structures
```

Fix any errors or warnings.

---

## TESTING CHECKLIST

When modifying controls or data handling:

- [ ] Run validation: `npm run validate:control-structures`
- [ ] Test non-responsive mode: change value, verify preview updates
- [ ] Test responsive mode: switch devices, verify correct values show
- [ ] Test desktop edits: verify base stays flat (no `desktop` key)
- [ ] Test tablet/mobile edits: verify device overrides are added
- [ ] Test schema compiler: verify generated code handles data structure
- [ ] Run full build: `npm run build` - check for errors
- [ ] Hard refresh browser: Ctrl+Shift+R to clear cache
- [ ] Test in actual editor: create block, change values, verify preview

---

## REFERENCES

- **Main documentation:** `schemas/SIDEBAR via Schema.md`
- **SliderWithInput bug:** `schemas/SIDEBAR via Schema.md` → "SliderWithInput Data Structure"
- **Responsive system:** `schemas/SIDEBAR via Schema.md` → "Responsive Behavior System"
- **Schema compiler:** `build-tools/schema-compiler.js`
- **Control renderer:** `shared/src/components/ControlRenderer.js`
- **Validation script:** `build-tools/validate-control-data-structures.js`
