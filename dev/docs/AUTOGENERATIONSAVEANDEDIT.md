# AUTO-GENERATION GUIDE: save.js and edit.js

## Overview

This document explains the **hybrid auto-generation strategy** used in `save.js` and `edit.js` for the accordion block. These files combine **auto-generated code** (managed by the schema build process) with **manual code** that handles complex logic not suitable for code generation.

## Hybrid Strategy

### What is Auto-Generated

The schema build process (`npm run schema:build`) automatically generates and updates code between `AUTO-GENERATED` markers. This includes:

- **Style computation logic** in `edit.js` (`getInlineStyles` function)
- **Title rendering logic** in both files (`renderTitle` function)
- **Block content JSX structure** in both files (the main render output)

### What is Manual

Code **outside** the AUTO-GENERATED markers is manually maintained and includes:

- **Icon rendering logic** (`renderSingleIcon`, `renderIcon` functions)
- **Utility functions** (validation, formatting, helpers)
- **Import statements** and module dependencies
- **Custom hooks** and state management
- **Complex conditional logic** that varies by context

## Why This Hybrid Approach?

### Auto-Generation Benefits

1. **Single Source of Truth**: Schema changes automatically propagate to implementation
2. **Consistency**: Generated code follows exact patterns across all blocks
3. **Reduced Errors**: Eliminates manual copy-paste mistakes
4. **Faster Updates**: Schema changes update dozens of files instantly

### Manual Code Benefits

1. **Context-Aware Logic**: Icon rendering differs between editor and frontend
2. **Flexibility**: Complex conditionals that can't be templated
3. **Maintainability**: Logic that needs human review and testing
4. **Integration**: Code that depends on external utilities and hooks

## File Structure

### save.js

```javascript
// Imports (MANUAL)
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { getAllEffectiveValues, getAccordionButtonAria } from '@shared';
import * as LucideIcons from 'lucide-react';

/**
 * MANUAL DEPENDENCY: Icon rendering uses @shared/utils/icon-renderer.js
 * If you add new icon types or libraries, update the shared utility manually.
 * See: docs/AUTOGENERATIONSAVEANDEDIT.md for details.
 */

// Manual helper functions (MANUAL)
const renderSingleIcon = (source, state) => { /* ... */ };
const renderIcon = () => { /* ... */ };

/* ========== AUTO-GENERATED-RENDER-TITLE-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
const renderTitle = () => {
  // Generated title rendering logic
};
/* ========== AUTO-GENERATED-RENDER-TITLE-END ========== */

// Main component (PARTIALLY AUTO-GENERATED)
export default function Save({ attributes }) {
  // Manual setup code
  const effectiveValues = getAllEffectiveValues(attributes);

  /* ========== AUTO-GENERATED-BLOCK-CONTENT-START ========== */
  // DO NOT EDIT - This code is auto-generated from schema
  return (
    <div {...blockProps}>
      {renderTitle()}
      <div className="accordion-content">
        <InnerBlocks.Content />
      </div>
    </div>
  );
  /* ========== AUTO-GENERATED-BLOCK-CONTENT-END ========== */
}
```

### edit.js

```javascript
// Imports (MANUAL)
import { useBlockProps, InspectorControls, RichText, InnerBlocks } from '@wordpress/block-editor';
import { useThemeManager, useBlockAlignment, useResponsiveDevice } from '@shared';
import * as LucideIcons from 'lucide-react';

/**
 * MANUAL DEPENDENCY: Icon rendering uses @shared/utils/icon-renderer.js
 * If you add new icon types or libraries, update the shared utility manually.
 * See: docs/AUTOGENERATIONSAVEANDEDIT.md for details.
 */

// Manual helper functions (MANUAL)
const renderSingleIcon = (source, state) => { /* ... */ };
const renderIcon = () => { /* ... */ };

/* ========== AUTO-GENERATED-STYLES-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
const getInlineStyles = (responsiveDevice = 'global') => {
  // Generated style computation logic
};
/* ========== AUTO-GENERATED-STYLES-END ========== */

/* ========== AUTO-GENERATED-RENDER-TITLE-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
const renderTitle = () => {
  // Generated title rendering logic
};
/* ========== AUTO-GENERATED-RENDER-TITLE-END ========== */

// Main component (PARTIALLY AUTO-GENERATED)
export default function Edit({ attributes, setAttributes, clientId }) {
  // Manual hooks and state
  const effectiveValues = attributes;
  const responsiveDevice = useResponsiveDevice();

  /* ========== AUTO-GENERATED-BLOCK-CONTENT-START ========== */
  // DO NOT EDIT - This code is auto-generated from schema
  return (
    <>
      <InspectorControls>{/* ... */}</InspectorControls>
      <div {...blockProps}>
        {renderTitle()}
        <div className="accordion-content">
          <InnerBlocks />
        </div>
      </div>
    </>
  );
  /* ========== AUTO-GENERATED-BLOCK-CONTENT-END ========== */
}
```

## AUTO-GENERATED Marker Format

All auto-generated sections use this exact format:

```javascript
/* ========== AUTO-GENERATED-[SECTION-NAME]-START ========== */
// DO NOT EDIT - This code is auto-generated from schema
// AUTO-GENERATED from schemas/accordion.json
// To modify, update the schema and run: npm run schema:build

[generated code]

/* ========== AUTO-GENERATED-[SECTION-NAME]-END ========== */
```

