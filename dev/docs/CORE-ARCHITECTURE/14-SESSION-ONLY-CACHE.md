# Session-Only Cache System

**Complete specification for session-only customization storage and dual theme variants**

---

## Critical Design Decision

**Session cache is React state (NOT a block attribute)**

This is the fundamental architectural decision that defines the entire system:

```javascript
// ✅ CORRECT - React state (session-only, not saved)
const [sessionCache, setSessionCache] = useState({});

// ❌ WRONG - Block attribute (would be saved to database)
attributes.customizationCache = {};
```

**Why this matters:**
- React state is lost on page reload → customizations only exist during editing session
- Block attributes are saved to database → would persist customizations permanently
- User gets clean separation: temporary customizations vs saved themes

**Per-Block-Instance Isolation:**

Each block instance has its own independent session cache:

```javascript
// Block 1 (Accordion #1)
const [sessionCache, setSessionCache] = useState({
  "": { titleColor: "#ff0000" }  // Block 1's Default customization
});

// Block 2 (Accordion #2) - COMPLETELY INDEPENDENT
const [sessionCache, setSessionCache] = useState({
  "": { titleColor: "#0000ff" }  // Block 2's Default customization
});
```

**Critical:**
- React `useState` is per-component-instance
- Block 1's session cache is isolated from Block 2's session cache
- Each accordion, tab, or TOC block on the page has its own cache
- No shared state between blocks (even blocks of the same type)

**Example:**
```
Post with 2 Accordion blocks:

Accordion Block 1:
  - User customizes Default: titleColor = red
  - Session cache: { "": { titleColor: "#ff0000", ... } }

Accordion Block 2:
  - User customizes Default: titleColor = blue
  - Session cache: { "": { titleColor: "#0000ff", ... } }

Both can have "Default (customized)" but with different values!
```

---

## Purpose and User Experience

### The Problem Being Solved

Users need to:
1. **Customize freely** without committing to saving
2. **Switch between themes** without losing their customizations
3. **Try different looks** and easily revert
4. **Save when ready** by creating/updating a theme

### The Solution

**Session-only cache** that:
- Stores customizations PER THEME during editing session
- Survives theme switching (user can freely move between themes)
- Lost when post is saved (only current theme values persist)
- Lost on page reload (session ends)

### User Experience Flow

```
User customizes Default theme → titleColor: red
  ↓
Session cache: { "": { titleColor: "#ff0000", ... } }
  ↓
User switches to "Dark Mode"
  ↓
Block shows Dark Mode (customizations for Default preserved in cache)
  ↓
User switches back to Default
  ↓
Block shows Default WITH red title (restored from cache)
  ↓
Dropdown shows: "Default (customized)"
  ↓
User can:
  - Save as new theme → customizations become permanent theme
  - Update Default theme → customizations become part of theme
  - Reset → discard customizations, use clean Default
  - Save post → only current values saved, cache discarded
  - Close browser → cache lost, customizations gone
```

---

## Data Structure

### Session Cache Format

```javascript
// Session cache is an object with theme names as keys
sessionCache = {
  "": {                           // Empty string = Default theme
    titleColor: "#ff0000",
    titleFontSize: 18,
    titleBackgroundColor: "#f5f5f5",
    // ... ALL themeable attributes (complete snapshot)
  },
  "Dark Mode": {                  // Saved theme with customizations
    titleColor: "#00ff00",
    titleFontSize: 20,
    titleBackgroundColor: "#2c2c2c",
    // ... ALL themeable attributes (complete snapshot)
  },
  "Light Mode": {                 // Another saved theme
    titleColor: "#0000ff",
    // ... ALL themeable attributes
  }
}
```

**Key Points:**
- **Complete snapshots** (not deltas) for safety and restoration
- **Theme name as key** (empty string for Default)
- **Only themeable attributes** (excludes structural/meta)
- **Exists ONLY during editing session** (React useState)

---

## Lifecycle and Persistence

### During Editing Session

```
User opens editor
  ↓
sessionCache = {} (empty)
  ↓
User makes changes
  ↓
sessionCache auto-updates with snapshot for current theme
  ↓
User switches themes
  ↓
sessionCache preserves all theme customizations
  ↓
User can switch back and forth freely
  ↓
sessionCache keeps growing (one entry per customized theme)
```

