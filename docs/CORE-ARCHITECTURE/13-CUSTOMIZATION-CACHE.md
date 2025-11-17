# Customization Cache System

**Auto-updating complete snapshot for safety and restoration**

---

## Design Rationale

### Why Complete Snapshots (Not Partial)?

**Decision**: customizationCache stores a **complete snapshot** of all themeable attributes

**Why**:
- **No data loss**: Every attribute value is preserved
- **Safety**: Even though themes use deltas, cache keeps everything
- **Restoration**: Can restore full state if needed
- **Simplicity**: One object with all values, no complex merging

**Trade-off**: Larger attribute object in post content (~2-3KB), but negligible and provides safety

### Why Auto-Update (Not Manual)?

**Decision**: customizationCache auto-updates via useEffect on every attribute change

**Why**:
- **Always current**: No risk of stale cache
- **No manual calls**: Developers don't need to remember to update
- **Consistent**: Every block uses same auto-update pattern
- **Reliable**: Works even if component re-renders

**Alternative Rejected**: Manual updates in every onChange handler - error-prone, inconsistent

### Why Store in Block Attributes (Not Session Storage)?

**Decision**: customizationCache is a block attribute (saved in post content)

**Why**:
- **Persists**: Survives page refreshes
- **Autosave**: WordPress autosave includes it
- **Revisions**: Included in post revisions
- **No backend needed**: Uses standard WordPress mechanisms
- **Block-local**: Each block has its own cache

**Alternative Rejected**: localStorage/sessionStorage - doesn't survive page refresh, not block-specific

---

## Purpose

The customizationCache serves two main purposes:

1. **Safety**: Keeps complete snapshot of all values (no data loss)
2. **Future restoration**: Can be used for undo/redo or theme switching features

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

### Scenario 1: Regular Editing

```
1. User edits title color → setAttributes({ titleColor: "#ff0000" })
2. useEffect triggers → calculates new snapshot
3. customizationCache auto-updates with complete values
4. All attribute values are preserved
```

### Scenario 2: Saving as New Theme

```
1. User clicks "Save as New Theme"
2. Calculate deltas from customizationCache:
   const deltas = calculateDeltas(customizationCache, defaults)
3. Save deltas to theme
4. Clear cache: setAttributes({ customizationCache: {} })
5. Block now uses clean theme
```

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

**Document Version**: 2.0 (Simplified Architecture)
**Last Updated**: 2025-11-17
**Part of**: WordPress Gutenberg Blocks Documentation Suite
