/**
 * Comprehensive Expander - THE ORCHESTRATOR
 *
 * This is the brain of the pipeline. It orchestrates all macro expansion
 * and builds the complete comprehensive schema with all metadata needed
 * by downstream generators.
 *
 * Input: Merged schema (from schema-merger)
 * Output: Comprehensive schema with:
 *   - All attributes expanded from macros to atomic
 *   - Responsive variants applied
 *   - defaultValues map (flat lookup)
 *   - cssVarMap (CSS var → attribute metadata)
 *   - selectorVarMap (selector → array of CSS vars)
 *   - responsiveSelectors (device-specific selectors)
 */

const { expandIconPanelMacro } = require('./icon-expansor');
const { expandTypographyPanelMacro } = require('./typography-expansor');
const { expandBorderPanelMacro } = require('./border-expansor');
const { expandBoxPanelMacro } = require('./box-expansor');
const { expandColorPanelMacro } = require('./color-expansor');
const { addCompositeAttributes } = require('./composite-expansor');
const { applyResponsiveVariants } = require('./responsive-expansor');
const { buildCssVarName } = require('./naming-utils');

const EXPANDERS = {
  'icon-panel': expandIconPanelMacro,
  'typography-panel': expandTypographyPanelMacro,
  'border-panel': expandBorderPanelMacro,
  'box-panel': expandBoxPanelMacro,
  'color-panel': expandColorPanelMacro,
};

function normalizeElementIds(element) {
  if (Array.isArray(element)) {
    return element.filter(Boolean);
  }
  return element ? [element] : [];
}

/**
 * Create comprehensive schema from merged schema
 *
 * @param {Object} mergedSchema - Schema merged with HTML structure
 * @returns {Object} Complete comprehensive schema
 */
