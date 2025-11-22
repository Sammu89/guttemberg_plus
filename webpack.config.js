const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		// Accordion block
		'blocks/accordion/index': path.resolve( __dirname, 'blocks/accordion/src/index.js' ),
		'blocks/accordion/frontend': path.resolve( __dirname, 'blocks/accordion/src/frontend.js' ),

		// Tabs block
		'blocks/tabs/index': path.resolve( __dirname, 'blocks/tabs/src/index.js' ),
		'blocks/tabs/frontend': path.resolve( __dirname, 'blocks/tabs/src/frontend.js' ),

		// TOC block
		'blocks/toc/index': path.resolve( __dirname, 'blocks/toc/src/index.js' ),

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
		rules: defaultConfig.module.rules,
	},
};
