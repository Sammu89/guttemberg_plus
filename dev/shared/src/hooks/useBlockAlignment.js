/**
 * useBlockAlignment Hook
 *
 * Centralized hook for handling horizontal block alignment in the editor.
 * Applies margin styles with !important to override WordPress editor defaults.
 *
 * @package
 * @since 1.0.0
 */

import { useRef, useEffect } from '@wordpress/element';

/**
 * Hook to handle block horizontal alignment in the editor
 *
 * @param {string} alignmentValue - The alignment value ('left', 'center', 'right')
 * @return {Object} blockRef - Ref to attach to the block wrapper
 */
export const useBlockAlignment = ( alignmentValue ) => {
	const blockRef = useRef( null );

	useEffect( () => {
		if ( blockRef.current ) {
			const alignment = alignmentValue || 'left';

			if ( alignment === 'left' ) {
				blockRef.current.style.setProperty( 'margin-left', '0', 'important' );
				blockRef.current.style.setProperty( 'margin-right', 'auto', 'important' );
			} else if ( alignment === 'center' ) {
				blockRef.current.style.setProperty( 'margin-left', 'auto', 'important' );
				blockRef.current.style.setProperty( 'margin-right', 'auto', 'important' );
			} else if ( alignment === 'right' ) {
				blockRef.current.style.setProperty( 'margin-left', 'auto', 'important' );
				blockRef.current.style.setProperty( 'margin-right', '0', 'important' );
			}
		}
	}, [ alignmentValue ] );

	return blockRef;
};
