# UtilityBar

UtilityBar is a unified header control component that consolidates device switching, link/unlink toggles, and reset buttons across all sidebar panels. It ensures consistent UX patterns for responsive editing, decomposable controls (box models), and comprehensive reset behavior.

## Overview

Located at: `shared/src/components/controls/UtilityBar.js`

UtilityBar is designed to be "intentionally dumb" - it renders controls based solely on props without managing state internally. This makes it highly composable and suitable for use in different control patterns.

## What It Shows

UtilityBar renders up to 4 types of controls in a specific order:

1. **Responsive Enable Button** - Only for toggleable responsive controls (`canBeResponsive` pattern)
2. **Device Switcher** - Shows global/tablet/mobile icons when responsive is active
3. **Link Toggle** - For decomposable controls (padding, margin, border width/radius)
4. **Reset Button** - Shown by default, can be hidden or disabled

Visual layout:
```
[📱 Enable] or [🖥️📱📲 Device Switcher] [🔗 Link Toggle] [↻ Reset]
```

## Core Components

UtilityBar uses three atomic components:

### DeviceSwitcher
- Location: `shared/src/components/controls/atoms/DeviceSwitcher.js`
- Displays 3 icon buttons: Desktop (global), Tablet, Mobile
- Uses **global responsive device state** via `setGlobalResponsiveDevice()`
- Clicking any device switcher updates ALL responsive controls simultaneously
- This ensures synchronized editing across multiple responsive controls

### LinkToggle
- Location: `shared/src/components/controls/atoms/LinkToggle.js`
- Displays link 🔗 or linkOff ⛓️‍💥 icon
- Toggles between linked (all sides same) and unlinked (individual sides) modes
- Used for box model controls: padding, margin, border width, border radius

### ResetButton
- Location: `shared/src/components/controls/ResetButton.js`
- Single button that triggers comprehensive reset
- Can be individually disabled via `resetDisabled` prop
- Restores defaults and clears responsive/decomposed states

## Responsive Patterns

UtilityBar supports two distinct responsive patterns:

### 1. Always-Responsive Pattern
Used when a control is fundamentally responsive and cannot be disabled.

**Props:**
```jsx
<UtilityBar
  isResponsive={true}
  currentDevice={device}
  onReset={handleReset}
/>
```

**Behavior:**
- Shows DeviceSwitcher immediately
- No enable/disable toggle
- User can switch between global/tablet/mobile at any time

**Used by:**
- BoxControl (spacing controls)
- SpacingControl (padding/margin)
- BorderWidthControl
- BorderRadiusControl

### 2. Toggleable Responsive Pattern
Used when responsive mode is optional and must be explicitly enabled.

**Props:**
```jsx
<UtilityBar
  canBeResponsive={true}
  isResponsiveEnabled={responsiveEnabled}
  currentDevice={device}
  onResponsiveToggle={handleResponsiveToggle}
  onReset={handleReset}
/>
```

**Behavior:**
- Initially shows a 📱 "Enable responsive mode" button
- When enabled, button disappears and DeviceSwitcher appears
- When disabled via reset, returns to enable button state

**Used by:**
- SliderWithInput (typography, transforms)
- IconPanel controls (size, offsets)
- SpacingControl, BorderWidthControl, BorderRadiusControl (full controls)

## Decomposable Pattern

For controls that manage 4-sided values (box models), UtilityBar provides link/unlink functionality.

**Props:**
```jsx
<UtilityBar
  isDecomposable={true}
  isLinked={linked}
  onLinkChange={handleLinkChange}
/>
```

**Behavior:**
- Shows LinkToggle component
- When linked: all sides share the same value
- When unlinked: each side can have independent values
- Link toggle only appears when `isDecomposable={true}`

**Used by:**
- SpacingControl (padding/margin sides)
- BoxControl (generic 4-side input)
- BorderWidthControl (border width per side)
- BorderRadiusControl (radius per corner)
- BorderPanel (border width/color/style per side)

## Combining Patterns

UtilityBar can combine responsive + decomposable patterns:

```jsx
<UtilityBar
  isResponsive={true}              // Always-responsive
  isDecomposable={true}             // Box model control
  currentDevice={device}
  isLinked={linked}
  onLinkChange={handleLinkChange}
  onReset={handleReset}
/>
```

This shows: `[🖥️📱📲 Device Switcher] [🔗 Link] [↻ Reset]`

## Reset Semantics

The reset button triggers comprehensive reset behavior:

### For Non-Responsive Controls
- Restores default value
- If decomposable, sets `linked: true`

