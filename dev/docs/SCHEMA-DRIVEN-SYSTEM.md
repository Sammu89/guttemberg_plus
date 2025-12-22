# Schema-Driven Sidebar System

**Complete Guide to Guttemberg Plus Schema Architecture**

---

## 🎯 Overview

Guttemberg Plus uses a **100% schema-driven architecture** where the JSON schema is the **Single Source of Truth** for all block configuration, styling, and sidebar generation.

### What This Means

- ✅ **Add** an attribute to schema → Build → Appears in sidebar automatically
- ✅ **Modify** an attribute → Build → Updates everywhere automatically
- ✅ **Delete** an attribute → Build → Removed everywhere automatically
- ✅ **No manual panel lists** in edit.js files
- ✅ **No hardcoded configurations**
- ✅ **CSS variables auto-generated** from schema

---

## 📋 Schema as Single Source of Truth

### What Schema Controls (100%)

**1. Sidebar Panels**
- Panel names (`groups.title`)
- Panel order (`groups.order`)
- Panel initial state (`groups.initialOpen`)
- Panel premium flag (`groups.pago`)

**2. Sidebar Fields**
- Field labels (`attributes.label`)
- Field order (`attributes.order`)
- Field help text (`attributes.description`)
- Field premium flag (`attributes.pago`)
- Control types (`attributes.control`)

**3. CSS System**
- CSS variable names (`attributes.cssVar`)
- CSS selectors (`attributes.cssSelector`)
- CSS properties (`attributes.cssProperty`)
- Default values (`attributes.default`)

**4. Validation**
- Min/max/step (`attributes.min/max/step`)
- Options for selects (`attributes.options`)
- Data types (`attributes.type`)

**5. Auto-Generated Files** (8 types)
```
schemas/accordion.json
   ↓
   ├─ shared/src/types/accordion-theme.ts          (TypeScript types)
   ├─ shared/src/validators/accordion-schema.ts    (Zod validators)
   ├─ blocks/accordion/src/accordion-attributes.js (Block attributes)
   ├─ php/css-defaults/accordion.php               (PHP defaults)
   ├─ assets/css/accordion-variables.css           (CSS variables)
   ├─ php/css-defaults/css-mappings-generated.php  (CSS mappings)
   ├─ shared/src/config/control-config-generated.js (Control config)
   └─ docs/accordion-attributes.md                 (Documentation)
```

---

## 🏗️ Schema Structure

### Complete Attribute Definition

```json
{
  "attributes": {
    "titleColor": {
      // Data type (how it's stored)
      "type": "string",

      // UI control (how user edits it)
      "control": "ColorPicker",

      // Sidebar organization
      "group": "headerColors",
      "order": 15,
      "label": "Title Color",
      "description": "Text color for accordion title (help text shown below field)",

      // Premium feature flag
      "pago": "nao",

      // Theming
      "themeable": true,

      // CSS mapping
      "cssVar": "accordion-title-color",
      "cssSelector": ".accordion-header",
      "cssProperty": "color",

      // Default value
      "default": "#333333"
    }
  }
}
```

### Group Definition

```json
{
  "groups": {
    "headerColors": {
      "title": "Header Colors",
      "description": "Title/header text and background colors",
      "order": 2,
      "initialOpen": false,
      "pago": "nao"
    }
  }
}
```

---

## 🚀 Workflow: Add New Attribute

### Step 1: Edit Schema

```json
// schemas/accordion.json
{
  "attributes": {
    "footerBackgroundColor": {
      "type": "string",
      "control": "ColorPicker",
      "group": "contentColors",
      "order": 25,
      "label": "Footer Background",
      "description": "Background color for accordion footer",
      "themeable": true,
      "cssVar": "accordion-footer-bg",
      "cssSelector": ".accordion-footer",
      "cssProperty": "background-color",
      "default": "#f5f5f5",
      "pago": "nao"
    }
  }
}
```

### Step 2: Build

```bash
npm run build
```

### Step 3: Done! ✅

**What Happens Automatically:**
- ✅ Sidebar: "Footer Background" color picker appears in Content Colors panel
- ✅ TypeScript: `footerBackgroundColor: string` added to types
- ✅ Validator: Zod schema includes footerBackgroundColor validation
- ✅ Attributes: `footerBackgroundColor: { type: 'string', default: '#f5f5f5' }`
- ✅ CSS: `--accordion-footer-bg: #f5f5f5` generated
- ✅ PHP: CSS defaults include footer background
- ✅ Docs: Documentation auto-updated

