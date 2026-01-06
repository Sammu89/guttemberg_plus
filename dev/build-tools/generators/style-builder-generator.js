/**
 * Style Builder Generator
 *
 * Auto-generates style helper functions from schemas to prevent manual code
 * from using wrong attribute names. Ensures type safety and consistency.
 *
 * Generated functions:
 * - buildEditorStyles(effectiveValues) - Returns inline style objects for editor
 * - buildFrontendStyles(customizations) - Returns CSS variable object for frontend
 * - Format helpers for complex types (borderRadius, padding, etc.)
 *
 * @package
 * @since 1.0.0
 */

/**
 * Get auto-generated file header
 * @param schemaFile
 * @param blockName
 */
function getGeneratedHeader( schemaFile, blockName ) {
	return `/**
 * Style Builder for ${ blockName } Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${ schemaFile }
 * Generated at: ${ new Date().toISOString() }
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
 * Generate format helper functions for complex types
 * @param schema
 */
function generateFormatHelpers( schema ) {
	const helpers = [];
	const hasComplexTypes = {
		borderRadius: false,
		padding: false,
		paddingRectangle: false,
	};

	// Check if schema has complex object types
	Object.entries( schema.attributes ).forEach( ( [ attrName, attr ] ) => {
		if ( attr.type === 'object' ) {
			if ( attrName.toLowerCase().includes( 'radius' ) ) {
				hasComplexTypes.borderRadius = true;
			}
			if ( attrName.toLowerCase().includes( 'padding' ) ) {
				hasComplexTypes.padding = true;
			}
		}
		// Check for transformValue flag
		if ( attr.transformValue === 'paddingRectangle' ) {
			hasComplexTypes.paddingRectangle = true;
		}
	} );

	// Generate border radius helper
	if ( hasComplexTypes.borderRadius ) {
		helpers.push( `/**
 * Format border radius object to CSS string
 * @param {Object} radius - Border radius object with topLeft, topRight, bottomRight, bottomLeft
 * @returns {string|null} Formatted border radius or null
 */
export function formatBorderRadius(radius) {
  if (!radius || typeof radius !== 'object') return null;
  const { topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0 } = radius;
  return \`\${topLeft}px \${topRight}px \${bottomRight}px \${bottomLeft}px\`;
}` );
	}

	// Generate padding helper
	if ( hasComplexTypes.padding ) {
		helpers.push( `/**
 * Format padding object to CSS string
 * @param {Object} padding - Padding object with top, right, bottom, left
 * @returns {string|null} Formatted padding or null
 */
export function formatPadding(padding) {
  if (!padding || typeof padding !== 'object') return null;
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  return \`\${top}px \${right}px \${bottom}px \${left}px\`;
}` );
	}

	// Generate padding rectangle helper (vertical full, horizontal double)
	if ( hasComplexTypes.paddingRectangle ) {
		helpers.push( `/**
 * Format padding rectangle from single number value
 * Top/bottom use full value, left/right use double value for rectangular button appearance
 * @param {number} value - Padding value in pixels
 * @returns {string|null} Formatted padding (e.g., "12px 24px") or null
 */
export function formatPaddingRectangle(value) {
  if (value === undefined || value === null || typeof value !== 'number') return null;
  const vertical = value;
  const horizontal = value * 2;
  return \`\${vertical}px \${horizontal}px\`;
}` );
	}

	return helpers.join( '\n\n' );
}

/**
 * Group attributes by CSS selector for editor styles
 * @param schema
 */
function groupBySelector( schema ) {
	const groups = {};

	Object.entries( schema.attributes ).forEach( ( [ attrName, attr ] ) => {
		const hasVariants =
			attr.dependsOn && attr.variants && Object.keys( attr.variants ).length > 0;
		const hasCssProperty = Boolean( attr.cssProperty );

		// Only include themeable attributes with CSS properties or variant-based properties
		if ( ! attr.themeable || ( ! hasCssProperty && ! hasVariants ) ) {
			return;
		}

		const selector = attr.cssSelector || 'default';
		if ( ! groups[ selector ] ) {
			groups[ selector ] = [];
		}

		groups[ selector ].push( { attrName, attr } );
	} );

	return groups;
}

/**
 * Generate a single CSS property assignment
 * @param attrName
 * @param attr
 * @param blockType
 * @param valueSource
 * @param selectorKey
 */
