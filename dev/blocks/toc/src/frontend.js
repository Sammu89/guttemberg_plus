/**
 * TOC Block - Frontend Functionality
 *
 * Handles client-side functionality:
 * - Heading detection and TOC generation
 * - Smooth scroll to anchors
 * - Active link highlighting (scroll spy)
 * - Collapsible toggle behavior
 * - Auto-add IDs to headings
 *
 * @package
 * @since 1.0.0
 */


/* global history */

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
	const blocks = document.querySelectorAll( '.gutplus-toc' );
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
 * Initialize all TOC blocks on the page
 */
function initializeTOCBlocks() {
	const tocBlocks = document.querySelectorAll( '.gutplus-toc' );

	if ( ! tocBlocks || tocBlocks.length === 0 ) {
		return; // Graceful exit, no TOC blocks found
	}

	tocBlocks.forEach( ( block ) => {
		try {
			if ( ! block ) {
				return;
			}

			const tocId = block.getAttribute( 'data-toc-id' );
			if ( ! tocId ) {
				return;
			}

			// Parse data attributes
			const config = {
				tocId,
				filterMode: block.getAttribute( 'data-filter-mode' ) || 'include-all',
				includeLevels: ( block.getAttribute( 'data-include-levels' ) || '2,3,4,5,6' )
					.split( ',' )
					.map( Number ),
				includeClasses: block.getAttribute( 'data-include-classes' ) || '',
				excludeLevels: ( block.getAttribute( 'data-exclude-levels' ) || '' )
					.split( ',' )
					.map( Number )
					.filter( Boolean ),
				excludeClasses: block.getAttribute( 'data-exclude-classes' ) || '',
				depthLimit: parseInt( block.getAttribute( 'data-depth-limit' ) || '0', 10 ) || null,
				includeAccordions: block.getAttribute( 'data-include-accordions' ) !== 'false',
				includeTabs: block.getAttribute( 'data-include-tabs' ) !== 'false',
				h1NumberingStyle: block.getAttribute( 'data-h1-numbering' ) || 'decimal',
				h2NumberingStyle: block.getAttribute( 'data-h2-numbering' ) || 'decimal',
				h3NumberingStyle: block.getAttribute( 'data-h3-numbering' ) || 'decimal',
				h4NumberingStyle: block.getAttribute( 'data-h4-numbering' ) || 'decimal',
				h5NumberingStyle: block.getAttribute( 'data-h5-numbering' ) || 'decimal',
				h6NumberingStyle: block.getAttribute( 'data-h6-numbering' ) || 'decimal',
				smoothScroll: block.getAttribute( 'data-smooth-scroll' ) === 'true',
				scrollOffset: parseInt( block.getAttribute( 'data-scroll-offset' ) || '0', 10 ),
				autoHighlight: block.getAttribute( 'data-auto-highlight' ) === 'true',
				isCollapsible: block.getAttribute( 'data-collapsible' ) === 'true',
				initiallyCollapsed: block.getAttribute( 'data-initially-collapsed' ) === 'true',
				clickBehavior: block.getAttribute( 'data-click-behavior' ) || 'navigate',
				enableHierarchicalIndent: block.getAttribute( 'data-enable-hierarchical-indent' ) === 'true',
				levelIndent: block.getAttribute( 'data-level-indent' ) || '1.25rem',
				showIcon: block.getAttribute( 'data-show-icon' ) !== 'false',
				iconClosed: block.getAttribute( 'data-icon-closed' ) || '▾',
				iconOpen: block.getAttribute( 'data-icon-open' ) || 'none',
				iconRotation: parseInt( block.getAttribute( 'data-icon-rotation' ) || '180', 10 ),
				includeH1: block.getAttribute( 'data-include-h1' ) !== 'false',
				includeH2: block.getAttribute( 'data-include-h2' ) !== 'false',
				includeH3: block.getAttribute( 'data-include-h3' ) !== 'false',
				includeH4: block.getAttribute( 'data-include-h4' ) !== 'false',
				includeH5: block.getAttribute( 'data-include-h5' ) !== 'false',
				includeH6: block.getAttribute( 'data-include-h6' ) !== 'false',
			};

			// Initialize this TOC
			initTOC( block, config );
		} catch ( error ) {
			// Continue with next block
		}
	} );
}

