# START HERE - Documentation Navigation Guide

**Purpose**: This file helps coding agents find exactly what they need to implement the WordPress Gutenberg Blocks project.

---

## Quick Navigation

### "I need to understand the core system"
1. Read [11-CASCADE-SYSTEM.md](CORE-ARCHITECTURE/11-CASCADE-SYSTEM.md) - How values resolve (Block → Theme → CSS)
2. Read [12-THEME-SYSTEM.md](CORE-ARCHITECTURE/12-THEME-SYSTEM.md) - Theme storage and operations
3. Read [13-CUSTOMIZATION-CACHE.md](CORE-ARCHITECTURE/13-CUSTOMIZATION-CACHE.md) - Session-based customizations

### "I need to implement the Accordion block"
1. Read [31-ACCORDION-SPEC.md](BLOCKS/31-ACCORDION-SPEC.md) - HTML structure, ARIA, keyboard nav
2. Read [30-SHARED-ATTRIBUTES.md](BLOCKS/30-SHARED-ATTRIBUTES.md) - All attributes with defaults
3. Read [40-EDITOR-UI-PANELS.md](UI-UX/40-EDITOR-UI-PANELS.md) - Inspector sidebar panels
4. Read [22-PHASE-1-SHARED-INFRASTRUCTURE.md](IMPLEMENTATION/22-PHASE-1-SHARED-INFRASTRUCTURE.md) - Required shared modules

### "I need to implement the Tabs block"
1. Read [32-TABS-SPEC.md](BLOCKS/32-TABS-SPEC.md) - Tabs-specific requirements
2. Read [31-ACCORDION-SPEC.md](BLOCKS/31-ACCORDION-SPEC.md) - Shared accordion foundation
3. Read [30-SHARED-ATTRIBUTES.md](BLOCKS/30-SHARED-ATTRIBUTES.md) - Shared attributes
4. Read [40-EDITOR-UI-PANELS.md](UI-UX/40-EDITOR-UI-PANELS.md) - UI panels

### "I need to implement the TOC block"
1. Read [33-TOC-SPEC.md](BLOCKS/33-TOC-SPEC.md) - Table of contents implementation
2. Read [30-SHARED-ATTRIBUTES.md](BLOCKS/30-SHARED-ATTRIBUTES.md) - Shared attributes
3. Read [40-EDITOR-UI-PANELS.md](UI-UX/40-EDITOR-UI-PANELS.md) - UI panels

### "I need to implement theme storage"
1. Read [12-THEME-SYSTEM.md](CORE-ARCHITECTURE/12-THEME-SYSTEM.md) - Theme architecture
2. Read [22-PHASE-1-SHARED-INFRASTRUCTURE.md](IMPLEMENTATION/22-PHASE-1-SHARED-INFRASTRUCTURE.md) - Phase 1.3 Theme Storage
3. Read [25-API-REFERENCE.md](IMPLEMENTATION/25-API-REFERENCE.md) - Store API functions

### "I need to implement the build system"
1. Read [21-PHASE-0-BUILD-SYSTEM.md](IMPLEMENTATION/21-PHASE-0-BUILD-SYSTEM.md) - Webpack setup
2. Read [23-CSS-PARSING-SYSTEM.md](IMPLEMENTATION/23-CSS-PARSING-SYSTEM.md) - CSS defaults parser

