/**
 * Debug Logging Utility
 *
 * Provides conditional logging based on environment.
 * In production builds, debug logs are disabled for performance.
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
 * Debug log function
 * Only logs in development mode
 *
 * @param {...any} args - Arguments to log
 */
export function debug( ...args ) {
	if ( isDevelopment() ) {
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
