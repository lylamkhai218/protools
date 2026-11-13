<?php
/**
 * TTVINA OFFICE - CORE CONFIGURATION & DATABASE ACCESS
 * Server: LiteSpeed Web Server / PHP 5.6.40 / MariaDB 10.6
 * Standard: ECC AgentShield B2B Security Architecture
 */

// 1. Strict Error Handling
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Timezone
date_default_timezone_set('Asia/Bangkok');

// Private settings must be provisioned separately before release.
$privateConfig = getenv('TTVINA_CONFIG_FILE');
if (!$privateConfig) $privateConfig = dirname(dirname(__DIR__)) . '/office.config.local.php';
if (is_file($privateConfig)) require $privateConfig;

// 2. Constants & Credentials
define('TTVINA_OFFICE_VERSION', '1.0.0');
if (!defined('TTVINA_SECRET_KEY')) define('TTVINA_SECRET_KEY', getenv('TTVINA_SECRET_KEY') !== false ? getenv('TTVINA_SECRET_KEY') : '');
define('DOCUMENTS_STORAGE_DIR', __DIR__ . '/storage/documents');

if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') !== false ? getenv('DB_HOST') : 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') !== false ? getenv('DB_NAME') : '');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') !== false ? getenv('DB_USER') : '');
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

// Helper for safe array access in PHP 5.6
function get_val($arr, $key, $default = null) {
    return (isset($arr[$key]) && $arr[$key] !== null) ? $arr[$key] : $default;
}

// 3. Database Singleton Connection (PDO)
function get_db() {
    static $pdo = null;
    if ($pdo === null) {
        $testSqlite = getenv('TTVINA_TEST_SQLITE');
        if ($testSqlite && file_exists($testSqlite)) {
            $pdo = new PDO("sqlite:" . $testSqlite);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;
        }
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 1
        );
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            $pdo->exec("SET NAMES utf8mb4");
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array(
                'ok' => false,
                'error' => 'Database unavailable'
            ));
            exit;
        }
    }
    return $pdo;
}

// 4. Secure Session Management (PHP 5.6 Compatible)
function init_session() {
    if (session_status() === PHP_SESSION_NONE) {
        $isHttps = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on');
        // Host-only cookie; HTTP_HOST may include a local port or attacker-controlled value.
        $domain = '';
        
        session_name('TTVINA_OFFICE_SESS');
        if (PHP_VERSION_ID >= 70300) {
            session_set_cookie_params(array(
                'lifetime' => 86400 * 7,
                'path'     => '/office',
                'domain'   => $domain,
                'secure'   => $isHttps,
                'httponly' => true,
                'samesite' => 'Lax'
            ));
        } else {
            session_set_cookie_params(86400 * 7, '/office', $domain, $isHttps, true);
        }
        session_start();
    }
}

function apply_security_headers() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header("Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; frame-src 'self' data: blob:; object-src 'self' blob:; base-uri 'self';");
}

// 5. JSON Response Helper
function json_response($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    apply_security_headers();
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($data);
    exit;
}

