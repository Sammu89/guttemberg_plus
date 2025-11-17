# Security Vulnerability Analysis

**Plugin:** Guttemberg Plus
**Audit Date:** 2025-11-17
**Security Rating:** ⚠️ **HIGH RISK** - Critical vulnerabilities found

---

## Executive Summary

This plugin has **CRITICAL security vulnerabilities** that must be fixed before any production use. The primary concerns are:

1. **Missing nonce verification** - Exposes REST API to CSRF attacks
2. **Insufficient capability checks** - Weak authorization model
3. **Missing output escaping** - Potential XSS vulnerabilities
4. **No rate limiting** - Vulnerable to abuse

**Status:** ❌ **NOT SAFE FOR PRODUCTION**

---

## Critical Vulnerabilities

### 🚨 CVE-1: Missing Nonce Verification (CRITICAL)

**Severity:** CRITICAL
**CVSS Score:** 8.8 (High)
**CWE:** CWE-352 (Cross-Site Request Forgery)

#### Description

All REST API endpoints in `php/theme-rest-api.php` lack nonce verification. This allows attackers to perform Cross-Site Request Forgery (CSRF) attacks.

#### Affected Endpoints

1. `GET /wp-json/gutenberg-blocks/v1/themes/{blockType}`
2. `POST /wp-json/gutenberg-blocks/v1/themes`
3. `PUT /wp-json/gutenberg-blocks/v1/themes/{blockType}/{name}`
4. `DELETE /wp-json/gutenberg-blocks/v1/themes/{blockType}/{name}`
5. `POST /wp-json/gutenberg-blocks/v1/themes/{blockType}/{name}/rename`

#### Attack Vector

An attacker can craft a malicious page that makes requests to these endpoints:

```html
<!-- Malicious page that deletes all themes -->
<script>
fetch('https://victim-site.com/wp-json/gutenberg-blocks/v1/themes/accordion/Premium%20Theme', {
    method: 'DELETE',
    credentials: 'include' // Sends victim's cookies
});
</script>
```

If a logged-in user with `edit_posts` capability visits this page, their themes will be deleted without their knowledge.

#### Evidence

**File:** `php/theme-rest-api.php`
**Lines:** 19-145

```php
// NO NONCE VERIFICATION anywhere in this file
register_rest_route(
    $namespace,
    '/themes/(?P<blockType>accordion|tabs|toc)',
    array(
        'methods'             => 'GET',
        'callback'            => __NAMESPACE__ . '\\get_themes_handler',
        'permission_callback' => __NAMESPACE__ . '\\check_permissions', // Only capability check
        // NO NONCE CHECK!
    )
);
```

#### Impact

- **Severity:** CRITICAL
- **Exploitability:** Easy (no authentication bypass needed)
- **Impact:** Data modification, data deletion, unauthorized theme creation

An attacker can:
1. Delete all user themes
2. Create spam themes
3. Modify existing themes
4. Cause denial of service by filling database

#### Fix Required

Add nonce verification to all endpoints:

```php
// Add to register_routes() function
add_filter( 'rest_pre_dispatch', function( $result, $server, $request ) {
    // Get the route
    $route = $request->get_route();

    // Check if it's our endpoint
    if ( strpos( $route, '/gutenberg-blocks/v1/themes' ) === false ) {
        return $result;
    }

    // Skip GET requests (read-only)
    if ( $request->get_method() === 'GET' ) {
        return $result;
    }

    // Verify nonce for POST/PUT/DELETE
    $nonce = $request->get_header( 'X-WP-Nonce' );
    if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
        return new WP_Error(
            'rest_cookie_invalid_nonce',
            __( 'Cookie nonce is invalid', 'guttemberg-plus' ),
            array( 'status' => 403 )
        );
    }

    return $result;
}, 10, 3 );
```

**OR** use WordPress's built-in REST API nonce handling by ensuring the frontend sends the nonce:

```javascript
// In JavaScript (shared/src/data/store.js)
import apiFetch from '@wordpress/api-fetch';

// apiFetch automatically includes nonce if wpApiSettings is available
// Ensure in PHP that wp_localize_script includes:
wp_localize_script( 'your-script', 'wpApiSettings', array(
    'root'  => esc_url_raw( rest_url() ),
    'nonce' => wp_create_nonce( 'wp_rest' )
) );
```

