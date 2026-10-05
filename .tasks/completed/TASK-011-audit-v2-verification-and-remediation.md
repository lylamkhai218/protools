# TASK-011: ĐỐI CHIẾU KIỂM TOÁN V2 & KHẮC PHỤC TRIỆT ĐỂ (V2 REMEDIATION)

* **Task ID:** `TASK-011`
* **Tiêu đề:** Phân tích 2 báo cáo Lighthouse V2, tối ưu nạp Font bất đồng bộ, xử lý tương phản WCAG AA & khớp nhãn trợ năng
* **Người thực hiện:** Lead Fullstack & CTO Specialist (`PROTOOLS-CORE-AGENT`)
* **Trạng thái:** Completed (05/10/2026)
* **Mục tiêu:** Giải quyết 3 nguyên nhân cốt lõi còn sót lại trong báo cáo V2 để đưa Desktop Accessibility lên 100/100 và giải phóng 790ms render blocking font.
* **Yêu cầu liên quan:** `NFR-01` (Performance), `NFR-03` (WCAG AA Accessibility)
* **Kết quả & Tiêu chí nghiệm thu:**
  - [x] Phân tích 2 file JSON báo cáo v2: Xác nhận Mobile Performance nhảy từ `31` lên `63`, Mobile A11y đạt `100/100`, Desktop Perf đạt `97/100`, Desktop A11y đạt `96/100`.
  - [x] Chuyển đổi nạp Google Fonts trong `index.html` sang dạng bất đồng bộ (`preload` + `onload` + `noscript`), triệt tiêu 790 ms tài nguyên chặn render.
  - [x] Tăng độ tương phản nút Murrplastik trên Topbar (`src/components/Header.tsx`) lên `text-red-700` (`#B91C1C`), đạt tỷ lệ tương phản `5.91:1` (> 4.5:1 chuẩn WCAG AA).
  - [x] Đồng bộ nhãn trợ năng nút Contact nổi (`src/components/FloatingWidgets.tsx`): Gỡ `aria-label` khi đóng để khớp chính xác với chuỗi hiển thị trực quan `"LIÊN HỆ tư vấn 24/7"`.
  - [x] Làm rõ nguyên nhân lỗi `deprecations` tại Best Practices (81-82 điểm) do extension trình duyệt `Jam` chèn script, hướng dẫn quy chuẩn kiểm toán bằng Incognito Window.
