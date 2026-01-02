# Editor-Frontend Synchronization Audit Report

**Date:** 2025-12-29
**Scope:** Accordion, Tabs, and TOC blocks
**Issue:** Mismatches between edit.js (editor) and save.js (frontend) causing rendering differences

---

## Executive Summary

A comprehensive audit of all three blocks (Accordion, Tabs, TOC) reveals **systematic mismatches** where styles and CSS classes are applied to different DOM elements between the editor and frontend. This causes styles to appear correctly in the editor preview but fail to render on the actual frontend.

### Common Pattern

All three blocks suffer from the same architectural issue:
- **Editor:** Applies inline styles directly to parent elements
- **Frontend:** Relies on CSS variables and applies styles to child text elements

This creates inheritance and cascade issues, especially with properties like `text-decoration` that affect child elements differently depending on where they're applied.

---

## Block-by-Block Findings

### 🔴 Accordion Block - CRITICAL ISSUES

#### Issue 1: Text-Decoration Applied to Different Elements

**Editor (edit.js:406-420):**
```javascript
// Applied to PARENT .accordion-title div
const titleElement = (
  <div
    className={ `accordion-title ${ iconPositionClass } ${ titleAlignClass }` }
    style={ {
      ...styles.title,
      ...titleFormattingStyles,  // ← text-decoration HERE (parent)
    } }
  >
    { innerContent }
  </div>
);
```

**Frontend (style.scss:136-169):**
```scss
// Applied to CHILD .accordion-title-text span
.accordion-title-text {
  text-decoration-line: var(--accordion-title-text-decoration-line, none);
  text-decoration-color: var(--accordion-title-decoration-color, currentColor);
  text-decoration-style: var(--accordion-title-decoration-style, solid);
  text-decoration-thickness: var(--accordion-title-decoration-width, auto);
}
```

**Impact:**
- ❌ Icon inherits text-decoration from parent in editor
- ✅ Icon doesn't inherit on frontend (decoration only on text element)
- **Result:** Underlines/overlines/strikethroughs appear on icons in editor but not on frontend

#### Issue 2: Missing Icon Style Resets in Editor

**Editor:** Inline `styles.icon` object lacks text-decoration resets
**Frontend:** CSS class `.accordion-icon` includes explicit resets:

```scss
.accordion-icon {
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  text-transform: none;
  text-shadow: none;
}
```

**Impact:** Even if text-decoration was on correct element, icon would inherit in editor without these resets.

---

### 🔴 Tabs Block - CRITICAL ISSUES

#### Issue 1: Tab Text Container Class Mismatch

**Editor (edit.js:939):**
```jsx
<span className="tab-title tab-button-text">
```

**Frontend (save.js:177):**
```jsx
<span className="tab-button-text">
```

**Impact:**
- CSS rules targeting `.tab-title` won't apply on frontend
- Editor has both classes, frontend has only one
- Potential for completely different styling between editor/frontend

#### Issue 2: Icon Placement in DOM Hierarchy

**Editor:** Icon INSIDE `.tab-title` span (child element)
**Frontend:** Icon SIBLING to `.tab-button-text` span (flex sibling)

**Impact:**
- Different flexbox context
- CSS rules like `.tab-title { justify-content: center }` behave differently
- Icon spacing and alignment calculations differ

#### Issue 3: Icon Rotation Transform Broken in Editor

**Editor (edit.js:369):**
```javascript
icon: {
  transform: effectiveValues.iconRotation ?? '0deg',  // ❌ Invalid!
}
```

**Frontend (style.scss:382):**
```scss
.tab-icon {
  transform: rotate(var(--tabs-icon-rotation-base));  // ✅ Correct
}
```

**Impact:**
- Editor applies `transform: 180deg` (invalid - needs `rotate()` function)
- Icon rotation broken in editor preview
- Frontend works correctly with CSS variable

#### Issue 4: Tab Wrapper Element Mismatch

**Editor:** `<div class="tab-button-container">`
**Frontend:** `<span>` (no class)

**Impact:**
- CSS rules targeting `.tab-button-container` won't apply on frontend
- Block vs inline element affects layout

#### Issue 5: Heading Margin Inconsistency

**Editor:** No inline margin on heading wrapper
**Frontend:** Inline `style={{ margin: 0 }}` on heading wrapper

**Impact:**
- Heading margins appear in editor but not frontend

---

### 🔴 TOC Block - CRITICAL ISSUES

#### Issue 1: Title Styles Applied to Button Instead of Text Span

**Editor (edit.js:716-721):**
```javascript
<button style={ {
  ...styles.title,  // ← Includes textDecoration
  border: 'none',
  ...
} }>
```

**Frontend (save.js:268-355):**
- Button has NO inline styles at all
- Text span also has NO style props
- All styling from CSS variables on root container

