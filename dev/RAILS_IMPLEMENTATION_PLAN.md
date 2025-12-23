# Rails Block Implementation Plan

## Executive Summary

This document outlines the complete implementation strategy for the **Rails** block - a side-reveal panel layout system built on the Tabs foundation. Rails features a **single horizontal row of buttons** (buttons placed next to one another with vertical text orientation) with content panels that expand/reveal with compression animation and flexible positioning modes. Buttons do not stack vertically; they are arranged horizontally in a row, each with vertical writing-mode for text.

**Build Status:** Planning Phase  
**Base Block:** Tabs (reusing engine, patterns, and CSS variable system)  
**Complexity:** High (parent-child block architecture + advanced CSS animations)

**Key Architecture:**  
- **ONE row** (all buttons in a single horizontal arrangement)  
- Row position is implicit (horizontal across the block)  
- Two expansion modes:  
  - **"Next to Button"** - Panels appear beside clicked button (left OR right, per button)  
  - **"Corner"** - Panels appear at fixed corner position (global setting: top-left, top-right, bottom-left, bottom-right)  
- Each button is followed by its corresponding panel in the markup for direct association  

---

## 1. Architecture Overview

### 1.1 Block Structure

Rails uses a **parent-child block pattern** similar to how WordPress core blocks like Columns work:

```
gutplus/rails (parent block - controls layout mode)
├── gutplus/rails-item (child block #1 - button + panel content)
│   └── InnerBlocks (panel content)
├── gutplus/rails-item (child block #2 - button + panel content)
│   └── InnerBlocks (panel content)
└── gutplus/rails-item (child block #3 - button + panel content)
    └── InnerBlocks (panel content)
```

**Parent Block Controls:**  
- Layout mode (nextToButton or corner)  
- Corner position (for corner mode)  
- Compression animation settings  
- Height management  

**Child Block Controls:**  
- Button content (numeral, text, icon)  
- Expansion direction (left or right - for nextToButton mode only)  
- Per-button offsets (X/Y)  
- Button appearance  

**Key Difference from Tabs:**  
- Tabs uses an `attributes.tabs` array for tab data  
- Rails uses **nested blocks** (parent contains child blocks) for more flexible content management  
- Each rails-item block stores its own button config + InnerBlocks content  
- Markup interleaves buttons and panels in a single row container  

### 1.2 Schema Approach

Following the schema-first methodology:  

1. **`schemas/rails.json`** - Parent block attributes (layout mode, corner position, compression, height rules, global styling)  
2. **`schemas/rails-item.json`** - Child block attributes (expansion direction, button content, offsets, per-button styling)  
3. **`schemas/rails-structure.json`** (optional) - Contains HTML markup validators  
4. All schemas auto-generate attributes, types, validators, CSS, and PHP mappings  

### 1.3 Reuse from Tabs

**Shared Components:**  
- Theme system (storage, REST API, delta calculation)  
- CSS variable naming conventions (extend `--rails-*` prefix)  
- Active state management patterns  
- Keyboard navigation (arrow keys, Enter, Space)  
- ARIA patterns (role="tablist", role="tab", role="tabpanel")  

**New Components:**  
- Compression/expansion animation system  
- Vertical writing-mode with tilt direction for button text  
- Per-element offset system (numeral, text, icon)  
- Corner positioning logic (fixed corner placement)  
- Expansion direction logic (nextToButton mode - panels appear beside clicked button)  

---

## 2. Schema Design

### 2.1 Parent Block Schema (`schemas/rails.json`)

**Groups:**  
```json
{
  "blockOptions": "Layout mode, corner position, height rules",
  "compression": "Animation, ratios, min-widths",
  "blockBorders": "Wrapper borders and shadows",
  "panelAppearance": "Panel backgrounds, borders, transitions",
  "typography": "Global font, colors (inherited by child items)",
  "spacing": "Global spacing (inherited by child items)"
}
```

**Key Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `uniqueId` | string | "" | Auto-generated block ID (structural) |
| `currentTheme` | string | "" | Active theme name (structural) |
| `layoutMode` | string | "nextToButton" | Panel positioning: "nextToButton" or "corner" |
| `cornerPosition` | string | "top-right" | Fixed corner: "top-left", "top-right", "bottom-left", "bottom-right" |
| `heightMode` | string | "matchTallest" | "matchTallest" or "maxHeight" |
| `maxHeight` | string | "none" | Max height for panel (e.g., "600px", "80vh") |
| `overflowBehavior` | string | "scrollbar" | "scrollbar" or "buttons" (when content > maxHeight) |
| `scrollButtonSize` | number | 2.5 | Size of up/down scroll buttons in rem |
| `scrollButtonColor` | string | "#666666" | Color of scroll buttons |
| `scrollAnimationDuration` | number | 300 | Scroll animation duration in ms |
| `compressionRatio` | number | 0.3 | How much inactive buttons shrink (0-1) |
| `minButtonWidth` | number | 40 | Minimum button width in px |
| `compressionDuration` | number | 300 | Animation duration in ms |
| `compressionEasing` | string | "ease-in-out" | CSS easing function |
| `panelWidth` | string | "auto" | Panel width (auto, px, %, vw) |
| `panelMaxWidth` | string | "none" | Max panel width |
| `panelPadding` | number | 1.5 | Panel padding in rem |
| `panelBg` | string | "#ffffff" | Panel background color |
| `panelBorderColor` | string | "#dddddd" | Panel border color |
| `panelBorderWidth` | number | 1 | Panel border width in px |
| `panelBorderRadius` | object | {4,4,4,4} | Panel corner radius |
| `panelTransition` | string | "slide" | "slide", "fade", or "none" |
| `globalButtonPadding` | number | 1 | Default button padding (rem) - inherited by children |
| `globalFontSize` | number | 1 | Default font size (rem) - inherited by children |
| `globalFontWeight` | string | "500" | Default font weight - inherited by children |

**Non-Themeable Attributes:**  
- `layoutMode`, `cornerPosition` (structural)  
- `heightMode`, `overflowBehavior`, `maxHeight` (structural)  
- `uniqueId`, `currentTheme` (structural)  

**Themeable Attributes:**  
- All compression*, panel*, border*, scroll* attributes  
- Global typography and spacing attributes  

**Groups:**  
```json
{
  "itemOptions": "Expansion direction, active state, disabled state",
  "content": "Numeral text, text text",
  "orientation": "Writing-mode, tilt direction",
  "spacing": "Numeral/text/icon spacing",
  "offsets": "Position adjustments (numeral, text, icon)",
  "typography": "Font, colors, borders (per-button overrides)",
  "icon": "Icon settings, rotation, swap behavior"
}
```

