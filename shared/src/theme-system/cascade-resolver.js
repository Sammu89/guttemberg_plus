/**
 * Cascade Resolver - Pure Functions
 *
 * USAGE: Used ONLY in save.js components for 2-tier fallback (attributes → defaults)
 *
 * Edit components use simplified architecture:
 * - effectiveValues = attributes (direct source of truth)
 * - expectedValues = applyDeltas(defaults, theme.values) for comparison
 * - No cascade resolution needed in edit components
 *
 * Save components use this for simple fallback:
 * - getAllEffectiveValues(attributes, {}, defaults)
 * - Empty theme object because themes resolved server-side via CSS classes
 * - Provides 2-tier fallback: attributes → defaults
 *
 * Original 3-tier cascade system:
 * 1. Block Attributes (Highest Priority)
 * 2. Theme Values (Medium Priority - empty in save.js)
 * 3. Defaults (Lowest Priority - Fallback)
 *
 * ARCHITECTURE RULES:
 * - 100% pure functions (no side effects, no state mutations)
 * - NO integration with @wordpress/data (kept separate for performance)
 * - First match wins (no merging between tiers)
 * - Performance target: <5ms for getAllEffectiveValues() with 50 attributes
 * - Works for all types: string, number, boolean, object, array
 *
 * @package
 * @since 1.0.0
 */

/**
 * Check if a value is defined (not null or undefined)
 *
 * @param {*} value - Value to check
 * @return {boolean} True if value is not null or undefined
 */
function isDefined( value ) {
	return value !== null && value !== undefined;
}

/**
 * Get effective value for a single attribute using 3-tier cascade
 *
 * Resolution order:
 * 1. Check block customizations (highest priority)
 * 2. Check theme values (medium priority)
 * 3. Check CSS defaults (lowest priority - fallback)
 *
 * IMPORTANT: First match wins - stops checking as soon as a value is found
 *
 * @param {string} name       - Attribute name (e.g., 'titleColor', 'titleFontSize')
 * @param {Object} attributes - Block-level customizations (from block attributes)
 * @param {Object} theme      - Theme values (from database via store)
 * @param {Object} defaults   - CSS default values (from window.{blockType}Defaults)
 * @return {*|null} The effective value, or null if not found in any tier
 *
 * @example
 * // Block wins (highest priority)
 * getEffectiveValue('titleColor',
 *   { titleColor: '#ff0000' },
 *   { titleColor: '#00ff00' },
 *   { titleColor: '#333333' }
 * ); // Returns: '#ff0000'
 *
 * @example
 * // Theme wins (block is null)
 * getEffectiveValue('titleColor',
 *   { titleColor: null },
 *   { titleColor: '#00ff00' },
 *   { titleColor: '#333333' }
 * ); // Returns: '#00ff00'
 *
 * @example
 * // CSS default wins (block and theme are null/undefined)
 * getEffectiveValue('titleColor',
 *   { titleColor: null },
 *   { titleColor: undefined },
 *   { titleColor: '#333333' }
 * ); // Returns: '#333333'
 *
 * @example
 * // Boolean handling (explicit false is a valid value)
 * getEffectiveValue('showIcon',
 *   { showIcon: false },
 *   { showIcon: true },
 *   { showIcon: true }
 * ); // Returns: false (not true!)
 *
 * @example
 * // Object handling (first complete object wins, no merging)
 * getEffectiveValue('titlePadding',
 *   { titlePadding: { top: 20, right: 20, bottom: 20, left: 20 } },
 *   { titlePadding: { top: 12, right: 12, bottom: 12, left: 12 } },
 *   { titlePadding: { top: 8, right: 8, bottom: 8, left: 8 } }
 * ); // Returns: { top: 20, right: 20, bottom: 20, left: 20 }
 */
export function getEffectiveValue( name, attributes, theme, defaults ) {
	// Tier 3: Block customizations (highest priority)
	if ( attributes && isDefined( attributes[ name ] ) ) {
		return attributes[ name ];
	}

	// Tier 2: Theme values (medium priority)
	if ( theme && isDefined( theme[ name ] ) ) {
		return theme[ name ];
	}

	// Tier 1: CSS defaults (lowest priority - fallback)
	if ( defaults && isDefined( defaults[ name ] ) ) {
		return defaults[ name ];
	}

	// Nothing found in any tier
	return null;
}

