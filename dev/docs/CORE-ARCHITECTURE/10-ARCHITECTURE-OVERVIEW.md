# Architecture Overview

**What You're Building**: Three interconnected WordPress Gutenberg blocks with unified theme system
**Read Time**: 5 minutes
**Purpose**: High-level system understanding before diving into implementation

---

## Three Blocks, One System

### The Blocks

1. **Accordion Block** - Collapsible content sections with expand/collapse behavior
2. **Tabs Block** - Horizontal/vertical tabbed content with responsive accordion fallback
3. **Table of Contents Block** - Automatic heading detection and navigation

### The Unified System

All three blocks share:
- **Theme system** - Create themes once, use across all blocks of same type
- **Cascade architecture** - CSS → Theme → Block customizations (3 tiers)
- **Attribute definitions** - Consistent naming conventions across blocks
- **UI components** - Shared panels and controls
- **Storage patterns** - Same database and caching strategy

---

## Core Principles

### 1. CSS as Single Source of Truth

All default values defined **once** in CSS files:

```
Designer changes default:
1. Edit accordion.css (one line)
2. Save file
3. Done! Everything updates:
   ├─ Frontend rendering ✅
   ├─ PHP theme generation ✅
   └─ JavaScript editor ✅
```

**Files:**
- `assets/css/accordion.css` - All accordion defaults
- `assets/css/tabs.css` - All tabs defaults
- `assets/css/toc.css` - All TOC defaults

### 2. Complete Snapshot Themes

Themes store **ALL attributes** with explicit values:
- No null values in saved themes
- Themes are portable and self-contained
- Update theme → all blocks using it update
- Separate storage per block type (no cross-contamination)

### 3. Event Isolation

**Critical**: Block types are completely separate:
- Accordion themes → only for accordion blocks
- Tabs themes → only for tabs blocks
- TOC themes → only for TOC blocks
- No conversion between block types
- No shared themes across types

---

## The 3-Tier Value Cascade

**How styling works**: Values resolve through three layers with clear priority:

```
┌─────────────────────────────────────┐
│  Tier 3: Block Customizations       │
│  Priority: HIGHEST                  │
│  Storage: Inline attributes         │
│  Output: Inline CSS vars on element │
└─────────────────────────────────────┘
              ↑ overrides
┌─────────────────────────────────────┐
│  Tier 2: Theme Values               │
│  Priority: MEDIUM                   │
│  Storage: Database (wp_options)     │
│  Output: Theme CSS in <head>        │
└─────────────────────────────────────┘
              ↑ overrides
┌─────────────────────────────────────┐
│  Tier 1: CSS Defaults               │
│  Priority: LOWEST (fallback)        │
│  Storage: CSS file (:root vars)     │
│  Output: CSS variables              │
└─────────────────────────────────────┘
```

**Rule**: First defined value wins. No merging.
**Rule**: Tier 3 is element-inline only; no `<style>` tags for block customizations. `<head>` is reserved for Tier 2 saved theme CSS.

**Example**:
```javascript
// Block has titleColor customization
attributes.titleColor = '#ff0000'; // Used ✅

// Current theme has titleColor
theme.titleColor = '#00ff00'; // Ignored

// CSS default
:root { --accordion-default-title-color: '#333'; } // Ignored
```

---

## Shared vs Block-Specific

### Shared Infrastructure (`src/shared/`)

**Used by all blocks**:
- `theme-system/` - Cascade resolution, theme CRUD
- `data/` - @wordpress/data store
- `components/` - ThemeSelector, ColorPanel, etc.
- `attributes/` - Shared attribute definitions
- `utils/` - ID generator, ARIA helpers, CSS parser

### Block-Specific

**Unique per block**:
- Theme storage (separate database options)
- CSS defaults file (accordion.css, tabs.css, toc.css)
- Block-specific attributes (orientation, iconRotation, etc.)
- HTML structure and ARIA patterns

---

## Database Schema

### Themes Storage

**Location**: `wp_options` table

**Option Names** (separate per block):
```php
'accordion_themes' => array(
  'theme-id-xyz' => array(
    'name' => 'Dark Mode',
    'values' => array( /* all attributes */ )
  )
)

'tabs_themes' => array(/* separate themes */)
'toc_themes' => array(/* separate themes */)
```

### Default Theme

**Special case**: Default theme is NOT in database
- Exists only as CSS variables in CSS files
- No database storage needed
- Represented by empty string `""` in attributes

---

## WordPress Libraries Integration

### What We Use

✅ **@wordpress/scripts** - Build system, webpack, hot reload
✅ **@wordpress/data** - Theme CRUD only (NOT cascade resolution)
✅ **@wordpress/components** - UI panels (60-70% of UI)
✅ **@wordpress/a11y** - Screen reader announcements only

### What We Keep Custom

❌ **Cascade resolver** - 100% custom (<5ms performance target)
❌ **ARIA management** - Custom sync with visual state
❌ **Keyboard navigation** - Block-specific handlers
❌ **ID generation** - Custom format [0-9][a-z][a-z][a-z]

**Net Impact**: 980 LOC saved (10.6% reduction) + better code quality

---

## System Flow

### Editor (Gutenberg)

```
1. User loads editor
   ↓
2. PHP parses CSS files → caches defaults
   ↓
3. wp_localize_script → passes to JavaScript
   ↓
4. JavaScript receives window.accordionDefaults
   ↓
5. User edits block
   ↓
6. Cascade resolver computes effective values
   ↓
7. UI displays effective values (not raw attributes)
   ↓
8. User saves customizations → inline attributes
```

### Frontend (Public Site)

