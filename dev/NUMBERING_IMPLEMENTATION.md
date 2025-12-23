# TOC Hierarchical Numbering Implementation Guide

## Overview
This document outlines the implementation of **always-hierarchical** numbering for the TOC block, where each heading level (H1-H6) has its own customizable numbering style. The numbering cascades hierarchically (e.g., "II.2.a.1" for an H4 when H1=roman, H2=decimal, H3=alpha, H4=decimal), and setting any level to "none" hides that level and all deeper levels.

## Requirements
- **Numbering is ALWAYS hierarchical** (no simple/hierarchical mode toggle)
- **Default**: All heading levels use decimal numbering (1, 2, 3...)
- **Per-level customization**: Each heading level (H1-H6) has its own numbering style attribute
- **Numbering styles available**: none, decimal, decimal-leading-zero, upper-roman, lower-roman, upper-alpha, lower-alpha
- **Division character**: Dot (.) separates levels (e.g., II.2.a.1 for H4)
- **Cascade "none"**: If a level is set to "none", it and all deeper levels don't show numbers
- **UI**: Add numbering style as FIRST control in existing "Heading Styles" panel for each level
- **Dynamic updates**: Must work in editor and frontend, update when items reorder

---

## 1. Schema Changes
**File:** `schemas/toc.json`

### 1.1 Remove Global `numberingStyle` Attribute
**Location:** Lines 214-230

**Action:** Delete the entire `numberingStyle` attribute block:
```json
"numberingStyle": {
  "type": "string",
  "default": "none",
  "group": "blockOptions",
  "label": "Numbering Style",
  "description": "Style of numbering for TOC items",
  "themeable": false,
  "control": "SelectControl",
  "options": [
    "none",
    "decimal",
    "decimal-leading-zero",
    "roman",
    "alpha"
  ],
  "order": 13
}
```

### 1.2 Add Per-Level Numbering Attributes
**Location:** Insert in the `headingStyles` group, before existing h1-h6 color attributes

**Add these 6 new attributes:**

