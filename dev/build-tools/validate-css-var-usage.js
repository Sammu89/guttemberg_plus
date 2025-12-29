/**
 * CSS Variable Usage Validator
 *
 * Ensures every themeable attribute that maps to a CSS variable is actually
 * referenced in the built CSS under a selector that contains the element's
 * class name from the structure schema. This catches cases where a variable
 * exists in the schema and generated files but isn't applied to the selectors
 * rendered on the frontend/editor.
 *
 * Run this after the build so the CSS files exist.
 */

const fs = require('fs');
const path = require('path');

const colors = {
	success: '\x1b[32m',
	error: '\x1b[31m',
	warn: '\x1b[33m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

const ROOT = path.resolve(__dirname, '..');

const BLOCKS = {
	accordion: {
		schema: path.join(ROOT, 'schemas/accordion.json'),
		structure: path.join(ROOT, 'schemas/accordion-structure.json'),
		cssFiles: [
			'build/blocks/accordion/accordion.css',
			'build/blocks/accordion/index.css',
			// Fallback names if rename script didn't run
			'build/blocks/accordion/style-accordion.css',
			'build/blocks/accordion/style-index.css',
		],
		// Legacy/ignored attributes that intentionally have no CSS usage
		// shadow is array type, handled at runtime not in static CSS
		skipAttrs: new Set(['contentFontWeight', 'shadow']),
	},
	tabs: {
		schema: path.join(ROOT, 'schemas/tabs.json'),
		structure: path.join(ROOT, 'schemas/tabs-structure.json'),
		cssFiles: [
			'build/blocks/tabs/tabs.css',
			'build/blocks/tabs/index.css',
			'build/blocks/tabs/style-tabs.css',
			'build/blocks/tabs/style-index.css',
		],
	},
	toc: {
		schema: path.join(ROOT, 'schemas/toc.json'),
		structure: path.join(ROOT, 'schemas/toc-structure.json'),
		cssFiles: [
			'build/blocks/toc/toc.css',
			'build/blocks/toc/index.css',
			'build/blocks/toc/style-toc.css',
			'build/blocks/toc/style-index.css',
		],
	},
};

function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function loadJson(filePath, label) {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		console.error(`${colors.error}✗ Failed to load ${label}:${colors.reset} ${filePath}`);
		throw error;
	}
}

function loadCssContents(cssFiles) {
	const contents = [];
	cssFiles.forEach((relativePath) => {
		const fullPath = path.join(ROOT, relativePath);
		if (fs.existsSync(fullPath)) {
			try {
				contents.push(fs.readFileSync(fullPath, 'utf8'));
			} catch (error) {
				console.error(`${colors.error}✗ Failed to read CSS file:${colors.reset} ${fullPath}`);
				throw error;
			}
		}
	});
	return contents;
}

function findVarInCss(cssContents, className, cssVar) {
	if (!cssContents.length) {
		return false;
	}

	const classPattern = `\\.${escapeRegExp(className)}`;
	const varPattern = escapeRegExp(cssVar);
	const regex = new RegExp(`${classPattern}[^\\{]*\\{[^\\}]*${varPattern}`, 'i');

	return cssContents.some((content) => regex.test(content));
}

function main() {
	const missing = [];

	Object.entries(BLOCKS).forEach(([blockType, config]) => {
		const schema = loadJson(config.schema, `${blockType} schema`);
		const structure = loadJson(config.structure, `${blockType} structure`);
		const cssContents = loadCssContents(config.cssFiles);

		if (!cssContents.length) {
			console.error(
				`${colors.error}✗ No CSS files found for ${blockType} in build output.${colors.reset}`
			);
			process.exit(1);
		}

		const attributes = schema.attributes || {};
		const elements = structure.elements || {};

		Object.values(elements).forEach((element) => {
			if (!element.className || !Array.isArray(element.appliesStyles)) {
				return;
			}

			// Use the primary class (first token) for matching
			const primaryClass = element.className.split(/\s+/)[0];

			element.appliesStyles.forEach((attrName) => {
				// Skip known legacy/ignored attributes
				if (config.skipAttrs && config.skipAttrs.has(attrName)) {
					return;
				}

				const attr = attributes[attrName];
				if (!attr || !attr.cssVar) {
					return;
				}

				// Skip attributes that don't output CSS (outputsCSS: false)
				if (attr.outputsCSS === false) {
					return;
				}

				const cssVarName = attr.cssVar.startsWith('--')
					? attr.cssVar
					: `--${attr.cssVar}`;

				const isCovered = findVarInCss(cssContents, primaryClass, cssVarName);
				if (!isCovered) {
					missing.push({
						blockType,
						element: element.id || primaryClass,
						attrName,
						cssVar: cssVarName,
						className: primaryClass,
					});
				}
			});
		});
	});

	if (missing.length > 0) {
		console.error(
			`${colors.error}${colors.bold}✗ CSS variable coverage check failed.${colors.reset}`
		);
		missing.forEach((item) => {
			console.error(
				`  - ${item.blockType}: ${item.attrName} (${item.cssVar}) not found under ".${item.className}" selectors (element: ${item.element})`
			);
		});
		process.exit(1);
	}

	console.log(
		`${colors.success}${colors.bold}✓ CSS variable usage validated across built CSS.${colors.reset}`
	);
}

main();
