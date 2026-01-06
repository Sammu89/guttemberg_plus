/**
 * Alignment Control Component
 *
 * Text alignment icon buttons: left, center, right.
 * Uses WordPress icons where available, with SVG fallbacks.
 *
 * @package
 * @since 1.0.0
 */

import { alignLeft, alignCenter, alignRight } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
import { IconButtonGroup } from './IconButtonGroup';
import sharedTemplates from '../../../../schemas/shared-templates.json';

/**
 * WordPress icons mapping for alignments
 */
const AlignmentIcons = {
	left: <Icon icon={ alignLeft } size={ 24 } />,
	center: <Icon icon={ alignCenter } size={ 24 } />,
	right: <Icon icon={ alignRight } size={ 24 } />,
};

/**
 * Fallback SVG icons if WordPress icons are not available
 */
const FallbackIcons = {
	/**
	 * Left align icon
	 */
	left: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<line
				x1="4"
				y1="6"
				x2="20"
				y2="6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="4"
				y1="10"
				x2="14"
				y2="10"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="4"
				y1="14"
				x2="18"
				y2="14"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="4"
				y1="18"
				x2="12"
				y2="18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),

	/**
	 * Center align icon
	 */
	center: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<line
				x1="4"
				y1="6"
				x2="20"
				y2="6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="7"
				y1="10"
				x2="17"
				y2="10"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="5"
				y1="14"
				x2="19"
				y2="14"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="8"
				y1="18"
				x2="16"
				y2="18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),

	/**
	 * Right align icon
	 */
	right: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<line
				x1="4"
				y1="6"
				x2="20"
				y2="6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="10"
				y1="10"
				x2="20"
				y2="10"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="6"
				y1="14"
				x2="20"
				y2="14"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="12"
				y1="18"
				x2="20"
				y2="18"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),
};

/**
 * Get the appropriate icon, preferring WordPress icons
 *
 * @param {string} alignment The alignment value
 * @return {JSX.Element} The icon component
 */
const getIcon = ( alignment ) => {
	// Try WordPress icons first
	if ( AlignmentIcons[ alignment ] ) {
		return AlignmentIcons[ alignment ];
	}
	// Fall back to custom SVG icons
	return FallbackIcons[ alignment ] || FallbackIcons.left;
};

/**
 * AlignmentControl - Text alignment button selector
 *
 * ============================================================================
 * DATA STRUCTURE EXPECTATIONS (CRITICAL!)
 * ============================================================================
 *
 * This control uses a SIMPLE STRING pattern (single alignment value).
 *
 * VALUE PROP:
 * -----------
 * value prop accepts:
 *   - "left" | "center" | "right"
 *   - "wide" | "full" (only when type is "block")
 *
 * onChange callback signature:
 *   onChange(newAlignment)
 *   - newAlignment: string from shared templates
 *
 * NOT RESPONSIVE:
 * ---------------
 * AlignmentControl does NOT handle responsive values internally.
 * Parent controls must switch values per device if needed.
 *
 * ============================================================================
 *
 * @param {Object}   props          Component props
 * @param {string}   props.label    Label for the control
 * @param {string}   props.value    Current alignment value
 * @param {Function} props.onChange Callback when value changes
 * @param {string}   props.type     Type of alignment: 'text' or 'block' (default: 'text')
 */
export function AlignmentControl( {
	label = 'Alignment',
	value = 'left',
	onChange,
	type = 'text',
} ) {
	const { alignments } = sharedTemplates;
	const alignmentOptions = type === 'block' ? alignments?.block || [] : alignments?.text || [];

	/**
	 * Build options array for IconButtonGroup
	 */
	const options = alignmentOptions.map( ( alignment ) => ( {
		value: alignment.value,
		label: alignment.name,
		icon: getIcon( alignment.value ),
	} ) );

	return (
		<IconButtonGroup
			label={ label }
			value={ value }
			onChange={ onChange }
			options={ options }
		/>
	);
}

export default AlignmentControl;
