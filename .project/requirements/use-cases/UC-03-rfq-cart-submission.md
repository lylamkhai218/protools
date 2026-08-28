# USE CASE: UC-03 — TỔNG HỢP VÀ GỬI YÊU CẦU BÁO GIÁ (RFQ)

* **Use Case ID:** `UC-03`
* **Tên ca sử dụng:** Quản lý giỏ hàng RFQ và gửi yêu cầu báo giá dự án
* **Tác nhân chính:** Chuyên viên thu mua (Procurement Officer), Kỹ sư
* **Mục tiêu:** Tổng hợp danh sách thiết bị cần mua cho dự án và gửi cho T&T Vina hoặc xuất file PDF dự toán nội bộ.
* **Yêu cầu liên quan:** `FR-03.1`, `FR-03.2`, `FR-03.3`, `BR-01.3`, `BR-03.1`

## LUỒNG SỰ KIỆN CHÍNH (MAIN FLOW)
1. Người dùng mở trang Giỏ hàng báo giá (Cart & RFQ).
2. Hệ thống hiển thị bảng danh sách các thiết bị đã chọn, số lượng, quy cách đóng gói và ô nhập ghi chú yêu cầu kỹ thuật riêng.
3. Người dùng điền thông tin liên hệ (Tên công ty, SĐT, Email, Tên dự án/Công trình).
4. Người dùng bấm "Gửi yêu cầu báo giá" (Submit RFQ).
5. Hệ thống xác thực dữ liệu đầu vào (Input Sanitization), lưu đơn RFQ và hiển thị mã tham chiếu RFQ thành công.
6. (Tùy chọn) Người dùng bấm "Xuất bảng dự toán PDF" để tải file tổng hợp báo giá có logo và hotline của T&T Vina.
