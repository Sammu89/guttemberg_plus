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

## Cascade Resolution Examples

### Example 1: Default Theme (CSS Pass-Through)
```javascript
// Block attributes
{ titleColor: null }

// Theme "Default"
{ titleColor: null }

// CSS :root
{ --title-color: "#333333" }

// Result: "#333333" ✓
```

### Example 2: Custom Theme
```javascript
// Block attributes
{ titleColor: null }

// Theme "Dark Mode"
{ titleColor: "#ffffff" }

// CSS :root
{ --title-color: "#333333" }

// Result: "#ffffff" ✓ (theme wins)
```

### Example 3: Block Override
```javascript
// Block attributes
{ titleColor: "#ff0000" }

// Theme "Dark Mode"
{ titleColor: "#ffffff" }

// CSS :root
{ --title-color: "#333333" }

// Result: "#ff0000" ✓ (block wins)
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

### Cascade Resolver (Pure Function)
```javascript
import { getAllEffectiveValues } from '@shared/theme-system/cascade-resolver';

// Get all effective values
const effectiveValues = getAllEffectiveValues(
  blockAttributes,      // Block-level customizations
  currentTheme,         // Theme object
  window.accordionDefaults  // CSS defaults
);

// Get single attribute
const titleColor = effectiveValues.titleColor;
```

---

## Database Schema

### Theme Storage
```php
// WordPress options table
$option_name = 'accordion_themes'  // or 'tabs_themes', 'toc_themes'
$option_value = [
  'Default' => [
    'titleColor' => null,
    'titleBackgroundColor' => null,
    // ... all attributes = null
  ],
  'Dark Mode' => [
    'titleColor' => '#ffffff',
    'titleBackgroundColor' => '#2c2c2c',
    // ... all attributes with explicit values
  ]
]
```

### Block Attributes (Post Content)
```json
{
  "blockName": "gutenberg-blocks/accordion",
  "attrs": {
    "currentTheme": "Dark Mode",
    "customizations": {
      "titleColor": "#ff0000"
    },
    "uniqueId": "acc-a7b3"
  }
}
```

---

## CustomizationCache Pattern

### React Component Pattern
```javascript
// React state (session-only)
const [sessionCustomizations, setSessionCustomizations] = useState({
  "Dark Mode": { titleColor: "#ff0000" },
  "Light Mode": { titleBackgroundColor: "#yellow" }
});

// Block attributes (persistent)
attributes: {
  currentTheme: "Dark Mode",
  customizations: { titleColor: "#ff0000" }
}

// On theme switch
const handleThemeSwitch = (newTheme) => {
  const cachedCustomizations = sessionCustomizations[newTheme] || {};
  setAttributes({
    currentTheme: newTheme,
    customizations: cachedCustomizations
  });
};

// On customization
const handleCustomization = (attr, value) => {
  setSessionCustomizations(prev => ({
    ...prev,
    [currentTheme]: {
      ...prev[currentTheme],
      [attr]: value
    }
  }));

  setAttributes({
    customizations: {
      ...attributes.customizations,
      [attr]: value
    }
  });
};
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
