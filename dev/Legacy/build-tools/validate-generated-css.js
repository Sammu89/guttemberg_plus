#!/usr/bin/env node
/**
 * Generated CSS Output Validator
 *
 * Ensures responsive attributes emit device-specific vars in generated CSS,
 * and decomposable controls emit side/corner vars for longhand overrides.
 */

const fs = require( 'fs' );
const path = require( 'path' );

const ROOT = path.resolve( __dirname, '..' );
const BLOCKS = [ 'accordion', 'tabs', 'toc' ];

const DECOMPOSE_CONTROLS = new Set( [
	'CompactPadding',
	'CompactMargin',
	'BorderPanel',
	'BorderWidthControl',
	'CompactBorderRadius',
	'BorderRadiusControl',
] );

const DECOMPOSE_SIDE_PROPERTIES = new Set( [
	'padding',
	'margin',
	'border-width',
	'border-color',
	'border-style',
	'scroll-padding',
	'scroll-margin',
] );

const DECOMPOSE_CORNER_PROPERTIES = new Set( [ 'border-radius' ] );

const LONGHAND_SIDE_REGEX = /-(top|right|bottom|left)(-|$)/;

function isLonghandProperty( cssProperty ) {
	if ( ! cssProperty ) {
		return false;
	}
	return LONGHAND_SIDE_REGEX.test( cssProperty );
}

function loadJson( filePath ) {
	return JSON.parse( fs.readFileSync( filePath, 'utf8' ) );
}

function cssVarToken( cssVar ) {
	const base = cssVar.startsWith( '--' ) ? cssVar.slice( 2 ) : cssVar;
	return `--${ base }`;
}

function hasToken( content, token ) {
	return content.includes( token );
}

function expectedSideVars( cssVar, control, cssProperty ) {
	const base = cssVarToken( cssVar );

	if ( isLonghandProperty( cssProperty ) || cssProperty === 'border' ) {
		return [];
	}

	if ( control === 'CompactMargin' ) {
		return [ `${ base }-top`, `${ base }-bottom` ];
	}

	if ( DECOMPOSE_CORNER_PROPERTIES.has( cssProperty ) ) {
		return [
			`${ base }-top-left`,
			`${ base }-top-right`,
			`${ base }-bottom-right`,
			`${ base }-bottom-left`,
		];
	}

	if ( DECOMPOSE_SIDE_PROPERTIES.has( cssProperty ) ) {
		return [ `${ base }-top`, `${ base }-right`, `${ base }-bottom`, `${ base }-left` ];
	}

	return [];
}

function expectedResponsiveSideVars( cssVar, control, cssProperty ) {
	const baseVars = expectedSideVars( cssVar, control, cssProperty );
	if ( baseVars.length === 0 ) {
		return [];
	}
	const tablet = baseVars.map( ( token ) => `${ token }-tablet` );
	const mobile = baseVars.map( ( token ) => `${ token }-mobile` );
	return [ ...tablet, ...mobile ];
}

