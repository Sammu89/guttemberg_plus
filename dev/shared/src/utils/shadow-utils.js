/**
 * Shadow Utilities
 *
 * Utilities for handling CSS box-shadow values with support for multiple layers.
 * Provides functions to build, format, create, and manipulate shadow layer objects.
 *
 * @package
 * @since 1.0.0
 */

/**
 * @typedef {Object} ShadowValue
 * @property {number} value - The numeric value
 * @property {string} unit  - The CSS unit (e.g., 'px', 'em', 'rem')
 */

/**
 * @typedef {Object} ShadowLayer
 * @property {ShadowValue} x      - Horizontal offset
 * @property {ShadowValue} y      - Vertical offset
 * @property {ShadowValue} blur   - Blur radius
 * @property {ShadowValue} spread - Spread radius
 * @property {string}      color  - Shadow color (any valid CSS color)
 * @property {boolean}     inset  - Whether the shadow is inset
 */

/**
 * Formats a shadow value object to a CSS string with unit.
 *
 * Handles both structured { value, unit } format and raw numeric values.
 * Ensures consistent output format for CSS generation.
 *
 * @param {ShadowValue|number|null|undefined} valueObj - The value to format
 * @return {string} Formatted value with unit (e.g., "8px", "0px")
 *
 * @example
 * formatShadowValue({ value: 8, unit: 'px' })
 * // Returns: "8px"
 *
 * @example
 * formatShadowValue(8)
 * // Returns: "8px"
 *
 * @example
 * formatShadowValue(null)
 * // Returns: "0px"
 */
export function formatShadowValue( valueObj ) {
	// Handle null/undefined - default to 0px
	if ( valueObj === null || valueObj === undefined ) {
		return '0px';
	}

	// Handle string values (e.g., "0px", "8px") - return as-is
	if ( typeof valueObj === 'string' ) {
		return valueObj;
	}

	// Handle raw number - assume px unit
	if ( typeof valueObj === 'number' ) {
		return `${ valueObj }px`;
	}

	// Handle structured value object
	if ( typeof valueObj === 'object' && valueObj !== null ) {
		const value = valueObj.value ?? 0;
		const unit = valueObj.unit ?? 'px';
		return `${ value }${ unit }`;
	}

	// Fallback for unexpected types
	return '0px';
}

/**
 * Builds a CSS box-shadow string from an array of shadow layer objects.
 *
 * Compiles multiple shadow layers into a single CSS box-shadow value.
 * Filters out invalid layers (those without a color) and handles the inset keyword.
 *
 * @param {Array<ShadowLayer>|null|undefined} shadows - Array of shadow layer objects
 * @return {string} CSS box-shadow value or 'none' if no valid shadows
 *
 * @example
 * buildBoxShadow([
 *   {
 *     x: { value: 0, unit: 'px' },
 *     y: { value: 8, unit: 'px' },
 *     blur: { value: 24, unit: 'px' },
 *     spread: { value: 0, unit: 'px' },
 *     color: 'rgba(0,0,0,0.15)',
 *     inset: false
 *   }
 * ])
 * // Returns: "0px 8px 24px 0px rgba(0,0,0,0.15)"
 *
 * @example
 * buildBoxShadow([
 *   {
 *     x: { value: 0, unit: 'px' },
 *     y: { value: 2, unit: 'px' },
 *     blur: { value: 4, unit: 'px' },
 *     spread: { value: 0, unit: 'px' },
 *     color: 'rgba(0,0,0,0.1)',
 *     inset: true
 *   }
 * ])
 * // Returns: "inset 0px 2px 4px 0px rgba(0,0,0,0.1)"
 *
 * @example
 * buildBoxShadow([])
 * // Returns: "none"
 *
 * @example
 * buildBoxShadow(null)
 * // Returns: "none"
 */
export function buildBoxShadow( shadows ) {
	// Handle null/undefined or empty array
	if ( ! shadows || ! Array.isArray( shadows ) || shadows.length === 0 ) {
		return 'none';
	}

	// Filter out invalid layers (those without a color)
	const validLayers = shadows.filter( ( layer ) => {
		return layer && layer.color && layer.color.trim() !== '';
	} );

	// If no valid layers, return 'none'
	if ( validLayers.length === 0 ) {
		return 'none';
	}

	// Build shadow string for each layer
	const shadowStrings = validLayers.map( ( layer ) => {
		const parts = [];

		// Add inset keyword if applicable
		if ( layer.inset === true ) {
			parts.push( 'inset' );
		}

		// Add offset-x, offset-y, blur-radius, spread-radius
		parts.push( formatShadowValue( layer.x ) );
		parts.push( formatShadowValue( layer.y ) );
		parts.push( formatShadowValue( layer.blur ) );
		parts.push( formatShadowValue( layer.spread ) );

		// Add color
		parts.push( layer.color );

		return parts.join( ' ' );
	} );

	// Join multiple layers with comma-space separator
	return shadowStrings.join( ', ' );
}

