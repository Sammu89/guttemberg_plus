# Typography Panel Redesign - Implementation Plan

> **For AI Agent Implementation** - All details needed to implement without ambiguity.

## Project Context

- **Project Root:** `/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/`
- **Framework:** WordPress Gutenberg blocks with React
- **Component Library:** `@wordpress/components`, `@wordpress/block-editor`
- **State Management:** React hooks, global device sync via custom events

---

## PHASE 1: Fix Responsive Device Sync

### Problem
`SliderWithInput.js` uses local `useState` for device selection, causing font-size responsive controls to be out of sync with other responsive controls (like BorderPanel).

### Solution
Use the existing `useResponsiveDevice()` hook for global sync.

### File to Modify
`/home/sammu/Local Sites/nome-do-site/app/public/wp-content/plugins/guttemberg-plus/dev/shared/src/components/controls/SliderWithInput.js`

### Implementation
```javascript
// REMOVE local state:
// const [device, setDevice] = useState('desktop');

// ADD import:
import { useResponsiveDevice } from '../../hooks/useResponsiveDevice';

// USE global hook instead:
const device = useResponsiveDevice();
```

### Reference Files
- Hook location: `shared/src/hooks/useResponsiveDevice.js`
- Global state: `shared/src/utils/responsive-device.js`
- Example usage: `shared/src/components/controls/full/SpacingControl.js`

---

## PHASE 2: Remove Unnecessary Elements

### 2.1 Remove Font Preview Panel

**File:** `shared/src/components/controls/FontFamilyControl.js`

**DELETE lines 88-113** (the preview section):
```javascript
// DELETE THIS ENTIRE BLOCK:
{ value && (
    <div
        className="gutplus-font-preview"
        style={ { ... } }
    >
        <div style={ { ... } }>
            Preview:
        </div>
        { previewText }
    </div>
) }
```

### 2.2 Remove Justify from Alignment

**File:** `shared/src/components/controls/AlignmentControl.js`

**Find the options array and REMOVE the justify option:**
```javascript
// REMOVE this option:
{ key: 'justify', icon: <JustifyIcon />, label: 'Justify' }
```

---

## PHASE 3: Create New Components

### Directory Structure
```
shared/src/components/controls/
├── atoms/
│   └── ToggleChip.js           ← NEW
├── molecules/
│   ├── FormattingToggleGroup.js ← NEW
│   ├── FontWeightSlider.js      ← NEW
│   ├── TextDecorationPanel.js   ← NEW
│   └── DecorationWidthControl.js ← NEW
└── FormattingControl.js          ← NEW (organism)
```

### 3.1 ToggleChip Atom

**Create:** `shared/src/components/controls/atoms/ToggleChip.js`

```javascript
/**
 * ToggleChip - Atomic toggle button for multi-select groups
 */
import { Button } from '@wordpress/components';

export function ToggleChip({ icon, label, isActive, onClick, disabled = false }) {
    return (
        <Button
            className={`gutplus-toggle-chip ${isActive ? 'is-active' : ''}`}
            onClick={onClick}
            disabled={disabled}
            aria-pressed={isActive}
            icon={icon}
            label={label}
            showTooltip
        />
    );
}
```

**CSS (add to lego-controls.scss):**
```scss
.gutplus-toggle-chip {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: transparent;

    &.is-active {
        background: var(--wp-admin-theme-color);
        color: white;
        border-color: var(--wp-admin-theme-color);
    }
}
```

### 3.2 FormattingToggleGroup Molecule

**Create:** `shared/src/components/controls/molecules/FormattingToggleGroup.js`

