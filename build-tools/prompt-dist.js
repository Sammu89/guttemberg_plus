/**
 * Optional distribution packager.
 *
 * After a successful build, this prompts to copy runtime artifacts into ./dist
 * (excluding sources). Answering "y" creates a fresh ./dist with compiled assets.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const copyTargets = [
	'guttemberg-plus.php',
	'uninstall.php',
	'LICENSE',
	'php',
	'includes',
	'assets/css',
	'build',
	'blocks',
];

function prompt(question) {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim());
		});
	});
}

async function prepareDist() {
	await fs.promises.rm(DIST, { recursive: true, force: true });
	await fs.promises.mkdir(DIST, { recursive: true });
}

function shouldCopy(src) {
	const rel = path.relative(ROOT, src);

	// Skip source directories within blocks (schema is the SoT; runtime uses build)
	if (rel.startsWith(`blocks${path.sep}`) && rel.includes(`${path.sep}src${path.sep}`)) {
		return false;
	}

	return true;
}

async function copyItem(item) {
	const src = path.join(ROOT, item);
	const dest = path.join(DIST, item);

	if (!fs.existsSync(src)) {
		return;
	}

	await fs.promises.cp(src, dest, {
		recursive: true,
		force: true,
		filter: shouldCopy,
	});
}

async function buildDist() {
	await prepareDist();
	for (const item of copyTargets) {
		// eslint-disable-next-line no-await-in-loop
		await copyItem(item);
	}
	console.log(`✅ Distribution folder created at ${DIST}`);
}

(async () => {
	const answer = await prompt('Create distribution folder at ./dist now? (y/N) ');
	if (!/^y(es)?$/i.test(answer)) {
		console.log('Skipping distribution packaging.');
		return;
	}
	try {
		await buildDist();
	} catch (err) {
		console.error('✗ Failed to create distribution folder:', err.message || err);
		process.exit(1);
	}
})();