/**
 * Initialize a single TOC block
 * @param block
 * @param config
 */
function initTOC( block, config ) {
	if ( ! block || ! config ) {
		return;
	}

	try {
		const curatedItems = parseCuratedItems( block );

		// Detect headings
		const detectedHeadings = detectHeadings( block, config );
		const headings =
			curatedItems && curatedItems.length > 0
				? mapCuratedItemsToHeadings( curatedItems, detectedHeadings, config )
				: detectedHeadings;

		if ( ! headings ) {
			return;
		}

		// Auto-add IDs to headings without them
		headings.forEach( ( heading, index ) => {
			try {
				if ( heading && heading.element && ! heading.element.id ) {
					heading.element.id = `heading-${ config.tocId }-${ index }`;
					heading.id = heading.element.id;
				}
			} catch ( error ) {
			}
		} );

		// Generate TOC list
		const listContainer = block.querySelector( '.toc-list' );
		if ( listContainer ) {
			try {
				renderTOCList( listContainer, headings, config );
			} catch ( error ) {
			}
		}

		// Setup smooth scroll
		if ( config.smoothScroll ) {
			try {
				setupSmoothScroll( block, config );
			} catch ( error ) {
			}
		}

		// Setup scroll spy (active link highlighting)
		if ( config.autoHighlight ) {
			try {
				setupScrollSpy( block, headings );
			} catch ( error ) {
			}
		}

		// Setup collapsible behavior
		if ( config.isCollapsible ) {
			try {
				setupCollapsible( block, config );
			} catch ( error ) {
			}
		}
	} catch ( error ) {
	}
}

/**
 * Detect headings in the page content
 * @param tocBlock
 * @param config
 */
function detectHeadings( tocBlock, config ) {
	// Get all headings in the main content area only (not header/footer/sidebar)
	// Try multiple common WordPress content area selectors
	const contentArea = document.querySelector(
		'.entry-content, .post-content, .page-content, article .content, main.content, .site-content article'
	);

	if ( ! contentArea ) {
		return [];
	}

	// Build heading selector based on includeH1-H6 attributes
	const selectors = [];
	[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].forEach( ( level ) => {
		const includeAttr = config[ `include${ level.toUpperCase() }` ];
		if ( includeAttr !== false ) {
			selectors.push( level );
		}
	} );

	// If no headings are selected, return empty
	if ( selectors.length === 0 ) {
		return [];
	}

	const allHeadings = contentArea.querySelectorAll( selectors.join( ', ' ) );
	const detectedHeadings = [];

	allHeadings.forEach( ( heading ) => {
		// Skip headings inside TOC blocks
		if ( heading.closest( '.gutplus-toc' ) ) {
			return;
		}

		// Skip headings in header, footer, nav, sidebar, or aside elements
		if ( heading.closest( 'header, footer, nav, aside, .sidebar, .widget' ) ) {
			return;
		}

		const level = parseInt( heading.tagName.charAt( 1 ), 10 );

		// Detect if this is an accordion or tab heading
		// Accordion structure: <h2 class="accordion-heading"><button class="accordion-title">...</button></h2>
		// Tabs structure: <h2 class="tab-heading"><button class="tab-button">...</button></h2>
		const isAccordionHeading = heading.classList.contains( 'accordion-heading' );
		const isTabHeading = heading.classList.contains( 'tab-heading' );

		// Skip accordion headings if includeAccordions is false
		if ( isAccordionHeading && ! config.includeAccordions ) {
			return;
		}

		// Skip tab headings if includeTabs is false
		if ( isTabHeading && ! config.includeTabs ) {
			return;
		}

		// Extract text, excluding icons from accordion/tabs blocks
		// Accordion structure: <h2 class="accordion-heading"><button><span class="accordion-title-text">text</span>...</button></h2>
		// Tabs structure: <h2 class="tab-heading"><button><span class="tab-button-text">text</span>...</button></h2>
		let text = '';
		const titleTextEl = heading.querySelector( '.accordion-title-text, .tab-button-text' );
		if ( titleTextEl ) {
			// For accordion/tabs, get text from the specific span (excludes icons)
			text = titleTextEl.textContent.trim();
		} else {
			// For regular headings, use full text content
			text = heading.textContent.trim();
		}

		const id = heading.id || '';
		const classes = Array.from( heading.classList );

		// Apply filter
		if ( ! matchesFilter( { level, classes }, config ) ) {
			return;
		}

		detectedHeadings.push( {
			level,
			text,
			id,
			classes,
			element: heading,
		} );
	} );

	// Apply depth limit
	if ( config.depthLimit ) {
		const minLevel = Math.min( ...detectedHeadings.map( ( h ) => h.level ) );
		return detectedHeadings.filter( ( h ) => h.level - minLevel < config.depthLimit );
	}

	return detectedHeadings;
}

