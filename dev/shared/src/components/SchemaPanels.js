/**
 * Schema Panels Component
 *
 * Auto-generates all sidebar panels from schema configuration.
 * Reads schema.groups, sorts by order, and renders appropriate panels.
 * Supports filtering by tab (settings vs appearance) and subgroups.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import GenericPanel from './GenericPanel';
import SubgroupPanel from './SubgroupPanel';

/**
 * Filter groups by tab assignment
 *
 * Groups are assigned to tabs based on their 'tab' property:
 * - 'settings': Structural/behavioral controls
 * - 'appearance': Visual/styling controls
 * - undefined: Defaults to 'settings'
 *
 * @param {Object} groups   - Groups object from schema
 * @param {string} tabName  - Tab name to filter by ('settings' or 'appearance')
 * @returns {Array} Filtered and sorted array of groups
 */
function filterGroupsByTab( groups, tabName ) {
	if ( ! groups ) {
		return [];
	}

	return Object.entries( groups )
		.filter( ( [ , groupConfig ] ) => {
			const groupTab = groupConfig.tab || 'settings';
			return groupTab === tabName;
		} )
		.map( ( [ groupName, groupConfig ] ) => ( {
			name: groupName,
			...groupConfig,
		} ) )
		.sort( ( a, b ) => {
			const orderA = a.order !== undefined ? a.order : 999;
			const orderB = b.order !== undefined ? b.order : 999;
			return orderA - orderB;
		} );
}

/**
 * Check if a group has any visible attributes
 *
 * @param {string} groupName - Group name to check
 * @param {Object} schema    - Full schema object
 * @returns {boolean} Whether the group has visible attributes
 */
function groupHasAttributes( groupName, schema ) {
	return Object.values( schema.attributes || {} ).some(
		( attr ) => attr.group === groupName && attr.visibleOnSidebar !== false
	);
}

/**
 * Schema Panels - Auto-generate all sidebar panels from schema
 *
 * @param {Object}   props                  Component props
 * @param {Object}   props.schema           JSON schema with groups and attributes
 * @param {Object}   props.attributes       Block attributes
 * @param {Function} props.setAttributes    Function to update block attributes
 * @param {Object}   props.effectiveValues  All effective values from cascade resolution
 * @param {Object}   props.theme            Current theme object (optional)
 * @param {Object}   props.cssDefaults      CSS default values (optional)
 * @param {string}   props.tab              Tab name to filter by (optional)
 * @param {boolean}  props.useSubgroupPanels Whether to use SubgroupPanel for groups with subgroups
 * @returns {JSX.Element|null} Rendered panels or null
 */
export function SchemaPanels( {
	schema = {},
	attributes = {},
	setAttributes,
	effectiveValues = {},
	theme,
	cssDefaults = {},
	tab = null,
	useSubgroupPanels = true,
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

	// Get groups - either filtered by tab or all groups
	let sortedGroups;

	if ( tab ) {
		// Filter groups by tab
		sortedGroups = filterGroupsByTab( schema.groups, tab );
	} else {
		// Use all groups sorted by order
		sortedGroups = Object.entries( schema.groups )
			.map( ( [ groupName, groupConfig ] ) => ( {
				name: groupName,
				...groupConfig,
			} ) )
			.sort( ( a, b ) => {
				const orderA = a.order !== undefined ? a.order : 999;
				const orderB = b.order !== undefined ? b.order : 999;
				return orderA - orderB;
			} );
	}

	return (
		<>
			{ sortedGroups.map( ( groupConfig ) => {
				const { name: groupName, initialOpen = false, pago = 'nao', subgroups } = groupConfig;

				// Skip groups with no visible attributes
				if ( ! groupHasAttributes( groupName, schema ) ) {
					return null;
				}

				// Use SubgroupPanel if group has subgroups and useSubgroupPanels is true
				const hasSubgroups = subgroups && Array.isArray( subgroups ) && subgroups.length > 0;

				if ( hasSubgroups && useSubgroupPanels ) {
					return (
						<SubgroupPanel
							key={ groupName }
							groupName={ groupName }
							groupConfig={ groupConfig }
							schema={ schema }
							attributes={ attributes }
							setAttributes={ setAttributes }
							effectiveValues={ effectiveValues }
							theme={ theme }
							cssDefaults={ cssDefaults }
							initialOpen={ initialOpen }
						/>
					);
				}

				// Use GenericPanel for groups without subgroups
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

/**
 * Settings Panels - Convenience component for settings tab only
 *
 * @param {Object} props - Same props as SchemaPanels
 * @returns {JSX.Element|null} Rendered panels for settings tab
 */
export function SettingsPanels( props ) {
	return <SchemaPanels { ...props } tab="settings" />;
}

/**
 * Appearance Panels - Convenience component for appearance tab only
 *
 * @param {Object} props - Same props as SchemaPanels
 * @returns {JSX.Element|null} Rendered panels for appearance tab
 */
export function AppearancePanels( props ) {
	return <SchemaPanels { ...props } tab="appearance" />;
}

export default SchemaPanels;
