# BẢN BÀN GIAO DỰ ÁN PROTOOLS B2B (DÀNH CHO CODEX AGENT)
- **Ngày tạo**: 2026-11-04 15:30 ICT
- **Thư mục dự án**: `D:\T&TVina\protools`
- **Tên miền Production**: `https://protools.com.vn` (CÔNG TY TNHH CÔNG NGHIỆP T&T VINA)
- **GitHub Remote**: `https://github.com/lylamkhai218/protools`

---

## 1. MỤC TIÊU DỰ ÁN (OBJECTIVES)

1. **[ĐÃ XÁC MINH] Vận hành & Mở rộng Nền tảng B2B Đa ngôn ngữ**:
   - Duy trì và phát triển SPA B2B phân phối thiết bị công nghiệp (Murrplastik, Hakko, Quick, HIOS, dụng cụ bơm keo, mũi vít, kính hiển vi QC) hỗ trợ đầy đủ 7 ngôn ngữ (`vi`, `en`, `de`, `zh-CN`, `ja`, `ko`, `th`).
2. **[ĐÃ XÁC MINH] Bộ Công cụ Kỹ thuật Số (Digital Toolbox)**:
   - Cung cấp 3 trình cấu hình trực tuyến chuẩn hãng Murrplastik: Robot Dresspack (`/robot-dresspack`), Khung luồn cáp có đầu cắm KDL 2D CAD (`/kdl`), Tấm màng luồn cáp KDP On-Demand (`/kdp`), kết nối trực tiếp vào giỏ báo giá RFQ (`/gio-bao-gia`).
3. **[ĐÃ XÁC MINH] Tối ưu SEO/GEO (Generative Engine Optimization) & Hiệu năng**:
   - Đảm bảo 100% sản phẩm và danh mục được pre-render ra HTML tĩnh (Zero-Flash Architecture) kèm Direct Answer Blocks, bảng `<table>` thật, `sitemap.xml` động và `llms.txt` cho AI crawlers.
4. **[ĐÃ XÁC MINH] Khắc phục tình trạng phình to & chậm của Repository**:
   - Dọn dẹp các tệp rác, thư mục sao lưu nặng hàng GB nằm trong working tree, commit và phát hành đợt nạp 13 dòng sản phẩm mới (ngày 04/11/2026).

---

## 2. TIẾN ĐỘ HIỆN TẠI (CURRENT PROGRESS)

### 2.1. Hạng mục đã hoàn thành & Đã lên Production [ĐÃ XÁC MINH qua `git log` & `CHANGELOG.md`]
1. **Commit `8d60ef3` & `bf4400f` (31/10/2026)**: Hoàn tất KDL 2D CAD Configurator (`/kdl`) và KDP Configurator (`/kdp`), căn chỉnh đồng tâm động SVG, triệt tiêu lỗi giật hover (`Zero-Jitter`), tích hợp video hướng dẫn và đồng bộ 7 ngôn ngữ.
2. **Commit `7943766` (28/10/2026)**: Chuẩn hóa 100% email doanh nghiệp thành `info@t2tvina.com` trên toàn bộ mã nguồn, Schema JSON-LD và AI Manifests.
3. **Commit `dc25100` & `1a646a2` (28/10/2026)**: Tách cụm biến thể Murrplastik (`MP-FAM-MSV`, `MP-FAM-FHS`, `MP-FAM-ET`, `MP-FAM-KA`, `MP-FAM-KDT`, v.v.) và sửa lỗi ảnh đại diện rỗng (1.306 bytes) của dòng xích EVOCHAIN bằng ảnh chụp kho thực tế.
4. **Release 2.3.0 (24/10/2026)**: Triển khai hệ thống Pre-render tĩnh (`generate_static_snapshots.py`), `public/sitemap.php`, `public/llms.txt` và `admincp/legacy_mysql_shim.php` (tương thích PHP 8.2).

