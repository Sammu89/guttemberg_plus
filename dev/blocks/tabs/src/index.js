/**
 * Tabs Block - Entry Point
 *
 * Registers the tabs block with WordPress.
 * Imports styles, edit component, save component, and frontend functionality.
 *
 * @package
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import edit from './edit';
import save from './save';
import { tabsAttributes } from './tabs-attributes';
import './editor.scss';

// Register the tab-panel child block
import './tab-panel';

/**
 * Register the tabs block
 *
 * NOTE: We intentionally override block.json attributes with tabsAttributes.
 * This is because:
 * - block.json contains a minimal set of attributes for basic structure
 * - tabsAttributes includes 52+ attributes from shared cascade system
 * - The full attribute set is dynamically composed from shared modules
 * - This pattern allows for better code organization and reuse
 */
registerBlockType( metadata.name, {
	...metadata,
	attributes: tabsAttributes, // Override: Full attribute set with shared attributes
	edit,
	save,
} );
