# Nhật Ký Thay Đổi (Changelog & Dev Notes) - Protools B2B

Tài liệu ghi chú kỹ thuật và nhật ký cập nhật hệ thống phân phối thiết bị công nghiệp B2B **Protools.com.vn** (CÔNG TY TNHH CÔNG NGHIỆP T&T VINA).

---

## [2.4.0] - 2026-10-31

**Dịch vụ / Môi trường**: Production (`s2d34.cloudnetwork.vn` - Mắt Bão LiteSpeed) & GitHub Remote  
**Mục tiêu chính**: Ra mắt bộ công cụ Digital Toolbox mới - Cấu hình Khung Luồn Cáp Có Đầu Cắm KDL 2D CAD & Cấu hình Tấm Màng Luồn Cáp KDP On-Demand Murrplastik; Chuẩn hóa bản địa hóa 7 ngôn ngữ (vi, en, de, zh-CN, ja, ko, th) toàn hệ thống và tối ưu công thái học bản vẽ CAD.  
**Người thực hiện**: KhaiLL & PROTOOLS-CORE-AGENT  
**Trạng thái**: Đã nghiệm thu code, xác thực build 100% không lỗi và release Production.

### 1. Bối cảnh & Vấn đề Cần Giải Quyết (Dev Notes)
- Doanh nghiệp cần trang bị công cụ cấu hình trực quan 2D CAD cho 2 dòng sản phẩm luồn cáp công nghiệp chủ lực của Murrplastik:
  - Khung luồn cáp chia đôi KDL (cho cáp đã đúc sẵn đầu cắm / đầu jack kết nối).
  - Tấm màng luồn cáp KDP (cho cáp tiêu chuẩn không đầu cắm, mật độ dây cao).
- Bản vẽ CAD ban đầu gặp hiện tượng lệch tâm (offset) trên khung vẽ, viền vòng tròn đường kính phi bị rung giật khi hover chuột, và cần tích hợp video hướng dẫn thực hành chính hãng.
- Giao diện đa ngôn ngữ gặp hiện tượng rơi vào bẫy chuỗi fallback tĩnh (Static String Fallback Trap) ở một số khu vực trọng yếu (banner giao hàng KCN, thông tin địa chỉ công ty, dòng sản phẩm MSV và các bước wizard cấu hình).

### 2. Các Hạng Mục Đã Hoàn Thành

#### 2.1. Cấu Hình Khung Luồn Cáp KDL 2D CAD (`/kdl`)
- Xây dựng component trực quan [`KdlConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/KdlConfigurator.tsx) với luồng 4 bước chuẩn công nghiệp:
  1. Chọn Hệ Thống Khung & Quy Cách Lỗ Khoét (KDL/E, KDL/E+, KDL/C-D-H, KDL/D-mono với chuẩn khoét 16-pin / 24-pin Heavy Duty Connectors).
  2. Khai Báo Danh Mục Cáp (nhập đường kính phi, số lượng, tự động ánh xạ đệm luồn KDT/ZE hoặc nút bít BTK).
  3. Bản Vẽ 2D CAD Trực Quan Hóa Tức Thời (tính toán viewBox căn giữa chính xác, chia slot nhỏ/vừa/lớn, chống rung giật chuột bằng CSS pointer-events và hover debouncing).
  4. Bảng Kê BOM & Đề Xuất Báo Giá (tính toán số lượng khung, đệm luồn, nút bít, xuất mã CAD và thêm vào giỏ hàng RFQ).
- Nhúng video hướng dẫn thực hành cấu hình KDL từ Murrplastik (`https://youtu.be/uyH7Bd3pnx0`).

#### 2.2. Cấu Hình Tấm Màng Luồn Cáp KDP On-Demand (`/kdp`)
- Xây dựng component [`KdpConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/KdpConfigurator.tsx):
  - Hỗ trợ các dòng tấm màng KDP/N, KDP/R, KDP/X, KDP on-demand nhôm / inox / nhựa PA.
  - Tự động tính toán ma trận phân bổ lỗ khoét và mật độ điền đầy (Fill Density) theo tiêu chuẩn DIN EN 60204-1.
  - Kiểm soát cấp bảo vệ IP65 / IP69K và tự động sinh bản vẽ kích thước lắp đặt.

#### 2.3. Bản Địa Hóa Toàn Diện 7 Ngôn Ngữ (Global i18n Sync)
- Đồng bộ từ điển cho cả 7 ngôn ngữ (`vi`, `en`, `de`, `zh-CN`, `ja`, `ko`, `th`):
  - Khắc phục bẫy fallback tĩnh ở Banner SLA Logistics (`logistics.*`) trên Trang Chủ.
  - Cập nhật bản dịch đầy đủ 7 ngôn ngữ cho 30 dòng sản phẩm Murrplastik trong [`productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts), bao gồm `MP-FAM-MSV`.
  - Chuẩn hóa đa ngôn ngữ cho địa chỉ Trụ sở chính & Kho hàng Lĩnh Nam trên Header và Footer.
  - Tích hợp `getLocalizedProduct()` vào bộ gợi ý tìm kiếm tức thời trên [`Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx) và màn hình giỏ hàng [`CartQuote.tsx`](file:///d:/T&TVina/protools/src/pages/CartQuote.tsx).

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
