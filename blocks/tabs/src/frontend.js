/**
 * Tabs Block - Frontend JavaScript
 *
 * Handles tab switching, keyboard navigation, and responsive accordion fallback.
 * Uses shared utilities for keyboard handling and ARIA updates.
 * Supports both horizontal and vertical orientation.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Initialize tabs functionality
 * Runs when DOM is ready
 */
document.addEventListener( 'DOMContentLoaded', () => {
	try {
		initializeTabs();
		handleResponsiveMode();
	} catch ( error ) {
		console.error( 'Tabs block initialization failed:', error );
	}
} );

/**
 * Handle window resize for responsive mode
 */
window.addEventListener( 'resize', () => {
	try {
		handleResponsiveMode();
	} catch ( error ) {
		console.error( 'Failed to handle responsive mode:', error );
	}
} );

/**
 * Initialize all tabs blocks on the page
 */
function initializeTabs() {
	const tabsBlocks = document.querySelectorAll( '.wp-block-tabs' );

	if ( ! tabsBlocks || tabsBlocks.length === 0 ) {
		return; // Graceful exit, no tabs blocks found
	}

	tabsBlocks.forEach( ( block ) => {
		try {
			initializeSingleTabsBlock( block );
		} catch ( error ) {
			console.error( 'Failed to initialize tabs block:', error );
			// Continue with next block
		}
	} );
}

/**
 * Initialize a single tabs block
 *
 * @param {HTMLElement} block Tabs block element
 */
function initializeSingleTabsBlock( block ) {
	if ( ! block ) {
		console.warn( 'Tabs block is null, skipping' );
		return;
	}

	const orientation = block.getAttribute( 'data-orientation' ) || 'horizontal';
	const activationMode = block.getAttribute( 'data-activation-mode' ) || 'auto';
	const responsiveFallback = block.getAttribute( 'data-responsive-fallback' ) === 'true';

	// Find tab list and panels
	const tabList = block.querySelector( '.tabs-list' );
	const tabButtons = block.querySelectorAll( '.tab-button' );
	const tabPanels = block.querySelectorAll( '.tab-panel' );

	if ( ! tabList || tabButtons.length === 0 || tabPanels.length === 0 ) {
		console.warn( 'Tabs block structure incomplete, skipping' );
		return;
	}

	// Initialize each tab button
	tabButtons.forEach( ( button, index ) => {
		try {
			// Click handler
			button.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				if ( ! button.disabled ) {
					try {
						activateTab( block, index );
					} catch ( error ) {
						console.error( 'Failed to activate tab:', error );
					}
				}
			} );

			// Keyboard navigation
			button.addEventListener( 'keydown', ( e ) => {
				try {
					handleTabKeyboard( e, button, tabButtons, orientation, activationMode, block );
				} catch ( error ) {
					console.error( 'Keyboard navigation failed:', error );
				}
			} );

			// Focus handler for automatic activation
			if ( activationMode === 'auto' ) {
				button.addEventListener( 'focus', () => {
					if ( ! button.disabled ) {
						try {
							activateTab( block, index );
						} catch ( error ) {
							console.error( 'Failed to activate tab on focus:', error );
						}
					}
				} );
			}
		} catch ( error ) {
			console.error( 'Failed to initialize tab button:', error );
		}
	} );

	// Responsive accordion fallback
	if ( responsiveFallback ) {
		try {
			initializeResponsiveAccordion( block );
		} catch ( error ) {
			console.error( 'Failed to initialize responsive accordion:', error );
		}
	}
}

/**
 * Activate a specific tab
 *
 * @param {HTMLElement} block Parent block element
 * @param {number}      index Tab index to activate
 */