**Key Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `expansionDirection` | string | "right" | Panel expansion: "left" or "right" (nextToButton mode only) |
| `tiltDirection` | string | "-90" | Text rotation: "-90" or "+90" (vertical writing-mode) |
| `isActive` | boolean | false | Whether this item is currently active |
| `isDisabled` | boolean | false | Whether button is disabled |
| `numeralText` | string | "" | Numeral/number text |
| `textText` | string | "Button" | Button text text |
| `numeralTextGap` | number | 0.5 | Gap between numeral and text (rem) |
| `textIconGap` | number | 0.5 | Gap between text and icon (rem) |
| `buttonPadding` | number | 1 | Button padding (rem) |
| `numeralOffsetX` | number | 0 | Numeral X offset (px) |
| `numeralOffsetY` | number | 0 | Numeral Y offset (px) |
| `textOffsetX` | number | 0 | Text X offset (px) |
| `textOffsetY` | number | 0 | Text Y offset (px) |
| `iconOffsetX` | number | 0 | Icon X offset (px) |
| `iconOffsetY` | number | 0 | Icon Y offset (px) |
| `iconPosition` | string | "bottom" | "top" or "bottom" (in vertical flow) |
| `iconType` | string | "rotate" | "rotate" or "swap" |
| `iconClosed` | string | "▾" | Icon for inactive state |
| `iconOpen` | string | "▴" | Icon for active state (if swap mode) |
| `iconRotation` | number | 0 | Base rotation angle (deg) |
| `iconRotationActive` | number | 180 | Active rotation angle (deg) |
| `iconSize` | number | 1 | Icon size (rem) |
| `iconColor` | string | "#666666" | Icon color |
| `buttonBg` | string | "#f5f5f5" | Button background |
| `buttonColor` | string | "#333333" | Button text color |
| `buttonActiveBg` | string | "#ffffff" | Active button background |
| `buttonActiveColor` | string | "#000000" | Active button text color |
| `buttonBorderWidth` | number | 1 | Button border width (px) |
| `buttonBorderColor` | string | "#dddddd" | Button border color |
| `fontSize` | number | 1 | Font size (rem) |
| `fontWeight` | string | "500" | Font weight |

**Non-Themeable Attributes:**  
- `expansionDirection`, `tiltDirection` (structural)  
- `isActive`, `isDisabled` (behavioral)  
- `numeralText`, `textText` (content)  

**Themeable Attributes:**  
- All spacing, offset, typography, icon, button appearance attributes  

### 2.2 Rails Markup Schema (`schemas/rails-structure.json`)

Defines HTML markup validators for the whole html structure for validators.

---

## 3. DOM Structure

### 3.1 Parent Block HTML

```html
<div class="gutplus-rails rails-theme-{themeName}"
     data-layout-mode="nextToButton"
     data-corner-position="top-right"
     data-height-mode="matchTallest">

  <!-- SINGLE ROW - All buttons and panels interleaved here -->
  <div class="rails-row">
    {interleaved rails-item blocks: button + panel for each}
  </div>

</div>
```

**Key Changes:**  
- ✅ **ONE** `.rails-row` container (buttons and panels interleaved horizontally)  
- ✅ `data-corner-position` for corner mode positioning  
- ✅ Child blocks render button followed by panel  

### 3.2 Child Block (Rails Item) HTML

```html
<!-- Button -->
<button class="rails-button"
        data-expansion-direction="right"
        data-tilt="-90"
        data-item-index="0"
        aria-selected="true"
        role="tab">

  <span class="rails-button-content" style="writing-mode: vertical-rl;">

    <!-- Icon Top (if iconPosition="top") -->
    <span class="rails-button-icon" style="order: 0;">▾</span>

    <!-- Numeral -->
    <span class="rails-button-numeral"
          style="order: 1; transform: translate(var(--numeral-x), var(--numeral-y));">
      01
    </span>

    <!-- Text -->
    <span class="rails-button-text"
          style="order: 2; transform: translate(var(--text-x), var(--text-y));">
      Introduction
    </span>

    <!-- Icon Bottom (if iconPosition="bottom") -->
    <span class="rails-button-icon" style="order: 3;">▾</span>

  </span>

</button>

<!-- Associated Panel -->
<div class="rails-content rails-content-active" data-item-index="0">
  {InnerBlocks content}
</div>
```

**Key Changes:**  
- ✅ `data-expansion-direction` used in nextToButton mode  
- ✅ Panel follows immediately after button in markup  
- ✅ Vertical writing-mode for button content  

**CSS Variables Applied Per Item:**  
```css
.rails-button {
  --numeral-x: 0px;
  --numeral-y: -5px;
  --text-x: 0px;
  --text-y: 0px;
  --icon-x: 0px;
  --icon-y: 10px;
  --button-width: 60px; /* Compressed: 60px * compressionRatio */
}
```

**Note:** Buttons are placed next to each other horizontally in the row, with vertical text. Panels are hidden by default and revealed based on mode.

---

## 3. Height Management & Overflow Behavior

### 3.1 Height Modes

Rails supports two height management strategies controlled by the `heightMode` attribute:  

#### Mode 1: Match Tallest (Default)

**Behavior:**  
- Block height dynamically adjusts to the tallest element  
- Compares: row height vs. active panel height  
- No scrolling needed - content always fully visible  
- Best for: Variable content lengths, editorial layouts  

**Implementation:**  
```javascript
function updateBlockHeight(block) {
  const rowHeight = row.offsetHeight;
  const activePanelHeight = activePanel.offsetHeight;

  const tallest = Math.max(rowHeight, activePanelHeight);
  block.style.minHeight = `${tallest}px`;
}
```

**CSS:**  
```css
.gutplus-rails[data-height-mode="matchTallest"] {
  min-height: var(--rails-calculated-height);
  height: auto;
}
```

#### Mode 2: Max Height (Fixed)

**Behavior:**  
- User specifies maximum panel height (e.g., "600px", "80vh")  
- If content exceeds max height → overflow handling activates  
- Overflow options: scrollbar OR up/down buttons  
- Best for: Consistent layouts, fixed-height designs, long content  

**Schema Attributes:**  
```json
{
  "heightMode": "maxHeight",
  "maxHeight": "600px",
  "overflowBehavior": "scrollbar" // or "buttons"
}
```

**CSS:**  
```css
.gutplus-rails[data-height-mode="maxHeight"] {
  .rails-content {
    max-height: var(--rails-max-height);
    overflow: hidden; /* Managed by JS */
  }
}
```

### 3.2 Overflow Behavior Options

When `heightMode="maxHeight"` and content exceeds `maxHeight`:  

#### Option A: Scrollbar (Default)

**Implementation:**  
```css
.rails-content[data-overflow="scrollbar"] {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--rails-scrollbar-thumb) var(--rails-scrollbar-track);
}

/* Webkit browsers */
.rails-content[data-overflow="scrollbar"]::-webkit-scrollbar {
  width: 8px;
}

.rails-content[data-overflow="scrollbar"]::-webkit-scrollbar-thumb {
  background: var(--rails-scrollbar-thumb);
  border-radius: 4px;
}
```

#### Option B: Up/Down Buttons

**Implementation:**  

```javascript
class RailsPanelScroller {
  // Similar to previous, but adapted for horizontal row context
  // ...
}
```

**CSS for Buttons:**  
```css
.rails-scroll-button {
  // Similar to previous
  // ...
}
```

### 3.3 CSS Animation Implementation

**Compression Animation:**  

```css
@keyframes compressButton {
  // Similar to previous
  // ...
}

.rails-button {
  // Similar to previous, applied to horizontal buttons
  // ...
}
```

**Panel Slide Animation:**  

```css
@keyframes slideInRight {
  // Similar to previous
  // ...
}

.rails-content {
  // Similar to previous
  // ...
}
```

---

## 4. Responsive Behavior

### 4.1 Breakpoint Strategy

**Recommended Breakpoints:**  
- Desktop: > 1024px (Horizontal row layout as designed)  
- Tablet: 768px - 1024px (Keep row or transform)  
- Mobile: < 768px (Transform required, e.g., to vertical stack)  

### 4.2 Responsive Transformation Options

#### Option A: Transform to Vertical Stack (Recommended for Mobile)

**Visual Transformation:**  

Mobile (Vertical Stack):  
```
┌─────────────┐
│ 1 Intro ▾   │ (button)
└─────────────┘
┌─────────────┐
│ Content     │ (panel if active)
└─────────────┘
┌─────────────┐
│ 2 Features ▾│ (button)
└─────────────┘
...
```

