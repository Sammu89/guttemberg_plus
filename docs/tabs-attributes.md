# Tabs Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/tabs.json`
> Generated at: 2025-12-08T17:41:15.044Z
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
| `orientation` | string | `horizontal` | No (generalal) | Tab layout orientation |
| `activationMode` | string | `auto` | No (generalal) | How tabs are activated (auto = focus, manual = click) |
| `headingLevel` | string | `none` | No (structural) | Semantic HTML heading level (none, h1-h6) |
| `title` | string | `Tabs` | No (content) | Block title (for accessibility) |
| `verticalTabButtonTextAlign` | string | `left` | No (generalal) | Text alignment for vertical tabs |

## Icon

Icon appearance and styling

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `showIcon` | boolean | `true` | No (behavioral) | Display icons in tab buttons |
| `iconPosition` | string | `right` | No (behavioral) | Position of icon relative to text |
| `iconColor` | string | `#666666` | Yes | Color of the tab icon |
| `iconSize` | number | `16` | Yes | Size of the icon in pixels |
| `iconTypeClosed` | string | `▾` | No (behavioral) | Icon when tab is closed (char or image URL) |
| `iconTypeOpen` | string | `none` | No (behavioral) | Icon when tab is open (none = use closed icon with rotation) |
| `iconRotation` | number | `180` | No (behavioral) | Rotation angle when open (degrees) |

## Button Colors

Tab button text and background colors for inactive state

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonColor` | string | `#666666` | Yes | Text color for inactive tab buttons |
| `tabButtonBackgroundColor` | string | `transparent` | Yes | Background color for inactive tab buttons |

## Button Hover

Tab button colors when hovering

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonHoverColor` | string | `#333333` | Yes | Text color when hovering over tab |
| `tabButtonHoverBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over tab |

## Button Active

Tab button colors for active/selected state

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonActiveColor` | string | `#000000` | Yes | Text color for active/selected tab |
| `tabButtonActiveBackgroundColor` | string | `#ffffff` | Yes | Background color for active/selected tab |
| `tabButtonActiveBorderColor` | string | `#dddddd` | Yes | Border color for the active tab |
| `tabButtonActiveBorderBottomColor` | string | `transparent` | Yes | Bottom border color for active tab (creates connected effect) |

## Button Borders

Tab button full border around the button element

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `buttonBorderColor` | string | _null_ | Yes | Border color for inactive tab buttons |
| `buttonBorderWidth` | number | _null_ | Yes | Border width for tab buttons |
| `buttonBorderStyle` | string | _null_ | Yes | Border style for tab buttons |
| `buttonBorderRadius` | object | _object_ | Yes | Corner radius for tab buttons |
| `buttonShadow` | string | `none` | Yes | Box shadow for tab buttons |
| `buttonShadowHover` | string | `none` | Yes | Box shadow for tab buttons on hover |

## Special Borders

Individual button borders and navigation bar divider borders adjacent to content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `enableFocusBorder` | boolean | `true` | No (behavioral) | Enable or disable focus border settings for tab buttons |
| `focusBorderColor` | string | `#0073aa` | Yes | Border color for inactive button edge adjacent to content |
| `focusBorderColorActive` | string | `#0073aa` | Yes | Border color for active button edge adjacent to content |
| `focusBorderWidth` | number | `2` | Yes | Width of button edge adjacent to content |
| `focusBorderStyle` | string | `solid` | Yes | Style of button edge adjacent to content |
| `enableDividerBorder` | boolean | `true` | No (behavioral) | Enable or disable divider border settings for navigation bar |
| `dividerBorderColor` | string | `#dddddd` | Yes | Color of navbar border adjacent to content |
| `dividerBorderWidth` | number | `1` | Yes | Width of navbar border adjacent to content |
| `dividerBorderStyle` | string | `solid` | Yes | Style of navbar border adjacent to content |

## Button Typography

