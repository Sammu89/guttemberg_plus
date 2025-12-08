# Cross-Schema Validation Script

**Version:** 1.0.0
**Created by:** AGENT 3
**Script:** `build-tools/validate-schema-structure.js`

## Overview

This validation script ensures that structure schemas and attribute schemas stay synchronized. It prevents common errors like:

- Missing element references
- Orphaned attributes
- Circular dependencies
- Invalid CSS class names
- Bidirectional inconsistencies

## Prerequisites

Before running this script, ensure that:

1. **AGENT 1** has created all structure schemas:
   - `schemas/accordion-structure.json`
   - `schemas/tabs-structure.json`
   - `schemas/toc-structure.json`

2. **AGENT 2** has updated all attribute schemas:
   - `schemas/accordion.json` (with `appliesTo` fields)
   - `schemas/tabs.json` (with `appliesTo` fields)
   - `schemas/toc.json` (with `appliesTo` fields)

## Usage

```bash
# Run validation for all blocks
node build-tools/validate-schema-structure.js

# Exit code 0 = success, 1 = failure
```

## Validation Phases

The script performs 5 validation phases for each block:

### Phase 1: Structure Schema Integrity

Validates the structure schema itself:

- ✅ Root element is defined
- ✅ All children references exist
- ✅ No circular dependencies
- ✅ Class names are valid CSS identifiers

**Example Error:**
```
❌ Element "title" references child "icon" that doesn't exist!
   Available elements: title, titleWrapper, content
   Fix: Either add "icon" to elements or remove it from "title.children"
```

### Phase 2: Attribute Schema Integrity

Validates the attribute schema itself:

- ✅ All themeable attributes have `appliesTo`
- ✅ No deprecated `cssSelector` fields
- ✅ All themeable attributes have `cssVar` and `cssProperty`

**Example Error:**
```
❌ Attribute "titleColor" is themeable but missing "appliesTo" field!
   All themeable attributes must specify which element they apply to.
   Fix: Add "appliesTo": "elementId" to this attribute.
```

### Phase 3: Attribute → Structure References

Validates that attributes reference valid elements:

- ✅ All `appliesTo` values exist in structure schema
- ✅ Provides suggestions for typos

**Example Error:**
```
❌ Attribute "titleColor" applies to element "title-button"
   but that element doesn't exist in structure!
   Available elements: title, titleWrapper, content
   Did you mean: title, titleText?
   Fix: Change "appliesTo" to a valid element ID or add the element to structure.
```

### Phase 4: Structure → Attribute References

Validates that elements reference valid attributes:

- ✅ All `appliesStyles` values exist in attribute schema
- ✅ Provides suggestions for typos

**Example Error:**
```
❌ Element "title" applies attribute "titleColour"
   but that attribute doesn't exist in attribute schema!
   Did you mean: titleColor, titleBgColor?
   Fix: Either add "titleColour" to attributes or remove it from "title.appliesStyles"
```

### Phase 5: Bidirectional Consistency

Validates that references are consistent both ways:

- ✅ Attributes that apply to elements are listed in those elements
- ✅ Elements that list attributes match the attributes' `appliesTo`

**Example Warning:**
```
⚠️  Attribute "titleColor" applies to element "title"
   but "title.appliesStyles" doesn't include "titleColor"
   This may cause the style not to be generated in CSS.
   Fix: Add "titleColor" to the appliesStyles array of element "title"
```

## Error vs Warning

### Errors (❌)
- **Exit code:** 1 (build fails)
- **Severity:** Must be fixed
- **Examples:**
  - Missing element references
  - Missing `appliesTo` on themeable attributes
  - Circular dependencies
  - Invalid CSS class names

### Warnings (⚠️)
- **Exit code:** 0 (build succeeds)
- **Severity:** Should be fixed, but not critical
- **Examples:**
  - Deprecated `cssSelector` fields
  - Bidirectional inconsistencies
  - Missing reverse references

## Output Format

### Success
```
============================================================
🔍 Validating accordion schemas...
============================================================

📋 Phase 1: Validating structure schema integrity...
📋 Phase 2: Validating attribute schema integrity...
📋 Phase 3: Validating attribute → structure references...
📋 Phase 4: Validating structure → attribute references...
📋 Phase 5: Validating bidirectional consistency...

────────────────────────────────────────────────────────────

✅ accordion: All validations PASSED!

============================================================
📊 VALIDATION SUMMARY
============================================================

✅ accordion     - PASSED
✅ tabs          - PASSED
✅ toc           - PASSED

────────────────────────────────────────────────────────────
Total: 3 blocks | Passed: 3 | Failed: 0
────────────────────────────────────────────────────────────

✅ All schema validations PASSED!
   Structure and attribute schemas are fully synchronized.
```

