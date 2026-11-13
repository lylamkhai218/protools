# ADR: Production custody, local OCR and agent tooling

Date: 2026-11-05. Status: approved intent; local implementation, not a production release.

The user authorized the consolidated plan and explicit implementation. Additional genuine workshop accounts may use employee-code/password login; existing corporate accounts and their primary authentication remain. Employee creation requires reviewed roster, approving active Admin and reason; no real account was created during development.

One identity appears on the box and shank. OCR reads box text first, with exact catalog resolution and human confirmation. OCR evidence cannot establish physical possession; warehouse receipt compares the physical tool/shank. Live scanning is a performance experiment until the physical acceptance protocol passes.

Receipt and inspection are separate. Idempotency is transactional. A mistaken open tool issue can be reversed only by Admin with physical return confirmation and reason; its original record snapshot is preserved separately. WIP proposals do not change stock; physical receipt balances consumed/restocked/scrap lengths.

Specify 1.3.0 CLI and Graphify 0.9.102 are installed. Existing agy custom skill files and shared infrastructure were preserved. Codex is registered alongside agy under the user's explicit request; the upstream multi-install descriptor and shared manifest warnings remain visible and are not patched away. Avoid forced integration upgrades/uninstalls until that conflict is resolved. No Graphify watcher or lifecycle/commit hook is required.

Graph source allowlist includes sanitized Office/Kho code despite Git ignore, selected feature docs and constitution. It excludes private config, dumps, customer files, bulk images and dependencies. AST and semantic design evidence stay distinguishable. Verify actual source and tests before claiming implemented behavior.

External secret rotation, production runtime/schema verification, physical OCR, two supervised night shifts and restore rehearsal remain release gates. No database migration, deploy or stock write was performed on production.
