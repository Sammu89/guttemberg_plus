/**
 * Block Attributes for Tabs
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-23T02:43:04.666Z
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
  tabsData: {
    type: 'array',
    default: [],
  },
  orientation: {
    type: 'string',
    default: 'horizontal',
  },
  stretchButtonsToRow: {
    type: 'boolean',
    default: false,
  },
  activationMode: {
    type: 'string',
    default: 'click',
  },
  headingLevel: {
    type: 'string',
    default: 'none',
  },
  title: {
    type: 'string',
    default: 'Tabs',
  },
  tabsHorizontalAlign: {
    type: 'string',
    default: 'center',
  },
  tabsWidth: {
    type: 'string',
    default: '100%',
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
    default: 1,
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
    default: 0,
  },
  iconRotationActive: {
    type: 'number',
    default: 180,
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
  enableFocusBorder: {
    type: 'boolean',
    default: true,
  },
  tabButtonActiveContentBorderWidth: {
    type: 'number',
    default: 1,
  },
  tabButtonActiveContentBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  tabButtonActiveFontWeight: {
    type: 'string',
    default: 'bold',
  },
  tabButtonBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  tabButtonActiveBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  tabButtonActiveContentBorderColor: {
    type: 'string',
    default: '#ffffff',
  },
  tabButtonBorderWidth: {
    type: 'number',
    default: 1,
  },
  tabButtonBorderStyle: {
    type: 'string',
    default: 'solid',
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
    default: 1,
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
    default: 0.75,
  },
  tabListBackgroundColor: {
    type: 'string',
    default: 'transparent',
  },
  tabsRowBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  tabsRowBorderWidth: {
    type: 'number',
    default: 0,
  },
  tabsRowBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  tabListAlignment: {
    type: 'string',
    default: 'flex-start',
  },
  tabsRowSpacing: {
    type: 'number',
    default: 0.5,
  },
  tabsButtonGap: {
    type: 'number',
    default: 0.5,
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
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
  },
  borderColor: {
    type: 'string',
    default: '#dddddd',
  },
  borderWidth: {
    type: 'number',
    default: 0,
  },
  borderStyle: {
    type: 'string',
    default: 'solid',
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
    default: 1,
  },
  tabsListContentBorderStyle: {
    type: 'string',
    default: 'solid',
  },
};

export default tabsAttributes;