/**
 * Builds a CSS text-shadow string from an array of shadow layer objects.
 *
 * Similar to buildBoxShadow, but omits blur, spread, and inset properties.
 * Compiles multiple shadow layers into a single CSS text-shadow value.
 *
 * @param {Array<ShadowLayer>|null|undefined} shadows - Array of shadow layer objects
 * @return {string} CSS text-shadow value or 'none' if no valid shadows
 *
 * @example
 * buildTextShadow([
 *   {
 *     x: { value: 2, unit: 'px' },
 *     y: { value: 2, unit: 'px' },
 *     color: 'rgba(0,0,0,0.3)'
 *   }
 * ])
 * // Returns: "2px 2px rgba(0,0,0,0.3)"
 *
 * @example
 * buildTextShadow([])
 * // Returns: "none"
 */
export function buildTextShadow( shadows ) {
	// Handle null/undefined or empty array
	if ( ! shadows || ! Array.isArray( shadows ) || shadows.length === 0 ) {
		return 'none';
	}

	// Filter out invalid layers (those without a color)
	const validLayers = shadows.filter( ( layer ) => {
		return layer && layer.color && layer.color.trim() !== '';
	} );

	// If no valid layers, return 'none'
	if ( validLayers.length === 0 ) {
		return 'none';
	}

	// Build shadow string for each layer (text-shadow format: offset-x offset-y color)
	const shadowStrings = validLayers.map( ( layer ) => {
		const parts = [];

		// Add offset-x, offset-y (NO blur, spread, or inset for text-shadow)
		parts.push( formatShadowValue( layer.x ) );
		parts.push( formatShadowValue( layer.y ) );

		// Add color
		parts.push( layer.color );

		return parts.join( ' ' );
	} );

	// Join multiple layers with comma-space separator
	return shadowStrings.join( ', ' );
}

/**
 * Creates a default shadow layer object with sensible defaults.
 *
 * Provides a standard starting point for creating new shadow layers.
 * Default values create a subtle drop shadow effect.
 *
 * @return {ShadowLayer} A new shadow layer object with default values
 *
 * @example
 * const newLayer = createDefaultShadowLayer();
 * // Returns:
 * // {
 * //   x: { value: 0, unit: 'px' },
 * //   y: { value: 8, unit: 'px' },
 * //   blur: { value: 24, unit: 'px' },
 * //   spread: { value: 0, unit: 'px' },
 * //   color: 'rgba(0,0,0,0.15)',
 * //   inset: false
 * // }
 */
export function createDefaultShadowLayer() {
	return {
		x: { value: 0, unit: 'px' },
		y: { value: 8, unit: 'px' },
		blur: { value: 24, unit: 'px' },
		spread: { value: 0, unit: 'px' },
		color: 'rgba(0,0,0,0.15)',
		inset: false,
	};
}

/**
 * Duplicates a shadow layer with an optional Y-offset adjustment.
 *
 * Creates a deep copy of a shadow layer and optionally adjusts the Y offset.
 * Useful for creating layered shadow effects with progressive offsets.
 *
 * @param {ShadowLayer|null|undefined} layer       - The shadow layer to duplicate
 * @param {number}                     [offsetY=4] - Amount to add to the Y value (can be negative)
 * @return {ShadowLayer} A new shadow layer object (duplicate with offset applied)
 *
 * @example
 * const original = {
 *   x: { value: 0, unit: 'px' },
 *   y: { value: 8, unit: 'px' },
 *   blur: { value: 24, unit: 'px' },
 *   spread: { value: 0, unit: 'px' },
 *   color: 'rgba(0,0,0,0.15)',
 *   inset: false
 * };
 *
 * duplicateShadowLayer(original, 4)
 * // Returns: Same as original but y.value is 12 (8 + 4)
 *
 * @example
 * duplicateShadowLayer(original, -2)
 * // Returns: Same as original but y.value is 6 (8 - 2)
 *
 * @example
 * duplicateShadowLayer(original)
 * // Returns: Same as original but y.value is 12 (8 + default 4)
 *
 * @example
 * duplicateShadowLayer(null)
 * // Returns: Default shadow layer with offsetY applied
 */
export function duplicateShadowLayer( layer, offsetY = 4 ) {
	// Handle null/undefined - create default layer
	if ( ! layer ) {
		const defaultLayer = createDefaultShadowLayer();
		defaultLayer.y.value += offsetY;
		return defaultLayer;
	}

	// Create deep copy of the layer
	const duplicate = {
		x: { ...layer.x },
		y: { ...layer.y },
		blur: { ...layer.blur },
		spread: { ...layer.spread },
		color: layer.color,
		inset: layer.inset,
	};

	// Apply Y offset
	if ( duplicate.y && typeof duplicate.y.value === 'number' ) {
		duplicate.y.value += offsetY;
	}

	return duplicate;
}
