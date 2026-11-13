# Tasks: Production tool crib

Status is evidence-based. Unchecked field/release tasks must not be reported complete.

## Phase 1: Tooling
- [x] T001 [FR-019] Back up tooling; install Specify CLI, preserve agy and add Codex integration.
- [x] T002 [FR-018] Install Graphify and rebuild sanitized graph covering Office and Kho.
- [x] T003 [FR-019] Write complete spec, research, plan, data model, contracts and task traceability.

## Phase 2: Baseline
- [ ] A001 [FR-016] Fingerprint local/live code and actual hosting PHP/schema without writes.
- [ ] A002 [FR-003] Inventory actual box/shank identities and resolve duplicates.
- [ ] A003 [FR-008] Collect >=30 boxes and measure >=300 reads on actual devices/night lighting.

## Phase 3: Access
- [ ] B001 [FR-016] Sanitize and version Office source; externalize configuration and enforce TLS.
- [x] B002 [FR-001] Protect pages and every production action; scoped deployment tokens and CSRF.
- [x] B003 [FR-002] Employee login, first password change, human idle timeout and revocation.
- [x] B004 [FR-015] Handover report for disabled staff; no historical deletion.

## Phase 4: US1 Safe custody
- [x] C001 [FR-004] Enforce receipt/inspection state machine in api_production.php.
- [x] C002 [FR-005] Atomic locking and idempotency for single and batch movements.
- [x] C003 [FR-010] Return request, receipt queue and inspector-only grading.
- [x] C004 [FR-011] Append-only audit, privileged corrections and relabel.

## Phase 5: US2 Camera and night
- [ ] D001 [FR-008] Implement exact local OCR and camera lifecycle; no fuzzy normalization.
- [x] D002 [FR-009] Single-use 120-second scan confirmation and protected evidence.
- [x] D003 [FR-006] Self checkout only eligible tools to authenticated holder.
- [x] D004 [FR-007] Morning reconciliation without a second stock issue.
- [ ] D005 [FR-017] Offline/error/expired-session UX and manual exception policy.

## Phase 6: US3 WIP
- [x] E001 [FR-012] Atomic source stock/ledger updates using verified units.
- [x] E002 [FR-013] Fixed-point length conservation and 2m remnant threshold.
- [ ] E003 [FR-014] Shortest adequate remnant, lineage, QR and truthful cost reports.
- [x] E004 [FR-015] Additive migrations and explicit historical reconciliation.

## Phase 7: US4 Acceptance
- [ ] F001 [FR-017] Keyboard/mobile/modal and legacy Office regression tests.
- [x] F002 [FR-005] MariaDB real concurrency, lost-response and rollback tests.
- [ ] F003 [FR-020] Two supervised night shifts and OCR field acceptance.
- [ ] F004 [FR-020] Backup/restore rehearsal and gated deployment via deploy_protools.py.
- [x] F005 [FR-019] Analyze artifacts, converge unmet requirements and update graph.

## Dependencies
T001-T003 -> A001 -> B -> C -> D. A002/A003 can run independently of access changes; A003 gates operational D rollout. E follows B and verified source stock, not D. F follows relevant implementation.

## Phase 8: Convergence - 2026-11-05

These are concrete remaining obligations after local implementation review. Existing grouped tasks and history are retained. Do not mark field/release work complete from code inspection.

- [ ] T029 [FR-019] Resolve or officially support the agy/Codex shared integration metadata without overwriting original custom skills; record clean official status or a reviewed compatible installation layout in operations.md.
- [ ] T030 [FR-016] Verify actual hosting PHP version/schema and file fingerprints through authorized read-only access; record differences in research.md before preparing a production migration.
- [ ] T031 [FR-003] Warehouse verifies real box/shank identities and resolves duplicates/mismatches; record actual sign-off, not fake fixture results.
- [ ] T032 [FR-008] Execute field-test-protocol.md on >=30 real boxes and >=300 reads; populate ocr-field-results.csv. If it fails, evaluate same-identity QR before procurement.
- [ ] T033 [FR-017] Complete Android/iPhone camera lifecycle, mobile layouts, printed labels, lost-network responses and representative legacy Office regression; attach evidence to implementation-status.md.
- [ ] T034 [FR-014] Verify/import actual source-level landed costs and units before enabling monetary reporting; until then keep unknown costs null. Validate physical remnant deep-link/OCR selection and scale-tare method.
- [ ] T035 [FR-020] Run two supervised genuine night shifts, complete morning reconciliation and populate night-shift-results.csv.
- [ ] T036 [FR-016] Rotate actual external credentials through authorized hosting/Bot administration and provision protected config outside webroot. Local extraction alone is not rotation.
- [ ] T037 [FR-020] Rehearse backup/restore against an isolated representative dataset, review schema-compatible rollback, then release only through deploy_protools.py after gates.
- [ ] T038 [FR-009] Schedule the reviewed 90-day evidence purge through server administration; verify authenticated image access and expiry with real deployment headers.

## Phase 9: Isolated label-scanner test page - 2026-11-05

- [ ] T039 [FR-008] Finish and verify the static, read-only `/office/san-xuat/test` page using the existing Office style tokens; it exposes no protected data, performs no database/API writes, and keeps OCR in-browser.
- [ ] T040 [FR-017] Back up and deploy only the isolated test-page files through an authenticated encrypted hosting channel; verify live route, camera Permissions-Policy, dependency paths, and rollback without editing the website root or shared Office policy.
- [ ] T041 [FR-008] Run the deployed page on iPhone 13 Safari with real package labels; record permission prompt, video preview, exact-code recognition, recovery states, and follow-on field OCR results under T032/T033.

## Phase 2 execution log - 2026-11-09

A001 is partially fingerprinted locally but remains open pending authenticated read-only hosting access. A002 and A003 remain open pending authoritative warehouse inventory and physical device/label measurements. Evidence and limitations are recorded in `research.md`; no task checkbox is marked complete from local or synthetic evidence.

## Phase 2 execution log - Mắt Bão S2 evidence - 2026-11-09

A001 remains PARTIAL after read-only S2 inspection: site PHP Selector shows 8.2; phpMyAdmin reports MariaDB 10.6.23 and 88 tables; live tool-crib structures were recorded in `research.md`. Live `/office/api_production.php` metadata differs from the local working-tree file, and three local PHP files are absent from the live directory listing. Exact remote hashes remain unverified, so A001 stays unchecked. No manual SQL, migration, file edit, or deployment was performed.

A002 and A003 remain unchecked. Warehouse needs to provide paired printed-box/engraved-shank codes and confirm duplicates. Physical OCR acceptance requires >=30 real boxes and >=300 reads on actual phones, with normal and night lighting; CSVs remain empty apart from headers.
