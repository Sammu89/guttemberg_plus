/**
 * ID Generator Utility
 *
 * Generates unique IDs for blocks and themes.
 * Format: {prefix}-{4 alphanumeric chars}
 * Example: "acc-a7b3", "tabs-k9z2", "toc-1x4y"
 *
 * 4-digit alphanumeric provides 36^4 = 1,679,616 unique combinations.
 *
 * @see docs/01-QUICK-REFERENCE.md
 * @package
 * @since 1.0.0
 */

/**
 * Character set for ID generation
 * 0-9 (10 chars) + a-z (26 chars) = 36 total
 */
const ID_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Set to track generated IDs and prevent duplicates
 * Cleared on page reload (client-side only)
 */
const usedIds = new Set();

/**
 * Generate a unique ID with specified prefix
 *
 * Format: {prefix}-{digit}{letter}{letter}{letter}
 * Example: "acc-0abc"
 *
 * The first character is always a digit (0-9), followed by
 * three lowercase letters (a-z) for better readability.
 *
 * @param {string} prefix - Prefix for the ID (e.g., 'acc', 'tabs', 'toc')
 * @return {string} Unique ID like "acc-0abc"
 *
 * @example
 * generateUniqueId('acc')  // "acc-3xyz"
 * generateUniqueId('tabs') // "tabs-7abc"
 */
export function generateUniqueId( prefix = 'block' ) {
	// Validate prefix
	if ( typeof prefix !== 'string' || prefix.length === 0 ) {
		throw new Error( 'Prefix must be a non-empty string.' );
	}

	let id;
	let attempts = 0;
	const maxAttempts = 1000;

	do {
		// Generate 4 random alphanumeric characters
		let suffix = '';
		for ( let i = 0; i < 4; i++ ) {
			const randomIndex = Math.floor( Math.random() * ID_CHARS.length );
			suffix += ID_CHARS[ randomIndex ];
		}

		id = `${ prefix }-${ suffix }`;
		attempts++;

		// Prevent infinite loop
		if ( attempts >= maxAttempts ) {
			throw new Error( `Failed to generate unique ID after ${ maxAttempts } attempts.` );
		}
	} while ( usedIds.has( id ) );

	// Mark as used
	usedIds.add( id );

	return id;
}

/**
 * Generate a theme ID (4 chars, no prefix)
 *
 * Format: {digit}{letter}{letter}{letter}
 * Example: "3abc", "7xyz"
 *
 * @return {string} Unique theme ID like "3abc"
 *
 * @example
 * generateThemeId() // "9klm"
 */
export function generateThemeId() {
	let id;
	let attempts = 0;
	const maxAttempts = 1000;

	do {
		// Generate 4 random alphanumeric characters
		id = '';
		for ( let i = 0; i < 4; i++ ) {
			const randomIndex = Math.floor( Math.random() * ID_CHARS.length );
			id += ID_CHARS[ randomIndex ];
		}

		attempts++;

		// Prevent infinite loop
		if ( attempts >= maxAttempts ) {
			throw new Error(
				`Failed to generate unique theme ID after ${ maxAttempts } attempts.`
			);
		}
	} while ( usedIds.has( id ) );

	// Mark as used
	usedIds.add( id );

	return id;
}

/**
 * Check if an ID is already used
 *
 * @param {string} id - ID to check
 * @return {boolean} True if ID is already used
 */
export function isIdUsed( id ) {
	return usedIds.has( id );
}

/**
 * Mark an ID as used (for IDs loaded from database)
 *
 * @param {string} id - ID to mark as used
 */
export function markIdAsUsed( id ) {
	usedIds.add( id );
}

/**
 * Clear all used IDs (for testing)
 */
export function clearUsedIds() {
	usedIds.clear();
}

/**
 * Get count of used IDs
 *
 * @return {number} Number of IDs currently tracked
 */
export function getUsedIdCount() {
	return usedIds.size;
}
