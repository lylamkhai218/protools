# Data model

- Users: preserve id and email; employee_code unique nullable, workshop_role scoped separately from Office role, session_version, must_change_password. No fake email or seeded employee.
- Tool instances: existing id/code/status/location; self_checkout_enabled defaults false. Existing suspect records require reconciliation.
- Movements: issuer/receiver/inspector IDs alongside historical display names; return request and physical receipt separate from inspection completion.
- Audit: append-only actor/action/entity/before/after/reason/time. Corrections use compensating events.
- Requests: actor+action+key unique, payload SHA256, stored result. Same key with different payload =>409.
- Scan sessions: unpredictable token hash, actor/tool/drawing, 120-second expiry, consumed once.
- WIP: stock item/source parent, fixed-point length in hundredths, consumption/return/scrap split, ledger references. No inventory conversion without verified units.
- Reconciliation: unique movement, reconciler/time/note; no duplicate checkout.
- Images: protected opaque filename, MIME/size verified, retention 90 days, privileged reads.
