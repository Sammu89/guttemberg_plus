/**
 * Subgroup Panel Component
 *
 * Panel with subgroup selector (radio-style section switcher).
 * Only shows controls belonging to the currently selected subgroup.
 * Provides a clean way to organize complex panels with many controls.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { useState } from '@wordpress/element';
import {
	PanelBody,
	ButtonGroup,
	Button,
	Dropdown,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { moreVertical, check } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
import { ControlRenderer } from './ControlRenderer';

/**
 * Subgroup Selector Component
 *
 * Radio-style button group for selecting subgroups.
 *
 * @param {Object}   props              Component props
 * @param {Array}    props.subgroups    Array of subgroup names
 * @param {string}   props.selected     Currently selected subgroup
 * @param {Function} props.onSelect     Callback when subgroup is selected
 * @param {boolean}  props.useDropdown  Whether to use dropdown instead of buttons
 * @returns {JSX.Element} Subgroup selector
 */
function SubgroupSelector( { subgroups, selected, onSelect, useDropdown = false } ) {
	if ( ! subgroups || subgroups.length <= 1 ) {
		return null;
	}

	// Dropdown variant for many subgroups or compact display
	if ( useDropdown ) {
		return (
			<div
				className="gutplus-subgroup-selector gutplus-subgroup-selector--dropdown"
				style={ { marginBottom: '16px' } }
			>
				<Dropdown
					popoverProps={ { placement: 'bottom-start' } }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							variant="secondary"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							style={ {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: '100%',
							} }
						>
							<span>{ selected || subgroups[ 0 ] }</span>
							<Icon icon={ moreVertical } size={ 16 } />
						</Button>
					) }
					renderContent={ ( { onClose } ) => (
						<MenuGroup>
							{ subgroups.map( ( subgroup ) => (
								<MenuItem
									key={ subgroup }
									onClick={ () => {
										onSelect( subgroup );
										onClose();
									} }
									isSelected={ subgroup === selected }
									icon={ subgroup === selected ? check : undefined }
								>
									{ subgroup }
								</MenuItem>
							) ) }
						</MenuGroup>
					) }
				/>
			</div>
		);
	}

	// Button group variant (default)
	return (
		<div
			className="gutplus-subgroup-selector"
			style={ { marginBottom: '16px' } }
		>
			<ButtonGroup
				style={ {
					display: 'flex',
					width: '100%',
					gap: '2px',
				} }
			>
				{ subgroups.map( ( subgroup ) => (
					<Button
						key={ subgroup }
						variant={ subgroup === selected ? 'primary' : 'secondary' }
						onClick={ () => onSelect( subgroup ) }
						style={ {
							flex: 1,
							justifyContent: 'center',
						} }
					>
						{ subgroup }
					</Button>
				) ) }
			</ButtonGroup>
		</div>
	);
}

/**
 * Subgroup Panel Component
 *
 * A panel that organizes controls into subgroups with a selector.
 *
 * @param {Object}   props                 Component props
 * @param {string}   props.groupName       Name of the group
 * @param {Object}   props.groupConfig     Group configuration with subgroups array
 * @param {Object}   props.schema          Full schema object
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {Object}   props.effectiveValues All effective values from cascade resolution
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 * @param {boolean}  props.useDropdown     Whether to use dropdown selector
 * @returns {JSX.Element|null} Rendered panel or null
 */
export function SubgroupPanel( {
	groupName,
	groupConfig,
	schema,
	attributes,
	setAttributes,
	effectiveValues = {},
	theme,
	cssDefaults = {},
	initialOpen = false,
	useDropdown = false,
} ) {
	// Get subgroups from group config
	const subgroups = groupConfig?.subgroups || [];
	const groupTitle = groupConfig?.title || groupName;

	// Track selected subgroup (default to first)
	const [ selectedSubgroup, setSelectedSubgroup ] = useState(
		subgroups[ 0 ] || null
	);

	// Validate required props
	if ( ! setAttributes ) {
		console.warn( '[SubgroupPanel] Missing required prop: setAttributes' );
		return null;
	}

	if ( ! schema || ! groupName ) {
		return null;
	}

	// Filter attributes for this group
	const groupAttributes = Object.entries( schema.attributes || {} )
		.filter( ( [ , attrConfig ] ) => attrConfig.group === groupName )
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

	// If no subgroups defined, render all attributes
	const hasSubgroups = subgroups.length > 0;

	// Filter attributes by selected subgroup
	const filteredAttributes = hasSubgroups
		? groupAttributes.filter( ( attr ) => {
				// If attribute has no subgroup, show in all subgroups
				if ( ! attr.subgroup ) {
					return true;
				}
				return attr.subgroup === selectedSubgroup;
		  } )
		: groupAttributes;

	// If no attributes for this subgroup, show empty message
	if ( filteredAttributes.length === 0 && hasSubgroups ) {
		return (
			<PanelBody title={ groupTitle } initialOpen={ initialOpen }>
				<SubgroupSelector
					subgroups={ subgroups }
					selected={ selectedSubgroup }
					onSelect={ setSelectedSubgroup }
					useDropdown={ useDropdown || subgroups.length > 4 }
				/>
				<p style={ { color: '#757575', fontSize: '12px' } }>
					No controls available for this section.
				</p>
			</PanelBody>
		);
	}

	return (
		<PanelBody title={ groupTitle } initialOpen={ initialOpen }>
			{ /* Subgroup selector */ }
			{ hasSubgroups && (
				<SubgroupSelector
					subgroups={ subgroups }
					selected={ selectedSubgroup }
					onSelect={ setSelectedSubgroup }
					useDropdown={ useDropdown || subgroups.length > 4 }
				/>
			) }

			{ /* Render controls for selected subgroup */ }
			{ filteredAttributes.map( ( attrConfig ) => (
				<ControlRenderer
					key={ attrConfig.name }
					attrName={ attrConfig.name }
					attrConfig={ attrConfig }
					attributes={ attributes }
					setAttributes={ setAttributes }
					effectiveValues={ effectiveValues }
					schema={ schema }
					theme={ theme }
					cssDefaults={ cssDefaults }
				/>
			) ) }
		</PanelBody>
	);
}

export default SubgroupPanel;
