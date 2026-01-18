/**
 * TypeScript Type Definitions for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-18T11:42:00.920Z
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
  dividerBorder?: any;
  blockBox?: any;
  headerBox?: any;
  contentBox?: any;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFormatting?: any[];
  titleNoLineBreak?: string;
  titleFontWeight?: string;
  titleDecorationColor?: string;
  titleDecorationStyle?: string;
  titleDecorationWidth?: string;
  titleLetterSpacing?: string;
  titleTextTransform?: string;
  titleTextDecoration?: string;
  titleLineHeight?: string;
  titleOffsetX?: string;
  titleOffsetY?: string;
  /** Horizontal alignment of the title text */
  titleAlignment?: string;
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
  /** How the accordion opens and closes */
  animationType?: string;
  /** Animation duration in milliseconds */
  animationDuration?: string;
}

/**
 * Default theme values for Accordion block
 */
export const accordionDefaultTheme: AccordionTheme = {
  dividerBorder: {"width":{"top":0,"unit":"px"},"color":{"top":"#dddddd"},"style":{"top":"solid"}},
  blockBox: {"border":{"width":{"top":1,"right":1,"bottom":1,"left":1,"unit":"px"},"color":{"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"},"style":{"top":"solid","right":"solid","bottom":"solid","left":"solid"}},"radius":{"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4,"unit":"px"},"shadow":[{"x":{"value":0,"unit":"px"},"y":{"value":8,"unit":"px"},"blur":{"value":24,"unit":"px"},"spread":{"value":0,"unit":"px"},"color":"rgba(0,0,0,0.15)","inset":false}],"margin":{"top":1,"right":0,"bottom":1,"left":0,"unit":"em"}},
  headerBox: {"padding":{"top":12,"right":16,"bottom":12,"left":16,"unit":"px"}},
  contentBox: {"padding":{"top":16,"right":16,"bottom":16,"left":16,"unit":"px"}},
  titleFontFamily: 'inherit',
  titleFontSize: '18px',
  titleFormatting: [],
  titleNoLineBreak: 'normal',
  titleFontWeight: '600',
  titleDecorationColor: 'currentColor',
  titleDecorationStyle: 'solid',
  titleDecorationWidth: 'auto',
  titleLetterSpacing: 'normal',
  titleTextTransform: 'none',
  titleTextDecoration: 'none',
  titleLineHeight: '1.4',
  titleOffsetX: '0px',
  titleOffsetY: '0px',
  titleAlignment: 'left',
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
  animationType: 'slide',
  animationDuration: '250ms',
};

/**
 * Full attribute interface including non-themeable attributes
 */
export interface AccordionThemeAttributes {
  dividerBorder?: any;
  blockBox?: any;
  headerBox?: any;
  contentBox?: any;
  titleColor?: any;
  contentColor?: any;
  contentTypography?: any;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFormatting?: any[];
  titleNoLineBreak?: string;
  titleFontWeight?: string;
  titleDecorationColor?: string;
  titleDecorationStyle?: string;
  titleDecorationWidth?: string;
  titleLetterSpacing?: string;
  titleTextTransform?: string;
  titleTextDecoration?: string;
  titleLineHeight?: string;
  titleOffsetX?: string;
  titleOffsetY?: string;
  titleAlignment?: string;
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
  animationType?: string;
  animationDuration?: string;
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
