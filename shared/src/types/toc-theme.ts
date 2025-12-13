/**
 * TypeScript Type Definitions for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-12-13T00:48:15.548Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Theme interface for Table of Contents block
 * Contains all themeable attributes
 */
export interface TocTheme {
  /** Background color of the TOC wrapper */
  wrapperBackgroundColor?: string;
  /** Border color of the TOC wrapper */
  blockBorderColor?: string;
  /** Text color for the TOC title */
  titleColor?: string;
  /** Background color for the TOC title */
  titleBackgroundColor?: string;
  /** Default color for TOC links */
  linkColor?: string;
  /** Color when hovering over links */
  linkHoverColor?: string;
  /** Color for the currently active link */
  linkActiveColor?: string;
  /** Color for visited links */
  linkVisitedColor?: string;
  /** Color for list numbering */
  numberingColor?: string;
  /** Text color for level 1 headings (H2) */
  level1Color?: string;
  /** Text color for level 2 headings (H3) */
  level2Color?: string;
  /** Text color for level 3+ headings (H4-H6) */
  level3PlusColor?: string;
  /** Color of the collapse/expand icon */
  collapseIconColor?: string;
  /** Font size for the TOC title in pixels */
  titleFontSize?: number;
  /** Font weight for the TOC title */
  titleFontWeight?: string;
  /** Text transformation for the title */
  titleTextTransform?: string | undefined;
  /** Text alignment for the title */
  titleAlignment?: string;
  /** Font size for level 1 items (H2) in pixels */
  level1FontSize?: number;
  /** Font weight for level 1 items */
  level1FontWeight?: string;
  /** Font style for level 1 items */
  level1FontStyle?: string;
  /** Text transformation for level 1 items */
  level1TextTransform?: string;
  /** Text decoration for level 1 items */
  level1TextDecoration?: string;
  /** Font size for level 2 items (H3) in pixels */
  level2FontSize?: number;
  /** Font weight for level 2 items */
  level2FontWeight?: string;
  /** Font style for level 2 items */
  level2FontStyle?: string;
  /** Text transformation for level 2 items */
  level2TextTransform?: string;
  /** Text decoration for level 2 items */
  level2TextDecoration?: string;
  /** Font size for level 3+ items (H4-H6) in pixels */
  level3PlusFontSize?: number;
  /** Font weight for level 3+ items */
  level3PlusFontWeight?: string;
  /** Font style for level 3+ items */
  level3PlusFontStyle?: string;
  /** Text transformation for level 3+ items */
  level3PlusTextTransform?: string;
  /** Text decoration for level 3+ items */
  level3PlusTextDecoration?: string;
  /** Width of the wrapper border in pixels */
  blockBorderWidth?: number;
  /** Style of the wrapper border */
  blockBorderStyle?: string;
  /** Corner radius of the wrapper */
  blockBorderRadius?: Record<string, any>;
  /** CSS box-shadow for the wrapper */
  blockShadow?: string;
  /** CSS box-shadow for the wrapper on hover */
  blockShadowHover?: string;
  /** Padding inside the TOC wrapper */
  wrapperPadding?: number;
  /** Left padding for the list */
  listPaddingLeft?: number | undefined;
  /** Vertical space between TOC items */
  itemSpacing?: number;
  /** Indentation per heading level */
  levelIndent?: number;
  /** Top offset for sticky/fixed positioning */
  positionTop?: number;
  /** Stack order for positioned TOC */
  zIndex?: number;
  /** Size of the collapse/expand icon */
  collapseIconSize?: number;
}

/**
 * Default theme values for Table of Contents block
 */
export const tocDefaultTheme: TocTheme = {
  wrapperBackgroundColor: '#ffffff',
  blockBorderColor: '#dddddd',
  titleColor: '#333333',
  titleBackgroundColor: 'transparent',
  linkColor: '#0073aa',
  linkHoverColor: '#005177',
  linkActiveColor: '#005177',
  linkVisitedColor: '#0073aa',
  numberingColor: '#0073aa',
  level1Color: '#0073aa',
  level2Color: '#0073aa',
  level3PlusColor: '#0073aa',
  collapseIconColor: '#666666',
  titleFontSize: 20,
  titleFontWeight: '700',
  titleAlignment: 'left',
  level1FontSize: 18,
  level1FontWeight: '600',
  level1FontStyle: 'normal',
  level1TextTransform: 'none',
  level1TextDecoration: 'none',
  level2FontSize: 16,
  level2FontWeight: 'normal',
  level2FontStyle: 'normal',
  level2TextTransform: 'none',
  level2TextDecoration: 'none',
  level3PlusFontSize: 14,
  level3PlusFontWeight: 'normal',
  level3PlusFontStyle: 'normal',
  level3PlusTextTransform: 'none',
  level3PlusTextDecoration: 'none',
  blockBorderWidth: 1,
  blockBorderStyle: 'solid',
  blockBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4
  },
  blockShadow: 'none',
  blockShadowHover: 'none',
  wrapperPadding: 20,
  itemSpacing: 8,
  levelIndent: 20,
  positionTop: 100,
  zIndex: 100,
  collapseIconSize: 20,
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface TocThemeAttributes {
  tocId?: string;
  showTitle?: boolean;
  titleText?: string;
  currentTheme?: string;
  filterMode?: string;
  includeLevels?: any[];
  includeClasses?: string;
  excludeLevels?: any[];
  excludeClasses?: string;
  depthLimit?: number | undefined;
  numberingStyle?: string;
  isCollapsible?: boolean;
  initiallyCollapsed?: boolean;
  positionType?: string;
  smoothScroll?: boolean;
  scrollOffset?: number;
  autoHighlight?: boolean;
  clickBehavior?: string;
  tocWidth?: string;
  tocHorizontalAlign?: string;
  wrapperBackgroundColor?: string;
  blockBorderColor?: string;
  titleColor?: string;
  titleBackgroundColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
  linkActiveColor?: string;
  linkVisitedColor?: string;
  numberingColor?: string;
  level1Color?: string;
  level2Color?: string;
  level3PlusColor?: string;
  collapseIconColor?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  titleTextTransform?: string | undefined;
  titleAlignment?: string;
  level1FontSize?: number;
  level1FontWeight?: string;
  level1FontStyle?: string;
  level1TextTransform?: string;
  level1TextDecoration?: string;
  level2FontSize?: number;
  level2FontWeight?: string;
  level2FontStyle?: string;
  level2TextTransform?: string;
  level2TextDecoration?: string;
  level3PlusFontSize?: number;
  level3PlusFontWeight?: string;
  level3PlusFontStyle?: string;
  level3PlusTextTransform?: string;
  level3PlusTextDecoration?: string;
  blockBorderWidth?: number;
  blockBorderStyle?: string;
  blockBorderRadius?: Record<string, any>;
  blockShadow?: string;
  blockShadowHover?: string;
  wrapperPadding?: number;
  listPaddingLeft?: number | undefined;
  itemSpacing?: number;
  levelIndent?: number;
  positionTop?: number;
  zIndex?: number;
  collapseIconSize?: number;
}
