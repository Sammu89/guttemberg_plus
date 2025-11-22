/**
 * TypeScript Type Definitions for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-11-22T17:16:11.904Z
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
  /** Text color for inactive tab buttons */
  titleColor?: string;
  /** Background color for inactive tab buttons */
  titleBackgroundColor?: string;
  /** Text color when hovering over tab */
  hoverTitleColor?: string;
  /** Background color when hovering over tab */
  hoverTitleBackgroundColor?: string;
  /** Text color for active tab */
  activeTitleColor?: string | undefined;
  /** Background color for active tab */
  activeTitleBackgroundColor?: string | undefined;
  /** Text color for the active tab button */
  tabButtonActiveColor?: string;
  /** Background color for the active tab button */
  tabButtonActiveBackground?: string;
  /** Border color for the active tab */
  tabButtonActiveBorderColor?: string;
  /** Bottom border color for active tab (creates connected effect) */
  tabButtonActiveBorderBottomColor?: string;
  /** Text color for content area */
  contentColor?: string | undefined;
  /** Background color for content area */
  contentBackgroundColor?: string | undefined;
  /** Background color for tab panels */
  panelBackground?: string;
  /** Text color for tab panels */
  panelColor?: string;
  /** Background color for the tab navigation bar */
  tabListBackground?: string;
  /** Border color for individual tabs */
  tabBorderColor?: string | undefined;
  /** Border color for tabs container */
  containerBorderColor?: string;
  /** Border color for tab panels */
  panelBorderColor?: string;
  /** Bottom border color of tab navigation */
  tabListBorderBottomColor?: string;
  /** Color of divider between tabs and panel */
  dividerColor?: string | undefined;
  /** General border color */
  borderColor?: string | undefined;
  /** Border color for accordion fallback mode */
  accordionBorderColor?: string | undefined;
  /** Border color for divider */
  dividerBorderColor?: string | undefined;
  /** Color of tab icons */
  iconColor?: string;
  /** Font size for tab buttons in pixels */
  titleFontSize?: number;
  /** Font weight for tab buttons */
  titleFontWeight?: string;
  /** Font family for tab buttons */
  titleFontFamily?: string | undefined;
  /** Line height for tab buttons */
  titleLineHeight?: number | undefined;
  /** Font style for tab buttons */
  titleFontStyle?: string;
  /** Text transformation for tab buttons */
  titleTextTransform?: string;
  /** Text decoration for tab buttons */
  titleTextDecoration?: string;
  /** Text alignment for tab buttons */
  titleAlignment?: string;
  /** Font size for panel content in pixels */
  contentFontSize?: number | undefined;
  /** Font weight for panel content */
  contentFontWeight?: string | undefined;
  /** Font family for panel content */
  contentFontFamily?: string | undefined;
  /** Line height for panel content */
  contentLineHeight?: number | undefined;
  /** Font style for panel content */
  contentFontStyle?: string | undefined;
  /** Text transformation for panel content */
  contentTextTransform?: string | undefined;
  /** Text decoration for panel content */
  contentTextDecoration?: string | undefined;
  /** Font size for panel content */
  panelFontSize?: number;
  /** Line height for panel content */
  panelLineHeight?: number;
  /** Text alignment for vertical tabs */
  verticalTabButtonTextAlign?: string;
  /** Border width for individual tabs */
  tabBorderThickness?: number | undefined;
  /** Border style for individual tabs */
  tabBorderStyle?: string | undefined;
  /** Corner radius for individual tabs */
  tabBorderRadius?: Record<string, any>;
  /** Box shadow for tab buttons */
  tabShadow?: string | undefined;
  /** Per-corner border radius for tab buttons */
  tabButtonBorderRadius?: Record<string, any> | undefined;
  /** Border width for the tabs container */
  containerBorderWidth?: number;
  /** Border style for the tabs container */
  containerBorderStyle?: string;
  /** Corner radius for the tabs container */
  containerBorderRadius?: Record<string, any>;
  /** Box shadow for the tabs container */
  containerShadow?: string;
  /** Border width for tab panels */
  panelBorderWidth?: number;
  /** Border style for tab panels */
  panelBorderStyle?: string;
  /** Corner radius for tab panels */
  panelBorderRadius?: number;
  /** Bottom border width of tab navigation */
  tabListBorderBottomWidth?: number;
  /** Bottom border style of tab navigation */
  tabListBorderBottomStyle?: string;
  /** Thickness of divider between tabs and panel */
  dividerThickness?: number | undefined;
  /** Style of divider between tabs and panel */
  dividerStyle?: string | undefined;
  /** Border width for accordion fallback mode */
  accordionBorderThickness?: number | undefined;
  /** Border style for accordion fallback mode */
  accordionBorderStyle?: string | undefined;
  /** Border radius for accordion fallback mode */
  accordionBorderRadius?: Record<string, any> | undefined;
  /** Box shadow for accordion fallback mode */
  accordionShadow?: string | undefined;
  /** Generic border width */
  borderWidth?: string | undefined;
  /** Generic border radius */
  borderRadius?: string | undefined;
  /** Thickness of divider border */
  dividerBorderThickness?: number | undefined;
  /** Style of divider border */
  dividerBorderStyle?: string | undefined;
  /** Padding inside tab buttons */
  titlePadding?: Record<string, any>;
  /** Padding inside content area */
  contentPadding?: Record<string, any> | undefined;
  /** Padding inside tab panels */
  panelPadding?: Record<string, any>;
  /** Padding around the tab navigation */
  tabListPadding?: Record<string, any>;
  /** Space between tab buttons */
  tabListGap?: number;
  /** Horizontal alignment of tabs */
  tabsAlignment?: string;
  /** Width of tab list in vertical orientation */
  verticalTabListWidth?: number;
  /** Space below the tabs container */
  accordionMarginBottom?: number | undefined;
  /** Spacing between items */
  itemSpacing?: number | undefined;
  /** Display icons in tab buttons */
  showIcon?: boolean;
  /** Position of icon relative to text */
  iconPosition?: string;
  /** Size of tab icons in pixels */
  iconSize?: number;
  /** Icon for closed state (accordion fallback) */
  iconTypeClosed?: string;
  /** Icon for open state (accordion fallback) */
  iconTypeOpen?: string;
  /** Rotation angle when open (degrees) */
  iconRotation?: number;
}

