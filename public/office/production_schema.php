<?php
// Additive migration. CLI callers supply PDO; never seed workshop people or inventory.
function production_migrate($pdo) {
    $sqlite = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
    $tables = array(
        'tt_users' => array('employee_code' => 'VARCHAR(50) NULL', 'workshop_role' => 'VARCHAR(30) NULL', 'session_version' => 'INT NOT NULL DEFAULT 1', 'must_change_password' => 'INT NOT NULL DEFAULT 0'),
        'tt_tool_instances' => array('self_checkout_enabled' => 'INT NOT NULL DEFAULT 0'),
        'tt_tool_movements' => array('holder_user_id' => 'INT NULL', 'issued_by' => 'INT NULL', 'received_by' => 'INT NULL', 'inspected_by' => 'INT NULL', 'inspected_at' => 'DATETIME NULL', 'return_requested_at' => 'DATETIME NULL', 'is_self_checkout' => 'INT NOT NULL DEFAULT 0', 'reconciled_at' => 'DATETIME NULL', 'reconciled_by' => 'INT NULL', 'voided_at'=>'DATETIME NULL'),
        'tt_wip_materials' => array('stock_item_id' => 'INT NULL', 'engineer_user_id' => 'INT NULL', 'measured_return_meters' => 'DECIMAL(10,2) NULL', 'scrap_length_meters' => 'DECIMAL(10,2) NOT NULL DEFAULT 0', 'available_length_meters' => 'DECIMAL(10,2) NOT NULL DEFAULT 0', 'return_requested_at'=>'DATETIME NULL','return_requested_length'=>'DECIMAL(10,2) NULL','unit_cost_landed_vnd'=>'DECIMAL(15,2) NULL','consumed_cost_vnd'=>'DECIMAL(15,2) NULL')
    );
    foreach ($tables as $table => $columns) {
        $existing = $sqlite ? $pdo->query('PRAGMA table_info('.$table.')')->fetchAll(PDO::FETCH_ASSOC) : $pdo->query('SHOW COLUMNS FROM '.$table)->fetchAll(PDO::FETCH_ASSOC);
        if (!$existing) throw new RuntimeException('Missing baseline table: '.$table);
        $names = array();
        foreach ($existing as $column) $names[] = $sqlite ? $column['name'] : $column['Field'];
        foreach ($columns as $name => $type) if (!in_array($name, $names, true)) $pdo->exec('ALTER TABLE '.$table.' ADD COLUMN '.$name.' '.$type);
    }
    // Nullable codes preserve legacy email users without inventing workshop identities.
    if (!$sqlite) $pdo->exec('ALTER TABLE tt_users MODIFY email VARCHAR(191) NULL');
    if ($sqlite) $pdo->exec('CREATE UNIQUE INDEX IF NOT EXISTS uniq_employee_code ON tt_users(employee_code)');
    else {
        $indexes = $pdo->query("SHOW INDEX FROM tt_users WHERE Key_name = 'uniq_employee_code'")->fetchAll();
        if (!$indexes) $pdo->exec('CREATE UNIQUE INDEX uniq_employee_code ON tt_users(employee_code)');
    }
    $id = $sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'BIGINT AUTO_INCREMENT PRIMARY KEY';
    $engine = $sqlite ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
    $pdo->exec('CREATE TABLE IF NOT EXISTS tt_production_requests (id '.$id.', actor_id INT NOT NULL, action VARCHAR(64) NOT NULL, request_key VARCHAR(100) NOT NULL, payload_hash VARCHAR(64) NOT NULL, response_json TEXT NOT NULL, created_at DATETIME NOT NULL, UNIQUE(actor_id,action,request_key))'.$engine);
    $pdo->exec('CREATE TABLE IF NOT EXISTS tt_production_audit (id '.$id.', actor_id INT NOT NULL, action VARCHAR(64) NOT NULL, entity_id BIGINT NULL, detail_json TEXT NOT NULL, created_at DATETIME NOT NULL)'.$engine);
    $pdo->exec('CREATE TABLE IF NOT EXISTS tt_production_scans (token_hash VARCHAR(64) PRIMARY KEY, actor_id INT NOT NULL, tool_id BIGINT NOT NULL, drawing_code VARCHAR(100) NOT NULL, expires_at BIGINT NOT NULL, consumed_at DATETIME NULL)'.$engine);
    $pdo->exec('CREATE TABLE IF NOT EXISTS tt_production_evidence (token_hash VARCHAR(64) PRIMARY KEY, actor_id INT NOT NULL, filename VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL)'.$engine);
    $pdo->exec('CREATE TABLE IF NOT EXISTS tt_production_corrections (id '.$id.', actor_id INT NOT NULL, movement_id BIGINT NOT NULL UNIQUE, original_json TEXT NOT NULL, reason TEXT NOT NULL, created_at DATETIME NOT NULL)'.$engine);
}
