# LESSON-007: Quy Chuẩn Điều Tra, Khắc Phục Cờ Đỏ Google Safe Browsing & Kiểm Toán Bảo Mật Toàn Diện (CTO Security Audit)

* **Ngày ghi nhận**: 13/11/2026
* **Phân loại**: AppSec / Infrastructure Hardening / Google Safe Browsing Compliance
* ** Mức độ ưu tiên**: CRITICAL

---

## 1. Bản Chất Cơ Chế Google Safe Browsing & Lỗi SPA Fallback `200 OK`

1. **Phân biệt Nguồn gốc Cảnh báo Đỏ (`Social Engineering / Deceptive Site`)**:
   - Khi một tên miền bị Google Safe Browsing gắn cờ đỏ, **tuyệt đối không chỉ nhìn giao diện trang chủ qua trình duyệt**, vì tin tặc thường giữ nguyên trang chủ và chỉ chèn các thư mục con ẩn (`/Assurance-Retraite/`, `/vb/`, `/zt/`) kèm quy tắc `RewriteRule` có điều kiện trong `.htaccess` (chỉ chuyển hướng khi khớp mẫu URL hoặc Geo-IP châu Âu).
   - Bắt buộc đối chiếu trực tiếp danh sách file vật lý trên `/public_html` qua FTPS và giải nén file nhật ký máy chủ `/logs/*.tar.gz` (`protools.com.vn.log`) để tìm các truy vấn của Googlebot/SafeBrowsing (`142.250.x.x`, `66.102.x.x`, `35.241.x.x`).

2. **Bẫy `HTTP 200 OK` của Single Page Application (SPA) khi Xóa Mã Độc**:
   - Trên các website React/Vite SPA sử dụng quy tắc `.htaccess`:
     ```apache
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
     ```
   - Nếu chỉ xóa thư mục Phishing (`/vb/`, `/Assurance-Retraite/`) trên ổ đĩa mà không khai báo quy tắc chặn trước dòng SPA fallback, mọi truy vấn kiểm tra lại của Google Safe Browsing vào `/vb/page1.php` sẽ rơi vào `index.html` và nhận mã **`HTTP 200 OK`**.
   - **Giải pháp bắt buộc**: Phải khai báo quy tắc trả về **`HTTP 410 Gone` (`[G,L,NC]`)** ngay đầu khối `mod_rewrite` cho toàn bộ các đường dẫn độc hại đã xóa để khẳng định với bộ máy thẩm định của Google rằng tài nguyên lừa đảo đã bị tiêu hủy vĩnh viễn.

3. **Chuẩn Hóa Các Cổng Đăng Nhập Nội Bộ (`/office/`, `/kho/`) Theo Chính Sách Chống Giả Mạo Của Google**:
   - Không đặt placeholder email mang tên miền khác (`@t2tvina.com`) trên form đăng nhập của tên miền `protools.com.vn` (tránh kích hoạt Cross-Domain Credential Harvesting heuristic).
   - Luôn gửi HTTP Response Header `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` ở tầng PHP/Web Server thay vì liệt kê danh sách đường dẫn nhạy cảm trong `robots.txt`.

---

## 2. 5 Nguyên Tắc Phòng Thủ Bất Biến Từ Kiểm Toán CTO (`/security-audit`)

1. **Zero Hardcoded Credentials (Cấm ghi cứng mật khẩu trong mã nguồn)**:
   - Mật khẩu FTPS / Database không bao giờ được nằm trong các file `.py` hoặc `.php` được quản lý mã nguồn.
   - Bắt buộc nạp từ `.env.deploy` hoặc `office.config.local.php` (đã khóa trong `.gitignore`).
2. **Triệt tiêu Bề mặt Tấn công Di sản (Legacy PHP Decommissioning)**:
   - Khi hệ thống đã chuyển sang SPA (`index.html`), mọi file `.php` đời cũ (2014) ở thư mục gốc (`reg.php`, `lostpassword.php`, `cart.php`, `list.php`, `view.php`, `search.php`...) phải bị khóa trả về `410 Gone`, vì `RewriteCond %{REQUEST_FILENAME} !-f` sẽ cho phép thực thi trực tiếp bất kỳ file `.php` nào còn tồn tại vật lý trên đĩa.
3. **Vô hiệu hóa Thực thi Script trong Thư mục Tài nguyên Tĩnh**:
   - Chặn thực thi `.php`, `.phtml`, `.phar`, `.php7`, `.php8`, `.pht`, `.cgi`, `.pl`, `.sh`, `.py`(`403 Forbidden`) trong toàn bộ các thư mục `ckeditor`, `class`, `images`, `uploads`, `gallery`, `assets`, `logos`, `data`, `documents`, `template`, `style`, `font`, `js`, `player`, `calendar`, `ajax`, `function`, `global`, `lib`, `modules`.
