# Nhật Ký Thay Đổi (Changelog & Dev Notes) - Protools B2B

Tài liệu ghi chú kỹ thuật và nhật ký cập nhật hệ thống phân phối thiết bị công nghiệp B2B **Protools.com.vn** (CÔNG TY TNHH CÔNG NGHIỆP T&T VINA).

---

## [2.3.0] - 2026-10-24

**Dịch vụ / Môi trường**: Production (`s2d34.cloudnetwork.vn` - Mắt Bão LiteSpeed) & GitHub Remote  
**Mục tiêu chính**: Triển khai toàn diện kiến trúc AI Citation & SEO Prerendering (GEO - Generative Engine Optimization), sitemap động từ MariaDB, cấu hình robots/llms cho AI crawlers, Direct Answer Blocks 40-60 từ, bảng thông số kỹ thuật HTML thẻ table thật, và shims bảo vệ AdminCP.  
**Người thực hiện**: KhaiLL & PROTOOLS-CORE-AGENT  
**Trạng thái**: Đã release production (196 files) và kiểm chứng live 100%.

### 1. Bối cảnh & Vấn đề Cần Giải Quyết (Dev Notes)
- Website chạy Single Page Application (React 19 + Vite). Khi các bot như Googlebot, GPTBot, ClaudeBot, PerplexityBot gửi request `curl` hoặc đọc mã nguồn ban đầu, server chỉ trả về `<div id="root"></div>` rỗng, khiến nội dung sản phẩm, thông số kỹ thuật và thương hiệu không được index hoặc trích dẫn vào câu trả lời AI.
- Hệ thống AdminCP cũ chạy trên PHP 5.6/MariaDB cần được bảo vệ nguyên vẹn đường dẫn và tương thích nếu môi trường máy chủ kích hoạt PHP 8.2 (LSPHP).
- Sitemap cũ là file tĩnh không tự động đồng bộ theo thời gian thực mỗi khi có sản phẩm mới hoặc cập nhật giá trong database.

### 2. Các Hạng Mục Đã Hoàn Thành

