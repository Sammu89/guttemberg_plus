# Comprehensive Schema Rewrite - Implementation Roadmap

## Overview
Complete rewrite of schema pipeline to eliminate sync issues by creating a single comprehensive schema that drives all downstream artifacts.

**Key Decision**: All attribute names use CSS kebab-case (e.g., `border-top-color`) to match CSS variable names exactly. This requires a one-time migration of existing blocks.

## Architecture
```
Minimal Schema + HTML Structure → Parser → Comprehensive Schema → All Outputs
```

---

## Naming Convention (BREAKING CHANGE)

### Old System (camelCase)
```javascript
{
  titleIconSize: "16px",
  borderColorTop: "#dddddd",
  paddingLeft: "12px"
}
```

### New System (kebab-case)
```javascript
{
  "title-icon-size": "16px",
  "border-top-color": "#dddddd",
  "padding-left": "12px"
}
```

### Why This Change?

**Benefits**:
- ✅ Attribute name matches CSS var name exactly (`title-icon-size` → `--accordion-title-icon-size`)
- ✅ No mental translation between JS and CSS
- ✅ Easier debugging (search "border-top-color" finds everything)
- ✅ Theme export/import more readable
- ✅ Consistent with CSS conventions

### Migration Not Needed

**You're starting fresh**, so no migration required! All new code will use kebab-case from day one.

This eliminates:
- ❌ Phase 5.1 (Migration script) - Skip entirely
- ❌ Migration files - Don't need to create
- ✅ Simpler implementation - Just build the new system

---

## Phase 1: Parser Infrastructure (Week 1-2) ALL PHASE 1 is implemented

### 1.1 HTML Template Parser 
**File**: `schemas/parser/html-parser.js`
**Input**: HTML template files (`accordion-structure.html`, etc.)
**Output**: Structured element tree

**What it parses**:
```html
<div class="gutplus-accordion" data-el="item">
  <button class="accordion-title" data-el="title" type="button">
    <span class="accordion-icon" data-el="icon"></span>
  </button>
  <div class="accordion-content" data-el="content"></div>
</div>
```

**Output format**:
```javascript
{
  elements: {
    "item": {
      id: "item",
      selector: ".gutplus-accordion",
      tag: "div",
      attributes: {},
      children: ["title", "content"],
      parent: null
    },
    "title": {
      id: "title",
      selector: ".accordion-title",
      tag: "button",
      attributes: { type: "button" },
      children: ["icon"],
      parent: "item"
    },
    "icon": {
      id: "icon",
      selector: ".accordion-icon",
      tag: "span",
      attributes: {},
      children: [],
      parent: "title"
    },
    "content": {
      id: "content",
      selector: ".accordion-content",
      tag: "div",
      attributes: {},
      children: [],
      parent: "item"
    }
  },
  variations: {
    // Conditional structures from data-when, data-switch
    "headingLevel": {
      condition: "headingLevel !== 'none'",
      trueStructure: { wrapper: "h{headingLevel}" },
      falseStructure: { wrapper: null }
    }
  },
  slots: ["iconMarkup", "titleButton"],
  template: "..." // Original HTML for reference
}
```

**DSL Features to parse**:
- `data-el="id"` → Extract element ID
- `class="primary-class other-classes"` → First class = selector
- `<template data-when="expression">...</template>` → Conditional rendering
- `<template data-else>...</template>` → Fallback branch
- `<template data-switch="expr">` → Switch statement
- `<template data-case="value">` → Case branch
- `<template data-default>` → Default case
- `<template data-slot="name">...</template>` → Define reusable fragment
- `<template data-slot="name"></template>` → Inject fragment
- `{placeholderName}` → String substitution (e.g., `<h{headingLevel}>`)

**Implementation approach**:
```javascript
const { JSDOM } = require('jsdom');

function parseHTMLTemplate(htmlFilePath) {
  const html = fs.readFileSync(htmlFilePath, 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const elements = {};
  const variations = {};
  const slots = {};

  // Traverse DOM and extract structure
  function traverse(node, parentId = null) {
    if (node.nodeType !== 1) return; // Skip non-element nodes

    const elId = node.getAttribute('data-el');
    if (elId) {
      const classes = node.getAttribute('class')?.split(' ') || [];
      elements[elId] = {
        id: elId,
        selector: classes[0] ? `.${classes[0]}` : null,
        tag: node.tagName.toLowerCase(),
        attributes: extractAttributes(node),
        children: [],
        parent: parentId
      };

      if (parentId) {
        elements[parentId].children.push(elId);
      }
    }

    // Handle <template> special cases
    if (node.tagName === 'TEMPLATE') {
      handleTemplateDirective(node, elements, variations, slots);
    }

    // Recurse children
    Array.from(node.children).forEach(child => {
      traverse(child, elId || parentId);
    });
  }

  traverse(document.body);

  return { elements, variations, slots, template: html };
}
```

**Tasks**:
- [ ] Install jsdom or similar HTML parser
- [ ] Parse `data-el` attributes
- [ ] Parse `class` attributes (first class = primary selector)
- [ ] Handle `<template>` directives
- [ ] Extract variations (data-when, data-switch)
- [ ] Extract slots (data-slot)
- [ ] Handle string substitution placeholders `{var}`
- [ ] Build element tree with parent/child relationships
- [ ] Write unit tests for each DSL feature

