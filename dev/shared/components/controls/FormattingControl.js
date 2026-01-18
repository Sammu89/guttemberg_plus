/**
 * FormattingControl - Main formatting control organism
 * Replaces AppearanceControl + DecorationControl
 */
import { BaseControl, ToggleControl } from '@wordpress/components';
import { FormattingToggleGroup } from './molecules/FormattingToggleGroup';
import { FontWeightSlider } from './molecules/FontWeightSlider';
import { TextDecorationPanel } from './molecules/TextDecorationPanel';

const DECORATION_KEYS = [ 'underline', 'overline', 'line-through' ];

export function FormattingControl( {
	value = {},
	textColor,
	onChange,
	label = 'Formatting',
	disabled = false,
} ) {
	const {
		formatting = [],
		fontWeight = 400,
		decorationColor = 'currentColor',
		decorationStyle = 'solid',
		decorationWidth = 'auto',
		noLineBreak = false,
	} = value;

	const hasBold = formatting.includes( 'bold' );
	const hasDecoration = formatting.some( ( f ) => DECORATION_KEYS.includes( f ) );

	const handleFormattingChange = ( newFormatting ) => {
		onChange( { ...value, formatting: newFormatting } );
	};

	const handleWeightChange = ( newWeight ) => {
		onChange( { ...value, fontWeight: newWeight } );
	};

	const handleDecorationChange = ( { color, style, width } ) => {
		onChange( {
			...value,
			decorationColor: color,
			decorationStyle: style,
			decorationWidth: width,
		} );
	};

	const handleNoLineBreakChange = ( newValue ) => {
		onChange( {
			...value,
			noLineBreak: newValue,
		} );
	};

	return (
		<BaseControl label={ label } className="gutplus-formatting-control" __nextHasNoMarginBottom>
			<FormattingToggleGroup
				value={ formatting }
				onChange={ handleFormattingChange }
				disabled={ disabled }
			/>

			{ hasBold && (
				<FontWeightSlider
					value={ fontWeight }
					onChange={ handleWeightChange }
					disabled={ disabled }
				/>
			) }

			{ hasDecoration && (
				<TextDecorationPanel
					color={ decorationColor }
					style={ decorationStyle }
					width={ decorationWidth }
					textColor={ textColor }
					onChange={ handleDecorationChange }
					disabled={ disabled }
				/>
			) }

			<ToggleControl
				label="No line break"
				checked={ noLineBreak }
				onChange={ handleNoLineBreakChange }
				disabled={ disabled }
				__nextHasNoMarginBottom
			/>
		</BaseControl>
	);
}

export default FormattingControl;
