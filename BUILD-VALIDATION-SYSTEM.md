# Build Validation System
## Mismatch Detection for Schema-Driven Blocks

**Version:** 2.0.0
**Goal:** Catch schema ↔ code mismatches during build to facilitate debugging

---

## Current State

Your build already has **3 validators** that run during `npm run build`:

| Validator | File | What It Catches |
|-----------|------|-----------------|
| Schema Validator | `schema-validator.js` | JSON syntax, required fields, types, themeable rules |
| Structure Validator | `validate-schema-structure.js` | `appliesTo` refs, element children, bidirectional consistency |
| Usage Validator | `validate-schema-usage.js` | Typos in attribute names (`effectiveValues.titlColor` → error) |

**Current pipeline:**
```
prebuild → schema:validate-structure → schema-compiler.js → validate:schema-usage
build → wp-scripts build
postbuild → rename-css-files.js
```

---

## The Gap

Current validators catch **reference errors** (typos, missing fields) but miss **semantic mismatches**:

| Issue | Example | Current Detection |
|-------|---------|-------------------|
| Data attribute not propagated | `frontend.js` reads `data-icon-position` but `save.js` doesn't set it | **MISSED** |
| SelectControl options unused | `iconPosition: ['left', 'right']` defined but no conditional checks it | **MISSED** |
| Toggle doesn't affect anything | `showIcon: false` but icon styles still applied | **MISSED** |

---

## Proposed: Single Mismatch Validator

Instead of 5 separate agents with complex orchestration, **one focused validator** with 3 checks:

### File: `build-tools/validate-mismatches.js`

```
npm run validate:mismatches
```

**Checks:**

### 1. Data Attribute Sync
**Priority: HIGH** — This catches real bugs

```
frontend.js reads:        save.js must set:
─────────────────────     ─────────────────────
getAttribute('data-x')  → 'data-x': value
```

**Logic:**
1. Scan `frontend.js` for `getAttribute('data-*')` patterns
2. Scan `save.js` for `'data-*':` patterns in `useBlockProps.save({})`
3. Error if frontend reads an attribute that save.js doesn't set

**Example output:**
```
❌ tabs: frontend.js reads 'data-foo' (line 83) but save.js doesn't set it
   Fix: Add 'data-foo': attributes.foo to useBlockProps.save() in save.js:153
```

### 2. SelectControl Options Usage
**Priority: MEDIUM** — Catches dead options

```
schema defines:           code should check:
─────────────────────     ─────────────────────
options: ['a', 'b', 'c']  if (x === 'a') or switch(x)
```

**Logic:**
1. Find attributes with `control: "SelectControl"` and `options` array
2. Search `edit.js`, `save.js`, `frontend.js` for conditionals using that attribute
3. Warning if no conditionals found (attribute does nothing visually)

**Example output:**
```
⚠️  tabs/buttonShape has 3 options ['rounded', 'square', 'pill'] but no conditionals found
    Location: Not in edit.js, save.js, or frontend.js
    This attribute may not affect rendering
```

### 3. Toggle Effect Verification
**Priority: MEDIUM** — Catches toggles that do nothing

```
schema defines:           code should check:
─────────────────────     ─────────────────────
showIcon: ToggleControl   if (showIcon) { render icon }
```

**Logic:**
1. Find attributes with `control: "ToggleControl"`
2. Search for conditionals checking that toggle
3. Warning if toggle exists but isn't checked anywhere

**Example output:**
```
⚠️  accordion/enableAnimation toggle defined but never checked in code
    Expected: if (enableAnimation) or enableAnimation && or similar
```

---

## Implementation

### Single File Approach (No Base Classes)

```javascript
// build-tools/validate-mismatches.js

const fs = require('fs');
const path = require('path');

const BLOCKS = ['accordion', 'tabs', 'toc'];
const ROOT = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════════════
// CHECK 1: Data Attribute Sync
// ═══════════════════════════════════════════════════════════

function checkDataAttributeSync(blockType) {
  const errors = [];

  const frontendPath = path.join(ROOT, `blocks/${blockType}/src/frontend.js`);
  const savePath = path.join(ROOT, `blocks/${blockType}/src/save.js`);

  if (!fs.existsSync(frontendPath) || !fs.existsSync(savePath)) {
    return errors;
  }

  const frontendCode = fs.readFileSync(frontendPath, 'utf8');
  const saveCode = fs.readFileSync(savePath, 'utf8');

  // Find all getAttribute('data-*') calls in frontend.js
  const getAttrRegex = /getAttribute\s*\(\s*['"`](data-[\w-]+)['"`]\s*\)/g;
  const frontendDataAttrs = new Set();
  let match;

  while ((match = getAttrRegex.exec(frontendCode)) !== null) {
    frontendDataAttrs.add(match[1]);
  }

  // Find all 'data-*': patterns in save.js
  const setAttrRegex = /['"`](data-[\w-]+)['"`]\s*:/g;
  const saveDataAttrs = new Set();

  while ((match = setAttrRegex.exec(saveCode)) !== null) {
    saveDataAttrs.add(match[1]);
  }

  // Check for mismatches
  for (const attr of frontendDataAttrs) {
    if (!saveDataAttrs.has(attr)) {
      // Find line number
      const lines = frontendCode.split('\n');
      let lineNum = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`getAttribute`) && lines[i].includes(attr)) {
          lineNum = i + 1;
          break;
        }
      }

      errors.push({
        type: 'error',
        block: blockType,
        message: `frontend.js reads '${attr}' (line ${lineNum}) but save.js doesn't set it`,
        fix: `Add '${attr}': attributes.${kebabToCamel(attr.replace('data-', ''))} to useBlockProps.save()`
      });
    }
  }

  return errors;
}