function createComprehensiveSchema(mergedSchema) {
  const blockType = mergedSchema.blockType || 'unknown';
  const elements = mergedSchema.structure?.elements || {};

  // Step 1: Expand all macros into atomic attributes
  console.log(`[Comprehensive Expander] Expanding macros for ${blockType}...`);
  const expandedAttributes = {};

  Object.entries(mergedSchema.attributes || {}).forEach(([attrName, attrDef]) => {
    const expander = EXPANDERS[attrDef.type];

    if (expander) {
      // This is a macro - expand it
      console.log(`  - Expanding ${attrDef.type} macro: ${attrName}`);
      const expanded = expander(attrName, attrDef, blockType);
      Object.assign(expandedAttributes, expanded);
    } else {
      // Already atomic - keep as-is
      expandedAttributes[attrName] = attrDef;
    }
  });

  console.log(`[Comprehensive Expander] Total attributes after expansion: ${Object.keys(expandedAttributes).length}`);

  // Step 2: Auto-generate cssVar names for all attributes with cssProperty
  console.log(`[Comprehensive Expander] Auto-generating CSS variable names...`);
  Object.entries(expandedAttributes).forEach(([attrName, attr]) => {
    if (attr.type !== 'composite' && attr.cssProperty && attr.element && attr.outputsCSS !== false) {
      if (Array.isArray(attr.element)) {
        return;
      }
      if (!attr.cssVar && !attr.cssValue && !attr.cssValueByDevice) {
        const state = attr.state || 'base';
        // Generate base cssVar (desktop, base state)
        attr.cssVar = buildCssVarName(blockType, attr.element, attr.cssProperty, state);
      }
    }
  });

  // Step 3: Apply responsive variants to all responsive attributes
  console.log(`[Comprehensive Expander] Applying responsive variants...`);
  const withResponsive = applyResponsiveVariants(expandedAttributes, blockType);

  // Step 4: Auto-generate composite attributes (for compression)
  console.log(`[Comprehensive Expander] Building composite attributes...`);
  const withComposites = addCompositeAttributes(withResponsive);

  // Step 5: Extract all default values into flat map
  console.log(`[Comprehensive Expander] Extracting default values...`);
  const defaultValues = {};
  Object.entries(withComposites).forEach(([key, attr]) => {
    if (attr.type === 'composite') {
      return;
    }
    if (attr.default !== undefined) {
      defaultValues[key] = attr.default;
    }
  });

  // Step 6: Build CSS var → attribute metadata map
  console.log(`[Comprehensive Expander] Building CSS variable map...`);
  const cssVarMap = {};
  Object.entries(withComposites).forEach(([attrName, attr]) => {
    if (!attr.cssVar) return;

    // Get element details from structure (supports multi-element)
    const elementIds = normalizeElementIds(attr.element);
    const selectors = elementIds
      .map((id) => elements[id]?.selector)
      .filter(Boolean);
    const elementValue = elementIds.length > 1 ? elementIds : elementIds[0] || null;
    const selectorValue = selectors.length > 1 ? selectors : selectors[0] || null;

    cssVarMap[attr.cssVar] = {
      attribute: attrName,
      element: elementValue,
      selector: selectorValue,
      cssProperty: attr.cssProperty || null,
      state: attr.state || 'base',
      responsive: attr.responsive || false,
      type: attr.type
    };

    // Add responsive variants to cssVarMap
    if (attr.cssVarVariants) {
      attr.cssVarVariants.forEach((varName, index) => {
        if (index === 0) return; // Skip base (already added above)

        const device = index === 1 ? 'tablet' : 'mobile';
        cssVarMap[varName] = {
          attribute: attrName,
          element: elementValue,
          selector: selectorValue,
          cssProperty: attr.cssProperty || null,
          state: attr.state || 'base',
          device: device,
          responsive: true,
          type: attr.type
        };
      });
    }
  });

  // Step 7: Build selector → CSS vars reverse lookup
  console.log(`[Comprehensive Expander] Building selector-to-variables map...`);
  const selectorVarMap = {};
  Object.entries(withComposites).forEach(([attrName, attr]) => {
    if (!attr.cssVar || !attr.element) return;

    const elementIds = normalizeElementIds(attr.element);
    elementIds.forEach((id) => {
      const element = elements[id];
      if (!element?.selector) return;

      if (!selectorVarMap[element.selector]) {
        selectorVarMap[element.selector] = [];
      }

      // Add base cssVar
      if (!selectorVarMap[element.selector].includes(attr.cssVar)) {
        selectorVarMap[element.selector].push(attr.cssVar);
      }
    });
  });

  // Step 8: Build responsive selectors
  console.log(`[Comprehensive Expander] Building responsive selectors...`);
  const responsiveSelectors = buildResponsiveSelectors(withComposites, elements, blockType);

  // Step 9: Build final comprehensive schema
  console.log(`[Comprehensive Expander] Building final comprehensive schema...`);
  const comprehensive = {
    ...mergedSchema,
    attributes: withComposites,
    defaultValues,
    cssVarMap,
    selectorVarMap,
    responsiveSelectors,
    _meta: {
      generated: new Date().toISOString(),
      generator: 'comprehensive-expander.js',
      version: '2.0.0',
      totalAttributes: Object.keys(withComposites).length,
      totalDefaults: Object.keys(defaultValues).length,
      totalCssVars: Object.keys(cssVarMap).length,
      totalSelectors: Object.keys(selectorVarMap).length,
      totalResponsiveSelectors: responsiveSelectors.length
    }
  };

  console.log(`[Comprehensive Expander] ✓ Complete!`);
  console.log(`  - Total attributes: ${comprehensive._meta.totalAttributes}`);
  console.log(`  - Total defaults: ${comprehensive._meta.totalDefaults}`);
  console.log(`  - Total CSS vars: ${comprehensive._meta.totalCssVars}`);
  console.log(`  - Total selectors: ${comprehensive._meta.totalSelectors}`);
  console.log(`  - Total responsive selectors: ${comprehensive._meta.totalResponsiveSelectors}`);

  return comprehensive;
}

/**
 * Build responsive selectors array
 *
 * @param {Object} attributes - Expanded attributes with responsive flags
 * @param {Object} elements - Element map from HTML structure
 * @param {string} blockType - Block type
 * @returns {Array} Responsive selectors array
 */
function buildResponsiveSelectors(attributes, elements, blockType) {
  const selectors = [];
  const devices = ['tablet', 'mobile'];
  const states = ['base', 'hover', 'active'];

  // Group attributes by element + state + device
  const grouped = {};

  Object.entries(attributes).forEach(([attrName, attr]) => {
    if (!attr.responsive || !attr.element || !attr.cssProperty) return;

    const elementIds = normalizeElementIds(attr.element);
    if (elementIds.length === 0) return;

    const state = attr.state || 'base';

    elementIds.forEach((elementId) => {
      const element = elements[elementId];
      if (!element?.selector) return;

      devices.forEach(device => {
        const key = `${elementId}:${state}:${device}`;

        if (!grouped[key]) {
          grouped[key] = {
            element: elementId,
            selector: element.selector,
            state: state,
            device: device,
            cssVars: []
          };
        }

        const variants = Array.isArray(attr.cssVarVariants)
          ? attr.cssVarVariants
          : [attr.cssVar];
        const deviceIndex = device === 'tablet' ? 1 : 2;
        const varName = variants[deviceIndex] || `${attr.cssVar}-${device}`;
        if (!grouped[key].cssVars.includes(varName)) {
          grouped[key].cssVars.push(varName);
        }
      });
    });
  });

  // Convert grouped map to array
  Object.values(grouped).forEach(group => {
    if (group.cssVars.length > 0) {
      selectors.push(group);
    }
  });

  return selectors;
}

