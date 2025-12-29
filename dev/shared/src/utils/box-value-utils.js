/**
 * Universal utility for handling 4-side box values (top/right/bottom/left)
 * for CSS properties like border-color, border-style, padding, margin.
 *
 * Supports:
 * - Numeric values with unit (e.g., { top: 1, right: 1, bottom: 1, left: 1, unit: "px" })
 * - String values (e.g., { top: "#fff", right: "#fff", bottom: "#fff", left: "#fff" })
 * - Responsive wrappers (e.g., { value: {...}, tablet: {...}, mobile: {...} })
 * - Linked/unlinked states
 */

/**
 * @typedef {Object} BoxValue
 * @property {string|number} top - Top side value
 * @property {string|number} right - Right side value
 * @property {string|number} bottom - Bottom side value
 * @property {string|number} left - Left side value
 * @property {boolean} [linked] - Whether all sides are linked
 * @property {string} [unit] - CSS unit for numeric values (e.g., "px", "em", "%")
 */

/**
 * @typedef {Object} ResponsiveBoxValue
 * @property {BoxValue|string} [value] - Base/global value (applies to all breakpoints unless overridden)
 * @property {BoxValue|string} [tablet] - Tablet breakpoint value
 * @property {BoxValue|string} [mobile] - Mobile breakpoint value
 */

/**
 * Checks if a value is a responsive wrapper object
 * @param {*} value - Value to check
 * @returns {boolean} True if value has responsive breakpoints
 */
export function isResponsiveValue(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	// Responsive values have tablet or mobile keys (global/base is at value.value, not a device key)
	return 'tablet' in value || 'mobile' in value;
}

/**
 * Checks if a value is a box value object (has top/right/bottom/left)
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a box value object
 */
export function isBoxValueObject(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	return 'top' in value || 'right' in value || 'bottom' in value || 'left' in value;
}

/**
 * Normalizes any value to the standard 4-side object format.
 *
 * @param {string|number|BoxValue|ResponsiveBoxValue|null|undefined} value - The value to normalize
 * @param {string|number} [defaultValue=''] - Default value to use for sides if value is null/undefined
 * @returns {BoxValue} Normalized box value object with top, right, bottom, left, and linked properties
 *
 * @example
 * // String value - same for all sides
 * normalizeBoxValue('#ffffff')
 * // Returns: { top: '#ffffff', right: '#ffffff', bottom: '#ffffff', left: '#ffffff', linked: true }
 *
 * @example
 * // Number value with unit
 * normalizeBoxValue(10, 0)
 * // Returns: { top: 10, right: 10, bottom: 10, left: 10, linked: true }
 *
 * @example
 * // Object with sides - returned as-is with linked calculated
 * normalizeBoxValue({ top: '#fff', right: '#000', bottom: '#fff', left: '#000' })
 * // Returns: { top: '#fff', right: '#000', bottom: '#fff', left: '#000', linked: false }
 */
export function normalizeBoxValue(value, defaultValue = '') {
	// Handle null/undefined - use default value for all sides
	if (value === null || value === undefined) {
		return {
			top: defaultValue,
			right: defaultValue,
			bottom: defaultValue,
			left: defaultValue,
			linked: true,
		};
	}

	// Handle responsive wrapper - normalize the base value (global is at value.value, not a device key)
	if (isResponsiveValue(value)) {
		const baseValue = value.value ?? value;
		return normalizeBoxValue(baseValue, defaultValue);
	}

	// Handle string or number - same value for all sides
	if (typeof value === 'string' || typeof value === 'number') {
		return {
			top: value,
			right: value,
			bottom: value,
			left: value,
			linked: true,
		};
	}

	// Handle object with sides
	if (isBoxValueObject(value)) {
		const normalized = {
			top: value.top ?? defaultValue,
			right: value.right ?? defaultValue,
			bottom: value.bottom ?? defaultValue,
			left: value.left ?? defaultValue,
			linked: value.linked ?? isBoxValueLinked(value),
		};

		// Preserve unit if present
		if (value.unit) {
			normalized.unit = value.unit;
		}

		return normalized;
	}

	// Fallback - treat as default
	return {
		top: defaultValue,
		right: defaultValue,
		bottom: defaultValue,
		left: defaultValue,
		linked: true,
	};
}

const UNIT_REGEX = /^-?\d+(?:\.\d+)?\s*([a-zA-Z%]+)$/;

