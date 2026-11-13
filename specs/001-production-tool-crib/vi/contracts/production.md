# Hợp đồng API sản xuất

Mọi thao tác yêu cầu phiên đang hoạt động. Ghi dữ liệu phải dùng POST, CSRF của phiên và `Idempotency-Key`. Mã phản hồi: 401 chưa đăng nhập/đã thu hồi/hết hạn; 403 sai quyền/CSRF; 409 xung đột trạng thái hoặc payload; 422 giá trị không hợp lệ; 503 schema chưa sẵn sàng. Chi tiết SQL nội bộ chỉ ghi log riêng, không trả cho người dùng.

| Thao tác | Vai trò | Điều kiện trước / kết quả |
|---|---|---|
| `production_tool_resolve` | Người được đọc phân hệ sản xuất | Mã khớp chính xác -> định danh và điều kiện sử dụng |
| `production_tool_create` | Admin | Mã duy nhất -> tạo dao mới, tắt tự nhận dao |
| `production_tool_eligibility` | Admin | Dao đã xác minh, sẵn sàng + lý do -> bật/tắt tự nhận |
| `production_tool_relabel` | Thủ kho, Admin | Có lý do -> in lại tem và giữ nguyên định danh, ghi nhật ký |
| `production_tool_issue_reverse` | Admin | Lượt cấp nhầm còn mở + xác nhận đã nhận lại dao vật lý + lý do -> ghi sự kiện sửa bù, giữ nguyên bản chụp dữ liệu gốc |
| `production_scan_create` | Thủ kho, CNC, Admin | Dao đủ điều kiện/bản vẽ -> tạo token sắp hết hạn |
| `production_tool_checkout` | Thủ kho, Admin | Dao sẵn sàng -> mở một lượt mượn |
| `production_self_checkout` | CNC, Admin | Chỉ nhận cho chính mình, dao được phép và có lượt quét -> mở lượt mượn |
| `production_return_request` | Người đang giữ, Thủ kho, Admin | Lượt mượn của mình còn mở -> chỉ tạo đề nghị trả |
| `production_tool_checkin` | Thủ kho, Admin | Lượt mượn còn mở -> chuyển sang `INSPECTION`; giữ tương thích API cũ |
| `production_tool_batch_checkin` | Thủ kho, Admin | Tất cả hợp lệ thì nhận cả lô, nếu không thì rollback |
| `production_tool_inspect` | Người kiểm định, Admin | Đã tiếp nhận và đang chờ kiểm định -> về kho/phế liệu |
| `production_night_reconcile` | Thủ kho, Admin | Lượt cấp chưa đối soát -> chỉ ghi đối soát |
| `production_wip_advance` | Thủ kho, Admin | Nguồn đã xác minh và đủ tồn -> ghi xuất trên thẻ kho |
| `production_wip_return` | Thủ kho, Admin | Lượt cấp WIP đang mở -> ghi nhập kho/phế liệu cân bằng |
| `production_wip_return_request` | Kỹ sư đang giữ, Thủ kho, Admin | Lượt cấp đang mở -> chỉ tạo đề nghị, không đổi tồn |
| `production_remnant_resolve` | Người đọc có phạm vi phù hợp | QR khớp chính xác -> trả nguồn và số dư hiện tại, không ghi dữ liệu |
| `production_runtime` | Admin | Phiên bản PHP/DB và trạng thái sẵn sàng migration, không lộ bí mật |

Sales không được sửa dữ liệu sản xuất; kế toán và giám sát chỉ đọc theo phạm vi. Kỹ sư được đề nghị trả WIP, thủ kho xác nhận. Ghi đè của Admin phải có nhật ký và không được bỏ qua giới hạn tồn kho.
