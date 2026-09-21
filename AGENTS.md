# AGENTS.MD - PROJECT GUIDELINES & OPERATIONAL RULES
* **Agent Codename:** `PROTOOLS-CORE-AGENT`
* **Agent Role:** Lead Fullstack & Infrastructure Security Specialist (Protools.com.vn)
* **Organization:** T&T Vina Industrial Co., Ltd
* **Workspace:** `d:\T&TVina\protools`
* **Last Updated:** 21/08/2026

---

## 0. NGUYÊN TẮC BẢO TOÀN KIẾN THỨC AGENT (APPEND-ONLY RULE)
> [!IMPORTANT]
> **QUY TẮC BẤT BIẾN:** Mọi Agent khi làm việc trên dự án này nếu có kiến thức mới, sự cố mới hoặc quyết định kỹ thuật mới phát sinh **CHỈ ĐƯỢC PHÉP GHI THÊM (APPEND-ONLY)** vào cuối các mục tương ứng. **CẤM TUYỆT ĐỐI việc xóa bỏ, sửa đổi làm mất hoặc ghi đè đè bẹp các quy tắc và bài học kinh nghiệm đã tích lũy trước đó.**

---

## 1. TỔNG QUAN DỰ ÁN & HẠ TẦNG (SYSTEM PROFILE)

