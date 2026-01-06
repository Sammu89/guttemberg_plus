/**
 * Tabbed Inspector Component
 *
 * Two-tab inspector panel with Settings and Appearance tabs.
 * Uses WordPress TabPanel component with custom icons for each tab.
 * This provides a consistent UI pattern for block inspector controls.
 *
 * @package
 * @since 1.0.0
 */

import { TabPanel, Icon } from '@wordpress/components';
import { settings, brush } from '@wordpress/icons';

/**
 * Tab configuration for the inspector
 */
const INSPECTOR_TABS = [
	{
		name: 'settings',
		title: (
			<span className="gutplus-tabbed-inspector__tab-label">
				<Icon icon={ settings } size={ 18 } />
				<span className="gutplus-tabbed-inspector__tab-text">Settings</span>
			</span>
		),
		className: 'gutplus-tab-settings',
	},
	{
		name: 'appearance',
		title: (
			<span className="gutplus-tabbed-inspector__tab-label">
				<Icon icon={ brush } size={ 18 } />
				<span className="gutplus-tabbed-inspector__tab-text">Appearance</span>
			</span>
		),
		className: 'gutplus-tab-appearance',
	},
];

/**
 * TabbedInspector Component
 *
 * A two-tab inspector layout for block sidebar controls.
 * Settings tab contains structural/behavioral controls.
 * Appearance tab contains visual/styling controls.
 *
 * @param {Object}      props                   Component props
 * @param {JSX.Element} props.settingsContent   Content for the Settings tab
 * @param {JSX.Element} props.appearanceContent Content for the Appearance tab
 * @param {string}      props.initialTabName    Initial tab to show (default: 'settings')
 * @param {Function}    props.onTabChange       Optional callback when tab changes
 * @return {JSX.Element} Tabbed inspector component
 */
export function TabbedInspector( {
	settingsContent,
	appearanceContent,
	initialTabName = 'settings',
	onTabChange,
} ) {
	/**
	 * Handle tab selection
	 *
	 * @param {string} tabName - Name of the selected tab
	 */
	const handleTabSelect = ( tabName ) => {
		if ( onTabChange ) {
			onTabChange( tabName );
		}
	};

	return (
		<TabPanel
			className="gutplus-tabbed-inspector"
			tabs={ INSPECTOR_TABS }
			initialTabName={ initialTabName }
			onSelect={ handleTabSelect }
		>
			{ ( tab ) => (
				<div className={ `gutplus-tab-content gutplus-tab-${ tab.name }` }>
					{ tab.name === 'settings' ? settingsContent : appearanceContent }
				</div>
			) }
		</TabPanel>
	);
}

/**
 * Export tab names for external use
 */
export const TAB_NAMES = {
	SETTINGS: 'settings',
	APPEARANCE: 'appearance',
};

export default TabbedInspector;
