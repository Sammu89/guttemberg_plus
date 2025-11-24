/**
 * Behavior Panel Component
 *
 * Schema-driven panel for rendering non-themeable "behavior" group attributes.
 * Handles conditional visibility with visibleIf metadata.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { PanelBody, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

// Hidden attributes that should never be rendered in sidebar
const HIDDEN_ATTRIBUTES = new Set( [
	'uniqueId',
	'blockId',
	'accordionId',
	'tocId',
	'currentTheme',
	'customizations',
	'customizationCache',
	'title',
	'content',
	'tabs',
] );

/**
 * Normalize SelectControl options to consistent format
 *
 * @param {Array} options - Options from config
 * @returns {Array} Normalized options array
 */
function normalizeOptions( options ) {
	if ( ! Array.isArray( options ) ) {
		return [];
	}

	return options.map( ( opt ) => {
		if ( typeof opt === 'string' ) {
			return {
				label: opt.charAt( 0 ).toUpperCase() + opt.slice( 1 ),
				value: opt,
			};
		}
		return opt;
	} );
}

/**
 * Convert string values to numbers
 *
 * @param {*} value - Value to convert
 * @returns {number|null} Numeric value or null
 */
function toNumericValue( value ) {
	if ( value === null || value === undefined ) {
		return null;
	}

	if ( typeof value === 'number' ) {
		return value;
	}

	if ( typeof value === 'string' ) {
		const match = value.match( /^(-?\d+(?:\.\d+)?)/ );
		return match ? parseFloat( match[ 1 ] ) : null;
	}

	return null;
}

/**
 * Behavior Panel Component
 *
 * Renders non-themeable "behavior" group attributes from schema.
 * Supports conditional visibility with visibleIf metadata.
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.schema          JSON schema with attribute definitions
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {string}   props.blockType       Block type for logging (optional)
 * @param {string}   props.title           Panel title (default: "Settings")
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 * @returns {JSX.Element|null} Rendered panel or null if no attributes
 */
export function BehaviorPanel( {
	schema = {},
	attributes = {},
	setAttributes,
	blockType = 'unknown',
	title = 'Settings',
	initialOpen = false,
} ) {
	// Validate required props
	if ( ! setAttributes ) {
		console.warn( '[BehaviorPanel] Missing required prop: setAttributes' );
		return null;
	}

	if ( ! schema || ! schema.attributes ) {
		return null;
	}

	// Filter attributes: only those in "behavior" group AND not hidden
	const behaviorAttributes = Object.entries( schema.attributes || {} )
		.filter( ( [ attrName, attrConfig ] ) => {
			return (
				attrConfig.group === 'behavior' &&
				attrConfig.themeable === false &&
				! HIDDEN_ATTRIBUTES.has( attrName )
			);
		} )
		.map( ( [ attrName, attrConfig ] ) => ( {
			name: attrName,
			...attrConfig,
		} ) );

	// Return null if no attributes to render
	if ( behaviorAttributes.length === 0 ) {
		return null;
	}

	/**
	 * Handle attribute change
	 * @param {string} attrName - Attribute name
	 * @param {*} value - New value
	 */
	const handleChange = ( attrName, value ) => {
		setAttributes( { [ attrName ]: value } );
	};

	/**
	 * Check if control should be visible
	 * @param {Object} attrConfig - Attribute configuration
	 * @returns {boolean} Whether control should render
	 */
	const isVisible = ( attrConfig ) => {
		if ( ! attrConfig.visibleIf ) {
			return true; // Always visible if no condition
		}

		const { attribute, equals } = attrConfig.visibleIf;
		const conditionValue = attributes[ attribute ];

		return conditionValue === equals;
	};

	/**
	 * Render a single control based on its configuration
	 * @param {string} attrName - Attribute name
	 * @param {Object} attrConfig - Attribute configuration
	 * @returns {JSX.Element|null} Rendered control or null
	 */
	const renderControl = ( attrName, attrConfig ) => {
		// Check visibility condition
		if ( ! isVisible( attrConfig ) ) {
			return null;
		}

		const { control, label, type, options, min, max, step, default: defaultValue } = attrConfig;
		const currentValue = attributes[ attrName ];
		const finalLabel = label || attrName;
		const controlType = control || inferControlType( type );

		switch ( controlType ) {
			case 'ToggleControl': {
				return (
					<ToggleControl
						key={ attrName }
						label={ finalLabel }
						checked={ currentValue ?? defaultValue ?? false }
						onChange={ ( value ) => handleChange( attrName, value ) }
						__nextHasNoMarginBottom
					/>
				);
			}

			case 'SelectControl': {
				const normalizedOptions = normalizeOptions( options );
				const defaultSelectValue = defaultValue ?? normalizedOptions[ 0 ]?.value ?? '';

				return (
					<SelectControl
						key={ attrName }
						label={ finalLabel }
						value={ currentValue ?? defaultSelectValue }
						options={ normalizedOptions }
						onChange={ ( value ) => handleChange( attrName, value ) }
						__next40pxDefaultSize
					/>
				);
			}

			case 'RangeControl': {
				const numericValue = toNumericValue( currentValue );
				const defaultNumericValue = toNumericValue( defaultValue );

				return (
					<RangeControl
						key={ attrName }
						label={ finalLabel }
						value={ numericValue ?? defaultNumericValue ?? 0 }
						onChange={ ( value ) => handleChange( attrName, value ) }
						min={ min ?? 0 }
						max={ max ?? 100 }
						step={ step ?? 1 }
					/>
				);
			}

			case 'TextControl': {
				return (
					<TextControl
						key={ attrName }
						label={ finalLabel }
						value={ currentValue ?? defaultValue ?? '' }
						onChange={ ( value ) => handleChange( attrName, value ) }
						__next40pxDefaultSize
					/>
				);
			}

			case 'NumberControl': {
				const numericValue = toNumericValue( currentValue );
				const defaultNumericValue = toNumericValue( defaultValue );

				return (
					<RangeControl
						key={ attrName }
						label={ finalLabel }
						value={ numericValue ?? defaultNumericValue ?? 0 }
						onChange={ ( value ) => handleChange( attrName, value ) }
						min={ min ?? 0 }
						max={ max ?? 100 }
						step={ step ?? 1 }
					/>
				);
			}

			default: {
				console.warn(
					`[BehaviorPanel] Unsupported control type "${controlType}" for attribute "${attrName}" (block: ${blockType})`
				);
				return null;
			}
		}
	};

	/**
	 * Infer control type from attribute type
	 * @param {string} type - Attribute type (boolean, string, number, etc.)
	 * @returns {string} Inferred control type
	 */
	function inferControlType( type ) {
		switch ( type ) {
			case 'boolean':
				return 'ToggleControl';
			case 'number':
				return 'RangeControl';
			case 'string':
				return 'TextControl';
			default:
				return null;
		}
	}

	return (
		<PanelBody title={ title } initialOpen={ initialOpen }>
			{ behaviorAttributes.map( ( attrConfig ) =>
				renderControl( attrConfig.name, attrConfig )
			) }
		</PanelBody>
	);
}

export default BehaviorPanel;
