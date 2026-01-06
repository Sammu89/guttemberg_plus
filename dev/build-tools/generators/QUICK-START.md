# Quick Start: Block Generator Testing

## TL;DR

```bash
# Run the comprehensive test
node build-tools/generators/test-all-blocks-generator.js

# Currently: ❌ 0/6 tests passing (expected - missing functions)
# Goal: ✅ 6/6 tests passing
```

---

## What's This?

A comprehensive test suite that validates the block-agnostic JSX generator works correctly for all three blocks (Accordion, Tabs, TOC) in both save and edit modes.

---

## Current Status

### ✅ What's Working
- `generateBlockContent()` - Generates block content JSX correctly for all blocks
- Test infrastructure - All validation checks working
- Structure mappings - All three blocks have valid mappings

### ❌ What's Broken
- `generateStructureJsx()` - Missing helper functions:
  - `generateRenderTitle()` - Main dispatcher
  - `generateSingleButtonTitle()` - For accordion
  - `generateRenderTabButtons()` - For tabs
  - `generateConditionalButtonTitle()` - For TOC

### ⚠️ What Needs Improvement
- Indentation - Generated code uses tabs instead of 2 spaces (231 warnings)

---

## Files Created

| File | Purpose |
|------|---------|
| `test-all-blocks-generator.js` | Main test script - runs all validations |
| `README-TEST.md` | Complete test documentation |
| `TEST-RESULTS.md` | Detailed test results from latest run |
| `IMPLEMENTATION-GUIDE.md` | Step-by-step guide to fix failing tests |
| `QUICK-START.md` | This file - quick reference |

---

## Quick Commands

```bash
# Run all tests
node build-tools/generators/test-all-blocks-generator.js

# Test will exit with:
#   - Code 0 if all tests pass
#   - Code 1 if any tests fail

# View detailed results
cat build-tools/generators/TEST-RESULTS.md

# Read implementation guide
cat build-tools/generators/IMPLEMENTATION-GUIDE.md
```

---

## Test Output Format

```
================================================================================
BLOCK-AGNOSTIC GENERATOR COMPREHENSIVE TEST SUITE
================================================================================

Testing ACCORDION - save mode
✓ Loaded structure mapping for accordion
✓ generateStructureJsx() - All validations passed
✓ generateBlockContent() - All validations passed
✓ accordion save mode - PASSED

... (more tests)

================================================================================
TEST RESULTS SUMMARY
================================================================================

┌────────────┬──────────┬────────────────────┬─────────────────────┬─────────┐
│ Block      │ Mode     │ generateStructure  │ generateBlockContent│ Result  │
├────────────┼──────────┼────────────────────┼─────────────────────┼─────────┤
│ accordion  │ save     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
│ accordion  │ edit     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
│ tabs       │ save     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
│ tabs       │ edit     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
│ toc        │ save     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
│ toc        │ edit     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
└────────────┴──────────┴────────────────────┴─────────────────────┴─────────┘

================================================================================
FINAL STATISTICS
================================================================================

Total Tests:    6
Passed:         6
Failed:         0
Warnings:       0
Pass Rate:      100.0%

🎉 ALL TESTS PASSED! 🎉
```

---

## What Gets Tested

### For Each Block (Accordion, Tabs, TOC)
- ✅ Save mode code generation
- ✅ Edit mode code generation

### For Each Generated Function
- ✅ JSX syntax validity
- ✅ RichText.Content in save mode
- ✅ RichText with onChange in edit mode
- ✅ InnerBlocks.Content in save mode
- ✅ InnerBlocks in edit mode
- ✅ No onChange in save mode
- ✅ Proper indentation (2 spaces)
- ✅ No undefined references

### Metrics Collected
- Total lines of code
- Code vs comment lines
- Number of RichText/InnerBlocks
- Conditional statements count
- Function definitions count

---

## How to Fix

1. **Read the implementation guide:**
   ```bash
   cat build-tools/generators/IMPLEMENTATION-GUIDE.md
   ```

2. **Implement missing functions in this order:**
   1. `generateRenderTitle()` - Main dispatcher
   2. `generateSingleButtonTitle()` - Accordion (can rename existing function)
   3. `generateRenderTabButtons()` - Tabs
   4. `generateConditionalButtonTitle()` - TOC

3. **Fix indentation:**
   - Replace tabs with 2 spaces in template strings

4. **Run test after each implementation:**
   ```bash
   node build-tools/generators/test-all-blocks-generator.js
   ```

5. **Verify all tests pass:**
   - Should see 6/6 tests passing
   - 0 errors
   - 0 warnings (after indentation fix)

---

## Integration with Build

Add to `package.json`:

```json
{
  "scripts": {
    "test:generator": "node build-tools/generators/test-all-blocks-generator.js",
    "prebuild": "npm run test:generator && npm run schema:build:warn && ...",
  }
}
```

This ensures the generator is working before building the plugin.

---

## Expected Timeline

- ✅ Test infrastructure - **DONE**
- 🔄 Implement `generateRenderTitle()` - **~10 mins**
- 🔄 Rename/fix `generateSingleButtonTitle()` - **~5 mins**
- 🔄 Implement `generateRenderTabButtons()` - **~30 mins**
- 🔄 Implement `generateConditionalButtonTitle()` - **~30 mins**
- 🔄 Fix indentation - **~15 mins**
- 🔄 Final testing - **~10 mins**

**Total estimated time: ~1.5-2 hours**

---

## Success Indicators

When complete, you should see:

1. ✅ All 6 tests passing
2. ✅ 100% pass rate
3. ✅ 0 errors
4. ✅ 0 warnings
5. ✅ Generated code looks correct in samples
6. ✅ Exit code 0

---

## Next Steps After Tests Pass

1. Run actual build: `npm run build`
2. Test blocks in WordPress editor
3. Verify save/edit functionality
4. Check frontend rendering
5. Validate across all three blocks

---

## Questions?

- **Test failing?** → See `TEST-RESULTS.md`
- **How to implement?** → See `IMPLEMENTATION-GUIDE.md`
- **Test details?** → See `README-TEST.md`
- **Quick reference?** → You're reading it!

---

## Contact

For issues or questions about the test suite, refer to the project documentation or file an issue.

---

**Last Updated:** 2026-01-06
**Test Version:** 1.0.0
**Status:** 🔴 Incomplete (waiting for function implementations)
