# MISTAKE-002: Lộ Mật Khẩu FTP Ghi Cứng & Để Tồn Lưu Bề Mặt PHP Di Sản (2014) Trên Webroot

* **Ngày phát hiện**: 13/11/2026
* **Mức độ nghiêm trọng**: CRITICAL
* **Hệ quả thực tế**: Tin tặc nước ngoài đăng nhập FTP tải bộ Phishing ngân hàng châu Âu (`/Assurance-Retraite/`, `/vb/`, `/zt/`) lên `/public_html`, khiến Google Safe Browsing khóa cảnh báo đỏ tên miền `protools.com.vn`.

---

## 1. Sai Lầm Kỹ Thuật Gốc (Root Mistakes)

1. **Ghi cứng thông tin xác thực FTP trong script Python (`scripts/ftps_client.py` & `deploy_*.py`)**:
   - Dù đã chuyển sang giao thức mã hóa kênh truyền FTPS Explicit (`AUTH TLS` + `PROT P`), việc để giá trị mặc định của `FTP_PASS` bằng văn bản thuần trong mã nguồn dẫn đến nguy cơ rò rỉ thông tin đăng nhập. Khi mật khẩu lộ, mọi lớp tường lửa HTTP (Imunify360 / ModSecurity) đều bị vô hiệu vì kẻ tấn công đi thẳng bằng tài khoản hợp lệ qua cổng 21.
2. **Giả định sai rằng SPA `.htaccess` đã che khuất các file PHP cũ năm 2014**:
   - Quy tắc `RewriteCond %{REQUEST_FILENAME} !-f` trong `.htaccess` chỉ chuyển hướng về `index.html` khi file **không tồn tại vật lý**. Do các file từ năm 2014 (`reg.php`, `lostpassword.php`, `cart.php`, `profile/index.php`, `admincp/upload_image_ckeditor.php`) và file `error_log` (646 MB), `kho/index.php.bak_pre_batch` vẫn nằm trên đĩa, bất kỳ ai gọi đúng tên file đều kích hoạt thực thi PHP cũ hoặc tải về toàn bộ mã nguồn/nhật ký lỗi.

---

## 2. Biện Pháp Phòng Ngừa Vĩnh Viễn (Never Repeat Rules)

1. **Cách ly tuyệt đối Secret**: Chỉ đọc `FTP_PASS` từ `.env.deploy` (nằm trong `.gitignore`). Nếu thiếu biến môi trường, script phải dừng ngay và báo lỗi `RuntimeError`, tuyệt đối không có mật khẩu fallback trong code.
2. **Kiểm toán hậu triển khai (Post-Deploy Self-Audit)**: Sau mỗi lần xử lý sự cố hoặc phát hành, bắt buộc kiểm tra 3 điểm:
   - Quyền của `/public_html/.htaccess` phải là `r--r--r--` (`CHMOD 444`).
   - Các đường dẫn độc hại/đã bỏ phải trả về `HTTP 410 Gone` hoặc `403 Forbidden`, không được rơi vào `200 OK` của SPA.
   - Không tồn tại file `error_log`, `*.bak*`, `*.sql`, `diag.php`, `migrate.php`, `seed_runner.php` trên nhánh `public_html` Production.

3. **Cạm bẫy `<FilesMatch>` + SPA Fallback**: Không chỉ dựa vào `<FilesMatch>` để chặn `error_log`, `*.bak` hoặc `*.local.php` vì khi file vật lý không tồn tại, SPA fallback sẽ trả về `200 OK` thay vì `403`. Luôn đặt `RewriteRule ... - [F,L,NC]` trước rule fallback của SPA.
4. **Endpoint Phụ Thuộc Session Nhưng Quên Guard (`print_labels.php`)**: Mọi trang con phục vụ in ấn/tải file trong `/kho/` và `/office/` đều phải có auth check server-side và `realpath()` boundary check trước khi đọc bất kỳ dữ liệu nội bộ nào.
