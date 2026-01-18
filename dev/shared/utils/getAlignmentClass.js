/**
 * getAlignmentClass Utility
 *
 * Centralized utility for building horizontal alignment CSS class names.
 * Used in save.js for frontend rendering.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Get the alignment CSS class name
 *
 * @param {string} alignmentValue - The alignment value ('left', 'center', 'right')
 * @return {string} The CSS class name for alignment
 */
export const getAlignmentClass = ( alignmentValue ) => {
	return alignmentValue ? `gutplus-align-${ alignmentValue }` : 'gutplus-align-left';
};
