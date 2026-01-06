/**
 * Schema Compiler for Guttemberg Plus
 *
 * AUTO-GENERATED FILE WARNING:
 * This compiler generates multiple downstream artifacts from schema JSON files.
 * Do not manually edit generated files - they will be overwritten on build.
 *
 * Generated artifacts:
 * - TypeScript type definitions (shared/src/types/)
 * - Zod validation schemas (shared/src/validators/)
 * - JavaScript block attributes (blocks/[blockType]/src/[blockType]-attributes.js)
 * - PHP CSS defaults (php/css-defaults/)
 * - PHP CSS variable mappings (php/css-defaults/css-mappings-generated.php)
 * - Control configuration (shared/src/config/control-config-generated.js)
 * - CSS variable declarations (assets/css/)
 * - Style builder functions (shared/src/styles/)
 * - Markdown documentation (docs/)
 *
 * @package
 * @since 1.0.0
 */

const fs = require( 'fs' );
const path = require( 'path' );
const { generateStyleBuilder } = require( './generators/style-builder-generator' );
const { generateEditorCssVarsBuilder } = require( './generators/editor-css-vars-injector' );
const { generateFrontendCssVarsBuilder } = require( './generators/frontend-css-vars-injector' );
const { generateStructureJsx } = require( './generators/structure-jsx-generator' );

// Dynamic import for ES module (css-property-scales uses ES6 exports)
let CSS_PROPERTY_SCALES, CSS_PROPERTY_ALIASES, getPropertyScale;
async function loadCssPropertyScales() {
	const module = await import( '../shared/src/config/css-property-scales.mjs' );
	CSS_PROPERTY_SCALES = module.CSS_PROPERTY_SCALES;
	CSS_PROPERTY_ALIASES = module.CSS_PROPERTY_ALIASES;
	getPropertyScale = module.getPropertyScale;
}

// ============================================================================
// Configuration
// ============================================================================

const ROOT_DIR = path.resolve( __dirname, '..' );
const SCHEMAS_DIR = path.join( ROOT_DIR, 'schemas' );

// Output directories
const OUTPUT_DIRS = {
	types: path.join( ROOT_DIR, 'shared', 'src', 'types' ),
	validators: path.join( ROOT_DIR, 'shared', 'src', 'validators' ),
	phpCssDefaults: path.join( ROOT_DIR, 'php', 'css-defaults' ),
	config: path.join( ROOT_DIR, 'shared', 'src', 'config' ),
	css: path.join( ROOT_DIR, 'assets', 'css' ),
	docs: path.join( ROOT_DIR, 'docs' ),
	blockAttributes: path.join( ROOT_DIR, 'blocks' ),
	styles: path.join( ROOT_DIR, 'shared', 'src', 'styles' ),
};

// Block configurations
const BLOCKS = [ 'accordion', 'tabs', 'toc' ];

