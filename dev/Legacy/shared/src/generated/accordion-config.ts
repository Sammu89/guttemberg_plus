/**
 * Block Configuration for Accordion
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2025-11-26T23:02:45.274Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package
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
export const ACCORDION_CONFIG: Record< string, AttributeConfig > = {
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
	blockId: {
		attribute: 'blockId',
		themeable: false,
		type: 'string',
		defaultValue: '',
		label: 'Block ID',
		description: 'Block-specific identification',
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
	content: {
		attribute: 'content',
		themeable: false,
		type: 'string',
		defaultValue: '',
		label: 'Content',
		description: 'The accordion content (rich text)',
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
	customizations: {
		attribute: 'customizations',
		themeable: false,
		type: 'object',
		defaultValue: {},
		label: 'Customizations',
		description: 'Stores deltas from expected values (theme + defaults) for inline CSS output',
		group: 'behavior',
		reason: 'structural',
	},
	customizationCache: {
		attribute: 'customizationCache',
		themeable: false,
		type: 'object',
		defaultValue: {},
		label: 'Customization Cache',
		description:
			'Complete snapshot for safety/restoration (deprecated - for backward compatibility)',
		group: 'behavior',
		reason: 'structural',
	},
	initiallyOpen: {
		attribute: 'initiallyOpen',
		themeable: false,
		type: 'boolean',
		defaultValue: false,
		control: 'ToggleControl',
		label: 'Initially Open',
		description: 'Whether accordion is open on page load',
		group: 'behavior',
		reason: 'behavioral',
	},
	allowMultipleOpen: {
		attribute: 'allowMultipleOpen',
		themeable: false,
		type: 'boolean',
		defaultValue: false,
		control: 'ToggleControl',
		label: 'Allow Multiple Open',
		description: 'Allow multiple accordions to be open simultaneously',
		group: 'behavior',
		reason: 'behavioral',
	},
	accordionWidth: {
		attribute: 'accordionWidth',
		themeable: false,
		type: 'string',
		defaultValue: '100%',
		control: 'TextControl',
		label: 'Width',
		description: 'Accordion container width',
		group: 'behavior',
		reason: 'behavioral',
	},
	accordionHorizontalAlign: {
		attribute: 'accordionHorizontalAlign',
		themeable: false,
		type: 'string',
		defaultValue: 'left',
		control: 'SelectControl',
		label: 'Horizontal Alignment',
		description: 'Horizontal alignment of the accordion',
		group: 'behavior',
		reason: 'behavioral',
	},
	headingLevel: {
		attribute: 'headingLevel',
		themeable: false,
		type: 'string',
		defaultValue: 'none',
		control: 'SelectControl',
		label: 'Heading Level',
		description: 'Semantic HTML heading level (none, h1-h6)',
		group: 'typography',
		reason: 'behavioral',
	},
	useHeadingStyles: {
		attribute: 'useHeadingStyles',
		themeable: false,
		type: 'boolean',
		defaultValue: false,
		control: 'ToggleControl',
		label: 'Use Heading Styles',
		description: 'Apply default heading styles to title',
		group: 'behavior',
		reason: 'behavioral',
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
	titleBackgroundColor: {
		attribute: 'titleBackgroundColor',
		cssVar: '--accordion-title-bg',
		themeable: true,
		type: 'string',
		defaultValue: '#f5f5f5',
		control: 'ColorPicker',
		label: 'Title Background',
		description: 'Background color for the accordion title',
		group: 'headerColors',
	},
	hoverTitleColor: {
		attribute: 'hoverTitleColor',
		cssVar: '--accordion-title-hover-color',
		themeable: true,
		type: 'string',
		defaultValue: '#000000',
		control: 'ColorPicker',
		label: 'Title Hover Color',
		description: 'Text color when hovering over title',
		group: 'headerColors',
	},
	hoverTitleBackgroundColor: {
		attribute: 'hoverTitleBackgroundColor',
		cssVar: '--accordion-title-hover-bg',
		themeable: true,
		type: 'string',
		defaultValue: '#e8e8e8',
		control: 'ColorPicker',
		label: 'Title Hover Background',
		description: 'Background color when hovering over title',
		group: 'headerColors',
	},
	contentColor: {
		attribute: 'contentColor',
		cssVar: '--accordion-content-color',
		themeable: true,
		type: 'string',
		defaultValue: '#333333',
		control: 'ColorPicker',
		label: 'Content Color',
		description: 'Text color for accordion content',
		group: 'contentColors',
	},
	contentBackgroundColor: {
		attribute: 'contentBackgroundColor',
		cssVar: '--accordion-content-bg',
		themeable: true,
		type: 'string',
		defaultValue: '#ffffff',
		control: 'ColorPicker',
		label: 'Content Background',
		description: 'Background color for accordion content',
		group: 'contentColors',
	},
	borderColor: {
		attribute: 'borderColor',
		cssVar: '--accordion-border-color',
		themeable: true,
		type: 'string',
		defaultValue: '#dddddd',
		control: 'ColorPicker',
		label: 'Border Color',
		description: 'Color of the accordion wrapper border',
		group: 'borders',
	},
	dividerColor: {
		attribute: 'dividerColor',
		cssVar: '--accordion-divider-color',
		themeable: true,
		type: 'string',
		defaultValue: '#dddddd',
		control: 'ColorPicker',
		label: 'Divider Color',
		description: 'Color of divider between title and content',
		group: 'dividerLine',
	},
	iconColor: {
		attribute: 'iconColor',
		cssVar: '--accordion-icon-color',
		themeable: true,
		type: 'string',
		defaultValue: '#666666',
		control: 'ColorPicker',
		label: 'Icon Color',
		description: 'Color of the expand/collapse icon',
		group: 'icon',
	},
	titleFontSize: {
		attribute: 'titleFontSize',
		cssVar: '--accordion-title-font-size',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: 18,
		control: 'RangeControl',
		label: 'Title Font Size',
		description: 'Font size for the title in pixels',
		group: 'typography',
	},
	titleFontWeight: {
		attribute: 'titleFontWeight',
		cssVar: '--accordion-title-font-weight',
		themeable: true,
		type: 'string',
		defaultValue: '600',
		control: 'SelectControl',
		label: 'Title Font Weight',
		description: 'Font weight for the title',
		group: 'typography',
	},
	titleFontFamily: {
		attribute: 'titleFontFamily',
		cssVar: '--accordion-title-font-family',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'FontFamilyControl',
		label: 'Title Font Family',
		description: 'Font family for the title',
		group: 'typography',
	},
	titleLineHeight: {
		attribute: 'titleLineHeight',
		cssVar: '--accordion-title-line-height',
		themeable: true,
		type: 'number',
		defaultValue: null,
		control: 'RangeControl',
		label: 'Title Line Height',
		description: 'Line height for the title',
		group: 'typography',
	},
	titleFontStyle: {
		attribute: 'titleFontStyle',
		cssVar: '--accordion-title-font-style',
		themeable: true,
		type: 'string',
		defaultValue: 'normal',
		control: 'SelectControl',
		label: 'Title Font Style',
		description: 'Font style for the title',
		group: 'typography',
	},
	titleTextTransform: {
		attribute: 'titleTextTransform',
		cssVar: '--accordion-title-text-transform',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'SelectControl',
		label: 'Title Text Transform',
		description: 'Text transformation for the title',
		group: 'typography',
	},
	titleTextDecoration: {
		attribute: 'titleTextDecoration',
		cssVar: '--accordion-title-text-decoration',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'SelectControl',
		label: 'Title Text Decoration',
		description: 'Text decoration for the title',
		group: 'typography',
	},
	titleAlignment: {
		attribute: 'titleAlignment',
		cssVar: '--accordion-title-alignment',
		themeable: true,
		type: 'string',
		defaultValue: 'left',
		control: 'SelectControl',
		label: 'Title Alignment',
		description: 'Text alignment for the title',
		group: 'typography',
	},
	contentFontSize: {
		attribute: 'contentFontSize',
		cssVar: '--accordion-content-font-size',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: 16,
		control: 'RangeControl',
		label: 'Content Font Size',
		description: 'Font size for content in pixels',
		group: 'typography',
	},
	contentFontWeight: {
		attribute: 'contentFontWeight',
		cssVar: '--accordion-content-font-weight',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'SelectControl',
		label: 'Content Font Weight',
		description: 'Font weight for content',
		group: 'typography',
	},
	contentFontFamily: {
		attribute: 'contentFontFamily',
		cssVar: '--accordion-content-font-family',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'FontFamilyControl',
		label: 'Content Font Family',
		description: 'Font family for content',
		group: 'typography',
	},
	contentLineHeight: {
		attribute: 'contentLineHeight',
		cssVar: '--accordion-content-line-height',
		themeable: true,
		type: 'number',
		defaultValue: 1.6,
		control: 'RangeControl',
		label: 'Content Line Height',
		description: 'Line height for content',
		group: 'typography',
	},
	contentFontStyle: {
		attribute: 'contentFontStyle',
		cssVar: '--accordion-content-font-style',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'SelectControl',
		label: 'Content Font Style',
		description: 'Font style for content',
		group: 'typography',
	},
	contentTextTransform: {
		attribute: 'contentTextTransform',
		cssVar: '--accordion-content-text-transform',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'SelectControl',
		label: 'Content Text Transform',
		description: 'Text transformation for content',
		group: 'typography',
	},
	contentTextDecoration: {
		attribute: 'contentTextDecoration',
		cssVar: '--accordion-content-text-decoration',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'SelectControl',
		label: 'Content Text Decoration',
		description: 'Text decoration for content',
		group: 'typography',
	},
	borderWidth: {
		attribute: 'borderWidth',
		cssVar: '--accordion-border-width',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: 1,
		control: 'RangeControl',
		label: 'Border Width',
		description: 'Thickness of the accordion wrapper border in pixels',
		group: 'borders',
	},
	borderStyle: {
		attribute: 'borderStyle',
		cssVar: '--accordion-border-style',
		themeable: true,
		type: 'string',
		defaultValue: 'solid',
		control: 'SelectControl',
		label: 'Border Style',
		description: 'Style of the accordion wrapper border',
		group: 'borders',
	},
	borderRadius: {
		attribute: 'borderRadius',
		cssVar: '--accordion-border-radius',
		themeable: true,
		type: 'object',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 },
		control: 'BorderRadiusControl',
		label: 'Border Radius',
		description: 'Corner radius of the accordion wrapper',
		group: 'borders',
	},
	shadow: {
		attribute: 'shadow',
		cssVar: '--accordion-border-shadow',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'TextControl',
		label: 'Shadow',
		description: 'CSS box-shadow for the accordion wrapper',
		group: 'borders',
	},
	shadowHover: {
		attribute: 'shadowHover',
		cssVar: '--accordion-border-shadow-hover',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'TextControl',
		label: 'Shadow Hover',
		description: 'CSS box-shadow for the accordion wrapper on hover',
		group: 'borders',
	},
	dividerWidth: {
		attribute: 'dividerWidth',
		cssVar: '--accordion-divider-width',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: 0,
		control: 'RangeControl',
		label: 'Divider Width',
		description: 'Thickness of divider between title and content',
		group: 'dividerLine',
	},
	dividerStyle: {
		attribute: 'dividerStyle',
		cssVar: '--accordion-divider-style',
		themeable: true,
		type: 'string',
		defaultValue: 'solid',
		control: 'SelectControl',
		label: 'Divider Style',
		description: 'Style of divider between title and content',
		group: 'dividerLine',
	},
	titlePadding: {
		attribute: 'titlePadding',
		cssVar: '--accordion-title-padding',
		themeable: true,
		type: 'object',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: { top: 16, right: 16, bottom: 16, left: 16 },
		control: 'SpacingControl',
		label: 'Title Padding',
		description: 'Padding inside the title area',
		group: 'layout',
	},
	contentPadding: {
		attribute: 'contentPadding',
		cssVar: '--accordion-content-padding',
		themeable: true,
		type: 'object',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: { top: 16, right: 16, bottom: 16, left: 16 },
		control: 'SpacingControl',
		label: 'Content Padding',
		description: 'Padding inside the content area',
		group: 'layout',
	},
	accordionMarginBottom: {
		attribute: 'accordionMarginBottom',
		cssVar: '--accordion-margin-bottom',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: 8,
		control: 'RangeControl',
		label: 'Margin Bottom',
		description: 'Space between accordion blocks',
		group: 'layout',
	},
	itemSpacing: {
		attribute: 'itemSpacing',
		cssVar: '--accordion-item-spacing',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: null,
		control: 'RangeControl',
		label: 'Item Spacing',
		description: 'Spacing between items',
		group: 'layout',
	},
	showIcon: {
		attribute: 'showIcon',
		themeable: true,
		type: 'boolean',
		defaultValue: true,
		control: 'ToggleControl',
		label: 'Show Icon',
		description: 'Display expand/collapse icon',
		group: 'icon',
	},
	iconPosition: {
		attribute: 'iconPosition',
		themeable: true,
		type: 'string',
		defaultValue: 'right',
		control: 'SelectControl',
		label: 'Icon Position',
		description: 'Position of icon relative to title',
		group: 'icon',
	},
	iconSize: {
		attribute: 'iconSize',
		cssVar: '--accordion-icon-size',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: 20,
		control: 'RangeControl',
		label: 'Icon Size',
		description: 'Size of the icon in pixels',
		group: 'icon',
	},
	iconTypeClosed: {
		attribute: 'iconTypeClosed',
		themeable: true,
		type: 'string',
		defaultValue: '▾',
		control: 'IconPicker',
		label: 'Closed Icon',
		description: 'Icon when accordion is closed',
		group: 'icon',
	},
	iconTypeOpen: {
		attribute: 'iconTypeOpen',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'IconPicker',
		label: 'Open Icon',
		description: 'Icon when accordion is open (none = use just iconTypeClosed with rotation)',
		group: 'icon',
	},
	iconRotation: {
		attribute: 'iconRotation',
		cssVar: '--accordion-icon-rotation',
		themeable: true,
		type: 'number',
		units: [ 'deg' ],
		defaultUnit: 'deg',
		defaultValue: 180,
		control: 'RangeControl',
		label: 'Icon Rotation',
		description: 'Rotation angle when open (degrees)',
		group: 'icon',
	},
};

/**
 * Array of themeable attribute names
 */
