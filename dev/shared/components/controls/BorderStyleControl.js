/**
 * Border Style Control Component
 *
 * 7 icon buttons for border style selection: none, solid, dashed,
 * dotted, double, groove, ridge. Each icon is an inline SVG component.
 *
 * @package
 * @since 1.0.0
 */

import { IconButtonGroup } from './IconButtonGroup';

/**
 * Border Style Icons
 *
 * Inline SVG icons representing each border style.
 * All icons are 24x24 viewBox for consistent sizing.
 */

/**
 * None icon - crossed out box
 */
const NoneIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
	>
		<rect x="4" y="4" width="16" height="16" rx="1" strokeDasharray="2 2" opacity="0.4" />
		<line x1="4" y1="4" x2="20" y2="20" strokeWidth="1.5" />
	</svg>
);

/**
 * Solid icon - solid line
 */
const SolidIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<line x1="4" y1="12" x2="20" y2="12" />
	</svg>
);

/**
 * Dashed icon - dashed line
 */
const DashedIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeDasharray="4 2"
	>
		<line x1="4" y1="12" x2="20" y2="12" />
	</svg>
);

/**
 * Dotted icon - dotted line
 */
const DottedIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeDasharray="0.5 3"
	>
		<line x1="4" y1="12" x2="20" y2="12" />
	</svg>
);

/**
 * Double icon - two parallel lines
 */
const DoubleIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
	>
		<line x1="4" y1="10" x2="20" y2="10" />
		<line x1="4" y1="14" x2="20" y2="14" />
	</svg>
);

/**
 * Groove icon - 3D grooved effect
 */
const GrooveIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		strokeWidth="2"
	>
		<line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" opacity="0.4" />
		<line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" />
	</svg>
);

/**
 * Ridge icon - 3D ridged effect (opposite of groove)
 */
const RidgeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		strokeWidth="2"
	>
		<line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" />
		<line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" opacity="0.4" />
	</svg>
);

/**
 * Border style options with icons
 */
const BORDER_STYLE_OPTIONS = [
	{
		value: 'none',
		label: 'None',
		icon: <NoneIcon />,
	},
	{
		value: 'solid',
		label: 'Solid',
		icon: <SolidIcon />,
	},
	{
		value: 'dashed',
		label: 'Dashed',
		icon: <DashedIcon />,
	},
	{
		value: 'dotted',
		label: 'Dotted',
		icon: <DottedIcon />,
	},
	{
		value: 'double',
		label: 'Double',
		icon: <DoubleIcon />,
	},
	{
		value: 'groove',
		label: 'Groove',
		icon: <GrooveIcon />,
	},
	{
		value: 'ridge',
		label: 'Ridge',
		icon: <RidgeIcon />,
	},
];

/**
 * Border Style Control Component
 *
 * An icon-based button group for selecting CSS border styles.
 * Uses the IconButtonGroup component with custom SVG icons.
 *
 * @param {Object}   props           Component props
 * @param {string}   props.label     Label for the control (default: 'Border Style')
 * @param {string}   props.value     Current border style value
 * @param {Function} props.onChange  Callback when style changes
 * @param {boolean}  props.allowWrap Whether buttons can wrap (default: true)
 * @return {JSX.Element} Border style control component
 */
export function BorderStyleControl( {
	label = 'Border Style',
	value = 'none',
	onChange,
	allowWrap = true,
} ) {
	return (
		<IconButtonGroup
			label={ label }
			value={ value }
			onChange={ onChange }
			options={ BORDER_STYLE_OPTIONS }
			allowWrap={ allowWrap }
		/>
	);
}

/**
 * Export individual icons for use in other components
 */
export const BorderStyleIcons = {
	NoneIcon,
	SolidIcon,
	DashedIcon,
	DottedIcon,
	DoubleIcon,
	GrooveIcon,
	RidgeIcon,
};

export default BorderStyleControl;
