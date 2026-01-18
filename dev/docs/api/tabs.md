# Tabs Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/tabs.json`
> Generated at: 2026-01-17T00:21:01.567Z
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
| `tabsWidth` | string | `100%` | No (N/A) | Tabs container width |
| `headingLevel` | string | `none` | No (N/A) | Semantic HTML heading level (none, h1-h6) |
| `tabsHorizontalAlign` | string | `center` | No (N/A) | Horizontal alignment of the tabs block |
| `orientation` | string | `horizontal` | No (N/A) | Tab layout orientation |
| `activationMode` | string | `click` | No (generalal) | How tabs are activated (click or hover) |
| `title` | string | `Tabs` | No (N/A) | Block title (for accessibility) |
| `tabs` | array | _object_ | No (N/A) | Array of tab items with title, content, and state |
| `tabsData` | array | _object_ | No (N/A) | Synchronized tab button data for server-side rendering |
| `currentTheme` | string | `` | No (N/A) | Currently active theme name (empty = Default) |
| `uniqueId` | string | `` | No (N/A) | Auto-generated unique block identifier |
| `blockId` | string | `` | No (N/A) | Block-specific identification |

## Block Borders

Wrapper borders and shadows

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `borderColor` | object | _object_ | Yes | Border color for main tabs wrapper |
| `borderWidth` | number | `0` | Yes | Border width for main wrapper |
| `borderStyle` | object | _object_ | Yes | Border style for wrapper |
| `borderRadius` | object | _object_ | Yes | Corner radius for main wrapper |
| `shadow` | string | `none` | Yes | Box shadow for main wrapper |
| `shadowHover` | string | `none` | Yes | Box shadow for wrapper on hover |

## Header Colors

Tab header text/background colors

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonColor` | color-panel | _object_ | No (N/A) |  |

## Header Typography

Tab header typography

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonFontSize` | number | `1rem` | Yes | Font size for tab buttons (rem) |
| `tabButtonFontWeight` | string | `500` | Yes | Font weight for tab buttons |
| `tabButtonFontStyle` | string | `normal` | Yes | Font style for tab buttons |
| `tabButtonTextTransform` | string | `none` | Yes | Text transformation for tab buttons |
| `tabButtonTextDecoration` | string | `none` | Yes | Text decoration for tab buttons |
| `tabButtonTextAlign` | string | `center` | Yes | Text alignment for tab buttons |
| `tabButtonPadding` | number | `0.75rem` | Yes | Padding for tab buttons in rem (vertical/horizontal will be computed) |
| `tabButtonActiveFontWeight` | string | `bold` | Yes | Font weight for active/selected tab button |

## Header Borders

Tab header borders and active edge

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabButtonBorderColor` | object | _object_ | Yes | Border color for inactive tab buttons |
| `tabButtonActiveBorderColor` | object | _object_ | Yes | Border color for the active tab |
| `tabButtonBorderWidth` | number | `1` | Yes | Border width for tab buttons |
| `tabButtonBorderStyle` | object | _object_ | Yes | Border style for tab buttons |
| `tabButtonBorderRadius` | object | _object_ | Yes | Corner radius for tab buttons |
| `tabButtonShadow` | string | `none` | Yes | Box shadow for tab buttons |
| `tabButtonShadowHover` | string | `none` | Yes | Box shadow for tab buttons on hover |
| `enableFocusBorder` | boolean | `true` | Yes | Border on the edge touching the content, giving it a merged look. |
| `tabButtonActiveContentBorderColor` | string | `#ffffff` | Yes | Color of the border. Keep it the same color as panel background for a merged look. |
| `tabButtonActiveContentBorderWidth` | number | `1` | Yes | Width of the active button edge touching content |
| `tabButtonActiveContentBorderStyle` | string | `solid` | Yes | Style of the active button edge touching content |

## Header Row Options

