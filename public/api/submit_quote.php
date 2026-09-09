<?php
/**
 * PROTOOLS.COM.VN — B2B RFQ QUOTE SUBMISSION API ENDPOINT
 * Standard: ECC AgentShield Security Standard (Anti-XSS, Anti-SQLi, Rate Limiting, Honeypot)
 * Database Target: MariaDB 10.6 `prod2e4e_db` -> Table `contact_list`
 * Compatible: PHP 5.4+ through PHP 8.x
 */

error_reporting(0);
ini_set('display_errors', '0');

function get_field($arr, $key, $default = '') {
    return (isset($arr[$key]) && $arr[$key] !== null) ? $arr[$key] : $default;
}

// 1. CORS & Response Headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed_origins = array(
    'https://protools.com.vn',
    'https://www.protools.com.vn',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000'
);

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    header("Access-Control-Allow-Origin: https://protools.com.vn");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('success' => false, 'message' => 'Chỉ chấp nhận phương thức POST.'));
    exit;
}

// 2. Client IP Resolution
$client_ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip_list = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $client_ip = trim($ip_list[0]);
}

// 3. Rate Limiting (Max 5 submissions per 60s per IP)
$rate_limit_dir = sys_get_temp_dir() . '/protools_rate_limits';
if (!is_dir($rate_limit_dir)) {
    @mkdir($rate_limit_dir, 0755, true);
}
$rate_limit_file = $rate_limit_dir . '/rl_' . md5($client_ip) . '.json';
$now = time();

if (file_exists($rate_limit_file)) {
    $rl_data = json_decode(@file_get_contents($rate_limit_file), true);
    if ($rl_data && is_array($rl_data)) {
        $valid_requests = array();
        foreach ($rl_data as $ts) {
            if (($now - $ts) < 60) {
                $valid_requests[] = $ts;
            }
        }

        if (count($valid_requests) >= 5) {
            http_response_code(429);
            echo json_encode(array(
                'success' => false,
                'message' => 'Quý khách đã gửi yêu cầu quá nhanh. Vui lòng đợi 1 phút hoặc liên hệ Hotline 0943.301.886.'
            ));
            exit;
        }
        $valid_requests[] = $now;
        @file_put_contents($rate_limit_file, json_encode($valid_requests));
    } else {
        @file_put_contents($rate_limit_file, json_encode(array($now)));
    }
} else {
    @file_put_contents($rate_limit_file, json_encode(array($now)));
}

// 4. Parse JSON Input
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => 'Dữ liệu yêu cầu không đúng định dạng JSON.'));
    exit;
}

// 5. Anti-Spam Honeypot Check
if (!empty($data['hp_fax'])) {
    usleep(500000);
    echo json_encode(array('success' => true, 'message' => 'Đã tiếp nhận yêu cầu thành công.'));
    exit;
}

// 6. Sanitize & Validate Form Data
$company_name = htmlspecialchars(strip_tags(trim(get_field($data, 'companyName'))), ENT_QUOTES, 'UTF-8');
$contact_name = htmlspecialchars(strip_tags(trim(get_field($data, 'contactName'))), ENT_QUOTES, 'UTF-8');
$phone        = preg_replace('/[^0-9+]/', '', trim(get_field($data, 'phone')));
$email        = filter_var(trim(get_field($data, 'email')), FILTER_SANITIZE_EMAIL);
$factory_loc  = htmlspecialchars(strip_tags(trim(get_field($data, 'factoryLocation'))), ENT_QUOTES, 'UTF-8');
$project_note = htmlspecialchars(strip_tags(trim(get_field($data, 'projectNote'))), ENT_QUOTES, 'UTF-8');
$items        = (isset($data['items']) && is_array($data['items'])) ? $data['items'] : array();

if (empty($company_name) || empty($contact_name) || empty($phone)) {
    http_response_code(422);
    echo json_encode(array('success' => false, 'message' => 'Vui lòng điền đủ Tên Công Ty, Người Liên Hệ và Số Điện Thoại.'));
    exit;
}

if (!preg_match('/^(0|84)(3|5|7|8|9)[0-9]{8}$/', $phone)) {
    http_response_code(422);
    echo json_encode(array('success' => false, 'message' => 'Số điện thoại không hợp lệ (cần 10 chữ số di động).'));
    exit;
}

// 7. Format Quotation Content (HTML for Database AdminCP & Plain-text for Email)
$full_address = $company_name;
if (!empty($factory_loc)) {
    $full_address .= " (Khu vực / Nhà máy: " . $factory_loc . ")";
}