function validateBlock( blockType ) {
	const schemaPath = path.join( ROOT, 'schemas', `${ blockType }.json` );
	const cssPath = path.join( ROOT, 'css', 'generated', `${ blockType }_variables.scss` );

	if ( ! fs.existsSync( schemaPath ) ) {
		return {
			errors: [ { message: `Missing schema file: ${ schemaPath }` } ],
			warnings: [],
		};
	}

	if ( ! fs.existsSync( cssPath ) ) {
		return {
			errors: [
				{ message: `Missing generated CSS: ${ cssPath }. Run npm run schema:build.` },
			],
			warnings: [],
		};
	}

	const schema = loadJson( schemaPath );
	const cssContent = fs.readFileSync( cssPath, 'utf8' );
	const errors = [];
	const warnings = [];

	Object.entries( schema.attributes || {} ).forEach( ( [ attrName, attr ] ) => {
		if ( ! attr.cssVar || attr.outputsCSS === false ) {
			return;
		}

		const cssVar = cssVarToken( attr.cssVar );

		if ( attr.responsive === true ) {
			if ( attr.control !== 'CompactMargin' ) {
				const hasTablet = hasToken( cssContent, `${ cssVar }-tablet` );
				const hasMobile = hasToken( cssContent, `${ cssVar }-mobile` );
				if ( ! hasTablet || ! hasMobile ) {
					errors.push( {
						message:
							`Responsive setting "${ attrName }" is missing device vars in generated CSS. ` +
							`Expected ${ cssVar }-tablet and ${ cssVar }-mobile to appear in ${ blockType }_variables.scss.`,
						fix: `Rebuild schema output (npm run schema:build) or ensure cssProperty/appliesTo are correct.`,
					} );
				}
			}
		}

		const isDecomposable = DECOMPOSE_CONTROLS.has( attr.control );
		if ( isDecomposable ) {
			if ( ! attr.cssProperty ) {
				warnings.push( {
					message:
						`Setting "${ attrName }" uses ${ attr.control } but has no cssProperty. ` +
						`Decomposition cannot be applied.`,
					fix: `Add cssProperty to ${ attrName } in schemas/${ blockType }.json.`,
				} );
				return;
			}

			if ( isLonghandProperty( attr.cssProperty ) || attr.cssProperty === 'border' ) {
				return;
			}

			const expected = expectedSideVars( attr.cssVar, attr.control, attr.cssProperty );
			if ( expected.length === 0 ) {
				warnings.push( {
					message:
						`Setting "${ attrName }" uses ${ attr.control } with cssProperty "${ attr.cssProperty }". ` +
						`No decomposition rules are defined for that property.`,
					fix: `Use a decomposable cssProperty (padding/margin/border-*/border-radius) or update the validator.`,
				} );
				return;
			}

			const missing = expected.filter( ( token ) => ! hasToken( cssContent, token ) );
			if ( missing.length > 0 ) {
				errors.push( {
					message: `Setting "${ attrName }" should emit side vars but they are missing in generated CSS: ${ missing.join(
						', '
					) }.`,
					fix: `Run npm run schema:build or ensure cssProperty is correct.`,
				} );
			}

			if ( attr.responsive === true ) {
				const responsiveExpected = expectedResponsiveSideVars(
					attr.cssVar,
					attr.control,
					attr.cssProperty
				);
				const responsiveMissing = responsiveExpected.filter(
					( token ) => ! hasToken( cssContent, token )
				);
				if ( responsiveMissing.length > 0 ) {
					errors.push( {
						message:
							`Responsive setting "${ attrName }" should emit device side vars but they are missing in generated CSS: ` +
							`${ responsiveMissing.join( ', ' ) }.`,
						fix: `Run npm run schema:build or ensure cssProperty/appliesTo are correct.`,
					} );
				}
			}
		}
	} );

	return { errors, warnings };
}

function main() {
	const allErrors = [];
	const allWarnings = [];

	BLOCKS.forEach( ( blockType ) => {
		const { errors, warnings } = validateBlock( blockType );
		errors.forEach( ( err ) => allErrors.push( { blockType, ...err } ) );
		warnings.forEach( ( warn ) => allWarnings.push( { blockType, ...warn } ) );
	} );

	if ( allErrors.length > 0 ) {
		console.error( 'Generated CSS validation failed.\n' );
		allErrors.forEach( ( err, index ) => {
			console.error( `${ index + 1 }) Block: ${ err.blockType }` );
			console.error( `   Problem: ${ err.message }` );
			if ( err.fix ) {
				console.error( `   Fix: ${ err.fix }` );
			}
			console.error( '' );
		} );
		process.exit( 1 );
	}

	console.log( '✓ Generated CSS output looks consistent.' );

	if ( allWarnings.length > 0 ) {
		console.log( '\nWarnings:' );
		allWarnings.forEach( ( warn, index ) => {
			console.log( `${ index + 1 }) Block: ${ warn.blockType }` );
			console.log( `   Note: ${ warn.message }` );
			if ( warn.fix ) {
				console.log( `   Fix: ${ warn.fix }` );
			}
			console.log( '' );
		} );
	}
}

main();
