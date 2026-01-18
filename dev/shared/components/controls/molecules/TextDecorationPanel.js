/**
 * TextDecorationPanel - Color, Style, Width controls for text decorations
 * Shows when underline/overline/line-through is active
 */
import { BaseControl, SelectControl } from '@wordpress/components';
import { ColorControl } from '../ColorControl';
import { DecorationWidthControl } from './DecorationWidthControl';

const STYLE_OPTIONS = [
	{ value: 'solid', label: 'Solid' },
	{ value: 'dashed', label: 'Dashed' },
	{ value: 'dotted', label: 'Dotted' },
	{ value: 'wavy', label: 'Wavy' },
	{ value: 'double', label: 'Double' },
];

export function TextDecorationPanel( {
	color = 'currentColor',
	style = 'solid',
	width = 'auto',
	textColor,
	onChange,
	disabled = false,
} ) {
	const handleChange = ( key, value ) => {
		onChange( { color, style, width, [ key ]: value } );
	};

	return (
		<div className="gutplus-text-decoration-panel">
			<BaseControl label="Decoration Settings" __nextHasNoMarginBottom>
				<div className="gutplus-text-decoration-panel__controls">
					<ColorControl
						label="Color"
						value={ color === 'currentColor' ? textColor : color }
						onChange={ ( newColor ) =>
							handleChange( 'color', newColor || 'currentColor' )
						}
						disabled={ disabled }
					/>

					<SelectControl
						label="Style"
						value={ style }
						options={ STYLE_OPTIONS }
						onChange={ ( newStyle ) => handleChange( 'style', newStyle ) }
						disabled={ disabled }
						__nextHasNoMarginBottom
					/>

					<DecorationWidthControl
						value={ width }
						onChange={ ( newWidth ) => handleChange( 'width', newWidth ) }
						disabled={ disabled }
					/>
				</div>
			</BaseControl>
		</div>
	);
}
