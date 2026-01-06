/**
 * Attribute Decompression Utility
 *
 * Expands CSS shorthand notation back to atomic attributes when loading from database.
 * This is the reverse of attribute-compression.js
 *
 * The editor always works with expanded/atomic format, so we decompress on load
 * and compress on save for optimal storage.
 *
 * DECOMPRESSION RULES:
 * - '10px' → { top: '10px', right: '10px', bottom: '10px', left: '10px' }
 * - '10px 20px' → { top: '10px', right: '20px', bottom: '10px', left: '20px' }
 * - '10px 20px 30px' → { top: '10px', right: '20px', bottom: '30px', left: '20px' }
 * - '10px 20px 30px 40px' → { top: '10px', right: '20px', bottom: '30px', left: '40px' }
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Property families that support 4-value shorthand
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
	{ shorthand: 'borderWidth', baseName: 'border', property: 'Width' },
	{ shorthand: 'borderStyle', baseName: 'border', property: 'Style' },
	{ shorthand: 'borderColor', baseName: 'border', property: 'Color' },
];

/**
 * Sides in CSS order
 */
const SIDES = ['Top', 'Right', 'Bottom', 'Left'];

/**
 * Corners in CSS order
 */
const CORNERS = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'];

/**
 * Parse CSS shorthand value into array of 4 values
 * Follows CSS box model rules
 */
function parseShorthand(value) {
	if (!value || typeof value !== 'string') {
		return null;
	}

	const parts = value.trim().split(/\s+/);

	switch (parts.length) {
		case 1:
			// All sides same
			return [parts[0], parts[0], parts[0], parts[0]];

		case 2:
			// Top/bottom, left/right
			return [parts[0], parts[1], parts[0], parts[1]];

		case 3:
			// Top, left/right, bottom
			return [parts[0], parts[1], parts[2], parts[1]];

		case 4:
			// Top, right, bottom, left
			return parts;

		default:
			return null;
	}
}

/**
 * Decompress 4-value property (padding, margin, border-width, etc.)
 */
function decompressFourValueProperty(attributes, baseName) {
	const shorthandKey = baseName;
	const shorthandValue = attributes[shorthandKey];

	if (!shorthandValue) {
		return attributes; // No shorthand present
	}

	const values = parseShorthand(shorthandValue);

	if (!values) {
		return attributes; // Invalid shorthand, keep as-is
	}

	const result = { ...attributes };

	// Remove shorthand
	delete result[shorthandKey];

	// Add individual side values
	SIDES.forEach((side, index) => {
		const key = `${baseName}${side}`;
		result[key] = values[index];
	});

	return result;
}

/**
 * Decompress border property (borderWidth, borderStyle, borderColor)
 */
function decompressBorderProperty(attributes, config) {
	const { shorthand, baseName, property } = config;
	const shorthandValue = attributes[shorthand];

	if (!shorthandValue) {
		return attributes;
	}

	// Handle responsive values
	if (typeof shorthandValue === 'object' && (shorthandValue.value !== undefined || shorthandValue.tablet !== undefined || shorthandValue.mobile !== undefined)) {
		return decompressResponsiveBorderProperty(attributes, shorthand, baseName, property, shorthandValue);
	}

	// Handle scalar values
	const values = parseShorthand(shorthandValue);

	if (!values) {
		return attributes;
	}

	const result = { ...attributes };

	// Remove shorthand
	delete result[shorthand];

	// Add individual side values
	SIDES.forEach((side, index) => {
		const key = `${baseName}${side}${property}`;
		result[key] = values[index];
	});

	return result;
}

/**
 * Decompress responsive border property
 */
function decompressResponsiveBorderProperty(attributes, shorthand, baseName, property, value) {
	const result = { ...attributes };

	// Remove shorthand
	delete result[shorthand];

	// Decompress each device level
	const devices = { value: value.value, tablet: value.tablet, mobile: value.mobile };

	// Build responsive structure for each side
	const sideValues = {};
	SIDES.forEach(side => {
		sideValues[side] = {};
	});

	Object.entries(devices).forEach(([device, deviceValue]) => {
		if (deviceValue === undefined) return;

		const values = parseShorthand(deviceValue);
		if (!values) return;

		SIDES.forEach((side, index) => {
			sideValues[side][device] = values[index];
		});
	});

	// Create attributes for each side
	SIDES.forEach(side => {
		const key = `${baseName}${side}${property}`;
		const sideValue = sideValues[side];

		// If all devices are the same, use scalar value
		if (sideValue.value && !sideValue.tablet && !sideValue.mobile) {
			result[key] = sideValue.value;
		} else {
			result[key] = sideValue;
		}
	});

	return result;
}

/**
 * Decompress border-radius
 */
function decompressBorderRadius(attributes) {
	const shorthandValue = attributes.borderRadius;

	if (!shorthandValue) {
		return attributes;
	}

	const values = parseShorthand(shorthandValue);

	if (!values) {
		return attributes;
	}

	const result = { ...attributes };

	// Remove shorthand
	delete result.borderRadius;

	// Add individual corner values
	CORNERS.forEach((corner, index) => {
		const key = `borderRadius${corner}`;
		result[key] = values[index];
	});

	return result;
}

/**
 * Decompress border-{side} (e.g., 'borderTop: "1px solid #000"' → width/style/color)
 */
