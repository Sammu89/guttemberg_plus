/**
 * Exclusion List for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-11-23T23:21:53.142Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Attributes excluded from theme customization checks for Table of Contents block
 * These attributes are not saved in themes and are not compared for customization detection
 */
export const TOC_EXCLUSIONS = [
  // structural attributes
  'tocId',
  'showTitle',
  'currentTheme',
  // content attributes
  'titleText',
  // behavioral attributes
  'filterMode',
  'includeLevels',
  'includeClasses',
  'excludeLevels',
  'excludeClasses',
  'depthLimit',
  'numberingStyle',
  'isCollapsible',
  'initiallyCollapsed',
  'positionType',
  'smoothScroll',
  'scrollOffset',
  'autoHighlight',
  'clickBehavior',
];

export default TOC_EXCLUSIONS;