### On Post Save

```
User clicks "Save" or "Publish"
  ↓
WordPress saves block attributes to database
  ↓
Current attribute values saved (titleColor: "#ff0000", etc.)
  ↓
currentTheme saved ("Dark Mode")
  ↓
sessionCache NOT saved (it's React state, not an attribute)
  ↓
Other theme customizations in sessionCache LOST
  ↓
Only current theme values persist in database
```

### On Page Reload

```
User reloads page
  ↓
Block loads from database with saved attributes
  ↓
sessionCache = {} (reset to empty, React state lost)
  ↓
Block shows last saved state
  ↓
All session customizations gone
```

### On Browser Close (Without Save)

```
User closes browser without saving
  ↓
sessionCache lost (React state)
  ↓
All customizations lost
  ↓
Standard WordPress behavior (no save = no persist)
```

---

## Dual Dropdown Variants

### The Feature

Theme dropdown shows **BOTH** clean and customized variants:

```
┌─ Theme Selector ─────────────┐
│ Select Theme:                 │
│ ┌───────────────────────────┐ │
│ │ Default                   │ │  ← Clean theme (no customizations)
│ │ Default (customized)      │ │  ← Has customizations in session cache
│ │ Dark Mode                 │ │  ← Clean saved theme
│ │ Dark Mode (customized)    │ │  ← Saved theme with customizations
│ │ Light Mode                │ │  ← Clean saved theme
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

### How It Works

**Dynamic Option Generation:**

```javascript
// Check session cache to determine if customized variant exists
const themeOptions = [];

// Add Default
themeOptions.push({ label: 'Default', value: '' });

// If Default has customizations, add customized variant
if (sessionCache['']) {
  themeOptions.push({
    label: 'Default (customized)',
    value: '::customized'  // Special marker
  });
}

// Add saved themes
Object.keys(themes).forEach(name => {
  themeOptions.push({ label: name, value: name });

  // If theme has customizations, add customized variant
  if (sessionCache[name]) {
    themeOptions.push({
      label: `${name} (customized)`,
      value: `${name}::customized`
    });
  }
});
```

### User Interaction

**Selecting Clean Variant:**
```
User selects "Dark Mode"
  ↓
Block resets to clean Dark Mode (defaults + theme deltas)
  ↓
Discards any previous customizations for Dark Mode in session cache
  ↓
Shows pristine Dark Mode values
```

**Selecting Customized Variant:**
```
User selects "Dark Mode (customized)"
  ↓
Block restores from sessionCache["Dark Mode"]
  ↓
Shows Dark Mode with user's customizations
  ↓
User can continue editing or save
```

---

## Implementation Details

### 1. Session Cache Setup

```javascript
import { useState } from '@wordpress/element';