```json
"h1NumberingStyle": {
  "type": "string",
  "default": "decimal",
  "group": "headingStyles",
  "label": "H1 Numbering Style",
  "description": "Numbering style for H1 headings",
  "themeable": false,
  "control": "SelectControl",
  "options": [
    { "label": "None", "value": "none" },
    { "label": "Decimal (1, 2, 3)", "value": "decimal" },
    { "label": "Decimal Leading Zero (01, 02, 03)", "value": "decimal-leading-zero" },
    { "label": "Upper Roman (I, II, III)", "value": "upper-roman" },
    { "label": "Lower Roman (i, ii, iii)", "value": "lower-roman" },
    { "label": "Upper Alpha (A, B, C)", "value": "upper-alpha" },
    { "label": "Lower Alpha (a, b, c)", "value": "lower-alpha" }
  ],
  "order": 0.5
},
"h2NumberingStyle": {
  "type": "string",
  "default": "decimal",
  "group": "headingStyles",
  "label": "H2 Numbering Style",
  "description": "Numbering style for H2 headings",
  "themeable": false,
  "control": "SelectControl",
  "options": [
    { "label": "None", "value": "none" },
    { "label": "Decimal (1, 2, 3)", "value": "decimal" },
    { "label": "Decimal Leading Zero (01, 02, 03)", "value": "decimal-leading-zero" },
    { "label": "Upper Roman (I, II, III)", "value": "upper-roman" },
    { "label": "Lower Roman (i, ii, iii)", "value": "lower-roman" },
    { "label": "Upper Alpha (A, B, C)", "value": "upper-alpha" },
    { "label": "Lower Alpha (a, b, c)", "value": "lower-alpha" }
  ],
  "order": 6.5
},
"h3NumberingStyle": {
  "type": "string",
  "default": "decimal",
  "group": "headingStyles",
  "label": "H3 Numbering Style",
  "description": "Numbering style for H3 headings",
  "themeable": false,
  "control": "SelectControl",
  "options": [
    { "label": "None", "value": "none" },
    { "label": "Decimal (1, 2, 3)", "value": "decimal" },
    { "label": "Decimal Leading Zero (01, 02, 03)", "value": "decimal-leading-zero" },
    { "label": "Upper Roman (I, II, III)", "value": "upper-roman" },
    { "label": "Lower Roman (i, ii, iii)", "value": "lower-roman" },
    { "label": "Upper Alpha (A, B, C)", "value": "upper-alpha" },
    { "label": "Lower Alpha (a, b, c)", "value": "lower-alpha" }
  ],
  "order": 12.5
},
"h4NumberingStyle": {
  "type": "string",
  "default": "decimal",
  "group": "headingStyles",
  "label": "H4 Numbering Style",
  "description": "Numbering style for H4 headings",
  "themeable": false,
  "control": "SelectControl",
  "options": [
    { "label": "None", "value": "none" },
    { "label": "Decimal (1, 2, 3)", "value": "decimal" },
    { "label": "Decimal Leading Zero (01, 02, 03)", "value": "decimal-leading-zero" },
    { "label": "Upper Roman (I, II, III)", "value": "upper-roman" },
    { "label": "Lower Roman (i, ii, iii)", "value": "lower-roman" },
    { "label": "Upper Alpha (A, B, C)", "value": "upper-alpha" },
    { "label": "Lower Alpha (a, b, c)", "value": "lower-alpha" }
  ],
  "order": 18.5
},
"h5NumberingStyle": {
  "type": "string",
  "default": "decimal",
  "group": "headingStyles",
  "label": "H5 Numbering Style",
  "description": "Numbering style for H5 headings",
  "themeable": false,
  "control": "SelectControl",
  "options": [
    { "label": "None", "value": "none" },
    { "label": "Decimal (1, 2, 3)", "value": "decimal" },
    { "label": "Decimal Leading Zero (01, 02, 03)", "value": "decimal-leading-zero" },
    { "label": "Upper Roman (I, II, III)", "value": "upper-roman" },
    { "label": "Lower Roman (i, ii, iii)", "value": "lower-roman" },
    { "label": "Upper Alpha (A, B, C)", "value": "upper-alpha" },
    { "label": "Lower Alpha (a, b, c)", "value": "lower-alpha" }
  ],
  "order": 24.5
},
"h6NumberingStyle": {
  "type": "string",
  "default": "decimal",
  "group": "headingStyles",
  "label": "H6 Numbering Style",
  "description": "Numbering style for H6 headings",
  "themeable": false,
  "control": "SelectControl",
  "options": [
    { "label": "None", "value": "none" },
    { "label": "Decimal (1, 2, 3)", "value": "decimal" },
    { "label": "Decimal Leading Zero (01, 02, 03)", "value": "decimal-leading-zero" },
    { "label": "Upper Roman (I, II, III)", "value": "upper-roman" },
    { "label": "Lower Roman (i, ii, iii)", "value": "lower-roman" },
    { "label": "Upper Alpha (A, B, C)", "value": "upper-alpha" },
    { "label": "Lower Alpha (a, b, c)", "value": "lower-alpha" }
  ],
  "order": 30.5
}
```

**Note:** The `order` values (0.5, 6.5, 12.5, 18.5, 24.5, 30.5) place the numbering control FIRST in each heading level's controls.

### 1.3 Build Schema
After making schema changes, run:
```bash
npm run schema:build
```

This will automatically generate:
- `blocks/toc/src/toc-attributes.js`
- Various files in `shared/src/`

---

## 2. Edit Component Changes
**File:** `blocks/toc/src/edit.js`

### 2.1 Update List Class Name in Editor Preview
**Location:** Line 844 (approximately)

**Find:**
```javascript
<ul className={`toc-list toc-items-editor numbering-${attributes.numberingStyle}`}>
```

**Replace with:**
```javascript
<ul className="toc-list toc-items-editor toc-hierarchical-numbering">
```

### 2.2 Add CSS Variable Injection for Editor Preview
**Location:** Just before the `<ul>` element (around line 844)

**Add this code:**
```javascript
// Build CSS variables for hierarchical numbering in editor
const numberingStyles = {};
['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((level) => {
  const style = attributes[`${level}NumberingStyle`] || 'decimal';
  numberingStyles[`--toc-${level}-numbering`] = style;
});
```

