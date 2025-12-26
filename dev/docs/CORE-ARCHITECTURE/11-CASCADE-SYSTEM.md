# The Simplified Value Resolution System

**Purpose**: Understanding how block values are determined and displayed
**Read Time**: 5 minutes
**Critical For**: Understanding the new simplified architecture

---

## New Architecture: Attributes as Source of Truth

In the simplified architecture, there is **NO complex cascade**. Instead:

**Sidebar = Source of Truth**: The values you see in the sidebar ARE the actual block attributes. What you see is what you get.

---

## Visual Model

```
┌──────────────────────────────────────────────────────────┐
│  BLOCK ATTRIBUTES (Single Source of Truth)               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Storage: Block attributes in post content               │
│  What:    Complete merged state                          │
│  Display: Shown directly in sidebar controls             │
│  Example: { titleColor: "#ff0000", titleFontSize: 18 }   │
└──────────────────────────────────────────────────────────┘
```

**That's it.** No tiers, no cascade, no complex resolution.

---

## How It Works

### 1. On Block Mount

When a block loads (fresh or with saved theme):

```javascript
// Block has currentTheme = "Dark Mode"

// Step 1: Get defaults (CSS + behavioral)
const allDefaults = getAllDefaults();
// { titleColor: "#333", titleFontSize: 16, ... }

// Step 2: Get theme (if any)
const theme = themes[currentTheme];
// { values: { titleColor: "#fff", titleBackgroundColor: "#2c2c2c" } }

// Step 3: Calculate expected values (defaults + theme deltas)
const expectedValues = theme
  ? applyDeltas(allDefaults, theme.values || {})
  : allDefaults;
// { titleColor: "#fff", titleFontSize: 16, titleBackgroundColor: "#2c2c2c", ... }

// Step 4: Attributes may already have values (if block was saved before)
// Use attributes AS-IS - they are the source of truth
const effectiveValues = attributes;
```

### 2. Rendering in Sidebar

```javascript
// Display attributes directly in controls
<ColorPicker
  value={attributes.titleColor}  // Direct from attributes
  onChange={(color) => setAttributes({ titleColor: color })}
/>

// Or use effectiveValues (which is just attributes)
<ColorPicker
  value={effectiveValues.titleColor}  // Same as attributes.titleColor
  onChange={(color) => setAttributes({ titleColor: color })}
/>
```

### 3. User Makes Changes

```javascript
// User changes title color to red
setAttributes({ titleColor: "#ff0000" });

// That's it! The attribute is updated.
// Sidebar shows the new value immediately.
// customizationCache auto-updates with complete snapshot.
```

### 4. Customization Detection

```javascript
// System compares attributes to expected values
const isCustomized = Object.keys(attributes).some(key => {
  const attrValue = attributes[key];
  const expectedValue = expectedValues[key];

  // Skip if undefined/null
  if (attrValue === undefined || attrValue === null) return false;

  // Compare
  return attrValue !== expectedValue;
});

// If ANY attribute differs from expected → isCustomized = true
// Theme dropdown shows "(customized)" suffix
```

---

## Concrete Example

### Scenario

User has:
- Accordion block with "Dark Mode" theme
- Customized title color to red

### Data State

```javascript
// Defaults (CSS + behavioral)
allDefaults = {
  titleColor: "#333333",
  titleFontSize: 16,
  titleBackgroundColor: "#f5f5f5"
}

// Theme deltas (stored in database)
theme = {
  name: "Dark Mode",
  values: {
    titleColor: "#ffffff",           // Delta from default
    titleBackgroundColor: "#2c2c2c"  // Delta from default
    // titleFontSize not included (uses default)
  }
}

// Expected values (defaults + theme deltas)
expectedValues = {
  titleColor: "#ffffff",           // From theme
  titleFontSize: 16,               // From defaults
  titleBackgroundColor: "#2c2c2c"  // From theme
}

// Actual block attributes (source of truth)
attributes = {
  currentTheme: "Dark Mode",
  titleColor: "#ff0000",          // ← User customized this!
  titleFontSize: 16,              // Matches expected (not customized)
  titleBackgroundColor: "#2c2c2c" // Matches expected (not customized)
}
```

### Results

```javascript
// What shows in sidebar:
titleColor: "#ff0000"          // Red (customized)
titleFontSize: 16              // From expected values
titleBackgroundColor: "#2c2c2c" // From theme

// Customization detection:
isCustomized = true  // Because titleColor differs from expected
// Dropdown shows "Dark Mode (customized)"
```

---

## Key Operations

### Loading a Theme

When user selects a theme from dropdown:

```javascript
// User selects "Dark Mode"
setAttributes({ currentTheme: "Dark Mode" });

// That's all! ThemeSelector just updates currentTheme.
// Block continues showing current attribute values.
// User can manually reset if desired.
```

**No automatic reset** - theme switching just changes `currentTheme`. User's current customizations remain until they click "Reset Modifications".

