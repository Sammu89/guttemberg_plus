/**
 * Combined Theme Exclusions for All Blocks
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: schemas/*.json
 * Generated at: 2025-11-23T00:53:01.623Z
 *
 * This file is regenerated on every build. Any manual changes will be lost.
 * To modify this file, update the source schema and run: npm run schema:build
 *
 * @package GuttemberPlus
 * @since 1.0.0
 */

// Re-export all exclusions from individual block files
export { ACCORDION_EXCLUSIONS } from './accordion-exclusions.js';
export { TABS_EXCLUSIONS } from './tabs-exclusions.js';
export { TOC_EXCLUSIONS } from './toc-exclusions.js';

/**
 * Get exclusions for a specific block type
 */
export function getExclusionsForBlock(blockType) {
  switch (blockType) {
    case 'accordion':
      return ACCORDION_EXCLUSIONS;
    case 'tabs':
      return TABS_EXCLUSIONS;
    case 'toc':
      return TOC_EXCLUSIONS;
    default:
      console.warn(`Unknown block type: ${blockType}`);
      return [];
  }
}
