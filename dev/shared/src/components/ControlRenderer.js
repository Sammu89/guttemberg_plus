/**
 * Control Renderer Component
 *
 * Universal control renderer that maps schema control types to actual React components.
 * Handles conditional visibility (showWhen) and disabled states (disabledWhen).
 * This is the central component for rendering any schema-defined control.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import {
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

// Import all Phase 2-4 controls
import {
	ColorControl,
	GradientControl,
	SliderWithInput,
	BoxControl,
	BorderStyleControl,
	ShadowControl,
	AlignmentControl,
	AppearanceControl,
	DecorationControl,
	LetterCaseControl,
	FontFamilyControl,
	IconPositionControl,
	// Lego Full Controls
	BorderPanel,
	BorderWidthControl,
	BorderRadiusControl,
	SpacingControl,
	HeadingLevelControl,
} from './controls';

import { CompactColorControl } from './CompactColorControl';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { normalizeValueForControl } from '../theme-system/control-normalizer';

/**
 * Normalize SelectControl options to consistent format
 * Handles both simple string arrays and object arrays
 *
 * @param {Array} options - Options from config (can be strings or objects)
 * @returns {Array} Normalized options array with { label, value } objects
 */
function normalizeOptions( options ) {
	if ( ! Array.isArray( options ) ) {
		return [];
	}

	return options.map( ( opt ) => {
		if ( typeof opt === 'string' ) {
			// Simple string: use capitalized version as label
			return {
				label: opt.charAt( 0 ).toUpperCase() + opt.slice( 1 ),
				value: opt,
			};
		}
		// Already an object with label/value
		return opt;
	} );
}

/**
 * Convert string values to numbers for numeric controls
 * Handles values like "18px", "1.6", etc.
 *
 * @param {*} value - Value to convert
 * @returns {number|null} Numeric value or null
 */
function toNumericValue( value ) {
	if ( value === null || value === undefined ) {
		return null;
	}

	if ( typeof value === 'number' ) {
		return value;
	}

	if ( typeof value === 'string' ) {
		const match = value.match( /^(-?\d+(?:\.\d+)?)/ );
		return match ? parseFloat( match[ 1 ] ) : null;
	}

	return null;
}

/**
 * Check if a control should be visible based on showWhen conditions
 *
 * @param {Object} showWhen   - Condition object from schema
 * @param {Object} attributes - Current block attributes
 * @returns {boolean} Whether the control should be shown
 */
function checkShowWhen( showWhen, attributes ) {
	if ( ! showWhen ) {
		return true;
	}

	// All conditions must be met (AND logic)
	for ( const [ dependencyAttr, allowedValues ] of Object.entries( showWhen ) ) {
		const currentValue = attributes[ dependencyAttr ];

		if ( Array.isArray( allowedValues ) ) {
			if ( ! allowedValues.includes( currentValue ) ) {
				return false;
			}
		} else if ( currentValue !== allowedValues ) {
			return false;
		}
	}

	return true;
}

/**
 * Check if a control should be disabled based on disabledWhen conditions
 *
 * @param {Object} disabledWhen - Condition object from schema
 * @param {Object} attributes   - Current block attributes
 * @returns {boolean} Whether the control should be disabled
 */
function checkDisabledWhen( disabledWhen, attributes ) {
	if ( ! disabledWhen ) {
		return false;
	}

	// Any condition match disables the control (OR logic)
	for ( const [ dependencyAttr, disablingValues ] of Object.entries( disabledWhen ) ) {
		const currentValue = attributes[ dependencyAttr ];

		if ( Array.isArray( disablingValues ) ) {
			if ( disablingValues.includes( currentValue ) ) {
				return true;
			}
		} else if ( currentValue === disablingValues ) {
			return true;
		}
	}

	return false;
}

/**
 * Control Renderer Component
 *
 * Renders the appropriate control component based on schema configuration.
 *
 * @param {Object}   props                Component props
 * @param {string}   props.attrName       Attribute name
 * @param {Object}   props.attrConfig     Attribute configuration from schema
 * @param {Object}   props.attributes     Block attributes
 * @param {Function} props.setAttributes  Function to update block attributes
 * @param {Object}   props.effectiveValues All effective values from cascade resolution
 * @param {Object}   props.schema         Full schema object
 * @param {Object}   props.theme          Current theme object (optional)
 * @param {Object}   props.cssDefaults    CSS default values (optional)
 * @returns {JSX.Element|null} Rendered control or null
 */
