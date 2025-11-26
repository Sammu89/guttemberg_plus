# Border Refactoring Plan - Unified Standard for All Blocks

## Executive Summary

This document outlines a comprehensive plan to standardize border handling across all three blocks (Accordion, Tabs, TOC) in the Guttemberg Plus plugin. The refactoring will eliminate inconsistencies in naming conventions, group structures, and CSS variable patterns while ensuring all blocks use the same component structure (GenericPanel instead of BorderPanel).

---

## 1. Current Inconsistencies Analysis

### 1.1 Group Structure Inconsistencies

| Block | Current Groups | Issues |
|-------|----------------|--------|
| **Accordion** | `border`, `border-divider` | Hyphenated group name, unclear scope |
| **Tabs** | `titleBorders`, `divider`, `content` | Camel case, mixed naming patterns |
| **TOC** | `border` | Single group, no divider separation |

### 1.2 Attribute Naming Inconsistencies

**Accordion:**
- `accordionBorderColor`, `accordionBorderThickness`, `accordionBorderStyle`, `accordionBorderRadius`
- `dividerBorderColor`, `dividerBorderThickness`, `dividerBorderStyle`
- CSS Vars: `--accordion-border-*`, `--accordion-divider-*`

**Tabs:**
- `tabButtonBorderColor`, `tabButtonBorderWidth`, `tabButtonBorderStyle`, `tabButtonBorderRadius`
- `tabButtonActiveBorderColor`, `tabButtonActiveBorderBottomColor`
- `panelBorderColor`, `panelBorderWidth`, `panelBorderStyle`, `panelBorderRadius`
- `dividerLineColor`, `dividerLineWidth`, `dividerLineStyle`
- CSS Vars: `--tab-button-border-*`, `--tab-panel-border-*`, `--divider-*`

**TOC:**
- `wrapperBorderColor`, `wrapperBorderWidth`, `wrapperBorderStyle`, `wrapperBorderRadius`
- CSS Vars: `--toc-border-*`, `--toc-wrapper-border-color`

### 1.3 Border Radius Type Inconsistencies

| Block | Type | Format |
|-------|------|--------|
| **Accordion** | object | `{topLeft, topRight, bottomRight, bottomLeft}` |
| **Tabs** | object | `{topLeft, topRight, bottomRight, bottomLeft}` |
| **TOC** | number | Single value (no individual corners) |

### 1.4 Component Usage Inconsistencies

All three blocks currently use `BorderPanel` which needs to be replaced with `GenericPanel` for consistency.

---

## 2. Proposed Unified Standard

### 2.1 Standard Group Naming Convention

**For ALL blocks, use these standardized group names:**

| Group Name | Purpose | Used By |
|------------|---------|---------|
| `blockBorders` | Main wrapper/container borders | All blocks |
| `elementBorders` | Interactive elements (buttons/headers) | Accordion, Tabs |
| `contentBorders` | Content area borders | Tabs |
| `dividerBorders` | Divider lines only | Accordion, Tabs |

**Note:** TOC only needs `blockBorders` (no dividers, no separate elements).

### 2.2 Standard Attribute Naming Pattern

**Pattern:** `[element][BorderProperty]`

Where:
- `element` = `block`, `header`, `button`, `content`, `divider`, `panel`
- `BorderProperty` = `BorderColor`, `BorderWidth`, `BorderStyle`, `BorderRadius`, `Shadow`, `ShadowHover`

**Examples:**
- `blockBorderColor`, `blockBorderWidth`, `blockBorderStyle`, `blockBorderRadius`
- `headerBorderColor`, `headerBorderWidth` (for accordion headers)
- `buttonBorderColor`, `buttonBorderWidth` (for tab buttons)
- `contentBorderColor`, `contentBorderWidth` (for tab content panels)
- `dividerBorderColor`, `dividerBorderWidth`, `dividerBorderStyle`

### 2.3 Standard CSS Variable Naming Pattern

**Pattern:** `--BLOCKNAME-border-ELEMENT-PROPERTY`

Where:
- `BLOCKNAME` = `accordion`, `tabs`, `toc`
- `ELEMENT` = `block`, `header`, `button`, `content`, `divider`, `panel`
- `PROPERTY` = `color`, `width`, `style`, `radius`, `shadow`, `shadow-hover`

