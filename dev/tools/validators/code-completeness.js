/**
 * Generated Code Completeness Validator
 *
 * Validates that auto-generated code in save.js and edit.js contains all required
 * elements and attributes from the structure mapping.
 *
 * CRITICAL CHECKS:
 * 1. All structure elements appear in generated sections
 * 2. All attribute references in structure are accessed in code
 * 3. All variations (iconPosition, headingLevel) are handled
 * 4. Generated code matches mode (save vs edit - RichText.Content vs RichText)
 * 5. No missing conditional branches
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');

const BLOCKS_DIR = path.join(__dirname, '../../blocks');
const SCHEMAS_DIR = path.join(__dirname, '../../schemas');

/**
 * Extract content between AUTO-GENERATED markers
 */
function extractGeneratedCode(fileContent, markerName) {
	const startMarker = `/* ========== AUTO-GENERATED-${markerName}-START ========== */`;
	const endMarker = `/* ========== AUTO-GENERATED-${markerName}-END ========== */`;

	const startIdx = fileContent.indexOf(startMarker);
	const endIdx = fileContent.indexOf(endMarker);

	if (startIdx === -1 || endIdx === -1) {
		return null;
	}

	return fileContent.substring(startIdx, endIdx + endMarker.length);
}

/**
 * Check if element is part of a slot template rendered via InnerBlocks
 */
