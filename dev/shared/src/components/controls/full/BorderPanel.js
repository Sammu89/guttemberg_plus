/**
 * BorderPanel - Full Control
 *
 * Unified border control component that manages color, style, and width for all sides.
 * Supports both linked (all sides same) and unlinked (individual side) modes.
 *
 * Can work in two modes:
 * 1. Combined mode: Single value object with all properties
 * 2. Separate attributes mode: Three separate attributes (color, style, width) with onChange handler
 *
 * Layout (linked):   [ColorSwatch] [StyleIcon] [Value] [Unit] ────●──── [🔗] [↻Reset]
 * Layout (unlinked): 4 rows (top/right/bottom/left) with SideIcon, ColorSwatch, StyleIcon
 *
 * @package guttemberg-plus
 */

import { useState } from '@wordpress/element';
import { BaseControl, Button, Flex, FlexItem, FlexBlock, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { StyleIconButton } from '../atoms/StyleIconButton';
import { SideIcon } from '../atoms/SideIcon';
import { MiniSlider } from '../atoms/MiniSlider';
import { LinkToggle } from '../atoms/LinkToggle';
import { DeviceSwitcher } from '../atoms/DeviceSwitcher';

const SIDES = [ 'top', 'right', 'bottom', 'left' ];

// Default values for reset
const DEFAULT_VALUE = {
	top: 1,
	right: 1,
	bottom: 1,
	left: 1,
	unit: 'px',
	linked: true,
};

/**
 * BorderPanel Component
 *
 * Hardcoded units: px, em, rem
 *
 * @param {Object}   props
 * @param {string}   props.label               - Control label
 * @param {Object}   props.value               - Value object (width structure)
 * @param {Function} props.onChange            - Change handler for width attribute
 * @param {string}   props.colorValue          - Current border color (separate attribute)
 * @param {Function} props.onColorChange       - Handler for color attribute changes
 * @param {string}   props.styleValue          - Current border style (separate attribute)
 * @param {Function} props.onStyleChange       - Handler for style attribute changes
 * @param {number}   props.min                 - Minimum value
 * @param {number}   props.max                 - Maximum value
 * @param {number}   props.step                - Slider step
 * @param {boolean}  props.responsive          - Whether to show device switcher
 * @param {boolean}  props.disabled            - Disabled state
 */
export function BorderPanel( {
	label = 'Border',
	value = DEFAULT_VALUE,
	onChange,
	colorValue = '#dddddd',
	onColorChange,
	styleValue = 'solid',
	onStyleChange,
	min = 0,
	max = 20,
	step = 1,
	responsive = false,
	disabled = false,
} ) {
	// BorderPanel hardcodes its allowed units
	const units = [ 'px', 'em', 'rem' ];
	const [ device, setDevice ] = useState( 'desktop' );

	// Get current device value for responsive, or direct value
	const currentValue = responsive
		? ( value[ device ] || value.desktop || DEFAULT_VALUE )
		: value;

	// Destructure with defaults
	const {
		top = 1,
		right = 1,
		bottom = 1,
		left = 1,
		unit = 'px',
		linked = true,
	} = currentValue;

	// Helper to update width value only
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
			// Linked mode: all sides get same value
			updateValue( { top: newVal, right: newVal, bottom: newVal, left: newVal } );
		} else {
			// Unlinked mode: update specific side
			const sideValue = currentValue[ side ] || {};
			updateValue( {
				[ side ]: { ...sideValue, value: newVal },
			} );
		}
	};

	// Handle color change - updates separate borderColor attribute
	const handleColorChange = ( newColor ) => {
		if ( onColorChange ) {
			onColorChange( newColor );
		}
	};

	// Handle style change - updates separate borderStyle attribute
	const handleStyleChange = ( newStyle ) => {
		if ( onStyleChange ) {
			onStyleChange( newStyle );
		}
	};

	// Handle unit change (always shared by all sides)
	const handleUnitChange = ( newUnit ) => {
		updateValue( { unit: newUnit } );
	};

	// Handle link toggle
	const handleLinkChange = ( newLinked ) => {
		if ( newLinked ) {
			// When linking: convert unlinked to linked structure
			// Use top side values for all sides
			const topSide = currentValue.top || {};
			const topValue = typeof topSide === 'object' ? topSide.value : topSide;

			updateValue( {
				linked: true,
				top: topValue,
				right: topValue,
				bottom: topValue,
				left: topValue,
			} );
		} else {
			// When unlinking: convert linked to unlinked structure
			updateValue( {
				linked: false,
				top: { value: top },
				right: { value: right },
				bottom: { value: bottom },
				left: { value: left },
			} );
		}
	};

	// Reset to default values
	const handleReset = () => {
		if ( responsive ) {
			onChange( {
				...value,
				[ device ]: DEFAULT_VALUE,
			} );
		} else {
			onChange( DEFAULT_VALUE );
		}
		// Also reset color and style to defaults
		if ( onColorChange ) {
			onColorChange( '#dddddd' );
		}
		if ( onStyleChange ) {
			onStyleChange( 'solid' );
		}
	};

	// Get value for a specific side in unlinked mode
	const getSideValue = ( side ) => {
		const sideData = currentValue[ side ];
		if ( typeof sideData === 'object' ) {
			return sideData.value || 0;
		}
		return sideData || 0;
	};

	return (
		<BaseControl
			label={
				<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' } }>
					<span>{ label }</span>
					<div style={ { display: 'flex', gap: '8px', alignItems: 'center' } }>
						{ responsive && (
							<DeviceSwitcher
								value={ device }
								onChange={ setDevice }
								disabled={ disabled }
							/>
						) }
						<LinkToggle
							linked={ linked }
							onChange={ handleLinkChange }
							disabled={ disabled }
						/>
						<Button
							variant="tertiary"
							size="small"
							onClick={ handleReset }
							disabled={ disabled }
							title="Reset to default values"
						>
							↻
						</Button>
					</div>
				</div>
			}
			className="gutplus-border-panel"
			__nextHasNoMarginBottom
		>
			{ linked ? (
				// Single row when linked
				<Flex
					className="gutplus-border-panel__linked-row"
					gap={ 2 }
					align="center"
					wrap={ false }
				>
					{ /* Color Swatch */ }
					<FlexItem className="gutplus-border-panel__color-swatch">
						<ColorSwatch
							value={ colorValue }
							onChange={ handleColorChange }
							disabled={ disabled }
						/>
					</FlexItem>

					{ /* Style Icon Button */ }
					<FlexItem className="gutplus-border-panel__style-icon">
						<StyleIconButton
							value={ styleValue }
							onChange={ handleStyleChange }
							disabled={ disabled }
						/>
					</FlexItem>

					{ /* Combined value + unit input */ }
					<FlexItem className="gutplus-border-panel__value-unit">
						<UnitControl
							value={ `${ top }${ unit }` }
							onChange={ ( newValue ) => {
								const numericValue = parseFloat( newValue ) || 0;
								const newUnit = newValue?.replace( /[0-9.-]/g, '' ) || unit;
								handleValueChange( 'top', numericValue );
								if ( newUnit !== unit ) {
									handleUnitChange( newUnit );
								}
							} }
							units={ units.map( ( u ) => ( { value: u, label: u } ) ) }
							min={ min }
							max={ max }
							step={ step }
							disabled={ disabled }
							size="small"
						/>
					</FlexItem>

					{ /* Slider */ }
					<FlexBlock className="gutplus-border-panel__slider">
						<MiniSlider
							value={ top }
							onChange={ ( newVal ) => handleValueChange( 'top', newVal ) }
							min={ min }
							max={ max }
							step={ step }
							disabled={ disabled }
						/>
					</FlexBlock>
				</Flex>
			) : (
				// Four rows when unlinked
				<div className="gutplus-border-panel__unlinked-rows">
					{ SIDES.map( ( side ) => (
						<Flex
							key={ side }
							className={ `gutplus-border-panel__row gutplus-border-panel__row--${ side }` }
							gap={ 2 }
							align="center"
							wrap={ false }
						>
							{ /* Side Icon */ }
							<FlexItem className="gutplus-border-panel__side-icon">
								<SideIcon side={ side } />
							</FlexItem>

							{ /* Color Swatch */ }
							<FlexItem className="gutplus-border-panel__color-swatch">
								<ColorSwatch
									value={ colorValue }
									onChange={ handleColorChange }
									disabled={ disabled }
								/>
							</FlexItem>

							{ /* Style Icon Button */ }
							<FlexItem className="gutplus-border-panel__style-icon">
								<StyleIconButton
									value={ styleValue }
									onChange={ handleStyleChange }
									disabled={ disabled }
								/>
							</FlexItem>

							{ /* Combined value + unit input */ }
							<FlexItem className="gutplus-border-panel__value-unit">
								<UnitControl
									value={ `${ getSideValue( side ) }${ unit }` }
									onChange={ ( newValue ) => {
										const numericValue = parseFloat( newValue ) || 0;
										const newUnit = newValue?.replace( /[0-9.-]/g, '' ) || unit;
										handleValueChange( side, numericValue );
										if ( newUnit !== unit ) {
											handleUnitChange( newUnit );
										}
									} }
									units={ units.map( ( u ) => ( { value: u, label: u } ) ) }
									min={ min }
									max={ max }
									step={ step }
									disabled={ disabled }
									size="small"
								/>
							</FlexItem>

							{ /* Slider */ }
							<FlexBlock className="gutplus-border-panel__slider">
								<MiniSlider
									value={ getSideValue( side ) }
									onChange={ ( newVal ) => handleValueChange( side, newVal ) }
									min={ min }
									max={ max }
									step={ step }
									disabled={ disabled }
								/>
							</FlexBlock>
						</Flex>
					) ) }
				</div>
			) }
		</BaseControl>
	);
}

export default BorderPanel;
