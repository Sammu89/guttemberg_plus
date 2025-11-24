# Tabs Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/tabs.json`
> Generated at: 2025-11-24T23:11:16.754Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Tabs blocks

- **Block Type:** `tabs`
- **Version:** 2.0.0

## Behavior

Non-themeable behavioral and structural settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `uniqueId` | string | `` | No (structural) | Auto-generated unique block identifier |
| `blockId` | string | `` | No (structural) | Block-specific identification |
| `currentTheme` | string | `` | No (structural) | Currently active theme name (empty = Default) |
| `tabs` | array | _object_ | No (content) | Array of tab items with title, content, and state |
| `orientation` | string | `horizontal` | No (behavioral) | Tab layout orientation |
| `activationMode` | string | `auto` | No (behavioral) | How tabs are activated (auto = focus, manual = click) |
| `responsiveBreakpoint` | number | `768` | No (behavioral) | Width in pixels below which to show accordion fallback |
| `headingLevel` | string | `none` | No (structural) | Semantic HTML heading level (none, h1-h6) |
| `title` | string | `Tabs` | No (content) | Block title (for accessibility) |
| `verticalTabButtonTextAlign` | string | `left` | No (behavioral) | Text alignment for vertical tabs |

## Icon

Icon appearance and styling

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `showIcon` | boolean | `true` | Yes | Display icons in tab buttons |
| `iconPosition` | string | `right` | Yes | Position of icon relative to text |
| `iconColor` | string | `inherit` | Yes | Color of tab icons |
| `iconSize` | number | `18` | Yes | Size of tab icons in pixels |
| `iconTypeClosed` | string | `▾` | Yes | Icon when tab is closed (char or image URL) |
| `iconTypeOpen` | string | `none` | Yes | Icon when tab is open (none = use closed icon with rotation) |
| `iconRotation` | number | `180` | Yes | Rotation angle when open (degrees) |

## Title Colors

All title/tab button colors and tab list background

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonColor` | string | `#666666` | Yes | Text color for inactive tab buttons |
| `tabButtonBackgroundColor` | string | `transparent` | Yes | Background color for inactive tab buttons |
| `tabButtonHoverColor` | string | `#333333` | Yes | Text color when hovering over tab |
| `tabButtonHoverBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over tab |
| `tabButtonActiveColor` | string | `#000000` | Yes | Text color for active/selected tab |
| `tabButtonActiveBackgroundColor` | string | `#ffffff` | Yes | Background color for active/selected tab |
| `tabButtonActiveBorderColor` | string | `#dddddd` | Yes | Border color for the active tab |
| `tabButtonActiveBorderBottomColor` | string | `transparent` | Yes | Bottom border color for active tab (creates connected effect) |
| `tabListBackgroundColor` | string | `#f5f5f5` | Yes | Background color for the tab navigation bar |

## Title Borders

All tab button borders, shadows, radius, and padding

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonBorderColor` | string | _null_ | Yes | Border color for inactive tab buttons |
| `tabButtonBorderWidth` | number | _null_ | Yes | Border width for tab buttons |
| `tabButtonBorderStyle` | string | _null_ | Yes | Border style for tab buttons |
| `tabButtonBorderRadius` | object | _object_ | Yes | Corner radius for tab buttons |
| `tabButtonShadow` | string | `none` | Yes | Box shadow for tab buttons |
| `tabButtonShadowHover` | string | `none` | Yes | Box shadow for tab buttons on hover |
| `tabButtonPadding` | object | _object_ | Yes | Padding inside tab buttons |

## Title Typography

All title/tab button typography and tab list alignment

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonFontSize` | number | `16` | Yes | Font size for tab buttons |
| `tabButtonFontWeight` | string | `500` | Yes | Font weight for tab buttons |
| `tabButtonFontStyle` | string | `normal` | Yes | Font style for tab buttons |
| `tabButtonTextTransform` | string | `none` | Yes | Text transformation for tab buttons |
| `tabButtonTextDecoration` | string | `none` | Yes | Text decoration for tab buttons |
| `tabButtonTextAlign` | string | `center` | Yes | Text alignment for tab buttons |
| `tabListAlignment` | string | `left` | Yes | Horizontal alignment of tabs |

