# Theme System Architecture

**Single source of truth for theme storage, operations, and data structures**

---

## Design Rationale

### Why Complete Snapshots (Not Partial Themes)?

**Decision**: All saved themes contain explicit values for ALL attributes

**Why**:
- Self-contained (no dependency on CSS state at creation time)
- Portable (can export/import themes)
- Predictable (theme always looks the same)
- Simpler cascade (no null propagation in saved themes)

**Trade-off**: Larger database storage, but negligible (~5KB per theme)

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
- Skips theme tier entirely in cascade (better performance)
- No database storage needed (smaller footprint)
- CSS changes propagate immediately to Default-themed blocks
- True "CSS as single source of truth" for uncustomized blocks
- Consistent with attribute philosophy (no theme = cascade to CSS)

**Implementation**:
- UI shows "Default" label for empty string value
- Empty string → cascade skips Tier 2 (theme) → uses Tier 1 (CSS defaults)
- More efficient than checking nulls in a stored theme object

**Behavior**: User can customize → creates block-level customizations, but cannot save modifications to create a "Default" theme

---

## Theme Data Structure

### Complete Snapshot Principle

Themes are **complete, self-contained snapshots** containing explicit values for ALL customizable attributes.

**Exception**: "Default" is represented by empty string (`currentTheme = ''`) with no database storage

```javascript
{
  "Dark Mode": {
    name: "Dark Mode",
    titleColor: "#ffffff",
    titleBackgroundColor: "#2c2c2c",
    titleFontSize: "18px",
    // ... ALL 40+ attributes with explicit values
    created: "2025-01-15 10:30:00",
    modified: "2025-01-15 10:30:00"
  }
  // No "Default" object stored in database
  // Empty string ("") represents Default in block attributes
}
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

**Purpose**: Allows blocks to read directly from CSS defaults by skipping theme tier

**How It Works**:
- Block has `currentTheme = ''` (empty string)
- Cascade resolver receives empty theme object (`themes['']` = `undefined`)
- Tier 2 (theme) is skipped entirely
- Cascade falls through to Tier 1 (CSS defaults)

**When CSS Changes**: All Default-themed blocks automatically reflect changes (on page refresh)

**Customization**: Can customize → creates block-level customizations (Tier 3), but cannot save as "Default" theme

## Theme Operations

### 1. Create Theme

**Input**: Block type, theme name, complete snapshot values

**Process**:
1. Resolve ALL effective values via cascade
2. Create complete snapshot (no `null` values)
3. Validate theme name (alphanumeric + spaces/dashes)
4. Check for duplicates
5. Save to database with timestamps

**Output**: New theme in `{blockType}_themes`

```javascript
await createTheme('accordion', 'Corporate Blue', effectiveValues);
```

### 2. Update Theme

**Input**: Block type, theme name, new values

**Process**:
1. Resolve ALL effective values
2. Replace theme with new complete snapshot
3. Update `modified` timestamp
4. **Clear all block-level customizations** for blocks using this theme

**Output**: Updated theme, blocks re-render with new values

```javascript
await updateTheme('accordion', 'Corporate Blue', newValues);
setAttributes({ customizations: {} }); // Clear overrides
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
// Blocks with currentTheme="Corporate Blue" now use "Default"
```

### 4. Rename Theme

**Input**: Block type, old name, new name

**Process**:
1. Validate both names
2. Check new name not duplicate
3. Update theme name in database
4. **Update currentTheme in ALL blocks using old name**

**Output**: Renamed theme, blocks continue working

```javascript
await renameTheme('accordion', 'Corporate Blue', 'Company Brand');
```

### 5. Switch Theme

**Input**: New theme name via block attributes

**Process**:
1. Update `currentTheme` attribute
2. Cascade resolver automatically uses new theme
3. UI re-renders with new effective values

**No Database Write**: Theme switch only updates block attributes in post content

```javascript
setAttributes({ currentTheme: 'Dark Mode' });
```

## Theme Not Found Behavior

**Scenario**: Block has `currentTheme = "Missing Theme"` but theme doesn't exist

**Fallback**:
1. Set `currentTheme = ""`
2. Cascade falls through theme tier to CSS defaults
3. Block renders with Default appearance

**User Notification**: "Theme 'Missing Theme' not found, using Default"

## Database Schema

### Theme Object Structure

```php
array(
  'name' => 'Dark Mode',
  'values' => array(
    'titleColor' => '#ffffff',
    'titleBackgroundColor' => '#2c2c2c',
    'titleFontSize' => '18',
    // ... all attributes
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

## Theme CSS Generation

### Output Location

Generated CSS in `<head>` section via `php/theme-css-generator.php`:

```css
/* Theme: Dark Mode */
.accordion-theme-dark-mode {
  border-width: var(--custom-border-width, 1px);
  border-color: var(--custom-border-color, #2c2c2c);
}

.accordion-theme-dark-mode .accordion-title {
  color: var(--custom-title-color, #ffffff);
  background-color: var(--custom-title-bg, #2c2c2c);
  font-size: var(--custom-title-size, 18px);
}
```

### Generation Process

**PHP Implementation** (`php/theme-css-generator.php`):
1. Scans post content for all blocks on current page
2. Extracts unique `currentTheme` values
3. Loads themes from database (only used themes)
4. Maps attribute names to CSS variable names (explicit mappings)
5. Generates CSS classes with fallback pattern
6. Outputs in `<head>` via `wp_enqueue_scripts` hook

**Performance**:
- Only themes used on current page are generated (~2-3KB per theme)
- Cached with version-based invalidation
- Better than inline styles (shared classes vs repeated styles)

### Attribute-to-CSS-Variable Mapping

**Critical**: Block attributes use different names than CSS variables

**Examples**:
```php
// Accordion mappings
'titleBackgroundColor' => 'title-bg'           // --accordion-title-bg
'contentBackgroundColor' => 'content-bg'       // --accordion-content-bg
'titleFontSize' => 'title-font-size'          // --accordion-title-font-size

// Tabs mappings
'titleColor' => 'button-color'                 // --tabs-button-color
'activeTabColor' => 'active-button-color'      // --tabs-active-button-color

// TOC mappings
'wrapperBackgroundColor' => 'wrapper-background-color'  // --toc-wrapper-background-color
```

**Implementation**: `guttemberg_plus_map_attribute_to_css_var()` function with 106 explicit mappings across all block types

### Fallback Pattern

Two-level CSS variable pattern:
1. Inline `--custom-*` variables (block-level customizations - Tier 3)
2. Theme CSS in `<head>` (theme values - Tier 2)
3. CSS defaults (accordion.css `:root` variables - Tier 1)

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
- All required attributes present
- Correct data types (string, number, object)
- Color values: hex, rgb, rgba, named
- Numeric values: valid numbers with optional units

## Event Isolation

**Critical Rule**: Theme operations for one block type DO NOT affect other block types

**Example**:
```javascript
// Create accordion theme
await createTheme('accordion', 'Test', values);

// Tabs themes unchanged
const tabsThemes = getThemes('tabs');
// 'Test' does NOT appear in tabsThemes
```

**Implementation**: Separate Redux store keys + separate database options

## Performance Considerations

### Caching

**PHP**: Theme CSS cached in transients with version-based invalidation

**JavaScript**: Themes loaded once on editor mount, cached in Redux store

### Optimization

**Theme Switch**: <100ms target (no database write)

**Theme Create/Update**: <500ms target (includes database write)

**Multiple Blocks**: Shared theme CSS (one class, many blocks)
