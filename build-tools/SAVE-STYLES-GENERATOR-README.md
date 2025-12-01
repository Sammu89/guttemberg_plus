# Save.js Style Mapping Generator

## Overview

The `save-styles-injector.js` generator creates the `getCustomizationStyles()` function code for save.js files. This function maps block customizations to CSS variables for inline style output on the frontend.

## Why This Generator Exists

**Problem:** save.js files need to output inline CSS variables from customizations, but manually mapping attributes to CSS variable names is error-prone and violates DRY principles.

**Solution:** Generate the mapping code from schema, ensuring:
- CSS variable names match schema `cssVar` field exactly
- Units are applied correctly from schema `unit` field
- Complex object types (borderRadius, padding) are formatted properly
- No manual mapping errors
- Single source of truth (schema)

## Current Implementation Status

**IMPORTANT:** The accordion save.js file ALREADY uses this exact pattern!

The current save.js implementation (lines 54-86) uses the auto-generated helper functions:
- `getCssVarName(attrName, blockType)` - Gets CSS variable name from schema
- `formatCssValue(attrName, value, blockType)` - Formats value with units

This generator produces the SAME approach, just encapsulated and ready for injection.

## Generator Output

The generator creates a `getCustomizationStyles()` function that:

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

## How It Works

### 1. Schema Defines CSS Variables

```json
{
  "titleColor": {
    "type": "string",
    "default": "#333333",
    "cssVar": "accordion-title-color",
    "themeable": true
  },
  "borderWidth": {
    "type": "number",
    "default": 1,
    "cssVar": "accordion-border-width",
    "unit": "px",
    "themeable": true
  }
}
```

### 2. Schema Compiler Generates Mappings

From schemas, the compiler generates `shared/src/config/css-var-mappings-generated.js`:

```javascript
export const CSS_VAR_MAPPINGS = {
  accordion: {
    titleColor: { cssVar: '--accordion-title-color', unit: null, type: 'string' },
    borderWidth: { cssVar: '--accordion-border-width', unit: 'px', type: 'number' },
  }
};
```

### 3. Helper Functions Use Mappings

```javascript
// Get CSS variable name
getCssVarName('titleColor', 'accordion')
// Returns: '--accordion-title-color'

// Format value with unit
formatCssValue('borderWidth', 2, 'accordion')
// Returns: '2px'
```

### 4. Save.js Uses Helpers

The generated function uses these helpers to map customizations:

```javascript
// Input
attributes.customizations = {
  titleColor: '#ff0000',
  borderWidth: 2
}

// Output
{
  '--accordion-title-color': '#ff0000',
  '--accordion-border-width': '2px'
}
```

## Usage in Save.js

### Required Imports

```javascript
import { getCssVarName, formatCssValue } from '@shared/config/css-var-mappings-generated';
```

### Function Placement

Place the generated function after `effectiveValues` and before JSX return:

```javascript
export default function Save( { attributes } ) {
  const effectiveValues = getAllEffectiveValues(...);

  // GENERATED FUNCTION GOES HERE
  const getCustomizationStyles = () => {
    // ... generated code ...
  };

  const customizationStyles = getCustomizationStyles();

  const blockProps = useBlockProps.save( {
    ...( Object.keys( customizationStyles ).length > 0 && { style: customizationStyles } )
  } );

  return <div { ...blockProps }>...</div>;
}
```

## Integration with Schema Compiler

To fully integrate this generator into the build pipeline:

### 1. Add to schema-compiler.js

```javascript
const { generateSaveStyleInjection } = require('./generators/save-styles-injector');

// In main build loop
BLOCKS.forEach((blockType) => {
  const schema = loadSchema(blockType);

  // Generate save.js style injection
  const saveStylesOutput = generateSaveStyleInjection(schema, blockType);
  console.log(`Generated save styles for ${blockType}: ${saveStylesOutput.themeableAttributeCount} attributes`);
});
```

### 2. Automated Injection (Future)

For automated code injection, you could:

1. **Marker Comments in save.js:**
   ```javascript
   // BEGIN AUTO-GENERATED: getCustomizationStyles
   // ... generated code ...
   // END AUTO-GENERATED: getCustomizationStyles
   ```

2. **Build Script Updates save.js:**
   ```javascript
   // Find marker comments
   // Replace content between markers
   // Write updated save.js
   ```

However, for now, **manual copy-paste is fine** since:
- save.js changes infrequently
- Generated code is stable
- Current implementation already matches generator output

## Testing the Generator

Run the test script:

```bash
node build-tools/test-save-styles-generator.js
```

This generates and displays the function code for all three blocks (accordion, tabs, toc).

## Comparison: Current vs Generated

### Current Accordion Save.js (Lines 54-86)

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

  // Width is handled separately
  if ( attributes.accordionWidth && attributes.accordionWidth !== '100%' ) {
    styles.width = attributes.accordionWidth;
  }

  return styles;
};
```

### Generated Code

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

**Result:** IDENTICAL (except for accordion-specific width handling, which is a special case)

## Benefits

### Before Generator
- Manual mapping: `styles['--accordion-title-color'] = customizations.titleColor`
- Error-prone: Typos in CSS variable names
- Duplication: Same mapping logic in accordion, tabs, toc
- Out of sync: Schema changes not reflected in save.js

### After Generator
- ✅ Single source of truth: Schema defines mappings
- ✅ No manual mapping: getCssVarName() and formatCssValue() from schema
- ✅ Type-safe: Schema validation ensures correct types
- ✅ DRY: Same logic across all blocks
- ✅ Maintainable: Schema change → rebuild → done

## Real-World Example

### Scenario: Add New Attribute

**1. Update Schema**

```json
{
  "shadowColor": {
    "type": "string",
    "default": "#000000",
    "cssVar": "accordion-shadow-color",
    "themeable": true
  }
}
```

**2. Rebuild**

```bash
npm run schema:build
npm run build
```

**3. Done!**

The attribute is now:
- Available in editor
- Mapped in save.js (via getCssVarName/formatCssValue)
- Output as CSS variable automatically
- No manual code changes needed

## Advanced: Block-Specific Logic

Some blocks have special requirements (like tabs' feature toggles). The generator produces the base function, and you can add block-specific logic:

### Tabs Example (with toggles)

```javascript
const getCustomizationStyles = () => {
  const styles = {};

  // Block-specific: Handle feature toggles
  if ( attributes.enableFocusBorder === false ) {
    styles['--tabs-focus-border-color'] = 'transparent';
    styles['--tabs-focus-border-width'] = '0';
  }

  // Generated: Standard mapping
  const customizations = attributes.customizations || {};
  Object.entries( customizations ).forEach( ( [ attrName, value ] ) => {
    // ... generated code ...
  } );

  return styles;
};
```

## Files

- **Generator:** `build-tools/generators/save-styles-injector.js`
- **Test Script:** `build-tools/test-save-styles-generator.js`
- **This README:** `build-tools/SAVE-STYLES-GENERATOR-README.md`

## Next Steps

1. **Verify Current Implementation:** Check that accordion/tabs/toc save.js all use helper functions
2. **Document Pattern:** Add comments explaining the approach
3. **Optional Automation:** If save.js changes frequently, automate injection with markers
4. **Consider Build Integration:** Add to schema-compiler.js for consistency checks

## Conclusion

This generator codifies the pattern ALREADY used in save.js files. It ensures consistency, prevents errors, and maintains the single source of truth principle that powers the entire Guttemberg Plus plugin architecture.

The current implementation is correct - this generator simply makes it reproducible and documented.
