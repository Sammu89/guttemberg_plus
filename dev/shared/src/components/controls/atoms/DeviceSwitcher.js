/**
 * DeviceSwitcher Atom
 *
 * Compact device switcher (desktop/tablet/mobile) without text labels.
 * Just icons that are clickable.
 *
 * @package guttemberg-plus
 */

import { Button, ButtonGroup } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

const devices = [
	{ name: 'desktop', icon: desktop, label: 'Desktop' },
	{ name: 'tablet', icon: tablet, label: 'Tablet' },
	{ name: 'mobile', icon: mobile, label: 'Mobile' },
];

/**
 * DeviceSwitcher Component
 *
 * @param {Object}   props
 * @param {string}   props.value     - Current device (desktop, tablet, mobile)
 * @param {Function} props.onChange  - Change handler
 * @param {boolean}  props.disabled  - Disabled state
 */
export function DeviceSwitcher( {
	value = 'desktop',
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
					onClick={ () => onChange( device.name ) }
					disabled={ disabled }
					isSmall
				/>
			) ) }
		</ButtonGroup>
	);
}

export default DeviceSwitcher;
