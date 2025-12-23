# Premium Strategy & Anti-Tamper Plan

This document outlines how to gate premium attributes (flagged via `pago` in schemas) while making bypassing difficult. The flow assumes:
- Single plugin package, license-gated premium.
- Premium attrs editable/previewable in editor, but sanitized on render without a valid license.
- License discovery via a stable GitHub redirect to the current license server.

---

## Low-Support Headlines (English)

Brutal summary: there are 3 critical must-do items and 2 optional but highly recommended. Everything else is nice-to-have.

### The 3 Criticals (mandatory; cover ~80% of support pain)

1) **Eliminate false positives from the integrity check**
- Typical issue: hosting rewrites files, deploy changes line endings, a security plugin “normalizes” code → “Pro stopped working” with no visible error.
- Do this: integrity-check only two files — the capability resolver and the render sanitizer. Never block the whole plugin; only degrade premium silently.
- Result: far fewer “no idea what happened, it just stopped” tickets.

2) **Never fail because of obscure cache**
- Typical issue: object cache holds a bad transient, site domain changes, license stays in the wrong state.
- Mandatory fix: add a “Force Recheck” button in the admin. On click: delete transients, delete option state, revalidate immediately.
- Result: one button saves hours of support.

3) **Stop using regex directly on HTML**
- Typical issue: broken layout, odd CSS, user blames the plugin and you can’t reproduce.
- Safe approach: sanitize attrs before generating CSS; never post-process the final HTML. Mental flow: attrs → sanitize → CSS vars → render.
- Result: fewer invisible bugs and “works on my site” dead-ends.

### The 2 Highly Recommended (reduce panic and stress)

4) **One clear admin message**
- Show only: “Premium features are disabled because the license was not validated. Click ‘Revalidate license’ if you just activated.”
- Nothing else. No technical or cryptic wording.
- Result: fewer panic tickets.

5) **Minimal, predictable grace**
- Rule: valid cache → up to 24h; server down → max 24h; invalid signature → zero grace.
- Result: legitimate users don’t suffer; crackers gain nothing.

### What I’d Cut Without Regret (to lower support)

- Aggressive JS obfuscation
- Random probabilistic checks
- Over-elaborate honeypots
- Silent degradation with zero admin feedback

These increase complexity, not supportability, and don’t stop experienced crackers.

### TL;DR — Support-Friendly Checklist

If you can only implement five things, do these:
1. Focused integrity check (capability resolver + render sanitizer only).
2. “Force Recheck” button.
3. Sanitize before render; never regex the final HTML.
4. Single clear admin message.
5. Predictable 24h grace window.

---

## Current Block Capabilities

Complete reference of all customizable attributes across the three blocks.

### Accordion Block (34 attributes)

#### Block Options (Structural - not themeable)
| Attribute | Control | Description |
|-----------|---------|-------------|
| `accordionWidth` | TextControl | Container width (e.g., 100%, 500px) |
| `accordionHorizontalAlign` | Select | left / center / right |
| `headingLevel` | Select | none, h1-h6 (semantic HTML) |
| `initiallyOpen` | Toggle | Open on page load |

#### Block Borders (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `borderColor` | ColorPicker | #dddddd |
| `borderWidth` | Range 0-10px | 1px |
| `borderStyle` | Select | solid |
| `borderRadius` | 4-corner | 4px all |
| `shadow` | TextControl | none |
| `shadowHover` | TextControl | none |

#### Header Colors (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `titleColor` | ColorPicker | #333333 |
| `titleBackgroundColor` | ColorPicker | #f5f5f5 |
| `hoverTitleColor` | ColorPicker | #000000 |
| `hoverTitleBackgroundColor` | ColorPicker | #e8e8e8 |

#### Header Typography (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `titleFontSize` | Range 0.6-3rem | 1.125rem |
| `titleFontWeight` | Select 100-900 | 600 |
| `titleFontStyle` | Select | normal |
| `titleTextTransform` | Select | none |
| `titleTextDecoration` | Select | none |
| `titleAlignment` | Select | left |

#### Panel Appearance (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `contentBackgroundColor` | ColorPicker | #ffffff |

#### Divider Line (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `dividerColor` | ColorPicker | #dddddd |
| `dividerWidth` | Range 0-10px | 0 |
| `dividerStyle` | Select | solid |

#### Icon (Mixed)
| Attribute | Control | Themeable | Default |
|-----------|---------|-----------|---------|
| `showIcon` | Toggle | No | true |
| `iconPosition` | Select | No | right |
| `iconColor` | ColorPicker | Yes | #666666 |
| `iconSize` | Range 0.6-3rem | Yes | 1.25rem |
| `iconTypeClosed` | IconPicker | No | ▾ |
| `iconTypeOpen` | IconPicker | No | none |
| `iconRotation` | Range -360-360° | Yes | 180° |

**Currently marked `pago`:** `iconTypeOpen`, `iconRotation`

---

### Tabs Block (68 attributes)

#### Block Options (Structural)
| Attribute | Control | Description |
|-----------|---------|-------------|
| `tabsWidth` | TextControl | Container width |
| `tabsHorizontalAlign` | Select | left / center / right |
| `headingLevel` | Select | none, h1-h6 |
| `orientation` | Select | horizontal / vertical-left / vertical-right |
| `activationMode` | Select | click / hover |
| `stretchButtonsToRow` | Toggle | Fill row width (horizontal only) |

