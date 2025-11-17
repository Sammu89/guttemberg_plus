/**
 * Tab Panel Block - Registration
 *
 * @package
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
	save: Save,
} );
