/**
 * Slider With Input Component
 *
 * Combined slider and number input control with optional unit selector
 * and responsive device switching support.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useState, useMemo } from '@wordpress/element';
import {
	BaseControl,
	RangeControl,
	Flex,
	FlexItem,
	FlexBlock,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { UnitSelector } from './UnitSelector';
import { ResetButton } from './ResetButton';

/**
 * Inherited Badge Component
 *
 * @param {Object} props - Component props
 * @param {string} props.from - Device name the value is inherited from
 * @returns {JSX.Element|null} Badge element or null
 */
function InheritedBadge( { from } ) {
	if ( ! from ) {
		return null;
	}

	const labels = {
		desktop: 'Desktop',
		tablet: 'Tablet',
		mobile: 'Mobile',
	};

	return (
		<span
			className="gutplus-inherited-badge"
			style={ {
				fontSize: '10px',
				backgroundColor: '#e0e0e0',
				color: '#666',
				padding: '2px 6px',
				borderRadius: '3px',
				marginLeft: '8px',
				fontWeight: 500,
				textTransform: 'uppercase',
				letterSpacing: '0.5px',
			} }
		>
			{ `From ${ labels[ from ] || from }` }
		</span>
	);
}

/**
 * Get inherited value for responsive slider values
 *
 * @param {Object} values - Object with desktop, tablet, mobile values
 * @param {string} device - Current device
 * @returns {Object} Object with value and inheritedFrom
 */
function getInheritedSliderValue( values, device ) {
	const { desktop, tablet, mobile } = values || {};

	// Normalize value - can be number or { value, unit } object
	const normalize = ( val ) => {
		if ( val === undefined || val === null ) {
			return null;
		}
		return val;
	};

	const desktopVal = normalize( desktop );
	const tabletVal = normalize( tablet );
	const mobileVal = normalize( mobile );

	switch ( device ) {
		case 'desktop':
			return {
				value: desktopVal,
				inheritedFrom: null,
			};

		case 'tablet':
			if ( tabletVal !== null ) {
				return { value: tabletVal, inheritedFrom: null };
			}
			return {
				value: desktopVal,
				inheritedFrom: desktopVal !== null ? 'desktop' : null,
			};

		case 'mobile':
			if ( mobileVal !== null ) {
				return { value: mobileVal, inheritedFrom: null };
			}
			if ( tabletVal !== null ) {
				return { value: tabletVal, inheritedFrom: 'tablet' };
			}
			return {
				value: desktopVal,
				inheritedFrom: desktopVal !== null ? 'desktop' : null,
			};

		default:
			return { value: null, inheritedFrom: null };
	}
}

/**
 * Parse value to extract numeric value and unit
 *
 * @param {*} value - Value to parse (number, string with unit, or object)
 * @param {string} defaultUnit - Default unit if none found
 * @returns {Object} Object with { numericValue, unit }
 */
function parseValue( value, defaultUnit = 'px' ) {
	if ( value === null || value === undefined ) {
		return { numericValue: null, unit: defaultUnit };
	}

	// Object with value and unit properties
	if ( typeof value === 'object' && value !== null ) {
		return {
			numericValue: value.value ?? null,
			unit: value.unit ?? defaultUnit,
		};
	}

	// Plain number
	if ( typeof value === 'number' ) {
		return { numericValue: value, unit: defaultUnit };
	}

	// String with unit (e.g., "16px", "1.5em")
	if ( typeof value === 'string' ) {
		const match = value.match( /^(-?\d+(?:\.\d+)?)\s*(.*)$/ );
		if ( match ) {
			return {
				numericValue: parseFloat( match[ 1 ] ),
				unit: match[ 2 ] || defaultUnit,
			};
		}
	}

	return { numericValue: null, unit: defaultUnit };
}

/**
 * Slider With Input Component
 *
 * A combined slider and number input with optional responsive support
 * and unit selection.
 *
 * @param {Object}   props                Component props
 * @param {string}   props.label          Label for the control
 * @param {*}        props.value          Single value (for non-responsive mode)
 * @param {Object}   props.values         Responsive values { desktop, tablet, mobile }
 * @param {Function} props.onChange       Callback for value changes
 * @param {Function} props.onReset        Optional reset callback
 * @param {boolean}  props.responsive     Whether to enable responsive mode (default: false)
 * @param {Array}    props.units          Array of available units (enables unit selector)
 * @param {string}   props.help           Help text
 * @param {number}   props.min            Minimum value (default: 0)
 * @param {number}   props.max            Maximum value (default: 100)
 * @param {number}   props.step           Step increment (default: 1)
 * @param {*}        props.defaultValue   Default value for reset
 * @param {boolean}  props.withInputField Whether to show number input (default: true)
 * @param {string}   props.initialDevice  Initial device (default: 'desktop')
 * @returns {JSX.Element} Slider with input component
 */
