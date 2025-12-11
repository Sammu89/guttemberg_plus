/**
 * Edit.js Inline Styles Injector Generator
 *
 * Auto-generates the getInlineStyles() function code for edit.js files.
 * This generator creates inline style objects for editor preview from schema definitions.
 *
 * Generated code structure:
 * - Groups styles by CSS selector (container, header/title, content, icon)
 * - Applies proper formatting (units, object handling)
 * - Includes conditional checks for undefined values
 * - Handles complex types (borderRadius, padding, border shorthand)
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * Get proper selector key name for style object
 * Maps CSS selector to object property name in getInlineStyles() return value
 *
 * @param {string} selector - CSS selector from schema
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {string} Style object key
 */
function getSelectorKey(selector, blockType) {
  // Map common selectors to readable keys
  const mappings = {
    [`.wp-block-guttemberg-plus-${blockType}`]: 'container',
    [`.${blockType}-header`]: 'title', // accordion uses 'title' not 'header'
    [`.${blockType}-content`]: 'content',
    [`.${blockType}-icon`]: 'icon',
    'accordion-header': 'title',
    'accordion-content': 'content',
    'accordion-icon': 'icon',
    'tabs-header': 'header',
    'tabs-content': 'content',
    'toc-header': 'header',
    'toc-content': 'content',
    // Tab-specific selectors
    '.tab-button': 'tabButton',
    '.tab-panel': 'tabPanel',
    '.tabs-list': 'tabsList',
    '.tab-icon': 'tabIcon',
    // TOC-specific selectors
    '.toc-link': 'tocLink',
    '.toc-title': 'tocTitle',
    '.toc-list': 'tocList',
  };

  // Check for direct mapping
  if (mappings[selector]) {
    return mappings[selector];
  }

  // Check if selector contains a known pattern
  if (selector.includes('-header')) return blockType === 'accordion' ? 'title' : 'header';
  if (selector.includes('-content')) return 'content';
  if (selector.includes('-icon')) return 'icon';
  if (selector.includes('-button')) return 'button';
  if (selector.includes('-panel')) return 'panel';
  if (selector.includes('-list')) return 'list';
  if (selector.includes('-link')) return 'link';
  if (selector.includes(`-${blockType}`)) return 'container';

  // Default fallback - log warning
  console.warn(`[edit-styles-injector] Unmapped selector "${selector}" for ${blockType} block, defaulting to 'container'`);
  return 'container';
}

/**
 * Convert CSS property name to camelCase for JavaScript
 * @param {string} cssProperty - CSS property name (e.g., 'border-color')
 * @returns {string} camelCase property name (e.g., 'borderColor')
 */
