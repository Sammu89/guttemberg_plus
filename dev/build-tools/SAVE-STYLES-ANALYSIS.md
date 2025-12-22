# Save.js Style Mapping Analysis

## Executive Summary

All three blocks (accordion, tabs, toc) use schema-generated helper functions (`getCssVarName()` and `formatCssValue()`) to map attributes to CSS variables in their save.js files. However, they use **three different patterns** with different trade-offs.

## Current Implementation Patterns

### Pattern 1: Accordion (Delta-Based)

**File:** `blocks/accordion/src/save.js` (lines 54-86)

**Approach:** Iterates through `attributes.customizations` object only

```javascript
const getCustomizationStyles = () => {
  const styles = {};
  const customizations = attributes.customizations || {};

  Object.entries( customizations ).forEach( ( [ attrName, value ] ) => {
    if ( value === null || value === undefined ) {
      return;
    }

    const cssVar = getCssVarName( attrName, 'accordion' );
    if ( ! cssVar ) {
      return;
    }

    const formattedValue = formatCssValue( attrName, value, 'accordion' );
    if ( formattedValue !== null ) {
      styles[ cssVar ] = formattedValue;
    }
  } );

  return styles;
};
```

**Characteristics:**
- ✅ Most efficient: Only processes delta values
- ✅ Minimal inline CSS output
- ✅ Follows Tier 3 philosophy (customizations override theme)
- ✅ Aligns with edit.js delta calculator approach
- ⚠️ Requires customizations object to be properly maintained

### Pattern 2: Tabs (All Attributes with Toggles)

**File:** `blocks/tabs/src/save.js` (lines 53-115)

**Approach:** Iterates through ALL `attributes` with feature toggle logic

```javascript
const getCustomizationStyles = () => {
  const styles = {};

  // Block-specific toggle handling
  if ( attributes.enableFocusBorder === false ) {
    styles['--tabs-focus-border-color'] = 'transparent';
    styles['--tabs-focus-border-width'] = '0';
    styles['--tabs-focus-border-style'] = 'none';
  }

  if ( attributes.enableDividerBorder === false ) {
    styles['--tabs-divider-border-color'] = 'transparent';
    styles['--tabs-divider-border-width'] = '0';
    styles['--tabs-divider-border-style'] = 'none';
  }

  // Process ALL attributes
  Object.entries( attributes ).forEach( ( [ attrName, value ] ) => {
    if ( value === null || value === undefined ) {
      return;
    }

    // Skip toggle attributes
    if ( attrName === 'enableFocusBorder' || attrName === 'enableDividerBorder' ) {
      return;
    }

    // Skip attributes controlled by disabled toggles
    const controllingToggle = toggledAttributes[ attrName ];
    if ( controllingToggle && ! attributes[ controllingToggle ] ) {
      return;
    }

    const cssVar = getCssVarName( attrName, 'tabs' );
    if ( ! cssVar ) {
      return;
    }

    const formattedValue = formatCssValue( attrName, value, 'tabs' );
    if ( formattedValue !== null ) {
      styles[ cssVar ] = formattedValue;
    }
  } );

  return styles;
};
```