function isElementInSlotTemplate(elementId, structureMapping, fileContent) {
	if (!structureMapping.structure || !structureMapping.structure.slots) {
		return false;
	}

	// Check if element appears in any slot template
	for (const [slotName, slotDef] of Object.entries(structureMapping.structure.slots)) {
		if (slotDef.content && slotDef.content.includes(`data-el="${elementId}"`)) {
			// Check if the file uses InnerBlocks to render this slot
			// If so, the element will be rendered by child blocks, not directly
			if (fileContent.includes('InnerBlocks')) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Check if element is rendered in code section
 */
function isElementInCode(code, elementId, elementDef, fullFileContent = null) {
	if (!code) return false;

	// Special handling for slot elements - they become InnerBlocks in React
	if (elementDef.isSlot || elementDef.tag === 'slot') {
		// Slots map to InnerBlocks (edit) or InnerBlocks.Content (save)
		return code.includes('InnerBlocks');
	}

	// Check by className
	if (elementDef.classes && elementDef.classes.length > 0) {
		const classPattern = elementDef.classes[0]; // Primary class
		if (code.includes(classPattern)) {
			return true;
		}
		// Also check full file for root elements (class may be applied via blockProps)
		if (fullFileContent && fullFileContent.includes(classPattern)) {
			return true;
		}
	}

	// Check by element ID reference (camelCase or kebab-case)
	const patterns = [
		elementId,
		elementId.replace(/([A-Z])/g, '-$1').toLowerCase(), // camelCase to kebab
	];

	return patterns.some(pattern => code.includes(pattern));
}

/**
 * Extract all attribute references from structure mapping
 */
function extractStructureAttributeRefs(structureMapping) {
	const refs = new Set();

	// Check variations
	if (structureMapping.structure && structureMapping.structure.variations) {
		Object.values(structureMapping.structure.variations).forEach(variation => {
			if (variation.switchOn) {
				refs.add(variation.switchOn);
			}
			// Check cases for attribute refs
			if (variation.cases) {
				Object.values(variation.cases).forEach(caseData => {
					// Cases might reference attributes in their structure
					if (caseData.attribute) {
						refs.add(caseData.attribute);
					}
				});
			}
		});
	}

	// Check conditions
	if (structureMapping.structure && structureMapping.structure.conditions) {
		Object.values(structureMapping.structure.conditions).forEach(condition => {
			if (condition.if) {
				// Extract attribute from condition like "headingLevel !== 'none'"
				const attrMatch = condition.if.match(/(\w+)\s*[!=<>]/);
				if (attrMatch) {
					refs.add(attrMatch[1]);
				}
			}
		});
	}

	return refs;
}

/**
 * Check if code properly handles mode-specific wrappers
 */
function validateModeSpecificCode(code, mode, elementId, elementDef) {
	const errors = [];

	// Check RichText usage
	if (elementId.includes('Text') || elementId.includes('title')) {
		if (mode === 'save') {
			// Should use RichText.Content
			if (code.includes('<RichText ') && !code.includes('<RichText.Content')) {
				errors.push(`Element "${elementId}" uses <RichText> instead of <RichText.Content> in save.js`);
			}
		} else if (mode === 'edit') {
			// Should use RichText with onChange
			if (code.includes('<RichText.Content')) {
				errors.push(`Element "${elementId}" uses <RichText.Content> instead of <RichText> in edit.js`);
			}
			if (code.includes('<RichText') && !code.includes('onChange')) {
				errors.push(`Element "${elementId}" uses <RichText> without onChange in edit.js`);
			}
		}
	}

	// Check InnerBlocks usage
	if (elementId.includes('Slot') || elementId.includes('content')) {
		if (mode === 'save') {
			// Should use InnerBlocks.Content
			if (code.includes('<InnerBlocks ') && !code.includes('<InnerBlocks.Content')) {
				errors.push(`Element "${elementId}" uses <InnerBlocks> instead of <InnerBlocks.Content> in save.js`);
			}
		} else if (mode === 'edit') {
			// Should use InnerBlocks (no .Content)
			if (code.includes('<InnerBlocks.Content')) {
				errors.push(`Element "${elementId}" uses <InnerBlocks.Content> instead of <InnerBlocks> in edit.js`);
			}
		}
	}

	return errors;
}

/**
 * Validate a single file's generated code
 */
function validateGeneratedFile(blockType, mode) {
	const errors = [];
	const warnings = [];

	const fileName = mode === 'save' ? 'save.js' : 'edit.js';
	const filePath = path.join(BLOCKS_DIR, blockType, fileName);

	if (!fs.existsSync(filePath)) {
		errors.push(`File not found: ${filePath}`);
		return { errors, warnings };
	}

	const fileContent = fs.readFileSync(filePath, 'utf8');

	// Load structure mapping
	const structurePath = path.join(SCHEMAS_DIR, `${blockType}-structure-mapping-autogenerated.json`);
	if (!fs.existsSync(structurePath)) {
		warnings.push(`No structure mapping found for ${blockType}`);
		return { errors, warnings };
	}

	const structureMapping = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

	// Extract generated sections
	const renderTitleCode = extractGeneratedCode(fileContent, 'RENDER-TITLE');
	const blockContentCode = extractGeneratedCode(fileContent, 'BLOCK-CONTENT');

	if (!renderTitleCode && !blockContentCode) {
		errors.push(`No AUTO-GENERATED sections found in ${fileName}`);
		return { errors, warnings };
	}

	const allGeneratedCode = (renderTitleCode || '') + (blockContentCode || '');

	// ============================================================
	// VALIDATION 1: All structure elements are rendered
	// ============================================================

	if (structureMapping.structure && structureMapping.structure.elements) {
		Object.entries(structureMapping.structure.elements).forEach(([elementId, elementDef]) => {
			// Skip panel elements in edit.js (they're save-only)
			if (mode === 'edit' && elementId.includes('panel')) {
				return;
			}

			// Skip elements that are in slot templates rendered via InnerBlocks (e.g., tabPanel in tabs block)
			if (isElementInSlotTemplate(elementId, structureMapping, fileContent)) {
				return;
			}

			if (!isElementInCode(allGeneratedCode, elementId, elementDef, fileContent)) {
				errors.push(`Element "${elementId}" from structure mapping NOT found in generated ${fileName} code`);
			}

			// Check mode-specific usage
			const modeErrors = validateModeSpecificCode(allGeneratedCode, mode, elementId, elementDef);
			errors.push(...modeErrors);
		});
	}

	// ============================================================
	// VALIDATION 2: All variation cases are handled
	// ============================================================

	if (structureMapping.structure && structureMapping.structure.variations) {
		Object.entries(structureMapping.structure.variations).forEach(([variationName, variation]) => {
			if (!variation.switchOn) return;

			const switchAttr = variation.switchOn;

			// Check if switch attribute is accessed
			if (!allGeneratedCode.includes(switchAttr)) {
				errors.push(`Variation "${variationName}" switches on "${switchAttr}" but attribute not accessed in ${fileName}`);
			}

			// Check if all cases are handled
			if (variation.cases) {
				Object.keys(variation.cases).forEach(caseValue => {
					// Look for case handling (if/else or switch statement)
					const casePatterns = [
						`${switchAttr} === '${caseValue}'`,
						`${switchAttr} === "${caseValue}"`,
						`case '${caseValue}'`,
						`case "${caseValue}"`,
					];

					const caseHandled = casePatterns.some(pattern => allGeneratedCode.includes(pattern));
					if (!caseHandled) {
						warnings.push(`Variation "${variationName}" case "${caseValue}" might not be handled in ${fileName}`);
					}
				});
			}
		});
	}

	// ============================================================
	// VALIDATION 3: All conditions are checked
	// ============================================================

	if (structureMapping.structure && structureMapping.structure.conditions) {
		Object.entries(structureMapping.structure.conditions).forEach(([conditionId, condition]) => {
			if (!condition.if) return;

			// Extract condition expression
			const conditionExpr = condition.if;

			// Check if condition is evaluated in code
			if (!allGeneratedCode.includes(conditionExpr)) {
				// Try to find the attribute being checked
				const attrMatch = conditionExpr.match(/(\w+)\s*[!=<>]/);
				if (attrMatch) {
					const attr = attrMatch[1];
					if (!allGeneratedCode.includes(attr)) {
						errors.push(`Condition "${conditionId}" checks "${attr}" but attribute not found in ${fileName}`);
					}
				}
			}
		});
	}

	// ============================================================
	// VALIDATION 4: Required attribute accesses
	// ============================================================

	const requiredAttrs = extractStructureAttributeRefs(structureMapping);

	requiredAttrs.forEach(attr => {
		if (!allGeneratedCode.includes(attr)) {
			errors.push(`Structure mapping references attribute "${attr}" but it's NOT accessed in generated ${fileName} code`);
		}
	});

	return { errors, warnings };
}

/**
 * Validate all blocks
 */
function validateAll(options = {}) {
	const { warnOnly = false } = options;
	const blocks = ['accordion', 'tabs', 'toc'];
	const modes = ['save', 'edit'];

	console.log('\n╔════════════════════════════════════════════════════════════╗');
	console.log('║  Generated Code Completeness Validation                   ║');
	console.log('╚════════════════════════════════════════════════════════════╝\n');

	let totalErrors = 0;
	let totalWarnings = 0;
	let allPassed = true;

	blocks.forEach(blockType => {
		let blockErrors = 0;
		let blockWarnings = 0;

		console.log(`\n📦 ${blockType.toUpperCase()}`);
		console.log('─'.repeat(60));

		modes.forEach(mode => {
			const { errors, warnings } = validateGeneratedFile(blockType, mode);

			if (errors.length > 0) {
				allPassed = false;
				console.log(`\n❌ ${mode}.js - ${errors.length} ERRORS:`);
				errors.forEach((err, i) => {
					console.log(`   ${i + 1}. ${err}`);
				});
				blockErrors += errors.length;
				totalErrors += errors.length;
			}

			if (warnings.length > 0) {
				console.log(`\n⚠️  ${mode}.js - ${warnings.length} WARNINGS:`);
				warnings.forEach((warn, i) => {
					console.log(`   ${i + 1}. ${warn}`);
				});
				blockWarnings += warnings.length;
				totalWarnings += warnings.length;
			}

			if (errors.length === 0 && warnings.length === 0) {
				console.log(`✅ ${mode}.js: All elements and attributes complete`);
			}
		});
	});

	console.log('\n' + '═'.repeat(60));
	console.log(`📊 SUMMARY: ${totalErrors} errors, ${totalWarnings} warnings`);
	console.log('═'.repeat(60) + '\n');

	if (warnOnly) {
		console.log('⚠️  WARN-ONLY MODE: Validation issues will not block build\n');
		return { totalErrors, totalWarnings };
	}

	if (!allPassed) {
		console.log('❌ VALIDATION FAILED\n');
		process.exit(1);
	} else if (totalWarnings > 0) {
		console.log('⚠️  VALIDATION PASSED WITH WARNINGS\n');
	} else {
		console.log('✅ ALL VALIDATIONS PASSED\n');
	}

	return { totalErrors, totalWarnings };
}

// Run if called directly
if (require.main === module) {
	const warnOnly = process.argv.includes('--warn-only');
	validateAll({ warnOnly });
}

module.exports = { validateGeneratedFile, validateAll };
