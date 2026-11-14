# PROJECT SNAPSHOT (ONE-PAGER)
*Last Updated: 05/10/2026*

| Hạng mục | Nội dung / Trạng thái |
| :--- | :--- |
| **Dự án** | Protools.com.vn — Nền tảng phân phối thiết bị cơ khí, dụng cụ công nghiệp B2B & Murrplastik Brand Hub |
| **GitHub Repository** | [https://github.com/lylamkhai218/protools](https://github.com/lylamkhai218/protools) |
| **Giai đoạn (Phase)** | **Phase 2: Production Root Release & System Audit Remediation Complete** |
| **Tech Stack Hiện Tại** | Frontend: React 19, TypeScript, Vite 6, Tailwind CSS v4 (Core App). Subpage: Static HTML5/CSS3/JS, Three.js 3D Viewer (`/murrplastik/`). Hosting: Mắt Bão LiteSpeed. |
| **Chỉ Số Chất Lượng (Quality Gates)** | - Desktop Performance: **97 / 100**<br>- Mobile Performance: **63 -> 85+ / 100** (Sau fix non-blocking fonts)<br>- Accessibility: **100 / 100** (Perfect Score trên cả Desktop & Mobile)<br>- Best Practices: **82 / 100** (Đạt **95-100 / 100** khi kiểm toán ẩn danh Incognito)<br>- SEO: **100 / 100** (Perfect Score)<br>- Security Headers: **100 / 100 Grade A+**<br>- AppSec Audit: **0 known vulnerabilities** (`pnpm audit`)<br>- Linter: **0 errors, 0 warnings** (`tsc --noEmit`) |
| **Mục tiêu hiện tại** | Duy trì vận hành Production Root tĩnh ổn định tại `https://protools.com.vn/`, bảo vệ an toàn `admincp/`, chuẩn bị chuyển dịch API Backend độc lập. |
| **Tasks Vừa Hoàn Thành (Sprint 05/10/2026)** | - `TASK-006`: Thẩm định toàn diện hệ thống & Lập kế hoạch khắc phục (Audit V1).<br>- `TASK-007`: An ninh ứng dụng & Gia cố Security Headers Grade A+.<br>- `TASK-008`: Chuẩn hóa HTTPS & Triệt tiêu Mixed Content toàn bộ Catalog.<br>- `TASK-009`: Chuẩn hóa mã nguồn & Tối ưu phân tách Bundle Rollup (<250 KB).<br>- `TASK-010`: Tối ưu hiển thị di động & Core Web Vitals (CLS 0.000, LCP 5.9s).<br>- `TASK-011`: Đối chiếu kiểm toán V2 & Khắc phục triệt để (Non-blocking Font, Contrast, A11y Name).<br>- `TASK-012`: Phát hành Production Mắt Bão & Đồng bộ tri thức hệ thống. |
| **Tasks Tồn Đọng (Backlog)** | - `TASK-002`: B2B Catalog Enhancement.<br>- `TASK-003`: Spec-Sheet Grid Optimization.<br>- `TASK-004`: RFQ Cart Export Flow. |
| **Blockers hiện tại** | Không có (Trang chủ Production và các phân vùng đều hoạt động ổn định `HTTP 200 OK`). |
| **Quyết định mới nhất** | - `ADR-001` đến `ADR-005`: Kiến trúc OS, Design System, WAF, Backend, Subpage Isolation.<br>- `Rule 9.95 - 9.97`: Hồ sơ kiểm toán hệ thống, khắc phục CWV/AppSec và chuẩn nạp font bất đồng bộ. |

## Update 2026-11-05 - Production tool crib (local only)

- KNOWN: feature specs/001-production-tool-crib now contains approved requirements, contracts, task status, field protocols and implementation evidence. Read implementation-status.md before further work.
- KNOWN: Specify CLI 1.3.0 and Graphify 0.9.102 installed; original agy customizations retained. Official integration status still warns about shared paths/multi-install metadata; not claimed clean.
- KNOWN: local production code now covers scoped employee login, custody/inspection separation, transactional tool issue and WIP, OCR prototype, self-checkout/reconciliation and auditable mistaken-issue reversal.
- VERIFIED LOCAL: PHP/JS syntax; 45 domain, 14 HTTP, three session and six staff-administration assertions; MariaDB 10.6.23 additive migration and independent-connection tool/WIP races; pnpm lint and full build/snapshots/sitemap.
- KNOWN: selected graph covers 50 code files and seven documents, 473 nodes / 1030 edges. No private config, dumps, customer files or bulk images indexed.
- UNVERIFIED: actual hosting runtime/schema, real inventory, rotated external secrets, physical OCR sample, mobile/full Office regression, two real night shifts and restore rehearsal. No production deploy, migration, stock transaction or real employee creation performed.
- NEXT: complete convergence tasks T029-T038. Preserve the separate untracked HANDOFF-20261104-codex-continuation.md supplied before this work.

## Update 2026-11-05 - Isolated label scanner test page

- KNOWN LOCAL: static, read-only test UI is being prepared at `public/office/san-xuat/test/`, using Office colors/type and an exact OCR check; no database/API writes or image upload.
- VERIFIED LIVE: `/office/san-xuat/test` currently falls back to the legacy CNC page. `/office/vendor/ocr/tesseract.min.js`, `/office/vendor/ocr/worker.min.js`, and `/office/production.css` return 404.
- NOT DEPLOYED: DirectAdmin is reachable at its login screen, but no authenticated encrypted upload session is available. Existing deploy scripts use plain FTP and broad paths; do not use them for this isolated page.
- NEXT: verify the dependency bundle, make a backup/absence record for the exact target, use an authenticated encrypted hosting channel, verify the isolated camera policy, then test on iPhone 13. Track in T039-T041.
- UPDATE: the isolated package is prepared at `scratch/office-scan-test-release-20261105-135003/office-san-xuat-test-20261105-135003.zip`; its English OCR model checksum was verified. Do not treat it as deployed; DirectAdmin authentication and live header checks remain open.

## Update 2026-11-05 - DirectAdmin session and isolated route inspected

- VERIFIED UI: authenticated DirectAdmin File Manager is open in the user's Thorium session at `/domains/protools.com.vn/public_html/office`.
- VERIFIED LIVE CONFIG: `office/.htaccess` routes `/san-xuat/*` to `san-xuat.php` only when the requested file and directory do not exist. The `office` directory listing contains no physical `san-xuat/` directory, so the prepared nested test route can be served directly without changing either root or Office `.htaccess`.
- VERIFIED TARGET ABSENCE: no existing `public_html/office/san-xuat/` files were present to back up or overwrite. The local archive remains scoped to `office/san-xuat/test/`.
- NOT DEPLOYED: no production files have been uploaded or edited. The project-mandated `everything-cyber-security` skill was not found in the available local skill roots or project `.agents/skills`; the project AGENTS.md requires it before hosting changes. Resume the upload after that required skill is available.

## Update 2026-11-05 - Isolated test deployed via FTPS

- CORRECTION: `everything-cyber-security` is available at `C:/Users/OS/.gemini/config/skills/everything-cyber-security/SKILL.md` and was read before deployment.
- DEPLOYED: `https://protools.com.vn/office/san-xuat/test/` contains 27 files under the previously absent isolated directory. FTPS verified the TLS certificate, protected the data channel and checked each remote file size. The temporary upload archive was removed after deployment.
- VERIFIED: the page, JS, CSS, OCR library and language model returned HTTPS 200; the response permits same-origin camera use. Browser shows the intended read-only test page. Actual iPhone camera and physical label OCR remain unverified.
- SECURITY FOLLOW-UP: existing deploy scripts contain hard-coded FTP credentials; rotate the credentials and migrate configuration to a secret store before routine automation.

## Update 2026-11-05 - Ghi nhớ triển khai trực tiếp

- Các script Python hiện có triển khai trực tiếp qua FTP, không cần giao diện DirectAdmin; các script cũ sử dụng FTP không mã hóa và chứa thông tin đăng nhập trong mã.
- FTPS đã hoạt động với kiểm tra chứng chỉ và kênh dữ liệu được mã hóa; ưu tiên dùng FTPS với phạm vi đúng yêu cầu. Xem `.memory/lessons/LESSON-006-deploy-ftp-ftps.md` trước khi chọn hoặc sửa script triển khai.
- `deploy_protools.py` hiện chỉ hướng đến `/murrplastik/` và không gọi hàm backup đã import; `deploy_office.py` có thể ghi đè toàn bộ Office, sửa cấu hình gốc và gọi migration/seed. Không chạy hai script này theo giả định về phạm vi hoặc backup mà chưa kiểm tra mã và chuẩn bị phương án phù hợp.

## Update 2026-11-05 - Khảo sát kho và sửa trang thử

- Trang `/office/san-xuat/test/` đã cập nhật: nút quét cho phép mở cửa sổ camera khi để trống mã; chế độ không nhập mã chỉ hiển thị chữ OCR để người dùng tự đối chiếu. Đã kiểm tra nút mở cửa sổ và các tệp HTTPS; chưa nghiệm thu camera/OCR trên iPhone hoặc mẫu vật. Ba tệp cũ được sao lưu trước mỗi đợt tải FTPS tại `backups/scan-test-20261105-143857` và `backups/scan-test-20261105-144035`.
- Báo cáo khảo sát cho thấy có thể mất hộp hoặc lẫn dao; đối chiếu mã khắc trên cán, không mặc định quét tem chứng minh đúng cá thể. Điều kiện phê duyệt bởi lập trình theo bản vẽ áp dụng cả ca đêm; chưa có bằng chứng local đã thực thi kiểm tra chỉ định đã duyệt. Xem `specs/001-production-tool-crib/vi/danh-gia-khao-sat-kho-dao.md`.

## Update 2026-11-05 - Thử sửa khung camera trên iPhone

- Phản hồi thực tế: iPhone hiển thị video toàn màn hình và chưa thấy OCR; chưa xác định được nguyên nhân gốc trên thiết bị. Trang đã có `playsinline` trước khi gặp lỗi.
- Bản test v3 đã phát hành qua FTPS sau backup `backups/scan-test-20261105-144932`: khung preview có chiều cao giới hạn, vùng crop khớp khung hiển thị khi video bị cắt, bổ sung trạng thái tải và lỗi, nút tiếp tục camera khi Safari chặn phát, kết quả OCR hiển thị để đối chiếu.
- Kiểm tra mô phỏng xác nhận hiển thị OCR, vùng crop và dừng camera; trang và tài nguyên v3 trả HTTPS 200. Chưa kiểm nghiệm lại camera hoặc OCR trên iPhone thật; cần phản hồi tại chỗ trước khi kết luận.

## Update 2026-11-05 - Video lỗi và kiểm chứng OCR v4

- Đã xem các khung từ video người dùng `D:/T&TVina/test web cnc.mp4`: video vào trình phát toàn màn hình, sau đó có hình trong khung nhưng OCR ra chữ sai; không phải bằng chứng bộ đọc chưa khởi chạy. Hình trong khung có vẻ không cập nhật sau khi thoát toàn màn hình.
- Bản v4 đã sao lưu tại `backups/scan-test-20261105-145654` và triển khai qua FTPS: thêm chụp/chọn ảnh tem xử lý local, giữ quét trực tiếp là lựa chọn riêng cho Safari, thêm tiếp tục camera sau thoát toàn màn hình, chỉnh OCR vùng dòng chữ. Không kết luận đã sửa hoàn toàn video trên iPhone nhúng.
- VERIFIED LIVE: tự mở trang, chọn ảnh tem tổng hợp từ local bằng UI, Tesseract thật trả `SN D4D4x50 - 081` khớp ảnh mẫu; đọc lỗi/warning trình duyệt sau xử lý không có mục nào. Ảnh mẫu chỉ dùng kiểm tra đường đi OCR, không thay thế nghiệm thu tem thật/iPhone.

## Update 2026-11-05 - Đối chiếu scanner kho và ảnh thực tế

- `/kho/` dùng ZBar WASM và Quagga2 để giải mã barcode, kèm crop, tăng tương phản và nhiều lượt đọc; không thể dùng bộ giải mã barcode để đọc tem chỉ có chữ. Đã xem mã `btnToggleCam`, `decodeCanvasWithZBar`, `startZBarLiveLoop`.
- Bản test v5 triển khai qua FTPS sau backup `backups/scan-test-20261105-150655`: ảnh có thao tác khoanh vùng bằng chạm hoặc thanh chọn, preview vùng thực đọc, OCR một dòng trên ảnh gốc và ảnh tăng tương phản; live loại lượt có confidence thấp. Không tự sửa ký tự và không ghi kho.
- VERIFIED LIVE bằng ảnh chụp màn hình thực tế người dùng cung cấp: khoanh sát dòng tem loại phần lớn chữ rác; đọc được số cuối `081` nhưng một phần mã vẫn nhầm 0/O hoặc ký tự khác. Không đạt nhận diện chính xác toàn mã. Console error/warning trong lần thử rỗng, vì sai nhận diện là giới hạn chất lượng ảnh/mô hình chứ không phải lỗi JS được ghi nhận.
- Chưa nghiệm thu OCR tự động; hướng mã máy đọc trên tem cùng định danh cá thể cần thử in nhãn và đo bằng thiết bị thực tế để đạt luồng như `/kho/`.

## Update 2026-11-05 - Thử sửa nhận dạng Ø và hiển thị live

- Người dùng báo ảnh tem đọc Ø thành @ và live không nhận mã. Đã phát hành bản v7 qua FTPS, backup tại `backups/scan-test-20261105-151649`.
- Live hiển thị cả kết quả độ tin cậy thấp kèm cảnh báo trong chế độ thử không nhập mã; chế độ khớp chính xác vẫn giữ ngưỡng và không sửa mã tự động. Logger chỉ cập nhật trong lúc khởi tạo để không ghi đè trạng thái OCR.
- Khi OCR đọc `@` hoặc dạng `x0`/`xO` trước số, giao diện đưa một gợi ý Ø có nhãn cần xác nhận, giữ nguyên bản gốc. Đây là phỏng đoán, không phải nhận dạng đã xác minh hay căn cứ tự động xuất kho.
- VERIFIED LIVE: thử ảnh screenshot người dùng cung cấp, OCR gốc `SN D4x04x50 - 081`, gợi ý `SN D4xØ4x50 - 081`, không thấy lỗi/warning trình duyệt. Chưa thử lại live cam trên iPhone; chưa xác định hoàn toàn nguyên nhân thất bại của camera thực tế.

## Update 2026-11-05 - Điều chỉnh vùng live OCR

- Người dùng xác nhận hình live chuyển động và trạng thái đang đọc nhưng không ra mã. Đã phát hành v8 qua FTPS, backup tại `backups/scan-test-20261105-152349`.
- Khung live mặc định thu hẹp và có thanh điều chỉnh độ cao; vùng OCR tính theo khung hiển thị, phóng to và luân phiên ảnh gốc/tăng tương phản như chế độ ảnh. Trạng thái hiển thị số lượt đọc. Không tự xác nhận OCR hoặc sửa mã.
- VERIFIED: JavaScript syntax và mô phỏng ít nhất hai lượt camera, crop, OCR và dừng; trang live mở cửa sổ có thanh điều chỉnh, không thấy lỗi console ban đầu. Chưa xác nhận kết quả nhận chữ live trên iPhone thật.

## Update 2026-11-05 - Xác nhận kết quả quét thử

- Đã triển khai v9 qua FTPS, backup tại `backups/scan-test-20261105-153111`. Khi OCR tự do đưa ra cùng chuỗi ở hai lượt liên tiếp đủ điều kiện, camera dừng và giao diện hỏi xác nhận; khi OCR thay đổi liên tục có nút Dừng và kiểm tra mã. Đây là chuỗi ứng viên, không chứng minh OCR đúng.
- Người dùng có thể sửa chuỗi, chủ động chọn gợi ý Ø, quét lại hoặc xác nhận. Xác nhận chỉ hiển thị trong phiên test, không ghi cơ sở dữ liệu hoặc thực hiện cấp dao.
- VERIFIED: mô phỏng hai lượt OCR ổn định dừng nhận diện, đóng camera và hiển thị ứng viên; mô phỏng xác nhận, sửa/gợi ý Ø và quét lại. Trang live tải giao diện quét v9, không có lỗi console ban đầu. Chưa kiểm tra luồng camera iPhone thật.

## Update 2026-11-05 - Barcode trên trang thử

- Đã thêm nút `Quét barcode hoặc QR` riêng trên trang test, cùng tùy chọn đọc ảnh barcode và bước xác nhận; không ghi kho. Bộ giải mã `zxing-wasm` 2.2.1 và wasm được phục vụ cục bộ, triển khai qua FTPS; backup trước bản cuối tại `backups/barcode-test-20261105-155332`.
- Phát hiện bộ ZBar 0.9.15 của `/kho/` giải mã Code 128 FNC4 mẫu `Ø` thành `X`, nên không được dùng kết quả ZBar đó cho mã đặc biệt này. Bộ ZXing đọc lại chính xác `SN D4xØ4x50 - 081` từ barcode mẫu.
- VERIFIED: UI trang production xử lý ảnh barcode mẫu, hiển thị chính xác `SN D4xØ4x50 - 081`, xác nhận giữ kết quả trong phiên; console không có error/warning trong lượt kiểm tra thành công. Các tài nguyên được đối chiếu nội dung qua HTTPS. Chưa thử camera live thực tế trên iPhone.

## Update 2026-11-09 - Phase 2 baseline execution

- A001 PARTIAL: local PHP/schema/service/HTTP/scanner file fingerprints captured in `specs/001-production-tool-crib/research.md`. Local PHP 8.2.35 was recorded by earlier evidence, but `php` is not currently available on PATH. DirectAdmin opens at the login form; live PHP/schema and remote code fingerprints remain unverified. No production DB query or write was made.
- A002 OPEN: no authoritative real box/shank inventory or signed mapping is present in the checked project files; survey summary is not reconciled with the source workbook/audio. No physical identities were inspected.
- A003 OPEN: protocol not executed; field-result and night-shift CSVs remain header-only. Synthetic images and simulations are excluded from physical acceptance counts.
- No Phase 2 checkbox was changed. Continue only with authenticated read-only hosting access and warehouse-supplied real inventory/device evidence.

## Correction 2026-11-09 - Hosting access method

- User clarified Protools uses Mắt Bão S2 and not DirectAdmin. The prior DirectAdmin login-page check was an incorrect access-path assumption, not evidence about the S2 hosting. Do not use DirectAdmin; confirm or use the authorized S2 access method for any future read-only host fingerprint.

## Correction and evidence - Mắt Bão S2 baseline - 2026-11-09

- User supplied and authorized the Mắt Bão S2 portal path; official phpMyAdmin and File Manager were inspected without writes or manual SQL.
- Hosting PHP Selector showed `8.2 (current)`. phpMyAdmin reports its own PHP runtime `8.3.36`; do not conflate those values.
- Database `prod2e4e_db` is MariaDB `10.6.23-MariaDB-cll-lve`, 88 tables. Live `tt_tool_instances` has 13 columns; live `tt_tool_movements` has 16. Live schema lacks the optional audit/self-checkout columns declared by local `production_schema.php`.
- Live `/domains/protools.com.vn/public_html/office/api_production.php` is 28.63 KB and was last modified 2026-11-02 15:10. Local working-tree file is 30,273 bytes (2026-11-05 09:08). Live listing lacks local `production_schema.php`, `production_service.php`, and `production_http.php`; remote SHA-256/content comparison is not yet complete. No migration/deploy was made.
- Phase 2 A001 remains PARTIAL; A002 remains OPEN pending warehouse-approved box/shank mapping; A003 remains OPEN pending real device measurements across >=30 boxes and >=300 reads. No Phase 2 checkbox should be closed from this evidence alone.


## Update 2026-11-13 - Google Safe Browsing Phishing Incident & Server Remediation

- ROOT CAUSE VERIFIED: Google Safe Browsing flagged `protools.com.vn` as a deceptive/phishing site after external attackers (Moroccan IPs `105.74.199.150`, `105.74.207.239`, `196.65.155.222`) used leaked FTP credentials to upload phishing kits (`/public_html/Assurance-Retraite/`, `/public_html/vb/`, `/public_html/zt/`), redirectors (`/public_html/ajax/index.php`, `/public_html/class/index.php`, `/public_html/ckeditor/skins/moono/cy/index.php`), and a 76,799-byte `/public_html/.htaccess` on Nov 12-13, 2026.
- REMEDIATED ON LIVE SERVER: Quarantined forensic evidence to `backups/safebrowsing-20261113/`; deleted all injected directories and files over FTPS; restored clean `/public_html/.htaccess` (`CHMOD 444`) with explicit `410 Gone` (`[G,L]`) rules for all removed phishing paths and `403 Forbidden` for script execution in static/legacy directories; updated `/public_html/robots.txt` and live `/public_html/office/index.php` (without deploying unfinished Phase 2 files).
- ACTION REQUIRED BY USER: Rotate FTP and hosting passwords in Mắt Bão S2 portal immediately, and submit a Security Review request in Google Search Console (`protools.com.vn`).

## Update 2026-11-13 (Round 2) - CTO Security Hardening & Live Browser Audit Pass

- **Hardened & Deployed**: Updated [`public/.htaccess`](file:///d:/T&TVina/protools/public/.htaccess) (`CHMOD 444`), [`public/office/.htaccess`](file:///d:/T&TVina/protools/public/office/.htaccess), [`public/kho/.htaccess`](file:///d:/T&TVina/protools/public/kho/.htaccess), live `/public_html/admincp/.htaccess`, [`public/api/.htaccess`](file:///d:/T&TVina/protools/public/api/.htaccess), [`public/kho/print_labels.php`](file:///d:/T&TVina/protools/public/kho/print_labels.php) (WMS session guard), [`public/office/download.php`](file:///d:/T&TVina/protools/public/office/download.php) (`realpath` containment, removed wildcard CORS), and [`public/api/submit_quote.php`](file:///d:/T&TVina/protools/public/api/submit_quote.php) (`REMOTE_ADDR` rate-limiting + untracked `db_config.local.php`). Deleted `/public_html/office/architecture_map.html` from live webroot (backed up locally in `backups/safebrowsing-20261113/audit_live/`) and scrubbed hardcoded FTP passwords from 8 local Python deploy/upload scripts. Phase 1 live `/office/` business logic files (`config.php`, `auth.php`, `api.php`, `api_production.php`, `san-xuat.php`) were intentionally untouched.
- **VERIFIED LIVE (Browser Inspector)**:
  - 6/6 active routes returned `HTTP 200 OK` with `0` console errors (`/`, `/murrplastik/`, `/robot-dresspack/`, `/office/`, `/kho/`, `/office/san-xuat/test/`), plus `/sitemap.xml` & `/robots.txt` `200 OK`; `/office/` login input placeholder confirmed free of `@t2tvina.com`.
  - 8/8 remediated phishing & 2014 PHP paths returned `HTTP 410 Gone`.
  - 15 blocked endpoints (`/error_log`, `/.htaccess`, `/admincp/error_log`, `/admincp/upload_image_ckeditor.php`, `/admincp/uploadfile.php`, `/admincp/modules/config.php`, `/kho/index.php.bak_pre_batch`, `/kho/wms_batch_service.php`, `/kho/data/wms_500kg.json`, `/kho/print_labels.php`, `/office/config.php`, `/office/auth.php`, `/office/architecture_map.html`, `/office/001_initial_schema.sql`, `/api/db_config.local.php`) returned `HTTP 403 Forbidden`; `/office/download.php` returned `HTTP 401 Unauthorized`; `/config/database.php` redirected via DirectAdmin server alias (`s2d34.cloudnetwork.vn:2222`); `GET /api/submit_quote.php` returned `HTTP 405`.
- **Remaining / Coordinate Separately**: (1) User must submit Google Search Console Security Review and rotate MariaDB `prod2e4e_user` password (previously in `submit_quote.php` Git history); (2) Legacy `/admincp/` (MD5 cookies, client-side redirect in `admincp/index.php`, referer-gated `modules/`) and gitignored `/kho/wms_batch_service.php` (shared bcrypt/token) require coordinated credential/auth upgrade; (3) Clean `backups/safebrowsing-20261113/` stays local/gitignored for incident audit trail.
- **DB Credential Rotation Complete (2026-11-13 16:08)**: Rotated MariaDB `prod2e4e_user` password on Mắt Bão S2 DirectAdmin and updated live `/public_html/api/db_config.local.php` (`CHMOD 640`, gitignored), `/public_html/office/config.php` (`DB_PASS`), and `/public_html/config/database.php` (`$db_pass`) with single-quoted PHP literals (`$01` preserved). VERIFIED LIVE: `/office/api.php?action=login` probe returned `401` JSON (DB query succeeded), `/admincp/login.php` and `/sitemap.php` returned `200 OK` without DB errors, and `/office/config.php` + `/api/db_config.local.php` remain `403 Forbidden`.
- **Pass 2 Deep Audit & Live Remediation (2026-11-14)**: Quarantined leftover Oct 2026 phishing artifacts in `/public_html/assets/cartQuotes/` (`backups/safebrowsing-20261113/forensics/october_cartQuotes_e-mypos/`) and deleted them from live server; updated [`public/.htaccess`](file:///d:/T&TVina/protools/public/.htaccess) (`CHMOD 444`) returning `410 Gone` for `/index.php`, `/assets/cartQuotes/*`, `/assets/mailernda.php` and extending static-dir script blocks; extracted WMS secrets from [`public/kho/wms_batch_service.php`](file:///d:/T&TVina/protools/public/kho/wms_batch_service.php) to server-only `/public_html/kho/wms_secrets.local.php` (`CHMOD 640`, HTTP `403`), changed `wms_resolve_current_user()` to fail-closed `GUEST` over HTTP, and hardened [`public/kho/api.php`](file:///d:/T&TVina/protools/public/kho/api.php) (Same-Origin POST guard, 10 MB MIME-checked image uploads, `wms_csv_safe_row()` CSV formula defense, role gate on `export_sapo_csv`); hardened live Phase 1 `/public_html/office/api.php` (Same-Origin POST, `405` GET-mutation guard, removed `$_GET` mutation fallbacks, `error_log()` exception masking); closed `/admincp/` unauthenticated module bypass, stale fallback DB password in `legacy_mysql_shim.php`, cookie SQLi (`number_limit`, `languagecp`), direct `content_left.php`, and login brute force (`10` fails / `5` min). Verified live via HTTPS security suite and fresh `browser` subagent (`0` console/page errors). Pending user operations: rotate Telegram bot token, assign individual passwords per WMS operator in `/kho/`, optionally scrub Git history secrets, and enforce Cloudflare Zero Trust or DirectAdmin Protected Directories on `/admincp/`, `/office/`, `/kho/`.
