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

// Theme Configuration
export {
	getExclusionsForBlock,
	ACCORDION_EXCLUSIONS,
	TABS_EXCLUSIONS,
	TOC_EXCLUSIONS,
} from './config/theme-exclusions';

// Shared Attributes (Module 1.5)
export { colorAttributes } from './attributes/color-attributes';
export { typographyAttributes } from './attributes/typography-attributes';
export { borderAttributes } from './attributes/border-attributes';
export { spacingAttributes } from './attributes/spacing-attributes';
export { iconAttributes } from './attributes/icon-attributes';
export { metaAttributes } from './attributes/meta-attributes';
export { behavioralDefaults, getAllDefaults } from './attributes/attribute-defaults';

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
export { ColorPanel } from './components/ColorPanel';
export { HeaderColorsPanel } from './components/HeaderColorsPanel';
export { ContentColorsPanel } from './components/ContentColorsPanel';
export { CompactColorControl } from './components/CompactColorControl';
export { TypographyPanel } from './components/TypographyPanel';
export { BorderPanel } from './components/BorderPanel';
export { IconPanel } from './components/IconPanel';
export { CustomizationWarning } from './components/CustomizationWarning';

// Shared Hooks (Phase 4)
export { useBlockThemes, useCSSDefaults } from './hooks';
