/**
 * TypeScript Type Definitions for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-29T02:28:32.297Z
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
  /** Border between header and content */
  dividerWidth?: Record<string, any>;
  /** Color of divider between header and content */
  dividerColor?: Record<string, any>;
  /** Style of divider between header and content */
  dividerStyle?: Record<string, any>;
  /** Border width, color, and style for all sides */
  borderWidth?: Record<string, any>;
  /** Corner radius of the accordion wrapper */
  borderRadius?: Record<string, any>;
  /** Shadow effect for the accordion (supports multiple layers) */
  shadow?: any[];
  /** Border color for all sides */
  borderColor?: Record<string, any>;
  /** Border style for all sides */
  borderStyle?: Record<string, any>;
  /** Inner spacing of the header */
  headerPadding?: Record<string, any>;
  /** Inner spacing of the content panel */
  contentPadding?: Record<string, any>;
  /** Outer spacing around the accordion */
  blockMargin?: Record<string, any>;
  /** Text color for the accordion header */
  titleColor?: string;
  /** Background color for the accordion header */
  titleBackgroundColor?: string;
  /** Text color when hovering over header */
  hoverTitleColor?: string;
  /** Background color when hovering over header */
  hoverTitleBackgroundColor?: string;
  /** Text color for accordion content */
  contentTextColor?: string;
  /** Background color for accordion content */
  contentBackgroundColor?: string;
  /** Font family for the content */
  contentFontFamily?: string;
  /** Font size for the content */
  contentFontSize?: string;
  /** Line height for the content */
  contentLineHeight?: number;
  /** Font family for the header */
  titleFontFamily?: string;
  /** Font size for the header */
  titleFontSize?: string;
  /** Text formatting options (bold, italic, underline, overline, line-through) */
  titleFormatting?: any[];
  /** Font weight for title (100-900) */
  titleFontWeight?: number;
  /** Color for text decorations */
  titleDecorationColor?: string;
  /** Style for text decorations */
  titleDecorationStyle?: string;
  /** Thickness of text decorations */
  titleDecorationWidth?: string;
  /** Space between letters */
  titleLetterSpacing?: string;
  /** Text transformation for the header */
  titleTextTransform?: string;
  /** Line height for the header */
  titleLineHeight?: number;
  /** Text alignment for the header */
  titleAlignment?: string;
  /** Move title left/right (negative = left, positive = right) */
  titleOffsetX?: string;
  /** Move title up/down (negative = up, positive = down) */
  titleOffsetY?: string;
  /** Shadow effect for the header text (supports multiple layers) */
  titleTextShadow?: any[];
  /** Display expand/collapse icon */
  showIcon?: boolean;
  /** Position of icon relative to title */
  iconPosition?: string;
  /** Color of the expand/collapse icon */
  iconColor?: string;
  /** Size of the icon */
  iconSize?: string;
  /** Icon when accordion is closed (character, unicode, or image URL) */
  iconTypeClosed?: string;
  /** Icon when accordion is open (none = rotate closed icon) */
  iconTypeOpen?: string;
  /** Rotation angle when open (degrees) */
  iconRotation?: string;
  /** How the accordion opens and closes */
  animationType?: string;
  /** Animation duration in milliseconds */
  animationDuration?: string;
  /** Animation easing function */
  animationEasing?: string;
}

/**
 * Default theme values for Accordion block
 */
export const accordionDefaultTheme: AccordionTheme = {
  dividerWidth: {
    "top": "0px",
    "right": "0px",
    "bottom": "0px",
    "left": "0px"
  },
  dividerColor: {
    "top": "#dddddd",
    "right": "#dddddd",
    "bottom": "#dddddd",
    "left": "#dddddd",
    "linked": true
  },
  dividerStyle: {
    "top": "solid",
    "right": "solid",
    "bottom": "solid",
    "left": "solid",
    "linked": true
  },
  borderWidth: {
    "top": "1px",
    "right": "1px",
    "bottom": "1px",
    "left": "1px"
  },
  borderRadius: {
    "topLeft": "4px",
    "topRight": "4px",
    "bottomRight": "4px",
    "bottomLeft": "4px"
  },
  shadow: [
    {
      "x": "0px",
      "y": "8px",
      "blur": "24px",
      "spread": "0px",
      "color": "rgba(0,0,0,0.15)",
      "inset": false
    }
  ],
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
  headerPadding: {
    "top": "12px",
    "right": "16px",
    "bottom": "12px",
    "left": "16px"
  },
  contentPadding: {
    "top": "16px",
    "right": "16px",
    "bottom": "16px",
    "left": "16px"
  },
  blockMargin: {
    "top": "1em",
    "right": "0em",
    "bottom": "1em",
    "left": "0em"
  },
  titleColor: '#333333',
  titleBackgroundColor: '#f5f5f5',
  hoverTitleColor: '#000000',
  hoverTitleBackgroundColor: '#e8e8e8',
  contentTextColor: '#333333',
  contentBackgroundColor: '#ffffff',
  contentFontFamily: 'inherit',
  contentFontSize: '1rem',
  contentLineHeight: 1.6,
  titleFontFamily: 'inherit',
  titleFontSize: '1.125rem',
  titleFormatting: [],
  titleFontWeight: 400,
  titleDecorationColor: 'currentColor',
  titleDecorationStyle: 'solid',
  titleDecorationWidth: 'auto',
  titleLetterSpacing: '0em',
  titleTextTransform: 'none',
  titleLineHeight: 1.4,
  titleAlignment: 'left',
  titleOffsetX: '0px',
  titleOffsetY: '0px',
  titleTextShadow: [],
  showIcon: true,
  iconPosition: 'right',
  iconColor: '#666666',
  iconSize: '1.25rem',
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: '180deg',
  animationType: 'slide',
  animationDuration: '300ms',
  animationEasing: 'ease',
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface AccordionThemeAttributes {
  dividerWidth?: Record<string, any>;
  dividerColor?: Record<string, any>;
  dividerStyle?: Record<string, any>;
  borderWidth?: Record<string, any>;
  borderRadius?: Record<string, any>;
  shadow?: any[];
  borderColor?: Record<string, any>;
  borderStyle?: Record<string, any>;
  headerPadding?: Record<string, any>;
  contentPadding?: Record<string, any>;
  blockMargin?: Record<string, any>;
  titleColor?: string;
  titleBackgroundColor?: string;
  hoverTitleColor?: string;
  hoverTitleBackgroundColor?: string;
  contentTextColor?: string;
  contentBackgroundColor?: string;
  contentFontFamily?: string;
  contentFontSize?: string;
  contentLineHeight?: number;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFormatting?: any[];
  titleFontWeight?: number;
  titleDecorationColor?: string;
  titleDecorationStyle?: string;
  titleDecorationWidth?: string;
  titleLetterSpacing?: string;
  titleTextTransform?: string;
  titleLineHeight?: number;
  titleAlignment?: string;
  titleOffsetX?: string;
  titleOffsetY?: string;
  titleTextShadow?: any[];
  showIcon?: boolean;
  iconPosition?: string;
  iconColor?: string;
  iconSize?: string;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: string;
  animationType?: string;
  animationDuration?: string;
  animationEasing?: string;
  accordionWidth?: string;
  headingLevel?: string;
  accordionHorizontalAlign?: string;
  initiallyOpen?: boolean;
  accordionId?: string;
  blockId?: string;
  content?: string;
  currentTheme?: string;
  customizations?: Record<string, any>;
  title?: string;
  uniqueId?: string;
}
