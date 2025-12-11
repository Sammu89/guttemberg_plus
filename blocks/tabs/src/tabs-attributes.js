/**
 * Block Attributes for Tabs
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-11T00:40:02.265Z
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
  tabsHorizontalAlign: {
    type: 'string',
    default: 'left',
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
    default: 16,
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
  tabButtonActiveBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  tabButtonActiveBorderBottomColor: {
    type: 'string',
    default: '#ffffff',
  },
  tabButtonBorderColor: {
    type: 'string',
    default: '#dddddd',
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
  enableFocusBorder: {
    type: 'boolean',
    default: true,
  },
  focusBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  focusBorderColorActive: {
    type: 'string',
    default: '#ffffff',
  },
  focusBorderWidth: {
    type: 'number',
    default: 2,
  },
  focusBorderStyle: {
    type: 'string',
    default: 'solid',
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
  tabListBackgroundColor: {
    type: 'string',
    default: 'transparent',
  },
  tabListAlignment: {
    type: 'string',
    default: 'left',
  },
  panelBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  panelColor: {
    type: 'string',
    default: '#333333',
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
  enableDividerBorder: {
    type: 'boolean',
    default: false,
  },
  dividerBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  dividerBorderWidth: {
    type: 'number',
    default: 1,
  },
  dividerBorderStyle: {
    type: 'string',
    default: 'solid',
  },
};

export default tabsAttributes;
