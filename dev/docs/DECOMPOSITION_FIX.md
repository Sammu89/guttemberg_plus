# BorderPanel Decomposition Fix

## Problem

When using BorderPanel controls (and other decomposable controls like CompactPadding, CompactMargin, CompactBorderRadius) to set individual sides, the changes were not being applied in the editor or frontend.

**Example:**
- User changes border-top-color to red
- All borders turned red instead of just the top border
- Same issue with padding, margin, and border-radius controls

## Root Cause

The system had two disconnected pieces:

1. **CSS Generator** creates decomposed CSS variables:
   ```scss
   --accordion-border-color: #dddddd;
   --accordion-border-color-top: ;
   --accordion-border-color-right: ;
   --accordion-border-color-bottom: ;
   --accordion-border-color-left: ;
   ```

2. **BorderPanel control** saves values as a unified object:
   ```javascript
   borderColor: {
     top: '#ff0000',
     right: '#00ff00',
     bottom: '#0000ff',
     left: '#ffff00'
   }
   ```

3. **Save.js** was calling `formatCssValue()` which only outputs the combined value:
   ```css
   --accordion-border-color: #ff0000 #00ff00 #0000ff #ffff00;
   ```

4. **Missing**: Decomposition of the object into individual side CSS variables:
   ```css
   --accordion-border-color-top: #ff0000;
   --accordion-border-color-right: #00ff00;
   --accordion-border-color-bottom: #0000ff;
   --accordion-border-color-left: #ffff00;
   ```

## Solution

### 1. Created `decomposeObjectToSides()` Helper

**File:** `shared/src/config/css-var-mappings-generated.js`

This function takes an object with side values and decomposes it into individual CSS variable assignments:

```javascript
decomposeObjectToSides('borderColor', {
  top: '#ff0000',
  right: '#00ff00',
  bottom: '#0000ff',
  left: '#ffff00'
}, 'accordion')

// Returns:
{
  '--accordion-border-color-top': '#ff0000',
  '--accordion-border-color-right': '#00ff00',
  '--accordion-border-color-bottom': '#0000ff',
  '--accordion-border-color-left': '#ffff00'
}
```

**Features:**
- ✅ Handles standard directional properties (top, right, bottom, left)
- ✅ Handles border-radius properties (topLeft, topRight, bottomRight, bottomLeft)
- ✅ Handles responsive objects (extracts desktop values)
- ✅ Handles BorderPanel's unlinked mode (where each side is `{ value: X }`)
- ✅ Preserves units from the value object

### 2. Updated Save Components

**Files:**
- `blocks/accordion/src/save.js`
- `blocks/tabs/src/save.js`
- `blocks/toc/src/save.js`

Modified the customization processing to call `decomposeObjectToSides()` for object-type attributes:

```javascript
// Try to decompose objects into individual side CSS variables
if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
  const decomposed = decomposeObjectToSides(attrName, value, 'accordion');
  if (Object.keys(decomposed).length > 0) {
    // Apply decomposed side variables
    Object.assign(customizationStyles, decomposed);
  }
}

// Also set the base variable with the combined value
const formattedValue = formatCssValue(attrName, value, 'accordion');
if (formattedValue !== null) {
  customizationStyles[cssVar] = formattedValue;
}
```

### 3. Enhanced `formatCssValue()` Function

Updated to properly handle:
- Responsive objects (desktop, tablet, mobile)
- BorderPanel's unlinked mode objects
- Proper unit application from the value object

## How It Works Now

### Step 1: User Changes Border in BorderPanel

User sets:
- Top: Red (`#ff0000`)
- Right: Green (`#00ff00`)
- Bottom: Blue (`#0000ff`)
- Left: Yellow (`#ffff00`)

### Step 2: BorderPanel Saves Object

```javascript
attributes.borderColor = {
  top: '#ff0000',
  right: '#00ff00',
  bottom: '#0000ff',
  left: '#ffff00'
}
```

### Step 3: Delta System Detects Change

```javascript
customizations.borderColor = {
  top: '#ff0000',
  right: '#00ff00',
  bottom: '#0000ff',
  left: '#ffff00'
}
```

### Step 4: Save Component Decomposes Object

```javascript
// Decompose into individual sides
const decomposed = decomposeObjectToSides('borderColor', value, 'accordion');
// Returns:
{
  '--accordion-border-color-top': '#ff0000',
  '--accordion-border-color-right': '#00ff00',
  '--accordion-border-color-bottom': '#0000ff',
  '--accordion-border-color-left': '#ffff00'
}

// Also set base variable
const formatted = formatCssValue('borderColor', value, 'accordion');
// Returns: '#ff0000 #00ff00 #0000ff #ffff00'
```

