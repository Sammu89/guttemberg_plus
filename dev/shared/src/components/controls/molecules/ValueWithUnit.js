/**
 * ValueWithUnit Molecule
 *
 * Combines NumberInput + UnitDropdown into a single component.
 * Layout: [11] [px ▼]
 *
 * @package guttemberg-plus
 */

import { Flex, FlexItem } from '@wordpress/components';
import { NumberInput } from '../atoms/NumberInput';
import { UnitDropdown } from '../atoms/UnitDropdown';

/**
 * ValueWithUnit Component
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
 */
export function ValueWithUnit( {
	value,
	unit = 'px',
	onValueChange,
	onUnitChange,
	units = [ 'px', 'em', 'rem', '%' ],
	min = 0,
	max = 9999,
	step = 1,
	disabled = false,
} ) {
	return (
		<Flex className="gutplus-value-with-unit" gap={ 1 } align="center">
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
		</Flex>
	);
}

export default ValueWithUnit;