---

## 🎨 CSS Variable Strategy (No save.js Updates!)

### The Problem

Traditionally, when you add a styling attribute, you need to:
1. Add to schema
2. Update save.js to use the attribute
3. Old blocks become invalid (WordPress deprecation warnings)

### The Solution: CSS Variables

**Your save.js outputs static HTML ONCE:**

```javascript
// blocks/accordion/src/save.js
export default function save({ attributes }) {
  return (
    <div className="wp-block-guttemberg-plus-accordion">
      <div className="accordion-header">
        <h2 className="accordion-title">{attributes.title}</h2>
      </div>
      <div className="accordion-content">
        {attributes.content}
      </div>
    </div>
  );
}
```

**Your SCSS uses CSS variables:**

```scss
// blocks/accordion/src/style.scss
.accordion-header {
  background-color: var(--accordion-title-bg);
  color: var(--accordion-title-color);
  font-size: var(--accordion-title-font-size);
  padding: var(--accordion-title-padding);
  border-radius: var(--accordion-border-radius);
}
```

**Now when you add/modify styling attributes:**

```
Schema → Build → CSS variables → SCSS → Frontend ✅
save.js unchanged ✅
Old blocks still work ✅
```

---

## ✅ When save.js Is NOT Needed

### Scenario 1: Add Styling Attribute

```json
{
  "titleShadow": {
    "type": "string",
    "control": "TextControl",
    "cssVar": "accordion-title-shadow",
    "default": "none"
  }
}
```

**After build:**
- ✅ `--accordion-title-shadow: none` generated
- ✅ SCSS: `box-shadow: var(--accordion-title-shadow)` applies it
- ✅ save.js: No changes needed
- ✅ Old blocks: Still work perfectly

### Scenario 2: Modify Default Value

```json
{
  "titleColor": {
    "default": "#000000"  // Changed from #333333
  }
}
```

**After build:**
- ✅ CSS variable updated automatically
- ✅ Frontend updates automatically
- ✅ save.js: No changes needed
- ✅ Old blocks: Still work (new default applies)

### Scenario 3: Delete Styling Attribute

```json
// Remove "titleShadow" from schema
```

**After build:**
- ✅ CSS variable removed
- ✅ Shadow no longer applied
- ✅ save.js: No changes needed
- ✅ Old blocks: Still work (just no shadow)

---

## ❌ When save.js IS Needed

### Scenario 1: Add New HTML Element

```json
{
  "showFooter": {
    "type": "boolean",
    "control": "ToggleControl",
    "default": false
  }
}
```

**You MUST update save.js:**

```javascript
export default function save({ attributes }) {
  return (
    <div className="accordion">
      <div className="accordion-header">...</div>
      <div className="accordion-content">...</div>

      {/* ← Manual addition required */}
      {attributes.showFooter && (
        <div className="accordion-footer">Footer</div>
      )}
    </div>
  );
}
```

### Scenario 2: Conditional Rendering

```json
{
  "showIcon": {
    "type": "boolean",
    "default": true
  }
}
```

**You MUST update save.js:**

```javascript
<h2>
  {attributes.showIcon && <span className="icon">▾</span>}
  {attributes.title}
</h2>
```

---

## 📊 Decision Matrix

| Change Type | Update save.js? | Why |
|-------------|-----------------|-----|
| Add color/font/spacing | ❌ NO | CSS variables handle it |
| Modify default value | ❌ NO | CSS variables auto-update |
| Delete styling attribute | ❌ NO | CSS variables removed |
| Change CSS property | ❌ NO | CSS variables handle it |
| Add new HTML element | ✅ YES | Need `<div>` in HTML |
| Change HTML structure | ✅ YES | Need to modify HTML |
| Add conditional content | ✅ YES | Need `{condition && ...}` |
| Add/remove CSS classes | ✅ YES | Need to update className |

---

## 🔧 Control Types

### Available Controls

| Control | Type | Purpose | Example |
|---------|------|---------|---------|
| `ColorPicker` | string | Color selection | `#333333` |
| `RangeControl` | number | Slider (min-max) | `18` |
| `TextControl` | string | Text input | `Arial` |
| `SelectControl` | string | Dropdown menu | `left` |
| `ToggleControl` | boolean | On/off switch | `true` |
| `BorderRadiusControl` | object | 4 corner sliders | `{topLeft: 4, ...}` |
| `IconPicker` | string | Icon/character picker | `▾` |
| `FontFamilyControl` | string | Font picker | `Arial` |

