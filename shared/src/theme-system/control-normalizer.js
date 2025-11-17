/**
 * Control Value Normalizer
 *
 * Normalizes effective values from cascade for use in UI controls.
 * Ensures controls always receive valid, renderable values even when
 * cascade returns null/undefined.
 *
 * This acts as an intermediary between the cascade system and UI controls,
 * preventing crashes and providing sensible defaults for display.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Default fallback values for different control types
 * These are used only when cascade returns null AND no CSS defaults exist
 */
const CONTROL_DEFAULTS = {
	// Colors
	color: '#000000',
	backgroundColor: '#ffffff',
	borderColor: '#dddddd',

	// Numbers
	fontSize: 16,
	padding: 16,
	margin: 8,
	borderWidth: 1,
	borderRadius: 4,

	// Strings
	fontWeight: '400',
	fontStyle: 'normal',
	textAlign: 'left',
	textTransform: 'none',
	textDecoration: 'none',
	borderStyle: 'solid',

	// Booleans
	boolean: false,

	// Objects
	paddingObject: { top: 16, right: 16, bottom: 16, left: 16 },
	borderRadiusObject: {
		topLeft: 4,
		topRight: 4,
		bottomLeft: 4,
		bottomRight: 4,
	},
};

/**
 * Infer control type from attribute name
 *
 * @param {string} attrName - Attribute name (e.g., 'titleColor', 'titleFontSize')
 * @return {string} Control type ('color', 'number', 'string', 'boolean', 'object')
 */
function inferControlType( attrName ) {
	const lowerName = attrName.toLowerCase();

	// Color attributes
	if ( lowerName.includes( 'color' ) || lowerName.includes( 'colour' ) ) {
		return 'color';
	}

	// Number attributes
	if (
		lowerName.includes( 'size' ) ||
		lowerName.includes( 'width' ) ||
		lowerName.includes( 'height' ) ||
		lowerName.includes( 'thickness' ) ||
		lowerName === 'iconrotation'
	) {
		return 'number';
	}

	// Object attributes (padding, border radius, etc.)
	if (
		lowerName.includes( 'padding' ) ||
		lowerName.includes( 'margin' ) ||
		lowerName.includes( 'radius' )
	) {
		return 'object';
	}

	// Boolean attributes
	if (
		lowerName.startsWith( 'show' ) ||
		lowerName.startsWith( 'enable' ) ||
		lowerName.startsWith( 'disable' ) ||
		lowerName.startsWith( 'is' ) ||
		lowerName.startsWith( 'allow' )
	) {
		return 'boolean';
	}

	// Default to string
	return 'string';
}

/**
 * Get appropriate fallback value based on attribute name
 *
 * @param {string} attrName    - Attribute name
 * @param {string} controlType - Control type (if known)
 * @return {*} Fallback value appropriate for this attribute
 */
