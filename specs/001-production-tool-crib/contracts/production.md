# Production action contract

All actions require active session. Writes require POST, session CSRF and Idempotency-Key. 401 unauthenticated/revoked/expired, 403 forbidden/CSRF, 409 state or payload conflict, 422 invalid values, 503 unavailable schema. Internal SQL is logged privately, never returned.

| Action | Roles | Precondition / result |
|---|---|---|
| production_tool_resolve | production readers | exact code -> identity and eligibility |
| production_tool_create | admin | unique identity -> new tool, self checkout disabled |
| production_tool_eligibility | admin | ready verified tool + reason -> enable/disable self checkout |
| production_tool_relabel | warehouse, admin | reason -> audited reprint of unchanged identity |
| production_tool_issue_reverse | admin | open mistaken issue + physical return confirmation + reason -> compensating correction; original snapshot preserved |
| production_scan_create | warehouse, CNC, admin | eligible tool/drawing -> expiring token |
| production_tool_checkout | warehouse, admin | ready tool -> one open loan |
| production_self_checkout | CNC, admin | self only, allowed tool and scan -> loan |
| production_return_request | holder, warehouse, admin | open own loan -> request only |
| production_tool_checkin | warehouse, admin | open loan -> INSPECTION; legacy alias |
| production_tool_batch_checkin | warehouse, admin | all valid or rollback |
| production_tool_inspect | inspector, admin | received pending inspection -> warehouse/scrap |
| production_night_reconcile | warehouse, admin | unreconciled issue -> reconciliation only |
| production_wip_advance | warehouse, admin | sufficient verified source -> ledger out |
| production_wip_return | warehouse, admin | open advance -> balanced ledger in/scrap |
| production_wip_return_request | engineer holder, warehouse, admin | open advance -> proposal only, no stock change |
| production_remnant_resolve | scoped readers | exact QR identity -> current source and balance, no write |
| production_runtime | admin | PHP/db version and migration readiness, no secrets |

Sales cannot mutate production; accountants and supervisors have scoped read only. Engineer can request WIP return; warehouse confirms. Admin overrides are audited, never bypass inventory constraints.
