# Schema-Mapping Refactor: Multi-Agent Orchestration Plan

**Goal:** Implement automatic schema-driven preview generation with build-time validation

**Status:** Ready for execution

Also read for context: SCHEMA_GUIDE.md and MARKER-SYSTEM-SUMMARY.md

---

## 🎯 Overview

Refactor the editor preview generation system to be fully automatic from schema, with minimal manual mappings and build-time validation to prevent schema-mapping drift.

### Current Problems
1. Preview styles use manual mapping table (20+ entries)
2. State-based attributes (hover, active, focus) incorrectly applied in preview
3. No validation between schema and mapping - can drift out of sync
4. Manual mapping table needs updating when schema changes

### Solution
1. Use `state` field in schema to auto-skip non-base states in preview
2. Use `needsMapping` field for elements requiring manual rendering functions
3. Build-time validation ensures schema ↔ mapping sync
4. Mapping table shrinks to 2-3 entries (only truly manual elements)

---

## 📋 Refactor Tasks

### **Agent 1: Schema Cleanup (Tabs Block)**
**File:** `schemas/tabs.json`

**Tasks:**
1. Review all attributes with hover/active/focus in name
2. Add `"state"` field ONLY for non-base states:
   - `"state": "hover"` for hover attributes
   - `"state": "active"` for active attributes
   - `"state": "focus"` for focus attributes
   - DO NOT add state field for base state attributes
3. Add `"needsMapping": true` to ONE representative attribute per element that needs manual rendering:
   - `tabButtonColor` gets `"needsMapping": true` (manual function shows active tab)
   - Other tabButton attributes DON'T need it (inherited from tabButtonColor)
4. Keep schema concise:
   - NO `"needsMapping": false`
   - NO `"mappingReason"` field
   - NO `"state": "base"`

**Example:**
```json
{
  "tabButtonColor": {
    "type": "string",
    "default": "#666666",
    "appliesTo": "tabButton",
    "needsMapping": true
  },
  "tabButtonBackgroundColor": {
    "type": "string",
    "default": "#f5f5f5",
    "appliesTo": "tabButton"
  },
  "tabButtonHoverColor": {
    "type": "string",
    "default": "#333333",
    "state": "hover",
    "appliesTo": "tabButton"
  },
  "tabButtonActiveColor": {
    "type": "string",
    "default": "#0073aa",
    "state": "active",
    "appliesTo": "tabButton"
  }
}
```

**Validation:**
- Run `npm run schema:validate` after changes
- Ensure all hover/active/focus attributes have `state` field
- Ensure only ONE attribute per manual-render element has `needsMapping`

---

### **Agent 2: Schema Cleanup (TOC Block)**
**File:** `schemas/toc.json`

**Tasks:**
1. Same as Agent 1, but for TOC block
2. Add `state` field to:
   - `linkHoverColor` → `"state": "hover"`
   - `linkActiveColor` → `"state": "active"`
   - `linkVisitedColor` → `"state": "visited"`
   - `blockShadowHover` → `"state": "hover"`
3. Review if any elements need `needsMapping: true`
   - Likely NONE (TOC preview is static, no interactive elements)

**Validation:**
- Run `npm run schema:validate` after changes
- Check for any hover/visited/active attributes without `state` field

---

### **Agent 3: Schema Cleanup (Accordion Block)**
**File:** `schemas/accordion.json`

**Tasks:**
1. Same as Agent 1, but for accordion block
2. Add `state` field to:
   - `hoverTitleColor` → `"state": "hover"`
   - `hoverTitleBackgroundColor` → `"state": "hover"`
   - `shadowHover` → `"state": "hover"`
3. Review if accordion needs `needsMapping: true`
   - Likely NO (accordion shows open/closed via CSS classes, not inline styles)

**Validation:**
- Run `npm run schema:validate` after changes

---

### **Agent 4: Update Code Generator**
**File:** `build-tools/schema-compiler.js`

**Tasks:**

#### **4.1: Simplify Preview Generation Logic**

**Location:** `generateInlineStylesFunction()` (lines 1048-1154)

**Replace the appliesTo mapping logic (lines 1089-1138) with:**

```javascript
// Skip state-specific attributes (hover, active, focus, etc.)
const statePatterns = [/Hover/i, /Active/i, /Focus/i, /Disabled/i];
const isStateAttribute = statePatterns.some(pattern => pattern.test(attrName));
if (isStateAttribute || attr.state) {
  continue; // Skip non-base states in editor preview
}

// Skip elements that need manual rendering
if (attr.needsMapping) {
  continue; // Manual function handles this element
}

// Determine which style object to add this to
if (!attr.appliesTo) {
  console.warn(`[schema-compiler] Attribute "${attrName}" missing appliesTo - skipping`);
  continue;
}

// Map appliesTo to style object keys
const styleKeyMap = {
  // Tabs
  'tabIcon': 'icon',
  'tabsList': 'tabList',
  'tabPanel': 'panel',
  'wrapper': 'container',
  // TOC
  'tocTitle': 'title',
  // Accordion
  'accordionTitle': 'title',
  'accordionContent': 'content',
  'accordionIcon': 'icon',
  'item': 'container',
  // Generic
  'title': 'title',
  'titleStatic': 'title',
  'content': 'content',
  'icon': 'icon',
};

const selectorKey = styleKeyMap[attr.appliesTo] || 'container';

if (!selectorMap[selectorKey]) {
  selectorMap[selectorKey] = [];
}

selectorMap[selectorKey].push({ attrName, attr });
```

