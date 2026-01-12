# Revised Plan: Integrate Sidebar Panels with Generated CSS Variables

## Current System Understanding

### Architecture Overview
```
schemas/accordion.json (source)
    ↓
build-tools/schema-compiler.js
    ↓
Generates:
├── css-var-mappings-generated.js (titleColor → --accordion-title)
├── accordion-css-vars-generated.js (expandPanelType function)
├── accordion-attributes.js (block attributes)
└── control-config-generated.js (min/max/options)

User changes titleColor in sidebar
    ↓
ControlRenderer updates attribute: { text: '#333', background: '#f5f5f5' }
    ↓
buildEditorCssVars(effectiveValues) called
    ↓
expandPanelType() converts to CSS vars:
    --accordion-title-color: #333
    --accordion-title-background: #f5f5f5
    ↓
Applied as inline styles in edit.js
    ↓
SCSS: var(--accordion-title-color) picks up the value
```

### Key Components

#### 1. Panel Types
Current panels in the system:
- **IconPanel** (`shared/src/components/controls/IconPanel.js`)
  - Manages ~15 icon-related attributes
  - Has TabPanel for active/inactive states
  - Handles responsive values (size, offsets)
  - Uses `getControlConfig()` for defaults/min/max

- **BorderPanel** (`shared/src/components/controls/full/BorderPanel.js`)
  - Manages 3 attributes via `controlId` grouping:
    - `borderWidth` (control: "BorderPanel")
    - `borderColor` (control: "BorderPanel", renderControl: false)
    - `borderStyle` (control: "BorderPanel", renderControl: false)
  - Has linked/unlinked modes for per-side control

- **Box Panel** (via `type: "box-panel"` in schema)
  - Expanded by ControlRenderer
  - Controls: border, radius, shadow, padding, margin

- **Color Panel** (via `type: "color-panel"` in schema)
  - Expanded by ControlRenderer
  - Controls: text, background + hover states

- **Typography Panel** (via `type: "typography-panel"` in schema)
  - Expanded by ControlRenderer  - Controls: fontFamily, fontSize, lineHeight, etc.

#### 2. Control Renderer
- **File**: `shared/src/components/ControlRenderer.js`
- **Purpose**: Universal control renderer that maps schema types to React components
- **Features**:
  - Handles `showWhen`/`disabledWhen` conditionals
  - Manages responsive mode (device-specific values)
  - Normalizes control values
  - Maps control types to actual components

#### 3. CSS Variable Generation
- **Current Generator**: `build-tools/generators/editor-css-vars-injector.js`
- **Output**: `shared/src/styles/accordion-css-vars-generated.js`
- **Function**: `buildEditorCssVars(effectiveValues)`
- **Expansion Logic**:
  ```javascript
  // color-panel: { text: '#333', background: '#f5f5f5' }
  expandPanelType('--accordion-title', value, 'color-panel', styles)
  // Outputs:
  // --accordion-title-color: #333
  // --accordion-title-background: #f5f5f5
  ```

#### 4. Comprehensive SCSS
- **File**: `css/generated/accordion_variables.scss`
- **Generator**: `schemas/parser/scss-generator.js` (WIP, not in main build)
- **Problem**: Inconsistent variable naming
  ```scss
  :root {
    --accordion-content-border-top-color: #dddddd;  /* ✅ Has -- */
    --accordion-icon-color: #333333;                 /* ✅ Has -- */
    accordion-animation-duration: 250ms;             /* ❌ Missing -- */
    accordion-title-color: #333333;                  /* ❌ Missing -- */
  }
  ```

## Problem Statement

### Issue 1: SCSS Variable Inconsistency
Lines 53-69 in `accordion_variables.scss` are missing `--` prefix:
```scss
/* ❌ WRONG */
accordion-animation-duration: 250ms;
accordion-content-background: #ffffff;
accordion-title-color: #333333;

/* ✅ CORRECT */
--accordion-animation-duration: 250ms;
--accordion-content-background: #ffffff;
--accordion-title-color: #333333;
```

