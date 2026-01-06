/**
 * Schema Validator for Guttemberg Plus
 *
 * Validates schema JSON files before compilation to ensure:
 * - Valid JSON syntax
 * - Required fields are present
 * - Field values are correct types
 * - Themeable attributes have required CSS properties
 * - Non-themeable attributes have reason field
 *
 * Usage: npm run schema:validate
 *
 * @package
 * @since 1.0.0
 */

const fs = require( 'fs' );
const path = require( 'path' );

// ============================================================================
// Configuration
// ============================================================================

const ROOT_DIR = path.resolve( __dirname, '..' );
const SCHEMAS_DIR = path.join( ROOT_DIR, 'schemas' );

// Block types to validate
const BLOCKS = [ 'accordion', 'tabs', 'toc' ];

// Required top-level schema fields
const REQUIRED_SCHEMA_FIELDS = [
	'$schema',
	'title',
	'version',
	'description',
	'blockType',
	'blockName',
	'groups',
	'attributes',
];

// Required fields for each attribute
const REQUIRED_ATTRIBUTE_FIELDS = [
	'type',
	'default', // Can be null but must be present
	'group',
	'label',
	'description',
	'themeable',
];

// Required fields for themeable attributes
const REQUIRED_THEMEABLE_FIELDS = [
	'cssVar',
	'cssDefault', // Can be empty string for null defaults
];

// Valid attribute types
const VALID_TYPES = [ 'string', 'number', 'boolean', 'array', 'object' ];

// Valid group names
const VALID_GROUPS = [ 'colors', 'typography', 'borders', 'layout', 'icons', 'behavior' ];

// Valid reason values for non-themeable attributes
const VALID_REASONS = [ 'structural', 'content', 'behavioral' ];

// Controls that don't require cssVar/cssDefault (handled in JS/PHP not CSS)
const NON_CSS_CONTROLS = [ 'ToggleControl', 'IconPicker', 'SelectControl' ];

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate JSON syntax
 * @param filePath
 */
function validateJSONSyntax( filePath ) {
	const errors = [];

	try {
		const content = fs.readFileSync( filePath, 'utf8' );
		JSON.parse( content );
	} catch ( error ) {
		errors.push( {
			type: 'syntax',
			message: `Invalid JSON syntax: ${ error.message }`,
			location: error.message.match( /position (\d+)/ )
				? `position ${ error.message.match( /position (\d+)/ )[ 1 ] }`
				: 'unknown',
		} );
	}

	return errors;
}

/**
 * Validate schema structure
 * @param schema
 * @param blockType
 */
function validateSchemaStructure( schema, blockType ) {
	const errors = [];
	const warnings = [];

	// Check required top-level fields
	for ( const field of REQUIRED_SCHEMA_FIELDS ) {
		if ( ! ( field in schema ) ) {
			errors.push( {
				type: 'missing_field',
				message: `Missing required field: ${ field }`,
				location: 'root',
			} );
		}
	}

	// Validate blockType matches filename
	if ( schema.blockType && schema.blockType !== blockType ) {
		errors.push( {
			type: 'mismatch',
			message: `blockType "${ schema.blockType }" doesn't match filename "${ blockType }.json"`,
			location: 'root.blockType',
		} );
	}

	// Validate groups
	if ( schema.groups ) {
		for ( const [ groupName, groupDef ] of Object.entries( schema.groups ) ) {
			if ( ! VALID_GROUPS.includes( groupName ) ) {
				warnings.push( {
					type: 'unknown_group',
					message: `Unknown group name: ${ groupName }. Valid groups: ${ VALID_GROUPS.join(
						', '
					) }`,
					location: `groups.${ groupName }`,
				} );
			}

			if ( ! groupDef.title ) {
				errors.push( {
					type: 'missing_field',
					message: `Group "${ groupName }" missing required field: title`,
					location: `groups.${ groupName }`,
				} );
			}
		}
	}

	return { errors, warnings };
}

