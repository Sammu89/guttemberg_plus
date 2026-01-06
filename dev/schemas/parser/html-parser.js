/**
 * HTML Template Parser
 *
 * Parses HTML structure files with DSL (Domain Specific Language) annotations
 * into structured data that drives comprehensive schema generation.
 *
 * This parser is the FOUNDATION of the schema system - it extracts the complete
 * DOM structure and all variations, enabling auto-generation of CSS, React components,
 * and PHP templates from a single HTML source.
 *
 * ============================================================================
 * DSL FEATURE REFERENCE
 * ============================================================================
 *
 * 1. ELEMENT IDENTIFICATION: data-el="elementId"
 * ─────────────────────────────────────────────────────────────────────────
 * Marks an element for schema tracking. Each data-el becomes an entry in
 * the elements map with its selector, tag, parent, and children.
 *
 * Example:
 *   <div class="accordion-title" data-el="title">
 *
 * Result:
 *   elements.title = {
 *     id: "title",
 *     selector: ".accordion-title",
 *     tag: "div",
 *     parent: "item",
 *     children: ["icon", "titleText"]
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 2. SELECTOR EXTRACTION: class="primary-class other-classes"
 * ─────────────────────────────────────────────────────────────────────────
 * The FIRST class becomes the element's CSS selector. Additional classes
 * are tracked but the primary class is used for SCSS generation.
 *
 * Example:
 *   <button class="accordion-title is-active" data-el="title">
 *
 * Result:
 *   selector: ".accordion-title"
 *   classes: ["accordion-title", "is-active"]
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 3. CONDITIONAL RENDERING: data-when / data-else
 * ─────────────────────────────────────────────────────────────────────────
 * Create if/else branches in the template. Useful for optional elements.
 *
 * Example:
 *   <template data-when="headingLevel !== 'none'">
 *     <h{headingLevel} class="accordion-heading" data-el="heading">
 *       Content when heading is enabled
 *     </h{headingLevel}>
 *   </template>
 *   <template data-else>
 *     Content when heading is disabled
 *   </template>
 *
 * Result:
 *   variations["headingLevel !== 'none'"] = {
 *     condition: "headingLevel !== 'none'",
 *     trueStructure: "<h{headingLevel}>...</h>",
 *     falseStructure: "Content when heading is disabled"
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 4. SWITCH STATEMENTS: data-switch / data-case / data-default
 * ─────────────────────────────────────────────────────────────────────────
 * Create multi-way branches based on a value. Great for layout variations.
 *
 * Example:
 *   <template data-switch="iconPosition">
 *     <template data-case="box-left">
 *       <span data-el="iconSlot">Icon</span>
 *       <div data-el="titleText">Title</div>
 *     </template>
 *     <template data-case="box-right">
 *       <div data-el="titleText">Title</div>
 *       <span data-el="iconSlot">Icon</span>
 *     </template>
 *     <template data-default>
 *       <div data-el="titleInline">
 *         <span data-el="titleText">Title</span>
 *         <span data-el="icon">Icon</span>
 *       </div>
 *     </template>
 *   </template>
 *
 * Result:
 *   variations["iconPosition"] = {
 *     type: "switch",
 *     expression: "iconPosition",
 *     cases: {
 *       "box-left": { value: "box-left", content: "..." },
 *       "box-right": { value: "box-right", content: "..." },
 *       "default": { value: "default", content: "...", isDefault: true }
 *     }
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 5. REUSABLE FRAGMENTS: data-slot (Definition & Injection)
 * ─────────────────────────────────────────────────────────────────────────
 * Define a fragment once, inject it multiple times. Reduces duplication.
 *
 * Definition (with content):
 *   <template data-slot="iconMarkup">
 *     <span class="accordion-icon" data-el="icon"></span>
 *   </template>
 *
 * Injection (empty):
 *   <template data-slot="iconMarkup"></template>
 *
 * Result:
 *   slots["iconMarkup"] = {
 *     name: "iconMarkup",
 *     content: "<span class=\"accordion-icon\">...</span>",
 *     injections: [node1, node2, ...]  // Where it's used
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 6. STRING SUBSTITUTION: {placeholderName}
 * ─────────────────────────────────────────────────────────────────────────
 * Dynamic values injected at render time. Used for tag names, attributes, etc.
 *
 * Example:
 *   <h{headingLevel} class="accordion-heading">
 *
 * When headingLevel = 3:
 *   <h3 class="accordion-heading">
 *
 * Result:
 *   placeholders: ["headingLevel"]
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 7. CONTENT PLACEHOLDER: <slot>
 * ─────────────────────────────────────────────────────────────────────────
 * Marks where dynamic content (InnerBlocks, user content) will be inserted.
 *
 * Example:
 *   <div class="accordion-content-inner" data-el="contentInner">
 *     <slot data-el="contentSlot"></slot>
 *   </div>
 *
 * Result:
 *   elements.contentSlot = {
 *     id: "contentSlot",
 *     tag: "slot",
 *     isSlot: true,
 *     parent: "contentInner"
 *   }
 *
 * ============================================================================
 * COMPLETE EXAMPLE
 * ============================================================================
 *
 * Input HTML:
 * ```html
 * <div class="gutplus-accordion" data-el="item">
 *   <template data-when="showIcon">
 *     <span class="accordion-icon" data-el="icon"></span>
 *   </template>
 *   <div class="accordion-title" data-el="title">
 *     <slot data-el="titleSlot"></slot>
 *   </div>
 * </div>
 * ```
 *
 * Output Structure:
 * ```javascript
 * {
 *   elements: {
 *     item: { id: "item", selector: ".gutplus-accordion", ... },
 *     icon: { id: "icon", selector: ".accordion-icon", ... },
 *     title: { id: "title", selector: ".accordion-title", ... },
 *     titleSlot: { id: "titleSlot", tag: "slot", isSlot: true, ... }
 *   },
 *   variations: {
 *     "showIcon": { condition: "showIcon", trueStructure: "...", ... }
 *   },
 *   slots: {},
 *   conditions: [...],
 *   placeholders: []
 * }
 * ```
 *
 * ============================================================================
 * WHY THIS MATTERS
 * ============================================================================
 *
 * The HTML template is the SINGLE SOURCE OF TRUTH for:
 * 1. DOM structure → Used by save.js generator
 * 2. Element hierarchy → Used to build parent/child relationships
 * 3. CSS selectors → Used by SCSS generator
 * 4. Variations → Used by edit.js to show/hide controls
 * 5. Slots → Used to identify where InnerBlocks go
 *
 * By parsing this once, we drive ALL downstream generation with zero sync issues.
 *
 * ============================================================================
 * USAGE
 * ============================================================================
 *
 * ```javascript
 * const { parseHTMLTemplate } = require('./html-parser');
 * const structure = parseHTMLTemplate('accordion-structure.html');
 *
 * // Access parsed data
 * console.log(structure.elements);      // All elements with selectors
 * console.log(structure.variations);    // All conditional/switch logic
 * console.log(structure.slots);         // All reusable fragments
 * console.log(structure.placeholders);  // All {dynamic} values
 * ```
 */

