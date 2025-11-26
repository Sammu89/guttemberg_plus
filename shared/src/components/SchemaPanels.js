/**
 * Schema Panels Component
 *
 * Auto-generates all sidebar panels from schema configuration.
 * Reads schema.groups, sorts by order, and renders GenericPanel for each group.
 * This eliminates the need for manual panel lists in block edit files.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import GenericPanel from './GenericPanel';

/**
 * Schema Panels - Auto-generate all sidebar panels from schema
 *
 * @param {Object}   props                Component props
 * @param {Object}   props.schema         JSON schema with groups and attributes
 * @param {Object}   props.attributes     Block attributes
 * @param {Function} props.setAttributes  Function to update block attributes
 * @param {Object}   props.effectiveValues All effective values from cascade resolution
 * @param {Object}   props.theme          Current theme object (optional)
 * @param {Object}   props.cssDefaults    CSS default values (optional)
 * @returns {JSX.Element|null} Rendered panels or null
 */
export function SchemaPanels( {
	schema = {},
	attributes = {},
	setAttributes,
	effectiveValues = {},
	theme,
	cssDefaults = {},
} ) {
	// Validate required props
	if ( ! setAttributes ) {
		console.warn( '[SchemaPanels] Missing required prop: setAttributes' );
		return null;
	}

	if ( ! schema || ! schema.groups ) {
		console.warn( '[SchemaPanels] Missing schema or schema.groups' );
		return null;
	}

	// Convert groups object to array and sort by order
	const sortedGroups = Object.entries( schema.groups )
		.map( ( [ groupName, groupConfig ] ) => ( {
			name: groupName,
			...groupConfig,
		} ) )
		.sort( ( a, b ) => {
			// Sort by order property (if not defined, use 999 to push to end)
			const orderA = a.order !== undefined ? a.order : 999;
			const orderB = b.order !== undefined ? b.order : 999;
			return orderA - orderB;
		} );

	return (
		<>
			{ sortedGroups.map( ( groupConfig ) => {
				const { name: groupName, initialOpen = false, pago = 'nao' } = groupConfig;

				// Skip groups with no attributes (empty panels)
				const hasAttributes = Object.values( schema.attributes || {} ).some(
					( attr ) => attr.group === groupName
				);

				if ( ! hasAttributes ) {
					return null;
				}

				return (
					<GenericPanel
						key={ groupName }
						schema={ schema }
						schemaGroup={ groupName }
						attributes={ attributes }
						setAttributes={ setAttributes }
						effectiveValues={ effectiveValues }
						theme={ theme }
						cssDefaults={ cssDefaults }
						initialOpen={ initialOpen }
						pago={ pago }
					/>
				);
			} ) }
		</>
	);
}

export default SchemaPanels;