---

### 1.2 Schema Merger
**File**: `schemas/parser/schema-merger.js`
**Purpose**: Connect minimal schema attributes to HTML elements

**What it does**:
```javascript
function mergeStructureIntoSchema(minimalSchema, htmlStructure) {
  const mergedAttributes = {};

  Object.entries(minimalSchema.attributes || {}).forEach(([attrName, attrDef]) => {
    const appliesTo = attrDef.appliesTo;

    if (appliesTo && htmlStructure.elements[appliesTo]) {
      const element = htmlStructure.elements[appliesTo];
      mergedAttributes[attrName] = {
        ...attrDef,
        _elementSelector: element.selector,
        _elementTag: element.tag,
        _elementId: element.id
      };
    } else {
      mergedAttributes[attrName] = attrDef;
    }
  });

  return {
    ...minimalSchema,
    attributes: mergedAttributes,
    structure: htmlStructure
  };
}

module.exports = { mergeStructureIntoSchema };
```

**Example transformation**:
```javascript
// Input attribute:
{
  "title-icon": {
    type: "icon-panel",
    cssVar: "accordion-icon",
    appliesTo: "icon"
  }
}

// After merge (added metadata):
{
  "title-icon": {
    type: "icon-panel",
    cssVar: "accordion-icon",
    appliesTo: "icon",
    _elementSelector: ".accordion-icon",  // ← From HTML
    _elementTag: "span",                  // ← From HTML
    _elementId: "icon"                    // ← From HTML
  }
}
```

**Tasks**:
- [ ] Create schema-merger.js
- [ ] Read `appliesTo` from each attribute
- [ ] Look up element in HTML structure
- [ ] Attach element metadata to attribute
- [ ] Handle missing `appliesTo` (attribute applies globally)
- [ ] Preserve original schema structure
- [ ] Write unit tests

---

### 1.3 Comprehensive Expander (THE ORCHESTRATOR) ⭐
**File**: `schemas/parser/comprehensive-expander.js`
**Purpose**: **THE BRAIN** - Orchestrates all macro expansion and builds the complete comprehensive schema

**This is the most important file in the entire system.**

**What it does (step by step)**:

```javascript
const { expandIconPanelMacro } = require('./icon-expander');
const { expandTypographyPanelMacro } = require('./typography-expander');
const { expandBorderPanelMacro } = require('./border-expander');
const { expandBoxPanelMacro } = require('./box-expander');
const { applyResponsiveVariants, buildResponsiveSelectors } = require('./responsive-expander');

const EXPANDERS = {
  'icon-panel': expandIconPanelMacro,
  'typography-panel': expandTypographyPanelMacro,
  'border-panel': expandBorderPanelMacro,
  'box-panel': expandBoxPanelMacro,
};

function createComprehensiveSchema(mergedSchema) {
  // Step 1: Expand all macros into atomic attributes
  const expandedAttributes = {};

  Object.entries(mergedSchema.attributes || {}).forEach(([attrName, attrDef]) => {
    const expander = EXPANDERS[attrDef.type];

    if (expander) {
      // This is a macro - expand it
      const expanded = expander(attrName, attrDef, mergedSchema.blockType);
      Object.assign(expandedAttributes, expanded);
    } else {
      // Already atomic - keep as-is
      expandedAttributes[attrName] = attrDef;
    }
  });

  // Step 2: Apply responsive variants to all responsive attributes
  const withResponsive = applyResponsiveVariants(expandedAttributes, mergedSchema.structure);

  // Step 3: Extract all default values into flat map
  const defaultValues = {};
  Object.entries(withResponsive).forEach(([key, attr]) => {
    if (attr.default !== undefined) {
      defaultValues[key] = attr.default;
    }
  });

  // Step 4: Build CSS var → attribute metadata map
  const cssVarMap = {};
  Object.entries(withResponsive).forEach(([attrName, attr]) => {
    if (attr.cssVar) {
      cssVarMap[attr.cssVar] = {
        attribute: attrName,
        selector: attr._elementSelector || null,
        cssProperty: attr.cssProperty || null,
        appliesTo: attr.appliesTo || null,
        responsive: attr.responsive || false
      };
    }
  });

  // Step 5: Build selector → CSS vars reverse lookup
  const selectorVarMap = {};
  Object.entries(withResponsive).forEach(([attrName, attr]) => {
    if (attr.cssVar && attr._elementSelector) {
      if (!selectorVarMap[attr._elementSelector]) {
        selectorVarMap[attr._elementSelector] = [];
      }
      selectorVarMap[attr._elementSelector].push(attr.cssVar);
    }
  });

  // Step 6: Build responsive selectors (device-specific)
  const responsiveSelectors = buildResponsiveSelectors(withResponsive, mergedSchema.structure);

  // Step 7: Build final comprehensive schema
  return {
    ...mergedSchema,
    attributes: withResponsive,
    defaultValues,
    cssVarMap,
    selectorVarMap,
    responsiveSelectors
  };
}

module.exports = { createComprehensiveSchema };
```