### Issue 2: Variable Name Mismatch
Current system generates different variables than comprehensive SCSS expects:

**Current System Generates**:
- `--accordion-title-color` (from color-panel expansion)
- `--accordion-title-background` (from color-panel expansion)
- `--accordion-title-padding-top` (from box-panel expansion)

**Comprehensive SCSS Expects** (lines 53-69):
- `accordion-title-color` (no `--`)
- `accordion-title-background` (no `--`)
- `--accordion-title-padding-top` (has `--`)

### Issue 3: Disconnected Generation
Two different systems generate CSS variables:
1. **Current build** (`editor-css-vars-injector.js`): For editor preview
2. **Comprehensive parser** (`scss-generator.js`): For SCSS file (not in main build)

They need to generate MATCHING variable names!

## Solution: Unified Variable Generation

### Phase 1: Fix Comprehensive SCSS Generator ⚡ PRIORITY

**File**: `schemas/parser/scss-generator.js`

**Changes**:
1. Add `--` prefix to ALL variables in `:root`
2. Ensure consistent naming with current system
3. Integrate into main build (`npm run schema:build`)

**Test**:
```scss
/* Before (lines 53-69) */
accordion-animation-duration: 250ms;
accordion-title-color: #333333;

/* After */
--accordion-animation-duration: 250ms;
--accordion-title-color: #333333;
```

### Phase 2: Align Variable Names

**Current System Pattern**:
```javascript
// color-panel
titleColor → --accordion-title-color (text)
titleColor → --accordion-title-background (background)

// box-panel
headerBox → --accordion-title-padding-top
headerBox → --accordion-title-padding-right
```

**Comprehensive System Should Match**:
```scss
:root {
  --accordion-title-color: #333333;
  --accordion-title-background: #f5f5f5;
  --accordion-title-padding-top: 12px;
  --accordion-title-padding-right: 16px;
}
```

**Action**: Update `scss-generator.js` to use SAME naming convention as `editor-css-vars-injector.js`

### Phase 3: Integrate Comprehensive SCSS into Build

**Update**: `build-tools/schema-compiler.js`

**Add**:
```javascript
const { generateScss } = require('./generators/scss-generator');

// After generating other artifacts
for (const blockType of BLOCKS) {
  const schema = loadSchema(blockType);
  const structureMapping = loadStructureMapping(blockType);

  // Generate comprehensive SCSS
  const scssContent = generateScss(schema, structureMapping, blockType);
  fs.writeFileSync(
    path.join(ROOT_DIR, 'css', 'generated', `${blockType}_variables.scss`),
    scssContent
  );
}
```

**Test**: Run `npm run schema:build` and verify `accordion_variables.scss` is regenerated

### Phase 4: Verify CSS Variable Flow

**Test Flow**:
1. Open accordion block in editor
2. Change title color in sidebar
3. Verify `buildEditorCssVars()` generates: `--accordion-title-color: #333`
4. Verify inline styles applied to block wrapper
5. Verify SCSS rule `.accordion-title { color: var(--accordion-title-color); }` picks up the value
6. Verify preview updates immediately

### Phase 5: Document Variable Mapping

**Create**: `docs/CSS_VARIABLE_REFERENCE.md`

**Content**:
```markdown
# CSS Variable Reference

## Variable Naming Convention

All CSS variables follow this pattern:
```
--{blockType}-{element}-{property}[-state][-device]
```

### Examples
- `--accordion-title-color` (base state, desktop)
- `--accordion-title-color-hover` (hover state, desktop)
- `--accordion-title-padding-top` (desktop)
- `--accordion-title-padding-top-tablet` (tablet)

## Panel Type Expansions

### color-panel
```javascript
titleColor: {
  text: '#333',
  background: '#f5f5f5',
  hover: { text: '#000', background: '#e8e8e8' }
}
```
Generates:
- `--accordion-title-color: #333`
- `--accordion-title-background: #f5f5f5`
- `--accordion-title-color-hover: #000`
- `--accordion-title-background-hover: #e8e8e8`

