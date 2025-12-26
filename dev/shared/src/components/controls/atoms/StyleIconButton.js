/**
 * StyleIconButton Atom
 *
 * Icon button that shows border style (none, solid, dashed, dotted, double).
 * Clicking opens a popover to select style.
 *
 * @package guttemberg-plus
 */

import { useState } from '@wordpress/element';
import { Button, Popover } from '@wordpress/components';

// Border style icons as inline SVGs
const styleIcons = {
	none: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
			<line x1="3" y1="17" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	solid: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="2" />
		</svg>
	),
	dashed: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
		</svg>
	),
	dotted: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeDasharray="1,2" strokeLinecap="round" />
		</svg>
	),
	double: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1" />
			<rect x="5" y="5" width="10" height="10" stroke="currentColor" strokeWidth="1" />
		</svg>
	),
};

const styleOptions = [
	{ value: 'none', label: 'None' },
	{ value: 'solid', label: 'Solid' },
	{ value: 'dashed', label: 'Dashed' },
	{ value: 'dotted', label: 'Dotted' },
	{ value: 'double', label: 'Double' },
];

/**
 * StyleIconButton Component
 *
 * @param {Object}   props
 * @param {string}   props.value     - Current style (none, solid, dashed, dotted, double)
 * @param {Function} props.onChange  - Change handler
 * @param {boolean}  props.disabled  - Disabled state
 */
export function StyleIconButton( {
	value = 'solid',
	onChange,
	disabled = false,
} ) {
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
								className={ `gutplus-style-option ${ value === option.value ? 'is-selected' : '' }` }
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