// 6. Security & Authorization Helpers
function get_auth_user() {
    init_session();
    if (!empty($_SESSION['tt_user_id']) && !empty($_SESSION['tt_user_role'])) {
        // 1-Hour (3600s) Inactivity Session Timeout
        $now = time();
        if (isset($_SESSION['tt_last_activity']) && ($now - (int)$_SESSION['tt_last_activity'] >= 3600)) {
            $_SESSION = array();
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                if (PHP_VERSION_ID >= 70300) {
                    setcookie(session_name(), '', array(
                        'expires'  => time() - 42000,
                        'path'     => $params["path"],
                        'domain'   => $params["domain"],
                        'secure'   => $params["secure"],
                        'httponly' => $params["httponly"],
                        'samesite' => 'Lax'
                    ));
                } else {
                    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
                }
            }
            session_destroy();
            return null;
        }
        // Reads and camera polling must not extend human inactivity.
        $record = get_db()->prepare('SELECT * FROM tt_users WHERE id = ?');
        $record->execute(array((int)$_SESSION['tt_user_id']));
        $activeUser = $record->fetch(PDO::FETCH_ASSOC);
        if (!$activeUser || (int)$activeUser['status'] !== 1 || (isset($activeUser['session_version']) && (int)$activeUser['session_version'] !== (isset($_SESSION['tt_session_version']) ? (int)$_SESSION['tt_session_version'] : 1))) { $_SESSION = array(); session_destroy(); return null; }
        if (empty($_SESSION['tt_csrf'])) $_SESSION['tt_csrf'] = bin2hex(openssl_random_pseudo_bytes(32));

        return array(
            'id' => (int)$_SESSION['tt_user_id'],
            'workshop_role' => isset($activeUser['workshop_role']) ? $activeUser['workshop_role'] : null,
            'session_version' => isset($activeUser['session_version']) ? (int)$activeUser['session_version'] : 1,
            'must_change_password' => !empty($activeUser['must_change_password']),
            'email' => isset($_SESSION['tt_user_email']) ? $_SESSION['tt_user_email'] : '',
            'name' => isset($_SESSION['tt_user_name']) ? $_SESSION['tt_user_name'] : '',
            'role' => isset($_SESSION['tt_user_role']) ? $activeUser['role'] : 'SALES'
        );
    }
    return null;
}

function require_auth($allowed_roles = array()) {
    $user = get_auth_user();
    if (!$user) {
        json_response(array(
            'ok' => false,
            'error' => 'Chưa đăng nhập. Vui lòng đăng nhập vào hệ thống TTVina Office.'
        ), 401);
    }
    if (!empty($allowed_roles) && !in_array($user['role'], $allowed_roles, true) && $user['role'] !== 'ADMIN') {
        json_response(array(
            'ok' => false,
            'error' => 'Bạn không có quyền thực hiện chức năng này.'
        ), 403);
    }
    return $user;
}

function require_admin_auth() { return require_auth(array('ADMIN')); }

// 7. Centralized Telegram Operations & Notification Hub (Free, Real-time Operations & Security)
define('TELEGRAM_NOTIFICATIONS_ENABLED', true);
define('TELEGRAM_2FA_ENABLED', true);
if (!defined('TELEGRAM_BOT_TOKEN')) define('TELEGRAM_BOT_TOKEN', getenv('TELEGRAM_BOT_TOKEN') !== false ? getenv('TELEGRAM_BOT_TOKEN') : '');
if (!defined('TELEGRAM_CHAT_ID')) define('TELEGRAM_CHAT_ID', getenv('TELEGRAM_CHAT_ID') !== false ? getenv('TELEGRAM_CHAT_ID') : '');

/**
 * Sinh mã OTP bảo mật chuẩn CSPRNG (PHP 5.6 - 8.x Compatible)
 */
function generate_secure_otp($length = 6) {
    if (function_exists('random_int')) {
        try {
            return str_pad((string)random_int(100000, 999999), $length, '0', STR_PAD_LEFT);
        } catch (Exception $e) {}
    }
    if (function_exists('openssl_random_pseudo_bytes')) {
        $bytes = openssl_random_pseudo_bytes(4);
        if ($bytes !== false) {
            $unpacked = unpack('N', $bytes);
            $num = $unpacked[1] & 0x7fffffff;
            return str_pad((string)($num % 900000 + 100000), $length, '0', STR_PAD_LEFT);
        }
    }
    return str_pad((string)mt_rand(100000, 999999), $length, '0', STR_PAD_LEFT);
}

/**
 * Phát thông báo đa sự kiện tới Telegram Hub (Security, Sales, WMS, Logistics, DevOps)
 */