function getUnitFromString(value) {
	if (typeof value !== 'string') {
		return '';
	}
	const match = value.trim().match(UNIT_REGEX);
	return match ? match[1] : '';
}

/**
 * Infer a unit from a box/corner value object.
 * Falls back to the provided unit when no explicit unit is found.
 *
 * @param {Object} value - Box value object or responsive wrapper
 * @param {string} [fallbackUnit=''] - Unit to use when none found
 * @returns {string} Inferred unit or fallback
 */
export function inferBoxUnit(value, fallbackUnit = '') {
	if (!value || typeof value !== 'object') {
		return fallbackUnit;
	}

	if (value.unit) {
		return value.unit;
	}

	if (value.value && typeof value.value === 'object') {
		return inferBoxUnit(value.value, fallbackUnit);
	}

	const candidates = [
		value.top,
		value.right,
		value.bottom,
		value.left,
		value.topLeft,
		value.topRight,
		value.bottomRight,
		value.bottomLeft,
	];

	for (const candidate of candidates) {
		if (!candidate) {
			continue;
		}
		if (typeof candidate === 'string') {
			const unit = getUnitFromString(candidate);
			if (unit) {
				return unit;
			}
			continue;
		}
		if (typeof candidate === 'object') {
			if (candidate.unit) {
				return candidate.unit;
			}
			if (typeof candidate.value === 'string') {
				const unit = getUnitFromString(candidate.value);
				if (unit) {
					return unit;
				}
			}
		}
	}

	return fallbackUnit;
}

/**
 * Converts a 4-side box value object to CSS shorthand string.
 *
 * Uses CSS shorthand rules:
 * - All same → "value" (e.g., "1px", "#fff", "solid")
 * - top/bottom same AND left/right same → "topBottom leftRight"
 * - left equals right → "top leftRight bottom"
 * - All different → "top right bottom left"
 *
 * @param {BoxValue|string|number|null|undefined} value - The box value to format
 * @param {string} [unit=''] - CSS unit to append to numeric values (e.g., "px", "em")
 * @returns {string} CSS shorthand string
 *
 * @example
 * // All same values
 * formatBoxValueToCss({ top: 10, right: 10, bottom: 10, left: 10 }, 'px')
 * // Returns: "10px"
 *
 * @example
 * // Vertical/horizontal pairs
 * formatBoxValueToCss({ top: 10, right: 20, bottom: 10, left: 20 }, 'px')
 * // Returns: "10px 20px"
 *
 * @example
 * // Left equals right
 * formatBoxValueToCss({ top: 10, right: 20, bottom: 30, left: 20 }, 'px')
 * // Returns: "10px 20px 30px"
 *
 * @example
 * // All different
 * formatBoxValueToCss({ top: 10, right: 20, bottom: 30, left: 40 }, 'px')
 * // Returns: "10px 20px 30px 40px"
 *
 * @example
 * // String values (colors, styles)
 * formatBoxValueToCss({ top: '#fff', right: '#000', bottom: '#fff', left: '#000' })
 * // Returns: "#fff #000"
 */
export function formatBoxValueToCss(value, unit = '') {
	// Handle null/undefined
	if (value === null || value === undefined) {
		return '';
	}

	// Handle string/number - return directly with unit
	if (typeof value === 'string') {
		return value;
	}
	if (typeof value === 'number') {
		return `${value}${unit}`;
	}

	// Handle responsive wrapper
	if (isResponsiveValue(value)) {
		const baseValue = value.value ?? value;
		return formatBoxValueToCss(baseValue, unit);
	}

	// Handle box value object
	if (!isBoxValueObject(value)) {
		return '';
	}

	// Use unit from value object if present, otherwise use parameter
	const effectiveUnit = value.unit || unit;

	// Helper to format a single value with unit
	const formatValue = (val) => {
		if (val === null || val === undefined || val === '') {
			return '';
		}
		if (typeof val === 'number') {
			return `${val}${effectiveUnit}`;
		}
		return String(val);
	};

	const top = formatValue(value.top);
	const right = formatValue(value.right);
	const bottom = formatValue(value.bottom);
	const left = formatValue(value.left);

	// All same → single value
	if (top === right && right === bottom && bottom === left) {
		return top;
	}

	// top/bottom same AND left/right same → two values
	if (top === bottom && left === right) {
		return `${top} ${right}`;
	}

	// left equals right → three values
	if (left === right) {
		return `${top} ${right} ${bottom}`;
	}

	// All different → four values
	return `${top} ${right} ${bottom} ${left}`;
}

