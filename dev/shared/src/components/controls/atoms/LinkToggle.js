/**
 * LinkToggle Atom
 *
 * Toggle button for linking/unlinking sides (used in BoxControl).
 *
 * @package guttemberg-plus
 */

import { Button } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';

/**
 * LinkToggle Component
 *
 * @param {Object}   props
 * @param {boolean}  props.linked    - Whether sides are linked
 * @param {Function} props.onChange  - Change handler
 * @param {boolean}  props.disabled  - Disabled state
 */
export function LinkToggle( {
	linked = true,
	onChange,
	disabled = false,
} ) {
	return (
		<Button
			className={ `gutplus-link-toggle ${ linked ? 'is-linked' : 'is-unlinked' }` }
			icon={ linked ? link : linkOff }
			label={ linked ? 'Unlink sides' : 'Link sides' }
			onClick={ () => onChange( ! linked ) }
			isPressed={ linked }
			disabled={ disabled }
			isSmall
		/>
	);
}

export default LinkToggle;