**Examples:**
- `--accordion-border-color` (main wrapper)
- `--accordion-border-header-color` (accordion header/title)
- `--accordion-border-divider-color` (divider between title and content)
- `--tabs-border-color` (main wrapper)
- `--tabs-border-button-color` (tab button)
- `--tabs-border-button-active-color` (active tab button)
- `--tabs-border-content-color` (content panel)
- `--tabs-border-divider-color` (divider line)
- `--toc-border-color` (main wrapper)

### 2.4 Standard Border Radius Format

**ALL blocks must use object format with 4 corners:**

```json
{
  "topLeft": 4,
  "topRight": 4,
  "bottomRight": 4,
  "bottomLeft": 4
}
```

**Exception:** TOC needs to be migrated from `number` to `object`.

### 2.5 Standard Panel Usage

**ALL blocks must use GenericPanel (NO BorderPanel):**

- Replace all instances of `<BorderPanel />` with `<GenericPanel />`
- Use `group="blockBorders"`, `group="elementBorders"`, etc.
- Remove all custom border mapping functions
- Remove BorderPanel imports

---

## 3. Implementation Matrix

### 3.1 ACCORDION BLOCK REFACTORING

#### Schema Changes (schemas/accordion.json)

**Group Changes:**
```
OLD GROUP          → NEW GROUP
"border"           → "blockBorders"
"border-divider"   → "dividerBorders"
```

**Attribute Changes:**

| Current Attribute | New Attribute | Current Group | New Group | Current cssVar | New cssVar |
|-------------------|---------------|---------------|-----------|----------------|------------|
| `accordionBorderColor` | `blockBorderColor` | `border` | `blockBorders` | `accordion-border-color` | `accordion-border-color` |
| `accordionBorderThickness` | `blockBorderWidth` | `border` | `blockBorders` | `accordion-border-width` | `accordion-border-width` |
| `accordionBorderStyle` | `blockBorderStyle` | `border` | `blockBorders` | `accordion-border-style` | `accordion-border-style` |
| `accordionBorderRadius` | `blockBorderRadius` | `border` | `blockBorders` | `accordion-border-radius` | `accordion-border-radius` |
| `accordionShadow` | `blockShadow` | `border` | `blockBorders` | `accordion-shadow` | `accordion-border-shadow` |
| `accordionShadowHover` | `blockShadowHover` | `border` | `blockBorders` | `accordion-shadow-hover` | `accordion-border-shadow-hover` |
| `dividerBorderColor` | `dividerBorderColor` | `border-divider` | `dividerBorders` | `accordion-divider-color` | `accordion-border-divider-color` |
| `dividerBorderThickness` | `dividerBorderWidth` | `border-divider` | `dividerBorders` | `accordion-divider-width` | `accordion-border-divider-width` |
| `dividerBorderStyle` | `dividerBorderStyle` | `border-divider` | `dividerBorders` | `accordion-divider-style` | `accordion-border-divider-style` |

**Note:** For better semantic clarity, consider adding header-specific border attributes:

| New Attribute | Group | Label | cssVar |
|---------------|-------|-------|--------|
| `headerBorderColor` | `elementBorders` | "Header Border Color" | `accordion-border-header-color` |
| `headerBorderWidth` | `elementBorders` | "Header Border Width" | `accordion-border-header-width` |
| `headerBorderStyle` | `elementBorders` | "Header Border Style" | `accordion-border-header-style` |
| `headerBorderRadius` | `elementBorders` | "Header Border Radius" | `accordion-border-header-radius` |

#### Edit.js Changes (blocks/accordion/src/edit.js)

**Before:**
```javascript
import {
	BorderPanel,
	// ...
} from '@shared';

// Later in JSX:
<BorderPanel
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="accordion"
/>
```

**After:**
```javascript
import {
	GenericPanel,
	// ... (remove BorderPanel)
} from '@shared';

// Replace with:
<GenericPanel
	title="Block Borders"
	group="blockBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="accordion"
	initialOpen={ false }
/>

<GenericPanel
	title="Header Borders"
	group="elementBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="accordion"
	initialOpen={ false }
/>

<GenericPanel
	title="Divider Borders"
	group="dividerBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="accordion"
	initialOpen={ false }
/>
```

#### Style.scss Changes (blocks/accordion/src/style.scss)

**Before:**
```scss
border-width: var(--accordion-border-width, 1px);
border-style: var(--accordion-border-style, solid);
border-color: var(--accordion-border-color, #ddd);
border-radius: var(--accordion-border-radius, 4px);
box-shadow: var(--accordion-shadow, none);

border-top: var(--accordion-divider-width, 0)
            var(--accordion-divider-style, solid)
            var(--accordion-divider-color, transparent);
```

