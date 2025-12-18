/**
 * Mismatch Validator
 *
 * Catches semantic mismatches between schema definitions and code implementation.
 * Runs during build to facilitate debugging.
 *
 * Checks:
 * 1. Data Attribute Sync - frontend.js reads data-* that save.js must set
 * 2. SelectControl Options - options defined should be used in conditionals
 * 3. Toggle Effects - toggles should affect something in code
 * 4. CSS Variable Generation - style.scss uses var(--x) that must be generated
 *
 * Usage: npm run validate:mismatches
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOCKS = ['accordion', 'tabs', 'toc'];
const ROOT = path.resolve(__dirname, '..');

// ANSI colors for terminal output
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	cyan: '\x1b[36m',
	gray: '\x1b[90m',
	bold: '\x1b[1m',
};

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 1: Data Attribute Sync
// Ensures frontend.js doesn't read data-* attributes that save.js doesn't set
// ═══════════════════════════════════════════════════════════════════════════

// Data attributes that are set on inner blocks (panels), not the main block
// These are false positives because they're read from child elements
const INNER_BLOCK_DATA_ATTRS = new Set([
	'data-tab-id',
	'data-tab-title',
	'data-disabled',
	'data-panel-id',
	'data-accordion-id',
	'data-item-id',
	'data-toc-item',
]);

function checkDataAttributeSync(blockType) {
	const errors = [];

	const frontendPath = path.join(ROOT, `blocks/${blockType}/src/frontend.js`);
	const savePath = path.join(ROOT, `blocks/${blockType}/src/save.js`);

	if (!fs.existsSync(frontendPath) || !fs.existsSync(savePath)) {
		return errors;
	}

	const frontendCode = fs.readFileSync(frontendPath, 'utf8');
	const saveCode = fs.readFileSync(savePath, 'utf8');

	// Find all getAttribute('data-*') calls in frontend.js
	// Only flag those called on 'block' variable (main block), not 'panel', 'item', etc.
	const frontendLines = frontendCode.split('\n');
	const frontendDataAttrs = new Map(); // attr -> { line, context }

	// Pattern: something.getAttribute('data-*')
	const getAttrRegex = /(\w+)\.getAttribute\s*\(\s*['"`](data-[\w-]+)['"`]\s*\)/g;
	let match;

	while ((match = getAttrRegex.exec(frontendCode)) !== null) {
		const variable = match[1];
		const attr = match[2];

		// Skip inner block attributes
		if (INNER_BLOCK_DATA_ATTRS.has(attr)) {
			continue;
		}

		// Only flag if reading from 'block' variable (main block element)
		// Skip if reading from panel, item, button, etc. (inner elements)
		const innerElementVars = ['panel', 'item', 'button', 'header', 'content', 'element', 'el'];
		if (innerElementVars.includes(variable.toLowerCase())) {
			continue;
		}

		// Find line number
		let lineNum = 0;
		const matchPos = match.index;
		let charCount = 0;
		for (let i = 0; i < frontendLines.length; i++) {
			charCount += frontendLines[i].length + 1;
			if (charCount > matchPos) {
				lineNum = i + 1;
				break;
			}
		}

		frontendDataAttrs.set(attr, { line: lineNum, variable });
	}

	// Find all 'data-*': patterns in save.js (within useBlockProps.save or JSX)
	const setAttrRegex = /['"`](data-[\w-]+)['"`]\s*:/g;
	const saveDataAttrs = new Set();

	while ((match = setAttrRegex.exec(saveCode)) !== null) {
		saveDataAttrs.add(match[1]);
	}

	// Also check for data-* in JSX attributes like data-orientation={...}
	const jsxAttrRegex = /(data-[\w-]+)\s*=\s*\{/g;
	while ((match = jsxAttrRegex.exec(saveCode)) !== null) {
		saveDataAttrs.add(match[1]);
	}

	// Check for mismatches
	for (const [attr, info] of frontendDataAttrs) {
		if (!saveDataAttrs.has(attr)) {
			const camelName = kebabToCamel(attr.replace('data-', ''));
			errors.push({
				type: 'error',
				block: blockType,
				file: 'frontend.js',
				line: info.line,
				message: `reads '${attr}' from '${info.variable}' but save.js doesn't set it`,
				fix: `Add '${attr}': attributes.${camelName} to useBlockProps.save() in save.js`,
			});
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 2: SelectControl Options Usage
// Ensures SelectControl options are actually used in conditional logic
// ═══════════════════════════════════════════════════════════════════════════

// SelectControl attributes that work via CSS variables only (no JS logic needed)
// These are alignment, font-weight, text-transform, etc. that CSS handles
const CSS_ONLY_SELECT_PATTERNS = [
	/align/i,           // horizontalAlign, verticalAlign, textAlign, etc.
	/fontWeight/i,      // titleFontWeight, contentFontWeight
	/fontStyle/i,       // titleFontStyle
	/textTransform/i,   // titleTextTransform
	/textDecoration/i,  // titleTextDecoration
	/borderStyle/i,     // borderStyle, focusBorderStyle
	/position$/i,       // iconPosition (but check if it needs JS for rendering order)
];

function checkSelectControlUsage(blockType) {
	const warnings = [];
	const errors = [];

	const schemaPath = path.join(ROOT, `schemas/${blockType}.json`);

	if (!fs.existsSync(schemaPath)) {
		return { errors, warnings };
	}

	const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

	// Find SelectControl attributes with options
	const selectAttrs = Object.entries(schema.attributes || {}).filter(
		([_, attr]) => attr.control === 'SelectControl' && attr.options?.length > 0
	);

	if (selectAttrs.length === 0) return { errors, warnings };

	// Load all code files
	const codeFiles = ['edit.js', 'save.js', 'frontend.js']
		.map((f) => path.join(ROOT, `blocks/${blockType}/src/${f}`))
		.filter((f) => fs.existsSync(f))
		.map((f) => fs.readFileSync(f, 'utf8'))
		.join('\n');

	for (const [attrName, attr] of selectAttrs) {
		// Skip attributes that are purely CSS-driven (no JS logic needed)
		// Check if attribute name matches CSS-only patterns
		const isCssOnly = CSS_ONLY_SELECT_PATTERNS.some((pattern) => pattern.test(attrName));

		// Also skip if it has cssVar and cssProperty (handled by CSS)
		if (isCssOnly || (attr.cssVar && attr.cssProperty)) {
			continue;
		}

		// Check if attribute is used in any conditional
		const conditionalPatterns = [
			new RegExp(`${attrName}\\s*[!=]==?\\s*['"\`]`, 'g'), // attr === 'value' or attr !== 'value'
			new RegExp(`['"\`]\\w+['"\`]\\s*[!=]==?\\s*${attrName}`, 'g'), // 'value' === attr
			new RegExp(`switch\\s*\\([^)]*${attrName}`, 'g'), // switch(attr)
			new RegExp(`${attrName}\\s*\\?`, 'g'), // attr ? (ternary)
			new RegExp(`\\.${attrName}\\s*[!=]==?`, 'g'), // .attr === or .attr !== (effectiveValues.attr)
			new RegExp(`\\[\\s*['"\`]${attrName}['"\`]\\s*\\]`, 'g'), // ['attr'] access
		];

		const hasConditional = conditionalPatterns.some((p) => p.test(codeFiles));

		// Also check if it's used in className or style computation
		const usagePatterns = [
			new RegExp(`${attrName}.*className`, 'g'),
			new RegExp(`className.*${attrName}`, 'g'),
			new RegExp(`\\$\\{.*${attrName}.*\\}`, 'g'), // template literal
		];

		const hasUsage = usagePatterns.some((p) => p.test(codeFiles));

		if (!hasConditional && !hasUsage) {
			const optionValues = attr.options.map((o) => o.value || o.label || o);
			warnings.push({
				type: 'warning',
				block: blockType,
				attribute: attrName,
				message: `has ${attr.options.length} options but no conditionals found`,
				options: optionValues,
				fix: `Add conditional logic to handle different ${attrName} values`,
			});
		}

		// For positionType-like attributes, check CSS classes/selectors exist for options
		// Skip purely behavioral attributes (no CSS needed)
		if (attrName.match(/position|orientation|style/i) && !attrName.match(/mode$/i)) {
			const optionValues = attr.options.map((o) => o.value || o.label || o);
			const stylePath = path.join(ROOT, `blocks/${blockType}/src/style.scss`);
			const themeGeneratedPath = path.join(ROOT, `blocks/${blockType}/src/_theme-generated.scss`);

			// Check both style.scss and _theme-generated.scss
			let styleCode = '';
			if (fs.existsSync(stylePath)) {
				styleCode += fs.readFileSync(stylePath, 'utf8');
			}
			if (fs.existsSync(themeGeneratedPath)) {
				styleCode += fs.readFileSync(themeGeneratedPath, 'utf8');
			}

			if (styleCode) {
				const missingClasses = [];

				for (const optionValue of optionValues) {
					// Check for THREE patterns:
					// 1. Class: .blockType-attrName-optionValue (e.g., .toc-position-sticky)
					// 2. Class: .toc-attrName-optionValue (alternate prefix)
					// 3. Data attribute selector: [data-attr-name="value"] (e.g., [data-orientation="horizontal"])
					const expectedClass = `.${blockType}-${kebabCase(attrName)}-${optionValue}`;
					const alternateClass = `.toc-${kebabCase(attrName)}-${optionValue}`;
					const dataAttrSelector = `data-${kebabCase(attrName)}="${optionValue}"`;

					if (!styleCode.includes(expectedClass) &&
					    !styleCode.includes(alternateClass) &&
					    !styleCode.includes(dataAttrSelector)) {
						missingClasses.push(optionValue);
					}
				}

				if (missingClasses.length > 0) {
					errors.push({
						type: 'error',
						block: blockType,
						attribute: attrName,
						message: `has options [${missingClasses.join(', ')}] but CSS classes/selectors not found`,
						fix: `Add CSS for: ${missingClasses.map(v => `.${blockType}-${kebabCase(attrName)}-${v} or [data-${kebabCase(attrName)}="${v}"]`).join(', ')}`,
					});
				}
			}
		}
	}

	return { errors, warnings };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 3: Toggle Effect Verification
// Ensures ToggleControl attributes actually affect something
// ═══════════════════════════════════════════════════════════════════════════

function checkToggleEffects(blockType) {
	const warnings = [];

	const schemaPath = path.join(ROOT, `schemas/${blockType}.json`);

	if (!fs.existsSync(schemaPath)) {
		return warnings;
	}

	const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

	// Find ToggleControl attributes
	const toggleAttrs = Object.entries(schema.attributes || {}).filter(
		([_, attr]) => attr.control === 'ToggleControl'
	);

	if (toggleAttrs.length === 0) return warnings;

	// Load all code files
	const codeFiles = ['edit.js', 'save.js', 'frontend.js']
		.map((f) => path.join(ROOT, `blocks/${blockType}/src/${f}`))
		.filter((f) => fs.existsSync(f))
		.map((f) => fs.readFileSync(f, 'utf8'))
		.join('\n');

	for (const [attrName, attr] of toggleAttrs) {
		// Skip internal/structural toggles
		if (attrName.startsWith('_')) continue;
		if (attr.themeable === false && attr.reason === 'structural') continue;
		if (attr.themeable === false && attr.reason === 'behavioral') continue;

		// Check if toggle is used in conditional
		const conditionalPatterns = [
			new RegExp(`if\\s*\\([^)]*${attrName}`, 'g'), // if (toggle) or if (!toggle)
			new RegExp(`${attrName}\\s*&&`, 'g'), // toggle &&
			new RegExp(`${attrName}\\s*\\?`, 'g'), // toggle ?
			new RegExp(`!\\s*${attrName}`, 'g'), // !toggle
			new RegExp(`${attrName}\\s*\\|\\|`, 'g'), // toggle ||
			new RegExp(`\\.${attrName}\\s*[?&|]`, 'g'), // .toggle ? or .toggle &&
			new RegExp(`\\[\\s*['"\`]${attrName}['"\`]\\s*\\]`, 'g'), // ['toggle']
		];

		const hasConditional = conditionalPatterns.some((p) => p.test(codeFiles));

		if (!hasConditional) {
			warnings.push({
				type: 'warning',
				block: blockType,
				attribute: attrName,
				message: `toggle defined but never checked in code`,
				fix: `Add conditional: if (${attrName}) { ... } or ${attrName} && render()`,
			});
		}
	}

	return warnings;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 3.5: Data Attribute Coverage Check
// Ensures all schema behavioral attributes are saved as data attributes
// ═══════════════════════════════════════════════════════════════════════════

// Attributes that should NOT be data attributes (structural/editor-only attributes)
// These are used during render but don't need to be in the frontend DOM
const STRUCTURAL_ONLY_ATTRS = new Set([
	// IDs and identifiers (React/editor only, not needed in frontend JS)
	'uniqueId',
	'blockId',

	// Theme is applied as CSS class, not read from data attribute
	'currentTheme',

	// Heading level is rendered as HTML tag, not read from data attribute
	'headingLevel',

	// Content attributes (used in save.js render, not frontend JS)
	'showTitle', // Used to conditionally render, not read by frontend
	'title',
	'titleText',
	'content',
]);

function checkBehaviorAttributesCoverage(blockType) {
	const warnings = [];

	const schemaPath = path.join(ROOT, `schemas/${blockType}.json`);
	const savePath = path.join(ROOT, `blocks/${blockType}/src/save.js`);
	const frontendPath = path.join(ROOT, `blocks/${blockType}/src/frontend.js`);

	if (!fs.existsSync(schemaPath) || !fs.existsSync(savePath)) {
		return warnings;
	}

	const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
	const saveCode = fs.readFileSync(savePath, 'utf8');

	// Load frontend code to check what's actually being read
	let frontendCode = '';
	if (fs.existsSync(frontendPath)) {
		frontendCode = fs.readFileSync(frontendPath, 'utf8');
	}

	// Find behavioral attributes (themeable: false, reason: behavioral or structural)
	const behaviorAttrs = Object.entries(schema.attributes || {})
		.filter(([_, attr]) =>
			attr.themeable === false &&
			(attr.reason === 'behavioral' || attr.reason === 'structural') &&
			attr.group === 'behavior'
		)
		.map(([name]) => name);

	// Check if each is referenced in save.js as data attribute
	for (const attrName of behaviorAttrs) {
		// Skip structural-only attributes (used in save.js render, not frontend JS)
		if (STRUCTURAL_ONLY_ATTRS.has(attrName)) {
			continue;
		}

		const dataAttrName = 'data-' + attrName.replace(/([A-Z])/g, '-$1').toLowerCase();

		// Check both object notation and JSX attribute
		const hasObjectNotation = saveCode.includes(`'${dataAttrName}':`);
		const hasJsxAttr = saveCode.includes(`${dataAttrName}=`);

		if (!hasObjectNotation && !hasJsxAttr) {
			// Only warn if frontend.js actually tries to read this attribute
			// This prevents false positives for attributes used only in save.js
			const frontendReads = frontendCode.includes(dataAttrName);

			if (frontendReads) {
				warnings.push({
					type: 'warning',
					block: blockType,
					attribute: attrName,
					message: `behavioral attribute not saved as data attribute (but frontend reads it)`,
					fix: `Add '${dataAttrName}': attributes.${attrName} to save.js data attributes`,
				});
			}
		}
	}

	return warnings;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 4: CSS Variable Generation
// Ensures CSS variables used in stylesheets are actually generated
// ═══════════════════════════════════════════════════════════════════════════

function checkCssVariableGeneration(blockType) {
	const errors = [];

	const stylePath = path.join(ROOT, `blocks/${blockType}/src/style.scss`);
	const varsPath = path.join(ROOT, `assets/css/${blockType}-variables.css`);

	if (!fs.existsSync(stylePath) || !fs.existsSync(varsPath)) {
		return errors;
	}

	const styleCode = fs.readFileSync(stylePath, 'utf8');
	const varsCode = fs.readFileSync(varsPath, 'utf8');

	// Find all var(--block-*) usages in style.scss
	const varUsageRegex = /var\s*\(\s*(--[\w-]+)\s*\)/g;
	const usedVars = new Map(); // varName -> lineNum
	const styleLines = styleCode.split('\n');

	let match;
	while ((match = varUsageRegex.exec(styleCode)) !== null) {
		const varName = match[1];

		// Only check variables for this block type
		if (!varName.startsWith(`--${blockType}`)) {
			continue;
		}

		// Find line number
		let lineNum = 0;
		const matchPos = match.index;
		let charCount = 0;
		for (let i = 0; i < styleLines.length; i++) {
			charCount += styleLines[i].length + 1;
			if (charCount > matchPos) {
				lineNum = i + 1;
				break;
			}
		}

		usedVars.set(varName, lineNum);
	}

	// Find all defined CSS variables in the generated file
	const varDefRegex = /(--[\w-]+)\s*:/g;
	const definedVars = new Set();

	while ((match = varDefRegex.exec(varsCode)) !== null) {
		definedVars.add(match[1]);
	}

	// Check for missing variables
	for (const [varName, lineNum] of usedVars) {
		if (!definedVars.has(varName)) {
			// Find the schema attribute that should generate this
			const attrName = varNameToAttrName(varName, blockType);

			errors.push({
				type: 'error',
				block: blockType,
				file: 'style.scss',
				line: lineNum,
				message: `uses '${varName}' but it's not generated in ${blockType}-variables.css`,
				fix: attrName
					? `Check schema attribute '${attrName}' has themeable:true, cssVar, and correct type handling`
					: `Add cssVar definition in schema or check object type handling in schema-compiler.js`,
			});
		}
	}

	return errors;
}

/**
 * Convert CSS variable name to likely attribute name
 * --tabs-button-border-radius -> tabButtonBorderRadius
 */
