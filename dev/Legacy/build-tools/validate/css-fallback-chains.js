/**
 * CSS Fallback Chain Validator
 *
 * Validates that decomposed longhand properties have proper fallback chains
 * to their shorthand properties in generated _variables.scss files.
 *
 * This prevents the critical bug where undefined side-specific CSS variables
 * would override valid shorthand values, causing properties to not render.
 *
 * @package
 * @since 1.0.0
 */

const fs = require( 'fs' );
const path = require( 'path' );

// ANSI color codes
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	cyan: '\x1b[36m',
	dim: '\x1b[2m',
};

const ROOT_DIR = path.resolve( __dirname, '../..' );
const BLOCKS = [ 'accordion', 'tabs', 'toc' ];

// Decomposable properties that should have fallback chains
const DECOMPOSABLE_PROPERTIES = {
	// Sides (top/right/bottom/left)
	'border-width': true,
	'border-color': true,
	'border-style': true,
	padding: true,
	margin: true,

	// Corners (top-left/top-right/bottom-right/bottom-left)
	'border-radius': true,
};

/**
 * Parse CSS var() calls and check for fallback chains
 * @param varValue
 */
function parseCssVar( varValue ) {
	// Match: var(--main-var, var(--fallback-var, default))
	const matches = varValue.match( /var\(([^,)]+)(?:,\s*(.+))?\)/ );
	if ( ! matches ) {
		return null;
	}

	const mainVar = matches[ 1 ].trim();
	const fallback = matches[ 2 ] ? matches[ 2 ].trim() : null;

	return { mainVar, fallback };
}

/**
 * Check if a longhand property has proper fallback chain
 * @param property
 * @param value
 * @param baseProperty
 * @param blockType
 * @param hasShorthand
 */
function validateLonghandFallback( property, value, baseProperty, blockType, hasShorthand ) {
	const parsed = parseCssVar( value );
	if ( ! parsed ) {
		return {
			valid: false,
			error: `Invalid var() syntax: ${ value }`,
		};
	}

	// Extract the variable name parts
	const varMatch = parsed.mainVar.match(
		/--([a-z]+)-([a-z-]+?)-(top|right|bottom|left|top-left|top-right|bottom-left|bottom-right)$/
	);
	if ( ! varMatch ) {
		// Not a decomposed property (or complex pattern we don't validate)
		return { valid: true };
	}

	const [ , block, baseProp, side ] = varMatch;
	const expectedShorthand = `--${ block }-${ baseProp }`;

	// CompactMargin special case: margin-top/bottom without shorthand margin
	// These have explicit fallbacks and intentionally omit the shorthand
	if (
		baseProperty === 'margin' &&
		! hasShorthand &&
		parsed.fallback &&
		! parsed.fallback.includes( 'var(' )
	) {
		return { valid: true }; // CompactMargin pattern is valid
	}

	// Check if fallback exists
	if ( ! parsed.fallback ) {
		return {
			valid: false,
			error: `Missing fallback chain. Expected: var(${ parsed.mainVar }, var(${ expectedShorthand }, <default>))`,
		};
	}

	// Check if fallback contains the shorthand variable
	if ( ! parsed.fallback.includes( expectedShorthand ) ) {
		return {
			valid: false,
			error: `Fallback doesn't chain to shorthand "${ expectedShorthand }". Got: ${ parsed.fallback }`,
		};
	}

	return { valid: true };
}

/**
 * Validate fallback chains in a generated SCSS file
 * @param blockType
 */
