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
				console.warn( 'TOC block missing data-toc-id attribute, skipping' );
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
				numberingStyle: block.getAttribute( 'data-numbering-style' ) || 'none',
				smoothScroll: block.getAttribute( 'data-smooth-scroll' ) === 'true',
				scrollOffset: parseInt( block.getAttribute( 'data-scroll-offset' ) || '0', 10 ),
				autoHighlight: block.getAttribute( 'data-auto-highlight' ) === 'true',
				isCollapsible: block.getAttribute( 'data-collapsible' ) === 'true',
				initiallyCollapsed: block.getAttribute( 'data-initially-collapsed' ) === 'true',
				clickBehavior: block.getAttribute( 'data-click-behavior' ) || 'navigate',
				enableHierarchicalIndent: block.getAttribute( 'data-enable-hierarchical-indent' ) === 'true',
				levelIndent: block.getAttribute( 'data-level-indent' ) || '1.25rem',
			};

			// Initialize this TOC
			initTOC( block, config );
		} catch ( error ) {
			console.error( 'Failed to initialize TOC block:', error );
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
		console.warn( 'Invalid block or config in initTOC' );
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
			console.warn( 'Failed to detect headings' );
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
				console.error( 'Failed to add ID to heading:', error );
			}
		} );

		// Generate TOC list
		const listContainer = block.querySelector( '.toc-list' );
		if ( listContainer ) {
			try {
				renderTOCList( listContainer, headings, config );
			} catch ( error ) {
				console.error( 'Failed to render TOC list:', error );
			}
		}

		// Setup smooth scroll
		if ( config.smoothScroll ) {
			try {
				setupSmoothScroll( block, config );
			} catch ( error ) {
				console.error( 'Failed to setup smooth scroll:', error );
			}
		}

		// Setup scroll spy (active link highlighting)
		if ( config.autoHighlight ) {
			try {
				setupScrollSpy( block, headings );
			} catch ( error ) {
				console.error( 'Failed to setup scroll spy:', error );
			}
		}

		// Setup collapsible behavior
		if ( config.isCollapsible ) {
			try {
				setupCollapsible( block, config );
			} catch ( error ) {
				console.error( 'Failed to setup collapsible:', error );
			}
		}
	} catch ( error ) {
		console.error( 'Failed to initialize TOC:', error );
	}
}

/**
 * Detect headings in the page content
 * @param tocBlock
 * @param config
 */
