# Triển khai trực tiếp qua FTP và FTPS

Ngày ghi nhận: 05/11/2026.

Các script Python trong dự án có thể tải tệp trực tiếp lên hosting mà không cần mở giao diện DirectAdmin. `deploy_protools.py` hiện build và triển khai bundle vào `/public_html/murrplastik`; `deploy_office.py` tải toàn bộ `public/office`, có thể sửa `.htaccess` gốc và gọi migration/seed. Kiểm tra mã nguồn và phạm vi thực tế trước khi chạy; tên script hoặc tài liệu cũ không đảm bảo phạm vi hay backup như mô tả. `deploy_protools.py` import hàm backup nhưng không gọi hàm đó trong luồng deploy hiện tại.

Các script cũ dùng `ftplib.FTP` và có thông tin xác thực ghi cứng. FTP thông thường không mã hóa; không ghi hoặc in thông tin xác thực ra nhật ký, tài liệu hay chat. Cần thay thông tin đăng nhập và chuyển cấu hình sang nơi lưu bí mật phù hợp. `deploy_office.py` còn tắt xác thực TLS cho các request migration/seed, nên không chạy nguyên trạng cho các bản phát hành mới.

Ngày 05/11/2026, kết nối FTPS explicit tới máy chủ qua cổng 21 đã thành công với kiểm tra chứng chỉ và `prot_p()` bảo vệ kênh dữ liệu. Gói trang `/office/san-xuat/test/` đã được tải trực tiếp bằng FTPS, kiểm tra kích thước tệp và kiểm tra HTTPS. Script một lần `scratch/deploy_scan_test_ftps.py` chỉ phục vụ lần triển khai đó, bị Git ignore và từ chối chạy nếu thư mục đích đã tồn tại; không coi là công cụ deploy tổng quát hay dựa vào nó để lưu kiến thức lâu dài.

Cho tác vụ tương lai: ưu tiên kênh FTPS có kiểm tra chứng chỉ, giới hạn đúng đường dẫn được yêu cầu, kiểm tra tồn tại và sao lưu các tệp sẽ bị ghi đè, sau đó xác minh trang qua HTTPS. Tuân thủ quy tắc triển khai và cô lập trong AGENTS.md; script tổng quát và quy trình backup phải được rà soát, hoàn thiện trước khi dùng. Môi trường mạng có thể yêu cầu quyền truy cập ngoài sandbox; không mặc định dùng FTP không mã hóa khi FTPS gặp lỗi.

---

### Cập nhật 12/11/2026: Chuẩn hóa Toàn diện Giao thức FTPS Explicit (TLS PROT P)
- Máy chủ Mắt Bão (`112.78.2.34`) đóng hoàn toàn cổng 22 (SSH/SFTP), nhưng hỗ trợ hoàn hảo FTPS Explicit trên cổng 21 (`AUTH TLS`).
- Đã tập trung hóa toàn bộ logic kết nối FTPS vào module dùng chung `scripts/ftps_client.py` (`get_ftps_connection`, `ensure_remote_dir`, `safe_upload_file`, `download_remote_dir`).
- Đã chuyển đổi đồng bộ toàn bộ các script phát hành và sao lưu trọng yếu: `backup_protools.py`, `deploy_protools.py`, `deploy_production_root.py`, `deploy_office.py`, `deploy_wms_kho.py`, `deploy_preview.py`, `deploy_kho_auth_hardening.py`, `deploy_production_tool_and_wip.py`, `scripts/check_prod_ftp.py`.
- Thiết lập bộ kiểm thử tự động `scripts/verify_ftps.py` kiểm tra 5 bước (TLS handshake, PROT P, directory creation, safe upload, MD5 checksum integrity) với tỷ lệ đạt 100%.



---

### Cập nhật 13/11/2026: Xoay Vòng Mật Khẩu FTPS & Loại Bỏ Mật Khẩu Ghi Cứng (`.env.deploy`)
- Đã xoay vòng mật khẩu tài khoản `deploy@protools.com.vn` trên портал Mắt Bão S2 sau sự cố xâm nhập FTP ngày 12-13/11/2026.
- Đã loại bỏ hoàn toàn mật khẩu fallback ghi cứng trong `scripts/ftps_client.py`. Toàn bộ thông tin xác thực FTPS hiện được nạp tự động từ file `.env.deploy` (đã được bảo vệ bởi quy tắc `.env*` trong `.gitignore`).
