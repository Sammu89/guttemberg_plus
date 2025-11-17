# Building Accessible HTML Accordion Components

## Introduction

An accordion is an interactive component that allows users to show and hide sections of content. When built correctly, accordions help organize complex information while remaining fully accessible to all users, including those using assistive technologies like screen readers and keyboard-only navigation.

This guide covers the HTML structure, ARIA attributes, keyboard interactions, and best practices needed to build a fully accessible accordion component following W3C WAI-ARIA Authoring Practices.

**Shared Architecture Note**: The HTML structure patterns described in this document apply to both Accordion and Tabs blocks. Shared utilities from `src/shared/utils/` handle ID generation (`id-generator.js`), ARIA attribute management (`aria-helpers.js`), and keyboard navigation (`keyboard-nav.js`). Both blocks use identical accessibility patterns with block-specific adaptations where needed.

---

## 1. HTML Structure Requirements

### Complete Semantic HTML Structure

A properly structured accordion consists of three main parts:

1. **Container** - Wraps the entire accordion
2. **Header/Toggle Button** - The clickable element that expands/collapses content
3. **Content Panel** - The region containing the collapsible content

```html
<div class="accordion">
  <!-- Accordion Item 1 -->
  <div class="accordion-item">
    <h3 class="accordion-header"> # optional, user may not want headers here
      <button type="button"
              aria-expanded="false"
              aria-controls="panel-1"
              id="accordion-button-1">
        Section 1 Title
        <span class="accordion-icon" aria-hidden="true"></span>
      </button>
    </h3> # optional, user may not want headers here
    <div id="panel-1"
         role="region"
         aria-labelledby="accordion-button-1"
         hidden>
      <div class="accordion-content">
        <p>Content for section 1 goes here.</p>
      </div>
    </div>
  </div>

  <!-- Accordion Item 2 -->
  <div class="accordion-item">
    <h3 class="accordion-header"> # optional, user may not want headers here
      <button type="button"
              aria-expanded="false"
              aria-controls="panel-2"
              id="accordion-button-2">
        Section 2 Title
        <span class="accordion-icon" aria-hidden="true"></span>
      </button>
    </h3> # optional, user may not want headers here
    <div id="panel-2"
         role="region"
         aria-labelledby="accordion-button-2"
         hidden>
      <div class="accordion-content">
        <p>Content for section 2 goes here.</p>
      </div>
    </div>
  </div>
</div>
```

### Required Elements

#### 1. Accordion Container
The outer container groups related accordion items together. This doesn't require specific ARIA roles but should be semantically meaningful.

```html
<div class="accordion">
  <!-- accordion items -->
</div>
```

#### 2. Accordion Item
Each individual accordion section contains a header and content panel.

```html
<div class="accordion-item">
  <!-- header + content panel -->
</div>
```

#### 3. Header with Button and Heading (optional)
The header contains the toggle button. The button must be the interactive element, not the heading itself, but the heading is optinal as user may choose not to have a heading.

```html
<h3 class="accordion-header">
  <button type="button" aria-expanded="false" aria-controls="panel-id">
    Section Title
  </button>
</h3>
```

**Why use a button?**
- Buttons are natively keyboard accessible
- Screen readers automatically announce them as interactive controls
- They receive focus in the natural tab order
- They respond to both Enter and Space keys

#### 4. Content Panel
The collapsible region containing the actual content.

```html
<div id="panel-id"
     role="region"
     aria-labelledby="button-id"
     hidden>
  <div class="accordion-content">
    <!-- actual content -->
  </div>
</div>
```

### Proper Heading Hierarchy Integration if user chooses the option to include a heading

Accordions should maintain proper heading hierarchy (h1-h6) within your document outline.

**Example in a page structure:**

```html
<main>
  <h1>Page Title</h1>

  <section>
    <h2>FAQ Section</h2>

    <div class="accordion">
      <div class="accordion-item">
        <h3 class="accordion-header">
          <button type="button" aria-expanded="false" aria-controls="faq-1">
            What is your refund policy?
          </button>
        </h3>
        <div id="faq-1" role="region" aria-labelledby="faq-button-1" hidden>
          <p>Our refund policy content...</p>
        </div>
      </div>

      <div class="accordion-item">
        <h3 class="accordion-header">
          <button type="button" aria-expanded="false" aria-controls="faq-2">
            How long does shipping take?
          </button>
        </h3>
        <div id="faq-2" role="region" aria-labelledby="faq-button-2" hidden>
          <p>Shipping information...</p>
        </div>
      </div>
    </div>
  </section>
</main>
```

