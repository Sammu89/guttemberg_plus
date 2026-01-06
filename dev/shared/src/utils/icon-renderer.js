/**
 * Icon Renderer Utility
 *
 * Framework-agnostic icon rendering functions for accordion, tabs, and other blocks.
 * Handles three icon types: character, image, and library (Dashicons/Lucide).
 *
 * @package
 * @since 1.0.0
 */

/**
 * Render a single icon element based on icon source configuration
 *
 * @param {Object} source       - Icon source configuration object
 * @param {string} source.kind  - Icon type: 'char', 'image', or 'library'
 * @param {string} source.value - Icon value (character, URL, or library:iconName)
 * @param {string} state        - Icon state: 'inactive' or 'active'
 * @param {Object} LucideIcons  - Lucide icons library object (imported from 'lucide-react')
 * @return {JSX.Element|null} Icon element or null if invalid source
 *
 * @example
 * // Character icon
 * renderSingleIcon({ kind: 'char', value: '▾' }, 'inactive', LucideIcons)
 *
 * @example
 * // Image icon
 * renderSingleIcon({ kind: 'image', value: 'https://example.com/icon.png' }, 'active', LucideIcons)
 *
 * @example
 * // Library icon (Dashicons)
 * renderSingleIcon({ kind: 'library', value: 'dashicons:arrow-down' }, 'inactive', LucideIcons)
 *
 * @example
 * // Library icon (Lucide)
 * renderSingleIcon({ kind: 'library', value: 'lucide:ChevronDown' }, 'active', LucideIcons)
 */
export const renderSingleIcon = ( source, state, LucideIcons ) => {
	if ( ! source || ! source.value ) {
		return null;
	}

	const stateClass = `accordion-icon-${ state }`;
	const baseClasses = `accordion-icon ${ stateClass }`;

	// Render character icon (simple text/emoji)
	if ( source.kind === 'char' ) {
		return (
			<span className={ `${ baseClasses } accordion-icon-char` } aria-hidden="true">
				{ source.value }
			</span>
		);
	}

	// Render image icon (URL to image file)
	if ( source.kind === 'image' ) {
		return (
			<img
				className={ `${ baseClasses } accordion-icon-image` }
				src={ source.value }
				alt=""
				aria-hidden="true"
			/>
		);
	}

	// Render library icon (Dashicons or Lucide)
	if ( source.kind === 'library' ) {
		const [ library, iconName ] = source.value.split( ':' );

		// Render Dashicons icon
		if ( library === 'dashicons' ) {
			return (
				<span
					className={ `${ baseClasses } accordion-icon-library accordion-icon-dashicons` }
					aria-hidden="true"
				>
					<span className={ `dashicons dashicons-${ iconName }` } />
				</span>
			);
		}

		// Render Lucide icon as inline SVG
		if ( library === 'lucide' ) {
			const LucideIcon = LucideIcons[ iconName ];
			return (
				<span
					className={ `${ baseClasses } accordion-icon-library accordion-icon-lucide` }
					aria-hidden="true"
				>
					{ LucideIcon ? <LucideIcon size="1em" /> : null }
				</span>
			);
		}
	}

	return null;
};

/**
 * Render icon wrapper with both inactive and active states
 *
 * Both icons are rendered in the markup. CSS controls visibility based on
 * the component's open/closed state via the `.is-open` class on the parent.
 *
 * @param {Object}  inactiveSource       - Inactive icon source configuration
 * @param {string}  inactiveSource.kind  - Icon type: 'char', 'image', or 'library'
 * @param {string}  inactiveSource.value - Icon value
 * @param {Object}  activeSource         - Active icon source configuration (optional)
 * @param {string}  activeSource.kind    - Icon type: 'char', 'image', or 'library'
 * @param {string}  activeSource.value   - Icon value
 * @param {boolean} useDifferentIcons    - Whether to use different icons for active/inactive states
 * @param {boolean} showIcon             - Whether to show the icon at all
 * @param {Object}  LucideIcons          - Lucide icons library object (imported from 'lucide-react')
 * @return {JSX.Element|null} Icon wrapper element or null if hidden/invalid
 *
 * @example
 * // Single icon (rotates on state change)
 * renderIconWrapper(
 *   { kind: 'char', value: '▾' },
 *   null,
 *   false,
 *   true,
 *   LucideIcons
 * )
 *
 * @example
 * // Different icons for active/inactive states
 * renderIconWrapper(
 *   { kind: 'library', value: 'lucide:ChevronDown' },
 *   { kind: 'library', value: 'lucide:ChevronUp' },
 *   true,
 *   true,
 *   LucideIcons
 * )
 *
 * @example
 * // Hidden icon
 * renderIconWrapper(
 *   { kind: 'char', value: '▾' },
 *   null,
 *   false,
 *   false,
 *   LucideIcons
 * )
 * // Returns: null
 */
export const renderIconWrapper = (
	inactiveSource,
	activeSource,
	useDifferentIcons,
	showIcon,
	LucideIcons
) => {
	// Check showIcon attribute to determine visibility
	if ( showIcon === false ) {
		return null;
	}

	if ( ! inactiveSource || ! inactiveSource.value ) {
		return null;
	}

	// Only render different icons if explicitly enabled AND active source exists
	const hasDifferentIcons = useDifferentIcons && activeSource && activeSource.value;

	// Render inactive icon (always visible when closed)
	const inactiveIcon = renderSingleIcon( inactiveSource, 'inactive', LucideIcons );

	// Render active icon only if different icons mode is enabled
	const activeIcon = hasDifferentIcons
		? renderSingleIcon( activeSource, 'active', LucideIcons )
		: null;

	return (
		<span className="accordion-icon-wrapper" aria-hidden="true">
			{ inactiveIcon }
			{ activeIcon }
		</span>
	);
};