### Step 5: Rendered HTML

```html
<div id="block-123" style="
  --accordion-border-color: #ff0000 #00ff00 #0000ff #ffff00;
  --accordion-border-color-top: #ff0000;
  --accordion-border-color-right: #00ff00;
  --accordion-border-color-bottom: #0000ff;
  --accordion-border-color-left: #ffff00;
">
```

### Step 6: CSS Applies Individual Sides

```scss
.gutplus-accordion {
  border-top-color: var(--accordion-border-color-top, var(--accordion-border-color, #dddddd));
  border-right-color: var(--accordion-border-color-right, var(--accordion-border-color, #dddddd));
  border-bottom-color: var(--accordion-border-color-bottom, var(--accordion-border-color, #dddddd));
  border-left-color: var(--accordion-border-color-left, var(--accordion-border-color, #dddddd));
}
```

## Affected Controls

This fix applies to all decomposable controls:

| Control | Properties | Decomposes Into |
|---------|-----------|-----------------|
| **BorderPanel** | `border-width`, `border-color`, `border-style` | top, right, bottom, left |
| **CompactBorderRadius** | `border-radius` | top-left, top-right, bottom-right, bottom-left |
| **CompactPadding** | `padding` | top, right, bottom, left |
| **CompactMargin** | `margin` | top, right, bottom, left |

## Testing

### Test Border Color Decomposition

1. Add an Accordion block
2. Open BorderPanel control
3. Click the "unlink" icon to decompose sides
4. Set different colors for each side:
   - Top: Red
   - Right: Green
   - Bottom: Blue
   - Left: Yellow
5. ✅ **Expected:** Each border displays its assigned color

### Test Border Width Decomposition

1. Use BorderPanel width controls
2. Unlink sides
3. Set different widths:
   - Top: 1px
   - Right: 3px
   - Bottom: 5px
   - Left: 2px
5. ✅ **Expected:** Each border displays its assigned width

### Test Padding Decomposition

1. Use CompactPadding control
2. Unlink sides
3. Set different padding values:
   - Top: 10px
   - Right: 20px
   - Bottom: 10px
   - Left: 20px
4. ✅ **Expected:** Each side has correct padding

### Test Border Radius Decomposition

1. Use CompactBorderRadius control
2. Unlink corners
3. Set different values:
   - Top-Left: 10px
   - Top-Right: 0px
   - Bottom-Right: 10px
   - Bottom-Left: 0px
4. ✅ **Expected:** Each corner has correct radius

## Frontend Verification

The fix works in both:
- ✅ **Editor**: Changes appear immediately in block preview
- ✅ **Frontend**: Changes appear on published page

Both use the same `decomposeObjectToSides()` function to ensure consistency.

## Build Commands

```bash
# Build after changes
npm run build

# If you modify the schema compiler
npm run schema:build && npm run build
```

## Files Modified

| File | Change |
|------|--------|
| `build-tools/schema-compiler.js` | Added `decomposeObjectToSides()` and updated `formatCssValue()` |
| `shared/src/config/css-var-mappings-generated.js` | Generated with decomposition helper |
| `blocks/accordion/src/save.js` | Added decomposition to `generateBlockCSS()` |
| `blocks/tabs/src/save.js` | Auto-generated with decomposition support |
| `blocks/toc/src/save.js` | Auto-generated with decomposition support |

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ User Changes Border (BorderPanel)                           │
│ borderColor: { top: red, right: green, bottom: blue... }   │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Delta System Detects Change                                  │
│ customizations.borderColor = { top: red, ... }              │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Save Component: generateBlockCSS() / getCustomizationStyles()│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 1. Detect object type attribute                         ││
│ │ 2. Call decomposeObjectToSides(attr, value, blockType)  ││
│ │ 3. Returns: { --var-top: red, --var-right: green, ... } ││
│ │ 4. Assign to customizationStyles                        ││
│ │ 5. Also set base variable with combined value           ││
│ └──────────────────────────────────────────────────────────┘│
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Rendered HTML (Inline CSS)                                   │
│ <div style="                                                 │
│   --accordion-border-color: red green blue yellow;          │
│   --accordion-border-color-top: red;                        │
│   --accordion-border-color-right: green;                    │
│   --accordion-border-color-bottom: blue;                    │
│   --accordion-border-color-left: yellow;                    │
│ ">                                                           │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ CSS Cascade (Auto-generated)                                │
│ border-top-color: var(--var-top, var(--var, default));     │
│ border-right-color: var(--var-right, var(--var, default)); │
│ ...                                                          │
└──────────────────────────────────────────────────────────────┘
```

---

**Fixed:** 2025-12-26
**Version:** 2.0.0 (Auto-Decomposition with Runtime Support)
