/**
 * Cross-Schema Validation Script
 *
 * Validates that structure schemas and attribute schemas stay synchronized.
 * This ensures that element references, class names, and style applications
 * remain consistent across the schema system.
 *
 * @version 1.0.0
 * @agent AGENT 3
 */

const fs = require('fs');
const path = require('path');

const BLOCKS = ['accordion', 'tabs', 'toc'];
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// Icon positioning profiles for each block type
const POSITIONING_PROFILES = {
  accordion: ['left', 'right', 'box-left', 'box-right'],
  toc: ['left', 'right', 'box-left', 'box-right'],
  tabs: ['left', 'right']
};

/**
 * Load and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Object} Parsed JSON object
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ File not found: ${filePath}`);
      console.error(`   Please ensure AGENT 1 and AGENT 2 have completed their tasks.`);
    } else {
      console.error(`❌ Failed to load ${filePath}:`, error.message);
    }
    process.exit(1);
  }
}

/**
 * Expand icon-panel macro into 15 individual attributes (2 toggles + 13 icon settings)
 * (Same logic as schema-compiler.js - must stay in sync)
 */
function expandIconPanelMacro(macroName, macro, blockType) {
  const expanded = {};

  // ============================================================================
  // INFER MISSING FIELDS WITH SMART DEFAULTS
  // ============================================================================

  // Always 'icon' for icon-panel type
  const group = macro.group || 'icon';

  // Derive label from attribute name: "titleIcon" → "Title Icon"
  const label = macro.label || macroName.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());

  // Auto-generate description
  const description = macro.description || `Icon settings for ${blockType}`;

  // Infer positioning profile from blockType
  const positioningProfile = macro.positioningProfile || blockType;

  // Get appliesToElement (or use appliesTo for backwards compat)
  const appliesToElement = macro.appliesToElement || macro.appliesTo || 'icon';

  // structureElement is same as appliesToElement
  const structureElement = appliesToElement;

  // Responsive attributes are always the same for icons
  const responsiveAttrs = ['size', 'maxSize', 'offsetX', 'offsetY'];

  // Get other required fields
  const { cssVar, order, themeable = true, outputsCSS = false } = macro;
  const defaults = macro.default || {};

  // Get positioning options from profile
  const allowedPositions = POSITIONING_PROFILES[positioningProfile] || POSITIONING_PROFILES[blockType] || ['left', 'right'];

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
    themeable: true,
    responsive: false,
    outputsCSS: false,
    group,
    order: order || 0,
    label: 'Show Icon',
    description: 'Display icon in the block'
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
      showIcon: [true]
    }
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
      showIcon: [true]
    }
  };

  // ============================================================================
  // 4. ICON ROTATION
  // ============================================================================

  expanded.iconRotation = {
    type: 'string',
    default: defaults.rotation || '180deg',
    control: 'SliderWithInput',
    cssVar: `${cssVar}-rotation`,
    cssProperty: 'transform',
    appliesTo: structureElement,
    themeable: true,
    responsive: false,
    outputsCSS: true,
    group,
    order: order ? order + 0.15 : 0.15,
    label: 'Rotation',
    description: 'Rotation angle when open (degrees)',
    min: -360,
    max: 360,
    step: 1,
    unit: 'deg',
    showWhen: {
      showIcon: [true],
      useDifferentIcons: [false]
    }
  };

  // ============================================================================
  // HELPER: GENERATE STATE-SPECIFIC ATTRIBUTES (inactive/active)
  // ============================================================================

  const generateStateAttributes = (state) => {
    const statePrefix = state === 'inactive' ? 'iconInactive' : 'iconActive';
    const cssVarSuffix = state === 'inactive' ? '' : '-active';
    const stateDefaults = state === 'inactive' ? inactiveDefaults : activeDefaults;
    const stateLabel = state === 'inactive' ? '' : ' (Active)';
    const orderOffset = state === 'inactive' ? 0.2 : 0.3;

    // Get defaults with fallback to inactive state
    const getDefault = (key) => {
      if (stateDefaults && stateDefaults[key] !== undefined) {
        return stateDefaults[key];
      }
      if (state === 'active' && inactiveDefaults && inactiveDefaults[key] !== undefined) {
        return null; // null means "use inactive value"
      }
      return undefined;
    };

    // Get source default and normalize icon-type to kind
    const sourceDefault = getDefault('source') || { 'icon-type': 'char', value: '▾' };
    const normalizedSource = {
      kind: sourceDefault['icon-type'] || sourceDefault.kind || 'char',
      value: sourceDefault.value || '▾'
    };

    // Build showWhen rules based on state
    const baseShowWhen = {
      showIcon: [true]
    };
    const stateShowWhen = state === 'inactive'
      ? baseShowWhen
      : { ...baseShowWhen, useDifferentIcons: [true] };

    return {
      // ========================================================================
      // SOURCE (IconPicker)
      // ========================================================================
      [`${statePrefix}Source`]: {
        type: 'object',
        default: normalizedSource,
        control: 'IconPicker',
        themeable: true,
        responsive: false,
        outputsCSS: false,
        group,
        subgroup: state,
        order: order ? order + orderOffset : orderOffset,
        label: `Icon${stateLabel}`,
        description: `Icon when ${state === 'inactive' ? 'closed' : 'open'}`,
        showWhen: stateShowWhen
      },

      // ========================================================================
      // COLOR (ColorControl)
      // ========================================================================
      [`${statePrefix}Color`]: {
        type: 'string',
        default: getDefault('color') || '#333333',
        control: 'ColorControl',
        cssVar: `${cssVar}${cssVarSuffix}-color`,
        cssProperty: 'color',
        appliesTo: structureElement,
        themeable: true,
        responsive: false,
        outputsCSS: true,
        group,
        subgroup: state,
        order: order ? order + orderOffset + 0.01 : orderOffset + 0.01,
        label: `Color${stateLabel}`,
        description: 'Icon color (for character/library icons)',
        conditionalRender: `${statePrefix}Source.kind !== "image"`,
        showWhen: stateShowWhen
      },

      // ========================================================================
      // SIZE (SliderWithInput)
      // ========================================================================
      [`${statePrefix}Size`]: {
        type: 'string',
        default: getDefault('size') || '16px',
        control: 'SliderWithInput',
        cssVar: `${cssVar}${cssVarSuffix}-size`,
        cssProperty: 'font-size',
        appliesTo: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('size'),
        outputsCSS: true,
        group,
        subgroup: state,
        order: order ? order + orderOffset + 0.02 : orderOffset + 0.02,
        label: `Size${stateLabel}`,
        description: 'Icon size (for character/library icons)',
        conditionalRender: `${statePrefix}Source.kind !== "image"`,
        min: 8,
        max: 64,
        step: 1,
        unit: 'px',
        showWhen: stateShowWhen
      },

      // ========================================================================
      // MAX SIZE (SliderWithInput)
      // ========================================================================
      [`${statePrefix}MaxSize`]: {
        type: 'string',
        default: getDefault('maxSize') || '24px',
        control: 'SliderWithInput',
        cssVar: `${cssVar}${cssVarSuffix}-max-size`,
        cssProperty: 'max-width',
        appliesTo: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('maxSize'),
        outputsCSS: true,
        group,
        subgroup: state,
        order: order ? order + orderOffset + 0.03 : orderOffset + 0.03,
        label: `Max Size${stateLabel}`,
        description: 'Maximum icon size (for image icons)',
        conditionalRender: `${statePrefix}Source.kind === "image"`,
        min: 8,
        max: 128,
        step: 1,
        unit: 'px',
        showWhen: stateShowWhen
      },

      // ========================================================================
      // OFFSET X (SliderWithInput)
      // ========================================================================
      [`${statePrefix}OffsetX`]: {
        type: 'string',
        default: getDefault('offsetX') || '0px',
        control: 'SliderWithInput',
        cssVar: `${cssVar}${cssVarSuffix}-offset-x`,
        cssProperty: 'left',
        appliesTo: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('offsetX'),
        outputsCSS: true,
        group,
        subgroup: state,
        order: order ? order + orderOffset + 0.04 : orderOffset + 0.04,
        label: `Offset X${stateLabel}`,
        description: 'Horizontal offset of icon',
        min: -100,
        max: 100,
        step: 1,
        unit: 'px',
        showWhen: stateShowWhen
      },

      // ========================================================================
      // OFFSET Y (SliderWithInput)
      // ========================================================================
      [`${statePrefix}OffsetY`]: {
        type: 'string',
        default: getDefault('offsetY') || '0px',
        control: 'SliderWithInput',
        cssVar: `${cssVar}${cssVarSuffix}-offset-y`,
        cssProperty: 'top',
        appliesTo: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('offsetY'),
        outputsCSS: true,
        group,
        subgroup: state,
        order: order ? order + orderOffset + 0.05 : orderOffset + 0.05,
        label: `Offset Y${stateLabel}`,
        description: 'Vertical offset of icon',
        min: -100,
        max: 100,
        step: 1,
        unit: 'px',
        showWhen: stateShowWhen
      }
    };
  };

  // ============================================================================
  // 5-10. INACTIVE STATE ATTRIBUTES
  // ============================================================================

  Object.assign(expanded, generateStateAttributes('inactive'));

  // ============================================================================
  // 11-16. ACTIVE STATE ATTRIBUTES
  // ============================================================================

  Object.assign(expanded, generateStateAttributes('active'));

  return expanded;
}

