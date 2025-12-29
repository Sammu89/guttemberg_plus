/**
 * DeviceSwitcher Atom
 *
 * Compact device switcher (global/tablet/mobile) without text labels.
 * Just icons that are clickable. "Global" represents the base state.
 *
 * @package guttemberg-plus
 */

import { Button, ButtonGroup } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';
import { setGlobalResponsiveDevice } from '../../../utils/responsive-device';

const devices = [
	{ name: 'global', icon: desktop, label: 'Global' },
	{ name: 'tablet', icon: tablet, label: 'Tablet' },
	{ name: 'mobile', icon: mobile, label: 'Mobile' },
];

/**
 * DeviceSwitcher Component
 *
 * Uses global device state - clicking any DeviceSwitcher updates all responsive controls.
 *
 * @param {Object}   props
 * @param {string}   props.value     - Current device (global, tablet, mobile)
 * @param {Function} props.onChange  - Optional legacy change handler (deprecated, use global state)
 * @param {boolean}  props.disabled  - Disabled state
 */
export function DeviceSwitcher( {
	value = 'global',
	onChange,
	disabled = false,
} ) {
	return (
		<ButtonGroup className="gutplus-device-switcher">
			{ devices.map( ( device ) => (
				<Button
					key={ device.name }
					className={ `gutplus-device-switcher__button ${ value === device.name ? 'is-active' : '' }` }
					icon={ device.icon }
					label={ device.label }
					isPressed={ value === device.name }
					onClick={ () => {
						// Update global state - all controls will sync
						setGlobalResponsiveDevice( device.name );
						// Call legacy onChange if provided (for backwards compatibility)
						if ( onChange ) {
							onChange( device.name );
						}
					} }
					disabled={ disabled }
					isSmall
				/>
			) ) }
		</ButtonGroup>
	);
}

export default DeviceSwitcher;