// Icon positioning profiles for each block type
const POSITIONING_PROFILES = {
	accordion: [ 'left', 'right', 'box-left', 'box-right' ],
	toc: [ 'left', 'right', 'box-left', 'box-right' ],
	tabs: [ 'left', 'right' ],
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate timestamp for file headers
 */
function getTimestamp() {
	return new Date().toISOString();
}

function getDefaultUnitForProperty( cssProperty ) {
	if ( ! getPropertyScale || ! cssProperty ) {
		return null;
	}
	const scale = getPropertyScale( cssProperty );
	if ( ! scale ) {
		return null;
	}
	if ( cssProperty === 'transform' && scale.rotation?.units?.length ) {
		return scale.rotation.units[ 0 ] || null;
	}
	if ( ! Array.isArray( scale.units ) ) {
		return null;
	}
	if ( scale.units.includes( 'px' ) ) {
		return 'px';
	}
	return scale.units[ 0 ] || null;
}

/**
 * Compress CSS shorthand values (top, right, bottom, left) to minimal representation
 * Following CSS shorthand rules:
 * - 1 value: all sides same
 * - 2 values: top/bottom same, left/right same
 * - 3 values: left equals right
 * - 4 values: all different
 *
 * Supports both numeric values with units and string values (colors, styles)
 *
 * @param {number|string} top    - Top value
 * @param {number|string} right  - Right value
 * @param {number|string} bottom - Bottom value
 * @param {number|string} left   - Left value
 * @param {string}        unit   - CSS unit (e.g., 'px', 'em') - only used for numeric values
 * @return {string} Compressed CSS shorthand value
 */
function compressShorthand( top, right, bottom, left, unit ) {
	// Helper to format value with unit (only for numbers)
	const formatVal = ( val ) => {
		if ( typeof val === 'string' ) {
			return val; // Colors, styles, etc. - no unit
		}
		return unit ? `${ val }${ unit }` : `${ val }`;
	};

	// All 4 values are the same
	if ( top === right && right === bottom && bottom === left ) {
		return formatVal( top );
	}

	// Top/bottom same AND left/right same
	if ( top === bottom && left === right ) {
		return `${ formatVal( top ) } ${ formatVal( right ) }`;
	}

	// Left equals right (3-value shorthand)
	if ( left === right ) {
		return `${ formatVal( top ) } ${ formatVal( right ) } ${ formatVal( bottom ) }`;
	}

	// All values different (4-value shorthand)
	return `${ formatVal( top ) } ${ formatVal( right ) } ${ formatVal( bottom ) } ${ formatVal(
		left
	) }`;
}

/**
 * Get auto-generated file header
 * @param schemaFile
 * @param fileType
 */
function getGeneratedHeader( schemaFile, fileType ) {
	return `/**
 * ${ fileType }
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${ schemaFile }
 * Generated at: ${ getTimestamp() }
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

`;
}

/**
 * Get PHP auto-generated file header
 * @param schemaFile
 * @param description
 */
function getPHPGeneratedHeader( schemaFile, description ) {
	const timestamp = getTimestamp();
	return `<?php
/**
 * ${ description }
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${ schemaFile }
 * Generated at: ${ getTimestamp() }
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

`;
}

/**
 * Get Markdown auto-generated file header
 * @param schemaFile
 * @param title
 */
function getMarkdownGeneratedHeader( schemaFile, title ) {
	return `# ${ title }

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: \`schemas/${ schemaFile }\`
> Generated at: ${ getTimestamp() }
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: \`npm run schema:build\`

---

`;
}

/**
 * Convert camelCase to PascalCase
 * @param str
 */
function toPascalCase( str ) {
	return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}

/**
 * Convert camelCase to SCREAMING_SNAKE_CASE
 * @param str
 */
function toScreamingSnakeCase( str ) {
	return str.replace( /([a-z])([A-Z])/g, '$1_$2' ).toUpperCase();
}

/**
 * Convert camelCase to kebab-case
 * @param str
 */
function toKebabCase( str ) {
	return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

/**
 * Convert kebab-case or snake_case to camelCase
 * @param str
 */
function toCamelCase( str ) {
	return str.replace( /[-_]([a-z])/g, ( _, letter ) => letter.toUpperCase() );
}

/**
 * Ensure directory exists
 * @param dirPath
 */
function ensureDir( dirPath ) {
	if ( ! fs.existsSync( dirPath ) ) {
		fs.mkdirSync( dirPath, { recursive: true } );
		console.log( `  Created directory: ${ path.relative( ROOT_DIR, dirPath ) }` );
	}
}

/**
 * Load and parse a schema file
 * @param blockType
 */
function loadSchema( blockType ) {
	const schemaPath = path.join( SCHEMAS_DIR, `${ blockType }.json` );

	if ( ! fs.existsSync( schemaPath ) ) {
		throw new Error( `Schema file not found: ${ schemaPath }` );
	}

	const content = fs.readFileSync( schemaPath, 'utf8' );

	try {
		return JSON.parse( content );
	} catch ( error ) {
		throw new Error( `Failed to parse schema ${ blockType }.json: ${ error.message }` );
	}
}

/**
 * Expand icon-panel macro into 15 individual attributes (2 toggles + 13 icon settings)
 *
 * @param {string} macroName - The macro attribute name (e.g., 'titleIcon')
 * @param {Object} macro     - The macro definition from schema
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @return {Object} - Expanded attributes object
 */
function expandIconPanelMacro( macroName, macro, blockType ) {
	const expanded = {};

	// ============================================================================
	// INFER MISSING FIELDS WITH SMART DEFAULTS
	// ============================================================================

	// Always 'icon' for icon-panel type
	const group = macro.group || 'icon';

	// Derive label from attribute name: "titleIcon" → "Title Icon"
	const label =
		macro.label ||
		macroName
			.replace( /([A-Z])/g, ' $1' )
			.trim()
			.replace( /^./, ( str ) => str.toUpperCase() );

	// Auto-generate description
	const description = macro.description || `Icon settings for ${ blockType }`;

	// Infer positioning profile from blockType
	const positioningProfile = macro.positioningProfile || blockType;

	// Get appliesToElement (or use appliesTo for backwards compat)
	const appliesToElement = macro.appliesToElement || macro.appliesTo || 'icon';

	// structureElement is same as appliesToElement
	const structureElement = appliesToElement;

	// Responsive attributes are always the same for icons
	const responsiveAttrs = [ 'size', 'maxSize', 'offsetX', 'offsetY' ];

	// Get other required fields
	const { cssVar, order, themeable = true, outputsCSS = false } = macro;
	const defaults = macro.default || {};

	// Get positioning options from profile
	const allowedPositions = POSITIONING_PROFILES[ positioningProfile ] ||
		POSITIONING_PROFILES[ blockType ] || [ 'left', 'right' ];

	// Get state defaults (if active not provided, it means inherit from inactive)
	const inactiveDefaults = defaults.inactive || {};
	const activeDefaults = defaults.active !== undefined ? defaults.active : null;

	// ============================================================================
	// 1. SHOW ICON TOGGLE (NEW)
	// ============================================================================

	expanded.showIcon = {
		type: 'boolean',
		default: true,
		control: 'ToggleControl',
		cssVar: `${ cssVar }-display`,
		cssProperty: 'display',
		appliesTo: structureElement,
		themeable: true,
		responsive: false,
		outputsCSS: true,
		group,
		order: order || 0,
		label: 'Show Icon',
		description: 'Display icon in the block',
		// Map boolean to CSS values: true → 'inline-grid', false → 'none'
		cssValueMap: {
			true: 'inline-grid',
			false: 'none',
		},
	};

	// ============================================================================
	// 2. USE DIFFERENT ICONS TOGGLE (NEW)
	// ============================================================================

	expanded.useDifferentIcons = {
		type: 'boolean',
		default: false,
		control: 'ToggleControl',
		themeable: true,
		responsive: false,
		outputsCSS: false,
		group,
		order: order ? order + 0.05 : 0.05,
		label: 'Different Icons for Open/Close',
		description: 'Use different icons for active and inactive states',
		showWhen: {
			showIcon: [ true ],
		},
	};

	// ============================================================================
	// 3. ICON POSITION
	// ============================================================================

	expanded.iconPosition = {
		type: 'string',
		default: defaults.position || 'right',
		control: 'IconPositionControl',
		allowedPositions,
		themeable: true,
		responsive: false,
		outputsCSS: false,
		group,
		order: order ? order + 0.1 : 0.1,
		label: 'Icon Position',
		description: 'Position of the icon relative to title',
		showWhen: {
			showIcon: [ true ],
		},
	};

	// ============================================================================
	// 4. ICON ROTATION
	// ============================================================================

	expanded.iconRotation = {
		type: 'string',
		default: defaults.rotation || '180deg',
		control: 'SliderWithInput',
		cssVar: `${ cssVar }-rotation`,
		cssProperty: 'transform',
		appliesTo: structureElement,
		themeable: true,
		responsive: false,
		outputsCSS: true,
		group,
		order: order ? order + 0.15 : 0.15,
		label: 'Animation Rotation',
		description: 'Rotation angle applied during open/close transition',
		min: -180,
		max: 180,
		step: 1,
		unit: 'deg',
		showWhen: {
			showIcon: [ true ],
		},
	};

	// ============================================================================
	// HELPER: GENERATE STATE-SPECIFIC ATTRIBUTES (inactive/active)
	// ============================================================================

	const generateStateAttributes = ( state ) => {
		const statePrefix = state === 'inactive' ? 'iconInactive' : 'iconActive';
		const cssVarSuffix = state === 'inactive' ? '' : '-active';
		const stateDefaults = state === 'inactive' ? inactiveDefaults : activeDefaults;
		const stateLabel = state === 'inactive' ? '' : ' (Active)';
		const orderOffset = state === 'inactive' ? 0.2 : 0.3;

		// Get defaults with fallback to inactive state
		const getDefault = ( key ) => {
			if ( stateDefaults && stateDefaults[ key ] !== undefined ) {
				return stateDefaults[ key ];
			}
			if ( state === 'active' && inactiveDefaults && inactiveDefaults[ key ] !== undefined ) {
				return null; // null means "use inactive value"
			}
			return undefined;
		};

		// Get source default and normalize icon-type to kind
		const sourceDefault = getDefault( 'source' ) || { 'icon-type': 'char', value: '▾' };
		const normalizedSource = {
			kind: sourceDefault[ 'icon-type' ] || sourceDefault.kind || 'char',
			value: sourceDefault.value || '▾',
		};

		// Build showWhen rules based on state
		const baseShowWhen = {
			showIcon: [ true ],
		};
		const stateShowWhen =
			state === 'inactive' ? baseShowWhen : { ...baseShowWhen, useDifferentIcons: [ true ] };

		return {
			// ========================================================================
			// SOURCE (IconPicker)
			// ========================================================================
			[ `${ statePrefix }Source` ]: {
				type: 'object',
				default: normalizedSource,
				control: 'IconPicker',
				themeable: true,
				responsive: false,
				outputsCSS: false,
				group,
				subgroup: state,
				order: order ? order + orderOffset : orderOffset,
				label: `Icon${ stateLabel }`,
				description: `Icon when ${ state === 'inactive' ? 'closed' : 'open' }`,
				showWhen: stateShowWhen,
			},

			// ========================================================================
			// COLOR (ColorControl)
			// ========================================================================
			[ `${ statePrefix }Color` ]: {
				type: 'string',
				default: getDefault( 'color' ) || '#333333',
				control: 'ColorControl',
				cssVar: `${ cssVar }${ cssVarSuffix }-color`,
				cssProperty: 'color',
				appliesTo: structureElement,
				themeable: true,
				responsive: false,
				outputsCSS: true,
				group,
				subgroup: state,
				order: order ? order + orderOffset + 0.01 : orderOffset + 0.01,
				label: `Color${ stateLabel }`,
				description: 'Icon color (for character/library icons)',
				conditionalRender: `${ statePrefix }Source.kind !== "image"`,
				showWhen: stateShowWhen,
			},

			// ========================================================================
			// ROTATION (SliderWithInput) - Initial/static rotation
			// ========================================================================
			[ `${ statePrefix }Rotation` ]: {
				type: 'string',
				default: getDefault( 'rotation' ) || '0deg',
				control: 'SliderWithInput',
				cssVar: `${ cssVar }${ cssVarSuffix }-initial-rotation`,
				cssProperty: 'transform',
				appliesTo: structureElement,
				themeable: true,
				responsive: true,
				outputsCSS: true,
				group,
				subgroup: state,
				order: order ? order + orderOffset + 0.015 : orderOffset + 0.015,
				label: `Rotation${ stateLabel }`,
				description: `Initial rotation of ${ state } icon`,
				min: -180,
				max: 180,
				step: 1,
				unit: 'deg',
				showWhen: stateShowWhen,
			},

			// ========================================================================
			// SIZE (SliderWithInput)
			// ========================================================================
			[ `${ statePrefix }Size` ]: {
				type: 'string',
				default: getDefault( 'size' ) || '16px',
				control: 'SliderWithInput',
				cssVar: `${ cssVar }${ cssVarSuffix }-size`,
				cssProperty: 'font-size',
				appliesTo: structureElement,
				themeable: true,
				responsive: responsiveAttrs.includes( 'size' ),
				outputsCSS: true,
				group,
				subgroup: state,
				order: order ? order + orderOffset + 0.02 : orderOffset + 0.02,
				label: `Size${ stateLabel }`,
				description: 'Icon size (for character/library icons)',
				conditionalRender: `${ statePrefix }Source.kind !== "image"`,
				min: 8,
				max: 64,
				step: 1,
				unit: 'px',
				showWhen: stateShowWhen,
			},

			// ========================================================================
			// MAX SIZE (SliderWithInput)
			// ========================================================================
			[ `${ statePrefix }MaxSize` ]: {
				type: 'string',
				default: getDefault( 'maxSize' ) || '24px',
				control: 'SliderWithInput',
				cssVar: `${ cssVar }${ cssVarSuffix }-max-size`,
				cssProperty: 'max-width',
				appliesTo: structureElement,
				themeable: true,
				responsive: responsiveAttrs.includes( 'maxSize' ),
				outputsCSS: true,
				group,
				subgroup: state,
				order: order ? order + orderOffset + 0.03 : orderOffset + 0.03,
				label: `Max Size${ stateLabel }`,
				description: 'Maximum icon size (for image icons)',
				conditionalRender: `${ statePrefix }Source.kind === "image"`,
				min: 8,
				max: 128,
				step: 1,
				unit: 'px',
				showWhen: stateShowWhen,
			},

			// ========================================================================
			// OFFSET X (SliderWithInput)
			// ========================================================================
			[ `${ statePrefix }OffsetX` ]: {
				type: 'string',
				default: getDefault( 'offsetX' ) || '0px',
				control: 'SliderWithInput',
				cssVar: `${ cssVar }${ cssVarSuffix }-offset-x`,
				cssProperty: 'left',
				appliesTo: structureElement,
				themeable: true,
				responsive: responsiveAttrs.includes( 'offsetX' ),
				outputsCSS: true,
				group,
				subgroup: state,
				order: order ? order + orderOffset + 0.04 : orderOffset + 0.04,
				label: `Offset X${ stateLabel }`,
				description: 'Horizontal offset of icon',
				min: -100,
				max: 100,
				step: 1,
				unit: 'px',
				showWhen: stateShowWhen,
			},

			// ========================================================================
			// OFFSET Y (SliderWithInput)
			// ========================================================================
			[ `${ statePrefix }OffsetY` ]: {
				type: 'string',
				default: getDefault( 'offsetY' ) || '0px',
				control: 'SliderWithInput',
				cssVar: `${ cssVar }${ cssVarSuffix }-offset-y`,
				cssProperty: 'top',
				appliesTo: structureElement,
				themeable: true,
				responsive: responsiveAttrs.includes( 'offsetY' ),
				outputsCSS: true,
				group,
				subgroup: state,
				order: order ? order + orderOffset + 0.05 : orderOffset + 0.05,
				label: `Offset Y${ stateLabel }`,
				description: 'Vertical offset of icon',
				min: -100,
				max: 100,
				step: 1,
				unit: 'px',
				showWhen: stateShowWhen,
			},
		};
	};

	// ============================================================================
	// 5-10. INACTIVE STATE ATTRIBUTES
	// ============================================================================

	Object.assign( expanded, generateStateAttributes( 'inactive' ) );

	// ============================================================================
	// 11-16. ACTIVE STATE ATTRIBUTES
	// ============================================================================

	Object.assign( expanded, generateStateAttributes( 'active' ) );

	return expanded;
}

/**
 * Process schema attributes to expand icon-panel macros
 *
 * @param {Object} attributes - Schema attributes object
 * @param {string} blockType  - The block type
 * @return {Object} - Processed attributes with macros expanded
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

/**
 * Format a default value for TypeScript
 * @param value
 * @param type
 */
function formatTSDefault( value, type ) {
	if ( value === null || value === undefined ) {
		return 'undefined';
	}

	if ( type === 'string' ) {
		return `'${ String( value ).replace( /'/g, "\\'" ) }'`;
	}

	if ( type === 'boolean' ) {
		return value ? 'true' : 'false';
	}

	if ( type === 'number' ) {
		return String( value );
	}

	if ( type === 'array' || type === 'object' ) {
		return JSON.stringify( value, null, 2 ).replace( /\n/g, '\n  ' );
	}

	return JSON.stringify( value );
}

/**
 * Get TypeScript type from schema type
 * @param schemaType
 * @param isNullable
 */
function getTSType( schemaType, isNullable = false ) {
	const typeMap = {
		string: 'string',
		number: 'number',
		boolean: 'boolean',
		array: 'any[]',
		object: 'Record<string, any>',
	};

	const tsType = typeMap[ schemaType ] || 'any';
	return isNullable ? `${ tsType } | undefined` : tsType;
}

/**
 * Get Zod type from schema type
 * @param attr
 */
function getZodType( attr ) {
	const isOptional = attr.default === null || attr.default === undefined;
	let zodType;

	switch ( attr.type ) {
		case 'string':
			zodType = 'z.string()';
			break;
		case 'number':
			zodType = 'z.number()';
			break;
		case 'boolean':
			zodType = 'z.boolean()';
			break;
		case 'array':
			zodType = 'z.array(z.any())';
			break;
		case 'object':
			zodType = 'z.record(z.any())';
			break;
		default:
			zodType = 'z.any()';
	}

	if ( isOptional ) {
		zodType += '.optional()';
	}

	return zodType;
}

/**
 * Format PHP value
 * @param value
 * @param type
 */
function formatPHPValue( value, type ) {
	if ( value === null || value === undefined ) {
		return 'null';
	}

	if ( type === 'string' ) {
		return `'${ String( value ).replace( /'/g, "\\'" ) }'`;
	}

	if ( type === 'boolean' ) {
		return value ? 'true' : 'false';
	}

	if ( type === 'number' ) {
		return String( value );
	}

	if ( type === 'array' ) {
		if ( Array.isArray( value ) ) {
			const items = value.map( ( v ) => formatPHPValue( v, typeof v ) );
			return `array( ${ items.join( ', ' ) } )`;
		}
	}

	if ( type === 'object' && typeof value === 'object' ) {
		const entries = Object.entries( value ).map( ( [ k, v ] ) => {
			return `'${ k }' => ${ formatPHPValue( v, typeof v ) }`;
		} );
		return `array(\n        ${ entries.join( ',\n        ' ) }\n      )`;
	}

	return JSON.stringify( value );
}

// ============================================================================
// Generator Functions
// ============================================================================

/**
 * Generate TypeScript type definitions
 * @param blockType
 * @param schema
 */
function generateTypeScript( blockType, schema ) {
	const fileName = `${ blockType }-theme.ts`;
	const interfaceName = `${ toPascalCase( blockType ) }Theme`;
	const defaultsName = `${ blockType }DefaultTheme`;

	let content = getGeneratedHeader(
		`${ blockType }.json`,
		`TypeScript Type Definitions for ${ schema.blockName } Block`
	);

	// Generate interface
	content += `/**\n * Theme interface for ${ schema.blockName } block\n * Contains all themeable attributes\n */\n`;
	content += `export interface ${ interfaceName } {\n`;

	const themeableAttrs = [];
	const allAttrs = Object.entries( schema.attributes );

	for ( const [ attrName, attr ] of allAttrs ) {
		if ( attr.themeable ) {
			themeableAttrs.push( [ attrName, attr ] );
			const tsType = getTSType( attr.type, attr.default === null );
			const description = attr.description ? `  /** ${ attr.description } */\n` : '';
			content += `${ description }  ${ attrName }?: ${ tsType };\n`;
		}
	}

	content += `}\n\n`;

	// Generate defaults object
	content += `/**\n * Default theme values for ${ schema.blockName } block\n */\n`;
	content += `export const ${ defaultsName }: ${ interfaceName } = {\n`;

	for ( const [ attrName, attr ] of themeableAttrs ) {
		if ( attr.default !== null && attr.default !== undefined ) {
			const formattedValue = formatTSDefault( attr.default, attr.type );
			content += `  ${ attrName }: ${ formattedValue },\n`;
		}
	}

	content += `};\n\n`;

	// Generate attribute metadata interface
	content += `/**\n * Full attribute interface including non-themeable attributes\n */\n`;
	content += `export interface ${ interfaceName }Attributes {\n`;

	for ( const [ attrName, attr ] of allAttrs ) {
		const tsType = getTSType( attr.type, attr.default === null );
		content += `  ${ attrName }?: ${ tsType };\n`;
	}

	content += `}\n`;

	return { fileName, content };
}

/**
 * Generate Zod validation schemas
 * @param blockType
 * @param schema
 */
function generateValidationSchema( blockType, schema ) {
	const fileName = `${ blockType }-schema.ts`;
	const schemaName = `${ blockType }ThemeSchema`;

	let content = getGeneratedHeader(
		`${ blockType }.json`,
		`Zod Validation Schema for ${ schema.blockName } Block`
	);

	content += `import { z } from 'zod';\n\n`;

	// Generate theme schema (themeable attributes only)
	content += `/**\n * Validation schema for ${ schema.blockName } theme values\n */\n`;
	content += `export const ${ schemaName } = z.object({\n`;

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if ( attr.themeable ) {
			const zodType = getZodType( attr );
			content += `  ${ attrName }: ${ zodType },\n`;
		}
	}

	content += `});\n\n`;

	// Generate full attributes schema
	content += `/**\n * Validation schema for all ${ schema.blockName } block attributes\n */\n`;
	content += `export const ${ blockType }AttributesSchema = z.object({\n`;

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		const zodType = getZodType( attr );
		content += `  ${ attrName }: ${ zodType },\n`;
	}

	content += `});\n\n`;

	// Export type inferences
	content += `// Type inference exports\n`;
	content += `export type ${ toPascalCase(
		blockType
	) }Theme = z.infer<typeof ${ schemaName }>;\n`;
	content += `export type ${ toPascalCase(
		blockType
	) }Attributes = z.infer<typeof ${ blockType }AttributesSchema>;\n`;

	return { fileName, content };
}

/**
 * Generate PHP CSS defaults
 * @param blockType
 * @param schema
 */
