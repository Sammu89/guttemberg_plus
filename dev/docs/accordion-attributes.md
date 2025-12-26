# Accordion Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/accordion.json`
> Generated at: 2025-12-26T22:38:19.357Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Accordion blocks

- **Block Type:** `accordion`
- **Version:** 2.0.0

## Block Options

Structural and layout options for the accordion block

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `accordionId` | string | `` | No (N/A) | Unique identifier for the accordion block |
| `uniqueId` | string | `` | No (N/A) | Auto-generated unique block identifier |
| `blockId` | string | `` | No (N/A) | Block-specific identification |
| `title` | string | `Accordion Title` | No (N/A) | The accordion title text |
| `content` | string | `` | No (N/A) | The accordion content (rich text) |
| `currentTheme` | string | `` | No (N/A) | Currently active theme name (empty = Default) |
| `customizations` | object | _object_ | No (N/A) | Block-specific customizations (Tier 3 CSS) |
| `accordionWidth` | string | `100%` | No (N/A) | Accordion container width (e.g., 100%, 500px) |
| `headingLevel` | string | `none` | No (N/A) | Semantic HTML heading level for accessibility |
| `accordionHorizontalAlign` | string | `center` | No (N/A) | Horizontal alignment of the accordion |
| `initiallyOpen` | boolean | `false` | No (N/A) | Whether accordion is open on page load |

## Borders

Block borders, radius, shadows, and divider settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `borderWidth` | object | _object_ | Yes | Border width, color, and style for all sides |
| `borderColor` | object | _object_ | Yes | Border color for all sides |
| `borderStyle` | object | _object_ | Yes | Border style for all sides |
| `borderRadius` | object | _object_ | Yes | Corner radius of the accordion wrapper |
| `headerPadding` | object | _object_ | Yes | Inner spacing of the header |
| `contentPadding` | object | _object_ | Yes | Inner spacing of the content panel |
| `blockMargin` | object | _object_ | Yes | Outer spacing around the accordion |
| `shadow` | string | `none` | Yes | Shadow effect for the accordion |
| `dividerColor` | string | `#dddddd` | Yes | Color of divider between header and content |
| `dividerStyle` | string | `solid` | Yes | Style of divider between header and content |
| `dividerWidth` | number | `0` | Yes | Thickness of divider between header and content |

## Colors

Header and panel color settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | string | `#333333` | Yes | Text color for the accordion header |
| `titleBackgroundColor` | string | `#f5f5f5` | Yes | Background color for the accordion header |
| `hoverTitleColor` | string | `#000000` | Yes | Text color when hovering over header |
| `hoverTitleBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over header |
| `activeTitleColor` | string | `#000000` | Yes | Text color when accordion is open |
| `activeTitleBackgroundColor` | string | `#e8e8e8` | Yes | Background color when accordion is open |
| `contentTextColor` | string | `#333333` | Yes | Text color for accordion content |
| `contentBackgroundColor` | string | `#ffffff` | Yes | Background color for accordion content |

## Typography

Font settings for header and content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleFontFamily` | string | `inherit` | Yes | Font family for the header |
| `titleFontSize` | number | `1.125` | Yes | Font size for the header |
| `titleAppearance` | object | _object_ | Yes | Font weight and style for the header |
| `titleLetterSpacing` | number | `0` | Yes | Space between letters |
| `titleTextDecoration` | string | `none` | Yes | Text decoration for the header |
| `titleTextTransform` | string | `none` | Yes | Text transformation for the header |
| `titleLineHeight` | number | `1.4` | Yes | Line height for the header |
| `titleAlignment` | string | `left` | Yes | Text alignment for the header |
| `contentFontFamily` | string | `inherit` | Yes | Font family for the content |
| `contentFontSize` | number | `1` | Yes | Font size for the content |
| `contentLineHeight` | number | `1.6` | Yes | Line height for the content |

## Icon

Icon appearance and behavior

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `showIcon` | boolean | `true` | Yes | Display expand/collapse icon |
| `iconPosition` | string | `right` | Yes | Position of icon relative to title |
| `iconColor` | string | `#666666` | Yes | Color of the expand/collapse icon |
| `iconSize` | number | `1.25` | Yes | Size of the icon |
| `iconTypeClosed` | string | `▾` | Yes | Icon when accordion is closed (character, unicode, or image URL) |
| `iconTypeOpen` | string | `none` | Yes | Icon when accordion is open (none = rotate closed icon) |
| `iconRotation` | number | `180` | Yes | Rotation angle when open (degrees) |

## Animation

Open/close animation settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `animationType` | string | `slide` | Yes | How the accordion opens and closes |
| `animationDuration` | number | `300` | Yes | Animation duration in milliseconds |
| `animationEasing` | string | `ease` | Yes | Animation easing function |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `borderWidth` | `--accordion-border-width` |
| `borderColor` | `--accordion-border-color` |
| `borderStyle` | `--accordion-border-style` |
| `borderRadius` | `--accordion-border-radius` |
| `headerPadding` | `--accordion-header-padding` |
| `contentPadding` | `--accordion-content-padding` |
| `blockMargin` | `--accordion-block-margin` |
| `shadow` | `--accordion-shadow` |
| `dividerColor` | `--accordion-divider-color` |
| `dividerStyle` | `--accordion-divider-style` |
| `dividerWidth` | `--accordion-divider-width` |
| `titleColor` | `--accordion-title-color` |
| `titleBackgroundColor` | `--accordion-title-bg` |
| `hoverTitleColor` | `--accordion-title-hover-color` |
| `hoverTitleBackgroundColor` | `--accordion-title-hover-bg` |
| `activeTitleColor` | `--accordion-title-active-color` |
| `activeTitleBackgroundColor` | `--accordion-title-active-bg` |
| `contentTextColor` | `--accordion-content-color` |
| `contentBackgroundColor` | `--accordion-content-bg` |
| `titleFontFamily` | `--accordion-title-font-family` |
| `titleFontSize` | `--accordion-title-font-size` |
| `titleLetterSpacing` | `--accordion-title-letter-spacing` |
| `titleTextDecoration` | `--accordion-title-text-decoration` |
| `titleTextTransform` | `--accordion-title-text-transform` |
| `titleLineHeight` | `--accordion-title-line-height` |
| `titleAlignment` | `--accordion-title-alignment` |
| `contentFontFamily` | `--accordion-content-font-family` |
| `contentFontSize` | `--accordion-content-font-size` |
| `contentLineHeight` | `--accordion-content-line-height` |
| `iconColor` | `--accordion-icon-color` |
| `iconSize` | `--accordion-icon-size` |
| `iconRotation` | `--accordion-icon-rotation` |
| `animationDuration` | `--accordion-animation-duration` |
| `animationEasing` | `--accordion-animation-easing` |

