/**
 * Responsive Utilities
 *
 * Utility functions for handling responsive values and CSS generation
 * for the Guttemberg Plus responsive system
 *
 * @package
 * @since 1.0.0
 */

/**
 * Get value for specific device with inheritance
 *
 * Data structure: Base (global) is at value.value, tablet/mobile are device keys
 *
 * @param {*}      value  - The responsive value object or simple value
 * @param {string} device - The device type: 'global', 'tablet', or 'mobile'
 * @return {*} The value for the specified device
 */
export function getResponsiveValue( value, device ) {
	if ( ! value || typeof value !== 'object' ) {
		return value;
	}

	if ( value[ device ] !== undefined ) {
		return value[ device ];
	}

	// Inheritance chain: mobile → tablet → base (value.value, not a device key)
	const baseValue = value.value ?? value;
	if ( device === 'tablet' ) {
		return baseValue;
	}
	if ( device === 'mobile' ) {
		return value.tablet ?? baseValue;
	}

	return baseValue; // global uses base value
}

/**
 * Check if value is inherited (not explicitly set)
 *
 * @param {*}      value  - The responsive value object
 * @param {string} device - The device type to check
 * @return {boolean} True if the value is inherited
 */
export function isInheritedValue( value, device ) {
	if ( ! value || typeof value !== 'object' ) {
		return false;
	}
	return value[ device ] === undefined && device !== 'global';
}

/**
 * Set value for specific device
 *
 * @param {*}      currentValue - The current responsive value object
 * @param {string} device       - The device type to set
 * @param {*}      newValue     - The new value to set
 * @return {Object} Updated responsive value object
 */
export function setResponsiveValue( currentValue, device, newValue ) {
	if ( ! currentValue || typeof currentValue !== 'object' ) {
		// Global sets base value, not under a device key
		return device === 'global'
			? { value: newValue }
			: { value: currentValue, [ device ]: newValue };
	}
	// Global updates value.value, tablet/mobile add device keys
	if ( device === 'global' ) {
		return { ...currentValue, value: newValue };
	}
	return { ...currentValue, [ device ]: newValue };
}

/**
 * Generate CSS media queries from responsive values
 *
 * @param {string} cssVar      - The CSS variable name (without --)
 * @param {*}      value       - The responsive value object or simple value
 * @param {Object} breakpoints - The breakpoint configuration
 * @return {string} CSS string with the variable declaration
 */
export function generateResponsiveCSS( cssVar, value, breakpoints ) {
	if ( ! value || typeof value !== 'object' ) {
		return `--${ cssVar }: ${ value };`;
	}

	let css = '';

	// Base (global) value is at value.value, not a device key
	const baseValue = value.value ?? value;
	if ( baseValue !== undefined && baseValue !== null ) {
		css += `--${ cssVar }: ${ baseValue };\n`;
	}

	// Note: Tablet and mobile media queries are generated separately
	return css;
}

/**
 * Generate media query CSS for a specific breakpoint
 *
 * @param {string} cssVar      - The CSS variable name (without --)
 * @param {*}      value       - The responsive value object
 * @param {string} device      - The device type: 'tablet' or 'mobile'
 * @param {Object} breakpoints - The breakpoint configuration
 * @return {string} Media query CSS string
 */
export function generateMediaQueryCSS( cssVar, value, device, breakpoints ) {
	if ( ! value || typeof value !== 'object' || value[ device ] === undefined ) {
		return '';
	}

	const maxWidth = breakpoints[ device ];
	return `@media (max-width: ${ maxWidth }px) { --${ cssVar }: ${ value[ device ] }; }`;
}

/**
 * Clear device-specific value (reset to inherit)
 *
 * @param {Object} currentValue - The current responsive value object
 * @param {string} device       - The device to clear
 * @return {Object} Updated responsive value object
 */
export function clearResponsiveValue( currentValue, device ) {
	if ( ! currentValue || typeof currentValue !== 'object' ) {
		return currentValue;
	}

	const newValue = { ...currentValue };
	delete newValue[ device ];
	return newValue;
}

/**
 * Check if a value has any responsive overrides
 *
 * @param {*} value - The value to check
 * @return {boolean} True if the value has responsive overrides
 */
export function hasResponsiveOverrides( value ) {
	if ( ! value || typeof value !== 'object' ) {
		return false;
	}
	return value.tablet !== undefined || value.mobile !== undefined;
}

/**
 * Convert simple value to responsive object
 *
 * @param {*} value - Simple value or responsive object
 * @return {Object} Responsive value object with base value at root
 */
export function ensureResponsiveValue( value ) {
	// Check if already responsive (has tablet or mobile keys)
	if (
		value &&
		typeof value === 'object' &&
		( value.tablet !== undefined || value.mobile !== undefined )
	) {
		return value;
	}
	// Wrap simple value - base is at value.value, not a device key
	return { value };
}

/**
 * Generate complete responsive CSS for all devices
 *
 * @param {string} cssVar      - The CSS variable name (without --)
 * @param {*}      value       - The responsive value object or simple value
 * @param {Object} breakpoints - The breakpoint configuration
 * @return {string} Complete CSS with media queries
 */
export function generateCompleteResponsiveCSS( cssVar, value, breakpoints ) {
	let css = generateResponsiveCSS( cssVar, value, breakpoints );

	if ( value && typeof value === 'object' ) {
		const tabletCSS = generateMediaQueryCSS( cssVar, value, 'tablet', breakpoints );
		const mobileCSS = generateMediaQueryCSS( cssVar, value, 'mobile', breakpoints );

		if ( tabletCSS ) {
			css += '\n' + tabletCSS;
		}
		if ( mobileCSS ) {
			css += '\n' + mobileCSS;
		}
	}

	return css;
}
