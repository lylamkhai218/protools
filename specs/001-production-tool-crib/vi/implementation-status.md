# Bằng chứng triển khai - 2026-11-05

Trạng thái: ĐANG TRIỂN KHAI LOCAL. CHƯA ĐƯA LÊN PRODUCTION. Task được đánh dấu hoàn tất chỉ chứng minh hành vi local đã có bằng chứng, không đồng nghĩa đã nghiệm thu thực tế hoặc production.

## Các kiểm chứng đã chạy

- Đã cài Specify CLI 1.3.0 và Graphify CLI 0.9.102; kiểm tra điều kiện đầu vào của feature thành công. Đã khôi phục tùy chỉnh skill agy ban đầu. Trạng thái integration cạnh nhau vẫn có cảnh báo metadata/manifest upstream, đã ghi trong `operations.md`; không tuyên bố là sạch.
- Đã dựng graph gồm 50 file mã nguồn, bao gồm Office/Kho, và 7 tài liệu được chọn. Đã truy vấn được vị trí mã nguồn. Một số file chỉ có entrypoint/dữ liệu không tạo node AST; phạm vi này đã được ghi rõ, không tuyên bố là bao phủ toàn bộ symbol.
- Kiểm tra cú pháp PHP 8.2.35 trên mã Office và cú pháp JavaScript đã qua.
- 45 kiểm tra nghiệp vụ SQLite cô lập đã qua: gửi lại yêu cầu, xung đột payload đổi, chặn sai quyền, tách nhận dao khỏi kiểm định, rollback lô lỗi, thu hồi quyền, sửa sai có lưu dấu vết, từ chối lượt quét hết hạn, kỹ sư đề nghị trả WIP và các mốc số dư.
- 14 kiểm tra HTTP đã qua trên PHP local: khách bị chuyển hướng/401, đăng nhập bằng mã nhân viên, danh sách dao đang giữ theo phạm vi và phân trang, không truy cập Office API thương mại, CSRF, token quét, tự nhận dao, xử lý gửi lại và từ chối payload khác.
- 3 kiểm tra phiên đã qua: polling đọc không gia hạn hoạt động, hết hạn đúng mốc 3.600 giây, thu hồi phiên.
- 6 kiểm tra quản trị nhân viên đã qua: yêu cầu Admin duyệt, giới hạn vai trò theo phạm vi, đổi mật khẩu ban đầu, khóa/thu hồi và nhật ký. Chưa tạo nhân viên thật.
- Fixture MariaDB 10.6.23 portable: chạy migration chỉ bổ sung hai lần; bảo toàn số lượng tại 0/1,99/2/2,01 m. Hai actor/kết nối tranh chấp cùng một dao cho kết quả một thành công, một 409 và chỉ một lượt mượn đang mở. Hai yêu cầu cấp cùng nguồn WIP cho một thành công, một 409 và không làm âm tồn.
- Đã đăng nhập và xem trang xưởng theo đúng phạm vi trong trình duyệt bằng fixture giả local. Chưa xác minh camera vật lý và giao diện điện thoại.
- `pnpm run lint` thành công. `pnpm run build`, tạo snapshot và sitemap 149 URL thành công khi trỏ `PROTOOLS_PYTHON` tới Python đang hoạt động.
- Công cụ rà soát literal secret trên mã Office đã qua. Giá trị cấu hình cũ được đưa ra ngoài `public/`, nhưng CHƯA đổi khóa bên ngoài.
- Đã thử OCR cục bộ trên ảnh toàn khay được cung cấp: mất 1.068 ms sau khi khởi tạo worker, điểm tin cậy 33 và văn bản nhận dạng không đáng tin. Đây chỉ là một ảnh thăm dò, không phải đo độ chính xác hay kết quả nghiệm thu theo từng hộp.

## Chưa kiểm chứng hoặc chưa hoàn tất

Chưa xác minh phiên bản PHP/schema production, chưa xoay và cấp khóa riêng, chưa có danh sách nhân viên thật và đối chiếu danh mục mã, chưa thử tối thiểu 300 lượt thực tế, chưa chạy hai ca đêm có giám sát, chưa hồi quy toàn bộ Office/điện thoại, chưa diễn tập khôi phục và phát hành. Đã triển khai và kiểm thử local thao tác sửa sai lượt cấp dao và đề nghị kỹ sư trả WIP. Đã có phân trang, tra cứu QR remnant bằng liên kết sâu và in tem; vẫn chưa kiểm thử vật lý camera/in tem và chưa nhập dữ liệu giá vốn nguồn đã xác minh. Xem các task bổ sung trong `tasks.md`.

## Truy vết yêu cầu tới task (thiết kế, không phải trạng thái hoàn thành)

