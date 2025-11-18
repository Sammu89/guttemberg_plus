/**
 * Header Colors Panel Component
 *
 * Panel for header/title color customization.
 * Includes base colors, hover states, and active states.
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
 * @param {Object}   props                 Component props
 * @param {Object}   props.effectiveValues All effective values from cascade
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {string}   props.blockType       Block type (accordion, tabs, toc)
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 */
export function HeaderColorsPanel( {
	effectiveValues = {},
	attributes = {},
	setAttributes,
	blockType,
	theme,
	cssDefaults = {},
	initialOpen = false,
} ) {
	/**
	 * Handle color change
	 * @param attrName
	 * @param value
	 */
	const handleColorChange = ( attrName, value ) => {
		if ( setAttributes ) {
			setAttributes( { [ attrName ]: value } );
		}
	};

	/**
	 * Check if attribute is customized
	 * @param attrName
	 */
	const isAttrCustomized = ( attrName ) => {
		return isCustomizedFromDefaults( attrName, attributes, theme, cssDefaults );
	};

	/**
	 * Color control with customization badge
	 * @param root0
	 * @param root0.label
	 * @param root0.attrName
	 */
	const ColorControl = ( { label, attrName } ) => {
		const labelWithBadge = isAttrCustomized( attrName ) ? `${ label } (Customized)` : label;

		const normalizedValue = normalizeValueForControl(
			effectiveValues[ attrName ],
			attrName,
			'color'
		);

		return (
			<CompactColorControl
				label={ labelWithBadge }
				value={ normalizedValue }
				onChange={ ( value ) => handleColorChange( attrName, value ) }
				disableAlpha={ false }
			/>
		);
	};

	return (
		<PanelBody title="Header Colors" initialOpen={ initialOpen }>
			<ColorControl label="Title Text Color" attrName="titleColor" />
			<ColorControl label="Title Background Color" attrName="titleBackgroundColor" />

			{ /* Hover states */ }
			<ColorControl label="Hover Title Text Color" attrName="hoverTitleColor" />
			<ColorControl label="Hover Title Background" attrName="hoverTitleBackgroundColor" />

			{ /* Active states (for tabs, accordions when open) */ }
			<ColorControl label="Active Title Text Color" attrName="activeTitleColor" />
			<ColorControl label="Active Title Background" attrName="activeTitleBackgroundColor" />
		</PanelBody>
	);
}

export default HeaderColorsPanel;
