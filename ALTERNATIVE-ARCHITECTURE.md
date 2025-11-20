# Alternative Theme Architecture Proposal
**Comparison with Current Implementation**

## Current Architecture (What You Have)

```
State Management:
- Block Attributes = Visual state (source of truth)
- Session Cache (React) = Customizations per theme
- Database = Theme definitions (deltas)

Theme Flow:
1. User customizes → Updates attributes
2. Auto-detect → Compare attributes to (defaults + theme)
3. If different → Add to session cache
4. Switch theme → Apply defaults + theme, clear cache
5. Save theme → Calculate deltas from cache
```

**Complexity Points:**
- Synchronization between attributes and cache
- Race conditions (async setAttributes)
- Stale computed values (isCustomized)
- 42 lines of duplicated exclusion logic

## Proposed Alternative: Source-Tracked Attributes

### Core Concept

**Single Source of Truth with Explicit Metadata**

```javascript
const attributes = {
  // Theme selection
  currentTheme: 'Dark Mode',

  // Visual properties (merged view)
  titleColor: '#ffffff',
  bgColor: '#1a1a1a',
  padding: 20,
  borderRadius: 8,

  // NEW: Explicit customization tracking
  _customizations: {
    // ONLY contains user-customized values
    // Key = attribute name, Value = customized value
    bgColor: '#ff0000',  // User changed from theme's #1a1a1a
    padding: 25          // User changed from theme's 20
    // titleColor not here = using theme value
    // borderRadius not here = using theme value
  },

  // Structural/behavioral (excluded from theming)
  accordionId: 'abc123',
  initiallyOpen: false,
}
```

### How It Works

#### 1. Getting Effective Value

```javascript
function getEffectiveValue(attrName, attributes, themes, defaults) {
  const { currentTheme, _customizations } = attributes;

  // 1. Check if customized
  if (_customizations && attrName in _customizations) {
    return _customizations[attrName];
  }

  // 2. Check theme
  const theme = themes[currentTheme];
  if (theme?.values?.[attrName] !== undefined) {
    return theme.values[attrName];
  }

  // 3. Fall back to default
  return defaults[attrName];
}

// Memoized for performance
const effectiveValues = useMemo(() => {
  const result = { ...defaults };

  // Apply theme
  if (currentTheme && themes[currentTheme]) {
    Object.assign(result, themes[currentTheme].values);
  }

  // Apply customizations
  Object.assign(result, _customizations || {});

  return result;
}, [defaults, currentTheme, themes, _customizations]);
```

#### 2. Detecting Customization (Trivial!)

```javascript
// Current approach: Compare EVERY attribute
const isCustomized = useMemo(() => {
  return Object.keys(attributes).some(key => {
    if (excludeFromCustomizationCheck.includes(key)) return false;
    const attrValue = attributes[key];
    const expectedValue = expectedValues[key];
    // ... complex comparison logic
    return attrValue !== expectedValue;
  });
}, [attributes, expectedValues, excludeFromCustomizationCheck]);

// New approach: Just check if customizations exist
const isCustomized = useMemo(() => {
  const customs = _customizations || {};
  return Object.keys(customs).length > 0;
}, [_customizations]);
```

#### 3. Applying Customization

```javascript
function handleAttributeChange(attrName, newValue) {
  const expectedValue = getEffectiveValue(attrName, {...attributes, _customizations: {}}, themes, defaults);

  if (newValue === expectedValue) {
    // User set back to theme/default value - remove customization
    setAttributes({
      [attrName]: newValue,
      _customizations: {
        ...(_customizations || {}),
        [attrName]: undefined // Remove this customization
      }
    });
  } else {
    // User customized - track it
    setAttributes({
      [attrName]: newValue,
      _customizations: {
        ...(_customizations || {}),
        [attrName]: newValue
      }
    });
  }
}
```

#### 4. Switching Themes

