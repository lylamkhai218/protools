# Local setup and release safeguards

## Installed tools

Specify CLI 1.3.0 (official git tag), Graphify 0.9.102 (official package), PHP 8.2.35 portable, MariaDB 10.6.23 portable. PHP/MariaDB test runtimes are in ignored scratch and are not server upgrades.

Codex and agy are both registered. Original Spec Kit skill customizations were restored from the pre-install backup. Shared infrastructure was preserved. `specify integration status` still reports upstream agy multi-install metadata and shared-path/manifest warnings; do not call it clean or run force-upgrade/uninstall against shared skills. Prerequisite resolution and the skills themselves work. Codex Graphify's installer-added no-op hook was removed; no watcher/commit hook is installed.

## Local validation

- Run `scratch/php/php.exe tests/production_domain.php`.
- Run `scratch/php/php.exe tests/production_fixture.php` before HTTP/session tests. These are explicitly fake, local-only fixtures.
- Start PHP bound only to 127.0.0.1:8765 with `TTVINA_TEST_SQLITE` pointing to scratch/production-test.sqlite and tests/production_router.php as router. Run tests/production_http_test.py and tests/production_session.php.
- tests/production_race.py needs the isolated MariaDB runtime on 127.0.0.1:33316. It resets only the literal database protools_test_20261105, uses no Office credentials and tests separate actors/connections.
- Run `pnpm run lint` and `pnpm run build`. If Windows app aliases cannot launch Python, set `PROTOOLS_PYTHON` to an actual Python 3 executable. The runner avoids changing system PATH.
- Run scripts/prepare-office-assets.ps1 to provision pinned OCR/QR assets from tools/office-assets/package-lock.json. The OCR model checksum is pinned in model.json. These assets are self-hosted at runtime, not fetched from CDN.
- Use Graphify's installed Python interpreter to run scripts/refresh_production_graph.py, then `graphify export html`. Query graph before reading affected source, but verify the source before edits.

## Configuration and release

Private constants were extracted into ignored office.config.local.php outside public/. Values were preserved, NOT rotated externally. Production needs independently rotated keys and a separately provisioned config outside webroot, selected through TTVINA_CONFIG_FILE. Never copy the local private file into dist or Git.

Schema changes are additive and seed-free. scripts/migrate_production.php is CLI-only for isolated/local validation. Do not run it against production through an HTTP bridge. Production database administration must follow the project's DirectAdmin/phpMyAdmin protocol with an approved reviewed migration and backup.

Do not deploy this worktree yet. Hosting runtime/schema, real inventory, full Office regression, physical camera evaluation, two shifts and restore rehearsal remain release gates. Use deploy_protools.py only after those gates and include protected config provisioning plus vendor asset checks. Never downgrade schema or restore over new inventory movements without reviewed reconciliation.

## Staff administration

scripts/production_staff.php reads JSON from stdin, never a password in command arguments. It requires a genuine employee code/name, approved workshop role, active approving Admin ID, reason and a 12-72 byte initial password; optional email must be real. Disable uses the same reviewed workflow, increments session_version and emits outstanding custody/WIP handover. No real employee has been created or disabled during this implementation.

## Evidence retention

Images are server-named JPEGs under blocked storage/production-evidence, read only through authenticated production_evidence with actor/privilege checks. scripts/purge_production_evidence.php purges expired opaque JPEG files after 90 days. Schedule it through reviewed server administration; no cron was installed automatically.
