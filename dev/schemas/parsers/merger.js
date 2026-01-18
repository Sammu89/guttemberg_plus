/**
 * Schema Merger
 *
 * Connects minimal schema attributes to HTML elements by reading the
 * `appliesTo` field and attaching element metadata from the HTML structure.
 *
 * This creates the foundation for the comprehensive expander to generate
 * CSS selectors and variables with full context about which elements they apply to.
 */

/**
 * Merge HTML structure metadata into schema attributes
 *
 * @param {Object} minimalSchema - The minimal schema with macro definitions
 * @param {Object} htmlStructure - Parsed HTML structure from html-parser
 * @return {Object} Merged schema with element metadata attached
 */
function mergeStructureIntoSchema( minimalSchema, htmlStructure ) {
	// Clone the schema to avoid mutations
	const merged = JSON.parse( JSON.stringify( minimalSchema ) );

	if ( ! merged.attributes ) {
		console.warn( 'No attributes found in minimal schema' );
		return {
			...merged,
			structure: htmlStructure,
		};
	}

	const mergedAttributes = {};

	Object.entries( merged.attributes ).forEach( ( [ attrName, attrDef ] ) => {
		// Use 'element' field (new convention) or fall back to 'appliesTo' (legacy)
		const elementId = attrDef.element || attrDef.appliesTo;
		const elementIds = Array.isArray( elementId ) ? elementId : elementId ? [ elementId ] : [];

		// Validate element exists in HTML structure
		elementIds.forEach( ( id ) => {
			if ( id && ! htmlStructure.elements[ id ] ) {
				console.warn(
					`Warning: Attribute "${ attrName }" references element "${ id }" ` +
						`but that element was not found in the HTML structure.`
				);
			}
		} );

		// Keep attribute as-is (element lookup happens in comprehensive-expander)
		// No need to attach _element* metadata - it bloats the schema
		mergedAttributes[ attrName ] = {
			...attrDef,
			// Normalize to 'element' field
			element: elementId,
		};

		// Remove legacy 'appliesTo' if present
		if ( mergedAttributes[ attrName ].appliesTo ) {
			delete mergedAttributes[ attrName ].appliesTo;
		}
	} );

	return {
		...merged,
		attributes: mergedAttributes,
		structure: htmlStructure,
	};
}

/**
 * Merge structures for multiple block types
 *
 * @param {Object} schemas    - Object mapping block types to minimal schemas
 * @param {Object} structures - Object mapping block types to HTML structures
 * @return {Object} Merged schemas keyed by block type
 */
function mergeStructures( schemas, structures ) {
	const merged = {};

	for ( const blockType of Object.keys( schemas ) ) {
		if ( ! structures[ blockType ] ) {
			console.warn( `No HTML structure found for block type: ${ blockType }` );
			continue;
		}

		merged[ blockType ] = mergeStructureIntoSchema(
			schemas[ blockType ],
			structures[ blockType ]
		);
	}

	return merged;
}

module.exports = {
	mergeStructureIntoSchema,
	mergeStructures,
};
