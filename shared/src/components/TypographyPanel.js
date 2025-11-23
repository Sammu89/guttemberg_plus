/**
 * Typography Panel Component
 *
 * Configuration-driven panel for typography customization.
 * Renders controls dynamically based on config.attributes.
 * Shows effective values via cascade resolution.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import { PanelBody, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';

/**
 * Normalize SelectControl options to consistent format
 * Handles both simple string arrays and object arrays
 *
 * @param {Array} options - Options from config (can be strings or objects)
 * @returns {Array} Normalized options array with { label, value } objects
 */
function normalizeOptions( options ) {
	if ( ! Array.isArray( options ) ) {
		return [];
	}

	return options.map( ( opt ) => {
		if ( typeof opt === 'string' ) {
			// Simple string: use capitalized version as label
			return {
				label: opt.charAt( 0 ).toUpperCase() + opt.slice( 1 ),
				value: opt,
			};
		}
		// Already an object with label/value
		return opt;
	} );
}

/**
 * Convert string values to numbers for numeric controls
 * Handles values like "18px", "1.6", etc.
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
 * Typography Panel Component
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.effectiveValues All effective values from cascade
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {Object}   props.config          Configuration object with attributes to render
 * @param {Array}    props.config.attributes Array of attribute names to render
 * @param {Object}   props.config.controlConfigs Control configs keyed by attribute name
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 * @param {string}   props.title           Panel title (default: "Typography")
 */
export function TypographyPanel( {
	effectiveValues = {},
	attributes = {},
	setAttributes,
	config = {},
	theme,
	cssDefaults = {},
	initialOpen = false,
	title = 'Typography',
} ) {
	const { attributes: attrList = [], controlConfigs = {} } = config;

	/**
	 * Handle attribute change
	 * Writes directly to attribute (sidebar is source of truth)
	 *
	 * @param {string} attrName - Attribute name
	 * @param {*} value - New value
	 */
	const handleChange = ( attrName, value ) => {
		if ( setAttributes ) {
			setAttributes( { [ attrName ]: value } );
		}
	};

	/**
	 * Check if attribute is customized (compares against both theme and CSS defaults)
	 *
	 * @param {string} attrName - Attribute name
	 * @returns {boolean} Whether attribute is customized
	 */
	const isAttrCustomized = ( attrName ) => {
		return isCustomizedFromDefaults( attrName, attributes, theme, cssDefaults );
	};

	/**
	 * Label with customization badge
	 *
	 * @param {Object} props - Component props
	 * @param {string} props.label - Label text
	 * @param {string} props.attrName - Attribute name for customization check
	 */
	const CustomLabel = ( { label, attrName } ) => (
		<span>
			{ label }
			{ isAttrCustomized( attrName ) && (
				<span className="customization-badge"> (Customized)</span>
			) }
		</span>
	);

	/**
	 * Render a single control based on its configuration
	 *
	 * @param {string} attrName - Attribute name
	 * @param {Object} controlConfig - Control configuration from schema
	 * @returns {JSX.Element|null} The rendered control or null
	 */
	const renderControl = ( attrName, controlConfig ) => {
		if ( ! controlConfig ) {
			return null;
		}

		const { control, label, options, min, max, step } = controlConfig;
		const effectiveValue = effectiveValues[ attrName ];

		switch ( control ) {
			case 'RangeControl': {
				// Convert string values like "18px" to numbers
				const numericValue = toNumericValue( effectiveValue );
				const defaultNumericValue = toNumericValue( controlConfig.default );

				return (
					<RangeControl
						key={ attrName }
						label={ <CustomLabel label={ label } attrName={ attrName } /> }
						value={ numericValue ?? defaultNumericValue ?? 0 }
						onChange={ ( value ) => handleChange( attrName, value ) }
						min={ min ?? 0 }
						max={ max ?? 100 }
						step={ step ?? 1 }
					/>
				);
			}

			case 'SelectControl': {
				const normalizedOptions = normalizeOptions( options );
				const defaultValue = controlConfig.default ?? normalizedOptions[ 0 ]?.value ?? '';

				return (
					<SelectControl
						key={ attrName }
						label={ <CustomLabel label={ label } attrName={ attrName } /> }
						value={ effectiveValue ?? defaultValue }
						options={ normalizedOptions }
						onChange={ ( value ) => handleChange( attrName, value ) }
						__next40pxDefaultSize
					/>
				);
			}

			case 'TextControl': {
				return (
					<TextControl
						key={ attrName }
						label={ <CustomLabel label={ label } attrName={ attrName } /> }
						value={ effectiveValue ?? controlConfig.default ?? '' }
						onChange={ ( value ) => handleChange( attrName, value ) }
						__next40pxDefaultSize
					/>
				);
			}

			case 'ToggleControl': {
				return (
					<ToggleControl
						key={ attrName }
						label={ <CustomLabel label={ label } attrName={ attrName } /> }
						checked={ effectiveValue ?? controlConfig.default ?? false }
						onChange={ ( value ) => handleChange( attrName, value ) }
						__nextHasNoMarginBottom
					/>
				);
			}

			case 'FontFamilyControl': {
				// FontFamilyControl could be a custom component or fallback to TextControl
				// For now, render as TextControl until FontFamilyControl is implemented
				return (
					<TextControl
						key={ attrName }
						label={ <CustomLabel label={ label } attrName={ attrName } /> }
						value={ effectiveValue ?? controlConfig.default ?? '' }
						onChange={ ( value ) => handleChange( attrName, value ) }
						__next40pxDefaultSize
					/>
				);
			}

			default:
				// Unknown control type - skip or log warning
				console.warn( `TypographyPanel: Unknown control type "${ control }" for attribute "${ attrName }"` );
				return null;
		}
	};

	// If no attributes configured, show nothing
	if ( ! attrList.length ) {
		return null;
	}

	return (
		<PanelBody title={ title } initialOpen={ initialOpen }>
			{ attrList.map( ( attrName ) => {
				const controlConfig = controlConfigs[ attrName ];
				return renderControl( attrName, controlConfig );
			} ) }
		</PanelBody>
	);
}

export default TypographyPanel;