**Output example** (comprehensive schema):
```json
{
  "blockType": "accordion",
  "attributes": {
    "title-icon-size": {
      "type": "string",
      "default": "16px",
      "cssVar": "--accordion-icon-size",
      "cssProperty": "font-size",
      "appliesTo": "icon",
      "responsive": true,
      "control": "SliderWithInput",
      "_elementSelector": ".accordion-icon",
      "_elementTag": "span",
      "cssVarVariants": [
        "--accordion-icon-size",
        "--accordion-icon-size-tablet",
        "--accordion-icon-size-mobile"
      ]
    },
    "title-icon-size-active": { /* ... */ },
    "title-icon-color": { /* ... */ },
    "border-top-color": { /* ... */ },
    "border-top-width": { /* ... */ }
    /* ... 50+ more atomic attributes ... */
  },
  "defaultValues": {
    "title-icon-size": "16px",
    "title-icon-color": "#666666",
    "border-top-color": "#dddddd",
    /* ... all defaults in flat map ... */
  },
  "cssVarMap": {
    "--accordion-icon-size": {
      "attribute": "title-icon-size",
      "selector": ".accordion-icon",
      "cssProperty": "font-size",
      "appliesTo": "icon",
      "responsive": true
    }
    /* ... all CSS vars ... */
  },
  "selectorVarMap": {
    ".accordion-icon": [
      "--accordion-icon-size",
      "--accordion-icon-color",
      "--accordion-icon-offset-x",
      "--accordion-icon-offset-y"
    ],
    ".accordion-title": [
      "--accordion-title-font-size",
      "--accordion-title-font-weight"
    ]
    /* ... all selectors ... */
  },
  "responsiveSelectors": [
    {
      "device": "tablet",
      "selector": "[data-gutplus-device='tablet'] .accordion-icon",
      "vars": [
        "--accordion-icon-size-tablet",
        "--accordion-icon-color-tablet"
      ]
    },
    {
      "device": "mobile",
      "selector": "[data-gutplus-device='mobile'] .accordion-icon",
      "vars": [
        "--accordion-icon-size-mobile",
        "--accordion-icon-color-mobile"
      ]
    }
  ],
  "structure": { /* HTML structure from parser */ },
  "elements": { /* Element tree from parser */ }
}
```

**Tasks**:
- [ ] Create comprehensive-expander.js
- [ ] Integrate all existing expanders (icon, typography, border, box)
- [ ] Implement macro expansion loop
- [ ] Call responsive-expander for variants
- [ ] Build defaultValues map
- [ ] Build cssVarMap (CSS var → attribute metadata)
- [ ] Build selectorVarMap (selector → CSS vars array)
- [ ] Build responsiveSelectors array
- [ ] Write comprehensive unit tests
- [ ] **THIS IS THE CRITICAL PATH FILE**

---

### 1.4 Update Existing Expanders (Kebab-Case Output)

All expanders must output kebab-case attribute names:

**Example: icon-expander.js**
```javascript
// OLD (camelCase):
{
  titleIconSize: { ... },
  titleIconColor: { ... }
}

// NEW (kebab-case):
{
  "title-icon-size": { ... },
  "title-icon-color": { ... }
}
```

-- ALL PHASE 1 is implemented

---

## Phase 2: CSS Generation - COMPLETE

**Status**: ✅ CSS variable generation is complete, and HTML → element mapping export is complete.
Outputs now include:
- `css/generated/{block}_variables.scss`
- `schemas/{block}-structure-mapping-autogenerated.json`

### 2.1 Universal SCSS Generator
**File**: `schemas/parser/scss-generator.js`
**Input**: Comprehensive schema (from `schemas/comprehensive/accordion-comprehensive.json`)
**Output**: Complete SCSS file with ALL variables and selectors

**What it generates**:

