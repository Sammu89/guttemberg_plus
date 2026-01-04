/**
 * Editor CSS Vars Generator
 *
 * Auto-generates buildEditorCssVars() helpers per block.
 * These helpers output base + responsive CSS variables for editor preview.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Get auto-generated file header
 */
function getGeneratedHeader(schemaFile, blockName) {
  return `/**
 * Editor CSS Vars for ${blockName} Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${schemaFile}
 * Generated at: ${new Date().toISOString()}
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
 * Generate buildEditorCssVars helper for a block
 *
 * @param {string} blockType - Block type identifier (accordion, tabs, toc)
 * @param {Object} schema - Block schema
 * @returns {{ fileName: string, content: string }}
 */
function generateEditorCssVarsBuilder(blockType, schema) {
  const fileName = `${blockType}-css-vars-generated.js`;
  const blockName = schema.blockName || blockType;

  let content = getGeneratedHeader(`${blockType}.json`, blockName);

  content += `import { formatCssValue, getCssVarName, decomposeObjectToSides } from '@shared/config/css-var-mappings-generated';\n\n`;
  content += `/**
 * Build inline CSS variables for editor preview
 * Emits base + device-specific overrides for responsive attributes.
 *
 * @param {Object} effectiveValues - Effective values (defaults + theme + customizations)
 * @returns {Object} CSS variable map for inline styles
 */
export function buildEditorCssVars(effectiveValues) {
  const styles = {};

  if (!effectiveValues || typeof effectiveValues !== 'object') {
    return styles;
  }

  const applyDecomposed = (attrName, value, suffix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return;
    }
    const decomposed = decomposeObjectToSides(attrName, value, '${blockType}', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  Object.entries(effectiveValues).forEach(([attrName, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, '${blockType}');
    if (!cssVar) {
      return;
    }

    const isResponsiveValue = value && typeof value === 'object' &&
      (value.tablet !== undefined || value.mobile !== undefined);

    if (isResponsiveValue) {
      // Extract base value - skip if only device overrides exist
      let baseValue = value.value !== undefined ? value.value : value;
      if (typeof baseValue === 'number' && value.unit !== undefined) {
        baseValue = { value: baseValue, unit: value.unit };
      }
      // Only output base if it's not a responsive container object
      const isResponsiveContainer = baseValue && typeof baseValue === 'object' &&
        (baseValue.tablet !== undefined || baseValue.mobile !== undefined);
      if (!isResponsiveContainer && baseValue !== null && baseValue !== undefined) {
        const formattedBase = formatCssValue(attrName, baseValue, '${blockType}');
        if (formattedBase !== null && formattedBase !== 'undefined' &&
            !(typeof formattedBase === 'string' && formattedBase.startsWith('undefined'))) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, '${blockType}');
        if (formattedTablet !== null && formattedTablet !== 'undefined' &&
            !(typeof formattedTablet === 'string' && formattedTablet.startsWith('undefined'))) {
          styles[\`\${cssVar}-tablet\`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, '${blockType}');
        if (formattedMobile !== null && formattedMobile !== 'undefined' &&
            !(typeof formattedMobile === 'string' && formattedMobile.startsWith('undefined'))) {
          styles[\`\${cssVar}-mobile\`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, '${blockType}');
    if (formattedValue !== null && formattedValue !== 'undefined' &&
        !(typeof formattedValue === 'string' && formattedValue.startsWith('undefined'))) {
      styles[cssVar] = formattedValue;
    }
    applyDecomposed(attrName, value, '');
  });

  return styles;
}
`;

  return { fileName, content };
}

module.exports = {
  generateEditorCssVarsBuilder,
};
