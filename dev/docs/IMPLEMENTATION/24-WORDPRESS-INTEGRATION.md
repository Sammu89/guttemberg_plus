# WordPress Libraries Integration

**How and why we use @wordpress/* packages**

---

## Design Rationale

### Why Use WordPress Libraries at All?

**Decision**: Selective integration (60-70% of code uses WP libraries)

**Why**:
- Reduces custom code (650 LOC saved, 10.6% reduction)
- Better WordPress compatibility (follows platform patterns)
- Automatic updates (security, features)
- Familiar API for WordPress developers

**What We Keep Custom**:
- Cascade resolver (performance critical, <5ms requirement)
- Theme system logic (business rules specific to our architecture)
- ARIA management (block-specific requirements)

### Why @wordpress/data for Themes (Not Custom Events)?

**Decision**: Use Redux store for theme CRUD, NOT custom event system

**Why**:
- Automatic UI updates on store changes
- Built-in async handling (apiFetch integration)
- Event isolation via separate state keys
- Less code (350 LOC saved)
- React hooks integration (useSelect/useDispatch)

**What We DON'T Use It For**: Cascade resolution (kept pure function for performance)

### Why @wordpress/components (Not Fully Custom UI)?

**Decision**: Use WP components for 60-70% of UI panels

**Why**:
- Consistent with WordPress admin design
- Automatic accessibility features
- Saves 540 LOC
- Familiar UX for WordPress users

**What We Keep Custom**:
- ThemeSelector (complex dropdown with custom variants)
- CustomizationWarning (workflow-specific dialogs)

**Reason for Custom**: These require business logic specific to our cascade/theme system that WP components don't provide

### Why @wordpress/a11y (Only speak())?

**Decision**: Use only for screen reader announcements, NOT ARIA management

**Why**:
- Simple announcements work well (saves 30 LOC)
- ARIA management must be custom (sync with visual state)
- Keyboard navigation is block-specific
- ID generation needs custom format (4-digit alphanumeric)

---

## Integration Summary

| Library | Usage | What We Use | What We DON'T Use |
|---------|-------|-------------|-------------------|
| @wordpress/scripts | Build system | Everything | N/A |
| @wordpress/data | Theme CRUD | Store for DB ops | Cascade resolution |
| @wordpress/components | UI panels | 60-70% of UI | Theme selector |
| @wordpress/a11y | Announcements | speak() only | ARIA management |
| @wordpress/element | React adapter | Everything | N/A |
| @wordpress/block-editor | Editor hooks | Standard hooks | N/A |

## 1. @wordpress/scripts

**Purpose**: Build system with webpack + babel + eslint

### What We Use

**Everything** - Full integration:
- Webpack configuration
- Babel transpilation (JSX → ES5)
- ESLint (WordPress coding standards)
- CSS extraction and minification
- Hot module reload
- Production optimization

### Custom Extensions

**CSS Variable Parser Loader**:
```javascript
// webpack.config.js
{
  test: /\.css$/,
  use: [
    ...defaultLoaders,
    {
      loader: './build-tools/css-vars-parser-loader.js',
      options: { outputPath: './php/css-defaults/' }
    }
  ]
}
```

**Multiple Entry Points**:
```javascript
entry: {
  'blocks/accordion/build/index': './blocks/accordion/src/index.js',
  'blocks/tabs/build/index': './blocks/tabs/src/index.js',
  'blocks/toc/build/index': './blocks/toc/src/index.js',
  'shared/build/index': './shared/src/index.js'
}
```

### Commands

```bash
npm start          # Development with hot reload
npm run build      # Production build (minified)
npm run lint:js    # ESLint check + fix
npm run lint:css   # CSS validation
npm run format     # Auto-format code
```

## 2. @wordpress/data

**Purpose**: Redux-based state management for themes

### What We Use

**Theme CRUD Operations Only**:

```javascript
import { useSelect, useDispatch } from '@wordpress/data';

// Read themes
const themes = useSelect(select =>
  select('gutenberg-blocks/themes').getThemes('accordion')
);

// Write themes
const { createTheme, updateTheme, deleteTheme } =
  useDispatch('gutenberg-blocks/themes');
```

**Store Structure**:
```javascript
{
  accordionThemes: { /* theme objects */ },
  tabsThemes: { /* theme objects */ },
  tocThemes: { /* theme objects */ },
  isLoading: false,
  error: null
}
```

### What We DON'T Use

**❌ Cascade Resolution**:
- Kept 100% custom for performance (<5ms requirement)
- Pure function in cascade-resolver.js
- No Redux integration

**❌ Block Attribute Management**:
- WordPress core handles via `setAttributes`
- No custom state for attributes

**Why**: Performance critical, must be <5ms per resolution

### Store Implementation

```javascript
// shared/src/data/store.js
const store = createReduxStore('gutenberg-blocks/themes', {
  reducer(state, action) {
    switch (action.type) {
      case 'SET_THEMES':
        return { ...state, [`${action.blockType}Themes`]: action.themes };
      case 'THEME_CREATED':
        // ...
    }
  },

  actions: {
    *loadThemes(blockType) {
      const themes = yield apiFetch({
        path: `/gutenberg-blocks/v1/themes/${blockType}`
      });
      return { type: 'SET_THEMES', blockType, themes };
    }
  },

  selectors: {
    getThemes(state, blockType) {
      return state[`${blockType}Themes`] || {};
    }
  }
});

