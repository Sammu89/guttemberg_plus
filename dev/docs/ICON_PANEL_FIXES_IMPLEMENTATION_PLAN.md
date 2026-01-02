# Icon Panel Fixes - Implementation Plan

**Date:** 2026-01-01
**Document:** Implementation plan to fix known gaps vs requirements in Icon Panel
**Reference:** `docs/IconPanel_Generation.md` (lines 87-90)

---

## Executive Summary

This document provides a detailed implementation plan to fix three known gaps between the Icon Panel requirements and current implementation:

1. **Lucide icons not appearing** in the library picker (empty list)
2. **Preview Open State toggle** is inside the Active tab instead of above the tabs
3. **Rotation control is hidden** when `useDifferentIcons` is enabled (should always be visible)

---

## Gap 1: Lucide Icons Not Appearing

### Current State

**File:** `shared/src/components/controls/IconPicker.js`
**Lines:** 151-158, 276, 290-292

The `getLucideIcons()` function filters Lucide exports:
```javascript
const getLucideIcons = () => {
  return Object.keys( LucideIcons ).filter(
    ( name ) =>
      ! name.startsWith( 'create' ) &&
      ! name.startsWith( 'Icon' ) &&
      typeof LucideIcons[ name ] === 'function'
  );
};
```

**Problem Analysis:**
- The filter logic appears correct
- The function is called in `LibraryTab` (line 276)
- Lucide-react exports React components (functions)
- Possible issues:
  - Export structure may have changed in newer Lucide versions
  - Filter may be too restrictive
  - Icons may not be rendering correctly
  - Import may be incorrect

### Solution

**Step 1: Debug the icon list**
Add console logging to understand what's being exported:
```javascript
const getLucideIcons = () => {
  const allKeys = Object.keys( LucideIcons );
  console.log('Total Lucide exports:', allKeys.length);

  const filtered = allKeys.filter(
    ( name ) =>
      ! name.startsWith( 'create' ) &&
      ! name.startsWith( 'Icon' ) &&
      typeof LucideIcons[ name ] === 'function'
  );

  console.log('Filtered Lucide icons:', filtered.length);
  console.log('Sample icons:', filtered.slice(0, 10));

  return filtered;
};
```

**Step 2: Fix the filter logic**
Based on Lucide-react structure, update the filter:
```javascript
const getLucideIcons = () => {
  return Object.keys( LucideIcons ).filter(
    ( name ) =>
      // Exclude utility functions and components
      ! name.startsWith( 'create' ) &&
      name !== 'Icon' &&
      name !== 'default' &&
      // Check if it's a valid React component (function)
      typeof LucideIcons[ name ] === 'function' &&
      // Icon components typically start with uppercase
      /^[A-Z]/.test( name )
  );
};
```

**Step 3: Verify LucideIcon component**
Ensure the `LucideIcon` helper component (lines 356-361) correctly renders:
```javascript
function LucideIcon( { name, size = 24 } ) {
  const IconComponent = LucideIcons[ name ];

  if ( ! IconComponent ) {
    console.warn( `Lucide icon not found: ${name}` );
    return null;
  }

  return <IconComponent size={ size } />;
}
```

**Files to Modify:**
- `shared/src/components/controls/IconPicker.js` (lines 151-158, 356-361)

**Testing:**
1. Build and reload the editor
2. Open Icon panel → Library tab → Click "Lucide Icons"
3. Verify icons appear in the grid
4. Test icon selection and preview

---

## Gap 2: Preview Open State Toggle Placement

### Current State

**File:** `shared/src/components/controls/IconPanel.js`
**Lines:** 569-579

The toggle is currently inside `IconStateControls` function:
```javascript
function IconStateControls( { state, attributes, effectiveValues, onChange, currentDevice, blockType } ) {
  // ...
  return (
    <div className={ `icon-state-${ state }` } style={ { marginTop: '16px' } }>
      { /* Preview Toggle for Active State */ }
      { state === 'active' && (
        <div style={ { marginBottom: '16px', padding: '12px', backgroundColor: '#f0f0f1', borderRadius: '4px' } }>
          <ToggleControl
            label="Preview Open State"
            checked={ effectiveValues?.initiallyOpen || false }
            onChange={ ( checked ) => onChange( { initiallyOpen: checked } ) }
            help="Toggle to preview the open/active icon in the editor"
            __nextHasNoMarginBottom
          />
        </div>
      ) }
      // ... rest of controls
    </div>
  );
}
```

**Requirement:**
The toggle should appear **outside and above** the Inactive/Active tabs (per line 80 of IconPanel_Generation.md).

### Solution

**Step 1: Move toggle from IconStateControls to DualIconMode**

Remove the toggle from `IconStateControls` (delete lines 569-579).

**Step 2: Add toggle above TabPanel in DualIconMode**

