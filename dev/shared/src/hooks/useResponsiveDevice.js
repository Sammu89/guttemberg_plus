/**
 * useResponsiveDevice
 *
 * Tracks the globally selected responsive device for editor preview.
 *
 * @package GuttembergPlus
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
