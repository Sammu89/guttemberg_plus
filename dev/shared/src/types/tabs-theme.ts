/**
 * TypeScript Type Definitions for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-29T01:32:27.282Z
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
  /** Border color for main tabs wrapper */
  borderColor?: Record<string, any>;
  /** Border width for main wrapper */
  borderWidth?: number;
  /** Border style for wrapper */
  borderStyle?: Record<string, any>;
  /** Corner radius for main wrapper */
  borderRadius?: Record<string, any>;
  /** Box shadow for main wrapper */
  shadow?: string;
  /** Box shadow for wrapper on hover */
  shadowHover?: string;
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
  /** Font weight for active/selected tab button */
  tabButtonActiveFontWeight?: string;
  /** Border color for inactive tab buttons */
  tabButtonBorderColor?: Record<string, any>;
  /** Border color for the active tab */
  tabButtonActiveBorderColor?: Record<string, any>;
  /** Border width for tab buttons */
  tabButtonBorderWidth?: number;
  /** Border style for tab buttons */
  tabButtonBorderStyle?: Record<string, any>;
  /** Corner radius for tab buttons */
  tabButtonBorderRadius?: Record<string, any>;
  /** Box shadow for tab buttons */
  tabButtonShadow?: string;
  /** Box shadow for tab buttons on hover */
  tabButtonShadowHover?: string;
  /** Border on the edge touching the content, giving it a merged look. */
  enableFocusBorder?: boolean;
  /** Color of the border. Keep it the same color as panel background for a merged look. */
  tabButtonActiveContentBorderColor?: string;
  /** Width of the active button edge touching content */
  tabButtonActiveContentBorderWidth?: number;
  /** Style of the active button edge touching content */
  tabButtonActiveContentBorderStyle?: string;
  /** Background color for the tab navigation bar */
  tabListBackgroundColor?: string;
  /** Border color for the tab row */
  tabsRowBorderColor?: Record<string, any>;
  /** Border width for the tab row */
  tabsRowBorderWidth?: number;
  /** Border style for the tab row */
  tabsRowBorderStyle?: Record<string, any>;
  /** Padding/spacing for the tab row (rem) */
  tabsRowSpacing?: number;
  /** Spacing between individual tab buttons (rem) */
  tabsButtonGap?: number;
  /** Make tab buttons fill the full width of the row (horizontal orientation only) */
  stretchButtonsToRow?: boolean;
  /** Alignment of tabs along the main axis */
  tabListAlignment?: string;
  /** Enable or disable border between tab row and content */
  enableTabsListContentBorder?: boolean;
  /** Color of the tab row edge that touches the content */
  tabsListContentBorderColor?: string;
  /** Width of the tab row edge that touches the content */
  tabsListContentBorderWidth?: number;
  /** Style of the tab row edge that touches the content */
  tabsListContentBorderStyle?: string;
  /** Background color for tab panels */
  panelBackgroundColor?: string;
  /** Border color for tab content panel */
  panelBorderColor?: Record<string, any>;
  /** Border width for tab content panel (0-10px) */
  panelBorderWidth?: number;
  /** Border style for tab content panel */
  panelBorderStyle?: Record<string, any>;
  /** Corner radius for tab content panel */
  panelBorderRadius?: Record<string, any>;
  /** Display icons in tab buttons */
  showIcon?: boolean;
  /** Position of icon relative to text */
  iconPosition?: string;
  /** Color of the tab icon */
  iconColor?: string;
  /** Size of the icon in rem */
  iconSize?: number;
  /** Icon for the tab (char or image URL) */
  iconTypeClosed?: string;
  /** Icon when tab is active (none = use closed icon with final rotation) */
  iconTypeOpen?: string;
  /** Base rotation of the icon */
  iconRotation?: number;
  /** Rotation of the icon for the active tab */
  iconRotationActive?: number;
}

/**
 * Default theme values for Tabs block
 */
