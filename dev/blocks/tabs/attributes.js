/**
 * Block Attributes for Tabs
 *
 * AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: schemas/generated/tabs.json
 * Generated at: 2026-01-19T16:38:17.040Z
 *
 * This file contains atomic, flat attributes in kebab-case format.
 * Each attribute represents a single configurable property.
 *
 * Special Attributes:
 * - currentTheme: Currently applied theme name
 * - customizations: Per-block customizations (overrides theme)
 * - tabsId: Unique identifier for this tabs
 *
 * All other attributes are auto-generated from the comprehensive schema.
 * To modify attributes, edit schemas/blocks/tabs.json and rebuild.
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

export const tabsAttributes = {
	customizations: { type: 'object', default: {} },
	tabsId: { type: 'string', default: "" },
	'activationMode': { type: 'string', default: "click" },
	'blockId': { type: 'string', default: "" },
	'borderColor': { type: 'object', default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"} },
	'borderRadius': { type: 'object', default: {"topLeft":0,"topRight":0,"bottomRight":0,"bottomLeft":0} },
	'borderStyle': { type: 'object', default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"} },
	'borderWidth': { type: 'number', default: 0 },
	'currentTheme': { type: 'string', default: "" },
	'enableFocusBorder': { type: 'boolean', default: true },
	'enableTabsListContentBorder': { type: 'boolean', default: false },
	'headingLevel': { type: 'string', default: "none" },
	'orientation': { type: 'string', default: "horizontal" },
	'panelBackgroundColor': { type: 'string', default: "#ffffff" },
	'panelBorderColor': { type: 'object', default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"} },
	'panelBorderRadius': { type: 'object', default: {"topLeft":4,"topRight":4,"bottomRight":4,"bottomLeft":4} },
	'panelBorderStyle': { type: 'object', default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"} },
	'panelBorderWidth': { type: 'number', default: 1 },
	'shadow': { type: 'string', default: "none" },
	'shadowHover': { type: 'string', default: "none" },
	'stretchButtonsToRow': { type: 'boolean', default: false },
	'tab-button-color-background': { type: 'string', default: "#f5f5f5" },
	'tab-button-color-background-active': { type: 'string', default: "#ffffff" },
	'tab-button-color-background-hover': { type: 'string', default: "#e8e8e8" },
	'tab-button-color-text': { type: 'string', default: "#666666" },
	'tab-button-color-text-active': { type: 'string', default: "#333333" },
	'tab-button-color-text-hover': { type: 'string', default: "#333333" },
	'tab-icon-animation-rotation': { type: 'string', default: "180deg" },
	'tab-icon-color': { type: 'string', default: "#333333" },
	'tab-icon-color-is-open': { type: 'string', default: "#333333" },
	'tab-icon-initial-rotation': { type: 'string', default: "0deg" },
	'tab-icon-initial-rotation-is-open': { type: 'string', default: "0deg" },
	'tab-icon-max-size': { type: 'string', default: "24px" },
	'tab-icon-max-size-is-open': { type: 'string', default: "24px" },
	'tab-icon-offset-x': { type: 'string', default: "0px" },
	'tab-icon-offset-x-is-open': { type: 'string', default: "0px" },
	'tab-icon-offset-y': { type: 'string', default: "0px" },
	'tab-icon-offset-y-is-open': { type: 'string', default: "0px" },
	'tab-icon-position': { type: 'string', default: "right" },
	'tab-icon-show': { type: 'boolean', default: true },
	'tab-icon-size': { type: 'string', default: "16px" },
	'tab-icon-size-is-open': { type: 'string', default: "16px" },
	'tab-icon-source': { type: 'object', default: {"kind":"char","value":"▾"} },
	'tab-icon-source-is-open': { type: 'object', default: {"kind":"char","value":"▾"} },
	'tab-icon-transform': { type: 'string', default: undefined },
	'tab-icon-transform-is-open': { type: 'string', default: undefined },
	'tab-icon-use-different-icons': { type: 'boolean', default: false },
	'tabButtonActiveBorderColor': { type: 'object', default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"} },
	'tabButtonActiveContentBorderColor': { type: 'string', default: "#ffffff" },
	'tabButtonActiveContentBorderStyle': { type: 'string', default: "solid" },
	'tabButtonActiveContentBorderWidth': { type: 'number', default: 1 },
	'tabButtonActiveFontWeight': { type: 'string', default: "bold" },
	'tabButtonBorderColor': { type: 'object', default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"} },
	'tabButtonBorderRadius': { type: 'object', default: {"topLeft":4,"topRight":4,"bottomRight":0,"bottomLeft":0} },
	'tabButtonBorderStyle': { type: 'object', default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"} },
	'tabButtonBorderWidth': { type: 'number', default: 1 },
	'tabButtonFontSize': { type: 'number', default: "1rem" },
	'tabButtonFontStyle': { type: 'string', default: "normal" },
	'tabButtonFontWeight': { type: 'string', default: "500" },
	'tabButtonPadding': { type: 'number', default: "0.75rem" },
	'tabButtonShadow': { type: 'string', default: "none" },
	'tabButtonShadowHover': { type: 'string', default: "none" },
	'tabButtonTextAlign': { type: 'string', default: "center" },
	'tabButtonTextDecoration': { type: 'string', default: "none" },
	'tabButtonTextTransform': { type: 'string', default: "none" },
	'tabListAlignment': { type: 'string', default: "flex-start" },
	'tabListBackgroundColor': { type: 'string', default: "transparent" },
	'tabs': { type: 'array', default: [{"id":"","title":"Tab 1","content":"","isDisabled":false},{"id":"","title":"Tab 2","content":"","isDisabled":false}] },
	'tabsButtonGap': { type: 'number', default: "0.5rem" },
	'tabsData': { type: 'array', default: [] },
	'tabsHorizontalAlign': { type: 'string', default: "center" },
	'tabsListContentBorderColor': { type: 'string', default: "transparent" },
	'tabsListContentBorderStyle': { type: 'string', default: "solid" },
	'tabsListContentBorderWidth': { type: 'number', default: 1 },
	'tabsRowBorderColor': { type: 'object', default: {"top":"#dddddd","right":"#dddddd","bottom":"#dddddd","left":"#dddddd"} },
	'tabsRowBorderStyle': { type: 'object', default: {"top":"solid","right":"solid","bottom":"solid","left":"solid"} },
	'tabsRowBorderWidth': { type: 'number', default: 0 },
	'tabsRowSpacing': { type: 'number', default: "0.5rem" },
	'tabsWidth': { type: 'string', default: "100%" },
	'title': { type: 'string', default: "Tabs" },
	'uniqueId': { type: 'string', default: "" },
};

export default tabsAttributes;