**Implementation:**  
```css
@media (max-width: 768px) {
  .gutplus-rails {
    flex-direction: column;
  }

  .rails-row {
    flex-direction: column !important;
    width: 100%;
  }

  .rails-button {
    writing-mode: horizontal-tb !important;
    width: 100%;
  }

  .rails-content {
    width: 100%;
  }
}
```

**JavaScript Adjustments:**  
```javascript
function initRailsResponsive(block) {
  // Similar to previous, transform to vertical for mobile
  // ...
}
```


**Rationale:**  
- Better for touch on small screens  
- Prevents horizontal scrolling  
- Maintains vertical text if desired, or switches to horizontal  

**Schema Addition:**  
```json
{
  "responsiveMode": {
    "type": "string",
    "default": "stack",
    "group": "blockOptions",
    "label": "Mobile Layout",
    "description": "How Rails transforms on mobile devices",
    "themeable": false,
    "reason": "structural",
    "control": "SelectControl",
    "options": [
      {
        "label": "Vertical Stack (Recommended)",
        "value": "stack"
      },
      {
        "label": "Keep Horizontal Row",
        "value": "none"
      }
    ]
  },
  "responsiveBreakpoint": {
    "type": "number",
    "default": 768,
    "group": "blockOptions",
    "label": "Mobile Breakpoint",
    "description": "Screen width (px) below which responsive mode activates",
    "themeable": false,
    "reason": "structural",
    "control": "RangeControl",
    "min": 480,
    "max": 1024,
    "unit": "px"
  }
}
```

---

## 5. Agent-Based Implementation Workflow

### Overview

This section breaks down the Rails block implementation into **8 phases** with **15 specialized agents**. Each agent handles a specific, bounded task and can be independently invoked and resumed if context limits are hit.  

**Total Agents:** 15  
**Total Phases:** 8  
  

**Phase Distribution:**  
- **Simple phases** (1 agent): Schema Setup, Block Registration, PHP Integration  
- **Medium phases** (2 agents): Frontend Rendering, Testing  
- **Complex phases** (3 agents): Editor Components, Frontend JS, Styling  

### Agent Invocation Pattern

```javascript
// Starting a new agent
Task tool → subagent_type: "general-purpose" → prompt: [agent task from section below]

// Resuming an agent (if limit hit)
Task tool → resume: "agent_id_from_previous_run"
```

# PHASE 1: Schema Setup

**Complexity:** Simple  
**Agents:** 1  

## Agent 1.1: Schema Creator

**Agent ID Convention:** `rails-schema-creator`  

**Context Required:**  
- CLAUDE.md (schema-first methodology)  
- RAILS_IMPLEMENTATION_PLAN.md (sections 2.1 and 2.2 - schema design)  
- schemas/tabs.json (reference example)  

**Task Description:**  
```
You are implementing the Rails block schema files for a WordPress Gutenberg plugin.

TASK CHECKLIST:
1. Create schemas/rails.json (parent block schema)
   - Copy structure from RAILS_IMPLEMENTATION_PLAN.md section 2.1
   - Define all parent block attributes (layoutMode, heightMode, compression, panel, responsive)
   - Define attribute groups (blockOptions, compression, panelAppearance, blockBorders)
   - Set cssVar, control, themeable, order for each attribute
   - Follow exact format from schemas/tabs.json

2. Create schemas/rails-item.json (child block schema)
   - Copy structure from RAILS_IMPLEMENTATION_PLAN.md section 2.2
   - Define all child block attributes (expansionDirection, offsets, icon, typography)
   - Define attribute groups (itemOptions, orientation, spacing, offsets, typography, icon)
   - Set cssVar, control, themeable, order for each attribute

3. Update build-tools/schema-compiler.js
   - Add 'rails' to BLOCKS array
   - Add 'rails-item' to BLOCKS array
   - Verify compiler will generate files for both blocks

4. Run schema:build
   - Execute: npm run schema:build
   - Verify 48 files generated (24 per schema)
   - Check for errors in console output

5. Verify verified generated files exist:
   - blocks/rails/src/rails-attributes.js
   - blocks/rails-item/src/rails-item-attributes.js
   - shared/src/types/rails-theme.ts
   - shared/src/types/rails-item-theme.ts
   - php/css-defaults/rails.php
   - php/css-defaults/rails-item.php
   - assets/css/rails-variables.css
   - assets/css/rails-item-variables.css
   - docs/rails-attributes.md
   - docs/rails-item-attributes.md

IMPORTANT:
- Use exact attribute names from implementation plan (e.g., textText instead of labelText)
- Include ALL attributes (don't skip any)
- Set correct 'themeable' values (true/false with reason)
- Set correct 'control' types (ColorPicker, RangeControl, SelectControl, etc.)
- Include min/max/unit for RangeControl attributes
- Include options array for SelectControl attributes

SUCCESS CRITERIA:
✅ Both schema files created and valid JSON
✅ schema-compiler.js updated with both blocks
✅ npm run schema:build completes without errors
✅ All 48 expected files generated
✅ Generated attributes files contain all expected attributes
```

**Deliverables:**  
- `schemas/rails.json` (parent block schema)  
- `schemas/rails-item.json` (child block schema)  
- `build-tools/schema-compiler.js` (updated)  
- 48 auto-generated files  



**Resume Strategy:**  
If limit hit during this agent:  
- Agent likely paused after creating one schema file  
- Resume with: "Continue creating the remaining schema file and run the build"  
- Agent has context of what's been completed  

# PHASE 2: Block Registration

**Complexity:** Simple  
**Agents:** 1  

## Agent 2.1: Block Scaffolder

**Agent ID Convention:** `rails-block-scaffolder`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (section 5, Phase 2)  
- blocks/tabs/block.json (reference example)  
- blocks/tabs/src/index.js (reference example)  
- Generated files from Phase 1  