**After:**
```scss
border-width: var(--accordion-border-width, 1px);
border-style: var(--accordion-border-style, solid);
border-color: var(--accordion-border-color, #ddd);
border-radius: var(--accordion-border-radius, 4px);
box-shadow: var(--accordion-border-shadow, none);

border-top: var(--accordion-border-divider-width, 0)
            var(--accordion-border-divider-style, solid)
            var(--accordion-border-divider-color, transparent);
```

---

### 3.2 TABS BLOCK REFACTORING

#### Schema Changes (schemas/tabs.json)

**Group Changes:**
```
OLD GROUP        → NEW GROUP
"titleBorders"   → "elementBorders"
"divider"        → "dividerBorders"
"content"        → "contentBorders"
```

**Attribute Changes:**

| Current Attribute | New Attribute | Current Group | New Group | Current cssVar | New cssVar |
|-------------------|---------------|---------------|-----------|----------------|------------|
| `tabButtonBorderColor` | `buttonBorderColor` | `titleBorders` | `elementBorders` | `tab-button-border-color` | `tabs-border-button-color` |
| `tabButtonBorderWidth` | `buttonBorderWidth` | `titleBorders` | `elementBorders` | `tab-button-border-width` | `tabs-border-button-width` |
| `tabButtonBorderStyle` | `buttonBorderStyle` | `titleBorders` | `elementBorders` | `tab-button-border-style` | `tabs-border-button-style` |
| `tabButtonBorderRadius` | `buttonBorderRadius` | `titleBorders` | `elementBorders` | `tab-button-border-radius` | `tabs-border-button-radius` |
| `tabButtonShadow` | `buttonShadow` | `titleBorders` | `elementBorders` | `tab-button-shadow` | `tabs-border-button-shadow` |
| `tabButtonShadowHover` | `buttonShadowHover` | `titleBorders` | `elementBorders` | `tab-button-shadow-hover` | `tabs-border-button-shadow-hover` |
| `tabButtonActiveBorderColor` | `buttonActiveBorderColor` | `titleColors` | `elementBorders` | `tab-button-active-border-color` | `tabs-border-button-active-color` |
| `tabButtonActiveBorderBottomColor` | `buttonActiveBorderBottomColor` | `titleColors` | `elementBorders` | `tab-button-active-border-bottom-color` | `tabs-border-button-active-bottom-color` |
| `panelBorderColor` | `contentBorderColor` | `content` | `contentBorders` | `tab-panel-border-color` | `tabs-border-content-color` |
| `panelBorderWidth` | `contentBorderWidth` | `content` | `contentBorders` | `tab-panel-border-width` | `tabs-border-content-width` |
| `panelBorderStyle` | `contentBorderStyle` | `content` | `contentBorders` | `tab-panel-border-style` | `tabs-border-content-style` |
| `panelBorderRadius` | `contentBorderRadius` | `content` | `contentBorders` | `tab-panel-border-radius` | `tabs-border-content-radius` |
| `panelShadow` | `contentShadow` | `content` | `contentBorders` | `tab-panel-shadow` | `tabs-border-content-shadow` |
| `dividerLineColor` | `dividerBorderColor` | `divider` | `dividerBorders` | `divider-color` | `tabs-border-divider-color` |
| `dividerLineWidth` | `dividerBorderWidth` | `divider` | `dividerBorders` | `divider-width` | `tabs-border-divider-width` |
| `dividerLineStyle` | `dividerBorderStyle` | `divider` | `dividerBorders` | `divider-style` | `tabs-border-divider-style` |

**Additional Attributes to Add:**

| New Attribute | Group | Label | cssVar | Default |
|---------------|-------|-------|--------|---------|
| `blockBorderColor` | `blockBorders` | "Container Border Color" | `tabs-border-color` | `#dddddd` |
| `blockBorderWidth` | `blockBorders` | "Container Border Width" | `tabs-border-width` | `0px` |
| `blockBorderStyle` | `blockBorders` | "Container Border Style" | `tabs-border-style` | `solid` |
| `blockBorderRadius` | `blockBorders` | "Container Border Radius" | `tabs-border-radius` | `{topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0}` |
| `blockShadow` | `blockBorders` | "Container Shadow" | `tabs-border-shadow` | `none` |

#### Edit.js Changes (blocks/tabs/src/edit.js)

