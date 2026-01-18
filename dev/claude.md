# Guttemberg Plus WordPress Plugin

**WordPress Gutenberg Blocks Plugin**
Advanced customizable blocks with theme system for WordPress block editor.

---

## 📁 Project Structure

```
guttemberg-plus/
├── dev/                        ← Development files
│   ├── schemas/                ← Schema system (Single source of truth)
│   │   ├── blocks/             ← Minimal schemas (human-edited)
│   │   │   ├── accordion.json
│   │   │   ├── tabs.json
│   │   │   └── toc.json
│   │   ├── generated/          ← Comprehensive schemas (auto-generated)
│   │   │   ├── accordion.json
│   │   │   ├── tabs.json
│   │   │   └── toc.json
│   │   ├── parsers/            ← Schema expansion & generation
│   │   ├── *-structure.html    ← HTML templates
│   │   └── shared-templates.json
│   │
│   ├── blocks/                 ← WordPress blocks (no src/ subdirectory)
│   │   ├── accordion/
│   │   │   ├── attributes.js   ← AUTO-GENERATED
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   └── frontend.js
│   │   ├── tabs/
│   │   └── toc/
│   │
│   ├── shared/                 ← Shared components (no src/ subdirectory)
│   │   ├── components/
│   │   ├── config/             ← AUTO-GENERATED
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── theme-system/
│   │   ├── styles/             ← AUTO-GENERATED
│   │   ├── types/              ← AUTO-GENERATED
│   │   └── validators/         ← AUTO-GENERATED
│   │
│   ├── styles/                 ← SCSS styles
│   │   └── blocks/
│   │       ├── accordion/
│   │       │   ├── editor.scss
│   │       │   ├── frontend.scss
│   │       │   └── variables.scss  ← AUTO-GENERATED
│   │       ├── tabs/
│   │       └── toc/
│   │
│   ├── tools/                  ← Build tools (was build-tools/)
│   │   ├── build.js            ← Main orchestrator
│   │   ├── generators/
│   │   └── validators/
│   │
│   └── docs/
│       ├── api/                ← AUTO-GENERATED
│       └── architecture/
│
├── server/                     ← PHP backend (was php/ and includes/)
│   ├── api/
│   │   ├── themes.php
│   │   └── css.php
│   ├── storage/
│   │   └── themes.php
│   ├── css-defaults/
│   │   └── css-mappings-generated.php
│   ├── init.php
│   └── security.php
│
└── guttemberg-plus.php
```

---

## 🎨 Core Features

### 3 Gutenberg Blocks
- **Accordion** - Expandable/collapsible content sections
- **Tabs** - Tabbed content with multiple layouts
- **Table of Contents** - Auto-generated TOC from headings

### Theme System (3-Tier CSS Cascade)
1. **Tier 1: Defaults** - CSS variables (`:root`)
2. **Tier 2: Themes** - CSS classes (`.accordion-theme-{name}`)
3. **Tier 3: Customizations** - Inline styles (per-block overrides)

### Key Capabilities
- Create, save, and manage themes
- Apply themes across multiple blocks
- Per-block customizations override themes
- Delta-based storage (only differences saved)
- Theme switching without data loss
- Session-based customization cache

---

## 🏗️ Architecture: Comprehensive Schema System

**Two-Level Schema Architecture:**

1. **Minimal Schemas** (human-edited) - `schemas/blocks/*.json`
2. **Comprehensive Schemas** (auto-generated) - `schemas/generated/*.json`

```
Minimal Schema + HTML Structure
        ↓
[Schema Orchestrator]
  • Merge structure into schema
  • Expand macros (box-panel, color-panel, etc.)
  • Generate CSS variable names
  • Apply responsive variants
  • Build composite attributes
        ↓
Comprehensive Schema
        ↓
[Build Tools]
        ↓
12 auto-generated files
```

**Build Pipeline:**
```bash
npm run schema:build  # Runs tools/build.js
```

