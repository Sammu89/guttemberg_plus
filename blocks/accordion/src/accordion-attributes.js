/**
 * Block Attributes for Accordion
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-11-26T10:20:04.888Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Block Attributes for Accordion
 *
 * These attributes define the block's data structure for WordPress.
 * Auto-generated from schema - DO NOT edit manually.
 */
export const accordionAttributes = {
  accordionId: {
    type: 'string',
    default: '',
  },
  uniqueId: {
    type: 'string',
    default: '',
  },
  blockId: {
    type: 'string',
    default: '',
  },
  title: {
    type: 'string',
    default: 'Accordion Title',
  },
  content: {
    type: 'string',
    default: '',
  },
  currentTheme: {
    type: 'string',
    default: '',
  },
  customizations: {
    type: 'object',
    default: {},
  },
  customizationCache: {
    type: 'object',
    default: {},
  },
  initiallyOpen: {
    type: 'boolean',
    default: false,
  },
  allowMultipleOpen: {
    type: 'boolean',
    default: false,
  },
  accordionWidth: {
    type: 'string',
    default: '100%',
  },
  accordionHorizontalAlign: {
    type: 'string',
    default: 'left',
  },
  headingLevel: {
    type: 'string',
    default: 'none',
  },
  useHeadingStyles: {
    type: 'boolean',
    default: false,
  },
  titleColor: {
    type: 'string',
    default: '#333333',
  },
  titleBackgroundColor: {
    type: 'string',
    default: '#f5f5f5',
  },
  hoverTitleColor: {
    type: 'string',
    default: '#000000',
  },
  hoverTitleBackgroundColor: {
    type: 'string',
    default: '#e8e8e8',
  },
  contentColor: {
    type: 'string',
    default: '#333333',
  },
  contentBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  borderColor: {
    type: 'string',
    default: '#dddddd',
  },
  dividerColor: {
    type: 'string',
    default: '#dddddd',
  },
  iconColor: {
    type: 'string',
    default: '#666666',
  },
  titleFontSize: {
    type: 'number',
    default: '18px',
  },
  titleFontWeight: {
    type: 'string',
    default: '600',
  },
  titleFontFamily: {
    type: 'string',
    default: null,
  },
  titleLineHeight: {
    type: 'number',
    default: null,
  },
  titleFontStyle: {
    type: 'string',
    default: 'normal',
  },
  titleTextTransform: {
    type: 'string',
    default: 'none',
  },
  titleTextDecoration: {
    type: 'string',
    default: 'none',
  },
  titleAlignment: {
    type: 'string',
    default: 'left',
  },
  contentFontSize: {
    type: 'number',
    default: '16px',
  },
  contentFontWeight: {
    type: 'string',
    default: null,
  },
  contentFontFamily: {
    type: 'string',
    default: null,
  },
  contentLineHeight: {
    type: 'number',
    default: 1.6,
  },
  contentFontStyle: {
    type: 'string',
    default: null,
  },
  contentTextTransform: {
    type: 'string',
    default: null,
  },
  contentTextDecoration: {
    type: 'string',
    default: null,
  },
  borderWidth: {
    type: 'number',
    default: '1px',
  },
  borderStyle: {
    type: 'string',
    default: 'solid',
  },
  borderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
  },
  shadow: {
    type: 'string',
    default: 'none',
  },
  shadowHover: {
    type: 'string',
    default: 'none',
  },
  dividerWidth: {
    type: 'number',
    default: '0px',
  },
  dividerStyle: {
    type: 'string',
    default: 'solid',
  },
  titlePadding: {
    type: 'object',
    default: {"top":16,"right":16,"bottom":16,"left":16},
  },
  contentPadding: {
    type: 'object',
    default: {"top":16,"right":16,"bottom":16,"left":16},
  },
  accordionMarginBottom: {
    type: 'number',
    default: '8px',
  },
  itemSpacing: {
    type: 'number',
    default: null,
  },
  showIcon: {
    type: 'boolean',
    default: true,
  },
  iconPosition: {
    type: 'string',
    default: 'right',
  },
  iconSize: {
    type: 'number',
    default: '20px',
  },
  iconTypeClosed: {
    type: 'string',
    default: '▾',
  },
  iconTypeOpen: {
    type: 'string',
    default: 'none',
  },
  iconRotation: {
    type: 'number',
    default: '180deg',
  },
};

export default accordionAttributes;
