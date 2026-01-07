/**
 * Editor CSS Vars for Table of Contents Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/toc.json
 * Generated at: 2026-01-06T21:39:00.687Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { formatCssValue, getCssVarName, decomposeObjectToSides, CSS_VAR_MAPPINGS } from '@shared/config/css-var-mappings-generated';

/**
 * Expand panel-type values into individual CSS variables
 * Handles color-panel, box-panel, typography-panel, border-panel
 */
function expandPanelType(cssVar, value, type, styles) {
  if (!value || typeof value !== 'object') return;

  // color-panel: { text, background, hover: { text, background } }
  if (type === 'color-panel') {
    if (value.text) styles[`${cssVar}-text`] = value.text;
    if (value.background) styles[`${cssVar}-bg`] = value.background;
    if (value.hover) {
      if (value.hover.text) styles[`${cssVar}-text-hover`] = value.hover.text;
      if (value.hover.background) styles[`${cssVar}-bg-hover`] = value.hover.background;
    }
    return;
  }

  // typography-panel: { fontFamily, fontSize, lineHeight }
  if (type === 'typography-panel') {
    if (value.fontFamily) styles[`${cssVar}-font-family`] = value.fontFamily;
    if (value.fontSize) styles[`${cssVar}-font-size`] = value.fontSize;
    if (value.lineHeight) styles[`${cssVar}-line-height`] = value.lineHeight;
    return;
  }

  // box-panel: { border, radius, shadow, padding, margin }
  if (type === 'box-panel') {
    // Padding
    if (value.padding) {
      const p = value.padding;
      const pUnit = p.unit || 'px';
      styles[`${cssVar}-padding`] = `${p.top || 0}${pUnit} ${p.right || 0}${pUnit} ${p.bottom || 0}${pUnit} ${p.left || 0}${pUnit}`;
    }
    // Margin
    if (value.margin) {
      const m = value.margin;
      const mUnit = m.unit || 'px';
      styles[`${cssVar}-margin`] = `${m.top || 0}${mUnit} ${m.right || 0}${mUnit} ${m.bottom || 0}${mUnit} ${m.left || 0}${mUnit}`;
    }
    // Border
    if (value.border) {
      const b = value.border;
      if (b.width) {
        const bwUnit = b.width.unit || 'px';
        styles[`${cssVar}-border-width`] = `${b.width.top || 0}${bwUnit} ${b.width.right || 0}${bwUnit} ${b.width.bottom || 0}${bwUnit} ${b.width.left || 0}${bwUnit}`;
      }
      if (b.color) {
        styles[`${cssVar}-border-color`] = `${b.color.top || 'transparent'} ${b.color.right || 'transparent'} ${b.color.bottom || 'transparent'} ${b.color.left || 'transparent'}`;
      }
      if (b.style) {
        styles[`${cssVar}-border-style`] = `${b.style.top || 'solid'} ${b.style.right || 'solid'} ${b.style.bottom || 'solid'} ${b.style.left || 'solid'}`;
      }
    }
    // Radius
    if (value.radius) {
      const r = value.radius;
      const rUnit = r.unit || 'px';
      styles[`${cssVar}-border-radius`] = `${r.topLeft || 0}${rUnit} ${r.topRight || 0}${rUnit} ${r.bottomRight || 0}${rUnit} ${r.bottomLeft || 0}${rUnit}`;
    }
    // Shadow
    if (value.shadow && Array.isArray(value.shadow)) {
      const shadowStr = value.shadow.map(s => {
        if (!s || !s.color) return null;
        const x = s.x?.value ?? 0;
        const y = s.y?.value ?? 0;
        const blur = s.blur?.value ?? 0;
        const spread = s.spread?.value ?? 0;
        const unit = s.x?.unit || 'px';
        const inset = s.inset ? 'inset ' : '';
        return `${inset}${x}${unit} ${y}${unit} ${blur}${unit} ${spread}${unit} ${s.color}`;
      }).filter(Boolean).join(', ') || 'none';
      styles[`${cssVar}-shadow`] = shadowStr;
    }
    return;
  }

  // border-panel: { width, color, style }
  if (type === 'border-panel') {
    if (value.width) {
      const w = value.width;
      const wUnit = w.unit || 'px';
      styles[`${cssVar}-width`] = `${w.top || 0}${wUnit}`;
    }
    if (value.color) {
      styles[`${cssVar}-color`] = value.color.top || 'transparent';
    }
    if (value.style) {
      styles[`${cssVar}-style`] = value.style.top || 'solid';
    }
    return;
  }
}

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
    const decomposed = decomposeObjectToSides(attrName, value, 'toc', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  Object.entries(effectiveValues).forEach(([attrName, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, 'toc');
    if (!cssVar) {
      return;
    }

    // Check if this is a panel-type attribute
    const mapping = CSS_VAR_MAPPINGS['toc']?.[attrName];
    const attrType = mapping?.type;
    if (attrType && ['color-panel', 'box-panel', 'typography-panel', 'border-panel'].includes(attrType)) {
      expandPanelType(cssVar, value, attrType, styles);
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
  });

  return styles;
}