/**
 * Validate a single attribute
 * @param attrName
 * @param attr
 * @param blockType
 */
function validateAttribute( attrName, attr, blockType ) {
	const errors = [];
	const warnings = [];
	const location = `attributes.${ attrName }`;

	// Check required fields
	for ( const field of REQUIRED_ATTRIBUTE_FIELDS ) {
		if ( ! ( field in attr ) ) {
			errors.push( {
				type: 'missing_field',
				message: `Attribute "${ attrName }" missing required field: ${ field }`,
				location,
			} );
		}
	}

	// Validate type
	if ( attr.type && ! VALID_TYPES.includes( attr.type ) ) {
		errors.push( {
			type: 'invalid_value',
			message: `Attribute "${ attrName }" has invalid type: "${
				attr.type
			}". Valid types: ${ VALID_TYPES.join( ', ' ) }`,
			location: `${ location }.type`,
		} );
	}

	// Validate group
	if ( attr.group && ! VALID_GROUPS.includes( attr.group ) ) {
		warnings.push( {
			type: 'unknown_group',
			message: `Attribute "${ attrName }" references unknown group: "${ attr.group }"`,
			location: `${ location }.group`,
		} );
	}

	// Validate default value type matches declared type
	if ( 'default' in attr && attr.default !== null ) {
		const actualType = Array.isArray( attr.default ) ? 'array' : typeof attr.default;
		const expectedType = attr.type;

		if ( actualType !== expectedType ) {
			// Special case: numbers stored as strings (e.g., "600" for font-weight)
			if ( expectedType === 'string' && actualType === 'number' ) {
				warnings.push( {
					type: 'type_coercion',
					message: `Attribute "${ attrName }" default is number but type is string (may need conversion)`,
					location: `${ location }.default`,
				} );
			} else {
				errors.push( {
					type: 'type_mismatch',
					message: `Attribute "${ attrName }" default type (${ actualType }) doesn't match declared type (${ expectedType })`,
					location: `${ location }.default`,
				} );
			}
		}
	}

	// Validate themeable attributes
	if ( attr.themeable === true ) {
		// Some controls don't need CSS variables (handled in JS/PHP)
		const isNonCSSControl = NON_CSS_CONTROLS.includes( attr.control );

		// Attributes with outputsCSS: false don't need CSS fields
		const outputsCSS = attr.outputsCSS !== false; // Default to true if not specified

		// Check for required themeable fields (warning only for non-CSS controls or non-CSS output)
		if ( ! ( 'cssVar' in attr ) ) {
			if ( isNonCSSControl || ! outputsCSS ) {
				// Optional: no warning for non-CSS controls or non-CSS output
			} else {
				errors.push( {
					type: 'missing_field',
					message: `Themeable attribute "${ attrName }" missing required field: cssVar`,
					location,
				} );
			}
		}

		if ( ! ( 'cssDefault' in attr ) ) {
			if ( isNonCSSControl || ! outputsCSS ) {
				// Optional: no warning for non-CSS controls or non-CSS output
			} else {
				errors.push( {
					type: 'missing_field',
					message: `Themeable attribute "${ attrName }" missing required field: cssDefault`,
					location,
				} );
			}
		}

		// Only validate CSS-related fields if the attribute outputs CSS
		if ( outputsCSS ) {
			// Validate cssVar format (should be kebab-case without -- prefix)
			if ( attr.cssVar ) {
				if ( attr.cssVar.startsWith( '--' ) ) {
					errors.push( {
						type: 'invalid_format',
						message: `Attribute "${ attrName }" cssVar should not start with "--": "${ attr.cssVar }"`,
						location: `${ location }.cssVar`,
					} );
				}

				if ( ! /^[a-z0-9-]+$/.test( attr.cssVar ) ) {
					warnings.push( {
						type: 'invalid_format',
						message: `Attribute "${ attrName }" cssVar should be lowercase kebab-case: "${ attr.cssVar }"`,
						location: `${ location }.cssVar`,
					} );
				}
			}

			// Validate cssDefault format (should be complete CSS declaration)
			if ( attr.cssDefault && attr.cssDefault !== '' ) {
				if ( ! attr.cssDefault.startsWith( '--' ) ) {
					errors.push( {
						type: 'invalid_format',
						message: `Attribute "${ attrName }" cssDefault should start with "--": "${ attr.cssDefault }"`,
						location: `${ location }.cssDefault`,
					} );
				}

				if ( ! attr.cssDefault.includes( ':' ) ) {
					errors.push( {
						type: 'invalid_format',
						message: `Attribute "${ attrName }" cssDefault should contain ":": "${ attr.cssDefault }"`,
						location: `${ location }.cssDefault`,
					} );
				}
			}

			// Validate cssProperty makes sense for attribute name
			if ( attr.cssProperty ) {
				const propertyValidation = validateCssPropertyMatch( attrName, attr.cssProperty );
				if ( ! propertyValidation.valid ) {
					warnings.push( {
						type: 'suspicious_cssProperty',
						message: `Attribute "${ attrName }" has suspicious cssProperty: "${ attr.cssProperty }". ${ propertyValidation.reason }`,
						location: `${ location }.cssProperty`,
						suggestion: propertyValidation.suggestion,
					} );
				}
			}
		}

		// Recommend control field for themeable attributes
		if ( ! attr.control ) {
			warnings.push( {
				type: 'missing_recommendation',
				message: `Themeable attribute "${ attrName }" should have a "control" field for UI rendering`,
				location,
			} );
		}
	}

	// Validate non-themeable attributes
	if ( attr.themeable === false ) {
		if ( ! attr.reason ) {
			errors.push( {
				type: 'missing_field',
				message: `Non-themeable attribute "${ attrName }" missing required field: reason`,
				location,
			} );
		} else if ( ! VALID_REASONS.includes( attr.reason ) ) {
			warnings.push( {
				type: 'unknown_reason',
				message: `Attribute "${ attrName }" has unknown reason: "${
					attr.reason
				}". Valid reasons: ${ VALID_REASONS.join( ', ' ) }`,
				location: `${ location }.reason`,
			} );
		}

		// Warn if cssVar is present on non-themeable attribute (unless it has outputsCSS: false)
		if ( attr.cssVar && attr.outputsCSS !== false ) {
			warnings.push( {
				type: 'unnecessary_field',
				message: `Non-themeable attribute "${ attrName }" has cssVar but is not themeable (add outputsCSS: false if this is intentional)`,
				location,
			} );
		}
	}

	// Validate options field
	if ( attr.options ) {
		if ( ! Array.isArray( attr.options ) ) {
			errors.push( {
				type: 'invalid_type',
				message: `Attribute "${ attrName }" options must be an array`,
				location: `${ location }.options`,
			} );
		} else if ( attr.options.length === 0 ) {
			warnings.push( {
				type: 'empty_options',
				message: `Attribute "${ attrName }" has empty options array`,
				location: `${ location }.options`,
			} );
		}
	}

	// Validate control-specific properties
	if ( attr.control === 'RangeControl' ) {
		if ( attr.min === undefined ) {
			warnings.push( {
				type: 'missing_recommendation',
				message: `RangeControl attribute "${ attrName }" should have "min" property`,
				location,
			} );
		}
		if ( attr.max === undefined ) {
			warnings.push( {
				type: 'missing_recommendation',
				message: `RangeControl attribute "${ attrName }" should have "max" property`,
				location,
			} );
		}
	}

	return { errors, warnings };
}

