# TOC Block Improvement Plan

## Implementation Status

### ✅ Phase 1: Schema and Attribute Updates - **COMPLETE**
- ✅ All 45+ new attributes added
- ✅ Groups restructured (headerColors, headerTypography, icon, externalBorders)
- ✅ Icon system implemented (showIcon, iconPosition, iconSize, rotation, etc.)
- ✅ Filter mode updated (H1-H6 toggles replace depthLimit)
- ✅ Link colors restructured (unified vs per-level with states)
- ✅ Default values updated (isCollapsible: true, enableHierarchicalIndent: true)
- ✅ 24 files regenerated successfully

### ✅ Phase 2: Component Structure Refactoring - **COMPLETE**
- ✅ save.js updated with accordion-like structure (header wrapper + content)
- ✅ renderIcon() and renderHeader() functions implemented
- ✅ Icon positioning logic (left/right/extreme-left/extreme-right) working
- ✅ edit.js updated with heading level selector grid (H1-H6)
- ✅ Editor preview matches frontend structure
- ✅ frontend.js updated with icon rotation/swap behavior
- ✅ Collapse disabled when showIcon is false
- ✅ Heading detection uses includeH1-H6 attributes
- ✅ Structure schema updated, builds successfully

### ✅ Phase 3: Styling Updates - **COMPLETE**
### ✅ Phase 4: Build System Updates - **COMPLETE**
### ⏳ Phase 5: PHP Backend Updates - **PENDING**
### ⏳ Phase 6: Testing & Verification - **PENDING**
### ⏳ Phase 7: Documentation - **PENDING**

---

## Overview

This document outlines the comprehensive implementation plan for restructuring the TOC block to adopt an accordion-like architecture. The changes will make the TOC block more consistent with the accordion block while maintaining its unique functionality.

## Core Concept

Build the TOC structure as an accordion-like component with:
- **Header section**: Contains title and optional collapse icon
- **Content section**: Contains the list of table of contents items
- Reuses most of the logic and attributes from the accordion block for consistency

---

## Phase 1: Schema and Attribute Updates

### 1.1 Structural Changes

**Update `schemas/toc.json`:**

#### Add Accordion-Style Groups
- Add `headerColors` group (similar to accordion)
- Add `headerTypography` group (similar to accordion)
- Add `icon` group (similar to accordion)
- Rename `blockBorders` to `externalBorders` for clarity

#### Update Default Behavior
```json
{
  "isCollapsible": {
    "default": true  // Change from false to true
  },
  "initiallyCollapsed": {
    "default": false  // Ensure this is false (starts expanded)
  },
  "enableHierarchicalIndent": {
    "default": true  // Change from false to true
  }
}
```

### 1.2 Header Icon System

**Add new attributes (from accordion):**

```json
{
  "showIcon": {
    "type": "boolean",
    "default": true,
    "group": "icon",
    "label": "Show Icon",
    "description": "Display expand/collapse icon",
    "themeable": false,
    "control": "ToggleControl"
  },
  "iconPosition": {
    "type": "string",
    "default": "right",
    "group": "icon",
    "label": "Icon Position",
    "description": "Position of icon relative to title",
    "themeable": false,
    "control": "SelectControl",
    "options": ["left", "right", "extreme-left", "extreme-right"]
  },
  "iconSize": {
    "type": "number",
    "default": 1.25,
    "cssVar": "toc-icon-size",
    "group": "icon",
    "label": "Icon Size",
    "description": "Size of the icon in rem",
    "themeable": true,
    "control": "RangeControl",
    "min": 0.6,
    "max": 3,
    "step": 0.01,
    "unit": "rem"
  },
  "iconTypeClosed": {
    "type": "string",
    "default": "▾",
    "group": "icon",
    "label": "Closed Icon",
    "description": "Icon when TOC is collapsed",
    "themeable": false,
    "control": "IconPicker"
  },
  "iconTypeOpen": {
    "type": "string",
    "default": "none",
    "group": "icon",
    "label": "Open Icon",
    "description": "Icon when TOC is expanded (none = use iconTypeClosed with rotation)",
    "themeable": false,
    "control": "IconPicker"
  },
  "iconRotation": {
    "type": "number",
    "default": 180,
    "cssVar": "toc-icon-rotation",
    "group": "icon",
    "label": "Icon Rotation",
    "description": "Rotation angle when open (degrees)",
    "themeable": true,
    "control": "RangeControl",
    "min": -360,
    "max": 360,
    "unit": "deg"
  },
  "iconColor": {
    "type": "string",
    "default": "#666666",
    "cssVar": "toc-icon-color",
    "group": "icon",
    "label": "Icon Color",
    "description": "Color of the expand/collapse icon",
    "themeable": true,
    "control": "ColorPicker"
  }
}
```

**Remove these attributes:**
- `collapseIconColor` (replace with `iconColor`)
- `collapseIconSize` (replace with `iconSize`)

### 1.3 Header Colors & Typography

