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
		initializeAccordions();
	} catch ( error ) {
		console.error( 'Accordion block initialization failed:', error );
	}
} );

/**
 * Initialize all accordion blocks on the page
 */
function initializeAccordions() {
	const accordionBlocks = document.querySelectorAll( '.wp-block-accordion' );

	if ( ! accordionBlocks || accordionBlocks.length === 0 ) {
		return; // Graceful exit, no accordion blocks found
	}

	accordionBlocks.forEach( ( block ) => {
		try {
			initializeSingleAccordion( block );
		} catch ( error ) {
			console.error( 'Failed to initialize accordion block:', error );
			// Continue with next block
		}
	} );
}

/**
 * Initialize a single accordion block
 *
 * @param {HTMLElement} block Accordion block element
 */
function initializeSingleAccordion( block ) {
	if ( ! block ) {
		console.warn( 'Accordion block is null, skipping' );
		return;
	}

	const allowMultiple = block.getAttribute( 'data-allow-multiple' ) === 'true';

	// Find all accordion items within this block
	const items = block.querySelectorAll( '.accordion-item' );

	if ( ! items || items.length === 0 ) {
		console.warn( 'No accordion items found in block, skipping' );
		return;
	}

	items.forEach( ( item ) => {
		try {
			const button = item.querySelector( '.accordion-title' );
			const panel = item.querySelector( '.accordion-content' );

			if ( ! button || ! panel ) {
				console.warn( 'Accordion item structure incomplete, skipping' );
				return;
			}

			// Add click handler
			button.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				try {
					toggleAccordion( item, button, panel, block, allowMultiple );
				} catch ( error ) {
					console.error( 'Failed to toggle accordion:', error );
				}
			} );

			// Add keyboard handlers
			button.addEventListener( 'keydown', ( e ) => {
				try {
					handleKeyboardNavigation( e, button, block );
				} catch ( error ) {
					console.error( 'Keyboard navigation failed:', error );
				}
			} );

			// Set initial state based on is-open class
			const isInitiallyOpen = item.classList.contains( 'is-open' );
			if ( isInitiallyOpen ) {
				openAccordionItem( item, button, panel, false );
			}
		} catch ( error ) {
			console.error( 'Failed to initialize accordion item:', error );
		}
	} );
}

/**
 * Toggle accordion item open/closed
 *
 * @param {HTMLElement} item          Accordion item element
 * @param {HTMLElement} button        Toggle button
 * @param {HTMLElement} panel         Content panel
 * @param {HTMLElement} block         Parent block
 * @param {boolean}     allowMultiple Whether multiple items can be open
 */
function toggleAccordion( item, button, panel, block, allowMultiple ) {
	const isOpen = item.classList.contains( 'is-open' );

	if ( isOpen ) {
		// Close this item
		closeAccordionItem( item, button, panel );
	} else {
		// Close other items if allowMultiple is false
		if ( ! allowMultiple ) {
			closeAllItems( block );
		}

		// Open this item
		openAccordionItem( item, button, panel, true );
	}
}

/**
 * Open an accordion item
 *
 * @param {HTMLElement} item    Accordion item
 * @param {HTMLElement} button  Toggle button
 * @param {HTMLElement} panel   Content panel
 * @param {boolean}     animate Whether to animate
 */
function openAccordionItem( item, button, panel, animate ) {
	// Update classes
	item.classList.add( 'is-open' );

	// Update ARIA
	button.setAttribute( 'aria-expanded', 'true' );
	panel.removeAttribute( 'hidden' );

	// Update icon
	updateIcon( button, true );

	// Animate if requested
	if ( animate ) {
		animateOpen( panel );
	} else {
		panel.style.height = 'auto';
		panel.style.opacity = '1';
	}
}

/**
 * Close an accordion item
 *
 * @param {HTMLElement} item   Accordion item
 * @param {HTMLElement} button Toggle button
 * @param {HTMLElement} panel  Content panel
 */
function closeAccordionItem( item, button, panel ) {
	// Update classes
	item.classList.remove( 'is-open' );

	// Update ARIA
	button.setAttribute( 'aria-expanded', 'false' );

	// Update icon
	updateIcon( button, false );

	// Animate close
	animateClose( panel, () => {
		// After animation completes
		panel.setAttribute( 'hidden', '' );
	} );
}