/**
 * Checks if all 4 sides of a box value have the same value.
 *
 * @param {BoxValue|string|number|null|undefined} value - The box value to check
 * @returns {boolean} True if all 4 sides have the same value
 *
 * @example
 * isBoxValueLinked({ top: '#fff', right: '#fff', bottom: '#fff', left: '#fff' })
 * // Returns: true
 *
 * @example
 * isBoxValueLinked({ top: '#fff', right: '#000', bottom: '#fff', left: '#000' })
 * // Returns: false
 *
 * @example
 * isBoxValueLinked('solid')
 * // Returns: true (string values are inherently linked)
 */
export function isBoxValueLinked(value) {
	// Handle null/undefined
	if (value === null || value === undefined) {
		return true;
	}

	// Handle string/number - inherently linked
	if (typeof value === 'string' || typeof value === 'number') {
		return true;
	}

	// Handle responsive wrapper
	if (isResponsiveValue(value)) {
		const baseValue = value.value ?? value;
		return isBoxValueLinked(baseValue);
	}

	// Handle box value object
	if (!isBoxValueObject(value)) {
		return true;
	}

	// If linked property is explicitly set, respect it
	if (typeof value.linked === 'boolean') {
		return value.linked;
	}

	// Check if all sides are equal
	const { top, right, bottom, left } = value;
	return top === right && right === bottom && bottom === left;
}

/**
 * Gets the value for a specific side, handling both linked and unlinked structures.
 *
 * @param {BoxValue|string|number|null|undefined} value - The box value
 * @param {'top'|'right'|'bottom'|'left'} side - The side to get
 * @param {string|number} [defaultValue=''] - Default value if side is not found
 * @returns {string|number} The value for the specified side
 *
 * @example
 * getSideValue({ top: '#fff', right: '#000', bottom: '#ccc', left: '#333' }, 'right')
 * // Returns: '#000'
 *
 * @example
 * getSideValue('solid', 'bottom')
 * // Returns: 'solid'
 *
 * @example
 * getSideValue(null, 'top', '#ffffff')
 * // Returns: '#ffffff'
 */
export function getSideValue(value, side, defaultValue = '') {
	// Handle null/undefined
	if (value === null || value === undefined) {
		return defaultValue;
	}

	// Handle string/number - same value for all sides
	if (typeof value === 'string' || typeof value === 'number') {
		return value;
	}

	// Handle responsive wrapper
	if (isResponsiveValue(value)) {
		const baseValue = value.value ?? value;
		return getSideValue(baseValue, side, defaultValue);
	}

	// Handle box value object
	if (isBoxValueObject(value)) {
		return value[side] ?? defaultValue;
	}

	return defaultValue;
}

/**
 * Returns a new box value object with an updated side value.
 * Handles linked state - if linked is true, updates all sides.
 *
 * @param {BoxValue|string|number|null|undefined} value - The current box value
 * @param {'top'|'right'|'bottom'|'left'} side - The side to update
 * @param {string|number} newSideValue - The new value for the side
 * @param {boolean} [linked] - Whether to update all sides (if undefined, uses current linked state)
 * @returns {BoxValue} New box value object with the updated side
 *
 * @example
 * // Update single side (unlinked)
 * updateBoxSide({ top: '#fff', right: '#fff', bottom: '#fff', left: '#fff', linked: false }, 'right', '#000')
 * // Returns: { top: '#fff', right: '#000', bottom: '#fff', left: '#fff', linked: false }
 *
 * @example
 * // Update all sides (linked)
 * updateBoxSide({ top: '#fff', right: '#fff', bottom: '#fff', left: '#fff', linked: true }, 'right', '#000')
 * // Returns: { top: '#000', right: '#000', bottom: '#000', left: '#000', linked: true }
 *
 * @example
 * // Force linked update
 * updateBoxSide({ top: '#fff', right: '#fff', bottom: '#fff', left: '#fff' }, 'top', '#000', true)
 * // Returns: { top: '#000', right: '#000', bottom: '#000', left: '#000', linked: true }
 */
