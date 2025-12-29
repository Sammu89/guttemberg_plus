/**
 * ShadowPanel - Full Control
 *
 * Main shadow panel component that manages multiple shadow layers.
 * Allows users to add, delete, and configure multiple box-shadow layers.
 *
 * @package guttemberg-plus
 */

import { useState } from '@wordpress/element';
import { BaseControl, Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { ShadowLayer } from './ShadowLayer';
import { duplicateShadowLayer } from '../../../utils/shadow-utils';

/**
 * ShadowPanel Component
 *
 * Manages an array of shadow layer objects with add/delete functionality.
 * All layers can be deleted - deleting the last layer results in an empty array (no shadow).
 *
 * @param {Object}   props
 * @param {string}   props.label       - Panel label
 * @param {Array}    props.value       - Array of shadow layer objects
 * @param {Function} props.onChange    - Called with updated array when changes occur
 * @param {boolean}  props.disabled    - Disabled state
 * @param {boolean}  props.showSpread  - Whether to show spread control (default: true, false for text-shadow)
 * @param {boolean}  props.showInset   - Whether to show inset control (default: true, false for text-shadow/borders)
 */
export function ShadowPanel( {
	label = 'Shadow',
	value = [],
	onChange,
	disabled = false,
	showSpread = true,
	showInset = true,
} ) {
	// Track which layers are open/collapsed (default: first layer open)
	const [ openLayers, setOpenLayers ] = useState(
		value.map( ( _, index ) => index === 0 )
	);

	// Ensure openLayers array matches value array length
	// This handles cases where value changes externally
	const adjustedOpenLayers = value.map( ( _, index ) => {
		return openLayers[ index ] ?? false;
	} );

	/**
	 * Handles adding a new shadow layer.
	 * Duplicates the last layer with Y offset +4, appends to array, and opens it.
	 * If no layers exist, creates a default layer.
	 */
	const handleAddLayer = () => {
		const lastLayer = value.length > 0 ? value[ value.length - 1 ] : null;
		const newLayer = duplicateShadowLayer( lastLayer, lastLayer ? 4 : 0 );
		const newValue = [ ...value, newLayer ];
		onChange( newValue );

		// Open the newly added layer, close others
		const newOpenLayers = newValue.map( ( _, index ) => index === newValue.length - 1 );
		setOpenLayers( newOpenLayers );
	};

	/**
	 * Handles deleting a shadow layer at a specific index.
	 * All layers can be deleted - results in empty array (no shadow).
	 *
	 * @param {number} index - The index of the layer to delete
	 */
	const handleDeleteLayer = ( index ) => {
		const newValue = value.filter( ( _, i ) => i !== index );
		onChange( newValue );

		// Update open layers state to match new array
		const newOpenLayers = adjustedOpenLayers.filter( ( _, i ) => i !== index );
		setOpenLayers( newOpenLayers );
	};

	/**
	 * Handles updating a shadow layer at a specific index.
	 *
	 * @param {number} index        - The index of the layer to update
	 * @param {Object} updatedLayer - The updated layer object
	 */
	const handleUpdateLayer = ( index, updatedLayer ) => {
		const newValue = value.map( ( layer, i ) =>
			i === index ? updatedLayer : layer
		);
		onChange( newValue );
	};

	/**
	 * Handles toggling the open/closed state of a layer.
	 *
	 * @param {number} index - The index of the layer to toggle
	 */
	const handleToggleLayer = ( index ) => {
		const newOpenLayers = [ ...adjustedOpenLayers ];
		newOpenLayers[ index ] = ! newOpenLayers[ index ];
		setOpenLayers( newOpenLayers );
	};

	return (
		<BaseControl
			label={ label }
			className="gutplus-shadow-panel"
			__nextHasNoMarginBottom
		>
			<div className="gutplus-shadow-panel__layers">
				{ value.map( ( layer, index ) => (
					<ShadowLayer
						key={ index }
						index={ index }
						value={ layer }
						canDelete={ true }
						onChange={ ( updatedLayer ) => handleUpdateLayer( index, updatedLayer ) }
						onDelete={ () => handleDeleteLayer( index ) }
						disabled={ disabled }
						isOpen={ adjustedOpenLayers[ index ] }
						onToggle={ () => handleToggleLayer( index ) }
						showSpread={ showSpread }
						showInset={ showInset }
					/>
				) ) }
			</div>

			<Button
				variant="secondary"
				className="gutplus-shadow-panel__add-button"
				onClick={ handleAddLayer }
				disabled={ disabled }
				icon={ plus }
			>
				Add shadow layer
			</Button>
		</BaseControl>
	);
}

export default ShadowPanel;
