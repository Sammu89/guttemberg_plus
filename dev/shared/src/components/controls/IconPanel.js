/**
 * Icon Panel Component
 *
 * Full panel control for managing icon attributes with conditional UI.
 * Supports single icon mode (rotation only) and dual icon mode (different icons for active/inactive states).
 * Includes responsive controls for size and offsets.
 *
 * Features:
 * - Show/hide toggle for entire icon panel
 * - Icon position selector (profile-based: accordion/toc support extreme positions)
 * - Rotation slider (-180 to 180 degrees)
 * - Toggle between single icon (rotation) and dual icon (separate active/inactive) modes
 * - IconPicker integration for character/unicode/image selection
 * - Conditional color control (only for char/library, not images)
 * - Conditional size controls (size for char/library, maxSize for images)
 * - Responsive offset controls (X and Y)
 * - Active state fallback to inactive values
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useState, useMemo, useEffect } from '@wordpress/element';
import { PanelBody, ToggleControl, TabPanel } from '@wordpress/components';
import { IconPicker } from './IconPicker';
import { SliderWithInput } from './SliderWithInput';
import { ColorControl } from './ColorControl';
import { ResponsiveWrapper } from './ResponsiveWrapper';
import { IconPositionControl } from './IconPositionControl';
import { useResponsiveDevice } from '../../hooks/useResponsiveDevice';
import { getControlConfig, getNumericDefault } from '../../config/control-config-generated';

/**
 * Get responsive value for current device
 * Handles flat values and device-keyed objects
 *
 * @param {*} value - Attribute value (can be string, number, or object with device keys)
 * @param {string} device - Current device (global, tablet, mobile)
 * @returns {number} Numeric value for the device
 */
function getResponsiveValue( value, device ) {
	// Handle null/undefined
	if ( value === null || value === undefined ) {
		return 0;
	}

	// Handle scalar values (number or string like "16px")
	if ( typeof value !== 'object' ) {
		return getNumericDefault( value );
	}

	// Handle object with device keys
	// Mobile inherits from tablet, tablet inherits from global/base
	const baseValue = getBaseValue( value );
	const tabletValue = value.tablet;
	const mobileValue = value.mobile;

	switch ( device ) {
		case 'global':
			return getNumericDefault( baseValue );
		case 'tablet':
			return getNumericDefault( tabletValue !== undefined ? tabletValue : baseValue );
		case 'mobile':
			return getNumericDefault( mobileValue !== undefined ? mobileValue : ( tabletValue !== undefined ? tabletValue : baseValue ) );
		default:
			return 0;
	}
}

/**
 * Get base value from object (excludes device keys)
 *
 * @param {Object} value - Value object
 * @returns {*} Base value (without tablet/mobile keys)
 */
function getBaseValue( value ) {
	if ( ! value || typeof value !== 'object' ) {
		return value;
	}
	const { tablet, mobile, ...base } = value;
	// If base has value/unit properties, extract just the value
	if ( base.value !== undefined ) {
		return `${ base.value }${ base.unit || '' }`;
	}
	return Object.keys( base ).length > 0 ? base : null;
}

/**
 * Set responsive value for specific device
 * Updates the value for a specific device while preserving others
 *
 * @param {*} currentValue - Current attribute value
 * @param {string} device - Device to update (global, tablet, mobile)
 * @param {string} newValue - New value (e.g., "16px")
 * @returns {*} Updated value structure
 */
