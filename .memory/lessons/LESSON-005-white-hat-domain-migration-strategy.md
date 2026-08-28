# LESSON-005: Chiến lược Chuyển tiếp Tên miền Minh bạch (White-Hat Domain Migration)

* **Ngày ghi nhận:** 28/08/2026
* **Hệ thống:** Hostinger -> Mắt Bão LiteSpeed Multi-Domain

## Vấn đề
- Cần chuyển đổi tên miền murrplastikvn.com sang protools.com.vn/murrplastik/ mà không bị Google phạt trùng lặp nội dung (Duplicate Content) và không làm mất khách hàng cũ trước khi domain cũ hết hạn vào ngày 24/10/2026.

## Giải pháp kỹ thuật
1. **Dọn sạch nội dung trùng lặp**: Xóa toàn bộ file sản phẩm trên domain cũ, chỉ để lại 1 trang thông báo duy nhất.
2. **Đồng hồ đếm ngược 60 giây**: Cho khách hàng thời gian đọc lý do chuyển đổi và làm quen với địa chỉ mới, kèm nút 'Chuyển hướng ngay'.
3. **Bảo toàn URL con**: Dùng JS đọc window.location.pathname để khách vào link sản phẩm cũ vẫn tự động chuyển tới đúng sản phẩm tương ứng trên domain mới.
4. **Không dùng 
oindex**: Giữ index, follow kèm Canonical Tag trên domain mới để Google tập trung toàn bộ điểm chất lượng (Link Juice) về địa chỉ mới.