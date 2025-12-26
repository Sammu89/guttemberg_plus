/**
 * Gradient Control Component
 *
 * Color/Gradient switcher with tabs for "Classic" (solid color)
 * and "Gradient" (CSS gradient) modes.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import {
	BaseControl,
	Button,
	ButtonGroup,
	ColorPicker,
	GradientPicker,
	Popover,
	TextControl,
	Flex,
	FlexItem,
	FlexBlock,
	TabPanel,
} from '@wordpress/components';
import { ResetButton } from './ResetButton';

/**
 * Detect if a value is a gradient or solid color
 *
 * @param {string} value - CSS color or gradient value
 * @returns {string} 'gradient' or 'classic'
 */
function detectColorType( value ) {
	if ( ! value || typeof value !== 'string' ) {
		return 'classic';
	}

	// Check for gradient keywords
	const gradientPatterns = [
		'linear-gradient',
		'radial-gradient',
		'conic-gradient',
		'repeating-linear-gradient',
		'repeating-radial-gradient',
		'repeating-conic-gradient',
	];

	const lowerValue = value.toLowerCase();
	return gradientPatterns.some( ( pattern ) => lowerValue.includes( pattern ) )
		? 'gradient'
		: 'classic';
}

/**
 * Default gradient presets
 */
const DEFAULT_GRADIENTS = [
	{
		name: 'Vivid cyan blue to vivid purple',
		gradient: 'linear-gradient(135deg, #0693e3 0%, #9b51e0 100%)',
		slug: 'vivid-cyan-blue-to-vivid-purple',
	},
	{
		name: 'Light green cyan to vivid green cyan',
		gradient: 'linear-gradient(135deg, #7adcb4 0%, #00d082 100%)',
		slug: 'light-green-cyan-to-vivid-green-cyan',
	},
	{
		name: 'Luminous vivid amber to luminous vivid orange',
		gradient: 'linear-gradient(135deg, #fcb900 0%, #ff6900 100%)',
		slug: 'luminous-vivid-amber-to-luminous-vivid-orange',
	},
	{
		name: 'Luminous vivid orange to vivid red',
		gradient: 'linear-gradient(135deg, #ff6900 0%, #cf2e2e 100%)',
		slug: 'luminous-vivid-orange-to-vivid-red',
	},
	{
		name: 'Very light gray to cyan bluish gray',
		gradient: 'linear-gradient(135deg, #eeeeee 0%, #a9b8c3 100%)',
		slug: 'very-light-gray-to-cyan-bluish-gray',
	},
	{
		name: 'Cool to warm spectrum',
		gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #ff9a9e 100%)',
		slug: 'cool-to-warm-spectrum',
	},
	{
		name: 'Blush',
		gradient: 'linear-gradient(135deg, #e8b7cc 0%, #fcb69f 100%)',
		slug: 'blush',
	},
	{
		name: 'Electric',
		gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		slug: 'electric',
	},
];

/**
 * Gradient Control Component
 *
 * A combined color/gradient control with tabbed interface for switching
 * between solid colors and CSS gradients.
 *
 * @param {Object}   props               Component props
 * @param {string}   props.label         Label for the control
 * @param {string}   props.value         Current color or gradient value
 * @param {Function} props.onChange      Callback when value changes
 * @param {Function} props.onReset       Optional custom reset callback
 * @param {string}   props.defaultValue  Default value for reset
 * @param {Array}    props.gradients     Custom gradient presets (optional)
 * @param {Array}    props.colors        Color palette for solid colors (optional)
 * @param {boolean}  props.disableAlpha  Whether to disable alpha channel (default: false)
 * @param {string}   props.help          Help text below the control
 * @param {boolean}  props.showReset     Whether to show reset button (default: true)
 * @returns {JSX.Element} Gradient control component
 */
