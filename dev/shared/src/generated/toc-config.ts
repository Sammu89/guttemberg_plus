/**
 * Block Configuration for Table of Contents
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2025-11-26T23:02:45.288Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Comprehensive attribute configuration for Table of Contents block
 *
 * This file provides a single source of truth for all attribute metadata,
 * including themeable status, CSS variables, units, and control information.
 */

/**
 * Configuration metadata for a single attribute
 */
export interface AttributeConfig {
  /** Attribute name (e.g., 'titleColor') */
  attribute: string;
  /** CSS variable name (e.g., '--accordion-title-color') */
  cssVar?: string;
  /** Whether this attribute can be saved in themes */
  themeable: boolean;
  /** Data type of the attribute */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  /** Available units for numeric values (e.g., ['px', '%', 'em']) */
  units?: string[];
  /** Default/primary unit (first in units array) */
  defaultUnit?: string;
  /** Default value (raw, without units for numbers) */
  defaultValue: any;
  /** UI control type */
  control?: string;
  /** Human-readable label */
  label?: string;
  /** Description/help text */
  description?: string;
  /** Attribute group/category */
  group?: string;
  /** Reason for non-themeable status */
  reason?: string;
}

/**
 * Complete configuration for all Table of Contents attributes
 */
export const TOC_CONFIG: Record<string, AttributeConfig> = {
  tocId: {
    attribute: 'tocId',
    themeable: false,
    type: 'string',
    defaultValue: '',
    label: 'TOC ID',
    description: 'Unique identifier for the table of contents',
    group: 'behavior',
    reason: 'structural',
  },
  showTitle: {
    attribute: 'showTitle',
    themeable: false,
    type: 'boolean',
    defaultValue: true,
    control: 'ToggleControl',
    label: 'Show Title',
    description: 'Display the TOC title header',
    group: 'behavior',
    reason: 'structural',
  },
  titleText: {
    attribute: 'titleText',
    themeable: false,
    type: 'string',
    defaultValue: 'Table of Contents',
    control: 'TextControl',
    label: 'Title Text',
    description: 'The title displayed above the table of contents',
    group: 'behavior',
    reason: 'content',
  },
  currentTheme: {
    attribute: 'currentTheme',
    themeable: false,
    type: 'string',
    defaultValue: '',
    label: 'Current Theme',
    description: 'Currently active theme name (empty = Default)',
    group: 'behavior',
    reason: 'structural',
  },
  filterMode: {
    attribute: 'filterMode',
    themeable: false,
    type: 'string',
    defaultValue: 'include-all',
    control: 'SelectControl',
    label: 'Filter Mode',
    description: 'How headings are filtered for inclusion',
    group: 'behavior',
    reason: 'behavioral',
  },
  includeLevels: {
    attribute: 'includeLevels',
    themeable: false,
    type: 'array',
    defaultValue: [2,3,4,5,6],
    label: 'Include Heading Levels',
    description: 'Which heading levels to include (H2-H6)',
    group: 'behavior',
    reason: 'behavioral',
  },
  includeClasses: {
    attribute: 'includeClasses',
    themeable: false,
    type: 'string',
    defaultValue: '',
    control: 'TextControl',
    label: 'Include Classes',
    description: 'CSS classes to include in TOC',
    group: 'behavior',
    reason: 'behavioral',
  },
  excludeLevels: {
    attribute: 'excludeLevels',
    themeable: false,
    type: 'array',
    defaultValue: [],
    label: 'Exclude Heading Levels',
    description: 'Which heading levels to exclude',
    group: 'behavior',
    reason: 'behavioral',
  },
  excludeClasses: {
    attribute: 'excludeClasses',
    themeable: false,
    type: 'string',
    defaultValue: '',
    control: 'TextControl',
    label: 'Exclude Classes',
    description: 'CSS classes to exclude from TOC',
    group: 'behavior',
    reason: 'behavioral',
  },
  depthLimit: {
    attribute: 'depthLimit',
    themeable: false,
    type: 'number',
    defaultValue: null,
    control: 'RangeControl',
    label: 'Depth Limit',
    description: 'Maximum nesting depth to display',
    group: 'behavior',
    reason: 'behavioral',
  },
  numberingStyle: {
    attribute: 'numberingStyle',
    themeable: false,
    type: 'string',
    defaultValue: 'none',
    control: 'SelectControl',
    label: 'Numbering Style',
    description: 'Style of numbering for TOC items',
    group: 'behavior',
    reason: 'behavioral',
  },
  isCollapsible: {
    attribute: 'isCollapsible',
    themeable: false,
    type: 'boolean',
    defaultValue: false,
    control: 'ToggleControl',
    label: 'Collapsible',
    description: 'Allow the TOC to be collapsed/expanded',
    group: 'behavior',
    reason: 'behavioral',
  },
  initiallyCollapsed: {
    attribute: 'initiallyCollapsed',
    themeable: false,
    type: 'boolean',
    defaultValue: false,
    control: 'ToggleControl',
    label: 'Initially Collapsed',
    description: 'Start with TOC collapsed',
    group: 'behavior',
    reason: 'behavioral',
  },
  positionType: {
    attribute: 'positionType',
    themeable: false,
    type: 'string',
    defaultValue: 'block',
    control: 'SelectControl',
    label: 'Position Type',
    description: 'CSS positioning type',
    group: 'behavior',
    reason: 'behavioral',
  },
  smoothScroll: {
    attribute: 'smoothScroll',
    themeable: false,
    type: 'boolean',
    defaultValue: true,
    control: 'ToggleControl',
    label: 'Smooth Scroll',
    description: 'Enable smooth scrolling to headings',
    group: 'behavior',
    reason: 'behavioral',
  },
  scrollOffset: {
    attribute: 'scrollOffset',
    themeable: false,
    type: 'number',
    defaultValue: 0,
    control: 'RangeControl',
    label: 'Scroll Offset',
    description: 'Offset in pixels when scrolling to heading',
    group: 'behavior',
    reason: 'behavioral',
  },
  autoHighlight: {
    attribute: 'autoHighlight',
    themeable: false,
    type: 'boolean',
    defaultValue: true,
    label: 'Auto Highlight',
    description: 'Highlight current section in TOC',
    group: 'behavior',
    reason: 'behavioral',
  },
  clickBehavior: {
    attribute: 'clickBehavior',
    themeable: false,
    type: 'string',
    defaultValue: 'navigate',
    label: 'Click Behavior',
    description: 'What happens when clicking a TOC item',
    group: 'behavior',
    reason: 'behavioral',
  },
  wrapperBackgroundColor: {
    attribute: 'wrapperBackgroundColor',
    cssVar: '--toc-wrapper-background-color',
    themeable: true,
    type: 'string',
    defaultValue: '#ffffff',
    control: 'ColorPicker',
    label: 'Background Color',
    description: 'Background color of the TOC wrapper',
    group: 'contentColors',
  },
  blockBorderColor: {
    attribute: 'blockBorderColor',
    cssVar: '--toc-border-color',
    themeable: true,
    type: 'string',
    defaultValue: '#dddddd',
    control: 'ColorPicker',
    label: 'Border Color',
    description: 'Border color of the TOC wrapper',
    group: 'blockBorders',
  },
  titleColor: {
    attribute: 'titleColor',
    cssVar: '--toc-title-color',
    themeable: true,
    type: 'string',
    defaultValue: '#333333',
    control: 'ColorPicker',
    label: 'Title Color',
    description: 'Text color for the TOC title',
    group: 'headerColors',
  },
  titleBackgroundColor: {
    attribute: 'titleBackgroundColor',
    cssVar: '--toc-title-background-color',
    themeable: true,
    type: 'string',
    defaultValue: 'transparent',
    control: 'ColorPicker',
    label: 'Title Background',
    description: 'Background color for the TOC title',
    group: 'headerColors',
  },
  linkColor: {
    attribute: 'linkColor',
    cssVar: '--toc-link-color',
    themeable: true,
    type: 'string',
    defaultValue: '#0073aa',
    control: 'ColorPicker',
    label: 'Link Color',
    description: 'Default color for TOC links',
    group: 'contentColors',
  },
  linkHoverColor: {
    attribute: 'linkHoverColor',
    cssVar: '--toc-link-hover-color',
    themeable: true,
    type: 'string',
    defaultValue: '#005177',
    control: 'ColorPicker',
    label: 'Link Hover Color',
    description: 'Color when hovering over links',
    group: 'contentColors',
  },
  linkActiveColor: {
    attribute: 'linkActiveColor',
    cssVar: '--toc-link-active-color',
    themeable: true,
    type: 'string',
    defaultValue: '#005177',
    control: 'ColorPicker',
    label: 'Link Active Color',
    description: 'Color for the currently active link',
    group: 'contentColors',
  },
  linkVisitedColor: {
    attribute: 'linkVisitedColor',
    cssVar: '--toc-link-visited-color',
    themeable: true,
    type: 'string',
    defaultValue: '#0073aa',
    control: 'ColorPicker',
    label: 'Link Visited Color',
    description: 'Color for visited links',
    group: 'contentColors',
  },
  numberingColor: {
    attribute: 'numberingColor',
    cssVar: '--toc-numbering-color',
    themeable: true,
    type: 'string',
    defaultValue: '#0073aa',
    control: 'ColorPicker',
    label: 'Numbering Color',
    description: 'Color for list numbering',
    group: 'contentColors',
  },
  level1Color: {
    attribute: 'level1Color',
    cssVar: '--toc-level1-color',
    themeable: true,
    type: 'string',
    defaultValue: '#0073aa',
    control: 'ColorPicker',
    label: 'Level 1 Color',
    description: 'Text color for level 1 headings (H2)',
    group: 'contentColors',
  },
  level2Color: {
    attribute: 'level2Color',
    cssVar: '--toc-level2-color',
    themeable: true,
    type: 'string',
    defaultValue: '#0073aa',
    control: 'ColorPicker',
    label: 'Level 2 Color',
    description: 'Text color for level 2 headings (H3)',
    group: 'contentColors',
  },
  level3PlusColor: {
    attribute: 'level3PlusColor',
    cssVar: '--toc-level3-plus-color',
    themeable: true,
    type: 'string',
    defaultValue: '#0073aa',
    control: 'ColorPicker',
    label: 'Level 3+ Color',
    description: 'Text color for level 3+ headings (H4-H6)',
    group: 'contentColors',
  },
  collapseIconColor: {
    attribute: 'collapseIconColor',
    cssVar: '--toc-collapse-icon-color',
    themeable: true,
    type: 'string',
    defaultValue: '#666666',
    control: 'ColorPicker',
    label: 'Collapse Icon Color',
    description: 'Color of the collapse/expand icon',
    group: 'contentColors',
  },
  titleFontSize: {
    attribute: 'titleFontSize',
    cssVar: '--toc-title-font-size',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 20,
    control: 'RangeControl',
    label: 'Title Font Size',
    description: 'Font size for the TOC title in pixels',
    group: 'typography',
  },
  titleFontWeight: {
    attribute: 'titleFontWeight',
    cssVar: '--toc-title-font-weight',
    themeable: true,
    type: 'string',
    defaultValue: '700',
    control: 'SelectControl',
    label: 'Title Font Weight',
    description: 'Font weight for the TOC title',
    group: 'typography',
  },
  titleTextTransform: {
    attribute: 'titleTextTransform',
    cssVar: '--toc-title-text-transform',
    themeable: true,
    type: 'string',
    defaultValue: null,
    control: 'SelectControl',
    label: 'Title Text Transform',
    description: 'Text transformation for the title',
    group: 'typography',
  },
  titleAlignment: {
    attribute: 'titleAlignment',
    cssVar: '--toc-title-alignment',
    themeable: true,
    type: 'string',
    defaultValue: 'left',
    control: 'SelectControl',
    label: 'Title Alignment',
    description: 'Text alignment for the title',
    group: 'typography',
  },
  level1FontSize: {
    attribute: 'level1FontSize',
    cssVar: '--toc-level1-font-size',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 18,
    control: 'RangeControl',
    label: 'Level 1 Font Size',
    description: 'Font size for level 1 items (H2) in pixels',
    group: 'typography',
  },
  level1FontWeight: {
    attribute: 'level1FontWeight',
    cssVar: '--toc-level1-font-weight',
    themeable: true,
    type: 'string',
    defaultValue: '600',
    control: 'SelectControl',
    label: 'Level 1 Font Weight',
    description: 'Font weight for level 1 items',
    group: 'typography',
  },
  level1FontStyle: {
    attribute: 'level1FontStyle',
    cssVar: '--toc-level1-font-style',
    themeable: true,
    type: 'string',
    defaultValue: 'normal',
    control: 'SelectControl',
    label: 'Level 1 Font Style',
    description: 'Font style for level 1 items',
    group: 'typography',
  },
  level1TextTransform: {
    attribute: 'level1TextTransform',
    cssVar: '--toc-level1-text-transform',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'SelectControl',
    label: 'Level 1 Text Transform',
    description: 'Text transformation for level 1 items',
    group: 'typography',
  },
  level1TextDecoration: {
    attribute: 'level1TextDecoration',
    cssVar: '--toc-level1-text-decoration',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'SelectControl',
    label: 'Level 1 Text Decoration',
    description: 'Text decoration for level 1 items',
    group: 'typography',
  },
  level2FontSize: {
    attribute: 'level2FontSize',
    cssVar: '--toc-level2-font-size',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 16,
    control: 'RangeControl',
    label: 'Level 2 Font Size',
    description: 'Font size for level 2 items (H3) in pixels',
    group: 'typography',
  },
  level2FontWeight: {
    attribute: 'level2FontWeight',
    cssVar: '--toc-level2-font-weight',
    themeable: true,
    type: 'string',
    defaultValue: 'normal',
    control: 'SelectControl',
    label: 'Level 2 Font Weight',
    description: 'Font weight for level 2 items',
    group: 'typography',
  },
  level2FontStyle: {
    attribute: 'level2FontStyle',
    cssVar: '--toc-level2-font-style',
    themeable: true,
    type: 'string',
    defaultValue: 'normal',
    control: 'SelectControl',
    label: 'Level 2 Font Style',
    description: 'Font style for level 2 items',
    group: 'typography',
  },
  level2TextTransform: {
    attribute: 'level2TextTransform',
    cssVar: '--toc-level2-text-transform',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'SelectControl',
    label: 'Level 2 Text Transform',
    description: 'Text transformation for level 2 items',
    group: 'typography',
  },
  level2TextDecoration: {
    attribute: 'level2TextDecoration',
    cssVar: '--toc-level2-text-decoration',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'SelectControl',
    label: 'Level 2 Text Decoration',
    description: 'Text decoration for level 2 items',
    group: 'typography',
  },
  level3PlusFontSize: {
    attribute: 'level3PlusFontSize',
    cssVar: '--toc-level3-plus-font-size',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 14,
    control: 'RangeControl',
    label: 'Level 3+ Font Size',
    description: 'Font size for level 3+ items (H4-H6) in pixels',
    group: 'typography',
  },
  level3PlusFontWeight: {
    attribute: 'level3PlusFontWeight',
    cssVar: '--toc-level3-plus-font-weight',
    themeable: true,
    type: 'string',
    defaultValue: 'normal',
    control: 'SelectControl',
    label: 'Level 3+ Font Weight',
    description: 'Font weight for level 3+ items',
    group: 'typography',
  },
  level3PlusFontStyle: {
    attribute: 'level3PlusFontStyle',
    cssVar: '--toc-level3-plus-font-style',
    themeable: true,
    type: 'string',
    defaultValue: 'normal',
    control: 'SelectControl',
    label: 'Level 3+ Font Style',
    description: 'Font style for level 3+ items',
    group: 'typography',
  },
  level3PlusTextTransform: {
    attribute: 'level3PlusTextTransform',
    cssVar: '--toc-level3-plus-text-transform',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'SelectControl',
    label: 'Level 3+ Text Transform',
    description: 'Text transformation for level 3+ items',
    group: 'typography',
  },
  level3PlusTextDecoration: {
    attribute: 'level3PlusTextDecoration',
    cssVar: '--toc-level3-plus-text-decoration',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'SelectControl',
    label: 'Level 3+ Text Decoration',
    description: 'Text decoration for level 3+ items',
    group: 'typography',
  },
  blockBorderWidth: {
    attribute: 'blockBorderWidth',
    cssVar: '--toc-border-width',
    themeable: true,
    type: 'number',
    units: ['px'],
    defaultUnit: 'px',
    defaultValue: 1,
    control: 'RangeControl',
    label: 'Border Width',
    description: 'Width of the wrapper border in pixels',
    group: 'blockBorders',
  },
  blockBorderStyle: {
    attribute: 'blockBorderStyle',
    cssVar: '--toc-border-style',
    themeable: true,
    type: 'string',
    defaultValue: 'solid',
    control: 'SelectControl',
    label: 'Border Style',
    description: 'Style of the wrapper border',
    group: 'blockBorders',
  },
  blockBorderRadius: {
    attribute: 'blockBorderRadius',
    cssVar: '--toc-border-radius',
    themeable: true,
    type: 'object',
    defaultValue: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
    control: 'BorderRadiusControl',
    label: 'Border Radius',
    description: 'Corner radius of the wrapper',
    group: 'blockBorders',
  },
  blockShadow: {
    attribute: 'blockShadow',
    cssVar: '--toc-border-shadow',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'TextControl',
    label: 'Shadow',
    description: 'CSS box-shadow for the wrapper',
    group: 'blockBorders',
  },
  blockShadowHover: {
    attribute: 'blockShadowHover',
    cssVar: '--toc-border-shadow-hover',
    themeable: true,
    type: 'string',
    defaultValue: 'none',
    control: 'TextControl',
    label: 'Shadow on Hover',
    description: 'CSS box-shadow for the wrapper on hover',
    group: 'blockBorders',
  },
  wrapperPadding: {
    attribute: 'wrapperPadding',
    cssVar: '--toc-wrapper-padding',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 20,
    control: 'RangeControl',
    label: 'Wrapper Padding',
    description: 'Padding inside the TOC wrapper',
    group: 'layout',
  },
  listPaddingLeft: {
    attribute: 'listPaddingLeft',
    cssVar: '--toc-list-padding-left',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: null,
    control: 'RangeControl',
    label: 'List Padding Left',
    description: 'Left padding for the list',
    group: 'layout',
  },
  itemSpacing: {
    attribute: 'itemSpacing',
    cssVar: '--toc-item-spacing',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 8,
    control: 'RangeControl',
    label: 'Item Spacing',
    description: 'Vertical space between TOC items',
    group: 'layout',
  },
  levelIndent: {
    attribute: 'levelIndent',
    cssVar: '--toc-level-indent',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 20,
    control: 'RangeControl',
    label: 'Level Indent',
    description: 'Indentation per heading level',
    group: 'layout',
  },
  positionTop: {
    attribute: 'positionTop',
    cssVar: '--toc-position-top',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem', '%'],
    defaultUnit: 'px',
    defaultValue: 100,
    control: 'RangeControl',
    label: 'Position Top',
    description: 'Top offset for sticky/fixed positioning',
    group: 'layout',
  },
  zIndex: {
    attribute: 'zIndex',
    cssVar: '--toc-z-index',
    themeable: true,
    type: 'number',
    defaultValue: 100,
    control: 'RangeControl',
    label: 'Z-Index',
    description: 'Stack order for positioned TOC',
    group: 'layout',
  },
  collapseIconSize: {
    attribute: 'collapseIconSize',
    cssVar: '--toc-collapse-icon-size',
    themeable: true,
    type: 'number',
    units: ['px', 'em', 'rem'],
    defaultUnit: 'px',
    defaultValue: 20,
    control: 'RangeControl',
    label: 'Collapse Icon Size',
    description: 'Size of the collapse/expand icon',
    group: 'layout',
  },
};

