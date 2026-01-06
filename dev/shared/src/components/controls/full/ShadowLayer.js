/**
 * ShadowLayer - Collapsible Shadow Layer Editor Component
 *
 * A collapsible editor for a single shadow layer with controls for:
 * - Color (with alpha support)
 * - X/Y offsets
 * - Blur and spread
 *
 * Props:
 * - index (number) - Layer number (1-based for display)
 * - value (object) - Shadow layer object with x, y, blur, spread, color, inset
 * - canDelete (boolean) - Whether delete button shows
 * - onChange (function) - Called with updated layer object
 * - onDelete (function) - Called when delete is clicked
 * - disabled (boolean) - Disabled state
 * - isOpen (boolean) - Controlled collapse state
 * - onToggle (function) - Toggle collapse
 *
 * @package
 */

import { Flex, FlexItem, FlexBlock, Button } from '@wordpress/components';
import { chevronDown, chevronRight, trash } from '@wordpress/icons';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { SliderWithInput } from '../SliderWithInput';

/**
 * ShadowLayer Component
 *
 * @param {Object}   props            Component props
 * @param {number}   props.index      Layer number (1-based for display)
 * @param {Object}   props.value      Shadow layer object { x, y, blur, spread, color, inset }
 * @param {boolean}  props.canDelete  Whether delete button shows
 * @param {Function} props.onChange   Called with updated layer object
 * @param {Function} props.onDelete   Called when delete is clicked
 * @param {boolean}  props.disabled   Disabled state
 * @param {boolean}  props.isOpen     Controlled collapse state
 * @param {Function} props.onToggle   Toggle collapse
 * @param {boolean}  props.showSpread Whether to show spread control (default: true)
 * @param {boolean}  props.showBlur   Whether to show blur control (default: true)
 * @return {JSX.Element} ShadowLayer component
 */