### box-panel
```javascript
headerBox: {
  padding: { top: 12, right: 16, bottom: 12, left: 16, unit: 'px' }
}
```
Generates:
- `--accordion-title-padding-top: 12px`
- `--accordion-title-padding-right: 16px`
- `--accordion-title-padding-bottom: 12px`
- `--accordion-title-padding-left: 16px`

### typography-panel
```javascript
titleTypography: {
  fontFamily: 'inherit',
  fontSize: '1rem',
  lineHeight: '1.4'
}
```
Generates:
- `--accordion-title-font-family: inherit`
- `--accordion-title-font-size: 1rem`
- `--accordion-title-line-height: 1.4`

### icon-panel (special case)
Icon attributes are NOT expanded by `expandPanelType()`.
They're already atomic attributes in the schema:
- `iconInactiveColor` → `--accordion-icon-color`
- `iconInactiveSize` → `--accordion-icon-size`
- `iconRotation` → `--accordion-icon-animation-rotation`

## Full Variable List

[Auto-generated from comprehensive schema]
```

## Implementation Steps

### Step 1: Fix SCSS Generator (HIGH PRIORITY) 🔥
- [ ] Locate `schemas/parser/scss-generator.js`
- [ ] Update `:root` generation to add `--` prefix to ALL variables
- [ ] Test manual generation: `node schemas/parser/main-orchestrator.js accordion`
- [ ] Verify output `css/generated/accordion_variables.scss` has consistent naming
- [ ] Compare with `editor-css-vars-injector.js` output naming

### Step 2: Align Naming Conventions
- [ ] Read `editor-css-vars-injector.js` naming logic
- [ ] Update `scss-generator.js` to match EXACTLY
- [ ] Ensure color-panel expansion: `{cssVar}-color`, `{cssVar}-background`
- [ ] Ensure box-panel expansion: `{cssVar}-padding-{side}`
- [ ] Ensure icon attributes: Direct mapping (no expansion)

### Step 3: Integrate into Main Build
- [ ] Update `schema-compiler.js` to call SCSS generator
- [ ] Add SCSS generation step after other generators
- [ ] Test: `npm run schema:build`
- [ ] Verify all 3 blocks (accordion, tabs, toc) have updated SCSS

### Step 4: Test Editor Preview
- [ ] Open accordion block in editor
- [ ] Test color-panel: Change title color → See immediate preview
- [ ] Test box-panel: Change padding → See immediate preview
- [ ] Test typography-panel: Change font size → See immediate preview
- [ ] Test icon controls: Change icon color → See immediate preview
- [ ] Test responsive: Switch device → See device-specific values
- [ ] Inspect element → Verify CSS variables present and correct

### Step 5: Test Theme System
- [ ] Create new theme with customizations
- [ ] Save theme → Verify deltas saved
- [ ] Apply theme → Verify CSS variables updated
- [ ] Customize over theme → Verify overrides work
- [ ] Switch theme → Verify customizations preserved
- [ ] Delete theme → Verify fallback to defaults

### Step 6: Test Frontend Rendering
- [ ] Save block with customizations
- [ ] View frontend
- [ ] Inspect element → Verify CSS variables in inline styles
- [ ] Verify styles applied correctly
- [ ] Test responsive on frontend (if applicable)

### Step 7: Document Changes
- [ ] Update `CLAUDE.md` with new SCSS generation flow
- [ ] Create `CSS_VARIABLE_REFERENCE.md`
- [ ] Update `schemas/README.md` with unified pipeline
- [ ] Document troubleshooting steps

## Testing Checklist

### SCSS Generation
- [ ] All variables in `:root` have `--` prefix
- [ ] Variable names match `editor-css-vars-injector.js` output
- [ ] Responsive variants have correct fallback chains
- [ ] State variants (hover, is-open) have correct selectors
- [ ] No duplicate variable definitions

### Editor Preview
- [ ] Color changes update immediately
- [ ] Padding changes update immediately
- [ ] Typography changes update immediately
- [ ] Icon changes update immediately
- [ ] Responsive device switching works
- [ ] No console errors
- [ ] CSS variables visible in devtools

### Panel Functionality
- [ ] IconPanel works correctly (all ~15 attributes)
- [ ] BorderPanel works correctly (controlId grouping)
- [ ] Color-panel expansion works
- [ ] Box-panel expansion works
- [ ] Typography-panel expansion works
- [ ] Responsive toggle works
- [ ] Reset button works
- [ ] Link/unlink toggle works (spacing, borders)

### Theme System
- [ ] Themes save correctly
- [ ] Themes load correctly
- [ ] CSS variables update on theme change
- [ ] Customizations preserved on theme switch
- [ ] Delta calculation works
- [ ] Theme export/import works

### Cross-Block Testing
- [ ] Test all changes on accordion block
- [ ] Test all changes on tabs block
- [ ] Test all changes on toc block
- [ ] Verify block-agnostic code works

## Success Criteria

✅ All CSS variables in SCSS have `--` prefix
✅ Variable naming is consistent across all generators
✅ SCSS generation integrated into main build
✅ Sidebar panel changes update editor preview immediately
✅ No hardcoded block-specific logic
✅ Theme system works with new variable structure
✅ Frontend rendering works correctly
✅ All tests passing
✅ Documentation updated

## Key Files Reference

### Generation Pipeline
- `schemas/accordion.json` - Source schema
- `build-tools/schema-compiler.js` - Main build orchestrator
- `build-tools/generators/editor-css-vars-injector.js` - Editor CSS vars generator
- `schemas/parser/scss-generator.js` - SCSS generator (to be integrated)
- `schemas/parser/main-orchestrator.js` - Comprehensive parser CLI

### Generated Files
- `shared/src/config/css-var-mappings-generated.js` - Attribute → CSS var mappings
- `shared/src/styles/accordion-css-vars-generated.js` - Editor CSS var builder
- `css/generated/accordion_variables.scss` - Comprehensive SCSS with all variables
- `blocks/accordion/src/accordion-attributes.js` - Block attributes

### Panel Components
- `shared/src/components/SchemaPanels.js` - Panel orchestrator
- `shared/src/components/ControlRenderer.js` - Universal control renderer
- `shared/src/components/controls/IconPanel.js` - Icon panel (custom)
- `shared/src/components/controls/full/BorderPanel.js` - Border panel (custom)

### Editor Integration
- `blocks/accordion/src/edit.js` - Editor component
- Uses: `buildEditorCssVars(effectiveValues)`
- Applies: Inline styles with CSS variables
- Attribute: `data-gutplus-device` for responsive

## Risk Mitigation

### Risk 1: Breaking Existing Themes
**Risk**: Changing variable names breaks saved themes
**Mitigation**:
- Naming changes are INTERNAL (SCSS file only)
- Attribute structure unchanged (still `titleColor: { text, background }`)
- CSS variable names in `buildEditorCssVars()` remain same
- No migration needed

### Risk 2: Performance Impact
**Risk**: Regenerating SCSS on every build slows down development
**Mitigation**:
- SCSS generation is fast (<100ms per block)
- Only runs on `npm run schema:build`, not on `npm run start`
- Cache structure mappings to avoid re-parsing HTML

### Risk 3: SCSS Parser Bugs
**Risk**: Comprehensive SCSS generator has bugs
**Mitigation**:
- Test thoroughly before integrating
- Compare output with current working SCSS
- Add validation tests for variable names
- Fallback to manual SCSS if needed

## Next Steps

1. **Immediate**: Fix SCSS generator to add `--` prefix (Step 1)
2. **Next**: Align naming conventions (Step 2)
3. **Then**: Integrate into build (Step 3)
4. **Finally**: Test and document (Steps 4-7)

---

**Status**: Ready to begin Step 1
**Owner**: Developer
**Timeline**: 2-4 hours for Steps 1-3, 2-3 hours for testing