function generatePHPCSSDefaults( blockType, schema ) {
	const fileName = `${ blockType }.php`;

	let content = getPHPGeneratedHeader(
		`${ blockType }.json`,
		`CSS Default Values for ${ schema.blockName } Block`
	);

	content += `return array(\n`;

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if (
			attr.themeable &&
			attr.default !== undefined &&
			attr.default !== null &&
			attr.default !== ''
		) {
			// Skip complex objects
			if ( typeof attr.default === 'object' ) {
				continue;
			}

			let defaultValue = attr.default;

			// Handle special transformValue for paddingRectangle
			if ( attr.transformValue === 'paddingRectangle' && typeof attr.default === 'number' ) {
				const vertical = attr.default;
				const horizontal = attr.default * 2;
				const unit = attr.unit || 'px';
				defaultValue = `${ vertical }${ unit } ${ horizontal }${ unit }`;
			}

			// Use the default value directly (now includes units, e.g., "18px", "1.6", "180deg")
			content += `  '${ attrName }' => '${ defaultValue }',\n`;
		}
	}

	content += `);\n`;

	return { fileName, content };
}

/**
 * Generate PHP attribute definitions
 * @param blockType
 * @param schema
 */
function generatePHPAttributes( blockType, schema ) {
	const fileName = `${ blockType }-attributes.php`;

	let content = getPHPGeneratedHeader(
		`${ blockType }.json`,
		`Block Attributes for ${ schema.blockName } Block`
	);

	content += `return array(\n`;

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		content += `  '${ attrName }' => array(\n`;
		content += `    'type' => '${ attr.type }',\n`;

		if ( attr.default !== null && attr.default !== undefined ) {
			const phpValue = formatPHPValue( attr.default, attr.type );
			content += `    'default' => ${ phpValue },\n`;
		}

		content += `  ),\n`;
	}

	content += `);\n`;

	return { fileName, content };
}

/**
 * Generate PHP CSS variable mappings for theme-css-generator.php
 * Includes CSS variable names and unit information
 * @param allSchemas
 */
function generatePHPMappings( allSchemas ) {
	const mappings = {};

	for ( const [ blockType, schema ] of Object.entries( allSchemas ) ) {
		mappings[ blockType ] = {};

		for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
			if ( attr.themeable && attr.cssVar ) {
				const defaultUnit = getDefaultUnitForProperty( attr.cssProperty );
				// Store both cssVar and unit
				mappings[ blockType ][ attrName ] = {
					cssVar: attr.cssVar,
					unit: attr.unit || null,
					defaultUnit: defaultUnit || null,
					type: attr.type,
				};
			}
		}
	}

	// Generate PHP mapping array code
	let content = `<?php
/**
 * Auto-generated CSS Variable Mappings
 *
 * This mapping array is auto-generated from schema files.
 * Generated at: ${ getTimestamp() }
 *
 * This file is used by theme-css-generator.php for:
 * - Mapping attribute names to CSS variable names
 * - Identifying which numeric properties should NOT have units
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Attribute name to CSS variable name mappings
 */
\$mappings = array(\n`;

	for ( const [ blockType, attrs ] of Object.entries( mappings ) ) {
		content += `    '${ blockType }' => array(\n`;

		for ( const [ attrName, info ] of Object.entries( attrs ) ) {
			const unitStr = info.unit ? `'${ info.unit }'` : 'null';
			const defaultUnitStr = info.defaultUnit ? `'${ info.defaultUnit }'` : 'null';
			content += `      '${ attrName }' => array( 'cssVar' => '${ info.cssVar }', 'unit' => ${ unitStr }, 'defaultUnit' => ${ defaultUnitStr }, 'type' => '${ info.type }' ),\n`;
		}

		content += `    ),\n`;
	}

	content += `  );\n\n`;

	// Return mappings
	content += `// Return mappings for use in theme-css-generator.php\n`;
	content += `return \$mappings;\n`;

	return { fileName: 'css-mappings-generated.php', content };
}

/**
 * Generate JavaScript CSS variable mappings for save.js
 * Includes cssVar, unit, and type information for proper value formatting
 * @param allSchemas
 */
function generateJSMappings( allSchemas ) {
	const mappings = {};

	for ( const [ blockType, schema ] of Object.entries( allSchemas ) ) {
		mappings[ blockType ] = {};

		for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
			const outputsCSS = attr.outputsCSS !== false;
			if ( outputsCSS && attr.cssVar ) {
				const defaultUnit = getDefaultUnitForProperty( attr.cssProperty );
				mappings[ blockType ][ attrName ] = {
					cssVar: `--${ attr.cssVar }`,
					unit: attr.unit || null,
					defaultUnit: defaultUnit || null,
					type: attr.type,
					cssProperty: attr.cssProperty || null,
					dependsOn: attr.dependsOn || null,
					variants: attr.variants || null,
					cssValueMap: attr.cssValueMap || null,
				};
			}
		}
	}

	// Generate JS file content
	let content = getGeneratedHeader( '*.json', 'CSS Variable Mappings for All Blocks' );

	// Inline shadow utilities (for Node.js compatibility - can't use webpack aliases in require())
	content += `/**
 * Format a shadow value to CSS string
 * @param {Object|number|string|null} valueObj - Shadow value object or primitive
 * @returns {string} CSS value with unit
 */
function formatShadowValue(valueObj) {
  if (valueObj === null || valueObj === undefined) return '0px';
  if (typeof valueObj === 'string') return valueObj;
  if (typeof valueObj === 'number') return \`\${valueObj}px\`;
  if (typeof valueObj === 'object' && valueObj !== null) {
    const value = valueObj.value ?? 0;
    const unit = valueObj.unit ?? 'px';
    return \`\${value}\${unit}\`;
  }
  return '0px';
}

/**
 * Build CSS box-shadow from array of shadow layers
 * @param {Array|null} shadows - Array of shadow layer objects
 * @returns {string} CSS box-shadow value or 'none'
 */
function buildBoxShadow(shadows) {
  if (!shadows || !Array.isArray(shadows) || shadows.length === 0) return 'none';
  const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
  if (validLayers.length === 0) return 'none';
  return validLayers.map(layer => {
    const parts = [];
    if (layer.inset === true) parts.push('inset');
    parts.push(formatShadowValue(layer.x));
    parts.push(formatShadowValue(layer.y));
    parts.push(formatShadowValue(layer.blur));
    parts.push(formatShadowValue(layer.spread));
    parts.push(layer.color);
    return parts.join(' ');
  }).join(', ');
}

/**
 * Build CSS text-shadow from array of shadow layers
 * Similar to buildBoxShadow but omits blur, spread, and inset (not supported by text-shadow)
 * @param {Array|null} shadows - Array of shadow layer objects
 * @returns {string} CSS text-shadow value or 'none'
 */
function buildTextShadow(shadows) {
  if (!shadows || !Array.isArray(shadows) || shadows.length === 0) return 'none';
  const validLayers = shadows.filter(layer => layer && layer.color && layer.color.trim() !== '');
  if (validLayers.length === 0) return 'none';
  return validLayers.map(layer => {
    const parts = [];
    // text-shadow format: offset-x offset-y color (NO blur, spread, or inset)
    parts.push(formatShadowValue(layer.x));
    parts.push(formatShadowValue(layer.y));
    parts.push(layer.color);
    return parts.join(' ');
  }).join(', ');
}

/**
 * CSS Variable Mappings
 *
 * Maps attribute names to their CSS variable names with formatting info.
 * Used by save.js to output inline CSS for customizations.
 *
 * Structure:
 * {
 *   [attrName]: {
 *     cssVar: '--css-var-name',
 *     unit: 'px' | 'deg' | null,
 *     type: 'string' | 'number' | 'object' | 'boolean',
 *     cssProperty?: 'border-bottom-color',
 *     dependsOn?: 'orientation',
 *     variants?: { [variantKey]: { cssProperty: '...' } }
 *   }
 * }
 */
export const CSS_VAR_MAPPINGS = {\n`;

	for ( const [ blockType, attrs ] of Object.entries( mappings ) ) {
		content += `  ${ blockType }: {\n`;

		for ( const [ attrName, info ] of Object.entries( attrs ) ) {
			const unitStr = info.unit ? `'${ info.unit }'` : 'null';
			const cssPropStr = info.cssProperty ? `'${ info.cssProperty }'` : 'null';
			const dependsOnStr = info.dependsOn ? `'${ info.dependsOn }'` : 'null';
			const variantsStr = info.variants
				? JSON.stringify( info.variants, null, 6 ).replace( /\n/g, '\n      ' )
				: 'null';
			const defaultUnitStr = info.defaultUnit ? `'${ info.defaultUnit }'` : 'null';
			content += `    ${ attrName }: { cssVar: '${ info.cssVar }', unit: ${ unitStr }, defaultUnit: ${ defaultUnitStr }, type: '${ info.type }', cssProperty: ${ cssPropStr }, dependsOn: ${ dependsOnStr }, variants: ${ variantsStr } },\n`;
		}

		content += `  },\n`;
	}

	content += `};\n\n`;

	// Add helper function to compress CSS box values (top, right, bottom, left)
	content += `/**
 * Compress CSS box values using shorthand notation
 * Handles: border-width, border-color, border-style, padding, margin
 * @param {Array} values - Array of [top, right, bottom, left] values
 * @param {string} unit - CSS unit to append (empty string for non-numeric values like colors/styles)
 * @returns {string} Compressed CSS shorthand value
 */
function compressBoxValue(values, unit = '') {
  const [top, right, bottom, left] = values;
  const addUnit = (v) => unit ? \`\${v}\${unit}\` : String(v);

  // All same: "solid" or "10px"
  if (top === right && right === bottom && bottom === left) {
    return addUnit(top);
  }
  // top/bottom same AND left/right same: "solid dashed" or "10px 20px"
  if (top === bottom && left === right) {
    return \`\${addUnit(top)} \${addUnit(left)}\`;
  }
  // left equals right: "solid dashed dotted" or "10px 20px 30px"
  if (left === right) {
    return \`\${addUnit(top)} \${addUnit(right)} \${addUnit(bottom)}\`;
  }
  // All different: "solid dashed dotted none" or "10px 20px 30px 40px"
  return \`\${addUnit(top)} \${addUnit(right)} \${addUnit(bottom)} \${addUnit(left)}\`;
}

const UNIT_REGEX = /^-?\\d+(?:\\.\\d+)?\\s*([a-zA-Z%]+)$/;

function getUnitFromString(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const match = value.trim().match(UNIT_REGEX);
  return match ? match[1] : '';
}

function inferBoxUnit(value, fallbackUnit = '') {
  if (!value || typeof value !== 'object') {
    return fallbackUnit;
  }

  if (value.unit !== undefined && value.unit !== null && value.unit !== '') {
    return value.unit;
  }

  if (value.value && typeof value.value === 'object') {
    return inferBoxUnit(value.value, fallbackUnit);
  }

  const candidates = [
    value.top,
    value.right,
    value.bottom,
    value.left,
    value.topLeft,
    value.topRight,
    value.bottomRight,
    value.bottomLeft,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (typeof candidate === 'string') {
      const unit = getUnitFromString(candidate);
      if (unit) {
        return unit;
      }
      continue;
    }
    if (typeof candidate === 'object') {
      if (candidate.unit) {
        return candidate.unit;
      }
      if (typeof candidate.value === 'string') {
        const unit = getUnitFromString(candidate.value);
        if (unit) {
          return unit;
        }
      }
    }
  }

  return fallbackUnit;
}

/**
 * Format a value with its unit for CSS output
 * @param {string} attrName - Attribute name
 * @param {*} value - The value to format
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {string|null} Formatted CSS value or null if not mappable
 */
export function formatCssValue(attrName, value, blockType) {
  const mapping = CSS_VAR_MAPPINGS[blockType]?.[attrName];
  if (!mapping) return null;

  // Handle null/undefined
  if (value === null || value === undefined) return null;

  // Handle numeric objects that carry their own unit (e.g., { value, unit })
  if (
    value &&
    typeof value === 'object' &&
    value.value !== undefined &&
    value.value !== null
  ) {
    if (typeof value.value === 'string') {
      return value.value;
    }
    const fallbackUnit = mapping.unit || mapping.defaultUnit || '';
    // IMPORTANT: Enforce mapping's unit if defined (sanitizes old saved values with wrong units)
    // For rotation attrs (unit: 'deg'), this converts old '180px' values to '180deg'
    const unit = mapping.unit ? mapping.unit : (value.unit ?? fallbackUnit);
    return \`\${value.value}\${unit ?? ''}\`;
  }

  // Handle object types (border radius, padding, colors, styles)
  if (mapping.type === 'object' && typeof value === 'object') {
    // Handle responsive objects (tablet/mobile keys) - use base value (global is at root, not a device key)
    if ((value.tablet !== undefined || value.mobile !== undefined) && typeof value.value === 'object') {
      return formatCssValue(attrName, value.value, blockType);
    }

    // Border radius format: topLeft topRight bottomRight bottomLeft
    if (value.topLeft !== undefined) {
      const unit = inferBoxUnit(value, mapping.defaultUnit || mapping.unit || 'px');
      const values = [value.topLeft, value.topRight, value.bottomRight, value.bottomLeft];
      return compressBoxValue(values, unit);
    }

    // Directional properties (border-width, border-color, border-style, padding, margin)
    if (value.top !== undefined || value.right !== undefined ||
        value.bottom !== undefined || value.left !== undefined) {
      // Handle unlinked mode where each side is an object { value: X }
      const getVal = (side) => {
        const sideValue = value[side];
        if (sideValue && typeof sideValue === 'object' && sideValue.value !== undefined) {
          return sideValue.value;
        }
        return sideValue ?? '';
      };

      const values = [getVal('top'), getVal('right'), getVal('bottom'), getVal('left')];

      // Only apply unit if values are numeric (border-style/color are strings, don't need units)
      const firstValue = values.find(v => v !== '' && v !== undefined && v !== null);
      const isNumeric = typeof firstValue === 'number';
      const unit = isNumeric ? inferBoxUnit(value, mapping.defaultUnit || mapping.unit || '') : '';

      return compressBoxValue(values, unit);
    }

    // Default object handling
    return JSON.stringify(value);
  }

  // Handle array types (e.g., box-shadow layers)
  if (mapping.type === 'array' && Array.isArray(value)) {
    // Use imported buildBoxShadow function for shadow arrays
    return buildBoxShadow(value);
  }

  // Handle numeric values with units
  const numberUnit = mapping.unit || mapping.defaultUnit;
  if (numberUnit && typeof value === 'number') {
    return \`\${value}\${numberUnit}\`;
  }

  // Handle boolean values with cssValueMap
  if (mapping.type === 'boolean' && mapping.cssValueMap) {
    return mapping.cssValueMap[value.toString()];
  }

  // Handle string values with enforced units (sanitize old saved values)
  if (typeof value === 'string' && mapping.unit) {
    const match = value.match(/^([0-9.-]+)(.*)$/);
    if (match) {
      const numValue = match[1];
      const currentUnit = match[2];
      // If mapping specifies a required unit and value has wrong unit, enforce correct unit
      if (currentUnit && currentUnit !== mapping.unit) {
        return \`\${numValue}\${mapping.unit}\`;
      }
    }
  }

  // Return value as-is for strings and other types
  return value;
}

/**
 * Decompose box-like objects into per-side CSS variable assignments.
 * Handles top/right/bottom/left and border-radius corner shapes.
 *
 * @param {string} attrName - Attribute name
 * @param {*} value - Box-like value object
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {string} [suffix=''] - Optional suffix (e.g., '-tablet', '-mobile')
 * @returns {Object} Map of CSS variable names to values
 */
export function decomposeObjectToSides(attrName, value, blockType, suffix = '') {
  const mapping = CSS_VAR_MAPPINGS[blockType]?.[attrName];
  if (!mapping || !mapping.cssVar || value === null || value === undefined) return {};
  if (Array.isArray(value)) return {};

  const baseVar = mapping.cssVar;
  const linked = typeof value?.linked === 'boolean' ? value.linked : null;

  const resolveSideValue = (sideValue, fallbackUnit) => {
    if (sideValue === null || sideValue === undefined) return null;
    if (typeof sideValue === 'string') return sideValue;
    if (typeof sideValue === 'number') return '' + sideValue + (fallbackUnit || '');
    if (typeof sideValue === 'object' && sideValue.value !== undefined) {
      const unit = sideValue.unit ?? fallbackUnit ?? '';
      return '' + sideValue.value + unit;
    }
    return null;
  };

  const valuesDiffer = (resolvedValues) => {
    const filtered = resolvedValues.filter((val) => val !== null);
    if (filtered.length <= 1) return false;
    return filtered.some((val) => val !== filtered[0]);
  };

  const unitFromValue = value && typeof value === 'object'
    ? inferBoxUnit(value, mapping.defaultUnit || mapping.unit || '')
    : '';

  // Border radius corners
  if (value && typeof value === 'object' && value.topLeft !== undefined) {
    const radiusUnit = inferBoxUnit(value, mapping.defaultUnit || mapping.unit || 'px');
    const corners = {
      'top-left': value.topLeft,
      'top-right': value.topRight,
      'bottom-right': value.bottomRight,
      'bottom-left': value.bottomLeft,
    };

    const resolvedCorners = Object.entries(corners).map(([corner, cornerValue]) => ({
      corner,
      resolved: resolveSideValue(cornerValue, radiusUnit),
    }));

    const shouldEmit = linked === false || valuesDiffer(resolvedCorners.map((entry) => entry.resolved));
    if (!shouldEmit) {
      return {};
    }

    const result = {};
    resolvedCorners.forEach(({ corner, resolved }) => {
      if (resolved !== null) {
        result[baseVar + '-' + corner + suffix] = resolved;
      }
    });

    return result;
  }

  // Directional sides
  if (value && typeof value === 'object' &&
      (value.top !== undefined || value.right !== undefined ||
       value.bottom !== undefined || value.left !== undefined)) {
    const unit = unitFromValue || mapping.unit || '';
    const sides = {
      top: value.top,
      right: value.right,
      bottom: value.bottom,
      left: value.left,
    };

    const resolvedSides = Object.entries(sides).map(([side, sideValue]) => ({
      side,
      resolved: resolveSideValue(sideValue, unit),
    }));

    const shouldEmit = linked === false || valuesDiffer(resolvedSides.map((entry) => entry.resolved));
    if (!shouldEmit) {
      return {};
    }

    const result = {};
    resolvedSides.forEach(({ side, resolved }) => {
      if (resolved !== null) {
        result[baseVar + '-' + side + suffix] = resolved;
      }
    });

    return result;
  }

  return {};
}
/**
 * Get the CSS variable name for an attribute
 * @param {string} attrName - Attribute name
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {string|null} CSS variable name or null if not mappable
 */
export function getCssVarName(attrName, blockType) {
  return CSS_VAR_MAPPINGS[blockType]?.[attrName]?.cssVar || null;
}

/**
 * Resolve the CSS property for an attribute, honoring conditional variants
 * @param {string} attrName - Attribute name
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {Object} context - Values for dependency lookups (e.g., { orientation })
 * @returns {string|null} CSS property name or null
 */
export function resolveCssProperty(attrName, blockType, context = {}) {
  const mapping = CSS_VAR_MAPPINGS[blockType]?.[attrName];
  if (!mapping) return null;

  if (mapping.dependsOn && mapping.variants) {
    const depValue = context?.[mapping.dependsOn];
    const variant = (depValue && mapping.variants[depValue]) || mapping.variants._default;
    if (variant?.cssProperty) {
      return variant.cssProperty;
    }
  }

  return mapping.cssProperty || null;
}

export default CSS_VAR_MAPPINGS;
`;

	return { fileName: 'css-var-mappings-generated.js', content };
}

