/**
 * SliderWithValue Molecule
 *
 * Uses native Gutenberg UnitControl + MiniSlider in a single row.
 * Layout: [11px ▼] ────●────
 *
 * @package guttemberg-plus
 */

import { Flex, FlexItem, FlexBlock, __experimentalUnitControl as UnitControl } from '@wordpress/components';
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
			<FlexItem className="gutplus-slider-with-value__unit-control">
				<UnitControl
					value={ `${ value }${ unit }` }
					onChange={ ( newValue ) => {
						const numericValue = parseFloat( newValue ) || 0;
						const newUnit = newValue?.replace( /[0-9.-]/g, '' ) || unit;
						onValueChange( numericValue );
						if ( newUnit !== unit && onUnitChange ) {
							onUnitChange( newUnit );
						}
					} }
					units={ units.map( ( u ) => ( { value: u, label: u } ) ) }
					min={ min }
					max={ max }
					step={ step }
					disabled={ disabled }
					__next40pxDefaultSize
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
