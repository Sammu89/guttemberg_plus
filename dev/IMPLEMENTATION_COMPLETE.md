# IMPLEMENTATION PLAN: Clean Pipeline + Structure Reorganization
**Project:** Guttemberg Plus WordPress Plugin
**Goal:** Single comprehensive schema pipeline + Professional folder structure
**Approach:** Multi-agent orchestrated implementation
**Estimated Duration:** 3 days (20 hours with buffer)
**Date Started:** 2026-01-17
**Date Updated:** 2026-01-18

---

## 🎯 IMPLEMENTATION STATUS

**Current Status:** Phases 0-5 Complete ✅

| Phase | Task | Status | Completed |
|-------|------|--------|-----------|
| 0 | File Structure Reorganization | ✅ COMPLETE | 2026-01-18 |
| 1 | Update All Import Paths | ✅ COMPLETE | 2026-01-18 |
| 2 | Embed Structure in Schema | ✅ COMPLETE | 2026-01-18 |
| 3 | Create Unified Build Script | ✅ COMPLETE | 2026-01-18 |
| 4 | Block Attributes Generator | ✅ COMPLETE | 2026-01-18 |
| 5 | Update Edit Components | ✅ COMPLETE | 2026-01-18 |
| 6 | Update Save Components | ⏳ PENDING | - |
| 7 | Update Theme System | ⏳ PENDING | - |
| 8 | Update CSS Generators | ⏳ PENDING | - |
| 9 | Delete Legacy Files | ⏳ PENDING | - |
| 10 | Update Documentation | ⏳ PENDING | - |

### Phase 0 Achievements (2026-01-18)
- ✅ 178 files moved with git history preserved
- ✅ Professional folder structure implemented
- ✅ Path lengths reduced by 30-37%
- ✅ 15+ new organized directories created
- ✅ 10+ old nested directories removed
- ✅ All validation gates passed

### Phase 1 Achievements (2026-01-18)
- ✅ 47 files with import paths updated
- ✅ Build system fully functional (`npm run build` passing)
- ✅ Schema compilation working (`npm run schema:build` passing)
- ✅ 30 files generated successfully in 1545ms
- ✅ Webpack compilation successful
- ✅ All module dependencies resolved

### Phase 2 Achievements (2026-01-18)
- ✅ Modified `schemas/parsers/orchestrator.js` to keep structure field
- ✅ Structure now embedded in all comprehensive schemas
- ✅ Accordion: 12 elements, Tabs: 7 elements, TOC: 14 elements
- ✅ Build verification successful
- ✅ All validation gates passed

### Phase 3 Achievements (2026-01-18)
- ✅ Created unified build script at `tools/build.js` (331 lines)
- ✅ 3-step pipeline with progress indicators
- ✅ Graceful degradation for missing generators
- ✅ Build completes in ~1.3s
- ✅ Clean console output with timing

### Phase 4 Achievements (2026-01-18)
- ✅ Created `tools/generators/attributes.js` generator
- ✅ All 3 block attribute files regenerated (326 total attributes)
- ✅ Transformed from macro-objects to atomic, flat, kebab-case format
- ✅ Accordion: 106 attrs, Tabs: 81 attrs, TOC: 139 attrs
- ✅ Special structural attributes included
- ✅ No duplicates, all properly formatted

### Phase 5 Achievements (2026-01-18)
- ✅ Updated all 3 edit.js files to use comprehensive schemas
- ✅ Using pre-computed `schema.defaultValues` instead of runtime computation
- ✅ 209 lines of code reduction across all files
- ✅ Build successful in ~8s
- ✅ All existing features preserved (themes, customizations)
- ✅ Performance improved with pre-computed defaults

### Build Verification (All Phases 0-5)
```bash
✅ npm run schema:build - Success (generates 3 comprehensive schemas + 3 attribute files)
✅ npm run build - Success (all blocks compile without errors)
✅ Structure embedded - All blocks verified
✅ Atomic attributes - 326 total across 3 blocks
✅ Edit components - Using comprehensive schemas
```

