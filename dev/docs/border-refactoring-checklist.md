# Border Refactoring Implementation Checklist

This checklist provides step-by-step instructions for implementing the border refactoring across all three blocks.

**Related Documents:**
- `border-refactoring-plan.md` - Complete plan with details
- `border-refactoring-summary.md` - Quick reference
- `border-refactoring-visual-guide.md` - Visual diagrams

---

## Pre-Implementation

### Backup & Documentation
- [ ] Create git branch: `git checkout -b refactor/border-standardization`
- [ ] Document current state (screenshots of each block's border controls)
- [ ] Export sample themes for testing later
- [ ] Note any custom CSS using border variables

### Testing Setup
- [ ] Create test post with sample accordion blocks
- [ ] Create test post with sample tabs blocks
- [ ] Create test post with sample TOC blocks
- [ ] Save custom theme for each block type
- [ ] Document expected visual appearance

---

## Phase 1: Accordion Block Refactoring

### 1.1 Schema Updates (schemas/accordion.json)

- [ ] **Update group definitions:**
  ```json
  "blockBorders": {
    "title": "Block Borders",
    "description": "Main wrapper border styles"
  },
  "elementBorders": {
    "title": "Header Borders",
    "description": "Accordion header/title border styles"
  },
  "dividerBorders": {
    "title": "Divider Borders",
    "description": "Divider line between title and content"
  }
  ```
  - [ ] Remove old: `"border"`, `"border-divider"`

- [ ] **Rename attributes:**
  - [ ] `accordionBorderColor` → `blockBorderColor` (group: `blockBorders`)
  - [ ] `accordionBorderThickness` → `blockBorderWidth` (group: `blockBorders`)
  - [ ] `accordionBorderStyle` → `blockBorderStyle` (group: `blockBorders`)
  - [ ] `accordionBorderRadius` → `blockBorderRadius` (group: `blockBorders`)
  - [ ] `accordionShadow` → `blockShadow` (group: `blockBorders`)
  - [ ] `accordionShadowHover` → `blockShadowHover` (group: `blockBorders`)
  - [ ] `dividerBorderThickness` → `dividerBorderWidth` (group: `dividerBorders`)
  - [ ] `dividerBorderColor` - keep name (move to `dividerBorders`)
  - [ ] `dividerBorderStyle` - keep name (move to `dividerBorders`)

- [ ] **Update cssVar values:**
  - [ ] `blockShadow`: `accordion-shadow` → `accordion-border-shadow`
  - [ ] `blockShadowHover`: `accordion-shadow-hover` → `accordion-border-shadow-hover`
  - [ ] `dividerBorderColor`: `accordion-divider-color` → `accordion-border-divider-color`
  - [ ] `dividerBorderWidth`: `accordion-divider-width` → `accordion-border-divider-width`
  - [ ] `dividerBorderStyle`: `accordion-divider-style` → `accordion-border-divider-style`

- [ ] **Optional: Add header-specific borders (elementBorders group):**
  ```json
  "headerBorderColor": {
    "type": "string",
    "default": null,
    "cssVar": "accordion-border-header-color",
    "group": "elementBorders",
    "label": "Header Border Color",
    "themeable": true,
    "control": "ColorPicker"
  }
  ```
  - [ ] Add: `headerBorderColor`, `headerBorderWidth`, `headerBorderStyle`, `headerBorderRadius`

### 1.2 Edit.js Updates (blocks/accordion/src/edit.js)

- [ ] **Update imports:**
  ```javascript
  // Remove:
  import { BorderPanel } from '@shared';

  // Keep (should already be there):
  import { GenericPanel } from '@shared';
  ```

- [ ] **Replace BorderPanel with GenericPanels:**
  ```javascript
  // Remove:
  <BorderPanel
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="accordion"
  />

  // Add:
  <GenericPanel
    title="Block Borders"
    group="blockBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="accordion"
    initialOpen={false}
  />

  {/* Optional: only if header borders added */}
  <GenericPanel
    title="Header Borders"
    group="elementBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="accordion"
    initialOpen={false}
  />

  <GenericPanel
    title="Divider Borders"
    group="dividerBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="accordion"
    initialOpen={false}
  />
  ```

### 1.3 Style.scss Updates (blocks/accordion/src/style.scss)

- [ ] **Update CSS variable references:**
  ```scss
  // Update shadow variables
  box-shadow: var(--accordion-border-shadow, none);
  &:hover {
    box-shadow: var(--accordion-border-shadow-hover, none);
  }

  // Update divider variables
  border-top: var(--accordion-border-divider-width, 0)
              var(--accordion-border-divider-style, solid)
              var(--accordion-border-divider-color, transparent);
  ```

### 1.4 Build & Test Accordion

- [ ] Run schema build: `npm run schema:build`
- [ ] Check generated files:
  - [ ] `blocks/accordion/src/accordion-attributes.js` (updated)
  - [ ] `shared/src/types/accordion-theme.ts` (updated)
  - [ ] `shared/src/validators/accordion-schema.ts` (updated)
  - [ ] `php/css-defaults/accordion.php` (updated)
  - [ ] `assets/css/accordion-variables.css` (updated)

- [ ] Run full build: `npm run build`
- [ ] Test in WordPress editor:
  - [ ] Block Borders panel appears
  - [ ] Header Borders panel appears (if added)
  - [ ] Divider Borders panel appears
  - [ ] All controls work correctly
  - [ ] CSS applies correctly in preview
  - [ ] Existing accordion blocks still work

---

## Phase 2: Tabs Block Refactoring

### 2.1 Schema Updates (schemas/tabs.json)

- [ ] **Update group definitions:**
  ```json
  "blockBorders": {
    "title": "Container Borders",
    "description": "Main tabs container border styles"
  },
  "elementBorders": {
    "title": "Button Borders",
    "description": "Tab button border styles including active states"
  },
  "contentBorders": {
    "title": "Content Borders",
    "description": "Tab content panel border styles"
  },
  "dividerBorders": {
    "title": "Divider Borders",
    "description": "Divider line between tabs and content"
  }
  ```
  - [ ] Remove old: `"titleBorders"`, `"content"`, `"divider"`

- [ ] **Add new container border attributes (blockBorders group):**
  ```json
  "blockBorderColor": {
    "type": "string",
    "default": "#dddddd",
    "cssVar": "tabs-border-color",
    "group": "blockBorders",
    "label": "Container Border Color",
    "themeable": true,
    "control": "ColorPicker"
  }
  ```
  - [ ] Add: `blockBorderColor`, `blockBorderWidth`, `blockBorderStyle`, `blockBorderRadius`, `blockShadow`

- [ ] **Rename button border attributes (elementBorders group):**
  - [ ] `tabButtonBorderColor` → `buttonBorderColor`
  - [ ] `tabButtonBorderWidth` → `buttonBorderWidth`
  - [ ] `tabButtonBorderStyle` → `buttonBorderStyle`
  - [ ] `tabButtonBorderRadius` → `buttonBorderRadius`
  - [ ] `tabButtonShadow` → `buttonShadow`
  - [ ] `tabButtonShadowHover` → `buttonShadowHover`

- [ ] **Move active border colors to elementBorders:**
  - [ ] `tabButtonActiveBorderColor` → `buttonActiveBorderColor` (move from `titleColors` to `elementBorders`)
  - [ ] `tabButtonActiveBorderBottomColor` → `buttonActiveBorderBottomColor` (move from `titleColors` to `elementBorders`)

- [ ] **Rename content border attributes (contentBorders group):**
  - [ ] `panelBorderColor` → `contentBorderColor`
  - [ ] `panelBorderWidth` → `contentBorderWidth`
  - [ ] `panelBorderStyle` → `contentBorderStyle`
  - [ ] `panelBorderRadius` → `contentBorderRadius`
  - [ ] `panelShadow` → `contentShadow`

- [ ] **Rename divider attributes (dividerBorders group):**
  - [ ] `dividerLineColor` → `dividerBorderColor`
  - [ ] `dividerLineWidth` → `dividerBorderWidth`
  - [ ] `dividerLineStyle` → `dividerBorderStyle`

- [ ] **Update cssVar values:**
  - [ ] `blockBorderColor`: `tabs-border-color`
  - [ ] `blockBorderWidth`: `tabs-border-width`
  - [ ] `blockBorderStyle`: `tabs-border-style`
  - [ ] `blockBorderRadius`: `tabs-border-radius`
  - [ ] `blockShadow`: `tabs-border-shadow`
  - [ ] `buttonBorderColor`: `tab-button-border-color` → `tabs-border-button-color`
  - [ ] `buttonBorderWidth`: `tab-button-border-width` → `tabs-border-button-width`
  - [ ] `buttonBorderStyle`: `tab-button-border-style` → `tabs-border-button-style`
  - [ ] `buttonBorderRadius`: `tab-button-border-radius` → `tabs-border-button-radius`
  - [ ] `buttonShadow`: `tab-button-shadow` → `tabs-border-button-shadow`
  - [ ] `buttonShadowHover`: `tab-button-shadow-hover` → `tabs-border-button-shadow-hover`
  - [ ] `buttonActiveBorderColor`: `tab-button-active-border-color` → `tabs-border-button-active-color`
  - [ ] `buttonActiveBorderBottomColor`: `tab-button-active-border-bottom-color` → `tabs-border-button-active-bottom-color`
  - [ ] `contentBorderColor`: `tab-panel-border-color` → `tabs-border-content-color`
  - [ ] `contentBorderWidth`: `tab-panel-border-width` → `tabs-border-content-width`
  - [ ] `contentBorderStyle`: `tab-panel-border-style` → `tabs-border-content-style`
  - [ ] `contentBorderRadius`: `tab-panel-border-radius` → `tabs-border-content-radius`
  - [ ] `contentShadow`: `tab-panel-shadow` → `tabs-border-content-shadow`
  - [ ] `dividerBorderColor`: `divider-color` → `tabs-border-divider-color`
  - [ ] `dividerBorderWidth`: `divider-width` → `tabs-border-divider-width`
  - [ ] `dividerBorderStyle`: `divider-style` → `tabs-border-divider-style`

### 2.2 Edit.js Updates (blocks/tabs/src/edit.js)

- [ ] **Remove custom border mapping functions:**
  ```javascript
  // DELETE these functions entirely:
  function mapBorderAttributes(attributes) { ... }
  function buildTabsBorderConfig() { ... }
  ```

- [ ] **Update imports:**
  ```javascript
  // Remove:
  import { BorderPanel } from '@shared';

  // Keep (should already be there):
  import { GenericPanel } from '@shared';
  ```

- [ ] **Replace BorderPanel with GenericPanels:**
  ```javascript
  // Remove:
  <BorderPanel
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="tabs"
    customConfig={buildTabsBorderConfig()}
  />

  // Add:
  <GenericPanel
    title="Container Borders"
    group="blockBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="tabs"
    initialOpen={false}
  />

  <GenericPanel
    title="Button Borders"
    group="elementBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="tabs"
    initialOpen={false}
  />

  <GenericPanel
    title="Content Borders"
    group="contentBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="tabs"
    initialOpen={false}
  />

  <GenericPanel
    title="Divider Borders"
    group="dividerBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="tabs"
    initialOpen={false}
  />
  ```

### 2.3 Style.scss Updates (blocks/tabs/src/style.scss)

- [ ] **Update CSS variable references:**
  ```scss
  // Container (if needed)
  border: var(--tabs-border-width, 0)
          var(--tabs-border-style, solid)
          var(--tabs-border-color, transparent);
  border-radius: var(--tabs-border-radius, 0);
  box-shadow: var(--tabs-border-shadow, none);

  // Tab buttons
  border: var(--tabs-border-button-width, 1px)
          var(--tabs-border-button-style, solid)
          var(--tabs-border-button-color, transparent);
  border-radius: var(--tabs-border-button-radius, 0);
  box-shadow: var(--tabs-border-button-shadow, none);

  &:hover {
    box-shadow: var(--tabs-border-button-shadow-hover, none);
  }

  &.active {
    border-color: var(--tabs-border-button-active-color, #007cba);
    border-bottom-color: var(--tabs-border-button-active-bottom-color, transparent);
  }

  // Divider
  border-top: var(--tabs-border-divider-width, 0)
              var(--tabs-border-divider-style, solid)
              var(--tabs-border-divider-color, transparent);

  // Content panel
  border: var(--tabs-border-content-width, 1px)
          var(--tabs-border-content-style, solid)
          var(--tabs-border-content-color, #ddd);
  border-radius: var(--tabs-border-content-radius, 4px);
  box-shadow: var(--tabs-border-content-shadow, none);
  ```

### 2.4 Build & Test Tabs

- [ ] Run schema build: `npm run schema:build`
- [ ] Check generated files:
  - [ ] `blocks/tabs/src/tabs-attributes.js` (updated)
  - [ ] `shared/src/types/tabs-theme.ts` (updated)
  - [ ] `shared/src/validators/tabs-schema.ts` (updated)
  - [ ] `php/css-defaults/tabs.php` (updated)
  - [ ] `assets/css/tabs-variables.css` (updated)

- [ ] Run full build: `npm run build`
- [ ] Test in WordPress editor:
  - [ ] Container Borders panel appears
  - [ ] Button Borders panel appears
  - [ ] Content Borders panel appears
  - [ ] Divider Borders panel appears
  - [ ] All controls work correctly
  - [ ] CSS applies correctly in preview
  - [ ] Existing tabs blocks still work

---

## Phase 3: TOC Block Refactoring

### 3.1 Schema Updates (schemas/toc.json)

- [ ] **Update group definition:**
  ```json
  "blockBorders": {
    "title": "Block Borders",
    "description": "Wrapper border styles, radius, and shadow"
  }
  ```
  - [ ] Remove old: `"border"`

- [ ] **Rename attributes:**
  - [ ] `wrapperBorderColor` → `blockBorderColor` (group: `blockBorders`)
  - [ ] `wrapperBorderWidth` → `blockBorderWidth` (group: `blockBorders`)
  - [ ] `wrapperBorderStyle` → `blockBorderStyle` (group: `blockBorders`)
  - [ ] `wrapperBorderRadius` → `blockBorderRadius` (group: `blockBorders`)
  - [ ] `wrapperShadow` → `blockShadow` (group: `blockBorders`)
  - [ ] `wrapperShadowHover` → `blockShadowHover` (group: `blockBorders`)

- [ ] **Convert blockBorderRadius from number to object:**
  ```json
  // Before:
  "wrapperBorderRadius": {
    "type": "number",
    "default": "4px",
    ...
  }

  // After:
  "blockBorderRadius": {
    "type": "object",
    "default": {
      "topLeft": 4,
      "topRight": 4,
      "bottomRight": 4,
      "bottomLeft": 4
    },
    "cssVar": "toc-border-radius",
    "group": "blockBorders",
    "label": "Border Radius",
    "themeable": true,
    "control": "BorderRadiusControl",
    "unit": "px"
  }
  ```

- [ ] **Update cssVar values:**
  - [ ] `blockBorderColor`: `toc-wrapper-border-color` → `toc-border-color`
  - [ ] `blockBorderWidth`: `toc-border-width` (no change)
  - [ ] `blockBorderStyle`: `toc-border-style` (no change)
  - [ ] `blockBorderRadius`: `toc-border-radius` (no change)
  - [ ] `blockShadow`: `toc-wrapper-shadow` → `toc-border-shadow`
  - [ ] `blockShadowHover`: `toc-wrapper-shadow-hover` → `toc-border-shadow-hover`

### 3.2 Edit.js Updates (blocks/toc/src/edit.js)

- [ ] **Update imports:**
  ```javascript
  // Remove:
  import { BorderPanel } from '@shared';

  // Keep (should already be there):
  import { GenericPanel } from '@shared';
  ```

- [ ] **Replace BorderPanel with GenericPanel:**
  ```javascript
  // Remove:
  <BorderPanel
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="toc"
  />

  // Add:
  <GenericPanel
    title="Block Borders"
    group="blockBorders"
    effectiveValues={effectiveValues}
    attributes={attributes}
    setAttributes={setAttributes}
    blockType="toc"
    initialOpen={false}
  />
  ```

### 3.3 Style.scss Updates (blocks/toc/src/style.scss)

- [ ] **Update CSS variable references:**
  ```scss
  border: var(--toc-border-width, 1px)
          var(--toc-border-style, solid)
          var(--toc-border-color, #dddddd);
  border-radius: var(--toc-border-radius, 4px);
  box-shadow: var(--toc-border-shadow, none);

  &:hover {
    box-shadow: var(--toc-border-shadow-hover, none);
  }
  ```

### 3.4 Build & Test TOC

- [ ] Run schema build: `npm run schema:build`
- [ ] Check generated files:
  - [ ] `blocks/toc/src/toc-attributes.js` (updated)
  - [ ] `shared/src/types/toc-theme.ts` (updated)
  - [ ] `shared/src/validators/toc-schema.ts` (updated)
  - [ ] `php/css-defaults/toc.php` (updated)
  - [ ] `assets/css/toc-variables.css` (updated)

- [ ] Run full build: `npm run build`
- [ ] Test in WordPress editor:
  - [ ] Block Borders panel appears
  - [ ] All controls work correctly (especially radius with 4 corners)
  - [ ] CSS applies correctly in preview
  - [ ] Existing TOC blocks still work

---

## Phase 4: Final Testing & Verification

### 4.1 Visual Regression Testing

**Accordion:**
- [ ] Default block renders correctly
- [ ] Block borders apply correctly
- [ ] Header borders apply correctly (if added)
- [ ] Divider renders correctly
- [ ] Shadow effects work
- [ ] Hover effects work
- [ ] Border radius renders correctly (4 corners)

**Tabs:**
- [ ] Default block renders correctly
- [ ] Container borders apply correctly
- [ ] Button borders apply correctly
- [ ] Active button borders apply correctly
- [ ] Content panel borders apply correctly
- [ ] Divider line renders correctly
- [ ] Shadow effects work
- [ ] Border radius renders correctly (4 corners)

**TOC:**
- [ ] Default block renders correctly
- [ ] Block borders apply correctly
- [ ] Border radius renders correctly with object format (4 corners)
- [ ] Shadow effects work
- [ ] Hover effects work

### 4.2 Theme Testing

- [ ] Load previously saved accordion theme
- [ ] Load previously saved tabs theme
- [ ] Load previously saved TOC theme
- [ ] Create new theme for each block
- [ ] Apply themes and verify CSS variables
- [ ] Switch between themes and verify changes

### 4.3 Backward Compatibility Testing

**Pre-refactoring blocks:**
- [ ] Accordion blocks from before refactoring still display correctly
- [ ] Tabs blocks from before refactoring still display correctly
- [ ] TOC blocks from before refactoring still display correctly
- [ ] No console errors for old blocks
- [ ] Old attributes migrate correctly (if using deprecated attributes)

### 4.4 Cross-Browser Testing

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Verify CSS variables supported/fallback works

### 4.5 Performance Testing

- [ ] Page load time acceptable
- [ ] Editor performance acceptable
- [ ] No JavaScript errors in console
- [ ] No PHP errors in logs

---

## Phase 5: Documentation & Cleanup

### 5.1 Code Cleanup

- [ ] Remove unused BorderPanel component (if no longer used anywhere)
- [ ] Remove custom mapping functions from tabs edit.js
- [ ] Clean up any commented-out code
- [ ] Update code comments where needed

### 5.2 Documentation Updates

- [ ] Review auto-generated docs:
  - [ ] `docs/accordion-attributes.md`
  - [ ] `docs/tabs-attributes.md`
  - [ ] `docs/toc-attributes.md`

- [ ] Update CLAUDE.md if needed:
  - [ ] Document new standard border groups
  - [ ] Document new naming conventions
  - [ ] Add border refactoring notes

- [ ] Create migration guide for users (if needed):
  - [ ] Document attribute name changes
  - [ ] Document CSS variable changes
  - [ ] Provide examples

### 5.3 Git Commit

- [ ] Review all changes: `git status`
- [ ] Stage changes: `git add .`
- [ ] Commit with descriptive message:
  ```bash
  git commit -m "refactor: Standardize border handling across all blocks

  - Unified border group naming (blockBorders, elementBorders, contentBorders, dividerBorders)
  - Standardized attribute names (block*, button*, content*, divider*)
  - Consistent CSS variable pattern (--{block}-border-{element}-{property})
  - Replaced BorderPanel with GenericPanel
  - Converted TOC borderRadius from number to object (4 corners)
  - Updated all edit.js, style.scss files
  - Backward compatible via deprecated attributes

  BREAKING CHANGE: CSS variable names have changed. Custom CSS may need updates.
  See docs/border-refactoring-plan.md for migration guide."
  ```

---

## Phase 6: Deployment

### 6.1 Pre-Deployment

- [ ] Merge to main branch: `git checkout main && git merge refactor/border-standardization`
- [ ] Run final build: `npm run build`
- [ ] Create backup of production database
- [ ] Document rollback plan

### 6.2 Deployment

- [ ] Deploy to staging environment first
- [ ] Test on staging with real content
- [ ] Verify all functionality works
- [ ] Get approval from stakeholders
- [ ] Deploy to production

### 6.3 Post-Deployment Monitoring

- [ ] Monitor error logs for 24 hours
- [ ] Check for user-reported issues
- [ ] Verify themes still work correctly
- [ ] Monitor performance metrics

---

## Rollback Procedure (If Needed)

If critical issues are discovered:

1. [ ] Revert git commit: `git revert HEAD`
2. [ ] Run build: `npm run build`
3. [ ] Deploy reverted version
4. [ ] Restore database backup (if needed)
5. [ ] Notify users
6. [ ] Document issues for fix
7. [ ] Create new branch for fixes
8. [ ] Re-test and re-deploy when ready

---

## Success Criteria

The refactoring is successful when:

✅ All three blocks use consistent border group names
✅ All attribute names follow the standard pattern
✅ All CSS variables follow the standard pattern
✅ All blocks use GenericPanel (no BorderPanel)
✅ TOC uses object format for borderRadius (4 corners)
✅ No visual regressions
✅ Existing blocks still work correctly
✅ Themes still apply correctly
✅ No console errors
✅ No PHP errors
✅ Documentation is updated
✅ Code is clean and maintainable

---

**Total Estimated Time:** 2-3 days
**Priority:** High
**Risk Level:** Medium (requires careful testing)

---

**Related Documents:**
- Full plan: `border-refactoring-plan.md`
- Quick reference: `border-refactoring-summary.md`
- Visual guide: `border-refactoring-visual-guide.md`
