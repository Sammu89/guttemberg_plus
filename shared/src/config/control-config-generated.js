/**
 * Control Configuration
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json, tabs.json, toc.json
 * Generated at: 2025-12-15T00:42:47.465Z
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
    'initiallyOpen': {
      control: 'ToggleControl',
      label: 'Initially Open',
      description: 'Whether accordion is open on page load',
      default: false,
    },
    'accordionWidth': {
      control: 'TextControl',
      label: 'Width',
      description: 'Accordion container width (e.g., 100%, 500px)',
      default: '100%',
    },
    'accordionHorizontalAlign': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Horizontal Alignment',
      description: 'Horizontal alignment of the accordion',
      default: 'left',
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
    'borderColor': {
      control: 'ColorPicker',
      label: 'Border Color',
      description: 'Color of the accordion wrapper border',
      default: '#dddddd',
    },
    'dividerColor': {
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
      default: 18,
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
      default: 16,
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
    'borderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Border Width',
      description: 'Thickness of the accordion wrapper border in pixels',
      default: 1,
    },
    'borderStyle': {
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
      label: 'Border Style',
      description: 'Style of the accordion wrapper border',
      default: 'solid',
    },
    'borderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Border Radius',
      description: 'Corner radius of the accordion wrapper',
    },
    'shadow': {
      control: 'TextControl',
      label: 'Shadow',
      description: 'CSS box-shadow for the accordion wrapper',
      default: 'none',
    },
    'shadowHover': {
      control: 'TextControl',
      label: 'Shadow Hover',
      description: 'CSS box-shadow for the accordion wrapper on hover',
      default: 'none',
    },
    'dividerWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Divider Width',
      description: 'Thickness of divider between title and content',
      default: 0,
    },
    'dividerStyle': {
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
      label: 'Divider Style',
      description: 'Style of divider between title and content',
      default: 'solid',
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
      default: 20,
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
      default: 180,
    },
  },
  'tabs': {
    'orientation': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Horizontal",
                      "value": "horizontal"
              },
              {
                      "label": "Vertical Left",
                      "value": "vertical-left"
              },
              {
                      "label": "Vertical Right",
                      "value": "vertical-right"
              }
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
    'tabsHorizontalAlign': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Horizontal Alignment',
      description: 'Horizontal alignment of the tabs block',
      default: 'left',
    },
    'tabsWidth': {
      control: 'TextControl',
      label: 'Width',
      description: 'Tabs container width (e.g., 100%, 500px)',
      default: '100%',
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
      description: 'Color of the tab icon',
      default: '#666666',
    },
    'iconSize': {
      control: 'RangeControl',
      min: 8,
      max: 48,
      unit: 'px',
      label: 'Icon Size',
      description: 'Size of the icon in pixels',
      default: 16,
    },
    'iconTypeClosed': {
      control: 'IconPicker',
      label: 'Icon Type',
      description: 'Icon for the tab (char or image URL)',
      default: '▾',
    },
    'iconTypeOpen': {
      control: 'IconPicker',
      label: 'Icon (active)',
      description: 'Icon when tab is active (none = use closed icon with final rotation)',
      default: 'none',
    },
    'iconRotation': {
      control: 'RangeControl',
      min: -360,
      max: 360,
      unit: 'deg',
      label: 'Base Rotation',
      description: 'Base rotation of the icon',
      default: 0,
    },
    'iconRotationActive': {
      control: 'RangeControl',
      min: -360,
      max: 360,
      unit: 'deg',
      label: 'Final rotation',
      description: 'Rotation of the icon for the active tab',
      default: 180,
    },
    'tabButtonColor': {
      control: 'ColorPicker',
      label: 'Button Text Color',
      description: 'Text color for inactive tab buttons',
      default: '#666666',
    },
    'tabButtonBackgroundColor': {
      control: 'ColorPicker',
      label: 'Button Background',
      description: 'Background color for inactive tab buttons',
      default: '#f5f5f5',
    },
    'tabButtonHoverColor': {
      control: 'ColorPicker',
      label: 'Button Text Hover Color',
      description: 'Text color when hovering over tab',
      default: '#333333',
    },
    'tabButtonHoverBackgroundColor': {
      control: 'ColorPicker',
      label: 'Button Hover Background',
      description: 'Background color when hovering over tab',
      default: '#e8e8e8',
    },
    'tabButtonActiveColor': {
      control: 'ColorPicker',
      label: 'Button Text Active Color',
      description: 'Text color for active/selected tab',
      default: '#333333',
    },
    'tabButtonActiveBackgroundColor': {
      control: 'ColorPicker',
      label: 'Button Active Background',
      description: 'Background color for active/selected tab',
      default: '#ffffff',
    },
    'enableFocusBorder': {
      control: 'ToggleControl',
      label: 'Enable Active Content Border',
      description: 'Enable or disable the border on the edge touching the content (active tab only)',
      default: true,
    },
    'tabButtonActiveContentBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Active Content Border Width',
      description: 'Width of the active button edge touching content',
      default: 2,
    },
    'tabButtonActiveContentBorderStyle': {
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
      label: 'Active Content Border Style',
      description: 'Style of the active button edge touching content',
      default: 'solid',
    },
    'tabButtonActiveFontWeight': {
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
      label: 'Button Active Font Weight',
      description: 'Font weight for active/selected tab button',
      default: 'bold',
    },
    'tabButtonBorderColor': {
      control: 'ColorPicker',
      label: 'Border Color',
      description: 'Border color for inactive tab buttons',
      default: '#dddddd',
    },
    'tabButtonActiveBorderColor': {
      control: 'ColorPicker',
      label: 'Button Active Border Color',
      description: 'Border color for the active tab',
      default: '#dddddd',
    },
    'tabButtonActiveContentBorderColor': {
      control: 'ColorPicker',
      label: 'Button Active Content Border',
      description: 'Border color on the edge touching content (bottom on horizontal, right on vertical-left, left on vertical-right). Controlled by Enable Active Content Border.',
      default: '#ffffff',
    },
    'tabButtonBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Border Width',
      description: 'Border width for tab buttons',
      default: 1,
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
      label: 'Border Style',
      description: 'Border style for tab buttons',
      default: 'solid',
    },
    'tabButtonBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Border Radius',
      description: 'Corner radius for tab buttons',
    },
    'tabButtonShadow': {
      control: 'TextControl',
      label: 'Shadow',
      description: 'Box shadow for tab buttons',
      default: 'none',
    },
    'tabButtonShadowHover': {
      control: 'TextControl',
      label: 'Shadow Hover',
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
    'tabButtonPadding': {
      control: 'RangeControl',
      min: 0,
      max: 20,
      unit: 'px',
      label: 'Tab Button Padding',
      description: 'Padding for tab buttons (vertical/horizontal will be computed)',
      default: 12,
    },
    'tabListBackgroundColor': {
      control: 'ColorPicker',
      label: 'Tab Row Background',
      description: 'Background color for the tab navigation bar',
      default: 'transparent',
    },
    'tabsRowBorderColor': {
      control: 'ColorPicker',
      label: 'Tab Row Border Color',
      description: 'Border color for the tab row',
      default: '#dddddd',
    },
    'tabsRowBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Tab Row Border Width',
      description: 'Border width for the tab row',
      default: 0,
    },
    'tabsRowBorderStyle': {
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
      label: 'Tab Row Border Style',
      description: 'Border style for the tab row',
      default: 'solid',
    },
    'tabListAlignment': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Start",
                      "value": "flex-start"
              },
              {
                      "label": "Center",
                      "value": "center"
              },
              {
                      "label": "End",
                      "value": "flex-end"
              }
      ],
      label: 'Tab Row Alignment',
      description: 'Alignment of tabs along the main axis',
      default: 'flex-start',
    },
    'tabsRowSpacing': {
      control: 'RangeControl',
      min: 0,
      max: 30,
      unit: 'px',
      label: 'Spacing',
      description: 'Padding/spacing for the tab row',
      default: 8,
    },
    'tabsButtonGap': {
      control: 'RangeControl',
      min: 0,
      max: 30,
      unit: 'px',
      label: 'Button Gap',
      description: 'Spacing between individual tab buttons',
      default: 8,
    },
    'panelBackgroundColor': {
      control: 'ColorPicker',
      label: 'Panel Background',
      description: 'Background color for tab panels',
      default: '#ffffff',
    },
    'panelBorderColor': {
      control: 'ColorPicker',
      label: 'Border Color',
      description: 'Border color for tab content panel',
      default: '#dddddd',
    },
    'panelBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Border Width',
      description: 'Border width for tab content panel (0-10px)',
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
      label: 'Border Style',
      description: 'Border style for tab content panel',
      default: 'solid',
    },
    'panelBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Border Radius',
      description: 'Corner radius for tab content panel',
    },
    'borderColor': {
      control: 'ColorPicker',
      label: 'Border Color',
      description: 'Border color for main tabs wrapper',
      default: '#dddddd',
    },
    'borderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Border Width',
      description: 'Border width for main wrapper',
      default: 0,
    },
    'borderStyle': {
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
      label: 'Border Style',
      description: 'Border style for wrapper',
      default: 'solid',
    },
    'borderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Border Radius',
      description: 'Corner radius for main wrapper',
    },
    'shadow': {
      control: 'TextControl',
      label: 'Shadow',
      description: 'Box shadow for main wrapper',
      default: 'none',
    },
    'shadowHover': {
      control: 'TextControl',
      label: 'Shadow Hover',
      description: 'Box shadow for wrapper on hover',
      default: 'none',
    },
    'enableTabsListContentBorder': {
      control: 'ToggleControl',
      label: 'Enable Tab Row Divider Border',
      description: 'Enable or disable border between tab row and content',
      default: false,
    },
    'tabsListContentBorderColor': {
      control: 'ColorPicker',
      label: 'Tab Row Divider Border Color',
      description: 'Color of the tab row edge that touches the content',
      default: 'transparent',
    },
    'tabsListContentBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Tab Row Divider Border Width',
      description: 'Width of the tab row edge that touches the content',
      default: 1,
    },
    'tabsListContentBorderStyle': {
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
      label: 'Tab Row Divider Border Style',
      description: 'Style of the tab row edge that touches the content',
      default: 'solid',
    },
  },
  'toc': {
    'tocWidth': {
      control: 'TextControl',
      label: 'Width',
      description: 'TOC container width (e.g., 100%, 500px)',
      default: '100%',
    },
    'tocHorizontalAlign': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Horizontal Alignment',
      description: 'Horizontal alignment of the TOC block',
      default: 'left',
    },
    'wrapperBackgroundColor': {
      control: 'ColorPicker',
      label: 'Background Color',
      description: 'Background color of the TOC wrapper',
      default: '#ffffff',
    },
    'blockBorderColor': {
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
      default: 20,
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
      default: 18,
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
      default: 16,
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
      default: 14,
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
    'blockBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Border Width',
      description: 'Width of the wrapper border in pixels',
      default: 1,
    },
    'blockBorderStyle': {
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
    'blockBorderRadius': {
      control: 'BorderRadiusControl',
      label: 'Border Radius',
      description: 'Corner radius of the wrapper',
    },
    'blockShadow': {
      control: 'TextControl',
      label: 'Shadow',
      description: 'CSS box-shadow for the wrapper',
      default: 'none',
    },
    'blockShadowHover': {
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
      default: 20,
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
      default: 8,
    },
    'levelIndent': {
      control: 'RangeControl',
      min: 0,
      max: 50,
      unit: 'px',
      label: 'Level Indent',
      description: 'Indentation per heading level',
      default: 20,
    },
    'positionTop': {
      control: 'RangeControl',
      min: 0,
      max: 300,
      unit: 'px',
      label: 'Position Top',
      description: 'Top offset for sticky/fixed positioning',
      default: 100,
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
      default: 20,
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
