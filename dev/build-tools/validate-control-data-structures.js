#!/usr/bin/env node

/**
 * Control Data Structure Validator
 *
 * Validates that all control components:
 * 1. Have DATA STRUCTURE EXPECTATIONS documentation
 * 2. Follow standardized data handling patterns
 * 3. Use consistent prop names (value/values, onChange, responsive)
 * 4. Document their onChange callback signature
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	cyan: '\x1b[36m',
};

const sharedDir = path.join(__dirname, '../shared/src/components/controls');

/**
 * Key controls that MUST have data structure documentation
 */
const CRITICAL_CONTROLS = [
	'SliderWithInput.js',
	'full/SpacingControl.js',
	'ColorControl.js',
	'full/BorderPanel.js',
	'full/BorderRadiusControl.js',
	'full/ShadowPanel.js',
	'AlignmentControl.js',
	'FontFamilyControl.js',
	'AppearanceControl.js',
];

/**
 * Standard prop names that controls should use
 */
const STANDARD_PROPS = {
	value: ['value', 'values'], // Single value or responsive values
	onChange: ['onChange'],
	responsive: ['responsive'],
	defaultValue: ['defaultValue'],
};

/**
 * Data patterns to detect
 */
const DATA_PATTERNS = {
	SCALAR: 'SCALAR pattern', // Single value: number, string, { value, unit }
	BOX: 'BOX pattern', // 4-sided: { top, right, bottom, left, unit }
	STRING: 'SIMPLE STRING pattern', // Plain string
	OBJECT: 'OBJECT pattern', // Complex object
};

const errors = [];
const warnings = [];
const info = [];

/**
 * Check if file has DATA STRUCTURE EXPECTATIONS section
 */
function hasDataStructureDoc(content) {
	return content.includes('DATA STRUCTURE EXPECTATIONS');
}

/**
 * Extract data pattern from documentation
 */
function extractDataPattern(content) {
	for (const [key, pattern] of Object.entries(DATA_PATTERNS)) {
		if (content.includes(pattern)) {
			return key;
		}
	}
	return null;
}

/**
 * Check onChange callback signature documentation
 */
function hasOnChangeDoc(content) {
	return content.includes('onChange callback signature');
}

/**
 * Check responsive mode documentation
 */
function hasResponsiveDoc(content) {
	// Check for either "RESPONSIVE MODE" or "NOT RESPONSIVE"
	return content.includes('RESPONSIVE MODE') || content.includes('NOT RESPONSIVE');
}

/**
 * Extract export function name from content
 */
function extractFunctionName(content) {
	const match = content.match(/export\s+function\s+(\w+)\s*\(/);
	return match ? match[1] : null;
}

/**
 * Check prop destructuring for standard patterns
 */
function checkPropPattern(content, functionName) {
	const issues = [];

	// Find the function definition
	const functionRegex = new RegExp(
		`export\\s+function\\s+${functionName}\\s*\\(\\s*\\{([^}]+)\\}`,
		's'
	);
	const match = content.match(functionRegex);

	if (!match) {
		return issues;
	}

	const props = match[1];

	// Check for value/values
	const hasValue = props.includes('value');
	const hasValues = props.includes('values');

	if (hasValue && hasValues) {
		// Both are fine (responsive control)
	} else if (!hasValue && !hasValues) {
		issues.push('Missing value/values prop');
	}

	// Check for onChange
	if (!props.includes('onChange')) {
		issues.push('Missing onChange prop');
	}

	return issues;
}

/**
 * Recursively find all JS files in a directory
 */
function findJSFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			findJSFiles(filePath, fileList);
		} else if (file.endsWith('.js') && !file.includes('.test.')) {
			fileList.push(filePath);
		}
	});

	return fileList;
}

/**
 * Validate a single control file
 */
