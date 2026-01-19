/**
 * Unified Build Script for Guttemberg Plus
 *
 * This script orchestrates the entire schema generation pipeline:
 * 1. Generate comprehensive schemas from minimal schemas + HTML structure
 * 2. Generate block attributes (Phase 4 - coming soon)
 * 3. Generate CSS variables (Phase 5 - coming soon)
 *
 * @package Guttemberg Plus
 * @since 2.0.0
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Configuration
// ============================================================================

const BLOCKS = ['accordion', 'tabs', 'toc'];
const ROOT_DIR = path.resolve(__dirname, '..');

const PATHS = {
	schemas: {
		blocks: path.join(ROOT_DIR, 'schemas', 'blocks'),
		generated: path.join(ROOT_DIR, 'schemas', 'generated'),
		structures: path.join(ROOT_DIR, 'schemas'),
	},
	generators: {
		attributes: path.join(__dirname, 'generators', 'attributes.js'),
		cssVarsEditor: path.join(__dirname, 'generators', 'css-vars-editor.js'),
		cssVarsEditorJs: path.join(__dirname, 'generators', 'css-vars-editor-js.js'),
		cssVarsFrontend: path.join(__dirname, 'generators', 'css-vars-frontend.js'),
	}
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a file exists
 * @param {string} filePath - Path to check
 * @return {boolean} True if file exists
 */