### Resetting to Clean Theme

When user clicks "Reset Modifications":

```javascript
// Calculate expected values
const expectedValues = theme
  ? applyDeltas(allDefaults, theme.values || {})
  : allDefaults;

// Apply expected values (reset-and-apply pattern)
const resetAttrs = { ...expectedValues, customizationCache: {} };

// Remove excluded attributes (keep structural/meta)
excludeFromCustomizationCheck.forEach(key => delete resetAttrs[key]);

setAttributes(resetAttrs);

// Now attributes match expected values exactly
// isCustomized becomes false
// Dropdown shows clean "Dark Mode"
```

### Saving as New Theme

When user clicks "Save as New Theme":

```javascript
// Take complete snapshot of current state
const snapshot = getThemeableSnapshot(attributes, excludeList);
// { titleColor: "#ff0000", titleFontSize: 16, titleBackgroundColor: "#2c2c2c", ... }

// Calculate deltas from defaults (optimized storage)
const deltas = calculateDeltas(snapshot, allDefaults, excludeList);
// { titleColor: "#ff0000", titleBackgroundColor: "#2c2c2c" }
// titleFontSize NOT included (matches default)

// Save theme with deltas only
await createTheme('accordion', 'My Custom Theme', deltas);

// Switch block to new theme (clear customizations)
setAttributes({
  currentTheme: 'My Custom Theme',
  customizationCache: {}
});
// Now attributes match theme exactly (isCustomized = false)
```

### Updating a Theme

When user clicks "Update Theme":

```javascript
// Take complete snapshot
const snapshot = getThemeableSnapshot(attributes, excludeList);

// Calculate new deltas
const deltas = calculateDeltas(snapshot, allDefaults, excludeList);

// Update theme
await updateTheme('accordion', currentTheme, deltas);

// Clear cache (block now uses clean updated theme)
setAttributes({ customizationCache: {} });
```

---

## The customizations Attribute

The `customizations` attribute plays a critical role in the simplified architecture:

**Purpose**: Tracks which attributes differ from the expected theme values

**Usage**:
1. **Clean Detection**: Empty object (`{}`) means block uses clean theme
2. **Batch Updates**: System uses this to determine which blocks to auto-update
3. **Frontend Rendering**: Used by `save.js` to generate element-inline CSS variables on the block root (not a `<style>` tag)

### CSS Output Tiers (Explicit)

**Tier 1: Defaults**
- Source: base CSS variables in `:root` (assets CSS)

**Tier 2: Saved Themes**
- Source: theme deltas stored in the database
- Output: CSS variables injected in the page `<head>` under a theme class
- Purpose: shared, cached values for saved themes only

**Tier 3: Block Customizations**
- Source: `customizations` (per-block deltas from expected values)
- Output: inline CSS variables on the block root element via the `style` attribute
- Purpose: highest-priority overrides for a specific block instance

**Rule**: Tier 3 must be element-inline only. No `<style>` tags for block customizations. `<head>` is reserved for Tier 2 saved theme classes.

**Auto-Update Behavior**:

```javascript
// useEffect watches for attribute changes
useEffect(() => {
  const newCustomizations = {};

  Object.keys(attributes).forEach((key) => {
    if (excludeFromCustomizationCheck.includes(key)) return;

    const attrValue = attributes[key];
    const expectedValue = expectedValues[key];

    // Check if different from expected
    if (attrValue !== expectedValue && attrValue !== undefined) {
      newCustomizations[key] = attrValue;
    }
  });

  // Only update if changed
  if (JSON.stringify(newCustomizations) !== JSON.stringify(attributes.customizations)) {
    setAttributes({ customizations: newCustomizations });
  }
}, [attributes, expectedValues, excludeFromCustomizationCheck]);
```

**Data Structure Examples**:

```javascript
// Clean block (using theme exactly)
customizations: {}

// Customized block (modified from theme)
customizations: {
  titleColor: "#ff0000",
  titleFontSize: 20
}
```

**Critical for Batch Updates**:

When a theme is updated, the system checks each block's `customizations`:
- `customizations: {}` → Block gets updated with new theme values
- `customizations: { ... }` → Block keeps its customizations (user intent preserved)

---

## Comparison with Old Architecture

### Old (Complex Cascade)

```javascript
// Three-tier cascade resolution
Tier 3: Block Customizations (separate object)
Tier 2: Theme Values
Tier 1: CSS Defaults

// Complex resolution for each attribute
getEffectiveValue('titleColor', customizations, theme, cssDefaults)

// Separate storage for customizations
attributes.customizations = { titleColor: "#ff0000" }

// applyCustomizations flag to toggle
attributes.applyCustomizations = true
```

### New (Simple Attributes)

```javascript
// Single source of truth
attributes = { titleColor: "#ff0000", ... }

// Direct reading
const value = attributes.titleColor

// No separate storage, no flags
// Customization detected by comparing to expected values
```

