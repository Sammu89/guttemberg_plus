/**
 * BorderWidthControl - Full Control
 *
 * Compact border width control with style icon, value, unit, slider, and link toggle.
 * When unlinked, shows 4 rows for each side (top, right, bottom, left).
 *
 * Layout (linked):   [⊘ style] [11] [px] ────●──── [🔗]
 * Layout (unlinked): 4 rows with side icons
 *
 * @package guttemberg-plus
 */

import { useState } from '@wordpress/element';
import { BaseControl } from '@wordpress/components';
import { CompactBoxRow } from '../organisms/CompactBoxRow';
import { StyleIconButton } from '../atoms/StyleIconButton';
import { SideIcon } from '../atoms/SideIcon';
import { DeviceSwitcher } from '../atoms/DeviceSwitcher';

const SIDES = [ 'top', 'right', 'bottom', 'left' ];

/**
 * BorderWidthControl Component
 *
 * @param {Object}   props
 * @param {string}   props.label       - Control label
 * @param {Object}   props.value       - Value object { top, right, bottom, left, style, unit, linked }
 * @param {Function} props.onChange    - Change handler
 * @param {Array}    props.units       - Available units
 * @param {number}   props.min         - Minimum value
 * @param {number}   props.max         - Maximum value
 * @param {boolean}  props.responsive  - Whether to show device switcher
 * @param {boolean}  props.disabled    - Disabled state
 */
export function BorderWidthControl( {
	label = 'Border',
	value = {},
	onChange,
	units = [ 'px', 'em', 'rem' ],
	min = 0,
	max = 20,
	responsive = false,
	disabled = false,
} ) {
	const [ device, setDevice ] = useState( 'global' );

	// Get current device value for responsive, or direct value
	const currentValue = responsive
		? ( value[ device ] || value.value || {} )
		: value;

	// Destructure with defaults
	const {
		top = 1,
		right = 1,
		bottom = 1,
		left = 1,
		style = 'solid',
		unit = 'px',
		linked = true,
	} = currentValue;

	// Helper to update value
	const updateValue = ( updates ) => {
		const newValue = { ...currentValue, ...updates };
		if ( responsive ) {
			onChange( { ...value, [ device ]: newValue } );
		} else {
			onChange( newValue );
		}
	};

	// Handle value change for a specific side or all sides
	const handleValueChange = ( side, newVal ) => {
		if ( linked ) {
			// All sides get same value
			updateValue( { top: newVal, right: newVal, bottom: newVal, left: newVal } );
		} else {
			updateValue( { [ side ]: newVal } );
		}
	};

	// Handle style change
	const handleStyleChange = ( newStyle ) => {
		updateValue( { style: newStyle } );
	};

	// Handle unit change
	const handleUnitChange = ( newUnit ) => {
		updateValue( { unit: newUnit } );
	};

	// Handle link toggle
	const handleLinkChange = ( newLinked ) => {
		if ( newLinked ) {
			// When linking, use the top value for all sides
			updateValue( { linked: true, right: top, bottom: top, left: top } );
		} else {
			updateValue( { linked: false } );
		}
	};

	return (
		<BaseControl
			label={
				<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' } }>
					<span>{ label }</span>
					{ responsive && (
						<DeviceSwitcher
							value={ device }
							onChange={ setDevice }
							disabled={ disabled }
						/>
					) }
				</div>
			}
			className="gutplus-border-width-control"
			__nextHasNoMarginBottom
		>
			{ linked ? (
				// Single row when linked
				<CompactBoxRow
					iconSlot={
						<StyleIconButton
							value={ style }
							onChange={ handleStyleChange }
							disabled={ disabled }
						/>
					}
					value={ top }
					unit={ unit }
					onValueChange={ ( val ) => handleValueChange( 'top', val ) }
					onUnitChange={ handleUnitChange }
					units={ units }
					min={ min }
					max={ max }
					showSlider={ true }
					showLink={ true }
					linked={ linked }
					onLinkChange={ handleLinkChange }
					disabled={ disabled }
				/>
			) : (
				// Four rows when unlinked
				<div className="gutplus-border-width-control__sides">
					{ SIDES.map( ( side ) => (
						<CompactBoxRow
							key={ side }
							iconSlot={ <SideIcon side={ side } /> }
							value={ currentValue[ side ] || 0 }
							unit={ unit }
							onValueChange={ ( val ) => handleValueChange( side, val ) }
							onUnitChange={ handleUnitChange }
							units={ units }
							min={ min }
							max={ max }
							showSlider={ true }
							showLink={ side === 'left' } // Only show link on last row
							linked={ linked }
							onLinkChange={ side === 'left' ? handleLinkChange : undefined }
							disabled={ disabled }
							className={ `gutplus-border-width-control__side gutplus-border-width-control__side--${ side }` }
						/>
					) ) }
				</div>
			) }
		</BaseControl>
	);
}

export default BorderWidthControl;
