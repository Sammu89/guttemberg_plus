/**
 * SpacingControl - Full Control
 *
 * Compact spacing control (margin/padding) with spacing icon, value, unit, slider, and link toggle.
 * When unlinked, shows 4 rows for each side (top, right, bottom, left).
 *
 * Layout (linked):   [⬒] [11] [px] ────●──── [🔗]
 * Layout (unlinked): 4 rows with side icons
 *
 * @package
 */

import { BaseControl } from '@wordpress/components';
import { CompactBoxRow } from '../organisms/CompactBoxRow';
import { SideIcon } from '../atoms/SideIcon';
import { UtilityBar } from '../UtilityBar';
import { useResponsiveDevice } from '../../../hooks/useResponsiveDevice';
import { getAvailableUnits, getUnitConfig } from '../../../config/css-property-scales.mjs';
import { inferBoxUnit } from '../../../utils/box-value-utils';

const ALL_SIDES = [ 'top', 'right', 'bottom', 'left' ];

/**
 * SpacingControl Component
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses a BOX pattern (4-sided values), NOT the scalar pattern.
 *
 * NON-RESPONSIVE MODE (responsive: false):
 * ----------------------------------------
 * value prop structure:
 *   {
 *     top: 16,        // number (in the current unit)
 *     right: 16,
 *     bottom: 16,
 *     left: 16,
 *     unit: "px",     // string
 *     linked: true    // boolean (whether sides are linked)
 *   }
 *
 * onChange callback signature:
 *   onChange(newValue)
 *   - Always calls with full box object { top, right, bottom, left, unit, linked }
 *
 * RESPONSIVE MODE (responsive: true):
 * ------------------------------------
 * value prop structure:
 *
 *   FLAT (base/global only):
 *   { top: 16, right: 16, bottom: 16, left: 16, unit: "px", linked: true }
 *
 *   WITH DEVICE OVERRIDES:
 *   {
 *     top: 16,           // BASE (global)
 *     right: 16,
 *     bottom: 16,
 *     left: 16,
 *     unit: "px",
 *     linked: true,
 *     tablet: { top: 12, right: 12, bottom: 12, left: 12, unit: "px", linked: true },
 *     mobile: { top: 8, right: 8, bottom: 8, left: 8, unit: "px", linked: true }
 *   }
 *
 * IMPORTANT: Global value is the BASE (flat box properties), NOT under a "global" key!
 * Tablet and mobile are OVERRIDES added to the base object.
 *
 * onChange callback signature:
 *   onChange(device, newValue)
 *   - device: "global" | "tablet" | "mobile"
 *   - newValue: box object { top, right, bottom, left, unit, linked }
 *
 * The parent (ControlRenderer) handles merging device values into the final structure.
 *
 * SIDES PROP (for CompactMargin):
 * --------------------------------
 * The `sides` prop limits which sides are controllable:
 *   sides: ['top', 'bottom']  // Only show top/bottom controls
 *
 * - Linked mode: Only updates the specified sides
 * - Unlinked mode: Only shows rows for specified sides
 * - Other sides: Preserved unchanged
 *
 * Example: CompactMargin uses sides: ['top', 'bottom'] to avoid conflicts
 * with horizontal alignment (which sets margin-left/margin-right).
 *
 * ============================================================================
 *
 * @param {Object}   props
 * @param {string}   props.label              - Control label
 * @param {string}   props.type               - Type of spacing ('margin' or 'padding')
 * @param {Object}   props.value              - Value object - see DATA STRUCTURE above
 * @param {Function} props.onChange           - Change handler - see DATA STRUCTURE above
 * @param {Array}    props.units              - Available units (defaults to centralizer config)
 * @param {number}   props.min                - Minimum value (defaults to centralizer config based on unit)
 * @param {number}   props.max                - Maximum value (defaults to centralizer config based on unit)
 * @param {number}   props.step               - Step value (defaults to centralizer config based on unit)
 * @param {boolean}  props.responsive         - Whether to show device switcher
 * @param {boolean}  props.disabled           - Disabled state
 * @param {Array}    props.sides              - Limit which sides to show (e.g., ['top', 'bottom'] for margins)
 * @param            props.canBeResponsive
 * @param            props.onResponsiveToggle
 * @param            props.onResponsiveReset
 */
