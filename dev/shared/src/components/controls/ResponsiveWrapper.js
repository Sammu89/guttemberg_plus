/**
 * Responsive Wrapper Component
 *
 * Wraps any control with device switcher for responsive editing.
 * Provides value inheritance logic (mobile inherits tablet, tablet inherits desktop).
 * Shows an inherited badge when value comes from a larger breakpoint.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useState, useMemo } from '@wordpress/element';
import { BaseControl, Flex, FlexItem, FlexBlock } from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { ResetButton } from './ResetButton';

/**
 * Get the inherited value for a device based on cascade logic
 * Mobile inherits from tablet, tablet inherits from desktop
 *
 * @param {Object} values - Object with desktop, tablet, mobile values
 * @param {string} device - Current device (desktop, tablet, mobile)
 * @returns {Object} Object with value and inheritedFrom (null if not inherited)
 */
function getInheritedValue( values, device ) {
	const { desktop, tablet, mobile } = values || {};

	switch ( device ) {
		case 'desktop':
			return {
				value: desktop ?? null,
				inheritedFrom: null,
			};

		case 'tablet':
			if ( tablet !== undefined && tablet !== null ) {
				return { value: tablet, inheritedFrom: null };
			}
			return {
				value: desktop ?? null,
				inheritedFrom: desktop !== undefined && desktop !== null ? 'desktop' : null,
			};

		case 'mobile':
			if ( mobile !== undefined && mobile !== null ) {
				return { value: mobile, inheritedFrom: null };
			}
			if ( tablet !== undefined && tablet !== null ) {
				return { value: tablet, inheritedFrom: 'tablet' };
			}
			return {
				value: desktop ?? null,
				inheritedFrom: desktop !== undefined && desktop !== null ? 'desktop' : null,
			};

		default:
			return { value: null, inheritedFrom: null };
	}
}

/**
 * Inherited Badge Component
 *
 * Displays a small badge indicating which device the value is inherited from
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
 * Responsive Wrapper Component
 *
 * Wraps any control to add responsive (device-based) editing capabilities.
 * Manages device state and value inheritance automatically.
 *
 * @param {Object}      props                  Component props
 * @param {string}      props.label            Label for the control
 * @param {Object}      props.values           Object with { desktop, tablet, mobile } values
 * @param {Function}    props.onChange         Callback receiving (device, value)
 * @param {Function}    props.onReset          Callback for reset button (optional)
 * @param {boolean}     props.showReset        Whether to show reset button (default: true)
 * @param {*}           props.defaultValue     Default value for comparison
 * @param {string}      props.help             Help text for the control
 * @param {string}      props.initialDevice    Initial device to show (default: 'desktop')
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
	initialDevice = 'desktop',
	children,
} ) {
	const [ device, setDevice ] = useState( initialDevice );

	// Calculate inherited value for current device
	const { value: effectiveValue, inheritedFrom } = useMemo(
		() => getInheritedValue( values, device ),
		[ values, device ]
	);

	const isInherited = inheritedFrom !== null;

	// Determine if reset should be disabled
	const currentDeviceValue = values?.[ device ];
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
							<InheritedBadge from={ inheritedFrom } />
						</span>
					</FlexItem>
					<FlexItem>
						<Flex gap={ 2 }>
							<FlexItem>
								<DeviceSwitcher value={ device } onChange={ setDevice } />
							</FlexItem>
							{ showReset && (
								<FlexItem>
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
 * @param {Object} values - Object with { desktop, tablet, mobile } values
 * @param {string} device - Current device
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
