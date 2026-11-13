# Mô hình dữ liệu

- Người dùng: giữ nguyên `id` và email; `employee_code` duy nhất, có thể null; `workshop_role` tách riêng khỏi quyền Office; có `session_version` và `must_change_password`. Không tạo email giả hay nhân viên mẫu.
- Cá thể dao: dùng `id/code/status/location` hiện có; `self_checkout_enabled` mặc định false. Bản ghi đáng ngờ phải được đối soát.
- Lượt dịch chuyển: lưu ID người cấp/người nhận/người kiểm định cùng tên hiển thị lịch sử; tách đề nghị trả và tiếp nhận vật lý khỏi hoàn tất kiểm định.
- Nhật ký: chỉ ghi nối thêm người thực hiện/thao tác/thực thể/trước/sau/lý do/thời gian. Sửa sai được ghi thành sự kiện bù.
- Yêu cầu: khóa duy nhất actor+action+key, SHA256 của payload và kết quả đã lưu. Cùng key nhưng payload khác trả 409.
- Phiên quét: hash của token khó đoán, người thực hiện/dao/bản vẽ, hết hạn sau 120 giây và chỉ dùng một lần.
- WIP: mã hàng/nguồn cha, chiều dài số nguyên cố định theo đơn vị 0,01 m, tách tiêu hao/nhập lại/phế liệu và tham chiếu thẻ kho. Không chuyển đổi tồn khi đơn vị chưa xác minh.
- Đối soát: mã lượt dịch chuyển duy nhất, người/thời gian/ghi chú; không cấp trùng.
- Ảnh: tên file ngẫu nhiên không lộ thông tin, xác minh MIME/kích thước, giữ 90 ngày, chỉ đọc bởi người có quyền.
