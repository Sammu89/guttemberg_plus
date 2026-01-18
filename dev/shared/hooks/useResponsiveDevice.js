/**
 * useResponsiveDevice
 *
 * Tracks the current responsive state for editor preview.
 * Returns 'global' (base state), 'tablet', or 'mobile'.
 * Global is the base state that applies to all devices unless overridden.
 *
 * @package
 * @since 1.0.0
 */

import { useEffect, useState } from '@wordpress/element';
import { getGlobalResponsiveDevice, onResponsiveDeviceChange } from '../utils/responsive-device';

export function useResponsiveDevice() {
	const [ device, setDevice ] = useState( getGlobalResponsiveDevice() );

	useEffect( () => {
		return onResponsiveDeviceChange( setDevice );
	}, [] );

	return device;
}

export default useResponsiveDevice;
