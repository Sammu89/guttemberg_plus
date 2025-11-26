# Quick Reference Tables

**Purpose**: Fast lookups for attributes, API functions, and common patterns.

---

## Shared Attributes (All Blocks)

### Color Attributes
| Attribute | Type | Default | Cascade |
|-----------|------|---------|---------|
| `titleColor` | string | `null` | ✓ |
| `titleBackgroundColor` | string | `null` | ✓ |
| `contentColor` | string | `null` | ✓ |
| `contentBackgroundColor` | string | `null` | ✓ |
| `borderColor` | string | `null` | ✓ |
| `iconColor` | string | `null` | ✓ |

### Typography Attributes
| Attribute | Type | Default | Cascade |
|-----------|------|---------|---------|
| `titleFontSize` | string | `null` | ✓ |
| `titleFontFamily` | string | `null` | ✓ |
| `titleFontWeight` | number | `null` | ✓ |
| `titleLineHeight` | number | `null` | ✓ |
| `contentFontSize` | string | `null` | ✓ |
| `contentFontFamily` | string | `null` | ✓ |
| `contentFontWeight` | number | `null` | ✓ |
| `contentLineHeight` | number | `null` | ✓ |

### Spacing Attributes
| Attribute | Type | Default | Cascade |
|-----------|------|---------|---------|
| `titlePadding` | object | `null` | ✓ |
| `contentPadding` | object | `null` | ✓ |
| `borderWidth` | string | `null` | ✓ |
| `borderRadius` | string | `null` | ✓ |

### Icon Attributes (Accordion/Tabs)
| Attribute | Type | Default | Cascade |
|-----------|------|---------|---------|
| `showIcon` | boolean | `null` | ✓ |
| `iconTypeClosed` | string | `"▾"` | ✓ |
| `iconTypeOpen` | string | `"none"` | ✓ |
| `iconPosition` | string | `null` | ✓ |
| `iconSize` | string | `null` | ✓ |
| `iconRotation` | number | `180` | ✓ |

### Heading Attributes
| Attribute | Type | Default | Cascade |
|-----------|------|---------|---------|
| `headingLevel` | string | `"none"` | ✓ |

### Meta Attributes (NOT cascaded)
| Attribute | Type | Default | Purpose |
|-----------|------|---------|---------|
| `currentTheme` | string | `""` | Active theme name |
| `customizations` | object | `{}` | Block-level overrides |
| `customizationCache` | object | `{}` | Session customizations |
| `uniqueId` | string | auto | Block identifier |

---

## Value Resolution (Simplified Architecture)

### How Values Work

**Edit Components**: Attributes are the source of truth
```javascript
const effectiveValues = attributes; // Direct source
// What you see in sidebar = what's stored in block
```

**Theme System**: Deltas stored, merged with defaults for comparison
```javascript
// Defaults from schema
const defaults = { titleColor: "#333", titleFontSize: 16 };

// Theme stores only deltas
const theme = { values: { titleColor: "#ffffff" } }; // titleFontSize omitted (uses default)

// Expected values for comparison
const expectedValues = applyDeltas(defaults, theme.values);
// Result: { titleColor: "#ffffff", titleFontSize: 16 }

// Customization detection
const isCustomized = attributes.titleColor !== expectedValues.titleColor;
```

### Example 1: Fresh Block (No Theme)
```javascript
// Block loads with empty attributes
attributes = {}

// Expected values = defaults
expectedValues = { titleColor: "#333", titleFontSize: 16, ... }

// Sidebar shows defaults
// isCustomized = false
```

### Example 2: Block with Theme
```javascript
// Block with "Dark Mode" theme selected
attributes = { currentTheme: "Dark Mode", titleColor: "#ffffff", titleFontSize: 16 }

// Theme deltas
theme.values = { titleColor: "#ffffff" }

// Expected values
expectedValues = { titleColor: "#ffffff", titleFontSize: 16, ... }

// Attributes match expected
// isCustomized = false
```

### Example 3: Block with Customizations
```javascript
// User customized title color to red
attributes = { currentTheme: "Dark Mode", titleColor: "#ff0000", titleFontSize: 16 }

// Expected values (from theme + defaults)
expectedValues = { titleColor: "#ffffff", titleFontSize: 16, ... }

// titleColor differs from expected
// isCustomized = true
// Dropdown shows "Dark Mode (customized)"
```

---

## Theme System API

### Store Selectors (useSelect)
```javascript
import { useSelect } from '@wordpress/data';

const themes = useSelect(select =>
  select('gutenberg-blocks/themes').getThemes(blockType)
);

const theme = useSelect(select =>
  select('gutenberg-blocks/themes').getTheme(blockType, themeName)
);

const isLoading = useSelect(select =>
  select('gutenberg-blocks/themes').isLoading()
);
```