export function ControlRenderer( {
	attrName,
	attrConfig,
	attributes,
	setAttributes,
	effectiveValues,
	schema,
	theme,
	cssDefaults = {},
} ) {
	const {
		control,
		label,
		description,
		options,
		min,
		max,
		step,
		default: defaultValue,
		disabledWhen,
		showWhen,
		units,
		unit,
		responsive = false,
	} = attrConfig;

	const effectiveValue = effectiveValues?.[ attrName ];
	const finalLabel = label || attrName;
	const helpText = description || '';

	// Check if control should be hidden based on showWhen conditions
	if ( ! checkShowWhen( showWhen, attributes ) ) {
		return null;
	}

	// Check if control should be disabled based on disabledWhen conditions
	const isDisabled = checkDisabledWhen( disabledWhen, attributes );

	// Handle attribute change
	const handleChange = ( value ) => {
		setAttributes( { [ attrName ]: value } );
	};

	// Handle responsive attribute change
	// Desktop edits update the base (flat), tablet/mobile add device overrides
	const handleResponsiveChange = ( device, value ) => {
		const currentValue = attributes[ attrName ];

		// Check if current value is flat (scalar or {value, unit} without device keys)
		const isFlat = ( val ) => {
			if ( val === null || val === undefined ) {
				return true;
			}
			if ( typeof val !== 'object' ) {
				return true; // Scalar
			}
			// Object with value/unit but no device keys
			const hasDeviceKeys = 'desktop' in val || 'tablet' in val || 'mobile' in val;
			return ! hasDeviceKeys;
		};

		// Extract base value (excluding device keys)
		const getBase = ( val ) => {
			if ( isFlat( val ) ) {
				return val;
			}
			if ( typeof val === 'object' && val !== null ) {
				const { tablet, mobile, ...base } = val;
				return Object.keys( base ).length > 0 ? base : null;
			}
			return null;
		};

		if ( device === 'desktop' ) {
			// Desktop edits update the base (flat structure)
			// Preserve any existing tablet/mobile overrides
			if ( isFlat( currentValue ) ) {
				// Value was flat, stays flat with new value
				setAttributes( { [ attrName ]: value } );
			} else {
				// Value has device keys, update base while preserving overrides
				const existingOverrides = {};
				if ( currentValue?.tablet ) existingOverrides.tablet = currentValue.tablet;
				if ( currentValue?.mobile ) existingOverrides.mobile = currentValue.mobile;

				// For scalar values, just use the new value; for objects, spread
				const newValue = typeof value === 'object' && value !== null
					? { ...value, ...existingOverrides }
					: { ...( typeof value === 'object' ? value : { value } ), ...existingOverrides };

				setAttributes( { [ attrName ]: Object.keys( existingOverrides ).length > 0 ? newValue : value } );
			}
		} else {
			// Tablet/Mobile create device-specific overrides
			const baseValue = getBase( currentValue );
			const existingOverrides = {};
			if ( currentValue?.tablet && device !== 'tablet' ) existingOverrides.tablet = currentValue.tablet;
			if ( currentValue?.mobile && device !== 'mobile' ) existingOverrides.mobile = currentValue.mobile;

			// Build new value structure: base + existing overrides + new device override
			let newAttrValue;
			if ( baseValue === null || baseValue === undefined ) {
				// No base value, just create device override
				newAttrValue = { ...existingOverrides, [ device ]: value };
			} else if ( typeof baseValue === 'object' ) {
				// Base is object (e.g., { value, unit })
				newAttrValue = { ...baseValue, ...existingOverrides, [ device ]: value };
			} else {
				// Base is scalar, wrap in object structure
				newAttrValue = { value: baseValue, ...existingOverrides, [ device ]: value };
			}

			setAttributes( { [ attrName ]: newAttrValue } );
		}
	};

	/**
	 * Check if attribute is customized AND themeable
	 * Red dot only shows for themeable attributes
	 */
	const isAttrCustomized = () => {
		const attrDef = schema?.attributes?.[ attrName ];
		if ( ! attrDef || attrDef.themeable === false ) {
			return false;
		}
		return isCustomizedFromDefaults( attrName, attributes, theme, cssDefaults );
	};

	/**
	 * Render label with customization indicator
	 */
	const renderLabel = ( labelText ) => (
		<span style={ { display: 'flex', alignItems: 'center', gap: '6px' } }>
			{ labelText }
			{ isAttrCustomized() && (
				<span
					className="customization-indicator"
					title="This property has been customized"
					style={ {
						display: 'inline-block',
						width: '6px',
						height: '6px',
						borderRadius: '50%',
						backgroundColor: '#dc3232',
						flexShrink: 0,
					} }
				/>
			) }
		</span>
	);

	// Skip attributes without a defined control
	if ( ! control ) {
		return null;
	}

	// Skip attributes that explicitly set renderControl: false
	if ( attrConfig.renderControl === false ) {
		return null;
	}

	// Switch statement mapping control types to components
	switch ( control ) {
		// ==================== Color Controls ====================

		case 'ColorPicker':
		case 'ColorControl': {
			const normalizedValue = normalizeValueForControl(
				effectiveValue,
				attrName,
				'color'
			);

			return (
				<div key={ attrName }>
					<CompactColorControl
						label={ renderLabel( finalLabel ) }
						value={ normalizedValue }
						onChange={ handleChange }
						disableAlpha={ false }
					/>
					{ helpText && (
						<p style={ { fontSize: '12px', color: '#757575', marginTop: '4px', marginBottom: '16px' } }>
							{ helpText }
						</p>
					) }
				</div>
			);
		}

		case 'GradientControl': {
			return (
				<GradientControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? '' }
					onChange={ handleChange }
					defaultValue={ defaultValue }
					help={ helpText }
				/>
			);
		}

		// ==================== Numeric Controls ====================

		case 'RangeControl': {
			const numericValue = toNumericValue( effectiveValue );
			const defaultNumericValue = toNumericValue( defaultValue );

			return (
				<RangeControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ numericValue ?? defaultNumericValue ?? 0 }
					onChange={ handleChange }
					min={ min ?? 0 }
					max={ max ?? 100 }
					step={ step ?? 1 }
					help={ helpText }
					disabled={ isDisabled }
				/>
			);
		}

		case 'SliderWithInput': {
			if ( responsive ) {
				return (
					<SliderWithInput
						key={ attrName }
						label={ renderLabel( finalLabel ) }
						values={ effectiveValue || {} }
						onChange={ handleResponsiveChange }
						responsive={ true }
						units={ units }
						min={ min ?? 0 }
						max={ max ?? 100 }
						step={ step ?? 1 }
						help={ helpText }
						defaultValue={ defaultValue }
					/>
				);
			}

			return (
				<SliderWithInput
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue }
					onChange={ handleChange }
					responsive={ false }
					units={ units }
					min={ min ?? 0 }
					max={ max ?? 100 }
					step={ step ?? 1 }
					help={ helpText }
					defaultValue={ defaultValue }
				/>
			);
		}

		// ==================== Selection Controls ====================

		case 'SelectControl': {
			const normalizedOptions = normalizeOptions( options );
			const defaultSelectValue = defaultValue ?? normalizedOptions[ 0 ]?.value ?? '';

			return (
				<SelectControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultSelectValue }
					options={ normalizedOptions }
					onChange={ handleChange }
					help={ helpText }
					disabled={ isDisabled }
					__next40pxDefaultSize
				/>
			);
		}

		case 'ToggleControl': {
			return (
				<ToggleControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					checked={ effectiveValue ?? defaultValue ?? false }
					onChange={ handleChange }
					help={ helpText }
					__nextHasNoMarginBottom
					disabled={ isDisabled }
				/>
			);
		}

		// ==================== Text Controls ====================

		case 'TextControl': {
			return (
				<TextControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? '' }
					onChange={ handleChange }
					help={ helpText }
					disabled={ isDisabled }
					__next40pxDefaultSize
				/>
			);
		}

		case 'IconPicker': {
			const iconHelp = helpText || "Use a character, Unicode code, or image URL. Use 'none' to disable.";
			return (
				<TextControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? '' }
					onChange={ handleChange }
					placeholder="Enter icon char or image URL"
					help={ iconHelp }
					__next40pxDefaultSize
				/>
			);
		}

		case 'UnitControl': {
			const defaultUnits = [
				{ value: 'px', label: 'px', default: true },
				{ value: '%', label: '%' },
				{ value: 'rem', label: 'rem' },
				{ value: 'em', label: 'em' },
			];

			const unitOptions = units
				? units.map( ( u, index ) => ( {
						value: u,
						label: u,
						default: index === 0,
				  } ) )
				: defaultUnits;

			return (
				<div key={ attrName } style={ { marginBottom: '16px' } }>
					<UnitControl
						label={ renderLabel( finalLabel ) }
						value={ effectiveValue ?? defaultValue ?? '' }
						onChange={ handleChange }
						units={ unitOptions }
						disabled={ isDisabled }
						__next40pxDefaultSize
					/>
					{ helpText && (
						<p style={ { fontSize: '12px', color: '#757575', marginTop: '4px' } }>
							{ helpText }
						</p>
					) }
				</div>
			);
		}

		// ==================== Box/Spacing Controls ====================

		case 'BoxControl': {
			return (
				<BoxControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					values={ effectiveValue || {} }
					onChange={ handleResponsiveChange }
					responsive={ responsive }
					units={ units || [ 'px', 'em', 'rem', '%' ] }
					min={ min ?? 0 }
					max={ max ?? 999 }
					step={ step ?? 1 }
					help={ helpText }
				/>
			);
		}

		case 'BorderRadiusControl': {
			const currentRadius = effectiveValue || defaultValue || {
				topLeft: 0,
				topRight: 0,
				bottomRight: 0,
				bottomLeft: 0,
			};

			const handleCornerChange = ( corner, value ) => {
				const updatedRadius = {
					...currentRadius,
					[ corner ]: value,
				};
				handleChange( updatedRadius );
			};

			const radiusUnit = unit || 'px';

			return (
				<div key={ attrName } style={ { marginBottom: '16px' } }>
					<h4 style={ { margin: '0 0 8px 0', fontSize: '13px' } }>
						{ renderLabel( finalLabel ) }
					</h4>
					{ helpText && (
						<p style={ { fontSize: '12px', color: '#757575', marginTop: '4px', marginBottom: '12px' } }>
							{ helpText }
						</p>
					) }
					<RangeControl
						label={ `Top Left (${ radiusUnit })` }
						value={ currentRadius.topLeft ?? 0 }
						onChange={ ( value ) => handleCornerChange( 'topLeft', value ) }
						min={ min ?? 0 }
						max={ max ?? 60 }
						step={ step ?? 1 }
					/>
					<RangeControl
						label={ `Top Right (${ radiusUnit })` }
						value={ currentRadius.topRight ?? 0 }
						onChange={ ( value ) => handleCornerChange( 'topRight', value ) }
						min={ min ?? 0 }
						max={ max ?? 60 }
						step={ step ?? 1 }
					/>
					<RangeControl
						label={ `Bottom Right (${ radiusUnit })` }
						value={ currentRadius.bottomRight ?? 0 }
						onChange={ ( value ) => handleCornerChange( 'bottomRight', value ) }
						min={ min ?? 0 }
						max={ max ?? 60 }
						step={ step ?? 1 }
					/>
					<RangeControl
						label={ `Bottom Left (${ radiusUnit })` }
						value={ currentRadius.bottomLeft ?? 0 }
						onChange={ ( value ) => handleCornerChange( 'bottomLeft', value ) }
						min={ min ?? 0 }
						max={ max ?? 60 }
						step={ step ?? 1 }
					/>
				</div>
			);
		}

		// ==================== Border/Shadow Controls ====================

		case 'BorderStyleControl': {
			return (
				<BorderStyleControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? 'none' }
					onChange={ handleChange }
				/>
			);
		}

		case 'BorderPanel': {
			// BorderPanel hardcodes looking for border-width, border-color, border-style
			// Find attributes by their cssProperty
			const allAttrs = Object.entries( schema?.attributes || {} );
			const widthAttr = allAttrs.find( ( [ , attr ] ) => attr.cssProperty === 'border-width' );
			const colorAttr = allAttrs.find( ( [ , attr ] ) => attr.cssProperty === 'border-color' );
			const styleAttr = allAttrs.find( ( [ , attr ] ) => attr.cssProperty === 'border-style' );

			const widthAttrName = widthAttr ? widthAttr[ 0 ] : null;
			const colorAttrName = colorAttr ? colorAttr[ 0 ] : null;
			const styleAttrName = styleAttr ? styleAttr[ 0 ] : null;

			// Get attribute config for width to extract units, min, max
			const widthAttrConfig = widthAttr ? widthAttr[ 1 ] : {};

			const widthValue = widthAttrName ? effectiveValues?.[ widthAttrName ] : null;
			const colorValue = colorAttrName ? effectiveValues?.[ colorAttrName ] : '#dddddd';
			const styleValue = styleAttrName ? effectiveValues?.[ styleAttrName ] : 'solid';

			// Check if this is a single-side border (divider)
			// Single-side borders have cssProperty like border-top-*, border-right-*, etc.
			const isSingleSideBorder =
				attrConfig.cssProperty?.startsWith( 'border-top-' ) ||
				attrConfig.cssProperty?.startsWith( 'border-right-' ) ||
				attrConfig.cssProperty?.startsWith( 'border-bottom-' ) ||
				attrConfig.cssProperty?.startsWith( 'border-left-' );

			return (
				<BorderPanel
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ widthValue ?? widthAttrConfig.default ?? {
						top: 1,
						right: 1,
						bottom: 1,
						left: 1,
						unit: 'px',
						linked: true,
					} }
					onChange={ widthAttrName ? ( val ) => setAttributes( { [ widthAttrName ]: val } ) : undefined }
					colorValue={ colorValue }
					onColorChange={ colorAttrName ? ( color ) => setAttributes( { [ colorAttrName ]: color } ) : undefined }
					styleValue={ styleValue }
					onStyleChange={ styleAttrName ? ( style ) => setAttributes( { [ styleAttrName ]: style } ) : undefined }
					min={ widthAttrConfig.min ?? 0 }
					max={ widthAttrConfig.max ?? 20 }
					step={ widthAttrConfig.step ?? 1 }
					responsive={ widthAttrConfig.responsive }
					disabled={ isDisabled }
					lockLinked={ isSingleSideBorder }
				/>
			);
		}

		case 'ShadowControl': {
			return (
				<ShadowControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? 'none' }
					onChange={ handleChange }
					defaultValue={ defaultValue }
					help={ helpText }
				/>
			);
		}

		// ==================== Typography Controls ====================

		case 'AlignmentControl': {
			return (
				<AlignmentControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? 'left' }
					onChange={ handleChange }
					type={ attrConfig.alignmentType || 'text' }
				/>
			);
		}

		case 'AppearanceControl': {
			return (
				<AppearanceControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? { weight: 'normal', style: 'normal' } }
					onChange={ handleChange }
					help={ helpText }
				/>
			);
		}

		case 'DecorationControl': {
			return (
				<DecorationControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? 'none' }
					onChange={ handleChange }
				/>
			);
		}

		case 'LetterCaseControl': {
			return (
				<LetterCaseControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? 'none' }
					onChange={ handleChange }
				/>
			);
		}

		case 'FontFamilyControl': {
			return (
				<FontFamilyControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? '' }
					onChange={ handleChange }
					help={ helpText }
				/>
			);
		}

		// ==================== Position/Layout Controls ====================

		case 'IconPositionControl': {
			return (
				<IconPositionControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? 'left' }
					onChange={ handleChange }
				/>
			);
		}

		// ==================== Lego Controls ====================

		case 'CompactBorderWidth': {
			return (
				<BorderWidthControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? {} }
					onChange={ handleChange }
					units={ units || [ 'px' ] }
					min={ min ?? 0 }
					max={ max ?? 20 }
					responsive={ responsive }
					disabled={ isDisabled }
				/>
			);
		}

		case 'CompactBorderRadius': {
			return (
				<BorderRadiusControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? {} }
					onChange={ handleChange }
					units={ units || [ 'px', 'rem', '%' ] }
					min={ min ?? 0 }
					max={ max ?? 100 }
					responsive={ responsive }
					disabled={ isDisabled }
				/>
			);
		}

		case 'CompactSpacing':
		case 'CompactPadding': {
			return (
				<SpacingControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					type="padding"
					value={ effectiveValue ?? defaultValue ?? {} }
					onChange={ handleChange }
					units={ units || [ 'px', 'rem', 'em' ] }
					min={ min ?? 0 }
					max={ max ?? 100 }
					responsive={ responsive }
					disabled={ isDisabled }
				/>
			);
		}

		case 'CompactMargin': {
			return (
				<SpacingControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					type="margin"
					value={ effectiveValue ?? defaultValue ?? {} }
					onChange={ handleChange }
					units={ units || [ 'px', 'rem', 'em' ] }
					min={ min ?? 0 }
					max={ max ?? 100 }
					responsive={ responsive }
					disabled={ isDisabled }
					sides={ [ 'top', 'bottom' ] }
				/>
			);
		}

		case 'HeadingLevel': {
			return (
				<HeadingLevelControl
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? 'none' }
					onChange={ handleChange }
					disabled={ isDisabled }
				/>
			);
		}

		// ==================== Default/Unknown ====================

		default:
			// Unknown control type - log warning and skip
			console.warn(
				`[ControlRenderer] Unknown control type "${ control }" for attribute "${ attrName }"`
			);
			return null;
	}
}

export default ControlRenderer;
