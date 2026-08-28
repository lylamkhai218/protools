# ADR-001: ÁP DỤNG PROTOOLS PROJECT OS BOOTSTRAP & CẤU TRÚC BỘ NHỚ 3 TẦNG

* **Status:** Accepted
* **Date:** 2026-08-21
* **Context:** Dự án `protools.com.vn` cần phát triển bền vững trong thời gian dài với nhiều Agent tham gia mà không bị mất ngữ cảnh, không suy đoán sai lệch và đảm bảo khả năng truy xuất nguồn gốc.
* **Problem:** Các dự án AI thông thường hay gặp tình trạng Agent quên ngữ cảnh, tự ý thay đổi cấu trúc mã nguồn hoặc lặp lại sai lầm kỹ thuật.
* **Decision:** Triển khai Hệ Điều Hành Dự Án (Project OS) với:
  1. Bộ nhớ 3 tầng: `.project/` (Dài hạn), `.tasks/` & `.handoffs/` (Tác vụ), `.memory/` (Học hỏi & kinh nghiệm).
  2. Nguyên tắc nạp ngữ cảnh từng bước (Progressive Context Loading).
  3. Chuỗi truy xuất nguồn gốc: `BUS → FR/NFR → UC → SAD → TASK → Code → TEST`.
  4. Cơ chế phản biện độc lập trước các quyết định lớn (Critical Thinking Gate).
* **Consequences:** Toàn bộ Agent phải tuân thủ việc đọc `snapshot.md`, cập nhật task và ghi nhận bài học sau mỗi thay đổi lớn.