// ═══════════════════════════════════════════════════════════
// CHECK 2: SelectControl Options Usage
// ═══════════════════════════════════════════════════════════

function checkSelectControlUsage(blockType) {
  const warnings = [];

  const schemaPath = path.join(ROOT, `schemas/${blockType}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  // Find SelectControl attributes with options
  const selectAttrs = Object.entries(schema.attributes || {})
    .filter(([_, attr]) => attr.control === 'SelectControl' && attr.options?.length > 0);

  if (selectAttrs.length === 0) return warnings;

  // Load all code files
  const codeFiles = ['edit.js', 'save.js', 'frontend.js']
    .map(f => path.join(ROOT, `blocks/${blockType}/src/${f}`))
    .filter(f => fs.existsSync(f))
    .map(f => fs.readFileSync(f, 'utf8'))
    .join('\n');

  for (const [attrName, attr] of selectAttrs) {
    // Check if attribute is used in any conditional
    const conditionalPatterns = [
      new RegExp(`${attrName}\\s*===?\\s*['"\`]`, 'g'),  // attr === 'value'
      new RegExp(`['"\`]\\w+['"\`]\\s*===?\\s*${attrName}`, 'g'),  // 'value' === attr
      new RegExp(`switch\\s*\\(\\s*[^)]*${attrName}`, 'g'),  // switch(attr)
      new RegExp(`${attrName}\\s*\\?`, 'g'),  // attr ? (ternary)
    ];

    const hasConditional = conditionalPatterns.some(p => p.test(codeFiles));

    if (!hasConditional) {
      warnings.push({
        type: 'warning',
        block: blockType,
        message: `${attrName} has ${attr.options.length} options but no conditionals found`,
        options: attr.options.map(o => o.value || o),
        fix: `Add conditional logic to handle different ${attrName} values`
      });
    }
  }

  return warnings;
}

// ═══════════════════════════════════════════════════════════
// CHECK 3: Toggle Effect Verification
// ═══════════════════════════════════════════════════════════

