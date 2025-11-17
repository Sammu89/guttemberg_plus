# The 3-Tier Cascade System

**Purpose**: Single comprehensive reference for how value resolution works
**Read Time**: 10 minutes
**Critical For**: Understanding how styling flows through the system

---

## The One and Only Cascade Explanation

This is the **definitive explanation** of the cascade system. All other references point here.

---

## Visual Model

```
┌─────────────────────────────────────────────────┐
│  TIER 3: Block Customizations (Highest)         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Storage: Block attributes in post content       │
│  Output:  Inline CSS variables (style="...")     │
│  Example: style="--custom-title-color: #ff0000" │
└─────────────────────────────────────────────────┘
                     ↑
              (overrides if defined)
                     ↑
┌─────────────────────────────────────────────────┐
│  TIER 2: Theme Values (Medium)                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Storage: Database (wp_options table)           │
│  Output:  CSS classes in <head>                 │
│  Example: .accordion-theme-dark {...}           │
└─────────────────────────────────────────────────┘
                     ↑
              (overrides if defined)
                     ↑
┌─────────────────────────────────────────────────┐
│  TIER 1: CSS Defaults (Lowest - Fallback)       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Storage: CSS file (:root variables)            │
│  Output:  CSS variables in stylesheet           │
│  Example: --accordion-default-title-color       │
└─────────────────────────────────────────────────┘
```

---

## The Resolution Algorithm

**For each attribute** (e.g., `titleColor`):

```
1. Check Tier 3 (Block Customizations)
   ├─ If defined (not null/undefined) → USE IT and STOP
   └─ Else continue to Tier 2

2. Check Tier 2 (Theme Values)
   ├─ If defined (not null/undefined) → USE IT and STOP
   └─ Else continue to Tier 1

3. Check Tier 1 (CSS Defaults)
   ├─ If defined (not null/undefined) → USE IT and STOP
   └─ Else return null (shouldn't happen with proper defaults)
```

**Critical**: First match wins. **NO MERGING**. As soon as a value is found, stop checking.

---

## Concrete Example

### Scenario

User has:
- Accordion block with Dark Mode theme
- Customized title color to red

### Data State

```javascript
// Tier 3: Block Attributes
attributes = {
  titleColor: '#ff0000',  // ← Explicit customization
  titleFontSize: null     // ← Not customized
}

// Tier 2: Theme (from database)
theme = {
  titleColor: '#ffffff',     // ← Will be ignored
  titleFontSize: 18,         // ← Will be used
  titleBackgroundColor: '#222'
}

// Tier 1: CSS Defaults (from accordion.css)
cssDefaults = {
  titleColor: '#333333',          // ← Will be ignored
  titleFontSize: 16,              // ← Will be ignored
  titleBackgroundColor: '#f5f5f5' // ← Will be used
}
```

### Resolution Results

```javascript
// titleColor resolution:
Step 1: Check Tier 3 → '#ff0000' (defined) → USE IT, STOP
Effective Value: '#ff0000'

// titleFontSize resolution:
Step 1: Check Tier 3 → null (not defined) → Continue
Step 2: Check Tier 2 → 18 (defined) → USE IT, STOP
Effective Value: 18

// titleBackgroundColor resolution:
Step 1: Check Tier 3 → undefined (not defined) → Continue
Step 2: Check Tier 2 → '#222' (defined) → USE IT, STOP
Effective Value: '#222'
```

### Final Output

```html
<div class="accordion accordion-theme-dark-mode"
     style="--custom-title-color: #ff0000;">
  <!-- Only explicit customization in inline style -->
  <!-- Theme provides titleBackgroundColor via CSS class -->
  <!-- titleFontSize also from theme -->
</div>
```

---

## Tier Details

### Tier 1: CSS Defaults (Base Fallback)

**What**: Default values defined in CSS files as `:root` variables

**Files**:
- Accordion: `assets/css/accordion.css`
- Tabs: `assets/css/tabs.css`
- TOC: `assets/css/toc.css`

**Example**:
```css
:root {
  --accordion-default-title-color: #333333;
  --accordion-default-title-size: 16px;
  --accordion-default-border-width: 1px;
}
```

**How it works**:
1. PHP parses CSS file on first request
2. Caches values in transient with file modification time
3. JavaScript receives via `wp_localize_script`
4. Available as `window.accordionDefaults`

**When used**: Only when no theme and no block customization

### Tier 2: Theme Values (Reusable Templates)

**What**: User-created themes stored in database

**Storage**: `wp_options` table
- Accordion: `accordion_themes`
- Tabs: `tabs_themes`
- TOC: `toc_themes`

**Structure**:
```php
array(
  'theme-id-abc' => array(
    'name' => 'Dark Mode',
    'values' => array(
      'titleColor' => '#ffffff',
      'titleFontSize' => 18,
      // ... ALL attributes with explicit values
    )
  )
)
```

