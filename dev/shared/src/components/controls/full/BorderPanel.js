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
 * Props:
 * - lockLinked: When true, always show linked mode and hide the LinkToggle button
 * - colorValue: Can be string OR object { top, right, bottom, left, linked }
 * - styleValue: Can be string OR object { top, right, bottom, left, linked }
 *
 * @package
 */

import {
	BaseControl,
	Flex,
	FlexItem,
	FlexBlock,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { StyleIconButton } from '../atoms/StyleIconButton';
import { SideIcon } from '../atoms/SideIcon';
import { MiniSlider } from '../atoms/MiniSlider';
import { UtilityBar } from '../UtilityBar';
import { getAvailableUnits, getUnitConfig } from '../../../config/css-property-scales.mjs';
import { useResponsiveDevice } from '../../../hooks/useResponsiveDevice';
import { inferBoxUnit } from '../../../utils/box-value-utils';

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
 * Units derived from css-property-scales centralizer for 'border-width'
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses a COMPOUND BOX pattern (manages 3 separate attributes).
 * It's unique because it controls THREE attributes at once: width, color, style.
 *
 * VALUE PROP (border width):
 * --------------------------
 * value prop structure (same as SpacingControl BOX pattern):
 *   {
 *     top: 1,
 *     right: 1,
 *     bottom: 1,
 *     left: 1,
 *     unit: "px",
 *     linked: true
 *   }
 *
 * onChange callback signature:
 *   onChange(newWidthValue)
 *   - Always calls with full box object
 *
 * COLOR VALUE PROP:
 * -----------------
 * colorValue can be:
 *   STRING (all sides same): "#dddddd"
 *   OR
 *   OBJECT (per-side):
 *   {
 *     top: "#dddddd",
 *     right: "#cccccc",
 *     bottom: "#dddddd",
 *     left: "#cccccc",
 *     linked: false
 *   }
 *
 * onColorChange callback signature:
 *   onColorChange(newColorValue)
 *   - Can return string (if all sides same) or object (if different per side)
 *
 * STYLE VALUE PROP:
 * -----------------
 * styleValue can be:
 *   STRING (all sides same): "solid"
 *   OR
 *   OBJECT (per-side):
 *   {
 *     top: "solid",
 *     right: "dashed",
 *     bottom: "solid",
 *     left: "dashed",
 *     linked: false
 *   }
 *
 * onStyleChange callback signature:
 *   onStyleChange(newStyleValue)
 *   - Can return string (if all sides same) or object (if different per side)
 *
 * RESPONSIVE MODE:
 * ----------------
 * BorderPanel itself does NOT handle responsive mode internally.
 * The parent (ControlRenderer) manages device switching and passes
 * the appropriate device-specific values.
 *
 * SCHEMA USAGE:
 * -------------
 * In schemas, BorderPanel requires 3 attributes with same controlId:
 *
 * "borderWidth": { "control": "BorderPanel", "controlId": "border" },
 * "borderColor": { "control": "BorderPanel", "controlId": "border", "renderControl": false },
 * "borderStyle": { "control": "BorderPanel", "controlId": "border", "renderControl": false }
 *
 * ControlRenderer finds related attributes by matching controlId.
 *
 * ============================================================================
 *
 * @param {Object}        props
 * @param {string}        props.label         - Control label
 * @param {Object}        props.value         - Value object (width structure) - see DATA STRUCTURE above
 * @param {Function}      props.onChange      - Change handler for width attribute - see DATA STRUCTURE above
 * @param {string|Object} props.colorValue    - Current border color - see DATA STRUCTURE above
 * @param {Function}      props.onColorChange - Handler for color attribute changes - see DATA STRUCTURE above
 * @param {string|Object} props.styleValue    - Current border style - see DATA STRUCTURE above
 * @param {Function}      props.onStyleChange - Handler for style attribute changes - see DATA STRUCTURE above
 * @param {number}        props.min           - Minimum value
 * @param {number}        props.max           - Maximum value
 * @param {number}        props.step          - Slider step
 * @param {boolean}       props.responsive    - Whether to show device switcher
 * @param {boolean}       props.disabled      - Disabled state
 * @param {boolean}       props.lockLinked    - When true, always show linked mode and hide LinkToggle
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
	lockLinked = false,
} ) {
	// Get units from centralizer for border-width property
	const borderWidthUnits = getAvailableUnits( 'border-width' ) || [ 'px', 'rem', 'em' ];
	const device = useResponsiveDevice();

	// Get current device value for responsive, or direct value
	const currentValue = responsive ? value?.[ device ] ?? value?.value ?? DEFAULT_VALUE : value;

	// Destructure with defaults
	const {
		top = 1,
		right = 1,
		bottom = 1,
		left = 1,
		unit = 'px',
		linked: widthLinked = true,
	} = currentValue;

	const effectiveUnit = inferBoxUnit( currentValue, unit ) || unit || 'px';

	// If lockLinked is true, force linked mode
	const linked = lockLinked ? true : widthLinked;

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

	// Helper to update width value only
	const updateValue = ( updates ) => {
		const mergedValue = { ...currentValue, ...updates };
		const newValue = normalizeUnitValue( mergedValue, effectiveUnit );
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

	// Helper to get color for a specific side from colorValue (string or object)
	const getSideColor = ( side ) => {
		if ( typeof colorValue === 'string' ) {
			return colorValue;
		}
		if ( colorValue && typeof colorValue === 'object' ) {
			return colorValue[ side ] ?? colorValue.top ?? '#dddddd';
		}
		return '#dddddd';
	};

	// Helper to get style for a specific side from styleValue (string or object)
	const getSideStyle = ( side ) => {
		if ( typeof styleValue === 'string' ) {
			return styleValue;
		}
		if ( styleValue && typeof styleValue === 'object' ) {
			return styleValue[ side ] ?? styleValue.top ?? 'solid';
		}
		return 'solid';
	};

	// Handle color change - supports per-side when unlinked
	const handleColorChange = ( side, newColor ) => {
		if ( ! onColorChange ) {
			return;
		}

		// If lockLinked or in linked mode, set all sides same
		if ( lockLinked || linked ) {
			onColorChange( {
				top: newColor,
				right: newColor,
				bottom: newColor,
				left: newColor,
				linked: true,
			} );
		} else {
			// Unlinked mode - update specific side
			const current =
				typeof colorValue === 'object'
					? colorValue
					: {
							top: colorValue,
							right: colorValue,
							bottom: colorValue,
							left: colorValue,
					  };
			onColorChange( { ...current, [ side ]: newColor, linked: false } );
		}
	};

	// Handle style change - supports per-side when unlinked
	const handleStyleChange = ( side, newStyle ) => {
		if ( ! onStyleChange ) {
			return;
		}

		// If lockLinked or in linked mode, set all sides same
		if ( lockLinked || linked ) {
			onStyleChange( {
				top: newStyle,
				right: newStyle,
				bottom: newStyle,
				left: newStyle,
				linked: true,
			} );
		} else {
			// Unlinked mode - update specific side
			const current =
				typeof styleValue === 'object'
					? styleValue
					: {
							top: styleValue,
							right: styleValue,
							bottom: styleValue,
							left: styleValue,
					  };
			onStyleChange( { ...current, [ side ]: newStyle, linked: false } );
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
				<div
					style={ {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					} }
				>
					<span>{ label }</span>
					<UtilityBar
						isResponsive={ responsive }
						currentDevice={ device }
						isDecomposable={ ! lockLinked }
						isLinked={ linked }
						onLinkChange={ handleLinkChange }
						onReset={ handleReset }
						disabled={ disabled }
					/>
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
					{ /* Color Swatch - in linked mode, uses top side color or string value */ }
					<FlexItem className="gutplus-border-panel__color-swatch">
						<ColorSwatch
							value={ getSideColor( 'top' ) }
							onChange={ ( newColor ) => handleColorChange( 'top', newColor ) }
							disabled={ disabled }
						/>
					</FlexItem>

					{ /* Style Icon Button - in linked mode, uses top side style or string value */ }
					<FlexItem className="gutplus-border-panel__style-icon">
						<StyleIconButton
							value={ getSideStyle( 'top' ) }
							onChange={ ( newStyle ) => handleStyleChange( 'top', newStyle ) }
							disabled={ disabled }
						/>
					</FlexItem>

					{ /* Combined value + unit input */ }
					<FlexItem className="gutplus-border-panel__value-unit">
						<UnitControl
							value={ `${ top }${ effectiveUnit }` }
							onChange={ ( newValue ) => {
								const numericValue = parseFloat( newValue ) || 0;
								const newUnit =
									newValue?.replace( /[0-9.-]/g, '' ) || effectiveUnit;
								handleValueChange( 'top', numericValue );
								if ( newUnit !== effectiveUnit ) {
									handleUnitChange( newUnit );
								}
							} }
							units={ borderWidthUnits.map( ( u ) => ( { value: u, label: u } ) ) }
							min={ min }
							max={ max }
							step={ getUnitConfig( 'border-width', effectiveUnit )?.step ?? step }
							disabled={ disabled }
						/>
					</FlexItem>

					{ /* Slider */ }
					<FlexBlock className="gutplus-border-panel__slider">
						<MiniSlider
							value={ top }
							onChange={ ( newVal ) => handleValueChange( 'top', newVal ) }
							min={ min }
							max={ max }
							step={ getUnitConfig( 'border-width', effectiveUnit )?.step ?? step }
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

							{ /* Color Swatch - per-side color in unlinked mode */ }
							<FlexItem className="gutplus-border-panel__color-swatch">
								<ColorSwatch
									value={ getSideColor( side ) }
									onChange={ ( newColor ) => handleColorChange( side, newColor ) }
									disabled={ disabled }
								/>
							</FlexItem>

							{ /* Style Icon Button - per-side style in unlinked mode */ }
							<FlexItem className="gutplus-border-panel__style-icon">
								<StyleIconButton
									value={ getSideStyle( side ) }
									onChange={ ( newStyle ) => handleStyleChange( side, newStyle ) }
									disabled={ disabled }
								/>
							</FlexItem>

							{ /* Combined value + unit input */ }
							<FlexItem className="gutplus-border-panel__value-unit">
								<UnitControl
									value={ `${ getSideValue( side ) }${ effectiveUnit }` }
									onChange={ ( newValue ) => {
										const numericValue = parseFloat( newValue ) || 0;
										const newUnit =
											newValue?.replace( /[0-9.-]/g, '' ) || effectiveUnit;
										handleValueChange( side, numericValue );
										if ( newUnit !== effectiveUnit ) {
											handleUnitChange( newUnit );
										}
									} }
									units={ borderWidthUnits.map( ( u ) => ( {
										value: u,
										label: u,
									} ) ) }
									min={ min }
									max={ max }
									step={
										getUnitConfig( 'border-width', effectiveUnit )?.step ?? step
									}
									disabled={ disabled }
									__next40pxDefaultSize
								/>
							</FlexItem>

							{ /* Slider */ }
							<FlexBlock className="gutplus-border-panel__slider">
								<MiniSlider
									value={ getSideValue( side ) }
									onChange={ ( newVal ) => handleValueChange( side, newVal ) }
									min={ min }
									max={ max }
									step={
										getUnitConfig( 'border-width', effectiveUnit )?.step ?? step
									}
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
