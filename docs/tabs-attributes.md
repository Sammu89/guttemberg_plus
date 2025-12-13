# Tabs Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/tabs.json`
> Generated at: 2025-12-13T00:48:15.541Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Tabs blocks

- **Block Type:** `tabs`
- **Version:** 2.0.0

## Behaviour

Behavioral and functional settings that control how tabs work

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `uniqueId` | string | `` | No (structural) | Auto-generated unique block identifier |
| `blockId` | string | `` | No (structural) | Block-specific identification |
| `currentTheme` | string | `` | No (structural) | Currently active theme name (empty = Default) |
| `tabs` | array | _object_ | No (content) | Array of tab items with title, content, and state |
| `tabsData` | array | _object_ | No (structural) | Synchronized tab button data for server-side rendering |
| `orientation` | string | `horizontal` | No (structural) | Tab layout orientation |
| `activationMode` | string | `auto` | No (generalal) | How tabs are activated (auto = focus, manual = click) |
| `headingLevel` | string | `none` | No (structural) | Semantic HTML heading level (none, h1-h6) |
| `title` | string | `Tabs` | No (content) | Block title (for accessibility) |
| `verticalTabButtonTextAlign` | string | `left` | No (generalal) | Text alignment for vertical tabs |
| `tabsHorizontalAlign` | string | `left` | No (N/A) | Horizontal alignment of the tabs block |
| `tabsWidth` | string | `100%` | No (N/A) | Tabs container width (e.g., 100%, 500px) |

## Icon

Icon appearance and styling

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `showIcon` | boolean | `true` | No (N/A) | Display icons in tab buttons |
| `iconPosition` | string | `right` | No (N/A) | Position of icon relative to text |
| `iconColor` | string | `#666666` | Yes | Color of the tab icon |
| `iconSize` | number | `16` | Yes | Size of the icon in pixels |
| `iconTypeClosed` | string | `▾` | No (N/A) | Icon when tab is closed (char or image URL) |
| `iconTypeOpen` | string | `none` | No (N/A) | Icon when tab is open (none = use closed icon with rotation) |
| `iconRotation` | number | `180` | Yes | Rotation angle when open (degrees) |

## Button Colors

Tab button text and background colors for all states

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonColor` | string | `#666666` | Yes | Text color for inactive tab buttons |
| `tabButtonBackgroundColor` | string | `#f5f5f5` | Yes | Background color for inactive tab buttons |
| `tabButtonHoverColor` | string | `#333333` | Yes | Text color when hovering over tab |
| `tabButtonHoverBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over tab |
| `tabButtonActiveColor` | string | `#333333` | Yes | Text color for active/selected tab |
| `tabButtonActiveBackgroundColor` | string | `#ffffff` | Yes | Background color for active/selected tab |

## Button Borders

Tab button borders including enhanced border adjacent to content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonActiveBorderColor` | string | `#dddddd` | Yes | Border color for the active tab |
| `tabButtonActiveBorderBottomColor` | string | `#ffffff` | Yes | Bottom border color for active tab (creates connected effect) |
| `tabButtonBorderColor` | string | `#dddddd` | Yes | Border color for inactive tab buttons |
| `tabButtonBorderWidth` | number | `1` | Yes | Border width for tab buttons |
| `tabButtonBorderStyle` | string | `solid` | Yes | Border style for tab buttons |
| `tabButtonBorderRadius` | object | _object_ | Yes | Corner radius for tab buttons |
| `tabButtonShadow` | string | `none` | Yes | Box shadow for tab buttons |
| `tabButtonShadowHover` | string | `none` | Yes | Box shadow for tab buttons on hover |
| `enableFocusBorder` | boolean | `true` | No (N/A) | Enable or disable enhanced border settings for tab buttons (adjacent to content) |
| `focusBorderColor` | string | `#dddddd` | Yes | Border color for inactive button edge adjacent to content |
| `focusBorderColorActive` | string | `#ffffff` | Yes | Border color for active button edge adjacent to content |
| `focusBorderWidth` | number | `2` | Yes | Width of button edge adjacent to content |
| `focusBorderStyle` | string | `solid` | Yes | Style of button edge adjacent to content |

## Button Typography

Tab button typography and alignment

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonActiveFontWeight` | string | `bold` | Yes | Font weight for active/selected tab button |
| `tabButtonFontSize` | number | `16` | Yes | Font size for tab buttons |
| `tabButtonFontWeight` | string | `500` | Yes | Font weight for tab buttons |
| `tabButtonFontStyle` | string | `normal` | Yes | Font style for tab buttons |
| `tabButtonTextTransform` | string | `none` | Yes | Text transformation for tab buttons |
| `tabButtonTextDecoration` | string | `none` | Yes | Text decoration for tab buttons |
| `tabButtonTextAlign` | string | `center` | Yes | Text alignment for tab buttons |

## Nav Bar

Navigation bar background, alignment, and border

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabListBackgroundColor` | string | `transparent` | Yes | Background color for the tab navigation bar |
| `tabListAlignment` | string | `left` | Yes | Horizontal alignment of tabs |
| `enableNavBarBorder` | boolean | `false` | No (N/A) | Enable or disable border between navigation bar and content |
| `navBarBorderColor` | string | `transparent` | Yes | Color of border between navigation bar and content |
| `navBarBorderWidth` | number | `1` | Yes | Width of border between navigation bar and content |
| `navBarBorderStyle` | string | `solid` | Yes | Style of border between navigation bar and content |