### For Always-Responsive Controls
- Restores default base/global value
- Removes tablet/mobile overrides
- If decomposable, sets `linked: true`

### For Toggleable Responsive Controls
- Restores default value
- Removes ALL responsive overrides
- Disables responsive mode (back to enable button)
- If decomposable, sets `linked: true`

### Reset Disabled State

The `resetDisabled` prop controls ONLY the reset button:
- Other controls remain clickable
- Typically disabled when current value equals default
- For responsive controls, checks if current device has an override

**Example logic:**
```js
// For responsive controls
const isResetDisabled = device === 'global'
  ? !hasBaseValue
  : !values[device];
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isResponsive` | bool | `false` | Always-responsive mode. Shows DeviceSwitcher immediately. |
| `canBeResponsive` | bool | `false` | Toggleable responsive mode. Shows enable button. |
| `isResponsiveEnabled` | bool | `false` | Current state for toggleable responsive (only used with `canBeResponsive`). |
| `isDecomposable` | bool | `false` | Shows link/unlink toggle for box model controls. |
| `currentDevice` | string | `'global'` | Current device: `'global'`, `'tablet'`, or `'mobile'`. |
| `isLinked` | bool | `true` | Current linked state (only used with `isDecomposable`). |
| `onResponsiveToggle` | function | - | Callback when responsive is enabled. Receives `(enabled: boolean)`. |
| `onLinkChange` | function | - | Callback when link state changes. Receives `(linked: boolean)`. |
| `onReset` | function | - | Comprehensive reset handler. Should restore defaults and clear overrides. |
| `showReset` | bool | `true` | Whether to render the reset button. |
| `resetDisabled` | bool | `false` | Disables only the reset button (other controls remain active). |
| `disabled` | bool | `false` | Disables ALL controls in the utility bar. |

## Implementation Examples

### Example 1: BoxControl (Always-Responsive + Decomposable)

From `shared/src/components/controls/BoxControl.js:273-282`:

```jsx
<UtilityBar
  isResponsive={responsive}        // Always-responsive
  isDecomposable={true}            // Box model control
  currentDevice={device}
  isLinked={linked}
  onLinkChange={handleLinkToggle}
  onReset={handleReset}
  resetDisabled={isResetDisabled}
/>
```

**Reset behavior:**
```js
const handleReset = () => {
  if (onReset) {
    onReset(device);
  } else {
    onChange(device, undefined);  // Clear current device value
  }
};
```

### Example 2: SpacingControl (Toggleable Responsive + Decomposable)

From `shared/src/components/controls/full/SpacingControl.js:306-316`:

```jsx
<UtilityBar
  canBeResponsive={canBeResponsive}
  isResponsiveEnabled={responsiveEnabled}
  currentDevice={device}
  isDecomposable={true}
  isLinked={linked}
  onResponsiveToggle={onResponsiveToggle}
  onLinkChange={handleLinkChange}
  onReset={handleComprehensiveReset}
  disabled={disabled}
/>
```

**Comprehensive reset:**
```js
const handleComprehensiveReset = () => {
  // Reset to defaults with linked: true
  const resetValue = {
    top: 0, right: 0, bottom: 0, left: 0,
    unit: 'px',
    linked: true,
  };
  onChange(resetValue);

  // Also disable responsive mode
  if (canBeResponsive && onResponsiveReset) {
    onResponsiveReset();
  }
};
```

### Example 3: BorderPanel (Decomposable with Lock Option)

From `shared/src/components/controls/full/BorderPanel.js:363-371`:

```jsx
<UtilityBar
  isResponsive={responsive}
  currentDevice={device}
  isDecomposable={!lockLinked}     // Can hide link toggle
  isLinked={linked}
  onLinkChange={handleLinkChange}
  onReset={handleReset}
  disabled={disabled}
/>
```

**Special feature:** `lockLinked` prop forces linked mode and hides the link toggle.

### Example 5: BorderWidthControl (Using Reset Helpers)

From `shared/src/components/controls/full/BorderWidthControl.js:147-155`:

```jsx
<UtilityBar
  isResponsive={responsive}
  currentDevice={device}
  isDecomposable={true}
  isLinked={linked}
  onLinkChange={handleLinkChange}
  onReset={comprehensiveReset}     // Uses helper function
  disabled={disabled}
/>
```

**Comprehensive reset helper:**
```js
const comprehensiveReset = createComprehensiveReset({
  attributes,
  setAttributes,
  attrName: 'borderWidth',
  canBeResponsive: false,  // Always-on responsive
  isDecomposable: true,
});
```

