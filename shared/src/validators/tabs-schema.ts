/**
 * Zod Validation Schema for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-18T23:16:18.826Z
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
  iconColor: z.string(),
  iconSize: z.number(),
  iconRotation: z.number(),
  iconRotationActive: z.number(),
  tabButtonColor: z.string(),
  tabButtonBackgroundColor: z.string(),
  tabButtonHoverColor: z.string(),
  tabButtonHoverBackgroundColor: z.string(),
  tabButtonActiveColor: z.string(),
  tabButtonActiveBackgroundColor: z.string(),
  tabButtonActiveContentBorderWidth: z.number(),
  tabButtonActiveContentBorderStyle: z.string(),
  tabButtonActiveFontWeight: z.string(),
  tabButtonBorderColor: z.string(),
  tabButtonActiveBorderColor: z.string(),
  tabButtonActiveContentBorderColor: z.string(),
  tabButtonBorderWidth: z.number(),
  tabButtonBorderStyle: z.string(),
  tabButtonBorderRadius: z.record(z.any()),
  tabButtonShadow: z.string(),
  tabButtonShadowHover: z.string(),
  tabButtonFontSize: z.number(),
  tabButtonFontWeight: z.string(),
  tabButtonFontStyle: z.string(),
  tabButtonTextTransform: z.string(),
  tabButtonTextDecoration: z.string(),
  tabButtonTextAlign: z.string(),
  tabButtonPadding: z.number(),
  tabListBackgroundColor: z.string(),
  tabsRowBorderColor: z.string(),
  tabsRowBorderWidth: z.number(),
  tabsRowBorderStyle: z.string(),
  tabListAlignment: z.string(),
  tabsRowSpacing: z.number(),
  tabsButtonGap: z.number(),
  panelBackgroundColor: z.string(),
  panelBorderColor: z.string(),
  panelBorderWidth: z.number(),
  panelBorderStyle: z.string(),
  panelBorderRadius: z.record(z.any()),
  borderColor: z.string(),
  borderWidth: z.number(),
  borderStyle: z.string(),
  borderRadius: z.record(z.any()),
  shadow: z.string(),
  shadowHover: z.string(),
  tabsListContentBorderColor: z.string(),
  tabsListContentBorderWidth: z.number(),
  tabsListContentBorderStyle: z.string(),
});

/**
 * Validation schema for all Tabs block attributes
 */
export const tabsAttributesSchema = z.object({
  uniqueId: z.string(),
  blockId: z.string(),
  currentTheme: z.string(),
  tabs: z.array(z.any()),
  tabsData: z.array(z.any()),
  orientation: z.string(),
  activationMode: z.string(),
  headingLevel: z.string(),
  title: z.string(),
  verticalTabButtonTextAlign: z.string(),
  tabsHorizontalAlign: z.string(),
  tabsWidth: z.string(),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconColor: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
  iconRotationActive: z.number(),
  tabButtonColor: z.string(),
  tabButtonBackgroundColor: z.string(),
  tabButtonHoverColor: z.string(),
  tabButtonHoverBackgroundColor: z.string(),
  tabButtonActiveColor: z.string(),
  tabButtonActiveBackgroundColor: z.string(),
  enableFocusBorder: z.boolean(),
  tabButtonActiveContentBorderWidth: z.number(),
  tabButtonActiveContentBorderStyle: z.string(),
  tabButtonActiveFontWeight: z.string(),
  tabButtonBorderColor: z.string(),
  tabButtonActiveBorderColor: z.string(),
  tabButtonActiveContentBorderColor: z.string(),
  tabButtonBorderWidth: z.number(),
  tabButtonBorderStyle: z.string(),
  tabButtonBorderRadius: z.record(z.any()),
  tabButtonShadow: z.string(),
  tabButtonShadowHover: z.string(),
  tabButtonFontSize: z.number(),
  tabButtonFontWeight: z.string(),
  tabButtonFontStyle: z.string(),
  tabButtonTextTransform: z.string(),
  tabButtonTextDecoration: z.string(),
  tabButtonTextAlign: z.string(),
  tabButtonPadding: z.number(),
  tabListBackgroundColor: z.string(),
  tabsRowBorderColor: z.string(),
  tabsRowBorderWidth: z.number(),
  tabsRowBorderStyle: z.string(),
  tabListAlignment: z.string(),
  tabsRowSpacing: z.number(),
  tabsButtonGap: z.number(),
  panelBackgroundColor: z.string(),
  panelBorderColor: z.string(),
  panelBorderWidth: z.number(),
  panelBorderStyle: z.string(),
  panelBorderRadius: z.record(z.any()),
  borderColor: z.string(),
  borderWidth: z.number(),
  borderStyle: z.string(),
  borderRadius: z.record(z.any()),
  shadow: z.string(),
  shadowHover: z.string(),
  enableTabsListContentBorder: z.boolean(),
  tabsListContentBorderColor: z.string(),
  tabsListContentBorderWidth: z.number(),
  tabsListContentBorderStyle: z.string(),
});

// Type inference exports
export type TabsTheme = z.infer<typeof tabsThemeSchema>;
export type TabsAttributes = z.infer<typeof tabsAttributesSchema>;
