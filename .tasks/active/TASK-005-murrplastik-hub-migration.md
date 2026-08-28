# TASK-005: Tích hợp & Đồng bộ Phân Vùng Murrplastik Hub (Subpage Isolation)

* **Mã Task:** TASK-005
* **Mục tiêu:** Di chuyển dữ liệu từ local D:\T&TVina\murrplastik_code lên máy chủ Mắt Bão tại https://protools.com.vn/murrplastik/ theo mô hình cô lập (Subpage Isolation).
* **Trạng thái:** **Completed & Verified**
* **Traceability:** BUS-01 -> ADR-005 -> TASK-005 -> TEST-MURRPLASTIK-PROD

---

## Các công việc thực hiện:
- [x] 1. Cấu hình root .htaccess bypass rule RewriteRule ^murrplastik(/.*)?$ - [L].
- [x] 2. Viết script đồng bộ hóa tự động [sync_murrplastik_to_prod.py](file:///d:/T&TVina/protools/sync_murrplastik_to_prod.py).
- [x] 3. Upload toàn bộ 244 file tài nguyên (5 nhóm sản phẩm, F&B, Ô tô, Tin tức, 3D viewer) lên /public_html/murrplastik/.
- [x] 4. Chuyển đổi toàn bộ URL canonical, schema, meta tags sang https://protools.com.vn/murrplastik/.
- [x] 5. Xóa bỏ mockup/guide test tạm thời, bảo vệ nguyên trạng trang chủ PHP CMS.
- [x] 6. Chạy kiểm thử tự động 13/13 URL đạt HTTP 200 OK.