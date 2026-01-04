/**
 * Block Attributes for Tabs
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2026-01-04T23:18:45.226Z
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
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"},
  },
  borderWidth: {
    type: 'number',
    default: 0,
  },
  borderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"},
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
    default: {"text":"#666666","background":"#f5f5f5","hover":{"text":"#333333","background":"#e8e8e8"},"active":{"text":"#333333","background":"#ffffff"}},
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
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"},
  },
  tabButtonActiveBorderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"},
  },
  tabButtonBorderWidth: {
    type: 'number',
    default: 1,
  },
  tabButtonBorderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"},
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
    default: 1,
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
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"},
  },
  tabsRowBorderWidth: {
    type: 'number',
    default: 0,
  },
  tabsRowBorderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"},
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
    default: 1,
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
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"},
  },
  panelBorderWidth: {
    type: 'number',
    default: 1,
  },
  panelBorderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"},
  },
  panelBorderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
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
  // Auto-generated: tracks which responsive attributes have responsive mode enabled
  responsiveEnabled: {
    type: 'object',
    default: {"tabsWidth":false,"iconInactiveRotation":false,"iconInactiveSize":false,"iconInactiveMaxSize":false,"iconInactiveOffsetX":false,"iconInactiveOffsetY":false,"iconActiveRotation":false,"iconActiveSize":false,"iconActiveMaxSize":false,"iconActiveOffsetX":false,"iconActiveOffsetY":false},
  },
};

export default tabsAttributes;
