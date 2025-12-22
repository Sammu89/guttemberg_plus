# Accessibility Testing

## WCAG AA Compliance Checklist

### Accordion Block

**ARIA Attributes**:
- [ ] `role="button"` on title
- [ ] `aria-expanded="true|false"` on title
- [ ] `aria-controls="panel-{id}"` on title
- [ ] `id="header-{id}"` on title
- [ ] `role="region"` on panel
- [ ] `aria-labelledby="header-{id}"` on panel
- [ ] `id="panel-{id}"` on panel

**Keyboard Navigation**:
- [ ] Tab focuses title button
- [ ] Enter/Space toggles accordion
- [ ] Arrow Down/Up moves between items
- [ ] Home focuses first item
- [ ] End focuses last item

**Screen Reader**:
- [ ] Announces "Accordion expanded" on open
- [ ] Announces "Accordion collapsed" on close
- [ ] Title text read correctly
- [ ] Content accessible when expanded

**Visual**:
- [ ] Focus indicator visible
- [ ] Focus indicator sufficient contrast (4.5:1)

### Tabs Block

**ARIA Attributes**:
- [ ] `role="tablist"` on container
- [ ] `aria-label` on tablist
- [ ] `role="tab"` on each tab button
- [ ] `aria-selected="true|false"` on tabs
- [ ] `aria-controls="panel-{id}"` on tabs
- [ ] `id="tab-{id}"` on tabs
- [ ] `role="tabpanel"` on panels
- [ ] `aria-labelledby="tab-{id}"` on panels
- [ ] `id="panel-{id}"` on panels
- [ ] `tabindex="0"` on active tab
- [ ] `tabindex="-1"` on inactive tabs

**Keyboard Navigation**:
- [ ] Tab focuses active tab
- [ ] Arrow Left/Right moves between tabs
- [ ] Arrow Up/Down (vertical orientation)
- [ ] Home focuses first tab
- [ ] End focuses last tab
- [ ] Selected tab panel visible

**Screen Reader**:
- [ ] Announces "Tab panel visible" on switch
- [ ] Tab label read correctly
- [ ] Panel content accessible

### TOC Block

**ARIA Attributes**:
- [ ] `role="navigation"` on container
- [ ] `aria-label="Table of Contents"` on container

**Keyboard Navigation**:
- [ ] Tab moves through links
- [ ] Enter activates link
- [ ] Links navigate to headings

**Screen Reader**:
- [ ] Announces "Table of Contents" landmark
- [ ] Link text descriptive
- [ ] Heading hierarchy correct

## Testing Tools

**Automated**:
- axe DevTools browser extension
- WAVE browser extension
- Lighthouse accessibility audit

**Screen Readers**:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS)

**Keyboard Only**:
- Unplug mouse
- Test all interactions via keyboard

## Common Issues to Check

- [ ] No duplicate IDs on page
- [ ] Focus visible at all times
- [ ] Contrast ratios sufficient
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Screen reader announcements not excessive
- [ ] Hidden content properly excluded (aria-hidden + display:none)
