# Tabs Block Attributes

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: `schemas/tabs.json`
> Generated at: 2025-11-22T15:43:23.196Z
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: `npm run schema:build`

---

## Overview

Complete theme and appearance configuration for Tabs blocks

- **Block Type:** `tabs`
- **Version:** 1.0.0

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
| `currentTab` | number | `0` | No (behavioral) | Index of currently active tab (0-based) |
| `responsiveBreakpoint` | number | `768` | No (behavioral) | Width in pixels below which to show accordion fallback |
| `enableResponsiveFallback` | boolean | `true` | No (behavioral) | Convert to accordion on small screens |
| `headingLevel` | string | `none` | No (behavioral) | Semantic HTML heading level (none, h1-h6) |
| `useHeadingStyles` | boolean | `false` | No (behavioral) | Apply default heading styles |
| `initiallyOpen` | boolean | `false` | No (behavioral) | Whether first tab is open on load |
| `title` | string | `Accordion Title` | No (content) | Block title (for accessibility) |
| `content` | string | `` | No (content) | Block content |
| `accordionId` | string | `` | No (structural) | ID for accordion fallback mode |

## Colors

Text and background colors for tabs, panels, and states

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleColor` | string | `#666666` | Yes | Text color for inactive tab buttons |
| `titleBackgroundColor` | string | `transparent` | Yes | Background color for inactive tab buttons |
| `hoverTitleColor` | string | `#333333` | Yes | Text color when hovering over tab |
| `hoverTitleBackgroundColor` | string | `#e8e8e8` | Yes | Background color when hovering over tab |
| `activeTitleColor` | string | _null_ | Yes | Text color for active tab |
| `activeTitleBackgroundColor` | string | _null_ | Yes | Background color for active tab |
| `tabButtonActiveColor` | string | `#000000` | Yes | Text color for the active tab button |
| `tabButtonActiveBackground` | string | `#ffffff` | Yes | Background color for the active tab button |
| `tabButtonActiveBorderColor` | string | `#dddddd` | Yes | Border color for the active tab |
| `tabButtonActiveBorderBottomColor` | string | `transparent` | Yes | Bottom border color for active tab (creates connected effect) |
| `contentColor` | string | _null_ | Yes | Text color for content area |
| `contentBackgroundColor` | string | _null_ | Yes | Background color for content area |
| `panelBackground` | string | `#ffffff` | Yes | Background color for tab panels |
| `panelColor` | string | `#333333` | Yes | Text color for tab panels |
| `tabListBackground` | string | `#f5f5f5` | Yes | Background color for the tab navigation bar |
| `tabBorderColor` | string | _null_ | Yes | Border color for individual tabs |
| `containerBorderColor` | string | `transparent` | Yes | Border color for tabs container |
| `panelBorderColor` | string | `#dddddd` | Yes | Border color for tab panels |
| `tabListBorderBottomColor` | string | `#dddddd` | Yes | Bottom border color of tab navigation |
| `dividerColor` | string | _null_ | Yes | Color of divider between tabs and panel |
| `borderColor` | string | _null_ | Yes | General border color |
| `accordionBorderColor` | string | _null_ | Yes | Border color for accordion fallback mode |
| `dividerBorderColor` | string | _null_ | Yes | Border color for divider |

## Icons

Icon appearance settings

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `iconColor` | string | `inherit` | Yes | Color of tab icons |
| `showIcon` | boolean | `true` | Yes | Display icons in tab buttons |
| `iconPosition` | string | `right` | Yes | Position of icon relative to text |
| `iconSize` | number | `18` | Yes | Size of tab icons in pixels |
| `iconTypeClosed` | string | `▾` | Yes | Icon for closed state (accordion fallback) |
| `iconTypeOpen` | string | `none` | Yes | Icon for open state (accordion fallback) |
| `iconRotation` | number | `180` | Yes | Rotation angle when open (degrees) |

## Typography

