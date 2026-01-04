const { expandBorderPanelMacro } = require('./border-expansor');
const { buildKebabName, camelToKebab } = require('./naming-utils');

const BOX_FIELDS = ['border', 'padding', 'margin', 'radius', 'shadow'];
const SIDES = ['top', 'right', 'bottom', 'left'];
const CORNERS = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];

function capitalize(value) {
  if (!value) {
    return '';
  }
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

// Use centralized camelToKebab from naming-utils
function kebabFromCamel(value) {
  return camelToKebab(value);
}

function normalizeFields(fields) {
  if (!Array.isArray(fields) || fields.length === 0) {
    return [...BOX_FIELDS];
  }

  const normalized = [];
  fields.forEach((field) => {
    const name = String(field).toLowerCase();
    if (!BOX_FIELDS.includes(name)) {
      throw new Error(`Unknown box field: ${field}`);
    }
    if (!normalized.includes(name)) {
      normalized.push(name);
    }
  });

  return normalized;
}

function coerceUnitValue(value, unit) {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof value === 'number') {
    return `${value}${unit || ''}`;
  }
  return String(value);
}

function normalizeSideUnitValues(raw, fallback, defaultUnit) {
  const values = {};
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const unit = raw.unit || defaultUnit;
    SIDES.forEach((side) => {
      const rawValue = raw[side] !== undefined ? raw[side] : raw.value;
      const value = rawValue !== undefined ? rawValue : fallback;
      values[side] = coerceUnitValue(value, unit);
    });
    return values;
  }

  const fallbackValue = raw !== undefined ? raw : fallback;
  const normalized = coerceUnitValue(fallbackValue, defaultUnit);
  SIDES.forEach((side) => {
    values[side] = normalized;
  });

  return values;
}

function normalizeCornerUnitValues(raw, fallback, defaultUnit) {
  const values = {};
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const unit = raw.unit || defaultUnit;
    CORNERS.forEach((corner) => {
      const rawValue = raw[corner] !== undefined ? raw[corner] : raw.value;
      const value = rawValue !== undefined ? rawValue : fallback;
      values[corner] = coerceUnitValue(value, unit);
    });
    return values;
  }

  const fallbackValue = raw !== undefined ? raw : fallback;
  const normalized = coerceUnitValue(fallbackValue, defaultUnit);
  CORNERS.forEach((corner) => {
    values[corner] = normalized;
  });

  return values;
}

/**
 * Expand box-panel macro into atomic border/padding/margin/radius/shadow attributes.
 *
 * @param {string} macroName - Macro attribute name (e.g., 'headerBox').
 * @param {object} macro - Macro definition from schema.
 * @param {string} blockType - Block type (accordion, tabs, toc).
 * @returns {object} Expanded attributes object.
 */
function expandBoxPanelMacro(macroName, macro, blockType) {
  const expanded = {};
  const baseName = macroName || 'box';
  const element = macro.element || macro.appliesToElement || macro.appliesTo || 'item';
  const themeable = macro.themeable !== undefined ? macro.themeable : true;
  const fields = normalizeFields(macro.fields);
  const defaults = macro.default || {};
  const borderSubgroup = macro.borderSubgroup || macro.subgroup;
  const layoutSubgroup = macro.layoutSubgroup;

  if (fields.includes('border')) {
    const hasBorderDefaults =
      defaults.width !== undefined ||
      defaults.color !== undefined ||
      defaults.style !== undefined;
    const borderDefaults = defaults.border || (hasBorderDefaults ? defaults : {});

    Object.assign(
      expanded,
      expandBorderPanelMacro(
        baseName,
        {
          appliesTo: element,
          themeable,
          subgroup: borderSubgroup,
          default: borderDefaults,
          fields: macro.borderSides || macro.sides,
        },
        blockType
      )
    );
  }

  if (fields.includes('padding')) {
    const paddingDefaults = normalizeSideUnitValues(defaults.padding, '0px', 'px');
    SIDES.forEach((side) => {
      const sideLabel = capitalize(side);
      const entry = {
        type: 'string',
        default: paddingDefaults[side],
        label: `Padding (${sideLabel})`,
        description: `Padding on the ${side} side`,
        group: 'layout',
        control: 'SliderWithInput',
        element: element,
        cssProperty: `padding-${side}`,
        themeable,
        outputsCSS: true,
        responsive: true,
      };

      if (layoutSubgroup) {
        entry.subgroup = layoutSubgroup;
      }

      // Build kebab-case attribute name
      const attrName = buildKebabName(baseName, `Padding${sideLabel}`);
      expanded[attrName] = entry;
    });
  }

  if (fields.includes('margin')) {
    const marginDefaults = normalizeSideUnitValues(defaults.margin, '0px', 'px');
    SIDES.forEach((side) => {
      const sideLabel = capitalize(side);
      const entry = {
        type: 'string',
        default: marginDefaults[side],
        label: `Margin (${sideLabel})`,
        description: `Margin on the ${side} side`,
        group: 'layout',
        control: 'SliderWithInput',
        element: element,
        cssProperty: `margin-${side}`,
        themeable,
        outputsCSS: true,
        responsive: true,
      };

      if (layoutSubgroup) {
        entry.subgroup = layoutSubgroup;
      }

      // Build kebab-case attribute name
      const attrName = buildKebabName(baseName, `Margin${sideLabel}`);
      expanded[attrName] = entry;
    });
  }

  if (fields.includes('radius')) {
    const radiusDefaults = normalizeCornerUnitValues(
      defaults.radius || defaults.borderRadius,
      '0px',
      'px'
    );
    CORNERS.forEach((corner) => {
      const cornerLabel = corner.replace(/([A-Z])/g, ' $1').trim();
      const cornerKebab = kebabFromCamel(corner);
      const entry = {
        type: 'string',
        default: radiusDefaults[corner],
        label: `Border Radius (${cornerLabel})`,
        description: `Border radius on the ${cornerLabel.toLowerCase()} corner`,
        group: 'borders',
        control: 'SliderWithInput',
        element: element,
        cssProperty: `border-${cornerKebab}-radius`,
        themeable,
        outputsCSS: true,
      };

      if (borderSubgroup) {
        entry.subgroup = borderSubgroup;
      }

      // Build kebab-case attribute name
      const attrName = buildKebabName(baseName, `BorderRadius${capitalize(corner)}`);
      expanded[attrName] = entry;
    });
  }

  if (fields.includes('shadow')) {
    const shadowDefault = defaults.shadow !== undefined ? defaults.shadow : [];
    const shadowEntry = {
      type: Array.isArray(shadowDefault) ? 'array' : 'string',
      default: shadowDefault,
      label: 'Box Shadow',
      description: 'Box shadow settings',
      group: 'borders',
      control: Array.isArray(shadowDefault) ? 'ShadowPanel' : 'TextControl',
      element: element,
      cssProperty: 'box-shadow',
      themeable,
      outputsCSS: true,
    };

    if (borderSubgroup) {
      shadowEntry.subgroup = borderSubgroup;
    }

    // Build kebab-case attribute name
    const shadowAttrName = buildKebabName(baseName, 'Shadow');
    expanded[shadowAttrName] = shadowEntry;
  }

  return expanded;
}

module.exports = {
  expandBoxPanelMacro,
};