```javascript
/**
 * FormattingToggleGroup - Multi-select toggle group for text formatting
 *
 * Options: None, Bold, Italic, Underline, Overline, Line-through
 * 'None' is exclusive - clears all others when clicked
 */
import { ButtonGroup } from '@wordpress/components';
import { ToggleChip } from '../atoms/ToggleChip';
import {
    formatBold,
    formatItalic,
    formatUnderline,
    formatStrikethrough,
    reset  // For 'None' icon
} from '@wordpress/icons';

// Custom icons needed for overline (not in @wordpress/icons)
const OverlineIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M5 4h14v1.5H5V4zm3 6h8v10H8V10z" />
    </svg>
);

const OPTIONS = [
    { key: 'none', icon: reset, label: 'None', exclusive: true },
    { key: 'bold', icon: formatBold, label: 'Bold' },
    { key: 'italic', icon: formatItalic, label: 'Italic' },
    { key: 'underline', icon: formatUnderline, label: 'Underline' },
    { key: 'overline', icon: OverlineIcon, label: 'Overline' },
    { key: 'line-through', icon: formatStrikethrough, label: 'Strikethrough' },
];

export function FormattingToggleGroup({ value = [], onChange, disabled = false }) {
    const handleToggle = (key) => {
        const option = OPTIONS.find(o => o.key === key);

        if (option?.exclusive) {
            // 'None' clears all selections
            onChange([]);
            return;
        }

        // Toggle the option
        if (value.includes(key)) {
            onChange(value.filter(k => k !== key));
        } else {
            onChange([...value, key]);
        }
    };

    // 'None' is active when no other options are selected
    const isNoneActive = value.length === 0;

    return (
        <div className="gutplus-formatting-toggle-group">
            <ButtonGroup>
                {OPTIONS.map(option => (
                    <ToggleChip
                        key={option.key}
                        icon={option.icon}
                        label={option.label}
                        isActive={option.exclusive ? isNoneActive : value.includes(option.key)}
                        onClick={() => handleToggle(option.key)}
                        disabled={disabled}
                    />
                ))}
            </ButtonGroup>
        </div>
    );
}
```

### 3.3 FontWeightSlider Molecule

**Create:** `shared/src/components/controls/molecules/FontWeightSlider.js`

```javascript
/**
 * FontWeightSlider - Slider for font-weight (100-900)
 * Shows when 'bold' is selected in FormattingToggleGroup
 */
import { RangeControl } from '@wordpress/components';

const WEIGHT_LABELS = {
    100: 'Thin',
    200: 'Extra Light',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'Semi Bold',
    700: 'Bold',
    800: 'Extra Bold',
    900: 'Black',
};

export function FontWeightSlider({ value = 400, onChange, disabled = false }) {
    return (
        <div className="gutplus-font-weight-slider">
            <RangeControl
                label="Font Weight"
                value={value}
                onChange={onChange}
                min={100}
                max={900}
                step={100}
                marks={[
                    { value: 100, label: '100' },
                    { value: 400, label: '400' },
                    { value: 700, label: '700' },
                    { value: 900, label: '900' },
                ]}
                disabled={disabled}
                help={WEIGHT_LABELS[value] || ''}
                __nextHasNoMarginBottom
            />
        </div>
    );
}
```

### 3.4 DecorationWidthControl Atom

**Create:** `shared/src/components/controls/molecules/DecorationWidthControl.js`

```javascript
/**
 * DecorationWidthControl - Slider + presets for text-decoration-thickness
 * Presets: auto, thin
 * Slider: 1-10px
 */
import { useState } from '@wordpress/element';
import { RangeControl, ButtonGroup, Button } from '@wordpress/components';

const PRESETS = ['auto', 'thin'];

export function DecorationWidthControl({ value = 'auto', onChange, disabled = false }) {
    // Parse value to determine if it's a preset or px value
    const isPreset = PRESETS.includes(value);
    const numericValue = isPreset ? 2 : parseInt(value, 10) || 2;

    const handlePresetClick = (preset) => {
        onChange(preset);
    };

    const handleSliderChange = (num) => {
        onChange(`${num}px`);
    };

    return (
        <div className="gutplus-decoration-width-control">
            <div className="gutplus-decoration-width-control__presets">
                <ButtonGroup>
                    {PRESETS.map(preset => (
                        <Button
                            key={preset}
                            variant={value === preset ? 'primary' : 'secondary'}
                            onClick={() => handlePresetClick(preset)}
                            disabled={disabled}
                        >
                            {preset}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            <RangeControl
                label="Custom Width"
                value={numericValue}
                onChange={handleSliderChange}
                min={1}
                max={10}
                step={1}
                disabled={disabled}
                __nextHasNoMarginBottom
            />
        </div>
    );
}
```

### 3.5 TextDecorationPanel Molecule