#### **4.2: Add Validation Function**

**Add AFTER `generateInlineStylesFunction()` (around line 1155):**

```javascript
/**
 * Validate schema-mapping synchronization
 * Ensures elements with needsMapping=true have corresponding manual render entries
 *
 * @param {Object} schema - Block schema
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @throws {Error} If validation fails
 */
function validateSchemaMappingSync(schema, blockType) {
  // Elements that should have manual rendering (from schema)
  const needsMapping = new Set();

  Object.entries(schema.attributes).forEach(([attrName, attr]) => {
    if (attr.needsMapping && attr.appliesTo) {
      needsMapping.add(attr.appliesTo);
    }
  });

  // Elements that actually have manual rendering (hardcoded for now)
  // NOTE: This list should match what's actually in edit.js manual functions
  const manualRenderElements = {
    'tabs': ['tabButton'],      // Has manual styles.tabButton() function
    'accordion': [],             // No manual functions currently
    'toc': [],                   // No manual functions currently
  };

  const hasMappings = new Set(manualRenderElements[blockType] || []);

  // Forward validation: Schema → Manual code
  const missing = [...needsMapping].filter(el => !hasMappings.has(el));
  if (missing.length > 0) {
    throw new Error(
      `\n❌ Schema-Mapping Validation Failed for ${blockType}!\n\n` +
      `   Schema declares these elements need manual rendering:\n` +
      `   ${missing.map(el => `- ${el}`).join('\n   ')}\n\n` +
      `   But no manual render function found in edit.js.\n\n` +
      `   Fix: Either:\n` +
      `   1. Add manual render function to blocks/${blockType}/src/edit.js\n` +
      `   2. Remove needsMapping from schema if auto-generation works\n`
    );
  }

  // Reverse validation: Manual code → Schema
  const zombies = [...hasMappings].filter(el => !needsMapping.has(el));
  if (zombies.length > 0) {
    console.warn(
      `\n⚠️  Schema-Mapping Warning for ${blockType}:\n\n` +
      `   Manual render functions exist for:\n` +
      `   ${zombies.map(el => `- ${el}`).join('\n   ')}\n\n` +
      `   But schema doesn't declare needsMapping=true.\n\n` +
      `   Fix: Add needsMapping=true to one attribute with appliesTo="${zombies[0]}"\n`
    );
  }

  // Success message
  if (needsMapping.size > 0) {
    console.log(`✓ ${blockType}: Schema-mapping validated (${needsMapping.size} manual elements)`);
  }

  return true;
}
```

#### **4.3: Call Validation During Build**

**Location:** In the main compilation loop (around line 1220)

**Add validation call:**

```javascript
// After loading schema, before generating files:
for (const [blockType, config] of Object.entries(BLOCKS)) {
  const schema = schemas[blockType];

  // Validate schema-mapping sync
  validateSchemaMappingSync(schema, blockType);

  // Continue with file generation...
}
```

---

### **Agent 5: Verify Manual Render Functions**
**Files:**
- `blocks/tabs/src/edit.js`
- `blocks/accordion/src/edit.js`
- `blocks/toc/src/edit.js`

**Tasks:**

1. **Tabs block:** Verify manual `styles.tabButton()` function exists (lines ~195-228)
   - ✅ Exists: Keep `needsMapping: true` for tabButton in schema

2. **Accordion block:** Check if manual render functions exist
   - If NO: Don't add `needsMapping` to schema
   - If YES: Document which elements and add `needsMapping` to schema

3. **TOC block:** Check if manual render functions exist
   - If NO: Don't add `needsMapping` to schema
   - If YES: Document which elements and add `needsMapping` to schema

**Validation:**
- Each block with manual functions should have corresponding `needsMapping: true` in schema
- Each `needsMapping: true` in schema should have actual manual function in edit.js

---

### **Agent 6: Remove Old Mapping Code**
**File:** `build-tools/generators/edit-styles-injector.js`

**Tasks:**
1. ❌ Delete this entire file (no longer needed)
2. ❌ Remove import/usage from schema-compiler.js if referenced

**File:** `build-tools/schema-compiler.js`

**Tasks:**
1. ❌ Remove old `getSelectorKey()` function (lines ~18-54) if still exists
2. ❌ Remove old appliesTo mapping table (was lines ~1097-1123)
3. ✅ Keep only the new simplified logic from Agent 4

---

## 🎭 Orchestrator Agent Responsibilities

**Execution Order:**
1. Run Agents 1, 2, 3 in **parallel** (schema cleanup)
2. Wait for completion, validate schemas
3. Run Agent 4 (code generator update)
4. Run Agent 5 (verify manual functions)
5. Run Agent 6 (cleanup old code)
6. Final validation and testing

**Coordination:**
```javascript
// Pseudo-code for orchestrator
async function orchestrateRefactor() {
  // Phase 1: Schema cleanup (parallel)
  await Promise.all([
    agent1_cleanupTabsSchema(),
    agent2_cleanupTocSchema(),
    agent3_cleanupAccordionSchema(),
  ]);

  // Validate schemas
  await validateAllSchemas();

  // Phase 2: Code updates (sequential)
  await agent4_updateCodeGenerator();
  await agent5_verifyManualFunctions();

  // Phase 3: Cleanup
  await agent6_removeOldCode();

  // Final validation
  await runFullBuild();
  await verifyGeneratedFiles();

  return {
    success: true,
    summary: generateSummary()
  };
}
```

**Validation Between Phases:**
- After Phase 1: Run `npm run schema:validate-structure`
- After Phase 2: Run `npm run schema:build` (should pass validation)
- After Phase 3: Run `npm run build` (full build should succeed)

**Rollback Strategy:**
- Git commit after each phase
- If phase fails, revert to previous commit
- Report which agent failed and why

---

## ✅ Success Criteria

### **Schema Files:**
- ✅ All hover/active/focus attributes have `state` field
- ✅ Only ONE attribute per manual element has `needsMapping: true`
- ✅ No `needsMapping: false` or `mappingReason` fields
- ✅ No `state: "base"` fields
- ✅ Schemas pass validation: `npm run schema:validate`

### **Code Generator:**
- ✅ Simplified logic: skip by `state` field, skip by `needsMapping`
- ✅ Validation function checks schema ↔ manual code sync
- ✅ No old mapping table code remains
- ✅ Build succeeds: `npm run schema:build`

### **Generated Files:**
- ✅ `edit.js` AUTO-GENERATED section has NO hover/active/focus styles
- ✅ `edit.js` AUTO-GENERATED section has NO manual-render element styles
- ✅ `_theme-generated.scss` still has proper state selectors (unchanged)

### **Build Process:**
- ✅ `npm run schema:build` completes without errors
- ✅ Validation messages show sync status
- ✅ `npm run build` completes successfully
- ✅ No console warnings about unmapped selectors

### **Manual Functions:**
- ✅ Tabs `styles.tabButton()` function still works
- ✅ All manual functions documented in validation output

---

## 📊 Validation Checklist

Run after refactor completion:

```bash
# 1. Schema validation
npm run schema:validate-structure

