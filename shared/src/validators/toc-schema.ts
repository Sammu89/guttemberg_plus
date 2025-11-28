/**
 * Zod Validation Schema for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-11-28T01:29:49.191Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Validation schema for Table of Contents theme values
 */
export const tocThemeSchema = z.object({
  wrapperBackgroundColor: z.string(),
  blockBorderColor: z.string(),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  linkColor: z.string(),
  linkHoverColor: z.string(),
  linkActiveColor: z.string(),
  linkVisitedColor: z.string(),
  numberingColor: z.string(),
  level1Color: z.string(),
  level2Color: z.string(),
  level3PlusColor: z.string(),
  collapseIconColor: z.string(),
  titleFontSize: z.number(),
  titleFontWeight: z.string(),
  titleTextTransform: z.string().optional(),
  titleAlignment: z.string(),
  level1FontSize: z.number(),
  level1FontWeight: z.string(),
  level1FontStyle: z.string(),
  level1TextTransform: z.string(),
  level1TextDecoration: z.string(),
  level2FontSize: z.number(),
  level2FontWeight: z.string(),
  level2FontStyle: z.string(),
  level2TextTransform: z.string(),
  level2TextDecoration: z.string(),
  level3PlusFontSize: z.number(),
  level3PlusFontWeight: z.string(),
  level3PlusFontStyle: z.string(),
  level3PlusTextTransform: z.string(),
  level3PlusTextDecoration: z.string(),
  blockBorderWidth: z.number(),
  blockBorderStyle: z.string(),
  blockBorderRadius: z.record(z.any()),
  blockShadow: z.string(),
  blockShadowHover: z.string(),
  wrapperPadding: z.number(),
  listPaddingLeft: z.number().optional(),
  itemSpacing: z.number(),
  levelIndent: z.number(),
  positionTop: z.number(),
  zIndex: z.number(),
  collapseIconSize: z.number(),
});

/**
 * Validation schema for all Table of Contents block attributes
 */
export const tocAttributesSchema = z.object({
  tocId: z.string(),
  showTitle: z.boolean(),
  titleText: z.string(),
  currentTheme: z.string(),
  filterMode: z.string(),
  includeLevels: z.array(z.any()),
  includeClasses: z.string(),
  excludeLevels: z.array(z.any()),
  excludeClasses: z.string(),
  depthLimit: z.number().optional(),
  numberingStyle: z.string(),
  isCollapsible: z.boolean(),
  initiallyCollapsed: z.boolean(),
  positionType: z.string(),
  smoothScroll: z.boolean(),
  scrollOffset: z.number(),
  autoHighlight: z.boolean(),
  clickBehavior: z.string(),
  wrapperBackgroundColor: z.string(),
  blockBorderColor: z.string(),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  linkColor: z.string(),
  linkHoverColor: z.string(),
  linkActiveColor: z.string(),
  linkVisitedColor: z.string(),
  numberingColor: z.string(),
  level1Color: z.string(),
  level2Color: z.string(),
  level3PlusColor: z.string(),
  collapseIconColor: z.string(),
  titleFontSize: z.number(),
  titleFontWeight: z.string(),
  titleTextTransform: z.string().optional(),
  titleAlignment: z.string(),
  level1FontSize: z.number(),
  level1FontWeight: z.string(),
  level1FontStyle: z.string(),
  level1TextTransform: z.string(),
  level1TextDecoration: z.string(),
  level2FontSize: z.number(),
  level2FontWeight: z.string(),
  level2FontStyle: z.string(),
  level2TextTransform: z.string(),
  level2TextDecoration: z.string(),
  level3PlusFontSize: z.number(),
  level3PlusFontWeight: z.string(),
  level3PlusFontStyle: z.string(),
  level3PlusTextTransform: z.string(),
  level3PlusTextDecoration: z.string(),
  blockBorderWidth: z.number(),
  blockBorderStyle: z.string(),
  blockBorderRadius: z.record(z.any()),
  blockShadow: z.string(),
  blockShadowHover: z.string(),
  wrapperPadding: z.number(),
  listPaddingLeft: z.number().optional(),
  itemSpacing: z.number(),
  levelIndent: z.number(),
  positionTop: z.number(),
  zIndex: z.number(),
  collapseIconSize: z.number(),
});

// Type inference exports
export type TocTheme = z.infer<typeof tocThemeSchema>;
export type TocAttributes = z.infer<typeof tocAttributesSchema>;
