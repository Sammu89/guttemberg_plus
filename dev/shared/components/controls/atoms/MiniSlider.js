/**
 * MiniSlider Atom
 *
 * Compact slider without labels - just the track and handle.
 *
 * @package
 */

import { RangeControl } from '@wordpress/components';

/**
 * MiniSlider Component
 *
 * @param {Object}   props
 * @param {number}   props.value    - Current value
 * @param {Function} props.onChange - Change handler
 * @param {number}   props.min      - Minimum value
 * @param {number}   props.max      - Maximum value
 * @param {number}   props.step     - Step increment
 * @param {boolean}  props.disabled - Disabled state
 */
export function MiniSlider( { value, onChange, min = 0, max = 100, step = 1, disabled = false } ) {
	return (
		<RangeControl
			className="gutplus-mini-slider"
			value={ value }
			onChange={ onChange }
			min={ min }
			max={ max }
			step={ step }
			disabled={ disabled }
			withInputField={ false }
			__nextHasNoMarginBottom
		/>
	);
}

export default MiniSlider;