```scss
/**
 * AUTO-GENERATED - DO NOT EDIT
 * Source: schemas/comprehensive/accordion-comprehensive.json
 * Generated: 2026-01-04T12:00:00.000Z
 */

// ============================================================================
// TIER 1: CSS VARIABLE DECLARATIONS (Defaults)
// ============================================================================
:root {
  // Icon variables (from icon-panel expansion)
  --accordion-icon-size: 16px;
  --accordion-icon-size-active: 16px;
  --accordion-icon-color: #666666;
  --accordion-icon-color-active: #333333;
  --accordion-icon-offset-x: 0px;
  --accordion-icon-offset-y: 0px;
  --accordion-icon-rotation: 0deg;
  --accordion-icon-rotation-active: 180deg;

  // Border atomic variables (from border-panel expansion)
  --accordion-border-top-color: #dddddd;
  --accordion-border-top-width: 1px;
  --accordion-border-top-style: solid;
  --accordion-border-right-color: #dddddd;
  --accordion-border-right-width: 1px;
  --accordion-border-right-style: solid;
  --accordion-border-bottom-color: #dddddd;
  --accordion-border-bottom-width: 1px;
  --accordion-border-bottom-style: solid;
  --accordion-border-left-color: #dddddd;
  --accordion-border-left-width: 1px;
  --accordion-border-left-style: solid;

  // Typography variables
  --accordion-title-font-size: 1rem;
  --accordion-title-font-weight: 600;
  --accordion-title-line-height: 1.5;

  // Padding variables
  --accordion-padding-top: 12px;
  --accordion-padding-right: 16px;
  --accordion-padding-bottom: 12px;
  --accordion-padding-left: 16px;

  // ... ALL variables from comprehensive schema ...
}

// ============================================================================
// BASE SELECTORS (Apply variables to elements)
// ============================================================================

// Icon element
.accordion-icon {
  font-size: var(--accordion-icon-size);
  color: var(--accordion-icon-color);
  transform: translate(
    var(--accordion-icon-offset-x),
    var(--accordion-icon-offset-y)
  ) rotate(var(--accordion-icon-rotation));
  transition: all 0.3s ease;
}

// Title element
.accordion-title {
  font-size: var(--accordion-title-font-size);
  font-weight: var(--accordion-title-font-weight);
  line-height: var(--accordion-title-line-height);
}

// Accordion item (border example - atomic)
.gutplus-accordion {
  border-top: var(--accordion-border-top-width) var(--accordion-border-top-style) var(--accordion-border-top-color);
  border-right: var(--accordion-border-right-width) var(--accordion-border-right-style) var(--accordion-border-right-color);
  border-bottom: var(--accordion-border-bottom-width) var(--accordion-border-bottom-style) var(--accordion-border-bottom-color);
  border-left: var(--accordion-border-left-width) var(--accordion-border-left-style) var(--accordion-border-left-color);
  padding: var(--accordion-padding-top) var(--accordion-padding-right)
           var(--accordion-padding-bottom) var(--accordion-padding-left);
}

// ============================================================================
// STATE VARIATIONS (Active, Hover, etc.)
// ============================================================================

.gutplus-accordion.is-open {
  .accordion-icon {
    font-size: var(--accordion-icon-size-active);
    color: var(--accordion-icon-color-active);
    transform: translate(
      var(--accordion-icon-offset-x),
      var(--accordion-icon-offset-y)
    ) rotate(var(--accordion-icon-rotation-active));
  }
}

.accordion-title:hover {
  color: var(--accordion-title-color-hover, var(--accordion-title-color));
}

// ============================================================================
// RESPONSIVE SELECTORS (For Preview + Frontend)
// ============================================================================

// Tablet overrides
[data-gutplus-device="tablet"] {
  .accordion-icon {
    font-size: var(--accordion-icon-size-tablet, var(--accordion-icon-size));
    color: var(--accordion-icon-color-tablet, var(--accordion-icon-color));
  }

  .accordion-title {
    font-size: var(--accordion-title-font-size-tablet, var(--accordion-title-font-size));
  }

  .gutplus-accordion {
    padding: var(--accordion-padding-top-tablet, var(--accordion-padding-top))
             var(--accordion-padding-right-tablet, var(--accordion-padding-right))
             var(--accordion-padding-bottom-tablet, var(--accordion-padding-bottom))
             var(--accordion-padding-left-tablet, var(--accordion-padding-left));
  }
}

// Mobile overrides
[data-gutplus-device="mobile"] {
  .accordion-icon {
    font-size: var(--accordion-icon-size-mobile, var(--accordion-icon-size));
    color: var(--accordion-icon-color-mobile, var(--accordion-icon-color));
  }

  .accordion-title {
    font-size: var(--accordion-title-font-size-mobile, var(--accordion-title-font-size));
  }

  .gutplus-accordion {
    padding: var(--accordion-padding-top-mobile, var(--accordion-padding-top))
             var(--accordion-padding-right-mobile, var(--accordion-padding-right))
             var(--accordion-padding-bottom-mobile, var(--accordion-padding-bottom))
             var(--accordion-padding-left-mobile, var(--accordion-padding-left));
  }
}

// ============================================================================
// COMPOSITE SHORTCUTS (For Compression Support)
// ============================================================================

// When all border sides match, frontend can use composite var
.gutplus-accordion {
  &[data-border-unified="true"] {
    border: var(--accordion-border-width, 1px)
            var(--accordion-border-style, solid)
            var(--accordion-border-color, #dddddd);
  }
}
```

