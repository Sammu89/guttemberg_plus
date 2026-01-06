const { buildKebabName } = require( './naming-utils' );

const SIDES = [ 'top', 'right', 'bottom', 'left' ];
const CORNERS = [ 'top-left', 'top-right', 'bottom-right', 'bottom-left' ];

function getBucket( store, element, state ) {
	if ( ! store[ element ] ) {
		store[ element ] = {};
	}
	if ( ! store[ element ][ state ] ) {
		store[ element ][ state ] = {
			padding: {},
			margin: {},
			border: {},
			radius: {},
		};
	}
	return store[ element ][ state ];
}

function buildCompositeName( element, cssProperty, state ) {
	return buildKebabName( element, cssProperty, state );
}

function createCompositeEntry( { element, state, cssProperty, compositeOf } ) {
	const entry = {
		type: 'composite',
		element,
		cssProperty,
		compositeOf,
		outputsCSS: false,
	};

	if ( state && state !== 'base' && state !== 'inactive' ) {
		entry.state = state;
	}

	return entry;
}

function hasAllSides( values ) {
	return SIDES.every( ( side ) => values[ side ] );
}

function hasAllCorners( values ) {
	return CORNERS.every( ( corner ) => values[ corner ] );
}

function addCompositeAttributes( attributes ) {
	const composites = {};
	const buckets = {};

	Object.entries( attributes || {} ).forEach( ( [ attrName, attr ] ) => {
		if ( ! attr || attr.type === 'composite' ) {
			return;
		}
		if ( ! attr.element || ! attr.cssProperty || attr.outputsCSS === false ) {
			return;
		}
		if ( Array.isArray( attr.element ) ) {
			return;
		}

		const element = attr.element;
		const state = attr.state || 'base';
		const bucket = getBucket( buckets, element, state );

		const spacingMatch = /^(padding|margin)-(top|right|bottom|left)$/.exec( attr.cssProperty );
		if ( spacingMatch ) {
			const kind = spacingMatch[ 1 ];
			const side = spacingMatch[ 2 ];
			bucket[ kind ][ side ] = attrName;
			return;
		}

		const borderMatch = /^border-(top|right|bottom|left)-(width|style|color)$/.exec(
			attr.cssProperty
		);
		if ( borderMatch ) {
			const side = borderMatch[ 1 ];
			const part = borderMatch[ 2 ];
			if ( ! bucket.border[ side ] ) {
				bucket.border[ side ] = {};
			}
			bucket.border[ side ][ part ] = attrName;
			return;
		}

		const radiusMatch = /^border-(top-left|top-right|bottom-right|bottom-left)-radius$/.exec(
			attr.cssProperty
		);
		if ( radiusMatch ) {
			const corner = radiusMatch[ 1 ];
			bucket.radius[ corner ] = attrName;
		}
	} );

	Object.entries( buckets ).forEach( ( [ element, states ] ) => {
		Object.entries( states ).forEach( ( [ state, bucket ] ) => {
			const registerComposite = ( cssProperty, compositeOf ) => {
				const name = buildCompositeName( element, cssProperty, state );
				if ( attributes[ name ] || composites[ name ] ) {
					return;
				}
				composites[ name ] = createCompositeEntry( {
					element,
					state,
					cssProperty,
					compositeOf,
				} );
			};

			if ( hasAllSides( bucket.padding ) ) {
				registerComposite( 'padding', [
					bucket.padding.top,
					bucket.padding.right,
					bucket.padding.bottom,
					bucket.padding.left,
				] );
			}

			if ( hasAllSides( bucket.margin ) ) {
				registerComposite( 'margin', [
					bucket.margin.top,
					bucket.margin.right,
					bucket.margin.bottom,
					bucket.margin.left,
				] );
			}

			const parts = [ 'width', 'style', 'color' ];
			parts.forEach( ( part ) => {
				const values = {};
				SIDES.forEach( ( side ) => {
					values[ side ] = bucket.border[ side ]?.[ part ];
				} );

				if ( hasAllSides( values ) ) {
					registerComposite( `border-${ part }`, [
						values.top,
						values.right,
						values.bottom,
						values.left,
					] );
				}
			} );

			const borderSideComposites = {};
			SIDES.forEach( ( side ) => {
				const sideParts = bucket.border[ side ];
				if ( ! sideParts || ! sideParts.width || ! sideParts.style || ! sideParts.color ) {
					return;
				}

				const compositeName = buildCompositeName( element, `border-${ side }`, state );
				borderSideComposites[ side ] = compositeName;

				if ( ! attributes[ compositeName ] && ! composites[ compositeName ] ) {
					composites[ compositeName ] = createCompositeEntry( {
						element,
						state,
						cssProperty: `border-${ side }`,
						compositeOf: [ sideParts.width, sideParts.style, sideParts.color ],
					} );
				}
			} );

			if ( hasAllSides( borderSideComposites ) ) {
				registerComposite( 'border', [
					borderSideComposites.top,
					borderSideComposites.right,
					borderSideComposites.bottom,
					borderSideComposites.left,
				] );
			}

			if ( hasAllCorners( bucket.radius ) ) {
				registerComposite( 'border-radius', [
					bucket.radius[ 'top-left' ],
					bucket.radius[ 'top-right' ],
					bucket.radius[ 'bottom-right' ],
					bucket.radius[ 'bottom-left' ],
				] );
			}
		} );
	} );

	return {
		...attributes,
		...composites,
	};
}

module.exports = {
	addCompositeAttributes,
};
