/**
 * Box Control Component
 *
 * 4-side input control for padding, margin, border-width, border-radius.
 * Supports responsive editing, unit selection, and linked sides.
 *
 * Uses FLAT BASE structure:
 * - Base/global values at ROOT level: { top: 10, unit: 'px', tablet: {...}, mobile: {...} }
 * - NOT under a 'global' or 'desktop' key
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useMemo } from '@wordpress/element';
import { BaseControl, Flex, FlexItem, FlexBlock, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { UnitSelector } from './UnitSelector';
import { LinkToggle } from './LinkToggle';
import { ResetButton } from './ResetButton';
import { useResponsiveDevice } from '../../hooks/useResponsiveDevice';

/**
 * Default box value structure
 */
const DEFAULT_BOX_VALUE = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	linked: true,
	unit: 'px',
};

/**
 * Side labels for display
 */
const SIDE_LABELS = {
	top: 'Top',
	right: 'Right',
	bottom: 'Bottom',
	left: 'Left',
};

/**
 * Inherited Badge Component
 *
 * @param {Object} props - Component props
 * @param {string} props.from - Device name the value is inherited from
 * @returns {JSX.Element|null} Badge element or null
 */
function InheritedBadge( { from } ) {
	if ( ! from ) {
		return null;
	}

	const labels = {
		global: 'Global',
		tablet: 'Tablet',
		mobile: 'Mobile',
	};

	return (
		<span
			className="gutplus-inherited-badge"
			style={ {
				fontSize: '10px',
				backgroundColor: '#e0e0e0',
				color: '#666',
				padding: '2px 6px',
				borderRadius: '3px',
				marginLeft: '8px',
				fontWeight: 500,
				textTransform: 'uppercase',
				letterSpacing: '0.5px',
			} }
		>
			{ `From ${ labels[ from ] || from }` }
		</span>
	);
}

/**
 * Extract the base/global value from a flat responsive structure
 * Base value is at root level, not under a key
 *
 * @param {Object} vals - Responsive values object
 * @returns {Object|null} Base value object or null
 */
function getBaseValue( vals ) {
	if ( ! vals || typeof vals !== 'object' ) {
		return null;
	}
	const { tablet, mobile, ...base } = vals;
	return Object.keys( base ).length > 0 ? base : null;
}

/**
 * Get inherited value for responsive box values
 *
 * Uses FLAT BASE structure where base values are at root level
 *
 * @param {Object} values - Object with base values at root, tablet/mobile as keys
 * @param {string} device - Current device (global, tablet, mobile)
 * @returns {Object} Object with value and inheritedFrom
 */
function getInheritedBoxValue( values, device ) {
	const baseValue = getBaseValue( values );
	const tabletValue = values?.tablet;
	const mobileValue = values?.mobile;

	switch ( device ) {
		case 'global':
			return {
				value: baseValue ? { ...DEFAULT_BOX_VALUE, ...baseValue } : DEFAULT_BOX_VALUE,
				inheritedFrom: null,
			};

		case 'tablet':
			if ( tabletValue && Object.keys( tabletValue ).length > 0 ) {
				return { value: { ...DEFAULT_BOX_VALUE, ...tabletValue }, inheritedFrom: null };
			}
			return {
				value: baseValue ? { ...DEFAULT_BOX_VALUE, ...baseValue } : DEFAULT_BOX_VALUE,
				inheritedFrom: baseValue ? 'global' : null,
			};

		case 'mobile':
			if ( mobileValue && Object.keys( mobileValue ).length > 0 ) {
				return { value: { ...DEFAULT_BOX_VALUE, ...mobileValue }, inheritedFrom: null };
			}
			if ( tabletValue && Object.keys( tabletValue ).length > 0 ) {
				return { value: { ...DEFAULT_BOX_VALUE, ...tabletValue }, inheritedFrom: 'tablet' };
			}
			return {
				value: baseValue ? { ...DEFAULT_BOX_VALUE, ...baseValue } : DEFAULT_BOX_VALUE,
				inheritedFrom: baseValue ? 'global' : null,
			};

		default:
			return { value: DEFAULT_BOX_VALUE, inheritedFrom: null };
	}
}

