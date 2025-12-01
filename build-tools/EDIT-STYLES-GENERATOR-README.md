# Edit.js Inline Styles Generator

## Overview

The **edit-styles-injector.js** generator automatically creates the `getInlineStyles()` function for edit.js files based on schema definitions.

## Purpose

- **Eliminates manual synchronization** between schema and edit.js inline styles
- **Ensures consistency** across all blocks
- **Type-safe** - uses only attributes defined in schema
- **Reduces errors** - no hardcoded values or typos

## How It Works

### 1. Input: Schema Definition

The generator reads schema files (`schemas/accordion.json`, etc.) and looks for:

- **Themeable attributes** (`themeable: true`)
- **CSS properties** (`cssProperty` field)
- **CSS selectors** (`cssSelector` field)
- **Data types and units** (`type`, `unit`)

### 2. Output: Generated Function

Creates a `getInlineStyles()` function that:

1. Declares style objects (container, title, content, icon)
2. Groups attributes by CSS selector
3. Applies proper formatting (units, object handling)
4. Returns style object for React inline styles

### 3. Example Output

For accordion block with schema:

```json
{
  "titleColor": {
    "type": "string",
    "default": "#333333",
    "cssSelector": ".accordion-header",
    "cssProperty": "color",
    "themeable": true
  },
  "titleFontSize": {
    "type": "number",
    "default": 18,
    "unit": "px",
    "cssSelector": ".accordion-header",
    "cssProperty": "font-size",
    "themeable": true
  }
}
```

Generates:

```javascript
const getInlineStyles = () => {
  const titleStyles = {};

  // Styles for .accordion-header
  if (effectiveValues.titleColor !== undefined && effectiveValues.titleColor !== null) {
    titleStyles.color = effectiveValues.titleColor;
  }
  if (effectiveValues.titleFontSize !== undefined && effectiveValues.titleFontSize !== null) {
    titleStyles.fontSize = `${effectiveValues.titleFontSize}px`;
  }

  return {
    title: titleStyles,
  };
};
```

## Feature Highlights

### 1. Automatic Unit Handling

**Schema:**
```json
{
  "iconSize": {
    "type": "number",
    "default": 20,
    "unit": "px"
  }
}
```

**Generated:**
```javascript
if (effectiveValues.iconSize !== undefined) {
  iconStyles.fontSize = `${effectiveValues.iconSize}px`;
}
```

### 2. Border Shorthand

Automatically combines border width, style, and color into CSS shorthand.

**Schema:**
```json
{
  "borderWidth": { "type": "number", "default": 1, "unit": "px" },
  "borderStyle": { "type": "string", "default": "solid" },
  "borderColor": { "type": "string", "default": "#dddddd" }
}
```

**Generated:**
```javascript
containerStyles.border = `${effectiveValues.borderWidth || 1}px ${effectiveValues.borderStyle || 'solid'} ${effectiveValues.borderColor || '#dddddd'}`;
```

### 3. Border Radius Object Handling

**Schema:**
```json
{
  "borderRadius": {
    "type": "object",
    "default": {
      "topLeft": 4,
      "topRight": 4,
      "bottomRight": 4,
      "bottomLeft": 4
    }
  }
}
```

**Generated:**
```javascript
if (effectiveValues.borderRadius) {
  const br = effectiveValues.borderRadius;
  containerStyles.borderRadius = `${br.topLeft || 0}px ${br.topRight || 0}px ${br.bottomRight || 0}px ${br.bottomLeft || 0}px`;
}
```

### 4. Padding Object Handling

**Schema:**
```json
{
  "titlePadding": {
    "type": "object",
    "default": {
      "top": 16,
      "right": 16,
      "bottom": 16,
      "left": 16
    }
  }
}
```