// In Edit component
const [sessionCache, setSessionCache] = useState({});
```

**Critical:** Must be `useState`, NOT a block attribute.

### 2. Auto-Update on Every Change

```javascript
useEffect(() => {
  const snapshot = getThemeableSnapshot(attributes, excludeList);
  const currentThemeKey = attributes.currentTheme || '';

  setSessionCache(prev => ({
    ...prev,
    [currentThemeKey]: snapshot,
  }));
}, [attributes, excludeList]);
```

**What this does:**
- Runs on every attribute change
- Takes complete snapshot of all themeable attributes
- Updates session cache for CURRENT theme
- Preserves customizations for other themes

### 3. Theme Change Handler

```javascript
const handleThemeChange = (newThemeName, useCustomized = false) => {
  const newTheme = themes[newThemeName];
  const newThemeKey = newThemeName || '';
  const allDefaults = getAllDefaults();

  let valuesToApply;

  if (useCustomized && sessionCache[newThemeKey]) {
    // User selected customized variant - restore from cache
    valuesToApply = sessionCache[newThemeKey];
  } else {
    // User selected clean theme - use defaults + theme deltas
    valuesToApply = newTheme
      ? applyDeltas(allDefaults, newTheme.values || {})
      : allDefaults;
  }

  // Apply values
  const resetAttrs = { ...valuesToApply, currentTheme: newThemeName };
  excludeList.forEach(key => delete resetAttrs[key]);
  setAttributes(resetAttrs);
};
```

**Parameters:**
- `newThemeName`: Theme name to switch to
- `useCustomized`: Whether user selected customized variant (true) or clean (false)

### 4. Save as New Theme

```javascript
const handleSaveNewTheme = async (themeName) => {
  // Get snapshot from session cache for current theme
  const currentThemeKey = attributes.currentTheme || '';
  const currentSnapshot = sessionCache[currentThemeKey] || {};

  // Calculate deltas (optimized storage)
  const deltas = calculateDeltas(currentSnapshot, allDefaults, excludeList);

  // Save theme
  await createTheme('accordion', themeName, deltas);

  // Switch to new clean theme
  const newExpectedValues = applyDeltas(allDefaults, { values: deltas });
  const resetAttrs = { ...newExpectedValues, currentTheme: themeName };
  excludeList.forEach(key => delete resetAttrs[key]);
  setAttributes(resetAttrs);

  // Clear old theme from session cache
  setSessionCache(prev => {
    const updated = { ...prev };
    delete updated[currentThemeKey];
    return updated;
  });
};
```

**Flow:**
1. Get snapshot from session cache (not from attributes)
2. Calculate deltas from defaults
3. Save theme with deltas only
4. Switch block to clean new theme
5. Clear old theme from session cache

### 5. Update Theme

```javascript
const handleUpdateTheme = async () => {
  const currentThemeKey = attributes.currentTheme || '';
  const currentSnapshot = sessionCache[currentThemeKey] || {};
  const deltas = calculateDeltas(currentSnapshot, allDefaults, excludeList);

  await updateTheme('accordion', attributes.currentTheme, deltas);

  // Clear session cache (theme now matches current state)
  setSessionCache(prev => {
    const updated = { ...prev };
    delete updated[currentThemeKey];
    return updated;
  });
};
```

### 6. Reset Customizations

```javascript
const handleResetCustomizations = () => {
  // Calculate expected values (defaults + current theme)
  const resetAttrs = { ...expectedValues };
  excludeList.forEach(key => delete resetAttrs[key]);
  setAttributes(resetAttrs);

  // Clear session cache for current theme
  const currentThemeKey = attributes.currentTheme || '';
  setSessionCache(prev => {
    const updated = { ...prev };
    delete updated[currentThemeKey];
    return updated;
  });
};
```

### 7. ThemeSelector Integration

```javascript
<ThemeSelector
  blockType="accordion"
  currentTheme={attributes.currentTheme}
  isCustomized={isCustomized}
  themes={themes}
  themesLoaded={themesLoaded}
  sessionCache={sessionCache}           // ← Pass session cache
  onThemeChange={handleThemeChange}     // ← Pass handler
  onSaveNew={handleSaveNewTheme}
  onUpdate={handleUpdateTheme}
  onReset={handleResetCustomizations}
  // ... other props
/>
```

**Required new props:**
- `sessionCache`: The session cache object
- `onThemeChange`: Handler that accepts (themeName, useCustomized)

---

## Comparison: Old vs New

### Old Architecture (DEPRECATED - REMOVED)

```javascript
// ❌ Block attribute (saved to database)
attributes.customizationCache = {
  titleColor: "#ff0000",
  // ... complete snapshot
};

// ❌ Saved with post content
// ❌ Persisted across page reloads
// ❌ Single snapshot, not per-theme
```

### New Architecture (CURRENT)

```javascript
// ✅ React state (session-only)
const [sessionCache, setSessionCache] = useState({
  "": { titleColor: "#ff0000", ... },
  "Dark Mode": { titleColor: "#00ff00", ... },
});

// ✅ NOT saved to database
// ✅ Lost on page reload
// ✅ Per-theme storage
// ✅ Supports dual dropdown variants
```

---

## Common Patterns

### Pattern 1: Free Theme Switching

```
User: Customizes Default
  → Session cache: { "": { titleColor: "#ff0000" } }

User: Switches to Dark Mode
  → Block shows Dark Mode (clean)
  → Session cache: { "": { titleColor: "#ff0000" }, "Dark Mode": { ... } }

