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
 * - JavaScript exclusion lists (shared/src/config/)
 * - CSS variable declarations (assets/css/)
 * - Markdown documentation (docs/)
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');

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
    if (attr.themeable && attr.cssDefault && attr.cssDefault !== '') {
      // Extract the value from cssDefault (e.g., "--accordion-title-color: #333333;" -> "#333333")
      const cssDefaultMatch = attr.cssDefault.match(/:\s*([^;]+);?$/);
      const cssValue = cssDefaultMatch ? cssDefaultMatch[1].trim() : attr.default;

      if (cssValue !== null && cssValue !== undefined && cssValue !== '') {
        content += `  '${attrName}' => '${cssValue}',\n`;
      }
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
 */
function generatePHPMappings(allSchemas) {
  let mappings = {};

  for (const [blockType, schema] of Object.entries(allSchemas)) {
    mappings[blockType] = {};

    for (const [attrName, attr] of Object.entries(schema.attributes)) {
      if (attr.themeable && attr.cssVar) {
        mappings[blockType][attrName] = attr.cssVar;
      }
    }
  }

  // Generate PHP mapping array code
  let content = `/**
 * Auto-generated CSS Variable Mappings
 *
 * This mapping array is auto-generated from schema files.
 * Generated at: ${getTimestamp()}
 *
 * Copy this into theme-css-generator.php guttemberg_plus_map_attribute_to_css_var() function
 */

\$mappings = array(\n`;

  for (const [blockType, attrs] of Object.entries(mappings)) {
    content += `    '${blockType}' => array(\n`;

    for (const [attrName, cssVar] of Object.entries(attrs)) {
      content += `      '${attrName}' => '${cssVar}',\n`;
    }

    content += `    ),\n`;
  }

  content += `  );\n`;

  return { fileName: 'css-mappings-generated.php', content };
}

/**
 * Generate JavaScript exclusion lists
 */
function generateExclusions(blockType, schema) {
  const fileName = `${blockType}-exclusions.js`;
  const constName = `${toScreamingSnakeCase(blockType)}_EXCLUSIONS`;

  let content = getGeneratedHeader(`${blockType}.json`, `Exclusion List for ${schema.blockName} Block`);

  // Collect non-themeable attributes
  const exclusions = [];

  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (!attr.themeable) {
      exclusions.push({
        name: attrName,
        reason: attr.reason || 'unknown',
        description: attr.description || '',
      });
    }
  }

  // Group by reason
  const groupedExclusions = {};
  for (const excl of exclusions) {
    if (!groupedExclusions[excl.reason]) {
      groupedExclusions[excl.reason] = [];
    }
    groupedExclusions[excl.reason].push(excl);
  }

  // Generate the exclusion array
  content += `/**\n * Attributes excluded from theme customization checks for ${schema.blockName} block\n * These attributes are not saved in themes and are not compared for customization detection\n */\n`;
  content += `export const ${constName} = [\n`;

  for (const [reason, attrs] of Object.entries(groupedExclusions)) {
    content += `  // ${reason} attributes\n`;
    for (const attr of attrs) {
      content += `  '${attr.name}',\n`;
    }
  }

  content += `];\n\n`;

  // Export default
  content += `export default ${constName};\n`;

  return { fileName, content };
}

/**
 * Generate CSS variable declarations
 */
