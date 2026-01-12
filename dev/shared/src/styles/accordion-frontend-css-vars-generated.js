/**
 * Frontend CSS Vars for Accordion Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json
 * Generated at: 2026-01-12T22:58:19.362Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

import { formatCssValue, getCssVarName, decomposeObjectToSides, CSS_VAR_MAPPINGS } from '@shared/config/css-var-mappings-generated';

const THEMEABLE_ATTRS = new Set(["showIcon","iconRotation","iconInactiveColor","iconInactiveRotation","iconInactiveSize","iconInactiveMaxSize","iconInactiveOffsetX","iconInactiveOffsetY","iconActiveColor","iconActiveRotation","iconActiveSize","iconActiveMaxSize","iconActiveOffsetX","iconActiveOffsetY","animationDuration"]);
const NON_THEMEABLE_ATTRS = new Set(["dividerBorder","blockBox","headerBox","contentBox","titleColor","contentColor","contentTypography","titleTypography","accordionWidth"]);

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

  const expandPanelType = (cssVar, value, type) => {
    if (!value || typeof value !== 'object') return;

    const sides = ['top', 'right', 'bottom', 'left'];
    const corners = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
    const toKebab = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

    if (type === 'color-panel') {
      if (value.text) styles[`${cssVar}-color`] = value.text;
      if (value.background) styles[`${cssVar}-background`] = value.background;
      if (value.hover) {
        if (value.hover.text) styles[`${cssVar}-color-hover`] = value.hover.text;
        if (value.hover.background) styles[`${cssVar}-background-hover`] = value.hover.background;
      }
      return;
    }

    if (type === 'typography-panel') {
      if (value.fontFamily) styles[`${cssVar}-font-family`] = value.fontFamily;
      if (value.fontSize) styles[`${cssVar}-font-size`] = value.fontSize;
      if (value.lineHeight) styles[`${cssVar}-line-height`] = value.lineHeight;
      return;
    }

    if (type === 'box-panel') {
      if (value.padding) {
        const p = value.padding;
        const pUnit = p.unit || 'px';
        sides.forEach((side) => {
          if (p[side] !== undefined) {
            const sideValue = typeof p[side] === 'object' ? p[side].value : p[side];
            styles[`${cssVar}-padding-${side}`] = `${sideValue || 0}${pUnit}`;
          }
        });
      }
      if (value.margin) {
        const m = value.margin;
        const mUnit = m.unit || 'px';
        sides.forEach((side) => {
          if (m[side] !== undefined) {
            const sideValue = typeof m[side] === 'object' ? m[side].value : m[side];
            styles[`${cssVar}-margin-${side}`] = `${sideValue || 0}${mUnit}`;
          }
        });
      }
      if (value.border) {
        const b = value.border;
        if (b.width) {
          const bwUnit = b.width.unit || 'px';
          sides.forEach((side) => {
            if (b.width[side] !== undefined) {
              const sideValue = typeof b.width[side] === 'object' ? b.width[side].value : b.width[side];
              styles[`${cssVar}-border-${side}-width`] = `${sideValue || 0}${bwUnit}`;
            }
          });
        }
        if (b.color) {
          if (typeof b.color === 'string') {
            sides.forEach((side) => {
              styles[`${cssVar}-border-${side}-color`] = b.color;
            });
          } else {
            sides.forEach((side) => {
              if (b.color[side] !== undefined) {
                const sideColor = typeof b.color[side] === 'object' ? b.color[side].value : b.color[side];
                styles[`${cssVar}-border-${side}-color`] = sideColor || 'transparent';
              }
            });
          }
        }
        if (b.style) {
          if (typeof b.style === 'string') {
            sides.forEach((side) => {
              styles[`${cssVar}-border-${side}-style`] = b.style;
            });
          } else {
            sides.forEach((side) => {
              if (b.style[side] !== undefined) {
                const sideStyle = typeof b.style[side] === 'object' ? b.style[side].value : b.style[side];
                styles[`${cssVar}-border-${side}-style`] = sideStyle || 'solid';
              }
            });
          }
        }
      }
      if (value.radius) {
        const r = value.radius;
        const rUnit = r.unit || 'px';
        corners.forEach((corner) => {
          if (r[corner] !== undefined) {
            const cornerValue = typeof r[corner] === 'object' ? r[corner].value : r[corner];
            styles[`${cssVar}-border-${toKebab(corner)}-radius`] = `${cornerValue || 0}${rUnit}`;
          }
        });
      }
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
        styles[`${cssVar}-box-shadow`] = shadowStr;
      }
      return;
    }

    if (type === 'border-panel') {
      if (value.width) {
        const w = value.width;
        const wUnit = w.unit || 'px';
        sides.forEach((side) => {
          if (w[side] !== undefined) {
            const sideValue = typeof w[side] === 'object' ? w[side].value : w[side];
            styles[`${cssVar}-border-${side}-width`] = `${sideValue || 0}${wUnit}`;
          }
        });
      }
      if (value.color) {
        if (typeof value.color === 'string') {
          sides.forEach((side) => {
            styles[`${cssVar}-border-${side}-color`] = value.color;
          });
        } else {
          sides.forEach((side) => {
            if (value.color[side] !== undefined) {
              const sideColor = typeof value.color[side] === 'object' ? value.color[side].value : value.color[side];
              styles[`${cssVar}-border-${side}-color`] = sideColor || 'transparent';
            }
          });
        }
      }
      if (value.style) {
        if (typeof value.style === 'string') {
          sides.forEach((side) => {
            styles[`${cssVar}-border-${side}-style`] = value.style;
          });
        } else {
          sides.forEach((side) => {
            if (value.style[side] !== undefined) {
              const sideStyle = typeof value.style[side] === 'object' ? value.style[side].value : value.style[side];
              styles[`${cssVar}-border-${side}-style`] = sideStyle || 'solid';
            }
          });
        }
      }
      return;
    }
  };

  const applyDecomposed = (attrName, value, suffix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return;
    }
    const decomposed = decomposeObjectToSides(attrName, value, 'accordion', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  const applyValue = (attrName, value) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, 'accordion');
    if (!cssVar) {
      return;
    }

    const mapping = CSS_VAR_MAPPINGS['accordion']?.[attrName];
    const attrType = mapping?.type;
    if (attrType && ['color-panel', 'box-panel', 'typography-panel', 'border-panel'].includes(attrType)) {
      expandPanelType(cssVar, value, attrType);
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
        const formattedBase = formatCssValue(attrName, baseValue, 'accordion');
        if (formattedBase !== null && formattedBase !== 'undefined' &&
            !(typeof formattedBase === 'string' && formattedBase.startsWith('undefined'))) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, 'accordion');
        if (formattedTablet !== null && formattedTablet !== 'undefined' &&
            !(typeof formattedTablet === 'string' && formattedTablet.startsWith('undefined'))) {
          styles[`${cssVar}-tablet`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, 'accordion');
        if (formattedMobile !== null && formattedMobile !== 'undefined' &&
            !(typeof formattedMobile === 'string' && formattedMobile.startsWith('undefined'))) {
          styles[`${cssVar}-mobile`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, 'accordion');
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
