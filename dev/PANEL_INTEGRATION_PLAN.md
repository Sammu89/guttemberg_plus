# Plan: Integrate Sidebar Panels with Generated CSS Variables

## Problem Analysis

### Current State
1. **Schema System**: Defines high-level attributes (e.g., `titleColor`, `blockBox`, `headerBox`) with types like `color-panel`, `box-panel`, `typography-panel`
2. **CSS Variable Mappings**: `css-var-mappings-generated.js` maps attributes to CSS variable prefixes (e.g., `titleColor` → `--accordion-title`)
3. **Comprehensive SCSS**: `css/generated/accordion_variables.scss` defines granular CSS variables (e.g., `--accordion-title-padding-top`, `--accordion-icon-color`)
4. **Editor CSS Vars**: `accordion-css-vars-generated.js` expands panel types into CSS variables for editor preview
5. **Sidebar Panels**: `SchemaPanels.js` renders controls based on schema, but changes don't update the comprehensive CSS variables

### Issues Identified
1. **SCSS Inconsistency**: Lines 53-69 in `accordion_variables.scss` are missing `--` prefix:
   - ❌ `accordion-animation-duration: 250ms;`
   - ✅ Should be: `--accordion-animation-duration: 250ms;`

2. **Disconnect**: Sidebar panels update block attributes, but those changes don't flow through to the comprehensive CSS variables in the editor preview

3. **Not Block-Agnostic**: Panels need to work across all blocks (accordion, tabs, toc) without hardcoding block-specific logic

## Solution Architecture

### Phase 1: Fix SCSS Generation (Comprehensive Parser)
**Files to Update:**
- `schemas/parser/scss-generator.js`

**Changes:**
1. Ensure ALL CSS variables in `:root` have `--` prefix
2. Review variable naming consistency
3. Ensure proper fallback chains for responsive/state variants

**Output:**
```scss
:root {
  --accordion-animation-duration: 250ms;  /* ✅ Fixed */
  --accordion-content-background: #ffffff; /* ✅ Fixed */
  --accordion-title-color: #333333;       /* ✅ Fixed */
}
```

### Phase 2: Create CSS Variable Registry
**New File:** `shared/src/config/css-var-registry.js`

**Purpose:** Central registry that maps schema attributes to comprehensive CSS variables

**Structure:**
```javascript
export const CSS_VAR_REGISTRY = {
  accordion: {
    // Panel-type attributes expanded to individual CSS vars
    titleColor: {
      type: 'color-panel',
      baseVar: '--accordion-title',
      cssVars: {
        text: '--accordion-title-color',
        background: '--accordion-title-background',
        'hover.text': '--accordion-title-color-hover',
        'hover.background': '--accordion-title-background-hover',
      },
      states: ['base', 'hover'],
      responsive: false,
    },
    headerBox: {
      type: 'box-panel',
      baseVar: '--accordion-title',
      cssVars: {
        'padding.top': '--accordion-title-padding-top',
        'padding.right': '--accordion-title-padding-right',
        'padding.bottom': '--accordion-title-padding-bottom',
        'padding.left': '--accordion-title-padding-left',
      },
      responsive: true,
      fields: ['padding'], // Only padding field active
    },
    iconInactiveColor: {
      type: 'string',
      baseVar: '--accordion-icon-color',
      cssVars: {
        base: '--accordion-icon-color',
      },
      responsive: false,
    },
    // ... all attributes
  },
  tabs: { /* ... */ },
  toc: { /* ... */ },
};
```

**Key Features:**
- Maps each schema attribute to its actual CSS variables
- Handles panel types (color-panel, box-panel, typography-panel)
- Handles nested paths (e.g., `hover.text`, `padding.top`)
- Indicates responsive capabilities
- Block-agnostic structure

### Phase 3: Generate CSS Variable Registry
**Update:** `build-tools/schema-compiler.js`

**New Generator Function:**
```javascript
function generateCssVarRegistry(schemas) {
  // For each block type
  // For each attribute
  // Expand panel types to individual CSS vars
  // Map nested paths to CSS variable names
  // Output: shared/src/config/css-var-registry.js
}
```