/**
 * Create comprehensive schemas for multiple blocks
 *
 * @param {Object} mergedSchemas - Object mapping block types to merged schemas
 * @returns {Object} Comprehensive schemas keyed by block type
 */
function createComprehensiveSchemas(mergedSchemas) {
  const comprehensive = {};

  for (const [blockType, mergedSchema] of Object.entries(mergedSchemas)) {
    console.log(`\n========================================`);
    console.log(`Processing ${blockType}`);
    console.log(`========================================`);
    comprehensive[blockType] = createComprehensiveSchema(mergedSchema);
  }

  return comprehensive;
}

/**
 * CLI Support - Load and process schema files from disk
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const SCHEMAS_DIR = path.join(ROOT_DIR, 'schemas');

/**
 * Resolve schema path from name or path
 */
function resolveSchemaPath(input) {
  if (!input) {
    throw new Error('Missing schema name or path.');
  }

  if (input.endsWith('.json') || input.includes(path.sep)) {
    return path.resolve(ROOT_DIR, input);
  }

  return path.join(SCHEMAS_DIR, `${input}.json`);
}

/**
 * Load schema from file
 */
function loadSchema(schemaPath) {
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  const content = fs.readFileSync(schemaPath, 'utf8');

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse schema: ${error.message}`);
  }
}

/**
 * Write comprehensive schema to file
 */
function writeComprehensive(outputPath, comprehensiveSchema) {
  const blockType = comprehensiveSchema.blockType || 'block';
  const structure = comprehensiveSchema.structure;

  if (structure) {
    const baseName = blockType || path.basename(outputPath, '.json').replace(/-comprehensive$/, '');
    const mappingDir = path.join(ROOT_DIR, 'schemas');
    fs.mkdirSync(mappingDir, { recursive: true });
    const mappingPath = path.join(mappingDir, `${baseName}-structure-mapping-autogenerated.json`);
    const mappingPayload = {
      blockType,
      structure,
    };
    fs.writeFileSync(mappingPath, `${JSON.stringify(mappingPayload, null, 2)}\n`, 'utf8');
    console.log(`✓ Structure mapping written to ${mappingPath}`);
  }

  const { structure: _ignored, ...withoutStructure } = comprehensiveSchema;
  const payload = `${JSON.stringify(withoutStructure, null, 2)}\n`;
  fs.writeFileSync(outputPath, payload, 'utf8');
  console.log(`✓ Comprehensive schema written to ${outputPath}`);
}

/**
 * CLI entry point
 */
function runCli() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node parser/comprehensive-expander.js <schema-name|path> [--out path]');
    console.log('');
    console.log('Examples:');
    console.log('  node parser/comprehensive-expander.js accordion');
    console.log('  node parser/comprehensive-expander.js schemas/accordion.json --out output/accordion-comprehensive.json');
    process.exit(1);
  }

  const schemaArg = args[0];
  const outIndex = args.indexOf('--out');
  const outputPath = outIndex >= 0 ? args[outIndex + 1] : null;

  // Load minimal schema
  const schemaPath = resolveSchemaPath(schemaArg);
  const minimalSchema = loadSchema(schemaPath);

  // For CLI, we need to load HTML structure too
  // Assume structure file is in same directory with -structure.html suffix
  const { parseHTMLTemplate } = require('./html-parser');
  const { mergeStructureIntoSchema } = require('./schema-merger');

  const structurePath = schemaPath.replace('.json', '-structure.html');
  if (!fs.existsSync(structurePath)) {
    console.error(`Error: HTML structure file not found: ${structurePath}`);
    process.exit(1);
  }

  // Parse HTML structure
  const htmlStructure = parseHTMLTemplate(structurePath);

  // Merge schema with structure
  const merged = mergeStructureIntoSchema(minimalSchema, htmlStructure);

  // Create comprehensive schema
  const comprehensive = createComprehensiveSchema(merged);

  // Output
  if (outputPath) {
    writeComprehensive(path.resolve(ROOT_DIR, outputPath), comprehensive);
  } else {
    process.stdout.write(`${JSON.stringify(comprehensive, null, 2)}\n`);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  runCli();
}

module.exports = {
  createComprehensiveSchema,
  createComprehensiveSchemas,
  resolveSchemaPath,
  loadSchema,
  writeComprehensive
};
