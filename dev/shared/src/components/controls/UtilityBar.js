/**
 * UtilityBar Component
 *
 * Unified component that consolidates device switchers, link/unlink toggles, and reset buttons.
 * Intelligently shows/hides controls based on responsive and decomposable patterns.
 *
 * Features:
 * - Shows reset button by default (can be hidden)
 * - Conditionally shows device switcher when responsive
 * - Conditionally shows link toggle when decomposable
 * - Handles both "always responsive" and "canBeResponsive" patterns
 *
 * Layout order: Responsive controls → Link toggle → Reset button
 *
 * @package guttemberg-plus
 */

import { Button, Flex, FlexItem } from '@wordpress/components';
import { DeviceSwitcher } from './atoms/DeviceSwitcher';
import { LinkToggle } from './atoms/LinkToggle';
import { ResetButton } from './ResetButton';
import { ResponsiveIcon } from './icons';

/**
 * UtilityBar Component
 *
 * @param {Object}   props
 * @param {boolean}  props.isResponsive           - Control supports responsive mode (always on)
 * @param {boolean}  props.canBeResponsive        - Responsive can be toggled on/off
 * @param {boolean}  props.isResponsiveEnabled    - Whether responsive mode is enabled (for canBeResponsive pattern)
 * @param {boolean}  props.isDecomposable         - Control has linkable sides (box controls)
 * @param {string}   props.currentDevice          - Current device state (global/tablet/mobile)
 * @param {boolean}  props.isLinked               - Whether sides are linked
 * @param {Function} props.onResponsiveToggle     - Enable/disable responsive handler
 * @param {Function} props.onLinkChange           - Link toggle handler
 * @param {Function} props.onReset                - Comprehensive reset handler
 * @param {boolean}  props.showReset              - Whether to show reset button
 * @param {boolean}  props.resetDisabled          - Disable only the reset button
 * @param {boolean}  props.disabled               - Disable all controls
 */
export function UtilityBar( {
	isResponsive = false,
	canBeResponsive = false,
	isResponsiveEnabled = false,
	isDecomposable = false,
	currentDevice = 'global',
	isLinked = true,
	onResponsiveToggle,
	onLinkChange,
	onReset,
	showReset = true,
	resetDisabled = false,
	disabled = false,
} ) {
	// Determine what controls to show
	const showEnableResponsiveButton = canBeResponsive && ! isResponsiveEnabled;
	const showDeviceSwitcher = isResponsive || isResponsiveEnabled;
	const showLinkToggle = isDecomposable;
	const shouldDisableReset = disabled || resetDisabled;

	return (
		<Flex gap={ 1 } align="center" className="gutplus-utility-bar">
			{ /* Responsive Controls Section */ }
			{ showEnableResponsiveButton && (
				<FlexItem>
					<Button
						icon={ ResponsiveIcon }
						label="Enable responsive mode"
						onClick={ () => onResponsiveToggle?.( true ) }
						disabled={ disabled }
						isSmall
						className="gutplus-utility-bar__responsive-enable"
					/>
				</FlexItem>
			) }

			{ showDeviceSwitcher && (
				<FlexItem>
					<DeviceSwitcher
						value={ currentDevice }
						disabled={ disabled }
					/>
				</FlexItem>
			) }

			{ /* Link Toggle Section */ }
			{ showLinkToggle && (
				<FlexItem>
					<LinkToggle
						linked={ isLinked }
						onChange={ onLinkChange }
						disabled={ disabled }
					/>
				</FlexItem>
			) }

			{ /* Reset Button */ }
			{ showReset && (
				<FlexItem>
					<ResetButton
						onClick={ onReset }
						disabled={ shouldDisableReset }
					/>
				</FlexItem>
			) }
		</Flex>
	);
}

export default UtilityBar;