function detectHeadings( tocBlock, config ) {
	// Get all headings in the main content
	const contentArea = document.querySelector( '.entry-content, main, article, body' );
	if ( ! contentArea ) {
		return [];
	}

	const allHeadings = contentArea.querySelectorAll( 'h2, h3, h4, h5, h6' );
	const detectedHeadings = [];

	allHeadings.forEach( ( heading ) => {
		// Skip headings inside TOC blocks
		if ( heading.closest( '.gutplus-toc' ) ) {
			return;
		}

		const level = parseInt( heading.tagName.charAt( 1 ), 10 );

		// Detect if this is an accordion or tab heading
		const isAccordionHeading = heading.classList.contains( 'accordion-heading' ) ||
			heading.querySelector( '.accordion-title-text' );
		const isTabHeading = heading.querySelector( '.tab-button-text' );

		// Skip accordion headings if includeAccordions is false
		if ( isAccordionHeading && ! config.includeAccordions ) {
			return;
		}

		// Skip tab headings if includeTabs is false
		if ( isTabHeading && ! config.includeTabs ) {
			return;
		}

		// Extract text, excluding icons from accordion/tabs blocks
		// Accordion structure: <h2><button><span class="accordion-title-text">text</span>...</button></h2>
		// Tabs structure: <h2><button><span class="tab-button-text">text</span>...</button></h2>
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
		console.warn( 'Failed to parse curated TOC items', error );
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
 * @param heading
 * @param config
 */
function matchesFilter( heading, config ) {
	const { filterMode, includeLevels, includeClasses, excludeLevels, excludeClasses } = config;

	if ( filterMode === 'include-only' ) {
		// Must match level OR class
		const levelMatches = includeLevels.includes( heading.level );
		const classMatches = includeClasses
			? includeClasses.split( ',' ).some( ( cls ) => heading.classes.includes( cls.trim() ) )
			: false;

		return levelMatches || classMatches;
	}

	if ( filterMode === 'exclude' ) {
		// Exclude if level matches
		if ( excludeLevels.includes( heading.level ) ) {
			return false;
		}

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

	// Include all
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
					console.warn( 'Invalid TOC link href' );
					return;
				}

				const targetId = href.slice( 1 );
				const targetElement = document.getElementById( targetId );

				if ( ! targetElement ) {
					console.warn( 'TOC target element not found:', targetId );
					return;
				}

				// Calculate scroll position with offset
				const targetPosition =
					targetElement.getBoundingClientRect().top +
					window.pageYOffset -
					config.scrollOffset;

				// Smooth scroll
				window.scrollTo( {
					top: targetPosition,
					behavior: 'smooth',
				} );

				// Update URL hash without jumping
				if ( history.pushState ) {
					history.pushState( null, null, `#${ targetId }` );
				} else {
					window.location.hash = targetId;
				}

				// Focus target for accessibility
				targetElement.focus( { preventScroll: true } );

				// Handle click behavior - collapse TOC if configured
				if ( config.clickBehavior === 'navigate-and-collapse' && config.isCollapsible ) {
					// Wait for scroll to complete before collapsing
					setTimeout( () => {
						try {
							const toggleButton = block.querySelector( '.toc-toggle-button' );
							const content = block.querySelector( '.toc-content' );
							const icon = block.querySelector( '.toc-collapse-icon' );

							if ( toggleButton && content ) {
								// Collapse the TOC
								content.style.display = 'none';
								toggleButton.setAttribute( 'aria-expanded', 'false' );
								if ( icon ) {
									icon.style.transform = 'rotate(-90deg)';
								}
							}
						} catch ( error ) {
							console.error( 'Failed to collapse TOC:', error );
						}
					}, 600 ); // Match scroll duration
				}
			} catch ( error ) {
				console.error( 'Failed to handle smooth scroll:', error );
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
					console.error( 'Scroll spy error:', error );
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
		console.error( 'Initial scroll spy check failed:', error );
	}

	// Listen to scroll
	window.addEventListener( 'scroll', onScroll, { passive: true } );
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
	const icon = block.querySelector( '.toc-collapse-icon' );

	if ( ! toggleButton || ! content ) {
		console.warn( 'TOC collapsible elements not found' );
		return;
	}

	// Set initial state
	const isCollapsed = config.initiallyCollapsed;
	content.style.display = isCollapsed ? 'none' : 'block';
	toggleButton.setAttribute( 'aria-expanded', ! isCollapsed );

	// Toggle function
	const toggle = () => {
		try {
			const isCurrentlyCollapsed = content.style.display === 'none';

			if ( isCurrentlyCollapsed ) {
				// Expand
				content.style.display = 'block';
				toggleButton.setAttribute( 'aria-expanded', 'true' );
				if ( icon ) {
					icon.style.transform = 'rotate(0deg)';
				}
			} else {
				// Collapse
				content.style.display = 'none';
				toggleButton.setAttribute( 'aria-expanded', 'false' );
				if ( icon ) {
					icon.style.transform = 'rotate(-90deg)';
				}
			}
		} catch ( error ) {
			console.error( 'Failed to toggle TOC:', error );
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
			initializeTOCBlocks();
		} catch ( error ) {
			console.error( 'TOC block initialization failed:', error );
		}
	} );
} else {
	try {
		initializeTOCBlocks();
	} catch ( error ) {
		console.error( 'TOC block initialization failed:', error );
	}
}

/**
 * Export functions for potential reuse
 */
export { initializeTOCBlocks, detectHeadings, setupSmoothScroll, setupScrollSpy, setupCollapsible };
