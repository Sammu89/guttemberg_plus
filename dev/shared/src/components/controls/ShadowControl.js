/**
 * Shadow Control Component
 *
 * Shadow presets + custom text input + color picker.
 * Provides 5 preset shadow levels (none, subtle, medium, strong, heavy)
 * with SVG icons, plus a custom CSS input and shadow color picker.
 *
 * @package guttemberg-plus
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
import { IconButton } from './IconButton';
import { ResetButton } from './ResetButton';

/**
 * Shadow Preset Icons
 *
 * Inline SVG icons representing shadow intensity levels.
 */

/**
 * No shadow icon - empty box
 */
const NoShadowIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
	>
		<rect x="5" y="5" width="14" height="14" rx="2" />
		<line x1="5" y1="5" x2="19" y2="19" strokeWidth="1" opacity="0.5" />
	</svg>
);

/**
 * Subtle shadow icon - light blur
 */
const SubtleShadowIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
	>
		<rect x="7" y="7" width="12" height="12" rx="2" fill="currentColor" opacity="0.1" />
		<rect x="5" y="5" width="12" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

/**
 * Medium shadow icon - moderate blur
 */
const MediumShadowIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
	>
		<rect x="8" y="8" width="12" height="12" rx="2" fill="currentColor" opacity="0.2" />
		<rect x="5" y="5" width="12" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

/**
 * Strong shadow icon - heavier blur
 */
const StrongShadowIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
	>
		<rect x="9" y="9" width="12" height="12" rx="2" fill="currentColor" opacity="0.3" />
		<rect x="5" y="5" width="12" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

/**
 * Heavy shadow icon - deep shadow
 */
const HeavyShadowIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
	>
		<rect x="10" y="10" width="12" height="12" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="5" y="5" width="12" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

/**
 * Shadow preset definitions
 */
const SHADOW_PRESETS = [
	{
		name: 'none',
		label: 'None',
		icon: <NoShadowIcon />,
		value: 'none',
	},
	{
		name: 'subtle',
		label: 'Subtle',
		icon: <SubtleShadowIcon />,
		value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
	},
	{
		name: 'medium',
		label: 'Medium',
		icon: <MediumShadowIcon />,
		value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
	},
	{
		name: 'strong',
		label: 'Strong',
		icon: <StrongShadowIcon />,
		value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
	},
	{
		name: 'heavy',
		label: 'Heavy',
		icon: <HeavyShadowIcon />,
		value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
	},
];

/**
 * Extract color from box-shadow value
 *
 * @param {string} shadowValue - CSS box-shadow value
 * @returns {string} Extracted color or default
 */
function extractShadowColor( shadowValue ) {
	if ( ! shadowValue || shadowValue === 'none' ) {
		return 'rgba(0, 0, 0, 0.1)';
	}

	// Match rgba or rgb
	const rgbaMatch = shadowValue.match( /rgba?\([^)]+\)/ );
	if ( rgbaMatch ) {
		return rgbaMatch[ 0 ];
	}

	// Match hex colors
	const hexMatch = shadowValue.match( /#[0-9a-fA-F]{3,8}/ );
	if ( hexMatch ) {
		return hexMatch[ 0 ];
	}

	return 'rgba(0, 0, 0, 0.1)';
}

/**
 * Replace color in box-shadow value
 *
 * @param {string} shadowValue - Original shadow value
 * @param {string} newColor    - New color to use
 * @returns {string} Updated shadow value
 */
function replaceShadowColor( shadowValue, newColor ) {
	if ( ! shadowValue || shadowValue === 'none' ) {
		return shadowValue;
	}

	// Replace rgba/rgb patterns
	let result = shadowValue.replace( /rgba?\([^)]+\)/g, newColor );

	// If no replacement happened, try hex colors
	if ( result === shadowValue ) {
		result = shadowValue.replace( /#[0-9a-fA-F]{3,8}/g, newColor );
	}

	return result;
}

/**
 * Detect which preset matches the current value
 *
 * @param {string} value - Current shadow value
 * @returns {string|null} Preset name or null for custom
 */
function detectPreset( value ) {
	if ( ! value || value === 'none' ) {
		return 'none';
	}

	// Normalize for comparison (remove extra spaces)
	const normalized = value.replace( /\s+/g, ' ' ).trim();

	for ( const preset of SHADOW_PRESETS ) {
		const presetNormalized = preset.value.replace( /\s+/g, ' ' ).trim();
		if ( normalized === presetNormalized ) {
			return preset.name;
		}
	}

	return null; // Custom value
}

/**
 * Shadow Control Component
 *
 * A comprehensive shadow control with preset buttons, custom CSS input,
 * and shadow color picker.
 *
 * @param {Object}   props              Component props
 * @param {string}   props.label        Label for the control
 * @param {string}   props.value        Current shadow value (CSS box-shadow)
 * @param {Function} props.onChange     Callback when shadow changes
 * @param {Function} props.onReset      Optional custom reset callback
 * @param {string}   props.defaultValue Default value for reset
 * @param {string}   props.help         Help text below the control
 * @param {boolean}  props.showReset    Whether to show reset button (default: true)
 * @returns {JSX.Element} Shadow control component
 */
