<?php
/**
 * TTVINA OFFICE - PRODUCTION & TOOL CRIB REST API HANDLER
 * Modules: CNC Tool Management (SOP-02) & Automation WIP Materials (SOP-01)
 * Standard: ECC AgentShield / OWASP Secure API Architecture
 * PHP 5.6 & PHP 8.x Compatible (MariaDB & SQLite Dual Support)
 */

if (!defined('TTVINA_OFFICE_VERSION')) {
    require_once __DIR__ . '/config.php';
}

function handle_production_action($action, $pdo, $user) {
    $now = date('Y-m-d H:i:s');
    $isSqlite = ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite');
    
    // Helper to get JSON payload or POST
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);
    if (!is_array($payload)) {
        $payload = $_POST;
    }

    // --------------------------------------------------------------------------
    // 1. DASHBOARD METRICS & KPIs
    // --------------------------------------------------------------------------
    if ($action === 'production_stats_dashboard') {
        try {
            // Count total tool instances
            $totalToolsStmt = $pdo->query("SELECT COUNT(*) AS c FROM tt_tool_instances");
            $totalTools = (int)$totalToolsStmt->fetchColumn();

            // Tools currently on shop floor
            $inShopStmt = $pdo->query("SELECT COUNT(*) AS c FROM tt_tool_instances WHERE current_location = 'CNC_SHOP'");
            $inShop = (int)$inShopStmt->fetchColumn();

            // Active unreturned movements
            $unreturnedStmt = $pdo->query("SELECT COUNT(*) AS c FROM tt_tool_movements WHERE returned_at IS NULL");
            $unreturnedCount = (int)$unreturnedStmt->fetchColumn();

            // Overdue movements (> 15 days)
            $overdueSql = $isSqlite
                ? "SELECT COUNT(*) AS c FROM tt_tool_movements WHERE returned_at IS NULL AND issued_at < datetime('now', '-15 days')"
                : "SELECT COUNT(*) AS c FROM tt_tool_movements WHERE returned_at IS NULL AND issued_at < DATE_SUB(NOW(), INTERVAL 15 DAY)";
            $overdueStmt = $pdo->query($overdueSql);
            $overdueCount = (int)$overdueStmt->fetchColumn();

            // Scrapped tools count
            $scrappedStmt = $pdo->query("SELECT COUNT(*) AS c FROM tt_tool_instances WHERE current_status = 'SCRAPPED'");
            $scrappedCount = (int)$scrappedStmt->fetchColumn();

            // Automation WIP Remnants
            $activeRemnantStmt = $pdo->query("SELECT COUNT(*) AS c, COALESCE(SUM(returned_length_meters), 0) AS total_m FROM tt_wip_materials WHERE status = 'RETURNED_REMNANT'");
            $remnantData = $activeRemnantStmt->fetch();
            $activeRemnants = (int)$remnantData['c'];
            $remnantMeters = (float)$remnantData['total_m'];

            // Pending advance rolls on floor
            $advancedWipStmt = $pdo->query("SELECT COUNT(*) AS c FROM tt_wip_materials WHERE status = 'ADVANCED_TO_FLOOR'");
            $pendingWipCount = (int)$advancedWipStmt->fetchColumn();

            json_response(array(
                'ok' => true,
                'data' => array(
                    'total_tools' => $totalTools,
                    'in_shop' => $inShop,
                    'unreturned_count' => $unreturnedCount,
                    'overdue_count' => $overdueCount,
                    'scrapped_count' => $scrappedCount,
                    'active_remnants' => $activeRemnants,
                    'remnant_meters_saved' => $remnantMeters,
                    'pending_wip_count' => $pendingWipCount
                )
            ));
        } catch (Exception $e) {
            json_response(array('ok' => false, 'error' => 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 2. TOOLS LIST & SEARCH
    // --------------------------------------------------------------------------
    if ($action === 'production_tools_list') {
        try {
            $status = isset($_GET['status']) ? trim((string)$_GET['status']) : '';
            $location = isset($_GET['location']) ? trim((string)$_GET['location']) : '';
            $operator = isset($_GET['operator']) ? trim((string)$_GET['operator']) : '';
            $q = isset($_GET['q']) ? trim((string)$_GET['q']) : '';

            $sql = "SELECT id, tool_code, tool_name, oem_specs, category_prefix, diameter_mm, instance_number,
                           current_status, current_location, assigned_operator, total_uses, created_at, updated_at
                    FROM tt_tool_instances WHERE 1=1";
            $params = array();

            if (!empty($status) && $status !== 'ALL') {
                $sql .= " AND current_status = :status";
                $params[':status'] = $status;
            }
            if (!empty($location) && $location !== 'ALL') {
                $sql .= " AND current_location = :location";
                $params[':location'] = $location;
            }
            if (!empty($operator)) {
                $sql .= " AND assigned_operator LIKE :operator";
                $params[':operator'] = '%' . $operator . '%';
            }
            if (!empty($q)) {
                $sql .= " AND (tool_code LIKE :q OR tool_name LIKE :q OR oem_specs LIKE :q)";
                $params[':q'] = '%' . $q . '%';
            }

            $sql .= " ORDER BY id DESC LIMIT 200";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $tools = $stmt->fetchAll();

            json_response(array('ok' => true, 'tools' => $tools));
        } catch (Exception $e) {
            json_response(array('ok' => false, 'error' => 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 3. UNRETURNED TOOLS (HANGING DEBT)
    // --------------------------------------------------------------------------
    if ($action === 'production_unreturned_tools') {
        try {
            $operator = isset($_GET['operator']) ? trim((string)$_GET['operator']) : '';
            
            $sql = "SELECT m.id AS movement_id, m.tool_instance_id, m.drawing_code, m.operator_name, m.programmer_name,
                           m.issued_at, m.issued_status, m.warehouse_staff, m.note,
                           t.tool_code, t.tool_name, t.oem_specs, t.diameter_mm, t.current_status
                    FROM tt_tool_movements m
                    JOIN tt_tool_instances t ON m.tool_instance_id = t.id
                    WHERE m.returned_at IS NULL";
            $params = array();

            if (!empty($operator) && $operator !== 'ALL') {
                $sql .= " AND m.operator_name = :operator";
                $params[':operator'] = $operator;
            }

            $sql .= " ORDER BY m.issued_at ASC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            // Calculate days held
            $nowTs = time();
            foreach ($rows as &$r) {
                $issuedTs = strtotime($r['issued_at']);
                $days = floor(($nowTs - $issuedTs) / 86400);
                $r['days_held'] = max(0, $days);
                $r['is_overdue'] = ($days >= 15);
            }
            unset($r);

            json_response(array('ok' => true, 'unreturned' => $rows));
        } catch (Exception $e) {
            json_response(array('ok' => false, 'error' => 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 4. CHECKOUT TOOL (XUAT CAP DAO CHO THO CNC)
    // --------------------------------------------------------------------------
    if ($action === 'production_tool_checkout') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(array('ok' => false, 'error' => 'Method not allowed'), 405);
        }

        $toolCode = isset($payload['tool_code']) ? trim((string)$payload['tool_code']) : '';
        $toolInstanceId = isset($payload['tool_instance_id']) ? (int)$payload['tool_instance_id'] : 0;
        $drawingCode = isset($payload['drawing_code']) ? trim((string)$payload['drawing_code']) : '';
        $operatorName = isset($payload['operator_name']) ? trim((string)$payload['operator_name']) : '';
        $programmerName = isset($payload['programmer_name']) ? trim((string)$payload['programmer_name']) : '';
        $issuedStatus = isset($payload['issued_status']) ? trim((string)$payload['issued_status']) : 'NEW';
        $warehouseStaff = isset($payload['warehouse_staff']) ? trim((string)$payload['warehouse_staff']) : (isset($user['name']) ? $user['name'] : 'Chị Điệp');
        $note = isset($payload['note']) ? trim((string)$payload['note']) : '';

        if (empty($drawingCode) || empty($operatorName)) {
            json_response(array('ok' => false, 'error' => 'Vui lòng nhập Mã bản vẽ và Tên kỹ thuật viên gá máy'), 422);
        }

        // Find tool
        if ($toolInstanceId > 0) {
            $stmt = $pdo->prepare("SELECT * FROM tt_tool_instances WHERE id = :id LIMIT 1");
            $stmt->execute(array(':id' => $toolInstanceId));
            $tool = $stmt->fetch();
        } else if (!empty($toolCode)) {
            $stmt = $pdo->prepare("SELECT * FROM tt_tool_instances WHERE tool_code = :code LIMIT 1");
            $stmt->execute(array(':code' => $toolCode));
            $tool = $stmt->fetch();
        } else {
            json_response(array('ok' => false, 'error' => 'Vui lòng cung cấp mã dao hoặc chọn dao cụ'), 422);
        }

        if (!$tool) {
            json_response(array('ok' => false, 'error' => 'Không tìm thấy thông tin dao cụ trong danh mục'), 404);
        }

        if ($tool['current_status'] === 'SCRAPPED') {
            json_response(array('ok' => false, 'error' => 'Dao này đã được đánh dấu HỦY/HỎNG trong kho, không thể xuất sử dụng!'), 422);
        }

        try {
            $pdo->beginTransaction();

            // Insert movement
            $stmtMove = $pdo->prepare("
                INSERT INTO tt_tool_movements (
                    tool_instance_id, drawing_code, operator_name, programmer_name,
                    issued_at, issued_status, warehouse_staff, note
                ) VALUES (
                    :tool_id, :drawing, :operator, :programmer,
                    :issued_at, :status, :warehouse, :note
                )
            ");
            $stmtMove->execute(array(
                ':tool_id' => $tool['id'],
                ':drawing' => $drawingCode,
                ':operator' => $operatorName,
                ':programmer' => $programmerName,
                ':issued_at' => $now,
                ':status' => $issuedStatus,
                ':warehouse' => $warehouseStaff,
                ':note' => $note
            ));
            $movementId = $pdo->lastInsertId();

            // Update tool instance
            $stmtTool = $pdo->prepare("
                UPDATE tt_tool_instances 
                SET current_location = 'CNC_SHOP',
                    assigned_operator = :operator,
                    current_status = :status,
                    total_uses = total_uses + 1
                WHERE id = :id
            ");
            $stmtTool->execute(array(
                ':operator' => $operatorName,
                ':status' => $issuedStatus,
                ':id' => $tool['id']
            ));

            $pdo->commit();

            json_response(array(
                'ok' => true,
                'message' => 'Cấp phát dao thành công cho ' . $operatorName,
                'movement_id' => $movementId,
                'tool_code' => $tool['tool_code']
            ));
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            json_response(array('ok' => false, 'error' => 'Lỗi cấp phát: ' . 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 5. CHECKIN TOOL (THU HOI & KIEM DINH DAO CNC)
    // --------------------------------------------------------------------------
    if ($action === 'production_tool_checkin') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(array('ok' => false, 'error' => 'Method not allowed'), 405);
        }

        $movementId = isset($payload['movement_id']) ? (int)$payload['movement_id'] : 0;
        $toolCode = isset($payload['tool_code']) ? trim((string)$payload['tool_code']) : '';
        $returnedStatus = isset($payload['returned_status']) ? trim((string)$payload['returned_status']) : 'OLD';
        $flankWearVb = isset($payload['flank_wear_vb_mm']) && $payload['flank_wear_vb_mm'] !== '' ? (float)$payload['flank_wear_vb_mm'] : null;
        $inspectorName = isset($payload['inspector_name']) ? trim((string)$payload['inspector_name']) : 'Cô Huyền';
        $warehouseStaff = isset($payload['warehouse_staff']) ? trim((string)$payload['warehouse_staff']) : (isset($user['name']) ? $user['name'] : 'Chị Điệp');
        $note = isset($payload['note']) ? trim((string)$payload['note']) : '';

        // Find active movement
        if ($movementId > 0) {
            $stmt = $pdo->prepare("SELECT * FROM tt_tool_movements WHERE id = :id LIMIT 1");
            $stmt->execute(array(':id' => $movementId));
            $movement = $stmt->fetch();
        } else if (!empty($toolCode)) {
            $stmt = $pdo->prepare("
                SELECT m.* FROM tt_tool_movements m
                JOIN tt_tool_instances t ON m.tool_instance_id = t.id
                WHERE t.tool_code = :code AND m.returned_at IS NULL
                ORDER BY m.id DESC LIMIT 1
            ");
            $stmt->execute(array(':code' => $toolCode));
            $movement = $stmt->fetch();
        } else {
            json_response(array('ok' => false, 'error' => 'Vui lòng cung cấp mã dao hoặc ID phiếu mượn'), 422);
        }

        if (!$movement) {
            json_response(array('ok' => false, 'error' => 'Không tìm thấy phiếu mượn dao đang mở hoặc dao đã được trả trước đó!'), 404);
        }

        try {
            $pdo->beginTransaction();

            $newLocation = ($returnedStatus === 'SCRAPPED') ? 'SCRAP_BIN' : 'WAREHOUSE';
            
            // Database-agnostic note concatenation
            $finalNote = !empty($movement['note']) && !empty($note) 
                ? ($movement['note'] . ' | Trả: ' . $note) 
                : (!empty($note) ? $note : $movement['note']);

            // 1. Update movement
            $stmtMove = $pdo->prepare("
                UPDATE tt_tool_movements 
                SET returned_at = :returned_at,
                    returned_status = :returned_status,
                    flank_wear_vb_mm = :vb,
                    inspector_name = :inspector,
                    note = :note
                WHERE id = :id
            ");
            $stmtMove->execute(array(
                ':returned_at' => $now,
                ':returned_status' => $returnedStatus,
                ':vb' => $flankWearVb,
                ':inspector' => $inspectorName,
                ':note' => $finalNote,
                ':id' => $movement['id']
            ));

            // 2. Update tool instance
            $stmtTool = $pdo->prepare("
                UPDATE tt_tool_instances 
                SET current_status = :status,
                    current_location = :loc,
                    assigned_operator = NULL
                WHERE id = :id
            ");
            $stmtTool->execute(array(
                ':status' => $returnedStatus,
                ':loc' => $newLocation,
                ':id' => $movement['tool_instance_id']
            ));

            $pdo->commit();

            json_response(array(
                'ok' => true,
                'message' => 'Đã nhận trả và kiểm định dao thành công (' . $returnedStatus . ')',
                'movement_id' => $movement['id'],
                'returned_status' => $returnedStatus
            ));
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            json_response(array('ok' => false, 'error' => 'Lỗi thu hồi dao: ' . 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 6. BATCH CHECKIN (THU HOI NHIEU DAO CUNG LUC - VI DU: ANH KIEN TRA 6 CON)
    // --------------------------------------------------------------------------
    if ($action === 'production_tool_batch_checkin') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(array('ok' => false, 'error' => 'Method not allowed'), 405);
        }

        $items = isset($payload['items']) && is_array($payload['items']) ? $payload['items'] : array();
        $inspectorName = isset($payload['inspector_name']) ? trim((string)$payload['inspector_name']) : 'Cô Huyền';
        $warehouseStaff = isset($payload['warehouse_staff']) ? trim((string)$payload['warehouse_staff']) : (isset($user['name']) ? $user['name'] : 'Chị Nhung');

        if (empty($items)) {
            json_response(array('ok' => false, 'error' => 'Danh sách trả rỗng'), 422);
        }

        try {
            $pdo->beginTransaction();
            $processed = 0;

            foreach ($items as $item) {
                $movementId = (int)$item['movement_id'];
                $retStatus = isset($item['returned_status']) ? $item['returned_status'] : 'OLD';
                $vb = isset($item['flank_wear_vb_mm']) && $item['flank_wear_vb_mm'] !== '' ? (float)$item['flank_wear_vb_mm'] : null;
                $itemNote = isset($item['note']) ? trim((string)$item['note']) : '';

                $stmt = $pdo->prepare("SELECT * FROM tt_tool_movements WHERE id = :id AND returned_at IS NULL LIMIT 1");
                $stmt->execute(array(':id' => $movementId));
                $mov = $stmt->fetch();
                if (!$mov) continue;

                $newLoc = ($retStatus === 'SCRAPPED') ? 'SCRAP_BIN' : 'WAREHOUSE';
                $finalItemNote = !empty($mov['note']) && !empty($itemNote)
                    ? ($mov['note'] . ' | Trả: ' . $itemNote)
                    : (!empty($itemNote) ? $itemNote : $mov['note']);

                $stmtUpMove = $pdo->prepare("
                    UPDATE tt_tool_movements
                    SET returned_at = :returned_at,
                        returned_status = :ret_status,
                        flank_wear_vb_mm = :vb,
                        inspector_name = :inspector,
                        note = :note
                    WHERE id = :id
                ");
                $stmtUpMove->execute(array(
                    ':returned_at' => $now,
                    ':ret_status' => $retStatus,
                    ':vb' => $vb,
                    ':inspector' => $inspectorName,
                    ':note' => $finalItemNote,
                    ':id' => $movementId
                ));

                $stmtUpTool = $pdo->prepare("
                    UPDATE tt_tool_instances
                    SET current_status = :status,
                        current_location = :loc,
                        assigned_operator = NULL
                    WHERE id = :id
                ");
                $stmtUpTool->execute(array(
                    ':status' => $retStatus,
                    ':loc' => $newLoc,
                    ':id' => $mov['tool_instance_id']
                ));

                $processed++;
            }

            $pdo->commit();

            json_response(array(
                'ok' => true,
                'message' => 'Đã hoàn tất thu hồi ' . $processed . ' dao cụ',
                'processed_count' => $processed
            ));
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            json_response(array('ok' => false, 'error' => 'Lỗi thu hồi lô: ' . 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 7. WIP MATERIALS LIST (VAT TU TU DONG HOA DO DANG)
    // --------------------------------------------------------------------------
    if ($action === 'production_wip_list') {
        try {
            $status = isset($_GET['status']) ? trim((string)$_GET['status']) : '';
            $project = isset($_GET['project']) ? trim((string)$_GET['project']) : '';
            $engineer = isset($_GET['engineer']) ? trim((string)$_GET['engineer']) : '';

            $sql = "SELECT w.*, p.sku, p.name_vn, p.unit
                    FROM tt_wip_materials w
                    LEFT JOIN tt_products p ON w.product_id = p.id
                    WHERE 1=1";
            $params = array();

            if (!empty($status) && $status !== 'ALL') {
                $sql .= " AND w.status = :status";
                $params[':status'] = $status;
            }
            if (!empty($project)) {
                $sql .= " AND w.project_code LIKE :project";
                $params[':project'] = '%' . $project . '%';
            }
            if (!empty($engineer)) {
                $sql .= " AND w.engineer_name LIKE :engineer";
                $params[':engineer'] = '%' . $engineer . '%';
            }

            $sql .= " ORDER BY w.id DESC LIMIT 100";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $list = $stmt->fetchAll();

            json_response(array('ok' => true, 'wip_list' => $list));
        } catch (Exception $e) {
            json_response(array('ok' => false, 'error' => 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 8. WIP ADVANCE (XUAT TAM UNG NGUYEN CUON 25M CHO TU DONG HOA)
    // --------------------------------------------------------------------------
    if ($action === 'production_wip_advance') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(array('ok' => false, 'error' => 'Method not allowed'), 405);
        }

        $projectCode = isset($payload['project_code']) ? trim((string)$payload['project_code']) : '';
        $engineerName = isset($payload['engineer_name']) ? trim((string)$payload['engineer_name']) : 'Anh Phong';
        $productId = isset($payload['product_id']) ? (int)$payload['product_id'] : 1;
        $advanceLength = isset($payload['advance_length_meters']) ? (float)$payload['advance_length_meters'] : 25.0;
        $parentWipId = isset($payload['parent_wip_id']) && (int)$payload['parent_wip_id'] > 0 ? (int)$payload['parent_wip_id'] : null;

        if (empty($projectCode) || empty($engineerName) || $advanceLength <= 0) {
            json_response(array('ok' => false, 'error' => 'Vui lòng nhập Mã dự án, Tên kỹ sư và Số mét tạm ứng (>0)'), 422);
        }

        // Generate advance code: ADV-YYYYMMDD-XXX
        $advanceCode = 'ADV-' . date('Ymd') . '-' . str_pad((string)mt_rand(1, 999), 3, '0', STR_PAD_LEFT);

        try {
            $stmt = $pdo->prepare("
                INSERT INTO tt_wip_materials (
                    advance_code, parent_wip_id, product_id, project_code, engineer_name,
                    advance_length_meters, status, rack_location, issued_at
                ) VALUES (
                    :code, :parent_id, :product_id, :project, :engineer,
                    :len, 'ADVANCED_TO_FLOOR', 'Phòng Tự Động Hóa - Đang thi công', :issued_at
                )
            ");
            $stmt->execute(array(
                ':code' => $advanceCode,
                ':parent_id' => $parentWipId,
                ':product_id' => $productId,
                ':project' => $projectCode,
                ':engineer' => $engineerName,
                ':len' => $advanceLength,
                ':issued_at' => $now
            ));
            $wipId = $pdo->lastInsertId();

            json_response(array(
                'ok' => true,
                'message' => 'Xuất tạm ứng cuộn nguyên thành công cho kỹ sư ' . $engineerName,
                'wip_id' => $wipId,
                'advance_code' => $advanceCode
            ));
        } catch (Exception $e) {
            json_response(array('ok' => false, 'error' => 'Lỗi xuất tạm ứng: ' . 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 9. WIP RETURN (HOAN TRA CUON LE REMNANT KHO TUDONG HOA - SOP-01)
    // --------------------------------------------------------------------------
    if ($action === 'production_wip_return') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(array('ok' => false, 'error' => 'Method not allowed'), 405);
        }

        $wipId = isset($payload['wip_id']) ? (int)$payload['wip_id'] : 0;
        $returnedLength = isset($payload['returned_length_meters']) ? (float)$payload['returned_length_meters'] : 0.0;
        $measurementMethod = isset($payload['measurement_method']) ? trim((string)$payload['measurement_method']) : 'LASER_MARKING';
        $rackLocation = isset($payload['rack_location']) && !empty($payload['rack_location']) ? trim((string)$payload['rack_location']) : 'Kệ Hàng Lẻ - Ngăn Remnant TĐH';

        if ($wipId <= 0) {
            json_response(array('ok' => false, 'error' => 'Vui lòng chọn phiếu tạm ứng cần hoàn trả'), 422);
        }

        $stmt = $pdo->prepare("SELECT * FROM tt_wip_materials WHERE id = :id AND status = 'ADVANCED_TO_FLOOR' LIMIT 1");
        $stmt->execute(array(':id' => $wipId));
        $wip = $stmt->fetch();

        if (!$wip) {
            json_response(array('ok' => false, 'error' => 'Không tìm thấy phiếu tạm ứng hoặc cuộn này đã hoàn tất chốt số liệu!'), 404);
        }

        $advanceLength = (float)$wip['advance_length_meters'];
        if ($returnedLength < 0 || $returnedLength > $advanceLength) {
            json_response(array('ok' => false, 'error' => 'Số mét hoàn trả không hợp lệ (0 <= Số mét trả <= ' . $advanceLength . 'm)'), 422);
        }

        $consumedLength = $advanceLength - $returnedLength;

        // SOP-01: If returned >= 2.0m -> Generate Remnant QR, status = RETURNED_REMNANT. If < 2m -> FULLY_CONSUMED (scrap)
        $remnantQr = null;
        $newStatus = 'FULLY_CONSUMED';
        if ($returnedLength >= 2.0) {
            $newStatus = 'RETURNED_REMNANT';
            $remnantQr = 'REM-' . date('Ymd') . '-' . str_pad((string)mt_rand(1, 999), 3, '0', STR_PAD_LEFT);
        }

        try {
            $stmtUp = $pdo->prepare("
                UPDATE tt_wip_materials
                SET returned_at = :ret_at,
                    returned_length_meters = :ret_len,
                    consumed_length_meters = :cons_len,
                    measurement_method = :meas,
                    status = :status,
                    remnant_qr_code = :qr,
                    rack_location = :loc
                WHERE id = :id
            ");
            $stmtUp->execute(array(
                ':ret_at' => $now,
                ':ret_len' => $returnedLength,
                ':cons_len' => $consumedLength,
                ':meas' => $measurementMethod,
                ':status' => $newStatus,
                ':qr' => $remnantQr,
                ':loc' => $rackLocation,
                ':id' => $wipId
            ));

            json_response(array(
                'ok' => true,
                'message' => 'Hoàn trả cuộn thành công! Chi phí thực dùng dự án ' . $wip['project_code'] . ': ' . $consumedLength . 'm (Hoàn kho remnant: ' . $returnedLength . 'm)',
                'consumed_length_meters' => $consumedLength,
                'returned_length_meters' => $returnedLength,
                'remnant_qr_code' => $remnantQr,
                'status' => $newStatus
            ));
        } catch (Exception $e) {
            json_response(array('ok' => false, 'error' => 'Lỗi hoàn trả vật tư: ' . 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    // --------------------------------------------------------------------------
    // 10. CNC OPERATORS DIRECTORY
    // --------------------------------------------------------------------------
    if ($action === 'production_operators_list') {
        try {
            // Count unreturned tools per operator
            $stmt = $pdo->query("
                SELECT operator_name, COUNT(*) as holding_tools
                FROM tt_tool_movements
                WHERE returned_at IS NULL
                GROUP BY operator_name
                ORDER BY holding_tools DESC
            ");
            $operators = $stmt->fetchAll();

            json_response(array('ok' => true, 'operators' => $operators));
        } catch (Exception $e) {
            json_response(array('ok' => false, 'error' => 'Không tải được dữ liệu Sản xuất'), 500);
        }
    }

    json_response(array('ok' => false, 'error' => 'Unknown production action: ' . htmlspecialchars((string)$action, ENT_QUOTES, 'UTF-8')), 404);
}
