# Table of Contents Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/toc.json`
> Generated at: 2026-01-18T11:42:00.982Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Table of Contents blocks

- **Block Type:** `toc`
- **Version:** 2.0.0

## BlockOptions

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tocId` | string | `` | No (N/A) | Unique identifier for the table of contents |
| `showTitle` | boolean | `true` | No (N/A) | Display the TOC title header |
| `titleText` | string | `Table of Contents` | No (N/A) | The title displayed above the table of contents |
| `currentTheme` | string | `` | No (N/A) | Currently active theme name (empty = Default) |
| `tocItems` | array | _object_ | No (N/A) | Persisted TOC entries with anchors and levels |
| `deletedHeadingIds` | array | _object_ | No (N/A) | Anchors removed from scans until reset |
| `isCollapsible` | boolean | `true` | No (N/A) | Allow the TOC to be collapsed/expanded |
| `initiallyCollapsed` | boolean | `false` | No (N/A) | Start with TOC collapsed |
| `clickBehavior` | string | `navigate` | Yes | What happens when clicking a TOC item |
| `tocWidth` | string | `100%` | No (N/A) | TOC container width |
| `tocHorizontalAlign` | string | `center` | No (N/A) | Horizontal alignment of the TOC block |

## Filtering

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `filterMode` | string | `Include all headings` | No (N/A) | Filter headings by CSS class |
| `includeH1` | boolean | `false` | Yes | Include H1 headings in TOC |
| `includeH2` | boolean | `true` | Yes |  |
| `includeH3` | boolean | `true` | Yes |  |
| `includeH4` | boolean | `true` | Yes |  |
| `includeH5` | boolean | `true` | Yes |  |
| `includeH6` | boolean | `true` | Yes |  |
| `includeLevels` | array | _object_ | Yes | Which heading levels to include (H1-H6) - derived from includeH1-H6 toggles |
| `includeClasses` | string | `` | Yes | CSS classes to include in TOC |
| `excludeLevels` | array | _object_ | Yes | Which heading levels to exclude |
| `excludeClasses` | string | `` | Yes | CSS classes to exclude from TOC |
| `includeAccordions` | boolean | `true` | Yes | Include headings from accordion blocks when they have a heading level set |
| `includeTabs` | boolean | `true` | Yes | Include headings from tabs blocks when they have a heading level set |

## PositionScroll

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `positionType` | string | `normal` | Yes | CSS positioning type |
| `smoothScroll` | boolean | `true` | Yes | Enable smooth scrolling to headings |
| `scrollOffset` | number | `0` | Yes | Offset in pixels when scrolling to heading |
| `autoHighlight` | boolean | `true` | Yes | Highlight current section in TOC |
| `positionTop` | string | `6.25rem` | Yes | Top offset for sticky/fixed positioning (rem) |
| `zIndex` | number | `100` | Yes | Stack order for positioned TOC |
| `positionHorizontalSide` | string | `right` | Yes | Which side to anchor the TOC (sticky/fixed positioning) |
| `positionHorizontalOffset` | string | `1.25rem` | Yes | Distance from the selected side |

## ExternalBorders

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `wrapperBackgroundColor` | string | `#ffffff` | Yes | Background color of the TOC wrapper |
| `blockBorderColor` | object | _object_ | Yes | Border color of the TOC wrapper |
| `blockBorderWidth` | string | `1` | Yes | Width of the wrapper border in pixels |
| `blockBorderStyle` | object | _object_ | Yes | Style of the wrapper border |
| `blockBorderRadius` | object | _object_ | Yes | Corner radius of the wrapper |
| `blockShadow` | string | `none` | Yes | CSS box-shadow for the wrapper |
| `blockShadowHover` | string | `none` | Yes | CSS box-shadow for the wrapper on hover |

## HeaderColors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | color-panel | _object_ | No (N/A) |  |

## LinkColors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `unifiedLinkColors` | boolean | `true` | Yes | Use the same link colors for all heading levels |
| `linkColor` | color-panel | _object_ | No (N/A) |  |