**Generator implementation**:
```javascript
function generateUniversalSCSS(comprehensiveSchema) {
  const { attributes, selectorVarMap, responsiveSelectors } = comprehensiveSchema;

  let scss = '// AUTO-GENERATED FILE\n\n';

  // 1. Generate :root declarations
  scss += ':root {\n';
  Object.entries(attributes).forEach(([attrName, attr]) => {
    if (attr.cssVar && attr.default !== undefined && attr.outputsCSS !== false) {
      scss += `  ${attr.cssVar}: ${attr.default};\n`;
    }
  });
  scss += '}\n\n';

  // 2. Generate base selectors
  Object.entries(selectorVarMap).forEach(([selector, cssVars]) => {
    scss += `${selector} {\n`;
    cssVars.forEach(cssVar => {
      const attr = findAttributeByCssVar(cssVar, attributes);
      if (attr && attr.cssProperty) {
        scss += `  ${attr.cssProperty}: var(${cssVar});\n`;
      }
    });
    scss += '}\n\n';
  });

  // 3. Generate responsive selectors
  ['tablet', 'mobile'].forEach(device => {
    scss += `[data-gutplus-device="${device}"] {\n`;
    const deviceSelectors = responsiveSelectors.filter(rs => rs.device === device);
    deviceSelectors.forEach(rs => {
      scss += `  ${rs.selector.replace(`[data-gutplus-device="${device}"] `, '')} {\n`;
      rs.vars.forEach(cssVar => {
        const baseVar = cssVar.replace(`-${device}`, '');
        const attr = findAttributeByCssVar(baseVar, attributes);
        if (attr && attr.cssProperty) {
          scss += `    ${attr.cssProperty}: var(${cssVar}, var(${baseVar}));\n`;
        }
      });
      scss += `  }\n`;
    });
    scss += '}\n\n';
  });

  return scss;
}
```

**Tasks** (completed):
- [x] Create scss-generator.js
- [x] Generate :root declarations from defaultValues
- [x] Generate base selectors from selectorVarMap
- [x] Generate state selectors (.is-open, :hover)
- [x] Generate responsive selectors from responsiveSelectors array
- [x] Add composite shortcuts for compression (auto-generated from atomic per-side attrs)
- [x] Add file header with metadata
- [ ] Write unit tests

---

### 2.2 Replace Old CSS Generator
**Action**: Deprecate `build-tools/css-generator.js`
**Reason**: New generator reads comprehensive schema (single source)

**Migration steps**:
1. Run both generators in parallel
2. Compare outputs (diff check)
3. Validate no missing selectors
4. Switch build script to use new generator
5. Archive old generator (don't delete yet)

---

## Phase 3: Panel + Sidebar Generation (Next)

**Goal**: Reprogram panel generation and sidebar generation per block to work with the new schema outputs.

**Approach**:
1. Read the existing sidebar generation logic and panel components.
2. Define how the new autogenerated files feed the UI:
   - `schemas/output/{block}-comprehensive.json`
   - `schemas/{block}-structure-mapping-autogenerated.json`
   - `css/generated/{block}_variables.scss`
3. Rebuild panel generation per block to consume groups, subgroups, states, and element targets from the comprehensive schema.
4. Update sidebar ordering/rendering to match the new structure (tabs → groups → subgroups → panels).

**Deliverables**:
- Panel renderers driven by comprehensive schema + structure mapping.
- Sidebar generator updated per block to consume the new schema contract.
- Migration notes for block-specific panel quirks.

## Phase 4: Edit/Save Generation (Week 3-4)

### 3.1 Edit.js Generator
**File**: `schemas/generators/edit-generator.js`
**Purpose**: Generate complete edit.js from comprehensive schema + HTML structure

**Generated file example**:
```javascript
/**
 * AUTO-GENERATED - DO NOT EDIT
 * Source: schemas/comprehensive/accordion-comprehensive.json
 * Generated: 2026-01-04T12:00:00.000Z
 */

import { InspectorControls } from '@wordpress/block-editor';
import { SchemaPanels } from '@shared/components/SchemaPanels';
import { buildEditorCssVars } from '@shared/styles/accordion-editor-css-vars-generated';
import comprehensiveSchema from '../../../schemas/comprehensive/accordion-comprehensive.json';

export function Edit({ attributes, setAttributes }) {
  const editorStyles = buildEditorCssVars(attributes);
  const responsiveDevice = attributes['responsive-device'] || 'desktop';

  return (
    <>
      <InspectorControls>
        <SchemaPanels
          schema={comprehensiveSchema}
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <div
        className="gutplus-accordion"
        data-gutplus-device={responsiveDevice}
        style={editorStyles}
      >
        {renderAccordionStructure(attributes, comprehensiveSchema.structure)}
      </div>
    </>
  );
}

function renderAccordionStructure(attributes, structure) {
  // Parse structure.template and render React components
  // This becomes standardized logic across all blocks
  return (
    <button className="accordion-title" type="button">
      {attributes['title-icon-show'] && (
        <span className="accordion-icon">
          {attributes['title-icon-inactive-source']?.char || '▾'}
        </span>
      )}
      <span className="accordion-title-text">Accordion Title</span>
    </button>
  );
}
```

**Generator implementation sketch**:
```javascript
function generateEditJS(comprehensiveSchema) {
  const { blockType, structure } = comprehensiveSchema;

  return `
import { InspectorControls } from '@wordpress/block-editor';
import { SchemaPanels } from '@shared/components/SchemaPanels';
import comprehensiveSchema from '../../../schemas/comprehensive/${blockType}-comprehensive.json';

export function Edit({ attributes, setAttributes }) {
  const editorStyles = buildEditorCssVars(attributes);

  return (
    <>
      <InspectorControls>
        <SchemaPanels
          schema={comprehensiveSchema}
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      ${generateBlockStructureFromHTML(structure)}
    </>
  );
}
  `;
}
```

**Tasks**:
- [ ] Create edit-generator.js
- [ ] Generate imports
- [ ] Generate SchemaPanels integration
- [ ] Generate block structure from HTML template
- [ ] Handle conditional rendering (data-when)
- [ ] Handle variations (data-switch)
- [ ] Add responsive device handling
- [ ] Write unit tests

---

### 3.2 Save.js Generator with Compression
**File**: `schemas/generators/save-generator.js`
**Purpose**: Generate save.js with atomic → composite compression

**Generated file example**:
```javascript
/**
 * AUTO-GENERATED - DO NOT EDIT
 * Source: schemas/comprehensive/accordion-comprehensive.json
 * Generated: 2026-01-04T12:00:00.000Z
 */

import { buildFrontendCssVars } from '@shared/styles/accordion-frontend-css-vars-generated';
import { compressCustomizations } from '@shared/utils/css-compressor';
import comprehensiveSchema from '../../../schemas/comprehensive/accordion-comprehensive.json';

export function save({ attributes }) {
  // Step 1: Get customizations (deltas)
  const customizations = attributes.customizations || {};

  // Step 2: Compress atomic attributes to composite when all sides match
  const compressed = compressCustomizations(customizations, comprehensiveSchema);

  // Step 3: Build inline CSS vars
  const inlineStyles = buildFrontendCssVars(compressed, attributes);

  // Step 4: Render frontend HTML
  return (
    <div
      className="gutplus-accordion"
      style={inlineStyles}
    >
      <button className="accordion-title" type="button">
        {attributes['title-icon-show'] && (
          <span className="accordion-icon">
            {renderIcon(attributes)}
          </span>
        )}
        <span className="accordion-title-text">
          {/* InnerBlocks will be here */}
        </span>
      </button>
      <div className="accordion-content">
        {/* Content InnerBlocks */}
      </div>
    </div>
  );
}
```

**Tasks**:
- [ ] Create save-generator.js
- [ ] Integrate css-compressor
- [ ] Generate block structure from HTML template
- [ ] Handle InnerBlocks placement
- [ ] Handle conditional rendering
- [ ] Write unit tests

---

### 3.3 CSS Compressor Utility
**File**: `shared/src/utils/css-compressor.js`
**Purpose**: Merge atomic attributes when all sides match

**Implementation**:
```javascript
/**
 * Compress atomic CSS attributes to composite when all sides match
 *
 * Example:
 * Input:  { "border-top-color": "#f00", "border-right-color": "#f00", ... }
 * Output: { "border-color": "#f00" }
 *
 * If sides differ, keeps atomic.
 */
export function compressCustomizations(customizations, comprehensiveSchema) {
  const compressed = { ...customizations };

  const compressionGroups = [
    {
      composite: 'border-color',
      atomic: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color']
    },
    {
      composite: 'border-width',
      atomic: ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width']
    },
    {
      composite: 'border-style',
      atomic: ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style']
    },
    {
      composite: 'padding',
      atomic: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
    },
    {
      composite: 'margin',
      atomic: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left']
    },
    {
      composite: 'border-radius',
      atomic: ['border-radius-top-left', 'border-radius-top-right',
               'border-radius-bottom-right', 'border-radius-bottom-left']
    }
  ];

  compressionGroups.forEach(({ composite, atomic }) => {
    const values = atomic.map(key => compressed[key]);
    const allDefined = values.every(v => v !== undefined && v !== null);
    const allSame = allDefined && values.every(v => deepEqual(v, values[0]));

    if (allSame) {
      // Merge to composite
      compressed[composite] = values[0];
      // Remove atomic versions
      atomic.forEach(key => delete compressed[key]);
    }
  });

  return compressed;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'object' && a !== null && b !== null) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}
```

**Tasks**:
- [ ] Create css-compressor.js
- [ ] Define compression groups
- [ ] Implement comparison logic
- [ ] Handle unit objects `{ value: 12, unit: "px" }`
- [ ] Handle responsive objects
- [ ] Write comprehensive tests

---

## Phase 4: Delta Calculator (Week 4)

### 4.1 Enhanced Delta Calculator (Kebab-Case)
**File**: `shared/src/utils/delta-calculator.js`
**Purpose**: Calculate deltas using comprehensive schema defaults (kebab-case keys)

**Implementation**:
```javascript
import accordionSchema from '../../../schemas/comprehensive/accordion-comprehensive.json';
import tabsSchema from '../../../schemas/comprehensive/tabs-comprehensive.json';
import tocSchema from '../../../schemas/comprehensive/toc-comprehensive.json';

const COMPREHENSIVE_SCHEMAS = {
  accordion: accordionSchema,
  tabs: tabsSchema,
  toc: tocSchema
};

const EXCLUDE_ATTRS = new Set([
  'customizations',
  'customization-cache',
  'current-theme',
  'responsive-device',
  'block-id',
  'class-name'
]);

/**
 * Calculate delta between attributes and comprehensive schema defaults
 *
 * @param {Object} attributes - Block attributes (kebab-case keys)
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {Object} Delta object (only differences)
 */
export function calculateDelta(attributes, blockType) {
  const schema = COMPREHENSIVE_SCHEMAS[blockType];
  if (!schema) {
    console.error(`No comprehensive schema found for block type: ${blockType}`);
    return attributes; // Fallback
  }

  const delta = {};

  Object.entries(attributes).forEach(([key, value]) => {
    // Skip meta attributes
    if (EXCLUDE_ATTRS.has(key)) return;

    // Get default from comprehensive schema
    const defaultValue = schema.defaultValues[key];

    // Only include if different from default
    if (!isEqual(value, defaultValue) && value !== null && value !== undefined) {
      delta[key] = value;
    }
  });

  return delta;
}

function isEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'object' && a !== null && b !== null) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}
```

**Tasks**:
- [ ] Update delta-calculator.js for kebab-case
- [ ] Import all comprehensive schemas
- [ ] Use `defaultValues` map from schema
- [ ] Handle nested objects (responsive values)
- [ ] Handle unit objects
- [ ] Update EXCLUDE_ATTRS to kebab-case
- [ ] Write comprehensive tests

---

## Phase 5: Testing (Week 5)

### 5.1 Comparison Testing
**File**: `schemas/tests/output-comparison.test.js`
**Purpose**: Ensure new pipeline outputs match old pipeline

**Tests to write**:
```javascript
describe('Comprehensive Schema Output Validation', () => {
  test('Contains all attributes from old expanded schema', () => {
    const oldExpanded = require('../../schemas/accordion-schema-autogenerated.json');
    const comprehensive = require('../../schemas/comprehensive/accordion-comprehensive.json');

    const oldKeys = Object.keys(oldExpanded.attributes);

    oldKeys.forEach(oldKey => {
      const newKey = convertToKebabCase(oldKey);
      expect(comprehensive.attributes).toHaveProperty(newKey);
    });
  });

  test('Default values match old schema', () => {
    const comprehensive = require('../../schemas/comprehensive/accordion-comprehensive.json');

    expect(comprehensive.defaultValues['title-icon-size']).toBe('16px');
    expect(comprehensive.defaultValues['border-top-color']).toBe('#dddddd');
  });

  test('All responsive attributes have device variants', () => {
    const comprehensive = require('../../schemas/comprehensive/accordion-comprehensive.json');

    Object.entries(comprehensive.attributes).forEach(([key, attr]) => {
      if (attr.responsive === true) {
        expect(attr.cssVarVariants).toHaveLength(3); // desktop, tablet, mobile
      }
    });
  });

  test('CSS output contains all selectors from old system', () => {
    const oldCSS = fs.readFileSync('../../css/generated/accordion_variables.scss', 'utf8');
    const newCSS = generateUniversalSCSS(comprehensive);

    const oldSelectors = extractSelectors(oldCSS);
    const newSelectors = extractSelectors(newCSS);

    oldSelectors.forEach(selector => {
      expect(newSelectors).toContain(selector);
    });
  });

  test('Responsive selectors exist for all responsive attributes', () => {
    const comprehensive = require('../../schemas/comprehensive/accordion-comprehensive.json');

    const responsiveAttrs = Object.values(comprehensive.attributes)
      .filter(attr => attr.responsive === true);

    responsiveAttrs.forEach(attr => {
      const tabletSelector = comprehensive.responsiveSelectors.find(
        rs => rs.device === 'tablet' && rs.vars.includes(`${attr.cssVar}-tablet`)
      );
      expect(tabletSelector).toBeDefined();
    });
  });
});
```

**Tasks**:
- [ ] Create comprehensive test suite
- [ ] Test attribute completeness
- [ ] Test default values
- [ ] Test responsive variants
- [ ] Test CSS selector generation
- [ ] Test delta calculation
- [ ] Test compression logic
- [ ] Run tests in CI/CD

---

### 5.2 Visual Regression Testing
**Tool**: Percy, BackstopJS, or manual comparison
**Purpose**: Ensure editor + frontend render identically

**Test cases**:
- [ ] Default accordion (no customizations)
- [ ] Accordion with theme applied
- [ ] Accordion with block customizations
- [ ] Responsive preview (tablet/mobile)
- [ ] Icon in all positions
- [ ] Active/inactive states
- [ ] Different border configurations

---

## Phase 6: Rollout (Week 6)

### 6.1 Build Script Integration
**File**: `package.json`

```json
{
  "scripts": {
    "schema:build": "node schemas/build-comprehensive.js",
    "schema:build:old": "node build-tools/schema-compiler.js",
    "schema:compare": "node schemas/tests/compare-outputs.js"
  }
}
```

**Main build script** (`schemas/build-comprehensive.js`):
```javascript
const { parseHTMLTemplate } = require('./parser/html-parser');
const { mergeStructureIntoSchema } = require('./parser/schema-merger');
const { createComprehensiveSchema } = require('./parser/comprehensive-expander');
const { generateUniversalSCSS } = require('./parser/scss-generator');
const { generateEditJS } = require('./generators/edit-generator');
const { generateSaveJS } = require('./generators/save-generator');

const BLOCKS = ['accordion', 'tabs', 'toc'];

BLOCKS.forEach(blockType => {
  console.log(`Building comprehensive schema for ${blockType}...`);

  // 1. Parse HTML structure
  const htmlPath = `./schemas/${blockType}-structure.html`;
  const structure = parseHTMLTemplate(htmlPath);

  // 2. Load minimal schema
  const minimalSchema = require(`./schemas/${blockType}.json`);

  // 3. Merge schema + structure
  const merged = mergeStructureIntoSchema(minimalSchema, structure);

  // 4. Create comprehensive schema
  const comprehensive = createComprehensiveSchema(merged);

  // 5. Write comprehensive schema
  fs.writeFileSync(
    `./schemas/comprehensive/${blockType}-comprehensive.json`,
    JSON.stringify(comprehensive, null, 2)
  );

  // 6. Generate SCSS
  const scss = generateUniversalSCSS(comprehensive);
  fs.writeFileSync(
    `./blocks/${blockType}/src/_comprehensive-variables.scss`,
    scss
  );

  // 7. Generate edit.js
  const editJS = generateEditJS(comprehensive);
  fs.writeFileSync(
    `./blocks/${blockType}/src/edit-generated.js`,
    editJS
  );

  // 8. Generate save.js
  const saveJS = generateSaveJS(comprehensive);
  fs.writeFileSync(
    `./blocks/${blockType}/src/save-generated.js`,
    saveJS
  );

  console.log(`✓ ${blockType} comprehensive schema built`);
});
```

---

### 6.2 Feature Flag (Gradual Rollout)
**File**: PHP feature flag

```php
// includes/feature-flags.php
define('GUTPLUS_USE_COMPREHENSIVE_SCHEMA', get_option('gutplus_use_comprehensive_schema', false));

if (GUTPLUS_USE_COMPREHENSIVE_SCHEMA) {
    require_once GUTPLUS_PATH . 'includes/block-registration-v2.php';
} else {
    require_once GUTPLUS_PATH . 'includes/block-registration.php';
}
```

**Rollout plan**:
1. **Phase 1**: Enable on test site only
2. **Phase 2**: Enable for new blocks only
3. **Phase 4**: Run migration script on existing blocks
4. **Phase 4**: Full switch after validation
5. **Phase 5**: Remove old system

---

## Success Criteria

- [ ] Zero manual edits needed in edit.js/save.js for new attributes
- [ ] Icon responsive preview works in editor
- [ ] All responsive attributes have tablet/mobile selectors
- [ ] Theme delta storage uses kebab-case keys
- [ ] Build time < 5 seconds
- [ ] Comprehensive schema contains all attributes
- [ ] CSS output contains all necessary selectors and variables
- [ ] Visual tests pass (if comparing to old system)
- [ ] No synchronization issues between files

---

## Files to Create

### ⚠️ Critical Path (Must Build First)
- [ ] `schemas/parser/html-parser.js` **← START HERE**
- [ ] `schemas/parser/comprehensive-expander.js` **← ORCHESTRATOR**

### Parsers
- [ ] `schemas/parser/schema-merger.js`
- [ ] Update `schemas/parser/icon-expander.js` (kebab-case output)
- [ ] Update `schemas/parser/typography-expander.js` (kebab-case output)
- [ ] Update `schemas/parser/border-expander.js` (kebab-case output)
- [ ] Update `schemas/parser/box-expander.js` (kebab-case output)
- [ ] Update `schemas/parser/responsive-expander.js` (kebab-case support)

### Generators
- [ ] `schemas/parser/scss-generator.js`
- [ ] `schemas/generators/edit-generator.js`
- [ ] `schemas/generators/save-generator.js`

### Utilities
- [ ] `shared/src/utils/css-compressor.js`
- [ ] Update `shared/src/utils/delta-calculator.js` (kebab-case support)

### Testing
- [ ] `schemas/tests/html-parser.test.js`
- [ ] `schemas/tests/output-comparison.test.js`
- [ ] `schemas/tests/delta-calculator.test.js`
- [ ] `schemas/tests/css-compressor.test.js`

### Build Scripts
- [ ] `schemas/build-comprehensive.js` (main orchestrator)

---

## Timeline

| Phase | Duration | Risk Level | Blockers |
|-------|----------|------------|----------|
| 1. Parser Infrastructure | 1-2 weeks | **HIGH** | HTML parser complexity |
| 2. CSS Generation | 1 week | MEDIUM | Parser completion |
| 3. Edit/Save Generation | 1-2 weeks | MEDIUM | CSS generator |
| 4. Delta Calculator | 1 week | LOW | Comprehensive schema |
| 5. Testing | 1 week | **CRITICAL** | All above |
| 6. Rollout | 1 week | HIGH | Testing validation |
| **Total** | **6-8 weeks** | | |

---

## Risk Mitigation

1. **HTML Parser is Critical Path** - Everything depends on it
   - Build parser first
   - Test thoroughly before proceeding
   - Have rollback plan

2. **Build Output Comparison**
   - Run old + new systems in parallel (if old system exists)
   - Compare outputs continuously
   - Catch divergence early

3. **Feature Flag Everything**
   - Easy rollback if issues found
   - Gradual rollout per block type
   - Can disable quickly in production

---

## Next Immediate Step

**START HERE**: Build `html-parser.js`

This is the foundation. Everything else depends on parsing HTML templates correctly.

Once HTML parser works, build comprehensive-expander.js to orchestrate everything.
