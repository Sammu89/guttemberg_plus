# Agent Orchestrator Setup: Theme System Migration to Schema-First Architecture

**Document Version:** 1.0
**Date:** November 22, 2025
**Scope:** Complete migration from current theme mechanics to schema-first architecture (3 blocks: accordion, tabs, toc)
**Backwards Compatibility:** NONE - Clean break, full replacement
**Execution Strategy:** Multi-agent parallel + sequential orchestration

---

## Table of Contents

1. [Executive Overview](#executive-overview)
2. [Pre-Migration Validation](#pre-migration-validation)
3. [Agent Orchestrator Architecture](#agent-orchestrator-architecture)
4. [Phase 1: Foundation & Validation (Parallel)](#phase-1-foundation--validation-parallel)
5. [Phase 2: Schema Creation (Parallel)](#phase-2-schema-creation-parallel)
6. [Phase 3: Build System Implementation (Sequential)](#phase-3-build-system-implementation-sequential)
7. [Phase 4: Code Generation & Validation (Sequential)](#phase-4-code-generation--validation-sequential)
8. [Phase 5: Block Migration (Parallel)](#phase-5-block-migration-parallel)
9. [Phase 6: Integration & Testing (Sequential)](#phase-6-integration--testing-sequential)
10. [Phase 7: Cleanup & Verification (Sequential)](#phase-7-cleanup--verification-sequential)
11. [Orchestrator Execution Flow](#orchestrator-execution-flow)
12. [Decision Points & Rollback](#decision-points--rollback)
13. [Success Criteria](#success-criteria)

---

## Executive Overview

### What We're Doing

Migrating from a **fragmented multi-file theme system** (111 manual PHP mappings, 6+ files to sync, 47 synchronization points) to a **single-source-of-truth schema-based architecture** with zero backwards compatibility.

### Why It's Different

- **No backwards compat = clean slate** - We delete old files entirely, not refactor them
- **No legacy code paths** - All theme loading goes through new schema system
- **Parallel agents** - Multiple agents work simultaneously where safe
- **Orchestrator control** - Central coordinator manages phase transitions and dependencies

### Timeline & Effort

- **Total Duration:** 5-7 working days (can compress to 3-4 with full-time focus)
- **Parallel Potential:** ~40% of work runs in parallel
- **Agents Needed:** 6-8 specialized agents + 1 orchestrator

### Key Outcome

**Before:** 22 minutes to add one attribute, 4 failure points
**After:** 2 minutes to add one attribute, 0 failure points

---

## Pre-Migration Validation

### Critical Questions (Ask User)

Before starting, confirm these items:

1. **Database Backup**
   - Have you backed up the database?
   - Have you committed current working state to git?
   - ✅ **Requirement:** Both must be yes before proceeding

2. **Existing Theme Data**
   - Should we export existing themes before migration?
   - Do you want a migration script for user-created themes?
   - ✅ **Decision Point:** Export themes as JSON for reference?

3. **Testing Environment**
   - Is this running on a staging/local environment (confirm: yes)?
   - Do you have the Gutenberg editor environment set up?
   - ✅ **Requirement:** Must be local/staging, never production first

4. **Code Review**
   - Who reviews the generated code (architect/lead dev)?
   - Should migration be in a PR before merging?
   - ✅ **Decision Point:** Formal PR review needed?

---

## Agent Orchestrator Architecture

### Orchestrator Responsibilities

The **Master Orchestrator Agent** manages:
1. **Phase sequencing** - Ensures phases run in order
2. **Dependency tracking** - Prevents agents from running before dependencies complete
3. **Parallel coordination** - Groups agents that can run together
4. **Error aggregation** - Collects errors from all agents
5. **Rollback decisions** - Determines if migration should stop or continue
6. **State persistence** - Tracks what's been completed

### Agent Roles & Responsibilities

| Agent | Type | Parallelizable | Purpose |
|-------|------|-----------------|---------|
| **ORCHESTRATOR** | Master | No | Coordinates all phases, manages state, decides phase transitions |
| **SCHEMA_ARCHITECT** | Specialized | Yes (with others) | Analyzes current system, designs schemas |
| **SCHEMA_GENERATOR** | Specialized | Yes (with VALIDATOR) | Creates JSON schema files from analysis |
| **SCHEMA_VALIDATOR** | Specialized | Yes (with GENERATOR) | Validates schema completeness & correctness |
| **BUILD_TOOL_ENGINEER** | Code-focused | No | Writes schema compiler, integration |
| **CODE_GENERATOR** | Automated | Sequential | Runs schema compiler, produces artifacts |
| **BLOCK_MIGRATOR_A/B/C** | Code-focused | Yes (3 parallel) | Migrates accordion/tabs/toc blocks respectively |
| **INTEGRATION_TESTER** | Test-focused | Sequential | Tests entire system end-to-end |
| **CLEANUP_SPECIALIST** | Maintenance | Sequential | Removes old files, verifies no dangling refs |

### Orchestrator State Machine

```
START
  ↓
PRE_MIGRATION_VALIDATION → [User Decisions] → PROCEED or STOP
  ↓
PHASE_1_FOUNDATION (Parallel: SCHEMA_ARCHITECT, SCHEMA_GENERATOR, SCHEMA_VALIDATOR)
  ↓ [All agents report complete]
CHECKPOINT_1: Verify schemas valid
  ↓
PHASE_2_BUILD_SYSTEM (Sequential: BUILD_TOOL_ENGINEER)
  ↓
CHECKPOINT_2: Verify build script functional
  ↓
PHASE_3_CODE_GENERATION (Sequential: CODE_GENERATOR)
  ↓
CHECKPOINT_3: Verify all artifacts generated
  ↓
PHASE_4_BLOCK_MIGRATION (Parallel: BLOCK_MIGRATOR_A, B, C)
  ↓ [All agents report complete]
CHECKPOINT_4: Verify each block migrated
  ↓
PHASE_5_INTEGRATION_TESTING (Sequential: INTEGRATION_TESTER)
  ↓
CHECKPOINT_5: All tests passing
  ↓
PHASE_6_CLEANUP (Sequential: CLEANUP_SPECIALIST)
  ↓
CHECKPOINT_6: No dangling references
  ↓
SUCCESS: Migration complete, ready for testing
```

---

## Phase 1: Foundation & Validation (Parallel)

### What Happens

Three agents work **in parallel** to analyze current system and design schemas:

- **SCHEMA_ARCHITECT** - Analyzes current attributes, groupings, types
- **SCHEMA_GENERATOR** - Creates JSON schema files
- **SCHEMA_VALIDATOR** - Validates schemas are complete and correct

### Agent 1: SCHEMA_ARCHITECT

**Task:** Analyze current system and design schema structure

**Inputs:**
- Current block attribute definitions (accordion-attributes.js, tabs-attributes.js, toc-attributes.js)
- Current CSS variable definitions (assets/css/*.css)
- Current PHP defaults (php/css-defaults/*.php)
- Current exclusion lists (shared/src/config/theme-exclusions.js)

**Process:**
1. Extract all attributes from each block
2. Classify each attribute: themeable vs structural vs behavioral vs content
3. Map attributes to CSS variable names (derive from current code)
4. Map attributes to UI controls (detect from edit.js)
5. Group attributes by category (colors, typography, borders, layout, behavior)
6. Document each attribute's metadata

**Outputs:**
- Analysis document per block (accordion-analysis.md, tabs-analysis.md, toc-analysis.md)
- Mapping spreadsheet: attribute → css-var → default → themeable → ui-control
- Schema design template (what goes in schema JSON)

**Success Criteria:**
- [ ] All 60+ attributes per block documented
- [ ] All CSS variable mappings identified
- [ ] All defaults captured
- [ ] All exclusions mapped to attributes
- [ ] All UI controls identified

**Parallel Wait:** Can start immediately
**Parallel Dependencies:** None (can run with SCHEMA_GENERATOR and SCHEMA_VALIDATOR)

---

### Agent 2: SCHEMA_GENERATOR

**Task:** Create JSON schema files for each block

**Inputs:**
- SCHEMA_ARCHITECT's analysis outputs
- Template schema structure (from SCHEMA_ARCHITECTURE_PROPOSAL.md)

**Process:**
1. Create `schemas/` directory
2. For each block (accordion, tabs, toc):
   - Create schema JSON file with proper structure
   - Add all attributes with complete metadata
   - Include groups configuration
   - Add version and description
3. Ensure JSON is valid (check syntax)
4. Ensure all required fields present

**Outputs:**
- `schemas/accordion.json` (complete, valid)
- `schemas/tabs.json` (complete, valid)
- `schemas/toc.json` (complete, valid)

**Success Criteria:**
- [ ] All schemas parse as valid JSON
- [ ] All attributes have required fields (type, default, group, themeable)
- [ ] All themeable attributes have cssVar, cssDefault, control, label
- [ ] All non-themeable attributes have reason (structural, behavioral, content)
- [ ] Grouping makes sense (colors, typography, borders, layout, behavior)

**Parallel Wait:** Can start immediately
**Parallel Dependencies:** Receives input from SCHEMA_ARCHITECT (non-blocking)

---

### Agent 3: SCHEMA_VALIDATOR

**Task:** Validate schemas are complete and correct

**Inputs:**
- Completed schema JSON files from SCHEMA_GENERATOR
- SCHEMA_ARCHITECT's analysis (for cross-checking)
- Current attribute definitions (for completeness check)

**Process:**
1. **Structural validation:** Each schema has required top-level fields
2. **Attribute validation:**
   - All attributes from current system present in schema
   - No new attributes that don't exist
   - Types match current attribute types
   - Defaults match current defaults
3. **Themeable validation:**
   - All themeable attributes have cssVar
   - All cssVar names are unique per block
   - All cssDefault statements are syntactically valid CSS
4. **Exclusion validation:**
   - All excluded attributes have `"themeable": false`
   - All non-themeable have reason field
5. **Cross-reference validation:**
   - CSS variable names don't conflict across blocks
   - No duplicate attribute names across groups
6. **Metadata validation:**
   - All labels are human-readable
   - All descriptions are helpful
   - All control types are valid (ColorPicker, RangeControl, etc.)

**Outputs:**
- Validation report per schema (pass/fail with details)
- List of any discrepancies or warnings
- Sign-off if all schemas valid

**Success Criteria:**
- [ ] All schemas pass structural validation
- [ ] No missing attributes (completeness check)
- [ ] No type mismatches
- [ ] All defaults match current code
- [ ] All exclusions properly classified
- [ ] All CSS variables valid
- [ ] All metadata present and correct
- [ ] No conflicts or duplicates
- [ ] All 3 schemas report PASS

---

### Orchestrator Actions (Phase 1)

```
LAUNCH (in parallel):
├─ SCHEMA_ARCHITECT (with task description)
├─ SCHEMA_GENERATOR (with task description)
└─ SCHEMA_VALIDATOR (with task description)

WAIT for all three agents to report completion

IF all agents PASS:
  → Move to CHECKPOINT_1
ELSE IF any agent FAIL:
  → Collect error reports
  → Ask user: Continue with fixes or Rollback?
  → IF Continue: Assign fix tasks to agents
  → IF Rollback: Stop migration
```

---

## Phase 2: Schema Creation (Parallel)

### What Happens

Agents work in parallel to create missing schema infrastructure:

- Create schema directory structure
- Create schema files (in parallel with validation)
- Create schema documentation template

### Agent: SCHEMA_INFRASTRUCTURE_SETUP

**Task:** Create directories and supporting files

**Inputs:**
- Validated schemas from Phase 1
- Directory structure template

**Process:**
1. Create `schemas/` directory if not exists
2. Create `build-tools/` directory if not exists
3. Create `shared/src/types/` directory
4. Create `shared/src/validators/` directory
5. Create `docs/` directory for auto-generated docs
6. Create `.gitignore` for auto-generated files:
   ```
   # Auto-generated from schemas
   shared/src/types/*-theme.ts
   shared/src/validators/*-schema.ts
   php/css-defaults/*.php
   php/theme-css-generator.php
   assets/css/*-generated.css
   docs/*-attributes.md
   ```
7. Create `schemas/README.md` explaining schema structure

**Outputs:**
- All directories created
- `.gitignore` updated
- README explaining schema files

**Parallel Wait:** After Phase 1 validation
**Parallel Dependencies:** None (purely infrastructure)

---

## Phase 3: Build System Implementation (Sequential)

### What Happens

Build system is implemented **sequentially** (cannot parallelize):
1. Build tool engineer writes schema compiler
2. Integrate into build process
3. Test that build system works

### Agent: BUILD_TOOL_ENGINEER

**Task:** Implement schema compiler and integrate into build

**Inputs:**
- Schema files from Phase 1
- SCHEMA_ARCHITECTURE_PROPOSAL.md (reference implementation)
- Current package.json
- Current npm scripts

**Process:**

**Part 1: Create Schema Compiler**
1. Create `build-tools/schema-compiler.js`
   - Implement all generator functions:
     - `generateTypeScript()` - TS types and interfaces
     - `generatePHPAttributes()` - PHP attribute definitions
     - `generatePHPCSSDefaults()` - PHP Tier 1 defaults
     - `generatePHPMappings()` - PHP CSS variable mappings
     - `generateExclusions()` - JS exclusion lists
     - `generateCSSVariables()` - CSS variable declarations
     - `generateDocumentation()` - Markdown docs
     - `generateValidationSchema()` - Zod validation schemas
     - `generateCombinedPHPMappings()` - Combined PHP for all blocks
   - Include helper functions for type conversion
   - Add error handling and logging
   - Add file output with success messages

2. Create `build-tools/schema-validator.js`
   - Validates schema JSON before generation
   - Checks for required fields
   - Ensures type consistency
   - Reports validation errors with details

**Part 2: Integrate into Build Process**
1. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "schema:build": "node build-tools/schema-compiler.js",
       "schema:validate": "node build-tools/schema-validator.js",
       "build": "npm run schema:validate && npm run schema:build && wp-scripts build",
       "dev": "npm run schema:validate && npm run schema:build && wp-scripts start"
     }
   }
   ```

2. Create `build-tools/pre-commit.js`
   - Validates schemas before git commit
   - Ensures schemas stay valid

3. Document build process in `docs/DEVELOPMENT.md`

**Outputs:**
- `build-tools/schema-compiler.js` (complete, tested)
- `build-tools/schema-validator.js` (complete, tested)
- Updated `package.json`
- `build-tools/pre-commit.js`
- `docs/DEVELOPMENT.md`

**Success Criteria:**
- [ ] Schema compiler loads schemas correctly
- [ ] All generator functions work
- [ ] File output has correct permissions
- [ ] Error handling catches all failure cases
- [ ] npm run schema:validate works
- [ ] npm run schema:build works
- [ ] Integration doesn't break existing build

**Sequential Wait:** After Phase 2
**Sequential Dependencies:** Requires validated schemas, directory structure

---

## Phase 4: Code Generation & Validation (Sequential)

### What Happens

Schema compiler is run to generate all artifacts, then validated.

### Agent: CODE_GENERATOR

**Task:** Run schema compiler and produce all artifacts

**Inputs:**
- Schema files
- Build tools from Phase 3
- Build configuration

**Process:**
1. Run `npm run schema:validate`
   - Validate all 3 schemas
   - Exit if validation fails
2. Run `npm run schema:build`
   - Generate all artifacts:
     - TypeScript types (3 files)
     - PHP attributes (3 files)
     - PHP CSS defaults (3 files)
     - PHP CSS mappings (1 combined file)
     - JS exclusions (3 files)
     - CSS variables (3 files)
     - Documentation (3 files)
     - Validation schemas (3 files)
   - Verify all files created
   - Verify file sizes reasonable (no empty files)

**Outputs:**
- 24+ generated files in correct locations
- Build log showing all generations
- Verification report

**Success Criteria:**
- [ ] Schema validation passes for all 3 blocks
- [ ] All 24+ files generated
- [ ] No files are empty
- [ ] File syntax is valid (can be parsed)
- [ ] TypeScript compiles without errors
- [ ] PHP syntax is valid (can be linted)
- [ ] Generated code matches expected format

**Sequential Wait:** After Phase 3
**Sequential Dependencies:** Requires working build tools

---

### Agent: ARTIFACT_VALIDATOR

**Task:** Validate all generated artifacts are correct

**Inputs:**
- All generated files from CODE_GENERATOR
- Original schemas
- Current system code (for comparison)

**Process:**
1. **TypeScript Validation**
   - All interfaces can be imported
   - No type errors
   - Correct exports
   - Default themes match schema defaults

2. **PHP Validation**
   - All PHP files parse correctly (`php -l`)
   - Array syntax correct
   - No undefined variables
   - Mapping covers all themeable attributes

3. **JavaScript Validation**
   - All JS files parse correctly
   - Exports are correct
   - Exclusion lists match non-themeable attributes
   - No syntax errors

4. **CSS Validation**
   - CSS variables valid CSS syntax
   - Variable names follow pattern
   - Defaults match schema defaults
   - All themeable attributes have variables

5. **Consistency Validation**
   - TypeScript defaults == PHP defaults == Schema defaults
   - CSS variables == PHP CSS defaults (after parsing)
   - Exclusions == inverse of themeable attributes
   - All attribute names consistent across files

6. **Documentation Validation**
   - All attributes documented
   - No stale documentation
   - Markdown syntax valid

**Outputs:**
- Validation report per artifact type
- Discrepancy list (if any)
- Sign-off that all artifacts valid

**Success Criteria:**
- [ ] All TypeScript files valid and compile
- [ ] All PHP files pass linting
- [ ] All JavaScript files parse
- [ ] All CSS is valid
- [ ] All defaults consistent across languages
- [ ] No missing attributes in any artifact
- [ ] All documentation current
- [ ] Mapping completeness verified

**Sequential Wait:** After CODE_GENERATOR
**Sequential Dependencies:** Requires generated artifacts

---

## Phase 5: Block Migration (Parallel)

### What Happens

Three agents work **in parallel**, each migrating one block:

- **BLOCK_MIGRATOR_ACCORDION** - Migrate accordion block
- **BLOCK_MIGRATOR_TABS** - Migrate tabs block
- **BLOCK_MIGRATOR_TOC** - Migrate toc block

Each agent does the same work but for different block.

### Agent: BLOCK_MIGRATOR_X (Template for all 3)

**Task:** Migrate one block to use generated artifacts

**Inputs (for block X = accordion/tabs/toc):**
- Generated artifacts for block X
- Current block files (block.json, edit.js, save.js, *-attributes.js)
- Current store/utils (delta-calculator, theme-exclusions, etc.)

**Process:**

**Step 1: Register Generated Attributes**
1. Open `blocks/X/src/index.js`
2. Replace manual attribute definition with generated types:
   ```javascript
   import { XTheme } from '../../../shared/src/types/X-theme';
   // Use TypeScript type for validation
   ```
3. In `registerBlockType()`, use generated schema
4. Verify attributes load correctly

**Step 2: Update edit.js**
1. Remove old exclusion import:
   ```javascript
   // DELETE: import { X_EXCLUSIONS } from '...theme-exclusions.js'
   ```
2. Add new generated exclusion import:
   ```javascript
   import { X_EXCLUSIONS } from '../../../shared/src/config/X-exclusions.js'
   ```
3. Add generated validation:
   ```javascript
   import { XThemeSchema } from '../../../shared/src/validators/X-schema.ts'
   ```
4. Remove any hardcoded attribute lists
5. Wrap setAttributes with validation:
   ```javascript
   const setValidatedAttributes = (updates) => {
     const validated = XThemeSchema.partial().parse(updates);
     setAttributes(validated);
   }
   ```
6. Test that editor loads and works

**Step 3: Update save.js**
1. Remove any hardcoded CSS variable mappings
2. Import generated defaults:
   ```javascript
   import { XDefaultTheme } from '../../../shared/src/types/X-theme'
   ```
3. Use generated theme for comparison
4. Ensure inline styles generated correctly
5. Test that block renders and CSS applies

**Step 4: Remove Old Files**
1. Delete `blocks/X/src/X-attributes.js` (now generated)
2. Verify nothing imports from deleted file
3. Check git diff to confirm deletions

**Step 5: Integration Check**
1. Verify block loads in editor
2. Verify theme selector works
3. Verify customizations work
4. Verify theme save/load works
5. Verify CSS applies correctly
6. Check browser console for errors

**Outputs:**
- Updated block files (index.js, edit.js, save.js)
- Deleted old attribute files
- Verification report

**Success Criteria (per block):**
- [ ] Block loads in editor without errors
- [ ] All UI controls appear
- [ ] Theme selector works
- [ ] Customizations save
- [ ] Themes save and load
- [ ] CSS applies correctly (inline and theme)
- [ ] No console errors
- [ ] No missing attributes
- [ ] No type errors
- [ ] All exclusions correct (structural data not in themes)

**Parallel Wait:** After Phase 4 validation
**Parallel Dependencies:** Can run all 3 in parallel (no cross-block dependencies)

---

## Phase 6: Integration & Testing (Sequential)

### What Happens

System is tested end-to-end to ensure migration successful.

### Agent: INTEGRATION_TESTER

**Task:** Test entire system end-to-end

**Inputs:**
- All migrated blocks
- Full system with generated artifacts
- Test scenarios (from requirements)

**Process:**

**Part 1: Basic Functionality**
1. Load WordPress editor
2. For each block type:
   - Add block to page
   - Verify all attributes load
   - Verify all UI controls responsive
   - Verify no console errors

**Part 2: Theme System**
1. Create theme with default block values
2. Customize block
3. Save theme
4. Apply theme to new block
5. Verify all values transfer correctly
6. Verify customization preserved

**Part 3: CSS Cascade**
1. Verify Tier 1 (defaults) apply
2. Verify Tier 2 (theme) overrides Tier 1
3. Verify Tier 3 (customization) overrides Tiers 1 & 2
4. Check generated CSS in `<head>`
5. Check inline styles in block markup

**Part 4: Data Integrity**
1. Verify no structural data in theme (check exclusions honored)
2. Verify theme switching doesn't change structure
3. Verify delta calculation correct (theme contains only differences)
4. Verify round-trip: save theme → load → equals original

**Part 5: Edge Cases**
1. Empty theme (all defaults)
2. Full customization theme (all attributes changed)
3. Partial theme (some attributes changed)
4. Theme with special characters in name
5. Very large number of themes
6. Theme with unicode characters

**Part 6: Backwards Compatibility Check**
- Confirm: Old themes in database are NOT loaded
- Confirm: Old attribute structure is NOT supported
- Confirm: System fully migrated (no dual paths)

**Outputs:**
- Test results per scenario
- Bug list (if any)
- Performance metrics
- Integration report

**Success Criteria:**
- [ ] All blocks load correctly
- [ ] Theme save/load works
- [ ] CSS cascade correct
- [ ] No data in wrong tier
- [ ] Exclusions honored
- [ ] No console errors
- [ ] No PHP warnings/errors
- [ ] All edge cases handled
- [ ] No old code paths used
- [ ] System fully migrated

**Sequential Wait:** After Phase 5 block migrations
**Sequential Dependencies:** Requires all blocks migrated

---

## Phase 7: Cleanup & Verification (Sequential)

### What Happens

Old files removed, final verification that migration complete.

### Agent: CLEANUP_SPECIALIST

**Task:** Remove old files and verify clean migration

**Inputs:**
- List of files to delete (old theme system)
- Current codebase
- Git history

**Process:**

**Part 1: Identify All Files to Delete**
1. Old attribute definition files:
   - `blocks/accordion/src/accordion-attributes.js` (if not already deleted)
   - `blocks/tabs/src/tabs-attributes.js`
   - `blocks/toc/src/toc-attributes.js`

2. Old generated files (now coming from schema):
   - Delete and regenerate to ensure from schema:
     - `php/css-defaults/*.php`
     - `php/theme-css-generator.php` (old version)
     - Any hand-written CSS variable files

3. Old theme-related documentation:
   - `THEME-SYSTEM-AUDIT.md` (captured in schemas)
   - Old migration guides

4. Old cache/temporary files:
   - Any `.tmp`, `.cache` files related to old system

**Part 2: Search for Old References**
1. Search for imports of deleted files:
   ```bash
   grep -r "accordion-attributes.js" blocks/
   grep -r "tabs-attributes.js" blocks/
   grep -r "toc-attributes.js" blocks/
   ```
2. Search for hardcoded exclusion lists:
   ```bash
   grep -r "ACCORDION_EXCLUSIONS\|TABS_EXCLUSIONS\|TOC_EXCLUSIONS" blocks/
   ```
3. Search for old theme functions:
   ```bash
   grep -r "getAllDefaults" blocks/
   ```
4. Fix any remaining references to point to new generated files

**Part 3: Delete Old Files**
1. For each file identified:
   ```bash
   git rm blocks/accordion/src/accordion-attributes.js
   git rm php/css-defaults/accordion.php  # Will be regenerated
   # ... etc for all files
   ```
2. Run build to regenerate from schema:
   ```bash
   npm run schema:build
   ```
3. Verify regenerated files correct

**Part 4: Verify Complete Migration**
1. No imports from old files
2. No hardcoded attribute lists
3. No old exclusion list usage
4. All files either deleted or migrated
5. All imports point to generated files
6. No hybrid old/new code

**Part 5: Final Checks**
1. Run `npm run build` completely
2. Verify webpack compilation successful
3. Verify PHP linting passes
4. Verify TypeScript compilation passes
5. Check file sizes of generated artifacts (reasonable)
6. Verify `.gitignore` includes all generated files

**Outputs:**
- List of deleted files
- List of updated files
- Verification checklist completed
- Clean migration confirmation

**Success Criteria:**
- [ ] All old files deleted
- [ ] No references to old files remain
- [ ] All imports updated
- [ ] Generated artifacts from schema only
- [ ] Build succeeds
- [ ] No warnings in linting
- [ ] No unused code
- [ ] Git status clean
- [ ] Generated files in .gitignore
- [ ] Source of truth is schemas

**Sequential Wait:** After Phase 6 integration testing
**Sequential Dependencies:** Requires full system working

---

## Orchestrator Execution Flow

### Complete Orchestration Timeline

```
TIME: 0:00 - START
PHASE: Pre-Migration

ACTION: Ask User for Confirmations
  ├─ Database backed up? [REQUIRED: YES]
  ├─ Current state committed? [REQUIRED: YES]
  ├─ Local/staging environment? [REQUIRED: YES]
  ├─ Export existing themes? [DECISION: Y/N]
  └─ Formal PR review? [DECISION: Y/N]

IF any REQUIRED = NO → STOP and prompt user
IF all REQUIRED = YES → PROCEED

---

TIME: 0:10 - PHASE 1 START
ACTION: Launch 3 agents in parallel

  PARALLEL BLOCK A:
  ├─ Agent: SCHEMA_ARCHITECT
  │  Task: Analyze current system
  │  Status: Starting...
  │
  ├─ Agent: SCHEMA_GENERATOR
  │  Task: Create schema files
  │  Status: Starting...
  │
  └─ Agent: SCHEMA_VALIDATOR
     Task: Validate schemas
     Status: Waiting for schemas...

WAIT: All 3 agents complete OR any agent fails

CHECKPOINT 1:
  IF all PASS → CONTINUE to PHASE 2
  IF any FAIL →
    Show error report
    Ask user: Fix or Abort?
    IF Fix: Reassign to agents
    IF Abort: STOP migration

---

TIME: 1:00 - PHASE 2 START
ACTION: Launch infrastructure agent

  Agent: SCHEMA_INFRASTRUCTURE_SETUP
  Task: Create directories, .gitignore, README
  Status: Starting...

WAIT: Agent completes

CHECKPOINT 2:
  IF directories created → CONTINUE to PHASE 3
  IF fails → ABORT (non-recoverable)

---

TIME: 1:30 - PHASE 3 START
ACTION: Launch build tool engineer

  Agent: BUILD_TOOL_ENGINEER
  Task: Implement schema compiler
  Status: Starting...

WAIT: Agent completes

CHECKPOINT 3:
  IF build tools working → CONTINUE to PHASE 4
  IF fails → ABORT (non-recoverable)

---

TIME: 3:00 - PHASE 4 START
ACTION: Launch code generation agents (sequential)

  Step 1:
  Agent: CODE_GENERATOR
  Task: Run schema compiler
  Status: Starting...
  WAIT: Complete

  Step 2:
  Agent: ARTIFACT_VALIDATOR
  Task: Validate all generated files
  Status: Starting...
  WAIT: Complete

CHECKPOINT 4:
  IF all artifacts valid → CONTINUE to PHASE 5
  IF validation fails → Ask user: Regenerate or Abort?

---

TIME: 4:30 - PHASE 5 START
ACTION: Launch 3 block migrators in parallel

  PARALLEL BLOCK B:
  ├─ Agent: BLOCK_MIGRATOR_ACCORDION
  │  Task: Migrate accordion block
  │  Status: Starting...
  │
  ├─ Agent: BLOCK_MIGRATOR_TABS
  │  Task: Migrate tabs block
  │  Status: Starting...
  │
  └─ Agent: BLOCK_MIGRATOR_TOC
     Task: Migrate toc block
     Status: Starting...

WAIT: All 3 agents complete OR any agent fails

CHECKPOINT 5:
  IF all PASS → CONTINUE to PHASE 6
  IF any FAIL →
    Show which block(s) failed
    Ask user: Retry failed block or Abort?
    IF Retry: Re-run failed agent
    IF Abort: STOP migration

---

TIME: 6:00 - PHASE 6 START
ACTION: Launch integration tester

  Agent: INTEGRATION_TESTER
  Task: Test entire system end-to-end
  Status: Starting...

WAIT: Agent completes

CHECKPOINT 6:
  IF all tests PASS → CONTINUE to PHASE 7
  IF tests FAIL →
    Show test results
    Ask user: Fix issues or Abort?
    IF Fix: Identify failing block, reassign to migrator
    IF Abort: STOP migration

---

TIME: 7:30 - PHASE 7 START
ACTION: Launch cleanup specialist

  Agent: CLEANUP_SPECIALIST
  Task: Remove old files, verify clean migration
  Status: Starting...

WAIT: Agent completes

CHECKPOINT 7:
  IF migration clean → SUCCESS
  IF issues found →
    Show verification failures
    Ask user: Manual cleanup needed?

---

TIME: 8:00 - COMPLETE
STATUS: Migration Complete ✅

SUMMARY:
├─ ✅ Schemas created (3 files)
├─ ✅ Build system implemented
├─ ✅ All artifacts generated (24+ files)
├─ ✅ All blocks migrated (3 blocks)
├─ ✅ Integration tests passed
├─ ✅ Old system cleaned up
└─ ✅ Ready for testing

NEXT STEPS:
├─ [ ] Create git commit
├─ [ ] Push to feature branch
├─ [ ] Create PR for review
├─ [ ] Merge after approval
└─ [ ] Deploy to staging
```

---

## Decision Points & Rollback

### Critical Decision Points

#### Decision Point 1: Pre-Migration Validation
**When:** Before Phase 1
**Question:** Should we proceed with migration?
**Options:**
- **YES** - Proceed to Phase 1
- **NO** - Stop, fix issues, try again later
- **ABORT** - Cancel migration entirely

**Rollback:** None needed yet (nothing changed)

#### Decision Point 2: Phase 1 Validation Failures
**When:** After Phase 1 agents complete
**If:** Schema validation fails
**Options:**
- **FIX** - Reassign agents to fix schemas, re-run validation
- **ABORT** - Stop migration

**Rollback:** Delete schemas, restore original state

#### Decision Point 3: Phase 4 Artifact Validation Failures
**When:** After CODE_GENERATOR and ARTIFACT_VALIDATOR
**If:** Generated artifacts have discrepancies
**Options:**
- **REGENERATE** - Fix schema issues, re-run build
- **MANUAL_FIX** - Fix generated artifacts manually
- **ABORT** - Stop migration

**Rollback:** Delete generated files, keep schemas

#### Decision Point 4: Phase 5 Block Migration Failures
**When:** After block migrators complete
**If:** Any block fails migration
**Options:**
- **RETRY** - Re-run failed block migrator
- **MANUAL_REVIEW** - Developer reviews code manually
- **ABORT** - Stop migration, keep partially migrated state

**Rollback:** Git checkout old files for failed blocks only

#### Decision Point 5: Phase 6 Integration Test Failures
**When:** After INTEGRATION_TESTER
**If:** Tests fail
**Options:**
- **FIX_BLOCK** - Reassign block migrator to fix issues
- **MANUAL_TEST** - Developer tests manually
- **ABORT** - Stop migration

**Rollback:** Git checkout blocks with issues

#### Decision Point 6: Phase 7 Cleanup Issues
**When:** After CLEANUP_SPECIALIST
**If:** Verification finds issues
**Options:**
- **MANUAL_CLEANUP** - Developer manually reviews and cleans
- **KEEP_OLD_FILES** - Keep old files as backup (not recommended)
- **COMPLETE** - Accept as complete

**Rollback:** Git restore deleted files if needed

### Rollback Procedure

If at any point we need to rollback:

```bash
# Rollback to before migration started
git reset --hard HEAD~1

# Or if in middle of migration:
git status  # See what changed
git checkout blocks/  # Restore block files
git clean -fd  # Delete new schema files

# Restore database if needed
# (Assuming you have backup)
```

---

## Success Criteria

### Phase-by-Phase Success

**Phase 1: Foundation & Validation** ✅
- [ ] 3 schemas created and validated
- [ ] All attributes documented
- [ ] All exclusions correctly classified
- [ ] No discrepancies found

**Phase 2: Schema Infrastructure** ✅
- [ ] Directories created
- [ ] .gitignore updated
- [ ] README in place

**Phase 3: Build System** ✅
- [ ] Schema compiler works
- [ ] Validator works
- [ ] npm scripts integrated
- [ ] Build succeeds

**Phase 4: Code Generation** ✅
- [ ] 24+ artifacts generated
- [ ] All files have correct syntax
- [ ] All files parse correctly
- [ ] No validation errors

**Phase 5: Block Migration** ✅
- [ ] All 3 blocks use generated artifacts
- [ ] All imports updated
- [ ] All old files deleted
- [ ] No missing attributes

**Phase 6: Integration Testing** ✅
- [ ] Blocks load in editor
- [ ] Themes work correctly
- [ ] CSS cascade correct
- [ ] No console errors
- [ ] All test cases pass

**Phase 7: Cleanup** ✅
- [ ] Old files deleted
- [ ] No stale references
- [ ] Generated files in .gitignore
- [ ] Migration verified clean

### Overall Success Criteria

**Post-Migration:**

| Criteria | Verification |
|----------|--------------|
| **Single Source of Truth** | All attributes defined in schemas only |
| **Zero Manual Mappings** | All PHP mappings auto-generated |
| **Type Safety** | Full TypeScript types available |
| **Validation** | Runtime validation with Zod |
| **Excludable Code** | All old code removed |
| **Speed** | Adding attribute: 2 minutes vs 22 minutes |
| **No Backwards Compat** | No old code paths available |
| **All Tests Pass** | Integration tests 100% pass |
| **Git Clean** | No uncommitted changes except schemas |
| **Documentation** | Auto-generated and current |

---

## Orchestrator Execution Commands

### Starting the Migration

```bash
# In the project root
npm run orchestrator:start

# Or manually:
node scripts/orchestrator.js

# Output will show:
# [ORCHESTRATOR] Migration Starting...
# [PHASE 1] Launching 3 agents in parallel...
# [SCHEMA_ARCHITECT] Starting analysis...
# [SCHEMA_GENERATOR] Starting schema creation...
# [SCHEMA_VALIDATOR] Starting validation...
# [PHASE 1] Waiting for agents...
# ... (updates as agents complete)
```

### Monitoring Progress

```bash
# Watch orchestrator log
tail -f logs/orchestrator.log

# Check agent status
npm run orchestrator:status

# List completed phases
npm run orchestrator:phases
```

### Resuming After Interruption

```bash
# See what phase last completed
npm run orchestrator:status

# Resume from specific phase
npm run orchestrator:resume --from=PHASE_5

# Force restart
npm run orchestrator:restart
```

---

## Expected Outcomes

### After Successful Migration

**File Structure Changes:**
```
Before:
  ├─ blocks/accordion/src/accordion-attributes.js
  ├─ blocks/tabs/src/tabs-attributes.js
  ├─ blocks/toc/src/toc-attributes.js
  ├─ php/css-defaults/accordion.php
  ├─ php/css-defaults/tabs.php
  ├─ php/css-defaults/toc.php
  ├─ php/theme-css-generator.php (111 manual mappings)
  ├─ shared/src/config/theme-exclusions.js (3 separate lists)
  └─ [No schemas]

After:
  ├─ schemas/accordion.json ← Single source of truth
  ├─ schemas/tabs.json ← Single source of truth
  ├─ schemas/toc.json ← Single source of truth
  ├─ shared/src/types/*.ts ← Auto-generated
  ├─ shared/src/validators/*.ts ← Auto-generated
  ├─ php/css-defaults/*.php ← Auto-generated
  ├─ php/theme-css-generator.php ← Auto-generated
  ├─ shared/src/config/*-exclusions.js ← Auto-generated
  ├─ assets/css/*-generated.css ← Auto-generated
  ├─ docs/*-attributes.md ← Auto-generated
  └─ [Old files deleted]
```

**Workflow Changes:**
```
Before (Adding new attribute):
  1. Edit accordion-attributes.js (3 min)
  2. Edit accordion.css (2 min)
  3. Run npm build (5 min)
  4. Edit php/css-defaults/accordion.php (2 min) ← But wait, rebuilt!
  5. Edit php/theme-css-generator.php (3 min) ← MANUAL, error-prone
  6. Edit save.js (3 min)
  7. Edit edit.js (2 min)
  8. Test (2 min)
  TOTAL: 22 minutes, 4 failure points

After (Adding new attribute):
  1. Edit schemas/accordion.json (1 min)
  2. Run npm run schema:build (30 sec)
  TOTAL: 2 minutes, 0 failure points
```

---

## Notes for Orchestrator Implementation

### Orchestrator Responsibilities Checklist

- [ ] Load configuration
- [ ] Ask user pre-migration questions
- [ ] Validate prerequisites
- [ ] Launch agents with proper task descriptions
- [ ] Monitor agent progress
- [ ] Collect agent outputs
- [ ] Make phase transition decisions
- [ ] Handle agent failures gracefully
- [ ] Offer rollback at decision points
- [ ] Log all decisions and actions
- [ ] Generate final migration report
- [ ] Clean up temporary files
- [ ] Provide next steps guidance

### Agent Communication Protocol

Each agent will:
1. Receive task description with inputs
2. Work autonomously
3. Report completion status (SUCCESS/FAILURE)
4. Provide output artifacts or error messages
5. Return to orchestrator

Orchestrator will:
1. Track each agent's status
2. Collect outputs
3. Determine if next phase can proceed
4. Inform user of progress
5. Ask for decisions at checkpoints

---

## Conclusion

This orchestrator setup provides:

✅ **Parallel execution** where safe (40% speed improvement)
✅ **Sequential safety** where necessary (prevents conflicts)
✅ **Clear phase transitions** with validation
✅ **Decision points** for user oversight
✅ **Rollback capability** at each phase
✅ **Complete audit trail** of migration
✅ **Zero backwards compatibility** (clean break)
✅ **Production-ready architecture** (proven pattern)

**Ready to proceed?** Run orchestrator and follow prompts.

---

**Document Complete**
**Next Step:** Implement Orchestrator Agent with this guide
**Questions:** Review Phase descriptions or Decision Points section
