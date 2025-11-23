# Guttemberg Plus - Claude Development Guide

## Schema as Single Source of Truth

**CRITICAL:** The JSON schemas are the **ONLY source of truth** for block configuration. All other files are **AUTO-GENERATED** from the schemas.

### Schema Files Location
- `schemas/accordion.json` - Accordion block configuration
- `schemas/tabs.json` - Tabs block configuration
- `schemas/toc.json` - Table of Contents block configuration

---

## When to Update the Schema

Update the schema whenever you need to:

1. **Add a new attribute** (new color, new slider, new option)
2. **Change an attribute's default value**
3. **Modify min/max ranges** for sliders
4. **Change label or description** for a setting
5. **Add/modify options** for select dropdowns
6. **Update CSS variable names or units**

---

## How the Schema System Works

```
Schema (JSON)
    ↓
npm run schema:build (generates files)
    ├─ control-config-generated.js (JS config for editor UI)
    ├─ accordion-attributes.js (Block attribute definitions)
    ├─ accordion-generated.css (Frontend CSS with defaults)
    ├─ php/css-defaults/accordion.php (PHP defaults)
    ├─ validators/accordion-schema.ts (TypeScript type checking)
    ├─ types/accordion-theme.ts (TypeScript interfaces)
    └─ docs/accordion-attributes.md (Documentation)
```

**Never edit the generated files directly.** They will be overwritten on the next build.

---

## Schema Structure Example

```json
{
  "attributes": {
    "iconRotation": {
      "type": "number",
      "default": "180deg",
      "cssVar": "accordion-icon-rotation",
      "group": "icons",
      "label": "Icon Rotation",
      "description": "Rotation angle when open (degrees)",
      "themeable": true,
      "control": "RangeControl",
      "min": -360,
      "max": 360,
      "unit": "deg"
    },
    "titleColor": {
      "type": "string",
      "default": "#333333",
      "cssVar": "accordion-title-color",
      "group": "colors",
      "label": "Title Color",
      "description": "Text color for the accordion title",
      "themeable": true,
      "control": "ColorPicker"
    },
    "titleFontWeight": {
      "type": "string",
      "default": "600",
      "cssVar": "accordion-title-font-weight",
      "group": "typography",
      "label": "Font Weight",
      "themeable": true,
      "control": "SelectControl",
      "options": [
        { "label": "Normal", "value": "normal" },
        { "label": "Bold", "value": "bold" },
        { "label": "600", "value": "600" },
        { "label": "700", "value": "700" }
      ]
    }
  }
}
```

### Schema Field Definitions

| Field | Purpose | Required | Example |
|-------|---------|----------|---------|
| `type` | Attribute type (number, string, boolean, object) | ✅ | `"number"` |
| `default` | Default value (include units for numeric) | ✅ | `"180deg"`, `"#333333"` |
| `cssVar` | CSS custom property name (no dashes) | ✅ | `"accordion-icon-rotation"` |
| `group` | Category for organization | ✅ | `"icons"`, `"colors"`, `"typography"` |
| `label` | Display label in editor | ✅ | `"Icon Rotation"` |
| `description` | Help text for users | ✅ | `"Rotation angle when open..."` |
| `themeable` | Can be customized in themes | ✅ | `true` or `false` |
| `control` | Editor component type | ✅ | `"RangeControl"`, `"ColorPicker"`, `"SelectControl"` |
| `min` | Minimum value (for RangeControl) | For sliders | `-360` |
| `max` | Maximum value (for RangeControl) | For sliders | `360` |
| `unit` | CSS unit (px, deg, %, etc.) | Optional | `"deg"`, `"px"` |
| `options` | Select dropdown options | For SelectControl | `[{label, value}, ...]` |

---

## Adding a New Attribute

### Example: Add a new "Icon Spacing" slider

**Step 1: Update the schema** (`schemas/accordion.json`)

```json
"iconSpacing": {
  "type": "number",
  "default": "8px",
  "cssVar": "accordion-icon-spacing",
  "group": "icons",
  "label": "Icon Spacing",
  "description": "Space between icon and text",
  "themeable": true,
  "control": "RangeControl",
  "min": 0,
  "max": 32,
  "unit": "px"
}
```

**Step 2: Run the build**

```bash
npm run schema:build
```

This will automatically:
- Add to `control-config-generated.js` ✅
- Add to `accordion-attributes.js` ✅
- Add to `accordion-generated.css` ✅
- Add to `php/css-defaults/accordion.php` ✅
- Update TypeScript types ✅
- Update documentation ✅

**Step 3: Update the component** (e.g., `IconPanel.js`)

