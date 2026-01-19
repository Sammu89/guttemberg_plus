const { buildKebabName } = require( '../naming-utils' );

const DEFAULT_FIELDS = [ 'text', 'background' ];

const FIELD_DEFS = {
	text: {
		suffix: 'Text',
		type: 'string',
		control: 'ColorPicker',
		cssVarSuffix: 'color',
		cssProperty: 'color',
		default: '#333333',
		label: 'Text',
		description: 'Text color',
	},
	background: {
		suffix: 'Background',
		type: 'string',
		control: 'ColorGradientControl',
		cssVarSuffix: 'background',
		cssProperty: 'background',
		default: 'transparent',
		label: 'Background',
		description: 'Background color',
	},
};

function titleCase( value ) {
	if ( ! value ) {
		return '';
	}
	return value.replace( /\b\w/g, ( char ) => char.toUpperCase() );
}

function getStateLabel( state ) {
	if ( state === 'is-open' ) {
		return 'Open';
	}
	return titleCase( state.replace( /-/g, ' ' ) );
}

function expandColorPanelMacro( macroName, macro, blockType ) {
	const expanded = {};
	const baseName = macroName || 'colors';
	const group = macro.group || 'colors';
	const subgroupBase = macro.subgroup;
	const stateSubgroups = macro.stateSubgroups || {};
	const element = macro.element || macro.appliesToElement || macro.appliesTo;
	const themeable = macro.themeable !== undefined ? macro.themeable : true;
	const fields =
		Array.isArray( macro.fields ) && macro.fields.length ? macro.fields : DEFAULT_FIELDS;
	const states = Array.isArray( macro.states ) && macro.states.length ? macro.states : [ 'base' ];
	const defaults = macro.default || {};
	const properties = macro.properties || {};
	const needsMapping = macro.needsMapping === true;

	const inferredBase = `${ blockType }-${ baseName.replace( /Colors?$/, '' ) }`.replace(
		/_/g,
		'-'
	);
	const cssVarBase = macro.cssVar || inferredBase;

	states.forEach( ( state ) => {
		const stateDefaults =
			defaults[ state ] && typeof defaults[ state ] === 'object'
				? defaults[ state ]
				: defaults;
		const subgroup =
			stateSubgroups[ state ] ||
			( state === 'base'
				? subgroupBase
				: subgroupBase
				? `${ subgroupBase } - ${ getStateLabel( state ) }`
				: undefined );

		// Use PanelColorSettings composite control
		// All color fields in this state share the same controlId
		const controlId = state === 'base' ? baseName : `${ baseName }-${ state }`;

		fields.forEach( ( fieldKey, index ) => {
			const def = FIELD_DEFS[ fieldKey ];
			if ( ! def ) {
				throw new Error( `Unknown color field: ${ fieldKey }` );
			}

			const attrName = buildKebabName( baseName, def.suffix, state === 'base' ? '' : state );
			const fieldDefault = stateDefaults[ fieldKey ];
			const propertyOverride = properties[ fieldKey ];
			const isFirst = index === 0;

			const entry = {
				type: def.type,
				default: fieldDefault !== undefined ? fieldDefault : def.default,
				label: def.label,
				description: def.description,
				group,
				control: 'PanelColorSettings',
				controlId: controlId,
				renderControl: isFirst, // Only render PanelColorSettings once for all fields
				element,
				themeable,
				outputsCSS: true,
			};

			// Add colorLabel for PanelColorSettings to identify each setting
			entry.colorLabel = def.label;

			if ( subgroup ) {
				entry.subgroup = subgroup;
			}

			if ( propertyOverride || def.cssProperty ) {
				entry.cssProperty = propertyOverride || def.cssProperty;
			}

			if ( cssVarBase && def.cssVarSuffix ) {
				const stateToken = state === 'base' ? '' : `-${ state }`;
				entry.cssVar = `${ cssVarBase }-${ def.cssVarSuffix }${ stateToken }`;
			}

			if ( state !== 'base' ) {
				entry.state = state;
			}

			if ( needsMapping && state === 'base' && fieldKey === fields[ 0 ] ) {
				entry.needsMapping = true;
			}

			expanded[ attrName ] = entry;
		} );
	} );

	return expanded;
}

module.exports = {
	expandColorPanelMacro,
};
