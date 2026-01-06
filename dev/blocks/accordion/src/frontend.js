/**
 * Accordion Block - Frontend JavaScript
 *
 * Handles toggle interactions, keyboard navigation, and animations.
 * Uses shared utilities for keyboard handling and ARIA updates.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Initialize accordion functionality
 * Runs when DOM is ready
 */
document.addEventListener( 'DOMContentLoaded', () => {
	try {
		updateDeviceAttributes();
		initializeAccordions();
	} catch ( error ) {
		// console.error( 'Accordion block initialization failed:', error );
	}
} );

const DEFAULT_BREAKPOINTS = {
	tablet: 768,
	mobile: 481,
};

let currentDevice = null;

function getBreakpoints() {
	return window.guttembergPlusSettings?.breakpoints || DEFAULT_BREAKPOINTS;
}

function getDevice( width, breakpoints ) {
	if ( width <= breakpoints.mobile ) {
		return 'mobile';
	}
	if ( width <= breakpoints.tablet ) {
		return 'tablet';
	}
	return 'global';
}

function updateDeviceAttributes() {
	const blocks = document.querySelectorAll( '.gutplus-accordion' );
	if ( ! blocks || blocks.length === 0 ) {
		return;
	}

	const breakpoints = getBreakpoints();
	const device = getDevice( window.innerWidth, breakpoints );
	if ( device === currentDevice ) {
		return;
	}

	currentDevice = device;
	blocks.forEach( ( block ) => {
		block.setAttribute( 'data-gutplus-device', device );
	} );
}

let resizeTimer;
window.addEventListener( 'resize', () => {
	clearTimeout( resizeTimer );
	resizeTimer = setTimeout( updateDeviceAttributes, 100 );
} );

/**
 * Initialize all accordion blocks on the page
 */
function initializeAccordions() {
	const accordionBlocks = document.querySelectorAll( '.gutplus-accordion' );

	if ( ! accordionBlocks || accordionBlocks.length === 0 ) {
		return; // Graceful exit, no accordion blocks found
	}

	accordionBlocks.forEach( ( block ) => {
		try {
			initializeSingleAccordion( block );
		} catch ( error ) {
			// console.error( 'Failed to initialize accordion block:', error );
			// Continue with next block
		}
	} );
}

/**
 * Read animation duration from CSS variable with a safe fallback.
 *
 * @param {HTMLElement} element Element to read duration from
 * @return {number} Duration in ms
 */
function getAnimationDuration( element ) {
	if ( ! element ) {
		return 300;
	}

	return parseInt(
		getComputedStyle( element ).getPropertyValue( '--accordion-animation-duration' ) || '300',
		10
	);
}

/**
 * Read animation type from data attribute with fallback.
 *
 * @param {HTMLElement} element Block root element
 * @return {string} Animation type (none|slide|fade|slideFade)
 */
function getAnimationType( element ) {
	if ( ! element ) {
		return 'slide';
	}

	return element.getAttribute( 'data-animation-type' ) || 'slide';
}

/**
 * Resolve animation flags from type.
 *
 * @param {string} animationType Animation type string
 * @return {{ height: boolean, opacity: boolean }}
 */
function getAnimationFlags( animationType ) {
	return {
		height: animationType === 'slide' || animationType === 'slideFade',
		opacity: animationType === 'fade' || animationType === 'slideFade',
	};
}

/**
 * Build a transition string based on active properties.
 *
 * @param {boolean} animateHeight  Whether to animate height
 * @param {boolean} animateOpacity Whether to animate opacity
 * @param {number}  duration       Duration in ms
 * @return {string} Transition string
 */
function buildTransition( animateHeight, animateOpacity, duration ) {
	const transitions = [];

	if ( animateHeight ) {
		transitions.push( `height ${ duration }ms ease-in-out` );
	}
	if ( animateOpacity ) {
		transitions.push( `opacity ${ duration }ms ease-in-out` );
	}

	return transitions.join( ', ' );
}

/**
 * Compute the height we need to animate to, including padding on the wrapper.
 *
 * @param {HTMLElement} panel          Outer panel wrapper
 * @param {HTMLElement} contentWrapper Inner content wrapper
 * @return {number} Calculated target height in pixels
 */
