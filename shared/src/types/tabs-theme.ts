/**
 * TypeScript Type Definitions for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-08T23:16:16.039Z
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
  /** Color of navbar border adjacent to content */
  dividerBorderColor?: string;
  /** Width of navbar border adjacent to content */
  dividerBorderWidth?: number;
  /** Style of navbar border adjacent to content */
  dividerBorderStyle?: string;
}

/**
 * Default theme values for Tabs block
 */
export const tabsDefaultTheme: TabsTheme = {
  iconColor: '#666666',
  iconSize: 16,
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
  focusBorderColor: '#0073aa',
  focusBorderColorActive: '#0073aa',
  focusBorderWidth: 2,
  focusBorderStyle: 'solid',
  tabButtonFontSize: 16,
  tabButtonFontWeight: '500',
  tabButtonFontStyle: 'normal',
  tabButtonTextTransform: 'none',
  tabButtonTextDecoration: 'none',
  tabButtonTextAlign: 'center',
  tabListBackgroundColor: '#f5f5f5',
  tabListAlignment: 'left',
  panelBackgroundColor: '#ffffff',
  panelColor: '#333333',
  panelBorderColor: '#dddddd',
  panelBorderWidth: 1,
  panelBorderStyle: 'solid',
  panelBorderRadius: {
    "topLeft": 0,
    "topRight": 0,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  borderColor: 'transparent',
  borderWidth: 0,
  borderStyle: 'none',
  borderRadius: {
    "topLeft": 0,
    "topRight": 0,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  shadow: 'none',
  shadowHover: 'none',
  dividerBorderColor: '#dddddd',
  dividerBorderWidth: 1,
  dividerBorderStyle: 'solid',
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
  enableDividerBorder?: boolean;
  dividerBorderColor?: string;
  dividerBorderWidth?: number;
  dividerBorderStyle?: string;
}
