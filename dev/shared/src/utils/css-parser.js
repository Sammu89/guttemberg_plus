/**
 * CSS Parser Utilities
 *
 * JavaScript utilities for accessing CSS default values
 * Values are provided by PHP via wp_localize_script as window.{blockType}Defaults
 *
 * @package
 * @since 1.0.0
 */

/**
 * Get a specific CSS default value for a block type
 *
 * @param {string} blockType - Block type (accordion, tabs, or toc)
 * @param {string} attribute - Attribute name (without 'default' prefix, e.g., 'titleColor')
 * @return {*|null} The default value, or null if not found
 *
 * @example
 * const titleColor = getCSSDefault('accordion', 'titleColor');
 * // Returns: '#333333' (from accordion.css :root variables)
 */
export function getCSSDefault( blockType, attribute ) {
	// Validate block type
	const allowedTypes = [ 'accordion', 'tabs', 'toc' ];
	if ( ! allowedTypes.includes( blockType ) ) {
		return null;
	}

	// Get defaults object from window
	const defaultsObjectName = `${ blockType }Defaults`;
	const defaults = window[ defaultsObjectName ];

	// Check if defaults are available
	if ( ! defaults || typeof defaults !== 'object' ) {
		return null;
	}

	// Get the specific attribute
	if ( attribute in defaults ) {
		return defaults[ attribute ];
	}

	// Attribute not found
	return null;
}

/**
 * Get all CSS defaults for a block type
 *
 * @param {string} blockType - Block type (accordion, tabs, or toc)
 * @return {Object} Object containing all CSS default values, or empty object if not found
 *
 * @example
 * const defaults = getAllCSSDefaults('accordion');
 * // Returns: { titleColor: '#333333', titleFontSize: '18', ... }
 */
export function getAllCSSDefaults( blockType ) {
	// Validate block type
	const allowedTypes = [ 'accordion', 'tabs', 'toc' ];
	if ( ! allowedTypes.includes( blockType ) ) {
		return {};
	}

	// Get defaults object from window
	const defaultsObjectName = `${ blockType }Defaults`;
	const defaults = window[ defaultsObjectName ];

	// Check if defaults are available
	if ( ! defaults || typeof defaults !== 'object' ) {
		return {};
	}

	// Return a copy to prevent external modifications
	return { ...defaults };
}

/**
 * Check if CSS defaults are loaded for a block type
 *
 * @param {string} blockType - Block type (accordion, tabs, or toc)
 * @return {boolean} True if defaults are loaded, false otherwise
 *
 * @example
 * if (areCSSDefaultsLoaded('accordion')) {
 *   const defaults = getAllCSSDefaults('accordion');
 * }
 */
export function areCSSDefaultsLoaded( blockType ) {
	const allowedTypes = [ 'accordion', 'tabs', 'toc' ];
	if ( ! allowedTypes.includes( blockType ) ) {
		return false;
	}

	const defaultsObjectName = `${ blockType }Defaults`;
	const defaults = window[ defaultsObjectName ];

	return defaults && typeof defaults === 'object';
}

/**
 * Get CSS defaults with fallback values
 *
 * Useful when you need to ensure a value is always returned
 *
 * @param {string} blockType - Block type (accordion, tabs, or toc)
 * @param {string} attribute - Attribute name
 * @param {*}      fallback  - Fallback value if default not found
 * @return {*} The CSS default value, or fallback if not found
 *
 * @example
 * const titleColor = getCSSDefaultWithFallback('accordion', 'titleColor', '#000000');
 * // Returns CSS default if available, otherwise '#000000'
 */
export function getCSSDefaultWithFallback( blockType, attribute, fallback ) {
	const value = getCSSDefault( blockType, attribute );
	return value !== null ? value : fallback;
}

/**
 * Get multiple CSS defaults at once
 *
 * @param {string}   blockType  - Block type (accordion, tabs, or toc)
 * @param {string[]} attributes - Array of attribute names
 * @return {Object} Object with requested attributes and their values
 *
 * @example
 * const values = getMultipleCSSDefaults('accordion', ['titleColor', 'titleFontSize']);
 * // Returns: { titleColor: '#333333', titleFontSize: '18' }
 */
export function getMultipleCSSDefaults( blockType, attributes ) {
	if ( ! Array.isArray( attributes ) ) {
		return {};
	}

	const result = {};
	const allDefaults = getAllCSSDefaults( blockType );

	for ( const attribute of attributes ) {
		if ( attribute in allDefaults ) {
			result[ attribute ] = allDefaults[ attribute ];
		} else {
			result[ attribute ] = null;
		}
	}

	return result;
}