**Generated:**
```javascript
if (effectiveValues.titlePadding) {
  const p = effectiveValues.titlePadding;
  titleStyles.padding = `${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px`;
}
```

### 5. Conditional Borders (Divider)

Special handling for divider borders that only show when width > 0.

**Generated:**
```javascript
// Divider border (only if width > 0)
if (effectiveValues.dividerWidth !== undefined && effectiveValues.dividerWidth > 0) {
  contentStyles.borderTop = `${effectiveValues.dividerWidth || 1}px ${effectiveValues.dividerStyle || 'solid'} ${effectiveValues.dividerColor || '#dddddd'}`;
} else {
  contentStyles.borderTop = 'none';
}
```

## CSS Selector Mapping

The generator automatically maps CSS selectors to style object names:

| CSS Selector | Style Object Key | Used In |
|-------------|------------------|---------|
| `.wp-block-guttemberg-plus-accordion` | `container` | Accordion wrapper |
| `.accordion-header` | `title` | Accordion title/header |
| `.accordion-content` | `content` | Accordion content area |
| `.accordion-icon` | `icon` | Accordion icon |
| `.tabs-header` | `header` | Tabs header |
| `.tabs-content` | `content` | Tabs content |

## Usage in Schema Compiler

The generator will be integrated into `build-tools/schema-compiler.js`:

```javascript
const { generateEditInlineStyles } = require('./generators/edit-styles-injector');

// In compile() function:
for (const [blockType, schema] of Object.entries(schemas)) {
  // Generate getInlineStyles code
  const inlineStylesCode = generateEditInlineStyles(schema, blockType);

  // Inject into edit.js between markers
  // <!-- AUTO-GENERATED:getInlineStyles:START -->
  // ... generated code here ...
  // <!-- AUTO-GENERATED:getInlineStyles:END -->
}
```

## Comparison: Current vs Generated

### Current edit.js (Manual)

**Problems:**
- Uses hardcoded attribute names (might not match schema)
- Uses old attribute names (accordionBorderThickness vs borderWidth)
- Hardcoded defaults
- Manual unit handling
- Prone to typos and inconsistencies

**Example:**
```javascript
const getInlineStyles = () => {
  const titlePadding = effectiveValues.titlePadding || {
    top: 16, right: 16, bottom: 16, left: 16,
  };

  return {
    container: {
      border: `${effectiveValues.accordionBorderThickness || 1}px ${
        effectiveValues.accordionBorderStyle || 'solid'
      } ${effectiveValues.accordionBorderColor || '#dddddd'}`,
    }
  };
};
```

### Generated (From Schema)

**Benefits:**
- Always matches schema (single source of truth)
- Uses correct attribute names
- Defaults come from schema
- Automatic unit handling
- Zero manual maintenance

**Example:**
```javascript
const getInlineStyles = () => {
  const containerStyles = {};

  // border shorthand
  containerStyles.border = `${effectiveValues.borderWidth || 1}px ${effectiveValues.borderStyle || 'solid'} ${effectiveValues.borderColor || '#dddddd'}`;

  return {
    container: containerStyles,
  };
};
```

## Generator API

### Main Function

```javascript
generateEditInlineStyles(schema, blockType)
```

**Parameters:**
- `schema` (Object) - Parsed schema JSON
- `blockType` (String) - Block type ('accordion', 'tabs', 'toc')

**Returns:**
- (String) - Generated JavaScript code for getInlineStyles() function

### Helper Functions

```javascript
// Get style object key from CSS selector
getSelectorKey(selector, blockType)

// Convert CSS property to camelCase
toCamelCase(cssProperty)

// Group attributes by CSS selector
groupAttributesBySelector(schema)

// Extract border-related attributes
extractBorderGroups(selectorGroup, blockType)

// Generate border shorthand code
generateBorderShorthand(borderGroupName, borderGroup, selectorKey)
```

## Current Schema Coverage

### Accordion Block

**Attributes with cssProperty (Generated):**
- titleColor, titleBackgroundColor
- hoverTitleColor, hoverTitleBackgroundColor
- contentColor, contentBackgroundColor
- borderColor, borderWidth, borderStyle, borderRadius
- dividerColor, dividerWidth, dividerStyle
- iconColor, iconSize
- titleFontSize, titleFontWeight, titleFontStyle
- titleTextTransform, titleTextDecoration, titleAlignment
- contentFontSize, contentFontWeight
- shadow, shadowHover

**Total:** ~30 themeable attributes with CSS properties

## Integration Workflow

1. **Edit schema** (`schemas/accordion.json`)
2. **Run** `npm run schema:build`
3. **Generator produces** `getInlineStyles()` code
4. **Code injected** into edit.js between markers
5. **Test** in WordPress editor
6. **No manual edits** to inline styles needed

## Migration Notes

### Attribute Name Changes

If migrating from manual to generated styles, note these schema attribute names:

| Old (Manual) | New (Schema) | Notes |
|-------------|--------------|-------|
| `accordionBorderThickness` | `borderWidth` | Standardized naming |
| `dividerBorderThickness` | `dividerWidth` | Standardized naming |
| `accordionBorderRadius` | `borderRadius` | Simplified |
| `accordionShadow` | `shadow` | Simplified |

### Missing Attributes

If edit.js uses attributes not in schema:
1. Add them to schema with proper fields
2. Run `npm run schema:build`
3. Generated code will include them automatically

## Benefits

1. **Single Source of Truth** - Schema defines everything
2. **Zero Manual Sync** - Generator handles it
3. **Type Safety** - Only valid attributes used
4. **Consistency** - Same pattern across all blocks
5. **Maintainability** - Change schema, rebuild, done
6. **Error Prevention** - No typos or outdated names

## Future Enhancements

Potential improvements:

1. **Hover state handling** - Generate hover-specific styles
2. **Responsive styles** - Generate media query variants
3. **Animation styles** - Generate transition properties
4. **Custom validators** - Schema-based validation
5. **Performance hints** - Memoization suggestions

## Testing

Test the generator:

```bash
cd build-tools
node test-edit-injector.js
```

This will:
1. Load accordion schema
2. Generate getInlineStyles() code
3. Display output
4. Save to `test-output-getInlineStyles.js`

## Summary

The edit-styles-injector eliminates manual synchronization between schema and edit.js inline styles, ensuring:

- **Accuracy** - Always matches schema
- **Consistency** - Same pattern everywhere
- **Efficiency** - Auto-generated in milliseconds
- **Reliability** - No human errors

All inline styles come from schema. One change updates everything.