#### Block Borders (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `borderColor` | ColorPicker | #dddddd |
| `borderWidth` | Range 0-10px | 0 |
| `borderStyle` | Select | solid |
| `borderRadius` | 4-corner | 0 all |
| `shadow` | TextControl | none |
| `shadowHover` | TextControl | none |

#### Header Colors (Themeable - 6 states)
| Attribute | Control | Default |
|-----------|---------|---------|
| `tabButtonColor` | ColorPicker | #666666 |
| `tabButtonBackgroundColor` | ColorPicker | #f5f5f5 |
| `tabButtonHoverColor` | ColorPicker | #333333 |
| `tabButtonHoverBackgroundColor` | ColorPicker | #e8e8e8 |
| `tabButtonActiveColor` | ColorPicker | #333333 |
| `tabButtonActiveBackgroundColor` | ColorPicker | #ffffff |

#### Header Typography (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `tabButtonFontSize` | Range 0.6-2.3rem | 1rem |
| `tabButtonFontWeight` | Select | 500 |
| `tabButtonFontStyle` | Select | normal |
| `tabButtonTextTransform` | Select | none |
| `tabButtonTextDecoration` | Select | none |
| `tabButtonTextAlign` | Select | center |
| `tabButtonPadding` | Range 0-1.3rem | 0.75rem |
| `tabButtonActiveFontWeight` | Select | bold |

#### Header Borders (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `tabButtonBorderColor` | ColorPicker | #dddddd |
| `tabButtonActiveBorderColor` | ColorPicker | #dddddd |
| `tabButtonBorderWidth` | Range 0-10px | 1px |
| `tabButtonBorderStyle` | Select | solid |
| `tabButtonBorderRadius` | 4-corner | 4/4/0/0 |
| `tabButtonShadow` | TextControl | none |
| `tabButtonShadowHover` | TextControl | none |
| `enableFocusBorder` | Toggle | true |
| `tabButtonActiveContentBorderWidth` | Range | 1px |
| `tabButtonActiveContentBorderStyle` | Select | solid |
| `tabButtonActiveContentBorderColor` | ColorPicker | #ffffff |

#### Header Row Options (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `tabListBackgroundColor` | ColorPicker | transparent |
| `tabsRowBorderColor` | ColorPicker | #dddddd |
| `tabsRowBorderWidth` | Range 0-10px | 0 |
| `tabsRowBorderStyle` | Select | solid |
| `tabListAlignment` | Select | flex-start |
| `tabsRowSpacing` | Range 0-1.9rem | 0.5rem |
| `tabsButtonGap` | Range 0-1.9rem | 0.5rem |
| `enableTabsListContentBorder` | Toggle | false |
| `tabsListContentBorderColor` | ColorPicker | transparent |
| `tabsListContentBorderWidth` | Range | 1px |
| `tabsListContentBorderStyle` | Select | solid |

#### Panel Appearance (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `panelBackgroundColor` | ColorPicker | #ffffff |
| `panelBorderColor` | ColorPicker | #dddddd |
| `panelBorderWidth` | Range 0-10px | 1px |
| `panelBorderStyle` | Select | solid |
| `panelBorderRadius` | 4-corner | 4px all |

#### Icon (Mixed)
| Attribute | Control | Themeable | Default |
|-----------|---------|-----------|---------|
| `showIcon` | Toggle | No | true |
| `iconPosition` | Select | No | right |
| `iconColor` | ColorPicker | Yes | #666666 |
| `iconSize` | Range 0.5-3rem | Yes | 1rem |
| `iconTypeClosed` | IconPicker | No | ▾ |
| `iconTypeOpen` | IconPicker | No | none |
| `iconRotation` | Range -360-360° | Yes | 0° |
| `iconRotationActive` | Range -360-360° | Yes | 180° |

---

### Table of Contents Block (62 attributes)

#### Block Options (Structural)
| Attribute | Control | Description |
|-----------|---------|-------------|
| `tocWidth` | TextControl | Container width |
| `tocHorizontalAlign` | Select | left / center / right |
| `showTitle` | Toggle | Display title header |
| `titleText` | TextControl | "Table of Contents" |
| `filterMode` | Select | include-all / include-only / exclude-only |
| `includeLevels` | Multi-select | H2-H6 |
| `excludeLevels` | Multi-select | None |
| `includeClasses` | TextControl | CSS classes to include |
| `excludeClasses` | TextControl | CSS classes to exclude |
| `depthLimit` | Number | Max nesting depth |
| `includeAccordions` | Toggle | Include accordion headings |
| `includeTabs` | Toggle | Include tab headings |
| `numberingStyle` | Select | none / decimal / roman / alpha |
| `isCollapsible` | Toggle | Allow collapse/expand |
| `initiallyCollapsed` | Toggle | Start collapsed |
| `positionType` | Select | default / sticky / fixed |
| `smoothScroll` | Toggle | Smooth scroll to headings |
| `scrollOffset` | Number | Scroll offset in pixels |
| `autoHighlight` | Toggle | Highlight current section |
| `clickBehavior` | Select | navigate / scroll |

