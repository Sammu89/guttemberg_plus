/**
 * Block Attributes for Table of Contents
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-12-08T00:22:34.888Z
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
  filterMode: {
    type: 'string',
    default: 'include-all',
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
  depthLimit: {
    type: 'number',
    default: null,
  },
  numberingStyle: {
    type: 'string',
    default: 'none',
  },
  isCollapsible: {
    type: 'boolean',
    default: false,
  },
  initiallyCollapsed: {
    type: 'boolean',
    default: false,
  },
  positionType: {
    type: 'string',
    default: 'block',
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
  wrapperBackgroundColor: {
    type: 'string',
    default: '#ffffff',
  },
  blockBorderColor: {
    type: 'string',
    default: '#dddddd',
  },
  titleColor: {
    type: 'string',
    default: '#333333',
  },
  titleBackgroundColor: {
    type: 'string',
    default: 'transparent',
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
  numberingColor: {
    type: 'string',
    default: '#0073aa',
  },
  level1Color: {
    type: 'string',
    default: '#0073aa',
  },
  level2Color: {
    type: 'string',
    default: '#0073aa',
  },
  level3PlusColor: {
    type: 'string',
    default: '#0073aa',
  },
  collapseIconColor: {
    type: 'string',
    default: '#666666',
  },
  titleFontSize: {
    type: 'number',
    default: 20,
  },
  titleFontWeight: {
    type: 'string',
    default: '700',
  },
  titleTextTransform: {
    type: 'string',
    default: null,
  },
  titleAlignment: {
    type: 'string',
    default: 'left',
  },
  level1FontSize: {
    type: 'number',
    default: 18,
  },
  level1FontWeight: {
    type: 'string',
    default: '600',
  },
  level1FontStyle: {
    type: 'string',
    default: 'normal',
  },
  level1TextTransform: {
    type: 'string',
    default: 'none',
  },
  level1TextDecoration: {
    type: 'string',
    default: 'none',
  },
  level2FontSize: {
    type: 'number',
    default: 16,
  },
  level2FontWeight: {
    type: 'string',
    default: 'normal',
  },
  level2FontStyle: {
    type: 'string',
    default: 'normal',
  },
  level2TextTransform: {
    type: 'string',
    default: 'none',
  },
  level2TextDecoration: {
    type: 'string',
    default: 'none',
  },
  level3PlusFontSize: {
    type: 'number',
    default: 14,
  },
  level3PlusFontWeight: {
    type: 'string',
    default: 'normal',
  },
  level3PlusFontStyle: {
    type: 'string',
    default: 'normal',
  },
  level3PlusTextTransform: {
    type: 'string',
    default: 'none',
  },
  level3PlusTextDecoration: {
    type: 'string',
    default: 'none',
  },
  blockBorderWidth: {
    type: 'number',
    default: 1,
  },
  blockBorderStyle: {
    type: 'string',
    default: 'solid',
  },
  blockBorderRadius: {
    type: 'object',
    default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
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
    type: 'number',
    default: 20,
  },
  listPaddingLeft: {
    type: 'number',
    default: null,
  },
  itemSpacing: {
    type: 'number',
    default: 8,
  },
  levelIndent: {
    type: 'number',
    default: 20,
  },
  positionTop: {
    type: 'number',
    default: 100,
  },
  zIndex: {
    type: 'number',
    default: 100,
  },
  collapseIconSize: {
    type: 'number',
    default: 20,
  },
};

export default tocAttributes;