**Impact:**
- Title typography (color, size, decoration) renders in editor but not frontend

#### Issue 2: Duplicate Title Styling Objects in Editor

**Editor creates TWO style objects:**
1. `titleTextStyle` (lines 599-606) - for text span
2. `styles.title` (lines 509-518) - for button

Both contain same properties, causing redundancy and confusion.

#### Issue 3: Heading Link Styles Applied Inline in Editor Only

**Editor (lines 872-890):**
```javascript
const headingLinkStyle = {
  color: attributes[ `${ headingKey }Color` ],
  fontSize: attributes[ `${ headingKey }FontSize` ],
  textDecoration: attributes[ `${ headingKey }TextDecoration` ],
  // ... applied to RichText
};
```

**Frontend:** Links are placeholders (`<li className="toc-placeholder">Loading...</li>`) built dynamically by JavaScript

**Impact:**
- Per-level heading styles (H1-H6) work in editor but may not apply on frontend

#### Issue 4: Icon Styling Completely Different

**Editor:** Inline styles (`color`, `fontSize`)
**Frontend:** Data attributes only (`data-icon-rotation`, `data-icon-closed`)

**Impact:**
- Icon color and size styling won't render on frontend

#### Issue 5: Content Padding Applied to Different Elements

**Editor:** Inline style on `<nav className="toc-content">`
**Frontend:** No inline style on nav element

---

## Systematic Issues Across All Blocks

### 1. Architectural Inconsistency

| Aspect | Editor Approach | Frontend Approach |
|--------|----------------|-------------------|
| **Styling method** | Direct inline styles on elements | CSS variables at root level |
| **Style scope** | Multiple elements get inline styles | Only root element gets CSS vars |
| **Typography** | Inline on specific elements | CSS variables cascade down |
| **Text decoration** | Applied to parent elements | CSS targets text elements |

### 2. Missing AUTO-GENERATED Code Coverage

The AUTO-GENERATED styles section in edit.js doesn't account for:
- Which element should receive which styles
- Inheritance patterns needed for frontend parity
- CSS resets needed to prevent unwanted cascade
- Transform function wrappers (`rotate()`, `scale()`, etc.)

### 3. Class Name Mismatches

Multiple instances where editor uses different classes than frontend:
- Accordion: Both match well ✅
- Tabs: `tab-title` present in editor, missing on frontend ❌
- TOC: Classes match but styling application differs ❌

---

## Proposed Validation System

### Goals

1. **Detect DOM structure mismatches** between edit.js and save.js
2. **Validate style application targets** (same element gets styles in both files)
3. **Check CSS class consistency** across editor and frontend
4. **Verify transform property formatting** (needs function wrapper)
5. **Ensure icon resets present** when text-decoration is used

### Architecture

```
build-tools/
└── validators/
    ├── editor-frontend-validator.js  ← Main validator
    ├── dom-structure-parser.js       ← Parse React components
    ├── style-application-checker.js  ← Check where styles applied
    └── class-consistency-checker.js  ← Verify class names match
```

### Validation Rules

#### Rule 1: Text-Decoration Target Consistency

**Check:** If `text-decoration` is in inline styles, ensure it's applied to the text element, not parent.

```javascript
// ❌ FAIL
<div className="accordion-title" style={{ textDecoration: 'underline' }}>
  <span className="accordion-title-text">Text</span>
</div>

// ✅ PASS
<div className="accordion-title">
  <span className="accordion-title-text" style={{ textDecoration: 'underline' }}>Text</span>
</div>
```

#### Rule 2: Icon Reset Presence

**Check:** If parent element has text formatting styles, child icon must have resets.

```javascript
// ❌ FAIL - icon will inherit
<div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
  <span className="icon">▾</span>
</div>

// ✅ PASS - icon has resets
<div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
  <span className="icon" style={{ textDecoration: 'none', fontWeight: 'normal' }}>▾</span>
</div>
```

#### Rule 3: Transform Property Format

**Check:** Transform values must use CSS functions (`rotate()`, `scale()`, etc.)

```javascript
// ❌ FAIL
style={{ transform: '180deg' }}

// ✅ PASS
style={{ transform: 'rotate(180deg)' }}
```

#### Rule 4: Class Name Parity

**Check:** Core structural classes must match between editor and frontend

```javascript
// ACCORDION: Both use .accordion-title-text ✅
// TABS: Editor uses .tab-title but frontend doesn't ❌
```

#### Rule 5: Style Application Element Matching

**Check:** Properties from schema should target same element in both files

```javascript
// Schema defines: titleColor, titleFontSize, titleTextDecoration

// ❌ FAIL - different elements
// edit.js: applied to .accordion-title (parent)
// save.js: applied to .accordion-title-text (child)

// ✅ PASS - same element
// edit.js: applied to .accordion-title-text
// save.js: applied to .accordion-title-text (via CSS vars)
```

