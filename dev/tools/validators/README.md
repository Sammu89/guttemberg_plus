# Validation System

## Overview

The validation system catches bugs in auto-generated code at build time, preventing issues from reaching production.

## Why Validation is Critical

**Problem:** The inline styles generator in `schema-compiler.js` has manual special-case handling that frequently breaks when:
- New control types are added (ColorControl, AppearanceControl, etc.)
- New attribute patterns are introduced (formatting arrays, decoration colors, etc.)
- Object properties need extraction (.color, .weight, .style, etc.)
- Complex type conversions are needed (arrays → CSS properties)

**Without validation:** These bugs only appear at runtime in the WordPress editor (e.g., "[object Object]" displayed instead of color values).

**With validation:** Bugs are caught immediately at build time before code is deployed.

---

## Validators

### 1. `validate-generated-code-completeness.js`

**Purpose:** Validates HTML structure generation in `save.js` and `edit.js`

**What it checks:**
- ✅ All structure elements are rendered
- ✅ All variations (icon position, heading levels) are handled
- ✅ All conditions are evaluated
- ✅ RichText vs RichText.Content usage (save vs edit)
- ✅ InnerBlocks vs InnerBlocks.Content usage

**Catches bugs like:**
- Missing elements from structure mapping
- Unhandled variation cases
- Wrong React component for mode (save/edit)

**Run it:**
```bash
npm run validate:sync          # Strict mode (fails build)
npm run validate:sync:warn     # Warn-only mode
```

---

### 2. `validate-inline-styles-generation.js` ⭐ NEW

**Purpose:** Validates inline styles generation in `edit.js`

**What it checks:**
- ✅ All attributes with `cssProperty` have inline style generation
- ✅ Control-specific handlers exist (ColorControl, AppearanceControl, ShadowPanel)
- ✅ Object properties are extracted (.color, .weight, .style)
- ✅ Arrays are processed correctly (formatting → fontStyle)
- ✅ Responsive attributes access device-specific values (tablet/mobile)
- ✅ Type conversions are correct (string → number for RangeControl)

**Catches bugs like:**
- ❌ Decoration color showing "[object Object]" (missing .color extraction)
- ❌ Formatting array not converting to fontStyle: 'italic'
- ❌ AppearanceControl not splitting into fontWeight/fontStyle
- ❌ Responsive values not being accessed for tablet/mobile devices
- ❌ ShadowPanel not using shadow builder functions

**Run it:**
```bash
npm run validate:inline-styles        # Strict mode (fails build)
npm run validate:inline-styles:warn   # Warn-only mode
```

---

## Validation Rules

### Control Type Handlers

The validator knows about these control types that require special handling:

| Control Type | Requires | Extracts | Generates |
|--------------|----------|----------|-----------|
| `ColorControl` | Object extraction | `.color` property | `color: value` |
| `AppearanceControl` | Object extraction | `.weight`, `.style` | `fontWeight`, `fontStyle` |
| `ShadowPanel` | Array processing | Array of shadows | `textShadow` or `boxShadow` |

**Example:** If your schema has:
```json
"titleDecorationColor": {
  "control": "ColorControl",
  "type": "string"
}
```

The validator checks that inline styles code includes:
```javascript
if (val.color !== undefined) return val.color;
```

---

### Attribute Pattern Handlers

The validator knows about these attribute naming patterns that require special handling:

| Pattern | Type | Requires | Extracts To | Description |
|---------|------|----------|-------------|-------------|
| `formatting` | array | Extraction | `fontStyle` | Check if array includes 'italic' |
| `decorationColor` | string | Object extraction | `.color` property | ColorControl returns {color: value} |

**Example:** If your schema has:
```json
"titleFormatting": {
  "type": "array",
  "control": "CheckboxGroup",
  "options": ["italic", "underline"]
}
```

The validator checks that inline styles code includes:
```javascript
fontStyle: (() => {
  const formatting = effectiveValues.titleFormatting;
  if (Array.isArray(formatting) && formatting.includes('italic')) return 'italic';
  return 'normal';
})()
```

---

## Integration into Build Pipeline

The validators run automatically before every build:

```json
"prebuild": "npm run schema:build:warn && npm run validate:all:warn"
```

**Build flow:**
1. `schema:build:warn` - Generate code from schemas
2. `validate:sync:warn` - Validate HTML structure
3. `validate:inline-styles:warn` - Validate inline styles ⭐ NEW
4. `build` - Webpack compilation
5. `postbuild` - CSS renaming + distribution

**Modes:**
- `--warn-only`: Shows errors but doesn't fail build (used in `prebuild`)
- Default: Fails build on errors (use for CI/CD)

---

## Adding New Validators

To add a new validator:

1. **Create validator file:**
   ```
   build-tools/validators/validate-your-feature.js
   ```

2. **Export validation function:**
   ```javascript
   function validateAll(options = {}) {
     const { warnOnly = false } = options;
     // Your validation logic
     if (!allPassed && !warnOnly) {
       process.exit(1);
     }
     return { totalErrors, totalWarnings };
   }

   module.exports = { validateAll };
   ```

