/**
 * TypeScript Type Definitions for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2026-01-06T10:21:52.403Z
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
  blockBorderColor?: Record<string, any>;
  /** Use the same link colors for all heading levels */
  unifiedLinkColors?: boolean;
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
  /** Font size for H1 headings in rem */
  h1FontSize?: string;
  /** Font weight for H1 headings */
  h1FontWeight?: string;
  /** Font style for H1 headings */
  h1FontStyle?: string;
  /** Text transformation for H1 headings */
  h1TextTransform?: string;
  /** Text decoration for H1 headings */
  h1TextDecoration?: string;
  /** Font size for H2 headings in rem */
  h2FontSize?: string;
  /** Font weight for H2 headings */
  h2FontWeight?: string;
  /** Font style for H2 headings */
  h2FontStyle?: string;
  /** Text transformation for H2 headings */
  h2TextTransform?: string;
  /** Text decoration for H2 headings */
  h2TextDecoration?: string;
  /** Font size for H3 headings in rem */
  h3FontSize?: string;
  /** Font weight for H3 headings */
  h3FontWeight?: string;
  /** Font style for H3 headings */
  h3FontStyle?: string;
  /** Text transformation for H3 headings */
  h3TextTransform?: string;
  /** Text decoration for H3 headings */
  h3TextDecoration?: string;
  /** Font size for H4 headings in rem */
  h4FontSize?: string;
  /** Font weight for H4 headings */
  h4FontWeight?: string;
  /** Font style for H4 headings */
  h4FontStyle?: string;
  /** Text transformation for H4 headings */
  h4TextTransform?: string;
  /** Text decoration for H4 headings */
  h4TextDecoration?: string;
  /** Font size for H5 headings in rem */
  h5FontSize?: string;
  /** Font weight for H5 headings */
  h5FontWeight?: string;
  /** Font style for H5 headings */
  h5FontStyle?: string;
  /** Text transformation for H5 headings */
  h5TextTransform?: string;
  /** Text decoration for H5 headings */
  h5TextDecoration?: string;
  /** Font size for H6 headings in rem */
  h6FontSize?: string;
  /** Font weight for H6 headings */
  h6FontWeight?: string;
  /** Font style for H6 headings */
  h6FontStyle?: string;
  /** Text transformation for H6 headings */
  h6TextTransform?: string;
  /** Text decoration for H6 headings */
  h6TextDecoration?: string;
  /** Display icon in the block */
  showIcon?: boolean;
  /** Use different icons for active and inactive states */
  useDifferentIcons?: boolean;
  /** Position of the icon relative to title */
  iconPosition?: string;
  /** Rotation angle applied during open/close transition */
  iconRotation?: string;
  /** Icon when closed */
  iconInactiveSource?: Record<string, any>;
  /** Icon color (for character/library icons) */
  iconInactiveColor?: string;
  /** Initial rotation of inactive icon */
  iconInactiveRotation?: string;
  /** Icon size (for character/library icons) */
  iconInactiveSize?: string;
  /** Maximum icon size (for image icons) */
  iconInactiveMaxSize?: string;
  /** Horizontal offset of icon */
  iconInactiveOffsetX?: string;
  /** Vertical offset of icon */
  iconInactiveOffsetY?: string;
  /** Icon when open */
  iconActiveSource?: Record<string, any>;
  /** Icon color (for character/library icons) */
  iconActiveColor?: string;
  /** Initial rotation of active icon */
  iconActiveRotation?: string;
  /** Icon size (for character/library icons) */
  iconActiveSize?: string;
  /** Maximum icon size (for image icons) */
  iconActiveMaxSize?: string;
  /** Horizontal offset of icon */
  iconActiveOffsetX?: string;
  /** Vertical offset of icon */
  iconActiveOffsetY?: string;
  /** Font size for the TOC header in rem */
  titleFontSize?: string;
  /** Font weight for the TOC header */
  titleFontWeight?: string;
  titleFontStyle?: string;
  /** Text transformation for the header */
  titleTextTransform?: string;
  titleTextDecoration?: string;
  /** Text alignment for the header */
  titleAlignment?: string;
  /** Width of the wrapper border in pixels */
  blockBorderWidth?: string;
  /** Style of the wrapper border */
  blockBorderStyle?: Record<string, any>;
  /** Corner radius of the wrapper */
  blockBorderRadius?: Record<string, any>;
  /** CSS box-shadow for the wrapper */
  blockShadow?: string;
  /** CSS box-shadow for the wrapper on hover */
  blockShadowHover?: string;
  /** Padding inside the TOC wrapper (rem) */
  wrapperPadding?: string;
  /** Vertical space between TOC items (rem) */
  itemSpacing?: string;
  /** Indent headings based on document hierarchy (e.g., H3 under H2 indents once) */
  enableHierarchicalIndent?: boolean;
  /** Amount to indent each nested level */
  levelIndent?: string;
  /** Top offset for sticky/fixed positioning (rem) */
  positionTop?: string;
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
  blockBorderColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd"
  },
  unifiedLinkColors: true,
  h1NumberingStyle: 'decimal',
  h2NumberingStyle: 'decimal',
  h3NumberingStyle: 'decimal',
  h4NumberingStyle: 'decimal',
  h5NumberingStyle: 'decimal',
  h6NumberingStyle: 'decimal',
  h1FontSize: '1.5rem',
  h1FontWeight: '700',
  h1FontStyle: 'normal',
  h1TextTransform: 'none',
  h1TextDecoration: 'none',
  h2FontSize: '1.25rem',
  h2FontWeight: '600',
  h2FontStyle: 'normal',
  h2TextTransform: 'none',
  h2TextDecoration: 'none',
  h3FontSize: '1.125rem',
  h3FontWeight: '500',
  h3FontStyle: 'normal',
  h3TextTransform: 'none',
  h3TextDecoration: 'none',
  h4FontSize: '1rem',
  h4FontWeight: 'normal',
  h4FontStyle: 'normal',
  h4TextTransform: 'none',
  h4TextDecoration: 'none',
  h5FontSize: '0.9375rem',
  h5FontWeight: 'normal',
  h5FontStyle: 'normal',
  h5TextTransform: 'none',
  h5TextDecoration: 'none',
  h6FontSize: '0.875rem',
  h6FontWeight: 'normal',
  h6FontStyle: 'normal',
  h6TextTransform: 'none',
  h6TextDecoration: 'none',
  showIcon: true,
  useDifferentIcons: false,
  iconPosition: 'right',
  iconRotation: '180deg',
  iconInactiveSource: {
    "kind": "char",
    "value": "▾"
  },
  iconInactiveColor: '#333333',
  iconInactiveRotation: '0deg',
  iconInactiveSize: '16px',
  iconInactiveMaxSize: '24px',
  iconInactiveOffsetX: '0px',
  iconInactiveOffsetY: '0px',
  iconActiveSource: {
    "kind": "char",
    "value": "▾"
  },
  iconActiveColor: '#333333',
  iconActiveRotation: '0deg',
  iconActiveSize: '16px',
  iconActiveMaxSize: '24px',
  iconActiveOffsetX: '0px',
  iconActiveOffsetY: '0px',
  titleFontSize: '1.25rem',
  titleFontWeight: '700',
  titleFontStyle: 'normal',
  titleTextTransform: 'none',
  titleTextDecoration: 'none',
  titleAlignment: 'left',
  blockBorderWidth: '1',
  blockBorderStyle: {
    "top": "solid",
    "right": "solid",
    "bottom": "solid",
    "left": "solid"
  },
  blockBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4,
    "unit": "px"
  },
  blockShadow: 'none',
  blockShadowHover: 'none',
  wrapperPadding: '1.25rem',
  itemSpacing: '0.5rem',
  enableHierarchicalIndent: true,
  levelIndent: '1.25rem',
  positionTop: '6.25rem',
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
  blockBorderColor?: Record<string, any>;
  titleColor?: any;
  unifiedLinkColors?: boolean;
  linkColor?: any;
  h1NumberingStyle?: string;
  h2NumberingStyle?: string;
  h3NumberingStyle?: string;
  h4NumberingStyle?: string;
  h5NumberingStyle?: string;
  h6NumberingStyle?: string;
  h1Color?: any;
  h1FontSize?: string;
  h1FontWeight?: string;
  h1FontStyle?: string;
  h1TextTransform?: string;
  h1TextDecoration?: string;
  h2Color?: any;
  h2FontSize?: string;
  h2FontWeight?: string;
  h2FontStyle?: string;
  h2TextTransform?: string;
  h2TextDecoration?: string;
  h3Color?: any;
  h3FontSize?: string;
  h3FontWeight?: string;
  h3FontStyle?: string;
  h3TextTransform?: string;
  h3TextDecoration?: string;
  h4Color?: any;
  h4FontSize?: string;
  h4FontWeight?: string;
  h4FontStyle?: string;
  h4TextTransform?: string;
  h4TextDecoration?: string;
  h5Color?: any;
  h5FontSize?: string;
  h5FontWeight?: string;
  h5FontStyle?: string;
  h5TextTransform?: string;
  h5TextDecoration?: string;
  h6Color?: any;
  h6FontSize?: string;
  h6FontWeight?: string;
  h6FontStyle?: string;
  h6TextTransform?: string;
  h6TextDecoration?: string;
  showIcon?: boolean;
  useDifferentIcons?: boolean;
  iconPosition?: string;
  iconRotation?: string;
  iconInactiveSource?: Record<string, any>;
  iconInactiveColor?: string;
  iconInactiveRotation?: string;
  iconInactiveSize?: string;
  iconInactiveMaxSize?: string;
  iconInactiveOffsetX?: string;
  iconInactiveOffsetY?: string;
  iconActiveSource?: Record<string, any>;
  iconActiveColor?: string;
  iconActiveRotation?: string;
  iconActiveSize?: string;
  iconActiveMaxSize?: string;
  iconActiveOffsetX?: string;
  iconActiveOffsetY?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  titleFontStyle?: string;
  titleTextTransform?: string;
  titleTextDecoration?: string;
  titleAlignment?: string;
  blockBorderWidth?: string;
  blockBorderStyle?: Record<string, any>;
  blockBorderRadius?: Record<string, any>;
  blockShadow?: string;
  blockShadowHover?: string;
  wrapperPadding?: string;
  itemSpacing?: string;
  enableHierarchicalIndent?: boolean;
  levelIndent?: string;
  positionTop?: string;
  zIndex?: number;
  positionHorizontalSide?: string;
  positionHorizontalOffset?: string;
}