function parseCuratedItems( block ) {
	if ( ! block ) {
		return [];
	}

	const raw = block.getAttribute( 'data-toc-items' );
	if ( ! raw ) {
		return [];
	}

	try {
		const decoded = decodeURIComponent( raw );
		const parsed = JSON.parse( decoded );
		if ( Array.isArray( parsed ) ) {
			return parsed
				.filter( ( item ) => ! item.hidden ) // Filter out hidden items
				.map( ( item, index ) => {
					const anchor = item.anchor || item.id || `heading-${ index }`;
					return {
						anchor,
						id: anchor,
						text: item.text || '',
						level: item.level || 2,
					};
				} )
				.filter( ( item ) => item.id );
		}
	} catch ( error ) {
	}

	return [];
}

function normalizeTextForMatch( text = '' ) {
	return text.toString().trim().toLowerCase();
}

function mapCuratedItemsToHeadings( curatedItems, detectedHeadings, config ) {
	if ( ! Array.isArray( curatedItems ) || curatedItems.length === 0 ) {
		return detectedHeadings || [];
	}

	const detected = Array.isArray( detectedHeadings ) ? detectedHeadings : [];
	const detectedById = new Map();
	detected.forEach( ( heading ) => {
		if ( heading && heading.id ) {
			detectedById.set( heading.id, heading );
		}
	} );

	const used = new Set();

	return curatedItems.map( ( item, index ) => {
		const anchor = item.anchor || item.id || `heading-${ config?.tocId || 'toc' }-${ index }`;

		let match = detectedById.get( anchor );
		if ( ! match ) {
			match = detected.find( ( heading ) => {
				if ( used.has( heading ) ) {
					return false;
				}
				if ( item.level && heading.level !== item.level ) {
					return false;
				}
				return (
					normalizeTextForMatch( heading.text ) ===
					normalizeTextForMatch( item.text )
				);
			} );
		}

		if ( match ) {
			used.add( match );

			if ( match.element && match.element.id !== anchor ) {
				match.element.id = anchor;
			}

			return { ...match, id: anchor };
		}

		return {
			level: item.level || 2,
			text: item.text || '',
			id: anchor,
			element: null,
		};
	} );
}

/**
 * Check if heading matches filter criteria
 * Note: Heading level filtering is now handled by includeH1-H6 attributes in the selector,
 * so this function only needs to check class-based filters.
 * @param heading
 * @param config
 */
function matchesFilter( heading, config ) {
	const { filterMode, includeClasses, excludeClasses } = config;

	// Class-based filtering only applies when filterMode is set
	if ( filterMode === 'Include by class' ) {
		// Must match class
		const classMatches = includeClasses
			? includeClasses.split( ',' ).some( ( cls ) => heading.classes.includes( cls.trim() ) )
			: false;

		return classMatches;
	}

	if ( filterMode === 'Excluse by class' ) {
		// Exclude if class matches
		if ( excludeClasses ) {
			const classMatches = excludeClasses
				.split( ',' )
				.some( ( cls ) => heading.classes.includes( cls.trim() ) );
			if ( classMatches ) {
				return false;
			}
		}

		return true;
	}

	// Include all headings (default mode)
	return true;
}

/**
 * Render TOC list from headings
 * @param listContainer
 * @param headings
 * @param config
 */