function checkToggleEffects(blockType) {
  const warnings = [];

  const schemaPath = path.join(ROOT, `schemas/${blockType}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  // Find ToggleControl attributes
  const toggleAttrs = Object.entries(schema.attributes || {})
    .filter(([_, attr]) => attr.control === 'ToggleControl');

  if (toggleAttrs.length === 0) return warnings;

  // Load all code files
  const codeFiles = ['edit.js', 'save.js', 'frontend.js']
    .map(f => path.join(ROOT, `blocks/${blockType}/src/${f}`))
    .filter(f => fs.existsSync(f))
    .map(f => fs.readFileSync(f, 'utf8'))
    .join('\n');

  for (const [attrName, attr] of toggleAttrs) {
    // Skip internal toggles
    if (attrName.startsWith('_') || attr.reason === 'structural') continue;

    // Check if toggle is used in conditional
    const conditionalPatterns = [
      new RegExp(`if\\s*\\([^)]*${attrName}`, 'g'),  // if (toggle)
      new RegExp(`${attrName}\\s*&&`, 'g'),  // toggle &&
      new RegExp(`${attrName}\\s*\\?`, 'g'),  // toggle ?
      new RegExp(`!\\s*${attrName}`, 'g'),  // !toggle
    ];

    const hasConditional = conditionalPatterns.some(p => p.test(codeFiles));

    if (!hasConditional) {
      warnings.push({
        type: 'warning',
        block: blockType,
        message: `${attrName} toggle defined but never checked in code`,
        fix: `Add conditional: if (${attrName}) { ... } or ${attrName} && render()`
      });
    }
  }

  return warnings;
}

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

function main() {
  const allErrors = [];
  const allWarnings = [];

  console.log('\n🔍 Mismatch Validation\n');

  for (const blockType of BLOCKS) {
    // Run all checks
    allErrors.push(...checkDataAttributeSync(blockType));
    allWarnings.push(...checkSelectControlUsage(blockType));
    allWarnings.push(...checkToggleEffects(blockType));
  }

  // Report errors
  if (allErrors.length > 0) {
    console.log('❌ ERRORS:\n');
    for (const err of allErrors) {
      console.log(`  ${err.block}: ${err.message}`);
      console.log(`     Fix: ${err.fix}\n`);
    }
  }

  // Report warnings
  if (allWarnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    for (const warn of allWarnings) {
      console.log(`  ${warn.block}: ${warn.message}`);
      if (warn.options) {
        console.log(`     Options: ${warn.options.join(', ')}`);
      }
      console.log(`     Fix: ${warn.fix}\n`);
    }
  }

  // Summary
  const total = allErrors.length + allWarnings.length;
  if (total === 0) {
    console.log('✅ No mismatches found\n');
  } else {
    console.log(`Found: ${allErrors.length} errors, ${allWarnings.length} warnings\n`);
  }

  // Exit with error code if errors found
  if (allErrors.length > 0) {
    process.exit(1);
  }
}

main();
```

---

## Integration

### Update package.json

```json
{
  "scripts": {
    "validate:mismatches": "node build-tools/validate-mismatches.js",
    "prebuild": "npm run schema:build && npm run validate:schema-usage && npm run validate:mismatches"
  }
}
```

### Build Pipeline (Updated)

```
prebuild
├── schema:validate-structure    ← Existing (schema integrity)
├── schema-compiler.js           ← Existing (generate 24 files)
├── validate:schema-usage        ← Existing (typo detection)
└── validate:mismatches          ← NEW (semantic mismatches)

build
└── wp-scripts build

postbuild
└── rename-css-files.js
```

---

## What Was Removed from Original Design

| Original | Status | Reason |
|----------|--------|--------|
| Agent 0 (Document existing) | Removed | Not validation, just documentation |
| Agent 3 (Sync Validator) | Removed | Too vague, hard to implement, low value |
| Agent 5 (Rendering Logic) | Removed | Already covered by `validate-schema-structure.js` (appliesTo validation) |
| Base class hierarchy | Removed | Over-engineering for 3 simple checks |
| Parallel execution | Removed | Checks are fast enough sequentially (~50ms total) |
| Configuration file | Removed | Hardcode is fine, easy to modify |
| Babel AST parsing | Removed | Regex works for these patterns |
| 4-week timeline | Removed | Can be built in one session |

---

## Design Principles

1. **Single file** — No class hierarchies, no orchestrators, no abstractions
2. **Regex over AST** — These patterns are simple enough for regex
3. **Errors vs Warnings** — Data sync issues are errors (break build), unused options are warnings
4. **Clear fix suggestions** — Every issue tells you exactly what to do
5. **Fast** — Target < 100ms total validation time
6. **Focused** — 3 high-value checks, not 5 speculative ones

---

## Example Validation Run

```bash
$ npm run build

> guttemberg-plus@1.0.0 prebuild
> npm run schema:build && npm run validate:schema-usage && npm run validate:mismatches

✅ All 3 schemas validated successfully
✅ Schema compilation: 24 files generated (32ms)
✅ Schema usage: 199 valid references in 10 files

🔍 Mismatch Validation

❌ ERRORS:

  tabs: frontend.js reads 'data-button-shape' (line 83) but save.js doesn't set it
     Fix: Add 'data-button-shape': attributes.buttonShape to useBlockProps.save()

⚠️  WARNINGS:

  tabs: buttonShape has 3 options but no conditionals found
     Options: rounded, square, pill
     Fix: Add conditional logic to handle different buttonShape values

Found: 1 errors, 1 warnings

npm ERR! prebuild script failed
```

---

## Benefits Over Original Design

| Metric | Original Design | Refined Design |
|--------|-----------------|----------------|
| Files to create | 8+ | 1 |
| Lines of code | ~1000+ | ~200 |
| Dependencies | Babel, config system | None |
| Time to implement | "4 weeks" | 1 hour |
| Maintenance burden | High (class hierarchy) | Low (single file) |
| False positive handling | Config file | Edit the regex |

---

## Future Extensions (If Needed)

If you later need more checks, add them as functions in the same file:

```javascript
// Future: Check CSS variable usage
function checkCssVarUsage(blockType) {
  // Verify cssVar values in schema are used in SCSS
}

// Future: Check required attributes in save.js
function checkRequiredAttributes(blockType) {
  // Verify all non-themeable attributes are passed to frontend
}
```

No need for plugin architecture, just add functions.

---

## Summary

The original design was over-engineered. This refined version:

- **Catches the same bugs** with 3 focused checks
- **Is simpler** (1 file, ~200 lines, no dependencies)
- **Is faster** to implement and maintain
- **Provides clear error messages** with fix suggestions

The goal is **catching mismatches during build** — not building a validation framework.
