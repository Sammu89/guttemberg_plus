const { buildKebabName } = require( '../naming-utils' );

const SIDES = [ 'top', 'right', 'bottom', 'left' ];

const BORDER_STYLE_OPTIONS = [
	{ value: 'none', label: 'None' },
	{ value: 'solid', label: 'Solid' },
	{ value: 'dashed', label: 'Dashed' },
	{ value: 'dotted', label: 'Dotted' },
	{ value: 'double', label: 'Double' },
];

function capitalize( value ) {
	if ( ! value ) {
		return '';
	}
	return `${ value.charAt( 0 ).toUpperCase() }${ value.slice( 1 ) }`;
}

function normalizeSides( fields ) {
	if ( ! Array.isArray( fields ) || fields.length === 0 ) {
		return [ ...SIDES ];
	}

	const sides = [];
	fields.forEach( ( field ) => {
		const side = String( field ).toLowerCase();
		if ( ! SIDES.includes( side ) ) {
			throw new Error( `Unknown border side: ${ field }` );
		}
		if ( ! sides.includes( side ) ) {
			sides.push( side );
		}
	} );

	return sides;
}

function coerceUnitValue( value, unit ) {
	if ( value === undefined || value === null ) {
		return value;
	}
	if ( typeof value === 'number' ) {
		return `${ value }${ unit || '' }`;
	}
	return String( value );
}

function normalizeSideUnitValues( raw, fallback, defaultUnit ) {
	const values = {};
	if ( raw && typeof raw === 'object' && ! Array.isArray( raw ) ) {
		const unit = raw.unit || defaultUnit;
		SIDES.forEach( ( side ) => {
			const rawValue = raw[ side ] !== undefined ? raw[ side ] : raw.value;
			const value = rawValue !== undefined ? rawValue : fallback;
			values[ side ] = coerceUnitValue( value, unit );
		} );
		return values;
	}

	const fallbackValue = raw !== undefined ? raw : fallback;
	const normalized = coerceUnitValue( fallbackValue, defaultUnit );
	SIDES.forEach( ( side ) => {
		values[ side ] = normalized;
	} );

	return values;
}

function normalizeSideValues( raw, fallback ) {
	const values = {};
	if ( raw && typeof raw === 'object' && ! Array.isArray( raw ) ) {
		SIDES.forEach( ( side ) => {
			const rawValue = raw[ side ] !== undefined ? raw[ side ] : raw.value;
			values[ side ] = rawValue !== undefined ? rawValue : fallback;
		} );
		return values;
	}

	const value = raw !== undefined ? raw : fallback;
	SIDES.forEach( ( side ) => {
		values[ side ] = value;
	} );

	return values;
}

/**
 * Expand border-panel macro into per-side attributes.
 *
 * @param {string} macroName - Macro attribute name (e.g., 'dividerBorder').
 * @param {Object} macro     - Macro definition from schema.
 * @param {string} blockType - Block type (accordion, tabs, toc).
 * @return {Object} Expanded attributes object.
 */
function expandBorderPanelMacro( macroName, macro, blockType ) {
	const expanded = {};
	const baseName = macroName || 'border';
	const group = 'borders';
	const subgroup = macro.subgroup;
	const element = macro.element || macro.appliesToElement || macro.appliesTo || 'item';
	const themeable = macro.themeable !== undefined ? macro.themeable : true;
	const sides = normalizeSides( macro.fields );
	const defaults = macro.default || {};

	const widthDefaults = normalizeSideUnitValues( defaults.width, '0px', 'px' );
	const colorDefaults = normalizeSideValues( defaults.color, '#dddddd' );
	const styleDefaults = normalizeSideValues( defaults.style, 'solid' );

	// BorderPanel requires all width/color/style attributes to share the same controlId
	// The panel renders ALL sides together in one unified control
	const controlId = baseName; // e.g., "block-box" or "divider"

	sides.forEach( ( side, index ) => {
		const sideLabel = capitalize( side );
		const isFirst = index === 0;

		const widthEntry = {
			type: 'string',
			default: widthDefaults[ side ],
			label: `Border Width (${ sideLabel })`,
			description: `Border width on the ${ side } side`,
			group,
			control: 'BorderPanel',
			controlId: controlId,
			renderControl: isFirst, // Only render BorderPanel once (on first side's width)
			element,
			cssProperty: `border-${ side }-width`,
			themeable,
			outputsCSS: true,
		};

		const colorEntry = {
			type: 'string',
			default: colorDefaults[ side ],
			label: `Border Color (${ sideLabel })`,
			description: `Border color on the ${ side } side`,
			group,
			control: 'BorderPanel',
			controlId: controlId,
			renderControl: false, // Part of BorderPanel, don't render separately
			element,
			cssProperty: `border-${ side }-color`,
			themeable,
			outputsCSS: true,
		};

		const styleEntry = {
			type: 'string',
			default: styleDefaults[ side ],
			label: `Border Style (${ sideLabel })`,
			description: `Border style on the ${ side } side`,
			group,
			control: 'BorderPanel',
			controlId: controlId,
			renderControl: false, // Part of BorderPanel, don't render separately
			options: BORDER_STYLE_OPTIONS,
			element,
			cssProperty: `border-${ side }-style`,
			themeable,
			outputsCSS: true,
		};

		if ( subgroup ) {
			widthEntry.subgroup = subgroup;
			colorEntry.subgroup = subgroup;
			styleEntry.subgroup = subgroup;
		}

		// Build kebab-case attribute names
		const widthAttrName = buildKebabName( baseName, `BorderWidth${ sideLabel }` );
		const colorAttrName = buildKebabName( baseName, `BorderColor${ sideLabel }` );
		const styleAttrName = buildKebabName( baseName, `BorderStyle${ sideLabel }` );

		expanded[ widthAttrName ] = widthEntry;
		expanded[ colorAttrName ] = colorEntry;
		expanded[ styleAttrName ] = styleEntry;
	} );

	return expanded;
}

module.exports = {
	expandBorderPanelMacro,
	BORDER_STYLE_OPTIONS,
	SIDES,
};
