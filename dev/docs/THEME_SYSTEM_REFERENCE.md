# Theme System Reference Guide

**Quick reference for working with the Guttemberg Plus theme system**

---

## Overview

The theme system provides a 3-tier CSS cascade for block styling:

1. **Tier 1: Defaults** - Schema-defined default values
2. **Tier 2: Themes** - User-created theme deltas (only differences from defaults)
3. **Tier 3: Customizations** - Per-block overrides

**Key Features:**
- Delta-based storage (only stores differences from defaults)
- Format-agnostic (works with any attribute structure)
- Session-based customization cache
- Batch block updates when themes change

---

## Core Concepts

### Delta-Based Storage

**What it means:**
Themes only store attributes that differ from defaults, not the entire attribute set.

**Example:**
```javascript
// Schema defaults:
{
  'block-box-border-width-top': '1px',
  'header-background-color': '#ffffff',
  'header-text-color': '#333333',
  'header-padding-top': '12px'
}

// User customizes 2 values and saves as theme:
// Theme stores ONLY these 2 deltas:
{
  'block-box-border-width-top': '2px',
  'header-text-color': '#ff0000'
}
```

**Benefits:**
- Minimal database size (~95% reduction)
- Fast theme loading
- Easy to see what changed
- Simple theme comparison

### Cascade Resolution

**Priority Order (highest to lowest):**
1. Block attributes (per-block customizations)
2. Theme deltas (applied theme)
3. Schema defaults (fallback)

**Example:**
```javascript
// Defaults:
{ 'header-text-color': '#333333' }

// Theme:
{ 'header-text-color': '#ff0000' }

// Block:
{ 'header-text-color': '#0000ff' }

// Effective value: '#0000ff' (block wins)
```

**First match wins - no merging between tiers.**

---

## Core Utilities

### 1. Delta Calculator (`shared/utils/delta-calculator.js`)

#### `calculateDeltas(snapshot, defaults, exclude)`

Calculates differences between current values and defaults.

**Parameters:**
- `snapshot` - Current attribute values
- `defaults` - Default values from schema
- `exclude` - Array of attributes to exclude (e.g., `['accordion-id', 'current-theme']`)

**Returns:**
Object containing only attributes that differ from defaults.

**Example:**
```javascript
import { calculateDeltas } from '@shared/utils/delta-calculator';

const snapshot = {
  'block-box-border-width-top': '2px',
  'header-background-color': '#ffffff',
  'header-text-color': '#ff0000'
};

const defaults = {
  'block-box-border-width-top': '1px',
  'header-background-color': '#ffffff',
  'header-text-color': '#333333'
};

const deltas = calculateDeltas(snapshot, defaults, []);
// Returns: {
//   'block-box-border-width-top': '2px',
//   'header-text-color': '#ff0000'
// }
// (header-background-color excluded because it matches default)
```

#### `applyDeltas(base, deltas)`

Merges defaults with theme deltas.

**Parameters:**
- `base` - Base values (usually defaults)
- `deltas` - Delta values to apply (from theme)

**Returns:**
Merged object.

**Example:**
```javascript
import { applyDeltas } from '@shared/utils/delta-calculator';

const defaults = {
  'block-box-border-width-top': '1px',
  'header-background-color': '#ffffff',
  'header-text-color': '#333333'
};

const themeDeltas = {
  'block-box-border-width-top': '2px',
  'header-text-color': '#ff0000'
};

const result = applyDeltas(defaults, themeDeltas);
// Returns: {
//   'block-box-border-width-top': '2px',      // From theme
//   'header-background-color': '#ffffff',     // From defaults
//   'header-text-color': '#ff0000'            // From theme
// }
```

#### `getThemeableSnapshot(attributes, exclude)`

Extracts themeable attributes (excludes structural/behavioral).

**Parameters:**
- `attributes` - Block attributes
- `exclude` - Attributes to exclude

**Returns:**
Object with only themeable attributes.

**Example:**
```javascript
import { getThemeableSnapshot } from '@shared/utils/delta-calculator';

const attributes = {
  'block-box-border-width-top': '2px',
  'header-text-color': '#ff0000',
  'accordion-id': 'test-123',      // Excluded
  'current-theme': 'My Theme'      // Excluded
};

const exclude = ['accordion-id', 'current-theme'];
const snapshot = getThemeableSnapshot(attributes, exclude);
// Returns: {
//   'block-box-border-width-top': '2px',
//   'header-text-color': '#ff0000'
// }
```

