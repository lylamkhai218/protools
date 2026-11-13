# Báo cáo rà soát tài liệu và phần việc còn lại - 2026-11-05

Rà soát chỉ đọc đã đối chiếu `spec.md`, `plan.md`, `tasks.md`, hợp đồng và phần bổ sung có hiệu lực của constitution. Báo cáo này ghi lại kết quả theo yêu cầu triển khai của người dùng; không khẳng định CLI đã chạy một lượt đánh giá độc lập bằng mô hình khác.

## Phân tích đặc tả

| ID | Nhóm | Mức độ | Bằng chứng | Cách xử lý |
|---|---|---|---|---|
| S1 | Tương thích công cụ | TRUNG BÌNH | agy và Codex dùng chung đường dẫn skill; trạng thái CLI chính thức báo metadata multi-install không an toàn | Giữ nguyên file gốc, ghi cảnh báo; T029 còn mở |
| S2 | Sẵn sàng kiểm thử | CAO đối với phát hành | SC-001 yêu cầu 300 lượt quét thật; hiện mới xử lý thăm dò một ảnh toàn khay | Chặn triển khai OCR vào vận hành; A003/T032 |
| S3 | Sẵn sàng production | CAO đối với phát hành | Chưa có bằng chứng phiên bản hosting, danh mục dao thật và việc đổi khóa riêng | Chặn phát hành; T030/T031/T036 |
| S4 | Sẵn sàng dữ liệu giá vốn | TRUNG BÌNH | Chưa xác minh giá vốn đến cấp nguồn; trường nullable hiển thị chưa biết thay vì tự đoán | T034 |
| S5 | Bằng chứng phát hành | CAO đối với phát hành | Chưa hồi quy Office đầy đủ, chạy hai ca có giám sát hoặc diễn tập khôi phục | F001/F003/F004 và T033/T035/T037 |

Cả 20 yêu cầu chức năng đều đã nối với task, không còn yêu cầu chức năng nào thiếu task. Không miễn trừ quy định dự án: không tuyên bố đã nghiệm thu thực địa. Các điểm phát hành còn mở đồng nghĩa chương trình M0-M4 CHƯA hoàn tất.

## Tóm tắt phần việc đã bổ sung

Bằng chứng local gồm kiểm tra PHP/JS, 45 kiểm tra nghiệp vụ, 14 HTTP, 3 phiên, 6 quản trị nhân viên và các kiểm tra migration/WIP/tranh chấp trên MariaDB cô lập. Các luồng local đã triển khai gồm quyền, đăng nhập nhân viên, tách tiếp nhận khỏi kiểm định, nhật ký sửa sai/in lại tem, OCR trình duyệt, xác nhận lượt quét, tự nhận dao, đối soát và bảo toàn ledger WIP.

Sau rà soát, đã bổ sung T029-T038 vào `tasks.md` mà không xóa hoặc đánh số lại backlog ban đầu. Các task mới bao quát metadata công cụ, môi trường/dữ liệu thật, đánh giá thực địa và điều kiện phát hành. Không có thay đổi dữ liệu production.

## Việc tiếp theo

Thu thập bằng chứng thực địa và môi trường thật còn thiếu trước khi phát hành. Không yêu cầu phê duyệt triển khai dựa trên giả định. Dùng `operations.md` và `field-test-protocol.md` để ghi nhận kết quả có thể xác minh.
