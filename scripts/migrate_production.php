<?php
// CLI-only; never expose schema migrations through HTTP.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__).'/public/office/config.php';
require dirname(__DIR__).'/public/office/production_schema.php';
if (!in_array('--apply', $argv, true)) { fwrite(STDERR,"Backup first. Use --apply against an explicitly configured isolated database.\n"); exit(2); }
production_migrate(get_db());
echo "Production additive migration applied. No inventory or employee seeds inserted.\n";
