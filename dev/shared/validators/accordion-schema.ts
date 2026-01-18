/**
 * Zod Validation Schema for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-18T11:42:00.925Z
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
  dividerBorder: z.any(),
  blockBox: z.any(),
  headerBox: z.any(),
  contentBox: z.any(),
  titleFontFamily: z.string(),
  titleFontSize: z.string(),
  titleFormatting: z.array(z.any()),
  titleNoLineBreak: z.string(),
  titleFontWeight: z.string(),
  titleDecorationColor: z.string(),
  titleDecorationStyle: z.string(),
  titleDecorationWidth: z.string(),
  titleLetterSpacing: z.string(),
  titleTextTransform: z.string(),
  titleTextDecoration: z.string(),
  titleLineHeight: z.string(),
  titleOffsetX: z.string(),
  titleOffsetY: z.string(),
  titleAlignment: z.string(),
  showIcon: z.boolean(),
  useDifferentIcons: z.boolean(),
  iconPosition: z.string(),
  iconRotation: z.string(),
  iconInactiveSource: z.record(z.any()),
  iconInactiveColor: z.string(),
  iconInactiveRotation: z.string(),
  iconInactiveSize: z.string(),
  iconInactiveMaxSize: z.string(),
  iconInactiveOffsetX: z.string(),
  iconInactiveOffsetY: z.string(),
  iconActiveSource: z.record(z.any()),
  iconActiveColor: z.string(),
  iconActiveRotation: z.string(),
  iconActiveSize: z.string(),
  iconActiveMaxSize: z.string(),
  iconActiveOffsetX: z.string(),
  iconActiveOffsetY: z.string(),
  animationType: z.string(),
  animationDuration: z.string(),
});

/**
 * Validation schema for all Accordion block attributes
 */
export const accordionAttributesSchema = z.object({
  dividerBorder: z.any(),
  blockBox: z.any(),
  headerBox: z.any(),
  contentBox: z.any(),
  titleColor: z.any(),
  contentColor: z.any(),
  contentTypography: z.any(),
  titleFontFamily: z.string(),
  titleFontSize: z.string(),
  titleFormatting: z.array(z.any()),
  titleNoLineBreak: z.string(),
  titleFontWeight: z.string(),
  titleDecorationColor: z.string(),
  titleDecorationStyle: z.string(),
  titleDecorationWidth: z.string(),
  titleLetterSpacing: z.string(),
  titleTextTransform: z.string(),
  titleTextDecoration: z.string(),
  titleLineHeight: z.string(),
  titleOffsetX: z.string(),
  titleOffsetY: z.string(),
  titleAlignment: z.string(),
  showIcon: z.boolean(),
  useDifferentIcons: z.boolean(),
  iconPosition: z.string(),
  iconRotation: z.string(),
  iconInactiveSource: z.record(z.any()),
  iconInactiveColor: z.string(),
  iconInactiveRotation: z.string(),
  iconInactiveSize: z.string(),
  iconInactiveMaxSize: z.string(),
  iconInactiveOffsetX: z.string(),
  iconInactiveOffsetY: z.string(),
  iconActiveSource: z.record(z.any()),
  iconActiveColor: z.string(),
  iconActiveRotation: z.string(),
  iconActiveSize: z.string(),
  iconActiveMaxSize: z.string(),
  iconActiveOffsetX: z.string(),
  iconActiveOffsetY: z.string(),
  animationType: z.string(),
  animationDuration: z.string(),
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
