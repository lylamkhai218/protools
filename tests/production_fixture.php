<?php
// Isolated fake fixture only. Not a production seed or deploy artifact.
require __DIR__.'/production_domain.php';
$db->exec("ALTER TABLE tt_users ADD COLUMN password_hash TEXT; ALTER TABLE tt_products ADD COLUMN sku TEXT; ALTER TABLE tt_products ADD COLUMN name_vn TEXT;
UPDATE tt_products SET sku='TEST-METER',name_vn='Local fixture material'; UPDATE tt_users SET session_version=1,must_change_password=0;
UPDATE tt_users SET employee_code='LOCAL-CNC' WHERE id=2; UPDATE tt_tool_instances SET self_checkout_enabled=1 WHERE id=2;");
$s=$db->prepare('UPDATE tt_users SET password_hash=?');$s->execute(array(password_hash('LocalTestOnly-2026',PASSWORD_BCRYPT)));
$path=dirname(__DIR__).'/scratch/production-test.sqlite';
if(file_exists($path))unlink($path);
$db->exec('VACUUM INTO '.$db->quote($path));
echo "Isolated HTTP fixture ready. No production connections.\n";
