/**
 * Batch Block Updater
 *
 * Utilities for finding and updating multiple blocks on the current page
 * when themes are updated or deleted. This enables automatic propagation
 * of theme changes to all "clean" blocks (blocks without customizations).
 *
 * @package
 * @since 1.0.0
 */

import { select, dispatch } from '@wordpress/data';
import { flushSync } from 'react-dom';
import { debug } from './debug';

/**
 * Find all blocks of a specific type on the current page
 *
 * @param {Array}    blocks    - Array of blocks to search (from getBlocks())
 * @param {string}   blockType - Block type to find (e.g., 'accordion', 'tabs', 'toc')
 * @param {Function} filterFn  - Optional filter function(block) => boolean
 * @return {Array} Array of { clientId, attributes } objects
 */
function findBlocks( blocks, blockType, filterFn = null ) {
	const found = [];

	function search( blockList ) {
		blockList.forEach( ( block ) => {
			// Check if it's the right block type
			if ( block.name === `custom/${ blockType }` ) {
				// Apply filter if provided
				if ( ! filterFn || filterFn( block ) ) {
					found.push( {
						clientId: block.clientId,
						attributes: block.attributes,
					} );
				}
			}

			// Recursively search inner blocks
			if ( block.innerBlocks?.length > 0 ) {
				search( block.innerBlocks );
			}
		} );
	}

	search( blocks );
	return found;
}

/**
 * Find all blocks using a specific theme on the current page
 *
 * @param {string}  blockType - Block type ('accordion', 'tabs', 'toc')
 * @param {string}  themeName - Theme name to search for
 * @param {boolean} cleanOnly - If true, only return blocks without customizations
 * @return {Array} Array of { clientId, attributes } objects
 */
export function findBlocksUsingTheme( blockType, themeName, cleanOnly = false ) {
	const blocks = select( 'core/block-editor' ).getBlocks();

	return findBlocks( blocks, blockType, ( block ) => {
		const attrs = block.attributes || {};

		// Must be using this theme
		if ( attrs.currentTheme !== themeName ) {
			return false;
		}

		// If cleanOnly, check customizations attribute
		if ( cleanOnly ) {
			const customizations = attrs.customizations || {};
			const isClean = Object.keys( customizations ).length === 0;
			return isClean;
		}

		return true;
	} );
}

/**
 * Update clean blocks with new theme values
 *
 * When a theme is updated, this function finds all "clean" blocks using that theme
 * (blocks with empty customizations object) and updates them with the new theme values.
 *
 * @param {string} blockType      - Block type ('accordion', 'tabs', 'toc')
 * @param {string} themeName      - Theme name that was updated
 * @param {Object} newThemeValues - New complete values (defaults + theme deltas)
 * @param {Array}  excludeKeys    - Keys to exclude from updates (IDs, meta, etc.)
 * @return {number} Number of blocks updated
 */
export function batchUpdateCleanBlocks( blockType, themeName, newThemeValues, excludeKeys = [] ) {
	// Find all clean blocks using this theme
	const blocksToUpdate = findBlocksUsingTheme( blockType, themeName, true );

	if ( blocksToUpdate.length === 0 ) {
		return 0;
	}

	// Update each block
	blocksToUpdate.forEach( ( { clientId, attributes } ) => {
		const updateAttrs = {};

		// Apply new theme values
		Object.keys( newThemeValues ).forEach( ( key ) => {
			// Skip excluded keys
			if ( excludeKeys.includes( key ) ) {
				return;
			}

			// Only update if value changed
			if ( attributes[ key ] !== newThemeValues[ key ] ) {
				updateAttrs[ key ] = newThemeValues[ key ];
			}
		} );

		// Ensure customizations stays empty (it's a clean block)
		updateAttrs.customizations = {};

		// Update the block
		if ( Object.keys( updateAttrs ).length > 0 ) {
			dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, updateAttrs );
		}
	} );

	return blocksToUpdate.length;
}

/**
 * Reset all blocks using a deleted theme
 *
 * When a theme is deleted, this function finds all blocks using that theme
 * and resets them to defaults.
 *
 * @param {string} blockType   - Block type ('accordion', 'tabs', 'toc')
 * @param {string} themeName   - Theme name that was deleted
 * @param {Object} defaults    - Default values to apply
 * @param {Array}  excludeKeys - Keys to exclude from reset (IDs, meta, etc.)
 * @return {number} Number of blocks reset
 */
export function batchResetBlocksUsingTheme( blockType, themeName, defaults, excludeKeys = [] ) {
	// Find ALL blocks using this theme (clean or customized)
	const blocksToReset = findBlocksUsingTheme( blockType, themeName, false );

	if ( blocksToReset.length === 0 ) {
		return 0;
	}

	// Reset each block to defaults
	blocksToReset.forEach( ( { clientId } ) => {
		const resetAttrs = { ...defaults };

		// Remove excluded keys
		excludeKeys.forEach( ( key ) => {
			if ( key !== 'currentTheme' && key !== 'customizations' ) {
				delete resetAttrs[ key ];
			}
		} );

		// Reset theme to Default
		resetAttrs.currentTheme = '';
		resetAttrs.customizations = {};

		dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, resetAttrs );
	} );

	return blocksToReset.length;
}

/**
 * Show notification about batch operation results
 *
 * @param {string} operation - Operation type ('update' or 'delete')
 * @param {string} themeName - Theme name
 * @param {number} count     - Number of blocks affected
 */
export function showBatchUpdateNotification( operation, themeName, count ) {
	const { createSuccessNotice } = dispatch( 'core/notices' );

	if ( count === 0 ) {
		return;
	}

	let message;
	if ( operation === 'update' ) {
		message = `Updated theme "${ themeName }" and applied changes to ${ count } block(s) on this page.`;
	} else if ( operation === 'delete' ) {
		message = `Deleted theme "${ themeName }" and reset ${ count } block(s) to defaults.`;
	}

	createSuccessNotice( message, {
		type: 'snackbar',
		isDismissible: true,
	} );
}