function activateTab( block, index ) {
	if ( ! block ) {
		console.warn( 'Block is null in activateTab' );
		return;
	}

	const tabButtons = block.querySelectorAll( '.tab-button' );
	const tabPanels = block.querySelectorAll( '.tab-panel' );

	if ( ! tabButtons || ! tabPanels ) {
		console.warn( 'Tab buttons or panels not found' );
		return;
	}

	if (
		index < 0 ||
		index >= tabButtons.length ||
		! tabButtons[ index ] ||
		! tabPanels[ index ]
	) {
		console.warn( 'Invalid tab index or missing tab elements' );
		return;
	}

	// Deactivate all tabs
	tabButtons.forEach( ( button, i ) => {
		if ( button ) {
			button.setAttribute( 'aria-selected', 'false' );
			button.setAttribute( 'tabindex', '-1' );
			button.classList.remove( 'active' );
		}

		if ( tabPanels[ i ] ) {
			tabPanels[ i ].setAttribute( 'hidden', '' );
			tabPanels[ i ].classList.remove( 'active' );
		}
	} );

	// Activate selected tab
	tabButtons[ index ].setAttribute( 'aria-selected', 'true' );
	tabButtons[ index ].setAttribute( 'tabindex', '0' );
	tabButtons[ index ].classList.add( 'active' );

	if ( tabPanels[ index ] ) {
		tabPanels[ index ].removeAttribute( 'hidden' );
		tabPanels[ index ].style.display = '';
		tabPanels[ index ].classList.add( 'active' );

		// Animate panel appearance
		try {
			animatePanelIn( tabPanels[ index ] );
		} catch ( error ) {
			console.error( 'Failed to animate panel:', error );
		}
	}
}

/**
 * Handle keyboard navigation for tabs
 *
 * @param {KeyboardEvent} e              Keyboard event
 * @param {HTMLElement}   currentButton  Current button
 * @param {NodeList}      allButtons     All tab buttons
 * @param {string}        orientation    Horizontal or vertical
 * @param {string}        activationMode Auto or manual
 * @param {HTMLElement}   block          Parent block
 */
function handleTabKeyboard( e, currentButton, allButtons, orientation, activationMode, block ) {
	if ( ! e || ! currentButton || ! allButtons || ! block ) {
		return;
	}

	const key = e.key;
	const buttons = Array.from( allButtons ).filter( ( btn ) => ! btn.disabled );

	if ( ! buttons || buttons.length === 0 ) {
		return;
	}

	const currentIndex = buttons.indexOf( currentButton );

	if ( currentIndex === -1 ) {
		console.warn( 'Current button not found in buttons array' );
		return;
	}

	let targetIndex = currentIndex;
	let shouldActivate = false;

	// Determine navigation direction based on orientation
	switch ( key ) {
		case 'ArrowRight':
			if ( orientation === 'horizontal' ) {
				e.preventDefault();
				targetIndex = ( currentIndex + 1 ) % buttons.length;
				shouldActivate = activationMode === 'auto';
			}
			break;

		case 'ArrowLeft':
			if ( orientation === 'horizontal' ) {
				e.preventDefault();
				targetIndex = ( currentIndex - 1 + buttons.length ) % buttons.length;
				shouldActivate = activationMode === 'auto';
			}
			break;

		case 'ArrowDown':
			if ( orientation === 'vertical' ) {
				e.preventDefault();
				targetIndex = ( currentIndex + 1 ) % buttons.length;
				shouldActivate = activationMode === 'auto';
			}
			break;

		case 'ArrowUp':
			if ( orientation === 'vertical' ) {
				e.preventDefault();
				targetIndex = ( currentIndex - 1 + buttons.length ) % buttons.length;
				shouldActivate = activationMode === 'auto';
			}
			break;

		case 'Home':
			e.preventDefault();
			targetIndex = 0;
			shouldActivate = activationMode === 'auto';
			break;

		case 'End':
			e.preventDefault();
			targetIndex = buttons.length - 1;
			shouldActivate = activationMode === 'auto';
			break;

		case 'Enter':
		case ' ':
			// Manual activation: Enter/Space activates tab
			if ( activationMode === 'manual' ) {
				e.preventDefault();
				const allButtonsList = Array.from( allButtons );
				const actualIndex = allButtonsList.indexOf( currentButton );
				activateTab( block, actualIndex );
			}
			return;

		default:
			return;
	}

	// Focus (and optionally activate) target button with bounds check
	if (
		targetIndex !== currentIndex &&
		targetIndex >= 0 &&
		targetIndex < buttons.length &&
		buttons[ targetIndex ]
	) {
		buttons[ targetIndex ].focus();

		if ( shouldActivate ) {
			const allButtonsList = Array.from( allButtons );
			const actualIndex = allButtonsList.indexOf( buttons[ targetIndex ] );
			if ( actualIndex !== -1 && actualIndex < allButtonsList.length ) {
				activateTab( block, actualIndex );
			}
		}
	}
}

