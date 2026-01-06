/**
 * Schema Panels Component
 *
 * Auto-generates all sidebar panels from schema configuration.
 * Reads schema.groups, sorts by order, and renders appropriate panels.
 * Supports filtering by tab (settings vs appearance) and subgroups.
 *
 * @package
 * @since 1.0.0
 */

import GenericPanel from './GenericPanel';
import SubgroupPanel from './SubgroupPanel';
import { IconPanel } from './controls/IconPanel';

/**
 * Get all groups from schema tabs
 *
 * Extracts and flattens all groups from the tabs array.
 * Each tab contains an array of groups that need to be collected.
 *
 * @param {Array} tabs - Tabs array from schema
 * @return {Array} All groups with their configuration
 */
function getAllGroups( tabs ) {
	if ( ! tabs || ! Array.isArray( tabs ) ) {
		return [];
	}

	const allGroups = [];
	tabs.forEach( ( tab ) => {
		if ( tab.groups && Array.isArray( tab.groups ) ) {
			allGroups.push( ...tab.groups );
		}
	} );

	// Sort by order
	return allGroups.sort( ( a, b ) => {
		const orderA = a.order !== undefined ? a.order : 999;
		const orderB = b.order !== undefined ? b.order : 999;
		return orderA - orderB;
	} );
}

/**
 * Filter groups by tab assignment
 *
 * Gets groups from the specified tab in the tabs array.
 * - 'settings': Structural/behavioral controls
 * - 'appearance': Visual/styling controls
 *
 * @param {Array}  tabs    - Tabs array from schema
 * @param {string} tabName - Tab name to filter by ('settings' or 'appearance')
 * @return {Array} Filtered and sorted array of groups
 */
function filterGroupsByTab( tabs, tabName ) {
	if ( ! tabs || ! Array.isArray( tabs ) ) {
		return [];
	}

	// Find the tab with the matching name
	const tab = tabs.find( ( t ) => t.name === tabName );

	if ( ! tab || ! tab.groups || ! Array.isArray( tab.groups ) ) {
		return [];
	}

	// Return groups from this tab, sorted by order
	return tab.groups.sort( ( a, b ) => {
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
 * @return {boolean} Whether the group has visible attributes
 */
function groupHasAttributes( groupName, schema ) {
	const hasAttrs = Object.values( schema.attributes || {} ).some(
		( attr ) => attr.group === groupName && attr.visibleOnSidebar !== false
	);
	return hasAttrs;
}

/**
 * Schema Panels - Auto-generate all sidebar panels from schema
 *
 * @param {Object}   props                     Component props
 * @param {Object}   props.schema              JSON schema with groups and attributes
 * @param {Object}   props.attributes          Block attributes
 * @param {Function} props.setAttributes       Function to update block attributes
 * @param {Object}   props.effectiveValues     All effective values from cascade resolution
 * @param {Object}   props.theme               Current theme object (optional)
 * @param {Object}   props.cssDefaults         CSS default values (optional)
 * @param {string}   props.tab                 Tab name to filter by (optional)
 * @param {boolean}  props.useSubgroupPanels   Whether to use SubgroupPanel for groups with subgroups
 * @param {Function} props.onIconPreviewChange Optional handler for icon preview state changes
 * @return {JSX.Element|null} Rendered panels or null
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
	onIconPreviewChange,
} ) {
	// Validate required props
	if ( ! setAttributes ) {
		return null;
	}

	if ( ! schema || ! schema.tabs ) {
		return null;
	}

	// Get groups - either filtered by tab or all groups
	let sortedGroups;

	if ( tab ) {
		// Filter groups by tab
		sortedGroups = filterGroupsByTab( schema.tabs, tab );
	} else {
		// Use all groups from all tabs, sorted by order
		sortedGroups = getAllGroups( schema.tabs );
	}

	return (
		<>
			{ sortedGroups.map( ( groupConfig ) => {
				const { id: groupId, initialOpen = false, pago = 'nao', subgroups } = groupConfig;

				// Skip groups with no visible attributes
				if ( ! groupHasAttributes( groupId, schema ) ) {
					return null;
				}

				// Use IconPanel for icon group - provides proper TabPanel UI for icon states
				if ( groupId === 'icon' ) {
					return (
						<IconPanel
							key={ groupId }
							blockType={ schema.blockType || 'accordion' }
							attributes={ attributes }
							setAttributes={ setAttributes }
							effectiveValues={ effectiveValues }
							label={ groupConfig.title || 'Icon' }
							onIconPreviewChange={ onIconPreviewChange }
							canBeResponsive={ false }
							responsiveEnabled={ false }
							onResponsiveToggle={ () => {} }
							onResponsiveReset={ () => {} }
						/>
					);
				}

				// Use SubgroupPanel if group has subgroups and useSubgroupPanels is true
				const hasSubgroups =
					subgroups && Array.isArray( subgroups ) && subgroups.length > 0;

				if ( hasSubgroups && useSubgroupPanels ) {
					return (
						<SubgroupPanel
							key={ groupId }
							groupId={ groupId }
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
						key={ groupId }
						schema={ schema }
						groupId={ groupId }
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
 * @return {JSX.Element|null} Rendered panels for settings tab
 */
export function SettingsPanels( props ) {
	return <SchemaPanels { ...props } tab="settings" />;
}

/**
 * Appearance Panels - Convenience component for appearance tab only
 *
 * @param {Object} props - Same props as SchemaPanels
 * @return {JSX.Element|null} Rendered panels for appearance tab
 */
export function AppearancePanels( props ) {
	return <SchemaPanels { ...props } tab="appearance" />;
}

export default SchemaPanels;
