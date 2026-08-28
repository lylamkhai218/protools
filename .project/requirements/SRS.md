# SOFTWARE REQUIREMENTS SPECIFICATION (SRS) — PROTOOLS.COM.VN
*Document ID: `SRS-PROTOOLS-2026`*
*Status: Active / Living Document*

## 1. MỤC ĐÍCH & PHẠM VI (PURPOSE & SCOPE)
Tài liệu SRS này xác lập toàn bộ yêu cầu chức năng, phi chức năng và quy tắc nghiệp vụ cho hệ thống số hóa nền tảng B2B Protools.com.vn của Công ty TNHH Thiết bị Công nghiệp T&T Vina.

## 2. HỆ THỐNG MÃ ĐỊNH DANH CHUẨN (STABLE IDENTIFIERS)
- `BUS-*`: Mục tiêu kinh doanh (Business Goals)
- `FR-*`: Yêu cầu chức năng (Functional Requirements)
- `NFR-*`: Yêu cầu phi chức năng (Non-Functional Requirements)
- `BR-*`: Quy tắc nghiệp vụ (Business Rules)
- `UC-*`: Ca sử dụng (Use Cases)
- `ADR-*`: Quyết định kiến trúc (Architecture Decision Records)
- `TASK-*`: Tác vụ thực thi (Tasks)
- `TEST-*`: Ca kiểm thử (Test Cases)

## 3. MỤC TIÊU KINH DOANH (BUSINESS GOALS)
- `BUS-01`: Số hóa quy trình tra cứu thông số kỹ thuật và báo giá cho hơn 5.000 thiết bị cơ khí, dụng cụ công nghiệp.
- `BUS-02`: Giảm 70% thời gian tạo danh mục yêu cầu báo giá cho kỹ sư hiện trường và chuyên viên thu mua nhà máy.
- `BUS-03`: Nâng cao hình ảnh thương hiệu công nghiệp hiện đại, chuyên nghiệp, tạo lợi thế cạnh tranh B2B tại thị trường Việt Nam.

## 4. TÓM TẮT YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS OVERVIEW)
- `FR-01`: Danh mục sản phẩm công nghiệp phân tầng đa cấp (Dụng cụ cắt, Đầu kẹp, Dụng cụ đo, Thiết bị cầm tay).
- `FR-02`: Bảng tra cứu thông số kỹ thuật (Spec-sheet Grid) động, hỗ trợ lọc đa tiêu chí (Vật liệu gia công, Đường kính, Chiều dài, Thương hiệu).
- `FR-03`: Giỏ hàng Yêu cầu Báo giá (RFQ Cart) không yêu cầu thanh toán trực tuyến, hỗ trợ xuất danh mục báo giá dự án (PDF/Excel).
- `FR-04`: Trung tâm tài liệu kỹ thuật (Document & Catalog Center) tải file PDF Datasheet, CO-CQ, Hướng dẫn vận hành.
- `FR-05`: Bảng điều khiển quản trị (Admin Dashboard) quản lý sản phẩm, thông số kỹ thuật và đơn yêu cầu báo giá RFQ.

## 5. TÓM TẮT YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)
- `NFR-01`: Tối ưu hóa di động thực địa: Interaction to Next Paint (INP) < 200ms, Touch Target ≥ 48x48px.
- `NFR-02`: An toàn hệ thống: Chống SQL Injection, XSS, CSRF, tuân thủ WAF Imunify360.
- `NFR-03`: Tính khả dụng: Hoạt động mượt mà trên mạng 3G/4G chập chờn tại xưởng sản xuất (Adaptive Loading).

## 6. CHI TIẾT CÁC PHẦN LIÊN QUAN
- Xem chi tiết [Functional Requirements](file:///d:/T&TVina/protools/.project/requirements/functional-requirements.md)
- Xem chi tiết [Non-Functional Requirements](file:///d:/T&TVina/protools/.project/requirements/non-functional-requirements.md)
- Xem chi tiết [Business Rules](file:///d:/T&TVina/protools/.project/requirements/business-rules.md)
