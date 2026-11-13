# Implementation plan

## Technical context
Existing PHP/PDO Office and MariaDB 10.6, plain JS, browser OCR, React/Vite public website remains separate. Preserve PHP 5.6-compatible syntax until hosting verified.

## Constitution check
No SQL bridges, no production test pollution, prepared input queries, append-only knowledge, no secrets in Git/graph, backup before deploy. Four-account limit is superseded only for approved genuine workshop employees.

## Delivery
T01-T02 tooling and evidence -> A baseline -> B access -> C custody -> D scan/night and E WIP -> F release. A OCR physical gate blocks operational scanner rollout, not local development or WIP.

## Interfaces
See contracts/production.md and data-model.md. Legacy read endpoints remain; legacy checkin receives only, never inspects. Idempotency belongs inside the same transaction as domain writes. Lock entities in sorted order for batches.

## Validation and rollout
Local syntax/domain tests first; MariaDB concurrency and migration tests second; OCR sample and supervised shifts third. Deploy through deploy_protools.py only after gates. Never infer release readiness from a successful Vite build. Rollback app release only with compatible schema; never restore over new inventory transactions without a reviewed reconciliation.