```javascript
function handleThemeChange(newThemeName) {
  // Get new theme values
  const newTheme = themes[newThemeName];
  const newValues = { ...defaults, ...(newTheme?.values || {}) };

  // Apply new theme + keep customizations
  const effectiveAttributes = {
    ...newValues,
    ...(_customizations || {})  // Customizations persist across themes!
  };

  setAttributes({
    ...effectiveAttributes,
    currentTheme: newThemeName
    // _customizations unchanged - they carry over!
  });
}
```

#### 5. Saving New Theme

```javascript
async function handleSaveNewTheme(themeName) {
  // Snapshot = defaults + current theme + customizations
  const snapshot = {
    ...defaults,
    ...(themes[currentTheme]?.values || {}),
    ...(_customizations || {})
  };

  // Calculate deltas from defaults
  const deltas = calculateDeltas(snapshot, defaults, EXCLUSIONS);

  // Save to database
  await createTheme('accordion', themeName, deltas);

  // Switch to new theme (now clean - no customizations)
  setAttributes({
    currentTheme: themeName,
    _customizations: {}  // Clear - we just saved them to theme
  });
}
```

#### 6. Resetting Customizations

```javascript
function handleResetCustomizations() {
  // Just clear the customizations object!
  setAttributes({
    _customizations: {}
  });
  // That's it. No complex cache clearing, no race conditions.
}
```

### Comparison Table

| Aspect | Current Architecture | Proposed Architecture |
|--------|---------------------|----------------------|
| **State Sources** | 2 (attributes + session cache) | 1 (attributes only) |
| **Sync Complexity** | High (must keep cache in sync) | None (single source) |
| **Race Conditions** | Yes (setAttributes vs cache) | No (atomic updates) |
| **isCustomized Logic** | 20 lines, complex comparison | 2 lines, trivial check |
| **Performance** | Needs memoization | Needs memoization (same) |
| **Session Persistence** | React state (lost on unmount) | Attribute (lost on unmount) ✅ Same |
| **Code Clarity** | Implicit (inferred from comparison) | Explicit (_customizations shows intent) |
| **Debugging** | Hard (why is this customized?) | Easy (look at _customizations) |
| **Memory Usage** | Higher (duplicate data in cache) | Lower (single storage) |

### Benefits of Proposed Architecture

1. **No Dual State** ✅
   - Eliminates entire class of sync bugs
   - No session cache to manage

2. **Explicit Intent** ✅
   - `_customizations` explicitly shows what user changed
   - No inference needed

3. **Simpler Logic** ✅
   - isCustomized: 2 lines instead of 20
   - No complex comparison loops

4. **Better Performance** ✅
   - Less memory (no duplicate cache)
   - Faster isCustomized check

5. **Easier Debugging** ✅
   - Look at `_customizations` to see exactly what's customized
   - Clear cause-effect relationship

6. **No Race Conditions** ✅
   - Single setAttributes call
   - No coordination needed

7. **New Features Easier** ✅
   - "What did I customize?" → just show _customizations
   - "Reset specific attribute" → delete from _customizations
   - "Compare themes" → diff their values

### Migration Path

#### Phase 1: Add _customizations (Non-Breaking)
```javascript
// Add new attribute, populate from session cache
_customizations: {
  type: 'object',
  default: {}
}

// On mount, migrate from session cache
useEffect(() => {
  if (!_customizations && sessionCache[currentTheme]) {
    setAttributes({
      _customizations: sessionCache[currentTheme]
    });
  }
}, []);
```

#### Phase 2: Use Both (Transition)
- Keep session cache as fallback
- Start using _customizations for new logic
- Verify behavior matches

#### Phase 3: Remove Session Cache
- Delete useState for sessionCache
- Remove all cache sync logic
- Remove useEffect for auto-update

### Potential Concerns & Solutions

**Concern 1: "Customizations stored in attributes = persisted to database"**

✅ **Solution**: This is actually GOOD! Users expect customizations to persist across sessions for the specific block instance. If you want session-only:

```javascript
// Option A: Mark as __unstable (WordPress convention)
__unstableCustomizations: { ... }

// Option B: Clear on save
// In save.js, don't include _customizations in saved output

// Option C: Use sessionStorage as backup
useEffect(() => {
  if (_customizations) {
    sessionStorage.setItem(
      `customizations_${clientId}`,
      JSON.stringify(_customizations)
    );
  }
}, [_customizations]);
```

**Concern 2: "Migration effort"**

✅ **Solution**: Can be done incrementally:
1. Add _customizations attribute (doesn't break anything)
2. Update one handler at a time
3. Test thoroughly
4. Remove old cache logic

**Concern 3: "Performance of Object.assign"**

✅ **Solution**: Negligible - you're already doing this for effectiveValues. Modern JS engines optimize this well.

## Code Example: Complete Implementation

```javascript
// blocks/accordion/src/edit.js

export default function Edit({ attributes, setAttributes }) {
  const { currentTheme, _customizations = {} } = attributes;

  // Get themes from Redux
  const themes = useSelect(
    select => select(STORE_NAME).getThemes('accordion'),
    []
  );

  // Compute effective values (memoized)
  const effectiveValues = useMemo(() => {
    const result = { ...allDefaults };

    // Apply theme
    if (currentTheme && themes[currentTheme]) {
      Object.assign(result, themes[currentTheme].values);
    }

    // Apply customizations
    Object.assign(result, _customizations);

    return result;
  }, [allDefaults, currentTheme, themes, _customizations]);

  // Is customized? (trivial check)
  const isCustomized = useMemo(() =>
    Object.keys(_customizations).length > 0,
    [_customizations]
  );

  // Handle attribute change
  const handleChange = useCallback((attrName, newValue) => {
    // What would value be without customization?
    const baseValue = currentTheme && themes[currentTheme]?.values?.[attrName]
      ?? allDefaults[attrName];

    if (newValue === baseValue) {
      // Remove customization
      const { [attrName]: removed, ...rest } = _customizations;
      setAttributes({
        [attrName]: newValue,
        _customizations: rest
      });
    } else {
      // Add customization
      setAttributes({
        [attrName]: newValue,
        _customizations: {
          ..._customizations,
          [attrName]: newValue
        }
      });
    }
  }, [currentTheme, themes, allDefaults, _customizations]);

  // Switch theme
  const handleThemeChange = useCallback((newThemeName) => {
    const newTheme = themes[newThemeName];
    const effectiveAttrs = {
      ...allDefaults,
      ...(newTheme?.values || {}),
      ..._customizations  // Customizations persist!
    };

    setAttributes({
      ...effectiveAttrs,
      currentTheme: newThemeName
    });
  }, [themes, allDefaults, _customizations]);

  // Save as new theme
  const handleSaveNewTheme = useCallback(async (themeName) => {
    // Current state = defaults + theme + customizations
    const snapshot = { ...effectiveValues };

    // Calculate deltas
    const deltas = calculateDeltas(snapshot, allDefaults, EXCLUSIONS);

    // Save
    await createTheme('accordion', themeName, deltas);

    // Switch to new theme (no customizations)
    setAttributes({
      currentTheme: themeName,
      _customizations: {}
    });
  }, [effectiveValues, allDefaults]);

  // Reset customizations
  const handleReset = useCallback(() => {
    setAttributes({ _customizations: {} });
  }, []);

  // ... rest of component
}
```

## Recommendation

**If starting fresh**: I would **absolutely use the proposed architecture**.

**For your current project**:
- ✅ Your fixes are solid and work well
- 🤔 Migration to proposed architecture would take ~2-3 days
- 💭 Main benefit: **Simpler mental model** going forward
- ⚠️ Risk: Migration bugs during transition

**My suggestion**:
1. ✅ Keep your current fixes (they're good!)
2. 📋 Document proposed architecture in your codebase
3. 🔄 Consider migration in next major refactor
4. 📊 Track if session cache bugs continue to appear
5. ➡️ If yes, migrate to proposed architecture

The proposed architecture eliminates an entire category of bugs (cache synchronization) by removing the cache entirely. Your current architecture works but requires careful coordination. Choose based on your team's capacity for refactoring vs maintaining the current system.
