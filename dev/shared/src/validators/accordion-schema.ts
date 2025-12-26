/**
 * Zod Validation Schema for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-26T22:38:19.341Z
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
  borderWidth: z.record(z.any()),
  borderColor: z.record(z.any()),
  borderStyle: z.record(z.any()),
  borderRadius: z.record(z.any()),
  headerPadding: z.record(z.any()),
  contentPadding: z.record(z.any()),
  blockMargin: z.record(z.any()),
  shadow: z.string(),
  dividerColor: z.string(),
  dividerStyle: z.string(),
  dividerWidth: z.number(),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  hoverTitleColor: z.string(),
  hoverTitleBackgroundColor: z.string(),
  activeTitleColor: z.string(),
  activeTitleBackgroundColor: z.string(),
  contentTextColor: z.string(),
  contentBackgroundColor: z.string(),
  titleFontFamily: z.string(),
  titleFontSize: z.number(),
  titleAppearance: z.record(z.any()),
  titleLetterSpacing: z.number(),
  titleTextDecoration: z.string(),
  titleTextTransform: z.string(),
  titleLineHeight: z.number(),
  titleAlignment: z.string(),
  contentFontFamily: z.string(),
  contentFontSize: z.number(),
  contentLineHeight: z.number(),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconColor: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
  animationType: z.string(),
  animationDuration: z.number(),
  animationEasing: z.string(),
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
  accordionWidth: z.string(),
  headingLevel: z.string(),
  accordionHorizontalAlign: z.string(),
  initiallyOpen: z.boolean(),
  borderWidth: z.record(z.any()),
  borderColor: z.record(z.any()),
  borderStyle: z.record(z.any()),
  borderRadius: z.record(z.any()),
  headerPadding: z.record(z.any()),
  contentPadding: z.record(z.any()),
  blockMargin: z.record(z.any()),
  shadow: z.string(),
  dividerColor: z.string(),
  dividerStyle: z.string(),
  dividerWidth: z.number(),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  hoverTitleColor: z.string(),
  hoverTitleBackgroundColor: z.string(),
  activeTitleColor: z.string(),
  activeTitleBackgroundColor: z.string(),
  contentTextColor: z.string(),
  contentBackgroundColor: z.string(),
  titleFontFamily: z.string(),
  titleFontSize: z.number(),
  titleAppearance: z.record(z.any()),
  titleLetterSpacing: z.number(),
  titleTextDecoration: z.string(),
  titleTextTransform: z.string(),
  titleLineHeight: z.number(),
  titleAlignment: z.string(),
  contentFontFamily: z.string(),
  contentFontSize: z.number(),
  contentLineHeight: z.number(),
  showIcon: z.boolean(),
  iconPosition: z.string(),
  iconColor: z.string(),
  iconSize: z.number(),
  iconTypeClosed: z.string(),
  iconTypeOpen: z.string(),
  iconRotation: z.number(),
  animationType: z.string(),
  animationDuration: z.number(),
  animationEasing: z.string(),
});

// Type inference exports
export type AccordionTheme = z.infer<typeof accordionThemeSchema>;
export type AccordionAttributes = z.infer<typeof accordionAttributesSchema>;
