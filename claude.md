# Guttemberg Plus WordPress Plugin

**WordPress Gutenberg Blocks Plugin**
Advanced customizable blocks with theme system for WordPress block editor.

---

## 📁 Project Structure

```
guttemberg-plus/
├── schemas/              ← Single source of truth (JSON schemas)
│   ├── accordion.json
│   ├── tabs.json
│   └── toc.json
├── blocks/               ← WordPress blocks
│   ├── accordion/
│   ├── tabs/
│   └── toc/
├── shared/               ← Shared components, utilities, theme system
│   ├── src/
│   │   ├── components/   ← React components (ThemeSelector, ColorPanel, etc.)
│   │   ├── data/         ← Redux store for theme management
│   │   ├── utils/        ← Delta calculator, cascade resolver
│   │   ├── theme-system/ ← Theme mechanics
│   │   ├── types/        ← TypeScript types (auto-generated)
│   │   ├── validators/   ← Zod schemas (auto-generated)
│   │   └── config/       ← Exclusions (auto-generated)
├── php/                  ← Backend
│   ├── theme-storage.php       ← Database operations
│   ├── theme-rest-api.php      ← REST API endpoints
│   ├── theme-css-generator.php ← Tier 2 CSS generation
│   └── css-defaults/           ← Auto-generated from schemas
├── build-tools/
│   └── schema-compiler.js      ← Generates 24 files from schemas
├── assets/css/           ← Auto-generated CSS variables
└── docs/                 ← Auto-generated documentation
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

## 🏗️ Architecture: Schema-First

**Single Source of Truth:** Everything is defined in 3 JSON schema files.

```
schemas/accordion.json  →  [schema-compiler.js]  →  24 auto-generated files
schemas/tabs.json       →                        →  (attributes, types, CSS, PHP, docs)
schemas/toc.json        →                        →
```

**Benefits:**
- ✅ No manual synchronization needed
- ✅ Type-safe (TypeScript + Zod)
- ✅ Zero duplication
- ✅ Single edit updates everything

---

## 🔧 Adding/Modifying Block Attributes

### Quick Start

**1. Edit the schema file:**
```bash
# For accordion attributes:
schemas/accordion.json

# For tabs attributes:
schemas/tabs.json

# For TOC attributes:
schemas/toc.json
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
      "themeable": true,
      "cssVar": "my-css-var",
      "cssDefault": "--accordion-my-css-var: value;",
      "control": "ColorPicker"
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
- `default` - Default value
- `group` - UI panel: `"colors"`, `"typography"`, `"borders"`, `"layout"`, `"behavior"`
- `label` - Human-readable name
- `themeable` - `true` (saved in themes) or `false` (per-block only)

**For Themeable Attributes (themeable: true):**
- `cssVar` - CSS variable suffix (e.g., `"title-color"` → `--accordion-title-color`)
- `cssDefault` - Full CSS declaration (e.g., `"--accordion-title-color: #333333;"`)
- `control` - UI control: `"ColorPicker"`, `"RangeControl"`, `"ToggleControl"`, etc.

**For Non-Themeable Attributes (themeable: false):**
- `reason` - Why excluded: `"structural"`, `"behavioral"`, `"content"`

**Optional:**
- `min`, `max` - For number inputs
- `unit` - CSS unit: `"px"`, `"em"`, `"%"`
- `options` - Array for SelectControl
- `description` - Help text

### What Gets Auto-Generated

When you run `npm run schema:build`, **24 files** are created:

- **Block attributes** (3) - `blocks/*/src/*-attributes.js`
- **TypeScript types** (3) - `shared/src/types/*-theme.ts`
- **Zod validators** (3) - `shared/src/validators/*-schema.ts`
- **PHP defaults** (3) - `php/css-defaults/*.php`
- **CSS variables** (3) - `assets/css/*-generated.css`
- **Exclusions** (4) - `shared/src/config/*-exclusions.js`
- **PHP mappings** (1) - `php/css-defaults/css-mappings-generated.php`
- **Documentation** (3) - `docs/*-attributes.md`

