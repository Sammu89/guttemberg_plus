# Advanced Tabs Block Sidebar Controls (Reverse Engineering Notes)

This document describes how the Advanced Tabs Block (advanced-tabs-block) builds its sidebar (Inspector) controls for the Tabs block, with emphasis on Tab Items and the Styles tab controls you listed. It also separates native Gutenberg pieces from the plugin's custom wrapper components so you can map these patterns into your own plugin.

Primary sources
- `build/blocks/tabs/index.js` (all React control code, custom wrappers, options, DnD, attribute helpers)
- `build/global/global.js` (adds responsive mode attribute)
- `includes/classes/enqueue-assets.php` (loads Bootstrap Icons and global controls CSS)
- `build/global/global.css` (styles for custom controls and UI)

## Inspector layout (Settings vs Styles)
- The sidebar is rendered by a custom wrapper `De` (exported as `of`) that inserts two `InspectorControls` groups: group `settings` and group `styles`.
- The Tabs block editor uses this wrapper in the `To` component (the control panel wrapper for the Tabs block).
- Result: the sidebar has two tabs, Settings and Styles, each containing a custom panel container with multiple `PanelBody` sections.
- Native Gutenberg involved: `wp.blockEditor.InspectorControls`.
- Custom wrapper: `De` in `build/blocks/tabs/index.js`.

## Tab Items (Settings > Tab Items)
Location: `build/blocks/tabs/index.js` inside `ql` (the Tab Items component), called by `To` under the "Tab Items" `PanelBody`.

What you see in the UI and how it is built
1) Tab list with drag handle (the 6-dot icon)
- The list is wrapped in a custom DnD component `Ul` (exported as `oy`), which uses DnD Kit inlined into the bundle.
- Each item is rendered inside `zl` (exported as `Uq`), which adds a floating drag handle button with a six-dot SVG icon. This is the handle next to the title used to reorder tabs.
- On drag end, the item order is updated by array reordering and `setAttributes({ tabTitles: newOrder })`.
- Custom DnD UI: `Ul` and `zl` in `build/blocks/tabs/index.js`.

2) Per-tab dropdown (PanelBody accordion)
- Each tab item is rendered inside a `wp.components.PanelBody` with `title` set to the tab title. This is the collapsible dropdown you click to expand each tab's settings.
- Native Gutenberg: `PanelBody`.

3) Tab Title text input
- `wp.components.TextControl` updates `tabTitles[index].title`.
- Native Gutenberg: `TextControl`.

4) Show Icon toggle
- `wp.components.ToggleControl` toggles `tabTitles[index].hasMedia`.
- Native Gutenberg: `ToggleControl`.

5) Icon Type dropdown and icon picker
- Icon Type uses a custom SelectControl wrapper (`Kl`, exported as `ed`) with options from `Gl` (iconLibrary vs uploadSVG).
- If `iconLibrary` is selected: a custom Icon Picker (`Wl`, exported as `fW`) opens a modal with Bootstrap Icon options.
- If `uploadSVG` is selected: `wp.components.TextareaControl` accepts raw SVG markup stored in `tabTitles[index].customSVG`.
- Rendering uses either `bi bi-${icon}` class or raw SVG via `RawHTML`.
- Native Gutenberg: `TextareaControl`.
- Custom wrappers: `Kl` (select) and `Wl` (icon picker) in `build/blocks/tabs/index.js`.
- Icon library styling is from Bootstrap Icons CSS: `assets/css/bootstrap-icons.min.css` enqueued via `includes/classes/enqueue-assets.php`.

6) Delete tab and Add New Tab
- Delete button uses `wp.components.Button` with icon "trash" and removes the corresponding inner block.
- Add New Tab uses `wp.blocks.createBlock("atbs/tab")`, then `wp.data.dispatch('core/block-editor').replaceInnerBlocks(...)` to insert the new block and sync `tabTitles`.
- Native Gutenberg: `Button`, `createBlock`, `replaceInnerBlocks`.
- Custom logic: the tab list is mirrored between `tabTitles` attribute and inner blocks.

## Tab Titles (Settings > Tab Titles)
Location: `To` -> "Tab Titles" `PanelBody`.