**Characteristics:**
- ⚠️ Less efficient: Processes all attributes (not just deltas)
- ⚠️ More inline CSS output
- ✅ Handles complex feature toggle logic
- ✅ Self-contained (doesn't rely on customizations object)
- ❌ Doesn't leverage Tier 2 CSS classes effectively

### Pattern 3: ToC (All Attributes - Simple)

**File:** `blocks/toc/src/save.js` (lines 207-230)

**Approach:** Iterates through ALL `attributes` (external function)

```javascript
function buildCustomizationStyles( attributes ) {
  const styles = {};

  // Process ALL attributes
  Object.entries( attributes ).forEach( ( [ attrName, value ] ) => {
    if ( value === null || value === undefined ) {
      return;
    }

    const cssVar = getCssVarName( attrName, 'toc' );
    if ( ! cssVar ) {
      return;
    }

    const formattedValue = formatCssValue( attrName, value, 'toc' );
    if ( formattedValue !== null ) {
      styles[ cssVar ] = formattedValue;
    }
  } );

  return styles;
}
```

**Characteristics:**
- ⚠️ Less efficient: Processes all attributes (not just deltas)
- ⚠️ More inline CSS output
- ✅ Simplest implementation
- ✅ External function (could be reusable)
- ❌ Doesn't leverage Tier 2 CSS classes effectively

## Comparison Table

| Aspect | Accordion (Delta) | Tabs (All + Toggles) | ToC (All) |
|--------|------------------|---------------------|-----------|
| **Data Source** | customizations | attributes | attributes |
| **Efficiency** | ⭐⭐⭐ High | ⭐ Low | ⭐ Low |
| **Inline CSS Size** | ⭐⭐⭐ Minimal | ⭐ Large | ⭐ Large |
| **Tier 2 Leverage** | ⭐⭐⭐ Full | ⭐ Partial | ⭐ Partial |
| **Toggle Support** | N/A | ⭐⭐⭐ Full | N/A |
| **Complexity** | ⭐⭐ Medium | ⭐⭐⭐ High | ⭐ Low |
| **Delta Philosophy** | ✅ Yes | ❌ No | ❌ No |

## Why Three Different Patterns?

### Historical Context

The patterns likely evolved at different times:

1. **ToC (Simplest):** First implementation - iterate all attributes
2. **Tabs (Toggles):** Added feature toggle requirements
3. **Accordion (Delta):** Latest implementation - optimized for delta-based approach

### Technical Reasons

**Accordion uses deltas because:**
- edit.js maintains `customizations` object via delta calculator
- Aligns with 3-tier CSS cascade philosophy
- Minimizes inline CSS output
- Leverages PHP-generated Tier 2 CSS classes

**Tabs needs all attributes because:**
- Feature toggles require examining full attribute set
- Toggle logic needs to reset CSS variables to prevent inheritance
- More complex conditional logic

**ToC uses all attributes because:**
- Simpler block with fewer attributes
- No toggle requirements
- Possibly predates delta approach

## Recommended Pattern: Delta-Based (Accordion)

The accordion pattern is **recommended** for new implementations because:

### Advantages

1. **Efficiency:** Only processes changed values
2. **Minimal Output:** Less inline CSS = smaller HTML
3. **Tier Leverage:** Relies on Tier 2 CSS classes for theme values
4. **Consistency:** Matches edit.js delta calculator approach
5. **Philosophy:** Aligns with 3-tier cascade (Defaults → Theme → Customizations)

### Example Output Comparison

**Delta-Based (Accordion):**
```html
<div class="accordion-theme-modern" style="--accordion-title-color: #ff0000">
  <!-- Only customized value in inline CSS -->
  <!-- Theme values come from .accordion-theme-modern CSS class -->
</div>
```

**All-Attributes (Tabs/ToC):**
```html
<div class="tabs-theme-modern" style="--tabs-button-color: #333; --tabs-button-bg: #f5f5f5; --tabs-button-hover-color: #000; ...">
  <!-- ALL values in inline CSS, even if they match theme -->
  <!-- .tabs-theme-modern CSS class is partially overridden -->
</div>
```

## Migration Recommendation

### Migrate Tabs and ToC to Delta Pattern

**Benefits:**
- Consistent approach across all blocks
- Reduced HTML size
- Better performance
- Proper tier cascade

**Steps:**

1. **Ensure customizations object exists** in tabs/toc attributes
2. **Update edit.js** to maintain customizations via delta calculator
3. **Update save.js** to iterate through customizations (not attributes)
4. **Handle toggles differently** (see below)

### Handling Feature Toggles with Delta Pattern

For tabs, feature toggles can be handled without iterating all attributes:

```javascript
const getCustomizationStyles = () => {
  const styles = {};

  // Handle feature toggles FIRST (before customizations)
  if ( attributes.enableFocusBorder === false ) {
    styles['--tabs-focus-border-color'] = 'transparent';
    styles['--tabs-focus-border-width'] = '0';
    styles['--tabs-focus-border-style'] = 'none';
  }

  if ( attributes.enableDividerBorder === false ) {
    styles['--tabs-divider-border-color'] = 'transparent';
    styles['--tabs-divider-border-width'] = '0';
    styles['--tabs-divider-border-style'] = 'none';
  }

  // Then process customizations (delta-based)
  const customizations = attributes.customizations || {};
  Object.entries( customizations ).forEach( ( [ attrName, value ] ) => {
    if ( value === null || value === undefined ) {
      return;
    }

    const cssVar = getCssVarName( attrName, 'tabs' );
    if ( ! cssVar ) {
      return;
    }

    const formattedValue = formatCssValue( attrName, value, 'tabs' );
    if ( formattedValue !== null ) {
      styles[ cssVar ] = formattedValue;
    }
  } );

  return styles;
};
```

**Key Insight:** Toggles override customizations, so they go first. This maintains delta efficiency while supporting toggles.

## Generator Recommendation

### Updated Generator (Support All Patterns)

The generator should support both patterns with a flag:

```javascript
function generateSaveStyleMapping(schema, blockType, options = {}) {
  const useDeltas = options.useDeltas !== false; // default true
  const dataSource = useDeltas ? 'attributes.customizations' : 'attributes';

  // Generate appropriate code based on pattern
}
```

**Usage:**

```javascript
// Recommended: Delta-based
generateSaveStyleMapping(schema, 'accordion', { useDeltas: true });

// Legacy: All attributes
generateSaveStyleMapping(schema, 'tabs', { useDeltas: false });
```

### Block-Specific Customizations

For blocks with special requirements (toggles, etc.), generate the base code and document where to add custom logic:

```javascript
const getCustomizationStyles = () => {
  const styles = {};

  // ⚠️ CUSTOM LOGIC: Add block-specific code here (toggles, special cases)
  // Example: if ( attributes.enableFeature === false ) { ... }

  // AUTO-GENERATED: Standard delta-based mapping
  const customizations = attributes.customizations || {};
  Object.entries( customizations ).forEach( ( [ attrName, value ] ) => {
    // ... generated code ...
  } );

  return styles;
};
```

## Common Helper Functions

### Shared Utility (ALL blocks use these)

All three blocks rely on auto-generated helper functions:

**File:** `shared/src/config/css-var-mappings-generated.js`

```javascript
// Get CSS variable name from schema
export function getCssVarName(attrName, blockType) {
  return CSS_VAR_MAPPINGS[blockType]?.[attrName]?.cssVar || null;
}

// Format value with unit from schema
export function formatCssValue(attrName, value, blockType) {
  const mapping = CSS_VAR_MAPPINGS[blockType]?.[attrName];
  if (!mapping) return null;

  // Handle objects (borderRadius, padding)
  if (mapping.type === 'object') {
    if (attrName.includes('radius')) {
      return `${value.topLeft}px ${value.topRight}px ${value.bottomRight}px ${value.bottomLeft}px`;
    }
  }

  // Handle numbers with units
  if (mapping.unit && typeof value === 'number') {
    return `${value}${mapping.unit}`;
  }

  return value;
}
```

**Key Point:** These functions are the REAL source of truth. They read from schema-generated mappings, so save.js code doesn't need to know about units or CSS variable names.

## Conclusion

### Current State
- ✅ All blocks use schema-generated helpers (getCssVarName, formatCssValue)
- ⚠️ Three different iteration patterns (customizations vs attributes)
- ⚠️ Inconsistent efficiency (delta vs all)

### Recommendation
1. **Keep accordion pattern** (delta-based) as the standard
2. **Migrate tabs/toc** to delta pattern for consistency
3. **Update generator** to support both patterns (with delta as default)
4. **Document custom logic** insertion points for special cases

### Benefits of Standardization
- Consistent approach across all blocks
- Reduced HTML output size
- Better performance
- Proper 3-tier cascade utilization
- Easier maintenance

The delta-based pattern is the most sophisticated and efficient approach, aligning perfectly with the plugin's architecture philosophy.