**Update header color attributes:**

```json
{
  "titleColor": {
    "group": "headerColors"  // Move from titleColors to headerColors
  },
  "titleBackgroundColor": {
    "default": "transparent",  // Keep transparent default
    "group": "headerColors"
  }
}
```

**Add hover states:**

```json
{
  "hoverTitleColor": {
    "type": "string",
    "default": "#000000",
    "cssVar": "toc-title-hover-color",
    "state": "hover",
    "group": "headerColors",
    "label": "Header Hover Text Color",
    "description": "Text color when hovering over title",
    "themeable": true,
    "control": "ColorPicker"
  },
  "hoverTitleBackgroundColor": {
    "type": "string",
    "default": "transparent",
    "cssVar": "toc-title-hover-bg",
    "state": "hover",
    "group": "headerColors",
    "label": "Header Hover Background",
    "description": "Background color when hovering over title",
    "themeable": true,
    "control": "ColorPicker"
  }
}
```

**Update typography attributes:**

Move existing title typography to `headerTypography` group and add missing attributes:

```json
{
  "titleFontSize": {
    "group": "headerTypography"
  },
  "titleFontWeight": {
    "group": "headerTypography"
  },
  "titleTextTransform": {
    "group": "headerTypography"
  },
  "titleAlignment": {
    "group": "headerTypography"
  },
  "titleFontStyle": {
    "type": "string",
    "default": "normal",
    "cssVar": "toc-title-font-style",
    "group": "headerTypography",
    "label": "Header Font Style",
    "themeable": true,
    "control": "SelectControl",
    "options": [
      { "label": "Normal", "value": "normal" },
      { "label": "Italic", "value": "italic" },
      { "label": "Oblique", "value": "oblique" }
    ]
  },
  "titleTextDecoration": {
    "type": "string",
    "default": "none",
    "cssVar": "toc-title-text-decoration",
    "group": "headerTypography",
    "label": "Header Text Decoration",
    "themeable": true,
    "control": "SelectControl",
    "options": [
      { "label": "None", "value": "none" },
      { "label": "Underline", "value": "underline" },
      { "label": "Overline", "value": "overline" },
      { "label": "Line Through", "value": "line-through" }
    ]
  }
}
```

### 1.4 External Borders

**Rename group and update structure:**

```json
{
  "groups": {
    "externalBorders": {
      "title": "External Borders",
      "description": "TOC wrapper borders, radius, and shadows",
      "order": 2,
      "initialOpen": false
    }
  }
}
```

Update existing border attributes to use this group (rename from `blockBorders`):
- `blockBorderColor` → group: `externalBorders`
- `blockBorderWidth` → group: `externalBorders`
- `blockBorderStyle` → group: `externalBorders`
- `blockBorderRadius` → group: `externalBorders`
- `blockShadow` → group: `externalBorders`
- `blockShadowHover` → group: `externalBorders`

### 1.5 Filter System Changes

**Update filterMode options:**

```json
{
  "filterMode": {
    "type": "string",
    "default": "no-filter",
    "group": "blockOptions",
    "label": "Class Filter Mode",
    "description": "Filter headings by CSS class",
    "themeable": false,
    "control": "SelectControl",
    "options": [
      "no-filter",
      "include-with-class",
      "exclude-with-class"
    ]
  }
}
```

**Replace depthLimit with heading level selector:**

Remove:
```json
{
  "depthLimit": { ... }
}
```

Add:
```json
{
  "includeH1": {
    "type": "boolean",
    "default": false,
    "group": "blockOptions",
    "label": "Include H1",
    "description": "Include H1 headings in TOC",
    "themeable": false,
    "control": "ToggleControl",
    "order": 6.1
  },
  "includeH2": {
    "type": "boolean",
    "default": true,
    "group": "blockOptions",
    "label": "Include H2",
    "themeable": false,
    "control": "ToggleControl",
    "order": 6.2
  },
  "includeH3": {
    "type": "boolean",
    "default": true,
    "group": "blockOptions",
    "label": "Include H3",
    "themeable": false,
    "control": "ToggleControl",
    "order": 6.3
  },
  "includeH4": {
    "type": "boolean",
    "default": true,
    "group": "blockOptions",
    "label": "Include H4",
    "themeable": false,
    "control": "ToggleControl",
    "order": 6.4
  },
  "includeH5": {
    "type": "boolean",
    "default": true,
    "group": "blockOptions",
    "label": "Include H5",
    "themeable": false,
    "control": "ToggleControl",
    "order": 6.5
  },
  "includeH6": {
    "type": "boolean",
    "default": true,
    "group": "blockOptions",
    "label": "Include H6",
    "themeable": false,
    "control": "ToggleControl",
    "order": 6.6
  }
}
```

**Update includeLevels and excludeLevels:**
- They will be derived from includeH1-includeH6 toggles

### 1.6 Position Type

**Update positionType options:**