/**
 * Validate all attributes in schema
 * @param schema
 * @param blockType
 */
function validateAttributes( schema, blockType ) {
	const allErrors = [];
	const allWarnings = [];

	if ( ! schema.attributes || typeof schema.attributes !== 'object' ) {
		allErrors.push( {
			type: 'missing_field',
			message: 'Schema missing or invalid "attributes" field',
			location: 'root',
		} );
		return { errors: allErrors, warnings: allWarnings };
	}

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		const { errors, warnings } = validateAttribute( attrName, attr, blockType );
		allErrors.push( ...errors );
		allWarnings.push( ...warnings );
	}

	return { errors: allErrors, warnings: allWarnings };
}

/**
 * Validate cross-references (groups, options, etc.)
 * @param schema
 */
function validateCrossReferences( schema ) {
	const errors = [];
	const warnings = [];

	if ( ! schema.attributes || ! schema.groups ) {
		return { errors, warnings };
	}

	// Check that all attribute groups exist
	const validGroups = Object.keys( schema.groups );

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if ( attr.group && ! validGroups.includes( attr.group ) ) {
			errors.push( {
				type: 'invalid_reference',
				message: `Attribute "${ attrName }" references undefined group: "${ attr.group }"`,
				location: `attributes.${ attrName }.group`,
			} );
		}
	}

	// Check for duplicate cssVar values (potential bug)
	const cssVarMap = new Map();
	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if ( attr.cssVar ) {
			if ( cssVarMap.has( attr.cssVar ) ) {
				warnings.push( {
					type: 'duplicate_cssVar',
					message: `cssVar "${ attr.cssVar }" used by both "${ cssVarMap.get(
						attr.cssVar
					) }" and "${ attrName }"`,
					location: `attributes.${ attrName }.cssVar`,
				} );
			} else {
				cssVarMap.set( attr.cssVar, attrName );
			}
		}
	}

	return { errors, warnings };
}