From `shared/src/utils/reset-helpers.js`, this helper:
1. Restores schema default value
2. Removes tablet/mobile overrides
3. Forces `linked: true`
4. Optionally disables responsive mode

## Where UtilityBar Is Used

### 1. BoxControl
**File:** `shared/src/components/controls/BoxControl.js`
**Pattern:** Always-responsive + Decomposable
**Line:** 273-282

Generic 4-side input control for padding, margin, or custom box values.

### 2. SpacingControl
**File:** `shared/src/components/controls/full/SpacingControl.js`
**Pattern:** Toggleable Responsive + Decomposable
**Line:** 306-316

Compact spacing control with icon, value, unit, slider. Supports `sides` prop to limit which sides are controllable (e.g., only top/bottom for margins).

### 3. BorderWidthControl
**File:** `shared/src/components/controls/full/BorderWidthControl.js`
**Pattern:** Always-responsive + Decomposable
**Line:** 147-155
**Reset:** Uses `createComprehensiveReset` from `shared/src/utils/reset-helpers.js`

Compact border width control with style icon, value, unit, and slider.

### 4. BorderRadiusControl
**File:** `shared/src/components/controls/full/BorderRadiusControl.js`
**Pattern:** Always-responsive + Decomposable
**Line:** 181-189
**Reset:** Uses `createComprehensiveReset` from `shared/src/utils/reset-helpers.js`

Border radius control for 4 corners (topLeft, topRight, bottomRight, bottomLeft).

### 5. BorderPanel
**File:** `shared/src/components/controls/full/BorderPanel.js`
**Pattern:** Always-responsive + Conditionally Decomposable
**Line:** 363-371

Unified border control managing width, color, and style for all sides. Supports `lockLinked` prop to force linked mode.

### 6. IconPanel
**File:** `shared/src/components/controls/IconPanel.js`
**Pattern:** Toggleable Responsive (direct usage)
**Lines:** Multiple instances in SingleIconMode and IconStateControls components

IconPanel uses UtilityBar directly for responsive icon size and offset controls (iconInactiveSize, iconInactiveMaxSize, iconInactiveOffsetX, iconInactiveOffsetY, and corresponding active state controls). Each control uses the toggleable responsive pattern with BaseControl + UtilityBar in the label.

### 7. SliderWithInput (Typography Pattern)
**File:** `shared/src/components/controls/SliderWithInput.js`
**Pattern:** Toggleable Responsive (via ResponsiveToggle, not UtilityBar directly)
**Line:** 457-464

**Note:** SliderWithInput uses `ResponsiveToggle` instead of UtilityBar directly. ResponsiveToggle is a specialized variant that combines the responsive enable button, device switcher, AND reset button into one component. This is used for typography controls like font-size, line-height, etc.

## Architecture Notes

### Global Responsive Device State

UtilityBar relies on a global responsive device state managed by:
- **Setter:** `setGlobalResponsiveDevice(device)` in `shared/src/utils/responsive-device.js`
- **Hook:** `useResponsiveDevice()` consumed by all responsive controls

**Benefits:**
- Single source of truth for current device
- All responsive controls stay synchronized
- DeviceSwitcher clicks update entire editor simultaneously
- Preview width changes reflect the active device

### Component Hierarchy

```
UtilityBar (orchestrator)
├── DeviceSwitcher (global state, 3 buttons)
├── LinkToggle (local state, 1 button)
└── ResetButton (callback-based, 1 button)
```

### Separation of Concerns

UtilityBar is stateless and only:
- Determines WHICH controls to show based on props
- Renders controls in consistent order
- Delegates all behavior to callbacks

This makes it:
- Easy to test
- Highly reusable
- Predictable in behavior
- Simple to extend

### Visual Consistency

All UtilityBars across the sidebar have:
- Same horizontal layout (Flex with gap: 1)
- Same small button sizes (`isSmall`)
- Same spacing and alignment
- Same disabled states

This creates a cohesive editing experience across different control types.

## Best Practices

1. **Always provide `onReset`** - Implement comprehensive reset that clears all related state
2. **Use `resetDisabled` correctly** - Only disable when value equals default
3. **Combine patterns intentionally** - Responsive + Decomposable is common for box models
4. **Respect global device state** - Don't override device from UtilityBar
5. **Handle responsive callbacks** - For toggleable responsive, implement both `onResponsiveToggle` and reset logic
6. **Document control patterns** - Make it clear which pattern your control uses
7. **Use UtilityBar directly** - Wrap controls with BaseControl and include UtilityBar in the label (see SpacingControl or IconPanel for examples)
8. **Never read schema metadata in custom panels** - Schema showWhen/ranges are for ControlRenderer only