/**
 * Animate panel fade-in
 *
 * @param {HTMLElement} panel Panel element
 */
function animatePanelIn( panel ) {
	const duration = parseInt(
		getComputedStyle( panel ).getPropertyValue( '--transition-duration' ) || '200'
	);

	// Set initial state
	panel.style.opacity = '0';
	panel.style.transform = 'translateY( 10px )';

	// Force reflow
	panel.offsetHeight;

	// Animate in
	panel.style.transition = `opacity ${ duration }ms ease-in-out, transform ${ duration }ms ease-in-out`;
	panel.style.opacity = '1';
	panel.style.transform = 'translateY( 0 )';

	// Clean up after animation
	setTimeout( () => {
		panel.style.transition = '';
		panel.style.transform = '';
	}, duration );
}

/**
 * Initialize responsive accordion fallback
 *
 * @param {HTMLElement} block Parent block element
 */
function initializeResponsiveAccordion( block ) {
	if ( ! block ) {
		return;
	}

	const accordionFallback = block.querySelector( '.accordion-fallback' );

	if ( ! accordionFallback ) {
		return;
	}

	const accordionButtons = accordionFallback.querySelectorAll( '.accordion-button' );

	if ( ! accordionButtons || accordionButtons.length === 0 ) {
		return;
	}

	accordionButtons.forEach( ( button ) => {
		if ( ! button ) {
			return;
		}

		button.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			const panel = button.nextElementSibling;

			if ( ! panel ) {
				console.warn( 'Accordion panel not found' );
				return;
			}

			const isExpanded = button.getAttribute( 'aria-expanded' ) === 'true';

			// Toggle accordion item
			try {
				if ( isExpanded ) {
					button.setAttribute( 'aria-expanded', 'false' );
					panel.setAttribute( 'hidden', '' );
					animateAccordionClose( panel );
				} else {
					button.setAttribute( 'aria-expanded', 'true' );
					panel.removeAttribute( 'hidden' );
					animateAccordionOpen( panel );
				}
			} catch ( error ) {
				console.error( 'Failed to toggle accordion:', error );
			}
		} );
	} );
}

/**
 * Handle responsive mode switching
 */
function handleResponsiveMode() {
	const tabsBlocks = document.querySelectorAll( '.wp-block-tabs.responsive-accordion' );

	if ( ! tabsBlocks || tabsBlocks.length === 0 ) {
		return;
	}

	tabsBlocks.forEach( ( block ) => {
		try {
			if ( ! block ) {
				return;
			}

			const breakpoint = parseInt( block.getAttribute( 'data-breakpoint' ) || '768', 10 );
			const isMobile = window.innerWidth < breakpoint;

			const tabList = block.querySelector( '.tabs-list' );
			const tabPanels = block.querySelector( '.tabs-panels' );
			const accordionFallback = block.querySelector( '.accordion-fallback' );

			if ( ! tabList || ! tabPanels || ! accordionFallback ) {
				return;
			}

			if ( isMobile ) {
				// Switch to accordion mode
				tabList.style.display = 'none';
				tabPanels.style.display = 'none';
				accordionFallback.style.display = 'block';

				// Sync active tab to accordion
				const activeTabIndex = Array.from(
					block.querySelectorAll( '.tab-button' )
				).findIndex( ( btn ) => btn.getAttribute( 'aria-selected' ) === 'true' );

				const accordionItems = accordionFallback.querySelectorAll( '.accordion-item' );

				if ( accordionItems && accordionItems.length > 0 ) {
					accordionItems.forEach( ( item, index ) => {
						if ( ! item ) {
							return;
						}

						const button = item.querySelector( '.accordion-button' );
						const panel = item.querySelector( '.accordion-panel' );

						if ( button && panel ) {
							if ( index === activeTabIndex ) {
								button.setAttribute( 'aria-expanded', 'true' );
								panel.removeAttribute( 'hidden' );
							} else {
								button.setAttribute( 'aria-expanded', 'false' );
								panel.setAttribute( 'hidden', '' );
							}
						}
					} );
				}
			} else {
				// Switch back to tabs mode
				tabList.style.display = '';
				tabPanels.style.display = '';
				accordionFallback.style.display = 'none';
			}
		} catch ( error ) {
			console.error( 'Failed to handle responsive mode for block:', error );
		}
	} );
}