#### Block Borders (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `wrapperBackgroundColor` | ColorPicker | #ffffff |
| `blockBorderColor` | ColorPicker | #dddddd |
| `blockBorderWidth` | Range 0-10px | 1px |
| `blockBorderStyle` | Select (9 options) | solid |
| `blockBorderRadius` | 4-corner | 4px all |
| `blockShadow` | TextControl | none |
| `blockShadowHover` | TextControl | none |

#### Title Colors (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `titleColor` | ColorPicker | #333333 |
| `titleBackgroundColor` | ColorPicker | transparent |

#### Title Typography (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `titleFontSize` | Range 0.7-3rem | 1.25rem |
| `titleFontWeight` | Select | 700 |
| `titleTextTransform` | Select | none |
| `titleAlignment` | Select | left |
| `titlePadding` | BoxControl | 0/0/12px/0 |

#### Link Colors (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `linkColor` | ColorPicker | #0073aa |
| `linkHoverColor` | ColorPicker | #005177 |
| `linkActiveColor` | ColorPicker | #005177 |
| `linkVisitedColor` | ColorPicker | #0073aa |
| `numberingColor` | ColorPicker | #0073aa |

#### Level Styling (Themeable - per heading level)
| Level | Attributes |
|-------|------------|
| **H1** | `h1Color`, `h1FontSize` (1.5rem), `h1FontWeight` (700), `h1FontStyle`, `h1TextTransform`, `h1TextDecoration` |
| **H2** | `h2Color`, `h2FontSize` (1.25rem), `h2FontWeight` (600), `h2FontStyle`, `h2TextTransform`, `h2TextDecoration` |
| **H3** | `h3Color`, `h3FontSize` (1.125rem), `h3FontWeight` (500), `h3FontStyle`, `h3TextTransform`, `h3TextDecoration` |
| **H4** | `h4Color`, `h4FontSize` (1rem), `h4FontWeight` (normal), `h4FontStyle`, `h4TextTransform`, `h4TextDecoration` |
| **H5** | `h5Color`, `h5FontSize` (0.9375rem), `h5FontWeight` (normal), `h5FontStyle`, `h5TextTransform`, `h5TextDecoration` |
| **H6** | `h6Color`, `h6FontSize` (0.875rem), `h6FontWeight` (normal), `h6FontStyle`, `h6TextTransform`, `h6TextDecoration` |

**Note:** Each heading level now has independent styling controls (36 attributes total: 6 levels × 6 properties). Use the dropdown selector in the "Heading Styles" panel to edit each level.

#### Spacing & Layout (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `wrapperPadding` | Range 0-3.2rem | 1.25rem |
| `listPaddingLeft` | Range 0-3.2rem | 1.5rem |
| `itemSpacing` | Range 0-1.9rem | 0.5rem |
| `levelIndent` | Range 0-3.2rem | 1.25rem |
| `positionTop` | Range 0-18.8rem | 6.25rem |
| `zIndex` | Range 1-9999 | 100 |

#### Collapse Icon (Themeable)
| Attribute | Control | Default |
|-----------|---------|---------|
| `collapseIconColor` | ColorPicker | #666666 |
| `collapseIconSize` | Range 0.7-2.3rem | 1.25rem |

---

### Capabilities Summary

| Category | Accordion | Tabs | TOC |
|----------|-----------|------|-----|
| **Total Attributes** | 34 | 68 | 62 |
| **Themeable** | 21 | 52 | 47 |
| **Structural** | 13 | 16 | 15 |
| **Color Options** | 8 | 14 | 15 |
| **Typography** | 6 | 9 | 24 |
| **Border/Shadow** | 6 | 18 | 7 |
| **Spacing** | 0 | 4 | 6 |
| **Icon** | 7 | 8 | 2 |

---

## Attribute Marking
- Schema-level flag: any attribute with a `pago` key is premium (value is irrelevant).
- Server derives premium attrs from schemas (or generated PHP defaults), not from client-exposed lists.
- Defaults source: generated PHP defaults (e.g., `php/css-defaults/*.php`) to know replacement values.

## Editor Behavior (Non-Authoritative)
- GenericPanel/SchemaPanels show a lock badge + tooltip on premium controls.
- All premium controls remain editable for preview; values save to post content/meta.
- No global `window` exposure of premium lists; detection is local in bundled code.
- Avoid verbose errors; show a generic “Upgrade to unlock premium rendering” notice.

## Server-Side Enforcement (Authoritative)
- Render callbacks (Accordion/Tabs/TOC) call a sanitizer:
  - Load premium attrs + defaults.
  - If license is not valid, replace premium attrs with defaults before rendering.
  - Keep user-chosen premium values stored (so they auto-apply after purchase), but never render them unlicensed.
- Fail closed: network errors, missing signature, expired response → treat as unlicensed.
- Optional: hash-check critical plugin files; if tampered, disable premium rendering.

## License Validation Flow
- Discovery: fetch a pinned GitHub URL that redirects to the current license server; no hardcoded fallback.
- Request: send site URL, plugin version, license key, timestamp/nonce.
- Response: signed (HMAC/EdDSA) payload including site URL, plugin version, expiry, and nonce.
- Verification in PHP:
  - Validate signature, timestamp freshness, domain match, version match.
  - Reject on any mismatch; do not trust cache on signature failure.