/**
 * Validate that cssProperty matches the attribute name/purpose
 * @param attrName
 * @param cssProperty
 */
function validateCssPropertyMatch( attrName, cssProperty ) {
	const name = attrName.toLowerCase();
	const prop = cssProperty.toLowerCase();

	// Common mismatches
	const mismatches = [
		{ pattern: /color$/i, expected: 'color', actual: prop, notExpected: [ 'border-color' ] },
		{
			pattern: /bordercolor$/i,
			expected: 'border-color',
			actual: prop,
			notExpected: [ 'color' ],
		},
		{
			pattern: /backgroundcolor$/i,
			expected: 'background-color',
			actual: prop,
			notExpected: [ 'color' ],
		},
		{ pattern: /fontsize$/i, expected: 'font-size', actual: prop, notExpected: [] },
		{ pattern: /padding$/i, expected: 'padding', actual: prop, notExpected: [] },
	];

	for ( const mismatch of mismatches ) {
		if ( mismatch.pattern.test( name ) ) {
			// If attribute matches pattern, check if cssProperty is correct
			if ( prop !== mismatch.expected ) {
				// Extra check: if it's in the notExpected list, it's definitely wrong
				if ( mismatch.notExpected.includes( prop ) ) {
					return {
						valid: false,
						reason: `Attribute ending in "${
							name.match( mismatch.pattern )[ 0 ]
						}" should use "${ mismatch.expected }", not "${ prop }"`,
						suggestion: mismatch.expected,
					};
				}
			}
			break;
		}
	}

	return { valid: true };
}

/**
 * Validate a single schema file
 * @param blockType
 */