function renderTOCList( listContainer, headings, config ) {
	// Clear placeholder
	listContainer.innerHTML = '';

	// Set CSS variables for hierarchical numbering
	listContainer.style.setProperty( '--toc-h1-numbering', config.h1NumberingStyle || 'decimal' );
	listContainer.style.setProperty( '--toc-h2-numbering', config.h2NumberingStyle || 'decimal' );
	listContainer.style.setProperty( '--toc-h3-numbering', config.h3NumberingStyle || 'decimal' );
	listContainer.style.setProperty( '--toc-h4-numbering', config.h4NumberingStyle || 'decimal' );
	listContainer.style.setProperty( '--toc-h5-numbering', config.h5NumberingStyle || 'decimal' );
	listContainer.style.setProperty( '--toc-h6-numbering', config.h6NumberingStyle || 'decimal' );

	// Add hierarchical numbering class and cascade data attributes
	listContainer.classList.add( 'toc-hierarchical-numbering' );
	listContainer.setAttribute( 'data-h1-numbering', config.h1NumberingStyle || 'decimal' );
	listContainer.setAttribute( 'data-h2-numbering', config.h2NumberingStyle || 'decimal' );
	listContainer.setAttribute( 'data-h3-numbering', config.h3NumberingStyle || 'decimal' );
	listContainer.setAttribute( 'data-h4-numbering', config.h4NumberingStyle || 'decimal' );
	listContainer.setAttribute( 'data-h5-numbering', config.h5NumberingStyle || 'decimal' );
	listContainer.setAttribute( 'data-h6-numbering', config.h6NumberingStyle || 'decimal' );

	// Determine base level (lowest heading level present) to avoid leading zeroes
	let baseLevel = headings.length > 0 ? Math.min( ...headings.map( ( h ) => h.level || 6 ) ) : 1;
	if ( ( config.h1NumberingStyle || 'decimal' ) === 'none' && baseLevel <= 1 ) {
		baseLevel = 2;
	}
	listContainer.setAttribute( 'data-base-level', baseLevel );

	if ( headings.length === 0 ) {
		listContainer.innerHTML = '<li class="toc-empty">No headings found.</li>';
		return;
	}

	// Build nested structure
	const fragment = document.createDocumentFragment();

	// Get indentation settings
	const enableHierarchical = config && config.enableHierarchicalIndent;
	const indentAmount = ( config && config.levelIndent ) || '1.25rem';

	// Track hierarchy for smart indentation
	const hierarchyStack = [];
	let previousLevel = null;

	headings.forEach( ( heading ) => {
		const li = document.createElement( 'li' );
		// Use actual heading level (h1-h6) directly without normalization
		li.className = `toc-item toc-h${ heading.level }`;

		// Calculate indentation level
		let indentLevel = 0;

		if ( enableHierarchical ) {
			// Smart hierarchical indentation
			if ( previousLevel === null ) {
				// First heading - no indent
				indentLevel = 0;
				hierarchyStack.push( heading.level );
			} else if ( heading.level > previousLevel ) {
				// Going deeper - indent one more level
				indentLevel = hierarchyStack.length;
				hierarchyStack.push( heading.level );
			} else if ( heading.level === previousLevel ) {
				// Same level - keep same indent
				indentLevel = hierarchyStack.length - 1;
			} else {
				// Going back up - find parent level
				while ( hierarchyStack.length > 0 && hierarchyStack[ hierarchyStack.length - 1 ] >= heading.level ) {
					hierarchyStack.pop();
				}
				indentLevel = hierarchyStack.length;
				hierarchyStack.push( heading.level );
			}

			previousLevel = heading.level;
		} else {
			// Traditional indentation based on absolute level
			// H1 = 0 indent, H2 = 1 indent, H3 = 2 indent, etc.
			indentLevel = heading.level - 1;
		}

		// Apply indentation via inline style
		if ( indentLevel > 0 ) {
			li.style.paddingLeft = `calc(${ indentLevel } * ${ indentAmount })`;
		}

		const link = document.createElement( 'a' );
		link.href = `#${ heading.id }`;
		link.className = 'toc-link';
		link.textContent = heading.text;
		link.setAttribute( 'data-heading-id', heading.id );

		li.appendChild( link );
		fragment.appendChild( li );
	} );

	listContainer.appendChild( fragment );
}

