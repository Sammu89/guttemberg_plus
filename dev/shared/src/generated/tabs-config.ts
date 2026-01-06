/**
 * Block Configuration for Tabs
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-11-26T23:02:45.282Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package
 * @since 1.0.0
 */

/**
 * Comprehensive attribute configuration for Tabs block
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
 * Complete configuration for all Tabs attributes
 */
export const TABS_CONFIG: Record< string, AttributeConfig > = {
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
	tabs: {
		attribute: 'tabs',
		themeable: false,
		type: 'array',
		defaultValue: [
			{ id: '', title: 'Tab 1', content: '', isDisabled: false },
			{ id: '', title: 'Tab 2', content: '', isDisabled: false },
		],
		label: 'Tabs',
		description: 'Array of tab items with title, content, and state',
		group: 'behavior',
		reason: 'content',
	},
	orientation: {
		attribute: 'orientation',
		themeable: false,
		type: 'string',
		defaultValue: 'horizontal',
		control: 'SelectControl',
		label: 'Orientation',
		description: 'Tab layout orientation',
		group: 'behavior',
		reason: 'behavioral',
	},
	activationMode: {
		attribute: 'activationMode',
		themeable: false,
		type: 'string',
		defaultValue: 'auto',
		control: 'SelectControl',
		label: 'Activation Mode',
		description: 'How tabs are activated (auto = focus, manual = click)',
		group: 'behavior',
		reason: 'behavioral',
	},
	responsiveBreakpoint: {
		attribute: 'responsiveBreakpoint',
		themeable: false,
		type: 'number',
		defaultValue: 768,
		control: 'RangeControl',
		label: 'Responsive Breakpoint',
		description: 'Width in pixels below which to show accordion fallback',
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
		group: 'behavior',
		reason: 'structural',
	},
	title: {
		attribute: 'title',
		themeable: false,
		type: 'string',
		defaultValue: 'Tabs',
		control: 'TextControl',
		label: 'Title',
		description: 'Block title (for accessibility)',
		group: 'behavior',
		reason: 'content',
	},
	verticalTabButtonTextAlign: {
		attribute: 'verticalTabButtonTextAlign',
		themeable: false,
		type: 'string',
		defaultValue: 'left',
		control: 'SelectControl',
		label: 'Vertical Tab Alignment',
		description: 'Text alignment for vertical tabs',
		group: 'behavior',
		reason: 'behavioral',
	},
	showIcon: {
		attribute: 'showIcon',
		cssVar: '--tab-show-icon',
		themeable: true,
		type: 'boolean',
		defaultValue: true,
		control: 'ToggleControl',
		label: 'Show Icon',
		description: 'Display icons in tab buttons',
		group: 'icon',
	},
	iconPosition: {
		attribute: 'iconPosition',
		themeable: true,
		type: 'string',
		defaultValue: 'right',
		control: 'SelectControl',
		label: 'Icon Position',
		description: 'Position of icon relative to text',
		group: 'icon',
	},
	iconColor: {
		attribute: 'iconColor',
		cssVar: '--tab-icon-color',
		themeable: true,
		type: 'string',
		defaultValue: '#666666',
		control: 'ColorPicker',
		label: 'Icon Color',
		description: 'Color of the tab icon',
		group: 'icon',
	},
	iconSize: {
		attribute: 'iconSize',
		cssVar: '--tab-icon-size',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: 16,
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
		description: 'Icon when tab is closed (char or image URL)',
		group: 'icon',
	},
	iconTypeOpen: {
		attribute: 'iconTypeOpen',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'IconPicker',
		label: 'Open Icon',
		description: 'Icon when tab is open (none = use closed icon with rotation)',
		group: 'icon',
	},
	iconRotation: {
		attribute: 'iconRotation',
		cssVar: '--tab-icon-rotation',
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
	tabButtonColor: {
		attribute: 'tabButtonColor',
		cssVar: '--tab-button-color',
		themeable: true,
		type: 'string',
		defaultValue: '#666666',
		control: 'ColorPicker',
		label: 'Tab Button Color',
		description: 'Text color for inactive tab buttons',
		group: 'titleColors',
	},
	tabButtonBackgroundColor: {
		attribute: 'tabButtonBackgroundColor',
		cssVar: '--tab-button-bg',
		themeable: true,
		type: 'string',
		defaultValue: 'transparent',
		control: 'ColorPicker',
		label: 'Tab Button Background',
		description: 'Background color for inactive tab buttons',
		group: 'titleColors',
	},
	tabButtonHoverColor: {
		attribute: 'tabButtonHoverColor',
		cssVar: '--tab-button-hover-color',
		themeable: true,
		type: 'string',
		defaultValue: '#333333',
		control: 'ColorPicker',
		label: 'Tab Button Hover Color',
		description: 'Text color when hovering over tab',
		group: 'titleColors',
	},
	tabButtonHoverBackgroundColor: {
		attribute: 'tabButtonHoverBackgroundColor',
		cssVar: '--tab-button-hover-bg',
		themeable: true,
		type: 'string',
		defaultValue: '#e8e8e8',
		control: 'ColorPicker',
		label: 'Tab Button Hover Background',
		description: 'Background color when hovering over tab',
		group: 'titleColors',
	},
	tabButtonActiveColor: {
		attribute: 'tabButtonActiveColor',
		cssVar: '--tab-button-active-color',
		themeable: true,
		type: 'string',
		defaultValue: '#000000',
		control: 'ColorPicker',
		label: 'Tab Button Active Color',
		description: 'Text color for active/selected tab',
		group: 'titleColors',
	},
	tabButtonActiveBackgroundColor: {
		attribute: 'tabButtonActiveBackgroundColor',
		cssVar: '--tab-button-active-bg',
		themeable: true,
		type: 'string',
		defaultValue: '#ffffff',
		control: 'ColorPicker',
		label: 'Tab Button Active Background',
		description: 'Background color for active/selected tab',
		group: 'titleColors',
	},
	tabButtonActiveBorderColor: {
		attribute: 'tabButtonActiveBorderColor',
		cssVar: '--tab-button-active-border-color',
		themeable: true,
		type: 'string',
		defaultValue: '#dddddd',
		control: 'ColorPicker',
		label: 'Tab Button Active Border Color',
		description: 'Border color for the active tab',
		group: 'titleColors',
	},
	tabButtonActiveBorderBottomColor: {
		attribute: 'tabButtonActiveBorderBottomColor',
		cssVar: '--tab-button-active-border-bottom-color',
		themeable: true,
		type: 'string',
		defaultValue: 'transparent',
		control: 'ColorPicker',
		label: 'Tab Button Active Border Bottom',
		description: 'Bottom border color for active tab (creates connected effect)',
		group: 'titleColors',
	},
	buttonBorderColor: {
		attribute: 'buttonBorderColor',
		cssVar: '--tabs-button-border-color',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'ColorPicker',
		label: 'Border Color',
		description: 'Border color for inactive tab buttons',
		group: 'buttonBorders',
	},
	buttonBorderWidth: {
		attribute: 'buttonBorderWidth',
		cssVar: '--tabs-button-border-width',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: null,
		control: 'RangeControl',
		label: 'Border Width',
		description: 'Border width for tab buttons',
		group: 'buttonBorders',
	},
	buttonBorderStyle: {
		attribute: 'buttonBorderStyle',
		cssVar: '--tabs-button-border-style',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'SelectControl',
		label: 'Border Style',
		description: 'Border style for tab buttons',
		group: 'buttonBorders',
	},
	buttonBorderRadius: {
		attribute: 'buttonBorderRadius',
		cssVar: '--tabs-button-border-radius',
		themeable: true,
		type: 'object',
		units: [ 'px', '%' ],
		defaultUnit: 'px',
		defaultValue: { topLeft: 4, topRight: 4, bottomRight: 0, bottomLeft: 0 },
		control: 'BorderRadiusControl',
		label: 'Border Radius',
		description: 'Corner radius for tab buttons',
		group: 'buttonBorders',
	},
	buttonShadow: {
		attribute: 'buttonShadow',
		cssVar: '--tabs-button-border-shadow',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'TextControl',
		label: 'Shadow',
		description: 'Box shadow for tab buttons',
		group: 'buttonBorders',
	},
	buttonShadowHover: {
		attribute: 'buttonShadowHover',
		cssVar: '--tabs-button-border-shadow-hover',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'TextControl',
		label: 'Shadow Hover',
		description: 'Box shadow for tab buttons on hover',
		group: 'buttonBorders',
	},
	tabButtonFontSize: {
		attribute: 'tabButtonFontSize',
		cssVar: '--tab-button-font-size',
		themeable: true,
		type: 'number',
		units: [ 'px', 'em', 'rem' ],
		defaultUnit: 'px',
		defaultValue: 16,
		control: 'RangeControl',
		label: 'Tab Button Font Size',
		description: 'Font size for tab buttons',
		group: 'titleTypography',
	},
	tabButtonFontWeight: {
		attribute: 'tabButtonFontWeight',
		cssVar: '--tab-button-font-weight',
		themeable: true,
		type: 'string',
		defaultValue: '500',
		control: 'SelectControl',
		label: 'Tab Button Font Weight',
		description: 'Font weight for tab buttons',
		group: 'titleTypography',
	},
	tabButtonFontStyle: {
		attribute: 'tabButtonFontStyle',
		cssVar: '--tab-button-font-style',
		themeable: true,
		type: 'string',
		defaultValue: 'normal',
		control: 'SelectControl',
		label: 'Tab Button Font Style',
		description: 'Font style for tab buttons',
		group: 'titleTypography',
	},
	tabButtonTextTransform: {
		attribute: 'tabButtonTextTransform',
		cssVar: '--tab-button-text-transform',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'SelectControl',
		label: 'Tab Button Text Transform',
		description: 'Text transformation for tab buttons',
		group: 'titleTypography',
	},
	tabButtonTextDecoration: {
		attribute: 'tabButtonTextDecoration',
		cssVar: '--tab-button-text-decoration',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'SelectControl',
		label: 'Tab Button Text Decoration',
		description: 'Text decoration for tab buttons',
		group: 'titleTypography',
	},
	tabButtonTextAlign: {
		attribute: 'tabButtonTextAlign',
		cssVar: '--tab-button-text-align',
		themeable: true,
		type: 'string',
		defaultValue: 'center',
		control: 'SelectControl',
		label: 'Tab Button Text Alignment',
		description: 'Text alignment for tab buttons',
		group: 'titleTypography',
	},
	tabListBackgroundColor: {
		attribute: 'tabListBackgroundColor',
		cssVar: '--tab-list-bg',
		themeable: true,
		type: 'string',
		defaultValue: '#f5f5f5',
		control: 'ColorPicker',
		label: 'Tab List Background',
		description: 'Background color for the tab navigation bar',
		group: 'titleColors',
	},
	tabListAlignment: {
		attribute: 'tabListAlignment',
		cssVar: '--tab-list-align',
		themeable: true,
		type: 'string',
		defaultValue: 'left',
		control: 'SelectControl',
		label: 'Tab List Alignment',
		description: 'Horizontal alignment of tabs',
		group: 'titleTypography',
	},
	panelColor: {
		attribute: 'panelColor',
		cssVar: '--tab-panel-color',
		themeable: true,
		type: 'string',
		defaultValue: '#333333',
		control: 'ColorPicker',
		label: 'Panel Text Color',
		description: 'Text color for tab panel content',
		group: 'titleColors',
	},
	panelBackgroundColor: {
		attribute: 'panelBackgroundColor',
		cssVar: '--tab-panel-bg',
		themeable: true,
		type: 'string',
		defaultValue: '#ffffff',
		control: 'ColorPicker',
		label: 'Panel Background',
		description: 'Background color for tab panels',
		group: 'titleColors',
	},
	dividerColor: {
		attribute: 'dividerColor',
		cssVar: '--tabs-divider-color',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'ColorPicker',
		label: 'Divider Color',
		description: 'Color of divider line between tabs and panel',
		group: 'dividerLine',
	},
	dividerWidth: {
		attribute: 'dividerWidth',
		cssVar: '--tabs-divider-width',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: null,
		control: 'RangeControl',
		label: 'Divider Width',
		description: 'Width/thickness of divider line',
		group: 'dividerLine',
	},
	dividerStyle: {
		attribute: 'dividerStyle',
		cssVar: '--tabs-divider-style',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'SelectControl',
		label: 'Divider Style',
		description: 'Style of divider line between tabs and panel',
		group: 'dividerLine',
	},
	borderColor: {
		attribute: 'borderColor',
		cssVar: '--tabs-border-color',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'ColorPicker',
		label: 'Border Color',
		description: 'Border color for main tabs wrapper',
		group: 'borders',
	},
	borderWidth: {
		attribute: 'borderWidth',
		cssVar: '--tabs-border-width',
		themeable: true,
		type: 'number',
		units: [ 'px' ],
		defaultUnit: 'px',
		defaultValue: null,
		control: 'RangeControl',
		label: 'Border Width',
		description: 'Border width for main wrapper',
		group: 'borders',
	},
	borderStyle: {
		attribute: 'borderStyle',
		cssVar: '--tabs-border-style',
		themeable: true,
		type: 'string',
		defaultValue: null,
		control: 'SelectControl',
		label: 'Border Style',
		description: 'Border style for wrapper',
		group: 'borders',
	},
	borderRadius: {
		attribute: 'borderRadius',
		cssVar: '--tabs-border-radius',
		themeable: true,
		type: 'object',
		units: [ 'px', '%' ],
		defaultUnit: 'px',
		defaultValue: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
		control: 'BorderRadiusControl',
		label: 'Border Radius',
		description: 'Corner radius for main wrapper',
		group: 'borders',
	},
	shadow: {
		attribute: 'shadow',
		cssVar: '--tabs-border-shadow',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'TextControl',
		label: 'Shadow',
		description: 'Box shadow for main wrapper',
		group: 'borders',
	},
	shadowHover: {
		attribute: 'shadowHover',
		cssVar: '--tabs-border-shadow-hover',
		themeable: true,
		type: 'string',
		defaultValue: 'none',
		control: 'TextControl',
		label: 'Shadow Hover',
		description: 'Box shadow for wrapper on hover',
		group: 'borders',
	},
};

/**
 * Array of themeable attribute names
 */
export const TABS_THEMEABLE: string[] = Object.entries( TABS_CONFIG )
	.filter( ( [ _, cfg ] ) => cfg.themeable )
	.map( ( [ key ] ) => key );

/**
 * Mapping of attribute names to CSS variable names
 */
export const TABS_CSS_VAR_MAPPING: Record< string, string > = Object.entries( TABS_CONFIG ).reduce(
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
	return TABS_CONFIG[ attributeName ];
}

/**
 * Check if an attribute is themeable
 * @param attributeName - Name of the attribute
 * @return True if attribute can be saved in themes
 */
export function isThemeable( attributeName: string ): boolean {
	return TABS_CONFIG[ attributeName ]?.themeable ?? false;
}

/**
 * Get CSS variable name for an attribute
 * @param attributeName - Name of the attribute
 * @return CSS variable name or undefined
 */
export function getCssVarName( attributeName: string ): string | undefined {
	return TABS_CONFIG[ attributeName ]?.cssVar;
}

/**
 * Get available units for an attribute
 * @param attributeName - Name of the attribute
 * @return Array of available units or undefined
 */
export function getAvailableUnits( attributeName: string ): string[] | undefined {
	return TABS_CONFIG[ attributeName ]?.units;
}

/**
 * Get default unit for an attribute
 * @param attributeName - Name of the attribute
 * @return Default unit or undefined
 */
export function getDefaultUnit( attributeName: string ): string | undefined {
	return TABS_CONFIG[ attributeName ]?.defaultUnit;
}

export default TABS_CONFIG;
