# Shared Attributes Schema

## Design Rationale

### Why All Customizable Attributes Default to Null?

**Decision**: Every attribute that participates in cascade has `default: null`

**Why**:
- Explicit opt-in for customization (user must actively set)
- Distinguishes "not set" from "set to default value"
- Allows CSS to always be source of truth for uncustomized values
- Clear signal to cascade resolver (null = continue to next tier)

**Example**: `titleColor: { type: 'string', default: null }` not `default: '#333333'`

### Why Icon Default is Down Caret (▾)?

**Decision**: `iconTypeClosed: "▾"` (Unicode down arrow)

**Why**:
- Universal symbol for expandable content
- Matches WordPress admin UI patterns
- Language-agnostic (works in all locales)
- Clear expansion direction

**Alternative Rejected**: Plus sign (+) - less clear direction, requires rotation to minus

### Why Heading Level Default is "none"?

**Decision**: `headingLevel: "none"` (renders as `<span>`, not semantic heading)

**Why**:
- Users should explicitly opt-in to heading semantics
- Avoids accidentally creating poor heading hierarchy
- Common use case: decorative accordions don't need heading structure

**User Control**: Can change to h1-h6 via dropdown in Title Panel

### Why Icon Rotation Default is 180°?

**Decision**: `iconRotation: 180` degrees

**Why**:
- Rotates ▾ (down) to ▴ (up) when open
- Standard animation pattern for expand/collapse
- Works with CSS transform (no JavaScript needed)

**Supports**: deg, turn, rad units

### Why Remove useHeadingStyles?

**Decision**: Deleted `useHeadingStyles` attribute

**Why**:
- Redundant with existing formatting controls (user can format titles with color/typography panels)
- Confusing interaction with `headingLevel`
- Not needed for any use case
- Simplifies attribute schema

---

## Overview

This document defines the **complete attribute schema** for the WordPress Gutenberg collapsible blocks plugin (Accordion and Tabs blocks). Each block represents a standalone interactive element with customizable styling. The schema specifies all data fields, their types, default values, validation rules, and relationships within the 3-tier value cascade system.

**Scope**: This document focuses primarily on the Accordion block (`wp:custom/accordion`), with notes on shared architecture that applies to Tabs blocks as well.

**Purpose**: Serve as the single source of truth for all block data structures, enabling a fresh AI agent to implement the data layer correctly without ambiguity.

**Shared Architecture**: Both Accordion and Tabs blocks use common attribute naming conventions and structures (defined in `src/shared/attributes/`) to ensure consistency. Block-specific attributes are defined separately in each block's implementation.

---

## CSS as Single Source of Truth (v6.0)

### Architecture Overview

In v6.0, all default values for customizable attributes are defined **once** in CSS files as CSS custom properties at `:root`. This eliminates duplicate value definitions across PHP, JavaScript, and CSS files.

**Files:**
- **Accordion:** `assets/css/accordion.css` (defines `--accordion-default-*` variables)
- **Tabs:** `assets/css/tabs.css` (defines `--tabs-default-*` variables)

**Shared Parsing**: Both blocks use the same PHP parsing function (`parse_css_defaults()`) from shared utilities.

### How It Works

**1. Defaults Defined in CSS:**

**Accordion example (`accordion.css`):**
```css
:root {
  --accordion-default-title-color: #333333;
  --accordion-default-title-size: 16px;
  --accordion-default-title-padding-top: 12px;
  /* ... all other defaults */
}
```

**Tabs example (`tabs.css`):**
```css
:root {
  --tabs-default-title-color: #ffffff;
  --tabs-default-title-size: 14px;
  --tabs-default-orientation: horizontal;
  /* ... all other defaults */
}
```

**2. PHP Parses CSS File:**
- PHP reads the appropriate CSS file (`accordion.css` or `tabs.css`) on first request
- Extracts all `--[blocktype]-default-*` variables using shared parser
- Parses values to appropriate PHP types
- Caches results with file modification time

**3. JavaScript Gets Defaults from PHP:**
- PHP passes parsed defaults via `wp_localize_script`
- Accordion: JavaScript receives values in `window.accordionDefaults`
- Tabs: JavaScript receives values in `window.tabsDefaults`
- Editor uses these for controls and preview

**4. Attributes Default to Null:**
- All customizable attributes in the schema default to `null`
- Actual default values come from the parsed CSS
- Null signals "use the CSS default"

### Why This Matters

**Before v6.0:** Change default padding = update 3 files (CSS, PHP, JavaScript)

**After v6.0:** Change default padding = edit 1 line in CSS file

All systems automatically sync because they read from the same source.

---

## Document Philosophy

### What This Document Defines

- **All block attributes**: Every piece of data the accordion block can store
- **Data types**: Precise type definitions for each attribute
- **Default values**: Fallback values when no other tier provides a value
- **Validation rules**: Constraints and acceptable ranges
- **Customization classification**: Which attributes are customizable vs structural
- **Serialization format**: How data is stored in post content and database