**Output**: Generated as CSS in `<head>`:
```css
.accordion-theme-dark-mode {
  border-width: var(--custom-border-width, 1px);
}
.accordion-theme-dark-mode .accordion-title {
  color: var(--custom-title-color, #ffffff);
  font-size: var(--custom-title-size, 18px);
}
```

**When used**: When block has `currentTheme` attribute set

### Tier 3: Block Customizations (Per-Block Overrides)

**What**: Inline attribute values on specific blocks

**Storage**: Block attributes in post content

**Output**: Inline CSS variables:
```html
<div style="--custom-title-color: #ff0000; --custom-title-size: 20px;">
```

**When used**: When user customizes individual block

**Important**: Only **explicit** customizations output (not all attributes)

---

## Key Properties

### 1. First Match Wins

```javascript
// Once a value is found, stop checking other tiers
if (attributes.titleColor !== null) {
  return attributes.titleColor; // Stop here
}
// Don't check theme or CSS defaults
```

### 2. No Merging

```javascript
// WRONG: Don't merge objects
titlePadding = {
  ...cssDefaults.titlePadding,
  ...theme.titlePadding,
  ...attributes.titlePadding
}

// RIGHT: Use first complete object
if (attributes.titlePadding !== null) {
  return attributes.titlePadding; // Complete object
}
if (theme.titlePadding !== undefined) {
  return theme.titlePadding; // Complete object
}
return cssDefaults.titlePadding; // Complete object
```

### 3. Independent Per-Attribute

Each attribute resolves independently:

```javascript
// These resolve separately
titleColor → Tier 3 (#ff0000)
titleFontSize → Tier 2 (18)
titleBackgroundColor → Tier 2 (#222)
```

### 4. Works for All Types

Same cascade for:
- Strings: `'#ff0000'`, `'bold'`, `'left'`
- Numbers: `16`, `180`, `12`
- Booleans: `true`, `false`
- Objects: `{ top: 12, right: 12, bottom: 12, left: 12 }`

**No special cases for booleans**:
```javascript
// showIcon follows same cascade as titleColor
if (attributes.showIcon !== null && attributes.showIcon !== undefined) {
  return attributes.showIcon; // true or false
}
```

---

## Implementation Reference

### Pure Function (cascade-resolver.js)

```javascript
/**
 * Get effective value for single attribute
 * <5ms performance target
 */
export function getEffectiveValue(name, attributes, theme, defaults) {
  // Tier 3: Block customization
  if (attributes[name] !== null && attributes[name] !== undefined) {
    return attributes[name];
  }

  // Tier 2: Theme value
  if (theme && theme[name] !== null && theme[name] !== undefined) {
    return theme[name];
  }

  // Tier 1: CSS default
  if (defaults && defaults[name] !== null && defaults[name] !== undefined) {
    return defaults[name];
  }

  // Nothing found
  return null;
}

/**
 * Get all effective values
 */
export function getAllEffectiveValues(attributes, theme, defaults) {
  const effectiveValues = {};

  // Get all attribute names from all sources
  const allNames = new Set([
    ...Object.keys(attributes || {}),
    ...Object.keys(theme || {}),
    ...Object.keys(defaults || {})
  ]);

  // Resolve each
  for (const name of allNames) {
    effectiveValues[name] = getEffectiveValue(name, attributes, theme, defaults);
  }

  return effectiveValues;
}
```

### Usage in Editor

```javascript
import { getAllEffectiveValues } from '@shared/theme-system/cascade-resolver';

function Edit({ attributes, setAttributes }) {
  const blockType = 'accordion';
  const cssDefaults = window.accordionDefaults || {};
  const currentTheme = themes[attributes.currentTheme];

  // Resolve effective values
  const effectiveValues = getAllEffectiveValues(
    attributes,
    currentTheme,
    cssDefaults
  );

  // ALWAYS use effectiveValues in UI, NEVER raw attributes
  return (
    <ColorPicker
      value={effectiveValues.titleColor} // ✅ Correct
      onChange={(color) => setAttributes({ titleColor: color })}
    />
  );
}
```

---

## CSS Implementation

### Two-Level CSS Variable Pattern

```css
/* Tier 1: CSS Defaults */
:root {
  --accordion-default-title-color: #333333;
}

/* Tier 2: Theme (generated in <head>) */
.accordion-theme-dark-mode .accordion-title {
  color: var(--custom-title-color, #ffffff);
  /*      ↑ Tier 3 override   ↑ Tier 2 fallback */
}

/* Tier 3: Inline (on element) */
/* Automatically wins via CSS specificity */
```

### How Browser Resolves

```html
<div class="accordion-theme-dark-mode"
     style="--custom-title-color: #ff0000;">
  <div class="accordion-title">Title</div>
</div>
```

Browser cascade:
1. Check inline `--custom-title-color` → `#ff0000` (found, use it)
2. Theme fallback `#ffffff` ignored
3. CSS default `#333333` ignored