**Then update the `<ul>` element:**
```javascript
<ul
  className="toc-list toc-items-editor toc-hierarchical-numbering"
  style={numberingStyles}
>
```

### 2.3 Update Reset Actions in Dropdown Menu
**Location:** Within the "Reset to theme defaults" MenuItem (around line 696-710)

**Add to the reset attributes object:**
```javascript
[`${selectedHeadingLevel}NumberingStyle`]: undefined,
```

**Note:** The numbering control will be auto-generated by SchemaPanels since it's now in the schema with a control type. No manual UI needed!

---

## 3. CSS Counter Implementation
**File:** `blocks/toc/src/style.scss`

### 3.1 Remove Old Numbering Styles
**Location:** Lines 124-189 (approximately)

**Delete all code for:**
- `.toc-list.numbering-decimal`
- `.toc-list.numbering-decimal-leading-zero`
- `.toc-list.numbering-roman`
- `.toc-list.numbering-alpha`
- `.toc-list.numbering-none`

### 3.2 Add Hierarchical Counter CSS
**Location:** Replace the deleted code (lines 124-189) with:

```scss
/* Hierarchical numbering using CSS counters */
.toc-list.toc-hierarchical-numbering {
  counter-reset: toc-h1 toc-h2 toc-h3 toc-h4 toc-h5 toc-h6;
  list-style-type: none;
  padding-left: 0;

  /* Reset nested lists to inherit parent's counter state */
  ul {
    counter-reset: inherit;
    list-style-type: none;
    padding-left: var(--toc-level-indent, 1.25rem);
  }
}

/* Counter increment and reset for each heading level */
.toc-list.toc-hierarchical-numbering .toc-item {
  &.toc-h1 {
    counter-increment: toc-h1;
    counter-reset: toc-h2 toc-h3 toc-h4 toc-h5 toc-h6;
  }
  &.toc-h2 {
    counter-increment: toc-h2;
    counter-reset: toc-h3 toc-h4 toc-h5 toc-h6;
  }
  &.toc-h3 {
    counter-increment: toc-h3;
    counter-reset: toc-h4 toc-h5 toc-h6;
  }
  &.toc-h4 {
    counter-increment: toc-h4;
    counter-reset: toc-h5 toc-h6;
  }
  &.toc-h5 {
    counter-increment: toc-h5;
    counter-reset: toc-h6;
  }
  &.toc-h6 {
    counter-increment: toc-h6;
  }
}

/* Display hierarchical numbering for each level */
.toc-list.toc-hierarchical-numbering {
  .toc-h1::before {
    content: counter(toc-h1, var(--toc-h1-numbering, decimal)) ". ";
    color: var(--toc-numbering-color, #0073aa);
    margin-right: 0.5em;
  }

  .toc-h2::before {
    content: counter(toc-h1, var(--toc-h1-numbering, decimal)) "."
             counter(toc-h2, var(--toc-h2-numbering, decimal)) ". ";
    color: var(--toc-numbering-color, #0073aa);
    margin-right: 0.5em;
  }

  .toc-h3::before {
    content: counter(toc-h1, var(--toc-h1-numbering, decimal)) "."
             counter(toc-h2, var(--toc-h2-numbering, decimal)) "."
             counter(toc-h3, var(--toc-h3-numbering, decimal)) ". ";
    color: var(--toc-numbering-color, #0073aa);
    margin-right: 0.5em;
  }

  .toc-h4::before {
    content: counter(toc-h1, var(--toc-h1-numbering, decimal)) "."
             counter(toc-h2, var(--toc-h2-numbering, decimal)) "."
             counter(toc-h3, var(--toc-h3-numbering, decimal)) "."
             counter(toc-h4, var(--toc-h4-numbering, decimal)) ". ";
    color: var(--toc-numbering-color, #0073aa);
    margin-right: 0.5em;
  }

  .toc-h5::before {
    content: counter(toc-h1, var(--toc-h1-numbering, decimal)) "."
             counter(toc-h2, var(--toc-h2-numbering, decimal)) "."
             counter(toc-h3, var(--toc-h3-numbering, decimal)) "."
             counter(toc-h4, var(--toc-h4-numbering, decimal)) "."
             counter(toc-h5, var(--toc-h5-numbering, decimal)) ". ";
    color: var(--toc-numbering-color, #0073aa);
    margin-right: 0.5em;
  }

  .toc-h6::before {
    content: counter(toc-h1, var(--toc-h1-numbering, decimal)) "."
             counter(toc-h2, var(--toc-h2-numbering, decimal)) "."
             counter(toc-h3, var(--toc-h3-numbering, decimal)) "."
             counter(toc-h4, var(--toc-h4-numbering, decimal)) "."
             counter(toc-h5, var(--toc-h5-numbering, decimal)) "."
             counter(toc-h6, var(--toc-h6-numbering, decimal)) ". ";
    color: var(--toc-numbering-color, #0073aa);
    margin-right: 0.5em;
  }

  /* Hide numbering when set to 'none' - cascade effect */
  /* If H1 is none, hide all levels */
  &[data-h1-numbering="none"] .toc-h1::before,
  &[data-h1-numbering="none"] .toc-h2::before,
  &[data-h1-numbering="none"] .toc-h3::before,
  &[data-h1-numbering="none"] .toc-h4::before,
  &[data-h1-numbering="none"] .toc-h5::before,
  &[data-h1-numbering="none"] .toc-h6::before {
    content: "";
    margin-right: 0;
  }

  /* If H2 is none, hide H2-H6 */
  &[data-h2-numbering="none"] .toc-h2::before,
  &[data-h2-numbering="none"] .toc-h3::before,
  &[data-h2-numbering="none"] .toc-h4::before,
  &[data-h2-numbering="none"] .toc-h5::before,
  &[data-h2-numbering="none"] .toc-h6::before {
    content: "";
    margin-right: 0;
  }

  /* If H3 is none, hide H3-H6 */
  &[data-h3-numbering="none"] .toc-h3::before,
  &[data-h3-numbering="none"] .toc-h4::before,
  &[data-h3-numbering="none"] .toc-h5::before,
  &[data-h3-numbering="none"] .toc-h6::before {
    content: "";
    margin-right: 0;
  }

  /* If H4 is none, hide H4-H6 */
  &[data-h4-numbering="none"] .toc-h4::before,
  &[data-h4-numbering="none"] .toc-h5::before,
  &[data-h4-numbering="none"] .toc-h6::before {
    content: "";
    margin-right: 0;
  }

  /* If H5 is none, hide H5-H6 */
  &[data-h5-numbering="none"] .toc-h5::before,
  &[data-h5-numbering="none"] .toc-h6::before {
    content: "";
    margin-right: 0;
  }

  /* If H6 is none, hide H6 */
  &[data-h6-numbering="none"] .toc-h6::before {
    content: "";
    margin-right: 0;
  }
}
```

