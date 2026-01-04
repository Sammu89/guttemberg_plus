#!/usr/bin/env node
/**
 * Validation Runner
 *
 * Provides readable, ordered validation output and simple filtering.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');

const hasBuildCss = () => {
  const candidates = [
    'build/blocks/accordion/index.css',
    'build/blocks/accordion/accordion.css',
    'build/blocks/tabs/index.css',
    'build/blocks/tabs/tabs.css',
    'build/blocks/toc/index.css',
    'build/blocks/toc/toc.css',
  ];
  return candidates.some((rel) => fs.existsSync(path.join(ROOT, rel)));
};

const hasGeneratedCss = () => {
  const candidates = [
    'css/generated/accordion_variables.scss',
    'css/generated/tabs_variables.scss',
    'css/generated/toc_variables.scss',
  ];
  return candidates.every((rel) => fs.existsSync(path.join(ROOT, rel)));
};

const hasThemeJsonInputs = () => {
  const dir = process.env.GUTPLUS_THEME_JSON_DIR;
  const paths = process.env.GUTPLUS_THEME_JSON_PATHS;
  if (!dir && !paths) {
    return false;
  }

  const resolvePath = (input) => {
    if (!input) return null;
    return path.isAbsolute(input) ? input : path.join(ROOT, input);
  };

  if (dir) {
    return fs.existsSync(resolvePath(dir));
  }

  if (paths) {
    return paths
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .some((entry) => fs.existsSync(resolvePath(entry)));
  }

  return false;
};

const hasThemeCssInputs = () => {
  const dir = process.env.GUTPLUS_THEME_CSS_DIR;
  const paths = process.env.GUTPLUS_THEME_CSS_PATHS;
  if (!dir && !paths) {
    return false;
  }

  const resolvePath = (input) => {
    if (!input) return null;
    return path.isAbsolute(input) ? input : path.join(ROOT, input);
  };

  if (dir) {
    return fs.existsSync(resolvePath(dir));
  }

  if (paths) {
    return paths
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .some((entry) => fs.existsSync(resolvePath(entry)));
  }

  return false;
};

const validations = [
  {
    id: 'schema-structure',
    title: 'Schema ↔ Structure Consistency',
    group: 'schema',
    command: ['node', 'build-tools/validate-schema-structure.js'],
  },
  {
    id: 'responsive-schema',
    title: 'Responsive Schema Requirements',
    group: 'schema',
    command: ['node', 'build-tools/validate-responsive-css-attrs.js'],
  },
  {
    id: 'controls',
    title: 'Schema Controls + Dependencies',
    group: 'schema',
    command: ['node', 'build-tools/validate-controls.js'],
  },
  {
    id: 'control-docs',
    title: 'Control Data Structure Docs',
    group: 'schema',
    command: ['node', 'build-tools/validate-control-data-structures.js'],
  },
  {
    id: 'control-values',
    title: 'Control Value Shapes',
    group: 'schema',
    command: ['node', 'build-tools/validate-control-values.js'],
  },
  {
    id: 'theme-json-values',
    title: 'Theme JSON Values',
    group: 'schema',
    command: ['node', 'build-tools/validate-theme-json-values.js'],
    shouldRun: hasThemeJsonInputs,
    skipReason: 'Set GUTPLUS_THEME_JSON_DIR or GUTPLUS_THEME_JSON_PATHS to enable.',
  },
  {
    id: 'theme-css-values',
    title: 'Theme CSS Variables',
    group: 'css',
    command: ['node', 'build-tools/validate-theme-css-vars.js'],
    shouldRun: hasThemeCssInputs,
    skipReason: 'Set GUTPLUS_THEME_CSS_DIR or GUTPLUS_THEME_CSS_PATHS to enable.',
  },
  {
    id: 'schema-usage',
    title: 'Schema ↔ Code Usage',
    group: 'code',
    command: ['node', 'build-tools/validate-schema-usage.js'],
  },
  {
    id: 'attribute-destructuring',
    title: 'Edit.js Attribute Destructuring',
    group: 'code',
    command: ['node', 'build-tools/validate-attribute-destructuring.js'],
  },
  {
    id: 'mismatches',
    title: 'Schema ↔ Code Mismatches',
    group: 'code',
    command: ['node', 'build-tools/validate-mismatches.js'],
  },
  {
    id: 'editor-css-vars',
    title: 'Editor CSS Variables',
    group: 'code',
    command: ['node', 'build-tools/validate-editor-css-vars.js'],
  },
  {
    id: 'editor-frontend-sync',
    title: 'Editor ↔ Frontend Synchronization',
    group: 'code',
    command: ['node', 'build-tools/validate-editor-frontend-sync.js'],
  },
  {
    id: 'generated-css',
    title: 'Generated CSS Output (Responsive + Decomposition)',
    group: 'css',
    command: ['node', 'build-tools/validate-generated-css.js'],
    shouldRun: hasGeneratedCss,
    skipReason: 'Generated CSS not found. Run `npm run schema:build` first.',
  },
  {
    id: 'css-fallback-chains',
    title: 'CSS Fallback Chains',
    group: 'css',
    command: ['node', 'build-tools/validate/css-fallback-chains.js'],
    shouldRun: hasGeneratedCss,
    skipReason: 'Generated CSS not found. Run `npm run schema:build` first.',
  },
  {
    id: 'css-var-usage',
    title: 'CSS Variable Usage in Build Output',
    group: 'css',
    command: ['node', 'build-tools/validate-css-var-usage.js'],
    shouldRun: hasBuildCss,
    skipReason: 'Build CSS not found. Run `npm run build` first.',
  },
  {
    id: 'toggles',
    title: 'Toggle-Dependent Behavior',
    group: 'behavior',
    command: ['node', 'build-tools/validate-toggles.js'],
  },
];

function parseArgs() {
  const args = process.argv.slice(2);
  const groupIndex = args.indexOf('--group');
  const onlyIndex = args.indexOf('--only');
  const listOnly = args.includes('--list');
  const warnOnly = args.includes('--warn-only');

  const group = groupIndex !== -1 ? args[groupIndex + 1] : null;
  const only = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

  return { group, only, listOnly, warnOnly };
}

function filterValidations({ group, only }) {
  let filtered = validations;

  if (group) {
    filtered = filtered.filter((v) => v.group === group);
  }

  if (only) {
    filtered = filtered.filter((v) => v.id === only);
  }

  return filtered;
}

function runValidation(validation, index, total, warnOnly) {
  const label = `Validation ${index} of ${total} — ${validation.title}`;
  console.log(`\n${label}`);
  console.log('-'.repeat(label.length));

  if (validation.shouldRun && !validation.shouldRun()) {
    console.log(`Status: SKIPPED`);
    console.log(`Reason: ${validation.skipReason}`);
    return { skipped: true, code: 0 };
  }

  const [command, ...args] = validation.command;
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
  });

  if (result.status === 0) {
    console.log(`Status: PASS`);
  } else if (warnOnly) {
    console.log(`Status: WARN (non-blocking)`);
  } else {
    console.log(`Status: FAIL`);
  }

  return { skipped: false, code: result.status || 0 };
}

function main() {
  const args = parseArgs();
  const selected = filterValidations(args);

  if (args.listOnly) {
    selected.forEach((v) => {
      console.log(`${v.id} (${v.group}) — ${v.title}`);
    });
    return;
  }

  if (selected.length === 0) {
    console.error('No validations matched the filter.');
    process.exit(1);
  }

  let failures = 0;
  let skipped = 0;

  selected.forEach((validation, idx) => {
    const result = runValidation(validation, idx + 1, selected.length, args.warnOnly);
    if (result.skipped) {
      skipped += 1;
      return;
    }
    if (result.code !== 0) {
      failures += 1;
    }
  });

  if (failures > 0) {
    if (!args.warnOnly) {
      console.error(`\nValidation failed: ${failures} failing check(s).`);
      process.exit(1);
    }
  }

  const summary = [];
  if (failures > 0 && args.warnOnly) {
    summary.push(`${failures} warning(s)`);
  }
  if (skipped > 0) {
    summary.push(`${skipped} skipped check(s)`);
  }

  if (summary.length > 0) {
    console.log(`\nValidation complete with ${summary.join(' and ')}.`);
  } else {
    console.log(`\nValidation complete: all checks passed.`);
  }
}

main();
