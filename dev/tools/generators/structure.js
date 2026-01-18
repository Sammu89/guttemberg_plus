/**
 * Structure JSX Generator - Block-Agnostic Architecture
 *
 * Auto-generates JSX code from structure mapping JSON templates.
 * Converts template directives (data-when, data-switch, data-slot, placeholders)
 * to React JSX with proper RichText/InnerBlocks handling.
 *
 * BLOCK-AGNOSTIC DESIGN:
 * This generator supports multiple block types through pattern detection:
 * - Accordion: titleWrapper + content + contentInner pattern
 * - Tabs: wrapper + tabsList + tabsPanels pattern
 * - TOC: wrapper + (titleStatic|titleButton) + content + list pattern
 *
 * ARCHITECTURE:
 * 1. detectBlockPattern() - Analyzes structure elements to determine block type
 * 2. generateRenderTitle() - Dispatches to pattern-specific title generators
 * 3. generateBlockContent() - Dispatches to pattern-specific content generators
 *
 * ADDING NEW BLOCK PATTERNS:
 * To add a new block type (e.g., "carousel"):
 * 1. Create structure mapping JSON with unique element IDs
 * 2. Add detection logic in detectBlockPattern()
 * 3. Implement generateCarouselRenderTitle() if needed
 * 4. Implement generateCarouselBlockContent()
 * 5. Add cases in generateRenderTitle() and generateBlockContent()
 *
 * Generated functions:
 * - generateStructureJsx(structureMapping, mode) - Main entry point
 * - generateRenderTitle(structureMapping, mode) - Generate title rendering
 * - generateBlockContent(structureMapping, mode) - Generate block structure
 * - Modes: 'save' (RichText.Content, InnerBlocks.Content) or 'edit' (RichText, InnerBlocks)
 *
 * Convention-based detection:
 * - Elements ending in "Text" → RichText components
 * - Elements ending in "Slot" (except iconSlot) → InnerBlocks components
 * - iconSlot → Contains icon markup
 * - Icon elements → Shared icon rendering utility
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Get auto-generated file header
 * NOTE: Does NOT include START/END markers - those are added by schema-compiler.js
 */
function getGeneratedHeader(schemaFile, blockName) {
  return `// AUTO-GENERATED from schemas/${schemaFile}
// To modify, update the schema and run: npm run schema:build

`;
}

/**
 * Get auto-generated file footer
 * NOTE: Does NOT include END marker - that is added by schema-compiler.js
 */