function generateCSSVariables(blockType, schema) {
  const fileName = `${blockType}-generated.css`;
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

  // Collect all themeable attributes with cssDefault
  for (const [attrName, attr] of Object.entries(schema.attributes)) {
    if (attr.themeable && attr.cssDefault && attr.cssDefault !== '') {
      content += `  ${attr.cssDefault}\n`;
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

// ============================================================================
// Main Compiler
// ============================================================================

/**
 * Main compilation function
 */
async function compile() {
  console.log('\n========================================');
  console.log('  Guttemberg Plus Schema Compiler');
  console.log('========================================\n');

  const startTime = Date.now();
  const results = {
    success: [],
    errors: [],
    files: [],
  };

  try {
    // Ensure all output directories exist
    console.log('Creating output directories...');
    for (const [name, dir] of Object.entries(OUTPUT_DIRS)) {
      ensureDir(dir);
    }
    console.log('');

    // Load all schemas
    console.log('Loading schemas...');
    const schemas = {};

    for (const blockType of BLOCKS) {
      try {
        schemas[blockType] = loadSchema(blockType);
        console.log(`  Loaded: ${blockType}.json`);
      } catch (error) {
        results.errors.push(`Failed to load ${blockType}.json: ${error.message}`);
        console.error(`  ERROR: ${blockType}.json - ${error.message}`);
      }
    }
    console.log('');

    if (Object.keys(schemas).length === 0) {
      throw new Error('No schemas loaded successfully');
    }

    // Generate files for each block
    console.log('Generating files...\n');

    for (const [blockType, schema] of Object.entries(schemas)) {
      console.log(`  ${schema.blockName} (${blockType}):`);

      // TypeScript types
      try {
        const { fileName, content } = generateTypeScript(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.types, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
        console.log(`    - types/${fileName}`);
      } catch (error) {
        results.errors.push(`TypeScript generation failed for ${blockType}: ${error.message}`);
      }

      // Zod validators
      try {
        const { fileName, content } = generateValidationSchema(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.validators, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
        console.log(`    - validators/${fileName}`);
      } catch (error) {
        results.errors.push(`Validator generation failed for ${blockType}: ${error.message}`);
      }

      // Block attributes
      try {
        const { fileName, content } = generateBlockAttributes(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.blockAttributes, blockType, 'src', fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
        console.log(`    - blocks/${blockType}/src/${fileName}`);
      } catch (error) {
        results.errors.push(`Block attributes generation failed for ${blockType}: ${error.message}`);
      }

      // PHP CSS defaults
      try {
        const { fileName, content } = generatePHPCSSDefaults(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.phpCssDefaults, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
        console.log(`    - php/css-defaults/${fileName}`);
      } catch (error) {
        results.errors.push(`PHP CSS defaults generation failed for ${blockType}: ${error.message}`);
      }

      // JavaScript exclusions
      try {
        const { fileName, content } = generateExclusions(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.config, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
        console.log(`    - config/${fileName}`);
      } catch (error) {
        results.errors.push(`Exclusions generation failed for ${blockType}: ${error.message}`);
      }

      // CSS variables
      try {
        const { fileName, content } = generateCSSVariables(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.css, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
        console.log(`    - css/${fileName}`);
      } catch (error) {
        results.errors.push(`CSS generation failed for ${blockType}: ${error.message}`);
      }

      // Documentation
      try {
        const { fileName, content } = generateDocumentation(blockType, schema);
        const filePath = path.join(OUTPUT_DIRS.docs, fileName);
        fs.writeFileSync(filePath, content);
        results.files.push({ path: filePath, lines: content.split('\n').length });
        console.log(`    - docs/${fileName}`);
      } catch (error) {
        results.errors.push(`Documentation generation failed for ${blockType}: ${error.message}`);
      }

      console.log('');
    }

    // Generate combined PHP mappings file
    console.log('  Combined files:');
    try {
      const { fileName, content } = generatePHPMappings(schemas);
      const filePath = path.join(OUTPUT_DIRS.phpCssDefaults, fileName);
      fs.writeFileSync(filePath, content);
      results.files.push({ path: filePath, lines: content.split('\n').length });
      console.log(`    - php/css-defaults/${fileName}`);
    } catch (error) {
      results.errors.push(`PHP mappings generation failed: ${error.message}`);
    }

    // Generate combined exclusions file
    try {
      let combinedContent = getGeneratedHeader('*.json', 'Combined Theme Exclusions for All Blocks');
      combinedContent += `// Re-export all exclusions from individual block files\n`;
      combinedContent += `export { ACCORDION_EXCLUSIONS } from './accordion-exclusions.js';\n`;
      combinedContent += `export { TABS_EXCLUSIONS } from './tabs-exclusions.js';\n`;
      combinedContent += `export { TOC_EXCLUSIONS } from './toc-exclusions.js';\n\n`;

      combinedContent += `/**\n * Get exclusions for a specific block type\n */\n`;
      combinedContent += `export function getExclusionsForBlock(blockType) {\n`;
      combinedContent += `  switch (blockType) {\n`;
      combinedContent += `    case 'accordion':\n`;
      combinedContent += `      return ACCORDION_EXCLUSIONS;\n`;
      combinedContent += `    case 'tabs':\n`;
      combinedContent += `      return TABS_EXCLUSIONS;\n`;
      combinedContent += `    case 'toc':\n`;
      combinedContent += `      return TOC_EXCLUSIONS;\n`;
      combinedContent += `    default:\n`;
      combinedContent += `      console.warn(\`Unknown block type: \${blockType}\`);\n`;
      combinedContent += `      return [];\n`;
      combinedContent += `  }\n`;
      combinedContent += `}\n`;

      const combinedPath = path.join(OUTPUT_DIRS.config, 'theme-exclusions-generated.js');
      fs.writeFileSync(combinedPath, combinedContent);
      results.files.push({ path: combinedPath, lines: combinedContent.split('\n').length });
      console.log(`    - config/theme-exclusions-generated.js`);
    } catch (error) {
      results.errors.push(`Combined exclusions generation failed: ${error.message}`);
    }

    console.log('');

  } catch (error) {
    results.errors.push(`Compilation failed: ${error.message}`);
  }

  // Summary
  const elapsed = Date.now() - startTime;

  console.log('========================================');
  console.log('  Compilation Summary');
  console.log('========================================\n');

  console.log(`  Files generated: ${results.files.length}`);
  console.log(`  Total lines: ${results.files.reduce((sum, f) => sum + f.lines, 0)}`);
  console.log(`  Errors: ${results.errors.length}`);
  console.log(`  Time: ${elapsed}ms\n`);

  if (results.errors.length > 0) {
    console.log('  Errors:');
    for (const error of results.errors) {
      console.log(`    - ${error}`);
    }
    console.log('');
    process.exit(1);
  }

  console.log('  Schema compilation completed successfully!\n');
  return results;
}

// Run compiler
compile().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
