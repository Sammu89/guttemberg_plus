/**
 * SideIcon Atom
 *
 * Icons representing sides of a box (top, right, bottom, left).
 * Shows a square with the specified side highlighted.
 *
 * @package
 */

// Side icons - square with one side highlighted
const sideIcons = {
	top: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<line x1="2" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="2" />
		</svg>
	),
	right: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<line x1="16" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
		</svg>
	),
	bottom: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<line x1="2" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
		</svg>
	),
	left: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<line x1="2" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2" />
		</svg>
	),
	// Corner icons for border-radius
	topLeft: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<path d="M2 9 L2 2 L9 2" stroke="currentColor" strokeWidth="2" fill="none" />
		</svg>
	),
	topRight: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<path d="M9 2 L16 2 L16 9" stroke="currentColor" strokeWidth="2" fill="none" />
		</svg>
	),
	bottomRight: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<path d="M16 9 L16 16 L9 16" stroke="currentColor" strokeWidth="2" fill="none" />
		</svg>
	),
	bottomLeft: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.3"
			/>
			<path d="M9 16 L2 16 L2 9" stroke="currentColor" strokeWidth="2" fill="none" />
		</svg>
	),
	// All sides linked icon
	all: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect x="2" y="2" width="14" height="14" stroke="currentColor" strokeWidth="2" />
		</svg>
	),
	// Radius icon (curved corner)
	radius: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<path d="M2 16 L2 6 Q2 2 6 2 L16 2" stroke="currentColor" strokeWidth="2" fill="none" />
		</svg>
	),
	// Spacing icons
	margin: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect x="5" y="5" width="8" height="8" stroke="currentColor" strokeWidth="1" />
			<rect
				x="2"
				y="2"
				width="14"
				height="14"
				stroke="currentColor"
				strokeWidth="1"
				strokeDasharray="2,1"
				opacity="0.5"
			/>
		</svg>
	),
	padding: (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect x="2" y="2" width="14" height="14" stroke="currentColor" strokeWidth="1" />
			<rect x="5" y="5" width="8" height="8" fill="currentColor" opacity="0.2" />
		</svg>
	),
};

/**
 * SideIcon Component
 *
 * @param {Object} props
 * @param {string} props.side - Which side to show (top, right, bottom, left, topLeft, etc.)
 */
export function SideIcon( { side = 'all' } ) {
	return <span className="gutplus-side-icon">{ sideIcons[ side ] || sideIcons.all }</span>;
}

// Export individual icons for direct use
export { sideIcons };

export default SideIcon;
