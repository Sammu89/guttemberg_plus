/**
 * TypeScript Type Definitions for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-12-26T00:11:13.650Z
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
  /** Include H1 headings in TOC */
  includeH1?: boolean;
  includeH2?: boolean;
  includeH3?: boolean;
  includeH4?: boolean;
  includeH5?: boolean;
  includeH6?: boolean;
  /** Which heading levels to include (H1-H6) - derived from includeH1-H6 toggles */
  includeLevels?: any[];
  /** CSS classes to include in TOC */
  includeClasses?: string;
  /** Which heading levels to exclude */
  excludeLevels?: any[];
  /** CSS classes to exclude from TOC */
  excludeClasses?: string;
  /** Include headings from accordion blocks when they have a heading level set */
  includeAccordions?: boolean;
  /** Include headings from tabs blocks when they have a heading level set */
  includeTabs?: boolean;
  /** CSS positioning type */
  positionType?: string;
  /** Enable smooth scrolling to headings */
  smoothScroll?: boolean;
  /** Offset in pixels when scrolling to heading */
  scrollOffset?: number;
  /** Highlight current section in TOC */
  autoHighlight?: boolean;
  /** What happens when clicking a TOC item */
  clickBehavior?: string;
  /** Background color of the TOC wrapper */
  wrapperBackgroundColor?: string;
  /** Border color of the TOC wrapper */
  blockBorderColor?: string;
  /** Text color for the TOC header */
  titleColor?: string;
  /** Background color for the TOC header */
  titleBackgroundColor?: string;
  /** Text color when hovering over title */
  hoverTitleColor?: string;
  /** Background color when hovering over title */
  hoverTitleBackgroundColor?: string;
  /** Use the same link colors for all heading levels */
  unifiedLinkColors?: boolean;
  /** Default color for all TOC links */
  linkColor?: string;
  /** Color when hovering over links */
  linkHoverColor?: string;
  /** Color for the currently active link */
  linkActiveColor?: string;
  /** Color for visited links */
  linkVisitedColor?: string;
  /** Numbering style for H1 headings */
  h1NumberingStyle?: string;
  /** Numbering style for H2 headings */
  h2NumberingStyle?: string;
  /** Numbering style for H3 headings */
  h3NumberingStyle?: string;
  /** Numbering style for H4 headings */
  h4NumberingStyle?: string;
  /** Numbering style for H5 headings */
  h5NumberingStyle?: string;
  /** Numbering style for H6 headings */
  h6NumberingStyle?: string;
  /** Link color for H1 headings (inherits general color if not set) */
  h1Color?: string;
  h1HoverColor?: string;
  h1VisitedColor?: string;
  h1ActiveColor?: string;
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
  /** Link color for H2 headings (inherits general color if not set) */
  h2Color?: string;
  h2HoverColor?: string;
  h2VisitedColor?: string;
  h2ActiveColor?: string;
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
  /** Link color for H3 headings (inherits general color if not set) */
  h3Color?: string;
  h3HoverColor?: string;
  h3VisitedColor?: string;
  h3ActiveColor?: string;
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
  /** Link color for H4 headings (inherits general color if not set) */
  h4Color?: string;
  h4HoverColor?: string;
  h4VisitedColor?: string;
  h4ActiveColor?: string;
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
  /** Link color for H5 headings (inherits general color if not set) */
  h5Color?: string;
  h5HoverColor?: string;
  h5VisitedColor?: string;
  h5ActiveColor?: string;
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
  /** Link color for H6 headings (inherits general color if not set) */
  h6Color?: string;
  h6HoverColor?: string;
  h6VisitedColor?: string;
  h6ActiveColor?: string;
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
  /** Display expand/collapse icon */
  showIcon?: boolean;
  /** Position of icon relative to title */
  iconPosition?: string;
  /** Size of the icon in rem */
  iconSize?: number;
  /** Icon when TOC is collapsed */
  iconTypeClosed?: string;
  /** Icon when TOC is expanded (none = use iconTypeClosed with rotation) */
  iconTypeOpen?: string;
  /** Rotation angle when open (degrees) */
  iconRotation?: number;
  /** Color of the expand/collapse icon */
  iconColor?: string;
  /** Font size for the TOC header in rem */
  titleFontSize?: number;
  /** Font weight for the TOC header */
  titleFontWeight?: string;
  titleFontStyle?: string;
  /** Text transformation for the header */
  titleTextTransform?: string;
  titleTextDecoration?: string;
  /** Text alignment for the header */
  titleAlignment?: string;
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
  /** Vertical space between TOC items (rem) */
  itemSpacing?: number;
  /** Indent headings based on document hierarchy (e.g., H3 under H2 indents once) */
  enableHierarchicalIndent?: boolean;
  /** Amount to indent each nested level */
  levelIndent?: string;
  /** Top offset for sticky/fixed positioning (rem) */
  positionTop?: number;
  /** Stack order for positioned TOC */
  zIndex?: number;
  /** Which side to anchor the TOC (sticky/fixed positioning) */
  positionHorizontalSide?: string;
  /** Distance from the selected side */
  positionHorizontalOffset?: string;
}

