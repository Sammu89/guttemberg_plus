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
		const uses = Array.isArray( clonedRule.use ) ? clonedRule.use : clonedRule.use ? [ clonedRule.use ] : [];
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

module.exports = {
	...defaultConfig,
	entry: {
		// Accordion block
		'blocks/accordion/index': path.resolve( __dirname, 'blocks/accordion/src/index.js' ),
		'blocks/accordion/frontend': path.resolve( __dirname, 'blocks/accordion/src/frontend.js' ),
		'blocks/accordion/accordion': path.resolve( __dirname, 'blocks/accordion/src/style.scss' ),

		// Tabs block
		'blocks/tabs/index': path.resolve( __dirname, 'blocks/tabs/src/index.js' ),
		'blocks/tabs/frontend': path.resolve( __dirname, 'blocks/tabs/src/frontend.js' ),
		'blocks/tabs/tabs': path.resolve( __dirname, 'blocks/tabs/src/style.scss' ),

		// TOC block
		'blocks/toc/index': path.resolve( __dirname, 'blocks/toc/src/index.js' ),
		'blocks/toc/frontend': path.resolve( __dirname, 'blocks/toc/src/frontend.js' ),
		'blocks/toc/toc': path.resolve( __dirname, 'blocks/toc/src/style.scss' ),

		// Shared infrastructure
		'shared/index': path.resolve( __dirname, 'shared/src/index.js' ),
	},
	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, 'build' ),
	},
	resolve: {
		alias: {
			'@shared': path.resolve( __dirname, 'shared/src' ),
			'@blocks': path.resolve( __dirname, 'blocks' ),
			'@assets': path.resolve( __dirname, 'assets' ),
		},
	},
	module: {
		rules: silenceSassDeprecations( defaultConfig.module.rules ),
	},
};
