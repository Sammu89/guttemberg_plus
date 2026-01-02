/**
 * Control Configuration
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/accordion.json, tabs.json, toc.json
 * Generated at: 2026-01-02T19:57:50.496Z
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
    'dividerWidth': {
      control: 'BorderPanel',
      subgroup: 'Divider',
      label: 'Divider Border',
      description: 'Border between header and content',
      default: {"top":0,"right":0,"bottom":0,"left":0,"unit":"px"},
    },
    'dividerColor': {
      control: 'BorderPanel',
      subgroup: 'Divider',
      label: 'Divider Color',
      description: 'Color of divider between header and content',
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'dividerStyle': {
      control: 'BorderPanel',
      subgroup: 'Divider',
      label: 'Divider Style',
      description: 'Style of divider between header and content',
      default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
    },
    'borderWidth': {
      control: 'BorderPanel',
      subgroup: 'External',
      label: 'Border',
      description: 'Border width, color, and style for all sides',
      default: {"top":1,"right":1,"bottom":1,"left":1,"unit":"px"},
    },
    'borderRadius': {
      control: 'CompactBorderRadius',
      subgroup: 'External',
      label: 'Border Radius',
      description: 'Corner radius of the accordion wrapper',
      default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4,"unit":"px"},
    },
    'shadow': {
      control: 'ShadowPanel',
      subgroup: 'External',
      label: 'Block Shadow',
      description: 'Shadow effect for the accordion (supports multiple layers)',
      default: [{"x":{"value":0,"unit":"px"},"y":{"value":8,"unit":"px"},"blur":{"value":24,"unit":"px"},"spread":{"value":0,"unit":"px"},"color":"rgba(0,0,0,0.15)","inset":false}],
    },
    'borderColor': {
      control: 'BorderPanel',
      subgroup: 'External',
      label: 'Border Color',
      description: 'Border color for all sides',
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'borderStyle': {
      control: 'BorderPanel',
      subgroup: 'External',
      label: 'Border Style',
      description: 'Border style for all sides',
      default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
    },
    'headerPadding': {
      control: 'CompactPadding',
      responsive: true,
      label: 'Header Padding',
      description: 'Inner spacing of the header',
      default: {"top":12,"right":16,"bottom":12,"left":16,"unit":"px"},
    },
    'contentPadding': {
      control: 'CompactPadding',
      responsive: true,
      label: 'Content Padding',
      description: 'Inner spacing of the content panel',
      default: {"top":16,"right":16,"bottom":16,"left":16,"unit":"px"},
    },
    'blockMargin': {
      control: 'CompactMargin',
      responsive: true,
      label: 'Block Margin',
      description: 'Outer spacing around the accordion',
      default: {"top":1,"right":0,"bottom":1,"left":0,"unit":"em"},
    },
    'titleColor': {
      control: 'ColorControl',
      subgroup: 'Header',
      label: 'Text',
      description: 'Text color for the accordion header',
      default: '#333333',
    },
    'titleBackgroundColor': {
      control: 'ColorGradientControl',
      subgroup: 'Header',
      label: 'Background',
      description: 'Background color for the accordion header',
      default: '#f5f5f5',
    },
    'hoverTitleColor': {
      control: 'ColorControl',
      subgroup: 'Header - Hover',
      label: 'Text',
      description: 'Text color when hovering over header',
      default: '#000000',
    },
    'hoverTitleBackgroundColor': {
      control: 'ColorGradientControl',
      subgroup: 'Header - Hover',
      label: 'Background',
      description: 'Background color when hovering over header',
      default: '#e8e8e8',
    },
    'contentTextColor': {
      control: 'ColorControl',
      subgroup: 'Panel',
      label: 'Text',
      description: 'Text color for accordion content',
      default: '#333333',
    },
    'contentBackgroundColor': {
      control: 'ColorGradientControl',
      subgroup: 'Panel',
      label: 'Background',
      description: 'Background color for accordion content',
      default: '#ffffff',
    },
    'contentFontFamily': {
      control: 'FontFamilyControl',
      subgroup: 'Content',
      label: 'Font Family',
      description: 'Font family for the content',
      default: 'inherit',
    },
    'contentFontSize': {
      control: 'SliderWithInput',
      responsive: true,
      subgroup: 'Content',
      label: 'Font Size',
      description: 'Font size for the content',
      default: '1rem',
    },
    'contentLineHeight': {
      control: 'SliderWithInput',
      subgroup: 'Content',
      label: 'Line Height',
      description: 'Line height for the content',
      default: 1.6,
    },
    'titleFontFamily': {
      control: 'FontFamilyControl',
      subgroup: 'Header',
      label: 'Font Family',
      description: 'Font family for the header',
      default: 'inherit',
    },
    'titleFontSize': {
      control: 'SliderWithInput',
      responsive: true,
      subgroup: 'Header',
      label: 'Font Size',
      description: 'Font size for the header',
      default: '1.125rem',
    },
    'titleFormatting': {
      control: 'FormattingControl',
      subgroup: 'Header',
      label: 'Formatting',
      description: 'Text formatting options (bold, italic, underline, overline, line-through)',
      default: [],
    },
    'titleNoLineBreak': {
      control: 'FormattingControl',
      subgroup: 'Header',
      label: 'No line break',
      description: 'Keep the title on a single line',
      default: 'normal',
    },
    'titleFontWeight': {
      control: 'FormattingControl',
      subgroup: 'Header',
      label: 'Font Weight',
      description: 'Font weight for title (100-900)',
      default: 400,
    },
    'titleDecorationColor': {
      control: 'FormattingControl',
      subgroup: 'Header',
      label: 'Decoration Color',
      description: 'Color for text decorations',
      default: 'currentColor',
    },
    'titleDecorationStyle': {
      control: 'FormattingControl',
      subgroup: 'Header',
      label: 'Decoration Style',
      description: 'Style for text decorations',
      default: 'solid',
    },
    'titleDecorationWidth': {
      control: 'FormattingControl',
      subgroup: 'Header',
      label: 'Decoration Width',
      description: 'Thickness of text decorations',
      default: 'auto',
    },
    'titleLetterSpacing': {
      control: 'SliderWithInput',
      subgroup: 'Header',
      label: 'Letter Spacing',
      description: 'Space between letters',
      default: '0em',
    },
    'titleTextTransform': {
      control: 'LetterCaseControl',
      subgroup: 'Header',
      label: 'Letter Case',
      description: 'Text transformation for the header',
      default: 'none',
    },
    'titleLineHeight': {
      control: 'SliderWithInput',
      subgroup: 'Header',
      label: 'Line Height',
      description: 'Line height for the header',
      default: 1.4,
    },
    'titleAlignment': {
      control: 'AlignmentControl',
      subgroup: 'Header',
      label: 'Text Alignment',
      description: 'Text alignment for the header',
      default: 'left',
    },
    'titleOffsetX': {
      control: 'SliderWithInput',
      responsive: true,
      subgroup: 'Header',
      label: 'Horizontal Offset (X)',
      description: 'Move title left/right (negative = left, positive = right)',
      default: '0px',
    },
    'titleOffsetY': {
      control: 'SliderWithInput',
      responsive: true,
      subgroup: 'Header',
      label: 'Vertical Offset (Y)',
      description: 'Move title up/down (negative = up, positive = down)',
      default: '0px',
    },
    'titleTextShadow': {
      control: 'ShadowPanel',
      subgroup: 'Header',
      label: 'Text Shadow',
      description: 'Shadow effect for the header text (supports multiple layers)',
      default: [],
    },
    'showIcon': {
      control: 'ToggleControl',
      responsive: false,
      label: 'Show Icon',
      description: 'Display icon in the block',
      default: true,
    },
    'useDifferentIcons': {
      control: 'ToggleControl',
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Different Icons for Open/Close',
      description: 'Use different icons for active and inactive states',
      default: false,
    },
    'iconPosition': {
      control: 'IconPositionControl',
      allowedPositions: ["left","right","extreme-left","extreme-right"],
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Icon Position',
      description: 'Position of the icon relative to title',
      default: 'right',
    },
    'iconRotation': {
      control: 'SliderWithInput',
      min: -360,
      max: 360,
      step: 1,
      unit: 'deg',
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Rotation',
      description: 'Rotation angle applied during open/close transition',
      default: '180deg',
    },
    'iconInactiveSource': {
      control: 'IconPicker',
      responsive: false,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Icon',
      description: 'Icon when closed',
      default: {"kind":"char","value":"▾"},
    },
    'iconInactiveColor': {
      control: 'ColorControl',
      responsive: false,
      conditionalRender: 'iconInactiveSource.kind !== "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Color',
      description: 'Icon color (for character/library icons)',
      default: '#333333',
    },
    'iconInactiveSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 64,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconInactiveSource.kind !== "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Size',
      description: 'Icon size (for character/library icons)',
      default: '16px',
    },
    'iconInactiveMaxSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 128,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconInactiveSource.kind === "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Max Size',
      description: 'Maximum icon size (for image icons)',
      default: '24px',
    },
    'iconInactiveOffsetX': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Offset X',
      description: 'Horizontal offset of icon',
      default: '0px',
    },
    'iconInactiveOffsetY': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Offset Y',
      description: 'Vertical offset of icon',
      default: '0px',
    },
    'iconActiveSource': {
      control: 'IconPicker',
      responsive: false,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Icon (Active)',
      description: 'Icon when open',
      default: {"kind":"char","value":"▾"},
    },
    'iconActiveColor': {
      control: 'ColorControl',
      responsive: false,
      conditionalRender: 'iconActiveSource.kind !== "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Color (Active)',
      description: 'Icon color (for character/library icons)',
      default: '#333333',
    },
    'iconActiveSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 64,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconActiveSource.kind !== "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Size (Active)',
      description: 'Icon size (for character/library icons)',
      default: '16px',
    },
    'iconActiveMaxSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 128,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconActiveSource.kind === "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Max Size (Active)',
      description: 'Maximum icon size (for image icons)',
      default: '24px',
    },
    'iconActiveOffsetX': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Offset X (Active)',
      description: 'Horizontal offset of icon',
      default: '0px',
    },
    'iconActiveOffsetY': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Offset Y (Active)',
      description: 'Vertical offset of icon',
      default: '0px',
    },
    'animationType': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Slide",
                      "value": "slide"
              },
              {
                      "label": "Fade",
                      "value": "fade"
              },
              {
                      "label": "Slide + Fade",
                      "value": "slideFade"
              }
      ],
      label: 'Animation Type',
      description: 'How the accordion opens and closes',
      default: 'slide',
    },
    'animationDuration': {
      control: 'SliderWithInput',
      label: 'Duration',
      description: 'Animation duration in milliseconds',
      default: '300ms',
    },
    'animationEasing': {
      control: 'SelectControl',
      options: [
              {
                      "label": "Ease",
                      "value": "ease"
              },
              {
                      "label": "Ease In",
                      "value": "ease-in"
              },
              {
                      "label": "Ease Out",
                      "value": "ease-out"
              },
              {
                      "label": "Ease In-Out",
                      "value": "ease-in-out"
              },
              {
                      "label": "Linear",
                      "value": "linear"
              },
              {
                      "label": "Bounce",
                      "value": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
              }
      ],
      label: 'Easing',
      description: 'Animation easing function',
      default: 'ease',
    },
    'accordionWidth': {
      control: 'SliderWithInput',
      responsive: true,
      label: 'Block Width',
      description: 'Accordion container width',
      default: '100%',
    },
    'headingLevel': {
      control: 'HeadingLevel',
      label: 'Heading Level',
      description: 'Semantic HTML heading level for accessibility',
      default: 'none',
    },
    'accordionHorizontalAlign': {
      control: 'AlignmentControl',
      label: 'Block Alignment',
      description: 'Horizontal alignment of the accordion',
      default: 'center',
    },
    'initiallyOpen': {
      control: 'ToggleControl',
      label: 'Open by Default',
      description: 'Whether accordion is open on page load',
      default: false,
    },
  },
  'tabs': {
    'tabsWidth': {
      control: 'SliderWithInput',
      responsive: true,
      label: 'Block Width',
      description: 'Tabs container width',
      default: '100%',
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
    'borderColor': {
      control: 'ColorPicker',
      label: 'Block Border Color',
      description: 'Border color for main tabs wrapper',
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'borderWidth': {
      control: 'RangeControl',
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
      default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
    },
    'borderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Block Border Radius',
      description: 'Corner radius for main wrapper',
      default: {"topLeft":0,"topRight":0,"bottomRight":0,"bottomLeft":0},
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
    'tabButtonFontSize': {
      control: 'RangeControl',
      label: 'Header Font Size',
      description: 'Font size for tab buttons (rem)',
      default: '1rem',
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
      label: 'Header Padding',
      description: 'Padding for tab buttons in rem (vertical/horizontal will be computed)',
      default: '0.75rem',
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
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'tabButtonActiveBorderColor': {
      control: 'ColorPicker',
      label: 'Header Active Border Color',
      description: 'Border color for the active tab',
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'tabButtonBorderWidth': {
      control: 'RangeControl',
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
      default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
    },
    'tabButtonBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Header Border Radius',
      description: 'Corner radius for tab buttons',
      default: {"topLeft":4,"topRight":4,"bottomRight":0,"bottomLeft":0},
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
    'enableFocusBorder': {
      control: 'ToggleControl',
      label: 'Enable Button / Content Border',
      description: 'Border on the edge touching the content, giving it a merged look.',
      default: true,
    },
    'tabButtonActiveContentBorderColor': {
      control: 'ColorPicker',
      label: 'Active Content Edge Border Color',
      description: 'Color of the border. Keep it the same color as panel background for a merged look.',
      default: '#ffffff',
    },
    'tabButtonActiveContentBorderWidth': {
      control: 'RangeControl',
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
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'tabsRowBorderWidth': {
      control: 'RangeControl',
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
      default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
    },
    'tabsRowSpacing': {
      control: 'RangeControl',
      label: 'Row Spacing',
      description: 'Padding/spacing for the tab row (rem)',
      default: '0.5rem',
    },
    'tabsButtonGap': {
      control: 'RangeControl',
      label: 'Button Gap',
      description: 'Spacing between individual tab buttons (rem)',
      default: '0.5rem',
    },
    'stretchButtonsToRow': {
      control: 'ToggleControl',
      disabledWhen: {"orientation":["vertical-left","vertical-right"]},
      label: 'Stretch Buttons to Row Width',
      description: 'Make tab buttons fill the full width of the row (horizontal orientation only)',
      default: false,
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
      disabledWhen: {"stretchButtonsToRow":[true]},
      label: 'Header Row Alignment',
      description: 'Alignment of tabs along the main axis',
      default: 'flex-start',
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
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'panelBorderWidth': {
      control: 'RangeControl',
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
      default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
    },
    'panelBorderRadius': {
      control: 'BorderRadiusControl',
      unit: 'px',
      label: 'Panel Border Radius',
      description: 'Corner radius for tab content panel',
      default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4},
    },
    'showIcon': {
      control: 'ToggleControl',
      responsive: false,
      label: 'Show Icon',
      description: 'Display icon in the block',
      default: true,
    },
    'useDifferentIcons': {
      control: 'ToggleControl',
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Different Icons for Open/Close',
      description: 'Use different icons for active and inactive states',
      default: false,
    },
    'iconPosition': {
      control: 'IconPositionControl',
      allowedPositions: ["left","right"],
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Icon Position',
      description: 'Position of the icon relative to title',
      default: 'right',
    },
    'iconRotation': {
      control: 'SliderWithInput',
      min: -360,
      max: 360,
      step: 1,
      unit: 'deg',
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Rotation',
      description: 'Rotation angle applied during open/close transition',
      default: '180deg',
    },
    'iconInactiveSource': {
      control: 'IconPicker',
      responsive: false,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Icon',
      description: 'Icon when closed',
      default: {"kind":"char","value":"▾"},
    },
    'iconInactiveColor': {
      control: 'ColorControl',
      responsive: false,
      conditionalRender: 'iconInactiveSource.kind !== "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Color',
      description: 'Icon color (for character/library icons)',
      default: '#333333',
    },
    'iconInactiveSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 64,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconInactiveSource.kind !== "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Size',
      description: 'Icon size (for character/library icons)',
      default: '16px',
    },
    'iconInactiveMaxSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 128,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconInactiveSource.kind === "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Max Size',
      description: 'Maximum icon size (for image icons)',
      default: '24px',
    },
    'iconInactiveOffsetX': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Offset X',
      description: 'Horizontal offset of icon',
      default: '0px',
    },
    'iconInactiveOffsetY': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Offset Y',
      description: 'Vertical offset of icon',
      default: '0px',
    },
    'iconActiveSource': {
      control: 'IconPicker',
      responsive: false,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Icon (Active)',
      description: 'Icon when open',
      default: {"kind":"char","value":"▾"},
    },
    'iconActiveColor': {
      control: 'ColorControl',
      responsive: false,
      conditionalRender: 'iconActiveSource.kind !== "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Color (Active)',
      description: 'Icon color (for character/library icons)',
      default: '#333333',
    },
    'iconActiveSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 64,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconActiveSource.kind !== "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Size (Active)',
      description: 'Icon size (for character/library icons)',
      default: '16px',
    },
    'iconActiveMaxSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 128,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconActiveSource.kind === "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Max Size (Active)',
      description: 'Maximum icon size (for image icons)',
      default: '24px',
    },
    'iconActiveOffsetX': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Offset X (Active)',
      description: 'Horizontal offset of icon',
      default: '0px',
    },
    'iconActiveOffsetY': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Offset Y (Active)',
      description: 'Vertical offset of icon',
      default: '0px',
    },
  },
  'toc': {
    'filterMode': {
      control: 'SelectControl',
      options: [
              "Include all headings",
              "Include by class",
              "Excluse by class"
      ],
      label: 'Class Filter Mode',
      description: 'Filter headings by CSS class',
      default: 'Include all headings',
    },
    'includeH1': {
      control: 'ToggleControl',
      label: 'Include H1',
      description: 'Include H1 headings in TOC',
      default: false,
    },
    'includeH2': {
      control: 'ToggleControl',
      label: 'Include H2',
      default: true,
    },
    'includeH3': {
      control: 'ToggleControl',
      label: 'Include H3',
      default: true,
    },
    'includeH4': {
      control: 'ToggleControl',
      label: 'Include H4',
      default: true,
    },
    'includeH5': {
      control: 'ToggleControl',
      label: 'Include H5',
      default: true,
    },
    'includeH6': {
      control: 'ToggleControl',
      label: 'Include H6',
      default: true,
    },
    'includeClasses': {
      control: 'TextControl',
      label: 'Include Classes',
      description: 'CSS classes to include in TOC',
      default: '',
    },
    'excludeClasses': {
      control: 'TextControl',
      label: 'Exclude Classes',
      description: 'CSS classes to exclude from TOC',
      default: '',
    },
    'isCollapsible': {
      control: 'ToggleControl',
      label: 'Collapsible',
      description: 'Allow the TOC to be collapsed/expanded',
      default: true,
    },
    'initiallyCollapsed': {
      control: 'ToggleControl',
      label: 'Initially Collapsed',
      description: 'Start with TOC collapsed',
      default: false,
    },
    'positionType': {
      control: 'SelectControl',
      options: [
              "normal",
              "sticky",
              "fixed"
      ],
      label: 'Position Type',
      description: 'CSS positioning type',
      default: 'normal',
    },
    'smoothScroll': {
      control: 'ToggleControl',
      label: 'Smooth Scroll',
      description: 'Enable smooth scrolling to headings',
      default: true,
    },
    'scrollOffset': {
      control: 'RangeControl',
      min: 0,
      max: 500,
      step: 10,
      label: 'Scroll Offset',
      description: 'Offset in pixels when scrolling to heading',
      default: 0,
    },
    'autoHighlight': {
      control: 'ToggleControl',
      label: 'Auto Highlight',
      description: 'Highlight current section in TOC',
      default: true,
    },
    'clickBehavior': {
      control: 'SelectControl',
      options: [
              "navigate",
              "navigate-and-collapse"
      ],
      showWhen: {"isCollapsible":[true]},
      label: 'Click Behavior',
      description: 'What happens when clicking a TOC item',
      default: 'navigate',
    },
    'tocWidth': {
      control: 'SliderWithInput',
      responsive: true,
      label: 'Block Width',
      description: 'TOC container width',
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
      default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd","linked":true},
    },
    'titleColor': {
      control: 'ColorPicker',
      label: 'Header Text Color',
      description: 'Text color for the TOC header',
      default: '#333333',
    },
    'titleBackgroundColor': {
      control: 'ColorPicker',
      label: 'Header Background',
      description: 'Background color for the TOC header',
      default: 'transparent',
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
      default: 'transparent',
    },
    'unifiedLinkColors': {
      control: 'ToggleControl',
      label: 'Same Colors for All Levels',
      description: 'Use the same link colors for all heading levels',
      default: true,
    },
    'linkColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[true]},
      label: 'Link Color (General)',
      description: 'Default color for all TOC links',
      default: '#0073aa',
    },
    'linkHoverColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[true]},
      label: 'Link Hover Color',
      description: 'Color when hovering over links',
      default: '#005177',
    },
    'linkActiveColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[true]},
      label: 'Link Active Color',
      description: 'Color for the currently active link',
      default: '#005177',
    },
    'linkVisitedColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[true]},
      label: 'Link Visited Color',
      description: 'Color for visited links',
      default: '#0073aa',
    },
    'h1NumberingStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Decimal (1, 2, 3)",
                      "value": "decimal"
              },
              {
                      "label": "Decimal Leading Zero (01, 02, 03)",
                      "value": "decimal-leading-zero"
              },
              {
                      "label": "Upper Roman (I, II, III)",
                      "value": "upper-roman"
              },
              {
                      "label": "Lower Roman (i, ii, iii)",
                      "value": "lower-roman"
              },
              {
                      "label": "Upper Alpha (A, B, C)",
                      "value": "upper-alpha"
              },
              {
                      "label": "Lower Alpha (a, b, c)",
                      "value": "lower-alpha"
              }
      ],
      label: 'H1 Numbering Style',
      description: 'Numbering style for H1 headings',
      default: 'decimal',
    },
    'h2NumberingStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Decimal (1, 2, 3)",
                      "value": "decimal"
              },
              {
                      "label": "Decimal Leading Zero (01, 02, 03)",
                      "value": "decimal-leading-zero"
              },
              {
                      "label": "Upper Roman (I, II, III)",
                      "value": "upper-roman"
              },
              {
                      "label": "Lower Roman (i, ii, iii)",
                      "value": "lower-roman"
              },
              {
                      "label": "Upper Alpha (A, B, C)",
                      "value": "upper-alpha"
              },
              {
                      "label": "Lower Alpha (a, b, c)",
                      "value": "lower-alpha"
              }
      ],
      label: 'H2 Numbering Style',
      description: 'Numbering style for H2 headings',
      default: 'decimal',
    },
    'h3NumberingStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Decimal (1, 2, 3)",
                      "value": "decimal"
              },
              {
                      "label": "Decimal Leading Zero (01, 02, 03)",
                      "value": "decimal-leading-zero"
              },
              {
                      "label": "Upper Roman (I, II, III)",
                      "value": "upper-roman"
              },
              {
                      "label": "Lower Roman (i, ii, iii)",
                      "value": "lower-roman"
              },
              {
                      "label": "Upper Alpha (A, B, C)",
                      "value": "upper-alpha"
              },
              {
                      "label": "Lower Alpha (a, b, c)",
                      "value": "lower-alpha"
              }
      ],
      label: 'H3 Numbering Style',
      description: 'Numbering style for H3 headings',
      default: 'decimal',
    },
    'h4NumberingStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Decimal (1, 2, 3)",
                      "value": "decimal"
              },
              {
                      "label": "Decimal Leading Zero (01, 02, 03)",
                      "value": "decimal-leading-zero"
              },
              {
                      "label": "Upper Roman (I, II, III)",
                      "value": "upper-roman"
              },
              {
                      "label": "Lower Roman (i, ii, iii)",
                      "value": "lower-roman"
              },
              {
                      "label": "Upper Alpha (A, B, C)",
                      "value": "upper-alpha"
              },
              {
                      "label": "Lower Alpha (a, b, c)",
                      "value": "lower-alpha"
              }
      ],
      label: 'H4 Numbering Style',
      description: 'Numbering style for H4 headings',
      default: 'decimal',
    },
    'h5NumberingStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Decimal (1, 2, 3)",
                      "value": "decimal"
              },
              {
                      "label": "Decimal Leading Zero (01, 02, 03)",
                      "value": "decimal-leading-zero"
              },
              {
                      "label": "Upper Roman (I, II, III)",
                      "value": "upper-roman"
              },
              {
                      "label": "Lower Roman (i, ii, iii)",
                      "value": "lower-roman"
              },
              {
                      "label": "Upper Alpha (A, B, C)",
                      "value": "upper-alpha"
              },
              {
                      "label": "Lower Alpha (a, b, c)",
                      "value": "lower-alpha"
              }
      ],
      label: 'H5 Numbering Style',
      description: 'Numbering style for H5 headings',
      default: 'decimal',
    },
    'h6NumberingStyle': {
      control: 'SelectControl',
      options: [
              {
                      "label": "None",
                      "value": "none"
              },
              {
                      "label": "Decimal (1, 2, 3)",
                      "value": "decimal"
              },
              {
                      "label": "Decimal Leading Zero (01, 02, 03)",
                      "value": "decimal-leading-zero"
              },
              {
                      "label": "Upper Roman (I, II, III)",
                      "value": "upper-roman"
              },
              {
                      "label": "Lower Roman (i, ii, iii)",
                      "value": "lower-roman"
              },
              {
                      "label": "Upper Alpha (A, B, C)",
                      "value": "upper-alpha"
              },
              {
                      "label": "Lower Alpha (a, b, c)",
                      "value": "lower-alpha"
              }
      ],
      label: 'H6 Numbering Style',
      description: 'Numbering style for H6 headings',
      default: 'decimal',
    },
    'h1Color': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H1 Link Color',
      description: 'Link color for H1 headings (inherits general color if not set)',
      default: 'inherit',
    },
    'h1HoverColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H1 Hover Color',
      default: 'inherit',
    },
    'h1VisitedColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H1 Visited Color',
      default: 'inherit',
    },
    'h1ActiveColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H1 Active Color',
      default: 'inherit',
    },
    'h1FontSize': {
      control: 'RangeControl',
      label: 'H1 Font Size',
      description: 'Font size for H1 headings in rem',
      default: '1.5rem',
    },
    'h1FontWeight': {
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
      label: 'H1 Font Weight',
      description: 'Font weight for H1 headings',
      default: '700',
    },
    'h1FontStyle': {
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
      label: 'H1 Font Style',
      description: 'Font style for H1 headings',
      default: 'normal',
    },
    'h1TextTransform': {
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
      label: 'H1 Text Transform',
      description: 'Text transformation for H1 headings',
      default: 'none',
    },
    'h1TextDecoration': {
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
      label: 'H1 Text Decoration',
      description: 'Text decoration for H1 headings',
      default: 'none',
    },
    'h2Color': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H2 Link Color',
      description: 'Link color for H2 headings (inherits general color if not set)',
      default: 'inherit',
    },
    'h2HoverColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H2 Hover Color',
      default: 'inherit',
    },
    'h2VisitedColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H2 Visited Color',
      default: 'inherit',
    },
    'h2ActiveColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H2 Active Color',
      default: 'inherit',
    },
    'h2FontSize': {
      control: 'RangeControl',
      label: 'H2 Font Size',
      description: 'Font size for H2 headings in rem',
      default: '1.25rem',
    },
    'h2FontWeight': {
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
      label: 'H2 Font Weight',
      description: 'Font weight for H2 headings',
      default: '600',
    },
    'h2FontStyle': {
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
      label: 'H2 Font Style',
      description: 'Font style for H2 headings',
      default: 'normal',
    },
    'h2TextTransform': {
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
      label: 'H2 Text Transform',
      description: 'Text transformation for H2 headings',
      default: 'none',
    },
    'h2TextDecoration': {
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
      label: 'H2 Text Decoration',
      description: 'Text decoration for H2 headings',
      default: 'none',
    },
    'h3Color': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H3 Link Color',
      description: 'Link color for H3 headings (inherits general color if not set)',
      default: 'inherit',
    },
    'h3HoverColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H3 Hover Color',
      default: 'inherit',
    },
    'h3VisitedColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H3 Visited Color',
      default: 'inherit',
    },
    'h3ActiveColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H3 Active Color',
      default: 'inherit',
    },
    'h3FontSize': {
      control: 'RangeControl',
      label: 'H3 Font Size',
      description: 'Font size for H3 headings in rem',
      default: '1.125rem',
    },
    'h3FontWeight': {
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
      label: 'H3 Font Weight',
      description: 'Font weight for H3 headings',
      default: '500',
    },
    'h3FontStyle': {
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
      label: 'H3 Font Style',
      description: 'Font style for H3 headings',
      default: 'normal',
    },
    'h3TextTransform': {
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
      label: 'H3 Text Transform',
      description: 'Text transformation for H3 headings',
      default: 'none',
    },
    'h3TextDecoration': {
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
      label: 'H3 Text Decoration',
      description: 'Text decoration for H3 headings',
      default: 'none',
    },
    'h4Color': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H4 Link Color',
      description: 'Link color for H4 headings (inherits general color if not set)',
      default: 'inherit',
    },
    'h4HoverColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H4 Hover Color',
      default: 'inherit',
    },
    'h4VisitedColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H4 Visited Color',
      default: 'inherit',
    },
    'h4ActiveColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H4 Active Color',
      default: 'inherit',
    },
    'h4FontSize': {
      control: 'RangeControl',
      label: 'H4 Font Size',
      description: 'Font size for H4 headings in rem',
      default: '1rem',
    },
    'h4FontWeight': {
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
      label: 'H4 Font Weight',
      description: 'Font weight for H4 headings',
      default: 'normal',
    },
    'h4FontStyle': {
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
      label: 'H4 Font Style',
      description: 'Font style for H4 headings',
      default: 'normal',
    },
    'h4TextTransform': {
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
      label: 'H4 Text Transform',
      description: 'Text transformation for H4 headings',
      default: 'none',
    },
    'h4TextDecoration': {
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
      label: 'H4 Text Decoration',
      description: 'Text decoration for H4 headings',
      default: 'none',
    },
    'h5Color': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H5 Link Color',
      description: 'Link color for H5 headings (inherits general color if not set)',
      default: 'inherit',
    },
    'h5HoverColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H5 Hover Color',
      default: 'inherit',
    },
    'h5VisitedColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H5 Visited Color',
      default: 'inherit',
    },
    'h5ActiveColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H5 Active Color',
      default: 'inherit',
    },
    'h5FontSize': {
      control: 'RangeControl',
      label: 'H5 Font Size',
      description: 'Font size for H5 headings in rem',
      default: '0.9375rem',
    },
    'h5FontWeight': {
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
      label: 'H5 Font Weight',
      description: 'Font weight for H5 headings',
      default: 'normal',
    },
    'h5FontStyle': {
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
      label: 'H5 Font Style',
      description: 'Font style for H5 headings',
      default: 'normal',
    },
    'h5TextTransform': {
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
      label: 'H5 Text Transform',
      description: 'Text transformation for H5 headings',
      default: 'none',
    },
    'h5TextDecoration': {
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
      label: 'H5 Text Decoration',
      description: 'Text decoration for H5 headings',
      default: 'none',
    },
    'h6Color': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H6 Link Color',
      description: 'Link color for H6 headings (inherits general color if not set)',
      default: 'inherit',
    },
    'h6HoverColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H6 Hover Color',
      default: 'inherit',
    },
    'h6VisitedColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H6 Visited Color',
      default: 'inherit',
    },
    'h6ActiveColor': {
      control: 'ColorPicker',
      showWhen: {"unifiedLinkColors":[false]},
      label: 'H6 Active Color',
      default: 'inherit',
    },
    'h6FontSize': {
      control: 'RangeControl',
      label: 'H6 Font Size',
      description: 'Font size for H6 headings in rem',
      default: '0.875rem',
    },
    'h6FontWeight': {
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
      label: 'H6 Font Weight',
      description: 'Font weight for H6 headings',
      default: 'normal',
    },
    'h6FontStyle': {
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
      label: 'H6 Font Style',
      description: 'Font style for H6 headings',
      default: 'normal',
    },
    'h6TextTransform': {
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
      label: 'H6 Text Transform',
      description: 'Text transformation for H6 headings',
      default: 'none',
    },
    'h6TextDecoration': {
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
      label: 'H6 Text Decoration',
      description: 'Text decoration for H6 headings',
      default: 'none',
    },
    'showIcon': {
      control: 'ToggleControl',
      responsive: false,
      label: 'Show Icon',
      description: 'Display icon in the block',
      default: true,
    },
    'useDifferentIcons': {
      control: 'ToggleControl',
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Different Icons for Open/Close',
      description: 'Use different icons for active and inactive states',
      default: false,
    },
    'iconPosition': {
      control: 'IconPositionControl',
      allowedPositions: ["left","right","extreme-left","extreme-right"],
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Icon Position',
      description: 'Position of the icon relative to title',
      default: 'right',
    },
    'iconRotation': {
      control: 'SliderWithInput',
      min: -360,
      max: 360,
      step: 1,
      unit: 'deg',
      responsive: false,
      showWhen: {"showIcon":[true]},
      label: 'Rotation',
      description: 'Rotation angle applied during open/close transition',
      default: '180deg',
    },
    'iconInactiveSource': {
      control: 'IconPicker',
      responsive: false,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Icon',
      description: 'Icon when closed',
      default: {"kind":"char","value":"▾"},
    },
    'iconInactiveColor': {
      control: 'ColorControl',
      responsive: false,
      conditionalRender: 'iconInactiveSource.kind !== "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Color',
      description: 'Icon color (for character/library icons)',
      default: '#333333',
    },
    'iconInactiveSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 64,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconInactiveSource.kind !== "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Size',
      description: 'Icon size (for character/library icons)',
      default: '16px',
    },
    'iconInactiveMaxSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 128,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconInactiveSource.kind === "image"',
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Max Size',
      description: 'Maximum icon size (for image icons)',
      default: '24px',
    },
    'iconInactiveOffsetX': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Offset X',
      description: 'Horizontal offset of icon',
      default: '0px',
    },
    'iconInactiveOffsetY': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true]},
      subgroup: 'inactive',
      label: 'Offset Y',
      description: 'Vertical offset of icon',
      default: '0px',
    },
    'iconActiveSource': {
      control: 'IconPicker',
      responsive: false,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Icon (Active)',
      description: 'Icon when open',
      default: {"kind":"char","value":"▾"},
    },
    'iconActiveColor': {
      control: 'ColorControl',
      responsive: false,
      conditionalRender: 'iconActiveSource.kind !== "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Color (Active)',
      description: 'Icon color (for character/library icons)',
      default: '#333333',
    },
    'iconActiveSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 64,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconActiveSource.kind !== "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Size (Active)',
      description: 'Icon size (for character/library icons)',
      default: '16px',
    },
    'iconActiveMaxSize': {
      control: 'SliderWithInput',
      min: 8,
      max: 128,
      step: 1,
      unit: 'px',
      responsive: true,
      conditionalRender: 'iconActiveSource.kind === "image"',
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Max Size (Active)',
      description: 'Maximum icon size (for image icons)',
      default: '24px',
    },
    'iconActiveOffsetX': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Offset X (Active)',
      description: 'Horizontal offset of icon',
      default: '0px',
    },
    'iconActiveOffsetY': {
      control: 'SliderWithInput',
      min: -100,
      max: 100,
      step: 1,
      unit: 'px',
      responsive: true,
      showWhen: {"showIcon":[true],"useDifferentIcons":[true]},
      subgroup: 'active',
      label: 'Offset Y (Active)',
      description: 'Vertical offset of icon',
      default: '0px',
    },
    'titleFontSize': {
      control: 'RangeControl',
      label: 'Header Font Size',
      description: 'Font size for the TOC header in rem',
      default: '1.25rem',
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
      description: 'Font weight for the TOC header',
      default: '700',
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
      description: 'Text transformation for the header',
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
      default: 'none',
    },
    'titleAlignment': {
      control: 'SelectControl',
      options: [
              "left",
              "center",
              "right"
      ],
      label: 'Header Alignment',
      description: 'Text alignment for the header',
      default: 'left',
    },
    'blockBorderWidth': {
      control: 'RangeControl',
      label: 'Block Border Width',
      description: 'Width of the wrapper border in pixels',
      default: '1',
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
      default: {"top":"solid","right":"solid","bottom":"solid","left":"solid","linked":true},
    },
    'blockBorderRadius': {
      control: 'BorderRadiusControl',
      label: 'Block Border Radius',
      description: 'Corner radius of the wrapper',
      default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4,"unit":"px"},
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
      label: 'Wrapper Padding',
      description: 'Padding inside the TOC wrapper (rem)',
      default: '1.25rem',
    },
    'itemSpacing': {
      control: 'RangeControl',
      label: 'Item Spacing',
      description: 'Vertical space between TOC items (rem)',
      default: '0.5rem',
    },
    'enableHierarchicalIndent': {
      control: 'ToggleControl',
      label: 'Enable Hierarchical Indentation',
      description: 'Indent headings based on document hierarchy (e.g., H3 under H2 indents once)',
      default: true,
    },
    'levelIndent': {
      control: 'UnitControl',
      disabledWhen: {"enableHierarchicalIndent":[false]},
      label: 'Indentation Amount',
      description: 'Amount to indent each nested level',
      default: '1.25rem',
    },
    'positionTop': {
      control: 'RangeControl',
      showWhen: {"positionType":["sticky","fixed"]},
      label: 'Position Top',
      description: 'Top offset for sticky/fixed positioning (rem)',
      default: '6.25rem',
    },
    'zIndex': {
      control: 'RangeControl',
      showWhen: {"positionType":["sticky","fixed"]},
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
      showWhen: {"positionType":["sticky","fixed"]},
      label: 'Horizontal Side',
      description: 'Which side to anchor the TOC (sticky/fixed positioning)',
      default: 'right',
    },
    'positionHorizontalOffset': {
      control: 'UnitControl',
      showWhen: {"positionType":["sticky","fixed"]},
      label: 'Horizontal Offset',
      description: 'Distance from the selected side',
      default: '1.25rem',
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
