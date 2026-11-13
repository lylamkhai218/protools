<?php
/**
 * TTVINA OFFICE - AUTHENTICATION SERVICE (PHP 5.6+ Compatible)
 */

require_once __DIR__ . '/config.php';

function handle_auth_action($action) {
    if ($action === 'activity') {
        $user = require_auth();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(array('ok'=>false,'error'=>'Method not allowed'),405);
        if (empty($_SESSION['tt_csrf']) || empty($_SERVER['HTTP_X_CSRF_TOKEN']) || !hash_equals($_SESSION['tt_csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'])) json_response(array('ok'=>false,'error'=>'CSRF không hợp lệ'),403);
        $_SESSION['tt_last_activity'] = time();
        json_response(array('ok'=>true));
    }
    if ($action === 'login') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(array('ok' => false, 'error' => 'Method not allowed'), 405);
        }
        
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        if (!$payload) {
            $payload = $_POST;
        }
        
        $email = isset($payload['email']) ? trim((string)$payload['email']) : '';
        $password = isset($payload['password']) ? (string)$payload['password'] : '';
        
        if (empty($email) || empty($password)) {
            json_response(array('ok' => false, 'error' => 'Vui lòng nhập Email và Mật khẩu'), 422);
        }
        
        // Security Rate Limiter: Max 5 failed attempts per 15 mins per IP
        $clientIp = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
        $rateDir = __DIR__ . '/storage/ratelimit';
        if (!is_dir($rateDir)) {
            @mkdir($rateDir, 0755, true);
        }
        $rateFile = $rateDir . '/ip_' . md5($clientIp) . '.json';
        $now = time();
        $attempts = array();
        if (file_exists($rateFile)) {
            $rawAttempts = file_get_contents($rateFile);
            $parsed = json_decode($rawAttempts, true);
            if (is_array($parsed)) {
                foreach ($parsed as $ts) {
                    if ($now - $ts < 900) {
                        $attempts[] = $ts;
                    }
                }
            }
        }
        
        if (count($attempts) >= 5) {
            json_response(array(
                'ok' => false,
                'error' => 'Phát hiện quá nhiều lần đăng nhập không thành công. Để bảo vệ tài khoản, hệ thống tạm khóa IP trong 15 phút. Vui lòng thử lại sau.'
            ), 429);
        }
        
        $pdo = get_db();
        $stmt = $pdo->prepare("SELECT * FROM tt_users WHERE (email = :email OR employee_code = :employee) AND status = 1 LIMIT 1");
        $stmt->execute(array(':email' => $email, ':employee' => $email));
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password_hash'])) {
            $attempts[] = $now;
            @file_put_contents($rateFile, json_encode($attempts));
            json_response(array('ok' => false, 'error' => 'Email hoặc Mật khẩu không chính xác'), 401);
        }
        
        if ((int)$user['status'] !== 1) {
            json_response(array('ok' => false, 'error' => 'Tài khoản của bạn đang bị tạm khóa'), 403);
        }
        
        // Reset rate limit on success
        if (file_exists($rateFile)) {
            @unlink($rateFile);
        }
        
        // Check if Telegram 2FA is configured
        if (empty($user['workshop_role']) && defined('TELEGRAM_2FA_ENABLED') && TELEGRAM_2FA_ENABLED && defined('TELEGRAM_BOT_TOKEN') && TELEGRAM_BOT_TOKEN !== '' && TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
            $otp = generate_secure_otp(6);
            init_session();
            session_regenerate_id(true);
            $_SESSION['tt_2fa_pending'] = true;
            $_SESSION['tt_2fa_user_id'] = (int)$user['id'];
            $_SESSION['tt_2fa_user_email'] = $user['email'];
            $_SESSION['tt_2fa_user_name'] = $user['full_name'];
            $_SESSION['tt_2fa_user_role'] = $user['role'];
            $_SESSION['tt_2fa_session_version'] = isset($user['session_version']) ? (int)$user['session_version'] : 1;
            $_SESSION['tt_2fa_otp'] = $otp;
            $_SESSION['tt_2fa_expires'] = time() + 300;
            $_SESSION['tt_2fa_attempts'] = 0;
            $_SESSION['tt_2fa_last_resend'] = time();
            session_write_close();
            
            send_telegram_otp($otp, $user['email'], $user['full_name']);
            
            json_response(array(
                'ok' => true,
                'require_2fa' => true,
                'message' => 'Mã xác thực OTP 6 số đã được gửi qua Telegram. Vui lòng kiểm tra và nhập mã để hoàn tất đăng nhập.'
            ));
        }

        // Direct Login (Fallback if Telegram Bot not yet configured)
        init_session();
        session_regenerate_id(true);
        $_SESSION['tt_user_id'] = (int)$user['id'];
        $_SESSION['tt_user_email'] = $user['email'];
        $_SESSION['tt_user_name'] = $user['full_name'];
        $_SESSION['tt_user_role'] = $user['role'];
        $_SESSION['tt_last_activity'] = time();
        $_SESSION['tt_session_version'] = isset($user['session_version']) ? (int)$user['session_version'] : 1;
        $_SESSION['tt_csrf'] = bin2hex(openssl_random_pseudo_bytes(32));
        session_write_close();
        
        json_response(array(
            'ok' => true,
            'message' => 'Đăng nhập thành công!',
            'user' => array(
                'id' => (int)$user['id'],
                'email' => $user['email'],
                'name' => $user['full_name'],
                'role' => $user['role']
            )
        ));
    }
    
    if ($action === 'logout') {
        require_auth();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(array('ok'=>false,'error'=>'Method not allowed'),405);
        if (empty($_SESSION['tt_csrf']) || empty($_SERVER['HTTP_X_CSRF_TOKEN']) || !hash_equals($_SESSION['tt_csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'])) json_response(array('ok'=>false,'error'=>'CSRF không hợp lệ'),403);
        init_session();
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
        json_response(array('ok' => true, 'message' => 'Đã đăng xuất'));
    }
    
    if ($action === 'me') {
        $user = get_auth_user();
        if (!$user) {
            json_response(array('ok' => false, 'authenticated' => false), 401);
        }
        json_response(array(
            'ok' => true,
            'authenticated' => true,
            'user' => $user
        ));
    }

    if ($action === 'verify_2fa') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(array('ok' => false, 'error' => 'Method not allowed'), 405);
        }
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        if (!$payload) { $payload = $_POST; }
        
        $otp = isset($payload['otp']) ? trim((string)$payload['otp']) : '';
        if (empty($otp)) {
            json_response(array('ok' => false, 'error' => 'Vui lòng nhập mã OTP 6 số'), 422);
        }
        
        init_session();
        if (empty($_SESSION['tt_2fa_pending']) || empty($_SESSION['tt_2fa_otp'])) {
            json_response(array('ok' => false, 'error' => 'Phiên xác thực 2FA không hợp lệ hoặc đã kết thúc'), 401);
        }
        
        if (time() > (int)$_SESSION['tt_2fa_expires']) {
            unset($_SESSION['tt_2fa_pending'], $_SESSION['tt_2fa_otp'], $_SESSION['tt_2fa_expires'], $_SESSION['tt_2fa_user_id'], $_SESSION['tt_2fa_attempts']);
            session_write_close();
            json_response(array('ok' => false, 'error' => 'Mã OTP đã hết hạn sau 5 phút. Vui lòng đăng nhập lại.'), 422);
        }
        
        // Anti-Brute-Force Rate Limiting (CWE-307: Max 5 incorrect attempts before lockout)
        if (!isset($_SESSION['tt_2fa_attempts'])) {
            $_SESSION['tt_2fa_attempts'] = 0;
        }

        $validOtp = (string)$_SESSION['tt_2fa_otp'];
        if ($otp !== $validOtp) {
            $_SESSION['tt_2fa_attempts'] = (int)$_SESSION['tt_2fa_attempts'] + 1;
            if ($_SESSION['tt_2fa_attempts'] >= 5) {
                unset($_SESSION['tt_2fa_pending'], $_SESSION['tt_2fa_otp'], $_SESSION['tt_2fa_expires'], $_SESSION['tt_2fa_user_id'], $_SESSION['tt_2fa_attempts']);
                session_write_close();
                json_response(array(
                    'ok' => false,
                    'error' => 'Bạn đã nhập sai mã OTP quá 5 lần. Vì lý do an toàn, phiên xác thực đã bị khóa. Vui lòng đăng nhập lại từ đầu.'
                ), 429);
            }
            $remaining = 5 - (int)$_SESSION['tt_2fa_attempts'];
            json_response(array(
                'ok' => false,
                'error' => "Mã OTP không chính xác. Bạn còn $remaining lần thử."
            ), 401);
        }
        
        // 2FA Verified Successfully
        session_regenerate_id(true);
        $_SESSION['tt_user_id'] = (int)$_SESSION['tt_2fa_user_id'];
        $_SESSION['tt_user_email'] = $_SESSION['tt_2fa_user_email'];
        $_SESSION['tt_user_name'] = $_SESSION['tt_2fa_user_name'];
        $_SESSION['tt_user_role'] = $_SESSION['tt_2fa_user_role'];
        $_SESSION['tt_last_activity'] = time();
        $_SESSION['tt_session_version'] = isset($_SESSION['tt_2fa_session_version']) ? (int)$_SESSION['tt_2fa_session_version'] : 1;
        $_SESSION['tt_csrf'] = bin2hex(openssl_random_pseudo_bytes(32));
        
        $user = array(
            'id' => $_SESSION['tt_user_id'],
            'email' => $_SESSION['tt_user_email'],
            'name' => $_SESSION['tt_user_name'],
            'role' => $_SESSION['tt_user_role']
        );
        
        unset($_SESSION['tt_2fa_pending']);
        unset($_SESSION['tt_2fa_otp']);
        unset($_SESSION['tt_2fa_expires']);
        unset($_SESSION['tt_2fa_attempts']);
        unset($_SESSION['tt_2fa_user_id']);
        unset($_SESSION['tt_2fa_user_email']);
        unset($_SESSION['tt_2fa_user_name']);
        unset($_SESSION['tt_2fa_user_role']);
        session_write_close();
        
        json_response(array(
            'ok' => true,
            'message' => 'Xác thực 2FA thành công!',
            'user' => $user
        ));
    }
    
    if ($action === 'resend_2fa') {
        init_session();
        if (empty($_SESSION['tt_2fa_pending']) || empty($_SESSION['tt_2fa_user_email'])) {
            json_response(array('ok' => false, 'error' => 'Không tìm thấy phiên xác thực đang chờ'), 401);
        }

        // Anti-Spam Rate Limiting: Minimum 30s cooldown between OTP requests
        $now = time();
        if (isset($_SESSION['tt_2fa_last_resend']) && ($now - (int)$_SESSION['tt_2fa_last_resend'] < 30)) {
            $wait = 30 - ($now - (int)$_SESSION['tt_2fa_last_resend']);
            json_response(array('ok' => false, 'error' => "Vui lòng đợi $wait giây trước khi yêu cầu gửi lại mã OTP."), 429);
        }
        
        $otp = generate_secure_otp(6);
        $_SESSION['tt_2fa_otp'] = $otp;
        $_SESSION['tt_2fa_expires'] = time() + 300;
        $_SESSION['tt_2fa_last_resend'] = $now;
        $_SESSION['tt_2fa_attempts'] = 0;
        
        send_telegram_otp($otp, $_SESSION['tt_2fa_user_email'], $_SESSION['tt_2fa_user_name']);
        session_write_close();
        
        json_response(array(
            'ok' => true,
            'message' => 'Đã gửi lại mã OTP mới qua Telegram!'
        ));
    }
}

// Support direct invocation of auth.php as standalone entrypoint
$script_base = basename(isset($_SERVER['SCRIPT_FILENAME']) ? (string)$_SERVER['SCRIPT_FILENAME'] : '');
$php_self_base = basename(isset($_SERVER['PHP_SELF']) ? (string)$_SERVER['PHP_SELF'] : '');
if ($script_base === 'auth.php' || $php_self_base === 'auth.php') {
    $direct_action = isset($_GET['action']) ? (string)$_GET['action'] : '';
    if (!empty($direct_action)) {
        handle_auth_action($direct_action);
    }
}