### 2.2. Hạng mục đang dở dang trên Working Tree (Chưa Commit) [ĐÃ XÁC MINH qua `git status`]
1. **Đợt nạp 13 dòng sản phẩm mới (04/11/2026)**:
   - Đã cập nhật dữ liệu cho 13 dòng sản phẩm (Mũi vít HHB, Mũi hàn T12/500/900M-T, Xilanh Nhật/Mỹ 3-300cc, Pittong, Dây bơm keo, Kính lúp PEAK 10X/15X, Vòi trộn keo RM12-26, Kim sắt inox 8G-30G).
   - Đã chuẩn hóa trường xuất xứ về `"Chính Hãng"`, thêm cờ `hideStockBadge: true` để ẩn huy hiệu tồn kho trên thẻ Grid, và gỡ bảng `TIER_PRICING` (Lead Time cứng) khỏi `ProductDetail.tsx`.
   - **Trạng thái Git**: 9 file đang ở trạng thái `Modified (M)` chưa commit (`AGENTS.md`, `src/data.ts`, `src/types.ts`, `src/i18n/productTranslations.ts`, `src/components/VirtualCatalogGrid.tsx`, `src/pages/ProductDetail.tsx`, `public/data/catalog_index.json`, `public/data/catalog_index_full.json`, `public/sitemap.xml`) và 22 đường dẫn `Untracked (??)`.
2. **Cải tiến Bảo mật & Hạ tầng (`PROJECT.md` Milestones M1-M4)**:
   - **[ĐÃ XÁC MINH]** Milestone M1 (SecOps Hardening) đang ghi nhận trạng thái `IN_PROGRESS`, M2-M4 ở trạng thái `PLANNED`.
   - **[GIẢ ĐỊNH / CHƯA XÁC MINH TRÊN HOST]** Một số hạng mục của M2 (như `admincp/legacy_mysql_shim.php`) đã có code local và ghi trong `CHANGELOG.md`, nhưng cần chạy script đối chiếu trực tiếp với máy chủ FTP để xác nhận toàn bộ các mục SEC-1 đến SEC-6 trong `PROJECT.md` đã áp dụng hết trên live server hay chưa.

---

## 3. CẤU TRÚC & CÁC TỆP QUAN TRỌNG (STRUCTURE & KEY FILES)