export function updateBoxSide(value, side, newSideValue, linked) {
	// Normalize the current value first
	const normalized = normalizeBoxValue(value);

	// Determine linked state
	const isLinked = linked !== undefined ? linked : normalized.linked;

	if (isLinked) {
		// Update all sides with the new value
		const result = {
			top: newSideValue,
			right: newSideValue,
			bottom: newSideValue,
			left: newSideValue,
			linked: true,
		};

		// Preserve unit if present
		if (normalized.unit) {
			result.unit = normalized.unit;
		}

		return result;
	}

	// Update only the specified side
	const result = {
		...normalized,
		[side]: newSideValue,
		linked: false,
	};

	return result;
}

/**
 * Toggles the linked state of a box value.
 * When linking, uses the value from the first side (top) for all sides.
 *
 * @param {BoxValue|string|number|null|undefined} value - The current box value
 * @param {boolean} [linked] - New linked state (if undefined, toggles current state)
 * @returns {BoxValue} New box value object with updated linked state
 *
 * @example
 * // Toggle from unlinked to linked (uses top value)
 * toggleBoxLinked({ top: '#fff', right: '#000', bottom: '#ccc', left: '#333', linked: false })
 * // Returns: { top: '#fff', right: '#fff', bottom: '#fff', left: '#fff', linked: true }
 *
 * @example
 * // Toggle from linked to unlinked
 * toggleBoxLinked({ top: '#fff', right: '#fff', bottom: '#fff', left: '#fff', linked: true })
 * // Returns: { top: '#fff', right: '#fff', bottom: '#fff', left: '#fff', linked: false }
 */
export function toggleBoxLinked(value, linked) {
	const normalized = normalizeBoxValue(value);
	const newLinked = linked !== undefined ? linked : !normalized.linked;

	if (newLinked && !normalized.linked) {
		// Switching to linked - use top value for all sides
		const result = {
			top: normalized.top,
			right: normalized.top,
			bottom: normalized.top,
			left: normalized.top,
			linked: true,
		};

		if (normalized.unit) {
			result.unit = normalized.unit;
		}

		return result;
	}

	// Just update the linked state
	return {
		...normalized,
		linked: newLinked,
	};
}

/**
 * Creates a box value from a CSS shorthand string.
 * Parses CSS shorthand notation and returns a box value object.
 *
 * @param {string} cssValue - CSS shorthand string (e.g., "10px", "10px 20px", "10px 20px 30px", "10px 20px 30px 40px")
 * @param {string} [unit=''] - Default unit if values don't have units
 * @returns {BoxValue} Box value object
 *
 * @example
 * parseBoxValueFromCss('10px')
 * // Returns: { top: '10px', right: '10px', bottom: '10px', left: '10px', linked: true }
 *
 * @example
 * parseBoxValueFromCss('10px 20px')
 * // Returns: { top: '10px', right: '20px', bottom: '10px', left: '20px', linked: false }
 *
 * @example
 * parseBoxValueFromCss('#fff #000')
 * // Returns: { top: '#fff', right: '#000', bottom: '#fff', left: '#000', linked: false }
 */
export function parseBoxValueFromCss(cssValue, unit = '') {
	if (!cssValue || typeof cssValue !== 'string') {
		return normalizeBoxValue(null);
	}

	const parts = cssValue.trim().split(/\s+/);

	switch (parts.length) {
		case 1:
			// All sides same
			return {
				top: parts[0],
				right: parts[0],
				bottom: parts[0],
				left: parts[0],
				linked: true,
			};
		case 2:
			// vertical | horizontal
			return {
				top: parts[0],
				right: parts[1],
				bottom: parts[0],
				left: parts[1],
				linked: false,
			};
		case 3:
			// top | horizontal | bottom
			return {
				top: parts[0],
				right: parts[1],
				bottom: parts[2],
				left: parts[1],
				linked: false,
			};
		case 4:
			// top | right | bottom | left
			return {
				top: parts[0],
				right: parts[1],
				bottom: parts[2],
				left: parts[3],
				linked: false,
			};
		default:
			return normalizeBoxValue(null);
	}
}

