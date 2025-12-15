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
		// console.error( 'Accordion block initialization failed:', error );
	}
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

		if ( ! button || ! panel ) {
			// console.warn( 'Accordion item structure incomplete, skipping' );
			return;
		}

		// Add click handler
		button.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			try {
				toggleAccordion( item, button, panel, block );
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
			openAccordionItem( item, button, panel, false );
		}
	} catch ( error ) {
		// console.error( 'Failed to initialize accordion item:', error );
	}
}

/**
 * Toggle accordion item open/closed
 * Each item can be independently opened/closed based on its "Initially Open" toggle
 *
 * @param {HTMLElement} item   Accordion item element
 * @param {HTMLElement} button Toggle button
 * @param {HTMLElement} panel  Content panel
 * @param {HTMLElement} block  Parent block
 */
function toggleAccordion( item, button, panel, block ) {
	const isOpen = item.classList.contains( 'is-open' );

	if ( isOpen ) {
		// Close this item
		closeAccordionItem( item, button, panel );
	} else {
		// Open this item - other items stay as they are
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
	panel.style.display = '';

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

		if ( button && panel ) {
			closeAccordionItem( block, button, panel );
		}
	}
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

	// Toggle rotation class for CSS animation (rotates immediately)
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
	console.log( '🔵 [OPEN] Starting animation' );

	// Get animation duration from CSS variable
	const duration = parseInt(
		getComputedStyle( panel ).getPropertyValue( '--accordion-animation-duration' ) || '300'
	);
	console.log( '🔵 [OPEN] Duration:', duration + 'ms' );

	// Step 1: Clear ALL inline styles first to ensure clean measurement
	panel.style.cssText = '';
	panel.removeAttribute( 'hidden' );
	panel.style.display = 'block';
	// CRITICAL FIX: Add transparent border to create Block Formatting Context
	// This prevents margin collapse during transitions (margins won't escape the container)
	panel.style.borderTop = '1px solid transparent';
	panel.style.overflow = 'hidden';
	console.log( '🔵 [OPEN] Cleared all inline styles, set display=block, overflow=hidden, BFC border' );

	// Force reflow
	panel.offsetHeight;

	// ====================================
	// DIAGNOSTIC CODE: Monitor what changes between measurement and animation
	// ====================================
	const diagnosticInfo = {
		initialScrollHeight: panel.scrollHeight,
		measurements: [],
		mutations: [],
		images: [],
		fonts: []
	};

	// Check all images in the panel
	const images = panel.querySelectorAll( 'img' );
	console.log( '🔍 [DIAGNOSTIC] Found', images.length, 'images in panel' );
	images.forEach( ( img, index ) => {
		const imgInfo = {
			index,
			src: img.src,
			complete: img.complete,
			naturalWidth: img.naturalWidth,
			naturalHeight: img.naturalHeight,
			width: img.width,
			height: img.height,
			hasExplicitDimensions: img.hasAttribute( 'width' ) && img.hasAttribute( 'height' )
		};
		diagnosticInfo.images.push( imgInfo );
		console.log( `🔍 [DIAGNOSTIC] Image ${index}:`, imgInfo );

		if ( ! img.complete ) {
			img.addEventListener( 'load', () => {
				console.log( '🖼️ [DIAGNOSTIC] Image', index, 'loaded AFTER measurement!', img.src );
				console.log( '🖼️ [DIAGNOSTIC] New scrollHeight:', panel.scrollHeight );
			} );
		}
	} );

	// Monitor DOM mutations
	const mutationObserver = new MutationObserver( ( mutations ) => {
		mutations.forEach( ( mutation ) => {
			const mutationInfo = {
				type: mutation.type,
				target: mutation.target.tagName,
				addedNodes: mutation.addedNodes.length,
				removedNodes: mutation.removedNodes.length,
				attributeName: mutation.attributeName,
				oldValue: mutation.oldValue
			};
			diagnosticInfo.mutations.push( mutationInfo );
			console.log( '🧬 [DIAGNOSTIC] DOM Mutation:', mutationInfo );
			console.log( '🧬 [DIAGNOSTIC] New scrollHeight:', panel.scrollHeight );
		} );
	} );

	mutationObserver.observe( panel, {
		childList: true,
		attributes: true,
		characterData: true,
		subtree: true,
		attributeOldValue: true
	} );

	// Monitor font loading
	if ( document.fonts && document.fonts.ready ) {
		const fontsReady = document.fonts.check( '1em sans-serif', panel.textContent );
		console.log( '🔤 [DIAGNOSTIC] Fonts ready:', fontsReady );

		document.fonts.ready.then( () => {
			console.log( '🔤 [DIAGNOSTIC] All fonts loaded' );
			console.log( '🔤 [DIAGNOSTIC] New scrollHeight:', panel.scrollHeight );
		} );
	}

	// Measure height multiple times with small delays to catch changes
	const measureHeightOverTime = () => {
		const times = [ 0, 10, 50, 100, 200, 300 ];
		times.forEach( ( delay ) => {
			setTimeout( () => {
				const measurement = {
					time: delay,
					scrollHeight: panel.scrollHeight,
					offsetHeight: panel.offsetHeight,
					clientHeight: panel.clientHeight
				};
				diagnosticInfo.measurements.push( measurement );
				console.log( `📏 [DIAGNOSTIC] Measurement at ${delay}ms:`, measurement );
			}, delay );
		} );
	};

	measureHeightOverTime();

	// Now measure the natural height
	let computedStyle = getComputedStyle( panel );
	console.log( '🔵 [OPEN] Computed height:', computedStyle.height );
	console.log( '🔵 [OPEN] Computed padding:', computedStyle.paddingTop, computedStyle.paddingBottom );
	console.log( '🔵 [OPEN] Computed font-family:', computedStyle.fontFamily );
	console.log( '🔵 [OPEN] Computed line-height:', computedStyle.lineHeight );
	console.log( '🔵 [OPEN] offsetHeight:', panel.offsetHeight );
	console.log( '🔵 [OPEN] scrollHeight:', panel.scrollHeight );
	console.log( '🔵 [OPEN] clientHeight:', panel.clientHeight );

	// Check all child elements
	const children = panel.children;
	console.log( '🔍 [DIAGNOSTIC] Panel has', children.length, 'direct children' );
	for ( let i = 0; i < children.length; i++ ) {
		const child = children[ i ];
		const childStyle = getComputedStyle( child );
		console.log( `🔍 [DIAGNOSTIC] Child ${i} (${child.tagName}):`, {
			offsetHeight: child.offsetHeight,
			marginTop: childStyle.marginTop,
			marginBottom: childStyle.marginBottom,
			display: childStyle.display
		} );
	}

	// CRITICAL: Set a temporary explicit height to force margins NOT to collapse
	// This way we measure the same height we'll see during animation
	const tempHeight = panel.scrollHeight;
	console.log( '🔍 [DIAGNOSTIC] Initial scrollHeight (margins may be collapsed):', tempHeight );

	panel.style.height = tempHeight + 'px';
	panel.offsetHeight; // force reflow

	const targetHeight = panel.scrollHeight;
	console.log( '🔍 [DIAGNOSTIC] Final scrollHeight with explicit height (margins NOT collapsed):', targetHeight );

	const targetBorderTopWidth = computedStyle.borderTopWidth;
	console.log( '🔵 [OPEN] Target height for animation:', targetHeight + 'px', 'borderTopWidth:', targetBorderTopWidth );

	// Step 2: Set initial collapsed state for animation
	panel.style.height = '0';
	panel.style.opacity = '0';
	// BFC border and overflow:hidden already set above
	console.log( '🔵 [OPEN] Set initial state (height=0, opacity=0)' );

	// Force reflow to ensure browser registers initial state before transition
	panel.offsetHeight;

	// Step 3: Set transition BEFORE animating
	panel.style.transition = `height ${ duration }ms ease-in-out, opacity ${ duration }ms ease-in-out`;
	console.log( '🔵 [OPEN] Transition set' );

	// Step 4: Trigger animation to full height
	panel.style.height = `${ targetHeight }px`;
	panel.style.opacity = '1';
	console.log( '🔵 [OPEN] Animation triggered to height:', targetHeight + 'px' );

	// Clean up after animation completes using transitionend event
	// Only listen for height transition to avoid multiple firings
	const handleTransitionEnd = ( e ) => {
		console.log( '🔵 [OPEN] transitionend fired for property:', e.propertyName );

		// Only respond to height transition end to avoid cleanup on opacity/border transitions
		if ( e.propertyName !== 'height' ) {
			console.log( '🔵 [OPEN] Ignoring transitionend for', e.propertyName );
			return;
		}

		console.log( '🔵 [OPEN] Height before cleanup:', panel.style.height );
		console.log( '🔵 [OPEN] scrollHeight before cleanup:', panel.scrollHeight );

		// Disconnect mutation observer
		mutationObserver.disconnect();

		// Print diagnostic summary
		console.log( '📊 [DIAGNOSTIC SUMMARY]', diagnosticInfo );
		console.log( '📊 [DIAGNOSTIC] Height changed by:', panel.scrollHeight - diagnosticInfo.initialScrollHeight, 'px' );

		// CRITICAL: Remove transition FIRST, then set height to auto
		// This prevents any jump if auto height differs from animated height
		panel.style.transition = '';
		panel.style.height = 'auto';
		panel.style.overflow = '';
		panel.style.borderTop = '';

		console.log( '🔵 [OPEN] Cleanup complete. Final scrollHeight:', panel.scrollHeight );

		panel.removeEventListener( 'transitionend', handleTransitionEnd );
		panel.removeEventListener( 'transitioncancel', handleTransitionEnd );
	};

	panel.addEventListener( 'transitionend', handleTransitionEnd );
	panel.addEventListener( 'transitioncancel', handleTransitionEnd );
}