- Cache:
  - Valid → transient (e.g., 24h).
  - Invalid → short TTL (e.g., 5–15 min).
  - If server unreachable: use cached valid only if fresh; otherwise unlicensed. No silent offline grace unless desired.

## Telemetry (Opt-In)
- Collect: page URL, block type counts, optional premium-attribute popularity (no PII).
- Send with license validation or on publish/cron; rate-limit.
- Respect consent flag in options; authenticated/signed endpoint to avoid spoofing/side-channel.

## Anti-Bypass Considerations
- No client authority: PHP render is the gatekeeper.
- Minimal clues: generic UI messaging, no REST endpoints listing premium attrs or license state.
- Replay protection: include nonce/timestamp in requests; server signs; PHP checks freshness.
- Domain/version lock: response must bind to `home_url()` and plugin version.
- Rotation: support key/secret rotation on the server; plugin accepts multiple valid key IDs.

## Implementation Checklist (High Level)
1) Schema parsing (PHP): read schemas or generated defaults to map premium attrs + defaults.
2) Render sanitizer (PHP): per block render callback, replace premium attrs with defaults if unlicensed.
3) License client (PHP): GitHub redirect → `/license/validate`; verify signature; cache result.
4) Admin UI: license key entry, status, force recheck, telemetry opt-in toggle.
5) Editor UI: lock badges/tooltips on premium controls; keep editable; avoid global exposure.
6) Telemetry sender: opt-in, batched, signed; includes URL + block counts (+ premium attr stats if enabled).
7) Tests: no-license renders defaults; valid license renders chosen values; signature failure → defaults; offline with stale cache → defaults.

## Guttemberg+ Support-First Adjustments
- **Settings location:** License entry lives in the plugin settings under the “Options” tab labeled “Guttemberg+ Licence.” Place the “Force Recheck” button there; on click, purge transients and option state, then revalidate immediately.
- **Single admin message:** Only show “Premium features are disabled because the license was not validated. Click ‘Revalidate license’ if you just activated.”
- **Central render hook:** One sanitizer hooked to `render_block`/`pre_render_block` so all blocks inherit premium gating automatically. Never kill the plugin; only disable premium rendering when needed.
- **Minimal integrity check:** Hash/sign only the capability resolver and render sanitizer. Tampering disables premium but the plugin keeps running.
- **Grace and cache:** Valid cache up to 24h; if the server is down, reuse valid cache for ≤24h; invalid signatures get zero grace. Degrade to defaults (binary on/off), not plan-based.
- **Render safety:** attrs → sanitize → CSS vars → render. No regex on final HTML output.
- **Exclusions:** No soft watermark. No plan-based degradation; premium is simply on or off based on license state.
- **Build artifact:** Build should auto-emit an obfuscation map (e.g., `build/obfuscation-map.json`) listing obfuscation points to speed debugging/correction; keep it for internal use.

## License Server / REST API (Build or Buy)

If you want a turnkey option: consider Freemius, Paddle, LemonSqueezy, Gumroad + Keygen, or WooCommerce + Software Add-on. They provide license issuance, activation counts, and basic webhook flows. If none fit, build a small service with the endpoints below.

Minimum endpoints to implement:
- `POST /license/issue` (admin-only): create license key, expiry, plan, max activations, status.
- `POST /license/validate`: input `{licenseKey, siteUrl, pluginVersion, nonce, timestamp}`; output `{status, expiry, plan, signature}` signed with HMAC/EdDSA. Bind signature to siteUrl, pluginVersion, nonce, timestamp.
- `POST /license/activate`: track site/domain activation (optional) and return signed status; enforce max activations if you want.
- `POST /license/deactivate`: free an activation slot (optional).

Server requirements:
- Sign responses (key rotation supported via keyId).
- Store licenses with status (active/suspended/expired), expiry date, plan, activations.
- Reject stale requests: check timestamp/nonce, sign the response.
- Rate-limit validate endpoints.
- Log validations/activations for audit; avoid leaking data in responses.
- Allow redirect discovery: expose current base URL at the GitHub URL the plugin fetches.

Payload/signature example (HMAC-SHA256):
- Signed payload fields: `licenseKey`, `siteUrl`, `pluginVersion`, `status`, `expiresAt`, `nonce`, `ts`, `keyId`.
- Signature: `base64(hmac_sha256(secret_for_keyId, JSON.stringify(payload)))`.
- Plugin verifies `ts` freshness and `siteUrl/pluginVersion` match; treats any failure as unlicensed.

## Free, Lightweight License Server (No Paid Services)

Goal: a simple, zero-cost setup you can host yourself. Two easy options:

- **Cloudflare Workers + KV (free tier):** Serverless, fast, no server to manage. Store licenses in KV. Use HMAC secret as an environment variable.
- **Tiny PHP/Node on your own site:** Single endpoint file on cheap hosting; store licenses in a JSON/SQLite file; protect with an admin secret for issuing keys.

Recommended flow (same as above, just self-hosted):
- `POST /license/issue` (protected by admin secret): creates a license with expiry, plan, and max activations. Can be a simple PHP/Node script writing to JSON/SQLite. Only you call this.
- `POST /license/validate`: input `{licenseKey, siteUrl, pluginVersion, nonce, timestamp}` → output `{status, expiry, plan, signature, keyId}`. Sign with HMAC secret stored server-side (never in code).
- `POST /license/activate` / `POST /license/deactivate` (optional): track activations if you want per-site limits.