/**
 * Array of themeable attribute names
 */
export const TOC_THEMEABLE: string[] = Object.entries(TOC_CONFIG)
  .filter(([_, cfg]) => cfg.themeable)
  .map(([key]) => key);

/**
 * Mapping of attribute names to CSS variable names
 */
export const TOC_CSS_VAR_MAPPING: Record<string, string> = Object.entries(TOC_CONFIG)
  .reduce((acc, [key, cfg]) => {
    if (cfg.cssVar) {
      acc[key] = cfg.cssVar;
    }
    return acc;
  }, {} as Record<string, string>);

/**
 * Get configuration for a specific attribute
 * @param attributeName - Name of the attribute
 * @returns Attribute configuration or undefined
 */
export function getAttributeConfig(attributeName: string): AttributeConfig | undefined {
  return TOC_CONFIG[attributeName];
}

/**
 * Check if an attribute is themeable
 * @param attributeName - Name of the attribute
 * @returns True if attribute can be saved in themes
 */
export function isThemeable(attributeName: string): boolean {
  return TOC_CONFIG[attributeName]?.themeable ?? false;
}

/**
 * Get CSS variable name for an attribute
 * @param attributeName - Name of the attribute
 * @returns CSS variable name or undefined
 */
export function getCssVarName(attributeName: string): string | undefined {
  return TOC_CONFIG[attributeName]?.cssVar;
}

/**
 * Get available units for an attribute
 * @param attributeName - Name of the attribute
 * @returns Array of available units or undefined
 */
export function getAvailableUnits(attributeName: string): string[] | undefined {
  return TOC_CONFIG[attributeName]?.units;
}

/**
 * Get default unit for an attribute
 * @param attributeName - Name of the attribute
 * @returns Default unit or undefined
 */
export function getDefaultUnit(attributeName: string): string | undefined {
  return TOC_CONFIG[attributeName]?.defaultUnit;
}

export default TOC_CONFIG;
