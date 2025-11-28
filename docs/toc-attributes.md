# Table of Contents Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/toc.json`
> Generated at: 2025-11-28T01:29:49.195Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Table of Contents blocks

- **Block Type:** `toc`
- **Version:** 1.0.0

## Behavior

Non-themeable behavioral and structural settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tocId` | string | `` | No (structural) | Unique identifier for the table of contents |
| `showTitle` | boolean | `true` | No (structural) | Display the TOC title header |
| `titleText` | string | `Table of Contents` | No (content) | The title displayed above the table of contents |
| `currentTheme` | string | `` | No (structural) | Currently active theme name (empty = Default) |
| `filterMode` | string | `include-all` | No (behavioral) | How headings are filtered for inclusion |
| `includeLevels` | array | _object_ | No (behavioral) | Which heading levels to include (H2-H6) |
| `includeClasses` | string | `` | No (behavioral) | CSS classes to include in TOC |
| `excludeLevels` | array | _object_ | No (behavioral) | Which heading levels to exclude |
| `excludeClasses` | string | `` | No (behavioral) | CSS classes to exclude from TOC |
| `depthLimit` | number | _null_ | No (behavioral) | Maximum nesting depth to display |
| `numberingStyle` | string | `none` | No (behavioral) | Style of numbering for TOC items |
| `isCollapsible` | boolean | `false` | No (behavioral) | Allow the TOC to be collapsed/expanded |
| `initiallyCollapsed` | boolean | `false` | No (behavioral) | Start with TOC collapsed |
| `positionType` | string | `block` | No (behavioral) | CSS positioning type |
| `smoothScroll` | boolean | `true` | No (behavioral) | Enable smooth scrolling to headings |
| `scrollOffset` | number | `0` | No (behavioral) | Offset in pixels when scrolling to heading |
| `autoHighlight` | boolean | `true` | No (behavioral) | Highlight current section in TOC |
| `clickBehavior` | string | `navigate` | No (behavioral) | What happens when clicking a TOC item |

## Content Colors

Link colors, level colors, and numbering colors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `wrapperBackgroundColor` | string | `#ffffff` | Yes | Background color of the TOC wrapper |
| `linkColor` | string | `#0073aa` | Yes | Default color for TOC links |
| `linkHoverColor` | string | `#005177` | Yes | Color when hovering over links |
| `linkActiveColor` | string | `#005177` | Yes | Color for the currently active link |
| `linkVisitedColor` | string | `#0073aa` | Yes | Color for visited links |
| `numberingColor` | string | `#0073aa` | Yes | Color for list numbering |
| `level1Color` | string | `#0073aa` | Yes | Text color for level 1 headings (H2) |
| `level2Color` | string | `#0073aa` | Yes | Text color for level 2 headings (H3) |
| `level3PlusColor` | string | `#0073aa` | Yes | Text color for level 3+ headings (H4-H6) |
| `collapseIconColor` | string | `#666666` | Yes | Color of the collapse/expand icon |

## Block Borders

Wrapper borders, radius, and shadows

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `blockBorderColor` | string | `#dddddd` | Yes | Border color of the TOC wrapper |
| `blockBorderWidth` | number | `1` | Yes | Width of the wrapper border in pixels |
| `blockBorderStyle` | string | `solid` | Yes | Style of the wrapper border |
| `blockBorderRadius` | object | _object_ | Yes | Corner radius of the wrapper |
| `blockShadow` | string | `none` | Yes | CSS box-shadow for the wrapper |
| `blockShadowHover` | string | `none` | Yes | CSS box-shadow for the wrapper on hover |

## Header Colors

Title text and background colors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | string | `#333333` | Yes | Text color for the TOC title |
| `titleBackgroundColor` | string | `transparent` | Yes | Background color for the TOC title |

## Typography