**Key Points:**
- CSS counters automatically update when DOM order changes (perfect for editor!)
- Each heading level increments its own counter
- Each heading resets all deeper counters
- The `::before` pseudo-element builds the full hierarchical number
- CSS variables control the numbering style per level
- Cascade "none" logic hides numbering for level and all children

---

## 4. Editor Styles
**File:** `blocks/toc/src/editor.scss`

### 4.1 Update Editor Numbering Classes
**Location:** Lines 137-146 (approximately)

**Find:**
```scss
.toc-items-editor {
  list-style-position: inside;
  padding-left: var(--toc-list-padding-left, 1.5rem);
  margin: 0;

  &.numbering-none {
    padding-left: 0;
  }
}
```

**Replace with:**
```scss
.toc-items-editor {
  list-style-position: inside;
  padding-left: 0; // Counters don't need padding
  margin: 0;

  &.toc-hierarchical-numbering {
    counter-reset: toc-h1 toc-h2 toc-h3 toc-h4 toc-h5 toc-h6;
  }
}
```

**Note:** The hierarchical numbering CSS from `style.scss` is automatically imported into `editor.scss` (line 12), so counters work in the editor.

---

## 5. Save Component Changes
**File:** `blocks/toc/src/save.js`

### 5.1 Remove Old Numbering Style from Destructuring
**Location:** Lines 36-62 (approximately)