### 2. Cascade Resolver (`shared/theme-system/cascade-resolver.js`)

#### `getAllEffectiveValues(attributes, theme, defaults)`

Resolves effective values using 3-tier cascade.

**Parameters:**
- `attributes` - Block-level customizations
- `theme` - Theme values
- `defaults` - Default values

**Returns:**
Object with all effective values.

**Example:**
```javascript
import { getAllEffectiveValues } from '@shared/theme-system/cascade-resolver';

const attributes = {
  'block-box-border-width-top': '3px'  // Block override
};

const theme = {
  'header-text-color': '#ff0000'       // Theme value
};

const defaults = {
  'block-box-border-width-top': '1px',
  'header-text-color': '#333333',
  'header-padding-top': '12px'         // Only in defaults
};

const effectiveValues = getAllEffectiveValues(attributes, theme, defaults);
// Returns: {
//   'block-box-border-width-top': '3px',    // From block
//   'header-text-color': '#ff0000',         // From theme
//   'header-padding-top': '12px'            // From defaults
// }
```

#### `isCustomizedFromDefaults(name, attributes, theme, defaults)`

Checks if an attribute is customized (differs from cascade).

**Parameters:**
- `name` - Attribute name
- `attributes` - Block attributes
- `theme` - Theme values
- `defaults` - Default values

**Returns:**
Boolean (true if customized).

**Example:**
```javascript
import { isCustomizedFromDefaults } from '@shared/theme-system/cascade-resolver';

const attributes = {
  'block-box-border-width-top': '2px',
  'header-text-color': '#ff0000'
};

const theme = {
  'header-text-color': '#ff0000'
};

const defaults = {
  'block-box-border-width-top': '1px',
  'header-text-color': '#333333'
};

// Check border:
isCustomizedFromDefaults(
  'block-box-border-width-top',
  attributes,
  theme,
  defaults
);
// Returns: true (differs from both theme and defaults)

// Check text color:
isCustomizedFromDefaults(
  'header-text-color',
  attributes,
  theme,
  defaults
);
// Returns: false (matches theme)
```

### 3. Theme Manager Hook (`shared/hooks/useThemeManager.js`)

All-in-one hook for theme management in block edit components.

**Parameters:**
```javascript
{
  blockType,      // 'accordion', 'tabs', or 'toc'
  schema,         // Block schema object
  attributes,     // Block attributes
  setAttributes,  // WordPress setAttributes function
  allDefaults     // Merged defaults (schema + CSS)
}
```

**Returns:**
```javascript
{
  // Theme data
  themes,                    // All themes for this block type
  themesLoaded,              // Boolean: themes loaded from API
  currentTheme,              // Current theme object
  expectedValues,            // Expected values (defaults + theme deltas)
  isCustomized,              // Boolean: block has customizations
  sessionCache,              // Session-based customization cache
  excludeFromCustomizationCheck,  // Excluded attributes

  // Handlers
  handlers: {
    handleSaveNewTheme,      // Save current state as new theme
    handleUpdateTheme,       // Update existing theme
    handleDeleteTheme,       // Delete current theme
    handleRenameTheme,       // Rename theme
    handleResetCustomizations,  // Reset to clean theme
    handleThemeChange        // Switch to different theme
  }
}
```

**Example:**
```javascript
import { useThemeManager } from '@shared';

function MyBlockEdit({ attributes, setAttributes }) {
  const {
    themes,
    themesLoaded,
    currentTheme,
    expectedValues,
    isCustomized,
    handlers: {
      handleSaveNewTheme,
      handleUpdateTheme,
      handleDeleteTheme,
      handleResetCustomizations,
      handleThemeChange
    }
  } = useThemeManager({
    blockType: 'accordion',
    schema: accordionSchema,
    attributes,
    setAttributes,
    allDefaults: schema.defaultValues
  });

  if (!themesLoaded) {
    return <Spinner />;
  }

  return (
    <ThemeSelector
      themes={themes}
      currentTheme={currentTheme?.name}
      isCustomized={isCustomized}
      onThemeChange={handleThemeChange}
      onSaveNewTheme={handleSaveNewTheme}
      onUpdateTheme={handleUpdateTheme}
      onDeleteTheme={handleDeleteTheme}
      onResetCustomizations={handleResetCustomizations}
    />
  );
}
```