**Task Description:**  
```
You are scaffolding the Rails block file structure and minimal registration code.

TASK CHECKLIST:
1. Create blocks/rails/ directory structure:
   blocks/rails/
   ├── block.json
   └── src/
       ├── index.js
       ├── edit.js (placeholder)
       ├── save.js (placeholder)
       ├── frontend.js (placeholder)
       ├── style.scss (placeholder)
       └── editor.scss (placeholder)

2. Create blocks/rails/block.json:
   - Set blockType: "gutplus/rails"
   - Set title: "Rails"
   - Set category: "layout"
   - Set parent: false (can be inserted anywhere)
   - Set supports: { html: false, anchor: true }
   - Reference rails-attributes.js for attributes
   - Set editorScript, editorStyle, style, viewScript

3. Create blocks/rails/src/index.js:
   - Import registerBlockType from @wordpress/blocks
   - Import edit from './edit'
   - Import save from './save'
   - Import rails-attributes.js
   - Register block with metadata from block.json
   - Export block name

4. Create blocks/rails/src/edit.js (minimal placeholder):
   - Import useBlockProps
   - Return basic div with "Rails Block (Editor)" text
   - Will be completed in Phase 3

5. Create blocks/rails/src/save.js (minimal placeholder):
   - Import useBlockProps.save
   - Return basic div with "Rails Block (Frontend)" text
   - Will be completed in Phase 4

6. Create blocks/rails-item/ directory structure:
   blocks/rails-item/
   ├── block.json
   └── src/
       ├── index.js
       ├── edit.js (placeholder)
       ├── save.js (placeholder)
       ├── style.scss (placeholder)
       └── editor.scss (placeholder)

7. Create blocks/rails-item/block.json:
   - Set blockType: "gutplus/rails-item"
   - Set title: "Rails Item"
   - Set category: "layout"
   - Set parent: ["gutplus/rails"] (only inside rails)
   - Set supports: { html: false, reusable: false }
   - Reference rails-item-attributes.js
   - Enable InnerBlocks support

8. Create blocks/rails-item/src/index.js:
   - Similar structure to rails/index.js
   - Register rails-item block

9. Create blocks/rails-item/src/edit.js (minimal placeholder):
   - Import useBlockProps, InnerBlocks
   - Return basic div with "Rails Item (Editor)" + InnerBlocks
   - Will be completed in Phase 3

10. Create blocks/rails-item/src/save.js (minimal placeholder):
    - Import useBlockProps.save, InnerBlocks.Content
    - Return interleaved button and panel markup
    - Will be completed in Phase 4

11. Create empty SCSS files:
    - blocks/rails/src/style.scss (add comment: "Frontend styles - Phase 6")
    - blocks/rails/src/editor.scss (add comment: "Editor styles - Phase 3")
    - blocks/rails-item/src/style.scss (add comment: "Frontend styles - Phase 6")
    - blocks/rails-item/src/editor.scss (add comment: "Editor styles - Phase 3")

12. Run build and verify:
    - Execute: npm run build
    - Check for compilation errors
    - Verify blocks appear in WordPress inserter (if WP available)
    - Verify parent-child relationship (rails-item only shows inside rails)

SUCCESS CRITERIA:
✅ Both block directories created with complete structure
✅ Both block.json files valid and properly configured
✅ Both index.js files register blocks successfully
✅ Placeholder edit.js and save.js files created
✅ npm run build completes without errors
✅ Blocks appear in WordPress inserter (if testable)
✅ Parent-child relationship enforced (rails-item only inside rails)
```

**Deliverables:**  
- `blocks/rails/` directory with 6 files  
- `blocks/rails-item/` directory with 5 files  
- Compiled build files in `build/blocks/rails/` and `build/blocks/rails-item/`  

**Estimated Time:** 2 hours  

**Resume Strategy:**  
If limit hit:  
- Likely paused after creating parent block files  
- Resume with: "Continue creating rails-item block structure and run build"  

# PHASE 3: Editor Components

**Complexity:** Complex  
**Agents:** 3  

## Agent 3.1: Parent Block Editor

**Agent ID Convention:** `rails-parent-editor`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (sections 5, Phase 3 - Parent Block tasks)  
- blocks/tabs/src/edit.js (reference for theme integration)  
- shared/src/components/ (ThemeSelector, ColorPanel, etc.)  
- blocks/rails/src/rails-attributes.js (generated)  

**Task Description:**  
```
You are implementing the Rails parent block editor component (edit.js).

TASK CHECKLIST:
1. Import required dependencies:
   - @wordpress/block-editor: useBlockProps, InnerBlocks, useSelect, useDispatch
   - @wordpress/blocks: createBlock
   - @wordpress/components: PanelBody, SelectControl, RangeControl, TextControl, ToggleControl
   - Theme components: ThemeSelector, ColorPanel, etc.
   - Rails attributes

2. Implement edit.js component structure:
   - Accept props: { attributes, setAttributes, clientId }
   - Use useBlockProps for wrapper
   - Use useSelect to get child rails-item blocks

3. Implement editor preview layout:
   - Render wrapper div with data attributes (layoutMode, heightMode)
   - Render single row container with interleaved button and panel previews
   - Add placeholder if no items exist

4. Implement InnerBlocks configuration:
   - Set allowedBlocks: ['gutplus/rails-item']
   - Set template: initial 2 rails-items
   - Set templateLock: false (allow adding/removing)

5. Implement Inspector Controls panels:
   PANEL 1: Block Options
   - layoutMode (SelectControl: nextToButton / corner)
   - cornerPosition (SelectControl: top-left / top-right / bottom-left / bottom-right, shown if layoutMode=corner)
   - heightMode (SelectControl: matchTallest / maxHeight)
   - maxHeight (TextControl, shown if heightMode=maxHeight)
   - overflowBehavior (SelectControl: scrollbar / buttons, shown if heightMode=maxHeight)
   - responsiveMode (SelectControl: stack / none)
   - responsiveBreakpoint (RangeControl, shown if responsiveMode≠none)

   PANEL 2: Compression Settings
   - compressionRatio (RangeControl 0-1)
   - minButtonWidth (RangeControl px)
   - compressionDuration (RangeControl ms)
   - compressionEasing (SelectControl: ease-in-out / ease / linear / ease-in / ease-out)

   PANEL 3: Panel Appearance
   - panelWidth (TextControl)
   - panelMaxWidth (TextControl)
   - panelPadding (RangeControl rem)
   - panelBg (ColorPicker)
   - panelBorderColor (ColorPicker)
   - panelBorderWidth (RangeControl px)
   - panelBorderRadius (BorderRadiusControl)
   - panelTransition (SelectControl: slide / fade / none)

   PANEL 4: Block Borders
   - borderColor, borderWidth, borderStyle, borderRadius, shadow, shadowHover
   - (Similar to tabs block)

   PANEL 5: Scroll Buttons (shown if overflowBehavior=buttons)
   - scrollButtonSize (RangeControl rem)
   - scrollButtonColor (ColorPicker)
   - scrollAnimationDuration (RangeControl ms)

6. Integrate ThemeSelector:
   - Import ThemeSelector component
   - Pass blockType="rails"
   - Pass currentTheme, setAttributes
   - Render at top of inspector controls

7. Apply CSS variables for live preview:
   - Generate style object with CSS variables
   - Apply --rails-* variables based on attributes
   - Pass to blockProps style

8. Add editor-specific styles:
   - Update blocks/rails/src/editor.scss
   - Style the preview layout
   - Style row container
   - Style panel preview area
   - Add visual indicators for empty states

SUCCESS CRITERIA:
✅ Edit.js renders proper editor layout
✅ Single row container shows interleaved buttons and panels correctly
✅ All inspector control panels render
✅ All controls update attributes correctly
✅ ThemeSelector integrated and functional
✅ CSS variables applied for live preview
✅ InnerBlocks allows adding rails-item blocks
✅ Editor styles make layout clear and usable
```

**Deliverables:**  
- `blocks/rails/src/edit.js` (complete)  
- `blocks/rails/src/editor.scss` (complete)  



**Resume Strategy:**  
If limit hit:  
- Agent likely paused after implementing basic structure or some panels  
- Resume with: "Continue implementing remaining inspector control panels and theme integration"  
- Check which panels are done, continue from there  

## Agent 3.2: Child Block Editor

**Agent ID Convention:** `rails-item-editor`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (sections 5, Phase 3 - Child Block tasks)  
- blocks/tabs/src/edit.js (reference for controls)  
- blocks/rails-item/src/rails-item-attributes.js (generated)  

