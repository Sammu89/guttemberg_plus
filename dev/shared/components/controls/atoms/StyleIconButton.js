/**
 * StyleIconButton Atom
 *
 * Icon button that shows border style (none, solid, dashed, dotted, double, groove, ridge).
 * Clicking opens a popover to select style.
 * Uses line-based icons matching BorderStyleControl.js for visual consistency.
 *
 * @package
 */

import { useState } from '@wordpress/element';
import { Button, Popover } from '@wordpress/components';

// Border style icons as inline SVGs (line-based, matching BorderStyleControl.js)
const styleIcons = {
	none: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<rect x="3" y="3" width="14" height="14" rx="1" strokeDasharray="2 2" opacity="0.4" />
			<line x1="3" y1="3" x2="17" y2="17" strokeWidth="1.5" />
		</svg>
	),
	solid: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<line x1="3" y1="10" x2="17" y2="10" />
		</svg>
	),
	dashed: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeDasharray="4 2"
		>
			<line x1="3" y1="10" x2="17" y2="10" />
		</svg>
	),
	dotted: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeDasharray="0.5 3"
		>
			<line x1="3" y1="10" x2="17" y2="10" />
		</svg>
	),
	double: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<line x1="3" y1="8" x2="17" y2="8" />
			<line x1="3" y1="12" x2="17" y2="12" />
		</svg>
	),
	groove: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="2">
			<line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" opacity="0.4" />
			<line x1="3" y1="12" x2="17" y2="12" stroke="currentColor" />
		</svg>
	),
	ridge: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="2">
			<line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" />
			<line x1="3" y1="12" x2="17" y2="12" stroke="currentColor" opacity="0.4" />
		</svg>
	),
};

const styleOptions = [
	{ value: 'none', label: 'None' },
	{ value: 'solid', label: 'Solid' },
	{ value: 'dashed', label: 'Dashed' },
	{ value: 'dotted', label: 'Dotted' },
	{ value: 'double', label: 'Double' },
	{ value: 'groove', label: 'Groove' },
	{ value: 'ridge', label: 'Ridge' },
];

/**
 * StyleIconButton Component
 *
 * @param {Object}   props
 * @param {string}   props.value    - Current style (none, solid, dashed, dotted, double, groove, ridge)
 * @param {Function} props.onChange - Change handler
 * @param {boolean}  props.disabled - Disabled state
 */
export function StyleIconButton( { value = 'solid', onChange, disabled = false } ) {
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<div className="gutplus-style-icon-button">
			<Button
				className="gutplus-style-icon-button__trigger"
				onClick={ () => setIsOpen( ! isOpen ) }
				disabled={ disabled }
				label={ `Border style: ${ value }` }
			>
				{ styleIcons[ value ] || styleIcons.solid }
			</Button>

			{ isOpen && (
				<Popover
					className="gutplus-style-icon-button__popover"
					position="bottom left"
					onClose={ () => setIsOpen( false ) }
				>
					<div className="gutplus-style-options">
						{ styleOptions.map( ( option ) => (
							<Button
								key={ option.value }
								className={ `gutplus-style-option ${
									value === option.value ? 'is-selected' : ''
								}` }
								onClick={ () => {
									onChange( option.value );
									setIsOpen( false );
								} }
								label={ option.label }
							>
								{ styleIcons[ option.value ] }
							</Button>
						) ) }
					</div>
				</Popover>
			) }
		</div>
	);
}

export default StyleIconButton;
