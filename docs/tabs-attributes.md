# Tabs Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/tabs.json`
> Generated at: 2025-12-15T23:22:26.906Z
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
| `iconTypeClosed` | string | `▾` | No (N/A) | Icon for the tab (char or image URL) |
| `iconTypeOpen` | string | `none` | No (N/A) | Icon when tab is active (none = use closed icon with final rotation) |
| `iconRotation` | number | `0` | Yes | Base rotation of the icon |
| `iconRotationActive` | number | `180` | Yes | Rotation of the icon for the active tab |

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
| `enableFocusBorder` | boolean | `true` | No (N/A) | Enable or disable the border on the edge touching the content (active tab only) |
| `tabButtonActiveContentBorderWidth` | number | `2` | Yes | Width of the active button edge touching content |
| `tabButtonActiveContentBorderStyle` | string | `solid` | Yes | Style of the active button edge touching content |
| `tabButtonBorderColor` | string | `#dddddd` | Yes | Border color for inactive tab buttons |
| `tabButtonActiveBorderColor` | string | `#dddddd` | Yes | Border color for the active tab |
| `tabButtonActiveContentBorderColor` | string | `#ffffff` | Yes | Border color on the edge touching content (bottom on horizontal, right on vertical-left, left on vertical-right). Controlled by Enable Active Content Border. |
| `tabButtonBorderWidth` | number | `1` | Yes | Border width for tab buttons |
| `tabButtonBorderStyle` | string | `solid` | Yes | Border style for tab buttons |
| `tabButtonBorderRadius` | object | _object_ | Yes | Corner radius for tab buttons |
| `tabButtonShadow` | string | `none` | Yes | Box shadow for tab buttons |
| `tabButtonShadowHover` | string | `none` | Yes | Box shadow for tab buttons on hover |

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
| `tabButtonPadding` | number | `12` | Yes | Padding for tab buttons (vertical/horizontal will be computed) |

## Tab Row

Tab row background, alignment, and border

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabListBackgroundColor` | string | `transparent` | Yes | Background color for the tab navigation bar |
| `tabsRowBorderColor` | string | `#dddddd` | Yes | Border color for the tab row |
| `tabsRowBorderWidth` | number | `0` | Yes | Border width for the tab row |
| `tabsRowBorderStyle` | string | `solid` | Yes | Border style for the tab row |
| `tabListAlignment` | string | `flex-start` | Yes | Alignment of tabs along the main axis |
| `tabsRowSpacing` | number | `8` | Yes | Padding/spacing for the tab row |
| `tabsButtonGap` | number | `8` | Yes | Spacing between individual tab buttons |
| `enableTabsListContentBorder` | boolean | `false` | No (N/A) | Enable or disable border between tab row and content |
| `tabsListContentBorderColor` | string | `transparent` | Yes | Color of the tab row edge that touches the content |
| `tabsListContentBorderWidth` | number | `1` | Yes | Width of the tab row edge that touches the content |
| `tabsListContentBorderStyle` | string | `solid` | Yes | Style of the tab row edge that touches the content |

## Content

Content panel colors, borders, and radius

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `panelBackgroundColor` | string | `#ffffff` | Yes | Background color for tab panels |
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
| `iconRotation` | `--tabs-icon-rotation-base` |
| `iconRotationActive` | `--tabs-icon-rotation-active` |
| `tabButtonColor` | `--tabs-button-color` |
| `tabButtonBackgroundColor` | `--tabs-button-bg` |
| `tabButtonHoverColor` | `--tabs-button-hover-color` |
| `tabButtonHoverBackgroundColor` | `--tabs-button-hover-bg` |
| `tabButtonActiveColor` | `--tabs-button-active-color` |
| `tabButtonActiveBackgroundColor` | `--tabs-button-active-bg` |
| `tabButtonActiveContentBorderWidth` | `--tabs-button-active-content-border-width` |
| `tabButtonActiveContentBorderStyle` | `--tabs-button-active-content-border-style` |
| `tabButtonActiveFontWeight` | `--tabs-button-active-font-weight` |
| `tabButtonBorderColor` | `--tabs-button-border-color` |
| `tabButtonActiveBorderColor` | `--tabs-button-active-border-color` |
| `tabButtonActiveContentBorderColor` | `--tabs-button-active-content-border-color` |
| `tabButtonBorderWidth` | `--tabs-button-border-width` |
| `tabButtonBorderStyle` | `--tabs-button-border-style` |
| `tabButtonBorderRadius` | `--tabs-button-border-radius` |
| `tabButtonShadow` | `--tabs-button-border-shadow` |
| `tabButtonShadowHover` | `--tabs-button-border-shadow-hover` |
| `tabButtonFontSize` | `--tabs-button-font-size` |
| `tabButtonFontWeight` | `--tabs-button-font-weight` |
| `tabButtonFontStyle` | `--tabs-button-font-style` |
| `tabButtonTextTransform` | `--tabs-button-text-transform` |
| `tabButtonTextDecoration` | `--tabs-button-text-decoration` |
| `tabButtonTextAlign` | `--tabs-button-text-align` |
| `tabButtonPadding` | `--tabs-button-padding` |
| `tabListBackgroundColor` | `--tabs-list-bg` |
| `tabsRowBorderColor` | `--tabs-row-border-color` |
| `tabsRowBorderWidth` | `--tabs-row-border-width` |
| `tabsRowBorderStyle` | `--tabs-row-border-style` |
| `tabListAlignment` | `--tabs-list-align` |
| `tabsRowSpacing` | `--tabs-row-spacing` |
| `tabsButtonGap` | `--tabs-button-gap` |
| `panelBackgroundColor` | `--tabs-panel-bg` |
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
| `tabsListContentBorderColor` | `--tabs-list-divider-border-color` |
| `tabsListContentBorderWidth` | `--tabs-list-divider-border-width` |
| `tabsListContentBorderStyle` | `--tabs-list-divider-border-style` |