**Step 1:** Generate comprehensive schemas (3 files)
**Step 2:** Generate block attributes (3 files)
**Step 3:** Generate CSS variables (6 files)

**Benefits:**
- ✅ Macro expansion (box-panel → 15+ attributes)
- ✅ Auto-generated CSS variable names
- ✅ Responsive variants (mobile/tablet/desktop)
- ✅ Type-safe (TypeScript + Zod)
- ✅ Zero duplication
- ✅ Single edit updates everything

---

## 🔧 Adding/Modifying Block Attributes

### Quick Start

**1. Edit the minimal schema file:**
```bash
# For accordion attributes:
schemas/blocks/accordion.json

# For tabs attributes:
schemas/blocks/tabs.json

# For TOC attributes:
schemas/blocks/toc.json
```

**2. Add your attribute:**
```json
{
  "attributes": {
    "myNewAttribute": {
      "type": "string",
      "default": "value",
      "group": "colors",
      "label": "My Attribute",
      "description": "Help text for users",
      "themeable": true,
      "cssVar": "my-css-var",
      "control": "ColorPicker"
    },
    "myNewSlider": {
      "type": "number",
      "default": "18px",
      "group": "typography",
      "label": "Font Size",
      "description": "Size of text in pixels",
      "themeable": true,
      "cssVar": "my-font-size",
      "control": "RangeControl",
      "min": 12,
      "max": 48,
      "unit": "px"
    }
  }
}
```

**3. Rebuild:**
```bash
npm run schema:build  # Generates 24 files (~30ms)
npm run build         # Compiles WordPress blocks (~10s)
```

**Done!** Your attribute is now available in the editor, theme system, and all generated files.

### Schema Field Reference

**Required Fields:**
- `type` - Data type: `"string"`, `"number"`, `"boolean"`, `"object"`
- `default` - Default value (include units for numbers: `"18px"`, `"180deg"`, `"#333333"`)
- `group` - UI panel: `"colors"`, `"typography"`, `"borders"`, `"layout"`, `"icons"`, `"behavior"`
- `label` - Human-readable name
- `description` - Help text for users
- `themeable` - `true` (saved in themes) or `false` (per-block only)

**For Themeable Attributes (themeable: true):**
- `cssVar` - CSS variable suffix (e.g., `"title-color"` → `--accordion-title-color`)
- `control` - UI control type: `"ColorPicker"`, `"RangeControl"`, `"SelectControl"`, `"ToggleControl"`, `"TextControl"`, etc.

**For RangeControl (Sliders):**
- `min` - Minimum value (auto-added to control-config)
- `max` - Maximum value (auto-added to control-config)
- `unit` - CSS unit (optional): `"px"`, `"em"`, `"%"`, `"deg"`

**For SelectControl (Dropdowns):**
- `options` - Array of `{label, value}` objects (auto-added to control-config)

**For Non-Themeable Attributes (themeable: false):**
- `reason` - Why excluded: `"structural"`, `"behavioral"`, `"content"`

**Important Notes:**
- Numeric defaults should include units: `"18px"` not `18`
- Units are stored with the default and extracted by `getNumericDefault()` function
- min/max ranges are automatically available in `control-config-generated.js`
- All controls get config from schema automatically (no hardcoding needed)

### What Gets Auto-Generated

When you run `npm run schema:build`, **12 files** are created:

**Comprehensive Schemas (3):**
- `schemas/generated/accordion.json`
- `schemas/generated/tabs.json`
- `schemas/generated/toc.json`

**Block Attributes (3):**
- `blocks/accordion/attributes.js`
- `blocks/tabs/attributes.js`
- `blocks/toc/attributes.js`

**CSS Variables - Editor SCSS (3):**
- `styles/blocks/accordion/variables.scss`
- `styles/blocks/tabs/variables.scss`
- `styles/blocks/toc/variables.scss`

**CSS Variables - Frontend JS (3):**
- `shared/styles/accordion-frontend-css-vars-generated.js`
- `shared/styles/tabs-frontend-css-vars-generated.js`
- `shared/styles/toc-frontend-css-vars-generated.js`