**Status:** ❌ Not implemented

---

### 🚨 CVE-2: Insufficient Authorization Checks (HIGH)

**Severity:** HIGH
**CVSS Score:** 7.1 (High)
**CWE:** CWE-862 (Missing Authorization)

#### Description

The permission callback only checks `edit_posts` capability, which is too broad. Any contributor can modify themes, potentially affecting all users.

#### Evidence

**File:** `php/theme-rest-api.php`
**Lines:** 154-156

```php
function check_permissions() {
    return current_user_can( 'edit_posts' );
}
```

This allows:
- Contributors to create/modify/delete themes
- Themes are site-wide (stored in wp_options), not per-user
- Contributors affecting administrator themes

#### Impact

- Contributors can delete administrator-created themes
- No per-user theme isolation
- No role-based access control

#### Recommended Fix

Implement capability-based access control:

```php
function check_permissions( $request ) {
    $method = $request->get_method();

    // Read operations: editors and above
    if ( $method === 'GET' ) {
        return current_user_can( 'edit_posts' );
    }

    // Write operations: administrators only
    if ( in_array( $method, array( 'POST', 'PUT', 'DELETE' ) ) ) {
        return current_user_can( 'manage_options' );
    }

    return false;
}
```

**Alternative:** Add user ownership to themes:

```php
// In create_block_theme()
$theme = array(
    'name'     => $name,
    'values'   => $values,
    'created'  => current_time( 'mysql' ),
    'modified' => current_time( 'mysql' ),
    'author'   => get_current_user_id(), // ADD THIS
);

// In update/delete handlers, check ownership
$theme = get_theme( $block_type, $name );
if ( $theme['author'] !== get_current_user_id() && ! current_user_can( 'manage_options' ) ) {
    return new WP_Error( 'unauthorized', 'You cannot modify this theme' );
}
```

**Status:** ❌ Not implemented

---

### ⚠️ CVE-3: Missing Output Escaping (MEDIUM)

**Severity:** MEDIUM
**CVSS Score:** 6.1 (Medium)
**CWE:** CWE-79 (Cross-Site Scripting)

#### Description

Theme names and other user-generated content are not properly escaped before output, creating potential XSS vulnerabilities.

#### Evidence

**File:** `php/theme-rest-api.php`
**Lines:** 266

```php
return rest_ensure_response(
    array(
        'success' => true,
        'message' => "Theme '$name' deleted successfully", // No escaping!
    )
);
```

#### Attack Vector

A malicious theme name could contain JavaScript:

```javascript
createTheme( 'accordion', '<script>alert("XSS")</script>', {} );
```

While the REST API returns JSON (lower risk), if this message is ever displayed in admin pages without escaping, it will execute.

#### Current Mitigations

✅ Theme names are validated with regex:
```php
// Line 40
if ( ! preg_match( '/^[a-zA-Z0-9\s\-_]+$/', $name ) ) {
    return new WP_Error( 'invalid_name', 'Theme name can only contain...' );
}
```

This prevents `<script>` tags, reducing XSS risk significantly.

However, best practice is to **always escape output**, even if input is validated.

#### Recommended Fix

```php
return rest_ensure_response(
    array(
        'success' => true,
        'message' => sprintf(
            __( "Theme '%s' deleted successfully", 'guttemberg-plus' ),
            esc_html( $name )
        ),
    )
);
```

**Status:** ⚠️ Partially mitigated by input validation, but escaping still missing

---

### ⚠️ CVE-4: No Rate Limiting (MEDIUM)

**Severity:** MEDIUM
**CVSS Score:** 5.3 (Medium)
**CWE:** CWE-770 (Allocation of Resources Without Limits)

#### Description

REST API endpoints have no rate limiting, allowing:
- Spam theme creation (database pollution)
- Brute force attempts
- Denial of service

#### Attack Vector

```javascript
// Attacker script
for (let i = 0; i < 10000; i++) {
    fetch('/wp-json/gutenberg-blocks/v1/themes', {
        method: 'POST',
        body: JSON.stringify({
            blockType: 'accordion',
            name: 'Spam Theme ' + i,
            values: {}
        })
    });
}
```

This could fill the database with spam themes.

#### Recommended Fix

Implement rate limiting using WordPress transients:

```php
function check_rate_limit() {
    $user_id = get_current_user_id();
    $limit_key = 'theme_api_limit_' . $user_id;

    $count = get_transient( $limit_key );

    if ( false === $count ) {
        set_transient( $limit_key, 1, MINUTE_IN_SECONDS );
        return true;
    }

    if ( $count >= 10 ) { // Max 10 requests per minute
        return new WP_Error(
            'rate_limit_exceeded',
            'Too many requests. Please wait.',
            array( 'status' => 429 )
        );
    }

    set_transient( $limit_key, $count + 1, MINUTE_IN_SECONDS );
    return true;
}

// Add to permission_callback
function check_permissions( $request ) {
    $rate_check = check_rate_limit();
    if ( is_wp_error( $rate_check ) ) {
        return $rate_check;
    }

    return current_user_can( 'edit_posts' );
}
```

**Status:** ❌ Not implemented

---

### ⚠️ CVE-5: Theme Value Injection (LOW-MEDIUM)

**Severity:** MEDIUM
**CVSS Score:** 5.5 (Medium)
**CWE:** CWE-20 (Improper Input Validation)

#### Description

Theme `values` parameter accepts any array structure without validation. Malicious users could inject:
- Extremely large payloads (DoS)
- Invalid data structures
- Dangerous CSS (e.g., `javascript:` URLs in backgrounds)

#### Evidence

**File:** `php/theme-storage.php`
**Lines:** 127-129

```php
if ( ! is_array( $values ) ) {
    return new WP_Error( 'invalid_values', 'Values must be an array' );
}
// No further validation!
```

#### Attack Vector

```javascript
// Inject 10MB of data
const hugeValues = {};
for (let i = 0; i < 100000; i++) {
    hugeValues['attr' + i] = 'x'.repeat(1000);
}

createTheme( 'accordion', 'DoS Theme', hugeValues );
```

#### Recommended Fix

Implement comprehensive value validation:

```php
function validate_theme_values( $values, $block_type ) {
    // Check size limit
    $json_size = strlen( json_encode( $values ) );
    if ( $json_size > 100000 ) { // 100KB limit
        return new WP_Error( 'values_too_large', 'Theme values exceed size limit' );
    }

    // Validate known attributes
    $valid_attributes = get_block_attributes( $block_type );

    foreach ( $values as $key => $value ) {
        // Check if attribute is valid
        if ( ! isset( $valid_attributes[ $key ] ) ) {
            return new WP_Error( 'invalid_attribute', "Unknown attribute: $key" );
        }

        // Validate type
        $expected_type = $valid_attributes[ $key ]['type'];
        if ( ! validate_attribute_type( $value, $expected_type ) ) {
            return new WP_Error( 'invalid_type', "Invalid type for $key" );
        }

        // Sanitize colors (prevent javascript: URLs)
        if ( $expected_type === 'string' && strpos( $key, 'Color' ) !== false ) {
            $values[ $key ] = sanitize_hex_color( $value );
        }
    }

    return $values;
}
```

**Status:** ❌ Not implemented

---

## Additional Security Concerns

### 1. No Database Query Protection

**Status:** ✅ Safe - Uses `get_option()` and `update_option()` (no raw SQL)

The plugin correctly uses WordPress options API instead of direct database queries, preventing SQL injection.

### 2. Direct File Access Protection

**Status:** ✅ Implemented in `php/css-parser.php`

```php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

However, this is **MISSING** in:
- `php/theme-storage.php`
- `php/theme-rest-api.php`

**Fix Required:**

Add to top of each PHP file:

```php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
```

### 3. WordPress Version Requirements

**Status:** ⚠️ Not specified

No minimum WordPress version specified. Plugin uses:
- REST API (requires WP 4.7+)
- Gutenberg (requires WP 5.0+)
- `block.json` apiVersion 3 (requires WP 6.3+)

**Recommendation:** Specify in main plugin file:

```php
/**
 * Requires at least: 6.3
 * Tested up to: 6.4
 * Requires PHP: 7.4
 */
