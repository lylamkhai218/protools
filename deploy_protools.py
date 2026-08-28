import os
import sys
import ftplib
import subprocess
from backup_protools import create_production_backup

FTP_HOST = "s2d34.cloudnetwork.vn"
FTP_USER = "deploy@protools.com.vn"
FTP_PASS = "CongtyTTVN@2026"
REMOTE_ROOT = "public_html/murrplastik"
LOCAL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def ensure_remote_dir(ftp, remote_path):
    dirs = remote_path.split("/")
    path = ""
    for d in dirs:
        if not d:
            continue
        path += "/" + d
        try:
            ftp.cwd(path)
        except ftplib.error_perm:
            try:
                ftp.mkd(path)
            except Exception:
                pass

def deploy_protools():
    print("=" * 70)
    print("🚀 PROTOOLS MURRPLASTIK SUBPAGE RELEASE ENGINE")
    print("Target Web    : https://protools.com.vn/murrplastik")
    print(f"Target Server : {FTP_HOST} ({REMOTE_ROOT})")
    print("=" * 70)

    if "--confirm" not in sys.argv:
        print("\n[SAFETY CONTROL] Bạn sắp thực hiện phát hành trang con Murrplastik lên Production.")
        print("Các bước hệ thống sẽ tự động thực hiện:")
        print("  1. Thực hiện pnpm build để đóng gói sản phẩm React tĩnh.")
        print("  2. Upload toàn bộ bundle mới vào thư mục public_html/murrplastik trên Mắt Bão.")
        print("  3. Cấu hình file .htaccess cục bộ cho SPA routing tại /murrplastik/.")
        print("\nĐể thực hiện deploy, chạy lệnh:")
        print("   pnpm deploy:protools")
        print("   HOẶC: python deploy_protools.py --confirm")
        print("=" * 70)
        sys.exit(0)

    # Step 1: Build verification
    print("\n🛠️ STEP 1/2: Đóng gói dự án bằng Vite (npx vite build)...")
    res = subprocess.run(["npx", "vite", "build"], shell=True)
    if res.returncode != 0:
        print("[FATAL ERROR] Lỗi pnpm build. Hủy bỏ quá trình deploy.")
        sys.exit(1)

    # Step 2: Deploy to Murrplastik Subfolder
    print(f"\n🌐 STEP 2/2: Tải toàn bộ tài nguyên lên Server ({REMOTE_ROOT})...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, 21, timeout=15)
    ftp.login(FTP_USER, FTP_PASS)
    print("FTP Connected successfully!")

    uploaded_count = 0
    for root, dirs, files in os.walk(LOCAL_DIR):
        rel_path = os.path.relpath(root, LOCAL_DIR)
        if rel_path == ".":
            target_remote_dir = REMOTE_ROOT
        else:
            target_remote_dir = f"{REMOTE_ROOT}/{rel_path.replace('\\', '/')}"
        
        ensure_remote_dir(ftp, target_remote_dir)
        ftp.cwd(f"/{target_remote_dir}")

        for file in files:
            local_file_path = os.path.join(root, file)
            print(f"  [UPLOADING] {file} -> /{target_remote_dir}...")
            with open(local_file_path, "rb") as f:
                ftp.storbinary(f"STOR {file}", f)
            uploaded_count += 1

    # Ensure .htaccess for SPA routing in /murrplastik/
    htaccess_content = """DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /murrplastik/
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /murrplastik/index.html [L]
</IfModule>
"""
    htaccess_path = os.path.join(LOCAL_DIR, ".htaccess")
    with open(htaccess_path, "w", encoding="utf-8") as f:
        f.write(htaccess_content)
    
    try:
        ftp.cwd(f"/{REMOTE_ROOT}")
        try:
            ftp.sendcmd("SITE CHMOD 644 .htaccess")
        except Exception:
            pass
        with open(htaccess_path, "rb") as f:
            ftp.storbinary("STOR .htaccess", f)
        uploaded_count += 1
        print("  [CONFIGURED] .htaccess SPA Routing")
    except Exception as e:
        print(f"  [NOTE] .htaccess skipped or restricted on FTP: {e}")

    ftp.quit()

    print("\n" + "=" * 70)
    print("🎉 DEPLOY PROTOOLS THÀNH CÔNG RỰC RỠ!")
    print(f"Tổng số file đã đẩy lên : {uploaded_count}")
    print(f"Trang chủ Production     : https://protools.com.vn/")
    print("=" * 70)

if __name__ == "__main__":
    deploy_protools()