**Create:** `shared/src/components/controls/molecules/TextDecorationPanel.js`

```javascript
/**
 * TextDecorationPanel - Color, Style, Width controls for text decorations
 * Shows when underline/overline/line-through is active
 * Shared settings apply to all active decorations
 */
import { BaseControl, SelectControl } from '@wordpress/components';
import { ColorControl } from '../ColorControl';
import { DecorationWidthControl } from './DecorationWidthControl';

const STYLE_OPTIONS = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'wavy', label: 'Wavy' },
    { value: 'double', label: 'Double' },
];

export function TextDecorationPanel({
    color = 'currentColor',
    style = 'solid',
    width = 'auto',
    textColor,  // For default color inheritance
    onChange,
    disabled = false,
}) {
    const handleChange = (key, value) => {
        onChange({ color, style, width, [key]: value });
    };

    return (
        <div className="gutplus-text-decoration-panel">
            <BaseControl label="Decoration Settings" __nextHasNoMarginBottom>
                <div className="gutplus-text-decoration-panel__controls">
                    <ColorControl
                        label="Color"
                        value={color === 'currentColor' ? textColor : color}
                        onChange={(newColor) => handleChange('color', newColor || 'currentColor')}
                        disabled={disabled}
                    />

                    <SelectControl
                        label="Style"
                        value={style}
                        options={STYLE_OPTIONS}
                        onChange={(newStyle) => handleChange('style', newStyle)}
                        disabled={disabled}
                        __nextHasNoMarginBottom
                    />

                    <DecorationWidthControl
                        value={width}
                        onChange={(newWidth) => handleChange('width', newWidth)}
                        disabled={disabled}
                    />
                </div>
            </BaseControl>
        </div>
    );
}
```

### 3.6 FormattingControl Organism

**Create:** `shared/src/components/controls/FormattingControl.js`

```javascript
/**
 * FormattingControl - Main formatting control organism
 * Replaces AppearanceControl + DecorationControl
 *
 * Features:
 * - Multi-select: None, Bold, Italic, Underline, Overline, Line-through
 * - Bold → shows FontWeightSlider (100-900)
 * - Any decoration → shows TextDecorationPanel (color, style, width)
 */
import { BaseControl } from '@wordpress/components';
import { FormattingToggleGroup } from './molecules/FormattingToggleGroup';
import { FontWeightSlider } from './molecules/FontWeightSlider';
import { TextDecorationPanel } from './molecules/TextDecorationPanel';

const DECORATION_KEYS = ['underline', 'overline', 'line-through'];

export function FormattingControl({
    value = {},
    textColor,
    onChange,
    label = 'Formatting',
    disabled = false,
}) {
    const {
        formatting = [],
        fontWeight = 400,
        decorationColor = 'currentColor',
        decorationStyle = 'solid',
        decorationWidth = 'auto',
    } = value;

    const hasBold = formatting.includes('bold');
    const hasDecoration = formatting.some(f => DECORATION_KEYS.includes(f));

    const handleFormattingChange = (newFormatting) => {
        onChange({ ...value, formatting: newFormatting });
    };

    const handleWeightChange = (newWeight) => {
        onChange({ ...value, fontWeight: newWeight });
    };

    const handleDecorationChange = ({ color, style, width }) => {
        onChange({
            ...value,
            decorationColor: color,
            decorationStyle: style,
            decorationWidth: width,
        });
    };

    return (
        <BaseControl label={label} className="gutplus-formatting-control" __nextHasNoMarginBottom>
            <FormattingToggleGroup
                value={formatting}
                onChange={handleFormattingChange}
                disabled={disabled}
            />

            {hasBold && (
                <FontWeightSlider
                    value={fontWeight}
                    onChange={handleWeightChange}
                    disabled={disabled}
                />
            )}

            {hasDecoration && (
                <TextDecorationPanel
                    color={decorationColor}
                    style={decorationStyle}
                    width={decorationWidth}
                    textColor={textColor}
                    onChange={handleDecorationChange}
                    disabled={disabled}
                />
            )}
        </BaseControl>
    );
}

export default FormattingControl;
```

---

## PHASE 4: Update ControlRenderer

**File:** `shared/src/components/ControlRenderer.js`

Add case for FormattingControl:

```javascript
// Add import at top:
import { FormattingControl } from './controls/FormattingControl';

// Add case in switch statement (around line 900):
case 'FormattingControl':
    return (
        <FormattingControl
            key={attrName}
            value={{
                formatting: attributes[attrName] || [],
                fontWeight: attributes.titleFontWeight || 400,
                decorationColor: attributes.titleDecorationColor || 'currentColor',
                decorationStyle: attributes.titleDecorationStyle || 'solid',
                decorationWidth: attributes.titleDecorationWidth || 'auto',
            }}
            textColor={effectiveValues?.titleColor}
            onChange={(newValue) => {
                setAttributes({
                    [attrName]: newValue.formatting,
                    titleFontWeight: newValue.fontWeight,
                    titleDecorationColor: newValue.decorationColor,
                    titleDecorationStyle: newValue.decorationStyle,
                    titleDecorationWidth: newValue.decorationWidth,
                });
            }}
            label={attrConfig.label}
            disabled={disabled}
        />
    );
```

---

## PHASE 5: Update Schema

**File:** `schemas/accordion.json`

### Add New Attributes (in "attributes" section, typography group):

```json
"titleFormatting": {
    "type": "array",
    "default": [],
    "label": "Formatting",
    "description": "Text formatting options (bold, italic, underline, overline, line-through)",
    "group": "typography",
    "subgroup": "Header",
    "order": 3,
    "control": "FormattingControl",
    "appliesTo": "title",
    "themeable": true
},
"titleFontWeight": {
    "type": "number",
    "default": 400,
    "label": "Font Weight",
    "description": "Font weight for title (100-900)",
    "group": "typography",
    "subgroup": "Header",
    "order": 4,
    "min": 100,
    "max": 900,
    "step": 100,
    "appliesTo": "title",
    "cssVar": "accordion-title-font-weight",
    "cssProperty": "font-weight",
    "themeable": true,
    "outputsCSS": true
},
"titleDecorationColor": {
    "type": "string",
    "default": "currentColor",
    "label": "Decoration Color",
    "description": "Color for text decorations",
    "group": "typography",
    "subgroup": "Header",
    "order": 5,
    "control": "ColorControl",
    "appliesTo": "title",
    "cssVar": "accordion-title-decoration-color",
    "cssProperty": "text-decoration-color",
    "themeable": true,
    "outputsCSS": true
},
"titleDecorationStyle": {
    "type": "string",
    "default": "solid",
    "label": "Decoration Style",
    "description": "Style for text decorations",
    "group": "typography",
    "subgroup": "Header",
    "order": 6,
    "options": [
        { "value": "solid", "label": "Solid" },
        { "value": "dashed", "label": "Dashed" },
        { "value": "dotted", "label": "Dotted" },
        { "value": "wavy", "label": "Wavy" },
        { "value": "double", "label": "Double" }
    ],
    "appliesTo": "title",
    "cssVar": "accordion-title-decoration-style",
    "cssProperty": "text-decoration-style",
    "themeable": true,
    "outputsCSS": true
},
"titleDecorationWidth": {
    "type": "string",
    "default": "auto",
    "label": "Decoration Width",
    "description": "Thickness of text decorations",
    "group": "typography",
    "subgroup": "Header",
    "order": 7,
    "appliesTo": "title",
    "cssVar": "accordion-title-decoration-width",
    "cssProperty": "text-decoration-thickness",
    "themeable": true,
    "outputsCSS": true
}
```

### Remove/Deprecate Old Attributes:
- `titleAppearance` - replaced by `titleFormatting` + `titleFontWeight`
- `titleTextDecoration` - replaced by `titleFormatting` array

---

## PHASE 6: Update edit.js

**File:** `blocks/accordion/src/edit.js`

### Find the styles building section (around line 225-260) and update:

