/**
 * Header Colors Panel Component
 *
 * Configuration-driven panel for header/title color customization.
 * Renders controls dynamically based on the provided config.attributes.
 *
 * @package
 * @since 1.0.0
 */

import { PanelBody } from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { normalizeValueForControl } from '../theme-system/control-normalizer';
import { CompactColorControl } from './CompactColorControl';

/**
 * Header Colors Panel Component
 *
 * A generic, configuration-driven panel that renders color controls
 * based on the provided config. The component doesn't need to know
 * which block it's for - the config tells it everything.
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.effectiveValues All effective values from cascade
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {Object}   props.config          Panel configuration with attributes to render
 * @param {Object}   props.config.attributes Object mapping attribute names to their config
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 * @param {string}   props.title           Panel title (default: "Header Colors")
 */
export function HeaderColorsPanel( {
	effectiveValues = {},
	attributes = {},
	setAttributes,
	config = {},
	theme,
	cssDefaults = {},
	initialOpen = false,
	title = 'Header Colors',
} ) {
	// Get the attributes to render from config
	const configAttributes = config.attributes || {};

	/**
	 * Handle color change
	 * @param {string} attrName - Attribute name
	 * @param {string} value - New color value
	 */
	const handleColorChange = ( attrName, value ) => {
		if ( setAttributes ) {
			setAttributes( { [ attrName ]: value } );
		}
	};

	/**
	 * Check if attribute is customized
	 * @param {string} attrName - Attribute name
	 * @returns {boolean} Whether the attribute is customized
	 */
	const isAttrCustomized = ( attrName ) => {
		return isCustomizedFromDefaults( attrName, attributes, theme, cssDefaults );
	};

	/**
	 * Render a single color control
	 * @param {string} attrName - Attribute name
	 * @param {Object} attrConfig - Attribute configuration from config
	 * @returns {JSX.Element} Color control component
	 */
	const renderColorControl = ( attrName, attrConfig ) => {
		const label = attrConfig.label || attrName;
		const labelWithBadge = isAttrCustomized( attrName ) ? `${ label } (Customized)` : label;

		const normalizedValue = normalizeValueForControl(
			effectiveValues[ attrName ],
			attrName,
			'color'
		);

		return (
			<CompactColorControl
				key={ attrName }
				label={ labelWithBadge }
				value={ normalizedValue }
				onChange={ ( value ) => handleColorChange( attrName, value ) }
				disableAlpha={ false }
			/>
		);
	};

	// Get attribute names in order from config
	const attributeNames = Object.keys( configAttributes );

	// If no attributes configured, render nothing
	if ( attributeNames.length === 0 ) {
		return null;
	}

	return (
		<PanelBody title={ title } initialOpen={ initialOpen }>
			{ attributeNames.map( ( attrName ) =>
				renderColorControl( attrName, configAttributes[ attrName ] )
			) }
		</PanelBody>
	);
}

export default HeaderColorsPanel;