How it works (non-programmer summary):
1) **You host one small script/service** (Worker or PHP/Node) reachable at `https://your-license-host.com`.
2) **You generate a secret** (long random string) and keep it only on the server; plugin never contains it.
3) **When you sell a license**, you call your `issue` endpoint (with the admin secret) to create a key. The script stores it in KV/JSON/SQLite with expiry/status.
4) **When a user activates**, the plugin calls `validate` with the license key and site URL. The server checks status/expiry and returns a signed “valid” or “invalid” response.
5) **The plugin checks the signature** using the public key or shared secret (HMAC) baked into the plugin. If signature or freshness fails, it treats as unlicensed and strips premium attrs.
6) **If the server is down**, the plugin uses only a recent cached “valid” response; otherwise, it renders as unlicensed (fail closed).

What you need to prepare:
- A host: Cloudflare Workers (free) or your own cheap host.
- A storage: Cloudflare KV (free) or a JSON/SQLite file.
- One admin secret (for issuing) and one signing secret (for validate responses). Rotate by adding `keyId` when you change secrets.
- A GitHub URL that redirects to your current license server base URL so you can move hosts without updating the plugin.

If you want a starting point:
- **Worker starter (HMAC):** a 200-line Worker that exposes `issue` (admin-secret protected) and `validate` (signed responses) using KV. No database.
- **PHP starter (HMAC):** a single `license.php` with routing for `issue` and `validate`, storing to `licenses.json` or `licenses.sqlite`; guarded by an `ADMIN_SECRET` env var; signs responses with `SIGNING_SECRET`.

## Expert Review: Optimizations & Adds
- **Central render enforcement:** Use one sanitizer hooked to `render_block`/`pre_render_block` to strip premium attrs for all block schemas, so future blocks auto-inherit gating.
- **HTTP practices:** Document short timeouts/retries on license checks, custom User-Agent, fail-closed rules; use `wp_remote_post` with signature verify; cache transients per-site in multisite.
- **Multisite policy:** Define whether a network key covers subsites; store license/telemetry opt-in at network vs site level; avoid leaking site URLs via telemetry.
- **Storage hygiene:** Hash/encrypt stored license keys; set options `autoload=no`; optionally add a WP-CLI subcommand to show/revalidate status.
- **Secret management:** Keep signing/admin secrets in env/Worker secrets; never commit; support `keyId` rotation with overlap.
- **Grace bounds:** If using grace, cap cached “valid” (e.g., <=24h); no grace on signature failures or site/version mismatch.
- **Telemetry privacy:** Aggregate/coarse stats; strip query params/fragments from URLs; batch+gzip; backoff on failure.
- **Obfuscation vs compatibility:** Keep minified editor UI but don’t break WP debug; avoid exposing premium lists; keep REST/schema/editor previews working; minimal logging in prod.
- **Testing:** Add PHPCS/PHPStan; unit tests for sanitizer (licensed vs unlicensed), signature verify, cache rules, and schema parsing.
- **Ops runbook:** Document rotating secrets, moving license host (update GitHub redirect), and behavior if KV/JSON is corrupted (fallback to unlicensed).

---

## Advanced Anti-Nulling Architecture

This section details how crackers typically bypass WordPress plugin protections and provides a robust, multi-layered defense strategy.

### How Crackers Null WordPress Plugins

#### Step 1: Finding Entry Points

Crackers search for obvious patterns:
```
├── Files named: license.php, licensing.php, premium.php, pro.php
├── Functions: is_licensed(), check_license(), validate_key(), is_pro()
├── Strings: "license", "premium", "pro", "activation", "valid"
├── Network calls: wp_remote_post() to external APIs
└── Conditionals: if (!$licensed) { return; }
```

#### Step 2: Common Bypass Techniques

| Technique | How It Works |
|-----------|--------------|
| **NOP Slide** | Replace `if (!is_licensed()) return;` with `if (true) {}` |
| **Function Override** | Add `function is_licensed() { return true; }` at top of file |
| **Constant Injection** | Define `GP_LICENSED = true` before plugin loads |
| **API Spoofing** | Modify hosts file to point license server to localhost |
| **Cache Poisoning** | Manually set transient to "valid" |
| **Base64 Decode** | Simple encoding like `base64_encode()` + `eval()` is trivially reversible |

#### Step 3: Distribution

Nulled plugins often include delayed backdoors—working normally for weeks before activating malware, creating admin accounts, or injecting SEO spam.

### Defense Principle 1: Naming Obfuscation

**BAD - What crackers grep for:**
```
php/license/
├── class-license-manager.php
├── class-license-validator.php
└── license-admin.php

function gp_is_premium() { ... }
function gp_check_license() { ... }
```

**GOOD - Disguised naming:**
```
php/core/
├── class-gp-asset-resolver.php     # Actually license manager
├── class-gp-remote-sync.php        # Actually license validator
└── settings-advanced.php            # Actually license admin

function gp_resolve_capability() { ... }  # Actually license check
function gp_sync_remote_state() { ... }   # Actually validation
```

### Defense Principle 2: Distributed Checks (No Single Point of Failure)

Instead of one `if (!is_licensed())` that can be NOP'd, scatter checks across multiple files:

