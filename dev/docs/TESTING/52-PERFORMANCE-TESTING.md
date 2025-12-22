# Performance Testing

## Performance Budgets

| Operation | Budget | Measurement |
|-----------|--------|-------------|
| Cascade resolution | <5ms | `console.time('cascade')` around `getAllEffectiveValues()` |
| Theme switch | <100ms | Click to UI update |
| Theme create | <500ms | Including DB write |
| Page load (3 blocks) | <50ms | Theme loading |
| Build time | <30s | `npm run build` |
| Hot reload | <2s | File save to browser update |

## Profiling Cascade Resolution

```javascript
console.time('cascade-resolution');
const effectiveValues = getAllEffectiveValues(
  attributes,
  currentTheme,
  cssDefaults
);
console.timeEnd('cascade-resolution');
// Target: <5ms
```

**Test with**:
- 50 attributes
- Multiple blocks on page
- Different browsers

## Profiling Theme Operations

```javascript
console.time('theme-create');
await createTheme('accordion', 'Test', values);
console.timeEnd('theme-create');
// Target: <500ms

console.time('theme-switch');
setAttributes({ currentTheme: 'Dark Mode' });
console.timeEnd('theme-switch');
// Target: <100ms
```

## Build Performance

```bash
time npm run build
# Target: <30s

npm start
# Modify file, check browser console for reload time
# Target: <2s
```

## Optimization Strategies

**If cascade >5ms**:
- Cache effective values
- Don't recalculate on every render
- Use useMemo

**If theme operations slow**:
- Check network latency
- Verify transient caching working
- Profile PHP REST API

**If build slow**:
- Check CSS parser efficiency
- Verify webpack caching enabled
- Review entry point size