Tab button typography and alignment

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonFontSize` | number | `16` | Yes | Font size for tab buttons |
| `tabButtonFontWeight` | string | `500` | Yes | Font weight for tab buttons |
| `tabButtonFontStyle` | string | `normal` | Yes | Font style for tab buttons |
| `tabButtonTextTransform` | string | `none` | Yes | Text transformation for tab buttons |
| `tabButtonTextDecoration` | string | `none` | Yes | Text decoration for tab buttons |
| `tabButtonTextAlign` | string | `center` | Yes | Text alignment for tab buttons |

## Nav Bar

Navigation bar background and alignment

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabListBackgroundColor` | string | `#f5f5f5` | Yes | Background color for the tab navigation bar |
| `tabListAlignment` | string | `left` | Yes | Horizontal alignment of tabs |
| `panelBackgroundColor` | string | `#ffffff` | Yes | Background color for tab panels |

## Content

Content panel colors, borders, and radius

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `panelColor` | string | `#333333` | Yes | Text color for tab panel content |
| `panelBorderColor` | string | `#dddddd` | Yes | Border color for tab content panel |
| `panelBorderWidth` | number | `1` | Yes | Border width for tab content panel (0-10px) |
| `panelBorderStyle` | string | `solid` | Yes | Border style for tab content panel |
| `panelBorderRadius` | object | _object_ | Yes | Corner radius for tab content panel |

## Borders

Main tabs wrapper borders and radius

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `borderColor` | string | `transparent` | Yes | Border color for main tabs wrapper |
| `borderWidth` | number | `0` | Yes | Border width for main wrapper |
| `borderStyle` | string | `none` | Yes | Border style for wrapper |
| `borderRadius` | object | _object_ | Yes | Corner radius for main wrapper |
| `shadow` | string | `none` | Yes | Box shadow for main wrapper |
| `shadowHover` | string | `none` | Yes | Box shadow for wrapper on hover |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `iconColor` | `--tabs-icon-color` |
| `iconSize` | `--tabs-icon-size` |
| `tabButtonColor` | `--tabs-button-color` |
| `tabButtonBackgroundColor` | `--tabs-button-bg` |
| `tabButtonHoverColor` | `--tabs-button-hover-color` |
| `tabButtonHoverBackgroundColor` | `--tabs-button-hover-bg` |
| `tabButtonActiveColor` | `--tabs-button-active-color` |
| `tabButtonActiveBackgroundColor` | `--tabs-button-active-bg` |
| `tabButtonActiveBorderColor` | `--tabs-button-active-border-color` |
| `tabButtonActiveBorderBottomColor` | `--tabs-button-active-border-bottom-color` |
| `buttonBorderColor` | `--tabs-button-border-color` |
| `buttonBorderWidth` | `--tabs-button-border-width` |
| `buttonBorderStyle` | `--tabs-button-border-style` |
| `buttonBorderRadius` | `--tabs-button-border-radius` |
| `buttonShadow` | `--tabs-button-border-shadow` |
| `buttonShadowHover` | `--tabs-button-border-shadow-hover` |
| `focusBorderColor` | `--tabs-focus-border-color` |
| `focusBorderColorActive` | `--tabs-focus-border-color-active` |
| `focusBorderWidth` | `--tabs-focus-border-width` |
| `focusBorderStyle` | `--tabs-focus-border-style` |
| `tabButtonFontSize` | `--tabs-button-font-size` |
| `tabButtonFontWeight` | `--tab-button-font-weight` |
| `tabButtonFontStyle` | `--tab-button-font-style` |
| `tabButtonTextTransform` | `--tab-button-text-transform` |
| `tabButtonTextDecoration` | `--tab-button-text-decoration` |
| `tabButtonTextAlign` | `--tab-button-text-align` |
| `tabListBackgroundColor` | `--tab-list-bg` |
| `tabListAlignment` | `--tab-list-align` |
| `panelBackgroundColor` | `--tab-panel-bg` |
| `panelColor` | `--tab-panel-color` |
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
| `dividerBorderColor` | `--tabs-divider-border-color` |
| `dividerBorderWidth` | `--tabs-divider-border-width` |
| `dividerBorderStyle` | `--tabs-divider-border-style` |

