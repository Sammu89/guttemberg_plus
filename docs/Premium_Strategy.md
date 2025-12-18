# Premium Strategy & Anti-Tamper Plan

This document outlines how to gate premium attributes (flagged via `pago` in schemas) while making bypassing difficult. The flow assumes:
- Single plugin package, license-gated premium.
- Premium attrs editable/previewable in editor, but sanitized on render without a valid license.
- License discovery via a stable GitHub redirect to the current license server.

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