/**
 * Process schema attributes to expand icon-panel macros
 * (Same logic as schema-compiler.js - must stay in sync)
 */
function processAttributes(attributes, blockType) {
  const processed = {};

  for (const [name, attr] of Object.entries(attributes)) {
    if (attr.type === 'icon-panel') {
      // Expand icon-panel macro
      const expanded = expandIconPanelMacro(name, attr, blockType);
      Object.assign(processed, expanded);
    } else {
      // Regular attribute - keep as is
      processed[name] = attr;
    }
  }

  return processed;
}

/**
 * Validate that a string is a valid CSS identifier
 * @param {string} identifier - The CSS identifier to validate
 * @returns {boolean} True if valid
 */
function isValidCSSIdentifier(identifier) {
  // CSS identifiers must start with a letter, hyphen, or underscore
  // and can contain letters, digits, hyphens, and underscores
  const cssIdentifierRegex = /^-?[a-zA-Z_][\w-]*$/;
  return cssIdentifierRegex.test(identifier);
}

/**
 * Validate that class names are valid CSS identifiers
 * @param {string} className - Space-separated class names
 * @returns {Object} { valid: boolean, invalidClasses: string[] }
 */
function validateCSSClassNames(className) {
  const classes = className.split(/\s+/).filter(c => c.length > 0);
  const invalidClasses = classes.filter(c => !isValidCSSIdentifier(c));

  return {
    valid: invalidClasses.length === 0,
    invalidClasses
  };
}

