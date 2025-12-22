# Table of Contents Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/toc.json`
> Generated at: 2025-12-22T19:13:33.429Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Table of Contents blocks

- **Block Type:** `toc`
- **Version:** 2.0.0

## Block Options

Behavior and core options

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tocId` | string | `` | No (structural) | Unique identifier for the table of contents |
| `showTitle` | boolean | `true` | No (structural) | Display the TOC title header |
| `titleText` | string | `Table of Contents` | No (content) | The title displayed above the table of contents |
| `currentTheme` | string | `` | No (structural) | Currently active theme name (empty = Default) |
| `tocItems` | array | _object_ | No (structural) | Persisted TOC entries with anchors and levels |
| `deletedHeadingIds` | array | _object_ | No (structural) | Anchors removed from scans until reset |
| `filterMode` | string | `include-all` | No (N/A) | How headings are filtered for inclusion |
| `includeLevels` | array | _object_ | No (structural) | Which heading levels to include (H1-H6) |
| `includeClasses` | string | `` | No (N/A) | CSS classes to include in TOC |
| `excludeLevels` | array | _object_ | No (structural) | Which heading levels to exclude |
| `excludeClasses` | string | `` | No (N/A) | CSS classes to exclude from TOC |
| `depthLimit` | number | _null_ | No (N/A) | Maximum nesting depth to display |
| `includeAccordions` | boolean | `true` | No (structural) | Include headings from accordion blocks when they have a heading level set |
| `includeTabs` | boolean | `true` | No (structural) | Include headings from tabs blocks when they have a heading level set |
| `numberingStyle` | string | `none` | No (N/A) | Style of numbering for TOC items |
| `isCollapsible` | boolean | `false` | No (N/A) | Allow the TOC to be collapsed/expanded |
| `initiallyCollapsed` | boolean | `false` | No (N/A) | Start with TOC collapsed |
| `positionType` | string | `default` | No (N/A) | CSS positioning type |
| `smoothScroll` | boolean | `true` | No (N/A) | Enable smooth scrolling to headings |
| `scrollOffset` | number | `0` | No (N/A) | Offset in pixels when scrolling to heading |
| `autoHighlight` | boolean | `true` | No (N/A) | Highlight current section in TOC |
| `clickBehavior` | string | `navigate` | No (N/A) | What happens when clicking a TOC item |
| `tocWidth` | string | `100%` | No (N/A) | TOC container width (e.g., 100%, 500px) |
| `tocHorizontalAlign` | string | `center` | No (N/A) | Horizontal alignment of the TOC block |

## Block Borders

Wrapper background, borders, and shadows

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `wrapperBackgroundColor` | string | `#ffffff` | Yes | Background color of the TOC wrapper |
| `blockBorderColor` | string | `#dddddd` | Yes | Border color of the TOC wrapper |
| `blockBorderWidth` | number | `1` | Yes | Width of the wrapper border in pixels |
| `blockBorderStyle` | string | `solid` | Yes | Style of the wrapper border |
| `blockBorderRadius` | object | _object_ | Yes | Corner radius of the wrapper |
| `blockShadow` | string | `none` | Yes | CSS box-shadow for the wrapper |
| `blockShadowHover` | string | `none` | Yes | CSS box-shadow for the wrapper on hover |

## Title Colors

Title colors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | string | `#333333` | Yes | Text color for the TOC title |
| `titleBackgroundColor` | string | `transparent` | Yes | Background color for the TOC title |

## Link Colors

Link and numbering colors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `linkColor` | string | `#0073aa` | Yes | Default color for TOC links |
| `linkHoverColor` | string | `#005177` | Yes | Color when hovering over links |
| `linkActiveColor` | string | `#005177` | Yes | Color for the currently active link |
| `linkVisitedColor` | string | `#0073aa` | Yes | Color for visited links |
| `numberingColor` | string | `#0073aa` | Yes | Color for list numbering |

## Heading Styles

Per-heading-level colors and typography (H1-H6)

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `h1Color` | string | `#0073aa` | Yes | Text color for H1 headings |
| `h1FontSize` | number | `1.5` | Yes | Font size for H1 headings in rem |
| `h1FontWeight` | string | `700` | Yes | Font weight for H1 headings |
| `h1FontStyle` | string | `normal` | Yes | Font style for H1 headings |
| `h1TextTransform` | string | `none` | Yes | Text transformation for H1 headings |
| `h1TextDecoration` | string | `none` | Yes | Text decoration for H1 headings |
| `h2Color` | string | `#0073aa` | Yes | Text color for H2 headings |
| `h2FontSize` | number | `1.25` | Yes | Font size for H2 headings in rem |
| `h2FontWeight` | string | `600` | Yes | Font weight for H2 headings |
| `h2FontStyle` | string | `normal` | Yes | Font style for H2 headings |
| `h2TextTransform` | string | `none` | Yes | Text transformation for H2 headings |
| `h2TextDecoration` | string | `none` | Yes | Text decoration for H2 headings |
| `h3Color` | string | `#0073aa` | Yes | Text color for H3 headings |
| `h3FontSize` | number | `1.125` | Yes | Font size for H3 headings in rem |
| `h3FontWeight` | string | `500` | Yes | Font weight for H3 headings |
| `h3FontStyle` | string | `normal` | Yes | Font style for H3 headings |
| `h3TextTransform` | string | `none` | Yes | Text transformation for H3 headings |
| `h3TextDecoration` | string | `none` | Yes | Text decoration for H3 headings |
| `h4Color` | string | `#0073aa` | Yes | Text color for H4 headings |
| `h4FontSize` | number | `1` | Yes | Font size for H4 headings in rem |
| `h4FontWeight` | string | `normal` | Yes | Font weight for H4 headings |
| `h4FontStyle` | string | `normal` | Yes | Font style for H4 headings |
| `h4TextTransform` | string | `none` | Yes | Text transformation for H4 headings |
| `h4TextDecoration` | string | `none` | Yes | Text decoration for H4 headings |
| `h5Color` | string | `#0073aa` | Yes | Text color for H5 headings |
| `h5FontSize` | number | `0.9375` | Yes | Font size for H5 headings in rem |
| `h5FontWeight` | string | `normal` | Yes | Font weight for H5 headings |
| `h5FontStyle` | string | `normal` | Yes | Font style for H5 headings |
| `h5TextTransform` | string | `none` | Yes | Text transformation for H5 headings |
| `h5TextDecoration` | string | `none` | Yes | Text decoration for H5 headings |
| `h6Color` | string | `#0073aa` | Yes | Text color for H6 headings |
| `h6FontSize` | number | `0.875` | Yes | Font size for H6 headings in rem |
| `h6FontWeight` | string | `normal` | Yes | Font weight for H6 headings |
| `h6FontStyle` | string | `normal` | Yes | Font style for H6 headings |
| `h6TextTransform` | string | `none` | Yes | Text transformation for H6 headings |
| `h6TextDecoration` | string | `none` | Yes | Text decoration for H6 headings |

