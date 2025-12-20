/**
 * Rename CSS Files Post-Build Script
 *
 * This script runs after webpack build and renames the style-index.css files
 * to block-specific names (accordion.css, tabs.css, toc.css) to match the
 * new naming convention.
 *
 * @since 1.0.0
 */

const fs = require( 'fs' );
const path = require( 'path' );

const BLOCKS = [
	{
		oldName: 'style-accordion.css',
		newName: 'accordion.css',
		dir: 'accordion',
	},
	{
		oldName: 'style-tabs.css',
		newName: 'tabs.css',
		dir: 'tabs',
	},
	{
		oldName: 'style-toc.css',
		newName: 'toc.css',
		dir: 'toc',
	},
];

/**
 * Rename a file if it exists
 *
 * @param {string} oldPath - Path to the old file
 * @param {string} newPath - Path to the new file
 * @returns {boolean} - True if rename was successful
 */
function renameFile( oldPath, newPath ) {
	if ( ! fs.existsSync( oldPath ) ) {
		return false;
	}

	try {
		fs.renameSync( oldPath, newPath );
		return true;
	} catch ( error ) {
		console.error(
			`✗ Error renaming file: ${ oldPath }`,
			error.message
		);
		return false;
	}
}

/**
 * Main execution
 */
function main() {
	let successCount = 0;
	let skipCount = 0;

	BLOCKS.forEach( ( block ) => {
		const oldPath = path.resolve(
			__dirname,
			`../build/blocks/${ block.dir }/${ block.oldName }`
		);
		const newPath = path.resolve(
			__dirname,
			`../build/blocks/${ block.dir }/${ block.newName }`
		);

		if ( renameFile( oldPath, newPath ) ) {
			successCount++;
		} else {
			skipCount++;
		}
	} );

	// Only output if something happened
	if ( successCount > 0 ) {
		console.log( `✅ CSS renamed: ${successCount} files` );
	}
}

main();
