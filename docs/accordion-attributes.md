# Accordion Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/accordion.json`
> Generated at: 2025-12-18T23:36:50.330Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Accordion blocks

- **Block Type:** `accordion`
- **Version:** 1.0.0

## Behavior

Non-themeable behavioral and structural settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `accordionId` | string | `` | No (structural) | Unique identifier for the accordion block |
| `uniqueId` | string | `` | No (structural) | Auto-generated unique block identifier |
| `blockId` | string | `` | No (structural) | Block-specific identification |
| `title` | string | `Accordion Title` | No (content) | The accordion title text |
| `content` | string | `` | No (content) | The accordion content (rich text) |
| `currentTheme` | string | `` | No (structural) | Currently active theme name (empty = Default) |
| `initiallyOpen` | boolean | `false` | No (N/A) | Whether accordion is open on page load |
| `accordionWidth` | string | `100%` | No (N/A) | Accordion container width (e.g., 100%, 500px) |
| `accordionHorizontalAlign` | string | `left` | No (N/A) | Horizontal alignment of the accordion |
| `headingLevel` | string | `none` | No (structural) | Semantic HTML heading level (none, h1-h6) |

## Header Colors

Title/header text and background colors including hover and active states

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | string | `#333333` | Yes | Text color for the accordion title |
| `titleBackgroundColor` | string | `#f5f5f5` | Yes | Background color for the accordion title |
| `hoverTitleColor` | string | `#000000` | Yes | Text color when hovering over title |
| `hoverTitleBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over title |

## Content Colors

Content area text and background colors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `contentColor` | string | `#333333` | Yes | Text color for accordion content |
| `contentBackgroundColor` | string | `#ffffff` | Yes | Background color for accordion content |

## Borders

Main accordion wrapper borders and radius

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `borderColor` | string | `#dddddd` | Yes | Color of the accordion wrapper border |
| `borderWidth` | number | `1` | Yes | Thickness of the accordion wrapper border in pixels |
| `borderStyle` | string | `solid` | Yes | Style of the accordion wrapper border |
| `borderRadius` | object | _object_ | Yes | Corner radius of the accordion wrapper |
| `shadow` | string | `none` | Yes | CSS box-shadow for the accordion wrapper |
| `shadowHover` | string | `none` | Yes | CSS box-shadow for the accordion wrapper on hover |

## Divider Line

Divider line between header and content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `dividerColor` | string | `#dddddd` | Yes | Color of divider between title and content |
| `dividerWidth` | number | `0` | Yes | Thickness of divider between title and content |
| `dividerStyle` | string | `solid` | Yes | Style of divider between title and content |

## Icon

Icon appearance and behavior

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `iconColor` | string | `#666666` | Yes | Color of the expand/collapse icon |
| `showIcon` | boolean | `true` | No (N/A) | Display expand/collapse icon |
| `iconPosition` | string | `right` | No (N/A) | Position of icon relative to title |
| `iconSize` | number | `20` | Yes | Size of the icon in pixels |
| `iconTypeClosed` | string | `▾` | No (N/A) | Icon when accordion is closed |
| `iconTypeOpen` | string | `none` | No (N/A) | Icon when accordion is open (none = use just iconTypeClosed with rotation) |
| `iconRotation` | number | `180` | Yes | Rotation angle when open (degrees) |

## Typography

Font settings for title and content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleFontSize` | number | `18` | Yes | Font size for the title in pixels |
| `titleFontWeight` | string | `600` | Yes | Font weight for the title |
| `titleFontStyle` | string | `normal` | Yes | Font style for the title |
| `titleTextTransform` | string | `none` | Yes | Text transformation for the title |
| `titleTextDecoration` | string | `none` | Yes | Text decoration for the title |
| `titleAlignment` | string | `left` | Yes | Text alignment for the title |
| `contentFontSize` | number | `16` | Yes | Font size for content in pixels |
| `contentFontWeight` | string | _null_ | Yes | Font weight for content |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `titleColor` | `--accordion-title-color` |
| `titleBackgroundColor` | `--accordion-title-bg` |
| `hoverTitleColor` | `--accordion-title-hover-color` |
| `hoverTitleBackgroundColor` | `--accordion-title-hover-bg` |
| `contentColor` | `--accordion-content-color` |
| `contentBackgroundColor` | `--accordion-content-bg` |
| `borderColor` | `--accordion-border-color` |
| `dividerColor` | `--accordion-divider-color` |
| `iconColor` | `--accordion-icon-color` |
| `titleFontSize` | `--accordion-title-font-size` |
| `titleFontWeight` | `--accordion-title-font-weight` |
| `titleFontStyle` | `--accordion-title-font-style` |
| `titleTextTransform` | `--accordion-title-text-transform` |
| `titleTextDecoration` | `--accordion-title-text-decoration` |
| `titleAlignment` | `--accordion-title-alignment` |
| `contentFontSize` | `--accordion-content-font-size` |
| `contentFontWeight` | `--accordion-content-font-weight` |
| `borderWidth` | `--accordion-border-width` |
| `borderStyle` | `--accordion-border-style` |
| `borderRadius` | `--accordion-border-radius` |
| `shadow` | `--accordion-border-shadow` |
| `shadowHover` | `--accordion-border-shadow-hover` |
| `dividerWidth` | `--accordion-divider-width` |
| `dividerStyle` | `--accordion-divider-style` |
| `iconSize` | `--accordion-icon-size` |
| `iconRotation` | `--accordion-icon-rotation` |