function setResponsiveValue( currentValue, device, newValue ) {
	// Handle global/base updates
	if ( device === 'global' ) {
		// If current value is flat (scalar or {value, unit}), update it directly
		if ( ! currentValue || typeof currentValue !== 'object' || ! ( 'tablet' in currentValue || 'mobile' in currentValue ) ) {
			return newValue;
		}
		// Preserve existing device overrides
		const { tablet, mobile } = currentValue;
		const result = { ...parseValueWithUnit( newValue ) };
		if ( tablet !== undefined ) result.tablet = tablet;
		if ( mobile !== undefined ) result.mobile = mobile;
		return result;
	}

	// Handle tablet/mobile updates
	// If current value is flat, convert to object structure
	if ( ! currentValue || typeof currentValue !== 'object' ) {
		return {
			...parseValueWithUnit( currentValue || '0px' ),
			[ device ]: parseValueWithUnit( newValue ),
		};
	}

	// If already object with device keys, update the specific device
	const { tablet, mobile, ...base } = currentValue;
	const result = { ...base };
	if ( tablet !== undefined && device !== 'tablet' ) result.tablet = tablet;
	if ( mobile !== undefined && device !== 'mobile' ) result.mobile = mobile;
	result[ device ] = parseValueWithUnit( newValue );
	return result;
}

/**
 * Parse value with unit into object
 *
 * @param {string|number|Object} value - Value to parse
 * @returns {Object|string} Object with value and unit, or original value
 */
function parseValueWithUnit( value ) {
	if ( typeof value === 'string' ) {
		const match = value.match( /^([0-9.]+)(.*)$/ );
		if ( match ) {
			return { value: parseFloat( match[ 1 ] ), unit: match[ 2 ] || '' };
		}
	}
	if ( typeof value === 'number' ) {
		return { value, unit: 'px' };
	}
	return value;
}

/**
 * Icon Panel Component
 *
 * @param {Object} props - Component props
 * @param {string} props.blockType - Block type (accordion, tabs, toc)
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {Object} props.effectiveValues - Effective values from cascade resolution
 * @param {string} props.label - Panel label
 * @param {string} props.help - Help text
 * @returns {JSX.Element} Icon panel component
 */
