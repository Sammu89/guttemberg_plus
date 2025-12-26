# Auto-Decomposition System

## Overview

The auto-decomposition system automatically generates granular CSS variables for properties like `border-color`, `border-width`, `border-style`, `border-radius`, `padding`, and `margin` without requiring manual `decomposesIn` declarations in schemas.

## How It Works

### 1. Schema Definition (Simple!)

You only need to specify the `cssProperty` attribute:

```json
{
  "borderColor": {
    "type": "string",
    "default": "#dddddd",
    "cssVar": "accordion-border-color",
    "cssProperty": "border-color",  // ← This triggers auto-decomposition!
    "themeable": true
  }
}
```

**No `decomposesIn` needed!** The system automatically detects decomposable properties.

### 2. Auto-Decomposable Properties

The following CSS properties automatically decompose:

| Property | Decomposes Into | Example Variables |
|----------|----------------|-------------------|
| `border-width` | top, right, bottom, left | `--accordion-border-width-top`, `--accordion-border-width-right`, ... |
| `border-color` | top, right, bottom, left | `--accordion-border-color-top`, `--accordion-border-color-right`, ... |
| `border-style` | top, right, bottom, left | `--accordion-border-style-top`, `--accordion-border-style-right`, ... |
| `border-radius` | top-left, top-right, bottom-right, bottom-left | `--accordion-border-radius-top-left`, ... |
| `padding` | top, right, bottom, left | `--accordion-header-padding-top`, ... |
| `margin` | top, right, bottom, left | `--accordion-block-margin-top`, ... |

### 3. Generated Files

The system generates:

#### A. CSS Variables (`blocks/*/src/*_variables.scss`)

```scss
:root {
  --accordion-border-color: #dddddd;
  --accordion-border-color-top: ;
  --accordion-border-color-right: ;
  --accordion-border-color-bottom: ;
  --accordion-border-color-left: ;
}

.gutplus-accordion {
  border-top-color: var(--accordion-border-color-top, var(--accordion-border-color, #dddddd));
  border-right-color: var(--accordion-border-color-right, var(--accordion-border-color, #dddddd));
  border-bottom-color: var(--accordion-border-color-bottom, var(--accordion-border-color, #dddddd));
  border-left-color: var(--accordion-border-color-left, var(--accordion-border-color, #dddddd));
}
```

#### B. PHP Mappings (`php/css-defaults/css-mappings-generated.php`)

```php
$mappings = array(
  'accordion' => array(
    'borderColor' => array('cssVar' => 'accordion-border-color', 'unit' => null, 'type' => 'string'),
    'borderColorTop' => array('cssVar' => 'accordion-border-color-top', 'unit' => null, 'type' => 'string'),
    'borderColorRight' => array('cssVar' => 'accordion-border-color-right', 'unit' => null, 'type' => 'string'),
    'borderColorBottom' => array('cssVar' => 'accordion-border-color-bottom', 'unit' => null, 'type' => 'string'),
    'borderColorLeft' => array('cssVar' => 'accordion-border-color-left', 'unit' => null, 'type' => 'string'),
    // ...
  )
);
```

#### C. JS Mappings (`shared/src/config/css-var-mappings-generated.js`)

```javascript
export const CSS_VAR_MAPPINGS = {
  accordion: {
    borderColor: {
      cssVar: '--accordion-border-color',
      unit: null,
      type: 'string',
      cssProperty: 'border-color'
    },
    borderColorTop: {
      cssVar: '--accordion-border-color-top',
      unit: null,
      type: 'string',
      cssProperty: 'border-top-color'
    },
    // ...
  }
};
```

### 4. Delta System Integration

The Delta system uses these mappings to properly handle granular controls:

```javascript
// When BorderPanel changes individual sides:
customizations.borderColorTop = '#ff0000';     // Maps to --accordion-border-color-top
customizations.borderColorRight = '#00ff00';   // Maps to --accordion-border-color-right
// etc...
```

**Key benefits:**
- ✅ BorderPanel controls can modify individual sides
- ✅ Each side change updates only its specific CSS variable
- ✅ CSS cascade works: `var(--accordion-border-color-top, var(--accordion-border-color))`
- ✅ No more "changing one side changes all sides" bug!

## Implementation Details

### CSS Generator (`build-tools/css-generator.js`)

