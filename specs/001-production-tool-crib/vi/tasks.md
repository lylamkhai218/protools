# Danh sách task: Kho dao sản xuất

Trạng thái dựa trên bằng chứng. Không được báo các task thực địa/phát hành chưa đánh dấu hoàn tất là đã xong.

## Giai đoạn 1: Công cụ

- [x] T001 [FR-019] Sao lưu công cụ; cài Specify CLI, giữ agy và thêm integration Codex.
- [x] T002 [FR-018] Cài Graphify và dựng lại graph đã lọc, bao gồm Office và Kho.
- [x] T003 [FR-019] Hoàn thành đặc tả, nghiên cứu, kế hoạch, mô hình dữ liệu, hợp đồng và truy vết task.

## Giai đoạn 2: Xác minh hiện trạng

- [ ] A001 [FR-016] Đối chiếu dấu vân tay mã local/production và xác minh PHP/schema hosting theo cách chỉ đọc.
- [ ] A002 [FR-003] Kiểm kê mã thật trên hộp/cán và xử lý mã trùng.
- [ ] A003 [FR-008] Chọn ít nhất 30 hộp và đo ít nhất 300 lượt quét bằng thiết bị thật trong điều kiện ánh sáng ca đêm.

## Giai đoạn 3: Quyền truy cập

- [ ] B001 [FR-016] Lọc bí mật, đưa mã Office vào quản lý phiên bản; tách cấu hình và bắt buộc TLS.
- [x] B002 [FR-001] Bảo vệ trang và từng thao tác production; giới hạn token triển khai và kiểm tra CSRF.
- [x] B003 [FR-002] Đăng nhập nhân viên, đổi mật khẩu lần đầu, hết phiên khi người dùng không hoạt động và thu hồi phiên.
- [x] B004 [FR-015] Tạo báo cáo bàn giao khi khóa nhân viên; không xóa dữ liệu lịch sử.

## Giai đoạn 4: US1 - Bàn giao dao an toàn

- [x] C001 [FR-004] Thực thi vòng đời tiếp nhận/kiểm định trong `api_production.php`.
- [x] C002 [FR-005] Khóa giao dịch và idempotency cho thao tác đơn lẻ/theo lô.
- [x] C003 [FR-010] Đề nghị trả, hàng chờ tiếp nhận và phân loại chỉ dành cho người kiểm định.
- [x] C004 [FR-011] Nhật ký chỉ ghi nối thêm, sửa sai có quyền và ghi nhận in lại tem.

## Giai đoạn 5: US2 - Camera và ca đêm

- [ ] D001 [FR-008] OCR local khớp chính xác và quản lý vòng đời camera; không dò gần đúng.
- [x] D002 [FR-009] Xác nhận lượt quét chỉ dùng một lần, hết hạn sau 120 giây và bảo vệ ảnh bằng quyền truy cập.
- [x] D003 [FR-006] Chỉ tự cấp dao đủ điều kiện cho nhân viên đã xác thực đang nhận dao.
- [x] D004 [FR-007] Đối soát buổi sáng không ghi cấp kho lần thứ hai.
- [ ] D005 [FR-017] Giao diện cho mất mạng/lỗi/hết phiên và quy trình ngoại lệ nhập tay.

## Giai đoạn 6: US3 - WIP

- [x] E001 [FR-012] Cập nhật giao dịch tồn nguồn và thẻ kho nguyên tử, dùng đơn vị đã xác minh.
- [x] E002 [FR-013] Bảo toàn chiều dài bằng số nguyên cố định và ngưỡng nhập lại 2 m.
- [ ] E003 [FR-014] Chọn phôi thừa phù hợp ngắn nhất, truy vết nguồn, QR và báo cáo giá vốn trung thực.
- [x] E004 [FR-015] Migration chỉ bổ sung và có quy trình đối soát dữ liệu lịch sử.

## Giai đoạn 7: US4 - Nghiệm thu

- [ ] F001 [FR-017] Kiểm thử bàn phím/điện thoại/modal và hồi quy Office cũ.
- [x] F002 [FR-005] Kiểm thử tranh chấp MariaDB, gửi lại sau mất phản hồi và rollback.
- [ ] F003 [FR-020] Hai ca đêm có giám sát và nghiệm thu OCR thực địa.
- [ ] F004 [FR-020] Diễn tập backup/restore và phát hành có kiểm soát qua `deploy_protools.py`.
- [x] F005 [FR-019] Phân tích tài liệu, đưa việc còn thiếu vào backlog và cập nhật graph.