## Content

All panel colors and borders

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `panelColor` | string | `#333333` | Yes | Text color for tab panel content |
| `panelBackgroundColor` | string | `#ffffff` | Yes | Background color for tab panels |
| `panelBorderColor` | string | `#dddddd` | Yes | Border color for tab panels |
| `panelBorderWidth` | number | `1` | Yes | Border width for tab panels |
| `panelBorderStyle` | string | `solid` | Yes | Border style for tab panels |
| `panelBorderRadius` | object | _object_ | Yes | Corner radius for tab panels |
| `panelShadow` | string | `none` | Yes | Box shadow for tab panels |

## Divider

Divider line between tabs navigation and content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `dividerLineColor` | string | _null_ | Yes | Color of divider line between tabs and panel |
| `dividerLineWidth` | number | _null_ | Yes | Width/thickness of divider line |
| `dividerLineStyle` | string | _null_ | Yes | Style of divider line between tabs and panel |

## Layout

Spacing, gaps, and sizing (unused in UI - for future spacing controls)

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `verticalTabListWidth` | number | `200` | Yes | Width of tab list in vertical orientation |
| `itemSpacing` | number | _null_ | Yes | General spacing between items |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `showIcon` | `--tab-show-icon` |
| `iconColor` | `--icon-color` |
| `iconSize` | `--icon-size` |
| `iconRotation` | `--icon-rotation` |
| `tabButtonColor` | `--tab-button-color` |
| `tabButtonBackgroundColor` | `--tab-button-bg` |
| `tabButtonHoverColor` | `--tab-button-hover-color` |
| `tabButtonHoverBackgroundColor` | `--tab-button-hover-bg` |
| `tabButtonActiveColor` | `--tab-button-active-color` |
| `tabButtonActiveBackgroundColor` | `--tab-button-active-bg` |
| `tabButtonActiveBorderColor` | `--tab-button-active-border-color` |
| `tabButtonActiveBorderBottomColor` | `--tab-button-active-border-bottom-color` |
| `tabButtonBorderColor` | `--tab-button-border-color` |
| `tabButtonBorderWidth` | `--tab-button-border-width` |
| `tabButtonBorderStyle` | `--tab-button-border-style` |
| `tabButtonBorderRadius` | `--tab-button-border-radius` |
| `tabButtonShadow` | `--tab-button-shadow` |
| `tabButtonShadowHover` | `--tab-button-shadow-hover` |
| `tabButtonFontSize` | `--tab-button-font-size` |
| `tabButtonFontWeight` | `--tab-button-font-weight` |
| `tabButtonFontStyle` | `--tab-button-font-style` |
| `tabButtonTextTransform` | `--tab-button-text-transform` |
| `tabButtonTextDecoration` | `--tab-button-text-decoration` |
| `tabButtonTextAlign` | `--tab-button-text-align` |
| `tabButtonPadding` | `--tab-button-padding` |
| `tabListBackgroundColor` | `--tab-list-bg` |
| `tabListAlignment` | `--tab-list-align` |
| `panelColor` | `--tab-panel-color` |
| `panelBackgroundColor` | `--tab-panel-bg` |
| `panelBorderColor` | `--tab-panel-border-color` |
| `panelBorderWidth` | `--tab-panel-border-width` |
| `panelBorderStyle` | `--tab-panel-border-style` |
| `panelBorderRadius` | `--tab-panel-border-radius` |
| `panelShadow` | `--tab-panel-shadow` |
| `dividerLineColor` | `--divider-color` |
| `dividerLineWidth` | `--divider-width` |
| `dividerLineStyle` | `--divider-style` |
| `verticalTabListWidth` | `--vertical-tab-list-width` |
| `itemSpacing` | `--tabs-item-spacing` |

