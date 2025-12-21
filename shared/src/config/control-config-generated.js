/**
 * Control Configuration
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json, tabs.json, toc.json
 * Generated at: 2025-12-21T02:54:11.063Z
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
      label: 'Open by Default',
      description: 'Whether accordion is open on page load',
      default: false,
    },
    'accordionWidth': {
      control: 'TextControl',
      label: 'Block Width',
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
      label: 'Block Horizontal Alignment',
      description: 'Horizontal alignment of the accordion',
      default: 'center',
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
      label: 'Header Text Color',
      description: 'Text color for the accordion title',
      default: '#333333',
    },
    'titleBackgroundColor': {
      control: 'ColorPicker',
      label: 'Header Background',
      description: 'Background color for the accordion title',
      default: '#f5f5f5',
    },
    'hoverTitleColor': {
      control: 'ColorPicker',
      label: 'Header Hover Text Color',
      description: 'Text color when hovering over title',
      default: '#000000',
    },
    'hoverTitleBackgroundColor': {
      control: 'ColorPicker',
      label: 'Header Hover Background',
      description: 'Background color when hovering over title',
      default: '#e8e8e8',
    },
    'contentBackgroundColor': {
      control: 'ColorPicker',
      label: 'Panel Background',
      description: 'Background color for accordion content',
      default: '#ffffff',
    },
    'borderColor': {
      control: 'ColorPicker',
      label: 'Block Border Color',
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
      min: 0.6,
      max: 3,
      unit: 'rem',
      label: 'Header Font Size',
      description: 'Font size for the title in rem',
      default: 1.125,
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
      label: 'Header Font Weight',
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
      label: 'Header Font Style',
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
      label: 'Header Text Transform',
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
      label: 'Header Text Decoration',
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
      label: 'Header Text Alignment',
      description: 'Text alignment for the title',
      default: 'left',
    },
    'borderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Block Border Width',
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
      label: 'Block Border Style',
      description: 'Style of the accordion wrapper border',
      default: 'solid',
    },
    'borderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Block Border Radius',
      description: 'Corner radius of the accordion wrapper',
    },
    'shadow': {
      control: 'TextControl',
      label: 'Block Shadow',
      description: 'CSS box-shadow for the accordion wrapper',
      default: 'none',
    },
    'shadowHover': {
      control: 'TextControl',
      label: 'Block Hover Shadow',
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
      min: 0.6,
      max: 3,
      unit: 'rem',
      label: 'Icon Size',
      description: 'Size of the icon in rem',
      default: 1.25,
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
      label: 'Tab Orientation',
      description: 'Tab layout orientation',
      default: 'horizontal',
    },
    'stretchButtonsToRow': {
      control: 'ToggleControl',
      label: 'Stretch Buttons to Row Width',
      description: 'Make tab buttons fill the full width of the row (horizontal orientation only)',
      default: false,
    },
    'activationMode': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Click",
                      "value": "click"
              },
              {
                      "label": "Hover",
                      "value": "hover"
              }
      ],
      label: 'Activation Mode',
      description: 'How tabs are activated (click or hover)',
      default: 'click',
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
    'tabsHorizontalAlign': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Block Horizontal Alignment',
      description: 'Horizontal alignment of the tabs block',
      default: 'center',
    },
    'tabsWidth': {
      control: 'TextControl',
      label: 'Block Width',
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
      min: 0.5,
      max: 3,
      unit: 'rem',
      label: 'Icon Size',
      description: 'Size of the icon in rem',
      default: 1,
    },
    'iconTypeClosed': {
      control: 'IconPicker',
      label: 'Icon Closed',
      description: 'Icon for the tab (char or image URL)',
      default: '▾',
    },
    'iconTypeOpen': {
      control: 'IconPicker',
      label: 'Icon Open',
      description: 'Icon when tab is active (none = use closed icon with final rotation)',
      default: 'none',
    },
    'iconRotation': {
      control: 'RangeControl',
      min: -360,
      max: 360,
      unit: 'deg',
      label: 'Icon Base Rotation',
      description: 'Base rotation of the icon',
      default: 0,
    },
    'iconRotationActive': {
      control: 'RangeControl',
      min: -360,
      max: 360,
      unit: 'deg',
      label: 'Icon Active Rotation',
      description: 'Rotation of the icon for the active tab',
      default: 180,
    },
    'tabButtonColor': {
      control: 'ColorPicker',
      label: 'Header Text Color',
      description: 'Text color for inactive tab buttons',
      default: '#666666',
    },
    'tabButtonBackgroundColor': {
      control: 'ColorPicker',
      label: 'Header Background',
      description: 'Background color for inactive tab buttons',
      default: '#f5f5f5',
    },
    'tabButtonHoverColor': {
      control: 'ColorPicker',
      label: 'Header Hover Text Color',
      description: 'Text color when hovering over tab',
      default: '#333333',
    },
    'tabButtonHoverBackgroundColor': {
      control: 'ColorPicker',
      label: 'Header Hover Background',
      description: 'Background color when hovering over tab',
      default: '#e8e8e8',
    },
    'tabButtonActiveColor': {
      control: 'ColorPicker',
      label: 'Header Active Text Color',
      description: 'Text color for active/selected tab',
      default: '#333333',
    },
    'tabButtonActiveBackgroundColor': {
      control: 'ColorPicker',
      label: 'Header Active Background',
      description: 'Background color for active/selected tab',
      default: '#ffffff',
    },
    'enableFocusBorder': {
      control: 'ToggleControl',
      label: 'Enable Button / Content Border',
      description: 'Border on the edge touching the content, giving it a merged look.',
      default: true,
    },
    'tabButtonActiveContentBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Active Content Edge Border Width',
      description: 'Width of the active button edge touching content',
      default: 1,
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
      label: 'Active Content Edge Border Style',
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
      label: 'Header Active Font Weight',
      description: 'Font weight for active/selected tab button',
      default: 'bold',
    },
    'tabButtonBorderColor': {
      control: 'ColorPicker',
      label: 'Header Border Color',
      description: 'Border color for inactive tab buttons',
      default: '#dddddd',
    },
    'tabButtonActiveBorderColor': {
      control: 'ColorPicker',
      label: 'Header Active Border Color',
      description: 'Border color for the active tab',
      default: '#dddddd',
    },
    'tabButtonActiveContentBorderColor': {
      control: 'ColorPicker',
      label: 'Active Content Edge Border Color',
      description: 'Color of the border. Keep it the same color as panel background for a merged look.',
      default: '#ffffff',
    },
    'tabButtonBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Header Border Width',
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
      label: 'Header Border Style',
      description: 'Border style for tab buttons',
      default: 'solid',
    },
    'tabButtonBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Header Border Radius',
      description: 'Corner radius for tab buttons',
    },
    'tabButtonShadow': {
      control: 'TextControl',
      label: 'Header Shadow',
      description: 'Box shadow for tab buttons',
      default: 'none',
    },
    'tabButtonShadowHover': {
      control: 'TextControl',
      label: 'Header Hover Shadow',
      description: 'Box shadow for tab buttons on hover',
      default: 'none',
    },
    'tabButtonFontSize': {
      control: 'RangeControl',
      min: 0.6,
      max: 2.3,
      unit: 'rem',
      label: 'Header Font Size',
      description: 'Font size for tab buttons (rem)',
      default: 1,
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
      label: 'Header Font Weight',
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
      label: 'Header Font Style',
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
      label: 'Header Text Transform',
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
      label: 'Header Text Decoration',
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
      label: 'Header Text Alignment',
      description: 'Text alignment for tab buttons',
      default: 'center',
    },
    'tabButtonPadding': {
      control: 'RangeControl',
      min: 0,
      max: 1.3,
      unit: 'rem',
      label: 'Header Padding',
      description: 'Padding for tab buttons in rem (vertical/horizontal will be computed)',
      default: 0.75,
    },
    'tabListBackgroundColor': {
      control: 'ColorPicker',
      label: 'Row Background',
      description: 'Background color for the tab navigation bar',
      default: 'transparent',
    },
    'tabsRowBorderColor': {
      control: 'ColorPicker',
      label: 'Row Border Color',
      description: 'Border color for the tab row',
      default: '#dddddd',
    },
    'tabsRowBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Row Border Width',
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
      label: 'Row Border Style',
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
      label: 'Header Row Alignment',
      description: 'Alignment of tabs along the main axis',
      default: 'flex-start',
    },
    'tabsRowSpacing': {
      control: 'RangeControl',
      min: 0,
      max: 1.9,
      unit: 'rem',
      label: 'Row Spacing',
      description: 'Padding/spacing for the tab row (rem)',
      default: 0.5,
    },
    'tabsButtonGap': {
      control: 'RangeControl',
      min: 0,
      max: 1.9,
      unit: 'rem',
      label: 'Button Gap',
      description: 'Spacing between individual tab buttons (rem)',
      default: 0.5,
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
      description: 'Border color for tab content panel',
      default: '#dddddd',
    },
    'panelBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Panel Border Width',
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
      label: 'Panel Border Style',
      description: 'Border style for tab content panel',
      default: 'solid',
    },
    'panelBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Panel Border Radius',
      description: 'Corner radius for tab content panel',
    },
    'borderColor': {
      control: 'ColorPicker',
      label: 'Block Border Color',
      description: 'Border color for main tabs wrapper',
      default: '#dddddd',
    },
    'borderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Block Border Width',
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
      label: 'Block Border Style',
      description: 'Border style for wrapper',
      default: 'solid',
    },
    'borderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Block Border Radius',
      description: 'Corner radius for main wrapper',
    },
    'shadow': {
      control: 'TextControl',
      label: 'Block Shadow',
      description: 'Box shadow for main wrapper',
      default: 'none',
    },
    'shadowHover': {
      control: 'TextControl',
      label: 'Block Hover Shadow',
      description: 'Box shadow for wrapper on hover',
      default: 'none',
    },
    'enableTabsListContentBorder': {
      control: 'ToggleControl',
      label: 'Enable Row Divider Border',
      description: 'Enable or disable border between tab row and content',
      default: false,
    },
    'tabsListContentBorderColor': {
      control: 'ColorPicker',
      label: 'Row Divider Border Color',
      description: 'Color of the tab row edge that touches the content',
      default: 'transparent',
    },
    'tabsListContentBorderWidth': {
      control: 'RangeControl',
      min: 0,
      max: 10,
      unit: 'px',
      label: 'Row Divider Border Width',
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
      label: 'Row Divider Border Style',
      description: 'Style of the tab row edge that touches the content',
      default: 'solid',
    },
  },
  'toc': {
    'tocWidth': {
      control: 'TextControl',
      label: 'Block Width',
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
      label: 'Block Horizontal Alignment',
      description: 'Horizontal alignment of the TOC block',
      default: 'center',
    },
    'wrapperBackgroundColor': {
      control: 'ColorPicker',
      label: 'Block Background',
      description: 'Background color of the TOC wrapper',
      default: '#ffffff',
    },
    'blockBorderColor': {
      control: 'ColorPicker',
      label: 'Block Border Color',
      description: 'Border color of the TOC wrapper',
      default: '#dddddd',
    },
    'titleColor': {
      control: 'ColorPicker',
      label: 'Title Text Color',
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
      label: 'Level 1 Text Color',
      description: 'Text color for level 1 headings (H2)',
      default: '#0073aa',
    },
    'level2Color': {
      control: 'ColorPicker',
      label: 'Level 2 Text Color',
      description: 'Text color for level 2 headings (H3)',
      default: '#0073aa',
    },
    'level3PlusColor': {
      control: 'ColorPicker',
      label: 'Level 3+ Text Color',
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
      min: 0.7,
      max: 3,
      unit: 'rem',
      label: 'Title Font Size',
      description: 'Font size for the TOC title in rem',
      default: 1.25,
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
    'titlePadding': {
      control: 'BoxControl',
      label: 'Title Padding',
      description: 'Padding around the title',
    },
    'level1FontSize': {
      control: 'RangeControl',
      min: 0.6,
      max: 2.3,
      unit: 'rem',
      label: 'Level 1 Font Size',
      description: 'Font size for level 1 items (H2) in rem',
      default: 1.125,
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
      min: 0.6,
      max: 2,
      unit: 'rem',
      label: 'Level 2 Font Size',
      description: 'Font size for level 2 items (H3) in rem',
      default: 1,
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
      min: 0.6,
      max: 1.8,
      unit: 'rem',
      label: 'Level 3+ Font Size',
      description: 'Font size for level 3+ items (H4-H6) in rem',
      default: 0.875,
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
      label: 'Block Border Width',
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
      label: 'Block Border Style',
      description: 'Style of the wrapper border',
      default: 'solid',
    },
    'blockBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Block Border Radius',
      description: 'Corner radius of the wrapper',
    },
    'blockShadow': {
      control: 'TextControl',
      label: 'Block Shadow',
      description: 'CSS box-shadow for the wrapper',
      default: 'none',
    },
    'blockShadowHover': {
      control: 'TextControl',
      label: 'Block Hover Shadow',
      description: 'CSS box-shadow for the wrapper on hover',
      default: 'none',
    },
    'wrapperPadding': {
      control: 'RangeControl',
      min: 0,
      max: 3.2,
      unit: 'rem',
      label: 'Wrapper Padding',
      description: 'Padding inside the TOC wrapper (rem)',
      default: 1.25,
    },
    'listPaddingLeft': {
      control: 'RangeControl',
      min: 0,
      max: 3.2,
      unit: 'rem',
      label: 'List Padding Left',
      description: 'Left padding for the list (rem)',
      default: 1.5,
    },
    'itemSpacing': {
      control: 'RangeControl',
      min: 0,
      max: 1.9,
      unit: 'rem',
      label: 'Item Spacing',
      description: 'Vertical space between TOC items (rem)',
      default: 0.5,
    },
    'levelIndent': {
      control: 'RangeControl',
      min: 0,
      max: 3.2,
      unit: 'rem',
      label: 'Level Indent',
      description: 'Indentation per heading level (rem)',
      default: 1.25,
    },
    'positionTop': {
      control: 'RangeControl',
      min: 0,
      max: 18.8,
      unit: 'rem',
      label: 'Position Top',
      description: 'Top offset for sticky/fixed positioning (rem)',
      default: 6.25,
    },
    'zIndex': {
      control: 'RangeControl',
      min: 1,
      max: 9999,
      label: 'Z-Index',
      description: 'Stack order for positioned TOC',
      default: 100,
    },
    'positionHorizontalSide': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Left",
                      "value": "left"
              },
              {
                      "label": "Right",
                      "value": "right"
              }
      ],
      label: 'Horizontal Side',
      description: 'Which side to anchor the TOC (sticky/fixed positioning)',
      default: 'right',
    },
    'positionHorizontalOffset': {
      control: 'UnitControl',
      label: 'Horizontal Offset',
      description: 'Distance from the selected side',
      default: '1.25rem',
    },
    'collapseIconSize': {
      control: 'RangeControl',
      min: 0.7,
      max: 2.3,
      unit: 'rem',
      label: 'Collapse Icon Size',
      description: 'Size of the collapse/expand icon (rem)',
      default: 1.25,
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
