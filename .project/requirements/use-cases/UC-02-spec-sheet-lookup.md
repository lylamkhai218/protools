# USE CASE: UC-02 — TRA CỨU BẢNG THÔNG SỐ (SPEC-SHEET GRID)

* **Use Case ID:** `UC-02`
* **Tên ca sử dụng:** Tra cứu thông số kỹ thuật đa biến thể và chọn vào giỏ báo giá
* **Tác nhân chính:** Kỹ sư hiện trường (Field Engineer), Chuyên viên thu mua
* **Mục tiêu:** Kiểm tra kích thước chính xác (đường kính, chiều dài cắt, góc xoắn, lớp phủ) và chọn số lượng trực tiếp.
* **Yêu cầu liên quan:** `FR-02.1`, `FR-02.2`, `FR-02.3`, `NFR-01.2`, `NFR-01.4`
* **Tiền điều kiện:** Người dùng đang ở trang chi tiết sản phẩm.

## LUỒNG SỰ KIỆN CHÍNH (MAIN FLOW)
1. Người dùng cuộn xem bảng thông số kỹ thuật (Spec-sheet Grid).
2. Hệ thống hiển thị bảng kích thước với đầy đủ các cột thông số và mã SKU của từng model.
3. Người dùng nhập số lượng hoặc bấm nút tăng/giảm số lượng trên dòng model mong muốn.
4. Người dùng bấm "Thêm vào danh mục báo giá" (Add to RFQ).
5. Hệ thống hiển thị thông báo thành công và cập nhật số lượng thiết bị trên biểu tượng Giỏ RFQ tại thanh điều hướng.
6. (Tùy chọn) Người dùng bấm nút "Tải Datasheet PDF" để lưu bản vẽ kỹ thuật về máy.
