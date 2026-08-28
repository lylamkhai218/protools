import ftplib
import io

FTP_HOST = "s2d34.cloudnetwork.vn"
FTP_USER = "deploy@protools.com.vn"
FTP_PASS = "CongtyTTVN@2026"

def upload():
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.cwd("/public_html")

    # Upload test.txt
    txt_content = b"PROTOOLS_TXT_TEST_OK_2026 - Sync status: VERIFIED SUCCESSFUL"
    ftp.storbinary("STOR test.txt", io.BytesIO(txt_content))

    # Upload test.php
    php_content = """<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>PROTOOLS TEST PAGE OK</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #38bdf8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .box { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; text-align: center; }
        .ok { color: #10b981; font-weight: bold; }
    </style>
</head>
<body>
    <div class="box">
        <h2 class="ok">✅ FTPS SYNC & DEPLOYMENT TEST OK!</h2>
        <p>Mã nguồn trang thử nghiệm đã được đẩy thành công lên server <strong>protools.com.vn</strong></p>
        <p style="color: #94a3b8; font-size: 0.9rem;">Thời gian đồng bộ: <?php echo date('Y-m-d H:i:s'); ?></p>
    </div>
</body>
</html>
"""
    ftp.storbinary("STOR test.php", io.BytesIO(php_content.encode('utf-8')))

    ftp.quit()
    print("Uploaded test.txt and test.php successfully!")

if __name__ == "__main__":
    upload()
