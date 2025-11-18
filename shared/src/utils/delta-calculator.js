/**
 * Delta Calculator Utility
 *
 * Calculates deltas (differences) between current state and defaults.
 * Used for optimized theme storage - saves only what changed.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Calculate deltas between snapshot and defaults
 *
 * Compares each attribute in snapshot to defaults and returns only
 * those that differ. This creates optimized theme storage.
 *
 * @param {Object} snapshot - Complete attribute snapshot (from customizationCache)
 * @param {Object} defaults - Combined defaults (CSS + behavioral)
 * @param {Array}  exclude  - Attribute names to exclude from comparison
 * @return {Object} Object containing only attributes that differ from defaults
 *
 * @example
 * const snapshot = { titleColor: '#ff0000', titleFontSize: 16, showIcon: true };
 * const defaults = { titleColor: '#333333', titleFontSize: 16, showIcon: true };
 * calculateDeltas(snapshot, defaults, ['showIcon']);
 * // Returns: { titleColor: '#ff0000' }
 * // titleFontSize matches default (excluded)
 * // showIcon in exclude list (excluded)
 */
export function calculateDeltas( snapshot, defaults, exclude = [] ) {
	const deltas = {};

	// Iterate through all attributes in snapshot
	for ( const [ key, value ] of Object.entries( snapshot ) ) {
		// Skip excluded attributes
		if ( exclude.includes( key ) ) {
			continue;
		}

		// Skip if value is undefined or null (not set)
		if ( value === undefined || value === null ) {
			continue;
		}

		const defaultValue = defaults[ key ];

		// Compare values (deep comparison for objects)
		let isDifferent = false;

		if ( typeof value === 'object' && value !== null && ! Array.isArray( value ) ) {
			// Deep comparison for objects
			isDifferent = JSON.stringify( value ) !== JSON.stringify( defaultValue );
		} else {
			// Simple comparison for primitives and arrays
			isDifferent = value !== defaultValue;
		}

		// Only include if different from default
		if ( isDifferent ) {
			deltas[ key ] = value;
		}
	}

	return deltas;
}

/**
 * Apply deltas on top of base values
 *
 * Used when loading a theme - starts with defaults, applies theme deltas.
 *
 * @param {Object} base   - Base values (defaults)
 * @param {Object} deltas - Delta values to apply
 * @return {Object} Merged object
 *
 * @example
 * const defaults = { titleColor: '#333', titleFontSize: 16, showIcon: true };
 * const themeDeltas = { titleColor: '#ff0000' };
 * applyDeltas(defaults, themeDeltas);
 * // Returns: { titleColor: '#ff0000', titleFontSize: 16, showIcon: true }
 */
export function applyDeltas( base, deltas ) {
	return {
		...base,
		...deltas,
	};
}

/**
 * Get complete snapshot of all themeable attributes
 *
 * Extracts all attributes except those in exclude list.
 * Used to capture full state before theme switching.
 *
 * @param {Object} attributes - Block attributes
 * @param {Array}  exclude    - Attributes to exclude (IDs, meta, etc.)
 * @return {Object} Snapshot of themeable attributes
 */
export function getThemeableSnapshot( attributes, exclude = [] ) {
	const snapshot = {};

	for ( const [ key, value ] of Object.entries( attributes ) ) {
		if ( ! exclude.includes( key ) && value !== undefined ) {
			snapshot[ key ] = value;
		}
	}

	return snapshot;
}

export default {
	calculateDeltas,
	applyDeltas,
	getThemeableSnapshot,
};
