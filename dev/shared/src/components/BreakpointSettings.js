/**
 * BreakpointSettings Component
 *
 * Shared panel for controlling responsive breakpoints across all blocks.
 * Appears in Settings tab before the Advanced panel.
 *
 * @package GuttembergPlus
 * @since 1.0.0
 */

import { useState } from '@wordpress/element';
import {
	PanelBody,
	__experimentalUnitControl as UnitControl,
	Button,
	ButtonGroup,
	Notice
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { mobile, tablet } from '@wordpress/icons';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { setGlobalResponsiveDevice, getGlobalResponsiveDevice } from '../utils/responsive-device';
import './breakpoint-settings.scss';

/**
 * BreakpointSettings Component
 *
 * Renders a panel with inputs for mobile and tablet breakpoints with manual save.
 * Changes require clicking Save to persist globally.
 */
export function BreakpointSettings() {
	const {
		localBreakpoints,
		setLocalBreakpoints,
		saveBreakpoints,
		resetToDefaults,
		hasUnsavedChanges,
		hasChangesFromDefaults,
		isLoading,
		isSaving,
		DEFAULT_BREAKPOINTS
	} = useBreakpoints();

	const [notice, setNotice] = useState(null);

	const handleMobileChange = ( value ) => {
		const numValue = parseInt( value, 10 );
		if ( ! isNaN( numValue ) && numValue > 0 ) {
			setLocalBreakpoints( {
				...localBreakpoints,
				mobile: numValue,
			} );
			setNotice( null );
		}
	};

	const handleTabletChange = ( value ) => {
		const numValue = parseInt( value, 10 );
		if ( ! isNaN( numValue ) && numValue > 0 ) {
			setLocalBreakpoints( {
				...localBreakpoints,
				tablet: numValue,
			} );
			setNotice( null );
		}
	};

	const handleSave = async () => {
		const result = await saveBreakpoints();
		if ( result.success ) {
			setNotice( {
				type: 'success',
				message: __( 'Breakpoint settings saved successfully!', 'guttemberg-plus' )
			} );

			// Re-apply viewport simulation with new breakpoints
			const currentDevice = getGlobalResponsiveDevice();
			setGlobalResponsiveDevice( currentDevice );

			// Auto-dismiss success notice after 3 seconds
			setTimeout( () => setNotice( null ), 3000 );
		} else {
			setNotice( {
				type: 'error',
				message: __( 'Failed to save breakpoint settings. Please try again.', 'guttemberg-plus' )
			} );
		}
	};

	const handleReset = async () => {
		if ( ! window.confirm( __( 'Are you sure you want to reset breakpoints to defaults (Mobile: 481px, Tablet: 768px)?', 'guttemberg-plus' ) ) ) {
			return;
		}

		const result = await resetToDefaults();
		if ( result.success ) {
			setNotice( {
				type: 'success',
				message: __( 'Breakpoints reset to defaults successfully!', 'guttemberg-plus' )
			} );

			// Re-apply viewport simulation with default breakpoints
			const currentDevice = getGlobalResponsiveDevice();
			setGlobalResponsiveDevice( currentDevice );

			// Auto-dismiss success notice after 3 seconds
			setTimeout( () => setNotice( null ), 3000 );
		} else {
			setNotice( {
				type: 'error',
				message: __( 'Failed to reset breakpoints. Please try again.', 'guttemberg-plus' )
			} );
		}
	};

	return (
		<PanelBody
			title={ __( 'Responsive Breakpoints', 'guttemberg-plus' ) }
			initialOpen={ false }
			className="gutplus-breakpoint-settings"
		>
			<p className="gutplus-breakpoint-settings__description">
				{ __( 'Set the maximum width for mobile and tablet devices. These breakpoints apply globally to all responsive controls.', 'guttemberg-plus' ) }
			</p>

			{/* Notice */ }
			{ notice && (
				<Notice
					status={ notice.type }
					isDismissible={ true }
					onRemove={ () => setNotice( null ) }
					className="gutplus-breakpoint-settings__notice"
				>
					{ notice.message }
				</Notice>
			) }

			{/* Mobile Breakpoint */ }
			<div className="gutplus-breakpoint-setting">
				<div className="gutplus-breakpoint-setting__header">
					<span className="gutplus-breakpoint-setting__icon">{ mobile }</span>
					<label className="gutplus-breakpoint-setting__label">
						{ __( 'Mobile', 'guttemberg-plus' ) }
					</label>
				</div>
				<UnitControl
					value={ `${ localBreakpoints.mobile }px` }
					onChange={ handleMobileChange }
					units={ [
						{
							value: 'px',
							label: 'px',
						},
					] }
					min={ 320 }
					max={ 768 }
					disabled={ isLoading || isSaving }
					className="gutplus-breakpoint-setting__input"
				/>
			</div>

			{/* Tablet Breakpoint */ }
			<div className="gutplus-breakpoint-setting">
				<div className="gutplus-breakpoint-setting__header">
					<span className="gutplus-breakpoint-setting__icon">{ tablet }</span>
					<label className="gutplus-breakpoint-setting__label">
						{ __( 'Tablet', 'guttemberg-plus' ) }
					</label>
				</div>
				<UnitControl
					value={ `${ localBreakpoints.tablet }px` }
					onChange={ handleTabletChange }
					units={ [
						{
							value: 'px',
							label: 'px',
						},
					] }
					min={ 481 }
					max={ 1280 }
					disabled={ isLoading || isSaving }
					className="gutplus-breakpoint-setting__input"
				/>
			</div>

			{/* Action Buttons */ }
			<div className="gutplus-breakpoint-settings__actions">
				<ButtonGroup>
					<Button
						variant="primary"
						onClick={ handleSave }
						disabled={ ! hasUnsavedChanges || isLoading || isSaving }
						isBusy={ isSaving }
					>
						{ __( 'Save', 'guttemberg-plus' ) }
					</Button>
					{ hasChangesFromDefaults && (
						<Button
							variant="secondary"
							isDestructive
							onClick={ handleReset }
							disabled={ isLoading || isSaving }
						>
							{ __( 'Reset to Defaults', 'guttemberg-plus' ) }
						</Button>
					) }
				</ButtonGroup>
			</div>

			<p className="gutplus-breakpoint-settings__note">
				{ __( 'Note: Click Save to apply changes. Breakpoints affect all blocks and update the responsive preview.', 'guttemberg-plus' ) }
			</p>
		</PanelBody>
	);
}

export default BreakpointSettings;