export const tabsDefaultTheme: TabsTheme = {
  borderColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd",
    "linked": true
  },
  borderWidth: 0px,
  borderStyle: {
    "top": "solid",
    "right": "solid",
    "bottom": "solid",
    "left": "solid",
    "linked": true
  },
  borderRadius: {
    "topLeft": 0,
    "topRight": 0,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  shadow: 'none',
  shadowHover: 'none',
  tabButtonColor: '#666666',
  tabButtonBackgroundColor: '#f5f5f5',
  tabButtonHoverColor: '#333333',
  tabButtonHoverBackgroundColor: '#e8e8e8',
  tabButtonActiveColor: '#333333',
  tabButtonActiveBackgroundColor: '#ffffff',
  tabButtonFontSize: 1rem,
  tabButtonFontWeight: '500',
  tabButtonFontStyle: 'normal',
  tabButtonTextTransform: 'none',
  tabButtonTextDecoration: 'none',
  tabButtonTextAlign: 'center',
  tabButtonPadding: 0.75rem,
  tabButtonActiveFontWeight: 'bold',
  tabButtonBorderColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd",
    "linked": true
  },
  tabButtonActiveBorderColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd",
    "linked": true
  },
  tabButtonBorderWidth: 1px,
  tabButtonBorderStyle: {
    "top": "solid",
    "right": "solid",
    "bottom": "solid",
    "left": "solid",
    "linked": true
  },
  tabButtonBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  tabButtonShadow: 'none',
  tabButtonShadowHover: 'none',
  enableFocusBorder: true,
  tabButtonActiveContentBorderColor: '#ffffff',
  tabButtonActiveContentBorderWidth: 1px,
  tabButtonActiveContentBorderStyle: 'solid',
  tabListBackgroundColor: 'transparent',
  tabsRowBorderColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd",
    "linked": true
  },
  tabsRowBorderWidth: 0px,
  tabsRowBorderStyle: {
    "top": "solid",
    "right": "solid",
    "bottom": "solid",
    "left": "solid",
    "linked": true
  },
  tabsRowSpacing: 0.5rem,
  tabsButtonGap: 0.5rem,
  stretchButtonsToRow: false,
  tabListAlignment: 'flex-start',
  enableTabsListContentBorder: false,
  tabsListContentBorderColor: 'transparent',
  tabsListContentBorderWidth: 1px,
  tabsListContentBorderStyle: 'solid',
  panelBackgroundColor: '#ffffff',
  panelBorderColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd",
    "linked": true
  },
  panelBorderWidth: 1px,
  panelBorderStyle: {
    "top": "solid",
    "right": "solid",
    "bottom": "solid",
    "left": "solid",
    "linked": true
  },
  panelBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4
  },
  showIcon: true,
  iconPosition: 'right',
  iconColor: '#666666',
  iconSize: 1rem,
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: 0deg,
  iconRotationActive: 180deg,
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface TabsThemeAttributes {
  tabsWidth?: string;
  headingLevel?: string;
  tabsHorizontalAlign?: string;
  orientation?: string;
  activationMode?: string;
  title?: string;
  tabs?: any[];
  tabsData?: any[];
  currentTheme?: string;
  uniqueId?: string;
  blockId?: string;
  borderColor?: Record<string, any>;
  borderWidth?: number;
  borderStyle?: Record<string, any>;
  borderRadius?: Record<string, any>;
  shadow?: string;
  shadowHover?: string;
  tabButtonColor?: string;
  tabButtonBackgroundColor?: string;
  tabButtonHoverColor?: string;
  tabButtonHoverBackgroundColor?: string;
  tabButtonActiveColor?: string;
  tabButtonActiveBackgroundColor?: string;
  tabButtonFontSize?: number;
  tabButtonFontWeight?: string;
  tabButtonFontStyle?: string;
  tabButtonTextTransform?: string;
  tabButtonTextDecoration?: string;
  tabButtonTextAlign?: string;
  tabButtonPadding?: number;
  tabButtonActiveFontWeight?: string;
  tabButtonBorderColor?: Record<string, any>;
  tabButtonActiveBorderColor?: Record<string, any>;
  tabButtonBorderWidth?: number;
  tabButtonBorderStyle?: Record<string, any>;
  tabButtonBorderRadius?: Record<string, any>;
  tabButtonShadow?: string;
  tabButtonShadowHover?: string;
  enableFocusBorder?: boolean;
  tabButtonActiveContentBorderColor?: string;
  tabButtonActiveContentBorderWidth?: number;
  tabButtonActiveContentBorderStyle?: string;
  tabListBackgroundColor?: string;
  tabsRowBorderColor?: Record<string, any>;
  tabsRowBorderWidth?: number;
  tabsRowBorderStyle?: Record<string, any>;
  tabsRowSpacing?: number;
  tabsButtonGap?: number;
  stretchButtonsToRow?: boolean;
  tabListAlignment?: string;
  enableTabsListContentBorder?: boolean;
  tabsListContentBorderColor?: string;
  tabsListContentBorderWidth?: number;
  tabsListContentBorderStyle?: string;
  panelBackgroundColor?: string;
  panelBorderColor?: Record<string, any>;
  panelBorderWidth?: number;
  panelBorderStyle?: Record<string, any>;
  panelBorderRadius?: Record<string, any>;
  showIcon?: boolean;
  iconPosition?: string;
  iconColor?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
  iconRotationActive?: number;
}
