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
		updateDeviceAttributes();
		initializeTabs();
		handleResponsiveMode();
	} catch ( error ) {
		console.error( 'Tabs block initialization failed:', error );
	}
} );

/**
 * Check if orientation is any vertical variant
 *
 * @param {string} orientation - The orientation value
 * @return {boolean} True if vertical-left or vertical-right
 */
function isVerticalOrientation( orientation ) {
	return orientation === 'vertical-left' || orientation === 'vertical-right';
}

/**
 * Handle window resize for responsive mode
 */
window.addEventListener( 'resize', () => {
	try {
		updateDeviceAttributes();
		handleResponsiveMode();
	} catch ( error ) {
		console.error( 'Failed to handle responsive mode:', error );
	}
} );

const DEFAULT_BREAKPOINTS = {
	tablet: 1024,
	mobile: 600,
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
	return 'desktop';
}

function updateDeviceAttributes() {
	const blocks = document.querySelectorAll( '.gutplus-tabs' );
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

/**
 * Initialize all tabs blocks on the page
 */
function initializeTabs() {
	const tabsBlocks = document.querySelectorAll( '.gutplus-tabs' );

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
	const activationModeRaw =
		block.getAttribute( 'data-activation-mode' ) || 'click';
	const activationMode = activationModeRaw === 'hover' ? 'hover' : 'click';
	const responsiveFallback = block.getAttribute( 'data-responsive-fallback' ) === 'true';

	// Find tab list and panels
	const tabList = block.querySelector( '.tabs-list' );
	const tabPanels = block.querySelectorAll( '.tab-panel' );

	// Check for required structure
	if ( ! tabList || tabPanels.length === 0 ) {
		console.warn( 'Tabs block structure incomplete (missing tabList or panels), skipping' );
		return;
	}

	// Get server-rendered buttons
	const tabButtons = tabList.querySelectorAll( '.tab-button' );

	// Verify buttons exist
	if ( ! tabButtons || tabButtons.length === 0 ) {
		console.warn( 'No tab buttons found, skipping' );
		return;
	}

	// Set up initial panel visibility based on active tab
	const currentTab = parseInt( tabList.getAttribute( 'data-current-tab' ) || '0', 10 );
	tabPanels.forEach( ( panel, index ) => {
		if ( index === currentTab ) {
			panel.removeAttribute( 'hidden' );
			panel.classList.add( 'active' );
			panel.setAttribute( 'tabindex', '0' );
		} else {
			panel.setAttribute( 'hidden', '' );
			panel.classList.remove( 'active' );
			panel.setAttribute( 'tabindex', '-1' );
		}
	} );

	// Normalize initial tab button state and icons based on currentTab
	tabButtons.forEach( ( button, index ) => {
		const isActive = index === currentTab;
		if ( isActive ) {
			button.setAttribute( 'aria-selected', 'true' );
			button.setAttribute( 'tabindex', '0' );
			button.classList.add( 'active' );
		} else {
			button.setAttribute( 'aria-selected', 'false' );
			button.setAttribute( 'tabindex', '-1' );
			button.classList.remove( 'active' );
		}
		updateTabIcon( button, isActive );
	} );

	// Initialize each tab button
	tabButtons.forEach( ( button, index ) => {
		try {
			// Click handler
			button.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				if ( button.disabled || button.getAttribute( 'aria-selected' ) === 'true' ) {
					return;
				}
				try {
					activateTab( block, index );
				} catch ( error ) {
					console.error( 'Failed to activate tab:', error );
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

			// Focus handler for hover activation mode (keyboard users)
			if ( activationMode === 'hover' ) {
				button.addEventListener( 'focus', () => {
					// Avoid double-activation when click also triggers focus
					if ( button.disabled || button.getAttribute( 'aria-selected' ) === 'true' ) {
						return;
					}
					try {
						activateTab( block, index );
					} catch ( error ) {
						console.error( 'Failed to activate tab on focus:', error );
					}
				} );
			}

			// Hover activation
			if ( activationMode === 'hover' ) {
				button.addEventListener( 'mouseenter', () => {
					if ( button.disabled || button.getAttribute( 'aria-selected' ) === 'true' ) {
						return;
					}
					try {
						activateTab( block, index, { isHover: true } );
					} catch ( error ) {
						console.error( 'Failed to activate tab on hover:', error );
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

	// Initialize horizontal scroll functionality
	if ( orientation === 'horizontal' ) {
		try {
			initializeTabScroll( block );
		} catch ( error ) {
			console.error( 'Failed to initialize tab scroll:', error );
		}
	}
}

/**
 * Initialize horizontal tab scrolling with navigation buttons
 *
 * @param {HTMLElement} block Parent block element
 */
function initializeTabScroll( block ) {
	if ( ! block ) {
		return;
	}

	const wrapper = block.querySelector( '.tabs-list-wrapper' );
	const tabList = block.querySelector( '.tabs-list' );
	const scrollLeft = block.querySelector( '.tabs-scroll-button.scroll-left' );
	const scrollRight = block.querySelector( '.tabs-scroll-button.scroll-right' );

	if ( ! wrapper || ! tabList || ! scrollLeft || ! scrollRight ) {
		return;
	}

	// Function to check if tabs overflow
	const checkOverflow = () => {
		const hasOverflow = tabList.scrollWidth > tabList.clientWidth;

		if ( hasOverflow ) {
			wrapper.classList.add( 'has-overflow' );
		} else {
			wrapper.classList.remove( 'has-overflow' );
		}

		updateScrollButtons();
	};

	// Function to update scroll button states
	const updateScrollButtons = () => {
		const tabButtons = tabList.querySelectorAll( '.tab-button, .tab-heading' );
		if ( ! tabButtons || tabButtons.length === 0 ) {
			return;
		}

		const containerRect = tabList.getBoundingClientRect();
		const firstTab = tabButtons[ 0 ];
		const lastTab = tabButtons[ tabButtons.length - 1 ];

		if ( ! firstTab || ! lastTab ) {
			return;
		}

		const firstTabRect = firstTab.getBoundingClientRect();
		const lastTabRect = lastTab.getBoundingClientRect();

		// Disable left button only if the ENTIRE first tab is fully visible
		// (its left edge is at or after the container's left edge)
		scrollLeft.disabled = firstTabRect.left >= containerRect.left - 1;

		// Disable right button only if the ENTIRE last tab is fully visible
		// (its right edge is at or before the container's right edge)
		scrollRight.disabled = lastTabRect.right <= containerRect.right + 1;
	};

	// Scroll amount (200px or 1/3 of visible width, whichever is larger)
	const getScrollAmount = () => {
		return Math.max( 200, tabList.clientWidth / 3 );
	};

	// Scroll left button handler
	scrollLeft.addEventListener( 'click', () => {
		tabList.scrollBy( {
			left: -getScrollAmount(),
			behavior: 'smooth',
		} );
	} );

	// Scroll right button handler
	scrollRight.addEventListener( 'click', () => {
		tabList.scrollBy( {
			left: getScrollAmount(),
			behavior: 'smooth',
		} );
	} );

	// Update on scroll
	tabList.addEventListener( 'scroll', updateScrollButtons );

	// Initial check
	checkOverflow();

	// Check on window resize
	const resizeObserver = new ResizeObserver( checkOverflow );
	resizeObserver.observe( tabList );

	// Auto-scroll active tab into view
	const activeButton = tabList.querySelector( '.tab-button[aria-selected="true"]' );
	if ( activeButton ) {
		setTimeout( () => {
			activeButton.scrollIntoView( {
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center',
			} );
		}, 100 );
	}
}

/**
 * Activate a specific tab
 *
 * @param {HTMLElement} block Parent block element
 * @param {number}      index Tab index to activate
 * @param {Object}      options Optional settings for activation
 */
function activateTab( block, index, options = {} ) {
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
			// Update icon rotation
			updateTabIcon( button, false );
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
	// Update icon rotation for active tab
	updateTabIcon( tabButtons[ index ], true );

	if ( tabPanels[ index ] ) {
		tabPanels[ index ].removeAttribute( 'hidden' );
		tabPanels[ index ].style.display = '';
		tabPanels[ index ].classList.add( 'active' );
		// CSS animation handles the fade-in via .active class (no JS animation needed)
	}

	// Scroll active tab into view for horizontal tabs
	const orientation = block.getAttribute( 'data-orientation' );
	const isHover = options.isHover || false;

	if ( ! orientation || orientation === 'horizontal' ) {
		// For hover activations, use a longer delay and debounce to prevent rapid scrolling
		// For click activations, scroll immediately with short delay
		const scrollDelay = isHover ? 400 : 50;

		// Clear any pending scroll timeout for this block
		if ( ! block._scrollTimeout ) {
			block._scrollTimeouts = {};
		}

		if ( block._scrollTimeouts[ index ] ) {
			clearTimeout( block._scrollTimeouts[ index ] );
		}

		block._scrollTimeouts[ index ] = setTimeout( () => {
			tabButtons[ index ].scrollIntoView( {
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center',
			} );
			delete block._scrollTimeouts[ index ];
		}, scrollDelay );
	}
}

/**
 * Update tab icon based on active state
 * Handles both icon content changes and rotation
 *
 * @param {HTMLElement} button Tab button element
 * @param {boolean}     isActive Whether tab is active
 */
function updateTabIcon( button, isActive ) {
	const icon = button.querySelector( '.tab-icon' );

	if ( ! icon ) {
		return;
	}

		const iconClosed = icon.getAttribute( 'data-icon-closed' ) || '▾';
		const iconOpen = icon.getAttribute( 'data-icon-open' ) || 'none';

		// Check if icon needs to change (not just rotate)
		const isImage = icon.classList.contains( 'tab-icon-image' );
		const newIcon = isActive ? iconOpen : iconClosed;
		const currentIcon = isImage ? icon.src : icon.textContent;
		const iconIsChanging = newIcon !== 'none' && currentIcon !== newIcon;

	// Change icon content if needed
		if ( iconIsChanging ) {
			if ( isImage ) {
				// For image icons, update src
				icon.src = newIcon;
			} else {
				// For text/emoji icons, update text content
				icon.textContent = newIcon;
			}
		}

		// Toggle rotation class for CSS animation
		if ( isActive ) {
			icon.classList.add( 'is-rotated' );
		} else {
			icon.classList.remove( 'is-rotated' );
		}
	}

/**
 * Handle keyboard navigation for tabs
 *
 * @param {KeyboardEvent} e              Keyboard event
 * @param {HTMLElement}   currentButton  Current button
 * @param {NodeList}      allButtons     All tab buttons
 * @param {string}        orientation    Horizontal or vertical
 * @param {string}        activationMode click or hover
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
				shouldActivate = activationMode === 'hover';
			}
			break;

		case 'ArrowLeft':
			if ( orientation === 'horizontal' ) {
				e.preventDefault();
				targetIndex = ( currentIndex - 1 + buttons.length ) % buttons.length;
				shouldActivate = activationMode === 'hover';
			}
			break;

		case 'ArrowDown':
			if ( isVerticalOrientation( orientation ) ) {
				e.preventDefault();
				targetIndex = ( currentIndex + 1 ) % buttons.length;
				shouldActivate = activationMode === 'hover';
			}
			break;

		case 'ArrowUp':
			if ( isVerticalOrientation( orientation ) ) {
				e.preventDefault();
				targetIndex = ( currentIndex - 1 + buttons.length ) % buttons.length;
				shouldActivate = activationMode === 'hover';
			}
			break;

		case 'Home':
			e.preventDefault();
			targetIndex = 0;
			shouldActivate = activationMode === 'hover';
			break;

		case 'End':
			e.preventDefault();
			targetIndex = buttons.length - 1;
			shouldActivate = activationMode === 'hover';
			break;

		case 'Enter':
		case ' ':
			// Click activation: Enter/Space activates tab
			if ( activationMode === 'click' ) {
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
	// Removed animatePanelIn: relying on simple CSS state change without extra JS animation

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
	const tabsBlocks = document.querySelectorAll( '.gutplus-tabs.responsive-accordion' );

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
