# Implementation Guide: Missing Generator Functions

This guide shows exactly what needs to be implemented to make all tests pass.

---

## Quick Start

Run the test to see current status:
```bash
node build-tools/generators/test-all-blocks-generator.js
```

---

## Missing Functions Overview

| Function | Block | Purpose | Priority |
|----------|-------|---------|----------|
| `generateRenderTitle()` | All | Main dispatcher | 🔴 HIGH |
| `generateSingleButtonTitle()` | Accordion | Render title function | 🔴 HIGH |
| `generateRenderTabButtons()` | Tabs | Render tab buttons | 🔴 HIGH |
| `generateConditionalButtonTitle()` | TOC | Render header function | 🔴 HIGH |

---

## Function Signatures

### 1. generateRenderTitle()

**Location:** Add after `detectBlockPattern()` in `structure-jsx-generator.js`

```javascript
/**
 * Generate render function (title/header/buttons) based on block type
 * This is the main entry point that delegates to pattern-specific generators
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated render function code
 */
function generateRenderTitle(structureMapping, mode) {
  const blockPattern = detectBlockPattern(structureMapping);

  // Validate that required elements exist
  const elements = structureMapping.structure.elements;
  if (!elements || Object.keys(elements).length === 0) {
    throw new Error('No elements found in structure mapping');
  }

  // Delegate to pattern-specific generator
  switch (blockPattern) {
    case 'accordion':
      return generateSingleButtonTitle(structureMapping, mode);

    case 'tabs':
      return generateRenderTabButtons(structureMapping, mode);

    case 'toc':
      return generateConditionalButtonTitle(structureMapping, mode);

    default:
      throw new Error(`Unsupported block pattern: ${blockPattern}`);
  }
}
```

---

### 2. generateSingleButtonTitle()

**Location:** Add after `generateAccordionBlockContent()`

**What it should do:**
- Generate the `renderTitle()` function for accordion
- Handle 4 icon position variations (box-left, box-right, left, right)
- Include heading wrapper when headingLevel !== 'none'
- Use RichText.Content (save) or RichText with onChange (edit)

**Reference:** The existing `generateAccordionRenderTitle()` function (lines 53-337) is almost what you need - it just needs to be renamed and verified.

```javascript
/**
 * Generate renderTitle function for accordion pattern
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated renderTitle function code
 */
function generateSingleButtonTitle(structureMapping, mode) {
  // The existing generateAccordionRenderTitle() is exactly this!
  // Either:
  // 1. Rename generateAccordionRenderTitle → generateSingleButtonTitle
  // 2. Or have this function call generateAccordionRenderTitle

  return generateAccordionRenderTitle(structureMapping, mode);
}
```

**Or simply rename the existing function:**
```javascript
// Line 53: Change this
function generateAccordionRenderTitle(structureMapping, mode) {

// To this
function generateSingleButtonTitle(structureMapping, mode) {
```

---

### 3. generateRenderTabButtons()

**Location:** Add after `generateTabsBlockContent()`

**What it should do:**
- Generate the `renderTabButtons()` function for tabs
- Map over `attributes.tabs` array
- Render button for each tab with proper ARIA attributes
- Handle icon rendering based on iconPosition
- Use RichText.Content (save) or RichText with onChange (edit)

**Template structure:**
```javascript
/**
 * Generate renderTabButtons function for tabs pattern
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated renderTabButtons function code
 */
function generateRenderTabButtons(structureMapping, mode) {
  const elements = structureMapping.structure.elements;

  let code = `/**
 * Render tab buttons
 */
