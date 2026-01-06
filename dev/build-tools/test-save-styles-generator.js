/**
 * Test Script for Save.js Style Injector Generator
 *
 * Demonstrates the save-styles-injector generator by:
 * 1. Loading accordion schema
 * 2. Generating the getCustomizationStyles function
 * 3. Displaying formatted output with usage instructions
 *
 * Run: node build-tools/test-save-styles-generator.js
 *
 * @package
 * @since 1.0.0
 */

const fs = require( 'fs' );
const path = require( 'path' );
const { generateSample } = require( './generators/save-styles-injector' );

// Load accordion schema
const schemaPath = path.join( __dirname, '..', 'schemas', 'accordion.json' );
const accordionSchema = JSON.parse( fs.readFileSync( schemaPath, 'utf8' ) );

// Generate and display sample
console.log( generateSample( accordionSchema, 'accordion' ) );

// Also generate for tabs and toc
const tabsSchemaPath = path.join( __dirname, '..', 'schemas', 'tabs.json' );
const tabsSchema = JSON.parse( fs.readFileSync( tabsSchemaPath, 'utf8' ) );

const tocSchemaPath = path.join( __dirname, '..', 'schemas', 'toc.json' );
const tocSchema = JSON.parse( fs.readFileSync( tocSchemaPath, 'utf8' ) );

console.log( '\n\n' );
console.log( generateSample( tabsSchema, 'tabs' ) );

console.log( '\n\n' );
console.log( generateSample( tocSchema, 'toc' ) );