function decompressBorderSides(attributes) {
	let result = { ...attributes };

	SIDES.forEach(side => {
		const borderSideKey = `border${side}`;
		const borderSideValue = attributes[borderSideKey];

		if (!borderSideValue || typeof borderSideValue !== 'string') {
			return;
		}

		// Parse border shorthand: "1px solid #000"
		const parts = borderSideValue.trim().split(/\s+/);

		if (parts.length >= 3) {
			const [width, style, ...colorParts] = parts;
			const color = colorParts.join(' '); // Handle colors with spaces like "rgba(0, 0, 0, 0.5)"

			// Remove shorthand
			delete result[borderSideKey];

			// Add individual properties
			result[`border${side}Width`] = width;
			result[`border${side}Style`] = style;
			result[`border${side}Color`] = color;
		}
	});

	return result;
}

/**
 * Decompress full border (e.g., 'border: "1px solid #000"' → all four sides)
 */
function decompressFullBorder(attributes) {
	const borderValue = attributes.border;

	if (!borderValue || typeof borderValue !== 'string') {
		return attributes;
	}

	// Parse border shorthand
	const parts = borderValue.trim().split(/\s+/);

	if (parts.length < 3) {
		return attributes; // Invalid border shorthand
	}

	const [width, style, ...colorParts] = parts;
	const color = colorParts.join(' ');

	let result = { ...attributes };

	// Remove full border
	delete result.border;

	// Add border for each side
	SIDES.forEach(side => {
		result[`border${side}`] = borderValue;
	});

	return result;
}

/**
 * Decompress responsive values recursively
 */
function decompressResponsiveValue(value) {
	if (!value || typeof value !== 'object') {
		return value;
	}

	// If it has responsive structure, decompress each device level
	if (value.tablet !== undefined || value.mobile !== undefined) {
		const result = { ...value };

		// Recursively decompress base value if it's an object
		if (value.value && typeof value.value === 'object') {
			result.value = decompressResponsiveValue(value.value);
		}

		// Decompress tablet value if present
		if (value.tablet && typeof value.tablet === 'object') {
			result.tablet = decompressResponsiveValue(value.tablet);
		}

		// Decompress mobile value if present
		if (value.mobile && typeof value.mobile === 'object') {
			result.mobile = decompressResponsiveValue(value.mobile);
		}

		return result;
	}

	return value;
}

/**
 * Main decompression function
 * Expands all CSS shorthand into atomic attributes
 *
 * @param {Object} attributes - Attributes object to decompress
 * @returns {Object} Decompressed attributes
 */
export function decompressAttributes(attributes) {
	if (!attributes || typeof attributes !== 'object') {
		return attributes;
	}

	let result = { ...attributes };

	// Step 1: Decompress full border first (border → border-{side})
	result = decompressFullBorder(result);

	// Step 2: Decompress border-{side} (border-top → width/style/color)
	result = decompressBorderSides(result);

	// Step 3: Decompress 4-value properties (padding, margin)
	FOUR_VALUE_PROPERTIES.forEach(baseName => {
		result = decompressFourValueProperty(result, baseName);
	});

	// Step 4: Decompress border properties (borderWidth, borderStyle, borderColor)
	BORDER_FOUR_VALUE_PROPERTIES.forEach(config => {
		result = decompressBorderProperty(result, config);
	});

	// Step 5: Decompress border-radius
	result = decompressBorderRadius(result);

	// Step 5: Decompress responsive values recursively
	Object.keys(result).forEach(key => {
		result[key] = decompressResponsiveValue(result[key]);
	});

	return result;
}

/**
 * Decompress customizations object (used when loading from database)
 *
 * @param {Object} customizations - Compressed customizations object
 * @returns {Object} Decompressed customizations
 */
export function decompressCustomizations(customizations) {
	if (!customizations || typeof customizations !== 'object') {
		return customizations;
	}

	return decompressAttributes(customizations);
}

/**
 * Example test cases
 */
export const DECOMPRESSION_EXAMPLES = {
	padding: {
		input: {
			padding: '10px',
		},
		output: {
			paddingTop: '10px',
			paddingRight: '10px',
			paddingBottom: '10px',
			paddingLeft: '10px',
		},
	},
	paddingTwoValues: {
		input: {
			padding: '10px 20px',
		},
		output: {
			paddingTop: '10px',
			paddingRight: '20px',
			paddingBottom: '10px',
			paddingLeft: '20px',
		},
	},
	borderSide: {
		input: {
			borderTop: '1px solid #000',
		},
		output: {
			borderTopWidth: '1px',
			borderTopStyle: 'solid',
			borderTopColor: '#000',
		},
	},
	fullBorder: {
		input: {
			border: '1px solid #000',
		},
		output: {
			borderTopWidth: '1px',
			borderTopStyle: 'solid',
			borderTopColor: '#000',
			borderRightWidth: '1px',
			borderRightStyle: 'solid',
			borderRightColor: '#000',
			borderBottomWidth: '1px',
			borderBottomStyle: 'solid',
			borderBottomColor: '#000',
			borderLeftWidth: '1px',
			borderLeftStyle: 'solid',
			borderLeftColor: '#000',
		},
	},
	borderRadius: {
		input: {
			borderRadius: '5px',
		},
		output: {
			borderRadiusTopLeft: '5px',
			borderRadiusTopRight: '5px',
			borderRadiusBottomRight: '5px',
			borderRadiusBottomLeft: '5px',
		},
	},
};
