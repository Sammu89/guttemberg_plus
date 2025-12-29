/**
 * Debug Logging Utility
 *
 * Simple logging helpers.
 * Logs are enabled by default so new console output appears without extra flags.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Debug log function
 *
 * @param {...any} args - Arguments to log
 */
export function debug( ...args ) {
	console.log( ...args );
}

/**
 * Debug error function
 *
 * @param {...any} args - Arguments to log
 */
export function debugError( ...args ) {
	console.error( ...args );
}

/**
 * Debug warning function
 *
 * @param {...any} args - Arguments to log
 */
export function debugWarn( ...args ) {
	console.warn( ...args );
}

/**
 * Debug table function
 *
 * @param {any} data - Data to display in table
 */
export function debugTable( data ) {
	console.table( data );
}

export default debug;