**⚠️ NEVER edit these files manually** - they're regenerated on every build.

### Example: Adding a Color Attribute

**Edit:** `schemas/blocks/accordion.json`

```json
"highlightColor": {
  "type": "string",
  "default": "#ffcc00",
  "cssVar": "highlight-color",
  "group": "colors",
  "label": "Highlight Color",
  "description": "Color for highlighted elements",
  "themeable": true,
  "control": "ColorPicker"
}
```

**Build:** `npm run schema:build && npm run build`

**Result:** Attribute is now in editor, saves to themes, applies as CSS variable.

---

## 🎛️ Control Configuration System

### What is Control Config?

The `control-config-generated.js` file is auto-generated from schemas and contains **all control properties** (min, max, options, defaults) for the editor UI.

**Before:** Min/max values were hardcoded in components
```javascript
// ❌ Old way - hardcoded everywhere
<RangeControl min={0} max={360} />
<RangeControl min={0} max={360} />  // Duplicated!
```

**Now:** Everything comes from schema
```javascript
// ✅ New way - from generated config
<RangeControl
  min={ getControlConfig(blockType, 'iconRotation').min }
  max={ getControlConfig(blockType, 'iconRotation').max }
/>
```

### Using Control Config in Components

**Import the helper functions:**
```javascript
import {
  getControlConfig,
  getNumericControlDefault,
  getNumericDefault
} from '../config/control-config-generated';
```

**For RangeControl (sliders):**
```javascript
<RangeControl
  value={
    typeof effectiveValues.iconRotation === 'string'
      ? getNumericDefault( effectiveValues.iconRotation )  // '180deg' → 180
      : effectiveValues.iconRotation ?? getNumericControlDefault( blockType, 'iconRotation' ) ?? 180
  }
  min={ getControlConfig( blockType, 'iconRotation' ).min ?? -360 }
  max={ getControlConfig( blockType, 'iconRotation' ).max ?? 360 }
/>
```

**For SelectControl (dropdowns):**
```javascript
<SelectControl
  value={ effectiveValues.titleFontWeight || 'normal' }
  options={ getControlConfig( blockType, 'titleFontWeight' ).options || [] }
  onChange={ handleChange }
/>
```

### Control Config Structure

Generated from schema, looks like:
```javascript
'iconRotation': {
  control: 'RangeControl',
  min: -360,
  max: 360,
  unit: 'deg',
  label: 'Icon Rotation',
  description: 'Rotation angle when open (degrees)',
  default: '180deg',
}
```

### Key Helper Functions

```javascript
// Get config for specific attribute
getControlConfig(blockType, attrName)
// Returns: { min, max, options, default, ... }

// Get numeric default from string with units
getNumericControlDefault(blockType, attrName)
// Returns: 180 (extracted from '180deg')

// Extract number from string
getNumericDefault('180deg')
// Returns: 180
```

### Important: String to Number Conversion

Block attributes with units are stored as strings (e.g., `'180deg'`, `'18px'`), but RangeControl needs numbers. The conversion happens automatically:

```javascript
// If attribute is string '180deg'
typeof effectiveValues.iconRotation === 'string'
  ? getNumericDefault( effectiveValues.iconRotation )  // Converts to 180
  : effectiveValues.iconRotation
```

**Why?** Database stores: `iconRotation: '180deg'`
But React needs: `value={180}`

---

## 🗄️ Theme System Details

### Database Storage
- **Location:** WordPress `wp_options` table
- **Keys:** `guttemberg_plus_accordion_themes`, `guttemberg_plus_tabs_themes`, `guttemberg_plus_toc_themes`
- **Format:** Serialized PHP arrays (delta-based)

### REST API Endpoints
```
GET    /gutenberg-blocks/v1/themes/{blockType}
POST   /gutenberg-blocks/v1/themes
PUT    /gutenberg-blocks/v1/themes/{blockType}/{name}
DELETE /gutenberg-blocks/v1/themes/{blockType}/{name}
POST   /gutenberg-blocks/v1/themes/{blockType}/{name}/rename
```