/**
 * Detect circular dependencies in element hierarchy
 * @param {Map} elements - Map of element ID to element object
 * @param {string} startId - Starting element ID to check
 * @param {Set} visited - Set of visited element IDs
 * @param {Array} path - Current path of element IDs
 * @returns {Object} { hasCircular: boolean, circularPath: string[] }
 */
function detectCircularDependency(elements, startId, visited = new Set(), path = []) {
  if (path.includes(startId)) {
    return {
      hasCircular: true,
      circularPath: [...path, startId]
    };
  }

  if (visited.has(startId)) {
    return { hasCircular: false, circularPath: [] };
  }

  visited.add(startId);
  const element = elements.get(startId);

  if (!element || !element.children) {
    return { hasCircular: false, circularPath: [] };
  }

  const currentPath = [...path, startId];

  for (const childId of element.children) {
    const result = detectCircularDependency(elements, childId, visited, currentPath);
    if (result.hasCircular) {
      return result;
    }
  }

  return { hasCircular: false, circularPath: [] };
}

/**
 * Recursively collect block source file contents for a given block type
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @returns {string[]} Array of file contents
 */
function collectBlockSourceContents(blockType) {
  const baseDir = path.join(__dirname, '..', 'blocks', blockType, 'src');
  const contents = [];

  const walk = (dir) => {
    if (!fs.existsSync(dir)) {
      return;
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const ext = path.extname(entry.name);
        if (SOURCE_EXTENSIONS.has(ext)) {
          try {
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            contents.push(fileContent);
          } catch (error) {
            console.warn(`⚠️  Could not read ${fullPath}: ${error.message}`);
          }
        }
      }
    });
  };

  walk(baseDir);
  return contents;
}

/**
 * Validate that structure schema class names are present in block source markup
 * This catches drift between the declared DOM structure and save.js/frontend.js
 * @param {Object} structure - The structure schema
 * @param {string} blockType - Block type identifier
 * @returns {{errors: string[], warnings: string[]}}
 */
