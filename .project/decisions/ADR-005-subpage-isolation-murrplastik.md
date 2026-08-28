# ADR-005: Chiến lược Triển khai Cô Lập Phân Vùng Trang Con (Subpage Isolation) Murrplastik Hub

* **Trạng thái:** Accepted
* **Ngày quyết định:** 2026-08-28
* **Người quyết định:** Lead Architect & CTO
* **Phạm vi:** Hosting, Routing, Releases, Brand Hub

---

## 1. Bối cảnh & Vấn đề (Context & Problem Statement)

1. T&T Vina cần chuẩn bị thay thế tên miền murrplastikvn.com (sắp hết hạn vào tháng 10/2026) theo yêu cầu bảo hộ thương hiệu từ hãng Murrplastik GmbH (Đức).
2. Website chính protools.com.vn hiện vẫn đang chạy hệ thống PHP CMS cũ phục vụ bán hàng hàng ngày.
3. Cần chuyển giao toàn bộ mã nguồn, tài liệu kỹ thuật, 3D viewer từ D:\T&TVina\murrplastik_code về đường dẫn https://protools.com.vn/murrplastik/ để test và vận hành mà:
   - **Tuyệt đối không làm gián đoạn** hoạt động của website chính trên trang chủ.
   - **Không ghi đè** index.html hoặc cấu hình rewrite ở root public_html.

---

## 2. Quyết định Kỹ thuật (Decision)

Áp dụng mô hình **Subpage Isolation Architecture**:
1. **Phân vùng vật lý**: Đặt toàn bộ tài nguyên của Murrplastik vào thư mục con riêng biệt /public_html/murrplastik/ trên máy chủ Mắt Bão.
2. **Bypass Rewrite ở Root**: Khai báo RewriteRule ^murrplastik(/.*)?$ - [L] trong file .htaccess tại root để chuyển toàn quyền xử lý cho thư mục con.
3. **Dedicated Sub-Routing**: Cấu hình .htaccess riêng bên trong /public_html/murrplastik/ với RewriteBase /murrplastik/ xử lý định tuyến URL sạch và browser caching.

---

## 3. Hệ quả (Consequences)

### Tích cực:
- Trang chủ protools.com.vn tiếp tục chạy 100% bình thường trên PHP CMS cũ.
- Phân vùng https://protools.com.vn/murrplastik/ hoạt động độc lập, đầy đủ 5 nhóm sản phẩm, 2 ngành công nghiệp, tin tức và 3D viewer.
- Tách biệt hoàn toàn rủi ro triển khai giữa các mảng kinh doanh.

### Lưu ý vận hành:
- Khi deploy Murrplastik Hub, chỉ đồng bộ vào /public_html/murrplastik/.
- Khi deploy website Protools mới trong tương lai, tuân thủ không ghi đè vào thư mục con này.