### Store Actions (useDispatch)
```javascript
import { useDispatch } from '@wordpress/data';

const { createTheme, updateTheme, deleteTheme, renameTheme } =
  useDispatch('gutenberg-blocks/themes');

// Create theme (complete snapshot)
await createTheme('accordion', 'My Theme', effectiveValues);

// Update theme
await updateTheme('accordion', 'My Theme', updatedValues);

// Delete theme
await deleteTheme('accordion', 'My Theme');

// Rename theme
await renameTheme('accordion', 'Old Name', 'New Name');
```

### Delta Calculator Utilities
```javascript
import { calculateDeltas, applyDeltas, getThemeableSnapshot } from '@shared';

// Calculate deltas for theme storage
const deltas = calculateDeltas(snapshot, defaults, excludeList);
// Returns only attributes that differ from defaults

// Apply theme deltas to get expected values
const expectedValues = applyDeltas(defaults, theme.values);
// Merges defaults + theme deltas

// Get snapshot of current state
const snapshot = getThemeableSnapshot(attributes, excludeList);
// Extracts themeable attributes (excludes meta/structural)
```

### Cascade Resolver (Save Components Only)
```javascript
import { getAllEffectiveValues } from '@shared';

// Used ONLY in save.js for 2-tier fallback (attributes → defaults)
// Themes resolved server-side via CSS classes
const effectiveValues = getAllEffectiveValues(
  attributes,      // Block attributes
  {},              // Empty theme (resolved server-side)
  defaults         // Defaults from schema
);
```

---

## Database Schema

### Theme Storage (Delta-Based)
```php
// WordPress options table
$option_name = 'accordion_themes'  // or 'tabs_themes', 'toc_themes'
$option_value = [
  'Default' => [
    'values' => []  // Empty deltas = use all defaults
  ],
  'Dark Mode' => [
    'values' => [
      'titleColor' => '#ffffff',           // Delta from default
      'titleBackgroundColor' => '#2c2c2c'  // Delta from default
      // Other attributes omitted = use defaults
    ]
  ]
]
```

### Block Attributes (Post Content)
```json
{
  "blockName": "gutenberg-blocks/accordion",
  "attrs": {
    "currentTheme": "Dark Mode",
    "accordionId": "acc-a7b3",
    "titleColor": "#ff0000",
    "titleFontSize": 16,
    "titleBackgroundColor": "#2c2c2c"
  }
}
```
**Note**: Attributes store direct values (not nested in customizations object). What you see in sidebar = what's in attributes.

---

## Session Cache Pattern

### React Component Pattern
```javascript
// Session-only cache (React state, per-theme snapshots)
const [sessionCache, setSessionCache] = useState({
  "": { titleColor: "#ff0000", ... },           // No theme customizations
  "Dark Mode": { titleColor: "#ff0000", ... }   // Dark Mode customizations
});

// Auto-update cache on attribute changes (useEffect)
useEffect(() => {
  const snapshot = getThemeableSnapshot(attributes, excludeList);
  const currentThemeKey = attributes.currentTheme || '';

  // Only update if customizations exist
  const hasCustomizations = Object.keys(snapshot).some(key => {
    return snapshot[key] !== expectedValues[key];
  });

  if (hasCustomizations) {
    setSessionCache(prev => ({
      ...prev,
      [currentThemeKey]: snapshot
    }));
  }
}, [attributes, expectedValues]);

// Block attributes (persistent - what's in sidebar)
attributes = {
  currentTheme: "Dark Mode",
  titleColor: "#ff0000",
  titleFontSize: 16,
  // Direct values, no separate customizations object
}

// On customization (direct attribute update)
setAttributes({ titleColor: "#ff0000" });
// Session cache auto-updates via useEffect
```

---

## WordPress Libraries Usage

| Library | Purpose | Where Used |
|---------|---------|------------|
| `@wordpress/data` | Theme CRUD only | store.js, Edit components |
| `@wordpress/components` | UI panels (60-70%) | All inspector panels |
| `@wordpress/scripts` | Build system | webpack config |
| `@wordpress/a11y` | Screen reader announcements | Theme operations |
| `@wordpress/element` | React adapter | All components |
| `@wordpress/block-editor` | Block editor hooks | Edit components |

**NOT used for**: Cascade resolution, theme storage logic, customization cache

---

## Performance Budgets

| Operation | Budget | Measurement |
|-----------|--------|-------------|
| Cascade resolution | <5ms | `getAllEffectiveValues()` |
| Theme switch | <100ms | From click to UI update |
| Theme create | <500ms | Including DB write |
| Page load (3 blocks) | <50ms | Theme loading |

