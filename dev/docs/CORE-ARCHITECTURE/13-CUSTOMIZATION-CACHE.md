# Customization System

**Understanding customizations vs customizationCache**

---

## Two Separate Attributes

The system uses TWO different attributes for customization tracking:

### 1. `customizations` - Active Customization Tracker

**Purpose**: Tracks which attributes currently differ from expected theme values

**Data**: Only attributes that differ from expected (deltas from theme)

**Usage**:
- **Clean Detection**: Empty object (`{}`) = clean block
- **Batch Updates**: Determines which blocks get auto-updated
- **Frontend Rendering**: Generates element-inline CSS variables for customized values (Tier 3)
- **Always Auto-Updates**: Recalculates on every attribute change

**Example**:
```javascript
// Clean block
customizations: {}

// Customized block
customizations: {
  titleColor: "#ff0000",    // Different from theme
  titleFontSize: 20         // Different from theme
}
```

### 2. `customizationCache` - Session Snapshot (Deprecated/Legacy)

**Purpose**: Complete snapshot for safety and restoration (from previous architecture)

**Data**: Complete snapshot of all themeable attributes

**Current Status**: Legacy attribute, maintained for backward compatibility

**Note**: In the simplified architecture, `customizations` (deltas) is the primary mechanism. The cache was more important in the old architecture but is less critical now.

---

## Design Rationale

### Why Two Attributes?

**Historical Context**:
- Original architecture used `customizationCache` for complete snapshots
- Simplified architecture introduced `customizations` for delta tracking
- Both maintained during transition for safety and compatibility

**Current Best Practice**: Use `customizations` for all customization detection and batch update logic

### customizations: Delta-Based Tracking

**Decision**: Store only differences from expected theme values

**Why**:
- **Efficient**: Only stores what's different (~500 bytes vs ~2KB)
- **Clear Intent**: Shows exactly what user customized
- **Batch Updates**: Easy to detect clean blocks (`customizations === {}`)
- **Frontend CSS**: Only generates CSS for customized attributes

**Auto-Update Behavior**:

```javascript
// In useThemeManager
useEffect(() => {
  const newCustomizations = {};

  Object.keys(attributes).forEach((key) => {
    if (excludeFromCustomizationCheck.includes(key)) return;

    const attrValue = attributes[key];
    const expectedValue = expectedValues[key];

    // Only store if different
    if (attrValue !== expectedValue && attrValue !== undefined) {
      newCustomizations[key] = attrValue;
    }
  });

  setAttributes({ customizations: newCustomizations });
}, [attributes, expectedValues]);
```

### customizationCache: Complete Snapshots (Legacy)

**Decision**: customizationCache stores a **complete snapshot** of all themeable attributes

**Why** (Historical):
- **No data loss**: Every attribute value is preserved
- **Safety**: Even though themes use deltas, cache keeps everything
- **Restoration**: Can restore full state if needed
- **Simplicity**: One object with all values, no complex merging

**Trade-off**: Larger attribute object in post content (~2-3KB), but negligible and provides safety

**Current Usage**: Minimal - primarily for backward compatibility

---

## Purpose

### customizations (Active)

The `customizations` attribute serves these purposes:

1. **Clean Detection**: Empty object = block uses clean theme
2. **Batch Updates**: System checks this to determine auto-update eligibility
3. **Frontend CSS**: Generates element-inline CSS variables for customized attributes only
4. **Customization Display**: Shows "(customized)" suffix in theme dropdown

### customizationCache (Legacy)

The `customizationCache` attribute was designed for:

1. **Safety**: Keeps complete snapshot of all values (no data loss)
2. **Future restoration**: Can be used for undo/redo or theme switching features

**Note**: With the simplified architecture, most functionality moved to `customizations`

---

## Critical: Save Behavior

### While Editing (Not Saved)

**Status**: customizationCache exists in memory as a block attribute

**Data**: Complete snapshot auto-updates with every change

