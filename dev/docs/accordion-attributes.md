# Accordion Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/accordion.json`
> Generated at: 2026-01-12T22:58:19.348Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Accordion blocks

- **Block Type:** `accordion`
- **Version:** 1.0.0

## Borders

Block borders, radius, shadows, and divider settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `dividerBorder` | border-panel | _object_ | No (N/A) |  |
| `blockBox` | box-panel | _object_ | No (N/A) |  |

## Layout

Spacing and padding settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `headerBox` | box-panel | _object_ | No (N/A) |  |
| `contentBox` | box-panel | _object_ | No (N/A) |  |

## Colors

Header and panel color settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | color-panel | _object_ | No (N/A) |  |
| `contentColor` | color-panel | _object_ | No (N/A) |  |

## Typography

Font settings for header and content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `contentTypography` | typography-panel | `undefined` | No (N/A) |  |
| `titleTypography` | typography-panel | `undefined` | No (N/A) |  |

## Icon

Icon appearance and behavior

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

## Animation

Open/close animation settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `animationType` | string | `slide` | Yes | How the accordion opens and closes |
| `animationDuration` | string | `250ms` | Yes | Animation duration in milliseconds |

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
| `showIcon` | `--accordion-icon-display` |
| `iconRotation` | `--accordion-icon-animation-rotation` |
| `iconInactiveColor` | `--accordion-icon-color` |
| `iconInactiveRotation` | `--accordion-icon-initial-rotation` |
| `iconInactiveSize` | `--accordion-icon-size` |
| `iconInactiveMaxSize` | `--accordion-icon-max-size` |
| `iconInactiveOffsetX` | `--accordion-icon-offset-x` |
| `iconInactiveOffsetY` | `--accordion-icon-offset-y` |
| `iconActiveColor` | `--accordion-icon-is-open-color` |
| `iconActiveRotation` | `--accordion-icon-is-open-initial-rotation` |
| `iconActiveSize` | `--accordion-icon-is-open-size` |
| `iconActiveMaxSize` | `--accordion-icon-is-open-max-size` |
| `iconActiveOffsetX` | `--accordion-icon-is-open-offset-x` |
| `iconActiveOffsetY` | `--accordion-icon-is-open-offset-y` |
| `animationDuration` | `--accordion-animation-duration` |