function validateScssFile( blockType ) {
	const scssPath = path.join( ROOT_DIR, 'css', 'generated', `${ blockType }_variables.scss` );

	if ( ! fs.existsSync( scssPath ) ) {
		return {
			file: scssPath,
			exists: false,
			errors: [],
		};
	}

	const content = fs.readFileSync( scssPath, 'utf8' );
	const lines = content.split( '\n' );
	const errors = [];

	// Track which shorthand properties exist in each selector block
	const shorthandProps = new Set();
	let currentSelector = null;

	// First pass: detect shorthand properties in each block
	for ( const line of lines ) {
		if ( line.match( /^[.#\[]/ ) || line.includes( '{' ) ) {
			// New selector or block start
			currentSelector = line;
			shorthandProps.clear();
		}

		const shorthandMatch = line.match(
			/^\s*(border-width|border-color|border-style|border-radius|padding|margin)\s*:/
		);
		if ( shorthandMatch ) {
			shorthandProps.add( shorthandMatch[ 1 ] );
		}
	}

	// Second pass: validate longhand properties
	currentSelector = null;
	const currentBlockShorthands = new Set();

	// Match CSS property declarations
	const propertyRegex =
		/^\s*(border-(?:top|right|bottom|left)-(?:width|color|style|radius)|padding-(?:top|right|bottom|left)|margin-(?:top|right|bottom))\s*:\s*(.+?);/;

	for ( let i = 0; i < lines.length; i++ ) {
		const line = lines[ i ];

		// Track current block and its shorthands
		if ( line.match( /^[.#\[]/ ) || line.includes( '{' ) ) {
			currentSelector = line;
			currentBlockShorthands.clear();
		}

		const shorthandMatch = line.match(
			/^\s*(border-width|border-color|border-style|border-radius|padding|margin)\s*:/
		);
		if ( shorthandMatch ) {
			currentBlockShorthands.add( shorthandMatch[ 1 ] );
		}

		const match = line.match( propertyRegex );
		if ( match ) {
			const [ , property, value ] = match;

			// Extract base property (e.g., "border-width" from "border-top-width")
			let baseProperty = property;
			if ( property.startsWith( 'border-' ) ) {
				const parts = property.split( '-' );
				if ( parts.length >= 3 ) {
					// border-top-width → border-width
					baseProperty = `${ parts[ 0 ] }-${ parts[ 2 ] }`;
					if ( property.includes( '-radius' ) ) {
						baseProperty = 'border-radius';
					}
				}
			} else if ( property.includes( '-' ) ) {
				// padding-top → padding
				baseProperty = property.split( '-' )[ 0 ];
			}

			if ( DECOMPOSABLE_PROPERTIES[ baseProperty ] ) {
				const hasShorthand = currentBlockShorthands.has( baseProperty );
				const result = validateLonghandFallback(
					property,
					value,
					baseProperty,
					blockType,
					hasShorthand
				);
				if ( ! result.valid ) {
					errors.push( {
						line: i + 1,
						property,
						error: result.error,
						value,
					} );
				}
			}
		}
	}

	return {
		file: scssPath,
		exists: true,
		errors,
	};
}

/**
 * Main validation function
 */
function validate() {
	console.log( `${ colors.cyan }CSS Fallback Chain Validation${ colors.reset }` );
	console.log(
		`${ colors.dim }Checking decomposed properties have proper fallback chains${ colors.reset }\n`
	);

	let totalErrors = 0;
	const results = [];

	for ( const blockType of BLOCKS ) {
		const result = validateScssFile( blockType );
		results.push( result );

		if ( ! result.exists ) {
			console.log(
				`${ colors.yellow }⚠${ colors.reset }  ${ blockType }: File not found (${ result.file })`
			);
			continue;
		}

		if ( result.errors.length === 0 ) {
			console.log( `${ colors.green }✓${ colors.reset } ${ blockType }` );
		} else {
			console.log(
				`${ colors.red }✗${ colors.reset } ${ blockType }: ${ result.errors.length } error(s)`
			);
			totalErrors += result.errors.length;

			for ( const error of result.errors ) {
				console.log(
					`  ${ colors.dim }Line ${ error.line }:${ colors.reset } ${ error.property }`
				);
				console.log( `    ${ colors.red }${ error.error }${ colors.reset }` );
				console.log( `    ${ colors.dim }Current: ${ error.value }${ colors.reset }` );
			}
		}
	}

	console.log();

	if ( totalErrors > 0 ) {
		console.log(
			`${ colors.red }❌ Validation failed: ${ totalErrors } error(s) found${ colors.reset }`
		);
		console.log(
			`\n${ colors.dim }Decomposed longhand properties MUST have fallback chains to prevent broken rendering.`
		);
		console.log(
			`When a side-specific CSS variable is undefined, it must fall back to the shorthand value.${ colors.reset }\n`
		);
		return false;
	}

	console.log(
		`${ colors.green }✓ All fallback chains validated successfully${ colors.reset }\n`
	);
	return true;
}

// Run validation
const success = validate();
process.exit( success ? 0 : 1 );