---

## Theme Operations

### Save New Theme

```javascript
await handleSaveNewTheme('My Theme Name');
```

**What happens:**
1. Calculates deltas between current attributes and defaults
2. Saves deltas to database via REST API
3. Updates Redux store
4. Resets block to clean theme state
5. Clears session cache

### Update Existing Theme

```javascript
await handleUpdateTheme();
```

**What happens:**
1. Calculates deltas between current attributes and defaults
2. Updates theme in database
3. Updates Redux store
4. Resets block to updated theme state
5. Batch-updates all other blocks using this theme
6. Clears session cache

### Delete Theme

```javascript
await handleDeleteTheme();
```

**What happens:**
1. Deletes theme from database
2. Updates Redux store
3. Resets block to defaults
4. Batch-resets all other blocks using this theme
5. Clears session cache

### Apply Theme

```javascript
handleThemeChange('Theme Name', useCustomized);
```

**Parameters:**
- `themeName` - Theme to apply (or empty string for defaults)
- `useCustomized` - Boolean: apply customized variant from session cache

**What happens:**
1. Loads theme deltas from store
2. Merges deltas with defaults
3. Applies to block via setAttributes
4. If `useCustomized`, applies cached customizations

### Reset Customizations

```javascript
handleResetCustomizations();
```

**What happens:**
1. Resets all attributes to expected values (defaults or theme)
2. Clears customizations attribute
3. Clears session cache for current theme

---

## Database Schema

### Storage Location
**Table:** `wp_options`
**Keys:**
- `guttemberg_plus_accordion_themes`
- `guttemberg_plus_tabs_themes`
- `guttemberg_plus_toc_themes`

### Data Format
```php
[
  'Theme Name' => [
    'name' => 'Theme Name',
    'values' => [
      'block-box-border-width-top' => '2px',
      'header-text-color' => '#ff0000',
      // ... only changed values (deltas)
    ]
  ],
  'Another Theme' => [
    'name' => 'Another Theme',
    'values' => [
      'header-background-color' => '#000000',
      // ... deltas
    ]
  ]
]
```

---

## REST API Endpoints

### Get All Themes
```
GET /gutenberg-blocks/v1/themes/{blockType}
```

**Response:**
```json
{
  "My Theme": {
    "name": "My Theme",
    "values": {
      "block-box-border-width-top": "2px",
      "header-text-color": "#ff0000"
    }
  }
}
```

### Create Theme
```
POST /gutenberg-blocks/v1/themes
Body: {
  "blockType": "accordion",
  "name": "My Theme",
  "values": { ... }
}
```

### Update Theme
```
PUT /gutenberg-blocks/v1/themes/{blockType}/{name}
Body: {
  "values": { ... }
}
```

### Delete Theme
```
DELETE /gutenberg-blocks/v1/themes/{blockType}/{name}
```

### Rename Theme
```
POST /gutenberg-blocks/v1/themes/{blockType}/{name}/rename
Body: {
  "newName": "New Name"
}
```

---

## Session Cache

The session cache stores customizations temporarily when switching themes.

**When it's used:**
- User applies Theme A
- User customizes some attributes
- User switches to Theme B
- Customizations stored in session cache
- User switches back to Theme A
- Option to apply customized variant

**Format:**
```javascript
{
  'Theme A': {
    'block-box-border-width-top': '2px',
    'header-text-color': '#ff0000',
    // ... customized values
  },
  'Theme B': {
    'header-padding-top': '16px',
    // ... customized values
  }
}
```

**Lifecycle:**
- In-memory only (not persisted)
- Cleared when theme is saved/updated
- Cleared when customizations are reset
- Lost on page refresh (by design)

---

## Customization Detection

### How It Works

A block is considered "customized" if ANY attribute differs from the expected value (defaults or theme).

**Logic:**
```javascript
// For each attribute:
const isCustomized = attribute !== expectedValue;

// Expected value is:
// - Theme value (if theme applied)
// - Default value (if no theme)
```

**Example:**
```javascript
// Defaults:
{ 'header-text-color': '#333333' }

// Theme:
{ 'header-text-color': '#ff0000' }

// Block:
{ 'header-text-color': '#0000ff' }

// Expected: '#ff0000' (from theme)
// Actual: '#0000ff'
// Customized: true
```

