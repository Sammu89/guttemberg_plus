/**
 * Theme Manager
 *
 * Thin convenience wrapper over WordPress Data Store
 * for easier theme operations across all block types.
 *
 * Provides a clean API for theme CRUD operations without
 * requiring direct knowledge of the store structure.
 *
 * @see docs/CORE-ARCHITECTURE/12-THEME-SYSTEM.md
 * @package
 * @since 1.0.0
 */

import { dispatch, select } from '@wordpress/data';
import { STORE_NAME } from '../data';

/**
 * Get theme manager for a specific block type
 *
 * Returns an object with bound methods for theme operations.
 * All methods return promises for async operations.
 *
 * @param {string} blockType - 'accordion', 'tabs', or 'toc'
 * @return {Object} Theme manager instance with methods
 *
 * @example
 * const manager = getThemeManager('accordion');
 * const themes = await manager.list();
 * await manager.create('Dark Mode', values);
 */
export function getThemeManager( blockType ) {
	// Validate block type
	if ( ! [ 'accordion', 'tabs', 'toc' ].includes( blockType ) ) {
		throw new Error(
			`Invalid block type: ${ blockType }. Must be 'accordion', 'tabs', or 'toc'.`
		);
	}

	return {
		/**
		 * List all themes for this block type
		 *
		 * @return {Promise<Object>} Themes object { themeName: themeData }
		 */
		async list() {
			// Load themes if not already loaded
			await dispatch( STORE_NAME ).loadThemes( blockType );

			// Return themes from store
			return select( STORE_NAME ).getThemes( blockType );
		},

		/**
		 * Get a specific theme by name
		 *
		 * @param {string} name - Theme name to retrieve
		 * @return {Promise<Object|null>} Theme object or null if not found
		 */
		async get( name ) {
			// Ensure themes are loaded
			await dispatch( STORE_NAME ).loadThemes( blockType );

			// Return specific theme
			return select( STORE_NAME ).getTheme( blockType, name );
		},

		/**
		 * Create a new theme
		 *
		 * @param {string} name   - Theme name (must be unique)
		 * @param {Object} values - Complete snapshot of all attribute values
		 * @return {Promise<Object>} Created theme object
		 * @throws {Error} If theme name already exists or validation fails
		 */
		async create( name, values ) {
			// Validate inputs
			if ( ! name || typeof name !== 'string' ) {
				throw new Error(
					'Theme name is required and must be a string.'
				);
			}

			if ( ! values || typeof values !== 'object' ) {
				throw new Error(
					'Theme values are required and must be an object.'
				);
			}

			// Check if theme already exists
			const exists = select( STORE_NAME ).hasTheme( blockType, name );
			if ( exists ) {
				throw new Error(
					`Theme "${ name }" already exists for ${ blockType }.`
				);
			}

			// Create theme via store
			return await dispatch( STORE_NAME ).createTheme(
				blockType,
				name,
				values
			);
		},

		/**
		 * Update an existing theme
		 *
		 * @param {string} name   - Theme name to update
		 * @param {Object} values - New complete snapshot of values
		 * @return {Promise<Object>} Updated theme object
		 * @throws {Error} If theme doesn't exist
		 */
		async update( name, values ) {
			// Validate inputs
			if ( ! name || typeof name !== 'string' ) {
				throw new Error(
					'Theme name is required and must be a string.'
				);
			}

			if ( ! values || typeof values !== 'object' ) {
				throw new Error(
					'Theme values are required and must be an object.'
				);
			}

			// Check if theme exists
			const exists = select( STORE_NAME ).hasTheme( blockType, name );
			if ( ! exists ) {
				throw new Error(
					`Theme "${ name }" does not exist for ${ blockType }.`
				);
			}

			// Update theme via store
			return await dispatch( STORE_NAME ).updateTheme(
				blockType,
				name,
				values
			);
		},

		/**
		 * Delete a theme
		 *
		 * @param {string} name - Theme name to delete
		 * @return {Promise<void>}
		 * @throws {Error} If theme doesn't exist or is "Default"
		 */
		async delete( name ) {
			// Validate input
			if ( ! name || typeof name !== 'string' ) {
				throw new Error(
					'Theme name is required and must be a string.'
				);
			}

			// Prevent deletion of Default theme
			if ( name.toLowerCase() === 'default' ) {
				throw new Error( 'Cannot delete the Default theme.' );
			}

			// Check if theme exists
			const exists = select( STORE_NAME ).hasTheme( blockType, name );
			if ( ! exists ) {
				throw new Error(
					`Theme "${ name }" does not exist for ${ blockType }.`
				);
			}

			// Delete theme via store
			await dispatch( STORE_NAME ).deleteTheme( blockType, name );
		},

		/**
		 * Rename a theme
		 *
		 * @param {string} oldName - Current theme name
		 * @param {string} newName - New theme name (must be unique)
		 * @return {Promise<void>}
		 * @throws {Error} If old theme doesn't exist or new name already exists
		 */
		async rename( oldName, newName ) {
			// Validate inputs
			if ( ! oldName || typeof oldName !== 'string' ) {
				throw new Error(
					'Old theme name is required and must be a string.'
				);
			}

			if ( ! newName || typeof newName !== 'string' ) {
				throw new Error(
					'New theme name is required and must be a string.'
				);
			}

			// Prevent renaming Default theme
			if ( oldName.toLowerCase() === 'default' ) {
				throw new Error( 'Cannot rename the Default theme.' );
			}

			// Prevent renaming to Default
			if ( newName.toLowerCase() === 'default' ) {
				throw new Error( 'Cannot rename a theme to "Default".' );
			}

			// Check if old theme exists
			const oldExists = select( STORE_NAME ).hasTheme(
				blockType,
				oldName
			);
			if ( ! oldExists ) {
				throw new Error(
					`Theme "${ oldName }" does not exist for ${ blockType }.`
				);
			}

			// Check if new name already exists
			const newExists = select( STORE_NAME ).hasTheme(
				blockType,
				newName
			);
			if ( newExists ) {
				throw new Error(
					`Theme "${ newName }" already exists for ${ blockType }.`
				);
			}

			// Rename theme via store
			await dispatch( STORE_NAME ).renameTheme(
				blockType,
				oldName,
				newName
			);
		},

		/**
		 * Check if a theme exists
		 *
		 * @param {string} name - Theme name to check
		 * @return {Promise<boolean>} True if theme exists
		 */
		async exists( name ) {
			// Ensure themes are loaded
			await dispatch( STORE_NAME ).loadThemes( blockType );

			// Check existence
			return select( STORE_NAME ).hasTheme( blockType, name );
		},
	};
}

/**
 * Export default for convenience
 */
export default getThemeManager;
