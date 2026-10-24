# Project: Protools Emergency Security Audit & Zero-Downtime Upgrade Pipeline

## Architecture
- React 19 + Vite 6 + TypeScript 5.8 + Tailwind CSS v4 Single Page Application (SPA).
- LiteSpeed Web Server with `.htaccess` URL rewriting, LSPHP worker pools, HTTP/2 & HTTP/3, strict security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).
- Hosting server: Mắt Bão Cloud Network (`s2d34.cloudnetwork.vn` - IP: `112.78.2.34`), MariaDB 10.6 (`prod2e4e_db`).
- WAF: Imunify360 (ModSecurity generic rules `77218530` and `77350224`).
- Multi-tier backend:
  - Modern Subsystems (`public/office/`, `public/kho/`, `public/api/`): Modern PDO with `ERRMODE_EXCEPTION`, `utf8mb4`, prepared statements, Telegram 2FA OTP (`MASTER_TEST_OTP=999999`), 1-hour session inactivity timeout.
  - Legacy AdminCP Subsystem (`admincp/`): 74 legacy files shimmed via `admincp/legacy_mysql_shim.php` wrapping `mysqli` and polyfilling `split()`.
- Zero-Downtime Staged LSPHP Cutover:
  - Directory-level `.htaccess` with `AddHandler application/x-httpd-php82 .php` allowing isolated testing and sub-second rollback.

## Feature Inventory (Emergency Pipeline)
| # | Feature / Remediation Task | Description | Milestone | Source |
|---|----------------------------|-------------|-----------|--------|
| 31 | SEC-1: Root `.htaccess` LSPHP Hardening | Disable `session.upload_progress.enabled` & `fatal_error_backtraces`; block PHP stream wrappers and exploit signatures | M1 | Explorer 1 |
| 32 | SEC-2: `/api/submit_quote.php` Hardening | Enforce JSON Content-Type, `LimitRequestBody 131072` (128 KB), decode depth limit, items length check | M1 | Explorer 1 |
| 33 | SEC-3: `/kho/uploads/` Execution Lock | Add `Require all denied` for `.php`, `.phtml` in `public/kho/uploads/.htaccess` & block direct access to `/kho/data/` | M1 | Explorer 1 |
| 34 | SEC-4: `/kho/api.php` Extension Whitelist | Add strict whitelist (`jpg`, `jpeg`, `png`, `webp`) for base64 uploads in `public/kho/api.php` | M1 | Explorer 1 |
| 35 | SEC-5: `/office/.htaccess` Protection | Block external HTTP access to `diag.php`, `seed_runner.php`, and `storage/` directory | M1 | Explorer 1 |
| 36 | SEC-6: `admincp/.htaccess` Module Lockdown | Rewrite rule blocking direct HTTP to `admincp/modules/*.php` except `user_login.php` | M1 | Explorer 1 |
| 37 | PHP-1: Legacy MySQL & Split Shim | Implement `admincp/legacy_mysql_shim.php` with `mysqli` wrapper and `split()` polyfill | M2 | Explorer 2 |
| 38 | PHP-2: Include Shim in AdminCP | Include `legacy_mysql_shim.php` in `admincp/index.php`, `login.php`, `support.php`, `uploadfile.php` | M2 | Explorer 2 |
| 39 | PHP-3: Null Safety & String Coercion | Add `(string)` casts for `htmlspecialchars()` & `trim()` in `public/office/` | M2 | Explorer 2 |
| 40 | PHP-4: Cookie Security & SameSite | Update `session_set_cookie_params()` and `setcookie()` with `SameSite=Lax` | M2 | Explorer 2 |
| 41 | PHP-5: Error Display Suppression | Add `ini_set('display_errors', '0')` in `public/kho/api.php` to prevent JSON response corruption | M2 | Explorer 2 |
| 42 | PHP-6: Replace Deprecated Sanitize Email | Replace `FILTER_SANITIZE_EMAIL` in `public/api/submit_quote.php` with regex/trim sanitization | M2 | Explorer 2 |
| 43 | NODE-1: Upgrade Local Node.js to v24.22.1 | Upgrade Node runtime from v24.13.0 to v24.22.1 LTS addressing Brotli CVE-2026-111497 | M3 | Explorer 3 |
| 44 | NODE-2: Bump Vite >= 6.4.4 | Update `vite` in `package.json` to resolve 5 security advisories | M3 | Explorer 3 |
| 45 | NODE-3: Build & Lint Verification | Run `pnpm run lint` and `pnpm run build` cleanly with zero warnings or broken dependencies | M3 | Explorer 3 |
| 46 | E2E-1: Core Modules Regression Suite | Implement automated non-destructive tests for Murrplastik search, Quote API, Warehouse WMS, Backoffice | M4 | Explorer 3 |
| 47 | E2E-2: Staged DirectAdmin / LSPHP Cutover | Deploy staged `.htaccess` handler (`application/x-httpd-php82`) and verify subfolder execution | M4 | Explorer 3 |
| 48 | E2E-3: Production Verification & Rollback Test | Verify live HTTP 200 and JSON responses across all modules under PHP 8.2+ with instant rollback readiness | M4 | Explorer 3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | SecOps & Infrastructure Containment | Items 31-36 (Root `.htaccess`, Quote API, Kho uploads lock, AdminCP lockdown) | none | IN_PROGRESS |
| M2 | Backend PHP 8.2+ Compatibility & Refactoring | Items 37-42 (MySQL shim, null safety, cookie SameSite, error suppression) | none | PLANNED |
| M3 | Node.js v24.22.1 Upgrade & Build Verification | Items 43-45 (Node v24.22.1, Vite bump, build/lint verification) | none | PLANNED |
| M4 | Regression Testing & Staged Production Cutover | Items 46-48 (E2E regression suite, LSPHP staged cutover, live verification) | M1, M2, M3 | PLANNED |

## Interface Contracts
### Public API ↔ Frontend Quote Submission
- Endpoint: `POST /api/submit_quote.php`
- Required Headers: `Content-Type: application/json`
- Max Body Size: 131,072 bytes (128 KB)
- Payload Schema:
  ```json
  {
    "company_name": "string (required, max 255)",
    "phone": "string (required, regex /^(0|84)(3|5|7|8|9)[0-9]{8}$/)",
    "email": "string (optional, valid email)",
    "notes": "string (optional, max 1000)",
    "hp_fax": "string (honeypot, must be empty)",
    "items": [
      {
        "sku": "string (required, alphanumeric/symbols)",
        "quantity": "integer (required, > 0)",
        "unit": "string (optional)",
        "note": "string (optional)"
      }
    ]
  }
  ```
- Response Schema:
  - HTTP 200: `{"success": true, "rfq_id": "RFQ-...", "message": "..."}`
  - HTTP 400: `{"success": false, "error": "..."}`
  - HTTP 403: (Blocked by LiteSpeed if non-JSON or exploit signature detected)
  - HTTP 429: `{"success": false, "error": "Too Many Requests"}`

### Warehouse WMS API (`public/kho/api.php`)
- Headers: `X-PIN: string` or cookie `kho_auth`
- Actions: `health_check`, `get_data`, `update_stock`, `upload_image`
- Response: JSON with `{"ok": true, ...}`

### Backoffice ERP API (`public/office/auth.php` & `api.php`)
- Headers: `X-Test-Mode: 1` (suppresses live Telegram broadcasts during automated tests)
- Auth Flow: Credentials verification -> Telegram 2FA OTP (`MASTER_TEST_OTP=999999` in test mode) -> `TTVINA_OFFICE_SESS` cookie
