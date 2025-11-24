/**
 * Control Configuration
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json, tabs.json, toc.json
 * Generated at: 2025-11-24T23:11:16.773Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

/**
 * This file contains control configuration (min, max, options) for all block attributes.
 * Import this to get dynamic control properties from the schema instead of hardcoding.
 *
 * Usage:
 *   import { getControlConfig } from '@shared/config/control-config-generated';
 *   const config = getControlConfig('accordion', 'iconRotation');
 *   // { min: 0, max: 360, unit: 'deg', ... }
 */

// Control configuration for all blocks
const CONTROL_CONFIGS = {
  'accordion': {
    'headingLevel': {
      control: 'SelectControl',
      options: [
              "none",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6"
      ],
      label: 'Heading Level',
      description: 'Semantic HTML heading level (none, h1-h6)',
      default: 'none',
    },
    'titleColor': {
      control: 'ColorPicker',
      label: 'Title Color',
      description: 'Text color for the accordion title',
      default: '#333333',
    },
    'titleBackgroundColor': {
      control: 'ColorPicker',
      label: 'Title Background',
      description: 'Background color for the accordion title',
      default: '#f5f5f5',
    },
    'hoverTitleColor': {
      control: 'ColorPicker',
      label: 'Title Hover Color',
      description: 'Text color when hovering over title',
      default: '#000000',
    },
    'hoverTitleBackgroundColor': {
      control: 'ColorPicker',
      label: 'Title Hover Background',
      description: 'Background color when hovering over title',
      default: '#e8e8e8',
    },
    'contentColor': {
      control: 'ColorPicker',
      label: 'Content Color',
      description: 'Text color for accordion content',
      default: '#333333',
    },
    'contentBackgroundColor': {
      control: 'ColorPicker',
      label: 'Content Background',
      description: 'Background color for accordion content',
      default: '#ffffff',
    },
    'accordionBorderColor': {
      control: 'ColorPicker',
      label: 'Accordion Border Color',
      description: 'Color of the accordion border (alias)',
      default: '#dddddd',
    },
    'dividerBorderColor': {
      control: 'ColorPicker',
      label: 'Divider Color',
      description: 'Color of divider between title and content',
      default: '#dddddd',
    },
    'iconColor': {
      control: 'ColorPicker',
      label: 'Icon Color',
      description: 'Color of the expand/collapse icon',
      default: '#666666',
    },
    'titleFontSize': {
      control: 'RangeControl',
      min: 10,
      max: 48,
      unit: 'px',
      label: 'Title Font Size',
      description: 'Font size for the title in pixels',
      default: '18px',
    },
    'titleFontWeight': {
      control: 'SelectControl',
      options: [
              {
                      "label": "100",
                      "value": "100"
              },
              {
                      "label": "200",
                      "value": "200"
              },
              {
                      "label": "300",
                      "value": "300"
              },
              {
                      "label": "400",
                      "value": "400"
              },
              {
                      "label": "500",
                      "value": "500"
              },
              {
                      "label": "600",
                      "value": "600"
              },
              {
                      "label": "700",
                      "value": "700"
              },
              {
                      "label": "800",
                      "value": "800"
              },
              {
                      "label": "900",
                      "value": "900"
              },
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Bold",
                      "value": "bold"
              }
      ],
      label: 'Title Font Weight',
      description: 'Font weight for the title',
      default: '600',
    },
    'titleFontFamily': {
      control: 'FontFamilyControl',
      label: 'Title Font Family',
      description: 'Font family for the title',
    },
    'titleLineHeight': {
      control: 'RangeControl',
      min: 1,
      max: 3,
      label: 'Title Line Height',
      description: 'Line height for the title',
    },
    'titleFontStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Italic",
                      "value": "italic"
              },
              {
                      "label": "Oblique",
                      "value": "oblique"
              }
      ],
      label: 'Title Font Style',
      description: 'Font style for the title',
      default: 'normal',
    },
    'titleTextTransform': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Uppercase",
                      "value": "uppercase"
              },
              {
                      "label": "Lowercase",
                      "value": "lowercase"
              },
              {
                      "label": "Capitalize",
                      "value": "capitalize"
              }
      ],
      label: 'Title Text Transform',
      description: 'Text transformation for the title',
      default: 'none',
    },
    'titleTextDecoration': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Underline",
                      "value": "underline"
              },
              {
                      "label": "Overline",
                      "value": "overline"
              },
              {
                      "label": "Line Through",
                      "value": "line-through"
              }
      ],
      label: 'Title Text Decoration',
      description: 'Text decoration for the title',
      default: 'none',
    },
    'titleAlignment': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Title Alignment',
      description: 'Text alignment for the title',
      default: 'left',
    },
    'contentFontSize': {
      control: 'RangeControl',
      min: 10,
      max: 36,
      unit: 'px',
      label: 'Content Font Size',
      description: 'Font size for content in pixels',
      default: '16px',
    },
    'contentFontWeight': {
      control: 'SelectControl',
      options: [
              {
                      "label": "100",
                      "value": "100"
              },
              {
                      "label": "200",
                      "value": "200"
              },
              {
                      "label": "300",
                      "value": "300"
              },
              {
                      "label": "400",
                      "value": "400"
              },
              {
                      "label": "500",
                      "value": "500"
              },
              {
                      "label": "600",
                      "value": "600"
              },
              {
                      "label": "700",
                      "value": "700"
              },
              {
                      "label": "800",
                      "value": "800"
              },
              {
                      "label": "900",
                      "value": "900"
              },
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Bold",
                      "value": "bold"
              }
      ],
      label: 'Content Font Weight',
      description: 'Font weight for content',
    },
    'contentFontFamily': {
      control: 'FontFamilyControl',
      label: 'Content Font Family',
      description: 'Font family for content',
    },
    'contentLineHeight': {
      control: 'RangeControl',
      min: 1,
      max: 3,
      label: 'Content Line Height',
      description: 'Line height for content',
      default: 1.6,
    },
    'contentFontStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Italic",
                      "value": "italic"
              },
              {
                      "label": "Oblique",
                      "value": "oblique"
              }
      ],
      label: 'Content Font Style',
      description: 'Font style for content',
    },
    'contentTextTransform': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Uppercase",
                      "value": "uppercase"
              },
              {
                      "label": "Lowercase",
                      "value": "lowercase"
              },
              {
                      "label": "Capitalize",
                      "value": "capitalize"
              }
      ],
      label: 'Content Text Transform',
      description: 'Text transformation for content',
    },
    'contentTextDecoration': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Underline",
                      "value": "underline"
              },
              {
                      "label": "Overline",
                      "value": "overline"
              },
              {
                      "label": "Line Through",
                      "value": "line-through"
              }
      ],
      label: 'Content Text Decoration',
      description: 'Text decoration for content',
    },
    'accordionBorderThickness': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Border Width',
      description: 'Thickness of the accordion border in pixels',
      default: '1px',
    },
    'accordionBorderStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Solid",
                      "value": "solid"
              },
              {
                      "label": "Dashed",
                      "value": "dashed"
              },
              {
                      "label": "Dotted",
                      "value": "dotted"
              },
              {
                      "label": "Double",
                      "value": "double"
              },
              {
                      "label": "Groove",
                      "value": "groove"
              },
              {
                      "label": "Ridge",
                      "value": "ridge"
              },
              {
                      "label": "Inset",
                      "value": "inset"
              },
              {
                      "label": "Outset",
                      "value": "outset"
              },
              {
                      "label": "Hidden",
                      "value": "hidden"
              }
      ],
      label: 'Border Style',
      description: 'Style of the accordion border',
      default: 'solid',
    },
    'accordionBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Border Radius',
      description: 'Corner radius of the accordion',
    },
    'accordionShadow': {
      control: 'TextControl',
      label: 'Shadow',
      description: 'CSS box-shadow for the accordion item',
      default: 'none',
    },
    'accordionShadowHover': {
      control: 'TextControl',
      label: 'Shadow on Hover',
      description: 'CSS box-shadow for the accordion item on hover',
      default: 'none',
    },
    'dividerBorderThickness': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Divider Width',
      description: 'Thickness of divider between title and content',
      default: '0px',
    },
    'dividerBorderStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Solid",
                      "value": "solid"
              },
              {
                      "label": "Dashed",
                      "value": "dashed"
              },
              {
                      "label": "Dotted",
                      "value": "dotted"
              },
              {
                      "label": "Double",
                      "value": "double"
              },
              {
                      "label": "Groove",
                      "value": "groove"
              },
              {
                      "label": "Ridge",
                      "value": "ridge"
              },
              {
                      "label": "Inset",
                      "value": "inset"
              },
              {
                      "label": "Outset",
                      "value": "outset"
              },
              {
                      "label": "Hidden",
                      "value": "hidden"
              }
      ],
      label: 'Divider Style',
      description: 'Style of divider between title and content',
      default: 'solid',
    },
    'titlePadding': {
      control: 'SpacingControl',
      unit: 'px',
      label: 'Title Padding',
      description: 'Padding inside the title area',
    },
    'contentPadding': {
      control: 'SpacingControl',
      unit: 'px',
      label: 'Content Padding',
      description: 'Padding inside the content area',
    },
    'accordionMarginBottom': {
      control: 'RangeControl',
      min: 0,
      max: 50,
      unit: 'px',
      label: 'Margin Bottom',
      description: 'Space between accordion blocks',
      default: '8px',
    },
    'itemSpacing': {
      control: 'RangeControl',
      min: 0,
      max: 50,
      unit: 'px',
      label: 'Item Spacing',
      description: 'Spacing between items',
    },
    'showIcon': {
      control: 'ToggleControl',
      label: 'Show Icon',
      description: 'Display expand/collapse icon',
      default: true,
    },
    'iconPosition': {
      control: 'SelectControl',
      options: [
              "left",
              "right",
              "extreme-left",
              "extreme-right"
      ],
      label: 'Icon Position',
      description: 'Position of icon relative to title',
      default: 'right',
    },
    'iconSize': {
      control: 'RangeControl',
      min: 10,
      max: 48,
      unit: 'px',
      label: 'Icon Size',
      description: 'Size of the icon in pixels',
      default: '20px',
    },
    'iconTypeClosed': {
      control: 'IconPicker',
      label: 'Closed Icon',
      description: 'Icon when accordion is closed',
      default: '▾',
    },
    'iconTypeOpen': {
      control: 'IconPicker',
      label: 'Open Icon',
      description: 'Icon when accordion is open (none = use just iconTypeClosed with rotation)',
      default: 'none',
    },
    'iconRotation': {
      control: 'RangeControl',
      min: -360,
      max: 360,
      unit: 'deg',
      label: 'Icon Rotation',
      description: 'Rotation angle when open (degrees)',
      default: '180deg',
    },
  },
  'tabs': {
    'orientation': {
      control: 'SelectControl',
      options: [
              "horizontal",
              "vertical"
      ],
      label: 'Orientation',
      description: 'Tab layout orientation',
      default: 'horizontal',
    },
    'activationMode': {
      control: 'SelectControl',
      options: [
              "auto",
              "manual"
      ],
      label: 'Activation Mode',
      description: 'How tabs are activated (auto = focus, manual = click)',
      default: 'auto',
    },
    'headingLevel': {
      control: 'SelectControl',
      options: [
              "none",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6"
      ],
      label: 'Heading Level',
      description: 'Semantic HTML heading level (none, h1-h6)',
      default: 'none',
    },
    'verticalTabButtonTextAlign': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Vertical Tab Alignment',
      description: 'Text alignment for vertical tabs',
      default: 'left',
    },
    'showIcon': {
      control: 'ToggleControl',
      label: 'Show Icon',
      description: 'Display icons in tab buttons',
      default: true,
    },
    'iconPosition': {
      control: 'SelectControl',
      options: [
              "left",
              "right"
      ],
      label: 'Icon Position',
      description: 'Position of icon relative to text',
      default: 'right',
    },
    'iconColor': {
      control: 'ColorPicker',
      label: 'Icon Color',
      description: 'Color of tab icons',
      default: 'inherit',
    },
    'iconSize': {
      control: 'RangeControl',
      min: 10,
      max: 36,
      unit: 'px',
      label: 'Icon Size',
      description: 'Size of tab icons in pixels',
      default: 18,
    },
    'iconTypeClosed': {
      control: 'IconPicker',
      label: 'Closed Icon',
      description: 'Icon when tab is closed (char or image URL)',
      default: '▾',
    },
    'iconTypeOpen': {
      control: 'IconPicker',
      label: 'Open Icon',
      description: 'Icon when tab is open (none = use closed icon with rotation)',
      default: 'none',
    },
    'iconRotation': {
      control: 'RangeControl',
      min: -360,
      max: 360,
      unit: 'deg',
      label: 'Icon Rotation',
      description: 'Rotation angle when open (degrees)',
      default: 180,
    },
    'tabButtonColor': {
      control: 'ColorPicker',
      label: 'Tab Button Color',
      description: 'Text color for inactive tab buttons',
      default: '#666666',
    },
    'tabButtonBackgroundColor': {
      control: 'ColorPicker',
      label: 'Tab Button Background',
      description: 'Background color for inactive tab buttons',
      default: 'transparent',
    },
    'tabButtonHoverColor': {
      control: 'ColorPicker',
      label: 'Tab Button Hover Color',
      description: 'Text color when hovering over tab',
      default: '#333333',
    },
    'tabButtonHoverBackgroundColor': {
      control: 'ColorPicker',
      label: 'Tab Button Hover Background',
      description: 'Background color when hovering over tab',
      default: '#e8e8e8',
    },
    'tabButtonActiveColor': {
      control: 'ColorPicker',
      label: 'Tab Button Active Color',
      description: 'Text color for active/selected tab',
      default: '#000000',
    },
    'tabButtonActiveBackgroundColor': {
      control: 'ColorPicker',
      label: 'Tab Button Active Background',
      description: 'Background color for active/selected tab',
      default: '#ffffff',
    },
    'tabButtonActiveBorderColor': {
      control: 'ColorPicker',
      label: 'Tab Button Active Border Color',
      description: 'Border color for the active tab',
      default: '#dddddd',
    },
    'tabButtonActiveBorderBottomColor': {
      control: 'ColorPicker',
      label: 'Tab Button Active Border Bottom',
      description: 'Bottom border color for active tab (creates connected effect)',
      default: 'transparent',
    },
    'tabButtonBorderColor': {
      control: 'ColorPicker',
      label: 'Tab Button Border Color',
      description: 'Border color for inactive tab buttons',
    },
    'tabButtonBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Tab Button Border Width',
      description: 'Border width for tab buttons',
    },
    'tabButtonBorderStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Solid",
                      "value": "solid"
              },
              {
                      "label": "Dashed",
                      "value": "dashed"
              },
              {
                      "label": "Dotted",
                      "value": "dotted"
              },
              {
                      "label": "Double",
                      "value": "double"
              }
      ],
      label: 'Tab Button Border Style',
      description: 'Border style for tab buttons',
    },
    'tabButtonShadow': {
      control: 'TextControl',
      label: 'Tab Button Shadow',
      description: 'Box shadow for tab buttons',
      default: 'none',
    },
    'tabButtonShadowHover': {
      control: 'TextControl',
      label: 'Tab Button Shadow Hover',
      description: 'Box shadow for tab buttons on hover',
      default: 'none',
    },
    'tabButtonFontSize': {
      control: 'RangeControl',
      min: 10,
      max: 36,
      unit: 'px',
      label: 'Tab Button Font Size',
      description: 'Font size for tab buttons',
      default: 16,
    },
    'tabButtonFontWeight': {
      control: 'SelectControl',
      options: [
              {
                      "label": "100",
                      "value": "100"
              },
              {
                      "label": "200",
                      "value": "200"
              },
              {
                      "label": "300",
                      "value": "300"
              },
              {
                      "label": "400",
                      "value": "400"
              },
              {
                      "label": "500",
                      "value": "500"
              },
              {
                      "label": "600",
                      "value": "600"
              },
              {
                      "label": "700",
                      "value": "700"
              },
              {
                      "label": "800",
                      "value": "800"
              },
              {
                      "label": "900",
                      "value": "900"
              },
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Bold",
                      "value": "bold"
              }
      ],
      label: 'Tab Button Font Weight',
      description: 'Font weight for tab buttons',
      default: '500',
    },
    'tabButtonFontStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Italic",
                      "value": "italic"
              },
              {
                      "label": "Oblique",
                      "value": "oblique"
              }
      ],
      label: 'Tab Button Font Style',
      description: 'Font style for tab buttons',
      default: 'normal',
    },
    'tabButtonTextTransform': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Uppercase",
                      "value": "uppercase"
              },
              {
                      "label": "Lowercase",
                      "value": "lowercase"
              },
              {
                      "label": "Capitalize",
                      "value": "capitalize"
              }
      ],
      label: 'Tab Button Text Transform',
      description: 'Text transformation for tab buttons',
      default: 'none',
    },
    'tabButtonTextDecoration': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Underline",
                      "value": "underline"
              },
              {
                      "label": "Overline",
                      "value": "overline"
              },
              {
                      "label": "Line Through",
                      "value": "line-through"
              }
      ],
      label: 'Tab Button Text Decoration',
      description: 'Text decoration for tab buttons',
      default: 'none',
    },
    'tabButtonTextAlign': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Tab Button Text Alignment',
      description: 'Text alignment for tab buttons',
      default: 'center',
    },
    'tabListBackgroundColor': {
      control: 'ColorPicker',
      label: 'Tab List Background',
      description: 'Background color for the tab navigation bar',
      default: '#f5f5f5',
    },
    'tabListAlignment': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Tab List Alignment',
      description: 'Horizontal alignment of tabs',
      default: 'left',
    },
    'panelColor': {
      control: 'ColorPicker',
      label: 'Panel Text Color',
      description: 'Text color for tab panel content',
      default: '#333333',
    },
    'panelBackgroundColor': {
      control: 'ColorPicker',
      label: 'Panel Background',
      description: 'Background color for tab panels',
      default: '#ffffff',
    },
    'panelBorderColor': {
      control: 'ColorPicker',
      label: 'Panel Border Color',
      description: 'Border color for tab panels',
      default: '#dddddd',
    },
    'panelBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Panel Border Width',
      description: 'Border width for tab panels',
      default: 1,
    },
    'panelBorderStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Solid",
                      "value": "solid"
              },
              {
                      "label": "Dashed",
                      "value": "dashed"
              },
              {
                      "label": "Dotted",
                      "value": "dotted"
              },
              {
                      "label": "Double",
                      "value": "double"
              }
      ],
      label: 'Panel Border Style',
      description: 'Border style for tab panels',
      default: 'solid',
    },
    'panelShadow': {
      control: 'TextControl',
      label: 'Panel Shadow',
      description: 'Box shadow for tab panels',
      default: 'none',
    },
    'dividerLineColor': {
      control: 'ColorPicker',
      label: 'Divider Line Color',
      description: 'Color of divider line between tabs and panel',
    },
    'dividerLineWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Divider Line Width',
      description: 'Width/thickness of divider line',
    },
    'dividerLineStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Solid",
                      "value": "solid"
              },
              {
                      "label": "Dashed",
                      "value": "dashed"
              },
              {
                      "label": "Dotted",
                      "value": "dotted"
              },
              {
                      "label": "Double",
                      "value": "double"
              }
      ],
      label: 'Divider Line Style',
      description: 'Style of divider line between tabs and panel',
    },
    'verticalTabListWidth': {
      control: 'RangeControl',
      min: 100,
      max: 400,
      unit: 'px',
      label: 'Vertical Tab List Width',
      description: 'Width of tab list in vertical orientation',
      default: 200,
    },
    'itemSpacing': {
      control: 'RangeControl',
      min: 0,
      max: 50,
      unit: 'px',
      label: 'Item Spacing',
      description: 'General spacing between items',
    },
  },
  'toc': {
    'wrapperBackgroundColor': {
      control: 'ColorPicker',
      label: 'Background Color',
      description: 'Background color of the TOC wrapper',
      default: '#ffffff',
    },
    'wrapperBorderColor': {
      control: 'ColorPicker',
      label: 'Border Color',
      description: 'Border color of the TOC wrapper',
      default: '#dddddd',
    },
    'titleColor': {
      control: 'ColorPicker',
      label: 'Title Color',
      description: 'Text color for the TOC title',
      default: '#333333',
    },
    'titleBackgroundColor': {
      control: 'ColorPicker',
      label: 'Title Background',
      description: 'Background color for the TOC title',
      default: 'transparent',
    },
    'linkColor': {
      control: 'ColorPicker',
      label: 'Link Color',
      description: 'Default color for TOC links',
      default: '#0073aa',
    },
    'linkHoverColor': {
      control: 'ColorPicker',
      label: 'Link Hover Color',
      description: 'Color when hovering over links',
      default: '#005177',
    },
    'linkActiveColor': {
      control: 'ColorPicker',
      label: 'Link Active Color',
      description: 'Color for the currently active link',
      default: '#005177',
    },
    'linkVisitedColor': {
      control: 'ColorPicker',
      label: 'Link Visited Color',
      description: 'Color for visited links',
      default: '#0073aa',
    },
    'numberingColor': {
      control: 'ColorPicker',
      label: 'Numbering Color',
      description: 'Color for list numbering',
      default: '#0073aa',
    },
    'level1Color': {
      control: 'ColorPicker',
      label: 'Level 1 Color',
      description: 'Text color for level 1 headings (H2)',
      default: '#0073aa',
    },
    'level2Color': {
      control: 'ColorPicker',
      label: 'Level 2 Color',
      description: 'Text color for level 2 headings (H3)',
      default: '#0073aa',
    },
    'level3PlusColor': {
      control: 'ColorPicker',
      label: 'Level 3+ Color',
      description: 'Text color for level 3+ headings (H4-H6)',
      default: '#0073aa',
    },
    'collapseIconColor': {
      control: 'ColorPicker',
      label: 'Collapse Icon Color',
      description: 'Color of the collapse/expand icon',
      default: '#666666',
    },
    'titleFontSize': {
      control: 'RangeControl',
      min: 12,
      max: 48,
      unit: 'px',
      label: 'Title Font Size',
      description: 'Font size for the TOC title in pixels',
      default: '20px',
    },
    'titleFontWeight': {
      control: 'SelectControl',
      options: [
              {
                      "label": "100",
                      "value": "100"
              },
              {
                      "label": "200",
                      "value": "200"
              },
              {
                      "label": "300",
                      "value": "300"
              },
              {
                      "label": "400",
                      "value": "400"
              },
              {
                      "label": "500",
                      "value": "500"
              },
              {
                      "label": "600",
                      "value": "600"
              },
              {
                      "label": "700",
                      "value": "700"
              },
              {
                      "label": "800",
                      "value": "800"
              },
              {
                      "label": "900",
                      "value": "900"
              },
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Bold",
                      "value": "bold"
              }
      ],
      label: 'Title Font Weight',
      description: 'Font weight for the TOC title',
      default: '700',
    },
    'titleTextTransform': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Uppercase",
                      "value": "uppercase"
              },
              {
                      "label": "Lowercase",
                      "value": "lowercase"
              },
              {
                      "label": "Capitalize",
                      "value": "capitalize"
              }
      ],
      label: 'Title Text Transform',
      description: 'Text transformation for the title',
    },
    'titleAlignment': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Title Alignment',
      description: 'Text alignment for the title',
      default: 'left',
    },
    'level1FontSize': {
      control: 'RangeControl',
      min: 10,
      max: 36,
      unit: 'px',
      label: 'Level 1 Font Size',
      description: 'Font size for level 1 items (H2) in pixels',
      default: '18px',
    },
    'level1FontWeight': {
      control: 'SelectControl',
      options: [
              {
                      "label": "100",
                      "value": "100"
              },
              {
                      "label": "200",
                      "value": "200"
              },
              {
                      "label": "300",
                      "value": "300"
              },
              {
                      "label": "400",
                      "value": "400"
              },
              {
                      "label": "500",
                      "value": "500"
              },
              {
                      "label": "600",
                      "value": "600"
              },
              {
                      "label": "700",
                      "value": "700"
              },
              {
                      "label": "800",
                      "value": "800"
              },
              {
                      "label": "900",
                      "value": "900"
              },
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Bold",
                      "value": "bold"
              }
      ],
      label: 'Level 1 Font Weight',
      description: 'Font weight for level 1 items',
      default: '600',
    },
    'level1FontStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Italic",
                      "value": "italic"
              },
              {
                      "label": "Oblique",
                      "value": "oblique"
              }
      ],
      label: 'Level 1 Font Style',
      description: 'Font style for level 1 items',
      default: 'normal',
    },
    'level1TextTransform': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Uppercase",
                      "value": "uppercase"
              },
              {
                      "label": "Lowercase",
                      "value": "lowercase"
              },
              {
                      "label": "Capitalize",
                      "value": "capitalize"
              }
      ],
      label: 'Level 1 Text Transform',
      description: 'Text transformation for level 1 items',
      default: 'none',
    },
    'level1TextDecoration': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Underline",
                      "value": "underline"
              },
              {
                      "label": "Overline",
                      "value": "overline"
              },
              {
                      "label": "Line Through",
                      "value": "line-through"
              }
      ],
      label: 'Level 1 Text Decoration',
      description: 'Text decoration for level 1 items',
      default: 'none',
    },
    'level2FontSize': {
      control: 'RangeControl',
      min: 10,
      max: 32,
      unit: 'px',
      label: 'Level 2 Font Size',
      description: 'Font size for level 2 items (H3) in pixels',
      default: '16px',
    },
    'level2FontWeight': {
      control: 'SelectControl',
      options: [
              {
                      "label": "100",
                      "value": "100"
              },
              {
                      "label": "200",
                      "value": "200"
              },
              {
                      "label": "300",
                      "value": "300"
              },
              {
                      "label": "400",
                      "value": "400"
              },
              {
                      "label": "500",
                      "value": "500"
              },
              {
                      "label": "600",
                      "value": "600"
              },
              {
                      "label": "700",
                      "value": "700"
              },
              {
                      "label": "800",
                      "value": "800"
              },
              {
                      "label": "900",
                      "value": "900"
              },
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Bold",
                      "value": "bold"
              }
      ],
      label: 'Level 2 Font Weight',
      description: 'Font weight for level 2 items',
      default: 'normal',
    },
    'level2FontStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Italic",
                      "value": "italic"
              },
              {
                      "label": "Oblique",
                      "value": "oblique"
              }
      ],
      label: 'Level 2 Font Style',
      description: 'Font style for level 2 items',
      default: 'normal',
    },
    'level2TextTransform': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Uppercase",
                      "value": "uppercase"
              },
              {
                      "label": "Lowercase",
                      "value": "lowercase"
              },
              {
                      "label": "Capitalize",
                      "value": "capitalize"
              }
      ],
      label: 'Level 2 Text Transform',
      description: 'Text transformation for level 2 items',
      default: 'none',
    },
    'level2TextDecoration': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Underline",
                      "value": "underline"
              },
              {
                      "label": "Overline",
                      "value": "overline"
              },
              {
                      "label": "Line Through",
                      "value": "line-through"
              }
      ],
      label: 'Level 2 Text Decoration',
      description: 'Text decoration for level 2 items',
      default: 'none',
    },
    'level3PlusFontSize': {
      control: 'RangeControl',
      min: 10,
      max: 28,
      unit: 'px',
      label: 'Level 3+ Font Size',
      description: 'Font size for level 3+ items (H4-H6) in pixels',
      default: '14px',
    },
    'level3PlusFontWeight': {
      control: 'SelectControl',
      options: [
              {
                      "label": "100",
                      "value": "100"
              },
              {
                      "label": "200",
                      "value": "200"
              },
              {
                      "label": "300",
                      "value": "300"
              },
              {
                      "label": "400",
                      "value": "400"
              },
              {
                      "label": "500",
                      "value": "500"
              },
              {
                      "label": "600",
                      "value": "600"
              },
              {
                      "label": "700",
                      "value": "700"
              },
              {
                      "label": "800",
                      "value": "800"
              },
              {
                      "label": "900",
                      "value": "900"
              },
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Bold",
                      "value": "bold"
              }
      ],
      label: 'Level 3+ Font Weight',
      description: 'Font weight for level 3+ items',
      default: 'normal',
    },
    'level3PlusFontStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Normal",
                      "value": "normal"
              },
              {
                      "label": "Italic",
                      "value": "italic"
              },
              {
                      "label": "Oblique",
                      "value": "oblique"
              }
      ],
      label: 'Level 3+ Font Style',
      description: 'Font style for level 3+ items',
      default: 'normal',
    },
    'level3PlusTextTransform': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Uppercase",
                      "value": "uppercase"
              },
              {
                      "label": "Lowercase",
                      "value": "lowercase"
              },
              {
                      "label": "Capitalize",
                      "value": "capitalize"
              }
      ],
      label: 'Level 3+ Text Transform',
      description: 'Text transformation for level 3+ items',
      default: 'none',
    },
    'level3PlusTextDecoration': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Underline",
                      "value": "underline"
              },
              {
                      "label": "Overline",
                      "value": "overline"
              },
              {
                      "label": "Line Through",
                      "value": "line-through"
              }
      ],
      label: 'Level 3+ Text Decoration',
      description: 'Text decoration for level 3+ items',
      default: 'none',
    },
    'wrapperBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Border Width',
      description: 'Width of the wrapper border in pixels',
      default: '1px',
    },
    'wrapperBorderStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Solid",
                      "value": "solid"
              },
              {
                      "label": "Dashed",
                      "value": "dashed"
              },
              {
                      "label": "Dotted",
                      "value": "dotted"
              },
              {
                      "label": "Double",
                      "value": "double"
              },
              {
                      "label": "Groove",
                      "value": "groove"
              },
              {
                      "label": "Ridge",
                      "value": "ridge"
              },
              {
                      "label": "Inset",
                      "value": "inset"
              },
              {
                      "label": "Outset",
                      "value": "outset"
              }
      ],
      label: 'Border Style',
      description: 'Style of the wrapper border',
      default: 'solid',
    },
    'wrapperBorderRadius': {
      control: 'RangeControl',
      min: 0,
      max: 30,
      unit: 'px',
      label: 'Border Radius',
      description: 'Corner radius of the wrapper',
      default: '4px',
    },
    'wrapperShadow': {
      control: 'TextControl',
      label: 'Shadow',
      description: 'CSS box-shadow for the wrapper',
      default: 'none',
    },
    'wrapperShadowHover': {
      control: 'TextControl',
      label: 'Shadow on Hover',
      description: 'CSS box-shadow for the wrapper on hover',
      default: 'none',
    },
    'wrapperPadding': {
      control: 'RangeControl',
      min: 0,
      max: 50,
      unit: 'px',
      label: 'Wrapper Padding',
      description: 'Padding inside the TOC wrapper',
      default: '20px',
    },
    'listPaddingLeft': {
      control: 'RangeControl',
      min: 0,
      max: 50,
      unit: 'px',
      label: 'List Padding Left',
      description: 'Left padding for the list',
    },
    'itemSpacing': {
      control: 'RangeControl',
      min: 0,
      max: 30,
      unit: 'px',
      label: 'Item Spacing',
      description: 'Vertical space between TOC items',
      default: '8px',
    },
    'levelIndent': {
      control: 'RangeControl',
      min: 0,
      max: 50,
      unit: 'px',
      label: 'Level Indent',
      description: 'Indentation per heading level',
      default: '20px',
    },
    'positionTop': {
      control: 'RangeControl',
      min: 0,
      max: 300,
      unit: 'px',
      label: 'Position Top',
      description: 'Top offset for sticky/fixed positioning',
      default: '100px',
    },
    'zIndex': {
      control: 'RangeControl',
      min: 1,
      max: 9999,
      label: 'Z-Index',
      description: 'Stack order for positioned TOC',
      default: 100,
    },
    'collapseIconSize': {
      control: 'RangeControl',
      min: 12,
      max: 36,
      unit: 'px',
      label: 'Collapse Icon Size',
      description: 'Size of the collapse/expand icon',
      default: '20px',
    },
  },
};

