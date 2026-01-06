/**
 * Responsive device helpers (editor preview + frontend)
 *
 * @package
 * @since 1.0.0
 */

const EVENT_NAME = 'gutplus:device-change';
const DEFAULT_DEVICE = 'global';

// Default breakpoint values (fallback if user settings not available)
const DEFAULT_BREAKPOINTS = {
	mobile: 481,
	tablet: 768,
};

/**
 * Get current breakpoint settings from WordPress
 * Falls back to defaults if not available
 *
 * @return {Object} Breakpoint configuration
 */
function getBreakpoints() {
	if ( typeof window === 'undefined' ) {
		return DEFAULT_BREAKPOINTS;
	}
	return window.guttembergPlusSettings?.breakpoints || DEFAULT_BREAKPOINTS;
}

/**
 * Get device widths for viewport simulation based on user-defined breakpoints
 *
 * @return {Object} Device widths with global (null), tablet, and mobile
 */
function getDeviceWidths() {
	const breakpoints = getBreakpoints();
	return {
		global: null, // Full width - base state that applies to all devices unless overridden
		tablet: `${ breakpoints.tablet }px`,
		mobile: `${ breakpoints.mobile }px`,
	};
}

/**
 * Apply viewport width simulation to editor iframe
 * This creates a realistic preview by constraining the iframe width
 * Uses user-defined breakpoints from WordPress settings
 *
 * @param {string} device - The device type (global, tablet, mobile)
 */
function applyViewportSimulation( device ) {
	if ( typeof window === 'undefined' ) {
		return;
	}

	// Find the editor iframe HTML element
	const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
	if ( ! iframe ) {
		return;
	}

	const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
	if ( ! iframeDocument ) {
		return;
	}

	const htmlElement = iframeDocument.querySelector( '.block-editor-iframe__html' );
	if ( ! htmlElement ) {
		return;
	}

	// Get device widths based on user-defined breakpoints
	const deviceWidths = getDeviceWidths();
	const width = deviceWidths[ device ];

	if ( width ) {
		// Apply constrained width for tablet/mobile overrides
		htmlElement.style.width = width;
		htmlElement.style.marginLeft = 'auto';
		htmlElement.style.marginRight = 'auto';
		htmlElement.style.overflow = 'hidden';
	} else {
		// Reset to full width for global (base state)
		htmlElement.style.width = '';
		htmlElement.style.marginLeft = '';
		htmlElement.style.marginRight = '';
		htmlElement.style.overflow = '';
	}
}

export function getGlobalResponsiveDevice() {
	if ( typeof window === 'undefined' ) {
		return DEFAULT_DEVICE;
	}
	return window.gutplusDevice || DEFAULT_DEVICE;
}

export function setGlobalResponsiveDevice( device ) {
	if ( ! device || typeof window === 'undefined' ) {
		return;
	}

	window.gutplusDevice = device;

	// Apply viewport width simulation for realistic preview
	applyViewportSimulation( device );

	window.dispatchEvent( new CustomEvent( EVENT_NAME, { detail: { device } } ) );
}

export function onResponsiveDeviceChange( handler ) {
	if ( typeof window === 'undefined' ) {
		return () => {};
	}

	const listener = ( event ) => {
		const next = event?.detail?.device || getGlobalResponsiveDevice();
		handler( next );
	};

	window.addEventListener( EVENT_NAME, listener );
	return () => window.removeEventListener( EVENT_NAME, listener );
}

/**
 * Initialize viewport simulation with current device state
 * Call this when the editor loads to apply the current device viewport
 */
export function initializeViewportSimulation() {
	if ( typeof window === 'undefined' ) {
		return;
	}

	// Wait for iframe to be ready
	const checkIframe = () => {
		const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
		if ( iframe && iframe.contentDocument ) {
			const currentDevice = getGlobalResponsiveDevice();
			applyViewportSimulation( currentDevice );
		} else {
			// Retry after a short delay if iframe not ready
			setTimeout( checkIframe, 100 );
		}
	};

	// Start checking
	checkIframe();
}

// Auto-initialize when the module loads (in the editor context)
if ( typeof window !== 'undefined' && document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initializeViewportSimulation );
} else if ( typeof window !== 'undefined' ) {
	// DOM already loaded
	initializeViewportSimulation();
}