```json
{
  "positionType": {
    "type": "string",
    "default": "normal",
    "group": "blockOptions",
    "label": "Position Type",
    "description": "CSS positioning type",
    "themeable": false,
    "control": "SelectControl",
    "options": [
      "normal",
      "sticky",
      "fixed"
    ]
  }
}
```

Change default from `"default"` to `"normal"`.

### 1.7 Click Behavior Dependency

**Update clickBehavior visibility:**

```json
{
  "clickBehavior": {
    "type": "string",
    "default": "navigate",
    "group": "blockOptions",
    "label": "Click Behavior",
    "description": "What happens when clicking a TOC item",
    "themeable": false,
    "control": "SelectControl",
    "options": [
      "navigate",
      "navigate-and-collapse"
    ],
    "showWhen": {
      "isCollapsible": [true]
    }
  }
}
```

Add `showWhen` condition so it only appears when `isCollapsible` is true.

### 1.8 Link Colors Restructure

**Update link colors group:**

```json
{
  "groups": {
    "linkColors": {
      "title": "Link Colors",
      "description": "Colors for TOC links (all text in TOC is a link)",
      "order": 5,
      "initialOpen": false
    }
  }
}
```

**Add unified color control option:**

```json
{
  "unifiedLinkColors": {
    "type": "boolean",
    "default": true,
    "group": "linkColors",
    "label": "Same Colors for All Levels",
    "description": "Use the same link colors for all heading levels",
    "themeable": false,
    "control": "ToggleControl",
    "order": 0
  }
}
```

**Update existing link color attributes:**

```json
{
  "linkColor": {
    "label": "Link Color (General)",
    "description": "Default color for all TOC links",
    "showWhen": {
      "unifiedLinkColors": [true]
    }
  },
  "linkHoverColor": {
    "showWhen": {
      "unifiedLinkColors": [true]
    }
  },
  "linkActiveColor": {
    "showWhen": {
      "unifiedLinkColors": [true]
    }
  },
  "linkVisitedColor": {
    "showWhen": {
      "unifiedLinkColors": [true]
    }
  }
}
```

**Update heading-specific colors:**

For each heading level (h1-h6), update the color attribute:

```json
{
  "h1Color": {
    "label": "H1 Link Color",
    "description": "Link color for H1 headings (inherits general color if not set)",
    "default": "inherit",
    "showWhen": {
      "unifiedLinkColors": [false]
    }
  }
  // Repeat for h2Color, h3Color, h4Color, h5Color, h6Color
}
```

**Add heading-specific hover/visited/active states:**

```json
{
  "h1HoverColor": {
    "type": "string",
    "default": "inherit",
    "cssVar": "toc-h1-hover-color",
    "group": "headingStyles",
    "label": "H1 Hover Color",
    "themeable": true,
    "control": "ColorPicker",
    "state": "hover",
    "showWhen": {
      "unifiedLinkColors": [false]
    }
  },
  "h1VisitedColor": {
    "type": "string",
    "default": "inherit",
    "cssVar": "toc-h1-visited-color",
    "group": "headingStyles",
    "label": "H1 Visited Color",
    "themeable": true,
    "control": "ColorPicker",
    "state": "visited",
    "showWhen": {
      "unifiedLinkColors": [false]
    }
  },
  "h1ActiveColor": {
    "type": "string",
    "default": "inherit",
    "cssVar": "toc-h1-active-color",
    "group": "headingStyles",
    "label": "H1 Active Color",
    "themeable": true,
    "control": "ColorPicker",
    "state": "active",
    "showWhen": {
      "unifiedLinkColors": [false]
    }
  }
  // Repeat for h2, h3, h4, h5, h6
}
```

**Remove numberingColor attribute:**

Numbering color per level, will now inherit from the general link color excepts if user changes it specifically.
---

## Phase 2: Component Structure Refactoring

### 2.1 Update save.js

**Adopt accordion-like structure:**

```jsx
<div {...blockProps}>
  {/* Header Section */}
  <div className="toc-header-wrapper">
    {renderHeader()}
  </div>

  {/* Content Section */}
  <nav className="toc-content" {...contentAria}>
    <ul className="toc-list">
      {/* List items */}
    </ul>
  </nav>
</div>
```

**Implement renderIcon() function:**

Similar to accordion's icon rendering:
- Check `showIcon` attribute
- Render based on `iconPosition` (left, right, extreme-left, extreme-right)
- Use `iconTypeClosed` and `iconTypeOpen`
- Apply `iconRotation` when expanded

**Implement renderHeader() function:**

```jsx
const renderHeader = () => {
  if (!showTitle && !isCollapsible) {
    return null;
  }

  const iconElement = renderIcon();
  const hasIcon = !!iconElement;

  // If collapsible, render as button
  if (isCollapsible) {
    return renderCollapsibleHeader(iconElement, hasIcon);
  }

  // If not collapsible, render as static title
  return renderStaticHeader();
};
```

**Icon positioning logic:**