export function IconPanel( {
	blockType,
	attributes,
	setAttributes,
	effectiveValues,
	label = 'Icon',
	help,
} ) {
	// Get current device for responsive controls
	const currentDevice = useResponsiveDevice();

	// Determine if icon is shown based on showIcon attribute
	const isIconVisible = effectiveValues?.showIcon !== false;

	// Different icons mode - whether to use separate icons for active/inactive states
	// Use the useDifferentIcons attribute from effectiveValues
	const [ useDifferentIcons, setUseDifferentIcons ] = useState(
		effectiveValues?.useDifferentIcons || false
	);

	// Sync state with effectiveValues when it changes
	useEffect( () => {
		setUseDifferentIcons( effectiveValues?.useDifferentIcons || false );
	}, [ effectiveValues?.useDifferentIcons ] );

	// Get positioning profile based on block type
	const positioningProfile = useMemo( () => {
		const profiles = {
			accordion: [ 'left', 'right', 'extreme-left', 'extreme-right' ],
			toc: [ 'left', 'right', 'extreme-left', 'extreme-right' ],
			tabs: [ 'left', 'right' ],
		};
		return profiles[ blockType ] || profiles.accordion;
	}, [ blockType ] );

	// Position labels for ButtonGroup
	const positionLabels = {
		left: 'Left',
		right: 'Right',
		'extreme-left': 'Far Left',
		'extreme-right': 'Far Right',
	};

	// Handler for attribute changes
	const handleChange = ( updates ) => {
		setAttributes( updates );
	};

	// Handler for Show Icon toggle
	const handleShowIconToggle = ( checked ) => {
		handleChange( { showIcon: checked } );
	};

	// If icon is hidden, show only the toggle
	if ( ! isIconVisible ) {
		return (
			<PanelBody title={ label } initialOpen={ false }>
				<ToggleControl
					label="Show Icon"
					checked={ false }
					onChange={ handleShowIconToggle }
					help="Display expand/collapse icon"
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		);
	}

	return (
		<PanelBody title={ label } initialOpen={ false }>
			{ /* Show Icon Toggle */ }
			<ToggleControl
				label="Show Icon"
				checked={ isIconVisible }
				onChange={ handleShowIconToggle }
				help="Display expand/collapse icon"
				__nextHasNoMarginBottom
			/>

			{ /* Icon Positioning */ }
			<div style={ { marginTop: '16px', marginBottom: '16px' } }>
				<IconPositionControl
					label="Icon Position"
					value={ effectiveValues?.iconPosition || 'right' }
					onChange={ ( position ) => handleChange( { iconPosition: position } ) }
					blockType={ blockType }
				/>
			</div>

			{ /* Different Icons Toggle */ }
			<ToggleControl
				label="Different icons for active state"
				checked={ useDifferentIcons }
				onChange={ ( checked ) => {
					setUseDifferentIcons( checked );
					// Save the useDifferentIcons attribute
					handleChange( { useDifferentIcons: checked } );
					if ( ! checked ) {
						// Clear active state attributes
						handleChange( {
							useDifferentIcons: false,
							iconActiveSource: null,
							iconActiveColor: null,
							iconActiveSize: null,
							iconActiveMaxSize: null,
							iconActiveOffsetX: null,
							iconActiveOffsetY: null,
						} );
					}
				} }
				help="Use separate icon when accordion/tab is open"
				__nextHasNoMarginBottom
			/>

			{ /* Rotation Slider - Always shown when icon is visible */ }
			<div style={ { marginTop: '16px', marginBottom: '16px' } }>
				<SliderWithInput
					label="Rotation Angle"
					value={ parseValueWithUnit( effectiveValues?.iconRotation || '180deg' ) }
					onChange={ ( val ) => {
						// val is already an object with value and unit from SliderWithInput
						const valueStr = typeof val === 'object' && val.value !== undefined
							? `${ val.value }${ val.unit || 'deg' }`
							: `${ val }deg`;
						handleChange( { iconRotation: valueStr } );
					} }
					min={ -180 }
					max={ 180 }
					step={ 1 }
					units={ [ 'deg' ] }
					help={ useDifferentIcons
						? "Rotation applied to both icons during transition"
						: "Rotation applied when open"
					}
					responsive={ false }
					canBeResponsive={ false }
				/>
			</div>

			<hr style={ { margin: '16px 0', borderTop: '1px solid #ddd' } } />

			{ /* Single Icon Mode OR Inactive/Active Tabs */ }
			{ ! useDifferentIcons ? (
				<SingleIconMode
					attributes={ attributes }
					effectiveValues={ effectiveValues }
					onChange={ handleChange }
					currentDevice={ currentDevice }
					blockType={ blockType }
				/>
			) : (
				<DualIconMode
					attributes={ attributes }
					effectiveValues={ effectiveValues }
					onChange={ handleChange }
					currentDevice={ currentDevice }
					blockType={ blockType }
				/>
			) }

			{ help && (
				<p className="components-base-control__help" style={ { marginTop: '16px' } }>
					{ help }
				</p>
			) }
		</PanelBody>
	);
}

/**
 * Single Icon Mode Component
 * Shows controls for inactive icon only (rotation handles active state)
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Object} props.effectiveValues - Effective values from cascade
 * @param {Function} props.onChange - Change handler
 * @param {string} props.currentDevice - Current responsive device
 * @param {string} props.blockType - Block type
 * @returns {JSX.Element} Single icon mode controls
 */