function validateSchema( blockType ) {
	const filePath = path.join( SCHEMAS_DIR, `${ blockType }.json` );
	const results = {
		blockType,
		filePath,
		errors: [],
		warnings: [],
		valid: true,
	};

	console.log( `\n  Validating ${ blockType }.json...` );

	// Check file exists
	if ( ! fs.existsSync( filePath ) ) {
		results.errors.push( {
			type: 'file_not_found',
			message: `Schema file not found: ${ filePath }`,
			location: 'filesystem',
		} );
		results.valid = false;
		return results;
	}

	// Validate JSON syntax
	const syntaxErrors = validateJSONSyntax( filePath );
	if ( syntaxErrors.length > 0 ) {
		results.errors.push( ...syntaxErrors );
		results.valid = false;
		return results;
	}

	// Parse schema
	const content = fs.readFileSync( filePath, 'utf8' );
	const schema = JSON.parse( content );

	// Validate structure
	const structureResults = validateSchemaStructure( schema, blockType );
	results.errors.push( ...structureResults.errors );
	results.warnings.push( ...structureResults.warnings );

	// Validate attributes
	const attrResults = validateAttributes( schema, blockType );
	results.errors.push( ...attrResults.errors );
	results.warnings.push( ...attrResults.warnings );

	// Validate cross-references
	const refResults = validateCrossReferences( schema );
	results.errors.push( ...refResults.errors );
	results.warnings.push( ...refResults.warnings );

	// Summary for this schema
	const attrCount = Object.keys( schema.attributes || {} ).length;
	const themeableCount = Object.values( schema.attributes || {} ).filter(
		( a ) => a.themeable
	).length;

	console.log( `    Attributes: ${ attrCount } total, ${ themeableCount } themeable` );
	console.log( `    Errors: ${ results.errors.length }` );
	console.log( `    Warnings: ${ results.warnings.length }` );

	results.valid = results.errors.length === 0;
	return results;
}

// ============================================================================
// Main Validator
// ============================================================================

async function validate() {
	console.log( '\n========================================' );
	console.log( '  Guttemberg Plus Schema Validator' );
	console.log( '========================================' );

	const startTime = Date.now();
	const allResults = [];

	// Validate each schema
	for ( const blockType of BLOCKS ) {
		const result = validateSchema( blockType );
		allResults.push( result );
	}

	// Aggregate results
	const totalErrors = allResults.reduce( ( sum, r ) => sum + r.errors.length, 0 );
	const totalWarnings = allResults.reduce( ( sum, r ) => sum + r.warnings.length, 0 );
	const allValid = allResults.every( ( r ) => r.valid );

	console.log( '\n========================================' );
	console.log( '  Validation Summary' );
	console.log( '========================================\n' );

	// Print errors
	if ( totalErrors > 0 ) {
		console.log( '  ERRORS:\n' );
		for ( const result of allResults ) {
			if ( result.errors.length > 0 ) {
				console.log( `    ${ result.blockType }.json:` );
				for ( const error of result.errors ) {
					console.log( `      - [${ error.type }] ${ error.message }` );
					if ( error.location ) {
						console.log( `        at: ${ error.location }` );
					}
				}
				console.log( '' );
			}
		}
	}

	// Print warnings
	if ( totalWarnings > 0 ) {
		console.log( '  WARNINGS:\n' );
		for ( const result of allResults ) {
			if ( result.warnings.length > 0 ) {
				console.log( `    ${ result.blockType }.json:` );
				for ( const warning of result.warnings ) {
					console.log( `      - [${ warning.type }] ${ warning.message }` );
					if ( warning.location ) {
						console.log( `        at: ${ warning.location }` );
					}
				}
				console.log( '' );
			}
		}
	}

	// Final summary
	const elapsed = Date.now() - startTime;
	console.log( '========================================' );
	console.log( `  Schemas validated: ${ allResults.length }` );
	console.log( `  Total errors: ${ totalErrors }` );
	console.log( `  Total warnings: ${ totalWarnings }` );
	console.log( `  Status: ${ allValid ? 'PASSED' : 'FAILED' }` );
	console.log( `  Time: ${ elapsed }ms` );
	console.log( '========================================\n' );

	if ( ! allValid ) {
		console.log( '  Fix the errors above and run validation again.\n' );
		process.exit( 1 );
	}

	console.log( '  All schemas are valid!\n' );
	return allResults;
}

// Run validator
validate().catch( ( error ) => {
	console.error( 'Fatal error:', error );
	process.exit( 1 );
} );
