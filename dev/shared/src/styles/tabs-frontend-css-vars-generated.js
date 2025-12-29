/**
 * Frontend CSS Vars for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2025-12-29T15:44:13.311Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { formatCssValue, getCssVarName, decomposeObjectToSides } from '@shared/config/css-var-mappings-generated';

const THEMEABLE_ATTRS = new Set(["borderColor","borderWidth","borderStyle","borderRadius","shadow","shadowHover","tabButtonColor","tabButtonBackgroundColor","tabButtonHoverColor","tabButtonHoverBackgroundColor","tabButtonActiveColor","tabButtonActiveBackgroundColor","tabButtonFontSize","tabButtonFontWeight","tabButtonFontStyle","tabButtonTextTransform","tabButtonTextDecoration","tabButtonTextAlign","tabButtonPadding","tabButtonActiveFontWeight","tabButtonBorderColor","tabButtonActiveBorderColor","tabButtonBorderWidth","tabButtonBorderStyle","tabButtonBorderRadius","tabButtonShadow","tabButtonShadowHover","tabButtonActiveContentBorderColor","tabButtonActiveContentBorderWidth","tabButtonActiveContentBorderStyle","tabListBackgroundColor","tabsRowBorderColor","tabsRowBorderWidth","tabsRowBorderStyle","tabsRowSpacing","tabsButtonGap","tabListAlignment","tabsListContentBorderColor","tabsListContentBorderWidth","tabsListContentBorderStyle","panelBackgroundColor","panelBorderColor","panelBorderWidth","panelBorderStyle","panelBorderRadius","iconColor","iconSize","iconRotation","iconRotationActive"]);
const NON_THEMEABLE_ATTRS = new Set(["tabsWidth"]);

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
    const decomposed = decomposeObjectToSides(attrName, value, 'tabs', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  const applyValue = (attrName, value) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, 'tabs');
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
        const formattedBase = formatCssValue(attrName, baseValue, 'tabs');
        if (formattedBase !== null) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, 'tabs');
        if (formattedTablet !== null) {
          styles[`${cssVar}-tablet`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, 'tabs');
        if (formattedMobile !== null) {
          styles[`${cssVar}-mobile`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, 'tabs');
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