/**
 * Open parent accordion or tab if target element is inside one
 * @param targetElement - The heading element to navigate to
 * @returns {boolean} - True if an accordion/tab was opened, false otherwise
 */
function openParentAccordionOrTab( targetElement ) {
	if ( ! targetElement ) {
		return false;
	}

	let wasOpened = false;

	// Check if target is inside an accordion
	const accordionBlock = targetElement.closest( '.gutplus-accordion' );
	if ( accordionBlock ) {
		const accordionButton = accordionBlock.querySelector( '.accordion-title' );
		const accordionPanel = accordionBlock.querySelector( '.accordion-content' );

		if ( accordionButton && accordionPanel ) {
			const isOpen = accordionButton.getAttribute( 'aria-expanded' ) === 'true';

			// If accordion is closed, open it
			if ( ! isOpen ) {
				// Trigger click to open the accordion (reuses existing accordion logic)
				accordionButton.click();
				wasOpened = true;
			}
		}
	}

	// Check if target is a tab button or inside a tab heading
	let tabButton = null;

	// Case 1: Target is the tab button itself
	if ( targetElement.classList && targetElement.classList.contains( 'tab-button' ) ) {
		tabButton = targetElement;
	}
	// Case 2: Target is inside a tab heading (heading wraps the button)
	else if ( targetElement.closest && targetElement.closest( '.tab-heading' ) ) {
		const tabHeading = targetElement.closest( '.tab-heading' );
		tabButton = tabHeading.querySelector( '.tab-button' );
	}
	// Case 3: Target contains a tab button (e.g., target is the heading)
	else if ( targetElement.querySelector ) {
		tabButton = targetElement.querySelector( '.tab-button' );
	}

	// If we found a tab button, activate it if it's not already active
	if ( tabButton ) {
		const isActive = tabButton.getAttribute( 'aria-selected' ) === 'true';

		if ( ! isActive ) {
			// Trigger click to activate the tab (reuses existing tabs logic)
			tabButton.click();
			wasOpened = true;
		}
	}

	return wasOpened;
}

/**
 * Setup smooth scroll behavior
 * @param block
 * @param config
 */
function setupSmoothScroll( block, config ) {
	if ( ! block || ! config ) {
		return;
	}

	const links = block.querySelectorAll( '.toc-link' );

	if ( ! links || links.length === 0 ) {
		return;
	}

	links.forEach( ( link ) => {
		if ( ! link ) {
			return;
		}

		link.addEventListener( 'click', ( e ) => {
			try {
				e.preventDefault();

				const href = link.getAttribute( 'href' );
				if ( ! href || href.length <= 1 ) {
					return;
				}

				const targetId = href.slice( 1 );
				const targetElement = document.getElementById( targetId );

				if ( ! targetElement ) {
					return;
				}

				// Open accordion or tab if target is inside one
				const wasOpened = openParentAccordionOrTab( targetElement );

				// Function to perform scroll
				const performScroll = () => {
					// Determine scroll target element
					// For tabs and accordions, scroll to the parent block instead of the button/heading
					let scrollTarget = targetElement;

					// Check if target is a tab button or inside a tab heading
					const isTabButton = targetElement.classList && targetElement.classList.contains( 'tab-button' );
					const tabHeading = targetElement.closest && targetElement.closest( '.tab-heading' );

					if ( isTabButton || tabHeading ) {
						// Find parent tabs block
						const tabsBlock = targetElement.closest( '.gutplus-tabs' );
						if ( tabsBlock ) {
							scrollTarget = tabsBlock;
						}
					}

					// Check if target is an accordion heading or button
					const accordionHeading = targetElement.closest && targetElement.closest( '.accordion-heading' );
					const isAccordionButton = targetElement.classList && targetElement.classList.contains( 'accordion-title' );

					if ( accordionHeading || isAccordionButton ) {
						// Find parent accordion block
						const accordionBlock = targetElement.closest( '.gutplus-accordion' );
						if ( accordionBlock ) {
							scrollTarget = accordionBlock;
						}
					}

					// Calculate scroll position with offset
					const targetPosition =
						scrollTarget.getBoundingClientRect().top +
						window.pageYOffset -
						config.scrollOffset;

					// Smooth scroll
					window.scrollTo( {
						top: targetPosition,
						behavior: 'smooth',
					} );
				};

				// If we opened a tab/accordion, wait a bit for DOM to update before scrolling
				if ( wasOpened ) {
					setTimeout( performScroll, 50 );
				} else {
					performScroll();
				}

				// Update URL hash without jumping
				if ( history.pushState ) {
					history.pushState( null, null, `#${ targetId }` );
				} else {
					window.location.hash = targetId;
				}

				// Focus target for accessibility
				targetElement.focus( { preventScroll: true } );

				// Handle click behavior - collapse TOC if configured
				if ( config.clickBehavior === 'navigate-and-collapse' && config.isCollapsible && config.showIcon ) {
					// Wait for scroll to complete before collapsing
					setTimeout( () => {
						try {
							const toggleButton = block.querySelector( '.toc-toggle-button' );
							const content = block.querySelector( '.toc-content' );
							const icon = block.querySelector( '.toc-icon' );

							if ( toggleButton && content ) {
								// Collapse the TOC
								content.setAttribute( 'hidden', 'true' );
								toggleButton.setAttribute( 'aria-expanded', 'false' );
								block.classList.remove( 'is-open' );

								if ( icon ) {
									const iconClosed = toggleButton.getAttribute( 'data-icon-closed' ) || '▾';
									icon.textContent = iconClosed;
									icon.style.transform = 'rotate(0deg)';
								}
							}
						} catch ( error ) {
						}
					}, 600 ); // Match scroll duration
				}
			} catch ( error ) {
			}
		} );
	} );
}