/**
 * Get control configuration for a specific attribute
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @param {string} attrName - The attribute name
 * @returns {Object} Control configuration object
 */
export function getControlConfig(blockType, attrName) {
  return CONTROL_CONFIGS[blockType]?.[attrName] || {};
}

/**
 * Get all control configs for a block type
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @returns {Object} All control configurations for the block
 */
export function getBlockControlConfigs(blockType) {
  return CONTROL_CONFIGS[blockType] || {};
}

/**
 * Extract numeric value from a default that may include units (e.g., "18px" -> 18)
 * @param {string|number|null} defaultValue - The default value from schema
 * @returns {number|null} The numeric value without units
 */
export function getNumericDefault(defaultValue) {
  if (defaultValue === null || defaultValue === undefined) {
    return null;
  }

  if (typeof defaultValue === 'number') {
    return defaultValue;
  }

  if (typeof defaultValue === 'string') {
    // Extract number from strings like "18px", "1.6", "180deg"
    const match = defaultValue.match(/^(-?\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }

  return null;
}

/**
 * Get the numeric default for use in RangeControl
 * Shorthand for: getNumericDefault(getControlConfig(blockType, attrName).default)
 * @param {string} blockType - The block type (accordion, tabs, toc)
 * @param {string} attrName - The attribute name
 * @returns {number|null} The numeric default value
 */
export function getNumericControlDefault(blockType, attrName) {
  const config = getControlConfig(blockType, attrName);
  return getNumericDefault(config.default);
}

export default CONTROL_CONFIGS;
