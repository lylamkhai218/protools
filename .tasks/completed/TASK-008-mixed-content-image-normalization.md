# TASK-008: CHUẨN HÓA HTTPS & TRIỆT TIÊU MIXED CONTENT TOÀN BỘ CATALOG

* **Task ID:** `TASK-008`
* **Tiêu đề:** Chuyển đổi 100% tài nguyên ảnh sản phẩm sang giao thức an toàn HTTPS
* **Người thực hiện:** Database Architect (`protools_data`) & Frontend Specialist (`protools_frontend`)
* **Trạng thái:** Completed (05/10/2026)
* **Mục tiêu:** Loại bỏ hoàn toàn lỗi Passive Mixed Content từ 150 liên kết ảnh dùng HTTP cũ sang HTTPS chính thức `https://protools.com.vn/`.
* **Yêu cầu liên quan:** `NFR-02.2` (HTTPS Integrity & Passive Mixed Content Zero Tolerance)
* **Kết quả & Tiêu chí nghiệm thu:**
  - [x] Quét và sửa toàn bộ URL ảnh trong `src/data.ts`: 150/150 ảnh đã chuyển sang `https://protools.com.vn/`.
  - [x] Cập nhật file chỉ mục dữ liệu tĩnh `public/data/catalog_index.json`.
  - [x] Xác thực kết nối mạng: Không còn request HTTP nào gây redirect hay cảnh báo Mixed Content trên DevTools Console.
