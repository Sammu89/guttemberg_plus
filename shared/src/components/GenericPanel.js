/**
 * Generic Panel Component
 *
 * Schema-driven panel for rendering any group of attributes.
 * Works with any block schema (accordion, tabs, TOC, etc.)
 * Shows ALL attributes in a group, regardless of themeable flag.
 *
 * Note: The themeable flag is ONLY used for theme mechanics (what gets saved
 * in theme files and customization detection), NOT for UI display.
 *
 * Replaces: HeaderColorsPanel, ContentColorsPanel, TypographyPanel, IconPanel
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { PanelBody, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { isCustomizedFromDefaults } from '../theme-system/cascade-resolver';
import { normalizeValueForControl } from '../theme-system/control-normalizer';
import { CompactColorControl } from './CompactColorControl';

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
 * Generic Panel Component
 *
 * Schema-driven panel that renders controls for any attribute group.
 * Filters attributes by group only (shows ALL, themeable or not), then renders appropriate controls.
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.schema          JSON schema with attribute definitions and groups
 * @param {string}   props.schemaGroup     Group name to filter attributes (e.g., 'headerColors')
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {Object}   props.effectiveValues All effective values from cascade resolution
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 * @param {string}   props.title           Panel title override (default: from schema)
 * @returns {JSX.Element|null} Rendered panel or null if no attributes
 */