* **Business:** Website B2B phân phối thiết bị cơ khí, dụng cụ công nghiệp Protools.
* **GitHub Repository:** [https://github.com/lylamkhai218/protools](https://github.com/lylamkhai218/protools)
* **Frontend Techstack:** React, TypeScript, Vite, Tailwind CSS (Single Page Application - SPA).
* **Hosting Server:** Mắt Bão Cloud Network (`s2d34.cloudnetwork.vn` - IP: `112.78.2.34`).
* **Control Panel:** DirectAdmin (Evolution Skin - Port `2222`).
* **Web Server:** LiteSpeed Web Server.
* **Database Engine:** MariaDB 10.6 (`prod2e4e_db`).
* **Hệ thống Phòng thủ (WAF/IPS):** **Imunify360 (IM360 WAF)** + ModSecurity Rule Engine.

---

## 2. NGUYÊN TẮC BẢO MẬT BẮT BUỘC (CRITICAL SECURITY RULES)

### ❌ Rule 2.1: CẤM TUYỆT ĐỐI SQL Bridge Scripts trên Web
* **KHÔNG ĐƯỢC PHÉP** upload bất kỳ file script trung gian nào như `ntunnel_mysql.php`, `adminer.php`, `db_bridge.php` lên `public_html`.
* **Lý do kỹ thuật:** Tường lửa Imunify360 (Rule `77218530` / `77350224`) sẽ tự động nhận diện các payload truy vấn qua HTTP là **SQL Injection** và kích hoạt **Auto-Ban (khóa IP toàn bộ cổng server)** ngay lập tức.

### 🛡️ Rule 2.2: Quy chuẩn Quản trị Cơ sở Dữ liệu (Database Protocol)
1. **Thao tác trực tiếp:** Chỉ sử dụng **phpMyAdmin** chính thức qua DirectAdmin (`https://s2d34.cloudnetwork.vn:2222`).
2. **Thao tác qua Navicat:** Chỉ sử dụng tài khoản **Read-Only (SELECT Only)** và phải khai báo IP vào mục **Access Hosts** trên DirectAdmin trước khi kết nối trực tiếp qua Port `3306`.
3. **Phân tích / Thử nghiệm:** Luôn ưu tiên xuất bản dump file `.sql` về môi trường Localhost để chạy thử nghiệm, không chạy truy vấn nặng trên Production.

---

## 3. HỒ SƠ SỰ CỐ & DỮ LIỆU TƯỜNG LỬA (INCIDENT AUDIT LOGS)

### Sự cố 21/08/2026: Auto-Ban do Navicat HTTP Tunnel
* **Hành động gây lỗi:** Tải `ntunnel_mysql.php` lên `/public_html` và mở bảng từ xa bằng Navicat Desktop qua HTTP.
* **Transaction ID:** `E8B9U-gvg-mlTBAwloBz5iXW`
* **Client IP bị khóa:** `1.52.255.88`
* **Rule ID kích hoạt:** `77218530` (CRITICAL) & `77350224`
* **File WAF:** `/etc/modsecurity.d/013_i360_generic.conf:129`
* **Mẫu truy vấn bị bắt (Payload):**
  ```sql
  SELECT DISTINCT ROUTINE_SCHEMA, ROUTINE_NAME, PARAMS.PARAMETER 
  FROM information_schema.ROUTINES 
  LEFT JOIN ( ... ) ... 
  WHERE ROUTINE_SCHEMA = 'prod2e4e_db'
  ```
* **Bài học kinh nghiệm:** WAF Imunify360 tự động nhận diện từ khóa `information_schema\b` qua HTTP POST là `SQL Injection Attack` và chặn tức thì toàn bộ cổng quản trị (21, 2222, 2083) của IP gửi yêu cầu.
* **Thời gian khóa của Tường lửa (Auto-Ban TTL):**
  * Trong Audit Log của WAF chỉ lưu sự kiện vi phạm (Rule/Severity: `CRITICAL`), không chứa trường thời gian hết hạn vì chính sách chặn nằm ở tầng Daemon Server của Imunify360.
  * **Cơ chế:** Khóa tạm thời (Temporary IP Block / Graylist).
  * **Thời gian mở khóa tự động:** **15 – 30 phút** (kể từ request vi phạm cuối cùng, nếu không gửi thêm request nào làm reset bộ đếm).
  * **Giải pháp mở khóa tức thì (Zero-Wait):** Đổi IP qua VPN / 4G (10s) hoặc vào `id.matbao.net` bấm nút "Mở khóa IP" (1 phút).

### Sự cố 28/08/2026: FTP Permission Denied (553) khi ghi `.htaccess` SPA Routing
* **Hiện tượng:** Khi chạy deploy, máy chủ FTP từ chối ghi đè file `.htaccess` do file cũ đang đặt quyền `444` (Read-only).
* **Ảnh hưởng:** Web server LiteSpeed tiếp tục chạy các RewriteRule của mã nguồn PHP cũ, khiến truy cập các route SPA (như `/murrplastik`) bị rewrite vào `index.php?language_alias=...`.
* **Giải pháp kỹ thuật:** Gọi lệnh `SITE CHMOD 644 .htaccess` trước khi thực hiện `STOR .htaccess` trong script phát hành [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py).

---

## 4. NGUYÊN TẮC PHÁT TRIỂN & DEPLOY (DEV & RELEASE RULES)

### 📦 Rule 4.1: Quy trình Deploy Production an toàn
* Mọi tiến trình phát hành code mới lên máy chủ phải tuân thủ nghiêm ngặt qua script [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py):
  1. **Tự động sao lưu (Auto Backup):** Luôn chạy backup dữ liệu cũ trên host về thư mục `/backups` trước khi ghi đè.
  2. **Đóng gói Bundle:** Build code tĩnh qua `pnpm build` (Vite).
  3. **Cấu hình Routing:** Luôn đảm bảo file `.htaccess` cho SPA routing được cập nhật trên root `public_html`.

### 🔄 Rule 4.2: Quản lý Rollback & Backup
* Toàn bộ mã nguồn và tài nguyên tĩnh cũ được lưu trữ tại thư mục [`backups/`](file:///d:/T&TVina/protools/backups/) kèm file `.zip` nén có timestamp để có thể hoàn tác (Rollback) bất cứ lúc nào.

### 🛡️ Rule 4.3: Chiến lược Test Trang Con Cô Lập (Subpage Isolation)
* Khi user yêu cầu test trang con (như `/murrplastik`) trên Production mà chưa thay thế toàn bộ hệ thống:
  1. **Tuyệt đối không ghi đè** `public_html/index.html` hoặc root `.htaccess` của website chính.
  2. **Triển khai cô lập**: Đặt `base: '/[tên_trang]/'` trong [`vite.config.ts`](file:///d:/T&TVina/protools/vite.config.ts) và upload toàn bộ bundle vào thư mục con `public_html/[tên_trang]/`.
  3. **Bypass Rewrite**: Thêm quy tắc `RewriteRule ^[tên_trang](/.*)?$ - [L]` trong root `.htaccess` để web server chuyển quyền xử lý trực tiếp vào thư mục con.

---

## 5. QUY CHUẨN GIAO TIẾP VỚI USER (COMMUNICATION STYLE)

* **Phong cách ADHD Standard:**
  * Đi thẳng vào hành động và giải pháp kỹ thuật (Lead with action / code / commands).
  * Đánh số các bước thực hiện (1, 2, 3).
  * Không mở đầu bằng lời chào/khen thừa thãi, không kết thúc bằng câu xã giao.
  * Luôn tạo clickable link cho các file trong dự án bằng định dạng Markdown: `[tên_file](file:///đường_dẫn_tuyệt_đối)`.

---

## 6. QUY ĐỊNH KÍCH HOẠT SKILLS BẮT BUỘC (MANDATORY SKILLS)

Mọi Agent khi thực thi tác vụ trong dự án Protools phải kích hoạt các Skills sau theo đúng ngữ cảnh:

1. 🛡️ **`everything-cyber-security`**:
   * **Bắt buộc kích hoạt**: Trước MỌI thao tác liên quan đến Database, Server Hosting, API, Phân quyền, hoặc cấu hình kết nối mạng.
2. 🐞 **`systematic-debugging`**:
   * **Bắt buộc kích hoạt**: Khi gặp bất kỳ lỗi kết nối, lỗi code hoặc phản hồi bất thường nào từ hệ thống trước khi đề xuất giải pháp.
3. 🎨 **`ui-ux-pro-max`**:
   * **Bắt buộc kích hoạt**: Khi thiết kế hoặc code các component giao diện B2B, bảng thông số kỹ thuật (Spec-sheet), và layout Responsive Mobile-first cho Protools.
4. ✅ **`verification-before-completion`**:
   * **Bắt buộc kích hoạt**: Luôn chạy lệnh kiểm chứng thực tế và có bằng chứng đầu ra trước khi kết luận hoàn thành tác vụ.
5. ⚡ **`i-have-adhd`**:
   * **Mặc định toàn thời gian**: Phong cách giao tiếp trực diện, gạch đầu dòng, không văn vở rườm rà.

---

## 7. HỆ THỐNG MULTI-AGENTS CHUYÊN TRÁCH (SPECIALIZED SUBAGENTS SQUAD)

Hệ thống được trang bị 4 Subagent chuyên biệt được điều phối bởi `PROTOOLS-CORE-AGENT`:

| Subagent Name | Vai trò chuyên môn | Nhiệm vụ chính |
| :--- | :--- | :--- |
| `protools_frontend` | 🎨 Frontend & UI/UX Specialist | Code React, TypeScript, Tailwind CSS, Spec-sheet Grid, Container Queries theo [`design-system.md`](file:///d:/T&TVina/protools/.project/architecture/design-system.md). |
| `protools_security` | 🛡️ Cybersecurity & WAF Guard | Kiểm soát an toàn máy chủ Mắt Bão, rà soát lỗ hổng API/Form, ngăn chặn tuyệt đối HTTP SQL bridges. |
| `protools_data` | 🔍 Database Architect | Phân tích 67 bảng của `prod2e4e_db`, map kiểu dữ liệu TypeScript, chuẩn bị data model. |
| `protools_qa` | 🧪 QA & Verification Specialist | Chạy build Vite tĩnh (`pnpm build`), kiểm tra SPA `.htaccess`, xác thực trước khi release. |

---

## 8. HỆ THỐNG PROJECT OS (PROJECT OPERATING SYSTEM)

* **Hiến pháp vận hành (Constitution):** Xem chi tiết tại [`.project/constitution.md`](file:///d:/T&TVina/protools/.project/constitution.md).
* **Trạng thái tức thời (Snapshot):** Mọi Agent trước khi thực thi tác vụ BẮT BUỘC đọc [`.project/snapshot.md`](file:///d:/T&TVina/protools/.project/snapshot.md).
* **Mô hình bộ nhớ 3 tầng:**
  1. **Dài hạn (`.project/`):** Chứa SRS, SAD, Architecture, Data Model, Traceability và bộ quyết định [ADRs](file:///d:/T&TVina/protools/.project/decisions/README.md).
  2. **Tác vụ (`.tasks/`, `.handoffs/`):** Chứa Backlog, Active tasks và Biên bản bàn giao công việc giữa các Agent.
  3. **Học hỏi (`.memory/`):** Chứa bài học [Lessons](file:///d:/T&TVina/protools/.memory/lessons/), sai lầm [Mistakes](file:///d:/T&TVina/protools/.memory/mistakes/), mẫu thiết kế [Patterns](file:///d:/T&TVina/protools/.memory/patterns/).
* **Thứ tự nạp ngữ cảnh tối ưu (Progressive Context Loading):**
  `AGENTS.md` → `.project/snapshot.md` → Relevant Task (`.tasks/`) → Requirements/ADR → Source Code (`src/`).
* **Chuỗi truy xuất nguồn gốc (Traceability):**
  `BUS-*` (Mục tiêu kinh doanh) → `FR/NFR-*` (Yêu cầu) → `UC-*` (Use Case) → `SAD` (Thiết kế) → `TASK-*` (Tác vụ) → `Code` → `TEST-*` (Kiểm thử).

---

## 9. QUY CHUẨN KỸ THUẬT & BÀI HỌC VẬN HÀNH (KNOWLEDGE LOG 28/08/2026)

### 📝 Rule 9.1: Chuẩn hóa UTF-8 khi gửi Form Báo Giá sang Google Apps Script
* **Hiện tượng**: Khi gửi tiếng Việt có dấu qua HTTP POST sang Google Apps Script, nếu không chỉ định rõ bảng mã thì ký tự có dấu (`ộ, ử, ệ`) sẽ bị lỗi font (`?`).
* **Giải pháp**: Luôn đặt header `Content-Type: text/plain;charset=utf-8` trong `fetch()`. Định dạng này vừa đảm bảo mã hóa tiếng Việt trọn vẹn, vừa tránh kích hoạt CORS Preflight `OPTIONS` request.

### 🌐 Rule 9.2: Chiến lược Chuyển tiếp Tên miền Minh bạch (White-Hat Domain Migration)
* **Quy chuẩn chuyển đổi**: Khi chuyển giao tên miền vi phạm thương hiệu (`murrplastikvn.com`) sang phân vùng mới (`protools.com.vn/murrplastik/`):
  1. **Triệt tiêu trùng lặp**: Dọn sạch nội dung chi tiết trên domain cũ, chỉ giữ duy nhất một trang **Thông báo chuyển hướng (Transition Notice)** kèm đếm ngược 60 giây và nút chuyển ngay.
  2. **Bảo toàn URL con**: Sử dụng JavaScript đọc `window.location.pathname` để chuyển tiếp chính xác vào đúng trang sản phẩm/ngành tương ứng.
  3. **Tuyên bố pháp lý**: Ghi rõ thời điểm hết hạn và từ bỏ quyền sở hữu sau ngày `24/10/2026`.
  4. **SEO Indexing**: Giữ nguyên `index, follow` và gắn `Canonical Tag` trên domain mới, không dùng `noindex`.

### 🔒 Rule 9.3: Nguyên tắc Vệ sinh Máy chủ & Bảo mật File Nhạy Cảm
* Tuyệt đối không để các file tài liệu nội bộ (`.md`, `.csv`), script deploy (`.py`) và đặc biệt là file cấu hình **`.env`** nằm trong thư mục `public_html` của web server.
* Khi phát hành, chỉ đồng bộ các file tĩnh đã được làm sạch (`.html`, `.css`, `.js`, `.webp`, `.stl`, `.xml`).

### 🛡️ Rule 9.4: Quản lý Thông tin Bảo mật Tuyệt mật (Local Credentials Isolation)
* Toàn bộ tài khoản, mật khẩu quản trị nội bộ chỉ được lưu trữ tại file cục bộ [`.memory/credentials.local.md`](file:///d:/T&TVina/protools/.memory/credentials.local.md) hoặc `.env.local`.
* Bắt buộc khai báo các mẫu file này trong [`.gitignore`](file:///d:/T&TVina/protools/.gitignore). Tuyệt đối cấm commit hoặc push tài khoản lên GitHub hoặc upload lên public hosting.

### 📦 Rule 9.5: Tiêu chuẩn Quản lý Gói (Default Package Manager Standard - pnpm)
* **Bắt buộc**: Mặc định 100% mọi lệnh quản lý gói, cài đặt dependency, chạy môi trường dev và build trong dự án này PHẢI dùng **`pnpm`** (`pnpm dev`, `pnpm build`, `pnpm add`, `pnpm deploy:protools`).
* **Cấm**: Tuyệt đối không dùng `npm` hoặc `yarn` để tránh xung đột file lock và trùng lặp node_modules.

### 🏢 Rule 9.6: Tiêu chuẩn Dữ liệu Doanh nghiệp & Danh mục Sản phẩm Thực tế (Authentic Company & Catalog Standard)
* **Thông tin doanh nghiệp**: Luôn sử dụng thông tin công ty và liên hệ chính thức đã được xác thực từ `protools.com.vn`:
  - **Tên công ty**: `CÔNG TY TNHH CÔNG NGHIỆP T&T VINA` (`T&T VINA INDUSTRIAL CO., LTD`)
  - **Trụ sở chính**: `Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội` (Số 11 ngách 68 ngõ 467 Lĩnh Nam)
  - **Cơ sở 2 (Hưng Yên)**: `Thôn Trà Hồi - Xã Thái Thụy - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)`
  - **Phòng Bán Hàng**: `0964.920.025 (Ms. Nhinh)`
  - **Phòng Kinh Doanh**: `0943.301.886 (Mr. Thanh)`
  - **Phòng Kỹ Thuật (Dự án & Hỗ trợ kỹ thuật)**: `0983.794.782 (Mr. Phong)` - `0981.919.590 (Mr. Hai)`
  - **Email**: `t2t.vina@gmail.com`
* **Danh mục sản phẩm thực tế**: Mọi sản phẩm thể hiện trên giao diện mới phải được trích xuất chính xác từ hệ thống danh mục cũ (14 sản phẩm Murrplastik Đức, Robot hàn 6 trục, Hakko 936, Bể hàn CM-808, Tô vít Hios CL-4000/CL-3000, Robot bơm keo SP-982, Máy cắt băng dính Zcut 9, Máy đo lực HP-10, Kính hiển vi SM-3TPZ, Quạt ion SL-001).

### 🏛️ Rule 9.7: Quy Chuẩn Nhận Diện & Tên Pháp Nhân (Brand & Legal Entity Standard - 29/08/2026)
* **Tên thương hiệu cốt lõi**: `T&T VINA` (`T&T VINA INDUSTRIAL CO., LTD`).
* **Cổng thông tin / Web Catalog**: `Protools.com.vn`.
* **Chỉ số xuất xứ**: `100% Chính hãng Nhật Bản / CHLB Đức / Hàn Quốc`.
* **Điều khoản sở hữu trí tuệ**: Toàn bộ nội dung, hình ảnh sản phẩm, thông số kỹ thuật và tài liệu kỹ thuật thuộc quyền sở hữu của T&T Vina Industrial Co., Ltd.
* **Credit phát triển**: Chân trang hiển thị tinh tế dòng credit `Thiết kế & phát triển bởi KhaiLL` (font mono nhạt).

### 🚀 Rule 9.8: Quy Chuẩn Widget Tương Tác Nổi & Điều Hướng (Floating Action Hub & Scroll Standard - 29/08/2026)
* **Nút Quay Về Đầu Trang (Back to Top)**: Tự động xuất hiện khi người dùng cuộn đạt từ **`50%`** chiều cao trang trở lên, tích hợp hiệu ứng chuyển động 2 giai đoạn: cuộn nhẹ lên một đoạn ngắn rồi mới lướt mượt mà về đỉnh trang (`window.scrollBy({ top: -280 })` -> `window.scrollTo({ top: 0 })`).
* **Trung Tâm Liên Hệ Nổi (Floating Quick Contact Hub)**:
  - Vị trí: Cố định góc dưới cùng bên phải (`bottom-6 right-6`).
  - Hành vi: Bấm mở rộng menu với đầy đủ các kênh liên hệ trực tiếp:
    1. Zalo Bán Hàng: `0964.920.025 (Ms. Nhinh)`
    2. Zalo Kinh Doanh: `0943.301.886 (Mr. Thanh)`
    3. Hotline Kỹ Thuật: `0983.794.782 (Mr. Phong)` - `0981.919.590 (Mr. Hai)`
    4. Email Báo Giá: `t2t.vina@gmail.com`

### 📊 Rule 9.9: Hiệu Ứng Số Chạy Tự Động (Animated Counter Standard - 29/08/2026)
* Mọi chỉ số định lượng năng lực công ty (`100%`, `24h`, `500+`, `76+`, `10+`) sử dụng component [`src/components/AnimatedCounter.tsx`](file:///d:/T&TVina/protools/src/components/AnimatedCounter.tsx).
* Cơ chế: Sử dụng `IntersectionObserver` kích hoạt đếm số mượt mà từ `0` đến `N` bằng thuật toán giảm tốc mượt `easeOutCubic` thời lượng `1000ms`, rolling liên tục từng frame không bị ngắt quãng.

### 🔍 Rule 9.10: Quy Chuẩn SEO Schema & FAQ Accordion (SEO Rich Snippets Standard - 29/08/2026)
* Trang chủ tích hợp khối câu hỏi thường gặp (FAQ) định dạng Accordion kèm mã cấu trúc chuẩn Google **`JSON-LD FAQPage`**.
* Nội dung FAQ giải đáp chính xác về: Danh mục sản phẩm, Chứng từ CO/CQ, Chính sách bảo hành 12 tháng, Quy trình báo giá hỏa tốc 15-30 phút, và Địa chỉ kho Hà Nội / Hưng Yên.

### ✨ Rule 9.11: Hiệu Ứng Hero Ambient Glow & Scroll Down Badge (Hero Interactive Standard - 29/08/2026)
* **Khối Hero hiện đại**: Tích hợp vầng sáng màu thương hiệu `ambient glow` phía sau. Khi người dùng cuộn chuột, vầng sáng tự động mở rộng (`scale` & `opacity` loang dần ra nền trang) tạo chiều sâu thị giác.
* **Mũi tên điều hướng Hero**: Nút bấm tròn nổi bật với hiệu ứng hào quang phát xung (`pulse aura`) và icon `ChevronDown` nảy nhẹ (`bounce`), bấm vào sẽ cuộn mượt mà trực tiếp xuống khối Trụ Cột Giải Pháp (`#solution-pillars`).

### 📦 Rule 9.12: Quy Chuẩn B2B Procurement & Quản Trị BOM (Misumi-Aligned B2B Standards - 29/08/2026)
* **Công Cụ Báo Giá Nhanh Theo BOM (BOM Quick Quote Tool)**: Tích hợp trực tiếp tại [`src/pages/CartQuote.tsx`](file:///d:/T&TVina/protools/src/pages/CartQuote.tsx), cho phép Mua hàng dán danh sách mã SKU / Part Number từ Excel hoặc chọn các gói BOM mẫu để nạp tự động hàng loạt thiết bị vào giỏ báo giá kèm tính năng xuất file Excel/CSV.
* **Bảng Báo Giá Chiết Khấu Theo Số Lượng (B2B Volume Tier Pricing Table)**: Tại [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), phân định rõ các bậc số lượng (`1-5 cái`, `6-20 cái`, `21-50 cái`, `>50 cái`) kèm thời gian giao hàng (Lead Time) và chiết khấu tương ứng; click vào dòng bậc giá tự động cập nhật số lượng đặt.
* **Cam Kết Lead Time & Kho Hàng KCN**: Hiển thị rõ kho hàng sẵn có (Hà Nội, Hưng Yên cạnh KCN Liên Hà Thái) và cam kết giao hàng trong ngày nếu đặt trước 15:00.
* **Thiết Bị Tương Đương & Phụ Kiện (Cross-Reference & Accessories)**: Gợi ý các sản phẩm cùng hệ sinh thái kỹ thuật kèm nút bấm 1-click thêm vào báo giá.

### 🤖 Rule 9.13: Quy Chuẩn Tiêu Điểm Robotics Đức & VinFast Body Shop Case Study (29/08/2026)
* **Thiết Bị Tiêu Điểm Hero**: Đặt **`R-Tec Liner`** (`MP-1081`) của hãng Murrplastik (CHLB Đức) làm thiết bị tiêu điểm công nghệ tại Hero Section trang chủ.
* **Chứng Minh Năng Lực Ứng Dụng Thực Tế (Automotive Case Study)**: Gắn nhãn chứng thực *"Đã lắp đặt & hoạt động ổn định trên dàn Robot hàn ABB tại xưởng Body Shop (hàn thân xe) Tổ hợp Nhà máy Ô tô VinFast Cát Hải (Hải Phòng)"*.
* **Điều Hướng Chuyên Sâu**: Trang chi tiết sản phẩm tích hợp banner điều hướng trực tiếp sang trang giải pháp công nghiệp ô tô: `https://protools.com.vn/murrplastik/industries/san-xuat-o-to/`.

### 🏷️ Rule 9.14: Quy Chuẩn Nhận Diện Đối Tác & Liên Kết Chuyên Ngành (Authorized Brands & Interactive Marquee - 29/08/2026)
* **Màu sắc thương hiệu tương tác**: Khối đối tác ủy quyền (Partner Marquee) phản hồi màu chủ đạo chính xác của từng hãng khi hover:
  - **Murrplastik**: Đỏ Murr (`#E30613`)
  - **Hakko**: Xanh Hakko (`#005BAC`)
  - **HIOS**: Đỏ HIOS (`#C8102E`)
  - **Quick**: Cam Quick (`#FF6600`)
  - **Loctite**: Đỏ Loctite (`#D32F2F`)
  - **Samwon**: Xanh Samwon (`#003399`)
* **Điều hướng chuyên ngành**: Click vào Murrplastik dẫn trực tiếp đến chuyên trang `https://protools.com.vn/murrplastik`; click vào các hãng khác tự động lọc danh mục thiết bị tương ứng trên trang chủ.

### 🛡️ Rule 9.15: Quy Chuẩn Phát Hành Bản Xem Thử & Chặn SEO Tuyệt Đối (Preview Staging & Strict Noindex Standard - 30/08/2026)
* **Mục đích**: Phát hành phiên bản xem thử nghiệm cô lập cho ban giám đốc/khách hàng duyệt tại URL phụ (`https://protools.com.vn/preview/`) mà không làm xáo trộn website chính và tuyệt đối không cho phép Google/Bing index dữ liệu thử nghiệm.
* **Cơ chế 3 lớp bảo vệ No-Index**:
  1. **Lớp 1 (HTML Meta Tags)**: Tự động chèn `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />` và `<meta name="googlebot" content="noindex, nofollow" />` vào `<head>` của `index.html`.
  2. **Lớp 2 (Server HTTP Header)**: Cấu hình `Header set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"` trong file `.htaccess` cục bộ tại thư mục `/preview/`.
  3. **Lớp 3 (Robots.txt)**: Khởi tạo file `/preview/robots.txt` chứa chỉ thị `User-agent: *` `Disallow: /`.
* **Quy trình đóng gói**: Tự động hóa qua lệnh `pnpm deploy:preview` (gọi [`deploy_preview.py`](file:///d:/T&TVina/protools/deploy_preview.py)) với tham số `--base=/preview/`, tải lên thư mục cô lập `public_html/preview/` trên máy chủ Mắt Bão và cấp quyền `644` cho `.htaccess`.

### 📞 Rule 9.16: Quy Chuẩn Thông Tin Liên Hệ, Địa Chỉ & Nút Copy Tương Tác (30/08/2026)
* **Thông Tin Trụ Sở & Kho Hàng Chuẩn**:
  - **Trụ sở chính**: `Thôn Trà Hồi - Xã Thái Thụy - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)`
  - **Văn phòng giao dịch & Kho hàng**: `Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội`
* **Đội Ngũ Liên Hệ Chính Thức**:
  - **Hotline Tổng Đài**: `0915.168.824` (Ms. Nhung - hiển thị số Hotline không ghi tên ở Hero)
  - **Phòng Bán Hàng & Kinh Doanh**:
    - `+84 929938368` (Ms. Hiền - Kinh Doanh)
    - `+84 365366455` (Ms. Phương - Kinh Doanh)
  - **Phòng Kinh Doanh Murrplastik**:
    - `0868.822.409` (Mr. Bình - NVKD Murrplastik)
    - `0968.597.131` (Mr. Khải - NVKD Murrplastik)
  - **Phòng Dự Án**: `0943.301.886` (Mr. Thanh)
  - **Email**: `t2t.vina@gmail.com`
* **Quy Chuẩn Nút Sao Chép (Copy Button)**: Mọi khối liên hệ (Floating Widget, Top Bar, Footer, Product Detail) tích hợp nút sao chép nhanh số điện thoại/email kèm phản hồi thị giác trực quan (`Check` icon / `Đã chép`).

### 📐 Rule 9.17: Quy Chuẩn Bố Cục Chân Trang Cân Bằng & Logo Danh Mục Header (30/08/2026)
* **Bố cục Footer 2 khối vĩ mô cân bằng (Zero Blank Space)**:
  - **Cột Trái (`lg:col-span-5`)**: Tên pháp nhân + Slogan + Trụ sở chính (Hưng Yên) + VPGD & Kho Hà Nội (Lĩnh Nam) kèm khung bản đồ nhúng Google Maps iframe trực tiếp (chiều cao ~170px).
  - **Cột Phải (`lg:col-span-7`)**:
    - Hàng trên (2 cột nhỏ): `Danh Mục Thiết Bị` (7 nhóm thiết bị) song song `Tư Vấn & Báo Giá` (Hotline, Phòng Dự Án, Kinh Doanh, KD Murr, Email).
    - Hàng dưới: `Hãng Sản Xuất Ủy Quyền Chính Hãng` (6 thẻ lưới 3 cột: Murrplastik, Hakko, HIOS, Quick, Loctite, Samwon) kèm nút `Tạo Danh Sách Yêu Cầu Báo Giá Nhanh`.
* **Tiêu chuẩn Mega Dropdown Danh Mục Header**:
  - Hạng mục Murrplastik hiển thị logo chính hãng sắc nét (`/logos/logo_murrplastik.png`) kèm viền đỏ và nhãn `Made in Germany`.
### 🏷️ Rule 9.18: Quy Chuẩn Phân Luồng Nhân Viên Kinh Doanh Theo Hãng & Credit Footer (30/08/2026)
* **Phân luồng Sales trong Product Detail**:
  - Khi xem sản phẩm thuộc hãng **Murrplastik** (hoặc danh mục `murrplastik`, SKU bắt đầu bằng `MP-`): nút Zalo hiển thị `Zalo KD Murr: Mr. Bình (0868.822.409)` và liên kết tới `https://zalo.me/0868822409`.
  - Khi xem các sản phẩm khác (Hakko, HIOS, Quick, Loctite, Samwon...): nút Zalo hiển thị `Zalo KD: Ms. Hiền (0929.938.368)` và liên kết tới `https://zalo.me/0929938368`.
* **Định dạng Credit chân trang**: Chân trang hiển thị chính xác cú pháp `Thiết kế & phát triển: KhaiLL` (dùng dấu `:`, không dùng chữ `bởi`).

### ⚡ Rule 9.19: Quy Chuẩn Chuyển Trang Tức Thì (Instant Scroll Reset) & Tương Tác Trụ Cột Giải Pháp (30/08/2026)
* **Khắc phục hiện tượng cuộn ngược khi vào Product Detail**:
  - Khi người dùng bấm xem chi tiết sản phẩm từ bất kỳ vị trí nào trên trang chủ, router sử dụng `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` để đưa viewport về đỉnh trang ngay lập tức (loại bỏ hoàn toàn hiệu ứng smooth scroll từ đáy trang lên).
* **Tương tác Khối Trụ Cột Giải Pháp (Solution Pillars)**:
### 🧭 Rule 9.20: Quy Chuẩn Điều Hướng Breadcrumb Đa Tầng Trong Chi Tiết Sản Phẩm (30/08/2026)
* **Tương tác Breadcrumb toàn diện**:
  - `Trang chủ`: Click quay về trang chủ.
  - `Danh mục thiết bị` (`product.category`): Click chuyển về trang chủ và kích hoạt bộ lọc danh mục tương ứng (`product.categorySlug`).
  - `Thương hiệu` (`product.brand`): Click chuyển về trang chủ và lọc theo hãng sản xuất.
### 🎯 Rule 9.21: Quy Chuẩn Tương Tác Danh Mục Header Cuộn Tự Động Xuống Bảng Sản Phẩm (30/08/2026)
* **Hành vi Menu Danh Mục Header**:
  - Khi người dùng bấm vào bất kỳ ngành hàng/nhóm thiết bị nào trong Menu Dropdown `Danh Mục Thiết Bị` trên Header (hoặc Mobile Drawer):
    1. Lập tức đóng Dropdown menu.
    2. Kích hoạt bộ lọc danh mục tương ứng.
### 🔍 Rule 9.22: Quy Chuẩn Điều Hướng Tìm Kiếm & Đồng Bộ URL Tức Thời (30/08/2026)
* **Khắc phục lỗi tìm kiếm**:
  - Sửa mã nguồn `Header.tsx` chuyển sang tab đúng `product-detail` khi chọn sản phẩm từ kết quả tìm kiếm (loại bỏ nhầm lẫn `detail`).
  - Hỗ trợ phím `Enter` trên thanh tìm kiếm để chọn nhanh sản phẩm đầu tiên phù hợp.
* **Đồng bộ hóa URL trình duyệt (State-to-URL Sync)**:
  - Khi xem sản phẩm: URL tự động cập nhật `?product=[SKU_hoặc_ID]` (ví dụ: `https://protools.com.vn/preview/?product=MP-1081`).
  - Khi lọc danh mục: URL cập nhật `?category=[slug]` (ví dụ: `?category=thiet-bi-han`).
  - Khi xem giỏ báo giá / tài liệu: URL cập nhật `?tab=cart` hoặc `?tab=document-center`.
  - Hỗ trợ đầy đủ nút **Back / Forward** của trình duyệt (`popstate`) và mở trực tiếp link sản phẩm chia sẻ qua URL.

### 🖼️ Rule 9.23: Quy Chuẩn Cập Nhật Hình Ảnh Thiết Bị Thực Tế & Bộ Gallery Đa Góc Nhìn (30/08/2026)
* **Hình ảnh Máy bơm keo SP-982**:
  - Đã lưu trữ ảnh chụp thực tế có logo & hotline chính hãng vào `public/images/products/sp-982-main.png` (ảnh trực diện kèm bộ phụ kiện) và `sp-982-sub.png` (ảnh góc nghiêng kèm dây bơm và xi lanh).
  - Khai báo mảng `images` trong `PRODUCTS` (`data.ts`) để trang chi tiết sản phẩm tự động hiển thị đầy đủ thư viện ảnh chuyển đổi đa góc nhìn mượt mà.

### 🤖 Rule 9.24: Quy Chuẩn Dữ Liệu Sản Phẩm Máy Bơm Keo Tự Động 983A (30/08/2026)
* **Tích hợp Model 983A (`TTV-983A`)**:
  - Thêm mới sản phẩm `Máy bơm keo tự động 983A` vào danh mục Dụng Cụ Bơm Keo (`dung-cu-bom-keo`).
  - Lưu trữ 3 ảnh chụp thực tế chuẩn studio (`983a-main.png`, `983a-accessories.png`, `983a-panel.png`) tại `public/images/products/`.
  - Cập nhật đầy đủ 5 đặc điểm nổi bật (hẹn giờ kỹ thuật số, định lượng 0.01 ml, 2 chế độ nhả keo, hút chân không chống nhỏ giọt, giá đỡ xi lanh) và bảng thông số kỹ thuật (điện áp 220V / 24V DC, áp suất 2.5-7 bar, kích thước 23.8x15.5x6 cm, trọng lượng 1.67 kg).

### 🏷️ Rule 9.25: Quy Chuẩn Nhận Diện Phân Phối Ủy Quyền & Khối Sản Phẩm Nổi Bật Tại Chân Trang (30/08/2026)
### 🚀 Rule 9.28: Quy Chuẩn Phát Hành Chính Thức Root Production & Phân Quyền AdminCP (30/08/2026)
* **Phát hành Production Root (`https://protools.com.vn/`)**:
  - Tự động hóa qua script [`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py) (`pnpm deploy:prod`).
  - Toàn bộ bundle React SPA tĩnh được triển khai tại root `public_html/`.
* **Cấu hình Phân luồng & Bảo vệ Thư mục AdminCP**:
  - File root `.htaccess` thiết lập quy tắc bypass:
    `RewriteRule ^(admincp|admin|administrator|old|murrplastik|preview|images|uploads|bomvietnam\.com)(/.*)?$ - [L]`
  - Giữ an toàn 100% cho trang quản trị AdminCP (`https://protools.com.vn/admincp/`), các thư mục media cũ (`/images/stores/`, `/uploads/`) và các phân vùng con (`/murrplastik/`, `/preview/`, `/old/`).
* **Hồ sơ Lưu trữ Sao lưu (Rollback Archive)**:
  - Bản sao lưu toàn diện trước khi phát hành được lưu tại [`backups/protools_backup_20260830_154716.zip`](file:///d:/T&TVina/protools/backups/protools_backup_20260830_154716.zip).
  - Phân vùng `/old/` trên host được thiết lập chặn No-Index (`robots.txt` + `X-Robots-Tag`).

### Rule 9.29: Quy Chuẩn Cập Nhật Gian Hàng Ảo 3D VEC 2026 (07/09/2026)
* **Quy cách vách in V4 (900mm x 1800mm)**:
  - Nguồn ảnh gốc: `D:\T&TVina\VEC_2026_2\04_PRODUCTION_SVG\V4\final` (6 tấm SVG: `bw-panel-1,2,3 3.svg` cho vách hậu và `sw-panel-1,2,3 3.svg` cho vách bên).
  - Kết xuất texture: Ghép 3 tấm 900mm x 1800mm thành composite texture tỷ lệ chuẩn 2.7m x 1.8m (`v4_backwall.png`, `v4_sidewall.png`), tạo kèm payload Base64 trong [`textures_data.js`](file:///D:/T&TVina/murrplastik_code/assets/3d/vec26-booth/textures_data.js).
  - 2 Tấm trán trên đầu (Fascia/Valance: 2950mm x 400mm) giữ nguyên 100%.
* **Quy chuẩn Căn chỉnh Khung 3D (Top-Aligned Wall Meshes)**:
  - Chiều cao khung gian hàng: `BOOTH_H = 2.5m`.
  - Chiều cao tấm in: `WALL_H = 1.8m`. Căn đỉnh tấm in trùng với xà trên của khung (`y_top = 2.5m`), tâm vách đặt tại `y = 1.6m`, mép dưới tại `y = 0.7m`.
  - Bố trí vách hậu: Bắt đầu từ góc `X = -1.5m` đến `X = +1.2m` (tâm `X = -0.15m`, `Z = -1.49m`).
  - Bố trí vách bên: Bắt đầu từ góc `Z = -1.5m` đến `Z = +1.2m` (tâm `Z = -0.15m`, `X = -1.49m`).
  - Phía sau bổ sung vách trắng tiêu chuẩn (`3.0m x 2.5m`), các cột nhôm đứng đặt tại khớp nối 900mm (`-0.6m`, `+0.3m`, `+1.2m`) và xà đỡ ngang dưới chân vách in (`y = 0.7m`).
* **Lược bỏ Model TV 3D**:
  - Loại bỏ hoàn toàn khối 3D TV Stand E2050 và màn hình 65" khỏi scene 3D để lộ trọn vẹn bề mặt đồ họa vách bên (`sw-panel-1` mã QR & thông tin T&T Vina).
  - Xóa hotspot tương ứng (`id: 'tv'`), cập nhật hướng dẫn từ 5 điểm tương tác về 4 điểm tương tác (1: Laser, 2: Robot, 3: Kệ mẫu, 4: Bàn tiếp khách).

### 📐 Rule 9.30: Quy Chuẩn Dàn Đều Banner 900x1800mm Vào Giữa Từng Khung 1.0m & Triệt Tiêu Khung Ngang Dưới Chân (07/09/2026)
* **Khôi Phục Hệ Khung Nhôm 8 Cột Tiêu Chuẩn (Standard 1.0m Bays)**:
  - Khung gian hàng 3.0m x 3.0m sử dụng hệ 8 cột đứng nhôm định hình 50x50mm tiêu chuẩn: 4 cột góc (`[-1.5, -1.5]`, `[1.5, -1.5]`, `[-1.5, 1.5]`, `[1.5, 1.5]`) và 4 cột trung gian ngăn ô 1.0m (Vách hậu tại `x = -0.5m`, `x = +0.5m`; Vách bên tại `z = -0.5m`, `z = +0.5m`).
  - Giữ 4 xà nhôm ngang trên nóc (`y = 2.5m`), **triệt tiêu hoàn toàn các thanh xà ngang dưới chân ảnh** tại `y = 0.7m`.
* **Dàn Đều Banner 900mm Vào Giữa Từng Khoang 1.0m (Centered Bay Graphics)**:
  - Mỗi tấm banner đồ họa kích thước 900mm x 1800mm được căn giữa chính xác vào từng khoang 1.0m, để lại mép viền trắng đều 5cm ở mỗi bên cột, triệt tiêu hoàn toàn khoảng hở lệch 30cm ở mép ngoài.
  - Vị trí vách hậu: 3 ô tại `X = -1.0m`, `X = 0.0m`, `X = +1.0m` (`Y = 1.6m`, `Z = -1.488m`).
  - Vị trí vách bên: 3 ô tại `Z = -1.0m` (góc trong), `Z = 0.0m` (giữa), `Z = +1.0m` (mặt tiền) (`Y = 1.6m`, `X = -1.488m`, `rotation.y = Math.PI / 2`).
  - Căn đỉnh trên cùng với xà nóc (`y_top = 2.5m`), chân dưới dừng ở `y = 0.7m`, phần khoảng trắng bên dưới được nâng đỡ bởi nền vách trắng tiêu chuẩn (`3.0m x 2.5m`).
* **Lưu Trữ Texture Offline & Độc Lập**:
  - Mã hóa Base64 6 tấm texture V4 riêng biệt (`v4_bw_panel_1..3`, `v4_sw_panel_1..3`) vào [`textures_data.js`](file:///D:/T&TVina/murrplastik_code/assets/3d/vec26-booth/textures_data.js) nhằm đảm bảo hiển thị tức thì, không bị ảnh hưởng bởi đường truyền mạng hay chính sách CORS của trình duyệt.

### Rule 9.31: Quy Chuẩn Hồ Sơ Tài Liệu Phát Triển Trang Tin Tức VEC 2026 (07/09/2026)
* **Vị trí lưu trữ tài liệu cơ sở**:
  - `D:\T&TVina\protools\docs\murrplastik\tin-tuc\trien-lam-vec-2026\`
  - Bao gồm: `VEC_2026_MASTER_DOSSIER.md` (Hồ sơ tổng thể sự kiện), `MASTER_VEC2026_SYNTHESIS.md` (Tri thức đồng bộ 3 dự án), `00_README.md` (Chỉ mục tra cứu) và `README.md` (Hướng dẫn phát triển).
* **Mục đích & Phân công**:
  - Cung cấp toàn bộ thông số kỹ thuật, 5 hệ sinh thái Murrplastik, 5 nhóm thiết bị thương mại T&T Vina và 4 gói dịch vụ SLA Level-1 làm nền tảng nội dung phát triển trang tin tức sự kiện:
    `https://protools.com.vn/murrplastik/tin-tuc/trien-lam-vec-2026/`
  - Mã nguồn HTML trang đích: `D:\T&TVina\murrplastik_code\tin-tuc\trien-lam-vec-2026\index.html`.
  - Quy chuẩn thông tin: Email chính thức `info@t2tvina.com`, Hotline `0915.168.824` (Ms. Nhung) / `0973.363.824`.

### Rule 9.32: Quy Chuẩn Mở Rộng 6 Hệ Sinh Thái Murrplastik, Hàng Thương Mại T&T Vina & Đồng Bộ Email info@t2tvina.com (07/09/2026)
* **Đồng Bộ Email Liên Hệ Chuẩn Toàn Hệ Thống**:
  - Email chính thức và duy nhất của T&T Vina / Protools: **`info@t2tvina.com`**.
  - Đã chuẩn hóa 100% trên cả 2 phân vùng (Protools React SPA tại [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và Murrplastik Vanilla HTML tại [`tin-tuc/trien-lam-vec-2026/index.html`](file:///D:/T&TVina/murrplastik_code/tin-tuc/trien-lam-vec-2026/index.html)).
  - Triệt tiêu hoàn toàn các email cũ: `sales@murrplastik-vn.com`, `sales@t2tvina.com`, `t2t.vina@gmail.com`.
* **Cân Đối Lưới 6 Hệ Sinh Thái Murrplastik (Symmetrical 3x2 Grid)**:
  - Bổ sung nhóm thứ 6: **`CST`** (*Giải Pháp Tùy Chỉnh & Lắp Ráp Sẵn Theo Yêu Cầu / ReadyChain & Custom CAD*), mã màu badge đỏ thương hiệu nhạt.
  - Sắp xếp lưới `eco-cards-grid` thành 3 hàng × 2 cột đối xứng hoàn hảo trên Desktop:
    1. ACS (Laser Marking mp-LM 1M) — AUR (Robot Dress Pack & R-Tec Box)
    2. KDH (Cable Entry & Seals) — EFK (Energy Chains Drag Chains)
    3. SUV (Conduits & Fittings) — CST (ReadyChain & Custom CAD)
* **Khối Hàng Thương Mại T&T Vina & Cổng E-Catalog Protools**:
  - Bố trí trực tiếp phía dưới phần *Đăng Ký Tham Quan* (`#register`).
  - Gồm 6 nhóm thiết bị phụ trợ thực tế lấy từ `D:\Design_hub\01_BRANDS\TT_VINA\ASSETS`:
    1. Trạm Hàn & Bể Hàn Cao Tần ESD Quick 205 (QUICK / Hakko)
    2. Tua Vít Điện & Máy Siết Lực Tự Động HIOS (HIOS / Kilews)
    3. Máy Bơm Keo Vi Sai Định Lượng Tự Động SP-982
    4. Thiết Bị & Dụng Cụ Phòng Sạch Chống Tĩnh Điện ESD
    5. Kính Hiển Vi Soi Nổi & Thiết Bị Đo Quang Học Peak
    6. Giá Lưu Trữ & Xe Đẩy Vật Tư SMT Cuộn Reel
  - Tích hợp banner Cổng Vật Tư Công Nghiệp `Protools.com.vn` với mã QR SVG chuẩn sắc nét, liên kết hotline kinh doanh `0943.301.886` và email `info@t2tvina.com`.
  - Phân vùng dải đối tác công nghệ FDI uy tín: VinFast Body Shop, Samsung, LG Display, Honda, Foxconn, Canon, Panasonic, ABB Robotics, Yaskawa.
* **Tối Ưu Giao Diện Mobile Responsive (Mobile-First Polish)**:
  - Trên màn hình di động (<640px): Tự động chuyển đổi lưới sản phẩm phụ trợ về 1 cột dọc (`grid-template-columns: 1fr`), căn giữa toàn bộ khối QR banner, nút bấm mở rộng 100% chiều rộng màn hình.


### Rule 9.33: Quy Chuẩn An Ninh Hạ Tầng: Tập Trung Độc Quyền Mắt Bão, Từ Bỏ Hostinger & Vệ Sinh Git (07/09/2026)
* **Quy Hoạch Hạ Tầng Độc Quyền Mắt Bão**:
  - Hủy bỏ toàn bộ việc triển khai và đồng bộ dữ liệu sang Hostinger (murrplastikvn.com).
  - Toàn bộ dịch vụ, mã nguồn, tài nguyên và cấu hình SEO (Canonical, OpenGraph, JSON-LD Schema) được quy hoạch tập trung 100% tại máy chủ Mắt Bão Cloud Network (s2d34.cloudnetwork.vn - public_html/murrplastik/), phục vụ trực tiếp qua phân vùng https://protools.com.vn/murrplastik/.
* **Tiêu Chuẩn Vệ Sinh Bảo Mật Git (Giữ Sạch GitHub)**:
  - CẤM đưa lên GitHub: Script deploy chứa mật khẩu plaintext (deploy_*.py), file log máy chủ (All_Logs.csv, Logs.csv), thư mục tạm agent (scratch/), video nặng (>30MB).
* **Tiêu Chuẩn Vệ Sinh Máy Chủ Production (Giữ Sạch Web Server)**:
  - CẤM upload lên Web Server Mắt Bão: File tài liệu nội bộ (docs/, *.md, README.md, AGENTS.md), thư mục Git (.git/, .gitignore), script deploy, file ảnh có tên dấu tiếng Việt hoặc khoảng trắng.

### Rule 9.34: Quy Chuẩn An Toàn Form B2B: Ghi CSDL MariaDB contact_list, Loại Bỏ File Upload & Chuẩn Hóa VEC 2026 (08/09/2026)
* **Form Giỏ Hàng B2B (`?tab=cart`)**:
  - Gỡ bỏ hoàn toàn tính năng BOM (*Bill of Materials*) để giao diện mua hàng tinh gọn, trực quan.
  - Tích hợp endpoint REST an toàn `public/api/submit_quote.php` (ECC AgentShield): Chống XSS qua `htmlspecialchars()`, chống SQLi qua PDO Prepared Statements, áp dụng Rate Limiting 5 req/min per IP và Honeypot ẩn `hp_fax`.
  - Ghi đơn trực tiếp vào bảng MariaDB **`contact_list`** (`prod2e4e_db`) để đơn mới lập tức xuất hiện tại màn hình quản trị chính thức `https://protools.com.vn/admincp/#contact`.
  - Đồng bộ gửi email thông báo tới `info@t2tvina.com` và `t2t.vina@gmail.com`.
* **Form Liên Hệ Murrplastik (`/murrplastik/#contact`)**:
  - Loại bỏ 100% ô upload file Base64 để triệt tiêu lỗ hổng Unrestricted File Upload lên Google Drive và nguy cơ cạn kiệt quota execution time của Google Apps Script.
  - Form chỉ gửi text thuần, thời gian phản hồi form < 400ms.
* **Form Đăng Ký VEC 2026 (`/tin-tuc/trien-lam-vec-2026/`)**:
  - Triệt tiêu lỗi nghiêm trọng "Thành công giả" trong Catch block: Báo lỗi trung thực và giữ nguyên dữ liệu form khi xảy ra mất mạng.
  - Chuẩn hóa Regex 10 số di động Việt Nam `/^(0|84)(3|5|7|8|9)[0-9]{8}$/` và header UTF-8.
  - Phân luồng dữ liệu sang tab riêng `VEC_2026_Visitors` trong Google Sheet kèm chống Formula Injection (`'`).


### Rule 9.34: Đóng Băng & Cô Lập Tuyệt Đối Thư Mục Backup murrplastik_code (08/09/2026)
* **Chính Sách Đóng Băng Thư Mục Backup**:
  - Tuyệt đối KHÔNG chỉnh sửa, không thêm bớt file và không can thiệp vào thư mục D:\T&TVina\murrplastik_code.
  - Thư mục này hiện tại chỉ đóng vai trò là kho lưu trữ dự phòng (backup repository), liên kết với tên miền cũ https://murrplastikvn.com/.
  - Mọi hoạt động phát triển tính năng, bảo trì mã nguồn, quản lý tài nguyên và deploy đều tập trung 100% tại d:\T&TVina\protools và phát hành lên máy chủ Mắt Bão (https://protools.com.vn/).

### Rule 9.35: Quy Chuẩn Xử Lý Trình Duyệt In-App (Zalo / Facebook) & Dual Fullscreen Engine WebGL 3D (08/09/2026)
* **Xử Lý Trình Duyệt In-App (Zalo / Facebook / TikTok / Line)**:
  - **Bản chất**: In-App WebView bóp nghẹt tài nguyên WebGL, chiếm dụng 20-30% diện tích màn hình điện thoại và chặn HTML5 Fullscreen API qua Permissions-Policy.
  - **Cơ chế thoát In-App**:
    1. **Android**: Hỗ trợ Intent URL Scheme (`intent://...#Intent;scheme=https;package=com.android.chrome;end`) kích hoạt khởi động trực tiếp Google Chrome hệ thống.
    2. **iOS (iPhone/iPad)**: Do cơ chế Sandbox của Apple cấm website tự ý ép mở Safari, tích hợp **Smart In-App Guidance Banner** hướng dẫn người dùng bấm biểu tượng `•••` (dấu 3 chấm) -> chọn *"Mở bằng Safari / Trình duyệt mặc định"*.
    3. **Trải nghiệm người dùng**: Thiết kế Dark Industrial Slate `#0f172a`, viền đỏ `#C8102E`, tuyệt đối không dùng Windows emojis, có nút đóng lưu vào `sessionStorage`.
* **Dual Fullscreen Engine cho WebGL 3D**:
  - **Vấn đề**: iOS Safari (iPhone) và In-App WebViews không hỗ trợ `requestFullscreen()` trên thẻ `<div>`/`<canvas>`.
  - **Giải pháp**: Triển khai **CSS Pseudo-Fullscreen** cố định toàn màn hình `100vw x 100dvh`, `z-index: 9999999`, khóa cuộn nền (`overflow: hidden`), hỗ trợ nút đóng nổi `[✕ Thu nhỏ]`, đổi icon SVG nút bấm tương ứng, lắng nghe phím `Escape` và nút Back phần cứng của smartphone (`popstate`). Hoạt động 100% trên mọi thiết bị.
### Rule 9.36: Quy Chuẩn Kiến Trúc Liên Kết Hai Chiều Cổng Mẹ Protools ⟷ Chuyên Trang Con Murrplastik (08/09/2026)
* **Phân Định Cấp Bậc Kiến Trúc (Parent-Child Architecture)**:
  - `protools.com.vn`: Đóng vai trò là Cổng Thiết Bị Công Nghiệp Tổng Thể (Parent Portal) của T&T Vina, quản lý danh mục đa ngành (hàn Hakko/Quick, bắt vít Hios, robot bơm keo, quạt ion ESD, kính hiển vi, máy cắt băng dính Zcut).
  - `protools.com.vn/murrplastik`: Đóng vai trò là Chuyên Trang Con Ủy Quyền (Authorized Subsite) của Murrplastik Systemtechnik GmbH (Đức).
* **Định Danh Hai Chiều Bắt Buộc**:
  - **Từ Cổng Mẹ sang Chuyên Trang Con**:
    1. Header Protools (Desktop & Mobile): Đặt nút nhận diện đối tác chiến lược `[Chuyên Trang Murrplastik Đức]` trên Topbar và Mega Dropdown.
    2. Khi người dùng lọc danh mục Murrplastik trên trang chủ: Giữ nguyên việc lọc danh sách 14 thiết bị thực tế, đồng thời xuất hiện **Partner Spotlight Showcase Banner** trên đầu và **Catalog CAD CTA Banner** ở cuối danh mục dẫn trực tiếp sang `/murrplastik/`.
  - **Từ Chuyên Trang Con về Cổng Mẹ**:
    1. Navbar & Mobile Menu của chuyên trang Murrplastik tích hợp mục `Trang Chủ Protools` dẫn về `/`.
    2. Breadcrumbs tin tức/sự kiện chuẩn hóa 4 tầng: `Protools Trang Chủ / Murrplastik / Tin tức & Sự kiện / Chi tiết`.
    3. Chân trang chuyên trang Murrplastik tích hợp Card **Hệ Thống Phân Phối T&T Vina** kết nối về tổng kho thiết bị trên `protools.com.vn`.

### Rule 9.37: Quy Chuẩn Điều Hướng Cùng Tab, Tối Giản Header & Tối Ưu Tốc Độ Deploy Production (08/09/2026)
* **Quy Chuẩn Chuyển Hướng Cùng Tab (Same-Tab Navigation Policy)**:
  - Mọi liên kết điều hướng nội bộ giữa Cổng Mẹ (`protools.com.vn`) và Chuyên Trang Con (`protools.com.vn/murrplastik/`) TUYỆT ĐỐI KHÔNG DÙNG `target="_blank"`.
  - Mọi chuyển hướng phải diễn ra ngay trong tab hiện tại của trình duyệt để tạo trải nghiệm liền mạch của một hệ sinh thái duy nhất.
* **Tối Giản Hóa Header & Triệt Tiêu Trùng Lặp**:
  - Không đặt các nút trùng lặp dẫn sang cùng một đích trên cả Topbar và Main Navbar.
  - Trên chuyên trang Murrplastik, loại bỏ thanh phụ `parent-bar-inner` trên đầu trang để giữ navbar chính tại `top: 0`, đảm bảo tính thanh thoát trên di động và máy tính.
* **Khoảng Cách Bố Cục Chân Trang (Footer Spacing)**:
  - Khối Card Hệ Thống Phân Phối T&T Vina (`.footer-protools-ecosystem`) phải duy trì khoảng cách tối thiểu `4.5rem` (`72px`) so với form liên hệ bên trên để tránh cảm giác chật chội.
* **Tối Ưu Tốc Độ & Độ Ổn Định Phát Hành Production (`deploy_production_root.py`)**:
  - Tích hợp kiểm tra kích thước file nhị phân qua FTP (`ftp.size(file) == local_size`): Bỏ qua an toàn 100+ file ảnh/video/3D nặng đã tồn tại trên server, rút ngắn thời gian deploy từ 15 phút xuống dưới 20 giây và chống timeout mạng.
### Rule 9.38: Quy Chuẩn Hub Danh Mục Thiết Bị Triển Lãm & Sticky Reading Tracker Chuẩn Gọn (08/09/2026)
* **Hub Danh Mục Thiết Bị Triển Lãm 67 Hạng Mục (Brand Switcher & 4 Cột Tiêu Chuẩn)**:
  - **Phân luồng 2 Master Brands**:
    1. **Hàng Hãng Murrplastik (Đức)**: 36 thiết bị/phụ kiện (`M-01` đến `M-36`), bao gồm Máy in tem Laser `mp-LM 1M`, R-Tec Box, Xích cáp MP 560 RV, MP 800 RK, Tấm luồn cáp KDP/X, KDP/P EX, TRO Liner 2.0, SAT-GF.
    2. **Hàng Thương Mại T&T Vina**: 31 thiết bị/vật tư (`T-01` đến `T-31`), bao gồm Robot hàn, Hakko 936, Bể hàn CM-808, Tô vít Hios, Robot bơm keo SP-982, Zcut 9, HP-10, Quạt ion SL-001, kim bơm, mũi hàn.
    3. **Tất Cả Thiết Bị**: 67 hạng mục tổng thể.
  - **Bảng 4 Cột Tiêu Chuẩn**:
    - Cột 1: `STT` (Badge màu thương hiệu: Đỏ `#E30613` cho Murrplastik, Xanh `#00478D` cho T&T Vina).
    - Cột 2: `TÊN THIẾT BỊ / PHỤ KIỆN` (Tên thiết bị, Part Number, hãng sản xuất, tag phân loại kỹ thuật).
    - Cột 3: `SỐ LƯỢNG` (Số lượng trưng bày thực tế, căn giữa).
    - Cột 4: `ĐẶC TÍNH & GHI CHÚ KỸ THUẬT` (Thông số Đức/Nhật chính xác, tính năng và nút liên hệ tư vấn trực tiếp).
* **Phụ Lục 5 Phần & Sticky Reading Tracker Tối Giản**:
  - **Phụ Lục Bài Viết Đầu Trang (5 Phần)**: Chia rõ 5 phần trọng tâm của bài viết (1. Gian Hàng 3D, 2. 6 Hệ Sinh Thái Murr, 3. Quà Tặng Khách VIP, 4. Đăng Ký Tham Quan, 5. Danh Mục Thiết Bị Trưng Bày).
  - **Sticky Reading Tracker Chuẩn Gọn**:
    - Cố định trên cùng khi cuộn màn hình, tích hợp thanh tiến trình đọc gradient 3px.
    - Định dạng hiển thị bắt buộc: **`X/5: [Tên Phần]`** (ví dụ: `2/5: 6 Hệ Sinh Thái Murrplastik`), tuyệt đối không thêm tiền tố/hậu tố rườm rà.
    - Hỗ trợ nút mở nhanh bảng danh mục phần (Quick Dropdown) và nút cuộn mượt về Form Đăng Ký.
* **Quy Chuẩn CSS Cột STT & Badge Chống Gãy Dòng (STT Badge Layout Standard)**:
  - Chiều rộng cột STT cố định tối thiểu `72px` (`.vec26-th-stt`, `.vec26-col-stt`).
  - Badge cấu hình `display: inline-flex; align-items: center; justify-content: center; min-width: 48px; height: 26px; white-space: nowrap; font-family: 'JetBrains Mono';`.
  - Cấm tuyệt đối hiện tượng ngắt dòng ở dấu gạch ngang (`M-` / `01`), tích hợp hiệu ứng hover đổi màu nền theo thương hiệu chủ đạo (`#E30613` cho Murrplastik, `#00478D` cho T&T Vina).

### Rule 9.39: Quy Chuẩn Bố Cục Phụ Lục Header, Hero Showcase 6 Hệ Sinh Thái & Bộ Quà Tặng Doanh Nghiệp VIP (08/09/2026)
* **Phụ Lục Tích Hợp Trực Tiếp Trong Header (`.news-header-section`)**:
  - Đặt `.article-toc-box` nằm trọn trong khối `<header class="news-header-section">` ngay dưới `.event-meta-card`.
  - Phân tách cấu trúc rõ ràng: Nền xám kỹ thuật `#F8FAFC`, thẻ con `#FFFFFF`, viền `#E2E8F0`, giúp người đọc định hình 5 phần nội dung ngay khi tiếp cận bài viết trước khi bước vào không gian 3D.
* **Hero Showcase & Hệ Thống Ảnh 6 Hệ Sinh Thái Murrplastik (Section 2)**:
  - **Hero Showcase Đầu Section**: Sử dụng ảnh toàn cảnh ứng dụng `applications_products_murrplastik_no_background_2` trên nền Slate tối gradient `#0B1120` -> `#1E293B` kèm vầng sáng Ambient Red Glow `#E30613` thể hiện tính đồng bộ của 6 hệ sinh thái.
  - **Thẻ Hệ Sinh Thái Đi Kèm Ảnh Kỹ Thuật Thực Tế**:
    - `ACS`: Ảnh máy in khắc laser `mp-LM 1M` kèm thẻ mẫu (`ACS_MP_LM_1M_produkt_02`).
    - `AUR`: Ảnh cụm Dresspack & hộp hồi vị `R-Tec Box` cho robot 6 trục (`aur_cable_retraction_systems_group`).
    - `KDH`: Ảnh tấm luồn cáp vi sinh Clean KDP/S chuẩn FDA kháng nước (`Clean_kdp_s_fda_murrplastik`).
    - `EFK`: Ảnh máng xích dẫn cáp Evochain 420 tháo lắp nhanh (`Evochain_420_konfektioniert_freisteller`).
    - `SUV`: Ảnh hệ thống ống ruột gà & cút nối công nghiệp (`image_Conduits_and_fittings_murrSystems`).
    - `CST`: Ảnh cấu hình may đo CAD 3D Dresspack & ReadyChain (`eco_cst_custom`).
  - Toàn bộ ảnh được tối ưu hóa chuẩn WebP nén không suy hao từ 35MB xuống dưới 900KB tổng thể, bọc trong khung `.eco-img-wrap` nền trắng tương phản cao và hiệu ứng zoom mượt khi hover.
* **Showcase Bộ Quà Tặng Khách Tham Quan VIP (Section 4)**:
  - Đặt khối `.vip-gifts-showcase` ngay cạnh Form Đăng Ký Tham Quan (`#register`), tạo động lực chuyển đổi thị giác trực quan:
    1. Bút Ký Kim Loại Murrplastik chính hãng Đức (`gift_pen_murrplastik`).
    2. Túi Canvas Tiện Ích Murrplastik chuyên dụng đựng tài liệu & catalogue (`gift_tupper_murrplastik`).
    3. Thẻ Tên Kim Loại Khắc Laser Trực Tiếp bằng máy `mp-LM 1M` trong 30 giây theo tên đăng ký.

### Rule 9.40: Tối Ưu Hóa UI/UX Mobile, Giao Diện Sáng Đồng Nhất & Huy Hiệu Scarcity Quà Tặng (08/09/2026)
* **Quy Chuẩn Đồng Nhất Sắc Thái & Kích Thước Khối Hero Hệ Sinh Thái (`.eco-hero-showcase`)**:
  - Chuyển đổi từ nền đen tương phản gắt sang phong cách Technical Light `#F8FAFC`, viền `#E2E8F0`, đổ bóng mềm `rgba(15, 23, 42, 0.04)`.
  - Tối ưu chiều cao hiển thị: Thu hẹp `max-height` ảnh từ `420px` xuống `280px` trên Desktop và `200px` trên Mobile; giảm margin từ `2.5rem` xuống `1.25rem 0 2rem` (desktop) và `1rem 0 1.5rem` (mobile) để tránh chiếm dụng không gian cuộn dọc.
* **Quy Chuẩn Tinh Gọn Nội Dung & Huy Hiệu Quà Tặng VIP Scarcity (Section 4)**:
  - Lược bỏ hoàn toàn đoạn văn dẫn thừa thãi nhằm tăng tốc độ chuyển đổi trực tiếp vào Form.
  - Tích hợp huy hiệu khẩn cấp thị giác (Visual Scarcity Badge): `SỐ LƯỢNG CÓ HẠN · 100 SUẤT ĐĂNG KÝ SỚM` với chấm đỏ phát xung (`gift-pulse-dot`) và tag `SỐ LƯỢNG CÓ HẠN` trên từng thẻ quà tặng (Bút ký, Túi Canvas).
* **Quy Chuẩn Tương Thích Di Động Mobile-First & iOS Safari**:
  - Khắc phục lỗi Auto-Zoom trên iOS Safari: Bắt buộc khai báo `font-size: 16px !important;` cho toàn bộ thẻ `input`, `select`, `textarea` trong form báo giá / đăng ký.
  - Ngăn ngừa gãy dòng huy hiệu trên màn hình hẹp (<640px): Cấu hình `.gifts-label-row` tự động chuyển sang `flex-direction: column` căn lề trái.
  - Giảm padding các thẻ container trên màn hình nhỏ để tránh chiếm dụng không gian hiển thị (`.eco-card` giảm xuống `1.25rem 1rem`, `.reg-left` / `.reg-right` giảm xuống `1.5rem 1.25rem`).

### Rule 9.41: Quy Chuẩn Bảng Dữ Liệu Kỹ Thuật Di Động, Tiêu Đề Dính Đa Chiều & Chống Tràn Màn Hình (08/09/2026)
* **Quy Chuẩn Tiêu Đề Bảng Dính Đa Chiều (Bidirectional Sticky Table Standard)**:
  - Bắt buộc khai báo `border-collapse: separate; border-spacing: 0;` trên thẻ `table` khi dùng `position: sticky` để tránh lỗi biến mất viền hoặc giật layout trên trình duyệt di động WebKit / Chromium.
  - Khối bao ngoài bảng (`.vec26-table-wrap`): Cấu hình `max-height: 60vh - 65vh; overflow: auto; -webkit-overflow-scrolling: touch;`.
  - Tiêu đề bảng (`thead th`): Cấu hình `position: sticky; top: 0; z-index: 25; background: #0F172A; box-shadow: 0 2px 6px rgba(0,0,0,0.18);`.
  - Ô góc trên cùng bên trái (`th.vec26-th-stt`): Khai báo `position: sticky; top: 0; left: 0; z-index: 35;` để cố định tuyệt đối trong cả hai chiều cuộn ngang và cuộn dọc.
  - Cột mã thiết bị (`td.vec26-col-stt`): Khai báo `position: sticky; left: 0; z-index: 15;` kèm màu nền đồng nhất với hàng và đổ bóng nhẹ sang phải (`box-shadow: 2px 0 6px -2px rgba(0,0,0,0.08);`).
* **Quy Chuẩn Chống Tràn Màn Hình & Trả Lại Không Gian Hiển Thị (Zero Mobile Overflow)**:
  - Khắc phục triệt để lỗi padding `.container`: Trên màn hình di động (<768px), giảm padding từ `3rem` (48px) xuống `16px` (và `12px` trên <480px), giải phóng hơn 70px chiều ngang màn hình.
  - Triệt tiêu hiện tượng Flexbox kéo giãn body (`bodyScrollWidth` vượt quá `window.innerWidth`): Luôn khai báo `min-width: 0; width: 100%; max-width: 100%;` cho các container cha chứa thanh tab lọc cuộn ngang (`.vec26-filter-tabs`).
  - Thanh chỉ báo cuộn ngang thông minh (`.vec26-table-scroll-hint`): Tự động hiển thị trên di động với thông điệp hướng dẫn rõ ràng kèm icon chỉ báo.

### Rule 9.42: Tối Ưu Bảng Di Động Liền Khối, Chuẩn Hóa Vị Trí Gian Hàng H2-15a & Triệt Tiêu Khe Hở Footer (08/09/2026)
* **Chuẩn Hóa Vị Trí Gian Hàng & Tinh Gọn Nội Dung 3D**:
  - Cập nhật đồng bộ toàn trang (Meta, Schema JSON-LD, Nav, Badges, 3D Canvas TV, Form) vị trí gian hàng chính thức: **`GIAN HÀNG H2-15a · SẢNH 2`**.
  - Lược bỏ từ "Ảo 3D" trong tiêu đề thành `Mô Phỏng Gian Hàng (Ô H2-15a · Sảnh 2)` và xóa bỏ hoàn toàn dòng mô tả thao tác xoay camera 360 rườm rà.
* **Tăng Tỷ Lệ Hiển Thị Ảnh Tổng Quan Hệ Sinh Thái (`hero_ecosystems.webp`)**:
  - Nâng `max-width` lên `880px`, `max-height` lên `380px` trên Desktop và `260px` trên Mobile giúp sơ đồ kiến trúc 6 giải pháp Made in Germany hiển thị to rõ, nổi bật.
* **Quy Chuẩn Bảng Thông Số Di Động Cuộn Liền Khối (Unified Mobile Spec Table)**:
  - Loại bỏ `position: sticky; left: 0;` trên cột STT để các cột trượt ngang cùng nhau như một khối thống nhất, triệt tiêu hoàn toàn hiện tượng hở khe trắng hoặc lung lay khi vuốt sang phải.
  - Bảo lưu nguyên vẹn `position: sticky; top: 0; z-index: 25;` cho `thead th` để cố định tiêu đề cột khi cuộn dọc xem danh mục 67 thiết bị.
  - Thêm `overscroll-behavior-x: contain;` trên `.vec26-table-wrap` để thao tác vuốt ngang bảng không truyền cử chỉ ra ngoài document.
* **Triệt Tiêu Tuyệt Đối Khe Hở Trắng Sau Footer Trên Màn Hình Điện Thoại**:
  - Áp dụng `overflow-x: clip !important; width: 100% !important; max-width: 100vw !important;` trên `html`, `body` và `footer`. Thuộc tính `clip` khóa cứng viewport không cho phép document pan ngang khi vuốt chạm, đồng thời đảm bảo footer luôn phủ kín 100% chiều ngang màn hình không để lộ nền trắng.

### Rule 9.43: Quy Chuẩn Bảng HTML Đơn Báo Giá B2B Trên AdminCP & Chuẩn Hóa Thời Gian create_time (09/09/2026)
* **Bảng Báo Giá HTML Trong CSDL (`contact_list.content`)**:
  - Khi nhận đơn báo giá từ giỏ hàng B2B (`?tab=cart`), API [`public/api/submit_quote.php`](file:///d:/T&TVina/protools/public/api/submit_quote.php) lưu nội dung dưới dạng bảng HTML có viền nét mảnh (`border="1"`, bordercolor `#cbd5e1`), tiêu đề xám nhạt (`#f1f5f9`), căn lề chuẩn (STT/SL ở giữa, SKU font monospace màu xanh `#005BAC`, Đơn giá căn phải).
  - Khối "Ghi chú dự án" được bọc riêng trong thẻ div viền xanh `#005BAC` nổi bật phía trên bảng.
  - Loại bỏ hoàn toàn các ký tự phân cách ASCII kiểu cũ (`=====` và `-----`).
  - Đầu chuỗi HTML tích hợp thẻ ẩn `<span style="display:none;">Báo giá B2B (X mục)...</span>` để hàm `strip_tags()` tại màn hình danh sách AdminCP (`admincp/#contact`) hiển thị dòng trích dẫn tóm tắt gọn gàng, không bị vỡ giao diện.
* **Chuẩn Hóa Cột Thời Gian Gửi (`create_time`)**:
  - Mã nguồn CMS cũ dùng hàm `format_full_time()` quy ước chuỗi 14 số dạng `YmdHis` (ví dụ `20260909233650`).
  - Giá trị lưu vào cột `create_time` trong CSDL MariaDB phải dùng `date('YmdHis')` thay vì Unix timestamp thô `time()`, đảm bảo AdminCP hiển thị chính xác ngày giờ `HH:mm DD/MM/YYYY`.
* **Phân Tách Nội Dung Email (@mail)**:
  - Tách riêng `$email_body` dạng plain-text phân cấp rõ ràng theo từng thiết bị, bỏ các đường kẻ thô ráp để email gửi đến Sales (`info@t2tvina.com`) luôn sạch sẽ và chuyên nghiệp.

### Rule 9.44: Quy Chuẩn Nhận Diện Tác Giả Footer Toàn Hệ Thống (10/09/2026)
* **Đồng Bộ Dòng Credit Thiết Kế & Phát Triển**:
  - Toàn bộ chân trang hệ thống bao gồm Cổng Mẹ ([`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx)) và Chuyên Trang Con Murrplastik ([`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html), tin tức, triển lãm) hiển thị đồng nhất dòng credit:
    `Designed & Developed by KhaiLL (T&T VINA INDUSTRIAL)`
  - Định dạng: Font monospace, cỡ chữ nhỏ gọn `11px`, màu mờ nhẹ kỹ thuật (`text-slate-500/70` hoặc `rgba(255, 255, 255, 0.45)`).
  - Vị trí trên Chuyên trang Murrplastik: Nằm ở vị trí trung tâm trong `.footer-bottom-row` giữa bản quyền bên trái (`.footer-bottom-left`) và đại lý ủy quyền bên phải (`.footer-bottom-right`), tận dụng hoàn hảo khoảng trống ở giữa; trên màn hình điện thoại tự động chuyển `flex-direction: column` căn giữa gọn gàng.

### Rule 9.45: Bảo Toàn Tính Toàn Vẹn Song Ngữ i18n Murrplastik (10/09/2026)
* **Quy Trình Kiểm Tra i18n Trước Khi Phát Hành**:
  - Mọi thay đổi nội dung chữ (text content), thẻ điều hướng navbar, thông tin footer hoặc các component mới trong phân vùng `public/murrplastik/` phải được khai báo song ngữ đầy đủ cả 2 từ điển `TRANSLATIONS.vi` và `TRANSLATIONS.en` trong [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js).
  - **Cơ chế ghi đè DOM của hàm `applyTranslations()`**: Vì `i18n.js` chạy tự động khi nạp trang và đọc các thẻ có `data-i18n`, nếu giá trị trong file JS chưa được cập nhật (ví dụ key `footer.copy` còn lưu năm 2025 hoặc domain cũ `murrplastikvn.com`), script sẽ tự động ghi đè ngược lại làm mất nội dung mới trên HTML.
  - **Chỉ số kiểm thử bắt buộc**: Số lượng key giữa tiếng Việt và tiếng Anh phải luôn đạt tỉ lệ cân bằng 100% (ví dụ: `562 VI keys = 562 EN keys`), số lượng key thiếu sót (`Missing in VI` / `Missing in EN`) phải luôn bằng `0`.
### Rule 9.46: Kiến Trúc Đa Ngôn Ngữ 7 Quốc Gia & Quy Chuẩn Cờ Vector SVG (10/09/2026)
* **Thứ Tự 7 Ngôn Ngữ Chuẩn Hệ Thống**:
  1. `vi`: 🇻🇳 Tiếng Việt (*Mặc định gốc*)
  2. `en`: 🇬🇧 English (*Tiêu chuẩn kỹ thuật quốc tế*)
  3. `de`: 🇩🇪 Deutsch (*Tiêu chuẩn xuất xứ Murrplastik Đức*)
  4. `zh-CN`: 🇨🇳 中文 (*Ưu tiên phục vụ khách hàng B2B tại VEC 2026*)
  5. `ko`: 🇰🇷 한국어 (*Nhà máy điện tử SMT Hàn Quốc*)
  6. `ja`: 🇯🇵 日本語 (*Tiêu chuẩn thiết bị Nhật Bản Hakko/Hios*)
  7. `th`: 🇹🇭 ไทย (*Trung tâm cơ khí & ô tô ASEAN*)
* **Quy Chuẩn Cờ Vector SVG (Tuân thủ User Rule 1 - Cấm Tuyệt Đối Emoji Windows)**:
  - Tất cả cờ quốc gia được tạo bằng vector SVG phẳng độc quyền tại [`src/components/FlagIcon.tsx`](file:///d:/T&TVina/protools/src/components/FlagIcon.tsx), kích thước chuẩn micro `18px × 12px`, bo góc nhẹ `1.5px` và có viền `0.5px border-black/10`. Tuyệt đối không dùng emoji hệ điều hành.
* **Bộ Từ Điển Thuật Ngữ Kỹ Thuật Công Nghiệp Khóa Cứng (B2B Master Glossary)**:
  - Khóa cứng thuật ngữ chuẩn ngành công nghiệp tránh lỗi dịch máy ngô nghê: Máng xích luồn cáp (`拖链`), Ống ruột gà & đầu nối (`电缆保护软管及接头`), Tấm luồn cáp kín nước (`电缆穿线板`), Bộ Dresspack cáp robot (`机器人管线包及回位系统`), Máy khắc laser (`工业激光打标机`), Trạm hàn thiếc SMT (`防静电焊台`), Robot bơm keo (`自动点胶机`), Máy cắt băng dính (`自动胶带切割机`), Quạt ion khử tĩnh điện (`防静电离子风机`).
* **Đồng Bộ Bộ Nhớ Trình Duyệt (`localStorage`)**:
  - Lưu trữ khóa `tt_vina_locale` xuyên suốt phiên làm việc, tự động khôi phục khi tải lại trang và cầu nối đồng bộ sang Chuyên trang Murrplastik ([`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js)).

### Rule 9.47: Quy Chuẩn Bản Địa Hóa Sâu 100% & Triệt Tiêu Xung Đột Điểm Ngắt Đa Ngôn Ngữ (10/09/2026)
* **Bản Địa Hóa Sâu Toàn Bộ Thiết Bị & Thông Số Kỹ Thuật (Deep Technical Localization)**:
  - Tất cả 77 mã thiết bị thực tế trong hệ thống khi hiển thị tại Trang Chủ (`Home.tsx`), Trang Chi Tiết (`ProductDetail.tsx`) và Kính Lúp Xem Nhanh (`hoveredZoomProduct`) đều được bọc qua hàm `getLocalizedProduct(product, locale)` tại [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
  - Bản địa hóa 100% các trường: Tên máy, Danh mục, Nhãn xuất xứ, Trạng thái sẵn kho, Bảng thông số kỹ thuật (Spec-sheet rows), Đặc tính vận hành SMT/Robot, Nút Thêm báo giá và Hồ sơ chứng từ nhà máy (CO/CQ/VAT/Trial-test).
* **Nâng Cấp Chuyên Trang Murrplastik Sang Hệ Thống 7 Ngôn Ngữ Hoàn Chỉnh**:
  - Mở rộng từ điển [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js) hỗ trợ đầy đủ 7 thứ tiếng: `vi`, `en`, `de`, `zh-CN`, `ko`, `ja`, `th`.
  - Thay thế cụm nút toggle cũ `[VI | EN]` bằng Dropdown chuẩn Swiss-Precision mang phong cách công nghiệp cao cấp (`#0F172A`, viền `#E30613`), tích hợp cờ vector SVG micro, hiển thị tên ngôn ngữ bản xứ và dấu tích kích hoạt `✓`.
  - Bổ sung lưới chọn ngôn ngữ dạng Grid 2 cột trong Mobile Drawer Menu phục vụ người dùng smartphone tại sự kiện VEC 2026.
* **Triệt Tiêu Tuyệt Đối Tình Trạng Trùng Lặp Bộ Đổi Ngôn Ngữ (Zero-Duplicate Breakpoint)**:
  - Loại bỏ hoàn toàn bộ chọn ngôn ngữ ở thanh Utility Bar phía trên (`h-9 flex`).
  - Tại thanh Navigation chính, phân định dứt khoát điểm ngắt:
    - Màn hình Desktop & Tablet (`>= sm`): Chỉ hiển thị DUY NHẤT 1 dropdown `<LanguageSwitcher variant="header" />` (`hidden sm:inline-block`).
    - Màn hình Điện thoại (`< sm`): Chỉ hiển thị DUY NHẤT 1 ô toggle gọn nhẹ `<LanguageSwitcher variant="utility" />` (`sm:hidden`).
  - Đảm bảo trên mọi độ phân giải màn hình (desktop, tablet, mobile) luôn luôn chỉ tồn tại đúng 1 bộ chuyển đổi ngôn ngữ duy nhất.

### Rule 9.48: Quy Chuẩn Tích Hợp Sản Phẩm Thiết Bị Hàn QUICK 205 & Bảng Phụ Kiện Tiêu Chuẩn (15/09/2026)
* **Thông Tin Kỹ Thuật Sản Phẩm QUICK 205**:
  - Mã định danh (ID): `QUICK-205` / SKU: `TTV-QUI-205`.
  - Tên thiết bị: `Trạm hàn cao tần QUICK 205 ESD (150W)`.
  - Hãng sản xuất: `QUICK (Phân phối chính hãng)` - Danh mục: `Thiết bị hàn công nghiệp / Trạm hàn ESD` (`categorySlug: 'thiet-bi-han'`).
  - Xuất xứ: `Chính Hãng` · Trạng thái: `Sẵn hàng tại kho Hà Nội & Hưng Yên`.
  - Công nghệ & Công suất: Gia nhiệt xoáy cao tần (High-Frequency Eddy Current Heating) 150W bù nhiệt siêu tốc, dải nhiệt 200°C ~ 600°C, độ ổn định ±2°C, điện áp 220V AC / 50Hz, điện trở nối đất < 2Ω, điện áp rò < 2mV, đạt chuẩn chống tĩnh điện ESD Safe.
* **Tài Nguyên Hình Ảnh Studio Thực Tế**:
  - Nguồn ảnh gốc: `D:\Design_hub\01_BRANDS\TT_VINA\ASSETS\1_thiết_bị_hàn_ESD_QUICK_205.png`.
  - Đã sao lưu và tối ưu vào: `public/images/products/quick-205.png` (bản gốc studio trong suốt) và `public/images/products/quick-205.webp` (bản WebP 259KB).
* **Bản Địa Hóa Đa Ngôn Ngữ & Nâng Cấp Giao Diện B2B**:
  - Cập nhật bản dịch tên máy đa ngôn ngữ sang 6 thứ tiếng trong `PRODUCT_NAME_TRANSLATIONS` ([`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts)).
  - Mở rộng từ điển `SPEC_KEY_TRANSLATIONS` dịch chuẩn xác 8 thông số kỹ thuật mới: Công suất định mức, Công nghệ gia nhiệt, Dải nhiệt độ cài đặt, Độ ổn định nhiệt độ, Điện áp hoạt động, Điện trở nối đất đầu mỏ hàn, Điện áp rò đầu mỏ hàn, Tiêu chuẩn chống tĩnh điện.
  - Tối ưu hóa giao diện [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx): Tự động in đậm tiền tố tính năng khi có dấu hai chấm `:`, và hiển thị khối riêng lưới "Phụ Kiện Tiêu Chuẩn Đi Kèm (Standard Included Accessories)" gồm 7 thành phần chi tiết của trạm hàn QUICK 205.

### Rule 9.49: Quy Chuẩn Tự Động Hóa Quản Trị Danh Mục & Bản Địa Hóa Sâu Toàn Diện (Catalog Automation & Deep Localization - 15/09/2026)
* **Đóng Gói Kỹ Năng Quản Trị Danh Mục Hàng Loạt (Skill `protools-catalog-manager`)**:
  - Mã nguồn thực thi: [`scripts/catalog_manager.py`](file:///d:/T&TVina/protools/scripts/catalog_manager.py).
  - Lệnh CLI tự động hóa trong `package.json`:
    - `pnpm catalog:add --input path/to/products.json`: Tự động thêm 1 hoặc N sản phẩm hàng loạt.
    - `pnpm catalog:audit`: Quét toàn bộ danh mục, đối soát ảnh hỏng, kiểm tra 100% độ phủ dịch thuật thông số kỹ thuật.
  - Quy trình xử lý tự động khép kín (End-to-End Pipeline):
    1. Nhận danh sách N sản phẩm từ file JSON.
    2. Đọc ảnh gốc từ đường dẫn máy nội bộ (local asset), tối ưu hóa nén chuẩn WebP chất lượng cao (PIL Pillow, quality 85) lưu vào `public/images/products/<slug>.webp`.
    3. Tự động sinh dữ liệu dịch thuật B2B sang đầy đủ 7 ngôn ngữ (`vi`, `en`, `zh-CN`, `de`, `ko`, `ja`, `th`).
    4. Ghi nối tiếp an toàn vào `PRODUCTS` trong [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và cập nhật từ điển [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
    5. Tự động chạy `pnpm build` xác thực TypeScript và bundling trước khi hoàn tất.
* **Bản Địa Hóa Sâu 100% Cột 1 & Cột 2 Bảng Thông Số Kỹ Thuật (Spec-Sheet Full Parity)**:
  - Bổ sung toàn bộ 13 khóa thông số kỹ thuật còn thiếu vào `SPEC_KEY_TRANSLATIONS`: Chương trình lập trình hẹn giờ, Chức năng, Dự án tiêu biểu, Kích thước (D x R x C), Lượng keo tối thiểu, Model, Trọng lượng, Áp suất khí ra, Áp suất khí vào, Điện áp đầu ra, Điện áp đầu vào, Độ bền uốn, Ứng dụng Robot.
  - Chuẩn hóa từ điển `COMMON_VALUE_TRANSLATIONS` cho 100% các giá trị văn bản kỹ thuật xuất hiện trong catalog: Nhà sản xuất, Xuất xứ, Trạng thái kho, Thiết bị phụ trợ, Robot hàn ABB/KUKA, Dự án Body Shop VinFast Cát Hải, v.v. Các đơn vị đo lường quốc tế (W, V, Hz, bar, ml, s, g, °C, Ω, mV) được giữ nguyên chuẩn kỹ thuật toàn cầu.
* **Bản Địa Hóa Toàn Diện Tính Năng & Phụ Kiện Tiêu Chuẩn (Features & Accessories)**:
  - Chuẩn hóa toàn bộ 16 điểm nổi bật (`ALL_HIGHLIGHTS_TRANSLATIONS`) và 7 phụ kiện tiêu chuẩn (`ALL_ACCESSORIES_TRANSLATIONS`) sang 7 ngôn ngữ.
  - Nâng cấp `translateFeatureItem()` và `translateAccessoryItem()` xử lý trơn tru các chuỗi tính năng dạng tiền tố `Tiền_tố: Diễn_giải`.
  - Loại bỏ hoàn toàn fallback tiếng Việt hoặc mảng tính năng mẫu chung chung, bảo toàn nội dung kỹ thuật chi tiết của từng sản phẩm.
* **Bản Địa Hóa Giao Diện B2B Misumi Pricing Tiers & Case Study Banner**:
- Tại [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), chuyển đổi toàn bộ tiêu đề, nhãn bảng bậc giá số lượng B2B (Q'ty, Pricing Policy, Lead Time, Click hint) và thông điệp chứng thực dự án VinFast Body Shop sang hàm `t()` đa ngôn ngữ.
### Rule 9.50: Quy Chuẩn Tải Nén Ảnh WebP Đa Luồng & Bóc Tách Làm Giàu Dữ Liệu B2B Hàng Loạt (15/09/2026)
* **Đường Ống Tải & Nén Ảnh WebP Tự Động (Multithreaded Sapo Image Pipeline)**:
- Mã nguồn thực thi: [`scripts/download_compress_sapo_images.py`](file:///d:/T&TVina/protools/scripts/download_compress_sapo_images.py).
- Kết quả xử lý thực tế: 6.895 / 6.895 ảnh duy nhất từ CDN Sapo được tải và nén WebP thành công 100% trong 4.5 phút (0 lỗi, tốc độ ~25.3 ảnh/giây với 20 luồng song song).
- Chuẩn nén: WebP Quality 82, kích thước cạnh tối đa 800px (thuật toán LANCZOS), giữ nguyên kênh Alpha trong suốt. Giảm dung lượng từ ~1.5 MB xuống ~37 KB/ảnh (giảm 95%), tổng dung lượng toàn bộ 6.895 ảnh chỉ còn 256.2 MB tại [`public/images/products/sapo/`](file:///d:/T&TVina/protools/public/images/products/sapo/).
- Bảng ánh xạ tập trung: [`public/data/sapo_image_map.json`](file:///d:/T&TVina/protools/public/data/sapo_image_map.json) map 6.897 mã SKU sang đường dẫn file WebP nội bộ.
* **Pipeline Phân Cụm Ngành Hàng & Sinh Mô Tả Kỹ Thuật B2B (Data Enrichment Pipeline)**:
- Mã nguồn thực thi: [`scripts/enrich_sapo_descriptions.py`](file:///d:/T&TVina/protools/scripts/enrich_sapo_descriptions.py).
- Giải quyết triệt để vấn đề 7.477 sản phẩm (99.97%) bị trống mô tả trong kho Sapo:
1. Tự động bóc tách thông số kỹ thuật có sẵn trong chuỗi tên: Quy cách ren (`M12x40`), đường kính ống phi (`PV12` -> 12mm), kích thước băng tải (`2008*85*2mm`), nòng và hành trình xi lanh (`MGPM32-75Z` -> nòng 32mm, hành trình 75mm), điện áp (`220V`, `24V`).
2. Tự động phân loại vào 16 nhóm ngành hàng công nghiệp (Khí nén, Xi lanh, Mũi vít, Kim bơm keo, Bu lông, Băng tải, Cảm biến, Mũi hàn, Rơ le, v.v.).
3. Tự động sinh đoạn văn mô tả chuẩn văn phong B2B công nghiệp kèm tình trạng tồn kho thực tế, đơn vị tính và cam kết giao hàng KCN.
- Bộ dữ liệu hoàn chỉnh lưu độc lập tại [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json) và bản mẫu 25 sản phẩm tại [`public/data/sapo_sample_25_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_sample_25_enriched.json) phục vụ nghiệm thu trước khi tích hợp frontend.
### Rule 9.51: Quy Chuẩn Nhóm Biến Thể Murrplastik (Master-Variant Matrix) & Dashboard Quản Trị Excel B2B (15/09/2026)
* **Mô Hình Dòng Sản Phẩm Cha & Biến Thể Quy Cách (Murrplastik Variantes Standard)**:
- Học hỏi cấu trúc chuẩn từ Murrplastik Shop (`shop.murrplastik.com`), các sản phẩm cùng loại nhưng khác kích cỡ/thông số (ví dụ: `Cút nối góc PV12`, `PV10`, `PV8`) được gom nhóm về cùng một Dòng sản phẩm cha (`Cút nối góc PV (AKS)`) với bảng ma trận biến thể (`variants` array).
- Tự động bóc tách quy cách: Kích thước phi ống (`Phi 12 mm`), ren bu lông (`M12 x 40 mm`), kích thước 3 chiều băng tải/phíp (`2008 x 85 x 2 mm`), nòng và hành trình xi lanh (`Nòng 32mm - Hành trình 75mm`), cỡ kim keo (`16G`), v.v.
- Xuất bản tệp dữ liệu cấu trúc: [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json) (8.2 MB) chứa 6.995 Master Families, mỗi family lưu trữ mã `masterId`, tên gốc, nhóm ngành, mô tả kỹ thuật đại diện, ảnh đại diện và mảng `variants` chi tiết phục vụ render tab Variantes trên giao diện web.
* **Quy Chuẩn Bảng Tính Quản Trị Excel B2B Đa Tương Tác**:
- Cập nhật trực tiếp trên tệp: [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx).
- Cấu trúc tích hợp:
1. **Cột D (Mô tả sản phẩm)**: Cập nhật 100% (7.479 dòng) mô tả kỹ thuật chuẩn B2B công nghiệp.
2. **Cột 34 (Ảnh WebP Local)**: Khởi tạo 6.820 công thức `=HYPERLINK("...", "Xem Ảnh WebP (XX KB)")` cho phép click chuột trực tiếp từ Excel để mở ảnh chất lượng cao trên máy tính Windows.
3. **Cột 35 (Dòng sản phẩm cha - Master Family)**: Phục vụ lọc nhanh nhóm sản phẩm theo họ thiết bị.
4. **Cột 36 (Quy cách biến thể - Variant Specs)**: Bóc tách rõ kích thước/thông số cụ thể.
5. **Cột 37 (Trạng thái sẵn kho B2B)**: Phối màu trực quan (Xanh lá `#E8F5E9` cho 1.045 mặt hàng có sẵn tồn kho; Xám nhạt `#FAFAFA` cho 6.434 mặt hàng đặt theo dự án).
6. **Sheet `TongQuanDanhMuc`**: Bảng điều khiển KPI (Tổng SKU, Số ảnh WebP nén thành công, Số dòng sản phẩm cha, Tỷ lệ sẵn kho) kèm bảng phân bổ theo 16 nhóm ngành hàng công nghiệp.
7. **Cố định hàng tiêu đề (Freeze Panes B2)** và bật bộ lọc tự động (**AutoFilter**) trên toàn bộ bảng tính.
### Rule 9.52: Bài Học Nghiệp Vụ - Tuyệt Đối Không Tự Ý Suy Đoán & Gán Nhãn Hãng OEM Quốc Tế Cho Dữ Liệu Kho Sapo (16/09/2026)
* **Sự Cố & Nhận Định Nghiệp Vụ Từ User**:
- Bộ mẫu thử nghiệm 30 sản phẩm đối soát nguồn OEM quốc tế (SMC, Festo, Musashi, HIOS...) đã được User kiểm tra và xác nhận **không chính xác** với nguồn hàng thực tế phân phối tại kho của công ty.
- **Nguyên nhân gốc rễ**: Các linh kiện cơ khí, khí nén trong kho Sapo (như xi lanh, cút nối, kim keo, đầu vít...) dù mang mã quy cách kích thước tương thích với tiêu chuẩn thông dụng trên thị trường nhưng thực tế được cung cấp bởi các đối tác phụ trợ nội địa (`KHOA KIM`, `LKĐT`, cơ sở gia công...) hoặc là linh kiện thay thế tương đương, không phải sản phẩm chính hãng có chứng chỉ CO/CQ của các tập đoàn quốc tế nói trên. Việc tự ý gán nhãn làm sai lệch định danh hàng hóa và tính pháp lý thương mại của T&T Vina.
* **Hành Động Khắc Phục & Nguyên Tắc Bất Biến**:
1. **Hủy bỏ hoàn toàn**: Đã xóa triệt để bộ tệp thử nghiệm gồm `Mau_Xac_Thuc_Mo_Ta_B2B_30_San_Pham.xlsx`, `public/data/sapo_authentic_pilot_30.json` và script `scripts/enrich_authentic_pilot.py`.
2. **Bảo toàn dữ liệu thực tế**: Mọi mô tả, thông số và nhãn hiệu của 7.479 sản phẩm BẮT BUỘC tôn trọng 100% trường dữ liệu gốc xuất từ Sapo (nhãn hiệu `KHOA KIM`, `LKĐT`, `Techno`, hoặc để ngỏ theo phân phối T&T Vina), tuyệt đối không suy đoán nguồn gốc bên ngoài.
3. **Bộ dữ liệu chuẩn**: Duy trì và vận hành thống nhất trên tệp Excel [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx) và ma trận biến thể [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json).

### Rule 9.53: Quy Chuẩn Song Ngữ Anh - Việt & Trình Chuyển Ngữ Tự Động Hóa Ô Tô (17/09/2026)
* **Bản Địa Hóa Toàn Diện Trang Giải Pháp Ngành Ô Tô Murrplastik (`/murrplastik/industries/san-xuat-o-to/`)**:
  - Giao diện: Tích hợp thanh toggle song ngữ `[ VI | EN ]` với cờ Vector SVG micro chuẩn thương hiệu tại Header (`.lang-switch-group`), tuyệt đối không sử dụng emoji hệ điều hành.
  - Từ điển i18n (`TRANSLATIONS_AUTO`): Bao phủ 100% nội dung trang gồm Header, Biên bản cuộc họp 3 bên (VinFast - Murrplastik - T&T Vina), Khảo sát sự cố đứt gãy cáp tại xưởng Body Shop, Giải pháp cải tạo Dresspack & Trục 6 Rotary Base, Bảng BOM chi tiết 2 dòng Robot ABB IRB 7600/6700, Nhật ký thi công 2 giai đoạn, Thanh so sánh ảnh trước/sau, Video Shorts thực tế, và khối giải đáp 4 câu hỏi FAQ chuẩn kỹ thuật.
  - Tích hợp 3D WebGL Viewer: Cập nhật động dòng trạng thái tải mô hình STL và nút bấm bật/tắt xoay tự động theo ngôn ngữ đã chọn.
  - Cơ chế đồng bộ đa kênh:
    1. `localStorage`: Đồng bộ đồng thời cả 2 khóa `mp_lang` (nội bộ phân vùng Murrplastik) và `tt_vina_locale` (cổng mẹ T&T Vina).
    2. URL Search Param: Hỗ trợ nạp trực tiếp qua tham số `?lang=en` hoặc `?lang=vi` và tự động cập nhật URL bằng `history.replaceState()` không tải lại trang.
    3. Trạng thái DOM: Cập nhật đồng bộ `document.documentElement.lang` và `<title>` của trang.

### Rule 9.54: Quy Chuẩn Quản Lý Tin Tức, Hình Ảnh Chuẩn SEO & Chuyển Đổi Tên Miền Murrplastik (21/09/2026)
* **Quy Chuẩn Tên Ảnh Chuẩn SEO & Cấu Trúc Thư Mục Tài Nguyên**:
  - Tên ảnh chuẩn SEO: Đổi từ `VEC_VIIF2026_Murrplastik_TTVina_booth.jpeg` sang định dạng chuẩn SEO viết thường, phân cách dấu gạch ngang: `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.jpg` và phiên bản nén WebP siêu nhẹ `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.webp`.
  - Quy hoạch đường dẫn tài nguyên: Lưu trữ tập trung tại [`public/murrplastik/assets/images/tin-tuc/`](file:///d:/T&TVina/protools/public/murrplastik/assets/images/tin-tuc/) kèm bản sao tương thích tại thư mục bài viết [`public/murrplastik/tin-tuc/trien-lam-vec-2026/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/trien-lam-vec-2026/).
* **Mở Rộng Hệ Thống Tin Tức & Khối Giải Pháp Ngành Trên Trang Chủ Murrplastik (`#news`)**:
  - **Hero Showcase Đầu Section**: Sử dụng ảnh toàn cảnh ứng dụng `applications_products_murrplastik_no_background_2` trên nền Slate tối gradient `#0B1120` -> `#1E293B` kèm vầng sáng Ambient Red Glow `#E30613` thể hiện tính đồng bộ của 6 hệ sinh thái.
  - **Thẻ Hệ Sinh Thái Đi Kèm Ảnh Kỹ Thuật Thực Tế**:
    - `ACS`: Ảnh máy in khắc laser `mp-LM 1M` kèm thẻ mẫu (`ACS_MP_LM_1M_produkt_02`).
    - `AUR`: Ảnh cụm Dresspack & hộp hồi vị `R-Tec Box` cho robot 6 trục (`aur_cable_retraction_systems_group`).
    - `KDH`: Ảnh tấm luồn cáp vi sinh Clean KDP/S chuẩn FDA kháng nước (`Clean_kdp_s_fda_murrplastik`).
    - `EFK`: Ảnh máng xích dẫn cáp Evochain 420 tháo lắp nhanh (`Evochain_420_konfektioniert_freisteller`).
    - `SUV`: Ảnh hệ thống ống ruột gà & cút nối công nghiệp (`image_Conduits_and_fittings_murrSystems`).
    - `CST`: Ảnh cấu hình may đo CAD 3D Dresspack & ReadyChain (`eco_cst_custom`).
  - Toàn bộ ảnh được tối ưu hóa chuẩn WebP nén không suy hao từ 35MB xuống dưới 900KB tổng thể, bọc trong khung `.eco-img-wrap` nền trắng tương phản cao và hiệu ứng zoom mượt khi hover.
* **Showcase Bộ Quà Tặng Khách Tham Quan VIP (Section 4)**:
  - Đặt khối `.vip-gifts-showcase` ngay cạnh Form Đăng Ký Tham Quan (`#register`), tạo động lực chuyển đổi thị giác trực quan:
    1. Bút Ký Kim Loại Murrplastik chính hãng Đức (`gift_pen_murrplastik`).
    2. Túi Canvas Tiện Ích Murrplastik chuyên dụng đựng tài liệu & catalogue (`gift_tupper_murrplastik`).
    3. Thẻ Tên Kim Loại Khắc Laser Trực Tiếp bằng máy `mp-LM 1M` trong 30 giây theo tên đăng ký.

### Rule 9.40: Tối Ưu Hóa UI/UX Mobile, Giao Diện Sáng Đồng Nhất & Huy Hiệu Scarcity Quà Tặng (08/09/2026)
* **Quy Chuẩn Đồng Nhất Sắc Thái & Kích Thước Khối Hero Hệ Sinh Thái (`.eco-hero-showcase`)**:
  - Chuyển đổi từ nền đen tương phản gắt sang phong cách Technical Light `#F8FAFC`, viền `#E2E8F0`, đổ bóng mềm `rgba(15, 23, 42, 0.04)`.
  - Tối ưu chiều cao hiển thị: Thu hẹp `max-height` ảnh từ `420px` xuống `280px` trên Desktop và `200px` trên Mobile; giảm margin từ `2.5rem` xuống `1.25rem 0 2rem` (desktop) và `1rem 0 1.5rem` (mobile) để tránh chiếm dụng không gian cuộn dọc.
* **Quy Chuẩn Tinh Gọn Nội Dung & Huy Hiệu Quà Tặng VIP Scarcity (Section 4)**:
  - Lược bỏ hoàn toàn đoạn văn dẫn thừa thãi nhằm tăng tốc độ chuyển đổi trực tiếp vào Form.
  - Tích hợp huy hiệu khẩn cấp thị giác (Visual Scarcity Badge): `SỐ LƯỢNG CÓ HẠN · 100 SUẤT ĐĂNG KÝ SỚM` với chấm đỏ phát xung (`gift-pulse-dot`) và tag `SỐ LƯỢNG CÓ HẠN` trên từng thẻ quà tặng (Bút ký, Túi Canvas).
* **Quy Chuẩn Tương Thích Di Động Mobile-First & iOS Safari**:
  - Khắc phục lỗi Auto-Zoom trên iOS Safari: Bắt buộc khai báo `font-size: 16px !important;` cho toàn bộ thẻ `input`, `select`, `textarea` trong form báo giá / đăng ký.
  - Ngăn ngừa gãy dòng huy hiệu trên màn hình hẹp (<640px): Cấu hình `.gifts-label-row` tự động chuyển sang `flex-direction: column` căn lề trái.
  - Giảm padding các thẻ container trên màn hình nhỏ để tránh chiếm dụng không gian hiển thị (`.eco-card` giảm xuống `1.25rem 1rem`, `.reg-left` / `.reg-right` giảm xuống `1.5rem 1.25rem`).

### Rule 9.41: Quy Chuẩn Bảng Dữ Liệu Kỹ Thuật Di Động, Tiêu Đề Dính Đa Chiều & Chống Tràn Màn Hình (08/09/2026)
* **Quy Chuẩn Tiêu Đề Bảng Dính Đa Chiều (Bidirectional Sticky Table Standard)**:
  - Bắt buộc khai báo `border-collapse: separate; border-spacing: 0;` trên thẻ `table` khi dùng `position: sticky` để tránh lỗi biến mất viền hoặc giật layout trên trình duyệt di động WebKit / Chromium.
  - Khối bao ngoài bảng (`.vec26-table-wrap`): Cấu hình `max-height: 60vh - 65vh; overflow: auto; -webkit-overflow-scrolling: touch;`.
  - Tiêu đề bảng (`thead th`): Cấu hình `position: sticky; top: 0; z-index: 25; background: #0F172A; box-shadow: 0 2px 6px rgba(0,0,0,0.18);`.
  - Ô góc trên cùng bên trái (`th.vec26-th-stt`): Khai báo `position: sticky; top: 0; left: 0; z-index: 35;` để cố định tuyệt đối trong cả hai chiều cuộn ngang và cuộn dọc.
  - Cột mã thiết bị (`td.vec26-col-stt`): Khai báo `position: sticky; left: 0; z-index: 15;` kèm màu nền đồng nhất với hàng và đổ bóng nhẹ sang phải (`box-shadow: 2px 0 6px -2px rgba(0,0,0,0.08);`).
* **Quy Chuẩn Chống Tràn Màn Hình & Trả Lại Không Gian Hiển Thị (Zero Mobile Overflow)**:
  - Khắc phục triệt để lỗi padding `.container`: Trên màn hình di động (<768px), giảm padding từ `3rem` (48px) xuống `16px` (và `12px` trên <480px), giải phóng hơn 70px chiều ngang màn hình.
  - Triệt tiêu hiện tượng Flexbox kéo giãn body (`bodyScrollWidth` vượt quá `window.innerWidth`): Luôn khai báo `min-width: 0; width: 100%; max-width: 100%;` cho các container cha chứa thanh tab lọc cuộn ngang (`.vec26-filter-tabs`).
  - Thanh chỉ báo cuộn ngang thông minh (`.vec26-table-scroll-hint`): Tự động hiển thị trên di động với thông điệp hướng dẫn rõ ràng kèm icon chỉ báo.

### Rule 9.42: Tối Ưu Bảng Di Động Liền Khối, Chuẩn Hóa Vị Trí Gian Hàng H2-15a & Triệt Tiêu Khe Hở Footer (08/09/2026)
* **Chuẩn Hóa Vị Trí Gian Hàng & Tinh Gọn Nội Dung 3D**:
  - Cập nhật đồng bộ toàn trang (Meta, Schema JSON-LD, Nav, Badges, 3D Canvas TV, Form) vị trí gian hàng chính thức: **`GIAN HÀNG H2-15a · SẢNH 2`**.
  - Lược bỏ từ "Ảo 3D" trong tiêu đề thành `Mô Phỏng Gian Hàng (Ô H2-15a · Sảnh 2)` và xóa bỏ hoàn toàn dòng mô tả thao tác xoay camera 360 rườm rà.
* **Tăng Tỷ Lệ Hiển Thị Ảnh Tổng Quan Hệ Sinh Thái (`hero_ecosystems.webp`)**:
  - Nâng `max-width` lên `880px`, `max-height` lên `380px` trên Desktop và `260px` trên Mobile giúp sơ đồ kiến trúc 6 giải pháp Made in Germany hiển thị to rõ, nổi bật.
* **Quy Chuẩn Bảng Thông Số Di Động Cuộn Liền Khối (Unified Mobile Spec Table)**:
  - Loại bỏ `position: sticky; left: 0;` trên cột STT để các cột trượt ngang cùng nhau như một khối thống nhất, triệt tiêu hoàn toàn hiện tượng hở khe trắng hoặc lung lay khi vuốt sang phải.
  - Bảo lưu nguyên vẹn `position: sticky; top: 0; z-index: 25;` cho `thead th` để cố định tiêu đề cột khi cuộn dọc xem danh mục 67 thiết bị.
  - Thêm `overscroll-behavior-x: contain;` trên `.vec26-table-wrap` để thao tác vuốt ngang bảng không truyền cử chỉ ra ngoài document.
* **Triệt Tiêu Tuyệt Đối Khe Hở Trắng Sau Footer Trên Màn Hình Điện Thoại**:
  - Áp dụng `overflow-x: clip !important; width: 100% !important; max-width: 100vw !important;` trên `html`, `body` và `footer`. Thuộc tính `clip` khóa cứng viewport không cho phép document pan ngang khi vuốt chạm, đồng thời đảm bảo footer luôn phủ kín 100% chiều ngang màn hình không để lộ nền trắng.

### Rule 9.43: Quy Chuẩn Bảng HTML Đơn Báo Giá B2B Trên AdminCP & Chuẩn Hóa Thời Gian create_time (09/09/2026)
* **Bảng Báo Giá HTML Trong CSDL (`contact_list.content`)**:
  - Khi nhận đơn báo giá từ giỏ hàng B2B (`?tab=cart`), API [`public/api/submit_quote.php`](file:///d:/T&TVina/protools/public/api/submit_quote.php) lưu nội dung dưới dạng bảng HTML có viền nét mảnh (`border="1"`, bordercolor `#cbd5e1`), tiêu đề xám nhạt (`#f1f5f9`), căn lề chuẩn (STT/SL ở giữa, SKU font monospace màu xanh `#005BAC`, Đơn giá căn phải).
  - Khối "Ghi chú dự án" được bọc riêng trong thẻ div viền xanh `#005BAC` nổi bật phía trên bảng.
  - Loại bỏ hoàn toàn các ký tự phân cách ASCII kiểu cũ (`=====` và `-----`).
  - Đầu chuỗi HTML tích hợp thẻ ẩn `<span style="display:none;">Báo giá B2B (X mục)...</span>` để hàm `strip_tags()` tại màn hình danh sách AdminCP (`admincp/#contact`) hiển thị dòng trích dẫn tóm tắt gọn gàng, không bị vỡ giao diện.
* **Chuẩn Hóa Cột Thời Gian Gửi (`create_time`)**:
  - Mã nguồn CMS cũ dùng hàm `format_full_time()` quy ước chuỗi 14 số dạng `YmdHis` (ví dụ `20260909233650`).
  - Giá trị lưu vào cột `create_time` trong CSDL MariaDB phải dùng `date('YmdHis')` thay vì Unix timestamp thô `time()`, đảm bảo AdminCP hiển thị chính xác ngày giờ `HH:mm DD/MM/YYYY`.
* **Phân Tách Nội Dung Email (@mail)**:
  - Tách riêng `$email_body` dạng plain-text phân cấp rõ ràng theo từng thiết bị, bỏ các đường kẻ thô ráp để email gửi đến Sales (`info@t2tvina.com`) luôn sạch sẽ và chuyên nghiệp.

### Rule 9.44: Quy Chuẩn Nhận Diện Tác Giả Footer Toàn Hệ Thống (10/09/2026)
* **Đồng Bộ Dòng Credit Thiết Kế & Phát Triển**:
  - Toàn bộ chân trang hệ thống bao gồm Cổng Mẹ ([`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx)) và Chuyên Trang Con Murrplastik ([`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html), tin tức, triển lãm) hiển thị đồng nhất dòng credit:
    `Designed & Developed by KhaiLL (T&T VINA INDUSTRIAL)`
  - Định dạng: Font monospace, cỡ chữ nhỏ gọn `11px`, màu mờ nhẹ kỹ thuật (`text-slate-500/70` hoặc `rgba(255, 255, 255, 0.45)`).
  - Vị trí trên Chuyên trang Murrplastik: Nằm ở vị trí trung tâm trong `.footer-bottom-row` giữa bản quyền bên trái (`.footer-bottom-left`) và đại lý ủy quyền bên phải (`.footer-bottom-right`), tận dụng hoàn hảo khoảng trống ở giữa; trên màn hình điện thoại tự động chuyển `flex-direction: column` căn giữa gọn gàng.

### Rule 9.45: Bảo Toàn Tính Toàn Vẹn Song Ngữ i18n Murrplastik (10/09/2026)
* **Quy Trình Kiểm Tra i18n Trước Khi Phát Hành**:
  - Mọi thay đổi nội dung chữ (text content), thẻ điều hướng navbar, thông tin footer hoặc các component mới trong phân vùng `public/murrplastik/` phải được khai báo song ngữ đầy đủ cả 2 từ điển `TRANSLATIONS.vi` và `TRANSLATIONS.en` trong [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js).
  - **Cơ chế ghi đè DOM của hàm `applyTranslations()`**: Vì `i18n.js` chạy tự động khi nạp trang và đọc các thẻ có `data-i18n`, nếu giá trị trong file JS chưa được cập nhật (ví dụ key `footer.copy` còn lưu năm 2025 hoặc domain cũ `murrplastikvn.com`), script sẽ tự động ghi đè ngược lại làm mất nội dung mới trên HTML.
  - **Chỉ số kiểm thử bắt buộc**: Số lượng key giữa tiếng Việt và tiếng Anh phải luôn đạt tỉ lệ cân bằng 100% (ví dụ: `562 VI keys = 562 EN keys`), số lượng key thiếu sót (`Missing in VI` / `Missing in EN`) phải luôn bằng `0`.
### Rule 9.46: Kiến Trúc Đa Ngôn Ngữ 7 Quốc Gia & Quy Chuẩn Cờ Vector SVG (10/09/2026)
* **Thứ Tự 7 Ngôn Ngữ Chuẩn Hệ Thống**:
  1. `vi`: 🇻🇳 Tiếng Việt (*Mặc định gốc*)
  2. `en`: 🇬🇧 English (*Tiêu chuẩn kỹ thuật quốc tế*)
  3. `de`: 🇩🇪 Deutsch (*Tiêu chuẩn xuất xứ Murrplastik Đức*)
  4. `zh-CN`: 🇨🇳 中文 (*Ưu tiên phục vụ khách hàng B2B tại VEC 2026*)
  5. `ko`: 🇰🇷 한국어 (*Nhà máy điện tử SMT Hàn Quốc*)
  6. `ja`: 🇯🇵 日本語 (*Tiêu chuẩn thiết bị Nhật Bản Hakko/Hios*)
  7. `th`: 🇹🇭 ไทย (*Trung tâm cơ khí & ô tô ASEAN*)
* **Quy Chuẩn Cờ Vector SVG (Tuân thủ User Rule 1 - Cấm Tuyệt Đối Emoji Windows)**:
  - Tất cả cờ quốc gia được tạo bằng vector SVG phẳng độc quyền tại [`src/components/FlagIcon.tsx`](file:///d:/T&TVina/protools/src/components/FlagIcon.tsx), kích thước chuẩn micro `18px × 12px`, bo góc nhẹ `1.5px` và có viền `0.5px border-black/10`. Tuyệt đối không dùng emoji hệ điều hành.
* **Bộ Từ Điển Thuật Ngữ Kỹ Thuật Công Nghiệp Khóa Cứng (B2B Master Glossary)**:
  - Khóa cứng thuật ngữ chuẩn ngành công nghiệp tránh lỗi dịch máy ngô nghê: Máng xích luồn cáp (`拖链`), Ống ruột gà & đầu nối (`电缆保护软管及接头`), Tấm luồn cáp kín nước (`电缆穿线板`), Bộ Dresspack cáp robot (`机器人管线包及回位系统`), Máy khắc laser (`工业激光打标机`), Trạm hàn thiếc SMT (`防静电焊台`), Robot bơm keo (`自动点胶机`), Máy cắt băng dính (`自动胶带切割机`), Quạt ion khử tĩnh điện (`防静电离子风机`).
* **Đồng Bộ Bộ Nhớ Trình Duyệt (`localStorage`)**:
  - Lưu trữ khóa `tt_vina_locale` xuyên suốt phiên làm việc, tự động khôi phục khi tải lại trang và cầu nối đồng bộ sang Chuyên trang Murrplastik ([`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js)).

### Rule 9.47: Quy Chuẩn Bản Địa Hóa Sâu 100% & Triệt Tiêu Xung Đột Điểm Ngắt Đa Ngôn Ngữ (10/09/2026)
* **Bản Địa Hóa Sâu Toàn Bộ Thiết Bị & Thông Số Kỹ Thuật (Deep Technical Localization)**:
  - Tất cả 77 mã thiết bị thực tế trong hệ thống khi hiển thị tại Trang Chủ (`Home.tsx`), Trang Chi Tiết (`ProductDetail.tsx`) và Kính Lúp Xem Nhanh (`hoveredZoomProduct`) đều được bọc qua hàm `getLocalizedProduct(product, locale)` tại [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
  - Bản địa hóa 100% các trường: Tên máy, Danh mục, Nhãn xuất xứ, Trạng thái sẵn kho, Bảng thông số kỹ thuật (Spec-sheet rows), Đặc tính vận hành SMT/Robot, Nút Thêm báo giá và Hồ sơ chứng từ nhà máy (CO/CQ/VAT/Trial-test).
* **Nâng Cấp Chuyên Trang Murrplastik Sang Hệ Thống 7 Ngôn Ngữ Hoàn Chỉnh**:
  - Mở rộng từ điển [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js) hỗ trợ đầy đủ 7 thứ tiếng: `vi`, `en`, `de`, `zh-CN`, `ko`, `ja`, `th`.
  - Thay thế cụm nút toggle cũ `[VI | EN]` bằng Dropdown chuẩn Swiss-Precision mang phong cách công nghiệp cao cấp (`#0F172A`, viền `#E30613`), tích hợp cờ vector SVG micro, hiển thị tên ngôn ngữ bản xứ và dấu tích kích hoạt `✓`.
  - Bổ sung lưới chọn ngôn ngữ dạng Grid 2 cột trong Mobile Drawer Menu phục vụ người dùng smartphone tại sự kiện VEC 2026.
* **Triệt Tiêu Tuyệt Đối Tình Trạng Trùng Lặp Bộ Đổi Ngôn Ngữ (Zero-Duplicate Breakpoint)**:
  - Loại bỏ hoàn toàn bộ chọn ngôn ngữ ở thanh Utility Bar phía trên (`h-9 flex`).
  - Tại thanh Navigation chính, phân định dứt khoát điểm ngắt:
    - Màn hình Desktop & Tablet (`>= sm`): Chỉ hiển thị DUY NHẤT 1 dropdown `<LanguageSwitcher variant="header" />` (`hidden sm:inline-block`).
    - Màn hình Điện thoại (`< sm`): Chỉ hiển thị DUY NHẤT 1 ô toggle gọn nhẹ `<LanguageSwitcher variant="utility" />` (`sm:hidden`).
  - Đảm bảo trên mọi độ phân giải màn hình (desktop, tablet, mobile) luôn luôn chỉ tồn tại đúng 1 bộ chuyển đổi ngôn ngữ duy nhất.

### Rule 9.48: Quy Chuẩn Tích Hợp Sản Phẩm Thiết Bị Hàn QUICK 205 & Bảng Phụ Kiện Tiêu Chuẩn (15/09/2026)
* **Thông Tin Kỹ Thuật Sản Phẩm QUICK 205**:
  - Mã định danh (ID): `QUICK-205` / SKU: `TTV-QUI-205`.
  - Tên thiết bị: `Trạm hàn cao tần QUICK 205 ESD (150W)`.
  - Hãng sản xuất: `QUICK (Phân phối chính hãng)` - Danh mục: `Thiết bị hàn công nghiệp / Trạm hàn ESD` (`categorySlug: 'thiet-bi-han'`).
  - Xuất xứ: `Chính Hãng` · Trạng thái: `Sẵn hàng tại kho Hà Nội & Hưng Yên`.
  - Công nghệ & Công suất: Gia nhiệt xoáy cao tần (High-Frequency Eddy Current Heating) 150W bù nhiệt siêu tốc, dải nhiệt 200°C ~ 600°C, độ ổn định ±2°C, điện áp 220V AC / 50Hz, điện trở nối đất < 2Ω, điện áp rò < 2mV, đạt chuẩn chống tĩnh điện ESD Safe.
* **Tài Nguyên Hình Ảnh Studio Thực Tế**:
  - Nguồn ảnh gốc: `D:\Design_hub\01_BRANDS\TT_VINA\ASSETS\1_thiết_bị_hàn_ESD_QUICK_205.png`.
  - Đã sao lưu và tối ưu vào: `public/images/products/quick-205.png` (bản gốc studio trong suốt) và `public/images/products/quick-205.webp` (bản WebP 259KB).
* **Bản Địa Hóa Đa Ngôn Ngữ & Nâng Cấp Giao Diện B2B**:
  - Cập nhật bản dịch tên máy đa ngôn ngữ sang 6 thứ tiếng trong `PRODUCT_NAME_TRANSLATIONS` ([`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts)).
  - Mở rộng từ điển `SPEC_KEY_TRANSLATIONS` dịch chuẩn xác 8 thông số kỹ thuật mới: Công suất định mức, Công nghệ gia nhiệt, Dải nhiệt độ cài đặt, Độ ổn định nhiệt độ, Điện áp hoạt động, Điện trở nối đất đầu mỏ hàn, Điện áp rò đầu mỏ hàn, Tiêu chuẩn chống tĩnh điện.
  - Tối ưu hóa giao diện [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx): Tự động in đậm tiền tố tính năng khi có dấu hai chấm `:`, và hiển thị khối riêng lưới "Phụ Kiện Tiêu Chuẩn Đi Kèm (Standard Included Accessories)" gồm 7 thành phần chi tiết của trạm hàn QUICK 205.

### Rule 9.49: Quy Chuẩn Tự Động Hóa Quản Trị Danh Mục & Bản Địa Hóa Sâu Toàn Diện (Catalog Automation & Deep Localization - 15/09/2026)
* **Đóng Gói Kỹ Năng Quản Trị Danh Mục Hàng Loạt (Skill `protools-catalog-manager`)**:
  - Mã nguồn thực thi: [`scripts/catalog_manager.py`](file:///d:/T&TVina/protools/scripts/catalog_manager.py).
  - Lệnh CLI tự động hóa trong `package.json`:
    - `pnpm catalog:add --input path/to/products.json`: Tự động thêm 1 hoặc N sản phẩm hàng loạt.
    - `pnpm catalog:audit`: Quét toàn bộ danh mục, đối soát ảnh hỏng, kiểm tra 100% độ phủ dịch thuật thông số kỹ thuật.
  - Quy trình xử lý tự động khép kín (End-to-End Pipeline):
    1. Nhận danh sách N sản phẩm từ file JSON.
    2. Đọc ảnh gốc từ đường dẫn máy nội bộ (local asset), tối ưu hóa nén chuẩn WebP chất lượng cao (PIL Pillow, quality 85) lưu vào `public/images/products/<slug>.webp`.
    3. Tự động sinh dữ liệu dịch thuật B2B sang đầy đủ 7 ngôn ngữ (`vi`, `en`, `zh-CN`, `de`, `ko`, `ja`, `th`).
    4. Ghi nối tiếp an toàn vào `PRODUCTS` trong [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và cập nhật từ điển [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
    5. Tự động chạy `pnpm build` xác thực TypeScript và bundling trước khi hoàn tất.
* **Bản Địa Hóa Sâu 100% Cột 1 & Cột 2 Bảng Thông Số Kỹ Thuật (Spec-Sheet Full Parity)**:
  - Bổ sung toàn bộ 13 khóa thông số kỹ thuật còn thiếu vào `SPEC_KEY_TRANSLATIONS`: Chương trình lập trình hẹn giờ, Chức năng, Dự án tiêu biểu, Kích thước (D x R x C), Lượng keo tối thiểu, Model, Trọng lượng, Áp suất khí ra, Áp suất khí vào, Điện áp đầu ra, Điện áp đầu vào, Độ bền uốn, Ứng dụng Robot.
  - Chuẩn hóa từ điển `COMMON_VALUE_TRANSLATIONS` cho 100% các giá trị văn bản kỹ thuật xuất hiện trong catalog: Nhà sản xuất, Xuất xứ, Trạng thái kho, Thiết bị phụ trợ, Robot hàn ABB/KUKA, Dự án Body Shop VinFast Cát Hải, v.v. Các đơn vị đo lường quốc tế (W, V, Hz, bar, ml, s, g, °C, Ω, mV) được giữ nguyên chuẩn kỹ thuật toàn cầu.
* **Bản Địa Hóa Toàn Diện Tính Năng & Phụ Kiện Tiêu Chuẩn (Features & Accessories)**:
  - Chuẩn hóa toàn bộ 16 điểm nổi bật (`ALL_HIGHLIGHTS_TRANSLATIONS`) và 7 phụ kiện tiêu chuẩn (`ALL_ACCESSORIES_TRANSLATIONS`) sang 7 ngôn ngữ.
  - Nâng cấp `translateFeatureItem()` và `translateAccessoryItem()` xử lý trơn tru các chuỗi tính năng dạng tiền tố `Tiền_tố: Diễn_giải`.
  - Loại bỏ hoàn toàn fallback tiếng Việt hoặc mảng tính năng mẫu chung chung, bảo toàn nội dung kỹ thuật chi tiết của từng sản phẩm.
* **Bản Địa Hóa Giao Diện B2B Misumi Pricing Tiers & Case Study Banner**:
- Tại [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), chuyển đổi toàn bộ tiêu đề, nhãn bảng bậc giá số lượng B2B (Q'ty, Pricing Policy, Lead Time, Click hint) và thông điệp chứng thực dự án VinFast Body Shop sang hàm `t()` đa ngôn ngữ.
### Rule 9.50: Quy Chuẩn Tải Nén Ảnh WebP Đa Luồng & Bóc Tách Làm Giàu Dữ Liệu B2B Hàng Loạt (15/09/2026)
* **Đường Ống Tải & Nén Ảnh WebP Tự Động (Multithreaded Sapo Image Pipeline)**:
- Mã nguồn thực thi: [`scripts/download_compress_sapo_images.py`](file:///d:/T&TVina/protools/scripts/download_compress_sapo_images.py).
- Kết quả xử lý thực tế: 6.895 / 6.895 ảnh duy nhất từ CDN Sapo được tải và nén WebP thành công 100% trong 4.5 phút (0 lỗi, tốc độ ~25.3 ảnh/giây với 20 luồng song song).
- Chuẩn nén: WebP Quality 82, kích thước cạnh tối đa 800px (thuật toán LANCZOS), giữ nguyên kênh Alpha trong suốt. Giảm dung lượng từ ~1.5 MB xuống ~37 KB/ảnh (giảm 95%), tổng dung lượng toàn bộ 6.895 ảnh chỉ còn 256.2 MB tại [`public/images/products/sapo/`](file:///d:/T&TVina/protools/public/images/products/sapo/).
- Bảng ánh xạ tập trung: [`public/data/sapo_image_map.json`](file:///d:/T&TVina/protools/public/data/sapo_image_map.json) map 6.897 mã SKU sang đường dẫn file WebP nội bộ.
* **Pipeline Phân Cụm Ngành Hàng & Sinh Mô Tả Kỹ Thuật B2B (Data Enrichment Pipeline)**:
- Mã nguồn thực thi: [`scripts/enrich_sapo_descriptions.py`](file:///d:/T&TVina/protools/scripts/enrich_sapo_descriptions.py).
- Giải quyết triệt để vấn đề 7.477 sản phẩm (99.97%) bị trống mô tả trong kho Sapo:
1. Tự động bóc tách thông số kỹ thuật có sẵn trong chuỗi tên: Quy cách ren (`M12x40`), đường kính ống phi (`PV12` -> 12mm), kích thước băng tải (`2008*85*2mm`), nòng và hành trình xi lanh (`MGPM32-75Z` -> nòng 32mm, hành trình 75mm), điện áp (`220V`, `24V`).
2. Tự động phân loại vào 16 nhóm ngành hàng công nghiệp (Khí nén, Xi lanh, Mũi vít, Kim bơm keo, Bu lông, Băng tải, Cảm biến, Mũi hàn, Rơ le, v.v.).
3. Tự động sinh đoạn văn mô tả chuẩn văn phong B2B công nghiệp kèm tình trạng tồn kho thực tế, đơn vị tính và cam kết giao hàng KCN.
- Bộ dữ liệu hoàn chỉnh lưu độc lập tại [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json) và bản mẫu 25 sản phẩm tại [`public/data/sapo_sample_25_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_sample_25_enriched.json) phục vụ nghiệm thu trước khi tích hợp frontend.
### Rule 9.51: Quy Chuẩn Nhóm Biến Thể Murrplastik (Master-Variant Matrix) & Dashboard Quản Trị Excel B2B (15/09/2026)
* **Mô Hình Dòng Sản Phẩm Cha & Biến Thể Quy Cách (Murrplastik Variantes Standard)**:
- Học hỏi cấu trúc chuẩn từ Murrplastik Shop (`shop.murrplastik.com`), các sản phẩm cùng loại nhưng khác kích cỡ/thông số (ví dụ: `Cút nối góc PV12`, `PV10`, `PV8`) được gom nhóm về cùng một Dòng sản phẩm cha (`Cút nối góc PV (AKS)`) với bảng ma trận biến thể (`variants` array).
- Tự động bóc tách quy cách: Kích thước phi ống (`Phi 12 mm`), ren bu lông (`M12 x 40 mm`), kích thước 3 chiều băng tải/phíp (`2008 x 85 x 2 mm`), nòng và hành trình xi lanh (`Nòng 32mm - Hành trình 75mm`), cỡ kim keo (`16G`), v.v.
- Xuất bản tệp dữ liệu cấu trúc: [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json) (8.2 MB) chứa 6.995 Master Families, mỗi family lưu trữ mã `masterId`, tên gốc, nhóm ngành, mô tả kỹ thuật đại diện, ảnh đại diện và mảng `variants` chi tiết phục vụ render tab Variantes trên giao diện web.
* **Quy Chuẩn Bảng Tính Quản Trị Excel B2B Đa Tương Tác**:
- Cập nhật trực tiếp trên tệp: [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx).
- Cấu trúc tích hợp:
1. **Cột D (Mô tả sản phẩm)**: Cập nhật 100% (7.479 dòng) mô tả kỹ thuật chuẩn B2B công nghiệp.
2. **Cột 34 (Ảnh WebP Local)**: Khởi tạo 6.820 công thức `=HYPERLINK("...", "Xem Ảnh WebP (XX KB)")` cho phép click chuột trực tiếp từ Excel để mở ảnh chất lượng cao trên máy tính Windows.
3. **Cột 35 (Dòng sản phẩm cha - Master Family)**: Phục vụ lọc nhanh nhóm sản phẩm theo họ thiết bị.
4. **Cột 36 (Quy cách biến thể - Variant Specs)**: Bóc tách rõ kích thước/thông số cụ thể.
5. **Cột 37 (Trạng thái sẵn kho B2B)**: Phối màu trực quan (Xanh lá `#E8F5E9` cho 1.045 mặt hàng có sẵn tồn kho; Xám nhạt `#FAFAFA` cho 6.434 mặt hàng đặt theo dự án).
6. **Sheet `TongQuanDanhMuc`**: Bảng điều khiển KPI (Tổng SKU, Số ảnh WebP nén thành công, Số dòng sản phẩm cha, Tỷ lệ sẵn kho) kèm bảng phân bổ theo 16 nhóm ngành hàng công nghiệp.
7. **Cố định hàng tiêu đề (Freeze Panes B2)** và bật bộ lọc tự động (**AutoFilter**) trên toàn bộ bảng tính.
### Rule 9.52: Bài Học Nghiệp Vụ - Tuyệt Đối Không Tự Ý Suy Đoán & Gán Nhãn Hãng OEM Quốc Tế Cho Dữ Liệu Kho Sapo (16/09/2026)
* **Sự Cố & Nhận Định Nghiệp Vụ Từ User**:
- Bộ mẫu thử nghiệm 30 sản phẩm đối soát nguồn OEM quốc tế (SMC, Festo, Musashi, HIOS...) đã được User kiểm tra và xác nhận **không chính xác** với nguồn hàng thực tế phân phối tại kho của công ty.
- **Nguyên nhân gốc rễ**: Các linh kiện cơ khí, khí nén trong kho Sapo (như xi lanh, cút nối, kim keo, đầu vít...) dù mang mã quy cách kích thước tương thích với tiêu chuẩn thông dụng trên thị trường nhưng thực tế được cung cấp bởi các đối tác phụ trợ nội địa (`KHOA KIM`, `LKĐT`, cơ sở gia công...) hoặc là linh kiện thay thế tương đương, không phải sản phẩm chính hãng có chứng chỉ CO/CQ của các tập đoàn quốc tế nói trên. Việc tự ý gán nhãn làm sai lệch định danh hàng hóa và tính pháp lý thương mại của T&T Vina.
* **Hành Động Khắc Phục & Nguyên Tắc Bất Biến**:
1. **Hủy bỏ hoàn toàn**: Đã xóa triệt để bộ tệp thử nghiệm gồm `Mau_Xac_Thuc_Mo_Ta_B2B_30_San_Pham.xlsx`, `public/data/sapo_authentic_pilot_30.json` và script `scripts/enrich_authentic_pilot.py`.
2. **Bảo toàn dữ liệu thực tế**: Mọi mô tả, thông số và nhãn hiệu của 7.479 sản phẩm BẮT BUỘC tôn trọng 100% trường dữ liệu gốc xuất từ Sapo (nhãn hiệu `KHOA KIM`, `LKĐT`, `Techno`, hoặc để ngỏ theo phân phối T&T Vina), tuyệt đối không suy đoán nguồn gốc bên ngoài.
3. **Bộ dữ liệu chuẩn**: Duy trì và vận hành thống nhất trên tệp Excel [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx) và ma trận biến thể [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json).

### Rule 9.53: Quy Chuẩn Song Ngữ Anh - Việt & Trình Chuyển Ngữ Tự Động Hóa Ô Tô (17/09/2026)
* **Bản Địa Hóa Toàn Diện Trang Giải Pháp Ngành Ô Tô Murrplastik (`/murrplastik/industries/san-xuat-o-to/`)**:
  - Giao diện: Tích hợp thanh toggle song ngữ `[ VI | EN ]` với cờ Vector SVG micro chuẩn thương hiệu tại Header (`.lang-switch-group`), tuyệt đối không sử dụng emoji hệ điều hành.
  - Từ điển i18n (`TRANSLATIONS_AUTO`): Bao phủ 100% nội dung trang gồm Header, Biên bản cuộc họp 3 bên (VinFast - Murrplastik - T&T Vina), Khảo sát sự cố đứt gãy cáp tại xưởng Body Shop, Giải pháp cải tạo Dresspack & Trục 6 Rotary Base, Bảng BOM chi tiết 2 dòng Robot ABB IRB 7600/6700, Nhật ký thi công 2 giai đoạn, Thanh so sánh ảnh trước/sau, Video Shorts thực tế, và khối giải đáp 4 câu hỏi FAQ chuẩn kỹ thuật.
  - Tích hợp 3D WebGL Viewer: Cập nhật động dòng trạng thái tải mô hình STL và nút bấm bật/tắt xoay tự động theo ngôn ngữ đã chọn.
  - Cơ chế đồng bộ đa kênh:
    1. `localStorage`: Đồng bộ đồng thời cả 2 khóa `mp_lang` (nội bộ phân vùng Murrplastik) và `tt_vina_locale` (cổng mẹ T&T Vina).
    2. URL Search Param: Hỗ trợ nạp trực tiếp qua tham số `?lang=en` hoặc `?lang=vi` và tự động cập nhật URL bằng `history.replaceState()` không tải lại trang.
    3. Trạng thái DOM: Cập nhật đồng bộ `document.documentElement.lang` và `<title>` của trang.

### Rule 9.54: Quy Chuẩn Quản Lý Tin Tức, Hình Ảnh Chuẩn SEO & Chuyển Đổi Tên Miền Murrplastik (21/09/2026)
* **Quy Chuẩn Tên Ảnh Chuẩn SEO & Cấu Trúc Thư Mục Tài Nguyên**:
  - Tên ảnh chuẩn SEO: Đổi từ `VEC_VIIF2026_Murrplastik_TTVina_booth.jpeg` sang định dạng chuẩn SEO viết thường, phân cách dấu gạch ngang: `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.jpg` và phiên bản nén WebP siêu nhẹ `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.webp`.
  - Quy hoạch đường dẫn tài nguyên: Lưu trữ tập trung tại [`public/murrplastik/assets/images/tin-tuc/`](file:///d:/T&TVina/protools/public/murrplastik/assets/images/tin-tuc/) kèm bản sao tương thích tại thư mục bài viết [`public/murrplastik/tin-tuc/trien-lam-vec-2026/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/trien-lam-vec-2026/).
* **Mở Rộng Hệ Thống Tin Tức & Khối Giải Pháp Ngành Trên Trang Chủ Murrplastik (`#news`)**:
  - Cập nhật thẻ tin tiêu điểm Hero bằng ảnh chụp thực tế gian hàng T&T Vina × Murrplastik tại Triển lãm VEC VIIF 2026 (Mr. Kevin Wong - Murrplastik APAC và đội ngũ kỹ sư).
  - Tích hợp lưới tin tức 2 cột chuẩn responsive (`.home-news-grid`):
    1. **Ngành Thực phẩm & Đồ uống (F&B)**: Liên kết trực tiếp [`/murrplastik/industries/thuc-pham-va-do-uong/`](file:///d:/T&TVina/protools/public/murrplastik/industries/thuc-pham-va-do-uong/index.html) với hình ảnh tấm luồn cáp Inox V4A chuẩn FDA/EHEDG.
    2. **Ngành Sản xuất Ô tô & Robotics**: Liên kết trực tiếp [`/murrplastik/industries/san-xuat-o-to/`](file:///d:/T&TVina/protools/public/murrplastik/industries/san-xuat-o-to/index.html) với hình ảnh giải pháp Dress Pack R-Tec Box cho Robot hàn thân xe.
  - Tích hợp nút xem toàn bộ tin tức chuyển tiếp đến trang Hub tin tức [`/murrplastik/tin-tuc/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/index.html).
* **Triệt Tiêu Hoàn Toàn Tên Miền Cũ `murrplastikvn.com`**:
  - Thay thế 100% các liên kết, schema JSON-LD, thẻ canonical, OpenGraph metadata, nút bấm liên hệ và mô tả mã QR tại trang F&B và tài liệu PDF brochure từ `murrplastikvn.com` sang cổng thông tin chính thức `protools.com.vn/murrplastik`.

### Rule 9.55: Quy Chuẩn Tích Hợp Chứng Chỉ ISO 9001:2015 DEKRA & Báo Cáo Kiểm Định R-Tec Liner 17.75M Chu Kỳ (21/09/2026)
* **Tái Cấu Trúc Khối "#why" (Tại Sao Chọn Chúng Tôi) - Tích Hợp Chứng Chỉ ISO 9001:2015 DEKRA**:
  - Dàn trang 2 cột tương phản đối xứng (Split Showcase): Ảnh chụp chứng chỉ ISO 9001:2015 DEKRA ở bên **TRÁI** (`.why-cert-col`), nội dung cam kết chất lượng & 6 trụ cột dịch vụ lồng ghép ở bên **PHẢI** (`.why-content-col`).
  - Dữ liệu thẩm định pháp lý & chứng chỉ:
    - Tổ chức chứng nhận: **DEKRA Certification GmbH** (Handwerkstraße 15, D-70565 Stuttgart, Đức - `www.dekra-certification.de`).
    - Đơn vị được chứng nhận: **Murrplastik Systemtechnik GmbH** (Dieselstraße 10, 71570 Oppenweiler, Đức).
    - Tiêu chuẩn: **ISO 9001:2015** (Phạm vi: R&D, sản xuất, lắp đặt và thương mại linh kiện kỹ thuật tự động hóa và chế tạo máy).
    - Mã số chứng chỉ: `31297761/9` · Báo cáo đánh giá (Audit Report): `A24091467`.
    - Công nhận quốc tế: **DAkkS** (Deutsche Akkreditierungsstelle `D-ZM-16029-01-00`) & **IAF MLA** (Multilateral Recognition Arrangement).
    - Hiệu lực: Từ ngày `2025-03-13` đến `2028-03-12` · Ký xác thực: `Dr. Rolf Krökel`.
  - **Chính sách bảo mật tài liệu (No Public Download Button)**: Tuyệt đối không cung cấp nút tải file PDF trực tiếp trên giao diện công khai; khách hàng hoặc nhà thầu dự án cần bản sao công chứng liên hệ trực tiếp phòng kỹ thuật T&T Vina.
* **Xuất Bản Bài Viết Kỹ Thuật Báo Cáo Kiểm Định R-Tec Liner (`thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky`)**:
  - Trích xuất dữ liệu gốc từ tệp `Internal Test Report R-Tec Liner.pdf`:
    - Thiết bị thử nghiệm: **R-Tec Liner 550mm EW/EWX 70** (Mã SKU `83693082`).
    - Kỹ sư kiểm định: `H. Thaidigsmann` (Murrplastik Systemtechnik GmbH, Dieselstraße 10, Oppenweiler).
    - Thời gian thử nghiệm: **219 ngày đêm liên tục** (bắt đầu ngày `09/02/2017`, kết thúc ngày `26/09/2017`).
    - Tổng chu kỳ đạt được: **17,755,473 chu kỳ (17.75 triệu chu kỳ)**.
    - Kết quả 8 cấu phần: 7 cấu phần đạt trọn vẹn 17.75 triệu chu kỳ; duy nhất ống luồn dẻo `EWX-PAE 70` (SKU `83182080`) nứt mỏi tại chu kỳ 13.1 triệu.
    - Đánh giá của Ban Quản lý Sản phẩm (Product Management Team): Xếp loại Xuất sắc (**Very Successful**).
  - Tương quan ứng dụng công nghiệp: 17.75 triệu chu kỳ tương đương với **8 – 10 năm vận hành liên tục** tại xưởng Body Shop (hàn thân xe ô tô) VinFast Cát Hải (Hải Phòng) trên các dàn Robot hàn ABB.
  - Vị trí hiển thị: Đặt thành bài viết kỹ thuật chuyên sâu trong News Hub (`/murrplastik/tin-tuc/`), **giữ nguyên sự kiện VEC 2026 làm thẻ tiêu điểm Hero độc quyền**, không bị trộn lẫn hoặc thay thế thẻ Hero.
* **Đa Ngôn Ngữ & Kiểm Thử Tự Động Hóa (i18n & Unit Test Suite)**:
  - Bản địa hóa trọn vẹn 7 ngôn ngữ (`vi`, `en`, `de`, `zh-CN`, `ko`, `ja`, `th`) trong `i18n.js`.
  - Bộ kiểm thử tự động hóa [`scratch_verify_suite.py`](file:///d:/T&TVina/protools/scratch_verify_suite.py) kiểm soát chặt chẽ 6 module: Toàn vẹn asset ảnh WebP/JPG, Cấu trúc HTML đối xứng `#why`, Dữ liệu bài viết kỹ thuật & zero `murrplastikvn.com`, Danh mục News Hub, Độ phủ 7 ngôn ngữ và Quy tắc Responsive CSS. Build Vite (`pnpm build`) đạt 100% thành công.

### Rule 9.56: Quy Chuẩn Tích Hợp Báo Cáo Kiểm Định R-Tec Liner Vào Danh Mục Ngành Ứng Dụng Robot & Vector SVG Thay Thế Toàn Diện Emoji (21/09/2026)
* **Kích Hoạt Thẻ Tương Tác Robot & Tự Động Hóa Trong Khối Ngành Ứng Dụng (`#industries`)**:
  - Chuyển đổi thẻ "Robot & Tự động hóa" (`.ind-item`) trên trang chủ Murrplastik (`public/murrplastik/index.html`) thành thẻ tương tác chủ động `.ind-item.ind-item-active`.
  - Liên kết trực tiếp: Trỏ về bài viết kỹ thuật [`/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html).
  - Huy hiệu định lượng (Badge): Tích hợp nhãn nổi bật `.ind-active-tag` mang nội dung `Report · 17.75M` và mũi tên điều hướng `.ind-arrow` (`→`).
* **Quy Chuẩn Đồ Họa Vector SVG & Triệt Tiêu 100% Emoji Windows (Tuân thủ tuyệt đối Rule 1)**:
  - Thay thế toàn bộ 6 emoji hệ điều hành trong khối `.ind-grid` bằng icon vector SVG kỹ thuật đơn sắc:
    1. **F&B (Thực phẩm & Đồ uống)**: Vector biểu tượng nhà máy công nghiệp.
    2. **Automotive (Sản xuất Ô tô)**: Vector biểu tượng xe ô tô kỹ thuật.
    3. **Robot & Tự động hóa**: Vector biểu tượng đầu robot / tay máy công nghiệp.
    4. **Điện tử**: Vector tia chớp điện năng.
    5. **Năng lượng**: Vector khối pin lưu trữ công nghiệp.
    6. **Máy công cụ**: Vector cơ cấu bánh răng cơ khí chính xác.
  - Hiệu ứng CSS tương tác: Bổ sung lớp `.ind-icon svg` kế thừa stroke màu và tự động chuyển sang màu trắng (`color: var(--white)`) khi hover vào thẻ `.ind-item-active`.
* **Bộ Kiểm Thử Toàn Diện & Build Production**:
  - Cập nhật [`tests/verify_murrplastik_iso_rtec.py`](file:///d:/T&TVina/protools/tests/verify_murrplastik_iso_rtec.py) với Module 7 kiểm tra toàn diện: Liên kết Robot card, class active, tag 17.75M chu kỳ, và xác thực zero emoji Windows trong toàn bộ HTML.
  - Toàn bộ 7 modules kiểm thử đạt 100% PASS và build Vite (`pnpm build`) biên dịch thành công 0 lỗi.

### Rule 9.57: Quy Chuẩn Tái Thiết Kế Biểu Tượng Ngành Ứng Dụng Chuẩn B2B Engineering (/design-taste-frontend - 21/09/2026)
* **Định Hướng Thẩm Mỹ & Ngôn Ngữ Thiết Kế (Design Read)**:
  - Catalog thiết bị công nghiệp tự động hóa B2B Đức, đề cao độ chính xác cơ khí, độ bền cao và tính thẩm mỹ kỹ thuật chống rườm rà (Anti-Slop).
  - Tái lập toàn bộ 6 biểu tượng ngành ứng dụng bằng Vector SVG đơn sắc kỹ thuật chuyên sâu:
    1. **F&B (Thực phẩm & Đồ uống)**: Bình vi sinh inox & chiết rót vô trùng (Sanitary Processing Vessel & Bottle Line chuẩn EHEDG/FDA/IP69K).
    2. **Sản xuất Ô tô (Automotive)**: Khung gầm ô tô kết cấu hàn tự động Body Shop (Chassis & Body-in-White).
    3. **Robot & Tự động hóa**: Cánh tay robot công nghiệp 6 trục (6-Axis Articulated Robot Arm) với khớp xoay và mỏ hàn/kẹp phôi chuyên dụng (chuẩn ABB/KUKA/FANUC).
    4. **Điện tử & Bán dẫn**: Vi mạch bán dẫn tích hợp IC / Microchip & đường dẫn mạch PCB tủ điện PLC.
    5. **Năng lượng & Điện gió**: Tuabin điện gió công nghiệp (Wind Turbine Generator) & hệ thống lưới điện truyền tải.
    6. **Máy công cụ**: Đầu trục chính phay CNC (CNC Milling Spindle & Collet Chuck) kết hợp lưỡi phay xoắn ốc cơ khí chính xác.
* **Cấu Trúc Khung Chứa Micro-Tile Container (`.ind-icon-box`)**:
  - Kích thước 48x48px, bo góc `10px`, nền trung tính `rgba(15,23,42,0.04)`, viền kỹ thuật mỏng 1px `border: 1px solid rgba(15,23,42,0.08)`.
  - Stroke vector chuẩn hóa: `stroke-width="1.8"`, `viewBox="0 0 24 24"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
  - Phản hồi xúc giác (Tactile micro-interactions): Khi hover thẻ active, hộp `.ind-icon-box` chuyển sang nền kính mờ `rgba(255,255,255,0.2)` với viền `rgba(255,255,255,0.38)`, stroke tự động chuyển màu trắng tinh khiết (`#ffffff`), phóng to nhẹ `scale(1.06)`. Thẻ tĩnh có hiệu ứng hover viền nhẹ không gây hiểu nhầm.

### Rule 9.58: Quy Chuẩn Tỉ Lệ Hình Học Cờ Việt Nam & Cơ Chế Khóa Mặc Định Tiếng Việt (21/09/2026)
* **Tỉ Lệ Hình Học Lá Cờ Việt Nam Chuẩn Quốc Gia (Vietnam Flag SVG Standard)**:
  - Khung chuẩn viewBox `0 0 18 12`, tâm đối xứng tuyệt đối tại $(cx, cy) = (9, 6)$.
  - Bán kính đường tròn ngoại tiếp $R = 3.6$ (đúng tỉ lệ 3/10 chiều cao), bán kính nội tiếp $r \approx 1.375$.
  - Tọa độ 10 đỉnh polygon chuẩn xác: `points="9,2.4 9.81,4.89 12.42,4.89 10.31,6.43 11.12,8.91 9,7.38 6.88,8.91 7.69,6.43 5.58,4.89 8.19,4.89"`.
  - Khắc phục hoàn toàn lỗi ngôi sao bị kéo dẹt chạm đáy (`y = 11.68`); ngôi sao mới nổi cân bằng ở tâm, khoảng cách từ đỉnh đáy đến mép dưới lá cờ đạt $3.09$ đơn vị (hơn 25% chiều cao).
  - Đồng bộ 100% trên toàn bộ các tệp: `public/murrplastik/index.html`, `i18n.js`, `FlagIcon.tsx`, và các trang tin tức / ngành ô tô.
* **Cơ Chế Khóa Mặc Định Ngôn Ngữ Tiếng Việt (`currentLang = 'vi'`)**:
  - Khi người dùng truy cập trang chủ `/murrplastik/`, hệ thống mặc định 100% nạp Tiếng Việt (`vi`).
  - Triệt tiêu hiện tượng rò rỉ khóa `tt_vina_locale` từ các ứng dụng React khác trong `localStorage` làm tự động nhảy sang tiếng Anh.
  - Hỗ trợ đổi ngôn ngữ chủ động qua dropdown lưu trữ phiên `sessionStorage.setItem('mp_user_lang', lang)` và tham số URL trực tiếp `?lang=`.

### Rule 9.59: Quy Chuẩn Biểu Tượng Mặt Ngang Ô Tô (Side Profile View) & Trật Tự Phân Đoạn Liên Hệ - FAQ (21/09/2026)
* **Quy Chuẩn Biểu Tượng Ngành Sản Xuất Ô Tô (Automotive Side Profile Iconography)**:
  - Vị trí: Khối `.ind-grid` tại [`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html).
  - Thay thế góc nhìn trực diện (frontal view) bằng hình chiếu cạnh mặt ngang (side profile view) tiêu chuẩn kỹ thuật công nghiệp B2B.
  - Tọa độ hình học vector 24x24 (`stroke-width="1.8"`, `stroke-linecap="round"`, `stroke-linejoin="round"`):
    - Khung thân xe khí động học: `d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"`.
    - Trục bánh xe sau & trước: 2 vòng tròn `<circle cx="7" cy="17" r="2"></circle>` và `<circle cx="17" cy="17" r="2"></circle>`.
    - Gầm xe liên kết giữa 2 bánh: `d="M9 17h6"`.
    - Đường gờ kính sườn (Beltline) và trụ cửa giữa (B-pillar): `d="M5 11h14"` và `d="M12 6v5"`.
    - Đảm bảo nhận diện tức thì kiểu dáng ô tô công nghiệp từ mọi khoảng cách và kích thước hiển thị.
* **Tối Ưu Trật Tự Dàn Trang Khối Liên Hệ & Hỏi Đáp Thường Gặp (Layout Flow Sequence)**:
  - Cấu trúc trước đây: `#news` -> `#faq` (nền tối `#141414`) -> `#contact` (nền sáng `#ffffff`) -> `footer` (nền tối `#111111`) tạo hiệu ứng zigzag màu sắc gây ngắt quãng trải nghiệm thị giác.
  - Trật tự mới chuẩn hóa: `#news` -> `#contact` (nền sáng tiếp nối tự nhiên sau tin tức) -> `#faq` (nền tối tạo nhịp nghỉ đệm) -> `footer` (nền tối chuyển tiếp liền mạch).
  - Khối mã cấu trúc Google `JSON-LD FAQPage` được di chuyển đồng bộ liền kề phía sau `<section id="faq">`, bảo toàn 100% dữ liệu Rich Snippets phục vụ SEO.
  - Tự động kiểm chứng toàn diện qua bộ test [`tests/verify_murrplastik_iso_rtec.py`](file:///d:/T&TVina/protools/tests/verify_murrplastik_iso_rtec.py) với 8/8 modules đạt chuẩn PASS.

### Rule 9.60: Quy Chuẩn Cờ Hàn Quốc Chuẩn Hình Học Thái Cực (Taegeukgi), Tin Tức R-Tec Liner Trang Chủ & Tối Ưu Khoảng Cách Đọc (21/09/2026)
* **Quy Chuẩn Hình Học Cờ Hàn Quốc Chuẩn Vector SVG (South Korea Taegeukgi Standard)**:
  - Khung chuẩn viewBox `0 0 18 12`, tâm đối xứng tuyệt đối tại (cx, cy) = (9, 6).
  - Vòng tròn Thái Cực (Taegeuk) chuẩn phương ngang: Bán kính lớn R = 2.6, bán kính nhỏ r = 1.3. Phần nửa trên màu đỏ (`#CD2E3A`), phần nửa dưới màu xanh dương (`#0047A0`), tiếp tuyến uốn lượn mượt mà chuẩn quốc gia, khắc phục triệt để lỗi xoay dọc 90° trước đây.
  - Bốn quẻ Càn - Khôn - Khảm - Ly (4 Trigrams) tại 4 góc chuẩn xác (khoảng cách tâm d = 4.5, góc xoay ±56.3° vuông góc với 2 đường chéo ±33.7°):
    - Càn (Geon - Góc trên bên trái): 3 vạch liền (☰).
    - Khôn (Gon - Góc dưới bên phải): 3 vạch đứt (☷).
    - Khảm (Gam - Góc trên bên phải): vạch đứt - vạch liền - vạch đứt (☵).
    - Ly (Ri - Góc dưới bên trái): vạch liền - vạch đứt - vạch liền (☲).
  - Đồng bộ chuẩn xác trên toàn bộ 6 tệp: [`src/components/FlagIcon.tsx`](file:///d:/T&TVina/protools/src/components/FlagIcon.tsx), [`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html), [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js), [`public/murrplastik/tin-tuc/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/index.html), [`public/murrplastik/tin-tuc/trien-lam-vec-2026/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/trien-lam-vec-2026/index.html), [`public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html).
* **Đưa Tin Báo Cáo R-Tec Liner Vào Lưới Tin Tức Trang Chủ Murrplastik (`#news`)**:
  - Thêm thẻ tin tức thứ 3 về Thử nghiệm độ bền R-Tec Liner (`murrplastik-r-tec-liner-17-trieu-chu-ky-thumbnail.webp`) vào `.home-news-grid`.
  - Nâng cấp lưới hiển thị `.home-news-grid` từ 2 cột lên 3 cột cân đối (`grid-template-columns: repeat(3, 1fr); gap: 1.75rem;`), tự động co giãn về 1 cột trên thiết bị di động.
* **Tinh Gọn Tiêu Đề Badge & Tối Ưu Khoảng Cách Đệm Đọc (Reading Flow & Spacing)**:
  - Bỏ từ "BÁO CÁO" trong huy hiệu trạng thái: Chuẩn hóa thành `THỬ NGHIỆM KỸ THUẬT · 17.75M CHU KỲ` trên bài viết và 7 ngôn ngữ trong từ điển `i18n.js`.
  - Giảm khoảng cách đệm dọc `.news-content-section` từ `4rem 0` xuống `2.25rem 0 4rem`, giảm margin đỉnh của `.tech-metric-grid` từ `2.5rem` xuống `0.75rem`, rút ngắn tổng khoảng trống đầu bài từ ~104px xuống ~48px, tạo nhịp đọc tự nhiên, liền mạch.
* **Bộ Kiểm Thử & Kiểm Định Tự Động (9/9 Modules Passed)**:
  - Nâng cấp [`tests/verify_murrplastik_iso_rtec.py`](file:///d:/T&TVina/protools/tests/verify_murrplastik_iso_rtec.py) với Module 9 kiểm tra toàn diện hình học cờ Hàn Quốc, sự hiện diện của card tin R-Tec Liner tại trang chủ, tiêu đề badge tinh gọn và CSS padding tối ưu. 100% kiểm thử đạt chuẩn PASS.
### Rule 9.61: Đóng Gói & Phát Hành Production Toàn Diện Murrplastik & Kiểm Chứng Trực Tiếp Live HTTP (21/09/2026)
* **Quy Trình Phát Hành Production Gốc (`deploy_production_root.py`)**:
  - Đóng gói bundle tĩnh qua Vite (`pnpm build`).
  - Đồng bộ 61 tệp tĩnh mới lên máy chủ FTP Mắt Bão (`public_html`), bỏ qua 139 file media nhị phân trùng khớp để tối ưu thời gian deploy.
  - Tự động áp dụng quyền `SITE CHMOD 644` trước khi ghi đè, chống lỗi `553 Permission Denied`.
  - Cấu hình `.htaccess` tại root và phân vùng con `/murrplastik/`, đảm bảo LiteSpeed phục vụ trực tiếp static files và SPA pushState không xung đột.
* **Biên Bản Kiểm Chứng Live HTTP Thực Tế Trên Production (100% PASS)**:
  1. `https://protools.com.vn/murrplastik/` (HTTP 200):
     - Chứng chỉ ISO 9001:2015 DEKRA bên trái, 6 cam kết chất lượng bên phải (`.why-cert-col`, `.why-content-col`), bảo mật không public nút tải PDF.
     - Khối `#industries`: Thẻ Robot & Tự động hóa active trỏ về bài kiểm định R-Tec Liner kèm badge `Report · 17.75M`. 6 micro-tiles Vector SVG kỹ thuật (`.ind-icon-box`), 0 Windows emojis, icon ô tô mặt ngang.
     - Khối `#news`: 3 cột tin tức cân đối (F&B, Robot ô tô, Báo cáo R-Tec Liner).
     - Trật tự phân đoạn: `#contact` đứng trước `#faq`.
     - Đồ họa cờ: Cờ Việt Nam tâm $(9, 6)$ cân đối; Cờ Hàn Quốc chuẩn Thái Cực đỏ trên/xanh dưới ngang và 4 quẻ Càn-Khôn-Khảm-Ly. Mặc định vào trang nạp Tiếng Việt (`vi`).
  2. `https://protools.com.vn/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/` (HTTP 200):
     - Badge/Title: `THỬ NGHIỆM KỸ THUẬT · 17.75M CHU KỲ` (đã bỏ chữ "BÁO CÁO").
     - Khoảng cách đệm `.news-content-section` thu gọn còn `2.25rem 0 4rem`, giải phóng khoảng trống đầu bài.
     - Dữ liệu kiểm định 17.75M chu kỳ, 2 trang scan chứng chỉ gốc hiển thị sắc nét.
  3. Tài nguyên ảnh & CSS/JS (HTTP 200):
     - 100% 6 file ảnh WebP/JPG mới tải thành công (HTTP 200).
     - CSS và từ điển i18n 7 ngôn ngữ đồng bộ hoàn hảo.
