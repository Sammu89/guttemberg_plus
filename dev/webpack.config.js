const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

// Quiet Sass deprecation noise (legacy JS API, @import) in build output
function silenceSassDeprecations( rules = [] ) {
	return rules.map( ( rule ) => {
		const clonedRule = { ...rule };

		// Recurse into nested rule sets (oneOf, rules)
		if ( Array.isArray( clonedRule.oneOf ) ) {
			clonedRule.oneOf = silenceSassDeprecations( clonedRule.oneOf );
		}
		if ( Array.isArray( clonedRule.rules ) ) {
			clonedRule.rules = silenceSassDeprecations( clonedRule.rules );
		}

		// Normalize use into an array of loader entries
		const uses = Array.isArray( clonedRule.use )
			? clonedRule.use
			: clonedRule.use
			? [ clonedRule.use ]
			: [];
		clonedRule.use = uses.map( ( useEntry ) => {
			if ( typeof useEntry === 'string' ) {
				// String form can't carry options; leave as-is
				return useEntry;
			}

			if ( useEntry?.loader && useEntry.loader.includes( 'sass-loader' ) ) {
				const existingOptions = useEntry.options || {};
				const existingSassOptions = existingOptions.sassOptions || {};

				return {
					...useEntry,
					options: {
						...existingOptions,
						sassOptions: {
							...existingSassOptions,
							quietDeps: true,
							silenceDeprecations: [ 'legacy-js-api', 'import' ],
						},
					},
				};
			}

			return useEntry;
		} );

		return clonedRule;
	} );
}

// Shared configuration
const sharedConfig = {
	stats: 'errors-warnings',
	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, 'build' ),
	},
	resolve: {
		alias: {
			'@shared': path.resolve( __dirname, 'shared' ),
			'@blocks': path.resolve( __dirname, 'blocks' ),
			'@assets': path.resolve( __dirname, 'assets' ),
		},
	},
	module: {
		rules: silenceSassDeprecations( defaultConfig.module.rules ),
	},
};

/**
 * Single-phase build configuration:
 * All entries build in parallel. Editor imports style.scss (source) directly.
 *
 * CSS Build Flow:
 *   {block}_variables.scss (vars + selector rules)
 *       ↓ imported by
 *   {block}_hardcoded.scss (layout CSS) → {block}.css (frontend)
 *       ↓ imported by
 *   {block}_editor.scss (editor overrides) → index.css (editor)
 */
module.exports = {
	...defaultConfig,
	...sharedConfig,
	entry: {
		// Accordion block
		'blocks/accordion/index': path.resolve( __dirname, 'blocks/accordion/index.js' ),
		'blocks/accordion/frontend': path.resolve( __dirname, 'blocks/accordion/frontend.js' ),
		'blocks/accordion/accordion': path.resolve( __dirname, 'styles/blocks/accordion/frontend.scss' ),

		// Tabs block
		'blocks/tabs/index': path.resolve( __dirname, 'blocks/tabs/index.js' ),
		'blocks/tabs/frontend': path.resolve( __dirname, 'blocks/tabs/frontend.js' ),
		'blocks/tabs/tabs': path.resolve( __dirname, 'styles/blocks/tabs/frontend.scss' ),

		// TOC block
		'blocks/toc/index': path.resolve( __dirname, 'blocks/toc/index.js' ),
		'blocks/toc/frontend': path.resolve( __dirname, 'blocks/toc/frontend.js' ),
		'blocks/toc/toc': path.resolve( __dirname, 'styles/blocks/toc/frontend.scss' ),

		// Shared infrastructure
		'shared/index': path.resolve( __dirname, 'shared/index.js' ),
	},
};