function SingleIconMode( { attributes, effectiveValues, onChange, currentDevice, blockType } ) {
	const iconSource = effectiveValues?.iconInactiveSource || { kind: 'char', value: '▾' };
	const isImage = iconSource.kind === 'image';

	return (
		<div className="single-icon-mode">
			<h4 style={ { margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600 } }>
				Icon Settings
			</h4>

			{ /* Icon Picker */ }
			<IconPicker
				label="Icon"
				value={ iconSource }
				onChange={ ( newSource ) => onChange( { iconInactiveSource: newSource } ) }
			/>

			{ /* Color (only for char/library) */ }
			{ ! isImage && (
				<div style={ { marginTop: '16px' } }>
					<ColorControl
						label="Icon Color"
						value={ effectiveValues?.iconInactiveColor || '#666666' }
						onChange={ ( color ) => onChange( { iconInactiveColor: color } ) }
					/>
				</div>
			) }

			{ /* Size (only for char/library, responsive) */ }
			{ ! isImage && (
				<div style={ { marginTop: '16px' } }>
					<ResponsiveWrapper
						label="Icon Size"
						values={ attributes.iconInactiveSize || {} }
						onChange={ ( device, value ) => {
							onChange( {
								iconInactiveSize: setResponsiveValue(
									attributes.iconInactiveSize,
									device,
									typeof value === 'object' && value.value !== undefined
										? `${ value.value }${ value.unit || 'px' }`
										: `${ value }px`
								),
							} );
						} }
						showReset={ true }
					>
						{ ( { value, device, onChange: deviceOnChange } ) => (
							<SliderWithInput
								value={ parseValueWithUnit( value || '16px' ) }
								onChange={ deviceOnChange }
								min={ 8 }
								max={ 64 }
								step={ 1 }
								units={ [ 'px', 'rem', 'em' ] }
								responsive={ false }
								canBeResponsive={ false }
							/>
						) }
					</ResponsiveWrapper>
				</div>
			) }

			{ /* Max Size (only for image, responsive) */ }
			{ isImage && (
				<div style={ { marginTop: '16px' } }>
					<ResponsiveWrapper
						label="Image Size"
						values={ attributes.iconInactiveMaxSize || {} }
						onChange={ ( device, value ) => {
							onChange( {
								iconInactiveMaxSize: setResponsiveValue(
									attributes.iconInactiveMaxSize,
									device,
									typeof value === 'object' && value.value !== undefined
										? `${ value.value }${ value.unit || 'px' }`
										: `${ value }px`
								),
							} );
						} }
						showReset={ true }
					>
						{ ( { value, device, onChange: deviceOnChange } ) => (
							<SliderWithInput
								value={ parseValueWithUnit( value || '32px' ) }
								onChange={ deviceOnChange }
								min={ 16 }
								max={ 128 }
								step={ 1 }
								units={ [ 'px', 'rem', 'em' ] }
								responsive={ false }
								canBeResponsive={ false }
							/>
						) }
					</ResponsiveWrapper>
				</div>
			) }

			{ /* Offset X (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<ResponsiveWrapper
					label="Offset X"
					values={ attributes.iconInactiveOffsetX || {} }
					onChange={ ( device, value ) => {
						onChange( {
							iconInactiveOffsetX: setResponsiveValue(
								attributes.iconInactiveOffsetX,
								device,
								typeof value === 'object' && value.value !== undefined
									? `${ value.value }${ value.unit || 'px' }`
									: `${ value }px`
							),
						} );
					} }
					showReset={ true }
				>
					{ ( { value, device, onChange: deviceOnChange } ) => (
						<SliderWithInput
							value={ parseValueWithUnit( value || '0px' ) }
							onChange={ deviceOnChange }
							min={ -50 }
							max={ 50 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					) }
				</ResponsiveWrapper>
			</div>

			{ /* Offset Y (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<ResponsiveWrapper
					label="Offset Y"
					values={ attributes.iconInactiveOffsetY || {} }
					onChange={ ( device, value ) => {
						onChange( {
							iconInactiveOffsetY: setResponsiveValue(
								attributes.iconInactiveOffsetY,
								device,
								typeof value === 'object' && value.value !== undefined
									? `${ value.value }${ value.unit || 'px' }`
									: `${ value }px`
							),
						} );
					} }
					showReset={ true }
				>
					{ ( { value, device, onChange: deviceOnChange } ) => (
						<SliderWithInput
							value={ parseValueWithUnit( value || '0px' ) }
							onChange={ deviceOnChange }
							min={ -50 }
							max={ 50 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					) }
				</ResponsiveWrapper>
			</div>
		</div>
	);
}

/**
 * Dual Icon Mode Component
 * Shows tabs for inactive and active icon states
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Object} props.effectiveValues - Effective values from cascade
 * @param {Function} props.onChange - Change handler
 * @param {string} props.currentDevice - Current responsive device
 * @param {string} props.blockType - Block type
 * @returns {JSX.Element} Dual icon mode controls with tabs
 */
function DualIconMode( { attributes, effectiveValues, onChange, currentDevice, blockType } ) {
	const tabs = [
		{ name: 'inactive', title: 'Inactive (Closed)' },
		{ name: 'active', title: 'Active (Open)' },
	];

	return (
		<div className="dual-icon-mode">
			{ /* Preview Open State Toggle - OUTSIDE tabs */ }
			<div style={ { marginBottom: '16px', padding: '12px', backgroundColor: '#f0f0f1', borderRadius: '4px' } }>
				<ToggleControl
					label="Preview Open State"
					checked={ effectiveValues?.initiallyOpen || false }
					onChange={ ( checked ) => onChange( { initiallyOpen: checked } ) }
					help="Toggle to preview the open/active icon in the editor"
					__nextHasNoMarginBottom
				/>
			</div>

			{ /* Inactive/Active Tabs */ }
			<TabPanel
				className="icon-state-tabs"
				tabs={ tabs }
				initialTabName="inactive"
			>
				{ ( tab ) => (
					<IconStateControls
						state={ tab.name }
						attributes={ attributes }
						effectiveValues={ effectiveValues }
						onChange={ onChange }
						currentDevice={ currentDevice }
						blockType={ blockType }
					/>
				) }
			</TabPanel>
		</div>
	);
}

/**
 * Icon State Controls Component
 * Shows controls for a specific icon state (inactive or active)
 *
 * @param {Object} props - Component props
 * @param {string} props.state - Icon state (inactive or active)
 * @param {Object} props.attributes - Block attributes
 * @param {Object} props.effectiveValues - Effective values from cascade
 * @param {Function} props.onChange - Change handler
 * @param {string} props.currentDevice - Current responsive device
 * @param {string} props.blockType - Block type
 * @returns {JSX.Element} Icon state controls
 */
function IconStateControls( { state, attributes, effectiveValues, onChange, currentDevice, blockType } ) {
	const prefix = state === 'inactive' ? 'iconInactive' : 'iconActive';
	const iconSource = effectiveValues?.[ `${ prefix }Source` ] || { kind: 'char', value: '▾' };
	const isImage = iconSource.kind === 'image';

	return (
		<div className={ `icon-state-${ state }` } style={ { marginTop: '16px' } }>
			{ /* Icon Picker */ }
			<IconPicker
				label={ `${ state === 'inactive' ? 'Closed' : 'Open' } Icon` }
				value={ iconSource }
				onChange={ ( newSource ) => onChange( { [ `${ prefix }Source` ]: newSource } ) }
			/>

			{ /* Color (only for char/library) */ }
			{ ! isImage && (
				<div style={ { marginTop: '16px' } }>
					<ColorControl
						label="Icon Color"
						value={ effectiveValues?.[ `${ prefix }Color` ] || '#666666' }
						onChange={ ( color ) => onChange( { [ `${ prefix }Color` ]: color } ) }
					/>
				</div>
			) }

			{ /* Size (only for char/library, responsive) */ }
			{ ! isImage && (
				<div style={ { marginTop: '16px' } }>
					<ResponsiveWrapper
						label="Icon Size"
						values={ attributes[ `${ prefix }Size` ] || {} }
						onChange={ ( device, value ) => {
							onChange( {
								[ `${ prefix }Size` ]: setResponsiveValue(
									attributes[ `${ prefix }Size` ],
									device,
									typeof value === 'object' && value.value !== undefined
										? `${ value.value }${ value.unit || 'px' }`
										: `${ value }px`
								),
							} );
						} }
						showReset={ true }
					>
						{ ( { value, device, onChange: deviceOnChange } ) => (
							<SliderWithInput
								value={ parseValueWithUnit( value || '16px' ) }
								onChange={ deviceOnChange }
								min={ 8 }
								max={ 64 }
								step={ 1 }
								units={ [ 'px', 'rem', 'em' ] }
								responsive={ false }
								canBeResponsive={ false }
							/>
						) }
					</ResponsiveWrapper>
				</div>
			) }

			{ /* Max Size (only for image, responsive) */ }
			{ isImage && (
				<div style={ { marginTop: '16px' } }>
					<ResponsiveWrapper
						label="Image Size"
						values={ attributes[ `${ prefix }MaxSize` ] || {} }
						onChange={ ( device, value ) => {
							onChange( {
								[ `${ prefix }MaxSize` ]: setResponsiveValue(
									attributes[ `${ prefix }MaxSize` ],
									device,
									typeof value === 'object' && value.value !== undefined
										? `${ value.value }${ value.unit || 'px' }`
										: `${ value }px`
								),
							} );
						} }
						showReset={ true }
					>
						{ ( { value, device, onChange: deviceOnChange } ) => (
							<SliderWithInput
								value={ parseValueWithUnit( value || '32px' ) }
								onChange={ deviceOnChange }
								min={ 16 }
								max={ 128 }
								step={ 1 }
								units={ [ 'px', 'rem', 'em' ] }
								responsive={ false }
								canBeResponsive={ false }
							/>
						) }
					</ResponsiveWrapper>
				</div>
			) }

			{ /* Offset X (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<ResponsiveWrapper
					label="Offset X"
					values={ attributes[ `${ prefix }OffsetX` ] || {} }
					onChange={ ( device, value ) => {
						onChange( {
							[ `${ prefix }OffsetX` ]: setResponsiveValue(
								attributes[ `${ prefix }OffsetX` ],
								device,
								typeof value === 'object' && value.value !== undefined
									? `${ value.value }${ value.unit || 'px' }`
									: `${ value }px`
							),
						} );
					} }
					showReset={ true }
				>
					{ ( { value, device, onChange: deviceOnChange } ) => (
						<SliderWithInput
							value={ parseValueWithUnit( value || '0px' ) }
							onChange={ deviceOnChange }
							min={ -50 }
							max={ 50 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					) }
				</ResponsiveWrapper>
			</div>

			{ /* Offset Y (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<ResponsiveWrapper
					label="Offset Y"
					values={ attributes[ `${ prefix }OffsetY` ] || {} }
					onChange={ ( device, value ) => {
						onChange( {
							[ `${ prefix }OffsetY` ]: setResponsiveValue(
								attributes[ `${ prefix }OffsetY` ],
								device,
								typeof value === 'object' && value.value !== undefined
									? `${ value.value }${ value.unit || 'px' }`
									: `${ value }px`
							),
						} );
					} }
					showReset={ true }
				>
					{ ( { value, device, onChange: deviceOnChange } ) => (
						<SliderWithInput
							value={ parseValueWithUnit( value || '0px' ) }
							onChange={ deviceOnChange }
							min={ -50 }
							max={ 50 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					) }
				</ResponsiveWrapper>
			</div>

			{ /* Active state fallback message */ }
			{ state === 'active' && (
				<p
					className="description"
					style={ {
						fontSize: '12px',
						color: '#666',
						marginTop: '16px',
						fontStyle: 'italic',
					} }
				>
					Active values fallback to inactive values if not set.
				</p>
			) }
		</div>
	);
}

export default IconPanel;
