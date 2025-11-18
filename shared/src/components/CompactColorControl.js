/**
 * Compact Color Control Component
 *
 * A space-efficient color input with text field and popup color picker.
 * Users can either paste a color value or click "Choose color" to open a picker.
 *
 * @package
 * @since 1.0.0
 */

import { useState, useEffect, useRef } from '@wordpress/element';
import { BaseControl, Button, ColorPicker, Popover, TextControl } from '@wordpress/components';

/**
 * Compact Color Control
 *
 * @param {Object}   props              Component props
 * @param {string}   props.label        Label for the color control
 * @param {string}   props.value        Current color value (hex, rgb, etc.)
 * @param {Function} props.onChange     Callback when color changes
 * @param {boolean}  props.disableAlpha Whether to disable alpha channel (default: false)
 * @param {string}   props.help         Help text below the control
 */
export function CompactColorControl( { label, value, onChange, disableAlpha = false, help = '' } ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ tempColor, setTempColor ] = useState( value );
	const [ savedColor, setSavedColor ] = useState( value );
	const buttonRef = useRef( null );

	// Update tempColor when value prop changes from parent (only when picker is closed)
	useEffect( () => {
		if ( ! isPickerOpen && value ) {
			setTempColor( value );
			setSavedColor( value );
		}
	}, [ value, isPickerOpen ] );

	/**
	 * Handle text input change
	 * @param newValue
	 */
	const handleTextChange = ( newValue ) => {
		onChange( newValue );
		setTempColor( newValue );
	};

	/**
	 * Handle color picker change (while sliding)
	 * Just updates the temporary color - doesn't save yet
	 * @param color
	 */
	const handlePickerChange = ( color ) => {
		// ColorPicker returns a color object with hex, rgb, hsl, etc.
		// We need to extract the hex value properly
		let newColor;
		if ( typeof color === 'string' ) {
			newColor = color;
		} else if ( color.hex ) {
			newColor = color.hex;
		} else if ( color.source === 'hex' ) {
			// When typing in hex field, color is passed differently
			newColor = '#' + color.hex;
		} else {
			// Fallback - shouldn't happen with proper cascade
			newColor = value;
		}

		// Only update tempColor - don't call onChange
		// This keeps the popover open
		setTempColor( newColor );
	};

	/**
	 * Handle OK button - save the selected color
	 */
	const handleConfirm = () => {
		// Save the color now
		onChange( tempColor );
		setIsPickerOpen( false );
	};

	/**
	 * Handle cancel - don't save, just close
	 */
	const handleCancel = () => {
		// Revert tempColor to saved value
		setTempColor( savedColor );
		setIsPickerOpen( false );
	};

	/**
	 * Handle opening the picker - save current color for potential cancel
	 */
	const handleOpenPicker = () => {
		setSavedColor( value );
		setTempColor( value );
		setIsPickerOpen( true );
	};

	// Always show tempColor in sidebar for preview while picking
	// When picker is closed, tempColor equals value anyway
	const displayColor = tempColor;

	return (
		<BaseControl label={ label } help={ help } className="compact-color-control">
			<div
				style={ {
					display: 'flex',
					gap: '8px',
					alignItems: 'flex-start',
				} }
			>
				{ /* Color preview swatch - shows temp color while picking */ }
				<div
					style={ {
						width: '32px',
						height: '32px',
						backgroundColor: displayColor,
						border: '1px solid #ddd',
						borderRadius: '4px',
						flexShrink: 0,
					} }
				/>

				{ /* Text input for pasting color */ }
				<div style={ { flex: 1 } }>
					<TextControl
						value={ displayColor || '' }
						onChange={ handleTextChange }
						placeholder="Color value"
						style={ { marginBottom: 0 } }
					/>
				</div>

				{ /* Button to open color picker */ }
				<Button
					ref={ buttonRef }
					variant="secondary"
					onClick={ handleOpenPicker }
					aria-expanded={ isPickerOpen }
				>
					Choose color
				</Button>
			</div>

			{ /* Popup color picker */ }
			{ isPickerOpen && (
				<Popover
					anchor={ buttonRef.current }
					position="bottom right"
					onClose={ handleCancel }
					focusOnMount={ false }
					noArrow={ false }
				>
					<div style={ { padding: '16px' } }>
						<ColorPicker
							color={ tempColor }
							onChange={ handlePickerChange }
							onChangeComplete={ handlePickerChange }
							disableAlpha={ disableAlpha }
							enableAlpha={ ! disableAlpha }
						/>

						<div
							style={ {
								marginTop: '16px',
								display: 'flex',
								justifyContent: 'space-between',
								gap: '8px',
								borderTop: '1px solid #ddd',
								paddingTop: '12px',
							} }
						>
							<Button variant="tertiary" onClick={ handleCancel }>
								Cancel
							</Button>
							<Button variant="primary" onClick={ handleConfirm }>
								OK
							</Button>
						</div>
					</div>
				</Popover>
			) }
		</BaseControl>
	);
}

export default CompactColorControl;