function getGeneratedFooter() {
  return ``; // Empty - markers are handled by schema-compiler.js
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate renderTitle function - dispatches to pattern-specific generator
 * This is the main entry point for generating title rendering code
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated render function code
 */
function generateRenderTitle(structureMapping, mode) {
  const blockPattern = detectBlockPattern(structureMapping);

  switch (blockPattern) {
    case 'accordion':
      return generateAccordionRenderTitle(structureMapping, mode);

    case 'tabs':
      return generateTabsRenderTitle(structureMapping, mode);

    case 'toc':
      return generateTocRenderTitle(structureMapping, mode);

    default:
      // For unknown patterns, return empty string (no render title needed)
      return '';
  }
}

/**
 * Generate renderTitle function for accordion block
 * This follows the exact pattern from the existing save.js and edit.js files
 */
function generateAccordionRenderTitle(structureMapping, mode) {
  const blockType = structureMapping.blockType;

  let code = `/**
 * Render title with optional heading wrapper
 */
const renderTitle = () => {
  const headingLevel = effectiveValues.headingLevel || 'none';
  const iconPosition = effectiveValues.iconPosition || 'right';
  const titleAlignment = effectiveValues.titleAlignment || 'left';
  const titleAlignClass = titleAlignment
    ? \`title-align-\${ titleAlignment }\`
    : 'title-align-left';

`;

  if (mode === 'save') {
    code += `  // ARIA attributes for button
  const buttonAria = getAccordionButtonAria( accordionId, attributes.initiallyOpen || false );

`;
  }

  code += `  const iconElement = renderIcon();
  const hasIcon = !! iconElement;

  // Build button content - icon position affects layout structure
  let buttonChildren;

  if ( iconPosition === 'box-left' ) {
    // Extreme left: icon at far left, text with flex grows to fill
    buttonChildren = (
      <>
        { hasIcon && <span className="accordion-icon-slot">{ iconElement }</span> }
        <div className="accordion-title-text-wrapper">
`;

  if (mode === 'save') {
    code += `          <RichText.Content
            tagName="span"
            value={ attributes.title || '' }
            className="accordion-title-text"
            style={ titleTextInlineStyles }
          />
`;
  } else {
    code += `          <RichText
            tagName="span"
            value={ attributes.title || '' }
            onChange={ (value) => setAttributes({ title: value }) }
            placeholder={ __('Accordion title…', 'guttemberg-plus') }
            className="accordion-title-text"
            style={ {
              ...titleTextInlineStyles,
              ...titleFormattingStyles,
            } }
          />
`;
  }

  code += `        </div>
      </>
    );
  } else if ( iconPosition === 'box-right' ) {
    // Extreme right: text with flex grows, icon at far right
    buttonChildren = (
      <>
        <div className="accordion-title-text-wrapper">
`;

  if (mode === 'save') {
    code += `          <RichText.Content
            tagName="span"
            value={ attributes.title || '' }
            className="accordion-title-text"
            style={ titleTextInlineStyles }
          />
`;
  } else {
    code += `          <RichText
            tagName="span"
            value={ attributes.title || '' }
            onChange={ (value) => setAttributes({ title: value }) }
            placeholder={ __('Accordion title…', 'guttemberg-plus') }
            className="accordion-title-text"
            style={ {
              ...titleTextInlineStyles,
              ...titleFormattingStyles,
            } }
          />
`;
  }

  code += `        </div>
        { hasIcon && <span className="accordion-icon-slot">{ iconElement }</span> }
      </>
    );
  } else if ( iconPosition === 'left' ) {
    // Left of text: wrap icon+text as single group that can be aligned
    buttonChildren = (
      <div className="accordion-title-inline">
        { hasIcon && iconElement }
`;

  if (mode === 'save') {
    code += `        <RichText.Content
          tagName="span"
          value={ attributes.title || '' }
          className="accordion-title-text"
          style={ titleTextInlineStyles }
        />
`;
  } else {
    code += `        <RichText
          tagName="span"
          value={ attributes.title || '' }
          onChange={ (value) => setAttributes({ title: value }) }
          placeholder={ __('Accordion title…', 'guttemberg-plus') }
          className="accordion-title-text"
          style={ {
            ...titleTextInlineStyles,
            ...titleFormattingStyles,
          } }
        />
`;
  }

  code += `      </div>
    );
  } else {
    // Right of text (default): wrap text+icon as single group that can be aligned
    buttonChildren = (
      <div className="accordion-title-inline">
`;

  if (mode === 'save') {
    code += `        <RichText.Content
          tagName="span"
          value={ attributes.title || '' }
          className="accordion-title-text"
          style={ titleTextInlineStyles }
        />
`;
  } else {
    code += `        <RichText
          tagName="span"
          value={ attributes.title || '' }
          onChange={ (value) => setAttributes({ title: value }) }
          placeholder={ __('Accordion title…', 'guttemberg-plus') }
          className="accordion-title-text"
          style={ {
            ...titleTextInlineStyles,
            ...titleFormattingStyles,
          } }
        />
`;
  }

  code += `        { hasIcon && iconElement }
      </div>
    );
  }

  const buttonContent = (
    <button
      type="button"
      className={ \`accordion-title \${
        iconPosition ? \`icon-\${ iconPosition }\` : ''
      } \${ titleAlignClass }\` }
`;

  if (mode === 'save') {
    code += `      { ...buttonAria }
`;
  }

  code += `    >
      { buttonChildren }
    </button>
  );

  if ( headingLevel !== 'none' ) {
    const HeadingTag = headingLevel;
    return <HeadingTag className="accordion-heading">{ buttonContent }</HeadingTag>;
  }

  return buttonContent;
};`;

  return code;
}

/**
 * Generate renderTabButtons function for tabs block
 * Renders tab buttons with optional heading wrappers
 */
function generateTabsRenderTitle(structureMapping, mode) {
  let code = `/**
 * Render tab buttons server-side for SEO and accessibility
 * Supports headingLevel wrapping like accordion
 */
const renderTabButtons = () => {
  const tabsData = attributes.tabsData || [];
  const headingLevel = attributes.headingLevel || 'none';
  const iconPosition = effectiveValues.iconPosition || 'right';
  const currentTab = attributes.currentTab || 0;

  // If no tabsData, return null (frontend.js will generate as fallback)
  if ( tabsData.length === 0 ) {
    return null;
  }

  return tabsData
    .filter( ( tab ) => ! tab.isDisabled ) // Skip disabled tabs on frontend
    .map( ( tab, index ) => {
      const isSelected = index === currentTab;
      const tabId = tab.tabId || \`tab-\${ index }\`;

      // Build button content with icon based on position
      const buttonContent = (
        <button
          type="button"
          className={ \`tab-button\${ isSelected ? ' active' : '' }\` }
          role="tab"
          id={ \`tab-\${ tabId }\` }
          aria-controls={ \`panel-\${ tabId }\` }
          aria-selected={ isSelected ? 'true' : 'false' }
          tabIndex={ isSelected ? 0 : -1 }
        >
          { iconPosition === 'left' && renderIcon( isSelected ) }
          <span className="tab-title tab-button-text">
            { tab.title || \`Tab \${ index + 1 }\` }
          </span>
          { iconPosition === 'right' && renderIcon( isSelected ) }
        </button>
      );

      // Wrap in heading if headingLevel is set
      if ( headingLevel !== 'none' ) {
        const HeadingTag = headingLevel;
        return (
          <HeadingTag key={ tabId } className="tab-heading">
            { buttonContent }
          </HeadingTag>
        );
      }

      // Return button with key for React
      return <span key={ tabId }>{ buttonContent }</span>;
    } );
};`;

  return code;
}

/**
 * Generate renderHeader function for toc block
 * Renders header with optional button or static title
 */
function generateTocRenderTitle(structureMapping, mode) {
  let code = `/**
 * Render header with accordion-like structure
 */
const renderHeader = () => {
  if ( ! showTitle && ! isCollapsible ) {
    return null;
  }

  const iconElement = renderIcon();
  const hasIcon = !! iconElement;
  const currentIconPosition = iconPosition || 'right';
  const titleAlignment = effectiveValues.titleAlignment || 'left';
  const titleAlignClass = titleAlignment
    ? \`title-align-\${ titleAlignment }\`
    : 'title-align-left';

  // Build header content based on icon position
  let buttonChildren;

  if ( currentIconPosition === 'box-left' ) {
    // Extreme left: icon at far left, text with flex grows to fill
    buttonChildren = (
      <>
        { hasIcon && <span className="toc-icon-slot">{ iconElement }</span> }
        <div className="toc-title-text-wrapper">
          <span className="toc-title-text">{ titleText }</span>
        </div>
      </>
    );
  } else if ( currentIconPosition === 'box-right' ) {
    // Extreme right: text with flex grows, icon at far right
    buttonChildren = (
      <>
        <div className="toc-title-text-wrapper">
          <span className="toc-title-text">{ titleText }</span>
        </div>
        { hasIcon && <span className="toc-icon-slot">{ iconElement }</span> }
      </>
    );
  } else if ( currentIconPosition === 'left' ) {
    // Left of text: wrap icon+text as single group that can be aligned
    buttonChildren = (
      <div className="toc-title-inline">
        { hasIcon && iconElement }
        <span className="toc-title-text">{ titleText }</span>
      </div>
    );
  } else {
    // Right of text (default): wrap text+icon as single group that can be aligned
    buttonChildren = (
      <div className="toc-title-inline">
        <span className="toc-title-text">{ titleText }</span>
        { hasIcon && iconElement }
      </div>
    );
  }

  // If collapsible, render as button
  if ( isCollapsible ) {
    return (
      <button
        id={ buttonId }
        className={ \`toc-title toc-toggle-button \${
          currentIconPosition ? \`icon-\${ currentIconPosition }\` : ''
        } \${ titleAlignClass }\` }
        aria-expanded={ ! initiallyCollapsed }
        aria-controls={ contentId }
        type="button"
      >
        { buttonChildren }
      </button>
    );
  }

  // If not collapsible but showTitle is true, render as static title
  if ( showTitle ) {
    return (
      <div className={ \`toc-title \${ titleAlignClass }\` }>
        <span className="toc-title-text">{ titleText }</span>
      </div>
    );
  }

  return null;
};`;

  return code;
}

/**
 * Detect block type/pattern from structure mapping
 * @param {Object} structureMapping - Structure mapping JSON
 * @returns {string} Detected block type (accordion, tabs, toc)
 */
function detectBlockPattern(structureMapping) {
  const elements = structureMapping.structure.elements;
  const elementIds = Object.keys(elements);

  // Check for tabs pattern: wrapper, tabsList, tabsPanels
  if (elementIds.includes('tabsList') && elementIds.includes('tabsPanels')) {
    return 'tabs';
  }

  // Check for toc pattern: wrapper, titleStatic/titleButton, content, list
  if (elementIds.includes('list') &&
      (elementIds.includes('titleStatic') || elementIds.includes('titleButton'))) {
    return 'toc';
  }

  // Check for accordion pattern: titleWrapper, content, contentInner
  if (elementIds.includes('titleWrapper') &&
      elementIds.includes('content') &&
      elementIds.includes('contentInner')) {
    return 'accordion';
  }

  // Default to blockType from mapping
  return structureMapping.blockType;
}

/**
 * Generate block content for accordion pattern
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated accordion block content JSX code
 */
function generateAccordionBlockContent(structureMapping, mode) {
  const titleWrapperEl = structureMapping.structure.elements.titleWrapper;
  const contentEl = structureMapping.structure.elements.content;
  const contentInnerEl = structureMapping.structure.elements.contentInner;

  let code = '';

  if (mode === 'save') {
    code += `
	// ARIA attributes for panel
	const panelAria = getAccordionPanelAria( accordionId );

	// Build class names - accordion-item is now the root element
	const classNames = [ 'gutplus-accordion' ];

	// Add open state class
	if ( attributes.initiallyOpen ) {
		classNames.push( 'is-open' );
	}

	// Add theme class if using a theme
	if ( attributes.currentTheme ) {
		// Sanitize theme ID for CSS class (alphanumeric and hyphens only)
		const safeThemeId = attributes.currentTheme.replace( /[^a-zA-Z0-9\\-]/g, '' );
		classNames.push( \`gutplus-accordion-theme-\${ safeThemeId }\` );
	}

	// Add alignment class
	const alignmentClass = getAlignmentClass( attributes.accordionHorizontalAlign );
	classNames.push( alignmentClass );

	const hasInlineStyles = Object.keys( inlineStyles ).length > 0;

	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-accordion-id': accordionId,
		'data-animation-type': attributes.animationType || 'slide',
		'data-gutplus-device': 'global',
		// Add id attribute for CSS selector targeting (Tier 3 customizations)
		...( accordionId && hasCustomizations && { id: accordionId } ),
		// Apply inline styles (CSS variables + manual overrides)
		...( hasInlineStyles && { style: inlineStyles } ),
	} );

	return (
		<>
			<div { ...blockProps }>
				<div className="${titleWrapperEl.classes[0]}">{ renderTitle() }</div>

				<div
					className="${contentEl.classes[0]}"
					{ ...panelAria }
					{ ...( ! attributes.initiallyOpen && { hidden: true } ) }
				>
					<div className="${contentInnerEl.classes[0]}">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</>
	);`;
  } else {
    code += `
	const blockContentJSX = (
		<div { ...blockProps }>
			<div className="${titleWrapperEl.classes[0]}">{ renderTitle() }</div>

			<div className="${contentEl.classes[0]}" style={ { ...styles.content } }>
				<div className="${contentInnerEl.classes[0]}">
					<InnerBlocks
						templateLock={ false }
						placeholder={ __(
							'Add accordion content…',
							'guttemberg-plus'
						) }
					/>
				</div>
			</div>
		</div>
	);`;
  }

  return code;
}

/**
 * Generate block content for tabs pattern
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated tabs block content JSX code
 */
function generateTabsBlockContent(structureMapping, mode) {
  const wrapperEl = structureMapping.structure.elements.wrapper;
  const tabsListEl = structureMapping.structure.elements.tabsList;
  const tabsPanelsEl = structureMapping.structure.elements.tabsPanels;

  let code = '';

  if (mode === 'save') {
    code += `
	// Build class names - add theme class if using a theme
	const classNames = [ 'gutplus-tabs' ];
	if ( attributes.currentTheme ) {
		// Sanitize theme ID for CSS class (alphanumeric and hyphens only)
		const safeThemeId = attributes.currentTheme.replace( /[^a-zA-Z0-9\\-]/g, '' );
		classNames.push( \`gutplus-tabs-theme-\${ safeThemeId }\` );
	}
	if ( attributes.enableResponsiveFallback ) {
		classNames.push( 'responsive-accordion' );
	}

	// Add alignment class
	const alignmentClass = getAlignmentClass( attributes.tabsHorizontalAlign );
	classNames.push( alignmentClass );

	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-orientation': attributes.orientation || 'horizontal',
		'data-activation-mode': attributes.activationMode || 'click',
		'data-breakpoint': attributes.responsiveBreakpoint || 768,
		'data-responsive-fallback': attributes.enableResponsiveFallback || true,
		'data-icon-position': attributes.iconPosition || 'right',
		'data-heading-level': attributes.headingLevel || 'none',
		'data-stretch-buttons': attributes.stretchButtonsToRow || false,
		'data-hide-inactive-edge': 'true',
		'data-gutplus-device': 'global',
		// Apply inline CSS variables
		...( hasInlineStyles && { style: inlineStyles } ),
	} );

	// Only add scroll wrapper for horizontal orientation
	const isHorizontal = ! attributes.orientation || attributes.orientation === 'horizontal';

	return (
		<div { ...blockProps }>
			{ /* Tab List - Tab Buttons (server-rendered for SEO) */ }
			{ isHorizontal ? (
				<div className="tabs-list-wrapper">
					<button
						className="tabs-scroll-button scroll-left"
						aria-label="Scroll left"
						type="button"
					>
						◀
					</button>
					<div
						className="${tabsListEl.classes[0]}"
						role="tablist"
						aria-orientation={ getAriaOrientation( attributes.orientation ) }
						data-current-tab={ attributes.currentTab || 0 }
					>
						{ renderTabButtons() }
					</div>
					<button
						className="tabs-scroll-button scroll-right"
						aria-label="Scroll right"
						type="button"
					>
						▶
					</button>
				</div>
			) : (
				<div
					className="${tabsListEl.classes[0]}"
					role="tablist"
					aria-orientation={ getAriaOrientation( attributes.orientation ) }
					data-current-tab={ attributes.currentTab || 0 }
				>
					{ renderTabButtons() }
				</div>
			) }

			{ /* Tab Panels */ }
			<div className="${tabsPanelsEl.classes[0]}">
				<InnerBlocks.Content />
			</div>
		</div>
	);`;
  } else {
    code += `
	const blockContentJSX = (
		<div { ...blockProps }>
			<div className="${tabsListEl.classes[0]}" role="tablist">
				{ renderTabButtons() }
			</div>

			<div className="${tabsPanelsEl.classes[0]}">
				<InnerBlocks
					allowedBlocks={ [ 'gutplus/tab-panel' ] }
					templateLock={ false }
					placeholder={ __(
						'Add tab panels…',
						'guttemberg-plus'
					) }
				/>
			</div>
		</div>
	);`;
  }

  return code;
}

/**
 * Generate block content for toc pattern
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated toc block content JSX code
 */
function generateTocBlockContent(structureMapping, mode) {
  const wrapperEl = structureMapping.structure.elements.wrapper;
  const contentEl = structureMapping.structure.elements.content;
  const listEl = structureMapping.structure.elements.list;

  let code = '';

  if (mode === 'save') {
    code += `
	// Build class names - add theme class if using a theme
	const classNames = [ 'gutplus-toc', \`toc-position-\${ positionType }\` ];

	// Track heading toggle state for validation and CSS targeting
	const headingToggleAny =
		includeH1 || includeH2 || includeH3 || includeH4 || includeH5 || includeH6;
	if ( ! headingToggleAny ) {
		classNames.push( 'toc-no-headings-selected' );
	}
	if ( includeH6 === false ) {
		classNames.push( 'toc-excludes-h6' );
	}

	// Link color mode (unified vs per-level)
	if ( unifiedLinkColors === false ) {
		classNames.push( 'toc-link-colors-per-level' );
	} else {
		classNames.push( 'toc-link-colors-unified' );
	}

	// Add open state class
	if ( ! initiallyCollapsed ) {
		classNames.push( 'is-open' );
	}

	if ( attributes.currentTheme ) {
		// Sanitize theme ID for CSS class (alphanumeric and hyphens only)
		const safeThemeId = attributes.currentTheme.replace( /[^a-zA-Z0-9\\-]/g, '' );
		classNames.push( \`gutplus-toc-theme-\${ safeThemeId }\` );
	}

	// Add icon position class
	if ( iconPosition ) {
		classNames.push( \`icon-\${ iconPosition }\` );
	}

	// Add alignment class using centralized utility
	const alignmentClass = getAlignmentClass( attributes.tocHorizontalAlign );
	classNames.push( alignmentClass );

	const blockProps = useBlockProps.save( {
		className: classNames.join( ' ' ),
		'data-gutplus-device': 'global',
		// Only add inline styles if there are customizations or fixed positioning
		...( Object.keys( inlineStyles ).length > 0 && { style: inlineStyles } ),
		...dataAttributes,
	} );

	// Collapse button ID
	const buttonId = \`toc-toggle-\${ tocId }\`;
	const contentId = \`toc-content-\${ tocId }\`;

	return (
		<div { ...blockProps }>
			{ /* Header Section (accordion-like) */ }
			<div className="toc-header-wrapper">{ renderHeader() }</div>

			{ /* Content Section */ }
			<nav
				id={ contentId }
				className="${contentEl.classes[0]}"
				aria-label={ titleText || 'Table of Contents' }
				{ ...( isCollapsible && initiallyCollapsed && { hidden: true } ) }
			>
				<ul
					className="${listEl.classes[0]} toc-hierarchical-numbering"
					style={ {
						margin: 0,
					} }
					{ ...numberingDataAttributes }
				>
					<li className="toc-placeholder">Loading table of contents...</li>
				</ul>
			</nav>
		</div>
	);`;
  } else {
    code += `
	const blockContentJSX = (
		<div { ...blockProps }>
			<div className="toc-header-wrapper">{ renderHeader() }</div>

			<nav className="${contentEl.classes[0]}">
				<ul className="${listEl.classes[0]} toc-hierarchical-numbering">
					<li className="toc-placeholder">Loading table of contents...</li>
				</ul>
			</nav>
		</div>
	);`;
  }

  return code;
}

/**
 * Generate block content JSX (the part inside blockProps div)
 * This is the main entry point that delegates to pattern-specific generators
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated block content JSX code
 */
function generateBlockContent(structureMapping, mode) {
  const blockPattern = detectBlockPattern(structureMapping);

  // Validate that required elements exist
  const elements = structureMapping.structure.elements;
  if (!elements || Object.keys(elements).length === 0) {
    throw new Error('No elements found in structure mapping');
  }

  // Delegate to pattern-specific generator
  switch (blockPattern) {
    case 'accordion':
      return generateAccordionBlockContent(structureMapping, mode);

    case 'tabs':
      return generateTabsBlockContent(structureMapping, mode);

    case 'toc':
      return generateTocBlockContent(structureMapping, mode);

    default:
      throw new Error(`Unsupported block pattern: ${blockPattern}`);
  }
}

/**
 * Main generator function
 * @param {Object} structureMapping - Structure mapping JSON
 * @param {string} mode - 'save' or 'edit'
 * @returns {string} Generated renderTitle function code with header and footer
 */
function generateStructureJsx(structureMapping, mode) {
  const blockType = structureMapping.blockType;
  const schemaFile = `${blockType}-structure-mapping-autogenerated.json`;
  const blockName = capitalize(blockType);

  const header = getGeneratedHeader(schemaFile, blockName);
  const renderTitleCode = generateRenderTitle(structureMapping, mode);
  const footer = getGeneratedFooter();

  return header + renderTitleCode + '\n' + footer;
}

/**
 * Validate structure mapping has required elements for detected pattern
 * @param {Object} structureMapping - Structure mapping JSON
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
function validateStructureMapping(structureMapping) {
  const errors = [];
  const blockPattern = detectBlockPattern(structureMapping);
  const elements = structureMapping.structure.elements;

  if (!elements || Object.keys(elements).length === 0) {
    errors.push('No elements found in structure mapping');
    return { valid: false, errors, blockPattern };
  }

  // Pattern-specific validation
  switch (blockPattern) {
    case 'accordion':
      if (!elements.titleWrapper) errors.push('Accordion pattern requires titleWrapper element');
      if (!elements.content) errors.push('Accordion pattern requires content element');
      if (!elements.contentInner) errors.push('Accordion pattern requires contentInner element');
      break;

    case 'tabs':
      if (!elements.wrapper) errors.push('Tabs pattern requires wrapper element');
      if (!elements.tabsList) errors.push('Tabs pattern requires tabsList element');
      if (!elements.tabsPanels) errors.push('Tabs pattern requires tabsPanels element');
      break;

    case 'toc':
      if (!elements.wrapper) errors.push('TOC pattern requires wrapper element');
      if (!elements.content) errors.push('TOC pattern requires content element');
      if (!elements.list) errors.push('TOC pattern requires list element');
      if (!elements.titleStatic && !elements.titleButton) {
        errors.push('TOC pattern requires either titleStatic or titleButton element');
      }
      break;

    default:
      errors.push(`Unknown block pattern: ${blockPattern}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    blockPattern
  };
}

/**
 * Get supported block patterns
 * @returns {Array<string>} List of supported block patterns
 */
function getSupportedPatterns() {
  return ['accordion', 'tabs', 'toc'];
}

module.exports = {
  generateStructureJsx,
  generateRenderTitle,
  generateBlockContent,
  detectBlockPattern,
  validateStructureMapping,
  getSupportedPatterns,
};