```javascript
// Build font-weight from formatting selection
const titleFormatting = effectiveValues.titleFormatting || [];
const fontWeight = titleFormatting.includes('bold')
    ? (effectiveValues.titleFontWeight || 400)
    : 400;

// Build font-style from formatting selection
const fontStyle = titleFormatting.includes('italic')
    ? 'italic'
    : 'normal';

// Build text-decoration from formatting selection
const decorationLines = titleFormatting.filter(f =>
    ['underline', 'overline', 'line-through'].includes(f)
);
const hasDecoration = decorationLines.length > 0;
const textDecorationLine = hasDecoration
    ? decorationLines.join(' ')
    : 'none';

// Apply to title styles object
const titleStyles = {
    // ... existing styles ...
    fontWeight,
    fontStyle,
    textDecorationLine,
    textDecorationColor: hasDecoration
        ? (effectiveValues.titleDecorationColor || 'currentColor')
        : undefined,
    textDecorationStyle: hasDecoration
        ? (effectiveValues.titleDecorationStyle || 'solid')
        : undefined,
    textDecorationThickness: hasDecoration
        ? (effectiveValues.titleDecorationWidth || 'auto')
        : undefined,
};
```

---

## PHASE 7: Update save.js

**File:** `blocks/accordion/src/save.js`

### In getCustomizationStyles function, add handling for new attributes:

```javascript
// Handle titleFormatting array to build text-decoration-line
const titleFormatting = customizations.titleFormatting || [];
const decorationLines = titleFormatting.filter(f =>
    ['underline', 'overline', 'line-through'].includes(f)
);
if (decorationLines.length > 0) {
    styles['--accordion-title-text-decoration-line'] = decorationLines.join(' ');
}

// Font weight (only if bold is selected)
if (titleFormatting.includes('bold') && customizations.titleFontWeight) {
    styles['--accordion-title-font-weight'] = customizations.titleFontWeight;
}

// Font style (only if italic is selected)
if (titleFormatting.includes('italic')) {
    styles['--accordion-title-font-style'] = 'italic';
}

// Decoration styling (only if any decoration is active)
if (decorationLines.length > 0) {
    if (customizations.titleDecorationColor) {
        styles['--accordion-title-decoration-color'] = customizations.titleDecorationColor;
    }
    if (customizations.titleDecorationStyle) {
        styles['--accordion-title-decoration-style'] = customizations.titleDecorationStyle;
    }
    if (customizations.titleDecorationWidth) {
        styles['--accordion-title-decoration-width'] = customizations.titleDecorationWidth;
    }
}
```

---

## PHASE 8: Update CSS

**File:** `blocks/accordion/src/style.scss`

### Add CSS variable usage for new properties:

```scss
.accordion-title {
    // ... existing styles ...

    // Typography formatting
    font-weight: var(--accordion-title-font-weight, 600);
    font-style: var(--accordion-title-font-style, normal);
    text-decoration-line: var(--accordion-title-text-decoration-line, none);
    text-decoration-color: var(--accordion-title-decoration-color, currentColor);
    text-decoration-style: var(--accordion-title-decoration-style, solid);
    text-decoration-thickness: var(--accordion-title-decoration-width, auto);
}
```

---

## CSS Variable Mappings Summary

| Attribute | CSS Variable | CSS Property |
|-----------|--------------|--------------|
| titleFontWeight | --accordion-title-font-weight | font-weight |
| titleDecorationColor | --accordion-title-decoration-color | text-decoration-color |
| titleDecorationStyle | --accordion-title-decoration-style | text-decoration-style |
| titleDecorationWidth | --accordion-title-decoration-width | text-decoration-thickness |

---

## Testing Checklist

After implementation, verify:

- [ ] Font-size responsive sync works across all devices (desktop/tablet/mobile icons sync)
- [ ] Multiple formatting options can be selected simultaneously (Bold + Underline)
- [ ] 'None' button clears all formatting selections
- [ ] Bold selection shows font-weight slider (100-900, step 100)
- [ ] Any decoration (underline/overline/line-through) shows decoration panel
- [ ] Decoration panel has color picker, style dropdown, width slider+presets
- [ ] Width control has "auto" and "thin" presets plus 1-10px slider
- [ ] Text alignment no longer shows justify option
- [ ] Font family control has no preview panel
- [ ] CSS variables output correctly in save.js (check frontend HTML)
- [ ] Editor preview matches frontend rendering
- [ ] Run `npm run build` - should pass all validations

---

## Build Command

After implementation:
```bash
npm run build
```

This will:
1. Compile schemas
2. Generate CSS
3. Bundle JavaScript
4. Validate all attributes and controls