/**
 * Setup scroll spy (active link highlighting)
 * @param block
 * @param headings
 */
function setupScrollSpy( block, headings ) {
	if ( ! block || ! headings || headings.length === 0 ) {
		return;
	}

	const links = block.querySelectorAll( '.toc-link' );

	if ( ! links || links.length === 0 ) {
		return;
	}

	const headingElements = headings.map( ( h ) => h.element ).filter( ( el ) => el );

	if ( headingElements.length === 0 ) {
		return;
	}

	// Remove all active classes
	const clearActive = () => {
		links.forEach( ( link ) => {
			if ( link ) {
				link.classList.remove( 'active' );
			}
		} );
	};

	// Set active link
	const setActive = ( headingId ) => {
		if ( ! headingId ) {
			return;
		}

		clearActive();
		const activeLink = block.querySelector( `.toc-link[data-heading-id="${ headingId }"]` );
		if ( activeLink ) {
			activeLink.classList.add( 'active' );
		}
	};

	// Throttled scroll handler
	let ticking = false;

	const onScroll = () => {
		if ( ! ticking ) {
			window.requestAnimationFrame( () => {
				try {
					// Find current heading (first visible heading from top)
					const scrollPos = window.pageYOffset + 100; // 100px offset

					let currentHeading = null;

					for ( let i = headingElements.length - 1; i >= 0; i-- ) {
						const heading = headingElements[ i ];
						if ( heading && heading.offsetTop !== undefined ) {
							const headingTop = heading.offsetTop;

							if ( scrollPos >= headingTop ) {
								currentHeading = heading;
								break;
							}
						}
					}

					if ( currentHeading && currentHeading.id ) {
						setActive( currentHeading.id );
					} else {
						clearActive();
					}
				} catch ( error ) {
				}

				ticking = false;
			} );

			ticking = true;
		}
	};

	// Initial check
	try {
		onScroll();
	} catch ( error ) {
	}

	// Listen to scroll
	window.addEventListener( 'scroll', onScroll, { passive: true } );
}

/**
 * Update TOC icon based on open/closed state
 * Handles new icon system with character, image, and library icons
 *
 * @param {HTMLElement} icon Icon element
 * @param {boolean}     isOpen Whether TOC is open
 */
