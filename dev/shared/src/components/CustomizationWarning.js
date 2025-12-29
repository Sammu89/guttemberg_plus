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

/**
 * Customization Warning Component
 *
 * @param {Object} props              Component props
 * @param {string} props.currentTheme Current theme name
 * @param {Object} props.themes       All available themes
 */
export function CustomizationWarning( { currentTheme, themes = {} } ) {
	// Get the current theme object with null check
	const theme = themes && themes[ currentTheme ] ? themes[ currentTheme ] : null;
	const themeName = theme?.name || currentTheme || 'Default';
	const isDefaultTheme = themeName === 'Default' || currentTheme === '';

	return (
		<Notice status="warning" isDismissible={ false } style={ { marginTop: '50px', marginBottom: '50px' } }>
			<p>
				<strong>Note:</strong> This block has custom modifications.
			</p>
			{ isDefaultTheme ? (
				<>
					<p>
						<strong>Default</strong> theme cannot be changed.
					</p>
					<p>
						To keep your customizations permanently and reuse them across multiple blocks, use <strong>Save as New Theme</strong>.
					</p>
					<p>
						To remove all changes and return to the original <strong>Default</strong> settings, use <strong>Reset Modifications</strong>.
					</p>
				</>
			) : (
				<>
					<p>
						You're currently using <strong>{ themeName }</strong> with changes applied specifically to this block. If you update <strong>{ themeName }</strong>, any parts of the theme that aren't overridden by your customizations will change accordingly.
					</p>
					<p>
						To keep your customizations permanently and reuse them across multiple blocks, use <strong>Save as New Theme</strong> or <strong>Update Theme</strong>.
					</p>
					<p>
						To remove all changes and return to the original <strong>{ themeName }</strong> settings, use <strong>Reset Modifications</strong>.
					</p>
				</>
			) }
		</Notice>
	);
}

export default CustomizationWarning;
