/**
 * Responsive Wrapper Component
 *
 * Wraps any control with device switcher for responsive editing.
 * Provides value inheritance logic (mobile inherits tablet, tablet inherits global/base).
 * Shows an inherited badge when value comes from a larger breakpoint.
 *
 * Uses FLAT BASE structure:
 * - Base/global values at ROOT level: { value: 10, unit: 'px', tablet: {...}, mobile: {...} }
 * - NOT under a 'global' or 'desktop' key
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useState, useMemo } from '@wordpress/element';
import { BaseControl, Flex, FlexItem, FlexBlock } from '@wordpress/components';
import { DeviceSwitcher } from './atoms/DeviceSwitcher';
import { ResetButton } from './ResetButton';
import { useResponsiveDevice } from '../../hooks/useResponsiveDevice';

/**
 * Extract the base/global value from a flat responsive structure
 * Base value is at root level, not under a key
 *
 * @param {Object} vals - Responsive values object
 * @returns {*} Base value object or null
 */
function getBaseValue( vals ) {
	if ( ! vals || typeof vals !== 'object' ) {
		return vals;
	}
	const { tablet, mobile, ...base } = vals;
	return Object.keys( base ).length > 0 ? base : null;
}

/**
 * Get the inherited value for a device based on cascade logic
 * Mobile inherits from tablet, tablet inherits from global/base
 *
 * Uses FLAT BASE structure where base values are at root level
 *
 * @param {Object} values - Object with base values at root, tablet, mobile as keys
 * @param {string} device - Current device (global, tablet, mobile)
 * @returns {Object} Object with value and inheritedFrom (null if not inherited)
 */
function getInheritedValue( values, device ) {
	const baseValue = getBaseValue( values );
	const tabletValue = values?.tablet;
	const mobileValue = values?.mobile;

	switch ( device ) {
		case 'global':
			return {
				value: baseValue ?? null,
				inheritedFrom: null,
			};

		case 'tablet':
			if ( tabletValue !== undefined && tabletValue !== null ) {
				return { value: tabletValue, inheritedFrom: null };
			}
			return {
				value: baseValue ?? null,
				inheritedFrom: baseValue !== undefined && baseValue !== null ? 'global' : null,
			};

		case 'mobile':
			if ( mobileValue !== undefined && mobileValue !== null ) {
				return { value: mobileValue, inheritedFrom: null };
			}
			if ( tabletValue !== undefined && tabletValue !== null ) {
				return { value: tabletValue, inheritedFrom: 'tablet' };
			}
			return {
				value: baseValue ?? null,
				inheritedFrom: baseValue !== undefined && baseValue !== null ? 'global' : null,
			};

		default:
			return { value: null, inheritedFrom: null };
	}
}

/**
 * Responsive Wrapper Component
 *
 * Wraps any control to add responsive (device-based) editing capabilities.
 * Uses global device state for synchronization across all controls.
 *
 * Uses FLAT BASE structure:
 * - Base/global values at ROOT level: { value: 10, unit: 'px', tablet: {...}, mobile: {...} }
 * - NOT under a 'global' key
 *
 * @param {Object}      props                  Component props
 * @param {string}      props.label            Label for the control
 * @param {Object}      props.values           Object with base values at root, tablet/mobile as keys
 * @param {Function}    props.onChange         Callback receiving (device, value)
 * @param {Function}    props.onReset          Callback for reset button (optional)
 * @param {boolean}     props.showReset        Whether to show reset button (default: true)
 * @param {*}           props.defaultValue     Default value for comparison
 * @param {string}      props.help             Help text for the control
 * @param {string}      props.initialDevice    (Deprecated - uses global device state)
 * @param {JSX.Element} props.children         Render prop function receiving (effectiveValue, device, isInherited)
 * @returns {JSX.Element} Responsive-wrapped control
 */
export function ResponsiveWrapper( {
	label,
	values = {},
	onChange,
	onReset,
	showReset = true,
	defaultValue,
	help,
	initialDevice = 'global',
	children,
} ) {
	// Use global device state instead of local state for synchronization across all controls
	const device = useResponsiveDevice();

	// Calculate inherited value for current device
	const { value: effectiveValue, inheritedFrom } = useMemo(
		() => getInheritedValue( values, device ),
		[ values, device ]
	);

	const isInherited = inheritedFrom !== null;

	// Determine if reset should be disabled
	// For 'global' device, check base value; for tablet/mobile, check the key directly
	const currentDeviceValue = device === 'global' ? getBaseValue( values ) : values?.[ device ];
	const isResetDisabled = currentDeviceValue === undefined || currentDeviceValue === null;

	// Handler for value changes
	const handleChange = ( newValue ) => {
		onChange( device, newValue );
	};

	// Handler for reset
	const handleReset = () => {
		if ( onReset ) {
			onReset( device );
		} else {
			// Default reset behavior: set device value to undefined
			onChange( device, undefined );
		}
	};

	return (
		<BaseControl
			label={
				<Flex align="center" justify="space-between" style={ { width: '100%' } }>
					<FlexItem>
						<span style={ { display: 'flex', alignItems: 'center' } }>
							{ label }
						</span>
					</FlexItem>
					<FlexItem>
						<Flex gap={ 1 } align="center" style={ { flexWrap: 'nowrap' } }>
							<FlexItem style={ { flexShrink: 0 } }>
								<DeviceSwitcher value={ device } />
							</FlexItem>
							{ showReset && (
								<FlexItem style={ { flexShrink: 0, marginLeft: '4px' } }>
									<ResetButton
										onClick={ handleReset }
										disabled={ isResetDisabled }
									/>
								</FlexItem>
							) }
						</Flex>
					</FlexItem>
				</Flex>
			}
			help={ help }
			className="gutplus-responsive-wrapper"
		>
			<div className="gutplus-responsive-wrapper__content">
				{ typeof children === 'function'
					? children( {
							value: effectiveValue,
							device,
							isInherited,
							onChange: handleChange,
					  } )
					: children }
			</div>
		</BaseControl>
	);
}

/**
 * Helper hook for responsive values
 * Use this when you need to manage responsive state outside of ResponsiveWrapper
 *
 * Uses FLAT BASE structure where base values are at root level
 *
 * @param {Object} values - Object with base values at root, tablet/mobile as keys
 * @param {string} device - Current device (global, tablet, mobile)
 * @returns {Object} Object with effectiveValue, isInherited, inheritedFrom
 */
export function useResponsiveValue( values, device ) {
	return useMemo( () => {
		const { value, inheritedFrom } = getInheritedValue( values, device );
		return {
			effectiveValue: value,
			isInherited: inheritedFrom !== null,
			inheritedFrom,
		};
	}, [ values, device ] );
}

export default ResponsiveWrapper;
