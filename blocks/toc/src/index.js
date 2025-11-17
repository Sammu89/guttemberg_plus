/**
 * TOC Block - Entry Point
 *
 * Registers the table of contents block with WordPress.
 * Imports styles, edit component, save component, and frontend functionality.
 *
 * @package
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import edit from './edit';
import save from './save';
import { tocAttributes } from './toc-attributes';
import './frontend';
import '../../../assets/css/toc.css';

/**
 * Register the TOC block
 */
registerBlockType( metadata.name, {
	...metadata,
	attributes: tocAttributes,
	edit,
	save,
} );
