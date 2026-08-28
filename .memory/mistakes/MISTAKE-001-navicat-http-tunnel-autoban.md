# MISTAKE-001: AUTO-BAN DO SỬ DỤNG NAVICAT HTTP TUNNEL SCRIPT

* **Ngày xảy ra:** 21/08/2026
* **Transaction ID:** `E8B9U-gvg-mlTBAwloBz5iXW`
* **Client IP bị khóa:** `1.52.255.88`
* **Rule ID kích hoạt:** `77218530` (CRITICAL) & `77350224`
* **File WAF vi phạm:** `/etc/modsecurity.d/013_i360_generic.conf:129`

## NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE)
Tải script trung gian `ntunnel_mysql.php` lên `/public_html` và mở kết nối xem cấu trúc bảng qua Navicat. Khi Navicat gửi HTTP POST chứa từ khóa `information_schema.ROUTINES`, bộ lọc ModSecurity của Imunify360 nhận diện là payload SQL Injection và lập tức kích hoạt Graylist/Auto-ban toàn bộ cổng (21, 2222, 2083, 3306).

## BIỆN PHÁP KHẮC PHỤC TRIỆT ĐỂ
1. Xóa bỏ hoàn toàn mọi file script bridge trên host.
2. Thiết lập quy tắc cấm vĩnh viễn việc tải script trung gian trong `AGENTS.md` và `.project/constitution.md`.
3. Chỉ thao tác DB qua DirectAdmin phpMyAdmin hoặc kết nối trực tiếp cổng 3306 sau khi add IP vào Access Hosts.
