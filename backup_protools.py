import os
import sys
import ftplib
import zipfile
from datetime import datetime

FTP_HOST = "s2d34.cloudnetwork.vn"
FTP_USER = "deploy@protools.com.vn"
FTP_PASS = "CongtyTTVN@2026"
REMOTE_ROOT = "public_html"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKUP_DIR = os.path.join(BASE_DIR, "backups")

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def create_production_backup():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_folder_name = f"protools_backup_{timestamp}"
    local_backup_path = os.path.join(BACKUP_DIR, backup_folder_name)
    os.makedirs(local_backup_path, exist_ok=True)
    
    print("=" * 70)
    print("🛡️  PROTOOLS AUTOMATED BACKUP ENGINE")
    print(f"Timestamp: {timestamp}")
    print(f"Target Remote Path: /{REMOTE_ROOT}")
    print(f"Destination Local Path: {local_backup_path}")
    print("=" * 70)

    print(f"\n[1/3] Connecting to FTP {FTP_HOST}...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, 21, timeout=15)
    ftp.login(FTP_USER, FTP_PASS)
    print("FTP Connected successfully!")

    downloaded_files = 0

    def download_remote_dir(remote_dir, local_dir):
        nonlocal downloaded_files
        try:
            ftp.cwd("/" + remote_dir)
            items = []
            ftp.retrlines("LIST", items.append)
            
            for item in items:
                parts = item.split(maxsplit=8)
                if len(parts) < 9:
                    continue
                permissions = parts[0]
                name = parts[8]
                if name in [".", ".."]:
                    continue
                
                full_remote_path = f"{remote_dir}/{name}"
                full_local_path = os.path.join(local_dir, name)
                is_dir = permissions.startswith("d")

                if is_dir:
                    os.makedirs(full_local_path, exist_ok=True)
                    download_remote_dir(full_remote_path, full_local_path)
                else:
                    os.makedirs(os.path.dirname(full_local_path), exist_ok=True)
                    print(f"  [DOWNLOADING] /{full_remote_path} -> {name}")
                    with open(full_local_path, "wb") as f:
                        ftp.retrbinary(f"RETR /{full_remote_path}", f.write)
                    downloaded_files += 1
        except Exception as e:
            print(f"  [ERROR] Downloading {remote_dir}: {e}")

    print("\n[2/3] Archiving all Production files & directories...")
    download_remote_dir(REMOTE_ROOT, local_backup_path)
    ftp.quit()

    print("\n[3/3] Compressing backup folder into ZIP archive...")
    zip_path = os.path.join(BACKUP_DIR, f"{backup_folder_name}.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(local_backup_path):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, local_backup_path)
                zipf.write(file_path, arcname)

    print("\n" + "=" * 70)
    print("✅ PROTOOLS BACKUP COMPLETED SUCCESSFULLY!")
    print(f"Total Files Saved : {downloaded_files}")
    print(f"Local Backup Directory : {local_backup_path}")
    print(f"Rollback ZIP Archive  : {zip_path}")
    print("=" * 70)
    return zip_path, local_backup_path

if __name__ == "__main__":
    create_production_backup()