**Before:**
```javascript
import {
	BorderPanel,
	// ...
} from '@shared';

// Custom mapping function
function buildTabsBorderConfig() {
	// ... custom mapping logic
}

// Later in JSX:
<BorderPanel
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="tabs"
	customConfig={ buildTabsBorderConfig() }
/>
```

**After:**
```javascript
import {
	GenericPanel,
	// ... (remove BorderPanel)
} from '@shared';

// Remove buildTabsBorderConfig() function entirely

// Replace with:
<GenericPanel
	title="Container Borders"
	group="blockBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="tabs"
	initialOpen={ false }
/>

<GenericPanel
	title="Button Borders"
	group="elementBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="tabs"
	initialOpen={ false }
/>

<GenericPanel
	title="Content Borders"
	group="contentBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="tabs"
	initialOpen={ false }
/>

<GenericPanel
	title="Divider Borders"
	group="dividerBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="tabs"
	initialOpen={ false }
/>
```

#### Style.scss Changes (blocks/tabs/src/style.scss)

**Before:**
```scss
// Tab buttons
border: var(--tab-button-border-width, 1px)
        var(--tab-button-border-style, solid)
        var(--tab-button-border-color, transparent);
border-radius: var(--tab-button-border-radius, 0);
box-shadow: var(--tab-button-shadow, none);

// Active tab
border-bottom-color: var(--tab-button-active-border-color, #007cba);

// Divider
border-top: var(--divider-width, 0)
            var(--divider-style, solid)
            var(--divider-color, transparent);

// Panel
border: var(--tab-panel-border-width, 1px)
        solid
        var(--tab-panel-border-color, #ddd);
border-radius: var(--tab-panel-border-radius, 4px);
box-shadow: var(--tab-panel-shadow, none);
```

**After:**
```scss
// Tab buttons
border: var(--tabs-border-button-width, 1px)
        var(--tabs-border-button-style, solid)
        var(--tabs-border-button-color, transparent);
border-radius: var(--tabs-border-button-radius, 0);
box-shadow: var(--tabs-border-button-shadow, none);

// Active tab
border-bottom-color: var(--tabs-border-button-active-color, #007cba);

// Divider
border-top: var(--tabs-border-divider-width, 0)
            var(--tabs-border-divider-style, solid)
            var(--tabs-border-divider-color, transparent);

// Panel (content)
border: var(--tabs-border-content-width, 1px)
        var(--tabs-border-content-style, solid)
        var(--tabs-border-content-color, #ddd);
border-radius: var(--tabs-border-content-radius, 4px);
box-shadow: var(--tabs-border-content-shadow, none);
```

---

### 3.3 TOC BLOCK REFACTORING

#### Schema Changes (schemas/toc.json)

**Group Changes:**
```
OLD GROUP    → NEW GROUP
"border"     → "blockBorders"
```

**Attribute Changes:**

| Current Attribute | New Attribute | Current Group | New Group | Current cssVar | New cssVar |
|-------------------|---------------|---------------|-----------|----------------|------------|
| `wrapperBorderColor` | `blockBorderColor` | `border` | `blockBorders` | `toc-wrapper-border-color` | `toc-border-color` |
| `wrapperBorderWidth` | `blockBorderWidth` | `border` | `blockBorders` | `toc-border-width` | `toc-border-width` |
| `wrapperBorderStyle` | `blockBorderStyle` | `border` | `blockBorders` | `toc-border-style` | `toc-border-style` |
| `wrapperBorderRadius` | `blockBorderRadius` | `border` | `blockBorders` | `toc-border-radius` | `toc-border-radius` |
| `wrapperShadow` | `blockShadow` | `border` | `blockBorders` | `toc-wrapper-shadow` | `toc-border-shadow` |
| `wrapperShadowHover` | `blockShadowHover` | `border` | `blockBorders` | `toc-wrapper-shadow-hover` | `toc-border-shadow-hover` |

**Type Migration:**

`blockBorderRadius` (formerly `wrapperBorderRadius`) needs to change from:
```json
"type": "number",
"default": "4px"
```

To:
```json
"type": "object",
"default": {
  "topLeft": 4,
  "topRight": 4,
  "bottomRight": 4,
  "bottomLeft": 4
}
```

#### Edit.js Changes (blocks/toc/src/edit.js)

**Before:**
```javascript
import {
	BorderPanel,
	// ...
} from '@shared';

// Later in JSX:
<BorderPanel
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="toc"
/>
```

