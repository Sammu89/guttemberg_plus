# Customization Cache System

**Session-based temporary storage for theme customizations**

---

## Design Rationale

### Why React State + Block Attributes Hybrid?

**Decision**: Session customizations in React state, active customizations in block attributes

**Why**:
- Native WordPress block behavior (uses standard `setAttributes`)
- No custom storage backend needed (no PHP transients, no localStorage)
- Works with WordPress autosave/revisions automatically
- Clean separation: session = ephemeral, attributes = persistent
- Undo/redo compatible

**Alternative Rejected**: WordPress transients (server-side session)
- More complex (requires REST API calls)
- Doesn't work with block preview/reusability
- Unreliable (caching plugins may clear transients)

### Why Show Both Original and Custom in Dropdown?

**Decision**: Display "Dark Mode" AND "Dark Mode (Custom)" as separate entries

**Why**:
- Clear visual indication user has customizations
- Can switch back to original to discard (customizations remain in session)
- Consistent with desktop software patterns (unsaved changes indicator)

**Alternative Rejected**: Single entry with asterisk - less clear, harder to revert

### Why Only Active Theme Persists on Save?

**Decision**: Session can have multiple custom themes, but only currentTheme's customizations save

**Why**:
- Simpler data model (one customizations object, not many)
- User intent clear (saving what they see)
- Smaller post_content (not bloated with unused customizations)

---

## Purpose

CustomizationCache allows users to:
1. Customize a theme (e.g., "Dark Mode")
2. Switch to another theme (e.g., "Light Mode")
3. Return to original theme with customizations intact
4. Choose whether to save or discard customizations

## Implementation Strategy

### React State + Block Attributes Hybrid

**Session Storage**: React state (lost on page refresh)

**Persistent Storage**: Block attributes (saved with post)

**Key Principle**: Only the currently active theme's customizations persist on save

```javascript
// React state (session-only)
const [sessionCustomizations, setSessionCustomizations] = useState({
  "Dark Mode": { titleColor: "#ff0000" },
  "Light Mode": { titleBackgroundColor: "#yellow" }
});

// Block attributes (persistent)
attributes: {
  currentTheme: "Dark Mode",
  customizations: { titleColor: "#ff0000" }
}
```

## User Workflow

### Scenario 1: Basic Customization

1. User applies "Dark Mode" theme → all values dark
2. User changes title color to red → customization stored
3. "Dark Mode (Custom)" appears in theme dropdown
4. User saves page → red customization persists

### Scenario 2: Theme Switching with Cache

1. User applies "Dark Mode", customizes title to red
2. "Dark Mode (Custom)" appears in dropdown
3. User switches to "Light Mode" → red customization hidden
4. "Dark Mode" and "Dark Mode (Custom)" both remain in dropdown
5. User switches back to "Dark Mode (Custom)" → red restored
6. User saves page with "Light Mode" active → red customization lost

### Scenario 3: Reverting Customizations

1. User applies "Dark Mode", customizes title to red
2. "Dark Mode (Custom)" appears in dropdown
3. User clicks "Reset Modifications" button
4. "Dark Mode (Custom)" removed from dropdown
5. Block reverts to original "Dark Mode"
6. Session cache cleared for "Dark Mode"

## Theme Dropdown Display

### With Customizations

Dropdown shows BOTH original and custom variants:

```
Theme Selector:
- Default
- Dark Mode          ← Original theme
- Dark Mode (Custom) ← Customized variant
- Light Mode
- Light Mode (Custom)
- Corporate
```

### User Actions

**Select Original**: Reverts to theme without customizations (customizations remain in session)

**Select Custom**: Restores customizations

**Reset Button**: Available only when "(Custom)" theme active, deletes session cache

## Implementation Details

### Data Structure

```javascript
// sessionCustomizations (React state)
{
  "Dark Mode": {
    titleColor: "#ff0000",
    titleFontSize: "20px"
  },
  "Light Mode": {
    titleBackgroundColor: "#yellow"
  }
}

// attributes.customizations (persistent)
{
  titleColor: "#ff0000",
  titleFontSize: "20px"
}
// Only for currentTheme
```

### Customization Handling

```javascript
// When user customizes attribute
const handleCustomization = (attr, value) => {
  // Update React state for session
  setSessionCustomizations(prev => ({
    ...prev,
    [currentTheme]: {
      ...prev[currentTheme],
      [attr]: value
    }
  }));

  // Update block attributes for persistence
  setAttributes({
    customizations: {
      ...attributes.customizations,
      [attr]: value
    }
  });
};
```

### Theme Switching

```javascript
// When user switches themes
const handleThemeSwitch = (newTheme) => {
  // Check if new theme has session customizations
  const cachedCustomizations = sessionCustomizations[newTheme] || {};

  setAttributes({
    currentTheme: newTheme,
    customizations: cachedCustomizations
  });
};
```

### Reset Modifications

```javascript
// When user clicks "Reset Modifications"
const handleResetModifications = () => {
  // Remove from session cache
  setSessionCustomizations(prev => {
    const updated = { ...prev };
    delete updated[currentTheme];
    return updated;
  });

  // Clear block customizations
  setAttributes({ customizations: {} });

  // Switch back to original theme
  setAttributes({ currentTheme: currentTheme.replace(' (Custom)', '') });
};
```

## Persistence Rules

### On Save/Publish

**What Persists**:
- `currentTheme` attribute
- `customizations` for currently active theme

**What's Lost**:
- Session customizations for inactive themes
- Custom variants not currently selected

### On Page Load

**What's Available**:
- Saved theme
- Saved customizations for that theme

**What's Missing**:
- Session customizations (must recreate)

## UI Requirements

### Theme Dropdown

**Format**: Show "(Custom)" suffix when customizations exist

**Sorting**:
1. Default (always first)
2. Original themes (alphabetical)
3. Custom variants (immediately after original)

```
- Default
- Dark Mode
- Dark Mode (Custom)  ← Right after original
- Light Mode
- Light Mode (Custom)
```

### Reset Button

**Visibility**: Only shown when "(Custom)" theme active

**Location**: Below theme selector

**Label**: "Reset Modifications"

**Confirmation**: "Revert to original theme? This will discard your customizations."

### Customization Indicators

**Badge**: Show "*" next to customized attributes in inspector panels

```
Title Color *
[Color Picker]
```

## Multiple Custom Themes

**Limit**: One custom variant per theme

**Behavior**: User can have multiple custom themes in same session:
- "Dark Mode (Custom)"
- "Light Mode (Custom)"
- "Corporate (Custom)"

All coexist in session, but only active one persists on save.

## Edge Cases

### Theme Deleted While Custom Exists

**Scenario**: User has "Corporate (Custom)", admin deletes "Corporate" theme

**Behavior**:
1. "Corporate (Custom)" removed from dropdown
2. Block falls back to "Default"
3. Customizations lost (parent theme gone)

### Theme Updated While Custom Exists

**Scenario**: User has "Dark Mode (Custom)", admin updates "Dark Mode" theme

**Behavior**:
1. "Dark Mode" values update
2. "Dark Mode (Custom)" retains user's customizations
3. User can switch between both to compare

### Page Autosave

**Behavior**:
- Autosave includes `currentTheme` and `customizations`
- Session cache NOT included (in-memory only)
- On restore: Only saved theme's customizations available

## Performance

**Session Storage**: O(1) lookup by theme name (object keys)

**No Database Writes**: Until user saves page

**Memory**: ~1KB per custom theme (negligible)
