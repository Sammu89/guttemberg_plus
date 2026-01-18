/**
 * HeadingLevelControl - Full Control
 *
 * Icon button group for selecting heading level (H1-H6 or None).
 *
 * @package
 */

import { BaseControl, ButtonGroup, Button } from '@wordpress/components';

// Heading level icons as inline SVGs
const headingIcons = {
	none: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
			<line
				x1="5"
				y1="5"
				x2="15"
				y2="15"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	h1: (
		<svg width="24" height="20" viewBox="0 0 24 20" fill="none">
			<text
				x="12"
				y="15"
				textAnchor="middle"
				fontSize="12"
				fill="currentColor"
				fontWeight="700"
			>
				H1
			</text>
		</svg>
	),
	h2: (
		<svg width="24" height="20" viewBox="0 0 24 20" fill="none">
			<text
				x="12"
				y="15"
				textAnchor="middle"
				fontSize="12"
				fill="currentColor"
				fontWeight="700"
			>
				H2
			</text>
		</svg>
	),
	h3: (
		<svg width="24" height="20" viewBox="0 0 24 20" fill="none">
			<text
				x="12"
				y="15"
				textAnchor="middle"
				fontSize="12"
				fill="currentColor"
				fontWeight="700"
			>
				H3
			</text>
		</svg>
	),
	h4: (
		<svg width="24" height="20" viewBox="0 0 24 20" fill="none">
			<text
				x="12"
				y="15"
				textAnchor="middle"
				fontSize="12"
				fill="currentColor"
				fontWeight="700"
			>
				H4
			</text>
		</svg>
	),
	h5: (
		<svg width="24" height="20" viewBox="0 0 24 20" fill="none">
			<text
				x="12"
				y="15"
				textAnchor="middle"
				fontSize="12"
				fill="currentColor"
				fontWeight="700"
			>
				H5
			</text>
		</svg>
	),
	h6: (
		<svg width="24" height="20" viewBox="0 0 24 20" fill="none">
			<text
				x="12"
				y="15"
				textAnchor="middle"
				fontSize="12"
				fill="currentColor"
				fontWeight="700"
			>
				H6
			</text>
		</svg>
	),
};

const headingOptions = [
	{ value: 'none', label: 'Paragraph' },
	{ value: 'h1', label: 'Heading 1' },
	{ value: 'h2', label: 'Heading 2' },
	{ value: 'h3', label: 'Heading 3' },
	{ value: 'h4', label: 'Heading 4' },
	{ value: 'h5', label: 'Heading 5' },
	{ value: 'h6', label: 'Heading 6' },
];

/**
 * HeadingLevelControl Component
 *
 * @param {Object}   props
 * @param {string}   props.label    - Control label
 * @param {string}   props.value    - Current heading level (none, h1-h6)
 * @param {Function} props.onChange - Change handler
 * @param {boolean}  props.disabled - Disabled state
 */
export function HeadingLevelControl( {
	label = 'Heading Level',
	value = 'none',
	onChange,
	disabled = false,
} ) {
	return (
		<BaseControl
			label={ label }
			className="gutplus-heading-level-control"
			__nextHasNoMarginBottom
		>
			<ButtonGroup className="gutplus-heading-level-control__buttons">
				{ headingOptions.map( ( option ) => (
					<Button
						key={ option.value }
						className={ `gutplus-heading-level-control__button ${
							value === option.value ? 'is-selected' : ''
						}` }
						isPressed={ value === option.value }
						onClick={ () => onChange( option.value ) }
						disabled={ disabled }
						label={ option.label }
						showTooltip
					>
						{ headingIcons[ option.value ] }
					</Button>
				) ) }
			</ButtonGroup>
		</BaseControl>
	);
}

export default HeadingLevelControl;