function validateControl(filePath) {
	const relativePath = path.relative(sharedDir, filePath);
	const isCritical = CRITICAL_CONTROLS.includes(relativePath);
	const content = fs.readFileSync(filePath, 'utf-8');
	const functionName = extractFunctionName(content);

	if (!functionName) {
		// Not a component file, skip
		return;
	}

	const hasDoc = hasDataStructureDoc(content);
	const pattern = extractDataPattern(content);
	const hasChangeDoc = hasOnChangeDoc(content);
	const hasRespDoc = hasResponsiveDoc(content);
	const propIssues = checkPropPattern(content, functionName);

	// Critical controls MUST have documentation
	if (isCritical && !hasDoc) {
		errors.push({
			file: relativePath,
			issue: 'Missing DATA STRUCTURE EXPECTATIONS documentation',
			fix: 'Add comprehensive data structure documentation block',
		});
	}

	// If it has doc, check completeness
	if (hasDoc) {
		if (!pattern) {
			warnings.push({
				file: relativePath,
				issue: 'Has DATA STRUCTURE doc but missing pattern declaration (SCALAR/BOX/STRING)',
				fix: 'Declare the data pattern clearly',
			});
		}

		if (!hasChangeDoc) {
			warnings.push({
				file: relativePath,
				issue: 'Missing onChange callback signature documentation',
				fix: 'Document the onChange callback signature',
			});
		}

		if (!hasRespDoc) {
			warnings.push({
				file: relativePath,
				issue: 'Missing responsive mode documentation',
				fix: 'Document whether control supports responsive mode',
			});
		}

		// Info: Successfully documented
		info.push({
			file: relativePath,
			pattern: pattern || 'UNDECLARED',
			complete: pattern && hasChangeDoc && hasRespDoc,
		});
	}

	// Check prop patterns
	if (propIssues.length > 0) {
		warnings.push({
			file: relativePath,
			issue: `Non-standard prop usage: ${propIssues.join(', ')}`,
			fix: 'Use standard prop names: value/values, onChange, responsive',
		});
	}
}

/**
 * Main validation
 */
function main() {
	console.log(`\n${colors.cyan}${colors.bold}Control Data Structure Validation${colors.reset}\n`);

	const allFiles = findJSFiles(sharedDir);

	console.log(`${colors.dim}Checking ${allFiles.length} control files...${colors.reset}\n`);

	allFiles.forEach(validateControl);

	// Display results
	if (errors.length > 0) {
		console.log(`${colors.red}${colors.bold}❌ ERRORS (${errors.length}):${colors.reset}\n`);
		errors.forEach((err, idx) => {
			console.log(`  ${idx + 1}. ${colors.red}${err.file}${colors.reset}`);
			console.log(`     ${colors.dim}Issue:${colors.reset} ${err.issue}`);
			console.log(`     ${colors.dim}Fix:${colors.reset} ${err.fix}\n`);
		});
	}

	if (warnings.length > 0) {
		console.log(`${colors.yellow}${colors.bold}⚠️  WARNINGS (${warnings.length}):${colors.reset}\n`);
		warnings.forEach((warn, idx) => {
			console.log(`  ${idx + 1}. ${colors.yellow}${warn.file}${colors.reset}`);
			console.log(`     ${colors.dim}Issue:${colors.reset} ${warn.issue}`);
			console.log(`     ${colors.dim}Fix:${colors.reset} ${warn.fix}\n`);
		});
	}

	if (info.length > 0) {
		console.log(`${colors.green}${colors.bold}✓ DOCUMENTED CONTROLS (${info.length}):${colors.reset}\n`);
		info.forEach(item => {
			const status = item.complete ? '✓' : '○';
			const color = item.complete ? colors.green : colors.yellow;
			console.log(`  ${color}${status}${colors.reset} ${item.file} ${colors.dim}(${item.pattern})${colors.reset}`);
		});
		console.log();
	}

	// Summary
	console.log(`${colors.bold}Summary:${colors.reset}`);
	console.log(`  Critical controls: ${colors.cyan}${CRITICAL_CONTROLS.length}${colors.reset}`);
	console.log(`  Documented controls: ${colors.green}${info.length}${colors.reset}`);
	console.log(`  Complete documentation: ${colors.green}${info.filter(i => i.complete).length}${colors.reset}`);
	console.log(`  Errors: ${colors.red}${errors.length}${colors.reset}`);
	console.log(`  Warnings: ${colors.yellow}${warnings.length}${colors.reset}\n`);

	// Exit code
	if (errors.length > 0) {
		console.log(`${colors.red}${colors.bold}Validation failed!${colors.reset}`);
		console.log(`${colors.dim}Fix critical errors before proceeding.${colors.reset}\n`);
		process.exit(1);
	} else if (warnings.length > 0) {
		console.log(`${colors.yellow}${colors.bold}⚠️  Non-critical issues found${colors.reset}`);
		console.log(`${colors.dim}Consider addressing warnings for better standardization.${colors.reset}\n`);
		process.exit(0);
	} else {
		console.log(`${colors.green}${colors.bold}✅ All controls properly documented!${colors.reset}\n`);
		process.exit(0);
	}
}

main();
