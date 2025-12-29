/**
 * Block Attributes for Tabs
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-29T01:32:27.283Z
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
  tabsWidth: {
    type: 'string',
    default: '100%',
  },
  headingLevel: {
    type: 'string',
    default: 'none',
  },
  tabsHorizontalAlign: {
    type: 'string',
    default: 'center',
  },
  orientation: {
    type: 'string',
    default: 'horizontal',
  },
  activationMode: {
    type: 'string',
    default: 'click',
  },
  title: {
    type: 'string',
    default: 'Tabs',
  },
  tabs: {
    type: 'array',
    default: [{"id":"","title":"Tab 1","content":"","isDisabled":false},{"id":"","title":"Tab 2","content":"","isDisabled":false}],
  },
  tabsData: {
    type: 'array',
    default: [],
  },
  currentTheme: {
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
  borderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  borderWidth: {
    type: 'number',
    default: '0px',
  },
  borderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
  },
  borderRadius: {
    type: 'object',
    default: {"topLeft":0,"topRight":0,"bottomRight":0,"bottomLeft":0},
  },
  shadow: {
    type: 'string',
    default: 'none',
  },
  shadowHover: {
    type: 'string',
    default: 'none',
  },
  tabButtonColor: {
    type: 'string',
    default: '#666666',
  },
  tabButtonBackgroundColor: {
    type: 'string',
    default: '#f5f5f5',
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
    default: '#333333',
  },
  tabButtonActiveBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  tabButtonFontSize: {
    type: 'number',
    default: '1rem',
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
    type: 'number',
    default: '0.75rem',
  },
  tabButtonActiveFontWeight: {
    type: 'string',
    default: 'bold',
  },
  tabButtonBorderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  tabButtonActiveBorderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  tabButtonBorderWidth: {
    type: 'number',
    default: '1px',
  },
  tabButtonBorderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
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
  enableFocusBorder: {
    type: 'boolean',
    default: true,
  },
  tabButtonActiveContentBorderColor: {
    type: 'string',
    default: '#ffffff',
  },
  tabButtonActiveContentBorderWidth: {
    type: 'number',
    default: '1px',
  },
  tabButtonActiveContentBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  tabListBackgroundColor: {
    type: 'string',
    default: 'transparent',
  },
  tabsRowBorderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  tabsRowBorderWidth: {
    type: 'number',
    default: '0px',
  },
  tabsRowBorderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
  },
  tabsRowSpacing: {
    type: 'number',
    default: '0.5rem',
  },
  tabsButtonGap: {
    type: 'number',
    default: '0.5rem',
  },
  stretchButtonsToRow: {
    type: 'boolean',
    default: false,
  },
  tabListAlignment: {
    type: 'string',
    default: 'flex-start',
  },
  enableTabsListContentBorder: {
    type: 'boolean',
    default: false,
  },
  tabsListContentBorderColor: {
    type: 'string',
    default: 'transparent',
  },
  tabsListContentBorderWidth: {
    type: 'number',
    default: '1px',
  },
  tabsListContentBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  panelBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  panelBorderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  panelBorderWidth: {
    type: 'number',
    default: '1px',
  },
  panelBorderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
  },
  panelBorderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
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
    type: 'number',
    default: '1rem',
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
    default: '0deg',
  },
  iconRotationActive: {
    type: 'number',
    default: '180deg',
  },
  // Auto-generated: tracks which responsive attributes have responsive mode enabled
  responsiveEnabled: {
    type: 'object',
    default: {"tabsWidth":false},
  },
};

export default tabsAttributes;