/**
 * Generate CSS variable declarations
 * @param blockType
 * @param schema
 */
function generateCSSVariables( blockType, schema ) {
	const fileName = `${ blockType }-variables.css`;
	const prefix = blockType;

	let content = `/**
 * CSS Variables for ${ schema.blockName } Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${ blockType }.json
 * Generated at: ${ getTimestamp() }
 *
 * This file defines CSS custom properties (variables) with default values.
 * These can be overridden by themes via class selectors.
 */

:root {\n`;

	// Collect all themeable attributes and use default values with units
	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if (
			attr.themeable &&
			attr.cssVar &&
			attr.default !== undefined &&
			attr.default !== null &&
			attr.default !== ''
		) {
			let cssValue;

			// Handle special transformValue for paddingRectangle
			if ( attr.transformValue === 'paddingRectangle' && typeof attr.default === 'number' ) {
				const vertical = attr.default;
				const horizontal = attr.default * 2;
				const unit =
					attr.unit ||
					( Array.isArray( attr.units ) && attr.units.length > 0
						? attr.units[ 0 ]
						: null ) ||
					'px';
				cssValue = `${ vertical }${ unit } ${ horizontal }${ unit }`;
			}
			// Handle object types (border radius, padding, colors, styles, etc.)
			else if ( typeof attr.default === 'object' ) {
				// Helper to get effective unit from attr.unit or attr.units[0]
				const getEffectiveUnit = ( fallback = 'px' ) => {
					return (
						attr.unit ||
						( Array.isArray( attr.units ) && attr.units.length > 0
							? attr.units[ 0 ]
							: null ) ||
						fallback
					);
				};

				// Border radius format: topLeft topRight bottomRight bottomLeft
				if ( attr.default.topLeft !== undefined ) {
					const unit = attr.default.unit || getEffectiveUnit( 'px' );
					cssValue = compressShorthand(
						attr.default.topLeft,
						attr.default.topRight,
						attr.default.bottomRight,
						attr.default.bottomLeft,
						unit
					);
				}
				// Directional format: top right bottom left (border-width, border-color, border-style, padding, margin)
				else if (
					attr.default.top !== undefined &&
					attr.default.right !== undefined &&
					attr.default.bottom !== undefined &&
					attr.default.left !== undefined
				) {
					// Use unit for numeric values, empty string for strings (colors, styles)
					const isStringValue = typeof attr.default.top === 'string';
					const unit = isStringValue ? '' : attr.default.unit || getEffectiveUnit( 'px' );
					cssValue = compressShorthand(
						attr.default.top,
						attr.default.right,
						attr.default.bottom,
						attr.default.left,
						unit
					);
				}
				// Responsive format: base value (global is at root as .value, not a device key)
				else if (
					( attr.default.tablet !== undefined || attr.default.mobile !== undefined ) &&
					typeof attr.default.value === 'object'
				) {
					const baseValue = attr.default.value;
					if (
						baseValue.top !== undefined &&
						baseValue.right !== undefined &&
						baseValue.bottom !== undefined &&
						baseValue.left !== undefined
					) {
						const isStringValue = typeof baseValue.top === 'string';
						const unit = isStringValue
							? ''
							: baseValue.unit || getEffectiveUnit( 'px' );
						cssValue = compressShorthand(
							baseValue.top,
							baseValue.right,
							baseValue.bottom,
							baseValue.left,
							unit
						);
					} else {
						// Skip other complex base objects we don't know how to handle
						continue;
					}
				} else {
					// Skip other complex objects we don't know how to handle
					continue;
				}
			} else if ( attr.type === 'number' ) {
				// Format value with unit if applicable
				// Check for explicit 'unit' property, or use first element of 'units' array
				const effectiveUnit =
					attr.unit ||
					( Array.isArray( attr.units ) && attr.units.length > 0
						? attr.units[ 0 ]
						: null );
				cssValue = effectiveUnit ? `${ attr.default }${ effectiveUnit }` : attr.default;
			} else if ( attr.type === 'boolean' && attr.cssValueMap ) {
				// Map boolean value to CSS value using cssValueMap
				cssValue = attr.cssValueMap[ attr.default.toString() ];
			} else {
				cssValue = attr.default;
			}

			content += `  --${ attr.cssVar }: ${ cssValue };\n`;

			// Add responsive variants for responsive attributes
			if ( attr.responsive === true ) {
				content += `  --${ attr.cssVar }-tablet: ${ cssValue };\n`;
				content += `  --${ attr.cssVar }-mobile: ${ cssValue };\n`;
			}
		}
	}

	content += `}\n`;

	return { fileName, content };
}

/**
 * Generate Markdown documentation
 * @param blockType
 * @param schema
 */
function generateDocumentation( blockType, schema ) {
	const fileName = `${ blockType }-attributes.md`;

	let content = getMarkdownGeneratedHeader(
		`${ blockType }.json`,
		`${ schema.blockName } Block Attributes`
	);

	content += `## Overview\n\n`;
	content += `${ schema.description }\n\n`;
	content += `- **Block Type:** \`${ schema.blockType }\`\n`;
	content += `- **Version:** ${ schema.version }\n\n`;

	// Group attributes by group
	const groupedAttrs = {};
	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		const group = attr.group || 'other';
		if ( ! groupedAttrs[ group ] ) {
			groupedAttrs[ group ] = [];
		}
		groupedAttrs[ group ].push( { name: attrName, ...attr } );
	}

	// Document each group
	for ( const [ groupName, attrs ] of Object.entries( groupedAttrs ) ) {
		const groupInfo = schema.groups?.[ groupName ] || { title: toPascalCase( groupName ) };

		content += `## ${ groupInfo.title }\n\n`;
		if ( groupInfo.description ) {
			content += `${ groupInfo.description }\n\n`;
		}

		// Create table
		content += `| Attribute | Type | Default | Themeable | Description |\n`;
		content += `|-----------|------|---------|-----------|-------------|\n`;

		for ( const attr of attrs ) {
			const defaultVal =
				attr.default === null
					? '_null_'
					: typeof attr.default === 'object'
					? '_object_'
					: `\`${ attr.default }\``;
			const themeable = attr.themeable ? 'Yes' : `No (${ attr.reason || 'N/A' })`;
			const description = attr.description || '';

			content += `| \`${ attr.name }\` | ${ attr.type } | ${ defaultVal } | ${ themeable } | ${ description } |\n`;
		}

		content += `\n`;
	}

	// CSS Variables section
	content += `## CSS Variables\n\n`;
	content += `The following CSS custom properties are available for theming:\n\n`;
	content += `| Attribute | CSS Variable |\n`;
	content += `|-----------|-------------|\n`;

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if ( attr.themeable && attr.cssVar ) {
			content += `| \`${ attrName }\` | \`--${ attr.cssVar }\` |\n`;
		}
	}

	content += `\n`;

	return { fileName, content };
}