/**
 * Animate panel closing
 *
 * @param {HTMLElement} panel    Content panel
 * @param {Function}    callback Callback after animation
 */
function animateClose( panel, callback ) {
	console.log( '🔴 [CLOSE] Starting animation' );

	// Get animation duration from CSS variable
	const duration = parseInt(
		getComputedStyle( panel ).getPropertyValue( '--accordion-animation-duration' ) || '300'
	);
	console.log( '🔴 [CLOSE] Duration:', duration + 'ms' );

	// Get current height BEFORE animation starts
	const currentHeight = panel.scrollHeight;
	console.log( '🔴 [CLOSE] Current scrollHeight:', currentHeight + 'px' );

	// Set overflow hidden for animation
	panel.style.overflow = 'hidden';

	// Set explicit height (required before animation can work)
	panel.style.height = `${ currentHeight }px`;
	console.log( '🔴 [CLOSE] Set explicit height:', currentHeight + 'px' );

	// Force reflow to ensure browser registers current height
	panel.offsetHeight;

	// Set transition BEFORE animating (critical for CSS transitions to work)
	panel.style.transition = `height ${ duration }ms ease-in-out, opacity ${ duration }ms ease-in-out`;
	console.log( '🔴 [CLOSE] Transition set' );

	// Animate to 0
	panel.style.height = '0';
	panel.style.opacity = '0';
	console.log( '🔴 [CLOSE] Animation triggered to height: 0' );

	// Execute callback after animation completes using transitionend event
	// Only listen for height transition to avoid multiple firings
	const handleTransitionEnd = ( e ) => {
		console.log( '🔴 [CLOSE] transitionend fired for property:', e.propertyName );

		// Only respond to height transition end to avoid cleanup on opacity/border transitions
		if ( e.propertyName !== 'height' ) {
			console.log( '🔴 [CLOSE] Ignoring transitionend for', e.propertyName );
			return;
		}

		console.log( '🔴 [CLOSE] Cleanup starting' );

		// Remove transition first to prevent any unwanted animations
		panel.style.transition = '';
		panel.style.overflow = '';
		panel.removeEventListener( 'transitionend', handleTransitionEnd );
		panel.removeEventListener( 'transitioncancel', handleTransitionEnd );

		console.log( '🔴 [CLOSE] Cleanup complete, executing callback' );

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