function fileExists(filePath) {
	try {
		return fs.existsSync(filePath);
	} catch (err) {
		return false;
	}
}

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 */
function ensureDir(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

/**
 * Log step header
 * @param {number} stepNum - Step number
 * @param {string} description - Step description
 */
function logStep(stepNum, description) {
	console.log(`\n${'='.repeat(60)}`);
	console.log(`Step ${stepNum}: ${description}`);
	console.log('='.repeat(60));
}

/**
 * Log success message
 * @param {string} message - Success message
 */
function logSuccess(message) {
	console.log(`✓ ${message}`);
}

/**
 * Log info message
 * @param {string} message - Info message
 */
function logInfo(message) {
	console.log(`  ${message}`);
}

/**
 * Log warning message
 * @param {string} message - Warning message
 */
function logWarning(message) {
	console.log(`⚠ ${message}`);
}

/**
 * Log error message
 * @param {string} message - Error message
 */
function logError(message) {
	console.error(`✗ ${message}`);
}

// ============================================================================
// Schema Generation Pipeline
// ============================================================================

/**
 * Step 1: Generate Comprehensive Schemas
 *
 * This step loads minimal schemas and HTML structures, then uses the
 * orchestrator to generate comprehensive schemas with all metadata.
 */
async function generateComprehensiveSchemas() {
	logStep(1, 'Generating Comprehensive Schemas');

	// Load required modules
	const { parseHTMLTemplate } = require('../schemas/parsers/html-parser');
	const { mergeStructureIntoSchema } = require('../schemas/parsers/merger');
	const { createComprehensiveSchema, writeComprehensive } = require('../schemas/parsers/orchestrator');

	// Ensure output directory exists
	ensureDir(PATHS.schemas.generated);

	let successCount = 0;
	let errorCount = 0;

	for (const block of BLOCKS) {
		try {
			logInfo(`\nProcessing ${block}...`);

			// Define paths
			const minimalSchemaPath = path.join(PATHS.schemas.blocks, `${block}.json`);
			const structurePath = path.join(PATHS.schemas.structures, `${block}-structure.html`);
			const outputPath = path.join(PATHS.schemas.generated, `${block}.json`);

			// Check if minimal schema exists
			if (!fileExists(minimalSchemaPath)) {
				logError(`Minimal schema not found: ${minimalSchemaPath}`);
				errorCount++;
				continue;
			}

			// Check if structure file exists
			if (!fileExists(structurePath)) {
				logError(`Structure file not found: ${structurePath}`);
				errorCount++;
				continue;
			}

			// Load minimal schema
			const minimalSchema = JSON.parse(fs.readFileSync(minimalSchemaPath, 'utf8'));
			logInfo(`  Loaded minimal schema (${Object.keys(minimalSchema.attributes || {}).length} attributes)`);

			// Parse HTML structure
			const htmlStructure = parseHTMLTemplate(structurePath);
			logInfo(`  Parsed HTML structure (${Object.keys(htmlStructure.elements || {}).length} elements)`);

			// Merge structure into schema
			const mergedSchema = mergeStructureIntoSchema(minimalSchema, htmlStructure);
			logInfo(`  Merged schema with structure`);

			// Create comprehensive schema
			const comprehensiveSchema = createComprehensiveSchema(mergedSchema);

			// Verify structure is embedded
			if (!comprehensiveSchema.structure) {
				logWarning(`  Structure not found in comprehensive schema!`);
			} else {
				logInfo(`  Structure embedded (${Object.keys(comprehensiveSchema.structure.elements || {}).length} elements)`);
			}

			// Write comprehensive schema
			writeComprehensive(outputPath, comprehensiveSchema);

			logSuccess(`Generated comprehensive schema for ${block}`);
			logInfo(`  Total attributes: ${comprehensiveSchema._meta?.totalAttributes || 0}`);
			logInfo(`  Total CSS vars: ${comprehensiveSchema._meta?.totalCssVars || 0}`);
			logInfo(`  Output: ${path.relative(ROOT_DIR, outputPath)}`);

			successCount++;
		} catch (error) {
			logError(`Failed to generate ${block}: ${error.message}`);
			if (process.env.DEBUG) {
				console.error(error.stack);
			}
			errorCount++;
		}
	}

	// Summary
	console.log(`\n${'-'.repeat(60)}`);
	logInfo(`Processed ${BLOCKS.length} blocks: ${successCount} succeeded, ${errorCount} failed`);

	if (errorCount > 0) {
		throw new Error(`Failed to generate ${errorCount} comprehensive schema(s)`);
	}

	return successCount;
}

/**
 * Step 2: Generate Block Attributes
 *
 * This step generates block attribute files from comprehensive schemas.
 */
async function generateBlockAttributes() {
	logStep(2, 'Generating Block Attributes');

	// Check if generator exists
	if (!fileExists(PATHS.generators.attributes)) {
		logWarning('Attribute generator not found - skipping');
		logInfo(`Expected: ${PATHS.generators.attributes}`);
		logInfo('This will be implemented in Phase 4');
		return 0;
	}

	// Load generator
	const { generateAllAttributes } = require(PATHS.generators.attributes);

	// Generate attributes for all blocks
	const results = generateAllAttributes(BLOCKS, PATHS.schemas.generated);

	// Report results
	if (results.success.length > 0) {
		logInfo('');
		results.success.forEach(({ blockType, count, file }) => {
			logSuccess(`Generated ${blockType}/attributes.js (${count} attributes)`);
		});
	}

	if (results.failed.length > 0) {
		logInfo('');
		results.failed.forEach(({ blockType, error }) => {
			logError(`Failed to generate ${blockType}: ${error}`);
		});
	}

	// Summary
	console.log(`\n${'-'.repeat(60)}`);
	logInfo(`Generated ${results.success.length} attribute file(s) with ${results.totalAttributes} total attributes`);

	if (results.failed.length > 0) {
		throw new Error(`Failed to generate ${results.failed.length} attribute file(s)`);
	}

	return results.success.length;
}

/**
 * Step 3: Generate CSS Variables
 *
 * This step generates CSS variable files for editor and frontend.
 * Uses comprehensive schema as single source of truth.
 */
async function generateCssVariables() {
	logStep(3, 'Generating CSS Variables');

	let totalGenerated = 0;

	// Generate editor CSS variables (SCSS)
	if (!fileExists(PATHS.generators.cssVarsEditor)) {
		logWarning('Editor CSS vars generator not found - skipping');
		logInfo(`Expected: ${PATHS.generators.cssVarsEditor}`);
	} else {
		try {
			logInfo('\nGenerating editor CSS variables (SCSS)...');
			const { generateAllEditorCssVars } = require(PATHS.generators.cssVarsEditor);

			const stylesDir = path.join(ROOT_DIR, 'styles', 'blocks');
			const results = generateAllEditorCssVars(BLOCKS, PATHS.schemas.generated, stylesDir);

			// Report results
			if (results.success.length > 0) {
				results.success.forEach(({ blockType, varCount }) => {
					logSuccess(`Generated ${blockType}/variables.scss (${varCount} CSS vars)`);
				});
				totalGenerated += results.success.length;
			}

			if (results.failed.length > 0) {
				results.failed.forEach(({ blockType, error }) => {
					logError(`Failed to generate ${blockType}: ${error}`);
				});
			}

			logInfo(`  Total editor CSS vars: ${results.totalVars}`);
		} catch (error) {
			logError(`Editor CSS vars generation failed: ${error.message}`);
			if (process.env.DEBUG) {
				console.error(error.stack);
			}
		}
	}

	// Generate editor CSS variables (JavaScript) - for inline styles in editor
	if (!fileExists(PATHS.generators.cssVarsEditorJs)) {
		logWarning('Editor CSS vars JS generator not found - skipping');
		logInfo(`Expected: ${PATHS.generators.cssVarsEditorJs}`);
	} else {
		try {
			logInfo('\nGenerating editor CSS variables (JavaScript for inline styles)...');
			const { generateAllEditorCssVarsJs } = require(PATHS.generators.cssVarsEditorJs);

			const outputDir = path.join(ROOT_DIR, 'shared', 'styles');
			const results = generateAllEditorCssVarsJs(BLOCKS, PATHS.schemas.generated, outputDir);

			// Report results
			if (results.success.length > 0) {
				results.success.forEach(({ blockType, varCount }) => {
					logSuccess(`Generated ${blockType}-css-vars-generated.js (${varCount} CSS vars)`);
				});
				totalGenerated += results.success.length;
			}

			if (results.failed.length > 0) {
				results.failed.forEach(({ blockType, error }) => {
					logError(`Failed to generate ${blockType}: ${error}`);
				});
			}

			logInfo(`  Total editor JS CSS vars: ${results.totalVars}`);
		} catch (error) {
			logError(`Editor CSS vars JS generation failed: ${error.message}`);
			if (process.env.DEBUG) {
				console.error(error.stack);
			}
		}
	}

	// Generate frontend CSS variables (JavaScript)
	if (!fileExists(PATHS.generators.cssVarsFrontend)) {
		logWarning('Frontend CSS vars generator not found - skipping');
		logInfo(`Expected: ${PATHS.generators.cssVarsFrontend}`);
	} else {
		try {
			logInfo('\nGenerating frontend CSS variables (JavaScript)...');
			const { generateAllFrontendCssVars } = require(PATHS.generators.cssVarsFrontend);

			const outputDir = path.join(ROOT_DIR, 'shared', 'styles');
			const results = generateAllFrontendCssVars(BLOCKS, PATHS.schemas.generated, outputDir);

			// Report results
			if (results.success.length > 0) {
				results.success.forEach(({ blockType, themeableCount, nonThemeableCount }) => {
					logSuccess(`Generated ${blockType}-frontend-css-vars-generated.js (${themeableCount} themeable, ${nonThemeableCount} non-themeable)`);
				});
				totalGenerated += results.success.length;
			}

			if (results.failed.length > 0) {
				results.failed.forEach(({ blockType, error }) => {
					logError(`Failed to generate ${blockType}: ${error}`);
				});
			}

			logInfo(`  Total themeable: ${results.totalThemeable}, non-themeable: ${results.totalNonThemeable}`);
		} catch (error) {
			logError(`Frontend CSS vars generation failed: ${error.message}`);
			if (process.env.DEBUG) {
				console.error(error.stack);
			}
		}
	}

	return totalGenerated;
}

/**
 * Step 4: Generate SCSS Selector Rules
 *
 * This step generates SCSS files that apply CSS variables to DOM selectors.
 * This is the critical missing step that actually applies the variables to elements.
 */
async function generateScssRules() {
	logStep(4, 'Generating SCSS Selector Rules');

	const scssGeneratorPath = path.join(ROOT_DIR, 'schemas', 'parsers', 'expansors', 'scss-generator.js');

	if (!fileExists(scssGeneratorPath)) {
		logWarning('SCSS generator not found - skipping');
		logInfo(`Expected: ${scssGeneratorPath}`);
		return 0;
	}

	const { generateAndWriteSCSS } = require(scssGeneratorPath);

	let successCount = 0;
	let errorCount = 0;

	for (const block of BLOCKS) {
		try {
			logInfo(`\nGenerating SCSS rules for ${block}...`);

			// Load comprehensive schema
			const schemaPath = path.join(PATHS.schemas.generated, `${block}.json`);
			if (!fileExists(schemaPath)) {
				logError(`Comprehensive schema not found: ${schemaPath}`);
				errorCount++;
				continue;
			}

			const comprehensiveSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

			// Create output directory if needed
			const outputDir = path.join(ROOT_DIR, 'styles', 'blocks', block, 'generated');
			ensureDir(outputDir);

			// Generate SCSS file
			const outputPath = path.join(outputDir, 'styles-generated.scss');
			generateAndWriteSCSS(comprehensiveSchema, outputPath);

			logSuccess(`Generated ${block}/generated/styles-generated.scss`);
			logInfo(`  Output: ${path.relative(ROOT_DIR, outputPath)}`);

			successCount++;
		} catch (error) {
			logError(`Failed to generate SCSS for ${block}: ${error.message}`);
			if (process.env.DEBUG) {
				console.error(error.stack);
			}
			errorCount++;
		}
	}

	// Summary
	console.log(`\n${'-'.repeat(60)}`);
	logInfo(`Generated ${successCount} SCSS file(s), ${errorCount} failed`);

	if (errorCount > 0) {
		throw new Error(`Failed to generate ${errorCount} SCSS file(s)`);
	}

	return successCount;
}

// ============================================================================
// Main Build Pipeline
// ============================================================================

/**
 * Main build function
 */
async function build() {
	console.log('🚀 Building Guttemberg Plus Schema Pipeline\n');
	console.log(`Root: ${ROOT_DIR}`);
	console.log(`Blocks: ${BLOCKS.join(', ')}\n`);

	const startTime = Date.now();
	let totalGenerated = 0;

	try {
		// Step 1: Generate comprehensive schemas
		totalGenerated += await generateComprehensiveSchemas();

		// Step 2: Generate block attributes (Phase 4)
		totalGenerated += await generateBlockAttributes();

		// Step 3: Generate CSS variables (Phase 5)
		totalGenerated += await generateCssVariables();

		// Step 4: Generate SCSS selector rules (applies CSS vars to DOM)
		totalGenerated += await generateScssRules();

		// Success summary
		const duration = ((Date.now() - startTime) / 1000).toFixed(2);
		console.log(`\n${'='.repeat(60)}`);
		console.log('✅ Schema Build Complete!');
		console.log('='.repeat(60));
		logInfo(`Generated ${totalGenerated} file(s) in ${duration}s`);
		console.log();

	} catch (error) {
		const duration = ((Date.now() - startTime) / 1000).toFixed(2);
		console.log(`\n${'='.repeat(60)}`);
		console.log('❌ Schema Build Failed');
		console.log('='.repeat(60));
		logError(error.message);
		if (process.env.DEBUG) {
			console.error(error.stack);
		}
		console.log();
		logInfo(`Failed after ${duration}s`);
		console.log();
		process.exit(1);
	}
}

// ============================================================================
// CLI Entry Point
// ============================================================================

// Run build if executed directly
if (require.main === module) {
	build().catch(error => {
		console.error('Unhandled error:', error);
		process.exit(1);
	});
}

module.exports = {
	build,
	generateComprehensiveSchemas,
	generateBlockAttributes,
	generateCssVariables,
	generateScssRules,
};
