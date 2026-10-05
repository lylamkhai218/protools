# TASK-012: PHÁT HÀNH PRODUCTION MẮT BÃO & ĐỒNG BỘ TRI THỨC TOÀN HỆ THỐNG

* **Task ID:** `TASK-012`
* **Tiêu đề:** Đóng gói build Vite, đồng bộ FTP lên máy chủ Production Mắt Bão và cập nhật Append-Only quy chuẩn
* **Người thực hiện:** Lead Fullstack & Infrastructure Security Specialist (`PROTOOLS-CORE-AGENT`)
* **Trạng thái:** Completed (05/10/2026)
* **Mục tiêu:** Phát hành toàn diện bản vá V1 & V2 lên `https://protools.com.vn/` an toàn, không gián đoạn dịch vụ và đồng bộ tri thức vào `AGENTS.md`.
* **Yêu cầu liên quan:** `Rule 4.1` (Safe Production Deploy), `Rule 0` (Append-Only Knowledge Policy)
* **Kết quả & Tiêu chí nghiệm thu:**
  - [x] Chạy `pnpm build`: Biên dịch 1.703 modules thành công trong 8.51s, chunk JS lớn nhất chỉ 213 KB.
  - [x] Chạy `python deploy_production_root.py`: Tự động sinh XML sitemaps, static SEO snapshots và upload an toàn 207 files lên máy chủ FTP `s2d34.cloudnetwork.vn` (public_html).
  - [x] Bảo vệ phân quyền `.htaccess` cho root SPA và thư mục quản trị `admincp/`.
  - [x] Xác thực trực tiếp website production: HTTP 200 OK.
  - [x] Ghi nối tiếp các quy tắc kỹ thuật `Rule 9.95`, `Rule 9.96`, `Rule 9.97` vào `AGENTS.md`.
  - [x] Đồng bộ toàn bộ mã nguồn và hồ sơ kiểm toán lên nhánh chính GitHub repository.
