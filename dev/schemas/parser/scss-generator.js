const { buildCssVarName } = require( './naming-utils' );

const STATE_ORDER = {
	base: 0,
	'is-open': 1,
	hover: 2,
	focus: 3,
	active: 4,
	'focus-visible': 5,
	'focus-within': 6,
	visited: 7,
	link: 8,
	target: 9,
};

const PSEUDO_STATES = new Set( [
	'hover',
	'focus',
	'active',
	'focus-visible',
	'focus-within',
	'visited',
	'link',
	'target',
] );

function buildSelector( baseSelector, state, device, blockType ) {
	let selector = baseSelector;

	if ( state && state !== 'base' && state !== 'inactive' ) {
		if ( state === 'is-open' ) {
			const itemSelector = `.gutplus-${ blockType }`;
			selector = `${ itemSelector }.is-open ${ baseSelector }`;
		} else if ( PSEUDO_STATES.has( state ) ) {
			selector = `${ baseSelector }:${ state }`;
		}
	}

	if ( device !== 'desktop' ) {
		selector = `[data-gutplus-device="${ device }"] ${ selector }`;
	}

	return selector;
}

function shouldEmitCSS( attr ) {
	if ( ! attr ) {
		return false;
	}
	if ( attr.type === 'composite' ) {
		return false;
	}
	if ( attr.outputsCSS === false ) {
		return false;
	}
	return Boolean( attr.cssProperty && attr.element );
}

function normalizeDefaultValue( attr ) {
	if ( ! attr || attr.default === undefined || attr.default === null ) {
		return null;
	}

	if (
		attr.cssValueMap &&
		Object.prototype.hasOwnProperty.call( attr.cssValueMap, attr.default )
	) {
		return attr.cssValueMap[ attr.default ];
	}

	if ( Array.isArray( attr.default ) ) {
		return null;
	}

	if ( typeof attr.default === 'object' ) {
		return null;
	}

	return attr.default;
}

function buildVarChain( attr, device, blockType ) {
	const state = attr.state || 'base';
	const baseVar =
		attr.cssVar || buildCssVarName( blockType, attr.element, attr.cssProperty, state );
	const variants = Array.isArray( attr.cssVarVariants )
		? attr.cssVarVariants
		: [ baseVar, `${ baseVar }-tablet`, `${ baseVar }-mobile` ];

	if ( device === 'desktop' ) {
		return `var(${ baseVar })`;
	}

	const tabletVar = variants[ 1 ] || `${ baseVar }-tablet`;
	const mobileVar = variants[ 2 ] || `${ baseVar }-mobile`;

	if ( device === 'tablet' ) {
		return `var(${ tabletVar }, var(${ baseVar }))`;
	}

	return `var(${ mobileVar }, var(${ tabletVar }, var(${ baseVar })))`;
}

function groupAttributes( attributes, elements ) {
	const groups = {};

	Object.entries( attributes || {} ).forEach( ( [ attrName, attr ] ) => {
		if ( ! shouldEmitCSS( attr ) ) {
			return;
		}

		const elementIds = Array.isArray( attr.element ) ? attr.element : [ attr.element ];
		const state = attr.state || 'base';
		const devices = attr.responsive ? [ 'desktop', 'tablet', 'mobile' ] : [ 'desktop' ];

		elementIds.forEach( ( elementId ) => {
			const element = elements[ elementId ];
			if ( ! element || ! element.selector ) {
				return;
			}

			devices.forEach( ( device ) => {
				const key = `${ elementId }:${ state }:${ device }`;
				if ( ! groups[ key ] ) {
					groups[ key ] = {
						element: elementId,
						selector: element.selector,
						state,
						device,
						attributes: [],
					};
				}

				groups[ key ].attributes.push( {
					name: attrName,
					cssProperty: attr.cssProperty,
					cssVar: attr.cssVar,
					device,
					...attr,
				} );
			} );
		} );
	} );

	return groups;
}

