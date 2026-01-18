/**
 * Shared Utilities - Entry Point
 *
 * Exports all utility functions for use across blocks
 *
 * @package
 * @since 1.0.0
 */

// ID Generator utilities
export {
	generateUniqueId,
	generateThemeId,
	isIdUsed,
	markIdAsUsed,
	clearUsedIds,
	getUsedIdCount,
} from './id-generator';

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
	getHeaderIdFromContentId,
} from './aria-helpers';

// Delta Calculator utilities
export { calculateDeltas, applyDeltas, getThemeableSnapshot } from './delta-calculator';

// Alignment utilities
export { getAlignmentClass } from './getAlignmentClass';

// Batch Block Updater utilities
export {
	findBlocksUsingTheme,
	batchUpdateCleanBlocks,
	batchResetBlocksUsingTheme,
	showBatchUpdateNotification,
} from './batch-block-updater';

// Shadow utilities
export {
	buildBoxShadow,
	buildTextShadow,
	formatShadowValue,
	createDefaultShadowLayer,
	duplicateShadowLayer,
} from './shadow-utils';

// Reset Helper utilities
export {
	createComprehensiveReset,
	hasDeviceOverrides,
	removeDeviceOverrides,
	isLinked,
	getDeviceValue,
} from './reset-helpers';

// Icon Renderer utilities
export { renderSingleIcon, renderIconWrapper } from './icon-renderer';