function generateCssPropertyAssignment(
	attrName,
	attr,
	blockType,
	valueSource = 'values',
	selectorKey = 'styles'
) {
	const cssProperty = attr.cssProperty;
	const defaultValue = attr.default;
	const hasVariants = attr.dependsOn && attr.variants && Object.keys( attr.variants ).length > 0;
	const cssPropCamelCase = cssProperty
		? cssProperty.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() )
		: null;

	// Conditional property resolution (dependsOn/variants)
	if ( hasVariants ) {
		if ( attr.type === 'number' ) {
			const unit = attr.unit || '';
			return `    if (${ valueSource }.${ attrName } !== undefined && ${ valueSource }.${ attrName } !== null) {
      const resolvedProp = resolveCssProperty('${ attrName }', '${ blockType }', ${ valueSource });
      if (resolvedProp) {
        ${ selectorKey }[toCamelCase(resolvedProp)] = \`\${${ valueSource }.${ attrName }}${ unit }\`;
      }
    }`;
		}

		if ( attr.type === 'string' ) {
			return `    if (${ valueSource }.${ attrName } !== undefined && ${ valueSource }.${ attrName } !== null) {
      const resolvedProp = resolveCssProperty('${ attrName }', '${ blockType }', ${ valueSource });
      if (resolvedProp) {
        ${ selectorKey }[toCamelCase(resolvedProp)] = ${ valueSource }.${ attrName };
      }
    }`;
		}
		// Fallback: unsupported types remain manual
		return `    // Conditional attribute "${ attrName }" uses variants; add manual handling if needed`;
	}

	// Handle different types (non-conditional)
	if ( ! cssPropCamelCase ) {
		return `    // Missing cssProperty for ${ attrName }; skipped`;
	}

	if ( attr.type === 'number' ) {
		// Check for special transformValue handling
		if ( attr.transformValue === 'paddingRectangle' ) {
			return `    if (${ valueSource }.${ attrName } !== undefined && ${ valueSource }.${ attrName } !== null) {
      const formatted = formatPaddingRectangle(${ valueSource }.${ attrName });
      if (formatted) ${ selectorKey }.${ cssPropCamelCase } = formatted;
    }`;
		}

		const unit = attr.unit || '';
		return `    if (${ valueSource }.${ attrName } !== undefined && ${ valueSource }.${ attrName } !== null) {
      ${ selectorKey }.${ cssPropCamelCase } = \`\${${ valueSource }.${ attrName }}${ unit }\`;
    }`;
	}

	if ( attr.type === 'object' ) {
		// Special handling for complex objects
		if ( attrName.toLowerCase().includes( 'radius' ) ) {
			return `    if (${ valueSource }.${ attrName }) {
      const formatted = formatBorderRadius(${ valueSource }.${ attrName });
      if (formatted) ${ selectorKey }.${ cssPropCamelCase } = formatted;
    }`;
		}
		if ( attrName.toLowerCase().includes( 'padding' ) ) {
			return `    if (${ valueSource }.${ attrName }) {
      const formatted = formatPadding(${ valueSource }.${ attrName });
      if (formatted) ${ selectorKey }.${ cssPropCamelCase } = formatted;
    }`;
		}
		return `    // Complex object: ${ attrName } - handle manually if needed`;
	}

	// String types (colors, text values, etc.)
	return `    if (${ valueSource }.${ attrName } !== undefined && ${ valueSource }.${ attrName } !== null) {
      ${ selectorKey }.${ cssPropCamelCase } = ${ valueSource }.${ attrName };
    }`;
}

/**
 * Generate buildEditorStyles function
 * @param schema
 * @param blockType
 */
