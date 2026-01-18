# Style Builder Usage Examples

This directory contains auto-generated style builder functions for all blocks. These functions ensure type safety and prevent manual code from using wrong attribute names.

## Auto-Generated Files

- `accordion-styles-generated.js`
- `tabs-styles-generated.js`
- `toc-styles-generated.js`

**⚠️ DO NOT EDIT** these files manually. They are regenerated on every build from the schemas.

## Usage in Edit Components (edit.js)

### Example: Using buildEditorStyles

```javascript
import { buildEditorStyles } from '@shared/styles/accordion-styles-generated';

// In your Edit component:
export default function Edit({ attributes, setAttributes }) {
  // ... your component logic ...

  // Get effective values (defaults + theme + customizations)
  const effectiveValues = {
    titleColor: '#333333',
    titleBackgroundColor: '#f5f5f5',
    titleFontSize: 18,
    borderRadius: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 },
    // ... all other attribute values
  };

  // Build styles using auto-generated function
  const styles = buildEditorStyles(effectiveValues);

  // Now use the styles in your JSX:
  return (
    <div className="accordion-wrapper" style={styles.container}>
      <div className="accordion-header" style={styles.header}>
        {/* Title content */}
      </div>
      <div className="accordion-content" style={styles.content}>
        {/* Content */}
      </div>
    </div>
  );
}
```

### Benefits of Using buildEditorStyles

1. **Type Safety**: No typos in attribute names
2. **Automatic Unit Handling**: Units (px, deg, etc.) are added automatically
3. **Complex Type Formatting**: borderRadius, padding objects are formatted correctly
4. **Single Source of Truth**: All from schema - no hardcoded values

## Usage in Save Components (save.js)

### Example: Using buildFrontendStyles

```javascript
import { buildFrontendStyles } from '@shared/styles/accordion-styles-generated';

export default function save({ attributes }) {
  // Get only the customizations (deltas from theme + defaults)
  const customizations = attributes.customizations || {};

  // Build CSS variables for inline styles
  const inlineStyles = buildFrontendStyles(customizations);

  // Apply to block wrapper
  return (
    <div
      className={blockClasses}
      style={inlineStyles}
    >
      {/* Your content */}
    </div>
  );
}
```

### What buildFrontendStyles Does

Converts this:
```javascript
{
  titleColor: '#ff0000',
  titleFontSize: 24,
  borderRadius: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 }
}
```

Into this:
```javascript
{
  '--accordion-title-color': '#ff0000',
  '--accordion-title-font-size': '24px',
  '--accordion-border-radius': '8px 8px 8px 8px'
}
```

## Helper Functions

### formatBorderRadius(radius)

```javascript
import { formatBorderRadius } from '@shared/styles/accordion-styles-generated';

const radius = { topLeft: 4, topRight: 8, bottomRight: 8, bottomLeft: 4 };
const formatted = formatBorderRadius(radius);
// Returns: "4px 8px 8px 4px"
```

### formatPadding(padding)

```javascript
import { formatPadding } from '@shared/styles/tabs-styles-generated';

const padding = { top: 10, right: 15, bottom: 10, left: 15 };
const formatted = formatPadding(padding);
// Returns: "10px 15px 10px 15px"
```

## Structure of Generated Styles

### buildEditorStyles Return Value

```javascript
{
  container: {
    backgroundColor: '...',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '4px 4px 4px 4px',
    // ... container-specific styles
  },
  header: {
    color: '...',
    fontSize: '18px',
    fontWeight: '600',
    // ... header-specific styles
  },
  content: {
    backgroundColor: '...',
    color: '...',
    // ... content-specific styles
  },
  icon: {
    fontSize: '20px',
    color: '...',
    // ... icon-specific styles
  }
}
```

## Migration Guide

### Before (Manual Hardcoded Styles)

```javascript
// ❌ BAD - Manual styles with typo risk
const styles = {
  title: {
    backgroundColor: effectiveValues.titleBackgroundColor || '#f5f5f5',
    color: effectiveValues.titleColr || '#333333', // TYPO!
    fontSize: `${effectiveValues.titleFontSize || 18}px`,
  }
};
```

### After (Auto-Generated)

```javascript
// ✅ GOOD - Schema-validated, typo-proof
import { buildEditorStyles } from '@shared/styles/accordion-styles-generated';

const styles = buildEditorStyles(effectiveValues);
// All attribute names are guaranteed correct from schema!
```

## How to Add New Style Properties

1. Edit the schema file: `schemas/accordion.json`
2. Add your attribute with `cssProperty` and `cssSelector` fields:

```json
{
  "myNewAttribute": {
    "type": "string",
    "default": "#ffffff",
    "cssVar": "accordion-my-new",
    "cssSelector": ".accordion-header",
    "cssProperty": "background-color",
    "group": "colors",
    "label": "My New Color",
    "themeable": true,
    "control": "ColorPicker"
  }
}
```

3. Run: `npm run schema:build`
4. The style builders are automatically updated!

## Supported CSS Properties

The generator automatically handles:

- **Simple values**: color, border-style, text-align, etc.
- **Numeric with units**: font-size (px), border-width (px), rotation (deg)
- **Complex objects**: borderRadius, padding (auto-formatted)

## Notes

- Only attributes with `themeable: true` and `cssProperty` are included
- The `cssSelector` field determines which style object (container, header, content, icon)
- Units are taken from the `unit` field in the schema
- Null/undefined values are safely skipped
