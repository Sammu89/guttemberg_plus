/**
 * Block Attributes for Accordion
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-26T00:11:13.636Z
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
  accordionWidth: {
    type: 'string',
    default: '100%',
  },
  headingLevel: {
    type: 'string',
    default: 'none',
  },
  accordionHorizontalAlign: {
    type: 'string',
    default: 'center',
  },
  initiallyOpen: {
    type: 'boolean',
    default: false,
  },
  borderWidth: {
    type: 'object',
    default: {"top":1,"right":1,"bottom":1,"left":1,"unit":"px"},
  },
  borderColor: {
    type: 'string',
    default: '#dddddd',
  },
  borderStyle: {
    type: 'string',
    default: 'solid',
  },
  borderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4,"unit":"px"},
  },
  headerPadding: {
    type: 'object',
    default: {"desktop":{"top":12,"right":16,"bottom":12,"left":16,"unit":"px"}},
  },
  contentPadding: {
    type: 'object',
    default: {"desktop":{"top":16,"right":16,"bottom":16,"left":16,"unit":"px"}},
  },
  blockMargin: {
    type: 'object',
    default: {"desktop":{"top":0,"right":0,"bottom":16,"left":0,"unit":"px"}},
  },
  shadow: {
    type: 'string',
    default: 'none',
  },
  dividerColor: {
    type: 'string',
    default: '#dddddd',
  },
  dividerStyle: {
    type: 'string',
    default: 'solid',
  },
  dividerWidth: {
    type: 'number',
    default: 0,
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
  activeTitleColor: {
    type: 'string',
    default: '#000000',
  },
  activeTitleBackgroundColor: {
    type: 'string',
    default: '#e8e8e8',
  },
  contentTextColor: {
    type: 'string',
    default: '#333333',
  },
  contentBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  titleFontFamily: {
    type: 'string',
    default: 'inherit',
  },
  titleFontSize: {
    type: 'object',
    default: {"desktop":1.125},
  },
  titleAppearance: {
    type: 'object',
    default: {"weight":"600","style":"normal"},
  },
  titleLetterSpacing: {
    type: 'object',
    default: {"desktop":0},
  },
  titleTextDecoration: {
    type: 'string',
    default: 'none',
  },
  titleTextTransform: {
    type: 'string',
    default: 'none',
  },
  titleLineHeight: {
    type: 'object',
    default: {"desktop":1.4},
  },
  titleAlignment: {
    type: 'string',
    default: 'left',
  },
  contentFontFamily: {
    type: 'string',
    default: 'inherit',
  },
  contentFontSize: {
    type: 'object',
    default: {"desktop":1},
  },
  contentLineHeight: {
    type: 'object',
    default: {"desktop":1.6},
  },
  showIcon: {
    type: 'boolean',
    default: true,
  },
  iconPosition: {
    type: 'string',
    default: 'right',
  },
  iconColor: {
    type: 'string',
    default: '#666666',
  },
  iconSize: {
    type: 'object',
    default: {"desktop":1.25},
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
    default: 180,
  },
  animationType: {
    type: 'string',
    default: 'slide',
  },
  animationDuration: {
    type: 'number',
    default: 300,
  },
  animationEasing: {
    type: 'string',
    default: 'ease',
  },
};

export default accordionAttributes;
