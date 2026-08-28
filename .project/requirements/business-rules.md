# BUSINESS RULES (BR) — PROTOOLS.COM.VN

## 1. QUY TẮC BÁO GIÁ & ĐẶT HÀNG B2B (PRICING & RFQ RULES)
- **`BR-01.1` - Giá hiển thị công khai:** Một số sản phẩm tiêu chuẩn hiển thị giá tham khảo; các thiết bị công nghiệp chuyên dụng hiển thị trạng thái "Liên hệ báo giá" kèm nút Thêm vào RFQ.
- **`BR-01.2` - Quy mô đơn hàng tối thiểu (MOQ):** Với một số vật tư tiêu hao (ví dụ: mảnh dao tiện hộp 10 cái), giỏ hàng tự động thiết lập bước nhảy số lượng (Step) tương ứng với quy cách đóng gói.
- **`BR-01.3` - Thông tin bắt buộc trong Form RFQ:** Yêu cầu tối thiểu: Số điện thoại hoặc Email, Tên công ty hoặc Tên người yêu cầu báo giá.

## 2. QUY TẮC DỮ LIỆU THÔNG SỐ KỸ THUẬT (SPEC-SHEET INTEGRITY)
- **`BR-02.1` - Mã SKU duy nhất:** Mỗi biến thể kích thước trong bảng Spec-sheet phải sở hữu mã sản phẩm (SKU/Part Number) duy nhất từ nhà sản xuất.
- **`BR-02.2` - Chuẩn đơn vị đo:** Toàn bộ kích thước hình học chuẩn hóa theo hệ Mét (mm), độ nhám bề mặt (\(\mu m\)), góc cắt (độ), trừ trường hợp dòng dụng cụ ren/inch đặc thù.

## 3. QUY TẮC QUẢN LÝ DỰ ÁN & TÀI LIỆU (PROJECT & DOCUMENT RULES)
- **`BR-03.1` - Xuất file danh mục dự toán:** File PDF/Excel danh mục RFQ phải tự động chèn thông tin liên hệ chính thức của T&T Vina, ngày tạo, và mã tham chiếu RFQ.
