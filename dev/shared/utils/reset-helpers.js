/**
 * Reset Helpers Utility Module
 *
 * Provides comprehensive reset functionality for block attributes.
 * Handles resetting attribute values, device overrides, responsive state, and linked state.
 */

/**
 * Creates a comprehensive reset function that handles all aspects of attribute reset:
 *
 * 1. Resets attribute value(s) to schema defaults
 * 2. If decomposable: Sets `linked: true`
 * 3. Clears all device overrides (removes `tablet`, `mobile` keys from value object)
 * 4. If canBeResponsive: Sets `responsiveEnabled[attrName]: false`
 *
 * @param {Object}   options                         - Configuration options for the reset function
 * @param {Object}   options.attributes              - The attributes object (to get schema defaults)
 * @param {Function} options.setAttributes           - Function to update attributes
 * @param {string}   [options.attrName]              - Single attribute name to reset
 * @param {string[]} [options.attrNames]             - Array of attribute names to reset (for compound resets like BorderPanel)
 * @param {Object}   [options.responsiveEnabled]     - Current responsive enabled state object
 * @param {Function} [options.setResponsiveEnabled]  - Function to update responsive enabled state
 * @param {boolean}  [options.canBeResponsive=false] - Whether this control supports responsive toggle
 * @param {boolean}  [options.isDecomposable=false]  - Whether this control has a linked state
 *
 * @return {Function} A reset function that can be called as an onReset handler
 *
 * @example
 * // Single decomposable attribute (e.g., SpacingControl)
 * const comprehensiveReset = createComprehensiveReset({
 *   attributes,
 *   setAttributes,
 *   attrName: 'padding',
 *   responsiveEnabled,
 *   setResponsiveEnabled,
 *   canBeResponsive: false,
 *   isDecomposable: true
 * });
 *
 * @example
 * // Multiple attributes (e.g., BorderPanel resets borderWidth, borderColor, borderStyle)
 * const comprehensiveReset = createComprehensiveReset({
 *   attributes,
 *   setAttributes,
 *   attrNames: ['borderWidth', 'borderColor', 'borderStyle'],
 *   responsiveEnabled,
 *   setResponsiveEnabled,
 *   canBeResponsive: false,
 *   isDecomposable: true  // borderWidth is decomposable
 * });
 *
 * @example
 * // Responsive attribute (e.g., fontSize)
 * const comprehensiveReset = createComprehensiveReset({
 *   attributes,
 *   setAttributes,
 *   attrName: 'fontSize',
 *   responsiveEnabled,
 *   setResponsiveEnabled,
 *   canBeResponsive: true,
 *   isDecomposable: false
 * });
 */
export function createComprehensiveReset( options ) {
	const {
		attributes,
		setAttributes,
		attrName,
		attrNames,
		responsiveEnabled,
		setResponsiveEnabled,
		canBeResponsive = false,
		isDecomposable = false,
	} = options;

	// Normalize to array for uniform processing
	const attributeNames = attrNames || ( attrName ? [ attrName ] : [] );

	if ( attributeNames.length === 0 ) {
		console.warn( 'createComprehensiveReset: No attribute names provided' );
		return () => {};
	}

	return () => {
		const updates = {};

		// Process each attribute
		attributeNames.forEach( ( name ) => {
			const defaultValue = attributes[ name ];

			// Handle decomposable values (need to ensure linked: true)
			if ( isDecomposable && typeof defaultValue === 'object' && defaultValue !== null ) {
				// Remove device overrides (tablet, mobile keys)
				const { tablet, mobile, ...baseValue } = defaultValue;

				// Set linked to true for decomposable controls
				updates[ name ] = {
					...baseValue,
					linked: true,
				};
			} else if ( typeof defaultValue === 'object' && defaultValue !== null ) {
				// For non-decomposable objects, just remove device overrides
				const { tablet, mobile, ...baseValue } = defaultValue;
				updates[ name ] = baseValue;
			} else {
				// For primitive values, just use the default
				updates[ name ] = defaultValue;
			}
		} );

		// Apply attribute updates
		setAttributes( updates );

		// Handle responsive state reset
		if ( canBeResponsive && setResponsiveEnabled && responsiveEnabled ) {
			const responsiveUpdates = {};

			attributeNames.forEach( ( name ) => {
				// Disable responsive mode for each attribute
				responsiveUpdates[ name ] = false;
			} );

			setResponsiveEnabled( responsiveUpdates );
		}
	};
}

/**
 * Helper function to check if a value has device overrides
 *
 * @param {*} value - The value to check
 * @return {boolean} True if the value has tablet or mobile keys
 */
export function hasDeviceOverrides( value ) {
	if ( typeof value !== 'object' || value === null ) {
		return false;
	}

	return 'tablet' in value || 'mobile' in value;
}

/**
 * Helper function to remove device overrides from a value
 *
 * @param {*} value - The value to clean
 * @return {*} The value without device overrides
 */
export function removeDeviceOverrides( value ) {
	if ( typeof value !== 'object' || value === null ) {
		return value;
	}

	const { tablet, mobile, ...cleanValue } = value;
	return cleanValue;
}

/**
 * Helper function to check if a value is in linked state
 *
 * @param {*} value - The value to check
 * @return {boolean} True if the value has linked: true
 */
export function isLinked( value ) {
	if ( typeof value !== 'object' || value === null ) {
		return false;
	}

	return value.linked === true;
}

/**
 * Helper function to get the base value (without device overrides)
 *
 * @param {*}      value  - The value to process
 * @param {string} device - Current device ('desktop', 'tablet', 'mobile')
 * @return {*} The appropriate value for the device
 */
export function getDeviceValue( value, device = 'desktop' ) {
	if ( typeof value !== 'object' || value === null ) {
		return value;
	}

	// For desktop, return the base value (without device overrides)
	if ( device === 'desktop' ) {
		return removeDeviceOverrides( value );
	}

	// For tablet/mobile, check if override exists
	if ( device === 'tablet' && 'tablet' in value ) {
		return value.tablet;
	}

	if ( device === 'mobile' ) {
		// Mobile falls back to tablet if no mobile override
		if ( 'mobile' in value ) {
			return value.mobile;
		}
		if ( 'tablet' in value ) {
			return value.tablet;
		}
	}

	// Fallback to base value
	return removeDeviceOverrides( value );
}