function getPanelTargetHeight( panel, contentWrapper ) {
	if ( ! panel ) {
		return 0;
	}

	const wrapper = contentWrapper || panel;
	const baseHeight = wrapper.scrollHeight;

	// If we're animating the same element we measured, we already have padding included
	if ( ! contentWrapper || contentWrapper === panel ) {
		return baseHeight;
	}

	const panelStyles = getComputedStyle( panel );
	const paddingTop = parseFloat( panelStyles.paddingTop || '0' );
	const paddingBottom = parseFloat( panelStyles.paddingBottom || '0' );

	return baseHeight + paddingTop + paddingBottom;
}

/**
 * Initialize a single accordion block
 *
 * New structure: .gutplus-accordion is the block root element
 * The block itself is the accordion item.
 *
 * @param {HTMLElement} block Accordion block element (which is also the accordion-item)
 */
function initializeSingleAccordion( block ) {
	if ( ! block ) {
		// console.warn( 'Accordion block is null, skipping' );
		return;
	}

	// New structure: the block itself is the accordion-item
	// It has class: gutplus-accordion
	const item = block;

	try {
		const button = item.querySelector( '.accordion-title' );
		const panel = item.querySelector( '.accordion-content' );
		const contentWrapper = panel?.querySelector( '.accordion-content-inner' ) || panel;

		if ( ! button || ! panel ) {
			// console.warn( 'Accordion item structure incomplete, skipping' );
			return;
		}

		// Add click handler
		button.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			try {
				toggleAccordion( item, button, panel, contentWrapper, block );
			} catch ( error ) {
				// console.error( 'Failed to toggle accordion:', error );
			}
		} );

		// Add keyboard handlers
		button.addEventListener( 'keydown', ( e ) => {
			try {
				handleKeyboardNavigation( e, button, block );
			} catch ( error ) {
				// console.error( 'Keyboard navigation failed:', error );
			}
		} );

		// Set initial state based on is-open class
		const isInitiallyOpen = item.classList.contains( 'is-open' );
		if ( isInitiallyOpen ) {
			openAccordionItem(
				item,
				button,
				panel,
				contentWrapper,
				false,
				getAnimationType( item )
			);
		}
	} catch ( error ) {
		// console.error( 'Failed to initialize accordion item:', error );
	}
}

/**
 * Toggle accordion item open/closed
 * Each item can be independently opened/closed based on its "Initially Open" toggle
 *
 * @param {HTMLElement} item           Accordion item element
 * @param {HTMLElement} button         Toggle button
 * @param {HTMLElement} panel          Content panel (outer wrapper)
 * @param {HTMLElement} contentWrapper Inner wrapper that contains the content
 * @param {HTMLElement} block          Parent block
 */
function toggleAccordion( item, button, panel, contentWrapper, block ) {
	const isOpen = item.classList.contains( 'is-open' );
	const animationType = getAnimationType( block );

	if ( isOpen ) {
		// Close this item
		closeAccordionItem( item, button, panel, contentWrapper, animationType );
	} else {
		// Open this item - other items stay as they are
		openAccordionItem( item, button, panel, contentWrapper, true, animationType );
	}
}

/**
 * Open an accordion item
 *
 * @param {HTMLElement} item           Accordion item
 * @param {HTMLElement} button         Toggle button
 * @param {HTMLElement} panel          Content panel (outer wrapper)
 * @param {HTMLElement} contentWrapper Inner wrapper that contains the content
 * @param {boolean}     animate        Whether to animate
 * @param               animationType
 */
function openAccordionItem( item, button, panel, contentWrapper, animate, animationType ) {
	// Update classes
	item.classList.add( 'is-open' );

	// Update ARIA
	button.setAttribute( 'aria-expanded', 'true' );
	panel.removeAttribute( 'hidden' );
	panel.style.display = '';

	// Update icon
	updateIcon( button, true );

	// Animate if requested
	if ( animate && animationType !== 'none' ) {
		animateOpen( panel, contentWrapper, animationType );
	} else {
		panel.style.height = 'auto';
		panel.style.opacity = '';
		panel.style.overflow = '';
		panel.style.transition = '';
	}
}

/**
 * Close an accordion item
 *
 * @param {HTMLElement} item           Accordion item
 * @param {HTMLElement} button         Toggle button
 * @param {HTMLElement} panel          Content panel (outer wrapper)
 * @param {HTMLElement} contentWrapper Inner wrapper that contains the content
 * @param               animationType
 */
