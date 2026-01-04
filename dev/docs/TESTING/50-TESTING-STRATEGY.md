# Testing Strategy

## Core Testing Priorities

### 1. Event Isolation
- Accordion theme changes don't affect Tabs/TOC
- Tabs theme changes don't affect Accordion/TOC
- TOC theme changes don't affect Accordion/Tabs
- Test: Create/update/delete themes for each block type independently

### 2. Cascade Performance
- `getAllEffectiveValues()` <5ms target
- Theme switch <100ms
- No cascade resolution on every render (cache results)

### 3. Theme Operations
- Create theme saves deltas (no null values; unchanged attributes omitted)
- Update theme clears block customizations
- Delete theme falls back to Default
- Rename theme updates all blocks using it

### 4. CustomizationCache
- Survives theme switching during session
- Shows in dropdown as "(Custom)"
- Only active theme's customizations persist on save
- Reset button clears session cache

### 5. Accessibility
- Unique IDs per block (no duplicates)
- Correct ARIA attributes
- Keyboard navigation works
- Screen reader announcements

## Test Checklist by Phase

### Phase 1 Tests

**CSS Parsing**:
- [ ] Loads php/css-defaults/{blockType}.php
- [ ] Caches with file modification time
- [ ] JavaScript receives window.{blockType}Defaults
- [ ] Returns null for missing variables

**Cascade Resolver**:
- [ ] Block customization overrides theme
- [ ] Theme overrides CSS default
- [ ] CSS default used when others null
- [ ] <5ms for 50 attributes
- [ ] Pure function (no side effects)

**@wordpress/data Store**:
- [ ] Store registers successfully
- [ ] Selectors return correct data
- [ ] Actions dispatch correctly
- [ ] Event isolation (accordion/tabs/toc separate)
- [ ] Loading state updates correctly

**Theme Storage PHP**:
- [ ] REST API endpoints work
- [ ] Permissions checked (edit_posts)
- [ ] Themes save to correct wp_option
- [ ] Returns JSON responses
- [ ] Handles errors (404, 409, 400)
- [ ] Validates theme names
- [ ] Duplicate names rejected

### Phase 2-4 Tests (Per Block)

**Block Registration**:
- [ ] Block appears in inserter
- [ ] Can insert block
- [ ] Block renders in editor

**Theme Integration**:
- [ ] Can create themes
- [ ] Can update themes
- [ ] Can delete themes
- [ ] Can rename themes
- [ ] Theme switching works

**Cascade Resolution**:
- [ ] Block customizations override theme
- [ ] Theme values override CSS
- [ ] CSS defaults used when uncustomized
- [ ] UI shows effective values (not raw attributes)

**Frontend**:
- [ ] Interactions work (expand/collapse, tab switch)
- [ ] ARIA attributes correct
- [ ] Keyboard navigation functional
- [ ] No JavaScript errors

### Phase 5 Integration Tests

**Cross-Block Isolation**:
```javascript
test('accordion themes do not affect tabs', () => {
  createTheme('accordion', 'Test', values);
  const tabsThemes = getThemes('tabs');
  expect(tabsThemes).not.toHaveProperty('Test');
});
```

**Performance**:
- [ ] Cascade resolution <5ms
- [ ] Theme switch <100ms
- [ ] Build time <30s

**Accessibility**:
- [ ] WCAG AA compliance
- [ ] No duplicate IDs on page with multiple blocks
- [ ] Screen readers announce state changes
- [ ] Keyboard navigation works for all blocks

## Manual Testing Workflows

### Workflow 1: Theme Customization

1. Insert accordion block
2. Create theme "Test Theme"
3. Verify theme appears in dropdown
4. Switch to "Test Theme"
5. Customize title color
6. Verify "(Custom)" appears in dropdown
7. Switch to Default
8. Switch back to "Test Theme (Custom)"
9. Verify customization restored
10. Save page
11. Reload page
12. Verify "Test Theme (Custom)" persists

### Workflow 2: Theme Update

1. Insert 2 accordion blocks
2. Apply "Dark Mode" to both
3. Customize Block 1 title color to red
4. Update "Dark Mode" theme
5. Verify Block 2 updates immediately
6. Verify Block 1 customization cleared (now matches updated theme)

### Workflow 3: Multiple Block Types

1. Insert accordion, tabs, TOC blocks
2. Create theme for each block type
3. Verify themes don't interfere
4. Update accordion theme
5. Verify tabs/TOC unaffected
6. Delete tabs theme
7. Verify accordion/TOC unaffected