function validateImplementationUsage(structure, blockType) {
  const errors = [];
  const warnings = [];
  const sourceContents = collectBlockSourceContents(blockType);

  if (sourceContents.length === 0) {
    warnings.push(
      `⚠️  No source files found for block "${blockType}" under blocks/${blockType}/src.` +
      ` Implementation checks were skipped.`
    );
    return { errors, warnings };
  }

  const classExistsInSource = (className) =>
    sourceContents.some((content) => content.includes(className));

  Object.entries(structure.elements || {}).forEach(([id, element]) => {
    if (!element.className) {
      return;
    }

    const classNames = element.className.split(/\s+/).filter(Boolean);

    classNames.forEach((cls) => {
      if (!classExistsInSource(cls)) {
        errors.push(
          `❌ Element "${id}" declares class "${cls}" in structure schema,` +
          ` but it was not found in blocks/${blockType}/src save/frontend markup.\n` +
          `   Fix: Update the schema or the block markup so they match.`
        );
      }
    });
  });

  return { errors, warnings };
}

/**
 * Validate a single block's schemas
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @returns {boolean} True if validation passed
 */
function validateBlock(blockType) {

  const basePath = path.join(__dirname, '..');
  const structurePath = path.join(basePath, `schemas/${blockType}-structure.json`);
  const attributesPath = path.join(basePath, `schemas/${blockType}.json`);

  // Load schemas
  const structure = loadJSON(structurePath);
  const attributesRaw = loadJSON(attributesPath);

  // Process attributes to expand icon-panel macros
  const attributes = {
    ...attributesRaw,
    attributes: processAttributes(attributesRaw.attributes || {}, blockType)
  };

  const errors = [];
  const warnings = [];

  // Build element map
  const elements = new Map();
  if (structure.elements) {
    Object.entries(structure.elements).forEach(([id, element]) => {
      elements.set(id, element);
    });
  } else {
    errors.push(
      `❌ Structure schema is missing "elements" field!\n` +
      `   Expected structure: { "elements": { ... } }`
    );
    reportResults(blockType, errors, warnings);
    return false;
  }

  // ========================================
  // VALIDATION 1: Structure Schema Integrity
  // ========================================

  // Check for root element
  if (!structure.root) {
    errors.push(
      `❌ Structure schema is missing "root" field!\n` +
      `   The root field should specify the root element ID.`
    );
  } else if (!elements.has(structure.root)) {
    errors.push(
      `❌ Root element "${structure.root}" doesn't exist in elements!\n` +
      `   Available elements: ${Array.from(elements.keys()).join(', ')}`
    );
  }

  // Validate all children references exist
  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.children) {
      element.children.forEach(childId => {
        if (!elements.has(childId)) {
          errors.push(
            `❌ Element "${id}" references child "${childId}" that doesn't exist!\n` +
            `   Available elements: ${Array.from(elements.keys()).join(', ')}\n` +
            `   Fix: Either add "${childId}" to elements or remove it from "${id}.children"`
          );
        }
      });
    }
  });

  // Validate CSS class names
  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.className) {
      const validation = validateCSSClassNames(element.className);
      if (!validation.valid) {
        errors.push(
          `❌ Element "${id}" has invalid CSS class name(s): ${validation.invalidClasses.join(', ')}\n` +
          `   Class names must start with a letter, hyphen, or underscore\n` +
          `   and can only contain letters, digits, hyphens, and underscores.`
        );
      }
    }
  });

  // Check for circular dependencies
  const visited = new Set();
  elements.forEach((element, id) => {
    if (!visited.has(id)) {
      const result = detectCircularDependency(elements, id);
      if (result.hasCircular) {
        errors.push(
          `❌ Circular dependency detected in element hierarchy!\n` +
          `   Path: ${result.circularPath.join(' → ')}\n` +
          `   Fix: Remove one of the parent-child relationships in this cycle.`
        );
      }
    }
  });

  // ========================================
  // VALIDATION 2: Attribute Schema Integrity
  // ========================================

  if (!attributes.attributes) {
    errors.push(
      `❌ Attribute schema is missing "attributes" field!\n` +
      `   Expected structure: { "attributes": { ... } }`
    );
  } else {
    // Check all themeable attributes have appliesTo
    Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
      const hasVariants = attr.variants && typeof attr.variants === 'object' && Object.keys(attr.variants).length > 0;

      if (attr.themeable) {
        // Attributes with outputsCSS: false can be themeable without CSS fields
        // They're stored in themes but don't generate CSS
        const outputsCSS = attr.outputsCSS !== false; // Default to true if not specified

        if (outputsCSS) {
          // Only CSS-generating attributes need these fields
          if (!attr.appliesTo) {
            errors.push(
              `❌ Attribute "${attrName}" is themeable but missing "appliesTo" field!\n` +
              `   All themeable CSS attributes must specify which element they apply to.\n` +
              `   Fix: Add "appliesTo": "elementId" to this attribute, OR add "outputsCSS": false if this attribute doesn't generate CSS.`
            );
          }

          // Check for deprecated cssSelector field
          if (attr.cssSelector) {
            warnings.push(
              `⚠️  Attribute "${attrName}" has deprecated "cssSelector" field: "${attr.cssSelector}"\n` +
              `   This field should be removed in favor of "appliesTo".\n` +
              `   Fix: Remove "cssSelector" and ensure "appliesTo" is set correctly.`
            );
          }

          // Validate cssVar and cssProperty exist
          if (!attr.cssVar) {
            errors.push(
              `❌ Themeable attribute "${attrName}" is missing "cssVar" field!\n` +
              `   Fix: Add "cssVar": "variable-name" to this attribute, OR add "outputsCSS": false if this attribute doesn't generate CSS.`
            );
          }

          const hasCssProperty = Boolean(attr.cssProperty);
          if (!hasCssProperty && !hasVariants) {
            errors.push(
              `❌ Themeable attribute "${attrName}" is missing "cssProperty" field!\n` +
              `   Fix: Add "cssProperty": "css-property" (or provide per-variant cssProperty overrides), OR add "outputsCSS": false if this attribute doesn't generate CSS.`
            );
          }
        }

        if (attr.dependsOn && attr.cssProperty) {
          errors.push(
            `❌ Attribute "${attrName}" has both "dependsOn" and top-level "cssProperty".\n` +
            `   Fix: Move cssProperty into each variant (and optional "_default") so conditionals are schema-driven.`
          );
        }
      }
    });

    // Validate conditional variants (dependsOn + variants coverage)
    Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
      if (!attr.dependsOn && !attr.variants) return;

      const variants = attr.variants && typeof attr.variants === 'object' ? attr.variants : null;
      const dependencyName = attr.dependsOn;

      if (dependencyName && !attributes.attributes[dependencyName]) {
        errors.push(
          `❌ Attribute "${attrName}" dependsOn "${dependencyName}" but that attribute is not defined in the schema.\n` +
          `   Fix: Add the dependency attribute or remove dependsOn.`
        );
        return;
      }

      if (dependencyName && !variants) {
        warnings.push(
          `⚠️  Attribute "${attrName}" declares dependsOn "${dependencyName}" but has no "variants" block.\n` +
          `   Add variants keyed by ${dependencyName} values (plus optional "_default").`
        );
        return;
      }

      if (!variants) return;

      // If dependency has options, ensure variants keys align
      const dependencyAttr = attributes.attributes[dependencyName] || {};
      const optionValues = (dependencyAttr.options || []).map((opt) =>
        typeof opt === 'object' ? opt.value ?? opt.label : opt
      );

      const variantKeys = Object.keys(variants);
      const nonDefaultVariantKeys = variantKeys.filter((key) => key !== '_default');

      // Each variant must declare cssProperty
      nonDefaultVariantKeys.forEach((key) => {
        if (!variants[key] || !variants[key].cssProperty) {
          errors.push(
            `❌ Variant "${key}" for attribute "${attrName}" is missing "cssProperty".\n` +
            `   Fix: Add "cssProperty" inside the variant.`
          );
        }
      });
      if (variants._default && !variants._default.cssProperty) {
        errors.push(
          `❌ Variant "_default" for attribute "${attrName}" is missing "cssProperty".\n` +
          `   Fix: Add "cssProperty" inside the default variant.`
        );
      }

      if (optionValues.length > 0) {
        const missing = optionValues.filter((opt) => !variantKeys.includes(opt));
        if (missing.length > 0 && !variants._default) {
          warnings.push(
            `⚠️  Attribute "${attrName}" dependsOn "${dependencyName}" but is missing variants for: ${missing.join(', ')}\n` +
            `   Add variants for these options or provide a "_default" variant.`
          );
        }

        const unexpected = nonDefaultVariantKeys.filter((key) => !optionValues.includes(key));
        if (unexpected.length > 0) {
          warnings.push(
            `⚠️  Attribute "${attrName}" has variants with keys not present in ${dependencyName} options: ${unexpected.join(', ')}\n` +
            `   Fix: Remove unexpected variants or add matching options to "${dependencyName}".`
          );
        }
      }
    });
  }

  // ========================================
  // VALIDATION 3: Cross-Schema References (Attributes → Structure)
  // ========================================

  // Helper to normalize appliesTo to array (also used in Validation 5)
  const normalizeAppliesTo = (appliesTo) => {
    if (!appliesTo) return [];
    return Array.isArray(appliesTo) ? appliesTo : [appliesTo];
  };

  if (attributes.attributes) {
    // Special/virtual selectors that don't need to exist in structure schema
    // These are composite CSS selectors that combine multiple elements
    const SPECIAL_SELECTORS = [
      'level1Link',      // .toc-level-1 .toc-link
      'level2Link',      // .toc-level-2 .toc-link
      'level3PlusLink',  // .toc-level-3+ .toc-link
      'titleStatic',     // .toc-title:not(.toc-toggle-button)
      'titleCollapsible',// .toc-toggle-button
      'nestedList',      // .toc-list ul
      'titleIconOnly',   // .toc-icon-only .toc-collapse-icon
    ];

    Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
      if (attr.appliesTo) {
        const appliesToElements = normalizeAppliesTo(attr.appliesTo);

        appliesToElements.forEach(elementId => {
          // Skip validation for special/virtual selectors
          if (SPECIAL_SELECTORS.includes(elementId)) {
            return;
          }

          if (!elements.has(elementId)) {
            const similarElements = findSimilarElementIds(elementId, elements);
            let suggestion = '';
            if (similarElements.length > 0) {
              suggestion = `\n   Did you mean: ${similarElements.join(', ')}?`;
            }

            errors.push(
              `❌ Attribute "${attrName}" applies to element "${elementId}" ` +
              `but that element doesn't exist in structure!\n` +
              `   Available elements: ${Array.from(elements.keys()).join(', ')}${suggestion}\n` +
              `   Fix: Change "appliesTo" to a valid element ID or add the element to structure.`
            );
          }
        });
      }
    });
  }

  // ========================================
  // VALIDATION 4: Cross-Schema References (Structure → Attributes)
  // ========================================

  const attributeNames = attributes.attributes ? Object.keys(attributes.attributes) : [];

  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.appliesStyles) {
      element.appliesStyles.forEach(attrName => {
        if (!attributeNames.includes(attrName)) {
          const similarAttrs = findSimilarAttributeNames(attrName, attributeNames);
          let suggestion = '';
          if (similarAttrs.length > 0) {
            suggestion = `\n   Did you mean: ${similarAttrs.join(', ')}?`;
          }

          errors.push(
            `❌ Element "${id}" applies attribute "${attrName}" ` +
            `but that attribute doesn't exist in attribute schema!${suggestion}\n` +
            `   Fix: Either add "${attrName}" to attributes or remove it from "${id}.appliesStyles"`
          );
        }
      });
    }
  });

  // ========================================
  // VALIDATION 5: Bidirectional Consistency
  // ========================================

  // normalizeAppliesTo is defined above in Validation 3

  // Special/virtual selectors (same list as in Validation 3)
  const SPECIAL_SELECTORS = [
    'level1Link', 'level2Link', 'level3PlusLink',
    'titleStatic', 'titleCollapsible', 'nestedList', 'titleIconOnly',
  ];

  if (attributes.attributes) {
    Object.entries(attributes.attributes).forEach(([attrName, attr]) => {
      if (attr.themeable && attr.appliesTo) {
        const appliesToElements = normalizeAppliesTo(attr.appliesTo);

        appliesToElements.forEach(elementId => {
          // Skip bidirectional check for special/virtual selectors
          if (SPECIAL_SELECTORS.includes(elementId)) {
            return;
          }

          const element = elements.get(elementId);

          if (element) {
            if (!element.appliesStyles || !element.appliesStyles.includes(attrName)) {
              warnings.push(
                `⚠️  Attribute "${attrName}" applies to element "${elementId}" ` +
                `but "${elementId}.appliesStyles" doesn't include "${attrName}"\n` +
                `   This may cause schema-based generators to miss the style.\n` +
                `   Fix: Add "${attrName}" to "${elementId}.appliesStyles", or change "${attrName}.appliesTo" to the correct element.`
              );
            }
          }
        });
      }
    });
  }

  // Also check the reverse: elements listing attributes that don't apply to them
  Object.entries(structure.elements).forEach(([id, element]) => {
    if (element.appliesStyles && attributes.attributes) {
      element.appliesStyles.forEach(attrName => {
        const attr = attributes.attributes[attrName];
        if (attr && attr.appliesTo) {
          const appliesToElements = normalizeAppliesTo(attr.appliesTo);
          if (!appliesToElements.includes(id)) {
            warnings.push(
              `⚠️  Element "${id}" lists "${attrName}" in appliesStyles ` +
              `but "${attrName}.appliesTo" is "${attr.appliesTo}", not "${id}"\n` +
              `   This creates inconsistent bidirectional references.\n` +
              `   Fix: Update "${attrName}.appliesTo" to include "${id}", or remove "${attrName}" from "${id}.appliesStyles".`
            );
          }
        }
      });
    }
  });

  // ========================================
  // VALIDATION 6: Structure ↔ Implementation (save.js/frontend)
  // ========================================

  const implResults = validateImplementationUsage(structure, blockType);
  errors.push(...implResults.errors);
  warnings.push(...implResults.warnings);

  // ========================================
  // REPORT RESULTS
  // ========================================
  return reportResults(blockType, errors, warnings);
}

