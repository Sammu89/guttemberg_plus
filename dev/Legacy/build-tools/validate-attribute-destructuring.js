/**
 * Attribute Destructuring Validator
 *
 * Catches runtime errors caused by using schema attributes that aren't
 * properly destructured from the `attributes` object in edit.js.
 *
 * Problem it solves:
 * - Schema adds new attribute `enableHierarchicalIndent`
 * - Code uses it: `if (!enableHierarchicalIndent) { ... }`
 * - But it's never destructured: `const { ... } = attributes;`
 * - Result: ReferenceError at runtime
 *
 * This validator catches those issues at build time.
 *
 * @package
 * @since 1.0.0
 */

const fs = require( 'fs' );
const path = require( 'path' );

const ROOT = path.resolve( __dirname, '..' );
const BLOCKS = [ 'accordion', 'tabs', 'toc' ];

const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	gray: '\x1b[90m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

/**
 * Load schema attributes for a block
 * @param blockType
 */
function loadSchemaAttributes( blockType ) {
	const schemaPath = path.join( ROOT, `schemas/${ blockType }.json` );
	if ( ! fs.existsSync( schemaPath ) ) {
		return new Set();
	}
	const schema = JSON.parse( fs.readFileSync( schemaPath, 'utf8' ) );
	return new Set( Object.keys( schema.attributes || {} ) );
}

/**
 * Find the main attributes destructuring statement in edit.js
 * Looks for patterns like:
 *   const { attr1, attr2, ... } = attributes;
 *   const { attr1, attr2 } = attributes;
 *   let { attr1 } = attributes;
 * @param code
 */
function findDestructuredAttributes( code ) {
	const destructured = new Set();

	// Pattern: const/let/var { ... } = attributes;
	// This regex captures multi-line destructuring
	const destructureRegex = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*attributes\s*[;,]/g;

	let match;
	while ( ( match = destructureRegex.exec( code ) ) !== null ) {
		const innerContent = match[ 1 ];

		// Extract attribute names from the destructured object
		// Handles: attr, attr = default, attr: alias, attr: alias = default
		const attrPattern = /(\w+)(?:\s*:\s*\w+)?(?:\s*=\s*[^,}]+)?/g;
		let attrMatch;
		while ( ( attrMatch = attrPattern.exec( innerContent ) ) !== null ) {
			const attrName = attrMatch[ 1 ].trim();
			if ( attrName && attrName !== 'undefined' ) {
				destructured.add( attrName );
			}
		}
	}

	return destructured;
}

/**
 * Common names that appear in code but aren't attribute references
 * These cause false positives when they match schema attribute names
 */
const FALSE_POSITIVE_NAMES = new Set( [
	'title', // JSX prop: <PanelBody title={...} />
	'label', // JSX prop: <SelectControl label={...} />
	'value', // JSX prop: <input value={...} />
	'options', // JSX prop: <SelectControl options={...} />
	'icon', // JSX prop: <Icon icon={...} />
	'disabled', // JSX prop: <Button disabled={...} />
	'type', // Common variable name
	'name', // Common variable name
	'id', // Common variable name
	'index', // Common variable name
	'key', // React prop
	'className', // React prop
	'style', // React prop
	'children', // React prop
	'onClick', // Event handler
	'onChange', // Event handler
] );

/**
 * Find all locally declared variables in the code
 * These shouldn't trigger false positives even if they match schema attr names
 * @param code
 */
function findLocalDeclarations( code ) {
	const locals = new Set();

	// Pattern 1: const/let/var name = ...
	const simpleDecl = /(?:const|let|var)\s+(\w+)\s*=/g;
	let match;
	while ( ( match = simpleDecl.exec( code ) ) !== null ) {
		locals.add( match[ 1 ] );
	}

	// Pattern 2: Destructuring from non-attributes (handles multi-line)
	// const { a, b, c } = something
	// const {\n  a,\n  b\n} = something
	const destructurePattern = /(?:const|let|var)\s*\{([\s\S]*?)\}\s*=\s*(?!attributes\b)/g;
	while ( ( match = destructurePattern.exec( code ) ) !== null ) {
		const inner = match[ 1 ];
		// Extract names from destructuring (handles newlines, nested objects, defaults)
		// Split by comma but be careful with nested structures
		const parts = inner.split( /,(?![^{]*})/ );
		parts.forEach( ( part ) => {
			// Handle: name, name: alias, name = default, handlers: { ... }
			const cleaned = part.trim();
			// Get the first identifier (before : or =)
			const nameMatch = cleaned.match( /^(\w+)/ );
			if ( nameMatch ) {
				locals.add( nameMatch[ 1 ] );
			}
		} );
	}

	return locals;
}

/**
 * Find schema attributes used directly in code (not via attributes.xxx)
 * These need to be destructured first
 * @param code
 * @param schemaAttributes
 */
