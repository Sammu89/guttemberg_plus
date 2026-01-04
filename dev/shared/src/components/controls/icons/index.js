/**
 * Centralized Icon Registry
 *
 * All icons used across control components are defined here.
 * Import from this file instead of defining icons inline.
 *
 * Benefits:
 * - Single source of truth for all icons
 * - Easy to update icons globally
 * - Prevents duplicate definitions
 * - Consistent sizing and styling
 *
 * ============================================================================
 * HOW TO USE ICONS
 * ============================================================================
 *
 * OPTION 1: Import specific icons directly
 * ----------------------------------------
 * import { BorderSolidIcon, ShadowMediumIcon, reset } from '@shared/components/controls/icons';
 *
 * <Button icon={reset} />
 * <div>{BorderSolidIcon}</div>
 *
 *
 * OPTION 2: Import icon groups
 * ----------------------------------------
 * import { BorderStyleIcons, ShadowIcons } from '@shared/components/controls/icons';
 *
 * const icon = BorderStyleIcons.solid;
 * const preset = ShadowIcons.medium;
 *
 *
 * OPTION 3: Use helper functions
 * ----------------------------------------
 * import { getIcon, getIconCategory } from '@shared/components/controls/icons';
 *
 * // Get single icon by category and name
 * const solidBorder = getIcon('border', 'solid');
 *
 * // Get all icons in a category
 * const allBorderIcons = getIconCategory('border');
 * // Returns: { none, solid, dashed, dotted, double, groove, ridge }
 *
 *
 * ============================================================================
 * HOW TO ADD NEW ICONS
 * ============================================================================
 *
 * ADDING WORDPRESS ICONS:
 * ----------------------------------------
 * 1. Find icon name from @wordpress/icons package
 * 2. Add to the import/export block at the top:
 *
 *    export { iconName } from '@wordpress/icons';
 *
 *
 * ADDING CUSTOM SVG ICONS:
 * ----------------------------------------
 * 1. Create the icon as a JSX constant:
 *
 *    export const MyCustomIcon = (
 *      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
 *        <path d="..." fill="currentColor" />
 *      </svg>
 *    );
 *
 * 2. (Optional) Add to a grouped export if it belongs to a category:
 *
 *    export const MyCategoryIcons = {
 *      option1: MyIcon1,
 *      option2: MyIcon2,
 *      custom: MyCustomIcon,
 *    };
 *
 * 3. (Optional) Add category to getIcon() helper function
 *
 *
 * ICON BEST PRACTICES:
 * ----------------------------------------
 * - Use currentColor for fill/stroke to respect theme colors
 * - Keep viewBox consistent within a category (usually 24x24)
 * - Set explicit width/height for consistent sizing
 * - Use strokeLinecap="round" for smoother lines
 * - Keep paths simple and optimized
 * - Add descriptive variable names (e.g., BorderSolidIcon not Icon1)
 *
 * ============================================================================
 *
 * @package guttemberg-plus
 */

// Re-export WordPress icons for convenience
export {
	// Device icons
	desktop,
	tablet,
	mobile,
	// Link icons
	link,
	linkOff,
	// Action icons
	reset,
	plus,
	trash,
	// Chevron icons
	chevronDown,
	chevronRight,
	chevronUp,
	chevronLeft,
	// Formatting icons
	formatBold,
	formatItalic,
	formatUnderline,
	formatStrikethrough,
	// Alignment icons (WordPress)
	alignLeft,
	alignCenter,
	alignRight,
	// Misc
	lineSolid,
} from '@wordpress/icons';

// ============================================================================
// CUSTOM SVG ICONS
// ============================================================================

/**
 * Standard icon size configuration
 */
export const ICON_SIZE = {
	small: 16,
	default: 20,
	medium: 24,
	large: 32,
};

// ----------------------------------------------------------------------------
// RESPONSIVE ICONS
// ----------------------------------------------------------------------------

export const ResponsiveIcon = (
	<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
		<path
			fill="currentColor"
			d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
		/>
	</svg>
);

