# Project: Protools B2B Industrial Catalog & Murrplastik Portal

## Architecture
- React 19 + Vite 6 + TypeScript + Tailwind CSS Single Page Application (SPA).
- LiteSpeed Web Server with .htaccess URL rewriting, HTTP/2 & Brotli compression, strict security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).
- Multi-channel routing:
  - Root portal: `/`, `/cart` (`/gio-bao-gia`), `/danh-muc/*`, `/san-pham/*`
  - Specialized divisions: `/murrplastik`, `/murrplastik/*`, `/robot-dresspack`
- Static pre-rendering snapshots via `generate_static_snapshots.py` ensuring instant SEO indexability and rich social previews.
- Production hosting: Mắt Bão Cloud Network (`s2d34.cloudnetwork.vn` - IP: `112.78.2.34`), web root `/public_html`.
- Master release pipeline via `deploy_production_root.py` with automated backup, atomic file upload, and permission enforcement (`chmod 644 .htaccess`).

## Code Layout
- `src/` — Core React application source code:
  - `components/` — Reusable components (`Header.tsx`, `Footer.tsx`, `SEOHead.tsx`, `FloatingWidgets.tsx`, `VirtualCatalogGrid.tsx`, etc.)
  - `pages/` — Page components (`Home.tsx`, `ProductDetail.tsx`, `CartQuote.tsx`, `RobotConfigurator.tsx`, etc.)
  - `data.ts` — Single Source of Truth for corporate identity (NAP), sales/tech rosters, catalog data
  - `i18n/` — Multilingual translation resources
- `public/` — Static assets (WebP images, STL models, `llms.txt`, `llms-full.txt`, `ai-manifest.json`, `robots.txt`)
- `scripts/` — Audit, schema validation, and verification tooling (`validate_schemas.py`, `test_all_schemas.py`, `verify_all_requirements.py`, `audit_links_assets.py`)
- `generate_static_snapshots.py` — Prerendering script for catalog categories and product pages
- `deploy_production_root.py` — Master production deployment script to Mắt Bão LiteSpeed server