#### 2.1. Kiến Trúc Prerender Tĩnh & AI Direct Answer Blocks
- Viết mới bộ sinh snapshot [`generate_static_snapshots.py`](file:///d:/T&TVina/protools/generate_static_snapshots.py):
  - Tạo sẵn HTML tĩnh đầy đủ thẻ H1, H2, đoạn văn, danh sách link nội bộ và Schema JSON-LD.
  - Tích hợp khối văn bản **Direct Answer Block** (40-60 từ) định dạng `.direct-answer-block` ngay dưới H1 cho: Trang chủ, `/san-pham`, 15 trang danh mục, `/robot-dresspack`, `/tai-lieu`, `/gio-bao-gia`, `/lien-he`.
  - Khối câu trả lời nêu rõ: T&T Vina (MST `0108392186`, thành lập năm 2018), đại lý ủy quyền Murrplastik Medingen GmbH (Đức), Hakko, Quick, HIOS; kho hàng tại Hà Nội (Lĩnh Nam) và Hưng Yên (gần KCN Liên Hà Thái); phục vụ các nhà máy FDI lớn (VinFast Body Shop, Samsung, Foxconn, Luxshare, Canon).

#### 2.2. Bảng Thông Số Kỹ Thuật Bằng Thẻ `<table>` Thật
- Chuyển đổi dữ liệu div/flex sang thẻ `<table>` HTML chuẩn (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`) để các AI crawler (ChatGPT, Perplexity, Claude) bóc tách thông số chính xác:
  - Bảng thông số hệ thống Dresspack Robot Murrplastik R-Tec Liner: Ống dẫn PA 12, hành trình hồi vị 350-600mm, thử nghiệm mỏi > 17.7 triệu chu kỳ uốn, tiêu chuẩn chống cháy UL 94-V2.
  - Bảng đối soát so sánh trạm hàn cao tần Quick 205 ESD (150W) và Hakko FX-888D (70W).

#### 2.3. Sitemap Động Thời Gian Thực & AI Manifest
- Tạo endpoint [`public/sitemap.php`](file:///d:/T&TVina/protools/public/sitemap.php): Kết nối MariaDB `prod2e4e_db`, sinh XML 963 URL kèm thẻ `<lastmod>` theo định dạng chuẩn ISO 8601 (W3C Datetime).
- Viết lại [`public/robots.txt`](file:///d:/T&TVina/protools/public/robots.txt):
  - Cấp phép truy cập đầy đủ cho: Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
  - Chặn các vùng nhạy cảm nội bộ: `/admincp/`, `/office/`, `/kho/`, `/api/`.
  - Trỏ sitemap chuẩn về `https://protools.com.vn/sitemap.xml`.
- Khởi tạo [`public/llms.txt`](file:///d:/T&TVina/protools/public/llms.txt) và [`public/llms-full.txt`](file:///d:/T&TVina/protools/public/llms-full.txt): File manifest tóm tắt pháp nhân, danh mục phân phối, dự án tiêu biểu phục vụ việc trích dẫn của các hệ thống AI LLMs.

#### 2.4. Sửa Lỗi Chuyển Hướng 301 Canonical & Bảo Toàn Query Path
- Khắc phục lỗi `RewriteRule ^(.*)$ https://protools.com.vn/` làm mất đường dẫn khi truy cập qua HTTP hoặc `www.`.
- Sửa quy tắc thành `RewriteRule ^(.*)$ https://protools.com.vn/$1 [R=301,L]`.
- Bảo toàn tuyệt đối đường dẫn con khi người dùng hoặc bot truy cập qua HTTP hoặc tên miền phụ.

#### 2.5. Tương Thích & Bảo Mật AdminCP (PHP 8.2 Compatibility Bridge)
- Tạo file [`admincp/legacy_mysql_shim.php`](file:///d:/T&TVina/protools/admincp/legacy_mysql_shim.php): Polyfill cho các hàm cũ bị gỡ bỏ ở PHP 7/8 (`mysql_*`, `split()`, `each()`, `get_magic_quotes_gpc()`).
- Bọc lại [`admincp/uploadfile.php`](file:///d:/T&TVina/protools/admincp/uploadfile.php) đảm bảo upload file hoạt động trơn tru.
- Cập nhật `.htaccess` phân quyền nghiêm ngặt trong thư mục `admincp/`, chặn truy cập trực tiếp file nội bộ ngoài form login.

### 3. Nhật Ký Deploy & Nghiệm Thu Live (Release Audit)
- **Công cụ deploy**: Script tự động [`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py) qua FTP bảo mật (s2d34.cloudnetwork.vn).
- **Kết quả tải lên**: 196 files phát hành mới, 1.227 files tĩnh không thay đổi được bỏ qua để tối ưu tốc độ mạng.
- **Kiểm tra trực tiếp trên máy chủ live**:
  - `curl -I https://protools.com.vn/sitemap.xml` -> **HTTP 200 OK** (application/xml, LiteSpeed).
  - `curl -s https://protools.com.vn/robots.txt` -> **200 OK** (Khai báo đúng Sitemap và AI bot).
  - `curl -s https://protools.com.vn/llms.txt` -> **200 OK** (Đầy đủ hồ sơ năng lực B2B).
  - `curl -s https://protools.com.vn/` -> Có khối `direct-answer-block` và MST 0108392186.
  - `curl -s https://protools.com.vn/robot-dresspack` -> Có thẻ `<table>` R-Tec Liner.
  - `curl -I http://protools.com.vn/san-pham` -> **HTTP 301** chuyển hướng chuẩn về `https://protools.com.vn/san-pham`.

---

## [2.2.0] - 2026-10-18

**Dịch vụ / Môi trường**: Production & Staging  
**Mục tiêu chính**: Chuẩn hóa typography tiếng Việt, khắc phục lỗi vỡ dấu tiếng Việt trên font chữ web, và tối ưu hóa hệ thống lưới sản phẩm VirtualCatalogGrid.  
**Người thực hiện**: KhaiLL

### 1. Typography & Phông Chữ
- Hợp nhất phông chữ toàn trang về `Be Vietnam Pro` để triệt tiêu hoàn toàn hiện tượng lệch glyph (diacritic collision) ở các nguyên âm có dấu tiếng Việt (ê, ơ, ư, ẵ, ặ, ộ, ợ).
- Tách tiêu đề H1 thành các khối riêng biệt với khoảng dãn dòng leading cân bằng.

### 2. Giao Diện & Trải Nghiệm Sản Phẩm
- Tối ưu hóa component VirtualCatalogGrid, cải thiện khả năng render mượt mà danh mục 936 sản phẩm.
- Nâng cấp modal chi tiết sản phẩm và hỗ trợ 7 ngôn ngữ quốc tế (vi, en, zh-CN, de, ko, ja, th).
