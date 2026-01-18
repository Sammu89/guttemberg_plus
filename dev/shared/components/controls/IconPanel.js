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
 * @package
 * @since 1.0.0
 */

import { useState, useMemo, useEffect } from '@wordpress/element';
import { PanelBody, ToggleControl, TabPanel, BaseControl, Flex } from '@wordpress/components';
import { IconPicker } from './IconPicker';
import { SliderWithInput } from './SliderWithInput';
import { ColorControl } from './ColorControl';
import { UtilityBar } from './UtilityBar';
import { IconPositionControl } from './IconPositionControl';
import { useResponsiveDevice } from '../../hooks/useResponsiveDevice';
import { getControlConfig, getNumericDefault } from '../../config/control-config-generated';

/**
 * Get responsive value for current device
 * Handles flat values and device-keyed objects
 *
 * @param {*}      value  - Attribute value (can be string, number, or object with device keys)
 * @param {string} device - Current device (global, tablet, mobile)
 * @return {number} Numeric value for the device
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
			return getNumericDefault(
				mobileValue !== undefined
					? mobileValue
					: tabletValue !== undefined
					? tabletValue
					: baseValue
			);
		default:
			return 0;
	}
}

/**
 * Get base value from object (excludes device keys)
 *
 * @param {Object} value - Value object
 * @return {*} Base value (without tablet/mobile keys)
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
 * @param {*}      currentValue - Current attribute value
 * @param {string} device       - Device to update (global, tablet, mobile)
 * @param {string} newValue     - New value (e.g., "16px")
 * @return {*} Updated value structure
 */
function setResponsiveValue( currentValue, device, newValue ) {
	const isClearing = newValue === undefined || newValue === null;
	const hasDeviceKeys =
		currentValue &&
		typeof currentValue === 'object' &&
		( 'tablet' in currentValue || 'mobile' in currentValue );

	// Handle global/base updates
	if ( device === 'global' ) {
		// If current value is flat (scalar or {value, unit}), update it directly
		if ( ! currentValue || typeof currentValue !== 'object' || ! hasDeviceKeys ) {
			return isClearing ? undefined : newValue;
		}
		// Preserve existing device overrides
		const { tablet, mobile } = currentValue;
		if ( isClearing ) {
			const result = {};
			if ( tablet !== undefined ) {
				result.tablet = tablet;
			}
			if ( mobile !== undefined ) {
				result.mobile = mobile;
			}
			return Object.keys( result ).length > 0 ? result : undefined;
		}

		const parsedValue = parseValueWithUnit( newValue );
		const result =
			parsedValue && typeof parsedValue === 'object'
				? { ...parsedValue }
				: { value: parsedValue };
		if ( tablet !== undefined ) {
			result.tablet = tablet;
		}
		if ( mobile !== undefined ) {
			result.mobile = mobile;
		}
		return result;
	}

	// Handle tablet/mobile updates
	// If current value is flat, convert to object structure
	if ( ! currentValue || typeof currentValue !== 'object' ) {
		if ( isClearing ) {
			return currentValue;
		}
		return {
			...parseValueWithUnit( currentValue || '0px' ),
			[ device ]: parseValueWithUnit( newValue ),
		};
	}

	// If already object with device keys, update the specific device
	const { tablet, mobile, ...base } = currentValue;
	const result = { ...base };
	if ( tablet !== undefined && device !== 'tablet' ) {
		result.tablet = tablet;
	}
	if ( mobile !== undefined && device !== 'mobile' ) {
		result.mobile = mobile;
	}
	if ( ! isClearing ) {
		result[ device ] = parseValueWithUnit( newValue );
	}
	return Object.keys( result ).length > 0 ? result : undefined;
}

/**
 * Parse value with unit into object
 *
 * @param {string|number|Object} value - Value to parse
 * @return {Object|string} Object with value and unit, or original value
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

function getControlDefault( blockType, attrName, fallback ) {
	const configDefault = getControlConfig( blockType, attrName )?.default;
	return configDefault !== undefined ? configDefault : fallback;
}

/**
 * Icon Panel Component
 *
 * @param {Object}   props                     - Component props
 * @param {string}   props.blockType           - Block type (accordion, tabs, toc)
 * @param {Object}   props.attributes          - Block attributes
 * @param {Function} props.setAttributes       - Function to update attributes
 * @param {Object}   props.effectiveValues     - Effective values from cascade resolution
 * @param {string}   props.label               - Panel label
 * @param {string}   props.help                - Help text
 * @param {Function} props.onIconPreviewChange - Optional editor-only preview handler
 * @return {JSX.Element} Icon panel component
 */
