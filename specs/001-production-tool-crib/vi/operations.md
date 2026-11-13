# Hướng dẫn local và quy tắc an toàn phát hành

## Công cụ đã cài

Specify CLI 1.3.0 (tag chính thức), Graphify 0.9.102 (gói chính thức), PHP 8.2.35 portable và MariaDB 10.6.23 portable. Runtime PHP/MariaDB thử nghiệm nằm trong `scratch` bị Git bỏ qua; chúng không nâng cấp server.

Codex và agy đều được đăng ký. Đã phục hồi các tùy chỉnh Spec Kit skill từ bản sao lưu trước khi cài; giữ nguyên hạ tầng dùng chung. `specify integration status` vẫn báo cảnh báo metadata multi-install agy và đường dẫn/manifest dùng chung; không gọi trạng thái này là sạch, không force-upgrade hoặc gỡ cài đặt các skill dùng chung. Công cụ tìm prerequisite và các skill hoạt động. Đã xóa hook rỗng mà trình cài Graphify thêm cho Codex; không cài watcher hay commit hook.

## Kiểm tra local

- Chạy `scratch/php/php.exe tests/production_domain.php`.
- Chạy `scratch/php/php.exe tests/production_fixture.php` trước các test HTTP/phiên. Đây là fixture giả, chỉ dùng local.
- Chạy PHP chỉ trên `127.0.0.1:8765`, đặt `TTVINA_TEST_SQLITE` trỏ tới `scratch/production-test.sqlite` và dùng `tests/production_router.php` làm router. Sau đó chạy `tests/production_http_test.py` và `tests/production_session.php`.
- `tests/production_race.py` cần runtime MariaDB cô lập trên `127.0.0.1:33316`. Script chỉ reset cơ sở dữ liệu tên cố định `protools_test_20261105`, không dùng thông tin Office và kiểm tra nhiều actor/kết nối riêng biệt.
- Chạy `pnpm run lint` và `pnpm run build`. Nếu Windows không mở được Python alias, đặt `PROTOOLS_PYTHON` trỏ tới file thực thi Python 3. Script chạy không cần sửa PATH hệ thống.
- Dùng `scripts/prepare-office-assets.ps1` để chuẩn bị OCR/QR đã ghim phiên bản từ `tools/office-assets/package-lock.json`. SHA256 model OCR được ghim trong `model.json`. Tài nguyên được host cùng ứng dụng, không tải từ CDN khi chạy.
- Dùng Python trong môi trường Graphify để chạy `scripts/refresh_production_graph.py`, sau đó chạy `graphify export html`. Tra vấn graph trước khi tìm mã liên quan, rồi xác minh lại mã nguồn trước khi sửa.

## Cấu hình và phát hành

Hằng số riêng đã được đưa khỏi mã công khai vào `office.config.local.php` bị Git bỏ qua, nằm ngoài `public/`. Giá trị được giữ nguyên, CHƯA đổi khóa bên ngoài. Production cần tự đổi khóa và cấp cấu hình riêng ngoài webroot, chọn qua `TTVINA_CONFIG_FILE`. Tuyệt đối không chép file bí mật local vào `dist` hoặc Git.

Thay đổi schema chỉ được bổ sung, không tạo seed. `scripts/migrate_production.php` chỉ chạy qua CLI để kiểm tra cô lập/local. Không chạy migration production qua HTTP bridge. Quản trị DB production phải theo quy trình DirectAdmin/phpMyAdmin của dự án với migration đã rà soát và backup.

Chưa được deploy worktree này. Phiên bản hosting/schema, danh mục thật, hồi quy Office đầy đủ, đánh giá camera thực tế, hai ca đêm và diễn tập restore vẫn là điều kiện phát hành. Chỉ dùng `deploy_protools.py` sau khi đủ điều kiện và kiểm tra cả cấu hình bảo vệ lẫn tài nguyên vendor. Không hạ schema hoặc khôi phục đè lên giao dịch tồn kho mới nếu chưa có phương án đối soát được duyệt.

## Quản trị nhân viên

`scripts/production_staff.php` nhận JSON từ stdin, không truyền mật khẩu trong tham số lệnh. Cần mã/tên nhân viên thật, vai trò xưởng được duyệt, ID Admin đang hoạt động phê duyệt, lý do và mật khẩu khởi tạo dài 12-72 byte; email là tùy chọn nhưng nếu có phải là email thật. Khóa nhân viên theo cùng quy trình đã rà soát, tăng `session_version` và xuất danh sách dao/WIP cần bàn giao. Trong đợt triển khai này chưa tạo hoặc khóa nhân viên thật.

## Thời hạn giữ ảnh

Ảnh JPEG dùng tên do server tạo trong `storage/production-evidence` bị chặn truy cập trực tiếp; chỉ đọc qua `production_evidence` sau khi xác thực quyền/người thực hiện. `scripts/purge_production_evidence.php` xóa ảnh JPEG tên ngẫu nhiên quá 90 ngày. Chỉ lên lịch sau khi được rà soát qua quản trị server; chưa tự cài cron.