**After:**
```javascript
import {
	GenericPanel,
	// ... (remove BorderPanel)
} from '@shared';

// Replace with:
<GenericPanel
	title="Block Borders"
	group="blockBorders"
	effectiveValues={ effectiveValues }
	attributes={ attributes }
	setAttributes={ setAttributes }
	blockType="toc"
	initialOpen={ false }
/>
```

#### Style.scss Changes (blocks/toc/src/style.scss)

**Before:**
```scss
border: var(--toc-border-width, 1px)
        var(--toc-border-style, solid)
        var(--toc-wrapper-border-color, #dddddd);
border-radius: var(--toc-border-radius, 4px);
box-shadow: var(--toc-wrapper-shadow, none);
```

**After:**
```scss
border: var(--toc-border-width, 1px)
        var(--toc-border-style, solid)
        var(--toc-border-color, #dddddd);
border-radius: var(--toc-border-radius, 4px);
box-shadow: var(--toc-border-shadow, none);
```

---

## 4. Benefits of This Approach

### 4.1 Consistency
- **Unified naming:** All blocks follow the same pattern (`blockBorder*`, `elementBorder*`, etc.)
- **Predictable CSS variables:** Developers can guess variable names without looking them up
- **Standard groups:** Same group names across all blocks

### 4.2 Maintainability
- **Single source of truth:** Schema drives everything
- **No custom mapping:** GenericPanel reads directly from schema groups
- **Easier debugging:** Predictable patterns reduce confusion
- **Future-proof:** Adding new blocks will be faster and more consistent

### 4.3 Developer Experience
- **Less cognitive load:** One pattern to remember, not three different approaches
- **Autocomplete-friendly:** Consistent naming improves IDE suggestions
- **Documentation clarity:** Easier to document and explain

### 4.4 User Experience
- **Consistent UI:** All blocks present border controls in the same way
- **Predictable behavior:** Users learn once, apply everywhere
- **Better theme management:** Themes work more predictably across blocks

---

## 5. Implementation Steps

### Phase 1: Schema Updates (Day 1)
1. Update `schemas/accordion.json`:
   - Rename groups: `border` → `blockBorders`, `border-divider` → `dividerBorders`
   - Rename attributes: `accordionBorder*` → `blockBorder*`, `dividerBorderThickness` → `dividerBorderWidth`
   - Update cssVar values to match new pattern
   - Add optional `elementBorders` group with header-specific attributes

2. Update `schemas/tabs.json`:
   - Rename groups: `titleBorders` → `elementBorders`, `divider` → `dividerBorders`, `content` → `contentBorders`
   - Add `blockBorders` group with container border attributes
   - Rename attributes: `tabButton*` → `button*`, `panel*` → `content*`, `dividerLine*` → `dividerBorder*`
   - Move `tabButtonActiveBorderColor` and `tabButtonActiveBorderBottomColor` from `titleColors` to `elementBorders`
   - Update cssVar values: `tab-button-*` → `tabs-border-button-*`, `tab-panel-*` → `tabs-border-content-*`, `divider-*` → `tabs-border-divider-*`

3. Update `schemas/toc.json`:
   - Rename group: `border` → `blockBorders`
   - Rename attributes: `wrapper*` → `block*`
   - Convert `blockBorderRadius` from `number` to `object` type
   - Update cssVar values: `toc-wrapper-*` → `toc-border-*`

4. Run schema build:
   ```bash
   npm run schema:build
   ```

### Phase 2: Edit.js Updates (Day 1-2)
1. **Accordion (blocks/accordion/src/edit.js):**
   - Remove `BorderPanel` import
   - Add `GenericPanel` import (if not already present)
   - Replace `<BorderPanel />` with separate `<GenericPanel />` components for:
     - `group="blockBorders"`
     - `group="elementBorders"` (if added)
     - `group="dividerBorders"`

2. **Tabs (blocks/tabs/src/edit.js):**
   - Remove `BorderPanel` import
   - Remove `mapBorderAttributes()` and `buildTabsBorderConfig()` functions
   - Add `GenericPanel` import (if not already present)
   - Replace `<BorderPanel customConfig={...} />` with separate `<GenericPanel />` components for:
     - `group="blockBorders"`
     - `group="elementBorders"`
     - `group="contentBorders"`
     - `group="dividerBorders"`

3. **TOC (blocks/toc/src/edit.js):**
   - Remove `BorderPanel` import
   - Add `GenericPanel` import (if not already present)
   - Replace `<BorderPanel />` with `<GenericPanel group="blockBorders" />`

