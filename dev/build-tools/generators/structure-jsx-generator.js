/**
 * Structure JSX Generator
 *
 * Auto-generates JSX code from structure mapping JSON templates.
 * Converts template directives (data-when, data-switch, data-slot, placeholders)
 * to React JSX with proper RichText/InnerBlocks handling.
 *
 * Generated functions:
 * - generateStructureJsx(structureMapping, mode) - Converts structure to JSX
 * - Returns: renderTitle function code as string
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
 */
function getGeneratedHeader(schemaFile, blockName) {
  return `/* ========== AUTO-GENERATED-RENDER-TITLE-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// AUTO-GENERATED from schemas/${schemaFile}
// To modify, update the schema and run: npm run schema:build

`;
}

/**
 * Get auto-generated file footer
 */
function getGeneratedFooter() {
  return `/* ========== AUTO-GENERATED-RENDER-TITLE-END ========== */`;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate renderTitle function for accordion block
 * This follows the exact pattern from the existing save.js and edit.js files
 */
function generateRenderTitle(structureMapping, mode) {
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

module.exports = {
  generateStructureJsx,
  generateRenderTitle,
};
