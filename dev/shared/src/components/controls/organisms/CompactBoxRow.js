/**
 * CompactBoxRow Organism
 *
 * The core reusable row component for box-type controls.
 * Layout: [ICON_SLOT] [value] [unit] ────●──── [🔗]
 *
 * Icon slot can contain: StyleIconButton, ColorSwatch, SideIcon (radius/margin/padding)
 *
 * @package guttemberg-plus
 */

import { Flex, FlexItem, FlexBlock } from '@wordpress/components';
import { NumberInput } from '../atoms/NumberInput';
import { UnitDropdown } from '../atoms/UnitDropdown';
import { MiniSlider } from '../atoms/MiniSlider';
import { LinkToggle } from '../atoms/LinkToggle';

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
 * @param {boolean}     props.showLink      - Whether to show link toggle
 * @param {boolean}     props.linked        - Whether sides are linked
 * @param {Function}    props.onLinkChange  - Link toggle handler
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
	showLink = true,
	linked = true,
	onLinkChange,
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
				<FlexItem className="gutplus-compact-box-row__icon">
					{ iconSlot }
				</FlexItem>
			) }

			{ /* Number input */ }
			<FlexItem className="gutplus-compact-box-row__value">
				<NumberInput
					value={ value }
					onChange={ onValueChange }
					min={ min }
					max={ max }
					step={ step }
					disabled={ disabled }
				/>
			</FlexItem>

			{ /* Unit dropdown */ }
			<FlexItem className="gutplus-compact-box-row__unit">
				<UnitDropdown
					value={ unit }
					onChange={ onUnitChange }
					units={ units }
					disabled={ disabled }
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

			{ /* Link toggle (optional) */ }
			{ showLink && onLinkChange && (
				<FlexItem className="gutplus-compact-box-row__link">
					<LinkToggle
						linked={ linked }
						onChange={ onLinkChange }
						disabled={ disabled }
					/>
				</FlexItem>
			) }
		</Flex>
	);
}

export default CompactBoxRow;