**Why proper heading hierarchy matters:**
- Screen reader users navigate by headings
- Proper hierarchy communicates content structure
- Improves SEO and document outline
- Maintains semantic meaning

### When to Use Heading Tags vs Plain Buttons

**Use heading tags wrapping buttons when:**
- The user explicit activates this option on the editor sidebar. Its off by default
- User defines the heading level, h2 being the default
- The accordion is part of a structured content hierarchy

```html
<h3 class="accordion-header">
  <button type="button" aria-expanded="false">
    This is a semantic heading
  </button>
</h3>
```

**Use plain buttons (no heading wrapper) when:**
- It's the default option to be used, except if user explicit activates the use tile as heading option on the editor sidebar.

```html
<div class="accordion-header">
  <button type="button" aria-expanded="false">
    This is just a toggle control
  </button>
</div>
```

---

## 2. ARIA Attributes & Accessibility

ARIA (Accessible Rich Internet Applications) attributes communicate the state and relationships of accordion components to assistive technologies.

### Required ARIA Roles

#### button role
While native `<button>` elements automatically have the button role, it's important to use actual button elements rather than div or span elements styled as buttons.

```html
<!-- Correct: Native button (role implicit) -->
<button type="button">Toggle</button>

<!-- Incorrect: Div styled as button (even with role) -->
<div role="button">Toggle</div>
```

#### region role
The content panel should have `role="region"` to identify it as a significant section of content.

```html
<div role="region" aria-labelledby="button-id">
  <!-- panel content -->
</div>
```


### Required ARIA States and Properties

#### aria-expanded
Indicates whether the accordion panel is currently expanded or collapsed. This is applied to the button element.

```html
<!-- Collapsed state -->
<button aria-expanded="false">Section Title</button>

<!-- Expanded state -->
<button aria-expanded="true">Section Title</button>
```

**Important:** This attribute must be updated via JavaScript when the accordion state changes.

#### aria-controls
Creates a relationship between the button and the panel it controls. The value is the ID of the controlled panel.

```html
<button aria-controls="panel-1">Toggle</button>
<div id="panel-1" role="region">Content</div>
```

**Why it's required:**
- Links the button to the content it controls
- Some screen readers allow direct navigation from button to controlled content
- Creates a programmatic relationship

#### aria-labelledby
Applied to the panel to reference the button that labels it. The value is the ID of the button element.

```html
<button id="accordion-button-1">Section Title</button>
<div role="region" aria-labelledby="accordion-button-1">Content</div>
```

**Why it's required:**
- Provides an accessible name for the region
- Creates bidirectional relationship with the button
- Ensures screen readers announce the panel's purpose

### Unique ID Requirements

Every button and panel pair must have unique IDs within the page to establish proper ARIA relationships.

```html
<!-- Accordion Item 1 -->
<button id="btn-1" aria-controls="panel-1">Title 1</button>
<div id="panel-1" aria-labelledby="btn-1">Content 1</div>

<!-- Accordion Item 2 -->
<button id="btn-2" aria-controls="panel-2">Title 2</button>
<div id="panel-2" aria-labelledby="btn-2">Content 2</div>
```

**Why unique IDs matter:**
- Duplicate IDs violate HTML specifications
- ARIA relationships break with duplicate IDs
- Screen readers may announce incorrect relationships
- Can cause JavaScript targeting issuess
- Ensure uniqueness across the entire page, not just within the accordion

### Hidden Attribute Usage

The `hidden` attribute should be used on closed panels to properly hide content from all users.

```html
<!-- Closed panel -->
<div id="panel-1" role="region" hidden>
  <p>This content is hidden from everyone</p>
</div>

<!-- Open panel -->
<div id="panel-2" role="region">
  <p>This content is visible to everyone</p>
</div>
```

**Why use hidden attribute:**
- Removes content from accessibility tree (screen readers skip it)
- Hides content visually (with CSS `display: none`)
- Removes focusable elements from tab order
- More semantic than CSS-only hiding