### Visual Indicator

The UI shows a "Customized" badge when `isCustomized === true`.

---

## Exclusions

Certain attributes are excluded from theme storage:

**Categories:**
- **Structural:** `accordion-id`, `block-id`, `unique-id`
- **Behavioral:** `initially-open`, `allow-multiple-open`
- **Content:** `title`, `content`
- **Meta:** `current-theme`, `customizations`

**Defined in:**
Schema files via `themeable: false` flag.

**Example:**
```json
{
  "accordion-id": {
    "type": "string",
    "default": "",
    "themeable": false,
    "reason": "structural"
  }
}
```

---

## Best Practices

### 1. Always Use Delta-Based Storage
```javascript
// ✅ Good: Only store differences
const deltas = calculateDeltas(snapshot, defaults, exclude);
await createTheme(blockType, themeName, deltas);

// ❌ Bad: Store entire attribute set
await createTheme(blockType, themeName, attributes);
```

### 2. Always Use Cascade Resolution
```javascript
// ✅ Good: Use cascade-resolved values
const effectiveValues = getAllEffectiveValues(attributes, theme, defaults);

// ❌ Bad: Use raw attributes
const value = attributes['header-text-color'];
```

### 3. Always Exclude Non-Themeable Attributes
```javascript
// ✅ Good: Calculate exclusions from schema
const exclude = Object.entries(schema.attributes)
  .filter(([, attr]) => attr.themeable !== true)
  .map(([key]) => key);

// ❌ Bad: Hardcode exclusions
const exclude = ['accordion-id', 'current-theme'];
```

### 4. Always Check `themesLoaded` Before Rendering
```javascript
// ✅ Good: Wait for themes to load
if (!themesLoaded) {
  return <Spinner />;
}

// ❌ Bad: Render without checking
return <ThemeSelector themes={themes} />;
```

---

## Troubleshooting

### Theme Not Applying

**Check:**
1. Theme exists in database: `wp_options` → `guttemberg_plus_{blockType}_themes`
2. Theme has values: `themes[themeName].values` not empty
3. Attribute keys match flat format: `'block-box-border-width-top'` not `blockBox.border.width.top`
4. Themes loaded: `themesLoaded === true`

### Customization Not Detected

**Check:**
1. Attribute is themeable: `schema.attributes[key].themeable === true`
2. Attribute not in exclusion list
3. Value differs from expected: `attributes[key] !== expectedValues[key]`
4. Expected values calculated correctly: `applyDeltas(defaults, theme.values)`

### Theme Deltas Too Large

**Check:**
1. Using `calculateDeltas()` not storing full attributes
2. Exclusion list includes non-themeable attributes
3. Comparing against correct defaults (schema defaults, not empty object)

### Session Cache Not Working

**Check:**
1. Session cache is in-memory only (lost on refresh)
2. Cache cleared on theme save/update/reset
3. Cache keyed by theme name (use correct theme name)

---

## Performance Tips

### 1. Minimize Theme Size
- Only store deltas (use `calculateDeltas()`)
- Exclude non-themeable attributes
- Don't store default values

### 2. Optimize Cascade Resolution
- Use `getAllEffectiveValues()` once, not per attribute
- Cache effective values in component state if needed
- Don't recalculate on every render

### 3. Batch Block Updates
- Use batch update utilities for theme changes
- Update multiple blocks in single operation
- Show notification after batch update

---

## Testing

### Automated Tests
```bash
node tools/test-theme-system.js
```

**Coverage:**
- Delta calculation
- Theme application
- Customization detection
- Cascade resolution
- Complete workflow

### Manual Tests
1. Create theme
2. Apply theme
3. Customize block
4. Update theme
5. Delete theme
6. Reset customizations
7. Switch themes

---

## Related Documentation

- `PHASE_7_COMPLETE.md` - Phase 7 implementation details
- `PHASE_7_ANALYSIS.md` - Detailed analysis
- `CLAUDE.md` - Project architecture
- `docs/architecture/theme-system.md` - Theme system architecture

---

**Last Updated:** Phase 7 Complete
**Tested With:** Flat/atomic attributes (kebab-case)
**Status:** Production-ready
