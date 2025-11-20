/**
 * Theme Selector Component
 *
 * Dropdown for selecting themes with create/update/delete/rename operations.
 * Shows "(customized)" suffix when block has customizations.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import { SelectControl, Button, Modal, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { debug } from '../utils/debug';

/**
 * Theme Selector Component
 *
 * @param {Object}   props                 Component props
 * @param {string}   props.blockType       Block type: 'accordion', 'tabs', or 'toc'
 * @param {string}   props.currentTheme    Current theme name
 * @param {Function} props.setAttributes   Function to update block attributes
 * @param {boolean}  props.isCustomized    Whether block has customizations
 * @param {Object}   props.themes          All available themes
 * @param {boolean}  props.themesLoaded    Whether themes have been loaded
 * @param {Object}   props.attributes      Block attributes (optional)
 * @param {Object}   props.effectiveValues Effective values from cascade (optional)
 * @param {Function} props.onChange        Callback when theme changes (optional, deprecated)
 * @param {Function} props.onSaveNew       Callback to save as new theme (optional)
 * @param {Function} props.onUpdate        Callback to update current theme (optional)
 * @param {Function} props.onDelete        Callback to delete theme (optional)
 * @param {Function} props.onRename        Callback to rename theme (optional)
 * @param {Function} props.onReset         Callback to reset customizations (optional)
 * @param {Function} props.onThemeChange   Callback when theme changes (handles reset-and-apply) (optional)
 * @param {Object}   props.sessionCache    Session-only cache of customizations per theme (optional)
 */
export function ThemeSelector( {
	blockType,
	currentTheme,
	setAttributes,
	isCustomized,
	themes = {},
	themesLoaded = false,
	attributes = {},
	effectiveValues = {},
	onChange,
	onSaveNew,
	onUpdate,
	onDelete,
	onRename,
	onReset,
	onThemeChange,
	sessionCache = {},
} ) {
	debug( '[DEBUG] ThemeSelector props received:' );
	debug( '  blockType:', blockType );
	debug( '  currentTheme:', currentTheme );
	debug( '  themes:', themes );
	debug( '  onSaveNew type:', typeof onSaveNew );
	debug( '  onUpdate type:', typeof onUpdate );
	debug( '  onDelete type:', typeof onDelete );
	debug( '  onRename type:', typeof onRename );
	debug( '  onReset type:', typeof onReset );

	const [ showCreateModal, setShowCreateModal ] = useState( false );
	const [ showRenameModal, setShowRenameModal ] = useState( false );
	const [ newThemeName, setNewThemeName ] = useState( '' );

	// Log when currentTheme prop changes (for debugging theme switching)
	useEffect( () => {
		debug( '[THEME SELECTOR] currentTheme prop changed to:', currentTheme );
		debug( '[THEME SELECTOR] isCustomized:', isCustomized );
		const dropdownValue = isCustomized
			? currentTheme === ''
				? '::customized'
				: `${ currentTheme }::customized`
			: currentTheme;
		debug( '[THEME SELECTOR] Dropdown will show:', dropdownValue );
	}, [ currentTheme, isCustomized ] );

	// Handle theme change
	const handleThemeChange = ( value ) => {
		// Parse value - might be "themeName" or "themeName::customized"
		const isCustomizedVariant = value.endsWith( '::customized' );
		const themeName = isCustomizedVariant
			? value.replace( '::customized', '' )
			: value;

		// If onThemeChange callback provided, use it (new architecture - session-only cache)
		if ( onThemeChange ) {
			// Pass theme name and flag indicating if user wants customized variant
			onThemeChange( themeName, isCustomizedVariant );
		}
		// Otherwise fall back to simple setAttributes (backwards compatibility)
		else if ( setAttributes ) {
			setAttributes( { currentTheme: themeName } );
		}
		// Deprecated onChange callback
		else if ( onChange ) {
			onChange( themeName );
		}
	};

	// Prepare theme options for dropdown
	// Shows BOTH clean and customized variants when sessionCache exists
	const themeOptions = [];

	// Add Default options
	themeOptions.push( {
		label: 'Default',
		value: '',
	} );

	// If Default has customizations in session cache, add "Default (customized)"
	if ( sessionCache[ '' ] ) {
		themeOptions.push( {
			label: 'Default (customized)',
			value: '::customized', // Special marker for customized Default
		} );
	}

	// Add saved theme options
	Object.keys( themes || {} ).forEach( ( name ) => {
		// Clean theme
		themeOptions.push( {
			label: name,
			value: name,
		} );

		// Customized variant if exists in session cache
		if ( sessionCache[ name ] ) {
			themeOptions.push( {
				label: `${ name } (customized)`,
				value: `${ name }::customized`,
			} );
		}
	} );

	// Determine current dropdown value based on whether using customizations
	const dropdownValue = isCustomized
		? currentTheme === ''
			? '::customized'
			: `${ currentTheme }::customized`
		: currentTheme;

	return (
		<div className="theme-selector">
			<SelectControl
				label="Theme"
				value={ dropdownValue }
				options={ themeOptions }
				onChange={ handleThemeChange }
			/>

			<div className="theme-actions" style={ { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' } }>
				<Button
					variant="secondary"
					onClick={ () => setShowCreateModal( true ) }
					disabled={ ! isCustomized }
				>
					Save as New Theme
				</Button>

				<Button
					variant="secondary"
					onClick={ onUpdate }
					disabled={ ! isCustomized || currentTheme === '' }
				>
					Update Theme
				</Button>

				<Button
					variant="secondary"
					onClick={ () => setShowRenameModal( true ) }
					disabled={ currentTheme === '' }
				>
					Rename Theme
				</Button>

				<Button
					variant="secondary"
					onClick={ onDelete }
					disabled={ currentTheme === '' }
					isDestructive
				>
					Delete Theme
				</Button>

				<Button variant="tertiary" onClick={ onReset } disabled={ ! isCustomized }>
					Reset Modifications
				</Button>
			</div>

			{ showCreateModal && (
				<Modal
					title="Create New Theme"
					onRequestClose={ () => setShowCreateModal( false ) }
				>
					<TextControl
						label="Theme Name"
						value={ newThemeName }
						onChange={ setNewThemeName }
						placeholder="Enter theme name"
					/>
					<Button
						variant="primary"
						onClick={ () => {
							onSaveNew( newThemeName );
							setShowCreateModal( false );
							setNewThemeName( '' );
						} }
					>
						Create Theme
					</Button>
				</Modal>
			) }

			{ showRenameModal && (
				<Modal title="Rename Theme" onRequestClose={ () => setShowRenameModal( false ) }>
					<TextControl
						label="New Theme Name"
						value={ newThemeName }
						onChange={ setNewThemeName }
						placeholder={ currentTheme }
					/>
					<Button
						variant="primary"
						onClick={ () => {
							onRename( currentTheme, newThemeName );
							setShowRenameModal( false );
							setNewThemeName( '' );
						} }
					>
						Rename
					</Button>
				</Modal>
			) }
		</div>
	);
}

export default ThemeSelector;
