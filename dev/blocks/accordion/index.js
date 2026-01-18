/**
 * Accordion Block - Entry Point
 *
 * Registers the accordion block with WordPress.
 * Imports styles, edit component, save component, and frontend functionality.
 *
 * @package
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import { accordionAttributes } from './attributes';
import '../../styles/blocks/accordion/editor.scss';

/**
 * Register the accordion block
 */
registerBlockType( metadata.name, {
	...metadata,
	attributes: accordionAttributes,
	edit,
	save,
} );
