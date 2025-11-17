/**
 * Icon Panel Component
 *
 * Panel for icon configuration (type, position, size, rotation).
 * Shows effective values via cascade resolution.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { CompactColorControl } from './CompactColorControl';

/**
 * Icon Panel Component
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
export function IconPanel( {
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
	 * Stores changes in customizations object and enables applyCustomizations flag
	 * @param attrName
	 * @param value
	 */
	const handleChange = ( attrName, value ) => {
		if ( setAttributes ) {
			setAttributes( {
				customizations: {
					...( attributes.customizations || {} ),
					[ attrName ]: value,
				},
				applyCustomizations: true, // Enable customizations when user makes changes
			} );
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

	const showIcon = effectiveValues.showIcon ?? true;

	return (
		<PanelBody title="Icon" initialOpen={ initialOpen }>
			<ToggleControl
				label={ <CustomLabel label="Show Icon" attrName="showIcon" /> }
				checked={ showIcon }
				onChange={ ( value ) => handleChange( 'showIcon', value ) }
			/>

			{ showIcon && (
				<>
					<TextControl
						label={ <CustomLabel label="Closed Icon" attrName="iconTypeClosed" /> }
						value={ effectiveValues.iconTypeClosed || '▾' }
						onChange={ ( value ) => handleChange( 'iconTypeClosed', value ) }
						help="Character, emoji, or image URL"
					/>

					<TextControl
						label={ <CustomLabel label="Open Icon" attrName="iconTypeOpen" /> }
						value={ effectiveValues.iconTypeOpen || 'none' }
						onChange={ ( value ) => handleChange( 'iconTypeOpen', value ) }
						help="'none' uses rotation instead of changing icon"
					/>

					{ ( effectiveValues.iconTypeOpen === 'none' ||
						! effectiveValues.iconTypeOpen ) && (
						<RangeControl
							label={
								<CustomLabel label="Rotation (degrees)" attrName="iconRotation" />
							}
							value={ effectiveValues.iconRotation || 180 }
							onChange={ ( value ) => handleChange( 'iconRotation', value ) }
							min={ 0 }
							max={ 360 }
						/>
					) }

					<SelectControl
						label={ <CustomLabel label="Icon Position" attrName="iconPosition" /> }
						value={ effectiveValues.iconPosition || 'right' }
						options={ [
							{ label: 'Left', value: 'left' },
							{ label: 'Right', value: 'right' },
							{ label: 'Extreme Left', value: 'extreme-left' },
							{
								label: 'Extreme Right',
								value: 'extreme-right',
							},
						] }
						onChange={ ( value ) => handleChange( 'iconPosition', value ) }
					/>

					<CompactColorControl
						label={
							isAttrCustomized( 'iconColor' )
								? 'Icon Color (Customized)'
								: 'Icon Color'
						}
						value={ effectiveValues.iconColor }
						onChange={ ( value ) => handleChange( 'iconColor', value ) }
						help="Leave empty to inherit from title color"
					/>

					<RangeControl
						label={ <CustomLabel label="Icon Size (px)" attrName="iconSize" /> }
						value={ effectiveValues.iconSize || effectiveValues.titleFontSize || 16 }
						onChange={ ( value ) => handleChange( 'iconSize', value ) }
						min={ 12 }
						max={ 48 }
						help="Leave null to inherit from title font size"
					/>
				</>
			) }
		</PanelBody>
	);
}

export default IconPanel;
