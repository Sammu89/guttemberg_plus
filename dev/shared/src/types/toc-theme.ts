/**
 * TypeScript Type Definitions for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-12-22T19:13:33.425Z
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
  /** Text color for H1 headings */
  h1Color?: string;
  /** Font size for H1 headings in rem */
  h1FontSize?: number;
  /** Font weight for H1 headings */
  h1FontWeight?: string;
  /** Font style for H1 headings */
  h1FontStyle?: string;
  /** Text transformation for H1 headings */
  h1TextTransform?: string;
  /** Text decoration for H1 headings */
  h1TextDecoration?: string;
  /** Text color for H2 headings */
  h2Color?: string;
  /** Font size for H2 headings in rem */
  h2FontSize?: number;
  /** Font weight for H2 headings */
  h2FontWeight?: string;
  /** Font style for H2 headings */
  h2FontStyle?: string;
  /** Text transformation for H2 headings */
  h2TextTransform?: string;
  /** Text decoration for H2 headings */
  h2TextDecoration?: string;
  /** Text color for H3 headings */
  h3Color?: string;
  /** Font size for H3 headings in rem */
  h3FontSize?: number;
  /** Font weight for H3 headings */
  h3FontWeight?: string;
  /** Font style for H3 headings */
  h3FontStyle?: string;
  /** Text transformation for H3 headings */
  h3TextTransform?: string;
  /** Text decoration for H3 headings */
  h3TextDecoration?: string;
  /** Text color for H4 headings */
  h4Color?: string;
  /** Font size for H4 headings in rem */
  h4FontSize?: number;
  /** Font weight for H4 headings */
  h4FontWeight?: string;
  /** Font style for H4 headings */
  h4FontStyle?: string;
  /** Text transformation for H4 headings */
  h4TextTransform?: string;
  /** Text decoration for H4 headings */
  h4TextDecoration?: string;
  /** Text color for H5 headings */
  h5Color?: string;
  /** Font size for H5 headings in rem */
  h5FontSize?: number;
  /** Font weight for H5 headings */
  h5FontWeight?: string;
  /** Font style for H5 headings */
  h5FontStyle?: string;
  /** Text transformation for H5 headings */
  h5TextTransform?: string;
  /** Text decoration for H5 headings */
  h5TextDecoration?: string;
  /** Text color for H6 headings */
  h6Color?: string;
  /** Font size for H6 headings in rem */
  h6FontSize?: number;
  /** Font weight for H6 headings */
  h6FontWeight?: string;
  /** Font style for H6 headings */
  h6FontStyle?: string;
  /** Text transformation for H6 headings */
  h6TextTransform?: string;
  /** Text decoration for H6 headings */
  h6TextDecoration?: string;
  /** Color of the collapse/expand icon */
  collapseIconColor?: string;
  /** Font size for the TOC title in rem */
  titleFontSize?: number;
  /** Font weight for the TOC title */
  titleFontWeight?: string;
  /** Text transformation for the title */
  titleTextTransform?: string;
  /** Text alignment for the title */
  titleAlignment?: string;
  /** Padding around the title */
  titlePadding?: Record<string, any>;
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
  /** Padding inside the TOC wrapper (rem) */
  wrapperPadding?: number;
  /** Left padding for the list (rem) */
  listPaddingLeft?: number;
  /** Vertical space between TOC items (rem) */
  itemSpacing?: number;
  /** Amount to indent each nested level */
  levelIndent?: string;
  /** Top offset for sticky/fixed positioning (rem) */
  positionTop?: number;
  /** Stack order for positioned TOC */
  zIndex?: number;
  /** Size of the collapse/expand icon (rem) */
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
  h1Color: '#0073aa',
  h1FontSize: 1.5,
  h1FontWeight: '700',
  h1FontStyle: 'normal',
  h1TextTransform: 'none',
  h1TextDecoration: 'none',
  h2Color: '#0073aa',
  h2FontSize: 1.25,
  h2FontWeight: '600',
  h2FontStyle: 'normal',
  h2TextTransform: 'none',
  h2TextDecoration: 'none',
  h3Color: '#0073aa',
  h3FontSize: 1.125,
  h3FontWeight: '500',
  h3FontStyle: 'normal',
  h3TextTransform: 'none',
  h3TextDecoration: 'none',
  h4Color: '#0073aa',
  h4FontSize: 1,
  h4FontWeight: 'normal',
  h4FontStyle: 'normal',
  h4TextTransform: 'none',
  h4TextDecoration: 'none',
  h5Color: '#0073aa',
  h5FontSize: 0.9375,
  h5FontWeight: 'normal',
  h5FontStyle: 'normal',
  h5TextTransform: 'none',
  h5TextDecoration: 'none',
  h6Color: '#0073aa',
  h6FontSize: 0.875,
  h6FontWeight: 'normal',
  h6FontStyle: 'normal',
  h6TextTransform: 'none',
  h6TextDecoration: 'none',
  collapseIconColor: '#666666',
  titleFontSize: 1.25,
  titleFontWeight: '700',
  titleTextTransform: 'none',
  titleAlignment: 'left',
  titlePadding: {
    "top": 0,
    "right": 0,
    "bottom": 12,
    "left": 0
  },
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
  wrapperPadding: 1.25,
  listPaddingLeft: 1.5,
  itemSpacing: 0.5,
  levelIndent: '1.25rem',
  positionTop: 6.25,
  zIndex: 100,
  collapseIconSize: 1.25,
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface TocThemeAttributes {
  tocId?: string;
  showTitle?: boolean;
  titleText?: string;
  currentTheme?: string;
  tocItems?: any[];
  deletedHeadingIds?: any[];
  filterMode?: string;
  includeLevels?: any[];
  includeClasses?: string;
  excludeLevels?: any[];
  excludeClasses?: string;
  depthLimit?: number | undefined;
  includeAccordions?: boolean;
  includeTabs?: boolean;
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
  h1Color?: string;
  h1FontSize?: number;
  h1FontWeight?: string;
  h1FontStyle?: string;
  h1TextTransform?: string;
  h1TextDecoration?: string;
  h2Color?: string;
  h2FontSize?: number;
  h2FontWeight?: string;
  h2FontStyle?: string;
  h2TextTransform?: string;
  h2TextDecoration?: string;
  h3Color?: string;
  h3FontSize?: number;
  h3FontWeight?: string;
  h3FontStyle?: string;
  h3TextTransform?: string;
  h3TextDecoration?: string;
  h4Color?: string;
  h4FontSize?: number;
  h4FontWeight?: string;
  h4FontStyle?: string;
  h4TextTransform?: string;
  h4TextDecoration?: string;
  h5Color?: string;
  h5FontSize?: number;
  h5FontWeight?: string;
  h5FontStyle?: string;
  h5TextTransform?: string;
  h5TextDecoration?: string;
  h6Color?: string;
  h6FontSize?: number;
  h6FontWeight?: string;
  h6FontStyle?: string;
  h6TextTransform?: string;
  h6TextDecoration?: string;
  collapseIconColor?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  titleTextTransform?: string;
  titleAlignment?: string;
  titlePadding?: Record<string, any>;
  blockBorderWidth?: number;
  blockBorderStyle?: string;
  blockBorderRadius?: Record<string, any>;
  blockShadow?: string;
  blockShadowHover?: string;
  wrapperPadding?: number;
  listPaddingLeft?: number;
  itemSpacing?: number;
  enableHierarchicalIndent?: boolean;
  levelIndent?: string;
  positionTop?: number;
  zIndex?: number;
  positionHorizontalSide?: string;
  positionHorizontalOffset?: string;
  collapseIconSize?: number;
}
