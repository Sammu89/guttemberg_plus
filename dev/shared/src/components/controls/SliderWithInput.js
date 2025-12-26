/**
 * Slider With Input Component
 *
 * Combined slider and number input control with optional unit selector
 * and responsive device switching support.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useMemo } from '@wordpress/element';
import {
	BaseControl,
	RangeControl,
	Flex,
	FlexItem,
	FlexBlock,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { ResetButton } from './ResetButton';
import { useResponsiveDevice } from '../../hooks/useResponsiveDevice';

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
 * Check if value is a flat base (scalar or {value, unit} without device keys)
 *
 * @param {*} values - Value to check
 * @returns {boolean} True if flat base value
 */
function isFlat( values ) {
	if ( values === null || values === undefined ) {
		return true;
	}
	// Scalar (number or string)
	if ( typeof values !== 'object' ) {
		return true;
	}
	// Object with value/unit properties but no device keys
	const hasValueProp = 'value' in values || 'unit' in values;
	const hasDeviceKeys = 'desktop' in values || 'tablet' in values || 'mobile' in values;
	return hasValueProp && ! hasDeviceKeys;
}

/**
 * Get base value from responsive values
 * Base is either the flat value or extracted from device-keyed structure
 *
 * @param {*} values - Values (flat or object with device keys)
 * @returns {*} The base value
 */
function getBaseValue( values ) {
	if ( isFlat( values ) ) {
		return values;
	}
	// If object has device keys, extract base properties (excluding device keys)
	if ( typeof values === 'object' && values !== null ) {
		const { tablet, mobile, ...base } = values;
		// If base has properties (value, unit), return it; otherwise return null
		if ( Object.keys( base ).length > 0 ) {
			// Check if base is just an empty object or has actual values
			if ( base.value !== undefined || base.unit !== undefined ) {
				return base;
			}
			// Check for numeric value at root (legacy format)
			if ( base.desktop !== undefined ) {
				return base.desktop;
			}
		}
	}
	return null;
}

/**
 * Get inherited value for responsive slider values
 * Supports both flat base values and object with device keys
 *
 * @param {*} values - Flat value or object with device keys { tablet, mobile, ...base }
 * @param {string} device - Current device
 * @returns {Object} Object with value and inheritedFrom
 */
function getInheritedSliderValue( values, device ) {
	// Normalize value - can be number or { value, unit } object
	const normalize = ( val ) => {
		if ( val === undefined || val === null ) {
			return null;
		}
		return val;
	};

	// Get base value (desktop)
	const baseVal = normalize( getBaseValue( values ) );

	// If flat, base applies to all devices
	if ( isFlat( values ) ) {
		return {
			value: baseVal,
			inheritedFrom: device !== 'desktop' && baseVal !== null ? 'desktop' : null,
		};
	}

	// Object with device overrides
	const tabletVal = normalize( values?.tablet );
	const mobileVal = normalize( values?.mobile );

	switch ( device ) {
		case 'desktop':
			return {
				value: baseVal,
				inheritedFrom: null,
			};

		case 'tablet':
			if ( tabletVal !== null ) {
				return { value: tabletVal, inheritedFrom: null };
			}
			return {
				value: baseVal,
				inheritedFrom: baseVal !== null ? 'desktop' : null,
			};

		case 'mobile':
			if ( mobileVal !== null ) {
				return { value: mobileVal, inheritedFrom: null };
			}
			if ( tabletVal !== null ) {
				return { value: tabletVal, inheritedFrom: 'tablet' };
			}
			return {
				value: baseVal,
				inheritedFrom: baseVal !== null ? 'desktop' : null,
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
	// Use global device state - all responsive controls stay in sync
	const device = useResponsiveDevice();

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

	// Handler for native UnitControl changes (combines value and unit)
	const handleUnitControlChange = ( newValue ) => {
		const numericValue = parseFloat( newValue ) || 0;
		const newUnit = newValue?.replace( /[0-9.-]/g, '' ) || currentUnit;

		const finalValue = hasUnits
			? { value: numericValue, unit: newUnit }
			: numericValue;

		if ( isResponsive ) {
			onChange( device, finalValue );
		} else {
			onChange( finalValue );
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
							<DeviceSwitcher value={ device } />
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
				{ /* Slider and native UnitControl row */ }
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
						<FlexItem className="gutplus-slider-with-input__unit-control">
							<UnitControl
								value={ `${ displayValue }${ hasUnits ? currentUnit : '' }` }
								onChange={ handleUnitControlChange }
								units={ hasUnits ? units.map( ( u ) => ( { value: u, label: u } ) ) : [] }
								min={ min }
								max={ max }
								step={ step }
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
