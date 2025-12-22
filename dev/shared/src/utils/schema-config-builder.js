/**
 * Schema Config Builder
 *
 * Utility functions for extracting panel-specific configurations from JSON schemas.
 * This provides a single source of truth from schemas, eliminating the need for
 * blockType-based if/else logic in panel components.
 *
 * PURPOSE:
 * - Extract panel-specific configuration from schema files
 * - Provide a unified interface for querying schema attributes by panel/group
 * - Enable panel components to be block-agnostic by reading from schema
 *
 * WHY THIS EXISTS:
 * - Single source of truth: Schema files define all attribute metadata
 * - Eliminates duplication: No more inline blockType if/else mappings
 * - Maintainability: Changes to attribute structure only need to happen in schema
 * - Consistency: All blocks follow the same pattern for panel configuration
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Get panel configuration from schema by filtering attributes by group
 *
 * Filters all attributes in the schema that belong to the specified panel group.
 * Returns an object containing the filtered attributes with their full metadata.
 *
 * @param {Object} schema - The full schema object (e.g., accordion.json content)
 * @param {string} panelType - The panel/group name to filter by (e.g., 'colors', 'borders', 'typography')
 * @returns {Object} Configuration object with structure: { attributes: { ...filtered attributes } }
 *
 * @example
 * // Get all color-related attributes for accordion
 * import accordionSchema from '../../../schemas/accordion.json';
 * const colorConfig = getPanelConfig(accordionSchema, 'colors');
 * // Returns: {
 * //   attributes: {
 * //     titleColor: { type: 'string', default: '#333333', group: 'colors', ... },
 * //     titleBackgroundColor: { type: 'string', default: '#f5f5f5', group: 'colors', ... },
 * //     ...
 * //   }
 * // }
 *
 * @example
 * // Get typography attributes for tabs
 * import tabsSchema from '../../../schemas/tabs.json';
 * const typographyConfig = getPanelConfig(tabsSchema, 'typography');
 */
export function getPanelConfig( schema, panelType ) {
	if ( ! schema || ! schema.attributes ) {
		return { attributes: {} };
	}

	const filteredAttributes = {};

	for ( const [ attrName, attrConfig ] of Object.entries( schema.attributes ) ) {
		if ( attrConfig.group === panelType ) {
			filteredAttributes[ attrName ] = attrConfig;
		}
	}

	return {
		attributes: filteredAttributes,
	};
}

/**
 * Get array of attribute names belonging to a panel group
 *
 * Returns just the attribute names (keys) for a given panel group,
 * useful for iteration or validation checks.
 *
 * @param {Object} schema - The full schema object
 * @param {string} panelGroup - The panel/group name to filter by
 * @returns {string[]} Array of attribute names in the group
 *
 * @example
 * // Get list of icon attributes
 * import accordionSchema from '../../../schemas/accordion.json';
 * const iconAttrs = getAttributesByPanel(accordionSchema, 'icons');
 * // Returns: ['iconColor', 'showIcon', 'iconPosition', 'iconSize', 'iconTypeClosed', 'iconTypeOpen', 'iconRotation']
 *
 * @example
 * // Check if a specific attribute belongs to a panel
 * const layoutAttrs = getAttributesByPanel(schema, 'layout');
 * if (layoutAttrs.includes('titlePadding')) {
 *   // Handle titlePadding...
 * }
 */
export function getAttributesByPanel( schema, panelGroup ) {
	if ( ! schema || ! schema.attributes ) {
		return [];
	}

	return Object.entries( schema.attributes )
		.filter( ( [ , attrConfig ] ) => attrConfig.group === panelGroup )
		.map( ( [ attrName ] ) => attrName );
}

/**
 * Validate that a panel configuration contains expected attributes
 *
 * Checks if all expected attributes are present in the configuration.
 * Useful for ensuring schema compatibility and debugging.
 *
 * @param {Object} config - The panel configuration object (from getPanelConfig)
 * @param {string[]} expectedAttributes - Array of attribute names that should be present
 * @returns {Object} Validation result: { valid: boolean, missing: string[], extra: string[] }
 *
 * @example
 * // Validate accordion border config has required attributes
 * const borderConfig = getPanelConfig(accordionSchema, 'borders');
 * const validation = validatePanelConfig(borderConfig, [
 *   'accordionBorderColor',
 *   'accordionBorderThickness',
 *   'accordionBorderStyle',
 *   'accordionBorderRadius'
 * ]);
 * // Returns: { valid: true, missing: [], extra: [...any additional attrs] }
 *
 * @example
 * // Handle validation failures
 * const result = validatePanelConfig(config, expectedAttrs);
 * if (!result.valid) {
 *   console.warn('Missing required attributes:', result.missing);
 * }
 */
export function validatePanelConfig( config, expectedAttributes ) {
	if ( ! config || ! config.attributes ) {
		return {
			valid: false,
			missing: expectedAttributes,
			extra: [],
		};
	}

	const presentAttributes = Object.keys( config.attributes );
	const missing = expectedAttributes.filter( ( attr ) => ! presentAttributes.includes( attr ) );
	const extra = presentAttributes.filter( ( attr ) => ! expectedAttributes.includes( attr ) );

	return {
		valid: missing.length === 0,
		missing,
		extra,
	};
}

/**
 * Get attribute configuration by name from schema
 *
 * Retrieves the full configuration for a specific attribute.
 * Useful when you need individual attribute metadata.
 *
 * @param {Object} schema - The full schema object
 * @param {string} attrName - The attribute name to look up
 * @returns {Object|null} The attribute configuration or null if not found
 *
 * @example
 * // Get titleColor configuration
 * const titleColorConfig = getAttributeConfig(accordionSchema, 'titleColor');
 * // Returns: { type: 'string', default: '#333333', cssVar: 'accordion-title-color', group: 'colors', ... }
 */