### Same Type, Different Controls

```json
// All type: "string", different controls:

// Color picker
{
  "type": "string",
  "control": "ColorPicker",
  "default": "#333333"
}

// Text input
{
  "type": "string",
  "control": "TextControl",
  "default": "Arial"
}

// Dropdown
{
  "type": "string",
  "control": "SelectControl",
  "options": ["left", "center", "right"],
  "default": "left"
}
```

---

## 🎯 Auto-Panel Generation

### Old Way (Manual)

```javascript
// blocks/accordion/src/edit.js
<BehaviorPanel ... />
<GenericPanel schemaGroup="headerColors" ... />
<GenericPanel schemaGroup="contentColors" ... />
<GenericPanel schemaGroup="typography" ... />
<GenericPanel schemaGroup="borders" ... />
// 20+ lines of manual panel definitions
```

### New Way (Automatic)

```javascript
// blocks/accordion/src/edit.js
<SchemaPanels
  schema={accordionSchema}
  attributes={attributes}
  setAttributes={setAttributes}
  effectiveValues={effectiveValues}
  theme={themes[currentTheme]?.values}
  cssDefaults={cssDefaults}
/>
// Single component, all panels auto-generated!
```

**How It Works:**

1. `SchemaPanels` reads `schema.groups`
2. Sorts groups by `order` property
3. Generates `GenericPanel` for each group
4. `GenericPanel` reads `schema.attributes` for that group
5. Sorts attributes by `order` property
6. Renders appropriate control based on `control` property
7. Shows `description` as help text below field

---

## 📁 Required Schema Properties

### Minimum for Sidebar Field

```json
{
  "type": "string",              // ✅ Required: Data type
  "group": "headerColors",       // ✅ Required: Which panel
  "themeable": true,             // ✅ Required: Show in sidebar?
  "control": "ColorPicker",      // ✅ Required: UI control
  "default": "#333333",          // ✅ Required: Default value
  "order": 15,                   // ✅ Required: Display order
  "label": "Title Color",        // ✅ Required: Display name
  "pago": "nao"                  // ✅ Required: Premium flag
}
```

### Optional but Recommended

```json
{
  "description": "Help text shown below field",  // Help text
  "cssVar": "accordion-title-color",             // CSS variable name
  "cssSelector": ".accordion-header",            // Where to apply
  "cssProperty": "color"                         // What CSS property
}
```

### Control-Specific

```json
// For RangeControl:
{
  "min": 0,
  "max": 100,
  "step": 1,
  "unit": "px"
}

// For SelectControl:
{
  "options": ["left", "center", "right"]
}

// For BorderRadiusControl:
{
  "min": 0,
  "max": 60,
  "unit": "px"
}
```

---

## 🎊 Benefits

### Developer Experience

✅ **Single source of truth** - Everything in schema
✅ **No manual maintenance** - Panels auto-generate
✅ **No hardcoded configs** - All schema-driven
✅ **Fast development** - Add field → Build → Done
✅ **Type safety** - Auto-generated TypeScript types
✅ **Validation** - Auto-generated Zod validators
✅ **Documentation** - Auto-generated markdown docs

### User Experience

✅ **Consistent UI** - All panels follow same pattern
✅ **Help text** - Every field has optional description
✅ **Proper ordering** - Logical field organization
✅ **Premium flags** - Ready for paid features
✅ **Theme support** - All styling themeable

### Maintenance

✅ **No backwards compatibility issues** - CSS variables handle changes
✅ **No block invalidation** - Old blocks keep working
✅ **Clean codebase** - No legacy panel code
✅ **Easy refactoring** - Change schema, rebuild, done

---

## 🚀 Summary

**Schema-Driven Architecture:**
```
Schema (JSON) → Build → Everything ✅
```

**For Styling (CSS Variables):**
```
Schema → CSS Variables → SCSS → Frontend ✅
No save.js updates needed! ✅
```

**For Structure (HTML Changes):**
```
Schema → Attributes Available
save.js manual update needed ❌
```

**The Rule:**
- Styling = Automatic
- Structure = Manual

**Single Source of Truth = Schema** 🎯
