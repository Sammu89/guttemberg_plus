/**
 * Attribute Compression Utility
 *
 * Compresses atomic CSS attributes into CSS shorthand notation before saving to database.
 * This reduces storage size and creates cleaner, more maintainable saved data.
 *
 * COMPRESSION RULES (from schemas/README.md):
 * - padding, margin, border-width, border-style, border-color: 1/2/3/4-value shorthands
 * - border-radius: 1-4 value shorthand
 * - border-{side}: composed from {side}-width/style/color when all present
 * - border: only valid when all four side values match
 *
 * EXAMPLES:
 * Input:  { borderTopWidth: '1px', borderRightWidth: '1px', ... }
 * Output: { borderWidth: '1px' }
 *
 * Input:  { paddingTop: '10px', paddingRight: '20px', paddingBottom: '10px', paddingLeft: '20px' }
 * Output: { padding: '10px 20px' }
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Property families that support 4-value shorthand (top, right, bottom, left)
 * Format: baseName + Side (e.g., padding + Top = paddingTop)
 */
const FOUR_VALUE_PROPERTIES = [
	'padding',
	'margin',
];

/**
 * Border properties that support 4-value shorthand
 * Format: border + Side + Property (e.g., border + Top + Width = borderTopWidth)
 */
const BORDER_FOUR_VALUE_PROPERTIES = [
	{ baseName: 'border', property: 'Width', shorthand: 'borderWidth' },
	{ baseName: 'border', property: 'Style', shorthand: 'borderStyle' },
	{ baseName: 'border', property: 'Color', shorthand: 'borderColor' },
];

/**
 * Property families that support 4-value shorthand (corners: top-left, top-right, bottom-right, bottom-left)
 */
const CORNER_PROPERTIES = ['borderRadius'];

/**
 * Sides in CSS order (top, right, bottom, left)
 */
const SIDES = ['Top', 'Right', 'Bottom', 'Left'];

/**
 * Corners in CSS order (top-left, top-right, bottom-right, bottom-left)
 */
const CORNERS = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'];

/**
 * Check if a value is defined and not empty
 */
function isDefined(value) {
	return value !== undefined && value !== null && value !== '';
}

/**
 * Normalize a value to string for comparison
 */
function normalizeValue(value) {
	if (value === undefined || value === null) {
		return '';
	}
	return String(value).trim();
}

/**
 * Check if all values in array are equal
 */
function allEqual(values) {
	if (values.length === 0) return false;
	const normalized = values.map(normalizeValue);
	const first = normalized[0];
	return normalized.every(v => v === first);
}

/**
 * Compress 4-value CSS shorthand (top, right, bottom, left)
 * Returns the most compact representation following CSS rules
 */
function compressFourValues(top, right, bottom, left) {
	const t = normalizeValue(top);
	const r = normalizeValue(right);
	const b = normalizeValue(bottom);
	const l = normalizeValue(left);

	// All four same
	if (t === r && r === b && b === l) {
		return t;
	}

	// Top/bottom same, left/right same
	if (t === b && r === l) {
		return `${t} ${r}`;
	}

	// Left/right same, top different, bottom different
	if (r === l) {
		return `${t} ${r} ${b}`;
	}

	// All different
	return `${t} ${r} ${b} ${l}`;
}

/**
 * Extract side values for a property
 * Returns array [top, right, bottom, left] or null if not all defined
 */
function extractSideValues(attributes, baseName) {
	const values = SIDES.map(side => {
		const key = `${baseName}${side}`;
		return attributes[key];
	});

	// Only compress if all sides are defined
	if (values.every(isDefined)) {
		return values;
	}

	return null;
}

/**
 * Extract border property values (e.g., borderTopWidth, borderRightWidth, etc.)
 * Returns array [top, right, bottom, left] or null if not all defined
 */
function extractBorderPropertyValues(attributes, baseName, property) {
	const values = SIDES.map(side => {
		const key = `${baseName}${side}${property}`;
		return attributes[key];
	});

	// Only compress if all sides are defined
	if (values.every(isDefined)) {
		return values;
	}

	return null;
}

/**
 * Extract corner values for border-radius
 * Returns array [top-left, top-right, bottom-right, bottom-left] or null
 */
function extractCornerValues(attributes, baseName) {
	const values = CORNERS.map(corner => {
		const key = `${baseName}${corner}`;
		return attributes[key];
	});

	// Only compress if all corners are defined
	if (values.every(isDefined)) {
		return values;
	}

	return null;
}

/**
 * Remove side-specific attributes from object
 */
function removeSideAttributes(attributes, baseName, sides = SIDES) {
	const result = { ...attributes };
	sides.forEach(side => {
		const key = `${baseName}${side}`;
		delete result[key];
	});
	return result;
}

/**
 * Remove border property attributes (e.g., borderTopWidth, borderRightWidth, etc.)
 */
function removeBorderPropertyAttributes(attributes, baseName, property) {
	const result = { ...attributes };
	SIDES.forEach(side => {
		const key = `${baseName}${side}${property}`;
		delete result[key];
	});
	return result;
}