/**
 * Default theme values for Table of Contents block
 */
export const tocDefaultTheme: TocTheme = {
  includeH1: false,
  includeH2: true,
  includeH3: true,
  includeH4: true,
  includeH5: true,
  includeH6: true,
  includeLevels: [
    2,
    3,
    4,
    5,
    6
  ],
  includeClasses: '',
  excludeLevels: [],
  excludeClasses: '',
  includeAccordions: true,
  includeTabs: true,
  positionType: 'normal',
  smoothScroll: true,
  scrollOffset: 0,
  autoHighlight: true,
  clickBehavior: 'navigate',
  wrapperBackgroundColor: '#ffffff',
  blockBorderColor: '#dddddd',
  titleColor: '#333333',
  titleBackgroundColor: 'transparent',
  hoverTitleColor: '#000000',
  hoverTitleBackgroundColor: 'transparent',
  unifiedLinkColors: true,
  linkColor: '#0073aa',
  linkHoverColor: '#005177',
  linkActiveColor: '#005177',
  linkVisitedColor: '#0073aa',
  h1NumberingStyle: 'decimal',
  h2NumberingStyle: 'decimal',
  h3NumberingStyle: 'decimal',
  h4NumberingStyle: 'decimal',
  h5NumberingStyle: 'decimal',
  h6NumberingStyle: 'decimal',
  h1Color: 'inherit',
  h1HoverColor: 'inherit',
  h1VisitedColor: 'inherit',
  h1ActiveColor: 'inherit',
  h1FontSize: 1.5,
  h1FontWeight: '700',
  h1FontStyle: 'normal',
  h1TextTransform: 'none',
  h1TextDecoration: 'none',
  h2Color: 'inherit',
  h2HoverColor: 'inherit',
  h2VisitedColor: 'inherit',
  h2ActiveColor: 'inherit',
  h2FontSize: 1.25,
  h2FontWeight: '600',
  h2FontStyle: 'normal',
  h2TextTransform: 'none',
  h2TextDecoration: 'none',
  h3Color: 'inherit',
  h3HoverColor: 'inherit',
  h3VisitedColor: 'inherit',
  h3ActiveColor: 'inherit',
  h3FontSize: 1.125,
  h3FontWeight: '500',
  h3FontStyle: 'normal',
  h3TextTransform: 'none',
  h3TextDecoration: 'none',
  h4Color: 'inherit',
  h4HoverColor: 'inherit',
  h4VisitedColor: 'inherit',
  h4ActiveColor: 'inherit',
  h4FontSize: 1,
  h4FontWeight: 'normal',
  h4FontStyle: 'normal',
  h4TextTransform: 'none',
  h4TextDecoration: 'none',
  h5Color: 'inherit',
  h5HoverColor: 'inherit',
  h5VisitedColor: 'inherit',
  h5ActiveColor: 'inherit',
  h5FontSize: 0.9375,
  h5FontWeight: 'normal',
  h5FontStyle: 'normal',
  h5TextTransform: 'none',
  h5TextDecoration: 'none',
  h6Color: 'inherit',
  h6HoverColor: 'inherit',
  h6VisitedColor: 'inherit',
  h6ActiveColor: 'inherit',
  h6FontSize: 0.875,
  h6FontWeight: 'normal',
  h6FontStyle: 'normal',
  h6TextTransform: 'none',
  h6TextDecoration: 'none',
  showIcon: true,
  iconPosition: 'right',
  iconSize: 1.25,
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: 180,
  iconColor: '#666666',
  titleFontSize: 1.25,
  titleFontWeight: '700',
  titleFontStyle: 'normal',
  titleTextTransform: 'none',
  titleTextDecoration: 'none',
  titleAlignment: 'left',
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
  itemSpacing: 0.5,
  enableHierarchicalIndent: true,
  levelIndent: '1.25rem',
  positionTop: 6.25,
  zIndex: 100,
  positionHorizontalSide: 'right',
  positionHorizontalOffset: '1.25rem',
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
  includeH1?: boolean;
  includeH2?: boolean;
  includeH3?: boolean;
  includeH4?: boolean;
  includeH5?: boolean;
  includeH6?: boolean;
  includeLevels?: any[];
  includeClasses?: string;
  excludeLevels?: any[];
  excludeClasses?: string;
  includeAccordions?: boolean;
  includeTabs?: boolean;
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
  hoverTitleColor?: string;
  hoverTitleBackgroundColor?: string;
  unifiedLinkColors?: boolean;
  linkColor?: string;
  linkHoverColor?: string;
  linkActiveColor?: string;
  linkVisitedColor?: string;
  h1NumberingStyle?: string;
  h2NumberingStyle?: string;
  h3NumberingStyle?: string;
  h4NumberingStyle?: string;
  h5NumberingStyle?: string;
  h6NumberingStyle?: string;
  h1Color?: string;
  h1HoverColor?: string;
  h1VisitedColor?: string;
  h1ActiveColor?: string;
  h1FontSize?: number;
  h1FontWeight?: string;
  h1FontStyle?: string;
  h1TextTransform?: string;
  h1TextDecoration?: string;
  h2Color?: string;
  h2HoverColor?: string;
  h2VisitedColor?: string;
  h2ActiveColor?: string;
  h2FontSize?: number;
  h2FontWeight?: string;
  h2FontStyle?: string;
  h2TextTransform?: string;
  h2TextDecoration?: string;
  h3Color?: string;
  h3HoverColor?: string;
  h3VisitedColor?: string;
  h3ActiveColor?: string;
  h3FontSize?: number;
  h3FontWeight?: string;
  h3FontStyle?: string;
  h3TextTransform?: string;
  h3TextDecoration?: string;
  h4Color?: string;
  h4HoverColor?: string;
  h4VisitedColor?: string;
  h4ActiveColor?: string;
  h4FontSize?: number;
  h4FontWeight?: string;
  h4FontStyle?: string;
  h4TextTransform?: string;
  h4TextDecoration?: string;
  h5Color?: string;
  h5HoverColor?: string;
  h5VisitedColor?: string;
  h5ActiveColor?: string;
  h5FontSize?: number;
  h5FontWeight?: string;
  h5FontStyle?: string;
  h5TextTransform?: string;
  h5TextDecoration?: string;
  h6Color?: string;
  h6HoverColor?: string;
  h6VisitedColor?: string;
  h6ActiveColor?: string;
  h6FontSize?: number;
  h6FontWeight?: string;
  h6FontStyle?: string;
  h6TextTransform?: string;
  h6TextDecoration?: string;
  showIcon?: boolean;
  iconPosition?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
  iconColor?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  titleFontStyle?: string;
  titleTextTransform?: string;
  titleTextDecoration?: string;
  titleAlignment?: string;
  blockBorderWidth?: number;
  blockBorderStyle?: string;
  blockBorderRadius?: Record<string, any>;
  blockShadow?: string;
  blockShadowHover?: string;
  wrapperPadding?: number;
  itemSpacing?: number;
  enableHierarchicalIndent?: boolean;
  levelIndent?: string;
  positionTop?: number;
  zIndex?: number;
  positionHorizontalSide?: string;
  positionHorizontalOffset?: string;
}
