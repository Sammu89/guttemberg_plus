/**
 * BorderRadiusControl - Full Control
 *
 * Compact border radius control with radius icon, value, unit, slider, and link toggle.
 * When unlinked, shows 4 rows for each corner (topLeft, topRight, bottomRight, bottomLeft).
 *
 * Layout (linked):   [◜] [11] [px] ────●──── [🔗]
 * Layout (unlinked): 4 rows with corner icons
 *
 * @package guttemberg-plus
 */

import { BaseControl } from '@wordpress/components';
import { CompactBoxRow } from '../organisms/CompactBoxRow';
import { SideIcon } from '../atoms/SideIcon';
import { DeviceSwitcher } from '../atoms/DeviceSwitcher';
import { useResponsiveDevice } from '../../../hooks/useResponsiveDevice';

const CORNERS = [ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' ];

/**
 * BorderRadiusControl Component
 *
 * @param {Object}   props
 * @param {string}   props.label       - Control label
 * @param {Object}   props.value       - Value object { topLeft, topRight, bottomRight, bottomLeft, unit, linked }
 * @param {Function} props.onChange    - Change handler
 * @param {Array}    props.units       - Available units
 * @param {number}   props.min         - Minimum value
 * @param {number}   props.max         - Maximum value
 * @param {boolean}  props.responsive  - Whether to show device switcher
 * @param {boolean}  props.disabled    - Disabled state
 */
export function BorderRadiusControl( {
	label = 'Border Radius',
	value = {},
	onChange,
	units = [ 'px', 'em', 'rem', '%' ],
	min = 0,
	max = 100,
	responsive = false,
	disabled = false,
} ) {
	// Use global device state - all responsive controls stay in sync
	const device = useResponsiveDevice();

	// Get current device value for responsive, or direct value
	const currentValue = responsive
		? ( value[ device ] || value.desktop || {} )
		: value;

	// Destructure with defaults
	const {
		topLeft = 4,
		topRight = 4,
		bottomRight = 4,
		bottomLeft = 4,
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

	// Handle value change for a specific corner or all corners
	const handleValueChange = ( corner, newVal ) => {
		if ( linked ) {
			// All corners get same value
			updateValue( { topLeft: newVal, topRight: newVal, bottomRight: newVal, bottomLeft: newVal } );
		} else {
			updateValue( { [ corner ]: newVal } );
		}
	};

	// Handle unit change
	const handleUnitChange = ( newUnit ) => {
		updateValue( { unit: newUnit } );
	};

	// Handle link toggle
	const handleLinkChange = ( newLinked ) => {
		if ( newLinked ) {
			// When linking, use the topLeft value for all corners
			updateValue( { linked: true, topRight: topLeft, bottomRight: topLeft, bottomLeft: topLeft } );
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
							disabled={ disabled }
						/>
					) }
				</div>
			}
			className="gutplus-border-radius-control"
			__nextHasNoMarginBottom
		>
			{ linked ? (
				// Single row when linked
				<CompactBoxRow
					iconSlot={ <SideIcon side="radius" /> }
					value={ topLeft }
					unit={ unit }
					onValueChange={ ( val ) => handleValueChange( 'topLeft', val ) }
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
				<div className="gutplus-border-radius-control__corners">
					{ CORNERS.map( ( corner ) => (
						<CompactBoxRow
							key={ corner }
							iconSlot={ <SideIcon side={ corner } /> }
							value={ currentValue[ corner ] || 0 }
							unit={ unit }
							onValueChange={ ( val ) => handleValueChange( corner, val ) }
							onUnitChange={ handleUnitChange }
							units={ units }
							min={ min }
							max={ max }
							showSlider={ true }
							showLink={ corner === 'bottomLeft' } // Only show link on last row
							linked={ linked }
							onLinkChange={ corner === 'bottomLeft' ? handleLinkChange : undefined }
							disabled={ disabled }
							className={ `gutplus-border-radius-control__corner gutplus-border-radius-control__corner--${ corner }` }
						/>
					) ) }
				</div>
			) }
		</BaseControl>
	);
}

export default BorderRadiusControl;