/**
 * Get all effective values for all attributes using cascade resolution
 *
 * Resolves the effective value for every attribute found in any of the three tiers.
 * This ensures the UI always has complete data to display.
 *
 * Performance: Must complete in <5ms for 50 attributes
 *
 * @param {Object} attributes - Block-level customizations (from block attributes)
 * @param {Object} theme      - Theme values (from database via store)
 * @param {Object} defaults   - CSS default values (from window.{blockType}Defaults)
 * @return {Object} Object containing all effective values
 *
 * @example
 * // Complete resolution
 * const attributes = { titleColor: '#ff0000', titleFontSize: null };
 * const theme = { titleColor: '#00ff00', titleFontSize: 18, titleBackgroundColor: '#222' };
 * const defaults = { titleColor: '#333333', titleFontSize: 16, titleBackgroundColor: '#f5f5f5' };
 *
 * getAllEffectiveValues(attributes, theme, defaults);
 * // Returns: {
 * //   titleColor: '#ff0000',           // from block
 * //   titleFontSize: 18,               // from theme
 * //   titleBackgroundColor: '#222'     // from theme
 * // }
 *
 * @example
 * // Usage in Edit component
 * const effectiveValues = getAllEffectiveValues(
 *   attributes,
 *   themes[attributes.currentTheme],
 *   window.accordionDefaults
 * );
 *
 * // ALWAYS use effectiveValues in UI, NEVER raw attributes
 * <ColorPicker value={effectiveValues.titleColor} />
 */
export function getAllEffectiveValues( attributes, theme, defaults ) {
	// Performance optimization: Use Set to get unique attribute names
	// This is faster than multiple array operations for 50+ attributes
	const allNames = new Set();

	// Collect all attribute names from all three tiers
	if ( attributes && typeof attributes === 'object' ) {
		Object.keys( attributes ).forEach( ( name ) => allNames.add( name ) );
	}

	if ( theme && typeof theme === 'object' ) {
		Object.keys( theme ).forEach( ( name ) => allNames.add( name ) );
	}

	if ( defaults && typeof defaults === 'object' ) {
		Object.keys( defaults ).forEach( ( name ) => allNames.add( name ) );
	}

	// Resolve effective value for each attribute
	const effectiveValues = {};
	for ( const name of allNames ) {
		effectiveValues[ name ] = getEffectiveValue( name, attributes, theme, defaults );
	}

	return effectiveValues;
}

/**
 * Check if an attribute is customized at the block level
 *
 * Used to show customization badges in the UI and determine if
 * customizations should be cleared on theme update.
 *
 * @param {string} name       - Attribute name
 * @param {Object} attributes - Block-level customizations
 * @param {Object} theme      - Theme values (optional)
 * @return {boolean} True if attribute has a customized (non-null) value
 *
 * @example
 * // Check if title color is customized
 * isCustomized('titleColor', { titleColor: '#ff0000' }); // true
 * isCustomized('titleColor', { titleColor: null });      // false
 * isCustomized('titleColor', {});                        // false
 *
 * @example
 * // Usage in UI to show customization badge
 * const showBadge = isCustomized('titleColor', attributes);
 * {showBadge && <span className="customization-badge">Custom</span>}
 */
export function isCustomized( name, attributes, theme ) {
	return attributes && isDefined( attributes[ name ] );
}

/**
 * Check if an attribute value differs from both theme and defaults
 *
 * This is the CORRECT way to determine if a block has actual customizations
 * that differ from the default cascade resolution.
 *
 * CRITICAL: A value is only "customized" if it differs from what the cascade
 * would naturally resolve (either theme value OR defaults - CSS or behavioral).
 *
 * NOTE: defaults parameter should include BOTH CSS defaults AND behavioral defaults
 * (from attribute schemas). Use getAllDefaults() to merge them.
 *
 * @param {string} name       - Attribute name
 * @param {Object} attributes - Block-level customizations
 * @param {Object} theme      - Theme values (can be null/undefined if no theme)
 * @param {Object} defaults   - Combined CSS + behavioral default values
 * @return {boolean} True if attribute is explicitly customized and differs from cascade
 *
 * @example
 * // Value matches default - NOT customized
 * isCustomizedFromDefaults('showIcon',
 *   { showIcon: true },
 *   {},
 *   { showIcon: true }
 * ); // Returns: false
 *
 * @example
 * // Value matches theme - NOT customized
 * isCustomizedFromDefaults('showIcon',
 *   { showIcon: false },
 *   { showIcon: false },
 *   { showIcon: true }
 * ); // Returns: false
 *
 * @example
 * // Value differs from both - IS customized
 * isCustomizedFromDefaults('iconPosition',
 *   { iconPosition: 'left' },
 *   { iconPosition: 'right' },
 *   { iconPosition: 'right' }
 * ); // Returns: true
 */
