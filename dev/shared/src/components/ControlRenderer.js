/**
 * Control Renderer Component
 *
 * Universal control renderer that maps schema control types to actual React components.
 * Handles conditional visibility (showWhen) and disabled states (disabledWhen).
 * This is the central component for rendering any schema-defined control.
 *
 * @package
 * @since 1.0.0
 */

import {
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { __experimentalPanelColorGradientSettings as PanelColorSettings } from '@wordpress/block-editor';

// Import all Phase 2-4 controls
import {
	ColorControl,
	ColorGradientControl,
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
	ShadowPanel,
} from './controls';

import { FormattingControl } from './controls/FormattingControl';

import { CompactColorControl } from './CompactColorControl';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { normalizeControlValue } from '../theme-system/control-normalizer';
import { getAvailableUnits, isUnitlessProperty } from '../config/css-property-scales.mjs';

/**
 * Normalize SelectControl options to consistent format
 * Handles both simple string arrays and object arrays
 *
 * @param {Array} options - Options from config (can be strings or objects)
 * @return {Array} Normalized options array with { label, value } objects
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
 * @return {number|null} Numeric value or null
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
 * @return {boolean} Whether the control should be shown
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
 * @return {boolean} Whether the control should be disabled
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
 * Evaluate conditionalRender expression
 * Examples:
 *   "iconInactiveSource.kind !== 'image'"
 *   "iconActiveSource.kind === 'image'"
 *
 * @param {string} expression - JavaScript expression to evaluate
 * @param {Object} values     - Effective attribute values
 * @return {boolean} - Whether control should be shown
 */
function evaluateConditionalRender( expression, values ) {
	try {
		// Create a safe evaluation context
		// Replace attribute references with actual values
		let safeExpression = expression;

		// Find all attribute references (e.g., iconInactiveSource.kind)
		const attrPattern = /(\w+(?:\.\w+)*)/g;
		const matches = expression.match( attrPattern );

		if ( matches ) {
			const evalContext = {};
			matches.forEach( ( match ) => {
				// Get nested value (e.g., iconInactiveSource.kind)
				const parts = match.split( '.' );
				let value = values;
				for ( const part of parts ) {
					value = value?.[ part ];
				}
				evalContext[ match.replace( /\./g, '_' ) ] = value;
				safeExpression = safeExpression.replace(
					new RegExp( match.replace( /\./g, '\\.' ), 'g' ),
					match.replace( /\./g, '_' )
				);
			} );

			// Evaluate with context
			const func = new Function(
				...Object.keys( evalContext ),
				`return ${ safeExpression }`
			);
			return func( ...Object.values( evalContext ) );
		}

		return true; // Default to showing if can't parse
	} catch ( error ) {
		console.warn( 'Failed to evaluate conditionalRender:', expression, error );
		return true; // Default to showing on error
	}
}

/**
 * Control Renderer Component
 *
 * Renders the appropriate control component based on schema configuration.
 *
 * @param {Object}   props                       Component props
 * @param {string}   props.attrName              Attribute name
 * @param {Object}   props.attrConfig            Attribute configuration from schema
 * @param {Object}   props.attributes            Block attributes
 * @param {Function} props.setAttributes         Function to update block attributes
 * @param {Object}   props.effectiveValues       All effective values from cascade resolution
 * @param {Object}   props.schema                Full schema object
 * @param {Object}   props.theme                 Current theme object (optional)
 * @param {Object}   props.cssDefaults           CSS default values (optional)
 * @param {Object}   props.colorGradientSettings Theme colors and gradients from useMultipleOriginColorsAndGradients (optional)
 * @return {JSX.Element|null} Rendered control or null
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
	colorGradientSettings = {},
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
		cssProperty,
	} = attrConfig;

	// Extract blockType from schema for controls that need it (e.g., IconPositionControl)
	const blockType = schema?.blockType;

	const rawValue = effectiveValues?.[ attrName ];
	const effectiveValue = normalizeControlValue( rawValue, attrConfig );
	const finalLabel = label || attrName;
	const helpText = description || '';
	const normalizedDefaultValue = normalizeControlValue( defaultValue, attrConfig );

	// Get responsive enabled state for this attribute
	// Default: responsive mode is disabled for all attributes
	const responsiveEnabledState = attributes.responsiveEnabled || {};
	const isResponsiveEnabled = responsive && responsiveEnabledState[ attrName ] === true;

	// Check if control should be hidden based on showWhen conditions
	if ( ! checkShowWhen( showWhen, attributes ) ) {
		return null;
	}

	// Check conditionalRender (expression-based visibility)
	if ( attrConfig.conditionalRender ) {
		const shouldShow = evaluateConditionalRender(
			attrConfig.conditionalRender,
			effectiveValues
		);
		if ( ! shouldShow ) {
			return null;
		}
	}

	// Check if control should be disabled based on disabledWhen conditions
	const isDisabled = checkDisabledWhen( disabledWhen, attributes );

	// Handle attribute change
	const handleChange = ( value ) => {
		setAttributes( { [ attrName ]: value } );
	};

	// Handle responsive attribute change
	// Global edits update the base (flat), tablet/mobile add device overrides
	const handleResponsiveChange = ( device, value ) => {
		const currentValue = attributes[ attrName ];
		const isClearing = value === undefined || value === null;

		// Check if current value is flat (scalar or {value, unit} without device keys)
		const isFlat = ( val ) => {
			if ( val === null || val === undefined ) {
				return true;
			}
			if ( typeof val !== 'object' ) {
				return true; // Scalar
			}
			// Object with value/unit but no device keys
			const hasDeviceKeys = 'global' in val || 'tablet' in val || 'mobile' in val;
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

		if ( device === 'global' ) {
			// Global edits update the base (flat structure)
			// Preserve any existing tablet/mobile overrides
			if ( isFlat( currentValue ) ) {
				// Value was flat, stays flat with new value
				setAttributes( { [ attrName ]: isClearing ? undefined : value } );
			} else {
				// Value has device keys, update base while preserving overrides
				const existingOverrides = {};
				if ( currentValue?.tablet !== undefined ) {
					existingOverrides.tablet = currentValue.tablet;
				}
				if ( currentValue?.mobile !== undefined ) {
					existingOverrides.mobile = currentValue.mobile;
				}

				if ( isClearing ) {
					const nextValue =
						Object.keys( existingOverrides ).length > 0 ? existingOverrides : undefined;
					setAttributes( { [ attrName ]: nextValue } );
					return;
				}

				// For scalar values, just use the new value; for objects, spread
				const newValue =
					typeof value === 'object' && value !== null
						? { ...value, ...existingOverrides }
						: {
								...( typeof value === 'object' ? value : { value } ),
								...existingOverrides,
						  };

				setAttributes( {
					[ attrName ]: Object.keys( existingOverrides ).length > 0 ? newValue : value,
				} );
			}
		} else {
			// Tablet/Mobile create device-specific overrides
			if ( isClearing ) {
				if ( ! currentValue || typeof currentValue !== 'object' ) {
					return;
				}
				const { tablet, mobile, ...baseValue } = currentValue;
				const nextValue = { ...baseValue };
				if ( device !== 'tablet' && tablet !== undefined ) {
					nextValue.tablet = tablet;
				}
				if ( device !== 'mobile' && mobile !== undefined ) {
					nextValue.mobile = mobile;
				}
				setAttributes( {
					[ attrName ]: Object.keys( nextValue ).length > 0 ? nextValue : undefined,
				} );
				return;
			}

			const baseValue = getBase( currentValue );
			const existingOverrides = {};
			if ( currentValue?.tablet !== undefined && device !== 'tablet' ) {
				existingOverrides.tablet = currentValue.tablet;
			}
			if ( currentValue?.mobile !== undefined && device !== 'mobile' ) {
				existingOverrides.mobile = currentValue.mobile;
			}

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
	 * Handle toggling responsive mode for an attribute
	 * @param {boolean} enabled - New responsive enabled state
	 */
	const handleResponsiveToggle = ( enabled ) => {
		const updates = {
			responsiveEnabled: {
				...responsiveEnabledState,
				[ attrName ]: enabled,
			},
		};

		// When ENABLING responsive mode, convert flat string values to object format
		// so that device overrides can be added
		if ( enabled ) {
			const currentValue = attributes[ attrName ];

			// Check if value is a flat string (e.g., "0px", "1.125rem")
			if ( typeof currentValue === 'string' ) {
				// Parse the string to extract value and unit
				const match = currentValue.match( /^([0-9.]+)(.*)$/ );
				if ( match ) {
					const [ , value, unit ] = match;
					// Convert to object format: { value: 0, unit: 'px' }
					updates[ attrName ] = {
						value: parseFloat( value ),
						unit: unit || '',
					};
				}
			}
			// If it's already an object or number, no conversion needed
		}

		setAttributes( updates );
	};

	/**
	 * Handle full reset - discards tablet/mobile overrides and disables responsive
	 * Called when reset button is clicked
	 */
	const handleResponsiveReset = () => {
		const currentValue = attributes[ attrName ];
		const updates = {
			responsiveEnabled: {
				...responsiveEnabledState,
				[ attrName ]: false,
			},
		};

		// If schema default is defined, reset to it and remove overrides.
		if ( defaultValue !== undefined ) {
			updates[ attrName ] = normalizedDefaultValue;
			setAttributes( updates );
			return;
		}

		// Otherwise, remove tablet/mobile overrides and keep base value.
		if ( currentValue && typeof currentValue === 'object' ) {
			const { tablet, mobile, ...baseValue } = currentValue;
			updates[ attrName ] = Object.keys( baseValue ).length > 0 ? baseValue : undefined;
			setAttributes( updates );
			return;
		}

		// No overrides to remove, just disable responsive
		setAttributes( updates );
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
	 * @param labelText
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

	// Skip attributes that explicitly set renderControl: false
	if ( attrConfig.renderControl === false ) {
		return null;
	}

	// Handle panel types (composite controls) when no explicit control is defined
	const attrType = attrConfig.type;
	if ( ! control && attrType ) {
		switch ( attrType ) {
			case 'color-panel': {
				// Render color panel with text, background, and optional hover states
				const colorValue = effectiveValue ?? attrConfig.default ?? {};
				const hasHover = attrConfig.states?.includes( 'hover' );
				const labelPrefix = attrConfig.subgroup || attrName;

				const settings = [];

				// Base text color
				settings.push( {
					label: `${ labelPrefix } Text`,
					colorValue: colorValue.text,
					onColorChange: ( color ) => {
						setAttributes( {
							[ attrName ]: { ...colorValue, text: color },
						} );
					},
				} );

				// Base background color (with gradient support)
				const bgIsGradient = typeof colorValue.background === 'string' && colorValue.background?.includes( 'gradient' );
				settings.push( {
					label: `${ labelPrefix } Background`,
					colorValue: bgIsGradient ? undefined : colorValue.background,
					gradientValue: bgIsGradient ? colorValue.background : undefined,
					onColorChange: ( color ) => {
						if ( color !== undefined ) {
							setAttributes( {
								[ attrName ]: { ...colorValue, background: color },
							} );
						}
					},
					onGradientChange: ( gradient ) => {
						if ( gradient !== undefined ) {
							setAttributes( {
								[ attrName ]: { ...colorValue, background: gradient },
							} );
						}
					},
				} );

				// Hover states if defined
				if ( hasHover ) {
					const hoverValues = colorValue.hover || {};
					settings.push( {
						label: `${ labelPrefix } Hover Text`,
						colorValue: hoverValues.text,
						onColorChange: ( color ) => {
							setAttributes( {
								[ attrName ]: {
									...colorValue,
									hover: { ...hoverValues, text: color },
								},
							} );
						},
					} );

					const hoverBgIsGradient = typeof hoverValues.background === 'string' && hoverValues.background?.includes( 'gradient' );
					settings.push( {
						label: `${ labelPrefix } Hover Background`,
						colorValue: hoverBgIsGradient ? undefined : hoverValues.background,
						gradientValue: hoverBgIsGradient ? hoverValues.background : undefined,
						onColorChange: ( color ) => {
							if ( color !== undefined ) {
								setAttributes( {
									[ attrName ]: {
										...colorValue,
										hover: { ...hoverValues, background: color },
									},
								} );
							}
						},
						onGradientChange: ( gradient ) => {
							if ( gradient !== undefined ) {
								setAttributes( {
									[ attrName ]: {
										...colorValue,
										hover: { ...hoverValues, background: gradient },
									},
								} );
							}
						},
					} );
				}

				return (
					<PanelColorSettings
						key={ attrName }
						__experimentalIsRenderedInSidebar
						enableAlpha
						settings={ settings }
					/>
				);
			}

			case 'box-panel': {
				// Render box panel with border, radius, shadow, padding, margin fields
				const boxValue = effectiveValue ?? attrConfig.default ?? {};
				const fields = attrConfig.fields || [];
				const elements = [];
				const normalizeSideScalar = ( val, fallback ) => {
					if ( val === null || val === undefined ) {
						return fallback;
					}
					if ( typeof val === 'string' ) {
						return val;
					}
					if ( typeof val === 'object' ) {
						if ( val.value !== undefined ) {
							return val.value;
						}
						if ( val.top !== undefined ) {
							return normalizeSideScalar( val.top, fallback );
						}
					}
					return fallback;
				};
				const normalizeSideObject = ( value, fallback ) => {
					if ( value && typeof value === 'object' && ! Array.isArray( value ) ) {
						return {
							top: normalizeSideScalar( value.top, fallback ),
							right: normalizeSideScalar( value.right ?? value.top, fallback ),
							bottom: normalizeSideScalar( value.bottom ?? value.top, fallback ),
							left: normalizeSideScalar( value.left ?? value.top, fallback ),
							linked: value.linked,
						};
					}
					if ( typeof value === 'string' ) {
						return { top: value, right: value, bottom: value, left: value, linked: true };
					}
					return { top: fallback, right: fallback, bottom: fallback, left: fallback, linked: true };
				};

				// Border field
				if ( fields.includes( 'border' ) ) {
					const borderValue = boxValue.border || {};
					elements.push(
						<BorderPanel
							key={ `${ attrName }-border` }
							label="Border"
							value={ borderValue.width || { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' } }
							onChange={ ( width ) => {
								setAttributes( {
									[ attrName ]: {
										...boxValue,
										border: { ...borderValue, width },
									},
								} );
							} }
							colorValue={ borderValue.color ?? '#dddddd' }
							onColorChange={ ( color ) => {
								const nextColor = normalizeSideObject( color, '#dddddd' );
								setAttributes( {
									[ attrName ]: {
										...boxValue,
										border: {
											...borderValue,
											color: nextColor,
										},
									},
								} );
							} }
							styleValue={ borderValue.style ?? 'solid' }
							onStyleChange={ ( style ) => {
								const nextStyle = normalizeSideObject( style, 'solid' );
								setAttributes( {
									[ attrName ]: {
										...boxValue,
										border: {
											...borderValue,
											style: nextStyle,
										},
									},
								} );
							} }
						/>
					);
				}

				// Radius field
				if ( fields.includes( 'radius' ) ) {
					const radiusValue = boxValue.radius || { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0, unit: 'px' };
					elements.push(
						<BorderRadiusControl
							key={ `${ attrName }-radius` }
							label="Border Radius"
							value={ radiusValue }
							onChange={ ( radius ) => {
								setAttributes( {
									[ attrName ]: { ...boxValue, radius },
								} );
							} }
							units={ [ 'px', 'rem', '%' ] }
						/>
					);
				}

				// Shadow field
				if ( fields.includes( 'shadow' ) ) {
					elements.push(
						<ShadowPanel
							key={ `${ attrName }-shadow` }
							label="Shadow"
							value={ boxValue.shadow || [] }
							onChange={ ( shadow ) => {
								setAttributes( {
									[ attrName ]: { ...boxValue, shadow },
								} );
							} }
						/>
					);
				}

				// Padding field
				if ( fields.includes( 'padding' ) ) {
					const paddingValue = boxValue.padding || { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' };
					elements.push(
						<SpacingControl
							key={ `${ attrName }-padding` }
							label="Padding"
							type="padding"
							value={ paddingValue }
							onChange={ ( padding ) => {
								setAttributes( {
									[ attrName ]: { ...boxValue, padding },
								} );
							} }
							units={ [ 'px', 'em', 'rem' ] }
						/>
					);
				}

				// Margin field
				if ( fields.includes( 'margin' ) ) {
					const marginValue = boxValue.margin || { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' };
					elements.push(
						<SpacingControl
							key={ `${ attrName }-margin` }
							label="Margin"
							type="margin"
							value={ marginValue }
							onChange={ ( margin ) => {
								setAttributes( {
									[ attrName ]: { ...boxValue, margin },
								} );
							} }
							units={ [ 'px', 'em', 'rem' ] }
							sides={ [ 'top', 'bottom' ] }
						/>
					);
				}

				return elements.length > 0 ? <>{ elements }</> : null;
			}

			case 'border-panel': {
				// Render single border panel (e.g., divider)
				const borderValue = effectiveValue ?? attrConfig.default ?? {};
				const fields = attrConfig.fields || [ 'top', 'right', 'bottom', 'left' ];
				const side = fields[ 0 ] || 'top'; // Usually single side for dividers
				const resolveSideScalar = ( val, fallback ) => {
					if ( val === null || val === undefined ) {
						return fallback;
					}
					if ( typeof val === 'string' ) {
						return val;
					}
					if ( typeof val === 'object' ) {
						if ( val.value !== undefined ) {
							return val.value;
						}
						if ( val.top !== undefined ) {
							return resolveSideScalar( val.top, fallback );
						}
					}
					return fallback;
				};
				const rawColor = borderValue.color?.[ side ] ?? borderValue.color;
				const rawStyle = borderValue.style?.[ side ] ?? borderValue.style;
				const colorValue = resolveSideScalar( rawColor, '#dddddd' );
				const styleValue = resolveSideScalar( rawStyle, 'solid' );

				return (
					<BorderPanel
						key={ attrName }
						label={ attrConfig.subgroup || 'Border' }
						value={ {
							top: borderValue.width?.[ side ] || 0,
							right: borderValue.width?.[ side ] || 0,
							bottom: borderValue.width?.[ side ] || 0,
							left: borderValue.width?.[ side ] || 0,
							unit: borderValue.width?.unit || 'px',
							linked: true,
						} }
						onChange={ ( width ) => {
							const newWidth = { ...borderValue.width };
							fields.forEach( ( f ) => {
								newWidth[ f ] = width.top;
							} );
							newWidth.unit = width.unit;
							setAttributes( {
								[ attrName ]: { ...borderValue, width: newWidth },
							} );
						} }
						colorValue={ colorValue }
						onColorChange={ ( color ) => {
							const nextColor = resolveSideScalar( color, '#dddddd' );
							const newColor = { ...( borderValue.color || {} ) };
							fields.forEach( ( f ) => {
								newColor[ f ] = nextColor;
							} );
							setAttributes( {
								[ attrName ]: { ...borderValue, color: newColor },
							} );
						} }
						styleValue={ styleValue }
						onStyleChange={ ( style ) => {
							const nextStyle = resolveSideScalar( style, 'solid' );
							const newStyle = { ...( borderValue.style || {} ) };
							fields.forEach( ( f ) => {
								newStyle[ f ] = nextStyle;
							} );
							setAttributes( {
								[ attrName ]: { ...borderValue, style: newStyle },
							} );
						} }
						lockLinked={ true }
					/>
				);
			}

			case 'typography-panel': {
				// Render typography controls
				const typoValue = effectiveValue ?? attrConfig.default ?? {};
				const fields = attrConfig.fields || [ 'fontFamily', 'fontSize', 'lineHeight' ];
				const elements = [];

				if ( fields.includes( 'fontFamily' ) ) {
					elements.push(
						<FontFamilyControl
							key={ `${ attrName }-fontFamily` }
							label="Font Family"
							value={ typoValue.fontFamily || '' }
							onChange={ ( fontFamily ) => {
								setAttributes( {
									[ attrName ]: { ...typoValue, fontFamily },
								} );
							} }
						/>
					);
				}

				if ( fields.includes( 'fontSize' ) ) {
					elements.push(
						<SliderWithInput
							key={ `${ attrName }-fontSize` }
							label="Font Size"
							value={ typoValue.fontSize || '16px' }
							onChange={ ( fontSize ) => {
								setAttributes( {
									[ attrName ]: { ...typoValue, fontSize },
								} );
							} }
							min={ 8 }
							max={ 72 }
							units={ [ 'px', 'em', 'rem' ] }
						/>
					);
				}

				if ( fields.includes( 'lineHeight' ) ) {
					elements.push(
						<SliderWithInput
							key={ `${ attrName }-lineHeight` }
							label="Line Height"
							value={ typoValue.lineHeight || '1.5' }
							onChange={ ( lineHeight ) => {
								setAttributes( {
									[ attrName ]: { ...typoValue, lineHeight },
								} );
							} }
							min={ 0.5 }
							max={ 3 }
							step={ 0.1 }
							units={ [ '', 'px', 'em' ] }
						/>
					);
				}

				return elements.length > 0 ? <>{ elements }</> : null;
			}

			default:
				// Unknown panel type - skip rendering
				return null;
		}
	}

	// Skip attributes without a defined control (and not a panel type)
	if ( ! control ) {
		return null;
	}

	// Switch statement mapping control types to components
	switch ( control ) {
		// ==================== Color Controls ====================

		case 'ColorPicker':
		case 'ColorControl': {
			// Use native WordPress PanelColorGradientSettings for text colors
			return (
				<PanelColorSettings
					key={ attrName }
					__experimentalIsRenderedInSidebar
					enableAlpha
					settings={ [
						{
							colorValue: effectiveValue,
							label: finalLabel,
							onColorChange: handleChange,
						},
					] }
				/>
			);
		}

		case 'GradientControl': {
			// Use native WordPress PanelColorGradientSettings for gradients only
			return (
				<PanelColorSettings
					key={ attrName }
					__experimentalIsRenderedInSidebar
					enableAlpha
					settings={ [
						{
							gradientValue: effectiveValue,
							label: finalLabel,
							onGradientChange: handleChange,
						},
					] }
				/>
			);
		}

		case 'ColorGradientControl': {
			// Use native WordPress PanelColorGradientSettings for backgrounds (color + gradient)
			const isGradientValue =
				typeof effectiveValue === 'string' && effectiveValue.includes( 'gradient' );

			// Separate handlers to avoid clearing value when switching tabs
			// WordPress calls the opposite handler with undefined when switching
			const handleColorChange = ( color ) => {
				// Only update if we have an actual color value
				if ( color !== undefined ) {
					setAttributes( { [ attrName ]: color } );
				}
			};

			const handleGradientChange = ( gradient ) => {
				// Only update if we have an actual gradient value
				if ( gradient !== undefined ) {
					setAttributes( { [ attrName ]: gradient } );
				}
			};

			return (
				<PanelColorSettings
					key={ attrName }
					__experimentalIsRenderedInSidebar
					enableAlpha
					settings={ [
						{
							colorValue: isGradientValue ? undefined : effectiveValue,
							gradientValue: isGradientValue ? effectiveValue : undefined,
							label: finalLabel,
							onColorChange: handleColorChange,
							onGradientChange: handleGradientChange,
						},
					] }
				/>
			);
		}

		// ==================== Numeric Controls ====================

		case 'RangeControl': {
			const numericValue = toNumericValue( effectiveValue );
			const defaultNumericValue = toNumericValue( normalizedDefaultValue );

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
			// Get units from centralizer if cssProperty is defined and units not explicitly set
			const resolvedUnits =
				units ?? ( cssProperty ? getAvailableUnits( cssProperty ) : null );

			// Check if this attribute supports responsive (from schema)
			// and if responsive mode is currently enabled (user toggle)
			if ( responsive ) {
				return (
					<SliderWithInput
						key={ attrName }
						label={ renderLabel( finalLabel ) }
						values={ effectiveValue || {} }
						onChange={ handleResponsiveChange }
						responsive={ isResponsiveEnabled }
						canBeResponsive={ true }
						responsiveEnabled={ isResponsiveEnabled }
						onResponsiveToggle={ handleResponsiveToggle }
						onResponsiveReset={ handleResponsiveReset }
						units={ resolvedUnits }
						cssProperty={ cssProperty }
						min={ min }
						max={ max }
						step={ step }
						help={ helpText }
						defaultValue={ normalizedDefaultValue }
					/>
				);
			}

			return (
				<SliderWithInput
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? normalizedDefaultValue }
					onChange={ handleChange }
					responsive={ false }
					canBeResponsive={ false }
					units={ resolvedUnits }
					cssProperty={ cssProperty }
					min={ min }
					max={ max }
					step={ step }
					help={ helpText }
					defaultValue={ normalizedDefaultValue }
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
			const { IconPicker } = require( './controls' );
			return (
				<IconPicker
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? { kind: 'char', value: '▾' } }
					onChange={ handleChange }
					help={ helpText }
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
			const currentRadius = effectiveValue ||
				defaultValue || {
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
						<p
							style={ {
								fontSize: '12px',
								color: '#757575',
								marginTop: '4px',
								marginBottom: '12px',
							} }
						>
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
			// Only render if this attribute has the order field
			if ( attrConfig.order === undefined ) {
				return null;
			}

			// Find related attributes by controlId
			const controlId = attrConfig.controlId;
			if ( ! controlId ) {
				return null;
			}

			const allAttrs = Object.entries( schema?.attributes || {} );
			const relatedAttrs = allAttrs.filter(
				( [ , attr ] ) => attr.control === 'BorderPanel' && attr.controlId === controlId
			);

			// Find width, color, style by their cssProperty endings
			const widthAttr = relatedAttrs.find( ( [ , attr ] ) =>
				attr.cssProperty?.endsWith( 'width' )
			);
			const colorAttr = relatedAttrs.find( ( [ , attr ] ) =>
				attr.cssProperty?.endsWith( 'color' )
			);
			const styleAttr = relatedAttrs.find( ( [ , attr ] ) =>
				attr.cssProperty?.endsWith( 'style' )
			);

			const widthAttrName = widthAttr?.[ 0 ];
			const colorAttrName = colorAttr?.[ 0 ];
			const styleAttrName = styleAttr?.[ 0 ];

			// Validate we found all 3
			if ( ! widthAttrName || ! colorAttrName || ! styleAttrName ) {
				return null;
			}

			// Get values and config
			const widthAttrConfig = widthAttr[ 1 ];
			const widthValue = effectiveValues?.[ widthAttrName ];
			const colorValue = effectiveValues?.[ colorAttrName ] ?? '#dddddd';
			const styleValue = effectiveValues?.[ styleAttrName ] ?? 'solid';

			// Detect single-side vs all-sides from cssProperty
			const isSingleSideBorder = widthAttrConfig.cssProperty?.match(
				/^border-(top|right|bottom|left)-width$/
			);

			return (
				<BorderPanel
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={
						widthValue ??
						widthAttrConfig.default ?? {
							top: 1,
							right: 1,
							bottom: 1,
							left: 1,
							unit: 'px',
							linked: true,
						}
					}
					onChange={
						widthAttrName
							? ( val ) => setAttributes( { [ widthAttrName ]: val } )
							: undefined
					}
					colorValue={ colorValue }
					onColorChange={
						colorAttrName
							? ( color ) => setAttributes( { [ colorAttrName ]: color } )
							: undefined
					}
					styleValue={ styleValue }
					onStyleChange={
						styleAttrName
							? ( style ) => setAttributes( { [ styleAttrName ]: style } )
							: undefined
					}
					min={ widthAttrConfig.min ?? 0 }
					max={ widthAttrConfig.max ?? 20 }
					step={ widthAttrConfig.step ?? 1 }
					responsive={ widthAttrConfig.responsive }
					disabled={ isDisabled }
					lockLinked={ isSingleSideBorder }
				/>
			);
		}

		case 'PanelColorSettings': {
			// Only render if this attribute has the order field
			if ( attrConfig.order === undefined ) {
				return null;
			}

			// Find related attributes by controlId
			const controlId = attrConfig.controlId;
			if ( ! controlId ) {
				return null;
			}

			const allAttrs = Object.entries( schema?.attributes || {} );
			const relatedAttrs = allAttrs.filter(
				( [ , attr ] ) =>
					attr.control === 'PanelColorSettings' && attr.controlId === controlId
			);

			// Build settings array for PanelColorGradientSettings
			const settings = relatedAttrs.map( ( [ colorAttrName, colorAttrConfig ] ) => {
				const colorValue = effectiveValues?.[ colorAttrName ];

				// Auto-detect if this is a background color
				const isBackgroundColor =
					colorAttrConfig.cssProperty?.includes( 'background' ) ||
					colorAttrConfig.colorLabel === 'Background';

				const setting = {
					label: colorAttrConfig.colorLabel || colorAttrConfig.label || colorAttrName,
					colorValue,
					onColorChange: ( color ) => setAttributes( { [ colorAttrName ]: color } ),
				};

				// Add gradient support for background colors
				if ( isBackgroundColor ) {
					setting.gradientValue = colorValue;
					setting.onGradientChange = ( gradient ) =>
						setAttributes( { [ colorAttrName ]: gradient } );
				}

				return setting;
			} );

			return (
				<PanelColorSettings
					key={ attrName }
					title={ finalLabel }
					settings={ settings }
					{ ...colorGradientSettings }
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
					defaultValue={ normalizedDefaultValue }
					help={ helpText }
				/>
			);
		}

		case 'ShadowPanel': {
			// Default shadow layer structure
			const defaultShadowArray = [
				{
					x: { value: 0, unit: 'px' },
					y: { value: 8, unit: 'px' },
					blur: { value: 24, unit: 'px' },
					spread: { value: 0, unit: 'px' },
					color: 'rgba(0,0,0,0.15)',
					inset: false,
				},
			];

			// Determine which controls to show based on CSS property
			// text-shadow doesn't support spread or blur
			const isTextShadow = cssProperty === 'text-shadow';
			const showSpread = ! isTextShadow;
			const showBlur = ! isTextShadow;

			return (
				<ShadowPanel
					key={ attrName }
					label={ renderLabel( finalLabel ) }
					value={ effectiveValue ?? defaultValue ?? defaultShadowArray }
					onChange={ handleChange }
					disabled={ isDisabled }
					showSpread={ showSpread }
					showBlur={ showBlur }
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
					value={
						effectiveValue ?? defaultValue ?? { weight: 'normal', style: 'normal' }
					}
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

		case 'FormattingControl': {
			return (
				<FormattingControl
					key={ attrName }
					value={ {
						formatting: attributes[ attrName ] || [],
						fontWeight: attributes.titleFontWeight || 400,
						decorationColor: attributes.titleDecorationColor || 'currentColor',
						decorationStyle: attributes.titleDecorationStyle || 'solid',
						decorationWidth: attributes.titleDecorationWidth || 'auto',
						noLineBreak:
							( effectiveValues?.titleNoLineBreak ?? attributes.titleNoLineBreak ) ===
							'nowrap',
					} }
					textColor={ effectiveValues?.titleColor }
					onChange={ ( newValue ) => {
						setAttributes( {
							[ attrName ]: newValue.formatting,
							titleFontWeight: newValue.fontWeight,
							titleDecorationColor: newValue.decorationColor,
							titleDecorationStyle: newValue.decorationStyle,
							titleDecorationWidth: newValue.decorationWidth,
							titleNoLineBreak: newValue.noLineBreak ? 'nowrap' : 'normal',
						} );
					} }
					label={ attrConfig.label }
					disabled={ isDisabled }
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
					blockType={ blockType }
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
					responsive={ isResponsiveEnabled }
					canBeResponsive={ responsive }
					responsiveEnabled={ isResponsiveEnabled }
					onResponsiveToggle={ handleResponsiveToggle }
					onResponsiveReset={ handleResponsiveReset }
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
					responsive={ isResponsiveEnabled }
					canBeResponsive={ responsive }
					responsiveEnabled={ isResponsiveEnabled }
					onResponsiveToggle={ handleResponsiveToggle }
					onResponsiveReset={ handleResponsiveReset }
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
			return null;
	}
}

export default ControlRenderer;