```

### 4. Theme Data Sanitization

**Status:** ⚠️ Partial

- ✅ Theme names: Sanitized with `sanitize_text_field()`
- ✅ Theme names: Validated with regex
- ❌ Theme values: Not sanitized or validated

### 5. File Upload Security

**Status:** ✅ N/A - No file uploads

---

## Security Headers

The plugin does not set any security headers. Consider adding to main plugin file:

```php
add_action( 'send_headers', function() {
    if ( is_admin() ) {
        header( 'X-Content-Type-Options: nosniff' );
        header( 'X-Frame-Options: SAMEORIGIN' );
        header( 'X-XSS-Protection: 1; mode=block' );
    }
} );
```

---

## Data Privacy Concerns

### GDPR Compliance

**Theme Storage:**
- Themes are stored in `wp_options` table
- Includes `created` and `modified` timestamps
- **Missing:** User identification (no author field)
- **Missing:** Data export functionality
- **Missing:** Data deletion on user removal

**Recommendation:**

1. Add user ownership to themes
2. Implement data export in privacy exporter
3. Delete user themes on account deletion

```php
// Add to plugin
add_filter( 'wp_privacy_personal_data_exporters', function( $exporters ) {
    $exporters['guttemberg-plus-themes'] = array(
        'exporter_friendly_name' => __( 'Guttemberg Plus Themes' ),
        'callback'               => 'gutemberg_plus_export_themes',
    );
    return $exporters;
} );
```

---

## Security Audit Checklist

| Check | Status | Notes |
|-------|--------|-------|
| ✅ SQL Injection Protection | ✅ PASS | Uses WP Options API |
| ✅ XSS Protection (Input) | ⚠️ PARTIAL | Validation present, escaping missing |
| ✅ XSS Protection (Output) | ❌ FAIL | Missing output escaping |
| ✅ CSRF Protection | ❌ FAIL | No nonce verification |
| ✅ Authentication | ✅ PASS | Uses WP auth |
| ✅ Authorization | ⚠️ WEAK | Only `edit_posts` check |
| ✅ Direct File Access | ⚠️ PARTIAL | Missing in 2/4 files |
| ✅ Data Validation | ⚠️ PARTIAL | Names validated, values not |
| ✅ Data Sanitization | ⚠️ PARTIAL | Names sanitized, values not |
| ✅ Rate Limiting | ❌ FAIL | Not implemented |
| ✅ File Upload Security | ✅ N/A | No uploads |
| ✅ Capability Checks | ⚠️ WEAK | Too permissive |
| ✅ Error Messages | ✅ PASS | No sensitive data leaked |
| ✅ Logging | ✅ N/A | No logging implemented |
| ✅ Data Privacy | ⚠️ PARTIAL | No GDPR compliance |

**Overall Security Score:** 4.5/10 (Critical issues present)

---

## Recommended Immediate Actions

### Priority 1 (CRITICAL - Fix Immediately)

1. ✅ **Implement nonce verification** for all REST API endpoints
2. ✅ **Add ABSPATH check** to all PHP files
3. ✅ **Strengthen capability checks** for write operations

### Priority 2 (HIGH - Fix Before Beta)

4. ✅ **Add output escaping** for all user-generated content
5. ✅ **Implement theme value validation**
6. ✅ **Add rate limiting** to prevent abuse

### Priority 3 (MEDIUM - Fix Before Production)

7. ✅ **Add user ownership** to themes
8. ✅ **Implement GDPR compliance**
9. ✅ **Add security headers**
10. ✅ **Document security considerations** in README

---

## Security Testing Recommendations

Before production release:

1. **Automated Security Scanning**
   - Run WPScan
   - Use Plugin Check plugin
   - Run Snyk or similar dependency scanner

2. **Manual Penetration Testing**
   - CSRF attack simulation
   - XSS payload testing
   - Authorization bypass attempts
   - Rate limiting verification

3. **Code Review**
   - PHPCS with WordPress security ruleset
   - ESLint security plugin for JavaScript
   - Manual review of all user input handling

4. **WordPress.org Submission**
   - Will likely be rejected without fixing CSRF vulnerability
   - Security team will flag missing nonces

---

## References

- [WordPress REST API Handbook - Security](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/)
- [WordPress Plugin Security Best Practices](https://developer.wordpress.org/plugins/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WordPress Nonces](https://developer.wordpress.org/apis/security/nonces/)
- [Data Validation](https://developer.wordpress.org/plugins/security/data-validation/)

---

**Security Audit Completed:** 2025-11-17
**Next Review Recommended:** After fixing critical vulnerabilities
