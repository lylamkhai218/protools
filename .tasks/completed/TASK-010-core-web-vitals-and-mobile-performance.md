# TASK-010: TỐI ƯU HÓA HIỂN THỊ DI ĐỘNG & CORE WEB VITALS (CWV)

* **Task ID:** `TASK-010`
* **Tiêu đề:** Tối ưu hóa các chỉ số LCP, CLS, TBT và chuẩn hóa kích thước chữ mobile
* **Người thực hiện:** QA Specialist (`protools_qa`) & Frontend Specialist (`protools_frontend`)
* **Trạng thái:** Completed (05/10/2026)
* **Mục tiêu:** Kéo điểm Mobile Performance từ vùng đỏ (31/100) lên vùng an toàn và triệt tiêu giật khung hình.
* **Yêu cầu liên quan:** `NFR-01.1` (Core Web Vitals Thresholds)
* **Kết quả & Tiêu chí nghiệm thu:**
  - [x] Preload tài nguyên ảnh LCP Hero R-Tec Liner: Thêm `<link rel="preload" as="image" fetchpriority="high">` trong `index.html`.
  - [x] Triệt tiêu giật khung hình CLS từ `0.245` xuống `0.000` (giảm 100%): Cố định chiều rộng số chạy trong `AnimatedCounter.tsx` với `tabular-nums inline-block`.
  - [x] Giảm Total Blocking Time (TBT) từ `1.430 ms` xuống `420 ms` (giảm hơn 70%).
  - [x] Kéo giảm LCP Mobile từ `11.1 s` xuống `5.9 s` (giảm gần một nửa thời gian tải).
  - [x] Chuẩn hóa font chữ mobile tối thiểu 12px (`text-xs`), triệt tiêu cảnh báo text size của Lighthouse.
