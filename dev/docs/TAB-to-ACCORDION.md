# Tabs → Accordion Responsive Mapping

Guide for converting the Tabs block into an accordion-like experience on small screens while keeping the user's tab customizations intact **without changing CSS variable names**. All styling must keep using the existing tab CSS variables so user themes/customizations remain intact.

## Trigger
- Enabled when the tabs root has `.responsive-accordion` and viewport `< data-breakpoint` (default 768).
- Tabs UI hides; accordion UI shows. Desktop state resumes on resize up.

## HTML Structure Transformation
- Tab list (`.tabs-list`) → hidden on mobile.
- For each tab:
  - Render a fallback item with an accordion-style button and panel.
  - Button: `.accordion-title` (optionally wrapped in heading tag if `headingLevel` is set).
  - Panel: `.accordion-content` immediately after the button.
- IDs/ARIA:
  - Button `id`: `acc-${tabId}-header`; `aria-controls`: `acc-${tabId}-content`; `aria-expanded`: `true/false`.
  - Panel `id`: `acc-${tabId}-content`; `aria-labelledby`: `acc-${tabId}-header`; `role="region"`.
  - Carry over disabled state: `disabled` + `aria-disabled="true"`; panel stays `hidden`.

## State Mapping
- Active tab (`currentTab`) → the only accordion item with `aria-expanded="true"` and panel visible.
- Disabled tab → disabled accordion button; panel remains hidden.
- Re-sync active state when resizing back and forth.

## Styling Strategy (NO CSS VAR RENAMES)
- Keep using the tab CSS vars (`--tabs-*`) everywhere; do not introduce or depend on accordion var names for fallback.
- Accordion-like elements should reuse existing tab classes where practical (e.g., icon markup can stay `.tab-icon`), and where new classes are needed for structure (`.accordion-title`, `.accordion-content`), they must still rely on `--tabs-*` variables for color, typography, borders, etc.
- Any inline styles for the fallback must be derived from tab attributes and written to tab var names, not accordion ones.

## Attribute → Fallback Styling Map (stays on `--tabs-*`)
Use resolved tab values (after themes/customizations). Apply only when non-null. Map them to the existing tab CSS variables that already drive styling:

### Button / Title (use tab button vars)
- `tabButtonColor` → `--tabs-button-color`
- `tabButtonBackgroundColor` → `--tabs-button-bg`
- `tabButtonHoverColor` → `--tabs-button-hover-color`
- `tabButtonHoverBackgroundColor` → `--tabs-button-hover-bg`
- `tabButtonFontSize` → `--tabs-button-font-size` (px)
- `tabButtonFontWeight` → `--tabs-button-font-weight`
- `tabButtonFontStyle` → `--tabs-button-font-style`
- `tabButtonTextTransform` → `--tabs-button-text-transform`
- `tabButtonTextDecoration` → `--tabs-button-text-decoration`
- `tabButtonTextAlign` → `--tabs-button-text-align`

### Button / Title
- `tabButtonColor` → `--accordion-title-color`
- `tabButtonBackgroundColor` → `--accordion-title-bg`
- `tabButtonHoverColor` → `--accordion-title-hover-color`
- `tabButtonHoverBackgroundColor` → `--accordion-title-hover-bg`
- `tabButtonFontSize` → `--accordion-title-font-size` (px)
- `tabButtonFontWeight` → `--accordion-title-font-weight`
- `tabButtonFontStyle` → `--accordion-title-font-style`
- `tabButtonTextTransform` → `--accordion-title-text-transform`
- `tabButtonTextDecoration` → `--accordion-title-text-decoration`
- `tabButtonTextAlign` → `--accordion-title-alignment`

### Icons (keep tab icon vars/classes)
- `iconColor` → `--tabs-icon-color`
- `iconSize` → `--tabs-icon-size` (px)
- `iconRotation` → `--tabs-icon-rotation` (deg)
- `iconTypeClosed` / `iconTypeOpen` → `data-icon-closed` / `data-icon-open` on `.tab-icon` (can use `.accordion-title .tab-icon` for structure)
- Position mapping:
  - Tabs `left` → accordion `icon-left`
  - Tabs `right` → accordion `icon-right`
  - Tabs `box-left` → accordion `icon-box-left`
  - Tabs `box-right` → accordion `icon-box-right`