**Task Description:**  
```
You are implementing the Rails Item child block editor component (edit.js).

TASK CHECKLIST:
1. Import required dependencies:
   - @wordpress/block-editor: useBlockProps, InnerBlocks, RichText
   - @wordpress/components: PanelBody, SelectControl, RangeControl, ColorPicker, ToggleControl
   - Rails-item attributes

2. Implement edit.js component structure:
   - Accept props: { attributes, setAttributes, clientId }
   - Use useBlockProps for button wrapper
   - Apply vertical writing-mode preview style

3. Implement editor preview:
   - Render button element with rails-button class
   - Apply data attributes (tiltDirection, expansionDirection)
   - Render vertical content preview:
     - Icon (if iconPosition=top)
     - Numeral (RichText editable)
     - Text (RichText editable)
     - Icon (if iconPosition=bottom)
   - Apply offset transforms as inline styles for preview
   - Render panel preview immediately after button (collapsed in editor)

4. Implement Inspector Controls panels:
   PANEL 1: Item Options
   - expansionDirection (SelectControl: left / right, shown if layoutMode=nextToButton)
   - tiltDirection (SelectControl: -90 / +90)
   - isDisabled (ToggleControl)

   PANEL 2: Orientation & Writing Mode
   - Visual helper showing current tilt
   - Note about vertical-rl usage

   PANEL 3: Spacing
   - numeralTextGap (RangeControl rem)
   - textIconGap (RangeControl rem)
   - buttonPadding (RangeControl rem)

   PANEL 4: Offsets
   - numeralOffsetX (RangeControl px, -100 to 100)
   - numeralOffsetY (RangeControl px, -100 to 100)
   - textOffsetX (RangeControl px, -100 to 100)
   - textOffsetY (RangeControl px, -100 to 100)
   - iconOffsetX (RangeControl px, -100 to 100)
   - iconOffsetY (RangeControl px, -100 to 100)

   PANEL 5: Icon Settings
   - iconPosition (SelectControl: top / bottom)
   - iconType (SelectControl: rotate / swap)
   - iconClosed (TextControl or IconPicker)
   - iconOpen (TextControl or IconPicker, shown if iconType=swap)
   - iconRotation (RangeControl deg, -360 to 360)
   - iconRotationActive (RangeControl deg, -360 to 360, shown if iconType=rotate)
   - iconSize (RangeControl rem)
   - iconColor (ColorPicker)

   PANEL 6: Typography
   - fontSize (RangeControl rem)
   - fontWeight (SelectControl)
   - buttonBg (ColorPicker)
   - buttonColor (ColorPicker)
   - buttonActiveBg (ColorPicker)
   - buttonActiveColor (ColorPicker)
   - buttonBorderWidth (RangeControl px)
   - buttonBorderColor (ColorPicker)

5. Implement offset calculation logic:
   - Create function: getActiveOffsets(attributes)
   - Return X/Y offsets

6. Apply CSS variables and inline styles:
   - Generate style object with:
     - writing-mode: vertical-rl
     - transform: rotate() based on tiltDirection
     - CSS variables for offsets
   - Pass to blockProps style

7. Add editor-specific styles:
   - Update blocks/rails-item/src/editor.scss
   - Style the button preview
   - Style vertical text layout
   - Style RichText fields
   - Add visual indicators for offsets

8. Implement panel preview:
   - Add InnerBlocks component for panel
   - Set template: empty (user adds content)
   - Set templateLock: false
   - Render after button in preview

SUCCESS CRITERIA:
✅ Edit.js renders button and panel preview
✅ Numeral and text are RichText editable
✅ All inspector control panels render
✅ Offset controls update preview in real-time
✅ Writing-mode and tilt direction work correctly
✅ Icon settings apply correctly
✅ Panel preview shows InnerBlocks content
✅ Editor styles make layout clear
```

**Deliverables:**  
- `blocks/rails-item/src/edit.js` (complete)  
- `blocks/rails-item/src/editor.scss` (complete)  



**Resume Strategy:**  
If limit hit:  
- Agent likely paused after implementing some panels  
- Resume with: "Continue implementing remaining inspector panels, focusing on offset and icon controls"  
- Check completed panels, continue from there  

## Agent 3.3: Editor Preview Integration

**Agent ID Convention:** `rails-editor-preview`  

**Context Required:**  
- Completed edit.js files from Agents 3.1 and 3.2  
- RAILS_IMPLEMENTATION_PLAN.md (section 3 - DOM Structure)  
- Theme system components  

**Task Description:**  
```
You are refining the editor preview to show realistic Rails layout and integrating final touches.

TASK CHECKLIST:
1. Enhance parent block preview (blocks/rails/src/edit.js):
   - Implement active item detection (find first item or first with isActive=true)
   - Render active panel preview in row
   - Extract InnerBlocks content from active item
   - Show placeholder if no active item
   - Add "Add Rails Item" button if no items exist

2. Implement row layout logic:
   - Use useSelect to get all child blocks
   - Render interleaved in row

3. Add visual indicators:
   - Highlight active rail item
   - Show expansion direction arrows (←/→)
   - Show compression preview (inactive items slightly narrower)
   - Add labels: "Row", "Content Panel"

4. Implement drag-and-drop hints:
   - Add drop zones for row
   - Show where new items will appear
   - Highlight row on hover

5. Add editor toolbar:
   - Parent block toolbar:
     - Layout mode switcher
     - Height mode switcher
     - Settings button (opens inspector)
   - Child block toolbar:
     - Tilt direction toggle
     - Delete button

6. Refine editor SCSS:
   - Update blocks/rails/src/editor.scss:
     - Add flex layout for row preview
     - Style row container with visual separation
     - Style active panel preview area
     - Add border/background to distinguish editor from frontend
     - Add hover states for interactivity

   - Update blocks/rails-item/src/editor.scss:
     - Style horizontal button preview with vertical text
     - Add compression preview effect
     - Style RichText fields for easy editing
     - Add visual offset indicators (guides/lines)

7. Test editor interactions:
   - Verify adding new rails-item blocks
   - Verify reordering items within row
   - Verify deleting items
   - Verify active item switching
   - Verify InnerBlocks content editing

8. Add helpful empty states:
   - "Add your first Rails Item to get started"
   - "No items in row yet"
   - "Click an item to preview its content here"

9. Implement real-time preview updates:
   - When attributes change, preview updates immediately
   - When content changes, preview updates
   - When items are added/removed, layout recalculates

SUCCESS CRITERIA:
✅ Editor shows realistic preview of Rails layout
✅ Row renders interleaved items correctly
✅ Active panel shows correct content
✅ Adding/removing/reordering items works smoothly
✅ Toolbar buttons work correctly
✅ Editor styles are polished and intuitive
✅ Empty states are helpful
✅ Preview updates in real-time
✅ All interactions feel smooth and responsive
```

**Deliverables:**  
- Refined `blocks/rails/src/edit.js`  
- Refined `blocks/rails-item/src/edit.js`  
- Polished `blocks/rails/src/editor.scss`  
- Polished `blocks/rails-item/src/editor.scss`  


**Resume Strategy:**  
If limit hit:  
- Agent likely paused after enhancing one component  
- Resume with: "Continue refining editor preview, focusing on visual polish and empty states"  

# PHASE 4: Frontend Rendering

**Complexity:** Medium  
**Agents:** 2  

## Agent 4.1: Parent Save Component

**Agent ID Convention:** `rails-parent-save`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (section 3.1 - Parent Block HTML)  
- blocks/tabs/src/save.js (reference)  
- blocks/rails/src/edit.js (for consistency)  

