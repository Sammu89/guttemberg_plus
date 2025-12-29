/**
 * ToolsPanel Wrapper Component
 *
 * Modern panel using WordPress ToolsPanel for organizing controls.
 * Follows WordPress best practices for block inspector controls.
 * Each control can be individually toggled and reset.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { ControlRenderer } from './ControlRenderer';

/**
 * ToolsPanel Wrapper Component
 *
 * Uses native WordPress ToolsPanel for better UX.
 * Each control is individually toggleable from the panel menu.
 *
 * @param {Object}   props                 Component props
 * @param {string}   props.groupName       Name of the group
 * @param {Object}   props.groupConfig     Group configuration
 * @param {Object}   props.schema          Full schema object
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {Object}   props.effectiveValues All effective values from cascade resolution
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @returns {JSX.Element|null} Rendered panel or null
 */
export function ToolsPanelWrapper( {
	groupName,
	groupConfig,
	schema,
	attributes,
	setAttributes,
	effectiveValues = {},
	theme,
	cssDefaults = {},
} ) {
	// Get theme colors and gradients for color controls
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Validate required props
	if ( ! setAttributes ) {
		return null;
	}

	if ( ! schema || ! groupName ) {
		return null;
	}

	const groupTitle = groupConfig?.title || groupName;

	// Filter and sort attributes for this group
	const groupAttributes = Object.entries( schema.attributes || {} )
		.filter( ( [ , attrConfig ] ) => {
			if ( attrConfig.group !== groupName ) {
				return false;
			}
			if ( attrConfig.visibleOnSidebar === false ) {
				return false;
			}
			return true;
		} )
		.map( ( [ attrName, attrConfig ] ) => ( {
			name: attrName,
			...attrConfig,
		} ) )
		.sort( ( a, b ) => {
			const orderA = a.order !== undefined ? a.order : 999;
			const orderB = b.order !== undefined ? b.order : 999;
			return orderA - orderB;
		} );

	// Return null if no attributes to render
	if ( groupAttributes.length === 0 ) {
		return null;
	}

	// Create resetAll function for ToolsPanel
	const resetAll = () => {
		const resetValues = {};
		groupAttributes.forEach( ( attr ) => {
			// Reset to default value from schema
			resetValues[ attr.name ] = attr.default;
		} );
		setAttributes( resetValues );
	};

	return (
		<ToolsPanel
			label={ groupTitle }
			resetAll={ resetAll }
			panelId={ `${ groupName }-panel` }
		>
			{ groupAttributes.map( ( attrConfig ) => {
				const attrName = attrConfig.name;
				const currentValue = attributes[ attrName ];
				const defaultValue = attrConfig.default;

				// Create label for menu - include subgroup if it exists
				const menuLabel = attrConfig.subgroup
					? `${ attrConfig.subgroup } - ${ attrConfig.label || attrName }`
					: ( attrConfig.label || attrName );

				return (
					<ToolsPanelItem
						key={ attrName }
						hasValue={ () => {
							// Check if the value is different from default
							if ( currentValue === undefined ) {
								return false;
							}
							return currentValue !== defaultValue;
						} }
						label={ menuLabel }
						onDeselect={ () => {
							// Reset to default value
							setAttributes( { [ attrName ]: defaultValue } );
						} }
						isShownByDefault={ attrConfig.order !== undefined && attrConfig.order <= 2 }
						panelId={ `${ groupName }-panel` }
					>
						<ControlRenderer
							attrName={ attrName }
							attrConfig={ attrConfig }
							attributes={ attributes }
							setAttributes={ setAttributes }
							effectiveValues={ effectiveValues }
							schema={ schema }
							theme={ theme }
							cssDefaults={ cssDefaults }
							colorGradientSettings={ colorGradientSettings }
						/>
					</ToolsPanelItem>
				);
			} ) }
		</ToolsPanel>
	);
}

export default ToolsPanelWrapper;