**Generation Logic:**
1. Read schema attributes
2. For panel types (color-panel, box-panel, etc.):
   - Expand to individual fields
   - Map each field to its CSS variable name
3. For simple types (string, number):
   - Direct mapping to CSS variable
4. Handle states (base, hover, is-open)
5. Handle responsive variants (desktop, tablet, mobile)

### Phase 4: Create CSS Variable Updater
**New File:** `shared/src/utils/css-var-updater.js`

**Purpose:** Convert attribute changes to CSS variable updates

**Functions:**
```javascript
/**
 * Convert block attribute value to CSS variable assignments
 * @param {string} attrName - Attribute name (e.g., 'titleColor')
 * @param {*} value - Attribute value
 * @param {string} blockType - Block type (accordion, tabs, toc)
 * @param {string} device - Current device (desktop, tablet, mobile)
 * @returns {Object} Map of CSS var names to values
 */
export function attributeToCssVars(attrName, value, blockType, device = 'desktop') {
  const registry = CSS_VAR_REGISTRY[blockType]?.[attrName];
  if (!registry) return {};

  const cssVars = {};

  // Handle panel types
  if (registry.type === 'color-panel') {
    return expandColorPanel(value, registry, device);
  }
  if (registry.type === 'box-panel') {
    return expandBoxPanel(value, registry, device);
  }
  if (registry.type === 'typography-panel') {
    return expandTypographyPanel(value, registry, device);
  }

  // Handle simple types
  const varName = registry.responsive
    ? `${registry.baseVar}${device === 'desktop' ? '' : `-${device}`}`
    : registry.baseVar;

  cssVars[varName] = formatValue(value, registry);
  return cssVars;
}

/**
 * Expand color-panel to CSS variables
 */
function expandColorPanel(value, registry, device) {
  const cssVars = {};

  // Base state
  if (value.text) {
    cssVars[registry.cssVars.text] = value.text;
  }
  if (value.background) {
    cssVars[registry.cssVars.background] = value.background;
  }

  // Hover state
  if (value.hover?.text) {
    cssVars[registry.cssVars['hover.text']] = value.hover.text;
  }
  if (value.hover?.background) {
    cssVars[registry.cssVars['hover.background']] = value.hover.background;
  }

  return cssVars;
}

/**
 * Expand box-panel to CSS variables
 */
function expandBoxPanel(value, registry, device) {
  const cssVars = {};

  // Padding
  if (value.padding) {
    const suffix = device === 'desktop' ? '' : `-${device}`;
    const unit = value.padding.unit || 'px';

    ['top', 'right', 'bottom', 'left'].forEach(side => {
      if (value.padding[side] !== undefined) {
        const varName = `${registry.cssVars[`padding.${side}`]}${suffix}`;
        cssVars[varName] = `${value.padding[side]}${unit}`;
      }
    });
  }

  // Border, margin, radius, shadow...
  // (Similar logic for other fields)

  return cssVars;
}

/**
 * Expand typography-panel to CSS variables
 */
function expandTypographyPanel(value, registry, device) {
  const cssVars = {};

  if (value.fontFamily) {
    cssVars[registry.cssVars.fontFamily] = value.fontFamily;
  }
  if (value.fontSize) {
    const suffix = device === 'desktop' ? '' : `-${device}`;
    cssVars[`${registry.cssVars.fontSize}${suffix}`] = value.fontSize;
  }
  if (value.lineHeight) {
    cssVars[registry.cssVars.lineHeight] = value.lineHeight;
  }

  return cssVars;
}
```

### Phase 5: Update Editor CSS Vars Builder
**Update:** `shared/src/styles/accordion-css-vars-generated.js`

**Current:** `buildEditorCssVars(effectiveValues)` manually expands panel types

**New:** Use CSS Variable Updater
```javascript
import { attributeToCssVars } from '@shared/utils/css-var-updater';

export function buildEditorCssVars(effectiveValues, device = 'desktop') {
  const styles = {};
  const blockType = 'accordion'; // Could be passed as parameter

  Object.entries(effectiveValues).forEach(([attrName, value]) => {
    if (value === null || value === undefined) return;

    // Convert attribute to CSS variables
    const cssVars = attributeToCssVars(attrName, value, blockType, device);

    // Merge into styles
    Object.assign(styles, cssVars);
  });

  return styles;
}
```

