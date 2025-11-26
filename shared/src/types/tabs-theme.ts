/**
 * TypeScript Type Definitions for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-11-26T10:20:04.892Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Theme interface for Tabs block
 * Contains all themeable attributes
 */
export interface TabsTheme {
  /** Display icons in tab buttons */
  showIcon?: boolean;
  /** Position of icon relative to text */
  iconPosition?: string;
  /** Color of the tab icon */
  iconColor?: string;
  /** Size of the icon in pixels */
  iconSize?: number;
  /** Icon when tab is closed (char or image URL) */
  iconTypeClosed?: string;
  /** Icon when tab is open (none = use closed icon with rotation) */
  iconTypeOpen?: string;
  /** Rotation angle when open (degrees) */
  iconRotation?: number;
  /** Text color for inactive tab buttons */
  tabButtonColor?: string;
  /** Background color for inactive tab buttons */
  tabButtonBackgroundColor?: string;
  /** Text color when hovering over tab */
  tabButtonHoverColor?: string;
  /** Background color when hovering over tab */
  tabButtonHoverBackgroundColor?: string;
  /** Text color for active/selected tab */
  tabButtonActiveColor?: string;
  /** Background color for active/selected tab */
  tabButtonActiveBackgroundColor?: string;
  /** Border color for the active tab */
  tabButtonActiveBorderColor?: string;
  /** Bottom border color for active tab (creates connected effect) */
  tabButtonActiveBorderBottomColor?: string;
  /** Border color for inactive tab buttons */
  buttonBorderColor?: string | undefined;
  /** Border width for tab buttons */
  buttonBorderWidth?: number | undefined;
  /** Border style for tab buttons */
  buttonBorderStyle?: string | undefined;
  /** Corner radius for tab buttons */
  buttonBorderRadius?: Record<string, any>;
  /** Box shadow for tab buttons */
  buttonShadow?: string;
  /** Box shadow for tab buttons on hover */
  buttonShadowHover?: string;
  /** Font size for tab buttons */
  tabButtonFontSize?: number;
  /** Font weight for tab buttons */
  tabButtonFontWeight?: string;
  /** Font style for tab buttons */
  tabButtonFontStyle?: string;
  /** Text transformation for tab buttons */
  tabButtonTextTransform?: string;
  /** Text decoration for tab buttons */
  tabButtonTextDecoration?: string;
  /** Text alignment for tab buttons */
  tabButtonTextAlign?: string;
  /** Background color for the tab navigation bar */
  tabListBackgroundColor?: string;
  /** Horizontal alignment of tabs */
  tabListAlignment?: string;
  /** Text color for tab panel content */
  panelColor?: string;
  /** Background color for tab panels */
  panelBackgroundColor?: string;
  /** Color of divider line between tabs and panel */
  dividerColor?: string | undefined;
  /** Width/thickness of divider line */
  dividerWidth?: number | undefined;
  /** Style of divider line between tabs and panel */
  dividerStyle?: string | undefined;
  /** Border color for main tabs wrapper */
  borderColor?: string | undefined;
  /** Border width for main wrapper */
  borderWidth?: number | undefined;
  /** Border style for wrapper */
  borderStyle?: string | undefined;
  /** Corner radius for main wrapper */
  borderRadius?: Record<string, any>;
  /** Box shadow for main wrapper */
  shadow?: string;
  /** Box shadow for wrapper on hover */
  shadowHover?: string;
}

/**
 * Default theme values for Tabs block
 */
export const tabsDefaultTheme: TabsTheme = {
  showIcon: true,
  iconPosition: 'right',
  iconColor: '#666666',
  iconSize: 16px,
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: 180deg,
  tabButtonColor: '#666666',
  tabButtonBackgroundColor: 'transparent',
  tabButtonHoverColor: '#333333',
  tabButtonHoverBackgroundColor: '#e8e8e8',
  tabButtonActiveColor: '#000000',
  tabButtonActiveBackgroundColor: '#ffffff',
  tabButtonActiveBorderColor: '#dddddd',
  tabButtonActiveBorderBottomColor: 'transparent',
  buttonBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  buttonShadow: 'none',
  buttonShadowHover: 'none',
  tabButtonFontSize: 16,
  tabButtonFontWeight: '500',
  tabButtonFontStyle: 'normal',
  tabButtonTextTransform: 'none',
  tabButtonTextDecoration: 'none',
  tabButtonTextAlign: 'center',
  tabListBackgroundColor: '#f5f5f5',
  tabListAlignment: 'left',
  panelColor: '#333333',
  panelBackgroundColor: '#ffffff',
  borderRadius: {
    "topLeft": 0,
    "topRight": 0,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  shadow: 'none',
  shadowHover: 'none',
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface TabsThemeAttributes {
  uniqueId?: string;
  blockId?: string;
  currentTheme?: string;
  tabs?: any[];
  orientation?: string;
  activationMode?: string;
  responsiveBreakpoint?: number;
  headingLevel?: string;
  title?: string;
  verticalTabButtonTextAlign?: string;
  showIcon?: boolean;
  iconPosition?: string;
  iconColor?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
  tabButtonColor?: string;
  tabButtonBackgroundColor?: string;
  tabButtonHoverColor?: string;
  tabButtonHoverBackgroundColor?: string;
  tabButtonActiveColor?: string;
  tabButtonActiveBackgroundColor?: string;
  tabButtonActiveBorderColor?: string;
  tabButtonActiveBorderBottomColor?: string;
  buttonBorderColor?: string | undefined;
  buttonBorderWidth?: number | undefined;
  buttonBorderStyle?: string | undefined;
  buttonBorderRadius?: Record<string, any>;
  buttonShadow?: string;
  buttonShadowHover?: string;
  tabButtonFontSize?: number;
  tabButtonFontWeight?: string;
  tabButtonFontStyle?: string;
  tabButtonTextTransform?: string;
  tabButtonTextDecoration?: string;
  tabButtonTextAlign?: string;
  tabListBackgroundColor?: string;
  tabListAlignment?: string;
  panelColor?: string;
  panelBackgroundColor?: string;
  dividerColor?: string | undefined;
  dividerWidth?: number | undefined;
  dividerStyle?: string | undefined;
  borderColor?: string | undefined;
  borderWidth?: number | undefined;
  borderStyle?: string | undefined;
  borderRadius?: Record<string, any>;
  shadow?: string;
  shadowHover?: string;
}
