/**
 * Shared Components - Index
 *
 * Exports all shared UI components.
 *
 * @package guttemberg-plus
 * @since 1.0.0
 */

// ==================== Panel Components (Phase 5) ====================

// Tabbed Inspector - Two-tab layout for Settings and Appearance
export { TabbedInspector, TAB_NAMES } from './TabbedInspector';

// Control Renderer - Universal control renderer for schema-defined controls
export { ControlRenderer } from './ControlRenderer';

// Subgroup Panel - Panel with subgroup selector for complex groups
export { SubgroupPanel } from './SubgroupPanel';

// Generic Panel - Schema-driven panel for any attribute group
export { default as GenericPanel } from './GenericPanel';

// Schema Panels - Auto-generate all sidebar panels from schema
export {
	default as SchemaPanels,
	SchemaPanels as SchemaPanelsNamed,
	SettingsPanels,
	AppearancePanels,
} from './SchemaPanels';

// ==================== Utility Components ====================

// Theme Selector - Theme switching component
export { default as ThemeSelector } from './ThemeSelector';

// Customization Warning - Warning for customized attributes
export { default as CustomizationWarning } from './CustomizationWarning';

// Compact Color Control - Simple color picker control
export { default as CompactColorControl } from './CompactColorControl';

// ==================== Re-export Controls ====================

// Re-export all controls from controls/index.js for convenience
export * from './controls';