# 2. Build with validation
npm run schema:build

# Expected output:
# ✓ tabs: Schema-mapping validated (1 manual elements)
# ✓ accordion: Schema-mapping validated (0 manual elements)
# ✓ toc: Schema-mapping validated (0 manual elements)

# 3. Full build
npm run build

# 4. Manual verification
# Check generated files have correct structure
```

**Generated Files to Inspect:**
1. `blocks/tabs/src/edit.js` (lines 135-190) - Should have NO tabButton styles
2. `blocks/tabs/src/_theme-generated.scss` - Should still have state selectors
3. `blocks/toc/src/edit.js` - Should have NO link/list styles
4. `blocks/accordion/src/edit.js` - Should have NO hover styles

---

## 🚀 Execution Command

To trigger this refactor, spawn agents with this document as context:

```bash
# Orchestrator agent
claude-agent orchestrate --plan AGENT-SCHEMA-MAPPING.md

# Or manual parallel execution
claude-agent run --task "Agent 1: Schema Cleanup (Tabs)" &
claude-agent run --task "Agent 2: Schema Cleanup (TOC)" &
claude-agent run --task "Agent 3: Schema Cleanup (Accordion)" &
wait

claude-agent run --task "Agent 4: Update Code Generator"
claude-agent run --task "Agent 5: Verify Manual Functions"
claude-agent run --task "Agent 6: Remove Old Code"
```

---

## 📝 Post-Refactor Documentation

Update these files after completion:

1. **CLAUDE.md** - Update "Development Workflow" section:
   - Document `state` field usage
   - Document `needsMapping` field usage
   - Explain build-time validation

2. **Schema-Editor-Frontend-Logic.md** - Update:
   - State-aware generation section
   - Validation section

3. **README.md** (if exists) - Add:
   - Note about automatic preview generation
   - Build validation features

---

## 🎯 Summary

**Before Refactor:**
- 20+ line mapping table
- Manual pattern matching
- No validation
- Easy to drift out of sync

**After Refactor:**
- 2-3 manual elements in validation list
- Automatic state detection via `state` field
- Build-time validation prevents drift
- Self-documenting via `needsMapping` field

**Estimated Time:**
- Agent execution: 10-15 minutes
- Validation & testing: 5 minutes
- Total: ~20 minutes

**Risk Level:** Low
- Changes are isolated to build process
- Generated files are the same format
- Manual functions unchanged
- Can validate before deployment

---

**Ready to Execute!** 🚀