Font settings for title and heading levels

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleFontSize` | number | `20` | Yes | Font size for the TOC title in pixels |
| `titleFontWeight` | string | `700` | Yes | Font weight for the TOC title |
| `titleTextTransform` | string | _null_ | Yes | Text transformation for the title |
| `titleAlignment` | string | `left` | Yes | Text alignment for the title |
| `level1FontSize` | number | `18` | Yes | Font size for level 1 items (H2) in pixels |
| `level1FontWeight` | string | `600` | Yes | Font weight for level 1 items |
| `level1FontStyle` | string | `normal` | Yes | Font style for level 1 items |
| `level1TextTransform` | string | `none` | Yes | Text transformation for level 1 items |
| `level1TextDecoration` | string | `none` | Yes | Text decoration for level 1 items |
| `level2FontSize` | number | `16` | Yes | Font size for level 2 items (H3) in pixels |
| `level2FontWeight` | string | `normal` | Yes | Font weight for level 2 items |
| `level2FontStyle` | string | `normal` | Yes | Font style for level 2 items |
| `level2TextTransform` | string | `none` | Yes | Text transformation for level 2 items |
| `level2TextDecoration` | string | `none` | Yes | Text decoration for level 2 items |
| `level3PlusFontSize` | number | `14` | Yes | Font size for level 3+ items (H4-H6) in pixels |
| `level3PlusFontWeight` | string | `normal` | Yes | Font weight for level 3+ items |
| `level3PlusFontStyle` | string | `normal` | Yes | Font style for level 3+ items |
| `level3PlusTextTransform` | string | `none` | Yes | Text transformation for level 3+ items |
| `level3PlusTextDecoration` | string | `none` | Yes | Text decoration for level 3+ items |

## Layout

Spacing, padding, and positioning

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `wrapperPadding` | number | `20` | Yes | Padding inside the TOC wrapper |
| `listPaddingLeft` | number | _null_ | Yes | Left padding for the list |
| `itemSpacing` | number | `8` | Yes | Vertical space between TOC items |
| `levelIndent` | number | `20` | Yes | Indentation per heading level |
| `positionTop` | number | `100` | Yes | Top offset for sticky/fixed positioning |
| `zIndex` | number | `100` | Yes | Stack order for positioned TOC |
| `collapseIconSize` | number | `20` | Yes | Size of the collapse/expand icon |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `wrapperBackgroundColor` | `--toc-wrapper-background-color` |
| `blockBorderColor` | `--toc-border-color` |
| `titleColor` | `--toc-title-color` |
| `titleBackgroundColor` | `--toc-title-background-color` |
| `linkColor` | `--toc-link-color` |
| `linkHoverColor` | `--toc-link-hover-color` |
| `linkActiveColor` | `--toc-link-active-color` |
| `linkVisitedColor` | `--toc-link-visited-color` |
| `numberingColor` | `--toc-numbering-color` |
| `level1Color` | `--toc-level1-color` |
| `level2Color` | `--toc-level2-color` |
| `level3PlusColor` | `--toc-level3-plus-color` |
| `collapseIconColor` | `--toc-collapse-icon-color` |
| `titleFontSize` | `--toc-title-font-size` |
| `titleFontWeight` | `--toc-title-font-weight` |
| `titleTextTransform` | `--toc-title-text-transform` |
| `titleAlignment` | `--toc-title-alignment` |
| `level1FontSize` | `--toc-level1-font-size` |
| `level1FontWeight` | `--toc-level1-font-weight` |
| `level1FontStyle` | `--toc-level1-font-style` |
| `level1TextTransform` | `--toc-level1-text-transform` |
| `level1TextDecoration` | `--toc-level1-text-decoration` |
| `level2FontSize` | `--toc-level2-font-size` |
| `level2FontWeight` | `--toc-level2-font-weight` |
| `level2FontStyle` | `--toc-level2-font-style` |
| `level2TextTransform` | `--toc-level2-text-transform` |
| `level2TextDecoration` | `--toc-level2-text-decoration` |
| `level3PlusFontSize` | `--toc-level3-plus-font-size` |
| `level3PlusFontWeight` | `--toc-level3-plus-font-weight` |
| `level3PlusFontStyle` | `--toc-level3-plus-font-style` |
| `level3PlusTextTransform` | `--toc-level3-plus-text-transform` |
| `level3PlusTextDecoration` | `--toc-level3-plus-text-decoration` |
| `blockBorderWidth` | `--toc-border-width` |
| `blockBorderStyle` | `--toc-border-style` |
| `blockBorderRadius` | `--toc-border-radius` |
| `blockShadow` | `--toc-border-shadow` |
| `blockShadowHover` | `--toc-border-shadow-hover` |
| `wrapperPadding` | `--toc-wrapper-padding` |
| `listPaddingLeft` | `--toc-list-padding-left` |
| `itemSpacing` | `--toc-item-spacing` |
| `levelIndent` | `--toc-level-indent` |
| `positionTop` | `--toc-position-top` |
| `zIndex` | `--toc-z-index` |
| `collapseIconSize` | `--toc-collapse-icon-size` |