User: Customizes Dark Mode
  → Session cache updates for "Dark Mode"
  → Session cache: { "": { titleColor: "#ff0000" }, "Dark Mode": { titleColor: "#00ff00" } }

User: Switches back to Default
  → Selects "Default (customized)" from dropdown
  → Block shows Default with red title (from session cache)
  → Session cache unchanged

User: Switches to clean Default
  → Selects "Default" from dropdown
  → Block shows pristine Default
  → Session cache for "" still exists but not applied
```

### Pattern 2: Save and Persist

```
User: Customizes Default
  → Session cache: { "": { titleColor: "#ff0000" } }

User: Clicks "Save as New Theme"
  → System creates "My Theme" with titleColor: "#ff0000"
  → Block switches to clean "My Theme"
  → Session cache clears entry for ""
  → Session cache: {}

User: Saves post
  → WordPress saves currentTheme: "My Theme"
  → WordPress saves current attribute values
  → Session cache (React state) NOT saved
```

### Pattern 3: Discard on Save

```
User: Customizes Default
  → Session cache: { "": { titleColor: "#ff0000" } }

User: Switches to Dark Mode (clean)
  → Block shows Dark Mode
  → Session cache: { "": { titleColor: "#ff0000" }, "Dark Mode": { ... } }

User: Saves post (while on Dark Mode)
  → WordPress saves currentTheme: "Dark Mode"
  → WordPress saves current Dark Mode values
  → Session cache NOT saved (it's React state)
  → Default customizations LOST

User: Reloads page
  → Block shows Dark Mode (last saved state)
  → Session cache: {}
  → Default customizations are gone forever
```

---

## Testing Scenarios

### Test 1: Session Cache Auto-Update

```javascript
// Initial
sessionCache = {}

// User changes title color
setAttributes({ titleColor: "#ff0000" })

// Verify session cache updated
expect(sessionCache[""]).toHaveProperty("titleColor", "#ff0000")
expect(sessionCache[""]).toHaveProperty("titleFontSize", 16)  // Complete snapshot
```

### Test 2: Dual Dropdown Variants

```javascript
// Initial - no customizations
sessionCache = {}

// Verify dropdown options
expect(themeOptions).toContain({ label: "Default", value: "" })
expect(themeOptions).not.toContain({ label: "Default (customized)", value: "::customized" })

// User customizes
sessionCache[""] = { titleColor: "#ff0000", ... }

// Verify customized variant appears
expect(themeOptions).toContain({ label: "Default (customized)", value: "::customized" })
```

### Test 3: Theme Switch Preserves Customizations

```javascript
// User customizes Default
sessionCache = { "": { titleColor: "#ff0000" } }

// User switches to Dark Mode
handleThemeChange("Dark Mode", false)

// Verify Default customizations preserved
expect(sessionCache[""]).toHaveProperty("titleColor", "#ff0000")

// User switches back to Default (customized variant)
handleThemeChange("", true)

// Verify title color restored
expect(attributes.titleColor).toBe("#ff0000")
```

### Test 4: Save Clears Session Cache

```javascript
// User customizes
sessionCache = { "": { titleColor: "#ff0000" } }

// User saves as new theme
await handleSaveNewTheme("My Theme")

// Verify cache cleared
expect(sessionCache[""]).toBeUndefined()
```

### Test 5: Page Reload Loses Cache

```javascript
// During session
sessionCache = { "": { titleColor: "#ff0000" }, "Dark Mode": { ... } }

// Simulate page reload (component remount)
// useState initializes with empty object
const [sessionCache, setSessionCache] = useState({})

// Verify cache reset
expect(sessionCache).toEqual({})
```

### Test 6: Per-Block-Instance Isolation

```javascript
// Post with 2 Accordion blocks
const accordionBlock1 = mount(<Edit attributes={attrs1} setAttributes={setAttrs1} />);
const accordionBlock2 = mount(<Edit attributes={attrs2} setAttributes={setAttrs2} />);

// Block 1: User customizes Default with red
accordionBlock1.setAttributes({ titleColor: "#ff0000" });

// Block 2: User customizes Default with blue
accordionBlock2.setAttributes({ titleColor: "#0000ff" });

// Verify Block 1's session cache
expect(accordionBlock1.sessionCache[""]).toHaveProperty("titleColor", "#ff0000");

// Verify Block 2's session cache (INDEPENDENT)
expect(accordionBlock2.sessionCache[""]).toHaveProperty("titleColor", "#0000ff");

// Verify no cross-contamination
expect(accordionBlock1.sessionCache[""]).not.toEqual(accordionBlock2.sessionCache[""]);

// Both can have "Default (customized)" in dropdown
expect(accordionBlock1.themeOptions).toContain({ label: "Default (customized)", value: "::customized" });
expect(accordionBlock2.themeOptions).toContain({ label: "Default (customized)", value: "::customized" });

// But with different underlying values
accordionBlock1.handleThemeChange("", true);  // Red
accordionBlock2.handleThemeChange("", true);  // Blue
expect(accordionBlock1.attributes.titleColor).toBe("#ff0000");
expect(accordionBlock2.attributes.titleColor).toBe("#0000ff");
```

**This test verifies:**
- Each block instance has its own isolated session cache
- Block 1's customizations don't affect Block 2
- Multiple blocks can have "Default (customized)" with different values
- React useState provides automatic per-component-instance isolation

---

## Benefits

### 1. User Freedom
- Customize without commitment
- Try different looks risk-free
- Easy to discard (just reload or save with different theme)

### 2. Clean Separation
- Temporary customizations (session cache) vs permanent themes (database)
- No pollution of database with unsaved experiments
- Clear user mental model: "If I don't save it, it's gone"

### 3. Performance
- No database writes for every customization
- React state updates are instant
- Auto-cleanup on session end

### 4. Safety
- Can't accidentally save temporary experiments
- User must explicitly create/update theme to persist
- Standard WordPress behavior (no save = no persist)

### 5. Flexibility
- Switch between themes with customizations preserved
- Dual dropdown variants for easy access
- Can save customizations whenever ready

---

## Critical Rules

1. **Session cache is React state, NEVER a block attribute**
2. **Auto-update on every attribute change**
3. **Store complete snapshots (not deltas) for safety**
4. **Clear cache when saving/updating themes**
5. **Dual dropdown shows both clean and customized variants**
6. **Use "themeName::customized" format for customized variants**
7. **Pass (themeName, useCustomized) to handleThemeChange**
8. **Only current theme values saved to database on post save**
9. **Each block instance has its own isolated session cache (per-component-instance)**

---

## Files Modified

### Blocks (All Three: Accordion, Tabs, TOC)

**blocks/{accordion|tabs|toc}/src/edit.js:**
- Added session cache useState
- Added auto-update useEffect
- Updated handleSaveNewTheme
- Updated handleUpdateTheme
- Updated handleResetCustomizations
- Added handleThemeChange with useCustomized parameter
- Passed sessionCache and onThemeChange to ThemeSelector
- Removed deprecated attributes from excludeFromCustomizationCheck

### Shared Components

**shared/src/components/ThemeSelector.js:**
- Added sessionCache prop
- Added onThemeChange prop
- Generate dual dropdown options
- Parse "themeName::customized" format
- Call onThemeChange with (themeName, useCustomized)

**shared/src/attributes/meta-attributes.js:**
- Removed customizations attribute (deprecated)
- Removed customizationCache attribute (deprecated)
- Removed applyCustomizations attribute (deprecated)

**shared/src/data/usage-example.js:**
- Updated all examples to reflect new architecture
- Removed old cascade resolution examples
- Added session cache examples

---

## Summary

**Session-only cache** is the cornerstone of the simplified architecture:

- **React state** (not block attribute)
- **Per-theme storage** ({ "": {...}, "Dark Mode": {...} })
- **Auto-updates** on every change
- **Lost on reload** (desired behavior)
- **Dual dropdown** (clean + customized variants)
- **Free switching** (customizations preserved across theme switches)
- **Explicit save** (user must create/update theme to persist)

This creates a clean, intuitive user experience where temporary customizations are truly temporary, and only explicit theme save operations persist to the database.

---

**Document Version**: 1.0 (Session-Only Cache Architecture)
**Last Updated**: 2025-11-17
**Part of**: WordPress Gutenberg Blocks Documentation Suite
