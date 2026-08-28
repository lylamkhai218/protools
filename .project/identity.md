# PROJECT IDENTITY — PROTOOLS.COM.VN

## 1. TỔNG QUAN DỰ ÁN
* **Tên dự án:** Protools.com.vn (B2B Industrial Equipment & Tooling Platform)
* **Chủ quản:** Công ty TNHH Thiết bị Công nghiệp T&T Vina (T&T Vina Industrial Co., Ltd)
* **Website hiện hữu:** `https://protools.com.vn/`
* **GitHub Repository:** [https://github.com/lylamkhai218/protools](https://github.com/lylamkhai218/protools)
* **Mục tiêu cốt lõi:** Xây dựng nền tảng số hóa B2B hiện đại, tốc độ cao, phục vụ tra cứu thông số kỹ thuật (Spec-sheet), quản lý danh mục thiết bị dự án và quy trình Yêu cầu báo giá (Request for Quote - RFQ) cho ngành công nghiệp chế tạo, cơ khí chính xác tại Việt Nam.

## 2. ĐỐI TƯỢNG NGƯỜI DÙNG MỤC TIÊU (PERSONAS)
1. **Kỹ sư hiện trường (Field Engineers / Factory Technicians):**
   - Môi trường thao tác: Nhà máy, công trường, 92% sử dụng thiết bị di động (Mobile).
   - Nhu cầu: Tra cứu kích thước, vật liệu, độ cứng, dung sai, hình ảnh chi tiết máy và sơ đồ kỹ thuật cực nhanh ngay cả khi mạng 3G/4G yếu.
   - Thao tác: Cần Touch Target lớn (≥ 48x48px) để bấm chuẩn khi đeo găng tay bảo hộ.
2. **Chuyên viên / Trưởng phòng Thu mua (Procurement Officers / Purchasing Managers):**
   - Môi trường: Máy tính để bàn (Desktop / Laptop) tại văn phòng.
   - Nhu cầu: So sánh nhiều model thiết bị, tải datasheet / CO-CQ / hóa đơn chứng từ, tổng hợp danh mục cần mua thành giỏ RFQ và xuất file PDF/Excel gửi yêu cầu báo giá cho nhà máy.
3. **Ban Quản trị & Kinh doanh T&T Vina (Admin / Sales Team):**
   - Quản lý danh mục sản phẩm, cập nhật thông số kỹ thuật đa chiều, tiếp nhận và phản hồi báo giá RFQ tức thì.

## 3. NGUYÊN TẮC THIẾT KẾ & VẬN HÀNH (CORE VALUES)
* **Industrial Precision:** Giao diện sắc nét, thông số dạng lưới (Grid), phân cấp rõ ràng, thẩm mỹ công nghiệp hiện đại (High-Functionality Corporate).
* **Zero-Assumption Architecture:** Mọi quyết định kỹ thuật phải được ghi nhận rõ ràng vào `.project/decisions/` (ADR).
* **Enterprise Security:** Tuân thủ nghiêm ngặt bảo mật hạ tầng Mắt Bão, tường lửa Imunify360 WAF, không sử dụng script trung gian nguy hiểm.
