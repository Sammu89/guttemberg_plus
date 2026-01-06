/**
 * Schema Usage Validator
 *
 * Validates that all attribute references in manual JavaScript code
 * exist in the corresponding schema files.
 *
 * This prevents bugs from typos or outdated attribute names.
 */

const fs = require( 'fs' );
const path = require( 'path' );

// ANSI color codes for terminal output
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	gray: '\x1b[90m',
	bold: '\x1b[1m',
};

const ROOT_DIR = path.resolve( __dirname, '..' );

// Schema files
const SCHEMAS = {
	accordion: path.join( ROOT_DIR, 'schemas', 'accordion.json' ),
	tabs: path.join( ROOT_DIR, 'schemas', 'tabs.json' ),
	toc: path.join( ROOT_DIR, 'schemas', 'toc.json' ),
};

// Manual JavaScript files to scan
const FILES_TO_SCAN = [
	// Accordion block
	'blocks/accordion/src/edit.js',
	'blocks/accordion/src/save.js',
	'blocks/accordion/src/frontend.js',

	// Tabs block
	'blocks/tabs/src/edit.js',
	'blocks/tabs/src/save.js',
	'blocks/tabs/src/frontend.js',

	// TOC block
	'blocks/toc/src/edit.js',
	'blocks/toc/src/save.js',
	'blocks/toc/src/frontend.js',

	// Shared components
	'shared/src/components/ThemeSelector.js',
	'shared/src/components/SchemaPanels.js',
	'shared/src/components/GenericPanel.js',
	'shared/src/components/CompactColorControl.js',
	'shared/src/components/CustomizationWarning.js',
];

