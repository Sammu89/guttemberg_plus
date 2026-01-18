/**
 * Responsive Expander
 *
 * Applies responsive variants to attributes marked as responsive.
 * Works with auto-generated CSS variable names from comprehensive-expander.
 */

/**
 * Apply responsive variants to all responsive attributes
 *
 * For each attribute with responsive: true, adds:
 * - cssVarVariants: [base, tablet, mobile]
 *
 * @param {Object} attributes - Expanded attributes
 * @param {string} blockType  - Block type for generating var names
 * @return {Object} Attributes with responsive variants applied
 */
function applyResponsiveVariants( attributes, blockType ) {
	const expanded = {};

	Object.entries( attributes || {} ).forEach( ( [ name, attr ] ) => {
		const copy = { ...attr };

		// Only apply variants if attribute is responsive and has a cssVar
		if ( copy.responsive === true && copy.cssVar ) {
			// Build variants: [desktop (base), tablet, mobile]
			copy.cssVarVariants = [
				copy.cssVar, // Desktop (already set by comprehensive-expander)
				`${ copy.cssVar }-tablet`,
				`${ copy.cssVar }-mobile`,
			];
		}

		expanded[ name ] = copy;
	} );

	return expanded;
}

module.exports = {
	applyResponsiveVariants,
};