function closeAccordionItem( item, button, panel, contentWrapper, animationType ) {
	// Update classes
	item.classList.remove( 'is-open' );

	// Update ARIA
	button.setAttribute( 'aria-expanded', 'false' );

	// Update icon
	updateIcon( button, false );

	// Animate close
	if ( animationType === 'none' ) {
		panel.setAttribute( 'hidden', '' );
		panel.style.display = 'none';
		panel.style.height = '';
		panel.style.opacity = '';
		panel.style.overflow = '';
		panel.style.transition = '';
		return;
	}

	animateClose( panel, contentWrapper, animationType, () => {
		// After animation completes
		panel.setAttribute( 'hidden', '' );
		panel.style.display = 'none';
	} );
}

/**
 * Close all accordion items in a block
 * Note: With new structure where each block is a single item,
 * this function now just closes the block itself if it's open.
 *
 * @param {HTMLElement} block Parent block element (which is the accordion-item)
 */
function closeAllItems( block ) {
	// New structure: block is the accordion-item
	if ( block.classList.contains( 'is-open' ) ) {
		const button = block.querySelector( '.accordion-title' );
		const panel = block.querySelector( '.accordion-content' );
		const contentWrapper = panel?.querySelector( '.accordion-content-inner' ) || panel;

		if ( button && panel ) {
			closeAccordionItem( block, button, panel, contentWrapper, getAnimationType( block ) );
		}
	}
}

/**
 * Update icon based on open/closed state
 * Simplified version - CSS now handles icon visibility via .is-open class
 * This function is now primarily for backward compatibility
 *
 * @param {HTMLElement} button Toggle button
 * @param {boolean}     isOpen Whether accordion is open
 */
function updateIcon( button, isOpen ) {
	// Icon switching is now handled by CSS via .is-open class on parent
	// Both inactive and active icons are rendered in the HTML
	// CSS shows/hides them based on accordion state
	// This function is kept for backward compatibility and future enhancements
	// but the core icon switching logic is no longer needed
}

/**
 * Animate panel opening
 *
 * @param {HTMLElement} panel          Content panel (outer wrapper)
 * @param {HTMLElement} contentWrapper Inner wrapper that contains the content
 * @param               animationType
 */
function animateOpen( panel, contentWrapper, animationType ) {
	const duration = getAnimationDuration( panel );
	const { height: animateHeight, opacity: animateOpacity } = getAnimationFlags( animationType );

	if ( ! animateHeight && ! animateOpacity ) {
		panel.style.height = 'auto';
		panel.style.opacity = '';
		panel.style.overflow = '';
		panel.style.transition = '';
		panel.style.display = '';
		return;
	}

	panel.removeAttribute( 'hidden' );
	panel.style.display = 'block';

	if ( animateHeight ) {
		const targetHeight = getPanelTargetHeight( panel, contentWrapper );
		panel.style.overflow = 'hidden';
		panel.style.height = '0px';
		panel.style.opacity = animateOpacity ? '0' : '';

		// Force reflow to ensure the browser registers the starting state
		panel.offsetHeight;

		panel.style.transition = buildTransition( animateHeight, animateOpacity, duration );
		panel.style.height = `${ targetHeight }px`;
		if ( animateOpacity ) {
			panel.style.opacity = '1';
		}
	} else {
		panel.style.height = 'auto';
		panel.style.opacity = '0';

		// Force reflow to ensure the browser registers the starting state
		panel.offsetHeight;

		panel.style.transition = buildTransition( animateHeight, animateOpacity, duration );
		panel.style.opacity = '1';
	}

	let handled = false;
	const handleTransitionEnd = ( e ) => {
		if ( handled ) {
			return;
		}

		const isHeight = animateHeight && e.propertyName === 'height';
		const isOpacity = animateOpacity && e.propertyName === 'opacity';
		if ( ! isHeight && ! isOpacity ) {
			return;
		}

		handled = true;
		panel.style.transition = '';
		panel.style.height = 'auto';
		panel.style.overflow = '';
		panel.style.opacity = '';
		panel.style.display = '';

		panel.removeEventListener( 'transitionend', handleTransitionEnd );
		panel.removeEventListener( 'transitioncancel', handleTransitionEnd );
	};

	panel.addEventListener( 'transitionend', handleTransitionEnd );
	panel.addEventListener( 'transitioncancel', handleTransitionEnd );
}