$title_summary = "Báo giá B2B Cart (" . count($items) . " thiết bị): " . $company_name;
$now_db_time = date('YmdHis');

// 7.1. HTML Content for MariaDB `contact_list.content` (Rendered cleanly in AdminCP)
// Snippet for AdminCP list view (strip_tags)
$content_html = '<span style="display:none;">Báo giá B2B (' . count($items) . ' thiết bị): ' . $company_name . ' | </span>';
$content_html .= '<div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #1e293b; line-height: 1.4; margin: 0; padding: 0;">';

$content_html .= '<table style="width: 100%; max-width: 650px; border-collapse: collapse; margin-top: 2px; font-size: 12px; background: #ffffff;" border="1" cellpadding="6" cellspacing="0" bordercolor="#cbd5e1">';
$content_html .= '<thead>';
$content_html .= '<tr style="background: #f1f5f9; color: #334155; font-weight: bold; font-size: 12px;">';
$content_html .= '<th style="width: 35px; text-align: center; padding: 6px 4px; border: 1px solid #cbd5e1;">STT</th>';
$content_html .= '<th style="width: 120px; text-align: left; padding: 6px 8px; border: 1px solid #cbd5e1;">Mã SKU</th>';
$content_html .= '<th style="text-align: left; padding: 6px 8px; border: 1px solid #cbd5e1;">Tên Thiết Bị & Thương Hiệu</th>';
$content_html .= '<th style="width: 50px; text-align: center; padding: 6px 4px; border: 1px solid #cbd5e1;">SL</th>';
$content_html .= '<th style="width: 120px; text-align: right; padding: 6px 8px; border: 1px solid #cbd5e1;">Đơn giá</th>';
$content_html .= '</tr>';
$content_html .= '</thead>';
$content_html .= '<tbody>';