## Content

Content panel colors, borders, and radius

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `panelBackgroundColor` | string | `#ffffff` | Yes | Background color for tab panels |
| `panelColor` | string | `#333333` | Yes | Text color for tab panel content |
| `panelBorderColor` | string | `#dddddd` | Yes | Border color for tab content panel |
| `panelBorderWidth` | number | `1` | Yes | Border width for tab content panel (0-10px) |
| `panelBorderStyle` | string | `solid` | Yes | Border style for tab content panel |
| `panelBorderRadius` | object | _object_ | Yes | Corner radius for tab content panel |

## External Borders

Main tabs wrapper borders and radius

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `borderColor` | string | `#dddddd` | Yes | Border color for main tabs wrapper |
| `borderWidth` | number | `0` | Yes | Border width for main wrapper |
| `borderStyle` | string | `solid` | Yes | Border style for wrapper |
| `borderRadius` | object | _object_ | Yes | Corner radius for main wrapper |
| `shadow` | string | `none` | Yes | Box shadow for main wrapper |
| `shadowHover` | string | `none` | Yes | Box shadow for wrapper on hover |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `iconColor` | `--tabs-icon-color` |
| `iconSize` | `--tabs-icon-size` |
| `iconRotation` | `--tabs-icon-rotation` |
| `tabButtonColor` | `--tabs-button-color` |
| `tabButtonBackgroundColor` | `--tabs-button-bg` |
| `tabButtonHoverColor` | `--tabs-button-hover-color` |
| `tabButtonHoverBackgroundColor` | `--tabs-button-hover-bg` |
| `tabButtonActiveColor` | `--tabs-button-active-color` |
| `tabButtonActiveBackgroundColor` | `--tabs-button-active-bg` |
| `tabButtonActiveBorderColor` | `--tabs-button-active-border-color` |
| `tabButtonActiveBorderBottomColor` | `--tabs-button-active-border-bottom-color` |
| `tabButtonActiveFontWeight` | `--tabs-button-active-font-weight` |
| `tabButtonBorderColor` | `--tabs-button-border-color` |
| `tabButtonBorderWidth` | `--tabs-button-border-width` |
| `tabButtonBorderStyle` | `--tabs-button-border-style` |
| `tabButtonBorderRadius` | `--tabs-button-border-radius` |
| `tabButtonShadow` | `--tabs-button-border-shadow` |
| `tabButtonShadowHover` | `--tabs-button-border-shadow-hover` |
| `focusBorderColor` | `--tabs-focus-border-color` |
| `focusBorderColorActive` | `--tabs-focus-border-color-active` |
| `focusBorderWidth` | `--tabs-focus-border-width` |
| `focusBorderStyle` | `--tabs-focus-border-style` |
| `tabButtonFontSize` | `--tabs-button-font-size` |
| `tabButtonFontWeight` | `--tabs-button-font-weight` |
| `tabButtonFontStyle` | `--tabs-button-font-style` |
| `tabButtonTextTransform` | `--tabs-button-text-transform` |
| `tabButtonTextDecoration` | `--tabs-button-text-decoration` |
| `tabButtonTextAlign` | `--tabs-button-text-align` |
| `tabListBackgroundColor` | `--tabs-list-bg` |
| `tabListAlignment` | `--tabs-list-align` |
| `panelBackgroundColor` | `--tabs-panel-bg` |
| `panelColor` | `--tabs-panel-color` |
| `panelBorderColor` | `--tabs-panel-border-color` |
| `panelBorderWidth` | `--tabs-panel-border-width` |
| `panelBorderStyle` | `--tabs-panel-border-style` |
| `panelBorderRadius` | `--tabs-panel-border-radius` |
| `borderColor` | `--tabs-border-color` |
| `borderWidth` | `--tabs-border-width` |
| `borderStyle` | `--tabs-border-style` |
| `borderRadius` | `--tabs-border-radius` |
| `shadow` | `--tabs-border-shadow` |
| `shadowHover` | `--tabs-border-shadow-hover` |
| `navBarBorderColor` | `--tabs-divider-border-color` |
| `navBarBorderWidth` | `--tabs-divider-border-width` |
| `navBarBorderStyle` | `--tabs-divider-border-style` |