/**
 * Animate panel closing
 *
 * @param {HTMLElement} panel          Content panel (outer wrapper)
 * @param {HTMLElement} contentWrapper Inner wrapper that contains the content
 * @param               animationType
 * @param {Function}    callback       Callback after animation
 */
function animateClose( panel, contentWrapper, animationType, callback ) {
	const duration = getAnimationDuration( panel );
	const { height: animateHeight, opacity: animateOpacity } = getAnimationFlags( animationType );

	if ( ! animateHeight && ! animateOpacity ) {
		if ( callback ) {
			callback();
		}
		return;
	}

	panel.style.display = 'block';

	if ( animateHeight ) {
		const currentHeight =
			panel.getBoundingClientRect().height || getPanelTargetHeight( panel, contentWrapper );
		panel.style.overflow = 'hidden';
		panel.style.height = `${ currentHeight }px`;
	} else {
		panel.style.height = 'auto';
		panel.style.overflow = '';
	}

	panel.style.opacity = animateOpacity ? '1' : '';

	// Force reflow to ensure the browser registers the current height
	panel.offsetHeight;

	panel.style.transition = buildTransition( animateHeight, animateOpacity, duration );
	if ( animateHeight ) {
		panel.style.height = '0px';
	}
	if ( animateOpacity ) {
		panel.style.opacity = '0';
	}

	let handled = false;
	const handleTransitionEnd = ( e ) => {
		if ( handled ) {
			return;
		}

		const isHeight = animateHeight && e.propertyName === 'height';
		const isOpacity = animateOpacity && e.propertyName === 'opacity';
		if ( ! isHeight && ! isOpacity ) {
			return;
		}

		handled = true;
		panel.style.transition = '';
		panel.style.overflow = '';
		panel.style.height = '';
		panel.style.opacity = '';
		panel.style.display = '';

		panel.removeEventListener( 'transitionend', handleTransitionEnd );
		panel.removeEventListener( 'transitioncancel', handleTransitionEnd );

		if ( callback ) {
			callback();
		}
	};

	panel.addEventListener( 'transitionend', handleTransitionEnd );
	panel.addEventListener( 'transitioncancel', handleTransitionEnd );
}

/**
 * Handle keyboard navigation
 *
 * @param {KeyboardEvent} e      Keyboard event
 * @param {HTMLElement}   button Current button
 * @param {HTMLElement}   block  Parent block
 */
function handleKeyboardNavigation( e, button, block ) {
	if ( ! e || ! button || ! block ) {
		return;
	}

	const key = e.key;

	// Enter or Space: Toggle accordion
	if ( key === 'Enter' || key === ' ' ) {
		e.preventDefault();
		button.click();
		return;
	}

	// Arrow keys: Navigate between accordion buttons
	const buttons = Array.from( block.querySelectorAll( '.accordion-title' ) );

	if ( ! buttons || buttons.length === 0 ) {
		return;
	}

	const currentIndex = buttons.indexOf( button );

	if ( currentIndex === -1 ) {
		// console.warn( 'Current button not found in buttons array' );
		return;
	}

	let targetIndex = currentIndex;

	switch ( key ) {
		case 'ArrowDown':
		case 'ArrowRight':
			e.preventDefault();
			targetIndex = ( currentIndex + 1 ) % buttons.length;
			break;

		case 'ArrowUp':
		case 'ArrowLeft':
			e.preventDefault();
			targetIndex = ( currentIndex - 1 + buttons.length ) % buttons.length;
			break;

		case 'Home':
			e.preventDefault();
			targetIndex = 0;
			break;

		case 'End':
			e.preventDefault();
			targetIndex = buttons.length - 1;
			break;

		default:
			return;
	}

	// Focus target button with bounds check
	if (
		targetIndex !== currentIndex &&
		targetIndex >= 0 &&
		targetIndex < buttons.length &&
		buttons[ targetIndex ]
	) {
		buttons[ targetIndex ].focus();
	}
}

/**
 * Reinitialize accordions
 * Useful for dynamic content or after AJAX updates
 */
window.reinitializeAccordions = initializeAccordions;

/**
 * Export for potential imports
 */
export { initializeAccordions, toggleAccordion, openAccordionItem, closeAccordionItem };