export const ACCORDION_THEMEABLE: string[] = Object.entries( ACCORDION_CONFIG )
	.filter( ( [ _, cfg ] ) => cfg.themeable )
	.map( ( [ key ] ) => key );

/**
 * Mapping of attribute names to CSS variable names
 */
export const ACCORDION_CSS_VAR_MAPPING: Record< string, string > = Object.entries(
	ACCORDION_CONFIG
).reduce(
	( acc, [ key, cfg ] ) => {
		if ( cfg.cssVar ) {
			acc[ key ] = cfg.cssVar;
		}
		return acc;
	},
	{} as Record< string, string >
);

/**
 * Get configuration for a specific attribute
 * @param attributeName - Name of the attribute
 * @return Attribute configuration or undefined
 */
export function getAttributeConfig( attributeName: string ): AttributeConfig | undefined {
	return ACCORDION_CONFIG[ attributeName ];
}

/**
 * Check if an attribute is themeable
 * @param attributeName - Name of the attribute
 * @return True if attribute can be saved in themes
 */
export function isThemeable( attributeName: string ): boolean {
	return ACCORDION_CONFIG[ attributeName ]?.themeable ?? false;
}

/**
 * Get CSS variable name for an attribute
 * @param attributeName - Name of the attribute
 * @return CSS variable name or undefined
 */
export function getCssVarName( attributeName: string ): string | undefined {
	return ACCORDION_CONFIG[ attributeName ]?.cssVar;
}

/**
 * Get available units for an attribute
 * @param attributeName - Name of the attribute
 * @return Array of available units or undefined
 */
export function getAvailableUnits( attributeName: string ): string[] | undefined {
	return ACCORDION_CONFIG[ attributeName ]?.units;
}

/**
 * Get default unit for an attribute
 * @param attributeName - Name of the attribute
 * @return Default unit or undefined
 */
export function getDefaultUnit( attributeName: string ): string | undefined {
	return ACCORDION_CONFIG[ attributeName ]?.defaultUnit;
}

export default ACCORDION_CONFIG;