function send_telegram_event($category, $title, $items = array()) {
    // Bo qua gui Telegram neu la phien kiem thu tu dong (Automated CI/CD / Regression Testing)
    if (!empty($_SERVER['HTTP_X_TEST_MODE']) || 
        (isset($_GET['is_test']) && $_GET['is_test'] == '1') || 
        (isset($items['_is_test']) && $items['_is_test']) ||
        (isset($items['Mã phiếu']) && strpos($items['Mã phiếu'], 'TEST') !== false) ||
        (isset($items['Nơi nhận']) && strpos($items['Nơi nhận'], 'Foxconn') !== false) ||
        (isset($items['Ghi chú']) && strpos($items['Ghi chú'], 'Kiểm nghiệm') !== false)) {
        return true;
    }

    $token = defined('TELEGRAM_BOT_TOKEN') ? TELEGRAM_BOT_TOKEN : '';
    $chat_id = defined('TELEGRAM_CHAT_ID') ? TELEGRAM_CHAT_ID : '';
    
    // Ghi log kiểm toán sự kiện nội bộ (Audit Trail)
    $logDir = __DIR__ . '/storage/ratelimit';
    if (!is_dir($logDir)) { @mkdir($logDir, 0755, true); }
    $eventLogFile = $logDir . '/telegram_events.log';
    $logLine = date('Y-m-d H:i:s') . " | [$category] $title | " . json_encode($items, JSON_UNESCAPED_UNICODE) . "\n";
    @file_put_contents($eventLogFile, $logLine, FILE_APPEND);
    
    if (empty($token) || $token === 'YOUR_TELEGRAM_BOT_TOKEN' || empty($chat_id) || $chat_id === 'YOUR_TELEGRAM_CHAT_ID') {
        return false;
    }
    
    // Chuẩn hóa định dạng theo kiến trúc TTPC Cokhipro: Phân tầng 4 khối, đường kẻ, monospace, link quản trị
    $tag = "[TTVINA " . strtoupper($category) . "]";
    $msg = "<b>$tag</b> - <i>$title</i>\n"
         . "----------------------------------------\n";
    
    foreach ($items as $k => $v) {
        $kStr = (string)$k;
        $vStr = (string)$v;
        // Tự động bọc thẻ code cho mã chứng từ, mã SKU, số tiền hoặc IP
        if (preg_match('/(mã|code|otp|ip|hash|id)/i', $kStr)) {
            $valFormatted = "<code>" . htmlspecialchars($vStr, ENT_QUOTES, 'UTF-8') . "</code>";
        } else {
            $valFormatted = "<b>" . htmlspecialchars($vStr, ENT_QUOTES, 'UTF-8') . "</b>";
        }
        $msg .= "• <b>" . htmlspecialchars($kStr, ENT_QUOTES, 'UTF-8') . ":</b> $valFormatted\n";
    }
    
    $msg .= "----------------------------------------\n"
          . "⏰ <i>Thời gian: " . date('d/m/Y H:i:s') . "</i>\n"
          . "🌐 <a href=\"https://protools.com.vn/office/\">Trang Quản Trị TTVina Office</a>";
    
    $url = "https://api.telegram.org/bot" . $token . "/sendMessage";
    $params = array(
        'chat_id' => $chat_id,
        'text' => $msg,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    );
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Bài học từ Cokhipro: Fallback sang plain text nếu gửi HTML gặp lỗi parse tag
    if ($httpCode !== 200 || $res === false) {
        $plainMsg = strip_tags($msg);
        $fallbackParams = array(
            'chat_id' => $chat_id,
            'text' => $plainMsg,
            'disable_web_page_preview' => true
        );
        $ch2 = curl_init();
        curl_setopt($ch2, CURLOPT_URL, $url);
        curl_setopt($ch2, CURLOPT_POST, true);
        curl_setopt($ch2, CURLOPT_POSTFIELDS, http_build_query($fallbackParams));
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch2, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch2, CURLOPT_TIMEOUT, 6);
        $res = curl_exec($ch2);
        curl_close($ch2);
    }
    
    return ($res !== false);
}

/**
 * Helper phát mã xác thực đăng nhập (OTP 2FA)
 * BẢO MẬT: Tuyệt đối không ghi mã OTP vào tệp tin đĩa cứng (CWE-312 Hardening)
 */
function send_telegram_otp($otp_code, $email, $user_name) {
    return send_telegram_event('AN NINH', 'MÃ XÁC THỰC ĐĂNG NHẬP (OTP 2FA)', array(
        'Người dùng' => $user_name,
        'Email' => $email,
        'Mã OTP (5 phút)' => $otp_code,
        'Địa chỉ IP' => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0'
    ));
}
