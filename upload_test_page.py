import ftplib
import os
import io

FTP_HOST = "s2d34.cloudnetwork.vn"
FTP_USER = "deploy@protools.com.vn"
FTP_PASS = "CongtyTTVN@2026"

html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROTOOLS TEST DEPLOYMENT OK</title>
    <style>
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1rem;
            text-align: center;
        }
        .card {
            background: #1e293b;
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            border: 1px solid #334155;
            max-width: 550px;
            width: 100%;
        }
        .badge {
            background: #10b981;
            color: #022c22;
            font-weight: 700;
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        h1 { color: #38bdf8; font-size: 1.75rem; margin-top: 1.25rem; font-weight: 800; }
        p { color: #94a3b8; font-size: 1rem; line-height: 1.6; }
        .time { color: #f59e0b; font-weight: 600; font-size: 0.9rem; margin-top: 1.5rem; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">FTP TEST SUCCESSFUL</span>
        <h1>Protools Test Deployment Page</h1>
        <p>Kết nối đồng bộ mã nguồn tự động qua FTP <strong>deploy@protools.com.vn</strong> hoạt động hoàn hảo!</p>
        <p class="time">Thời gian đồng bộ thử nghiệm: 30/07/2026 (T&T Vina Industrial Co., Ltd)</p>
    </div>
</body>
</html>
"""

def upload_test():
    print("Connecting to FTP server...")
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    print("FTP Logged in successfully!")

    # Try creating test directory under public_html
    try:
        ftp.mkd("public_html/test")
        print("Created directory: public_html/test")
    except Exception as e:
        print(f"Directory info: {e}")

    # Upload index.html inside test folder
    ftp.cwd("public_html/test")
    bio = io.BytesIO(html_content.encode('utf-8'))
    ftp.storbinary("STOR index.html", bio)
    print("Uploaded public_html/test/index.html")

    # Also upload test.html directly in public_html
    ftp.cwd("/public_html")
    bio2 = io.BytesIO(html_content.encode('utf-8'))
    ftp.storbinary("STOR test.html", bio2)
    print("Uploaded public_html/test.html")

    ftp.quit()
    print("Test upload completed successfully!")

if __name__ == "__main__":
    upload_test()