/**
 * Default theme values for Tabs block
 */
export const tabsDefaultTheme: TabsTheme = {
  titleColor: '#666666',
  titleBackgroundColor: 'transparent',
  hoverTitleColor: '#333333',
  hoverTitleBackgroundColor: '#e8e8e8',
  tabButtonActiveColor: '#000000',
  tabButtonActiveBackground: '#ffffff',
  tabButtonActiveBorderColor: '#dddddd',
  tabButtonActiveBorderBottomColor: 'transparent',
  panelBackground: '#ffffff',
  panelColor: '#333333',
  tabListBackground: '#f5f5f5',
  containerBorderColor: 'transparent',
  panelBorderColor: '#dddddd',
  tabListBorderBottomColor: '#dddddd',
  iconColor: 'inherit',
  titleFontSize: 16,
  titleFontWeight: '500',
  titleFontStyle: 'normal',
  titleTextTransform: 'none',
  titleTextDecoration: 'none',
  titleAlignment: 'center',
  panelFontSize: 16,
  panelLineHeight: 1.6,
  verticalTabButtonTextAlign: 'left',
  tabBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 0,
    "bottomLeft": 0
  },
  containerBorderWidth: 0,
  containerBorderStyle: 'solid',
  containerBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4
  },
  containerShadow: 'none',
  panelBorderWidth: 1,
  panelBorderStyle: 'solid',
  panelBorderRadius: 0,
  tabListBorderBottomWidth: 2,
  tabListBorderBottomStyle: 'solid',
  titlePadding: {
    "top": 12,
    "right": 24,
    "bottom": 12,
    "left": 24
  },
  panelPadding: {
    "top": 24,
    "right": 24,
    "bottom": 24,
    "left": 24
  },
  tabListPadding: {
    "top": 8,
    "right": 8,
    "bottom": 8,
    "left": 8
  },
  tabListGap: 4,
  tabsAlignment: 'left',
  verticalTabListWidth: 200,
  showIcon: true,
  iconPosition: 'right',
  iconSize: 18,
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: 180,
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
  currentTab?: number;
  responsiveBreakpoint?: number;
  enableResponsiveFallback?: boolean;
  headingLevel?: string;
  useHeadingStyles?: boolean;
  initiallyOpen?: boolean;
  title?: string;
  content?: string;
  accordionId?: string;
  titleColor?: string;
  titleBackgroundColor?: string;
  hoverTitleColor?: string;
  hoverTitleBackgroundColor?: string;
  activeTitleColor?: string | undefined;
  activeTitleBackgroundColor?: string | undefined;
  tabButtonActiveColor?: string;
  tabButtonActiveBackground?: string;
  tabButtonActiveBorderColor?: string;
  tabButtonActiveBorderBottomColor?: string;
  contentColor?: string | undefined;
  contentBackgroundColor?: string | undefined;
  panelBackground?: string;
  panelColor?: string;
  tabListBackground?: string;
  tabBorderColor?: string | undefined;
  containerBorderColor?: string;
  panelBorderColor?: string;
  tabListBorderBottomColor?: string;
  dividerColor?: string | undefined;
  borderColor?: string | undefined;
  accordionBorderColor?: string | undefined;
  dividerBorderColor?: string | undefined;
  iconColor?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  titleFontFamily?: string | undefined;
  titleLineHeight?: number | undefined;
  titleFontStyle?: string;
  titleTextTransform?: string;
  titleTextDecoration?: string;
  titleAlignment?: string;
  contentFontSize?: number | undefined;
  contentFontWeight?: string | undefined;
  contentFontFamily?: string | undefined;
  contentLineHeight?: number | undefined;
  contentFontStyle?: string | undefined;
  contentTextTransform?: string | undefined;
  contentTextDecoration?: string | undefined;
  panelFontSize?: number;
  panelLineHeight?: number;
  verticalTabButtonTextAlign?: string;
  tabBorderThickness?: number | undefined;
  tabBorderStyle?: string | undefined;
  tabBorderRadius?: Record<string, any>;
  tabShadow?: string | undefined;
  tabButtonBorderRadius?: Record<string, any> | undefined;
  containerBorderWidth?: number;
  containerBorderStyle?: string;
  containerBorderRadius?: Record<string, any>;
  containerShadow?: string;
  panelBorderWidth?: number;
  panelBorderStyle?: string;
  panelBorderRadius?: number;
  tabListBorderBottomWidth?: number;
  tabListBorderBottomStyle?: string;
  dividerThickness?: number | undefined;
  dividerStyle?: string | undefined;
  accordionBorderThickness?: number | undefined;
  accordionBorderStyle?: string | undefined;
  accordionBorderRadius?: Record<string, any> | undefined;
  accordionShadow?: string | undefined;
  borderWidth?: string | undefined;
  borderRadius?: string | undefined;
  dividerBorderThickness?: number | undefined;
  dividerBorderStyle?: string | undefined;
  titlePadding?: Record<string, any>;
  contentPadding?: Record<string, any> | undefined;
  panelPadding?: Record<string, any>;
  tabListPadding?: Record<string, any>;
  tabListGap?: number;
  tabsAlignment?: string;
  verticalTabListWidth?: number;
  accordionMarginBottom?: number | undefined;
  itemSpacing?: number | undefined;
  showIcon?: boolean;
  iconPosition?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
}