// Patterns to match attribute references
const ATTRIBUTE_PATTERNS = [
	/effectiveValues\.(\w+)/g,
	/attributes\.(\w+)/g,
	/values\.(\w+)/g,
	/setAttributes\(\s*\{\s*(\w+):/g,
	/customizations\.(\w+)/g,
	/\btheme\.(\w+)/g,
];

// Patterns to skip (inner block attributes, etc.)
const SKIP_PATTERNS = [
	/panel\.attributes\.(\w+)/g, // Inner block attributes (tab-panel)
	/block\.attributes\.(\w+)/g, // Inner block attributes (generic)
	/innerBlock\.attributes\.(\w+)/g, // Inner block attributes
];

// Common JavaScript keywords/properties to ignore
const IGNORE_WORDS = new Set( [
	'length',
	'map',
	'filter',
	'forEach',
	'find',
	'some',
	'every',
	'reduce',
	'push',
	'pop',
	'shift',
	'unshift',
	'slice',
	'splice',
	'sort',
	'reverse',
	'join',
	'concat',
	'includes',
	'indexOf',
	'lastIndexOf',
	'keys',
	'values',
	'entries',
	'hasOwnProperty',
	'toString',
	'valueOf',
	'constructor',
	'name',
	'value',
	'label',
	'id',
	'key',
	'type',
	'default',
	'onChange',
	'onClick',
	'onFocus',
	'onBlur',
	'className',
	'style',
	'children',
	'props',
	'state',
	'setState',
	'render',
	'componentDidMount',
	'componentWillUnmount',
	'useEffect',
	'useState',
	'useCallback',
	'useRef',
	'useMemo',
	'useContext',
	'min',
	'max',
	'step',
	'unit',
	// Internal/structural attributes (removed from schemas but still used in code)
	'customizations',
	'customizationCache',
	'currentTab',
	'enableResponsiveFallback',
	'responsiveBreakpoint',
] );

// Positioning profiles for icon-panel macro
const POSITIONING_PROFILES = {
	accordion: [ 'left', 'right', 'box-left', 'box-right' ],
	toc: [ 'left', 'right', 'box-left', 'box-right' ],
	tabs: [ 'left', 'right' ],
};

/**
 * Expand icon-panel macro into 15 individual attributes
 * @param macroName
 * @param macro
 * @param blockType
 */
function expandIconPanelMacro( macroName, macro, blockType ) {
	const { cssVar, positioningProfile, responsive = [], default: defaults } = macro;
	const expanded = {};

	// 1. Show Icon Toggle
	expanded.showIcon = {
		type: 'boolean',
		default: true,
	};

	// 2. Use Different Icons Toggle
	expanded.useDifferentIcons = {
		type: 'boolean',
		default: false,
	};

	// 3. Icon Position
	expanded.iconPosition = {
		type: 'string',
		default: defaults.position,
	};

	// 4. Icon Rotation
	expanded.iconRotation = {
		type: 'string',
		default: defaults.rotation,
	};

	// 5-10. Inactive state attributes
	expanded.iconInactiveSource = { type: 'object', default: defaults.inactive.source };
	expanded.iconInactiveColor = { type: 'string', default: defaults.inactive.color };
	expanded.iconInactiveSize = { type: 'string', default: defaults.inactive.size };
	expanded.iconInactiveMaxSize = { type: 'string', default: defaults.inactive.maxSize };
	expanded.iconInactiveOffsetX = { type: 'string', default: defaults.inactive.offsetX };
	expanded.iconInactiveOffsetY = { type: 'string', default: defaults.inactive.offsetY };

	// 11-16. Active state attributes
	const activeDefaults = defaults.active || {};
	expanded.iconActiveSource = { type: 'object', default: activeDefaults.source || null };
	expanded.iconActiveColor = { type: 'string', default: activeDefaults.color || null };
	expanded.iconActiveSize = { type: 'string', default: activeDefaults.size || null };
	expanded.iconActiveMaxSize = { type: 'string', default: activeDefaults.maxSize || null };
	expanded.iconActiveOffsetX = { type: 'string', default: activeDefaults.offsetX || null };
	expanded.iconActiveOffsetY = { type: 'string', default: activeDefaults.offsetY || null };

	return expanded;
}

/**
 * Process schema attributes to expand icon-panel macros
 * @param attributes
 * @param blockType
 */
function processAttributes( attributes, blockType ) {
	const processed = {};

	for ( const [ name, attr ] of Object.entries( attributes ) ) {
		if ( attr.type === 'icon-panel' ) {
			// Expand icon-panel macro
			const expanded = expandIconPanelMacro( name, attr, blockType );
			Object.assign( processed, expanded );
		} else {
			// Regular attribute - keep as is
			processed[ name ] = attr;
		}
	}

	return processed;
}

// Load schemas (attribute lists)
function loadSchemas() {
	const schemas = {};

	for ( const [ blockType, schemaPath ] of Object.entries( SCHEMAS ) ) {
		try {
			const content = fs.readFileSync( schemaPath, 'utf8' );
			const schema = JSON.parse( content );

			// Expand icon-panel macros before extracting attribute keys
			const expandedAttributes = processAttributes( schema.attributes || {}, blockType );
			schemas[ blockType ] = Object.keys( expandedAttributes );
		} catch ( error ) {
			console.error(
				`${ colors.red }✗ Error loading ${ blockType } schema:${ colors.reset }`,
				error.message
			);
			process.exit( 1 );
		}
	}

	return schemas;
}

// Load full schema objects (for coverage warnings)
function loadSchemaObjects() {
	const schemas = {};

	for ( const [ blockType, schemaPath ] of Object.entries( SCHEMAS ) ) {
		try {
			const content = fs.readFileSync( schemaPath, 'utf8' );
			const schema = JSON.parse( content );

			// Expand icon-panel macros
			if ( schema.attributes ) {
				schema.attributes = processAttributes( schema.attributes, blockType );
			}

			schemas[ blockType ] = schema;
		} catch ( error ) {
			console.error(
				`${ colors.red }✗ Error loading ${ blockType } schema:${ colors.reset }`,
				error.message
			);
			process.exit( 1 );
		}
	}

	return schemas;
}

// Detect which block type a file belongs to
function detectBlockType( filePath ) {
	if ( filePath.includes( 'accordion' ) ) {
		return 'accordion';
	}
	if ( filePath.includes( 'tabs' ) ) {
		return 'tabs';
	}
	if ( filePath.includes( 'toc' ) ) {
		return 'toc';
	}
	// Shared components can reference any block type
	return 'shared';
}

// Calculate Levenshtein distance for "did you mean?" suggestions
function levenshteinDistance( str1, str2 ) {
	const matrix = [];

	for ( let i = 0; i <= str2.length; i++ ) {
		matrix[ i ] = [ i ];
	}

	for ( let j = 0; j <= str1.length; j++ ) {
		matrix[ 0 ][ j ] = j;
	}

	for ( let i = 1; i <= str2.length; i++ ) {
		for ( let j = 1; j <= str1.length; j++ ) {
			if ( str2.charAt( i - 1 ) === str1.charAt( j - 1 ) ) {
				matrix[ i ][ j ] = matrix[ i - 1 ][ j - 1 ];
			} else {
				matrix[ i ][ j ] = Math.min(
					matrix[ i - 1 ][ j - 1 ] + 1,
					matrix[ i ][ j - 1 ] + 1,
					matrix[ i - 1 ][ j ] + 1
				);
			}
		}
	}

	return matrix[ str2.length ][ str1.length ];
}

// Find close matches for suggestions
function findSuggestions( invalidAttr, validAttrs, maxSuggestions = 3 ) {
	const distances = validAttrs.map( ( attr ) => ( {
		attr,
		distance: levenshteinDistance( invalidAttr, attr ),
	} ) );

	distances.sort( ( a, b ) => a.distance - b.distance );

	// Only suggest if distance is reasonable (less than half the string length)
	const maxDistance = Math.max( 3, Math.floor( invalidAttr.length / 2 ) );
	return distances
		.filter( ( d ) => d.distance <= maxDistance )
		.slice( 0, maxSuggestions )
		.map( ( d ) => d.attr );
}

// Extract attribute references from a line of code
function extractAttributes( line ) {
	const attrs = new Set();

	// Skip lines that match skip patterns (inner block attributes, etc.)
	for ( const skipPattern of SKIP_PATTERNS ) {
		skipPattern.lastIndex = 0; // Reset regex state
		if ( skipPattern.test( line ) ) {
			return []; // Skip this line entirely
		}
	}

	for ( const pattern of ATTRIBUTE_PATTERNS ) {
		const matches = line.matchAll( pattern );
		for ( const match of matches ) {
			const attr = match[ 1 ];
			if ( attr && ! IGNORE_WORDS.has( attr ) ) {
				attrs.add( attr );
			}
		}
	}

	return Array.from( attrs );
}

// Validate a single file
function validateFile( filePath, schemas ) {
	const fullPath = path.join( ROOT_DIR, filePath );

	// Skip if file doesn't exist
	if ( ! fs.existsSync( fullPath ) ) {
		return { valid: true, skipped: true };
	}

	const content = fs.readFileSync( fullPath, 'utf8' );
	const lines = content.split( '\n' );
	const blockType = detectBlockType( filePath );
	const violations = [];
	let validReferences = 0;

	lines.forEach( ( line, index ) => {
		const attrs = extractAttributes( line );

		for ( const attr of attrs ) {
			// For shared components, check against all schemas
			let isValid = false;
			const validSchemas = [];

			if ( blockType === 'shared' ) {
				for ( const [ schemaName, schemaAttrs ] of Object.entries( schemas ) ) {
					if ( schemaAttrs.includes( attr ) ) {
						isValid = true;
						validSchemas.push( schemaName );
					}
				}
			} else {
				isValid = schemas[ blockType ]?.includes( attr ) || false;
			}

			if ( isValid ) {
				validReferences++;
			} else {
				// Generate suggestions
				let suggestions = [];

				if ( blockType === 'shared' ) {
					// For shared files, suggest from all schemas
					const allAttrs = Object.values( schemas ).flat();
					suggestions = findSuggestions( attr, allAttrs );
				} else {
					suggestions = findSuggestions( attr, schemas[ blockType ] || [] );
				}

				violations.push( {
					line: index + 1,
					attribute: attr,
					suggestions,
					context: line.trim(),
				} );
			}
		}
	} );

	return {
		valid: violations.length === 0,
		violations,
		validReferences,
	};
}

// Main validation function
function validateSchemaUsage() {
	// Load schemas
	const schemas = loadSchemas();
	const schemaObjects = loadSchemaObjects();

	let totalViolations = 0;
	let totalValidReferences = 0;
	let filesWithIssues = 0;
	let filesScanned = 0;
	const fileViolations = [];

	// Validate each file
	for ( const filePath of FILES_TO_SCAN ) {
		const result = validateFile( filePath, schemas );

		if ( result.skipped ) {
			continue;
		}

		filesScanned++;
		totalValidReferences += result.validReferences;

		if ( ! result.valid ) {
			filesWithIssues++;
			totalViolations += result.violations.length;
			fileViolations.push( { filePath, violations: result.violations } );
		}
	}

	// Output - only if there are issues
	if ( totalViolations > 0 ) {
		console.log(
			`\n${ colors.red }${ colors.bold }Schema Usage Validation FAILED${ colors.reset }`
		);
		console.log( '' );

		for ( const { filePath, violations } of fileViolations ) {
			console.log( `${ colors.yellow }${ filePath }:${ colors.reset }` );
			for ( const violation of violations ) {
				console.log(
					`  ${ colors.red }Line ${ violation.line }: ${ violation.attribute }${ colors.reset }`
				);
				if ( violation.suggestions.length > 0 ) {
					console.log(
						`    ${ colors.gray }Did you mean: ${ violation.suggestions.join(
							', '
						) }?${ colors.reset }`
					);
				}
			}
		}

		console.log( '' );
		console.log(
			`${ colors.red }✗ ${ totalViolations } invalid reference${
				totalViolations === 1 ? '' : 's'
			} in ${ filesWithIssues } file${ filesWithIssues === 1 ? '' : 's' }${ colors.reset }`
		);
		process.exit( 1 );
	} else {
		// Cross-check: warn if themeable attributes with CSS output are never referenced in edit/save/generated styles
		const coverageFiles = {
			accordion: [
				'blocks/accordion/src/edit.js',
				'blocks/accordion/src/save.js',
				'shared/src/styles/accordion-styles-generated.js',
			],
			tabs: [
				'blocks/tabs/src/edit.js',
				'blocks/tabs/src/save.js',
				'shared/src/styles/tabs-styles-generated.js',
			],
			toc: [
				'blocks/toc/src/edit.js',
				'blocks/toc/src/save.js',
				'shared/src/styles/toc-styles-generated.js',
			],
		};

		const coverageWarnings = [];

		for ( const [ blockType, schema ] of Object.entries( schemaObjects ) ) {
			const attrs = schema.attributes || {};
			const files = coverageFiles[ blockType ] || [];
			const content = files
				.filter( ( f ) => fs.existsSync( path.join( ROOT_DIR, f ) ) )
				.map( ( f ) => fs.readFileSync( path.join( ROOT_DIR, f ), 'utf8' ) )
				.join( '\n' );

			Object.entries( attrs ).forEach( ( [ attrName, attr ] ) => {
				const hasVariants =
					attr.dependsOn &&
					attr.variants &&
					typeof attr.variants === 'object' &&
					Object.keys( attr.variants ).length > 0;
				const hasCssProperty = Boolean( attr.cssProperty );

				// Only consider themeable attributes that should render styles (cssProperty or variants)
				if ( ! attr.themeable || ( ! hasCssProperty && ! hasVariants ) ) {
					return;
				}

				const regex = new RegExp( `\\b${ attrName }\\b` );
				if ( ! regex.test( content ) ) {
					coverageWarnings.push( {
						block: blockType,
						attr: attrName,
					} );
				}
			} );
		}

		console.log(
			`${ colors.green }✅ Schema usage: ${ totalValidReferences } valid references in ${ filesScanned } files${ colors.reset }`
		);

		if ( coverageWarnings.length > 0 ) {
			console.log(
				`\n${ colors.yellow }${ colors.bold }⚠️  Schema coverage warnings (schema → edit/save):${ colors.reset }`
			);
			coverageWarnings.forEach( ( w ) => {
				console.log(
					`  - ${ w.block }: attribute "${ w.attr }" not found in edit/save/generated styles`
				);
			} );
		}

		process.exit( coverageWarnings.length > 0 ? 0 : 0 );
	}
}

// Run validation
validateSchemaUsage();