### Theme Data Flow
1. **User customizes block** → Session cache stores changes
2. **User clicks "Save Theme"** → Delta calculator extracts differences from defaults
3. **Theme saved** → Only changed values stored (delta-based)
4. **Theme applied** → Defaults + deltas merged to reconstruct full theme
5. **CSS generated** → PHP creates `.{block}-theme-{name}` CSS class

### Exclusions
Structural/behavioral/content attributes are excluded from themes:
- `accordionId`, `blockId`, `uniqueId` (structural)
- `title`, `content` (content)
- `initiallyOpen`, `allowMultipleOpen` (behavioral)

These are **auto-generated** from `themeable: false` in schemas.

---

## 🚀 Development Workflow

### Build Commands
```bash
# Generate files from schemas (fast)
npm run schema:build

# Validate schemas before build
npm run schema:validate

# Full WordPress build (includes schema:build)
npm run build

# Development mode with watch
npm run start
```

### Working with Schemas
1. **Edit** minimal schema file (`schemas/blocks/*.json`)
2. **Run** `npm run schema:build` (generates comprehensive schemas + 12 files)
3. **Verify** comprehensive schema generated (`schemas/generated/*.json`)
4. **Build** `npm run build` (compiles WordPress blocks)
5. **Test** in WordPress editor

### Git Workflow
**Commit:**
- ✅ Minimal schemas (`schemas/blocks/*.json`) - source of truth
- ✅ HTML structures (`schemas/*-structure.html`)
- ✅ All generated files (tracked for deployment)

**On pull:**
- Run `npm run build` to ensure everything is in sync

**After merge conflicts:**
- Always run `npm run schema:build && npm run build`

---

## 📦 Key Technologies

- **WordPress Gutenberg** - Block editor framework
- **React** - UI components
- **Redux** - State management (theme store)
- **TypeScript** - Type safety (auto-generated from schemas)
- **Zod** - Runtime validation (auto-generated from schemas)
- **SCSS** - Styling
- **PHP** - Backend (REST API, theme storage, CSS generation)
- **Webpack** - Build system

---

## 🔌 PHP Integration

### Theme Storage (`server/storage/themes.php`)
- `get_block_themes()` - Fetch all themes for a block
- `create_block_theme()` - Save new theme
- `update_block_theme()` - Update existing theme
- `delete_block_theme()` - Delete theme
- `rename_block_theme()` - Rename theme

### CSS Generation (`server/api/css.php`)
- Uses **auto-generated mappings** from comprehensive schemas
- Generates Tier 2 CSS classes
- Injected into `<head>` on page load
- Only loads CSS for blocks actually on page

### REST API (`server/api/themes.php`)
- Handles CRUD operations via WordPress REST API
- Validates theme names
- Manages permissions
- Returns JSON responses

### Block Registration (`server/init.php`)
- Registers all blocks with WordPress
- Enqueues block assets
- Handles block.json metadata

---

## 📂 Block-Specific Files

### Accordion Block
```
blocks/accordion/
├── attributes.js          ← AUTO-GENERATED from comprehensive schema
├── index.js               ← Block registration
├── edit.js                ← Editor component
├── save.js                ← Frontend rendering (save to database)
├── frontend.js            ← Frontend JavaScript (interactivity)
└── block.json             ← Block metadata

styles/blocks/accordion/
├── editor.scss            ← Editor-only styles
├── frontend.scss          ← Frontend styles (hardcoded)
└── variables.scss         ← AUTO-GENERATED CSS variables
```

Same structure for **tabs** and **toc** blocks.

---

## 🎯 Common Tasks

### Adding a New Block
1. Create minimal schema: `schemas/blocks/newblock.json`
2. Create HTML structure: `schemas/newblock-structure.html`
3. Add to `BLOCKS` array in `tools/build.js`
4. Create block directory: `blocks/newblock/`
5. Add block files (index.js, edit.js, save.js, etc.)
6. Create styles directory: `styles/blocks/newblock/`
7. Add editor.scss and frontend.scss
8. Run `npm run schema:build && npm run build`