```jsx
const getHeaderContent = (iconElement, hasIcon) => {
  const iconPosition = attributes.iconPosition || 'right';

  if (iconPosition === 'extreme-left') {
    return (
      <>
        {hasIcon && <span className="toc-icon-slot">{iconElement}</span>}
        <span className="toc-title-text">{titleText}</span>
      </>
    );
  } else if (iconPosition === 'extreme-right') {
    return (
      <>
        <span className="toc-title-text">{titleText}</span>
        {hasIcon && <span className="toc-icon-slot">{iconElement}</span>}
      </>
    );
  } else if (iconPosition === 'left') {
    return (
      <div className="toc-title-inline">
        {hasIcon && iconElement}
        <span className="toc-title-text">{titleText}</span>
      </div>
    );
  } else { // right
    return (
      <div className="toc-title-inline">
        <span className="toc-title-text">{titleText}</span>
        {hasIcon && iconElement}
      </div>
    );
  }
};
```

**Update class names:**

```jsx
const classNames = ['gutplus-toc', `toc-position-${positionType}`];

// Add open state class
if (!initiallyCollapsed) {
  classNames.push('is-open');
}

// Add theme class
if (attributes.currentTheme) {
  const safeThemeId = attributes.currentTheme.replace(/[^a-zA-Z0-9\-]/g, '');
  classNames.push(`gutplus-toc-theme-${safeThemeId}`);
}

// Add icon position class
if (attributes.iconPosition) {
  classNames.push(`icon-${attributes.iconPosition}`);
}
```

### 2.2 Update edit.js

**Update editor controls:**

- Add icon controls panel (based on accordion)
- Update header colors panel with hover states
- Update typography panel with new attributes
- Add heading level selection grid (2x3 buttons for h1-h6)
- Update filter mode dropdown with new options
- Add conditional rendering for clickBehavior (only when collapsible)

**Implement heading level selector UI:**

```jsx
<PanelBody title="Include in TOC" initialOpen={true}>
  <div className="heading-level-grid" style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  }}>
    {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((level, index) => (
      <Button
        key={level}
        variant={attributes[`include${level}`] ? 'primary' : 'secondary'}
        onClick={() => {
          setAttributes({
            [`include${level}`]: !attributes[`include${level}`]
          });
        }}
      >
        {level}
      </Button>
    ))}
  </div>
  <p className="components-base-control__help">
    Select which heading levels to include in the table of contents
  </p>
</PanelBody>
```

**Update link colors panel:**

```jsx
<PanelBody title="Link Colors" initialOpen={false}>
  <ToggleControl
    label="Same Colors for All Levels"
    checked={attributes.unifiedLinkColors}
    onChange={(value) => setAttributes({ unifiedLinkColors: value })}
  />

  {attributes.unifiedLinkColors ? (
    <>
      <ColorPicker label="Link Color" value={attributes.linkColor} ... />
      <ColorPicker label="Hover Color" value={attributes.linkHoverColor} ... />
      <ColorPicker label="Active Color" value={attributes.linkActiveColor} ... />
      <ColorPicker label="Visited Color" value={attributes.linkVisitedColor} ... />
    </>
  ) : (
    <>
      {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(level => (
        <div key={level}>
          <h4>{level.toUpperCase()} Colors</h4>
          <ColorPicker label="Link" value={attributes[`${level}Color`]} ... />
          <ColorPicker label="Hover" value={attributes[`${level}HoverColor`]} ... />
          <ColorPicker label="Visited" value={attributes[`${level}VisitedColor`]} ... />
          <ColorPicker label="Active" value={attributes[`${level}ActiveColor`]} ... />
        </div>
      ))}
    </>
  )}
</PanelBody>
```

### 2.3 Update frontend.js

**Update collapsible behavior:**

Adopt accordion's toggle logic:
- Icon rotation instead of display toggle for icon
- Use proper ARIA attributes
- Handle icon swap if `iconTypeOpen !== 'none'`

**Update toggle function:**

```javascript
const toggle = () => {
  const isCurrentlyCollapsed = content.hasAttribute('hidden');
  const icon = toggleButton.querySelector('.toc-icon');

  if (isCurrentlyCollapsed) {
    // Expand
    content.removeAttribute('hidden');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.classList.add('is-open');

    if (icon) {
      const iconOpen = toggleButton.getAttribute('data-icon-open');
      const rotation = parseInt(toggleButton.getAttribute('data-icon-rotation') || '180');

      if (iconOpen && iconOpen !== 'none') {
        icon.textContent = iconOpen;
      } else {
        icon.style.transform = `rotate(${rotation}deg)`;
      }
    }
  } else {
    // Collapse
    content.setAttribute('hidden', 'true');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.classList.remove('is-open');

    if (icon) {
      const iconClosed = toggleButton.getAttribute('data-icon-closed');
      icon.textContent = iconClosed;
      icon.style.transform = 'rotate(0deg)';
    }
  }
};
```

**Update heading detection:**