**Alternative approaches:**

Some implementations use CSS classes for hiding (display: none or height: 0). While this can work, the `hidden` attribute is more semantic and provides better default behavior.

```html
<!-- Using hidden attribute (recommended) -->
<div id="panel-1" role="region" hidden>Content</div>

<!-- Using CSS class (alternative) -->
<div id="panel-2" role="region" class="is-closed">Content</div>
```

If using CSS classes, ensure the CSS applies `display: none` or completely removes the content from the accessibility tree.


### Focus Management Requirements

Focus management ensures keyboard users can predictably navigate the accordion.

**Requirements:**

1. **Focus remains on button after activation**
   - When user clicks/presses Enter on button
   - Focus should stay on the button (not move to panel)
   - Allows user to continue navigating accordion items

2. **Focus order follows DOM order**
   - Tab key moves through buttons in sequence
   - Content inside panels receives focus when expanded

3. **Visible focus indicators**
   - Buttons must have clear focus styles
   - Users must see where keyboard focus is located

4. **No focus trapping**
   - Users can freely tab out of accordion
   - Focus doesn't get stuck inside panels

**Example focus flow:**
```
[Button 1] -> Tab -> [Button 2] -> Tab -> [Button 3] -> Tab -> Next focusable element
```

If Button 2 is expanded:
```
[Button 1] -> Tab -> [Button 2] -> Tab -> [Link in Panel 2] -> Tab -> [Button 3]
```

---

## 3. Keyboard Navigation Requirements

Keyboard accessibility is essential for users who cannot use a mouse, including those with motor disabilities and power users who prefer keyboard navigation.

### Tab Navigation Behavior

**Standard behavior:**
- Tab key moves focus forward through all focusable elements
- Shift+Tab moves focus backward
- Buttons are in the natural tab order
- Content inside expanded panels is also in tab order

**Implementation notes:**
- Don't add `tabindex` to non-interactive elements
- Buttons naturally have `tabindex="0"`
- Hidden panels (with `hidden` attribute) automatically remove their content from tab order

```html
<!-- Collapsed: Link inside is NOT tabbable -->
<button tabindex="0" aria-expanded="false">Section 1</button>
<div hidden>
  <a href="#">This link cannot receive focus</a>
</div>

<!-- Expanded: Link inside IS tabbable -->
<button tabindex="0" aria-expanded="true">Section 2</button>
<div>
  <a href="#">This link can receive focus</a>
</div>
```

### Enter and Space Key for Toggle

Both Enter and Space keys should toggle the accordion panel. Native button elements provide this behavior automatically.

**Native button behavior:**
- Enter key: Activates button (triggers click event)
- Space key: Activates button (triggers click event)

**Why this matters:**
- Follows standard button interaction patterns
- Matches user expectations
- No custom JavaScript needed for key handling

**Important:** If you must use a non-button element (not recommended), you'll need to manually handle both keys:

```html
<!-- Avoid this approach -->
<div role="button" tabindex="0" onkeydown="handleKeyPress(event)">
  Toggle
</div>
```

### Focus Indicators

Visual focus indicators are legally required (WCAG 2.1 Level AA) and help keyboard users understand where they are on the page.

**Requirements:**
- Focus indicators must be clearly visible
- Minimum 3:1 contrast ratio against background
- Should not rely on color alone
- Must be present for all focusable elements

