/**
 * Exclusion List for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-11-22T23:33:10.492Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Attributes excluded from theme customization checks for Accordion block
 * These attributes are not saved in themes and are not compared for customization detection
 */
export const ACCORDION_EXCLUSIONS = [
  // structural attributes
  'accordionId',
  'uniqueId',
  'blockId',
  'currentTheme',
  'customizations',
  'customizationCache',
  // content attributes
  'title',
  'content',
  // behavioral attributes
  'initiallyOpen',
  'allowMultipleOpen',
  'accordionWidth',
  'accordionHorizontalAlign',
  'headingLevel',
  'useHeadingStyles',
];

export default ACCORDION_EXCLUSIONS;