```javascript
const detectHeadings = (tocBlock, config) => {
  const contentArea = document.querySelector('.entry-content, main, article, body');
  if (!contentArea) return [];

  // Build heading selector based on includeH1-includeH6
  const selectors = [];
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((level, index) => {
    const includeAttr = config[`include${level.toUpperCase()}`];
    if (includeAttr !== false) {
      selectors.push(level);
    }
  });

  if (selectors.length === 0) return [];

  const allHeadings = contentArea.querySelectorAll(selectors.join(', '));
  // ... rest of detection logic
};
```

**Don't render icon when showIcon is false:**

```javascript
if (!config.showIcon) {
  // Don't add icon to header
  // Clicking on header should not collapse/expand
  return;
}
```

---

## Phase 3: Styling Updates

### 3.1 Update style.scss

**Adopt accordion structure:**

```scss
.gutplus-toc {
  // Wrapper styles

  .toc-header-wrapper {
    // Similar to accordion-title-wrapper
  }

  .toc-title {
    // Title/header styles
    // Add hover state support

    &:hover {
      color: var(--toc-title-hover-color);
      background-color: var(--toc-title-hover-bg);
    }
  }

  .toc-icon {
    // Icon styles
    color: var(--toc-icon-color);
    font-size: var(--toc-icon-size);
    transition: transform 0.3s ease;
  }

  .toc-title.icon-left,
  .toc-title.icon-right,
  .toc-title.icon-extreme-left,
  .toc-title.icon-extreme-right {
    // Icon positioning layouts (copy from accordion)
  }

  &.is-open .toc-icon {
    transform: rotate(var(--toc-icon-rotation, 180deg));
  }

  .toc-content {
    // Content area

    &[hidden] {
      display: none;
    }
  }
}
```

**Add external borders support:**

```scss
.gutplus-toc {
  border: var(--toc-border-width) var(--toc-border-style) var(--toc-border-color);
  border-radius: var(--toc-border-radius);
  box-shadow: var(--toc-border-shadow);

  &:hover {
    box-shadow: var(--toc-border-shadow-hover);
  }
}
```

**Update position type styles:**

```scss
.toc-position-normal {
  position: static;
}

.toc-position-sticky {
  position: sticky;
  top: var(--toc-position-top);
  z-index: var(--toc-z-index);
}

.toc-position-fixed {
  position: fixed;
  top: var(--toc-position-top);
  z-index: var(--toc-z-index);
}
```

**Add link color support:**

```scss
.toc-link {
  color: var(--toc-link-color);

  &:hover {
    color: var(--toc-link-hover-color);
  }

  &:visited {
    color: var(--toc-link-visited-color);
  }

  &:active,
  &.active {
    color: var(--toc-link-active-color);
  }
}

// Per-heading level colors (when unifiedLinkColors is false)
.toc-h1 .toc-link {
  color: var(--toc-h1-color);

  &:hover {
    color: var(--toc-h1-hover-color, var(--toc-link-hover-color));
  }

  &:visited {
    color: var(--toc-h1-visited-color, var(--toc-link-visited-color));
  }

  &:active,
  &.active {
    color: var(--toc-h1-active-color, var(--toc-link-active-color));
  }
}

// Repeat for h2-h6
```

**Numbering inherits link color:**

```scss
.toc-list {
  &::marker,
  &::before {
    color: inherit; // Inherits from parent link color
  }
}
```

### 3.2 Update editor.scss

**Fix list padding visualization:**

```scss
.gutplus-toc {
  .toc-list {
    padding-left: var(--toc-list-padding-left, 1.5rem);
  }
}
```

**Fix item spacing visualization:**

```scss
.toc-list li {
  margin-bottom: var(--toc-item-spacing, 0.5rem);
}
```

**Add icon preview in editor:**

```scss
.toc-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--toc-icon-color);
  font-size: var(--toc-icon-size);
}
```

### 3.3 Update toc_variables.scss

**Add new CSS variables:**

```scss
:root {
  // Icon variables
  --toc-icon-color: #666666;
  --toc-icon-size: 1.25rem;
  --toc-icon-rotation: 180deg;

  // Header hover states
  --toc-title-hover-color: inherit;
  --toc-title-hover-bg: transparent;

  // Typography
  --toc-title-font-style: normal;
  --toc-title-text-decoration: none;

  // Per-heading hover/visited/active
  --toc-h1-hover-color: inherit;
  --toc-h1-visited-color: inherit;
  --toc-h1-active-color: inherit;
  // ... repeat for h2-h6
}
```

---

## Phase 4: Build System Updates

### 4.1 Schema Build

Run schema build to regenerate:
```bash
npm run schema:build
```

This will regenerate:
- `blocks/toc/src/toc-attributes.js`
- `shared/src/types/toc-theme.ts`
- `shared/src/validators/toc-schema.ts`
- `shared/src/styles/toc-styles-generated.js`
- `shared/src/config/control-config-generated.js`
- `shared/src/config/css-var-mappings-generated.js`
- `php/css-defaults/toc.php`
- `assets/css/toc-variables.css`
- `docs/toc-attributes.md`

