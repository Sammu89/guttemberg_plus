/**
 * SpacingControl - Full Control
 *
 * Compact spacing control (margin/padding) with spacing icon, value, unit, slider, and link toggle.
 * When unlinked, shows 4 rows for each side (top, right, bottom, left).
 *
 * Layout (linked):   [⬒] [11] [px] ────●──── [🔗]
 * Layout (unlinked): 4 rows with side icons
 *
 * @package guttemberg-plus
 */

import { BaseControl } from '@wordpress/components';
import { CompactBoxRow } from '../organisms/CompactBoxRow';
import { SideIcon } from '../atoms/SideIcon';
import { DeviceSwitcher } from '../atoms/DeviceSwitcher';
import { useResponsiveDevice } from '../../../hooks/useResponsiveDevice';

const ALL_SIDES = [ 'top', 'right', 'bottom', 'left' ];

/**
 * SpacingControl Component
 *
 * @param {Object}   props
 * @param {string}   props.label       - Control label
 * @param {string}   props.type        - Type of spacing ('margin' or 'padding')
 * @param {Object}   props.value       - Value object { top, right, bottom, left, unit, linked }
 * @param {Function} props.onChange    - Change handler
 * @param {Array}    props.units       - Available units
 * @param {number}   props.min         - Minimum value
 * @param {number}   props.max         - Maximum value
 * @param {boolean}  props.responsive  - Whether to show device switcher
 * @param {boolean}  props.disabled    - Disabled state
 * @param {Array}    props.sides       - Limit which sides to show (e.g., ['top', 'bottom'] for margins)
 */
export function SpacingControl( {
	label,
	type = 'padding',
	value = {},
	onChange,
	units = [ 'px', 'em', 'rem', '%' ],
	min = 0,
	max = 100,
	responsive = false,
	disabled = false,
	sides = ALL_SIDES,
} ) {
	// Use the provided sides or default to all sides
	const SIDES = sides && sides.length > 0 ? sides : ALL_SIDES;

	// Use global device state - all responsive controls stay in sync
	const device = useResponsiveDevice();

	// Default label based on type
	const controlLabel = label || ( type === 'margin' ? 'Margin' : 'Padding' );

	// Check if value has base (flat) properties - these are desktop values
	// Base structure: { top, right, bottom, left, unit, linked } (no device wrappers)
	// Mixed structure: { top, right, ..., tablet: {...}, mobile: {...} } (base + overrides)
	const hasBaseProperties = value && typeof value === 'object' &&
		( value.top !== undefined || value.bottom !== undefined ||
		  value.left !== undefined || value.right !== undefined ||
		  value.unit !== undefined );

	// Extract base values (desktop) from the flat structure
	const getBaseValue = () => {
		if ( ! value || typeof value !== 'object' ) {
			return {};
		}
		// Extract only the spacing properties, not device keys
		const { top, right, bottom, left, unit, linked } = value;
		const base = {};
		if ( top !== undefined ) base.top = top;
		if ( right !== undefined ) base.right = right;
		if ( bottom !== undefined ) base.bottom = bottom;
		if ( left !== undefined ) base.left = left;
		if ( unit !== undefined ) base.unit = unit;
		if ( linked !== undefined ) base.linked = linked;
		return base;
	};

	// Get current device value for responsive, or direct value
	// Desktop uses base (flat) properties; tablet/mobile use device-specific overrides or inherit from base
	const currentValue = responsive
		? ( device === 'desktop'
			? ( hasBaseProperties ? getBaseValue() : ( value?.desktop || {} ) )
			: ( value?.[ device ] || getBaseValue() ) ) // Tablet/mobile inherit from base if no override
		: value;

	// Destructure with defaults
	const {
		top = 0,
		right = 0,
		bottom = 0,
		left = 0,
		unit = 'px',
		linked = true,
	} = currentValue || {};

	// Helper to update value
	// Desktop: updates the base (flat) properties
	// Tablet/Mobile: creates/updates device-specific overrides
	const updateValue = ( updates ) => {
		const newValue = { ...currentValue, ...updates };

		if ( responsive ) {
			if ( device === 'desktop' ) {
				// Desktop edits update the base (flat) structure
				// Preserve any existing tablet/mobile overrides
				const existingOverrides = {};
				if ( value?.tablet ) existingOverrides.tablet = value.tablet;
				if ( value?.mobile ) existingOverrides.mobile = value.mobile;

				onChange( { ...newValue, ...existingOverrides } );
			} else {
				// Tablet/Mobile create device-specific overrides
				// Preserve base properties and other device overrides
				const baseProps = hasBaseProperties ? getBaseValue() : {};
				const existingOverrides = {};
				if ( value?.tablet && device !== 'tablet' ) existingOverrides.tablet = value.tablet;
				if ( value?.mobile && device !== 'mobile' ) existingOverrides.mobile = value.mobile;

				onChange( {
					...baseProps,
					...existingOverrides,
					[ device ]: newValue,
				} );
			}
		} else {
			onChange( newValue );
		}
	};

	// Handle value change for a specific side or all sides
	const handleValueChange = ( side, newVal ) => {
		if ( linked ) {
			// Only update the sides that are allowed by the `sides` prop
			const updates = {};
			SIDES.forEach( ( s ) => {
				updates[ s ] = newVal;
			} );
			updateValue( updates );
		} else {
			updateValue( { [ side ]: newVal } );
		}
	};

	// Handle unit change
	const handleUnitChange = ( newUnit ) => {
		updateValue( { unit: newUnit } );
	};

	// Handle link toggle
	const handleLinkChange = ( newLinked ) => {
		if ( newLinked ) {
			// When linking, use the first side's value for all allowed sides
			const firstSideValue = currentValue[ SIDES[ 0 ] ] || 0;
			const updates = { linked: true };
			SIDES.forEach( ( s ) => {
				updates[ s ] = firstSideValue;
			} );
			updateValue( updates );
		} else {
			updateValue( { linked: false } );
		}
	};

	return (
		<BaseControl
			label={
				<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' } }>
					<span>{ controlLabel }</span>
					{ responsive && (
						<DeviceSwitcher
							value={ device }
							disabled={ disabled }
						/>
					) }
				</div>
			}
			className={ `gutplus-spacing-control gutplus-spacing-control--${ type }` }
			__nextHasNoMarginBottom
		>
			{ linked ? (
				// Single row when linked
				<CompactBoxRow
					iconSlot={ <SideIcon side={ type } /> }
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
				// Multiple rows when unlinked (one per allowed side)
				<div className="gutplus-spacing-control__sides">
					{ SIDES.map( ( side, index ) => {
						const isLastSide = index === SIDES.length - 1;
						return (
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
								showLink={ isLastSide } // Only show link on last row
								linked={ linked }
								onLinkChange={ isLastSide ? handleLinkChange : undefined }
								disabled={ disabled }
								className={ `gutplus-spacing-control__side gutplus-spacing-control__side--${ side }` }
							/>
						);
					} ) }
				</div>
			) }
		</BaseControl>
	);
}

export default SpacingControl;