```php
// File 1: php/core/class-gp-capability-resolver.php
class GP_Capability_Resolver {
    private static $state = null;

    public static function can_render_extended($block) {
        // One of 5+ checks scattered across codebase
        $factors = self::get_env_factors();
        return self::evaluate($factors, $block);
    }
}

// File 2: shared rendering logic
class GP_Style_Processor {
    public function process($attrs, $block) {
        // Another check, disguised as style processing
        $attrs = $this->normalize_attrs($attrs); // Actually strips premium if unlicensed
        return $attrs;
    }
}

// File 3: Yet another location
add_filter('render_block', function($content, $block) {
    // Check happens inside normal-looking filter
    return GP_Output_Processor::filter($content, $block);
}, 10, 2);
```

### Defense Principle 3: Integrity Self-Verification

Use HMAC-based file integrity checking to detect code modifications:

```php
// Hidden in: php/core/class-gp-asset-loader.php
class GP_Asset_Loader {

    public function verify_assets() {
        $manifest = $this->get_manifest(); // Contains file hashes

        foreach ($manifest as $file => $expected_hash) {
            $actual = hash_hmac('sha256', file_get_contents($file), $this->get_key());
            if (!hash_equals($expected_hash, $actual)) {
                // File was modified - silently degrade
                update_option('gp_asset_state', 'degraded');
                return;
            }
        }
    }

    private function get_key() {
        // Key derived from multiple sources - hard to fake all
        return hash('sha256',
            get_option('gp_install_time') .
            ABSPATH .
            get_site_url()
        );
    }
}
```

### Defense Principle 4: No Obvious API Endpoints

**BAD:**
```php
register_rest_route('guttemberg-plus/v1', '/license/validate', ...);
register_rest_route('guttemberg-plus/v1', '/license/activate', ...);
```

**GOOD:**
```php
// Disguised as theme sync endpoint
register_rest_route('guttemberg-plus/v1', '/themes/sync', [
    'callback' => [$this, 'handle_sync'], // Actually does license check too
]);

// Or piggyback on existing calls
// Every theme save also silently validates license in background
```

### Defense Principle 5: Multiple Validation Layers

```
Layer 1: Transient cache (easily poisoned - they think they won)
   ↓
Layer 2: Option verification (secondary check they might miss)
   ↓
Layer 3: File integrity hash (catches code modifications)
   ↓
Layer 4: Render-time sanitization (the real enforcement)
   ↓
Layer 5: Periodic re-validation (catches stale bypasses)
```

### Recommended File Structure (Disguised)

```
php/
├── core/
│   ├── class-gp-config-resolver.php    # License manager (disguised)
│   ├── class-gp-remote-sync.php        # License validator (disguised)
│   ├── class-gp-asset-integrity.php    # File hash checker (disguised)
│   └── class-gp-output-processor.php   # Render sanitizer (disguised)
├── admin/
│   └── settings-advanced.php           # License admin (disguised)
└── css-defaults/                        # Keep existing
```

### Core Implementation: GP_Config_Resolver

```php
<?php
// php/core/class-gp-config-resolver.php
// Looks like a configuration utility, actually manages licensing

class GP_Config_Resolver {

    const OPTION_KEY = 'gp_config_state';        // Not "license"
    const TRANSIENT_KEY = 'gp_remote_config';    // Not "license_status"

    private static $resolved = null;

    /**
     * Looks like getting config, actually checks license
     */
    public static function get_capability_level(): string {
        if (self::$resolved !== null) {
            return self::$resolved;
        }

        // Layer 1: Quick transient check
        $cached = get_transient(self::TRANSIENT_KEY);
        if ($cached && self::verify_cached($cached)) {
            self::$resolved = $cached['level'];
            return self::$resolved;
        }

        // Layer 2: Stored config check
        $stored = get_option(self::OPTION_KEY);
        if ($stored && self::verify_stored($stored)) {
            self::$resolved = $stored['level'];
            return self::$resolved;
        }

        // Layer 3: Integrity check
        if (!GP_Asset_Integrity::verify()) {
            self::$resolved = 'basic';
            return self::$resolved;
        }

        self::$resolved = 'basic';
        return self::$resolved;
    }

    public static function has_extended_capability(): bool {
        return self::get_capability_level() === 'extended';
    }

    private static function verify_cached($data): bool {
        if (!isset($data['sig'], $data['ts'], $data['level'])) {
            return false;
        }

        // Verify signature
        $payload = $data['level'] . '|' . $data['ts'] . '|' . get_site_url();
        $expected = hash_hmac('sha256', $payload, self::get_verification_key());

        if (!hash_equals($expected, $data['sig'])) {
            return false;
        }

        // Check freshness (24 hours)
        if (time() - $data['ts'] > 86400) {
            return false;
        }

        return true;
    }

    private static function get_verification_key(): string {
        // Derived from multiple sources - hard to fake
        $factors = [
            defined('AUTH_KEY') ? AUTH_KEY : '',
            get_option('gp_install_id', ''),
            'gp_v1' // Version marker for rotation
        ];
        return hash('sha256', implode('|', $factors));
    }
}
```

### Core Implementation: GP_Output_Processor (Render Sanitizer)

