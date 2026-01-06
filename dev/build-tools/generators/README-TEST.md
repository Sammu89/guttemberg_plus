# Block Generator Test Suite

## Overview

The `test-all-blocks-generator.js` script provides comprehensive testing for the block-agnostic JSX generator system. It validates that the generator correctly produces JSX code for all three blocks (Accordion, Tabs, TOC) in both save and edit modes.

## Running the Tests

```bash
# Run all tests
node build-tools/generators/test-all-blocks-generator.js

# The test will automatically:
# - Load structure mappings for all blocks
# - Generate code for save and edit modes
# - Validate syntax, component usage, and code quality
# - Display detailed results and metrics
```

## What It Tests

### Blocks Tested
- **Accordion** - save & edit modes
- **Tabs** - save & edit modes
- **TOC** - save & edit modes

### Functions Tested
1. **generateStructureJsx()** - Generates renderTitle/renderHeader functions
2. **generateBlockContent()** - Generates block content JSX (the part inside blockProps)

### Validation Checks

#### ✓ JSX Syntax Validation
- Balanced braces, parentheses, brackets
- No unterminated strings
- No undefined references

#### ✓ RichText Component Usage
- **Save mode**: Uses `RichText.Content` (not `RichText`)
- **Save mode**: No `onChange` handlers
- **Edit mode**: Uses `RichText` (not `RichText.Content`)
- **Edit mode**: Has `onChange` handlers

#### ✓ InnerBlocks Component Usage
- **Save mode**: Uses `InnerBlocks.Content`
- **Edit mode**: Uses `InnerBlocks`

#### ✓ Code Quality
- Proper indentation (2 spaces - warning only)
- Consistent formatting
- No syntax errors

### Output Format

The test provides:

1. **Detailed Test Results**
   - Pass/fail status for each block/mode combination
   - Specific errors with line numbers
   - Warnings for code quality issues

2. **Code Metrics**
   - Total lines of code
   - Code vs comment lines
   - Number of RichText/InnerBlocks components
   - Conditional statements count
   - Function definitions count

3. **Code Samples**
   - First 25 lines of generated code
   - Syntax-highlighted output
   - Line numbers for reference

4. **Summary Table**
   ```
   ┌────────────┬──────────┬────────────────────┬─────────────────────┬─────────┐
   │ Block      │ Mode     │ generateStructure  │ generateBlockContent│ Result  │
   ├────────────┼──────────┼────────────────────┼─────────────────────┼─────────┤
   │ accordion  │ save     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
   │ accordion  │ edit     │ ✓ PASS             │ ✓ PASS              │ ✓ PASS  │
   ...
   ```

5. **Final Statistics**
   - Total tests run
   - Pass/fail counts
   - Warning count
   - Pass rate percentage

## Current Status

As of the latest run:

- ✅ **generateBlockContent()** - Working correctly for all blocks/modes
- ⚠️ **generateStructureJsx()** - Requires implementation of missing helper functions:
  - `generateSingleButtonTitle()` (for accordion)
  - `generateRenderTabButtons()` (for tabs)
  - `generateConditionalButtonTitle()` (for TOC)

## Integration with Build Process

This test should be run:

1. **After refactoring** - Validate that changes don't break existing functionality
2. **Before building** - Ensure generated code will be valid
3. **During development** - Quick feedback on generator changes

You can add it to package.json:

```json
{
  "scripts": {
    "test:generator": "node build-tools/generators/test-all-blocks-generator.js",
    "pretest": "npm run test:generator"
  }
}
```

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed (or error occurred)

## Color-Coded Output

- 🟢 **Green ✓** - Test passed
- 🔴 **Red ✗** - Test failed (blocking error)
- 🟡 **Yellow ⚠** - Warning (non-blocking issue)
- 🔵 **Blue** - Informational headers
- ⚪ **Gray** - Code samples and line numbers

## Troubleshooting

### Common Issues

**"ReferenceError: generateRenderTitle is not defined"**
- The generator file is incomplete
- Missing helper functions need to be implemented
- See the other refactoring agents' tasks

**"No structure mapping found"**
- Run `npm run schema:build` first
- Ensure structure mapping files exist in `schemas/` directory

**"Unbalanced braces/parentheses"**
- Generator is producing invalid JSX
- Check the template string generation
- Look for missing closing tags

## Future Enhancements

Potential additions to the test suite:

- [ ] Full Babel AST parsing for deeper validation
- [ ] Integration with actual save.js/edit.js files
- [ ] Snapshot testing (compare against known-good output)
- [ ] Performance benchmarking
- [ ] Test coverage reporting
- [ ] Automated fix suggestions

## Related Files

- `structure-jsx-generator.js` - The generator being tested
- `test-structure-generator.js` - Simple test for accordion only
- `../schemas/*-structure-mapping-autogenerated.json` - Input structure mappings

## Contact

For questions or issues with this test suite, refer to the main project documentation or file an issue in the project repository.
