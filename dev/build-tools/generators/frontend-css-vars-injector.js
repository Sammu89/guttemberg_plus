/**
 * Frontend CSS Vars Generator
 *
 * Auto-generates buildFrontendCssVars() helpers per block.
 * These helpers output base + responsive CSS variables for frontend save output.
 *
 * @package
 * @since 1.0.0
 */

/**
 * Get auto-generated file header
 * @param schemaFile
 * @param blockName
 */
function getGeneratedHeader( schemaFile, blockName ) {
	return `/**
 * Frontend CSS Vars for ${ blockName } Block
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/${ schemaFile }
 * Generated at: ${ new Date().toISOString() }
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

`;
}

/**
 * Generate buildFrontendCssVars helper for a block
 *
 * @param {string} blockType - Block type identifier (accordion, tabs, toc)
 * @param {Object} schema    - Block schema
 * @return {{ fileName: string, content: string }}
 */
function generateFrontendCssVarsBuilder( blockType, schema ) {
	const fileName = `${ blockType }-frontend-css-vars-generated.js`;
	const blockName = schema.blockName || blockType;

	const themeableAttrs = [];
	const nonThemeableAttrs = [];

	Object.entries( schema.attributes ).forEach( ( [ attrName, attr ] ) => {
		if ( attr.outputsCSS === false || ! attr.cssVar ) {
			return;
		}

		if ( attr.themeable ) {
			themeableAttrs.push( attrName );
			return;
		}

		nonThemeableAttrs.push( attrName );
	} );

	let content = getGeneratedHeader( `${ blockType }.json`, blockName );

	content += `import { formatCssValue, getCssVarName, decomposeObjectToSides, CSS_VAR_MAPPINGS } from '@shared/config/css-var-mappings-generated';\n\n`;
	content += `const THEMEABLE_ATTRS = new Set(${ JSON.stringify( themeableAttrs ) });\n`;
	content += `const NON_THEMEABLE_ATTRS = new Set(${ JSON.stringify( nonThemeableAttrs ) });\n\n`;
	content += `/**
 * Build inline CSS variables for frontend save output.
 * Themeable attrs use customizations (deltas only).
 * Non-themeable attrs use per-block attribute values.
 * Emits base + device-specific overrides for responsive attributes.
 *
 * @param {Object} customizations - Themeable deltas (Tier 3)
 * @param {Object} attributes - Block attributes (includes non-themeable values)
 * @returns {Object} CSS variable map for inline styles
 */
export function buildFrontendCssVars(customizations, attributes) {
  const styles = {};

  const expandPanelType = (cssVar, value, type) => {
    if (!value || typeof value !== 'object') return;

    const sides = ['top', 'right', 'bottom', 'left'];
    const corners = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
    const toKebab = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

    if (type === 'color-panel') {
      if (value.text) styles[\`\${cssVar}-color\`] = value.text;
      if (value.background) styles[\`\${cssVar}-background\`] = value.background;
      if (value.hover) {
        if (value.hover.text) styles[\`\${cssVar}-color-hover\`] = value.hover.text;
        if (value.hover.background) styles[\`\${cssVar}-background-hover\`] = value.hover.background;
      }
      return;
    }

    if (type === 'typography-panel') {
      if (value.fontFamily) styles[\`\${cssVar}-font-family\`] = value.fontFamily;
      if (value.fontSize) styles[\`\${cssVar}-font-size\`] = value.fontSize;
      if (value.lineHeight) styles[\`\${cssVar}-line-height\`] = value.lineHeight;
      return;
    }

    if (type === 'box-panel') {
      if (value.padding) {
        const p = value.padding;
        const pUnit = p.unit || 'px';
        sides.forEach((side) => {
          if (p[side] !== undefined) {
            styles[\`\${cssVar}-padding-\${side}\`] = \`\${p[side] || 0}\${pUnit}\`;
          }
        });
      }
      if (value.margin) {
        const m = value.margin;
        const mUnit = m.unit || 'px';
        sides.forEach((side) => {
          if (m[side] !== undefined) {
            styles[\`\${cssVar}-margin-\${side}\`] = \`\${m[side] || 0}\${mUnit}\`;
          }
        });
      }
      if (value.border) {
        const b = value.border;
        if (b.width) {
          const bwUnit = b.width.unit || 'px';
          sides.forEach((side) => {
            if (b.width[side] !== undefined) {
              styles[\`\${cssVar}-border-\${side}-width\`] = \`\${b.width[side] || 0}\${bwUnit}\`;
            }
          });
        }
        if (b.color) {
          sides.forEach((side) => {
            if (b.color[side] !== undefined) {
              styles[\`\${cssVar}-border-\${side}-color\`] = b.color[side] || 'transparent';
            }
          });
        }
        if (b.style) {
          sides.forEach((side) => {
            if (b.style[side] !== undefined) {
              styles[\`\${cssVar}-border-\${side}-style\`] = b.style[side] || 'solid';
            }
          });
        }
      }
      if (value.radius) {
        const r = value.radius;
        const rUnit = r.unit || 'px';
        corners.forEach((corner) => {
          if (r[corner] !== undefined) {
            styles[\`\${cssVar}-border-\${toKebab(corner)}-radius\`] = \`\${r[corner] || 0}\${rUnit}\`;
          }
        });
      }
      if (value.shadow && Array.isArray(value.shadow)) {
        const shadowStr = value.shadow.map(s => {
          if (!s || !s.color) return null;
          const x = s.x?.value ?? 0;
          const y = s.y?.value ?? 0;
          const blur = s.blur?.value ?? 0;
          const spread = s.spread?.value ?? 0;
          const unit = s.x?.unit || 'px';
          const inset = s.inset ? 'inset ' : '';
          return \`\${inset}\${x}\${unit} \${y}\${unit} \${blur}\${unit} \${spread}\${unit} \${s.color}\`;
        }).filter(Boolean).join(', ') || 'none';
        styles[\`\${cssVar}-box-shadow\`] = shadowStr;
      }
      return;
    }

    if (type === 'border-panel') {
      if (value.width) {
        const w = value.width;
        const wUnit = w.unit || 'px';
        sides.forEach((side) => {
          if (w[side] !== undefined) {
            styles[\`\${cssVar}-border-\${side}-width\`] = \`\${w[side] || 0}\${wUnit}\`;
          }
        });
      }
      if (value.color) {
        sides.forEach((side) => {
          if (value.color[side] !== undefined) {
            styles[\`\${cssVar}-border-\${side}-color\`] = value.color[side] || 'transparent';
          }
        });
      }
      if (value.style) {
        sides.forEach((side) => {
          if (value.style[side] !== undefined) {
            styles[\`\${cssVar}-border-\${side}-style\`] = value.style[side] || 'solid';
          }
        });
      }
      return;
    }
  };

  const applyDecomposed = (attrName, value, suffix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return;
    }
    const decomposed = decomposeObjectToSides(attrName, value, '${ blockType }', suffix);
    if (Object.keys(decomposed).length > 0) {
      Object.assign(styles, decomposed);
    }
  };

  const applyValue = (attrName, value) => {
    if (value === null || value === undefined) {
      return;
    }

    const cssVar = getCssVarName(attrName, '${ blockType }');
    if (!cssVar) {
      return;
    }

    const mapping = CSS_VAR_MAPPINGS['${ blockType }']?.[attrName];
    const attrType = mapping?.type;
    if (attrType && ['color-panel', 'box-panel', 'typography-panel', 'border-panel'].includes(attrType)) {
      expandPanelType(cssVar, value, attrType);
      return;
    }

    const isResponsiveValue = value && typeof value === 'object' &&
      (value.tablet !== undefined || value.mobile !== undefined);

    if (isResponsiveValue) {
      // Extract base value - skip if only device overrides exist
      let baseValue = value.value !== undefined ? value.value : value;
      if (typeof baseValue === 'number' && value.unit !== undefined) {
        baseValue = { value: baseValue, unit: value.unit };
      }
      // Only output base if it's not a responsive container object
      const isResponsiveContainer = baseValue && typeof baseValue === 'object' &&
        (baseValue.tablet !== undefined || baseValue.mobile !== undefined);
      if (!isResponsiveContainer && baseValue !== null && baseValue !== undefined) {
        const formattedBase = formatCssValue(attrName, baseValue, '${ blockType }');
        if (formattedBase !== null && formattedBase !== 'undefined' &&
            !(typeof formattedBase === 'string' && formattedBase.startsWith('undefined'))) {
          styles[cssVar] = formattedBase;
        }
        applyDecomposed(attrName, baseValue, '');
      }

      if (value.tablet !== undefined && value.tablet !== null) {
        const formattedTablet = formatCssValue(attrName, value.tablet, '${ blockType }');
        if (formattedTablet !== null && formattedTablet !== 'undefined' &&
            !(typeof formattedTablet === 'string' && formattedTablet.startsWith('undefined'))) {
          styles[\`\${cssVar}-tablet\`] = formattedTablet;
        }
        applyDecomposed(attrName, value.tablet, '-tablet');
      }

      if (value.mobile !== undefined && value.mobile !== null) {
        const formattedMobile = formatCssValue(attrName, value.mobile, '${ blockType }');
        if (formattedMobile !== null && formattedMobile !== 'undefined' &&
            !(typeof formattedMobile === 'string' && formattedMobile.startsWith('undefined'))) {
          styles[\`\${cssVar}-mobile\`] = formattedMobile;
        }
        applyDecomposed(attrName, value.mobile, '-mobile');
      }
      return;
    }

    const formattedValue = formatCssValue(attrName, value, '${ blockType }');
    if (formattedValue !== null && formattedValue !== 'undefined' &&
        !(typeof formattedValue === 'string' && formattedValue.startsWith('undefined'))) {
      styles[cssVar] = formattedValue;
    }
    applyDecomposed(attrName, value, '');
  };

  if (customizations && typeof customizations === 'object') {
    Object.entries(customizations).forEach(([attrName, value]) => {
      if (!THEMEABLE_ATTRS.has(attrName)) {
        return;
      }
      applyValue(attrName, value);
    });
  }

  if (attributes && typeof attributes === 'object') {
    NON_THEMEABLE_ATTRS.forEach((attrName) => {
      applyValue(attrName, attributes[attrName]);
    });
  }

  return styles;
}
`;

	return { fileName, content };
}

module.exports = {
	generateFrontendCssVarsBuilder,
};
