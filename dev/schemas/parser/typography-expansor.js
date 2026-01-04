const { buildKebabName } = require('./naming-utils');

const DEFAULT_FIELDS = [
  'fontFamily',
  'fontSize',
  'lineHeight',
];

const FIELD_DEFS = {
  fontFamily: {
    suffix: 'FontFamily',
    type: 'string',
    control: 'FontFamilyControl',
    cssVarSuffix: 'font-family',
    cssProperty: 'font-family',
    default: 'inherit',
    label: 'Font Family',
  },
  fontSize: {
    suffix: 'FontSize',
    type: 'string',
    control: 'SliderWithInput',
    cssVarSuffix: 'font-size',
    cssProperty: 'font-size',
    default: '1rem',
    label: 'Font Size',
    responsive: true,
  },
  lineHeight: {
    suffix: 'LineHeight',
    type: 'number',
    control: 'SliderWithInput',
    cssVarSuffix: 'line-height',
    cssProperty: 'line-height',
    default: 1.4,
    label: 'Line Height',
  },
  formatting: {
    suffix: 'Formatting',
    type: 'array',
    control: 'FormattingControl',
    default: [],
    label: 'Text formatting',
    description:
      'Bold, italic, underline, overline, line-through)',
    outputsCSS: false,
  },
  noLineBreak: {
    suffix: 'NoLineBreak',
    type: 'string',
    control: 'FormattingControl',
    cssVarSuffix: 'white-space',
    cssProperty: 'white-space',
    default: 'normal',
    label: 'Text in single line',
  },
  fontWeight: {
    suffix: 'FontWeight',
    type: 'number',
    control: 'FormattingControl',
    cssVarSuffix: 'font-weight',
    cssProperty: 'font-weight',
    default: 400,
    label: 'Font Weight',
    min: 100,
    max: 900,
    step: 100,
    usesFormattingControl: true,
  },
  decorationColor: {
    suffix: 'DecorationColor',
    type: 'string',
    control: 'FormattingControl',
    cssVarSuffix: 'decoration-color',
    cssProperty: 'text-decoration-color',
    default: 'currentColor',
    label: 'Decoration Color',
    description: 'Color for text decorations',
  },
  decorationStyle: {
    suffix: 'DecorationStyle',
    type: 'string',
    control: 'FormattingControl',
    cssVarSuffix: 'decoration-style',
    cssProperty: 'text-decoration-style',
    default: 'solid',
    label: 'Decoration Style',
    description: 'Style for text decorations',
    options: [
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' },
      { value: 'wavy', label: 'Wavy' },
      { value: 'double', label: 'Double' },
    ],
  },
  decorationWidth: {
    suffix: 'DecorationWidth',
    type: 'string',
    control: 'FormattingControl',
    cssVarSuffix: 'decoration-width',
    cssProperty: 'text-decoration-thickness',
    default: 'auto',
    label: 'Decoration Width',
    description: 'Thickness of text decorations',
  },
  letterSpacing: {
    suffix: 'LetterSpacing',
    type: 'string',
    control: 'SliderWithInput',
    cssVarSuffix: 'letter-spacing',
    cssProperty: 'letter-spacing',
    default: '0em',
    label: 'Letter Spacing',
    description: 'Space between letters',
  },
  textTransform: {
    suffix: 'TextTransform',
    type: 'string',
    control: 'LetterCaseControl',
    cssVarSuffix: 'text-transform',
    cssProperty: 'text-transform',
    default: 'none',
    label: 'Letter Case',
    description: 'Text transformation',
  },
  alignment: {
    suffix: 'Alignment',
    type: 'string',
    control: 'AlignmentControl',
    cssVarSuffix: 'alignment',
    cssProperty: 'text-align',
    default: 'left',
    label: 'Text Alignment',
    description: 'Text alignment',
    alignmentType: 'text',
  },
  offsetX: {
    suffix: 'OffsetX',
    type: 'string',
    control: 'SliderWithInput',
    cssVarSuffix: 'offset-x',
    cssProperty: 'left',
    default: '0px',
    label: 'Horizontal Offset (X)',
    description: 'Move text left/right (negative = left, positive = right)',
    responsive: true,
  },
  offsetY: {
    suffix: 'OffsetY',
    type: 'string',
    control: 'SliderWithInput',
    cssVarSuffix: 'offset-y',
    cssProperty: 'top',
    default: '0px',
    label: 'Vertical Offset (Y)',
    description: 'Move text up/down (negative = up, positive = down)',
    responsive: true,
  },
  textShadow: {
    suffix: 'TextShadow',
    type: 'array',
    control: 'ShadowPanel',
    cssVarSuffix: 'text-shadow',
    cssProperty: 'text-shadow',
    default: [],
    label: 'Text Shadow',
  },
};

function expandTypographyPanelMacro(macroName, macro, blockType) {
  const expanded = {};
  const baseName = macroName || 'typography';
  const group = 'typography';
  const subgroup = macro.subgroup;
  const cssVarBase =
    macro.cssVar ||
    `${blockType}-${baseName.replace(/Typography$/, '')}`.replace(/_/g, '-');
  const appliesToElement = macro.appliesToElement || macro.appliesTo;
  const themeable = macro.themeable !== undefined ? macro.themeable : true;
  const defaults = macro.default || {};
  const fields = macro.fields && macro.fields.length ? macro.fields : DEFAULT_FIELDS;
  const states = macro.states && macro.states.length ? macro.states : ['base'];

  states.forEach((state) => {
    const stateSuffix = state === 'base' ? '' : state.charAt(0).toUpperCase() + state.slice(1);
    const stateDefaults = defaults[state] && typeof defaults[state] === 'object'
      ? defaults[state]
      : defaults;

    fields.forEach((fieldKey) => {
      const def = FIELD_DEFS[fieldKey];
      if (!def) {
        throw new Error(`Unknown typography field: ${fieldKey}`);
      }

      // Build kebab-case attribute name
      const attrName = buildKebabName(baseName, def.suffix, stateSuffix);
      const fieldDefaults = stateDefaults[fieldKey];

      const entry = {
        type: def.type,
        default: fieldDefaults !== undefined ? fieldDefaults : def.default,
        label: def.label,
        description: def.description,
        group,
        control: def.control,
        element: appliesToElement,
        themeable,
      };

      if (subgroup) {
        entry.subgroup = subgroup;
      }

      if (def.cssVarSuffix) {
        const stateToken = state === 'base' ? '' : `-${state}`;
        entry.cssVar = `${cssVarBase}-${def.cssVarSuffix}${stateToken}`;
      }

      if (def.cssProperty) {
        entry.cssProperty = def.cssProperty;
      }

      if (def.alignmentType) {
        entry.alignmentType = def.alignmentType;
      }

      if (def.options) {
        entry.options = def.options;
      }

      if (def.min !== undefined) {
        entry.min = def.min;
      }

      if (def.max !== undefined) {
        entry.max = def.max;
      }

      if (def.step !== undefined) {
        entry.step = def.step;
      }

      if (def.outputsCSS === false) {
        entry.outputsCSS = false;
      }

      if (def.responsive && !macro.disableResponsive) {
        entry.responsive = true;
      }

      if (state !== 'base') {
        entry.state = state;
      }

      expanded[attrName] = entry;
    });
  });

  return expanded;
}

module.exports = {
  expandTypographyPanelMacro,
};
