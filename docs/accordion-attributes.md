# Accordion Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/accordion.json`
> Generated at: 2025-11-22T17:12:27.839Z
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
| `customizations` | object | _object_ | No (structural) | Stores deltas from expected values (theme + defaults) for inline CSS output |
| `customizationCache` | object | _object_ | No (structural) | Complete snapshot for safety/restoration (deprecated - for backward compatibility) |
| `initiallyOpen` | boolean | `false` | No (behavioral) | Whether accordion is open on page load |
| `allowMultipleOpen` | boolean | `false` | No (behavioral) | Allow multiple accordions to be open simultaneously |
| `accordionWidth` | string | `100%` | No (behavioral) | Accordion container width |
| `accordionHorizontalAlign` | string | `left` | No (behavioral) | Horizontal alignment of the accordion |
| `headingLevel` | string | `none` | No (behavioral) | Semantic HTML heading level (none, h1-h6) |
| `useHeadingStyles` | boolean | `false` | No (behavioral) | Apply default heading styles to title |

## Colors

Text and background colors for title, content, and states

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | string | `#333333` | Yes | Text color for the accordion title |
| `titleBackgroundColor` | string | `#f5f5f5` | Yes | Background color for the accordion title |
| `hoverTitleColor` | string | `#000000` | Yes | Text color when hovering over title |
| `hoverTitleBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over title |
| `activeTitleColor` | string | `#000000` | Yes | Text color when accordion is open |
| `activeTitleBackgroundColor` | string | `#e0e0e0` | Yes | Background color when accordion is open |
| `contentColor` | string | `#333333` | Yes | Text color for accordion content |
| `contentBackgroundColor` | string | `#ffffff` | Yes | Background color for accordion content |
| `borderColor` | string | `#dddddd` | Yes | Color of the accordion border |
| `accordionBorderColor` | string | `#dddddd` | Yes | Color of the accordion border (alias) |
| `dividerBorderColor` | string | `transparent` | Yes | Color of divider between title and content |

## Icons

Icon appearance and behavior

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `iconColor` | string | `#666666` | Yes | Color of the expand/collapse icon |
| `showIcon` | boolean | `true` | Yes | Display expand/collapse icon |
| `iconPosition` | string | `right` | Yes | Position of icon relative to title |
| `iconSize` | number | `20` | Yes | Size of the icon in pixels |
| `iconTypeClosed` | string | `▾` | Yes | Icon when accordion is closed |
| `iconTypeOpen` | string | `none` | Yes | Icon when accordion is open (none = use just iconTypeClosed with rotation) |
| `iconRotation` | number | `180` | Yes | Rotation angle when open (degrees) |

## Typography

Font settings for title and content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleFontSize` | number | `18` | Yes | Font size for the title in pixels |
| `titleFontWeight` | string | `600` | Yes | Font weight for the title |
| `titleFontFamily` | string | _null_ | Yes | Font family for the title |
| `titleLineHeight` | number | _null_ | Yes | Line height for the title |
| `titleFontStyle` | string | `normal` | Yes | Font style for the title |
| `titleTextTransform` | string | `none` | Yes | Text transformation for the title |
| `titleTextDecoration` | string | `none` | Yes | Text decoration for the title |
| `titleAlignment` | string | `left` | Yes | Text alignment for the title |
| `contentFontSize` | number | `16` | Yes | Font size for content in pixels |
| `contentFontWeight` | string | _null_ | Yes | Font weight for content |
| `contentFontFamily` | string | _null_ | Yes | Font family for content |
| `contentLineHeight` | number | `1.6` | Yes | Line height for content |
| `contentFontStyle` | string | _null_ | Yes | Font style for content |
| `contentTextTransform` | string | _null_ | Yes | Text transformation for content |
| `contentTextDecoration` | string | _null_ | Yes | Text decoration for content |

## Borders

Border styles, widths, radius, and shadow

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `accordionBorderThickness` | number | `1` | Yes | Thickness of the accordion border in pixels |
| `accordionBorderStyle` | string | `solid` | Yes | Style of the accordion border |
| `accordionBorderRadius` | object | _object_ | Yes | Corner radius of the accordion |
| `borderWidth` | string | _null_ | Yes | Generic border width |
| `borderRadius` | string | _null_ | Yes | Generic border radius |
| `accordionShadow` | string | `none` | Yes | CSS box-shadow for the accordion |
| `dividerBorderThickness` | number | `0` | Yes | Thickness of divider between title and content |
| `dividerBorderStyle` | string | `solid` | Yes | Style of divider between title and content |

## Layout

Spacing, padding, and sizing

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titlePadding` | object | _object_ | Yes | Padding inside the title area |
| `contentPadding` | object | _object_ | Yes | Padding inside the content area |
| `accordionMarginBottom` | number | `8` | Yes | Space between accordion blocks |
| `itemSpacing` | number | _null_ | Yes | Spacing between items |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `titleColor` | `--accordion-title-color` |
| `titleBackgroundColor` | `--accordion-title-bg` |
| `hoverTitleColor` | `--accordion-title-hover-color` |
| `hoverTitleBackgroundColor` | `--accordion-title-hover-bg` |
| `activeTitleColor` | `--accordion-title-active-color` |
| `activeTitleBackgroundColor` | `--accordion-title-active-bg` |
| `contentColor` | `--accordion-content-color` |
| `contentBackgroundColor` | `--accordion-content-bg` |
| `borderColor` | `--accordion-border-color` |
| `accordionBorderColor` | `--accordion-border-color` |
| `dividerBorderColor` | `--accordion-divider-color` |
| `iconColor` | `--accordion-icon-color` |
| `titleFontSize` | `--accordion-title-font-size` |
| `titleFontWeight` | `--accordion-title-font-weight` |
| `titleFontFamily` | `--accordion-title-font-family` |
| `titleLineHeight` | `--accordion-title-line-height` |
| `titleFontStyle` | `--accordion-title-font-style` |
| `titleTextTransform` | `--accordion-title-text-transform` |
| `titleTextDecoration` | `--accordion-title-text-decoration` |
| `titleAlignment` | `--accordion-title-alignment` |
| `contentFontSize` | `--accordion-content-font-size` |
| `contentFontWeight` | `--accordion-content-font-weight` |
| `contentFontFamily` | `--accordion-content-font-family` |
| `contentLineHeight` | `--accordion-content-line-height` |
| `contentFontStyle` | `--accordion-content-font-style` |
| `contentTextTransform` | `--accordion-content-text-transform` |
| `contentTextDecoration` | `--accordion-content-text-decoration` |
| `accordionBorderThickness` | `--accordion-border-width` |
| `accordionBorderStyle` | `--accordion-border-style` |
| `accordionBorderRadius` | `--accordion-border-radius` |
| `borderWidth` | `--accordion-border-width` |
| `borderRadius` | `--accordion-border-radius` |
| `accordionShadow` | `--accordion-shadow` |
| `dividerBorderThickness` | `--accordion-divider-width` |
| `dividerBorderStyle` | `--accordion-divider-style` |
| `titlePadding` | `--accordion-title-padding` |
| `contentPadding` | `--accordion-content-padding` |
| `accordionMarginBottom` | `--accordion-margin-bottom` |
| `itemSpacing` | `--accordion-item-spacing` |
| `iconSize` | `--accordion-icon-size` |
| `iconRotation` | `--accordion-icon-rotation` |