1) Alignment control (icon buttons)
- Uses custom alignment control `jo` (exported as `LE`).
- It renders a label plus a responsive device switcher, then a `ButtonGroup` with SVG icons for Left/Center/Right (or Flex align variants).
- The icon choices come from arrays in `build/blocks/tabs/index.js` (`p`, `h`, `x`, etc.).
- Values are stored per device in `{controlName}Aligns` with keys `desk`, `tab`, `mob`.
- Native Gutenberg: `ButtonGroup`, `Button`.
- Custom wrapper: `jo` (`LE`) and `He` / `Ve` for device buttons.

2) Icon Position (left/top/bottom/right icons)
- Uses a custom ButtonGroup control `Bo` (exported as `ed`) with `options` for icon position (values like `icon_left`, `icon_top`, etc.) and SVG icons for each layout.
- Updates the `iconPosition` attribute.
- Custom wrapper: `Bo`.

3) Titles Gap and Icon Gap (slider with reset, device icons, unit switch)
- Uses `Co` (exported as `Jn`), which is the responsive range control `Ue`.
- The control is wrapped with a Reset button (icon "image-rotate"), device switcher (desktop/tablet/mobile), and unit buttons.
- Values are stored in `{controlName}Ranges` and units in `{controlName}Units` (each has `desk`, `tab`, `mob`).
- Units are passed as `units: ["px", "em"]` for both gaps.
- The reset button clears the current device value and resets the unit to `px`.
- Native Gutenberg: `RangeControl`, `Button`.
- Custom wrappers: `Ue`, `Ge` (reset UI), `He`/`Ve` (device buttons), `ze` (units).

## Responsive device icons (Desktop / Tablet / Mobile)
- A global `resMode` attribute is injected into every `atbs/*` block via `build/global/global.js` with default "Desktop".
- The device switcher component `Ve` renders three icon buttons using inline SVGs (Desktop/Tablet/Mobile) from the `m` array in `build/blocks/tabs/index.js`.
- Each responsive control uses `resMode` to decide which device sub-values to display and edit.

## Styles tab: Titles Container Border (width + chain icon + color)
Location: `To` -> Styles -> "Titles Container" `PanelBody`.

1) Border width control (top/right/bottom/left + link/unlink)
- Uses `Oo` (exported as `gl`), which is the border control `dn`.
- `dn` renders a Border Style dropdown, then a "Border Width" group with number inputs for Top/Right/Bottom/Left.
- The chain icon is the `admin-links` (linked) / `editor-unlink` (unlinked) icon on a `Button` that toggles `LinkStatus` per device.
- When linked, all sides use a single value (`LinkedWidth`). When unlinked, each side is stored in `Widths` (and similarly for tablet/mobile in `TabWidths`/`MobWidths`).
- All values are per-device (desktop/tablet/mobile) based on `resMode`.
- Native Gutenberg: `SelectControl`, `__experimentalNumberControl`, `Button`.
- Custom wrapper: `dn` (`Oo`).

2) Border color mechanism (normal/hover)
- The same border control stores colors in `{controlName}Colors` with `normal` and `hover` keys.
- If `noHover: true` is passed, it shows only one Color control (normal).
- Otherwise, it shows a Normal/Hover switcher (`Fe`) with two color pickers (`qe`).
- Color picker UI is custom (`qe`), with a Reset button and a popover showing `ColorPicker` plus the theme palette.
- Native Gutenberg: `ColorPicker`, `ColorIndicator`, `Popover`, `Button`.
- Custom wrappers: `Fe` (normal/hover switcher) and `qe` (color control).

## Background Type (Classic vs Gradient)
Location: multiple panels in Styles (Titles Container, Individual Title, Tab Content, Active Tab, etc.).

- Background Type uses a custom button group `Bo` with options `classic` and `gradient`.
- If Classic: shows a custom color control `Mo` (same `qe` component).
- If Gradient: uses native Gutenberg `wp.components.GradientPicker` with a custom gradient preset list (`ko`).
- Values are stored as `tcBgType`, `tcBgColor`, `tcBgGradient` for Titles Container; similar patterns for other sections.

