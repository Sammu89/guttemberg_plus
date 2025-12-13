/**
 * TypeScript Type Definitions for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-12-13T00:48:15.491Z
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
  /** Text color for accordion content */
  contentColor?: string;
  /** Background color for accordion content */
  contentBackgroundColor?: string;
  /** Color of the accordion wrapper border */
  borderColor?: string;
  /** Color of divider between title and content */
  dividerColor?: string;
  /** Color of the expand/collapse icon */
  iconColor?: string;
  /** Font size for the title in pixels */
  titleFontSize?: number;
  /** Font weight for the title */
  titleFontWeight?: string;
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
  /** Thickness of the accordion wrapper border in pixels */
  borderWidth?: number;
  /** Style of the accordion wrapper border */
  borderStyle?: string;
  /** Corner radius of the accordion wrapper */
  borderRadius?: Record<string, any>;
  /** CSS box-shadow for the accordion wrapper */
  shadow?: string;
  /** CSS box-shadow for the accordion wrapper on hover */
  shadowHover?: string;
  /** Thickness of divider between title and content */
  dividerWidth?: number;
  /** Style of divider between title and content */
  dividerStyle?: string;
  /** Size of the icon in pixels */
  iconSize?: number;
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
  contentColor: '#333333',
  contentBackgroundColor: '#ffffff',
  borderColor: '#dddddd',
  dividerColor: '#dddddd',
  iconColor: '#666666',
  titleFontSize: 18,
  titleFontWeight: '600',
  titleFontStyle: 'normal',
  titleTextTransform: 'none',
  titleTextDecoration: 'none',
  titleAlignment: 'left',
  contentFontSize: 16,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: {
    "topLeft": 4,
    "topRight": 4,
    "bottomRight": 4,
    "bottomLeft": 4
  },
  shadow: 'none',
  shadowHover: 'none',
  dividerWidth: 0,
  dividerStyle: 'solid',
  iconSize: 20,
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
  initiallyOpen?: boolean;
  accordionWidth?: string;
  accordionHorizontalAlign?: string;
  headingLevel?: string;
  titleColor?: string;
  titleBackgroundColor?: string;
  hoverTitleColor?: string;
  hoverTitleBackgroundColor?: string;
  contentColor?: string;
  contentBackgroundColor?: string;
  borderColor?: string;
  dividerColor?: string;
  iconColor?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  titleFontStyle?: string;
  titleTextTransform?: string;
  titleTextDecoration?: string;
  titleAlignment?: string;
  contentFontSize?: number;
  contentFontWeight?: string | undefined;
  borderWidth?: number;
  borderStyle?: string;
  borderRadius?: Record<string, any>;
  shadow?: string;
  shadowHover?: string;
  dividerWidth?: number;
  dividerStyle?: string;
  showIcon?: boolean;
  iconPosition?: string;
  iconSize?: number;
  iconTypeClosed?: string;
  iconTypeOpen?: string;
  iconRotation?: number;
}