### "I need to understand data flow"
1. Read [14-DATA-FLOW.md](CORE-ARCHITECTURE/14-DATA-FLOW.md) - State management patterns
2. Read [24-WORDPRESS-INTEGRATION.md](IMPLEMENTATION/24-WORDPRESS-INTEGRATION.md) - @wordpress/* libraries usage

### "I need to write tests"
1. Read [50-TESTING-STRATEGY.md](TESTING/50-TESTING-STRATEGY.md) - Testing approach
2. Read [51-ACCESSIBILITY-TESTING.md](TESTING/51-ACCESSIBILITY-TESTING.md) - WCAG compliance
3. Read [52-PERFORMANCE-TESTING.md](TESTING/52-PERFORMANCE-TESTING.md) - Performance budgets

### "I need quick reference information"
- [01-QUICK-REFERENCE.md](01-QUICK-REFERENCE.md) - Attributes, API functions, examples
- [02-DECISIONS-LOG.md](02-DECISIONS-LOG.md) - All design decisions explained

---

## Implementation Order (Follow This Sequence)

### Phase 0: Build System (~270 LOC)
- [21-PHASE-0-BUILD-SYSTEM.md](IMPLEMENTATION/21-PHASE-0-BUILD-SYSTEM.md)

### Phase 1: Shared Infrastructure (~2,520 LOC) - MUST COMPLETE FIRST
- [22-PHASE-1-SHARED-INFRASTRUCTURE.md](IMPLEMENTATION/22-PHASE-1-SHARED-INFRASTRUCTURE.md)
- All 8 shared modules must be completed before block implementation

### Phase 2-4: Blocks (~5,300 LOC) - Can parallelize after Phase 1
- Accordion: [31-ACCORDION-SPEC.md](BLOCKS/31-ACCORDION-SPEC.md)
- Tabs: [32-TABS-SPEC.md](BLOCKS/32-TABS-SPEC.md)
- TOC: [33-TOC-SPEC.md](BLOCKS/33-TOC-SPEC.md)

### Phase 5: Integration (~200 LOC)
- Cross-block testing
- See [50-TESTING-STRATEGY.md](TESTING/50-TESTING-STRATEGY.md)

---

## File Organization

```
docs/
├── 00-START-HERE.md                    ← You are here
├── 01-QUICK-REFERENCE.md               Quick lookups
├── 02-DECISIONS-LOG.md                 Design decisions
│
├── CORE-ARCHITECTURE/
│   ├── 10-ARCHITECTURE-OVERVIEW.md     High-level overview
│   ├── 11-CASCADE-SYSTEM.md            3-tier value cascade
│   ├── 12-THEME-SYSTEM.md              Theme storage & operations
│   ├── 13-CUSTOMIZATION-CACHE.md       Session customizations
│   └── 14-DATA-FLOW.md                 State management
│
├── IMPLEMENTATION/
│   ├── 20-FILE-STRUCTURE.md            Directory tree
│   ├── 21-PHASE-0-BUILD-SYSTEM.md      Webpack config
│   ├── 22-PHASE-1-SHARED-INFRASTRUCTURE.md  Shared modules
│   ├── 23-CSS-PARSING-SYSTEM.md        CSS defaults parser
│   ├── 24-WORDPRESS-INTEGRATION.md     @wordpress/* libraries
│   └── 25-API-REFERENCE.md             API documentation
│
├── BLOCKS/
│   ├── 30-SHARED-ATTRIBUTES.md         All block attributes
│   ├── 31-ACCORDION-SPEC.md            Accordion implementation
│   ├── 32-TABS-SPEC.md                 Tabs implementation
│   └── 33-TOC-SPEC.md                  TOC implementation
│
├── UI-UX/
│   ├── 40-EDITOR-UI-PANELS.md          Inspector sidebar panels
│   ├── 41-THEME-SELECTOR-UI.md         Theme dropdown & workflows
│   ├── 42-CUSTOMIZATION-WORKFLOW.md    User interaction flows
│   └── 43-FRONTEND-RENDERING.md        Frontend output
│
├── TESTING/
│   ├── 50-TESTING-STRATEGY.md          Testing approach
│   ├── 51-ACCESSIBILITY-TESTING.md     WCAG compliance
│   └── 52-PERFORMANCE-TESTING.md       Performance budgets
│
└── LEGACY/                              Original documentation (backup)
```

---

## Design Principles (Non-Negotiable)

### 1. Simplified Architecture: Attributes as Source of Truth
**Rule**: Block attributes ARE the values (no complex cascade resolution)

**Why**: Simpler code, clearer intent, better performance, standard WordPress patterns

**Implementation**:
- **Edit Components**: `effectiveValues = attributes` (direct source of truth)
- **Theme System**: Stores deltas from defaults for optimization
- **Customization Detection**: Compare attributes to `expectedValues` (defaults + theme deltas)
- **Save Components**: Use 2-tier fallback (attributes → defaults) via cascade-resolver.js

### 2. Delta-Based Theme Storage
**Rule**: Themes store only differences from defaults (optimized storage)

**Why**: Smaller database footprint, clear intent, easier updates to defaults

**Implementation**:
- `calculateDeltas(snapshot, defaults)` extracts only changed values
- `applyDeltas(defaults, theme.values)` merges defaults + theme deltas → expectedValues
- Edit components compare attributes to expectedValues for customization detection

### 3. All Customizable Attributes Default to Null
**Rule**: Every attribute that participates in cascade has `default: null` in schema

**Why**: Explicit opt-in for customization, distinguishes "not set" from "set to default", allows CSS to be source of truth

### 4. Cascade Resolver for Save Components Only
**Rule**: cascade-resolver.js used ONLY in save.js for frontend fallback (attributes → defaults)

**Why**: Save components don't have access to theme store, need simple 2-tier fallback

**Edit Components**: Use simplified architecture (no cascade resolution needed)

**Implementation**: `getAllEffectiveValues(attributes, {}, defaults)` in save.js

### 5. Load Themes Before Render
**Rule**: Show spinner until themes loaded from database

**Why**: Prevents race conditions, undefined theme access, flash of incorrect state

### 6. Separate Storage Per Block Type
**Rule**: `accordion_themes`, `tabs_themes`, `toc_themes` - completely isolated

**Why**: Event isolation, one block type's theme changes don't affect others

### 7. Session Cache for Theme Switching
**Rule**: React State stores snapshots per theme during editing session

**Why**: Preserves customizations when switching themes temporarily

**Implementation**: `sessionCache = { "": {...}, "Dark Mode": {...} }` - per-theme snapshots in React state only

---

## Need Help?

- Need attribute default? Check [01-QUICK-REFERENCE.md](01-QUICK-REFERENCE.md)
- Need API signature? Check [25-API-REFERENCE.md](IMPLEMENTATION/25-API-REFERENCE.md)
- Why a specific design decision? Check "Rationale" sections in relevant technical docs
- Still unclear? Read the full spec for that component
