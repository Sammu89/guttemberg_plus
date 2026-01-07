/**
 * Block Attributes for Accordion
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-07T22:55:13.419Z
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
  dividerBorder: {
    type: 'string',
    default: {"width":{"top":0,"unit":"px"},"color":{"top":"#dddddd"},"style":{"top":"solid"}},
  },
  blockBox: {
    type: 'string',
    default: {"border":{"width":{"top":1,"right":1,"bottom":1,"left":1,"unit":"px"},"color":{"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"},"style":{"top":"solid","right":"solid","bottom":"solid","left":"solid"}},"radius":{"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4,"unit":"px"},"shadow":[{"x":{"value":0,"unit":"px"},"y":{"value":8,"unit":"px"},"blur":{"value":24,"unit":"px"},"spread":{"value":0,"unit":"px"},"color":"rgba(0,0,0,0.15)","inset":false}],"margin":{"top":1,"right":0,"bottom":1,"left":0,"unit":"em"}},
  },
  headerBox: {
    type: 'string',
    default: {"padding":{"top":12,"right":16,"bottom":12,"left":16,"unit":"px"}},
  },
  contentBox: {
    type: 'string',
    default: {"padding":{"top":16,"right":16,"bottom":16,"left":16,"unit":"px"}},
  },
  titleColor: {
    type: 'string',
    default: {"text":"#333333","background":"#f5f5f5","hover":{"text":"#000000","background":"#e8e8e8"}},
  },
  contentColor: {
    type: 'string',
    default: {"text":"#333333","background":"#ffffff"},
  },
  contentTypography: {
    type: 'string',
    default: null,
  },
  titleTypography: {
    type: 'string',
    default: null,
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
  iconInactiveRotation: {
    type: 'string',
    default: '0deg',
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
  iconActiveRotation: {
    type: 'string',
    default: '0deg',
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
    default: '250ms',
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
    default: {"iconInactiveRotation":false,"iconInactiveSize":false,"iconInactiveMaxSize":false,"iconInactiveOffsetX":false,"iconInactiveOffsetY":false,"iconActiveRotation":false,"iconActiveSize":false,"iconActiveMaxSize":false,"iconActiveOffsetX":false,"iconActiveOffsetY":false,"accordionWidth":false},
  },
};

export default accordionAttributes;