/**
 * Single Side Input Component
 *
 * @param {Object}   props          Component props
 * @param {string}   props.side     Side name (top, right, bottom, left)
 * @param {number}   props.value    Current value
 * @param {Function} props.onChange Callback for value changes
 * @param {boolean}  props.disabled Whether input is disabled
 * @param {number}   props.min      Minimum value
 * @param {number}   props.max      Maximum value
 * @param {number}   props.step     Step increment
 * @returns {JSX.Element} Number input for side
 */
function SideInput( { side, value, onChange, disabled = false, min = 0, max = 999, step = 1 } ) {
	return (
		<div
			className="gutplus-box-control__side"
			style={ {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '4px',
			} }
		>
			<NumberControl
				value={ value ?? 0 }
				onChange={ ( newValue ) => onChange( side, parseFloat( newValue ) || 0 ) }
				disabled={ disabled }
				min={ min }
				max={ max }
				step={ step }
				hideHTMLArrows
				spinControls="none"
				style={ { width: '60px' } }
				__next40pxDefaultSize
			/>
			<span
				style={ {
					fontSize: '10px',
					color: '#757575',
					textTransform: 'uppercase',
				} }
			>
				{ SIDE_LABELS[ side ] }
			</span>
		</div>
	);
}

/**
 * Box Control Component
 *
 * A 4-side input control with responsive support, unit selection,
 * and the ability to link all sides together.
 *
 * Uses FLAT BASE structure:
 * - Base/global values at ROOT level: { top: 10, unit: 'px', tablet: {...}, mobile: {...} }
 * - NOT under a 'global' key
 *
 * @param {Object}   props                Component props
 * @param {string}   props.label          Label for the control
 * @param {Object}   props.values         Responsive values with base at root, tablet/mobile as keys
 * @param {Function} props.onChange       Callback receiving (device, boxValue)
 * @param {Function} props.onReset        Optional reset callback
 * @param {boolean}  props.responsive     Whether to show device switcher (default: true)
 * @param {Array}    props.units          Available units (default: ['px', 'em', 'rem', '%'])
 * @param {string}   props.help           Help text
 * @param {number}   props.min            Minimum value (default: 0)
 * @param {number}   props.max            Maximum value (default: 999)
 * @param {number}   props.step           Step increment (default: 1)
 * @param {boolean}  props.allowNegative  Whether to allow negative values (default: false)
 * @param {string}   props.initialDevice  Initial device (default: 'global')
 * @returns {JSX.Element} Box control component
 */
