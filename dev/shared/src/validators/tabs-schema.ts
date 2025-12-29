/**
 * Zod Validation Schema for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-29T02:23:59.799Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Validation schema for Tabs theme values
 */
export const tabsThemeSchema = z.object({
  borderColor: z.record(z.any()),
  borderWidth: z.number(),
  borderStyle: z.record(z.any()),
  borderRadius: z.record(z.any()),
  shadow: z.string(),
  shadowHover: z.string(),
  tabButtonColor: z.string(),
  tabButtonBackgroundColor: z.string(),
  tabButtonHoverColor: z.string(),
  tabButtonHoverBackgroundColor: z.string(),
  tabButtonActiveColor: z.string(),
  tabButtonActiveBackgroundColor: z.string(),
  tabButtonFontSize: z.number(),
  tabButtonFontWeight: z.string(),
  tabButtonFontStyle: z.string(),
  tabButtonTextTransform: z.string(),
  tabButtonTextDecoration: z.string(),
  tabButtonTextAlign: z.string(),
  tabButtonPadding: z.number(),
  tabButtonActiveFontWeight: z.string(),
  tabButtonBorderColor: z.record(z.any()),
  tabButtonActiveBorderColor: z.record(z.any()),
  tabButtonBorderWidth: z.number(),
  tabButtonBorderStyle: z.record(z.any()),
  tabButtonBorderRadius: z.record(z.any()),
  tabButtonShadow: z.string(),
  tabButtonShadowHover: z.string(),
  enableFocusBorder: z.boolean(),
  tabButtonActiveContentBorderColor: z.string(),
  tabButtonActiveContentBorderWidth: z.number(),
  tabButtonActiveContentBorderStyle: z.string(),
  tabListBackgroundColor: z.string(),
  tabsRowBorderColor: z.record(z.any()),
  tabsRowBorderWidth: z.number(),
  tabsRowBorderStyle: z.record(z.any()),
  tabsRowSpacing: z.number(),
  tabsButtonGap: z.number(),
  stretchButtonsToRow: z.boolean(),
  tabListAlignment: z.string(),
  enableTabsListContentBorder: z.boolean(),
  tabsListContentBorderColor: z.string(),
  tabsListContentBorderWidth: z.number(),
  tabsListContentBorderStyle: z.string(),
  panelBackgroundColor: z.string(),
  panelBorderColor: z.record(z.any()),
  panelBorderWidth: z.number(),
  panelBorderStyle: z.record(z.any()),
  panelBorderRadius: z.record(z.any()),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconColor: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
  iconRotationActive: z.number(),
});

/**
 * Validation schema for all Tabs block attributes
 */
export const tabsAttributesSchema = z.object({
  tabsWidth: z.string(),
  headingLevel: z.string(),
  tabsHorizontalAlign: z.string(),
  orientation: z.string(),
  activationMode: z.string(),
  title: z.string(),
  tabs: z.array(z.any()),
  tabsData: z.array(z.any()),
  currentTheme: z.string(),
  uniqueId: z.string(),
  blockId: z.string(),
  borderColor: z.record(z.any()),
  borderWidth: z.number(),
  borderStyle: z.record(z.any()),
  borderRadius: z.record(z.any()),
  shadow: z.string(),
  shadowHover: z.string(),
  tabButtonColor: z.string(),
  tabButtonBackgroundColor: z.string(),
  tabButtonHoverColor: z.string(),
  tabButtonHoverBackgroundColor: z.string(),
  tabButtonActiveColor: z.string(),
  tabButtonActiveBackgroundColor: z.string(),
  tabButtonFontSize: z.number(),
  tabButtonFontWeight: z.string(),
  tabButtonFontStyle: z.string(),
  tabButtonTextTransform: z.string(),
  tabButtonTextDecoration: z.string(),
  tabButtonTextAlign: z.string(),
  tabButtonPadding: z.number(),
  tabButtonActiveFontWeight: z.string(),
  tabButtonBorderColor: z.record(z.any()),
  tabButtonActiveBorderColor: z.record(z.any()),
  tabButtonBorderWidth: z.number(),
  tabButtonBorderStyle: z.record(z.any()),
  tabButtonBorderRadius: z.record(z.any()),
  tabButtonShadow: z.string(),
  tabButtonShadowHover: z.string(),
  enableFocusBorder: z.boolean(),
  tabButtonActiveContentBorderColor: z.string(),
  tabButtonActiveContentBorderWidth: z.number(),
  tabButtonActiveContentBorderStyle: z.string(),
  tabListBackgroundColor: z.string(),
  tabsRowBorderColor: z.record(z.any()),
  tabsRowBorderWidth: z.number(),
  tabsRowBorderStyle: z.record(z.any()),
  tabsRowSpacing: z.number(),
  tabsButtonGap: z.number(),
  stretchButtonsToRow: z.boolean(),
  tabListAlignment: z.string(),
  enableTabsListContentBorder: z.boolean(),
  tabsListContentBorderColor: z.string(),
  tabsListContentBorderWidth: z.number(),
  tabsListContentBorderStyle: z.string(),
  panelBackgroundColor: z.string(),
  panelBorderColor: z.record(z.any()),
  panelBorderWidth: z.number(),
  panelBorderStyle: z.record(z.any()),
  panelBorderRadius: z.record(z.any()),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconColor: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
  iconRotationActive: z.number(),
});

// Type inference exports
export type TabsTheme = z.infer<typeof tabsThemeSchema>;
export type TabsAttributes = z.infer<typeof tabsAttributesSchema>;
