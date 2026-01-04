const fs = require('fs');
const path = require('path');

const MACRO_ALLOWED_KEYS = {
  'icon-panel': new Set([
    'type',
    'appliesTo',
    'appliesToElement',
    'cssVar',
    'default',
    'positioningProfile',
  ]),
  'typography-panel': new Set([
    'type',
    'appliesTo',
    'appliesToElement',
    'subgroup',
    'cssVar',
    'fields',
    'states',
    'default',
    'themeable',
    'disableResponsive',
  ]),
  'border-panel': new Set([
    'type',
    'appliesTo',
    'appliesToElement',
    'element',
    'subgroup',
    'fields',
    'default',
    'themeable',
  ]),
  'box-panel': new Set([
    'type',
    'appliesTo',
    'appliesToElement',
    'element',
    'fields',
    'default',
    'borderSubgroup',
    'layoutSubgroup',
    'borderSides',
    'sides',
    'themeable',
  ]),
  'color-panel': new Set([
    'type',
    'appliesTo',
    'appliesToElement',
    'subgroup',
    'states',
    'fields',
    'default',
    'themeable',
    'cssVar',
    'group',
    'stateSubgroups',
    'properties',
    'needsMapping',
  ]),
};

function pruneMacroAttribute(attrName, attr, removedByAttr) {
  const allowedKeys = MACRO_ALLOWED_KEYS[attr.type];
  if (!allowedKeys) {
    return attr;
  }

  const pruned = {};
  const removedKeys = [];

  Object.entries(attr).forEach(([key, value]) => {
    if (allowedKeys.has(key)) {
      pruned[key] = value;
    } else {
      removedKeys.push(key);
    }
  });

  if (removedKeys.length > 0) {
    removedByAttr[attrName] = removedKeys.sort();
  }

  return pruned;
}

function pruneSchema(schema) {
  const removedByAttr = {};
  const attributes = {};

  Object.entries(schema.attributes || {}).forEach(([name, attr]) => {
    if (!attr || typeof attr !== 'object') {
      attributes[name] = attr;
      return;
    }
    attributes[name] = pruneMacroAttribute(name, attr, removedByAttr);
  });

  return {
    prunedSchema: {
      ...schema,
      attributes,
    },
    removedByAttr,
  };
}

function formatRemovedKeys(removedByAttr) {
  const entries = Object.entries(removedByAttr);
  if (entries.length === 0) {
    return 'No macro keys to prune.';
  }

  const lines = entries.map(([attrName, keys]) => {
    return `- ${attrName}: ${keys.join(', ')}`;
  });

  return [`Removed macro keys:`, ...lines].join('\n');
}

function runCLI() {
  const [, , inputPath, ...rest] = process.argv;
  const shouldWrite = rest.includes('--write');
  const quiet = rest.includes('--quiet');

  if (!inputPath) {
    console.error('Usage: node schema-pruner.js <schema.json> [--write] [--quiet]');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), inputPath);
  const raw = fs.readFileSync(absolutePath, 'utf8');
  const schema = JSON.parse(raw);

  const { prunedSchema, removedByAttr } = pruneSchema(schema);

  if (!quiet) {
    console.log(formatRemovedKeys(removedByAttr));
  }

  if (shouldWrite) {
    fs.writeFileSync(absolutePath, JSON.stringify(prunedSchema, null, 2));
  }
}

if (require.main === module) {
  runCLI();
}

module.exports = {
  pruneSchema,
};
