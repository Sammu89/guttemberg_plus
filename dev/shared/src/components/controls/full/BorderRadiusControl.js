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
import { UtilityBar } from '../UtilityBar';
import { useResponsiveDevice } from '../../../hooks/useResponsiveDevice';
import { inferBoxUnit } from '../../../utils/box-value-utils';
import { createComprehensiveReset } from '../../../utils/reset-helpers';

const CORNERS = [ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' ];

/**
 * BorderRadiusControl Component
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses a BOX pattern (4-corner values).
 *
 * NON-RESPONSIVE MODE (responsive: false):
 * ----------------------------------------
 * value prop structure:
 *   {
 *     topLeft: 4,
 *     topRight: 4,
 *     bottomRight: 4,
 *     bottomLeft: 4,
 *     unit: "px",
 *     linked: true
 *   }
 *
 * onChange callback signature:
 *   onChange(newValue)
 *   - newValue: full object { topLeft, topRight, bottomRight, bottomLeft, unit, linked }
 *
 * RESPONSIVE MODE (responsive: true):
 * ------------------------------------
 * value prop structure:
 *   {
 *     value: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4, unit: "px", linked: true },
 *     tablet: { topLeft: 2, topRight: 2, bottomRight: 2, bottomLeft: 2, unit: "px", linked: true },
 *     mobile: { topLeft: 1, topRight: 1, bottomRight: 1, bottomLeft: 1, unit: "px", linked: true }
 *   }
 *
 * - The "global" device reads from value.value.
 * - Tablet/mobile read from value.tablet/value.mobile and fall back to value.value.
 *
 * onChange callback signature:
 *   onChange(newValue)
 *   - newValue preserves existing device keys and updates only the active device.
 *
 * ============================================================================
 *
 * @param {Object}   props
 * @param {string}   props.label        - Control label
 * @param {Object}   props.value        - Value object { topLeft, topRight, bottomRight, bottomLeft, unit, linked }
 * @param {Function} props.onChange     - Change handler
 * @param {Array}    props.units        - Available units
 * @param {number}   props.min          - Minimum value
 * @param {number}   props.max          - Maximum value
 * @param {boolean}  props.responsive   - Whether to show device switcher
 * @param {boolean}  props.disabled     - Disabled state
 * @param {Object}   props.attributes   - Block attributes (for reset)
 * @param {Function} props.setAttributes - Set attributes function (for reset)
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
	attributes,
	setAttributes,
} ) {
	// Use global device state - all responsive controls stay in sync
	const device = useResponsiveDevice();

	// Create comprehensive reset handler
	const comprehensiveReset = createComprehensiveReset({
		attributes,
		setAttributes,
		attrName: 'borderRadius',
		canBeResponsive: false, // Always-on responsive
		isDecomposable: true,
	});

	// Get current device value for responsive, or direct value
	const currentValue = responsive
		? ( value?.[ device ] ?? value?.value ?? {} )
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

	const effectiveUnit = inferBoxUnit( currentValue, unit ) || unit || 'px';

	const normalizeUnitValue = ( nextValue, fallbackUnit ) => {
		if ( ! nextValue || typeof nextValue !== 'object' ) {
			return nextValue;
		}

		const hasCorners = [ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' ].some(
			( corner ) => nextValue[ corner ] !== undefined
		);
		if ( ! hasCorners ) {
			return nextValue;
		}

		const hasUnit = typeof nextValue.unit === 'string' && nextValue.unit.trim() !== '';
		const inferredUnit = inferBoxUnit( nextValue, fallbackUnit );
		if ( hasUnit || ! inferredUnit ) {
			return nextValue;
		}

		return { ...nextValue, unit: inferredUnit };
	};

	// Helper to update value
	const updateValue = ( updates ) => {
		const mergedValue = { ...currentValue, ...updates };
		const newValue = normalizeUnitValue( mergedValue, effectiveUnit );
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
					<UtilityBar
						isResponsive={ responsive }
						currentDevice={ device }
						isDecomposable={ true }
						isLinked={ linked }
						onLinkChange={ handleLinkChange }
						onReset={ comprehensiveReset }
						disabled={ disabled }
					/>
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
					unit={ effectiveUnit }
					onValueChange={ ( val ) => handleValueChange( 'topLeft', val ) }
					onUnitChange={ handleUnitChange }
					units={ units }
					min={ min }
					max={ max }
					showSlider={ true }
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
							unit={ effectiveUnit }
							onValueChange={ ( val ) => handleValueChange( corner, val ) }
							onUnitChange={ handleUnitChange }
							units={ units }
							min={ min }
							max={ max }
							showSlider={ true }
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
