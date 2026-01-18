/**
 * NumberInput Atom
 *
 * Simple number input field - the smallest unit for numeric values.
 *
 * @package
 */

import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

/**
 * NumberInput Component
 *
 * @param {Object}   props
 * @param {number}   props.value     - Current value
 * @param {Function} props.onChange  - Change handler
 * @param {number}   props.min       - Minimum value
 * @param {number}   props.max       - Maximum value
 * @param {number}   props.step      - Step increment
 * @param {boolean}  props.disabled  - Disabled state
 * @param {string}   props.className - Additional CSS class
 */
export function NumberInput( {
	value,
	onChange,
	min = 0,
	max = 9999,
	step = 1,
	disabled = false,
	className = '',
} ) {
	return (
		<NumberControl
			className={ `gutplus-number-input ${ className }` }
			value={ value }
			onChange={ ( newValue ) => onChange( parseFloat( newValue ) || 0 ) }
			min={ min }
			max={ max }
			step={ step }
			disabled={ disabled }
			hideHTMLArrows={ true }
			spinControls="none"
			__unstableInputWidth="50px"
		/>
	);
}

export default NumberInput;
