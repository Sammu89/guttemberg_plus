/**
 * CSS Variables Parser Loader
 *
 * Webpack loader that parses :root CSS variables and generates PHP arrays
 *
 * Input:  assets/css/accordion.css with :root { --accordion-default-title-color: #333333; }
 * Output: php/css-defaults/accordion.php with array('titleColor' => '#333333')
 *
 * @see README.md Phase 0.4 for full specification
 */

const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Webpack loader function
 * @param {string} source - CSS file content
 * @return {string} - Original CSS content (unchanged)
 */
module.exports = function cssVarsParserLoader( source ) {
	const callback = this.async();
	const options = this.getOptions() || {};

	try {
		// Parse :root variables
		const rootVars = parseCSSRootVariables( source );

		// Generate PHP file
		const blockType = getBlockTypeFromPath( this.resourcePath );
		const phpPath = path.join(
			process.cwd(),
			options.outputPath || './php/css-defaults/',
			`${ blockType }.php`
		);

		const phpContent = generatePHPArray( rootVars, this.resourcePath );

		// Ensure output directory exists
		const phpDir = path.dirname( phpPath );
		if ( ! fs.existsSync( phpDir ) ) {
			fs.mkdirSync( phpDir, { recursive: true } );
		}

		// Write PHP file
		fs.writeFileSync( phpPath, phpContent );

		console.log(
			`✓ Generated ${ blockType }.php with ${ Object.keys( rootVars ).length } CSS defaults`
		);

		// Return empty JavaScript module (we only need the PHP file)
		callback( null, '// CSS variables parsed and saved to PHP\nexport default {};' );
	} catch ( error ) {
		console.error( 'CSS Variables Parser Error:', error );
		callback( error );
	}
};

/**
 * Parse :root CSS variables from source
 * @param {string} source - CSS content
 * @return {Object} - Parsed variables { attributeName: value }
 */
function parseCSSRootVariables( source ) {
	const rootVars = {};

	// Regex to find :root { ... } blocks
	const rootRegex = /:root\s*\{([^}]+)\}/g;

	// Regex to find CSS variables: --var-name: value;
	const varRegex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;

	let rootMatch;
	while ( ( rootMatch = rootRegex.exec( source ) ) !== null ) {
		const rootBlock = rootMatch[ 1 ];

		let varMatch;
		while ( ( varMatch = varRegex.exec( rootBlock ) ) !== null ) {
			const varName = varMatch[ 1 ]; // e.g., "accordion-default-title-color"
			const varValue = varMatch[ 2 ].trim(); // e.g., "#333333"

			// Convert CSS variable name to attribute name
			// --accordion-default-title-color → titleColor
			// --tabs-default-border-width → borderWidth
			const attributeName = convertVarNameToAttribute( varName );

			// Clean and normalize value
			const cleanValue = cleanCSSValue( varValue );

			rootVars[ attributeName ] = cleanValue;
		}
	}

	return rootVars;
}

/**
 * Convert CSS variable name to camelCase attribute name
 * @param {string} varName - CSS variable name (e.g., "accordion-default-title-color")
 * @return {string} - Attribute name (e.g., "titleColor")
 */
function convertVarNameToAttribute( varName ) {
	// Remove block type prefix and -default- segment in one pass
	// Example: "accordion-default-title-background-color" → "title-background-color"
	const cleaned = varName.replace( /^(accordion|tabs|toc)-default-/, '' );

	// Convert kebab-case to camelCase
	return cleaned.replace( /-([a-z])/g, ( match, letter ) => letter.toUpperCase() );
}

/**
 * Clean CSS value (remove units for numeric values, normalize colors)
 * @param {string} value - Raw CSS value
 * @return {string} - Cleaned value
 */
function cleanCSSValue( value ) {
	// Trim whitespace
	value = value.trim();

	// Remove quotes if present
	value = value.replace( /^["']|["']$/g, '' );

	// For numeric values with units, extract just the number
	// (PHP will handle units separately if needed)
	const numericMatch = value.match( /^([-\d.]+)(px|rem|em|%|deg|turn|rad)?$/ );
	if ( numericMatch ) {
		const number = numericMatch[ 1 ];
		const unit = numericMatch[ 2 ] || '';

		// Keep unit if it's rotation (for iconRotation)
		if ( unit === 'deg' || unit === 'turn' || unit === 'rad' ) {
			return value; // Keep original with unit
		}

		// For size units (px, rem, em, %), return just number
		return number;
	}

	// For colors, booleans, strings - return as is
	return value;
}

/**
 * Get block type from file path
 * @param {string} filePath - Full file path
 * @return {string} - Block type (accordion, tabs, or toc)
 */
function getBlockTypeFromPath( filePath ) {
	const basename = path.basename( filePath, '.css' );

	// Match common patterns
	if ( basename.includes( 'accordion' ) ) {
		return 'accordion';
	}
	if ( basename.includes( 'tabs' ) ) {
		return 'tabs';
	}
	if ( basename.includes( 'toc' ) ) {
		return 'toc';
	}

	// Fallback to basename
	return basename;
}

/**
 * Generate PHP array file content
 * @param {Object} vars       - Parsed variables
 * @param {string} sourcePath - Original CSS file path
 * @return {string} - PHP file content
 */
function generatePHPArray( vars, sourcePath ) {
	const relativeSource = path.relative( process.cwd(), sourcePath );
	const timestamp = new Date().toISOString();

	// Generate PHP array entries
	const entries = Object.entries( vars )
		.map( ( [ key, value ] ) => `  '${ key }' => '${ escapePHPValue( value ) }',` )
		.join( '\n' );

	return `<?php
/**
 * CSS Default Values
 *
 * Auto-generated from ${ relativeSource }
 * Generated: ${ timestamp }
 *
 * DO NOT EDIT MANUALLY - Changes will be overwritten on build
 */

return array(
${ entries }
);
`;
}

/**
 * Escape value for PHP string
 * @param {string} value - Value to escape
 * @return {string} - Escaped value
 */
function escapePHPValue( value ) {
	return String( value ).replace( /\\/g, '\\\\' ).replace( /'/g, "\\'" );
}
