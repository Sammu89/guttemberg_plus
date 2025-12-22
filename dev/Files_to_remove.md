# Potentially Removable Files/Directories

- `dist/**`: Build packaging copy created by `build-tools/prompt-dist.js`; nothing loads code from `dist` at runtime.
- `shared/build/index.js`, `shared/build/shared-vendor.js`, `build/shared/index.*`: No enqueues or imports point to these bundles; unused after builds.
- `build/blocks/accordion/accordion.js` (+ `.asset.php`), `build/blocks/tabs/tabs.js`, `build/blocks/toc/toc.js`: Style-entry JS stubs; block manifests only use the CSS outputs.
- `shared/src/styles/accordion-styles-generated.js`, `shared/src/styles/tabs-styles-generated.js`, `shared/src/styles/toc-styles-generated.js`, `shared/src/styles/USAGE-EXAMPLE.md`: Generated style builders not imported by runtime code; only referenced in docs/validators.
- `shared/src/hooks/useBlockThemes.js`, `shared/src/hooks/useCSSDefaults.js`, `shared/src/utils/schema-config-builder.js`, `shared/src/data/usage-example.js`: Exported from shared but never imported by blocks; demo/unused utilities.
- `shared/src/types/*.ts`, `shared/src/validators/*.ts`: Generated typings/validators not consumed by runtime JS/PHP (docs-only).
- `php/test-css-parser.php`, `php/test-theme-css-output.php`, `php/test-mapping.php`: PHP test helpers never required by plugin code.
- `build-tools/test-save-styles-generator.js`, `build-tools/test-output-getInlineStyles.js`, `verify-markers.js`, `dev-watch.sh`, `RUN.sh`, `RUN.bat`, `npm run build.bat`: Standalone scripts not wired into `package.json`.
- `tests/*.test.js`, `tests/run-all-tests.js`: Test suite not invoked by npm scripts; currently inert.
- Docs-like artifacts outside `docs/` (`reports/**`, `IMPLEMENTATION-PLAN.md`, `TOC_Implementation.md`, `TOC Logic.md`, `schema order.md`, `claude.md`): Informational only; no runtime effect.
