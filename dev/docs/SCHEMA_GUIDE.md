# Schema System Developer Guide

**Version:** 1.0.0
**Last Updated:** 2025-12-07
**Status:** Implementation Complete

---

## Table of Contents

1. [Introduction](#introduction)
2. [Structure Schema Reference](#structure-schema-reference)
3. [Attribute Schema Updates](#attribute-schema-updates)
4. [Adding New Elements](#adding-new-elements)
5. [Adding New Attributes](#adding-new-attributes)
6. [Troubleshooting](#troubleshooting)
7. [Migration from Old System](#migration-from-old-system)

---

## Introduction

### What are Structure Schemas?

**Structure schemas** define the **HTML elements** that make up a block's frontend and editor markup. They document:

- **Element IDs** - Unique identifiers for each HTML element (e.g., `title`, `content`, `icon`)
- **HTML tags** - The actual tag used (`div`, `button`, `span`, etc.)
- **CSS classes** - Class names applied to elements (`.accordion-title`, `.tab-button`)
- **Parent-child relationships** - How elements are nested
- **ARIA attributes** - Accessibility attributes (`role`, `aria-expanded`, etc.)
- **Conditional rendering** - When elements appear or change (`{showIcon}`)
- **Data attributes** - Custom data attributes (`data-accordion-id`)

**File naming convention:** `schemas/{block}-structure.json`

**Example files:**
- `schemas/accordion-structure.json`
- `schemas/tabs-structure.json`
- `schemas/toc-structure.json`

### What are Attribute Schemas?

**Attribute schemas** define the **styling properties and customization options** available in the block editor. They document:

- **Attribute definitions** - Name, type, default value
- **Control types** - UI controls (`ColorPicker`, `RangeControl`, `SelectControl`)
- **Groups** - Organization panels (`headerColors`, `typography`, `borders`)
- **Themeable settings** - Which attributes can be saved as themes
- **CSS mappings** - How attributes map to CSS properties
- **Element references** - Which HTML elements each attribute styles

**File naming convention:** `schemas/{block}.json`

**Example files:**
- `schemas/accordion.json`
- `schemas/tabs.json`
- `schemas/toc.json`

### Why Two Files?

The dual-schema architecture provides **separation of concerns**:

#### Structure Schema (HTML/Markup)
- Answers: "What elements exist?"
- Documents: Physical DOM structure
- Changes when: Adding/removing HTML elements
- Used by: HTML validation, CSS generation, documentation

#### Attribute Schema (Styling/Theming)
- Answers: "What can be customized?"
- Documents: Customization options and styling
- Changes when: Adding/removing style controls
- Used by: Block editor panels, theme system, CSS generation

#### Benefits of Separation

1. **Build-time validation** - The build process can verify that:
   - Every attribute references a valid element (`appliesTo: "title"`)
   - Every element's styles are defined (`appliesStyles: ["titleColor", ...]`)
   - CSS selectors match actual HTML class names
   - No orphaned or broken references exist

2. **Single source of truth** - HTML structure is documented once:
   ```
   Structure Schema → CSS Generator → _theme-generated.scss
                   → Documentation → SCHEMA_GUIDE.md
                   → Validation → Build process
   ```

3. **Impossible to have mismatches** - Before this system:
   ```json
   // Schema says:
   "cssSelector": ".accordion-header"

   // HTML actually renders:
   <button className="accordion-title">

   // Result: CSS never applies!
   ```

   Now the build fails if references don't match.

4. **Clear documentation** - Structure schemas serve as living documentation of block HTML structure

---

## Structure Schema Reference

### File Format

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "blockType": "accordion",
  "version": "1.0.0",
  "description": "HTML structure definition for Accordion block",

  "elements": {
    "elementId": { /* Element definition */ }
  },

  "hierarchy": {
    "root": "wrapper",
    "tree": { /* Visual tree structure */ }
  }
}
```

### Element Definition Format

Each element in the `elements` object follows this structure:

```typescript
{
  "id": string,              // Must match the object key
  "tag": string,             // HTML tag: "div", "button", "span", etc.
  "className": string,       // CSS class(es): "accordion-title" or "class1 class2"
  "description": string,     // Human-readable purpose description
  "children"?: string[],     // Array of child element IDs
  "attributes"?: object,     // HTML attributes
  "conditionalRender"?: string,       // Render condition
  "conditionalClass"?: object,        // Conditional CSS classes
  "conditionalAttribute"?: object,    // Conditional HTML attributes
  "conditionalTag"?: object,          // Conditional tag wrapping
  "renderVariant"?: object,           // Alternative rendering
  "aria"?: object,                    // ARIA accessibility attributes
  "contentType"?: string,             // WordPress content type
  "source"?: string,                  // Attribute source reference
  "appliesStyles": string[]           // Array of attribute names
}
```

### Field Descriptions

#### Required Fields

**`id`** - Element identifier
```json
{
  "id": "title"
}
```
Must match the object key for consistency.

**`tag`** - HTML tag name
```json
{
  "tag": "button"
}
```
Common values: `"div"`, `"button"`, `"span"`, `"a"`, `"ul"`, `"li"`, `"img"`

**`className`** - CSS class name(s)
```json
{
  "className": "accordion-title"
}
```
Multiple classes are space-separated: `"accordion-item is-open"`

**`description`** - Purpose of the element
```json
{
  "description": "Clickable title/header button"
}
```
Used in documentation and for developer reference.

**`appliesStyles`** - Style attributes that apply to this element
```json
{
  "appliesStyles": [
    "titleColor",
    "titleBackgroundColor",
    "titleFontSize",
    "titleFontWeight"
  ]
}
```
Array of attribute names from the attribute schema. Leave empty `[]` if no styles apply.

#### Optional Fields

**`children`** - Child element IDs
```json
{
  "children": ["titleText", "icon"]
}
```
Defines parent-child relationships in the DOM tree.

**`attributes`** - HTML attributes
```json
{
  "attributes": {
    "type": "button",
    "data-accordion-id": "{accordionId}"
  }
}
```
Static values or dynamic references using `{attributeName}` syntax.

**`conditionalRender`** - Render only if condition is true
```json
{
  "conditionalRender": "{showIcon}"
}
```
Element only renders when the referenced attribute is truthy.

**`conditionalClass`** - Add classes based on conditions
```json
{
  "conditionalClass": {
    "is-open": "{initiallyOpen}",
    "is-active": "{isActive}"
  }
}
```
Classes are added when conditions are truthy.

**`conditionalAttribute`** - Add attributes based on conditions
```json
{
  "conditionalAttribute": {
    "hidden": "{!initiallyOpen}",
    "disabled": "{isDisabled}"
  }
}
```
Attributes are added when conditions are truthy.

**`conditionalTag`** - Wrap element with another tag
```json
{
  "conditionalTag": {
    "when": "headingLevel !== 'none'",
    "wrapWith": "{headingLevel}",
    "wrapClassName": "accordion-heading"
  }
}
```
Wraps the element in another tag (e.g., `<h2>`) when condition is met.

**`renderVariant`** - Alternative rendering based on condition
```json
{
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
}
```
Renders a different element structure when condition is true.

**`aria`** - ARIA accessibility attributes
```json
{
  "aria": {
    "expanded": "{!initiallyOpen}",
    "controls": "{accordionId}-content",
    "role": "region"
  }
}
```
Becomes `aria-expanded`, `aria-controls`, etc. in HTML.

**`contentType`** - WordPress block content type
```json
{
  "contentType": "RichText"
}
```
Common values: `"RichText"`, `"InnerBlocks"`, `"static"`, `"dynamic"`

**`source`** - Attribute data source
```json
{
  "source": "{title}"
}
```
References which attribute provides the content.

### Complete Element Example

```json
{
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
  }
}
```

### Common Patterns

#### Container Element
```json
{
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
  }
}
```

#### Button/Interactive Element
```json
{
  "button": {
    "id": "button",
    "tag": "button",
    "className": "tab-button",
    "description": "Tab navigation button",
    "attributes": {
      "type": "button",
      "role": "tab"
    },
    "aria": {
      "selected": "{isActive}",
      "controls": "{tabId}-panel"
    },
    "appliesStyles": [
      "buttonColor",
      "buttonBackgroundColor",
      "buttonFontSize"
    ]
  }
}
```

#### Conditionally Rendered Element
```json
{
  "icon": {
    "id": "icon",
    "tag": "span",
    "className": "accordion-icon",
    "description": "Expand/collapse icon",
    "conditionalRender": "{showIcon}",
    "attributes": {
      "aria-hidden": "true"
    },
    "conditionalClass": {
      "is-rotated": "{isOpen}"
    },
    "appliesStyles": ["iconColor", "iconSize"]
  }
}
```

#### Content/Text Element
```json
{
  "titleText": {
    "id": "titleText",
    "tag": "span",
    "className": "accordion-title-text",
    "description": "Title text content (editable)",
    "contentType": "RichText",
    "source": "{title}",
    "appliesStyles": []
  }
}
```

---

## Attribute Schema Updates

### New `appliesTo` Field

The `appliesTo` field replaces the old `cssSelector` field and references elements by their **ID** from the structure schema.

#### Before (Old System)
```json
{
  "titleColor": {
    "type": "string",
    "default": "#333333",
    "cssVar": "title-color",
    "cssSelector": ".accordion-title",  // ← DEPRECATED
    "cssProperty": "color"
  }
}
```

#### After (New System)
```json
{
  "titleColor": {
    "type": "string",
    "default": "#333333",
    "cssVar": "title-color",
    "appliesTo": "title",  // ← NEW: References element ID
    "cssProperty": "color"
  }
}
```

### Required Fields for Themeable Attributes

All themeable attributes must have:

```json
{
  "attributeName": {
    "themeable": true,       // ← Must be true
    "appliesTo": "elementId", // ← NEW REQUIRED
    "cssVar": "var-name",    // ← CSS variable name
    "cssProperty": "color"   // ← CSS property to set
  }
}
```

### Deprecated `cssSelector` Field

The `cssSelector` field is **deprecated** and should be removed from all schemas.

**Why deprecated?**
- CSS selectors can be wrong (`.accordion-header` vs `.accordion-title`)
- No validation that selectors match actual HTML
- Prone to typos and mismatches
- Duplicates information (class name exists in structure schema)

**Migration path:**
1. Find the element being styled in the structure schema
2. Use its `id` in the `appliesTo` field
3. Remove the `cssSelector` field

### How to Reference Elements

#### Step 1: Find the Element in Structure Schema

```json
// schemas/accordion-structure.json
{
  "elements": {
    "title": {  // ← This is the element ID
      "id": "title",
      "tag": "button",
      "className": "accordion-title",
      "appliesStyles": ["titleColor", "titleFontSize"]
    }
  }
}
```

#### Step 2: Use Element ID in `appliesTo`

```json
// schemas/accordion.json
{
  "attributes": {
    "titleColor": {
      "themeable": true,
      "appliesTo": "title",  // ← Use the element ID here
      "cssVar": "title-color",
      "cssProperty": "color"
    }
  }
}
```

#### Step 3: Add Attribute to Element's `appliesStyles`

```json
// schemas/accordion-structure.json
{
  "elements": {
    "title": {
      "appliesStyles": [
        "titleColor",  // ← Add attribute name here
        "titleFontSize"
      ]
    }
  }
}
```

### Examples from Real Schemas

#### Accordion Title Styling
```json
// Attribute schema
{
  "titleColor": {
    "type": "string",
    "default": "#333333",
    "cssVar": "accordion-title-color",
    "group": "headerColors",
    "label": "Title Color",
    "description": "Text color for the accordion title",
    "themeable": true,
    "control": "ColorPicker",
    "appliesTo": "title",
    "cssProperty": "color"
  }
}

// Structure schema
{
  "title": {
    "id": "title",
    "tag": "button",
    "className": "accordion-title",
    "appliesStyles": ["titleColor", /* ... */]
  }
}
```

#### Tabs Button Border
```json
// Attribute schema
{
  "buttonBorderColor": {
    "type": "string",
    "default": null,
    "cssVar": "tabs-button-border-color",
    "group": "buttonBorders",
    "label": "Border Color",
    "themeable": true,
    "control": "ColorPicker",
    "appliesTo": "button",
    "cssProperty": "border-color"
  }
}
```

#### TOC Link Hover
```json
// Attribute schema
{
  "linkHoverColor": {
    "type": "string",
    "default": "#005177",
    "cssVar": "toc-link-hover-color",
    "group": "contentColors",
    "label": "Link Hover Color",
    "themeable": true,
    "control": "ColorPicker",
    "appliesTo": "link",
    "cssProperty": "color"
  }
}
```

---

## Adding New Elements

Follow these steps to add a new HTML element to a block:

### Step 1: Define in Structure Schema

Add the element definition to `schemas/{block}-structure.json`:

```json
{
  "elements": {
    "newElement": {
      "id": "newElement",
      "tag": "div",
      "className": "accordion-new-element",
      "description": "Description of what this element does",
      "children": [],
      "appliesStyles": []
    }
  }
}
```

**Checklist:**
- [ ] Unique `id` that matches the key
- [ ] Appropriate `tag` (div, span, button, etc.)
- [ ] Descriptive `className` following naming conventions
- [ ] Clear `description`
- [ ] `children` array (empty if no children)
- [ ] `appliesStyles` array (empty initially)
- [ ] Add to parent's `children` array

### Step 2: Add to HTML (edit.js and save.js)

#### In `blocks/{block}/src/edit.js`:

```javascript
// Add to the JSX structure
<div className="accordion-new-element">
  {/* Element content */}
</div>
```

#### In `blocks/{block}/src/save.js`:

```javascript
// Add the same structure
<div className="accordion-new-element">
  {/* Element content */}
</div>
```

**Important:** The `className` must **exactly match** the structure schema.

### Step 3: Run Validation

```bash
npm run schema:validate-structure
```

This validates:
- Element exists in structure schema
- Class names match between schema and HTML
- Parent-child relationships are correct
- All references are valid

**Expected output:**
```
✓ Accordion structure schema is valid
✓ All elements referenced exist
✓ All children references are valid
✓ All appliesStyles references are valid
```

### Step 4: Build

```bash
npm run build
```

The build process will:
1. Validate JSON syntax
2. Validate structure and cross-references
3. Generate CSS from schemas
4. Compile JavaScript
5. Rename CSS files

**If build fails:**
- Check error messages for specific issues
- Verify class names match exactly
- Ensure all references are valid
- See [Troubleshooting](#troubleshooting) section

### Complete Example: Adding a Subtitle Element

#### 1. Structure Schema (`accordion-structure.json`)
```json
{
  "elements": {
    "title": {
      "children": ["titleText", "subtitle", "icon"]  // ← Add to parent
    },
    "subtitle": {  // ← New element
      "id": "subtitle",
      "tag": "span",
      "className": "accordion-subtitle",
      "description": "Optional subtitle text below the main title",
      "contentType": "RichText",
      "source": "{subtitle}",
      "conditionalRender": "{showSubtitle}",
      "appliesStyles": [
        "subtitleColor",
        "subtitleFontSize"
      ]
    }
  }
}
```

#### 2. Edit.js
```javascript
<button className="accordion-title">
  <span className="accordion-title-text">{title}</span>
  {showSubtitle && (
    <span className="accordion-subtitle">{subtitle}</span>
  )}
  {showIcon && <span className="accordion-icon">▾</span>}
</button>
```

#### 3. Save.js
```javascript
<button className="accordion-title">
  <span className="accordion-title-text">{title}</span>
  {showSubtitle && (
    <span className="accordion-subtitle">{subtitle}</span>
  )}
  {showIcon && <span className="accordion-icon">▾</span>}
</button>
```

#### 4. Validate and Build
```bash
npm run schema:validate-structure  # Should pass
npm run build                      # Should succeed
```

---

## Adding New Attributes

Follow these steps to add a new styling attribute:

### Step 1: Define in Attribute Schema

Add the attribute to `schemas/{block}.json`:

```json
{
  "attributes": {
    "newAttribute": {
      "type": "string",
      "default": "#000000",
      "cssVar": "new-attribute",
      "group": "appropriateGroup",
      "label": "New Attribute Label",
      "description": "What this attribute controls",
      "themeable": true,
      "control": "ColorPicker",
      "order": 99,
      "pago": "nao",
      "appliesTo": "targetElement",
      "cssProperty": "color"
    }
  }
}
```

**Checklist:**
- [ ] Unique attribute name
- [ ] Appropriate `type` (string, number, boolean, object, array)
- [ ] Sensible `default` value
- [ ] Unique `cssVar` name
- [ ] Assigned to appropriate `group`
- [ ] Clear `label` and `description`
- [ ] `themeable: true` if should be saveable in themes
- [ ] Appropriate `control` type
- [ ] `appliesTo` references valid element ID
- [ ] `cssProperty` is valid CSS property

### Step 2: Add `appliesTo` Reference

The `appliesTo` field must reference an element ID from the structure schema:

```json
{
  "newAttribute": {
    "appliesTo": "title",  // ← Must exist in structure schema
    "cssProperty": "color"
  }
}
```

### Step 3: Update Element's `appliesStyles` Array

In `schemas/{block}-structure.json`, add the attribute to the target element:

```json
{
  "elements": {
    "title": {
      "appliesStyles": [
        "titleColor",
        "titleFontSize",
        "newAttribute"  // ← Add here
      ]
    }
  }
}
```

### Step 4: Run Validation

```bash
npm run schema:validate-structure
```

This validates:
- `appliesTo` references an existing element
- Element's `appliesStyles` includes the attribute
- Bidirectional references are valid

**Expected output:**
```
✓ Attribute "newAttribute" references element "title" ✓
✓ Element "title" includes "newAttribute" in appliesStyles ✓
✓ All cross-references are valid
```

### Step 5: Build

```bash
npm run build
```

The build will:
1. Validate the new attribute
2. Generate CSS rules for it
3. Update `_theme-generated.scss`
4. Compile all assets

**Generated CSS example:**
```scss
.accordion-title {
  color: var(--accordion-new-attribute, #000000);
}
```

### Complete Example: Adding Icon Hover Color

#### 1. Attribute Schema (`accordion.json`)
```json
{
  "attributes": {
    "iconHoverColor": {
      "type": "string",
      "default": "#333333",
      "cssVar": "accordion-icon-hover-color",
      "group": "icon",
      "label": "Icon Hover Color",
      "description": "Color of icon when hovering",
      "themeable": true,
      "control": "ColorPicker",
      "order": 24,
      "pago": "nao",
      "appliesTo": "icon",
      "cssProperty": "color"
    }
  }
}
```

#### 2. Structure Schema (`accordion-structure.json`)
```json
{
  "elements": {
    "icon": {
      "appliesStyles": [
        "iconColor",
        "iconSize",
        "iconRotation",
        "iconHoverColor"  // ← Add here
      ]
    }
  }
}
```

#### 3. Validate
```bash
npm run schema:validate-structure
# ✓ All validations passed
```

#### 4. Build
```bash
npm run build
# Generates CSS:
# .accordion-icon:hover {
#   color: var(--accordion-icon-hover-color, #333333);
# }
```

---

## Troubleshooting

### Common Validation Errors

#### Error: Element Reference Not Found

```
❌ Attribute "titleColor" references element "title-button"
   but structure schema only has: ["wrapper", "item", "title", "content"]
```

**Cause:** The `appliesTo` field references a non-existent element ID.

**Fix:**
```json
// WRONG
{
  "titleColor": {
    "appliesTo": "title-button"  // ← Element doesn't exist
  }
}

// CORRECT
{
  "titleColor": {
    "appliesTo": "title"  // ← Use actual element ID
  }
}
```

**Steps:**
1. Check structure schema element IDs: `cat schemas/accordion-structure.json | jq '.elements | keys'`
2. Update `appliesTo` to use correct ID
3. Run validation: `npm run schema:validate-structure`

#### Error: Missing Attribute Reference

```
❌ Element "icon" lists "iconHoverColor" in appliesStyles
   but attribute schema doesn't define "iconHoverColor"
```

**Cause:** Element's `appliesStyles` array references an attribute that doesn't exist.

**Fix:**
```json
// Structure schema - WRONG
{
  "icon": {
    "appliesStyles": [
      "iconColor",
      "iconHoverColor"  // ← Attribute doesn't exist
    ]
  }
}

// Either: Add the attribute to attribute schema
// Or: Remove from appliesStyles array
{
  "icon": {
    "appliesStyles": [
      "iconColor"  // ← Removed non-existent attribute
    ]
  }
}
```

**Steps:**
1. Check if attribute should exist: `cat schemas/accordion.json | jq '.attributes | keys'`
2. Either add the attribute or remove from `appliesStyles`
3. Run validation: `npm run schema:validate-structure`

#### Error: Missing appliesStyles Entry

```
❌ Attribute "borderColor" has appliesTo "item"
   but element "item" doesn't include "borderColor" in appliesStyles
```

**Cause:** Bidirectional reference is broken - attribute references element, but element doesn't list attribute.

**Fix:**
```json
// Structure schema - WRONG
{
  "item": {
    "appliesStyles": [
      "borderWidth",
      "borderStyle"
      // ← Missing "borderColor"
    ]
  }
}

// CORRECT
{
  "item": {
    "appliesStyles": [
      "borderColor",  // ← Add missing attribute
      "borderWidth",
      "borderStyle"
    ]
  }
}
```

**Steps:**
1. Find which element the attribute targets: `cat schemas/accordion.json | jq '.attributes.borderColor.appliesTo'`
2. Add attribute name to that element's `appliesStyles` array
3. Run validation: `npm run schema:validate-structure`

#### Error: CSS Selector Deprecated

```
⚠️  Attribute "titleColor" has cssSelector ".accordion-header"
    This field is deprecated. Use "appliesTo": "elementId" instead
```

**Cause:** Old `cssSelector` field is still present.

**Fix:**
```json
// WRONG
{
  "titleColor": {
    "cssSelector": ".accordion-header",  // ← Remove this
    "cssVar": "title-color",
    "cssProperty": "color"
  }
}

// CORRECT
{
  "titleColor": {
    "appliesTo": "title",  // ← Add this
    "cssVar": "title-color",
    "cssProperty": "color"
  }
}
```

**Steps:**
1. Find element that matches old selector class name
2. Add `"appliesTo": "elementId"`
3. Remove `"cssSelector"` field
4. Run validation: `npm run schema:validate-structure`

### How to Fix Element Reference Errors

#### Problem: Can't Find Correct Element ID

**Step 1:** List all available elements
```bash
cat schemas/accordion-structure.json | jq '.elements | keys'
# Output: ["wrapper", "item", "title", "titleText", "icon", "content"]
```

**Step 2:** Find element by class name
```bash
cat schemas/accordion-structure.json | jq '.elements[] | select(.className | contains("title"))'
# Shows all elements with "title" in class name
```

**Step 3:** Check element details
```bash
cat schemas/accordion-structure.json | jq '.elements.title'
# Shows full definition of "title" element
```

**Step 4:** Update attribute
```json
{
  "titleColor": {
    "appliesTo": "title"  // ← Use the ID you found
  }
}
```

#### Problem: Element Exists But Validation Still Fails

**Possible causes:**
1. Typo in element ID: `"titel"` vs `"title"`
2. Case sensitivity: `"Title"` vs `"title"`
3. Extra spaces: `"title "` vs `"title"`

**Debug:**
```bash
# Check exact spelling
cat schemas/accordion.json | jq '.attributes.titleColor.appliesTo'
cat schemas/accordion-structure.json | jq '.elements | keys'

# Compare visually - they must match exactly
```

### How to Fix Attribute Reference Errors

#### Problem: Attribute Missing from appliesStyles

**Step 1:** Check which element attribute targets
```bash
cat schemas/accordion.json | jq '.attributes.titleColor.appliesTo'
# Output: "title"
```

**Step 2:** Check element's current appliesStyles
```bash
cat schemas/accordion-structure.json | jq '.elements.title.appliesStyles'
# Output: ["titleFontSize", "titleAlignment"]  ← Missing "titleColor"
```

**Step 3:** Add to appliesStyles array
```json
{
  "title": {
    "appliesStyles": [
      "titleColor",      // ← Add this
      "titleFontSize",
      "titleAlignment"
    ]
  }
}
```

**Step 4:** Validate
```bash
npm run schema:validate-structure
# ✓ Should pass now
```

#### Problem: Too Many Attributes in appliesStyles

**Symptom:**
```
❌ Element "title" applies attribute "oldAttribute"
   but attribute schema doesn't define it
```

**Cause:** Attribute was removed from attribute schema but still listed in structure.

**Fix:**
```json
// Structure schema
{
  "title": {
    "appliesStyles": [
      "titleColor",
      "oldAttribute"  // ← Remove this
    ]
  }
}
```

### CSS Generation Issues

#### Problem: Wrong CSS Selector Generated

**Symptom:** CSS file has `.wrong-class` but HTML has `.correct-class`

**Cause:** Structure schema has incorrect `className`

**Debug:**
```bash
# Check structure schema
cat schemas/accordion-structure.json | jq '.elements.title.className'

# Check actual HTML in save.js
grep -A 5 "accordion-title" blocks/accordion/src/save.js
```

**Fix:**
```json
// Structure schema - WRONG
{
  "title": {
    "className": "accordion-header"  // ← Doesn't match HTML
  }
}

// CORRECT
{
  "title": {
    "className": "accordion-title"  // ← Matches HTML exactly
  }
}
```

**Rebuild:**
```bash
npm run build
# CSS will now use correct selector
```

#### Problem: CSS Variable Not Applying

**Symptom:** CSS variable is defined but not working

**Debug checklist:**
1. Attribute has `cssVar` defined: ✓
2. Attribute has `cssProperty` defined: ✓
3. Attribute has `appliesTo` defined: ✓
4. Element exists in structure: ✓
5. Element's `appliesStyles` includes attribute: ✓
6. Build completed successfully: ✓

**Check generated CSS:**
```bash
cat blocks/accordion/src/_theme-generated.scss | grep "title-color"
```

**Expected:**
```scss
.accordion-title {
  color: var(--accordion-title-color, #333333);
}
```

**If missing:** Rebuild after fixing schema
```bash
npm run build
```

---

## Migration from Old System

### What Changed?

The old system used CSS selectors directly in attribute schemas:

```json
// OLD SYSTEM
{
  "titleColor": {
    "cssSelector": ".accordion-title",  // ← Direct CSS selector
    "cssProperty": "color"
  }
}
```

**Problems:**
- Selectors could be wrong (typos, mismatches)
- No validation that selector matches HTML
- Editor worked (inline styles) but frontend failed (CSS selectors)
- Hard to debug selector mismatches

The new system uses element IDs:

```json
// NEW SYSTEM - Attribute Schema
{
  "titleColor": {
    "appliesTo": "title",  // ← Element ID reference
    "cssProperty": "color"
  }
}

// NEW SYSTEM - Structure Schema
{
  "elements": {
    "title": {
      "id": "title",
      "className": "accordion-title",  // ← Actual CSS class
      "appliesStyles": ["titleColor"]
    }
  }
}
```

**Benefits:**
- Build validates that `"title"` element exists
- Build validates that element includes `titleColor` in `appliesStyles`
- CSS generator uses actual class name from structure
- Impossible to have mismatches

### How to Update Existing Schemas

#### Step 1: Create Structure Schema

If your block doesn't have a structure schema yet:

1. Read your block's `save.js` file
2. Document every HTML element
3. Create `schemas/{block}-structure.json` following the format
4. See [Structure Schema Reference](#structure-schema-reference)

#### Step 2: Map CSS Selectors to Element IDs

For each attribute with `cssSelector`:

```json
// Old attribute
{
  "titleColor": {
    "cssSelector": ".accordion-title"  // ← Find this class
  }
}
```

Find the matching element in structure schema:

```json
// Structure schema
{
  "elements": {
    "title": {  // ← This is the ID you need
      "className": "accordion-title"  // ← Matches the selector
    }
  }
}
```

#### Step 3: Update Attribute Schema

Replace `cssSelector` with `appliesTo`:

```json
// BEFORE
{
  "titleColor": {
    "type": "string",
    "default": "#333333",
    "cssVar": "title-color",
    "cssSelector": ".accordion-title",  // ← REMOVE
    "cssProperty": "color"
  }
}

// AFTER
{
  "titleColor": {
    "type": "string",
    "default": "#333333",
    "cssVar": "title-color",
    "appliesTo": "title",  // ← ADD (use element ID)
    "cssProperty": "color"
  }
}
```

#### Step 4: Update Structure Schema

Add attribute to element's `appliesStyles`:

```json
{
  "elements": {
    "title": {
      "id": "title",
      "className": "accordion-title",
      "appliesStyles": [
        "titleColor"  // ← ADD attribute name
      ]
    }
  }
}
```

#### Step 5: Validate

```bash
npm run schema:validate-structure
```

Fix any errors reported.

#### Step 6: Build

```bash
npm run build
```

Verify CSS is generated correctly:

```bash
cat blocks/{block}/src/_theme-generated.scss
```

### Breaking Changes

#### 1. cssSelector Field Removed

**Before:**
```json
{
  "titleColor": {
    "cssSelector": ".accordion-title"
  }
}
```

**After:**
```json
{
  "titleColor": {
    "appliesTo": "title"
  }
}
```

**Migration:** Replace all `cssSelector` with `appliesTo` using element IDs

#### 2. appliesTo Field Required

**Before:**
```json
{
  "titleColor": {
    "themeable": true,
    "cssVar": "title-color"
    // cssSelector was optional
  }
}
```

**After:**
```json
{
  "titleColor": {
    "themeable": true,
    "cssVar": "title-color",
    "appliesTo": "title"  // ← NOW REQUIRED
  }
}
```

**Migration:** Add `appliesTo` to all themeable attributes

#### 3. Build Validation Required

**Before:**
- Schemas could have invalid references
- Build would succeed even with mismatches
- Errors only discovered at runtime

**After:**
- Build fails if references are invalid
- All cross-references validated
- Impossible to deploy broken schemas

**Migration:** Fix all validation errors before building

#### 4. Structure Schema Required

**Before:**
- Only attribute schema existed
- HTML structure was implicit

**After:**
- Both schemas required
- HTML structure is explicit
- Build fails without structure schema

**Migration:** Create structure schema for each block

### Migration Checklist

For each block (accordion, tabs, toc):

- [ ] Create structure schema (`{block}-structure.json`)
  - [ ] Document all HTML elements
  - [ ] Add all class names
  - [ ] Define parent-child relationships
  - [ ] Add ARIA attributes
  - [ ] Add conditional rendering logic
- [ ] Update attribute schema (`{block}.json`)
  - [ ] Add `appliesTo` to all themeable attributes
  - [ ] Remove all `cssSelector` fields
  - [ ] Verify `cssVar` and `cssProperty` exist
- [ ] Update structure schema
  - [ ] Add attributes to `appliesStyles` arrays
  - [ ] Verify all references are bidirectional
- [ ] Validate schemas
  - [ ] Run `npm run schema:validate-structure`
  - [ ] Fix all errors
  - [ ] Verify no warnings
- [ ] Build and test
  - [ ] Run `npm run build`
  - [ ] Check generated CSS
  - [ ] Test in editor
  - [ ] Test on frontend
  - [ ] Verify themes work

### Example Migration: Complete Workflow

#### Starting Point (Old System)

```json
// schemas/accordion.json (old)
{
  "attributes": {
    "titleColor": {
      "cssSelector": ".accordion-title",
      "cssProperty": "color"
    },
    "borderColor": {
      "cssSelector": ".accordion-item",
      "cssProperty": "border-color"
    }
  }
}
```

#### Step 1: Create Structure Schema

```json
// schemas/accordion-structure.json (new)
{
  "blockType": "accordion",
  "version": "1.0.0",
  "elements": {
    "item": {
      "id": "item",
      "className": "accordion-item",
      "children": ["title"],
      "appliesStyles": []  // Will add later
    },
    "title": {
      "id": "title",
      "className": "accordion-title",
      "appliesStyles": []  // Will add later
    }
  }
}
```

#### Step 2: Update Attribute Schema

```json
// schemas/accordion.json (updated)
{
  "attributes": {
    "titleColor": {
      "appliesTo": "title",  // ← Changed from cssSelector
      "cssProperty": "color"
    },
    "borderColor": {
      "appliesTo": "item",  // ← Changed from cssSelector
      "cssProperty": "border-color"
    }
  }
}
```

#### Step 3: Update appliesStyles

```json
// schemas/accordion-structure.json (updated)
{
  "elements": {
    "item": {
      "appliesStyles": ["borderColor"]  // ← Added
    },
    "title": {
      "appliesStyles": ["titleColor"]  // ← Added
    }
  }
}
```

#### Step 4: Validate

```bash
npm run schema:validate-structure
# ✓ Accordion structure schema is valid
# ✓ All cross-references validated
# ✓ All appliesTo references exist
# ✓ All appliesStyles references exist
```

#### Step 5: Build

```bash
npm run build
# Compiling schemas...
# Generating CSS...
# ✓ Build completed successfully
```

#### Step 6: Verify Generated CSS

```scss
// blocks/accordion/src/_theme-generated.scss (generated)
.accordion-title {
  color: var(--accordion-title-color);
}

.accordion-item {
  border-color: var(--accordion-border-color);
}
```

**Migration complete!**

---

## Additional Resources

### Related Documentation

- **SINGLE_SOURCE.md** - Complete architecture specification
- **Schema validation** - `build-tools/validate-schema-structure.js`
- **CSS generation** - `build-tools/schema-compiler.js`

### Quick Reference Commands

```bash
# Validate structure schemas
npm run schema:validate-structure

# Validate JSON syntax
npm run schema:validate

# Build everything
npm run build

# Watch mode during development
npm run start

# List all elements in a schema
cat schemas/accordion-structure.json | jq '.elements | keys'

# List all attributes
cat schemas/accordion.json | jq '.attributes | keys'

# Check element details
cat schemas/accordion-structure.json | jq '.elements.title'

# Check attribute details
cat schemas/accordion.json | jq '.attributes.titleColor'

# View generated CSS
cat blocks/accordion/src/_theme-generated.scss
```

### Getting Help

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Run validation: `npm run schema:validate-structure`
3. Check error messages for specific guidance
4. Verify schemas match specification in this guide
5. Compare with working examples from accordion/tabs/toc

---

**Document Version:** 1.0.0
**Last Updated:** 2025-12-07
**Maintainer:** Development Team
