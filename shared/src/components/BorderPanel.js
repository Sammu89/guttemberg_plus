/**
 * Border Panel Component
 *
 * Panel for border styling (color, thickness, style, radius, shadow).
 * Shows effective values via cascade resolution.
 * Uses a configuration-driven approach - no blockType conditionals.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { normalizeValueForControl } from '../theme-system/control-normalizer';
import { getNumericDefault } from '../config/control-config-generated';
import { CompactColorControl } from './CompactColorControl';

/**
 * Border style options for SelectControl
 */
const BORDER_STYLE_OPTIONS = [
	{ label: 'None', value: 'none' },
	{ label: 'Solid', value: 'solid' },
	{ label: 'Dashed', value: 'dashed' },
	{ label: 'Dotted', value: 'dotted' },
	{ label: 'Double', value: 'double' },
];

/**
 * Border Panel Component
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.effectiveValues All effective values from cascade
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {Object}   props.config          Configuration object with main and optional divider sections
 * @param {Object}   props.config.main     Main border section config
 * @param {string}   props.config.main.title Section title (e.g., "Accordion Border")
 * @param {Object}   props.config.main.attributes Attribute definitions for main border
 * @param {Object}   props.config.divider  Optional divider section config
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {Function} props.onChange        Callback when value changes (optional, deprecated)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 */
export function BorderPanel( {
	effectiveValues = {},
	attributes = {},
	setAttributes,
	config,
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

	/**
	 * Get numeric value from effective values, handling string values with units
	 * @param attrName - attribute name
	 * @param attrConfig - attribute configuration with min/max/default
	 */
	const getNumericValue = ( attrName, attrConfig ) => {
		const value = effectiveValues[ attrName ];
		if ( typeof value === 'string' ) {
			return getNumericDefault( value );
		}
		return value ?? getNumericDefault( attrConfig?.default ) ?? 0;
	};

	// Extract config sections
	const mainConfig = config?.main || {};
	const mainAttrs = mainConfig.attributes || {};
	const dividerConfig = config?.divider;
	const dividerAttrs = dividerConfig?.attributes || {};

	// Get attribute names from config
	const colorAttr = mainAttrs.color?.name;
	const thicknessAttr = mainAttrs.thickness?.name;
	const styleAttr = mainAttrs.style?.name;
	const radiusAttr = mainAttrs.radius?.name;
	const shadowAttr = mainAttrs.shadow?.name;
	const shadowHoverAttr = mainAttrs.shadowHover?.name;

	// Get current radius values for display
	const currentRadius = effectiveValues[ radiusAttr ] || {
		topLeft: 0,
		topRight: 0,
		bottomRight: 0,
		bottomLeft: 0,
	};

	// Get divider attribute names
	const dividerColorAttr = dividerAttrs.color?.name;
	const dividerThicknessAttr = dividerAttrs.thickness?.name;
	const dividerStyleAttr = dividerAttrs.style?.name;

	// Check if divider section should be rendered
	const hasDividerSection = dividerConfig && dividerColorAttr;

	return (
		<PanelBody title="Border" initialOpen={ initialOpen }>
			<h3>{ mainConfig.title || 'Border' }</h3>

			{ colorAttr && (
				<CompactColorControl
					label={
						isAttrCustomized( colorAttr ) ? 'Color (Customized)' : 'Color'
					}
					value={ normalizeValueForControl( effectiveValues[ colorAttr ], colorAttr, 'color' ) }
					onChange={ ( value ) => handleChange( colorAttr, value ) }
				/>
			) }

			{ thicknessAttr && (
				<RangeControl
					label={ <CustomLabel label={ mainAttrs.thickness?.label || 'Thickness (px)' } attrName={ thicknessAttr } /> }
					value={ getNumericValue( thicknessAttr, mainAttrs.thickness ) }
					onChange={ ( value ) => handleChange( thicknessAttr, value ) }
					min={ mainAttrs.thickness?.min ?? 0 }
					max={ mainAttrs.thickness?.max ?? 10 }
				/>
			) }

			{ styleAttr && (
				<SelectControl
					label={ <CustomLabel label={ mainAttrs.style?.label || 'Style' } attrName={ styleAttr } /> }
					value={ effectiveValues[ styleAttr ] || 'solid' }
					options={ mainAttrs.style?.options || BORDER_STYLE_OPTIONS }
					onChange={ ( value ) => handleChange( styleAttr, value ) }
					__next40pxDefaultSize
				/>
			) }

			{/* Border Radius - Individual corner controls */}
			{ radiusAttr && (
				<>
					<hr style={ { margin: '16px 0' } } />
					<h4 style={ { margin: '0 0 12px 0', fontSize: '13px' } }>
						{ mainAttrs.radius?.label || 'Border Radius' }
						{ isAttrCustomized( radiusAttr ) && (
							<span className="customization-badge"> (Customized)</span>
						) }
					</h4>
					<p style={ { fontSize: '12px', color: '#666', marginBottom: '12px' } }>
						Set individual radius for each corner (0-{ mainAttrs.radius?.max ?? 60 }px)
					</p>

					<RangeControl
						label="Top Left (px)"
						value={ currentRadius.topLeft ?? getNumericDefault( mainAttrs.radius?.default ) ?? 0 }
						onChange={ ( value ) =>
							handleCornerChange( radiusAttr, 'topLeft', value )
						}
						min={ mainAttrs.radius?.min ?? 0 }
						max={ mainAttrs.radius?.max ?? 60 }
					/>

					<RangeControl
						label="Top Right (px)"
						value={ currentRadius.topRight ?? getNumericDefault( mainAttrs.radius?.default ) ?? 0 }
						onChange={ ( value ) =>
							handleCornerChange( radiusAttr, 'topRight', value )
						}
						min={ mainAttrs.radius?.min ?? 0 }
						max={ mainAttrs.radius?.max ?? 60 }
					/>

					<RangeControl
						label="Bottom Right (px)"
						value={ currentRadius.bottomRight ?? getNumericDefault( mainAttrs.radius?.default ) ?? 0 }
						onChange={ ( value ) =>
							handleCornerChange( radiusAttr, 'bottomRight', value )
						}
						min={ mainAttrs.radius?.min ?? 0 }
						max={ mainAttrs.radius?.max ?? 60 }
					/>

					<RangeControl
						label="Bottom Left (px)"
						value={ currentRadius.bottomLeft ?? getNumericDefault( mainAttrs.radius?.default ) ?? 0 }
						onChange={ ( value ) =>
							handleCornerChange( radiusAttr, 'bottomLeft', value )
						}
						min={ mainAttrs.radius?.min ?? 0 }
						max={ mainAttrs.radius?.max ?? 60 }
					/>
				</>
			) }

			{ shadowAttr && (
				<TextControl
					label={ <CustomLabel label={ mainAttrs.shadow?.label || 'Shadow' } attrName={ shadowAttr } /> }
					value={ effectiveValues[ shadowAttr ] || 'none' }
					onChange={ ( value ) => handleChange( shadowAttr, value ) }
					help="CSS box-shadow value (e.g. '0 2px 4px rgba(0,0,0,0.1)')"
					__nextHasNoMarginBottom
				/>
			) }

			{ shadowHoverAttr && (
				<TextControl
					label={ <CustomLabel label={ mainAttrs.shadowHover?.label || 'Shadow on Hover' } attrName={ shadowHoverAttr } /> }
					value={ effectiveValues[ shadowHoverAttr ] || 'none' }
					onChange={ ( value ) => handleChange( shadowHoverAttr, value ) }
					help="CSS box-shadow on hover (e.g. '0 4px 8px rgba(0,0,0,0.2)')"
					__nextHasNoMarginBottom
				/>
			) }

			{ hasDividerSection && (
				<>
					<hr />
					<h3>{ dividerConfig.title || 'Divider Border' }</h3>

					{ dividerColorAttr && (
						<CompactColorControl
							label={
								isAttrCustomized( dividerColorAttr )
									? 'Color (Customized)'
									: 'Color'
							}
							value={
								normalizeValueForControl(
									effectiveValues[ dividerColorAttr ],
									dividerColorAttr,
									'color'
								)
							}
							onChange={ ( value ) => handleChange( dividerColorAttr, value ) }
						/>
					) }

					{ dividerThicknessAttr && (
						<RangeControl
							label={
								<CustomLabel
									label={ dividerAttrs.thickness?.label || 'Thickness (px)' }
									attrName={ dividerThicknessAttr }
								/>
							}
							value={ getNumericValue( dividerThicknessAttr, dividerAttrs.thickness ) }
							onChange={ ( value ) => handleChange( dividerThicknessAttr, value ) }
							min={ dividerAttrs.thickness?.min ?? 0 }
							max={ dividerAttrs.thickness?.max ?? 10 }
						/>
					) }

					{ dividerStyleAttr && (
						<SelectControl
							label={
								<CustomLabel
									label={ dividerAttrs.style?.label || 'Style' }
									attrName={ dividerStyleAttr }
								/>
							}
							value={ effectiveValues[ dividerStyleAttr ] || 'solid' }
							options={ dividerAttrs.style?.options || BORDER_STYLE_OPTIONS }
							onChange={ ( value ) => handleChange( dividerStyleAttr, value ) }
							__next40pxDefaultSize
						/>
					) }
				</>
			) }
		</PanelBody>
	);
}

export default BorderPanel;
