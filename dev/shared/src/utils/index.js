/**
 * Shared Utilities - Entry Point
 *
 * Exports all utility functions for use across blocks
 *
 * @package GuttembergPlus
 * @since 1.0.0
 */

// CSS Parser utilities
export {
  getCSSDefault,
  getAllCSSDefaults,
  areCSSDefaultsLoaded,
  getCSSDefaultWithFallback,
  getMultipleCSSDefaults
} from './css-parser';

// Validation utilities
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
  sanitizeAttributeValue
} from './validation';

// ID Generator utilities
export {
  generateUniqueId,
  generateThemeId,
  isIdUsed,
  markIdAsUsed,
  clearUsedIds,
  getUsedIdCount
} from './id-generator';

// Keyboard Navigation utilities
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
  addKeyboardListener
} from './keyboard-nav';

// ARIA Helper utilities
export {
  getAccordionButtonAria,
  getAccordionPanelAria,
  getTabButtonAria,
  getTabPanelAria,
  getTabListAria,
  getTOCNavAria,
  getLiveRegionAria,
  getContentIdFromHeaderId,
  getHeaderIdFromContentId
} from './aria-helpers';

// Debug utilities
export {
  debug,
  debugError,
  debugWarn,
  debugTable
} from './debug';

// Delta Calculator utilities
export {
  calculateDeltas,
  applyDeltas,
  getThemeableSnapshot
} from './delta-calculator';

// Schema Config Builder utilities
export {
  getPanelConfig,
  getAttributesByPanel,
  validatePanelConfig,
  getAttributeConfig,
  getSchemaGroups,
  getThemeableAttributes,
  buildAttributeMapping,
  getControlConfiguration
} from './schema-config-builder';

// Alignment utilities
export { getAlignmentClass } from './getAlignmentClass';

// Batch Block Updater utilities
export {
  findBlocksUsingTheme,
  batchUpdateCleanBlocks,
  batchResetBlocksUsingTheme,
  showBatchUpdateNotification
} from './batch-block-updater';

// Responsive utilities
export {
  getResponsiveValue,
  isInheritedValue,
  setResponsiveValue,
  generateResponsiveCSS,
  generateMediaQueryCSS,
  clearResponsiveValue,
  hasResponsiveOverrides,
  ensureResponsiveValue,
  generateCompleteResponsiveCSS
} from './responsive-utils';