export function ShadowControl( {
	label = 'Box Shadow',
	value,
	onChange,
	onReset,
	defaultValue = 'none',
	help,
	showReset = true,
} ) {
	const [ isColorPickerOpen, setIsColorPickerOpen ] = useState( false );
	const [ tempColor, setTempColor ] = useState( () => extractShadowColor( value ) );
	const colorButtonRef = useRef( null );

	// Sync temp color when value changes
	useEffect( () => {
		if ( ! isColorPickerOpen ) {
			setTempColor( extractShadowColor( value ) );
		}
	}, [ value, isColorPickerOpen ] );

	const activePreset = detectPreset( value );
	const isCustom = activePreset === null;

	/**
	 * Handle preset selection
	 *
	 * @param {string} presetName - Name of selected preset
	 */
	const handlePresetSelect = ( presetName ) => {
		const preset = SHADOW_PRESETS.find( ( p ) => p.name === presetName );
		if ( preset ) {
			// Apply current color to preset if not 'none'
			if ( preset.name !== 'none' && tempColor ) {
				onChange( replaceShadowColor( preset.value, tempColor ) );
			} else {
				onChange( preset.value );
			}
		}
	};

	/**
	 * Handle custom text input change
	 *
	 * @param {string} newValue - New shadow CSS value
	 */
	const handleTextChange = ( newValue ) => {
		onChange( newValue );
		setTempColor( extractShadowColor( newValue ) );
	};

	/**
	 * Handle color picker change
	 *
	 * @param {Object|string} color - Color from picker
	 */
	const handleColorChange = ( color ) => {
		let newColor;

		if ( typeof color === 'string' ) {
			newColor = color;
		} else if ( color.rgb ) {
			const { r, g, b, a } = color.rgb;
			newColor = `rgba(${ r }, ${ g }, ${ b }, ${ a ?? 1 })`;
		} else if ( color.hex ) {
			newColor = color.hex;
		} else {
			return;
		}

		setTempColor( newColor );

		// Apply color to current shadow
		if ( value && value !== 'none' ) {
			onChange( replaceShadowColor( value, newColor ) );
		}
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

	/**
	 * Handle clear button - set to none
	 */
	const handleClear = () => {
		onChange( 'none' );
	};

	// Determine if reset is disabled
	const isResetDisabled = value === defaultValue || ( ! value && defaultValue === 'none' );

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
			className="gutplus-shadow-control"
		>
			<div className="gutplus-shadow-control__content">
				{ /* Preset buttons */ }
				<div
					className="gutplus-shadow-control__presets"
					style={ {
						display: 'flex',
						gap: '4px',
						marginBottom: '12px',
						flexWrap: 'wrap',
					} }
				>
					{ SHADOW_PRESETS.map( ( preset ) => (
						<IconButton
							key={ preset.name }
							icon={ preset.icon }
							label={ preset.label }
							isSelected={ activePreset === preset.name }
							onClick={ () => handlePresetSelect( preset.name ) }
						/>
					) ) }
				</div>

				{ /* Custom CSS input */ }
				<Flex gap={ 2 } align="flex-start" style={ { marginBottom: '12px' } }>
					<FlexBlock>
						<TextControl
							value={ value || '' }
							onChange={ handleTextChange }
							placeholder="Custom box-shadow CSS..."
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</FlexBlock>
					<FlexItem>
						<Button
							variant="secondary"
							onClick={ handleClear }
							disabled={ ! value || value === 'none' }
							__next40pxDefaultSize
						>
							Clear
						</Button>
					</FlexItem>
				</Flex>

				{ /* Shadow color picker */ }
				<Flex gap={ 2 } align="center">
					<FlexItem>
						<span style={ { fontSize: '12px', color: '#757575' } }>
							Shadow Color:
						</span>
					</FlexItem>
					<FlexItem>
						<Button
							ref={ colorButtonRef }
							onClick={ () => setIsColorPickerOpen( ! isColorPickerOpen ) }
							style={ {
								padding: '4px',
								minWidth: 'auto',
								border: '1px solid #ddd',
								borderRadius: '4px',
							} }
							aria-expanded={ isColorPickerOpen }
						>
							<span
								style={ {
									display: 'block',
									width: '24px',
									height: '24px',
									backgroundColor: tempColor,
									borderRadius: '2px',
								} }
							/>
						</Button>
					</FlexItem>
					<FlexItem>
						<span style={ { fontSize: '11px', color: '#999' } }>
							{ tempColor }
						</span>
					</FlexItem>
				</Flex>

				{ /* Color picker popover */ }
				{ isColorPickerOpen && (
					<Popover
						anchor={ colorButtonRef.current }
						position="bottom left"
						onClose={ () => setIsColorPickerOpen( false ) }
						focusOnMount={ false }
					>
						<div style={ { padding: '16px' } }>
							<ColorPicker
								color={ tempColor }
								onChange={ handleColorChange }
								onChangeComplete={ handleColorChange }
								enableAlpha={ true }
							/>
							<Flex justify="flex-end" style={ { marginTop: '12px' } }>
								<Button
									variant="primary"
									onClick={ () => setIsColorPickerOpen( false ) }
								>
									Done
								</Button>
							</Flex>
						</div>
					</Popover>
				) }
			</div>
		</BaseControl>
	);
}

/**
 * Export shadow presets for external use
 */
export { SHADOW_PRESETS };

/**
 * Export individual icons for use in other components
 */
export const ShadowIcons = {
	NoShadowIcon,
	SubtleShadowIcon,
	MediumShadowIcon,
	StrongShadowIcon,
	HeavyShadowIcon,
};

export default ShadowControl;