### Phase 3: Style.scss Updates (Day 2)
1. **Accordion (blocks/accordion/src/style.scss):**
   - Update: `--accordion-shadow` → `--accordion-border-shadow`
   - Update: `--accordion-shadow-hover` → `--accordion-border-shadow-hover`
   - Update: `--accordion-divider-*` → `--accordion-border-divider-*`

2. **Tabs (blocks/tabs/src/style.scss):**
   - Update: `--tab-button-border-*` → `--tabs-border-button-*`
   - Update: `--tab-panel-border-*` → `--tabs-border-content-*`
   - Update: `--divider-*` → `--tabs-border-divider-*`
   - Add container styles using `--tabs-border-*` variables

3. **TOC (blocks/toc/src/style.scss):**
   - Update: `--toc-wrapper-border-color` → `--toc-border-color`
   - Update: `--toc-wrapper-shadow` → `--toc-border-shadow`
   - Update: `--toc-wrapper-shadow-hover` → `--toc-border-shadow-hover`

### Phase 4: Build & Test (Day 2-3)
1. Run full build:
   ```bash
   npm run build
   ```

2. Test each block in WordPress editor:
   - Verify all border controls appear correctly
   - Test creating new blocks with default values
   - Test applying existing themes (check backward compatibility)
   - Test customizing border values and saving
   - Verify CSS variables are applied correctly in frontend

3. Migration testing:
   - Create test blocks BEFORE refactoring
   - Verify they still work AFTER refactoring
   - Check that saved themes still apply correctly

### Phase 5: Documentation Updates (Day 3)
1. Update generated documentation:
   - Check `docs/accordion-attributes.md`
   - Check `docs/tabs-attributes.md`
   - Check `docs/toc-attributes.md`

2. Update CLAUDE.md if needed with new patterns

3. Create migration guide for existing users (if needed)

---

## 6. Backward Compatibility Considerations

### 6.1 Potential Breaking Changes

**Attribute Name Changes:**
- Existing blocks in posts will have old attribute names in database
- WordPress Gutenberg should handle this gracefully via deprecated attributes

**CSS Variable Changes:**
- Custom CSS relying on old variable names will break
- Custom themes using old variable names will need updates

### 6.2 Migration Strategy

**Option 1: Deprecated Attributes (RECOMMENDED)**

Add `deprecated` field to `block.json` for each block to handle old attribute names:

```javascript
// In block.json
"deprecated": [
  {
    "attributes": {
      // Old attribute definitions
      "accordionBorderColor": { ... },
      "accordionBorderThickness": { ... },
      // ...
    },
    "migrate": function( attributes ) {
      return {
        ...attributes,
        blockBorderColor: attributes.accordionBorderColor,
        blockBorderWidth: attributes.accordionBorderThickness,
        // Map all old → new
      };
    }
  }
]
```

**Option 2: Database Migration Script**

Create a PHP migration script that runs once to update all existing blocks:

```php
// Migration script to update block attributes in posts
function guttemberg_plus_migrate_border_attributes() {
  // Query all posts with blocks
  // Parse block content
  // Update attribute names
  // Save updated content
}
```

**Option 3: CSS Variable Aliases (TEMPORARY)**

Add fallback CSS variables during transition period:

```scss
// Accordion - support old variables temporarily
border-color: var(--accordion-border-color, var(--accordion-border-color-LEGACY, #ddd));
```

**RECOMMENDATION:** Use Option 1 (deprecated attributes) as it's the WordPress-recommended approach and handles block validation automatically.

---

## 7. Testing Checklist

### Pre-Refactoring
- [ ] Create sample accordion block and save
- [ ] Create sample tabs block and save
- [ ] Create sample TOC block and save
- [ ] Create custom theme for each block
- [ ] Export database backup
- [ ] Document current CSS variable usage in custom CSS (if any)

### Post-Refactoring
- [ ] Schema validation passes (`npm run schema:validate`)
- [ ] Build completes without errors (`npm run build`)
- [ ] All blocks load in editor without errors
- [ ] All border controls appear in correct panels
- [ ] Default values apply correctly
- [ ] Custom values save correctly
- [ ] Themes apply correctly
- [ ] CSS variables render correctly in frontend
- [ ] Pre-existing blocks still work (backward compatibility)
- [ ] Pre-existing themes still apply (backward compatibility)