```php
<?php
// php/core/class-gp-output-processor.php
// This is where premium features are ACTUALLY stripped

class GP_Output_Processor {

    private static $extended_vars = null;

    public static function init() {
        // Hook early, before any caching plugins
        add_filter('render_block', [__CLASS__, 'process'], 5, 2);
    }

    public static function process($content, $block): string {
        // Only process our blocks
        if (!self::is_our_block($block['blockName'])) {
            return $content;
        }

        // Check capability (the disguised license check)
        if (GP_Config_Resolver::has_extended_capability()) {
            return $content;
        }

        // Strip extended CSS variables
        return self::sanitize_output($content, $block['blockName']);
    }

    private static function sanitize_output($html, $block_name): string {
        $extended_vars = self::get_extended_vars($block_name);
        $defaults = self::get_defaults($block_name);

        foreach ($extended_vars as $attr => $css_var) {
            $default = $defaults[$attr] ?? 'initial';
            // Replace premium values with defaults
            $html = preg_replace(
                "/({$css_var})\\s*:\\s*[^;]+;/",
                "$1: {$default};",
                $html
            );
        }

        return $html;
    }

    private static function get_extended_vars($block_name): array {
        // Load from schema - attrs with pago: true
        $schema_file = GP_PLUGIN_PATH . "schemas/{$block_name}.json";
        if (!file_exists($schema_file)) {
            return [];
        }

        $schema = json_decode(file_get_contents($schema_file), true);
        $extended = [];

        foreach ($schema['attributes'] ?? [] as $attr => $config) {
            if (!empty($config['pago']) && !empty($config['cssVar'])) {
                $extended[$attr] = $config['cssVar'];
            }
        }

        return $extended;
    }

    private static function is_our_block($block_name): bool {
        return strpos($block_name, 'custom/') === 0;
    }

    private static function get_defaults($block_name): array {
        $name = str_replace('custom/', '', $block_name);
        $file = GP_PLUGIN_PATH . "php/css-defaults/{$name}.php";
        return file_exists($file) ? include($file) : [];
    }
}
```

### Core Implementation: GP_Asset_Integrity (Tamper Detection)

```php
<?php
// php/core/class-gp-asset-integrity.php

class GP_Asset_Integrity {

    const MANIFEST_OPTION = 'gp_asset_manifest';

    // Critical files to monitor
    private static $critical_files = [
        'php/core/class-gp-config-resolver.php',
        'php/core/class-gp-output-processor.php',
        'php/core/class-gp-remote-sync.php',
    ];

    public static function verify(): bool {
        $manifest = get_option(self::MANIFEST_OPTION);
        if (!$manifest) {
            return true; // First run, generate manifest
        }

        $key = self::get_integrity_key();

        foreach (self::$critical_files as $file) {
            $path = GP_PLUGIN_PATH . $file;
            if (!file_exists($path)) {
                return false; // File deleted
            }

            $current = hash_hmac('sha256', file_get_contents($path), $key);
            $expected = $manifest[$file] ?? null;

            if ($expected && !hash_equals($expected, $current)) {
                // File was modified
                self::log_tampering($file);
                return false;
            }
        }

        return true;
    }

    public static function generate_manifest(): void {
        $key = self::get_integrity_key();
        $manifest = [];

        foreach (self::$critical_files as $file) {
            $path = GP_PLUGIN_PATH . $file;
            if (file_exists($path)) {
                $manifest[$file] = hash_hmac('sha256', file_get_contents($path), $key);
            }
        }

        update_option(self::MANIFEST_OPTION, $manifest, false);
    }

    private static function get_integrity_key(): string {
        // Key changes per-install, making pre-computed bypasses useless
        return hash('sha256',
            ABSPATH .
            get_option('gp_install_id') .
            DB_NAME
        );
    }

    private static function log_tampering($file): void {
        // Silent degradation - no error messages to help crackers
        update_option('gp_integrity_state', 'modified', false);
    }
}
```

### Editor-Side Protection (GenericPanel.js)

```javascript
// shared/src/components/GenericPanel.js
// Add near the top, after imports

// Capability check - obfuscated variable name
const _gpcl = () => {
    // Multiple checks, not just one variable
    const w = window;
    const c = w.gpConfig || {};
    const s = c.state || {};

    // Check multiple indicators
    if (s.level === 'extended') return true;
    if (s.cap === 'full') return true;

    // Also check DOM for injected indicator (set by PHP)
    const el = document.getElementById('gp-cap-indicator');
    if (el && el.dataset.level === 'e') return true;

    return false;
};

// Inside the component, when rendering controls:
const renderControl = (attrName, attrConfig) => {
    const isExtended = attrConfig.pago === true;

    if (isExtended && !_gpcl()) {
        return (
            <div className="gp-control-locked" key={attrName}>
                <span className="gp-lock-icon">◆</span>
                <span className="gp-control-label">{attrConfig.label}</span>
                <span className="gp-upgrade-hint">Pro</span>
            </div>
        );
    }

    // Normal control rendering...
};
```

### Anti-Tampering Tricks

#### 1. Honeypot Function
```php
// Crackers will find and modify this - it does nothing
function gp_is_licensed() {
    return get_option('gp_license_valid', false);
}

// The real check is in GP_Config_Resolver::has_extended_capability()
```

#### 2. Delayed Verification
```php
// Don't check on every page load - check randomly
add_action('wp_loaded', function() {
    if (mt_rand(1, 100) <= 5) { // 5% of requests
        GP_Remote_Sync::verify_async();
    }
});
```

