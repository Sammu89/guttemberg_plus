/**
 * Block Attributes for Tabs
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-11-23T23:21:53.134Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Block Attributes for Tabs
 *
 * These attributes define the block's data structure for WordPress.
 * Auto-generated from schema - DO NOT edit manually.
 */
export const tabsAttributes = {
  uniqueId: {
    type: 'string',
    default: '',
  },
  blockId: {
    type: 'string',
    default: '',
  },
  currentTheme: {
    type: 'string',
    default: '',
  },
  tabs: {
    type: 'array',
    default: [{"id":"","title":"Tab 1","content":"","isDisabled":false},{"id":"","title":"Tab 2","content":"","isDisabled":false}],
  },
  orientation: {
    type: 'string',
    default: 'horizontal',
  },
  activationMode: {
    type: 'string',
    default: 'auto',
  },
  currentTab: {
    type: 'number',
    default: 0,
  },
  responsiveBreakpoint: {
    type: 'number',
    default: 768,
  },
  enableResponsiveFallback: {
    type: 'boolean',
    default: true,
  },
  headingLevel: {
    type: 'string',
    default: 'none',
  },
  useHeadingStyles: {
    type: 'boolean',
    default: false,
  },
  initiallyOpen: {
    type: 'boolean',
    default: false,
  },
  title: {
    type: 'string',
    default: 'Accordion Title',
  },
  content: {
    type: 'string',
    default: '',
  },
  accordionId: {
    type: 'string',
    default: '',
  },
  titleColor: {
    type: 'string',
    default: '#666666',
  },
  titleBackgroundColor: {
    type: 'string',
    default: 'transparent',
  },
  hoverTitleColor: {
    type: 'string',
    default: '#333333',
  },
  hoverTitleBackgroundColor: {
    type: 'string',
    default: '#e8e8e8',
  },
  activeTitleColor: {
    type: 'string',
    default: null,
  },
  activeTitleBackgroundColor: {
    type: 'string',
    default: null,
  },
  tabButtonActiveColor: {
    type: 'string',
    default: '#000000',
  },
  tabButtonActiveBackground: {
    type: 'string',
    default: '#ffffff',
  },
  tabButtonActiveBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  tabButtonActiveBorderBottomColor: {
    type: 'string',
    default: 'transparent',
  },
  contentColor: {
    type: 'string',
    default: null,
  },
  contentBackgroundColor: {
    type: 'string',
    default: null,
  },
  panelBackground: {
    type: 'string',
    default: '#ffffff',
  },
  panelColor: {
    type: 'string',
    default: '#333333',
  },
  tabListBackground: {
    type: 'string',
    default: '#f5f5f5',
  },
  tabBorderColor: {
    type: 'string',
    default: null,
  },
  containerBorderColor: {
    type: 'string',
    default: 'transparent',
  },
  panelBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  tabListBorderBottomColor: {
    type: 'string',
    default: '#dddddd',
  },
  dividerColor: {
    type: 'string',
    default: null,
  },
  dividerBorderColor: {
    type: 'string',
    default: null,
  },
  iconColor: {
    type: 'string',
    default: 'inherit',
  },
  titleFontSize: {
    type: 'number',
    default: '16px',
  },
  titleFontWeight: {
    type: 'string',
    default: '500',
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
    default: 'center',
  },
  contentFontSize: {
    type: 'number',
    default: null,
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
    default: null,
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
  panelFontSize: {
    type: 'number',
    default: '16px',
  },
  panelLineHeight: {
    type: 'number',
    default: 1.6,
  },
  verticalTabButtonTextAlign: {
    type: 'string',
    default: 'left',
  },
  tabBorderThickness: {
    type: 'number',
    default: null,
  },
  tabBorderStyle: {
    type: 'string',
    default: null,
  },
  tabBorderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":0,"bottomLeft":0},
  },
  tabShadow: {
    type: 'string',
    default: 'none',
  },
  tabShadowHover: {
    type: 'string',
    default: 'none',
  },
  tabButtonBorderRadius: {
    type: 'object',
    default: null,
  },
  containerBorderWidth: {
    type: 'number',
    default: '0px',
  },
  containerBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  containerBorderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
  },
  containerShadow: {
    type: 'string',
    default: 'none',
  },
  panelBorderWidth: {
    type: 'number',
    default: '1px',
  },
  panelBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  panelBorderRadius: {
    type: 'number',
    default: '0px',
  },
  tabListBorderBottomWidth: {
    type: 'number',
    default: '2px',
  },
  tabListBorderBottomStyle: {
    type: 'string',
    default: 'solid',
  },
  dividerThickness: {
    type: 'number',
    default: null,
  },
  dividerStyle: {
    type: 'string',
    default: null,
  },
  accordionBorderThickness: {
    type: 'number',
    default: null,
  },
  accordionBorderStyle: {
    type: 'string',
    default: null,
  },
  accordionBorderRadius: {
    type: 'object',
    default: null,
  },
  accordionShadow: {
    type: 'string',
    default: null,
  },
  dividerBorderThickness: {
    type: 'number',
    default: null,
  },
  dividerBorderStyle: {
    type: 'string',
    default: null,
  },
  titlePadding: {
    type: 'object',
    default: {"top":12,"right":24,"bottom":12,"left":24},
  },
  contentPadding: {
    type: 'object',
    default: null,
  },
  panelPadding: {
    type: 'object',
    default: {"top":24,"right":24,"bottom":24,"left":24},
  },
  tabListPadding: {
    type: 'object',
    default: {"top":8,"right":8,"bottom":8,"left":8},
  },
  tabListGap: {
    type: 'number',
    default: '4px',
  },
  tabsAlignment: {
    type: 'string',
    default: 'left',
  },
  verticalTabListWidth: {
    type: 'number',
    default: '200px',
  },
  accordionMarginBottom: {
    type: 'number',
    default: null,
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
    default: '18px',
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

export default tabsAttributes;
