/**
 * UnitDropdown Atom
 *
 * Dropdown selector for CSS units (px, em, rem, %).
 *
 * @package guttemberg-plus
 */

import { SelectControl } from '@wordpress/components';

/**
 * UnitDropdown Component
 *
 * @param {Object}   props
 * @param {string}   props.value     - Current unit
 * @param {Function} props.onChange  - Change handler
 * @param {Array}    props.units     - Available units
 * @param {boolean}  props.disabled  - Disabled state
 */
export function UnitDropdown( {
	value = 'px',
	onChange,
	units = [ 'px', 'em', 'rem', '%' ],
	disabled = false,
} ) {
	const options = units.map( ( unit ) => ( {
		label: unit,
		value: unit,
	} ) );

	return (
		<SelectControl
			className="gutplus-unit-dropdown"
			value={ value }
			options={ options }
			onChange={ onChange }
			disabled={ disabled }
			__nextHasNoMarginBottom
			style={ {
				minWidth: '60px',
				width: 'auto',
			} }
		/>
	);
}

export default UnitDropdown;
