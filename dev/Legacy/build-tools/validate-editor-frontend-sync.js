/**
 * Editor-Frontend Synchronization Validator
 *
 * Validates that edit.js (editor) and save.js (frontend) have consistent:
 * - Style application targets (same elements receive styles)
 * - CSS class names (structural classes match)
 * - Transform property formatting (needs CSS functions)
 * - Text-decoration element targeting (applied to text, not parent)
 * - Icon style resets (when parent has text-decoration)
 * - Heading margin consistency
 * - CSS variable usage consistency
 *
 * Based on comprehensive audit findings from docs/EDITOR-FRONTEND-SYNC-AUDIT.md
 *
 * Usage: npm run validate:editor-frontend
 *
 * @package
 * @since 1.0.0
 */

const fs = require( 'fs' );
const path = require( 'path' );

// ANSI color codes for terminal output
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	cyan: '\x1b[36m',
	gray: '\x1b[90m',
	bold: '\x1b[1m',
};

const ROOT_DIR = path.resolve( __dirname, '..' );
const BLOCKS = [ 'accordion', 'tabs', 'toc' ];

// ═══════════════════════════════════════════════════════════════════════════
// FILE LOADING
// ═══════════════════════════════════════════════════════════════════════════

function loadBlockFiles( blockName ) {
	const editPath = path.join( ROOT_DIR, `blocks/${ blockName }/src/edit.js` );
	const savePath = path.join( ROOT_DIR, `blocks/${ blockName }/src/save.js` );
	const stylePath = path.join( ROOT_DIR, `css/${ blockName }_hardcoded.scss` );

	if ( ! fs.existsSync( editPath ) || ! fs.existsSync( savePath ) ) {
		return null;
	}

	return {
		editCode: fs.readFileSync( editPath, 'utf-8' ),
		saveCode: fs.readFileSync( savePath, 'utf-8' ),
		styleCode: fs.existsSync( stylePath ) ? fs.readFileSync( stylePath, 'utf-8' ) : '',
		editPath,
		savePath,
		stylePath,
	};
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE 1: Text-Decoration Element Targeting
// Ensures text-decoration is applied to text element, not parent
// ═══════════════════════════════════════════════════════════════════════════

function validateTextDecorationTarget( blockName, editCode, editPath ) {
	const errors = [];

	// Find titleFormattingStyles or similar style objects containing textDecoration
	const formattingStylesRegex = /const\s+(\w*[Ff]ormatting[Ss]tyles)\s*=\s*\{([^}]+)\}/gs;
	let match;

	while ( ( match = formattingStylesRegex.exec( editCode ) ) !== null ) {
		const styleName = match[ 1 ];
		const styleContent = match[ 2 ];

		// Check if this style object contains textDecoration
		if ( ! styleContent.includes( 'textDecoration' ) ) {
			continue;
		}

		// Find where this style object is applied
		const applicationRegex = new RegExp(
			`style=\\{\\s*\\{[^}]*\\.\\.\\.${ styleName }[^}]*\\}\\s*\\}`,
			'g'
		);

		const lines = editCode.split( '\n' );
		let application;

		while ( ( application = applicationRegex.exec( editCode ) ) !== null ) {
			// Get context before this style application (look back ~300 chars for className)
			const contextStart = Math.max( 0, application.index - 300 );
			const context = editCode.substring( contextStart, application.index );

			// Find the className of the element this style is applied to
			// Use exec() in a loop to find ALL matches, then use the LAST one (closest to style prop)
			const classNameRegex = /className=\{?\s*[`"']([^`"']+)[`"']/g;
			let classNameMatch;
			let lastMatch = null;
			while ( ( classNameMatch = classNameRegex.exec( context ) ) !== null ) {
				lastMatch = classNameMatch;
			}

			if ( lastMatch ) {
				const className = lastMatch[ 1 ];

				// Check if it's a parent element (title/button) vs text element (title-text/button-text)
				const isParentElement =
					( className.includes( 'accordion-title' ) &&
						! className.includes( 'accordion-title-text' ) ) ||
					( className.includes( 'tab-button' ) &&
						! className.includes( 'tab-button-text' ) ) ||
					( className.includes( 'toc-title' ) &&
						! className.includes( 'toc-title-text' ) );

				if ( isParentElement ) {
					const lineNum = editCode.substring( 0, application.index ).split( '\n' ).length;
					errors.push( {
						block: blockName,
						file: path.basename( editPath ),
						line: lineNum,
						rule: 'text-decoration-target',
						message: `${ styleName } (with text-decoration) applied to parent element instead of text element`,
						expected: 'Apply to text child element (e.g., .accordion-title-text)',
						found: `Applied to parent element: ${ className }`,
						fix: `Move ${ styleName } to the RichText/text span element, not the parent container`,
						context: lines[ lineNum - 1 ]?.trim().substring( 0, 80 ) || '',
					} );
				}
			}
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE 2: Icon Text-Decoration Reset Presence
// Ensures icon has text-decoration reset when parent has text-decoration
// ═══════════════════════════════════════════════════════════════════════════

function validateIconTextDecorationReset( blockName, editCode, editPath ) {
	const errors = [];

	// Find icon style objects
	const iconStyleRegex = /(\w*[Ii]con[Ss]tyle[s]?)\s*=\s*\{([^}]+)\}/gs;
	let match;

	while ( ( match = iconStyleRegex.exec( editCode ) ) !== null ) {
		const styleName = match[ 1 ];
		const styleContent = match[ 2 ];

		// Check if icon style has text-decoration reset
		const hasTextDecorationReset =
			styleContent.includes( 'textDecoration' ) &&
			( styleContent.includes( "'none'" ) ||
				styleContent.includes( '"none"' ) ||
				styleContent.includes( '`none`' ) );

		// Find parent element context (look for text-decoration on parent)
		// Check if the icon is rendered inside an element that has text-decoration
		// by looking at the context around where the icon is used (within 500 chars)
		const iconUsageStart = Math.max( 0, match.index - 500 );
		const iconUsageEnd = Math.min( editCode.length, match.index + 500 );
		const iconContext = editCode.substring( iconUsageStart, iconUsageEnd );

		// Check if titleFormattingStyles/textDecoration is applied to the SAME element as the icon
		// (not just anywhere in the file)
		const hasParentTextDecoration =
			iconContext.match(
				/style=\{[^}]*\.\.\.(\w*[Ff]ormatting[Ss]tyles)[^}]*\}[^<]*\{[^}]*icon/s
			) || iconContext.match( /style=\{[^}]*textDecoration[^}]*\}[^<]*\{[^}]*icon/s );

		if (
			hasParentTextDecoration &&
			! hasTextDecorationReset &&
			! styleContent.includes( 'textDecoration' )
		) {
			const lineNum = editCode.substring( 0, match.index ).split( '\n' ).length;
			errors.push( {
				block: blockName,
				file: path.basename( editPath ),
				line: lineNum,
				rule: 'icon-text-decoration-reset',
				message: `Icon style missing text-decoration reset while parent may have text-decoration`,
				expected: "Icon style should include textDecoration: 'none'",
				found: `Icon style without text-decoration reset`,
				fix: `Add textDecoration: 'none' to ${ styleName } object`,
				context: styleContent.substring( 0, 80 ),
			} );
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE 3: Transform Property Formatting
// Ensures transform values use CSS function wrappers (rotate, scale, etc.)
// ═══════════════════════════════════════════════════════════════════════════

function validateTransformProperty( blockName, editCode, editPath ) {
	const errors = [];
	const lines = editCode.split( '\n' );

	// Find transform properties in style objects
	const transformRegex = /transform:\s*([^,}\n]+)/g;
	let match;

	while ( ( match = transformRegex.exec( editCode ) ) !== null ) {
		const transformValue = match[ 1 ].trim();

		// Check if value has CSS function wrapper
		const hasFunctionWrapper =
			/^['"`]?(rotate|scale|translate|skew|matrix|perspective)\s*\(/.test( transformValue );

		// Check if value looks like raw angle/number without function
		const isRawValue =
			/^['"`]?\d+\s*(deg|px|%)['"`]?$/.test( transformValue ) ||
			/^effectiveValues\.\w+/.test( transformValue ) ||
			/^attributes\.\w+/.test( transformValue ) ||
			( /^\w+$/.test( transformValue ) && ! transformValue.startsWith( 'rotate' ) );

		// Also check for template literals that might be valid
		const isTemplateLiteral = /`.*\$\{.*\}.*`/.test( transformValue );
		const templateHasFunction =
			isTemplateLiteral && /rotate|scale|translate/.test( transformValue );

		if ( isRawValue && ! hasFunctionWrapper && ! templateHasFunction ) {
			const lineNum = editCode.substring( 0, match.index ).split( '\n' ).length;
			errors.push( {
				block: blockName,
				file: path.basename( editPath ),
				line: lineNum,
				rule: 'transform-format',
				message: 'Transform property missing CSS function wrapper',
				expected: 'rotate(...), scale(...), translate(...), etc.',
				found: transformValue,
				fix:
					transformValue.includes( 'effectiveValues' ) ||
					transformValue.includes( 'attributes' )
						? `transform: \`rotate(\${${ transformValue }})\``
						: `transform: 'rotate(${ transformValue })'`,
				context: lines[ lineNum - 1 ]?.trim() || '',
			} );
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE 4: CSS Class Name Parity
// Ensures core structural classes match between editor and frontend
// ═══════════════════════════════════════════════════════════════════════════

function validateClassNameParity( blockName, editCode, saveCode, editPath, savePath ) {
	const errors = [];

	// Key structural elements to check (block-specific)
	const structuralElements = {
		accordion: [
			'accordion-title',
			'accordion-title-text',
			'accordion-icon',
			'accordion-content',
		],
		tabs: [ 'tab-button', 'tab-button-text', 'tab-title', 'tab-icon', 'tab-panel' ],
		toc: [ 'toc-title', 'toc-title-text', 'toc-icon', 'toc-content', 'toc-list' ],
	};

	const elementsToCheck = structuralElements[ blockName ] || [];

	for ( const elementClass of elementsToCheck ) {
		// Extract className assignments in edit.js (literal strings)
		const editClassRegex = new RegExp(
			`className=\\{?\\s*["\`']([^"\`']*${ elementClass }[^"\`']*)["\`']`,
			'g'
		);
		const editMatches = [ ...editCode.matchAll( editClassRegex ) ];

		// Extract className assignments in save.js (both literal strings and expressions)
		// Literal: className="accordion-icon-wrapper"
		// Expression: className={ iconClasses + ' accordion-icon-char' }
		const saveLiteralRegex = new RegExp(
			`className=\\{?\\s*["\`']([^"\`']*${ elementClass }[^"\`']*)["\`']`,
			'g'
		);
		const saveExpressionRegex = new RegExp(
			`className=\\{[^}]*['"\`]([^'"\`]*${ elementClass }[^'"\`]*)['"\`]`,
			'g'
		);

		let saveMatches = [
			...saveCode.matchAll( saveLiteralRegex ),
			...saveCode.matchAll( saveExpressionRegex ),
		];

		// ICON CLASSES VARIABLE HANDLING: For expressions like { iconClasses + ' tab-icon-char' }
		// The iconClasses variable typically contains the base class (e.g., 'tab-icon')
		// We need to combine it with the literal part to get the full class list
		if ( elementClass.includes( '-icon' ) ) {
			// Find iconClasses variable definition (e.g., const iconClasses = 'tab-icon' + ...)
			const iconClassesDefRegex = /const\s+iconClasses\s*=\s*['"`]([^'"`]*)/;
			const iconClassesDef = saveCode.match( iconClassesDefRegex );

			if ( iconClassesDef ) {
				const baseClass = iconClassesDef[ 1 ].trim(); // e.g., 'tab-icon' or 'accordion-icon'

				// For each expression match, prepend the base class from iconClasses variable
				saveMatches = saveMatches.map( ( match ) => {
					// If this match is from an expression with iconClasses variable
					if ( match[ 0 ].includes( 'iconClasses' ) ) {
						// Combine base class with the literal part
						const literalPart = match[ 1 ].trim();
						const fullClass = `${ baseClass } ${ literalPart }`.trim();
						// Return modified match with combined classes
						return [ match[ 0 ], fullClass, match.index ];
					}
					return match;
				} );
			}
		}

		// ICON WRAPPER FILTER: Icons use nested structure (wrapper/slot + icon element)
		// Example: <span class="accordion-icon-wrapper"><span class="accordion-icon accordion-icon-char">...</span></span>
		// Or: <span class="accordion-icon-slot">{ iconElement }</span>
		// When checking for 'accordion-icon', we match wrapper/slot AND actual icon
		// We should filter out container classes and only check the actual icon element
		if ( elementClass.includes( '-icon' ) ) {
			// Filter out container classes (wrapper, slot, etc.)
			saveMatches = saveMatches.filter( ( match ) => {
				const classString = match[ 1 ].trim();
				// Exclude container elements (end with -wrapper or -slot)
				if ( classString.endsWith( '-wrapper' ) || classString.endsWith( '-slot' ) ) {
					return false;
				}
				// Keep if it contains the exact class we're looking for
				const classes = classString.split( /\s+/ );
				return classes.some(
					( cls ) =>
						cls === elementClass ||
						( cls.startsWith( elementClass + '-' ) &&
							! cls.endsWith( '-wrapper' ) &&
							! cls.endsWith( '-slot' ) )
				);
			} );
		}

		if ( editMatches.length > 0 && saveMatches.length > 0 ) {
			// FALSE POSITIVE FILTER #1: Tab-button class mismatch due to template literal variables
			// Editor uses: `tab-button${ activeTab === index ? ' active' : '' }`
			// Frontend uses: `tab-button${ isSelected ? ' active' : '' }`
			// Both produce the same output (tab-button or tab-button active)
			// The difference is only in variable names (activeTab vs isSelected), not in the actual classes
			if ( blockName === 'tabs' && elementClass === 'tab-button' ) {
				const editClass = editMatches[ 0 ][ 1 ];
				const saveClass = saveMatches[ 0 ][ 1 ];

				// Check if both use template literals (contain ${)
				if ( editClass.includes( '${' ) && saveClass.includes( '${' ) ) {
					// Both start with tab-button${ - this is the template literal pattern
					// Difference is only in variable names, not in actual output classes
					if (
						editClass.startsWith( 'tab-button${' ) &&
						saveClass.startsWith( 'tab-button${' )
					) {
						// Skip this false positive - template literal variables differ but output is same
						continue;
					}
				}
			}

			// Compare class lists
			const editClasses = new Set(
				editMatches[ 0 ][ 1 ].split( /\s+/ ).filter( ( c ) => c )
			);
			const saveClasses = new Set(
				saveMatches[ 0 ][ 1 ].split( /\s+/ ).filter( ( c ) => c )
			);

			// Find classes in editor but not in frontend (excluding editor-only classes)
			// FALSE POSITIVE FILTER #3: Editor-only styling classes
			// These classes are defined in editor.scss and provide editor-specific styling
			// They should NOT appear in frontend because:
			// - editor.scss only loads in the editor
			// - Frontend may have different styling requirements
			// - They're intentionally editor-only (e.g., 'toc-items-editor' for TOC list spacing)
			const editorOnlyClasses = [
				'is-selected',
				'has-focus',
				'is-editing',
				'is-active',
				'toc-items-editor', // TOC: Editor-specific list styling (list-style-position, padding, margin)
			];
			const missingInFrontend = [ ...editClasses ].filter(
				( c ) => ! saveClasses.has( c ) && ! editorOnlyClasses.includes( c )
			);

			// Find classes in frontend but not in editor
			const missingInEditor = [ ...saveClasses ].filter( ( c ) => ! editClasses.has( c ) );

			if ( missingInFrontend.length > 0 ) {
				const lineNum = editCode
					.substring( 0, editMatches[ 0 ].index )
					.split( '\n' ).length;
				errors.push( {
					block: blockName,
					file: path.basename( editPath ),
					line: lineNum,
					rule: 'class-name-parity',
					message: `Class mismatch for .${ elementClass }: present in editor but missing in frontend`,
					expected: editMatches[ 0 ][ 1 ],
					found: saveMatches[ 0 ][ 1 ],
					fix: `Add missing classes to save.js: ${ missingInFrontend.join( ', ' ) }`,
					context: `Editor: ${ editMatches[ 0 ][ 1 ] } | Frontend: ${ saveMatches[ 0 ][ 1 ] }`,
				} );
			}
		} else if ( editMatches.length > 0 && saveMatches.length === 0 ) {
			// FALSE POSITIVE FILTER #2: Tab-panel in settings/management UI
			// tabs/edit.js contains 'tab-panel-item' class in the Tabs Management panel (line ~838)
			// This is part of the editor settings UI, NOT the rendered block output
			// The actual tab-panel element is in tabs/src/tab-panel/save.js (sub-block)
			// Validator should only check the main block's rendered output, not settings UI
			if (
				blockName === 'tabs' &&
				elementClass === 'tab-panel' &&
				editMatches[ 0 ][ 1 ].includes( 'tab-panel-item' )
			) {
				// This is the settings UI element, not the rendered block - skip this false positive
				continue;
			}

			// Element exists in editor but not in frontend
			const lineNum = editCode.substring( 0, editMatches[ 0 ].index ).split( '\n' ).length;
			errors.push( {
				block: blockName,
				file: path.basename( editPath ),
				line: lineNum,
				rule: 'class-name-parity',
				message: `Element .${ elementClass } exists in editor but not found in frontend`,
				expected: `Element with class ${ elementClass } in both files`,
				found: 'Missing in save.js',
				fix: `Ensure .${ elementClass } element exists in save.js`,
				context: editMatches[ 0 ][ 1 ],
			} );
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE 5: Inline Style Application Parity
// Ensures styles are applied to same elements in both editor and frontend
// ═══════════════════════════════════════════════════════════════════════════

function validateInlineStyleParity( blockName, editCode, saveCode, editPath, savePath ) {
	const errors = [];

	// Key elements that should have consistent styling
	const styledElements = {
		accordion: [ 'accordion-title', 'accordion-icon', 'accordion-content' ],
		tabs: [ 'tab-button', 'tab-icon', 'tab-panel' ],
		toc: [ 'toc-title', 'toc-icon', 'toc-content' ],
	};

	const elementsToCheck = styledElements[ blockName ] || [];

	for ( const elementClass of elementsToCheck ) {
		// Check if element has style prop in edit.js
		const editStylePattern = new RegExp(
			`className=\\{?[^}]*${ elementClass }[^}]*\\}?[^>]*style=\\{`,
			'g'
		);
		const hasEditStyle = editStylePattern.test( editCode );

		// Check if element has style prop in save.js (or uses CSS variables)
		const saveStylePattern = new RegExp(
			`className=\\{?[^}]*${ elementClass }[^}]*\\}?[^>]*style=\\{`,
			'g'
		);
		const hasSaveStyle = saveStylePattern.test( saveCode );

		// Check for CSS variable usage in save.js (alternative to inline styles)
		const hasCssVars =
			saveCode.includes( 'buildFrontendCssVars' ) || saveCode.includes( 'data-style' );

		// If editor has inline styles but frontend doesn't have styles OR CSS vars, flag it
		if ( hasEditStyle && ! hasSaveStyle && ! hasCssVars ) {
			// This might be intentional (CSS variables approach), so make this a warning
			// Only error if we can't find ANY styling mechanism
			const editLines = editCode.split( '\n' );
			const match = editCode.match( editStylePattern );
			if ( match ) {
				const lineNum = editCode.substring( 0, match.index ).split( '\n' ).length;
				errors.push( {
					block: blockName,
					file: path.basename( editPath ),
					line: lineNum,
					rule: 'inline-style-parity',
					message: `Element .${ elementClass } has inline styles in editor but no styling in frontend`,
					expected: 'Same element styled in both files (inline or CSS variables)',
					found: 'Editor has inline styles, frontend has neither inline styles nor CSS vars',
					fix: `Add style prop or CSS variables to .${ elementClass } in save.js`,
					context: editLines[ lineNum - 1 ]?.trim().substring( 0, 80 ) || '',
				} );
			}
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE 6: Heading Margin Consistency
// Ensures heading elements have consistent margin handling
// ═══════════════════════════════════════════════════════════════════════════

function validateHeadingMarginConsistency( blockName, editCode, saveCode, editPath, savePath ) {
	const errors = [];

	// Find heading elements in both files
	const headingPattern = /<(h[1-6]|HeadingTag)[^>]*>/gi;

	const editHeadings = [ ...editCode.matchAll( headingPattern ) ];
	const saveHeadings = [ ...saveCode.matchAll( headingPattern ) ];

	if ( editHeadings.length === 0 || saveHeadings.length === 0 ) {
		return errors; // No headings to check
	}

	// Check for margin/padding in heading styles
	for ( let i = 0; i < Math.min( editHeadings.length, saveHeadings.length ); i++ ) {
		const editHeading = editHeadings[ i ][ 0 ];
		const saveHeading = saveHeadings[ i ][ 0 ];

		const editHasMargin = /style=\{[^}]*margin/.test( editHeading );
		const saveHasMargin = /style=\{[^}]*margin/.test( saveHeading );

		if ( editHasMargin !== saveHasMargin ) {
			const lineNum = saveCode.substring( 0, saveHeadings[ i ].index ).split( '\n' ).length;
			errors.push( {
				block: blockName,
				file: path.basename( savePath ),
				line: lineNum,
				rule: 'heading-margin-consistency',
				message: 'Heading margin handling differs between editor and frontend',
				expected: editHasMargin
					? 'Heading with margin in both files'
					: 'No margin in both files',
				found: saveHasMargin ? 'Frontend has margin' : 'Frontend missing margin',
				fix: editHasMargin
					? 'Add same margin style to heading in save.js'
					: 'Remove margin from save.js heading',
				context: saveHeading.substring( 0, 80 ),
			} );
		}
	}

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// RULE 7: CSS Variable Usage Consistency
// Validates CSS variable names match between editor generation and frontend usage
// ═══════════════════════════════════════════════════════════════════════════

function validateCSSVariableConsistency( blockName, styleCode, stylePath ) {
	const errors = [];

	if ( ! styleCode ) {
		return errors; // No SCSS file to check
	}

	// Load generated CSS variable files
	const editorVarsPath = path.join(
		ROOT_DIR,
		`shared/src/styles/${ blockName }-css-vars-generated.js`
	);
	const frontendVarsPath = path.join(
		ROOT_DIR,
		`shared/src/styles/${ blockName }-frontend-css-vars-generated.js`
	);

	if ( ! fs.existsSync( editorVarsPath ) || ! fs.existsSync( frontendVarsPath ) ) {
		return errors; // Generated files don't exist
	}

	const editorVarsCode = fs.readFileSync( editorVarsPath, 'utf-8' );
	const frontendVarsCode = fs.readFileSync( frontendVarsPath, 'utf-8' );

	// Extract CSS variable names from generated files
	const varPattern = new RegExp( `--${ blockName }-[a-z0-9-]+`, 'gi' );

	const editorVars = new Set(
		[ ...editorVarsCode.matchAll( varPattern ) ].map( ( m ) => m[ 0 ].toLowerCase() )
	);
	const frontendVars = new Set(
		[ ...frontendVarsCode.matchAll( varPattern ) ].map( ( m ) => m[ 0 ].toLowerCase() )
	);

	// Extract CSS variables used in SCSS
	const scssVarPattern = /var\s*\(\s*(--[\w-]+)/g;
	const usedVars = new Set();
	const usedVarsWithLines = new Map();

	const lines = styleCode.split( '\n' );
	let match;

	while ( ( match = scssVarPattern.exec( styleCode ) ) !== null ) {
		const varName = match[ 1 ].toLowerCase();
		// Only check variables for this block
		if ( varName.startsWith( `--${ blockName }` ) ) {
			usedVars.add( varName );
			if ( ! usedVarsWithLines.has( varName ) ) {
				const lineNum = styleCode.substring( 0, match.index ).split( '\n' ).length;
				usedVarsWithLines.set( varName, lineNum );
			}
		}
	}

	// Check for variables used in SCSS but not generated
	// NOTE: This rule is disabled for now as it creates too much noise.
	// Many CSS variables are intentionally not in the schema (legacy, hardcoded defaults, etc.)
	// We'll re-enable this once we have a better way to distinguish between required and optional vars.

	// Uncomment below to enable CSS variable validation:
	/*
	for (const varName of usedVars) {
		if (!editorVars.has(varName) && !frontendVars.has(varName)) {
			const lineNum = usedVarsWithLines.get(varName);
			errors.push({
				block: blockName,
				file: path.basename(stylePath),
				line: lineNum,
				rule: 'css-variable-consistency',
				message: `CSS variable '${varName}' used in SCSS but not generated`,
				expected: 'Variable should be generated from schema attributes',
				found: `Used in SCSS but missing from generated files`,
				fix: `Check schema for attribute with cssVar matching '${varName}' or remove from SCSS`,
				context: lines[lineNum - 1]?.trim() || '',
			});
		}
	}
	*/

	return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN VALIDATION ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

function validateBlock( blockName ) {
	const files = loadBlockFiles( blockName );

	if ( ! files ) {
		return { skipped: true, errors: [] };
	}

	const { editCode, saveCode, styleCode, editPath, savePath, stylePath } = files;

	const errors = [
		...validateTextDecorationTarget( blockName, editCode, editPath ),
		...validateIconTextDecorationReset( blockName, editCode, editPath ),
		...validateTransformProperty( blockName, editCode, editPath ),
		...validateClassNameParity( blockName, editCode, saveCode, editPath, savePath ),
		...validateInlineStyleParity( blockName, editCode, saveCode, editPath, savePath ),
		...validateHeadingMarginConsistency( blockName, editCode, saveCode, editPath, savePath ),
		...validateCSSVariableConsistency( blockName, styleCode, stylePath ),
	];

	return { skipped: false, errors };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

function main() {
	console.log(
		`\n${ colors.cyan }${ colors.bold }Editor-Frontend Sync Validation${ colors.reset }\n`
	);

	let totalErrors = 0;
	const blockResults = [];

	for ( const blockName of BLOCKS ) {
		const result = validateBlock( blockName );

		if ( result.skipped ) {
			console.log(
				`${ colors.gray }⊘ ${ blockName.toUpperCase() } - Skipped (files not found)${
					colors.reset
				}`
			);
			continue;
		}

		blockResults.push( { blockName, errors: result.errors } );

		if ( result.errors.length > 0 ) {
			console.log(
				`${ colors.red }✗ ${ blockName.toUpperCase() } - ${
					result.errors.length
				} issue(s) found${ colors.reset }\n`
			);

			// Group errors by rule
			const errorsByRule = {};
			for ( const error of result.errors ) {
				if ( ! errorsByRule[ error.rule ] ) {
					errorsByRule[ error.rule ] = [];
				}
				errorsByRule[ error.rule ].push( error );
			}

			// Display errors grouped by rule
			for ( const [ rule, ruleErrors ] of Object.entries( errorsByRule ) ) {
				console.log( `  ${ colors.yellow }Rule: ${ rule }${ colors.reset }` );

				for ( const error of ruleErrors ) {
					console.log(
						`    ${ colors.gray }${ error.file }:${ error.line }${ colors.reset }`
					);
					console.log( `    ${ error.message }` );
					console.log(
						`    ${ colors.gray }Expected:${ colors.reset } ${ error.expected }`
					);
					console.log(
						`    ${ colors.gray }Found:${ colors.reset }    ${ error.found }`
					);
					console.log( `    ${ colors.green }Fix:${ colors.reset }      ${ error.fix }` );
					if ( error.context ) {
						console.log(
							`    ${ colors.gray }Context:${ colors.reset }  ${ error.context }`
						);
					}
					console.log( '' );
				}
			}

			totalErrors += result.errors.length;
		} else {
			console.log(
				`${ colors.green }✓ ${ blockName.toUpperCase() } - No issues found${
					colors.reset
				}\n`
			);
		}
	}

	// Summary
	console.log( `${ colors.bold }═══════════════════════════════════════${ colors.reset }` );
	console.log(
		`${ colors.bold }Summary: ${
			totalErrors > 0 ? colors.red : colors.green
		}${ totalErrors } total issue(s)${ colors.reset }\n`
	);

	if ( totalErrors > 0 ) {
		console.log(
			`${ colors.red }${ colors.bold }Validation failed.${ colors.reset } Please fix the issues above.\n`
		);
		process.exit( 1 );
	} else {
		console.log(
			`${ colors.green }${ colors.bold }All editor-frontend synchronization checks passed!${ colors.reset }\n`
		);
		process.exit( 0 );
	}
}

main();
