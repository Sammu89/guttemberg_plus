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

**Output**: Updated theme, block uses clean theme

```javascript
const snapshot = getThemeableSnapshot(attributes, excludeList);
const deltas = calculateDeltas(snapshot, allDefaults, excludeList);
await updateTheme('accordion', 'Corporate Blue', deltas);

// Clear cache
setAttributes({ customizationCache: {} });
```

### 3. Delete Theme

**Input**: Block type, theme name

**Process**:
1. Validate theme exists
2. Remove from database
3. **Blocks using deleted theme fall back to "Default"**

**Output**: Theme removed

```javascript
await deleteTheme('accordion', 'Corporate Blue');
setAttributes({ currentTheme: '' }); // Fall back to Default
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

## Performance Considerations

### Caching

**JavaScript**: Themes loaded once on editor mount, cached in Redux store

**customizationCache**: Auto-updates on every attribute change (complete snapshot for safety)

### Optimization

**Theme Switch**: Instant (just updates currentTheme attribute)

**Theme Create/Update**: <500ms target (includes delta calculation + database write)

**Delta Calculation**: <5ms (lightweight comparison operation)

---

**Document Version**: 2.0 (Simplified Architecture)
**Last Updated**: 2025-11-17
**Part of**: WordPress Gutenberg Blocks Documentation Suite
