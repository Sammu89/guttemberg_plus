/**
 * Zod Validation Schema for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-02T19:57:50.387Z
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
  dividerWidth: z.record(z.any()),
  dividerColor: z.record(z.any()),
  dividerStyle: z.record(z.any()),
  borderWidth: z.record(z.any()),
  borderRadius: z.record(z.any()),
  shadow: z.array(z.any()),
  borderColor: z.record(z.any()),
  borderStyle: z.record(z.any()),
  headerPadding: z.record(z.any()),
  contentPadding: z.record(z.any()),
  blockMargin: z.record(z.any()),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  hoverTitleColor: z.string(),
  hoverTitleBackgroundColor: z.string(),
  contentTextColor: z.string(),
  contentBackgroundColor: z.string(),
  contentFontFamily: z.string(),
  contentFontSize: z.string(),
  contentLineHeight: z.number(),
  titleFontFamily: z.string(),
  titleFontSize: z.string(),
  titleFormatting: z.array(z.any()),
  titleNoLineBreak: z.string(),
  titleFontWeight: z.number(),
  titleDecorationColor: z.string(),
  titleDecorationStyle: z.string(),
  titleDecorationWidth: z.string(),
  titleLetterSpacing: z.string(),
  titleTextTransform: z.string(),
  titleLineHeight: z.number(),
  titleAlignment: z.string(),
  titleOffsetX: z.string(),
  titleOffsetY: z.string(),
  titleTextShadow: z.array(z.any()),
  showIcon: z.boolean(),
  useDifferentIcons: z.boolean(),
  iconPosition: z.string(),
  iconRotation: z.string(),
  iconInactiveSource: z.record(z.any()),
  iconInactiveColor: z.string(),
  iconInactiveSize: z.string(),
  iconInactiveMaxSize: z.string(),
  iconInactiveOffsetX: z.string(),
  iconInactiveOffsetY: z.string(),
  iconActiveSource: z.record(z.any()),
  iconActiveColor: z.string(),
  iconActiveSize: z.string(),
  iconActiveMaxSize: z.string(),
  iconActiveOffsetX: z.string(),
  iconActiveOffsetY: z.string(),
  animationType: z.string(),
  animationDuration: z.string(),
  animationEasing: z.string(),
});

/**
 * Validation schema for all Accordion block attributes
 */
export const accordionAttributesSchema = z.object({
  dividerWidth: z.record(z.any()),
  dividerColor: z.record(z.any()),
  dividerStyle: z.record(z.any()),
  borderWidth: z.record(z.any()),
  borderRadius: z.record(z.any()),
  shadow: z.array(z.any()),
  borderColor: z.record(z.any()),
  borderStyle: z.record(z.any()),
  headerPadding: z.record(z.any()),
  contentPadding: z.record(z.any()),
  blockMargin: z.record(z.any()),
  titleColor: z.string(),
  titleBackgroundColor: z.string(),
  hoverTitleColor: z.string(),
  hoverTitleBackgroundColor: z.string(),
  contentTextColor: z.string(),
  contentBackgroundColor: z.string(),
  contentFontFamily: z.string(),
  contentFontSize: z.string(),
  contentLineHeight: z.number(),
  titleFontFamily: z.string(),
  titleFontSize: z.string(),
  titleFormatting: z.array(z.any()),
  titleNoLineBreak: z.string(),
  titleFontWeight: z.number(),
  titleDecorationColor: z.string(),
  titleDecorationStyle: z.string(),
  titleDecorationWidth: z.string(),
  titleLetterSpacing: z.string(),
  titleTextTransform: z.string(),
  titleLineHeight: z.number(),
  titleAlignment: z.string(),
  titleOffsetX: z.string(),
  titleOffsetY: z.string(),
  titleTextShadow: z.array(z.any()),
  showIcon: z.boolean(),
  useDifferentIcons: z.boolean(),
  iconPosition: z.string(),
  iconRotation: z.string(),
  iconInactiveSource: z.record(z.any()),
  iconInactiveColor: z.string(),
  iconInactiveSize: z.string(),
  iconInactiveMaxSize: z.string(),
  iconInactiveOffsetX: z.string(),
  iconInactiveOffsetY: z.string(),
  iconActiveSource: z.record(z.any()),
  iconActiveColor: z.string(),
  iconActiveSize: z.string(),
  iconActiveMaxSize: z.string(),
  iconActiveOffsetX: z.string(),
  iconActiveOffsetY: z.string(),
  animationType: z.string(),
  animationDuration: z.string(),
  animationEasing: z.string(),
  accordionWidth: z.string(),
  headingLevel: z.string(),
  accordionHorizontalAlign: z.string(),
  initiallyOpen: z.boolean(),
  accordionId: z.string(),
  blockId: z.string(),
  content: z.string(),
  currentTheme: z.string(),
  customizations: z.record(z.any()),
  title: z.string(),
  uniqueId: z.string(),
});

// Type inference exports
export type AccordionTheme = z.infer<typeof accordionThemeSchema>;
export type AccordionAttributes = z.infer<typeof accordionAttributesSchema>;