3. **Add npm scripts:**
   ```json
   "validate:your-feature": "node build-tools/validators/validate-your-feature.js",
   "validate:your-feature:warn": "node build-tools/validators/validate-your-feature.js --warn-only"
   ```

4. **Add to validation pipeline:**
   ```json
   "validate:all:warn": "npm run validate:sync:warn && npm run validate:inline-styles:warn && npm run validate:your-feature:warn"
   ```

---

## Validation Error Format

All validators output consistent error formats:

```
📦 ACCORDION
────────────────────────────────────────────────────────────

❌ 2 ERRORS:
   1. [missing-object-extraction] ColorControl for "titleDecorationColor" doesn't extract object properties. ColorControl returns {color: value}, must extract .color property
      Attribute: titleDecorationColor
      Control: ColorControl

   2. [missing-pattern-extraction] Attribute "titleFormatting" matches pattern "formatting" but doesn't extract to "fontStyle". Formatting array must be converted to fontStyle: "italic" or "normal"
      Attribute: titleFormatting
      Pattern: formatting

════════════════════════════════════════════════════════════
📊 SUMMARY: 2 errors, 0 warnings
════════════════════════════════════════════════════════════
```

**Error types include:**
- `missing-object-extraction` - Object properties not extracted
- `missing-pattern-extraction` - Attribute patterns not handled
- `missing-array-processing` - Arrays not processed correctly
- `missing-responsive-handling` - Responsive values not accessed
- `control-naming-mismatch` - Control type doesn't match attribute name

---

## Extending the Inline Styles Validator

### Adding New Control Types

Edit `validate-inline-styles-generation.js`:

```javascript
const SPECIAL_CONTROL_HANDLERS = {
  'YourNewControl': {
    requiresObjectExtraction: true,
    extractProperty: 'value',
    description: 'YourNewControl returns {value: x}, must extract .value'
  }
};
```

### Adding New Attribute Patterns

Edit `validate-inline-styles-generation.js`:

```javascript
const SPECIAL_ATTRIBUTE_PATTERNS = {
  'yourPattern': {
    type: 'array',
    requiresExtraction: true,
    extractTo: 'cssProperty',
    description: 'Your pattern must be converted to cssProperty'
  }
};
```

---

## Validation Best Practices

1. **Run validators locally before committing:**
   ```bash
   npm run validate:all
   ```

2. **Fix errors immediately** - Don't commit code that fails validation

3. **Update validators when adding new features:**
   - New control types → Add to `SPECIAL_CONTROL_HANDLERS`
   - New attribute patterns → Add to `SPECIAL_ATTRIBUTE_PATTERNS`

4. **Use strict mode in CI/CD** - Don't use `--warn-only` flag

5. **Document validation rules** - Update this README when adding new validators

---

## Troubleshooting

### "No AUTO-GENERATED-STYLES section found"

**Cause:** Validator can't find inline styles section in edit.js

**Fix:** Ensure edit.js has markers:
```javascript
/* ========== AUTO-GENERATED-STYLES-START ========== */
// Generated code here
/* ========== AUTO-GENERATED-STYLES-END ========== */
```

### "Attribute X doesn't access device-specific values"

**Cause:** Responsive attribute not checking tablet/mobile values

**Fix:** In `schema-compiler.js`, ensure responsive handler includes:
```javascript
val[responsiveDevice]  // or rawVal[responsiveDevice]
```

### "ColorControl doesn't extract object properties"

**Cause:** Code doesn't extract `.color` property from ColorControl object

**Fix:** In `schema-compiler.js`, add special handling:
```javascript
if (val.color !== undefined) return val.color;
```

### "Formatting array doesn't extract to fontStyle"

**Cause:** Array not being converted to CSS property

**Fix:** In `schema-compiler.js`, add special handling:
```javascript
if (attrName.toLowerCase().includes('formatting') && attr.type === 'array') {
  code.push(`fontStyle: (() => {
    const formatting = effectiveValues.${attrName};
    if (Array.isArray(formatting) && formatting.includes('italic')) return 'italic';
    return 'normal';
  })()`);
  continue;
}
```

---

## Future Improvements

Potential validators to add:

1. **CSS Variable Validator** - Verify CSS variables in SCSS match schema definitions
2. **PHP Mapping Validator** - Verify PHP CSS mappings match schema
3. **Type Safety Validator** - Verify TypeScript types match Zod schemas
4. **Responsive Cascade Validator** - Verify responsive fallback chains are correct
5. **Theme System Validator** - Verify theme delta calculations are correct

---

## Summary

**Before validators:**
- Bugs appear at runtime in WordPress editor
- Manual testing required for every change
- Hard to catch edge cases
- Frequent regressions

**After validators:**
- Bugs caught at build time before deployment
- Automated testing on every build
- Edge cases explicitly checked
- Fewer regressions

**Result:** Faster development, fewer bugs, more confidence in auto-generated code.