**Task Description:**  
```
You are implementing the Rails parent block save component for frontend rendering.

TASK CHECKLIST:
1. Import required dependencies:
   - @wordpress/block-editor: useBlockProps, InnerBlocks
   - Rails attributes

2. Implement save.js component:
   - Accept props: { attributes }
   - Use useBlockProps.save() for wrapper
   - Generate proper DOM structure for frontend

3. Build wrapper element:
   - div.gutplus-rails
   - Add theme class: rails-theme-{currentTheme} (if theme set)
   - Add data attributes:
     - data-layout-mode={layoutMode}
     - data-height-mode={heightMode}
     - data-max-height={maxHeight} (if heightMode=maxHeight)
     - data-overflow-behavior={overflowBehavior}
     - data-responsive-mode={responsiveMode}
     - data-responsive-breakpoint={responsiveBreakpoint}
     - data-compression-ratio={compressionRatio}
     - data-compression-duration={compressionDuration}
     - data-compression-easing={compressionEasing}
     - data-min-button-width={minButtonWidth}

4. Apply inline CSS variables:
   - Create style object with all themeable CSS variables
   - Include: --rails-panel-*, --rails-compression-*, --rails-scroll-*, etc.
   - Pass to wrapper element

5. Render row layout structure:
   ```jsx
   <div {...blockProps}>
     {/* Row */}
     <div className="rails-row">
       {/* Interleaved child blocks render here */}
       <InnerBlocks.Content />
     </div>
   </div>
   ```

6. Handle InnerBlocks rendering:
   - Use InnerBlocks.Content to render all child blocks (interleaved button + panel)

7. Add hidden configuration data:
   - Add hidden JSON script tag with block configuration
   - Include all settings needed by frontend JS
   - Format: <script type="application/json" data-rails-config>{...}</script>

8. Ensure SEO-friendly output:
   - Semantic HTML structure
   - Proper heading hierarchy (if any)
   - No unnecessary wrapper divs
   - Clean, readable HTML

9. Test save output:
   - Inspect rendered HTML in editor
   - Verify all data attributes present
   - Verify CSS variables applied
   - Verify InnerBlocks.Content renders
   - Check HTML validity

SUCCESS CRITERIA:
✅ save.js renders correct DOM structure
✅ All data attributes present and correct
✅ CSS variables applied properly
✅ InnerBlocks.Content renders child blocks
✅ Row layout structure correct
✅ Hidden config JSON present
✅ HTML is semantic and valid
✅ Output is SEO-friendly
```

**Deliverables:**  
- `blocks/rails/src/save.js` (complete)  

**Estimated Time:** 4 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after basic structure  
- Resume with: "Continue implementing data attributes and CSS variable application"  

## Agent 4.2: Child Save Component

**Agent ID Convention:** `rails-item-save`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (section 3.2 - Child Block HTML)  
- blocks/rails-item/src/edit.js (for consistency)  

**Task Description:**  
```
You are implementing the Rails Item child block save component for frontend rendering.

TASK CHECKLIST:
1. Import required dependencies:
   - @wordpress/block-editor: useBlockProps, InnerBlocks
   - Rails-item attributes

2. Implement save.js component:
   - Accept props: { attributes }
   - Use useBlockProps.save() for button wrapper

3. Build interleaved structure:
   ```jsx
   <>
     <button
       {...blockProps}
       className="rails-button"
       data-expansion-direction={expansionDirection}
       data-tilt={tiltDirection}
       data-item-index={itemIndex}
       aria-selected={isActive}
       aria-disabled={isDisabled}
       role="tab"
     >
       <span className="rails-button-content">
         {/* Icon, Numeral, Text */}
       </span>
     </button>

     <div className="rails-content" data-item-index={itemIndex}>
       <InnerBlocks.Content />
     </div>
   </>
   ```

4. Apply inline CSS variables:
   - Create style object with all themeable CSS variables
   - Include: --rails-item-*, --rails-icon-*, etc.
   - Pass to button element

5. Render button content:
   - Conditional icon position (top/bottom)
   - Numeral text
   - Text text
   - Icon with rotation or swap

6. Handle panel visibility:
   - Add class rails-content-active if isActive
   - Apply ARIA attributes for panel (role="tabpanel")

7. Test save output:
   - Inspect rendered HTML
   - Verify interleaved structure
   - Verify data attributes
   - Verify CSS variables
   - Verify InnerBlocks.Content in panel

SUCCESS CRITERIA:
✅ save.js renders interleaved button and panel
✅ All data attributes present and correct
✅ CSS variables applied properly
✅ Button content renders correctly with vertical text
✅ Panel contains InnerBlocks.Content
✅ HTML is semantic and valid
```

**Deliverables:**  
- `blocks/rails-item/src/save.js` (complete)  

**Estimated Time:** 6 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after button markup  
- Resume with: "Continue implementing panel markup and testing"  

# PHASE 5: Frontend JavaScript

**Complexity:** Complex  
**Agents:** 3  

## Agent 5.1: Frontend Core

**Agent ID Convention:** `rails-frontend-core`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (section 5, Phase 5 - Core JS tasks)  
- blocks/tabs/src/frontend.js (reference)  

**Task Description:**  
```
You are implementing the core frontend JavaScript for the Rails block (frontend.js).

TASK CHECKLIST:
1. Import required dependencies:
   - Query selectors for row, buttons, panels

2. Implement initialization:
   - Find all gutplus-rails blocks on page
   - For each block, parse data attributes
   - Collect buttons and panels from row
   - Set initial active item (first or based on isActive)

3. Implement click handler:
   - Add click listeners to buttons
   - On click, compress inactive buttons
   - Expand active button
   - Hide all panels
   - Show associated panel
   - Position panel based on layoutMode

4. Implement positioning for nextToButton mode:
   - Use button rect to position panel left/right
   - Apply data-direction to panel for animation

5. Implement positioning for corner mode:
   - Position panel at fixed corner

6. Implement keyboard navigation:
   - Arrow left/right for next/prev button
   - Enter/Space to activate
   - Home/End for first/last

7. Implement ARIA updates:
   - Update aria-selected on buttons
   - Update aria-hidden on panels

8. Test core interactions:
   - Clicking buttons activates correct panel
   - Positioning correct for modes
   - Keyboard navigation works
   - ARIA attributes update correctly

SUCCESS CRITERIA:
✅ Blocks initialize correctly
✅ Click handlers work
✅ Positioning logic for both modes works
✅ Keyboard navigation fluid
✅ ARIA compliant
✅ No console errors
```

**Deliverables:**  
- Partial `blocks/rails/src/frontend.js` (core functionality)  

**Estimated Time:** 10 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after initialization or handlers  
- Resume with: "Continue implementing positioning logic and keyboard navigation"  

## Agent 5.2: Frontend Animations

**Agent ID Convention:** `rails-frontend-animations`  

**Context Required:**  
- Partial frontend.js from Agent 5.1  
- RAILS_IMPLEMENTATION_PLAN.md (section 3.3 - Animations)  

**Task Description:**  
```
You are implementing animations in the Rails frontend JavaScript.

TASK CHECKLIST:
1. Implement compression logic:
   - Calculate full and compressed widths
   - On activate, animate active to full
   - Animate inactive to compressed
   - Use requestAnimationFrame for smooth

2. Implement panel transition logic:
   - Add class for animation (slide-left/right, fade)
   - Remove after animation end
   - Use CSS keyframes triggered by class

3. Handle animation durations from attributes:
   - Set --rails-compression-duration etc. dynamically if needed

4. Test animations:
   - Compression smooth at 60fps
   - Panel transitions work (slide/fade)
   - No jank on multiple clicks

SUCCESS CRITERIA:
✅ Compression animates buttons correctly
✅ Panel animations trigger on activate
✅ Animations smooth
✅ Durations/easing from attributes applied
```

**Deliverables:**  
- Extended `blocks/rails/src/frontend.js` (with animations)  

**Estimated Time:** 10 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after compression  
- Resume with: "Continue implementing panel transitions and testing"  

## Agent 5.3: Frontend Responsive & Overflow

**Agent ID Convention:** `rails-frontend-responsive`  

