/**
 * TypeScript Type Definitions for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-11-22T17:12:27.834Z
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
  /** Text color for the accordion title */
  titleColor?: string;
  /** Background color for the accordion title */
  titleBackgroundColor?: string;
  /** Text color when hovering over title */
  hoverTitleColor?: string;
  /** Background color when hovering over title */
  hoverTitleBackgroundColor?: string;
  /** Text color when accordion is open */
  activeTitleColor?: string;
  /** Background color when accordion is open */
  activeTitleBackgroundColor?: string;
  /** Text color for accordion content */
  contentColor?: string;
  /** Background color for accordion content */
  contentBackgroundColor?: string;
  /** Color of the accordion border */
  borderColor?: string;
  /** Color of the accordion border (alias) */
  accordionBorderColor?: string;
  /** Color of divider between title and content */
  dividerBorderColor?: string;
  /** Color of the expand/collapse icon */
  iconColor?: string;
  /** Font size for the title in pixels */
  titleFontSize?: number;
  /** Font weight for the title */
  titleFontWeight?: string;
  /** Font family for the title */
  titleFontFamily?: string | undefined;
  /** Line height for the title */
  titleLineHeight?: number | undefined;
  /** Font style for the title */
  titleFontStyle?: string;
  /** Text transformation for the title */
  titleTextTransform?: string;
  /** Text decoration for the title */
  titleTextDecoration?: string;
  /** Text alignment for the title */
  titleAlignment?: string;
  /** Font size for content in pixels */
  contentFontSize?: number;
  /** Font weight for content */
  contentFontWeight?: string | undefined;
  /** Font family for content */
  contentFontFamily?: string | undefined;
  /** Line height for content */
  contentLineHeight?: number;
  /** Font style for content */
  contentFontStyle?: string | undefined;
  /** Text transformation for content */
  contentTextTransform?: string | undefined;
  /** Text decoration for content */
  contentTextDecoration?: string | undefined;
  /** Thickness of the accordion border in pixels */
  accordionBorderThickness?: number;
  /** Style of the accordion border */
  accordionBorderStyle?: string;
  /** Corner radius of the accordion */
  accordionBorderRadius?: Record<string, any>;
  /** Generic border width */
  borderWidth?: string | undefined;
  /** Generic border radius */
  borderRadius?: string | undefined;
  /** CSS box-shadow for the accordion */
  accordionShadow?: string;
  /** Thickness of divider between title and content */
  dividerBorderThickness?: number;
  /** Style of divider between title and content */
  dividerBorderStyle?: string;
  /** Padding inside the title area */
  titlePadding?: Record<string, any>;
  /** Padding inside the content area */
  contentPadding?: Record<string, any>;
  /** Space between accordion blocks */
  accordionMarginBottom?: number;
  /** Spacing between items */
  itemSpacing?: number | undefined;
  /** Display expand/collapse icon */
  showIcon?: boolean;
  /** Position of icon relative to title */
  iconPosition?: string;
  /** Size of the icon in pixels */
  iconSize?: number;
  /** Icon when accordion is closed */
  iconTypeClosed?: string;
  /** Icon when accordion is open (none = use just iconTypeClosed with rotation) */
  iconTypeOpen?: string;
  /** Rotation angle when open (degrees) */
  iconRotation?: number;
}

/**
 * Default theme values for Accordion block
 */
export const accordionDefaultTheme: AccordionTheme = {
  titleColor: '#333333',
  titleBackgroundColor: '#f5f5f5',
  hoverTitleColor: '#000000',
  hoverTitleBackgroundColor: '#e8e8e8',
  activeTitleColor: '#000000',
  activeTitleBackgroundColor: '#e0e0e0',
  contentColor: '#333333',
  contentBackgroundColor: '#ffffff',
  borderColor: '#dddddd',
  accordionBorderColor: '#dddddd',
  dividerBorderColor: 'transparent',
  iconColor: '#666666',
  titleFontSize: 18,
  titleFontWeight: '600',
  titleFontStyle: 'normal',
  titleTextTransform: 'none',
  titleTextDecoration: 'none',
  titleAlignment: 'left',
  contentFontSize: 16,
  contentLineHeight: 1.6,
  accordionBorderThickness: 1,
  accordionBorderStyle: 'solid',
  accordionBorderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4
  },
  accordionShadow: 'none',
  dividerBorderThickness: 0,
  dividerBorderStyle: 'solid',
  titlePadding: {
    "top": 16,
    "right": 16,
    "bottom": 16,
    "left": 16
  },
  contentPadding: {
    "top": 16,
    "right": 16,
    "bottom": 16,
    "left": 16
  },
  accordionMarginBottom: 8,
  showIcon: true,
  iconPosition: 'right',
  iconSize: 20,
  iconTypeClosed: '▾',
  iconTypeOpen: 'none',
  iconRotation: 180,
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
  customizationCache?: Record<string, any>;
  initiallyOpen?: boolean;
  allowMultipleOpen?: boolean;
  accordionWidth?: string;
  accordionHorizontalAlign?: string;
  headingLevel?: string;
  useHeadingStyles?: boolean;
  titleColor?: string;
  titleBackgroundColor?: string;
  hoverTitleColor?: string;
  hoverTitleBackgroundColor?: string;
  activeTitleColor?: string;
  activeTitleBackgroundColor?: string;
  contentColor?: string;
  contentBackgroundColor?: string;
  borderColor?: string;
  accordionBorderColor?: string;
  dividerBorderColor?: string;
  iconColor?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  titleFontFamily?: string | undefined;
  titleLineHeight?: number | undefined;
  titleFontStyle?: string;
  titleTextTransform?: string;
  titleTextDecoration?: string;
  titleAlignment?: string;
  contentFontSize?: number;
  contentFontWeight?: string | undefined;
  contentFontFamily?: string | undefined;
  contentLineHeight?: number;
  contentFontStyle?: string | undefined;
  contentTextTransform?: string | undefined;
  contentTextDecoration?: string | undefined;
  accordionBorderThickness?: number;
  accordionBorderStyle?: string;
  accordionBorderRadius?: Record<string, any>;
  borderWidth?: string | undefined;
  borderRadius?: string | undefined;
  accordionShadow?: string;
  dividerBorderThickness?: number;
  dividerBorderStyle?: string;
  titlePadding?: Record<string, any>;
  contentPadding?: Record<string, any>;
  accordionMarginBottom?: number;
  itemSpacing?: number | undefined;
  showIcon?: boolean;
  iconPosition?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
}