function varNameToAttrName(varName, blockType) {
	// Remove -- prefix and block prefix
	let name = varName.replace(/^--/, '').replace(new RegExp(`^${blockType}-`), '');

	// Convert kebab-case to camelCase
	return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 5: CSS Class Concordance
// Ensures frontend-generated classes match CSS expectations
// ═══════════════════════════════════════════════════════════════════════════

function checkCssClassConcordance(blockType) {
	const errors = [];

	const frontendPath = path.join(ROOT, `blocks/${blockType}/src/frontend.js`);
	const stylePath = path.join(ROOT, `blocks/${blockType}/src/style.scss`);

	if (!fs.existsSync(frontendPath) || !fs.existsSync(stylePath)) {
		return errors;
	}

	const frontendCode = fs.readFileSync(frontendPath, 'utf8');
	const styleCode = fs.readFileSync(stylePath, 'utf8');

	// Extract className assignments from frontend
	// Pattern: className = "string" or className = `template-${var}`
	const classAssignments = new Map();

	// Simple string literals (single and double quotes only, NOT backticks)
	const stringClassRegex = /className\s*=\s*['"]([^'"]+)['"]/g;
	let match;
	while ((match = stringClassRegex.exec(frontendCode)) !== null) {
		const classes = match[1].split(' ');
		classes.forEach(cls => {
			if (cls.startsWith(blockType) || cls.startsWith('toc-')) {
				classAssignments.set(cls, 'literal');
			}
		});
	}

	// Template literals with variables
	const templateClassRegex = /className\s*=\s*`([^`]+)`/g;
	while ((match = templateClassRegex.exec(frontendCode)) !== null) {
		const template = match[1];

		// Check if template contains variables
		if (template.includes('${')) {
			// Extract pattern like "toc-item toc-level-${var}" → check for "toc-item" and "toc-level-*"
			// First, extract all static class names (not part of dynamic patterns)
			const staticParts = template.split(/\$\{[^}]*\}/);
			staticParts.forEach(part => {
				const classes = part.trim().split(/\s+/).filter(c => c && !c.endsWith('-'));
				classes.forEach(cls => {
					if (cls.startsWith(blockType) || cls.startsWith('toc-')) {
						classAssignments.set(cls, 'literal');
					}
				});
			});

			// Extract the pattern directly with regex - handle "toc-level-${ var }"
			const dynamicClassPattern = /([\w-]+)-\s*\$\{/g;
			let dynMatch;
			while ((dynMatch = dynamicClassPattern.exec(template)) !== null) {
				const prefix = dynMatch[1];
				// Only add block-specific or toc- prefixed classes
				if (prefix === blockType || prefix === 'toc-level' || prefix === 'toc-item-level') {
					classAssignments.set(prefix + '-*', 'template');
				}
			}
		} else {
			// No variables, treat as static
			const classes = template.split(/\s+/).filter(c => c);
			classes.forEach(cls => {
				if (cls.startsWith(blockType) || cls.startsWith('toc-')) {
					classAssignments.set(cls, 'literal');
				}
			});
		}
	}

	// Extract CSS class selectors from style.scss
	const cssClasses = new Set();
	const cssClassRegex = /\.([\w-]+)\s*[{,\s]/g;
	while ((match = cssClassRegex.exec(styleCode)) !== null) {
		const className = match[1];
		if (className.startsWith(blockType) || className.startsWith('toc-')) {
			cssClasses.add(className);
		}
	}

	// Check for mismatches
	for (const [frontendClass, type] of classAssignments) {
		if (type === 'literal') {
			// Exact match required
			if (!cssClasses.has(frontendClass)) {
				errors.push({
					type: 'error',
					block: blockType,
					file: 'frontend.js',
					message: `generates class '${frontendClass}' but style.scss doesn't have it`,
					fix: `Add .${frontendClass} { } to style.scss or check class name spelling`,
				});
			}
		} else if (type === 'template') {
			// Pattern match (check if any CSS class starts with this prefix)
			const prefix = frontendClass.replace('*', '');
			const hasMatch = Array.from(cssClasses).some(cls => cls.startsWith(prefix));
			if (!hasMatch) {
				errors.push({
					type: 'error',
					block: blockType,
					file: 'frontend.js',
					message: `generates dynamic classes like '${frontendClass}' but no matching CSS found`,
					fix: `Add .${prefix}* selectors to style.scss (e.g., .${prefix}1, .${prefix}2, etc.)`,
				});
			}
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function kebabToCamel(str) {
	return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function kebabCase(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

function main() {
	const allErrors = [];
	const allWarnings = [];

	console.log(`\n${colors.cyan}${colors.bold}Mismatch Validation${colors.reset}\n`);

	for (const blockType of BLOCKS) {
		// Run all checks
		allErrors.push(...checkDataAttributeSync(blockType));
		allErrors.push(...checkCssVariableGeneration(blockType));
		allErrors.push(...checkCssClassConcordance(blockType));

		const selectResults = checkSelectControlUsage(blockType);
		allErrors.push(...selectResults.errors);
		allWarnings.push(...selectResults.warnings);

		allWarnings.push(...checkToggleEffects(blockType));
		allWarnings.push(...checkBehaviorAttributesCoverage(blockType));
	}

	// Report errors
	if (allErrors.length > 0) {
		console.log(`${colors.red}${colors.bold}ERRORS:${colors.reset}\n`);
		for (const err of allErrors) {
			console.log(
				`  ${colors.red}${err.block}/${err.file}:${err.line}${colors.reset} ${err.message}`
			);
			console.log(`  ${colors.gray}Fix: ${err.fix}${colors.reset}\n`);
		}
	}

	// Report warnings
	if (allWarnings.length > 0) {
		console.log(`${colors.yellow}${colors.bold}WARNINGS:${colors.reset}\n`);
		for (const warn of allWarnings) {
			console.log(
				`  ${colors.yellow}${warn.block}/${warn.attribute}${colors.reset} ${warn.message}`
			);
			if (warn.options) {
				console.log(`  ${colors.gray}Options: ${warn.options.join(', ')}${colors.reset}`);
			}
			console.log(`  ${colors.gray}Fix: ${warn.fix}${colors.reset}\n`);
		}
	}

	// Summary
	const total = allErrors.length + allWarnings.length;
	if (total === 0) {
		console.log(`${colors.green}✅ Mismatches: No issues found${colors.reset}\n`);
	} else {
		console.log(
			`${colors.bold}Found: ${allErrors.length} error${allErrors.length !== 1 ? 's' : ''}, ` +
			`${allWarnings.length} warning${allWarnings.length !== 1 ? 's' : ''}${colors.reset}\n`
		);
	}

	// Exit with error code if errors found (warnings don't break build)
	if (allErrors.length > 0) {
		process.exit(1);
	}
}

main();