**Find and remove:**
```javascript
numberingStyle,
```

### 5.2 Remove Old Numbering from Data Attributes
**Location:** Lines 82-107 (approximately)

**Find and remove:**
```javascript
'data-numbering-style': numberingStyle,
```

### 5.3 Add Per-Level Numbering to Data Attributes
**Location:** Insert after line 102 (within dataAttributes object)

**Add:**
```javascript
'data-h1-numbering': attributes.h1NumberingStyle || 'decimal',
'data-h2-numbering': attributes.h2NumberingStyle || 'decimal',
'data-h3-numbering': attributes.h3NumberingStyle || 'decimal',
'data-h4-numbering': attributes.h4NumberingStyle || 'decimal',
'data-h5-numbering': attributes.h5NumberingStyle || 'decimal',
'data-h6-numbering': attributes.h6NumberingStyle || 'decimal',
```

### 5.4 Add CSS Variables to Inline Styles
**Location:** After line 177 (within customizationStyles building section)

**Add:**
```javascript
// Add numbering style CSS variables
['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((level) => {
  const numberingStyle = attributes[`${level}NumberingStyle`];
  if (numberingStyle !== undefined && numberingStyle !== null) {
    customizationStyles[`--toc-${level}-numbering`] = numberingStyle;
  }
});
```

### 5.5 Update List Class Name
**Location:** Line 301 (approximately)

**Find:**
```javascript
className={`toc-list numbering-${numberingStyle}`}
```

**Replace with:**
```javascript
className="toc-list toc-hierarchical-numbering"
```

---

## 6. Frontend JavaScript Changes
**File:** `blocks/toc/src/frontend.js`

### 6.1 Update Config Parsing
**Location:** Lines 40-64 (within initializeTOCBlocks)

**Find:**
```javascript
numberingStyle: block.getAttribute('data-numbering-style') || 'none',
```

**Replace with:**
```javascript
h1NumberingStyle: block.getAttribute('data-h1-numbering') || 'decimal',
h2NumberingStyle: block.getAttribute('data-h2-numbering') || 'decimal',
h3NumberingStyle: block.getAttribute('data-h3-numbering') || 'decimal',
h4NumberingStyle: block.getAttribute('data-h4-numbering') || 'decimal',
h5NumberingStyle: block.getAttribute('data-h5-numbering') || 'decimal',
h6NumberingStyle: block.getAttribute('data-h6-numbering') || 'decimal',
```

### 6.2 Update List Rendering
**Location:** Function renderTOCList (lines 369-442)

**After line 371 (after clearing innerHTML), add:**
```javascript
// Set CSS variables for hierarchical numbering
listContainer.style.setProperty('--toc-h1-numbering', config.h1NumberingStyle || 'decimal');
listContainer.style.setProperty('--toc-h2-numbering', config.h2NumberingStyle || 'decimal');
listContainer.style.setProperty('--toc-h3-numbering', config.h3NumberingStyle || 'decimal');
listContainer.style.setProperty('--toc-h4-numbering', config.h4NumberingStyle || 'decimal');
listContainer.style.setProperty('--toc-h5-numbering', config.h5NumberingStyle || 'decimal');
listContainer.style.setProperty('--toc-h6-numbering', config.h6NumberingStyle || 'decimal');

// Add hierarchical numbering class
listContainer.classList.add('toc-hierarchical-numbering');

// Add data attributes for cascade "none" logic
listContainer.setAttribute('data-h1-numbering', config.h1NumberingStyle || 'decimal');
listContainer.setAttribute('data-h2-numbering', config.h2NumberingStyle || 'decimal');
listContainer.setAttribute('data-h3-numbering', config.h3NumberingStyle || 'decimal');
listContainer.setAttribute('data-h4-numbering', config.h4NumberingStyle || 'decimal');
listContainer.setAttribute('data-h5-numbering', config.h5NumberingStyle || 'decimal');
listContainer.setAttribute('data-h6-numbering', config.h6NumberingStyle || 'decimal');
```

**Note:** The existing code that creates `<li>` elements with `toc-h{level}` classes will work perfectly with the CSS counter implementation.

---

## 7. Build and Test

### 7.1 Build the Project
```bash
npm run build
```

