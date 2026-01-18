/**
 * CompactBoxRow Organism
 *
 * The core reusable row component for box-type controls.
 * Layout: [ICON_SLOT] [value+unit] ────●────
 *
 * Uses native Gutenberg UnitControl for consistent UI with WordPress core.
 * Icon slot can contain: StyleIconButton, ColorSwatch, SideIcon (radius/margin/padding)
 *
 * @package
 */

import {
	Flex,
	FlexItem,
	FlexBlock,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { MiniSlider } from '../atoms/MiniSlider';

/**
 * CompactBoxRow Component
 *
 * @param {Object}      props
 * @param {JSX.Element} props.iconSlot      - Icon component to render (StyleIconButton, ColorSwatch, SideIcon)
 * @param {number}      props.value         - Numeric value
 * @param {string}      props.unit          - CSS unit
 * @param {Function}    props.onValueChange - Value change handler
 * @param {Function}    props.onUnitChange  - Unit change handler
 * @param {Array}       props.units         - Available units
 * @param {number}      props.min           - Minimum value
 * @param {number}      props.max           - Maximum value
 * @param {number}      props.step          - Step increment
 * @param {boolean}     props.showSlider    - Whether to show slider
 * @param {boolean}     props.disabled      - Disabled state
 * @param {string}      props.className     - Additional CSS class
 */
export function CompactBoxRow( {
	iconSlot,
	value,
	unit = 'px',
	onValueChange,
	onUnitChange,
	units = [ 'px', 'em', 'rem', '%' ],
	min = 0,
	max = 100,
	step = 1,
	showSlider = true,
	disabled = false,
	className = '',
} ) {
	return (
		<Flex
			className={ `gutplus-compact-box-row ${ className }` }
			gap={ 2 }
			align="center"
			wrap={ false }
		>
			{ /* Icon slot (optional) */ }
			{ iconSlot && (
				<FlexItem className="gutplus-compact-box-row__icon">{ iconSlot }</FlexItem>
			) }

			{ /* Combined value + unit using native Gutenberg UnitControl */ }
			<FlexItem className="gutplus-compact-box-row__value-unit">
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

			{ /* Slider (optional) */ }
			{ showSlider && (
				<FlexBlock className="gutplus-compact-box-row__slider">
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

export default CompactBoxRow;