## HeadingStyles

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `h1NumberingStyle` | string | `decimal` | Yes | Numbering style for H1 headings |
| `h2NumberingStyle` | string | `decimal` | Yes | Numbering style for H2 headings |
| `h3NumberingStyle` | string | `decimal` | Yes | Numbering style for H3 headings |
| `h4NumberingStyle` | string | `decimal` | Yes | Numbering style for H4 headings |
| `h5NumberingStyle` | string | `decimal` | Yes | Numbering style for H5 headings |
| `h6NumberingStyle` | string | `decimal` | Yes | Numbering style for H6 headings |
| `h1Color` | color-panel | _object_ | No (N/A) |  |
| `h1FontSize` | string | `1.5rem` | Yes | Font size for H1 headings in rem |
| `h1FontWeight` | string | `700` | Yes | Font weight for H1 headings |
| `h1FontStyle` | string | `normal` | Yes | Font style for H1 headings |
| `h1TextTransform` | string | `none` | Yes | Text transformation for H1 headings |
| `h1TextDecoration` | string | `none` | Yes | Text decoration for H1 headings |
| `h2Color` | color-panel | _object_ | No (N/A) |  |
| `h2FontSize` | string | `1.25rem` | Yes | Font size for H2 headings in rem |
| `h2FontWeight` | string | `600` | Yes | Font weight for H2 headings |
| `h2FontStyle` | string | `normal` | Yes | Font style for H2 headings |
| `h2TextTransform` | string | `none` | Yes | Text transformation for H2 headings |
| `h2TextDecoration` | string | `none` | Yes | Text decoration for H2 headings |
| `h3Color` | color-panel | _object_ | No (N/A) |  |
| `h3FontSize` | string | `1.125rem` | Yes | Font size for H3 headings in rem |
| `h3FontWeight` | string | `500` | Yes | Font weight for H3 headings |
| `h3FontStyle` | string | `normal` | Yes | Font style for H3 headings |
| `h3TextTransform` | string | `none` | Yes | Text transformation for H3 headings |
| `h3TextDecoration` | string | `none` | Yes | Text decoration for H3 headings |
| `h4Color` | color-panel | _object_ | No (N/A) |  |
| `h4FontSize` | string | `1rem` | Yes | Font size for H4 headings in rem |
| `h4FontWeight` | string | `normal` | Yes | Font weight for H4 headings |
| `h4FontStyle` | string | `normal` | Yes | Font style for H4 headings |
| `h4TextTransform` | string | `none` | Yes | Text transformation for H4 headings |
| `h4TextDecoration` | string | `none` | Yes | Text decoration for H4 headings |
| `h5Color` | color-panel | _object_ | No (N/A) |  |
| `h5FontSize` | string | `0.9375rem` | Yes | Font size for H5 headings in rem |
| `h5FontWeight` | string | `normal` | Yes | Font weight for H5 headings |
| `h5FontStyle` | string | `normal` | Yes | Font style for H5 headings |
| `h5TextTransform` | string | `none` | Yes | Text transformation for H5 headings |
| `h5TextDecoration` | string | `none` | Yes | Text decoration for H5 headings |
| `h6Color` | color-panel | _object_ | No (N/A) |  |
| `h6FontSize` | string | `0.875rem` | Yes | Font size for H6 headings in rem |
| `h6FontWeight` | string | `normal` | Yes | Font weight for H6 headings |
| `h6FontStyle` | string | `normal` | Yes | Font style for H6 headings |
| `h6TextTransform` | string | `none` | Yes | Text transformation for H6 headings |
| `h6TextDecoration` | string | `none` | Yes | Text decoration for H6 headings |
| `enableHierarchicalIndent` | boolean | `true` | Yes | Indent headings based on document hierarchy (e.g., H3 under H2 indents once) |
| `levelIndent` | string | `1.25rem` | Yes | Amount to indent each nested level |

## Icon

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `showIcon` | boolean | `true` | Yes | Display icon in the block |
| `useDifferentIcons` | boolean | `false` | Yes | Use different icons for active and inactive states |
| `iconPosition` | string | `right` | Yes | Position of the icon relative to title |
| `iconRotation` | string | `180deg` | Yes | Rotation angle applied during open/close transition |
| `iconInactiveSource` | object | _object_ | Yes | Icon when closed |
| `iconInactiveColor` | string | `#333333` | Yes | Icon color (for character/library icons) |
| `iconInactiveRotation` | string | `0deg` | Yes | Initial rotation of inactive icon |
| `iconInactiveSize` | string | `16px` | Yes | Icon size (for character/library icons) |
| `iconInactiveMaxSize` | string | `24px` | Yes | Maximum icon size (for image icons) |
| `iconInactiveOffsetX` | string | `0px` | Yes | Horizontal offset of icon |
| `iconInactiveOffsetY` | string | `0px` | Yes | Vertical offset of icon |
| `iconActiveSource` | object | _object_ | Yes | Icon when open |
| `iconActiveColor` | string | `#333333` | Yes | Icon color (for character/library icons) |
| `iconActiveRotation` | string | `0deg` | Yes | Initial rotation of active icon |
| `iconActiveSize` | string | `16px` | Yes | Icon size (for character/library icons) |
| `iconActiveMaxSize` | string | `24px` | Yes | Maximum icon size (for image icons) |
| `iconActiveOffsetX` | string | `0px` | Yes | Horizontal offset of icon |
| `iconActiveOffsetY` | string | `0px` | Yes | Vertical offset of icon |