### Phase 6: Update Panel Rendering (Make Block-Agnostic)
**Update:** `shared/src/components/SchemaPanels.js`

**Current:** Panels render controls but don't know about CSS variables

**New:** Pass CSS variable metadata to controls
```javascript
import { CSS_VAR_REGISTRY } from '@shared/config/css-var-registry';

export function SchemaPanels({
  schema,
  attributes,
  setAttributes,
  effectiveValues,
  blockType, // ⚡ NEW: Pass block type
  // ... other props
}) {
  // When rendering controls, pass CSS variable metadata
  return (
    <>
      {sortedGroups.map((groupConfig) => {
        // Get CSS var metadata for this group's attributes
        const groupAttrs = getGroupAttributes(groupConfig.id, schema);
        const cssVarMetadata = groupAttrs.map(attrName => ({
          attrName,
          registry: CSS_VAR_REGISTRY[blockType]?.[attrName],
        }));

        return (
          <GenericPanel
            {...props}
            blockType={blockType}
            cssVarMetadata={cssVarMetadata}
          />
        );
      })}
    </>
  );
}
```

### Phase 7: Update Control Renderer
**Update:** `shared/src/components/ControlRenderer.js`

**Purpose:** Make controls aware of CSS variables they control

**Enhancement:**
```javascript
export function ControlRenderer({
  attrName,
  attribute,
  value,
  onChange,
  blockType,
  // ... other props
}) {
  // Get CSS variable metadata
  const registry = CSS_VAR_REGISTRY[blockType]?.[attrName];

  // Show tooltip or label with CSS variable names
  const cssVarNames = registry ? Object.values(registry.cssVars) : [];

  return (
    <div className="control-wrapper">
      {/* Show which CSS vars this control affects */}
      {cssVarNames.length > 0 && (
        <div className="control-css-vars" title={cssVarNames.join(', ')}>
          Controls: {cssVarNames.join(', ')}
        </div>
      )}

      {/* Render actual control */}
      {renderControl(attribute, value, onChange)}
    </div>
  );
}
```

### Phase 8: Live Preview Integration
**Update:** Block edit.js files (e.g., `blocks/accordion/src/edit.js`)

**Current:** Uses `buildEditorCssVars()` but may not trigger on all changes

**Enhancement:**
```javascript
// In edit component
const [responsiveDevice] = useResponsiveDevice();

// Build CSS vars from effective values
const editorCssVars = useMemo(() => {
  return buildEditorCssVars(effectiveValues, responsiveDevice);
}, [effectiveValues, responsiveDevice]);

// Apply to block wrapper
<div
  className="gutplus-accordion"
  style={editorCssVars}
  data-gutplus-device={responsiveDevice}
>
```

## Implementation Steps

### Step 1: Fix SCSS Generator ✅
- [ ] Update `schemas/parser/scss-generator.js`
- [ ] Add `--` prefix to all variables in `:root`
- [ ] Regenerate `css/generated/accordion_variables.scss`
- [ ] Verify all variables have consistent naming

### Step 2: Generate CSS Variable Registry 🔧
- [ ] Add registry generator to `build-tools/schema-compiler.js`
- [ ] Create expansion logic for panel types
- [ ] Handle states and responsive variants
- [ ] Generate `shared/src/config/css-var-registry.js`
- [ ] Test registry structure

### Step 3: Create CSS Variable Updater 🆕
- [ ] Create `shared/src/utils/css-var-updater.js`
- [ ] Implement `attributeToCssVars()` function
- [ ] Implement panel type expanders (color, box, typography)
- [ ] Handle responsive variants
- [ ] Handle state variants (hover, is-open)
- [ ] Add unit tests

### Step 4: Update Editor CSS Vars Builder 🔄
- [ ] Update `shared/src/styles/accordion-css-vars-generated.js`
- [ ] Use CSS Variable Updater instead of manual expansion
- [ ] Make it block-agnostic (accept blockType parameter)
- [ ] Replicate for tabs and toc blocks