### Visual Regression Testing
- [ ] Accordion: wrapper borders render correctly
- [ ] Accordion: header borders render correctly (if added)
- [ ] Accordion: divider renders correctly
- [ ] Accordion: shadow effects work
- [ ] Tabs: container borders render correctly
- [ ] Tabs: button borders render correctly
- [ ] Tabs: active button borders render correctly
- [ ] Tabs: content panel borders render correctly
- [ ] Tabs: divider line renders correctly
- [ ] TOC: wrapper borders render correctly
- [ ] TOC: border radius renders with 4 corners correctly

---

## 8. Rollback Plan

If critical issues are discovered after deployment:

1. **Immediate Rollback:**
   ```bash
   git revert HEAD
   npm run build
   ```

2. **Restore Database Backup:**
   - Use WordPress backup plugin or direct database restore
   - Only needed if blocks corrupted in database

3. **Communicate with Users:**
   - Notify users of rollback
   - Provide timeline for fix and re-deployment

---

## 9. Future Enhancements

After successful refactoring, consider these enhancements:

1. **Unified Border Presets:**
   - Create border style presets (e.g., "Card", "Outline", "Minimal")
   - Apply across all blocks consistently

2. **Border Animation Support:**
   - Add transition properties for hover effects
   - Standardize animation timing

3. **Advanced Border Features:**
   - Gradient borders (via `border-image`)
   - Individual side borders (top, right, bottom, left)
   - Border animations (pulse, glow, etc.)

4. **Better Visual Indicators:**
   - Live preview of border changes in editor
   - Visual border editor (click to select corners)

---

## 10. Summary

This refactoring will:

✅ **Standardize** border groups across all blocks
✅ **Unify** attribute naming conventions
✅ **Simplify** CSS variable patterns
✅ **Eliminate** custom mapping functions
✅ **Replace** BorderPanel with GenericPanel
✅ **Improve** developer and user experience
✅ **Maintain** backward compatibility (with deprecation strategy)

**Total Implementation Time:** 2-3 days
**Risk Level:** Medium (requires careful testing)
**Impact:** High (affects all three blocks)

---

## Appendix A: Complete Attribute Mapping Reference

### Accordion Border Attributes

| Old Name | New Name | Old cssVar | New cssVar | Group Change |
|----------|----------|------------|------------|--------------|
| accordionBorderColor | blockBorderColor | accordion-border-color | accordion-border-color | border → blockBorders |
| accordionBorderThickness | blockBorderWidth | accordion-border-width | accordion-border-width | border → blockBorders |
| accordionBorderStyle | blockBorderStyle | accordion-border-style | accordion-border-style | border → blockBorders |
| accordionBorderRadius | blockBorderRadius | accordion-border-radius | accordion-border-radius | border → blockBorders |
| accordionShadow | blockShadow | accordion-shadow | accordion-border-shadow | border → blockBorders |
| accordionShadowHover | blockShadowHover | accordion-shadow-hover | accordion-border-shadow-hover | border → blockBorders |
| dividerBorderColor | dividerBorderColor | accordion-divider-color | accordion-border-divider-color | border-divider → dividerBorders |
| dividerBorderThickness | dividerBorderWidth | accordion-divider-width | accordion-border-divider-width | border-divider → dividerBorders |
| dividerBorderStyle | dividerBorderStyle | accordion-divider-style | accordion-border-divider-style | border-divider → dividerBorders |

### Tabs Border Attributes

