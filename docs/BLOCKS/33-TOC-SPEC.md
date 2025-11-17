# Table of Contents (TOC) Block - Complete Implementation Specification

## Overview

This document defines the complete implementation specification for an automatic **Table of Contents (TOC)** block for WordPress Gutenberg. The TOC block automatically scans post content for headings and generates a navigable, styled table of contents with advanced filtering, numbering, and behavior options.

**Block Type**: `wp:custom/toc` (single standalone block)

**Purpose**: Provide an accessible, customizable, and performant table of contents that automatically reflects the structure of any WordPress post or page.

**Shared Architecture Note**: The TOC block follows the same architectural patterns as Accordion and Tabs blocks, using shared infrastructure from `src/shared/` including theme management, CSS parsing, UI components, and utilities. Each block has its own CSS file (`toc.css`) and theme storage (`toc_themes`), but uses identical architecture.

---

## Table of Contents

1. [Block Architecture](#1-block-architecture)
2. [Core Features Overview](#2-core-features-overview)
3. [Heading Detection & Filtering](#3-heading-detection--filtering)
4. [Numbering System](#4-numbering-system)
5. [Collapsible Behavior (Optional)](#5-collapsible-behavior-optional)
6. [Typography System](#6-typography-system)
7. [Color System](#7-color-system)
8. [Border & Spacing](#8-border--spacing)
9. [Layout & Positioning](#9-layout--positioning)
10. [Scroll Behavior](#10-scroll-behavior)
11. [Mobile Responsiveness](#11-mobile-responsiveness)
12. [Inspector Sidebar Panels](#12-inspector-sidebar-panels)
13. [Block Attributes Schema](#13-block-attributes-schema)
14. [Theme System Integration](#14-theme-system-integration)
15. [Shared Modules Reused](#15-shared-modules-reused)
16. [New TOC-Specific Modules](#16-new-toc-specific-modules)
17. [HTML Output Structure](#17-html-output-structure)
18. [CSS Structure](#18-css-structure)
19. [JavaScript Requirements](#19-javascript-requirements)
20. [Implementation Phases](#20-implementation-phases)
21. [Testing Checklist](#21-testing-checklist)

---

## 1. Block Architecture

### Integration with Shared Architecture

The TOC block is implemented using the established shared architecture pattern:

**Shared Infrastructure** (`src/shared/`):
- Theme system (create, update, delete, switch themes)
- 3-tier cascade resolution (CSS defaults → Theme → Block customizations)
- CSS parsing system (single source of truth)
- UI components (ThemeSelector, ColorPanel, TypographyPanel, BorderPanel)
- Utilities (ID generation, validation, ARIA helpers)

**TOC-Specific** (`blocks/toc/`):
- Heading detection and filtering logic
- smooth scroll behavior
- Sticky/fixed positioning logic
- TOC-specific attributes and UI panels
- `toc.css` with `:root` variable defaults
- Database storage: `toc_themes` option

### Block Identity

```javascript
{
  blockName: 'custom/toc',
  title: 'Table of Contents',
  category: 'layout',
  icon: 'list-view',
  supports: {
    html: false,
    multiple: true // Multiple TOC blocks allowed per post
  }
}
```

**Multiple Blocks Allowed**: Unlike some TOC implementations, this system allows multiple independent TOC blocks per post. Each can have different filtering, styling, and positioning options.

---

## 2. Core Features Overview

### 2.1 Automatic Heading Detection

**Purpose**: Scan post content for all headings (H1-H6) and build navigable list.

**Behavior**:
- Runs on block mount and when post content changes
- Detects all heading elements in post content
- Extracts heading text, level (H1-H6), and generates anchor IDs
- Builds hierarchical structure (nested list)
- Updates automatically when content changes

**Implementation**: Client-side JavaScript scans DOM for heading elements outside the TOC block itself.

### 2.2 Flexible Filtering System

**Three Modes**:
1. **Include All Headings** (default) - All H2-H6 headings included
2. **Include Only Selected** - Specific levels + CSS classes only
3. **Exclude Selected** - All except specific levels + CSS classes

**Filtering Options**:
- Heading levels (H2-H6 multi-select) - H1 excluded by default
- CSS class matching (comma-separated input)
- Depth limit (maximum nesting levels to show)

### 2.3 Optional Title

**Purpose**: Display "Table of Contents" heading above the list.

**Options**:
- Toggle show/hide title
- Editable title text (default: "Table of Contents")
- Full typography control
- Uses Level 1 typography settings

### 2.4 Collapsible Behavior (Optional)

**Purpose**: Allow TOC to collapse/expand like accordion.

**Default**: OFF - TOC is always expanded

**When Enabled**: Reuses ALL accordion collapse logic from shared modules:
- Uses shared `useAccordionToggle` hook
- Uses shared ARIA attribute management
- Uses shared keyboard navigation
- Title becomes clickable toggle button
- If there is no title, add a Icon like button to the top right so we can click
- Icon shows expand/collapse state

**Key Point**: This is optional behavior. The TOC block doesn't need collapsible functionality to work.

### 2.5 Advanced Numbering Styles

**Purpose**: Add numbered/bulleted prefixes to TOC entries.

**Styles**:
- None (bullets only, default)
- Decimal (1, 1.1, 1.1.1)
- Decimal Leading Zero (01, 01.01, 01.01.01)
- Roman Numerals (I, II, III, IV)
- Letters (A, B, C, ... Z, AA, AB)
- Custom per-level (e.g., 1. for L1, a. for L2, • for L3)

**Implementation**: Generated via CSS `counter-reset` and `counter-increment`, or JavaScript for complex patterns.

### 2.6 Per-Level Typography

**Purpose**: Different text styling for each nesting level.

**Levels**:
- **Level 1** (H2) - Largest, boldest
- **Level 2** (H3) - Medium
- **Level 3+** (H4-H6) - Grouped together, smallest

**Settings per Level**:
- Font size
- Font weight
- Font style (normal/italic)
- Text transform (none/uppercase/lowercase/capitalize)
- Text decoration (none/underline)
- Color (with "use link color" inheritance option)

**Inheritance Option**: "Inherit from previous level" checkbox for cascading styles.

### 2.7 Comprehensive Colors

**Color Attributes**:
- **Wrapper**: Background, border
- **Title**: Text color, background color (if title enabled)
- **Links**: Default, hover, visited
- **Numbering**: Color (with "use link color" toggle)

**Null Inheritance**: Many colors default to `null` and inherit from other colors:
- Numbering color → link color
- Level 2 color → Level 1 color (if inheritance enabled)
- Level 3+ color → Level 2 color (if inheritance enabled)

### 2.8 Sticky/Fixed Positioning

**Purpose**: Keep TOC visible while scrolling (common UX pattern).

**Position Options**:
- **Block** (default) - Normal document flow
- **Sticky** - Sticks to viewport when scrolling
- **Fixed** - Fixed position relative to viewport

**Position Settings** (when sticky/fixed):
- Top offset (px)
- Right offset (px)
- Bottom offset (px) - for sticky bottom
- Left offset (px)


### 2.10 Smooth Scroll

**Purpose**: Animated scrolling when clicking TOC links.

**Options**:
- Enable/disable smooth scroll (default: enabled)
- Scroll offset (px) - Useful for fixed headers
- Click behavior: Navigate only, or navigate + collapse TOC

---

## 3. Heading Detection & Filtering

### 3.1 Heading Detection Process

**Algorithm**:
```javascript
function detectHeadings(postContentContainer) {
  // 1. Select all headings outside the TOC block
  const allHeadings = postContentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');

  // 2. Filter out headings inside TOC blocks
  const validHeadings = Array.from(allHeadings).filter(heading => {
    return !heading.closest('.wp-block-custom-toc');
  });

  // 3. Extract heading data
  const headingData = validHeadings.map(heading => ({
    level: parseInt(heading.tagName.charAt(1)), // 1-6
    text: heading.textContent.trim(),
    id: heading.id || generateHeadingId(heading),
    classes: Array.from(heading.classList),
    element: heading
  }));

  // 4. Apply filters
  const filteredHeadings = applyFilters(headingData, filterSettings);

  // 5. Build hierarchy
  const tocStructure = buildHierarchy(filteredHeadings);

  return tocStructure;
}
```

**Heading ID Generation**:
- If heading has existing `id` attribute: use it
- If not: generate from heading text (slugify)
- Ensure uniqueness with counter suffix if needed
- Example: "Getting Started" → `getting-started`

**Auto-add IDs to Headings**: Option to automatically add `id` attributes to headings without them (default: ON).
ID follows the 4 digits [0-9][a-z] logic as the other blocks.

### 3.2 Filtering Modes

#### Mode 1: Include All Headings (Default)

**Behavior**: Include all H2-H6 headings (H1 excluded by default as it's usually page title).

**Settings**:
- No level selection needed
- CSS class filter still applies (if specified)
- Depth limit still applies (if specified)

**Use Case**: General purpose TOC for most posts.

#### Mode 2: Include Only Selected

**Behavior**: Only include headings matching selected levels AND CSS classes (if specified).

**Settings**:
- Multi-select for levels (H2-H6)
- Optional CSS class filter (comma-separated, OR logic)
- Optional depth limit

**Logic**:
```javascript
function matchesIncludeFilter(heading, settings) {
  // Must match level
  const levelMatch = settings.includeLevels.includes(heading.level);
  if (!levelMatch) return false;

  // If CSS classes specified, must match at least one
  if (settings.includeClasses.length > 0) {
    const classMatch = settings.includeClasses.some(cls =>
      heading.classes.includes(cls)
    );
    return classMatch;
  }

  return true; // Level matched, no class filter
}
```

**Use Case**: Show only H2 and H3, or only headings with `.important` class.

#### Mode 3: Exclude Selected

**Behavior**: Include all headings EXCEPT those matching selected levels OR CSS classes.

**Settings**:
- Multi-select for levels to exclude
- Optional CSS class filter (comma-separated, OR logic)
- Optional depth limit

**Logic**:
```javascript
function matchesExcludeFilter(heading, settings) {
  // Exclude if level matches
  if (settings.excludeLevels.includes(heading.level)) {
    return false;
  }

  // Exclude if any class matches
  if (settings.excludeClasses.length > 0) {
    const classMatch = settings.excludeClasses.some(cls =>
      heading.classes.includes(cls)
    );
    if (classMatch) return false;
  }

  return true; // Not excluded
}
```

**Use Case**: Exclude H4-H6 for high-level overview, or exclude `.no-toc` class.

### 3.3 CSS Class Filtering

**Input**: Comma-separated class names (e.g., `important, highlight, section-title`)

**Logic**: OR matching - heading matches if it has ANY of the specified classes.

**Case Sensitivity**: Case-sensitive matching (CSS class names are case-sensitive).

**Example**:
```html
<!-- Include Classes: "important, highlight" -->
<h2>Normal Heading</h2>         <!-- Not included -->
<h2 class="important">Big</h2>  <!-- Included ✓ -->
<h3 class="highlight">Key</h3>  <!-- Included ✓ -->
<h3 class="other">Small</h3>    <!-- Not included -->
```

### 3.4 Depth Limit

**Purpose**: Limit maximum nesting levels shown in TOC.

**Default**: `null` (no limit, show all levels)

**Values**: 1-6 (limit to N levels deep)

**Behavior**:
- Applied AFTER level and class filtering
- Counts from top-level heading shown (not from H1)
- Example: Depth 2 shows parent and child only

**Example**:
```
Post structure:      Depth 1:    Depth 2:         Depth 3 (no limit):
H2 Introduction      • Intro     • Introduction   • Introduction
  H3 Overview                      - Overview       - Overview
  H3 Goals                         - Goals          - Goals
H2 Getting Started   • Getting   • Getting          - Prereqs
  H3 Prerequisites     Started      - Prereqs      • Getting Started
  H3 Installation                   - Install        - Prerequisites
H2 Advanced          • Advanced  • Advanced         - Installation
  H3 Config                         - Config       • Advanced
    H4 Options                                       - Configuration
                                                       • Options
```

### 3.5 Automatic Updates

**Triggers**: TOC rebuilds automatically when:
- Block mounts (page load)
- Post content changes (editor)
- Filter settings change
- Headings added/removed/edited

**Implementation**:
- Editor: `useEffect` hook watching post content
- Frontend: MutationObserver watching content changes (optional, for live preview)

---

## 4. Numbering System

### 4.1 Numbering Styles

#### None (Default)

**Output**: No numbers, just bullets or plain list.

**CSS**:
```css
.toc-list {
  list-style-type: disc; /* or none */
}
```

#### Decimal

**Pattern**: 1, 1.1, 1.1.1, 1.1.2, 1.2, 2, 2.1, ...

**CSS Implementation**:
```css
.toc-list {
  counter-reset: toc-level-1;
}

.toc-item-level-1 {
  counter-increment: toc-level-1;
}

.toc-item-level-1::before {
  content: counter(toc-level-1) ". ";
}

.toc-item-level-1 .toc-list {
  counter-reset: toc-level-2;
}

.toc-item-level-2 {
  counter-increment: toc-level-2;
}

.toc-item-level-2::before {
  content: counter(toc-level-1) "." counter(toc-level-2) ". ";
}

/* Continue for level 3, 4, 5, 6 */
```

#### Decimal Leading Zero

**Pattern**: 01, 01.01, 01.01.01, 01.01.02, 01.02, 02, 02.01, ...

**CSS**: Same as decimal, but use `counter(name, decimal-leading-zero)`

#### Roman Numerals

**Pattern**: I, II, III, IV, I.i, I.ii, II.i, ...

**CSS**:
```css
.toc-item-level-1::before {
  content: counter(toc-level-1, upper-roman) ". ";
}

.toc-item-level-2::before {
  content: counter(toc-level-1, upper-roman) "." counter(toc-level-2, lower-roman) ". ";
}
```

#### Letters

**Pattern**: A, B, C, ..., Z, AA, AB, ...

**CSS**:
```css
.toc-item-level-1::before {
  content: counter(toc-level-1, upper-alpha) ". ";
}

.toc-item-level-2::before {
  content: counter(toc-level-1, upper-alpha) "." counter(toc-level-2, lower-alpha) ". ";
}
```

#### Custom Per-Level

**Purpose**: Different numbering for each level.

**Example**: Level 1 = decimal, Level 2 = letters, Level 3+ = bullets

**Attributes**:
```javascript
{
  numberingStyle: 'custom',
  customNumberingLevel1: 'decimal',     // 1, 2, 3
  customNumberingLevel2: 'lower-alpha', // a, b, c
  customNumberingLevel3: 'disc'         // • • •
}
```

**CSS**: Generate separate `::before` rules for each level with specified counter style.

### 4.2 Numbering Color

**Attribute**: `numberingColor` (string, customizable)

**Default**: `null` (inherits from `linkColor`)

**Options**:
- Explicit color (e.g., `#666666`)
- `null` - Use link color (with "Use link color" checkbox in UI)

**Implementation**:
```css
.toc-item::before {
  color: var(--custom-numbering-color, var(--custom-link-color, var(--toc-default-link-color)));
}
```

**Null Inheritance**: When `null`, resolved at runtime to `linkColor`.

---

## 5. Collapsible Behavior (Optional)

### 5.1 Toggle Setting

**Attribute**: `isCollapsible` (boolean, customizable)

**Default**: `false` (TOC always expanded)

**Purpose**: Allow TOC to collapse/expand like accordion to save space.

### 5.2 Reusing Accordion Logic

**Key Principle**: When `isCollapsible === true`, the TOC block reuses ALL accordion collapse logic:

**Shared Modules**:
- `src/shared/hooks/useAccordionToggle.js` - Toggle state management
- `src/shared/utils/aria-helpers.js` - ARIA attribute updates
- `src/shared/utils/keyboard-nav.js` - Enter/Space key handling
- `src/shared/components/CollapsiblePanel.js` - Reusable collapse component

**HTML Structure** (when collapsible):
```html
<div class="wp-block-custom-toc toc-collapsible" data-collapsible="true">
  <button
    type="button"
    class="toc-toggle"
    aria-expanded="false"
    aria-controls="toc-content-abc123"
    id="toc-toggle-abc123"
  >
    <span class="toc-title">Table of Contents</span>
    <span class="toc-icon" aria-hidden="true">▾</span>
  </button>

  <div
    id="toc-content-abc123"
    role="region"
    aria-labelledby="toc-toggle-abc123"
    class="toc-content"
    hidden
  >
    <nav class="toc-nav">
      <!-- TOC list here -->
    </nav>
  </div>
</div>
```

**Behavior**:
- Title becomes clickable button (if title enabled)
- Icon shows expand/collapse state (reuses accordion icon system)
- Enter/Space keys toggle collapse
- ARIA attributes update on state change
- Optional animation (reuses accordion animation)
- If no title, an icon inside the div, on top right that allows a collapse and open

### 5.3 Initial State (Collapsible)

**Attribute**: `initiallyCollapsed` (boolean, customizable)

**Default**: `false` (starts expanded)

**Only Applies When**: `isCollapsible === true`

**Frontend**: Adds `hidden` attribute if `true`.

**Editor**: Always shows expanded for editing convenience.

### 5.4 Non-Collapsible Sections

**Important**: Individual TOC sections (Level 1, Level 2, etc.) do NOT collapse independently.

The collapse functionality is for the ENTIRE TOC block, not individual headings within it. The TOC list is always flat when expanded.

---

## 6. Typography System

### 6.1 Typography Levels

**Three Levels** (grouped by heading hierarchy):

1. **Level 1 Typography** - Applies to H2 headings (top-level)
2. **Level 2 Typography** - Applies to H3 headings (second-level)
3. **Level 3+ Typography** - Applies to H4, H5, H6 (all grouped together)

**Why Grouped**: Most TOCs don't need 5 different styles. Grouping H4-H6 simplifies UI without losing functionality.

### 6.2 Typography Attributes (Per Level)

Each level has these attributes:

**Font Settings**:
- `level[N]FontSize` (number, px, customizable) - Default from CSS
- `level[N]FontWeight` (string, customizable) - Default: varies by level
- `level[N]FontStyle` (string, customizable) - normal/italic, default: normal
- `level[N]TextTransform` (string, customizable) - none/uppercase/lowercase/capitalize
- `level[N]TextDecoration` (string, customizable) - none/underline

**Color**:
- `level[N]Color` (string, customizable) - Default: `null` (uses `linkColor`)

**Inheritance Option**:
- `level[N]InheritFromPrevious` (boolean, customizable) - Default: `false`

**Example Attributes**:
```javascript
{
  // Level 1 (H2)
  level1FontSize: null, // from CSS: 18
  level1FontWeight: null, // from CSS: "600"
  level1Color: null, // inherits from linkColor
  level1InheritFromPrevious: false, // N/A for first level

  // Level 2 (H3)
  level2FontSize: null, // from CSS: 16
  level2FontWeight: null, // from CSS: "normal"
  level2Color: null, // inherits from linkColor (or level1 if inheritance enabled)
  level2InheritFromPrevious: false, // if true, copies level1 settings

  // Level 3+ (H4-H6)
  level3PlusFontSize: null, // from CSS: 14
  level3PlusFontWeight: null, // from CSS: "normal"
  level3PlusColor: null, // inherits from linkColor (or level2 if inheritance enabled)
  level3PlusInheritFromPrevious: false // if true, copies level2 settings
}
```

### 6.3 Typography Inheritance

**Purpose**: Cascade styling from higher levels to lower levels automatically.

**Behavior**:
- If `level2InheritFromPrevious === true`: Level 2 copies ALL Level 1 settings
- If `level3PlusInheritFromPrevious === true`: Level 3+ copies ALL Level 2 settings
- Overrides explicit settings for that level
- Disabled by default (each level independent)

**Use Case**: Quick visual hierarchy - make Level 1 bold and large, auto-inherit to nested levels.

**Implementation**:
```javascript
function getEffectiveTypography(level, attributes, DEFAULTS) {
  const levelKey = level === 1 ? 'level1' : level === 2 ? 'level2' : 'level3Plus';
  const prevLevelKey = level === 2 ? 'level1' : level >= 3 ? 'level2' : null;

  // Check inheritance flag
  if (prevLevelKey && attributes[`${levelKey}InheritFromPrevious`]) {
    // Copy all settings from previous level
    return getEffectiveTypography(level - 1, attributes, DEFAULTS);
  }

  // Resolve each setting via cascade (block → theme → CSS default)
  return {
    fontSize: resolveValue(`${levelKey}FontSize`, attributes, DEFAULTS),
    fontWeight: resolveValue(`${levelKey}FontWeight`, attributes, DEFAULTS),
    color: resolveValue(`${levelKey}Color`, attributes, DEFAULTS) || linkColor,
    // ... other typography settings
  };
}
```

### 6.4 Title Typography

**Attribute Prefix**: `title*` (e.g., `titleFontSize`, `titleColor`)

**Purpose**: Style the optional "Table of Contents" heading.

**Uses**: Level 1 typography settings by default, but can be overridden independently.

**Attributes**:
- `titleFontSize` (number, customizable) - Default from CSS
- `titleFontWeight` (string, customizable) - Default from CSS
- `titleColor` (string, customizable) - Default from CSS
- `titleTextTransform` (string, customizable)
- `titleAlignment` (string, customizable) - left/center/right

**Only Applies When**: `showTitle === true`

---

## 7. Color System

### 7.1 Color Attributes

**Wrapper Colors**:
- `wrapperBackgroundColor` (string, customizable) - Default from CSS
- `wrapperBorderColor` (string, customizable) - Default from CSS

**Title Colors** (if `showTitle === true`):
- `titleTextColor` (string, customizable) - Default from CSS
- `titleBackgroundColor` (string, customizable) - Default from CSS, or `null` for transparent

**Link Colors**:
- `linkColor` (string, customizable) - Default from CSS (#0073aa typical)
- `linkHoverColor` (string, customizable) - Default from CSS
- `linkVisitedColor` (string, customizable) - Default: `null` (inherits from `linkColor`)

**Numbering Color**:
- `numberingColor` (string, customizable) - Default: `null` (inherits from `linkColor`)

### 7.2 Null Inheritance Rules

**Link Visited Color**:
```javascript
if (linkVisitedColor === null) {
  linkVisitedColor = linkColor;
}
```

**Why**: Most TOCs don't differentiate visited links. Default to same as link color.

**Numbering Color**:
```javascript
if (numberingColor === null) {
  numberingColor = linkColor;
}
```

**Why**: Numbers should match link color by default for visual consistency.

**Per-Level Colors**:
```javascript
if (level1Color === null) {
  level1Color = linkColor;
}

if (level2Color === null) {
  if (level2InheritFromPrevious) {
    level2Color = level1Color;
  } else {
    level2Color = linkColor;
  }
}

// Same for level3Plus
```

### 7.3 Color Usage in CSS

**CSS Variable Pattern**:
```css
.toc-link {
  color: var(--custom-link-color, var(--toc-default-link-color));
}

.toc-link:hover {
  color: var(--custom-link-hover-color, var(--toc-default-link-hover-color));
}

.toc-link.active {
  color: var(--custom-link-active-color, var(--toc-default-link-active-color));
  font-weight: bold;
}

.toc-link:visited {
  color: var(--custom-link-visited-color, var(--custom-link-color, var(--toc-default-link-color)));
}

.toc-item::before {
  color: var(--custom-numbering-color, var(--custom-link-color, var(--toc-default-link-color)));
}
```

**Inline Styles** (customizations only):
```html
<div class="wp-block-custom-toc"
     style="--custom-link-color: #ff0000; --custom-link-hover-color: #cc0000;">
```

---

## 8. Border & Spacing

### 8.1 Wrapper Border

**Purpose**: Border around entire TOC block.

**Attributes**:
- `wrapperBorderWidth` (number, px, customizable) - Default from CSS
- `wrapperBorderStyle` (string, customizable) - Default from CSS: "solid"
- `wrapperBorderColor` (string, customizable) - Default from CSS
- `wrapperBorderRadius` (object, customizable) - Default from CSS
  - `topLeft` (number, px)
  - `topRight` (number, px)
  - `bottomRight` (number, px)
  - `bottomLeft` (number, px)
- `wrapperShadow` (string, customizable) - Default from CSS: "none"

**CSS Structure**:
```css
.wp-block-custom-toc {
  border-width: var(--custom-wrapper-border-width, var(--toc-default-border-width));
  border-style: var(--custom-wrapper-border-style, var(--toc-default-border-style));
  border-color: var(--custom-wrapper-border-color, var(--toc-default-border-color));
  border-radius: var(--custom-wrapper-border-radius-tl, var(--toc-default-border-radius-tl))
                 var(--custom-wrapper-border-radius-tr, var(--toc-default-border-radius-tr))
                 var(--custom-wrapper-border-radius-br, var(--toc-default-border-radius-br))
                 var(--custom-wrapper-border-radius-bl, var(--toc-default-border-radius-bl));
  box-shadow: var(--custom-wrapper-shadow, var(--toc-default-shadow));
}
```

### 8.2 Padding

**Wrapper Padding**:
- `wrapperPadding` (object, customizable) - Padding inside TOC wrapper
  - `top` (number, px)
  - `right` (number, px)
  - `bottom` (number, px)
  - `left` (number, px)

**List Padding**:
- `listPaddingLeft` (number, px, customizable) - Indentation for nested items
- Default from CSS (typically 20px)

**Item Spacing**:
- `itemSpacing` (number, px, customizable) - Vertical space between items
- Default from CSS (typically 8px)

---

## 9. Layout & Positioning

### 9.1 Width & Alignment

**Width Attributes**:
- `tocWidth` (string, customizable) - Default from CSS: "100%"
  - Accepts: px value (e.g., "300px") or percentage (e.g., "50%")
- `tocMaxWidth` (string, customizable) - Default from CSS: "none"
  - Accepts: px value (e.g., "400px") or "none"

**Horizontal Alignment**:
- `horizontalAlignment` (string, customizable) - Default: "left"
- Options: "left", "center", "right"
- Only applies when `tocWidth` is less than 100%

**CSS**:
```css
.wp-block-custom-toc {
  width: var(--custom-toc-width, var(--toc-default-width));
  max-width: var(--custom-toc-max-width, var(--toc-default-max-width));
  margin-left: auto; /* for center/right alignment */
  margin-right: auto;
}

/* Alignment variations */
.toc-align-left { margin-left: 0; margin-right: auto; }
.toc-align-center { margin-left: auto; margin-right: auto; }
.toc-align-right { margin-left: auto; margin-right: 0; }
```

### 9.2 Position Types

**Attribute**: `positionType` (string, customizable)

**Options**:
1. **"block"** (default) - Normal document flow
2. **"sticky"** - Sticks to viewport when scrolling
3. **"fixed"** - Fixed position relative to viewport

**Default**: "block"

### 9.3 Sticky Positioning

**Purpose**: TOC stays visible in viewport as user scrolls.

**Attributes**:
- `positionTop` (number, px, customizable) - Distance from top, default: 20
- `positionRight` (number, px, customizable) - Distance from right, default: null
- `positionLeft` (number, px, customizable) - Distance from left, default: null

**Only One Side**: Choose `positionLeft` OR `positionRight`, not both.

**CSS**:
```css
.toc-position-sticky {
  position: sticky;
  top: var(--custom-position-top, var(--toc-default-position-top));
  z-index: 100;
}
```

**Behavior**:
- TOC scrolls normally until it reaches specified top offset
- Then "sticks" to that position while content scrolls behind
- Unsticks when scrolling back up

### 9.4 Fixed Positioning

**Purpose**: TOC always visible at fixed screen position (sidebar TOC pattern).

**Attributes**:
- `positionTop` (number, px, customizable) - Distance from top
- `positionRight` (number, px, customizable) - Distance from right
- `positionBottom` (number, px, customizable) - Distance from bottom
- `positionLeft` (number, px, customizable) - Distance from left

**CSS**:
```css
.toc-position-fixed {
  position: fixed;
  top: var(--custom-position-top, var(--toc-default-position-top));
  right: var(--custom-position-right, var(--toc-default-position-right));
  z-index: 100;
}
```

**Behavior**: TOC never moves, always at fixed viewport coordinates.

**Common Use Cases**:
- Sidebar TOC (fixed right)
- Floating TOC (fixed bottom-right)
- Top-anchored TOC (fixed top)

### 9.5 Z-Index Management

**Attribute**: `zIndex` (number, customizable) - Default from CSS: 100

**Purpose**: Control stacking order when sticky/fixed.

**Typical Values**:
- 100: Above content, below modals
- 999: Above most elements
- 1000+: Above everything (use carefully)

---

## 10. Scroll Behavior

### 10.1 Smooth Scroll

**Attribute**: `smoothScroll` (boolean, customizable)

**Default**: `true` (enabled)

**Purpose**: Animated scrolling when clicking TOC links.

**Implementation**:
```javascript
tocLink.addEventListener('click', (e) => {
  e.preventDefault();
  const targetId = tocLink.getAttribute('href').slice(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    const scrollOffset = attributes.scrollOffset || 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - scrollOffset;

    if (attributes.smoothScroll) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, targetPosition);
    }

    // Update active state
    updateActiveLink(tocLink);
  }
});
```

### 10.2 Scroll Offset

**Attribute**: `scrollOffset` (number, px, customizable)

**Default**: `0`

**Purpose**: Offset scroll position to account for fixed headers.

**Common Use Case**: If site has fixed header of 80px height, set `scrollOffset: 80` so headings aren't hidden behind header.

**Behavior**: Subtracts offset from final scroll position.



### 10.5 Click Behavior

**Attribute**: `clickBehavior` (string, customizable)

**Default**: "navigate"

**Options**:
1. **"navigate"** - Scroll to section only
2. **"navigate-and-collapse"** - Scroll to section, then collapse TOC (if collapsible)

**Only "navigate-and-collapse" Applies When**: `isCollapsible === true`

**Use Case**: Collapse TOC after user clicks to save screen space.

---

## 11. Mobile Responsiveness

### 11.1 Mobile Breakpoint

**Attribute**: `mobileBreakpoint` (number, px, customizable)

**Default**: `768` (typical tablet/mobile breakpoint)

**Purpose**: Define screen width threshold for mobile-specific behavior.

**CSS**:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### 11.2 Hide on Mobile

**Attribute**: `hideOnMobile` (boolean, customizable)

**Default**: `false` (show on mobile)

**Purpose**: Completely hide TOC on small screens.

**CSS**:
```css
@media (max-width: var(--custom-mobile-breakpoint, 768px)) {
  .toc-hide-on-mobile {
    display: none;
  }
}
```

**Use Case**: Long TOCs that take too much mobile screen space.

### 11.3 Full Width on Mobile

**Attribute**: `fullWidthOnMobile` (boolean, customizable)

**Default**: `true`

**Purpose**: Override `tocWidth` on mobile to use 100% width.

**CSS**:
```css
@media (max-width: var(--custom-mobile-breakpoint, 768px)) {
  .toc-full-width-mobile {
    width: 100% !important;
    max-width: none !important;
  }
}
```

### 11.4 Collapsible on Mobile

**Attribute**: `collapsibleOnMobile` (boolean, customizable)

**Default**: `true`

**Purpose**: Force collapsible behavior on mobile even if `isCollapsible === false` on desktop.

**Behavior**:
- On desktop: Respects `isCollapsible` setting
- On mobile: Always collapsible (overrides setting)

**Use Case**: TOC takes too much mobile screen space, auto-collapse to save space.

### 11.5 Initially Collapsed on Mobile

**Attribute**: `initiallyCollapsedOnMobile` (boolean, customizable)

**Default**: `true`

**Only Applies When**: `collapsibleOnMobile === true` OR `isCollapsible === true`

**Purpose**: Start TOC collapsed on mobile page load.

**Implementation**: Add `hidden` attribute on mobile, JavaScript detects screen size.

---

## 12. Inspector Sidebar Panels

### Panel Order (Top to Bottom)

1. **Settings Panel** (always visible, not collapsible)
2. **Heading Filter Panel**
3. **Numbering Panel**
4. **Typography Panel**
5. **Color Panel**
6. **Border Panel**
7. **Layout Panel**
8. **Scroll Behavior Panel**
9. **Mobile Panel**

---

### 12.1 Settings Panel

**Purpose**: Theme management and core TOC settings.

**Implementation**: Uses shared `ThemeSelector.js` component.

**Layout**:
```
┌─ Settings ────────────────────┐
│                                │
│ Theme                          │
│ [Default              ▾]       │
│                                │
│ [Save as New Theme]            │
│ [Update Theme]                 │
│ [Rename Theme]                 │
│ [Delete Theme]                 │
│                                │
│ [Reset modifications]          │
│                                │
│ ─────────────────────          │
│                                │
│ ☐ Show Title                   │
│                                │
│ Title Text:                    │
│ [Table of Contents]            │
│                                │
│ ☐ Collapsible                  │
│                                │
│ ☐ Initially Collapsed          │
│   (only if collapsible)        │
│                                │
└────────────────────────────────┘
```

**Controls**:

**Theme Selector**: Same as accordion/tabs (see EDITOR-UI-REQUIREMENTS.md)

**Show Title** (ToggleControl):
- Attribute: `showTitle`
- Default: `true`

**Title Text** (TextControl):
- Attribute: `titleText`
- Default: "Table of Contents"
- Only shown if `showTitle === true`

**Collapsible** (ToggleControl):
- Attribute: `isCollapsible`
- Default: `false`

**Initially Collapsed** (ToggleControl):
- Attribute: `initiallyCollapsed`
- Default: `false`
- Only shown if `isCollapsible === true`

---

### 12.2 Heading Filter Panel

**Purpose**: Control which headings appear in TOC.

**Layout**:
```
┌─ Heading Filter ──────────────┐
│                                │
│ Filter Mode:                   │
│ ⦿ Include All Headings         │
│ ○ Include Only Selected        │
│ ○ Exclude Selected             │
│                                │
│ ─── Include Only Options ────  │
│ (shown only if mode = include) │
│                                │
│ Heading Levels:                │
│ ☑ H2  ☑ H3  ☐ H4              │
│ ☐ H5  ☐ H6                     │
│                                │
│ CSS Classes (comma-separated): │
│ [important, highlight]         │
│                                │
│ ─── Exclude Options ──────     │
│ (shown only if mode = exclude) │
│                                │
│ Exclude Levels:                │
│ ☐ H2  ☐ H3  ☐ H4              │
│ ☑ H5  ☑ H6                     │
│                                │
│ Exclude Classes:               │
│ [no-toc, private]              │
│                                │
│ ─── Common Options ──────      │
│                                │
│ Depth Limit:                   │
│ [3] levels (0 = no limit)      │
│                                │
│ ☑ Auto-add IDs to headings     │
│                                │
└────────────────────────────────┘
```

**Controls**:

**Filter Mode** (RadioControl):
- Attribute: `filterMode`
- Options: "include-all", "include-only", "exclude"
- Default: "include-all"

**Include Levels** (CheckboxGroup):
- Attribute: `includeLevels` (array)
- Options: [2, 3, 4, 5, 6] (H1 not included)
- Default: [2, 3, 4, 5, 6]
- Only shown if `filterMode === "include-only"`

**Include Classes** (TextControl):
- Attribute: `includeClasses` (string, comma-separated)
- Default: ""
- Only shown if `filterMode === "include-only"`

**Exclude Levels** (CheckboxGroup):
- Attribute: `excludeLevels` (array)
- Default: []
- Only shown if `filterMode === "exclude"`

**Exclude Classes** (TextControl):
- Attribute: `excludeClasses` (string)
- Default: ""
- Only shown if `filterMode === "exclude"`

**Depth Limit** (RangeControl):
- Attribute: `depthLimit` (number)
- Range: 0-6 (0 = no limit)
- Default: `null` (no limit)

**Auto-add IDs** (ToggleControl):
- Attribute: `autoAddIds`
- Default: `true`
- Purpose: Add `id` attributes to headings without them

---

### 12.3 Numbering Panel

**Purpose**: Configure numbering style and appearance.

**Layout**:
```
┌─ Numbering ───────────────────┐
│                                │
│ Numbering Style:               │
│ [None             ▾]           │
│                                │
│ Options:                       │
│  - None (bullets)              │
│  - Decimal (1, 1.1, 1.1.1)     │
│  - Decimal Leading Zero        │
│  - Roman Numerals              │
│  - Letters (A, B, C)           │
│  - Custom Per-Level            │
│                                │
│ ─── Custom Per-Level ────      │
│ (shown only if Custom)         │
│                                │
│ Level 1 Style:                 │
│ [decimal          ▾]           │
│                                │
│ Level 2 Style:                 │
│ [lower-alpha      ▾]           │
│                                │
│ Level 3+ Style:                │
│ [disc             ▾]           │
│                                │
│ ─── Numbering Color ──────     │
│                                │
│ Numbering Color:               │
│ [████████] #666666             │
│                                │
│ ☑ Use Link Color               │
│                                │
└────────────────────────────────┘
```

**Controls**:

**Numbering Style** (SelectControl):
- Attribute: `numberingStyle`
- Options: "none", "decimal", "decimal-leading-zero", "roman", "letters", "custom"
- Default: "none"

**Custom Level Styles** (SelectControl each):
- Attributes: `customNumberingLevel1`, `customNumberingLevel2`, `customNumberingLevel3Plus`
- Options: "decimal", "decimal-leading-zero", "upper-roman", "lower-roman", "upper-alpha", "lower-alpha", "disc", "circle", "square"
- Only shown if `numberingStyle === "custom"`

**Numbering Color** (ColorPicker):
- Attribute: `numberingColor`
- Default: `null` (inherits from `linkColor`)
- Uses shared `ColorPanel.js` component

**Use Link Color** (ToggleControl):
- When checked: Sets `numberingColor = null`
- When unchecked: Shows color picker

---

### 12.4 Typography Panel

**Purpose**: Configure text styling for each TOC level.

**Implementation**: Uses shared `TypographyPanel.js` component with per-level variations.

**Layout**:
```
┌─ Typography ──────────────────┐
│                                │
│ ╔═══ Level 1 (H2) ═══╗        │
│ ║                     ║        │
│ ║ Font Size: [18] px  ║        │
│ ║                     ║        │
│ ║ Font Weight: [600▾] ║        │
│ ║                     ║        │
│ ║ Font Style: [normal▾]       │
│ ║                     ║        │
│ ║ Text Transform:     ║        │
│ ║ [none           ▾]  ║        │
│ ║                     ║        │
│ ║ Text Decoration:    ║        │
│ ║ [none           ▾]  ║        │
│ ║                     ║        │
│ ║ Color:              ║        │
│ ║ [████████] #0073aa  ║        │
│ ║ ☑ Use Link Color    ║        │
│ ║                     ║        │
│ ╚═════════════════════╝        │
│                                │
│ ╔═══ Level 2 (H3) ═══╗        │
│ ║                     ║        │
│ ║ ☐ Inherit from Level 1      │
│ ║                     ║        │
│ ║ Font Size: [16] px  ║        │
│ ║ (grayed if inherit) ║        │
│ ║ ...                 ║        │
│ ╚═════════════════════╝        │
│                                │
│ ╔═══ Level 3+ (H4-H6) ═══╗    │
│ ║                         ║    │
│ ║ ☐ Inherit from Level 2  ║    │
│ ║                         ║    │
│ ║ Font Size: [14] px      ║    │
│ ║ ...                     ║    │
│ ╚═════════════════════════╝    │
│                                │
│ ─── Title Typography ────      │
│ (shown only if showTitle)      │
│                                │
│ Font Size: [20] px             │
│ Font Weight: [bold▾]           │
│ Color: [████████] #333         │
│ Alignment: [left▾]             │
│                                │
└────────────────────────────────┘
```

**Per-Level Attributes**: See section 6.2 for complete list.

**Inheritance Behavior**: When "Inherit" checked, all controls for that level are grayed out.

---

### 12.5 Color Panel

**Purpose**: Configure all colors for TOC elements.

**Implementation**: Uses shared `ColorPanel.js` component.

**Layout**:
```
┌─ Color ───────────────────────┐
│                                │
│ Wrapper Background:            │
│ [████████] #ffffff             │
│                                │
│ Wrapper Border Color:          │
│ [████████] #e0e0e0             │
│                                │
│ ─── Title Colors ────          │
│ (shown only if showTitle)      │
│                                │
│ Title Text Color:              │
│ [████████] #333333             │
│                                │
│ Title Background:              │
│ [████████] transparent         │
│                                │
│ ─── Link Colors ──────         │
│                                │
│ Link Color:                    │
│ [████████] #0073aa             │
│                                │
│ Link Hover Color:              │
│ [████████] #005177             │
│                                │
│ Link Visited Color:            │
│ [████████] inherit             │
│                                │
└────────────────────────────────┘
```

**All Color Attributes**: See section 7.1 for complete list.

---

### 12.6 Border Panel

**Purpose**: Configure border, shadow, and spacing.

**Implementation**: Uses shared `BorderPanel.js` component.

**Layout**:
```
┌─ Border ──────────────────────┐
│                                │
│ Wrapper Border                 │
│                                │
│ Color: [████████] #e0e0e0      │
│                                │
│ Thickness: [1] px              │
│                                │
│ Style: [solid ▾]               │
│                                │
│ Border Radius:                 │
│ ┌─────────┬─────────┐          │
│ │ TL: [4] │ TR: [4] │          │
│ ├─────────┼─────────┤          │
│ │ BL: [4] │ BR: [4] │          │
│ └─────────┴─────────┘          │
│                                │
│ Shadow: [none ▾]               │
│                                │
│ ─── Spacing ──────             │
│                                │
│ Wrapper Padding:               │
│ ┌─────────┬─────────┐          │
│ │ T: [16] │ R: [16] │          │
│ ├─────────┼─────────┤          │
│ │ B: [16] │ L: [16] │          │
│ └─────────┴─────────┘          │
│                                │
│ List Padding Left: [20] px     │
│                                │
│ Item Spacing: [8] px           │
│                                │
└────────────────────────────────┘
```

**Border Attributes**: See section 8.1 for complete list.

---

### 12.7 Layout Panel

**Purpose**: Configure width, alignment, and positioning.

**Layout**:
```
┌─ Layout ──────────────────────┐
│                                │
│ TOC Width:                     │
│ [300] [px ▾]                   │
│                                │
│ Max Width:                     │
│ [400] px (or "none")           │
│                                │
│ Horizontal Alignment:          │
│ ⦿ Left  ○ Center  ○ Right     │
│                                │
│ ─── Position ──────            │
│                                │
│ Position Type:                 │
│ ⦿ Block (normal flow)          │
│ ○ Sticky (sticks to viewport)  │
│ ○ Fixed (always visible)       │
│                                │
│ ─── Sticky/Fixed Options ────  │
│ (shown only if sticky/fixed)   │
│                                │
│ Top Offset: [20] px            │
│                                │
│ ○ Left  ⦿ Right                │
│ Left Offset: [20] px           │
│ Right Offset: [20] px          │
│                                │
│ Z-Index: [100]                 │
│                                │
└────────────────────────────────┘
```

**Controls**: See section 9 for all layout attributes.

---

### 12.8 Scroll Behavior Panel

**Purpose**: Configure scroll interactions.

**Layout**:
```
┌─ Scroll Behavior ─────────────┐
│                                │
│ ☑ Smooth Scroll                │
│                                │
│ Scroll Offset:                 │
│ [0] px (for fixed headers)     │
│                                │
│ ☐ Auto-Expand                  │
│   (only if collapsible)        │
│                                │
│ Click Behavior:                │
│ ⦿ Navigate Only                │
│ ○ Navigate & Collapse          │
│                                │
└────────────────────────────────┘
```

**Controls**: See section 10 for all scroll behavior attributes.

---

### 12.9 Mobile Panel

**Purpose**: Configure mobile-specific behavior.

**Layout**:
```
┌─ Mobile ──────────────────────┐
│                                │
│ Mobile Breakpoint:             │
│ [768] px                       │
│                                │
│ ☐ Hide on Mobile               │
│                                │
│ ☑ Full Width on Mobile         │
│                                │
│ ☑ Collapsible on Mobile        │
│                                │
│ ☑ Initially Collapsed          │
│   (only if collapsible)        │
│                                │
└────────────────────────────────┘
```

**Controls**: See section 11 for all mobile attributes.

---

## 13. Block Attributes Schema

### 13.1 Attribute Classification

**Structural Attributes** (never in themes):
- `tocId` (string) - Unique block identifier
- `showTitle` (boolean) - Show/hide title
- `titleText` (string) - Title text content

**Meta Attributes** (not in themes):
- `currentTheme` (string) - Selected theme ID
- `customizationCache` (object, not serialized) - Session cache
- `isCustomized` (boolean, computed, not serialized) - Has customizations

**Customizable Attributes** (in themes, default `null` for CSS-based):
- All color, typography, border, spacing, behavior attributes

### 13.2 Complete Attribute List

**Structural**:
```javascript
{
  tocId: { type: 'string', default: '' }, // Auto-generated
  showTitle: { type: 'boolean', default: true },
  titleText: { type: 'string', default: 'Table of Contents' }
}
```

**Meta**:
```javascript
{
  currentTheme: { type: 'string', default: '' }, // "" = default theme
  customizationCache: { type: 'object', default: {} }, // Not serialized
  isCustomized: { type: 'boolean', default: false } // Computed, not serialized
}
```

**Filter Settings** (customizable, behavioral defaults):
```javascript
{
  filterMode: { type: 'string', default: 'include-all' },
  includeLevels: { type: 'array', default: [2, 3, 4, 5, 6] },
  includeClasses: { type: 'string', default: '' },
  excludeLevels: { type: 'array', default: [] },
  excludeClasses: { type: 'string', default: '' },
  depthLimit: { type: 'number', default: null },
  autoAddIds: { type: 'boolean', default: true }
}
```

**Numbering** (customizable, behavioral defaults):
```javascript
{
  numberingStyle: { type: 'string', default: 'none' },
  customNumberingLevel1: { type: 'string', default: 'decimal' },
  customNumberingLevel2: { type: 'string', default: 'lower-alpha' },
  customNumberingLevel3Plus: { type: 'string', default: 'disc' },
  numberingColor: { type: 'string', default: null } // Inherits from linkColor
}
```

**Collapsible** (customizable, behavioral defaults):
```javascript
{
  isCollapsible: { type: 'boolean', default: false },
  initiallyCollapsed: { type: 'boolean', default: false }
}
```

**Typography - Level 1** (customizable, CSS defaults):
```javascript
{
  level1FontSize: { type: 'number', default: null }, // From CSS: 18
  level1FontWeight: { type: 'string', default: null }, // From CSS: "600"
  level1FontStyle: { type: 'string', default: null }, // From CSS: "normal"
  level1TextTransform: { type: 'string', default: null }, // From CSS: "none"
  level1TextDecoration: { type: 'string', default: null }, // From CSS: "none"
  level1Color: { type: 'string', default: null }, // Inherits from linkColor
  level1InheritFromPrevious: { type: 'boolean', default: false } // N/A for first level
}
```

**Typography - Level 2** (customizable, CSS defaults):
```javascript
{
  level2FontSize: { type: 'number', default: null }, // From CSS: 16
  level2FontWeight: { type: 'string', default: null }, // From CSS: "normal"
  level2FontStyle: { type: 'string', default: null },
  level2TextTransform: { type: 'string', default: null },
  level2TextDecoration: { type: 'string', default: null },
  level2Color: { type: 'string', default: null },
  level2InheritFromPrevious: { type: 'boolean', default: false }
}
```

**Typography - Level 3+** (customizable, CSS defaults):
```javascript
{
  level3PlusFontSize: { type: 'number', default: null }, // From CSS: 14
  level3PlusFontWeight: { type: 'string', default: null },
  level3PlusFontStyle: { type: 'string', default: null },
  level3PlusTextTransform: { type: 'string', default: null },
  level3PlusTextDecoration: { type: 'string', default: null },
  level3PlusColor: { type: 'string', default: null },
  level3PlusInheritFromPrevious: { type: 'boolean', default: false }
}
```

**Typography - Title** (customizable, CSS defaults):
```javascript
{
  titleFontSize: { type: 'number', default: null }, // From CSS: 20
  titleFontWeight: { type: 'string', default: null }, // From CSS: "bold"
  titleColor: { type: 'string', default: null }, // From CSS
  titleTextTransform: { type: 'string', default: null },
  titleAlignment: { type: 'string', default: null }, // From CSS: "left"
  titleBackgroundColor: { type: 'string', default: null } // From CSS: transparent
}
```

**Colors** (customizable, CSS defaults):
```javascript
{
  wrapperBackgroundColor: { type: 'string', default: null }, // From CSS
  wrapperBorderColor: { type: 'string', default: null }, // From CSS
  linkColor: { type: 'string', default: null }, // From CSS: #0073aa
  linkHoverColor: { type: 'string', default: null }, // From CSS
  linkActiveColor: { type: 'string', default: null }, // From CSS
  linkVisitedColor: { type: 'string', default: null } // Inherits from linkColor
}
```

**Border & Spacing** (customizable, CSS defaults):
```javascript
{
  wrapperBorderWidth: { type: 'number', default: null }, // From CSS: 1
  wrapperBorderStyle: { type: 'string', default: null }, // From CSS: "solid"
  wrapperBorderRadius: {
    type: 'object',
    default: null // From CSS: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 }
  },
  wrapperShadow: { type: 'string', default: null }, // From CSS: "none"
  wrapperPadding: {
    type: 'object',
    default: null // From CSS: { top: 16, right: 16, bottom: 16, left: 16 }
  },
  listPaddingLeft: { type: 'number', default: null }, // From CSS: 20
  itemSpacing: { type: 'number', default: null } // From CSS: 8
}
```

**Layout** (customizable, CSS defaults):
```javascript
{
  tocWidth: { type: 'string', default: null }, // From CSS: "100%"
  tocMaxWidth: { type: 'string', default: null }, // From CSS: "none"
  horizontalAlignment: { type: 'string', default: 'left' },
  positionType: { type: 'string', default: 'block' },
  positionTop: { type: 'number', default: null }, // From CSS: 20
  positionRight: { type: 'number', default: null },
  positionBottom: { type: 'number', default: null },
  positionLeft: { type: 'number', default: null },
  zIndex: { type: 'number', default: null } // From CSS: 100
}
```

**Scroll Behavior** (customizable, behavioral defaults):
```javascript
{
  smoothScroll: { type: 'boolean', default: true },
  scrollOffset: { type: 'number', default: 0 },
  autoHighlight: { type: 'boolean', default: true },
  autoExpand: { type: 'boolean', default: false },
  clickBehavior: { type: 'string', default: 'navigate' }
}
```

**Mobile** (customizable, mixed defaults):
```javascript
{
  mobileBreakpoint: { type: 'number', default: 768 },
  hideOnMobile: { type: 'boolean', default: false },
  fullWidthOnMobile: { type: 'boolean', default: true },
  collapsibleOnMobile: { type: 'boolean', default: true },
  initiallyCollapsedOnMobile: { type: 'boolean', default: true }
}
```

### 13.3 Total Attribute Count

**Structural**: 3
**Meta**: 3
**Customizable**: ~70 attributes

**Total**: ~76 attributes

---

## 14. Theme System Integration

### 14.1 Database Storage

**Option Name**: `toc_themes`

**Format**: PHP serialized array, same structure as `accordion_themes` and `tabs_themes`

**Example**:
```php
array(
  'theme-abc123' => array(
    'name' => 'Sidebar TOC',
    'modified' => '2025-10-12 10:30:00',
    'values' => array(
      'linkColor' => '#0073aa',
      'linkHoverColor' => '#005177',
      'numberingStyle' => 'decimal',
      'positionType' => 'sticky',
      'positionTop' => 20,
      // ... all customizable attributes with explicit values
    )
  ),
  'theme-def456' => array(/* ... */)
)
```

### 14.2 Event System

**Event Name**: `tocThemeUpdated`

**Dispatched When**:
- Theme created
- Theme updated
- Theme deleted
- Theme renamed

**Event Detail**:
```javascript
{
  themeId: 'theme-abc123',
  operation: 'update', // 'create', 'update', 'delete', 'rename'
  themes: { /* updated themes object */ }
}
```

**Listeners**: All TOC blocks listen for this event and re-render if using the updated theme.

### 14.3 AJAX Actions

**WordPress AJAX Actions**:
- `get_toc_themes` - Load all themes
- `save_toc_theme` - Create/update theme
- `delete_toc_theme` - Delete theme
- `rename_toc_theme` - Rename theme

**Implementation**: Uses shared `theme-storage.js` with `blockType: 'toc'` parameter.

### 14.4 CSS File: toc.css

**Location**: `assets/css/toc.css`

**Purpose**: Single source of truth for all TOC default values.

**Structure**:
```css
:root {
  /* Wrapper */
  --toc-default-wrapper-bg: #ffffff;
  --toc-default-wrapper-border-width: 1px;
  --toc-default-wrapper-border-style: solid;
  --toc-default-wrapper-border-color: #e0e0e0;
  --toc-default-wrapper-border-radius-tl: 4px;
  --toc-default-wrapper-border-radius-tr: 4px;
  --toc-default-wrapper-border-radius-br: 4px;
  --toc-default-wrapper-border-radius-bl: 4px;
  --toc-default-wrapper-shadow: none;
  --toc-default-wrapper-padding-top: 16px;
  --toc-default-wrapper-padding-right: 16px;
  --toc-default-wrapper-padding-bottom: 16px;
  --toc-default-wrapper-padding-left: 16px;

  /* Title */
  --toc-default-title-size: 20px;
  --toc-default-title-weight: bold;
  --toc-default-title-color: #333333;
  --toc-default-title-bg: transparent;
  --toc-default-title-align: left;

  /* Links */
  --toc-default-link-color: #0073aa;
  --toc-default-link-hover-color: #005177;
  --toc-default-link-active-color: #00a0d2;

  /* Typography - Level 1 */
  --toc-default-level1-size: 18px;
  --toc-default-level1-weight: 600;
  --toc-default-level1-style: normal;
  --toc-default-level1-transform: none;
  --toc-default-level1-decoration: none;

  /* Typography - Level 2 */
  --toc-default-level2-size: 16px;
  --toc-default-level2-weight: normal;
  /* ... */

  /* Typography - Level 3+ */
  --toc-default-level3-size: 14px;
  --toc-default-level3-weight: normal;
  /* ... */

  /* Spacing */
  --toc-default-list-padding-left: 20px;
  --toc-default-item-spacing: 8px;

  /* Layout */
  --toc-default-width: 100%;
  --toc-default-max-width: none;
  --toc-default-position-top: 20px;
  --toc-default-z-index: 100;
}

/* Default Theme Styles */
.toc-theme-default {
  background-color: var(--custom-wrapper-bg, var(--toc-default-wrapper-bg));
  border-width: var(--custom-wrapper-border-width, var(--toc-default-wrapper-border-width));
  border-style: var(--custom-wrapper-border-style, var(--toc-default-wrapper-border-style));
  border-color: var(--custom-wrapper-border-color, var(--toc-default-wrapper-border-color));
  /* ... all other styles */
}

.toc-theme-default .toc-link {
  color: var(--custom-link-color, var(--toc-default-link-color));
  font-size: var(--custom-level1-size, var(--toc-default-level1-size));
  /* ... */
}

.toc-theme-default .toc-link:hover {
  color: var(--custom-link-hover-color, var(--toc-default-link-hover-color));
}

.toc-theme-default .toc-link.active {
  color: var(--custom-link-active-color, var(--toc-default-link-active-color));
  font-weight: bold;
  background-color: rgba(0, 115, 170, 0.1);
}

/* Level-specific styles */
.toc-theme-default .toc-item-level-1 > .toc-link {
  font-size: var(--custom-level1-size, var(--toc-default-level1-size));
  font-weight: var(--custom-level1-weight, var(--toc-default-level1-weight));
}

.toc-theme-default .toc-item-level-2 > .toc-link {
  font-size: var(--custom-level2-size, var(--toc-default-level2-size));
  font-weight: var(--custom-level2-weight, var(--toc-default-level2-weight));
}

.toc-theme-default .toc-item-level-3 > .toc-link,
.toc-theme-default .toc-item-level-4 > .toc-link,
.toc-theme-default .toc-item-level-5 > .toc-link,
.toc-theme-default .toc-item-level-6 > .toc-link {
  font-size: var(--custom-level3-size, var(--toc-default-level3-size));
  font-weight: var(--custom-level3-weight, var(--toc-default-level3-weight));
}

/* Position types */
.toc-position-sticky {
  position: sticky;
  top: var(--custom-position-top, var(--toc-default-position-top));
  z-index: var(--custom-z-index, var(--toc-default-z-index));
}

.toc-position-fixed {
  position: fixed;
  top: var(--custom-position-top, var(--toc-default-position-top));
  right: var(--custom-position-right, auto);
  z-index: var(--custom-z-index, var(--toc-default-z-index));
}

/* Mobile responsive */
@media (max-width: var(--custom-mobile-breakpoint, 768px)) {
  .toc-hide-on-mobile {
    display: none;
  }

  .toc-full-width-mobile {
    width: 100% !important;
    max-width: none !important;
  }
}

/* Accessibility */
.toc-link:focus {
  outline: 2px solid var(--custom-link-color, var(--toc-default-link-color));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .toc-link {
    scroll-behavior: auto !important;
  }
}
```

### 14.5 3-Tier Cascade

Same as accordion/tabs:

1. **CSS Defaults** (Layer 1) - From `toc.css` `:root` variables
2. **Custom Theme** (Layer 2) - From database (`toc_themes`)
3. **Block Customizations** (Layer 3) - Inline styles on block

**Resolution**: Block → Theme → CSS Default (first defined value wins)

---

## 15. Shared Modules Reused

### 15.1 Theme System

**From**: `src/shared/theme-system/`

**Modules**:
- `theme-manager.js` - Create, update, delete, rename, switch themes
- `cascade-resolver.js` - 3-tier cascade resolution
- `theme-storage.js` - Database operations (with `blockType: 'toc'`)
- `theme-validator.js` - Validation logic
- `theme-events.js` - Event system (`tocThemeUpdated` event)

**Usage**: Import and pass `blockType: 'toc'` to all functions.

### 15.2 UI Components

**From**: `src/shared/components/`

**Components**:
- `ThemeSelector.js` - Theme dropdown and buttons
- `ColorPanel.js` - All color controls
- `TypographyPanel.js` - Typography controls (adapted for per-level)
- `BorderPanel.js` - Border and spacing controls
- `CustomizationWarning.js` - Unsaved changes warning

**Usage**: Import and use directly, pass TOC-specific attributes.

### 15.3 Attributes

**From**: `src/shared/attributes/`

**Modules**:
- `color-attributes.js` - Shared color attribute definitions
- `typography-attributes.js` - Shared typography definitions
- `border-attributes.js` - Border and spacing definitions
- `spacing-attributes.js` - Padding/margin definitions
- `meta-attributes.js` - currentTheme, isCustomized, customizationCache

**Usage**: Import and merge with TOC-specific attributes.

### 15.4 Utilities

**From**: `src/shared/utils/`

**Utilities**:
- `css-parser.js` - Parse `toc.css` for defaults
- `id-generator.js` - Generate unique `tocId`
- `validation.js` - Validate colors, numbers, enums
- `aria-helpers.js` - ARIA attribute management (for collapsible)
- `keyboard-nav.js` - Keyboard navigation (for collapsible)

**Usage**: Import and use directly.

### 15.5 Hooks

**From**: `src/shared/hooks/`

**Hooks**:
- `useThemeManagement.js` - Load/manage themes
- `useEffectiveValues.js` - Resolve 3-tier cascade
- `useAccordionToggle.js` - Toggle collapse state (if `isCollapsible === true`)
- `useCustomizationDetection.js` - Auto-detect customizations

**Usage**: Import and use in TOC block's `edit.js`.

---

## 16. New TOC-Specific Modules

### 16.1 Heading Detection

**File**: `blocks/toc/utils/heading-detector.js`

**Functions**:
```javascript
export function detectHeadings(containerElement, filterSettings) {
  // Scan DOM for headings
  // Apply filters
  // Build hierarchy
  // Return structured data
}

export function generateHeadingId(headingElement) {
  // Slugify heading text
  // Ensure uniqueness
  // Return ID string
}

export function applyFilters(headings, filterSettings) {
  // Apply level filters
  // Apply class filters
  // Apply depth limit
  // Return filtered headings
}

export function buildHierarchy(flatHeadings) {
  // Convert flat array to nested structure
  // Return tree
}
```

### 16.3 Smooth Scroll

**File**: `blocks/toc/utils/smooth-scroll.js`

**Functions**:
```javascript
export function initSmoothScroll(tocElement, attributes) {
  // Add click handlers to all TOC links
  // Calculate target position with offset
  // Scroll with smooth behavior
  // Handle click behavior (collapse if needed)
}

export function scrollToHeading(headingId, scrollOffset, smoothScroll) {
  // Get target element
  // Calculate position
  // Scroll to position
}
```

### 16.4 Heading Auto-ID

**File**: `blocks/toc/utils/heading-id-manager.js`

**Functions**:
```javascript
export function autoAddHeadingIds(containerElement) {
  // Find all headings without IDs
  // Generate IDs from text
  // Add ID attributes to headings
}

export function slugify(text) {
  // Convert text to URL-safe slug
  // Remove special characters
  // Return slug
}

export function ensureUniqueId(proposedId, existingIds) {
  // Check if ID exists
  // Add counter suffix if needed
  // Return unique ID
}
```

### 16.5 TOC Builder

**File**: `blocks/toc/components/TOCBuilder.js`

**Component**: React component that builds TOC HTML from heading data.

**Functions**:
```javascript
export function TOCBuilder({ headings, attributes, effectiveValues }) {
  // Render TOC title (if showTitle)
  // Render hierarchical list
  // Apply numbering styles
  // Apply per-level typography
  // Return JSX
}

function renderTOCItem(heading, level, attributes, effectiveValues) {
  // Render single TOC item
  // Apply level-specific styles
  // Return JSX
}

function renderNestedList(children, level, attributes, effectiveValues) {
  // Recursively render nested items
  // Return JSX
}
```

### 16.6 Position Manager

**File**: `blocks/toc/utils/position-manager.js`

**Functions**:
```javascript
export function applyPositionStyles(tocElement, attributes) {
  // Apply position type class
  // Set inline CSS variables for offsets
  // Handle sticky/fixed positioning
}

export function handleStickyBehavior(tocElement, attributes) {
  // Monitor scroll position
  // Update sticky state classes
}
```

---

## 17. HTML Output Structure

### 17.1 Complete TOC Block HTML (Non-Collapsible)

```html
<div
  class="wp-block-custom-toc toc-theme-default toc-position-block toc-align-left"
  data-toc-id="toc-abc123"
  data-auto-highlight="true"
  data-smooth-scroll="true"
  data-scroll-offset="0"
  style="--custom-link-color: #0073aa; --custom-wrapper-bg: #f9f9f9;"
>
  <!-- Optional Title -->
  <div class="toc-title-wrapper">
    <h2 class="toc-title">Table of Contents</h2>
  </div>

  <!-- TOC Navigation -->
  <nav class="toc-nav" aria-label="Table of Contents">
    <ol class="toc-list">
      <!-- Level 1 (H2) -->
      <li class="toc-item toc-item-level-1">
        <a href="#introduction" class="toc-link">
          <span class="toc-number">1</span>
          <span class="toc-text">Introduction</span>
        </a>

        <!-- Nested Level 2 (H3) -->
        <ol class="toc-list toc-list-nested">
          <li class="toc-item toc-item-level-2">
            <a href="#overview" class="toc-link">
              <span class="toc-number">1.1</span>
              <span class="toc-text">Overview</span>
            </a>
          </li>
          <li class="toc-item toc-item-level-2">
            <a href="#goals" class="toc-link">
              <span class="toc-number">1.2</span>
              <span class="toc-text">Goals</span>
            </a>
          </li>
        </ol>
      </li>

      <!-- Level 1 (H2) -->
      <li class="toc-item toc-item-level-1">
        <a href="#getting-started" class="toc-link active">
          <span class="toc-number">2</span>
          <span class="toc-text">Getting Started</span>
        </a>

        <!-- Nested Level 2 (H3) -->
        <ol class="toc-list toc-list-nested">
          <li class="toc-item toc-item-level-2">
            <a href="#prerequisites" class="toc-link">
              <span class="toc-number">2.1</span>
              <span class="toc-text">Prerequisites</span>
            </a>
          </li>
        </ol>
      </li>
    </ol>
  </nav>
</div>
```

### 17.2 Complete TOC Block HTML (Collapsible)

```html
<div
  class="wp-block-custom-toc toc-theme-default toc-collapsible toc-position-sticky"
  data-toc-id="toc-abc123"
  data-collapsible="true"
  data-auto-highlight="true"
  style="--custom-position-top: 20px;"
>
  <!-- Collapsible Toggle Button -->
  <button
    type="button"
    class="toc-toggle"
    aria-expanded="false"
    aria-controls="toc-content-abc123"
    id="toc-toggle-abc123"
  >
    <span class="toc-title">Table of Contents</span>
    <span class="toc-icon" aria-hidden="true">▾</span>
  </button>

  <!-- Collapsible Content -->
  <div
    id="toc-content-abc123"
    class="toc-content"
    role="region"
    aria-labelledby="toc-toggle-abc123"
    hidden
  >
    <nav class="toc-nav" aria-label="Table of Contents">
      <ol class="toc-list">
        <!-- Same list structure as non-collapsible -->
      </ol>
    </nav>
  </div>
</div>
```

### 17.3 HTML Generation Rules

**Unique IDs**:
- Block: `data-toc-id="{tocId}"`
- Toggle button: `toc-toggle-{tocId}` (if collapsible)
- Content: `toc-content-{tocId}` (if collapsible)

**ARIA Attributes** (if collapsible):
- Button: `aria-expanded`, `aria-controls`, `id`
- Content: `role="region"`, `aria-labelledby`, `hidden` (when collapsed)
- Nav: `aria-label="Table of Contents"`

**Classes**:
- Position: `toc-position-block`, `toc-position-sticky`, `toc-position-fixed`
- Alignment: `toc-align-left`, `toc-align-center`, `toc-align-right`
- Collapsible: `toc-collapsible` (if enabled)
- Theme: `toc-theme-{themeId}` or `toc-theme-default`
- Mobile: `toc-hide-on-mobile`, `toc-full-width-mobile` (if enabled)

**Data Attributes**:
- `data-toc-id`: Unique identifier
- `data-collapsible`: "true" if collapsible
- `data-smooth-scroll`: "true" if smooth scroll enabled
- `data-scroll-offset`: Scroll offset value

**Inline Styles**: Only for explicit customizations (CSS variables)

**List Structure**:
- Use `<ol>` for ordered (numbered) lists
- Use `<ul>` for unordered (bulleted) lists
- Nest lists for hierarchy (H3 under H2, etc.)

---

## 18. CSS Structure

### 18.1 toc.css File Structure

See section 14.4 for complete CSS structure with all `:root` variables and default theme styles.

### 18.2 CSS Variable Naming Convention

**Pattern**: `--toc-default-{category}-{property}`

**Examples**:
- `--toc-default-wrapper-bg`
- `--toc-default-link-color`
- `--toc-default-level1-size`
- `--toc-default-position-top`

**Customization Variables**: `--custom-{property}`

**Examples**:
- `--custom-link-color`
- `--custom-level1-size`
- `--custom-wrapper-border-width`

### 18.3 Custom Theme CSS Generation

Same pattern as accordion/tabs:

```php
function generate_toc_theme_css($themeId, $values) {
  $className = "toc-theme-{$themeId}";
  $defaults = get_toc_plugin_defaults(); // From toc.css
  $resolved = resolve_null_inheritance($values, $defaults);

  $css = "/* TOC Theme: {$themeId} */\n";
  $css .= ".{$className} {\n";
  $css .= "  background-color: var(--custom-wrapper-bg, {$resolved['wrapperBackgroundColor']});\n";
  // ... all other properties
  $css .= "}\n";

  // Level-specific styles
  $css .= ".{$className} .toc-item-level-1 > .toc-link {\n";
  $css .= "  font-size: var(--custom-level1-size, {$resolved['level1FontSize']}px);\n";
  // ...
  $css .= "}\n";

  return $css;
}
```

**Caching**: Same transient-based caching as accordion/tabs with version-based invalidation.

---

## 19. JavaScript Requirements

### 19.1 Frontend JavaScript (toc.js)

**Purpose**: Heading detection, smooth scroll, collapsible behavior.

**Initialization**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const tocBlocks = document.querySelectorAll('.wp-block-custom-toc');

  tocBlocks.forEach(tocBlock => {
    const attributes = extractAttributes(tocBlock);

    // 1. Auto-add heading IDs if enabled
    if (attributes.autoAddIds) {
      autoAddHeadingIds(document.querySelector('.entry-content'));
    }

    // 2. Initialize collapsible behavior (if enabled)
    if (attributes.isCollapsible) {
      initCollapsible(tocBlock, attributes);
    }

    // 3. Initialize smooth scroll
    if (attributes.smoothScroll) {
      initSmoothScroll(tocBlock, attributes);
    }

  });
});
```

### 19.2 Editor JavaScript (edit.js)

**Purpose**: Detect headings, build TOC, manage state.

**Key Hooks**:
```javascript
import { useThemeManagement } from '../../shared/hooks/useThemeManagement';
import { useEffectiveValues } from '../../shared/hooks/useEffectiveValues';
import { useHeadingDetection } from './hooks/useHeadingDetection';

export default function Edit({ attributes, setAttributes }) {
  const { themes, isLoading } = useThemeManagement('toc');
  const effectiveValues = useEffectiveValues(attributes, themes, window.tocDefaults);
  const headings = useHeadingDetection(attributes.filterMode, attributes.includeLevels, /* ... */);

  // ... render editor UI
}
```


---

## 20. Implementation Phases

### Phase 1: Core TOC (Heading Detection & Basic Display)

**Goal**: Functional TOC block that detects headings and displays navigable list.

**Tasks**:
- [ ] Register `wp:custom/toc` block
- [ ] Create `toc.css` with all `:root` defaults
- [ ] Implement CSS parsing in PHP (`get_toc_plugin_defaults()`)
- [ ] Implement heading detection (`heading-detector.js`)
- [ ] Implement filtering system (include all/only/exclude)
- [ ] Create basic TOC builder component
- [ ] Implement smooth scroll
- [ ] Add auto-ID generation for headings
- [ ] Create basic editor UI (filter panel)
- [ ] Test on various post structures

**Deliverable**: Working TOC that detects and links to headings with basic styling.

---

### Phase 2: Collapsible 

**Goal**: Add collapsible behavior and active highlighting.

**Tasks**:
- [ ] Implement `isCollapsible` toggle
- [ ] Reuse accordion collapse logic (shared hooks)
- [ ] Add ARIA attributes for collapsible
- [ ] Add active link highlighting
- [ ] Implement auto-expand on scroll (if collapsible)
- [ ] Add click behavior option (navigate/collapse)
- [ ] Test collapsible interactions

**Deliverable**: TOC with optional collapse

---

### Phase 3: Advanced Styling & Positioning

**Goal**: Full theme system, per-level typography, positioning options.

**Tasks**:
- [ ] Integrate theme system (shared modules)
- [ ] Implement per-level typography
- [ ] Add typography inheritance option
- [ ] Implement numbering system (all styles)
- [ ] Add comprehensive color system
- [ ] Implement border & spacing controls
- [ ] Add sticky/fixed positioning
- [ ] Implement width & alignment controls
- [ ] Create all inspector sidebar panels
- [ ] Test theme CRUD operations
- [ ] Test cascade resolution

**Deliverable**: Fully styled, themeable TOC with advanced options.

---

### Phase 4: Mobile & Polish

**Goal**: Mobile responsiveness, accessibility, performance optimization.

**Tasks**:
- [ ] Implement mobile breakpoint system
- [ ] Add mobile-specific behavior (hide/full-width/collapsible)
- [ ] Test on various mobile devices
- [ ] Add accessibility testing (ARIA, keyboard, screen readers)
- [ ] Optimize performance (Intersection Observer, memoization)
- [ ] Add editor preview improvements
- [ ] Write comprehensive documentation
- [ ] Add inline code comments
- [ ] Create example use cases
- [ ] Final QA testing

**Deliverable**: Production-ready TOC block with mobile support and polish.

---

## 21. Testing Checklist

### 21.1 Functional Testing

**Heading Detection**:
- [ ] Detects all H2-H6 headings in post
- [ ] Excludes headings inside TOC block
- [ ] Generates IDs for headings without them
- [ ] Updates when post content changes (editor)
- [ ] Handles empty content gracefully

**Filtering**:
- [ ] Include All mode works correctly
- [ ] Include Only mode filters by level
- [ ] Include Only mode filters by CSS class
- [ ] Exclude mode filters by level
- [ ] Exclude mode filters by CSS class
- [ ] Depth limit truncates correctly
- [ ] Filters update TOC in real-time

**Numbering**:
- [ ] None (bullets) style works
- [ ] Decimal numbering works (1, 1.1, 1.1.1)
- [ ] Decimal leading zero works (01, 01.01)
- [ ] Roman numerals work (I, II, III)
- [ ] Letters work (A, B, C)
- [ ] Custom per-level works
- [ ] Numbering color applies correctly

**Collapsible**:
- [ ] Toggle enables/disables collapsible
- [ ] Initially collapsed works on frontend
- [ ] Click toggles collapse state
- [ ] Enter/Space keys toggle
- [ ] ARIA attributes update correctly
- [ ] Icon rotates/changes on toggle
- [ ] Editor always shows expanded


**Smooth Scroll**:
- [ ] Clicks scroll smoothly to section
- [ ] Scroll offset accounts for fixed headers
- [ ] Navigate-and-collapse works (if collapsible)
- [ ] Respects `prefers-reduced-motion`

### 21.2 Typography Testing

**Per-Level Typography**:
- [ ] Level 1 styling applies to H2 links
- [ ] Level 2 styling applies to H3 links
- [ ] Level 3+ styling applies to H4-H6 links
- [ ] Typography inheritance works correctly
- [ ] Title typography applies (if title shown)
- [ ] All font properties render correctly

### 21.3 Color Testing

**Color Application**:
- [ ] Wrapper background color works
- [ ] Wrapper border color works
- [ ] Title colors work (if title shown)
- [ ] Link color works
- [ ] Link hover color works
- [ ] Link visited color works
- [ ] Numbering color works
- [ ] Null inheritance resolves correctly

### 21.4 Layout & Positioning Testing

**Width & Alignment**:
- [ ] Width (px and %) works correctly
- [ ] Max-width limits width correctly
- [ ] Horizontal alignment works (left/center/right)
- [ ] Alignment only applies when width < 100%

**Positioning**:
- [ ] Block position (normal flow) works
- [ ] Sticky position works
- [ ] Fixed position works
- [ ] Position offsets apply correctly (top/right/bottom/left)
- [ ] Z-index controls stacking order

### 21.5 Mobile Testing

**Mobile Behavior**:
- [ ] Mobile breakpoint triggers correctly
- [ ] Hide on mobile works
- [ ] Full-width on mobile works
- [ ] Collapsible on mobile works
- [ ] Initially collapsed on mobile works
- [ ] Mobile overrides desktop settings correctly

**Devices Tested**:
- [ ] iPhone (Safari)
- [ ] Android phone (Chrome)
- [ ] iPad (Safari)
- [ ] Small desktop (< 768px)

### 21.6 Theme System Testing

**Theme Operations**:
- [ ] Theme selector shows all themes
- [ ] Switching themes updates TOC
- [ ] Save as new theme captures all values
- [ ] Update theme modifies existing theme
- [ ] Rename theme changes name only
- [ ] Delete theme removes theme
- [ ] Theme events propagate to other blocks
- [ ] Customizations override theme values
- [ ] Reset modifications clears customizations

**Cascade Resolution**:
- [ ] Block customizations override theme
- [ ] Theme values override CSS defaults
- [ ] CSS defaults apply when no theme/customization
- [ ] Null inheritance resolves correctly
- [ ] Effective values display in controls

### 21.7 Accessibility Testing

**ARIA Attributes**:
- [ ] `aria-label` on nav element
- [ ] `aria-expanded` on toggle button (if collapsible)
- [ ] `aria-controls` links button to content
- [ ] `aria-labelledby` links content to button
- [ ] `role="region"` on content (if collapsible)
- [ ] `hidden` attribute on collapsed content

**Keyboard Navigation**:
- [ ] Tab navigates through links
- [ ] Enter/Space activate links
- [ ] Enter/Space toggle collapse (if collapsible)
- [ ] Focus indicators visible
- [ ] No focus trapping


**Color Contrast**:
- [ ] Link color meets WCAG AA (4.5:1)
- [ ] Hover color meets WCAG AA
- [ ] Active color meets WCAG AA
- [ ] Title color meets WCAG AA

### 21.8 Performance Testing

**Loading Performance**:
- [ ] CSS parsing < 50ms (uncached)
- [ ] CSS parsing < 5ms (cached)
- [ ] Heading detection < 100ms (typical post)
- [ ] Theme CSS generation < 50ms
- [ ] Page load overhead < 100ms

**Runtime Performance**:
- [ ] Intersection Observer used (not scroll events)
- [ ] No unnecessary re-renders in editor
- [ ] Effective values memoized

### 21.9 Edge Cases

**Content Variations**:
- [ ] Post with no headings (show empty state)
- [ ] Post with only H1 (exclude by default)
- [ ] Post with 100+ headings (performance)
- [ ] Headings with special characters
- [ ] Headings with HTML entities
- [ ] Duplicate heading text (unique IDs)
- [ ] Very long heading text (truncate/wrap)
- [ ] Headings with emoji (render correctly)

**Multiple TOC Blocks**:
- [ ] Multiple TOCs on same page work independently
- [ ] Each can have different themes
- [ ] Each can have different filter settings
- [ ] No ID conflicts between blocks
- [ ] Theme updates affect all blocks using that theme

**Browser Compatibility**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (Safari, Chrome)

---

## Summary

This specification defines a comprehensive, feature-rich Table of Contents block that follows the established shared architecture of Accordion and Tabs blocks. The TOC block provides:

**Core Features**:
- Automatic heading detection with flexible filtering
- Optional collapsible behavior (reuses accordion logic)
- Advanced numbering system with multiple styles
- Per-level typography with inheritance
- Comprehensive color system
- Sticky/fixed positioning for sidebar TOCs
- Smooth scroll with offset support
- Full mobile responsiveness

**Architecture**:
- Uses shared theme system (create, update, delete themes)
- 3-tier cascade (CSS defaults → Theme → Customizations)
- CSS as single source of truth (`toc.css`)
- Shared UI components (ThemeSelector, ColorPanel, etc.)
- Database storage: `toc_themes` option
- Event system: `tocThemeUpdated` event

**Implementation**:
- ~76 attributes total (3 structural, 3 meta, ~70 customizable)
- 9 inspector sidebar panels
- Reuses extensive shared infrastructure
- New TOC-specific modules for heading detection, etc.
- Complete accessibility (WCAG 2.1 AA)
- Performant (Intersection Observer, caching, memoization)

This document provides complete implementation-ready specifications that a fresh AI agent can use to build the TOC block correctly from scratch, maintaining consistency with the existing accordion/tabs architecture.

---

**Document Version**: 1.0
**Created**: 2025-10-12
**Aligned With**: ACCORDION-HTML-STRUCTURE.md, EDITOR-UI-REQUIREMENTS.md, THEME-SYSTEM-ARCHITECTURE.md, BLOCK-ATTRIBUTES-SCHEMA.md, FRONTEND-RENDERING.md
**Authored By**: Claude Code (Anthropic)