function generateRootVariables( attributes ) {
	const lines = [];
	const seen = new Set();
	const entries = Object.entries( attributes || {} )
		.filter(
			( [ , attr ] ) =>
				attr && attr.cssVar && attr.type !== 'composite' && attr.outputsCSS !== false
		)
		.sort( ( a, b ) => {
			const aVar = a[ 1 ].cssVar || '';
			const bVar = b[ 1 ].cssVar || '';
			return aVar.localeCompare( bVar );
		} );

	entries.forEach( ( [ attrName, attr ] ) => {
		const value = normalizeDefaultValue( attr );
		if ( value === null ) {
			return;
		}
		if ( seen.has( attr.cssVar ) ) {
			return;
		}
		seen.add( attr.cssVar );
		lines.push( `  ${ attr.cssVar }: ${ value };` );
	} );

	if ( lines.length === 0 ) {
		return '';
	}

	return `:root {\n${ lines.join( '\n' ) }\n}\n\n`;
}

function generateSelectorBlock( group, blockType ) {
	const { selector, state, device, attributes } = group;
	const fullSelector = buildSelector( selector, state, device, blockType );

	const propertyMap = {};
	attributes.forEach( ( attr ) => {
		const value =
			( attr.cssValueByDevice && attr.cssValueByDevice[ device ] ) ||
			( typeof attr.cssValue === 'string' && attr.cssValue.length > 0
				? attr.cssValue
				: buildVarChain( attr, device, blockType ) );
		propertyMap[ attr.cssProperty ] = `  ${ attr.cssProperty }: ${ value };`;
	} );

	const rules = Object.values( propertyMap ).join( '\n' );
	return `${ fullSelector } {\n${ rules }\n}`;
}

function generateUniversalSCSS( comprehensiveSchema ) {
	const { blockType, attributes, structure } = comprehensiveSchema;
	const elements = structure?.elements || {};

	let scss = '';
	scss += `/**\n`;
	scss += ` * AUTO-GENERATED - DO NOT EDIT\n`;
	scss += ` * Source: comprehensive schema for ${ blockType }\n`;
	scss += ` * Generated: ${ new Date().toISOString() }\n`;
	scss += ` */\n\n`;

	scss += generateRootVariables( attributes );

	const groups = groupAttributes( attributes, elements );
	const sortedGroups = Object.entries( groups ).sort( ( a, b ) => {
		const groupA = a[ 1 ];
		const groupB = b[ 1 ];

		const deviceOrder = { desktop: 0, tablet: 1, mobile: 2 };
		const deviceDiff = deviceOrder[ groupA.device ] - deviceOrder[ groupB.device ];
		if ( deviceDiff !== 0 ) {
			return deviceDiff;
		}

		const stateDiff =
			( STATE_ORDER[ groupA.state ] ?? 99 ) - ( STATE_ORDER[ groupB.state ] ?? 99 );
		if ( stateDiff !== 0 ) {
			return stateDiff;
		}

		return groupA.element.localeCompare( groupB.element );
	} );

	let currentDevice = null;
	let currentState = null;

	sortedGroups.forEach( ( [ , group ] ) => {
		if ( group.device !== currentDevice ) {
			currentDevice = group.device;
			scss += `\n/* ========================================\n`;
			scss += `   ${ currentDevice.toUpperCase() }\n`;
			scss += `   ======================================== */\n\n`;
			currentState = null;
		}

		if ( group.state !== currentState ) {
			currentState = group.state;
			if ( currentState !== 'base' ) {
				scss += `/* ${ currentState } state */\n`;
			}
		}

		scss += generateSelectorBlock( group, blockType );
		scss += '\n\n';
	} );

	return scss;
}

function generateAndWriteSCSS( comprehensiveSchema, outputPath ) {
	const fs = require( 'fs' );
	const scss = generateUniversalSCSS( comprehensiveSchema );

	fs.writeFileSync( outputPath, scss, 'utf8' );
	return scss;
}

module.exports = {
	generateUniversalSCSS,
	generateAndWriteSCSS,
	buildSelector,
};