// ----------------------------------------------------------------------------
// TEXT ALIGNMENT ICONS (Custom - more visual than WordPress defaults)
// ----------------------------------------------------------------------------

export const AlignLeftIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<line x1="4" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<line x1="4" y1="18" x2="17" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const AlignCenterIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const AlignRightIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<line x1="10" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<line x1="7" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

// ----------------------------------------------------------------------------
// TEXT DECORATION ICONS
// ----------------------------------------------------------------------------

export const DecorationNoneIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const DecorationUnderlineIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<path d="M7 5v6a5 5 0 0 0 10 0V5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<line x1="5" y1="19" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const DecorationLineThroughIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">S</text>
		<line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const DecorationOverlineIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="5" y1="5" x2="19" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<text x="12" y="18" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">T</text>
	</svg>
);

// Grouped export
export const DecorationIcons = {
	none: DecorationNoneIcon,
	underline: DecorationUnderlineIcon,
	'line-through': DecorationLineThroughIcon,
	overline: DecorationOverlineIcon,
};

// ----------------------------------------------------------------------------
// BORDER STYLE ICONS
// ----------------------------------------------------------------------------

export const BorderNoneIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
		<line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const BorderSolidIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const BorderDashedIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
	</svg>
);

export const BorderDottedIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="0.5 3" strokeLinecap="round" />
	</svg>
);

export const BorderDoubleIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" />
		<line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const BorderGrooveIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
		<line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
	</svg>
);

export const BorderRidgeIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
		<line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
	</svg>
);

// Grouped export
export const BorderStyleIcons = {
	none: BorderNoneIcon,
	solid: BorderSolidIcon,
	dashed: BorderDashedIcon,
	dotted: BorderDottedIcon,
	double: BorderDoubleIcon,
	groove: BorderGrooveIcon,
	ridge: BorderRidgeIcon,
};

// ----------------------------------------------------------------------------
// SHADOW INTENSITY ICONS
// ----------------------------------------------------------------------------

export const ShadowNoneIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="4" y="4" width="16" height="16" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
		<line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const ShadowSubtleIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="6" y="6" width="14" height="14" rx="2" fill="currentColor" opacity="0.1" />
		<rect x="4" y="4" width="14" height="14" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const ShadowMediumIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="7" y="7" width="14" height="14" rx="2" fill="currentColor" opacity="0.2" />
		<rect x="4" y="4" width="14" height="14" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const ShadowStrongIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="8" y="8" width="14" height="14" rx="2" fill="currentColor" opacity="0.3" />
		<rect x="4" y="4" width="14" height="14" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const ShadowHeavyIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="9" y="9" width="14" height="14" rx="2" fill="currentColor" opacity="0.4" />
		<rect x="4" y="4" width="14" height="14" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

// Grouped export
export const ShadowIcons = {
	none: ShadowNoneIcon,
	subtle: ShadowSubtleIcon,
	medium: ShadowMediumIcon,
	strong: ShadowStrongIcon,
	heavy: ShadowHeavyIcon,
};

// ----------------------------------------------------------------------------
// BOX SIDE ICONS (for spacing/border controls)
// ----------------------------------------------------------------------------

export const SideTopIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="2" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const SideRightIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="16" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const SideBottomIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="2" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const SideLeftIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<line x1="2" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const SideAllIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
	</svg>
);

// Corner icons for border-radius
export const CornerTopLeftIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<path d="M2 9 L2 2 L9 2" fill="none" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const CornerTopRightIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<path d="M9 2 L16 2 L16 9" fill="none" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const CornerBottomRightIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<path d="M16 9 L16 16 L9 16" fill="none" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const CornerBottomLeftIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
		<path d="M9 16 L2 16 L2 9" fill="none" stroke="currentColor" strokeWidth="2" />
	</svg>
);

export const RadiusIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<path d="M2 16 L2 6 Q2 2 6 2 L16 2" fill="none" stroke="currentColor" strokeWidth="2" />
	</svg>
);

// Spacing indicator icons
export const MarginIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
		<rect x="4" y="4" width="10" height="10" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
	</svg>
);