Các bổ sung sau rà soát: graph hiện có 473 node/1.030 cạnh. Danh sách task còn phần cần làm về hosting thật, bằng chứng thực địa và phát hành. C004 và đề nghị trả WIP của kỹ sư hiện có bằng chứng kiểm thử local; nhập giá vốn theo nguồn vẫn chờ dữ liệu xác minh. Có task cho toàn bộ 20/20 yêu cầu (100% bao phủ ở mức thiết kế); đây KHÔNG phải 100% đã triển khai hoặc đã kiểm thử.

| Yêu cầu | Task |
|---|---|
| FR-001 | B002 |
| FR-002 | B003 |
| FR-003 | A002 |
| FR-004 | C001 |
| FR-005 | C002, F002 |
| FR-006 | D003 |
| FR-007 | D004 |
| FR-008 | A003, D001 |
| FR-009 | D002 |
| FR-010 | C003 |
| FR-011 | C004 |
| FR-012 | E001 |
| FR-013 | E002 |
| FR-014 | E003 |
| FR-015 | B004, E004 |
| FR-016 | A001, B001 |
| FR-017 | D005, F001 |
| FR-018 | T002 |
| FR-019 | T001, T003, F005 |
| FR-020 | F003, F004 |

Lưu ý kiểm tra: `git diff --check` phát hiện khoảng trắng cuối dòng vốn có trong các file Office cũ mới được đưa vào quản lý phiên bản. Không định dạng lại hàng loạt nội dung nghiệp vụ cũ chỉ để che cảnh báo nền. Cú pháp PHP, kiểm tra ứng dụng và build đã qua; không tuyên bố phần diff được staging hoàn toàn sạch whitespace.

## Cập nhật 2026-11-05 - Trang thử quét tem cô lập

- Đã thêm mã nguồn local tại `public/office/san-xuat/test/`: yêu cầu đăng nhập Office, giao diện dùng đúng font/màu Office, bố cục điện thoại, kiểm tra HTTPS/camera, hướng dẫn khắc phục quyền và màn hình đen, OCR khớp chính xác sau hai lần đọc, không ghi kho và không tải ảnh lên.
- `.htaccess` riêng của route chỉ bật camera cho chính trang này (`camera=(self)`); microphone và geolocation vẫn tắt. Không sửa `.htaccess` root hoặc chính sách Office dùng chung.
- `node --check` đã qua với JavaScript. Workspace không có PHP CLI nên chưa chạy được `php -l`. Trình duyệt local bị chuyển về màn hình đăng nhập Office, xác nhận route có chặn khách; không nhập thông tin đăng nhập.
- Chưa phát hành production. Lệnh kiểm tra từ môi trường này không đọc được site; trình duyệt chỉ tới được màn hình đăng nhập DirectAdmin. Chưa có phiên truyền file mã hóa đã xác thực. Các script phát hành đang dùng FTP thường và đích Office diện rộng nên không được dùng.
- Trước khi upload còn cần kiểm tra cú pháp/runtime PHP, fingerprint và thư viện thật trên host, backup đúng thư mục đích, xác minh header phản hồi live. Camera/OCR trên iPhone vẫn chưa được kiểm chứng. Theo dõi tại T039-T041.

### Đính chính trạng thái triển khai cuối - 2026-11-05

Bản PHP có xác thực nêu phía trên đã được thay trước khi hoàn tất bằng `public/office/san-xuat/test/index.html`. Trang cuối là HTML tĩnh, không dùng database hay đăng nhập Office vì trang sản xuất live đang có luồng truy cập khác và hiển thị khách; trang test không đưa ra dữ liệu bảo vệ và không có API ghi. Lần chuyển hướng về đăng nhập local chỉ áp dụng cho bản PHP đã bỏ. Route production và thư viện OCR hiện chưa có, nên trang tĩnh cuối vẫn chỉ ở local, chưa deploy.

### Đóng gói thư viện cô lập - 2026-11-05

Kiểm tra thêm cho thấy live cũng thiếu `/office/tool-scanner.js`. Trang test hiện dùng bản scanner và các file Tesseract đặt ngay trong `/office/san-xuat/test/`, tránh ghi đè file Office dùng chung. Theo hướng dẫn cài local của Tesseract.js 7, gói phát hành phải chứa bộ core tương thích; sẽ dùng đúng asset và mô hình tiếng Anh đã ghim phiên bản local, không tải mã OCR từ CDN bên thứ ba. Chưa xem được giao diện tĩnh cuối qua browser preview vì preview hiện chuyển về login; chưa upload file nào.

### Đã chuẩn bị gói phát hành - 2026-11-05

Gói cuối gồm trang tĩnh, header camera/CSP/cache riêng cho route, bản scanner tắt Blob worker, 22 file runtime Tesseract đã ghim phiên bản và mô hình tiếng Anh đã kiểm tra checksum. `scripts/package_office_scan_test.ps1` đã tạo `scratch/office-scan-test-release-20261105-135003/office-san-xuat-test-20261105-135003.zip`; SHA-256 gói là `310e5d9adeb65a2b62b71ba6cd8b1a95a13fc612222aecfd66473d3e5e04e8e9`. Gói chưa upload.