const renderTabButtons = () => {
  return attributes.tabs.map( ( tab, index ) => {
    const isActive = index === ( attributes.currentTab || 0 );
    const buttonClasses = [
      'tab-button',
      isActive ? 'active' : '',
      // Add icon position class if needed
    ].filter( Boolean ).join( ' ' );
`;

  if (mode === 'save') {
    code += `
    // ARIA attributes for save mode
    const tabButtonAria = {
      role: 'tab',
      'aria-selected': isActive,
      'aria-controls': \`tab-panel-\${ clientId }-\${ index }\`,
      id: \`tab-button-\${ clientId }-\${ index }\`,
    };

    return (
      <button
        key={ index }
        type="button"
        className={ buttonClasses }
        { ...tabButtonAria }
        data-index={ index }
      >
        <RichText.Content
          tagName="span"
          value={ tab.title || '' }
          className="tab-button-text"
        />
      </button>
    );
`;
  } else {
    code += `
    return (
      <button
        key={ index }
        type="button"
        className={ buttonClasses }
        onClick={ () => setAttributes({ currentTab: index }) }
      >
        <RichText
          tagName="span"
          value={ tab.title || '' }
          onChange={ (value) => {
            const newTabs = [...attributes.tabs];
            newTabs[index] = { ...newTabs[index], title: value };
            setAttributes({ tabs: newTabs });
          }}
          placeholder={ __('Tab title…', 'guttemberg-plus') }
          className="tab-button-text"
        />
      </button>
    );
`;
  }

  code += `
  } );
};`;

  return code;
}
```

---

### 4. generateConditionalButtonTitle()

**Location:** Add after `generateTocBlockContent()`

**What it should do:**
- Generate the `renderHeader()` function for TOC
- Handle two variations: static title (div) or collapsible (button)
- Use data-switch="titleStyle" to conditionally render
- Use RichText.Content (save) or RichText with onChange (edit)

**Template structure:**
```javascript
/**
 * Generate renderHeader function for TOC pattern
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated renderHeader function code
 */
function generateConditionalButtonTitle(structureMapping, mode) {
  const elements = structureMapping.structure.elements;

  let code = `/**
 * Render TOC header (title)
 */
const renderHeader = () => {
  const titleStyle = effectiveValues.titleStyle || 'button';

  if ( titleStyle === 'static' ) {
    // Static title (non-collapsible)
    return (
      <div className="toc-title">
`;

  if (mode === 'save') {
    code += `        <RichText.Content
          tagName="span"
          value={ attributes.title || '' }
          className="toc-title-text"
        />
`;
  } else {
    code += `        <RichText
          tagName="span"
          value={ attributes.title || '' }
          onChange={ (value) => setAttributes({ title: value }) }
          placeholder={ __('Table of Contents', 'guttemberg-plus') }
          className="toc-title-text"
        />
`;
  }

  code += `      </div>
    );
  }

  // Collapsible title (button)
`;

  if (mode === 'save') {
    code += `  return (
    <button
      type="button"
      className="toc-title"
      id={ buttonId }
      aria-expanded={ ! initiallyCollapsed }
      aria-controls={ contentId }
    >
      <RichText.Content
        tagName="span"
        value={ attributes.title || '' }
        className="toc-title-text"
      />
      { /* Icon for collapse/expand */ }
      <span className="toc-toggle-icon">
        { initiallyCollapsed ? '▼' : '▲' }
      </span>
    </button>
  );
`;
  } else {
    code += `  return (
    <button
      type="button"
      className="toc-title"
      onClick={ () => setAttributes({ initiallyCollapsed: !attributes.initiallyCollapsed }) }
    >
      <RichText
        tagName="span"
        value={ attributes.title || '' }
        onChange={ (value) => setAttributes({ title: value }) }
        placeholder={ __('Table of Contents', 'guttemberg-plus') }
        className="toc-title-text"
      />
      { /* Icon for collapse/expand */ }
      <span className="toc-toggle-icon">
        { attributes.initiallyCollapsed ? '▼' : '▲' }
      </span>
    </button>
  );
`;
  }

  code += `};`;

  return code;
}
```

---

## Code Quality Fixes

### Fix Indentation (Tabs → Spaces)

**Find and replace in all generator functions:**

```javascript
// BEFORE (uses tabs)
code += `
\t// Comment
\tconst foo = bar;
`;

// AFTER (uses 2 spaces)
code += `
  // Comment
  const foo = bar;
`;
```

**Regex pattern to find tabs:**
```regex
`\n\t
```

**Replace with:**
```regex
`\n
```

---

## Testing Your Implementation

### Step 1: Implement a function

Add one of the missing functions to `structure-jsx-generator.js`

### Step 2: Run the test

```bash
node build-tools/generators/test-all-blocks-generator.js
```

### Step 3: Check the output

Look for:
- ✅ Green checkmarks for passing tests
- ❌ Red X's for failing tests
- ⚠️ Yellow warnings for code quality issues

### Step 4: Review code sample

The test shows the first 25 lines of generated code. Verify:
- Correct component usage (RichText vs RichText.Content)
- Proper onChange handlers (edit mode only)
- Valid JSX syntax
- Proper indentation

### Step 5: Fix any issues

If tests fail:
1. Read the error message
2. Check the line numbers in the code sample
3. Fix the generator template
4. Re-run the test

---

## Example: Complete Implementation Flow

### 1. Implement generateRenderTitle()

```javascript
// Add this after detectBlockPattern()
function generateRenderTitle(structureMapping, mode) {
  const blockPattern = detectBlockPattern(structureMapping);

  switch (blockPattern) {
    case 'accordion':
      return generateSingleButtonTitle(structureMapping, mode);
    case 'tabs':
      return generateRenderTabButtons(structureMapping, mode);
    case 'toc':
      return generateConditionalButtonTitle(structureMapping, mode);
    default:
      throw new Error(`Unsupported block pattern: ${blockPattern}`);
  }
}
```

### 2. Rename existing accordion function

```javascript
// Line 53: Change function name
function generateSingleButtonTitle(structureMapping, mode) {
  // Keep all existing code from generateAccordionRenderTitle
  // ...
}
```

### 3. Run test

```bash
node build-tools/generators/test-all-blocks-generator.js
```

### 4. Expected result

```
Testing ACCORDION - save mode
✅ generateStructureJsx() - All validations passed
✅ generateBlockContent() - All validations passed
✅ accordion save mode - PASSED

Testing ACCORDION - edit mode
✅ generateStructureJsx() - All validations passed
✅ generateBlockContent() - All validations passed
✅ accordion edit mode - PASSED
```

Tabs and TOC will still fail until you implement their functions.

---

## Verification Checklist

Before considering the work done:

- [ ] All 6 tests pass (accordion/tabs/toc × save/edit)
- [ ] No "ReferenceError: ... is not defined" errors
- [ ] RichText.Content used in save mode
- [ ] RichText with onChange used in edit mode
- [ ] InnerBlocks.Content used in save mode (where applicable)
- [ ] InnerBlocks used in edit mode (where applicable)
- [ ] Indentation uses 2 spaces (not tabs)
- [ ] No unbalanced braces/parentheses
- [ ] Code samples look correct
- [ ] Pass rate is 100%

---

## Need Help?

1. **Check existing implementations:**
   - `generateAccordionBlockContent()` (line 376)
   - `generateTabsBlockContent()` (line 373)
   - `generateTocBlockContent()` (line 491)

2. **Review structure mappings:**
   - `schemas/accordion-structure-mapping-autogenerated.json`
   - `schemas/tabs-structure-mapping-autogenerated.json`
   - `schemas/toc-structure-mapping-autogenerated.json`

3. **Run simple test:**
   ```bash
   node build-tools/generators/test-structure-generator.js
   ```

4. **Check test results:**
   - See `TEST-RESULTS.md` for detailed analysis
   - See `README-TEST.md` for test documentation

---

## Success Criteria

When all tests pass, you should see:

```
===============================================================================
FINAL STATISTICS
===============================================================================

Total Tests:    6
Passed:         6
Failed:         0
Warnings:       0
Pass Rate:      100.0%

🎉 ALL TESTS PASSED! 🎉
```

At that point, the block-agnostic generator is ready for production use! 🚀