**Next Phase:** Phase 6 - Update Save Components

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Target Structure](#target-structure)
3. [Agent Definitions](#agent-definitions)
4. [Phase Breakdown](#phase-breakdown)
5. [File Migration Map](#file-migration-map)
6. [Orchestrator Instructions](#orchestrator-instructions)
7. [Testing Protocols](#testing-protocols)
8. [Success Criteria](#success-criteria)

---

## 🎯 EXECUTIVE SUMMARY

### Dual Objectives

**Objective 1: Clean Pipeline**
- Single comprehensive schema per block
- Everything derives from one source
- Delete all legacy dual-pipeline code

**Objective 2: Professional Structure**
- Cleanest possible folder organization
- Logical grouping (blocks, schemas, tools, styles, server)
- Shorter, clearer file paths
- Industry-standard conventions

### Strategy
- **Phase 0:** Reorganize file structure (foundation)
- **Phases 1-9:** Implement clean pipeline (on clean structure)
- **No backward compatibility** (clean break)
- **Incremental with validation gates**
- **Multi-agent coordination**

### Why Both Together?
- ✅ Clean structure from day 1
- ✅ No need to update paths twice
- ✅ Single migration effort
- ✅ Professional end result

---

## 🏗️ TARGET STRUCTURE

### Clean, Professional Organization

```
guttemberg-plus/
│
├── dev/                                    ← WORKING DIRECTORY (all source)
│   │
│   ├── blocks/                             ← WordPress Gutenberg blocks
│   │   ├── accordion/
│   │   │   ├── block.json                  ← WordPress block metadata
│   │   │   ├── attributes.js               ← Block attributes (generated, atomic)
│   │   │   ├── edit.js                     ← Editor component
│   │   │   ├── save.js                     ← Frontend render component
│   │   │   ├── index.js                    ← Block registration
│   │   │   └── frontend.js                 ← Frontend interactions
│   │   ├── tabs/
│   │   │   ├── block.json
│   │   │   ├── attributes.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   ├── index.js
│   │   │   ├── frontend.js

│   │
│   ├── shared/                             ← Shared React components & utilities
│   │   ├── components/
│   │   │   ├── SchemaPanels.js             ← Auto-generates sidebar panels
│   │   │   ├── ControlRenderer.js          ← Universal control renderer
│   │   │   ├── GenericPanel.js
│   │   │   ├── SubgroupPanel.js
│   │   │   ├── TabbedInspector.js
│   │   │   ├── ThemeSelector.js
│   │   │   ├── CustomizationWarning.js
│   │   │   ├── BreakpointSettings.js
│   │   │   └── controls/                   ← 30+ UI controls
│   │   │       ├── IconPanel.js
│   │   │       ├── ColorControl.js
│   │   │       ├── SliderWithInput.js
│   │   │       ├── BorderRadiusControl.js
│   │   │       ├── ShadowControl.js
│   │   │       ├── atoms/                  ← Atomic controls
│   │   │       ├── molecules/              ← Composite controls
│   │   │       └── organisms/              ← Complex controls
│   │   ├── hooks/
│   │   │   ├── useThemeManager.js          ← Centralized theme management
│   │   │   ├── useBlockAlignment.js
│   │   │   └── useResponsiveDevice.js
│   │   ├── utils/
│   │   │   ├── delta-calculator.js         ← Theme delta calculations
│   │   │   ├── cascade-resolver.js         ← Value cascade resolution
│   │   │   ├── icon-renderer.js
│   │   │   ├── buildBoxShadow.js
│   │   │   └── buildTextShadow.js
│   │   ├── data/                           ← Redux store
│   │   │   ├── index.js
│   │   │   ├── actions.js
│   │   │   ├── selectors.js
│   │   │   └── resolvers.js
│   │   ├── theme-system/
│   │   │   ├── cascade-resolver.js
│   │   │   ├── control-normalizer.js
│   │   │   └── theme-manager.js
│   │   ├── config/
│   │   │   ├── control-config.js           ← Control metadata (generated)
│   │   │   └── css-scales.mjs              ← CSS property scales & units
│   │   └── index.js                        ← Shared exports
│   │
│   ├── styles/                             ← All SCSS/CSS in one place
│   │   ├── blocks/
│   │   │   ├── accordion/
│   │   │   │   ├── editor.scss             ← Editor-specific styles
│   │   │   │   ├── frontend.scss           ← Frontend styles
│   │   │   │   └── variables.scss          ← CSS variables (generated)
│   │   │   ├── tabs/
│   │   │   │   ├── editor.scss
│   │   │   │   ├── frontend.scss
│   │   │   │   └── variables.scss
│   │   │   └── toc/
│   │   │       ├── editor.scss
│   │   │       ├── frontend.scss
│   │   │       └── variables.scss
│   │   └── shared/
│   │       └── utilities.scss              ← Shared utilities
│   │
│   ├── schemas/                            ← Schema system (source of truth)
│   │   ├── blocks/                         ← INPUT schemas (you edit these)
│   │   │   ├── accordion.json              ← Main schema
│   │   │   ├── accordion.html              ← HTML structure
│   │   │   ├── tabs.json
│   │   │   ├── tabs.html
│   │   │   ├── toc.json
│   │   │   └── toc.html
│   │   ├── generated/                      ← OUTPUT comprehensive schemas
│   │   │   ├── accordion.json              ← Complete comprehensive schema
│   │   │   ├── tabs.json
│   │   │   └── toc.json
│   │   └── parsers/                        ← Schema expansion tools
│   │       ├── orchestrator.js             ← Main pipeline orchestrator
│   │       ├── merger.js                   ← Merges schema + structure
│   │       ├── html-parser.js              ← Parses HTML templates
│   │       ├── naming-utils.js             ← CSS variable naming
│   │       └── expansors/                  ← Attribute expansors
│   │           ├── icon.js                 ← Icon expansion
│   │           ├── typography.js           ← Typography expansion
│   │           ├── border.js               ← Border expansion
│   │           ├── box.js                  ← Box (margin/padding) expansion
│   │           ├── color.js                ← Color expansion
│   │           ├── composite.js            ← Composite attributes
│   │           ├── responsive.js           ← Responsive variants
│   │           └── scss-generator.js       ← SCSS generation
│   │
│   ├── tools/                              ← Build tools & generators
│   │   ├── build.js                        ← Main build orchestrator
│   │   ├── generators/
│   │   │   ├── attributes.js               ← Block attributes generator
│   │   │   ├── css-vars-editor.js          ← Editor CSS vars
│   │   │   ├── css-vars-frontend.js        ← Frontend CSS vars
│   │   │   ├── styles.js                   ← Style builders
│   │   │   └── structure.js                ← Structure JSX generator
│   │   └── validators/
│   │       ├── schema.js                   ← Schema validation
│   │       └── code-completeness.js        ← Generated code validation
│   │
│   ├── docs/                               ← Documentation
│   │   ├── 00-START-HERE.md
│   │   ├── architecture/
│   │   │   ├── overview.md
│   │   │   ├── cascade-system.md
│   │   │   └── theme-system.md
│   │   ├── guides/
│   │   │   ├── adding-attributes.md
│   │   │   ├── adding-blocks.md
│   │   │   └── comprehensive-schema.md
│   │   └── api/
│   │       ├── accordion.md                ← Generated from schema
│   │       ├── tabs.md
│   │       └── toc.md
│   │
│   ├── package.json                        ← NPM configuration
│   ├── webpack.config.js                   ← WordPress build config
│   └── README.md                           ← Development readme
│
├── server/                                 ← PHP backend (outside dev)
│   ├── api/
│   │   ├── themes.php                      ← REST API for themes
│   │   └── css.php                         ← Dynamic CSS generation
│   ├── storage/
│   │   └── themes.php                      ← Database operations
│   ├── security.php                        ← Security utilities
│   └── init.php                            ← Backend initialization
│
├── includes/                               ← WordPress plugin includes
│   └── security.php                        ← Main security functions
│
├── build/                                  ← PRODUCTION BUILD OUTPUT
│   ├── blocks/                             ← Compiled blocks
│   ├── shared/                             ← Compiled shared code
│   └── assets/                             ← Compiled assets
│
├── guttemberg-plus.php                     ← Main plugin file
├── uninstall.php                           ← Uninstall script
├── LICENSE                                 ← License file
└── README.md                               ← Plugin readme
```

### Key Improvements

**Before:**
- `dev/blocks/accordion/src/accordion-attributes.js` (6 levels deep)
- `dev/schemas/accordion-comprehensive-autogenerated.json` (verbose)
- `dev/build-tools/generators/editor-css-vars-injector.js` (confusing)

**After:**
- `dev/blocks/accordion/attributes.js` (4 levels, clearer)
- `dev/schemas/generated/accordion.json` (organized)
- `dev/tools/generators/css-vars-editor.js` (concise)

---

## 🤖 AGENT DEFINITIONS

### Agent 1: File Reorganizer
**Role:** Reorganize folder structure
**Skills:** File operations, path management
**Responsibilities:**
- Move/rename files and folders
- Update import paths
- Verify no broken references

### Agent 2: Schema Architect
**Role:** Modify schema generation
**Skills:** JavaScript, JSON schema
**Responsibilities:**
- Fix structure embedding
- Verify comprehensive schema completeness

### Agent 3: Build Engineer
**Role:** Create new build pipeline
**Skills:** Node.js, build systems
**Responsibilities:**
- Create unified build script
- Update package.json scripts

### Agent 4: Generator Specialist
**Role:** Create/update generators
**Skills:** JavaScript, code generation
**Responsibilities:**
- Create atomic attributes generator
- Update CSS var generators

### Agent 5: React Developer
**Role:** Update block components
**Skills:** React, WordPress blocks
**Responsibilities:**
- Update edit.js (3 blocks)
- Update save.js (3 blocks)

### Agent 6: Theme System Engineer
**Role:** Update theme system
**Skills:** React hooks, Redux
**Responsibilities:**
- Update useThemeManager
- Update delta calculator

### Agent 7: Testing Specialist
**Role:** Validation and testing
**Skills:** Testing, debugging
**Responsibilities:**
- Run tests after each phase
- Verify outputs

### Agent 8: Cleanup Specialist
**Role:** Remove legacy code
**Skills:** File operations, documentation
**Responsibilities:**
- Delete legacy files
- Update documentation

### Orchestrator Agent
**Role:** Coordinate all agents
**Skills:** Project management
**Responsibilities:**
- Execute phases in order
- Validate gates
- Handle rollbacks

---

## 📊 PHASE BREAKDOWN

### PHASE 0: File Structure Reorganization (3 hours)
**Agent:** File Reorganizer
**Goal:** Clean, professional folder structure

**Context for Agent:**
```
TASK: Reorganize plugin file structure

OBJECTIVE: Create cleanest possible structure within dev/

CHANGES REQUIRED:

1. Reorganize schemas/:
   OLD: schemas/accordion-comprehensive-autogenerated.json
   NEW: schemas/generated/accordion.json

   OLD: schemas/parser/
   NEW: schemas/parsers/

   CREATE: schemas/blocks/ (move main schemas here)
   - Move accordion.json → schemas/blocks/accordion.json
   - Move accordion-structure.html → schemas/blocks/accordion.html
   - (same for tabs, toc)

2. Reorganize build-tools/:
   OLD: build-tools/
   NEW: tools/

   OLD: build-tools/unified-build.js
   NEW: tools/build.js

   OLD: build-tools/generators/
   NEW: tools/generators/

   Rename generators:
   - editor-css-vars-injector.js → css-vars-editor.js
   - frontend-css-vars-injector.js → css-vars-frontend.js
   - block-attributes-generator.js → attributes.js
   - style-builder-generator.js → styles.js
   - structure-jsx-generator.js → structure.js

3. Reorganize CSS:
   OLD: css/accordion_editor.scss
   NEW: styles/blocks/accordion/editor.scss

   OLD: css/accordion_hardcoded.scss
   NEW: styles/blocks/accordion/frontend.scss

   OLD: css/generated/accordion_variables.scss
   NEW: styles/blocks/accordion/variables.scss

4. Reorganize PHP:
   OLD: php/theme-storage.php
   NEW: server/storage/themes.php

   OLD: php/theme-rest-api.php
   NEW: server/api/themes.php

   OLD: php/theme-css-generator.php
   NEW: server/api/css.php

5. Reorganize blocks:
   OLD: blocks/accordion/src/accordion-attributes.js
   NEW: blocks/accordion/attributes.js

   OLD: blocks/accordion/src/edit.js
   NEW: blocks/accordion/edit.js

   (same for save.js, index.js, frontend.js)

   DELETE: blocks/accordion/src/ (folder now empty)

6. Reorganize shared config:
   OLD: shared/src/config/control-config-generated.js
   NEW: shared/config/control-config.js

   OLD: shared/src/config/css-property-scales.mjs
   NEW: shared/config/css-scales.mjs

7. Reorganize parsers:
   OLD: schemas/parser/main-orchestrator.js
   NEW: schemas/parsers/orchestrator.js

   OLD: schemas/parser/schema-merger.js
   NEW: schemas/parsers/merger.js

   OLD: schemas/parser/html-parser.js
   NEW: schemas/parsers/html-parser.js

   OLD: schemas/parser/icon-expansor.js
   NEW: schemas/parsers/expansors/icon.js

   (move all expansors into schemas/parsers/expansors/)

IMPORTANT:
- Use git mv to preserve history
- Update ALL import statements
- Test build after each major move
```

**Files to Move (60+ files):**

See Appendix A for complete file migration map.

**Testing:**
```bash
# After each group of moves, verify:
git status
# Should show renamed files (not deleted + added)

# Try build (will fail but shouldn't error on missing files)
npm run build 2>&1 | grep "Cannot find module"
# Should show import errors (we'll fix in next phase)
```

**Validation Gate:**
- [ ] All files moved to new locations
- [ ] No files lost (git mv used)
- [ ] Folder structure matches target
- [ ] Old folders deleted
- [ ] Git history preserved

**Rollback:**
```bash
git reset --hard HEAD
# Reverts all file moves
```

---

### PHASE 1: Update All Import Paths (2 hours)
**Agent:** File Reorganizer
**Goal:** Fix all broken imports after reorganization

**Context for Agent:**
```
TASK: Update all import paths to new structure

SEARCH & REPLACE PATTERNS:

1. Schema imports in blocks:
   OLD: import schema from '../../../schemas/accordion-comprehensive-autogenerated.json'
   NEW: import schema from '../../schemas/generated/accordion.json'

2. Schema parser imports in tools:
   OLD: require('../schemas/parser/main-orchestrator.js')
   NEW: require('../schemas/parsers/orchestrator.js')

3. Generator imports in build script:
   OLD: require('./generators/editor-css-vars-injector.js')
   NEW: require('./generators/css-vars-editor.js')

4. CSS imports in SCSS:
   OLD: @import '../css/generated/accordion_variables.scss';
   NEW: @import '../styles/blocks/accordion/variables.scss';

5. Shared component imports:
   OLD: import { ThemeSelector } from '../../shared/src/components/'
   NEW: import { ThemeSelector } from '../../shared/components/'

USE THIS SCRIPT to help:
```bash
#!/bin/bash
# fix-imports.sh

# Fix schema imports in blocks
find blocks -name "*.js" -exec sed -i 's|schemas/.*-comprehensive-autogenerated\.json|schemas/generated/${block}.json|g' {} \;

# Fix parser imports
find . -name "*.js" -exec sed -i 's|schemas/parser/|schemas/parsers/|g' {} \;

# Fix CSS imports
find styles -name "*.scss" -exec sed -i 's|../css/|../styles/|g' {} \;

# More replacements...
```

UPDATE THESE FILES (~40 files):
- All blocks: edit.js, save.js (import schema)
- tools/build.js (import parsers, generators)
- All generators (import parsers, utils)
- package.json (script paths)
- webpack.config.js (entry points)
- guttemberg-plus.php (PHP includes)
```

**Testing:**
```bash
# Test imports
npm run build

# Should complete without "Cannot find module" errors
```

**Validation Gate:**
- [ ] Build succeeds (no import errors)
- [ ] All modules found
- [ ] No broken references
- [ ] Webpack resolves all paths

**Rollback:**
```bash
git checkout .
# Reverts all import changes
```

---

### PHASE 2: Embed Structure in Schema (30 min)
**Agent:** Schema Architect
**Goal:** Make comprehensive schema complete

**Context for Agent:**
```
TASK: Embed structure in comprehensive schema

FILE: schemas/parsers/orchestrator.js (was main-orchestrator.js)

CURRENT CODE (lines ~390-400):
```javascript
const { structure: _ignored, ...withoutStructure } = comprehensiveSchema;
const payload = JSON.stringify(withoutStructure, null, 2) + '\n';
fs.writeFileSync(outputPath, payload, 'utf8');
```

NEW CODE:
```javascript
const payload = JSON.stringify(comprehensiveSchema, null, 2) + '\n';
fs.writeFileSync(outputPath, payload, 'utf8');
```

DELETE: Lines that strip structure (entire function writeComprehensive logic for splitting)

RESULT: schemas/generated/accordion.json now contains embedded structure field
```

**Testing:**
```bash
npm run schema:build

# Verify structure embedded
node -e "const s = require('./schemas/generated/accordion.json'); console.log(s.structure ? 'PASS' : 'FAIL');"
```

**Validation Gate:**
- [ ] orchestrator.js modified
- [ ] Build succeeds
- [ ] Comprehensive schema has structure field
- [ ] Structure contains elements

**Rollback:**
```bash
git checkout schemas/parsers/orchestrator.js
```

---

### PHASE 3: Create Unified Build Script (1 hour)
**Agent:** Build Engineer
**Goal:** New build entry point using comprehensive schema

**Context for Agent:**
```
TASK: Create unified build script

FILE: tools/build.js (new file)

CONTENT:
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BLOCKS = ['accordion', 'tabs', 'toc'];
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🚀 Building Guttemberg Plus...\n');

try {
  // Step 1: Generate comprehensive schemas
  console.log('📋 Step 1: Generating schemas...');
  for (const block of BLOCKS) {
    const inputPath = path.join(ROOT_DIR, 'schemas/blocks', `${block}.json`);
    const outputPath = path.join(ROOT_DIR, 'schemas/generated', `${block}.json`);

    execSync(
      `node schemas/parsers/orchestrator.js ${inputPath} --out ${outputPath}`,
      { cwd: ROOT_DIR, stdio: 'inherit' }
    );
  }

  // Step 2: Generate block attributes
  console.log('\n📋 Step 2: Generating attributes...');
  const { generateAttributes } = require('./generators/attributes.js');
  for (const block of BLOCKS) {
    const schema = require(`../schemas/generated/${block}.json`);
    generateAttributes(block, schema);
  }

  // Step 3: Generate CSS vars
  console.log('\n📋 Step 3: Generating CSS...');
  const { generateEditorCssVars } = require('./generators/css-vars-editor.js');
  const { generateFrontendCssVars } = require('./generators/css-vars-frontend.js');
  for (const block of BLOCKS) {
    const schema = require(`../schemas/generated/${block}.json`);
    generateEditorCssVars(block, schema);
    generateFrontendCssVars(block, schema);
  }

  console.log('\n✅ Schema build complete!\n');
} catch (err) {
  console.error('\n❌ Build failed:', err.message);
  process.exit(1);
}
```

UPDATE: package.json
```json
{
  "scripts": {
    "schema:build": "node tools/build.js",
    "prebuild": "npm run schema:build",
    "build": "wp-scripts build"
  }
}
```
```

**Testing:**
```bash
npm run schema:build
# Should complete without errors
```

**Validation Gate:**
- [ ] tools/build.js created
- [ ] package.json updated
- [ ] Build runs without errors
- [ ] Schemas generated

**Rollback:**
```bash
rm tools/build.js
git checkout package.json
```

---

### PHASE 4: Block Attributes Generator (2 hours)
**Agent:** Generator Specialist
**Goal:** Generate atomic block attributes

**Context for Agent:**
```
TASK: Create atomic attributes generator

FILE: tools/generators/attributes.js (new file)

PURPOSE: Generate WordPress block attributes from comprehensive schema

INPUT: schemas/generated/accordion.json
OUTPUT: blocks/accordion/attributes.js

FORMAT CHANGE:
OLD (macro objects):
{
  blockBox: { type: 'object', default: {...} }
}

NEW (atomic, kebab-case):
{
  'block-box-border-width-top': { type: 'string', default: '1px' }
}

CODE: See Appendix B for complete template
```

**Testing:**
```bash
npm run schema:build

cat blocks/accordion/attributes.js
# Should see atomic, kebab-case attributes
```

**Validation Gate:**
- [ ] Generator created
- [ ] Attributes generated for all 3 blocks
- [ ] Attributes atomic, kebab-case
- [ ] Special attributes included (currentTheme, customizations, etc.)

**Rollback:**
```bash
rm tools/generators/attributes.js
git checkout blocks/*/attributes.js
```

---

### PHASE 5: Update Edit Components (2 hours)
**Agent:** React Developer
**Goal:** Edit components use comprehensive schema

**Context for Agent:**
```
TASK: Update edit.js to use comprehensive schema

FILES:
- blocks/accordion/edit.js
- blocks/tabs/edit.js
- blocks/toc/edit.js

CHANGES:

1. Import comprehensive schema:
   OLD: import schema from '../../schemas/accordion-schema-autogenerated.json'
   NEW: import schema from '../../schemas/generated/accordion.json'

2. Use schema.defaultValues:
   OLD: Build defaults from attributes manually
   NEW: const defaults = schema.defaultValues || {};

3. Generate CSS vars from schema:
   OLD: Use buildEditorCssVars()
   NEW: Build from schema.attributes directly (see template)

See Appendix C for code template
```

**Testing:**
```bash
npm run build

# Manual: Open WordPress editor, add block
# Verify: No console errors, CSS applied
```

**Validation Gate:**
- [ ] All 3 edit.js updated
- [ ] Build succeeds
- [ ] No console errors in editor
- [ ] CSS variables applied

**Rollback:**
```bash
git checkout blocks/*/edit.js
```

---

### PHASE 6: Update Save Components (1 hour)
**Agent:** React Developer
**Goal:** Save components use comprehensive schema

**Context:** Same as Phase 5 but for save.js files

**Validation Gate:**
- [ ] All 3 save.js updated
- [ ] Build succeeds
- [ ] Frontend renders correctly
- [ ] HTML output matches editor

---

### PHASE 7: Update Theme System (2 hours)
**Agent:** Theme System Engineer
**Goal:** Theme system works with atomic attributes

**Context for Agent:**
```
TASK: Update theme system for atomic attributes

FILES:
- shared/hooks/useThemeManager.js
- shared/utils/delta-calculator.js

CHANGES:
- Theme deltas use atomic, kebab-case keys
- Customization detection works with atomic attributes
- Delta calculation handles new format

CURRENT: { blockBox: { border: { width: { top: 5 } } } }
TARGET:  { 'block-box-border-width-top': '5px' }
```

**Testing:**
```bash
# Manual in WordPress:
# 1. Create block, customize
# 2. Save as theme
# 3. Check Redux: deltas should be atomic
# 4. Apply theme to new block
# 5. Verify customizations applied
```

**Validation Gate:**
- [ ] Theme system updated
- [ ] Build succeeds
- [ ] Theme save/load works
- [ ] Deltas are atomic (kebab-case)

---

### PHASE 8: Update CSS Generators (2 hours)
**Agent:** Generator Specialist
**Goal:** CSS generators use comprehensive schema

**Context for Agent:**
```
TASK: Update CSS/SCSS generators

FILES:
- tools/generators/css-vars-editor.js
- tools/generators/css-vars-frontend.js
- tools/generators/styles.js

CHANGES:
- Use schema.cssVarMap instead of hardcoded mappings
- Use schema.selectorVarMap for selectors
- Use schema.responsiveSelectors for responsive variants
- Remove dependency on legacy css-var-mappings-generated.js

INPUTS: schemas/generated/accordion.json
OUTPUTS:
- shared/styles/accordion-css-vars.js
- shared/styles/accordion-frontend-css-vars.js
- styles/blocks/accordion/variables.scss
```

**Testing:**
```bash
npm run schema:build

# Check generated CSS vars
cat shared/styles/accordion-css-vars.js
cat styles/blocks/accordion/variables.scss
```

**Validation Gate:**
- [ ] Generators updated
- [ ] Build succeeds
- [ ] CSS vars correct
- [ ] SCSS correct

---

### PHASE 9: Delete Legacy Files (30 min)
**Agent:** Cleanup Specialist
**Goal:** Remove all legacy code

**Context for Agent:**
```
TASK: Delete legacy files

FILES TO DELETE:

Legacy schemas (old structure):
❌ schemas/accordion-schema-autogenerated.json
❌ schemas/tabs-schema-autogenerated.json
❌ schemas/toc-schema-autogenerated.json
❌ schemas/shared-templates.json (if unused)

Legacy PHP defaults:
❌ server/css-defaults/accordion.php (old location: php/css-defaults/)
❌ server/css-defaults/tabs.php
❌ server/css-defaults/toc.php

Legacy config:
❌ shared/config/css-var-mappings-generated.js

Legacy build tools (if not already deleted):
❌ Any remaining files in old build-tools/ location

BEFORE DELETING:
Search for imports:
  grep -r "accordion-schema-autogenerated" .
  grep -r "css-var-mappings-generated" .

Should return NO results
```

**Testing:**
```bash
# Verify no references
grep -r "accordion-schema-autogenerated" --exclude-dir=node_modules .

# Build should still work
npm run build
```

**Validation Gate:**
- [ ] Legacy files deleted
- [ ] No broken imports
- [ ] Build succeeds
- [ ] No references to deleted files

---

### PHASE 10: Update Documentation (1 hour)
**Agent:** Cleanup Specialist
**Goal:** Update all docs for new structure

**Context for Agent:**
```
TASK: Update documentation

FILES TO UPDATE:

1. CLAUDE.md
   - Update architecture section
   - New file paths
   - Remove schema-compiler references

2. README.md
   - Update quick start
   - New build commands

3. docs/guides/adding-attributes.md (create new)
   - Step-by-step guide with new paths
   - Example workflow

4. docs/guides/comprehensive-schema.md (create new)
   - Explain schema structure
   - Document all fields

5. docs/architecture/overview.md
   - Update with new folder structure
   - Show clean pipeline diagram
```

**Validation Gate:**
- [ ] Documentation updated
- [ ] New guides created
- [ ] Examples use correct paths
- [ ] No outdated references

---

## 🗺️ FILE MIGRATION MAP (Appendix A)

### Complete Before → After Mapping

```
SCHEMAS
───────
schemas/accordion.json                                    → schemas/blocks/accordion.json
schemas/accordion-structure.html                          → schemas/blocks/accordion.html
schemas/accordion-comprehensive-autogenerated.json        → schemas/generated/accordion.json
schemas/parser/                                           → schemas/parsers/
schemas/parser/main-orchestrator.js                       → schemas/parsers/orchestrator.js
schemas/parser/schema-merger.js                           → schemas/parsers/merger.js
schemas/parser/icon-expansor.js                           → schemas/parsers/expansors/icon.js
schemas/parser/typography-expansor.js                     → schemas/parsers/expansors/typography.js
schemas/parser/border-expansor.js                         → schemas/parsers/expansors/border.js
schemas/parser/box-expansor.js                            → schemas/parsers/expansors/box.js
schemas/parser/color-expansor.js                          → schemas/parsers/expansors/color.js
schemas/parser/composite-expansor.js                      → schemas/parsers/expansors/composite.js
schemas/parser/responsive-expansor.js                     → schemas/parsers/expansors/responsive.js
schemas/parser/scss-generator.js                          → schemas/parsers/expansors/scss-generator.js

(Same for tabs, toc)

BLOCKS
──────
blocks/accordion/src/accordion-attributes.js              → blocks/accordion/attributes.js
blocks/accordion/src/edit.js                              → blocks/accordion/edit.js
blocks/accordion/src/save.js                              → blocks/accordion/save.js
blocks/accordion/src/index.js                             → blocks/accordion/index.js
blocks/accordion/src/frontend.js                          → blocks/accordion/frontend.js
DELETE: blocks/accordion/src/                             (folder now empty)

(Same for tabs, toc)

BUILD TOOLS
───────────
build-tools/                                              → tools/
build-tools/unified-build.js                              → tools/build.js
build-tools/generators/block-attributes-generator.js      → tools/generators/attributes.js
build-tools/generators/editor-css-vars-injector.js        → tools/generators/css-vars-editor.js
build-tools/generators/frontend-css-vars-injector.js      → tools/generators/css-vars-frontend.js
build-tools/generators/style-builder-generator.js         → tools/generators/styles.js
build-tools/generators/structure-jsx-generator.js         → tools/generators/structure.js
build-tools/validators/                                   → tools/validators/

CSS/STYLES
──────────
css/accordion_editor.scss                                 → styles/blocks/accordion/editor.scss
css/accordion_hardcoded.scss                              → styles/blocks/accordion/frontend.scss
css/generated/accordion_variables.scss                    → styles/blocks/accordion/variables.scss

(Same for tabs, toc)

PHP/SERVER
──────────
php/theme-storage.php                                     → server/storage/themes.php
php/theme-rest-api.php                                    → server/api/themes.php
php/theme-css-generator.php                               → server/api/css.php
php/css-defaults/                                         → server/css-defaults/ (then delete)

SHARED
──────
shared/src/                                               → shared/
shared/src/components/                                    → shared/components/
shared/src/hooks/                                         → shared/hooks/
shared/src/utils/                                         → shared/utils/
shared/src/data/                                          → shared/data/
shared/src/theme-system/                                  → shared/theme-system/
shared/src/config/control-config-generated.js             → shared/config/control-config.js
shared/src/config/css-property-scales.mjs                 → shared/config/css-scales.mjs
shared/src/index.js                                       → shared/index.js

DOCUMENTATION
─────────────
docs/accordion-attributes.md                              → docs/api/accordion.md
docs/tabs-attributes.md                                   → docs/api/tabs.md
docs/toc-attributes.md                                    → docs/api/toc.md
docs/10-ARCHITECTURE-OVERVIEW.md                          → docs/architecture/overview.md
docs/11-CASCADE-SYSTEM.md                                 → docs/architecture/cascade-system.md
docs/12-THEME-SYSTEM.md                                   → docs/architecture/theme-system.md
```

---

## 📚 CODE TEMPLATES (Appendices B & C)

### Appendix B: Attributes Generator Template

```javascript
// tools/generators/attributes.js
const fs = require('fs');
const path = require('path');

function generateAttributes(blockType, schema) {
  const { attributes, blockName } = schema;
  const lines = [];

  // Special structural attributes
  lines.push(`  currentTheme: { type: 'string', default: '' },`);
  lines.push(`  customizations: { type: 'object', default: {} },`);
  lines.push(`  ${blockType}Id: { type: 'string', default: '' },`);

  // From comprehensive schema
  Object.entries(attributes).forEach(([name, def]) => {
    const type = def.type || 'string';
    const defaultValue = JSON.stringify(def.default);
    lines.push(`  '${name}': { type: '${type}', default: ${defaultValue} },`);
  });

  const output = `/**
 * Block Attributes for ${blockName}
 * AUTO-GENERATED - DO NOT EDIT
 * Generated from: schemas/generated/${blockType}.json
 * Generated: ${new Date().toISOString()}
 */

export const ${blockType}Attributes = {
${lines.join('\n')}
};
`;

  const outputPath = path.join(__dirname, '..', '..', 'blocks', blockType, 'attributes.js');
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`  ✓ ${blockType}/attributes.js`);
}

module.exports = { generateAttributes };
```

### Appendix C: Edit Component Pattern

```javascript
// blocks/accordion/edit.js
import accordionSchema from '../../schemas/generated/accordion.json';

export default function Edit({ attributes, setAttributes, clientId }) {
  // Get defaults from comprehensive schema
  const defaults = useMemo(() => {
    return accordionSchema.defaultValues || {};
  }, []);

  // Generate CSS vars from schema
  const cssVars = useMemo(() => {
    const vars = {};

    Object.entries(accordionSchema.attributes).forEach(([attrName, attrDef]) => {
      if (attrDef.cssVar && attrDef.outputsCSS !== false) {
        const value = effectiveValues[attrName] ?? defaults[attrName];
        if (value !== undefined) {
          vars[attrDef.cssVar] = value;
        }
      }
    });

    return vars;
  }, [effectiveValues, defaults]);

  // Rest of component...
}
```

---

## ✅ SUCCESS CRITERIA

### Technical
1. ✅ Clean folder structure (dev/blocks, dev/schemas, dev/tools, server)
2. ✅ One comprehensive schema per block (with embedded structure)
3. ✅ Everything derives from comprehensive schema
4. ✅ All legacy files deleted
5. ✅ Atomic, kebab-case attributes
6. ✅ Build completes < 30 seconds

### Functional
7. ✅ All 3 blocks work (accordion, tabs, TOC)
8. ✅ Theme system works (create/save/apply/delete)
9. ✅ Frontend rendering matches editor
10. ✅ No console errors

### Code Quality
11. ✅ Professional folder structure
12. ✅ Clear file naming
13. ✅ Logical grouping
14. ✅ Documentation updated

---

## 🎬 EXECUTION TIMELINE

**Total: 3 days (20 hours with buffer)**

| Phase | Task | Duration |
|-------|------|----------|
| 0 | File reorganization | 3 hours |
| 1 | Fix import paths | 2 hours |
| 2 | Embed structure | 30 min |
| 3 | Unified build | 1 hour |
| 4 | Attributes generator | 2 hours |
| 5 | Update edit.js | 2 hours |
| 6 | Update save.js | 1 hour |
| 7 | Update theme system | 2 hours |
| 8 | Update CSS generators | 2 hours |
| 9 | Delete legacy | 30 min |
| 10 | Update docs | 1 hour |
| **Testing** | **Integration tests** | **3 hours** |
| **TOTAL** | | **20 hours** |

---

**END OF IMPLEMENTATION PLAN**

Ready for multi-agent orchestrated execution with cleanest possible structure!
