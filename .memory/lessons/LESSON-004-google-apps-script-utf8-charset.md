# LESSON-004: Xử lý Lỗi Font Tiếng Việt & CORS khi gửi Form sang Google Apps Script

* **Ngày ghi nhận:** 28/08/2026
* **Hệ thống:** Google Apps Script Webhook / HTML5 Client

## Hiện tượng & Nguyên nhân
- Khi gửi payload JSON có dấu tiếng Việt sang Google Apps Script qua lệnh HTTP POST từ công cụ dòng lệnh hoặc trình duyệt, các nguyên âm có dấu (ộ, ử, ệ) bị biến thành dấu hỏi chấm ? trên Google Sheet.
- Nguyên nhân: Tiêu đề HTTP không khai báo charset rõ ràng khiến máy chủ mặc định giải mã theo bảng mã ISO-8859-1.
- Nếu dùng Content-Type: application/json, một số trình duyệt sẽ kích hoạt CORS Preflight OPTIONS khiến Google Apps Script từ chối kết nối.

## Giải pháp kỹ thuật
1. Trong JavaScript etch(): Sử dụng headers: { 'Content-Type': 'text/plain;charset=utf-8' }.
2. Định dạng này vừa giúp Google Apps Script đọc đúng 100% tiếng Việt UTF-8 qua e.postData.contents, vừa được trình duyệt coi là Simple Request (không phát sinh preflight OPTIONS).