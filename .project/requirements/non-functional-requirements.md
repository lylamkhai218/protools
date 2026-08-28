# NON-FUNCTIONAL REQUIREMENTS (NFR)

## 1. HIỆU NĂNG & TỐI ƯU GIAO DIỆN (PERFORMANCE & UX)
- **`NFR-01.1` - Tốc độ phản hồi (INP):** Interaction to Next Paint (INP) < 200ms trên mọi thiết bị di động.
- **`NFR-01.2` - Tối ưu di động thực địa (Field-ready Touch Target):** Kích thước vùng bấm tối thiểu 48x48 pixels, không sử dụng hiệu ứng hover làm điều kiện kích hoạt duy nhất.
- **`NFR-01.3` - Adaptive Viewport:** Sử dụng `dvh` (Dynamic Viewport Height) đảm bảo thanh điều hướng và nút CTA báo giá luôn nằm trong tầm nhìn khi thanh địa chỉ trình duyệt co giãn.
- **`NFR-01.4` - Container Queries & CSS Grid:** Bảng Spec-sheet tự động chuyển đổi giữa dạng tóm tắt (Card) trên màn hình siêu nhỏ và bảng Grid đầy đủ trên màn hình rộng mà không làm vỡ layout.

## 2. AN NINH MẠNG & PHÒNG THỦ MÁY CHỦ (SECURITY & DEFENSE)
- **`NFR-02.1` - Tuân thủ WAF Imunify360:** Không sử dụng bất kỳ HTTP Bridge script hoặc endpoint nhận raw SQL query qua HTTP POST.
- **`NFR-02.2` - Kiểm soát dữ liệu đầu vào (Input Sanitization):** Toàn bộ form RFQ, tìm kiếm và API endpoints phải được validate nghiêm ngặt cả ở client và server, ngăn ngừa XSS, SQLi, CSRF.
- **`NFR-02.3` - Quản lý Secret & Credentials:** Không hardcode API key, mật khẩu database hoặc token vào repository. Sử dụng `.env` cục bộ.

## 3. TÍNH KHẢ DỤNG & ĐỘ TIN CẬY (AVAILABILITY & RESILIENCE)
- **`NFR-03.1` - Hoạt động khi mạng yếu:** Áp dụng kỹ thuật `content-visibility: auto`, nén ảnh WebP/AVIF đa phiên bản (`<picture>` / `srcset`) giúp tải nhanh tại nhà xưởng công nghiệp.
- **`NFR-03.2` - Rollback An toàn:** Quy trình deploy tích hợp sao lưu tự động trước khi ghi đè, cho phép khôi phục trạng thái ổn định trong vòng 60 giây.
