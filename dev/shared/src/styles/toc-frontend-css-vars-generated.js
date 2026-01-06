/**
 * Frontend CSS Vars for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2026-01-06T05:55:42.808Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { formatCssValue, getCssVarName, decomposeObjectToSides } from '@shared/config/css-var-mappings-generated';

const THEMEABLE_ATTRS = new Set(["wrapperBackgroundColor","blockBorderColor","h1FontSize","h1FontWeight","h1FontStyle","h1TextTransform","h1TextDecoration","h2FontSize","h2FontWeight","h2FontStyle","h2TextTransform","h2TextDecoration","h3FontSize","h3FontWeight","h3FontStyle","h3TextTransform","h3TextDecoration","h4FontSize","h4FontWeight","h4FontStyle","h4TextTransform","h4TextDecoration","h5FontSize","h5FontWeight","h5FontStyle","h5TextTransform","h5TextDecoration","h6FontSize","h6FontWeight","h6FontStyle","h6TextTransform","h6TextDecoration","showIcon","iconRotation","iconInactiveColor","iconInactiveRotation","iconInactiveSize","iconInactiveMaxSize","iconInactiveOffsetX","iconInactiveOffsetY","iconActiveColor","iconActiveRotation","iconActiveSize","iconActiveMaxSize","iconActiveOffsetX","iconActiveOffsetY","titleFontSize","titleFontWeight","titleFontStyle","titleTextTransform","titleTextDecoration","titleAlignment","blockBorderWidth","blockBorderStyle","blockBorderRadius","blockShadow","blockShadowHover","wrapperPadding","itemSpacing","levelIndent","positionTop","zIndex"]);
const NON_THEMEABLE_ATTRS = new Set(["tocWidth","titleColor","linkColor","h1Color","h2Color","h3Color","h4Color","h5Color","h6Color"]);

/**
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
    const decomposed = decomposeObjectToSides(attrName, value, 'toc', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  const applyValue = (attrName, value) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, 'toc');
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
        const formattedBase = formatCssValue(attrName, baseValue, 'toc');
        if (formattedBase !== null && formattedBase !== 'undefined' &&
            !(typeof formattedBase === 'string' && formattedBase.startsWith('undefined'))) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, 'toc');
        if (formattedTablet !== null && formattedTablet !== 'undefined' &&
            !(typeof formattedTablet === 'string' && formattedTablet.startsWith('undefined'))) {
          styles[`${cssVar}-tablet`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, 'toc');
        if (formattedMobile !== null && formattedMobile !== 'undefined' &&
            !(typeof formattedMobile === 'string' && formattedMobile.startsWith('undefined'))) {
          styles[`${cssVar}-mobile`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, 'toc');
    if (formattedValue !== null && formattedValue !== 'undefined' &&
        !(typeof formattedValue === 'string' && formattedValue.startsWith('undefined'))) {
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
