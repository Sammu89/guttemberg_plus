/**
 * Keyboard Navigation Utilities
 *
 * Handles keyboard interactions for accordion, tabs, and TOC blocks.
 * Implements WCAG 2.1 keyboard navigation patterns.
 *
 * @see docs/BLOCKS/31-ACCORDION-SPEC.md
 * @see docs/BLOCKS/32-TABS-SPEC.md
 * @package
 * @since 1.0.0
 */

/**
 * Key codes for navigation
 */
export const KEYS = {
	ENTER: 'Enter',
	SPACE: ' ',
	ARROW_UP: 'ArrowUp',
	ARROW_DOWN: 'ArrowDown',
	ARROW_LEFT: 'ArrowLeft',
	ARROW_RIGHT: 'ArrowRight',
	HOME: 'Home',
	END: 'End',
	TAB: 'Tab',
	ESCAPE: 'Escape',
};

/**
 * Check if key press should activate element (Enter or Space)
 *
 * @param {KeyboardEvent} event - Keyboard event
 * @return {boolean} True if activation key was pressed
 */
export function isActivationKey( event ) {
	return event.key === KEYS.ENTER || event.key === KEYS.SPACE;
}

/**
 * Check if key press is an arrow key
 *
 * @param {KeyboardEvent} event - Keyboard event
 * @return {boolean} True if arrow key was pressed
 */
export function isArrowKey( event ) {
	return [ KEYS.ARROW_UP, KEYS.ARROW_DOWN, KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT ].includes(
		event.key
	);
}

/**
 * Handle accordion keyboard navigation
 *
 * Supports: Enter, Space (toggle), Arrow keys (navigate)
 *
 * @param {KeyboardEvent} event      - Keyboard event
 * @param {HTMLElement}   element    - Current accordion header element
 * @param {Function}      onToggle   - Callback to toggle accordion
 * @param {Function}      onNavigate - Callback to navigate to another accordion
 */
export function handleAccordionKeyboard( event, element, onToggle, onNavigate ) {
	// Activation: Enter or Space
	if ( isActivationKey( event ) ) {
		event.preventDefault();
		onToggle();
		return;
	}

	// Navigation: Arrow keys
	if ( isArrowKey( event ) ) {
		event.preventDefault();
		const direction =
			event.key === KEYS.ARROW_DOWN || event.key === KEYS.ARROW_RIGHT ? 'next' : 'prev';
		onNavigate( direction );
		return;
	}

	// Home/End
	if ( event.key === KEYS.HOME ) {
		event.preventDefault();
		onNavigate( 'first' );
	} else if ( event.key === KEYS.END ) {
		event.preventDefault();
		onNavigate( 'last' );
	}
}

/**
 * Handle tabs keyboard navigation
 *
 * Horizontal: Left/Right arrows navigate, Home/End jump
 * Vertical: Up/Down arrows navigate, Home/End jump
 *
 * @param {KeyboardEvent} event       - Keyboard event
 * @param {string}        orientation - 'horizontal' or 'vertical'
 * @param {Function}      onSelect    - Callback to select tab (receives direction)
 */
export function handleTabsKeyboard( event, orientation, onSelect ) {
	const isHorizontal = orientation === 'horizontal';

	// Activation: Enter or Space
	if ( isActivationKey( event ) ) {
		event.preventDefault();
		// Tab already selected, just focus panel
		return;
	}

	// Navigation based on orientation
	if ( isHorizontal ) {
		if ( event.key === KEYS.ARROW_RIGHT ) {
			event.preventDefault();
			onSelect( 'next' );
		} else if ( event.key === KEYS.ARROW_LEFT ) {
			event.preventDefault();
			onSelect( 'prev' );
		}
	} else {
		// Vertical
		if ( event.key === KEYS.ARROW_DOWN ) {
			event.preventDefault();
			onSelect( 'next' );
		} else if ( event.key === KEYS.ARROW_UP ) {
			event.preventDefault();
			onSelect( 'prev' );
		}
	}

	// Home/End
	if ( event.key === KEYS.HOME ) {
		event.preventDefault();
		onSelect( 'first' );
	} else if ( event.key === KEYS.END ) {
		event.preventDefault();
		onSelect( 'last' );
	}
}

/**
 * Get next focusable element in a list
 *
 * @param {NodeList} elements  - List of focusable elements
 * @param {number}   current   - Current index
 * @param {string}   direction - 'next', 'prev', 'first', or 'last'
 * @return {number} Next index (wraps around)
 */
export function getNextIndex( elements, current, direction ) {
	const length = elements.length;

	switch ( direction ) {
		case 'next':
			return ( current + 1 ) % length;
		case 'prev':
			return ( current - 1 + length ) % length;
		case 'first':
			return 0;
		case 'last':
			return length - 1;
		default:
			return current;
	}
}

/**
 * Focus element and scroll into view if needed
 *
 * @param {HTMLElement} element - Element to focus
 * @param {Object}      options - Focus options
 */
export function focusElement( element, options = {} ) {
	if ( ! element ) {
		return;
	}

	element.focus( {
		preventScroll: false,
		...options,
	} );

	// Ensure element is visible
	element.scrollIntoView( {
		behavior: 'smooth',
		block: 'nearest',
		inline: 'nearest',
	} );
}

/**
 * Find all focusable elements within a container
 *
 * @param {HTMLElement} container - Container element
 * @return {Array<HTMLElement>} Array of focusable elements
 */
export function getFocusableElements( container ) {
	const focusableSelectors = [
		'a[href]',
		'button:not([disabled])',
		'input:not([disabled])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])',
	];

	const elements = container.querySelectorAll( focusableSelectors.join( ',' ) );

	return Array.from( elements );
}

/**
 * Trap focus within a container
 * Useful for modals/dialogs
 *
 * @param {HTMLElement}   container - Container to trap focus within
 * @param {KeyboardEvent} event     - Keyboard event
 */
export function trapFocus( container, event ) {
	if ( event.key !== KEYS.TAB ) {
		return;
	}

	const focusableElements = getFocusableElements( container );
	if ( focusableElements.length === 0 ) {
		return;
	}

	const firstElement = focusableElements[ 0 ];
	const lastElement = focusableElements[ focusableElements.length - 1 ];

	if ( event.shiftKey ) {
		// Shift + Tab: moving backwards
		if ( document.activeElement === firstElement ) {
			event.preventDefault();
			lastElement.focus();
		}
	} else {
		// Tab: moving forwards
		if ( document.activeElement === lastElement ) {
			event.preventDefault();
			firstElement.focus();
		}
	}
}

/**
 * Add keyboard event listener with cleanup
 *
 * @param {HTMLElement} element - Element to attach listener to
 * @param {Function}    handler - Event handler function
 * @return {Function} Cleanup function to remove listener
 */
export function addKeyboardListener( element, handler ) {
	element.addEventListener( 'keydown', handler );

	// Return cleanup function
	return () => {
		element.removeEventListener( 'keydown', handler );
	};
}
