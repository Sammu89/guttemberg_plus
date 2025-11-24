/**
 * TypeScript Type Definitions for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-11-24T23:11:16.747Z
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
  /** Color of tab icons */
  iconColor?: string;
  /** Size of tab icons in pixels */
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
  tabButtonBorderColor?: string | undefined;
  /** Border width for tab buttons */
  tabButtonBorderWidth?: number | undefined;
  /** Border style for tab buttons */
  tabButtonBorderStyle?: string | undefined;
  /** Corner radius for tab buttons */
  tabButtonBorderRadius?: Record<string, any>;
  /** Box shadow for tab buttons */
  tabButtonShadow?: string;
  /** Box shadow for tab buttons on hover */
  tabButtonShadowHover?: string;
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
  /** Padding inside tab buttons */
  tabButtonPadding?: Record<string, any>;
  /** Background color for the tab navigation bar */
  tabListBackgroundColor?: string;
  /** Horizontal alignment of tabs */
  tabListAlignment?: string;
  /** Text color for tab panel content */
  panelColor?: string;
  /** Background color for tab panels */
  panelBackgroundColor?: string;
  /** Border color for tab panels */
  panelBorderColor?: string;
  /** Border width for tab panels */
  panelBorderWidth?: number;
  /** Border style for tab panels */
  panelBorderStyle?: string;
  /** Corner radius for tab panels */
  panelBorderRadius?: Record<string, any>;
  /** Box shadow for tab panels */
  panelShadow?: string;
  /** Color of divider line between tabs and panel */
  dividerLineColor?: string | undefined;
  /** Width/thickness of divider line */
  dividerLineWidth?: number | undefined;
  /** Style of divider line between tabs and panel */
  dividerLineStyle?: string | undefined;
  /** Width of tab list in vertical orientation */
  verticalTabListWidth?: number;
  /** General spacing between items */
  itemSpacing?: number | undefined;
}

/**
 * Default theme values for Tabs block
 */
export const tabsDefaultTheme: TabsTheme = {
  showIcon: true,
  iconPosition: 'right',
  iconColor: 'inherit',
  iconSize: 18,
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: 180,
  tabButtonColor: '#666666',
  tabButtonBackgroundColor: 'transparent',
  tabButtonHoverColor: '#333333',
  tabButtonHoverBackgroundColor: '#e8e8e8',
  tabButtonActiveColor: '#000000',
  tabButtonActiveBackgroundColor: '#ffffff',
  tabButtonActiveBorderColor: '#dddddd',
  tabButtonActiveBorderBottomColor: 'transparent',
  tabButtonBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  tabButtonShadow: 'none',
  tabButtonShadowHover: 'none',
  tabButtonFontSize: 16,
  tabButtonFontWeight: '500',
  tabButtonFontStyle: 'normal',
  tabButtonTextTransform: 'none',
  tabButtonTextDecoration: 'none',
  tabButtonTextAlign: 'center',
  tabButtonPadding: {
    "top": 12,
    "right": 24,
    "bottom": 12,
    "left": 24
  },
  tabListBackgroundColor: '#f5f5f5',
  tabListAlignment: 'left',
  panelColor: '#333333',
  panelBackgroundColor: '#ffffff',
  panelBorderColor: '#dddddd',
  panelBorderWidth: 1,
  panelBorderStyle: 'solid',
  panelBorderRadius: {
    "topLeft": 0,
    "topRight": 0,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  panelShadow: 'none',
  verticalTabListWidth: 200,
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
  tabButtonBorderColor?: string | undefined;
  tabButtonBorderWidth?: number | undefined;
  tabButtonBorderStyle?: string | undefined;
  tabButtonBorderRadius?: Record<string, any>;
  tabButtonShadow?: string;
  tabButtonShadowHover?: string;
  tabButtonFontSize?: number;
  tabButtonFontWeight?: string;
  tabButtonFontStyle?: string;
  tabButtonTextTransform?: string;
  tabButtonTextDecoration?: string;
  tabButtonTextAlign?: string;
  tabButtonPadding?: Record<string, any>;
  tabListBackgroundColor?: string;
  tabListAlignment?: string;
  panelColor?: string;
  panelBackgroundColor?: string;
  panelBorderColor?: string;
  panelBorderWidth?: number;
  panelBorderStyle?: string;
  panelBorderRadius?: Record<string, any>;
  panelShadow?: string;
  dividerLineColor?: string | undefined;
  dividerLineWidth?: number | undefined;
  dividerLineStyle?: string | undefined;
  verticalTabListWidth?: number;
  itemSpacing?: number | undefined;
}
