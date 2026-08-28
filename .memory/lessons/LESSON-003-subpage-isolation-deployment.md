# LESSON-003: Chiến lược Triển khai Cô Lập Phân Vùng Trang Con (Subpage Isolation)

* **Ngày ghi nhận:** 28/08/2026
* **Hệ thống:** Mắt Bão LiteSpeed / Apache Multi-App Hosting

## Hiện tượng & Nguyên nhân
- Khi triển khai một trang con hoặc brand hub mới (như /murrplastik/) lên cùng một domain mà trang chủ đang chạy CMS cũ:
- Nếu đặt file index.html hoặc rewrite ở root public_html, toàn bộ trang chủ sẽ bị ghi đè, làm gián đoạn hệ thống bán hàng hiện hữu.

## Giải pháp kỹ thuật
1. **Cô lập thư mục con**: Đặt toàn bộ tài nguyên vào /public_html/[tên_trang]/.
2. **Bypass Rewrite ở Root**: Thêm luật RewriteRule ^[tên_trang](/.*)?$ - [L] trước các luật rewrite chung của root CMS.
3. **Dedicated Sub-Routing**: Cấu hình file .htaccess riêng trong thư mục con với RewriteBase /[tên_trang]/.