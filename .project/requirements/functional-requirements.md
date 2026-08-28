# FUNCTIONAL REQUIREMENTS (FR)

## PHÂN HỆ 1: DANH MỤC & TÌM KIẾM SẢN PHẨM (CATALOG & SEARCH)
- **`FR-01.1` - Cây danh mục đa cấp:** Hỗ trợ duyệt danh mục thiết bị theo Ngành hàng → Nhóm sản phẩm → Dòng sản phẩm (ví dụ: Dụng cụ cắt gọt → Dao phay ngón → Dao phay Carbide 4 me).
- **`FR-01.2` - Tìm kiếm thông minh (Smart Technical Search):** Tìm kiếm theo Tên sản phẩm, Mã Model (SKU), Thương hiệu (Kyocera, OSG, Mitutoyo, Wera,...), và Thông số kỹ thuật (ví dụ: `phi 6`, `HRC 55`).
- **`FR-01.3` - Bộ lọc kỹ thuật đa chiều (Faceted Filtering):** Cho phép lọc theo Vật liệu gia công (Thép, Inox, Nhôm, Gang), Lớp phủ (TiAlN, AlCrN), Độ cứng phôi, Số me cắt.

## PHÂN HỆ 2: CHI TIẾT SẢN PHẨM & BẢNG THÔNG SỐ (SPEC-SHEET GRID)
- **`FR-02.1` - Bảng thông số đa biến thể (Multi-variant Spec Grid):** Hiển thị danh sách các mã SKU cùng dòng trong 1 bảng dạng lưới (Grid), liệt kê rõ: Đường kính cán (d), Đường kính me (D), Chiều dài cắt (l), Chiều dài tổng (L), Bán kính góc (R).
- **`FR-02.2` - Chọn trực tiếp biến thể vào giỏ RFQ:** Cho phép kỹ sư chọn nhanh số lượng cho từng mã SKU ngay trên từng dòng của bảng thông số mà không cần mở nhiều trang.
- **`FR-02.3` - Tải tài liệu kỹ thuật đính kèm:** Hiển thị nút tải Catalog PDF, Bảng thông số cắt (Cutting Data Sheet) và Chứng chỉ CO/CQ tương ứng.

## PHÂN HỆ 3: GIỎ HÀNG YÊU CẦU BÁO GIÁ (RFQ CART & PROJECT EXPORT)
- **`FR-03.1` - Quản lý giỏ hàng B2B:** Thêm/sửa/xóa mã thiết bị, cập nhật số lượng, ghi chú yêu cầu kỹ thuật riêng cho từng mã.
- **`FR-03.2` - Gửi Form RFQ:** Thu thập thông tin doanh nghiệp (Tên công ty, Mã số thuế, Người liên hệ, SĐT, Email, Tên dự án/Nhà máy).
- **`FR-03.3` - Xuất file danh mục dự toán:** Cho phép người dùng tải file PDF/Excel bảng tổng hợp thiết bị đã chọn để trình ký nội bộ công ty.

## PHÂN HỆ 4: TRUNG TÂM TÀI LIỆU (DOCUMENT CENTER)
- **`FR-04.1` - Thư viện E-Catalog:** Cho phép xem trực tuyến và tải về toàn bộ catalog của các hãng đối tác.
- **`FR-04.2` - Phân loại tài liệu:** Phân chia theo Hãng, Loại thiết bị, Cẩm nang hướng dẫn sử dụng.

## PHÂN HỆ 5: QUẢN TRỊ NỘI BỘ (ADMIN DASHBOARD)
- **`FR-05.1` - Quản lý sản phẩm & Spec-sheet:** Thêm/sửa/xóa sản phẩm, cập nhật thuộc tính kỹ thuật linh hoạt.
- **`FR-05.2` - Quản lý đơn yêu cầu báo giá:** Xem danh sách RFQ từ khách hàng, xuất dữ liệu và chuyển trạng thái xử lý (Tiếp nhận → Đang báo giá → Đã gửi báo giá → Hoàn tất).