/**
 * Applies a responsive wrapper to a box value for a specific breakpoint.
 *
 * @param {ResponsiveBoxValue|BoxValue|null} currentValue - Current responsive or non-responsive value
 * @param {'global'|'tablet'|'mobile'} breakpoint - The breakpoint to update
 * @param {BoxValue} newValue - The new box value for the breakpoint
 * @returns {ResponsiveBoxValue} Updated responsive value object
 *
 * @example
 * setResponsiveBoxValue(null, 'global', { top: 10, right: 10, bottom: 10, left: 10, linked: true })
 * // Returns: { value: { top: 10, right: 10, bottom: 10, left: 10, linked: true } }
 */
export function setResponsiveBoxValue(currentValue, breakpoint, newValue) {
	if (isResponsiveValue(currentValue)) {
		// Global updates value.value, tablet/mobile add device keys
		if (breakpoint === 'global') {
			return {
				...currentValue,
				value: newValue,
			};
		}
		return {
			...currentValue,
			[breakpoint]: newValue,
		};
	}

	// Convert non-responsive to responsive
	if (breakpoint === 'global') {
		// Global sets base value
		return {
			value: newValue,
		};
	}
	// Tablet/mobile creates responsive with base + device key
	return {
		value: normalizeBoxValue(currentValue),
		[breakpoint]: newValue,
	};
}

/**
 * Gets the box value for a specific breakpoint from a responsive value.
 * Falls back to global/base, then to default if breakpoint not found.
 *
 * @param {ResponsiveBoxValue|BoxValue|string|number|null} value - The responsive or non-responsive value
 * @param {'global'|'tablet'|'mobile'} breakpoint - The breakpoint to get
 * @param {string|number} [defaultValue=''] - Default value if not found
 * @returns {BoxValue} The box value for the breakpoint
 *
 * @example
 * getResponsiveBoxValue({ value: {...}, tablet: {...} }, 'tablet')
 * // Returns: tablet box value
 *
 * @example
 * getResponsiveBoxValue({ value: {...} }, 'mobile')
 * // Returns: global/base box value (fallback)
 */
export function getResponsiveBoxValue(value, breakpoint, defaultValue = '') {
	if (!isResponsiveValue(value)) {
		return normalizeBoxValue(value, defaultValue);
	}

	// Global uses base value (value.value), tablet/mobile use their keys
	if (breakpoint === 'global') {
		const baseValue = value.value ?? value;
		return normalizeBoxValue(baseValue, defaultValue);
	}

	// Try the requested breakpoint first
	if (value[breakpoint] !== undefined) {
		return normalizeBoxValue(value[breakpoint], defaultValue);
	}

	// Fall back to base value
	const baseValue = value.value ?? value;
	if (baseValue !== undefined) {
		return normalizeBoxValue(baseValue, defaultValue);
	}

	return normalizeBoxValue(null, defaultValue);
}

/**
 * Compares two box values for equality.
 *
 * @param {BoxValue|string|number|null} value1 - First box value
 * @param {BoxValue|string|number|null} value2 - Second box value
 * @returns {boolean} True if values are equal
 *
 * @example
 * areBoxValuesEqual(
 *   { top: '#fff', right: '#fff', bottom: '#fff', left: '#fff' },
 *   { top: '#fff', right: '#fff', bottom: '#fff', left: '#fff' }
 * )
 * // Returns: true
 */
export function areBoxValuesEqual(value1, value2) {
	const normalized1 = normalizeBoxValue(value1);
	const normalized2 = normalizeBoxValue(value2);

	return (
		normalized1.top === normalized2.top &&
		normalized1.right === normalized2.right &&
		normalized1.bottom === normalized2.bottom &&
		normalized1.left === normalized2.left
	);
}

/**
 * Creates a new box value with all sides set to the same value.
 *
 * @param {string|number} sideValue - The value for all sides
 * @param {string} [unit=''] - Optional unit for numeric values
 * @returns {BoxValue} Box value with all sides equal
 *
 * @example
 * createUniformBoxValue('#ffffff')
 * // Returns: { top: '#ffffff', right: '#ffffff', bottom: '#ffffff', left: '#ffffff', linked: true }
 *
 * @example
 * createUniformBoxValue(10, 'px')
 * // Returns: { top: 10, right: 10, bottom: 10, left: 10, linked: true, unit: 'px' }
 */
export function createUniformBoxValue(sideValue, unit = '') {
	const result = {
		top: sideValue,
		right: sideValue,
		bottom: sideValue,
		left: sideValue,
		linked: true,
	};

	if (unit) {
		result.unit = unit;
	}

	return result;
}
