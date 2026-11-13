# Kế hoạch triển khai

## Bối cảnh kỹ thuật

Office hiện dùng PHP/PDO và MariaDB 10.6; giao diện dùng JavaScript thuần; website công khai React/Vite là hệ thống riêng. Giữ cú pháp tương thích PHP 5.6 cho đến khi xác minh phiên bản trên hosting.

## Kiểm tra theo quy định dự án

Không dùng SQL bridge; không tạo dữ liệu thử trong production; dùng câu truy vấn có tham số; chỉ bổ sung kiến thức, không xóa lịch sử; không đưa bí mật vào Git/Graph; backup trước phát hành. Giới hạn bốn tài khoản chỉ được mở rộng cho nhân viên xưởng có thật và được duyệt.

## Trình tự bàn giao

T01-T02 công cụ và bằng chứng -> A xác minh hiện trạng -> B quyền truy cập -> C quản lý dao -> D quét/ca đêm và E WIP -> F nghiệm thu/phát hành. Cổng OCR thực địa A sẽ chặn triển khai scanner cho vận hành, nhưng không chặn phát triển local hoặc luồng WIP.

## Giao diện và dữ liệu

Xem `contracts/production.md` và `data-model.md`. Giữ tương thích các API đọc cũ; API check-in cũ chỉ tiếp nhận dao trả về, không được bỏ qua kiểm định. Ghi idempotency trong cùng giao dịch với cập nhật nghiệp vụ. Khóa các thực thể theo thứ tự đã sắp xếp khi xử lý theo lô.

## Kiểm chứng và triển khai

Trước hết chạy kiểm tra cú pháp và nghiệp vụ local; tiếp theo kiểm tra migration/tranh chấp đồng thời trên MariaDB; sau đó thử OCR mẫu và các ca có giám sát. Chỉ triển khai qua `deploy_protools.py` sau khi đủ điều kiện. Build Vite thành công không đồng nghĩa sẵn sàng phát hành. Chỉ rollback ứng dụng khi schema tương thích; không khôi phục đè lên giao dịch kho mới nếu chưa có phương án đối soát được duyệt.
