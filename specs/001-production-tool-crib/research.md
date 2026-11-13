# Research and evidence

## Known
- Local legacy handler is public/office/api_production.php; camera scanner is public/kho/index.php.
- Existing graph was anchored to src: 227 nodes, 557 edges, zero Office nodes.
- Specify 1.3.0 CLI and graphifyy 0.9.102 installed via uv on 2026-11-05.
- Existing integration agy is 1.3.1.dev0; preserve its shared templates and modified skill history.
- Local validation runtime: PHP 8.2.35, official portable archive with SHA256 verified. This does not establish hosting runtime.
- Kho uses ZBar/Quagga barcode decoding, crop/contrast, event cleanup, beep suppression and still-photo fallback. It has permissive zero-stripped matching unsuitable for tool identity.

## Decisions
- Browser OCR first, one worker, exact match; no cloud. A QR label encoding the same tool identity is the fallback only after failed field evaluation.
- Database is MariaDB 10.6. SQLite can exercise domain smoke tests, never substitutes for MariaDB concurrency acceptance.
- All production facts, physical OCR performance, employee roster and two night shifts remain UNVERIFIED until evidence is attached.
- No production credentials or customer documents in graph; no hosted graph service, watcher or commit hook.

## Release blockers
Actual production PHP/schema fingerprint, clean inventory mapping, private secret rotation, isolated MariaDB test fixture, measured physical OCR, supervised shifts.

## Phase 2 execution update - 2026-11-09

### A001 - Local/live baseline fingerprint (partial; not complete)
- Local checkout is on branch `main` at HEAD `d57361c`. The following SHA-256 values fingerprint the current working-tree files, not the committed HEAD alone:
  - `public/office/api_production.php`: `5685286B6FE0F993E4E48522A606970A5A80E7CED11C6449E734377EB248C730`
  - `public/office/production_schema.php`: `B074D489B98A033195DE6B65462B1FF414D41727A950F070AA5602CDE0084BB5`
  - `public/office/production_service.php`: `EB2D2928E6FA1D6993670AE44F9EF632267D6F3BA83DB29DD6C3A075E8713B0E`
  - `public/office/production_http.php`: `9E0FC3811CF264764A71764E631D5EF72D7484AF3850458A28D0C06243A3099E`
  - `public/kho/index.php`: `7B1BEEABE61D0CD14569AAD7350CCDC9F60F75C0C52291AB59A955BE250D8435`
- No `php` command is currently available on PATH. Earlier dated local evidence records PHP 8.2.35 from a portable runtime, but that runtime could not be re-invoked in this check.
- The official DirectAdmin endpoint returned its login form. No authenticated session was available, no credential was entered, and no production database query or write was performed. Actual hosting PHP version, live schema and remote file fingerprints remain UNVERIFIED. Keep A001 open.

### A002 - Physical identity inventory (not complete)
- The current repository scan found no signed inventory workbook or verified box/shank mapping. The OCR and night-shift result CSVs contain headers only.
- `vi/danh-gia-khao-sat-kho-dao.md` is explicitly based on a survey summary not reconciled against the original recording or source workbook; its examples and ambiguity notes are not an authoritative stock list.
- No physical box, shank or duplicate was inspected during this check. Keep A002 open until warehouse signs off the real identity mapping.

### A003 - Physical OCR measurement (not executed)
- `field-test-protocol.md` remains NOT EXECUTED. No real boxes, shift phones, browsers or night-lighting measurements were available in this check.
- Synthetic labels, supplied screenshots and prior simulations do not count toward the >=30 boxes / >=300 reads threshold. Both result CSVs remain header-only. Keep A003 open.

## Hosting access correction - 2026-11-09

- User clarified that this Protools project is hosted on Mắt Bão S2 and does not use DirectAdmin. The DirectAdmin login-page observation above is not a valid fingerprint of the project's hosting or control plane; do not use DirectAdmin for further checks.
- A001 remains open. Continue only through the user's actual authorized Mắt Bão S2 access method and keep PHP/schema/code inspection read-only. No production query or write was made during the mistaken panel check.

## Phase 2 execution update - Mắt Bão S2 read-only baseline - 2026-11-09

### A001 - Actual host and database baseline (partial; keep open)
- Accessed the hosting dashboard through the user's Mắt Bão S2 portal path and opened its official phpMyAdmin and File Manager. Inspection was read-only; no SQL statement was manually run, and no production file, setting, or data was changed.
- Hosting PHP selector displayed current version `8.2`. phpMyAdmin reports its own PHP runtime as `8.3.36`; treat that as phpMyAdmin's runtime, not as the website PHP version.
- phpMyAdmin identifies the selected production database as `prod2e4e_db`, MariaDB `10.6.23-MariaDB-cll-lve`, with 88 tables. The database overview and table Structure pages were used; no business rows were opened.
- Production `tt_tool_instances` has 13 columns: `id`, `tool_code`, `tool_name`, `oem_specs`, `category_prefix`, `diameter_mm`, `instance_number`, `current_status`, `current_location`, `assigned_operator`, `total_uses`, `created_at`, `updated_at`.
- Production `tt_tool_movements` has 16 columns: `id`, `tool_instance_id`, `drawing_code`, `operator_name`, `programmer_name`, `issued_at`, `issued_status`, `returned_at`, `returned_status`, `flank_wear_vb_mm`, `inspector_name`, `warehouse_staff`, `digital_signature`, `note`, `created_at`, `updated_at`.
- The production schema does not show local additions from `production_schema.php`: `self_checkout_enabled` on `tt_tool_instances`, and `holder_user_id`, `issued_by`, `received_by`, `inspected_by`, `inspected_at`, `return_requested_at`, `is_self_checkout`, `reconciled_at`, `reconciled_by`, `voided_at` on `tt_tool_movements`. Do not run the migration until separately approved and gated.
- File Manager path `/domains/protools.com.vn/public_html/office` shows live `api_production.php` at 28.63 KB, last modified 2026-11-02 15:10; local working-tree file is 30,273 bytes, last modified 2026-11-05 09:08. The live editor preview and local source header/first section look alike, but file size/time differ, so exact content equality is not established.
- Live office directory listing has 23 entries and does not include local `production_schema.php`, `production_service.php`, or `production_http.php` (local sizes 3,832, 27,988, and 5,864 bytes). Remote SHA-256 values were not obtained. Live `007_production_tool_and_wip.sql` is listed at 9.41 KB, modified 2026-11-02 15:10; local copy is 9,637 bytes, modified 2026-10-30 16:10.
- A001 remains PARTIAL because live code hashes/content have not been fully compared. The evidence does establish that the local additions are not present in the live `/office` listing and production schema lacks their new columns. No deployment or migration was performed.

### A002/A003 - Physical evidence remains outstanding
- A002 remains OPEN: no authoritative warehouse-approved box/shank identity list or physical duplicate reconciliation was supplied or inspected.
- A003 remains OPEN: no actual-device test was run. Acceptance still needs at least 30 real boxes and 300 reads, including the specified real shift/night-light conditions; current result CSVs remain header-only.
- Plain-language collection example for the warehouse: for each physical item, write down the code printed on the box and the code engraved on the tool shank as one pair; flag cases where they differ or repeat. Then use actual phones to scan at least 30 boxes and log 10 attempts per box (300 total) under normal and night lighting.