export function ShadowLayer( {
	index = 1,
	value = {},
	canDelete = false,
	onChange,
	onDelete,
	disabled = false,
	isOpen = false,
	onToggle,
	showSpread = true,
	showBlur = true,
} ) {
	// Destructure with defaults
	const { x = 0, y = 0, blur = 0, spread = 0, color = 'rgba(0, 0, 0, 0.1)' } = value;

	// Helper to update a specific property
	const updateProperty = ( property, newValue ) => {
		if ( onChange ) {
			onChange( { ...value, [ property ]: newValue } );
		}
	};

	// Handle delete click
	const handleDelete = () => {
		if ( onDelete && ! disabled ) {
			onDelete();
		}
	};

	// Handle header click for toggle
	const handleHeaderClick = () => {
		if ( onToggle && ! disabled ) {
			onToggle();
		}
	};

	return (
		<div className="gutplus-shadow-layer">
			{ /* Header - always visible */ }
			<Flex
				className="gutplus-shadow-layer__header"
				align="center"
				justify="space-between"
				gap={ 2 }
				style={ {
					padding: '8px 12px',
					backgroundColor: '#f0f0f0',
					borderRadius: '4px',
					cursor: disabled ? 'default' : 'pointer',
					marginBottom: isOpen ? '8px' : '0',
				} }
				onClick={ handleHeaderClick }
			>
				{ /* Left side: Chevron + Title + Color preview */ }
				<Flex align="center" gap={ 2 } style={ { flex: 1 } }>
					{ /* Chevron icon */ }
					<FlexItem>
						<Button
							icon={ isOpen ? chevronDown : chevronRight }
							size="small"
							variant="tertiary"
							disabled={ disabled }
							onClick={ ( e ) => {
								e.stopPropagation();
								handleHeaderClick();
							} }
							style={ {
								minWidth: '24px',
								padding: '0',
							} }
						/>
					</FlexItem>

					{ /* Title */ }
					<FlexBlock>
						<span
							style={ {
								fontSize: '13px',
								fontWeight: '500',
								color: disabled ? '#999' : '#1e1e1e',
							} }
						>
							Shadow { index }
						</span>
					</FlexBlock>

					{ /* Color preview swatch */ }
					<FlexItem>
						<div
							className="gutplus-shadow-layer__color-preview"
							style={ {
								width: '24px',
								height: '24px',
								borderRadius: '4px',
								border: '1px solid #ddd',
								backgroundColor: color,
								cursor: disabled ? 'default' : 'pointer',
							} }
							onClick={ ( e ) => e.stopPropagation() }
							title={ `Color: ${ color }` }
						/>
					</FlexItem>
				</Flex>

				{ /* Right side: Delete button */ }
				{ canDelete && (
					<FlexItem>
						<Button
							icon={ trash }
							size="small"
							variant="tertiary"
							isDestructive
							disabled={ disabled }
							onClick={ ( e ) => {
								e.stopPropagation();
								handleDelete();
							} }
							label="Delete layer"
							style={ {
								minWidth: '24px',
								padding: '4px',
							} }
						/>
					</FlexItem>
				) }
			</Flex>

			{ /* Body - shown when isOpen is true */ }
			{ isOpen && (
				<div
					className="gutplus-shadow-layer__body"
					style={ {
						padding: '12px',
						backgroundColor: '#fafafa',
						borderRadius: '4px',
						marginTop: '4px',
					} }
				>
					{ /* Color picker */ }
					<div style={ { marginBottom: '16px' } }>
						<Flex align="center" gap={ 2 }>
							<FlexItem>
								<span
									style={ {
										fontSize: '12px',
										fontWeight: '500',
										color: '#1e1e1e',
									} }
								>
									Color
								</span>
							</FlexItem>
							<FlexItem>
								<ColorSwatch
									value={ color }
									onChange={ ( newColor ) => updateProperty( 'color', newColor ) }
									disabled={ disabled }
								/>
							</FlexItem>
						</Flex>
					</div>

					{ /* X Offset */ }
					<div style={ { marginBottom: '16px' } }>
						<SliderWithInput
							label="X Offset"
							value={ x }
							onChange={ ( newValue ) => updateProperty( 'x', newValue ) }
							units={ [ 'px', 'em', 'rem' ] }
							min={ -100 }
							max={ 100 }
							step={ 1 }
							scaleType="spacing"
							disabled={ disabled }
							responsive={ false }
						/>
					</div>

					{ /* Y Offset */ }
					<div style={ { marginBottom: '16px' } }>
						<SliderWithInput
							label="Y Offset"
							value={ y }
							onChange={ ( newValue ) => updateProperty( 'y', newValue ) }
							units={ [ 'px', 'em', 'rem' ] }
							min={ -100 }
							max={ 100 }
							step={ 1 }
							scaleType="spacing"
							disabled={ disabled }
							responsive={ false }
						/>
					</div>

					{ /* Blur */ }
					{ showBlur && (
						<div style={ { marginBottom: '16px' } }>
							<SliderWithInput
								label="Blur"
								value={ blur }
								onChange={ ( newValue ) => updateProperty( 'blur', newValue ) }
								units={ [ 'px', 'em', 'rem' ] }
								min={ 0 }
								max={ 100 }
								step={ 1 }
								scaleType="spacing"
								disabled={ disabled }
								responsive={ false }
							/>
						</div>
					) }

					{ /* Spread */ }
					{ showSpread && (
						<div style={ { marginBottom: '16px' } }>
							<SliderWithInput
								label="Spread"
								value={ spread }
								onChange={ ( newValue ) => updateProperty( 'spread', newValue ) }
								units={ [ 'px', 'em', 'rem' ] }
								min={ -50 }
								max={ 50 }
								step={ 1 }
								scaleType="spacing"
								disabled={ disabled }
								responsive={ false }
							/>
						</div>
					) }
				</div>
			) }
		</div>
	);
}

export default ShadowLayer;
