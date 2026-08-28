# LESSON-001: ĐẶC TÍNH VẬN HÀNH & BỘ ĐẾM AUTO-BAN CỦA IMUNIFY360 WAF

## 1. CƠ CHẾ KHÓA IP CỦA TƯỜNG LỬA IMUNIFY360
- Khi vi phạm Rule `CRITICAL` (như `77218530`), WAF kích hoạt khóa IP tạm thời (Graylist / Temporary Block) tại tầng Daemon của hệ thống.
- **Thời gian khóa (Auto-Ban TTL):** Mặc định **15 đến 30 phút** kể từ request vi phạm cuối cùng.
- **Lưu ý đặc biệt:** Nếu IP bị khóa tiếp tục gửi thêm request tới máy chủ trong thời gian đang bị block, bộ đếm thời gian (TTL Timer) sẽ bị **reset** và kéo dài thêm thời gian bị ban.

## 2. GIẢI PHÁP MỞ KHÓA TỨC THÌ (ZERO-WAIT RECOVERY)
1. **Phương pháp 1 (Nhanh nhất - 10 giây):** Bật VPN hoặc phát 4G từ điện thoại để nhận IP sạch mới.
2. **Phương pháp 2 (1 phút):** Đăng nhập cổng quản trị khách hàng `id.matbao.net`, tìm dịch vụ hosting và bấm nút "Mở khóa IP bị chặn bởi tường lửa".
