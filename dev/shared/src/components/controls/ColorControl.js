/**
 * Color Control Component
 *
 * Wrapper around WordPress ColorPicker with reset functionality.
 * Provides a consistent interface for color selection with preview swatch,
 * text input, and popup color picker.
 *
 * @package
 * @since 1.0.0
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import {
	BaseControl,
	Button,
	ColorPicker,
	Popover,
	TextControl,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
// Note: Button is still used for Cancel/Apply in the popover
import { ResetButton } from './ResetButton';

/**
 * Color Control Component
 *
 * A color picker control with text input, color swatch preview,
 * popup picker, and reset button.
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses a SIMPLE STRING pattern (single color value).
 * NOTE: This is for simple color pickers. BorderPanel uses a BOX pattern for per-side colors.
 *
 * VALUE PROP:
 * -----------
 * value prop accepts:
 *   - Hex string: "#ff0000"
 *   - Hex with alpha: "#ff0000cc"
 *   - RGB string: "rgb(255, 0, 0)"
 *   - RGBA string: "rgba(255, 0, 0, 0.8)"
 *   - HSL string: "hsl(0, 100%, 50%)"
 *   - Color name: "red"
 *
 * onChange callback signature:
 *   onChange(newColorString)
 *   - Always returns a string (format depends on user input)
 *
 * NOT RESPONSIVE:
 * ---------------
 * ColorControl itself does NOT support responsive mode.
 * For responsive colors, the parent must handle device switching.
 *
 * ============================================================================
 *
 * @param {Object}   props              Component props
 * @param {string}   props.label        Label for the control
 * @param {string}   props.value        Current color value (hex, rgb, rgba, etc.) - see DATA STRUCTURE above
 * @param {Function} props.onChange     Callback when color changes - see DATA STRUCTURE above
 * @param {Function} props.onReset      Optional custom reset callback
 * @param {string}   props.defaultValue Default color for reset
 * @param {boolean}  props.disableAlpha Whether to disable alpha channel (default: false)
 * @param {string}   props.help         Help text below the control
 * @param {boolean}  props.showReset    Whether to show reset button (default: true)
 * @return {JSX.Element} Color control component
 */
export function ColorControl( {
	label,
	value,
	onChange,
	onReset,
	defaultValue = '',
	disableAlpha = false,
	help,
	showReset = true,
} ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ tempColor, setTempColor ] = useState( value || '' );
	const [ savedColor, setSavedColor ] = useState( value || '' );
	const swatchRef = useRef( null );

	// Sync temp color when value prop changes (only when picker is closed)
	useEffect( () => {
		if ( ! isPickerOpen ) {
			setTempColor( value || '' );
			setSavedColor( value || '' );
		}
	}, [ value, isPickerOpen ] );

	/**
	 * Handle text input change - immediate update
	 *
	 * @param {string} newValue - New color value from text input
	 */
	const handleTextChange = ( newValue ) => {
		onChange( newValue );
		setTempColor( newValue );
	};

	/**
	 * Handle color picker change - only update temp color while sliding
	 *
	 * @param {Object|string} color - Color value from picker
	 */
	const handlePickerChange = ( color ) => {
		let newColor;

		if ( typeof color === 'string' ) {
			newColor = color;
		} else if ( color.hex ) {
			// Handle rgba if alpha is enabled
			if ( ! disableAlpha && color.rgb && color.rgb.a < 1 ) {
				const { r, g, b, a } = color.rgb;
				newColor = `rgba(${ r }, ${ g }, ${ b }, ${ a })`;
			} else {
				newColor = color.hex;
			}
		} else {
			newColor = value || '';
		}

		setTempColor( newColor );
	};

	/**
	 * Handle confirm button - save the selected color
	 */
	const handleConfirm = () => {
		onChange( tempColor );
		setSavedColor( tempColor );
		setIsPickerOpen( false );
	};

	/**
	 * Handle cancel button - revert to saved color
	 */
	const handleCancel = () => {
		setTempColor( savedColor );
		setIsPickerOpen( false );
	};

	/**
	 * Handle opening the picker
	 */
	const handleOpenPicker = () => {
		setSavedColor( value || '' );
		setTempColor( value || '' );
		setIsPickerOpen( true );
	};

	/**
	 * Handle reset button
	 */
	const handleReset = () => {
		if ( onReset ) {
			onReset();
		} else {
			onChange( defaultValue );
		}
	};

	// Display color (temp color when picker is open, actual value otherwise)
	const displayColor = isPickerOpen ? tempColor : value || '';

	// Determine if reset is disabled
	const isResetDisabled = value === defaultValue || ( ! value && ! defaultValue );

	return (
		<BaseControl
			label={
				<Flex align="center" justify="space-between" style={ { width: '100%' } }>
					<FlexItem>{ label }</FlexItem>
					{ showReset && (
						<FlexItem>
							<ResetButton onClick={ handleReset } disabled={ isResetDisabled } />
						</FlexItem>
					) }
				</Flex>
			}
			help={ help }
			className="gutplus-color-control"
		>
			<Flex gap={ 2 } align="flex-start">
				{ /* Clickable color preview swatch */ }
				<FlexItem>
					<button
						ref={ swatchRef }
						type="button"
						className="gutplus-color-control__swatch"
						onClick={ handleOpenPicker }
						aria-expanded={ isPickerOpen }
						aria-label={ `Color: ${ displayColor || 'none' }. Click to change.` }
						style={ {
							width: '32px',
							height: '32px',
							backgroundColor: displayColor || 'transparent',
							border: '1px solid #949494',
							borderRadius: '4px',
							cursor: 'pointer',
							padding: 0,
							backgroundImage: ! displayColor
								? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
								: 'none',
							backgroundSize: '8px 8px',
							backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
						} }
					/>
				</FlexItem>

				{ /* Text input for color value */ }
				<FlexBlock>
					<TextControl
						value={ displayColor }
						onChange={ handleTextChange }
						placeholder="#000000 or rgba(...)"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</FlexBlock>
			</Flex>

			{ /* Popup color picker */ }
			{ isPickerOpen && (
				<Popover
					anchor={ swatchRef.current }
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
							enableAlpha={ ! disableAlpha }
						/>

						<Flex
							justify="space-between"
							style={ {
								marginTop: '16px',
								borderTop: '1px solid #ddd',
								paddingTop: '12px',
							} }
						>
							<FlexItem>
								<Button variant="tertiary" onClick={ handleCancel }>
									Cancel
								</Button>
							</FlexItem>
							<FlexItem>
								<Button variant="primary" onClick={ handleConfirm }>
									Apply
								</Button>
							</FlexItem>
						</Flex>
					</div>
				</Popover>
			) }
		</BaseControl>
	);
}

export default ColorControl;