```
1. Post loads
   ↓
2. PHP scans for blocks using themes
   ↓
3. Generate theme CSS (from cache or fresh)
   ↓
4. Output theme CSS in <head> (saved themes only)
   ↓
5. Render blocks with theme classes (Tier 2)
   ↓
6. Inline CSS variables on the block element override theme
   ↓
7. CSS cascade handles final styling
   ↓
8. JavaScript adds interactivity (toggle, tabs, etc.)
```

---

## Performance Characteristics

### Targets

- **Cascade resolution**: <5ms (per block, editor)
- **Theme switch**: <100ms (UI update)
- **CSS parsing**: <50ms uncached, <5ms cached
- **Build time**: <30s production
- **Hot reload**: <2s for changes

### Caching Strategy

**CSS Defaults**:
- Transient: `accordion_parsed_defaults`
- Includes file modification time
- Auto-invalidates when CSS changes

**Theme CSS**:
- Transient per theme: `accordion_theme_{id}_css`
- Version-based invalidation
- Only used themes output on page

---

## Code Estimates

| Component | Lines of Code | Savings vs Custom |
|-----------|---------------|-------------------|
| Phase 0: Build System | 270 | +270 (new) |
| Phase 1: Shared Infrastructure | 2,520 | -750 (23%) |
| Phase 2: Accordion Block | 1,600 | -200 (11%) |
| Phase 3: Tabs Block | 1,800 | -200 (10%) |
| Phase 4: TOC Block | 1,900 | -300 (14%) |
| Phase 5: Integration Tests | 200 | +200 (new) |
| **Total** | **8,290** | **-980 (10.6%)** |

---

## Critical Rules (Must Know)

### MUST DO

1. ✅ Load themes before rendering (prevents race conditions)
2. ✅ Use `getAllEffectiveValues()` for UI (never raw attributes)
3. ✅ All customizable attributes default to `null`
4. ✅ Clear customizations after theme update
5. ✅ Keep cascade-resolver.js pure (no side effects)

### MUST NOT DO

1. ❌ Don't use @wordpress/data for cascade resolution
2. ❌ Don't merge cascade tiers (first value wins, stop)
3. ❌ Don't treat booleans differently (same cascade)
4. ❌ Don't render before themes load
5. ❌ Don't share themes between block types

---

## Module Dependency Graph

```
Phase 0: Build System
└── npm + webpack + CSS parser loader

Phase 1: Shared Infrastructure (MUST complete first)
├── CSS Parsing System
├── Cascade Resolver (CUSTOM - pure function)
├── @wordpress/data Store
├── Theme Storage PHP (REST API)
├── Theme Manager (thin wrapper)
├── Shared Attributes (all default null)
├── Shared UI Components (@wordpress/components)
└── Shared Utilities (ID, ARIA, keyboard)

Phase 2-4: Blocks (can run parallel after Phase 1)
├── Uses shared modules from start
├── Block-specific attributes
├── Block-specific CSS files
└── Block-specific HTML/ARIA

Phase 5: Integration
└── Cross-block testing
```

---

## File Structure

```
project/
├── blocks/
│   ├── accordion/
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   └── style.css
│   │   ├── build/ (generated)
│   │   └── block.json
│   ├── tabs/ (same structure)
│   └── toc/ (same structure)
│
├── shared/
│   ├── src/
│   │   ├── theme-system/
│   │   │   ├── cascade-resolver.js (CRITICAL)
│   │   │   └── theme-manager.js
│   │   ├── data/
│   │   │   └── store.js (@wordpress/data)
│   │   ├── components/
│   │   │   ├── ThemeSelector.js
│   │   │   ├── ColorPanel.js
│   │   │   └── TypographyPanel.js
│   │   ├── attributes/
│   │   │   ├── color-attributes.js
│   │   │   └── typography-attributes.js
│   │   └── utils/
│   │       ├── css-parser.js
│   │       ├── id-generator.js
│   │       └── aria-helpers.js
│   └── build/ (generated)
│
├── assets/css/
│   ├── accordion.css (single source of truth)
│   ├── tabs.css
│   └── toc.css
│
├── php/
│   ├── css-defaults/ (generated)
│   ├── theme-storage.php
│   └── theme-rest-api.php
│
├── build-tools/
│   └── css-vars-parser-loader.js
│
├── webpack.config.js
└── package.json
```

---

## Next Steps

After reading this overview:

1. **Read [11-CASCADE-SYSTEM.md](11-CASCADE-SYSTEM.md)** - Deep dive into 3-tier cascade
2. **Read [12-THEME-SYSTEM.md](12-THEME-SYSTEM.md)** - How themes work
3. **Read [13-CUSTOMIZATION-CACHE.md](13-CUSTOMIZATION-CACHE.md)** - React state hybrid
4. **Read [14-DATA-FLOW.md](14-DATA-FLOW.md)** - How data moves through system

**For implementation**:
- Start with IMPLEMENTATION/ section after understanding architecture
- Complete Phase 1 (Shared Infrastructure) before any blocks
- Use shared modules from day one (don't build accordion first then extract)

---

## Key Insights

1. **One System, Multiple Blocks** - Build shared infrastructure first
2. **CSS is King** - All defaults in CSS, everything reads from there
3. **Complete Snapshots** - Themes store everything, no partial values
4. **First Value Wins** - No merging in cascade, clear priority
5. **Event Isolation** - Block types are completely separate
6. **Performance First** - <5ms cascade, aggressive caching

**This architecture is production-ready and designed for long-term maintainability.**

---

**Document Version**: 1.0
**Last Updated**: 2025-10-17
**Part of**: WordPress Gutenberg Blocks Documentation Suite
