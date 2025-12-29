# Accordion Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/accordion.json`
> Generated at: 2025-12-29T02:23:59.794Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Accordion blocks

- **Block Type:** `accordion`
- **Version:** 2.0.0

## Borders

Block borders, radius, shadows, and divider settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `dividerWidth` | object | _object_ | Yes | Border between header and content |
| `dividerColor` | object | _object_ | Yes | Color of divider between header and content |
| `dividerStyle` | object | _object_ | Yes | Style of divider between header and content |
| `borderWidth` | object | _object_ | Yes | Border width, color, and style for all sides |
| `borderRadius` | object | _object_ | Yes | Corner radius of the accordion wrapper |
| `shadow` | array | _object_ | Yes | Shadow effect for the accordion (supports multiple layers) |
| `borderColor` | object | _object_ | Yes | Border color for all sides |
| `borderStyle` | object | _object_ | Yes | Border style for all sides |

## Layout

Spacing and padding settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `headerPadding` | object | _object_ | Yes | Inner spacing of the header |
| `contentPadding` | object | _object_ | Yes | Inner spacing of the content panel |
| `blockMargin` | object | _object_ | Yes | Outer spacing around the accordion |

## Colors

Header and panel color settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | string | `#333333` | Yes | Text color for the accordion header |
| `titleBackgroundColor` | string | `#f5f5f5` | Yes | Background color for the accordion header |
| `hoverTitleColor` | string | `#000000` | Yes | Text color when hovering over header |
| `hoverTitleBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over header |
| `contentTextColor` | string | `#333333` | Yes | Text color for accordion content |
| `contentBackgroundColor` | string | `#ffffff` | Yes | Background color for accordion content |

## Typography

Font settings for header and content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `contentFontFamily` | string | `inherit` | Yes | Font family for the content |
| `contentFontSize` | string | `1rem` | Yes | Font size for the content |
| `contentLineHeight` | number | `1.6` | Yes | Line height for the content |
| `titleFontFamily` | string | `inherit` | Yes | Font family for the header |
| `titleFontSize` | string | `1.125rem` | Yes | Font size for the header |
| `titleFormatting` | array | _object_ | Yes | Text formatting options (bold, italic, underline, overline, line-through) |
| `titleFontWeight` | number | `400` | Yes | Font weight for title (100-900) |
| `titleDecorationColor` | string | `currentColor` | Yes | Color for text decorations |
| `titleDecorationStyle` | string | `solid` | Yes | Style for text decorations |
| `titleDecorationWidth` | string | `auto` | Yes | Thickness of text decorations |
| `titleLetterSpacing` | string | `0em` | Yes | Space between letters |
| `titleTextTransform` | string | `none` | Yes | Text transformation for the header |
| `titleLineHeight` | number | `1.4` | Yes | Line height for the header |
| `titleAlignment` | string | `left` | Yes | Text alignment for the header |
| `titleOffsetX` | string | `0px` | Yes | Move title left/right (negative = left, positive = right) |
| `titleOffsetY` | string | `0px` | Yes | Move title up/down (negative = up, positive = down) |
| `titleTextShadow` | array | _object_ | Yes | Shadow effect for the header text (supports multiple layers) |

## Icon

Icon appearance and behavior

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `showIcon` | boolean | `true` | Yes | Display expand/collapse icon |
| `iconPosition` | string | `right` | Yes | Position of icon relative to title |
| `iconColor` | string | `#666666` | Yes | Color of the expand/collapse icon |
| `iconSize` | string | `1.25rem` | Yes | Size of the icon |
| `iconTypeClosed` | string | `▾` | Yes | Icon when accordion is closed (character, unicode, or image URL) |
| `iconTypeOpen` | string | `none` | Yes | Icon when accordion is open (none = rotate closed icon) |
| `iconRotation` | string | `180deg` | Yes | Rotation angle when open (degrees) |

## Animation

Open/close animation settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `animationType` | string | `slide` | Yes | How the accordion opens and closes |
| `animationDuration` | string | `300ms` | Yes | Animation duration in milliseconds |
| `animationEasing` | string | `ease` | Yes | Animation easing function |

## Block Options

Structural and layout options for the accordion block

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `accordionWidth` | string | `100%` | No (N/A) | Accordion container width |
| `headingLevel` | string | `none` | No (N/A) | Semantic HTML heading level for accessibility |
| `accordionHorizontalAlign` | string | `center` | No (N/A) | Horizontal alignment of the accordion |
| `initiallyOpen` | boolean | `false` | No (N/A) | Whether accordion is open on page load |
| `accordionId` | string | `` | No (N/A) | Unique identifier for the accordion block |
| `blockId` | string | `` | No (N/A) | Block-specific identification |
| `content` | string | `` | No (N/A) | The accordion content (rich text) |
| `currentTheme` | string | `` | No (N/A) | Currently active theme name (empty = Default) |
| `customizations` | object | _object_ | No (N/A) | Block-specific customizations (Tier 3 CSS) |
| `title` | string | `Accordion Title` | No (N/A) | The accordion title text |
| `uniqueId` | string | `` | No (N/A) | Auto-generated unique block identifier |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `dividerWidth` | `--accordion-divider-width` |
| `dividerColor` | `--accordion-divider-color` |
| `dividerStyle` | `--accordion-divider-style` |
| `borderWidth` | `--accordion-border-width` |
| `borderRadius` | `--accordion-border-radius` |
| `shadow` | `--accordion-shadow` |
| `borderColor` | `--accordion-border-color` |
| `borderStyle` | `--accordion-border-style` |
| `headerPadding` | `--accordion-header-padding` |
| `contentPadding` | `--accordion-content-padding` |
| `blockMargin` | `--accordion-block-margin` |
| `titleColor` | `--accordion-title-color` |
| `titleBackgroundColor` | `--accordion-title-bg` |
| `hoverTitleColor` | `--accordion-title-hover-color` |
| `hoverTitleBackgroundColor` | `--accordion-title-hover-bg` |
| `contentTextColor` | `--accordion-content-color` |
| `contentBackgroundColor` | `--accordion-content-bg` |
| `contentFontFamily` | `--accordion-content-font-family` |
| `contentFontSize` | `--accordion-content-font-size` |
| `contentLineHeight` | `--accordion-content-line-height` |
| `titleFontFamily` | `--accordion-title-font-family` |
| `titleFontSize` | `--accordion-title-font-size` |
| `titleFontWeight` | `--accordion-title-font-weight` |
| `titleDecorationColor` | `--accordion-title-decoration-color` |
| `titleDecorationStyle` | `--accordion-title-decoration-style` |
| `titleDecorationWidth` | `--accordion-title-decoration-width` |
| `titleLetterSpacing` | `--accordion-title-letter-spacing` |
| `titleTextTransform` | `--accordion-title-text-transform` |
| `titleLineHeight` | `--accordion-title-line-height` |
| `titleAlignment` | `--accordion-title-alignment` |
| `titleOffsetX` | `--accordion-title-offset-x` |
| `titleOffsetY` | `--accordion-title-offset-y` |
| `titleTextShadow` | `--accordion-title-text-shadow` |
| `iconColor` | `--accordion-icon-color` |
| `iconSize` | `--accordion-icon-size` |
| `iconRotation` | `--accordion-icon-rotation` |
| `animationDuration` | `--accordion-animation-duration` |
| `animationEasing` | `--accordion-animation-easing` |

