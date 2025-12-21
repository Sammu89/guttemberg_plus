/**
 * TypeScript Type Definitions for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-21T02:54:11.047Z
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
  /** Size of the icon in rem */
  iconSize?: number;
  /** Base rotation of the icon */
  iconRotation?: number;
  /** Rotation of the icon for the active tab */
  iconRotationActive?: number;
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
  /** Width of the active button edge touching content */
  tabButtonActiveContentBorderWidth?: number;
  /** Style of the active button edge touching content */
  tabButtonActiveContentBorderStyle?: string;
  /** Font weight for active/selected tab button */
  tabButtonActiveFontWeight?: string;
  /** Border color for inactive tab buttons */
  tabButtonBorderColor?: string;
  /** Border color for the active tab */
  tabButtonActiveBorderColor?: string;
  /** Color of the border. Keep it the same color as panel background for a merged look. */
  tabButtonActiveContentBorderColor?: string;
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
  /** Font size for tab buttons (rem) */
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
  /** Padding for tab buttons in rem (vertical/horizontal will be computed) */
  tabButtonPadding?: number;
  /** Background color for the tab navigation bar */
  tabListBackgroundColor?: string;
  /** Border color for the tab row */
  tabsRowBorderColor?: string;
  /** Border width for the tab row */
  tabsRowBorderWidth?: number;
  /** Border style for the tab row */
  tabsRowBorderStyle?: string;
  /** Alignment of tabs along the main axis */
  tabListAlignment?: string;
  /** Padding/spacing for the tab row (rem) */
  tabsRowSpacing?: number;
  /** Spacing between individual tab buttons (rem) */
  tabsButtonGap?: number;
  /** Background color for tab panels */
  panelBackgroundColor?: string;
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
  /** Color of the tab row edge that touches the content */
  tabsListContentBorderColor?: string;
  /** Width of the tab row edge that touches the content */
  tabsListContentBorderWidth?: number;
  /** Style of the tab row edge that touches the content */
  tabsListContentBorderStyle?: string;
}

/**
 * Default theme values for Tabs block
 */
export const tabsDefaultTheme: TabsTheme = {
  iconColor: '#666666',
  iconSize: 1,
  iconRotation: 0,
  iconRotationActive: 180,
  tabButtonColor: '#666666',
  tabButtonBackgroundColor: '#f5f5f5',
  tabButtonHoverColor: '#333333',
  tabButtonHoverBackgroundColor: '#e8e8e8',
  tabButtonActiveColor: '#333333',
  tabButtonActiveBackgroundColor: '#ffffff',
  tabButtonActiveContentBorderWidth: 1,
  tabButtonActiveContentBorderStyle: 'solid',
  tabButtonActiveFontWeight: 'bold',
  tabButtonBorderColor: '#dddddd',
  tabButtonActiveBorderColor: '#dddddd',
  tabButtonActiveContentBorderColor: '#ffffff',
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
  tabButtonFontSize: 1,
  tabButtonFontWeight: '500',
  tabButtonFontStyle: 'normal',
  tabButtonTextTransform: 'none',
  tabButtonTextDecoration: 'none',
  tabButtonTextAlign: 'center',
  tabButtonPadding: 0.75,
  tabListBackgroundColor: 'transparent',
  tabsRowBorderColor: '#dddddd',
  tabsRowBorderWidth: 0,
  tabsRowBorderStyle: 'solid',
  tabListAlignment: 'flex-start',
  tabsRowSpacing: 0.5,
  tabsButtonGap: 0.5,
  panelBackgroundColor: '#ffffff',
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
  tabsListContentBorderColor: 'transparent',
  tabsListContentBorderWidth: 1,
  tabsListContentBorderStyle: 'solid',
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
  stretchButtonsToRow?: boolean;
  activationMode?: string;
  headingLevel?: string;
  title?: string;
  tabsHorizontalAlign?: string;
  tabsWidth?: string;
  showIcon?: boolean;
  iconPosition?: string;
  iconColor?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
  iconRotationActive?: number;
  tabButtonColor?: string;
  tabButtonBackgroundColor?: string;
  tabButtonHoverColor?: string;
  tabButtonHoverBackgroundColor?: string;
  tabButtonActiveColor?: string;
  tabButtonActiveBackgroundColor?: string;
  enableFocusBorder?: boolean;
  tabButtonActiveContentBorderWidth?: number;
  tabButtonActiveContentBorderStyle?: string;
  tabButtonActiveFontWeight?: string;
  tabButtonBorderColor?: string;
  tabButtonActiveBorderColor?: string;
  tabButtonActiveContentBorderColor?: string;
  tabButtonBorderWidth?: number;
  tabButtonBorderStyle?: string;
  tabButtonBorderRadius?: Record<string, any>;
  tabButtonShadow?: string;
  tabButtonShadowHover?: string;
  tabButtonFontSize?: number;
  tabButtonFontWeight?: string;
  tabButtonFontStyle?: string;
  tabButtonTextTransform?: string;
  tabButtonTextDecoration?: string;
  tabButtonTextAlign?: string;
  tabButtonPadding?: number;
  tabListBackgroundColor?: string;
  tabsRowBorderColor?: string;
  tabsRowBorderWidth?: number;
  tabsRowBorderStyle?: string;
  tabListAlignment?: string;
  tabsRowSpacing?: number;
  tabsButtonGap?: number;
  panelBackgroundColor?: string;
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
  enableTabsListContentBorder?: boolean;
  tabsListContentBorderColor?: string;
  tabsListContentBorderWidth?: number;
  tabsListContentBorderStyle?: string;
}
