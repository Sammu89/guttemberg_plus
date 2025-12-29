/**
 * Font Family Control Component
 *
 * Font family picker with optgroups for System and Google fonts.
 * Includes font preview styling in the dropdown options.
 *
 * @package
 * @since 1.0.0
 */

import { SelectControl, BaseControl } from '@wordpress/components';
import sharedTemplates from '../../../../schemas/shared-templates.json';

/**
 * FontFamilyControl - Font family selector with grouped options
 *
 * @param {Object}   props          Component props
 * @param {string}   props.label    Label for the control
 * @param {string}   props.value    Current font family value
 * @param {Function} props.onChange Callback when value changes
 * @param {string}   props.help     Optional help text
 */
export function FontFamilyControl( {
	label = 'Font Family',
	value = '',
	onChange,
	help = '',
} ) {
	const { fontFamilies } = sharedTemplates;
	const systemFonts = fontFamilies?.system || [];
	const googleFonts = fontFamilies?.google || [];

	/**
	 * Build options with optgroups structure
	 * SelectControl doesn't support native optgroups, so we use disabled options as headers
	 */
	const options = [
		{ value: '', label: 'Select a font...' },
		{ value: '__system_header__', label: '--- System Fonts ---', disabled: true },
		...systemFonts.map( ( font ) => ( {
			value: font.value,
			label: font.name,
		} ) ),
		{ value: '__google_header__', label: '--- Google Fonts ---', disabled: true },
		...googleFonts.map( ( font ) => ( {
			value: font.value,
			label: font.name,
		} ) ),
	];

	/**
	 * Handle change, filtering out header options
	 */
	const handleChange = ( newValue ) => {
		if ( ! newValue.startsWith( '__' ) ) {
			onChange( newValue );
		}
	};

	return (
		<BaseControl className="gutplus-font-family-control">
			<SelectControl
				label={ label }
				value={ value }
				options={ options }
				onChange={ handleChange }
				help={ help }
				__nextHasNoMarginBottom
			/>
		</BaseControl>
	);
}

export default FontFamilyControl;