**⚠️ NEVER edit these files manually** - they're regenerated on every build.

### Example: Adding a Color Attribute

**Edit:** `schemas/accordion.json`

```json
"highlightColor": {
  "type": "string",
  "format": "color-hex",
  "default": "#ffcc00",
  "cssVar": "highlight-color",
  "cssDefault": "--accordion-highlight-color: #ffcc00;",
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
1. **Edit** schema file (`schemas/*.json`)
2. **Run** `npm run schema:build`
3. **Verify** generated files updated
4. **Build** `npm run build`
5. **Test** in WordPress editor

### Git Workflow
**Commit:**
- ✅ `schemas/*.json` (source of truth)
- ✅ All generated files (tracked for deployment)

**On pull:**
- Run `npm run build` to ensure everything is in sync

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

### Theme Storage (`php/theme-storage.php`)
- `get_block_themes()` - Fetch all themes for a block
- `create_block_theme()` - Save new theme
- `update_block_theme()` - Update existing theme
- `delete_block_theme()` - Delete theme
- `rename_block_theme()` - Rename theme

### CSS Generation (`php/theme-css-generator.php`)
- Uses **auto-generated mappings** from schemas
- Generates Tier 2 CSS classes
- Injected into `<head>` on page load
- Only loads CSS for blocks actually on page

### REST API (`php/theme-rest-api.php`)
- Handles CRUD operations via WordPress REST API
- Validates theme names
- Manages permissions
- Returns JSON responses

---

## 📂 Block-Specific Files

### Accordion Block
```
blocks/accordion/
├── src/
│   ├── index.js           ← Block registration
│   ├── edit.js            ← Editor component
│   ├── save.js            ← Frontend rendering
│   ├── frontend.js        ← Frontend JavaScript
│   ├── style.scss         ← Frontend styles
│   ├── editor.scss        ← Editor-only styles
│   └── accordion-attributes.js  ← AUTO-GENERATED from schema
└── block.json             ← Block metadata
```

Same structure for **tabs** and **toc** blocks.

---

## 🎯 Common Tasks

### Adding a New Block
1. Create schema: `schemas/newblock.json`
2. Add to `BLOCKS` array in `build-tools/schema-compiler.js`
3. Create block directory: `blocks/newblock/`
4. Add block files (index.js, edit.js, save.js, etc.)
5. Run `npm run schema:build && npm run build`

### Changing Default Values
1. Edit `schemas/{block}.json` → change `default` field
2. Run `npm run schema:build && npm run build`
3. New blocks use new default (existing blocks unchanged)

### Adding UI Control
1. Edit schema → add attribute with `control` field
2. Run `npm run schema:build && npm run build`
3. Control appears in editor sidebar automatically

### Debugging Theme Issues
1. Check browser console for errors
2. Check `wp_options` table for theme data
3. Inspect element → verify CSS variables applied
4. Check PHP error logs for backend issues
5. Verify schema is valid JSON

---

## ⚠️ Important Rules

### DO ✅
- Edit `schemas/*.json` for any attribute changes
- Run `npm run schema:build` after schema edits
- Run full `npm run build` before testing
- Commit schemas and generated files together

### DON'T ❌
- Edit auto-generated files manually (they're overwritten)
- Skip `npm run schema:build` after schema changes
- Edit CSS defaults in PHP files (use schemas)
- Edit block attributes manually (use schemas)

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

- **Auto-generated:** `docs/{block}-attributes.md` (from schemas)
- **Schema examples:** See `schemas/*.json`
- **Architecture:** This file (claude.md)

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
- Schema location: `schemas/{block}.json`
- Build command: `npm run schema:build && npm run build`
- Generated files: 24 (never edit manually)
- Block types: accordion, tabs, toc
- Theme storage: wp_options table (delta-based)
