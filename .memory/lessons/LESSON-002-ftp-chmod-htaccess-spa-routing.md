# LESSON-002: Xử lý Lỗi 553 Permission Denied khi Ghi .htaccess qua FTP

* **Ngày ghi nhận:** 28/08/2026
* **Hệ thống:** Mắt Bão Cloud Network (LiteSpeed Web Server)

## Hiện tượng & Nguyên nhân
- Khi upload file .htaccess lên public_html qua giao thức FTP, máy chủ trả về mã lỗi 553 Can't open that file: Permission denied.
- Nguyên nhân do file .htaccess cũ trên hosting được đặt cờ quyền 444 (Read-only).

## Giải pháp kỹ thuật
- Gửi lệnh FTP SITE CHMOD 644 .htaccess trước khi thực thi lệnh STOR .htaccess.
- Đã tích hợp sẵn vào [deploy_protools.py](file:///d:/T&TVina/protools/deploy_protools.py).