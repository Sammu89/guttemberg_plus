/**
 * TypeScript Type Definitions for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-04T23:18:45.213Z
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
  titleTypography?: any;
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
