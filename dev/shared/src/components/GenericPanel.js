/**
 * Generic Panel Component
 *
 * Schema-driven panel for rendering any group of attributes.
 * Works with any block schema (accordion, tabs, TOC, etc.)
 * Shows ALL attributes in a group, regardless of themeable flag.
 * Uses ControlRenderer for consistent control rendering.
 *
 * Note: The themeable flag is ONLY used for theme mechanics (what gets saved
 * in theme files and customization detection), NOT for UI display.
 *
 * Replaces: HeaderColorsPanel, ContentColorsPanel, TypographyPanel, IconPanel
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

import { PanelBody } from '@wordpress/components';
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { ControlRenderer } from './ControlRenderer';

/**
 * Generic Panel Component
 *
 * Schema-driven panel that renders controls for any attribute group.
 * Filters attributes by group only (shows ALL, themeable or not), then renders appropriate controls.
 *
 * @param {Object}   props                 Component props
 * @param {Object}   props.schema          JSON schema with attribute definitions and groups
 * @param {string}   props.groupId         Group ID to filter attributes (e.g., 'borders', 'colors')
 * @param {Object}   props.attributes      Block attributes
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {Object}   props.effectiveValues All effective values from cascade resolution
 * @param {Object}   props.theme           Current theme object (optional)
 * @param {Object}   props.cssDefaults     CSS default values (optional)
 * @param {boolean}  props.initialOpen     Whether panel is initially open
 * @param {string}   props.title           Panel title override (default: from schema)
 * @param {string}   props.pago            Whether this is a paid feature (optional)
 * @returns {JSX.Element|null} Rendered panel or null if no attributes
 */
export function GenericPanel( {
	schema = {},
	groupId = '',
	attributes = {},
	setAttributes,
	effectiveValues = {},
	theme,
	cssDefaults = {},
	initialOpen = false,
	title,
	pago = 'nao',
} ) {
	// Get theme colors and gradients for color controls
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Validate required props
	if ( ! setAttributes ) {
		return null;
	}

	if ( ! schema || ! groupId ) {
		return null;
	}

	// Get group configuration from schema tabs
	// Find the group by searching through all tabs
	let groupConfig = null;
	if ( schema.tabs && Array.isArray( schema.tabs ) ) {
		for ( const tab of schema.tabs ) {
			if ( tab.groups && Array.isArray( tab.groups ) ) {
				groupConfig = tab.groups.find( ( g ) => g.id === groupId );
				if ( groupConfig ) {
					break;
				}
			}
		}
	}

	// Get group title from schema or use provided title
	const groupTitle = title || groupConfig?.title || groupId;

	// Filter attributes: only those in this group (show ALL, not just themeable)
	// Also filter out attributes with visibleOnSidebar: false
	// Note: themeable flag is ONLY for theme saving/customization warnings, NOT for UI display
	const groupAttributes = Object.entries( schema.attributes || {} )
		.filter( ( [ , attrConfig ] ) => {
			// Must be in this group
			if ( attrConfig.group !== groupId ) {
				return false;
			}
			// Must be visible on sidebar (default: true)
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
			// Sort by order property (if not defined, use 999 to push to end)
			const orderA = a.order !== undefined ? a.order : 999;
			const orderB = b.order !== undefined ? b.order : 999;
			return orderA - orderB;
		} );

	// Return null if no attributes to render
	if ( groupAttributes.length === 0 ) {
		return null;
	}

	// Build panel title with paid indicator if needed
	const panelTitle = pago === 'sim' ? `${ groupTitle } (Pro)` : groupTitle;

	// Track rendered controlIds to avoid duplicate composite controls (e.g., BorderPanel)
	const renderedControlIds = new Set();

	return (
		<PanelBody title={ panelTitle } initialOpen={ initialOpen }>
			{ groupAttributes.map( ( attrConfig ) => {
				// Skip if this controlId was already rendered (for composite controls like BorderPanel)
				if ( attrConfig.controlId ) {
					if ( renderedControlIds.has( attrConfig.controlId ) ) {
						return null;
					}
					renderedControlIds.add( attrConfig.controlId );
				}

				return (
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
						colorGradientSettings={ colorGradientSettings }
					/>
				);
			} ) }
		</PanelBody>
	);
}

export default GenericPanel;
