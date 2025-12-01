# Schema Usage Validation Report

**Date:** 2025-12-01
**Status:** 45 invalid attribute references found
**Tool:** `build-tools/validate-schema-usage.js`

---

## Summary

The new schema usage validator has been successfully created and identifies **45 attribute mismatches** across **5 files**. These are attributes referenced in manual JavaScript code that don't exist in the corresponding schema files.

### Statistics
- **Invalid References:** 45
- **Valid References:** 212
- **Files with Issues:** 5/14
- **Clean Files:** 9/14

---

## Issues Found by File

### 1. blocks/accordion/src/edit.js (12 issues)

| Line | Invalid Attribute | Should Be | Notes |
|------|------------------|-----------|-------|
| 591 | `titlePadding` | ❌ Not in schema | No close match found |
| 597 | `contentPadding` | ❌ Not in schema | Suggested: `content`, `contentColor`, `contentFontSize` |
| 603 | `accordionBorderRadius` | ✅ `borderRadius` | Direct match exists |
| 612 | `accordionBorderThickness` | ✅ `borderWidth` | Should use `borderWidth` |
| 613 | `accordionBorderStyle` | ✅ `borderStyle` | Direct match exists |
| 614 | `accordionBorderColor` | ✅ `borderColor` | Direct match exists |
| 616 | `accordionShadow` | ✅ `shadow` | Should use `shadow` |
| 617 | `accordionMarginBottom` | ❌ Not in schema | No close match |
| 643 | `dividerBorderThickness` | ✅ `dividerWidth` | Should use `dividerWidth` |
| 644 | `dividerBorderThickness` | ✅ `dividerWidth` | Should use `dividerWidth` |
| 645 | `dividerBorderStyle` | ✅ `dividerStyle` | Direct match exists |
| 646 | `dividerBorderColor` | ✅ `dividerColor` | Direct match exists |

### 2. blocks/tabs/src/edit.js (18 issues)

| Line | Invalid Attribute | Should Be | Notes |
|------|------------------|-----------|-------|
| 55 | `currentTab` | ❌ Not in schema | State management, not an attribute |
| 75 | `currentTab` | ❌ Not in schema | State management, not an attribute |
| 76 | `currentTab` | ❌ Not in schema | State management, not an attribute |
| 78 | `currentTab` | ❌ Not in schema | State management, not an attribute |
| 393 | `tabListPadding` | ❌ Not in schema | Padding not defined |
| 399 | `panelPadding` | ❌ Not in schema | Padding not defined |
| 405 | `tabButtonPadding` | ❌ Not in schema | Padding not defined |
| 411 | `tabButtonBorderRadius` | ✅ `buttonBorderRadius` | Direct match exists |
| 428 | `tabListGap` | ❌ Not in schema | Gap not defined |
| 450 | `tabButtonBorderWidth` | ✅ `buttonBorderWidth` | Direct match exists |
| 451 | `tabButtonBorderStyle` | ✅ `buttonBorderStyle` | Direct match exists |
| 479 | `panelFontSize` | ❌ Not in schema | Font size not defined for panel |
| 480 | `panelLineHeight` | ❌ Not in schema | Line height not defined |
| 571 | `isDisabled` | ❌ Not in schema | Inner block attribute, not tab block |
| 726 | `isDisabled` | ❌ Not in schema | Inner block attribute, not tab block |
| 791 | `tabId` | ❌ Not in schema | Inner block attribute |
| 799 | `isDisabled` | ❌ Not in schema | Inner block attribute |
| 804 | `isDisabled` | ❌ Not in schema | Inner block attribute |

### 3. blocks/tabs/src/save.js (3 issues)

| Line | Invalid Attribute | Should Be | Notes |
|------|------------------|-----------|-------|
| 157 | `enableResponsiveFallback` | ❌ Not in schema | Feature not in schema |
| 166 | `enableResponsiveFallback` | ❌ Not in schema | Feature not in schema |
| 181 | `currentTab` | ❌ Not in schema | State management |

### 4. blocks/toc/src/edit.js (10 issues)

| Line | Invalid Attribute | Should Be | Notes |
|------|------------------|-----------|-------|
| 797 | `wrapperBorderColor` | ✅ `blockBorderColor` | Use `blockBorderColor` |
| 798 | `wrapperBorderColor` | ✅ `blockBorderColor` | Use `blockBorderColor` |
| 810 | `wrapperBorderWidth` | ✅ `blockBorderWidth` | Use `blockBorderWidth` |
| 811 | `wrapperBorderWidth` | ✅ `blockBorderWidth` | Use `blockBorderWidth` |
| 813 | `wrapperBorderStyle` | ✅ `blockBorderStyle` | Use `blockBorderStyle` |
| 814 | `wrapperBorderStyle` | ✅ `blockBorderStyle` | Use `blockBorderStyle` |
| 816 | `wrapperBorderRadius` | ✅ `blockBorderRadius` | Use `blockBorderRadius` |
| 817 | `wrapperBorderRadius` | ✅ `blockBorderRadius` | Use `blockBorderRadius` |
| 826 | `wrapperShadow` | ✅ `blockShadow` | Use `blockShadow` |
| 827 | `wrapperShadow` | ✅ `blockShadow` | Use `blockShadow` |

