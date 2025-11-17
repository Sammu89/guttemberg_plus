/**
 * Border Panel Component
 *
 * Panel for border styling (color, thickness, style, radius).
 * Shows effective values via cascade resolution.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { CompactColorControl } from './CompactColorControl';

/**
 * Border Panel Component
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.effectiveValues All effective values from cascade
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {string}   props.blockType       Block type (accordion, tabs, toc)
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {Function} props.onChange        Callback when value changes (optional, deprecated)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 */
export function BorderPanel( {
	effectiveValues = {},
	attributes = {},
	setAttributes,
	blockType,
	theme,
	cssDefaults = {},
	onChange,
	initialOpen = false,
} ) {
	/**
	 * Handle attribute change
	 * @param attrName
	 * @param value
	 */
	const handleChange = ( attrName, value ) => {
		if ( setAttributes ) {
			setAttributes( { [ attrName ]: value } );
		} else if ( onChange ) {
			// Fallback to onChange if provided (deprecated)
			onChange( attrName, value );
		}
	};
	/**
	 * Check if attribute is customized (compares against both theme and CSS defaults)
	 * @param attrName
	 */
	const isAttrCustomized = ( attrName ) => {
		return isCustomizedFromDefaults( attrName, attributes, theme, cssDefaults );
	};

	/**
	 * Label with customization badge
	 * @param root0
	 * @param root0.label
	 * @param root0.attrName
	 */
	const CustomLabel = ( { label, attrName } ) => (
		<span>
			{ label }
			{ isAttrCustomized( attrName ) && (
				<span className="customization-badge"> (Customized)</span>
			) }
		</span>
	);

	return (
		<PanelBody title="Border" initialOpen={ initialOpen }>
			<h3>Accordion Border</h3>

			<CompactColorControl
				label={
					isAttrCustomized( 'accordionBorderColor' ) ? 'Color (Customized)' : 'Color'
				}
				value={ effectiveValues.accordionBorderColor }
				onChange={ ( value ) => handleChange( 'accordionBorderColor', value ) }
			/>

			<RangeControl
				label={ <CustomLabel label="Thickness (px)" attrName="accordionBorderThickness" /> }
				value={ effectiveValues.accordionBorderThickness || 1 }
				onChange={ ( value ) => handleChange( 'accordionBorderThickness', value ) }
				min={ 0 }
				max={ 10 }
			/>

			<SelectControl
				label={ <CustomLabel label="Style" attrName="accordionBorderStyle" /> }
				value={ effectiveValues.accordionBorderStyle || 'solid' }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'Solid', value: 'solid' },
					{ label: 'Dashed', value: 'dashed' },
					{ label: 'Dotted', value: 'dotted' },
					{ label: 'Double', value: 'double' },
				] }
				onChange={ ( value ) => handleChange( 'accordionBorderStyle', value ) }
			/>

			<TextControl
				label={ <CustomLabel label="Shadow" attrName="accordionShadow" /> }
				value={ effectiveValues.accordionShadow || 'none' }
				onChange={ ( value ) => handleChange( 'accordionShadow', value ) }
				help="CSS box-shadow value (e.g. '0 2px 4px rgba(0,0,0,0.1)')"
			/>

			<RangeControl
				label={ <CustomLabel label="Border Radius (px)" attrName="accordionBorderRadius" /> }
				value={
					effectiveValues.accordionBorderRadius?.topLeft ||
					effectiveValues.accordionBorderRadius ||
					4
				}
				onChange={ ( value ) =>
					handleChange( 'accordionBorderRadius', {
						topLeft: value,
						topRight: value,
						bottomRight: value,
						bottomLeft: value,
					} )
				}
				min={ 0 }
				max={ 50 }
				help="Applies same radius to all corners"
			/>

			<hr />
			<h3>Divider Border</h3>

			<CompactColorControl
				label={ isAttrCustomized( 'dividerBorderColor' ) ? 'Color (Customized)' : 'Color' }
				value={ effectiveValues.dividerBorderColor }
				onChange={ ( value ) => handleChange( 'dividerBorderColor', value ) }
			/>

			<RangeControl
				label={ <CustomLabel label="Thickness (px)" attrName="dividerBorderThickness" /> }
				value={ effectiveValues.dividerBorderThickness || 0 }
				onChange={ ( value ) => handleChange( 'dividerBorderThickness', value ) }
				min={ 0 }
				max={ 10 }
			/>

			<SelectControl
				label={ <CustomLabel label="Style" attrName="dividerBorderStyle" /> }
				value={ effectiveValues.dividerBorderStyle || 'solid' }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'Solid', value: 'solid' },
					{ label: 'Dashed', value: 'dashed' },
					{ label: 'Dotted', value: 'dotted' },
					{ label: 'Double', value: 'double' },
				] }
				onChange={ ( value ) => handleChange( 'dividerBorderStyle', value ) }
			/>
		</PanelBody>
	);
}

export default BorderPanel;