export function GradientControl( {
	label,
	value,
	onChange,
	onReset,
	defaultValue = '',
	gradients = DEFAULT_GRADIENTS,
	colors,
	disableAlpha = false,
	help,
	showReset = true,
} ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ tempValue, setTempValue ] = useState( value || '' );
	const [ savedValue, setSavedValue ] = useState( value || '' );
	const [ activeTab, setActiveTab ] = useState( () => detectColorType( value ) );
	const buttonRef = useRef( null );

	// Sync temp value when value prop changes (only when picker is closed)
	useEffect( () => {
		if ( ! isPickerOpen ) {
			setTempValue( value || '' );
			setSavedValue( value || '' );
			setActiveTab( detectColorType( value ) );
		}
	}, [ value, isPickerOpen ] );

	/**
	 * Handle text input change - immediate update
	 *
	 * @param {string} newValue - New value from text input
	 */
	const handleTextChange = ( newValue ) => {
		onChange( newValue );
		setTempValue( newValue );
		setActiveTab( detectColorType( newValue ) );
	};

	/**
	 * Handle solid color change from picker
	 *
	 * @param {Object|string} color - Color from picker
	 */
	const handleColorChange = ( color ) => {
		let newColor;

		if ( typeof color === 'string' ) {
			newColor = color;
		} else if ( color.hex ) {
			if ( ! disableAlpha && color.rgb && color.rgb.a < 1 ) {
				const { r, g, b, a } = color.rgb;
				newColor = `rgba(${ r }, ${ g }, ${ b }, ${ a })`;
			} else {
				newColor = color.hex;
			}
		} else {
			newColor = value || '';
		}

		setTempValue( newColor );
	};

	/**
	 * Handle gradient change from picker
	 *
	 * @param {string} gradient - CSS gradient value
	 */
	const handleGradientChange = ( gradient ) => {
		setTempValue( gradient || '' );
	};

	/**
	 * Handle confirm button - save the selected value
	 */
	const handleConfirm = () => {
		onChange( tempValue );
		setSavedValue( tempValue );
		setIsPickerOpen( false );
	};

	/**
	 * Handle cancel button - revert to saved value
	 */
	const handleCancel = () => {
		setTempValue( savedValue );
		setActiveTab( detectColorType( savedValue ) );
		setIsPickerOpen( false );
	};

	/**
	 * Handle opening the picker
	 */
	const handleOpenPicker = () => {
		setSavedValue( value || '' );
		setTempValue( value || '' );
		setActiveTab( detectColorType( value ) );
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

	/**
	 * Handle tab change
	 *
	 * @param {string} tabName - Name of the selected tab
	 */
	const handleTabSelect = ( tabName ) => {
		setActiveTab( tabName );
	};

	// Display value (temp when picker is open)
	const displayValue = isPickerOpen ? tempValue : ( value || '' );

	// Determine if reset is disabled
	const isResetDisabled = value === defaultValue || ( ! value && ! defaultValue );

	// Generate preview style
	const getPreviewStyle = () => {
		const baseStyle = {
			width: '32px',
			height: '32px',
			border: '1px solid #ddd',
			borderRadius: '4px',
		};

		if ( ! displayValue ) {
			return {
				...baseStyle,
				backgroundImage:
					'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
				backgroundSize: '8px 8px',
				backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
			};
		}

		const type = detectColorType( displayValue );
		if ( type === 'gradient' ) {
			return {
				...baseStyle,
				backgroundImage: displayValue,
			};
		}

		return {
			...baseStyle,
			backgroundColor: displayValue,
		};
	};

	// Tab configuration
	const tabs = [
		{
			name: 'classic',
			title: 'Classic',
			className: 'gutplus-gradient-control__tab--classic',
		},
		{
			name: 'gradient',
			title: 'Gradient',
			className: 'gutplus-gradient-control__tab--gradient',
		},
	];

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
			className="gutplus-gradient-control"
		>
			<Flex gap={ 2 } align="flex-start">
				{ /* Color/gradient preview swatch */ }
				<FlexItem>
					<div
						className="gutplus-gradient-control__swatch"
						style={ getPreviewStyle() }
					/>
				</FlexItem>

				{ /* Text input for value */ }
				<FlexBlock>
					<TextControl
						value={ displayValue }
						onChange={ handleTextChange }
						placeholder="Color or gradient..."
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</FlexBlock>

				{ /* Button to open picker */ }
				<FlexItem>
					<Button
						ref={ buttonRef }
						variant="secondary"
						onClick={ handleOpenPicker }
						aria-expanded={ isPickerOpen }
						__next40pxDefaultSize
					>
						Choose
					</Button>
				</FlexItem>
			</Flex>

			{ /* Popup picker */ }
			{ isPickerOpen && (
				<Popover
					anchor={ buttonRef.current }
					position="bottom right"
					onClose={ handleCancel }
					focusOnMount={ false }
					noArrow={ false }
				>
					<div style={ { padding: '16px', minWidth: '280px' } }>
						{ /* Tab switcher */ }
						<TabPanel
							className="gutplus-gradient-control__tabs"
							tabs={ tabs }
							onSelect={ handleTabSelect }
							initialTabName={ activeTab }
						>
							{ ( tab ) => (
								<div style={ { marginTop: '16px' } }>
									{ tab.name === 'classic' && (
										<ColorPicker
											color={ tempValue }
											onChange={ handleColorChange }
											onChangeComplete={ handleColorChange }
											enableAlpha={ ! disableAlpha }
										/>
									) }

									{ tab.name === 'gradient' && (
										<GradientPicker
											value={ tempValue }
											onChange={ handleGradientChange }
											gradients={ gradients }
										/>
									) }
								</div>
							) }
						</TabPanel>

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

export default GradientControl;