```javascript
<RangeControl
  label={ <CustomLabel label="Icon Spacing" attrName="iconSpacing" /> }
  value={
    typeof effectiveValues.iconSpacing === 'string'
      ? getNumericDefault( effectiveValues.iconSpacing )
      : effectiveValues.iconSpacing ?? getNumericControlDefault( blockType, 'iconSpacing' ) ?? 8
  }
  onChange={ ( value ) => handleChange( 'iconSpacing', value ) }
  min={ getControlConfig( blockType, 'iconSpacing' ).min ?? 0 }
  max={ getControlConfig( blockType, 'iconSpacing' ).max ?? 32 }
/>
```

**Step 4: Use the CSS variable in your SCSS**

```scss
.accordion-icon {
  margin-right: var(--accordion-icon-spacing);
}
```

**Step 5: Build and test**

```bash
npm run build
```

---

## Changing an Existing Attribute

### Example: Change icon rotation range from -360...360 to -180...180

**Step 1: Update the schema** (`schemas/accordion.json`)

```json
"iconRotation": {
  // ... other fields ...
  "min": -180,    // Changed from -360
  "max": 180      // Changed from 360
}
```

**Step 2: Run the build**

```bash
npm run schema:build
npm run build
```

That's it! Everything updates automatically:
- ✅ Editor slider range updates
- ✅ PHP validation updates
- ✅ TypeScript types update
- ✅ CSS variables stay in sync
- ✅ Documentation updates

---

## Key Attributes by Group

### Colors
- `titleColor` - Title text color
- `titleBackgroundColor` - Title background
- `contentColor` - Content text color
- `contentBackgroundColor` - Content background
- `borderColor` / `accordionBorderColor` - Border color
- `dividerBorderColor` - Divider between sections
- `iconColor` - Icon color
- `hoverTitleColor` - Color on hover
- `activeTitleColor` - Color when active

### Typography
- `titleFontSize` - Title text size (default: 18px)
- `titleFontWeight` - Title weight (default: 600)
- `titleFontStyle` - Italic/normal (default: normal)
- `titleTextTransform` - uppercase/lowercase (default: none)
- `titleTextDecoration` - underline/etc (default: none)
- `titleAlignment` - left/center/right (default: left)
- `contentFontSize` - Content text size (default: 16px)

### Icons
- `showIcon` - Toggle icon visibility
- `iconTypeClosed` - Icon when closed (default: ▾)
- `iconTypeOpen` - Icon when open (default: none)
- `iconRotation` - Rotation angle (default: 180deg, range: -360...360)
- `iconPosition` - left/right/extreme-left/extreme-right
- `iconColor` - Icon color
- `iconSize` - Icon size in pixels

### Borders
- `accordionBorderColor` - Border color
- `accordionBorderThickness` - Border width (0-10px)
- `accordionBorderStyle` - solid/dashed/dotted/double
- `accordionBorderRadius` - Corner radius (object with corners)
- `accordionShadow` - Box shadow

### Spacing/Layout
- `wrapperPadding` - Outer padding (default: 20px)
- `titlePadding` - Title padding (object with sides)
- `contentPadding` - Content padding (object with sides)
- `itemSpacing` - Space between items (default: 8px)

---

## Frontend vs Database vs CSS

### CSS File (Frontend - No Customization)
```css
/* accordion-generated.css */
:root {
  --accordion-icon-rotation: 180deg;
  --accordion-title-color: #333333;
}
```

**When used:** Visitor views page with no customizations
**Why:** Clean, efficient CSS variables applied globally

### Database (Backend - Customization)
```javascript
// Block attribute stored in WordPress
{
  iconRotation: 45,      // User changed this
  titleColor: "#ff0000"  // User changed this
}
```

**When used:** When user customizes a block
**Why:** Stores what the user actually set

### PHP Output (Server-Side)
```php
// php/css-defaults/accordion.php
'iconRotation' => '180deg',
'titleColor' => '#333333'
```

**When used:** Server compares user values vs defaults
**Why:** Determines if inline CSS is needed

### JS Config (Editor UI)
```javascript
// control-config-generated.js
'iconRotation': {
  min: -360,
  max: 360,
  default: '180deg'
}
```

**When used:** Editor sidebar shows controls
**Why:** Provides ranges, defaults, labels for controls

---

## Build Process

Run this whenever you update schemas:

```bash
# Regenerates all auto-generated files from schemas
npm run schema:build

# Builds webpack bundles
npm run build

# Both together
npm run schema:build && npm run build
```