## What is native Gutenberg vs custom wrapper
Native Gutenberg (direct usage)
- `PanelBody`, `ToggleControl`, `TextControl`, `TextareaControl`, `Button`, `ButtonGroup`, `SelectControl`, `RangeControl`
- `InspectorControls`
- `GradientPicker`, `ColorPicker`, `ColorIndicator`, `Popover`, `Modal`
- `__experimentalNumberControl`
- `createBlock`, `replaceInnerBlocks`, `InnerBlocks`

Custom wrappers and utilities (plugin-defined in `build/blocks/tabs/index.js`)
- `De` (Inspector layout for settings/styles)
- `ql` (Tab Items list + add/remove + DnD)
- `Ul` / `zl` (DnD wrapper and drag handle with six-dot icon)
- `He` / `Ve` (responsive label + device icons, resMode switching)
- `Ue` / `Co` (responsive range control with reset + units)
- `Ke` / `No` (box control for padding/margin/radius with link/unlink)
- `dn` / `Oo` (border control with style, width per side, linked values, and colors)
- `Ze` / `jo` (alignment control with SVG icons)
- `Qe` / `Wl` (icon picker modal for Bootstrap Icons)
- `qe` / `Mo` (color control with reset + palette)
- `Fe` (normal/hover switcher)

## Implementation guidance for your own plugin
1) Responsive UI pattern
- Add a `resMode` attribute (Desktop/Tablet/Mobile) via `blocks.registerBlockType` filter.
- Store per-device values in `{controlName}Ranges`, `{controlName}Units`, `{controlName}Aligns`, etc.
- Build a small wrapper that renders a label + device switcher + control body.

2) Range sliders with reset and units
- Wrap `RangeControl` in a container that shows a Reset icon.
- Track units in an attribute object (desk/tab/mob) and show unit buttons.

3) Per-side controls with link/unlink
- Store `LinkedStatus` and `LinkedValue` (or widths) plus separate `Values` for each side.
- Use a `Button` with `admin-links` / `editor-unlink` icons to toggle linked mode.

4) Icon library + custom SVG
- For a simple icon library, enqueue an icon font CSS (like Bootstrap Icons) and render with `<i className="bi bi-...">`.
- For SVG, store raw markup and render via `RawHTML`.
- Provide a modal search list if you want a nicer picker (see `Qe` component pattern).

5) DnD for list items
- Use DnD Kit (as this plugin does) or Gutenberg's own Sortable utilities.
- Provide a drag handle button with a small SVG icon, not the whole item.

6) Background type logic
- Use a small `classic/gradient` toggle.
- For gradient, rely on `GradientPicker` and pass custom presets.
- For classic, use a color picker with Reset.

## Notes for comparison with your plugin
- The entire sidebar UI is a blend of native Gutenberg components and a custom control system branded as `gkits-*` (see CSS in `build/global/global.css`).
- The plugin uses attributes as a mini schema: each controlName expands into multiple attributes for desktop/tablet/mobile and linked/unlinked states.
- The UI always reads/writes attributes; CSS output is generated from these attributes and stored in `blockStyle` for frontend rendering.

## Panel layout notes (from UI screenshots)
This section documents the visual layout for the key panels you asked about, including an ASCII layout for quick reference.

## Native Gutenberg vs custom styling (what was changed to get this look)
High-level summary
- Native Gutenberg provides the basic controls: `PanelBody`, `TextControl`, `ToggleControl`, `SelectControl`, `RangeControl`, `Button`, `ButtonGroup`, `ColorPicker`, `GradientPicker`, `Popover`, `Modal`, `InspectorControls`.
- The developer wrapped these in custom components (the `gkits-*` controls) to add: responsive device switching, reset buttons, units, linked/unlinked side controls, icon pickers, and consistent layout/CSS.
- The visual styling is largely custom CSS from `build/global/global.css` (classes like `gkits-control-container`, `gkits-res-btn`, `gkits-device-btn`, `gkits-reset-button`, `gkits-units-wrapper`, `gkits-single-inputs-group`, etc.).
- Bootstrap Icons are used to render the icon library and some UI visuals (`assets/css/bootstrap-icons.min.css`).

