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
import { normalizeValueForControl } from '../theme-system/control-normalizer';
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
	 * Writes directly to attribute (sidebar is source of truth)
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

	// Block-specific attribute names
	const borderAttrs =
		blockType === 'accordion'
			? {
					title: 'Accordion Border',
					color: 'accordionBorderColor',
					thickness: 'accordionBorderThickness',
					style: 'accordionBorderStyle',
					shadow: 'accordionShadow',
					radius: 'accordionBorderRadius',
			  }
			: blockType === 'tabs'
			? {
					title: 'Tab Button Border',
					color: 'tabBorderColor',
					thickness: 'tabBorderThickness',
					style: 'tabBorderStyle',
					shadow: 'tabShadow',
					radius: 'tabBorderRadius',
			  }
			: {
					title: 'Wrapper Border',
					color: 'wrapperBorderColor',
					thickness: 'wrapperBorderWidth',
					style: 'wrapperBorderStyle',
					shadow: 'wrapperShadow',
					radius: 'wrapperBorderRadius',
			  };

	return (
		<PanelBody title="Border" initialOpen={ initialOpen }>
			<h3>{ borderAttrs.title }</h3>

			<CompactColorControl
				label={
					isAttrCustomized( borderAttrs.color ) ? 'Color (Customized)' : 'Color'
				}
				value={ normalizeValueForControl( effectiveValues[ borderAttrs.color ], borderAttrs.color, 'color' ) }
				onChange={ ( value ) => handleChange( borderAttrs.color, value ) }
			/>

			<RangeControl
				label={ <CustomLabel label="Thickness (px)" attrName={ borderAttrs.thickness } /> }
				value={ effectiveValues[ borderAttrs.thickness ] || 1 }
				onChange={ ( value ) => handleChange( borderAttrs.thickness, value ) }
				min={ 0 }
				max={ 10 }
			/>

			<SelectControl
				label={ <CustomLabel label="Style" attrName={ borderAttrs.style } /> }
				value={ effectiveValues[ borderAttrs.style ] || 'solid' }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'Solid', value: 'solid' },
					{ label: 'Dashed', value: 'dashed' },
					{ label: 'Dotted', value: 'dotted' },
					{ label: 'Double', value: 'double' },
				] }
				onChange={ ( value ) => handleChange( borderAttrs.style, value ) }
			/>

			<TextControl
				label={ <CustomLabel label="Shadow" attrName={ borderAttrs.shadow } /> }
				value={ effectiveValues[ borderAttrs.shadow ] || 'none' }
				onChange={ ( value ) => handleChange( borderAttrs.shadow, value ) }
				help="CSS box-shadow value (e.g. '0 2px 4px rgba(0,0,0,0.1)')"
			/>

			<RangeControl
				label={ <CustomLabel label="Border Radius (px)" attrName={ borderAttrs.radius } /> }
				value={
					effectiveValues[ borderAttrs.radius ]?.topLeft ||
					effectiveValues[ borderAttrs.radius ] ||
					4
				}
				onChange={ ( value ) =>
					handleChange( borderAttrs.radius, {
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

			{ blockType !== 'toc' && (
				<>
					<hr />
					<h3>Divider Border</h3>

					<CompactColorControl
						label={
							isAttrCustomized(
								blockType === 'accordion' ? 'dividerBorderColor' : 'dividerColor'
							)
								? 'Color (Customized)'
								: 'Color'
						}
						value={
							normalizeValueForControl(
								effectiveValues[
									blockType === 'accordion' ? 'dividerBorderColor' : 'dividerColor'
								],
								blockType === 'accordion' ? 'dividerBorderColor' : 'dividerColor',
								'color'
							)
						}
						onChange={ ( value ) =>
							handleChange(
								blockType === 'accordion' ? 'dividerBorderColor' : 'dividerColor',
								value
							)
						}
					/>

					<RangeControl
						label={
							<CustomLabel
								label="Thickness (px)"
								attrName={
									blockType === 'accordion'
										? 'dividerBorderThickness'
										: 'dividerThickness'
								}
							/>
						}
						value={
							effectiveValues[
								blockType === 'accordion' ? 'dividerBorderThickness' : 'dividerThickness'
							] || 0
						}
						onChange={ ( value ) =>
							handleChange(
								blockType === 'accordion'
									? 'dividerBorderThickness'
									: 'dividerThickness',
								value
							)
						}
						min={ 0 }
						max={ 10 }
					/>

					<SelectControl
						label={
							<CustomLabel
								label="Style"
								attrName={
									blockType === 'accordion' ? 'dividerBorderStyle' : 'dividerStyle'
								}
							/>
						}
						value={
							effectiveValues[
								blockType === 'accordion' ? 'dividerBorderStyle' : 'dividerStyle'
							] || 'solid'
						}
						options={ [
							{ label: 'None', value: 'none' },
							{ label: 'Solid', value: 'solid' },
							{ label: 'Dashed', value: 'dashed' },
							{ label: 'Dotted', value: 'dotted' },
							{ label: 'Double', value: 'double' },
						] }
						onChange={ ( value ) =>
							handleChange(
								blockType === 'accordion' ? 'dividerBorderStyle' : 'dividerStyle',
								value
							)
						}
					/>
				</>
			) }
		</PanelBody>
	);
}

export default BorderPanel;
