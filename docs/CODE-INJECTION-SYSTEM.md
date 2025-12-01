# Code Injection System

## Overview

The code injection system auto-generates code INSIDE manual JavaScript files using marker comments. This allows us to maintain manual React logic (event handlers, UI components) while automatically generating repetitive code (styles, defaults, mappings) from schemas.

## Problem Solved

**Before:** Hardcoded styles in edit.js and save.js that needed manual synchronization with schemas
```javascript
// edit.js - MANUAL DUPLICATION (bad!)
const getInlineStyles = () => {
  return {
    container: {
      border: `${effectiveValues.accordionBorderThickness || 1}px...`,
      borderRadius: `${borderRadius.topLeft}px...`,
      // 50+ lines of hardcoded styles...
    }
  };
};
```

**After:** Auto-generated from schema, injected into manual files
```javascript
// edit.js - AUTO-GENERATED from schema (good!)
/* ========== AUTO-GENERATED-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
const getInlineStyles = () => {
  // Generated from accordion.json attributes...
};
/* ========== AUTO-GENERATED-STYLES-END ========== */
```

## How It Works

### 1. Marker Format

Markers are special comments that define injection zones in manual files:

```javascript
/* ========== AUTO-GENERATED-{MARKER-NAME}-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// Generated code appears here...
/* ========== AUTO-GENERATED-{MARKER-NAME}-END ========== */
```

**Marker types:**
- `STYLES` - Style generation functions (getInlineStyles, getCustomizationStyles)
- `DEFAULTS` - Default values extraction (future)
- `CONTROLS` - Inspector control rendering (future)

### 2. Files Affected

**6 manual files** receive injections:
- `blocks/accordion/src/edit.js` (STYLES marker)
- `blocks/accordion/src/save.js` (STYLES marker)
- `blocks/tabs/src/edit.js` (STYLES marker)
- `blocks/tabs/src/save.js` (STYLES marker)
- `blocks/toc/src/edit.js` (STYLES marker)
- `blocks/toc/src/save.js` (STYLES marker)

### 3. Build Pipeline Integration

The injection happens automatically during schema compilation:

```bash
npm run schema:build
```

**Pipeline flow:**
1. Load schemas (accordion.json, tabs.json, toc.json)
2. Generate 24+ files (types, validators, attributes, etc.)
3. **NEW:** Inject code into edit.js and save.js files
4. Report success/skipped/errors

## Usage Guide

### Adding Markers to Files

To enable injection in a file, add marker pairs:

```javascript
/**
 * Apply inline styles from effective values
 */
/* ========== AUTO-GENERATED-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
const getInlineStyles = () => {
  // This content will be replaced on build
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

const styles = getInlineStyles();
```

**Important:**
- Markers must be on their own lines
- START and END markers must both be present
- Content between markers is COMPLETELY REPLACED on each build
- Manual code OUTSIDE markers is preserved

### What Gets Generated

#### For edit.js (STYLES marker):

Generates `getInlineStyles()` function from schema:
- Extracts object-type attributes (padding, border radius)
- Groups attributes by CSS selector (container, title, content, icon)
- Formats values with proper units from schema
- Uses effectiveValues for cascade resolution

#### For save.js (STYLES marker):

Generates `getCustomizationStyles()` function:
- Processes customizations attribute (deltas from theme)
- Uses schema-generated mappings (CSS_VAR_MAPPINGS)
- Outputs only CSS variables for explicit customizations
- Theme values handled by PHP-generated CSS classes

## Schema Requirements

For code injection to work correctly, schema attributes must have:

### For edit.js inline styles:
- `themeable: true` - Include in theme system
- `cssSelector` - CSS selector target (container, title, content, icon)
- `cssProperty` - CSS property name (backgroundColor, fontSize, etc.)
- `type` - Data type (string, number, boolean, object)
- `default` - Default value with units ("18px", "#ffffff", etc.)
- `unit` - CSS unit for numbers ("px", "deg", "%") (optional)

### For save.js CSS variables:
- `themeable: true` - Include in theme system
- `cssVar` - CSS variable suffix (e.g., "title-color" → "--accordion-title-color")
- `type` - Data type
- `default` - Default value
- `unit` - CSS unit for numbers (optional)

### Example Schema Attribute:

```json
{
  "titleFontSize": {
    "type": "number",
    "default": 18,
    "unit": "px",
    "themeable": true,
    "cssVar": "title-font-size",
    "cssSelector": "title",
    "cssProperty": "fontSize",
    "group": "typography",
    "label": "Title Font Size",
    "description": "Font size of the title text",
    "control": "RangeControl",
    "min": 12,
    "max": 48
  }
}
```

This generates:
- **edit.js:** `fontSize: \`\${effectiveValues.titleFontSize || 18}px\``
- **save.js:** Maps to `--accordion-title-font-size` CSS variable

## Safety Features

### 1. Marker Validation
- Checks both START and END markers exist before injection
- Skips files without markers (no errors, just logged)
- Verifies content actually changed after injection

### 2. Manual Code Preservation
- Only replaces content BETWEEN markers
- All code outside markers is untouched
- React logic, imports, event handlers are safe

