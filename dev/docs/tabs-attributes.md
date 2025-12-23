# Tabs Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/tabs.json`
> Generated at: 2025-12-23T22:20:59.777Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Tabs blocks

- **Block Type:** `tabs`
- **Version:** 2.0.0

## Block Options

Block-level options

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `uniqueId` | string | `` | No (N/A) | Auto-generated unique block identifier |
| `blockId` | string | `` | No (N/A) | Block-specific identification |
| `currentTheme` | string | `` | No (N/A) | Currently active theme name (empty = Default) |
| `tabs` | array | _object_ | No (N/A) | Array of tab items with title, content, and state |
| `tabsData` | array | _object_ | No (N/A) | Synchronized tab button data for server-side rendering |
| `orientation` | string | `horizontal` | No (N/A) | Tab layout orientation |
| `activationMode` | string | `click` | No (generalal) | How tabs are activated (click or hover) |
| `headingLevel` | string | `none` | No (N/A) | Semantic HTML heading level (none, h1-h6) |
| `title` | string | `Tabs` | No (N/A) | Block title (for accessibility) |
| `tabsHorizontalAlign` | string | `center` | No (N/A) | Horizontal alignment of the tabs block |
| `tabsWidth` | string | `100%` | No (N/A) | Tabs container width (e.g., 100%, 500px) |

## Header Row Options

Row background, spacing, alignment, dividers

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `stretchButtonsToRow` | boolean | `false` | Yes | Make tab buttons fill the full width of the row (horizontal orientation only) |
| `tabListBackgroundColor` | string | `transparent` | Yes | Background color for the tab navigation bar |
| `tabsRowBorderColor` | string | `#dddddd` | Yes | Border color for the tab row |
| `tabsRowBorderWidth` | number | `0` | Yes | Border width for the tab row |
| `tabsRowBorderStyle` | string | `solid` | Yes | Border style for the tab row |
| `tabListAlignment` | string | `flex-start` | Yes | Alignment of tabs along the main axis |
| `tabsRowSpacing` | number | `0.5` | Yes | Padding/spacing for the tab row (rem) |
| `tabsButtonGap` | number | `0.5` | Yes | Spacing between individual tab buttons (rem) |
| `enableTabsListContentBorder` | boolean | `false` | Yes | Enable or disable border between tab row and content |
| `tabsListContentBorderColor` | string | `transparent` | Yes | Color of the tab row edge that touches the content |
| `tabsListContentBorderWidth` | number | `1` | Yes | Width of the tab row edge that touches the content |
| `tabsListContentBorderStyle` | string | `solid` | Yes | Style of the tab row edge that touches the content |

## Icon

Icon appearance and behavior

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `showIcon` | boolean | `true` | Yes | Display icons in tab buttons |
| `iconPosition` | string | `right` | Yes | Position of icon relative to text |
| `iconColor` | string | `#666666` | Yes | Color of the tab icon |
| `iconSize` | number | `1` | Yes | Size of the icon in rem |
| `iconTypeClosed` | string | `▾` | Yes | Icon for the tab (char or image URL) |
| `iconTypeOpen` | string | `none` | Yes | Icon when tab is active (none = use closed icon with final rotation) |
| `iconRotation` | number | `0` | Yes | Base rotation of the icon |
| `iconRotationActive` | number | `180` | Yes | Rotation of the icon for the active tab |

## Header Colors

Tab header text/background colors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonColor` | string | `#666666` | Yes | Text color for inactive tab buttons |
| `tabButtonBackgroundColor` | string | `#f5f5f5` | Yes | Background color for inactive tab buttons |
| `tabButtonHoverColor` | string | `#333333` | Yes | Text color when hovering over tab |
| `tabButtonHoverBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over tab |
| `tabButtonActiveColor` | string | `#333333` | Yes | Text color for active/selected tab |
| `tabButtonActiveBackgroundColor` | string | `#ffffff` | Yes | Background color for active/selected tab |

