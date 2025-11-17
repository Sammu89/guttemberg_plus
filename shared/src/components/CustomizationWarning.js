/**
 * Customization Warning Component
 *
 * Warning message when switching themes with active customizations.
 * Helps users understand they'll lose customizations.
 *
 * @see docs/UI-UX/40-EDITOR-UI-PANELS.md
 * @package
 * @since 1.0.0
 */

import { Notice } from '@wordpress/components';
import { debug } from '../utils/debug';

/**
 * Customization Warning Component
 *
 * @param {Object} props              Component props
 * @param {string} props.currentTheme Current theme name
 * @param {Object} props.themes       All available themes
 */
export function CustomizationWarning( { currentTheme, themes = {} } ) {
	// Get the current theme object with null check
	const theme =
		themes && themes[ currentTheme ] ? themes[ currentTheme ] : null;
	debug( '[DEBUG] CustomizationWarning - currentTheme:', currentTheme );
	debug( '[DEBUG] CustomizationWarning - themes:', themes );
	debug( '[DEBUG] CustomizationWarning - theme object:', theme );
	debug( '[DEBUG] CustomizationWarning - theme?.name:', theme?.name );
	const themeName = theme?.name || currentTheme || 'Default';
	debug( '[DEBUG] CustomizationWarning - final themeName:', themeName );

	return (
		<Notice status="warning" isDismissible={ false }>
			<p>
				<strong>Notice:</strong> This block has customizations applied.
			</p>
			<p>
				You are currently using the "{ themeName }" theme with custom
				modifications. These customizations take precedence over the
				theme defaults.
			</p>
			<p>
				To save your customizations permanently, use the "Save as New
				Theme" or "Update Theme" buttons. To remove customizations and
				revert to the theme defaults, use the "Reset Modifications"
				button.
			</p>
		</Notice>
	);
}

export default CustomizationWarning;
