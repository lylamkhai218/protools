# Kiểm chứng local

Dùng `scratch/php/php.exe` để kiểm tra cú pháp. Test nghiệp vụ chỉ dùng fixture SQLite cô lập; nghiệm thu MariaDB là cổng riêng. Tuyệt đối không trỏ test tới production.

Chạy kiểm tra điều kiện Spec Kit với `-RequireSpec -RequireTasks -IncludeTasks`. Khi có thay đổi ở các file nguồn đã chọn, dùng Python của Graphify để chạy `scripts/refresh_production_graph.py`. Tra vấn graph trước khi lần theo mã, nhưng luôn xác minh nội dung file thật trước khi sửa.

## Trang thử quét tem hộp dao

Sau khi T040 phát hành xong, mở `https://protools.com.vn/office/san-xuat/test/` trên Safari iPhone. Trang chạy OCR ngay trên máy, không gửi ảnh và không thay đổi tồn kho.

1. Đối chiếu mã in trên tem hộp.
2. Nhập nguyên mã mẫu, giữ đúng chữ hoa/thường, số `0` và dấu gạch.
3. Chạm **Quét tem hộp**, cho phép Camera, đưa một hộp vào khung và giữ yên.
4. Chỉ coi là đạt khi trang xác nhận khớp chính xác sau hai lần đọc liên tiếp. Nếu hình đen hoặc không có quyền, mở quyền Camera của trang trong Safari rồi tải lại.

Trang production hiện chưa được phát hành; URL này đang rơi về trang CNC cũ cho tới khi hoàn tất T040.
