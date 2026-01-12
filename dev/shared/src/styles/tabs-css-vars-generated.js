/**
 * Editor CSS Vars for Tabs Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/tabs.json
 * Generated at: 2026-01-12T22:58:19.390Z
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

  const sides = ['top', 'right', 'bottom', 'left'];
  const corners = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
  const toKebab = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

  // color-panel: { text, background, hover: { text, background } }
  if (type === 'color-panel') {
    if (value.text) styles[`${cssVar}-color`] = value.text;
    if (value.background) styles[`${cssVar}-background`] = value.background;
    if (value.hover) {
      if (value.hover.text) styles[`${cssVar}-color-hover`] = value.hover.text;
      if (value.hover.background) styles[`${cssVar}-background-hover`] = value.hover.background;
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
      sides.forEach((side) => {
        if (p[side] !== undefined) {
          // Extract value from object if in unlinked mode: { value: 2 }
          const sideValue = typeof p[side] === 'object' ? p[side].value : p[side];
          styles[`${cssVar}-padding-${side}`] = `${sideValue || 0}${pUnit}`;
        }
      });
    }
    // Margin
    if (value.margin) {
      const m = value.margin;
      const mUnit = m.unit || 'px';
      sides.forEach((side) => {
        if (m[side] !== undefined) {
          // Extract value from object if in unlinked mode
          const sideValue = typeof m[side] === 'object' ? m[side].value : m[side];
          styles[`${cssVar}-margin-${side}`] = `${sideValue || 0}${mUnit}`;
        }
      });
    }
    // Border
    if (value.border) {
      const b = value.border;
      if (b.width) {
        const bwUnit = b.width.unit || 'px';
        sides.forEach((side) => {
          if (b.width[side] !== undefined) {
            // Extract value from object if in unlinked mode
            const sideValue = typeof b.width[side] === 'object' ? b.width[side].value : b.width[side];
            styles[`${cssVar}-border-${side}-width`] = `${sideValue || 0}${bwUnit}`;
          }
        });
      }
      if (b.color) {
        // Color can be a string (all sides same) or object (per-side)
        if (typeof b.color === 'string') {
          // String: apply to all sides
          sides.forEach((side) => {
            styles[`${cssVar}-border-${side}-color`] = b.color;
          });
        } else {
          // Object: extract per-side values
          sides.forEach((side) => {
            if (b.color[side] !== undefined) {
              const sideColor = typeof b.color[side] === 'object' ? b.color[side].value : b.color[side];
              styles[`${cssVar}-border-${side}-color`] = sideColor || 'transparent';
            }
          });
        }
      }
      if (b.style) {
        // Style can be a string (all sides same) or object (per-side)
        if (typeof b.style === 'string') {
          // String: apply to all sides
          sides.forEach((side) => {
            styles[`${cssVar}-border-${side}-style`] = b.style;
          });
        } else {
          // Object: extract per-side values
          sides.forEach((side) => {
            if (b.style[side] !== undefined) {
              const sideStyle = typeof b.style[side] === 'object' ? b.style[side].value : b.style[side];
              styles[`${cssVar}-border-${side}-style`] = sideStyle || 'solid';
            }
          });
        }
      }
    }
    // Radius
    if (value.radius) {
      const r = value.radius;
      const rUnit = r.unit || 'px';
      corners.forEach((corner) => {
        if (r[corner] !== undefined) {
          // Extract value from object if in unlinked mode
          const cornerValue = typeof r[corner] === 'object' ? r[corner].value : r[corner];
          styles[`${cssVar}-border-${toKebab(corner)}-radius`] = `${cornerValue || 0}${rUnit}`;
        }
      });
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
      styles[`${cssVar}-box-shadow`] = shadowStr;
    }
    return;
  }

  // border-panel: { width, color, style }
  if (type === 'border-panel') {
    if (value.width) {
      const w = value.width;
      const wUnit = w.unit || 'px';
      sides.forEach((side) => {
        if (w[side] !== undefined) {
          // Extract value from object if in unlinked mode: { value: 2 }
          const sideValue = typeof w[side] === 'object' ? w[side].value : w[side];
          styles[`${cssVar}-border-${side}-width`] = `${sideValue || 0}${wUnit}`;
        }
      });
    }
    if (value.color) {
      // Color can be a string (all sides same) or object (per-side)
      if (typeof value.color === 'string') {
        // String: apply to all sides
        sides.forEach((side) => {
          styles[`${cssVar}-border-${side}-color`] = value.color;
        });
      } else {
        // Object: extract per-side values
        sides.forEach((side) => {
          if (value.color[side] !== undefined) {
            const sideColor = typeof value.color[side] === 'object' ? value.color[side].value : value.color[side];
            styles[`${cssVar}-border-${side}-color`] = sideColor || 'transparent';
          }
        });
      }
    }
    if (value.style) {
      // Style can be a string (all sides same) or object (per-side)
      if (typeof value.style === 'string') {
        // String: apply to all sides
        sides.forEach((side) => {
          styles[`${cssVar}-border-${side}-style`] = value.style;
        });
      } else {
        // Object: extract per-side values
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
    const decomposed = decomposeObjectToSides(attrName, value, 'tabs', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  Object.entries(effectiveValues).forEach(([attrName, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, 'tabs');
    if (!cssVar) {
      return;
    }

    // Check if this is a panel-type attribute
    const mapping = CSS_VAR_MAPPINGS['tabs']?.[attrName];
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
        const formattedBase = formatCssValue(attrName, baseValue, 'tabs');
        if (formattedBase !== null && formattedBase !== 'undefined' &&
            !(typeof formattedBase === 'string' && formattedBase.startsWith('undefined'))) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, 'tabs');
        if (formattedTablet !== null && formattedTablet !== 'undefined' &&
            !(typeof formattedTablet === 'string' && formattedTablet.startsWith('undefined'))) {
          styles[`${cssVar}-tablet`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, 'tabs');
        if (formattedMobile !== null && formattedMobile !== 'undefined' &&
            !(typeof formattedMobile === 'string' && formattedMobile.startsWith('undefined'))) {
          styles[`${cssVar}-mobile`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, 'tabs');
    if (formattedValue !== null && formattedValue !== 'undefined' &&
        !(typeof formattedValue === 'string' && formattedValue.startsWith('undefined'))) {
      styles[cssVar] = formattedValue;
    }
    applyDecomposed(attrName, value, '');
  });

  return styles;
}