/**
 * Generate JavaScript block attributes for WordPress
 * @param blockType
 * @param schema
 */
function generateBlockAttributes( blockType, schema ) {
	const fileName = `${ blockType }-attributes.js`;
	const constName = `${ blockType }Attributes`;

	let content = getGeneratedHeader(
		`${ blockType }.json`,
		`Block Attributes for ${ schema.blockName }`
	);

	content += `/**
 * Block Attributes for ${ schema.blockName }
 *
 * These attributes define the block's data structure for WordPress.
 * Auto-generated from schema - DO NOT edit manually.
 */\n`;

	content += `export const ${ constName } = {\n`;

	// Collect responsive attribute names for auto-generating responsiveEnabled
	const responsiveAttrs = [];

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		// Track responsive attributes
		if ( attr.responsive === true ) {
			responsiveAttrs.push( attrName );
		}

		// Map schema types to WordPress types
		let wpType = 'string';
		if ( attr.type === 'number' ) {
			wpType = 'number';
		} else if ( attr.type === 'boolean' ) {
			wpType = 'boolean';
		} else if ( attr.type === 'object' ) {
			wpType = 'object';
		} else if ( attr.type === 'array' ) {
			wpType = 'array';
		}

		// Format default value for JavaScript
		let defaultValue;
		if ( attr.default === null || attr.default === undefined ) {
			defaultValue = 'null';
		} else if ( typeof attr.default === 'string' ) {
			defaultValue = `'${ attr.default.replace( /'/g, "\\'" ) }'`;
		} else if ( typeof attr.default === 'object' ) {
			defaultValue = JSON.stringify( attr.default );
		} else {
			defaultValue = String( attr.default );
		}

		content += `  ${ attrName }: {\n`;
		content += `    type: '${ wpType }',\n`;
		content += `    default: ${ defaultValue },\n`;
		content += `  },\n`;
	}

	// Auto-generate responsiveEnabled attribute if there are responsive attributes
	if ( responsiveAttrs.length > 0 ) {
		const responsiveEnabledDefaults = {};
		responsiveAttrs.forEach( ( name ) => {
			responsiveEnabledDefaults[ name ] = false;
		} );

		content += `  // Auto-generated: tracks which responsive attributes have responsive mode enabled\n`;
		content += `  responsiveEnabled: {\n`;
		content += `    type: 'object',\n`;
		content += `    default: ${ JSON.stringify( responsiveEnabledDefaults ) },\n`;
		content += `  },\n`;
	}

	content += `};\n\n`;
	content += `export default ${ constName };\n`;

	return { fileName, content };
}

/**
 * Generate control configuration from schemas
 * Exports min/max/options for all controls so components don't hardcode values
 * @param allSchemas
 */
function generateControlConfigs( allSchemas ) {
	const fileName = 'control-config-generated.js';

	let content = getGeneratedHeader(
		'accordion.json, tabs.json, toc.json',
		'Control Configuration'
	);

	content += `/**
 * This file contains control configuration (min, max, options) for all block attributes.
 * Import this to get dynamic control properties from the schema instead of hardcoding.
 *
 * Usage:
 *   import { getControlConfig } from '@shared/config/control-config-generated';
 *   const config = getControlConfig('accordion', 'iconRotation');
 *   // { min: 0, max: 360, unit: 'deg', ... }
 */

// Control configuration for all blocks
const CONTROL_CONFIGS = {
`;

	// Build config for each block
	for ( const [ blockType, schema ] of Object.entries( allSchemas ) ) {
		content += `  '${ blockType }': {\n`;

		for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
			// Skip attributes without controls
			if ( ! attr.control ) {
				continue;
			}

			content += `    '${ attrName }': {\n`;
			content += `      control: '${ attr.control }',\n`;

			// Add min/max/step for RangeControl and SliderWithInput
			if ( attr.control === 'RangeControl' || attr.control === 'SliderWithInput' ) {
				if ( attr.min !== undefined ) {
					content += `      min: ${ attr.min },\n`;
				}
				if ( attr.max !== undefined ) {
					content += `      max: ${ attr.max },\n`;
				}
				if ( attr.step !== undefined ) {
					content += `      step: ${ attr.step },\n`;
				}
			}

			// Add options for SelectControl and similar
			if (
				( attr.control === 'SelectControl' || attr.control === 'IconPicker' ) &&
				attr.options
			) {
				content += `      options: ${ JSON.stringify( attr.options, null, 8 ).replace(
					/\n/g,
					'\n      '
				) },\n`;
			}

			// Add allowedPositions for IconPositionControl
			if ( attr.control === 'IconPositionControl' && attr.allowedPositions ) {
				content += `      allowedPositions: ${ JSON.stringify(
					attr.allowedPositions
				) },\n`;
			}

			// Add unit if present
			if ( attr.unit ) {
				content += `      unit: '${ attr.unit }',\n`;
			}

			// Add responsive flag
			if ( attr.responsive !== undefined ) {
				content += `      responsive: ${ attr.responsive },\n`;
			}

			// Add conditionalRender if present
			if ( attr.conditionalRender ) {
				content += `      conditionalRender: '${ attr.conditionalRender }',\n`;
			}

			// Add showWhen if present
			if ( attr.showWhen ) {
				content += `      showWhen: ${ JSON.stringify( attr.showWhen ) },\n`;
			}

			// Add disabledWhen if present
			if ( attr.disabledWhen ) {
				content += `      disabledWhen: ${ JSON.stringify( attr.disabledWhen ) },\n`;
			}

			// Add subgroup if present
			if ( attr.subgroup ) {
				content += `      subgroup: '${ attr.subgroup }',\n`;
			}

			// Add other useful metadata
			if ( attr.label ) {
				content += `      label: '${ attr.label }',\n`;
			}
			if ( attr.description ) {
				const desc = attr.description.replace( /'/g, "\\\\'" );
				content += `      description: '${ desc }',\n`;
			}
			if ( attr.default !== undefined && typeof attr.default !== 'object' ) {
				content += `      default: ${
					typeof attr.default === 'string' ? `'${ attr.default }'` : attr.default
				},\n`;
			} else if ( attr.default !== undefined && typeof attr.default === 'object' ) {
				content += `      default: ${ JSON.stringify( attr.default ) },\n`;
			}

			content += `    },\n`;
		}

		content += `  },\n`;
	}

	content += `};\n\n`;

	// Add helper functions
	content += `/**
 * Get control configuration for a specific attribute
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @param {string} attrName - The attribute name
 * @returns {Object} Control configuration object
 */
export function getControlConfig(blockType, attrName) {
  return CONTROL_CONFIGS[blockType]?.[attrName] || {};
}

/**
 * Get all control configs for a block type
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @returns {Object} All control configurations for the block
 */
export function getBlockControlConfigs(blockType) {
  return CONTROL_CONFIGS[blockType] || {};
}

/**
 * Extract numeric value from a default that may include units (e.g., "18px" -> 18)
 * @param {string|number|null} defaultValue - The default value from schema
 * @returns {number|null} The numeric value without units
 */
export function getNumericDefault(defaultValue) {
  if (defaultValue === null || defaultValue === undefined) {
    return null;
  }

  if (typeof defaultValue === 'number') {
    return defaultValue;
  }

  if (typeof defaultValue === 'string') {
    // Extract number from strings like "18px", "1.6", "180deg"
    const match = defaultValue.match(/^(-?\\d+(?:\\.\\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }

  return null;
}

/**
 * Get the numeric default for use in RangeControl
 * Shorthand for: getNumericDefault(getControlConfig(blockType, attrName).default)
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @param {string} attrName - The attribute name
 * @returns {number|null} The numeric default value
 */
export function getNumericControlDefault(blockType, attrName) {
  const config = getControlConfig(blockType, attrName);
  return getNumericDefault(config.default);
}

export default CONTROL_CONFIGS;
`;

	return { fileName, content };
}

// ============================================================================
// Code Injection System
// ============================================================================

/**
 * Escape string for use in regular expressions
 * @param {string} string - The string to escape
 * @return {string} Escaped string safe for regex
 */
function escapeRegex( string ) {
	return string.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
}

/**
 * Inject generated code between marker comments in a manual file
 *
 * @param {string}  filePath              - Absolute path to the file to inject into
 * @param {string}  markerName            - Unique marker identifier (e.g., 'STYLES', 'DEFAULTS')
 * @param {string}  generatedCode         - The code to inject between markers
 * @param {Object}  options               - Optional configuration
 * @param {boolean} options.backup        - Whether to backup before injection (default: true)
 * @param {boolean} options.warnIfMissing - Log warning if markers not found (default: true)
 * @return {Object} Result object with success status and details
 */
function injectCodeIntoFile( filePath, markerName, generatedCode, options = {} ) {
	const { backup = true, warnIfMissing = true } = options;

	try {
		// Check if file exists
		if ( ! fs.existsSync( filePath ) ) {
			return {
				success: false,
				error: `File not found: ${ filePath }`,
				action: 'skipped',
			};
		}

		// Read current file content
		const originalContent = fs.readFileSync( filePath, 'utf8' );

		// Define marker format
		const startMarker = `/* ========== AUTO-GENERATED-${ markerName }-START ========== */`;
		const endMarker = `/* ========== AUTO-GENERATED-${ markerName }-END ========== */`;

		// Check if markers exist
		const hasStartMarker = originalContent.includes( startMarker );
		const hasEndMarker = originalContent.includes( endMarker );

		if ( ! hasStartMarker || ! hasEndMarker ) {
			if ( warnIfMissing ) {
				console.warn(
					`  ⚠️  Warning: Markers not found in ${ path.basename(
						filePath
					) } (${ markerName })`
				);
			}
			return {
				success: false,
				error: 'Markers not found',
				action: 'skipped',
				missingMarkers: {
					start: ! hasStartMarker,
					end: ! hasEndMarker,
				},
			};
		}

		// Create backup if requested
		if ( backup ) {
			const backupPath = `${ filePath }.backup`;
			fs.writeFileSync( backupPath, originalContent, 'utf8' );
		}

		// Build the injection block with markers and generated code
		const injectionBlock = `${ startMarker }\n// DO NOT EDIT - This code is auto-generated from schema\n${ generatedCode }\n${ endMarker }`;

		// Create regex to match content between markers (including markers)
		const regex = new RegExp(
			`${ escapeRegex( startMarker ) }[\\s\\S]*?${ escapeRegex( endMarker ) }`,
			'g'
		);

		// Replace content between markers
		const newContent = originalContent.replace( regex, injectionBlock );

		// Check if content changed (it's OK if unchanged - means code is up-to-date)
		if ( newContent === originalContent ) {
			return {
				success: true,
				action: 'unchanged',
				linesInjected: generatedCode.split( '\n' ).length,
				marker: markerName,
			};
		}

		// Write updated content
		fs.writeFileSync( filePath, newContent, 'utf8' );

		return {
			success: true,
			action: 'injected',
			linesInjected: generatedCode.split( '\n' ).length,
			marker: markerName,
		};
	} catch ( error ) {
		return {
			success: false,
			error: error.message,
			action: 'error',
		};
	}
}

/**
 * Generate inline styles function code from schema
 * This creates the getInlineStyles() function for edit.js
 *
 * NOTE: This is a simplified version that generates a placeholder.
 * Full implementation requires cssSelector and cssProperty fields in schema.
 * For v1, we keep manual getInlineStyles() functions and use markers for future automation.
 *
 * @param {Object} schema    - Block schema with attributes
 * @param {string} blockType - Block type name (accordion, tabs, toc)
 * @return {string} Generated JavaScript code
 */