**Example CSS approach (conceptual):**
```
button:focus {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

**What to avoid:**
- Never use `outline: none` without a replacement
- Don't hide focus indicators
- Don't make indicators too subtle (low contrast)

### Focus Trapping

**For accordions: Focus trapping is NOT applicable**

Focus trapping (preventing Tab from leaving a component) is used in modal dialogs but should NOT be used in accordions.

**Correct behavior:**
Users should be able to:
- Tab into the accordion
- Navigate through accordion buttons
- Tab through content in expanded panels
- Tab out of the accordion to the next page element

---

## 4. Visual Requirements

While this guide focuses on HTML structure, certain visual patterns are important for accessibility and usability.

### Icon Positioning

Accordion toggles commonly use icons (arrows, plus/minus, chevrons) to indicate expandable content. The icon position affects visual scanning and design layout.

**Common positions:**

1. **Right-aligned (adjacent to text)**
   ```html
   <button>
     Section Title
     <span class="icon" aria-hidden="true">▼</span>
   </button>
   ```

2. **Left-aligned (before text)**
   ```html
   <button>
     <span class="icon" aria-hidden="true">▼</span>
     Section Title
   </button>
   ```

3. **Extreme-right (pushed to far right)**
   ```html
   <button>
     <span class="text">Section Title</span>
     <span class="icon" aria-hidden="true">▼</span>
   </button>
   ```
4. **Extreme-left (pushed to far left)**
   ```html
   <button>
     <span class="icon" aria-hidden="true">▼</span>
     <span class="text">Section Title</span>
   </button>
   ```

**Icon accessibility:**
- Always use `aria-hidden="true"` on decorative icons
- Icons should be purely decorative (state conveyed by aria-expanded)
- Don't rely on icons alone to communicate state


### Icon Rotation on Open/Close

Icons typically rotate or change to indicate state, this will be user defined by the editor sidebar, with a option to change icon when the accordion is closed. User will chose between animation with 180º rotation or icon change with animation.

**Structural consideration:**
The icon element should remain in the DOM but change appearance through CSS based on the button's aria-expanded state.

```html
<!-- CSS targets aria-expanded state to rotate icon -->
<button aria-expanded="false">
  Title
  <span class="icon" aria-hidden="true">▼</span>
</button>

<!-- When expanded (same HTML, different attribute) -->
<button aria-expanded="true">
  Title
  <span class="icon" aria-hidden="true">▼</span>
</button>
```

### Content Visibility Transitions

Smooth transitions improve user experience by making state changes clear.

**Structural considerations:**

1. **No transition (instant)**
   - Add/remove `hidden` attribute directly
   - Content appears/disappears immediately

2. **With transition (animated)**
   - May use CSS classes instead of `hidden` attribute
   - Allows for height animations, fades, etc.
   - Must ensure content remains hidden from screen readers when closed

### Border and Styling Considerations

**Visual separation:**
Borders help users distinguish between accordion items.

```html
<div class="accordion">
  <div class="accordion-item"> <!-- Often has border-bottom -->
    <button>Item 1</button>
    <div>Content 1</div>
  </div>

  <div class="accordion-item"> <!-- Often has border-bottom -->
    <button>Item 2</button>
    <div>Content 2</div>
  </div>
</div>
```

**Visual state indication:**
Beyond icons, visual changes help indicate state:
- Background color changes on hover/focus
- Border color changes when expanded
- Font weight changes on active item

---

## 5. JavaScript Behavior

While this guide doesn't include actual code, understanding the JavaScript requirements helps ensure proper HTML structure.

### Click Handler Requirements

**What must happen on button click:**

1. Determine current state (read aria-expanded)
2. Toggle state to opposite value
3. Update aria-expanded attribute
4. Show/hide panel (toggle hidden attribute or CSS class)
5. Update visual indicators (icons, classes)
6. Do NOT move focus (focus stays on button)

**Interaction points in HTML:**

```html
<button
  type="button"
  aria-expanded="false"  <!-- JavaScript reads this -->
  aria-controls="panel-1" <!-- JavaScript uses this to find panel -->
  id="btn-1">
  Title
</button>

<div
  id="panel-1"  <!-- JavaScript targets this -->
  role="region"
  aria-labelledby="btn-1"
  hidden> <!-- JavaScript toggles this -->
  Content
</div>
```

### ARIA State Synchronization

Critical requirement: ARIA attributes must always reflect actual visual state.

**Bad example (out of sync):**
- Panel is visible on screen
- But aria-expanded="false" on button
- Screen reader users think panel is closed
- Violates accessibility guidelines

**Good example (synchronized):**
- Panel is visible = aria-expanded="true"
- Panel is hidden = aria-expanded="false"
- Visual state matches programmatic state

**Synchronization checklist:**
1. When panel becomes visible: Set aria-expanded="true"
2. When panel becomes hidden: Set aria-expanded="false"
3. Update happens before or during visual transition
4. No delay between visual change and ARIA update

### CSS Class Toggling

Many implementations use CSS classes to manage state:

```html
<!-- Closed state -->
<div class="accordion-item">
  <button aria-expanded="false" class="accordion-button">
    Title
  </button>
  <div class="accordion-panel is-closed" hidden>
    Content
  </div>