## Feature Inventory
| # | Feature / Remediation Task | Description | Milestone | Source |
|---|----------------------------|-------------|-----------|--------|
| 1 | TS-1: Lazy-load RobotConfigurator | Convert static import to `React.lazy()` in `src/App.tsx` | M1 | Explorer 1 |
| 2 | TS-2: Optimize manualChunks | Fix chunking logic in `vite.config.ts` for `lucide-react` and `motion` | M1 | Explorer 1 |
| 3 | TS-3: Clean Build Directory | Set `emptyOutDir: true` in `vite.config.ts` | M1 | Explorer 1 |
| 4 | TS-4: Fix TypeScript Config | Add `"include": ["src"]` in `tsconfig.json` to prevent OOM in `pnpm lint` | M1 | Explorer 1 |
| 5 | TS-5: Remove DDL in submit_quote.php | Remove per-request `ALTER TABLE` in `public/api/submit_quote.php` | M1 | Explorer 1 |
| 6 | TS-6: Cache .stl 3D Models | Add `.stl` to 1-year immutable cache regex in `deploy_production_root.py` | M1 | Explorer 1 |
| 7 | TS-7: Auto-backup before Deploy | Invoke `create_production_backup()` in `deploy_production_root.py` | M1 | Explorer 1 |
| 8 | TS-8: Relocate Leaked Python Scripts | Move `build_pdf.py` & `build_presentation.py` out of `public/` into `scripts/` | M1 | Explorer 3 / Test 5 |
| 9 | QA-1: Schema Graph Decoupling | Decouple `BreadcrumbList` from `Product` using `@graph` in `src/components/SEOHead.tsx` | M1 | Explorer 2 |
| 10 | QA-2: Fix Dead Links | Patch broken links in `public/murrplastik/index.html` and automotive subpage | M1 | Explorer 2 |
| 11 | QA-4: Mobile Table Scroll Polish | Add `overflow-x-auto` to tables in `ProductDetail.tsx` and adjust `FloatingWidgets.tsx` width | M1 | Explorer 2 |
| 12 | BA-1: Restore BOM Quick Quote Tool | Re-integrate BOM Drawer, Excel paste parser, sample presets in `src/pages/CartQuote.tsx` | M1 | Explorer 3 |
| 13 | BA-2: Fix CSV Export Bug | Use `encodeURIComponent` / Blob in `CartQuote.tsx` `handleExportCSV` | M1 | Explorer 3 |
| 14 | BA-3: Disclose MOQ Badge | Add explicit MOQ disclosure badge (`MOQ: 1 cái/hộp`) in `src/pages/ProductDetail.tsx` | M1 | Explorer 3 |
| 15 | SA-1: Update Team Roster in data.ts | Add Ms. Nhinh to `salesTeam`, Mr. Phong & Mr. Hai to `techTeam` in `src/data.ts` | M1 | Explorer 3 |
| 16 | SA-2: Complete Contact Hubs | Expose full sales & tech personnel in `Footer.tsx` and `FloatingWidgets.tsx` | M1 | Explorer 3 |
| 17 | SA-3: Sales Filter Dropdown | Add Mr. Khải (`0968.597.131`) to filter dropdown in `VirtualCatalogGrid.tsx` | M1 | Explorer 3 |
| 18 | SA-4: Murrplastik Phone Cleanup | Replace legacy `0973.363.824` with active sales numbers in `public/murrplastik/` and `i18n.js` | M1 | Explorer 2 |
| 19 | MKT-1: Standardize NAP Headquarters | Harmonize address to `Thôn Trà Hồi - Xã Thái Thụy - Tỉnh Hưng Yên` in `data.ts` & `faqTranslations.ts` | M1 | Explorer 2 & 3 |
| 20 | MKT-2: Standardize Corporate Email | Harmonize email to `t2t.vina@gmail.com` in `src/data.ts` | M1 | Explorer 3 |
| 21 | MKT-3: Tax ID Integration | Add Tax ID `0108392186` to `COMPANY_INFO`, `Footer.tsx`, and Schema.org | M1 | Explorer 3 |
| 22 | MKT-4: Northern VN IZ Targeting | Add Northern Vietnam Industrial Zone delivery banner & badges on `src/pages/Home.tsx` | M1 | Explorer 3 |
| 23 | MKT-5: Remove Windows Emojis | Remove `❌` emoji in `public/murrplastik/assets/js/i18n.js` per Rule 1 | M1 | Explorer 2 |
| 24 | MKT-6: Remove Placeholder Meta Tag | Remove `PASTE_YOUR_CODE_HERE` in `public/murrplastik/index.html` | M1 | Explorer 3 |
| 25 | QA-3: Add Snapshot Category | Add `linh-kien-thiet-bi` to `generate_static_snapshots.py` | M1 | Explorer 2 |
| 26 | REL-1: Generate Static Snapshots | Run `py generate_static_snapshots.py` and verify generated snapshots | M1 | Requirement R2 |
| 27 | REL-2: Production Vite Build | Run `pnpm build` and verify clean build with chunk sizes < 800 kB | M1 | Requirement R1/R2 |
| 28 | REL-3: Full Automated Test Suite | Run `scripts/validate_schemas.py`, `scripts/test_all_schemas.py`, and `scripts/verify_all_requirements.py` | M1 | Acceptance Criteria |
| 29 | REL-4: Master Production Deploy | Execute `py deploy_production_root.py` to deploy to `s2d34.cloudnetwork.vn` | M2 | Requirement R3 |
| 30 | REL-5: Live 200 Verification | Verify live HTTP 200 responses on `/`, `/murrplastik/`, and `/robot-dresspack/` | M2 | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Comprehensive Defect Remediation & Build Verification | Items 1-28 (Tech, QA, BA, Sales, Marketing, Snapshots, Build) | none | DONE |
| 2 | M2: Master Production Release & Live Verification | Items 29-30 (deploy_production_root.py and live HTTP 200 checks) | M1 | DONE |

## Interface Contracts
### `src/data.ts` ↔ UI Components (`Header`, `Footer`, `FloatingWidgets`, `SEOHead`)
- `COMPANY_INFO.headquarters`: `"Thôn Trà Hồi - Xã Thái Thụy - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)"`
- `COMPANY_INFO.taxId`: `"0108392186"`
- `COMPANY_INFO.email`: `"t2t.vina@gmail.com"`
- `COMPANY_INFO.salesTeam`: Array of `{ name, role, phone, zalo, email?, avatar? }` including Ms. Nhinh (`0964.920.025`), Ms. Hiền (`0929.938.368`), Ms. Phương (`0365.366.455`), Mr. Bình (`0868.822.409`), Mr. Khải (`0968.597.131`), Mr. Thanh (`0943.301.886`).
- `COMPANY_INFO.techTeam`: Array of `{ name, role, phone, zalo }` including Mr. Phong (`0983.794.782`) and Mr. Hai (`0981.919.590`).
