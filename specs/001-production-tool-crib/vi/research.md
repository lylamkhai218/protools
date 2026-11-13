# Nghiên cứu và bằng chứng

## Đã biết

- Handler Office local hiện tại là `public/office/api_production.php`; scanner camera nằm tại `public/kho/index.php`.
- Graph trước đây chỉ tập trung vào `src`: 227 node, 557 cạnh, không có node Office.
- Đã cài Specify CLI 1.3.0 và graphifyy 0.9.102 qua uv vào ngày 2026-11-05.
- Integration hiện có agy 1.3.1.dev0; cần giữ template dùng chung và lịch sử skill đã chỉnh sửa.
- Môi trường kiểm tra local: PHP 8.2.35, dùng gói portable chính thức và đã xác minh SHA256. Điều này không xác nhận phiên bản PHP trên hosting.
- Kho dùng ZBar/Quagga để giải mã barcode, có crop/tăng tương phản, dọn event, tắt beep và phương án chụp ảnh tĩnh. Cơ chế so khớp hiện cho phép bỏ số 0 nên không phù hợp để xác định chính xác từng cá thể dao.

## Quyết định

- Thử OCR trong trình duyệt trước, dùng một worker và chỉ khớp chính xác; không gửi ảnh lên cloud. Chỉ thử tem QR mang cùng mã định danh nếu đánh giá thực địa OCR không đạt.
- Cơ sở dữ liệu là MariaDB 10.6. SQLite chỉ dùng cho kiểm tra nhanh logic nghiệp vụ, không thay thế nghiệm thu tranh chấp đồng thời trên MariaDB.
- Thông tin production, độ chính xác OCR trên đồ thật, danh sách nhân viên và hai ca đêm vẫn CHƯA XÁC MINH cho tới khi có bằng chứng kèm theo.
- Không đưa thông tin xác thực production/hồ sơ khách hàng vào graph; không dùng dịch vụ graph hosted, watcher hoặc hook commit.

## Điều kiện chặn phát hành

Chưa xác minh PHP/schema production, chưa đối chiếu sạch danh mục dao thật, chưa đổi khóa bí mật, chưa có fixture MariaDB cô lập được rà soát, chưa đo OCR trên hộp thật và chưa thực hiện ca có giám sát.
