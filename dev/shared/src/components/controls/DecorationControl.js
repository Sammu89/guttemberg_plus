/**
 * Decoration Control Component
 *
 * Text decoration buttons with inline SVG icons.
 * Options: none, underline, line-through, overline
 *
 * @package
 * @since 1.0.0
 */

import { IconButtonGroup } from './IconButtonGroup';
import sharedTemplates from '../../../../schemas/shared-templates.json';

/**
 * Inline SVG icons for text decorations
 */
const DecorationIcons = {
	/**
	 * None/dash icon
	 */
	none: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<line
				x1="6"
				y1="12"
				x2="18"
				y2="12"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),

	/**
	 * Underline icon
	 */
	underline: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M7 5V11C7 13.7614 9.23858 16 12 16C14.7614 16 17 13.7614 17 11V5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="6"
				y1="19"
				x2="18"
				y2="19"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),

	/**
	 * Line-through / strikethrough icon
	 */
	'line-through': (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<text
				x="12"
				y="16"
				textAnchor="middle"
				fill="currentColor"
				fontSize="14"
				fontWeight="bold"
			>
				S
			</text>
			<line
				x1="5"
				y1="12"
				x2="19"
				y2="12"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),

	/**
	 * Overline icon
	 */
	overline: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<line
				x1="6"
				y1="5"
				x2="18"
				y2="5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<text
				x="12"
				y="18"
				textAnchor="middle"
				fill="currentColor"
				fontSize="12"
				fontWeight="bold"
			>
				T
			</text>
		</svg>
	),
};

/**
 * DecorationControl - Text decoration button selector
 *
 * @param {Object}   props          Component props
 * @param {string}   props.label    Label for the control
 * @param {string}   props.value    Current decoration value
 * @param {Function} props.onChange Callback when value changes
 */
export function DecorationControl( {
	label = 'Text Decoration',
	value = 'none',
	onChange,
} ) {
	const { decorations } = sharedTemplates;
	const commonDecorations = decorations?.common || [];

	/**
	 * Build options array for IconButtonGroup
	 */
	const options = commonDecorations.map( ( decoration ) => ( {
		value: decoration.value,
		label: decoration.name,
		icon: DecorationIcons[ decoration.value ] || DecorationIcons.none,
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

export default DecorationControl;