Update the `DualIconMode` component (lines 520-546):
```javascript
function DualIconMode( { attributes, effectiveValues, onChange, currentDevice, blockType } ) {
  const tabs = [
    { name: 'inactive', title: 'Inactive (Closed)' },
    { name: 'active', title: 'Active (Open)' },
  ];

  return (
    <div className="dual-icon-mode">
      { /* Preview Open State Toggle - OUTSIDE tabs */ }
      <div style={ { marginBottom: '16px', padding: '12px', backgroundColor: '#f0f0f1', borderRadius: '4px' } }>
        <ToggleControl
          label="Preview Open State"
          checked={ effectiveValues?.initiallyOpen || false }
          onChange={ ( checked ) => onChange( { initiallyOpen: checked } ) }
          help="Toggle to preview the open/active icon in the editor"
          __nextHasNoMarginBottom
        />
      </div>

      { /* Inactive/Active Tabs */ }
      <TabPanel
        className="icon-state-tabs"
        tabs={ tabs }
        initialTabName="inactive"
      >
        { ( tab ) => (
          <IconStateControls
            state={ tab.name }
            attributes={ attributes }
            effectiveValues={ effectiveValues }
            onChange={ onChange }
            currentDevice={ currentDevice }
            blockType={ blockType }
          />
        ) }
      </TabPanel>
    </div>
  );
}
```

**Files to Modify:**
- `shared/src/components/controls/IconPanel.js` (lines 520-579)

**Testing:**
1. Enable "Different icons for active state"
2. Verify "Preview Open State" toggle appears **above** the Inactive/Active tabs
3. Toggle it and verify the editor preview updates
4. Switch between tabs and verify the toggle remains visible

---

## Gap 3: Rotation Control Hidden When useDifferentIcons is Enabled

### Current State

**Problem Location 1:** `shared/src/components/controls/IconPanel.js` (line 276)
```javascript
{ /* Rotation Slider - Only show in single icon mode */ }
{ ! useDifferentIcons && (
  <div style={ { marginTop: '16px', marginBottom: '16px' } }>
    <SliderWithInput
      label="Rotation Angle"
      // ...
    />
  </div>
) }
```

**Problem Location 2:** `build-tools/schema-compiler.js` (lines 402-405)
```javascript
expanded.iconRotation = {
  // ...
  showWhen: {
    showIcon: [true],
    useDifferentIcons: [false]  // ← Problem: should always show when showIcon is true
  }
};
```

**Requirement:**
Per lines 78 and 84 of IconPanel_Generation.md:
- "Rotation is the only visual change between open/close (icon kind stays the same)"
- "Rotation still applies as the transition between closed and open states"

Rotation should **always be visible** when `showIcon` is true, regardless of `useDifferentIcons` state.

### Solution

**Step 1: Update IconPanel.js**

Change the condition on line 276 to always show rotation:
```javascript
{ /* Rotation Slider - Always shown when icon is visible */ }
<div style={ { marginTop: '16px', marginBottom: '16px' } }>
  <SliderWithInput
    label="Rotation Angle"
    value={ parseValueWithUnit( effectiveValues?.iconRotation || '180deg' ) }
    onChange={ ( val ) => {
      const valueStr = typeof val === 'object' && val.value !== undefined
        ? `${ val.value }${ val.unit || 'deg' }`
        : `${ val }deg`;
      handleChange( { iconRotation: valueStr } );
    } }
    min={ -180 }
    max={ 180 }
    step={ 1 }
    units={ [ 'deg' ] }
    help={ useDifferentIcons
      ? "Rotation applied to both icons during transition"
      : "Rotation applied when open"
    }
    responsive={ false }
    canBeResponsive={ false }
  />
</div>
```

**Key Changes:**
- Remove the `! useDifferentIcons &&` condition
- Update the help text to clarify behavior in both modes

**Step 2: Update schema-compiler.js**

Change the `showWhen` condition for `iconRotation`:
```javascript
expanded.iconRotation = {
  type: 'string',
  default: defaults.rotation || '180deg',
  control: 'SliderWithInput',
  cssVar: `${cssVar}-rotation`,
  cssProperty: 'transform',
  appliesTo: structureElement,
  themeable: true,
  responsive: false,
  outputsCSS: true,
  group,
  order: order ? order + 0.15 : 0.15,
  label: 'Rotation',
  description: 'Rotation angle applied during open/close transition',
  min: -360,
  max: 360,
  step: 1,
  unit: 'deg',
  showWhen: {
    showIcon: [true]
    // REMOVED: useDifferentIcons: [false]
  }
};
```

**Files to Modify:**
- `shared/src/components/controls/IconPanel.js` (lines 275-297)
- `build-tools/schema-compiler.js` (line 404)

**Post-Modification Steps:**
1. Run `npm run schema:build` to regenerate all schema-dependent files
2. Run `npm run build` to compile the blocks

**Testing:**
1. With "Different icons for active state" **OFF**:
   - Verify rotation slider is visible
   - Adjust rotation and verify icon rotates in editor preview
2. With "Different icons for active state" **ON**:
   - Verify rotation slider is **still visible**
   - Set different icons for inactive/active states
   - Adjust rotation and verify both icons rotate during transition
   - Toggle "Preview Open State" and verify rotation applies correctly

---