### Current Sections

| Section Name | File | Lines | Purpose |
|-------------|------|-------|---------|
| `STYLES` | edit.js | ~130-161 | Inline style computation logic |
| `RENDER-TITLE` | save.js | ~200-300 | Title rendering with heading wrapper |
| `RENDER-TITLE` | edit.js | ~342-465 | Title rendering with RichText editor |
| `BLOCK-CONTENT` | save.js | ~337-355 | Main block JSX structure |
| `BLOCK-CONTENT` | edit.js | ~635-656 | Main editor JSX structure |

## Workflow

### Making Schema Changes

1. **Edit the schema**: `schemas/accordion.json`
2. **Run the build**: `npm run schema:build`
3. **Review changes**: Check all AUTO-GENERATED sections in save.js and edit.js
4. **Test thoroughly**: Both editor and frontend rendering

### Making Manual Changes

1. **Identify the section**: Check if it's inside AUTO-GENERATED markers
2. **If inside markers**: Edit the schema instead, then rebuild
3. **If outside markers**: Edit directly in save.js or edit.js
4. **Document dependencies**: Add comments for future maintainers

## Manual Dependencies

### Icon Rendering

Icon rendering logic is **intentionally manual** because it:

1. **Differs by context**: Editor uses controls, frontend is static
2. **Depends on external libraries**: Dashicons, Lucide, custom icons
3. **Handles edge cases**: Missing icons, fallbacks, accessibility
4. **Integrates with CSS**: Visibility controlled by `.is-open` class

**Location**: `renderSingleIcon()` and `renderIcon()` functions in both files

**Shared dependency**: `@shared/utils/icon-renderer.js` (when it exists)

**Update when**:
- Adding new icon types (beyond char/image/library)
- Adding new icon libraries (beyond dashicons/lucide)
- Changing icon structure or data format

## Common Pitfalls

### ❌ DON'T: Edit code inside AUTO-GENERATED markers

```javascript
/* ========== AUTO-GENERATED-RENDER-TITLE-START ========== */
const renderTitle = () => {
  const headingLevel = 'h2'; // ❌ This will be overwritten!
  // ...
};
/* ========== AUTO-GENERATED-RENDER-TITLE-END ========== */
```

**Why**: Next schema build will overwrite your changes.

**Fix**: Edit the schema, then rebuild.

### ❌ DON'T: Remove or rename markers

```javascript
/* ========== AUTO-GENERATED-TITLE-START ========== */ // ❌ Wrong name!
```

**Why**: Build script won't find the section to update.

**Fix**: Use exact marker names from this document.

### ❌ DON'T: Forget to rebuild after schema changes

**Why**: Code and schema will be out of sync.

**Fix**: Always run `npm run schema:build` after editing schemas.

### ✅ DO: Add new manual functions outside markers

```javascript
// ✅ Manual helper function
const validateInput = (value) => {
  // Custom validation logic
};

/* ========== AUTO-GENERATED-RENDER-TITLE-START ========== */
// Generated code uses validateInput()
/* ========== AUTO-GENERATED-RENDER-TITLE-END ========== */
```

### ✅ DO: Document manual dependencies

```javascript
/**
 * MANUAL DEPENDENCY: Icon rendering uses @shared/utils/icon-renderer.js
 * If you add new icon types or libraries, update the shared utility manually.
 * See: docs/AUTOGENERATIONSAVEANDEDIT.md for details.
 */
```

## Testing Strategy

After schema changes and rebuild:

1. **Visual regression**: Check editor and frontend rendering
2. **Responsive testing**: Test all breakpoints (global/tablet/mobile)
3. **Theme switching**: Verify cascade resolution works
4. **Icon functionality**: Test all icon types and positions
5. **Accessibility**: Verify ARIA attributes and keyboard navigation

## Migration Path

### Current State (January 2026)

- Icon rendering is **fully manual** in both save.js and edit.js
- No shared icon renderer utility exists yet
- Each file implements its own `renderSingleIcon()` and `renderIcon()`

### Future Enhancement

When creating `@shared/utils/icon-renderer.js`:

1. Extract common icon logic to shared utility
2. Keep context-specific logic in each file
3. Update MANUAL DEPENDENCY comments to reference new utility
4. Maintain backward compatibility with existing blocks

## Troubleshooting

### Problem: Schema changes don't appear

**Check**:
1. Did you run `npm run schema:build`?
2. Are the AUTO-GENERATED markers present and correctly formatted?
3. Did the build script report any errors?

### Problem: Code is overwritten after build

**Cause**: You edited code inside AUTO-GENERATED markers.

**Solution**:
1. Restore manual changes from version control
2. Move logic outside markers OR update schema
3. Rebuild

### Problem: Markers are missing

**Solution**:
1. Check this document for exact marker locations
2. Manually add markers around the sections
3. Run build to populate content

## Related Documentation

- `docs/AUTOGENERATION.md` - Overall auto-generation architecture
- `docs/SCHEMA-DEFINITION.md` - Schema format and conventions
- `docs/CSS-VARS-GENERATION.md` - CSS variable generation process
- `schemas/accordion.json` - Accordion block schema

## Maintenance

This document should be updated when:

- Adding new AUTO-GENERATED sections
- Changing marker naming conventions
- Modifying the build process
- Creating shared utilities for manual code

---

**Last Updated**: 2026-01-05
**Version**: 1.0.0
**Related PR**: [Link when applicable]
