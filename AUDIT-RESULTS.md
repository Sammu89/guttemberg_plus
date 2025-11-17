# CSS Variable Audit - Sidebar Controls vs Output vs Frontend

## 🔴 CRITICAL ISSUE: Generic ColorPanel Shows Wrong Controls

The `ColorPanel.js` component is shared across ALL blocks but shows controls that don't match each block's needs:
- Shows: `hoverTitleBackgroundColor`, `activeTitleBackgroundColor` (generic names)
- But TABS needs: `tabButtonActiveBackground`, `tabButtonActiveColor` (tabs-specific names)
- And ACCORDION/TOC don't even use hover/active effectively in editor preview

**Solution:** Remove hover/active controls from generic ColorPanel. Only output what users can actually customize.

---

## ACCORDION BLOCK

### ✅ Controls Available in Sidebar:
**ColorPanel (shared):**
- titleBackgroundColor ✓
- titleColor ✓
- ~~hoverTitleBackgroundColor~~ ❌ SHOULD REMOVE (not useful in editor)
- ~~hoverTitleColor~~ ❌ SHOULD REMOVE
- ~~activeTitleBackgroundColor~~ ❌ SHOULD REMOVE
- ~~activeTitleColor~~ ❌ SHOULD REMOVE
- contentBackgroundColor ✓

**TypographyPanel (shared):**
- headingLevel ✓
- titleFontSize ✓
- titleFontWeight ✓
- titleFontStyle ✓
- titleTextTransform ✓
- titleTextDecoration ✓
- titleAlignment ✓

**BorderPanel (shared - but says "Accordion Border"):**
- accordionBorderColor ✓
- accordionBorderThickness ✓
- accordionBorderStyle ✓
- accordionShadow ✓
- dividerBorderColor ✓
- dividerBorderThickness ✓
- dividerBorderStyle ✓

**IconPanel (shared):**
- showIcon ✓
- iconTypeClosed ✓
- iconTypeOpen ✓
- iconRotation ✓
- iconPosition ✓
- iconColor ✓
- iconSize ✓

### ❌ Variables OUTPUT in save.js but NOT controllable:
- `contentColor` (line 62) - **REMOVE**
- `hoverTitleBackgroundColor` (line 69) - **REMOVE** (no control, not needed)
- `hoverTitleColor` (line 70) - **REMOVE**
- `activeTitleBackgroundColor` (line 71) - **REMOVE**
- `activeTitleColor` (line 72) - **REMOVE**
- `titlePadding` (line 83) - **REMOVE**
- `contentPadding` (line 87) - **REMOVE**
- `accordionBorderRadius` (line 91) - **REMOVE**
- `accordionMarginBottom` (line 77) - **REMOVE**
- `dividerBorderThickness` (line 78) - **KEEP** (has control in BorderPanel)

---

## TABS BLOCK

### ✅ Controls Available in Sidebar:
**Same ColorPanel, TypographyPanel, BorderPanel, IconPanel as accordion**

### 🚨 PROBLEM: ColorPanel shows WRONG attributes!
**ColorPanel shows:**
- hoverTitleBackgroundColor
- activeTitleBackgroundColor

**But tabs-attributes.js defines:**
- tabButtonActiveBackground (line 153)
- tabButtonActiveColor (line 148)
- tabButtonActiveBorderColor (line 158)

**Result:** User sees controls that DON'T WORK!

### ❌ Variables OUTPUT in save.js but WRONG or NOT controllable:
Lines 66-85 in tabs/src/save.js output many tab-specific variables:
- `titleColor` → outputs as `--tab-button-color` ✓ CORRECT
- `titleBackgroundColor` → outputs as `--tab-button-bg` ✓ CORRECT
- `hoverTitleColor` → outputs as `--tab-button-hover-color` ✓ CORRECT
- `hoverTitleBackgroundColor` → outputs as `--tab-button-hover-bg` ✓ CORRECT
- `tabButtonActiveColor` → outputs as `--tab-button-active-color` ✓ HAS ATTRIBUTE BUT NO CONTROL!
- `tabButtonActiveBackground` → outputs as `--tab-button-active-bg` ✓ HAS ATTRIBUTE BUT NO CONTROL!

### Solution for Tabs:
1. Remove hover/active from generic ColorPanel
2. Tabs can keep outputting hover/active IF it has controls elsewhere (it doesn't currently)

---

## TOC BLOCK

### ✅ Controls Available in Sidebar:
**ColorPanel, TypographyPanel, BorderPanel (no IconPanel)**
Plus TOC-specific panels for Level 1/2/3+ typography

### ❌ Variables shown that don't make sense:
- hoverTitleBackgroundColor - **NO HOVER STATE IN TOC**
- activeTitleBackgroundColor - **NO ACTIVE STATE IN TOC**

---

## 📋 ACTION ITEMS:

### 1. Fix ColorPanel.js (shared/src/components/ColorPanel.js)
Remove lines 95-98 (hover/active controls)

### 2. Fix accordion/src/save.js
Remove lines for:
- contentColor
- hoverTitleBackgroundColor
- hoverTitleColor
- activeTitleBackgroundColor
- activeTitleColor
- titlePadding
- contentPadding
- accordionBorderRadius
- accordionMarginBottom

### 3. Fix tabs/src/save.js
Remove lines for:
- hoverTitleColor
- hoverTitleBackgroundColor
- tabButtonActiveColor
- tabButtonActiveBackground
- tabButtonActiveBorderColor
- tabButtonActiveBorderBottomColor

### 4. Fix toc/src/save.js
(Need to check what's output there)

### 5. Fix accordion/src/style.scss
Keep all CSS variables (they provide defaults), but they won't be overridden by inline styles anymore

---

## Result:
✅ Only variables with sidebar controls will be output as inline styles
✅ CSS defaults in style.scss will be used for everything else
✅ Users won't be confused by controls that don't work
✅ Cleaner HTML output (fewer inline style variables)
