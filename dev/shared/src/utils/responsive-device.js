/**
 * Responsive device helpers (editor preview + frontend)
 *
 * @package GuttembergPlus
 * @since 1.0.0
 */

const EVENT_NAME = 'gutplus:device-change';
const DEFAULT_DEVICE = 'desktop';

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
	window.dispatchEvent(
		new CustomEvent( EVENT_NAME, { detail: { device } } )
	);
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
