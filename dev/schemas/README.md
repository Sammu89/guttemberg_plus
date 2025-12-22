# Guttemberg Plus Schema System

This directory contains the **Single Source of Truth** schema definitions for all block types in the Guttemberg Plus plugin. These JSON schema files define every attribute, its type, default value, CSS variable mapping, and theming behavior.

## Overview

The schema system provides:

1. **Centralized Configuration**: All attribute definitions in one place
2. **Code Generation**: Automatically generates TypeScript types, PHP arrays, CSS variables, and documentation
3. **Validation**: Ensures schema consistency before compilation
4. **Documentation**: Auto-generates Markdown docs for each block

## Schema Files

| File | Block | Description |
|------|-------|-------------|
| `accordion.json` | Accordion | Collapsible content sections |
| `tabs.json` | Tabs | Tabbed content navigation |
| `toc.json` | Table of Contents | Auto-generated navigation from headings |

## Schema Structure

Each schema file follows this structure:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Block Name Theme Configuration",
  "version": "1.0.0",
  "description": "Description of the block",
  "blockType": "block-type",
  "blockName": "Block Name",

  "groups": {
    "colors": {
      "title": "Colors",
      "description": "Group description"
    },
    // ... more groups
  },

  "attributes": {
    "attributeName": {
      // ... attribute definition
    }
  }
}
```

## Attribute Definition

### Required Fields

Every attribute MUST have these fields:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Data type: `string`, `number`, `boolean`, `array`, `object` |
| `default` | any | Default value (can be `null` for optional attributes) |
| `group` | string | Category: `colors`, `typography`, `borders`, `layout`, `icons`, `behavior` |
| `label` | string | Human-readable label for UI |
| `description` | string | Explanation of what this attribute does |
| `themeable` | boolean | Whether this attribute can be saved in themes |

### Themeable Attributes

Attributes with `"themeable": true` can be saved in themes and require:

| Field | Type | Description |
|-------|------|-------------|
| `cssVar` | string | CSS variable name (without `--` prefix) |
| `cssDefault` | string | Complete CSS declaration (e.g., `--accordion-title-color: #333333;`) |
| `control` | string | UI control type (recommended) |

Example:
```json
"titleColor": {
  "type": "string",
  "default": "#333333",
  "cssVar": "accordion-title-color",
  "cssDefault": "--accordion-title-color: #333333;",
  "group": "colors",
  "label": "Title Color",
  "description": "Text color for the accordion title",
  "themeable": true,
  "control": "ColorPicker"
}
```

### Non-Themeable Attributes

Attributes with `"themeable": false` are structural/behavioral and require:

| Field | Type | Description |
|-------|------|-------------|
| `reason` | string | Why not themeable: `structural`, `content`, `behavioral` |

Example:
```json
"accordionId": {
  "type": "string",
  "default": "",
  "group": "behavior",
  "label": "Accordion ID",
  "description": "Unique identifier for the accordion block",
  "themeable": false,
  "reason": "structural"
}
```

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `control` | string | UI control type: `ColorPicker`, `RangeControl`, `SelectControl`, `TextControl`, `ToggleControl`, etc. |
| `options` | array | Valid values for SelectControl |
| `min` | number | Minimum value for RangeControl |
| `max` | number | Maximum value for RangeControl |
| `step` | number | Step increment for RangeControl |
| `unit` | string | CSS unit: `px`, `em`, `deg`, etc. |

## Groups

Attributes are organized into groups for UI organization:

| Group | Purpose |
|-------|---------|
| `colors` | Text and background colors |
| `typography` | Font settings (size, weight, style, etc.) |
| `borders` | Border styles, widths, radius, shadows |
| `layout` | Spacing, padding, sizing, alignment |
| `icons` | Icon appearance and behavior |
| `behavior` | Non-themeable settings (structural, content, behavioral) |

## Build Commands

### Validate Schemas

Check schemas for errors before compilation:

```bash
npm run schema:validate
```

This validates:
- JSON syntax
- Required fields
- Field value types
- Themeable attribute requirements
- Non-themeable reason field
- Cross-references (groups, etc.)

### Build Generated Files

Generate all downstream artifacts:

```bash
npm run schema:build
```

This generates:
- TypeScript types (`shared/src/types/`)
- Zod validators (`shared/src/validators/`)
- PHP CSS defaults (`php/css-defaults/`)
- JS exclusion lists (`shared/src/config/`)
- CSS variables (`assets/css/`)
- Markdown docs (`docs/`)

