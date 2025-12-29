/**
 * Frontend CSS Vars Generator
 *
 * Auto-generates buildFrontendCssVars() helpers per block.
 * These helpers output base + responsive CSS variables for frontend save output.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Get auto-generated file header
 */
function getGeneratedHeader(schemaFile, blockName) {
  return `/**
 * Frontend CSS Vars for ${blockName} Block
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
 * Generate buildFrontendCssVars helper for a block
 *
 * @param {string} blockType - Block type identifier (accordion, tabs, toc)
 * @param {Object} schema - Block schema
 * @returns {{ fileName: string, content: string }}
 */
function generateFrontendCssVarsBuilder(blockType, schema) {
  const fileName = `${blockType}-frontend-css-vars-generated.js`;
  const blockName = schema.blockName || blockType;

  const themeableAttrs = [];
  const nonThemeableAttrs = [];

  Object.entries(schema.attributes).forEach(([attrName, attr]) => {
    if (attr.outputsCSS === false || !attr.cssVar) {
      return;
    }

    if (attr.themeable) {
      themeableAttrs.push(attrName);
      return;
    }

    nonThemeableAttrs.push(attrName);
  });

  let content = getGeneratedHeader(`${blockType}.json`, blockName);

  content += `import { formatCssValue, getCssVarName, decomposeObjectToSides } from '@shared/config/css-var-mappings-generated';\n\n`;
  content += `const THEMEABLE_ATTRS = new Set(${JSON.stringify(themeableAttrs)});\n`;
  content += `const NON_THEMEABLE_ATTRS = new Set(${JSON.stringify(nonThemeableAttrs)});\n\n`;
  content += `/**
 * Build inline CSS variables for frontend save output.
 * Themeable attrs use customizations (deltas only).
 * Non-themeable attrs use per-block attribute values.
 * Emits base + device-specific overrides for responsive attributes.
 *
 * @param {Object} customizations - Themeable deltas (Tier 3)
 * @param {Object} attributes - Block attributes (includes non-themeable values)
 * @returns {Object} CSS variable map for inline styles
 */
export function buildFrontendCssVars(customizations, attributes) {
  const styles = {};

  const applyDecomposed = (attrName, value, suffix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return;
    }
    const decomposed = decomposeObjectToSides(attrName, value, '${blockType}', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  const applyValue = (attrName, value) => {
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
      let baseValue = value.value !== undefined ? value.value : value;
      if (typeof baseValue === 'number' && value.unit !== undefined) {
        baseValue = { value: baseValue, unit: value.unit };
      }
      if (baseValue !== null && baseValue !== undefined) {
        const formattedBase = formatCssValue(attrName, baseValue, '${blockType}');
        if (formattedBase !== null) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, '${blockType}');
        if (formattedTablet !== null) {
          styles[\`\${cssVar}-tablet\`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, '${blockType}');
        if (formattedMobile !== null) {
          styles[\`\${cssVar}-mobile\`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, '${blockType}');
    if (formattedValue !== null) {
      styles[cssVar] = formattedValue;
    }
    applyDecomposed(attrName, value, '');
  };

  if (customizations && typeof customizations === 'object') {
    Object.entries(customizations).forEach(([attrName, value]) => {
      if (!THEMEABLE_ATTRS.has(attrName)) {
        return;
      }
      applyValue(attrName, value);
    });
  }

  if (attributes && typeof attributes === 'object') {
    NON_THEMEABLE_ATTRS.forEach((attrName) => {
      applyValue(attrName, attributes[attrName]);
    });
  }

  return styles;
}
`;

  return { fileName, content };
}

module.exports = {
  generateFrontendCssVarsBuilder,
};
