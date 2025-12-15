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
 * @package GuttemberPlus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { generateStyleBuilder } = require('./generators/style-builder-generator');

// ============================================================================
// Configuration
// ============================================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const SCHEMAS_DIR = path.join(ROOT_DIR, 'schemas');

// Output directories
const OUTPUT_DIRS = {
  types: path.join(ROOT_DIR, 'shared', 'src', 'types'),
  validators: path.join(ROOT_DIR, 'shared', 'src', 'validators'),
  phpCssDefaults: path.join(ROOT_DIR, 'php', 'css-defaults'),
  config: path.join(ROOT_DIR, 'shared', 'src', 'config'),
  css: path.join(ROOT_DIR, 'assets', 'css'),
  docs: path.join(ROOT_DIR, 'docs'),
  blockAttributes: path.join(ROOT_DIR, 'blocks'),
  styles: path.join(ROOT_DIR, 'shared', 'src', 'styles'),
};

// Block configurations
const BLOCKS = ['accordion', 'tabs', 'toc'];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate timestamp for file headers
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Get auto-generated file header
 */
function getGeneratedHeader(schemaFile, fileType) {
  return `/**
 * ${fileType}
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${schemaFile}
 * Generated at: ${getTimestamp()}
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
 */
function getPHPGeneratedHeader(schemaFile, description) {
  const timestamp = getTimestamp();
  return `<?php
/**
 * ${description}
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${schemaFile}
 * Generated at: ${getTimestamp()}
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
 */
function getMarkdownGeneratedHeader(schemaFile, title) {
  return `# ${title}

> **AUTO-GENERATED FILE - DO NOT EDIT MANUALLY**
> Generated from: \`schemas/${schemaFile}\`
> Generated at: ${getTimestamp()}
>
> This file is regenerated on every build. Any manual changes will be lost.
> To modify this file, update the source schema and run: \`npm run schema:build\`

---

`;
}

/**
 * Convert camelCase to PascalCase
 */
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to SCREAMING_SNAKE_CASE
 */
function toScreamingSnakeCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case or snake_case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  Created directory: ${path.relative(ROOT_DIR, dirPath)}`);
  }
}

/**
 * Load and parse a schema file
 */
function loadSchema(blockType) {
  const schemaPath = path.join(SCHEMAS_DIR, `${blockType}.json`);

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  const content = fs.readFileSync(schemaPath, 'utf8');

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse schema ${blockType}.json: ${error.message}`);
  }
}

/**
 * Format a default value for TypeScript
 */
function formatTSDefault(value, type) {
  if (value === null || value === undefined) {
    return 'undefined';
  }

  if (type === 'string') {
    return `'${String(value).replace(/'/g, "\\'")}'`;
  }

  if (type === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (type === 'number') {
    return String(value);
  }

  if (type === 'array' || type === 'object') {
    return JSON.stringify(value, null, 2).replace(/\n/g, '\n  ');
  }

  return JSON.stringify(value);
}

/**
 * Get TypeScript type from schema type
 */
function getTSType(schemaType, isNullable = false) {
  const typeMap = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'array': 'any[]',
    'object': 'Record<string, any>',
  };

  const tsType = typeMap[schemaType] || 'any';
  return isNullable ? `${tsType} | undefined` : tsType;
}

/**
 * Get Zod type from schema type
 */