#### 3. Behavior-Based Detection
```php
// If someone manually sets the transient, the signature won't match
$cached = get_transient('gp_remote_config');
if ($cached) {
    // Verify signature - manual injection won't have valid sig
    if (!self::verify_signature($cached)) {
        // Silently mark as tampered
        update_option('gp_state', 'irregular');
    }
}
```

#### 4. No Error Messages
```php
// BAD - helps crackers debug
if (!is_licensed()) {
    wp_die('License invalid. Please activate your license.');
}

// GOOD - silent degradation
if (!GP_Config_Resolver::has_extended_capability()) {
    // Just render with defaults, no message
    return $this->render_basic($attrs);
}
```

#### 5. Obfuscated Constants
```php
// BAD
define('GP_PREMIUM', true);
define('GP_LICENSE_KEY', 'xxx');

// GOOD - meaningless names
define('GP_CF_LEVEL', 0x02);  // Capability flag
define('GP_RF_STATE', 0x01); // Remote flag
```

### Build-Time Protections

Add to `package.json`:

```json
{
  "scripts": {
    "build:prod": "npm run build && npm run obfuscate && npm run generate-manifest",
    "obfuscate": "node build-tools/obfuscate.js",
    "generate-manifest": "node build-tools/generate-integrity-manifest.js"
  }
}
```

#### JavaScript Obfuscation (build-tools/obfuscate.js)

```javascript
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const glob = require('glob');

const files = glob.sync('build/**/*.js');

const obfuscationMap = [];

files.forEach(file => {
    const code = fs.readFileSync(file, 'utf8');

    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        identifierNamesGenerator: 'hexadecimal',
        // Don't obfuscate WordPress globals
        reservedNames: ['^wp', '^React', '^jQuery'],
        sourceMap: true,
        sourceMapMode: 'separate'
    });

    fs.writeFileSync(file, obfuscated.getObfuscatedCode());
    const map = obfuscated.getSourceMap();
    if (map) {
        const mapPath = `${file}.map`;
        fs.writeFileSync(mapPath, map);
        obfuscationMap.push({ file, map: mapPath });
    }
});

fs.writeFileSync(
    'build/obfuscation-map.json',
    JSON.stringify(obfuscationMap, null, 2)
);
```

#### Integrity Manifest Generator (build-tools/generate-integrity-manifest.js)

```javascript
const fs = require('fs');
const crypto = require('crypto');

const criticalFiles = [
    'php/core/class-gp-config-resolver.php',
    'php/core/class-gp-output-processor.php',
    'php/core/class-gp-remote-sync.php',
];

// Generate a build-time manifest (stored separately from runtime manifest)
const manifest = {};
criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file);
        manifest[file] = crypto.createHash('sha256').update(content).digest('hex');
    }
});

fs.writeFileSync(
    'build/integrity-manifest.json',
    JSON.stringify(manifest, null, 2)
);

console.log('Generated integrity manifest for', Object.keys(manifest).length, 'files');
```

### Defense Layers Summary

| Layer | What It Does | Cracker Must... |
|-------|--------------|-----------------|
| **Naming obfuscation** | No "license" strings to grep | Understand entire codebase |
| **Distributed checks** | 5+ locations checking license | Find and modify ALL of them |
| **Integrity hashing** | Detects file modifications | Also fake the hash manifest |
| **Signature verification** | Validates cached data | Know your HMAC secret |
| **Silent degradation** | No error messages | Test every feature manually |
| **Honeypot functions** | Decoy license checks | Identify real vs fake |
| **Server-side enforcement** | Real gating in PHP render | Can't bypass with JS alone |
| **Domain locking** | Tied to site URL | Re-crack for each site |
| **Random verification** | Periodic async checks | Maintain bypass over time |
| **Build-time obfuscation** | Minified + obfuscated JS | Deobfuscate first |

### Key Insight

The goal is not to make cracking impossible—PHP source is always readable. The goal is to make the **effort of cracking exceed the cost of buying a license**. Each layer adds time and expertise requirements:

- Simple NOP slide: blocked by distributed checks
- Function override: blocked by multiple verification points
- Transient poisoning: blocked by signature verification
- Code modification: blocked by integrity hashing
- One-time crack: blocked by periodic re-validation

A cracker must defeat ALL layers simultaneously, and the crack must be maintained across plugin updates. For a $50-100 plugin license, this is economically unviable for most attackers.

### References

- [MoldStud - Protecting WordPress Plugin Code](https://moldstud.com/articles/p-how-can-i-protect-my-wordpress-plugin-code-from-unauthorized-use)
- [SourceGuardian - 7 Ways to Protect PHP Code](https://www.sourceguardian.com/blog-7-ways-to-protect-php-code-from-theft-post-245-1.html)
- [Freemius License Security](https://freemius.com/help/documentation/users-account-management/license-security/)
- [SitePoint - Monitoring File Integrity](https://www.sitepoint.com/monitoring-file-integrity/)
- [GridinSoft - Software Cracking Methods](https://gridinsoft.com/crack)
- [TheAdminBar - Nulled Plugin Threats](https://theadminbar.com/security-weekly/how-do-wordpress-websites-get-hacked-part-3/)
