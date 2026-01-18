# Block Patterns Reference

## Pattern Detection Matrix

This document shows how different structural elements map to block patterns.

## Pattern Detection Flow

```
structureMapping.structure.elements
            ↓
    detectBlockPattern()
            ↓
    ┌───────┴───────┐
    │  Element IDs  │
    │  Analysis     │
    └───────┬───────┘
            ↓
    ┌───────┴────────────────────────┐
    │                                │
    ↓                                ↓
Has tabsList?               Has list + title?
    │                                │
    YES                              YES
    ↓                                ↓
  TABS                              TOC

                           ↓
                  Has titleWrapper + content?
                           │
                          YES
                           ↓
                       ACCORDION
```

## Accordion Pattern

### Required Elements
```
┌─────────────────────────────────┐
│  .gutplus-accordion             │
│  ┌───────────────────────────┐  │
│  │  .accordion-title-wrapper │  │ ← titleWrapper
│  │  ┌─────────────────────┐  │  │
│  │  │  renderTitle()      │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  .accordion-content       │  │ ← content
│  │  ┌─────────────────────┐  │  │
│  │  │  .accordion-content- │  │  │ ← contentInner
│  │  │   inner              │  │  │
│  │  │  ┌─────────────────┐ │  │  │
│  │  │  │  InnerBlocks    │ │  │  │
│  │  │  └─────────────────┘ │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Element Mapping
| Element ID | CSS Class | Purpose |
|------------|-----------|---------|
| `titleWrapper` | `.accordion-title-wrapper` | Container for title button |
| `content` | `.accordion-content` | Main content area |
| `contentInner` | `.accordion-content-inner` | Inner content wrapper |
| `contentSlot` | (none) | InnerBlocks insertion point |

### Render Functions
- **renderTitle()** - Single button with RichText, optional heading wrapper
- Supports icon positioning: left, right, box-left, box-right
- Supports title alignment: left, center, right

## Tabs Pattern

### Required Elements
```
┌───────────────────────────────────────┐
│  .gutplus-tabs                        │
│  ┌─────────────────────────────────┐  │
│  │  .tabs-list                     │  │ ← tabsList
│  │  ┌───┐ ┌───┐ ┌───┐             │  │
│  │  │Tab│ │Tab│ │Tab│             │  │
│  │  │ 1 │ │ 2 │ │ 3 │             │  │
│  │  └───┘ └───┘ └───┘             │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │  .tabs-panels                   │  │ ← tabsPanels
│  │  ┌─────────────────────────┐    │  │
│  │  │  Tab Panel 1            │    │  │
│  │  │  (InnerBlocks)          │    │  │
│  │  └─────────────────────────┘    │  │
│  │  ┌─────────────────────────┐    │  │
│  │  │  Tab Panel 2            │    │  │
│  │  └─────────────────────────┘    │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
```

### Element Mapping
| Element ID | CSS Class | Purpose |
|------------|-----------|---------|
| `wrapper` | `.gutplus-tabs` | Main wrapper |
| `tabsList` | `.tabs-list` | Tab buttons container |
| `tabsPanels` | `.tabs-panels` | Tab panels container |

### Render Functions
- **renderTabButtons()** - Multiple buttons from tabsData array
- Iterates over `attributes.tabsData`
- Supports heading wrapper per tab
- Supports horizontal scroll wrapper

### Special Features
- Horizontal orientation: Adds scroll buttons
- Vertical orientation: No scroll wrapper
- Active tab tracking with `currentTab`

## TOC Pattern

### Required Elements
```
┌─────────────────────────────────────┐
│  .gutplus-toc                       │
│  ┌───────────────────────────────┐  │
│  │  .toc-header-wrapper          │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  renderHeader()         │  │  │ ← titleButton OR titleStatic
│  │  │  (button or static)     │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  .toc-content               │  │ ← content
│  │  ┌─────────────────────────┐  │  │
│  │  │  .toc-list              │  │  │ ← list
│  │  │  • Item 1               │  │  │
│  │  │  • Item 2               │  │  │
│  │  │  • Item 3               │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Element Mapping
| Element ID | CSS Class | Purpose |
|------------|-----------|---------|
| `wrapper` | `.gutplus-toc` | Main wrapper |
| `titleButton` | `.toc-title` (button) | Collapsible title button |
| `titleStatic` | `.toc-title` (div) | Static title display |
| `content` | `.toc-content` | Content area (nav element) |
| `list` | `.toc-list` | List container (ul) |

### Render Functions
- **renderHeader()** - Conditional button or static title
- Checks `isCollapsible` to determine button vs static
- Checks `showTitle` to show/hide title
- Supports icon positioning like accordion

### Special Features
- No InnerBlocks (list generated from page headings)
- Conditional title rendering based on `titleStyle`
- Static title when not collapsible

## Pattern Comparison

| Feature | Accordion | Tabs | TOC |
|---------|-----------|------|-----|
| **Title Rendering** | Single button | Multiple buttons | Conditional button/static |
| **InnerBlocks** | Yes (content area) | Yes (tab panels) | No (auto-generated list) |
| **Heading Wrapper** | Optional per item | Optional per tab | Not supported |
| **Icon Support** | Yes (4 positions) | Yes (left/right) | Yes (4 positions) |
| **Alignment** | Yes (title) | No | Yes (title) |
| **Data Source** | attributes.title | attributes.tabsData | Page headings |
| **Multiple Items** | Single | Array of tabs | Auto-detected headings |

## Detection Priority

The pattern detection follows this priority order:

1. **Tabs** - Checked first (tabsList + tabsPanels)
2. **TOC** - Checked second (list + titleStatic/titleButton)
3. **Accordion** - Checked third (titleWrapper + content + contentInner)
4. **Fallback** - Uses `blockType` from mapping

This priority ensures unique patterns are detected correctly without conflicts.

## Adding Custom Patterns

To add a new pattern, ensure it has:

1. **Unique element combination** - Different from existing patterns
2. **Clear structure hierarchy** - Parent/child relationships defined
3. **Required elements** - Minimum set for pattern to function
4. **Render function(s)** - Title/header and content generators

Example for a hypothetical "carousel" pattern:

```javascript
// Detection
if (elementIds.includes('carouselTrack') && elementIds.includes('carouselSlides')) {
  return 'carousel';
}

// Required Elements
{
  carouselWrapper: { ... },
  carouselTrack: { ... },
  carouselSlides: { ... },
  carouselNav: { ... }
}
```

## Validation Rules

Each pattern has specific validation rules:

### Accordion
```javascript
✓ Must have titleWrapper
✓ Must have content
✓ Must have contentInner
```

### Tabs
```javascript
✓ Must have wrapper
✓ Must have tabsList
✓ Must have tabsPanels
```

### TOC
```javascript
✓ Must have wrapper
✓ Must have content
✓ Must have list
✓ Must have titleStatic OR titleButton (at least one)
```

## Mode Differences

### Save Mode
- Uses `RichText.Content`
- Uses `InnerBlocks.Content`
- Includes ARIA attributes
- Server-side rendering

### Edit Mode
- Uses `RichText` with onChange handlers
- Uses `InnerBlocks` with template options
- Interactive editing
- Client-side only

Each pattern generator handles both modes appropriately.
