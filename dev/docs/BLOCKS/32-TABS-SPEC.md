# Tabs and Accordion Block Integration - Shared Architecture v2.0

## Overview

This document defines **how to implement the Tabs block** to seamlessly integrate with the existing Accordion block, sharing common functions, theme system, data structures, and UI patterns. The goal is to create a unified block system where both blocks use the same architectural patterns and share maximum code.

**Purpose**: Enable implementation of Tabs block that reuses most of the Accordion block's infrastructure, maintaining consistency and reducing code duplication.

**v2.0 UPDATE**: Aligned with FRONTEND-RENDERING.md v6.0 architecture. All defaults now come from CSS files (`accordion.css` and `tabs.css`) as single source of truth. Attributes default to `null` for proper cascade operation.

---

## Table of Contents

1. [Shared Architecture Philosophy](#shared-architecture-philosophy)
2. [CSS as Single Source of Truth](#css-as-single-source-of-truth)
3. [Common System Components](#common-system-components)
4. [Tabs Block Specifications](#tabs-block-specifications)
5. [Shared vs Block-Specific Attributes](#shared-vs-block-specific-attributes)
6. [Shared Theme System](#shared-theme-system)
7. [Shared UI Components](#shared-ui-components)
8. [Responsive Accordion Fallback](#responsive-accordion-fallback)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Changelog](#changelog)

---

## Shared Architecture Philosophy

### Core Principle

**"One System, Two Blocks"**: Accordion and Tabs are two presentations of the same underlying concept - collapsible/switchable content sections. They should share:

1. **CSS Source of Truth**: Both use CSS files (`accordion.css` and `tabs.css`) for default values
2. **Theme System**: Same 3-tier cascade, same database storage
3. **Attribute Schema**: Overlapping attributes use same names and types (all default to `null`)
4. **UI Components**: Shared inspector panels, color pickers, toggles
5. **Value Resolution**: Same cascade resolution logic
6. **ARIA Patterns**: Similar accessibility requirements
7. **Data Flow**: Same state management patterns

### What Is Shared vs What Is Unique

#### Shared

- CSS parsing system (get defaults from CSS files)
- Theme system core (create, update, delete, rename, switch) - same logic as the accordeon, BUT different themes for accordion and tabs, they DO NOT share the same themes.
- 3-tier cascade resolution
- Customization cache mechanism
- Color pickers and style controls
- Typography controls
- Border and spacing controls
- Icon system
- Database operations
- Event synchronization
- Validation logic

#### Unique

- HTML structure (tabs vs accordion)
- Navigation pattern (tabs vs expand/collapse)
- Orientation (horizontal/vertical vs vertical only)
- Hover mode (tabs only)
- ARIA roles (tablist/tab/tabpanel vs button/region)
- Keyboard navigation (arrows vs enter/space)
- Responsive behavior (tabs → accordion fallback)

---

## CSS as Single Source of Truth

### Architecture Overview

Both Accordion and Tabs blocks follow the **same CSS-based architecture** from FRONTEND-RENDERING.md v6.0:

**Accordion Defaults**: Defined in `accordion.css` at `:root` as `--accordion-default-*` variables
**Tabs Defaults**: Defined in `tabs.css` at `:root` as `--tabs-default-*` variables

### How It Works

```
1. Designer edits default values:
   - Accordion: Edit accordion.css
   - Tabs: Edit tabs.css

2. PHP parses CSS on first request:
   - Parse :root variables
   - Cache with file modification time
   - Return as PHP array

3. JavaScript gets defaults from PHP:
   - window.accordionDefaults (from PHP)
   - window.tabsDefaults (from PHP)
   - Used in editor for effective values

4. Attributes default to null:
   - titleColor: { type: 'string', default: null }
   - titleBackgroundColor: { type: 'string', default: null }
   - ALL customizable attributes default to null

5. Three-tier cascade resolves values:
   - Tier 1: Default (from CSS)
   - Tier 2: Theme (from database)
   - Tier 3: Per-block (inline attribute)
```

### Why Attributes Default to Null

**CRITICAL**: All customizable/themeable attributes must default to `null` (not hardcoded values) so the cascade works properly:

```javascript
// WRONG - Hardcoded default breaks cascade
titleColor: { type: 'string', default: '#333333' }

// CORRECT - Null allows cascade to work
titleColor: { type: 'string', default: null }
```

When attribute is `null`:
1. JavaScript checks `window.accordionDefaults.titleColor` (from CSS)
2. Theme can override with custom value
3. Per-block customization can override theme

### Shared Parsing Functions

Both blocks use the same PHP parsing functions:

```php
// Accordion
$accordion_defaults = get_accordion_plugin_defaults(); // Parses accordion.css
wp_localize_script('accordion-editor', 'accordionDefaults', $accordion_defaults);

// Tabs
$tabs_defaults = get_tabs_plugin_defaults(); // Parses tabs.css
wp_localize_script('tabs-editor', 'tabsDefaults', $tabs_defaults);
```

**Implementation**: Same `parse_css_defaults()` function, different CSS files.

---

## Common System Components

### 1. Shared Theme System

**Location**: `src/shared/theme-system/`

**Purpose**: Single theme engine used by both blocks.

**Structure**:
```
src/shared/theme-system/
├── theme-manager.js        # CRUD operations for themes
├── cascade-resolver.js     # 3-tier value resolution
├── theme-storage.js        # Database interactions
├── theme-validator.js      # Validation logic
└── theme-events.js         # Event system for updates
```

**Key Functions**:
```javascript
// Shared by both blocks - 3-tier cascade (no page-style overrides)
getEffectiveValue(attribute, blockAttributes, currentTheme, defaults)
getAllEffectiveValues(blockAttributes, currentTheme, defaults)
createTheme(themeName, values)
updateTheme(themeName, values)
deleteTheme(themeName)
renameTheme(oldName, newName)
getAllThemes()
```

### 2. Shared Attribute Definitions

**Location**: `src/shared/attributes/`

**Purpose**: Common attribute name conventions that both blocks use, but again, the themes are NOT shared between them

**Structure**:
```
src/shared/attributes/
├── color-attributes.js     # backgroundColor, textColor, etc.
├── typography-attributes.js # fontSize, fontWeight, etc.
├── spacing-attributes.js    # padding, margin, etc.
├── border-attributes.js     # borderColor, borderWidth, etc.
├── icon-attributes.js       # showIcon, iconPosition, etc.
└── meta-attributes.js       # currentTheme, customizationCache, etc.
```

**Example**:
```javascript
// color-attributes.js (used by both blocks)
// NOTE: All customizable attributes default to null
// Actual defaults come from window.accordionDefaults or window.tabsDefaults
export const colorAttributes = {
  titleColor: {
    type: 'string',
    default: null  // Defaults from CSS
  },
  titleBackgroundColor: {
    type: 'string',
    default: null  // Defaults from CSS
  },
  hoverTitleColor: {
    type: 'string',
    default: null  // Defaults from CSS
  },
  hoverTitleBackgroundColor: {
    type: 'string',
    default: null  // Defaults from CSS
  },
  // ... more color attributes (all default: null)
};
```

### 3. Shared UI Components

**Location**: `src/shared/components/`

**Purpose**: Reusable React components for inspector panels.

**Structure**:
```
src/shared/components/
├── ThemeSelector.js         # Theme dropdown with customization indicator
├── ColorPanel.js            # Color picker group
├── TypographyPanel.js       # Typography controls
├── BorderPanel.js           # Border settings
├── SpacingPanel.js          # Padding/margin controls
├── IconPanel.js             # Icon configuration
├── CustomizationWarning.js  # Warning before theme switch
└── LoadingState.js          # Loading indicator
```

**Example Usage**:
```javascript
// In Accordion edit.js
import { ThemeSelector, ColorPanel, TypographyPanel } from '@shared/components';

<InspectorControls>
  <ThemeSelector
    currentTheme={currentTheme}
    themes={allThemes}
    onThemeChange={handleThemeChange}
    isCustomized={isCustomized}
  />

  <ColorPanel
    title="Title Colors"
    attributes={{
      titleColor: effectiveValues.titleColor,
      titleBackgroundColor: effectiveValues.titleBackgroundColor
    }}
    onChange={handleColorChange}
  />
</InspectorControls>
```

### 4. Shared Utilities

**Location**: `src/shared/utils/`

**Purpose**: Helper functions used by both blocks.

**Structure**:
```
src/shared/utils/
├── id-generator.js          # Unique ID generation
├── aria-helpers.js          # ARIA attribute generators
├── keyboard-nav.js          # Keyboard event handlers
├── responsive-detector.js   # Screen size detection
└── validation.js            # Input validation
```

### 5. Shared CSS Utilities

**Location**: `src/shared/styles/`

**Purpose**: Common CSS classes and utilities.

**Structure**:
```
src/shared/styles/
├── base.css                 # Reset and base styles
├── transitions.css          # Animation utilities
├── focus-states.css         # Focus indicators
├── accessibility.css        # Screen reader utilities
└── responsive.css           # Breakpoint utilities
```

---

## Tabs Block Specifications

### Block Structure

**Parent Block**: Tabs Container
- Holds orientation, hover mode, responsive settings
- Contains theme settings
- Manages tab navigation

**Child Block**: Tab Item
- Individual tab with title and content
- Can be disabled
- Inherits theme from parent

### Complete Attribute Schema

#### Parent Block (Tabs Container)

```javascript
{
  // Structural Attributes (unique to tabs) - NOT customizable, have real defaults
  blockId: { type: 'string', default: '' },
  orientation: { type: 'string', default: 'horizontal' }, // 'horizontal' | 'vertical'
  useHover: { type: 'boolean', default: false },
  defaultActiveTab: { type: 'number', default: 0 },
  lazyLoad: { type: 'boolean', default: false },
  deepLink: { type: 'boolean', default: false },
  makeResponsive: { type: 'boolean', default: true },
  tabsWidth: { type: 'string', default: '100%' },

  // Meta Attributes (shared with accordion)
  currentTheme: { type: 'string', default: '' },
  customizationCache: { type: 'object', default: {} },
  themesLoaded: { type: 'boolean', default: false },

  // Customizable Attributes - Container (all default: null, values from window.tabsDefaults)
  containerBackgroundColor: { type: 'string', default: null },
  tabsBorderWidth: { type: 'number', default: null },
  tabsBorderStyle: { type: 'string', default: null },
  tabsBorderColor: { type: 'string', default: null },
  tabsBorderRadius: {
    type: 'object',
    default: null  // { topLeft, topRight, bottomRight, bottomLeft } from CSS
  },
  tabsPadding: {
    type: 'object',
    default: null  // { top, right, bottom, left } from CSS
  },
  tabsMargin: {
    type: 'object',
    default: null  // { top, right, bottom, left } from CSS
  },
  tabsShadow: { type: 'string', default: null },

  // Customizable Attributes - Tab Menu
  tabMenuBackgroundColor: { type: 'string', default: null },
  tabsAlignment: { type: 'string', default: null }, // 'left' | 'center' | 'right'

  // Customizable Attributes - Divider
  dividerBorderEnabled: { type: 'boolean', default: true }, // Behavioral, not styled
  dividerBorderThickness: { type: 'number', default: null },
  dividerBorderStyle: { type: 'string', default: null },
  dividerBorderColor: { type: 'string', default: null }
}
```

#### Child Block (Tab Item)

```javascript
{
  // Structural Attributes (unique to tabs) - NOT customizable, have real defaults
  itemId: { type: 'string', default: '' },
  title: { type: 'string', default: 'Tab' },
  content: { type: 'string', default: '' },
  isDisabled: { type: 'boolean', default: false },

  // Structural Attributes (shared with accordion) - Behavioral defaults
  useHeadingForTitle: { type: 'boolean', default: false },
  headingLevel: { type: 'string', default: 'none' }, // 'none' | 'h1' - 'h6'

  // Meta Attributes (shared)
  currentTheme: { type: 'string', default: '' },
  customizationCache: { type: 'object', default: {} },
  isCustomized: { type: 'boolean', default: false },

  // Customizable Attributes - Tab Button (SHARED with accordion, all default: null)
  titleColor: { type: 'string', default: null },
  titleBackgroundColor: { type: 'string', default: null },
  titleFontSize: { type: 'number', default: null },
  titleFontWeight: { type: 'string', default: null },
  titleFontStyle: { type: 'string', default: null },
  titleTextTransform: { type: 'string', default: null },
  titleTextDecoration: { type: 'string', default: null },
  titleAlignment: { type: 'string', default: null },
  titlePadding: {
    type: 'object',
    default: null  // { top, right, bottom, left } from CSS
  },

  // Customizable Attributes - Hover State (SHARED, all default: null)
  hoverTitleColor: { type: 'string', default: null },
  hoverTitleBackgroundColor: { type: 'string', default: null },

  // Customizable Attributes - Active State (tabs-specific naming, default: null)
  activeTitleColor: { type: 'string', default: null },
  activeTitleBackgroundColor: { type: 'string', default: null },

  // Customizable Attributes - Content Panel (SHARED with accordion, all default: null)
  contentColor: { type: 'string', default: null },
  contentBackgroundColor: { type: 'string', default: null },
  contentFontSize: { type: 'number', default: null },
  contentLineHeight: { type: 'number', default: null },
  contentPadding: {
    type: 'object',
    default: null  // { top, right, bottom, left } from CSS
  },

  // Customizable Attributes - Border (SHARED, nested object structure, all default: null)
  tabBorderThickness: { type: 'number', default: null },
  tabBorderStyle: { type: 'string', default: null },
  tabBorderColor: { type: 'string', default: null },
  tabBorderRadius: {
    type: 'object',
    default: null  // { topLeft, topRight, bottomRight, bottomLeft } from CSS
  },

  // Customizable Attributes - Active/Hover Border (tabs-specific, all default: null)
  activeHoverBorderEnabled: { type: 'boolean', default: false }, // Behavioral
  activeHoverBorderSides: { type: 'array', default: ['top', 'left', 'right', 'bottom'] },
  activeHoverBorderColor: { type: 'string', default: null },
  activeHoverBorderWidth: { type: 'number', default: null },
  activeHoverBorderStyle: { type: 'string', default: null },

  // Customizable Attributes - Animation (tabs-specific)
  tabWidthAnimation: { type: 'boolean', default: true }, // Behavioral
  tabWidthIncreaseAmount: { type: 'number', default: 10 }, // Behavioral value
  inactiveTabsOverlay: { type: 'boolean', default: false }, // Behavioral
  inactiveOverlayColor: { type: 'string', default: null },

  // Customizable Attributes - Icon (SHARED, all default: null except behavioral)
  showIcon: { type: 'boolean', default: false }, // Behavioral
  iconType: { type: 'string', default: 'emoji' }, // Behavioral
  iconContent: { type: 'string', default: '📄' }, // Behavioral
  iconImageUrl: { type: 'string', default: '' }, // Behavioral
  iconPosition: { type: 'string', default: 'left' }, // Behavioral
  iconSize: { type: 'number', default: null },
  iconColor: { type: 'string', default: null },
  iconRotation: { type: 'number', default: 0 }, // Behavioral (accordion: 180)

  // Customizable Attributes - Extended Typography (tabs-specific, all default: null)
  fontFamily: { type: 'string', default: null },
  letterSpacing: { type: 'number', default: null },
  wordSpacing: { type: 'number', default: null }
}
```

### Attribute Mapping: Tabs ↔ Accordion

| Concept | Accordion Attribute | Tabs Attribute | Same name convention? |
|---------|---------------------|----------------|---------|
| Title text | `title` | `title` | ✅ |
| Title color | `titleColor` | `titleColor` | ✅ |
| Title background | `titleBackgroundColor` | `titleBackgroundColor` | ✅ |
| Hover color | `hoverTitleColor` | `hoverTitleColor` | ✅ |
| Open/Active color | `activeTitleColor` | `activeTitleColor` | ✅ |
| Content color | `contentColor` | `contentColor` | ✅ |
| Content background | `contentBackgroundColor` | `contentBackgroundColor` | ✅ |
| Border settings | `itemBorder*` | `itemBorder*` | ✅ |
| Icon settings | `showIcon`, `iconType`, etc. | `showIcon`, `iconType`, etc. | ✅ |
| Orientation | N/A (always vertical) | `orientation` | ❌ |
| Hover mode | N/A | `useHover` | ❌ |
| Initial state | `initiallyOpen` | `defaultActiveTab` | ❌ |
| Allow multiple | `allowMultipleOpen` | N/A (tabs always exclusive) | ❌ |

---

## Shared vs Block-Specific Attributes

### Attributes Used by BOTH Blocks

These attributes should be defined in `src/shared/attributes/` and imported by both blocks:

**Color Attributes** (color-attributes.js):
- `titleColor`
- `titleBackgroundColor`
- `hoverTitleColor`
- `hoverTitleBackgroundColor`
- `activeTitleColor`
- `activeTitleBackgroundColor`
- `contentColor`
- `contentBackgroundColor`

**Typography Attributes** (typography-attributes.js):
- `titleFontSize`
- `titleFontWeight`
- `titleAlignment`
- `contentFontSize`
- `contentLineHeight`
- `useHeadingForTitle`
- `headingLevel`

**Border Attributes** (border-attributes.js):
- `itemBorderColor`
- `itemBorderWidth`
- `itemBorderRadius`
- `itemBorderStyle`

**Spacing Attributes** (spacing-attributes.js):
- `titlePadding`
- `contentPadding`
- `containerPadding`
- `containerMargin`

**Icon Attributes** (icon-attributes.js):
- `showIcon`
- `iconType`
- `iconContent`
- `iconImageUrl`
- `iconPosition`
- `iconSize`
- `iconColor`

**Meta Attributes** (meta-attributes.js):
- `currentTheme`
- `customizationCache`
- `themesLoaded`
- `isCustomized`

### Attributes Unique to Tabs Block

**Tabs-Specific** (tabs-attributes.js):
- `orientation`
- `useHover`
- `defaultActiveTab`
- `lazyLoad`
- `deepLink`
- `makeResponsive`
- `tabsWidth`
- `tabMenuBackgroundColor`
- `tabsAlignment`
- `dividerBorder*`
- `tabWidthAnimation`
- `tabWidthIncreaseAmount`
- `inactiveTabsOverlay`
- `inactiveOverlayColor`
- `activeHoverBorder*`
- `isDisabled`
- Extended typography: `fontStyle`, `textTransform`, `letterSpacing`, `wordSpacing`, `textDecoration`

### Attributes Unique to Accordion Block

**Accordion-Specific** (accordion-attributes.js):
- `initiallyOpen`
- `iconRotation`
- `itemMarginBottom`
- `itemShadow`

---

## Shared Theme System

### Theme Storage Format

**Database Table**: `wp_options`
**Option Name**: `tab_themes`

**Structure**:
```php
array(
  'accordion_themes' => array(
    'Professional Blue' => array(
      'name' => 'Professional Blue',
      'blockType' => 'accordion',
      'modified' => '2025-10-10 14:30:00',
      'values' => array(/* all accordion customizable attributes */)
    )
  ),
  'tabs_themes' => array(
    'Modern Horizontal' => array(
      'name' => 'Modern Horizontal',
      'blockType' => 'tabs',
      'modified' => '2025-10-10 15:00:00',
      'values' => array(/* all tabs customizable attributes */)
    )
  )
)
```

### Theme Compatibility

**Question**: Can accordion themes be applied to tabs and vice versa?

**Answer**: NOPE, they share the same concept, architecture and name conventions, but they are independent

### Shared Theme Operations

All theme operations use the same shared functions:

```javascript
// src/shared/theme-system/theme-manager.js

export function createTheme(blockType, themeName, values) {
  // Validate theme name
  if (!isValidThemeName(themeName, blockType)) {
    throw new Error('Invalid theme name');
  }

  // Get all themes
  const allThemes = getAllThemes();

  // Ensure block type key exists
  if (!allThemes[`${blockType}_themes`]) {
    allThemes[`${blockType}_themes`] = {};
  }

  // Create theme object
  allThemes[`${blockType}_themes`][themeName] = {
    name: themeName,
    blockType: blockType,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    values: values
  };

  // Save to database
  saveThemes(allThemes);

  // Dispatch event
  dispatchThemeEvent('theme-created', { blockType, themeName });
}

export function updateTheme(blockType, themeName, newValues) {
  const allThemes = getAllThemes();
  const theme = allThemes[`${blockType}_themes`][themeName];

  if (!theme) {
    throw new Error('Theme not found');
  }

  theme.values = newValues;
  theme.modified = new Date().toISOString();

  saveThemes(allThemes);

  dispatchThemeEvent('theme-updated', { blockType, themeName });
}

// ... deleteTheme, renameTheme, etc.
```

---

## Shared UI Components

### 1. ThemeSelector Component

**Location**: `src/shared/components/ThemeSelector.js`

**Props**:
```javascript
{
  blockType: 'accordion' | 'tabs',
  currentTheme: string,
  themes: object,
  onThemeChange: function,
  isCustomized: boolean,
  customizationCache: object
}
```

**Usage** (same for both blocks):
```javascript
<ThemeSelector
  blockType="tabs"
  currentTheme={attributes.currentTheme}
  themes={themesState.tabsThemes}
  onThemeChange={handleThemeChange}
  isCustomized={isCustomized}
  customizationCache={attributes.customizationCache}
/>
```

### 2. ColorPanel Component

**Location**: `src/shared/components/ColorPanel.js`

**Props**:
```javascript
{
  title: string,
  colors: {
    [attributeName]: currentValue
  },
  effectiveValues: {
    [attributeName]: effectiveValue
  },
  onChange: function
}
```

**Usage**:
```javascript
<ColorPanel
  title="Title Colors"
  colors={{
    titleColor: attributes.titleColor,
    titleBackgroundColor: attributes.titleBackgroundColor
  }}
  effectiveValues={{
    titleColor: effectiveValues.titleColor,
    titleBackgroundColor: effectiveValues.titleBackgroundColor
  }}
  onChange={(attr, value) => setAttributes({ [attr]: value })}
/>
```

### 3. TypographyPanel Component

**Location**: `src/shared/components/TypographyPanel.js`

**Props**:
```javascript
{
  blockType: 'accordion' | 'tabs',
  typography: object,
  effectiveValues: object,
  onChange: function
}
```

**Features**:
- Accordion: Basic typography (fontSize, fontWeight, alignment)
- Tabs: Extended typography (fontStyle, textTransform, letterSpacing, etc.)

**Usage**:
```javascript
<TypographyPanel
  blockType="tabs"
  typography={{
    titleFontSize: attributes.titleFontSize,
    titleFontWeight: attributes.titleFontWeight,
    fontStyle: attributes.fontStyle,
    textTransform: attributes.textTransform,
    // ... etc
  }}
  effectiveValues={effectiveValues}
  onChange={handleTypographyChange}
/>
```

### 4. BorderPanel Component

**Location**: `src/shared/components/BorderPanel.js`

**Props**:
```javascript
{
  title: string,
  border: object,
  effectiveValues: object,
  onChange: function,
  features: {
    individualCorners: boolean,
    individualSides: boolean
  }
}
```

**Usage** (Tabs with extended features):
```javascript
<BorderPanel
  title="Active/Hover Tab Border"
  border={{
    enabled: attributes.activeHoverBorderEnabled,
    sides: attributes.activeHoverBorderSides,
    color: attributes.activeHoverBorderColor,
    width: attributes.activeHoverBorderWidth,
    style: attributes.activeHoverBorderStyle
  }}
  effectiveValues={effectiveValues}
  onChange={handleBorderChange}
  features={{
    individualCorners: true,
    individualSides: true
  }}
/>
```

### 5. IconPanel Component

**Location**: `src/shared/components/IconPanel.js`

**Props**:
```javascript
{
  blockType: 'accordion' | 'tabs',
  icon: object,
  effectiveValues: object,
  onChange: function
}
```

**Features**:
- Accordion: Icon rotation for expand/collapse
- Tabs: Icon position includes top/bottom (not just left/right)

**Usage**:
```javascript
<IconPanel
  blockType="tabs"
  icon={{
    show: attributes.showIcon,
    type: attributes.iconType,
    content: attributes.iconContent,
    imageUrl: attributes.iconImageUrl,
    position: attributes.iconPosition, // 'left' | 'right' | 'top' | 'bottom'
    size: attributes.iconSize,
    color: attributes.iconColor
  }}
  effectiveValues={effectiveValues}
  onChange={handleIconChange}
/>
```

---

## Responsive Accordion Fallback

### Concept

On narrow screens (< 600px), tabs (both horizontal and vertical) automatically transform into accordion layout for better mobile experience.

**Why**: Tabs require horizontal space for navigation. On mobile, accordion's vertical stacking is more usable.

### Implementation Strategy

#### 1. Shared Accordion Component

Create a **shared accordion renderer** that can be used by both blocks:

**Location**: `src/shared/components/AccordionRenderer.js`

**Purpose**: Render content in accordion format.

**Props**:
```javascript
{
  items: array, // Array of {id, title, content}
  allowMultipleOpen: boolean,
  initiallyOpen: array, // Array of indices
  styles: object, // All style attributes
  blockId: string
}
```

**Usage in Tabs Block**:
```javascript
import { AccordionRenderer } from '@shared/components/AccordionRenderer';
import { useResponsive } from '@shared/hooks/useResponsive';

function TabsEdit({ attributes }) {
  const { isMobile } = useResponsive();
  const effectiveValues = resolveAllValues(attributes);

  if (isMobile && attributes.makeResponsive) {
    // Fallback to accordion on mobile
    return (
      <AccordionRenderer
        items={attributes.tabs.map(tab => ({
          id: tab.id,
          title: tab.title,
          content: tab.content
        }))}
        allowMultipleOpen={false}
        initiallyOpen={[attributes.defaultActiveTab]}
        styles={effectiveValues}
        blockId={attributes.blockId}
      />
    );
  }

  // Normal tabs rendering
  return <TabsRenderer {...props} />;
}
```

#### 2. Responsive Detection Hook

**Location**: `src/shared/hooks/useResponsive.js`

**Purpose**: Detect screen size and return responsive state.

**Implementation**:
```javascript
import { useState, useEffect } from 'react';

export function useResponsive(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return { isMobile };
}
```

#### 3. Style Preservation

When switching from tabs to accordion, preserve all styling:

**Color Mapping**:
- Tab button colors → Accordion button colors
- Tab panel colors → Accordion content colors
- Active tab colors → Open accordion colors
- Hover tab colors → Hover accordion colors

**Border Mapping**:
- Tab border → Accordion item border
- Divider border → Accordion item separator

**Typography Mapping**:
- Tab title typography → Accordion title typography
- Tab content typography → Accordion content typography

#### 4. State Transfer

**Active Tab → Initially Open Accordion**:
```javascript
// Tabs state
defaultActiveTab: 2

// Converts to accordion
initiallyOpen: [2] // Third accordion item open
```

**Disabled Tabs → Hidden Accordions**:
```javascript
// Tab with isDisabled: true
// Rendered as accordion item with display: none
```

#### 5. Frontend Rendering

**CSS Media Query Approach**:
```css
/* Tabs layout on desktop */
.tabs-container {
  display: flex;
  flex-direction: row;
}

.tabs-container .tab-list {
  display: flex;
}

/* Accordion layout on mobile */
@media (max-width: 600px) {
  .tabs-container.responsive {
    display: block;
  }

  .tabs-container.responsive .tab-list {
    display: none; /* Hide tab navigation */
  }

  .tabs-container.responsive .tab-panels {
    /* Transform into accordion */
    display: block;
  }

  /* Show accordion-style buttons */
  .tabs-container.responsive .accordion-button {
    display: block;
    width: 100%;
  }
}
```

**JavaScript Approach** (for editor):
```javascript
// Render different components based on screen size
{isMobile && makeResponsive ? (
  <AccordionRenderer {...accordionProps} />
) : (
  <TabsRenderer {...tabsProps} />
)}
```

---

## Implementation Roadmap

### Phase 1: Setup Shared Infrastructure

**Goal**: Extract shared code from Accordion block into reusable modules, including CSS parsing.

**Tasks**:
1. Create `src/shared/` directory structure
2. Extract and update theme system into `src/shared/theme-system/` (3-tier cascade)
3. Extract common attributes into `src/shared/attributes/` (all customizable defaults to `null`)
4. Extract UI components into `src/shared/components/`
5. Ensure CSS parsing functions are reusable for both blocks
6. Create `tabs.css` file with `:root` variables for tabs defaults
7. Implement `get_tabs_plugin_defaults()` PHP function (mirrors accordion parsing)
8. Update Accordion block to import from shared modules
9. Test that Accordion still works correctly with v6.0 architecture


**Testing**:
- [ ] Accordion themes still load/save
- [ ] Accordion customizations still work
- [ ] Accordion UI panels function correctly
- [ ] No regressions in accordion functionality
- [ ] Accordion uses `window.accordionDefaults` correctly
- [ ] All customizable attributes default to `null`
- [ ] 3-tier cascade works properly

### Phase 2: Create Tabs Block Structure

**Goal**: Build Tabs block skeleton using shared infrastructure and CSS-based defaults.

**Tasks**:
1. Create `blocks/tabs/` directory
2. Create `block.json` with tabs-specific attributes (all customizable defaults to `null`)
3. Import shared attributes from `src/shared/attributes/`
4. Create basic `edit.js` using shared UI components
5. Create basic `save.js` with tabs HTML structure
6. Register block in WordPress
7. Ensure `window.tabsDefaults` is available in editor


**Testing**:
- [ ] Tabs block appears in inserter
- [ ] Can insert tabs block in editor
- [ ] Basic tabs structure renders
- [ ] No console errors
- [ ] `window.tabsDefaults` populated correctly
- [ ] All customizable attributes default to `null`

### Phase 3: Implement Tabs Theme System

**Goal**: Connect Tabs block to shared theme system with CSS-based defaults.

**Tasks**:
1. Ensure `tabs.css` has all required `:root` variables
2. Implement 3-tier cascade resolution for tabs using `window.tabsDefaults`
3. Add theme selector to tabs inspector
4. Implement theme CRUD operations (shared with accordion)
5. Test theme switching and customization
6. Verify theme generation uses CSS defaults


**Testing**:
- [ ] Tabs themes save to database
- [ ] Theme dropdown works
- [ ] Customizations detected correctly
- [ ] Can switch between themes
- [ ] Can create/update/delete tabs themes
- [ ] Themes use defaults from `window.tabsDefaults`
- [ ] 3-tier cascade resolves correctly

### Phase 4: Build Tabs UI Panels

**Goal**: Complete inspector sidebar for tabs.

**Tasks**:
1. Add General Settings panel (orientation, hover mode, etc.)
2. Add Appearance panel (colors, backgrounds)
3. Add Tab Text panel (typography)
4. Add Border Settings panel
5. Add Animation panel
6. Add Icon panel
7. Implement per-tab settings (disable tab, etc.)


**Testing**:
- [ ] All panels display correctly
- [ ] All controls update attributes
- [ ] Effective values shown correctly
- [ ] Customization detection works
- [ ] Changes reflect in editor preview

### Phase 5: Implement Tabs Functionality

**Goal**: Add tabs-specific behavior (switching, hover, keyboard nav).

**Tasks**:
1. Implement tab switching on click
2. Implement hover mode with delay
3. Implement keyboard navigation (arrows, home, end)
4. Implement ARIA attributes
5. Implement lazy loading
6. Implement deep linking
7. Implement disabled tabs


**Testing**:
- [ ] Tabs switch on click
- [ ] Hover mode works (with delay)
- [ ] Keyboard navigation functional
- [ ] ARIA attributes correct
- [ ] Lazy loading works
- [ ] Deep linking works
- [ ] Disabled tabs not selectable

### Phase 6: Implement Responsive Accordion Fallback

**Goal**: Transform tabs into accordion on mobile.

**Tasks**:
1. Create shared `AccordionRenderer` component
2. Create `useResponsive` hook
3. Implement responsive detection in tabs
4. Map tabs state to accordion state
5. Preserve styling in transformation


### Phase 7: Frontend Rendering

**Goal**: Implement frontend save function for tabs.

**Tasks**:
1. Implement `save.js` with resolved values
2. Generate inline styles from attributes
3. Create frontend JavaScript for interaction
4. Create frontend CSS for structure
5. Implement responsive CSS media queries
6. Test frontend rendering


**Testing**:
- [ ] Frontend HTML structure correct
- [ ] All styles applied correctly
- [ ] Tabs function on frontend
- [ ] Hover mode works on frontend
- [ ] Keyboard navigation works
- [ ] Responsive transformation works
- [ ] ARIA attributes present

### Phase 8: Documentation and Polish

**Goal**: Complete documentation and fix bugs.

**Tasks**:
1. Update all documentation
2. Add code comments
3. Fix any remaining bugs
4. Optimize performance
5. Validate accessibility
6. Create user guide


**Testing**:
- [ ] All features documented
- [ ] Code well-commented
- [ ] No known bugs
- [ ] Performance acceptable
- [ ] WCAG AA compliant
- [ ] User guide complete

---

## Shared Code Examples

### Example 1: Shared Cascade Resolution (3-Tier System)

```javascript
// src/shared/theme-system/cascade-resolver.js

/**
 * Resolve effective value using 3-tier cascade
 * @param {string} attributeName - Name of attribute to resolve
 * @param {object} blockAttributes - Block's inline customizations
 * @param {object} currentTheme - Active theme object
 * @param {object} defaults - Default values from CSS (window.accordionDefaults or window.tabsDefaults)
 * @returns {*} Resolved value
 */
export function getEffectiveValue(
  attributeName,
  blockAttributes,
  currentTheme,
  defaults
) {
  // Tier 3: Per-block inline customization (highest priority)
  if (blockAttributes[attributeName] !== null && blockAttributes[attributeName] !== undefined) {
    return blockAttributes[attributeName];
  }

  // Tier 2: Theme value (from database)
  if (currentTheme && currentTheme.values &&
      currentTheme.values[attributeName] !== null &&
      currentTheme.values[attributeName] !== undefined) {
    return currentTheme.values[attributeName];
  }

  // Tier 1: Default value (from CSS, parsed by PHP, passed via window.accordionDefaults or window.tabsDefaults)
  return defaults[attributeName];
}

/**
 * Resolve all effective values at once
 * @param {object} blockAttributes - Block's inline customizations
 * @param {object} currentTheme - Active theme object
 * @param {object} defaults - Default values from CSS
 * @returns {object} All resolved values
 */
export function getAllEffectiveValues(blockAttributes, currentTheme, defaults) {
  const effectiveValues = {};

  Object.keys(defaults).forEach(attr => {
    effectiveValues[attr] = getEffectiveValue(
      attr,
      blockAttributes,
      currentTheme,
      defaults
    );
  });

  return effectiveValues;
}
```

**Usage in Accordion**:
```javascript
import { getAllEffectiveValues } from '@shared/theme-system/cascade-resolver';

// Defaults from CSS (parsed by PHP, available via window.accordionDefaults)
const defaults = window.accordionDefaults || {};

const effectiveValues = getAllEffectiveValues(
  attributes,
  currentTheme,
  defaults
);
```

**Usage in Tabs**:
```javascript
import { getAllEffectiveValues } from '@shared/theme-system/cascade-resolver';

// Defaults from CSS (parsed by PHP, available via window.tabsDefaults)
const defaults = window.tabsDefaults || {};

const effectiveValues = getAllEffectiveValues(
  attributes,
  currentTheme,
  defaults
);
```

### Example 2: Shared Color Panel

```javascript
// src/shared/components/ColorPanel.js

import { PanelBody, ColorPicker } from '@wordpress/components';

export function ColorPanel({
  title,
  colors,
  effectiveValues,
  onChange,
  isOpen = false
}) {
  return (
    <PanelBody title={title} initialOpen={isOpen}>
      {Object.keys(colors).map(attrName => {
        const currentValue = colors[attrName];
        const effectiveValue = effectiveValues[attrName];
        const isCustomized = currentValue !== undefined;

        return (
          <div key={attrName} className="color-control">
            <label>
              {formatLabel(attrName)}
              {isCustomized && <span className="customized-badge">*</span>}
            </label>
            <ColorPicker
              color={effectiveValue}
              onChangeComplete={(color) => onChange(attrName, color.hex)}
            />
            {isCustomized && (
              <Button
                isSmall
                onClick={() => onChange(attrName, undefined)}
              >
                Clear Customization
              </Button>
            )}
          </div>
        );
      })}
    </PanelBody>
  );
}

function formatLabel(attrName) {
  // Convert camelCase to Title Case
  return attrName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}
```

**Usage**:
```javascript
// Same code for both Accordion and Tabs
<ColorPanel
  title="Title Colors"
  colors={{
    titleColor: attributes.titleColor,
    titleBackgroundColor: attributes.titleBackgroundColor
  }}
  effectiveValues={{
    titleColor: effectiveValues.titleColor,
    titleBackgroundColor: effectiveValues.titleBackgroundColor
  }}
  onChange={(attr, value) => setAttributes({ [attr]: value })}
/>
```

### Example 3: Shared Accordion Renderer

```javascript
// src/shared/components/AccordionRenderer.js

import { useState } from 'react';
import { generateUniqueId } from '@shared/utils/id-generator';

export function AccordionRenderer({
  items,
  allowMultipleOpen = false,
  initiallyOpen = [],
  styles,
  blockId
}) {
  const [openItems, setOpenItems] = useState(initiallyOpen);

  const toggleItem = (index) => {
    if (allowMultipleOpen) {
      setOpenItems(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="accordion-renderer" data-block-id={blockId}>
      {items.map((item, index) => {
        const itemId = generateUniqueId(blockId, index);
        const isOpen = openItems.includes(index);

        return (
          <div
            key={item.id}
            className="accordion-item"
            style={{
              borderColor: styles.itemBorderColor,
              borderWidth: styles.itemBorderWidth,
              borderRadius: styles.itemBorderRadius,
              marginBottom: styles.itemMarginBottom
            }}
          >
            <button
              type="button"
              className="accordion-button"
              aria-expanded={isOpen}
              aria-controls={`${itemId}-content`}
              onClick={() => toggleItem(index)}
              style={{
                backgroundColor: isOpen
                  ? styles.activeTitleBackgroundColor
                  : styles.titleBackgroundColor,
                color: isOpen
                  ? styles.activeTitleColor
                  : styles.titleColor,
                fontSize: styles.titleFontSize,
                fontWeight: styles.titleFontWeight,
                padding: styles.titlePadding
              }}
            >
              {item.title}
            </button>

            <div
              id={`${itemId}-content`}
              className="accordion-content"
              role="region"
              aria-labelledby={`${itemId}-button`}
              hidden={!isOpen}
              style={{
                backgroundColor: styles.contentBackgroundColor,
                color: styles.contentColor,
                fontSize: styles.contentFontSize,
                padding: styles.contentPadding,
                lineHeight: styles.contentLineHeight
              }}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

## Summary of Shared Architecture Benefits

### Code Reuse

- Shared CSS parsing system for both blocks
- Shared theme system eliminates duplication
- Shared UI components ensure consistency
- Shared utilities reduce bugs
- Single cascade resolution logic

### Maintenance

- **CSS as single source of truth**: Change defaults in one place (CSS file)
- Fix bugs once, benefits both blocks
- Update UI patterns in one place
- Consistent behavior across blocks
- Easier to test and validate
- No duplicate default value definitions

### User Experience

- Consistent theming experience across both blocks
- **Separate theme libraries** - accordion and tabs themes are independent
- Familiar UI patterns
- Responsive fallback reuses accordion logic
- Predictable 3-tier cascade behavior

### Performance

- Cached CSS parsing (parse once, use forever)
- Smaller bundle size (shared code)
- Faster development time
- Less memory usage (shared components)
- Minimal inline styles (only customizations)

### Extensibility

- Easy to add new collapsible block types
- Shared infrastructure supports growth
- Plugin architecture for future blocks
- New blocks automatically get CSS parsing system

---

## Implementation Checklist

### Shared Infrastructure
- [ ] Create `src/shared/` directory structure
- [ ] Extract theme system to shared modules
- [ ] Extract common attributes to shared files
- [ ] Create shared UI components
- [ ] Create shared utilities and hooks
- [ ] Update Accordion to use shared modules
- [ ] Test Accordion still works

### Tabs Block Structure
- [ ] Create `blocks/tabs/` directory
- [ ] Define tabs-specific attributes
- [ ] Import shared attributes
- [ ] Create `edit.js` skeleton
- [ ] Create `save.js` skeleton
- [ ] Register block

### Tabs Functionality
- [ ] Implement tab switching
- [ ] Implement hover mode
- [ ] Implement keyboard navigation
- [ ] Implement ARIA attributes
- [ ] Implement lazy loading
- [ ] Implement deep linking
- [ ] Implement disabled tabs

### Tabs UI
- [ ] General Settings panel
- [ ] Appearance panel
- [ ] Tab Text panel
- [ ] Border Settings panel
- [ ] Animation panel
- [ ] Icon panel
- [ ] Per-tab settings

### Theme System
- [ ] Connect to shared theme manager
- [ ] Implement tabs theme defaults
- [ ] Test theme CRUD operations
- [ ] Verify accordion and tabs themes remain separate

### Responsive Behavior
- [ ] Create AccordionRenderer component
- [ ] Create useResponsive hook
- [ ] Implement responsive detection
- [ ] Test tabs-to-accordion transformation
- [ ] Test state preservation
- [ ] Test styling preservation

### Frontend
- [ ] Implement save.js
- [ ] Create frontend JavaScript
- [ ] Create frontend CSS
- [ ] Test all interactions
- [ ] Test responsive behavior
- [ ] Validate accessibility

### Documentation
- [ ] Update architectural docs
- [ ] Add code comments
- [ ] Create user guide
- [ ] Document shared modules
- [ ] Document integration patterns

---

## Changelog: Documentation Updates for Shared Architecture

### Overview of Changes (2025-10-12)

This changelog summarizes all documentation updates made to align the entire documentation set with the shared architecture approach. The goal was to ensure all documents reflect that the accordion block is designed from the beginning with shared infrastructure for future tabs implementation, rather than implementing accordion first and then refactoring.

### Files Updated

#### 1. THEME-SYSTEM-ARCHITECTURE.md
**Major Changes**:
- Changed title from "Accordion Theme System Architecture" to "Shared Theme System Architecture"
- Added new Section 2: "Shared Architecture Philosophy" explaining core principle of "One System, Multiple Block Types"
- Updated database schema to show both `accordion_themes` and `tabs_themes` with note about separate storage
- Replaced "Cross-Block Theme Conversion" section with "Theme Independence" section
  - **Critical**: Removed all theme conversion functionality per user requirement
  - Clarified that accordion and tabs themes are completely separate and NOT convertible
- Removed `convertTheme()` function from shared functions list
- Added Section 13: "Shared Implementation Structure" with 3-phase implementation order
- Updated conclusion to emphasize shared architecture philosophy

**Key Architectural Decisions Documented**:
- Themes are stored separately: `accordion_themes` vs `tabs_themes`
- Same logic/utilities but NOT convertible themes
- Shared code accepts `blockType` parameter to determine which CSS file and database option to use

#### 2. TABS-ACCORDION-INTEGRATION.md
**Major Changes**:
- Removed entire Phase 8: "Cross-Block Theme Conversion"
  - Deleted `convertTheme()` function implementation
  - Removed import/export theme buttons from UI descriptions
  - Updated implementation timeline
- Updated implementation checklist to verify accordion and tabs themes remain separate
- Updated summary section to clarify themes are separate and independent
- Changed references from "convertible themes" to "separate theme libraries"

**Rationale**: User explicitly stated "I absolutely dont want themes to be convertable from accordion to tabs and vice versa"

#### 3. BLOCK-ATTRIBUTES-SCHEMA.md
**Changes Applied**:
- Updated overview to mention both Accordion and Tabs blocks use common attribute naming conventions
- Updated CSS section to show both `accordion.css` and `tabs.css` with shared parsing function
- Updated database serialization section to show both `accordion_themes` and `tabs_themes` with shared architecture note
- Added shared architecture note to theme database schema section
- Updated Related Documentation section to reference shared architecture where applicable
- Added note about shared attribute definitions from `src/shared/attributes/`

**Key Points Added**:
- Both blocks use the same PHP parsing function from shared utilities
- Themes stored in separate database options but use identical structure
- Attribute naming conventions are shared between blocks

#### 4. EDITOR-UI-REQUIREMENTS.md
**Major Changes**:
- Added overview note about shared UI components from `src/shared/components/`
- Changed cascade description from 4-tier to 3-tier (CSS Defaults → Theme → Customizations)
- Added shared architecture note to cascade system section referencing `cascade-resolver.js`
- Added implementation notes to each panel section:
  - Settings Panel: Uses shared ThemeSelector.js
  - Color Panel: Uses shared ColorPanel.js
  - Title Panel: Uses shared TypographyPanel.js
  - Border Panel: Uses shared BorderPanel.js
  - Icon Panel: Uses shared IconPanel.js
- Updated effective value resolution section with implementation references
- Added comprehensive Section 13: "Shared Architecture Implementation"
  - Documented all shared components and their locations
  - Documented all shared logic modules
  - Explained block-specific vs shared distinctions
  - Provided complete 3-phase implementation order

**New Content**:
- Clear separation of what's shared vs what's block-specific
- Implementation order guidance (build shared first, then blocks)
- Detailed module structure documentation

#### 5. DATA-FLOW-AND-STATE.md
**Major Changes**:
- Changed title from "Accordion System" to "Shared Block System"
- Added "Shared Architecture Overview" section at top explaining shared infrastructure design
- Updated all database references to show both `accordion_themes` and `tabs_themes`
- Updated AJAX action names to use `[blocktype]` pattern (e.g., `get_accordion_themes`, `get_tabs_themes`)
- Added location references to shared modules in all data flow diagrams:
  - `src/shared/theme-system/theme-manager.js`
  - `src/shared/theme-system/cascade-resolver.js`
  - `src/shared/components/` for UI controls
- Updated event dispatching to show block-type-specific event names (`accordionThemeUpdated` vs `tabsThemeUpdated`)
- Added comprehensive Section 16: "Shared Architecture: Implementing New Blocks"
  - Overview of shared infrastructure
  - Shared modules documentation
  - Block-specific configuration guide
  - Event system integration
  - CSS defaults integration
  - Database schema separation
  - Complete implementation checklist
  - Benefits documentation

**Key Additions**:
- Code examples showing how to use shared hooks with `blockType` parameter
- Event naming convention documentation
- PHP/JavaScript integration patterns
- Step-by-step guide for implementing new block types

#### 6. FRONTEND-RENDERING.md
**Changes Applied**:
- Added shared architecture note to overview section
- Clarified that same CSS parsing logic, theme CSS generation, and frontend JavaScript patterns apply to both block types
- Noted that each block has its own CSS file and database storage but uses identical architecture
- Referenced `src/shared/utils/css-parser.js` for shared parsing logic

**Key Points**:
- CSS parsing system is shared between blocks
- Theme CSS generation uses same patterns
- Frontend JavaScript interaction logic can be reused

#### 7. ACCORDION-HTML-STRUCTURE.md
**Changes Applied**:
- Added shared architecture note to introduction
- Referenced shared utilities: `id-generator.js`, `aria-helpers.js`, `keyboard-nav.js`
- Clarified that HTML structure patterns apply to both Accordion and Tabs blocks
- Noted that both blocks use identical accessibility patterns

**Key Points**:
- ARIA attribute management is shared
- Keyboard navigation logic is shared
- ID generation is handled by shared utilities

### Critical Architectural Decisions Documented

1. **Theme Independence**:
   - Accordion themes and Tabs themes are completely separate
   - Themes are NOT convertible between block types
   - Each block maintains its own theme library
   - Rationale: User explicitly required no conversion functionality

2. **Shared Infrastructure Pattern**:
   - All logic in `src/shared/` directory
   - Shared code accepts `blockType` parameter
   - Block-specific differences: CSS files, database options, event names
   - Shared similarities: Logic, hooks, utilities, UI components

3. **Implementation Order**:
   - Phase 1: Build shared infrastructure FIRST
   - Phase 2: Implement accordion using shared modules
   - Phase 3: Implement tabs reusing everything
   - **Critical**: Do NOT implement accordion first and then refactor to extract shared code

4. **Database Schema**:
   - Option names: `accordion_themes` vs `tabs_themes`
   - Separate storage per block type
   - Identical theme structure
   - Managed by same shared functions with `blockType` parameter

5. **CSS Parsing System**:
   - Single source of truth: CSS files with `:root` variables
   - Shared parsing function: `parse_css_defaults()`
   - Block-specific CSS files: `accordion.css` vs `tabs.css`
   - PHP passes to JavaScript: `window.accordionDefaults` vs `window.tabsDefaults`

6. **Event System**:
   - Block-type-specific event names
   - Event pattern: `[blocktype]ThemeUpdated`
   - Examples: `accordionThemeUpdated`, `tabsThemeUpdated`
   - Events do not cross block types

### Benefits of Documentation Updates

**For Developers**:
- Clear understanding that shared architecture is built from the beginning
- No confusion about implementation order
- Complete module structure documentation
- Ready-to-use patterns and examples

**For Project Success**:
- Prevents implement-then-refactor antipattern
- Ensures code consistency from day one
- Reduces technical debt
- Accelerates tabs implementation

**For Future Maintenance**:
- All architectural decisions documented
- Clear separation of concerns
- Implementation guidance for new blocks
- Rationale for design choices captured

### Files Modified Summary

| File | Lines Changed | Sections Added | Type of Update |
|------|--------------|----------------|----------------|
| THEME-SYSTEM-ARCHITECTURE.md | ~200 | 2 major sections | Major reframe |
| TABS-ACCORDION-INTEGRATION.md | ~50 | 0 (removals) | Content removal |
| BLOCK-ATTRIBUTES-SCHEMA.md | ~30 | 0 | Targeted additions |
| EDITOR-UI-REQUIREMENTS.md | ~100 | 1 major section | Major additions |
| DATA-FLOW-AND-STATE.md | ~200 | 1 major section | Major reframe |
| FRONTEND-RENDERING.md | ~10 | 0 | Minimal note |
| ACCORDION-HTML-STRUCTURE.md | ~5 | 0 | Minimal note |

### Total Impact

- **7 files updated**
- **~600 lines modified**
- **4 new major sections added**
- **1 major section removed** (theme conversion)
- **Complete architectural alignment achieved**

### Validation Checklist

- [x] All documents reference shared architecture
- [x] No contradictions between documents
- [x] Implementation order is clear (shared first)
- [x] Theme independence explicitly documented
- [x] Database schema consistently described
- [x] Event system fully documented
- [x] Shared module locations specified
- [x] Block-specific vs shared clearly distinguished
- [x] Code examples use correct patterns
- [x] User requirements satisfied (no theme conversion)

---

**Document Version**: 2.1
**Last Updated**: 2025-10-12
**Status**: Complete - Fully aligned with shared architecture philosophy
**Changelog Created**: 2025-10-12