## Collapse Icon

Collapse icon styles

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `collapseIconColor` | string | `#666666` | Yes | Color of the collapse/expand icon |
| `collapseIconSize` | number | `1.25` | Yes | Size of the collapse/expand icon (rem) |

## Title Typography

Title typography and padding

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleFontSize` | number | `1.25` | Yes | Font size for the TOC title in rem |
| `titleFontWeight` | string | `700` | Yes | Font weight for the TOC title |
| `titleTextTransform` | string | `none` | Yes | Text transformation for the title |
| `titleAlignment` | string | `left` | Yes | Text alignment for the title |
| `titlePadding` | object | _object_ | Yes | Padding around the title |

## Spacing & Layout

Padding, spacing, indent, positioning

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `wrapperPadding` | number | `1.25` | Yes | Padding inside the TOC wrapper (rem) |
| `listPaddingLeft` | number | `1.5` | Yes | Left padding for the list (rem) |
| `itemSpacing` | number | `0.5` | Yes | Vertical space between TOC items (rem) |
| `enableHierarchicalIndent` | boolean | `false` | No (N/A) | Indent headings based on document hierarchy (e.g., H3 under H2 indents once) |
| `levelIndent` | string | `1.25rem` | Yes | Amount to indent each nested level |
| `positionTop` | number | `6.25` | Yes | Top offset for sticky/fixed positioning (rem) |
| `zIndex` | number | `100` | Yes | Stack order for positioned TOC |
| `positionHorizontalSide` | string | `right` | No (Applied as inline style, not CSS variable) | Which side to anchor the TOC (sticky/fixed positioning) |
| `positionHorizontalOffset` | string | `1.25rem` | No (Applied as inline style, not CSS variable) | Distance from the selected side |

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
| `h1Color` | `--toc-h1-color` |
| `h1FontSize` | `--toc-h1-font-size` |
| `h1FontWeight` | `--toc-h1-font-weight` |
| `h1FontStyle` | `--toc-h1-font-style` |
| `h1TextTransform` | `--toc-h1-text-transform` |
| `h1TextDecoration` | `--toc-h1-text-decoration` |
| `h2Color` | `--toc-h2-color` |
| `h2FontSize` | `--toc-h2-font-size` |
| `h2FontWeight` | `--toc-h2-font-weight` |
| `h2FontStyle` | `--toc-h2-font-style` |
| `h2TextTransform` | `--toc-h2-text-transform` |
| `h2TextDecoration` | `--toc-h2-text-decoration` |
| `h3Color` | `--toc-h3-color` |
| `h3FontSize` | `--toc-h3-font-size` |
| `h3FontWeight` | `--toc-h3-font-weight` |
| `h3FontStyle` | `--toc-h3-font-style` |
| `h3TextTransform` | `--toc-h3-text-transform` |
| `h3TextDecoration` | `--toc-h3-text-decoration` |
| `h4Color` | `--toc-h4-color` |
| `h4FontSize` | `--toc-h4-font-size` |
| `h4FontWeight` | `--toc-h4-font-weight` |
| `h4FontStyle` | `--toc-h4-font-style` |
| `h4TextTransform` | `--toc-h4-text-transform` |
| `h4TextDecoration` | `--toc-h4-text-decoration` |
| `h5Color` | `--toc-h5-color` |
| `h5FontSize` | `--toc-h5-font-size` |
| `h5FontWeight` | `--toc-h5-font-weight` |
| `h5FontStyle` | `--toc-h5-font-style` |
| `h5TextTransform` | `--toc-h5-text-transform` |
| `h5TextDecoration` | `--toc-h5-text-decoration` |
| `h6Color` | `--toc-h6-color` |
| `h6FontSize` | `--toc-h6-font-size` |
| `h6FontWeight` | `--toc-h6-font-weight` |
| `h6FontStyle` | `--toc-h6-font-style` |
| `h6TextTransform` | `--toc-h6-text-transform` |
| `h6TextDecoration` | `--toc-h6-text-decoration` |
| `collapseIconColor` | `--toc-collapse-icon-color` |
| `titleFontSize` | `--toc-title-font-size` |
| `titleFontWeight` | `--toc-title-font-weight` |
| `titleTextTransform` | `--toc-title-text-transform` |
| `titleAlignment` | `--toc-title-alignment` |
| `titlePadding` | `--toc-title-padding` |
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

