# INDUSTRIAL PRECISION DESIGN SYSTEM (UI/UX SPECIFICATION 2026)

## 1. VISUAL IDENTITY & TRIẾT LÝ THIẾT KẾ
Hệ thống thiết kế **Industrial Precision** được tối ưu hóa cho người dùng kỹ thuật công nghiệp (Kỹ sư cơ khí, Quản lý phân xưởng, Chuyên viên thu mua).
- **Phong cách:** High-Functionality Corporate — Kết hợp sự chỉn chu của phần mềm doanh nghiệp với sự trực quan, sắc nét của môi trường nhà xưởng.
- **Nguyên tắc tương phản:** Độ tương phản cao (High-contrast), phân cấp bằng màu nền (Tonal Layering) thay vì bóng đổ nặng nề (Heavy Drop Shadows).

## 2. BẢNG MÀU CHUẨN (COLOR TOKENS)

| Token Name | Hex Code | Ứng dụng nghiệp vụ |
| :--- | :--- | :--- |
| **Precision Blue (Primary)** | `#00478D` / `#005EB8` | Nút hành động chính, active navigation, nhận diện thương hiệu Protools. |
| **Slate Technical (Secondary)** | `#4A5568` / `#545F72` | Nút phụ, icon kỹ thuật, đường viền phân tách bảng spec-sheet. |
| **Industrial Amber (Tertiary)** | `#E8A020` / `#634000` | Điểm nhấn trạng thái: Hàng có sẵn, Cảnh báo kỹ thuật, Lưu ý an toàn. |
| **Surface Containers** | `#F9F9FF` → `#E1E2EA` | Mặt phẳng workbench hiển thị thông số và lưới sản phẩm. |
| **Error / Critical** | `#BA1A1A` | Cảnh báo lỗi, model ngừng sản xuất (EOL). |

## 3. HỆ THỐNG TYPOGRAPHY KỸ THUẬT (DUAL-FONT STRATEGY)
1. **Headline & Label Caps:** `'Barlow Condensed', sans-serif`
   - Đặc tính cô đọng giúp hiển thị tên thiết bị cơ khí dài và thông số kỹ thuật phức tạp trong không gian hẹp mà không bị gãy dòng.
2. **Body & Data Values:** `'IBM Plex Sans', sans-serif` hoặc `'Barlow', sans-serif`
   - Đảm bảo độ phân biệt tuyệt đối giữa các con số (0 vs O, 1 vs l) trong bảng kích thước và dung sai.

## 4. QUY CHUẨN GIAO DIỆN THỰC ĐỊA (FIELD-READY UI/UX RULES)
1. **Touch Target 48x48px:** Toàn bộ nút bấm tăng giảm số lượng, thêm giỏ RFQ, bộ lọc trượt trên Mobile phải có diện tích chạm tối thiểu 48x48px để thao tác chuẩn khi đeo găng tay.
2. **Container Queries:** Bảng Spec-sheet tự động co giãn hiển thị: khi ở Sidebar hiển thị tóm tắt, khi ở luồng chính hiển thị đầy đủ Grid.
3. **Viewport động (dvh):** Thanh hành động đáy (Bottom Sticky RFQ Bar) sử dụng `height: dvh` chống che khuất trên mobile browser.
