/**
 * Editor CSS Vars for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-02T19:57:50.413Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { formatCssValue, getCssVarName, decomposeObjectToSides } from '@shared/config/css-var-mappings-generated';

/**
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
    const decomposed = decomposeObjectToSides(attrName, value, 'accordion', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  Object.entries(effectiveValues).forEach(([attrName, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, 'accordion');
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
        const formattedBase = formatCssValue(attrName, baseValue, 'accordion');
        if (formattedBase !== null) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, 'accordion');
        if (formattedTablet !== null) {
          styles[`${cssVar}-tablet`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, 'accordion');
        if (formattedMobile !== null) {
          styles[`${cssVar}-mobile`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, 'accordion');
    if (formattedValue !== null) {
      styles[cssVar] = formattedValue;
    }
    applyDecomposed(attrName, value, '');
  });

  return styles;
}