function updateTocIcon( icon, isOpen ) {
	if ( ! icon ) {
		return;
	}

	try {
		// Get data attributes
		const inactiveData = icon.getAttribute( 'data-icon-inactive' );
		const activeData = icon.getAttribute( 'data-icon-active' );
		const hasDifferentIcons = icon.getAttribute( 'data-has-different-icons' ) === 'true';

		if ( ! inactiveData ) {
			return;
		}

		const inactiveSource = JSON.parse( inactiveData );
		const activeSource = activeData ? JSON.parse( activeData ) : null;

		// If we have different icons for active/inactive, swap the icon content
		if ( hasDifferentIcons && activeSource ) {
			const targetSource = isOpen ? activeSource : inactiveSource;

			// Update icon based on kind
			if ( targetSource.kind === 'char' ) {
				icon.textContent = targetSource.value;
			} else if ( targetSource.kind === 'image' ) {
				icon.setAttribute( 'src', targetSource.value );
			} else if ( targetSource.kind === 'library' ) {
				const [ library, iconName ] = targetSource.value.split( ':' );

				if ( library === 'dashicons' ) {
					// Update Dashicon classes
					const dashiconSpan = icon.querySelector( '.dashicons' );
					if ( dashiconSpan ) {
						dashiconSpan.className = `dashicons dashicons-${ iconName }`;
					}
				}
				// Note: Lucide icons would need SVG re-rendering, which is handled by CSS

				// Update data attributes for library icons
				icon.setAttribute( 'data-icon-library', library );
				icon.setAttribute( 'data-icon-name', iconName );
			}
		}

		// Toggle rotation class for CSS animation
		if ( isOpen ) {
			icon.classList.add( 'is-rotated' );
		} else {
			icon.classList.remove( 'is-rotated' );
		}
	} catch ( error ) {
		// Fallback to old behavior if parsing fails
		// console.error( 'Error updating TOC icon:', error );
	}
}

/**
 * Setup collapsible toggle behavior
 * @param block
 * @param config
 */
function setupCollapsible( block, config ) {
	if ( ! block || ! config ) {
		return;
	}

	const toggleButton = block.querySelector( '.toc-toggle-button' );
	const content = block.querySelector( '.toc-content' );
	const icon = block.querySelector( '.toc-icon' );

	if ( ! toggleButton || ! content ) {
		return;
	}

	// Get icon data attributes
	const showIcon = config.showIcon !== false;

	// If showIcon is false, don't allow toggling
	if ( ! showIcon ) {
		// Remove click handlers to prevent collapse/expand
		return;
	}

	// Set initial state
	const isCollapsed = config.initiallyCollapsed;
	if ( isCollapsed ) {
		content.setAttribute( 'hidden', 'true' );
	} else {
		content.removeAttribute( 'hidden' );
		block.classList.add( 'is-open' );
	}
	toggleButton.setAttribute( 'aria-expanded', ! isCollapsed );

	// Apply initial icon state
	if ( icon && ! isCollapsed ) {
		updateTocIcon( icon, true );
	}

	// Toggle function
	const toggle = () => {
		try {
			const isCurrentlyCollapsed = content.hasAttribute( 'hidden' );

			if ( isCurrentlyCollapsed ) {
				// Expand
				content.removeAttribute( 'hidden' );
				toggleButton.setAttribute( 'aria-expanded', 'true' );
				block.classList.add( 'is-open' );

				// Update icon
				updateTocIcon( icon, true );
			} else {
				// Collapse
				content.setAttribute( 'hidden', 'true' );
				toggleButton.setAttribute( 'aria-expanded', 'false' );
				block.classList.remove( 'is-open' );

				// Update icon
				updateTocIcon( icon, false );
			}
		} catch ( error ) {
		}
	};

	// Click handler
	toggleButton.addEventListener( 'click', toggle );

	// Keyboard handler
	toggleButton.addEventListener( 'keydown', ( e ) => {
		if ( ! e ) {
			return;
		}

		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			toggle();
		}
	} );
}

/**
 * Initialize on DOM ready
 */
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', () => {
		try {
			updateDeviceAttributes();
			initializeTOCBlocks();
		} catch ( error ) {
		}
	} );
} else {
	try {
		initializeTOCBlocks();
	} catch ( error ) {
	}
}

/**
 * Export functions for potential reuse
 */
export { initializeTOCBlocks, detectHeadings, setupSmoothScroll, setupScrollSpy, setupCollapsible, openParentAccordionOrTab, updateTocIcon };
