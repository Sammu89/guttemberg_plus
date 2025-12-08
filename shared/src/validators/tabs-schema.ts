/**
 * Zod Validation Schema for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-08T23:16:16.040Z
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
  tabButtonColor: z.string(),
  tabButtonBackgroundColor: z.string(),
  tabButtonHoverColor: z.string(),
  tabButtonHoverBackgroundColor: z.string(),
  tabButtonActiveColor: z.string(),
  tabButtonActiveBackgroundColor: z.string(),
  tabButtonActiveBorderColor: z.string(),
  tabButtonActiveBorderBottomColor: z.string(),
  buttonBorderColor: z.string().optional(),
  buttonBorderWidth: z.number().optional(),
  buttonBorderStyle: z.string().optional(),
  buttonBorderRadius: z.record(z.any()),
  buttonShadow: z.string(),
  buttonShadowHover: z.string(),
  focusBorderColor: z.string(),
  focusBorderColorActive: z.string(),
  focusBorderWidth: z.number(),
  focusBorderStyle: z.string(),
  tabButtonFontSize: z.number(),
  tabButtonFontWeight: z.string(),
  tabButtonFontStyle: z.string(),
  tabButtonTextTransform: z.string(),
  tabButtonTextDecoration: z.string(),
  tabButtonTextAlign: z.string(),
  tabListBackgroundColor: z.string(),
  tabListAlignment: z.string(),
  panelBackgroundColor: z.string(),
  panelColor: z.string(),
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
  dividerBorderColor: z.string(),
  dividerBorderWidth: z.number(),
  dividerBorderStyle: z.string(),
});

/**
 * Validation schema for all Tabs block attributes
 */
export const tabsAttributesSchema = z.object({
  uniqueId: z.string(),
  blockId: z.string(),
  currentTheme: z.string(),
  tabs: z.array(z.any()),
  orientation: z.string(),
  activationMode: z.string(),
  headingLevel: z.string(),
  title: z.string(),
  verticalTabButtonTextAlign: z.string(),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconColor: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
  tabButtonColor: z.string(),
  tabButtonBackgroundColor: z.string(),
  tabButtonHoverColor: z.string(),
  tabButtonHoverBackgroundColor: z.string(),
  tabButtonActiveColor: z.string(),
  tabButtonActiveBackgroundColor: z.string(),
  tabButtonActiveBorderColor: z.string(),
  tabButtonActiveBorderBottomColor: z.string(),
  buttonBorderColor: z.string().optional(),
  buttonBorderWidth: z.number().optional(),
  buttonBorderStyle: z.string().optional(),
  buttonBorderRadius: z.record(z.any()),
  buttonShadow: z.string(),
  buttonShadowHover: z.string(),
  enableFocusBorder: z.boolean(),
  focusBorderColor: z.string(),
  focusBorderColorActive: z.string(),
  focusBorderWidth: z.number(),
  focusBorderStyle: z.string(),
  tabButtonFontSize: z.number(),
  tabButtonFontWeight: z.string(),
  tabButtonFontStyle: z.string(),
  tabButtonTextTransform: z.string(),
  tabButtonTextDecoration: z.string(),
  tabButtonTextAlign: z.string(),
  tabListBackgroundColor: z.string(),
  tabListAlignment: z.string(),
  panelBackgroundColor: z.string(),
  panelColor: z.string(),
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
  enableDividerBorder: z.boolean(),
  dividerBorderColor: z.string(),
  dividerBorderWidth: z.number(),
  dividerBorderStyle: z.string(),
});

// Type inference exports
export type TabsTheme = z.infer<typeof tabsThemeSchema>;
export type TabsAttributes = z.infer<typeof tabsAttributesSchema>;