### Changing Default Values
1. Edit `schemas/blocks/{block}.json` → change `default` field
2. Run `npm run schema:build && npm run build`
3. New blocks use new default (existing blocks unchanged)

### Adding UI Control
1. Edit minimal schema → add attribute with `control` field
2. Run `npm run schema:build && npm run build`
3. Control appears in editor sidebar automatically via SchemaPanels.js

### Debugging Theme Issues
1. Check browser console for errors
2. Check `wp_options` table for theme data
3. Inspect element → verify CSS variables applied
4. Check PHP error logs for backend issues
5. Verify schema is valid JSON

---

## ⚠️ Important Rules

### DO ✅
- Edit `schemas/blocks/*.json` for any attribute changes
- Run `npm run schema:build` after schema edits
- Run full `npm run build` before testing in WordPress
- Commit minimal schemas and generated files together
- Use macros (box-panel, color-panel) for related attributes
- Keep HTML structure files updated when changing markup

### DON'T ❌
- Edit comprehensive schemas (`schemas/generated/`) - they're regenerated
- Edit auto-generated files (attributes.js, variables.scss, etc.)
- Skip `npm run schema:build` after schema changes
- Edit CSS variables manually (use schemas)
- Edit block attributes manually (use schemas)
- Create nested attributes (use flat atomic attributes)

---

## 🐛 Troubleshooting

**Build fails:**
- Check schema JSON is valid (no syntax errors)
- Ensure all required fields present
- Run `npm run schema:validate`

**Attribute not showing:**
- Did you run both build commands?
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors

**CSS not applying:**
- Verify `cssVar` and `cssDefault` in schema
- Check generated CSS file exists
- Inspect element → verify CSS variable in DOM

**Theme not saving:**
- Check browser console for API errors
- Verify PHP error logs
- Check database permissions

---

## 📖 Documentation

**Auto-Generated:**
- `docs/api/accordion.md` - Accordion block API
- `docs/api/tabs.md` - Tabs block API
- `docs/api/toc.md` - TOC block API

**Architecture:**
- `docs/architecture/overview.md` - System overview
- `docs/architecture/cascade-system.md` - CSS cascade details
- `docs/architecture/theme-system.md` - Theme system internals

**Schema System:**
- `schemas/README.md` - Schema documentation
- `tools/README-SCHEMA-VALIDATION.md` - Schema validation
- This file (CLAUDE.md) - Main project documentation

---

## 🔐 Security

- REST API uses WordPress nonces
- Theme names sanitized
- User permissions checked
- SQL injection prevention
- XSS prevention in frontend

---

## 📝 License & Credits

**License:** [Your License]
**Author:** [Your Name]
**Version:** 1.0.0

---

**Quick Reference:**
- **Minimal schemas:** `schemas/blocks/{block}.json` (you edit this)
- **Comprehensive schemas:** `schemas/generated/{block}.json` (auto-generated)
- **Build command:** `npm run schema:build && npm run build`
- **Generated files:** 12 files (never edit manually)
- **Block types:** accordion, tabs, toc
- **Theme storage:** wp_options table (delta-based)
- **PHP backend:** `server/` directory
- **Dev files:** `dev/` directory

---

## 🎯 Macro Types

Available macros for minimal schemas:

- **`box-panel`** - Padding, margin, width, height, gap (+ responsive)
- **`border-panel`** - Width, style, color, radius (all sides + responsive)
- **`color-panel`** - Color, hover, background, background-hover
- **`typography-panel`** - Font family, size, weight, line-height, etc.
- **`icon-panel`** - Icon, size, color, position, rotation, spacing

Example:
```json
"headerBox": {
  "type": "box-panel",
  "label": "Header Box",
  "description": "Spacing and dimensions for header",
  "themeable": true
}
```

This expands to 15+ atomic attributes automatically!