### Panel / Content (tab panel vars)
- `panelBackgroundColor` → `--tabs-panel-bg`
- `panelColor` → `--tabs-panel-color`
- `panelBorderColor` → `--tabs-panel-border-color`
- `panelBorderWidth` → `--tabs-panel-border-width` (px)
- `panelBorderStyle` → `--tabs-panel-border-style`
- `panelBorderRadius` → `--tabs-panel-border-radius`

### Wrapper / Container (tab wrapper vars)
- `borderColor` → `--tabs-border-color`
- `borderWidth` → `--tabs-border-width` (px)
- `borderStyle` → `--tabs-border-style`
- `borderRadius` → `--tabs-border-radius` (topLeft topRight bottomRight bottomLeft, px)
- `shadow` → `--tabs-border-shadow`
- `shadowHover` → `--tabs-border-shadow-hover`

## Behavior & JS Responsibilities
- On mobile:
  - Hide `.tabs-list` and `.tabs-panels`; show `.accordion-fallback`.
  - Build accordion items from `tabsData` and `.tab-panel` metadata (`data-tab-id`, `data-tab-title`, `data-disabled`).
  - Set `aria-expanded`/`hidden` based on `currentTab`.
  - Wire click/keyboard to reuse accordion open/close logic and animations.
  - Apply inline styles (if needed) using tab var names (`--tabs-*`) so existing CSS continues to render the theme.
- On desktop:
  - Hide fallback; show tabs; ensure `aria-selected`/`tabindex` and panels reflect `currentTab`.
- Keep icon swapping/rotation consistent with tab behavior (use existing accordion animation helpers).

## Accessibility
- Use accordion ARIA pattern on mobile; revert to tab ARIA on desktop.
- Ensure heading wrapper mirrors accordion: when `headingLevel` ≠ `none`, wrap the button in that heading tag with `.accordion-heading`.
- Preserve focus order and keyboard support: Enter/Space toggles; Arrow/Home/End navigate between accordion buttons.

## Notes & Edge Cases
- Respect `enableResponsiveFallback`: if false, skip fallback entirely.
- If `tabsData` is empty, rely on JS to derive from inner blocks (same as current tabs behavior).
- Handle mixed icon types: images keep `tab-icon-image` equivalent class for sizing; text/emoji stays inline.
- Keep width from tabs root (`tabsWidth`) applied to the fallback container as well.

## Reference Markup (Defaults)

### Tabs (desktop/default)
```html
<div
  class="gutplus-tabs responsive-accordion"
  data-orientation="horizontal"
  data-activation-mode="auto"
  data-breakpoint="768"
  data-responsive-fallback="true"
  data-show-icon="true"
  data-icon-closed="▾"
  data-icon-open="none"
  data-icon-position="right"
  data-heading-level="none"
  style="
    --tabs-border-color:#dddddd;
    --tabs-border-width:1px;
    --tabs-border-style:solid;
    --tabs-border-radius:4px 4px 4px 4px;
    --tabs-border-shadow:none;
    --tabs-border-shadow-hover:none;
    --tabs-button-color:#666666;
    --tabs-button-bg:#f5f5f5;
    --tabs-button-hover-color:#333333;
    --tabs-button-hover-bg:#e8e8e8;
    --tabs-button-active-color:#333333;
    --tabs-button-active-bg:#ffffff;
    --tabs-button-border-color:#dddddd;
    --tabs-button-border-width:1px;
    --tabs-button-border-style:solid;
    --tabs-button-border-radius:4px 4px 0 0;
    --tabs-button-border-shadow:none;
    --tabs-button-border-shadow-hover:none;
    --tabs-button-font-size:16px;
    --tabs-button-font-weight:500;
    --tabs-button-font-style:normal;
    --tabs-button-text-transform:none;
    --tabs-button-text-decoration:none;
    --tabs-button-text-align:center;
    --tabs-button-padding:12px 24px;
    --tabs-button-gap:8px;
    --tabs-list-bg:transparent;
    --tabs-list-align:flex-start;
    --tabs-list-divider-border-width:0px;
    --tabs-list-divider-border-style:solid;
    --tabs-list-divider-border-color:#dddddd;
    --tabs-panel-bg:#ffffff;
    --tabs-panel-color:#333333;
    --tabs-panel-border-color:#dddddd;
    --tabs-panel-border-width:1px;
    --tabs-panel-border-style:solid;
    --tabs-panel-border-radius:4px 4px 4px 4px;
    --tabs-icon-color:#666666;
    --tabs-icon-size:16px;
    --tabs-icon-rotation:180deg;
  "
>
  <div class="tabs-list" role="tablist" aria-orientation="horizontal" data-current-tab="0">
    <button type="button" class="tab-button active" role="tab" id="tab-one" aria-controls="panel-one" aria-selected="true" tabindex="0">
      <span class="tab-button-text">Tab One</span>
      <span class="tab-icon" aria-hidden="true" data-icon-closed="▾" data-icon-open="none">▾</span>
    </button>
    <button type="button" class="tab-button" role="tab" id="tab-two" aria-controls="panel-two" aria-selected="false" tabindex="-1">
      <span class="tab-button-text">Tab Two</span>
      <span class="tab-icon" aria-hidden="true" data-icon-closed="▾" data-icon-open="none">▾</span>
    </button>
  </div>

  <div class="tabs-panels">
    <div class="tab-panel active" role="tabpanel" id="panel-one" aria-labelledby="tab-one">
      Tab one content...
    </div>
    <div class="tab-panel" role="tabpanel" id="panel-two" aria-labelledby="tab-two" hidden>
      Tab two content...
    </div>
  </div>
</div>
```