function getFallbackValue( attrName, controlType = null ) {
	const type = controlType || inferControlType( attrName );

	switch ( type ) {
		case 'color':
			// Different defaults for different color types
			if ( attrName.includes( 'Background' ) || attrName.includes( 'Bg' ) ) {
				return CONTROL_DEFAULTS.backgroundColor;
			}
			if ( attrName.includes( 'Border' ) ) {
				return CONTROL_DEFAULTS.borderColor;
			}
			return CONTROL_DEFAULTS.color;

		case 'number':
			if ( attrName.includes( 'FontSize' ) || attrName.includes( 'Size' ) ) {
				return CONTROL_DEFAULTS.fontSize;
			}
			if ( attrName.includes( 'Padding' ) ) {
				return CONTROL_DEFAULTS.padding;
			}
			if ( attrName.includes( 'Margin' ) ) {
				return CONTROL_DEFAULTS.margin;
			}
			if ( attrName.includes( 'BorderWidth' ) || attrName.includes( 'Thickness' ) ) {
				return CONTROL_DEFAULTS.borderWidth;
			}
			if ( attrName.includes( 'Radius' ) ) {
				return CONTROL_DEFAULTS.borderRadius;
			}
			return 0;

		case 'boolean':
			return CONTROL_DEFAULTS.boolean;

		case 'object':
			if ( attrName.includes( 'Padding' ) || attrName.includes( 'Margin' ) ) {
				return CONTROL_DEFAULTS.paddingObject;
			}
			if ( attrName.includes( 'Radius' ) ) {
				return CONTROL_DEFAULTS.borderRadiusObject;
			}
			return {};

		case 'string':
		default:
			if ( attrName.includes( 'FontWeight' ) ) {
				return CONTROL_DEFAULTS.fontWeight;
			}
			if ( attrName.includes( 'FontStyle' ) ) {
				return CONTROL_DEFAULTS.fontStyle;
			}
			if ( attrName.includes( 'Alignment' ) || attrName.includes( 'Align' ) ) {
				return CONTROL_DEFAULTS.textAlign;
			}
			if ( attrName.includes( 'Transform' ) ) {
				return CONTROL_DEFAULTS.textTransform;
			}
			if ( attrName.includes( 'Decoration' ) ) {
				return CONTROL_DEFAULTS.textDecoration;
			}
			if ( attrName.includes( 'BorderStyle' ) ) {
				return CONTROL_DEFAULTS.borderStyle;
			}
			return '';
	}
}

/**
 * Normalize a single value for use in UI controls
 *
 * Takes a value from effectiveValues (which might be null) and returns
 * a safe value that UI controls can render without crashing.
 *
 * @param {*}      value       - Value from effectiveValues (may be null/undefined)
 * @param {string} attrName    - Attribute name (used to infer appropriate fallback)
 * @param {string} controlType - Optional explicit control type
 * @return {*} Normalized value safe for UI controls
 *
 * @example
 * // Color value
 * normalizeValueForControl(null, 'titleColor');
 * // Returns: '#000000'
 *
 * @example
 * // Valid value passed through
 * normalizeValueForControl('#ff0000', 'titleColor');
 * // Returns: '#ff0000'
 *
 * @example
 * // Number value
 * normalizeValueForControl(null, 'titleFontSize');
 * // Returns: 16
 *
 * @example
 * // Boolean value
 * normalizeValueForControl(null, 'showIcon');
 * // Returns: false
 */
export function normalizeValueForControl( value, attrName, controlType = null ) {
	// If value is defined (not null/undefined), use it
	if ( value !== null && value !== undefined ) {
		return value;
	}

	// Value is null/undefined - provide fallback
	return getFallbackValue( attrName, controlType );
}

/**
 * Normalize all effective values for use in UI controls
 *
 * Takes an effectiveValues object (from getAllEffectiveValues) and ensures
 * all values are safe for UI controls, replacing any null/undefined values
 * with appropriate fallbacks.
 *
 * @param {Object} effectiveValues - Effective values from cascade (may contain nulls)
 * @param {Object} attributeTypes  - Optional map of attribute names to types
 * @return {Object} Normalized values safe for all UI controls
 *
 * @example
 * const effectiveValues = {
 *   titleColor: null,           // CSS defaults didn't load
 *   titleFontSize: 18,          // From theme
 *   showIcon: null              // No value anywhere
 * };
 *
 * const normalized = normalizeAllValues(effectiveValues);
 * // Returns: {
 * //   titleColor: '#000000',     // Fallback provided
 * //   titleFontSize: 18,         // Value passed through
 * //   showIcon: false            // Fallback provided
 * // }
 */
export function normalizeAllValues( effectiveValues, attributeTypes = {} ) {
	const normalized = {};

	for ( const attrName in effectiveValues ) {
		const value = effectiveValues[ attrName ];
		const controlType = attributeTypes[ attrName ] || null;

		normalized[ attrName ] = normalizeValueForControl( value, attrName, controlType );
	}

	return normalized;
}

/**
 * Check if a value needs normalization
 *
 * @param {*} value - Value to check
 * @return {boolean} True if value is null/undefined and needs normalization
 */
export function needsNormalization( value ) {
	return value === null || value === undefined;
}