### 3. Backup System
```javascript
injectCodeIntoFile(filePath, markerName, code, {
  backup: true,  // Creates .backup files before injection
  warnIfMissing: true  // Logs warnings for missing markers
});
```

### 4. Build Reporting
```
Injecting auto-generated code into manual files...

  Accordion (accordion):
    ✓ edit.js - Injected 45 lines
    ✓ save.js - Injected 12 lines

  Tabs (tabs):
    ✓ edit.js - Injected 52 lines
    ✓ save.js - Injected 15 lines

  TOC (toc):
    - edit.js - Skipped (no markers)
    - save.js - Skipped (no markers)

========================================
  Compilation Summary
========================================

  Files generated: 24
  Total lines: 4823
  Code injections: 4 successful, 2 skipped
  Errors: 0
  Time: 87ms
```

## Development Workflow

### Making Schema Changes

1. **Edit schema** (`schemas/accordion.json`):
```json
{
  "newAttribute": {
    "type": "string",
    "default": "#ff0000",
    "themeable": true,
    "cssVar": "new-attribute",
    "cssSelector": "container",
    "cssProperty": "borderColor",
    "group": "colors"
  }
}
```

2. **Run build**:
```bash
npm run schema:build
```

3. **Automatic results**:
- New TypeScript type in `accordion-theme.ts`
- New Zod validator in `accordion-schema.ts`
- New block attribute in `accordion-attributes.js`
- **NEW:** Auto-injected into edit.js inline styles
- **NEW:** Auto-injected into save.js CSS variable mappings

4. **Manual code unchanged**:
- React components still work
- Event handlers preserved
- Imports unchanged
- Only generated code updated

### Testing Injection

Create a test file:
```javascript
// test-injection.js
console.log('Before markers');

/* ========== AUTO-GENERATED-TEST-START ========== */
// Old content here
/* ========== AUTO-GENERATED-TEST-END ========== */

console.log('After markers');
```

Run injection manually:
```javascript
const { injectCodeIntoFile } = require('./build-tools/schema-compiler');

injectCodeIntoFile(
  './test-injection.js',
  'TEST',
  'const injected = "This was injected!";',
  { backup: true, warnIfMissing: true }
);
```

Result:
```javascript
console.log('Before markers');

/* ========== AUTO-GENERATED-TEST-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
const injected = "This was injected!";
/* ========== AUTO-GENERATED-TEST-END ========== */

console.log('After markers');
```

## Error Handling

### Missing Markers
```
⚠️ Warning: Markers not found in edit.js (STYLES)
- edit.js - Skipped (no markers)
```
**Solution:** Add marker pair to file

### Mismatched Markers
```
✗ edit.js - Error: Markers not found (missing END marker)
```
**Solution:** Ensure both START and END markers present

### Invalid Regex
```
✗ save.js - Error: Content unchanged after injection
```
**Solution:** Check marker format matches exactly

## Future Enhancements

### v2.0 - Additional Markers

```javascript
/* ========== AUTO-GENERATED-DEFAULTS-START ========== */
const schemaDefaults = {
  titleColor: '#333333',
  titleFontSize: 18,
  // ...
};
/* ========== AUTO-GENERATED-DEFAULTS-END ========== */
```

### v3.0 - Inspector Controls

```javascript
/* ========== AUTO-GENERATED-CONTROLS-START ========== */
<PanelBody title="Colors">
  <ColorPicker
    label="Title Color"
    value={attributes.titleColor}
    onChange={(value) => setAttributes({ titleColor: value })}
  />
  {/* ... */}
</PanelBody>
/* ========== AUTO-GENERATED-CONTROLS-END ========== */
```

## Best Practices

### DO ✅
- Add markers to files that need generation
- Run `npm run schema:build` after schema changes
- Commit both schemas and injected files together
- Test build before committing

### DON'T ❌
- Edit code between markers manually (will be overwritten)
- Remove markers once added (breaks injection)
- Mix generated and manual code in marker zones
- Skip running build after schema changes

## Architecture Benefits

1. **Single Source of Truth:** Schema → Generated code (one direction)
2. **Zero Duplication:** Styles defined once in schema
3. **Type Safety:** TypeScript types + Zod validators
4. **Manual Control:** React logic remains manual
5. **Build Verification:** Errors caught at compile time
6. **Version Control:** Clear diffs show schema changes

## Troubleshooting

### Injection Not Working

1. Check markers exist in file
2. Verify schema has required fields (cssSelector, cssProperty)
3. Run `npm run schema:build` (not just `npm run build`)
4. Check console output for errors

### Generated Code Incorrect

1. Verify schema attribute structure
2. Check `cssSelector` matches edit.js style object keys
3. Ensure `cssProperty` is valid CSS property name
4. Confirm `type` and `default` are correct

### Build Errors

1. Read error message carefully
2. Check schema JSON is valid
3. Verify all required fields present
4. Look for mismatched quotes/brackets

## Summary

The marker-based code injection system provides:

- **Automation:** Styles auto-generated from schemas
- **Safety:** Manual code preserved outside markers
- **Reliability:** Validation and error handling built-in
- **Performance:** Fast build times (~30ms injection overhead)
- **Maintainability:** Single source of truth architecture

**Result:** Schema changes automatically propagate to all files without manual synchronization.
