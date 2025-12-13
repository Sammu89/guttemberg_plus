/**
 * TypeScript Type Definitions for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-13T00:48:15.517Z
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
  /** Color of the tab icon */
  iconColor?: string;
  /** Size of the icon in pixels */
  iconSize?: number;
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
  /** Font weight for active/selected tab button */
  tabButtonActiveFontWeight?: string;
  /** Border color for inactive tab buttons */
  tabButtonBorderColor?: string;
  /** Border width for tab buttons */
  tabButtonBorderWidth?: number;
  /** Border style for tab buttons */
  tabButtonBorderStyle?: string;
  /** Corner radius for tab buttons */
  tabButtonBorderRadius?: Record<string, any>;
  /** Box shadow for tab buttons */
  tabButtonShadow?: string;
  /** Box shadow for tab buttons on hover */
  tabButtonShadowHover?: string;
  /** Border color for inactive button edge adjacent to content */
  focusBorderColor?: string;
  /** Border color for active button edge adjacent to content */
  focusBorderColorActive?: string;
  /** Width of button edge adjacent to content */
  focusBorderWidth?: number;
  /** Style of button edge adjacent to content */
  focusBorderStyle?: string;
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
  /** Background color for tab panels */
  panelBackgroundColor?: string;
  /** Text color for tab panel content */
  panelColor?: string;
  /** Border color for tab content panel */
  panelBorderColor?: string;
  /** Border width for tab content panel (0-10px) */
  panelBorderWidth?: number;
  /** Border style for tab content panel */
  panelBorderStyle?: string;
  /** Corner radius for tab content panel */
  panelBorderRadius?: Record<string, any>;
  /** Border color for main tabs wrapper */
  borderColor?: string;
  /** Border width for main wrapper */
  borderWidth?: number;
  /** Border style for wrapper */
  borderStyle?: string;
  /** Corner radius for main wrapper */
  borderRadius?: Record<string, any>;
  /** Box shadow for main wrapper */
  shadow?: string;
  /** Box shadow for wrapper on hover */
  shadowHover?: string;
  /** Color of border between navigation bar and content */
  navBarBorderColor?: string;
  /** Width of border between navigation bar and content */
  navBarBorderWidth?: number;
  /** Style of border between navigation bar and content */
  navBarBorderStyle?: string;
}

/**
 * Default theme values for Tabs block
 */
export const tabsDefaultTheme: TabsTheme = {
  iconColor: '#666666',
  iconSize: 16,
  iconRotation: 180,
  tabButtonColor: '#666666',
  tabButtonBackgroundColor: '#f5f5f5',
  tabButtonHoverColor: '#333333',
  tabButtonHoverBackgroundColor: '#e8e8e8',
  tabButtonActiveColor: '#333333',
  tabButtonActiveBackgroundColor: '#ffffff',
  tabButtonActiveBorderColor: '#dddddd',
  tabButtonActiveBorderBottomColor: '#ffffff',
  tabButtonActiveFontWeight: 'bold',
  tabButtonBorderColor: '#dddddd',
  tabButtonBorderWidth: 1,
  tabButtonBorderStyle: 'solid',
  tabButtonBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  tabButtonShadow: 'none',
  tabButtonShadowHover: 'none',
  focusBorderColor: '#dddddd',
  focusBorderColorActive: '#ffffff',
  focusBorderWidth: 2,
  focusBorderStyle: 'solid',
  tabButtonFontSize: 16,
  tabButtonFontWeight: '500',
  tabButtonFontStyle: 'normal',
  tabButtonTextTransform: 'none',
  tabButtonTextDecoration: 'none',
  tabButtonTextAlign: 'center',
  tabListBackgroundColor: 'transparent',
  tabListAlignment: 'left',
  panelBackgroundColor: '#ffffff',
  panelColor: '#333333',
  panelBorderColor: '#dddddd',
  panelBorderWidth: 1,
  panelBorderStyle: 'solid',
  panelBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4
  },
  borderColor: '#dddddd',
  borderWidth: 0,
  borderStyle: 'solid',
  borderRadius: {
    "topLeft": 0,
    "topRight": 0,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  shadow: 'none',
  shadowHover: 'none',
  navBarBorderColor: 'transparent',
  navBarBorderWidth: 1,
  navBarBorderStyle: 'solid',
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface TabsThemeAttributes {
  uniqueId?: string;
  blockId?: string;
  currentTheme?: string;
  tabs?: any[];
  tabsData?: any[];
  orientation?: string;
  activationMode?: string;
  headingLevel?: string;
  title?: string;
  verticalTabButtonTextAlign?: string;
  tabsHorizontalAlign?: string;
  tabsWidth?: string;
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
  tabButtonActiveFontWeight?: string;
  tabButtonBorderColor?: string;
  tabButtonBorderWidth?: number;
  tabButtonBorderStyle?: string;
  tabButtonBorderRadius?: Record<string, any>;
  tabButtonShadow?: string;
  tabButtonShadowHover?: string;
  enableFocusBorder?: boolean;
  focusBorderColor?: string;
  focusBorderColorActive?: string;
  focusBorderWidth?: number;
  focusBorderStyle?: string;
  tabButtonFontSize?: number;
  tabButtonFontWeight?: string;
  tabButtonFontStyle?: string;
  tabButtonTextTransform?: string;
  tabButtonTextDecoration?: string;
  tabButtonTextAlign?: string;
  tabListBackgroundColor?: string;
  tabListAlignment?: string;
  panelBackgroundColor?: string;
  panelColor?: string;
  panelBorderColor?: string;
  panelBorderWidth?: number;
  panelBorderStyle?: string;
  panelBorderRadius?: Record<string, any>;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderRadius?: Record<string, any>;
  shadow?: string;
  shadowHover?: string;
  enableNavBarBorder?: boolean;
  navBarBorderColor?: string;
  navBarBorderWidth?: number;
  navBarBorderStyle?: string;
}
