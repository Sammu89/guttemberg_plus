# Schema Usage Validator

Catches attribute mismatches between manual code and schema definitions at build time.

## Quick Start

```bash
# Run validation
npm run validate:schema-usage

# Runs automatically with build
npm run build
```

## What It Does

Scans JavaScript files for attribute references and validates them against schemas:

```javascript
// ❌ INVALID - Will fail build
effectiveValues.accordionBorderRadius

// ✅ VALID - Exists in schema
effectiveValues.borderRadius
```

## Output Example

```
🔍 Schema Usage Validation
══════════════════════════════════════════════════

✓ Schemas loaded: accordion, tabs, toc

Scanning: blocks/accordion/src/edit.js
✗ Line 603: accordionBorderRadius (not in schema)
   Did you mean: borderRadius?
   const borderRadius = effectiveValues.accordionBorderRadius || {

══════════════════════════════════════════════════
SUMMARY:
✗ 45 invalid attribute references found
✓ 212 valid attribute references
Files with issues: 5/14

BUILD FAILED - Fix attribute names to match schema
```

## Files Scanned

### Block Files
- `blocks/accordion/src/edit.js`
- `blocks/accordion/src/save.js`
- `blocks/accordion/src/frontend.js`
- `blocks/tabs/src/edit.js`
- `blocks/tabs/src/save.js`
- `blocks/tabs/src/frontend.js`
- `blocks/toc/src/edit.js`
- `blocks/toc/src/save.js`
- `blocks/toc/src/frontend.js`

### Shared Components
- `shared/src/components/ThemeSelector.js`
- `shared/src/components/SchemaPanels.js`
- `shared/src/components/GenericPanel.js`
- `shared/src/components/CompactColorControl.js`
- `shared/src/components/CustomizationWarning.js`

### Excluded
- Auto-generated files (`*-attributes.js`)
- Build output (`build/`)
- Node modules

## Patterns Detected

The validator catches these attribute access patterns:

```javascript
// Pattern 1: effectiveValues
effectiveValues.titleColor

// Pattern 2: attributes
attributes.borderWidth

// Pattern 3: values
values.fontSize

// Pattern 4: setAttributes
setAttributes({ titleColor: '#333' })

// Pattern 5: customizations
customizations.borderRadius

// Pattern 6: theme
theme.shadowColor
```

## Common Issues

### 1. Renamed Attributes

**Problem:**
```javascript
effectiveValues.accordionBorderRadius  // ❌ Old name
```

**Fix:**
```javascript
effectiveValues.borderRadius  // ✅ Schema name
```

### 2. Missing Attributes

**Problem:**
```javascript
effectiveValues.titlePadding  // ❌ Not in schema
```

**Fix:** Add to schema first:
```json
"titlePadding": {
  "type": "number",
  "default": 12,
  "cssVar": "accordion-title-padding",
  "group": "typography",
  "label": "Title Padding",
  "description": "Padding around title",
  "themeable": true,
  "control": "RangeControl",
  "min": 0,
  "max": 50,
  "unit": "px"
}
```

Then run:
```bash
npm run schema:build
```

### 3. State Variables (Not Attributes)

**Problem:**
```javascript
attributes.currentTab  // ❌ This is state, not an attribute
```

**Fix:** Use React state:
```javascript
const [currentTab, setCurrentTab] = useState(0);
```

### 4. Inner Block Attributes

**Problem:**
```javascript
panel.attributes.isDisabled  // ❌ Inner block, not parent
```

**Fix:** These are OK - validator needs update to handle inner blocks.

## How to Fix Issues

### Step 1: Run Validation
```bash
npm run validate:schema-usage
```

### Step 2: Review Output
Look at line numbers and suggestions:
```
✗ Line 603: accordionBorderRadius (not in schema)
   Did you mean: borderRadius?
```

### Step 3: Fix Code
Option A - Rename attribute:
```javascript
// Before
const border = effectiveValues.accordionBorderRadius;

// After
const border = effectiveValues.borderRadius;
```

Option B - Add to schema:
1. Edit `schemas/accordion.json`
2. Add attribute definition
3. Run `npm run schema:build`

### Step 4: Re-validate
```bash
npm run validate:schema-usage
```

### Step 5: Build
```bash
npm run build
```

## Ignore Patterns

Some attribute names are automatically ignored because they're common JavaScript properties:

- Array methods: `map`, `filter`, `forEach`, etc.
- Object methods: `keys`, `values`, `entries`, etc.
- React props: `onChange`, `onClick`, `className`, etc.
- Common names: `name`, `value`, `label`, `id`, `type`, etc.

## Exit Codes

- **0** - Success, no issues found
- **1** - Failure, issues found (fails CI/CD build)

## CI/CD Integration

The validator runs automatically in the `prebuild` script:

```json
{
  "scripts": {
    "prebuild": "npm run schema:build && npm run validate:schema-usage",
    "build": "wp-scripts build && npm run postbuild"
  }
}
```

This ensures builds fail if code references non-existent attributes.

## Customization

### Add Files to Scan

Edit `build-tools/validate-schema-usage.js`:

```javascript
const FILES_TO_SCAN = [
  // Add your file here
  'blocks/mynewblock/src/edit.js',
];
```

### Add Patterns

```javascript
const ATTRIBUTE_PATTERNS = [
  /effectiveValues\.(\w+)/g,
  /attributes\.(\w+)/g,
  // Add your pattern here
  /myPattern\.(\w+)/g,
];
```

### Add Ignore Words

```javascript
const IGNORE_WORDS = new Set([
  'length', 'map', 'filter',
  // Add your word here
  'myProperty',
]);
```

## Troubleshooting

### False Positives

If the validator reports valid code as invalid:

1. Check if attribute is in schema
2. Add to `IGNORE_WORDS` if it's not an attribute
3. Check pattern detection logic

### False Negatives

If validator misses invalid references:

1. Check attribute access pattern
2. Add pattern to `ATTRIBUTE_PATTERNS`
3. Report as bug

### Performance

Validator runs in ~100ms for typical project:
- Loads 3 schemas
- Scans 14 files
- Validates 200+ references

## Features

### Smart Suggestions
Uses Levenshtein distance to suggest corrections:
```
accordionBorderRadius → borderRadius (distance: 9)
dividerBorderColor → dividerColor (distance: 6)
```

### Context Display
Shows code snippet for quick reference:
```
const border = effectiveValues.accordionBorderRadius || {
```

### Color-Coded Output
- 🔴 Red - Errors
- 🟢 Green - Success
- 🟡 Yellow - Warnings
- 🔵 Cyan - Suggestions
- ⚪ Gray - Context

### Summary Statistics
```
SUMMARY:
✗ 45 invalid attribute references found
✓ 212 valid attribute references
Files with issues: 5/14
```

## Benefits

1. **Prevents Runtime Errors** - Catch typos at build time
2. **Maintains Consistency** - Code always matches schemas
3. **Saves Development Time** - No debugging undefined attributes
4. **Documentation** - Shows available attributes
5. **CI/CD Ready** - Automatic build failures

## Related Tools

- `schema-compiler.js` - Generates code from schemas
- `schema-validator.js` - Validates schema JSON structure
- `rename-css-files.js` - Post-build CSS processing

## Support

For issues or questions:
1. Check `VALIDATION-REPORT.md` for current status
2. Review schema files in `schemas/`
3. Check attribute definitions in generated `*-attributes.js` files

## Version

**Version:** 1.0.0
**Created:** 2025-12-01
**Status:** Production ready