## Header Borders

Tab header borders and active edge

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `enableFocusBorder` | boolean | `true` | Yes | Border on the edge touching the content, giving it a merged look. |
| `tabButtonActiveContentBorderWidth` | number | `1` | Yes | Width of the active button edge touching content |
| `tabButtonActiveContentBorderStyle` | string | `solid` | Yes | Style of the active button edge touching content |
| `tabButtonBorderColor` | string | `#dddddd` | Yes | Border color for inactive tab buttons |
| `tabButtonActiveBorderColor` | string | `#dddddd` | Yes | Border color for the active tab |
| `tabButtonActiveContentBorderColor` | string | `#ffffff` | Yes | Color of the border. Keep it the same color as panel background for a merged look. |
| `tabButtonBorderWidth` | number | `1` | Yes | Border width for tab buttons |
| `tabButtonBorderStyle` | string | `solid` | Yes | Border style for tab buttons |
| `tabButtonBorderRadius` | object | _object_ | Yes | Corner radius for tab buttons |
| `tabButtonShadow` | string | `none` | Yes | Box shadow for tab buttons |
| `tabButtonShadowHover` | string | `none` | Yes | Box shadow for tab buttons on hover |

## Header Typography

Tab header typography

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonActiveFontWeight` | string | `bold` | Yes | Font weight for active/selected tab button |
| `tabButtonFontSize` | number | `1` | Yes | Font size for tab buttons (rem) |
| `tabButtonFontWeight` | string | `500` | Yes | Font weight for tab buttons |
| `tabButtonFontStyle` | string | `normal` | Yes | Font style for tab buttons |
| `tabButtonTextTransform` | string | `none` | Yes | Text transformation for tab buttons |
| `tabButtonTextDecoration` | string | `none` | Yes | Text decoration for tab buttons |
| `tabButtonTextAlign` | string | `center` | Yes | Text alignment for tab buttons |
| `tabButtonPadding` | number | `0.75` | Yes | Padding for tab buttons in rem (vertical/horizontal will be computed) |

## Panel Appearance

Panel background and borders

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `panelBackgroundColor` | string | `#ffffff` | Yes | Background color for tab panels |
| `panelBorderColor` | string | `#dddddd` | Yes | Border color for tab content panel |
| `panelBorderWidth` | number | `1` | Yes | Border width for tab content panel (0-10px) |
| `panelBorderStyle` | string | `solid` | Yes | Border style for tab content panel |
| `panelBorderRadius` | object | _object_ | Yes | Corner radius for tab content panel |

## Block Borders

Wrapper borders and shadows

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
| `showIcon` | `--tabs-show-icon` |
| `iconPosition` | `--tabs-icon-position` |
| `iconColor` | `--tabs-icon-color` |
| `iconSize` | `--tabs-icon-size` |
| `iconTypeClosed` | `--tabs-icon-type-closed` |
| `iconTypeOpen` | `--tabs-icon-type-open` |
| `iconRotation` | `--tabs-icon-rotation-base` |
| `iconRotationActive` | `--tabs-icon-rotation-active` |
| `tabButtonColor` | `--tabs-button-color` |
| `tabButtonBackgroundColor` | `--tabs-button-bg` |
| `tabButtonHoverColor` | `--tabs-button-hover-color` |
| `tabButtonHoverBackgroundColor` | `--tabs-button-hover-bg` |
| `tabButtonActiveColor` | `--tabs-button-active-color` |
| `tabButtonActiveBackgroundColor` | `--tabs-button-active-bg` |
| `enableFocusBorder` | `--tabs-enable-focus-border` |
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
| `enableTabsListContentBorder` | `--tabs-enable-list-divider-border` |
| `tabsListContentBorderColor` | `--tabs-list-divider-border-color` |
| `tabsListContentBorderWidth` | `--tabs-list-divider-border-width` |
| `tabsListContentBorderStyle` | `--tabs-list-divider-border-style` |