### 3.1. Kiến trúc thư mục (`D:\T&TVina\protools`) [ĐÃ XÁC MINH]
- `src/`: Mã nguồn Frontend React 19 + TypeScript 5.8 + Tailwind CSS v4.
  - [`src/App.tsx`](file:///D:/T&TVina/protools/src/App.tsx): Bộ định tuyến SPA chính.
  - [`src/types.ts`](file:///D:/T&TVina/protools/src/types.ts): Định nghĩa interface `Product`, `Category`, `QuoteItem`.
  - [`src/data.ts`](file:///D:/T&TVina/protools/src/data.ts) (**448 KB**): Nguồn dữ liệu sản phẩm gốc (Single Source of Truth cho Frontend & Catalog).
  - [`src/i18n/productTranslations.ts`](file:///D:/T&TVina/protools/src/i18n/productTranslations.ts) (**155 KB**): Từ điển bản địa hóa sản phẩm cho 7 ngôn ngữ.
  - [`src/i18n/locales/`](file:///D:/T&TVina/protools/src/i18n/locales): 7 tệp JSON ngôn ngữ giao diện (`vi.json`, `en.json`, `de.json`, `zh-CN.json`, `ja.json`, `ko.json`, `th.json`).
  - [`src/data/kdlData.ts`](file:///D:/T&TVina/protools/src/data/kdlData.ts) (**126 KB**) & [`src/pages/KdlConfigurator.tsx`](file:///D:/T&TVina/protools/src/pages/KdlConfigurator.tsx): Dữ liệu tọa độ CAD và giao diện cấu hình khung KDL.
  - [`src/data/kdpData.ts`](file:///D:/T&TVina/protools/src/data/kdpData.ts) & [`src/pages/KdpConfigurator.tsx`](file:///D:/T&TVina/protools/src/pages/KdpConfigurator.tsx): Thuật toán ma trận lỗ và giao diện cấu hình tấm KDP.
  - [`src/data/dresspackData.ts`](file:///D:/T&TVina/protools/src/data/dresspackData.ts) (**145 KB**) & [`src/pages/RobotConfigurator.tsx`](file:///D:/T&TVina/protools/src/pages/RobotConfigurator.tsx): Cấu hình Dresspack Robot 6 trục.
  - [`src/components/VirtualCatalogGrid.tsx`](file:///D:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx): Lưới hiển thị danh mục sản phẩm, bộ lọc ngành hàng.
  - [`src/pages/ProductDetail.tsx`](file:///D:/T&TVina/protools/src/pages/ProductDetail.tsx): Trang chi tiết sản phẩm, chọn biến thể SKU, bảng thông số.
- `public/`: Tài nguyên tĩnh (**998 MB / 8.251 files**), bao gồm:
  - `public/data/catalog_index.json` & `catalog_index_full.json`: Chỉ mục JSON đồng bộ từ `src/data.ts`.
  - `public/images/products/`: Hình ảnh WebP của sản phẩm.
  - `public/kho/`: Hệ thống quản lý kho WMS viết bằng PHP.
  - `public/office/`: Hệ thống Backoffice ERP nội bộ viết bằng PHP + PDO.
  - `public/api/submit_quote.php`: API nhận yêu cầu báo giá B2B.
- `admincp/`: Hệ thống quản trị PHP legacy (74 files) dùng chung `admincp/legacy_mysql_shim.php`.
- `scripts/`: Chứa `catalog_manager.py`, `verify_all_requirements.py` và các công cụ tự động hóa danh mục.
- [`generate_static_snapshots.py`](file:///D:/T&TVina/protools/generate_static_snapshots.py) & [`generate_sitemaps.py`](file:///D:/T&TVina/protools/generate_sitemaps.py): Script sinh HTML tĩnh SEO/GEO và `sitemap.xml` sau khi chạy `vite build`.
- [`AGENTS.md`](file:///D:/T&TVina/protools/AGENTS.md) (**99.8 KB / 840 dòng**): Sổ tay quy tắc vận hành và nhật ký sự cố tích lũy của dự án.
- [`.memory/credentials.local.md`](file:///D:/T&TVina/protools/.memory/credentials.local.md): Nơi lưu thông tin kết nối cục bộ (đã được `.gitignore` chặn, tuyệt đối không commit hoặc in ra màn hình).

---

## 4. CÁCH CHẠY, KIỂM TRA & TRIỂN KHAI (HOW TO RUN / TEST)

### 4.1. Các lệnh kiểm tra tại Local [ĐÃ XÁC MINH]
1. **Kiểm tra kiểu tĩnh TypeScript** (Thời gian chạy thực tế: ~5.3 giây, hiện đang pass 100% với mã thoát 0):
   ```powershell
   pnpm --dir "D:\T&TVina\protools" run lint
   ```
2. **Chạy máy chủ phát triển (Dev Server tại cổng 3000)**:
   ```powershell
   pnpm --dir "D:\T&TVina\protools" run dev
   ```
3. **Kiểm toán tính toàn vẹn danh mục & đa ngôn ngữ**:
   ```powershell
   pnpm --dir "D:\T&TVina\protools" run catalog:audit
   pnpm --dir "D:\T&TVina\protools" run test:catalog
   ```
4. **Build Production đầy đủ (Vite Bundle + Static SEO Snapshots + Sitemap)**:
   ```powershell
   pnpm --dir "D:\T&TVina\protools" run build
   ```
5. **Dọn dẹp bản build cũ**:
   ```powershell
   pnpm --dir "D:\T&TVina\protools" run clean
   ```

### 4.2. Lệnh triển khai Production [ĐÃ XÁC MINH]
- Phát hành lên máy chủ Mắt Bão LiteSpeed (`s2d34.cloudnetwork.vn`):
  ```powershell
  python deploy_production_root.py
  ```

---

## 5. CÁC QUYẾT ĐỊNH ĐÃ CHỐT VÀ LÝ DO (FINALIZED DECISIONS & RATIONALE)

1. **[ĐÃ XÁC MINH] Không dùng SQL Bridge qua HTTP (`ntunnel_mysql.php`, `adminer.php`)**:
   - **Lý do**: Tường lửa Imunify360 trên server Mắt Bão (Rule `77218530` & `77350224`) sẽ coi truy vấn `information_schema` qua POST HTTP là tấn công SQL Injection và khóa IP toàn bộ các cổng (21, 2222, 443) trong 15-30 phút.
2. **[ĐÃ XÁC MINH] Kiến trúc Pre-render tĩnh kết hợp SPA (Zero-Flash SEO/GEO)**:
   - **Lý do**: Đảm bảo Googlebot, GPTBot, ClaudeBot, PerplexityBot đọc được ngay thẻ H1, khối `direct-answer-block` (40-60 từ) và bảng thông số `<table>` thật mà không cần thực thi JavaScript, đồng thời không gây chớp giật giao diện khi React hydrate.
3. **[ĐÃ XÁC MINH] Không dùng `hover:scale-*` trên phần tử `<g>` trong bản vẽ SVG CAD**:
   - **Lý do**: Trong SVG, `scale()` làm dịch chuyển tọa độ hình học so với gốc `viewBox`, khiến mép vòng tròn văng khỏi trỏ chuột gây vòng lặp nhấp nháy vô tận (oscillating jitter). Giải pháp cố định là dùng đổi màu viền kết hợp vòng tròn đệm cảm ứng vô hình mở rộng bán kính `+3.5px`.
4. **[ĐÃ XÁC MINH] Xóa bỏ bảng `TIER_PRICING` (Lead Time cứng) và ẩn huy hiệu số lượng tồn kho (`hideStockBadge: true`) cho hàng dự án**:
   - **Lý do**: B2B công nghiệp không áp dụng một khung thời gian giao hàng cố định cho mọi mặt hàng; việc ẩn badge số lượng giúp ảnh thẻ sản phẩm tinh gọn và chuẩn xác về mặt thương mại.
5. **[ĐÃ XÁC MINH] Sử dụng phông chữ `Be Vietnam Pro` kết hợp `font-mono tabular-nums` cho thông số kỹ thuật**:
   - **Lý do**: Triệt tiêu hoàn toàn lỗi chồng dấu tiếng Việt và giúp các cột số liệu đường kính Ø, mã MPN, số lượng thẳng hàng tuyệt đối.

---

## 6. LỖI & VẤN ĐỀ CÒN TỒN TẠI (REMAINING ISSUES)

1. **[ĐÃ XÁC MINH] Quá tải dung lượng thư mục dự án làm chậm IDE, File Watcher và Agent (> 5 GB / > 30.000 files)**:
   - Thư mục `D:\T&TVina\protools\backups` đang nằm ngay trong repo, chiếm **2.41 GB (2.440 files)**.
   - Thư mục `dist/` chiếm **1.0 GB (8.405 files)** và `public/` chiếm **998 MB (8.251 files)**.
2. **[ĐÃ XÁC MINH] Tệp dữ liệu kích thước lớn nằm trực tiếp trong `src/`**:
   - `src/data/excluded_skus.json` nặng **2.61 MB**.
   - `src/data.ts` nặng **448 KB** (gây tải nặng cho TypeScript Language Server).
   - Thư mục `src/graphify-out/` (**~430 KB**) bị sinh nhầm vào trong `src/` thay vì chỉ nằm ở `graphify-out/` ngoài root.
3. **[ĐÃ XÁC MINH] Bảo lưu toàn bộ tệp ảnh gốc phục vụ Content Quảng cáo Facebook**:
   - Các tệp ảnh `.png`/`.jpg` gốc độ phân giải cao và ảnh chưa đóng dấu được xác nhận là **tư liệu thiết kế content Facebook Ads của doanh nghiệp** (không phải tệp thừa).
   - Để tránh việc làm nặng gói build web (`dist/`) và tránh bị deploy nhầm lên hosting production, các tệp này cần được bảo lưu an toàn bằng cách di chuyển vào thư mục riêng `assets_marketing/` (hoặc cấu hình `.gitignore`).
4. **[ĐÃ XÁC MINH] Thay đổi của đợt nạp 13 sản phẩm mới chưa được Commit và chưa Deploy**:
   - 9 tệp mã nguồn đã sửa và các thư mục ảnh `.webp` mới trong `public/images/products/` vẫn đang nằm trên working tree.

---

## 7. NHỮNG CÁCH ĐÃ THỬ NHƯNG THẤT BẠI (TRIED & FAILED APPROACHES)

1. **[ĐÃ XÁC MINH] Reset máy tính và cài đặt lại ứng dụng Antigravity để chữa lỗi Agent phản hồi chậm**:
   - **Lý do thất bại**: Trình cài đặt chỉ ghi đè file thực thi của ứng dụng, không xóa thư mục dữ liệu người dùng `C:\Users\OS\.gemini\antigravity` (đang phình tới **7.0 GB** với **525 cuộc hội thoại cũ**), không tự tắt chế độ suy nghĩ sâu `(High)` của model, và không làm giảm số lượng 30.000 files trong thư mục `protools`.
2. **[ĐÃ XÁC MINH] Dùng chuỗi mặc định tiếng Việt trong hàm `t('key', 'Chuỗi tiếng Việt')` mà quên khai báo khóa trong 7 file JSON ngôn ngữ**:
   - **Lý do thất bại**: Gây ra "Bẫy Fallback Tĩnh" (Static String Fallback Trap) — khi đổi cờ sang tiếng Anh, Đức, Thái, giao diện vẫn hiện tiếng Việt vì khóa bị thiếu trong file locale đích.
3. **[ĐÃ XÁC MINH] Gom nhóm tự động các mã SKU Murrplastik bằng thuật toán chuỗi thô**:
   - **Lý do thất bại**: Dẫn đến việc nhét nhầm bạc đạn xoay `KMG/F`, khớp bi `KEG/ZL` và miệng loa `V-ZLT` vào chung họ đầu nối thẳng `MP-FAM-MSV`. Phải bóc tách thủ công theo đúng bản chất cơ khí của từng họ sản phẩm.
4. **[ĐÃ XÁC MINH] Ghi đè trực tiếp `.htaccess` qua FTP bằng lệnh `STOR` thông thường**:
   - **Lý do thất bại**: Máy chủ trả về lỗi `553 Permission Denied` do `.htaccess` trên host được đặt quyền `444` (Read-only). Bắt buộc phải gửi lệnh `SITE CHMOD 644 .htaccess` trước khi ghi đè.

---

## 8. QUY TẮC LÀM VIỆC BẮT BUỘC CỦA TÔI (USER WORKING RULES)

Mọi Agent (bao gồm Codex) khi tiếp nhận dự án bắt buộc phải tuân thủ nghiêm ngặt 5 quy tắc sau:

1. **Cấm tuyệt đối Emoji / Icon Windows**:
   - Không sử dụng bất kỳ emoji màu mè nào (như biểu tượng mặt cười, tên lửa, dấu tích xanh, cảnh báo vàng) trong cả câu trả lời chat, tài liệu Markdown lẫn giao diện web. Chỉ dùng ký tự định dạng Markdown tiêu chuẩn (`-`, `*`, `1.`, `>`) hoặc icon vector SVG kỹ thuật đơn sắc.
2. **Nguyên tắc Bồi đắp Tri thức Chỉ Ghi Nối Tiếp (Append-Only Policy)**:
   - Khi cập nhật `AGENTS.md`, `CHANGELOG.md` hoặc nhật ký bài học, **chỉ được phép ghi nối tiếp (append) vào cuối file** kèm mốc thời gian. Cấm tuyệt đối việc xóa hoặc ghi đè làm mất nội dung lịch sử.
3. **Phong cách Giao tiếp ADHD (ADHD Output Style)**:
   - Câu đầu tiên luôn là hành động/lệnh thực thi cụ thể (commands, đường dẫn file, đoạn code).
   - Đánh số thứ tự từng bước cho tác vụ nhiều bước; giới hạn danh sách tối đa 5 mục.
   - Luôn nêu ước tính thời gian cụ thể cho từng hạng mục.
   - Không mở đầu bằng lời chào/khen ngợi xã giao ("Great question", "Sure!"), không kết thúc bằng câu xã giao ("Hope this helps", "Let me know...").
   - Luôn kết thúc mỗi phản hồi bằng **1 hành động tiếp theo cụ thể** có thể làm ngay trong dưới 2 phút.
4. **Kiểm chứng Thực tế Trước Khi Báo Cáo Hoàn Thành (Verification Before Completion)**:
   - Bắt buộc chạy lệnh kiểm tra (`pnpm run lint`, `pnpm run build`) và xác nhận đầu ra không lỗi trước khi tuyên bố hoàn thành.
5. **Bảo mật Thông tin Nhạy cảm**:
   - Tuyệt đối không đưa mật khẩu, token, khóa API hoặc nội dung `.memory/credentials.local.md` lên Git hoặc in vào tài liệu công khai.

---

## 9. CÁC BƯỚC TIẾP THEO (NEXT STEPS - ƯỚC TÍNH 10 PHÚT)

Thực hiện tuần tự theo đúng thứ tự ưu tiên sau trên Codex:

1. **Bước 1 — Giải phóng dung lượng làm chậm dự án (2 phút)**:
   - Di chuyển thư mục `D:\T&TVina\protools\backups` (2.41 GB) ra ngoài thành `D:\T&TVina\protools_backups_external`.
   - Xóa thư mục `D:\T&TVina\protools\src\graphify-out` bị sinh nhầm trong `src/`.
   - Chạy `pnpm run clean` để dọn 1.0 GB thư mục `dist/`.
2. **Bước 2 — Phân loại & Bảo lưu an toàn ảnh Content Facebook Ads (1 phút)**:
   - Tạo thư mục riêng `D:\T&TVina\protools\assets_marketing` (hoặc thư mục tư liệu ngoài luồng web) để lưu trữ toàn bộ các tệp ảnh `.png`/`.jpg` gốc dùng làm content quảng cáo Facebook.
   - Thêm `assets_marketing/` vào `.gitignore` để lưu giữ an toàn, vĩnh viễn trên máy mà không làm nặng gói build web (`dist/`) hay làm chậm Git.
3. **Bước 3 — Kiểm tra Build & Commit đợt cập nhật 13 dòng sản phẩm (3 phút)**:
   - Chạy `pnpm run lint` và `pnpm run build` để cập nhật lại static snapshots và `sitemap.xml`.
   - Thêm `.specify/` và `graphify-out/` vào `.gitignore` (nếu không muốn đẩy đồ thị local lên Git).
   - Commit toàn bộ thay đổi của đợt nạp 13 sản phẩm mới và push lên nhánh `main`.
4. **Bước 4 — Deploy lên Production & Xác thực Live (4 phút)**:
   - Chạy `python deploy_production_root.py` để đồng bộ lên `protools.com.vn`.
   - Kiểm tra HTTP 200 và hiển thị thực tế của 13 sản phẩm mới trên môi trường Production.
