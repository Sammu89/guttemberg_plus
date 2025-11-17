# Block-Specific Attribute Naming Guide

This document explains the block-specific naming convention implemented to eliminate confusion across accordion, tabs, and toc blocks.

---

## ✅ **Fixed Naming Convention**

### **Accordion Block**
Uses `accordion*` prefix for all block-specific attributes:

| Sidebar Control | Attribute Name | CSS Variable |
|----------------|----------------|--------------|
| Border Color | `accordionBorderColor` | `--accordion-border-color` |
| Border Thickness | `accordionBorderThickness` | `--accordion-border-width` |
| Border Style | `accordionBorderStyle` | `--accordion-border-style` |
| Shadow | `accordionShadow` | `--accordion-shadow` |
| Border Radius | `accordionBorderRadius` | `--accordion-border-radius` |
| Divider Color | `dividerBorderColor` | `--accordion-divider-color` |
| Divider Thickness | `dividerBorderThickness` | `--accordion-divider-width` |
| Divider Style | `dividerBorderStyle` | `--accordion-divider-style` |

**BorderPanel Label:** "Accordion Border"

---

### **Tabs Block**
Uses `tab*` prefix for all block-specific attributes:

| Sidebar Control | Attribute Name | CSS Variable |
|----------------|----------------|--------------|
| Border Color | `tabBorderColor` | `--tab-button-border-color` |
| Border Thickness | `tabBorderThickness` | `--tab-button-border-width` |
| Border Style | `tabBorderStyle` | `--tab-button-border-style` |
| Shadow | `tabShadow` | `--tabs-container-shadow` |
| Border Radius | `tabBorderRadius` | `--tab-button-border-radius` |
| Divider Color | `dividerColor` | `--divider-color` |
| Divider Thickness | `dividerThickness` | `--divider-width` |
| Divider Style | `dividerStyle` | `--divider-style` |

**BorderPanel Label:** "Tab Button Border"

---

### **TOC Block**
Uses `wrapper*` prefix for container attributes:

| Sidebar Control | Attribute Name | CSS Variable |
|----------------|----------------|--------------|
| Border Color | `wrapperBorderColor` | `--toc-wrapper-border-color` |
| Border Thickness | `wrapperBorderWidth` | `--toc-border-width` |
| Border Style | `wrapperBorderStyle` | `--toc-border-style` |
| Shadow | `wrapperShadow` | `--toc-wrapper-shadow` |
| Border Radius | `wrapperBorderRadius` | `--toc-border-radius` |

**BorderPanel Label:** "Wrapper Border"
**Note:** TOC doesn't have divider borders

---

## 🔄 **Migration Guide**

### **What Changed for Tabs**

**Before (confusing):**
```javascript
// Tabs was using "accordion" attributes!
accordionBorderColor → --tab-button-border-color
accordionBorderThickness → --tab-button-border-width
dividerBorderColor → --divider-color
```

**After (clear):**
```javascript
// Now uses "tab" prefix
tabBorderColor → --tab-button-border-color
tabBorderThickness → --tab-button-border-width
dividerColor → --divider-color
```

### **What Changed for Accordion**
No changes - already had correct naming!

### **What Changed for TOC**
No changes - already had correct naming!

---

## 📋 **BorderPanel Behavior**

The BorderPanel component is now **block-aware** and shows different controls based on the `blockType` prop:

```javascript
// BorderPanel automatically detects block type
<BorderPanel
  blockType="tabs"        // Shows "Tab Button Border"
  effectiveValues={...}
  attributes={...}
  setAttributes={...}
/>
```

### **Conditional Display:**

1. **Main Border Section:**
   - All blocks show border color, thickness, style, shadow, radius
   - Label changes based on block type

2. **Divider Section:**
   - Shows for: Accordion, Tabs
   - Hidden for: TOC
   - Attribute names differ between accordion and tabs

---

## 🎯 **Why This Matters**

### **Before (Confusing):**
```
User editing TABS block sees:
└── Border Panel
    └── "Accordion Border" ← WHAT?! I'm editing tabs!
        ├── accordionBorderColor ← This controls tabs?!
        └── accordionBorderThickness
```

### **After (Clear):**
```
User editing TABS block sees:
└── Border Panel
    └── "Tab Button Border" ← Makes sense!
        ├── tabBorderColor ← Obviously for tabs!
        └── tabBorderThickness
```

---

## ✅ **Benefits**

1. **No More Confusion:** Attribute names match what they actually control
2. **Clear Labels:** BorderPanel shows "Tab Button Border" for tabs, not "Accordion Border"
3. **Type Safety:** Each block has its own typed attributes
4. **Maintainability:** Easy to see which attributes belong to which block
5. **Discoverability:** Developers can quickly find tab-specific vs accordion-specific code

---

## 📁 **Files Modified**

1. `blocks/tabs/src/tabs-attributes.js` - Added tab-specific border attributes
2. `blocks/tabs/src/save.js` - Updated to use tabBorder* attributes
3. `shared/src/components/BorderPanel.js` - Made block-aware with conditional rendering
4. All build files regenerated

---

## 🔍 **Testing Checklist**

- [x] Accordion Border controls show "Accordion Border" label
- [x] Tabs Border controls show "Tab Button Border" label
- [x] TOC Border controls show "Wrapper Border" label
- [x] Accordion divider uses dividerBorder* attributes
- [x] Tabs divider uses divider* attributes
- [x] TOC doesn't show divider section
- [x] All border values save/load correctly
- [x] CSS variables map correctly on frontend
- [x] Build succeeds without errors

---

## 💡 **For Future Development**

When adding new blocks:
1. Define block-specific attributes with unique prefixes
2. Update BorderPanel conditional logic if needed
3. Use descriptive labels that match the block name
4. Document the mapping between attributes and CSS variables
