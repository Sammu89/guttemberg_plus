/**
 * Appearance Control Component
 *
 * Font weight + style combined selector using SelectControl dropdown.
 * Returns an object with { weight, style } properties.
 *
 * @package
 * @since 1.0.0
 */

import { SelectControl } from '@wordpress/components';
import sharedTemplates from '../../../../schemas/shared-templates.json';

/**
 * AppearanceControl - Combined font weight and style selector
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses an OBJECT pattern (compound value).
 *
 * VALUE PROP:
 * -----------
 * value prop structure:
 *   {
 *     weight: "400",   // string
 *     style: "normal"  // string ("normal" or "italic")
 *   }
 *
 * onChange callback signature:
 *   onChange(newValue)
 *   - newValue: object { weight, style }
 *
 * NOT RESPONSIVE:
 * ---------------
 * AppearanceControl does NOT handle responsive values internally.
 * Parent controls must switch values per device if needed.
 *
 * ============================================================================
 *
 * @param {Object}   props          Component props
 * @param {string}   props.label    Label for the control
 * @param {Object}   props.value    Current value { weight: string, style: string }
 * @param {Function} props.onChange Callback when value changes, receives { weight, style }
 * @param {string}   props.help     Optional help text
 */
export function AppearanceControl( {
	label = 'Appearance',
	value = { weight: 'normal', style: 'normal' },
	onChange,
	help = '',
} ) {
	const { appearance } = sharedTemplates;
	const presets = appearance?.presets || [];

	/**
	 * Build a unique key from weight and style for comparison
	 * @param weight
	 * @param style
	 */
	const buildKey = ( weight, style ) => `${ weight }-${ style }`;

	/**
	 * Get the current selected key based on value
	 */
	const getCurrentKey = () => {
		const currentWeight = value?.weight || 'normal';
		const currentStyle = value?.style || 'normal';
		return buildKey( currentWeight, currentStyle );
	};

	/**
	 * Convert presets to SelectControl options
	 */
	const options = presets.map( ( preset ) => ( {
		label: preset.name,
		value: buildKey( preset.weight, preset.style ),
	} ) );

	/**
	 * Handle selection change
	 * @param selectedKey
	 */
	const handleChange = ( selectedKey ) => {
		const selected = presets.find(
			( preset ) => buildKey( preset.weight, preset.style ) === selectedKey
		);

		if ( selected ) {
			onChange( {
				weight: selected.weight,
				style: selected.style,
			} );
		}
	};

	return (
		<SelectControl
			label={ label }
			value={ getCurrentKey() }
			options={ options }
			onChange={ handleChange }
			help={ help }
			__nextHasNoMarginBottom
		/>
	);
}

export default AppearanceControl;
