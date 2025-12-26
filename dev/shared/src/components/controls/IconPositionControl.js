/**
 * Icon Position Control Component
 *
 * Simple two-button selector for icon position: left or right.
 * Uses arrow icons to indicate position.
 *
 * @package
 * @since 1.0.0
 */

import { IconButtonGroup } from './IconButtonGroup';
import sharedTemplates from '../../../../schemas/shared-templates.json';

/**
 * Arrow icons for position indication
 */
const PositionIcons = {
	/**
	 * Left position icon (arrow pointing left)
	 */
	left: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ /* Arrow pointing left */ }
			<path
				d="M15 18L9 12L15 6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{ /* Vertical line representing content */ }
			<line
				x1="18"
				y1="6"
				x2="18"
				y2="18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),

	/**
	 * Right position icon (arrow pointing right)
	 */
	right: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ /* Vertical line representing content */ }
			<line
				x1="6"
				y1="6"
				x2="6"
				y2="18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			{ /* Arrow pointing right */ }
			<path
				d="M9 6L15 12L9 18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
};

/**
 * Alternative icons showing icon placeholder position
 */
const AlternativePositionIcons = {
	/**
	 * Left position - icon on left of text
	 */
	left: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ /* Icon placeholder (square) on the left */ }
			<rect
				x="4"
				y="8"
				width="8"
				height="8"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
			/>
			{ /* Text lines on the right */ }
			<line x1="15" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<line x1="15" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	),

	/**
	 * Right position - icon on right of text
	 */
	right: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ /* Text lines on the left */ }
			<line x1="4" y1="10" x2="9" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			<line x1="4" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			{ /* Icon placeholder (square) on the right */ }
			<rect
				x="12"
				y="8"
				width="8"
				height="8"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
			/>
		</svg>
	),
};

/**
 * IconPositionControl - Icon position selector (left/right)
 *
 * @param {Object}   props              Component props
 * @param {string}   props.label        Label for the control
 * @param {string}   props.value        Current position value ('left' or 'right')
 * @param {Function} props.onChange     Callback when value changes
 * @param {boolean}  props.useAltIcons  Use alternative icons showing placeholder layout
 */
export function IconPositionControl( {
	label = 'Icon Position',
	value = 'left',
	onChange,
	useAltIcons = true,
} ) {
	const { iconPositions } = sharedTemplates;
	const positionOptions = iconPositions?.options || [
		{ name: 'Left', value: 'left' },
		{ name: 'Right', value: 'right' },
	];

	const icons = useAltIcons ? AlternativePositionIcons : PositionIcons;

	/**
	 * Build options array for IconButtonGroup
	 */
	const options = positionOptions.map( ( position ) => ( {
		value: position.value,
		label: position.name,
		icon: icons[ position.value ] || icons.left,
	} ) );

	return (
		<IconButtonGroup
			label={ label }
			value={ value }
			onChange={ onChange }
			options={ options }
			allowWrap={ false }
		/>
	);
}

export default IconPositionControl;
