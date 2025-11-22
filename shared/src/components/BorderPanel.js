/**
 * Border Panel Component
 *
 * Panel for border styling (color, thickness, style, radius, shadow).
 * Shows effective values via cascade resolution.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { normalizeValueForControl } from '../theme-system/control-normalizer';
import { getControlConfig, getNumericControlDefault, getNumericDefault } from '../config/control-config-generated';
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
	 * Handle corner radius change
	 * Updates specific corner of border radius object
	 * @param attrName - the radius attribute name (e.g., 'accordionBorderRadius')
	 * @param corner - which corner ('topLeft', 'topRight', 'bottomRight', 'bottomLeft')
	 * @param value - new value
	 */
	const handleCornerChange = ( attrName, corner, value ) => {
		const currentRadius = attributes[ attrName ] || {
			topLeft: 0,
			topRight: 0,
			bottomRight: 0,
			bottomLeft: 0,
		};

		const updatedRadius = {
			...currentRadius,
			[ corner ]: value,
		};

		handleChange( attrName, updatedRadius );
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
					radius: 'accordionBorderRadius',
					shadow: 'accordionShadow',
			  }
			: blockType === 'tabs'
			? {
					title: 'Tab Button Border',
					color: 'tabBorderColor',
					thickness: 'tabBorderThickness',
					style: 'tabBorderStyle',
					radius: 'tabBorderRadius',
					shadow: 'tabShadow',
			  }
			: {
					title: 'Wrapper Border',
					color: 'wrapperBorderColor',
					thickness: 'wrapperBorderWidth',
					style: 'wrapperBorderStyle',
					radius: 'wrapperBorderRadius',
					shadow: 'wrapperShadow',
			  };

	// Get current radius values for display
	const currentRadius = effectiveValues[ borderAttrs.radius ] || {
		topLeft: 0,
		topRight: 0,
		bottomRight: 0,
		bottomLeft: 0,
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
				value={
					typeof effectiveValues[ borderAttrs.thickness ] === 'string'
						? getNumericDefault( effectiveValues[ borderAttrs.thickness ] )
						: effectiveValues[ borderAttrs.thickness ] ?? getNumericControlDefault( blockType, borderAttrs.thickness ) ?? 1
				}
				onChange={ ( value ) => handleChange( borderAttrs.thickness, value ) }
				min={ getControlConfig( blockType, borderAttrs.thickness ).min ?? 0 }
				max={ getControlConfig( blockType, borderAttrs.thickness ).max ?? 10 }
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
				__next40pxDefaultSize
			/>

			{/* Border Radius - Individual corner controls (0-60px) */}
			<hr style={ { margin: '16px 0' } } />
			<h4 style={ { margin: '0 0 12px 0', fontSize: '13px' } }>
				Border Radius
				{ isAttrCustomized( borderAttrs.radius ) && (
					<span className="customization-badge"> (Customized)</span>
				) }
			</h4>
			<p style={ { fontSize: '12px', color: '#666', marginBottom: '12px' } }>
				Set individual radius for each corner (0-60px)
			</p>

			<RangeControl
				label="Top Left (px)"
				value={ currentRadius.topLeft ?? getNumericControlDefault( blockType, borderAttrs.radius ) ?? 0 }
				onChange={ ( value ) =>
					handleCornerChange( borderAttrs.radius, 'topLeft', value )
				}
				min={ getControlConfig( blockType, borderAttrs.radius ).min ?? 0 }
				max={ getControlConfig( blockType, borderAttrs.radius ).max ?? 60 }
			/>

			<RangeControl
				label="Top Right (px)"
				value={ currentRadius.topRight ?? getNumericControlDefault( blockType, borderAttrs.radius ) ?? 0 }
				onChange={ ( value ) =>
					handleCornerChange( borderAttrs.radius, 'topRight', value )
				}
				min={ getControlConfig( blockType, borderAttrs.radius ).min ?? 0 }
				max={ getControlConfig( blockType, borderAttrs.radius ).max ?? 60 }
			/>

			<RangeControl
				label="Bottom Right (px)"
				value={ currentRadius.bottomRight ?? getNumericControlDefault( blockType, borderAttrs.radius ) ?? 0 }
				onChange={ ( value ) =>
					handleCornerChange( borderAttrs.radius, 'bottomRight', value )
				}
				min={ getControlConfig( blockType, borderAttrs.radius ).min ?? 0 }
				max={ getControlConfig( blockType, borderAttrs.radius ).max ?? 60 }
			/>

			<RangeControl
				label="Bottom Left (px)"
				value={ currentRadius.bottomLeft ?? getNumericControlDefault( blockType, borderAttrs.radius ) ?? 0 }
				onChange={ ( value ) =>
					handleCornerChange( borderAttrs.radius, 'bottomLeft', value )
				}
				min={ getControlConfig( blockType, borderAttrs.radius ).min ?? 0 }
				max={ getControlConfig( blockType, borderAttrs.radius ).max ?? 60 }
			/>

			<TextControl
				label={ <CustomLabel label="Shadow" attrName={ borderAttrs.shadow } /> }
				value={ effectiveValues[ borderAttrs.shadow ] || 'none' }
				onChange={ ( value ) => handleChange( borderAttrs.shadow, value ) }
				help="CSS box-shadow value (e.g. '0 2px 4px rgba(0,0,0,0.1)')"
				__nextHasNoMarginBottom
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
							( () => {
								const dividerValue = effectiveValues[
									blockType === 'accordion' ? 'dividerBorderThickness' : 'dividerThickness'
								];
								return typeof dividerValue === 'string'
									? getNumericDefault( dividerValue )
									: dividerValue ?? getNumericControlDefault( blockType, blockType === 'accordion' ? 'dividerBorderThickness' : 'dividerThickness' ) ?? 0;
							} )()
						}
						onChange={ ( value ) =>
							handleChange(
								blockType === 'accordion'
									? 'dividerBorderThickness'
									: 'dividerThickness',
								value
							)
						}
						min={ getControlConfig( blockType, blockType === 'accordion' ? 'dividerBorderThickness' : 'dividerThickness' ).min ?? 0 }
						max={ getControlConfig( blockType, blockType === 'accordion' ? 'dividerBorderThickness' : 'dividerThickness' ).max ?? 10 }
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
						__next40pxDefaultSize
					/>
				</>
			) }
		</PanelBody>
	);
}

export default BorderPanel;