Per-panel breakdown (native vs custom)
- Tab Items: Native `PanelBody`, `TextControl`, `ToggleControl`, `TextareaControl`, `Button`. Custom DnD wrapper (`Ul`/`zl`) for drag handle, custom icon picker modal (`Qe`/`Wl`), custom layout CSS for the list rows.
- Tab Titles: Native `ButtonGroup`, `Button`, `RangeControl`. Custom alignment control (`jo`/`Ze`) adds device switching and icon buttons. Custom range control (`Co`/`Ue`) adds reset + units + device icons.
- Div Settings (Border/Radius/Padding/Margin): Native `SelectControl`, `__experimentalNumberControl`, `Button`. Custom border control (`Oo`/`dn`) adds per-side inputs + link/unlink + hover/normal color handling. Custom box control (`No`/`Ke`) adds per-side inputs + link/unlink + units per device.
- Color chooser: Native `ColorPicker`, `ColorIndicator`, `Popover`, `Button`. Custom wrapper (`qe`/`Mo`) adds reset behavior, palette row, and the popover layout.
- Gradient chooser: Native `GradientPicker`. Custom wrapper just toggles classic/gradient and provides a preset list; layout styling is custom CSS.

## Icon libraries (Bootstrap or equivalent) and how they are used
This plugin uses Bootstrap Icons to power the icon picker and to render selected icons in the block.

How Bootstrap Icons are imported
- CSS is enqueued globally for the editor and front end in `includes/classes/enqueue-assets.php`:
  - `wp_enqueue_style( 'atbs-blocks-bootstrap-icons', ATBS_URL . './assets/css/bootstrap-icons.min.css', ... )`
- Fonts live under `assets/css/fonts/` and are referenced by the Bootstrap Icons CSS.

How icons are rendered
- Selected icon name is stored as a string (e.g. `0-circle`, `alarm`, etc.).
- Rendering uses the Bootstrap Icons class naming convention:
  - `className={\`bi bi-${icon}\`}`
- In the tabs UI it appears in two places:
  - The Icon Picker preview and list.
  - The tab title itself when `hasMedia` is enabled.

Equivalent icon libraries
- Any icon font with a class-based API works the same way (Font Awesome, Remix Icon, etc.). The only change is the class prefix you render (e.g. `fa fa-${icon}` or `ri-${icon}-line`), plus the CSS file you enqueue.
- If you prefer SVGs: store raw SVG markup in attributes and render via `RawHTML`, which is already supported in this plugin.

Minimal usage pattern (DRY)
- Enqueue icon CSS once for your plugin (editor + frontend).
- Store icon identifiers in attributes.
- Render icons using a single small helper component.

Example (class-based icons)
```js
// icon CSS enqueued in PHP or via block.json style.
const Icon = ({ name, classPrefix = "bi bi-" }) => (
  name ? <i className={`${classPrefix}${name}`} aria-hidden="true" /> : null
);
```

Example (SVG string)
```js
import { RawHTML } from "@wordpress/element";
const SvgIcon = ({ svg }) => (svg ? <RawHTML>{svg}</RawHTML> : null);
```

## DRY sidebar control construction (reuse vs re-implement)
The plugin already applies a DRY pattern by building reusable wrappers:
- `Ue` / `Co`: responsive range control (reset + units + device switch).
- `Ke` / `No`: box control (top/right/bottom/left + link/unlink + units).
- `dn` / `Oo`: border control (style + per-side widths + link/unlink + colors).
- `qe` / `Mo`: color control (reset + palette + popover).
- `Ze` / `jo`: alignment control (icon buttons + device switch).
- `Qe` / `Wl`: icon picker modal.

If you want the same DRY usage in your own plugin:
- Build small wrapper components for each control type, keeping attributes convention-based (`controlName` prefix).
- In your block edit UI, only pass `controlName`, `label`, and `objAttrs` (attributes + setAttributes).
- Keep unit lists and responsive device switching inside the wrapper so blocks stay minimal.

Example pattern (generic control wrapper)
```js
// Usage in block edit:
<MyRangeControl
  label="Titles Gap"
  controlName="titlesGap"
  objAttrs={{ attributes, setAttributes }}
  min={0}
  max={100}
  units={["px", "em"]} />
```

