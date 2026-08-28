# USE CASE: UC-01 — DUYỆT DANH MỤC & TÌM KIẾM THIẾT BỊ

* **Use Case ID:** `UC-01`
* **Tên ca sử dụng:** Tra cứu và tìm kiếm thiết bị công nghiệp
* **Tác nhân chính:** Kỹ sư hiện trường, Chuyên viên thu mua
* **Mục tiêu:** Nhanh chóng định vị đúng mã dụng cụ hoặc dòng sản phẩm theo thông số kỹ thuật hoặc mã SKU.
* **Yêu cầu liên quan:** `FR-01.1`, `FR-01.2`, `FR-01.3`
* **Tiền điều kiện:** Người dùng truy cập trang chủ hoặc trang danh mục sản phẩm.

## LUỒNG SỰ KIỆN CHÍNH (MAIN FLOW)
1. Người dùng nhập từ khóa tìm kiếm (mã SKU, tên dụng cụ hoặc thông số như "dao phay phi 6") hoặc chọn danh mục từ menu.
2. Hệ thống hiển thị danh sách sản phẩm phù hợp tức thời với bộ lọc kỹ thuật bên trái (hoặc bộ lọc trượt trên mobile).
3. Người dùng chọn lọc theo thương hiệu hoặc vật liệu gia công (ví dụ: Inox / Thép sau nhiệt).
4. Hệ thống cập nhật danh sách sản phẩm thỏa mãn tiêu chí trong thời gian < 200ms.
5. Người dùng nhấp vào thẻ sản phẩm để chuyển sang trang chi tiết bảng thông số (Spec-sheet).

## LUỒNG NGOẠI LỆ (EXCEPTION FLOW)
- *3a. Không tìm thấy kết quả:* Hệ thống gợi ý danh mục liên quan gần nhất và hiển thị nút "Yêu cầu tư vấn tìm mã đặc biệt".