export function GenericPanel( {
	schema = {},
	schemaGroup = '',
	attributes = {},
	setAttributes,
	effectiveValues = {},
	theme,
	cssDefaults = {},
	initialOpen = false,
	title,
} ) {
	// Validate required props
	if ( ! setAttributes ) {
		console.warn( '[GenericPanel] Missing required prop: setAttributes' );
		return null;
	}

	if ( ! schema || ! schemaGroup ) {
		return null;
	}

	// Get group title from schema or use provided title
	const groupTitle = title || schema.groups?.[ schemaGroup ]?.title || schemaGroup;

	// Filter attributes: only those in this group (show ALL, not just themeable)
	// Note: themeable flag is ONLY for theme saving/customization warnings, NOT for UI display
	const groupAttributes = Object.entries( schema.attributes || {} )
		.filter( ( [ , attrConfig ] ) => {
			return attrConfig.group === schemaGroup;
		} )
		.map( ( [ attrName, attrConfig ] ) => ( {
			name: attrName,
			...attrConfig,
		} ) )
		.sort( ( a, b ) => {
			// Sort by order property (if not defined, use 999 to push to end)
			const orderA = a.order !== undefined ? a.order : 999;
			const orderB = b.order !== undefined ? b.order : 999;
			return orderA - orderB;
		} );

	// Return null if no attributes to render
	if ( groupAttributes.length === 0 ) {
		return null;
	}

	/**
	 * Handle attribute change
	 * @param {string} attrName - Attribute name
	 * @param {*} value - New value
	 */
	const handleChange = ( attrName, value ) => {
		setAttributes( { [ attrName ]: value } );
	};

	/**
	 * Check if attribute is customized
	 * @param {string} attrName - Attribute name
	 * @returns {boolean} Whether attribute is customized
	 */
	const isAttrCustomized = ( attrName ) => {
		return isCustomizedFromDefaults( attrName, attributes, theme, cssDefaults );
	};

	/**
	 * Render label with customization badge
	 * @param {string} label - Label text
	 * @param {string} attrName - Attribute name for customization check
	 * @returns {JSX.Element} Label with optional badge
	 */
	const renderLabel = ( label, attrName ) => (
		<span>
			{ label }
			{ isAttrCustomized( attrName ) && (
				<span className="customization-badge"> (Customized)</span>
			) }
		</span>
	);

	/**
	 * Render a single control based on its configuration
	 * @param {string} attrName - Attribute name
	 * @param {Object} attrConfig - Attribute configuration from schema
	 * @returns {JSX.Element|null} Rendered control or null
	 */
	const renderControl = ( attrName, attrConfig ) => {
		const { control, label, description, options, min, max, step, default: defaultValue } = attrConfig;
		const effectiveValue = effectiveValues[ attrName ];
		const finalLabel = label || attrName;
		const helpText = description || '';

		// Skip attributes without a defined control (e.g., SpacingControl)
		// Note: BorderRadiusControl is now handled in the switch statement below
		if ( ! control ) {
			return null;
		}

		switch ( control ) {
			case 'ColorPicker': {
				const normalizedValue = normalizeValueForControl(
					effectiveValue,
					attrName,
					'color'
				);

				return (
					<div key={ attrName }>
						<CompactColorControl
							label={ renderLabel( finalLabel, attrName ) }
							value={ normalizedValue }
							onChange={ ( value ) => handleChange( attrName, value ) }
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

			case 'RangeControl': {
				const numericValue = toNumericValue( effectiveValue );
				const defaultNumericValue = toNumericValue( defaultValue );

				return (
					<RangeControl
						key={ attrName }
						label={ renderLabel( finalLabel, attrName ) }
						value={ numericValue ?? defaultNumericValue ?? 0 }
						onChange={ ( value ) => handleChange( attrName, value ) }
						min={ min ?? 0 }
						max={ max ?? 100 }
						step={ step ?? 1 }
						help={ helpText }
					/>
				);
			}

			case 'SelectControl': {
				const normalizedOptions = normalizeOptions( options );
				const defaultSelectValue = defaultValue ?? normalizedOptions[ 0 ]?.value ?? '';

				return (
					<SelectControl
						key={ attrName }
						label={ renderLabel( finalLabel, attrName ) }
						value={ effectiveValue ?? defaultSelectValue }
						options={ normalizedOptions }
						onChange={ ( value ) => handleChange( attrName, value ) }
						help={ helpText }
						__next40pxDefaultSize
					/>
				);
			}

			case 'TextControl': {
				return (
					<TextControl
						key={ attrName }
						label={ renderLabel( finalLabel, attrName ) }
						value={ effectiveValue ?? defaultValue ?? '' }
						onChange={ ( value ) => handleChange( attrName, value ) }
						help={ helpText }
						__next40pxDefaultSize
					/>
				);
			}

			case 'ToggleControl': {
				return (
					<ToggleControl
						key={ attrName }
						label={ renderLabel( finalLabel, attrName ) }
						checked={ effectiveValue ?? defaultValue ?? false }
						onChange={ ( value ) => handleChange( attrName, value ) }
						help={ helpText }
						__nextHasNoMarginBottom
					/>
				);
			}

			case 'FontFamilyControl': {
				// FontFamilyControl could be a custom component or fallback to TextControl
				// For now, render as TextControl until FontFamilyControl is implemented
				return (
					<TextControl
						key={ attrName }
						label={ renderLabel( finalLabel, attrName ) }
						value={ effectiveValue ?? defaultValue ?? '' }
						onChange={ ( value ) => handleChange( attrName, value ) }
						help={ helpText }
						__next40pxDefaultSize
					/>
				);
			}

			case 'IconPicker': {
				// IconPicker for selecting character or image URL
				// Users can enter: characters (▾, ▸, etc), Unicode codes, or image URLs
				const iconHelp = helpText || "Use a character (▾, ▸, etc.), Unicode code, or image URL. Use 'none' to disable.";
				return (
					<TextControl
						key={ attrName }
						label={ renderLabel( finalLabel, attrName ) }
						value={ effectiveValue ?? defaultValue ?? '' }
						onChange={ ( value ) => handleChange( attrName, value ) }
						placeholder="Enter icon char or image URL"
						help={ iconHelp }
						__next40pxDefaultSize
					/>
				);
			}

			case 'BorderRadiusControl': {
				// Border Radius control with individual corner controls
				// Handles object values with topLeft, topRight, bottomRight, bottomLeft properties
				const currentRadius = effectiveValue || defaultValue || {
					topLeft: 0,
					topRight: 0,
					bottomRight: 0,
					bottomLeft: 0,
				};

				// Handler for individual corner changes
				const handleCornerChange = ( corner, value ) => {
					const updatedRadius = {
						...currentRadius,
						[ corner ]: value,
					};
					handleChange( attrName, updatedRadius );
				};

				// Get unit from schema (default to 'px')
				const unit = attrConfig.unit || 'px';

				return (
					<div key={ attrName } style={ { marginBottom: '16px' } }>
						<h4 style={ { margin: '0 0 8px 0', fontSize: '13px' } }>
							{ renderLabel( finalLabel, attrName ) }
						</h4>
						{ helpText && (
							<p style={ { fontSize: '12px', color: '#757575', marginTop: '4px', marginBottom: '12px' } }>
								{ helpText }
							</p>
						) }
						<RangeControl
							label={ `Top Left (${ unit })` }
							value={ currentRadius.topLeft ?? 0 }
							onChange={ ( value ) => handleCornerChange( 'topLeft', value ) }
							min={ min ?? 0 }
							max={ max ?? 60 }
							step={ step ?? 1 }
						/>
						<RangeControl
							label={ `Top Right (${ unit })` }
							value={ currentRadius.topRight ?? 0 }
							onChange={ ( value ) => handleCornerChange( 'topRight', value ) }
							min={ min ?? 0 }
							max={ max ?? 60 }
							step={ step ?? 1 }
						/>
						<RangeControl
							label={ `Bottom Right (${ unit })` }
							value={ currentRadius.bottomRight ?? 0 }
							onChange={ ( value ) => handleCornerChange( 'bottomRight', value ) }
							min={ min ?? 0 }
							max={ max ?? 60 }
							step={ step ?? 1 }
						/>
						<RangeControl
							label={ `Bottom Left (${ unit })` }
							value={ currentRadius.bottomLeft ?? 0 }
							onChange={ ( value ) => handleCornerChange( 'bottomLeft', value ) }
							min={ min ?? 0 }
							max={ max ?? 60 }
							step={ step ?? 1 }
						/>
					</div>
				);
			}

			default:
				// Unknown control type - skip or log warning
				console.warn(
					`[GenericPanel] Unknown control type "${ control }" for attribute "${ attrName }"`
				);
				return null;
		}
	};

	return (
		<PanelBody title={ groupTitle } initialOpen={ initialOpen }>
			{ groupAttributes.map( ( attrConfig ) =>
				renderControl( attrConfig.name, attrConfig )
			) }
		</PanelBody>
	);
}

export default GenericPanel;
