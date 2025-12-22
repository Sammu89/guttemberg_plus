# Border Refactoring Summary - Quick Reference

## Overview

This document provides a quick summary of the border refactoring plan for standardizing border handling across all three blocks (Accordion, Tabs, TOC).

For full details, see: `border-refactoring-plan.md`

---

## The Problem

Each block currently uses different naming conventions for borders:

- **Accordion:** `accordionBorder*` + `dividerBorder*` in groups `border` + `border-divider`
- **Tabs:** `tabButtonBorder*` + `panelBorder*` + `dividerLine*` in groups `titleBorders` + `content` + `divider`
- **TOC:** `wrapperBorder*` in group `border`

All blocks use `BorderPanel` (being replaced with `GenericPanel`)

---

## The Solution

### Standard Group Names
- `blockBorders` - Main wrapper/container borders (all blocks)
- `elementBorders` - Interactive elements like headers/buttons (accordion, tabs)
- `contentBorders` - Content area borders (tabs only)
- `dividerBorders` - Divider lines (accordion, tabs)

### Standard Attribute Pattern
`[element][BorderProperty]`

Examples:
- `blockBorderColor`, `blockBorderWidth`, `blockBorderStyle`, `blockBorderRadius`
- `buttonBorderColor`, `buttonBorderWidth` (tabs)
- `headerBorderColor`, `headerBorderWidth` (accordion)
- `contentBorderColor`, `contentBorderWidth` (tabs)
- `dividerBorderColor`, `dividerBorderWidth`, `dividerBorderStyle`

### Standard CSS Variable Pattern
`--{BLOCKNAME}-border-{ELEMENT}-{PROPERTY}`

Examples:
- `--accordion-border-color` (wrapper)
- `--accordion-border-header-color` (header/title)
- `--accordion-border-divider-color` (divider)
- `--tabs-border-button-color` (tab button)
- `--tabs-border-content-color` (content panel)
- `--tabs-border-divider-color` (divider line)
- `--toc-border-color` (wrapper)

### Standard Radius Format
ALL blocks use object with 4 corners:
```json
{
  "topLeft": 4,
  "topRight": 4,
  "bottomRight": 4,
  "bottomLeft": 4
}
```

### Standard Panel Usage
Replace `<BorderPanel />` with multiple `<GenericPanel />` components, one per group:

```jsx
<GenericPanel group="blockBorders" title="Block Borders" ... />
<GenericPanel group="elementBorders" title="Header Borders" ... />
<GenericPanel group="dividerBorders" title="Divider Borders" ... />
```

---

## Quick Change Reference

### Accordion Changes

**Attributes:**
- `accordionBorderColor` → `blockBorderColor`
- `accordionBorderThickness` → `blockBorderWidth`
- `accordionBorderStyle` → `blockBorderStyle`
- `accordionBorderRadius` → `blockBorderRadius`
- `accordionShadow` → `blockShadow`
- `accordionShadowHover` → `blockShadowHover`
- `dividerBorderThickness` → `dividerBorderWidth`

**Groups:**
- `border` → `blockBorders`
- `border-divider` → `dividerBorders`

**CSS Variables:**
- `--accordion-shadow` → `--accordion-border-shadow`
- `--accordion-shadow-hover` → `--accordion-border-shadow-hover`
- `--accordion-divider-*` → `--accordion-border-divider-*`

### Tabs Changes

**Attributes:**
- Add: `blockBorderColor`, `blockBorderWidth`, `blockBorderStyle`, `blockBorderRadius`, `blockShadow`
- `tabButtonBorderColor` → `buttonBorderColor`
- `tabButtonBorderWidth` → `buttonBorderWidth`
- `tabButtonBorderStyle` → `buttonBorderStyle`
- `tabButtonBorderRadius` → `buttonBorderRadius`
- `tabButtonShadow` → `buttonShadow`
- `tabButtonShadowHover` → `buttonShadowHover`
- `tabButtonActiveBorderColor` → `buttonActiveBorderColor`
- `tabButtonActiveBorderBottomColor` → `buttonActiveBorderBottomColor`
- `panelBorderColor` → `contentBorderColor`
- `panelBorderWidth` → `contentBorderWidth`
- `panelBorderStyle` → `contentBorderStyle`
- `panelBorderRadius` → `contentBorderRadius`
- `panelShadow` → `contentShadow`
- `dividerLineColor` → `dividerBorderColor`
- `dividerLineWidth` → `dividerBorderWidth`
- `dividerLineStyle` → `dividerBorderStyle`

**Groups:**
- `titleBorders` → `elementBorders`
- `content` → `contentBorders`
- `divider` → `dividerBorders`
- Add new: `blockBorders`

**CSS Variables:**
- `--tab-button-border-*` → `--tabs-border-button-*`
- `--tab-panel-border-*` → `--tabs-border-content-*`
- `--divider-*` → `--tabs-border-divider-*`

### TOC Changes

**Attributes:**
- `wrapperBorderColor` → `blockBorderColor`
- `wrapperBorderWidth` → `blockBorderWidth`
- `wrapperBorderStyle` → `blockBorderStyle`
- `wrapperBorderRadius` → `blockBorderRadius` (also: number → object)
- `wrapperShadow` → `blockShadow`
- `wrapperShadowHover` → `blockShadowHover`

**Groups:**
- `border` → `blockBorders`

**CSS Variables:**
- `--toc-wrapper-border-color` → `--toc-border-color`
- `--toc-wrapper-shadow` → `--toc-border-shadow`
- `--toc-wrapper-shadow-hover` → `--toc-border-shadow-hover`

---

## Implementation Order

1. **Update schemas** (accordion.json, tabs.json, toc.json)
2. **Run schema build** (`npm run schema:build`)
3. **Update edit.js files** (remove BorderPanel, add GenericPanel)
4. **Update style.scss files** (update CSS variable references)
5. **Run full build** (`npm run build`)
6. **Test thoroughly**

---

## Benefits

✅ Consistent naming across all blocks
✅ Predictable CSS variable patterns
✅ Simpler codebase (no custom mapping functions)
✅ Better developer experience
✅ Better user experience
✅ Easier to maintain and extend

---

## Risk Mitigation

- Use WordPress `deprecated` attributes for backward compatibility
- Test with existing blocks before/after
- Verify themes still apply correctly
- Document migration path for custom CSS

---

**See `border-refactoring-plan.md` for complete implementation details, testing checklist, and rollback plan.**