function getZodType(attr) {
  const isOptional = attr.default === null || attr.default === undefined;
  let zodType;

  switch (attr.type) {
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

  if (isOptional) {
    zodType += '.optional()';
  }

  return zodType;
}

/**
 * Format PHP value
 */
function formatPHPValue(value, type) {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (type === 'string') {
    return `'${String(value).replace(/'/g, "\\'")}'`;
  }

  if (type === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (type === 'number') {
    return String(value);
  }

  if (type === 'array') {
    if (Array.isArray(value)) {
      const items = value.map(v => formatPHPValue(v, typeof v));
      return `array( ${items.join(', ')} )`;
    }
  }

  if (type === 'object' && typeof value === 'object') {
    const entries = Object.entries(value).map(([k, v]) => {
      return `'${k}' => ${formatPHPValue(v, typeof v)}`;
    });
    return `array(\n        ${entries.join(',\n        ')}\n      )`;
  }

  return JSON.stringify(value);
}

// ============================================================================
// Generator Functions
// ============================================================================

/**
 * Generate TypeScript type definitions
 */
function generateTypeScript(blockType, schema) {
  const fileName = `${blockType}-theme.ts`;
  const interfaceName = `${toPascalCase(blockType)}Theme`;
  const defaultsName = `${blockType}DefaultTheme`;

  let content = getGeneratedHeader(`${blockType}.json`, `TypeScript Type Definitions for ${schema.blockName} Block`);

  // Generate interface
  content += `/**\n * Theme interface for ${schema.blockName} block\n * Contains all themeable attributes\n */\n`;
  content += `export interface ${interfaceName} {\n`;

  const themeableAttrs = [];
  const allAttrs = Object.entries(schema.attributes);

  for (const [attrName, attr] of allAttrs) {
    if (attr.themeable) {
      themeableAttrs.push([attrName, attr]);
      const tsType = getTSType(attr.type, attr.default === null);
      const description = attr.description ? `  /** ${attr.description} */\n` : '';
      content += `${description}  ${attrName}?: ${tsType};\n`;
    }
  }

  content += `}\n\n`;

  // Generate defaults object
  content += `/**\n * Default theme values for ${schema.blockName} block\n */\n`;
  content += `export const ${defaultsName}: ${interfaceName} = {\n`;

  for (const [attrName, attr] of themeableAttrs) {
    if (attr.default !== null && attr.default !== undefined) {
      const formattedValue = formatTSDefault(attr.default, attr.type);
      content += `  ${attrName}: ${formattedValue},\n`;
    }
  }

  content += `};\n\n`;

  // Generate attribute metadata interface
  content += `/**\n * Full attribute interface including non-themeable attributes\n */\n`;
  content += `export interface ${interfaceName}Attributes {\n`;

  for (const [attrName, attr] of allAttrs) {
    const tsType = getTSType(attr.type, attr.default === null);
    content += `  ${attrName}?: ${tsType};\n`;
  }

  content += `}\n`;

  return { fileName, content };
}

/**
 * Generate Zod validation schemas
 */
function generateValidationSchema(blockType, schema) {
  const fileName = `${blockType}-schema.ts`;
  const schemaName = `${blockType}ThemeSchema`;

  let content = getGeneratedHeader(`${blockType}.json`, `Zod Validation Schema for ${schema.blockName} Block`);

  content += `import { z } from 'zod';\n\n`;

  // Generate theme schema (themeable attributes only)
  content += `/**\n * Validation schema for ${schema.blockName} theme values\n */\n`;
  content += `export const ${schemaName} = z.object({\n`;

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (attr.themeable) {
      const zodType = getZodType(attr);
      content += `  ${attrName}: ${zodType},\n`;
    }
  }

  content += `});\n\n`;

  // Generate full attributes schema
  content += `/**\n * Validation schema for all ${schema.blockName} block attributes\n */\n`;
  content += `export const ${blockType}AttributesSchema = z.object({\n`;

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    const zodType = getZodType(attr);
    content += `  ${attrName}: ${zodType},\n`;
  }

  content += `});\n\n`;

  // Export type inferences
  content += `// Type inference exports\n`;
  content += `export type ${toPascalCase(blockType)}Theme = z.infer<typeof ${schemaName}>;\n`;
  content += `export type ${toPascalCase(blockType)}Attributes = z.infer<typeof ${blockType}AttributesSchema>;\n`;

  return { fileName, content };
}

/**
 * Generate PHP CSS defaults
 */
function generatePHPCSSDefaults(blockType, schema) {
  const fileName = `${blockType}.php`;

  let content = getPHPGeneratedHeader(`${blockType}.json`, `CSS Default Values for ${schema.blockName} Block`);

  content += `return array(\n`;

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (attr.themeable && attr.default !== undefined && attr.default !== null && attr.default !== '') {
      // Skip complex objects
      if (typeof attr.default === 'object') {
        continue;
      }

      let defaultValue = attr.default;

      // Handle special transformValue for paddingRectangle
      if (attr.transformValue === 'paddingRectangle' && typeof attr.default === 'number') {
        const vertical = attr.default;
        const horizontal = attr.default * 2;
        defaultValue = `${vertical}px ${horizontal}px`;
      }

      // Use the default value directly (now includes units, e.g., "18px", "1.6", "180deg")
      content += `  '${attrName}' => '${defaultValue}',\n`;
    }
  }

  content += `);\n`;

  return { fileName, content };
}

/**
 * Generate PHP attribute definitions
 */
function generatePHPAttributes(blockType, schema) {
  const fileName = `${blockType}-attributes.php`;

  let content = getPHPGeneratedHeader(`${blockType}.json`, `Block Attributes for ${schema.blockName} Block`);

  content += `return array(\n`;

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    content += `  '${attrName}' => array(\n`;
    content += `    'type' => '${attr.type}',\n`;

    if (attr.default !== null && attr.default !== undefined) {
      const phpValue = formatPHPValue(attr.default, attr.type);
      content += `    'default' => ${phpValue},\n`;
    }

    content += `  ),\n`;
  }

  content += `);\n`;

  return { fileName, content };
}

/**
 * Generate PHP CSS variable mappings for theme-css-generator.php
 * Includes CSS variable names and unit information
 */
