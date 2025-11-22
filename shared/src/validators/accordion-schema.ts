/**
 * Zod Validation Schema for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-11-22T23:36:53.040Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Validation schema for Accordion theme values
 */
export const accordionThemeSchema = z.object({
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  hoverTitleColor: z.string(),
  hoverTitleBackgroundColor: z.string(),
  activeTitleColor: z.string(),
  activeTitleBackgroundColor: z.string(),
  contentColor: z.string(),
  contentBackgroundColor: z.string(),
  borderColor: z.string(),
  accordionBorderColor: z.string(),
  dividerBorderColor: z.string(),
  iconColor: z.string(),
  titleFontSize: z.number(),
  titleFontWeight: z.string(),
  titleFontFamily: z.string().optional(),
  titleLineHeight: z.number().optional(),
  titleFontStyle: z.string(),
  titleTextTransform: z.string(),
  titleTextDecoration: z.string(),
  titleAlignment: z.string(),
  contentFontSize: z.number(),
  contentFontWeight: z.string().optional(),
  contentFontFamily: z.string().optional(),
  contentLineHeight: z.number(),
  contentFontStyle: z.string().optional(),
  contentTextTransform: z.string().optional(),
  contentTextDecoration: z.string().optional(),
  accordionBorderThickness: z.number(),
  accordionBorderStyle: z.string(),
  accordionBorderRadius: z.record(z.any()),
  borderWidth: z.string().optional(),
  borderRadius: z.string().optional(),
  accordionShadow: z.string(),
  dividerBorderThickness: z.number(),
  dividerBorderStyle: z.string(),
  titlePadding: z.record(z.any()),
  contentPadding: z.record(z.any()),
  accordionMarginBottom: z.number(),
  itemSpacing: z.number().optional(),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
});

/**
 * Validation schema for all Accordion block attributes
 */
export const accordionAttributesSchema = z.object({
  accordionId: z.string(),
  uniqueId: z.string(),
  blockId: z.string(),
  title: z.string(),
  content: z.string(),
  currentTheme: z.string(),
  customizations: z.record(z.any()),
  customizationCache: z.record(z.any()),
  initiallyOpen: z.boolean(),
  allowMultipleOpen: z.boolean(),
  accordionWidth: z.string(),
  accordionHorizontalAlign: z.string(),
  headingLevel: z.string(),
  useHeadingStyles: z.boolean(),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  hoverTitleColor: z.string(),
  hoverTitleBackgroundColor: z.string(),
  activeTitleColor: z.string(),
  activeTitleBackgroundColor: z.string(),
  contentColor: z.string(),
  contentBackgroundColor: z.string(),
  borderColor: z.string(),
  accordionBorderColor: z.string(),
  dividerBorderColor: z.string(),
  iconColor: z.string(),
  titleFontSize: z.number(),
  titleFontWeight: z.string(),
  titleFontFamily: z.string().optional(),
  titleLineHeight: z.number().optional(),
  titleFontStyle: z.string(),
  titleTextTransform: z.string(),
  titleTextDecoration: z.string(),
  titleAlignment: z.string(),
  contentFontSize: z.number(),
  contentFontWeight: z.string().optional(),
  contentFontFamily: z.string().optional(),
  contentLineHeight: z.number(),
  contentFontStyle: z.string().optional(),
  contentTextTransform: z.string().optional(),
  contentTextDecoration: z.string().optional(),
  accordionBorderThickness: z.number(),
  accordionBorderStyle: z.string(),
  accordionBorderRadius: z.record(z.any()),
  borderWidth: z.string().optional(),
  borderRadius: z.string().optional(),
  accordionShadow: z.string(),
  dividerBorderThickness: z.number(),
  dividerBorderStyle: z.string(),
  titlePadding: z.record(z.any()),
  contentPadding: z.record(z.any()),
  accordionMarginBottom: z.number(),
  itemSpacing: z.number().optional(),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
});

// Type inference exports
export type AccordionTheme = z.infer<typeof accordionThemeSchema>;
export type AccordionAttributes = z.infer<typeof accordionAttributesSchema>;
