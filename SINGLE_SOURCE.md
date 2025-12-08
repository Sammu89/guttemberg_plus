# Single Source of Truth: Schema-First Architecture Implementation Guide

**Version:** 1.0.0
**Last Updated:** 2025-12-07
**Status:** Implementation Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Problems](#current-problems)
3. [Proposed Architecture](#proposed-architecture)
4. [File Structure](#file-structure)
5. [Schema Definitions](#schema-definitions)
6. [Implementation Phases](#implementation-phases)
7. [Multi-Agent Orchestration](#multi-agent-orchestration)
8. [Validation Requirements](#validation-requirements)
9. [Code Examples](#code-examples)
10. [Testing & Verification](#testing--verification)
11. [Rollback Plan](#rollback-plan)

---

## Executive Summary

### The Goal

Transform the current partially schema-driven system into a **fully validated, dual-schema architecture** where:

1. **Structure schemas** (`*-structure.json`) define HTML elements, class names, and hierarchy
2. **Attribute schemas** (`*.json`) define styling properties and theming
3. **Build-time validation** ensures these schemas stay synchronized
4. **Zero selector mismatches** are possible due to automated validation

### Why This Matters

**Current State:**
- CSS selectors defined in schemas can be wrong (`.accordion-header` vs `.accordion-title`)
- No validation ensures selectors match actual HTML
- Editor works (inline styles) but frontend breaks (CSS selectors)
- Hours wasted debugging selector mismatches

**Future State:**
- HTML structure is documented in dedicated schema files
- Attributes reference elements by ID, not CSS selectors
- Build fails immediately if references are invalid
- CSS selectors are auto-generated from structure
- Impossible to have mismatches

### Success Criteria

✅ Build process validates all schema cross-references
✅ CSS selectors auto-generated from structure files
✅ Editor and frontend render identically
✅ Adding new attributes requires updating both schemas (enforced)
✅ Documentation is built into structure files

---

## Current Problems

### Problem 1: Selector Mismatches

**Example:**
```json
// schemas/accordion.json
{
  "titleColor": {
    "cssSelector": ".accordion-header"  // ❌ WRONG
  }
}
```

```jsx
// blocks/accordion/src/save.js
<button className="accordion-title">  // ✅ ACTUAL HTML
```

**Result:** CSS never applies on frontend

### Problem 2: No Validation

**Current build:**
```
schemas/accordion.json → _theme-generated.scss → accordion.css
```

**Missing:**
- Does `.accordion-header` exist in the HTML?
- Do edit.js and save.js render the same elements?
- Are all attribute targets valid?

### Problem 3: Three Sources of Truth

1. **Schema** defines `cssSelector: ".accordion-header"`
2. **edit.js** renders `<button className="accordion-title">`
3. **save.js** renders `<button className="accordion-title">`

No mechanism ensures they match!

### Problem 4: Editor vs Frontend Divergence

**Editor (edit.js):**
```javascript
const styles = {
  title: {
    color: '#333',          // ✅ Works (inline style)
    fontSize: '18px'
  }
};
<button style={styles.title}>
```

**Frontend (save.js + CSS):**
```javascript
// Outputs CSS variables to wrapper
style={{ '--accordion-title-color': '#333' }}

// CSS must apply them
.accordion-header {  // ❌ Wrong selector, never applies!
  color: var(--accordion-title-color);
}
```

---

## Proposed Architecture

### Dual-Schema System

#### **Structure Schema** (`accordion-structure.json`)
Defines **WHAT elements exist** and **HOW they're arranged**

```
Purpose: HTML element definitions
Contains:
  - Element IDs (titleWrapper, title, content, etc.)
  - Tag names (div, button, span)
  - Class names (accordion-title, accordion-content)
  - Parent-child hierarchy
  - ARIA attributes
  - Conditional rendering rules
  - Data attributes
```

#### **Attribute Schema** (`accordion.json`)
Defines **WHAT can be customized** and **HOW styles apply**

```
Purpose: Theming and customization
Contains:
  - Attribute definitions
  - Default values
  - Control types (ColorPicker, RangeControl)
  - Groups (headerColors, typography)
  - Theme applicability (themeable: true/false)
  - Element references (appliesTo: "title")
  - CSS property mappings
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      BUILD TIME                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  accordion-structure.json          accordion.json           │
│  ├── elements                      ├── attributes           │
│  │   ├── title                     │   ├── titleColor       │
│  │   │   ├── tag: "button"         │   │   ├── appliesTo: "title"
│  │   │   ├── className: "accordion-title"                   │
│  │   │   └── children: [...]       │   │   ├── cssProperty: "color"
│  │   └── item                      │   │   └── cssVar: "title-color"
│  │       ├── tag: "div"            │   └── borderColor      │
│  │       ├── className: "accordion-item"                    │
│  │           └── appliesStyles: [...] └── appliesTo: "item" │
│              └── children: [...]                            │
│                                                              │
│                          ↓                                   │
│              ┌───────────────────────┐                      │
│              │  VALIDATION LAYER     │                      │
│              ├───────────────────────┤                      │
│              │ 1. Element IDs exist? │                      │
│              │ 2. Attributes valid?  │                      │
│              │ 3. Children valid?    │                      │
│              │ 4. Selectors match?   │                      │
│              └───────────────────────┘                      │
│                          ↓                                   │
│                       PASSES                                 │
│                          ↓                                   │
│              ┌───────────────────────┐                      │
│              │  CSS GENERATOR        │                      │
│              ├───────────────────────┤                      │
│              │ For each element:     │                      │
│              │   Get className       │                      │
│              │   Get appliesStyles   │                      │
│              │   Generate CSS rules  │                      │
│              └───────────────────────┘                      │
│                          ↓                                   │
│              _theme-generated.scss                          │
│              .accordion-title { ... }   ✅ CORRECT!         │
│              .accordion-item { ... }    ✅ CORRECT!         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      RUNTIME                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  EDITOR (edit.js)              FRONTEND (save.js)           │
│  ├── Reads accordion.json      ├── Reads accordion.json    │
│  ├── Builds inline styles      ├── Outputs CSS variables   │
│  └── Renders JSX               └── Renders JSX             │
│      <button className=            <button className=       │
│        "accordion-title"             "accordion-title"      │
│        style={...}>                  style={{--vars}}>      │
│                                                              │
│      ✅ IDENTICAL HTML!                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

### Current Files (Keep)
```
schemas/
├── accordion.json       ← Attribute definitions (MODIFIED)
├── tabs.json           ← Attribute definitions (MODIFIED)
└── toc.json            ← Attribute definitions (MODIFIED)

build-tools/
├── schema-compiler.js  ← Schema to code generator (MODIFIED)
└── schema-validator.js ← JSON schema validation (KEEP)
```

### New Files (Create)
```
schemas/
├── accordion-structure.json  ← NEW: HTML structure definition
├── tabs-structure.json       ← NEW: HTML structure definition
└── toc-structure.json        ← NEW: HTML structure definition

build-tools/
├── validate-schema-structure.js  ← NEW: Cross-schema validation
├── generate-css-from-schema.js   ← NEW: CSS generator using both schemas
└── extract-html-classes.js       ← NEW: Verify HTML matches schema

docs/
└── SCHEMA_GUIDE.md              ← NEW: Developer documentation
```

---

## Schema Definitions

### Structure Schema Specification

**File:** `schemas/{block}-structure.json`

```typescript
interface StructureSchema {
  $schema: string;
  blockType: string;        // "accordion", "tabs", "toc"
  version: string;          // "1.0.0"
  description: string;      // Human-readable description

  elements: {
    [elementId: string]: {
      id: string;           // Same as key (for clarity)
      tag: string;          // HTML tag: "div", "button", "span"
      className: string;    // CSS class(es): "accordion-title" or "class1 class2"
      description: string;  // What this element does
      children?: string[];  // Array of child element IDs

      // Optional attributes
      attributes?: {
        [attrName: string]: string | { [key: string]: any }
      };

      // Conditional rendering
      conditionalRender?: string;  // "{showIcon}"

      // Conditional classes
      conditionalClass?: {
        [className: string]: string;  // "is-open": "{initiallyOpen}"
      };

      // Conditional attributes
      conditionalAttribute?: {
        [attrName: string]: string;  // "hidden": "{!initiallyOpen}"
      };

      // Conditional tag wrapping
      conditionalTag?: {
        when: string;         // "headingLevel !== 'none'"
        wrapWith: string;     // "{headingLevel}"
        wrapClassName: string; // "accordion-heading"
      };

      // Render variant (different element based on condition)
      renderVariant?: {
        condition: string;    // "iconTypeClosed.startsWith('http')"
        ifTrue: {
          tag: string;
          className: string;
          attributes?: object;
        };
      };

      // ARIA attributes (for accessibility)
      aria?: {
        [ariaAttr: string]: string;  // "role": "button", "expanded": "{!initiallyOpen}"
      };

      // Content type (for WordPress blocks)
      contentType?: "RichText" | "InnerBlocks" | "static" | "dynamic";
      source?: string;        // Attribute source: "{title}"

      // Which style attributes apply to this element
      appliesStyles: string[];  // ["titleColor", "titleFontSize", ...]
    };
  };

  // Visual tree representation
  hierarchy: {
    root: string;           // Root element ID
    tree: object;          // Nested object showing parent-child relationships
  };
}
```

### Attribute Schema Updates

**File:** `schemas/{block}.json`

**ADD these fields to each attribute:**
```json
{
  "attributes": {
    "titleColor": {
      // ... existing fields ...

      // NEW REQUIRED FIELD:
      "appliesTo": "title",  // ← Element ID from structure schema

      // DEPRECATED (remove after migration):
      // "cssSelector": ".accordion-title"  // ← DELETE THIS

      // KEEP THESE:
      "cssVar": "title-color",
      "cssProperty": "color"
    }
  }
}
```

---

## Implementation Phases

### Phase 1: Create Structure Schemas (AGENT 1)

**Deliverable:** Three structure schema files

**Files to create:**
1. `schemas/accordion-structure.json`
2. `schemas/tabs-structure.json`
3. `schemas/toc-structure.json`

**Method:**
1. Read current `save.js` file for each block
2. Document every HTML element rendered
3. Extract class names, tags, children, ARIA attributes
4. Create structure schema following specification above
5. Include all conditional rendering logic

**Validation:**
- Every element in `save.js` must be in structure schema
- Every element must have valid `appliesStyles` array
- Hierarchy must match actual parent-child relationships

**Acceptance Criteria:**
- ✅ All HTML elements documented
- ✅ Class names match save.js exactly
- ✅ Children arrays are complete
- ✅ ARIA attributes included
- ✅ Conditional logic captured

---

### Phase 2: Update Attribute Schemas (AGENT 2)

**Deliverable:** Three updated attribute schemas

**Files to modify:**
1. `schemas/accordion.json`
2. `schemas/tabs.json`
3. `schemas/toc.json`

**Changes:**
1. Add `"appliesTo": "elementId"` to every themeable attribute
2. Remove `"cssSelector"` field (deprecated)
3. Ensure `cssVar` and `cssProperty` are present
4. Verify element IDs exist in corresponding structure schema

**Method:**
1. For each attribute with `themeable: true`:
   - Identify which element it styles (from old `cssSelector`)
   - Find that element's ID in structure schema
   - Add `"appliesTo": "elementId"`
   - Remove `"cssSelector"` field

**Example transformation:**
```json
// BEFORE:
{
  "titleColor": {
    "themeable": true,
    "cssSelector": ".accordion-title",  // ← REMOVE
    "cssVar": "title-color",
    "cssProperty": "color"
  }
}

// AFTER:
{
  "titleColor": {
    "themeable": true,
    "appliesTo": "title",  // ← ADD (element ID from structure)
    "cssVar": "title-color",
    "cssProperty": "color"
  }
}
```

**Validation:**
- Every `appliesTo` references a valid element ID from structure
- No `cssSelector` fields remain
- All themeable attributes have `appliesTo`

**Acceptance Criteria:**
- ✅ All attributes have `appliesTo` field
- ✅ All `cssSelector` fields removed
- ✅ Element ID references are valid
- ✅ No orphaned attributes (referencing non-existent elements)

---

### Phase 3: Build Validation Layer (AGENT 3)

**Deliverable:** Cross-schema validation script

**File to create:**
`build-tools/validate-schema-structure.js`

**Requirements:**

1. **Load both schemas:**
   - Structure schema: `schemas/{block}-structure.json`
   - Attribute schema: `schemas/{block}.json`

2. **Validate structure schema:**
   - All children references exist
   - No circular dependencies
   - Root element is defined
   - Class names are valid CSS identifiers

3. **Validate attribute schema:**
   - All `appliesTo` references exist in structure
   - All themeable attributes have `appliesTo`
   - All `appliesTo` elements have matching `appliesStyles` entry

4. **Cross-validate:**
   - Every element's `appliesStyles` array contains valid attribute names
   - Every attribute's `appliesTo` references an existing element
   - Bidirectional validation (both ways)

5. **Report errors with context:**
   ```
   ❌ Attribute "titleColor" references element "title-button"
      but structure schema only has: ["title", "titleWrapper", ...]

   ❌ Element "icon" lists "iconColor" in appliesStyles
      but attribute schema doesn't define "iconColor"
   ```

**Error Handling:**
- Exit with code 1 if any validation fails
- Print all errors before exiting (don't stop at first error)
- Provide helpful suggestions for fixes

**Acceptance Criteria:**
- ✅ Validates all three blocks (accordion, tabs, toc)
- ✅ Catches missing element references
- ✅ Catches missing attribute references
- ✅ Provides clear error messages
- ✅ Exits with non-zero code on failure

---

### Phase 4: Update CSS Generator (AGENT 4)

**Deliverable:** Updated CSS generation using both schemas

**File to modify:**
`build-tools/schema-compiler.js` (CSS generation section)

**OR create new file:**
`build-tools/generate-css-from-schema.js`

**Algorithm:**

```javascript
function generateThemeCSS(blockType) {
  // 1. Load both schemas
  const structure = loadStructure(blockType);
  const attributes = loadAttributes(blockType);

  // 2. Group attributes by target element
  const byElement = new Map();

  Object.entries(attributes.attributes).forEach(([name, attr]) => {
    if (attr.themeable && attr.appliesTo) {
      const elementId = attr.appliesTo;

      if (!byElement.has(elementId)) {
        byElement.set(elementId, []);
      }

      byElement.get(elementId).push({ name, attr });
    }
  });

  // 3. Generate CSS for each element
  const cssOutput = [];

  byElement.forEach((attrs, elementId) => {
    const element = structure.elements[elementId];

    // Get primary class name (first one if multiple)
    const className = element.className.split(' ')[0];

    cssOutput.push(`\n.${className} {`);

    // Regular styles
    const regularAttrs = attrs.filter(a => !a.name.includes('hover'));
    regularAttrs.forEach(({ name, attr }) => {
      cssOutput.push(`  /* ${attr.description} */`);
      cssOutput.push(
        `  ${attr.cssProperty}: var(--${blockType}-${attr.cssVar}, ${attr.default});`
      );
    });

    // Hover styles (if any)
    const hoverAttrs = attrs.filter(a => a.name.includes('hover'));
    if (hoverAttrs.length > 0) {
      cssOutput.push(`\n  &:hover {`);
      hoverAttrs.forEach(({ name, attr }) => {
        cssOutput.push(`    /* ${attr.description} */`);
        cssOutput.push(
          `      ${attr.cssProperty}: var(--${blockType}-${attr.cssVar}, ${attr.default});`
        );
      });
      cssOutput.push(`  }`);
    }

    cssOutput.push(`}\n`);
  });

  return cssOutput.join('\n');
}
```

**Output Example:**
```scss
.accordion-title {
  /* Text color for the accordion title */
  color: var(--accordion-title-color, #333333);
  /* Background color for the accordion title */
  background-color: var(--accordion-title-bg, #f5f5f5);
  /* Font size for the title in pixels */
  font-size: var(--accordion-title-font-size, 18px);

  &:hover {
    /* Text color when hovering over title */
    color: var(--accordion-title-hover-color, #000000);
    /* Background color when hovering over title */
    background-color: var(--accordion-title-hover-bg, #e8e8e8);
  }
}

.accordion-item {
  /* Color of the accordion wrapper border */
  border-color: var(--accordion-border-color, #dddddd);
  /* Thickness of the accordion wrapper border in pixels */
  border-width: var(--accordion-border-width, 1px);
  /* Style of the accordion wrapper border */
  border-style: var(--accordion-border-style, solid);
  /* Corner radius of the accordion wrapper */
  border-radius: var(--accordion-border-radius, 4px 4px 4px 4px);
  /* CSS box-shadow for the accordion wrapper */
  box-shadow: var(--accordion-border-shadow, none);

  &:hover {
    /* CSS box-shadow for the accordion wrapper on hover */
    box-shadow: var(--accordion-border-shadow-hover, none);
  }
}
```

**Acceptance Criteria:**
- ✅ Generates CSS using element class names from structure
- ✅ Groups attributes by element correctly
- ✅ Handles hover states properly
- ✅ Includes comments from attribute descriptions
- ✅ CSS selectors match actual HTML class names

---

### Phase 5: Update Build Scripts (AGENT 5)

**Deliverable:** Updated package.json scripts

**File to modify:**
`package.json`

**Changes:**
```json
{
  "scripts": {
    // EXISTING (keep):
    "schema:validate": "node build-tools/schema-validator.js",

    // NEW (add):
    "schema:validate-structure": "node build-tools/validate-schema-structure.js",

    // UPDATED (modify):
    "schema:build": "npm run schema:validate && npm run schema:validate-structure && node build-tools/schema-compiler.js",

    // EXISTING (keep):
    "validate:schema-usage": "node build-tools/validate-schema-usage.js",
    "prebuild": "npm run schema:build && npm run validate:schema-usage",
    "build": "wp-scripts build && npm run postbuild",
    "postbuild": "node build-tools/rename-css-files.js",
    "start": "wp-scripts start"
  }
}
```

**New validation order:**
```
npm run build
  ↓
npm run prebuild
  ↓
npm run schema:build
  ↓
  1. npm run schema:validate          (validates JSON syntax)
  2. npm run schema:validate-structure (validates cross-references) ← NEW
  3. node build-tools/schema-compiler.js (generates files)
  ↓
npm run validate:schema-usage
  ↓
wp-scripts build
  ↓
npm run postbuild
```

**Acceptance Criteria:**
- ✅ Build fails if structure validation fails
- ✅ All validations run before code generation
- ✅ Clear error messages on validation failure
- ✅ Existing scripts still work

---

### Phase 6: Create Documentation (AGENT 6)

**Deliverable:** Developer documentation

**File to create:**
`docs/SCHEMA_GUIDE.md`

**Content:**

1. **Introduction**
   - What are structure schemas?
   - What are attribute schemas?
   - Why two files?

2. **Structure Schema Reference**
   - Element definition format
   - Field descriptions
   - Examples for each field type
   - Common patterns

3. **Attribute Schema Updates**
   - New `appliesTo` field
   - Deprecated `cssSelector` field
   - How to reference elements

4. **Adding New Elements**
   - Step 1: Define in structure schema
   - Step 2: Add to HTML (edit.js/save.js)
   - Step 3: Run validation
   - Step 4: Build

5. **Adding New Attributes**
   - Step 1: Define in attribute schema
   - Step 2: Add `appliesTo` reference
   - Step 3: Update element's `appliesStyles` array
   - Step 4: Run validation
   - Step 5: Build

6. **Troubleshooting**
   - Common validation errors
   - How to fix element reference errors
   - How to fix attribute reference errors

7. **Migration from Old System**
   - What changed?
   - How to update existing schemas
   - Breaking changes

**Acceptance Criteria:**
- ✅ Complete reference for both schema types
- ✅ Step-by-step guides for common tasks
- ✅ Examples from actual accordion/tabs/toc blocks
- ✅ Troubleshooting section with real errors

---

## Multi-Agent Orchestration

### Agent Assignments

Each agent works independently on their phase:

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                              │
│  - Monitors all agents                                       │
│  - Ensures dependencies are met                              │
│  - Merges completed work                                     │
│  - Runs final integration tests                              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ AGENT 1 │          │ AGENT 2 │          │ AGENT 3 │
   ├─────────┤          ├─────────┤          ├─────────┤
   │ Create  │          │ Update  │          │ Build   │
   │Structure│  ──────▶ │Attribute│  ──────▶ │Validator│
   │ Schemas │          │ Schemas │          │         │
   └─────────┘          └─────────┘          └─────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ AGENT 4 │          │ AGENT 5 │          │ AGENT 6 │
   ├─────────┤          ├─────────┤          ├─────────┤
   │ Update  │          │ Update  │          │ Create  │
   │   CSS   │  ──────▶ │  Build  │          │  Docs   │
   │Generator│          │ Scripts │          │         │
   └─────────┘          └─────────┘          └─────────┘
```

### Dependencies

**Phase 1 (AGENT 1) → Must complete first**
- Creates structure schemas
- No dependencies

**Phase 2 (AGENT 2) → Depends on Phase 1**
- Needs structure schemas to exist
- References element IDs from structure

**Phase 3 (AGENT 3) → Depends on Phase 1 & 2**
- Validates both schemas exist
- Cross-validates references

**Phase 4 (AGENT 4) → Depends on Phase 1 & 2**
- Reads from both schemas
- Generates CSS

**Phase 5 (AGENT 5) → Depends on Phase 3**
- Integrates validation into build
- No file dependencies, just process

**Phase 6 (AGENT 6) → Can run in parallel**
- Documents the system
- No code dependencies

### Parallel Execution Plan

```
TIME    AGENT 1    AGENT 2    AGENT 3    AGENT 4    AGENT 5    AGENT 6
─────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────
  0  │ START    │          │          │          │          │ START
     │ Create   │          │          │          │          │ Write
  1h │ structs  │          │          │          │          │ docs
     │          │          │          │          │          │
  2h │ DONE ────┼─▶ START  │          │          │          │
     │          │  Update  │          │          │          │
  3h │          │  attrs   │          │          │          │
     │          │          │          │          │          │
  4h │          │ DONE ────┼─▶ START  │          │          │
     │          │          │  Build   │          │          │
  5h │          │          │  validtr │          │          │
     │          │          │          │          │          │
  6h │          │          │ DONE ────┼─▶ START  │          │
     │          │          │          │  Update  │          │
  7h │          │          │          │  CSS gen │          │
     │          │          │          │          │          │
  8h │          │          │          │ DONE ────┼─▶ START  │
     │          │          │          │          │  Update  │
  9h │          │          │          │          │  build   │
     │          │          │          │          │          │
 10h │          │          │          │          │ DONE     │ DONE
─────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────

TOTAL TIME: ~10 hours (with parallelization)
WITHOUT PARALLEL: ~24 hours
```

### Orchestrator Responsibilities

1. **Initialize:**
   - Create feature branch
   - Backup current schemas
   - Set up agent workspaces

2. **Monitor:**
   - Track agent progress
   - Detect blocking issues
   - Ensure agents don't conflict

3. **Integrate:**
   - Merge Agent 1 → Agent 2 can start
   - Merge Agent 2 → Agent 3 & 4 can start
   - Merge Agent 3 → Agent 5 can start
   - Merge all → Run integration tests

4. **Verify:**
   - Run full build
   - Test all three blocks
   - Verify CSS output
   - Check documentation

5. **Deploy:**
   - Commit all changes
   - Update CHANGELOG
   - Tag version
   - Merge to main

---

## Validation Requirements

### Pre-Build Validation Checklist

**Before running `npm run build`:**

- [ ] Structure schemas exist for all blocks
- [ ] Attribute schemas updated with `appliesTo`
- [ ] No `cssSelector` fields remain
- [ ] Validator script exists
- [ ] Build scripts updated

**During build:**

- [ ] JSON syntax validation passes
- [ ] Structure cross-references validation passes
- [ ] Schema usage validation passes
- [ ] CSS generation completes
- [ ] Webpack compilation succeeds

**After build:**

- [ ] _theme-generated.scss has correct selectors
- [ ] Compiled CSS matches expected output
- [ ] No build warnings
- [ ] No build errors

### Runtime Validation Checklist

**In WordPress editor:**

- [ ] Accordion block renders correctly
- [ ] Tabs block renders correctly
- [ ] TOC block renders correctly
- [ ] All styles apply in editor
- [ ] Theme selector works
- [ ] Customization works

**On frontend:**

- [ ] Accordion block displays correctly
- [ ] Tabs block displays correctly
- [ ] TOC block displays correctly
- [ ] All styles apply on frontend
- [ ] Editor and frontend look identical
- [ ] Hover states work
- [ ] Themes apply correctly

### Validation Test Cases

**Test Case 1: Valid Schema**
```bash
# Given: Correct structure and attribute schemas
npm run schema:validate-structure
# Expected: ✅ All validations passed!
```

**Test Case 2: Missing Element Reference**
```json
// schemas/accordion.json
{
  "titleColor": {
    "appliesTo": "title-button"  // ← Element doesn't exist
  }
}
```
```bash
npm run schema:validate-structure
# Expected: ❌ Attribute "titleColor" references element "title-button"
#           but structure schema only has: ["title", "titleWrapper", ...]
```

**Test Case 3: Missing Attribute in appliesStyles**
```json
// schemas/accordion-structure.json
{
  "elements": {
    "title": {
      "appliesStyles": ["titleColor", "nonExistentAttr"]  // ← Doesn't exist
    }
  }
}
```
```bash
npm run schema:validate-structure
# Expected: ❌ Element "title" applies attribute "nonExistentAttr"
#           but attribute schema doesn't define it
```

**Test Case 4: CSS Selector Mismatch**
```json
// schemas/accordion-structure.json
{
  "elements": {
    "title": {
      "className": "accordion-title"
    }
  }
}

// schemas/accordion.json (old format)
{
  "titleColor": {
    "cssSelector": ".accordion-header"  // ← Deprecated field, wrong selector
  }
}
```
```bash
npm run schema:validate-structure
# Expected: ⚠️  Attribute "titleColor" has cssSelector ".accordion-header"
#           but element "title" has className "accordion-title"
#           Please update to use "appliesTo": "title" instead
```

---

## Code Examples

### Example: accordion-structure.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "blockType": "accordion",
  "version": "1.0.0",
  "description": "HTML structure definition for Accordion block",

  "elements": {
    "wrapper": {
      "id": "wrapper",
      "tag": "div",
      "className": "wp-block-accordion sammu-blocks",
      "description": "Outermost container for the accordion block",
      "children": ["item"],
      "attributes": {
        "data-accordion-id": "{accordionId}"
      },
      "appliesStyles": []
    },

    "item": {
      "id": "item",
      "tag": "div",
      "className": "accordion-item",
      "description": "Individual accordion item container",
      "children": ["titleWrapper", "content"],
      "attributes": {
        "data-item-id": "0"
      },
      "conditionalClass": {
        "is-open": "{initiallyOpen}"
      },
      "appliesStyles": [
        "borderColor",
        "borderWidth",
        "borderStyle",
        "borderRadius",
        "shadow",
        "shadowHover"
      ]
    },

    "titleWrapper": {
      "id": "titleWrapper",
      "tag": "div",
      "className": "accordion-title-wrapper",
      "description": "Wrapper for title button with padding",
      "children": ["title"],
      "appliesStyles": []
    },

    "title": {
      "id": "title",
      "tag": "button",
      "className": "accordion-title",
      "description": "Clickable title/header button",
      "children": ["titleText", "icon"],
      "attributes": {
        "type": "button"
      },
      "aria": {
        "expanded": "{!initiallyOpen}",
        "controls": "{accordionId}-content"
      },
      "appliesStyles": [
        "titleColor",
        "titleBackgroundColor",
        "titleFontSize",
        "titleFontWeight",
        "titleFontStyle",
        "titleTextTransform",
        "titleTextDecoration",
        "titleAlignment",
        "hoverTitleColor",
        "hoverTitleBackgroundColor"
      ],
      "conditionalTag": {
        "when": "headingLevel !== 'none'",
        "wrapWith": "{headingLevel}",
        "wrapClassName": "accordion-heading"
      }
    },

    "titleText": {
      "id": "titleText",
      "tag": "span",
      "className": "accordion-title-text",
      "description": "Title text content (editable)",
      "contentType": "RichText",
      "source": "{title}",
      "appliesStyles": []
    },

    "icon": {
      "id": "icon",
      "tag": "span",
      "className": "accordion-icon",
      "description": "Expand/collapse icon",
      "conditionalRender": "{showIcon}",
      "attributes": {
        "aria-hidden": "true",
        "data-icon-closed": "{iconTypeClosed}",
        "data-icon-open": "{iconTypeOpen}"
      },
      "conditionalClass": {
        "is-rotated": "{isOpen}"
      },
      "appliesStyles": [
        "iconColor",
        "iconSize",
        "iconRotation"
      ],
      "renderVariant": {
        "condition": "iconTypeClosed.startsWith('http')",
        "ifTrue": {
          "tag": "img",
          "className": "accordion-icon accordion-icon-image",
          "attributes": {
            "src": "{iconTypeClosed}",
            "alt": ""
          }
        }
      }
    },

    "content": {
      "id": "content",
      "tag": "div",
      "className": "accordion-content",
      "description": "Collapsible content area",
      "children": ["contentInner"],
      "conditionalAttribute": {
        "hidden": "{!initiallyOpen}"
      },
      "aria": {
        "role": "region",
        "labelledby": "{accordionId}-header"
      },
      "appliesStyles": [
        "contentColor",
        "contentBackgroundColor",
        "contentFontSize",
        "dividerColor",
        "dividerWidth",
        "dividerStyle"
      ]
    },

    "contentInner": {
      "id": "contentInner",
      "tag": "div",
      "className": "accordion-content-inner",
      "description": "Inner content wrapper with padding",
      "contentType": "InnerBlocks",
      "appliesStyles": []
    }
  },

  "hierarchy": {
    "root": "wrapper",
    "tree": {
      "wrapper": {
        "item": {
          "titleWrapper": {
            "title": ["titleText", "icon"]
          },
          "content": {
            "contentInner": []
          }
        }
      }
    }
  }
}
```

### Example: Updated accordion.json (excerpt)

```json
{
  "attributes": {
    "titleColor": {
      "type": "string",
      "default": "#333333",
      "group": "headerColors",
      "label": "Title Color",
      "description": "Text color for the accordion title",
      "themeable": true,
      "control": "ColorPicker",
      "order": 15,
      "pago": "nao",

      "appliesTo": "title",
      "cssVar": "title-color",
      "cssProperty": "color"
    },

    "titleBackgroundColor": {
      "type": "string",
      "default": "#f5f5f5",
      "group": "headerColors",
      "label": "Title Background",
      "description": "Background color for the accordion title",
      "themeable": true,
      "control": "ColorPicker",
      "order": 16,
      "pago": "nao",

      "appliesTo": "title",
      "cssVar": "title-bg",
      "cssProperty": "background-color"
    },

    "borderColor": {
      "type": "string",
      "default": "#dddddd",
      "group": "borders",
      "label": "Border Color",
      "description": "Color of the accordion wrapper border",
      "themeable": true,
      "control": "ColorPicker",
      "order": 21,
      "pago": "nao",

      "appliesTo": "item",
      "cssVar": "border-color",
      "cssProperty": "border-color"
    },

    "iconColor": {
      "type": "string",
      "default": "#666666",
      "group": "icon",
      "label": "Icon Color",
      "description": "Color of the expand/collapse icon",
      "themeable": true,
      "control": "ColorPicker",
      "order": 23,
      "pago": "nao",

      "appliesTo": "icon",
      "cssVar": "icon-color",
      "cssProperty": "color"
    }
  }
}
```

### Example: Validation Script

```javascript
// build-tools/validate-schema-structure.js

const fs = require('fs');
const path = require('path');

const BLOCKS = ['accordion', 'tabs', 'toc'];

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Failed to load ${filePath}:`, error.message);
    process.exit(1);
  }
}

function validateBlock(blockType) {
  console.log(`\n🔍 Validating ${blockType}...\n`);

  const structurePath = path.join(__dirname, `../schemas/${blockType}-structure.json`);
  const attributesPath = path.join(__dirname, `../schemas/${blockType}.json`);

  const structure = loadJSON(structurePath);
  const attributes = loadJSON(attributesPath);

  const errors = [];
  const warnings = [];

  // Build element map
  const elements = new Map();
  Object.entries(structure.elements).forEach(([id, element]) => {
    elements.set(id, element);
  });

  // Validation 1: All attribute targets exist
  Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
    if (attr.appliesTo) {
      if (!elements.has(attr.appliesTo)) {
        errors.push(
          `❌ Attribute "${attrName}" targets element "${attr.appliesTo}" ` +
          `but that element doesn't exist in structure!\n` +
          `   Available elements: ${Array.from(elements.keys()).join(', ')}`
        );
      }
    } else if (attr.themeable) {
      errors.push(
        `❌ Attribute "${attrName}" is themeable but missing "appliesTo" field!`
      );
    }

    // Check for deprecated cssSelector field
    if (attr.cssSelector) {
      const element = attr.appliesTo ? elements.get(attr.appliesTo) : null;
      const expectedSelector = element ? `.${element.className.split(' ')[0]}` : 'unknown';

      warnings.push(
        `⚠️  Attribute "${attrName}" has deprecated "cssSelector" field: "${attr.cssSelector}"\n` +
        `   Please remove it and use "appliesTo": "${attr.appliesTo || 'elementId'}" instead\n` +
        `   Expected selector based on structure: "${expectedSelector}"`
      );
    }
  });

  // Validation 2: All element children exist
  Object.entries(structure.elements).forEach(([id, element]) => {
    element.children?.forEach(childId => {
      if (!elements.has(childId)) {
        errors.push(
          `❌ Element "${id}" has child "${childId}" ` +
          `but that element isn't defined!\n` +
          `   Available elements: ${Array.from(elements.keys()).join(', ')}`
        );
      }
    });
  });

  // Validation 3: All appliesStyles attributes exist
  Object.entries(structure.elements).forEach(([id, element]) => {
    element.appliesStyles?.forEach(attrName => {
      if (!attributes.attributes[attrName]) {
        errors.push(
          `❌ Element "${id}" applies attribute "${attrName}" ` +
          `but that attribute doesn't exist in attribute schema!`
        );
      }
    });
  });

  // Validation 4: Bidirectional check
  Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
    if (attr.themeable && attr.appliesTo) {
      const element = elements.get(attr.appliesTo);

      if (element && !element.appliesStyles?.includes(attrName)) {
        warnings.push(
          `⚠️  Attribute "${attrName}" applies to element "${attr.appliesTo}" ` +
          `but "${attr.appliesTo}.appliesStyles" doesn't include "${attrName}"\n` +
          `   This may cause the style not to be generated in CSS.`
        );
      }
    }
  });

  // Report results
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:\n');
    warnings.forEach(warn => console.log(warn + '\n'));
  }

  if (errors.length > 0) {
    console.error('❌ Validation failed:\n');
    errors.forEach(err => console.error(err + '\n'));
    return false;
  } else {
    console.log(`✅ ${blockType} validation passed!\n`);
    return true;
  }
}

// Main execution
let allValid = true;

BLOCKS.forEach(blockType => {
  const valid = validateBlock(blockType);
  if (!valid) {
    allValid = false;
  }
});

if (!allValid) {
  console.error('\n❌ Schema validation failed for one or more blocks!\n');
  process.exit(1);
} else {
  console.log('\n✅ All schema validations passed!\n');
  process.exit(0);
}
```

---

## Testing & Verification

### Unit Tests

**Test 1: Structure Schema Validation**
```bash
# Create invalid structure schema
cat > schemas/test-structure.json << 'EOF'
{
  "blockType": "test",
  "elements": {
    "parent": {
      "id": "parent",
      "children": ["nonExistent"]
    }
  }
}
EOF

# Run validation
npm run schema:validate-structure

# Expected: ❌ Element "parent" has child "nonExistent" but that element isn't defined
```

**Test 2: Attribute Reference Validation**
```bash
# Create invalid attribute schema
cat > schemas/test.json << 'EOF'
{
  "attributes": {
    "testColor": {
      "themeable": true,
      "appliesTo": "nonExistent"
    }
  }
}
EOF

# Create valid structure
cat > schemas/test-structure.json << 'EOF'
{
  "blockType": "test",
  "elements": {
    "title": { "id": "title" }
  }
}
EOF

# Run validation
npm run schema:validate-structure

# Expected: ❌ Attribute "testColor" targets element "nonExistent"
```

**Test 3: CSS Generation**
```bash
# Build with corrected schemas
npm run build

# Check output
cat blocks/accordion/src/_theme-generated.scss

# Expected: Contains .accordion-title, .accordion-item (not .accordion-header)
```

### Integration Tests

**Test 1: Full Build Cycle**
```bash
# Clean build
rm -rf build/
npm run build

# Check for errors
echo $?  # Should be 0
```

**Test 2: WordPress Editor Test**
```
1. Open WordPress editor
2. Add Accordion block
3. Customize title color
4. Verify color appears in editor
5. Save post
6. View on frontend
7. Verify color appears on frontend
8. Compare editor vs frontend visually
```

**Test 3: Theme Application Test**
```
1. Open Accordion block
2. Select existing theme
3. Verify all styles apply
4. Customize one attribute
5. Save as new theme
6. Apply new theme to different block
7. Verify customization persists
```

### Visual Regression Tests

**Create baseline screenshots:**
```bash
# In WordPress
1. Create test post with:
   - Accordion with default theme
   - Accordion with custom theme
   - Tabs with default theme
   - TOC with default theme

2. Take screenshots:
   - Editor view
   - Frontend view
   - For each block

3. Save to tests/visual-regression/baseline/
```

**After implementation:**
```bash
1. Rebuild plugin
2. Reload test post
3. Take new screenshots
4. Compare with baseline

Expected: Identical rendering
```

---

## Rollback Plan

### If Validation Fails

**Scenario: Build fails during development**

```bash
# 1. Check what failed
npm run schema:validate-structure

# 2. Fix errors in schemas

# 3. Retry build
npm run build
```

### If CSS Generation Produces Wrong Output

**Scenario: _theme-generated.scss has incorrect selectors**

```bash
# 1. Check structure schema class names
cat schemas/accordion-structure.json | jq '.elements[].className'

# 2. Check attribute schema appliesTo references
cat schemas/accordion.json | jq '.attributes[] | select(.appliesTo) | .appliesTo'

# 3. Verify references match
npm run schema:validate-structure

# 4. Fix mismatches

# 5. Rebuild
npm run schema:build
```

### If Frontend Breaks

**Scenario: Frontend displays incorrectly after deployment**

```bash
# IMMEDIATE ROLLBACK:

# 1. Revert to previous commit
git log --oneline -10  # Find last good commit
git revert <commit-hash>

# 2. Rebuild from reverted state
npm run build

# 3. Deploy reverted build

# 4. Investigate issue offline
git checkout -b fix/schema-issue
# Debug and fix
```

### Emergency Rollback (Nuclear Option)

**If everything is broken:**

```bash
# 1. Restore backup of old schemas
cp schemas-backup/*.json schemas/

# 2. Restore old build scripts
git checkout HEAD~1 -- build-tools/

# 3. Clean rebuild
rm -rf build/
npm run build

# 4. Test manually

# 5. Deploy if working
```

---

## Success Metrics

### Technical Metrics

- ✅ **Zero build errors** - All validations pass
- ✅ **Zero selector mismatches** - CSS targets correct elements
- ✅ **100% visual parity** - Editor matches frontend
- ✅ **Zero manual CSS selector updates** - All auto-generated
- ✅ **Build time < 30 seconds** - No performance regression

### Developer Experience Metrics

- ✅ **Clear error messages** - Developers know what's wrong
- ✅ **Fast iteration** - Schema changes reflect immediately
- ✅ **Self-documenting** - Structure files explain HTML
- ✅ **Safe refactoring** - Validation catches breaking changes
- ✅ **Easy onboarding** - New developers understand system

### User Experience Metrics

- ✅ **Themes work consistently** - Apply correctly every time
- ✅ **Customizations persist** - No lost settings
- ✅ **No visual bugs** - Everything renders correctly
- ✅ **Fast loading** - CSS is optimized
- ✅ **Accessible** - ARIA attributes correct

---

## Appendix

### A. File Checklist

**New Files to Create:**
- [ ] `schemas/accordion-structure.json`
- [ ] `schemas/tabs-structure.json`
- [ ] `schemas/toc-structure.json`
- [ ] `build-tools/validate-schema-structure.js`
- [ ] `docs/SCHEMA_GUIDE.md`

**Files to Modify:**
- [ ] `schemas/accordion.json`
- [ ] `schemas/tabs.json`
- [ ] `schemas/toc.json`
- [ ] `build-tools/schema-compiler.js` (CSS generation)
- [ ] `package.json` (build scripts)

**Files to Keep (No Changes):**
- `blocks/*/src/edit.js`
- `blocks/*/src/save.js`
- `blocks/*/src/style.scss`
- All other existing files

### B. Terminology

| Term | Definition |
|------|------------|
| **Structure Schema** | JSON file defining HTML element hierarchy |
| **Attribute Schema** | JSON file defining customizable properties |
| **Element ID** | Unique identifier for HTML element in structure |
| **appliesTo** | Field linking attribute to element by ID |
| **appliesStyles** | Array of attribute names that style an element |
| **cssSelector** | (Deprecated) Direct CSS selector string |
| **Cross-validation** | Checking references between two schemas |

### C. FAQ

**Q: Why two schema files instead of one?**
A: Separation of concerns. Structure defines "what elements exist", attributes define "what can be customized". This makes both easier to understand and maintain.

**Q: What happens to existing schemas?**
A: They're updated with `appliesTo` fields, `cssSelector` fields are removed. All other fields stay the same.

**Q: Will this break existing themes?**
A: No. Themes are stored as attribute deltas, which don't change. The CSS generation is improved but produces the same variable names.

**Q: Can I still manually write CSS?**
A: Yes. The generated `_theme-generated.scss` is imported into `style.scss`, where you can add custom styles.

**Q: How long does validation take?**
A: < 1 second for all three blocks. It's a simple cross-reference check.

**Q: What if I add a new element?**
A: Add it to structure schema, reference it in attribute schema with `appliesTo`, add to element's `appliesStyles` array. Validation ensures you don't miss steps.

**Q: Can elements share class names?**
A: Yes, but the first class name is used for CSS generation. Multiple classes are supported in `className` field.

**Q: What about responsive styles?**
A: Structure schema documents HTML. Responsive styles stay in `style.scss` as before.

---

## Implementation Checklist

### Pre-Implementation
- [ ] Read entire SINGLE_SOURCE.md
- [ ] Understand dual-schema architecture
- [ ] Backup current schemas directory
- [ ] Create feature branch: `feature/dual-schema-architecture`
- [ ] Assign agents to phases

### Phase 1: Structure Schemas
- [ ] Create `accordion-structure.json`
- [ ] Create `tabs-structure.json`
- [ ] Create `toc-structure.json`
- [ ] Verify all elements documented
- [ ] Verify class names match HTML

### Phase 2: Attribute Schemas
- [ ] Add `appliesTo` to all themeable attributes (accordion)
- [ ] Add `appliesTo` to all themeable attributes (tabs)
- [ ] Add `appliesTo` to all themeable attributes (toc)
- [ ] Remove `cssSelector` fields (accordion)
- [ ] Remove `cssSelector` fields (tabs)
- [ ] Remove `cssSelector` fields (toc)

### Phase 3: Validation
- [ ] Create `validate-schema-structure.js`
- [ ] Test with valid schemas (should pass)
- [ ] Test with invalid schemas (should fail)
- [ ] Verify error messages are clear

### Phase 4: CSS Generator
- [ ] Update CSS generator to read both schemas
- [ ] Test CSS output matches expected
- [ ] Verify selectors are correct
- [ ] Verify hover states work

### Phase 5: Build Scripts
- [ ] Update `package.json` scripts
- [ ] Add validation to prebuild
- [ ] Test full build cycle
- [ ] Verify build fails on invalid schemas

### Phase 6: Documentation
- [ ] Create `SCHEMA_GUIDE.md`
- [ ] Document structure schema format
- [ ] Document migration guide
- [ ] Document troubleshooting

### Testing
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Visual regression tests
- [ ] Manual WordPress testing
- [ ] Test all three blocks

### Deployment
- [ ] Review all changes
- [ ] Update CHANGELOG.md
- [ ] Commit to feature branch
- [ ] Create pull request
- [ ] Code review
- [ ] Merge to main
- [ ] Tag release
- [ ] Deploy

---

**END OF SINGLE_SOURCE.md**

This document is the authoritative reference for the dual-schema architecture implementation. All agents should follow these specifications exactly.
