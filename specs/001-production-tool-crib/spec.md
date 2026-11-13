# Feature: Production tool crib and WIP

Approved 2026-11-05. Status: implementation in progress, NOT released.

## User stories
- US1: Safe tool custody (FR-001..FR-007, FR-010..FR-011).
- US2: Scan and night self-service (FR-008..FR-009, FR-017).
- US3: Conserved WIP stock (FR-012..FR-015).
- US4: Maintainable and releasable system (FR-016, FR-018..FR-020).

## Functional requirements
- FR-001: Only authenticated active employees can access production; enforce per-action permissions and CSRF.
- FR-002: Keep email login; support unique employee codes, first-password change, revocation and 3600-second human inactivity expiry.
- FR-003: One tool identity is printed on its box and engraved on its shank; block duplicates and unresolved mismatches.
- FR-004: Tool lifecycle is warehouse -> CNC shop -> inspection -> warehouse or scrap; wear is separate from location.
- FR-005: Serialize checkout/checkin/inspection; one open loan per tool; replay identical requests, reject changed payloads.
- FR-006: A worker may self-checkout only to themselves against a drawing, for an eligible inspected tool.
- FR-007: Night issues are recorded immediately; morning reconciliation never issues stock twice.
- FR-008: OCR box text locally in browser; exact identity only, no zero stripping, fuzzy matching or silent character substitution.
- FR-009: Scan confirmation expires after 120 seconds and is consumed once; image/confidence is not proof of physical possession.
- FR-010: Workers request return; warehouse receives; inspector grades; batch receipt is atomic.
- FR-011: Manual entry, relabel and corrections require privileged actor, reason and immutable audit.
- FR-012: WIP issue and receipt update real stock ledger atomically; never exceed stock or remnant balance.
- FR-013: Issued length equals consumed plus returned stock plus scrap; >=2m returns to stock, smaller leftovers are scrap.
- FR-014: Prefer shortest adequate remnant; preserve parent lineage; print protected QR and show missing cost honestly.
- FR-015: Preserve historical users/records; disabled staff retain handover liabilities; migrations contain no sample transactions.
- FR-016: Manage sanitized Office source in Git; externalize secrets; scope deploy tokens; verify TLS.
- FR-017: Accessible responsive UI has explicit loading/error/session states and does not report offline writes as successful.
- FR-018: Local graph covers Office, scanner and contracts with sources; exclude secrets, dumps, customer files and bulk images.
- FR-019: Spec Kit artifacts trace requirements to tasks and tests; preserve project knowledge append-only.
- FR-020: Release only after MariaDB regression, backup/restore rehearsal and two supervised night shifts.

## Success criteria
- SC-001: At least 95% of 300 physical reads across >=30 real boxes resolve correctly within 3 seconds once clear; zero wrong valid identities in this sample. Not a guarantee of zero production error.
- SC-002: Concurrent checkout yields one loan; duplicate returns do not overwrite history; polling never extends idle sessions.
- SC-003: All WIP and stock movements conserve hundredths of meters and roll back on failure.
- SC-004: Each requirement maps to an executable test or named field acceptance record.

## Edge cases
Damaged/mismatched labels, duplicate codes, multiple labels in frame, revoked session, stale scan, lost response, reused idempotency key with changed payload, overlapping batch receipts, zero stock, remnant 1.99/2/2.01m, incomplete historical stock. Block unresolved inventory instead of guessing.

## Out of scope
BOM, production planning, machine scheduling, cloud OCR, automatic production migration, unattended release.