**Persistence**: Only in browser memory (WordPress hasn't saved yet)

**If user closes window**: Data is LOST (standard WordPress behavior - changes not saved)

### After Saving Post

**Status**: customizationCache is serialized to post_content in database

**Data**: Saved as part of block attributes (element-inline customization)

**Persistence**: Permanent (saved in WordPress database)

**On reload**: customizationCache is restored from database with all other attributes

### Key Points

```
Before Save:
- customizationCache in memory only
- Auto-updating with every change
- Close window → data lost

After Save:
- customizationCache in database (post_content)
- Part of saved block attributes
- Reload page → data restored
```

**This is standard WordPress block behavior**: All block attributes (including customizationCache) follow WordPress save lifecycle.

---

## Data Storage Locations

Understanding where data is stored is critical:

### 1. Themes (Permanent, Reusable)

**Location**: WordPress database `wp_options` table
- Key: `accordion_themes`, `tabs_themes`, `toc_themes`
- Contains: Theme deltas (differences from defaults)
- Lifespan: Permanent until deleted
- Shared: All blocks can use the same theme

```php
// wp_options
option_name: "accordion_themes"
option_value: {
  "Dark Mode": {
    name: "Dark Mode",
    values: { titleColor: "#fff", titleBackgroundColor: "#2c2c2c" },
    created: "2025-01-15 10:30:00"
  }
}
```

### 2. Block Attributes (Per-Block, Saved with Post)

**Location**: WordPress database `wp_posts` table (post_content field)
- Contains: All block attributes including customizationCache
- Lifespan: Saved when user saves post, lost if user closes without saving
- Per-block: Each block instance has its own values

```html
<!-- wp:custom/accordion {"currentTheme":"Dark Mode","customizationCache":{"titleColor":"#ff0000","titleFontSize":18,...}} -->
```

### 3. In-Memory During Editing

**Location**: Browser JavaScript memory
- Contains: Current working state of block
- Lifespan: Only while editing, before save
- Volatile: Lost on page reload or close without save

---

## Implementation

### Data Structure

```javascript
attributes.customizationCache = {
  titleColor: "#ff0000",
  titleFontSize: 18,
  titleBackgroundColor: "#2c2c2c",
  contentBackgroundColor: "#ffffff",
  borderWidth: 2,
  showIcon: true,
  // ... ALL themeable attributes with current values
}
```

**Complete snapshot** - includes ALL themeable attributes, even if they match defaults.

### Auto-Update Pattern

All blocks (accordion, tabs, toc) use the same pattern:

```javascript
// Auto-update customizationCache with complete snapshot on every change
useEffect(() => {
  const snapshot = getThemeableSnapshot(attributes, excludeFromCustomizationCheck);
  const currentCache = attributes.customizationCache || {};

  // Only update if snapshot changed (avoid infinite loops)
  if (JSON.stringify(snapshot) !== JSON.stringify(currentCache)) {
    setAttributes({ customizationCache: snapshot });
  }
}, [attributes, excludeFromCustomizationCheck, setAttributes]);
```

**Triggers**: Runs whenever `attributes` changes

**Performance**: JSON.stringify comparison is fast (~1ms) and prevents unnecessary updates

### What Gets Cached

**Included**: All themeable attributes (colors, typography, spacing, borders, icons, etc.)

**Excluded**: Structural and meta attributes:
- `uniqueId`, `blockId`, `accordionId`, `tocId`
- `currentTheme`
- `customizations` (old architecture - no longer used)
- `customizationCache` (itself)
- `applyCustomizations` (old architecture - no longer used)
- Structural: `title`, `content`, `showTitle`, `titleText`
- Behavioral: `initiallyOpen`, `headingLevel`, `useHeadingStyles`
- TOC-specific: `filterMode`, `includeLevels`, `excludeLevels`, etc.

**Utility Function**: `getThemeableSnapshot(attributes, excludeList)`

```javascript
export function getThemeableSnapshot(attributes, exclude = []) {
  const snapshot = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (!exclude.includes(key) && value !== undefined) {
      snapshot[key] = value;
    }
  }

  return snapshot;
}
```

---

## Usage Scenarios

### Scenario 1: Regular Editing (Not Saved)

```
1. User edits title color → setAttributes({ titleColor: "#ff0000" })
2. useEffect triggers → calculates new snapshot
3. customizationCache auto-updates with complete values
4. All attribute values preserved IN MEMORY
5. User closes browser → customizationCache LOST (WordPress didn't save)
```

### Scenario 1b: Regular Editing (Saved)

```
1. User edits title color → setAttributes({ titleColor: "#ff0000" })
2. useEffect triggers → calculates new snapshot
3. customizationCache auto-updates with complete values
4. User clicks "Save" or "Publish"
5. WordPress saves post_content with all block attributes
6. customizationCache persists in database as element-inline customization
7. User reloads page → customizationCache restored from database
```

### Scenario 2: Saving as New Theme

```
1. User clicks "Save as New Theme"
2. Calculate deltas from customizationCache:
   const deltas = calculateDeltas(customizationCache, defaults)
3. Save deltas to theme (stored in wp_options database)
4. Clear cache: setAttributes({ customizationCache: {} })
5. Block now uses clean theme (no customizations)
6. customizationCache is now empty object {}
7. When user saves post:
   - Block attributes saved with currentTheme = "New Theme"
   - customizationCache = {} (empty, since using clean theme)
   - No element-inline customizations (all values come from theme)
```

**Important**: After "Save as New Theme", the customizations are now PART OF THE THEME (in wp_options), not part of the block. The block just has `currentTheme` pointing to the new theme.

### Scenario 3: Updating Theme

```
1. User clicks "Update Theme"
2. Use customizationCache to calculate new deltas
3. Update theme with new deltas
4. Clear cache: setAttributes({ customizationCache: {} })
5. Block reflects updated theme
```

### Scenario 4: Reset Customizations

```
1. User clicks "Reset Modifications"
2. Calculate expected values (defaults + theme deltas)
3. Apply expected values to attributes
4. Clear cache: setAttributes({ customizationCache: {} })
5. Block shows clean theme
```

---

## Comparison with Old Architecture

### Old (React State + Attributes Hybrid)

```javascript
// Session storage (React state) - lost on refresh
const [sessionCustomizations, setSessionCustomizations] = useState({
  "Dark Mode": { titleColor: "#ff0000" },
  "Light Mode": { titleBackgroundColor: "#yellow" }
});

// Persistent storage (block attributes)
attributes.customizations = { titleColor: "#ff0000" };

// Multiple custom theme variants in dropdown
- "Dark Mode (Custom)"
- "Light Mode (Custom)"

// Manual management of what persists
```

### New (Auto-Updating Cache)

```javascript
// Single source: block attributes
attributes.customizationCache = {
  titleColor: "#ff0000",
  titleFontSize: 18,
  // ... complete snapshot
};

// Auto-updates on every change
useEffect(() => {
  const snapshot = getThemeableSnapshot(attributes, excludeList);
  setAttributes({ customizationCache: snapshot });
}, [attributes]);

// Simple "(customized)" suffix
- "Dark Mode (customized)"

// Automatic, no manual tracking
```

---

## When Cache is Cleared

The customizationCache is cleared in these situations:

### 1. Save as New Theme

```javascript
await createTheme('accordion', themeName, deltas);
setAttributes({
  currentTheme: themeName,
  customizationCache: {}  // Cleared - block now uses clean theme
});
```

### 2. Update Theme

```javascript
await updateTheme('accordion', currentTheme, deltas);
setAttributes({
  customizationCache: {}  // Cleared - theme updated
});
```

### 3. Reset Customizations

```javascript
setAttributes({
  ...expectedValues,
  customizationCache: {}  // Cleared - returning to clean theme
});
```

**Why clear?**: After these operations, the block is in a "clean" state (matches theme exactly), so no cache is needed.

---

## When Cache is NOT Cleared

### Theme Switching

When user changes theme via dropdown:

```javascript
// ThemeSelector simply updates currentTheme
setAttributes({ currentTheme: 'New Theme' });

// customizationCache is NOT cleared
// It continues to auto-update with current attributes
```

**Result**: Block keeps its current values. customizationCache continues tracking changes. User can manually reset if desired.

---

## Role in Batch Update System

### Clean Block Detection

The batch update system uses `customizations` (NOT `customizationCache`) to determine if a block is "clean":

```javascript
// In batch-block-updater.js
function findBlocksUsingTheme(blockType, themeName, cleanOnly = false) {
  return findBlocks(blocks, blockType, (block) => {
    const attrs = block.attributes || {};

    // Must be using this theme
    if (attrs.currentTheme !== themeName) {
      return false;
    }

    // Check if clean using customizations attribute
    if (cleanOnly) {
      const customizations = attrs.customizations || {};
      const isClean = Object.keys(customizations).length === 0;
      return isClean;
    }

    return true;
  });
}
```

**Why `customizations` and not `customizationCache`?**

The `customizations` attribute contains only deltas (differences), making it perfect for clean detection:
- `customizations: {}` = No differences = Clean block
- `customizations: { ... }` = Has differences = Customized block

The `customizationCache` contains complete snapshots, which doesn't help determine if something is customized.

### Batch Update Behavior

**Theme Update (Clean Blocks Only)**:

```javascript
// Find clean blocks using this theme
const blocksToUpdate = findBlocksUsingTheme(blockType, themeName, true);

// Update each clean block
blocksToUpdate.forEach(({ clientId }) => {
  const updateAttrs = { ...newThemeValues };
  updateAttrs.customizations = {}; // Ensure it stays clean

  dispatch('core/block-editor').updateBlockAttributes(clientId, updateAttrs);
});
```

**Result**: Only blocks with `customizations: {}` get updated. Customized blocks are preserved.

**Theme Delete (All Blocks)**:

```javascript
// Find ALL blocks using this theme (clean or customized)
const blocksToReset = findBlocksUsingTheme(blockType, themeName, false);

// Reset each block
blocksToReset.forEach(({ clientId }) => {
  const resetAttrs = { ...defaults };
  resetAttrs.currentTheme = '';
  resetAttrs.customizations = {};

  dispatch('core/block-editor').updateBlockAttributes(clientId, resetAttrs);
});
```

**Result**: ALL blocks get reset, regardless of `customizations` state (prevents invalid theme references).

### Why This Matters

The distinction between `customizations` and `customizationCache` is critical for batch updates:

1. **Efficiency**: Checking `Object.keys(customizations).length === 0` is fast and accurate
2. **User Intent**: Preserves customized blocks during theme updates
3. **Clean State**: Ensures updated blocks maintain `customizations: {}`
4. **Transparency**: Users see which blocks will be affected based on customization state

**Example Scenario**:

```
Page has 5 accordion blocks using "Dark Mode" theme:
- Block A: customizations: {} → Will be updated
- Block B: customizations: { titleColor: "#red" } → Will NOT be updated
- Block C: customizations: {} → Will be updated
- Block D: customizations: { titleFontSize: 20 } → Will NOT be updated
- Block E: customizations: {} → Will be updated

User updates "Dark Mode" theme → Blocks A, C, E updated automatically
User sees: "Updated theme 'Dark Mode' and applied changes to 3 block(s) on this page."
```

---

## Performance Considerations

### JSON.stringify Comparison

```javascript
if (JSON.stringify(snapshot) !== JSON.stringify(currentCache)) {
  setAttributes({ customizationCache: snapshot });
}
```

**Why**: Prevents infinite useEffect loops

**Performance**: ~1ms for typical block (~40 attributes)

**Optimization**: Could use deep equality check, but JSON.stringify is simpler and fast enough

### Storage Size

**Typical size**: ~2-3KB in post content

**Impact**: Negligible - WordPress posts are typically 10-100KB

**Benefit**: Complete safety and data preservation worth the small size

---

## Implementation Files

### Utility Function

**shared/src/utils/delta-calculator.js**:

```javascript
export function getThemeableSnapshot(attributes, exclude = []) {
  const snapshot = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (!exclude.includes(key) && value !== undefined) {
      snapshot[key] = value;
    }
  }

  return snapshot;
}
```

### Block Implementation

**blocks/accordion/src/edit.js** (same pattern in tabs and toc):

```javascript
// Attributes to exclude from cache
const excludeFromCustomizationCheck = [
  'accordionId',
  'uniqueId',
  'currentTheme',
  'customizations',
  'customizationCache',
  'applyCustomizations',
  'title',
  'content',
  'initiallyOpen',
  'headingLevel',
  'useHeadingStyles',
];

// Auto-update customizationCache
useEffect(() => {
  const snapshot = getThemeableSnapshot(attributes, excludeFromCustomizationCheck);
  const currentCache = attributes.customizationCache || {};

  if (JSON.stringify(snapshot) !== JSON.stringify(currentCache)) {
    setAttributes({ customizationCache: snapshot });
  }
}, [attributes, excludeFromCustomizationCheck, setAttributes]);
```

---

## Testing

### Test: Auto-Update

```javascript
// Initial state
attributes = { titleColor: "#333" }
customizationCache = {}

// User changes color
setAttributes({ titleColor: "#ff0000" })

// useEffect triggers → cache updates
customizationCache = { titleColor: "#ff0000", /* ...other attrs */ }
```

### Test: Complete Snapshot

```javascript
// After multiple edits
attributes = {
  titleColor: "#ff0000",
  titleFontSize: 20,
  borderWidth: 3
}

// Cache should have ALL themeable values
customizationCache = {
  titleColor: "#ff0000",
  titleFontSize: 20,
  titleBackgroundColor: "#f5f5f5",  // Even if not changed
  borderWidth: 3,
  // ... all other themeable attributes
}
```

### Test: Excluded Attributes

```javascript
attributes = {
  accordionId: "acc-1234",
  currentTheme: "Dark Mode",
  titleColor: "#ff0000"
}

// Cache should NOT include excluded attrs
customizationCache = {
  titleColor: "#ff0000",
  titleFontSize: 16,
  // ... other themeable attrs
  // NO accordionId, currentTheme, etc.
}
```

### Test: Cache Cleared on Save

```javascript
// Before save
customizationCache = { titleColor: "#ff0000", ... }

// Save as new theme
await createTheme('accordion', 'New Theme', deltas);
setAttributes({ currentTheme: 'New Theme', customizationCache: {} });

// After save
customizationCache = {}  // Empty
```

---

## Benefits

### Data Safety

- **No loss**: Complete snapshot ensures no attribute values are lost
- **Recovery**: Can recover state if needed
- **Debugging**: Easy to see what values block has

### Simplicity

- **Automatic**: No manual tracking
- **Consistent**: Same pattern across all blocks
- **Reliable**: Works with WordPress autosave/revisions

### Future Features

- **Undo/Redo**: Could implement undo using cache history
- **Theme Comparison**: Could show diff between current and theme
- **Export/Import**: Could export blocks with full state

---

## Summary

### Key Points

1. **Complete snapshot** of all themeable attributes
2. **Auto-updates** via useEffect on every change
3. **Stored in attributes** (persists with post content)
4. **Cleared** after save/update/reset operations
5. **NOT cleared** on theme switching
6. **Provides safety** - no data loss

### The Pattern

```javascript
// 1. Define exclusions
const exclude = ['id', 'currentTheme', 'cache', 'meta', ...]

// 2. Auto-update in useEffect
useEffect(() => {
  const snapshot = getThemeableSnapshot(attributes, exclude);
  if (JSON.stringify(snapshot) !== JSON.stringify(cache)) {
    setAttributes({ customizationCache: snapshot });
  }
}, [attributes]);

// 3. Use for theme operations
const deltas = calculateDeltas(customizationCache, defaults);
await createTheme('type', 'name', deltas);

// 4. Clear after clean operations
setAttributes({ customizationCache: {} });
```

---

**Document Version**: 2.1 (Batch Update System & Customizations vs Cache)
**Last Updated**: 2025-12-14
**Part of**: WordPress Gutenberg Blocks Documentation Suite
