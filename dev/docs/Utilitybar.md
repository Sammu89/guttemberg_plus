# UtilityBar Implementation Plan

## Objective
Create a unified UtilityBar component that consolidates device switchers, link/unlink toggles, and reset buttons into a single location, removing scattered utility implementations across controls.

## User Requirements
1. Single UtilityBar component containing:
   - Device switcher (when responsive)
   - Link/unlink toggle (when decomposable)
   - Reset button (always visible)
2. Reset button ALWAYS resets EVERYTHING (values + linked state + responsive state + device overrides)
3. Remove all scattered utility instances from individual controls
4. Update all imports and naming references

## Implementation Phases

### Phase 1: Create Core UtilityBar Component

**File:** `shared/src/components/controls/UtilityBar.js` (NEW)

**Component Structure:**
```jsx
<Flex gap={1} align="center" className="gutplus-utility-bar">
  {/* Responsive Section */}
  {canBeResponsive && !isResponsiveEnabled && (
    <ResponsiveToggleButton />  // Enable responsive mode
  )}
  {(isResponsive || isResponsiveEnabled) && (
    <DeviceSwitcher />  // Device selection
  )}

  {/* Link/Unlink Section */}
  {isDecomposable && (
    <LinkToggle />  // Link sides toggle
  )}

  {/* Reset Section */}
  <ResetButton />  // Always visible
</Flex>
```

**Props Interface:**
- `isResponsive` - Control supports responsive mode
- `canBeResponsive` - Responsive can be toggled on/off
- `isDecomposable` - Control has linkable sides (box controls)
- `currentDevice` - Current device state
- `isResponsiveEnabled` - Whether responsive mode is enabled
- `isLinked` - Whether sides are linked
- `onResponsiveToggle` - Enable/disable responsive handler
- `onLinkChange` - Link toggle handler
- `onReset` - Comprehensive reset handler
- `disabled` - Disable all controls

**Dependencies:**
- Reuses existing atoms: `DeviceSwitcher`, `LinkToggle`, `ResetButton`
- WordPress components: `Flex`, `FlexItem`, `Button`
- Icons: `responsive` from controls/icons

### Phase 2: Create Comprehensive Reset Helper

**File:** `shared/src/utils/reset-helpers.js` (NEW)

**Function:** `createComprehensiveReset(options)`

**Reset Logic:**
1. Reset attribute value to schema default
2. If decomposable: Set `linked: true`
3. Clear all device overrides (remove `tablet`, `mobile` keys)
4. If canBeResponsive: Set `responsiveEnabled[attr]: false`

**Returns:** Handler function for onReset

### Phase 3: Migrate BorderPanel (First Control)

**File:** `shared/src/components/controls/full/BorderPanel.js`

**Changes:**
1. Import `UtilityBar` and `createComprehensiveReset`
2. Replace scattered utilities in label area (lines ~362-388):
   - Remove DeviceSwitcher
   - Remove LinkToggle
   - Add UtilityBar
3. Replace `handleReset` with comprehensive reset
4. Pass props to UtilityBar:
   ```jsx
   <UtilityBar
     isResponsive={responsive}
     isDecomposable={!lockLinked}
     isLinked={linked}
     onLinkChange={handleLinkChange}
     onReset={comprehensiveReset}
   />
   ```

**Special consideration:** BorderPanel resets 3 attributes (width, color, style) - ensure comprehensive reset handles this

### Phase 4: Migrate SpacingControl (canBeResponsive Pattern)

**File:** `shared/src/components/controls/full/SpacingControl.js`

**Changes:**
1. Replace ResponsiveToggle (lines ~286-296) with UtilityBar
2. Props to UtilityBar:
   ```jsx
   <UtilityBar
     canBeResponsive={canBeResponsive}
     isResponsiveEnabled={responsiveEnabled}
     isDecomposable={true}
     onResponsiveToggle={onResponsiveToggle}
     onLinkChange={handleLinkChange}
     onReset={comprehensiveReset}
   />
   ```
3. **Remove LinkToggle from CompactBoxRow** - now in UtilityBar only

### Phase 5: Migrate BorderWidthControl & BorderRadiusControl

**Files:**
- `shared/src/components/controls/full/BorderWidthControl.js`
- `shared/src/components/controls/full/BorderRadiusControl.js`

**Changes:**
1. Replace DeviceSwitcher in label area with UtilityBar
2. Add comprehensive reset
3. **Remove LinkToggle from CompactBoxRow** - now in UtilityBar only
4. Props similar to BorderPanel pattern

### Phase 6: Update CompactBoxRow (Remove Link Toggle)

**File:** `shared/src/components/controls/organisms/CompactBoxRow.js`

**Changes:**
1. Remove `showLink` prop (no longer needed)
2. Remove LinkToggle rendering (lines ~104-112)
3. Simplify component - just renders box input rows

**Rationale:** All link toggles now in UtilityBar per user requirement

### Phase 7: Update Exports and Cleanup

**File:** `shared/src/components/controls/index.js`

**Changes:**
1. Export `UtilityBar`
2. Mark `ResponsiveToggle` as deprecated (comment)

**File:** `shared/src/utils/index.js` (if exists, or create)

**Changes:**
1. Export `createComprehensiveReset` and other reset helpers

## Critical Files to Modify

**New Files:**
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/UtilityBar.js`
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/utils/reset-helpers.js`

**Modified Files:**
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/full/BorderPanel.js`
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/full/SpacingControl.js`
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/full/BorderWidthControl.js`
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/full/BorderRadiusControl.js`
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/organisms/CompactBoxRow.js`
- `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/index.js`

## Import Updates Strategy

**Before (scattered):**
```javascript
import { DeviceSwitcher } from '../atoms/DeviceSwitcher';
import { LinkToggle } from '../atoms/LinkToggle';
import { ResponsiveToggle } from '../atoms/ResponsiveToggle';
```

**After (unified):**
```javascript
import { UtilityBar } from '../UtilityBar';
import { createComprehensiveReset } from '../../utils/reset-helpers';
```

## Edge Cases Handled

1. **lockLinked prop (BorderPanel):** When true, sets `isDecomposable={false}` to hide link toggle
2. **BorderPanel compound reset:** Resets width, color, AND style attributes
3. **Responsive toggle pattern:** Handles both always-on (BorderPanel) and opt-in (SpacingControl) patterns
4. **Device state synchronization:** Uses global `useResponsiveDevice()` hook

## Testing Checklist

After each migration:
- [ ] UtilityBar appears in label area
- [ ] Device switching works correctly
- [ ] Link toggle switches linked/unlinked mode
- [ ] Reset button resets EVERYTHING (value + linked + responsive + devices)
- [ ] Responsive toggle enables/disables mode (SpacingControl)
- [ ] No duplicate utilities anywhere
- [ ] All imports updated correctly

## Visual Layout

```
┌─────────────────────────────────────────────────┐
│ [Label]     [Desktop▼][Tablet][Mobile] [🔗] [↻] │ ← UtilityBar
├─────────────────────────────────────────────────┤
│  [Control Input Area]                           │
└─────────────────────────────────────────────────┘
```

Order: Responsive controls → Link toggle → Reset button

## Success Criteria

1. ✅ Single UtilityBar component contains all utilities
2. ✅ No scattered device switchers in controls
3. ✅ No scattered link toggles (removed from CompactBoxRow)
4. ✅ No scattered reset buttons
5. ✅ Reset always resets everything (comprehensive)
6. ✅ All imports updated and consolidated
7. ✅ Existing functionality preserved
8. ✅ No breaking changes to data structures