### Failure
```
============================================================
🔍 Validating accordion schemas...
============================================================

📋 Phase 1: Validating structure schema integrity...
📋 Phase 2: Validating attribute schema integrity...
📋 Phase 3: Validating attribute → structure references...
📋 Phase 4: Validating structure → attribute references...
📋 Phase 5: Validating bidirectional consistency...

────────────────────────────────────────────────────────────

❌ Validation FAILED (2 errors):

1. ❌ Attribute "titleColor" applies to element "title-button"
   but that element doesn't exist in structure!
   Available elements: title, titleWrapper, content
   Did you mean: title?
   Fix: Change "appliesTo" to a valid element ID or add the element to structure.

2. ❌ Element "icon" applies attribute "iconColor"
   but that attribute doesn't exist in attribute schema!
   Fix: Either add "iconColor" to attributes or remove it from "icon.appliesStyles"

────────────────────────────────────────────────────────────

❌ accordion: FAILED

============================================================
📊 VALIDATION SUMMARY
============================================================

❌ accordion     - FAILED
✅ tabs          - PASSED
✅ toc           - PASSED

────────────────────────────────────────────────────────────
Total: 3 blocks | Passed: 2 | Failed: 1
────────────────────────────────────────────────────────────

❌ Schema validation FAILED for one or more blocks!
   Please fix the errors above before proceeding.
```

## Integration with Build Process

Add this script to your `package.json`:

```json
{
  "scripts": {
    "validate-schemas": "node build-tools/validate-schema-structure.js",
    "build": "npm run validate-schemas && npm run build:blocks",
    "precommit": "npm run validate-schemas"
  }
}
```

## Common Issues and Fixes

### Missing appliesTo

**Error:**
```
❌ Attribute "titleColor" is themeable but missing "appliesTo" field!
```

**Fix:**
```json
{
  "titleColor": {
    "themeable": true,
    "appliesTo": "title",  // ← Add this
    "cssVar": "title-color",
    "cssProperty": "color"
  }
}
```

### Invalid Element Reference

**Error:**
```
❌ Attribute "titleColor" applies to element "title-button"
   but that element doesn't exist in structure!
```

**Fix:**
```json
// Option 1: Fix the element ID
{
  "titleColor": {
    "appliesTo": "title"  // ← Change from "title-button"
  }
}

// Option 2: Add the element to structure schema
{
  "elements": {
    "title-button": {  // ← Add this element
      "tag": "button",
      "className": "accordion-title",
      "appliesStyles": ["titleColor"]
    }
  }
}
```

### Circular Dependency

**Error:**
```
❌ Circular dependency detected in element hierarchy!
   Path: wrapper → content → wrapper
```

**Fix:**
```json
// Remove one of the circular references
{
  "elements": {
    "wrapper": {
      "children": ["content"]  // ✅ OK
    },
    "content": {
      "children": []  // ← Remove "wrapper" from here
    }
  }
}
```

### Invalid CSS Class Name

**Error:**
```
❌ Element "title" has invalid CSS class name(s): 1title, my@class
```

**Fix:**
```json
{
  "elements": {
    "title": {
      "className": "title my-class"  // ← Fix: remove "1title my@class"
    }
  }
}
```

### Bidirectional Inconsistency

**Warning:**
```
⚠️  Attribute "titleColor" applies to element "title"
   but "title.appliesStyles" doesn't include "titleColor"
```

**Fix:**
```json
{
  "elements": {
    "title": {
      "appliesStyles": ["titleColor"]  // ← Add this
    }
  }
}
```

## Advanced Features

### Typo Detection

The script uses Levenshtein distance to detect typos and suggest corrections:

```
❌ Attribute "titleColour" applies to element "titel"
   but that element doesn't exist in structure!
   Did you mean: title, titleText?
```

### Contextual Error Messages

Each error includes:
- **What went wrong:** Clear description
- **Where it went wrong:** Specific element/attribute
- **How to fix it:** Actionable suggestion
- **Available options:** List of valid alternatives

### Comprehensive Reporting

- All errors are collected before exiting
- Errors are numbered and grouped by phase
- Summary shows all blocks at once
- Clear pass/fail indicators

## Testing

To test the validator with intentional errors:

1. Create a test attribute with wrong element reference:
   ```json
   {
     "testAttr": {
       "themeable": true,
       "appliesTo": "nonexistent",
       "cssVar": "test",
       "cssProperty": "color"
     }
   }
   ```

2. Run validator:
   ```bash
   node build-tools/validate-schema-structure.js
   ```

3. Verify error is caught and fix suggestion is helpful

## Architecture

```
validate-schema-structure.js
├── loadJSON()              - Load and parse schemas
├── validateBlock()         - Main validation orchestrator
│   ├── Phase 1: Structure integrity
│   ├── Phase 2: Attribute integrity
│   ├── Phase 3: Attr → Structure
│   ├── Phase 4: Structure → Attr
│   └── Phase 5: Bidirectional
├── detectCircularDependency() - Graph cycle detection
├── validateCSSClassNames()     - CSS identifier validation
├── findSimilarElementIds()     - Typo suggestions
├── levenshteinDistance()       - Edit distance calculation
└── reportResults()             - Error/warning reporting
```

## Performance

- **Typical runtime:** < 100ms for all 3 blocks
- **Memory usage:** < 50MB
- **Dependencies:** Node.js built-ins only (no external packages)

## Maintenance

When adding new validation rules:

1. Add rule to appropriate phase function
2. Follow existing error message format
3. Include fix suggestion in error message
4. Add examples to this README
5. Test with both valid and invalid schemas

## Related Files

- `schemas/*-structure.json` - Structure schema definitions (AGENT 1)
- `schemas/*.json` - Attribute schema definitions (AGENT 2)
- `build-tools/schema-compiler.js` - Schema compilation
- `SINGLE_SOURCE.md` - Architecture documentation