This will:
1. Regenerate attributes from schema
2. Compile JavaScript (Webpack)
3. Compile SCSS to CSS
4. Run validation checks

### 7.2 Testing Checklist

#### Schema Validation
- [ ] Run `npm run schema:build`
- [ ] Verify `toc-attributes.js` contains h1-h6NumberingStyle attributes
- [ ] Verify old `numberingStyle` is removed
- [ ] No build errors

#### Editor Preview
- [ ] Create new TOC block
- [ ] Open "Heading Styles" panel
- [ ] Verify numbering control appears FIRST for each heading level
- [ ] Change H2 to "upper-roman", H3 to "lower-alpha"
- [ ] Scan for headings
- [ ] Verify preview shows "I.a" style numbering
- [ ] Set H2 to "none"
- [ ] Verify all numbering disappears

#### Frontend Rendering
- [ ] Save page with TOC
- [ ] View on frontend
- [ ] Verify numbering matches editor preview
- [ ] Test combinations: all decimal, mixed styles, etc.
- [ ] Test "none" cascade (H3=none hides H3-H6)

#### Dynamic Updates
- [ ] Add/remove headings while editing
- [ ] Reorder TOC items using drag/drop
- [ ] Verify numbering updates correctly
- [ ] Verify no JavaScript errors in console

#### Cascade "None" Logic
- [ ] Set H3 numbering to "none"
- [ ] Verify H3, H4, H5, H6 all disappear from numbering
- [ ] Set H3 back to "decimal"
- [ ] Verify numbering reappears for all levels

---

## 8. Example Numbering Output

### Example 1: All Decimal (Default)
```
1. Introduction
   1.1. Background
   1.2. Objectives
2. Methods
   2.1. Data Collection
      2.1.1. Survey Design
      2.1.2. Sampling
   2.2. Analysis
```

### Example 2: Mixed Styles (H1=Roman, H2=Decimal, H3=Alpha)
```
I. Introduction
   I.1. Background
      I.1.a. History
      I.1.b. Context
   I.2. Objectives
II. Methods
   II.1. Data Collection
      II.1.a. Survey Design
      II.1.b. Sampling
```

### Example 3: H2 Set to None
```
(All numbering hidden because H2 is none)
Introduction
Background
Objectives
Methods
```


---

## 10. Critical Files Summary

| File | Changes Required |
|------|-----------------|
| `schemas/toc.json` | Remove global `numberingStyle`, add 6 new h1-h6NumberingStyle attributes |
| `blocks/toc/src/edit.js` | Update list class, add CSS variables injection |
| `blocks/toc/src/style.scss` | Replace old numbering with CSS counters |
| `blocks/toc/src/editor.scss` | Update editor numbering classes |
| `blocks/toc/src/save.js` | Update data attributes and CSS variables |
| `blocks/toc/src/frontend.js` | Update config parsing and list rendering |

---

## 11. CSS Counter Technical Details

### How CSS Counters Work
```css
/* Initialize all counters */
counter-reset: toc-h1 toc-h2 toc-h3;

/* Increment H2 counter, reset H3 */
.toc-h2 {
  counter-increment: toc-h2;
  counter-reset: toc-h3;
}

/* Display hierarchical number */
.toc-h2::before {
  content: counter(toc-h1, upper-roman) "." counter(toc-h2, decimal) ". ";
}
```

### Benefits
- ✅ Automatically update when DOM order changes
- ✅ No JavaScript needed for numbering calculation
- ✅ Works in editor and frontend identically
- ✅ Respects CSS variable customization
- ✅ Browser-native performance

### Limitations
- ❌ Cannot skip levels in numbering (e.g., H2 → H4 without H3)
- ❌ Requires proper heading hierarchy in content
- ⚠️ "none" cascade is CSS-only (affects display, not counter state)

---

## Questions or Issues?

If you encounter any problems during implementation:
1. Check browser console for JavaScript errors
2. Verify schema build completed successfully
3. Inspect generated `toc-attributes.js` file
4. Check CSS is compiled correctly
5. Test in both editor and frontend
6. Verify all 6 files were modified correctly

Good luck with the implementation! 🎉
