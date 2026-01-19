/**
 * Block Attributes for Accordion
 *
 * AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/accordion.json
 * Generated at: 2026-01-19T16:38:17.035Z
 *
 * This file contains atomic, flat attributes in kebab-case format.
 * Each attribute represents a single configurable property.
 *
 * Special Attributes:
 * - currentTheme: Currently applied theme name
 * - customizations: Per-block customizations (overrides theme)
 * - accordionId: Unique identifier for this accordion
 *
 * All other attributes are auto-generated from the comprehensive schema.
 * To modify attributes, edit schemas/blocks/accordion.json and rebuild.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

export const accordionAttributes = {
	'accordionHorizontalAlign': { type: 'string', default: "center" },
	'accordionId': { type: 'string', default: "" },
	'accordionWidth': { type: 'string', default: "100%" },
	'animationDuration': { type: 'string', default: "250ms" },
	'animationType': { type: 'string', default: "slide" },
	'block-box-border-color-bottom': { type: 'string', default: "#dddddd" },
	'block-box-border-color-left': { type: 'string', default: "#dddddd" },
	'block-box-border-color-right': { type: 'string', default: "#dddddd" },
	'block-box-border-color-top': { type: 'string', default: "#dddddd" },
	'block-box-border-radius-bottom-left': { type: 'string', default: "4px" },
	'block-box-border-radius-bottom-right': { type: 'string', default: "4px" },
	'block-box-border-radius-top-left': { type: 'string', default: "4px" },
	'block-box-border-radius-top-right': { type: 'string', default: "4px" },
	'block-box-border-style-bottom': { type: 'string', default: "solid" },
	'block-box-border-style-left': { type: 'string', default: "solid" },
	'block-box-border-style-right': { type: 'string', default: "solid" },
	'block-box-border-style-top': { type: 'string', default: "solid" },
	'block-box-border-width-bottom': { type: 'string', default: "1px" },
	'block-box-border-width-left': { type: 'string', default: "1px" },
	'block-box-border-width-right': { type: 'string', default: "1px" },
	'block-box-border-width-top': { type: 'string', default: "1px" },
	'block-box-margin-bottom': { type: 'string', default: "1em" },
	'block-box-margin-left': { type: 'string', default: "0em" },
	'block-box-margin-right': { type: 'string', default: "0em" },
	'block-box-margin-top': { type: 'string', default: "1em" },
	'block-box-shadow': { type: 'array', default: [{"x":{"value":0,"unit":"px"},"y":{"value":8,"unit":"px"},"blur":{"value":24,"unit":"px"},"spread":{"value":0,"unit":"px"},"color":"rgba(0,0,0,0.15)","inset":false}] },
	'blockId': { type: 'string', default: "" },
	'content': { type: 'string', default: "" },
	'content-border-top': { type: 'composite', default: undefined },
	'content-box-padding-bottom': { type: 'string', default: "16px" },
	'content-box-padding-left': { type: 'string', default: "16px" },
	'content-box-padding-right': { type: 'string', default: "16px" },
	'content-box-padding-top': { type: 'string', default: "16px" },
	'content-color-background': { type: 'string', default: "#ffffff" },
	'content-color-text': { type: 'string', default: "#333333" },
	'content-inner-padding': { type: 'composite', default: undefined },
	'content-typography-font-family': { type: 'string', default: "inherit" },
	'content-typography-font-size': { type: 'string', default: "16px" },
	'content-typography-font-weight': { type: 'number', default: "400" },
	'content-typography-letter-spacing': { type: 'string', default: "normal" },
	'content-typography-line-height': { type: 'number', default: "1.5" },
	'content-typography-text-decoration': { type: 'string', default: "none" },
	'content-typography-text-transform': { type: 'string', default: "none" },
	'currentTheme': { type: 'string', default: "" },
	'customizations': { type: 'object', default: {} },
	'divider-border-border-color-top': { type: 'string', default: "#dddddd" },
	'divider-border-border-style-top': { type: 'string', default: "solid" },
	'divider-border-border-width-top': { type: 'string', default: "0px" },
	'header-box-padding-bottom': { type: 'string', default: "12px" },
	'header-box-padding-left': { type: 'string', default: "16px" },
	'header-box-padding-right': { type: 'string', default: "16px" },
	'header-box-padding-top': { type: 'string', default: "12px" },
	'headingLevel': { type: 'string', default: "none" },
	'initiallyOpen': { type: 'boolean', default: false },
	'item-border': { type: 'composite', default: undefined },
	'item-border-bottom': { type: 'composite', default: undefined },
	'item-border-color': { type: 'composite', default: undefined },
	'item-border-left': { type: 'composite', default: undefined },
	'item-border-radius': { type: 'composite', default: undefined },
	'item-border-right': { type: 'composite', default: undefined },
	'item-border-style': { type: 'composite', default: undefined },
	'item-border-top': { type: 'composite', default: undefined },
	'item-border-width': { type: 'composite', default: undefined },
	'item-margin': { type: 'composite', default: undefined },
	'title': { type: 'string', default: "Accordion Title" },
	'title-color-background': { type: 'string', default: "#f5f5f5" },
	'title-color-background-hover': { type: 'string', default: "#e8e8e8" },
	'title-color-text': { type: 'string', default: "#333333" },
	'title-color-text-hover': { type: 'string', default: "#000000" },
	'title-icon-animation-rotation': { type: 'string', default: "180deg" },
	'title-icon-color': { type: 'string', default: "#333333" },
	'title-icon-color-is-open': { type: 'string', default: "#333333" },
	'title-icon-initial-rotation': { type: 'string', default: "0deg" },
	'title-icon-initial-rotation-is-open': { type: 'string', default: "0deg" },
	'title-icon-max-size': { type: 'string', default: "24px" },
	'title-icon-max-size-is-open': { type: 'string', default: "24px" },
	'title-icon-offset-x': { type: 'string', default: "0px" },
	'title-icon-offset-x-is-open': { type: 'string', default: "0px" },
	'title-icon-offset-y': { type: 'string', default: "0px" },
	'title-icon-offset-y-is-open': { type: 'string', default: "0px" },
	'title-icon-position': { type: 'string', default: "right" },
	'title-icon-show': { type: 'boolean', default: true },
	'title-icon-size': { type: 'string', default: "16px" },
	'title-icon-size-is-open': { type: 'string', default: "16px" },
	'title-icon-source': { type: 'object', default: {"kind":"char","value":"▾"} },
	'title-icon-source-is-open': { type: 'object', default: {"kind":"char","value":"▾"} },
	'title-icon-transform': { type: 'string', default: undefined },
	'title-icon-transform-is-open': { type: 'string', default: undefined },
	'title-icon-use-different-icons': { type: 'boolean', default: false },
	'title-padding': { type: 'composite', default: undefined },
	'title-typography-decoration-color': { type: 'string', default: "currentColor" },
	'title-typography-decoration-style': { type: 'string', default: "solid" },
	'title-typography-decoration-width': { type: 'string', default: "auto" },
	'title-typography-font-family': { type: 'string', default: "inherit" },
	'title-typography-font-size': { type: 'string', default: "18px" },
	'title-typography-font-weight': { type: 'number', default: "600" },
	'title-typography-formatting': { type: 'array', default: [] },
	'title-typography-letter-spacing': { type: 'string', default: "normal" },
	'title-typography-line-height': { type: 'number', default: "1.4" },
	'title-typography-no-line-break': { type: 'string', default: "normal" },
	'title-typography-offset-x': { type: 'string', default: "0px" },
	'title-typography-offset-y': { type: 'string', default: "0px" },
	'title-typography-text-decoration': { type: 'string', default: "none" },
	'title-typography-text-transform': { type: 'string', default: "none" },
	'titleAlignment': { type: 'string', default: "left" },
	'uniqueId': { type: 'string', default: "" },
};

export default accordionAttributes;