**Result**: Title color is `#ff0000`

---

## Null vs Undefined

### In Attributes

```javascript
attributes = {
  titleColor: null,      // NOT customized (use cascade)
  titleColor: undefined, // NOT customized (use cascade)
  titleColor: '#ff0000'  // IS customized (use this value)
}
```

Both `null` and `undefined` mean "not customized" → continue to next tier.

### In Themes

Themes should **never** have null values (complete snapshot):

```javascript
// ✅ Correct: Theme has explicit values
theme = {
  titleColor: '#ffffff',
  titleFontSize: 18,
  showIcon: true
}

// ❌ Wrong: Theme has nulls
theme = {
  titleColor: '#ffffff',
  titleFontSize: null  // Don't do this
}
```

---

## Common Pitfalls

### ❌ Reading Raw Attributes in UI

```javascript
// WRONG
<ColorPicker value={attributes.titleColor} />
// Shows undefined when not customized
```

```javascript
// CORRECT
const effectiveValues = getAllEffectiveValues(...);
<ColorPicker value={effectiveValues.titleColor} />
// Always shows actual value
```

### ❌ Merging Tiers

```javascript
// WRONG
const finalValue = attributes.titleColor || theme.titleColor || defaults.titleColor;
// Works for simple cases but fails for booleans and zeros
```

```javascript
// CORRECT
return getEffectiveValue('titleColor', attributes, theme, defaults);
// Handles all types correctly
```

### ❌ Special-Casing Booleans

```javascript
// WRONG
if (attributes.showIcon) {
  return attributes.showIcon;
}
// Fails when showIcon is explicitly false
```

```javascript
// CORRECT
if (attributes.showIcon !== null && attributes.showIcon !== undefined) {
  return attributes.showIcon;
}
// Works for true, false, and null
```

---

## Testing Cascade

### Test Cases

```javascript
// Test 1: Block customization wins
attributes.titleColor = '#ff0000';
theme.titleColor = '#00ff00';
defaults.titleColor = '#333333';
// Expected: '#ff0000'

// Test 2: Theme wins when no block customization
attributes.titleColor = null;
theme.titleColor = '#00ff00';
defaults.titleColor = '#333333';
// Expected: '#00ff00'

// Test 3: Default wins when neither above
attributes.titleColor = null;
theme.titleColor = undefined;
defaults.titleColor = '#333333';
// Expected: '#333333'

// Test 4: Boolean handling
attributes.showIcon = false; // Explicit false
theme.showIcon = true;
// Expected: false (not true!)

// Test 5: Object handling
attributes.titlePadding = { top: 20, right: 20, bottom: 20, left: 20 };
theme.titlePadding = { top: 12, right: 12, bottom: 12, left: 12 };
// Expected: attributes.titlePadding (first complete object)
```

### Performance Test

```javascript
// Target: <5ms for getAllEffectiveValues()
const start = performance.now();
const effective = getAllEffectiveValues(attributes, theme, defaults);
const duration = performance.now() - start;

console.assert(duration < 5, 'Cascade too slow!');
```

---

## Workflow Examples

### Creating Customization

```
1. User changes title color in sidebar
   ↓
2. setAttributes({ titleColor: '#ff0000' })
   ↓
3. Cascade resolves:
   - Check attributes.titleColor → '#ff0000' (found)
   - Stop checking
   ↓
4. UI updates to show #ff0000
   ↓
5. isCustomized becomes true
```

### Switching Themes

```
1. User selects different theme
   ↓
2. Customizations saved to cache
   ↓
3. Attributes cleared (set to null)
   ↓
4. currentTheme updated
   ↓
5. Cascade resolves:
   - Check attributes.titleColor → null (continue)
   - Check theme.titleColor → '#ffffff' (found)
   - Stop checking
   ↓
6. UI updates to show #ffffff
```

### Updating Theme

```
1. User clicks "Update Theme"
   ↓
2. Collect all effective values
   ↓
3. Save to database (complete snapshot)
   ↓
4. Clear block customizations
   ↓
5. Cascade now resolves from theme tier
   ↓
6. Other blocks using theme update automatically
```

---

## Summary

### The Rules

1. **Check Tier 3 first** (block customizations)
2. **Then Tier 2** (theme values)
3. **Finally Tier 1** (CSS defaults)
4. **First match wins** (stop checking)
5. **No merging** (use complete value)
6. **All types same** (no special cases)

### The Implementation

- **Pure function** in cascade-resolver.js
- **<5ms performance** target
- **No side effects** (reads only)
- **No Redux integration** (kept separate)

### The Usage

- **Always** use `getAllEffectiveValues()` in UI
- **Never** read raw attributes directly
- **Always** pass all three tiers to resolver

---

**This is the definitive cascade reference. All other docs point here.**

---

**Document Version**: 1.0
**Last Updated**: 2025-10-17
**Part of**: WordPress Gutenberg Blocks Documentation Suite
