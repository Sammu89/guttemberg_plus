/**
 * TypeScript Type Definitions for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-26T22:38:19.335Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Theme interface for Accordion block
 * Contains all themeable attributes
 */
export interface AccordionTheme {
  /** Border width, color, and style for all sides */
  borderWidth?: Record<string, any>;
  /** Border color for all sides */
  borderColor?: Record<string, any>;
  /** Border style for all sides */
  borderStyle?: Record<string, any>;
  /** Corner radius of the accordion wrapper */
  borderRadius?: Record<string, any>;
  /** Inner spacing of the header */
  headerPadding?: Record<string, any>;
  /** Inner spacing of the content panel */
  contentPadding?: Record<string, any>;
  /** Outer spacing around the accordion */
  blockMargin?: Record<string, any>;
  /** Shadow effect for the accordion */
  shadow?: string;
  /** Color of divider between header and content */
  dividerColor?: string;
  /** Style of divider between header and content */
  dividerStyle?: string;
  /** Thickness of divider between header and content */
  dividerWidth?: number;
  /** Text color for the accordion header */
  titleColor?: string;
  /** Background color for the accordion header */
  titleBackgroundColor?: string;
  /** Text color when hovering over header */
  hoverTitleColor?: string;
  /** Background color when hovering over header */
  hoverTitleBackgroundColor?: string;
  /** Text color when accordion is open */
  activeTitleColor?: string;
  /** Background color when accordion is open */
  activeTitleBackgroundColor?: string;
  /** Text color for accordion content */
  contentTextColor?: string;
  /** Background color for accordion content */
  contentBackgroundColor?: string;
  /** Font family for the header */
  titleFontFamily?: string;
  /** Font size for the header */
  titleFontSize?: number;
  /** Font weight and style for the header */
  titleAppearance?: Record<string, any>;
  /** Space between letters */
  titleLetterSpacing?: number;
  /** Text decoration for the header */
  titleTextDecoration?: string;
  /** Text transformation for the header */
  titleTextTransform?: string;
  /** Line height for the header */
  titleLineHeight?: number;
  /** Text alignment for the header */
  titleAlignment?: string;
  /** Font family for the content */
  contentFontFamily?: string;
  /** Font size for the content */
  contentFontSize?: number;
  /** Line height for the content */
  contentLineHeight?: number;
  /** Display expand/collapse icon */
  showIcon?: boolean;
  /** Position of icon relative to title */
  iconPosition?: string;
  /** Color of the expand/collapse icon */
  iconColor?: string;
  /** Size of the icon */
  iconSize?: number;
  /** Icon when accordion is closed (character, unicode, or image URL) */
  iconTypeClosed?: string;
  /** Icon when accordion is open (none = rotate closed icon) */
  iconTypeOpen?: string;
  /** Rotation angle when open (degrees) */
  iconRotation?: number;
  /** How the accordion opens and closes */
  animationType?: string;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Animation easing function */
  animationEasing?: string;
}

/**
 * Default theme values for Accordion block
 */
export const accordionDefaultTheme: AccordionTheme = {
  borderWidth: {
    "top": 1,
    "right": 1,
    "bottom": 1,
    "left": 1,
    "unit": "px"
  },
  borderColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd",
    "linked": true
  },
  borderStyle: {
    "top": "solid",
    "right": "solid",
    "bottom": "solid",
    "left": "solid",
    "linked": true
  },
  borderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4,
    "unit": "px"
  },
  headerPadding: {
    "top": 12,
    "right": 16,
    "bottom": 12,
    "left": 16,
    "unit": "px"
  },
  contentPadding: {
    "top": 16,
    "right": 16,
    "bottom": 16,
    "left": 16,
    "unit": "px"
  },
  blockMargin: {
    "top": 1,
    "right": 0,
    "bottom": 1,
    "left": 0,
    "unit": "em"
  },
  shadow: 'none',
  dividerColor: '#dddddd',
  dividerStyle: 'solid',
  dividerWidth: 0,
  titleColor: '#333333',
  titleBackgroundColor: '#f5f5f5',
  hoverTitleColor: '#000000',
  hoverTitleBackgroundColor: '#e8e8e8',
  activeTitleColor: '#000000',
  activeTitleBackgroundColor: '#e8e8e8',
  contentTextColor: '#333333',
  contentBackgroundColor: '#ffffff',
  titleFontFamily: 'inherit',
  titleFontSize: 1.125,
  titleAppearance: {
    "weight": "600",
    "style": "normal"
  },
  titleLetterSpacing: 0,
  titleTextDecoration: 'none',
  titleTextTransform: 'none',
  titleLineHeight: 1.4,
  titleAlignment: 'left',
  contentFontFamily: 'inherit',
  contentFontSize: 1,
  contentLineHeight: 1.6,
  showIcon: true,
  iconPosition: 'right',
  iconColor: '#666666',
  iconSize: 1.25,
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: 180,
  animationType: 'slide',
  animationDuration: 300,
  animationEasing: 'ease',
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface AccordionThemeAttributes {
  accordionId?: string;
  uniqueId?: string;
  blockId?: string;
  title?: string;
  content?: string;
  currentTheme?: string;
  customizations?: Record<string, any>;
  accordionWidth?: string;
  headingLevel?: string;
  accordionHorizontalAlign?: string;
  initiallyOpen?: boolean;
  borderWidth?: Record<string, any>;
  borderColor?: Record<string, any>;
  borderStyle?: Record<string, any>;
  borderRadius?: Record<string, any>;
  headerPadding?: Record<string, any>;
  contentPadding?: Record<string, any>;
  blockMargin?: Record<string, any>;
  shadow?: string;
  dividerColor?: string;
  dividerStyle?: string;
  dividerWidth?: number;
  titleColor?: string;
  titleBackgroundColor?: string;
  hoverTitleColor?: string;
  hoverTitleBackgroundColor?: string;
  activeTitleColor?: string;
  activeTitleBackgroundColor?: string;
  contentTextColor?: string;
  contentBackgroundColor?: string;
  titleFontFamily?: string;
  titleFontSize?: number;
  titleAppearance?: Record<string, any>;
  titleLetterSpacing?: number;
  titleTextDecoration?: string;
  titleTextTransform?: string;
  titleLineHeight?: number;
  titleAlignment?: string;
  contentFontFamily?: string;
  contentFontSize?: number;
  contentLineHeight?: number;
  showIcon?: boolean;
  iconPosition?: string;
  iconColor?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
  animationType?: string;
  animationDuration?: number;
  animationEasing?: string;
}