/**
 * Close all accordion items in a block
 *
 * @param {HTMLElement} block Parent block element
 */
function closeAllItems( block ) {
	const items = block.querySelectorAll( '.accordion-item.is-open' );

	items.forEach( ( item ) => {
		const button = item.querySelector( '.accordion-title' );
		const panel = item.querySelector( '.accordion-content' );

		if ( button && panel ) {
			closeAccordionItem( item, button, panel );
		}
	} );
}

/**
 * Update icon based on open/closed state
 *
 * @param {HTMLElement} button Toggle button
 * @param {boolean}     isOpen Whether accordion is open
 */
function updateIcon( button, isOpen ) {
	const icon = button.querySelector( '.accordion-icon' );

	if ( ! icon ) {
		return;
	}

	const iconClosed = icon.getAttribute( 'data-icon-closed' ) || '▾';
	const iconOpen = icon.getAttribute( 'data-icon-open' ) || 'none';

	// Get animation duration from CSS variable
	const duration = parseInt(
		getComputedStyle( icon ).getPropertyValue( '--accordion-animation-duration' ) || '300'
	);

	// Check if icon needs to change (not just rotate)
	const isImage = icon.classList.contains( 'accordion-icon-image' );
	const newIcon = isOpen ? iconOpen : iconClosed;
	const currentIcon = isImage ? icon.src : icon.textContent;
	const iconIsChanging = newIcon !== 'none' && currentIcon !== newIcon;

	if ( iconIsChanging ) {
		// Fade out
		icon.style.opacity = '0';

		// After fade out, change the icon and fade back in
		setTimeout( () => {
			if ( isImage ) {
				icon.src = newIcon;
			} else {
				icon.textContent = newIcon;
			}

			// Trigger reflow to ensure opacity transition works
			icon.offsetHeight;

			// Fade in
			icon.style.opacity = '1';
		}, duration );
	} else {
		// No icon change, just ensure opacity is visible
		icon.style.opacity = '1';
	}

	// Toggle rotation class for CSS animation
	if ( isOpen ) {
		icon.classList.add( 'is-rotated' );
	} else {
		icon.classList.remove( 'is-rotated' );
	}
}

/**
 * Animate panel opening
 *
 * @param {HTMLElement} panel Content panel
 */
function animateOpen( panel ) {
	// Get animation duration from CSS variable
	const duration = parseInt(
		getComputedStyle( panel ).getPropertyValue( '--accordion-animation-duration' ) || '300'
	);

	// Set initial state
	panel.style.height = '0';
	panel.style.opacity = '0';
	panel.style.overflow = 'hidden';

	// Force reflow
	panel.offsetHeight;

	// Get target height
	const targetHeight = panel.scrollHeight;

	// Animate
	panel.style.transition = `height ${ duration }ms ease-in-out, opacity ${ duration }ms ease-in-out`;
	panel.style.height = `${ targetHeight }px`;
	panel.style.opacity = '1';

	// Clean up after animation
	setTimeout( () => {
		panel.style.height = 'auto';
		panel.style.overflow = '';
		panel.style.transition = '';
	}, duration );
}

/**
 * Animate panel closing
 *
 * @param {HTMLElement} panel    Content panel
 * @param {Function}    callback Callback after animation
 */
function animateClose( panel, callback ) {
	// Get animation duration from CSS variable
	const duration = parseInt(
		getComputedStyle( panel ).getPropertyValue( '--accordion-animation-duration' ) || '300'
	);

	// Get current height
	const currentHeight = panel.scrollHeight;

	// Set explicit height
	panel.style.height = `${ currentHeight }px`;
	panel.style.overflow = 'hidden';

	// Force reflow
	panel.offsetHeight;

	// Animate to 0
	panel.style.transition = `height ${ duration }ms ease-in-out, opacity ${ duration }ms ease-in-out`;
	panel.style.height = '0';
	panel.style.opacity = '0';

	// Execute callback after animation
	setTimeout( () => {
		panel.style.transition = '';
		panel.style.overflow = '';
		if ( callback ) {
			callback();
		}
	}, duration );
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
		console.warn( 'Current button not found in buttons array' );
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
