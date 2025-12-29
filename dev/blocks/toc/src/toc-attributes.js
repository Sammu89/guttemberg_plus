/**
 * Block Attributes for Table of Contents
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-12-29T02:28:32.322Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Block Attributes for Table of Contents
 *
 * These attributes define the block's data structure for WordPress.
 * Auto-generated from schema - DO NOT edit manually.
 */
export const tocAttributes = {
  tocId: {
    type: 'string',
    default: '',
  },
  showTitle: {
    type: 'boolean',
    default: true,
  },
  titleText: {
    type: 'string',
    default: 'Table of Contents',
  },
  currentTheme: {
    type: 'string',
    default: '',
  },
  tocItems: {
    type: 'array',
    default: [],
  },
  deletedHeadingIds: {
    type: 'array',
    default: [],
  },
  filterMode: {
    type: 'string',
    default: 'Include all headings',
  },
  includeH1: {
    type: 'boolean',
    default: false,
  },
  includeH2: {
    type: 'boolean',
    default: true,
  },
  includeH3: {
    type: 'boolean',
    default: true,
  },
  includeH4: {
    type: 'boolean',
    default: true,
  },
  includeH5: {
    type: 'boolean',
    default: true,
  },
  includeH6: {
    type: 'boolean',
    default: true,
  },
  includeLevels: {
    type: 'array',
    default: [2,3,4,5,6],
  },
  includeClasses: {
    type: 'string',
    default: '',
  },
  excludeLevels: {
    type: 'array',
    default: [],
  },
  excludeClasses: {
    type: 'string',
    default: '',
  },
  includeAccordions: {
    type: 'boolean',
    default: true,
  },
  includeTabs: {
    type: 'boolean',
    default: true,
  },
  isCollapsible: {
    type: 'boolean',
    default: true,
  },
  initiallyCollapsed: {
    type: 'boolean',
    default: false,
  },
  positionType: {
    type: 'string',
    default: 'normal',
  },
  smoothScroll: {
    type: 'boolean',
    default: true,
  },
  scrollOffset: {
    type: 'number',
    default: 0,
  },
  autoHighlight: {
    type: 'boolean',
    default: true,
  },
  clickBehavior: {
    type: 'string',
    default: 'navigate',
  },
  tocWidth: {
    type: 'string',
    default: '100%',
  },
  tocHorizontalAlign: {
    type: 'string',
    default: 'center',
  },
  wrapperBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  blockBorderColor: {
    type: 'object',
    default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
  },
  titleColor: {
    type: 'string',
    default: '#333333',
  },
  titleBackgroundColor: {
    type: 'string',
    default: 'transparent',
  },
  hoverTitleColor: {
    type: 'string',
    default: '#000000',
  },
  hoverTitleBackgroundColor: {
    type: 'string',
    default: 'transparent',
  },
  unifiedLinkColors: {
    type: 'boolean',
    default: true,
  },
  linkColor: {
    type: 'string',
    default: '#0073aa',
  },
  linkHoverColor: {
    type: 'string',
    default: '#005177',
  },
  linkActiveColor: {
    type: 'string',
    default: '#005177',
  },
  linkVisitedColor: {
    type: 'string',
    default: '#0073aa',
  },
  h1NumberingStyle: {
    type: 'string',
    default: 'decimal',
  },
  h2NumberingStyle: {
    type: 'string',
    default: 'decimal',
  },
  h3NumberingStyle: {
    type: 'string',
    default: 'decimal',
  },
  h4NumberingStyle: {
    type: 'string',
    default: 'decimal',
  },
  h5NumberingStyle: {
    type: 'string',
    default: 'decimal',
  },
  h6NumberingStyle: {
    type: 'string',
    default: 'decimal',
  },
  h1Color: {
    type: 'string',
    default: 'inherit',
  },
  h1HoverColor: {
    type: 'string',
    default: 'inherit',
  },
  h1VisitedColor: {
    type: 'string',
    default: 'inherit',
  },
  h1ActiveColor: {
    type: 'string',
    default: 'inherit',
  },
  h1FontSize: {
    type: 'string',
    default: '1.5rem',
  },
  h1FontWeight: {
    type: 'string',
    default: '700',
  },
  h1FontStyle: {
    type: 'string',
    default: 'normal',
  },
  h1TextTransform: {
    type: 'string',
    default: 'none',
  },
  h1TextDecoration: {
    type: 'string',
    default: 'none',
  },
  h2Color: {
    type: 'string',
    default: 'inherit',
  },
  h2HoverColor: {
    type: 'string',
    default: 'inherit',
  },
  h2VisitedColor: {
    type: 'string',
    default: 'inherit',
  },
  h2ActiveColor: {
    type: 'string',
    default: 'inherit',
  },
  h2FontSize: {
    type: 'string',
    default: '1.25rem',
  },
  h2FontWeight: {
    type: 'string',
    default: '600',
  },
  h2FontStyle: {
    type: 'string',
    default: 'normal',
  },
  h2TextTransform: {
    type: 'string',
    default: 'none',
  },
  h2TextDecoration: {
    type: 'string',
    default: 'none',
  },
  h3Color: {
    type: 'string',
    default: 'inherit',
  },
  h3HoverColor: {
    type: 'string',
    default: 'inherit',
  },
  h3VisitedColor: {
    type: 'string',
    default: 'inherit',
  },
  h3ActiveColor: {
    type: 'string',
    default: 'inherit',
  },
  h3FontSize: {
    type: 'string',
    default: '1.125rem',
  },
  h3FontWeight: {
    type: 'string',
    default: '500',
  },
  h3FontStyle: {
    type: 'string',
    default: 'normal',
  },
  h3TextTransform: {
    type: 'string',
    default: 'none',
  },
  h3TextDecoration: {
    type: 'string',
    default: 'none',
  },
  h4Color: {
    type: 'string',
    default: 'inherit',
  },
  h4HoverColor: {
    type: 'string',
    default: 'inherit',
  },
  h4VisitedColor: {
    type: 'string',
    default: 'inherit',
  },
  h4ActiveColor: {
    type: 'string',
    default: 'inherit',
  },
  h4FontSize: {
    type: 'string',
    default: '1rem',
  },
  h4FontWeight: {
    type: 'string',
    default: 'normal',
  },
  h4FontStyle: {
    type: 'string',
    default: 'normal',
  },
  h4TextTransform: {
    type: 'string',
    default: 'none',
  },
  h4TextDecoration: {
    type: 'string',
    default: 'none',
  },
  h5Color: {
    type: 'string',
    default: 'inherit',
  },
  h5HoverColor: {
    type: 'string',
    default: 'inherit',
  },
  h5VisitedColor: {
    type: 'string',
    default: 'inherit',
  },
  h5ActiveColor: {
    type: 'string',
    default: 'inherit',
  },
  h5FontSize: {
    type: 'string',
    default: '0.9375rem',
  },
  h5FontWeight: {
    type: 'string',
    default: 'normal',
  },
  h5FontStyle: {
    type: 'string',
    default: 'normal',
  },
  h5TextTransform: {
    type: 'string',
    default: 'none',
  },
  h5TextDecoration: {
    type: 'string',
    default: 'none',
  },
  h6Color: {
    type: 'string',
    default: 'inherit',
  },
  h6HoverColor: {
    type: 'string',
    default: 'inherit',
  },
  h6VisitedColor: {
    type: 'string',
    default: 'inherit',
  },
  h6ActiveColor: {
    type: 'string',
    default: 'inherit',
  },
  h6FontSize: {
    type: 'string',
    default: '0.875rem',
  },
  h6FontWeight: {
    type: 'string',
    default: 'normal',
  },
  h6FontStyle: {
    type: 'string',
    default: 'normal',
  },
  h6TextTransform: {
    type: 'string',
    default: 'none',
  },
  h6TextDecoration: {
    type: 'string',
    default: 'none',
  },
  showIcon: {
    type: 'boolean',
    default: true,
  },
  iconPosition: {
    type: 'string',
    default: 'right',
  },
  iconSize: {
    type: 'string',
    default: '1.25rem',
  },
  iconTypeClosed: {
    type: 'string',
    default: '▾',
  },
  iconTypeOpen: {
    type: 'string',
    default: 'none',
  },
  iconRotation: {
    type: 'string',
    default: '180deg',
  },
  iconColor: {
    type: 'string',
    default: '#666666',
  },
  titleFontSize: {
    type: 'string',
    default: '1.25rem',
  },
  titleFontWeight: {
    type: 'string',
    default: '700',
  },
  titleFontStyle: {
    type: 'string',
    default: 'normal',
  },
  titleTextTransform: {
    type: 'string',
    default: 'none',
  },
  titleTextDecoration: {
    type: 'string',
    default: 'none',
  },
  titleAlignment: {
    type: 'string',
    default: 'left',
  },
  blockBorderWidth: {
    type: 'string',
    default: '1px',
  },
  blockBorderStyle: {
    type: 'object',
    default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
  },
  blockBorderRadius: {
    type: 'object',
    default: {"topLeft":"4px","topRight":"4px","bottomRight":"4px","bottomLeft":"4px"},
  },
  blockShadow: {
    type: 'string',
    default: 'none',
  },
  blockShadowHover: {
    type: 'string',
    default: 'none',
  },
  wrapperPadding: {
    type: 'string',
    default: '1.25rem',
  },
  itemSpacing: {
    type: 'string',
    default: '0.5rem',
  },
  enableHierarchicalIndent: {
    type: 'boolean',
    default: true,
  },
  levelIndent: {
    type: 'string',
    default: '1.25rem',
  },
  positionTop: {
    type: 'string',
    default: '6.25rem',
  },
  zIndex: {
    type: 'number',
    default: 100,
  },
  positionHorizontalSide: {
    type: 'string',
    default: 'right',
  },
  positionHorizontalOffset: {
    type: 'string',
    default: '1.25rem',
  },
  // Auto-generated: tracks which responsive attributes have responsive mode enabled
  responsiveEnabled: {
    type: 'object',
    default: {"tocWidth":false},
  },
};

export default tocAttributes;