/**
 * Animate accordion panel opening
 *
 * @param {HTMLElement} panel Panel element
 */
function animateAccordionOpen( panel ) {
	const duration = parseInt(
		getComputedStyle( panel ).getPropertyValue( '--accordion-animation-duration' ) || '300'
	);

	// Ensure element is visible and set display property
	panel.style.display = 'block';
	panel.style.overflow = 'visible';
	panel.style.height = 'auto';
	panel.style.opacity = '1';

	// Force reflow to ensure browser has calculated the natural height
	panel.offsetHeight;

	// NOW get the accurate target height
	const targetHeight = panel.scrollHeight;

	// Set initial state - height and opacity to 0 for animation start
	panel.style.height = '0';
	panel.style.opacity = '0';
	panel.style.overflow = 'hidden';

	// Force reflow to ensure browser registers initial state before transition
	panel.offsetHeight;

	// Set transition BEFORE animating (critical for CSS transitions to work)
	panel.style.transition = `height ${ duration }ms ease-in-out, opacity ${ duration }ms ease-in-out`;

	// Animate to full height and opacity
	panel.style.height = `${ targetHeight }px`;
	panel.style.opacity = '1';

	// Clean up after animation completes using transitionend event
	const handleTransitionEnd = () => {
		panel.style.height = 'auto';
		panel.style.overflow = '';
		panel.style.transition = '';
		panel.removeEventListener( 'transitionend', handleTransitionEnd );
		panel.removeEventListener( 'transitioncancel', handleTransitionEnd );
	};

	panel.addEventListener( 'transitionend', handleTransitionEnd, { once: true } );
	panel.addEventListener( 'transitioncancel', handleTransitionEnd, { once: true } );
}

/**
 * Animate accordion panel closing
 *
 * @param {HTMLElement} panel Panel element
 */
function animateAccordionClose( panel ) {
	const duration = parseInt(
		getComputedStyle( panel ).getPropertyValue( '--accordion-animation-duration' ) || '300'
	);

	// Get current height BEFORE animation starts
	const currentHeight = panel.scrollHeight;

	// Set overflow hidden for animation
	panel.style.overflow = 'hidden';

	// Set explicit height (required before animation can work)
	panel.style.height = `${ currentHeight }px`;

	// Force reflow to ensure browser registers current height
	panel.offsetHeight;

	// Set transition BEFORE animating (critical for CSS transitions to work)
	panel.style.transition = `height ${ duration }ms ease-in-out, opacity ${ duration }ms ease-in-out`;

	// Animate to 0
	panel.style.height = '0';
	panel.style.opacity = '0';

	// Clean up after animation completes using transitionend event
	const handleTransitionEnd = () => {
		panel.style.transition = '';
		panel.style.overflow = '';
		panel.style.opacity = '';
		panel.style.height = '';
		panel.style.display = 'none';
		panel.removeEventListener( 'transitionend', handleTransitionEnd );
		panel.removeEventListener( 'transitioncancel', handleTransitionEnd );
	};

	panel.addEventListener( 'transitionend', handleTransitionEnd, { once: true } );
	panel.addEventListener( 'transitioncancel', handleTransitionEnd, { once: true } );
}

/**
 * Reinitialize tabs
 * Useful for dynamic content or after AJAX updates
 */
window.reinitializeTabs = initializeTabs;

/**
 * Export for potential imports
 */
export { initializeTabs, activateTab, handleResponsiveMode };