### 5. blocks/toc/src/save.js (2 issues)

| Line | Invalid Attribute | Should Be | Notes |
|------|------------------|-----------|-------|
| 108 | `titlePadding` | ❌ Not in schema | Padding not defined |
| 128 | `titlePadding` | ❌ Not in schema | Padding not defined |

---

## Category Breakdown

### Easy Fixes (Direct Schema Matches)
These are simple renames where the schema has the correct attribute:

**Accordion:**
- `accordionBorderRadius` → `borderRadius`
- `accordionBorderThickness` → `borderWidth`
- `accordionBorderStyle` → `borderStyle`
- `accordionBorderColor` → `borderColor`
- `accordionShadow` → `shadow`
- `dividerBorderThickness` → `dividerWidth`
- `dividerBorderStyle` → `dividerStyle`
- `dividerBorderColor` → `dividerColor`

**Tabs:**
- `tabButtonBorderRadius` → `buttonBorderRadius`
- `tabButtonBorderWidth` → `buttonBorderWidth`
- `tabButtonBorderStyle` → `buttonBorderStyle`

**TOC:**
- `wrapperBorderColor` → `blockBorderColor`
- `wrapperBorderWidth` → `blockBorderWidth`
- `wrapperBorderStyle` → `blockBorderStyle`
- `wrapperBorderRadius` → `blockBorderRadius`
- `wrapperShadow` → `blockShadow`

### Missing Attributes (Add to Schema)
These attributes don't exist in schemas but are used in code:

**Padding/Spacing:**
- `titlePadding` (accordion, toc)
- `contentPadding` (accordion)
- `tabListPadding` (tabs)
- `panelPadding` (tabs)
- `tabButtonPadding` (tabs)
- `accordionMarginBottom` (accordion)
- `tabListGap` (tabs)

**Typography:**
- `panelFontSize` (tabs)
- `panelLineHeight` (tabs)

**Features:**
- `enableResponsiveFallback` (tabs)

### State/Non-Schema Issues
These are not schema attributes (state management or inner block attributes):
- `currentTab` (tabs - runtime state)
- `isDisabled` (tabs - inner block attribute)
- `tabId` (tabs - inner block attribute)

---

## How the Validator Works

### Features
1. **Pattern Matching:** Detects attribute references using regex patterns:
   - `effectiveValues.ATTRIBUTE`
   - `attributes.ATTRIBUTE`
   - `values.ATTRIBUTE`
   - `setAttributes({ ATTRIBUTE: ... })`
   - `customizations.ATTRIBUTE`
   - `theme.ATTRIBUTE`

2. **Smart Suggestions:** Uses Levenshtein distance algorithm to suggest close matches
   - Example: `accordionBorderRadius` → suggests `borderRadius`

3. **Multi-Schema Support:** For shared components, checks across all schemas

4. **Line Numbers:** Reports exact line numbers for easy fixing

5. **Exit Code:** Returns non-zero exit code to fail builds when issues found

### Files Scanned
- All block edit.js, save.js, frontend.js files
- All shared components
- Excludes auto-generated files (*-attributes.js)

---

## Integration

### Package.json Scripts
```json
"validate:schema-usage": "node build-tools/validate-schema-usage.js",
"prebuild": "npm run schema:build && npm run validate:schema-usage"
```

### Usage
```bash
# Run standalone
npm run validate:schema-usage

# Runs automatically before build
npm run build
```

---

## Next Steps

### Immediate Actions
1. **Fix Easy Renames:** Update code to use correct schema attribute names
2. **Add Missing Attributes:** Add padding/spacing attributes to schemas
3. **Handle State Variables:** Refactor `currentTab` to use proper state management
4. **Document Inner Blocks:** Update validator to ignore inner block attributes

### Future Enhancements
1. Add TypeScript type checking integration
2. Add auto-fix functionality (like ESLint --fix)
3. Support for nested object attributes (e.g., `borderRadius.topLeft`)
4. Integration with git pre-commit hooks
5. VS Code extension for real-time validation

---

## Validator Location

**File:** `build-tools/validate-schema-usage.js`

**Features:**
- Colored terminal output
- "Did you mean?" suggestions
- Context snippets
- Summary statistics
- Exit codes for CI/CD integration

---

## Benefits

1. **Prevents Bugs:** Catches typos before runtime
2. **Maintains Consistency:** Ensures code matches schemas
3. **Saves Time:** No more hunting for attribute name mismatches
4. **Documentation:** Self-documenting - shows what attributes exist
5. **CI/CD Ready:** Fails builds automatically when issues found

---

## Example Output

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

---

**Status:** Ready for use
**Impact:** High - prevents schema mismatches
**Priority:** Run before merging any code changes