Row background, spacing, alignment, dividers

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabListBackgroundColor` | string | `transparent` | Yes | Background color for the tab navigation bar |
| `tabsRowBorderColor` | object | _object_ | Yes | Border color for the tab row |
| `tabsRowBorderWidth` | number | `0` | Yes | Border width for the tab row |
| `tabsRowBorderStyle` | object | _object_ | Yes | Border style for the tab row |
| `tabsRowSpacing` | number | `0.5rem` | Yes | Padding/spacing for the tab row (rem) |
| `tabsButtonGap` | number | `0.5rem` | Yes | Spacing between individual tab buttons (rem) |
| `stretchButtonsToRow` | boolean | `false` | Yes | Make tab buttons fill the full width of the row (horizontal orientation only) |
| `tabListAlignment` | string | `flex-start` | Yes | Alignment of tabs along the main axis |
| `enableTabsListContentBorder` | boolean | `false` | Yes | Enable or disable border between tab row and content |
| `tabsListContentBorderColor` | string | `transparent` | Yes | Color of the tab row edge that touches the content |
| `tabsListContentBorderWidth` | number | `1` | Yes | Width of the tab row edge that touches the content |
| `tabsListContentBorderStyle` | string | `solid` | Yes | Style of the tab row edge that touches the content |

## Panel Appearance

Panel background and borders

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `panelBackgroundColor` | string | `#ffffff` | Yes | Background color for tab panels |
| `panelBorderColor` | object | _object_ | Yes | Border color for tab content panel |
| `panelBorderWidth` | number | `1` | Yes | Border width for tab content panel (0-10px) |
| `panelBorderStyle` | object | _object_ | Yes | Border style for tab content panel |
| `panelBorderRadius` | object | _object_ | Yes | Corner radius for tab content panel |

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

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `borderColor` | `--tabs-border-color` |
| `borderWidth` | `--tabs-border-width` |
| `borderStyle` | `--tabs-border-style` |
| `borderRadius` | `--tabs-border-radius` |
| `shadow` | `--tabs-border-shadow` |
| `shadowHover` | `--tabs-border-shadow-hover` |
| `tabButtonFontSize` | `--tabs-button-font-size` |
| `tabButtonFontWeight` | `--tabs-button-font-weight` |
| `tabButtonFontStyle` | `--tabs-button-font-style` |
| `tabButtonTextTransform` | `--tabs-button-text-transform` |
| `tabButtonTextDecoration` | `--tabs-button-text-decoration` |
| `tabButtonTextAlign` | `--tabs-button-text-align` |
| `tabButtonPadding` | `--tabs-button-padding` |
| `tabButtonActiveFontWeight` | `--tabs-button-active-font-weight` |
| `tabButtonBorderColor` | `--tabs-button-border-color` |
| `tabButtonActiveBorderColor` | `--tabs-button-active-border-color` |
| `tabButtonBorderWidth` | `--tabs-button-border-width` |
| `tabButtonBorderStyle` | `--tabs-button-border-style` |
| `tabButtonBorderRadius` | `--tabs-button-border-radius` |
| `tabButtonShadow` | `--tabs-button-border-shadow` |
| `tabButtonShadowHover` | `--tabs-button-border-shadow-hover` |
| `enableFocusBorder` | `--tabs-enable-focus-border` |
| `tabButtonActiveContentBorderColor` | `--tabs-button-active-content-border-color` |
| `tabButtonActiveContentBorderWidth` | `--tabs-button-active-content-border-width` |
| `tabButtonActiveContentBorderStyle` | `--tabs-button-active-content-border-style` |
| `tabListBackgroundColor` | `--tabs-list-bg` |
| `tabsRowBorderColor` | `--tabs-row-border-color` |
| `tabsRowBorderWidth` | `--tabs-row-border-width` |
| `tabsRowBorderStyle` | `--tabs-row-border-style` |
| `tabsRowSpacing` | `--tabs-row-spacing` |
| `tabsButtonGap` | `--tabs-button-gap` |
| `tabListAlignment` | `--tabs-list-align` |
| `enableTabsListContentBorder` | `--tabs-enable-list-divider-border` |
| `tabsListContentBorderColor` | `--tabs-list-divider-border-color` |
| `tabsListContentBorderWidth` | `--tabs-list-divider-border-width` |
| `tabsListContentBorderStyle` | `--tabs-list-divider-border-style` |
| `panelBackgroundColor` | `--tabs-panel-bg` |
| `panelBorderColor` | `--tabs-panel-border-color` |
| `panelBorderWidth` | `--tabs-panel-border-width` |
| `panelBorderStyle` | `--tabs-panel-border-style` |
| `panelBorderRadius` | `--tabs-panel-border-radius` |
| `showIcon` | `--tabs-icon-display` |
| `iconRotation` | `--tabs-icon-animation-rotation` |
| `iconInactiveColor` | `--tabs-icon-color` |
| `iconInactiveRotation` | `--tabs-icon-initial-rotation` |
| `iconInactiveSize` | `--tabs-icon-size` |
| `iconInactiveMaxSize` | `--tabs-icon-max-size` |
| `iconInactiveOffsetX` | `--tabs-icon-offset-x` |
| `iconInactiveOffsetY` | `--tabs-icon-offset-y` |
| `iconActiveColor` | `--tabs-icon-is-open-color` |
| `iconActiveRotation` | `--tabs-icon-is-open-initial-rotation` |
| `iconActiveSize` | `--tabs-icon-is-open-size` |
| `iconActiveMaxSize` | `--tabs-icon-is-open-max-size` |
| `iconActiveOffsetX` | `--tabs-icon-is-open-offset-x` |
| `iconActiveOffsetY` | `--tabs-icon-is-open-offset-y` |

