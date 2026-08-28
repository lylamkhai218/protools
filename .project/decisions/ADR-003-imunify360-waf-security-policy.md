# ADR-003: CHÍNH SÁCH AN TOÀN MÁY CHỦ & PHÒNG VỆ AUTO-BAN IMUNIFY360 WAF

* **Status:** Accepted
* **Date:** 2026-08-21
* **Context:** Sự cố ngày 21/08/2026 khi tải file `ntunnel_mysql.php` lên host khiến Imunify360 WAF (Rule `77218530`) kích hoạt Auto-Ban khóa toàn bộ IP máy khách.
* **Decision:**
  1. CẤM TUYỆT ĐỐI upload bất kỳ HTTP SQL Bridge script nào (`ntunnel*.php`, `adminer.php`, `db_bridge.php`).
  2. Mọi thao tác trực tiếp với Database MariaDB 10.6 (`prod2e4e_db`) phải thực hiện qua phpMyAdmin DirectAdmin hoặc kết nối Read-Only qua Port 3306 sau khi đã khai báo IP tại Access Hosts.
  3. Toàn bộ quy trình phát hành code mới phải chạy qua script tự động sao lưu [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py).
* **Consequences:** Đảm bảo 100% thời gian hoạt động (Uptime) của hạ tầng Mắt Bão và an toàn tuyệt đối cho hệ thống production.
