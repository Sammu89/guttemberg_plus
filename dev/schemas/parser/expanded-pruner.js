const PANEL_KEEP_KEYS = new Set([
  'type',
  'default',
  'element',
  'cssProperty',
  'cssVar',
  'cssVarVariants',
  'cssValue',
  'cssValueByDevice',
  'cssValueMap',
  'outputsCSS',
  'responsive',
  'state',
  'themeable',
]);

const COMPOSITE_KEEP_KEYS = new Set([
  'type',
  'element',
  'cssProperty',
  'compositeOf',
  'outputsCSS',
  'state',
]);

function pruneAttribute(attr, keys) {
  const cleaned = {};
  keys.forEach((key) => {
    if (attr[key] !== undefined) {
      cleaned[key] = attr[key];
    }
  });
  return cleaned;
}

function pruneExpandedAttributes(attributes) {
  const pruned = {};

  Object.entries(attributes || {}).forEach(([name, attr]) => {
    if (!attr || typeof attr !== 'object') {
      pruned[name] = attr;
      return;
    }

    if (attr.type === 'composite') {
      pruned[name] = pruneAttribute(attr, COMPOSITE_KEEP_KEYS);
      return;
    }

    if (attr.__panelType) {
      pruned[name] = pruneAttribute(attr, PANEL_KEEP_KEYS);
      return;
    }

    const { __panelType, ...rest } = attr;
    pruned[name] = rest;
  });

  return pruned;
}

module.exports = {
  pruneExpandedAttributes,
};
