/**
 * Validation Utilities
 *
 * Helper functions for validating attribute values.
 * Ensures data integrity before saving to database or rendering.
 *
 * @see docs/BLOCKS/30-SHARED-ATTRIBUTES.md
 * @package
 * @since 1.0.0
 */

/**
 * Validate CSS color value
 *
 * Accepts: hex, rgb, rgba, hsl, hsla, named colors
 *
 * @param {string} color - Color value to validate
 * @return {boolean} True if valid CSS color
 *
 * @example
 * isValidColor('#fff')         // true
 * isValidColor('rgb(255,0,0)') // true
 * isValidColor('invalid')      // false
 */
export function isValidColor( color ) {
	if ( typeof color !== 'string' ) {
		return false;
	}

	// Named colors (common subset)
	const namedColors = [
		'transparent',
		'black',
		'white',
		'red',
		'green',
		'blue',
		'yellow',
		'cyan',
		'magenta',
		'gray',
		'grey',
	];

	if ( namedColors.includes( color.toLowerCase() ) ) {
		return true;
	}

	// Hex colors: #fff, #ffffff, #ffffff00
	const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
	if ( hexRegex.test( color ) ) {
		return true;
	}

	// RGB/RGBA: rgb(255, 255, 255), rgba(255, 255, 255, 0.5)
	const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
	if ( rgbRegex.test( color ) ) {
		return true;
	}

	// HSL/HSLA: hsl(0, 100%, 50%), hsla(0, 100%, 50%, 0.5)
	const hslRegex =
		/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+\s*)?\)$/;
	if ( hslRegex.test( color ) ) {
		return true;
	}

	return false;
}

/**
 * Validate theme name
 *
 * Rules:
 * - Not empty
 * - 1-50 characters
 * - Alphanumeric, spaces, hyphens, underscores only
 * - Not "Default" or "Custom" (case-insensitive)
 *
 * @param {string} name - Theme name to validate
 * @return {Object} { valid: boolean, error: string|null }
 */
export function validateThemeName( name ) {
	// Check type
	if ( typeof name !== 'string' ) {
		return { valid: false, error: 'Theme name must be a string.' };
	}

	// Check empty
	if ( name.trim().length === 0 ) {
		return { valid: false, error: 'Theme name cannot be empty.' };
	}

	// Check length
	if ( name.length > 50 ) {
		return {
			valid: false,
			error: 'Theme name must be 50 characters or less.',
		};
	}

	// Check reserved names
	const lowerName = name.toLowerCase();
	if ( lowerName === 'default' || lowerName === 'custom' ) {
		return {
			valid: false,
			error: 'Theme name cannot be "Default" or "Custom".',
		};
	}

	// Check valid characters
	const validCharsRegex = /^[a-zA-Z0-9\s\-_]+$/;
	if ( ! validCharsRegex.test( name ) ) {
		return {
			valid: false,
			error: 'Theme name can only contain letters, numbers, spaces, hyphens, and underscores.',
		};
	}

	return { valid: true, error: null };
}

/**
 * Validate numeric value within range
 *
 * @param {*}      value - Value to validate
 * @param {number} min   - Minimum allowed value
 * @param {number} max   - Maximum allowed value (optional)
 * @return {boolean} True if valid number within range
 */
export function isValidNumber( value, min = 0, max = Infinity ) {
	if ( typeof value !== 'number' || isNaN( value ) ) {
		return false;
	}

	return value >= min && value <= max;
}

/**
 * Validate padding/margin object
 *
 * Expected format: { top: number, right: number, bottom: number, left: number }
 *
 * @param {*} value - Value to validate
 * @return {boolean} True if valid padding/margin object
 */
export function isValidSpacing( value ) {
	if ( typeof value !== 'object' || value === null ) {
		return false;
	}

	const requiredKeys = [ 'top', 'right', 'bottom', 'left' ];
	const hasAllKeys = requiredKeys.every( ( key ) => key in value );

	if ( ! hasAllKeys ) {
		return false;
	}

	return requiredKeys.every(
		( key ) => typeof value[ key ] === 'number' && value[ key ] >= 0
	);
}

/**
 * Validate border radius object
 *
 * Expected format: { topLeft: number, topRight: number, bottomLeft: number, bottomRight: number }
 *
 * @param {*} value - Value to validate
 * @return {boolean} True if valid border radius object
 */
export function isValidBorderRadius( value ) {
	if ( typeof value !== 'object' || value === null ) {
		return false;
	}

	const requiredKeys = [ 'topLeft', 'topRight', 'bottomLeft', 'bottomRight' ];
	const hasAllKeys = requiredKeys.every( ( key ) => key in value );

	if ( ! hasAllKeys ) {
		return false;
	}

	return requiredKeys.every(
		( key ) => typeof value[ key ] === 'number' && value[ key ] >= 0
	);
}

/**
 * Validate enum value
 *
 * @param {*}     value         - Value to validate
 * @param {Array} allowedValues - Array of allowed values
 * @return {boolean} True if value is in allowed values
 */
export function isValidEnum( value, allowedValues ) {
	return allowedValues.includes( value );
}

/**
 * Validate font weight
 *
 * Allowed: "normal", "bold", "100" through "900"
 *
 * @param {string} value - Font weight value
 * @return {boolean} True if valid font weight
 */
export function isValidFontWeight( value ) {
	const validWeights = [
		'normal',
		'bold',
		'100',
		'200',
		'300',
		'400',
		'500',
		'600',
		'700',
		'800',
		'900',
	];

	return isValidEnum( value, validWeights );
}

/**
 * Validate heading level
 *
 * Allowed: "none", "h1" through "h6"
 *
 * @param {string} value - Heading level value
 * @return {boolean} True if valid heading level
 */
export function isValidHeadingLevel( value ) {
	const validLevels = [ 'none', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

	return isValidEnum( value, validLevels );
}

/**
 * Validate border style
 *
 * Allowed CSS border styles
 *
 * @param {string} value - Border style value
 * @return {boolean} True if valid border style
 */
export function isValidBorderStyle( value ) {
	const validStyles = [
		'none',
		'solid',
		'dashed',
		'dotted',
		'double',
		'groove',
		'ridge',
		'inset',
		'outset',
		'hidden',
	];

	return isValidEnum( value, validStyles );
}

/**
 * Validate icon type (character, emoji, or URL)
 *
 * @param {string} value - Icon type value
 * @return {boolean} True if valid icon type
 */
export function isValidIconType( value ) {
	if ( typeof value !== 'string' ) {
		return false;
	}

	// Allow "none" for iconTypeOpen
	if ( value === 'none' ) {
		return true;
	}

	// Allow URLs
	if ( value.startsWith( 'http' ) ) {
		try {
			new URL( value );
			return true;
		} catch {
			return false;
		}
	}

	// Allow any string (character/emoji)
	return value.length > 0;
}

/**
 * Sanitize attribute value for safe storage
 *
 * @param {*}      value - Value to sanitize
 * @param {string} type  - Attribute type ('string', 'number', 'boolean', 'object')
 * @return {*} Sanitized value
 */
export function sanitizeAttributeValue( value, type ) {
	switch ( type ) {
		case 'string':
			return typeof value === 'string' ? value.trim() : '';

		case 'number':
			const num = Number( value );
			return isNaN( num ) ? 0 : num;

		case 'boolean':
			return Boolean( value );

		case 'object':
			return typeof value === 'object' && value !== null
				? { ...value }
				: {};

		default:
			return value;
	}
}
