/**
 * Block Attributes for Accordion
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-02T19:57:50.391Z
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
    default: {"top":0,"right":0,"bottom":0,"left":0,"unit":"px"},
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
    default: {"top":1,"right":1,"bottom":1,"left":1,"unit":"px"},
  },
  borderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4,"unit":"px"},
  },
  shadow: {
    type: 'array',
    default: [{"x":{"value":0,"unit":"px"},"y":{"value":8,"unit":"px"},"blur":{"value":24,"unit":"px"},"spread":{"value":0,"unit":"px"},"color":"rgba(0,0,0,0.15)","inset":false}],
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
    default: {"top":12,"right":16,"bottom":12,"left":16,"unit":"px"},
  },
  contentPadding: {
    type: 'object',
    default: {"top":16,"right":16,"bottom":16,"left":16,"unit":"px"},
  },
  blockMargin: {
    type: 'object',
    default: {"top":1,"right":0,"bottom":1,"left":0,"unit":"em"},
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
  titleNoLineBreak: {
    type: 'string',
    default: 'normal',
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
  useDifferentIcons: {
    type: 'boolean',
    default: false,
  },
  iconPosition: {
    type: 'string',
    default: 'right',
  },
  iconRotation: {
    type: 'string',
    default: '180deg',
  },
  iconInactiveSource: {
    type: 'object',
    default: {"kind":"char","value":"▾"},
  },
  iconInactiveColor: {
    type: 'string',
    default: '#333333',
  },
  iconInactiveSize: {
    type: 'string',
    default: '16px',
  },
  iconInactiveMaxSize: {
    type: 'string',
    default: '24px',
  },
  iconInactiveOffsetX: {
    type: 'string',
    default: '0px',
  },
  iconInactiveOffsetY: {
    type: 'string',
    default: '0px',
  },
  iconActiveSource: {
    type: 'object',
    default: {"kind":"char","value":"▾"},
  },
  iconActiveColor: {
    type: 'string',
    default: '#333333',
  },
  iconActiveSize: {
    type: 'string',
    default: '16px',
  },
  iconActiveMaxSize: {
    type: 'string',
    default: '24px',
  },
  iconActiveOffsetX: {
    type: 'string',
    default: '0px',
  },
  iconActiveOffsetY: {
    type: 'string',
    default: '0px',
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
    default: {"headerPadding":false,"contentPadding":false,"blockMargin":false,"contentFontSize":false,"titleFontSize":false,"titleOffsetX":false,"titleOffsetY":false,"iconInactiveSize":false,"iconInactiveMaxSize":false,"iconInactiveOffsetX":false,"iconInactiveOffsetY":false,"iconActiveSize":false,"iconActiveMaxSize":false,"iconActiveOffsetX":false,"iconActiveOffsetY":false,"accordionWidth":false},
  },
};

export default accordionAttributes;