/**
 * Compress padding/margin/border-width/border-style/border-color
 * Handles both scalar and responsive values
 */
function compressFourValueProperty(attributes, baseName) {
	const values = extractSideValues(attributes, baseName);

	if (!values) {
		return attributes; // Not all sides defined, can't compress
	}

	const [top, right, bottom, left] = values;

	// Check if any value is responsive
	const hasResponsive = values.some(isResponsiveStructure);

	if (hasResponsive) {
		// Handle responsive compression
		return compressResponsiveFourValueProperty(attributes, baseName, [top, right, bottom, left]);
	}

	// Simple scalar compression
	const compressed = compressFourValues(top, right, bottom, left);

	// Remove individual side attributes and add compressed version
	let result = removeSideAttributes(attributes, baseName);
	result[baseName] = compressed;

	return result;
}

/**
 * Compress responsive 4-value property
 * Compresses at each device level independently
 */
function compressResponsiveFourValueProperty(attributes, baseName, values) {
	const [top, right, bottom, left] = values;

	// Extract device levels
	const devices = ['value', 'tablet', 'mobile'];
	const compressedValue = {};

	devices.forEach(device => {
		// Extract values for this device from all four sides
		const deviceValues = values.map(sideValue => {
			if (isResponsiveStructure(sideValue)) {
				return device === 'value' ? sideValue.value : sideValue[device];
			}
			// If not responsive, use the scalar value for all devices
			return device === 'value' ? sideValue : undefined;
		});

		// Only compress if all sides have a value for this device
		if (deviceValues.every(v => v !== undefined)) {
			const compressed = compressFourValues(...deviceValues);
			if (device === 'value') {
				compressedValue.value = compressed;
			} else {
				compressedValue[device] = compressed;
			}
		}
	});

	// Remove individual side attributes and add compressed version
	let result = removeSideAttributes(attributes, baseName);
	result[baseName] = compressedValue;

	return result;
}

/**
 * Compress border property (borderWidth, borderStyle, borderColor)
 * Handles border{Side}{Property} → {shorthand}
 */
function compressBorderProperty(attributes, config) {
	const { baseName, property, shorthand } = config;
	const values = extractBorderPropertyValues(attributes, baseName, property);

	if (!values) {
		return attributes; // Not all sides defined, can't compress
	}

	const [top, right, bottom, left] = values;

	// Check if any value is responsive
	const hasResponsive = values.some(isResponsiveStructure);

	if (hasResponsive) {
		// Handle responsive compression
		return compressResponsiveBorderProperty(attributes, baseName, property, shorthand, values);
	}

	// Simple scalar compression
	const compressed = compressFourValues(top, right, bottom, left);

	// Remove individual side attributes and add compressed version
	let result = removeBorderPropertyAttributes(attributes, baseName, property);
	result[shorthand] = compressed;

	return result;
}

/**
 * Compress responsive border property
 */
function compressResponsiveBorderProperty(attributes, baseName, property, shorthand, values) {
	const devices = ['value', 'tablet', 'mobile'];
	const compressedValue = {};

	devices.forEach(device => {
		// Extract values for this device from all four sides
		const deviceValues = values.map(sideValue => {
			if (isResponsiveStructure(sideValue)) {
				return device === 'value' ? sideValue.value : sideValue[device];
			}
			return device === 'value' ? sideValue : undefined;
		});

		// Only compress if all sides have a value for this device
		if (deviceValues.every(v => v !== undefined)) {
			const compressed = compressFourValues(...deviceValues);
			if (device === 'value') {
				compressedValue.value = compressed;
			} else {
				compressedValue[device] = compressed;
			}
		}
	});

	// Remove individual side attributes and add compressed version
	let result = removeBorderPropertyAttributes(attributes, baseName, property);
	result[shorthand] = compressedValue;

	return result;
}

/**
 * Compress border-radius corners
 */
function compressBorderRadius(attributes) {
	const values = extractCornerValues(attributes, 'borderRadius');

	if (!values) {
		return attributes;
	}

	const [tl, tr, br, bl] = values;
	const compressed = compressFourValues(tl, tr, br, bl);

	// Remove individual corner attributes
	let result = removeSideAttributes(attributes, 'borderRadius', CORNERS);
	result.borderRadius = compressed;

	return result;
}

/**
 * Compress border-{side} (e.g., borderTop from borderTopWidth + borderTopStyle + borderTopColor)
 */
function compressBorderSides(attributes) {
	let result = { ...attributes };

	SIDES.forEach(side => {
		const widthKey = `border${side}Width`;
		const styleKey = `border${side}Style`;
		const colorKey = `border${side}Color`;

		const width = attributes[widthKey];
		const style = attributes[styleKey];
		const color = attributes[colorKey];

		// Only compress if all three properties are defined
		if (isDefined(width) && isDefined(style) && isDefined(color)) {
			const borderSideKey = `border${side}`;
			result[borderSideKey] = `${width} ${style} ${color}`;

			// Remove individual properties
			delete result[widthKey];
			delete result[styleKey];
			delete result[colorKey];
		}
	});

	return result;
}