function generatePHPMappings(allSchemas) {
  let mappings = {};

  for (const [blockType, schema] of Object.entries(allSchemas)) {
    mappings[blockType] = {};

    for (const [attrName, attr] of Object.entries(schema.attributes)) {
      if (attr.themeable && attr.cssVar) {
        // Store both cssVar and unit
        mappings[blockType][attrName] = {
          cssVar: attr.cssVar,
          unit: attr.unit || null,
          type: attr.type
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
 * Generated at: ${getTimestamp()}
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

  for (const [blockType, attrs] of Object.entries(mappings)) {
    content += `    '${blockType}' => array(\n`;

    for (const [attrName, info] of Object.entries(attrs)) {
      const unitStr = info.unit ? `'${info.unit}'` : 'null';
      content += `      '${attrName}' => array( 'cssVar' => '${info.cssVar}', 'unit' => ${unitStr}, 'type' => '${info.type}' ),\n`;
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
 */
function generateJSMappings(allSchemas) {
  let mappings = {};

  for (const [blockType, schema] of Object.entries(allSchemas)) {
    mappings[blockType] = {};

    for (const [attrName, attr] of Object.entries(schema.attributes)) {
      if (attr.themeable && attr.cssVar) {
        mappings[blockType][attrName] = {
          cssVar: `--${attr.cssVar}`,
          unit: attr.unit || null,
          type: attr.type,
          cssProperty: attr.cssProperty || null,
          dependsOn: attr.dependsOn || null,
          variants: attr.variants || null,
        };
      }
    }
  }

  // Generate JS file content
  let content = getGeneratedHeader('*.json', 'CSS Variable Mappings for All Blocks');

  content += `/**
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

  for (const [blockType, attrs] of Object.entries(mappings)) {
    content += `  ${blockType}: {\n`;

    for (const [attrName, info] of Object.entries(attrs)) {
      const unitStr = info.unit ? `'${info.unit}'` : 'null';
      const cssPropStr = info.cssProperty ? `'${info.cssProperty}'` : 'null';
      const dependsOnStr = info.dependsOn ? `'${info.dependsOn}'` : 'null';
      const variantsStr = info.variants
        ? JSON.stringify(info.variants, null, 6).replace(/\n/g, '\n      ')
        : 'null';
      content += `    ${attrName}: { cssVar: '${info.cssVar}', unit: ${unitStr}, type: '${info.type}', cssProperty: ${cssPropStr}, dependsOn: ${dependsOnStr}, variants: ${variantsStr} },\n`;
    }

    content += `  },\n`;
  }

  content += `};\n\n`;

  // Add helper function to format value with unit
  content += `/**
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

  // Handle object types (border radius, padding)
  if (mapping.type === 'object' && typeof value === 'object') {
    // Border radius format: topLeft topRight bottomRight bottomLeft
    if (attrName.toLowerCase().includes('radius')) {
      return \`\${value.topLeft}px \${value.topRight}px \${value.bottomRight}px \${value.bottomLeft}px\`;
    }
    // Padding format: top right bottom left
    if (attrName.toLowerCase().includes('padding')) {
      return \`\${value.top}px \${value.right}px \${value.bottom}px \${value.left}px\`;
    }
    // Default object handling
    return JSON.stringify(value);
  }

  // Handle numeric values with units
  if (mapping.unit && typeof value === 'number') {
    return \`\${value}\${mapping.unit}\`;
  }

  // Return value as-is for strings and other types
  return value;
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
 * Generate JavaScript exclusion lists
 * DEPRECATED: Exclusions are no longer generated as separate files
 */
function generateExclusions(blockType, schema) {
  // This function is kept for backwards compatibility but no longer generates files
  return null;
}

/**
 * Generate CSS variable declarations
 */
function generateCSSVariables(blockType, schema) {
  const fileName = `${blockType}-variables.css`;
  const prefix = blockType;

  let content = `/**
 * CSS Variables for ${schema.blockName} Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${blockType}.json
 * Generated at: ${getTimestamp()}
 *
 * This file defines CSS custom properties (variables) with default values.
 * These can be overridden by themes via class selectors.
 */

:root {\n`;

  // Collect all themeable attributes and use default values with units
  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (attr.themeable && attr.cssVar && attr.default !== undefined && attr.default !== null && attr.default !== '') {
      let cssValue;

      // Handle special transformValue for paddingRectangle
      if (attr.transformValue === 'paddingRectangle' && typeof attr.default === 'number') {
        const vertical = attr.default;
        const horizontal = attr.default * 2;
        cssValue = `${vertical}px ${horizontal}px`;
      }
      // Handle object types (border radius, padding, etc.)
      else if (typeof attr.default === 'object') {
        // Border radius format: topLeft topRight bottomRight bottomLeft
        if (attr.default.topLeft !== undefined) {
          const unit = attr.unit || 'px';
          cssValue = `${attr.default.topLeft}${unit} ${attr.default.topRight}${unit} ${attr.default.bottomRight}${unit} ${attr.default.bottomLeft}${unit}`;
        } else {
          // Skip other complex objects we don't know how to handle
          continue;
        }
      } else if (attr.type === 'number' && attr.unit) {
        // Format value with unit if applicable
        cssValue = `${attr.default}${attr.unit}`;
      } else {
        cssValue = attr.default;
      }

      content += `  --${attr.cssVar}: ${cssValue};\n`;
    }
  }

  content += `}\n`;

  return { fileName, content };
}

/**
 * Generate Markdown documentation
 */
function generateDocumentation(blockType, schema) {
  const fileName = `${blockType}-attributes.md`;

  let content = getMarkdownGeneratedHeader(`${blockType}.json`, `${schema.blockName} Block Attributes`);

  content += `## Overview\n\n`;
  content += `${schema.description}\n\n`;
  content += `- **Block Type:** \`${schema.blockType}\`\n`;
  content += `- **Version:** ${schema.version}\n\n`;

  // Group attributes by group
  const groupedAttrs = {};
  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    const group = attr.group || 'other';
    if (!groupedAttrs[group]) {
      groupedAttrs[group] = [];
    }
    groupedAttrs[group].push({ name: attrName, ...attr });
  }

  // Document each group
  for (const [groupName, attrs] of Object.entries(groupedAttrs)) {
    const groupInfo = schema.groups?.[groupName] || { title: toPascalCase(groupName) };

    content += `## ${groupInfo.title}\n\n`;
    if (groupInfo.description) {
      content += `${groupInfo.description}\n\n`;
    }

    // Create table
    content += `| Attribute | Type | Default | Themeable | Description |\n`;
    content += `|-----------|------|---------|-----------|-------------|\n`;

    for (const attr of attrs) {
      const defaultVal = attr.default === null ? '_null_' :
                        typeof attr.default === 'object' ? '_object_' :
                        `\`${attr.default}\``;
      const themeable = attr.themeable ? 'Yes' : `No (${attr.reason || 'N/A'})`;
      const description = attr.description || '';

      content += `| \`${attr.name}\` | ${attr.type} | ${defaultVal} | ${themeable} | ${description} |\n`;
    }

    content += `\n`;
  }

  // CSS Variables section
  content += `## CSS Variables\n\n`;
  content += `The following CSS custom properties are available for theming:\n\n`;
  content += `| Attribute | CSS Variable |\n`;
  content += `|-----------|-------------|\n`;

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (attr.themeable && attr.cssVar) {
      content += `| \`${attrName}\` | \`--${attr.cssVar}\` |\n`;
    }
  }

  content += `\n`;

  return { fileName, content };
}

/**
 * Generate JavaScript block attributes for WordPress
 */
function generateBlockAttributes(blockType, schema) {
  const fileName = `${blockType}-attributes.js`;
  const constName = `${blockType}Attributes`;

  let content = getGeneratedHeader(`${blockType}.json`, `Block Attributes for ${schema.blockName}`);

  content += `/**
 * Block Attributes for ${schema.blockName}
 *
 * These attributes define the block's data structure for WordPress.
 * Auto-generated from schema - DO NOT edit manually.
 */\n`;

  content += `export const ${constName} = {\n`;

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    // Map schema types to WordPress types
    let wpType = 'string';
    if (attr.type === 'number') wpType = 'number';
    else if (attr.type === 'boolean') wpType = 'boolean';
    else if (attr.type === 'object') wpType = 'object';
    else if (attr.type === 'array') wpType = 'array';

    // Format default value for JavaScript
    let defaultValue;
    if (attr.default === null || attr.default === undefined) {
      defaultValue = 'null';
    } else if (typeof attr.default === 'string') {
      defaultValue = `'${attr.default.replace(/'/g, "\\'")}'`;
    } else if (typeof attr.default === 'object') {
      defaultValue = JSON.stringify(attr.default);
    } else {
      defaultValue = String(attr.default);
    }

    content += `  ${attrName}: {\n`;
    content += `    type: '${wpType}',\n`;
    content += `    default: ${defaultValue},\n`;
    content += `  },\n`;
  }

  content += `};\n\n`;
  content += `export default ${constName};\n`;

  return { fileName, content };
}

/**
 * Generate control configuration from schemas
 * Exports min/max/options for all controls so components don't hardcode values
 */
function generateControlConfigs(allSchemas) {
  const fileName = 'control-config-generated.js';

  let content = getGeneratedHeader('accordion.json, tabs.json, toc.json', 'Control Configuration');

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
  for (const [blockType, schema] of Object.entries(allSchemas)) {
    content += `  '${blockType}': {\n`;

    for (const [attrName, attr] of Object.entries(schema.attributes)) {
      // Skip attributes without controls
      if (!attr.control) {
        continue;
      }

      content += `    '${attrName}': {\n`;
      content += `      control: '${attr.control}',\n`;

      // Add min/max for RangeControl
      if (attr.control === 'RangeControl') {
        if (attr.min !== undefined) content += `      min: ${attr.min},\n`;
        if (attr.max !== undefined) content += `      max: ${attr.max},\n`;
      }

      // Add options for SelectControl and similar
      if ((attr.control === 'SelectControl' || attr.control === 'IconPicker') && attr.options) {
        content += `      options: ${JSON.stringify(attr.options, null, 8).replace(/\n/g, '\n      ')},\n`;
      }

      // Add unit if present
      if (attr.unit) {
        content += `      unit: '${attr.unit}',\n`;
      }

      // Add other useful metadata
      if (attr.label) content += `      label: '${attr.label}',\n`;
      if (attr.description) {
        const desc = attr.description.replace(/'/g, "\\\\'");
        content += `      description: '${desc}',\n`;
      }
      if (attr.default !== undefined && typeof attr.default !== 'object') content += `      default: ${typeof attr.default === 'string' ? `'${attr.default}'` : attr.default},\n`;

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
 * @returns {string} Escaped string safe for regex
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Inject generated code between marker comments in a manual file
 *
 * @param {string} filePath - Absolute path to the file to inject into
 * @param {string} markerName - Unique marker identifier (e.g., 'STYLES', 'DEFAULTS')
 * @param {string} generatedCode - The code to inject between markers
 * @param {Object} options - Optional configuration
 * @param {boolean} options.backup - Whether to backup before injection (default: true)
 * @param {boolean} options.warnIfMissing - Log warning if markers not found (default: true)
 * @returns {Object} Result object with success status and details
 */
function injectCodeIntoFile(filePath, markerName, generatedCode, options = {}) {
  const { backup = true, warnIfMissing = true } = options;

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: `File not found: ${filePath}`,
        action: 'skipped',
      };
    }

    // Read current file content
    const originalContent = fs.readFileSync(filePath, 'utf8');

    // Define marker format
    const startMarker = `/* ========== AUTO-GENERATED-${markerName}-START ========== */`;
    const endMarker = `/* ========== AUTO-GENERATED-${markerName}-END ========== */`;

    // Check if markers exist
    const hasStartMarker = originalContent.includes(startMarker);
    const hasEndMarker = originalContent.includes(endMarker);

    if (!hasStartMarker || !hasEndMarker) {
      if (warnIfMissing) {
        console.warn(`  ⚠️  Warning: Markers not found in ${path.basename(filePath)} (${markerName})`);
      }
      return {
        success: false,
        error: 'Markers not found',
        action: 'skipped',
        missingMarkers: {
          start: !hasStartMarker,
          end: !hasEndMarker,
        },
      };
    }

    // Create backup if requested
    if (backup) {
      const backupPath = `${filePath}.backup`;
      fs.writeFileSync(backupPath, originalContent, 'utf8');
    }

    // Build the injection block with markers and generated code
    const injectionBlock = `${startMarker}\n// DO NOT EDIT - This code is auto-generated from schema\n${generatedCode}\n${endMarker}`;

    // Create regex to match content between markers (including markers)
    const regex = new RegExp(
      `${escapeRegex(startMarker)}[\\s\\S]*?${escapeRegex(endMarker)}`,
      'g'
    );

    // Replace content between markers
    const newContent = originalContent.replace(regex, injectionBlock);

    // Check if content changed (it's OK if unchanged - means code is up-to-date)
    if (newContent === originalContent) {
      return {
        success: true,
        action: 'unchanged',
        linesInjected: generatedCode.split('\n').length,
        marker: markerName,
      };
    }

    // Write updated content
    fs.writeFileSync(filePath, newContent, 'utf8');

    return {
      success: true,
      action: 'injected',
      linesInjected: generatedCode.split('\n').length,
      marker: markerName,
    };

  } catch (error) {
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
 * @param {Object} schema - Block schema with attributes
 * @param {string} blockType - Block type name (accordion, tabs, toc)
 * @returns {string} Generated JavaScript code
 */
function generateInlineStylesFunction(schema, blockType) {
  const code = [];

  code.push(`// AUTO-GENERATED from schemas/${blockType}.json`);
  code.push(`// To modify styles, update the schema and run: npm run schema:build`);
  code.push(``);
  code.push(`const getInlineStyles = () => {`);
  code.push(`  // Extract object-type attributes with fallbacks`);

  // Find all object-type attributes (padding, border radius, etc.)
  const objectAttrs = Object.entries(schema.attributes)
    .filter(([, attr]) => attr.type === 'object' && attr.themeable);

  for (const [attrName, attr] of objectAttrs) {
    const defaultValue = JSON.stringify(attr.default || {}, null, 4).replace(/\n/g, '\n\t\t');
    code.push(`\tconst ${attrName} = effectiveValues.${attrName} || ${defaultValue};`);
  }

  code.push(``);
  code.push(`\treturn {`);

  // Map CSS selectors to simplified keys (container, title, content, icon)
  const selectorMap = {
    'container': [],
    'title': [],
    'content': [],
    'icon': [],
  };

  // Helper to normalize appliesTo to array
  const normalizeAppliesTo = (appliesTo) => {
    if (!appliesTo) return [];
    return Array.isArray(appliesTo) ? appliesTo : [appliesTo];
  };

  // Track which elements have needsMapping (for skipping entire elements)
  const elementsWithManualRendering = new Set();
  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (attr.needsMapping && attr.appliesTo) {
      normalizeAppliesTo(attr.appliesTo).forEach(el => elementsWithManualRendering.add(el));
    }
  }

  // Group attributes by simplified selector names
  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (!attr.themeable || !attr.cssProperty) continue;

    // EXCLUDE state-specific attributes from editor inline styles
    // Method 1: Check schema's "state" field (preferred - from schema cleanup)
    if (attr.state) {
      continue; // Skip non-base states (hover, active, focus, visited, disabled)
    }

    // Method 2: Pattern matching fallback (for backwards compatibility)
    const statePatterns = [/Hover/i, /Active/i, /Focus/i, /Disabled/i, /Visited/i];
    const isStateAttribute = statePatterns.some(pattern => pattern.test(attrName));
    if (isStateAttribute) {
      continue; // Skip state-specific attributes
    }

    // Determine selector group from appliesTo field
    if (!attr.appliesTo) {
      console.warn(`[schema-compiler] Attribute "${attrName}" in ${blockType} schema missing "appliesTo" field - skipping`);
      continue;
    }

    // Normalize appliesTo to array and use first element for style mapping
    // (Multiple elements share the same style, so we just need one for mapping)
    const appliesToElements = normalizeAppliesTo(attr.appliesTo);
    const appliesTo = appliesToElements[0];

    // Skip elements that need manual rendering (needsMapping: true)
    if (appliesToElements.some(el => elementsWithManualRendering.has(el))) {
      continue; // Manual function handles this element's styles
    }

    // Map appliesTo to selector keys for inline styles
    const styleKeyMap = {
      // Tabs
      'tabIcon': 'icon',
      'tabsList': 'tabList',
      'tabPanel': 'panel',
      'wrapper': 'container',
      // TOC
      'tocTitle': 'title',
      // Accordion
      'accordionTitle': 'title',
      'accordionContent': 'content',
      'accordionItem': 'container',
      'accordionIcon': 'icon',
      'item': 'container',  // Accordion item wrapper
      // Generic fallbacks
      'title': 'title',
      'titleStatic': 'title',
      'content': 'content',
      'icon': 'icon',
    };

    const selectorKey = styleKeyMap[appliesTo];

    if (!selectorKey) {
      // Unknown appliesTo - skip with warning if not a known skip case
      const knownSkipElements = ['tocLink', 'tocList', 'link', 'list', 'collapseIcon', 'tabButton'];
      if (!knownSkipElements.includes(appliesTo)) {
        console.warn(`[schema-compiler] Unknown appliesTo value "${appliesTo}" for attribute "${attrName}" in ${blockType} schema - skipping`);
      }
      continue;
    }

    // Ensure the selector key exists in selectorMap
    if (!selectorMap[selectorKey]) {
      selectorMap[selectorKey] = [];
    }

    selectorMap[selectorKey].push({ attrName, attr });
  }

  // Generate styles for each selector
  for (const [selector, attrs] of Object.entries(selectorMap)) {
    if (attrs.length === 0) continue;

    code.push(`\t\t${selector}: {`);

    // Track which CSS properties we've already added to avoid duplicates
    const addedProperties = new Set();

    for (const { attrName, attr } of attrs) {
      const cssProperty = attr.cssProperty;
      const defaultValue = attr.default;

      // Skip if we've already added this CSS property
      if (addedProperties.has(cssProperty)) {
        continue;
      }
      addedProperties.add(cssProperty);

      // Format the style value based on type
      let styleValue;

      if (attr.type === 'object') {
        // Handle objects like padding/border-radius
        if (attrName.includes('Padding')) {
          styleValue = `\`\${${attrName}.top}px \${${attrName}.right}px \${${attrName}.bottom}px \${${attrName}.left}px\``;
        } else if (attrName.includes('Radius')) {
          styleValue = `\`\${${attrName}.topLeft}px \${${attrName}.topRight}px \${${attrName}.bottomRight}px \${${attrName}.bottomLeft}px\``;
        }
      } else if (attr.type === 'number' && attr.unit) {
        // Number with unit
        styleValue = `\`\${effectiveValues.${attrName} || ${defaultValue}}${attr.unit}\``;
      } else if (attr.type === 'string') {
        // String value with proper quoting
        const quotedDefault = String(defaultValue).replace(/'/g, "\\'");
        styleValue = `effectiveValues.${attrName} || '${quotedDefault}'`;
      } else if (attr.type === 'boolean') {
        // Boolean (usually for display property)
        styleValue = `effectiveValues.${attrName} ? 'flex' : 'none'`;
      }

      if (styleValue) {
        // Convert CSS property to camelCase for valid JavaScript
        const jsProperty = toCamelCase(cssProperty);
        code.push(`\t\t\t${jsProperty}: ${styleValue},`);
      }
    }

    code.push(`\t\t},`);
  }

  code.push(`\t};`);
  code.push(`};`);

  return code.join('\n');
}

/**
 * Generate customization styles function for save.js
 * This creates the getCustomizationStyles() function
 *
 * @param {string} blockType - Block type name (accordion, tabs, toc)
 * @returns {string} Generated JavaScript code
 */
function generateCustomizationStylesFunction(blockType) {
  const code = [];

  code.push(`const getCustomizationStyles = () => {`);
  code.push(`  const styles = {};`);
  code.push(``);
  code.push(`  // Get customizations (deltas from expected values, calculated in edit.js)`);
  code.push(`  const customizations = attributes.customizations || {};`);
  code.push(``);
  code.push(`  // Process each customization using schema-generated mappings`);
  code.push(`  Object.entries(customizations).forEach(([attrName, value]) => {`);
  code.push(`    if (value === null || value === undefined) {`);
  code.push(`      return;`);
  code.push(`    }`);
  code.push(``);
  code.push(`    // Get CSS variable name from generated mappings`);
  code.push(`    const cssVar = getCssVarName(attrName, '${blockType}');`);
  code.push(`    if (!cssVar) {`);
  code.push(`      return; // Attribute not mapped to a CSS variable`);
  code.push(`    }`);
  code.push(``);
  code.push(`    // Format value with proper unit from generated mappings`);
  code.push(`    const formattedValue = formatCssValue(attrName, value, '${blockType}');`);
  code.push(`    if (formattedValue !== null) {`);
  code.push(`      styles[cssVar] = formattedValue;`);
  code.push(`    }`);
  code.push(`  });`);
  code.push(``);
  code.push(`  return styles;`);
  code.push(`};`);

  return code.join('\n');
}

/**
 * Validate schema-mapping synchronization
 * Ensures elements with needsMapping=true have corresponding manual render entries
 *
 * @param {Object} schema - Block schema
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {boolean} True if validation passes
 */
function validateSchemaMappingSync(schema, blockType) {
  // Helper to normalize appliesTo to array
  const normalizeAppliesTo = (appliesTo) => {
    if (!appliesTo) return [];
    return Array.isArray(appliesTo) ? appliesTo : [appliesTo];
  };

  // Elements that should have manual rendering (from schema)
  const needsMapping = new Set();

  Object.entries(schema.attributes).forEach(([attrName, attr]) => {
    if (attr.needsMapping && attr.appliesTo) {
      normalizeAppliesTo(attr.appliesTo).forEach(el => needsMapping.add(el));
    }
  });

  // Elements that actually have manual rendering (hardcoded for now)
  // NOTE: This list should match what's actually in edit.js manual functions
  const manualRenderElements = {
    'tabs': ['tabButton'],      // Has manual styles.tabButton() function
    'accordion': [],            // No manual functions currently
    'toc': [],                  // No manual functions currently
  };

  const hasMappings = new Set(manualRenderElements[blockType] || []);

  // Forward validation: Schema → Manual code
  const missing = [...needsMapping].filter(el => !hasMappings.has(el));
  if (missing.length > 0) {
    console.warn(
      `\n⚠️  Schema-Mapping Warning for ${blockType}:\n\n` +
      `   Schema declares these elements need manual rendering:\n` +
      `   ${missing.map(el => `- ${el}`).join('\n   ')}\n\n` +
      `   But no manual render function found in edit.js.\n\n` +
      `   Note: If manual functions exist, update manualRenderElements in schema-compiler.js\n`
    );
  }

  // Reverse validation: Manual code → Schema
  const zombies = [...hasMappings].filter(el => !needsMapping.has(el));
  if (zombies.length > 0) {
    console.warn(
      `\n⚠️  Schema-Mapping Warning for ${blockType}:\n\n` +
      `   Manual render functions exist for:\n` +
      `   ${zombies.map(el => `- ${el}`).join('\n   ')}\n\n` +
      `   But schema doesn't declare needsMapping=true.\n\n` +
      `   Fix: Add needsMapping=true to one attribute with appliesTo="${zombies[0]}"\n`
    );
  }

  // Only output if there are issues - silent on success
  return missing.length === 0;
}

/**
 * Inject code into all block edit.js and save.js files
 *
 * @param {Object} schemas - All loaded schemas by block type
 * @returns {Object} Summary of injection results
 */
function injectCodeIntoBlocks(schemas) {
  const results = {
    success: [],
    skipped: [],
    errors: [],
    changed: 0,
  };

  for (const [blockType, schema] of Object.entries(schemas)) {
    const blockDir = path.join(OUTPUT_DIRS.blockAttributes, blockType, 'src');
    const editPath = path.join(blockDir, 'edit.js');
    const savePath = path.join(blockDir, 'save.js');

    // Inject into edit.js - STYLES marker
    const editStylesCode = generateInlineStylesFunction(schema, blockType);
    const editResult = injectCodeIntoFile(editPath, 'STYLES', editStylesCode, {
      backup: false, // Don't create backups for now
      warnIfMissing: false, // Don't warn on first run
    });

    if (editResult.success) {
      results.success.push(`${blockType}/edit.js (STYLES)`);
      if (editResult.action === 'injected') {
        results.changed++;
        console.log(`  ✓ ${blockType}/edit.js - Injected ${editResult.linesInjected} lines`);
      }
    } else if (editResult.action === 'skipped') {
      results.skipped.push(`${blockType}/edit.js (STYLES - markers not found)`);
    } else {
      results.errors.push(`${blockType}/edit.js: ${editResult.error}`);
      console.log(`  ✗ ${blockType}/edit.js - Error: ${editResult.error}`);
    }

    // Inject into save.js - CUSTOMIZATION-STYLES marker
    const saveStylesCode = generateCustomizationStylesFunction(blockType);
    const saveResult = injectCodeIntoFile(savePath, 'CUSTOMIZATION-STYLES', saveStylesCode, {
      backup: false,
      warnIfMissing: false,
    });

    if (saveResult.success) {
      results.success.push(`${blockType}/save.js (CUSTOMIZATION-STYLES)`);
      if (saveResult.action === 'injected') {
        results.changed++;
        console.log(`  ✓ ${blockType}/save.js - Injected ${saveResult.linesInjected} lines`);
      }
    } else if (saveResult.action === 'skipped') {
      results.skipped.push(`${blockType}/save.js (CUSTOMIZATION-STYLES - markers not found)`);
    } else {
      results.errors.push(`${blockType}/save.js: ${saveResult.error}`);
      console.log(`  ✗ ${blockType}/save.js - Error: ${saveResult.error}`);
    }
  }

  return results;
}

// ============================================================================
// Main Compiler
// ============================================================================

/**
 * Main compilation function
 */
async function compile() {
  const startTime = Date.now();
  const results = {
    success: [],
    errors: [],
    files: [],
  };

  try {
    // Ensure all output directories exist (silent)
    for (const [name, dir] of Object.entries(OUTPUT_DIRS)) {
      ensureDir(dir);
    }

    // Load all schemas
    const schemas = {};

    for (const blockType of BLOCKS) {
      try {
        schemas[blockType] = loadSchema(blockType);
      } catch (error) {
        results.errors.push(`Failed to load ${blockType}.json: ${error.message}`);
        console.error(`❌ Failed to load ${blockType}.json: ${error.message}`);
      }
    }

    if (Object.keys(schemas).length === 0) {
      throw new Error('No schemas loaded successfully');
    }

    // Generate files for each block (silent unless errors)
    for (const [blockType, schema] of Object.entries(schemas)) {
      // TypeScript types
      try {
        const { fileName, content } = generateTypeScript(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.types, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
      } catch (error) {
        results.errors.push(`TypeScript generation failed for ${blockType}: ${error.message}`);
      }

      // Zod validators
      try {
        const { fileName, content } = generateValidationSchema(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.validators, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
      } catch (error) {
        results.errors.push(`Validator generation failed for ${blockType}: ${error.message}`);
      }

      // Block attributes
      try {
        const { fileName, content } = generateBlockAttributes(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.blockAttributes, blockType, 'src', fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
      } catch (error) {
        results.errors.push(`Block attributes generation failed for ${blockType}: ${error.message}`);
      }

      // PHP CSS defaults
      try {
        const { fileName, content } = generatePHPCSSDefaults(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.phpCssDefaults, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
      } catch (error) {
        results.errors.push(`PHP CSS defaults generation failed for ${blockType}: ${error.message}`);
      }

      // CSS variables
      try {
        const { fileName, content } = generateCSSVariables(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.css, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
      } catch (error) {
        results.errors.push(`CSS generation failed for ${blockType}: ${error.message}`);
      }

      // Documentation
      try {
        const { fileName, content } = generateDocumentation(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.docs, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
      } catch (error) {
        results.errors.push(`Documentation generation failed for ${blockType}: ${error.message}`);
      }

      // Style builders
      try {
        const { fileName, content } = generateStyleBuilder(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.styles, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
      } catch (error) {
        results.errors.push(`Style builder generation failed for ${blockType}: ${error.message}`);
      }

      // Validate schema-mapping synchronization (silent unless warnings)
      validateSchemaMappingSync(schema, blockType);
    }

    // Generate combined PHP mappings file
    try {
      const { fileName, content } = generatePHPMappings(schemas);
      const filePath = path.join(OUTPUT_DIRS.phpCssDefaults, fileName);
      fs.writeFileSync(filePath, content);
      results.files.push({ path: filePath, lines: content.split('\n').length });
    } catch (error) {
      results.errors.push(`PHP mappings generation failed: ${error.message}`);
    }

    // Generate combined JS mappings file
    try {
      const { fileName, content } = generateJSMappings(schemas);
      const filePath = path.join(OUTPUT_DIRS.config, fileName);
      fs.writeFileSync(filePath, content);
      results.files.push({ path: filePath, lines: content.split('\n').length });
    } catch (error) {
      results.errors.push(`JS mappings generation failed: ${error.message}`);
    }

    // Generate control configuration file
    try {
      const { fileName, content } = generateControlConfigs(schemas);
      const filePath = path.join(OUTPUT_DIRS.config, fileName);
      fs.writeFileSync(filePath, content);
      results.files.push({ path: filePath, lines: content.split('\n').length });
    } catch (error) {
      results.errors.push(`Control config generation failed: ${error.message}`);
    }

    // ========================================
    // Code Injection Phase
    // ========================================
    const injectionResults = injectCodeIntoBlocks(schemas);

    // Add injection results to overall results
    results.injections = {
      success: injectionResults.success.length,
      skipped: injectionResults.skipped.length,
      errors: injectionResults.errors.length,
      changed: injectionResults.changed || 0,
      details: injectionResults,
    };

  } catch (error) {
    results.errors.push(`Compilation failed: ${error.message}`);
  }

  // Summary
  const elapsed = Date.now() - startTime;

  // Only show detailed summary on errors or changes
  const hasInjectionChanges = results.injections?.changed > 0;
  const hasErrors = results.errors.length > 0;

  if (hasErrors || hasInjectionChanges) {
    console.log('\n========================================');
    console.log('  Compilation Summary');
    console.log('========================================\n');

    console.log(`  Files generated: ${results.files.length}`);
    console.log(`  Total lines: ${results.files.reduce((sum, f) => sum + f.lines, 0)}`);

    if (results.injections && hasInjectionChanges) {
      console.log(`  Code injections: ${results.injections.changed} files updated`);
    }

    console.log(`  Errors: ${results.errors.length}`);
    console.log(`  Time: ${elapsed}ms\n`);
  }

  if (hasErrors) {
    console.log('  Errors:');
    for (const error of results.errors) {
      console.log(`    - ${error}`);
    }
    console.log('');
    process.exit(1);
  }

  // Minimal success message
  console.log(`✅ Schema compilation: ${results.files.length} files generated (${elapsed}ms)\n`);
  return results;
}

// Run compiler
async function main() {
  // Run schema compilation first
  await compile();

  // Then run CSS generation
  const cssGenerator = require('./css-generator');
  await cssGenerator.generate();
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
