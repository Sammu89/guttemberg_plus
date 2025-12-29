/**
 * Block Attributes for Accordion
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-29T02:23:59.789Z
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
  dividerWidth: {
    type: 'object',
    default: {"top":"0px","right":"0px","bottom":"0px","left":"0px"},
  },
  dividerColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  dividerStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
  },
  borderWidth: {
    type: 'object',
    default: {"top":"1px","right":"1px","bottom":"1px","left":"1px"},
  },
  borderRadius: {
    type: 'object',
    default: {"topLeft":"4px","topRight":"4px","bottomRight":"4px","bottomLeft":"4px"},
  },
  shadow: {
    type: 'array',
    default: [{"x":"0px","y":"8px","blur":"24px","spread":"0px","color":"rgba(0,0,0,0.15)","inset":false}],
  },
  borderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  borderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
  },
  headerPadding: {
    type: 'object',
    default: {"top":"12px","right":"16px","bottom":"12px","left":"16px"},
  },
  contentPadding: {
    type: 'object',
    default: {"top":"16px","right":"16px","bottom":"16px","left":"16px"},
  },
  blockMargin: {
    type: 'object',
    default: {"top":"1em","right":"0em","bottom":"1em","left":"0em"},
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
  contentTextColor: {
    type: 'string',
    default: '#333333',
  },
  contentBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  contentFontFamily: {
    type: 'string',
    default: 'inherit',
  },
  contentFontSize: {
    type: 'string',
    default: '1rem',
  },
  contentLineHeight: {
    type: 'number',
    default: 1.6,
  },
  titleFontFamily: {
    type: 'string',
    default: 'inherit',
  },
  titleFontSize: {
    type: 'string',
    default: '1.125rem',
  },
  titleFormatting: {
    type: 'array',
    default: [],
  },
  titleFontWeight: {
    type: 'number',
    default: 400,
  },
  titleDecorationColor: {
    type: 'string',
    default: 'currentColor',
  },
  titleDecorationStyle: {
    type: 'string',
    default: 'solid',
  },
  titleDecorationWidth: {
    type: 'string',
    default: 'auto',
  },
  titleLetterSpacing: {
    type: 'string',
    default: '0em',
  },
  titleTextTransform: {
    type: 'string',
    default: 'none',
  },
  titleLineHeight: {
    type: 'number',
    default: 1.4,
  },
  titleAlignment: {
    type: 'string',
    default: 'left',
  },
  titleOffsetX: {
    type: 'string',
    default: '0px',
  },
  titleOffsetY: {
    type: 'string',
    default: '0px',
  },
  titleTextShadow: {
    type: 'array',
    default: [],
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
    type: 'string',
    default: '1.25rem',
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
    type: 'string',
    default: '180deg',
  },
  animationType: {
    type: 'string',
    default: 'slide',
  },
  animationDuration: {
    type: 'string',
    default: '300ms',
  },
  animationEasing: {
    type: 'string',
    default: 'ease',
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
  accordionId: {
    type: 'string',
    default: '',
  },
  blockId: {
    type: 'string',
    default: '',
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
  title: {
    type: 'string',
    default: 'Accordion Title',
  },
  uniqueId: {
    type: 'string',
    default: '',
  },
  // Auto-generated: tracks which responsive attributes have responsive mode enabled
  responsiveEnabled: {
    type: 'object',
    default: {"headerPadding":false,"contentPadding":false,"blockMargin":false,"contentFontSize":false,"titleFontSize":false,"titleOffsetX":false,"titleOffsetY":false,"iconPosition":false,"iconSize":false,"accordionWidth":false},
  },
};

export default accordionAttributes;