export function BoxControl( {
	label,
	values = {},
	onChange,
	onReset,
	responsive = true,
	units = [ 'px', 'em', 'rem', '%' ],
	help,
	min = 0,
	max = 999,
	step = 1,
	allowNegative = false,
	initialDevice = 'global',
} ) {
	// Use global device state - all responsive controls stay in sync
	const device = useResponsiveDevice();

	// Get effective value with inheritance
	const { value: effectiveValue, inheritedFrom } = useMemo(
		() => getInheritedBoxValue( values, device ),
		[ values, device ]
	);

	const { top, right, bottom, left, linked, unit } = {
		...DEFAULT_BOX_VALUE,
		...effectiveValue,
	};

	const effectiveMin = allowNegative ? -max : min;

	// Handler for side value changes
	const handleSideChange = ( side, newValue ) => {
		const updatedValue = { ...effectiveValue };

		if ( linked ) {
			// Update all sides when linked
			updatedValue.top = newValue;
			updatedValue.right = newValue;
			updatedValue.bottom = newValue;
			updatedValue.left = newValue;
		} else {
			// Update only the specific side
			updatedValue[ side ] = newValue;
		}

		onChange( device, updatedValue );
	};

	// Handler for link toggle
	const handleLinkToggle = ( newLinked ) => {
		const updatedValue = { ...effectiveValue, linked: newLinked };

		// When linking, set all sides to the first side's value
		if ( newLinked ) {
			const firstValue = top;
			updatedValue.top = firstValue;
			updatedValue.right = firstValue;
			updatedValue.bottom = firstValue;
			updatedValue.left = firstValue;
		}

		onChange( device, updatedValue );
	};

	// Handler for unit changes
	const handleUnitChange = ( newUnit ) => {
		onChange( device, { ...effectiveValue, unit: newUnit } );
	};

	// Handler for reset
	const handleReset = () => {
		if ( onReset ) {
			onReset( device );
		} else {
			onChange( device, undefined );
		}
	};

	// Check if reset should be disabled
	// For 'global' device, check base value; for tablet/mobile, check the key directly
	const currentDeviceValue = device === 'global' ? getBaseValue( values ) : values?.[ device ];
	const isResetDisabled = ! currentDeviceValue || Object.keys( currentDeviceValue ).length === 0;

	return (
		<BaseControl
			className="gutplus-box-control"
			label={
				<Flex align="center" justify="space-between" style={ { width: '100%' } }>
					<FlexItem>
						<span style={ { display: 'flex', alignItems: 'center' } }>
							{ label }
							<InheritedBadge from={ inheritedFrom } />
						</span>
					</FlexItem>
					<FlexItem>
						<Flex gap={ 2 }>
							{ responsive && (
								<FlexItem>
									<DeviceSwitcher value={ device } />
								</FlexItem>
							) }
							<FlexItem>
								<ResetButton onClick={ handleReset } disabled={ isResetDisabled } />
							</FlexItem>
						</Flex>
					</FlexItem>
				</Flex>
			}
			help={ help }
		>
			<div className="gutplus-box-control__content">
				{ /* Unit selector and link toggle row */ }
				<Flex
					align="center"
					justify="space-between"
					style={ { marginBottom: '12px' } }
				>
					<FlexItem>
						<UnitSelector
							value={ unit }
							onChange={ handleUnitChange }
							units={ units }
						/>
					</FlexItem>
					<FlexItem>
						<LinkToggle linked={ linked } onChange={ handleLinkToggle } />
					</FlexItem>
				</Flex>

				{ /* Box inputs */ }
				{ linked ? (
					// Single input when linked
					<div style={ { display: 'flex', justifyContent: 'center' } }>
						<SideInput
							side="top"
							value={ top }
							onChange={ handleSideChange }
							min={ effectiveMin }
							max={ max }
							step={ step }
						/>
					</div>
				) : (
					// 4 inputs when unlinked - arranged in cross pattern
					<div
						className="gutplus-box-control__sides"
						style={ {
							display: 'grid',
							gridTemplateColumns: '1fr 1fr 1fr',
							gridTemplateRows: 'auto auto auto',
							gap: '8px',
							justifyItems: 'center',
							alignItems: 'center',
						} }
					>
						{ /* Top - center of first row */ }
						<div style={ { gridColumn: '2', gridRow: '1' } }>
							<SideInput
								side="top"
								value={ top }
								onChange={ handleSideChange }
								min={ effectiveMin }
								max={ max }
								step={ step }
							/>
						</div>

						{ /* Left - left of second row */ }
						<div style={ { gridColumn: '1', gridRow: '2' } }>
							<SideInput
								side="left"
								value={ left }
								onChange={ handleSideChange }
								min={ effectiveMin }
								max={ max }
								step={ step }
							/>
						</div>

						{ /* Right - right of second row */ }
						<div style={ { gridColumn: '3', gridRow: '2' } }>
							<SideInput
								side="right"
								value={ right }
								onChange={ handleSideChange }
								min={ effectiveMin }
								max={ max }
								step={ step }
							/>
						</div>

						{ /* Bottom - center of third row */ }
						<div style={ { gridColumn: '2', gridRow: '3' } }>
							<SideInput
								side="bottom"
								value={ bottom }
								onChange={ handleSideChange }
								min={ effectiveMin }
								max={ max }
								step={ step }
							/>
						</div>
					</div>
				) }
			</div>
		</BaseControl>
	);
}

export default BoxControl;
