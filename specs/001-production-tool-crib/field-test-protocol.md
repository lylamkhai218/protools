# Physical acceptance protocol

Status: NOT EXECUTED. The supplied full-tray image is not a box-level benchmark.

## OCR sample

1. Pick at least 30 real boxes, including nearly identical identities, small/glossy labels and horizontal/vertical placement. Two people verify box/shank code agreement before testing.
2. Use actual shift phones and browser versions, both normal and night lighting. Run at least 300 reads, recording all failures rather than discarding inconvenient samples.
3. Start timing when one label is fully inside the on-screen guide and the operator stops moving. Stop when the correct identity is presented, or mark timeout at 10 seconds. Record timeouts and retry counts separately.
4. Independently compare every proposed identity with the ground truth. A wrong valid identity is a failed gate even if it is later corrected manually.
5. Accept only >=95% correct within 3 seconds and zero wrong valid identities in this sample. If it fails, evaluate a same-identity QR label before hardware procurement.

## Supervised night shifts

Run two genuine shifts after approved inventory and permission setup. Record holder, drawing, tool, time, exception and morning reconciliation. No duplicate stock issue during reconciliation. A lost network response must not lead to a second physical issue. No production transactions are created by automated tests.

## Required sign-off

Warehouse confirms inventory mapping. Inspector confirms receipt/inspection behavior. Shift supervisor confirms usability. Admin authorizes release only after regression and restore rehearsal. Sign-offs are not fabricated by software checks.
