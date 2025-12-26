/**
 * SliderWithValue Molecule
 *
 * Combines ValueWithUnit + MiniSlider into a single row.
 * Layout: [11] [px ▼] ────●────
 *
 * @package guttemberg-plus
 */

import { Flex, FlexItem, FlexBlock } from '@wordpress/components';
import { NumberInput } from '../atoms/NumberInput';
import { UnitDropdown } from '../atoms/UnitDropdown';
import { MiniSlider } from '../atoms/MiniSlider';

/**
 * SliderWithValue Component
 *
 * @param {Object}   props
 * @param {number}   props.value       - Numeric value
 * @param {string}   props.unit        - CSS unit
 * @param {Function} props.onValueChange - Value change handler
 * @param {Function} props.onUnitChange  - Unit change handler
 * @param {Array}    props.units       - Available units
 * @param {number}   props.min         - Minimum value
 * @param {number}   props.max         - Maximum value
 * @param {number}   props.step        - Step increment
 * @param {boolean}  props.disabled    - Disabled state
 * @param {boolean}  props.showSlider  - Whether to show the slider
 */
export function SliderWithValue( {
	value,
	unit = 'px',
	onValueChange,
	onUnitChange,
	units = [ 'px', 'em', 'rem', '%' ],
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	showSlider = true,
} ) {
	return (
		<Flex className="gutplus-slider-with-value" gap={ 2 } align="center">
			<FlexItem>
				<NumberInput
					value={ value }
					onChange={ onValueChange }
					min={ min }
					max={ max }
					step={ step }
					disabled={ disabled }
				/>
			</FlexItem>
			<FlexItem>
				<UnitDropdown
					value={ unit }
					onChange={ onUnitChange }
					units={ units }
					disabled={ disabled }
				/>
			</FlexItem>
			{ showSlider && (
				<FlexBlock>
					<MiniSlider
						value={ value }
						onChange={ onValueChange }
						min={ min }
						max={ max }
						step={ step }
						disabled={ disabled }
					/>
				</FlexBlock>
			) }
		</Flex>
	);
}

export default SliderWithValue;