### 4.2 Validation

**Update schema validators:**

Ensure new attributes are properly validated in:
- `shared/src/validators/toc-schema.ts`

**Update type definitions:**

Ensure TypeScript types are correct in:
- `shared/src/types/toc-theme.ts`

---

## Phase 5: PHP Backend Updates

### 5.1 Update toc.php

**Update CSS variable generation:**

Add support for new icon variables:
```php
'--toc-icon-color' => $attrs['iconColor'] ?? '#666666',
'--toc-icon-size' => ($attrs['iconSize'] ?? 1.25) . 'rem',
'--toc-icon-rotation' => ($attrs['iconRotation'] ?? 180) . 'deg',
```

Add hover state variables:
```php
'--toc-title-hover-color' => $attrs['hoverTitleColor'] ?? 'inherit',
'--toc-title-hover-bg' => $attrs['hoverTitleBackgroundColor'] ?? 'transparent',
```

Add per-heading color state variables:
```php
for ($i = 1; $i <= 6; $i++) {
  $level = "h{$i}";
  $css_vars["--toc-{$level}-hover-color"] = $attrs["{$level}HoverColor"] ?? 'inherit';
  $css_vars["--toc-{$level}-visited-color"] = $attrs["{$level}VisitedColor"] ?? 'inherit';
  $css_vars["--toc-{$level}-active-color"] = $attrs["{$level}ActiveColor"] ?? 'inherit';
}
```

### 5.2 Update theme system

**Update default theme:**

Ensure default theme includes new attributes with proper defaults.

**Update theme resolver:**

Ensure theme CSS generation includes new variables.

---

## Phase 6: Testing & Verification

### 6.1 Editor Testing

- [ ] Icon appears/disappears based on `showIcon` toggle
- [ ] Icon position changes correctly (left, right, extreme-left, extreme-right)
- [ ] Icon rotation works when toggling collapse/expand
- [ ] Icon swap works when `iconTypeOpen` is set
- [ ] Header hover states work in editor
- [ ] Typography controls all work
- [ ] Heading level grid (h1-h6) works correctly
- [ ] Filter mode dropdown has correct options
- [ ] Click behavior only shows when collapsible is enabled
- [ ] Link color unified/per-level toggle works
- [ ] List padding is visible in editor
- [ ] Item spacing is visible in editor
- [ ] External borders render correctly

### 6.2 Frontend Testing

- [ ] **Smooth scroll**: Verify smooth scrolling works to anchored headings
- [ ] **Position sticky**: Verify TOC stays in viewport when scrolling
- [ ] **Position fixed**: Verify TOC remains fixed in position
- [ ] **Auto highlight**: Verify current section is highlighted on scroll
- [ ] **Scroll offset**: Verify offset is applied when scrolling to headings
- [ ] Icon toggle works (if `showIcon` is true)
- [ ] Icon doesn't render when `showIcon` is false
- [ ] Clicking header doesn't collapse when `showIcon` is false
- [ ] Clicking TOC item navigates correctly
- [ ] Click behavior "navigate-and-collapse" works
- [ ] Hierarchical indentation works correctly (default on)
- [ ] Filter mode filtering works correctly
- [ ] Heading level inclusion (h1-h6) works correctly
- [ ] Link colors display correctly (unified and per-level)
- [ ] Numbering color inherits from link color
- [ ] External borders render correctly
- [ ] Position normal/sticky/fixed work correctly

### 6.3 Compatibility Testing

- [ ] Existing TOC blocks still work (backward compatibility)
- [ ] Themes apply correctly
- [ ] Default values are correct
- [ ] Migration from old attributes to new attributes
- [ ] No hardcoded values remain

---

## Phase 7: Documentation

### 7.1 Update docs/toc-attributes.md

This will be auto-generated from schema, but verify:
- All new attributes are documented
- Descriptions are clear
- Default values are correct
- Dependencies are noted (showWhen conditions)

### 7.2 Create migration guide

Document:
- Changes to attribute names
- New default behaviors
- How to update existing TOC blocks
- Breaking changes (if any)

---

## Implementation Order

### Step 1: Schema Updates (Phase 1)
1. Update `schemas/toc.json` with all new attributes
2. Update groups structure
3. Update defaults
4. Run `npm run schema:build`

### Step 2: Component Updates (Phase 2)
1. Update `save.js` with new structure
2. Update `edit.js` with new controls
3. Update `frontend.js` with new behaviors

### Step 3: Styling (Phase 3)
1. Update `style.scss`
2. Update `editor.scss`
3. Update `toc_variables.scss`

### Step 4: Build & PHP (Phases 4 & 5)
1. Run build and verify generated files ✅
2. Update PHP backend
3. Test theme system

### Step 5: Testing (Phase 6)
1. Editor testing
2. Frontend testing
3. Compatibility testing

### Step 6: Documentation (Phase 7)
1. Verify auto-generated docs
2. Create migration guide