---

## Benefits of New Architecture

1. **Simpler Code**: No complex cascade resolver, no getAllEffectiveValues()
2. **Clearer Intent**: What you see in sidebar IS the block state
3. **Better Performance**: No cascade resolution on every render
4. **Easier Debugging**: Just inspect attributes - no hidden state
5. **Standard WordPress**: Uses setAttributes like normal blocks
6. **Auto-Detection**: No manual tracking of what's customized
7. **Complete Safety**: customizationCache keeps full snapshots

---

## Common Patterns

### Reading Values for Display

```javascript
// Simple - just use attributes
<div style={{ color: attributes.titleColor }}>
  {attributes.title}
</div>

// Or use effectiveValues alias (same thing)
<div style={{ color: effectiveValues.titleColor }}>
  {attributes.title}
</div>
```

### Updating Values

```javascript
// Direct writes
setAttributes({ titleColor: "#ff0000" });

// Multiple attributes
setAttributes({
  titleColor: "#ff0000",
  titleFontSize: 20
});
```

### Checking Customization Status

```javascript
// Compare to expected values
const isCustomized = Object.keys(attributes).some(key => {
  if (excludeList.includes(key)) return false;
  const attrValue = attributes[key];
  const expectedValue = expectedValues[key];
  return attrValue !== undefined &&
         attrValue !== null &&
         attrValue !== expectedValue;
});
```

---

## Implementation Files

### Core Utilities

**shared/src/utils/delta-calculator.js**:
- `calculateDeltas()` - Compare snapshot to defaults, return only differences
- `applyDeltas()` - Merge defaults + deltas
- `getThemeableSnapshot()` - Extract all themeable attributes

**shared/src/attributes/attribute-defaults.js**:
- `getAllDefaults()` - Get combined CSS + behavioral defaults

### Block Edit Components

**blocks/accordion/src/edit.js**, **blocks/tabs/src/edit.js**, **blocks/toc/src/edit.js**:

```javascript
// Get defaults
const allDefaults = getAllDefaults();

// SOURCE OF TRUTH: attributes
const effectiveValues = attributes;

// Calculate expected values
const expectedValues = theme
  ? applyDeltas(allDefaults, theme.values || {})
  : allDefaults;

// Auto-detect customizations
const isCustomized = /* compare attributes to expectedValues */;

// Auto-update cache
useEffect(() => {
  const snapshot = getThemeableSnapshot(attributes, excludeList);
  setAttributes({ customizationCache: snapshot });
}, [attributes]);
```

---

## Testing

### Test: Fresh Block

```javascript
// New block, no theme
currentTheme = ""
attributes = {}  // Empty or with defaults from schema

// Expected: attributes get populated with defaults on mount
// isCustomized = false
```

### Test: Block with Theme

```javascript
// Block with theme, no customizations
currentTheme = "Dark Mode"
attributes = { titleColor: "#fff", titleBackgroundColor: "#2c2c2c" }
expectedValues = { titleColor: "#fff", titleBackgroundColor: "#2c2c2c", ... }

// Expected: attributes match expected
// isCustomized = false
```

### Test: Block with Customizations

```javascript
// Block with theme + customizations
currentTheme = "Dark Mode"
attributes = { titleColor: "#ff0000", titleBackgroundColor: "#2c2c2c" }
expectedValues = { titleColor: "#fff", titleBackgroundColor: "#2c2c2c" }

// Expected: titleColor differs
// isCustomized = true
// Dropdown shows "Dark Mode (customized)"
```

### Test: Save as New Theme

```javascript
// Block with customizations
attributes = { titleColor: "#ff0000", titleFontSize: 16, ... }
defaults = { titleColor: "#333", titleFontSize: 16, ... }

// Save as "My Theme"
const deltas = calculateDeltas(attributes, defaults);
// deltas = { titleColor: "#ff0000" }
// titleFontSize NOT included (matches default)

// After save:
currentTheme = "My Theme"
isCustomized = false
customizationCache = {}
```

---

## Summary

### The Rules

1. **Attributes = source of truth** (what you see is what's stored)
2. **Themes = deltas** (optimized storage)
3. **Expected values = defaults + theme deltas** (for comparison)
4. **Customization = difference from expected** (auto-detected)
5. **customizationCache = complete snapshot** (auto-updated, safety)

### The Flow

1. User edits → writes to attributes
2. customizationCache auto-updates
3. System compares to expected → detects customizations
4. Save theme → calculate deltas → store deltas
5. Load theme → merge defaults + deltas → use as expected values

### No Complex Cascade

The old three-tier cascade (Block → Theme → CSS) is **gone**. Replaced with simple direct attribute usage.

---

**Document Version**: 2.1 (Customizations Attribute Role)
**Last Updated**: 2025-12-14
**Part of**: WordPress Gutenberg Blocks Documentation Suite