export function SpacingControl( {
	label,
	type = 'padding',
	value = {},
	onChange,
	units: unitsProp,
	min: minProp,
	max: maxProp,
	step: stepProp,
	responsive = false,
	canBeResponsive = false,
	responsiveEnabled = false,
	onResponsiveToggle,
	onResponsiveReset,
	disabled = false,
	sides = ALL_SIDES,
} ) {
	// Use the provided sides or default to all sides
	const SIDES = sides && sides.length > 0 ? sides : ALL_SIDES;

	// Get available units from centralizer, fallback to prop or default
	const availableUnits = unitsProp || getAvailableUnits( type ) || [ 'px', 'em', 'rem', '%' ];

	// Use global device state - all responsive controls stay in sync
	const device = useResponsiveDevice();

	// Default label based on type
	const controlLabel = label || ( type === 'margin' ? 'Margin' : 'Padding' );

	// Check if value has base (flat) properties - these are global/base values
	// Base structure: { top, right, bottom, left, unit, linked } (no device wrappers)
	// Mixed structure: { top, right, ..., tablet: {...}, mobile: {...} } (base + overrides)
	const hasBaseProperties =
		value &&
		typeof value === 'object' &&
		( value.top !== undefined ||
			value.bottom !== undefined ||
			value.left !== undefined ||
			value.right !== undefined ||
			value.unit !== undefined );

	// Extract base values (global) from the flat structure
	const getBaseValue = () => {
		if ( ! value || typeof value !== 'object' ) {
			return {};
		}
		// Extract only the spacing properties, not device keys
		const { top, right, bottom, left, unit, linked } = value;
		const base = {};
		if ( top !== undefined ) {
			base.top = top;
		}
		if ( right !== undefined ) {
			base.right = right;
		}
		if ( bottom !== undefined ) {
			base.bottom = bottom;
		}
		if ( left !== undefined ) {
			base.left = left;
		}
		if ( unit !== undefined ) {
			base.unit = unit;
		}
		if ( linked !== undefined ) {
			base.linked = linked;
		}
		return base;
	};

	// Get current device value for responsive, or direct value
	// Global uses base (flat) properties; tablet/mobile use device-specific overrides or inherit from base
	const currentValue = responsive
		? device === 'global'
			? hasBaseProperties
				? getBaseValue()
				: value?.value || {}
			: value?.[ device ] || getBaseValue() // Tablet/mobile inherit from base if no override
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

	const effectiveUnit = inferBoxUnit( currentValue, unit ) || unit || 'px';

	// Get unit-specific configuration from centralizer
	const unitConfig = getUnitConfig( type, effectiveUnit );
	const min = minProp ?? unitConfig?.min ?? 0;
	const max = maxProp ?? unitConfig?.max ?? 100;
	const step = stepProp ?? unitConfig?.step ?? 1;

	const normalizeUnitValue = ( nextValue, fallbackUnit ) => {
		if ( ! nextValue || typeof nextValue !== 'object' ) {
			return nextValue;
		}

		const hasSides = [ 'top', 'right', 'bottom', 'left' ].some(
			( side ) => nextValue[ side ] !== undefined
		);
		if ( ! hasSides ) {
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
	// Global: updates the base (flat) properties
	// Tablet/Mobile: creates/updates device-specific overrides
	const updateValue = ( updates ) => {
		const mergedValue = { ...currentValue, ...updates };
		const newValue = normalizeUnitValue( mergedValue, effectiveUnit );

		if ( responsive ) {
			if ( device === 'global' ) {
				// Global edits update the base (flat) structure
				// Preserve any existing tablet/mobile overrides
				const existingOverrides = {};
				if ( value?.tablet ) {
					existingOverrides.tablet = value.tablet;
				}
				if ( value?.mobile ) {
					existingOverrides.mobile = value.mobile;
				}

				onChange( { ...newValue, ...existingOverrides } );
			} else {
				// Tablet/Mobile create device-specific overrides
				// Preserve base properties and other device overrides
				const baseProps = hasBaseProperties
					? normalizeUnitValue( getBaseValue(), newValue?.unit || effectiveUnit )
					: {};
				const existingOverrides = {};
				if ( value?.tablet && device !== 'tablet' ) {
					existingOverrides.tablet = value.tablet;
				}
				if ( value?.mobile && device !== 'mobile' ) {
					existingOverrides.mobile = value.mobile;
				}

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

	// Comprehensive reset handler
	// Resets value to defaults with linked: true, removes device overrides, and disables responsive
	const handleComprehensiveReset = () => {
		// Get default values for all allowed sides
		const defaultResetValue = {};
		SIDES.forEach( ( side ) => {
			defaultResetValue[ side ] = 0;
		} );

		// Create reset value with linked: true and default unit
		const resetValue = {
			...defaultResetValue,
			unit: 'px',
			linked: true,
		};

		// Update the attribute to reset value (this removes device overrides)
		onChange( resetValue );

		// If canBeResponsive, also disable responsive mode
		if ( canBeResponsive && onResponsiveReset ) {
			onResponsiveReset();
		}
	};

	return (
		<BaseControl
			label={
				<div
					style={ {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					} }
				>
					<span>{ controlLabel }</span>
					<UtilityBar
						canBeResponsive={ canBeResponsive }
						isResponsiveEnabled={ responsiveEnabled }
						currentDevice={ device }
						isDecomposable={ true }
						isLinked={ linked }
						onResponsiveToggle={ onResponsiveToggle }
						onLinkChange={ handleLinkChange }
						onReset={ handleComprehensiveReset }
						disabled={ disabled }
					/>
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
					unit={ effectiveUnit }
					onValueChange={ ( val ) => handleValueChange( 'top', val ) }
					onUnitChange={ handleUnitChange }
					units={ availableUnits }
					min={ min }
					max={ max }
					step={ step }
					showSlider={ true }
					disabled={ disabled }
				/>
			) : (
				// Multiple rows when unlinked (one per allowed side)
				<div className="gutplus-spacing-control__sides">
					{ SIDES.map( ( side ) => {
						return (
							<CompactBoxRow
								key={ side }
								iconSlot={ <SideIcon side={ side } /> }
								value={ currentValue[ side ] || 0 }
								unit={ effectiveUnit }
								onValueChange={ ( val ) => handleValueChange( side, val ) }
								onUnitChange={ handleUnitChange }
								units={ availableUnits }
								min={ min }
								max={ max }
								step={ step }
								showSlider={ true }
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
