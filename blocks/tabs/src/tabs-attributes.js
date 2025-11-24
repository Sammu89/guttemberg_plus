/**
 * Block Attributes for Tabs
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-11-24T23:11:16.750Z
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
  responsiveBreakpoint: {
    type: 'number',
    default: 768,
  },
  headingLevel: {
    type: 'string',
    default: 'none',
  },
  title: {
    type: 'string',
    default: 'Tabs',
  },
  verticalTabButtonTextAlign: {
    type: 'string',
    default: 'left',
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
    default: 'inherit',
  },
  iconSize: {
    type: 'number',
    default: 18,
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
  tabButtonColor: {
    type: 'string',
    default: '#666666',
  },
  tabButtonBackgroundColor: {
    type: 'string',
    default: 'transparent',
  },
  tabButtonHoverColor: {
    type: 'string',
    default: '#333333',
  },
  tabButtonHoverBackgroundColor: {
    type: 'string',
    default: '#e8e8e8',
  },
  tabButtonActiveColor: {
    type: 'string',
    default: '#000000',
  },
  tabButtonActiveBackgroundColor: {
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
  tabButtonBorderColor: {
    type: 'string',
    default: null,
  },
  tabButtonBorderWidth: {
    type: 'number',
    default: null,
  },
  tabButtonBorderStyle: {
    type: 'string',
    default: null,
  },
  tabButtonBorderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":0,"bottomLeft":0},
  },
  tabButtonShadow: {
    type: 'string',
    default: 'none',
  },
  tabButtonShadowHover: {
    type: 'string',
    default: 'none',
  },
  tabButtonFontSize: {
    type: 'number',
    default: 16,
  },
  tabButtonFontWeight: {
    type: 'string',
    default: '500',
  },
  tabButtonFontStyle: {
    type: 'string',
    default: 'normal',
  },
  tabButtonTextTransform: {
    type: 'string',
    default: 'none',
  },
  tabButtonTextDecoration: {
    type: 'string',
    default: 'none',
  },
  tabButtonTextAlign: {
    type: 'string',
    default: 'center',
  },
  tabButtonPadding: {
    type: 'object',
    default: {"top":12,"right":24,"bottom":12,"left":24},
  },
  tabListBackgroundColor: {
    type: 'string',
    default: '#f5f5f5',
  },
  tabListAlignment: {
    type: 'string',
    default: 'left',
  },
  panelColor: {
    type: 'string',
    default: '#333333',
  },
  panelBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  panelBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  panelBorderWidth: {
    type: 'number',
    default: 1,
  },
  panelBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  panelBorderRadius: {
    type: 'object',
    default: {"topLeft":0,"topRight":0,"bottomRight":0,"bottomLeft":0},
  },
  panelShadow: {
    type: 'string',
    default: 'none',
  },
  dividerLineColor: {
    type: 'string',
    default: null,
  },
  dividerLineWidth: {
    type: 'number',
    default: null,
  },
  dividerLineStyle: {
    type: 'string',
    default: null,
  },
  verticalTabListWidth: {
    type: 'number',
    default: 200,
  },
  itemSpacing: {
    type: 'number',
    default: null,
  },
};

export default tabsAttributes;