**Context Required:**  
- Completed frontend.js from Agents 5.1 and 5.2  
- RAILS_IMPLEMENTATION_PLAN.md (sections 3.2, 4)  

**Task Description:**  
```
You are implementing responsive and overflow logic in the Rails frontend JavaScript.

TASK CHECKLIST:
1. Implement resize handler:
   - Detect below breakpoint
   - Apply responsive mode (stack/none)
   - Transform to vertical stack if 'stack'

2. Implement overflow for maxHeight:
   - If scrollbar, enable CSS overflow
   - If buttons, add up/down buttons
   - Handle scroll events, disable buttons at ends

3. Test responsive and overflow:
   - Resize triggers transformation
   - Overflow scrollbar works
   - Scroll buttons work
   - Restore on resize up

SUCCESS CRITERIA:
✅ Responsive transformation works
✅ Overflow modes function
✅ Smooth transitions on resize
✅ Mobile UX good
```

**Deliverables:**  
- Completed `blocks/rails/src/frontend.js` (all functionality)  

**Estimated Time:** 6 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after responsive  
- Resume with: "Continue implementing overflow logic and testing"  

# PHASE 6: Styling (SCSS)

**Complexity:** Complex  
**Agents:** 3  

## Agent 6.1: Rails Parent Styles

**Agent ID Convention:** `rails-parent-styles`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (section 5, Phase 6 - Parent Styles)  
- blocks/tabs/src/style.scss (reference)  
- Generated assets/css/rails-variables.css  

**Task Description:**  
```
You are implementing frontend styles for the Rails parent block.

TASK CHECKLIST:
1. Update blocks/rails/src/style.scss:

2. Import CSS variables:
   ```scss
   @import '../../../assets/css/rails-variables.css';
   ```

3. Define base wrapper styles:
   ```scss
   .gutplus-rails {
     display: flex;
     flex-direction: column;
     position: relative;

     // Apply block borders
     border: var(--rails-border-width) var(--rails-border-style) var(--rails-border-color);
     border-radius: var(--rails-border-radius);
     box-shadow: var(--rails-border-shadow);

     &:hover {
       box-shadow: var(--rails-border-shadow-hover);
     }
   }
   ```

4. Style row container:
   ```scss
   .rails-row {
     display: flex;
     flex-direction: row;
     align-items: center;
     gap: 0;
     position: relative;
   }
   ```

5. Style panels:
   ```scss
   .rails-content {
     display: none;
     padding: var(--rails-panel-padding);
     background: var(--rails-panel-bg);
     border: var(--rails-panel-border-width) var(--rails-panel-border-style) var(--rails-panel-border-color);
     border-radius: var(--rails-panel-border-radius);
     transition: opacity 0.3s ease, visibility 0.3s ease;

     &.rails-content-active {
       display: block;
       opacity: 1;
       visibility: visible;
     }

     // Max height mode
     &[data-overflow="scrollbar"] {
       // Similar to previous
     }

     &[data-overflow="buttons"] {
       overflow: hidden;
     }
   }
   ```

6. Style scroll buttons:
   ```scss
   .rails-scroll-button {
     // Similar to previous
   }
   ```

7. Add layout mode variants:
   ```scss
   // Next to button mode
   .gutplus-rails[data-layout-mode="nextToButton"] {
     .rails-content {
       // Position dynamically via JS
     }
   }

   // Corner mode
   .gutplus-rails[data-layout-mode="corner"] {
     .rails-content {
       // Anchored to corner via JS
     }
   }
   ```

8. Add height mode variants:
   ```scss
   // Match tallest mode
   .gutplus-rails[data-height-mode="matchTallest"] {
     min-height: var(--rails-calculated-height);
     height: auto;
   }

   // Max height mode
   .gutplus-rails[data-height-mode="maxHeight"] {
     .rails-content {
       max-height: var(--rails-max-height);
     }
   }
   ```

9. Test styles:
   - Wrapper renders correctly
   - Row positioned properly
   - Panels styled correctly
   - Scroll buttons styled correctly
   - CSS variables applied

SUCCESS CRITERIA:
✅ Base layout styles work
✅ Row positioned correctly
✅ Panel styles complete
✅ Scroll button styles complete
✅ Scrollbar customization works
✅ Layout modes styled correctly
✅ Height modes styled correctly
✅ CSS variables applied throughout
```

**Deliverables:**  
- `blocks/rails/src/style.scss` (complete)  

**Estimated Time:** 5 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after base styles or panel styles  
- Resume with: "Continue implementing scroll button and mode variant styles"  

## Agent 6.2: Rails Item Styles

**Agent ID Convention:** `rails-item-styles`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (section 5, Phase 6 - Child Styles)  
- Generated assets/css/rails-item-variables.css  

