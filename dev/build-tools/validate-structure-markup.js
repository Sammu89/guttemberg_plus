/**
 * Validate structure schema selectors/classes against rendered markup.
 *
 * For each block, ensure that every element defined in the structure schema
 * (that has a className) is present in the class names emitted by save.js/frontend.js.
 * Fails build if any structure class is not found in markup.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOCKS = ['accordion', 'tabs', 'toc'];

const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function loadStructure(block) {
	const p = path.join(ROOT, 'schemas', `${block}-structure.json`);
	if (!fs.existsSync(p)) return null;
	return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
	const errors = [];
	const warnings = [];

	BLOCKS.forEach((block) => {
		const structure = loadStructure(block);
		if (!structure || !structure.elements) {
			return;
		}

		const files = ['save.js', 'frontend.js']
			.map((f) => path.join(ROOT, 'blocks', block, 'src', f))
			.filter((p) => fs.existsSync(p));
		const codeCombined = files.map((p) => fs.readFileSync(p, 'utf8')).join('\n');
		const editorPath = path.join(ROOT, 'blocks', block, 'src', 'edit.js');
		const editorCode = fs.existsSync(editorPath) ? fs.readFileSync(editorPath, 'utf8') : '';

		Object.values(structure.elements).forEach((el) => {
			if (!el.className) return;
			const firstClass = el.className.split(/\s+/)[0];
			if (!codeCombined.includes(firstClass)) {
				errors.push({
					block,
					element: el.id || '(unknown)',
					className: firstClass,
				});
			}

			// Editor check: warn (not fail) if editor markup is missing structure class
			if (editorCode && !editorCode.includes(firstClass)) {
				warnings.push({
					block,
					element: el.id || '(unknown)',
					className: firstClass,
				});
			}
		});
	});

	if (errors.length > 0) {
		console.error(`\n${colors.red}${colors.bold}✗ Structure/markup validation failed${colors.reset}\n`);
		errors.forEach((err) => {
			console.error(
				`  ${colors.red}${err.block}${colors.reset}: element "${err.element}" expects class "${err.className}" not found in save/frontend markup`
			);
		});
		process.exit(1);
	}

	console.log(`${colors.green}${colors.bold}✓ Structure matches markup classes${colors.reset}`);

	if (warnings.length > 0) {
		console.log(`\n${colors.yellow}${colors.bold}⚠ Editor markup warnings${colors.reset}\n`);
		warnings.forEach((w) => {
			console.log(
				`  ${colors.yellow}${w.block}${colors.reset}: element "${w.element}" expects class "${w.className}" not found in edit.js markup`
			);
		});
	}
}

main();