---

## Critical Notes

### ⚠️ Important Considerations

1. **No Divider Line**: Unlike accordion, TOC should NOT have a divider line attribute
2. **Transparent Background**: Default header background should remain transparent
3. **Starts Expanded**: `initiallyCollapsed` must default to `false`
4. **Collapsible On**: `isCollapsible` should default to `true`
5. **H1 Not Selected**: In the heading level selector, H1 should default to unchecked
6. **Hierarchical Indent On**: `enableHierarchicalIndent` should default to `true`
7. **Icon Logic**: When `showIcon` is false, clicking header should NOT collapse/expand
8. **Click Behavior**: Only show when `isCollapsible` is true
9. **Numbering Color**: Should inherit from link color, not be a separate control
10. **Position Type**: Change from "default" to "normal"

### 🔍 Audit Checklist

Before marking complete, verify:
- [ ] No hardcoded values in CSS or JS
- [ ] All accordion attributes are adapted (except divider)
- [ ] All defaults match specification
- [ ] Editor preview matches frontend
- [ ] List padding works in editor
- [ ] Item spacing works in editor
- [ ] All frontend features verified working
- [ ] No console errors
- [ ] Accessibility maintained (ARIA attributes)
- [ ] Performance is acceptable
- [ ] Documentation is complete

---

## References

### Source Files to Modify

**Schema:**
- `schemas/toc.json`

**JavaScript:**
- `blocks/toc/src/edit.js`
- `blocks/toc/src/save.js`
- `blocks/toc/src/frontend.js`

**Styles:**
- `blocks/toc/src/style.scss`
- `blocks/toc/src/editor.scss`
- `blocks/toc/src/toc_variables.scss`

**PHP:**
- `php/css-defaults/toc.php`

**Auto-Generated (via schema:build):**
- `blocks/toc/src/toc-attributes.js`
- `shared/src/types/toc-theme.ts`
- `shared/src/validators/toc-schema.ts`
- `shared/src/styles/toc-styles-generated.js`
- `assets/css/toc-variables.css`
- `docs/toc-attributes.md`

### Reference Files (for inspiration)

**Accordion:**
- `schemas/accordion.json`
- `blocks/accordion/src/edit.js`
- `blocks/accordion/src/save.js`
- `blocks/accordion/src/frontend.js`
- `blocks/accordion/src/style.scss`
- `blocks/accordion/src/accordion_variables.scss`

---

## Success Criteria

The implementation is complete when:

### Phase 1 (Schema) - ✅ COMPLETE
1. ✅ All new attributes are in schema and working
2. ✅ Icon system schema complete (position, rotation, swap)
3. ✅ Header colors and typography in schema
4. ✅ External borders renamed and configured
5. ✅ Filter system uses new options
6. ✅ Heading level selector attributes (includeH1-H6) added
7. ✅ Position type includes "normal" option
8. ✅ Click behavior has showWhen condition
9. ✅ Link colors restructured (unified vs per-level)
10. ✅ Numbering color removed (inherits from link)
11. ✅ Default values updated correctly

### Phase 2 (Components) - ⏳ PENDING
12. ⏳ TOC structure matches accordion pattern (header + content)
13. ⏳ Icon rendering works like accordion
14. ⏳ Heading level selector UI (h1-h6 grid) implemented
15. ⏳ Link color controls (unified toggle) implemented

### Phase 3-7 (Styling, Build, Testing, Docs) - ⏳ PENDING
16. ⏳ List padding visible in editor
17. ⏳ Item spacing visible in editor
18. ⏳ All frontend features verified working
19. ⏳ No hardcoded values remain
20. ⏳ Backward compatibility maintained
21. ⏳ Documentation complete
22. ⏳ All tests passing

---

## ✅ Verification: All TOC.txt Requirements Covered

This section confirms that all requirements from the original TOC.txt file are addressed in this implementation plan:

### ✅ 1. Build TOC structure as accordion
**Requirement:** "Lets build the tock structure as an accordion, making it easier to program the icon and title logic"
- **Covered in:** Phase 2.1 - save.js adopts accordion-like structure with header wrapper and content section
- **Status:** ✅ Planned

### ✅ 2. Same attributes as accordion
**Requirement:** "Will have the same attributes as the accordion (same general structure, with same classes, its already programmed in accordion block)"
- **Covered in:** Phase 1.2 (Icon system), 1.3 (Header colors), 1.4 (Header typography), 1.5 (External borders)
- **Status:** ✅ Complete

### ✅ 3. Header options and icon positioning
**Requirement:** "We add the header options, icon options (open close, rotation, etc) that already exist on the accordion, with same header typography, alignement, icon positioning, left, right, extra left, extra right"
- **Covered in:** Phase 1.2 - showIcon, iconPosition (left/right/extreme-left/extreme-right), iconRotation, iconSize, iconTypeClosed, iconTypeOpen
- **Status:** ✅ Complete