/**
 * Find element IDs similar to the target (for suggestions)
 * @param {string} target - The target element ID
 * @param {Map} elements - Map of element IDs
 * @returns {string[]} Array of similar element IDs
 */
function findSimilarElementIds(target, elements) {
  const elementIds = Array.from(elements.keys());
  return elementIds.filter(id => {
    const distance = levenshteinDistance(target.toLowerCase(), id.toLowerCase());
    return distance <= 3; // Similar if edit distance is 3 or less
  }).slice(0, 3); // Return top 3 suggestions
}

/**
 * Find attribute names similar to the target (for suggestions)
 * @param {string} target - The target attribute name
 * @param {string[]} attributeNames - Array of attribute names
 * @returns {string[]} Array of similar attribute names
 */
function findSimilarAttributeNames(target, attributeNames) {
  return attributeNames.filter(name => {
    const distance = levenshteinDistance(target.toLowerCase(), name.toLowerCase());
    return distance <= 3; // Similar if edit distance is 3 or less
  }).slice(0, 3); // Return top 3 suggestions
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Report validation results
 * @param {string} blockType - The block type
 * @param {string[]} errors - Array of error messages
 * @param {string[]} warnings - Array of warning messages
 * @returns {boolean} True if validation passed (no errors)
 */
function reportResults(blockType, errors, warnings) {
  // Only output details if there are errors or warnings
  if (errors.length > 0) {
    console.log(`\n❌ ${blockType}: FAILED (${errors.length} error${errors.length > 1 ? 's' : ''})`);
    errors.forEach((err, index) => {
      console.error(`   ${index + 1}. ${err}\n`);
    });
    return false;
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ${blockType}: ${warnings.length} warning${warnings.length > 1 ? 's' : ''}`);
    // Only show first 3 warnings to avoid spam, mention total
    const showCount = Math.min(3, warnings.length);
    for (let i = 0; i < showCount; i++) {
      // Truncate long warnings
      const shortWarn = warnings[i].split('\n')[0];
      console.log(`   - ${shortWarn}`);
    }
    if (warnings.length > showCount) {
      console.log(`   ... and ${warnings.length - showCount} more`);
    }
  }

  return true;
}

/**
 * Print summary statistics
 * @param {Object} results - Validation results for all blocks
 */
function printSummary(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.blockType.padEnd(12)} - ${result.passed ? 'PASSED' : 'FAILED'}`);
  });

  console.log('\n' + '─'.repeat(60));
  console.log(`Total: ${results.length} blocks | Passed: ${passed} | Failed: ${failed}`);
  console.log('─'.repeat(60) + '\n');
}

// ========================================
// MAIN EXECUTION
// ========================================

console.log('\n📋 Cross-Schema Validation\n');

const results = [];
let allValid = true;

BLOCKS.forEach(blockType => {
  const valid = validateBlock(blockType);
  results.push({ blockType, passed: valid });
  if (!valid) {
    allValid = false;
  }
});

// Only print summary, not individual results (unless there are warnings/errors)
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

if (!allValid) {
  printSummary(results);
  console.error('❌ Schema validation FAILED!');
  process.exit(1);
} else {
  console.log(`✅ All ${passed} schemas validated successfully\n`);
  process.exit(0);
}