### What Gets Generated
1. **control-config-generated.js** - Min/max/options for editor
2. **accordion-attributes.js** - WordPress block attributes
3. **accordion-generated.css** - CSS variables with defaults
4. **php/css-defaults/accordion.php** - PHP array of defaults
5. **validators/accordion-schema.ts** - TypeScript validation
6. **types/accordion-theme.ts** - TypeScript interfaces
7. **docs/accordion-attributes.md** - Auto-generated documentation

---

## Common Mistakes to Avoid

### ❌ DON'T
```javascript
// Don't hardcode values in components
<RangeControl
  min={ 0 }
  max={ 360 }  // Wrong! Use schema instead
/>
```

### ✅ DO
```javascript
// Use config from schema
<RangeControl
  min={ getControlConfig( blockType, 'iconRotation' ).min ?? 0 }
  max={ getControlConfig( blockType, 'iconRotation' ).max ?? 360 }
/>
```

### ❌ DON'T
```javascript
// Don't edit generated files
// shared/src/config/control-config-generated.js
// ↑ Auto-generated, changes will be lost!
```

### ✅ DO
```json
// Edit the schema instead
// schemas/accordion.json
// ↑ This is the source of truth!
```

---

## Workflow for Adding Features

1. **Plan your attribute**
   - What should it be called?
   - What type (color, slider, dropdown)?
   - What's the default?
   - What's the min/max?

2. **Add to schema**
   ```json
   "myNewAttribute": {
     "type": "string|number|boolean",
     "default": "...",
     "cssVar": "accordion-my-new-attribute",
     // ... other fields
   }
   ```

3. **Generate files**
   ```bash
   npm run schema:build
   ```

4. **Add control to component** (e.g., IconPanel.js, BorderPanel.js)
   ```javascript
   <RangeControl|SelectControl|ColorPicker
     label="My New Attribute"
     value={ ... }
     onChange={ ... }
     min={ getControlConfig(...).min }
     max={ getControlConfig(...).max }
   />
   ```

5. **Use in SCSS/CSS**
   ```scss
   .accordion {
     your-property: var(--accordion-my-new-attribute);
   }
   ```

6. **Build and test**
   ```bash
   npm run schema:build && npm run build
   ```

---

## Important Notes

- 📄 **Schema is source of truth** - Never manually edit generated files
- 🔄 **Always rebuild after schema changes** - `npm run schema:build`
- 📦 **Three block types** - Changes to one schema don't affect others
- 🔗 **Linked together** - CSS variable name, attribute name, and labels all come from schema
- ✅ **TypeScript validation** - Invalid schema will fail the build
- 📚 **Auto-documented** - docs/accordion-attributes.md updates automatically

---

## File Structure

```
guttemberg-plus/
├── schemas/                          (SOURCE OF TRUTH)
│   ├── accordion.json
│   ├── tabs.json
│   └── toc.json
│
├── build-tools/
│   └── schema-compiler.js           (Generates from schemas)
│
├── shared/src/
│   ├── config/
│   │   ├── control-config-generated.js     (AUTO-GENERATED)
│   │   └── css-var-mappings-generated.js   (AUTO-GENERATED)
│   ├── components/
│   │   ├── IconPanel.js             (Uses getControlConfig)
│   │   ├── BorderPanel.js           (Uses getControlConfig)
│   │   └── ...
│   ├── types/
│   │   └── accordion-theme.ts       (AUTO-GENERATED)
│   └── validators/
│       └── accordion-schema.ts      (AUTO-GENERATED)
│
├── blocks/accordion/src/
│   └── accordion-attributes.js      (AUTO-GENERATED)
│
├── assets/css/
│   ├── accordion-generated.css      (AUTO-GENERATED)
│   ├── tabs-generated.css           (AUTO-GENERATED)
│   └── toc-generated.css            (AUTO-GENERATED)
│
├── php/css-defaults/
│   ├── accordion.php                (AUTO-GENERATED)
│   ├── tabs.php                     (AUTO-GENERATED)
│   ├── toc.php                      (AUTO-GENERATED)
│   └── css-mappings-generated.php   (AUTO-GENERATED)
│
└── docs/
    ├── accordion-attributes.md      (AUTO-GENERATED)
    ├── tabs-attributes.md           (AUTO-GENERATED)
    └── toc-attributes.md            (AUTO-GENERATED)
```

**Legend:**
- 📄 (SOURCE OF TRUTH) = Edit this
- 🔄 (AUTO-GENERATED) = Don't edit, will be overwritten

---

## Summary

**The Golden Rule:** If you need to add, change, or remove a variable:

1. **Edit the schema file** (schemas/*.json)
2. **Run `npm run schema:build`**
3. **Everything else updates automatically**

Don't manually edit generated files. The schema is your only source of truth.
