/**
 * Zod Validation Schema for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-22T19:13:33.379Z
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
  contentBackgroundColor: z.string(),
  borderColor: z.string(),
  dividerColor: z.string(),
  iconColor: z.string(),
  titleFontSize: z.number(),
  titleFontWeight: z.string(),
  titleFontStyle: z.string(),
  titleTextTransform: z.string(),
  titleTextDecoration: z.string(),
  titleAlignment: z.string(),
  borderWidth: z.number(),
  borderStyle: z.string(),
  borderRadius: z.record(z.any()),
  shadow: z.string(),
  shadowHover: z.string(),
  dividerWidth: z.number(),
  dividerStyle: z.string(),
  iconSize: z.number(),
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
  initiallyOpen: z.boolean(),
  accordionWidth: z.string(),
  accordionHorizontalAlign: z.string(),
  headingLevel: z.string(),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  hoverTitleColor: z.string(),
  hoverTitleBackgroundColor: z.string(),
  contentBackgroundColor: z.string(),
  borderColor: z.string(),
  dividerColor: z.string(),
  iconColor: z.string(),
  titleFontSize: z.number(),
  titleFontWeight: z.string(),
  titleFontStyle: z.string(),
  titleTextTransform: z.string(),
  titleTextDecoration: z.string(),
  titleAlignment: z.string(),
  borderWidth: z.number(),
  borderStyle: z.string(),
  borderRadius: z.record(z.any()),
  shadow: z.string(),
  shadowHover: z.string(),
  dividerWidth: z.number(),
  dividerStyle: z.string(),
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