**Task Description:**  
```
You are implementing frontend styles for the Rails Item child block.

TASK CHECKLIST:
1. Update blocks/rails-item/src/style.scss:

2. Import CSS variables:
   ```scss
   @import '../../../assets/css/rails-item-variables.css';
   ```

3. Define base button styles:
   ```scss
   .rails-button {
     writing-mode: vertical-rl;
     text-orientation: mixed;
     cursor: pointer;
     border: var(--rails-item-border-width) solid var(--rails-item-border-color);
     background: var(--rails-item-bg);
     color: var(--rails-item-color);
     padding: var(--rails-item-padding);
     font-size: var(--rails-item-font-size);
     font-weight: var(--rails-item-font-weight);
     position: relative;
     overflow: visible;

     transition:
       width var(--rails-compression-duration) var(--rails-compression-easing),
       background var(--rails-transition-duration, 0.3s) ease,
       border-color var(--rails-transition-duration, 0.3s) ease,
       color var(--rails-transition-duration, 0.3s) ease;

     &:hover:not([disabled]) {
       background: var(--rails-item-hover-bg);
       color: var(--rails-item-hover-color);
     }

     &:focus {
       outline: 2px solid var(--rails-item-focus-color, #0073aa);
       outline-offset: 2px;
     }

     &[disabled] {
       opacity: 0.5;
       cursor: not-allowed;
     }
   }
   ```

4. Add tilt direction styles:
   ```scss
   .rails-button {
     &[data-tilt="-90"] {
       transform: rotate(0deg);
     }

     &[data-tilt="+90"] {
       transform: rotate(180deg);
     }
   }
   ```

5. Add active state styles:
   ```scss
   .rails-button[aria-selected="true"] {
     background: var(--rails-item-active-bg);
     color: var(--rails-item-active-color);
     border-color: var(--rails-item-active-border-color);
     font-weight: var(--rails-item-active-font-weight, bold);
     z-index: 1;

     .rails-button-icon {
       transform: rotate(var(--rails-icon-rotation-active));
     }
   }
   ```

6. Style content container:
   ```scss
   .rails-button-content {
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: var(--rails-item-gap, 0.5rem);
     width: 100%;
     height: 100%;
   }
   ```

7. Style individual elements:
   ```scss
   .rails-button-numeral {
     display: block;
     font-size: var(--rails-numeral-font-size, 0.9em);
     font-weight: var(--rails-numeral-font-weight, bold);
     opacity: var(--rails-numeral-opacity, 0.7);
     transform: translate(
       var(--rails-numeral-offset-x, 0),
       var(--rails-numeral-offset-y, 0)
     );
     transition: transform var(--rails-transition-duration, 0.3s) ease;
   }

   .rails-button-text {
     display: block;
     font-size: var(--rails-text-font-size, 1em);
     transform: translate(
       var(--rails-text-offset-x, 0),
       var(--rails-text-offset-y, 0)
     );
     transition: transform var(--rails-transition-duration, 0.3s) ease;
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
     max-width: 100%;
   }

   .rails-button-icon {
     display: inline-block;
     font-size: var(--rails-icon-size);
     color: var(--rails-icon-color);
     transform: translate(
       var(--rails-icon-offset-x, 0),
       var(--rails-icon-offset-y, 0)
     ) rotate(var(--rails-icon-rotation));
     transition: transform var(--rails-transition-duration, 0.3s) ease;
     line-height: 1;
   }
   ```

8. Style associated panel:
   ```scss
   .rails-content {
     display: none;
     // Additional styles as in parent
   }
   ```

9. Add focus/accessibility states:
   ```scss
   .rails-button {
     &:focus-visible {
       outline: 2px solid var(--rails-focus-color, #0073aa);
       outline-offset: 2px;
       z-index: 2;
     }

     &:active {
       transform: scale(0.98);
     }
   }
   ```

10. Test item styles:
    - Horizontal arrangement works
    - Vertical writing-mode works
    - Tilt directions work
    - Offsets apply correctly
    - Active state styles work
    - Hover states work
    - Icon rotation works
    - Transitions smooth
    - Accessibility styles work

SUCCESS CRITERIA:
✅ Button base styles complete
✅ Vertical writing-mode works correctly
✅ Tilt directions (-90/+90) work
✅ Active state styles apply
✅ Offset transforms work for all elements
✅ Icon rotation works
✅ Hover and focus states work
✅ Transitions are smooth
✅ Accessibility states styled
```

**Deliverables:**  
- `blocks/rails-item/src/style.scss` (complete)  

**Estimated Time:** 6 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after base styles or element styles  
- Resume with: "Continue implementing offset transforms and state styles"  

## Agent 6.3: Responsive & Animations

**Agent ID Convention:** `rails-responsive-animations`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (sections 3.3, 4)  
- Partial style.scss files from Agents 6.1 and 6.2  

**Task Description:**  
```
You are implementing responsive breakpoints and CSS animations for Rails.

TASK CHECKLIST:
1. Add CSS animations to blocks/rails/src/style.scss:

2. Define compression animations:
   ```scss
   @keyframes compressButton {
     // Similar to previous
   }
   ```

3. Apply animations to items:
   ```scss
   .rails-button {
     // Similar to previous
   }
   ```

4. Define panel animations:
   ```scss
   @keyframes slideInRight {
     // Similar to previous
   }
   ```

5. Apply panel animations:
   ```scss
   .rails-content {
     // Similar to previous
   }
   ```

6. Add responsive breakpoints to blocks/rails/src/style.scss:
   ```scss
   @media (max-width: 768px) {
     .gutplus-rails[data-responsive-mode="stack"] {
       .rails-row {
         flex-direction: column !important;
       }

       .rails-button {
         writing-mode: horizontal-tb !important;
         transform: none !important;
         width: 100%;
       }

       .rails-content {
         width: 100%;
       }
     }
   }
   ```

7. Add print styles:
   ```scss
   @media print {
     .gutplus-rails {
       display: block;

       .rails-button {
         writing-mode: horizontal-tb;
         transform: none;
         display: block;
         page-break-inside: avoid;
       }

       .rails-content {
         position: static;
         display: block;
         page-break-inside: avoid;
       }
     }
   }
   ```

8. Test responsive and animations:
    - Compression animations smooth at 60fps
    - Panel animations work (slide/fade)
    - Mobile transformation to stack works
    - Breakpoints trigger correctly
    - All animations GPU-accelerated
    - Print styles work

SUCCESS CRITERIA:
✅ Compression animations defined and work
✅ Panel animations defined and work
✅ Animations run at 60fps
✅ Mobile breakpoint works (768px)
✅ Stack transformation styles complete
✅ Responsive modes styled correctly
✅ Print styles work
✅ No animation jank
```

**Deliverables:**  
- Extended `blocks/rails/src/style.scss` (with animations and responsive)  
- Extended `blocks/rails-item/src/style.scss` (with responsive adjustments)  

**Estimated Time:** 5 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after animations or responsive styles  
- Resume with: "Continue implementing responsive breakpoints and styles"  

# PHASE 7: PHP Integration (6 hours)

**Complexity:** Simple  
**Agents:** 1  

## Agent 7.1: PHP Backend

**Agent ID Convention:** `rails-php-backend`  

**Context Required:**  
- RAILS_IMPLEMENTATION_PLAN.md (section 5, Phase 7)  
- php/theme-storage.php  
- php/theme-css-generator.php  
- php/theme-rest-api.php  
- Generated php/css-defaults/rails.php  
- Generated php/css-defaults/rails-item.php  

**Task Description:**  
```
You are integrating Rails blocks with the PHP backend (theme system, CSS generation, REST API).

TASK CHECKLIST:
1. Update php/theme-storage.php:
   - Verify 'rails' and 'rails-item' in supported block types array
   - If not present, add to $supported_blocks array

2. Update php/theme-css-generator.php:
   - Verify CSS generation uses auto-generated mappings

3. Test CSS generation:
   - Create test theme via REST API
   - Generate CSS and verify output

4. Verify REST API compatibility:
   - Test endpoints for rails block

5. Test theme enqueue:
   - Verify Rails theme CSS enqueued on pages with Rails blocks

6. Test CRUD operations:
   - Create, update, delete themes for rails block

7. Test delta-based storage:
   - Verify only changed attributes stored

8. Add PHP documentation:
   - Docblocks and comments

SUCCESS CRITERIA:
✅ rails and rails-item in supported blocks
✅ CSS generation works
✅ REST API endpoints work
✅ Theme CRUD operations work
✅ Delta storage works
✅ No PHP errors
```

**Deliverables:**  
- Updated `php/theme-storage.php` (if needed)  
- Updated `php/theme-css-generator.php` (if needed)  
- Verified `php/theme-rest-api.php` compatibility  
- Test results documented  

**Estimated Time:** 6 hours  

**Resume Strategy:**  
If limit hit:  
- Agent likely paused after verifying one system  
- Resume with: "Continue testing REST API and theme CRUD operations"  



---

## 6. Technical Considerations

### 6.1 Writing-Mode Implementation

**Solution:**  
```scss
.rails-button {
  writing-mode: vertical-rl; // Vertical text for buttons in horizontal row

  &[data-tilt="-90"] {
    transform: rotate(0deg);
  }

  &[data-tilt="+90"] {
    transform: rotate(180deg);
  }
}
```

### 6.2 Offset System

**Solution:** Simple X/Y offsets applied via transform.  

### 6.3 Compression Animation Performance

**Solution:**  
Use CSS transitions on width for horizontal compression in row.  

### 6.4 Panel Positioning Algorithms

**NextToButton:** Position panel next to button in row.  
**Corner:** Fixed corner relative to row.  

### 6.5 InnerBlocks Storage Strategy

Interleaved in markup for direct association.  

---



---

## 9. Success Criteria

**Functional Requirements:**  
- ✅ Rails block appears in inserter  
- ✅ Buttons in horizontal row with vertical text  
- ✅ Interleaved markup works  
- ✅ Panels reveal next to button or corner  
- ✅ Compression, animations, responsive work  

**Non-Functional Requirements:**  
- ✅ Animations 60fps  
- ✅ Accessible  
- ✅ Browser compatible  


**Next Steps:**  
1. Review plan  
2. Begin Phase 1  
3. Proceed sequentially  

**Document Version:** 1.0  
**Last Updated:** 2025-12-23  
**Status:** Ready for Execution