export function isCustomizedFromDefaults( name, attributes, theme, defaults ) {
	// If attribute is not set at block level, it's not customized
	if ( ! attributes || ! isDefined( attributes[ name ] ) ) {
		return false;
	}

	const blockValue = attributes[ name ];

	// If there's a theme, compare against theme value
	if ( theme && isDefined( theme[ name ] ) ) {
		// Deep equality check for objects
		if ( typeof blockValue === 'object' && blockValue !== null ) {
			return JSON.stringify( blockValue ) !== JSON.stringify( theme[ name ] );
		}
		return blockValue !== theme[ name ];
	}

	// No theme, so compare against combined defaults (CSS + behavioral)
	if ( defaults && isDefined( defaults[ name ] ) ) {
		// Deep equality check for objects
		if ( typeof blockValue === 'object' && blockValue !== null ) {
			return JSON.stringify( blockValue ) !== JSON.stringify( defaults[ name ] );
		}
		return blockValue !== defaults[ name ];
	}

	// Value exists but no theme or default to compare against
	// This is unusual but technically means it IS a customization
	return true;
}

/**
 * Check if block has ANY customizations that differ from cascade defaults
 *
 * This replaces the old isCustomized logic that only checked if attributes were set.
 * Now we properly compare against both theme and CSS defaults.
 *
 * @param {Object} attributes        - Block-level customizations
 * @param {Object} theme             - Theme values (can be null/undefined)
 * @param {Object} defaults          - CSS default values
 * @param {Array}  excludeAttributes - Array of attribute names to exclude from check
 * @return {boolean} True if block has any actual customizations
 *
 * @example
 * // Block has customizations that differ from defaults
 * hasAnyCustomizations(
 *   { titleColor: '#ff0000', titleFontSize: null },
 *   { titleColor: '#ffffff' },
 *   { titleColor: '#333333', titleFontSize: 16 },
 *   ['currentTheme', 'accordionId']
 * ); // Returns: true (titleColor differs from both theme and CSS)
 *
 * @example
 * // Block values match cascade - no customizations
 * hasAnyCustomizations(
 *   { titleColor: '#ffffff' },
 *   { titleColor: '#ffffff' },
 *   { titleColor: '#333333' },
 *   ['currentTheme']
 * ); // Returns: false (titleColor matches theme)
 */
export function hasAnyCustomizations( attributes, theme, defaults, excludeAttributes = [] ) {
	if ( ! attributes || typeof attributes !== 'object' ) {
		return false;
	}

	// Check each attribute
	for ( const key of Object.keys( attributes ) ) {
		// Skip excluded attributes
		if ( excludeAttributes.includes( key ) ) {
			continue;
		}

		// Check if this attribute is customized
		if ( isCustomizedFromDefaults( key, attributes, theme, defaults ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Get which tier provided the effective value
 *
 * Useful for debugging and showing users where a value comes from.
 *
 * @param {string} name       - Attribute name
 * @param {Object} attributes - Block-level customizations
 * @param {Object} theme      - Theme values
 * @param {Object} defaults   - CSS default values
 * @return {'block'|'theme'|'css'|null} The tier that provided the value, or null if not found
 *
 * @example
 * getValueSource('titleColor',
 *   { titleColor: '#ff0000' },
 *   { titleColor: '#00ff00' },
 *   { titleColor: '#333333' }
 * ); // Returns: 'block'
 *
 * @example
 * getValueSource('titleFontSize',
 *   { titleFontSize: null },
 *   { titleFontSize: 18 },
 *   { titleFontSize: 16 }
 * ); // Returns: 'theme'
 *
 * @example
 * // Usage in debug panel
 * const source = getValueSource('titleColor', attributes, theme, defaults);
 * console.log(`Title color from: ${source}`); // "Title color from: block"
 */
export function getValueSource( name, attributes, theme, defaults ) {
	// Check in cascade order
	if ( attributes && isDefined( attributes[ name ] ) ) {
		return 'block';
	}

	if ( theme && isDefined( theme[ name ] ) ) {
		return 'theme';
	}

	if ( defaults && isDefined( defaults[ name ] ) ) {
		return 'css';
	}

	return null;
}
