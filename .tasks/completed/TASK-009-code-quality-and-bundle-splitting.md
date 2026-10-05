# TASK-009: CHUẨN HÓA MÃ NGUỒN & TỐI ƯU HÓA PHÂN TÁCH BUNDLE ROLLUP

* **Task ID:** `TASK-009`
* **Tiêu đề:** Khử duplicate keys i18n, dọn dẹp biến thừa và phân tách chunk dữ liệu catalog dưới 250 KB
* **Người thực hiện:** Frontend & UI/UX Specialist (`protools_frontend`)
* **Trạng thái:** Completed (05/10/2026)
* **Mục tiêu:** Đưa linter về 0 cảnh báo/lỗi và chia nhỏ JavaScript bundle để tối ưu bộ nhớ cache trình duyệt.
* **Yêu cầu liên quan:** `NFR-01.3` (Bundle Budget < 250 KB gzip), `NFR-05` (Maintainability)
* **Kết quả & Tiêu chí nghiệm thu:**
  - [x] Khử sạch 1.533 dòng duplicate translation keys trong `public/murrplastik/assets/js/i18n.js`.
  - [x] Dọn sạch 136 unused variables trong các component React (`Header.tsx`, `Footer.tsx`, `CartQuote.tsx`, `ProductDetail.tsx`, `VirtualCatalogGrid.tsx`).
  - [x] Cấu hình Rollup `manualChunks` trong `vite.config.ts`: Tách riêng `catalog-data` chứa bộ từ điển và dữ liệu sản phẩm.
  - [x] Kiểm tra bundle build: Mọi chunk đều nằm dưới `255 KB` raw và dưới `75 KB` gzip.
  - [x] `pnpm lint` (`tsc --noEmit`) đạt **0 errors, 0 warnings**.
