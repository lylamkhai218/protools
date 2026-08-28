# REQUIREMENT TO TEST MAPPING

| Test ID | Requirement ID | Loại kiểm thử | Quy trình kiểm thử (Test Case) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| `TEST-01` | `FR-01.1` | UI / Functional | Kiểm tra điều hướng danh mục từ Home sang danh sách sản phẩm | Passed |
| `TEST-02` | `FR-01.2` | Functional | Nhập mã SKU hoặc kích thước "phi 6", kiểm tra hiển thị kết quả | Passed |
| `TEST-03` | `FR-02.1` | Spec Grid | Kiểm tra bảng thông số render đầy đủ các cột D, d, l, L trên mobile | Passed |
| `TEST-04` | `FR-03.1` | Cart State | Thêm 3 biến thể khác nhau vào giỏ RFQ, reload trang và xác nhận giỏ không bị mất | Passed |
| `TEST-05` | `FR-03.3` | Export | Bấm xuất bảng dự toán PDF, kiểm tra nội dung file có logo và hotline | Planned |
| `TEST-06` | `NFR-01.2`| UX / Touch | Dùng Chrome DevTools Mobile View kiểm tra kích thước bounding box nút bấm ≥ 48px | Passed |
| `TEST-07` | `NFR-02.1`| Security | Quét mã nguồn đảm bảo không có file `ntunnel*.php` hoặc câu truy vấn `information_schema` qua POST | Verified |