export function SliderWithInput( {
	label,
	value: singleValue,
	values,
	onChange,
	onReset,
	responsive = false,
	units,
	help,
	min = 0,
	max = 100,
	step = 1,
	defaultValue,
	withInputField = true,
	initialDevice = 'desktop',
} ) {
	const [ device, setDevice ] = useState( initialDevice );

	// Determine if we're in responsive mode
	const isResponsive = responsive && values !== undefined;

	// Get the effective value
	const { value: effectiveRawValue, inheritedFrom } = useMemo( () => {
		if ( isResponsive ) {
			return getInheritedSliderValue( values, device );
		}
		return { value: singleValue, inheritedFrom: null };
	}, [ isResponsive, values, device, singleValue ] );

	// Parse the value to get numeric value and unit
	const defaultUnit = units?.[ 0 ] || 'px';
	const { numericValue, unit: currentUnit } = parseValue( effectiveRawValue, defaultUnit );

	const hasUnits = units && units.length > 0;

	// Handler for slider/number value changes
	const handleValueChange = ( newNumericValue ) => {
		const newValue = hasUnits
			? { value: newNumericValue, unit: currentUnit }
			: newNumericValue;

		if ( isResponsive ) {
			onChange( device, newValue );
		} else {
			onChange( newValue );
		}
	};

	// Handler for unit changes
	const handleUnitChange = ( newUnit ) => {
		const newValue = { value: numericValue ?? 0, unit: newUnit };

		if ( isResponsive ) {
			onChange( device, newValue );
		} else {
			onChange( newValue );
		}
	};

	// Handler for reset
	const handleReset = () => {
		if ( onReset ) {
			if ( isResponsive ) {
				onReset( device );
			} else {
				onReset();
			}
		} else {
			if ( isResponsive ) {
				onChange( device, undefined );
			} else {
				onChange( defaultValue );
			}
		}
	};

	// Check if reset should be disabled
	const isResetDisabled = isResponsive
		? values?.[ device ] === undefined || values?.[ device ] === null
		: singleValue === undefined || singleValue === defaultValue;

	// Build the label with header controls
	const renderLabel = () => (
		<Flex align="center" justify="space-between" style={ { width: '100%' } }>
			<FlexItem>
				<span style={ { display: 'flex', alignItems: 'center' } }>
					{ label }
					{ isResponsive && <InheritedBadge from={ inheritedFrom } /> }
				</span>
			</FlexItem>
			<FlexItem>
				<Flex gap={ 2 }>
					{ isResponsive && (
						<FlexItem>
							<DeviceSwitcher value={ device } onChange={ setDevice } />
						</FlexItem>
					) }
					<FlexItem>
						<ResetButton onClick={ handleReset } disabled={ isResetDisabled } />
					</FlexItem>
				</Flex>
			</FlexItem>
		</Flex>
	);

	// Display value for the slider
	const displayValue = numericValue ?? defaultValue ?? min;

	return (
		<BaseControl
			className="gutplus-slider-with-input"
			label={ renderLabel() }
			help={ help }
		>
			<div className="gutplus-slider-with-input__content">
				{ /* Unit selector if units provided */ }
				{ hasUnits && (
					<div style={ { marginBottom: '12px' } }>
						<UnitSelector
							value={ currentUnit }
							onChange={ handleUnitChange }
							units={ units }
						/>
					</div>
				) }

				{ /* Slider and number input row */ }
				<Flex align="center" gap={ 4 }>
					<FlexBlock>
						<RangeControl
							value={ displayValue }
							onChange={ handleValueChange }
							min={ min }
							max={ max }
							step={ step }
							withInputField={ false }
							__nextHasNoMarginBottom
						/>
					</FlexBlock>
					{ withInputField && (
						<FlexItem>
							<NumberControl
								value={ displayValue }
								onChange={ ( val ) => handleValueChange( parseFloat( val ) || 0 ) }
								min={ min }
								max={ max }
								step={ step }
								hideHTMLArrows
								spinControls="none"
								style={ { width: '70px' } }
								__next40pxDefaultSize
							/>
						</FlexItem>
					) }
				</Flex>
			</div>
		</BaseControl>
	);
}

export default SliderWithInput;
