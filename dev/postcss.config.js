/**
 * PostCSS Configuration for Guttemberg Plus
 *
 * This config disables specific cssnano optimizations that break CSS custom properties
 * with fallback values in decomposed shorthand/longhand patterns.
 *
 * Issue: cssnano's merge-longhand plugin incorrectly merges properties like:
 *   border-width: var(--var, 1px);
 *   border-top-width: var(--var-top);
 * Into:
 *   border-width: var(--var-top) var(--var-right) ...;
 *
 * This removes the fallback value and creates invalid CSS when side vars are undefined.
 *
 * @see docs/DECOMPOSED-VALUES.md for decomposed value patterns
 */

module.exports = {
  plugins: [
    require('cssnano')({
      preset: [
        'default',
        {
          // Disable merge-longhand to preserve decomposed shorthand + longhand patterns
          // This prevents border-width/border-color/border-style from being merged incorrectly
          mergeLonghand: false,

          // Keep other optimizations enabled for good minification
          normalizeWhitespace: true,
          colormin: true,
          minifySelectors: true,
          minifyFontValues: true,
          discardComments: { removeAll: true },
        }
      ]
    })
  ]
};
