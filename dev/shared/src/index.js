/**
 * Shared Modules - Entry Point
 *
 * Exports all shared utilities, components, and systems
 * for use across all block types (accordion, tabs, toc)
 *
 * @package
 * @since 1.0.0
 */

// Cascade Resolver (Module 1.2)
export {
	getEffectiveValue,
	getAllEffectiveValues,
	isCustomized,
	isCustomizedFromDefaults,
	hasAnyCustomizations,
	getValueSource,
} from './theme-system/cascade-resolver';

// WordPress Data Store (Module 1.3a)
export { store, STORE_NAME } from './data';

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

export { calculateDeltas, applyDeltas, getThemeableSnapshot } from './utils/delta-calculator';

export { getAlignmentClass } from './utils/getAlignmentClass';

export { buildBoxShadow } from './utils/shadow-utils';

export { renderSingleIcon, renderIconWrapper } from './utils/icon-renderer';

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


// Shared UI Components (Module 1.6)
export { ThemeSelector } from './components/ThemeSelector';
export { CompactColorControl } from './components/CompactColorControl';
export { GenericPanel } from './components/GenericPanel';
export { SchemaPanels, SettingsPanels, AppearancePanels } from './components/SchemaPanels';
export { TabbedInspector, TAB_NAMES } from './components/TabbedInspector';
export { SubgroupPanel } from './components/SubgroupPanel';
export { ControlRenderer } from './components/ControlRenderer';
export { CustomizationWarning } from './components/CustomizationWarning';
export { BreakpointSettings } from './components/BreakpointSettings';

// Re-export all controls for convenience
export * from './components/controls';

// Compression/Decompression Utilities (Module 1.7)
export {
	compressAttributes,
	compressCustomizations,
	getCompressionStats,
} from './utils/attribute-compression';

export {
	decompressAttributes,
	decompressCustomizations,
} from './utils/attribute-decompression';

// Shared Hooks (Phase 4)
export {
	useBlockAlignment,
	useThemeManager,
	useResponsiveDevice,
} from './hooks';