</div>

<!-- Open state -->
<div class="accordion-item is-active">
  <button aria-expanded="true" class="accordion-button is-open">
    Title
  </button>
  <div class="accordion-panel is-open">
    Content
  </div>
</div>
```

**Common class patterns:**
- `.is-open` / `.is-closed` on button
- `.is-expanded` / `.is-collapsed` on panel
- `.is-active` on accordion item container
- `.is-animating` during transitions

**Important:** CSS classes are for styling only. Don't use them as the sole source of truth for state. ARIA attributes are the authoritative state indicators.

### Animation Timing Considerations

**Structural impact of animations:**

1. **Using hidden attribute with animations:**
   - Problem: `hidden` uses `display: none` which can't be animated
   - Solution: Toggle classes for animations, then add/remove `hidden`

2. **Ensuring accessibility during animations:**
   - Content should not be keyboard-accessible while closing
   - aria-expanded should update when animation starts
   - `hidden` attribute (or equivalent) should be present when animation completes

**Timing sequence (conceptual):**
1. User clicks button
2. Update aria-expanded immediately
3. Begin visual transition
4. During transition: Content is becoming hidden but not yet removed from accessibility tree
5. After transition: Add `hidden` attribute to fully remove from accessibility tree


---


## 7. Best Practices

### W3C WAI-ARIA Authoring Practices Guidelines

The W3C maintains the ARIA Authoring Practices Guide (APG) which provides the canonical pattern for accordions.

**Key requirements from W3C APG:**

1. **Accordion button must have aria-expanded**
   - Set to true when panel is expanded
   - Set to false when panel is collapsed

2. **Panel must be associated with its button**
   - Use aria-controls on button (points to panel ID)
   - Use aria-labelledby on panel (points to button ID)

3. **Heading hierarchy must be appropriate**
   - Use heading elements that fit document structure
   - Or omit headings if not semantically appropriate

4. **Keyboard support:**
   - Enter or Space: Toggle panel
   - Tab: Move focus through buttons and expanded content
   - Optionally: Arrow keys to move between buttons (not required)

5. **Role usage:**
   - Buttons should be native button elements
   - Panels should have role="region"

**W3C APG accordion pattern reference:**
https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

**Important note:** The W3C pattern is the authoritative source. When in doubt, follow their guidance.


## Summary Checklist

When building an accordion component, ensure:

### HTML Structure
- [ ] Use native `<button>` elements for toggles
- [ ] Wrap buttons in appropriate heading tags (h2-h6)
- [ ] Use semantic container elements
- [ ] Maintain logical document outline
- [ ] Include content panels with proper structure

### ARIA Attributes
- [ ] Add `aria-expanded` to all buttons (true/false)
- [ ] Add `aria-controls` to buttons (references panel ID)
- [ ] Add `role="region"` to content panels
- [ ] Add `aria-labelledby` to panels (references button ID)
- [ ] Add `aria-hidden="true"` to decorative icons
- [ ] Use `hidden` attribute on closed panels

### IDs and Relationships
- [ ] Assign unique IDs to all buttons
- [ ] Assign unique IDs to all panels
- [ ] Ensure aria-controls matches panel ID
- [ ] Ensure aria-labelledby matches button ID
- [ ] Verify no duplicate IDs on page

### Keyboard Accessibility
- [ ] Buttons are in natural tab order
- [ ] Enter key toggles accordion
- [ ] Space key toggles accordion
- [ ] Focus remains on button after activation
- [ ] Clear focus indicators visible
- [ ] Hidden content not in tab order

### Visual Design
- [ ] Icons marked with aria-hidden="true"
- [ ] Icons change to reflect state
- [ ] Clear visual distinction between items
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Animations respect prefers-reduced-motion

### JavaScript Behavior
- [ ] Click handler toggles aria-expanded
- [ ] Click handler toggles hidden attribute
- [ ] ARIA attributes sync with visual state
- [ ] Focus management is correct
- [ ] No focus trapping (users can tab out)