### Tab Items panel
Layout description
- Panel header with a caret for collapse/expand.
- Each tab item is a row with a trash icon on the left, the title in the middle, a 6-dot drag handle near the right, and a chevron to expand its settings.
- Expanded item shows a vertical form: text input, toggle, icon type tabs, icon picker card, and a replace button.
- Bottom has a primary "Add New Tab" button.

ASCII layout
```
Tab Items  [^]
--------------------------------
[trash]  Tab 1           [::] [v]
[trash]  Tab 2           [::] [v]
[trash]  Tab 3           [::] [^]
  Tab Title
  [ Tab 3                ]
  Show Icon  (toggle)
  Icon Type
  [ Icon Library ] [ Custom SVG ]
  Pick An Icon
  +---------------------------+
  |     (selected icon)       |
  |                    [trash]|
  |        REPLACE            |
  +---------------------------+

[ Add New Tab ]
```

### Tab Titles panel
Layout description
- Panel header with a caret for collapse/expand.
- "Alignment" label on the left with device icons (desktop/tablet/mobile) inline to the right.
- Below alignment: a button group with icon buttons for align modes.
- "Icon Position" label followed by a button group with icon-position icons.
- "Titles Gap" and "Icon Gap": label with device icons, reset icon, slider, numeric input, and unit buttons (PX/EM).

ASCII layout
```
Tab Titles  [^]
Alignment     [D][T][M]
[align-left] [align-center] [align-right] [justify]

Icon Position
[icon-left] [icon-top] [icon-bottom] [icon-right]

Titles Gap   [D][T][M]  (reset)
|----o-------------|   [ 22 ]  [PX][EM]

Icon Gap     [D][T][M]  (reset)
|----o-------------|   [ 22 ]  [PX][EM]
```

### Div Settings / Titles Container (Border, Radius, Padding, Margin, Background)
Layout description
- Border Style dropdown at top.
- Border Width group: device icons, unit buttons (PX/EM/REM), four inputs for top/right/bottom/left, and a chain icon toggle to link/unlink.
- Border Color: reset icon + color swatch button.
- Border Radius, Padding, Margin: same per-side layout as Border Width (with device icons, units, 4 inputs, chain link).
- Background Type tabs (Classic/Gradient). Below, depending on selection:
  - Classic: Background Color control with reset + swatch.
  - Gradient: gradient picker panel (see next section).

ASCII layout
```
Border Style  [ Solid v ]

Border Width  [D][T][M]  [PX][EM][REM]
[ 11 ] [ 11 ] [ 11 ] [ 11 ]  [link]
  Top   Right  Bottom  Left

Border Color           (reset) [●]

Border Radius [D][T][M]  [PX][EM][REM]
[  ] [  ] [  ] [  ]     [link]
  Top  Right  Bottom  Left

Padding       [D][T][M]  [PX][EM][REM]
[  ] [  ] [  ] [  ]     [link]

Margin        [D][T][M]  [PX][EM][REM]
[  ] [  ] [  ] [  ]     [link]

Background Type
[ Classic ] [ Gradient ]
Background Color        (reset) [swatch]
```

### Color chooser popover (for Color controls)
Layout description
- Square color picker area with drag point.
- Hue slider and alpha slider.
- Format dropdown (Hex) and a hex input field.
- Color palette row of preset swatches.
- Close/expand icon near the input (popover control).

ASCII layout
```
Color Picker
-------------------------
[  color square (2D)  ]
[ hue slider ]
[ alpha slider ]
Hex [v]   [ #FFFFFF ] [copy]
Colors Palette: [●][●][●][●][●][●]
```

### Gradient chooser (Background Type: Gradient)
Layout description
- Classic/Gradient tabs at top with Gradient active.
- Gradient preview bar with two draggable color stops.
- "Type" dropdown (Linear) and "Angle" input.
- Preset gradient swatches row + "Clear" link.

ASCII layout
```
Background Type
[ Classic ] [ Gradient ]

[ gradient preview bar  o----o ]
Type  [ Linear v ]   Angle [ 135° ]
[preset1][preset2][preset3][preset4][preset5][preset6]
Clear
```

If you want, I can map these exact attribute names to your plugin's schema once you share your block's attribute list.
