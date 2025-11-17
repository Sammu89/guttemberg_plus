/**
 * Typography Panel Component
 *
 * Panel for typography customization (font size, weight, style, etc).
 * Shows effective values via cascade resolution.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import {
	PanelBody,
	RangeControl,
	SelectControl,
	BaseControl,
} from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';

/**
 * Typography Panel Component
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
export function TypographyPanel( {
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
		return isCustomizedFromDefaults(
			attrName,
			attributes,
			theme,
			cssDefaults
		);
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
		<PanelBody title="Title" initialOpen={ initialOpen }>
			<SelectControl
				label={
					<CustomLabel
						label="Heading Level"
						attrName="headingLevel"
					/>
				}
				value={ effectiveValues.headingLevel || 'none' }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'H1', value: 'h1' },
					{ label: 'H2', value: 'h2' },
					{ label: 'H3', value: 'h3' },
					{ label: 'H4', value: 'h4' },
					{ label: 'H5', value: 'h5' },
					{ label: 'H6', value: 'h6' },
				] }
				onChange={ ( value ) => handleChange( 'headingLevel', value ) }
			/>

			<RangeControl
				label={
					<CustomLabel label="Font Size" attrName="titleFontSize" />
				}
				value={ effectiveValues.titleFontSize || 16 }
				onChange={ ( value ) => handleChange( 'titleFontSize', value ) }
				min={ 12 }
				max={ 48 }
			/>

			<SelectControl
				label={
					<CustomLabel
						label="Font Weight"
						attrName="titleFontWeight"
					/>
				}
				value={ effectiveValues.titleFontWeight || '600' }
				options={ [
					{ label: 'Normal', value: 'normal' },
					{ label: 'Bold', value: 'bold' },
					{ label: '100', value: '100' },
					{ label: '200', value: '200' },
					{ label: '300', value: '300' },
					{ label: '400', value: '400' },
					{ label: '500', value: '500' },
					{ label: '600', value: '600' },
					{ label: '700', value: '700' },
					{ label: '800', value: '800' },
					{ label: '900', value: '900' },
				] }
				onChange={ ( value ) =>
					handleChange( 'titleFontWeight', value )
				}
			/>

			<SelectControl
				label={
					<CustomLabel label="Font Style" attrName="titleFontStyle" />
				}
				value={ effectiveValues.titleFontStyle || 'normal' }
				options={ [
					{ label: 'Normal', value: 'normal' },
					{ label: 'Italic', value: 'italic' },
					{ label: 'Oblique', value: 'oblique' },
				] }
				onChange={ ( value ) =>
					handleChange( 'titleFontStyle', value )
				}
			/>

			<SelectControl
				label={
					<CustomLabel
						label="Text Transform"
						attrName="titleTextTransform"
					/>
				}
				value={ effectiveValues.titleTextTransform || 'none' }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'Uppercase', value: 'uppercase' },
					{ label: 'Lowercase', value: 'lowercase' },
					{ label: 'Capitalize', value: 'capitalize' },
				] }
				onChange={ ( value ) =>
					handleChange( 'titleTextTransform', value )
				}
			/>

			<SelectControl
				label={
					<CustomLabel
						label="Text Decoration"
						attrName="titleTextDecoration"
					/>
				}
				value={ effectiveValues.titleTextDecoration || 'none' }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'Underline', value: 'underline' },
					{ label: 'Overline', value: 'overline' },
					{ label: 'Line Through', value: 'line-through' },
				] }
				onChange={ ( value ) =>
					handleChange( 'titleTextDecoration', value )
				}
			/>

			<SelectControl
				label={
					<CustomLabel
						label="Text Alignment"
						attrName="titleAlignment"
					/>
				}
				value={ effectiveValues.titleAlignment || 'left' }
				options={ [
					{ label: 'Left', value: 'left' },
					{ label: 'Center', value: 'center' },
					{ label: 'Right', value: 'right' },
				] }
				onChange={ ( value ) =>
					handleChange( 'titleAlignment', value )
				}
			/>
		</PanelBody>
	);
}

export default TypographyPanel;
