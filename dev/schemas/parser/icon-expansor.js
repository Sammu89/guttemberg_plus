const { buildKebabName } = require('./naming-utils');

const POSITIONING_PROFILES = {
  accordion: ['left', 'right', 'box-left', 'box-right'],
  toc: ['left', 'right', 'box-left', 'box-right'],
  tabs: ['left', 'right'],
};

/**
 * Build kebab-case attribute name (delegates to naming-utils)
 */
function buildAttrName(baseName, field, state) {
  return buildKebabName(baseName, field, state);
}

/**
 * Expand icon-panel macro into individual attributes.
 *
 * Naming: baseName + Field + State (state suffix only for non-base states).
 *
 * @param {string} macroName - The macro attribute name (e.g., 'titleIcon').
 * @param {object} macro - The macro definition from schema.
 * @param {string} blockType - The block type (accordion, tabs, toc).
 * @returns {object} Expanded attributes object.
 */
function expandIconPanelMacro(macroName, macro, blockType) {
  const expanded = {};

  // Always 'icon' for icon-panel type.
  const group = 'icon';
  const baseName = macroName || 'icon';

  // Derive label from attribute name: "titleIcon" -> "Title Icon"
  const label =
    macro.label ||
    macroName
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^./, (str) => str.toUpperCase());

  // Auto-generate description
  const description = macro.description || `Icon settings for ${blockType}`;

  // Infer positioning profile from blockType
  const positioningProfile = macro.positioningProfile || blockType;

  // Get appliesToElement (or use appliesTo for backwards compat)
  const appliesToElement = macro.appliesToElement || macro.appliesTo || 'icon';

  // structureElement is same as appliesToElement
  const structureElement = appliesToElement;

  // Responsive attributes are always the same for icons
  const responsiveAttrs = ['size', 'maxSize', 'offsetX', 'offsetY'];

  // Get other required fields
  const { cssVar } = macro;
  const cssVarPrefix = cssVar && cssVar.startsWith('--')
    ? cssVar
    : `--${cssVar || `${blockType}-icon`}`;
  const defaults = macro.default || {};
  const states = ['inactive', 'is-open'];

  // Get positioning options from profile
  const allowedPositions =
    POSITIONING_PROFILES[positioningProfile] ||
    POSITIONING_PROFILES[blockType] ||
    ['left', 'right'];

  // Get state defaults (if open not provided, it means inherit from inactive)
  const inactiveDefaults = defaults.inactive || defaults.base || {};
  const openDefaults = defaults.active !== undefined ? defaults.active : null;

  // ============================================================================
  // 1. SHOW ICON TOGGLE
  // ============================================================================

  const showAttrName = buildAttrName(baseName, 'Show');
  const useDifferentAttrName = buildAttrName(baseName, 'UseDifferentIcons');
  const positionAttrName = buildAttrName(baseName, 'Position');
  const rotationAttrName = buildAttrName(baseName, 'AnimationRotation');

  expanded[showAttrName] = {
    type: 'boolean',
    default: true,
    control: 'ToggleControl',
    cssProperty: 'display',
    cssVar: `${cssVarPrefix}-display`,
    element: structureElement,
    themeable: true,
    responsive: false,
    outputsCSS: true,
    group,
    panelId: macroName, // Links to parent icon-panel
    label: 'Show Icon',
    description: 'Display icon in the block',
    // Map boolean to CSS values: true -> 'inline-grid', false -> 'none'
    cssValueMap: {
      true: 'inline-grid',
      false: 'none',
    },
  };

  // ============================================================================
  // 2. USE DIFFERENT ICONS TOGGLE
  // ============================================================================

  expanded[useDifferentAttrName] = {
    type: 'boolean',
    default: false,
    control: 'ToggleControl',
    themeable: true,
    responsive: false,
    outputsCSS: false,
    group,
    label: 'Different Icons for Open/Close',
    description: 'Use different icons for open and closed states',
  };

  // ============================================================================
  // 3. ICON POSITION
  // ============================================================================

  expanded[positionAttrName] = {
    type: 'string',
    default: defaults.position || 'right',
    control: 'IconPositionControl',
    allowedPositions,
    themeable: true,
    responsive: false,
    outputsCSS: false,
    group,
    label: 'Icon Position',
    description: 'Position of the icon relative to title',
  };

  // ============================================================================
  // 4. ICON ROTATION
  // ============================================================================

  expanded[rotationAttrName] = {
    type: 'string',
    default: defaults.animationRotation || defaults.rotation || '180deg',
    control: 'SliderWithInput',
    cssVar: `${cssVarPrefix}-animation-rotation`,
    element: structureElement,
    themeable: true,
    responsive: false,
    outputsCSS: true,
    group,
    label: 'Animation Rotation',
    description: 'Rotation delta added when the accordion opens',
    min: -180,
    max: 180,
    step: 1,
    unit: 'deg',
  };

  // ============================================================================
  // HELPER: GENERATE STATE-SPECIFIC ATTRIBUTES (inactive/is-open)
  // ============================================================================

  const generateStateAttributes = (state) => {
    const isOpen = state === 'is-open';
    const stateVarSuffix = isOpen ? '-is-open' : '';
    const stateDefaults = isOpen ? openDefaults : inactiveDefaults;
    const stateLabel = isOpen ? ' (Open)' : '';

    const getDefault = (key) => {
      if (stateDefaults && stateDefaults[key] !== undefined) {
        return stateDefaults[key];
      }
      if (isOpen && inactiveDefaults && inactiveDefaults[key] !== undefined) {
        return null; // null means "use inactive value"
      }
      return undefined;
    };

    const sourceDefault = getDefault('source') || { 'icon-type': 'char', value: '▾' };
    const normalizedSource = {
      kind: sourceDefault['icon-type'] || sourceDefault.kind || 'char',
      value: sourceDefault.value || '▾',
    };

    const stateMeta = state === 'inactive' ? {} : { state: 'is-open' };

    const buildResponsiveVar = (baseVar, device) => {
      if (device === 'tablet') {
        return `var(${baseVar}-tablet, var(${baseVar}))`;
      }
      if (device === 'mobile') {
        return `var(${baseVar}-mobile, var(${baseVar}-tablet, var(${baseVar})))`;
      }
      return `var(${baseVar})`;
    };

    const buildStateResponsiveVar = (stateVar, baseVar, device) => {
      const baseChain = buildResponsiveVar(baseVar, device);
      if (device === 'tablet') {
        return `var(${stateVar}-tablet, var(${stateVar}, ${baseChain}))`;
      }
      if (device === 'mobile') {
        return `var(${stateVar}-mobile, var(${stateVar}-tablet, var(${stateVar}, ${baseChain})))`;
      }
      return `var(${stateVar}, ${baseChain})`;
    };

    const baseInitialVar = `${cssVarPrefix}-initial-rotation`;
    const openInitialVar = `${cssVarPrefix}-initial-rotation-is-open`;
    const animationVar = `${cssVarPrefix}-animation-rotation`;
    const initialRotationValue = isOpen
      ? `var(${openInitialVar}, var(${baseInitialVar}))`
      : `var(${baseInitialVar})`;
    const baseOffsetXVar = `${cssVarPrefix}-offset-x`;
    const baseOffsetYVar = `${cssVarPrefix}-offset-y`;
    const openOffsetXVar = `${cssVarPrefix}-offset-x-is-open`;
    const openOffsetYVar = `${cssVarPrefix}-offset-y-is-open`;

    // Transform logic:
    // - Closed: translate(base offsets) + rotate(initial)
    // - Open: translate(open offsets if set, else base) + rotate((open-initial or initial) + animation delta)
    const buildTransformValue = (device) => {
      const offsetX = isOpen
        ? buildStateResponsiveVar(openOffsetXVar, baseOffsetXVar, device)
        : buildResponsiveVar(baseOffsetXVar, device);
      const offsetY = isOpen
        ? buildStateResponsiveVar(openOffsetYVar, baseOffsetYVar, device)
        : buildResponsiveVar(baseOffsetYVar, device);
      const rotation = isOpen
        ? `calc(${initialRotationValue} + var(${animationVar}))`
        : initialRotationValue;
      return `translate(${offsetX}, ${offsetY}) rotate(${rotation})`;
    };
    const transformValueByDevice = {
      desktop: buildTransformValue('desktop'),
      tablet: buildTransformValue('tablet'),
      mobile: buildTransformValue('mobile'),
    };

    return {
      [buildAttrName(baseName, 'Source', state)]: {
        type: 'object',
        default: normalizedSource,
        control: 'IconPicker',
        themeable: true,
        responsive: false,
        outputsCSS: false,
        group,
        label: `Icon${stateLabel}`,
        description: `Icon when ${state === 'inactive' ? 'closed' : 'open'}`,
        ...stateMeta,
      },

      [buildAttrName(baseName, 'Color', state)]: {
        type: 'string',
        default: getDefault('color') || '#333333',
        control: 'ColorControl',
        cssProperty: 'color',
        cssVar: `${cssVarPrefix}-color${stateVarSuffix}`,
        element: structureElement,
        themeable: true,
        responsive: false,
        outputsCSS: true,
        group,
        label: `Color${stateLabel}`,
        description: 'Icon color (for character/library icons)',
        ...stateMeta,
      },

      [buildAttrName(baseName, 'InitialRotation', state)]: {
        type: 'string',
        default: getDefault('initialRotation') || getDefault('rotation') || '0deg',
        control: 'SliderWithInput',
        cssVar: `${cssVarPrefix}-initial-rotation${stateVarSuffix}`,
        element: structureElement,
        themeable: true,
        responsive: false,
        outputsCSS: true,
        group,
        label: `Initial Rotation${stateLabel}`,
        description: `Rotation applied before animation for the ${state} icon`,
        min: -180,
        max: 180,
        step: 1,
        unit: 'deg',
        ...stateMeta,
      },

      [buildAttrName(baseName, 'Transform', state)]: {
        type: 'string',
        cssProperty: 'transform',
        cssValueByDevice: transformValueByDevice,
        element: structureElement,
        themeable: true,
        responsive: true,
        outputsCSS: true,
        group,
        ...stateMeta,
      },

      [buildAttrName(baseName, 'Size', state)]: {
        type: 'string',
        default: getDefault('size') || '16px',
        control: 'SliderWithInput',
        cssProperty: 'font-size',
        cssVar: `${cssVarPrefix}-size${stateVarSuffix}`,
        element: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('size'),
        outputsCSS: true,
        group,
        label: `Size${stateLabel}`,
        description: 'Icon size (for character/library icons)',
        min: 8,
        max: 64,
        step: 1,
        unit: 'px',
        ...stateMeta,
      },

      [buildAttrName(baseName, 'MaxSize', state)]: {
        type: 'string',
        default: getDefault('maxSize') || '24px',
        control: 'SliderWithInput',
        cssProperty: 'max-width',
        cssVar: `${cssVarPrefix}-max-size${stateVarSuffix}`,
        element: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('maxSize'),
        outputsCSS: true,
        group,
        label: `Max Size${stateLabel}`,
        description: 'Maximum icon size (for image icons)',
        min: 8,
        max: 128,
        step: 1,
        unit: 'px',
        ...stateMeta,
      },

      [buildAttrName(baseName, 'OffsetX', state)]: {
        type: 'string',
        default: getDefault('offsetX') || '0px',
        control: 'SliderWithInput',
        cssVar: `${cssVarPrefix}-offset-x${stateVarSuffix}`,
        element: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('offsetX'),
        outputsCSS: true,
        group,
        label: `Offset X${stateLabel}`,
        description: 'Horizontal translate offset of icon',
        min: -100,
        max: 100,
        step: 1,
        unit: 'px',
        ...stateMeta,
      },

      [buildAttrName(baseName, 'OffsetY', state)]: {
        type: 'string',
        default: getDefault('offsetY') || '0px',
        control: 'SliderWithInput',
        cssVar: `${cssVarPrefix}-offset-y${stateVarSuffix}`,
        element: structureElement,
        themeable: true,
        responsive: responsiveAttrs.includes('offsetY'),
        outputsCSS: true,
        group,
        label: `Offset Y${stateLabel}`,
        description: 'Vertical translate offset of icon',
        min: -100,
        max: 100,
        step: 1,
        unit: 'px',
        ...stateMeta,
      },
    };
  };

  states.forEach((state) => {
    Object.assign(expanded, generateStateAttributes(state));
  });

  return expanded;
}

module.exports = {
  expandIconPanelMacro,
  POSITIONING_PROFILES,
};