function generateBuildEditorStyles( schema, blockType ) {
	const groups = groupBySelector( schema );
	const selectorNames = Object.keys( groups );
	const hasConditionals = Object.values( schema.attributes ).some(
		( attr ) =>
			attr.themeable &&
			attr.dependsOn &&
			attr.variants &&
			Object.keys( attr.variants ).length > 0
	);

	let code = '';

	if ( hasConditionals ) {
		code += `import { resolveCssProperty } from '@shared/config/css-var-mappings-generated';\n`;
		code += `const toCamelCase = (prop) => prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());\n\n`;
	}

	code += `/**
 * Build inline styles for editor based on effective values
 * @param {Object} values - Effective values (defaults + theme + customizations)
 * @returns {Object} Style objects keyed by selector type
 */
export function buildEditorStyles(values) {
  const styles = {};\n\n`;

	// Generate styles for each selector group
	selectorNames.forEach( ( selector ) => {
		const selectorKey = selector
			.replace( /^\.wp-block-guttemberg-plus-\w+$/, 'container' )
			.replace( /^\.(accordion|tabs|toc)-header$/, 'header' )
			.replace( /^\.(accordion|tabs|toc)-content$/, 'content' )
			.replace( /^\.(accordion|tabs|toc)-icon$/, 'icon' )
			.replace( /^\./, '' )
			.replace( /-/g, '_' );

		code += `  // Styles for ${ selector }\n`;
		code += `  styles.${ selectorKey } = {};\n`;

		groups[ selector ].forEach( ( { attrName, attr } ) => {
			const assignment = generateCssPropertyAssignment(
				attrName,
				attr,
				blockType,
				'values',
				`styles.${ selectorKey }`
			);
			code += assignment + '\n';
		} );

		code += '\n';
	} );

	code += `  return styles;
}\n`;

	return code;
}

/**
 * Generate buildFrontendStyles function
 * @param schema
 * @param blockType
 */
function generateBuildFrontendStyles( schema, blockType ) {
	let code = `/**
 * Build CSS variable object for frontend customizations
 * Maps customizations to CSS variables for inline style output
 * @param {Object} customizations - Delta values from expected (theme + defaults)
 * @returns {Object} CSS variable object for inline styles
 */
export function buildFrontendStyles(customizations) {
  const styles = {};

  if (!customizations || typeof customizations !== 'object') {
    return styles;
  }

`;

	// Generate mapping for each themeable attribute with cssVar
	Object.entries( schema.attributes ).forEach( ( [ attrName, attr ] ) => {
		if ( ! attr.themeable || ! attr.cssVar ) {
			return;
		}

		const cssVarName = `--${ attr.cssVar }`;

		if ( attr.type === 'number' ) {
			// Check for special transformValue handling
			if ( attr.transformValue === 'paddingRectangle' ) {
				code += `  if (customizations.${ attrName } !== undefined && customizations.${ attrName } !== null) {
    const formatted = formatPaddingRectangle(customizations.${ attrName });
    if (formatted) styles['${ cssVarName }'] = formatted;
  }\n\n`;
			} else {
				const unit = attr.unit || '';
				code += `  if (customizations.${ attrName } !== undefined && customizations.${ attrName } !== null) {
    styles['${ cssVarName }'] = \`\${customizations.${ attrName }}${ unit }\`;
  }\n\n`;
			}
		} else if ( attr.type === 'object' ) {
			// Special handling for complex objects
			if ( attrName.toLowerCase().includes( 'radius' ) ) {
				code += `  if (customizations.${ attrName }) {
    const formatted = formatBorderRadius(customizations.${ attrName });
    if (formatted) styles['${ cssVarName }'] = formatted;
  }\n\n`;
			} else if ( attrName.toLowerCase().includes( 'padding' ) ) {
				code += `  if (customizations.${ attrName }) {
    const formatted = formatPadding(customizations.${ attrName });
    if (formatted) styles['${ cssVarName }'] = formatted;
  }\n\n`;
			} else {
				code += `  // Complex object: ${ attrName } - handle manually if needed\n\n`;
			}
		} else {
			// String types
			code += `  if (customizations.${ attrName } !== undefined && customizations.${ attrName } !== null) {
    styles['${ cssVarName }'] = customizations.${ attrName };
  }\n\n`;
		}
	} );

	code += `  return styles;
}\n`;

	return code;
}

/**
 * Main generator function
 * @param blockType
 * @param schema
 */
function generateStyleBuilder( blockType, schema ) {
	const fileName = `${ blockType }-styles-generated.js`;
	const blockName = schema.blockName || blockType;

	let content = getGeneratedHeader( `${ blockType }.json`, blockName );

	// Add format helpers
	const helpers = generateFormatHelpers( schema );
	if ( helpers ) {
		content += helpers + '\n\n';
	}

	// Add buildEditorStyles function
	content += generateBuildEditorStyles( schema, blockType );
	content += '\n';

	// Add buildFrontendStyles function
	content += generateBuildFrontendStyles( schema, blockType );

	return { fileName, content };
}

module.exports = {
	generateStyleBuilder,
};
