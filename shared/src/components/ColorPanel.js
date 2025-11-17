/**
 * Color Panel Component
 *
 * Panel for color customization with customization badges.
 * Shows effective values via cascade resolution.
 * Uses compact color controls to save space.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import { PanelBody } from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { normalizeValueForControl } from '../theme-system/control-normalizer';
import { CompactColorControl } from './CompactColorControl';

/**
 * Color Panel Component
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.effectiveValues All effective values from cascade
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {string}   props.blockType       Block type (accordion, tabs, toc)
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {Function} props.onChangeColor   Callback when color changes (optional, deprecated)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 */
export function ColorPanel( {
	effectiveValues = {},
	attributes = {},
	setAttributes,
	blockType,
	theme,
	cssDefaults = {},
	onChangeColor,
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
		} else if ( onChangeColor ) {
			// Fallback to onChangeColor if provided (deprecated)
			onChangeColor( attrName, value );
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
	 * Color control with customization badge
	 * @param root0
	 * @param root0.label
	 * @param root0.attrName
	 */
	const ColorControl = ( { label, attrName } ) => {
		// Add customization badge to label if customized
		const labelWithBadge = isAttrCustomized( attrName ) ? `${ label } (Customized)` : label;

		// Normalize value ONLY for the UI control (prevents crashes)
		// This does NOT affect the cascade or customization detection
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
		<PanelBody title="Appearance" initialOpen={ initialOpen }>
			<ColorControl label="Header Background Color" attrName="titleBackgroundColor" />
			<ColorControl label="Title Text Color" attrName="titleColor" />
			<ColorControl label="Hover Header Background" attrName="hoverTitleBackgroundColor" />
			<ColorControl label="Hover Title Text" attrName="hoverTitleColor" />
			<ColorControl label="Active Header Background" attrName="activeTitleBackgroundColor" />
			<ColorControl label="Active Title Text" attrName="activeTitleColor" />
			<ColorControl label="Content Background Color" attrName="contentBackgroundColor" />
		</PanelBody>
	);
}

export default ColorPanel;
