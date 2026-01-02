/**
 * Responsive CSS Attribute Validator
 *
 * Ensures responsive attributes that output CSS define cssVar + appliesTo,
 * and validates appliesTo selectors against structure schemas.
 */

const fs = require('fs');
const path = require('path');
const { getSelector } = require('./css-generator');

const ROOT_DIR = path.resolve(__dirname, '..');
const BLOCKS = ['accordion', 'tabs', 'toc'];

function loadJson(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(content);
	} catch (error) {
		if (error.code === 'ENOENT') {
			throw new Error(`Missing file: ${filePath}`);
		}
		throw new Error(`Failed to parse ${filePath}: ${error.message}`);
	}
}

function loadSchema(blockType) {
	return loadJson(path.join(ROOT_DIR, 'schemas', `${blockType}.json`));
}

function loadStructure(blockType) {
	return loadJson(path.join(ROOT_DIR, 'schemas', `${blockType}-structure.json`));
}

function normalizeAppliesTo(appliesTo) {
	if (!appliesTo) return [];
	return Array.isArray(appliesTo) ? appliesTo : [appliesTo];
}

function validateBlock(blockType) {
	const schema = loadSchema(blockType);
	const structure = loadStructure(blockType);
	const errors = [];

	if (!schema.attributes) {
		errors.push(`${blockType}: missing attributes in schema.`);
		return errors;
	}

	const elements = structure && structure.elements ? structure.elements : null;

	for (const [attrName, attr] of Object.entries(schema.attributes)) {
		// Skip validation for icon-panel macros (they use appliesToElement instead)
		if (attr.type === 'icon-panel') {
			continue;
		}

		const outputsCSS = attr.outputsCSS !== false;
		const isResponsive = attr.responsive === true;
		const hasCssVar = Boolean(attr.cssVar);
		const hasAppliesTo = Boolean(attr.appliesTo);

		if (isResponsive && outputsCSS) {
			if (!hasCssVar || !hasAppliesTo) {
				errors.push(
					`${blockType}: "${attrName}" is responsive and outputs CSS but is missing ` +
					`${!hasCssVar ? '"cssVar"' : '"appliesTo"'}.`
				);
			}
		}

		if (hasCssVar && !hasAppliesTo) {
			errors.push(
				`${blockType}: "${attrName}" defines "cssVar" but is missing "appliesTo".`
			);
		}

		if (hasAppliesTo && !hasCssVar && outputsCSS) {
			errors.push(
				`${blockType}: "${attrName}" defines "appliesTo" but is missing "cssVar".`
			);
		}

		if (hasAppliesTo) {
			const appliesToElements = normalizeAppliesTo(attr.appliesTo);

			appliesToElements.forEach((elementId) => {
				const selector = getSelector(elementId, blockType, structure);
				if (!selector) {
					const elementExists = Boolean(elements && elements[elementId]);
					const available = elements ? Object.keys(elements).join(', ') : 'n/a';
					const reason = elementExists
						? 'no className/cssSelector to resolve selector'
						: 'element not found in structure';

					errors.push(
						`${blockType}: "${attrName}" appliesTo "${elementId}" but ` +
						`getSelector() could not resolve it (${reason}). ` +
						`Available elements: [${available}].`
					);
				}
			});
		}
	}

	return errors;
}

function runValidation() {
	const allErrors = [];

	for (const blockType of BLOCKS) {
		try {
			const errors = validateBlock(blockType);
			allErrors.push(...errors);
		} catch (error) {
			allErrors.push(`${blockType}: ${error.message}`);
		}
	}

	if (allErrors.length > 0) {
		console.error('Responsive CSS attribute validation failed:');
		allErrors.forEach((err) => {
			console.error(`- ${err}`);
		});
		process.exit(1);
	}

	console.log(`Responsive CSS attribute validation passed for ${BLOCKS.length} blocks.`);
	process.exit(0);
}

runValidation();
