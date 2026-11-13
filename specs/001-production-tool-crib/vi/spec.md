# Đặc tả: Kho dao sản xuất và WIP

Phê duyệt ngày 2026-11-05. Trạng thái: đang triển khai, CHƯA phát hành.

## Câu chuyện người dùng

- US1: Quản lý an toàn việc giữ và bàn giao dao (FR-001..FR-007, FR-010..FR-011).
- US2: Quét dao và tự nhận dao trong ca đêm (FR-008..FR-009, FR-017).
- US3: Quản lý WIP và số dư tồn kho có đối soát (FR-012..FR-015).
- US4: Hệ thống dễ bảo trì và đủ điều kiện phát hành (FR-016, FR-018..FR-020).

## Yêu cầu chức năng

- FR-001: Chỉ nhân viên đang hoạt động và đã đăng nhập mới được vào phân hệ sản xuất; kiểm tra quyền ở từng thao tác và CSRF.
- FR-002: Giữ đăng nhập bằng email; hỗ trợ mã nhân viên duy nhất, đổi mật khẩu lần đầu, thu hồi phiên và hết hạn sau 3.600 giây không có thao tác của người dùng.
- FR-003: Một mã định danh dao duy nhất được in trên hộp và khắc trên cán; chặn mã trùng và trường hợp chưa xử lý được sai khác.
- FR-004: Vòng đời dao là kho -> xưởng CNC -> kiểm định -> về kho hoặc phế liệu; độ mòn được quản lý riêng với vị trí.
- FR-005: Tuần tự hóa thao tác cấp, nhận trả và kiểm định; mỗi dao chỉ có một lượt mượn đang mở; yêu cầu gửi lại giống hệt được trả lại kết quả cũ, nội dung đã đổi bị từ chối.
- FR-006: Thợ chỉ được tự nhận dao cho chính mình, gắn với bản vẽ và dao đã kiểm định, được cho phép tự nhận.
- FR-007: Dao lấy trong ca đêm được ghi nhận ngay; đối soát buổi sáng không được ghi cấp kho lần thứ hai.
- FR-008: OCR chữ trên hộp ngay trong trình duyệt; chỉ chấp nhận mã khớp chính xác, không bỏ số 0, dò gần đúng hoặc âm thầm thay ký tự.
- FR-009: Xác nhận lượt quét hết hạn sau 120 giây và chỉ dùng một lần; ảnh hoặc điểm tin cậy không chứng minh người dùng đang cầm dao thật.
- FR-010: Thợ đề nghị trả; thủ kho tiếp nhận; người kiểm định phân loại; nhận trả theo lô phải thành công toàn bộ hoặc rollback toàn bộ.
- FR-011: Nhập tay, in lại tem và sửa sai cần người có quyền, lý do và nhật ký không thể sửa/xóa.
- FR-012: Cấp và nhận lại WIP phải cập nhật thẻ kho/tồn thực trong cùng giao dịch; không vượt tồn hoặc số dư phôi còn lại.
- FR-013: Chiều dài đã cấp phải bằng chiều dài tiêu hao + nhập lại kho + phế liệu; phần từ 2 m trở lên nhập lại kho, phần ngắn hơn là phế liệu.
- FR-014: Ưu tiên phôi thừa ngắn nhất nhưng vẫn đủ dùng; giữ quan hệ nguồn gốc; QR được bảo vệ; báo rõ khi chưa có dữ liệu giá vốn.
- FR-015: Giữ lịch sử người dùng/chứng từ; nhân sự bị khóa vẫn phải có thông tin bàn giao trách nhiệm; migration không tạo giao dịch mẫu.
- FR-016: Quản lý mã Office đã lọc bí mật trong Git; đưa bí mật ra ngoài webroot; giới hạn quyền token triển khai; xác minh TLS.
- FR-017: Giao diện đáp ứng và truy cập được; thể hiện rõ trạng thái đang tải/lỗi/hết phiên; không báo giao dịch ngoại tuyến là thành công.
- FR-018: Graph local bao gồm Office, scanner và hợp đồng API có nguồn truy xuất; loại bí mật, bản dump, hồ sơ khách hàng và ảnh hàng loạt.
- FR-019: Tài liệu Spec Kit truy vết yêu cầu tới task và kiểm thử; kiến thức dự án được bổ sung theo nguyên tắc append-only.
- FR-020: Chỉ phát hành sau khi hồi quy MariaDB, diễn tập backup/restore và hoàn thành hai ca đêm có giám sát.

## Tiêu chí thành công

- SC-001: Ít nhất 95% trong 300 lượt quét trên ít nhất 30 hộp thật nhận đúng trong vòng 3 giây khi tem rõ; không được có trường hợp nhận nhầm sang một mã hợp lệ khác trong mẫu thử. Kết quả này không đảm bảo không bao giờ có lỗi khi vận hành.
- SC-002: Cấp dao đồng thời chỉ tạo một lượt mượn; nhận trả trùng không ghi đè lịch sử; thao tác polling không gia hạn thời gian phiên.
- SC-003: Mọi giao dịch WIP và kho bảo toàn chiều dài đến 0,01 m, và rollback khi có lỗi.
- SC-004: Mỗi yêu cầu được nối với một kiểm thử có thể chạy hoặc một biên bản nghiệm thu thực địa có tên.

## Trường hợp biên

Tem hỏng/lệch mã, mã trùng, nhiều tem trong khung hình, phiên bị thu hồi, lượt quét cũ, mất phản hồi, dùng lại idempotency key với nội dung khác, nhiều thao tác nhận trả giao nhau, tồn bằng 0, phôi thừa 1,99/2/2,01 m và tồn kho lịch sử thiếu dữ liệu. Nếu chưa đối soát được thì chặn giao dịch, không tự đoán.

## Ngoài phạm vi

BOM, kế hoạch sản xuất, lịch máy, OCR trên cloud, migration tự động lên production và phát hành không giám sát.
