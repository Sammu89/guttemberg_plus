/**
 * Optional distribution packager.
 *
 * After build, copy runtime artifacts from /dev to the plugin root (one level up),
 * so the root plugin folder is ready for distribution without dev sources.
 */

const fs = require( 'fs' );
const path = require( 'path' );
const readline = require( 'readline' );

const ROOT = path.resolve( __dirname, '..' );
// Place packaged output one level above the development root (no dist/ subfolder)
const TARGET_ROOT = path.resolve( ROOT, '..' );

// Always auto-confirm distribution copy after build (no prompt)
const autoYes = true;

const copyTargets = [
	'guttemberg-plus.php',
	'uninstall.php',
	'LICENSE',
	'server',    // PHP backend (was 'php' and 'includes')
	'build',     // Compiled assets
	'blocks',    // Only block.json files (filtered)
];

function prompt( question ) {
	return new Promise( ( resolve ) => {
		const rl = readline.createInterface( {
			input: process.stdin,
			output: process.stdout,
		} );
		rl.question( question, ( answer ) => {
			rl.close();
			resolve( answer.trim() );
		} );
	} );
}

async function removeExistingTargets() {
	for ( const item of copyTargets ) {
		const dest = path.join( TARGET_ROOT, item );
		// eslint-disable-next-line no-await-in-loop
		await fs.promises.rm( dest, { recursive: true, force: true } );
	}
}

function shouldCopy( src ) {
	const rel = path.relative( ROOT, src );
	const isDir = fs.lstatSync( src ).isDirectory();

	// Skip source and nested build artifacts inside block folders; allow only block.json
	if ( rel.startsWith( `blocks${ path.sep }` ) ) {
		if (
			rel.endsWith( `${ path.sep }src` ) ||
			rel.includes( `${ path.sep }src${ path.sep }` ) ||
			rel.includes( `${ path.sep }build${ path.sep }` )
		) {
			return false;
		}
		if ( ! isDir && path.basename( rel ) !== 'block.json' ) {
			return false;
		}
	}

	// Don't ship PHP test harnesses
	if (
		rel.startsWith( `server${ path.sep }` ) &&
		! isDir &&
		path.basename( rel ).startsWith( 'test-' )
	) {
		return false;
	}

	return true;
}

async function copyItem( item ) {
	const src = path.join( ROOT, item );
	const dest = path.join( TARGET_ROOT, item );

	if ( ! fs.existsSync( src ) ) {
		return;
	}

	await fs.promises.mkdir( path.dirname( dest ), { recursive: true } );

	await fs.promises.cp( src, dest, {
		recursive: true,
		force: true,
		filter: shouldCopy,
	} );
}

async function pruneEmptyDirs( dir, root ) {
	const entries = await fs.promises.readdir( dir, { withFileTypes: true } );
	for ( const entry of entries ) {
		if ( entry.isDirectory() ) {
			// eslint-disable-next-line no-await-in-loop
			await pruneEmptyDirs( path.join( dir, entry.name ), root );
		}
	}
	const refreshed = await fs.promises.readdir( dir );
	if ( refreshed.length === 0 && dir !== root ) {
		await fs.promises.rmdir( dir );
	}
}

async function buildDist() {
	await removeExistingTargets();
	for ( const item of copyTargets ) {
		// eslint-disable-next-line no-await-in-loop
		await copyItem( item );
	}
	// Clean empty dirs inside the copied targets (but not outside the plugin root)
	for ( const item of copyTargets ) {
		const dest = path.join( TARGET_ROOT, item );
		if ( fs.existsSync( dest ) && fs.lstatSync( dest ).isDirectory() ) {
			// eslint-disable-next-line no-await-in-loop
			await pruneEmptyDirs( dest, dest );
		}
	}
	console.log( `✅ Distribution copied to ${ TARGET_ROOT }` );

	// Clean up dev/build folder after successful copy
	const devBuildPath = path.join( ROOT, 'build' );
	if ( fs.existsSync( devBuildPath ) ) {
		await fs.promises.rm( devBuildPath, { recursive: true, force: true } );
		console.log( '✅ Cleaned up dev/build folder' );
	}
}

( async () => {
	const shouldBuild = autoYes
		? true
		: /^y(es)?$/i.test(
				await prompt( 'Copy distribution one level up from this folder? (y/N) ' )
		  );

	if ( ! shouldBuild ) {
		console.log( 'Skipping distribution packaging.' );
		return;
	}

	try {
		if ( autoYes ) {
			console.log( 'Auto-confirmed distribution packaging.' );
		}
		await buildDist();
	} catch ( err ) {
		console.error( '✗ Failed to create distribution folder:', err.message || err );
		process.exit( 1 );
	}
} )();