foreach ($items as $idx => $it) {
    $stt = $idx + 1;
    $sku = htmlspecialchars(strip_tags(get_field($it, 'sku', 'N/A')), ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars(strip_tags(get_field($it, 'name', 'Thiết bị')), ENT_QUOTES, 'UTF-8');
    $brand = htmlspecialchars(strip_tags(get_field($it, 'brand', '')), ENT_QUOTES, 'UTF-8');
    $qty = intval(get_field($it, 'quantity', 1));
    $price = htmlspecialchars(strip_tags(get_field($it, 'price', 'Liên hệ Báo giá')), ENT_QUOTES, 'UTF-8');
    $row_bg = ($idx % 2 === 1) ? 'background: #fafafa;' : 'background: #ffffff;';

    $content_html .= '<tr style="' . $row_bg . '">';
    $content_html .= '<td style="text-align: center; padding: 6px 4px; border: 1px solid #cbd5e1; color: #64748b;">' . $stt . '</td>';
    $content_html .= '<td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold; color: #005BAC;">' . $sku . '</td>';
    $content_html .= '<td style="padding: 6px 8px; border: 1px solid #cbd5e1;">';
    $content_html .= '<div style="font-weight: 600; color: #0f172a;">' . $name . '</div>';
    if (!empty($brand)) {
        $content_html .= '<div style="font-size: 11px; color: #64748b;">Hãng: ' . $brand . '</div>';
    }
    $content_html .= '</td>';
    $content_html .= '<td style="text-align: center; padding: 6px 4px; border: 1px solid #cbd5e1; font-weight: bold; font-size: 13px; color: #0f172a;">' . $qty . '</td>';
    $content_html .= '<td style="text-align: right; padding: 6px 8px; border: 1px solid #cbd5e1; color: #b91c1c; font-weight: 500;">' . $price . '</td>';
    $content_html .= '</tr>';
}

$content_html .= '</tbody>';
$content_html .= '</table>';

if (!empty($project_note)) {
    $content_html .= '<div style="margin-top: 8px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 3px; font-size: 12px; color: #334155;">';
    $content_html .= '<b>Ghi chú dự án:</b> ' . htmlspecialchars($project_note, ENT_QUOTES, 'UTF-8');
    $content_html .= '</div>';
}

$content_html .= '<div style="clear: both; height: 1px; line-height: 1px; font-size: 1px;">&nbsp;</div>';
$content_html .= '</div>';

// 7.2. Clean Plain Text for Email Alert to Sales Team
$email_body = "YÊU CẦU BÁO GIÁ B2B TỪ WEBSITE PROTOOLS.COM.VN\n\n";
$email_body .= "Doanh Nghiệp     : " . $company_name . "\n";
$email_body .= "Người Liên Hệ    : " . $contact_name . "\n";
$email_body .= "Số Điện Thoại    : " . $phone . "\n";
$email_body .= "Email            : " . ($email ? $email : "Chưa cung cấp") . "\n";
$email_body .= "Địa Điểm Giao    : " . ($factory_loc ? $factory_loc : "Chưa chỉ định") . "\n";
$email_body .= "Ghi Chú Dự Án    : " . ($project_note ? $project_note : "Không có ghi chú thêm") . "\n\n";
$email_body .= "DANH MỤC THIẾT BỊ YÊU CẦU BÁO GIÁ (" . count($items) . " MỤC):\n";

foreach ($items as $idx => $it) {
    $stt = $idx + 1;
    $sku = htmlspecialchars(strip_tags(get_field($it, 'sku', 'N/A')), ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars(strip_tags(get_field($it, 'name', 'Thiết bị')), ENT_QUOTES, 'UTF-8');
    $brand = htmlspecialchars(strip_tags(get_field($it, 'brand', '')), ENT_QUOTES, 'UTF-8');
    $qty = intval(get_field($it, 'quantity', 1));
    $price = htmlspecialchars(strip_tags(get_field($it, 'price', 'Liên hệ Báo giá')), ENT_QUOTES, 'UTF-8');

    $email_body .= sprintf("  %d. [%s] %s%s\n     Số lượng: %d | Giá tham khảo: %s\n\n", 
        $stt, 
        $sku, 
        $name, 
        (!empty($brand) ? " (" . $brand . ")" : ""), 
        $qty, 
        $price
    );
}

$email_body .= "Xem và xử lý tại AdminCP: https://protools.com.vn/admincp/#contact\n";

// 8. Database Insert into `contact_list` (MariaDB `prod2e4e_db`)
$db_host = 'localhost';
$db_name = 'prod2e4e_db';
$db_user = 'prod2e4e_user';
$db_pass = 'z2zxs5_B).9g';

$db_saved = false;
$db_error = '';

try {
    $dsn = "mysql:host=" . $db_host . ";dbname=" . $db_name . ";charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ));

    // Nâng cấp cột content lên MEDIUMTEXT nếu cần
    try {
        $pdo->exec("ALTER TABLE contact_list MODIFY COLUMN content MEDIUMTEXT");
    } catch (Exception $ex_alter) {
        // Bỏ qua nếu đã là MEDIUMTEXT hoặc tài khoản không có quyền ALTER
    }

    $stmt = $pdo->prepare("
        INSERT INTO contact_list (
            fullname,
            phone,
            email,
            address,
            title,
            content,
            create_time,
            ip_address,
            status
        ) VALUES (
            :fullname,
            :phone,
            :email,
            :address,
            :title,
            :content,
            :create_time,
            :ip_address,
            0
        )
    ");

    $stmt->execute(array(
        ':fullname'    => $contact_name,
        ':phone'       => $phone,
        ':email'       => $email,
        ':address'     => $full_address,
        ':title'       => $title_summary,
        ':content'     => $content_html,
        ':create_time' => $now_db_time,
        ':ip_address'  => $client_ip
    ));

    $db_saved = true;
} catch (Exception $ex) {
    $db_error = $ex->getMessage();
    error_log("[PROTOOLS API ERROR] Không thể ghi vào bảng contact_list: " . $db_error);
}

// 9. Send Email Alert to Sales Team
$notify_email = 'info@t2tvina.com';
$email_subject = "=?UTF-8?B?" . base64_encode("[Protools B2B] Don Bao Gia Moi: " . $company_name) . "?=";
$email_headers = "From: noreply@protools.com.vn\r\n" .
                 "Reply-To: " . ($email ? $email : 'info@t2tvina.com') . "\r\n" .
                 "MIME-Version: 1.0\r\n" .
                 "Content-Type: text/plain; charset=UTF-8\r\n" .
                 "X-Mailer: Protools RFQ Engine/1.0";

@mail($notify_email, $email_subject, $email_body, $email_headers);

// 10. Return Response to Client
if ($db_saved) {
    echo json_encode(array(
        'success' => true,
        'message' => 'Yêu cầu báo giá của quý công ty đã được chuyển thành công đến phòng kinh doanh T&T Vina. Kỹ sư phụ trách sẽ liên hệ phản hồi trong 15-30 phút.'
    ));
} else {
    echo json_encode(array(
        'success' => true,
        'message' => 'Yêu cầu báo giá đã được tiếp nhận. Đội ngũ T&T Vina sẽ liên hệ ngay theo số điện thoại ' . $phone . '.'
    ));
}
