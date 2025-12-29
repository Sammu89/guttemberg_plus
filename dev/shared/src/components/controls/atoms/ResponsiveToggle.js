/**
 * ResponsiveToggle - Atom Component
 *
 * A toggle that switches between "enable responsive" mode and device switcher.
 * When disabled: Shows toggle button + reset button
 * When enabled: Shows DeviceSwitcher + reset button
 *
 * @package guttemberg-plus
 */

import { Button, Flex, FlexItem } from '@wordpress/components';
import { DeviceSwitcher } from './DeviceSwitcher';
import { ResetButton } from '../ResetButton';
import { ResponsiveIcon } from '../icons';

/**
 * ResponsiveToggle Component
 *
 * @param {Object}   props
 * @param {boolean}  props.isEnabled       - Whether responsive mode is enabled
 * @param {Function} props.onToggle        - Called when toggle is clicked (receives new state)
 * @param {string}   props.currentDevice   - Current device (global/tablet/mobile)
 * @param {Function} props.onReset         - Called when reset is clicked
 * @param {boolean}  props.disabled        - Disabled state
 * @param {boolean}  props.isResetDisabled - Whether reset button is disabled
 */
export function ResponsiveToggle({
	isEnabled = false,
	onToggle,
	currentDevice = 'global',
	onReset,
	disabled = false,
	isResetDisabled = false,
}) {
	const handleToggleClick = () => {
		if (onToggle && !disabled) {
			onToggle(true); // Enable responsive
		}
	};

	if (!isEnabled) {
		// Responsive disabled: Show toggle button + reset
		return (
			<Flex gap={1} align="center" className="gutplus-responsive-toggle">
				<FlexItem>
					<Button
						icon={ResponsiveIcon}
						label="Enable responsive mode"
						onClick={handleToggleClick}
						disabled={disabled}
						isSmall
						className="gutplus-responsive-toggle__enable-btn"
					/>
				</FlexItem>
				<FlexItem>
					<ResetButton onClick={onReset} disabled={isResetDisabled || disabled} />
				</FlexItem>
			</Flex>
		);
	}

	// Responsive enabled: Show DeviceSwitcher + reset
	return (
		<Flex gap={1} align="center" className="gutplus-responsive-toggle gutplus-responsive-toggle--enabled">
			<FlexItem>
				<DeviceSwitcher value={currentDevice} />
			</FlexItem>
			<FlexItem>
				<ResetButton onClick={onReset} disabled={isResetDisabled || disabled} />
			</FlexItem>
		</Flex>
	);
}

export default ResponsiveToggle;