export function IconPanel( {
	blockType,
	attributes,
	setAttributes,
	effectiveValues,
	label = 'Icon',
	help,
	onIconPreviewChange,
} ) {
	// Get current device for responsive controls
	const currentDevice = useResponsiveDevice();

	// Helper to toggle responsive mode for a specific attribute
	const handleResponsiveToggle = ( attributeName, enabled ) => {
		handleChange( {
			responsiveEnabled: {
				...( attributes.responsiveEnabled || {} ),
				[ attributeName ]: enabled,
			},
		} );
	};

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
			accordion: [ 'left', 'right', 'box-left', 'box-right' ],
			toc: [ 'left', 'right', 'box-left', 'box-right' ],
			tabs: [ 'left', 'right' ],
		};
		return profiles[ blockType ] || profiles.accordion;
	}, [ blockType ] );

	// Position labels for ButtonGroup
	const positionLabels = {
		left: 'Left',
		right: 'Right',
		'box-left': 'Far Left',
		'box-right': 'Far Right',
	};

	// Handler for attribute changes
	const handleChange = ( updates ) => {
		setAttributes( updates );
	};

	const getResponsiveResetUpdate = ( attrName, fallback ) => ( {
		[ attrName ]: getControlDefault( blockType, attrName, fallback ),
		responsiveEnabled: {
			...( attributes.responsiveEnabled || {} ),
			[ attrName ]: false,
		},
	} );

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
				label="Different icons for open/close"
				checked={ useDifferentIcons }
				onChange={ ( checked ) => {
					setUseDifferentIcons( checked );
					// Save the useDifferentIcons attribute
					handleChange( { useDifferentIcons: checked } );
				} }
				help="Use separate icon when accordion/tab is open"
				__nextHasNoMarginBottom
			/>

			{ /* Rotation Animation Slider - Always shown when icon is visible */ }
			<div style={ { marginTop: '16px', marginBottom: '16px' } }>
				<SliderWithInput
					label="Rotation Animation"
					value={ parseValueWithUnit( effectiveValues?.iconRotation || '180deg' ) }
					onChange={ ( val ) => {
						// val is already an object with value and unit from SliderWithInput
						const valueStr =
							typeof val === 'object' && val.value !== undefined
								? `${ val.value }${ val.unit || 'deg' }`
								: `${ val }deg`;
						handleChange( { iconRotation: valueStr } );
					} }
					min={ -180 }
					max={ 180 }
					step={ 1 }
					units={ [ 'deg' ] }
					help={
						useDifferentIcons
							? 'Animation rotation added on open/close (on top of initial rotation)'
							: 'Animation rotation added when open (on top of initial rotation)'
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
					onResponsiveToggle={ handleResponsiveToggle }
				/>
			) : (
				<DualIconMode
					attributes={ attributes }
					effectiveValues={ effectiveValues }
					onChange={ handleChange }
					currentDevice={ currentDevice }
					blockType={ blockType }
					onIconPreviewChange={ onIconPreviewChange }
					onResponsiveToggle={ handleResponsiveToggle }
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
 * @param {Object}   props                    - Component props
 * @param {Object}   props.attributes         - Block attributes
 * @param {Object}   props.effectiveValues    - Effective values from cascade
 * @param {Function} props.onChange           - Change handler
 * @param {string}   props.currentDevice      - Current responsive device
 * @param {string}   props.blockType          - Block type
 * @param {Function} props.onResponsiveToggle - Handler for responsive toggle
 * @return {JSX.Element} Single icon mode controls
 */
function SingleIconMode( {
	attributes,
	effectiveValues,
	onChange,
	currentDevice,
	blockType,
	onResponsiveToggle,
} ) {
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

			{ /* Initial Rotation */ }
			<div style={ { marginTop: '16px' } }>
				<SliderWithInput
					label="Rotation Angle"
					value={ parseValueWithUnit( effectiveValues?.iconInactiveRotation || '0deg' ) }
					onChange={ ( val ) => {
						const valueStr =
							typeof val === 'object' && val.value !== undefined
								? `${ val.value }${ val.unit || 'deg' }`
								: `${ val }deg`;
						onChange( { iconInactiveRotation: valueStr } );
					} }
					min={ -180 }
					max={ 180 }
					step={ 1 }
					units={ [ 'deg' ] }
					help="Initial rotation for the closed icon"
					responsive={ false }
					canBeResponsive={ false }
				/>
			</div>

			{ /* Size (only for char/library, responsive) */ }
			{ ! isImage && (
				<div style={ { marginTop: '16px' } }>
					<BaseControl
						label={
							<Flex justify="space-between" style={ { width: '100%' } }>
								<span>Icon Size</span>
								<UtilityBar
									canBeResponsive={ true }
									isResponsiveEnabled={
										attributes.responsiveEnabled?.iconInactiveSize || false
									}
									currentDevice={ currentDevice }
									onResponsiveToggle={ () =>
										onResponsiveToggle( 'iconInactiveSize', true )
									}
									onReset={ () => {
										onChange(
											getResponsiveResetUpdate( 'iconInactiveSize', '16px' )
										);
									} }
									resetDisabled={
										! attributes.iconInactiveSize && currentDevice === 'global'
									}
								/>
							</Flex>
						}
						__nextHasNoMarginBottom
					>
						<SliderWithInput
							value={ parseValueWithUnit(
								getResponsiveValue( attributes.iconInactiveSize, currentDevice ) ||
									getControlDefault( blockType, 'iconInactiveSize', '16px' )
							) }
							onChange={ ( val ) => {
								const valueStr =
									typeof val === 'object' && val.value !== undefined
										? `${ val.value }${ val.unit || 'px' }`
										: `${ val }px`;
								onChange( {
									iconInactiveSize: setResponsiveValue(
										attributes.iconInactiveSize,
										attributes.responsiveEnabled?.iconInactiveSize
											? currentDevice
											: 'global',
										valueStr
									),
								} );
							} }
							min={ 8 }
							max={ 64 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					</BaseControl>
				</div>
			) }

			{ /* Max Size (only for image, responsive) */ }
			{ isImage && (
				<div style={ { marginTop: '16px' } }>
					<BaseControl
						label={
							<Flex justify="space-between" style={ { width: '100%' } }>
								<span>Image Size</span>
								<UtilityBar
									canBeResponsive={ true }
									isResponsiveEnabled={
										attributes.responsiveEnabled?.iconInactiveMaxSize || false
									}
									currentDevice={ currentDevice }
									onResponsiveToggle={ () =>
										onResponsiveToggle( 'iconInactiveMaxSize', true )
									}
									onReset={ () => {
										onChange(
											getResponsiveResetUpdate(
												'iconInactiveMaxSize',
												'32px'
											)
										);
									} }
									resetDisabled={
										! attributes.iconInactiveMaxSize &&
										currentDevice === 'global'
									}
								/>
							</Flex>
						}
						__nextHasNoMarginBottom
					>
						<SliderWithInput
							value={ parseValueWithUnit(
								getResponsiveValue(
									attributes.iconInactiveMaxSize,
									currentDevice
								) || getControlDefault( blockType, 'iconInactiveMaxSize', '32px' )
							) }
							onChange={ ( val ) => {
								const valueStr =
									typeof val === 'object' && val.value !== undefined
										? `${ val.value }${ val.unit || 'px' }`
										: `${ val }px`;
								onChange( {
									iconInactiveMaxSize: setResponsiveValue(
										attributes.iconInactiveMaxSize,
										attributes.responsiveEnabled?.iconInactiveMaxSize
											? currentDevice
											: 'global',
										valueStr
									),
								} );
							} }
							min={ 16 }
							max={ 128 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					</BaseControl>
				</div>
			) }

			{ /* Offset X (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<BaseControl
					label={
						<Flex justify="space-between" style={ { width: '100%' } }>
							<span>Offset X</span>
							<UtilityBar
								canBeResponsive={ true }
								isResponsiveEnabled={
									attributes.responsiveEnabled?.iconInactiveOffsetX || false
								}
								currentDevice={ currentDevice }
								onResponsiveToggle={ () =>
									onResponsiveToggle( 'iconInactiveOffsetX', true )
								}
								onReset={ () => {
									onChange(
										getResponsiveResetUpdate( 'iconInactiveOffsetX', '0px' )
									);
								} }
								resetDisabled={
									! attributes.iconInactiveOffsetX && currentDevice === 'global'
								}
							/>
						</Flex>
					}
					__nextHasNoMarginBottom
				>
					<SliderWithInput
						value={ parseValueWithUnit(
							getResponsiveValue( attributes.iconInactiveOffsetX, currentDevice ) ||
								getControlDefault( blockType, 'iconInactiveOffsetX', '0px' )
						) }
						onChange={ ( val ) => {
							const valueStr =
								typeof val === 'object' && val.value !== undefined
									? `${ val.value }${ val.unit || 'px' }`
									: `${ val }px`;
							onChange( {
								iconInactiveOffsetX: setResponsiveValue(
									attributes.iconInactiveOffsetX,
									attributes.responsiveEnabled?.iconInactiveOffsetX
										? currentDevice
										: 'global',
									valueStr
								),
							} );
						} }
						min={ -50 }
						max={ 50 }
						step={ 1 }
						units={ [ 'px', 'rem', 'em' ] }
						responsive={ false }
						canBeResponsive={ false }
					/>
				</BaseControl>
			</div>

			{ /* Offset Y (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<BaseControl
					label={
						<Flex justify="space-between" style={ { width: '100%' } }>
							<span>Offset Y</span>
							<UtilityBar
								canBeResponsive={ true }
								isResponsiveEnabled={
									attributes.responsiveEnabled?.iconInactiveOffsetY || false
								}
								currentDevice={ currentDevice }
								onResponsiveToggle={ () =>
									onResponsiveToggle( 'iconInactiveOffsetY', true )
								}
								onReset={ () => {
									onChange(
										getResponsiveResetUpdate( 'iconInactiveOffsetY', '0px' )
									);
								} }
								resetDisabled={
									! attributes.iconInactiveOffsetY && currentDevice === 'global'
								}
							/>
						</Flex>
					}
					__nextHasNoMarginBottom
				>
					<SliderWithInput
						value={ parseValueWithUnit(
							getResponsiveValue( attributes.iconInactiveOffsetY, currentDevice ) ||
								getControlDefault( blockType, 'iconInactiveOffsetY', '0px' )
						) }
						onChange={ ( val ) => {
							const valueStr =
								typeof val === 'object' && val.value !== undefined
									? `${ val.value }${ val.unit || 'px' }`
									: `${ val }px`;
							onChange( {
								iconInactiveOffsetY: setResponsiveValue(
									attributes.iconInactiveOffsetY,
									attributes.responsiveEnabled?.iconInactiveOffsetY
										? currentDevice
										: 'global',
									valueStr
								),
							} );
						} }
						min={ -50 }
						max={ 50 }
						step={ 1 }
						units={ [ 'px', 'rem', 'em' ] }
						responsive={ false }
						canBeResponsive={ false }
					/>
				</BaseControl>
			</div>
		</div>
	);
}

/**
 * Dual Icon Mode Component
 * Shows tabs for inactive and active icon states
 *
 * @param {Object}   props                     - Component props
 * @param {Object}   props.attributes          - Block attributes
 * @param {Object}   props.effectiveValues     - Effective values from cascade
 * @param {Function} props.onChange            - Change handler
 * @param {string}   props.currentDevice       - Current responsive device
 * @param {string}   props.blockType           - Block type
 * @param {Function} props.onResponsiveToggle  - Handler for responsive toggle
 * @param            props.onIconPreviewChange
 * @return {JSX.Element} Dual icon mode controls with tabs
 */
function DualIconMode( {
	attributes,
	effectiveValues,
	onChange,
	currentDevice,
	blockType,
	onIconPreviewChange,
	onResponsiveToggle,
} ) {
	const tabs = [
		{ name: 'inactive', title: 'Inactive (Closed)' },
		{ name: 'active', title: 'Active (Open)' },
	];

	return (
		<div className="dual-icon-mode">
			{ /* Inactive/Active Tabs */ }
			<TabPanel
				className="icon-state-tabs"
				tabs={ tabs }
				initialTabName="inactive"
				onSelect={ ( tabName ) => {
					if ( onIconPreviewChange ) {
						onIconPreviewChange( tabName );
					}
				} }
			>
				{ ( tab ) => (
					<IconStateControls
						state={ tab.name }
						attributes={ attributes }
						effectiveValues={ effectiveValues }
						onChange={ onChange }
						currentDevice={ currentDevice }
						blockType={ blockType }
						onResponsiveToggle={ onResponsiveToggle }
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
 * @param {Object}   props                    - Component props
 * @param {string}   props.state              - Icon state (inactive or active)
 * @param {Object}   props.attributes         - Block attributes
 * @param {Object}   props.effectiveValues    - Effective values from cascade
 * @param {Function} props.onChange           - Change handler
 * @param {string}   props.currentDevice      - Current responsive device
 * @param {string}   props.blockType          - Block type
 * @param {Function} props.onResponsiveToggle - Handler for responsive toggle
 * @return {JSX.Element} Icon state controls
 */
function IconStateControls( {
	state,
	attributes,
	effectiveValues,
	onChange,
	currentDevice,
	blockType,
	onResponsiveToggle,
} ) {
	const prefix = state === 'inactive' ? 'iconInactive' : 'iconActive';
	const iconSource = effectiveValues?.[ `${ prefix }Source` ] || { kind: 'char', value: '▾' };
	const isImage = iconSource.kind === 'image';
	const getResponsiveResetUpdate = ( attrName, fallback ) => ( {
		[ attrName ]: getControlDefault( blockType, attrName, fallback ),
		responsiveEnabled: {
			...( attributes.responsiveEnabled || {} ),
			[ attrName ]: false,
		},
	} );

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

			{ /* Initial Rotation */ }
			<div style={ { marginTop: '16px' } }>
				<SliderWithInput
					label="Rotation Angle"
					value={ parseValueWithUnit(
						effectiveValues?.[ `${ prefix }Rotation` ] || '0deg'
					) }
					onChange={ ( val ) => {
						const valueStr =
							typeof val === 'object' && val.value !== undefined
								? `${ val.value }${ val.unit || 'deg' }`
								: `${ val }deg`;
						onChange( { [ `${ prefix }Rotation` ]: valueStr } );
					} }
					min={ -180 }
					max={ 180 }
					step={ 1 }
					units={ [ 'deg' ] }
					help={
						state === 'active'
							? 'Initial rotation for the open icon'
							: 'Initial rotation for the closed icon'
					}
					responsive={ false }
					canBeResponsive={ false }
				/>
			</div>

			{ /* Size (only for char/library, responsive) */ }
			{ ! isImage && (
				<div style={ { marginTop: '16px' } }>
					<BaseControl
						label={
							<Flex justify="space-between" style={ { width: '100%' } }>
								<span>Icon Size</span>
								<UtilityBar
									canBeResponsive={ true }
									isResponsiveEnabled={
										attributes.responsiveEnabled?.[ `${ prefix }Size` ] || false
									}
									currentDevice={ currentDevice }
									onResponsiveToggle={ () =>
										onResponsiveToggle( `${ prefix }Size`, true )
									}
									onReset={ () => {
										onChange(
											getResponsiveResetUpdate( `${ prefix }Size`, '16px' )
										);
									} }
									resetDisabled={
										! attributes[ `${ prefix }Size` ] &&
										currentDevice === 'global'
									}
								/>
							</Flex>
						}
						__nextHasNoMarginBottom
					>
						<SliderWithInput
							value={ parseValueWithUnit(
								getResponsiveValue(
									attributes[ `${ prefix }Size` ],
									currentDevice
								) || getControlDefault( blockType, `${ prefix }Size`, '16px' )
							) }
							onChange={ ( val ) => {
								const valueStr =
									typeof val === 'object' && val.value !== undefined
										? `${ val.value }${ val.unit || 'px' }`
										: `${ val }px`;
								onChange( {
									[ `${ prefix }Size` ]: setResponsiveValue(
										attributes[ `${ prefix }Size` ],
										attributes.responsiveEnabled?.[ `${ prefix }Size` ]
											? currentDevice
											: 'global',
										valueStr
									),
								} );
							} }
							min={ 8 }
							max={ 64 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					</BaseControl>
				</div>
			) }

			{ /* Max Size (only for image, responsive) */ }
			{ isImage && (
				<div style={ { marginTop: '16px' } }>
					<BaseControl
						label={
							<Flex justify="space-between" style={ { width: '100%' } }>
								<span>Image Size</span>
								<UtilityBar
									canBeResponsive={ true }
									isResponsiveEnabled={
										attributes.responsiveEnabled?.[ `${ prefix }MaxSize` ] ||
										false
									}
									currentDevice={ currentDevice }
									onResponsiveToggle={ () =>
										onResponsiveToggle( `${ prefix }MaxSize`, true )
									}
									onReset={ () => {
										onChange(
											getResponsiveResetUpdate( `${ prefix }MaxSize`, '32px' )
										);
									} }
									resetDisabled={
										! attributes[ `${ prefix }MaxSize` ] &&
										currentDevice === 'global'
									}
								/>
							</Flex>
						}
						__nextHasNoMarginBottom
					>
						<SliderWithInput
							value={ parseValueWithUnit(
								getResponsiveValue(
									attributes[ `${ prefix }MaxSize` ],
									currentDevice
								) || getControlDefault( blockType, `${ prefix }MaxSize`, '32px' )
							) }
							onChange={ ( val ) => {
								const valueStr =
									typeof val === 'object' && val.value !== undefined
										? `${ val.value }${ val.unit || 'px' }`
										: `${ val }px`;
								onChange( {
									[ `${ prefix }MaxSize` ]: setResponsiveValue(
										attributes[ `${ prefix }MaxSize` ],
										attributes.responsiveEnabled?.[ `${ prefix }MaxSize` ]
											? currentDevice
											: 'global',
										valueStr
									),
								} );
							} }
							min={ 16 }
							max={ 128 }
							step={ 1 }
							units={ [ 'px', 'rem', 'em' ] }
							responsive={ false }
							canBeResponsive={ false }
						/>
					</BaseControl>
				</div>
			) }

			{ /* Offset X (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<BaseControl
					label={
						<Flex justify="space-between" style={ { width: '100%' } }>
							<span>Offset X</span>
							<UtilityBar
								canBeResponsive={ true }
								isResponsiveEnabled={
									attributes.responsiveEnabled?.[ `${ prefix }OffsetX` ] || false
								}
								currentDevice={ currentDevice }
								onResponsiveToggle={ () =>
									onResponsiveToggle( `${ prefix }OffsetX`, true )
								}
								onReset={ () => {
									onChange(
										getResponsiveResetUpdate( `${ prefix }OffsetX`, '0px' )
									);
								} }
								resetDisabled={
									! attributes[ `${ prefix }OffsetX` ] &&
									currentDevice === 'global'
								}
							/>
						</Flex>
					}
					__nextHasNoMarginBottom
				>
					<SliderWithInput
						value={ parseValueWithUnit(
							getResponsiveValue(
								attributes[ `${ prefix }OffsetX` ],
								currentDevice
							) || getControlDefault( blockType, `${ prefix }OffsetX`, '0px' )
						) }
						onChange={ ( val ) => {
							const valueStr =
								typeof val === 'object' && val.value !== undefined
									? `${ val.value }${ val.unit || 'px' }`
									: `${ val }px`;
							onChange( {
								[ `${ prefix }OffsetX` ]: setResponsiveValue(
									attributes[ `${ prefix }OffsetX` ],
									attributes.responsiveEnabled?.[ `${ prefix }OffsetX` ]
										? currentDevice
										: 'global',
									valueStr
								),
							} );
						} }
						min={ -50 }
						max={ 50 }
						step={ 1 }
						units={ [ 'px', 'rem', 'em' ] }
						responsive={ false }
						canBeResponsive={ false }
					/>
				</BaseControl>
			</div>

			{ /* Offset Y (responsive) */ }
			<div style={ { marginTop: '16px' } }>
				<BaseControl
					label={
						<Flex justify="space-between" style={ { width: '100%' } }>
							<span>Offset Y</span>
							<UtilityBar
								canBeResponsive={ true }
								isResponsiveEnabled={
									attributes.responsiveEnabled?.[ `${ prefix }OffsetY` ] || false
								}
								currentDevice={ currentDevice }
								onResponsiveToggle={ () =>
									onResponsiveToggle( `${ prefix }OffsetY`, true )
								}
								onReset={ () => {
									onChange(
										getResponsiveResetUpdate( `${ prefix }OffsetY`, '0px' )
									);
								} }
								resetDisabled={
									! attributes[ `${ prefix }OffsetY` ] &&
									currentDevice === 'global'
								}
							/>
						</Flex>
					}
					__nextHasNoMarginBottom
				>
					<SliderWithInput
						value={ parseValueWithUnit(
							getResponsiveValue(
								attributes[ `${ prefix }OffsetY` ],
								currentDevice
							) || getControlDefault( blockType, `${ prefix }OffsetY`, '0px' )
						) }
						onChange={ ( val ) => {
							const valueStr =
								typeof val === 'object' && val.value !== undefined
									? `${ val.value }${ val.unit || 'px' }`
									: `${ val }px`;
							onChange( {
								[ `${ prefix }OffsetY` ]: setResponsiveValue(
									attributes[ `${ prefix }OffsetY` ],
									attributes.responsiveEnabled?.[ `${ prefix }OffsetY` ]
										? currentDevice
										: 'global',
									valueStr
								),
							} );
						} }
						min={ -50 }
						max={ 50 }
						step={ 1 }
						units={ [ 'px', 'rem', 'em' ] }
						responsive={ false }
						canBeResponsive={ false }
					/>
				</BaseControl>
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