### What This Document Does NOT Define

- **How to render attributes**: See FRONTEND-RENDERING.md
- **How to build UI controls**: See EDITOR-UI-REQUIREMENTS.md
- **How cascade resolution works**: See THEME-SYSTEM-ARCHITECTURE.md
- **Implementation code**: This is conceptual, not code

---

## Table of Contents

1. [CSS as Single Source of Truth (v6.0)](#css-as-single-source-of-truth-v60)
2. [Attribute Classification](#attribute-classification)
3. [Accordion Block Attributes](#accordion-block-attributes)
4. [Null Inheritance Rules](#null-inheritance-rules)
5. [Theme Data Structure](#theme-data-structure)
6. [Customization Attributes](#customization-attributes)
7. [Validation Rules](#validation-rules)
8. [Serialization Formats](#serialization-formats)
9. [Migration and Versioning](#migration-and-versioning)

---

## Attribute Classification

Attributes are classified into three categories:

### 1. Customizable Attributes

**Definition**: Attributes that participate in the 4-tier cascade (global, theme, block, inline) and can be overridden by themes or inline customizations.

**Characteristics**:
- Stored in themes
- Customizable per-block
- Affect visual appearance or behavior
- Examples: colors, typography, spacing, toggles

### 2. Structural Attributes

**Definition**: Attributes that define block structure and identity, unaffected by themes.

**Characteristics**:
- Never stored in themes
- Never customizable
- Persist across theme changes
- Examples: block ID, content text

### 3. Meta Attributes

**Definition**: Attributes that store operational metadata for the editor.

**Characteristics**:
- Not visible to end users
- Used for editor state management
- Examples: currentTheme, customizationCache, isCustomized

---

## Accordion Block Attributes

The accordion block (`wp:custom/accordion`) represents a single, standalone accordion item with no parent container.

### Complete Attribute List

**Structural Attributes**
- accordionId (string)
- title (string)
- content (string/richtext)
- initiallyOpen (boolean)

**Meta Attributes**
- currentTheme (string)
- customizationCache (object)
- isCustomized (boolean)

**Customizable Attributes** (33 total)
- **Title Styling** (11 attributes)
  - titleColor (string)
  - titleBackgroundColor (string)
  - titleFontSize (number)
  - titleFontWeight (string)
  - titlePadding (object)
  - titleAlignment (string)
  - titleTextTransform (string)
  - titleFontStyle (string)
  - titleTextDecoration (string)
  - headingLevel (string)
  - useHeadingStyles (boolean)
- **Content Styling** (2 attributes)
  - contentBackgroundColor (string)
  - contentPadding (object)
- **Border & Spacing** (9 attributes)
  - accordionBorderThickness (number)
  - accordionBorderStyle (string)
  - accordionBorderColor (string)
  - accordionBorderRadius (object)
  - accordionMarginBottom (number)
  - accordionShadow (string)
  - dividerBorderThickness (number)
  - dividerBorderStyle (string)
  - dividerBorderColor (string)
- **Icon Settings** (7 attributes)
  - showIcon (boolean)
  - iconPosition (string)
  - iconColor (string)
  - iconSize (number)
  - iconTypeClosed (string)
  - iconTypeOpen (string)
  - iconRotation (number)
- **Interactive States** (4 attributes)
  - hoverTitleColor (string)
  - hoverTitleBackgroundColor (string)
  - activeTitleColor (string)
  - activeTitleBackgroundColor (string)

### Structural Attributes

####accordionId

- **Type**: `string`
- **Default**: `""` (auto-generated on block creation)
- **Purpose**: Unique identifier for this accordion block
- **Generation**: Use `wp.blocks.createBlockId()` or similar
- **Validation**: Must be unique on page, alphanumeric + hyphens, max 4 characters (e.g., `a1b2`, `z9y8`)
- **Customizable**: No
- **Theme Storage**: No
- **Notes**: Used for ARIA attributes (e.g., `aria-controls`, `aria-labelledby`)

**Why It Exists**: Ensures accessibility by linking the title button to the content panel uniquely.

#### title

- **Type**: `string`
- **Default**: `"Accordion Title"'
- **Purpose**: The clickable title text of the accordion
- **Validation**: Cannot be empty (minimum 1 character)
- **Customizable**: No
- **Theme Storage**: No
- **Serialization**: Saved in post content

**Why It Exists**: User content, independent of themes.

#### content

- **Type**: `string` or `richtext` (WordPress RichText format)
- **Default**: `""`
- **Purpose**: The collapsible content area
- **Validation**: Can be empty
- **Customizable**: No
- **Theme Storage**: No
- **Serialization**: Saved in post content as HTML

**Why It Exists**: User content, independent of themes.

#### initiallyOpen

- **Type**: `boolean`
- **Default**: `false`
- **Purpose**: Whether the accordion is open when the page loads
- **Validation**: Must be `true` or `false`
- **Customizable**: No
- **Theme Storage**: No

**Why It Exists**: Allows authors to set the initial state per accordion, independent of other blocks.

### Meta Attributes

#### currentTheme

- **Type**: `string`
- **Default**: `""` (represents "Default" theme)
- **Purpose**: Stores the ID of the currently applied theme for this block
- **Validation**: Must match an existing theme id or be empty
- **Customizable**: No
- **Theme Storage**: No
- **Serialization**: Saved in post content

**Why It Exists**: Enables each accordion block to have its own theme, allowing different themes on the same page.

**Special Values**:
- `""` (empty string): Default theme (hardcoded defaults)
- `"Custom"`: Indicates inline customizations
- `"Theme Name"`: Name of a saved theme (e.g., "Professional Blue")

#### customizationCache

- **Type**: `object`
- **Default**: `{}` (empty object)
- **Purpose**: Session-only storage for theme comparison workflow
- **Validation**: Must be a valid object (can be empty)
- **Customizable**: No
- **Theme Storage**: No
- **Serialization**: **NOT saved** - ephemeral only

**Why It Exists**: Preserves customizations during theme preview, cleared when committed or discarded.

**Structure**:
```javascript
accordion-id:
{
  titleColor: "#333333",
  showIcon: true,
  // ... other customizable attributes
}
```

#### isCustomized

- **Type**: `boolean`
- **Default**: `false`
- **Purpose**: Indicates if the block has customizations (modifications from the base theme that is stored)
- **Validation**: Must be `true` or `false`
- **Customizable**: No
- **Theme Storage**: No
- **Serialization**: **NOT saved** - computed at runtime

**Why It Exists**: Drives UI state, showing "(Customized)" in theme dropdown when true.

**Computation Logic**:
```javascript
isCustomized = (any customizable attribute has inline value defined)
```

### Customizable Attributes - Title Styling

#### titleColor

- **Type**: `string`
- **Default**: `null` (CSS default: `#333333`)
- **Purpose**: Text color of accordion title
- **Validation**: Valid CSS color (hex, rgb, rgba, named, hsl, hsla)
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### titleBackgroundColor

- **Type**: `string`
- **Default**: `null` (CSS default: `#f5f5f5`)
- **Purpose**: Background color of title button
- **Validation**: Valid CSS color
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### titleFontSize

- **Type**: `number`
- **Default**: `null` (CSS default: `16`)
- **Purpose**: Font size in pixels
- **Validation**: Must be > 0, typically 12–48
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### titleFontWeight

- **Type**: `string`
- **Default**: `null` (CSS default: `"600"`)
- **Purpose**: Font weight (normal, bold, 100–900)
- **Validation**: Valid CSS font-weight value
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Acceptable Values**: `"normal"`, `"bold"`, `"100"`, `"200"`, ..., `"900"`
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### titlePadding

- **Type**: `object`
- **Default**: `null` (CSS default: `{ top: 12, right: 12, bottom: 12, left: 12 }`)
- **Purpose**: Padding around the title in pixels (per-side)
- **Validation**: Each value must be >= 0
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing
- **Structure**:
```javascript
{
  top: number,
  right: number,
  bottom: number,
  left: number
}
```

#### titleAlignment

- **Type**: `string`
- **Default**: `null` (CSS default: `"left"`)
- **Purpose**: Text alignment within title button
- **Validation**: Must be `"left"`, `"center"`, or `"right"`
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### titleTextTransform

- **Type**: `string`
- **Default**: `null` (CSS default: `"none"`)
- **Purpose**: Text transformation (e.g., uppercase)
- **Validation**: Must be `"none"`, `"uppercase"`, `"lowercase"`, or `"capitalize"`
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### titleFontStyle

- **Type**: `string`
- **Default**: `null` (CSS default: `"normal"`)
- **Purpose**: Font style (e.g., italic)
- **Validation**: Must be `"normal"` or `"italic"` or `"oblique"`
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### titleTextDecoration

- **Type**: `string`
- **Default**: `null` (CSS default: `"none"`)
- **Purpose**: Text decoration (e.g., underline)
- **Validation**: Must be `"none"` or `"underline"` overline, line-through
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### headingLevel

- **Type**: `string`
- **Default**: `"none"` (hardcoded behavioral default)
- **Purpose**: Adds a header html tag around the button if user chooses to
- **Validation**: Must be `"none"`, `"h1"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`, or `"h6"`
- **Customizable**: Yes (behavioral)
- **Theme Storage**: Yes
- **Notes**: Behavioral attribute with hardcoded default (not from CSS)

**Why It Exists**: Enhances SEO and accessibility; wraps title in specified tag or none.

#### useHeadingStyles

- **Type**: `boolean`
- **Default**: `false` (hardcoded behavioral default)
- **Purpose**: Whether to apply default heading styles when headingLevel is not "none"
- **Validation**: Must be `true` or `false`
- **Customizable**: Yes (behavioral)
- **Theme Storage**: Yes
- **Notes**: Behavioral attribute with hardcoded default (not from CSS)

**Why It Exists**: Allows users to apply semantic heading tags without inheriting theme heading styles.

### Customizable Attributes - Content Styling



#### contentBackgroundColor

- **Type**: `string`
- **Default**: `null` (CSS default: `"transparent"`)
- **Purpose**: Background color of content area
- **Validation**: Valid CSS color
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### contentPadding

- **Type**: `object`
- **Default**: `null` (CSS default: `{ top: 12, right: 12, bottom: 12, left: 12 }`)
- **Purpose**: Padding around the content area in pixels (per-side)
- **Validation**: Each value must be >= 0
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing
- **Structure**:
```javascript
{
  top: number,
  right: number,
  bottom: number,
  left: number
}
```

### Customizable Attributes - Border & Spacing

#### accordionBorderThickness

- **Type**: `number`
- **Default**: `null` (CSS default: `1`)
- **Purpose**: Border width of the accordion block (header + content)
- **Validation**: Width >= 0
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### accordionBorderStyle

- **Type**: `string`
- **Default**: `null` (CSS default: `"solid"`)
- **Purpose**: Border style of the accordion block (header + content)
- **Validation**: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### accordionBorderColor

- **Type**: `string`
- **Default**: `null` (CSS default: `"#e0e0e0"`)
- **Purpose**: Border color of the accordion block (header + content)
- **Validation**: Valid CSS colors
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing



#### accordionBorderRadius

- **Type**: `object`
- **Default**: `null` (CSS default: `{ topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 }`)
- **Purpose**: Border radius of the accordion block (per-corner)
- **Validation**: Each value must be >= 0
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing
- **Structure**:
```javascript
{
  topLeft: number,
  topRight: number,
  bottomRight: number,
  bottomLeft: number
}
```

User must be able to choose radius per corner.

#### accordionShadow

- **Type**: `string`
- **Default**: `null` (CSS default: `"none"`)
- **Purpose**: CSS box-shadow for the accordion block
- **Validation**: Valid CSS box-shadow or `"none"`
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### accordionMarginBottom

- **Type**: `number`
- **Default**: `null` (CSS default: `16`)
- **Purpose**: Bottom margin of the accordion block (spacing between accordion blocks)
- **Validation**: Value >= 0
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing




#### dividerBorderThickness

- **Type**: `number`
- **Default**: `null` (CSS default: `0`)
- **Purpose**: Border width of the divider between header and content (border-top of content div)
- **Validation**: Width >= 0
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### dividerBorderStyle

- **Type**: `string`
- **Default**: `null` (CSS default: `"solid"`)
- **Purpose**: Border style of the divider between header and content (border-top of content div)
- **Validation**: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### dividerBorderColor

- **Type**: `string`
- **Default**: `null` (CSS default: `"#e0e0e0"`)
- **Purpose**: Border color of the divider between header and content (border-top of content div)
- **Validation**: Valid CSS colors
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing


#### showIcon

- **Type**: `boolean`
- **Default**: `true` (hardcoded behavioral default)
- **Purpose**: Display expand/collapse icon
- **Validation**: Must be `true` or `false`
- **Customizable**: Yes (behavioral)
- **Theme Storage**: Yes
- **Notes**: Behavioral attribute with hardcoded default (not from CSS)

**Why It Exists**: Controls icon visibility via 4-tier cascade; hidden with `display: none` if `false`.

#### iconPosition

- **Type**: `string`
- **Default**: `"right"` (hardcoded behavioral default)
- **Purpose**: Position of icon relative to title text or div title
- **Validation**: Must be `"left"`, `"right"`, `"box-left"`, or `"box-right"`
- **Customizable**: Yes (behavioral)
- **Theme Storage**: Yes
- **Notes**: Behavioral attribute with hardcoded default (not from CSS)

#### iconColor

- **Type**: `string`
- **Default**: `null` (inherits from `titleColor` at runtime)
- **Purpose**: Color of the icon
- **Validation**: Valid CSS color
- **Customizable**: Yes (CSS-based with inheritance)
- **Theme Storage**: Yes
- **Notes**: When `null`, inherits value from `titleColor`. This is null inheritance, not CSS parsing.

#### iconSize

- **Type**: `number`
- **Default**: `null` (inherits from `titleFontSize` at runtime)
- **Purpose**: Size of icon in pixels
- **Validation**: Must be > 0, typically 12–48
- **Customizable**: Yes (CSS-based with inheritance)
- **Theme Storage**: Yes
- **Unit**: Pixels (px)
- **Notes**: When `null`, inherits value from `titleFontSize`. This is null inheritance, not CSS parsing.

#### iconTypeClosed

- **Type**: `string`
- **Default**: `"▾"` (down arrow, hardcoded behavioral default)
- **Purpose**: Icon content when accordion is closed (enum or custom string/URL)
- **Validation**: Accept any string or URL (starts with `"http"`)
- **Customizable**: Yes (behavioral)
- **Theme Storage**: Yes
- **Notes**: Behavioral attribute with hardcoded default (not from CSS). If URL, auto-resize to 18px with aspect ratio of 1:1 using CSS.

#### iconTypeOpen

- **Type**: `string`
- **Default**: `"none"` (hardcoded behavioral default)
- **Purpose**: Icon content when accordion is open (enum or custom string/URL)
- **Validation**: Accept any string or URL (starts with `"http"`), or "none" to indicate no icon change
- **Customizable**: Yes (behavioral)
- **Theme Storage**: Yes
- **Notes**: Behavioral attribute with hardcoded default (not from CSS). If URL, auto-resize to 18px with aspect ratio of 1:1 using CSS. When set to "none", the icon stays with the value of `iconTypeClosed` and uses `iconRotation`.

#### iconRotation

- **Type**: `number`
- **Default**: `180` (hardcoded behavioral default)
- **Purpose**: Rotation angle when accordion is open (degrees)
- **Validation**: Must be 0–360
- **Customizable**: Yes (behavioral)
- **Theme Storage**: Yes
- **Unit**: Degrees
- **Notes**: Behavioral attribute with hardcoded default (not from CSS). When `iconTypeOpen` is not "none", this is ignored as the icon changes and a default CSS animation is passed.

### Customizable Attributes - Interactive States

#### hoverTitleColor

- **Type**: `string`
- **Default**: `null` (inherits from `titleColor` at runtime)
- **Purpose**: Title text color on hover
- **Validation**: Valid CSS color
- **Customizable**: Yes (CSS-based with inheritance)
- **Theme Storage**: Yes
- **Notes**: When `null`, inherits value from `titleColor`. This is null inheritance, not CSS parsing.

#### hoverTitleBackgroundColor

- **Type**: `string`
- **Default**: `null` (CSS default: `"#eeeeee"`)
- **Purpose**: Title background color on hover
- **Validation**: Valid CSS color
- **Customizable**: Yes (CSS-based)
- **Theme Storage**: Yes
- **Notes**: When `null`, value comes from `accordion.css` via PHP parsing

#### activeTitleColor

- **Type**: `string`
- **Default**: `null` (inherits from `titleColor` at runtime)
- **Purpose**: Title text color when accordion is open
- **Validation**: Valid CSS color
- **Customizable**: Yes (CSS-based with inheritance)
- **Theme Storage**: Yes
- **Notes**: When `null`, inherits value from `titleColor`. This is null inheritance, not CSS parsing.

#### activeTitleBackgroundColor

- **Type**: `string`
- **Default**: `null` (inherits from `titleBackgroundColor` at runtime)
- **Purpose**: Title background color when accordion is open
- **Validation**: Valid CSS color
- **Customizable**: Yes (CSS-based with inheritance)
- **Theme Storage**: Yes
- **Notes**: When `null`, inherits value from `titleBackgroundColor`. This is null inheritance, not CSS parsing.

---

## Null Inheritance Rules

Some attributes use **null inheritance**, where a `null` value triggers inheritance from another attribute at runtime. This is different from CSS parsing.

### CSS Parsing vs Null Inheritance

**CSS Parsing** (most attributes):
- Attribute defaults to `null` in schema
- Actual default value comes from `accordion.css` via PHP parsing
- Examples: `titleColor`, `titleFontSize`, `titlePadding`, `accordionBorderRadius`

**Null Inheritance** (specific attributes):
- Attribute defaults to `null` in schema
- When `null`, value is inherited from another attribute at runtime
- Resolved in PHP during theme generation or frontend rendering
- Examples: `iconColor`, `iconSize`, hover/active states

### Inheritance Relationships

The following attributes inherit when `null`:

#### iconColor → titleColor
```php
if ($iconColor === null) {
    $iconColor = $titleColor;
}
```
**Why**: Icons should match title text color by default for visual consistency.

#### iconSize → titleFontSize
```php
if ($iconSize === null) {
    $iconSize = $titleFontSize;
}
```
**Why**: Icons should scale with title text for proportional sizing.

#### hoverTitleColor → titleColor
```php
if ($hoverTitleColor === null) {
    $hoverTitleColor = $titleColor;
}
```
**Why**: If no hover color specified, keep the same color (hover only changes background by default).

#### activeTitleColor → titleColor
```php
if ($activeTitleColor === null) {
    $activeTitleColor = $titleColor;
}
```
**Why**: When accordion is open, title color stays the same unless explicitly customized.

#### activeTitleBackgroundColor → titleBackgroundColor
```php
if ($activeTitleBackgroundColor === null) {
    $activeTitleBackgroundColor = $titleBackgroundColor;
}
```
**Why**: When accordion is open, background stays the same unless explicitly customized.

### Implementation Notes

**When to resolve inheritance:**
1. **Theme generation**: When creating custom theme CSS
2. **Frontend rendering**: When outputting inline CSS variables
3. **Editor preview**: When displaying effective values in controls

**Inheritance chain:**
- Inheritance is resolved AFTER the 4-tier cascade
- First, resolve the cascade to get effective values
- Then, apply null inheritance rules
- Result is the final computed value

**Example flow:**
```
User edits accordion with theme "Professional Blue"
↓
titleColor resolved via cascade: "#1e3a8a" (from theme)
iconColor attribute value: null (not customized)
↓
Apply null inheritance: iconColor = titleColor
↓
Final iconColor: "#1e3a8a"
```

---

## Theme Data Structure

Themes are stored in the WordPress database as serialized PHP data, allowing each accordion block to apply its own theme.

### Theme Database Schema

**Table**: `wp_options`

**Option Names** (per block type):
- Accordion themes: `accordion_themes`
- Tabs themes: `tabs_themes`

**Option Value**: Serialized array of theme objects

**Shared Architecture Note**: Both block types use identical theme structure and storage mechanism, managed by shared theme-storage.js, but maintain separate theme libraries.

### Complete Snapshot Requirement

**CRITICAL RULE**: Saved themes contain **ALL customizable attributes** with **explicit values**. No null, undefined, or omitted attributes.

**When Creating Theme**:
1. Start with default values for all customizable attributes
2. Override with current effective values
3. Validate that every customizable attribute has a value
4. Save complete object

### Reserved Theme Names

**"Default"** (represented by empty string `""`):
- Not stored in database
- Uses hardcoded default values
- Cannot be modified or deleted
- Always available

**"Custom"** (not a theme):
- Displayed when block has inline customizations
- Inherits values from parent theme for non-overridden attributes via cascading
- Stored as inline attribute values in post content for delta relative to parent theme
- UI-only label

**Validation**: Prevent themes named "Default" (case-insensitive).

### Theme Versioning


**Example Structure**:
```php
array(
  'theme_id (like kh3h)' => array(
    'name' => 'Theme Name',
    'modified' => '2025-10-10 14:30:00',
    'values' => array(
      'titleColor' => '#333333',
      'titleBackgroundColor' => '#f5f5f5',
      // ... all customizable attributes
    )
  )
)
```

---

## Customization Attributes

Customizations are inline attribute values stored in post content, allowing per-block personalizations.

### Storage Location

**Where**: Within the block’s attributes in the post content HTML comment

**Format**: Gutenberg block comment syntax

**Example**:
```html
<!-- wp:custom/accordion {
  "blockId": "accordion-abc123",
  "title": "My Accordion",
  "initiallyOpen": false,
  "currentTheme": "gh38",
  "titleColor": "#ff0000",
  "showIcon": false
} -->
<div class="wp-block-custom-accordion">
  <p>Content here</p>
</div>
<!-- /wp:custom/accordion -->
```

### Customization Lifecycle

#### 1. Creating Customizations
**When**: User changes a control in the sidebar
**Action**: Set attribute value inline
**Example**:
```javascript
setAttributes({ titleColor: "#ff0000" });
```

**Effect**:
- Inline value overrides theme value if value is different
- `isCustomized` becomes `true`
- Theme dropdown shows "(Customized)" suffix

#### 2. Preserving Customizations During Theme Switch
**When**: User switches to a different theme to preview
**Action**: Copy inline customizations to `customizationCache`
**Example**:
```javascript
// Current state
attributes = {
  titleColor: "#ff0000", // inline customization
  showIcon: false, // inline customization
  currentTheme: "Professional Blue"
}

// Switch to "Minimal Dark"
// Step 1: Save customizations
customizationCache = {
  titleColor: "#ff0000",
  showIcon: false
}

// Step 2: Clear inline customizations
setAttributes({
  titleColor: undefined,
  showIcon: undefined,
  currentTheme: "Minimal Dark"
});
```

**Effect**: Block uses new theme’s values; customizations preserved in cache.

#### 3. Restoring Customizations
**When**: User switches back to "Custom" in theme dropdown
**Action**: Restore values from `customizationCache`
**Example**:
```javascript
setAttributes({
  titleColor: customizationCache.titleColor, // "#ff0000"
  showIcon: customizationCache.showIcon, // false
  currentTheme: ""
});
customizationCache = {};
```

#### 4. Committing Customizations to Theme
**When**: User clicks "Update Theme" while `isCustomized` is true
**Action**:
1. Save current effective values to parent theme in database
2. Clear inline customizations
3. Clear `customizationCache`
4. Update all blocks using this theme
**Example**:
```javascript
// Before update
attributes = {
  titleColor: "#ff0000", // inline customization
  currentTheme: "Professional Blue"
}

// Update theme
updateThemeInDatabase("Professional Blue", {
  ...existingThemeValues,
  titleColor: "#ff0000"
});

// Clear inline customization
setAttributes({ titleColor: undefined });

// Trigger event for other blocks
dispatchEvent('accordion-theme-updated', { themeName: "Professional Blue" });
```

#### 5. Discarding Customizations
**When**: User switches to a theme and doesn’t switch back to "Custom"
**Action**: `customizationCache` expires on page reload

---

## Validation Rules

### Type Validation
- **String**: Valid string; colors must be CSS colors; enums must match acceptable values
- **Number**: Numeric, within range; pixels for measurements
- **Boolean**: Strictly `true` or `false` (no truthy/falsy)
- **Object**: Valid JavaScript object, can be empty `{}`

### Range Validation
- Sizes (`titleFontSize`, `contentFontSize`, `iconSize`): `value > 0`
- Measurements (`titlePadding`, `contentPadding`, `blockBorder`, `blockMarginBottom`): `value >= 0`
- `iconRotation`: `0 <= value <= 360`

### Enum Validation
- **titleAlignment**: `"left"`, `"center"`, `"right"`
- **iconPosition**: `"left"`, `"right"`, `"box-left"`, `"box-right"`
- **titleFontWeight**: `"normal"`, `"bold"`, `"100"`–`"900"`
- **titleTextTransform**, **contentTextTransform**: `"none"`, `"uppercase"`, `"lowercase"`, `"capitalize"`
- **titleFontStyle**, **contentFontStyle**: `"normal"`, `"italic"`
- **titleTextDecoration**, **contentTextDecoration**: `"none"`, `"underline"`
- **headingLevel**: `"none"`, `"h1"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`, `"h6"`
- **iconTypeClosed**, **iconTypeOpen**: Prefer enums (e.g., `"plus"`, `"minus"`, `"chevron-down"`, `"chevron-right"`); accept any string or URL

### Color Validation
Accept:
- Hex: `#fff`, `#ffffff`, `#ffffff00`
- RGB: `rgb(255, 255, 255)`
- RGBA: `rgba(255, 255, 255, 0.5)`
- Named: `red`, `blue`, `transparent`
- HSL: `hsl(0, 100%, 50%)`
- HSLA: `hsla(0, 100%, 50%, 0.5)`

**Invalid**: `255, 255, 255` (missing wrapper)

### ID Validation
- **blockId** and **themeId** Unique, alphanumeric + hyphens, max 4 characters, `[a-zA-Z0-9-]+`
- On UI, use theme_name to present to user, but internaly, each theme is identified by theme_id as theme_name can change if renamed

### Theme Name Validation
- Min length: 1
- Max length: 50 (suggested)
- Cannot be "Default" (case-insensitive)
- Must be unique across themes
- Allowed: letters, numbers, spaces, hyphens, underscores

### Content Validation
- **title**: Min 1 character
- **content**: Can be empty, sanitized for XSS
- **iconTypeClosed**, **iconTypeOpen**: If URL, must start with `"http"` or `"https"`; if character, typically 1–5 chars

---

## Serialization Formats

### Post Content Serialization
**Example**:
```html
<!-- wp:custom/accordion {
  "blockId": "accordion-abc123",
  "initiallyOpen": false,
  "currentTheme": "hd39",
  "titleColor": "#ff0000",
  "showIcon": false
} -->
<div class="wp-block-custom-accordion" data-block-id="accordion-abc123">
  <button class="accordion-title" aria-controls="accordion-abc123-content">What is an accordion?</button>
  <div id="accordion-abc123-content" class="accordion-content">
    <p>An accordion is a collapsible content panel.</p>
  </div>
</div>
<!-- /wp:custom/accordion -->
```

**Rules**:
- Serialize only non-default values (WordPress convention)
- Meta attributes like `customizationCache` are NOT serialized
- Structural and customizable attributes are serialized
- Each block is independent, no wrapper for multiple blocks

### Database Serialization (Themes)
**Option Names**:
- Accordion: `accordion_themes`
- Tabs: `tabs_themes`

**Storage Method**: `update_option('[blocktype]_themes', $themes_array)`
**Retrieval Method**: `get_option('[blocktype]_themes', array())`

**Shared Architecture Note**: Both block types use the same shared storage functions with block-type parameter, but themes are stored in separate database options.

### JSON API Format

**Response Format**:
```json
{
  "success": true,
  "data": {
    "theme_id": {
      "name": "Professional Blue",
      "modified": "2025-10-10T14:30:00Z",
      "values": {
        "titleColor": "#333333",
        // ... all customizable attributes
      }
    }
  }
}
```

**Error Format**:
```json
{
  "success": false,
  "error": {
    "code": "invalid_theme_name",
    "message": "Theme name cannot be 'Default' or 'Custom'"
  }
}
```

---

---

## Summary of Key Decisions

1. **Single Block Type**: `wp:custom/accordion` is a standalone accordion item, no parent container.
2. **Fully Independent Blocks**: Each block has its own `currentTheme`, `customizationCache`, and `initiallyOpen`, with no coordination between blocks.
3. **No Shared Wrapper**: Blocks render independently in the frontend, no grouping `<div>`.
4. **Per-Block Themes**: Different accordion blocks can use different themes or inline customizations.
6. **Dynamic Inheritance**: `iconColor` inherits from `titleColor`, `iconSize` from `titleFontSize` at runtime if `null`.
7. **Delta Theme Storage**: Themes store only differences from defaults (unchanged attributes omitted).
8. **Validation Layers**: Client-side, JavaScript, PHP, and database sanitization.
9. **No Shared Behavior**: Open/closed state controlled per block via `initiallyOpen`.

---

## Implementation Checklist

- [ ] Register block as `wp:custom/accordion`
- [ ] Define all attributes with correct types and defaults
- [ ] Validate themes for delta storage (no nulls, omit unchanged values)
- [ ] Generate unique `theme_Id` for each theme
- [ ] User-chosen name for theme is linked to its unique theme_Id
- [ ] Implement 4-tier cascade for customizable attributes
- [ ] Generate unique `blockId` for each block
- [ ] Prevent "Default" as theme names
- [ ] Implement `customizationCache` as non-serialized
- [ ] Read booleans from effective values
- [ ] Validate colors, numbers, enums
- [ ] Serialize only non-default values to post content
- [ ] Store themes in `wp_options`
- [ ] Provide JSON API for theme CRUD
- [ ] Implement dynamic inheritance (e.g., `iconColor` from `titleColor`)
- [ ] Optimize theme loading (lazy load non-current themes)

---

## Related Documentation

- **THEME-SYSTEM-ARCHITECTURE.md**: Details 3-tier cascade resolution and shared architecture philosophy
- **EDITOR-UI-REQUIREMENTS.md**: UI controls for attributes (using shared components)
- **DATA-FLOW-AND-STATE.md**: Attribute flow through the system (shared hooks and events)
- **FRONTEND-RENDERING.md**: Converting attributes to HTML/CSS (shared CSS parsing)
- **ACCORDION-HTML-STRUCTURE.md**: HTML output structure (using shared ARIA helpers)
- **TABS-ACCORDION-INTEGRATION.md**: Comprehensive shared architecture implementation guide

---

## Notes on Implementation

- **Block Registration**: Register `wp:custom/accordion` with the schema above, ensuring it appears as a single block in the Gutenberg inserter.
- **Frontend Rendering**: Each block renders as a self-contained `<div>` with its own title and content, using attributes like `blockId` for ARIA and styling from the 3-tier cascade.
- **Theme Independence**: Since each block can have its own theme, ensure the editor UI (e.g., sidebar) allows selecting a theme per block, and the frontend applies styles accordingly.
- **No Coordination**: No JavaScript is needed to coordinate open/closed states between blocks, as `initiallyOpen` is independent and multiple accordions can be open.
- **Shared Architecture**: Use shared attribute definitions from `src/shared/attributes/` for consistency with tabs block. Both blocks share the same naming conventions and structure patterns.

---

## Changelog

### v2.0 (2025-10-12) - v6.0 Architecture Alignment

**Major Changes:**
- All customizable attribute defaults changed to `null` (CSS-based attributes)
- Default value source changed from hardcoded to `accordion.css` via PHP parsing
- Added comprehensive CSS parsing system documentation
- Introduced distinction between CSS-based and behavioral attributes

**Attribute Updates:**
- Fixed `iconTypeClosed` default: `"▾"` (was `"plus"`)
- Fixed `iconRotation` default: `180` (was `0`)
- Fixed `headingLevel` default: `"none"` (was `"h3"`)

**New Attributes:**
- Added `contentPadding` (object: top, right, bottom, left)
- Added `useHeadingStyles` (boolean, default: false)
- Added `accordionMarginBottom` (number)

**Naming Convention Updates:**
- Standardized prefix: `title*` for title attributes
- Standardized prefix: `accordion*` for wrapper attributes
- Changed to nested objects: `titlePadding`, `contentPadding`, `accordionBorderRadius`

**Documentation Additions:**
- Added "CSS as Single Source of Truth (v6.0)" section
- Added "Null Inheritance Rules" section with comprehensive examples
- Updated Complete Attribute List with accurate count (33 customizable attributes)
- Added distinction between CSS parsing and null inheritance

**Architecture Alignment:**
- Fully aligned with FRONTEND-RENDERING.md v6.0
- Documents CSS parsing workflow (PHP reads → caches → passes to JS)
- Explains `window.accordionDefaults` mechanism
- Clarifies behavioral vs CSS-based attributes

**Breaking Changes:**
- Schema default values changed from explicit to `null` for CSS-based attributes
- Requires implementation of CSS parsing system
- Requires `accordion.css` as single source of truth

---

### v1.0 (Previous)
- Initial schema definition
- Defined 4-tier cascade system
- Established theme data structure
- Created customization lifecycle documentation