### Same content, accordion-like (mobile/fallback)
Uses the same `--tabs-*` variables via inline style or inherited from root; only structure/ARIA change and the root has the responsive state class. No new per-item class names; toggles stay `.tab-button`, panels stay `.tab-panel`.

```html
<div
  class="gutplus-tabs responsive-tab"
  data-orientation="horizontal"
  data-activation-mode="auto"
  data-breakpoint="768"
  data-responsive-fallback="true"
  style="/* same --tabs-* variables as above */"
>
  <div class="responsive-tab-stack">
    <div>
      <button
        type="button"
        class="tab-button icon-right"
        id="acc-tab-one-header"
        aria-controls="acc-tab-one-content"
        aria-expanded="true"
      >
        <span class="tab-button-text">Tab One</span>
        <span class="tab-icon" aria-hidden="true" data-icon-closed="▾" data-icon-open="none">▾</span>
      </button>
      <div
        class="tab-panel"
        id="acc-tab-one-content"
        role="region"
        aria-labelledby="acc-tab-one-header"
      >
        Tab one content...
      </div>
    </div>

    <div>
      <button
        type="button"
        class="tab-button icon-right"
        id="acc-tab-two-header"
        aria-controls="acc-tab-two-content"
        aria-expanded="false"
      >
        <span class="tab-button-text">Tab Two</span>
        <span class="tab-icon" aria-hidden="true" data-icon-closed="▾" data-icon-open="none">▾</span>
      </button>
      <div
        class="tab-panel"
        id="acc-tab-two-content"
        role="region"
        aria-labelledby="acc-tab-two-header"
        hidden
      >
        Tab two content...
      </div>
    </div>
  </div>
</div>
```

Key point: both structures rely on the same `--tabs-*` variables and the same tab class names. The responsive state is controlled by the root class (`.responsive-tab`), allowing CSS like `.responsive-tab .tab-button` / `.responsive-tab .tab-panel` to restyle for the accordion-like experience without introducing new CSS variable names.



Variable Strategy Map
Category	Variable Name (cssVar)	Rationale
1. KEEP (Direct Map)	Theme Colors	Essential for preserving the user's color scheme across all states.
--tabs-button-color	
--tabs-button-bg	
--tabs-button-hover-color	
--tabs-button-hover-bg	
--tabs-button-active-color	
--tabs-button-active-bg	
--tabs-panel-color	
--tabs-panel-bg	
Typography	Preserves branding and readability.
--tabs-button-font-size	
--tabs-button-font-weight	
--tabs-button-font-style	
--tabs-button-text-transform	
--tabs-button-text-decoration	
--tabs-button-active-font-weight	
Borders (for stack separation)	Used to color the accordion separator lines and the wrapper box.
--tabs-border-color	(Used on .responsive-tab-stack wrapper)
--tabs-border-width	(Used on .responsive-tab-stack wrapper)
--tabs-border-style	(Used on .responsive-tab-stack wrapper)
--tabs-border-radius	(Used on .responsive-tab-stack wrapper)
--tabs-button-border-color	(Used for the border-bottom separator)
--tabs-button-border-style	(Used for the border-bottom separator)
Icons (Animation)	This must be kept to allow the icon to rotate when the accordion opens.
--tabs-icon-color	
--tabs-icon-size	
--tabs-icon-rotation	(Crucial for open/close animation)

Exportar para Sheets