const fs = require( 'fs' );
const path = require( 'path' );
const { JSDOM } = require( 'jsdom' );

/**
 * Main parser function
 *
 * @param {string} htmlFilePath - Path to HTML template file
 * @return {Object} Structured representation of the template
 */
function parseHTMLTemplate( htmlFilePath ) {
	const html = fs.readFileSync( htmlFilePath, 'utf8' );
	const dom = new JSDOM( html );
	const document = dom.window.document;

	const elements = {};
	const variations = {};
	const slots = {};
	const conditions = [];
	const placeholders = new Set();

	// Find all placeholders in the original HTML
	const placeholderRegex = /\{(\w+)\}/g;
	let match;
	while ( ( match = placeholderRegex.exec( html ) ) !== null ) {
		placeholders.add( match[ 1 ] );
	}

	/**
	 * Extract HTML attributes (excluding data-* and class)
	 *
	 * @param {Element} node - DOM element
	 * @return {Object} Attribute key-value pairs
	 */
	function extractAttributes( node ) {
		const attrs = {};
		Array.from( node.attributes ).forEach( ( attr ) => {
			if ( ! attr.name.startsWith( 'data-' ) && attr.name !== 'class' ) {
				attrs[ attr.name ] = attr.value;
			}
		} );
		return attrs;
	}

	/**
	 * Handle <template> directive nodes
	 *
	 * @param {Element} node       - Template element
	 * @param {Object}  elements   - Elements map
	 * @param {Object}  variations - Variations map
	 * @param {Object}  slots      - Slots map
	 * @param {Array}   conditions - Conditions array
	 */
	function handleTemplateDirective( node, elements, variations, slots, conditions ) {
		const whenAttr = node.getAttribute( 'data-when' );
		const elseAttr = node.hasAttribute( 'data-else' );
		const switchAttr = node.getAttribute( 'data-switch' );
		const caseAttr = node.getAttribute( 'data-case' );
		const defaultAttr = node.hasAttribute( 'data-default' );
		const slotAttr = node.getAttribute( 'data-slot' );

		// Handle data-slot (fragment definition or injection)
		if ( slotAttr ) {
			if ( node.innerHTML.trim() ) {
				// Definition: <template data-slot="name">content</template>
				slots[ slotAttr ] = {
					name: slotAttr,
					content: node.innerHTML,
					node,
				};
			} else {
				// Injection: <template data-slot="name"></template>
				// This is a placeholder for where the slot content should be injected
				// We'll track these as references
				if ( ! slots[ slotAttr ] ) {
					slots[ slotAttr ] = {
						name: slotAttr,
						injections: [],
					};
				}
				if ( ! slots[ slotAttr ].injections ) {
					slots[ slotAttr ].injections = [];
				}
				slots[ slotAttr ].injections.push( node );
			}
		}

		// Handle data-when / data-else (conditionals)
		if ( whenAttr || elseAttr ) {
			const condition = {
				type: 'conditional',
				expression: whenAttr || null,
				isElse: elseAttr,
				trueContent: whenAttr ? node.innerHTML : null,
				falseContent: elseAttr ? node.innerHTML : null,
				node,
			};
			conditions.push( condition );

			// Try to match with previous when to create if-else pair
			if ( elseAttr && conditions.length > 1 ) {
				const prevCondition = conditions[ conditions.length - 2 ];
				if (
					prevCondition.type === 'conditional' &&
					prevCondition.expression &&
					! prevCondition.falseContent
				) {
					prevCondition.falseContent = node.innerHTML;
					conditions.pop(); // Remove the else, as it's merged with the when
				}
			}

			// Store in variations for easy lookup
			if ( whenAttr ) {
				variations[ whenAttr ] = {
					condition: whenAttr,
					trueStructure: node.innerHTML,
					falseStructure: null,
				};
			}
		}

		// Handle data-switch (switch statement)
		if ( switchAttr ) {
			if ( ! variations[ switchAttr ] ) {
				variations[ switchAttr ] = {
					type: 'switch',
					expression: switchAttr,
					cases: {},
				};
			}

			// Parse child case/default branches from content
			const contentDOM = new JSDOM( `<div>${ node.innerHTML }</div>` );
			const caseNodes = contentDOM.window.document.querySelectorAll(
				'template[data-case], template[data-default]'
			);

			caseNodes.forEach( ( caseNode ) => {
				const caseValue = caseNode.getAttribute( 'data-case' );
				const isDefault = caseNode.hasAttribute( 'data-default' );
				const key = isDefault ? 'default' : caseValue;

				if ( key ) {
					variations[ switchAttr ].cases[ key ] = {
						value: key,
						content: caseNode.innerHTML,
						isDefault,
					};
				}
			} );
		}

		// Handle data-case (case branch) - for direct parsing
		if ( caseAttr && node.parentElement && node.parentElement.hasAttribute( 'data-switch' ) ) {
			const switchExpr = node.parentElement.getAttribute( 'data-switch' );
			if ( ! variations[ switchExpr ] ) {
				variations[ switchExpr ] = {
					type: 'switch',
					expression: switchExpr,
					cases: {},
				};
			}
			variations[ switchExpr ].cases[ caseAttr ] = {
				value: caseAttr,
				content: node.innerHTML,
				isDefault: false,
			};
		}

		// Handle data-default (default case) - for direct parsing
		if (
			defaultAttr &&
			node.parentElement &&
			node.parentElement.hasAttribute( 'data-switch' )
		) {
			const switchExpr = node.parentElement.getAttribute( 'data-switch' );
			if ( ! variations[ switchExpr ] ) {
				variations[ switchExpr ] = {
					type: 'switch',
					expression: switchExpr,
					cases: {},
				};
			}
			variations[ switchExpr ].cases.default = {
				value: 'default',
				content: node.innerHTML,
				isDefault: true,
			};
		}
	}

	/**
	 * Recursively traverse DOM tree and extract structure
	 *
	 * @param {Element}     node     - Current node
	 * @param {string|null} parentId - Parent element ID
	 */
	function traverse( node, parentId = null ) {
		// Skip non-element nodes
		if ( ! node || node.nodeType !== 1 ) {
			return;
		}

		// Handle <template> special cases
		if ( node.tagName === 'TEMPLATE' ) {
			handleTemplateDirective( node, elements, variations, slots, conditions );

			// Still traverse children for nested templates
			Array.from( node.content.childNodes ).forEach( ( child ) => {
				traverse( child, parentId );
			} );
			return;
		}

		// Extract element with data-el attribute
		const elId = node.getAttribute( 'data-el' );

		if ( elId ) {
			const classes =
				node
					.getAttribute( 'class' )
					?.split( ' ' )
					.filter( ( c ) => c ) || [];
			const selector = classes[ 0 ] ? `.${ classes[ 0 ] }` : null;

			elements[ elId ] = {
				id: elId,
				selector,
				tag: node.tagName.toLowerCase(),
				classes,
				attributes: extractAttributes( node ),
				children: [],
				parent: parentId,
				isSlot: node.tagName.toLowerCase() === 'slot',
			};

			// Add to parent's children array
			if ( parentId && elements[ parentId ] ) {
				elements[ parentId ].children.push( elId );
			}

			// Update parentId for children
			parentId = elId;
		}

		// Handle <slot> elements (InnerBlocks placeholder)
		if ( node.tagName === 'SLOT' ) {
			const slotId = node.getAttribute( 'data-el' ) || 'slot';
			if ( ! elements[ slotId ] ) {
				elements[ slotId ] = {
					id: slotId,
					selector: null,
					tag: 'slot',
					classes: [],
					attributes: extractAttributes( node ),
					children: [],
					parent: parentId,
					isSlot: true,
				};

				if ( parentId && elements[ parentId ] ) {
					elements[ parentId ].children.push( slotId );
				}
			}
		}

		// Recurse through children
		Array.from( node.children ).forEach( ( child ) => {
			traverse( child, parentId );
		} );
	}

	// Start traversal from body (skipping instructions section)
	const templateRoot =
		document.querySelector( '[data-el]' )?.closest( 'div' ) || document.body.firstElementChild;
	if ( templateRoot ) {
		traverse( templateRoot );
	}

	return {
		elements,
		variations,
		slots,
		conditions,
		placeholders: Array.from( placeholders ),
		template: html, // Original HTML for reference
	};
}

/**
 * Parse multiple HTML templates
 *
 * @param {Object} templatePaths - Object mapping block types to template paths
 * @return {Object} Parsed structures keyed by block type
 */
function parseHTMLTemplates( templatePaths ) {
	const structures = {};

	for ( const [ blockType, templatePath ] of Object.entries( templatePaths ) ) {
		structures[ blockType ] = parseHTMLTemplate( templatePath );
	}

	return structures;
}

module.exports = {
	parseHTMLTemplate,
	parseHTMLTemplates,
};