### Automatic Build

Schemas are automatically compiled when running:

```bash
npm run build    # Compiles schemas then builds plugin
npm run start    # Compiles schemas then starts dev server
```

## Generated Files

After running `schema:build`, these files are generated:

```
shared/src/types/
  ├── accordion-theme.ts    # TypeScript interfaces and defaults
  ├── tabs-theme.ts
  └── toc-theme.ts

shared/src/validators/
  ├── accordion-schema.ts   # Zod validation schemas
  ├── tabs-schema.ts
  └── toc-schema.ts

shared/src/config/
  ├── accordion-exclusions.js  # Non-themeable attribute lists
  ├── tabs-exclusions.js
  ├── toc-exclusions.js
  └── theme-exclusions-generated.js  # Combined exports

php/css-defaults/
  ├── accordion.php         # PHP CSS default arrays
  ├── tabs.php
  ├── toc.php
  └── css-mappings-generated.php  # CSS variable mappings

assets/css/
  ├── accordion-generated.css  # CSS variable declarations
  ├── tabs-generated.css
  └── toc-generated.css

docs/
  ├── accordion-attributes.md  # Markdown documentation
  ├── tabs-attributes.md
  └── toc-attributes.md
```

## Adding New Attributes

1. **Choose the right block schema** (`accordion.json`, `tabs.json`, or `toc.json`)

2. **Add the attribute definition** with all required fields:

```json
"newAttribute": {
  "type": "string",
  "default": "default-value",
  "group": "typography",
  "label": "New Attribute",
  "description": "What this attribute does",
  "themeable": true,
  "cssVar": "block-new-attribute",
  "cssDefault": "--block-new-attribute: default-value;",
  "control": "TextControl"
}
```

3. **Validate the schema**:
```bash
npm run schema:validate
```

4. **Rebuild generated files**:
```bash
npm run schema:build
```

5. **Update block code** to use the new attribute (not auto-generated)

## Modifying Existing Attributes

1. Find the attribute in the appropriate schema file
2. Make your changes (update default, cssDefault, etc.)
3. Run validation and build
4. Test that existing themes still work correctly

**Important**: Changing `default` values will affect new blocks but not existing ones. Changing `cssVar` will break existing themes that use this attribute.

## Best Practices

### Naming Conventions

- **Attribute names**: camelCase (e.g., `titleBackgroundColor`)
- **CSS variables**: kebab-case with block prefix (e.g., `accordion-title-bg`)
- **Groups**: lowercase (e.g., `colors`, `typography`)

### Default Values

- Use `null` for truly optional values (no CSS output)
- Use empty string `""` for optional string values that have CSS output
- Use explicit values for attributes that should always have a value

### CSS Variables

- Always include the block prefix in `cssVar` (e.g., `accordion-title-color`)
- The `cssDefault` should be a complete CSS declaration including semicolon
- For `null` defaults, use empty string `""` for `cssDefault`

### Documentation

- Write clear descriptions for each attribute
- Use consistent terminology across blocks
- Document any special behavior or constraints

## Troubleshooting

### Validation Errors

**"Missing required field"**: Add the missing field to the attribute definition.

**"Type mismatch"**: Ensure `default` value type matches `type` field.

**"Invalid cssVar format"**: Use lowercase kebab-case without `--` prefix.

### Build Errors

**"Schema file not found"**: Ensure the schema file exists in `schemas/` directory.

**"Failed to parse"**: Check JSON syntax (use a JSON validator).

### Runtime Issues

**CSS not applying**: Check that `cssVar` matches what's used in block CSS.

**Theme not saving**: Ensure attribute has `"themeable": true`.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    schemas/*.json                               │
│                  (Single Source of Truth)                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              build-tools/schema-compiler.js                     │
│                   (Code Generator)                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ TypeScript   │ │   PHP    │ │   CSS    │ │   Docs   │
│   Types      │ │ Defaults │ │Variables │ │ Markdown │
└──────────────┘ └──────────┘ └──────────┘ └──────────┘
```

## Related Files

- `build-tools/schema-compiler.js` - Code generation logic
- `build-tools/schema-validator.js` - Validation logic
- `php/theme-css-generator.php` - PHP CSS generation (uses mappings)
- `shared/src/config/theme-exclusions.js` - Original exclusions (will be replaced by generated)
