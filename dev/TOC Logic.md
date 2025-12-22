# Plan

Build editable TOC entries that materialize as movable text-like blocks, remember deletions across rescans, and keep frontend output in sync with the curated list.

## Current behavior
- Scan button in `blocks/toc/src/edit.js` walks block tree via `extractHeadingsFromBlocks`, stores results in component state, and renders a preview list only in the editor.
- Saved markup from `blocks/toc/src/save.js` outputs a placeholder list plus data attributes; `blocks/toc/src/frontend.js` rescans the DOM on load, injects missing heading IDs, and builds the live TOC.
- No persisted list of headings exists; deletions, ordering, or edits in the editor are not tracked, and filter settings are applied at scan/render time only.

## Requirements
- Clicking Scan for headings should generate one text-like block per heading so editors can reorder, edit, or delete entries.
- Each entry shows an inline X/delete affordance; deleting records that heading so future scans skip it.
- When any heading is deleted, show a Reset deleted headings button to clear the ignore list and allow regeneration.
- Later scans add new headings but avoid re-adding ignored ones unless reset, preserving existing order/content, and the published TOC should follow the curated list.

## Scope
- In: TOC block editor experience, block attributes/state, saved markup, frontend JS rendering, light styling for new controls.
- Out: Theme schema definitions, PHP defaults, non-TOC blocks.

## Data model / UI approach
- Add persisted attributes for curated items (array of `{ id, text, level, sourceClientId?, anchor }`) and `deletedHeadingIds` (set of identifiers/anchors).
- Use a deterministic heading identifier (prefer anchor; fallback to slugified text namespaced by `tocId` and source block clientId) to track duplicates and deletions across scans.
- Introduce an inner item representation (custom toc-item block styled like a paragraph or InnerBlocks-managed list) to enable drag/drop ordering and inline delete while keeping anchor metadata.
- Reconcile scans with existing items: keep untouched entries, append new ones, filter out deleted IDs, and refresh text/level when source headings change.
- Persist curated list in saved markup (data attributes or serialized JSON) so the frontend can render without reordering; fall back to DOM scan if no curated data exists.
- Gutenberg-native approach: use `InnerBlocks` with `core/paragraph` children (no template lock), insert paragraphs on scan with `createBlock` + `replaceInnerBlocks/insertBlocks`, add level classes (e.g., `toc-entry toc-level-2 header2`), wrap with inline delete controls that call `removeBlocks` and record deletions, and keep parent attributes for `{ id/anchor, level, sourceClientId }` plus `deletedHeadingIds` to drive merges and resets.

## Handling Anchor Changes
- Always treat the parent `tocItems` array as the source of truth for `{ anchor/id, text, level, sourceClientId }` and use `InnerBlocks` paragraphs purely for editor ordering and visible links.
- When saving or syncing from the editor, rebuild `tocItems` by pairing each paragraph's `href`/text back to its stored metadata; if a paragraph has no matching anchor in the curated list, drop that entry to avoid stale data.
- During scan merges, ignore anchors recorded in `deletedHeadingIds`, append only new anchors, and preserve existing text/order; a Reset button clears `deletedHeadingIds` so rescans can re-add them.
- If a paragraph's anchor changes (e.g., user edits the link), treat it as a new entry: remove the old anchor from `tocItems`, insert the new anchor with the current text/level, and ensure `deletedHeadingIds` does not block it unless explicitly reset.

## Files and entry points
- `blocks/toc/src/edit.js`: heading detection, new attributes, item creation/removal UI, reset button visibility, scan merge logic.
- `blocks/toc/src/save.js`: expose curated items/deleted IDs in saved output and adjust placeholder/list markup.
- `blocks/toc/src/frontend.js`: render TOC using curated items when present, assign IDs to target headings, and fall back to DOM detection otherwise; keep smooth scroll/spy/collapsible behaviors.
- `blocks/toc/src/index.js` plus new toc-item block files (edit/save/metadata) and related styles in `editor.scss`/`style.scss`.

## Action items
[x] Add attributes/types for `tocItems` and `deletedHeadingIds`, including identifier/slug utilities and serialization helpers.
[x] Refactor the edit view to manage InnerBlocks or a custom toc-item block created on scan; hydrate/dehydrate curated items into attributes when users reorder.
[x] Implement delete handling (X button and inner-block removal) that records heading identifiers into `deletedHeadingIds` and surfaces the Reset deleted headings control.
[x] Update scan workflow to merge new headings while skipping deleted IDs, avoid duplicates, and honor existing filter settings and numbering choices.
[x] Adjust `save.js` to persist curated items/deleted IDs in the markup/data payload the frontend can read without breaking existing output.
[x] Update `frontend.js` to prefer curated items for rendering, ensure anchors exist for each entry, and keep smooth scroll/highlight/collapse behaviors intact.
[x] Style the new editor controls (item layout, delete icon, reset button) and ensure accessible labels/focus management.
[ ] Validate manually: scan → generate items → reorder/delete → reset in editor; confirm saved TOC matches curated order on the frontend with smooth scroll/highlight and no regressions to filters/collapse.

## Risks and edge cases
- Duplicate heading text or missing anchors could make identifiers unstable; mitigate with slug + `tocId` + source `clientId` where available.
- Editors may change item text manually and desync from source headings; consider optional resync cues or warning.
- Persisted curated data must stay compact and backward compatible so older TOC blocks still render via DOM scanning.
- Frontend must degrade gracefully when curated data is absent or malformed to avoid breaking existing pages.