## HeaderTypography

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleFontSize` | string | `1.25rem` | Yes | Font size for the TOC header in rem |
| `titleFontWeight` | string | `700` | Yes | Font weight for the TOC header |
| `titleFontStyle` | string | `normal` | Yes |  |
| `titleTextTransform` | string | `none` | Yes | Text transformation for the header |
| `titleTextDecoration` | string | `none` | Yes |  |
| `titleAlignment` | string | `left` | Yes | Text alignment for the header |

## SpacingLayout

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `wrapperPadding` | string | `1.25rem` | Yes | Padding inside the TOC wrapper (rem) |
| `itemSpacing` | string | `0.5rem` | Yes | Vertical space between TOC items (rem) |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `wrapperBackgroundColor` | `--toc-wrapper-background-color` |
| `blockBorderColor` | `--toc-border-color` |
| `h1FontSize` | `--toc-h1-font-size` |
| `h1FontWeight` | `--toc-h1-font-weight` |
| `h1FontStyle` | `--toc-h1-font-style` |
| `h1TextTransform` | `--toc-h1-text-transform` |
| `h1TextDecoration` | `--toc-h1-text-decoration` |
| `h2FontSize` | `--toc-h2-font-size` |
| `h2FontWeight` | `--toc-h2-font-weight` |
| `h2FontStyle` | `--toc-h2-font-style` |
| `h2TextTransform` | `--toc-h2-text-transform` |
| `h2TextDecoration` | `--toc-h2-text-decoration` |
| `h3FontSize` | `--toc-h3-font-size` |
| `h3FontWeight` | `--toc-h3-font-weight` |
| `h3FontStyle` | `--toc-h3-font-style` |
| `h3TextTransform` | `--toc-h3-text-transform` |
| `h3TextDecoration` | `--toc-h3-text-decoration` |
| `h4FontSize` | `--toc-h4-font-size` |
| `h4FontWeight` | `--toc-h4-font-weight` |
| `h4FontStyle` | `--toc-h4-font-style` |
| `h4TextTransform` | `--toc-h4-text-transform` |
| `h4TextDecoration` | `--toc-h4-text-decoration` |
| `h5FontSize` | `--toc-h5-font-size` |
| `h5FontWeight` | `--toc-h5-font-weight` |
| `h5FontStyle` | `--toc-h5-font-style` |
| `h5TextTransform` | `--toc-h5-text-transform` |
| `h5TextDecoration` | `--toc-h5-text-decoration` |
| `h6FontSize` | `--toc-h6-font-size` |
| `h6FontWeight` | `--toc-h6-font-weight` |
| `h6FontStyle` | `--toc-h6-font-style` |
| `h6TextTransform` | `--toc-h6-text-transform` |
| `h6TextDecoration` | `--toc-h6-text-decoration` |
| `showIcon` | `--toc-icon-display` |
| `iconRotation` | `--toc-icon-animation-rotation` |
| `iconInactiveColor` | `--toc-icon-color` |
| `iconInactiveRotation` | `--toc-icon-initial-rotation` |
| `iconInactiveSize` | `--toc-icon-size` |
| `iconInactiveMaxSize` | `--toc-icon-max-size` |
| `iconInactiveOffsetX` | `--toc-icon-offset-x` |
| `iconInactiveOffsetY` | `--toc-icon-offset-y` |
| `iconActiveColor` | `--toc-icon-is-open-color` |
| `iconActiveRotation` | `--toc-icon-is-open-initial-rotation` |
| `iconActiveSize` | `--toc-icon-is-open-size` |
| `iconActiveMaxSize` | `--toc-icon-is-open-max-size` |
| `iconActiveOffsetX` | `--toc-icon-is-open-offset-x` |
| `iconActiveOffsetY` | `--toc-icon-is-open-offset-y` |
| `titleFontSize` | `--toc-title-font-size` |
| `titleFontWeight` | `--toc-title-font-weight` |
| `titleFontStyle` | `--toc-title-font-style` |
| `titleTextTransform` | `--toc-title-text-transform` |
| `titleTextDecoration` | `--toc-title-text-decoration` |
| `titleAlignment` | `--toc-title-alignment` |
| `blockBorderWidth` | `--toc-border-width` |
| `blockBorderStyle` | `--toc-border-style` |
| `blockBorderRadius` | `--toc-border-radius` |
| `blockShadow` | `--toc-border-shadow` |
| `blockShadowHover` | `--toc-border-shadow-hover` |
| `wrapperPadding` | `--toc-wrapper-padding` |
| `itemSpacing` | `--toc-item-spacing` |
| `levelIndent` | `--toc-level-indent` |
| `positionTop` | `--toc-position-top` |
| `zIndex` | `--toc-z-index` |

