/**
 * Letter Case Control Component
 *
 * Text transform buttons with text-based display.
 * Options: none (-), uppercase (AB), lowercase (ab), capitalize (Ab)
 *
 * @package
 * @since 1.0.0
 */

import { IconButtonGroup } from './IconButtonGroup';
import sharedTemplates from '../../../schemas/shared-templates.json';

/**
 * Create text-based icon components for letter case options
 */
const LetterCaseIcons = {
	/**
	 * None icon (dash)
	 */
	none: (
		<span
			style={ {
				fontSize: '14px',
				fontWeight: '600',
				lineHeight: '1',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '24px',
				height: '24px',
			} }
		>
			--
		</span>
	),

	/**
	 * Uppercase icon (AB)
	 */
	uppercase: (
		<span
			style={ {
				fontSize: '12px',
				fontWeight: '700',
				lineHeight: '1',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '24px',
				height: '24px',
				textTransform: 'uppercase',
			} }
		>
			AB
		</span>
	),

	/**
	 * Lowercase icon (ab)
	 */
	lowercase: (
		<span
			style={ {
				fontSize: '12px',
				fontWeight: '700',
				lineHeight: '1',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '24px',
				height: '24px',
				textTransform: 'lowercase',
			} }
		>
			ab
		</span>
	),

	/**
	 * Capitalize icon (Ab)
	 */
	capitalize: (
		<span
			style={ {
				fontSize: '12px',
				fontWeight: '700',
				lineHeight: '1',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '24px',
				height: '24px',
			} }
		>
			Ab
		</span>
	),
};

/**
 * LetterCaseControl - Text transform button selector
 *
 * @param {Object}   props          Component props
 * @param {string}   props.label    Label for the control
 * @param {string}   props.value    Current text-transform value
 * @param {Function} props.onChange Callback when value changes
 */
export function LetterCaseControl( { label = 'Letter Case', value = 'none', onChange } ) {
	const { letterCase } = sharedTemplates;
	const caseOptions = letterCase?.options || [];

	/**
	 * Build options array for IconButtonGroup
	 */
	const options = caseOptions.map( ( option ) => ( {
		value: option.value,
		label: option.name,
		icon: LetterCaseIcons[ option.value ] || LetterCaseIcons.none,
	} ) );

	return (
		<IconButtonGroup
			label={ label }
			value={ value }
			onChange={ onChange }
			options={ options }
		/>
	);
}

export default LetterCaseControl;
