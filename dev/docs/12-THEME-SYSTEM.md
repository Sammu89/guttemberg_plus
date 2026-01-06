# Theme System Architecture

**Single source of truth for theme storage, operations, and data structures**

---

## Design Rationale

### Why Delta Storage (Not Complete Snapshots)?

**Decision**: All saved themes contain ONLY differences from defaults (deltas)

**Why**:
- **Optimized storage**: Only save what changes (~1-2KB vs ~5KB per theme)
- **CSS follows defaults**: When CSS defaults change, themes inherit those changes
- **Simpler theme updates**: Only modified attributes in theme
- **Clear intent**: Theme shows exactly what the user changed

**Trade-off**: Must combine defaults + deltas when loading, but this is fast (<5ms)

### Why Separate Storage Per Block Type?

**Decision**: `accordion_themes`, `tabs_themes`, `toc_themes` - completely isolated

**Why**:
- Event isolation (accordion theme CRUD doesn't trigger tabs updates)
- Simpler queries (no filtering by block type)
- Independent scaling (each block can have many themes)
- Clear data ownership

**Alternative Rejected**: Single `gutenberg_blocks_themes` table - would violate event isolation, more complex

### Why Default Uses Empty String?

**Decision**: "Default" is represented by empty string (`currentTheme = ''`) with NO database storage

**Why**:
- No theme tier in cascade (better performance)
- No database storage needed (smaller footprint)
- CSS changes propagate immediately to Default-themed blocks
- True "CSS as single source of truth" for uncustomized blocks
- Consistent with attribute philosophy (no theme = use defaults)

**Implementation**:
- UI shows "Default" label for empty string value
- Empty string → uses CSS + behavioral defaults
- More efficient than storing a theme with all default values

---

## New Simplified Architecture

### Core Principles

1. **Sidebar = Source of Truth**: All attribute values shown in sidebar are the actual block attributes
2. **Themes = Deltas**: Themes save only differences from defaults (optimized storage)
3. **customizationCache = Complete Snapshot**: Auto-updated on every change (safety/restoration)
4. **Auto-Detection**: System automatically detects customizations by comparing to expected values
5. **Reset-and-Apply**: Theme switching resets to defaults then applies theme deltas

### Data Flow

```
User edits sidebar
   ↓
Writes directly to attributes (source of truth)
   ↓
customizationCache auto-updates with complete snapshot
   ↓
User saves as theme
   ↓
Calculate deltas from defaults
   ↓
Store deltas only in database
   ↓
Block switches to clean theme (cache cleared)
```

---

## Theme Data Structure

### Delta Storage Principle

Themes are **optimized deltas** containing only attributes that differ from defaults.

**Exception**: "Default" is represented by empty string (`currentTheme = ''`) with no database storage

```javascript
// Defaults (CSS + behavioral)
defaults = {
  titleColor: "#333333",
  titleFontSize: 16,
  titleBackgroundColor: "#f5f5f5",
  showIcon: true,
  // ... 40+ more attributes
}

// Saved theme (ONLY deltas)
{
  "Dark Mode": {
    name: "Dark Mode",
    values: {
      titleColor: "#ffffff",           // Different from default
      titleBackgroundColor: "#2c2c2c"  // Different from default
      // titleFontSize NOT included (matches default)
      // showIcon NOT included (matches default)
    },
    created: "2025-01-15 10:30:00",
    modified: "2025-01-15 10:30:00"
  }
}

// When loading theme:
effectiveValues = applyDeltas(defaults, theme.values)
// Results in complete values for rendering
```

## Storage Architecture

### Separate Storage Per Block Type

**Database Location**: WordPress `wp_options` table

**Storage Keys**:
- Accordion: `accordion_themes`
- Tabs: `tabs_themes`
- TOC: `toc_themes`

**Critical**: No cross-contamination. Accordion theme changes don't trigger Tabs/TOC updates.

### Default Theme Behavior

**Storage**: NOT stored in database. Represented by empty string (`currentTheme = ''`)

**Purpose**: Allows blocks to use CSS + behavioral defaults directly

**How It Works**:
- Block has `currentTheme = ''` (empty string)
- System calculates expected values = defaults (no theme deltas)
- Block attributes compared to defaults for customization detection

**When CSS Changes**: All Default-themed blocks automatically reflect changes (on page refresh)

**Customization**: User can customize → attributes diverge from defaults → auto-detected as customized

---

## Theme Operations

### 1. Create Theme (Save as New Theme)

**Input**: Block type, theme name, current block state

**Process**:
1. Take complete snapshot of current attributes (via `getThemeableSnapshot`)
2. Calculate deltas from defaults (via `calculateDeltas`)
3. Validate theme name (alphanumeric + spaces/dashes)
4. Check for duplicates
5. Save deltas to database with timestamps
6. **Switch block to new theme** (clear customizationCache)

**Output**: New theme in `{blockType}_themes`, block uses clean theme

```javascript
const snapshot = getThemeableSnapshot(attributes, excludeList);
const deltas = calculateDeltas(snapshot, allDefaults, excludeList);
await createTheme('accordion', 'Corporate Blue', deltas);

// Block now uses clean theme
setAttributes({
  currentTheme: 'Corporate Blue',
  customizationCache: {}
});
```

### 2. Update Theme

**Input**: Block type, theme name, current block state

**Process**:
1. Take complete snapshot of current attributes
2. Calculate deltas from defaults
3. Replace theme with new deltas
4. Update `modified` timestamp
5. **Clear customizationCache** (block now uses clean updated theme)
6. **Batch Update**: Find ALL clean blocks on current page using this theme
7. Update those clean blocks with new theme values automatically
8. Show notification to user about how many blocks were updated

**Output**: Updated theme, current block uses clean theme, other clean blocks updated

```javascript
const snapshot = getThemeableSnapshot(attributes, excludeList);
const deltas = calculateDeltas(snapshot, allDefaults, excludeList);
await updateTheme('accordion', 'Corporate Blue', deltas);

// Clear cache for current block
setAttributes({ customizationCache: {} });

// Batch update other clean blocks on this page
const updatedCount = batchUpdateCleanBlocks(
  'accordion',
  'Corporate Blue',
  updatedExpectedValues,
  excludeFromCustomizationCheck
);

// Show notification: "Updated theme 'Corporate Blue' and applied changes to 3 block(s) on this page."
showBatchUpdateNotification('update', 'Corporate Blue', updatedCount);
```

### 3. Delete Theme

**Input**: Block type, theme name

**Process**:
1. Validate theme exists
2. Remove from database
3. **Reset current block to defaults**
4. **Batch Reset**: Find ALL blocks on current page using deleted theme (clean or customized)
5. Reset those blocks to defaults and clear their theme
6. Show notification to user about how many blocks were reset

**Output**: Theme removed, all blocks using theme reset to defaults

```javascript
await deleteTheme('accordion', 'Corporate Blue');

// Reset current block
setAttributes({ currentTheme: '', customizationCache: {} });

// Batch reset all other blocks using this theme
const resetCount = batchResetBlocksUsingTheme(
  'accordion',
  'Corporate Blue',
  allDefaults,
  excludeFromCustomizationCheck
);

// Show notification: "Deleted theme 'Corporate Blue' and reset 5 block(s) to defaults."
showBatchUpdateNotification('delete', 'Corporate Blue', resetCount);
```

### 4. Rename Theme

**Input**: Block type, old name, new name

**Process**:
1. Validate both names
2. Check new name not duplicate
3. Update theme name in database
4. Update `currentTheme` in current block

**Output**: Renamed theme, block continues working

```javascript
await renameTheme('accordion', 'Corporate Blue', 'Company Brand');
setAttributes({ currentTheme: 'Company Brand' });
```

### 5. Switch Theme

**Input**: New theme name via dropdown

**Process**:
1. Update `currentTheme` attribute only
2. Block logic handles the rest automatically

**No Reset-and-Apply in ThemeSelector**: The block itself doesn't automatically reset values when theme changes - it just changes the currentTheme attribute. The UI shows values as they are.

**User Can Manually Reset**: User clicks "Reset Modifications" to apply clean theme

```javascript
// Simple theme change in ThemeSelector
setAttributes({ currentTheme: 'Dark Mode' });

// User sees current attributes (may be customized)
// User can click "Reset Modifications" to get clean theme
```

### 6. Reset Customizations

**Input**: User clicks "Reset Modifications" button

**Process**:
1. Calculate expected values (defaults + current theme deltas)
2. Apply expected values to attributes (reset-and-apply pattern)
3. Clear customizationCache

**Output**: Block shows clean theme

```javascript
const expectedValues = theme
  ? applyDeltas(allDefaults, theme.values || {})
  : allDefaults;

const resetAttrs = { ...expectedValues, customizationCache: {} };

// Remove excluded attributes (structural/meta)
excludeFromCustomizationCheck.forEach(key => delete resetAttrs[key]);

setAttributes(resetAttrs);
```

---

## Customization Detection

### Auto-Detection Algorithm

System automatically detects customizations by comparing current attributes to expected values:

```javascript
// Expected values = defaults + current theme deltas
const expectedValues = theme
  ? applyDeltas(allDefaults, theme.values || {})
  : allDefaults;

// Compare each attribute to expected value
const isCustomized = Object.keys(attributes).some(key => {
  if (excludeList.includes(key)) return false;

  const attrValue = attributes[key];
  const expectedValue = expectedValues[key];

  if (attrValue === undefined || attrValue === null) return false;

  // Deep comparison for objects
  if (typeof attrValue === 'object' && attrValue !== null) {
    return JSON.stringify(attrValue) !== JSON.stringify(expectedValue);
  }

  // Simple comparison for primitives
  return attrValue !== expectedValue;
});
```

### Customization Display

**Theme Dropdown**: Shows "(customized)" suffix when block has customizations

```
Theme Selector:
- Default (customized)  ← if Default has customizations
- Dark Mode             ← clean theme
- Dark Mode (customized) ← theme with customizations
- Light Mode
```

---

## Database Schema

### Theme Object Structure

```php
array(
  'name' => 'Dark Mode',
  'values' => array(
    'titleColor' => '#ffffff',           // Only deltas stored
    'titleBackgroundColor' => '#2c2c2c'  // Not ALL attributes
  ),
  'created' => '2025-01-15 10:30:00',
  'modified' => '2025-01-15 10:30:00'
)
```

### wp_options Table

```
option_name: accordion_themes
option_value: {serialized PHP array of all themes}
autoload: no
```

---

## Theme Validation

### Name Validation

**Rules**:
- Alphanumeric characters
- Spaces, hyphens, underscores allowed
- No special characters (@, #, $, %, etc.)
- Max length: 50 characters
- Not empty

**Regex**: `/^[a-zA-Z0-9\s\-_]+$/`

### Values Validation

**Rules**:
- Must be valid object (deltas)
- Correct data types (string, number, object)
- Color values: hex, rgb, rgba, named
- Numeric values: valid numbers

---

## Event Isolation

**Critical Rule**: Theme operations for one block type DO NOT affect other block types

**Example**:
```javascript
// Create accordion theme
await createTheme('accordion', 'Test', deltas);

// Tabs themes unchanged
const tabsThemes = getThemes('tabs');
// 'Test' does NOT appear in tabsThemes
```

**Implementation**: Separate Redux store keys + separate database options

---

## Batch Update System

### Overview

When themes are updated or deleted, the system automatically propagates changes to all related blocks on the current page. This ensures consistency and reduces manual work for users.

**Key Features**:
- Automatic detection of blocks using the same theme
- Distinguishes between "clean" and "customized" blocks
- Only affects blocks on the current page being edited
- Transparent user notifications
- Integrated into `useThemeManager` hook

### Clean vs Customized Blocks

The batch update system uses the `customizations` attribute as the clean detector:

**Clean Block**: `customizations: {}` (empty object)
- Has no user modifications beyond what the theme provides
- Automatically receives theme updates

**Customized Block**: `customizations: { titleColor: "#ff0000", ... }` (contains values)
- Has user modifications that differ from the theme
- Does NOT automatically receive theme updates (preserves user intent)
- Exception: On theme deletion, ALL blocks are reset (clean or customized)

### Theme Update Flow

When a user updates a theme:

```
1. User edits block with "Corporate Blue" theme
2. User clicks "Update Theme"
3. Theme saved to database with new values
4. Current block reset to clean theme
5. System searches page for other blocks:
   - Finds Block A: using "Corporate Blue", customizations: {} → UPDATE
   - Finds Block B: using "Corporate Blue", customizations: {titleColor: "#red"} → SKIP
   - Finds Block C: using "Dark Mode", customizations: {} → SKIP
6. Block A updated with new theme values
7. User sees: "Updated theme 'Corporate Blue' and applied changes to 1 block(s) on this page."
```

**Implementation**:

```javascript
// In useThemeManager's handleUpdateTheme
const updatedCount = batchUpdateCleanBlocks(
  blockType,                    // 'accordion', 'tabs', or 'toc'
  attributes.currentTheme,       // 'Corporate Blue'
  updatedExpectedValues,         // Complete values (defaults + deltas)
  excludeFromCustomizationCheck  // Keys to exclude (IDs, meta, etc.)
);

if (updatedCount > 0) {
  showBatchUpdateNotification('update', attributes.currentTheme, updatedCount);
}
```

### Theme Delete Flow

When a user deletes a theme:

```
1. User clicks "Delete Theme" on "Corporate Blue"
2. Theme removed from database
3. Current block reset to defaults (currentTheme = '')
4. System searches page for other blocks:
   - Finds Block A: using "Corporate Blue", customizations: {} → RESET
   - Finds Block B: using "Corporate Blue", customizations: {titleColor: "#red"} → RESET
   - Finds Block C: using "Dark Mode", customizations: {} → SKIP
5. Blocks A and B reset to defaults
6. User sees: "Deleted theme 'Corporate Blue' and reset 2 block(s) to defaults."
```

**Important**: Theme deletion resets ALL blocks using that theme, regardless of customizations. This prevents blocks from being in an invalid state with a non-existent theme.

**Implementation**:

```javascript
// In useThemeManager's handleDeleteTheme
const resetCount = batchResetBlocksUsingTheme(
  blockType,                    // 'accordion', 'tabs', or 'toc'
  themeToDelete,                // 'Corporate Blue'
  allDefaults,                  // Default values
  excludeFromCustomizationCheck // Keys to exclude (IDs, meta, etc.)
);

if (resetCount > 0) {
  showBatchUpdateNotification('delete', themeToDelete, resetCount);
}
```

### Block Discovery Algorithm

The system recursively searches the current page's block tree:

```javascript
// Simplified algorithm
function findBlocksUsingTheme(blockType, themeName, cleanOnly = false) {
  const blocks = select('core/block-editor').getBlocks(); // All blocks on page

  return findBlocks(blocks, blockType, (block) => {
    const attrs = block.attributes || {};

    // Must be using this theme
    if (attrs.currentTheme !== themeName) {
      return false;
    }

    // If cleanOnly, check customizations attribute
    if (cleanOnly) {
      const customizations = attrs.customizations || {};
      const isClean = Object.keys(customizations).length === 0;
      return isClean;
    }

    return true;
  });
}
```

**Search Behavior**:
- Searches all blocks including nested inner blocks
- Only finds blocks of the same type (accordion/tabs/toc are separate)
- Uses block `clientId` for updates
- Returns array of `{ clientId, attributes }` objects

### Batch Update Details

**batchUpdateCleanBlocks**:

```javascript
function batchUpdateCleanBlocks(blockType, themeName, newThemeValues, excludeKeys) {
  // 1. Find clean blocks using this theme
  const blocksToUpdate = findBlocksUsingTheme(blockType, themeName, true);

  // 2. Update each block
  blocksToUpdate.forEach(({ clientId, attributes }) => {
    const updateAttrs = {};

    // Apply new theme values
    Object.keys(newThemeValues).forEach((key) => {
      if (!excludeKeys.includes(key) && attributes[key] !== newThemeValues[key]) {
        updateAttrs[key] = newThemeValues[key];
      }
    });

    // Ensure customizations stays empty
    updateAttrs.customizations = {};

    // Update via WordPress block editor
    dispatch('core/block-editor').updateBlockAttributes(clientId, updateAttrs);
  });

  return blocksToUpdate.length;
}
```

**Key Points**:
- Only updates attributes that actually changed (performance)
- Preserves excluded keys (IDs, structural attributes)
- Ensures `customizations` remains empty (maintains clean state)
- Uses `dispatch('core/block-editor').updateBlockAttributes()` for updates

### Batch Reset Details

**batchResetBlocksUsingTheme**:

```javascript
function batchResetBlocksUsingTheme(blockType, themeName, defaults, excludeKeys) {
  // 1. Find ALL blocks using this theme (clean or customized)
  const blocksToReset = findBlocksUsingTheme(blockType, themeName, false);

  // 2. Reset each block
  blocksToReset.forEach(({ clientId }) => {
    const resetAttrs = { ...defaults };

    // Remove excluded keys (except currentTheme and customizations)
    excludeKeys.forEach((key) => {
      if (key !== 'currentTheme' && key !== 'customizations') {
        delete resetAttrs[key];
      }
    });

    // Reset to Default theme
    resetAttrs.currentTheme = '';
    resetAttrs.customizations = {};

    dispatch('core/block-editor').updateBlockAttributes(clientId, resetAttrs);
  });

  return blocksToReset.length;
}
```

**Key Points**:
- Finds ALL blocks (not just clean ones)
- Resets to complete defaults
- Clears theme (`currentTheme = ''`)
- Clears customizations (`customizations = {}`)

### User Notifications

Users receive transparent feedback about batch operations:

```javascript
function showBatchUpdateNotification(operation, themeName, count) {
  if (count === 0) return;

  let message;
  if (operation === 'update') {
    message = `Updated theme "${themeName}" and applied changes to ${count} block(s) on this page.`;
  } else if (operation === 'delete') {
    message = `Deleted theme "${themeName}" and reset ${count} block(s) to defaults.`;
  }

  dispatch('core/notices').createSuccessNotice(message, {
    type: 'snackbar',
    isDismissible: true,
  });
}
```

**Notification Examples**:
- "Updated theme 'Dark Mode' and applied changes to 3 block(s) on this page."
- "Deleted theme 'Corporate Blue' and reset 5 block(s) to defaults."

### Scope and Limitations

**What IS Affected**:
- Only blocks on the current page being edited
- Only blocks of the same type (accordion themes don't affect tabs)
- All blocks found in the page's block tree (including nested blocks)

**What is NOT Affected**:
- Blocks on other pages/posts
- Blocks in other browser tabs
- Saved/published content (until page is saved)
- Blocks of different types

**WordPress Standard Behavior**:
- Changes are in-memory until user saves the post
- WordPress autosave will persist changes
- User can undo/redo batch updates like any block change
- Closing without saving loses all changes

### Performance Considerations

**Efficiency**:
- Block search is recursive but fast (typical page has <100 blocks)
- Only updates attributes that actually changed
- Uses WordPress's optimized `updateBlockAttributes()`
- No database operations during batch update (only in-memory)

**Timing**:
- Batch update happens immediately after theme update/delete
- Updates appear instantly in the editor
- No noticeable performance impact for typical pages

### Implementation Files

**Batch Update Utilities**:
- `shared/src/utils/batch-block-updater.js` - Core batch update logic

**Hook Integration**:
- `shared/src/hooks/useThemeManager.js` - Integrates batch updates into theme operations

**Functions**:
- `findBlocksUsingTheme()` - Find blocks by theme and clean state
- `batchUpdateCleanBlocks()` - Update clean blocks with new theme values
- `batchResetBlocksUsingTheme()` - Reset blocks using deleted theme
- `showBatchUpdateNotification()` - Show user feedback

---

## Performance Considerations

### Caching

**JavaScript**: Themes loaded once on editor mount, cached in Redux store

**customizationCache**: Auto-updates on every attribute change (complete snapshot for safety)

### Optimization

**Theme Switch**: Instant (just updates currentTheme attribute)

**Theme Create/Update**: <500ms target (includes delta calculation + database write)

**Delta Calculation**: <5ms (lightweight comparison operation)

---

**Document Version**: 2.1 (Batch Update System)
**Last Updated**: 2025-12-14
**Part of**: WordPress Gutenberg Blocks Documentation Suite
