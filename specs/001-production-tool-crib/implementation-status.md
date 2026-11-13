# Implementation evidence - 2026-11-05

Status: LOCAL IMPLEMENTATION IN PROGRESS. NOT DEPLOYED. Checked tasks mean the described local behavior is evidenced, not field/production acceptance.

## Actual verification

- Specify CLI 1.3.0, Graphify CLI 0.9.102 installed; feature prerequisite check passes. Original agy skill customizations restored. Side-by-side integration status retains upstream metadata/manifest warnings, documented in operations.md; not claimed clean.
- Graph rebuild includes 50 code files, Office/Kho and seven selected documents. Source locations preserved; graph queried successfully. Some entrypoint-only files yield no AST symbols; their inclusion is recorded, not misrepresented as full symbol coverage.
- PHP 8.2.35 syntax checks on Office source passed; JS syntax checks passed.
- 45 isolated SQLite domain assertions passed: replay, changed payload conflict, permission denial, receipt/inspection separation, atomic failed batch, revocation, audited issue reversal, expired scan rejection, engineer return proposal and WIP boundaries.
- 14 HTTP assertions passed on local PHP: guest redirect/401, employee-code login, own loans and cursor pagination, no commercial Office access, CSRF, scan token, self issue, replay and changed-payload rejection.
- Three session assertions passed: read polling does not refresh activity, expiry at exactly 3600 seconds, revocation.
- Six staff-administration assertions passed: approving Admin required, scoped role restriction, initial password change, disable/revoke and audit. No real employee was created.
- MariaDB 10.6.23 portable fixture: additive migration applied twice, 0/1.99/2/2.01m conservation passed. Independent actors/connections contending for one tool produced one success/one 409 and one open loan. Concurrent WIP issue produced one success/one 409 and no negative stock.
- Browser login and scoped workshop desktop page verified with fake local fixture only. Physical camera and mobile QA remain unverified.
- pnpm lint passed. Full pnpm build, snapshot generation and 149-URL sitemap generation passed with PROTOOLS_PYTHON pointing to a working interpreter.
- Literal-credential scanner passed on reviewed Office source. Existing private values moved outside public/; external credential rotation NOT performed.
- Supplied full-tray photo processed locally by OCR: 1068ms recognition after initialization, confidence score 33 and unreliable text. This is one exploratory image, not measured accuracy or a passed box-level benchmark.

## Not verified or not complete

Production PHP/schema fingerprint, private key rotation/provisioning, real employee roster and identity inventory, physical >=300 reads, two supervised night shifts, full legacy Office/mobile regression, restore rehearsal and release are outstanding. Tool issue reversal and engineer WIP return proposal are implemented and locally tested. Pagination, remnant deep-link lookup and label printing exist; physical scan/print QA and verified source-cost ingestion remain unverified. See appended convergence tasks.

## Requirement-to-task coverage (design, not completion)

Post-review additions: current graph has 473 nodes/1030 edges. The task list retains a convergence phase for actual hosting, physical evidence and release. C004 correction and engineer proposal are now locally covered; source-level cost ingestion is still gated by verified data. No clean official integration-status claim is made.

| Requirement | Tasks |
|---|---|
| FR-001 | B002 |
| FR-002 | B003 |
| FR-003 | A002 |
| FR-004 | C001 |
| FR-005 | C002, F002 |
| FR-006 | D003 |
| FR-007 | D004 |
| FR-008 | A003, D001 |
| FR-009 | D002 |
| FR-010 | C003 |
| FR-011 | C004 |
| FR-012 | E001 |
| FR-013 | E002 |
| FR-014 | E003 |
| FR-015 | B004, E004 |
| FR-016 | A001, B001 |
| FR-017 | D005, F001 |
| FR-018 | T002 |
| FR-019 | T001, T003, F005 |
| FR-020 | F003, F004 |

20/20 requirements have tasks (100% design coverage); this is NOT 100% implementation or test completion.

Verification note: Git's staged whitespace check reports inherited trailing whitespace in the newly versioned legacy Office files. Existing business/source text was not reformatted to hide those baseline warnings. PHP syntax, application checks and builds passed; no claim of a clean staged whitespace check is made.

## Update 2026-11-05 - Isolated label-scanner test page

- Local implementation added under `public/office/san-xuat/test/`: authenticated Office-only access, Office typography/colors, mobile layout, HTTPS/camera preflight, visible permission/video recovery, exact two-read OCR check, and no inventory writes or image upload.
- The route has its own `.htaccess` camera allowance (`camera=(self)`); microphone and geolocation remain disabled. The page does not change the root `.htaccess` or shared Office headers.
- `node --check` passed for the page controller. PHP CLI is not installed in this workspace, so `php -l` could not run. A local browser request redirected to the Office login page, confirming the page is gated; no login credentials were entered.
- Production deployment is not complete. The live site could not be queried from the command-line environment; the browser reaches only the DirectAdmin login screen. No authenticated encrypted file-transfer session is available. Existing deployment scripts use plain FTP and broad Office paths, so they were not used.
- The test page still needs PHP syntax/runtime verification, remote dependency/fingerprint checks, a backup of the exact target folder, and live response-header verification before upload. iPhone camera/OCR behavior remains unverified. See T039-T041.

### Final implementation correction - 2026-11-05

The PHP/authenticated draft described above was replaced before completion by `public/office/san-xuat/test/index.html`. The final page is static and does not depend on a database or Office login because the live Office manufacturing page uses a different, currently guest-visible access flow; this test page exposes no protected data and has no write/API path. The earlier local redirect applied only to the discarded PHP draft. Production route and OCR assets remain absent, so the final static page is still local-only and is not deployed.

### Isolated dependency packaging - 2026-11-05

Direct checks show the live site also lacks `/office/tool-scanner.js`. The test page now points to a scanner copy and Tesseract assets inside its own `/office/san-xuat/test/` folder, avoiding shared `/office` files. Tesseract.js 7's local-installation guidance requires a compatible set of core builds; include the pinned local package assets and English model rather than loading OCR code from a third-party CDN. The final static page source is still awaiting browser preview because the current local preview redirects to login; no file upload has occurred.

### Release package prepared - 2026-11-05

Final package uses the static page, route-scoped camera/CSP/cache headers, a scanner copy with Blob workers disabled, 22 pinned Tesseract runtime files, and a checksum-verified English model. `scripts/package_office_scan_test.ps1` generated `scratch/office-scan-test-release-20261105-135003/office-san-xuat-test-20261105-135003.zip`; archive SHA-256 is `310e5d9adeb65a2b62b71ba6cd8b1a95a13fc612222aecfd66473d3e5e04e8e9`. The archive was not uploaded.