```javascript
const AUTO_DECOMPOSE_MAP = {
  'border-width': {
    sides: ['top', 'right', 'bottom', 'left'],
    pattern: (base, side) => `border-${side}-width`
  },
  'border-color': {
    sides: ['top', 'right', 'bottom', 'left'],
    pattern: (base, side) => `border-${side}-color`
  },
  // ...
};
```

### Schema Compiler (`build-tools/schema-compiler.js`)

Automatically generates decomposed attribute mappings:

```javascript
// For borderColor attribute:
borderColor → accordion-border-color
borderColorTop → accordion-border-color-top
borderColorRight → accordion-border-color-right
borderColorBottom → accordion-border-color-bottom
borderColorLeft → accordion-border-color-left
```

### Validation

Auto-decomposition validation is built into the schema compiler - no separate validator needed!

## Usage Examples

### Example 1: Border Color Control

**Schema:**
```json
{
  "borderColor": {
    "type": "string",
    "cssProperty": "border-color",
    "cssVar": "accordion-border-color"
  }
}
```

**Generated CSS Variables:**
```
--accordion-border-color
--accordion-border-color-top
--accordion-border-color-right
--accordion-border-color-bottom
--accordion-border-color-left
```

**Delta System Usage:**
```javascript
// User changes top border color in BorderPanel
attributes.customizations.borderColorTop = '#ff0000';
// ↓ Maps to ↓
style="--accordion-border-color-top: #ff0000"
```

### Example 2: Padding Control

**Schema:**
```json
{
  "headerPadding": {
    "type": "object",
    "cssProperty": "padding",
    "cssVar": "accordion-header-padding"
  }
}
```

**Generated CSS Variables:**
```
--accordion-header-padding
--accordion-header-padding-top
--accordion-header-padding-right
--accordion-header-padding-bottom
--accordion-header-padding-left
```

## Migration Guide

### Before (Manual `decomposesIn`)

```json
{
  "borderColor": {
    "cssProperty": "border-color",
    "cssVar": "accordion-border-color",
    "decomposesIn": ["top", "right", "bottom", "left"]  // ❌ No longer needed!
  }
}
```

### After (Auto-Decomposition)

```json
{
  "borderColor": {
    "cssProperty": "border-color",
    "cssVar": "accordion-border-color"
    // decomposesIn removed - happens automatically! ✅
  }
}
```

## Build Commands

```bash
# Generate all files (CSS, mappings)
npm run schema:build

# Validate all schemas and structure
npm run validate:all
```

## Testing

To verify decomposition works:

1. **Check generated CSS variables:**
   ```bash
   grep "border-color" blocks/accordion/src/accordion_variables.scss
   ```

2. **Check PHP mappings:**
   ```bash
   grep "borderColor" php/css-defaults/css-mappings-generated.php
   ```

3. **Check JS mappings:**
   ```bash
   grep "borderColor" shared/src/config/css-var-mappings-generated.js
   ```

4. **Test in editor:**
   - Open BorderPanel control
   - Change individual border sides
   - Verify only that side changes (not all sides)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Schema Definition                                               │
│ { "borderColor": { "cssProperty": "border-color" } }           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Auto-Decomposition Detection (schema-compiler.js)              │
│ Checks AUTO_DECOMPOSE_MAP["border-color"]                      │
│ → sides: ['top', 'right', 'bottom', 'left']                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Generate Mappings                                               │
│ ┌─────────────────────┬─────────────────────┬─────────────────┐│
│ │ PHP                 │ JavaScript          │ SCSS            ││
│ │ borderColorTop →    │ borderColorTop →    │ --var-top       ││
│ │ accordion-border-   │ --accordion-border- │ --var-right     ││
│ │ color-top           │ color-top           │ --var-bottom    ││
│ │                     │                     │ --var-left      ││
│ └─────────────────────┴─────────────────────┴─────────────────┘│
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Delta System Uses Mappings                                      │
│ User changes side → Delta finds mapping → Updates CSS var      │
└─────────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### BorderPanel changes all sides instead of one

**Cause:** CSS mappings not regenerated after schema changes

**Fix:**
```bash
npm run schema:build
```

### Need to verify auto-decomposition is working

**Check generated files:**
```bash
# Check CSS variables
grep "border-color" blocks/accordion/src/accordion_variables.scss

# Check PHP mappings
grep "borderColor" php/css-defaults/css-mappings-generated.php

# Check JS mappings
grep "borderColor" shared/src/config/css-var-mappings-generated.js
```

---

**Generated:** 2025-12-26
**Version:** 2.0.0 (Auto-Decomposition)
