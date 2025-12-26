/**
 * ValueWithUnit Molecule
 *
 * Uses native Gutenberg UnitControl for consistent UI.
 * Layout: [11px ▼]
 *
 * @package guttemberg-plus
 */

import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

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
		<div className="gutplus-value-with-unit">
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
		</div>
	);
}

export default ValueWithUnit;