## Build and Testing Workflow

### 1. Pre-Implementation Checklist
- [ ] Backup current working files
- [ ] Ensure git status is clean
- [ ] Document current behavior with screenshots

### 2. Implementation Order

**Phase 1: Schema Changes (Gap 3 - Part 2)**
```bash
# Edit build-tools/schema-compiler.js
# Remove useDifferentIcons from iconRotation showWhen

npm run schema:build
```

**Phase 2: Component Changes (All Gaps)**
```bash
# Edit shared/src/components/controls/IconPicker.js (Gap 1)
# Edit shared/src/components/controls/IconPanel.js (Gap 2 & 3)

npm run build
```

**Phase 3: Testing**
```bash
# Start WordPress local environment
# Open block editor
# Test each gap fix individually
```

### 3. Testing Checklist

**Gap 1: Lucide Icons**
- [ ] Open Icon panel → Library tab
- [ ] Click "Lucide Icons" button
- [ ] Verify icons appear in grid (should show 200+ icons)
- [ ] Search for specific icon (e.g., "chevron")
- [ ] Select an icon and verify it appears in editor preview
- [ ] Save block and verify icon persists on frontend

**Gap 2: Preview Toggle Placement**
- [ ] Enable "Different icons for active state"
- [ ] Verify "Preview Open State" toggle appears **above** tabs
- [ ] Toggle it and verify editor preview updates
- [ ] Switch between Inactive/Active tabs
- [ ] Verify toggle remains visible and functional
- [ ] Disable "Different icons for active state"
- [ ] Verify toggle disappears (expected behavior)

**Gap 3: Rotation Always Visible**
- [ ] With single icon mode (useDifferentIcons OFF):
  - [ ] Verify rotation slider visible
  - [ ] Adjust rotation (-180 to 180)
  - [ ] Verify icon rotates in editor preview
- [ ] Enable "Different icons for active state"
- [ ] Verify rotation slider **still visible**
- [ ] Select different icons for inactive/active
- [ ] Adjust rotation and verify it applies to transition
- [ ] Toggle "Preview Open State" and verify rotation behavior

### 4. Validation

**Console Checks:**
- [ ] No JavaScript errors in browser console
- [ ] Lucide icons logged correctly (count and sample names)
- [ ] No missing component warnings

**Visual Checks:**
- [ ] Icon panel layout is clean and organized
- [ ] Controls appear in correct order
- [ ] Responsive controls work on all devices
- [ ] Help text is clear and accurate

**Functional Checks:**
- [ ] All icon types work (character, image, library)
- [ ] Theme system respects icon customizations
- [ ] Icons save/load correctly
- [ ] Frontend rendering matches editor preview

---

## Files Modified Summary

| File | Lines | Change Type | Description |
|------|-------|-------------|-------------|
| `shared/src/components/controls/IconPicker.js` | 151-158, 356-361 | Fix | Improve Lucide icon filtering and logging |
| `shared/src/components/controls/IconPanel.js` | 275-297 | Modify | Remove useDifferentIcons condition from rotation |
| `shared/src/components/controls/IconPanel.js` | 520-579 | Refactor | Move Preview toggle outside tabs |
| `build-tools/schema-compiler.js` | 402-405 | Fix | Remove useDifferentIcons from showWhen |

---

## Rollback Plan

If issues arise:

1. **Revert Git Changes:**
   ```bash
   git checkout shared/src/components/controls/IconPicker.js
   git checkout shared/src/components/controls/IconPanel.js
   git checkout build-tools/schema-compiler.js
   ```

2. **Regenerate and Rebuild:**
   ```bash
   npm run schema:build
   npm run build
   ```

3. **Document Issues:**
   - Screenshot errors
   - Copy console logs
   - Note specific behaviors

---

## Success Criteria

All three gaps are considered fixed when:

1. ✅ Lucide icons appear in the library picker (minimum 200+ icons)
2. ✅ Preview Open State toggle appears **above** the Inactive/Active tabs
3. ✅ Rotation control is visible regardless of `useDifferentIcons` state
4. ✅ No JavaScript errors in console
5. ✅ All existing functionality still works
6. ✅ Theme system correctly handles icon attributes
7. ✅ Frontend rendering matches editor preview

---

## Timeline Estimate

**Note:** Per project guidelines, no time estimates are provided. Focus is on what needs to be done, not when.

**Implementation Phases:**
- Phase 1: Schema changes → regenerate files
- Phase 2: Component changes → rebuild
- Phase 3: Testing and validation
- Phase 4: Documentation updates

---

## Related Documentation

- `docs/IconPanel_Generation.md` - Full Icon Panel technical documentation
- `CLAUDE.md` - Project architecture and schema-first approach
- `docs/accordion-attributes.md` - Auto-generated attribute documentation

---

## Notes

- All changes maintain backward compatibility
- No database migrations required
- Existing blocks will benefit from fixes immediately
- Theme system automatically handles new behavior
- No CSS changes required

---

**Plan Status:** Ready for Implementation
**Next Step:** Begin Phase 1 (Schema Changes)
