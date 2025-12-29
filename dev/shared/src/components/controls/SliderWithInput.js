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
	getPropertyScale,
	getUnitConfig,
	isRotationTransform,
	getAvailableUnits,
	isUnitlessProperty,
	parseValueWithUnit,
} from '../../config/css-property-scales.mjs';

/**
 * Get scale values for a given CSS property and unit
 *
 * @param {string} cssProperty - CSS property name (e.g., 'font-size', 'padding')
 * @param {string} unit - Current unit
 * @param {string} attrName - Attribute name (for rotation detection)
 * @param {*} defaultValue - Default value (for rotation detection)
 * @returns {Object} Scale values { min, max, step }
 */
function getUnitScale( cssProperty, unit, attrName, defaultValue ) {
	// Check for rotation transform
	if ( cssProperty === 'transform' && isRotationTransform( attrName, defaultValue ) ) {
		const config = getUnitConfig( 'transform', 'deg' );
		return config || { min: -180, max: 180, step: 1 };
	}

	const config = getUnitConfig( cssProperty, unit );
	return config || { min: 0, max: 100, step: 1 };
}

import {
	BaseControl,
	RangeControl,
	Flex,
	FlexItem,
	FlexBlock,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { ResetButton } from './ResetButton';
import { ResponsiveToggle } from './atoms/ResponsiveToggle';
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
		global: 'Global',
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
	const hasDeviceKeys = 'global' in values || 'tablet' in values || 'mobile' in values;
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

	// Get base value (global)
	const baseVal = normalize( getBaseValue( values ) );

	// If flat, base applies to all devices
	if ( isFlat( values ) ) {
		return {
			value: baseVal,
			inheritedFrom: device !== 'global' && baseVal !== null ? 'global' : null,
		};
	}

	// Object with device overrides
	const tabletVal = normalize( values?.tablet );
	const mobileVal = normalize( values?.mobile );

	switch ( device ) {
		case 'global':
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
				inheritedFrom: baseVal !== null ? 'global' : null,
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
				inheritedFrom: baseVal !== null ? 'global' : null,
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
		if ( typeof value.value === 'string' ) {
			const match = value.value.trim().match( /^(-?\d+(?:\.\d+)?)\s*(.*)$/ );
			if ( ! match ) {
				return { numericValue: null, unit: value.unit ?? defaultUnit };
			}
			const parsed = parseValueWithUnit( value.value );
			return {
				numericValue: parsed.value,
				unit: value.unit ?? parsed.unit ?? defaultUnit,
			};
		}
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
 * and unit selection. Supports dynamic unit scales for automatic min/max/step.
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses a SCALAR pattern, NOT the box pattern (like SpacingControl).
 *
 * NON-RESPONSIVE MODE (responsive: false):
 * ----------------------------------------
 * value prop accepts:
 *   - Plain number: 16
 *   - String with unit: "1.125rem"
 *   - Object with value/unit: { value: 1.125, unit: "rem" }
 *
 * onChange callback signature:
 *   onChange(newValue)
 *   - If units provided: calls with { value: number, unit: string }
 *   - If no units: calls with plain number or string
 *
 * RESPONSIVE MODE (responsive: true):
 * ------------------------------------
 * values prop structure:
 *
 *   FLAT (base/global only):
 *   { value: 1.125, unit: "rem" }
 *   OR
 *   "1.125rem"  (plain string)
 *   OR
 *   1.125  (plain number)
 *
 *   WITH DEVICE OVERRIDES:
 *   {
 *     value: 1.125,           // BASE (global)
 *     unit: "rem",            // BASE unit
 *     tablet: { value: 1, unit: "rem" },    // Tablet override
 *     mobile: { value: 0.875, unit: "rem" } // Mobile override
 *   }
 *
 * IMPORTANT: Global value is the BASE (flat), NOT under a "global" key!
 * Tablet and mobile are OVERRIDES added to the base object.
 *
 * onChange callback signature:
 *   onChange(device, newValue)
 *   - device: "global" | "tablet" | "mobile"
 *   - newValue: same format as non-responsive (number, string, or { value, unit })
 *
 * The parent (ControlRenderer) handles merging device values into the final structure.
 *
 * ============================================================================
 *
 * @param {Object}   props                Component props
 * @param {string}   props.label          Label for the control
 * @param {*}        props.value          Single value (for non-responsive mode) - see DATA STRUCTURE above
 * @param {Object}   props.values         Responsive values - see DATA STRUCTURE above
 * @param {Function} props.onChange       Callback for value changes - see DATA STRUCTURE above
 * @param {Function} props.onReset        Optional reset callback
 * @param {boolean}  props.responsive     Whether to enable responsive mode (default: false)
 * @param {Array}    props.units          Array of available units (enables unit selector)
 * @param {string}   props.cssProperty    CSS property name for automatic scale lookup (e.g., 'font-size', 'padding')
 * @param {string}   props.attrName       Attribute name (used for rotation transform detection)
 * @param {string}   props.help           Help text
 * @param {number}   props.min            Minimum value (overrides scale, default: from scale or 0)
 * @param {number}   props.max            Maximum value (overrides scale, default: from scale or 100)
 * @param {number}   props.step           Step increment (overrides scale, default: from scale or 1)
 * @param {*}        props.defaultValue   Default value for reset
 * @param {boolean}  props.withInputField Whether to show number input (default: true)
 * @param {string}   props.initialDevice  Initial device (default: 'global')
 * @returns {JSX.Element} Slider with input component
 */
export function SliderWithInput( {
	label,
	value: singleValue,
	values,
	onChange,
	onReset,
	responsive = false,
	canBeResponsive = false,
	responsiveEnabled = false,
	onResponsiveToggle,
	onResponsiveReset,
	units,
	cssProperty,
	attrName,
	help,
	min: propMin,
	max: propMax,
	step: propStep,
	defaultValue,
	withInputField = true,
	initialDevice = 'global',
} ) {
	// Use global device state - all responsive controls stay in sync
	const device = useResponsiveDevice();

	// Determine if we're in responsive mode
	const isResponsive = responsive && values !== undefined;

	// Get the effective value
	// When responsive mode is ON: use getInheritedSliderValue to handle device inheritance
	// When responsive mode is OFF but values is passed: extract base value from values
	// When non-responsive: use singleValue directly
	const { value: effectiveRawValue, inheritedFrom } = useMemo( () => {
		if ( isResponsive ) {
			return getInheritedSliderValue( values, device );
		}
		// Not in responsive mode - check both singleValue and values
		// ControlRenderer passes `values` for responsive-capable attributes even when
		// responsive mode is currently disabled (canBeResponsive=true, responsive=false)
		if ( singleValue !== undefined ) {
			return { value: singleValue, inheritedFrom: null };
		}
		// Fallback: extract base value from values if passed
		// This handles the case where ControlRenderer always passes `values` prop
		// for attributes that support responsive mode (even when disabled)
		if ( values !== undefined ) {
			const baseValue = getBaseValue( values );
			return { value: baseValue, inheritedFrom: null };
		}
		return { value: undefined, inheritedFrom: null };
	}, [ isResponsive, values, device, singleValue ] );

	// Parse the value to get numeric value and unit
	const defaultUnit = units?.[ 0 ] || 'px';
	const { numericValue, unit: currentUnit } = parseValue( effectiveRawValue, defaultUnit );

	const hasUnits = units && units.length > 0;

	// Get dynamic scale based on CSS property and current unit
	const unitScale = cssProperty
		? getUnitScale( cssProperty, currentUnit, attrName, defaultValue )
		: { min: 0, max: 100, step: 1 };

	// Use prop overrides if provided, otherwise use scale values
	const min = propMin ?? unitScale.min;
	const max = propMax ?? unitScale.max;
	const step = propStep ?? unitScale.step;

	// Check if we should use responsive callback pattern
	// This is true when:
	// 1. isResponsive is true (user enabled responsive mode)
	// 2. OR values is passed (responsive-capable attribute, even if responsive mode is off)
	// ControlRenderer always passes handleResponsiveChange for responsive-capable attributes
	const useResponsiveCallback = isResponsive || values !== undefined;

	// Determine which device to use for callbacks:
	// - When responsive mode is ON: use the global device (user-selected)
	// - When responsive mode is OFF: ALWAYS use 'global' (base/global value)
	// This prevents creating device overrides when user just wants to change the base value
	const callbackDevice = isResponsive ? device : 'global';

	// Handler for slider/number value changes
	const handleValueChange = ( newNumericValue ) => {
		const newValue = hasUnits
			? { value: newNumericValue, unit: currentUnit }
			: newNumericValue;

		if ( useResponsiveCallback ) {
			// Use callbackDevice: 'global' when responsive OFF, actual device when ON
			onChange( callbackDevice, newValue );
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

		if ( useResponsiveCallback ) {
			// Use callbackDevice: 'global' when responsive OFF, actual device when ON
			onChange( callbackDevice, finalValue );
		} else {
			onChange( finalValue );
		}
	};

	// Handler for reset
	const handleReset = () => {
		if ( onReset ) {
			if ( useResponsiveCallback ) {
				onReset( callbackDevice );
			} else {
				onReset();
			}
		} else {
			if ( useResponsiveCallback ) {
				// Use callbackDevice for consistency
				onChange( callbackDevice, undefined );
			} else {
				onChange( defaultValue );
			}
		}
	};

	// Check if reset should be disabled
	// Use the effective value we computed earlier for consistency
	const isResetDisabled = useMemo( () => {
		if ( isResponsive ) {
			// In responsive mode, check if current device has an override
			return values?.[ device ] === undefined || values?.[ device ] === null;
		}
		if ( values !== undefined ) {
			// Responsive-capable but not in responsive mode: check base value
			const baseValue = getBaseValue( values );
			return baseValue === undefined || baseValue === null ||
				JSON.stringify( baseValue ) === JSON.stringify( defaultValue );
		}
		// Non-responsive: check singleValue
		return singleValue === undefined || singleValue === defaultValue;
	}, [ isResponsive, values, device, singleValue, defaultValue ] );

	// Handler for responsive reset (discard device overrides and disable responsive)
	const handleResponsiveResetClick = () => {
		if ( onResponsiveReset ) {
			onResponsiveReset();
		} else {
			handleReset();
		}
	};

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
				{ canBeResponsive ? (
						<ResponsiveToggle
							isEnabled={ responsiveEnabled }
							onToggle={ onResponsiveToggle }
							currentDevice={ device }
							onReset={ handleResponsiveResetClick }
							isResetDisabled={ isResetDisabled && ! responsiveEnabled }
						/>
				) : (
					<ResetButton onClick={ handleReset } disabled={ isResetDisabled } />
				) }
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