4. **Cấm Lưu Trữ File Log, File Backup & Script Migration Trên Webroot**:
   - Xóa bỏ và chặn truy cập HTTP đối với `error_log` (tránh lộ đường dẫn vật lý `/home/...`), các file `.bak*` (như `index.php.bak_pre_batch` làm lộ mã nguồn PHP dạng văn bản thuần), và các script `diag.php`, `migrate.php`, `seed_runner.php`.
5. **Khóa Các Cổng Upload Cũ Dùng Denylist**:
   - Các trình upload cũ (`upload_image_ckeditor.php`, `uploadfile.php`, `upload_image_fast.php`) chỉ kiểm tra danh sách đen (`$disallowed_ext`) dễ bị vượt qua bằng `.phar` hoặc `.php8`. Phải khóa bằng `.htaccess` (`Require all denied` / `[F,L]`).

---

## 3. Bài Học Bổ Sung Từ Kiểm Toán Sâu & Nghiệm Thu Live (13/11/2026 - Vòng 2)

6. **Cạm bẫy `<FilesMatch>` trên LiteSpeed khi File Nhạy cảm Đã Xóa**:
   - Chỉ dùng `<FilesMatch>` để chặn `error_log` hoặc `*.bak` là **CHƯA ĐỦ**. Khi file đã bị xóa khỏi ổ đĩa, LiteSpeed không kích hoạt `<FilesMatch>`, khiến request đi tiếp xuống `RewriteRule . /index.html [L]` và trả về **`200 OK`** cho bot quét lỗ hổng.
   - **Quy tắc bắt buộc**: Mọi quy tắc chặn file/thư mục nhạy cảm (`.htaccess`, `error_log`, `*.local.php`, `*.bak*`, `*.sql`, `config.php`, `auth.php`) **PHẢI viết bằng `RewriteRule ... - [F,L,NC]` ngay đầu `mod_rewrite`** (kết hợp `<FilesMatch>` để bảo vệ chiều sâu).
7. **Kiểm tra Chặt Chẽ Đầu Ra Trước khi Xuất bản & Hậu Triển khai**:
   - Các trang phụ độc lập như `/kho/print_labels.php` nếu chỉ gọi `session_start()` mà không thiết lập đúng `session_set_cookie_params('path' => '/kho')` và kiểm tra khóa phiên `$_SESSION['ttvina_wms_logged_in']` sẽ biến thành lỗ hổng rò rỉ toàn bộ tồn kho JSON ra internet mà không cần đăng nhập.
   - Bắt buộc kiểm tra `realpath()` containment trong mọi endpoint stream file (`office/download.php`) và không đặt `Access-Control-Allow-Origin: *` trên endpoint có xác thực.
8. **Không Tin `X-Forwarded-For` Trong Rate Limiter Khi Không Có Reverse Proxy Tin Cậy**:
   - Đọc `HTTP_X_FORWARDED_FOR` cho phép kẻ tấn công gửi tiêu đề giả để vượt qua giới hạn tốc độ (`submit_quote.php`). Sử dụng trực tiếp `REMOTE_ADDR` đã kiểm định `FILTER_VALIDATE_IP`.

---

## 4. Bài Học Từ Rà Soát Sâu Vòng 3 (14/11/2026 - Zero-Breakage Auth & Secret Isolation)

9. **Kiểm tra `Referer` Trong `.htaccess` Không Thay Thế Được Xác Thực Server-Side**:
   - Dựa vào quy tắc `HTTP_REFERER` để cho phép truy cập `/admincp/modules/*.php` cho phép kẻ tấn công gửi giả tiêu đề `Referer: https://protools.com.vn/admincp/` và thực thi trực tiếp các file thiếu `checklogin()`. Phải thực thi xác thực tập trung ngay trong tệp dùng chung phía server (`mdl_global_admincp.php`) và chặn trực tiếp mọi partial HTML có truy vấn DB (`content_left.php`).
10. **Fail-Closed Mặc Định, Ép Kiểu Cookie & Chống CSV Formula Injection**:
   - Hàm `wms_resolve_current_user()` qua HTTP khi chưa có session tuyệt đối chỉ được trả về `GUEST`, không bao giờ mặc định `ADMIN`; giá trị từ cookie (`number_limit`, `languagecp`) phải ép kiểu `intval()` trong miền hợp lệ trước khi nối SQL; mọi file CSV xuất cho bộ phận kho/kế toán phải bọc tiền tố `'` trước ký tự kích hoạt công thức (`=`, `+`, `-`, `@`, tab, CR).
11. **Bảo vệ Action Mutation Khỏi CSRF, GET Fallback & Lộ Chi tiết Exception**:
   - Mọi endpoint thay đổi/xóa dữ liệu trong REST API phải kiểm tra phương thức `POST` + xác thực `Origin`/`Referer` cùng miền, chỉ đọc tham số ID từ `POST`/JSON body (không dùng `$_GET` fallback), và ghi ngoại lệ chi tiết vào `error_log()` thay vì trả `$e->getMessage()` ra JSON.