### Step 5: Update Sidebar Panels 🎨
- [ ] Update `SchemaPanels.js` to pass blockType
- [ ] Pass CSS variable metadata to child components
- [ ] Update `GenericPanel.js` to receive metadata
- [ ] Update `SubgroupPanel.js` to receive metadata

### Step 6: Update Control Renderer 🎛️
- [ ] Update `ControlRenderer.js` to receive blockType
- [ ] Access CSS variable registry
- [ ] Optionally display controlled CSS variables (dev mode)

### Step 7: Test Integration 🧪
- [ ] Test color-panel controls update CSS variables
- [ ] Test box-panel controls update CSS variables
- [ ] Test typography-panel controls update CSS variables
- [ ] Test responsive variants work correctly
- [ ] Test state variants (hover) work correctly
- [ ] Test theme switching preserves CSS variables
- [ ] Test across all three blocks (accordion, tabs, toc)

### Step 8: Update Documentation 📚
- [ ] Update CLAUDE.md with new architecture
- [ ] Document CSS variable registry structure
- [ ] Document CSS variable updater usage
- [ ] Add examples for adding new panel types

## Key Benefits

### 1. Block-Agnostic
- Panels work across all blocks without hardcoding
- Registry structure is uniform
- Easy to add new blocks

### 2. Single Source of Truth
- CSS variables defined once in comprehensive schema
- Registry generated automatically
- No manual synchronization needed

### 3. Type-Safe
- Registry provides type information
- Controls know what they're updating
- Validation possible at compile time

### 4. Developer Experience
- Easy to see which CSS variables a control affects
- Clear mapping from schema to CSS
- Debugging is straightforward

### 5. Performance
- Only changed variables updated
- Efficient CSS variable updates
- No unnecessary re-renders

## Testing Checklist

### Visual Testing
- [ ] Open accordion block in editor
- [ ] Change title color → See immediate preview update
- [ ] Change padding → See immediate preview update
- [ ] Change border → See immediate preview update
- [ ] Switch responsive device → See device-specific values
- [ ] Apply theme → See all theme values applied
- [ ] Customize over theme → See overrides work
- [ ] Switch theme → See customizations preserved

### Technical Testing
- [ ] Inspect element → Verify CSS variables present
- [ ] Check computed styles → Verify values correct
- [ ] Console log CSS vars object → Verify structure
- [ ] Test with all three blocks (accordion, tabs, toc)
- [ ] Test theme save → Verify deltas calculated correctly
- [ ] Test frontend render → Verify CSS variables output

## Success Criteria

✅ Sidebar panels update CSS variables in real-time
✅ Changes visible immediately in editor preview
✅ Panels work across all blocks without modifications
✅ No hardcoded block-specific logic
✅ SCSS variables all have consistent naming
✅ Registry auto-generated from schema
✅ Zero manual synchronization needed
✅ Type-safe and well-documented

## Risks & Mitigation

### Risk 1: Breaking Changes
**Risk:** Changing CSS variable structure might break existing themes
**Mitigation:**
- Add migration script for saved themes
- Version the CSS variable format
- Test with existing theme data

### Risk 2: Performance
**Risk:** Computing CSS variables on every render might be slow
**Mitigation:**
- Use useMemo for CSS variable computation
- Only recompute when effectiveValues change
- Profile performance before/after

### Risk 3: Complexity
**Risk:** Registry structure might become too complex
**Mitigation:**
- Keep registry structure simple and flat
- Document with examples
- Provide helper functions

## Future Enhancements

### Phase 9: Developer Tools
- [ ] Add dev mode to show CSS variable names in UI
- [ ] Add CSS variable inspector panel
- [ ] Add CSS variable playground

### Phase 10: Validation
- [ ] Validate CSS variable values before applying
- [ ] Show warnings for invalid values
- [ ] Provide value constraints in registry

### Phase 11: Optimization
- [ ] Lazy load registry per block type
- [ ] Cache CSS variable computations
- [ ] Optimize for large blocks with many variables

---

**Next Action:** Begin with Step 1 (Fix SCSS Generator) and proceed sequentially through the implementation steps.