export function getAttributeConfig( schema, attrName ) {
	if ( ! schema || ! schema.attributes || ! schema.attributes[ attrName ] ) {
		return null;
	}

	return schema.attributes[ attrName ];
}

/**
 * Get all groups defined in a schema
 *
 * Returns the groups metadata from the schema, useful for dynamically
 * building panel structures.
 *
 * @param {Object} schema - The full schema object
 * @returns {Object} Groups object with group names as keys
 *
 * @example
 * // Get all group definitions
 * const groups = getSchemaGroups(accordionSchema);
 * // Returns: {
 * //   colors: { title: 'Colors', description: '...' },
 * //   typography: { title: 'Typography', description: '...' },
 * //   borders: { title: 'Borders', description: '...' },
 * //   ...
 * // }
 */
export function getSchemaGroups( schema ) {
	if ( ! schema || ! schema.groups ) {
		return {};
	}

	return schema.groups;
}

/**
 * Get themeable attributes from a panel
 *
 * Filters panel attributes to only include those marked as themeable.
 * Useful for theme system integration.
 *
 * @param {Object} schema - The full schema object
 * @param {string} panelGroup - The panel/group name to filter by
 * @returns {Object} Configuration with only themeable attributes
 *
 * @example
 * // Get themeable color attributes only
 * const themeableColors = getThemeableAttributes(accordionSchema, 'colors');
 * // Returns only attributes where themeable: true
 */
export function getThemeableAttributes( schema, panelGroup ) {
	const panelConfig = getPanelConfig( schema, panelGroup );

	const themeableAttrs = {};

	for ( const [ attrName, attrConfig ] of Object.entries( panelConfig.attributes ) ) {
		if ( attrConfig.themeable === true ) {
			themeableAttrs[ attrName ] = attrConfig;
		}
	}

	return { attributes: themeableAttrs };
}

/**
 * Build attribute mapping for a panel
 *
 * Creates a mapping object useful for panel components that need
 * to reference attribute names dynamically. This replaces the inline
 * blockType-based if/else logic.
 *
 * @param {Object} schema - The full schema object
 * @param {string} panelGroup - The panel/group name
 * @param {Object} roleMapping - Mapping of roles to attribute name patterns
 * @returns {Object} Mapping of roles to actual attribute names
 *
 * @example
 * // Build border attribute mapping
 * const borderMapping = buildAttributeMapping(accordionSchema, 'borders', {
 *   color: ['BorderColor', 'borderColor'],
 *   thickness: ['BorderThickness', 'BorderWidth', 'borderWidth'],
 *   style: ['BorderStyle', 'borderStyle'],
 *   radius: ['BorderRadius', 'borderRadius'],
 *   shadow: ['Shadow'],
 *   shadowHover: ['ShadowHover']
 * });
 * // Returns: {
 * //   color: 'accordionBorderColor',
 * //   thickness: 'accordionBorderThickness',
 * //   style: 'accordionBorderStyle',
 * //   radius: 'accordionBorderRadius',
 * //   shadow: 'accordionShadow',
 * //   shadowHover: 'accordionShadowHover'
 * // }
 */
export function buildAttributeMapping( schema, panelGroup, roleMapping ) {
	const panelConfig = getPanelConfig( schema, panelGroup );
	const attrNames = Object.keys( panelConfig.attributes );
	const result = {};

	for ( const [ role, patterns ] of Object.entries( roleMapping ) ) {
		// Find the first attribute that matches any of the patterns
		for ( const pattern of patterns ) {
			const found = attrNames.find( ( attr ) => attr.includes( pattern ) );
			if ( found ) {
				result[ role ] = found;
				break;
			}
		}
	}

	return result;
}

/**
 * Get control configuration for an attribute
 *
 * Extracts control-specific configuration (min, max, step, options, etc.)
 * for use in rendering UI controls.
 *
 * @param {Object} schema - The full schema object
 * @param {string} attrName - The attribute name
 * @returns {Object} Control configuration
 *
 * @example
 * // Get range control config
 * const rangeConfig = getControlConfiguration(accordionSchema, 'titleFontSize');
 * // Returns: { control: 'RangeControl', min: 10, max: 48, unit: 'px' }
 *
 * @example
 * // Get select control config with options
 * const selectConfig = getControlConfiguration(accordionSchema, 'titleFontWeight');
 * // Returns: { control: 'SelectControl', options: [...] }
 */
export function getControlConfiguration( schema, attrName ) {
	const attrConfig = getAttributeConfig( schema, attrName );

	if ( ! attrConfig ) {
		return {};
	}

	const controlConfig = {
		control: attrConfig.control,
		type: attrConfig.type,
		default: attrConfig.default,
		label: attrConfig.label,
		description: attrConfig.description,
	};

	// Add numeric control properties
	if ( attrConfig.min !== undefined ) {
		controlConfig.min = attrConfig.min;
	}
	if ( attrConfig.max !== undefined ) {
		controlConfig.max = attrConfig.max;
	}
	if ( attrConfig.step !== undefined ) {
		controlConfig.step = attrConfig.step;
	}
	if ( attrConfig.unit !== undefined ) {
		controlConfig.unit = attrConfig.unit;
	}

	// Add select control options
	if ( attrConfig.options !== undefined ) {
		controlConfig.options = attrConfig.options;
	}

	return controlConfig;
}