function toCamelCase(cssProperty) {
  return cssProperty.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get default value for fallback
 * @param {*} defaultValue - Default value from schema
 * @param {string} type - Attribute type
 * @returns {string} Formatted default for JavaScript
 */
function formatDefault(defaultValue, type) {
  if (defaultValue === null || defaultValue === undefined) {
    return 'undefined';
  }

  if (type === 'string') {
    return `'${defaultValue}'`;
  }

  if (type === 'number') {
    return String(defaultValue);
  }

  if (type === 'boolean') {
    return defaultValue ? 'true' : 'false';
  }

  if (type === 'object') {
    return JSON.stringify(defaultValue);
  }

  return `'${defaultValue}'`;
}

/**
 * Generate CSS property assignment code
 * @param {string} attrName - Attribute name
 * @param {Object} attr - Attribute definition from schema
 * @param {string} selectorKey - Style object key (container, title, etc.)
 * @returns {string} JavaScript code for property assignment
 */
function generatePropertyAssignment(attrName, attr, selectorKey) {
  const cssProp = toCamelCase(attr.cssProperty);
  const defaultVal = formatDefault(attr.default, attr.type);

  // Handle numeric types with units
  if (attr.type === 'number') {
    const unit = attr.unit || '';
    return `    if (effectiveValues.${attrName} !== undefined && effectiveValues.${attrName} !== null) {
      ${selectorKey}.${cssProp} = \`\${effectiveValues.${attrName}}${unit}\`;
    }`;
  }

  // Handle object types (borderRadius, padding)
  if (attr.type === 'object') {
    if (attrName.toLowerCase().includes('radius')) {
      return `    if (effectiveValues.${attrName}) {
      const br = effectiveValues.${attrName};
      ${selectorKey}.${cssProp} = \`\${br.topLeft || 0}px \${br.topRight || 0}px \${br.bottomRight || 0}px \${br.bottomLeft || 0}px\`;
    }`;
    }

    if (attrName.toLowerCase().includes('padding')) {
      return `    if (effectiveValues.${attrName}) {
      const p = effectiveValues.${attrName};
      ${selectorKey}.${cssProp} = \`\${p.top || 0}px \${p.right || 0}px \${p.bottom || 0}px \${p.left || 0}px\`;
    }`;
    }

    // Other object types - skip or handle manually
    return `    // Complex object: ${attrName} - handle manually if needed`;
  }

  // Handle boolean types (for display, visibility, etc.)
  if (attr.type === 'boolean') {
    // Special case for showIcon-like attributes
    if (attrName.toLowerCase().includes('show')) {
      return `    if (effectiveValues.${attrName} !== undefined) {
      ${selectorKey}.display = effectiveValues.${attrName} ? 'flex' : 'none';
    }`;
    }

    return `    if (effectiveValues.${attrName} !== undefined) {
      ${selectorKey}.${cssProp} = effectiveValues.${attrName} ? '...' : '...'; // TODO: Define boolean CSS values
    }`;
  }

  // Handle string types (colors, text values, etc.)
  return `    if (effectiveValues.${attrName} !== undefined && effectiveValues.${attrName} !== null) {
      ${selectorKey}.${cssProp} = effectiveValues.${attrName};
    }`;
}

/**
 * Check if attribute is a state-specific attribute
 * State-specific attributes (hover, active, focus, disabled) should be
 * excluded from editor inline styles since editor preview doesn't need state awareness
 * @param {string} attrName - Attribute name
 * @returns {boolean} True if attribute is state-specific
 */
function isStateAttribute(attrName) {
  // Check for state patterns in attribute names
  const statePatterns = [
    /Hover/i,     // e.g., tabButtonHoverColor, shadowHover
    /Active/i,    // e.g., tabButtonActiveColor, linkActiveColor
    /Focus/i,     // e.g., focusBorderColor, focusBorderColorActive
    /Disabled/i,  // e.g., isDisabled (though this is structural)
  ];

  return statePatterns.some(pattern => pattern.test(attrName));
}

/**
 * Group attributes by CSS selector
 * @param {Object} schema - Block schema
 * @returns {Object} Attributes grouped by selector
 */
function groupAttributesBySelector(schema) {
  const groups = {};

  Object.entries(schema.attributes).forEach(([attrName, attr]) => {
    // Only include themeable attributes with cssProperty
    if (!attr.themeable || !attr.cssProperty) return;

    // EXCLUDE state-specific attributes from editor inline styles
    // Editor preview only needs BASE state styling
    if (isStateAttribute(attrName)) {
      return;
    }

    const selector = attr.cssSelector || 'default';
    if (!groups[selector]) {
      groups[selector] = [];
    }

    groups[selector].push({ attrName, attr });
  });

  return groups;
}

/**
 * Handle special border shorthand properties
 * Border needs width + style + color combined
 * @param {Object} selectorGroup - Attributes for a selector
 * @param {string} blockType - Block type
 * @returns {Object} Special groups and remaining attributes
 */
function extractBorderGroups(selectorGroup, blockType) {
  const borderGroups = {};
  const remaining = [];

  selectorGroup.forEach(({ attrName, attr }) => {
    // Check for border-related properties
    const isBorderWidth = attrName.includes('Width') || attrName.includes('Thickness');
    const isBorderStyle = attrName.includes('Style');
    const isBorderColor = attrName.includes('Color');

    // Determine border group name (accordion border, divider border, etc.)
    let borderGroupName = null;
    if (attrName.startsWith('border')) {
      borderGroupName = 'border';
    } else if (attrName.startsWith('divider')) {
      borderGroupName = 'divider';
    } else if (attrName.includes('Border')) {
      // Extract prefix (e.g., 'accordion' from 'accordionBorderWidth')
      const match = attrName.match(/^(\w+?)Border/);
      if (match) {
        borderGroupName = match[1] + 'Border';
      }
    }

    if (borderGroupName && (isBorderWidth || isBorderStyle || isBorderColor)) {
      if (!borderGroups[borderGroupName]) {
        borderGroups[borderGroupName] = { width: null, style: null, color: null };
      }

      if (isBorderWidth) {
        borderGroups[borderGroupName].width = { attrName, attr };
      } else if (isBorderStyle) {
        borderGroups[borderGroupName].style = { attrName, attr };
      } else if (isBorderColor) {
        borderGroups[borderGroupName].color = { attrName, attr };
      }
    } else {
      remaining.push({ attrName, attr });
    }
  });

  return { borderGroups, remaining };
}

/**
 * Generate border shorthand code
 * @param {string} borderGroupName - Border group name (border, divider, etc.)
 * @param {Object} borderGroup - Width, style, color attributes
 * @param {string} selectorKey - Style object key
 * @returns {string} JavaScript code for border shorthand
 */
function generateBorderShorthand(borderGroupName, borderGroup, selectorKey) {
  const { width, style, color } = borderGroup;

  if (!width || !style || !color) {
    // Not complete border shorthand, generate individual properties
    let code = '';
    if (width) code += generatePropertyAssignment(width.attrName, width.attr, selectorKey) + '\n';
    if (style) code += generatePropertyAssignment(style.attrName, style.attr, selectorKey) + '\n';
    if (color) code += generatePropertyAssignment(color.attrName, color.attr, selectorKey) + '\n';
    return code;
  }

  // Generate complete border shorthand
  const widthDefault = width.attr.default || 1;
  const styleDefault = style.attr.default || 'solid';
  const colorDefault = color.attr.default || '#dddddd';
  const widthUnit = width.attr.unit || 'px';

  // Determine CSS property name
  let cssProp = 'border';
  if (borderGroupName === 'divider') {
    cssProp = 'borderTop';
  }

  // Special handling for divider - only show if width > 0
  if (borderGroupName === 'divider') {
    return `    // Divider border (only if width > 0)
    if (effectiveValues.${width.attrName} !== undefined && effectiveValues.${width.attrName} > 0) {
      ${selectorKey}.${cssProp} = \`\${effectiveValues.${width.attrName} || ${widthDefault}}${widthUnit} \${effectiveValues.${style.attrName} || '${styleDefault}'} \${effectiveValues.${color.attrName} || '${colorDefault}'}\`;
    } else {
      ${selectorKey}.${cssProp} = 'none';
    }`;
  }

  return `    // ${borderGroupName} shorthand
    ${selectorKey}.${cssProp} = \`\${effectiveValues.${width.attrName} || ${widthDefault}}${widthUnit} \${effectiveValues.${style.attrName} || '${styleDefault}'} \${effectiveValues.${color.attrName} || '${colorDefault}'}\`;`;
}

/**
 * Generate the complete getInlineStyles() function
 * @param {Object} schema - Block schema
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {string} Complete function code
 */
function generateGetInlineStyles(schema, blockType) {
  const groups = groupAttributesBySelector(schema);
  const selectors = Object.keys(groups);

  // Determine which style objects to create
  const styleObjects = new Set();
  selectors.forEach((selector) => {
    const key = getSelectorKey(selector, blockType);
    styleObjects.add(key);
  });

  let code = `  /**
   * Apply inline styles from effective values
   */
  const getInlineStyles = () => {
`;

  // Declare all style objects
  styleObjects.forEach((key) => {
    code += `    const ${key}Styles = {};\n`;
  });

  code += '\n';

  // Generate property assignments for each selector group
  selectors.forEach((selector) => {
    const selectorKey = getSelectorKey(selector, blockType);
    const selectorGroup = groups[selector];

    code += `    // Styles for ${selector}\n`;

    // Extract border groups and remaining attributes
    const { borderGroups, remaining } = extractBorderGroups(selectorGroup, blockType);

    // Generate border shorthands
    Object.entries(borderGroups).forEach(([borderGroupName, borderGroup]) => {
      code += generateBorderShorthand(borderGroupName, borderGroup, `${selectorKey}Styles`);
      code += '\n';
    });

    // Generate remaining property assignments
    remaining.forEach(({ attrName, attr }) => {
      code += generatePropertyAssignment(attrName, attr, `${selectorKey}Styles`);
      code += '\n';
    });

    code += '\n';
  });

  // Return object with all style objects
  code += '    return {\n';
  styleObjects.forEach((key) => {
    code += `      ${key}: ${key}Styles,\n`;
  });
  code += '    };\n';
  code += '  };\n';

  return code;
}

/**
 * Main generator function
 * @param {Object} schema - Block schema
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @returns {string} Generated getInlineStyles() function code
 */
function generateEditInlineStyles(schema, blockType) {
  return generateGetInlineStyles(schema, blockType);
}

module.exports = {
  generateEditInlineStyles,
  getSelectorKey,
  toCamelCase,
  isStateAttribute,
  groupAttributesBySelector,
  extractBorderGroups,
  generateBorderShorthand,
};