## Phụ thuộc

T001-T003 -> A001 -> B -> C -> D. A002/A003 có thể chạy độc lập với thay đổi quyền; A003 là điều kiện để đưa scanner vào vận hành. E cần B và dữ liệu tồn nguồn đã xác minh, không phụ thuộc D. F phụ thuộc các luồng liên quan đã triển khai.

## Giai đoạn 8: Bổ sung sau rà soát - 2026-11-05

Đây là các nghĩa vụ còn lại được xác định sau khi rà soát triển khai local. Giữ nguyên backlog ban đầu; không đánh dấu nghiệm thu thực địa/phát hành là hoàn tất chỉ dựa trên đọc mã nguồn.

- [ ] T029 [FR-019] Xử lý hoặc xác minh integration agy/Codex được hỗ trợ chính thức, không ghi đè skill tùy chỉnh; ghi rõ trạng thái chính thức sạch hoặc cách cài tương thích đã được rà soát trong `operations.md`.
- [ ] T030 [FR-016] Xác minh phiên bản PHP/schema hosting thật và dấu vân tay file qua truy cập chỉ đọc được cho phép; ghi khác biệt vào `research.md` trước khi chuẩn bị migration production.
- [ ] T031 [FR-003] Thủ kho xác minh mã thật trên hộp/cán và xử lý trùng; ghi xác nhận thật, không dùng kết quả fixture giả.
- [ ] T032 [FR-008] Thực hiện `field-test-protocol.md` trên ít nhất 30 hộp thật và 300 lượt quét trở lên; điền `ocr-field-results.csv`. Nếu không đạt thì đánh giá tem QR mang cùng mã trước khi mua thiết bị.
- [ ] T033 [FR-017] Hoàn tất kiểm thử vòng đời camera Android/iPhone, giao diện điện thoại, tem in, phản hồi khi mất mạng và hồi quy Office đại diện; đính kèm bằng chứng vào `implementation-status.md`.
- [ ] T034 [FR-014] Xác minh/nhập giá vốn thực tế và đơn vị tính theo nguồn trước khi bật báo cáo tiền; giữ giá chưa rõ là null. Kiểm tra thực tế việc chọn remnant qua QR/OCR và cách cân trừ bì.
- [ ] T035 [FR-020] Chạy hai ca đêm thật có giám sát, đối soát sáng và điền `night-shift-results.csv`.
- [ ] T036 [FR-016] Đổi các thông tin xác thực thật qua quản trị hosting/Bot được ủy quyền và cấp cấu hình bảo vệ ngoài webroot. Việc tách cấu hình local không thay thế đổi khóa.
- [ ] T037 [FR-020] Diễn tập backup/restore trên bộ dữ liệu đại diện cô lập, rà soát rollback tương thích schema rồi mới phát hành qua `deploy_protools.py` sau khi đủ điều kiện.
- [ ] T038 [FR-009] Lên lịch dọn ảnh quá hạn 90 ngày qua quản trị server đã rà soát; xác minh quyền truy cập ảnh và thời hạn trên môi trường triển khai thật.

## Giai đoạn 9: Trang thử quét tem cô lập - 2026-11-05

- [ ] T039 [FR-008] Hoàn thiện và xác minh trang tĩnh `/office/san-xuat/test`, chỉ đọc, dùng đúng token giao diện Office; trang không hiển thị dữ liệu bảo vệ, không ghi database/gọi API thay đổi dữ liệu và OCR chạy trong trình duyệt.
- [ ] T040 [FR-017] Sao lưu và phát hành riêng các file của trang thử nghiệm qua kênh hosting mã hóa có xác thực; kiểm tra route thật, Permissions-Policy camera, đường dẫn thư viện và rollback, không sửa root website hay chính sách Office dùng chung.
- [ ] T041 [FR-008] Chạy trang đã phát hành trên Safari iPhone 13 với tem hộp thật; ghi nhận hỏi quyền, hình camera, nhận dạng mã chính xác, trạng thái xử lý lỗi và kết quả OCR thực địa liên quan T032/T033.
