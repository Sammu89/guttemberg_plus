/**
 * ColorSwatch Atom
 *
 * Clickable color preview that opens color picker on click.
 * No "Choose" button - direct click interaction.
 *
 * @package guttemberg-plus
 */

import { useState } from '@wordpress/element';
import { ColorPicker, Popover } from '@wordpress/components';

/**
 * ColorSwatch Component
 *
 * @param {Object}   props
 * @param {string}   props.value     - Current color (hex, rgba, etc.)
 * @param {Function} props.onChange  - Change handler
 * @param {boolean}  props.disabled  - Disabled state
 */
export function ColorSwatch( {
	value = '#000000',
	onChange,
	disabled = false,
} ) {
	const [ isOpen, setIsOpen ] = useState( false );

	// Checkerboard pattern for transparency
	const checkerboardStyle = {
		backgroundImage: `
			linear-gradient(45deg, #ccc 25%, transparent 25%),
			linear-gradient(-45deg, #ccc 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #ccc 75%),
			linear-gradient(-45deg, transparent 75%, #ccc 75%)
		`,
		backgroundSize: '8px 8px',
		backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
	};

	return (
		<div className="gutplus-color-swatch">
			<button
				type="button"
				className="gutplus-color-swatch__button"
				onClick={ () => ! disabled && setIsOpen( ! isOpen ) }
				disabled={ disabled }
				aria-label={ `Color: ${ value }` }
				style={ {
					...checkerboardStyle,
					width: '28px',
					height: '28px',
					borderRadius: '4px',
					border: '1px solid #ddd',
					padding: 0,
					cursor: disabled ? 'default' : 'pointer',
					position: 'relative',
					overflow: 'hidden',
				} }
			>
				<span
					style={ {
						position: 'absolute',
						inset: 0,
						backgroundColor: value || 'transparent',
					} }
				/>
			</button>

			{ isOpen && (
				<Popover
					className="gutplus-color-swatch__popover"
					position="bottom left"
					onClose={ () => setIsOpen( false ) }
				>
					<div style={ { padding: '8px' } }>
						<ColorPicker
							color={ value }
							onChange={ onChange }
							enableAlpha
						/>
					</div>
				</Popover>
			) }
		</div>
	);
}

export default ColorSwatch;