/**
 * Compress full border (only if all four sides have identical border properties)
 */
function compressFullBorder(attributes) {
	// Check if we have border-{side} values
	const borderSides = SIDES.map(side => attributes[`border${side}`]).filter(isDefined);

	if (borderSides.length === 4 && allEqual(borderSides)) {
		// All four sides have identical border values
		let result = { ...attributes };

		// Set single border property
		result.border = borderSides[0];

		// Remove individual border-{side} properties
		SIDES.forEach(side => {
			delete result[`border${side}`];
		});

		return result;
	}

	return attributes;
}

/**
 * Check if object is a responsive value structure
 */
function isResponsiveStructure(value) {
	return value && typeof value === 'object' &&
		(value.tablet !== undefined || value.mobile !== undefined);
}

/**
 * Compress responsive attributes at the attribute level
 * Handles: paddingTop: {value:'10px', tablet:'8px'} → stays as-is (scalar values)
 * Does NOT try to compress objects into strings
 */
function compressResponsiveAttribute(attrName, attrValue) {
	// Not responsive, return as-is
	if (!isResponsiveStructure(attrValue)) {
		return attrValue;
	}

	// This is already a responsive structure, just return it
	// The compression happens at the attribute family level, not value level
	return attrValue;
}

/**
 * Main compression function
 * Compresses all atomic CSS attributes into their shorthand equivalents
 *
 * @param {Object} attributes - Attributes object to compress
 * @param {Object} options - Compression options
 * @param {boolean} options.aggressive - If true, also compress border-{side} → border
 * @returns {Object} Compressed attributes
 */
export function compressAttributes(attributes, options = {}) {
	const { aggressive = true } = options;

	if (!attributes || typeof attributes !== 'object') {
		return attributes;
	}

	let result = { ...attributes };

	// Step 1: Compress 4-value properties (padding, margin)
	FOUR_VALUE_PROPERTIES.forEach(baseName => {
		result = compressFourValueProperty(result, baseName);
	});

	// Step 2: Compress border properties (borderWidth, borderStyle, borderColor)
	BORDER_FOUR_VALUE_PROPERTIES.forEach(config => {
		result = compressBorderProperty(result, config);
	});

	// Step 3: Compress border-radius corners
	result = compressBorderRadius(result);

	// Step 4: Compress border-{side} (width + style + color → border-top)
	result = compressBorderSides(result);

	// Step 5: Compress full border (only if aggressive mode and all sides match)
	if (aggressive) {
		result = compressFullBorder(result);
	}

	// Note: Responsive compression is handled at the property family level,
	// not at the individual attribute level

	return result;
}

/**
 * Compress customizations object (used in save.js)
 * This is the main entry point for compression before saving to database
 *
 * @param {Object} customizations - Customizations object
 * @returns {Object} Compressed customizations
 */
export function compressCustomizations(customizations) {
	if (!customizations || typeof customizations !== 'object') {
		return customizations;
	}

	return compressAttributes(customizations);
}

/**
 * Get compression statistics (for debugging/logging)
 */
export function getCompressionStats(original, compressed) {
	const originalKeys = Object.keys(original || {});
	const compressedKeys = Object.keys(compressed || {});

	const reduction = originalKeys.length - compressedKeys.length;
	const percentage = originalKeys.length > 0
		? Math.round((reduction / originalKeys.length) * 100)
		: 0;

	return {
		originalCount: originalKeys.length,
		compressedCount: compressedKeys.length,
		reduction,
		percentage,
		originalSize: JSON.stringify(original).length,
		compressedSize: JSON.stringify(compressed).length,
	};
}

/**
 * Example usage and test cases
 */
export const COMPRESSION_EXAMPLES = {
	padding: {
		input: {
			paddingTop: '10px',
			paddingRight: '10px',
			paddingBottom: '10px',
			paddingLeft: '10px',
		},
		output: {
			padding: '10px',
		},
	},
	paddingTwoValues: {
		input: {
			paddingTop: '10px',
			paddingRight: '20px',
			paddingBottom: '10px',
			paddingLeft: '20px',
		},
		output: {
			padding: '10px 20px',
		},
	},
	borderWidth: {
		input: {
			borderTopWidth: '1px',
			borderRightWidth: '2px',
			borderBottomWidth: '1px',
			borderLeftWidth: '2px',
		},
		output: {
			borderWidth: '1px 2px',
		},
	},
	borderSide: {
		input: {
			borderTopWidth: '1px',
			borderTopStyle: 'solid',
			borderTopColor: '#000',
		},
		output: {
			borderTop: '1px solid #000',
		},
	},
	fullBorder: {
		input: {
			borderTop: '1px solid #000',
			borderRight: '1px solid #000',
			borderBottom: '1px solid #000',
			borderLeft: '1px solid #000',
		},
		output: {
			border: '1px solid #000',
		},
	},
	borderRadius: {
		input: {
			borderRadiusTopLeft: '5px',
			borderRadiusTopRight: '5px',
			borderRadiusBottomRight: '5px',
			borderRadiusBottomLeft: '5px',
		},
		output: {
			borderRadius: '5px',
		},
	},
};