register(store);
```

## 3. @wordpress/components

**Purpose**: UI components for inspector panels

### What We Use (60-70%)

**Layout Components**:
- `<PanelBody>` - Inspector panel sections
- `<PanelRow>` - Panel rows

**Input Components**:
- `<ColorPalette>` - Color picker
- `<RangeControl>` - Sliders (font size, spacing)
- `<SelectControl>` - Dropdowns (heading level, icon position)
- `<ToggleControl>` - Boolean toggles
- `<TextControl>` - Text inputs

**Example**:
```javascript
import { PanelBody, ColorPalette, RangeControl } from '@wordpress/components';

function ColorPanel({ effectiveValues, setAttributes }) {
  return (
    <PanelBody title="Colors">
      <ColorPalette
        value={effectiveValues.titleColor}
        onChange={(color) => setAttributes({ titleColor: color })}
      />

      <RangeControl
        label="Font Size"
        value={parseInt(effectiveValues.titleFontSize)}
        min={12}
        max={48}
        onChange={(size) => setAttributes({ titleFontSize: `${size}px` })}
      />
    </PanelBody>
  );
}
```

### What We DON'T Use (30-40%)

**Custom Components Needed**:

1. **ThemeSelector** - Complex dropdown with custom variants
```javascript
// Must show:
// - "Dark Mode" (original)
// - "Dark Mode (Custom)" (customized variant)
// - Create/update/delete/rename operations
```

2. **CustomizationWarning** - Workflow dialogs
```javascript
// Block-specific logic:
// - "Update theme will clear customizations"
// - "Reset modifications?" confirmation
```

**Why Custom**: These require business logic specific to our cascade/theme system that WP components don't provide.

### Wrapper Pattern

**Add Customization Badges**:
```javascript
function CustomizableControl({ attribute, value, effectiveValue, onChange }) {
  const isCustomized = value !== null;

  return (
    <div className="customizable-control">
      <RangeControl
        value={effectiveValue}
        onChange={onChange}
      />
      {isCustomized && <span className="badge">*</span>}
    </div>
  );
}
```

## 4. @wordpress/a11y

**Purpose**: Screen reader announcements

### What We Use (Minimal)

**speak() Function Only**:
```javascript
import { speak } from '@wordpress/a11y';

// Announce state changes
speak('Accordion expanded', 'polite');
speak('Theme updated successfully', 'assertive');
speak('Tab panel visible', 'polite');
```

**When to Use**:
- Theme operations (create, update, delete)
- Block state changes (expand/collapse)
- Form submissions
- Error messages

### What We DON'T Use

**❌ ARIA Attribute Management**:
- We sync ARIA manually with visual state
- Required for custom expand/collapse behavior
- Custom `aria-helpers.js` utility

**❌ Focus Management**:
- Custom keyboard navigation
- Focus must stay on button (WAI-ARIA requirement)
- Custom `keyboard-nav.js` utility

**❌ ID Generation**:
- Custom 4-digit format required
- `generateUniqueId('acc')` → `acc-3a7k`
- Custom `id-generator.js` utility

**Why**: Block-specific requirements that @wordpress/a11y doesn't handle.

## 5. @wordpress/element

**Purpose**: React adapter for WordPress

### What We Use (Everything)

Standard React hooks via WP adapter:
- `useState` - Local state
- `useEffect` - Side effects
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized values
- `useRef` - DOM references

```javascript
import { useState, useEffect } from '@wordpress/element';

function Edit({ attributes, setAttributes }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load themes on mount
  }, []);

  return <div>...</div>;
}
```

## 6. @wordpress/block-editor

**Purpose**: Block editor hooks and components

### What We Use

**Standard Hooks**:
- `useBlockProps` - Block wrapper props
- `InspectorControls` - Sidebar panels
- `RichText` - Editable text (for titles/content)
- `BlockControls` - Toolbar controls

```javascript
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';

function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        {/* Sidebar panels */}
      </InspectorControls>

      <div {...blockProps}>
        <RichText
          value={attributes.title}
          onChange={(title) => setAttributes({ title })}
        />
      </div>
    </>
  );
}
```

## LOC Savings

| Integration | LOC Saved | Replaced Custom Module |
|-------------|-----------|------------------------|
| @wordpress/data | 350 | theme-events.js, manual state mgmt |
| @wordpress/components | 540 | Custom ColorPicker, FontSizePicker, sliders, toggles |
| @wordpress/a11y | 30 | Custom screen reader announcements |
| @wordpress/scripts | +270 | New (build system) |
| **Net Savings** | **650 LOC** | 10.6% reduction |

## Performance Impact

**Cascade Resolution**: <5ms (kept custom, no impact)

**Theme Operations**:
- Load: <50ms (apiFetch + Redux)
- Create/Update: <500ms (includes DB write)
- Switch: <100ms (attribute update only)

**Build Time**:
- Development: <2s hot reload
- Production: <30s full build

## Rollback Strategy

If integration issues occur:

**Tier 1** (1-2 hours):
- Remove @wordpress/a11y, restore custom announcements

**Tier 2** (1-2 days):
- Selectively revert @wordpress/components (keep layout, replace inputs)

**Tier 3** (2-3 days):
- Remove @wordpress/data, restore theme-events.js

**Total Risk Window**: 3-5 days worst-case