### ✅ 4. External borders (renamed from Block Borders)
**Requirement:** "the same external border attributes radius, style (that exist now as Block Borders, but we'll name it External borders, like accordion)"
- **Covered in:** Phase 1.5 - blockBorders group renamed to externalBorders
- **Status:** ✅ Complete

### ✅ 5. No divider line, transparent header background
**Requirement:** "Unlike accordion, no divisor line attribute, and the default for the header background is transparent"
- **Covered in:** Phase 1.3 - titleBackgroundColor default is "transparent", no divider attributes added
- **Status:** ✅ Complete

### ✅ 6. Audit and comparison
**Requirement:** "You need to make an audit to the accordion and toc elements, and compare them to make this work"
- **Covered in:** Initial audit completed, comparison done, accordion attributes adapted
- **Status:** ✅ Complete

### ✅ 7. Starts expanded, collapsible defaults to true
**Requirement:** "It starts always as expanded (Initially colapsed defaults to false). Collapsible option defaults to true"
- **Covered in:** Phase 1.1 - initiallyCollapsed: false, isCollapsible: true
- **Status:** ✅ Complete

### ✅ 8. Icon toggle logic
**Requirement:** "If the toogle is of, you'll not render the icon, and clicking on the header button wont collapse or expand (accordion logic wont work!)"
- **Covered in:** Phase 2.1 (save.js) and 2.3 (frontend.js) - showIcon controls icon rendering and collapse behavior
- **Status:** ✅ Planned

### ✅ 9. Filter mode changes
**Requirement:** "Filter mode 'Include-all, etc' will be changed. Options will be No class filter, Only include with class or Excluse with class"
- **Covered in:** Phase 1.6 - filterMode options: "no-filter", "include-with-class", "exclude-with-class"
- **Status:** ✅ Complete

### ✅ 10. Depth limit replaced with H1-H6 grid
**Requirement:** "Depth limit function, delete it, no need. Instead, we create a 'Include on toc' with a grid os 2x3 buttons with h1 to h6. By default, h1 is not selected, but the others are"
- **Covered in:** Phase 1.7 - depthLimit removed, includeH1-H6 attributes added (H1 default: false, H2-H6 default: true)
- **Status:** ✅ Complete

### ✅ 11. Click behavior only when collapsible
**Requirement:** "Click behavior is only applyable when Collapsible toogle is on, otherwise, as it can only be navigate, no need to have the option"
- **Covered in:** Phase 1.7 - clickBehavior has showWhen condition (only shows when isCollapsible: true)
- **Status:** ✅ Complete

### ✅ 12. Position type should have "normal"
**Requirement:** "Position type, sticky and fixed, shouldnw we have something like normal also?"
- **Covered in:** Phase 1.6 - positionType default changed from "default" to "normal", options: normal/sticky/fixed
- **Status:** ✅ Complete

### ✅ 13. Frontend features verification
**Requirement:** "Be sure smooth scrool, position fixed and sticky, auto highlight, scrool offset actually work on front end, as this is not visible on editor"
- **Covered in:** Phase 6.2 - Frontend Testing checklist includes all these features
- **Status:** ✅ Planned

### ✅ 14. Link colors unified vs per-level
**Requirement:** "We will have a dropbown that says, 'Same colors for all levels', and user defines the color attributes that will be the same for every level (general color, hover, visited, active). The other option is 'Different colors for each heading'"
- **Covered in:** Phase 1.8 - unifiedLinkColors toggle, general link states (color/hover/visited/active), per-heading states (h1-h6 with hover/visited/active), all per-level defaults: "inherit"
- **Status:** ✅ Complete

### ✅ 15. Numbering color inherits from link
**Requirement:** "numbering color will not be controled as a different coloring, as it will have the same color as the rest of the link"
- **Covered in:** Phase 1.8 - numberingColor attribute removed, Phase 3.1 - CSS updated to inherit numbering from link color
- **Status:** ✅ Complete (schema), ✅ Planned (CSS)

### ✅ 16. List padding and item spacing in editor
**Requirement:** "List padding isnt working on editor, item spacing is not wotking on editor"
- **Covered in:** Phase 3.2 - editor.scss updated to fix list padding and item spacing visualization
- **Status:** ✅ Planned

### ✅ 17. Hierarchical indentation on by default
**Requirement:** "enable hierarvhical identation is on by default, this is what controls identation, otherwise all headings are at the same level (check if there are not hardcoded values anywhere for this)"
- **Covered in:** Phase 1.1 - enableHierarchicalIndent default changed to true, Phase 6.3 - verify no hardcoded values
- **Status:** ✅ Complete (default), ✅ Planned (verification)

### Summary

**Total Requirements from TOC.txt:** 17
**Requirements Fully Addressed:** 17 (100%)
**Requirements Complete:** 11
**Requirements Planned:** 6

All requirements from the original TOC.txt file are comprehensively covered in this implementation plan. Phase 1 (Schema) is complete, and Phases 2-7 will implement the remaining component, styling, and testing requirements.