Category	Variable Name (cssVar)	CSS Property to Override	Recommended Hardcode Value / Rationale
2. HARDCODE (Override)	Layout & Geometry	Layout properties must be reset for a vertical stack.	
--tabs-button-text-align	text-align / justify-content	Action: Override to text-align: left; and/or use justify-content: space-between; on the button to separate text and icon.
--tabs-button-border-radius	border-radius	Action: Override to 0. Individual items in a vertical stack must have square corners for continuity.
--tabs-button-border-width	border-width	Action: Override to border: none; and then apply border-bottom separately to create item separation.
--tabs-button-padding	padding	Action: Override or use the variable, but ensure horizontal padding is enough to accommodate the icon on the right, and is applied evenly.
Tab-Specific Borders	These properties define the active tab's relationship with the content panel—irrelevant in the stacked accordion.	
--tabs-button-active-content-border-width	border-*width	Action: Set to 0 or none. This border should not exist on an accordion.
--tabs-button-active-content-border-color	border-*color	Action: Set to transparent or none.
--tabs-button-active-content-border-style	border-*style	Action: Set to none.

Exportar para Sheets

Category	Variable Name (cssVar)	Affected Element	Rationale for Omission
3. OMIT (Ignore)	Horizontal Spacing	These variables control the alignment and spacing of the horizontal tab list, which is hidden on mobile.	
--tabs-button-gap	.tabs-list	Horizontal gap is irrelevant in a vertical stack. Use margin-bottom or border-bottom instead.
--tabs-list-align	.tabs-list	Controls justify-content for the tab row. The accordion stack uses flex-direction: column;.
--tabs-row-spacing	.tabs-list	Controls padding around the tab row. The accordion should use the main wrapper's padding.
--tabs-list-bg	.tabs-list	Background of the hidden list element.
Tab Row Dividers	These borders are for separating the horizontal list from the content, which is handled differently in the accordion structure.	
--tabs-list-divider-border-color	.tabs-list	
--tabs-list-divider-border-width	.tabs-list	
--tabs-list-divider-border-style	.tabs-list	

Exportar para Sheets

Implementation CSS Snippet
The following CSS classes would be necessary to enforce the Hardcode/Override strategy, while using the theme variables where necessary.

CSS

/* 1. Ensure the stack is vertical and takes full width */
.responsive-tab-stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Use wrapper variables for the overall container border */
  border: var(--tabs-border-width) var(--tabs-border-style) var(--tabs-border-color);
  border-radius: var(--tabs-border-radius);
  overflow: hidden; 
}

/* 2. Overrides for the tab-button in accordion mode */
.responsive-tab-stack .tab-button {
  /* HARDCODE: Reset Layout and Alignment */
  width: 100%;
  box-sizing: border-box; 
  display: flex; 
  justify-content: space-between; /* Ensures icon is on the far edge */
  text-align: left; /* OVERRIDE: Ignore --tabs-button-text-align (e.g., 'center') */
  
  /* HARDCODE: Reset Tab-specific Borders */
  border: none; /* Ignore ALL border-width, style, color on the item itself */
  border-radius: 0; /* Ignore --tabs-button-border-radius */

  /* HYBRID: Create Item Separator Border */
  border-bottom-width: var(--tabs-button-border-width);
  border-bottom-style: var(--tabs-button-border-style);
  border-bottom-color: var(--tabs-button-border-color); 

  /* KEEP: Theme & Typography */
  background-color: var(--tabs-button-bg);
  color: var(--tabs-button-color);
  /* Other font variables here (size, weight, etc.) */
}

/* 3. Active state styling on the Accordion Button (Title) */
.responsive-tab-stack .tab-button[aria-expanded="true"] {
  background-color: var(--tabs-button-active-bg);
  color: var(--tabs-button-active-color);

  /* HARDCODE: Remove the last separator border on the active button/panel */
  border-bottom: none; 
}

/* 4. Icon Animation */
.responsive-tab-stack .tab-button[aria-expanded="true"] .tab-icon {
  /* Use the theme's rotation variable */
  transform: rotate(var(--tabs-icon-rotation, 180deg)); 
}
.responsive-tab-stack .tab-button[aria-expanded="false"] .tab-icon {
  transform: rotate(0deg); 
}

/* 5. Content Panel */
.responsive-tab-stack .tab-panel {
  /* KEEP: Theme Panel Colors */
  background-color: var(--tabs-panel-bg);
  color: var(--tabs-panel-color);
  /* HARDCODE: Ensure the panel has no border */
  border: none;
}