Font settings for tab buttons and panel content

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titleFontSize` | number | `16` | Yes | Font size for tab buttons in pixels |
| `titleFontWeight` | string | `500` | Yes | Font weight for tab buttons |
| `titleFontFamily` | string | _null_ | Yes | Font family for tab buttons |
| `titleLineHeight` | number | _null_ | Yes | Line height for tab buttons |
| `titleFontStyle` | string | `normal` | Yes | Font style for tab buttons |
| `titleTextTransform` | string | `none` | Yes | Text transformation for tab buttons |
| `titleTextDecoration` | string | `none` | Yes | Text decoration for tab buttons |
| `titleAlignment` | string | `center` | Yes | Text alignment for tab buttons |
| `contentFontSize` | number | _null_ | Yes | Font size for panel content in pixels |
| `contentFontWeight` | string | _null_ | Yes | Font weight for panel content |
| `contentFontFamily` | string | _null_ | Yes | Font family for panel content |
| `contentLineHeight` | number | _null_ | Yes | Line height for panel content |
| `contentFontStyle` | string | _null_ | Yes | Font style for panel content |
| `contentTextTransform` | string | _null_ | Yes | Text transformation for panel content |
| `contentTextDecoration` | string | _null_ | Yes | Text decoration for panel content |
| `panelFontSize` | number | `16` | Yes | Font size for panel content |
| `panelLineHeight` | number | `1.6` | Yes | Line height for panel content |
| `verticalTabButtonTextAlign` | string | `left` | Yes | Text alignment for vertical tabs |

## Borders

Border styles, widths, radius, and shadow

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `tabBorderThickness` | number | _null_ | Yes | Border width for individual tabs |
| `tabBorderStyle` | string | _null_ | Yes | Border style for individual tabs |
| `tabBorderRadius` | object | _object_ | Yes | Corner radius for individual tabs |
| `tabShadow` | string | _null_ | Yes | Box shadow for tab buttons |
| `tabButtonBorderRadius` | object | _null_ | Yes | Per-corner border radius for tab buttons |
| `containerBorderWidth` | number | `0` | Yes | Border width for the tabs container |
| `containerBorderStyle` | string | `solid` | Yes | Border style for the tabs container |
| `containerBorderRadius` | object | _object_ | Yes | Corner radius for the tabs container |
| `containerShadow` | string | `none` | Yes | Box shadow for the tabs container |
| `panelBorderWidth` | number | `1` | Yes | Border width for tab panels |
| `panelBorderStyle` | string | `solid` | Yes | Border style for tab panels |
| `panelBorderRadius` | number | `0` | Yes | Corner radius for tab panels |
| `tabListBorderBottomWidth` | number | `2` | Yes | Bottom border width of tab navigation |
| `tabListBorderBottomStyle` | string | `solid` | Yes | Bottom border style of tab navigation |
| `dividerThickness` | number | _null_ | Yes | Thickness of divider between tabs and panel |
| `dividerStyle` | string | _null_ | Yes | Style of divider between tabs and panel |
| `accordionBorderThickness` | number | _null_ | Yes | Border width for accordion fallback mode |
| `accordionBorderStyle` | string | _null_ | Yes | Border style for accordion fallback mode |
| `accordionBorderRadius` | object | _null_ | Yes | Border radius for accordion fallback mode |
| `accordionShadow` | string | _null_ | Yes | Box shadow for accordion fallback mode |
| `borderWidth` | string | _null_ | Yes | Generic border width |
| `borderRadius` | string | _null_ | Yes | Generic border radius |
| `dividerBorderThickness` | number | _null_ | Yes | Thickness of divider border |
| `dividerBorderStyle` | string | _null_ | Yes | Style of divider border |

## Layout

Spacing, padding, sizing, and alignment

| Attribute | Type | Default | Themeable | Description |
|-----------|------|---------|-----------|-------------|
| `titlePadding` | object | _object_ | Yes | Padding inside tab buttons |
| `contentPadding` | object | _null_ | Yes | Padding inside content area |
| `panelPadding` | object | _object_ | Yes | Padding inside tab panels |
| `tabListPadding` | object | _object_ | Yes | Padding around the tab navigation |
| `tabListGap` | number | `4` | Yes | Space between tab buttons |
| `tabsAlignment` | string | `left` | Yes | Horizontal alignment of tabs |
| `verticalTabListWidth` | number | `200` | Yes | Width of tab list in vertical orientation |
| `accordionMarginBottom` | number | _null_ | Yes | Space below the tabs container |
| `itemSpacing` | number | _null_ | Yes | Spacing between items |

## CSS Variables

The following CSS custom properties are available for theming:

| Attribute | CSS Variable |
|-----------|-------------|
| `titleColor` | `--tab-button-color` |
| `titleBackgroundColor` | `--tab-button-bg` |
| `hoverTitleColor` | `--tab-button-hover-color` |
| `hoverTitleBackgroundColor` | `--tab-button-hover-bg` |
| `activeTitleColor` | `--tab-button-active-color` |
| `activeTitleBackgroundColor` | `--tab-button-active-bg` |
| `tabButtonActiveColor` | `--tab-button-active-color` |
| `tabButtonActiveBackground` | `--tab-button-active-bg` |
| `tabButtonActiveBorderColor` | `--tab-button-active-border-color` |
| `tabButtonActiveBorderBottomColor` | `--tab-button-active-border-bottom-color` |
| `contentColor` | `--panel-color` |
| `contentBackgroundColor` | `--panel-bg` |
| `panelBackground` | `--panel-bg` |
| `panelColor` | `--panel-color` |
| `tabListBackground` | `--tabs-list-bg` |
| `tabBorderColor` | `--tab-button-border-color` |
| `containerBorderColor` | `--tabs-container-border-color` |
| `panelBorderColor` | `--panel-border-color` |
| `tabListBorderBottomColor` | `--tabs-list-border-bottom-color` |
| `dividerColor` | `--divider-color` |
| `borderColor` | `--tabs-border-color` |
| `accordionBorderColor` | `--tabs-border-color` |
| `dividerBorderColor` | `--divider-border-color` |
| `iconColor` | `--icon-color` |
| `titleFontSize` | `--tab-button-font-size` |
| `titleFontWeight` | `--tab-button-font-weight` |
| `titleFontFamily` | `--tab-button-font-family` |
| `titleLineHeight` | `--tab-button-line-height` |
| `titleFontStyle` | `--tab-button-font-style` |
| `titleTextTransform` | `--tab-button-text-transform` |
| `titleTextDecoration` | `--tab-button-text-decoration` |
| `titleAlignment` | `--tab-button-text-align` |
| `contentFontSize` | `--panel-font-size` |
| `contentFontWeight` | `--panel-font-weight` |
| `contentFontFamily` | `--panel-font-family` |
| `contentLineHeight` | `--panel-line-height` |
| `contentFontStyle` | `--panel-font-style` |
| `contentTextTransform` | `--panel-text-transform` |
| `contentTextDecoration` | `--panel-text-decoration` |
| `panelFontSize` | `--panel-font-size` |
| `panelLineHeight` | `--panel-line-height` |
| `verticalTabButtonTextAlign` | `--vertical-tab-button-text-align` |
| `tabBorderThickness` | `--tab-button-border-width` |
| `tabBorderStyle` | `--tab-button-border-style` |
| `tabBorderRadius` | `--tab-button-border-radius` |
| `tabShadow` | `--tab-button-shadow` |
| `tabButtonBorderRadius` | `--tab-button-border-radius` |
| `containerBorderWidth` | `--tabs-container-border-width` |
| `containerBorderStyle` | `--tabs-container-border-style` |
| `containerBorderRadius` | `--tabs-container-border-radius` |
| `containerShadow` | `--tabs-container-shadow` |
| `panelBorderWidth` | `--panel-border-width` |
| `panelBorderStyle` | `--panel-border-style` |
| `panelBorderRadius` | `--panel-border-radius` |
| `tabListBorderBottomWidth` | `--tabs-list-border-bottom-width` |
| `tabListBorderBottomStyle` | `--tabs-list-border-bottom-style` |
| `dividerThickness` | `--divider-thickness` |
| `dividerStyle` | `--divider-style` |
| `accordionBorderThickness` | `--tabs-border-width` |
| `accordionBorderStyle` | `--tabs-border-style` |
| `accordionBorderRadius` | `--tabs-border-radius` |
| `accordionShadow` | `--tabs-shadow` |
| `borderWidth` | `--tabs-border-width` |
| `borderRadius` | `--tabs-border-radius` |
| `dividerBorderThickness` | `--divider-border-thickness` |
| `dividerBorderStyle` | `--divider-border-style` |
| `titlePadding` | `--tab-button-padding` |
| `contentPadding` | `--panel-padding` |
| `panelPadding` | `--panel-padding` |
| `tabListPadding` | `--tabs-list-padding` |
| `tabListGap` | `--tabs-list-gap` |
| `tabsAlignment` | `--tabs-alignment` |
| `verticalTabListWidth` | `--vertical-tab-list-width` |
| `accordionMarginBottom` | `--tabs-margin-bottom` |
| `itemSpacing` | `--tabs-item-spacing` |
| `iconSize` | `--icon-size` |
| `iconRotation` | `--icon-rotation` |