---

## File Structure Reference

```
src/
├── shared/
│   ├── theme-system/
│   │   ├── cascade-resolver.js     PURE FUNCTION (no Redux)
│   │   └── theme-manager.js        Thin wrapper over store
│   ├── data/
│   │   └── store.js                @wordpress/data store
│   ├── components/
│   │   ├── ThemeSelector.js
│   │   ├── ColorPanel.js
│   │   └── TypographyPanel.js
│   ├── attributes/
│   │   ├── color-attributes.js
│   │   ├── typography-attributes.js
│   │   └── meta-attributes.js
│   └── utils/
│       ├── id-generator.js
│       └── aria-helpers.js
├── blocks/
│   ├── accordion/
│   │   ├── edit.js
│   │   ├── save.js
│   │   └── accordion.css
│   ├── tabs/
│   └── toc/
└── php/
    ├── theme-storage.php
    ├── theme-rest-api.php
    └── css-defaults/
        ├── accordion-defaults.php
        ├── tabs-defaults.php
        └── toc-defaults.php
```

---

## Common Patterns

### Loading Themes Before Render
```javascript
const themes = useSelect(select =>
  select('gutenberg-blocks/themes').getThemes('accordion')
);

if (!themes) {
  return <Spinner />;
}

// Now safe to render
```

### Getting Effective Values for UI
```javascript
const effectiveValues = getAllEffectiveValues(
  attributes,
  themes[attributes.currentTheme],
  window.accordionDefaults
);

// Use effectiveValues in UI panels to show current values
```

### Clearing Customizations After Theme Update
```javascript
await updateTheme('accordion', themeName, newValues);

// Clear customizations since theme changed
setAttributes({ customizations: {} });
```

---

## Keyboard Navigation (Accordion/Tabs)

| Key | Action |
|-----|--------|
| `Tab` | Move to next item |
| `Shift+Tab` | Move to previous item |
| `Enter` / `Space` | Toggle item |
| `Home` | First item |
| `End` | Last item |
| `ArrowDown` / `ArrowRight` | Next item |
| `ArrowUp` / `ArrowLeft` | Previous item |

---

## ARIA Attributes

### Accordion
```html
<button
  role="button"
  aria-expanded="true|false"
  aria-controls="panel-{id}"
  id="header-{id}">

<div
  role="region"
  aria-labelledby="header-{id}"
  id="panel-{id}">
```

### Tabs
```html
<div role="tablist" aria-label="{label}">
  <button
    role="tab"
    aria-selected="true|false"
    aria-controls="panel-{id}"
    id="tab-{id}">

<div
  role="tabpanel"
  aria-labelledby="tab-{id}"
  id="panel-{id}">
```

### TOC
```html
<nav role="navigation" aria-label="Table of Contents">
  <ul>
    <li><a href="#{id}">Heading</a></li>
  </ul>
</nav>
```

---

## Testing Checklist

### Event Isolation
- [ ] Accordion theme changes don't affect Tabs
- [ ] Tabs theme changes don't affect TOC
- [ ] TOC theme changes don't affect Accordion

### Cascade Performance
- [ ] `getAllEffectiveValues()` < 5ms
- [ ] Theme switch < 100ms
- [ ] No cascade resolution on render (cache results)

### Theme Operations
- [ ] Create theme saves complete snapshot
- [ ] Update theme clears customizations
- [ ] Delete theme falls back to Default
- [ ] Rename theme preserves all blocks using it

### CustomizationCache
- [ ] Survives theme switching
- [ ] Shows in dropdown as "(Custom)"
- [ ] Only active customizations persist on save
- [ ] Reset button clears session cache

### Accessibility
- [ ] Unique IDs per block
- [ ] Correct ARIA attributes
- [ ] Keyboard navigation works
- [ ] Screen reader announcements

---

## TOC Exclusion Rules

```javascript
// TOC blocks automatically exclude:
1. Their own title heading
2. Other TOC blocks' headings
3. Headings with CSS class specified in settings (e.g., .toc-exclude)

// Implementation
const isInsideTOC = heading.closest('.wp-block-gutenberg-toc');
const hasExclusionClass = heading.classList.contains(settings.excludeClass);

if (isInsideTOC || hasExclusionClass) {
  // Skip this heading
}
```

---

## Unique ID Generation

```javascript
// 4-digit alphanumeric (36^4 = 1,679,616 combinations)
function generateUniqueId(prefix = 'acc') {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${id}`;
}

// Usage
const uniqueId = generateUniqueId('toc'); // "toc-a7b3"
```