### Implementation Strategy

#### Phase 1: Static Analysis Tool

Create a Node.js script that:
1. Parses edit.js and save.js using Babel AST
2. Extracts DOM structure and style applications
3. Compares structural elements between files
4. Reports mismatches with line numbers

#### Phase 2: Schema-Driven Validation

Enhance `schema-compiler.js` to:
1. Generate mapping of which attributes apply to which elements
2. Validate that edit.js and save.js follow the mapping
3. Enforce styling rules (text-decoration on text element only)
4. Auto-generate style objects with proper element targeting

#### Phase 3: Build-Time Integration

Add to `package.json`:
```json
{
  "scripts": {
    "validate:sync": "node build-tools/validators/editor-frontend-validator.js",
    "prebuild": "npm run validate:sync"
  }
}
```

Fail the build if mismatches detected.

### Validation Output Example

```
🔍 Editor-Frontend Sync Validation

❌ ACCORDION BLOCK - 2 issues found

  1. Text-decoration applied to wrong element (edit.js:419)
     Expected: .accordion-title-text
     Found:    .accordion-title (parent)
     Fix:      Move titleFormattingStyles to RichText element

  2. Icon missing text-decoration reset (edit.js:314)
     Parent has: textDecorationLine: 'underline'
     Icon needs: textDecoration: 'none' in inline styles

❌ TABS BLOCK - 5 issues found

  1. Class name mismatch (edit.js:939, save.js:177)
     Editor:   tab-title tab-button-text
     Frontend: tab-button-text
     Fix:      Remove 'tab-title' from editor or add to frontend

  2. Transform property invalid format (edit.js:369)
     Found:    transform: '180deg'
     Expected: transform: 'rotate(180deg)'
     Fix:      Wrap in rotate() function

  [... more issues ...]

❌ TOC BLOCK - 4 issues found

  [... issues ...]

📊 Summary: 11 issues across 3 blocks
```

---

## Recommended Fixes

### Short-term (Manual Fixes)

1. **Accordion:** Move `titleFormattingStyles` from parent div to RichText style prop
2. **Tabs:** Add `rotate()` wrapper to icon transform, remove `tab-title` class or add to frontend
3. **TOC:** Move title styles from button to text span, ensure frontend JS applies styles

### Long-term (Architectural)

1. **Schema Enhancement:** Add `targetElement` field to schema attributes
   ```json
   {
     "titleColor": {
       "targetElement": ".accordion-title-text",
       "cssVar": "title-color"
     }
   }
   ```

2. **Unified Styling Approach:** Editor should use same CSS variable approach as frontend
   - Generate CSS variables in editor
   - Apply to root element only
   - Let cascade work naturally

3. **AUTO-GENERATED Style Targeting:** Schema compiler should generate style objects with correct element targeting
   ```javascript
   // Instead of:
   icon: { transform: iconRotation }

   // Generate:
   icon: { transform: iconRotation ? `rotate(${iconRotation})` : undefined }
   ```

4. **Mandatory Resets:** When parent has text formatting, auto-generate icon resets
   ```javascript
   // Auto-detect text-decoration on parent
   // Auto-add resets to icon styles
   icon: {
     textDecoration: 'none',
     fontWeight: 'normal',
     fontStyle: 'normal',
   }
   ```

---

## Validation System Requirements

### Must Have

- ✅ Parse React JSX in edit.js and save.js
- ✅ Detect style prop applications and their target elements
- ✅ Compare class names between editor and frontend
- ✅ Validate transform property formatting
- ✅ Check for icon resets when text-decoration present
- ✅ Report issues with file paths and line numbers
- ✅ Fail build on critical mismatches

### Nice to Have

- Auto-fix capabilities for common issues
- Visual diff showing editor vs frontend DOM structure
- Integration with IDE (VS Code extension)
- Real-time validation during development
- Severity levels (critical vs warning)

---

## Next Steps

1. ✅ Complete this audit (DONE)
2. ⏳ Design validator architecture
3. ⏳ Implement DOM structure parser
4. ⏳ Implement style application checker
5. ⏳ Implement class consistency checker
6. ⏳ Integrate with build system
7. ⏳ Fix identified issues in all three blocks
8. ⏳ Add validation to CI/CD pipeline

---

## Conclusion

The editor-frontend synchronization issues are **systemic and affect all three blocks**. The root cause is architectural: editor uses direct inline styles while frontend uses CSS variables. A comprehensive validation system is needed to:

1. Catch these mismatches during development
2. Enforce consistent styling patterns
3. Prevent future regressions
4. Guide developers to correct implementation

Without this validation system, manual reviews will continue to miss subtle DOM structure differences that cause rendering issues.