function findUsedAttributes( code, schemaAttributes ) {
	const used = new Map(); // attrName -> [{ line, context }]

	// First, find all locally declared variables (to exclude them)
	const localVars = findLocalDeclarations( code );

	const lines = code.split( '\n' );

	for ( let i = 0; i < lines.length; i++ ) {
		const line = lines[ i ];
		const lineNum = i + 1;

		// Skip comments
		if ( line.trim().startsWith( '//' ) || line.trim().startsWith( '*' ) ) {
			continue;
		}

		// Skip import statements
		if ( line.includes( 'import ' ) || line.includes( 'from ' ) ) {
			continue;
		}

		// Skip the destructuring line itself
		if ( /(?:const|let|var)\s*\{[^}]+\}\s*=\s*attributes/.test( line ) ) {
			continue;
		}

		// Skip function declarations
		if ( /function\s+\w*\s*\([^)]*\)/.test( line ) ) {
			continue;
		}

		// Skip string literals and comments
		const cleanLine = line
			.replace( /\/\/.*$/, '' ) // Remove line comments
			.replace( /'[^']*'/g, '""' ) // Replace single-quoted strings
			.replace( /"[^"]*"/g, '""' ) // Replace double-quoted strings
			.replace( /`[^`]*`/g, '""' ); // Replace template literals (simple)

		for ( const attr of schemaAttributes ) {
			// Skip very short attribute names to avoid false positives
			if ( attr.length < 4 ) {
				continue;
			}

			// Skip common false positive names
			if ( FALSE_POSITIVE_NAMES.has( attr ) ) {
				continue;
			}

			// Skip if this is a locally declared variable
			if ( localVars.has( attr ) ) {
				continue;
			}

			// Skip if this looks like a JSX prop assignment: attr={
			if ( new RegExp( `\\b${ attr }\\s*=\\s*\\{` ).test( cleanLine ) ) {
				continue;
			}

			// Skip if this is a local const/let/var declaration: const attr =
			if ( new RegExp( `(?:const|let|var)\\s+${ attr }\\s*=` ).test( cleanLine ) ) {
				continue;
			}

			// Skip if inside a destructuring pattern: { attr } or { attr, other }
			if ( new RegExp( `\\{[^}]*\\b${ attr }\\b[^}]*\\}\\s*=` ).test( cleanLine ) ) {
				continue;
			}

			// Pattern: standalone attribute name (not part of a larger word)
			// Match: enableHierarchicalIndent but not attributes.enableHierarchicalIndent
			// Match: !enableHierarchicalIndent, (enableHierarchicalIndent, enableHierarchicalIndent)
			const standalonePattern = new RegExp( `(?<![.\\w])${ attr }(?![\\w:])`, 'g' );

			// Check if used standalone (needs destructuring)
			if ( standalonePattern.test( cleanLine ) ) {
				// Make sure it's not accessed via attributes.xxx or effectiveValues.xxx
				const accessPattern = new RegExp(
					`(?:attributes|effectiveValues|props|attr|config|options)\\.${ attr }`,
					'g'
				);

				// Count standalone uses vs property access uses
				const standaloneMatches = cleanLine.match( standalonePattern ) || [];
				const accessMatches = cleanLine.match( accessPattern ) || [];

				// If there are more standalone uses than property accesses, it's likely a problem
				if ( standaloneMatches.length > accessMatches.length ) {
					if ( ! used.has( attr ) ) {
						used.set( attr, [] );
					}
					used.get( attr ).push( {
						line: lineNum,
						context: line.trim().substring( 0, 80 ),
					} );
				}
			}
		}
	}

	return used;
}

/**
 * Validate a single block's edit.js
 * @param blockType
 */
function validateBlock( blockType ) {
	const errors = [];

	const editPath = path.join( ROOT, `blocks/${ blockType }/src/edit.js` );

	if ( ! fs.existsSync( editPath ) ) {
		return errors;
	}

	const code = fs.readFileSync( editPath, 'utf8' );
	const schemaAttributes = loadSchemaAttributes( blockType );

	// Find what's already destructured
	const destructured = findDestructuredAttributes( code );

	// Find what's used directly (needs destructuring)
	const used = findUsedAttributes( code, schemaAttributes );

	// Check for attributes used but not destructured
	for ( const [ attr, usages ] of used.entries() ) {
		if ( ! destructured.has( attr ) ) {
			// Double-check it's actually a schema attribute
			if ( schemaAttributes.has( attr ) ) {
				errors.push( {
					block: blockType,
					attribute: attr,
					usages: usages.slice( 0, 3 ), // Show first 3 usages
					fix: `Add "${ attr }" to destructuring: const { ..., ${ attr } } = attributes;`,
				} );
			}
		}
	}

	return errors;
}

/**
 * Main validation
 */
function main() {
	console.log( `\n${ colors.bold }Attribute Destructuring Validation${ colors.reset }\n` );

	let allErrors = [];

	for ( const blockType of BLOCKS ) {
		const errors = validateBlock( blockType );
		allErrors = allErrors.concat( errors );
	}

	if ( allErrors.length > 0 ) {
		console.log( `${ colors.red }${ colors.bold }ERRORS:${ colors.reset }\n` );

		for ( const error of allErrors ) {
			console.log(
				`  ${ colors.red }${ error.block }/edit.js${ colors.reset }: ` +
					`"${ error.attribute }" used but not destructured from attributes`
			);

			for ( const usage of error.usages ) {
				console.log(
					`    ${ colors.gray }Line ${ usage.line }: ${ usage.context }${ colors.reset }`
				);
			}

			console.log( `    ${ colors.yellow }Fix:${ colors.reset } ${ error.fix }\n` );
		}

		console.log( `${ colors.bold }Found: ${ allErrors.length } error(s)${ colors.reset }\n` );
		process.exit( 1 );
	}

	console.log(
		`${ colors.green }${ colors.bold }✓ Attribute destructuring validated${ colors.reset }\n`
	);
}

main();