| Old Name | New Name | Old cssVar | New cssVar | Group Change |
|----------|----------|------------|------------|--------------|
| *(new)* | blockBorderColor | *(new)* | tabs-border-color | *(new)* → blockBorders |
| *(new)* | blockBorderWidth | *(new)* | tabs-border-width | *(new)* → blockBorders |
| *(new)* | blockBorderStyle | *(new)* | tabs-border-style | *(new)* → blockBorders |
| *(new)* | blockBorderRadius | *(new)* | tabs-border-radius | *(new)* → blockBorders |
| *(new)* | blockShadow | *(new)* | tabs-border-shadow | *(new)* → blockBorders |
| tabButtonBorderColor | buttonBorderColor | tab-button-border-color | tabs-border-button-color | titleBorders → elementBorders |
| tabButtonBorderWidth | buttonBorderWidth | tab-button-border-width | tabs-border-button-width | titleBorders → elementBorders |
| tabButtonBorderStyle | buttonBorderStyle | tab-button-border-style | tabs-border-button-style | titleBorders → elementBorders |
| tabButtonBorderRadius | buttonBorderRadius | tab-button-border-radius | tabs-border-button-radius | titleBorders → elementBorders |
| tabButtonShadow | buttonShadow | tab-button-shadow | tabs-border-button-shadow | titleBorders → elementBorders |
| tabButtonShadowHover | buttonShadowHover | tab-button-shadow-hover | tabs-border-button-shadow-hover | titleBorders → elementBorders |
| tabButtonActiveBorderColor | buttonActiveBorderColor | tab-button-active-border-color | tabs-border-button-active-color | titleColors → elementBorders |
| tabButtonActiveBorderBottomColor | buttonActiveBorderBottomColor | tab-button-active-border-bottom-color | tabs-border-button-active-bottom-color | titleColors → elementBorders |
| panelBorderColor | contentBorderColor | tab-panel-border-color | tabs-border-content-color | content → contentBorders |
| panelBorderWidth | contentBorderWidth | tab-panel-border-width | tabs-border-content-width | content → contentBorders |
| panelBorderStyle | contentBorderStyle | tab-panel-border-style | tabs-border-content-style | content → contentBorders |
| panelBorderRadius | contentBorderRadius | tab-panel-border-radius | tabs-border-content-radius | content → contentBorders |
| panelShadow | contentShadow | tab-panel-shadow | tabs-border-content-shadow | content → contentBorders |
| dividerLineColor | dividerBorderColor | divider-color | tabs-border-divider-color | divider → dividerBorders |
| dividerLineWidth | dividerBorderWidth | divider-width | tabs-border-divider-width | divider → dividerBorders |
| dividerLineStyle | dividerBorderStyle | divider-style | tabs-border-divider-style | divider → dividerBorders |

### TOC Border Attributes

| Old Name | New Name | Old cssVar | New cssVar | Group Change | Type Change |
|----------|----------|------------|------------|--------------|-------------|
| wrapperBorderColor | blockBorderColor | toc-wrapper-border-color | toc-border-color | border → blockBorders | - |
| wrapperBorderWidth | blockBorderWidth | toc-border-width | toc-border-width | border → blockBorders | - |
| wrapperBorderStyle | blockBorderStyle | toc-border-style | toc-border-style | border → blockBorders | - |
| wrapperBorderRadius | blockBorderRadius | toc-border-radius | toc-border-radius | border → blockBorders | number → object |
| wrapperShadow | blockShadow | toc-wrapper-shadow | toc-border-shadow | border → blockBorders | - |
| wrapperShadowHover | blockShadowHover | toc-wrapper-shadow-hover | toc-border-shadow-hover | border → blockBorders | - |

---

## Appendix B: CSS Variable Quick Reference

### Standard Pattern
```
--{BLOCKNAME}-border-{ELEMENT}-{PROPERTY}
```

### Accordion Variables
```css
/* Block borders */
--accordion-border-color
--accordion-border-width
--accordion-border-style
--accordion-border-radius
--accordion-border-shadow
--accordion-border-shadow-hover

/* Header borders (optional - if added) */
--accordion-border-header-color
--accordion-border-header-width
--accordion-border-header-style
--accordion-border-header-radius

/* Divider borders */
--accordion-border-divider-color
--accordion-border-divider-width
--accordion-border-divider-style
```

### Tabs Variables
```css
/* Block (container) borders */
--tabs-border-color
--tabs-border-width
--tabs-border-style
--tabs-border-radius
--tabs-border-shadow

/* Button (tab) borders */
--tabs-border-button-color
--tabs-border-button-width
--tabs-border-button-style
--tabs-border-button-radius
--tabs-border-button-shadow
--tabs-border-button-shadow-hover
--tabs-border-button-active-color
--tabs-border-button-active-bottom-color

/* Content (panel) borders */
--tabs-border-content-color
--tabs-border-content-width
--tabs-border-content-style
--tabs-border-content-radius
--tabs-border-content-shadow

/* Divider borders */
--tabs-border-divider-color
--tabs-border-divider-width
--tabs-border-divider-style
```

### TOC Variables
```css
/* Block (wrapper) borders */
--toc-border-color
--toc-border-width
--toc-border-style
--toc-border-radius
--toc-border-shadow
--toc-border-shadow-hover
```

---

**Document Version:** 1.0
**Created:** 2025-11-25
**Author:** Claude Code
**Status:** DRAFT - Awaiting Review
