/**
 * Color Gradient Control Component
 *
 * Uses native WordPress ColorGradientControl for solid colors and gradients.
 * Supports theme color palettes and custom colors.
 *
 * @package
 * @since 1.0.0
 */

import {
	BaseControl,
	Flex,
	FlexItem,
	GradientPicker,
	ColorPalette,
	TabPanel,
} from '@wordpress/components';
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { useState, useRef } from '@wordpress/element';
import { ResetButton } from './ResetButton';

/**
 * Color Gradient Control Component
 *
 * A combined color and gradient picker.
 * Displays theme colors/gradients and allows custom values.
 *
 * @param {Object}   props                Component props
 * @param {string}   props.label          Label for the control
 * @param {string}   props.value          Current color or gradient value
 * @param {Function} props.onChange       Callback when value changes
 * @param {Function} props.onReset        Optional custom reset callback
 * @param {string}   props.defaultValue   Default value for reset
 * @param {string}   props.help           Help text below the control
 * @param {boolean}  props.showReset      Whether to show reset button (default: true)
 * @param {boolean}  props.enableGradient Whether to enable gradient selection (default: true)
 * @return {JSX.Element} Color gradient control component
 */
export function ColorGradientControl( {
	label,
	value,
	onChange,
	onReset,
	defaultValue = '',
	help,
	showReset = true,
	enableGradient = true,
} ) {
	// Get theme colors and gradients
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Detect if current value is a gradient
	const isGradient = typeof value === 'string' && value.includes( 'gradient' );

	// Flatten colors array for ColorPalette (it expects flat array)
	const flattenColors = ( colorsArray ) => {
		if ( ! colorsArray || ! Array.isArray( colorsArray ) ) {
			return [];
		}
		// If already flat (has 'color' property), return as is
		if ( colorsArray[ 0 ]?.color ) {
			return colorsArray;
		}
		// If nested (has 'colors' property), flatten
		return colorsArray.reduce( ( acc, origin ) => {
			if ( origin.colors && Array.isArray( origin.colors ) ) {
				return [ ...acc, ...origin.colors ];
			}
			return acc;
		}, [] );
	};

	// Flatten gradients array for GradientPicker
	const flattenGradients = ( gradientsArray ) => {
		if ( ! gradientsArray || ! Array.isArray( gradientsArray ) ) {
			return [];
		}
		// If already flat (has 'gradient' property), return as is
		if ( gradientsArray[ 0 ]?.gradient ) {
			return gradientsArray;
		}
		// If nested (has 'gradients' property), flatten
		return gradientsArray.reduce( ( acc, origin ) => {
			if ( origin.gradients && Array.isArray( origin.gradients ) ) {
				return [ ...acc, ...origin.gradients ];
			}
			return acc;
		}, [] );
	};

	const colors = flattenColors( colorGradientSettings?.colors );
	const gradients = flattenGradients( colorGradientSettings?.gradients );

	/**
	 * Handle reset button
	 */
	const handleReset = () => {
		if ( onReset ) {
			onReset();
		} else {
			onChange( defaultValue );
		}
	};

	// Determine if reset is disabled
	const isResetDisabled = value === defaultValue || ( ! value && ! defaultValue );

	// Tabs for solid/gradient selection
	const tabs = [ { name: 'solid', title: 'Solid' } ];

	if ( enableGradient ) {
		tabs.push( { name: 'gradient', title: 'Gradient' } );
	}

	return (
		<BaseControl
			label={
				<Flex align="center" justify="space-between" style={ { width: '100%' } }>
					<FlexItem>{ label }</FlexItem>
					{ showReset && (
						<FlexItem>
							<ResetButton onClick={ handleReset } disabled={ isResetDisabled } />
						</FlexItem>
					) }
				</Flex>
			}
			help={ help }
			className="gutplus-color-gradient-control"
		>
			{ enableGradient ? (
				<TabPanel tabs={ tabs } initialTabName={ isGradient ? 'gradient' : 'solid' }>
					{ ( tab ) => (
						<div style={ { paddingTop: '12px' } }>
							{ tab.name === 'solid' && (
								<ColorPalette
									colors={ colors }
									value={ isGradient ? undefined : value }
									onChange={ onChange }
									clearable={ true }
								/>
							) }
							{ tab.name === 'gradient' && (
								<GradientPicker
									gradients={ gradients }
									value={ isGradient ? value : undefined }
									onChange={ onChange }
									clearable={ true }
								/>
							) }
						</div>
					) }
				</TabPanel>
			) : (
				<ColorPalette
					colors={ colors }
					value={ value }
					onChange={ onChange }
					clearable={ true }
				/>
			) }
		</BaseControl>
	);
}

export default ColorGradientControl;
