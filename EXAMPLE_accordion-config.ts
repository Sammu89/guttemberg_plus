/**
 * Block Configuration for Accordion
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-01-26T12:00:00.000Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Comprehensive attribute configuration for Accordion block
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
 * Complete configuration for all Accordion attributes
 */
export const ACCORDION_CONFIG: Record<string, AttributeConfig> = {
  accordionId: {
    attribute: 'accordionId',
    themeable: false,
    type: 'string',
    defaultValue: '',
    label: 'Accordion ID',
    description: 'Unique identifier for the accordion block',
    group: 'behavior',
    reason: 'structural',
  },
  uniqueId: {
    attribute: 'uniqueId',
    themeable: false,
    type: 'string',
    defaultValue: '',
    label: 'Unique ID',
    description: 'Auto-generated unique block identifier',
    group: 'behavior',
    reason: 'structural',
  },
  title: {
    attribute: 'title',
    themeable: false,
    type: 'string',
    defaultValue: 'Accordion Title',
    label: 'Title',
    description: 'The accordion title text',
    group: 'behavior',
    reason: 'content',
  },
  titleColor: {
    attribute: 'titleColor',
    cssVar: '--accordion-title-color',
    themeable: true,
    type: 'string',
    defaultValue: '#333333',
    control: 'ColorPicker',
    label: 'Title Color',
    description: 'Text color for the accordion title',
    group: 'headerColors',
  },
  titleFontSize: {
    attribute: 'titleFontSize',
    cssVar: '--accordion-title-font-size',
    themeable: true,
    type: 'number',
    units: ['px'],
    defaultUnit: 'px',
    defaultValue: 18,
    control: 'RangeControl',
    label: 'Title Font Size',
    description: 'Font size for the title in pixels',
    group: 'typography',
  },
  iconRotation: {
    attribute: 'iconRotation',
    cssVar: '--accordion-icon-rotation',
    themeable: true,
    type: 'number',
    units: ['deg'],
    defaultUnit: 'deg',
    defaultValue: 180,
    control: 'RangeControl',
    label: 'Icon Rotation',
    description: 'Rotation angle when open (degrees)',
    group: 'icon',
  },
  borderRadius: {
    attribute: 'borderRadius',
    cssVar: '--accordion-border-radius',
    themeable: true,
    type: 'object',
    units: ['px'],
    defaultUnit: 'px',
    defaultValue: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
    control: 'BorderRadiusControl',
    label: 'Border Radius',
    description: 'Corner radius of the accordion wrapper',
    group: 'borders',
  },
  initiallyOpen: {
    attribute: 'initiallyOpen',
    themeable: false,
    type: 'boolean',
    defaultValue: false,
    label: 'Initially Open',
    description: 'Whether accordion is open on page load',
    group: 'behavior',
    reason: 'behavioral',
  },
  // ... (all other attributes would be here)
};

/**
 * Array of themeable attribute names
 */
export const ACCORDION_THEMEABLE: string[] = Object.entries(ACCORDION_CONFIG)
  .filter(([_, cfg]) => cfg.themeable)
  .map(([key]) => key);

/**
 * Mapping of attribute names to CSS variable names
 */
export const ACCORDION_CSS_VAR_MAPPING: Record<string, string> = Object.entries(ACCORDION_CONFIG)
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
  return ACCORDION_CONFIG[attributeName];
}

/**
 * Check if an attribute is themeable
 * @param attributeName - Name of the attribute
 * @returns True if attribute can be saved in themes
 */
export function isThemeable(attributeName: string): boolean {
  return ACCORDION_CONFIG[attributeName]?.themeable ?? false;
}

/**
 * Get CSS variable name for an attribute
 * @param attributeName - Name of the attribute
 * @returns CSS variable name or undefined
 */
export function getCssVarName(attributeName: string): string | undefined {
  return ACCORDION_CONFIG[attributeName]?.cssVar;
}

/**
 * Get available units for an attribute
 * @param attributeName - Name of the attribute
 * @returns Array of available units or undefined
 */
export function getAvailableUnits(attributeName: string): string[] | undefined {
  return ACCORDION_CONFIG[attributeName]?.units;
}

/**
 * Get default unit for an attribute
 * @param attributeName - Name of the attribute
 * @returns Default unit or undefined
 */
export function getDefaultUnit(attributeName: string): string | undefined {
  return ACCORDION_CONFIG[attributeName]?.defaultUnit;
}

export default ACCORDION_CONFIG;