function generateInlineStylesFunction( schema, blockType ) {
	const code = [];

	// Check if schema uses ShadowPanel control (requires shadow utility imports)
	const usesShadowPanel = Object.values( schema.attributes ).some(
		( attr ) => attr.control === 'ShadowPanel' && attr.themeable
	);

	// Check which shadow functions are needed
	const needsBoxShadow = Object.values( schema.attributes ).some(
		( attr ) =>
			attr.control === 'ShadowPanel' && attr.cssProperty === 'box-shadow' && attr.themeable
	);
	const needsTextShadow = Object.values( schema.attributes ).some(
		( attr ) =>
			attr.control === 'ShadowPanel' && attr.cssProperty === 'text-shadow' && attr.themeable
	);

	code.push( `// AUTO-GENERATED from schemas/${ blockType }.json` );
	code.push( `// To modify styles, update the schema and run: npm run schema:build` );
	if ( usesShadowPanel ) {
		const shadowImports = [];
		if ( needsBoxShadow ) {
			shadowImports.push( 'buildBoxShadow' );
		}
		if ( needsTextShadow ) {
			shadowImports.push( 'buildTextShadow' );
		}
		code.push(
			`// REQUIRED IMPORT: Ensure ${ shadowImports.join(
				', '
			) } imported from @shared/utils in edit.js`
		);
	}
	code.push( `` );
	code.push( `const getInlineStyles = (responsiveDevice = 'global') => {` );
	code.push( `  // Extract object-type attributes with fallbacks` );

	// Find all object-type attributes (padding, border radius, etc.)
	const objectAttrs = Object.entries( schema.attributes ).filter(
		( [ , attr ] ) => attr.type === 'object' && attr.themeable
	);

	for ( const [ attrName, attr ] of objectAttrs ) {
		const defaultValue = JSON.stringify( attr.default || {}, null, 4 ).replace(
			/\n/g,
			'\n\t\t'
		);
		code.push( `\tconst ${ attrName } = effectiveValues.${ attrName } || ${ defaultValue };` );
	}

	code.push( `` );
	code.push( `\treturn {` );

	// Map CSS selectors to simplified keys (container, title, content, icon, text nodes)
	const selectorMap = {
		container: [],
		title: [],
		titleText: [],
		content: [],
		icon: [],
		tabButtonText: [],
	};

	// Helper to normalize appliesTo to array
	const normalizeAppliesTo = ( appliesTo ) => {
		if ( ! appliesTo ) {
			return [];
		}
		return Array.isArray( appliesTo ) ? appliesTo : [ appliesTo ];
	};

	// Track which elements have needsMapping (for skipping entire elements)
	const elementsWithManualRendering = new Set();
	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if ( attr.needsMapping && attr.appliesTo ) {
			normalizeAppliesTo( attr.appliesTo ).forEach( ( el ) =>
				elementsWithManualRendering.add( el )
			);
		}
	}

	// Group attributes by simplified selector names
	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if ( ! attr.themeable || ! attr.cssProperty ) {
			continue;
		}
		if ( attr.outputsCSS === false ) {
			continue;
		}

		// EXCLUDE state-specific attributes from editor inline styles
		// Method 1: Check schema's "state" field (preferred - from schema cleanup)
		if ( attr.state ) {
			continue; // Skip non-base states (hover, active, focus, visited, disabled)
		}

		// Determine selector group from appliesTo field
		if ( ! attr.appliesTo ) {
			console.warn(
				`[schema-compiler] Attribute "${ attrName }" in ${ blockType } schema missing "appliesTo" field - skipping`
			);
			continue;
		}

		// Normalize appliesTo to array and use first element for style mapping
		// (Multiple elements share the same style, so we just need one for mapping)
		const appliesToElements = normalizeAppliesTo( attr.appliesTo );
		const appliesTo = appliesToElements[ 0 ];

		// Skip elements that need manual rendering (needsMapping: true)
		if ( appliesToElements.some( ( el ) => elementsWithManualRendering.has( el ) ) ) {
			continue; // Manual function handles this element's styles
		}

		// Map appliesTo to selector keys for inline styles
		const styleKeyMap = {
			// Tabs
			tabIcon: 'icon',
			tabButtonText: 'tabButtonText',
			tabsList: 'tabList',
			tabPanel: 'panel',
			wrapper: 'container',
			// TOC
			tocTitle: 'title',
			// Accordion
			accordionTitle: 'title',
			accordionContent: 'content',
			accordionItem: 'container',
			accordionIcon: 'icon',
			item: 'container', // Accordion item wrapper
			titleText: 'titleText',
			// Generic fallbacks
			title: 'title',
			titleStatic: 'title',
			content: 'content',
			icon: 'icon',
		};

		const selectorKey = styleKeyMap[ appliesTo ];

		if ( ! selectorKey ) {
			// Unknown appliesTo - skip with warning if not a known skip case
			const knownSkipElements = [
				'tocLink',
				'tocList',
				'link',
				'list',
				'collapseIcon',
				'tabButton',
				'level1Link',
				'level2Link',
				'level3PlusLink',
				'h1Link',
				'h2Link',
				'h3Link',
				'h4Link',
				'h5Link',
				'h6Link',
				'numberingStyle',
			];
			if ( ! knownSkipElements.includes( appliesTo ) ) {
				console.warn(
					`[schema-compiler] Unknown appliesTo value "${ appliesTo }" for attribute "${ attrName }" in ${ blockType } schema - skipping`
				);
			}
			continue;
		}

		// Ensure the selector key exists in selectorMap
		if ( ! selectorMap[ selectorKey ] ) {
			selectorMap[ selectorKey ] = [];
		}

		selectorMap[ selectorKey ].push( { attrName, attr } );
	}

	// Generate styles for each selector
	for ( const [ selector, attrs ] of Object.entries( selectorMap ) ) {
		if ( attrs.length === 0 ) {
			continue;
		}

		code.push( `\t\t${ selector }: {` );

		// Track which CSS properties we've already added to avoid duplicates
		const addedProperties = new Set();

		for ( const { attrName, attr } of attrs ) {
			const cssProperty = attr.cssProperty;
			const defaultValue = attr.default;

			// Skip if we've already added this CSS property (unless it's an Appearance control)
			if (
				cssProperty &&
				addedProperties.has( cssProperty ) &&
				attr.control !== 'AppearanceControl'
			) {
				continue;
			}
			if ( cssProperty ) {
				addedProperties.add( cssProperty );
			}

			// Format the style value based on type
			let styleValue;

			// Special handling for AppearanceControl (font weight + style)
			if ( attr.control === 'AppearanceControl' && attr.type === 'object' ) {
				const defaultWeight = defaultValue?.weight || '400';
				const defaultStyle = defaultValue?.style || 'normal';
				code.push(
					`\t\t\tfontWeight: effectiveValues.${ attrName }?.weight || '${ defaultWeight }',`
				);
				code.push(
					`\t\t\tfontStyle: effectiveValues.${ attrName }?.style || '${ defaultStyle }',`
				);
				continue; // Already handled, skip the rest
			}

			// Special handling for ShadowPanel (box-shadow or text-shadow array)
			if ( attr.control === 'ShadowPanel' && attr.type === 'array' ) {
				// Convert CSS property to camelCase for valid JavaScript
				const jsProperty = toCamelCase( cssProperty );
				// Use buildTextShadow for text-shadow, buildBoxShadow for box-shadow
				const shadowFunction =
					cssProperty === 'text-shadow' ? 'buildTextShadow' : 'buildBoxShadow';
				code.push(
					`\t\t\t${ jsProperty }: ${ shadowFunction }(effectiveValues.${ attrName }),`
				);
				continue; // Already handled, skip the rest
			}

			// Special handling for transform property (must use CSS functions like rotate())
			if ( cssProperty === 'transform' ) {
				const quotedDefault = ( defaultValue + '' ).replace( /'/g, "\\'" );
				const jsProperty = toCamelCase( cssProperty );
				// Wrap value in rotate() function for transform property
				code.push(
					`\t\t\t${ jsProperty }: \`rotate(\${effectiveValues.${ attrName } ?? '${ quotedDefault }'})\`,`
				);
				continue; // Already handled, skip the rest
			}

			if ( attr.type === 'object' ) {
				// Handle objects like padding/border-radius
				if ( attrName.includes( 'Padding' ) ) {
					// Padding uses full shorthand (all 4 sides)
					if ( attr.responsive ) {
						const valVar = `${ attrName }Val`;
						styleValue = `(() => { const ${ valVar } = ${ attrName }[responsiveDevice] || ${ attrName }; const unit = ${ valVar }.unit || 'px'; return \`\${${ valVar }.top || 0}\${unit} \${${ valVar }.right || 0}\${unit} \${${ valVar }.bottom || 0}\${unit} \${${ valVar }.left || 0}\${unit}\`; })()`;
					} else {
						styleValue = `\`\${${ attrName }.top || 0}px \${${ attrName }.right || 0}px \${${ attrName }.bottom || 0}px \${${ attrName }.left || 0}px\``;
					}
				} else if ( attrName.includes( 'Margin' ) && attr.control === 'CompactMargin' ) {
					// CompactMargin only controls top/bottom - generate separate properties
					// to avoid overriding horizontal alignment margins (left/right)
					// This is handled specially below - skip the shorthand generation
					styleValue = null; // Will be handled as separate properties
				} else if ( attrName.includes( 'Margin' ) ) {
					// Full margin shorthand (all 4 sides)
					if ( attr.responsive ) {
						const valVar = `${ attrName }Val`;
						styleValue = `(() => { const ${ valVar } = ${ attrName }[responsiveDevice] || ${ attrName }; const unit = ${ valVar }.unit || 'px'; return \`\${${ valVar }.top || 0}\${unit} \${${ valVar }.right || 0}\${unit} \${${ valVar }.bottom || 0}\${unit} \${${ valVar }.left || 0}\${unit}\`; })()`;
					} else {
						styleValue = `\`\${${ attrName }.top || 0}px \${${ attrName }.right || 0}px \${${ attrName }.bottom || 0}px \${${ attrName }.left || 0}px\``;
					}
				} else if ( attrName.includes( 'Radius' ) ) {
					styleValue = `\`\${${ attrName }.topLeft}px \${${ attrName }.topRight}px \${${ attrName }.bottomRight}px \${${ attrName }.bottomLeft}px\``;
				}
			} else if ( attr.type === 'number' ) {
				// Number with unit - use attr.unit or first value from units array
				const unit = attr.unit || ( attr.units && attr.units[ 0 ] ) || '';

				// Quote string defaults (e.g., "0px", "1rem") for valid JS output
				const quotedDefault =
					typeof defaultValue === 'string' ? `'${ defaultValue }'` : defaultValue;

				if ( attr.responsive ) {
					// Responsive number - value can be:
					// - flat number: 1.125
					// - object with value/unit: { value: 1.5, unit: 'rem' }
					// - object with device overrides: { value: 1.5, unit: 'rem', tablet: 1.0 }
					if ( unit ) {
						styleValue = `(() => { const rawVal = effectiveValues.${ attrName }; if (rawVal === undefined || rawVal === null) return ${ quotedDefault }; if (typeof rawVal === 'number') return \`\${rawVal}${ unit }\`; const deviceVal = rawVal[responsiveDevice] ?? rawVal.value ?? ${ quotedDefault }; const unitVal = rawVal.unit ?? '${ unit }'; return \`\${typeof deviceVal === 'object' ? deviceVal.value : deviceVal}\${typeof deviceVal === 'object' && deviceVal.unit ? deviceVal.unit : unitVal}\`; })()`;
					} else {
						// Unitless responsive number (e.g., line-height)
						styleValue = `(() => { const rawVal = effectiveValues.${ attrName }; if (rawVal === undefined || rawVal === null) return ${ quotedDefault }; if (typeof rawVal === 'number') return rawVal; return rawVal[responsiveDevice] ?? rawVal.value ?? ${ quotedDefault }; })()`;
					}
				} else {
					// Non-responsive number
					if ( unit ) {
						styleValue = `\`\${effectiveValues.${ attrName } ?? ${ quotedDefault }}${ unit }\``;
					} else {
						// Unitless number (e.g., line-height) or string with unit
						styleValue = `effectiveValues.${ attrName } ?? ${ quotedDefault }`;
					}
				}
			} else if ( attr.type === 'string' ) {
				// String value with proper quoting
				const quotedDefault = String( defaultValue ).replace( /'/g, "\\'" );
				if ( attr.responsive ) {
					// Responsive string - value can be:
					// - Flat string: "1.125rem"
					// - Flat object: { value: 1.125, unit: "rem" }
					// - With device overrides: { value: 1.125, unit: "rem", tablet: { value: 1, unit: "rem" } }
					styleValue = `(() => { const val = effectiveValues.${ attrName }; if (val === null || val === undefined) return '${ quotedDefault }'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object') { const deviceVal = val[responsiveDevice]; if (deviceVal !== undefined) { if (typeof deviceVal === 'string') return deviceVal; if (typeof deviceVal === 'number') return deviceVal; if (typeof deviceVal === 'object' && deviceVal.value !== undefined) { return \`\${deviceVal.value}\${deviceVal.unit || ''}\`; } return deviceVal; } if (val.value !== undefined) { return \`\${val.value}\${val.unit || ''}\`; } } return '${ quotedDefault }'; })()`;
				} else {
					// Non-responsive string - value can be a plain string or { value, unit } object from SliderWithInput
					styleValue = `(() => { const val = effectiveValues.${ attrName }; if (val === null || val === undefined) return '${ quotedDefault }'; if (typeof val === 'string') return val; if (typeof val === 'number') return val; if (typeof val === 'object' && val.value !== undefined) { return \`\${val.value}\${val.unit || ''}\`; } return '${ quotedDefault }'; })()`;
				}
			} else if ( attr.type === 'boolean' ) {
				// Boolean (usually for display property)
				styleValue = `effectiveValues.${ attrName } ? 'flex' : 'none'`;
			}

			if ( styleValue ) {
				// Convert CSS property to camelCase for valid JavaScript
				const jsProperty = toCamelCase( cssProperty );
				code.push( `\t\t\t${ jsProperty }: ${ styleValue },` );
			} else if ( attrName.includes( 'Margin' ) && attr.control === 'CompactMargin' ) {
				// CompactMargin: Generate separate marginTop and marginBottom
				// This avoids overriding horizontal alignment margins (left/right set by useBlockAlignment)
				if ( attr.responsive ) {
					const valVar = `${ attrName }Val`;
					code.push(
						`\t\t\tmarginTop: (() => { const ${ valVar } = ${ attrName }[responsiveDevice] || ${ attrName }; return \`\${${ valVar }.top || 0}\${${ valVar }.unit || 'px'}\`; })(),`
					);
					code.push(
						`\t\t\tmarginBottom: (() => { const ${ valVar } = ${ attrName }[responsiveDevice] || ${ attrName }; return \`\${${ valVar }.bottom || 0}\${${ valVar }.unit || 'px'}\`; })(),`
					);
				} else {
					code.push(
						`\t\t\tmarginTop: \`\${${ attrName }.top || 0}\${${ attrName }.unit || 'px'}\`,`
					);
					code.push(
						`\t\t\tmarginBottom: \`\${${ attrName }.bottom || 0}\${${ attrName }.unit || 'px'}\`,`
					);
				}
			}
		}

		code.push( `\t\t},` );
	}

	code.push( `\t};` );
	code.push( `};` );

	return code.join( '\n' );
}

/**
 * Generate customization styles function for save.js
 * This creates the getCustomizationStyles() function
 *
 * @param {string} blockType - Block type name (accordion, tabs, toc)
 * @return {string} Generated JavaScript code
 */
function generateCustomizationStylesFunction( blockType ) {
	const code = [];

	code.push( `const getCustomizationStyles = () => {` );
	code.push( `  const styles = {};` );
	code.push( `` );
	code.push( `  // Get customizations (deltas from expected values, calculated in edit.js)` );
	code.push( `  const customizations = attributes.customizations || {};` );
	code.push( `` );
	code.push( `  // Process each customization using schema-generated mappings` );
	code.push( `  Object.entries(customizations).forEach(([attrName, value]) => {` );
	code.push( `    if (value === null || value === undefined) {` );
	code.push( `      return;` );
	code.push( `    }` );
	code.push( `` );
	code.push( `    // Get CSS variable name from generated mappings` );
	code.push( `    const cssVar = getCssVarName(attrName, '${ blockType }');` );
	code.push( `    if (!cssVar) {` );
	code.push( `      return; // Attribute not mapped to a CSS variable` );
	code.push( `    }` );
	code.push( `` );
	code.push( `    const isResponsiveValue = value && typeof value === 'object' &&` );
	code.push( `      (value.tablet !== undefined || value.mobile !== undefined);` );
	code.push( `` );
	code.push( `    if (isResponsiveValue) {` );
	code.push( `      // Base (global) is at root level as value.value, not a device key` );
	code.push( `      const baseValue = value.value !== undefined ? value.value : value;` );
	code.push( `      if (baseValue !== null && baseValue !== undefined) {` );
	code.push(
		`        const formattedGlobal = formatCssValue(attrName, baseValue, '${ blockType }');`
	);
	code.push( `        if (formattedGlobal !== null) {` );
	code.push( `          styles[cssVar] = formattedGlobal;` );
	code.push( `        }` );
	code.push( `      }` );
	code.push( `` );
	code.push( `      if (value.tablet !== undefined && value.tablet !== null) {` );
	code.push(
		`        const formattedTablet = formatCssValue(attrName, value.tablet, '${ blockType }');`
	);
	code.push( `        if (formattedTablet !== null) {` );
	code.push( `          styles[\`\${cssVar}-tablet\`] = formattedTablet;` );
	code.push( `        }` );
	code.push( `      }` );
	code.push( `` );
	code.push( `      if (value.mobile !== undefined && value.mobile !== null) {` );
	code.push(
		`        const formattedMobile = formatCssValue(attrName, value.mobile, '${ blockType }');`
	);
	code.push( `        if (formattedMobile !== null) {` );
	code.push( `          styles[\`\${cssVar}-mobile\`] = formattedMobile;` );
	code.push( `        }` );
	code.push( `      }` );
	code.push( `      return;` );
	code.push( `    }` );
	code.push( `` );
	code.push( `    // Format value with proper unit from generated mappings` );
	code.push( `    const formattedValue = formatCssValue(attrName, value, '${ blockType }');` );
	code.push( `    if (formattedValue !== null) {` );
	code.push( `      styles[cssVar] = formattedValue;` );
	code.push( `    }` );
	code.push( `  });` );
	code.push( `` );
	code.push( `  return styles;` );
	code.push( `};` );

	return code.join( '\n' );
}

/**
 * Validate schema-mapping synchronization
 * Ensures elements with needsMapping=true have corresponding manual render entries
 *
 * @param {Object} schema    - Block schema
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @return {boolean} True if validation passes
 */
function validateSchemaMappingSync( schema, blockType ) {
	// Helper to normalize appliesTo to array
	const normalizeAppliesTo = ( appliesTo ) => {
		if ( ! appliesTo ) {
			return [];
		}
		return Array.isArray( appliesTo ) ? appliesTo : [ appliesTo ];
	};

	// Elements that should have manual rendering (from schema)
	const needsMapping = new Set();

	Object.entries( schema.attributes ).forEach( ( [ attrName, attr ] ) => {
		if ( attr.needsMapping && attr.appliesTo ) {
			normalizeAppliesTo( attr.appliesTo ).forEach( ( el ) => needsMapping.add( el ) );
		}
	} );

	// Elements that actually have manual rendering (hardcoded for now)
	// NOTE: This list should match what's actually in edit.js manual functions
	const manualRenderElements = {
		tabs: [ 'tabButton' ], // Has manual styles.tabButton() function
		accordion: [], // No manual functions currently
		toc: [], // No manual functions currently
	};

	const hasMappings = new Set( manualRenderElements[ blockType ] || [] );

	// Forward validation: Schema → Manual code
	const missing = [ ...needsMapping ].filter( ( el ) => ! hasMappings.has( el ) );
	if ( missing.length > 0 ) {
		console.warn(
			`\n⚠️  Schema-Mapping Warning for ${ blockType }:\n\n` +
				`   Schema declares these elements need manual rendering:\n` +
				`   ${ missing.map( ( el ) => `- ${ el }` ).join( '\n   ' ) }\n\n` +
				`   But no manual render function found in edit.js.\n\n` +
				`   Note: If manual functions exist, update manualRenderElements in schema-compiler.js\n`
		);
	}

	// Reverse validation: Manual code → Schema
	const zombies = [ ...hasMappings ].filter( ( el ) => ! needsMapping.has( el ) );
	if ( zombies.length > 0 ) {
		console.warn(
			`\n⚠️  Schema-Mapping Warning for ${ blockType }:\n\n` +
				`   Manual render functions exist for:\n` +
				`   ${ zombies.map( ( el ) => `- ${ el }` ).join( '\n   ' ) }\n\n` +
				`   But schema doesn't declare needsMapping=true.\n\n` +
				`   Fix: Add needsMapping=true to one attribute with appliesTo="${ zombies[ 0 ] }"\n`
		);
	}

	// Only output if there are issues - silent on success
	return missing.length === 0;
}

/**
 * Inject code into all block edit.js and save.js files
 *
 * @param {Object} schemas - All loaded schemas by block type
 * @return {Object} Summary of injection results
 */
function injectCodeIntoBlocks( schemas ) {
	const results = {
		success: [],
		skipped: [],
		errors: [],
		changed: 0,
	};

	for ( const [ blockType, schema ] of Object.entries( schemas ) ) {
		const blockDir = path.join( OUTPUT_DIRS.blockAttributes, blockType, 'src' );
		const editPath = path.join( blockDir, 'edit.js' );
		const savePath = path.join( blockDir, 'save.js' );

		// Inject into edit.js - STYLES marker
		const editStylesCode = generateInlineStylesFunction( schema, blockType );
		const editResult = injectCodeIntoFile( editPath, 'STYLES', editStylesCode, {
			backup: false, // Don't create backups for now
			warnIfMissing: false, // Don't warn on first run
		} );

		if ( editResult.success ) {
			results.success.push( `${ blockType }/edit.js (STYLES)` );
			if ( editResult.action === 'injected' ) {
				results.changed++;
				console.log(
					`  ✓ ${ blockType }/edit.js - Injected ${ editResult.linesInjected } lines`
				);
			}
		} else if ( editResult.action === 'skipped' ) {
			results.skipped.push( `${ blockType }/edit.js (STYLES - markers not found)` );
		} else {
			results.errors.push( `${ blockType }/edit.js: ${ editResult.error }` );
			console.log( `  ✗ ${ blockType }/edit.js - Error: ${ editResult.error }` );
		}

		// Inject into save.js - CUSTOMIZATION-STYLES marker
		const saveStylesCode = generateCustomizationStylesFunction( blockType );
		const saveResult = injectCodeIntoFile( savePath, 'CUSTOMIZATION-STYLES', saveStylesCode, {
			backup: false,
			warnIfMissing: false,
		} );

		if ( saveResult.success ) {
			results.success.push( `${ blockType }/save.js (CUSTOMIZATION-STYLES)` );
			if ( saveResult.action === 'injected' ) {
				results.changed++;
				console.log(
					`  ✓ ${ blockType }/save.js - Injected ${ saveResult.linesInjected } lines`
				);
			}
		} else if ( saveResult.action === 'skipped' ) {
			results.skipped.push(
				`${ blockType }/save.js (CUSTOMIZATION-STYLES - markers not found)`
			);
		} else {
			results.errors.push( `${ blockType }/save.js: ${ saveResult.error }` );
			console.log( `  ✗ ${ blockType }/save.js - Error: ${ saveResult.error }` );
		}

		// ========================================
		// Structure JSX Generation
		// ========================================
		// Load structure mapping and inject JSX for both edit and save modes
		const structureMappingPath = path.join(
			SCHEMAS_DIR,
			`${ blockType }-structure-mapping-autogenerated.json`
		);

		if ( fs.existsSync( structureMappingPath ) ) {
			try {
				const structureMapping = JSON.parse(
					fs.readFileSync( structureMappingPath, 'utf8' )
				);

				// Inject into save.js - RENDER-TITLE marker
				const saveJsx = generateStructureJsx( structureMapping, 'save' );
				const saveJsxResult = injectCodeIntoFile( savePath, 'RENDER-TITLE', saveJsx, {
					backup: false,
					warnIfMissing: false,
				} );

				if ( saveJsxResult.success ) {
					results.success.push( `${ blockType }/save.js (RENDER-TITLE)` );
					if ( saveJsxResult.action === 'injected' ) {
						results.changed++;
						console.log(
							`  ✓ ${ blockType }/save.js - Injected ${ saveJsxResult.linesInjected } lines (JSX)`
						);
					}
				} else if ( saveJsxResult.action === 'skipped' ) {
					results.skipped.push(
						`${ blockType }/save.js (RENDER-TITLE - markers not found)`
					);
				} else {
					results.errors.push( `${ blockType }/save.js (RENDER-TITLE): ${ saveJsxResult.error }` );
					console.log( `  ✗ ${ blockType }/save.js (RENDER-TITLE) - Error: ${ saveJsxResult.error }` );
				}

				// Inject into edit.js - RENDER-TITLE marker
				const editJsx = generateStructureJsx( structureMapping, 'edit' );
				const editJsxResult = injectCodeIntoFile( editPath, 'RENDER-TITLE', editJsx, {
					backup: false,
					warnIfMissing: false,
				} );

				if ( editJsxResult.success ) {
					results.success.push( `${ blockType }/edit.js (RENDER-TITLE)` );
					if ( editJsxResult.action === 'injected' ) {
						results.changed++;
						console.log(
							`  ✓ ${ blockType }/edit.js - Injected ${ editJsxResult.linesInjected } lines (JSX)`
						);
					}
				} else if ( editJsxResult.action === 'skipped' ) {
					results.skipped.push(
						`${ blockType }/edit.js (RENDER-TITLE - markers not found)`
					);
				} else {
					results.errors.push( `${ blockType }/edit.js (RENDER-TITLE): ${ editJsxResult.error }` );
					console.log( `  ✗ ${ blockType }/edit.js (RENDER-TITLE) - Error: ${ editJsxResult.error }` );
				}
			} catch ( error ) {
				results.errors.push(
					`Structure JSX generation failed for ${ blockType }: ${ error.message }`
				);
				console.log(
					`  ✗ ${ blockType } - Structure JSX Error: ${ error.message }`
				);
			}
		} else {
			// Structure mapping not found - this is OK, not all blocks may have structure mappings yet
			results.skipped.push(
				`${ blockType } (structure mapping not found - skipping JSX generation)`
			);
		}
	}

	return results;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate that all cssProperty values in a schema are mapped in CSS_PROPERTY_SCALES
 * This ensures no cssProperty is used without proper scale/unit definitions
 *
 * @param {Object} schema    - Block schema with attributes
 * @param {string} blockType - Block type name (accordion, tabs, toc)
 * @return {Object} Validation result { valid: boolean, errors: string[] }
 */
function validateCssPropertyMappings( schema, blockType ) {
	const errors = [];

	for ( const [ attrName, attr ] of Object.entries( schema.attributes ) ) {
		if ( ! attr.cssProperty ) {
			continue;
		}

		const resolved = CSS_PROPERTY_ALIASES[ attr.cssProperty ] || attr.cssProperty;
		if ( ! CSS_PROPERTY_SCALES[ resolved ] ) {
			errors.push(
				`[${ blockType }] Attribute "${ attrName }" has cssProperty "${ attr.cssProperty }" ` +
					`which is not mapped in CSS_PROPERTY_SCALES`
			);
		}
	}

	return { valid: errors.length === 0, errors };
}

/**
 * Validate BorderPanel control groups in schema
 * Ensures each controlId has exactly 3 attrs with correct cssProperty endings
 *
 * @param {Object} schema    - Block schema
 * @param {string} blockType - Block type name
 * @return {Object} Validation result { valid: boolean, errors: string[] }
 */
function validateBorderPanelGroups( schema, blockType ) {
	const errors = [];
	const borderAttrs = Object.entries( schema.attributes ).filter(
		( [ , attr ] ) => attr.control === 'BorderPanel'
	);

	if ( borderAttrs.length === 0 ) {
		return { valid: true, errors: [] };
	}

	// Group by controlId
	const groups = {};
	borderAttrs.forEach( ( [ attrName, attr ] ) => {
		const controlId = attr.controlId;
		if ( ! controlId ) {
			errors.push(
				`[${ blockType }] BorderPanel attribute "${ attrName }" missing controlId`
			);
			return;
		}

		if ( ! groups[ controlId ] ) {
			groups[ controlId ] = [];
		}
		groups[ controlId ].push( [ attrName, attr ] );
	} );

	// Validate each group
	for ( const [ controlId, attrs ] of Object.entries( groups ) ) {
		// Check: exactly 3 attributes
		if ( attrs.length !== 3 ) {
			errors.push(
				`[${ blockType }] BorderPanel controlId "${ controlId }" has ${ attrs.length } attrs, expected 3`
			);
			continue;
		}

		// Note: order field validation removed - controlId is what groups attributes together
		// Each attribute can have its own order, or the group ordering is determined elsewhere

		// Check: has width, color, style (by cssProperty endings)
		const hasWidth = attrs.some( ( [ , attr ] ) => attr.cssProperty?.endsWith( 'width' ) );
		const hasColor = attrs.some( ( [ , attr ] ) => attr.cssProperty?.endsWith( 'color' ) );
		const hasStyle = attrs.some( ( [ , attr ] ) => attr.cssProperty?.endsWith( 'style' ) );

		if ( ! hasWidth || ! hasColor || ! hasStyle ) {
			errors.push(
				`[${ blockType }] BorderPanel controlId "${ controlId }" missing required attrs. ` +
					`Has: width=${ hasWidth }, color=${ hasColor }, style=${ hasStyle }`
			);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate PanelColorSettings control groups in schema
 * Ensures each controlId has at least 2 attrs with exactly 1 having order field
 *
 * @param {Object} schema    - Block schema
 * @param {string} blockType - Block type name
 * @return {Object} Validation result { valid: boolean, errors: string[] }
 */
function validatePanelColorSettingsGroups( schema, blockType ) {
	const errors = [];
	const colorAttrs = Object.entries( schema.attributes ).filter(
		( [ , attr ] ) => attr.control === 'PanelColorSettings'
	);

	if ( colorAttrs.length === 0 ) {
		return { valid: true, errors: [] };
	}

	// Group by controlId
	const groups = {};
	colorAttrs.forEach( ( [ attrName, attr ] ) => {
		const controlId = attr.controlId;
		if ( ! controlId ) {
			errors.push(
				`[${ blockType }] PanelColorSettings attribute "${ attrName }" missing controlId`
			);
			return;
		}

		if ( ! groups[ controlId ] ) {
			groups[ controlId ] = [];
		}
		groups[ controlId ].push( [ attrName, attr ] );
	} );

	// Validate each group
	for ( const [ controlId, attrs ] of Object.entries( groups ) ) {
		// Check: at least 2 attributes (typically text + background)
		if ( attrs.length < 2 ) {
			errors.push(
				`[${ blockType }] PanelColorSettings controlId "${ controlId }" has ${ attrs.length } attrs, expected at least 2`
			);
			continue;
		}

		// Note: order field validation removed - controlId is what groups attributes together

		// Check: all have colorLabel
		const missingColorLabel = attrs.filter( ( [ , attr ] ) => ! attr.colorLabel );
		if ( missingColorLabel.length > 0 ) {
			const attrNames = missingColorLabel.map( ( [ name ] ) => name ).join( ', ' );
			errors.push(
				`[${ blockType }] PanelColorSettings controlId "${ controlId }" has attrs missing colorLabel: ${ attrNames }`
			);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

// ============================================================================
// Main Compiler
// ============================================================================

/**
 * Main compilation function
 * @param options
 */
async function compile( options = {} ) {
	const warnOnly = Boolean( options.warnOnly );
	const startTime = Date.now();
	const results = {
		success: [],
		errors: [],
		files: [],
	};

	try {
		// Ensure all output directories exist (silent)
		for ( const [ name, dir ] of Object.entries( OUTPUT_DIRS ) ) {
			ensureDir( dir );
		}

		// Load all schemas
		const schemas = {};

		for ( const blockType of BLOCKS ) {
			try {
				schemas[ blockType ] = loadSchema( blockType );
			} catch ( error ) {
				results.errors.push( `Failed to load ${ blockType }.json: ${ error.message }` );
				console.error( `❌ Failed to load ${ blockType }.json: ${ error.message }` );
			}
		}

		if ( Object.keys( schemas ).length === 0 ) {
			throw new Error( 'No schemas loaded successfully' );
		}

		// Process schemas to expand icon-panel macros
		for ( const [ blockType, schema ] of Object.entries( schemas ) ) {
			if ( schema.attributes ) {
				schema.attributes = processAttributes( schema.attributes, blockType );
			}
		}

		// Write expanded schemas for runtime use
		for ( const [ blockType, schema ] of Object.entries( schemas ) ) {
			const expandedSchemaPath = path.join(
				__dirname,
				'..',
				'schemas',
				`${ blockType }-schema-autogenerated.json`
			);
			fs.writeFileSync( expandedSchemaPath, JSON.stringify( schema, null, 2 ) );
			results.files.push( {
				path: expandedSchemaPath,
				lines: JSON.stringify( schema, null, 2 ).split( '\n' ).length,
			} );
		}

		// Generate files for each block (silent unless errors)
		for ( const [ blockType, schema ] of Object.entries( schemas ) ) {
			// Validate BorderPanel groups
			const borderValidation = validateBorderPanelGroups( schema, blockType );
			if ( ! borderValidation.valid ) {
				for ( const error of borderValidation.errors ) {
					console.error( `❌ ${ error }` );
					results.errors.push( error );
				}
			}

			// Validate PanelColorSettings groups
			const colorValidation = validatePanelColorSettingsGroups( schema, blockType );
			if ( ! colorValidation.valid ) {
				for ( const error of colorValidation.errors ) {
					console.error( `❌ ${ error }` );
					results.errors.push( error );
				}
			}

			// Validate cssProperty mappings against CSS_PROPERTY_SCALES
			const cssPropertyValidation = validateCssPropertyMappings( schema, blockType );
			if ( ! cssPropertyValidation.valid ) {
				for ( const error of cssPropertyValidation.errors ) {
					console.error( `❌ ${ error }` );
					results.errors.push( error );
				}
			}

			// TypeScript types
			try {
				const { fileName, content } = generateTypeScript( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.types, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`TypeScript generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// Zod validators
			try {
				const { fileName, content } = generateValidationSchema( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.validators, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`Validator generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// Block attributes
			try {
				const { fileName, content } = generateBlockAttributes( blockType, schema );
				const filePath = path.join(
					OUTPUT_DIRS.blockAttributes,
					blockType,
					'src',
					fileName
				);
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`Block attributes generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// PHP CSS defaults
			try {
				const { fileName, content } = generatePHPCSSDefaults( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.phpCssDefaults, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`PHP CSS defaults generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// CSS variables
			try {
				const { fileName, content } = generateCSSVariables( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.css, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`CSS generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// Documentation
			try {
				const { fileName, content } = generateDocumentation( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.docs, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`Documentation generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// Style builders
			try {
				const { fileName, content } = generateStyleBuilder( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.styles, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`Style builder generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// Editor CSS vars builders
			try {
				const { fileName, content } = generateEditorCssVarsBuilder( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.styles, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`Editor CSS vars generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// Frontend CSS vars builders
			try {
				const { fileName, content } = generateFrontendCssVarsBuilder( blockType, schema );
				const filePath = path.join( OUTPUT_DIRS.styles, fileName );
				fs.writeFileSync( filePath, content );
				results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
			} catch ( error ) {
				results.errors.push(
					`Frontend CSS vars generation failed for ${ blockType }: ${ error.message }`
				);
			}

			// Validate schema-mapping synchronization (silent unless warnings)
			validateSchemaMappingSync( schema, blockType );
		}

		// Generate combined PHP mappings file
		try {
			const { fileName, content } = generatePHPMappings( schemas );
			const filePath = path.join( OUTPUT_DIRS.phpCssDefaults, fileName );
			fs.writeFileSync( filePath, content );
			results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
		} catch ( error ) {
			results.errors.push( `PHP mappings generation failed: ${ error.message }` );
		}

		// Generate combined JS mappings file
		try {
			const { fileName, content } = generateJSMappings( schemas );
			const filePath = path.join( OUTPUT_DIRS.config, fileName );
			fs.writeFileSync( filePath, content );
			results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
		} catch ( error ) {
			results.errors.push( `JS mappings generation failed: ${ error.message }` );
		}

		// Generate control configuration file
		try {
			const { fileName, content } = generateControlConfigs( schemas );
			const filePath = path.join( OUTPUT_DIRS.config, fileName );
			fs.writeFileSync( filePath, content );
			results.files.push( { path: filePath, lines: content.split( '\n' ).length } );
		} catch ( error ) {
			results.errors.push( `Control config generation failed: ${ error.message }` );
		}

		// ========================================
		// Code Injection Phase
		// ========================================
		const injectionResults = injectCodeIntoBlocks( schemas );

		// Add injection results to overall results
		results.injections = {
			success: injectionResults.success.length,
			skipped: injectionResults.skipped.length,
			errors: injectionResults.errors.length,
			changed: injectionResults.changed || 0,
			details: injectionResults,
		};
	} catch ( error ) {
		results.errors.push( `Compilation failed: ${ error.message }` );
	}

	// Summary
	const elapsed = Date.now() - startTime;

	// Only show detailed summary on errors or changes
	const hasInjectionChanges = results.injections?.changed > 0;
	const hasErrors = results.errors.length > 0;

	if ( hasErrors || hasInjectionChanges ) {
		console.log( '\n========================================' );
		console.log( '  Compilation Summary' );
		console.log( '========================================\n' );

		console.log( `  Files generated: ${ results.files.length }` );
		console.log( `  Total lines: ${ results.files.reduce( ( sum, f ) => sum + f.lines, 0 ) }` );

		if ( results.injections && hasInjectionChanges ) {
			console.log( `  Code injections: ${ results.injections.changed } files updated` );
		}

		console.log( `  Errors: ${ results.errors.length }` );
		console.log( `  Time: ${ elapsed }ms\n` );
	}

	if ( hasErrors ) {
		console.log( warnOnly ? '  Warnings:' : '  Errors:' );
		for ( const error of results.errors ) {
			console.log( `    - ${ error }` );
		}
		console.log( '' );
		if ( ! warnOnly ) {
			process.exit( 1 );
		}
	}

	// Minimal success message
	if ( hasErrors && warnOnly ) {
		console.log(
			`⚠️  Schema compilation completed with ${ results.errors.length } warning(s) (${ elapsed }ms)\n`
		);
		return results;
	}

	console.log(
		`✅ Schema compilation: ${ results.files.length } files generated (${ elapsed }ms)\n`
	);
	return results;
}

function isWarnOnly() {
	return (
		process.argv.includes( '--warn-only' ) ||
		process.env.GUTPLUS_WARN_ONLY === '1' ||
		process.env.GUTPLUS_WARN_ONLY === 'true'
	);
}

// Run compiler
async function main() {
	const warnOnly = isWarnOnly();

	// Load CSS property scales (ES module) before compilation
	await loadCssPropertyScales();

	// Run schema compilation first
	const results = await compile( { warnOnly } );

	return results;
}

main().catch( ( error ) => {
	console.error( 'Fatal error:', error );
	if ( ! isWarnOnly() ) {
		process.exit( 1 );
	}
} );
