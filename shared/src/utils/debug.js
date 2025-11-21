/**
 * Debug Logging Utility
 *
 * Provides conditional logging based on environment.
 * In production builds, debug logs are disabled for performance.
 *
 * Set window.GUTTEMBERG_DEBUG_VERBOSE = true to enable all debug logs
 * Set window.GUTTEMBERG_DEBUG_VERBOSE = false to disable debug logs
 * Set window.GUTTEMBERG_DEBUG_TAGS = ['THEME_CREATE', 'BORDER'] to filter logs by tag
 *
 * @package
 * @since 1.0.0
 */

/**
 * Check if we're in development mode
 *
 * @return {boolean} True if in development
 */
const isDevelopment = () => {
	return (
		process.env.NODE_ENV === 'development' ||
		( typeof window !== 'undefined' && window.WP_DEBUG === true )
	);
};

/**
 * Check if verbose debugging is enabled
 * Defaults to false (quiet) unless explicitly set to true
 *
 * @return {boolean} True if verbose debugging should run
 */
const isVerboseDebugEnabled = () => {
	if ( typeof window === 'undefined' ) {
		return false;
	}
	// Explicitly check if GUTTEMBERG_DEBUG_VERBOSE is true
	return window.GUTTEMBERG_DEBUG_VERBOSE === true;
};

/**
 * Debug log function
 * Only logs in development mode AND when GUTTEMBERG_DEBUG_VERBOSE is true
 * This keeps the console clean by default while allowing detailed debugging when needed
 *
 * @param {...any} args - Arguments to log
 */
export function debug( ...args ) {
	if ( isDevelopment() && isVerboseDebugEnabled() ) {
		console.log( ...args );
	}
}

/**
 * Debug error function
 * Only logs in development mode
 *
 * @param {...any} args - Arguments to log
 */
export function debugError( ...args ) {
	if ( isDevelopment() ) {
		console.error( ...args );
	}
}

/**
 * Debug warning function
 * Only logs in development mode
 *
 * @param {...any} args - Arguments to log
 */
export function debugWarn( ...args ) {
	if ( isDevelopment() ) {
		console.warn( ...args );
	}
}

/**
 * Debug table function
 * Only logs in development mode
 *
 * @param {any} data - Data to display in table
 */
export function debugTable( data ) {
	if ( isDevelopment() ) {
		console.table( data );
	}
}

export default debug;
