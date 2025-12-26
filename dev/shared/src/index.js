/**
 * Shared Modules - Entry Point
 *
 * Exports all shared utilities, components, and systems
 * for use across all block types (accordion, tabs, toc)
 *
 * @package
 * @since 1.0.0
 */

// CSS Parser Utilities (Module 1.1)
export {
	getCSSDefault,
	getAllCSSDefaults,
	areCSSDefaultsLoaded,
	getCSSDefaultWithFallback,
	getMultipleCSSDefaults,
} from './utils/css-parser';

// Cascade Resolver (Module 1.2)
export {
	getEffectiveValue,
	getAllEffectiveValues,
	isCustomized,
	isCustomizedFromDefaults,
	hasAnyCustomizations,
	getValueSource,
} from './theme-system/cascade-resolver';

// Control Value Normalizer (Module 1.2b)
export {
	normalizeValueForControl,
	normalizeAllValues,
	needsNormalization,
} from './theme-system/control-normalizer';

// WordPress Data Store (Module 1.3a)
export { store, STORE_NAME } from './data';

// Theme Manager (Module 1.4)
export { getThemeManager } from './theme-system/theme-manager';

// Theme Configuration (auto-generated from schemas)
// Note: Exclusions are now derived dynamically from schema.themeable field in each block
// See blocks/*/src/edit.js for excludeFromCustomizationCheck calculation

// Shared Attributes (Module 1.5)
// All attribute definitions now come from schema-generated files (e.g., accordion-attributes.js)
// Schema is the single source of truth - no manual duplicate files needed
export { getAllDefaults } from './attributes/attribute-defaults';

// Shared Utilities (Module 1.7)
export {
	generateUniqueId,
	generateThemeId,
	isIdUsed,
	markIdAsUsed,
	clearUsedIds,
	getUsedIdCount,
} from './utils/id-generator';

export {
	calculateDeltas,
	applyDeltas,
	getThemeableSnapshot,
} from './utils/delta-calculator';

export { getAlignmentClass } from './utils/getAlignmentClass';

export {
	getAccordionButtonAria,
	getAccordionPanelAria,
	getTabButtonAria,
	getTabPanelAria,
	getTabListAria,
	getTOCNavAria,
	getLiveRegionAria,
	getContentIdFromHeaderId,
	getHeaderIdFromContentId,
} from './utils/aria-helpers';

export {
	KEYS,
	isActivationKey,
	isArrowKey,
	handleAccordionKeyboard,
	handleTabsKeyboard,
	getNextIndex,
	focusElement,
	getFocusableElements,
	trapFocus,
	addKeyboardListener,
} from './utils/keyboard-nav';

export {
	isValidColor,
	validateThemeName,
	isValidNumber,
	isValidSpacing,
	isValidBorderRadius,
	isValidEnum,
	isValidFontWeight,
	isValidHeadingLevel,
	isValidBorderStyle,
	isValidIconType,
	sanitizeAttributeValue,
} from './utils/validation';

// Debug utilities
export { debug, debugError, debugWarn, debugTable } from './utils/debug';

// Shared UI Components (Module 1.6)
export { ThemeSelector } from './components/ThemeSelector';
export { CompactColorControl } from './components/CompactColorControl';
export { GenericPanel } from './components/GenericPanel';
export { SchemaPanels, SettingsPanels, AppearancePanels } from './components/SchemaPanels';
export { TabbedInspector, TAB_NAMES } from './components/TabbedInspector';
export { SubgroupPanel } from './components/SubgroupPanel';
export { ControlRenderer } from './components/ControlRenderer';
export { CustomizationWarning } from './components/CustomizationWarning';

// Re-export all controls for convenience
export * from './components/controls';

// Shared Hooks (Phase 4)
export {
	useBlockAlignment,
	useBlockThemes,
	useCSSDefaults,
	useThemeManager,
	useResponsiveDevice,
} from './hooks';