export const PaddingIcon = (
	<svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
		<rect x="5" y="5" width="8" height="8" fill="currentColor" opacity="0.3" />
	</svg>
);

// Grouped export
export const SideIcons = {
	top: SideTopIcon,
	right: SideRightIcon,
	bottom: SideBottomIcon,
	left: SideLeftIcon,
	all: SideAllIcon,
	topLeft: CornerTopLeftIcon,
	topRight: CornerTopRightIcon,
	bottomRight: CornerBottomRightIcon,
	bottomLeft: CornerBottomLeftIcon,
	radius: RadiusIcon,
	margin: MarginIcon,
	padding: PaddingIcon,
};

// ----------------------------------------------------------------------------
// HEADING LEVEL ICONS
// ----------------------------------------------------------------------------

export const HeadingNoneIcon = (
	<svg viewBox="0 0 24 20" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="500">P</text>
	</svg>
);

export const HeadingH1Icon = (
	<svg viewBox="0 0 24 20" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">H1</text>
	</svg>
);

export const HeadingH2Icon = (
	<svg viewBox="0 0 24 20" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">H2</text>
	</svg>
);

export const HeadingH3Icon = (
	<svg viewBox="0 0 24 20" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">H3</text>
	</svg>
);

export const HeadingH4Icon = (
	<svg viewBox="0 0 24 20" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">H4</text>
	</svg>
);

export const HeadingH5Icon = (
	<svg viewBox="0 0 24 20" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">H5</text>
	</svg>
);

export const HeadingH6Icon = (
	<svg viewBox="0 0 24 20" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
		<text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">H6</text>
	</svg>
);

// Grouped export
export const HeadingIcons = {
	none: HeadingNoneIcon,
	h1: HeadingH1Icon,
	h2: HeadingH2Icon,
	h3: HeadingH3Icon,
	h4: HeadingH4Icon,
	h5: HeadingH5Icon,
	h6: HeadingH6Icon,
};

// ----------------------------------------------------------------------------
// ICON POSITION ICONS
// ----------------------------------------------------------------------------

export const IconPositionLeftIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="4" y="8" width="8" height="8" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
		<line x1="15" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.5" />
		<line x1="15" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
		<line x1="15" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const IconPositionRightIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="4" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" />
		<line x1="4" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" />
		<line x1="4" y1="15" x2="7" y2="15" stroke="currentColor" strokeWidth="1.5" />
		<rect x="12" y="8" width="8" height="8" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
	</svg>
);

export const IconPositionExtremeLeftIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<rect x="2" y="8" width="6" height="8" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
		<line x1="11" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.5" />
		<line x1="11" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
		<line x1="11" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

export const IconPositionExtremeRightIcon = (
	<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
		<line x1="2" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.5" />
		<line x1="2" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" />
		<line x1="2" y1="15" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" />
		<rect x="16" y="8" width="6" height="8" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
	</svg>
);

// Grouped export
export const IconPositionIcons = {
	left: IconPositionLeftIcon,
	right: IconPositionRightIcon,
	'box-left': IconPositionExtremeLeftIcon,
	'box-right': IconPositionExtremeRightIcon,
};

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Get icon by category and name
 *
 * @param {string} category - Icon category (e.g., 'border', 'shadow', 'side')
 * @param {string} name - Icon name within the category
 * @returns {JSX.Element|null} Icon component or null
 */
export function getIcon( category, name ) {
	const categories = {
		border: BorderStyleIcons,
		shadow: ShadowIcons,
		side: SideIcons,
		heading: HeadingIcons,
		decoration: DecorationIcons,
		position: IconPositionIcons,
	};

	return categories[ category ]?.[ name ] || null;
}

/**
 * Get all icons in a category
 *
 * @param {string} category - Icon category
 * @returns {Object} Object containing all icons in the category
 */
export function getIconCategory( category ) {
	const categories = {
		border: BorderStyleIcons,
		shadow: ShadowIcons,
		side: SideIcons,
		heading: HeadingIcons,
		decoration: DecorationIcons,
		position: IconPositionIcons,
	};

	return categories[ category ] || {};
}
